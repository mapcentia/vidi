/*
 * @author     Martin Høgh <mh@mapcentia.com>
 * @copyright  2013-2018 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

'use strict';

import {LAYER} from './layerTree/constants';

const layerTreeUtils = require('./layerTree/utils');

const LOG = false;

let layersAlternationHistory = {};

let layersEnabledStatus = {};

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
     * Returns enabled status of previously switched layers
     */
    getLayersEnabledStatus: () => {
        return layersEnabledStatus;
    },

    /**
     * Loads missing meta for layer
     *
     * @returns {Promise}
     */
    loadMissingMeta: (gc2Id) => {
        let loadedSchema = gc2Id;
        if (gc2Id.split(`.`).length === 2) {
            loadedSchema = gc2Id.split(`.`)[0];
        }

        //return meta.init(loadedSchema, true, true);
        return meta.init(gc2Id, true, true);
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
        _self.enableCheckBoxesOnChildren(gc2Id);
        let vectorLayerId = LAYER.VECTOR + `:` + gc2Id;
        return new Promise((resolve, reject) => {
            layers.incrementCountLoading(vectorLayerId);
            layerTree.setSelectorValue(name, LAYER.VECTOR);
            let vectorDataStores = layerTree.getStores();
            if (vectorLayerId in vectorDataStores) {
                let parentFilters = layerTree.getParentLayerFilters(gc2Id);
                let parentFiltersHash = btoa(JSON.stringify(parentFilters));
                if (vectorDataStores[vectorLayerId].defaults.parentFiltersHash !== parentFiltersHash) {
                    let layerMeta = meta.getMetaByKey(gc2Id);
                    layerTree.createStore(layerMeta);
                    vectorDataStores = layerTree.getStores();
                }

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
                    console.error(`Unknown switch layer failure for ${vectorLayerId}`, failedBefore);
                }

                resolve();
            } else {
                _self.loadMissingMeta(gc2Id).then(() => {
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
     *
     * @param gc2Id
     * @returns {Promise<any>}
     */
    enableUTFGrid: (gc2Id) => {
        let id = gc2Id;
        return new Promise((resolve, reject) => {
            layers.addUTFGridLayer(id).then(() => {
            }).catch((err) => {
                console.error(`Could not add ${id} UTFGrid tile layer`);
                resolve();
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
    enableRasterTile: (gc2Id, forceReload, doNotLegend, setupControls) => {
        if (LOG) console.log(`switchLa.yer: enableRasterTile ${gc2Id}`);

        return new Promise((resolve, reject) => {
            // Only one layer at a time, so using the raster tile layer identifier
            layers.incrementCountLoading(gc2Id);
            layerTree.setSelectorValue(gc2Id, LAYER.RASTER_TILE);
            _self.enableCheckBoxesOnChildren(gc2Id);

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
                let rasterTileLayer = cloud.get().getLayersByName(gc2Id, false);
                if (`setUrl` in rasterTileLayer) {
                    rasterTileLayer.setUrl(rasterTileLayer._url + "?" + cacheBuster);
                    rasterTileLayer.redraw();
                }
                // Enable the corresponding UTF grid layer
                // TODO check "mouseover" properties in fieldConf. No need to switch on if mouse over is not wanted
                _self.enableUTFGrid(gc2Id);
                resolve();
            }).catch(err => {
                if (err) {
                    console.warn(`Unable to add layer ${gc2Id}, trying to get meta for it`);
                }

                _self.loadMissingMeta(gc2Id).then(() => {
                    // Trying to recreate the layer tree with updated meta and switch layer again                           
                    layerTree.create().then(() => {
                        // All layers are guaranteed to exist in meta
                        let currentLayers = layers.getLayers();
                        if (currentLayers && Array.isArray(currentLayers)) {
                            layers.getLayers().split(',').map(layerToActivate => {
                                _self.checkLayerControl(layerToActivate, doNotLegend, setupControls);
                            });
                        }

                        _self.init(gc2Id, true).then(resolve);
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

                layers.addVectorTileLayer(gc2Id, URLParameters).then(() => {
                    _self.checkLayerControl(typedGc2Id, doNotLegend, setupControls);
                    resolve();
                }).catch((err) => {
                    if (err) {
                        console.warn(`Unable to add layer ${gc2Id}, trying to get meta for it`);
                    }

                    _self.loadMissingMeta(gc2Id).then(() => {
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
                });
            } catch (e) {
                console.log(e);
            }
        });
    },

    /**
     * Enables WebGL layer
     *
     * @param {String}  gc2Id         Layer name (with prefix)
     * @param {Boolean} doNotLegend   Specifies if legend should be re-generated
     * @param {Boolean} setupControls Specifies if layerTree controls should be setup
     * @param {Object}  failedBefore  Specifies if layer loading previously failed (used in recursive init() calling)
     *
     * @returns {Promise}
     */
    enableWebGL: (gc2Id, doNotLegend, setupControls, failedBefore) => {
        if (LOG) console.log(`switchLayer: enableWebGL ${gc2Id}`);

        let webGLLayerId = LAYER.WEBGL + `:` + gc2Id;
        return new Promise((resolve, reject) => {

            try {
                layers.incrementCountLoading(webGLLayerId);
                layerTree.setSelectorValue(name, LAYER.WEBGL);

                let webGLDataStores = layerTree.getWebGLStores();
                if (webGLLayerId in webGLDataStores) {
                    backboneEvents.get().trigger("startLoading:layers", webGLLayerId);
                    webGLDataStores[webGLLayerId].load(true, () => {
                        cloud.get().layerControl.addOverlay(webGLDataStores[webGLLayerId].layer, webGLLayerId);
                        let existingLayer = cloud.get().getLayersByName(webGLLayerId);
                        cloud.get().map.addLayer(existingLayer);
                        _self.checkLayerControl(webGLLayerId, doNotLegend, setupControls);

                        resolve();
                    });
                } else if (failedBefore !== false) {
                    if (failedBefore.reason === `NO_WEBGL_DATA_STORE`) {
                        console.error(`Failed to switch layer while attempting to get the WebGL data store for ${webGLLayerId} (probably it is not the WebGL layer)`);
                    } else {
                        console.error(`Unknown switch layer failure for ${webGLLayerId}`);
                    }

                    resolve();
                } else {
                    _self.loadMissingMeta(gc2Id).then(() => {
                        // Trying to recreate the layer tree with updated meta and switch layer again
                        layerTree.create().then(() => {
                            // All layers are guaranteed to exist in meta
                            let currentLayers = layers.getLayers();
                            if (currentLayers && Array.isArray(currentLayers)) {
                                layers.getLayers().split(',').map(layerToActivate => {
                                    _self.checkLayerControl(layerToActivate, doNotLegend, setupControls);
                                });
                            }

                            _self.init(webGLLayerId, true, false, false, true, {
                                reason: `NO_WEBGL_DATA_STORE`
                            }).then(() => {
                                resolve();
                            });
                        });
                    }).catch(() => {
                        console.error(`Could not add ${gc2Id} WebGL layer`);
                        layers.decrementCountLoading(webGLLayerId);
                        resolve();
                    });
                }


            } catch (e) {
                console.log(e);
            }
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

        layersEnabledStatus[layerTreeUtils.stripPrefix(name)] = {
            enabled: enable,
            fullLayerKey: name
        };

        let metaData = meta.getMetaData();
        for (let j = 0; j < metaData.data.length; j++) {
            let layerKey = (metaData.data[j].f_table_schema + '.' + metaData.data[j].f_table_name);
            if (layerKey === layerTreeUtils.stripPrefix(name)) {
                let layer = metaData.data[j];
                let {isVectorLayer, isRasterTileLayer, isVectorTileLayer} = layerTreeUtils.getPossibleLayerTypes(layer);
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
            let vectorDataStores = layerTree.getStores();

            let vectorLayerId = LAYER.VECTOR + `:` + gc2Id;
            let vectorTileLayerId = LAYER.VECTOR_TILE + `:` + gc2Id;
            let webGLLayerId = LAYER.WEBGL + `:` + gc2Id;

            let rasterTileLayer = cloud.get().getLayersByName(gc2Id, false);
            let vectorLayer = cloud.get().getLayersByName(vectorLayerId, false);
            let vectorTileLayer = cloud.get().getLayersByName(vectorTileLayerId, false);
            let webGLLayer = cloud.get().getLayersByName(webGLLayerId, false);

            if (rasterTileLayer) cloud.get().map.removeLayer(rasterTileLayer);
            if (vectorLayer) cloud.get().map.removeLayer(vectorLayer);
            if (vectorTileLayer) cloud.get().map.removeLayer(vectorTileLayer);
            if (webGLLayer) cloud.get().map.removeLayer(webGLLayer);

            if (vectorDataStores[vectorLayerId]) {
                vectorDataStores[vectorLayerId].abort();
                vectorDataStores[vectorLayerId].reset();
            }

            // Always trig tileLayerVisibility with false
            backboneEvents.get().trigger("tileLayerVisibility:layers", {
                id: gc2Id,
                dataIsVisible: false
            });

            if (enable) {
                if (LOG) console.log(`switchLayer: enabling ${name}`);
                if (name.startsWith(LAYER.VECTOR + ':')) {
                    _self.enableVector(gc2Id, doNotLegend, setupControls, failedBefore).then(resolve);
                } else if (name.startsWith(LAYER.VECTOR_TILE + ':')) {
                    _self.enableVectorTile(gc2Id, forceReload, doNotLegend, setupControls).then(resolve);
                } else if (name.startsWith(LAYER.WEBGL + ':')) {
                    _self.enableWebGL(gc2Id, doNotLegend, setupControls, failedBefore).then(resolve);
                } else {
                    _self.enableRasterTile(gc2Id, forceReload, doNotLegend, setupControls).then(resolve);
                }

                layers.reorderLayers();
            } else {
                _self.uncheckLayerControl(name, doNotLegend, setupControls);
                //Remove UTF grid layer
                _self._removeUtfGrid(name);
                resolve();
            }
        });

        return result;
    },

    /**
     * Toggles the layer control
     */
    _toggleLayerControl: (enable = false, layerName, doNotLegend, setupControls) => {
        if (setupControls) {
            if (layerName.indexOf(LAYER.VECTOR + `:`) === 0) {
                layerTree.setLayerState(LAYER.VECTOR, layerName, true, enable);
            } else if (layerName.indexOf(LAYER.VECTOR_TILE + `:`) === 0) {
                layerTree.setLayerState(LAYER.VECTOR_TILE, layerName, true, enable);
            } else if (layerName.indexOf(LAYER.WEBGL + `:`) === 0) {
                layerTree.setLayerState(LAYER.WEBGL, layerName, true, enable);
            } else {
                layerTree.setLayerState(LAYER.RASTER_TILE, layerName, true, enable);
            }
        }

        let controlElement = $('input[class="js-show-layer-control"][data-gc2-id="' + layerTreeUtils.stripPrefix(layerName) + '"]');
        if (controlElement.length === 1) {
            var siblings = $(controlElement).parents(".accordion-body").find("input.js-show-layer-control"), c = 0;

            $.each(siblings, function (i, v) {
                if (v.checked) {
                    c = c + 1;
                }
            });

            $(controlElement).parents(".panel-layertree").find("span:eq(0)").html(c);
        }

        pushState.init();
        if (!doNotLegend && (window.vidiConfig.removeDisabledLayersFromLegend ? true : enable)) {
            legend.init();
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
     * Remove hidden UTF grid layer
     * @param layerName
     * @private
     */
    _removeUtfGrid: (layerName) => {
        if (LOG) console.log(`switchLayer: _removeUtfGrid ${layerName}`);
        let id = "__hidden.utfgrid." + layerName;
        cloud.get().map.eachLayer(function (layer) {
            if (layer.id === id) {
                cloud.get().map.removeLayer(layer);
            }
        });
    },

    /**
     * Finds child layers and enables their check boxes if the parent layer is filtered. Have only effect if the child layers have the disable_check_box GC2 property
     *
     * @param {string} layerKey Layer identifier
     */
    enableCheckBoxesOnChildren: (layerKey) => {
        let childLayersThatShouldBeEnabled = layerTree.getChildLayersThatShouldBeEnabled();
        let parsedMeta = meta.parseLayerMeta(layerKey);
        let activeFilters = layerTree.getActiveLayerFilters(layerKey);
        if (parsedMeta && 'referenced_by' in parsedMeta && parsedMeta.referenced_by && activeFilters.length > 0) {
            JSON.parse(parsedMeta.referenced_by).forEach((i) => {
                // Store keys in array, so when re-rendering the layer tree, it can pick up which layers to enable
                if (childLayersThatShouldBeEnabled.indexOf(i.rel) === -1) {
                    childLayersThatShouldBeEnabled.push(i.rel);
                }
                $(`*[data-gc2-id="${i.rel}"]`).prop(`disabled`, false);
                $(`[data-gc2-layer-key^="${i.rel}."]`).find(`.js-layer-is-disabled`).css(`visibility`, `hidden`);

            })
        }
        if (parsedMeta && 'referenced_by' in parsedMeta && parsedMeta.referenced_by && activeFilters.length === 0) {
            JSON.parse(parsedMeta.referenced_by).forEach((i) => {
                let parsedMetaChildLayer = meta.parseLayerMeta(i.rel);
                if ('disable_check_box' in parsedMetaChildLayer && parsedMetaChildLayer.disable_check_box) {
                    childLayersThatShouldBeEnabled = childLayersThatShouldBeEnabled.filter(item => item !== i.rel);
                    _self.init(i.rel, false, true, false);
                    $(`*[data-gc2-id="${i.rel}"]`).prop(`disabled`, true);
                    $(`[data-gc2-layer-key^="${i.rel}"]`).find(`.js-layer-is-disabled`).css(`visibility`, `visible`);
                }
            })
        }
        layerTree.setChildLayersThatShouldBeEnabled(childLayersThatShouldBeEnabled);
    }
};
