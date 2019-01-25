/*
 * @author     Martin Høgh <mh@mapcentia.com>
 * @copyright  2013-2018 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

'use strict';

import { LAYER } from './layerTree/constants';

var backboneEvents;

/**
 *
 * @type {*|exports|module.exports}
 */
var cloud;

/**
 *
 * @type {*|exports|module.exports}
 */
var legend;

/**
 *
 * @type {*|exports|module.exports}
 */
var layers;

/**
 *
 * @type {*|exports|module.exports}
 */
var layerTree;

/**
 *
 * @type {*|exports|module.exports}
 */
var pushState;

/**
 *
 * @type {*|exports|module.exports}
 */
var meta;

/**
 *
 * @type {*|exports|module.exports}
 */
var backboneEvents;

let _self = false;

/**
 *
 * @type {{set: module.exports.set, init: module.exports.init}}
 */
module.exports = module.exports = {
    set: function (o) {
        cloud = o.cloud;
        legend = o.legend;
        layers = o.layers;
        layerTree = o.layerTree;
        pushState = o.pushState;
        meta = o.meta;
        backboneEvents = o.backboneEvents;

        _self = this;
        return this;
    },

    /**
     * Toggles a layer on/off. If visible is true, layer is toggled off and vice versa.
     * @param name {string}
     * @param enable {boolean}
     * @param doNotLegend {boolean}
     * @param forceTileReload {boolean}
     * 
     * @returns {Promise}
     */
    init: function (name, enable, doNotLegend, forceTileReload, setupControls = true, failedBefore = false) {
        if (!name) {
            throw new Error(`Layer name is undefined`);
        }

        let metaData = meta.getMetaData();
        for (let j = 0; j < metaData.data.length; j++) {
            if (metaData.data[j].f_table_schema + '.' + metaData.data[j].f_table_name === name.replace('v:', '')) {
                let layer = metaData.data[j];

                let isVectorLayer = true;
                let isTileLayer = true;
                if (layer && layer.meta) {
                    let parsedMeta = JSON.parse(layer.meta);
                    if (parsedMeta.vidi_layer_type) {
                        if (parsedMeta.vidi_layer_type === 't') isVectorLayer = false;
                        if (parsedMeta.vidi_layer_type === 'v') isTileLayer = false;
                    }
                }

                if (isVectorLayer === false && name.startsWith('v:')) {
                    name = name.replace(`v:`, ``);
                    console.log(`No vector view for ${name}, requesting the tile one`);
                }
    
                if (isTileLayer === false && !name.startsWith('v:')) {
                    name = `v:` + name;
                    console.log(`No tile view for ${name}, requesting the vector one`);
                }

                break;
            }
        }

        let gc2Id = name.replace('v:', '');
        let applicationWideControls = $(`*[data-gc2-id="${gc2Id}"]`);
        applicationWideControls.prop('checked', enable);

        let result = new Promise((resolve, reject) => {
            try {
            let vectorDataStores = layerTree.getStores();

            let layer = cloud.get().getLayersByName(name);
            let layerType, tileLayerId, vectorLayerId;
            if (name.startsWith('v:')) {
                tileLayerId   = name.replace('v:', '');
                vectorLayerId = name;
                layerType     = 'vector';
            } else {
                tileLayerId   = name;
                vectorLayerId = 'v:' + name;
                layerType     = 'tile';
            }

            let tileLayer   = cloud.get().getLayersByName(tileLayerId);
            let vectorLayer = cloud.get().getLayersByName(vectorLayerId);

            if (tileLayer) cloud.get().map.removeLayer(tileLayer);
            if (vectorLayer) cloud.get().map.removeLayer(vectorLayer);

            if (vectorDataStores[vectorLayerId]) {
                vectorDataStores[vectorLayerId].abort();
                vectorDataStores[vectorLayerId].reset();
            }

            if (enable) {
                if (layerType === 'tile') {
                    // Only one layer at a time, so using the tile layer identifier
                    layers.incrementCountLoading(tileLayerId);
                    layerTree.setSelectorValue(name, LAYER.RASTER_TILE);
                    layers.addLayer(name, layerTree.getLayerFilterString(name)).then(() => {
                        _self.checkLayerControl(name, doNotLegend, setupControls);

                        tileLayer = cloud.get().getLayersByName(tileLayerId);

                        let tileLayersCacheBuster = ``;
                        if (forceTileReload) {
                            tileLayersCacheBuster = Math.random();
                        }

                        // The WMS tile layer and single-tiled at the same time creates the L.nonTiledLayer.wms
                        // which does not have the setUrl() method
                        if (`setUrl` in tileLayer) {
                            tileLayer.setUrl(tileLayer._url + "?" + tileLayersCacheBuster);
                            tileLayer.redraw();
                        }

                        resolve();
                    }).catch((err) => {
                        meta.init(name, true, true).then(layerMeta => {
                            // Trying to recreate the layer tree with updated meta and switch layer again                           
                            layerTree.create().then(() => {
                                // All layers are guaranteed to exist in meta
                                let currentLayers = layers.getLayers();
                                if (currentLayers && Array.isArray(currentLayers)) {
                                    layers.getLayers().split(',').map(layerToActivate => {
                                        _self.checkLayerControl(layerToActivate, doNotLegend, setupControls);
                                    });
                                }

                                _self.init(name, true).then(() => {
                                    resolve();
                                });
                            });
                        }).catch(() => {
                            console.error(`Could not add ${tileLayerId} tile layer`);
                            layers.decrementCountLoading(tileLayerId);
                            resolve();
                        });
                    });
                } else if (layerType === 'vector') {
                    layers.incrementCountLoading(vectorLayerId);

                    layerTree.setSelectorValue(name, LAYER.VECTOR);
                    if (vectorLayerId in vectorDataStores) {
                        cloud.get().layerControl.addOverlay(vectorDataStores[vectorLayerId].layer, vectorLayerId);
                        let existingLayer = cloud.get().getLayersByName(vectorLayerId);
                        cloud.get().map.addLayer(existingLayer);
                        vectorDataStores[vectorLayerId].load();

                        backboneEvents.get().trigger("startLoading:layers", vectorLayerId);

                        _self.checkLayerControl(name, doNotLegend, setupControls);
                        resolve();
                    } else if (failedBefore !== false) {
                        if (failedBefore.reason === `NO_VECTOR_DATA_STORE`) {
                            console.error(`Failed to switch layer while attempting to get the vector data store for ${name} (probably it is not the vector layer)`);
                        } else {
                            console.error(`Unknown switch layer failure for ${name}`);
                        }

                        resolve();
                    } else {
                        meta.init(tileLayerId, true, true).then(layerMeta => {
                            // Trying to recreate the layer tree with updated meta and switch layer again
                            layerTree.create().then(() => {
                                // All layers are guaranteed to exist in meta
                                let currentLayers = layers.getLayers();
                                if (currentLayers && Array.isArray(currentLayers)) {
                                    layers.getLayers().split(',').map(layerToActivate => {
                                        _self.checkLayerControl(layerToActivate, doNotLegend, setupControls);
                                    });
                                }

                                _self.init(name, true, false, false, true, {
                                    reason: `NO_VECTOR_DATA_STORE`
                                }).then(() => {
                                    resolve();
                                });
                            });
                        }).catch(() => {
                            console.error(`Could not add ${tileLayerId} vector layer`);
                            layers.decrementCountLoading(vectorLayerId);
                            resolve();
                        });
                    }
                } else {
                    throw new Error(`Vector tile switching have not been implemented yet`);
                }
            } else {
                _self.uncheckLayerControl(name, doNotLegend, setupControls);
                resolve();
            }
        }catch(e) {console.log(e)}
        });

        return result;
    },

    /**
     * Toggles the layer control
     */
    _toggleLayerControl: (enable = false, layerName, doNotLegend, setupControls) => {
        const getLayerSwitchControl = () => {
            let controlElement = $('input[class="js-show-layer-control"][data-gc2-id="' + layerName.replace('v:', '') + '"]');
            if (!controlElement || controlElement.length !== 1) {
                if (enable) {
                    console.warn(`Unable to find layer switch control for layer ${layerName}, number of layer switch controls: ${controlElement.length}`);
                }

                return false;
            } else {
                return controlElement;
            }
        };

        let el = getLayerSwitchControl();
        if (el) {
            el.prop('checked', enable);
            if (setupControls) {        
                if (layerName.indexOf(`v:`) === 0) {
                    layerTree.setupLayerAsVectorOne(layerName, true, enable);
                } else {
                    layerTree.setupLayerAsTileOne(layerName, true, enable);
                }
            }

            _self.update(doNotLegend, el);
        }
    },

    /**
     * Checks the layer control
     * 
     * @param {String} layerName Name of the layer
     */
    checkLayerControl: (layerName, doNotLegend, setupControls = true) => {
        _self._toggleLayerControl(true, layerName, doNotLegend, setupControls);
    },

    /**
     * Unchecks the layer control
     * 
     * @param {String} layerName Name of the layer
     */
    uncheckLayerControl: (layerName, doNotLegend, setupControls = true) => {
        _self._toggleLayerControl(false, layerName, doNotLegend, setupControls);
    },

    /**
     * Updates the number of active layers indicator for the tab
     */
    update: (doNotLegend, el) => {
        var siblings = el.parents(".accordion-body").find("input.js-show-layer-control"), c = 0;

        $.each(siblings, function (i, v) {
            if (v.checked) {
                c = c + 1;
            }
        });

        el.parents(".panel-layertree").find("span:eq(0)").html(c);

        pushState.init();

        if (!doNotLegend) {
            legend.init();
        }
    }
};


