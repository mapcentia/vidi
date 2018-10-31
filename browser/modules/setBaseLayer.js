/*
 * @author     Martin Høgh <mh@mapcentia.com>
 * @copyright  2013-2018 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

'use strict';

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

        return this;
    },
    init: function (str) {
        let result = new Promise((resolve, reject) => {
            var u, l;
            layers.removeHidden();
            if (!cloud.get().getLayersByName(str)) {
                baseLayer.addBaseLayer(str);
                // If the layer looks like a GC2 layer, then add it as a normal GC2 layer
                if (str.split(".")[1]) {
                    layers.addLayer(str);
                }
                console.info(str + " is added as base layer.");
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

            cloud.get().setBaseLayer(str, (e) => {
                backboneEvents.get().trigger("doneLoading:setBaselayer", str);
            }, (e) => {
                backboneEvents.get().trigger("startLoading:setBaselayer", str);
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