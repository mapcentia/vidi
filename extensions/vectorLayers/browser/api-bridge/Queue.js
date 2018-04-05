'use strict';

/**
 * FIFO queue abstraction. Queue items are stored
 * in browser storage and do not depend on page reload
 */
class Queue {
    constructor() {
        this.queue = [];
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
    dispatch(dispatcher) {
        let currentItem = this.queue.shift();
        dispatcher(currentItem).then(() => {
            // Process next item in queue
        }).catch(error => {
            // Stop dispatching
        });
    }

    /**
     * Add item to the queue
     */
    push() {}

    /**
     * Returns queue length
     */
    get length() {}

};

module.exports = Queue;