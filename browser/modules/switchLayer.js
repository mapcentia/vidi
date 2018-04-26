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
var layerTree;

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
        layerTree = o.layerTree;
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
    init: function (name, enable, doNotLegend, layerType, forceTileReload) {
        let store = layerTree.getStores();
        var me = this, el = $('*[data-gc2-id="' + name + '"]');

        if (!layerType || ['tile', 'vector'].indexOf(layerType) === -1) {
            throw new Error('Invalid layer type was provided');
        }

        const removeTileLayer = (id) => {
            cloud.get().map.removeLayer(cloud.get().getLayersByName(id));
        };

        const removeVectorLayer = (id) => {
            if (store[id]) {
                store[id].abort();
                store[id].reset();
            }

            cloud.get().map.removeLayer(cloud.get().getLayersByName(id));
        };

        let id = 'v:' + name;

        let layer = cloud.get().getLayersByName(name);
        let vectorLayer = cloud.get().getLayersByName(id);

        if (layer && layerType === 'vector') removeTileLayer(name);
        if (vectorLayer && layerType === 'tile') removeVectorLayer(id);

        if (enable) {
            if (id in store === false && layerType === 'vector') {
                throw new Error('No specified layer in store');
            }

            // Always removing layer from the map if it exists
            if (layer) {
                cloud.get().map.removeLayer(layer);
            }
console.log('forceTileReload', forceTileReload);
            if (layer && layer.type === layerType) {
                // Layer already exists and has the same type, then no need to recreate

                if (forceTileReload) {
                    layer.setUrl(layer._url + "?" + Math.random() + "&");
                    layer.redraw();
                }

                cloud.get().map.addLayer(layer);
                me.update(doNotLegend, el);
            } else {
                // Creating new layer
                if (layerType === 'tile') {
                    layers.addLayer(name, layerType).then(() => {
                        let createdLayer = cloud.get().getLayersByName(name);

                        if (forceTileReload) {
                            createdLayer.setUrl(createdLayer._url + "?" + Math.random() + "&");
                            createdLayer.redraw();
                        }

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
            if (layerType === 'tile' && layer) {
                removeTileLayer(name);
            } else if (layerType === 'vector' && vectorLayer) {
                removeVectorLayer(id);
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


