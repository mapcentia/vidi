'use strict';

const Queue = require('./Queue');

const errorCodes = {
    "UNAUTHORIZED": 0,
    "NOT_FOUND": 1,
    "ANOTHER_API_SPECIFIC_ERROR": 1703
};

const DISPATCH_INTERVAL = 1000;

let singletoneInstance = false;

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
        this._queue = new Queue((queueItem) => {
            let result = new Promise((success, error) => {
                console.log('In queue processor, ', queueItem);
                let schemaQualifiedName = queueItem.meta.f_table_schema + "." + queueItem.meta.f_table_name;
                $.ajax({
                    url: "/api/feature/" + queueItem.db + "/" + schemaQualifiedName + "." + queueItem.meta.f_geometry_column + "/4326",
                    type: "POST",
                    dataType: 'json',
                    contentType: 'application/json',
                    scriptCharset: "utf-8",
                    data: JSON.stringify(queueItem.feature),
                    success,
                    error
                });
            });

            return result;
        });
    }

    /**
     * Validates provided feature and corresponding meta
     * 
     * @param {Object} feature Feature collection data
     * @param {String} db      Database name
     * @param {Object} data    Meta data
     */ 
    _validateFeatureData(feature, db, meta) {
        if (!feature || !feature.type || feature.type !== 'FeatureCollection') {
            throw new Error('Invalid feature was provided');
        }

        if (!db || !(db.length > 0)) {
            throw new Error('Invalid database was provided');
        }

        if (!meta || !meta.f_geometry_column || !meta.f_table_name || !meta.f_table_schema) {
            throw new Error('Invalid meta was provided');
        }
    };

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
     * @param {Object} feature Feature collection data
     * @param {String} db      Database name
     * @param {Object} data    Meta data
     */
    addFeature(feature, db, meta) {
        let _self = this;
        this._validateFeatureData(feature, db, meta);

        return _self._queue.pushAndProcess({ type: Queue.ADD_REQUEST, feature, db, meta });
    }

    /**
     * Sets queue status listener
     * 
     * @param {Function} listener Listening function
     */
    setOnQueueUpdate(onUpdate) {
        this._queue.setOnUpdate(onUpdate);
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

const APIBridgeSingletone = (onQueueUpdate) => {
    if (!singletoneInstance) {
        singletoneInstance = new APIBridge();
    }

    if (onQueueUpdate) {
        singletoneInstance.setOnQueueUpdate(onQueueUpdate);
    }

    return singletoneInstance;
};

module.exports = APIBridgeSingletone;