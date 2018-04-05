'use strict';

const Queue = require('./Queue');

const errorCodes = {
    "UNAUTHORIZED": 0,
    "NOT_FOUND": 1,
    "ANOTHER_API_SPECIFIC_ERROR": 1703
};

const DISPATCH_INTERVAL = 1000;

/**
 * Bridge pattern implementation for interaction with the API.
 * 
 * The client-side code, when it comes to interacting with the backend,
 * needs to use this class (singleton) to abstract the interaction. This
 * allows centralized API error processing, caching and offline data
 * manipulations.
 * Reliable abstract bridge tolerant to browser refresh and offline working.
 */

class APIBridge {
    constructor() {
        this.queue = new Queue();
        
        // @todo Singletone check
    }

    /**
     * Pushes changes to API by running a queue dispatch every N seconds
     */
    pushChanges() {
        this.queue.dispatch(() => {
            // If request fails, stop queue dispatching
            let result = new Promise((resolve, reject) => {
                
            });

            return result;
        });
    }

    /**
     * Returns all user layers (overlays and vector layers)
     */
    getLayers() {}

    /**
     * Returns features for specific vector layer
     */
    getFeaturesForLayer() {}

    /**
     * Adds feature to specific vector layer
     * 
     * @param {Object} data Complete feature data
     */
    addFeature(data) {
        /*
        POST --> success -> return
             \-> failure -> push to queue
        */
    }

    /**
     * Updates feature from specific vector layer
     * 
     * @param {Object} data Complete feature data
     */
    updateFeature(data) {
        /*
        PUT --> success -> return
            \-> failure -> push to queue
        */
    }

    /**
     * Updates feature from specific vector layer
     * 
     * @param {Object} data Complete feature data
     */
    deleteFeature(data) {
        /*
        DELETE --> success -> return
               \-> failure -> push to queue
        */
    }

    // @todo Do not need to abstract following methods yet

    getBaseLayers() {}

    getConfig() {}

    getDefaultConfig() {}

    login() {}

    status() {}

};


module.exports = APIBridge;