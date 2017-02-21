/**
 * @fileoverview Description of file, its uses and information
 * about its dependencies.
 */

'use strict';

/**
 *
 * @type {*|exports|module.exports}
 */
var urlparser = require('./urlparser');

/**
 * @type {string}
 */
var db = urlparser.db;


/**
 * @type {Object}
 */
var cloud;

/**
 *
 * @type {boolean}
 */
var ready = false;

/**
 *
 * @type {boolean}
 */
var cartoDbLayersready = false;

/**
 *
 * @type {string}
 */
var BACKEND = require('../../config/config.js').backend;

/**
 * @type {string}
 */
var host;

var meta;

/**
 *
 */
var backboneEvents;

var countLoaded = 0;

try {
    host = require('../../config/config.js').gc2.host;
} catch (e) {
    console.info(e.message);
}

var switchLayer

/**
 *
 * @type {{set: module.exports.set, init: module.exports.init, getMetaDataKeys: module.exports.getMetaDataKeys, ready: module.exports.ready}}
 */
module.exports = {
    /**
     *
     * @param o
     * @returns {exports}
     */
    set: function (o) {
        cloud = o.cloud;
        meta = o.meta;
        backboneEvents = o.backboneEvents;
        switchLayer = o.switchLayer;
        return this;
    },
    /**
     *
     */
    init: function () {
        var isBaseLayer, layers = [], lastLayer,
            metaData = meta.getMetaData();
        switch (BACKEND) {
            case "gc2":
                for (var u = 0; u < metaData.data.length; ++u) {
                    isBaseLayer = metaData.data[u].baselayer ? true : false;
                    layers[[metaData.data[u].f_table_schema + "." + metaData.data[u].f_table_name]] = cloud.get().addTileLayers({
                        host: host,
                        layers: [metaData.data[u].f_table_schema + "." + metaData.data[u].f_table_name],
                        db: db,
                        isBaseLayer: isBaseLayer,
                        tileCached: true,
                        visibility: false,
                        wrapDateLine: false,
                        displayInLayerSwitcher: true,
                        name: metaData.data[u].f_table_name,
                        type: "tms",
                        // Single tile option
                        //type: "wms",
                        //tileSize: 9999,
                        format: "image/png",
                        loadEvent: function () {
                            countLoaded++;
                            backboneEvents.get().trigger("doneLoading:layers", countLoaded);
                        },
                        subdomains: window.gc2Options.subDomainsForTiles
                    });
                }

                backboneEvents.get().trigger("ready:layers");
                break;
            case "cartodb":
                var j = 0, tmpData = metaData.data.slice(); // Clone the array for async adding of CartoDB layers
                (function iter() {
                    cartodb.createLayer(cloud.get().map, {
                        user_name: db,
                        type: 'cartodb',
                        sublayers: [{
                            sql: tmpData[j].sql,
                            cartocss: tmpData[j].cartocss
                        }]
                    }).on('done', function (layer) {
                        layer.baseLayer = false;
                        layer.id = tmpData[j].f_table_schema + "." + tmpData[j].f_table_name;
                        layer.on("load", function () {
                            countLoaded++;
                            backboneEvents.get().trigger("doneLoading:layers", countLoaded);
                        });
                        cloud.get().addLayer(layer, tmpData[j].f_table_name);
                        // We switch the layer on/off, so they become ready for state.
                        cloud.get().showLayer(layer.id);
                        cloud.get().hideLayer(layer.id);
                        j++;
                        if (j < tmpData.length) {
                            iter();
                        } else {
                            // CartoDB layers are now created
                            cartoDbLayersready = true;
                            backboneEvents.get().trigger("ready:layers");
                            return null;
                        }
                    });
                }());
                break;
        }
        ready = true;
    },
    ready: function () {
        // If CartoDB, we wait for cartodb.createLayer to finish
        if (BACKEND === "cartodb") {
            return (ready && cartoDbLayersready);
        }
        // GC2 layers are direct tile request
        else {
            return ready;
        }
    },
    getLayers: function (separator) {
        var layerArr = [];
        var layers = cloud.get().map._layers;
        for (var key in layers) {
            if (layers.hasOwnProperty(key)) {
                if (layers[key].baseLayer !== true && typeof layers[key]._tiles === "object") {
                    if (typeof layers[key].id === "undefined" || (typeof layers[key].id !== "undefined" && layers[key].id.split(".")[0] !== "__hidden")) {
                        layerArr.push(layers[key].id);
                    }
                }
            }
        }
        if (layerArr.length > 0) {
            return layerArr.join(separator ? separator : ",");
        }
        else {
            return false;
        }
    },
    removeHidden: function () {
        var layers = cloud.get().map._layers;
        for (var key in layers) {
            if (layers.hasOwnProperty(key)) {
                if (typeof layers[key].id !== "undefined" && layers[key].id.split(".")[0] === "__hidden") {
                    cloud.get().map.removeLayer(layers[key]);
                }
            }
        }
    },
    resetCount: function () {
        countLoaded = 0;
    }
};
window.addLayerTest = function () {
    var layerName = "test.sogn";
    meta.init(layerName);
};