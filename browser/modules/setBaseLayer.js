/**
 * @fileoverview Description of file, its uses and information
 * about its dependencies.
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
        var u, l, str;

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
                    if (typeof v.overlays === "object") {
                        for (u = 0; u < v.overlays.length; u = u + 1) {
                            l = cloud.get().addTileLayers($.extend({
                                layers: [v.overlays[u].id],
                                db: v.overlays[u].db,
                                host: v.overlays[u].host || "",
                                type: "tms",
                                loadEvent: function () {

                                },
                                loadingEvent: function () {

                                }
                            }, v.overlays[u].config));
                            // Set prefix on id, so the layer will not be returned by layers.getLayers
                            l[0].id = "__hidden." + v.overlays[u].id;
                        }
                    }
                }
            });
        }

        cloud.get().setBaseLayer(str,
            function () {
                backboneEvents.get().trigger("doneLoading:setBaselayer");
            },
            function () {
                backboneEvents.get().trigger("startLoading:setBaselayer");
            }
        );

        $('*[data-gc2-base-id="' + str + '"] input').prop('checked', true);

        pushState.init();
    }
};