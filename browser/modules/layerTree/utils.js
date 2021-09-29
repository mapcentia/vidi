/*
 * @author     Alexander Shumilov
 * @copyright  2013-2021 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */


let jquery = require('jquery');
require('snackbarjs');

import {MODULE_NAME, LAYER, SQL_QUERY_LIMIT} from './constants';
import {GROUP_CHILD_TYPE_LAYER, GROUP_CHILD_TYPE_GROUP} from './LayerSorting';
const base64url = require('base64url');

/**
 * Communicating with the service workied via MessageChannel interface
 *
 * @returns {Promise}
 */
const queryServiceWorker = (data) => {
    return new Promise((resolve, reject) => {
        if (navigator.serviceWorker.controller) {
            let messageChannel = new MessageChannel();
            messageChannel.port1.onmessage = (event) => {
                if (event.data.error) {
                    reject(event.data.error);
                } else {
                    resolve(event.data);
                }
            };

            navigator.serviceWorker.controller.postMessage(data, [messageChannel.port2]);
        } else {
            console.error(`Unable to query service worker as it is not registered yet`);
            reject();
        }
    });
};

/**
 * Applies opacity to the specific layer
 *
 * @returns {void}
 */
const applyOpacityToLayer = (opacity, layerKey, cloud, backboneEvents) => {
    for (let key in cloud.get().map._layers) {
        if (`id` in cloud.get().map._layers[key] && cloud.get().map._layers[key].id) {
            if (cloud.get().map._layers[key].id === layerKey) {
                cloud.get().map._layers[key].setOpacity(opacity);
                backboneEvents.get().trigger(`${MODULE_NAME}:opacityChange`);
            }
        }
    }
};

/**
 * Calculates current layer order using the current HTML markup and previous order based on the full-built layer tree order.
 * The idea is that there is always full layer tree available, generated based on meta data. However, after sorting is done,
 * the tree needs to be actualized, so whenever one of the tree branches is navigated and there is HTML markup available (so,
 * it means that something was sorted in this branch), then the layer tree needs to be restructured.
 *
 * @returns {Array}
 */
const calculateOrder = (currentOrder) => {
    let layerTreeOrder = [];

    $(`[id^="layer-panel-"]`).each((index, element) => {
        let id = $(element).attr(`id`).replace(`layer-panel-`, ``);
        let children = [];
        let readableId = base64url.decode(id);

        let correspondingOrderItem = false;
        if (currentOrder) {
            currentOrder.map(group => {
                if (group.id === readableId) {
                    correspondingOrderItem = group;
                }
            });
        }

        if ($(`#${$(element).attr(`id`)}`).find(`#collapse${id}`).children().first().children().length > 0) {
            // Panel was opened
            const processLayerRecord = (layerElement) => {
                let layerKey = $(layerElement).data(`gc2-layer-key`);
                let splitLayerKey = layerKey.split('.');
                if (splitLayerKey.length !== 3) {
                    throw new Error(`Invalid layer key (${layerKey})`);
                }

                return {
                    id: `${splitLayerKey[0]}.${splitLayerKey[1]}`,
                    type: GROUP_CHILD_TYPE_LAYER
                };
            };

            const calculateChildrenOrder = (parentElement, parent) => {
                let children = [];
                if ($(parentElement).children().length > 0) {
                    $(parentElement).children().each((layerIndex, layerElement) => {
                        if ($(layerElement).data(`gc2-layer-key`)) {
                            children.push(processLayerRecord(layerElement));
                        } else if ($(layerElement).data(`gc2-subgroup-id`)) {
                            let subgroupId = $(layerElement).data(`gc2-subgroup-id`);
                            let localParent = false;
                            parent.children.map(child => {
                                if (child.id === subgroupId) {
                                    localParent = child;
                                }
                            });

                            let subgroupDescription = {
                                id: subgroupId,
                                type: GROUP_CHILD_TYPE_GROUP,
                                children: calculateChildrenOrder($(layerElement).find(`.js-subgroup-children`).first(), localParent)
                            };

                            children.push(subgroupDescription);
                        }
                    });
                } else if (parent && parent.children) {
                    children = JSON.parse(JSON.stringify(parent.children));
                }

                return children;
            };

            children = calculateChildrenOrder($(`#${$(element).attr(`id`)}`).find(`#collapse${id}`).children().first(), correspondingOrderItem);
        } else {
            // Panel was not opened
            if (correspondingOrderItem) {
                children = JSON.parse(JSON.stringify(correspondingOrderItem.children));
            }

            if (children.length === 0) {
                console.warn(`Unable to get children for the ${base64url.decode(id)} group`);
            }
        }

        if (readableId) {
            layerTreeOrder.push({
                id: readableId,
                children,
            });
        } else {
            throw new Error(`Unable to decode the layer group identifier (${id})`);
        }
    });

    return layerTreeOrder;
};

/**
 * Setups the active / added layers indicator for group
 *
 * @param {String} base64GroupName      Group name encoded in base64
 * @param {Number} numberOfActiveLayers Number of added layers
 * @param {Number} numberOfAddedLayers  Number of active layers
 *
 * @returns {void}
 */
const setupLayerNumberIndicator = (base64GroupName, numberOfActiveLayers, numberOfAddedLayers) => {
    $("#layer-panel-" + base64GroupName + " span:eq(1)").html(numberOfAddedLayers);
    if (numberOfActiveLayers > 0) {
        $("#layer-panel-" + base64GroupName + " span:eq(0)").html(numberOfActiveLayers);
    }
};

/**
 * Default template for feature popup
 */
const getDefaultTemplate = () => {
    return `<div class="vidi-popup-content">
        <div class="form-group gc2-edit-tools">
            {{#_vidi_content.fields}}
                {{#title}}<h4>{{title}}</h4>{{/title}}
                {{#value}}
                <p {{#type}}class="{{ type }}"{{/type}}>{{{ value }}}</p>
                {{/value}}
                {{^value}}
                <p class="empty">null</p>
                {{/value}}
            {{/_vidi_content.fields}}
        </div>
    </div>`;
};

/**
 * Removes layer type prefix from the layer name
 *
 * @param {String} layerName Initial layer name
 *
 * @return {String}
 */
const stripPrefix = (layerName) => {
    return layerName
        .replace(LAYER.VECTOR + `:`, ``)
        .replace(LAYER.VECTOR_TILE + `:`, ``)
        .replace(LAYER.RASTER_TILE + `:`, ``)
        .replace(LAYER.WEBGL + `:`, ``);
};

/** Function that count occurrences of a substring in a string;
 * @param {String} string               The string
 * @param {String} subString            The sub string to search for
 * @param {Boolean} [allowOverlapping]  Optional. (Default:false)
 *
 * @author Vitim.us https://gist.github.com/victornpb/7736865
 * @see Unit Test https://jsfiddle.net/Victornpb/5axuh96u/
 * @see http://stackoverflow.com/questions/4009756/how-to-count-string-occurrence-in-string/7924240#7924240
 */
const occurrences = (string, subString, allowOverlapping = false) => {
    string += "";
    subString += "";
    if (subString.length <= 0) return (string.length + 1);

    var n = 0,
        pos = 0,
        step = allowOverlapping ? 1 : subString.length;

    while (true) {
        pos = string.indexOf(subString, pos);
        if (pos >= 0) {
            ++n;
            pos += step;
        } else break;
    }
    return n;
}

/**
 * Checks if the current layer type is the vector tile one
 *
 * @param {String} layerId Layer identifier
 *
 * @returns {Promise}
 */
const isVectorTileLayerId = (layerId) => {
    if (!layerId) throw new Error(`Invalid layer identifier was provided ${layerId}`);
    if (layerId.indexOf(`.`) > -1 && layerId.indexOf(LAYER.VECTOR_TILE + `:`) === 0) {
        return true;
    } else {
        return false;
    }
};

/**
 * Detects possible layer types for layer meta
 *
 * @param {Object} layerDescription Layer description
 *
 * @return {Object}
 */
const getPossibleLayerTypes = (layerDescription) => {
    let layerTypeSpecifiers = ``;
    if (layerDescription && layerDescription.meta) {
        let parsedMeta = JSON.parse(layerDescription.meta);
        if (parsedMeta && parsedMeta.vidi_layer_type) {
            layerTypeSpecifiers = parsedMeta.vidi_layer_type;
        }
    }

    let isVectorLayer = false, isRasterTileLayer = false, isVectorTileLayer = false, isWebGLLayer = false,
        detectedTypes = 0, specifiers = [];
    let usingLegacyNotation = true;
    if (layerTypeSpecifiers.indexOf(`,`) > -1) {
        // Using new layer type notation
        layerTypeSpecifiers = layerTypeSpecifiers.split(`,`);
        usingLegacyNotation = false;
    }

    let index = layerTypeSpecifiers.indexOf(LAYER.VECTOR_TILE);
    if (index > -1) {
        detectedTypes++;
        isVectorTileLayer = true;
        specifiers.push(LAYER.VECTOR_TILE);
        if (usingLegacyNotation) {
            layerTypeSpecifiers = layerTypeSpecifiers.replace(LAYER.VECTOR_TILE, ``);
        } else {
            layerTypeSpecifiers.splice(index, 1);
        }
    }

    index = layerTypeSpecifiers.indexOf(LAYER.RASTER_TILE)
    if (index > -1) {
        detectedTypes++;
        isRasterTileLayer = true;
        specifiers.push(LAYER.RASTER_TILE);
        if (usingLegacyNotation) {
            layerTypeSpecifiers = layerTypeSpecifiers.replace(LAYER.RASTER_TILE, ``);
        } else {
            layerTypeSpecifiers.splice(index, 1);
        }
    }

    index = layerTypeSpecifiers.indexOf(LAYER.VECTOR);
    if (index > -1) {
        detectedTypes++;
        isVectorLayer = true;
        specifiers.push(LAYER.VECTOR);
        if (usingLegacyNotation) {
            layerTypeSpecifiers = layerTypeSpecifiers.replace(LAYER.VECTOR, ``);
        } else {
            layerTypeSpecifiers.splice(index, 1);
        }
    }

    index = layerTypeSpecifiers.indexOf(LAYER.WEBGL);
    if (index > -1) {
        detectedTypes++;
        isWebGLLayer = true;
        specifiers.push(LAYER.WEBGL);
        if (usingLegacyNotation) {
            layerTypeSpecifiers = layerTypeSpecifiers.replace(LAYER.WEBGL, ``);
        } else {
            layerTypeSpecifiers.splice(index, 1);
        }
    }

    if (layerTypeSpecifiers.length > 0) {
        throw new Error(`Provided layer name "${layerDescription.f_schema_name + '.' + layerDescription.f_table_name}" does not correspond to layer type specifier convention, should be [mvt][v][t][w]`);
    }

    // Default to Raster Tiles
    if (!isVectorLayer && !isRasterTileLayer && !isVectorTileLayer && !isWebGLLayer) {
        detectedTypes++;
        isRasterTileLayer = true;
        specifiers.push(LAYER.RASTER_TILE);
    }

    return {isVectorLayer, isRasterTileLayer, isVectorTileLayer, isWebGLLayer, detectedTypes, specifiers};
};

/**
 * Handler for store errors
 *
 * @param {Object} store SqlStore
 * @param {Object} response Response
 *
 * @returns {void}
 */
const storeErrorHandler = (store, response) => {
    if (response && response.statusText === `timeout`) {
        jquery.snackbar({
            content: `<span>${__("Couldn't get the data. Trying again...")}</span>`,
            htmlAllowed: true,
            timeout: 6000
        });
        //try again
        store.load();
    } else if (response && response.statusText === `abort`) {
        // If the request was aborted, then it was sanctioned by Vidi, so no need to inform user
    } else if (response && response.responseJSON) {
        jquery.snackbar({
            content: `<span>${response.responseJSON.message}</span>`,
            htmlAllowed: true,
            timeout: 6000
        });
        console.error(response.responseJSON.message);
    } else {
        jquery.snackbar({
            content: `<span>Error occurred</span>`,
            htmlAllowed: true,
            timeout: 4000
        });
        console.error(response);
    }
};

/**
 * Detects the query limit for layer
 *
 * @param {Object} layerMeta Layer meta
 *
 * @return {Number}
 */
const getQueryLimit = (layerMeta) => {
    if (!layerMeta) throw new Error(`Invalid layer meta object`);

    let layerSpecificQueryLimit = SQL_QUERY_LIMIT;
    if (layerMeta && `max_features` in layerMeta && parseInt(layerMeta.max_features) > 0) {
        layerSpecificQueryLimit = parseInt(layerMeta.max_features);
    }

    return layerSpecificQueryLimit;
};

/**
 * Detects if a vector should be clustered
 *
 * @param {Object} layerMeta Layer meta
 *
 * @return {Number}
 */
const getIfClustering = (layerMeta) => {
    if (!layerMeta) throw new Error(`Invalid layer meta object`);

    let useClustering = false;
    if (layerMeta && `use_clustering` in layerMeta) {
        useClustering = layerMeta.use_clustering;
    }
    return useClustering;
};

/**
 * Detects default (fallback) layer type
 *
 * @param {Object} layerMeta  Layer meta
 * @param {Object} parsedMeta Parsed layer "meta" field
 *
 * @return {Object}
 */
const getDefaultLayerType = (layerMeta, parsedMeta = false) => {
    let {isVectorLayer, isRasterTileLayer, isVectorTileLayer, isWebGLLayer} = getPossibleLayerTypes(layerMeta);
    if (parsedMeta) {
        if (`default_layer_type` in parsedMeta && parsedMeta.default_layer_type) {
            if (isVectorLayer && parsedMeta.default_layer_type === LAYER.VECTOR) return LAYER.VECTOR;
            if (isRasterTileLayer && parsedMeta.default_layer_type === LAYER.RASTER_TILE) return LAYER.RASTER_TILE;
            if (isVectorTileLayer && parsedMeta.default_layer_type === LAYER.VECTOR_TILE) return LAYER.VECTOR_TILE;
            if (isWebGLLayer && parsedMeta.default_layer_type === LAYER.WEBGL) return LAYER.WEBGL;
        }
    }

    if (isVectorLayer) {
        return LAYER.VECTOR;
    } else if (isRasterTileLayer) {
        return LAYER.RASTER_TILE;
    } else if (isVectorTileLayer) {
        return LAYER.VECTOR_TILE;
    } else if (isWebGLLayer) {
        return LAYER.WEBGL;
    } else {
        return LAYER.RASTER_TILE;
    }
};

module.exports = {
    queryServiceWorker,
    applyOpacityToLayer,
    calculateOrder,
    getDefaultTemplate,
    storeErrorHandler,
    stripPrefix,
    getQueryLimit,
    getPossibleLayerTypes,
    getDefaultLayerType,
    setupLayerNumberIndicator,
    isVectorTileLayerId,
    occurrences,
    getIfClustering
};
