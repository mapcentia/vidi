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

/**
 *
 * @type {{set: module.exports.set, init: module.exports.init}}
 */
module.exports = module.exports = {
    set: function (o) {
        cloud = o.cloud;
        pushState = o.pushState;
        layers = o.layers;
        return this;
    },
    init: function (str) {
        var u, l;
        layers.removeHidden();
        if (typeof vidiConfig.baseLayers !== "undefined") {
            $.each(vidiConfig.baseLayers, function (i, v) {
                if (v.id === str) {
                    if (typeof v.overlays === "object") {
                        for (u = 0; u < v.overlays.length; u = u + 1) {
                            l = cloud.get().addTileLayers($.extend({
                                layers: [v.overlays[u].id],
                                db: v.overlays[u].db,
                                type: "tms"
                            }, v.overlays[u].config));
                            // Set prefix on id, so the layer will not be returned by layers.getLayers
                            l[0].id = "__hidden." + v.overlays[u].id;
                        }
                    }
                }
            });
        }
        cloud.get().setBaseLayer(str);
        pushState.init();
    }
};