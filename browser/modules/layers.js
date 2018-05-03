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
 * @type {string}
 */
var BACKEND = require('../../config/config.js').backend;


/**
 *
 */
var meta;

/**
 *
 */
var backboneEvents;

var mustache = require('mustache');

var host = require("./connection").getHost();

var singleTiled = [];



var array =[];

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
        return this;
    },

    /**
     *
     */
    init: function () {

    },

    ready: function () {
        return ready;
    },

    getLayers: function (separator, includeHidden) {
        var layerArr = [];
        var layers = cloud.get().map._layers;

        for (var key in layers) {
            if (layers.hasOwnProperty(key)) {
                if (layers[key].baseLayer !== true) {
                    if (typeof layers[key].id === "undefined" || (typeof layers[key].id !== "undefined" && (layers[key].id.split(".")[0] !== "__hidden") || includeHidden === true)) {
                        if (typeof layers[key]._tiles === "object") {
                            layerArr.push(layers[key].id);
                        } else if (layers[key].id && layers[key].id.startsWith('v:')) {
                            layerArr.push(layers[key].id);
                        }
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
        ready = false;
    },

    incrementCountLoading: function (i) {
        if (array.indexOf(i) === -1) {
            array.push(i)
        }
        return array.length;
    },

    decrementCountLoading: function (i) {
        array.splice(array.indexOf(i), 1);
        return array.length;
    },

    getCountLoading: function() {
      return  array.length;
    },

    getArray: function() {
      return  array;
    },

    /**
     *
     * @param l
     * @returns {Promise}
     */
    addLayer: function (l) {
        var me = this;

        if (typeof window.vidiConfig.singleTiled === "object" && window.vidiConfig.singleTiled.length > 0) {
            singleTiled = window.vidiConfig.singleTiled
        }

        return new Promise(function (resolve, reject) {
            var isBaseLayer, layers = [], metaData = meta.getMetaData();

            $.each(metaData.data, function (i, v) {
                var layer = v.f_table_schema + "." + v.f_table_name;
                if (layer === l) {
                    isBaseLayer = v.baselayer ? true : false;

                    layers[[layer]] = cloud.get().addTileLayers({
                        host: host,
                        layers: [layer],
                        db: db,
                        isBaseLayer: isBaseLayer,
                        tileCached: singleTiled.indexOf(layer) === -1,
                        visibility: false,
                        wrapDateLine: false,
                        displayInLayerSwitcher: true,
                        name: v.f_table_name,
                        // Single tile option
                        type: singleTiled.indexOf(layer) === -1 ? "tms" : "wms",
                        tileSize: singleTiled.indexOf(layer) === -1 ? 256 : 9999,
                        format: "image/png",
                        loadEvent: function () {
                            me.decrementCountLoading(layer);
                            backboneEvents.get().trigger("doneLoading:layers", layer);
                        },
                        loadingEvent: function () {
                            me.incrementCountLoading(layer);
                            backboneEvents.get().trigger("startLoading:layers", layer);
                        },
                        subdomains: window.gc2Options.subDomainsForTiles
                    });

                    layers[[layer]][0].setZIndex(v.sort_id + 10000);

                    resolve();
                }
            });

            console.info(l + " added to the map.");
        })
    }
};