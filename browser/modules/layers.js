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
 * @type {object}
 */
var switchLayer;

/**
 * @type {object}
 */
var setBaseLayer;

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

/**
 * @type {object}
 */
var legend;
var meta;

/**
 *
 */
var backboneEvents;

try {
    host = require('../../config/config.js').gc2.host;
} catch (e) {
    console.info(e.message);
}

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
        switchLayer = o.switchLayer;
        setBaseLayer = o.setBaseLayer;
        legend = o.legend;
        meta = o.meta;
        backboneEvents = o.backboneEvents;
        return this;
    },
    /**
     *
     */
    init: function () {
        var isBaseLayer, layers = [],
            metaData = meta.getMetaData();
        switch (BACKEND) {
            case "gc2":
                for (var u = 0; u < metaData.data.length; ++u) {
                    isBaseLayer = metaData.data[u].baselayer ? true : false;
                    layers[[metaData.data[u].f_table_schema + "." + metaData.data[u].f_table_name]] = cloud.addTileLayers({
                        host: host,
                        layers: [metaData.data[u].f_table_schema + "." + metaData.data[u].f_table_name],
                        db: db,
                        isBaseLayer: isBaseLayer,
                        tileCached: true,
                        visibility: false,
                        wrapDateLine: false,
                        displayInLayerSwitcher: true,
                        name: metaData.data[u].f_table_name,
                        type: "tms"
                    });
                }
                ready = true;
                backboneEvents.get().trigger("ready:layers");
                break;
            case "cartodb":
                var j = 0, tmpData = metaData.data.slice(); // Clone the array for async adding of CartoDB layers
                (function iter() {
                    cartodb.createLayer(cloud.map, {
                        user_name: db,
                        type: 'cartodb',
                        sublayers: [{
                            sql: tmpData[j].sql,
                            cartocss: tmpData[j].cartocss
                        }]
                    }).on('done', function (layer) {
                        layer.baseLayer = false;
                        layer.id = tmpData[j].f_table_schema + "." + tmpData[j].f_table_name;
                        cloud.addLayer(layer, tmpData[j].f_table_name);
                        // We switch the layer on/off, so they become ready for state.
                        cloud.showLayer(layer.id);
                        cloud.hideLayer(layer.id);
                        j++;
                        if (j < tmpData.length) {
                            iter();
                        } else {
                            cartoDbLayersready = true; // CartoDB layers are now created
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
        if (BACKEND === "cartodb") { // If CartoDB, we wait for cartodb.createLayer to finish
            return (ready && cartoDbLayersready);
        }
        else { // GC2 layers are direct tile request
            return ready;
        }
    }
};


