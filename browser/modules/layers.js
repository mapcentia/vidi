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
 *
 */
var meta;

/**
 *
 */
var backboneEvents;

var host = require("./connection").getHost();

var switchLayer;

var array = [];

var uri = null

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

    getLayers: function (separator, includeHidden) {
        var layerArr = [];
        var layers = cloud.get().map._layers;
        for (var key in layers) {
            if (layers.hasOwnProperty(key)) {
                if (layers[key].baseLayer !== true && (typeof layers[key]._tiles === "object" || typeof layers[key].wmsParams === "object")) {
                    if (typeof layers[key].id === "undefined" || (typeof layers[key].id !== "undefined" && (layers[key].id.split(".")[0] !== "__hidden") || includeHidden === true)) {
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
    resetCount: function (i) {
        ready = cartoDbLayersready = false;
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

    getCountLoading: function () {
        return array.length;
    },

    getArray: function () {
        return array;
    },

    setUri: function (str) {
      uri = str;
    },

    /**
     *
     * @param l
     * @returns {Promise}
     */
    addLayer: function (l) {
        var me = this;

        return new Promise(function (resolve, reject) {

            var isBaseLayer, layers = [], metaData = meta.getMetaData();

            console.log(metaData);
            console.log(l);

            $.each(metaData.data, function (i, v) {

                var layer = v.f_table_schema + "." + v.f_table_name,
                    singleTiled = (JSON.parse(v.meta) !== null && JSON.parse(v.meta).single_tile !== undefined && JSON.parse(v.meta).single_tile === true);

                if (layer === l) {
                    isBaseLayer = !!v.baselayer;
                    layers[[layer]] = cloud.get().addTileLayers({
                        host: host,
                        layers: [layer],
                        db: db,
                        isBaseLayer: isBaseLayer,
                        tileCached: !singleTiled,
                        singleTile: singleTiled,
                        visibility: false,
                        wrapDateLine: false,
                        displayInLayerSwitcher: true,
                        name: v.f_table_name,
                        // Single tile option
                        type: !singleTiled ? "tms" : "wms",
                        format: "image/png",
                        uri: uri,
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
            reject();
            console.info(l + " added to the map.");
        })
    }
};