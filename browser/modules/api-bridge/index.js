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

// Vidi internal property keys that must never be sent to the server. They are
// added client-side for popup rendering, edit tracking, etc. Stripping at the
// apiBridge boundary protects against later mutations of the shared layer
// properties object (e.g. prepareDataForTableView re-adding _vidi_content
// after the editor's onSubmit ran).
const VIDI_INTERNAL_FIELDS = [
    '_vidi_content',
    '_id',
    '_vidi_edit_layer_id',
    '_vidi_edit_layer_name',
    '_vidi_edit_vector',
    '_vidi_edit_display',
    '_vidi_blob_urls'
];

/**
 * Structurally-shallow clone of a FeatureCollection that strips Vidi-internal
 * properties. Wrapper layers are cloned (so the queue cannot be mutated by
 * later writes to the layer's properties), but nested values inside properties
 * (e.g. bytea[] arrays) keep their reference so we don't duplicate large
 * payloads in memory.
 */
function sanitizeFeatureCollectionForPayload(featureCollection) {
    if (!featureCollection || !Array.isArray(featureCollection.features)) return featureCollection;
    const cleanedFeatures = featureCollection.features.map(f => {
        if (!f) return f;
        const cleanedFeature = {...f};
        if (f.properties) {
            const cleanProps = {...f.properties};
            for (const key of VIDI_INTERNAL_FIELDS) delete cleanProps[key];
            cleanedFeature.properties = cleanProps;
        }
        return cleanedFeature;
    });
    return {...featureCollection, features: cleanedFeatures};
}

/**
 * Returns a shallow-cloned copy of an array where each element is a
 * shallow-cloned object. Used by transformResponseHandler to produce a
 * mutable snapshot of response.features without aliasing the originals.
 */
function copyArray(items) {
    const result = [];
    items.map(item => { result.push(Object.assign({}, item)); });
    return result;
}

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
            return new Promise((resolve, reject) => {
                // Hoist into primitives so the success/error callbacks below do
                // not close over `queueItem` itself. jQuery's deferred chain
                // (and any service-worker fetch wrapper) keeps a reference to
                // the ajax settings — and thus the callbacks — for the lifetime
                // of the jqXHR. If the callback closure captured queueItem the
                // base64-laden feature would live until the jqXHR is GC'd,
                // which can persist long after the queue is empty.
                const schemaQualifiedName = queueItem.meta.f_table_schema + "." + queueItem.meta.f_table_name;
                const pkey = (queueItem.meta && queueItem.meta.pkey ? queueItem.meta.pkey : QUEUE_DEFAULT_PKEY);
                const queueItemType = queueItem.type;
                const queueDb = queueItem.db;
                const geomColumn = queueItem.meta.f_geometry_column;
                const pkeyValue = queueItem.feature.features[0].properties[pkey];

                if (LOG) {
                    console.log('APIBridge: in queue processor', queueItem);
                    console.log('APIBridge: offline mode is enforced:', singletoneInstance.offlineModeIsEnforcedForLayer(schemaQualifiedName));
                }

                const onSuccess = (response) => {
                    if (LOG) console.log('APIBridge: request succeeded', JSON.stringify(response));

                    if (queueItemType === Queue.ADD_REQUEST) {
                        const featureIdRaw = response.message['wfs:InsertResults']['wfs:Feature']['ogc:FeatureId']['fid'].split(".");
                        if (featureIdRaw.length !== 2) {
                            throw new Error('Unable to detect the pushed feature id');
                        }
                    }

                    resolve();
                };

                const onError = (error) => {
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
                        reject({rejectedByServer: true, serverErrorMessage, serverErrorType});
                    } else {
                        if (LOG) console.warn('APIBridge: request failed');
                        reject({rejectedByServer: false});
                    }
                };

                const baseSettings = {
                    dataType: 'json',
                    contentType: 'application/json',
                    scriptCharset: "utf-8",
                    success: onSuccess,
                    error: onError
                };

                switch (queueItemType) {
                    case Queue.ADD_REQUEST: {
                        if (singletoneInstance.offlineModeIsEnforcedForLayer(schemaQualifiedName)) {
                            if (LOG) console.log('APIBridge: offline mode is enforced, add request was not performed');
                            reject();
                            break;
                        }
                        // Strip the synthetic pkey for ADD without deep-cloning the
                        // whole feature (which would duplicate bytea payloads).
                        // We build a shallow clone down to .properties only, then
                        // serialize. The intermediate `featureForPost` falls out
                        // of scope immediately; only the JSON string survives on
                        // the ajax settings' `data` field.
                        const srcFeature = queueItem.feature.features[0];
                        const cleanedProps = {...srcFeature.properties};
                        delete cleanedProps[pkey];
                        const featureForPost = {
                            ...queueItem.feature,
                            features: [{...srcFeature, properties: cleanedProps}]
                        };
                        $.ajax({
                            ...baseSettings,
                            url: "/api/feature/" + queueDb + "/" + schemaQualifiedName + "." + geomColumn + "/4326",
                            type: "POST",
                            data: JSON.stringify(featureForPost)
                        });
                        break;
                    }
                    case Queue.UPDATE_REQUEST: {
                        if (pkeyValue < 0) {
                            console.warn(`APIBridge: feature with virtual ${pkey} is not supposed to be commited to server (update), skipping`);
                            resolve();
                            break;
                        }
                        if (singletoneInstance.offlineModeIsEnforcedForLayer(schemaQualifiedName)) {
                            if (LOG) console.log('APIBridge: offline mode is enforced, update request was not performed');
                            reject();
                            break;
                        }
                        const dataString = JSON.stringify(queueItem.feature);
                        $.ajax({
                            ...baseSettings,
                            url: "/api/feature/" + queueDb + "/" + schemaQualifiedName + "." + geomColumn + "/4326",
                            type: "PUT",
                            data: dataString
                        });
                        break;
                    }
                    case Queue.DELETE_REQUEST: {
                        if (pkeyValue < 0) {
                            if (LOG) console.warn(`APIBridge: feature with virtual ${pkey} is not supposed to be commited to server (delete), skipping`);
                            resolve();
                            break;
                        }
                        if (singletoneInstance.offlineModeIsEnforcedForLayer(schemaQualifiedName)) {
                            if (LOG) console.log(`APIBridge: offline mode is enforced, delete request was not performed`);
                            reject();
                            break;
                        }
                        $.ajax({
                            ...baseSettings,
                            url: "/api/feature/" + queueDb + "/" + schemaQualifiedName + "." + geomColumn + "/" + pkeyValue,
                            type: "DELETE"
                        });
                        break;
                    }
                }
            });
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
        return (!!this._forcedOfflineLayers[layerKey]);
    }

    /**
     * Transforms responses for geocloud
     * Adds, updates or removes features according to corresponding
     * requests made in the offline mode. Assumes that in offline mode
     * the API response is cached through the service worker.
     */
    async transformResponseHandler(response, tableId) {
        if (LOG) console.log('APIBridge: running transformResponse handler');

        if (this._queue.getMetadataLength() > 0) {
            const metadata = this._queue.getMetadataItems();

            // 1) DELETE pending requests: remove matching features from the response.
            for (const md of metadata) {
                if (`v:${md.table}` !== tableId) continue;
                if (md.type !== Queue.DELETE_REQUEST) continue;
                const features = copyArray(response.features);
                for (let i = 0; i < features.length; i++) {
                    if (features[i].properties[md.pkeyField] === md.pkey) {
                        features.splice(i, 1);
                        break;
                    }
                }
                response.features = features;
            }

            // 2) Skip-virtual-pkey cleanup: stays the same logic but reads only metadata.
            for (const md of metadata) {
                if (`v:${md.table}` !== tableId) continue;
                if (md.type !== Queue.DELETE_REQUEST) continue;
                if (md.pkey < 0) {
                    const virtual = md.pkey;
                    const toRemove = metadata
                        .filter(o => [Queue.ADD_REQUEST, Queue.UPDATE_REQUEST].indexOf(o.type) !== -1 && o.pkey === virtual)
                        .map(o => o.pkey);
                    await this._queue.removeByPrimaryKeys(toRemove);
                }
            }

            // 3) ADD / UPDATE: load each full item from storage and inject into response.
            const refreshedMetadata = this._queue.getMetadataItems();
            for (const md of refreshedMetadata) {
                if (`v:${md.table}` !== tableId) continue;
                if (md.type !== Queue.ADD_REQUEST && md.type !== Queue.UPDATE_REQUEST) continue;

                const fullItem = await this._queue.getFullItem(md.id);
                if (!fullItem) continue;

                // The injected feature must be isolated from the stored item so
                // later mutations (e.g. prepareDataForTableView setting _vidi_content)
                // don't propagate back into storage.
                const isolatedFeature = {
                    ...fullItem.feature.features[0],
                    meta: {apiRecognitionStatus: md.skip ? 'rejected_by_server' : 'pending',
                           ...(md.serverErrorMessage ? {serverErrorMessage: md.serverErrorMessage} : {}),
                           ...(md.serverErrorType ? {serverErrorType: md.serverErrorType} : {})},
                    properties: {...fullItem.feature.features[0].properties}
                };

                if (md.type === Queue.ADD_REQUEST) {
                    response.features.push(isolatedFeature);
                } else {
                    const features = copyArray(response.features);
                    for (let i = 0; i < features.length; i++) {
                        if (features[i].properties[md.pkeyField] === md.pkey) {
                            features[i] = isolatedFeature;
                            break;
                        }
                    }
                    response.features = features;
                }
            }

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
    async addFeature(feature, db, meta) {
        // Sanitize strips Vidi-internal fields and structurally-shallow-clones
        // wrapper layers so the queue cannot be mutated by later writes to the
        // layer's shared properties object. Bytea payloads stay shared.
        let copiedFeature = sanitizeFeatureCollectionForPayload(feature);
        let date = new Date();
        let timestamp = date.getTime();
        const pkey = (meta && meta.pkey ? meta.pkey : QUEUE_DEFAULT_PKEY);

        copiedFeature.features[0].properties[pkey] = (-1 * timestamp);

        this._validateFeatureData(db, meta, copiedFeature);
        return await this._queue.pushAndProcess({ type: Queue.ADD_REQUEST, feature: copiedFeature, db, meta });
    }

    /**
     * Updates feature from specific vector layer
     * Proxy method for Queue.pushAndProcess()
     *
     * @param feature
     * @param db
     * @param meta
     */
    async updateFeature(feature, db, meta) {
        // Sanitize: snapshot now so later mutations to the layer's shared
        // properties (e.g. prepareDataForTableView re-adding _vidi_content
        // after layer reload) don't leak into the PUT payload.
        const sanitized = sanitizeFeatureCollectionForPayload(feature);
        this._validateFeatureData(db, meta, sanitized);
        return await this._queue.pushAndProcess({ type: Queue.UPDATE_REQUEST, feature: sanitized, db, meta });
    }

    /**
     * Look up a pending queue item by table + primary key. Used by editor
     * to surface a user's not-yet-committed edits when re-opening edit on
     * the same feature (e.g. from a WMS popup which fetches fresh DB data
     * and doesn't go through the vector layer's transformResponse merge).
     *
     * @param {String} table  schema-qualified table name like "public.punkt" (no "v:" prefix)
     * @param {*} pkey         the primary key value
     * @returns {Promise<Object|null>} the full queue item, or null
     */
    async findPendingItemByPkey(table, pkey) {
        const metadata = this._queue.getMetadataItems();
        const matches = metadata.filter(md =>
            md.table === table &&
            md.pkey === pkey &&
            (md.type === Queue.ADD_REQUEST || md.type === Queue.UPDATE_REQUEST)
        );
        if (matches.length === 0) return null;
        const latest = matches[matches.length - 1];
        return await this._queue.getFullItem(latest.id);
    }

    /**
     * Updates feature from specific vector layer
     * Proxy method for Queue.pushAndProcess()
     *
     * @param feature
     * @param db
     * @param meta
     */
    async deleteFeature(feature, db, meta) {
        // Delete only sends the pkey in the URL, but sanitize for consistency
        // and to avoid retaining base64 payloads in the queue for delete ops.
        const sanitized = sanitizeFeatureCollectionForPayload(feature);
        this._validateFeatureData(db, meta, sanitized);
        return await this._queue.pushAndProcess({ type: Queue.DELETE_REQUEST, feature: sanitized, db, meta });
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

}

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
