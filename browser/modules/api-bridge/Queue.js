'use strict';

const QUEUE_PROCESSING_INTERVAL = 5000;
const QUEUE_STORE_NAME = 'vidi-feature-management-queue';

const LOG = false;

// Types of queue items
const ADD_REQUEST = 0;
const UPDATE_REQUEST = 1;
const DELETE_REQUEST = 2;

let queueStateUndefined = true;

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
            throw new Error('No processor for queue was specified');
        }

        let _self = this;
        this._terminated = false;
        this._online = false;
        this._locked = false;
        this._onUpdateListener = () => {};
        this._queue = [];
        this._processor = processor;
        this._lastStats = false;

        const processQueue = () => {
            if (LOG) console.log(`Queue interval, total items in queue: ${_self._queue.length}, locked: ${_self._locked}`);

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
                    console.warn(`Unable the determine the online status`);
                }
            }).always(() => {

                if (_self._queue.length > 0 && _self._locked === false) {
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

        this._restoreState().then(() => {
            processQueue();
        });
    }

    /**
     * Eliminates items with same identifier in the queue
     * 
     * This is needed to ensure that queue does not have more than
     * one data manipulation with any feature
     */
    _eliminateItemsWithSameIdentifier() {
        const getItemGid = (item) => {
            return item.feature.features[0].properties.gid;
        };

        let _self = this;

        let itemsClassifiedByGid = {};
        for (let i = 0; i < _self._queue.length; i++) {
            let itemGid = getItemGid(_self._queue[i]);
            if (!itemsClassifiedByGid[`gid_${itemGid}`]) {
                itemsClassifiedByGid[`gid_${itemGid}`] = [];
            }

            itemsClassifiedByGid[`gid_${itemGid}`].push(_self._queue[i]);
        }

        for (let key in itemsClassifiedByGid) {
            if (itemsClassifiedByGid[key].length === 2) {
                let initialNumberOfItemsInQueue = _self._queue.length;

                let initialItemImage = Object.assign({}, itemsClassifiedByGid[key][0]);
                let latestItemImage = Object.assign({}, itemsClassifiedByGid[key][1]);

                let itemGid = getItemGid(initialItemImage);

                // Merging two items in one, leaving only the initial one
                let itemsHaveToBeMerged = false;

                // Deleting both items
                let itemsHaveToBeDeleted = false;

                // Leaving only the latest item
                let itemsHaveToBeCleaned = false;

                // Guards
                if (initialItemImage.type === UPDATE_REQUEST && itemGid < 0) {
                    throw new Error(`Queue: cannot update item that does not exists on backend`);
                }

                if (initialItemImage.type === ADD_REQUEST && latestItemImage.type === UPDATE_REQUEST ||
                    initialItemImage.type === UPDATE_REQUEST && latestItemImage.type === UPDATE_REQUEST) {
                    itemsHaveToBeMerged = true;
                } else if (initialItemImage.type === ADD_REQUEST && latestItemImage.type === DELETE_REQUEST ||
                    initialItemImage.type === UPDATE_REQUEST && latestItemImage.type === DELETE_REQUEST) {
                    // Item is virtual, delete everything that is related to it
                    if (itemGid > 0) {
                        itemsHaveToBeCleaned = true;
                    } else {
                        itemsHaveToBeDeleted = true;
                    }
                } else {
                    throw new Error(`Queue: erroneous queue item pairs, ${initialItemImage.type} followed by ${latestItemImage.type}`);
                }

                let numberOfItemsRemoved = 0;
                for (let j = (_self._queue.length - 1); j >= 0; j--) {
                    if (getItemGid(_self._queue[j]) === itemGid) {
                        numberOfItemsRemoved++;
                        _self._queue.splice(j, 1);
                    }
                }

                if (itemsHaveToBeMerged) {
                    
                    if (LOG) console.log(`Queue: more than one queue item with gid ${itemGid}, items have to be merged`);
                    
                    // Giving the item another chance
                    initialItemImage.skip = false;
                    initialItemImage.feature.features[0].geometry = latestItemImage.feature.features[0].geometry;
                    initialItemImage.feature.features[0].properties = latestItemImage.feature.features[0].properties;
                    _self._queue.push(initialItemImage);
                } else if (itemsHaveToBeDeleted) {

                    if (LOG) console.log(`Queue: items with gid ${itemGid} have to be deleted`);

                } else if (itemsHaveToBeCleaned) {

                    if (LOG) console.log(`Queue: any changes for gid ${itemGid} were cleared, item has to be deleted`);

                    _self._queue.push(latestItemImage);
                } else {
                    console.log(`Items: `, initialItemImage, latestItemImage);
                    throw new Error(`Queue: no action was selected`);
                }

                if (LOG) console.log(`Queue: queue items with gid ${itemGid} were managed, (${initialNumberOfItemsInQueue} queue items before, ${_self._queue.length} now, ${numberOfItemsRemoved} removed)`);
            } else if (itemsClassifiedByGid[key].length > 2) {
                throw new Error('Queue: more than 2 queue items with same gid');
            }
        }
    }

    /**
     * Returns current items
     */
    getItems() {
        return JSON.parse(JSON.stringify(this._queue));
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
                    default:
                        throw new Error('Invalid request type');
                }
            } else {
                throw new Error('Invalid meta object');
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
     * Restores previous queue state from browser storage
     */
    _restoreState() {
        let _self = this;

        if (LOG) console.log('Queue: before getting state');

        let result = new Promise((resolve, reject) => {
            localforage.getItem(QUEUE_STORE_NAME, (error, value) => {

                if (LOG) console.log('Queue: after getting state');

                if (error) {
                    throw new Error('Error occured while accessing the store');
                }

                if (value) {
                    _self._queue = JSON.parse(value);
                }

                resolve();
            });
        });

        return result;
    }

    /**
     * Saves current queue state to disk
     */
    _saveState() {
        localforage.setItem(QUEUE_STORE_NAME, JSON.stringify(this._queue), (error) => {

            if (LOG) console.log('Queue: saving state');

            if (error) {
                throw new Error('Error occured while storing the queue');
            }
        });
    }

    _getOldestNonSkippedItem(offset) {
        let _self = this;

        let result = false;
        for (let i = offset; i < _self._queue.length; i++) {
            if (!_self._queue[i].skip) {
                result = {
                    item: _self._queue[i],
                    index: i
                };

                break;
            }
        }

        return result;
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

                new Promise((localResolve, localReject) => {
                    let itemToProcessData = _self._getOldestNonSkippedItem(queueSearchOffset);
                    if (itemToProcessData === false) {

                        if (LOG) console.log('Queue: no queue items to process');

                        resolve();
                    } else {

                        let oldestNonSkippedItem = Object.assign({}, itemToProcessData.item);

                        if (LOG) console.log('Queue: processing oldest non-skipped item', oldestNonSkippedItem);

                        let queueItems = _self.getItems();

                        let numberOfItemsWithCurrentGid = 0;
                        queueItems.map(queueItem => {
                            if (queueItem.feature.features[0].properties.gid === oldestNonSkippedItem.feature.features[0].properties.gid) {
                                numberOfItemsWithCurrentGid++;
                            }

                            if (numberOfItemsWithCurrentGid > 1) {
                                throw new Error('Multiple queue element with the same gid');
                            }
                        });

                        _self._processor(oldestNonSkippedItem, _self).then((result) => {
                            _self._queue.splice(itemToProcessData.index, 1);

                            if (LOG) console.log('Queue: item was processed');
                            if (LOG) console.log('Queue: items left to process', (_self._queue.length - queueSearchOffset));

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
                        }).catch(error => {
                            if (LOG) console.log('Queue: item was not processed', oldestNonSkippedItem);
                            if (LOG) console.log('Queue: stopping processing, items left', _self._queue.length);

                            if (error && error.rejectedByServer) {

                                if (LOG) console.log('Queue: item was rejected by server, setting as skipped', _self._queue[itemToProcessData.index]);

                                _self._queue[itemToProcessData.index].skip = true;
                                if (error.serverErrorMessage) {
                                    _self._queue[itemToProcessData.index].serverErrorMessage = error.serverErrorMessage;
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
                    }
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
            throw new Error('Queue item has to have a certain type');
        }

        let _self = this;
        this.push(item);
        _self._eliminateItemsWithSameIdentifier();

        let result = new Promise((resolve, reject) => {
            /*
                If there is only one element in the queue (the one that
                was inserted just now) then try to process it and return
                result back. If there are more than one element in the queue,
                then older elements have to be processed first.
            */

            if (_self._queue.length === 1 && _self._locked === false) {
                
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

                if (LOG) console.log('Queue: queue is busy', _self._queue.length, _self._locked);

                _self._onUpdateListener(_self._generateCurrentStatistics());
                resolve();
            }
        });

        return result;
    }

    /**
     * Add item to the queue
     */
    push(item) {
        this._queue.push(item);
    }

    /**
     * Replaces gid for queue items
     */
    replaceVirtualGid(oldGid, newGid) {
        for (let i = 0; i < this._queue.length; i++) {
            if (this._queue[i].feature.features[0].properties.gid === oldGid) {
                this._queue[i].feature.features[0].properties.gid = newGid;

                if (LOG) console.log(`Queue: replacing gid from ${oldGid} to ${newGid}`);
            }
        }

        this._saveState();
    }

    /**
     * Removes all queue items with specific gid
     * 
     * @param {Array<Number>} gids
     */
    removeByGID(gids = []) {
        let initialNumberOfItems = this._queue.length;
        for (let j = 0; j < gids.length; j++) {
            let i = this._queue.length;
            while (i--) {
                if (this._queue[i].feature.features[0].properties.gid === gids[j]) {

                    if (LOG) console.log('Queue: deleting item by gid', gids[j], this._queue[i]);

                    this._queue.splice(i, 1);
                }
            }
        }

        if (this._queue.length !== (initialNumberOfItems - gids.length)) {
            throw new Error('Some queue elements have not been deleted');
        }

        this._saveState();
        this._onUpdateListener(this._generateCurrentStatistics());
    }

    /**
     * Makes queue try to push skipped items as well 
     */
    resubmitSkippedFeatures() {
        for (let i = 0; i < this._queue.length; i++) {
            this._queue[i].skip = false;
        }

        this._saveState();
        this._onUpdateListener(this._generateCurrentStatistics());
    }

    /**
     * Removes all requests by layer identifier
     * 
     * @param {String} layerId 
     */
    removeByLayerId(layerId) {
        let i = this._queue.length;
        while (i--) {
            if ((this._queue[i].meta.f_table_schema + '.' + this._queue[i].meta.f_table_name) === layerId) {

                if (LOG) console.log('Queue: deleting item by layerId', layerId, this._queue[i]);

                this._queue.splice(i, 1);
            } 
        }

        this._saveState();
        this._onUpdateListener(this._generateCurrentStatistics(), true);
    }

    /**
     * Returns queue length
     * 
     * @return {Number}
     */
    get length() {
        return this._queue.length;
    }

    /**
     * Terminates the forever running loop
     */
    terminate() {
        this._terminated = true;

    }
};

module.exports = Queue;