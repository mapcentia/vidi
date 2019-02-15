/*
 * @author     Alexander Shumilov
 * @copyright  2013-2019 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

import { MODULE_NAME, LAYER } from './constants';
import { GROUP_CHILD_TYPE_LAYER, GROUP_CHILD_TYPE_GROUP } from './LayerSorting';

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
 * Returns list of currently enabled layers
 * 
 * @returns {Array}
 */
const getActiveLayers = () => {
    let activeLayerIds = [];
    $('*[data-gc2-layer-type]').each((index, item) => {
        let isEnabled = $(item).is(':checked');
        if (isEnabled) {
            let type = $(item).data('gc2-layer-type');
            let gc2Id = $(item).data('gc2-id');
            if (type === LAYER.RASTER_TILE) {
                activeLayerIds.push(gc2Id);
            } else if (type === LAYER.VECTOR) {
                activeLayerIds.push(LAYER.VECTOR + `:` + gc2Id);
            } else if (type === LAYER.VECTOR_TILE) {
                activeLayerIds.push(LAYER.VECTOR_TILE + `:` + gc2Id);
            } else if (type === LAYER.WEBGL) {
                activeLayerIds.push(LAYER.WEBGL + `:` + gc2Id);
            } else {
                console.error(`Unable to get active layer for ${gc2Id}`);
            }
        }
    });

    activeLayerIds = activeLayerIds.filter((v, i, a) => {
        return a.indexOf(v) === i
    });

    return activeLayerIds;
};

/**
 * Calculates layer order using the current markup
 *
 * @returns {Array}
 */
const calculateOrder = () => {
    let layerTreeOrder = [];

    $(`[id^="layer-panel-"]`).each((index, element) => {
        let id = $(element).attr(`id`).replace(`layer-panel-`, ``);
        let children = [];

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

        $(`#${$(element).attr(`id`)}`).find(`#collapse${id}`).children().each((layerIndex, layerElement) => {
            if ($(layerElement).data(`gc2-layer-key`)) {
                // Processing layer record
                children.push(processLayerRecord(layerElement));
            } else if ($(layerElement).data(`gc2-subgroup-id`)) {
                // Processing subgroup record
                let subgroupDescription = {
                    id: $(layerElement).data(`gc2-subgroup-id`),
                    type: GROUP_CHILD_TYPE_GROUP,
                    children: []
                };

                $(layerElement).find(`.js-subgroup-children`).children().each((subgroupLayerIndex, subgroupLayerElement) => {
                    subgroupDescription.children.push(processLayerRecord(subgroupLayerElement));
                });

                children.push(subgroupDescription);
            } else {
                throw new Error(`Unable to detect the group child element`);
            }
        });

        let readableId = atob(id);
        if (readableId) {
            layerTreeOrder.push({id: readableId, children});
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
    let count = 0;
    if (!isNaN(parseInt($($("#layer-panel-" + base64GroupName + " .layer-count span")[1]).html()))) {
        count = parseInt($($("#layer-panel-" + base64GroupName + " .layer-count span")[1]).html()) + numberOfAddedLayers;
    } else {
        count = numberOfAddedLayers;
    }

    $("#layer-panel-" + base64GroupName + " span:eq(1)").html(count);
    if (numberOfActiveLayers > 0) {
        $("#layer-panel-" + base64GroupName + " span:eq(0)").html(numberOfActiveLayers);
    }
};

/**
 * Default template for feature popup
 */
const getDefaultTemplate = () => {
    return `<div class="cartodb-popup-content">
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
    return layerName.replace(LAYER.VECTOR + `:`, ``).replace(LAYER.VECTOR_TILE + `:`, ``).replace(LAYER.RASTER_TILE + `:`, ``);
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
        if (parsedMeta.vidi_layer_type) {
            layerTypeSpecifiers = parsedMeta.vidi_layer_type;
        }
    }

    let isVectorLayer = false, isRasterTileLayer = false, isVectorTileLayer = false, isWebGLLayer = false, detectedTypes = 0, specifiers = [];
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

    return { isVectorLayer, isRasterTileLayer, isVectorTileLayer, isWebGLLayer, detectedTypes, specifiers };
};


/**
 * Detects default (fallback) layer type
 * 
 * @param {Object} layerMeta Layer meta
 * 
 * @return {Object}
 */
const getDefaultLayerType = (layerMeta) => {
    let { isVectorLayer, isRasterTileLayer, isVectorTileLayer, isWebGLLayer } = getPossibleLayerTypes(layerMeta);
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
    getActiveLayers,
    calculateOrder,
    getDefaultTemplate,
    stripPrefix,
    getPossibleLayerTypes,
    getDefaultLayerType,
    setupLayerNumberIndicator
};