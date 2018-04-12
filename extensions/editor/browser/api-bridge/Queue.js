'use strict';

const QUEUE_PROCESSING_INTERVAL = 5000;
const QUEUE_STORE_NAME = 'vidi-feature-management-queue';

const LOG = true;

// Types of queue items
const ADD_REQUEST = 0;
const UPDATE_REQUEST = 1;
const DELETE_REQUEST = 2;

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
        this._locked = false;
        this._onUpdateListener = () => {};
        this._queue = [];
        this._processor = processor;

        this._restoreState();

        const processQueue = () => {
            if (LOG) console.log(`Queue interval, total items in queue: ${_self._queue.length}, locked: ${_self._locked}`);

            const scheduleNextQueueProcessingRun = () => {
                setTimeout(() => {
                    processQueue();
                }, QUEUE_PROCESSING_INTERVAL);
            };

            if (_self._queue.length > 0 && _self._locked === false) {
                _self._locked = true;
                console.warn('Queue is not empty, trying to push changes');

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
        };

        processQueue();
    }

    /**
     * Returns current items
     */
    getItems() {
        return this._queue;
    }

    /**
     * Generates current queue statistics by layer
     */
    _generateCurrentStatistics() {
        let stats = {};
        for (let key in this._queue) {
            let currentItem = this._queue[key];
            if (currentItem.meta && currentItem.meta.f_table_schema && currentItem.meta.f_table_name && currentItem.meta.f_geometry_column) {
                let layer = `${currentItem.meta.f_table_schema}.${currentItem.meta.f_table_name}.${currentItem.meta.f_geometry_column}`;
                if (('' + layer) in stats === false) {
                    stats[layer] = {
                        ADD: 0,
                        UPDATE: 0,
                        DELETE: 0
                    };
                }

                switch (currentItem.type) {
                    case ADD_REQUEST:
                        stats[layer].ADD++;
                        break;
                    case UPDATE_REQUEST:
                        stats[layer].UPDATE++;
                        break;
                    case DELETE_REQUEST:
                        stats[layer].DELETE++;
                        break;
                    default:
                        throw new Error('Invalid request type');
                }
            } else {
                throw new Error('Invalid meta object');
            }
        }

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
        localforage.getItem(QUEUE_STORE_NAME, (error, value) => {

            if (LOG) console.log('Queue: getting state');

            if (error) {
                throw new Error('Error occured while accessing the store');
            }

            if (value) {
                _self._queue = JSON.parse(value);
            }
        });
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

    /**
     * Delete items that are mutually exclusive, for
     * example, requests to add feature A and delete 
     * feature A should be annihilated as it is pointless
     * to send them to server
     */
    houseKeeping() {}

    /**
     * Iterate over queue and perform request in FIFO manner
     * 
     * @param {Function} dispatcher Function that perfroms actual request
     */
    _dispatch() {

        if (LOG) console.log('Queue: _dispatch');

        let _self = this;

        _self._onUpdateListener(_self._generateCurrentStatistics());
        _self._saveState();

        let result = new Promise((resolve, reject) => {
            const processOldestItem = () => {

                if (LOG) console.log('Queue: processOldest');

                new Promise((localResolve, localReject) => {
                    _self._onUpdateListener(_self._generateCurrentStatistics());

                    let oldestItem = Object.assign({}, _self._queue[0]);
                    _self._processor(oldestItem).then((result) => {
                        _self._queue.shift();

                        if (LOG) console.log('Queue: item was processed', oldestItem, result);
                        if (LOG) console.log('Queue: items left', _self._queue.length);

                        if (_self._queue.length === 0) {
                            _self._onUpdateListener(_self._generateCurrentStatistics());
                            _self._saveState();

                            resolve();
                        } else {
                            localResolve();
                        }
                    }).catch((error) => {

                        if (LOG) console.log('Queue: item was not processed', oldestItem);
                        if (LOG) console.log('Queue: stopping processing, items left', _self._queue.length);

                        _self._onUpdateListener(_self._generateCurrentStatistics());
                        _self._saveState();

                        localReject();
                    });
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

        let result = new Promise((resolve, reject) => {
            /*
                If there is only one element in the queue (the one that
                was inserted just now) then try to process it and return
                result back. If there are more than one element in the queue,
                then older elements have to be processed first.
            */

            if (_self._queue.length === 1 && _self._locked === false) {
                console.log('Queue: processing pushAndProcess item right away');
                _self._locked = true;
                _self._dispatch().then(() => {
                    _self._locked = false;

                    resolve();
                }).catch(error => {
                    _self._locked = false;

                    console.warn('Request failed and was postponed');
                    resolve();
                });
            } else {
                console.log('Queue: queue is busy', _self._queue.length, _self._locked);
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
     * Returns queue length
     * 
     * @return {Number}
     */
    get length() {
        return this._queue.length;
    }

};

module.exports = Queue;