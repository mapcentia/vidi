/**
 * @fileoverview Description of file, its uses and information
 * about its dependencies.
 */

'use strict';

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
var pushState;

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
        backboneEvents = o.backboneEvents;
        return this;
    },

    /**
     * Toggles a layer on/off. If visible is true, layer is toggled off and vice versa.
     * @param name {string}
     * @param enable {boolean}
     * @param doNotLegend {boolean}
     * @param layerType {string}
     */
    init: function (name, enable, doNotLegend, layerType, store = []) {
        var me = this, el = $('*[data-gc2-id="' + name + '"]');

        if (!layerType || ['tile', 'vector'].indexOf(layerType) === -1) {
            throw new Error('Invalid layer type was provided');
        }

/*
if (visible) {

            el.parent().siblings().children().addClass("fa-spin");

            try {

                cloud.get().map.addLayer(cloud.get().getLayersByName(id));

            }

            catch (e) {

                console.info(id + " added to the map.");

                cloud.get().layerControl.addOverlay(store[id].layer, id);
                cloud.get().map.addLayer(cloud.get().getLayersByName(id));

            }

            finally {

                store[id].load();
                el.prop('checked', true);
                layers.incrementCountLoading(id);
                backboneEvents.get().trigger("startLoading:layers", id);
            }

        } else {
            if (store[id]) {
                store[id].abort();
                store[id].reset();
            }

            cloud.get().map.removeLayer(cloud.get().getLayersByName(id));
            el.prop('checked', false);

        }
*/
console.log('$$$ DATA', store, me);
        let id = 'v:' + name;
        if (id in store === false && layerType === 'vector') {
            throw new Error('No specified layer in store');
        }

        let layer = cloud.get().getLayersByName(name);
        if (enable) {
            // Always removing layer from the map if it exists
            if (layer) {
                cloud.get().map.removeLayer(layer);
            }

            if (layer && layer.type === layerType) {
                // Layer already exists and has the same type, then no need to recreate
                cloud.get().map.addLayer(layer);
                me.update(doNotLegend, el);
            } else {
                // Creating new layer
                if (layerType === 'tile') {
                    layers.addLayer(name, layerType).then(() => {
                        let createdLayer = cloud.get().getLayersByName(name);

                        cloud.get().map.addLayer(createdLayer);
                        me.update(doNotLegend, el);
                    });
                } else {
                    cloud.get().layerControl.addOverlay(store[id].layer, id);
                    cloud.get().map.addLayer(cloud.get().getLayersByName(id));
                    store[id].load();

                    layers.incrementCountLoading(id);
                    backboneEvents.get().trigger("startLoading:layers", id);
                }
            }

            el.prop('checked', true);
        } else {
            if (layer) {
                cloud.get().map.removeLayer(layer);
            }

            if (layerType === 'vector') {
                store[id].abort();
                store[id].reset();
            }

            el.prop('checked', false);
            me.update(doNotLegend, el);
        }
    },

    /**
     * Updates the number of active layers indicator for the tab
     */
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


