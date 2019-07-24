/*
 * @author     Martin Høgh <mh@mapcentia.com>
 * @copyright  2013-2018 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

'use strict';

import layerTreeUtils from './layerTree/utils';

/**
 * @type {*|exports|module.exports}
 */
var cloud;

/**
 * @type {*|exports|module.exports}
 */
var pushState;

var layers;

var baseLayer;

var backboneEvents;

var activeBaseLayer;

var _self = false;

var failedLayers = [];

var jquery = require('jquery');
require('snackbarjs');
/**
 *
 * @type {{set: module.exports.set, init: module.exports.init}}
 */
module.exports = module.exports = {
    set: function (o) {
        cloud = o.cloud;
        pushState = o.pushState;
        layers = o.layers;
        baseLayer = o.baseLayer;
        backboneEvents = o.backboneEvents;

        _self = this;
        return this;
    },
    init: function (str) {
        let result = new Promise((resolve, reject) => {
            var u, l;
            layers.removeHidden();
            if (!cloud.get().getLayersByName(str)) {
                let layerAddedFromConfiguration = baseLayer.addBaseLayer(str);
                if (layerAddedFromConfiguration) {
                    console.info(str + " is added as base layer (from base layers configuration)");
                } else {
                    let newBaseLayer = false;
                    if (window.setBaseLayers && window.setBaseLayers.length > 0) {
                        newBaseLayer = window.setBaseLayers[0].id;
                    } else {
                        throw new Error(`Please set at least one base layer in configuration`);
                    }

                    if (str.split(".")[1] && layerTreeUtils.isVectorTileLayerId(str) === false) {
                        /*
                        // @todo Remove in next releases, currently if the GC2 layer is set as a base one, it should have been already added above
                        // If this is enabled, keep in mind that GC2 layers, enabled as base ones, should emit base layers events upon loading
                        layers.addLayer(str, [], true);
                        */

                        console.warn(`${str} was not added as base layer (GC2 layer should be set as a base one in cofiguration as well), selecting first available (${newBaseLayer})`);
                    } else {
                        console.warn(`${str} was not added as base layer, selecting first available (${newBaseLayer})`);
                    }

                    str = newBaseLayer;
                    baseLayer.addBaseLayer(str);
                }
            }

            if (typeof window.setBaseLayers !== "undefined") {
                $.each(window.setBaseLayers, function (i, v) {
                    if (v.id === str) {
                        activeBaseLayer = v;
                        if (typeof v.overlays === "object") {
                            for (u = 0; u < v.overlays.length; u = u + 1) {
                                const layerName = v.overlays[u].id;
                                l = cloud.get().addTileLayers($.extend({
                                    layers: [v.overlays[u].id],
                                    db: v.overlays[u].db,
                                    host: v.overlays[u].host || "",
                                    type: "tms",
                                    loadEvent: function () {
                                        layers.decrementCountLoading(layerName);
                                        backboneEvents.get().trigger("doneLoading:layers", layerName);
                                    },
                                    loadingEvent: function () {
                                        layers.incrementCountLoading(layerName);
                                        backboneEvents.get().trigger("startLoading:layers", layerName);
                                    },
                                }, v.overlays[u].config));

                                // Set prefix on id, so the layer will not be returned by layers.getLayers
                                l[0].id = "__hidden." + v.overlays[u].id;
                            }
                        }
                    }
                });
            }

            let numberOfErroredTiles = 0, timerHasStarted = false;
            let alreadyLoaded = false;
            cloud.get().setBaseLayer(str, (e) => {
                // _tileReady() in src/layer/tile/GridLayer.js@879 is firing more than once on first load for
                // MVT layers, so the single time event firing guard was added
                if (layerTreeUtils.isVectorTileLayerId(str)) {
                    if (alreadyLoaded) return;
                    alreadyLoaded = true;
                }

                // If 100 tiles fails within 10 secs the next base layer is chosen
                if (numberOfErroredTiles > 100) {
                    jquery.snackbar({
                        content: `Base layer ${str} was loaded with errors (${numberOfErroredTiles} tiles failed to load), trying to load next layer`,
                        htmlAllowed: true,
                        timeout: 7000
                    });

                    let alternativeLayer = false;
                    failedLayers.push(str);
                    window.setBaseLayers.map(item => {
                        if (failedLayers.indexOf(item.id) === -1) {
                            alternativeLayer = item.id;
                            return false;
                        }
                    });

                    backboneEvents.get().trigger("doneLoading:setBaselayer", str);
                    if (alternativeLayer === false) {
                        console.error(`Unable to load any of available base layers`);
                    } else {
                        setTimeout(() => {
                            _self.init(alternativeLayer);
                        });
                    }
                } else {
                    backboneEvents.get().trigger("doneLoading:setBaselayer", str);
                    if (!timerHasStarted) {
                        timerHasStarted = true;
                        setTimeout(() => {
                            numberOfErroredTiles = 0;
                            timerHasStarted = false;
                            console.log("Timer for failed tiles was reset")
                        }, 10000)
                    }
                }
            }, (e) => {
                if (layerTreeUtils.isVectorTileLayerId(str)) {
                    alreadyLoaded = false;
                }

                backboneEvents.get().trigger("startLoading:setBaselayer", str);
            }, (e) => {
                numberOfErroredTiles++;
            }, () => {
                console.warn(`Base layer ${str} was not found, switching to first available base layer`);
                if (window.setBaseLayers && window.setBaseLayers.length > 0) {
                    _self.init(window.setBaseLayers[0].id).then(resolve);
                } else {
                    throw new Error(`No default layers were set`);
                }
            });

            baseLayer.redraw(str);

            pushState.init();

            resolve();
        });

        return result;
    },

    getActiveBaseLayer: () => {
        return activeBaseLayer;
    }
};