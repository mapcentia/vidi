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

                let generalRequestParameters = {
                    dataType: 'json',
                    contentType: 'application/json',
                    scriptCharset: "utf-8",
                    success,
                    error
                };

                switch (queueItem.type) {
                    case Queue.ADD_REQUEST:
                        $.ajax(Object.assign(generalRequestParameters, {
                            url: "/api/feature/" + queueItem.db + "/" + schemaQualifiedName + "." + queueItem.meta.f_geometry_column + "/4326",
                            type: "POST",
                            data: JSON.stringify(queueItem.feature),
                        }));
                        break;
                    case Queue.UPDATE_REQUEST:
                        $.ajax(Object.assign(generalRequestParameters, {
                            url: "/api/feature/" + queueItem.db + "/" + schemaQualifiedName + "." + queueItem.meta.f_geometry_column + "/4326",
                            type: "PUT",
                            data: JSON.stringify(queueItem.feature),
                        }));
                        break;
                    break;
                    case Queue.DELETE_REQUEST:
                        $.ajax(Object.assign(generalRequestParameters, {
                            url: "/api/feature/" + queueItem.db + "/" + schemaQualifiedName + "." + queueItem.meta.f_geometry_column + "/" + queueItem.feature.properties.gid,
                            type: "DELETE"
                        }));
                        break;
                }
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
    _validateFeatureData(db, meta, feature = -1) {
        if (!db || !(db.length > 0)) {
            throw new Error('Invalid database was provided');
        }

        if (!meta || !meta.f_geometry_column || !meta.f_table_name || !meta.f_table_schema) {
            throw new Error('Invalid meta was provided');
        }

        if (feature !== -1 && (!feature || !feature.type || feature.type !== 'FeatureCollection')) {
            throw new Error('Invalid feature was provided');
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
     * Sets queue status listener
     * 
     * @param {Function} listener Listening function
     */
    setOnQueueUpdate(onUpdate) {
        this._queue.setOnUpdate(onUpdate);
    }

    /**
     * Transforms responses for geocloud
     * Adds, updates or removes features according to corresponding
     * requests made in the offline mode. Assumes that in offline mode
     * the API response is cached through the service worker. 
     */
    transformResponseHandler(response, tableId) {
        let currentQueueItems = this._queue.getItems();
        if (currentQueueItems.length > 0) {
            console.log('### in handler', response.features.length, currentQueueItems, tableId);
            
            const copyArray = (items) => {
                let result = [];
                items.map(item => {
                    result.push(Object.assign({} , item));
                });

                return result;
            }

            let features;
            currentQueueItems.map(item => {
                switch (item.type) {
                    case Queue.ADD_REQUEST:
                        console.log('############# ADD', item);
                        response.features.push(Object.assign({}, item.feature));
                        break;
                    case Queue.UPDATE_REQUEST:
                        features = copyArray(response.features);
                        for (let i = 0; i < features.length; i++) {
                            console.log('GIDDY', features[i], item.feature);
                            if (features[i].properties.gid === item.feature.features[0].properties.gid) {
                                console.log('############# UPDATE', item);
                                features[i] = Object.assign({}, item.feature.features[0]);
                                break;
                            }
                        }

                        response.features = features;
                        break;
                    case Queue.DELETE_REQUEST:
                        features = copyArray(response.features);
                        for (let i = 0; i < features.length; i++) {
                            if (features[i].properties.gid === item.feature.properties.gid) {
                                console.log('############# DELETE', item);
                                features.splice(i, 1);
                                break;
                            }
                        }

                        response.features = features;
                        break;
                }
            });

            console.log('### resulting response', response.features.length);
        }

        return response;
    }


    /**
     * Adds feature to specific vector layer
     * 
     * @param {Object} feature Feature collection data
     * @param {String} db      Database name
     * @param {Object} data    Meta data
     */
    addFeature(feature, db, meta) {
        this._validateFeatureData(db, meta, feature);
        return this._queue.pushAndProcess({ type: Queue.ADD_REQUEST, feature, db, meta });
    }

    /**
     * Updates feature from specific vector layer
     * 
     * @param {Object} data Complete feature data
     */
    updateFeature(feature, db, meta) {
        this._validateFeatureData(db, meta, feature);
        return this._queue.pushAndProcess({ type: Queue.UPDATE_REQUEST, feature, db, meta });
    }

    /**
     * Updates feature from specific vector layer
     * 
     * @param {Object} data Complete feature data
     */
    deleteFeature(gid, db, meta) {
        this._validateFeatureData(db, meta);
        if (!gid || !(gid > 0)) {
            throw new Error('Invalid gid value');
        }

        return this._queue.pushAndProcess({ type: Queue.DELETE_REQUEST, feature: { properties: { gid }}, db, meta });
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