/*
 * @author     Alexander Shumilov
 * @copyright  2013-2018 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

'use strict';

const Queue = require('./Queue');

const state = require('./../state');

const { LOG, QUEUE_DEFAULT_PKEY } = require('./constants');

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

        // When init then set offline mode on layers from state
        // because layertree is not created and offline mode
        // can not be detected from that
        state.getState().then((s)=>{
            if (s.modules.layerTree) {
                const obj =s.modules.layerTree.layersOfflineMode;
                for (const property in obj) {
                    this._forcedOfflineLayers[property] = obj[property];
                }
            }
        });

        this._forcedOfflineLayers = {};
        this._queue = new Queue((queueItem, queue) => {
            let result = new Promise((resolve, reject) => {
                let schemaQualifiedName = queueItem.meta.f_table_schema + "." + queueItem.meta.f_table_name;
                const pkey = (queueItem.meta && queueItem.meta.pkey ? queueItem.meta.pkey : QUEUE_DEFAULT_PKEY);

                if (LOG) {
                    console.log('APIBridge: in queue processor', queueItem);
                    console.log('APIBridge: offline mode is enforced:', singletoneInstance.offlineModeIsEnforcedForLayer(schemaQualifiedName));
                }
                
                let generalRequestParameters = {
                    dataType: 'json',
                    contentType: 'application/json',
                    scriptCharset: "utf-8",
                    success: (response) => {

                        if (LOG) console.log('APIBridge: request succeeded', JSON.stringify(response));

                        if (queueItem.type === Queue.ADD_REQUEST) {
                            let newFeatureId = false;
                            let featureIdRaw = response.message['wfs:InsertResults']['wfs:Feature']['ogc:FeatureId']['fid'].split(".");
                            if (featureIdRaw.length === 2) {
                                newFeatureId = featureIdRaw[1];
                            } else {
                                throw new Error('Unable to detect the pushed feature id');
                            }
                        }

                        resolve();
                    },
                    error: (error) => {
                        let itemWasReqectedByServer = false;
                        let serverErrorMessage = '';
                        let serverErrorType = `REGULAR_ERROR`;
                        if (error.status === 500 && error.responseJSON) {
                            if (error.responseJSON.message && error.responseJSON.message.success === false) {
                                itemWasReqectedByServer = true;
                                if (error.responseJSON.message.message['ows:Exception']) {
                                    serverErrorMessage = error.responseJSON.message.message['ows:Exception']['ows:ExceptionText'];
                                } else if (error.responseJSON.message.code === 403) {
                                    serverErrorType = `AUTHORIZATION_ERROR`;
                                } else if (typeof error.responseJSON.message.message === 'string') {
                                    serverErrorMessage = error.responseJSON.message.message;
                                }
                            }
                        }

                        if (itemWasReqectedByServer) {
                            if (LOG) console.warn(`APIBridge: request was rejected by server, error: `, serverErrorMessage);

                            reject({
                                rejectedByServer: true,
                                serverErrorMessage,
                                serverErrorType
                            });
                        } else {
                            if (LOG) console.warn('APIBridge: request failed');
                            reject({
                                rejectedByServer: false
                            });
                        }
                    }
                };

                switch (queueItem.type) {
                    case Queue.ADD_REQUEST:
                        let queueItemCopy = JSON.parse(JSON.stringify(queueItem));
                        delete queueItemCopy.feature.features[0].properties[pkey];

                        if (singletoneInstance.offlineModeIsEnforcedForLayer(schemaQualifiedName)) {
                            
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
                        if (queueItem.feature.features[0].properties[pkey] < 0) {
                            
                            console.warn(`APIBridge: feature with virtual ${pkey} is not supposed to be commited to server (update), skipping`);
                            
                            resolve();
                        } else {
                            if (singletoneInstance.offlineModeIsEnforcedForLayer(schemaQualifiedName)) {
                                
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
                        if (queueItem.feature.features[0].properties[pkey] < 0) {
                            
                            if (LOG) console.warn(`APIBridge: feature with virtual ${pkey} is not supposed to be commited to server (delete), skipping`);

                            resolve();
                        } else {
                            if (singletoneInstance.offlineModeIsEnforcedForLayer(schemaQualifiedName)) {

                                if (LOG) console.log(`APIBridge: offline mode is enforced, delete request was not performed`);

                                reject();
                            } else {
                                $.ajax(Object.assign(generalRequestParameters, {
                                    url: "/api/feature/" + queueItem.db + "/" + schemaQualifiedName + "." + queueItem.meta.f_geometry_column + "/" + queueItem.feature.features[0].properties[pkey],
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
     * Sets offline mode for specific layer
     *
     * @param {String}  layerKey Layer key
     * @param {Boolean} mode     Specifies the offline mode
     *  
     * @param {Function} listener Listening function
     */
    setOfflineModeForLayer(layerKey, mode) {
        this._forcedOfflineLayers[layerKey] = mode;
    }

    /**
     * Tells if the offline mode is currently enforced for specific layer
     * 
     * @param {String} layerKey Layer key
     * 
     * @return {Boolean}
     */
    offlineModeIsEnforcedForLayer(layerKey) {
        return (this._forcedOfflineLayers[layerKey] ? true : false);
    }

    /**
     * Transforms responses for geocloud
     * Adds, updates or removes features according to corresponding
     * requests made in the offline mode. Assumes that in offline mode
     * the API response is cached through the service worker. 
     */
    transformResponseHandler(response, tableId) {
        if (LOG) console.log('APIBridge: running transformResponse handler', JSON.stringify(response.features));

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
                const pkey = (item.meta && item.meta.pkey ? item.meta.pkey : QUEUE_DEFAULT_PKEY);

                if (itemParentTable === tableId) {
                    switch (item.type) {
                        case Queue.DELETE_REQUEST:
                            features = copyArray(response.features);
                            for (let i = 0; i < features.length; i++) {
                                if (features[i].properties[pkey] === item.feature.features[0].properties[pkey]) {

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
                const pkey = (item.meta && item.meta.pkey ? item.meta.pkey : QUEUE_DEFAULT_PKEY);

                let localQueueItems = this._queue.getItems();
                let primaryKeysToRemove = [];
                if (itemParentTable === tableId) {
                    if (item.type === Queue.DELETE_REQUEST && item.feature.features[0].properties[pkey] < 0) {
                        let virtualPrimaryKey = item.feature.features[0].properties[pkey];
                        localQueueItems.map(localItem => {
                            if ([Queue.ADD_REQUEST, Queue.UPDATE_REQUEST].indexOf(localItem.type) !== -1
                                && localItem.feature.features[0].properties[pkey] === virtualPrimaryKey) {
                                    primaryKeysToRemove.push(virtualPrimaryKey);
                            }
                        });
                    }
                }

                this._queue.removeByPrimaryKeys(primaryKeysToRemove);
            });

            currentQueueItems = this._queue.getItems();
            currentQueueItems.map(item => {
                let itemParentTable = 'v:' + item.meta.f_table_schema + '.' + item.meta.f_table_name;
                const pkey = (item.meta && item.meta.pkey ? item.meta.pkey : QUEUE_DEFAULT_PKEY);

                item.feature.features[0].meta = {};
                item.feature.features[0].meta.apiRecognitionStatus = 'pending';
                if (item.skip) {

                    if (LOG) console.log('APIBridge: skipped item was detected');

                    item.feature.features[0].meta.apiRecognitionStatus = 'rejected_by_server';
                    if (item.serverErrorMessage) item.feature.features[0].meta.serverErrorMessage = item.serverErrorMessage;
                    if (item.serverErrorType) item.feature.features[0].meta.serverErrorType = item.serverErrorType;
                }

                let feature = Object.assign({}, item.feature.features[0]);
                if (itemParentTable === tableId) {
                    switch (item.type) {
                        case Queue.ADD_REQUEST:
                            
                            if (LOG) console.log('APIBridge: ## ADD', item);

                            response.features.push(Object.assign({}, feature));
                            break;
                        case Queue.UPDATE_REQUEST:
                            features = copyArray(response.features);
                            for (let i = 0; i < features.length; i++) {
                                if (features[i].properties[pkey] === item.feature.features[0].properties[pkey]) {

                                    if (LOG) console.log('APIBridge: ## UPDATE', item);

                                    features[i] = Object.assign({}, feature);
                                    break;
                                }
                            }

                            response.features = features;
                            break;
                    }
                }
            });

            if (LOG) console.log('APIBridge: # Result of transformResponse handler', response.features.length);
        }

        return response;
    }


    /**
     * Adds feature to specific vector layer
     * Proxy method for Queue.pushAndProcess()
     * 
     * @param {Object} feature Feature collection data
     * @param {String} db      Database name
     * @param {Object} data    Meta data
     */
    addFeature(feature, db, meta) {
        let copiedFeature = JSON.parse(JSON.stringify(feature));
        let date = new Date();
        let timestamp = date.getTime();
        const pkey = (meta && meta.pkey ? meta.pkey : QUEUE_DEFAULT_PKEY);

        copiedFeature.features[0].properties[pkey] = (-1 * timestamp);

        this._validateFeatureData(db, meta, copiedFeature);
        return this._queue.pushAndProcess({ type: Queue.ADD_REQUEST, feature: copiedFeature, db, meta });
    }

    /**
     * Updates feature from specific vector layer
     * Proxy method for Queue.pushAndProcess()
     * 
     * @param {Object} data Complete feature data
     */
    updateFeature(feature, db, meta) {
        this._validateFeatureData(db, meta, feature);
        return this._queue.pushAndProcess({ type: Queue.UPDATE_REQUEST, feature, db, meta });
    }

    /**
     * Updates feature from specific vector layer
     * Proxy method for Queue.pushAndProcess()
     * 
     * @param {Object} data Complete feature data
     */
    deleteFeature(feature, db, meta) {
        this._validateFeatureData(db, meta, feature);
        return this._queue.pushAndProcess({ type: Queue.DELETE_REQUEST, feature, db, meta });
    }

    /**
     * Proxy method for Queue.removeByLayerId()
     * 
     * @param {String} layerId 
     */
    removeByLayerId(layerId) {
        return this._queue.removeByLayerId(layerId);
    }

    /**
     * Proxy method for Queue.resubmitSkippedFeatures()
     */
    resubmitSkippedFeatures() {
        return this._queue.resubmitSkippedFeatures();
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
