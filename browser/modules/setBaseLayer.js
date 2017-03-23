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
        backboneEvents = o.backboneEvents;

        return this;
    },
    init: function (str) {
        var u, l;
        layers.removeHidden();
        if (typeof window.setBaseLayers !== "undefined") {
            $.each(window.setBaseLayers, function (i, v) {
                if (v.id === str) {
                    if (typeof v.overlays === "object") {
                        for (u = 0; u < v.overlays.length; u = u + 1) {
                            l = cloud.get().addTileLayers($.extend({
                                layers: [v.overlays[u].id],
                                db: v.overlays[u].db,
                                // TODO Set host
                                //host: v.overlays[u].host || null,
                                type: "tms",
                                loadEvent: function () {
                                    backboneEvents.get().trigger("doneLoading:layers", layers.incrementCount());
                                }
                            }, v.overlays[u].config));
                            // Set prefix on id, so the layer will not be returned by layers.getLayers
                            l[0].id = "__hidden." + v.overlays[u].id;
                        }
                    }
                }
            });
        }
        cloud.get().setBaseLayer(str, function () {
            backboneEvents.get().trigger("doneLoading:setBaselayer");
        });
        pushState.init();
    }
};