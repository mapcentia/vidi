/*
 * @author     Alexander Shumilov
 * @copyright  2013-2018 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

'use strict';

const { QUEUE_PROCESSING_INTERVAL, ONLINE_STATUS_CHECK_LIMIT, QUEUE_STORE_NAME, ADD_REQUEST, UPDATE_REQUEST, DELETE_REQUEST, LOG, QUEUE_DEFAULT_PKEY } = require('./constants');
const QueueStorage = require('./QueueStorage');

/**
 * Returns the lightweight metadata projection of a full queue item.
 * This is the only shape that lives in the in-memory index — heavy payloads
 * inside item.feature.features[0].properties stay in IndexedDB.
 */
function projectMetadata(id, fullItem) {
    const pkeyField = (fullItem.meta && fullItem.meta.pkey) ? fullItem.meta.pkey : QUEUE_DEFAULT_PKEY;
    const pkeyValue = fullItem.feature?.features?.[0]?.properties?.[pkeyField];
    return {
        id,
        type: fullItem.type,
        table: (fullItem.meta?.f_table_schema || '') + '.' + (fullItem.meta?.f_table_name || ''),
        pkeyField,
        pkey: pkeyValue,
        skip: fullItem.skip === true,
        serverErrorMessage: fullItem.serverErrorMessage || null,
        serverErrorType: fullItem.serverErrorType || null
    };
}

/**
 * Returns a fresh id string. Counter is monotonic within a tab session, and
 * combined with Date.now() to avoid collisions across sessions if items
 * persist across page reloads.
 */
let _idCounter = 0;
function generateId() {
    _idCounter += 1;
    return `${Date.now().toString(36)}-${_idCounter.toString(36)}`;
}

/*
Specifies if the first and only element of the queue should
be processed without timeout.
*/
const PROCESS_FIRST_ELEMENT_IMMEDIATELY = false;

let queueStateUndefined = true;

/*
Is set to false when the page protocol is non-HTTPS, so the online status will
definitely not be retrieved until page reload
*/
let onlineStatusCanBeRetrievedAtSomePoint = true;

let attemptsToCheckOnlineStatus = 0;

/**
 * FIFO queue abstraction. Queue items are stored
 * in browser storage and do not depend on page reload
 */
class Queue {

    static get ADD_REQUEST() { return ADD_REQUEST; }
    static get UPDATE_REQUEST() { return UPDATE_REQUEST; }
    static get DELETE_REQUEST() { return DELETE_REQUEST; }

    constructor(processor) {
        if (!processor) {
            throw new Error('Queue: no processor was specified');
        }

        let _self = this;
        this._terminated = false;
        this._online = false;
        this._locked = false;
        this._onUpdateListener = () => {};
        // Lightweight metadata index in RAM. Full items live in this._storage.
        this._metadataIndex = [];
        this._storage = new QueueStorage(this._getCurrentDatabaseAndSchema());
        this._processor = processor;
        this._lastStats = false;

        const processQueue = () => {
            if (LOG) console.log(`Queue interval, total items in queue: ${_self._metadataIndex.length}, locked: ${_self._locked}`);

            const scheduleNextQueueProcessingRun = () => {
                if (_self._terminated !== true) {
                    setTimeout(() => {
                        processQueue();
                    }, QUEUE_PROCESSING_INTERVAL);
                }
            };

            if (queueStateUndefined) {

                if (LOG) console.log(`Queue: last actual state is retrieved, reloading layers`);

                queueStateUndefined = false;
                _self._onUpdateListener(_self._generateCurrentStatistics(), true);
            } else {
                _self._onUpdateListener(_self._generateCurrentStatistics());
            }

            $.ajax({
                method: 'GET',
                url: '/connection-check.ico'
            }).done((data, textStatus, jqXHR) => {
                if (jqXHR.statusText === 'ONLINE') {
                    if (_self._online === false) {
                        _self._online = true;

                        if (LOG) console.log(`Queue: app is back online`);

                        _self._onUpdateListener(_self._generateCurrentStatistics());
                    }
                } else if (jqXHR.statusText === 'OFFLINE') {
                    if (_self._online) {
                        _self._online = false;

                        if (LOG) console.log(`Queue: app went offline`);

                        _self._onUpdateListener(_self._generateCurrentStatistics());
                    }
                } else {
                    if (typeof location !== 'undefined' && location && location.protocol.indexOf('https') === -1) {
                        if (onlineStatusCanBeRetrievedAtSomePoint) {
                            console.warn(`Unable to determine the online status (the service worker is not registered)`);
                            onlineStatusCanBeRetrievedAtSomePoint = false;
                        }
                    } else if (textStatus === `success`) {
                        attemptsToCheckOnlineStatus++;
                        if (attemptsToCheckOnlineStatus <= ONLINE_STATUS_CHECK_LIMIT) {
                            console.warn(`Unable to determine the online status (connection check is not managed by service worker yet), attempt ${attemptsToCheckOnlineStatus} of ${ONLINE_STATUS_CHECK_LIMIT}`);
                        } else if (attemptsToCheckOnlineStatus === (ONLINE_STATUS_CHECK_LIMIT + 1)) {
                            console.warn(`Limit of connection check attempts exceeded, please reload page to activate service worker`);
                        }
                    } else {
                        console.warn(`Unable to determine the online status (the service worker is starting up)`);
                    }
                }
            }).always(() => {
                if (_self._metadataIndex.length > 0 && _self._locked === false) {
                    _self._locked = true;

                    if (LOG) console.log(`Queue: not empty, trying to push changes`);

                    _self._dispatch().then(() => {
                        _self._locked = false;
                        scheduleNextQueueProcessingRun();
                    }).catch(error => {
                        _self._locked = false;
                        scheduleNextQueueProcessingRun();
                    });
                } else {
                    scheduleNextQueueProcessingRun();
                }
            });
        };

        this._readyPromise = this._restoreState().then(() => {
            processQueue();
        });
    }

    /**
     * Eliminates items with same identifier in the queue.
     *
     * This is needed to ensure that queue does not have more than
     * one data manipulation with any feature. Operates on the
     * metadata index, loading full items from storage only when a
     * pair needs to be resolved.
     *
     * @returns {Promise<void>}
     */
    async _eliminateItemsWithSameIdentifier() {
        // Group metadata entries by (table, pkey) to find duplicates.
        const groups = new Map();
        for (const m of this._metadataIndex) {
            const key = `${m.table}::gid_${m.pkey}`;
            if (!groups.has(key)) groups.set(key, []);
            groups.get(key).push(m);
        }

        let mutated = false;

        for (const [, group] of groups) {
            if (group.length === 1) continue;
            if (group.length > 2) {
                throw new Error('Queue: more than 2 queue items with same primary key');
            }

            // Exactly 2 items with the same primary key.
            const firstMd = group[0];
            const lastMd = group[1];
            const itemPrimaryKey = firstMd.pkey;

            // Merging two items in one, leaving only the initial one
            let itemsHaveToBeMerged = false;

            // Deleting both items
            let itemsHaveToBeDeleted = false;

            // Leaving only the latest item (as DELETE request)
            let itemsHaveToBeCleaned = false;

            // Guards
            if (firstMd.type === UPDATE_REQUEST && itemPrimaryKey < 0) {
                throw new Error(`Queue: cannot update item that does not exists on backend`);
            }

            if (firstMd.type === ADD_REQUEST && lastMd.type === UPDATE_REQUEST ||
                firstMd.type === UPDATE_REQUEST && lastMd.type === UPDATE_REQUEST) {
                itemsHaveToBeMerged = true;
            } else if (firstMd.type === ADD_REQUEST && lastMd.type === DELETE_REQUEST ||
                firstMd.type === UPDATE_REQUEST && lastMd.type === DELETE_REQUEST) {
                // Item is virtual, delete everything that is related to it
                if (itemPrimaryKey > 0) {
                    itemsHaveToBeCleaned = true;
                } else {
                    itemsHaveToBeDeleted = true;
                }
            } else {
                throw new Error(`Queue: erroneous queue item pairs, ${firstMd.type} followed by ${lastMd.type}`);
            }

            const initialNumberOfItemsInQueue = this._metadataIndex.length;

            // Load full items now that we know we need to act on them.
            const initialFull = await this._storage.loadItem(firstMd.id);
            const latestFull = await this._storage.loadItem(lastMd.id);
            if (!initialFull || !latestFull) continue;

            // Remove both metadata entries; we'll re-insert one if needed.
            this._metadataIndex = this._metadataIndex.filter(m => m.id !== firstMd.id && m.id !== lastMd.id);
            await this._storage.deleteItem(firstMd.id);
            await this._storage.deleteItem(lastMd.id);

            if (itemsHaveToBeMerged) {

                if (LOG) console.log(`Queue: more than one queue item with primary key ${itemPrimaryKey}, items have to be merged`);

                // Keep first item's type; reset skip; take latest geometry and properties.
                const mergedFull = {
                    ...initialFull,
                    skip: false,
                    feature: {
                        ...initialFull.feature,
                        features: [{
                            ...initialFull.feature.features[0],
                            geometry: latestFull.feature.features[0].geometry,
                            properties: latestFull.feature.features[0].properties
                        }]
                    }
                };
                const newId = generateId();
                await this._storage.saveItem(newId, mergedFull);
                this._metadataIndex.push(projectMetadata(newId, mergedFull));

            } else if (itemsHaveToBeDeleted) {

                if (LOG) console.log(`Queue: items with primary key ${itemPrimaryKey} have to be deleted`);
                // Both already deleted above — nothing more to do.

            } else if (itemsHaveToBeCleaned) {

                if (LOG) console.log(`Queue: any changes for primary key ${itemPrimaryKey} were cleared, item has to be deleted`);

                // Keep only the latest item (the DELETE request) as-is.
                const newId = generateId();
                await this._storage.saveItem(newId, latestFull);
                this._metadataIndex.push(projectMetadata(newId, latestFull));

            } else {
                throw new Error(`Queue: no action was selected`);
            }

            if (LOG) console.log(`Queue: queue items with primary key ${itemPrimaryKey} were managed, (${initialNumberOfItemsInQueue} queue items before, ${this._metadataIndex.length} now)`);

            mutated = true;
        }

        if (mutated) {
            await this._storage.saveIndex(this._metadataIndex.map(m => m.id));
            this._onUpdateListener(this._generateCurrentStatistics());
        }
    }

    /**
     * Returns current items.
     *
     * Structurally-shallow clone: each item, its feature wrapper, and the inner
     * features array are shallow-copied so callers can safely mutate the wrappers
     * (e.g. transformResponseHandler sets `feature.features[0].meta = {}`)
     * without affecting the queue itself. The `properties` object — and the
     * heavy bytea payloads inside it — is referenced, not duplicated.
     */
    getItems() {
        return this._queue.map(item => {
            if (!item) return item;
            const cloned = {...item};
            if (item.feature) {
                const featureCloned = {...item.feature};
                if (Array.isArray(item.feature.features)) {
                    featureCloned.features = item.feature.features.map(f => f ? {...f} : f);
                }
                cloned.feature = featureCloned;
            }
            return cloned;
        });
    }

    /**
     * Generates current queue statistics by layer
     */
    _generateCurrentStatistics() {
        let stats = {
            online: this._online
        };

        for (let key in this._queue) {
            let currentItem = this._queue[key];
            if (currentItem.meta && currentItem.meta.f_table_schema && currentItem.meta.f_table_name && currentItem.meta.f_geometry_column) {
                let layer = `${currentItem.meta.f_table_schema}.${currentItem.meta.f_table_name}.${currentItem.meta.f_geometry_column}`;
                if (('' + layer) in stats === false) {
                    stats[layer] = {
                        failed: {
                            ADD: 0,
                            UPDATE: 0,
                            DELETE: 0
                        },
                        rejectedByServer: {
                            ADD: 0,
                            UPDATE: 0,
                            DELETE: 0,
                            items: []
                        }
                    };
                }

                let category = 'failed';
                if (currentItem.skip) {
                    category = 'rejectedByServer';
                    stats[layer][category].items.push(Object.assign({}, currentItem));
                }

                switch (currentItem.type) {
                    case ADD_REQUEST:
                        stats[layer][category].ADD++;
                        break;
                    case UPDATE_REQUEST:
                        stats[layer][category].UPDATE++;
                        break;
                    case DELETE_REQUEST:
                        stats[layer][category].DELETE++;
                        break;
                }
            } else {
                throw new Error('Queue: invalid meta object');
            }
        }

        this._lastStats = stats;
        return stats;
    }

    /**
     * Reports current queue state to listener
     */
    setOnUpdate(listener) {
        this._onUpdateListener = listener;
    }

    /**
     * Resolves once initial state has been restored from IndexedDB.
     */
    ready() {
        return this._readyPromise;
    }

    getMetadataItems() {
        // Defensive shallow clone so callers can't mutate the index.
        return this._metadataIndex.map(m => ({...m}));
    }

    getMetadataLength() {
        return this._metadataIndex.length;
    }

    /**
     * Async: returns the full queue item for a given id, or null.
     */
    getFullItem(id) {
        return this._storage.loadItem(id);
    }

    /**
     * Async: returns full items for all current metadata entries, in order.
     * Use sparingly — this re-hydrates every payload.
     */
    async getFullItems() {
        const result = [];
        for (const m of this._metadataIndex) {
            const full = await this._storage.loadItem(m.id);
            if (full) result.push(full);
        }
        return result;
    }

    /**
     * Restores previous queue state from browser storage
     */
    async _restoreState() {
        if (LOG) console.log('Queue: restoring state');
        // Migrate legacy single-blob format into per-item records.
        await this._storage.migrateLegacyBlob(generateId);
        const ids = await this._storage.loadIndex();
        const index = [];
        for (const id of ids) {
            const fullItem = await this._storage.loadItem(id);
            if (fullItem) index.push(projectMetadata(id, fullItem));
        }
        this._metadataIndex = index;
        if (LOG) console.log(`Queue: restored ${index.length} items`);
    }

    _getCurrentDatabaseAndSchema() {
        let database = `default`;
        let schema = `default`;
        if (typeof window !== 'undefined' && window && window.vidiConfig && window.vidiConfig.appDatabase && window.vidiConfig.appSchema) {
            database = window.vidiConfig.appDatabase;
            schema = window.vidiConfig.appSchema;
        }

        return { database, schema };
    }

    /**
     * Deprecated. Per-item writes happen inside push/remove/setSkip directly.
     * Kept as a no-op so older internal callers don't crash before they're updated.
     */
    _saveState() {}

    _getOldestNonSkippedItem(offset = 0) {
        for (let i = offset; i < this._metadataIndex.length; i++) {
            if (!this._metadataIndex[i].skip) {
                return {metadata: this._metadataIndex[i], index: i};
            }
        }
        return null;
    }

    /**
     * Iterate over queue and perform request in FIFO manner
     *
     * @param {Function} dispatcher Function that perfroms actual request
     */
    _dispatch(emitQueueStateChangeBeforeCommit = true) {
        let _self = this;

        let queueSearchOffset = -1;

        let result = new Promise((resolve, reject) => {
            const processOldestItem = () => {
                queueSearchOffset++;

                if (LOG) console.log('Queue: before processing oldest item, run:', queueSearchOffset);

                if (queueSearchOffset > 0 || emitQueueStateChangeBeforeCommit) {
                    _self._onUpdateListener(_self._generateCurrentStatistics());
                }

                _self._saveState();

                // The inner promise drives the loop: localResolve() → next iteration,
                // localReject() → propagates out. When there are no items left we call
                // the outer resolve() and leave the inner promise pending so the loop stops.
                new Promise((localResolve, localReject) => {
                    let itemToProcessData = _self._getOldestNonSkippedItem(queueSearchOffset);
                    if (itemToProcessData === null) {

                        if (LOG) console.log('Queue: no queue items to process');

                        resolve();
                        // Inner promise stays pending — loop stops.
                        return;
                    }

                    // Load the full item from storage on demand.
                    _self._storage.loadItem(itemToProcessData.metadata.id).then(oldestNonSkippedItem => {
                        if (!oldestNonSkippedItem) {
                            // Item disappeared from storage (concurrent deletion) — advance offset
                            // and continue the loop without processing.
                            if (LOG) console.log('Queue: item disappeared from storage, skipping', itemToProcessData.metadata.id);
                            localResolve();
                            return;
                        }

                        if (LOG) console.log('Queue: processing oldest non-skipped item', oldestNonSkippedItem);

                        // Duplicate primary-key guard using the metadata index.
                        let numberOfItemsWithCurrentPrimaryKey = 0;
                        for (const m of _self._metadataIndex) {
                            if (m.pkey === itemToProcessData.metadata.pkey && m.table === itemToProcessData.metadata.table) {
                                numberOfItemsWithCurrentPrimaryKey++;
                            }
                            if (numberOfItemsWithCurrentPrimaryKey > 1) {
                                throw new Error('Queue: multiple queue element with the same primary key');
                            }
                        }

                        _self._processor(oldestNonSkippedItem, _self).then(async () => {
                            // Remove the processed item from the index and storage.
                            const processedId = itemToProcessData.metadata.id;
                            await _self._storage.deleteItem(processedId);
                            _self._metadataIndex = _self._metadataIndex.filter(m => m.id !== processedId);
                            await _self._storage.saveIndex(_self._metadataIndex.map(m => m.id));

                            if (LOG) console.log('Queue: item was processed');
                            if (LOG) console.log('Queue: items left to process', (_self._metadataIndex.length - queueSearchOffset));

                            let oldestNonSkippedItemData = _self._getOldestNonSkippedItem(queueSearchOffset);

                            _self._saveState();
                            if (oldestNonSkippedItemData) {
                                // There are still items to process
                                _self._onUpdateListener(_self._generateCurrentStatistics());
                                localResolve();
                            } else {
                                // No items in queue or all of them are skipped
                                _self._onUpdateListener(_self._generateCurrentStatistics(), true);
                                resolve();
                            }
                        }).catch(async error => {
                            if (LOG) console.log('Queue: item was not processed', oldestNonSkippedItem);
                            if (LOG) console.log('Queue: stopping processing, items left', _self._metadataIndex.length);

                            if (error && error.rejectedByServer) {

                                if (LOG) console.log('Queue: item was rejected by server, setting as skipped', itemToProcessData.metadata.id);

                                // Update metadata entry and persist the skip flag to storage.
                                const skippedId = itemToProcessData.metadata.id;
                                const skippedFull = await _self._storage.loadItem(skippedId);
                                if (skippedFull) {
                                    skippedFull.skip = true;
                                    if (error.serverErrorMessage) {
                                        skippedFull.serverErrorMessage = error.serverErrorMessage;
                                    }
                                    if (error.serverErrorType) {
                                        skippedFull.serverErrorType = error.serverErrorType;
                                    }
                                    await _self._storage.saveItem(skippedId, skippedFull);
                                    const md = _self._metadataIndex.find(m => m.id === skippedId);
                                    if (md) {
                                        md.skip = true;
                                        md.serverErrorMessage = skippedFull.serverErrorMessage || null;
                                        md.serverErrorType = skippedFull.serverErrorType || null;
                                    }
                                }

                                _self._onUpdateListener(_self._generateCurrentStatistics(), true);
                                _self._saveState();

                                // The current item is skipped, the queue tries to push other elements
                                localResolve();
                            } else {
                                _self._onUpdateListener(_self._generateCurrentStatistics());
                                _self._saveState();

                                // Network or backend are probably down, no point in tying further
                                localReject();
                            }
                        });
                    }).catch(localReject);
                }).then(processOldestItem.bind(null)).catch(reject);
            };

            processOldestItem();
        });

        return result;
    }

    /**
     * 
     * @param {*} item 
     * 
     * @return {Promise}
     */
    pushAndProcess(item) {

        if (LOG) console.log('Queue: pushAndProcess', item);

        if (!('type' in item) || [ADD_REQUEST, UPDATE_REQUEST, DELETE_REQUEST].indexOf(item.type) === -1) {
            throw new Error('Queue: item has to have a certain type');
        }

        // Synchronous pre-validation: detect invalid type-pair combinations and
        // the "update non-existent" guard before any async work.  This preserves
        // the original synchronous-throw behaviour that callers and tests rely on.
        {
            const pkeyField = (item.meta && item.meta.pkey) ? item.meta.pkey : QUEUE_DEFAULT_PKEY;
            const pkeyValue = item.feature?.features?.[0]?.properties?.[pkeyField];
            const table = (item.meta?.f_table_schema || '') + '.' + (item.meta?.f_table_name || '');
            const existing = this._metadataIndex.find(m => m.table === table && m.pkey === pkeyValue);
            if (existing) {
                if (existing.type === UPDATE_REQUEST && pkeyValue < 0) {
                    throw new Error(`Queue: cannot update item that does not exists on backend`);
                }
                const initial = existing.type;
                const latest = item.type;
                const isMerge = (initial === ADD_REQUEST && latest === UPDATE_REQUEST) ||
                                (initial === UPDATE_REQUEST && latest === UPDATE_REQUEST);
                const isCleanOrDelete = (initial === ADD_REQUEST && latest === DELETE_REQUEST) ||
                                       (initial === UPDATE_REQUEST && latest === DELETE_REQUEST);
                if (!isMerge && !isCleanOrDelete) {
                    throw new Error(`Queue: erroneous queue item pairs, ${initial} followed by ${latest}`);
                }
            }
        }

        let _self = this;

        // push() and _eliminateItemsWithSameIdentifier() are now async.
        // We chain them so the queue is consistent before dispatching.
        return this.push(item)
            .then(() => _self._eliminateItemsWithSameIdentifier())
            .then(() => new Promise((resolve, reject) => {
                /*
                    If there is only one element in the queue (the one that
                    was inserted just now) then try to process it and return
                    result back. If there are more than one element in the queue,
                    then older elements have to be processed first.
                */

                if (_self._metadataIndex.length === 1 && _self._locked === false && PROCESS_FIRST_ELEMENT_IMMEDIATELY) {

                    if (LOG) console.log('Queue: processing pushAndProcess item right away');

                    _self._locked = true;
                    _self._dispatch(false).then(() => {
                        _self._locked = false;

                        resolve();
                    }).catch(error => {
                        _self._locked = false;

                        if (LOG) console.warn('Request failed and was postponed');
                        resolve();
                    });
                } else {

                    if (LOG) console.log('Queue: queue is busy', _self._metadataIndex.length, _self._locked);

                    _self._onUpdateListener(_self._generateCurrentStatistics());
                    resolve();
                }
            }));
    }

    /**
     * Add item to the queue.
     * The metadata index is updated synchronously before the first await so that
     * callers can rely on the new item being visible in _metadataIndex immediately
     * (e.g. for duplicate-detection in pushAndProcess).
     */
    async push(item) {
        const id = generateId();
        // Eagerly register the item in the metadata index so that synchronous
        // callers (like pushAndProcess's pre-validation) can see it right away.
        this._metadataIndex.push(projectMetadata(id, item));
        await this._storage.saveItem(id, item);
        await this._storage.saveIndex(this._metadataIndex.map(m => m.id));
    }

    /**
     * Removes all queue items with specific primary key
     *
     * @param {Array<Number>} primaryKeys
     */
    async removeByPrimaryKeys(primaryKeys = []) {
        const initial = this._metadataIndex.length;
        const targets = new Set(primaryKeys);
        const toDelete = this._metadataIndex.filter(m => targets.has(m.pkey)).map(m => m.id);
        for (const id of toDelete) {
            await this._storage.deleteItem(id);
        }
        this._metadataIndex = this._metadataIndex.filter(m => !toDelete.includes(m.id));
        if (this._metadataIndex.length !== (initial - primaryKeys.length)) {
            throw new Error('Queue: some elements have not been deleted');
        }
        await this._storage.saveIndex(this._metadataIndex.map(m => m.id));
        this._onUpdateListener(this._generateCurrentStatistics());
    }

    /**
     * Makes queue try to push skipped items as well
     */
    async resubmitSkippedFeatures() {
        for (const m of this._metadataIndex) {
            if (m.skip) {
                const fullItem = await this._storage.loadItem(m.id);
                if (fullItem) {
                    fullItem.skip = false;
                    await this._storage.saveItem(m.id, fullItem);
                    m.skip = false;
                }
            }
        }
        this._onUpdateListener(this._generateCurrentStatistics());
    }

    /**
     * Removes all requests by layer identifier
     *
     * @param {String} layerId
     */
    async removeByLayerId(layerId) {
        if (!layerId) throw new Error(`Queue: layer identifier can not be empty`);
        const toDelete = this._metadataIndex
            .filter(m => m.table === layerId)
            .map(m => m.id);
        for (const id of toDelete) {
            await this._storage.deleteItem(id);
        }
        this._metadataIndex = this._metadataIndex.filter(m => !toDelete.includes(m.id));
        await this._storage.saveIndex(this._metadataIndex.map(m => m.id));
        this._onUpdateListener(this._generateCurrentStatistics(), true);
    }

    /**
     * Returns queue length
     * 
     * @return {Number}
     */
    get length() {
        return this._metadataIndex.length;
    }

    /**
     * Terminates the forever running loop
     */
    terminate() {
        this._terminated = true;

    }
};

module.exports = Queue;
