/*
 * @author     Martin Høgh <mh@mapcentia.com>
 * @copyright  2013-2018 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

'use strict';

import { LAYER } from './layerTree/constants';
const layerTreeUtils = require('./layerTree/utils');

const LOG = false;

let layersAlternationHistory = {};

/**
 *
 * @type {*|exports|module.exports}
 */
var backboneEvents, cloud, legend, layers, layerTree, meta;

/**
 *
 * @type {*|exports|module.exports}
 */
var pushState;

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
     * Enables vector layer
     * 
     * @param {String}  gc2Id         Layer name (with prefix)
     * @param {Boolean} doNotLegend   Specifies if legend should be re-generated
     * @param {Boolean} setupControls Specifies if layerTree controls should be setup
     * @param {Object}  failedBefore  Specifies if layer loading previously failed (used in recursive init() calling)
     * 
     * @returns {Promise}
     */
    enableVector: (gc2Id, doNotLegend, setupControls, failedBefore) => {
        if (LOG) console.log(`switchLayer: enableVector ${gc2Id}`);

        let vectorLayerId = LAYER.VECTOR + `:` + gc2Id;
        return new Promise((resolve, reject) => {
            layers.incrementCountLoading(vectorLayerId);
            layerTree.setSelectorValue(name, LAYER.VECTOR);

            let vectorDataStores = layerTree.getStores();
            if (vectorLayerId in vectorDataStores) {
                cloud.get().layerControl.addOverlay(vectorDataStores[vectorLayerId].layer, vectorLayerId);
                let existingLayer = cloud.get().getLayersByName(vectorLayerId);
                cloud.get().map.addLayer(existingLayer);
                vectorDataStores[vectorLayerId].load();

                backboneEvents.get().trigger("startLoading:layers", vectorLayerId);

                _self.checkLayerControl(vectorLayerId, doNotLegend, setupControls);
                resolve();
            } else if (failedBefore !== false) {
                if (failedBefore.reason === `NO_VECTOR_DATA_STORE`) {
                    console.error(`Failed to switch layer while attempting to get the vector data store for ${vectorLayerId} (probably it is not the vector layer)`);
                } else {
                    console.error(`Unknown switch layer failure for ${vectorLayerId}`);
                }

                resolve();
            } else {
                meta.init(gc2Id, true, true).then(layerMeta => {
                    // Trying to recreate the layer tree with updated meta and switch layer again
                    layerTree.create().then(() => {
                        // All layers are guaranteed to exist in meta
                        let currentLayers = layers.getLayers();
                        if (currentLayers && Array.isArray(currentLayers)) {
                            layers.getLayers().split(',').map(layerToActivate => {
                                _self.checkLayerControl(layerToActivate, doNotLegend, setupControls);
                            });
                        }

                        _self.init(vectorLayerId, true, false, false, true, {
                            reason: `NO_VECTOR_DATA_STORE`
                        }).then(() => {
                            resolve();
                        });
                    });
                }).catch(() => {
                    console.error(`Could not add ${gc2Id} vector layer`);
                    layers.decrementCountLoading(vectorLayerId);
                    resolve();
                });
            }
        });
    },

    /**
     * Enable raster tile vector
     * 
     * @param {String}  gc2Id         Layer name (with prefix)
     * @param {Boolean} forceReload   Specifies if the layer reload should be perfromed
     * @param {Boolean} doNotLegend   Specifies if legend should be re-generated
     * @param {Boolean} setupControls Specifies if layerTree controls should be setup
     * 
     * @returns {Promise}
     */
    enableRasterTile: (gc2Id, forceReload, doNotLegend, setupControls) => {
        if (LOG) console.log(`switchLayer: enableRasterTile ${gc2Id}`);

        return new Promise((resolve, reject) => {
            // Only one layer at a time, so using the raster tile layer identifier
            layers.incrementCountLoading(gc2Id);
            layerTree.setSelectorValue(gc2Id, LAYER.RASTER_TILE);
            layers.addLayer(gc2Id, [layerTree.getLayerFilterString(gc2Id)]).then(() => {
                _self.checkLayerControl(gc2Id, doNotLegend, setupControls);

                let cacheBuster = ``;
                if (forceReload) {
                    cacheBuster = Math.random();
                } else {
                    if (gc2Id in layersAlternationHistory) {
                        if (layersAlternationHistory[gc2Id].updatedLayerTypes.indexOf(LAYER.RASTER_TILE) === -1) {
                            layersAlternationHistory[gc2Id].updatedLayerTypes.push(LAYER.RASTER_TILE);
                            cacheBuster = Math.random();
                        }
                    }
                }

                // The WMS tile layer and single-tiled at the same time creates the L.nonTiledLayer.wms
                // which does not have the setUrl() method
                let rasterTileLayer = cloud.get().getLayersByName(gc2Id);
                if (`setUrl` in rasterTileLayer) {
                    rasterTileLayer.setUrl(rasterTileLayer._url + "?" + cacheBuster);
                    rasterTileLayer.redraw();
                }

                resolve();
            }).catch((err) => {
                meta.init(gc2Id, true, true).then(layerMeta => {
                    // Trying to recreate the layer tree with updated meta and switch layer again                           
                    layerTree.create().then(() => {
                        // All layers are guaranteed to exist in meta
                        let currentLayers = layers.getLayers();
                        if (currentLayers && Array.isArray(currentLayers)) {
                            layers.getLayers().split(',').map(layerToActivate => {
                                _self.checkLayerControl(layerToActivate, doNotLegend, setupControls);
                            });
                        }

                        _self.init(gc2Id, true).then(() => {
                            resolve();
                        });
                    });
                }).catch(() => {
                    console.error(`Could not add ${gc2Id} raster tile layer`);
                    layers.decrementCountLoading(gc2Id);
                    resolve();
                });
            });
        });
    },

    /**
     * Enable raster tile vector
     * 
     * @param {String}  gc2Id         Layer name (with prefix)
     * @param {Boolean} forceReload   Specifies if the layer reload should be perfromed
     * @param {Boolean} doNotLegend   Specifies if legend should be re-generated
     * @param {Boolean} setupControls Specifies if layerTree controls should be setup
     * 
     * @returns {Promise}
     */
    enableVectorTile: (gc2Id, forceReload, doNotLegend, setupControls) => {
        if (LOG) console.log(`switchLayer: enableVectorTile ${gc2Id}`);

        if (forceReload && forceReload === true) {
            console.warn(`Force reloading is not supported for vector tile layers`);
        }

        return new Promise((resolve, reject) => {
            try {

            let typedGc2Id = LAYER.VECTOR_TILE + `:` + gc2Id;
            layers.incrementCountLoading(typedGc2Id);
            layerTree.setSelectorValue(gc2Id, LAYER.VECTOR_TILE);

            let URLParameters = [layerTree.getLayerFilterString(gc2Id)];
            if (forceReload) {
                let cacheBuster = `cacheBuster=${Math.random()}`;
                layersAlternationHistory[gc2Id].cacheBuster = cacheBuster;
                URLParameters.push(cacheBuster);
            } else {
                if (gc2Id in layersAlternationHistory) {
                    if (layersAlternationHistory[gc2Id].updatedLayerTypes.indexOf(LAYER.VECTOR_TILE) === -1) {
                        layersAlternationHistory[gc2Id].updatedLayerTypes.push(LAYER.VECTOR_TILE);
                        let cacheBuster = `cacheBuster=${Math.random()}`;
                        layersAlternationHistory[gc2Id].cacheBuster = cacheBuster;
                        URLParameters.push(cacheBuster);
                    } else {
                        URLParameters.push(layersAlternationHistory[gc2Id].cacheBuster);
                    }
                }
            }

            console.log(`### URLParameters`, URLParameters);

            layers.addVectorTileLayer(gc2Id, URLParameters).then(() => {
                _self.checkLayerControl(typedGc2Id, doNotLegend, setupControls);
                resolve();
            }).catch((err) => {
                if (err) {
                    console.error(err);
                    reject();
                } else {
                    meta.init(gc2Id, true, true).then(layerMeta => {
                        // Trying to recreate the layer tree with updated meta and switch layer again                           
                        layerTree.create().then(() => {
                            // All layers are guaranteed to exist in meta
                            let currentLayers = layers.getLayers();
                            if (currentLayers && Array.isArray(currentLayers)) {
                                layers.getLayers().split(',').map(layerToActivate => {
                                    _self.checkLayerControl(layerToActivate, doNotLegend, setupControls);
                                });
                            }

                            _self.init(LAYER.VECTOR_TILE + `:` + gc2Id, true).then(() => {
                                resolve();
                            });
                        });
                    }).catch(() => {
                        console.error(`Could not add ${typedGc2Id} vector tile layer`);
                        layers.decrementCountLoading(typedGc2Id);
                        resolve();
                    });
                }
            });


            } catch(e) { console.log(e); }
        });
    },

    enableWebGL: (gc2Id) => {
        if (LOG) console.log(`switchLayer: enableWebGL ${gc2Id}`);

        let webGLLayerId = LAYER.WEBGL + `:` + gc2Id;
        return new Promise((resolve, reject) => {
            console.error(`Enabling of WebGL layers in not implemented yet (${webGLLayerId})`);
            resolve();
        });
    },

    /**
     * Registers layer data alternation, this way when is will be loaded next time in format, different
     * from the current one, the cache will be also updated (for example, cache busting will be
     * applied for raster and vector tiles)
     * 
     * @param {String} gc2Id Layer identifier
     * 
     * @returns {void}
     */
    registerLayerDataAlternation: (gc2Id) => {
        if (!gc2Id || gc2Id.indexOf(`:`) > -1) throw new Error(`Invalid layer identifier was provided`);
        layersAlternationHistory[gc2Id] = {
            updatedLayerTypes: [],
            cacheBuster: ``,
            registeredAt: new Date()
        };
    },

    /**
     * Toggles a layer on/off. If visible is true, layer is toggled off and vice versa.
     * 
     * @param {String}  name          Layer name (with prefix)
     * @param {Boolean} enable        Enable of disable layer
     * @param {Boolean} doNotLegend   Specifies if legend should be re-generated
     * @param {Boolean} forceReload   Specifies if the layer reload should be perfromed
     * @param {Boolean} setupControls Specifies if layerTree controls should be setup
     * @param {Object}  failedBefore  Specifies if layer loading previously failed (used in recursive init() calling)
     * 
     * @returns {Promise}
     */
    init: function (name, enable, doNotLegend, forceReload, setupControls = true, failedBefore = false) {
        if (LOG) console.log(`switchLayer: switch layer ${name} (enable: ${enable})`);

        if (!name) {
            throw new Error(`Layer name is undefined`);
        }

        let metaData = meta.getMetaData();
        for (let j = 0; j < metaData.data.length; j++) {
            let layerKey = (metaData.data[j].f_table_schema + '.' + metaData.data[j].f_table_name);
            if (layerKey === layerTreeUtils.stripPrefix(name)) {
                let layer = metaData.data[j];
                let { isVectorLayer, isRasterTileLayer, isVectorTileLayer } = layerTreeUtils.getPossibleLayerTypes(layer);
                let defaultLayerType = layerTreeUtils.getDefaultLayerType(layer);

                if (LOG) console.log(`switchLayer: ${name}, according to meta, is vector (${isVectorLayer}), raster tile (${isRasterTileLayer}), vector tile (${isVectorTileLayer})`);
                if (!isVectorLayer && name.startsWith(LAYER.VECTOR + `:`)
                    || !isRasterTileLayer && (name.startsWith(LAYER.RASTER_TILE + `:`) || name.indexOf(`:`) === -1)
                    || !isVectorTileLayer && name.startsWith(LAYER.VECTOR_TILE + `:`)) {
                    console.log(`No selected representation for ${name}, requesting the default representation instead`);

                    name = layerTreeUtils.stripPrefix(name);
                    if (defaultLayerType.length > 0 && defaultLayerType !== LAYER.RASTER_TILE) {
                        name = defaultLayerType + `:` + name;
                    }
                }

                break;
            }
        }

        let gc2Id = layerTreeUtils.stripPrefix(name);
        let applicationWideControls = $(`*[data-gc2-id="${gc2Id}"]`);
        applicationWideControls.prop('checked', enable);
        let result = new Promise((resolve, reject) => {
            try {
            let vectorDataStores = layerTree.getStores();

            let vectorLayerId = LAYER.VECTOR + `:` + gc2Id;
            let vectorTileLayerId = LAYER.VECTOR_TILE + `:` + gc2Id;

            let rasterTileLayer = cloud.get().getLayersByName(gc2Id);
            let vectorLayer = cloud.get().getLayersByName(vectorLayerId);
            let vectorTileLayer = cloud.get().getLayersByName(vectorTileLayerId);

            if (rasterTileLayer) cloud.get().map.removeLayer(rasterTileLayer);
            if (vectorLayer) cloud.get().map.removeLayer(vectorLayer);
            if (vectorTileLayer) cloud.get().map.removeLayer(vectorTileLayer);

            if (vectorDataStores[vectorLayerId]) {
                vectorDataStores[vectorLayerId].abort();
                vectorDataStores[vectorLayerId].reset();
            }

            if (enable) {
                if (LOG) console.log(`switchLayer: enabling ${name}`);
                if (name.startsWith(LAYER.VECTOR + ':')) {
                    _self.enableVector(gc2Id, doNotLegend, setupControls, failedBefore).then(resolve);
                } else if (name.startsWith(LAYER.VECTOR_TILE + ':')) {
                    _self.enableVectorTile(gc2Id, forceReload, doNotLegend, setupControls).then(resolve);
                } else if (name.startsWith(LAYER.WEBGL + ':')) {
                    _self.enableWebGL(gc2Id).then(resolve);
                } else {
                    _self.enableRasterTile(gc2Id, forceReload, doNotLegend, setupControls).then(resolve);
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
            let controlElement = $('input[class="js-show-layer-control"][data-gc2-id="' + layerTreeUtils.stripPrefix(layerName) + '"]');
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
                if (layerName.indexOf(LAYER.VECTOR + `:`) === 0) {
                    layerTree.setupLayerControls(LAYER.VECTOR, layerName, true, enable);
                } else if (layerName.indexOf(LAYER.VECTOR_TILE + `:`) === 0) {
                    layerTree.setupLayerControls(LAYER.VECTOR_TILE, layerName, true, enable);
                } else if (layerName.indexOf(LAYER.WEBGL + `:`) === 0) {
                    layerTree.setupLayerControls(LAYER.WEBGL, layerName, true, enable);
                } else {
                    layerTree.setupLayerControls(LAYER.RASTER_TILE, layerName, true, enable);
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

