'use strict';

const Queue = require('./Queue');
const LOG = true;
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
        console.log('APIBridge: initializing');

        this._forcedOffline = false;
        this._queue = new Queue((queueItem, queue) => {
            let result = new Promise((resolve, reject) => {
                if (LOG) {
                    console.log('APIBridge: in queue processor, ', queueItem);
                    console.log('APIBridge: offline mode is enforced:', singletoneInstance.offlineModeIsEnforced());
                }

                let schemaQualifiedName = queueItem.meta.f_table_schema + "." + queueItem.meta.f_table_name;

                let generalRequestParameters = {
                    dataType: 'json',
                    contentType: 'application/json',
                    scriptCharset: "utf-8",
                    success: (response) => {

                        if (LOG) console.log('APIBridge: request succeeded', response);

                        if (queueItem.type === Queue.ADD_REQUEST) {
                            let newFeatureId = false;
                            let featureIdRaw = response.message['wfs:InsertResult']['ogc:FeatureId']['fid'].split(".");
                            if (featureIdRaw.length === 2) {
                                newFeatureId = featureIdRaw[1];
                            } else {
                                throw new Error('Unable to detect the pushed feature id');
                            }

                            let queueItems = queue.getItems();
                            queueItems.map(item => {
                                if (queueItem.feature.features[0].properties.gid === item.feature.features[0].properties.gid) {
                                    queue.replaceVirtualGid(queueItem.feature.features[0].properties.gid, newFeatureId);
                                }
                            });
                        }

                        resolve();
                    },
                    error: () => {

                        if (LOG) console.warn('APIBridge: request failed');

                        reject();
                    }
                };

                switch (queueItem.type) {
                    case Queue.ADD_REQUEST:
                        let queueItemCopy = JSON.parse(JSON.stringify(queueItem));
                        delete queueItemCopy.feature.features[0].properties.gid;

                        if (singletoneInstance.offlineModeIsEnforced()) {
                            
                            if (LOG) console.log('APIBridge: offline mode is enforced, add request was not performed');
                            
                            reject();
                        } else {
                            $.ajax(Object.assign(generalRequestParameters, {
                                url: "/api/feature/" + queueItemCopy.db + "/" + schemaQualifiedName + "." + queueItemCopy.meta.f_geometry_column + "/4326",
                                type: "POST",
                                data: JSON.stringify(queueItemCopy.feature),
                            }));
                        }
                        break;
                    case Queue.UPDATE_REQUEST:
                        if (queueItem.feature.features[0].properties.gid < 0) {
                            
                            if (LOG) console.warn('APIBridge: feature with virtual gid is not supposed to be commited to server (update), skipping');
                            
                            resolve();
                        } else {
                            if (singletoneInstance.offlineModeIsEnforced()) {
                                
                                if (LOG) console.log('APIBridge: offline mode is enforced, update request was not performed');

                                reject();
                            } else {
                                $.ajax(Object.assign(generalRequestParameters, {
                                    url: "/api/feature/" + queueItem.db + "/" + schemaQualifiedName + "." + queueItem.meta.f_geometry_column + "/4326",
                                    type: "PUT",
                                    data: JSON.stringify(queueItem.feature),
                                }));
                            }
                        }

                        break;
                    case Queue.DELETE_REQUEST:
                        if (queueItem.feature.features[0].properties.gid < 0) {
                            
                            if (LOG) console.warn('APIBridge: feature with virtual gid is not supposed to be commited to server (delete), skipping');

                            resolve();
                        } else {
                            if (singletoneInstance.offlineModeIsEnforced()) {
                                
                                if (LOG) console.log('APIBridge: offline mode is enforced, delete request was not performed');

                                reject();
                            } else {
                                $.ajax(Object.assign(generalRequestParameters, {
                                    url: "/api/feature/" + queueItem.db + "/" + schemaQualifiedName + "." + queueItem.meta.f_geometry_column + "/" + queueItem.feature.features[0].properties.gid,
                                    type: "DELETE"
                                }));
                            }
                        }

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
     * Sets offline mode
     * 
     * @param {Function} listener Listening function
     */
    setOfflineMode(mode) {
        this._forcedOffline = mode;
    }

    /**
     * Tells if the offline mode is currently enforced
     * 
     * @return {Boolean}
     */
    offlineModeIsEnforced() {
        return this._forcedOffline;
    }

    /**
     * Transforms responses for geocloud
     * Adds, updates or removes features according to corresponding
     * requests made in the offline mode. Assumes that in offline mode
     * the API response is cached through the service worker. 
     */
    transformResponseHandler(response, tableId) {
        if (LOG) console.log('APIBridge: running transformResponse handler');

        if (this._queue.length > 0) {

            if (LOG) console.log('APIBridge: transformResponse handler', response.features.length, tableId);

            const copyArray = (items) => {
                let result = [];
                items.map(item => {
                    result.push(Object.assign({} , item));
                });

                return result;
            }

            let features;

            // Deleting regular features from response
            let currentQueueItems = this._queue.getItems();
            currentQueueItems.map(item => {
                let itemParentTable = 'v:' + item.meta.f_table_schema + '.' + item.meta.f_table_name;
                if (itemParentTable === tableId) {
                    switch (item.type) {
                        case Queue.DELETE_REQUEST:
                            features = copyArray(response.features);
                            for (let i = 0; i < features.length; i++) {
                                if (features[i].properties.gid === item.feature.features[0].properties.gid) {
                                    
                                    if (LOG) console.log('APIBridge: ## DELETE', item);

                                    features.splice(i, 1);
                                    break;
                                }
                            }

                            response.features = features;
                            break;
                    }
                }
            });

            // Deleting non-commited feature management requests
            currentQueueItems.map(item => {
                let itemParentTable = 'v:' + item.meta.f_table_schema + '.' + item.meta.f_table_name;
                let localQueueItems = this._queue.getItems();
                let gidsToRemove = [];
                if (itemParentTable === tableId) {
                    if (item.type === Queue.DELETE_REQUEST && item.feature.features[0].properties.gid < 0) {
                        let virtualGid = item.feature.features[0].properties.gid;
                        localQueueItems.map(localItem => {
                            if ([Queue.ADD_REQUEST, Queue.UPDATE_REQUEST].indexOf(localItem.type) !== -1
                                && localItem.feature.features[0].properties.gid === virtualGid) {
                                gidsToRemove.push(virtualGid);
                            }
                        });
                    }
                }

                this._queue.removeByGID(gidsToRemove);
            });

            currentQueueItems = this._queue.getItems();
            currentQueueItems.map(item => {
                let itemParentTable = 'v:' + item.meta.f_table_schema + '.' + item.meta.f_table_name;
                if (itemParentTable === tableId) {
                    switch (item.type) {
                        case Queue.ADD_REQUEST:
                            
                            if (LOG) console.log('APIBridge: ## ADD', item);

                            response.features.push(Object.assign({}, item.feature.features[0]));
                            break;
                        case Queue.UPDATE_REQUEST:
                            features = copyArray(response.features);
                            for (let i = 0; i < features.length; i++) {
                                if (features[i].properties.gid === item.feature.features[0].properties.gid) {

                                    if (LOG) console.log('APIBridge: ## UPDATE', item);

                                    features[i] = Object.assign({}, item.feature.features[0]);
                                    break;
                                }
                            }

                            response.features = features;
                            break;
                    }
                }
            });

            if (LOG) console.log('APIBridge: # Result of transformResponse handler', response.features.length, response.features);
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
        let copiedFeature = JSON.parse(JSON.stringify(feature));
        let date = new Date();
        let timestamp = date.getTime();
        
        copiedFeature.features[0].properties['gid'] = (-1 * timestamp);

        this._validateFeatureData(db, meta, copiedFeature);
        return this._queue.pushAndProcess({ type: Queue.ADD_REQUEST, feature: copiedFeature, db, meta });
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
        if (gid === undefined) {
            throw new Error('Invalid gid');
        }

        this._validateFeatureData(db, meta);
        return this._queue.pushAndProcess({ type: Queue.DELETE_REQUEST, feature: { features: [{ properties: { gid }}]}, db, meta });
    }

    /**
     * Removes all requests by layer identifier
     * 
     * @param {String} layerId 
     */
    removeByLayerId(layerId) {
        return this._queue.removeByLayerId(layerId);
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