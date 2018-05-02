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
 * @type {*|exports|module.exports}
 */
var tileLayersCacheBuster = 0;

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
    init: function (name, enable, doNotLegend, forceTileReload) {
        let store = layerTree.getStores();
        var me = this, el = $('*[data-gc2-id="' + name + '"]');

        let layer = cloud.get().getLayersByName(name);
        let layerType, tileLayerId, vectorLayerId;
        if (name.startsWith('v:')) {
            tileLayerId   = name.replace('v:', '');
            vectorLayerId = name;
            layerType     = 'vector';
        } else {
            tileLayerId   = name;
            vectorLayerId = 'v:' + name;
            layerType     = 'tile';
        }

        let tileLayer   = cloud.get().getLayersByName(tileLayerId);
        let vectorLayer = cloud.get().getLayersByName(vectorLayerId);

        if (tileLayer) cloud.get().map.removeLayer(tileLayer);
        if (vectorLayer) cloud.get().map.removeLayer(vectorLayer);

        if (store[vectorLayerId]) {
            store[vectorLayerId].abort();
            store[vectorLayerId].reset();
        }

        console.log('### switchLayer', name);
        if (enable) {
            if (layerType === 'tile') {
                layers.addLayer(name).then(() => {
                    tileLayer = cloud.get().getLayersByName(tileLayerId);

                    if (forceTileReload) {
                        tileLayersCacheBuster = Math.random();
                    }

                    tileLayer.setUrl(tileLayer._url + "?" + tileLayersCacheBuster);
                    tileLayer.redraw();

                    cloud.get().map.addLayer(tileLayer);
                    me.update(doNotLegend, el);
                });
            } else {
                if (vectorLayerId in store === false) {
                    throw new Error('No specified layer in store');
                }

                cloud.get().layerControl.addOverlay(store[vectorLayerId].layer, vectorLayerId);
                let existingLayer = cloud.get().getLayersByName(vectorLayerId);
                cloud.get().map.addLayer(existingLayer);
                store[vectorLayerId].load();

                layers.incrementCountLoading(vectorLayerId);
                backboneEvents.get().trigger("startLoading:layers", vectorLayerId);
            }

            el.prop('checked', true);
        } else {
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


