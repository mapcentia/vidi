/**
 * @fileoverview Description of file, its uses and information
 * about its dependencies.
 */

'use strict';

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

/**
 *
 * @type {*|exports|module.exports}
 */
var layerTree;

var tries = 0;

/**
 *
 * @type {{set: module.exports.set, init: module.exports.init}}
 */
module.exports = module.exports = {
    set: function (o) {
        cloud = o.cloud;
        legend = o.legend;
        layers = o.layers;
        pushState = o.pushState;
        meta = o.meta;
        backboneEvents = o.backboneEvents;
        layerTree = o.layerTree;
        return this;
    },
    /**
     * Toggles a layer on/off. If visible is true, layer is toggled off and vice versa.
     * @param name {string}
     * @param visible {boolean}
     * @param doNotLegend {boolean}
     */
    init: function (name, visible, doNotLegend) {
        var me = this, el = $('*[data-gc2-id="' + name + '"]');
        if (visible) {

            try {

                cloud.get().map.addLayer(cloud.get().getLayersByName(name));
                me.update(doNotLegend, el);
                tries = 0;

            } catch (e) {

                layers.addLayer(name)

                    .then(

                        function () {
                            tries = 0;
                            cloud.get().map.addLayer(cloud.get().getLayersByName(name));
                            me.update(doNotLegend, el);

                            try {
                                cloud.get().map.addLayer(cloud.get().getLayersByName(name + "_vidi_utfgrid"));
                                el.prop('checked', true);
                            } catch (e) {
                                //console.error(e.message);
                            }

                        },

                        // If layer is not in Meta we load meta from GC2 and init again in a recursive call
                        function () {
                            console.log("Layer " + name + " not in Meta");
                            meta.init(name, true).then(
                                function () {

                                    if (tries > 0) {
                                        alert("Could not add layer")
                                        return;
                                    }

                                    layerTree.init();
                                    tries = 1;
                                    me.init(name, true); // recursive
                                }
                            );
                        }
                    );

            } finally {
                el.prop('checked', true);
            }

            try {
                cloud.get().map.addLayer(cloud.get().getLayersByName(name + "_vidi_utfgrid"));
                el.prop('checked', true);
            } catch (e) {
                //console.error(e.message);
            }

        } else {

            cloud.get().map.removeLayer(cloud.get().getLayersByName(name));

            try {
                cloud.get().map.removeLayer(cloud.get().getLayersByName(name + "_vidi_utfgrid"));
            } catch (e) {
                //Pass
            }
            el.prop('checked', false);

            me.update(doNotLegend, el);
        }


    },

    update: function (doNotLegend, el) {
        var siblings = el.parents(".accordion-body").find("input"), c = 0;

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


