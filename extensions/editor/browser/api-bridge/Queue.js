'use strict';

const QUEUE_PROCESSING_INTERVAL = 5000;

/**
 * FIFO queue abstraction. Queue items are stored
 * in browser storage and do not depend on page reload
 */
class Queue {
    constructor(processor) {
        if (!processor) {
            throw new Error('No processor for queue was specified');
        }

        let _self = this;
        this._locked = false;
        this._queue = [];
        this._processor = processor;

        const processQueue = () => {
            console.log('Queue interval, total items in queue:', _self._queue.length, _self._locked);

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
     * Restores previous queue state from browser storage
     */
    restorePreviousState() {}

    /**
     * Saves current queue state to disk
     */
    saveState() {}

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

        console.log('Queue: _dispatch');

        let _self = this;

        let result = new Promise((resolve, reject) => {
            const processOldestItem = () => {

                console.log('Queue: processOldest');

                new Promise((localResolve, localReject) => {
                    let oldestItem = Object.assign({}, _self._queue[(_self._queue.length - 1)]);
                    _self._processor(oldestItem).then((result) => {
                        let processedItem = _self._queue.shift();

                        console.log('Queue: item is processed', processedItem, result);
                        console.log('Queue: items left', _self._queue.length);

                        if (_self._queue.length === 0) {
                            resolve();
                        } else {
                            localResolve();
                        }
                    }).catch((error) => {

                        console.log('Queue: item was not processed', oldestItem);
                        console.log('Queue: stopping processing, items left', _self._queue.length);

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
        
        console.log('Queue: pushAndProcess');

        let _self = this;
        this.push(item);
        let result = new Promise((resolve, reject) => {
            /*
                If there is only one element in the queue (the one that
                was inserted just now) then try to process it and return
                result back. If there are more than one element in the queue,
                then older elements have to be processed first.
            */
            if (_self._queue.length === 1) {
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
     */
    get length() {}

};

module.exports = Queue;