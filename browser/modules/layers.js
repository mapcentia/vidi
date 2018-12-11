/*
 * @author     Martin Høgh <mh@mapcentia.com>
 * @copyright  2013-2018 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

'use strict';

import { GROUP_CHILD_TYPE_LAYER, GROUP_CHILD_TYPE_GROUP } from './layerTree/LayerSorting';

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

var host = require("./connection").getHost();

var layerTree;

var array = [];

var uri = null

let _self = false;

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
        _self = this;

        cloud = o.cloud;
        meta = o.meta;
        layerTree = o.layerTree;
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

    /**
     * Fetches Leaflet layers from map
     */
    getMapLayers: (includeHidden = false, searchedLayerKey = false) => {
        var mapLayers = [];
        var layers = cloud.get().map._layers;

        for (var key in layers) {
            if (layers[key].baseLayer !== true) {
                if (typeof layers[key].id === "undefined" || (typeof layers[key].id !== "undefined" && (layers[key].id.split(".")[0] !== "__hidden") || includeHidden === true)) {
                    if ((typeof layers[key]._tiles === "object" || typeof layers[key]._wmsUrl !== "undefined") || (layers[key].id && layers[key].id.startsWith('v:'))) {
                        if (searchedLayerKey) {
                            if (searchedLayerKey === layers[key].id) {
                                mapLayers.push(layers[key]);
                            }
                        } else {
                            mapLayers.push(layers[key]);
                        }
                    }
                }
            }
        }
        return mapLayers;
    },

    getLayers: function (separator, includeHidden) {
        var layerArr = [];
        _self.getMapLayers(includeHidden).map(item => {
            layerArr.push(item.id);
        });

        if (layerArr.length > 0) {
            return layerArr.join(separator ? separator : ",");
        } else {
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

    getCountLoading: function () {
        return array.length;
    },

    getArray: function () {
        return array;
    },

    setUri: function (str) {
      uri = str;
    },

    reorderLayers: () => {
        let order = layerTree.getLatestLayersOrder();
        let layers = _self.getMapLayers();
        if (order) {
            order.map((orderItem, groupIndex) => {
                orderItem.children.map((item, index) => {
                    if (item.type === GROUP_CHILD_TYPE_LAYER) {
                        layers.map(layer => {
                            if (layer.id && (layer.id.replace(`v:`, ``) === item.id.replace(`v:`, ``))) {
                                let zIndex = ((orderItem.children.length - index) * 100 + ((order.length - groupIndex) + 1) * 10000);
                                layer.setZIndex(zIndex);
                            }
                        });
                    } else if (item.type === GROUP_CHILD_TYPE_GROUP) {
                        item.children.map((childItem, childIndex) => {
                            layers.map(layer => {
                                if (layer.id && (layer.id.replace(`v:`, ``) === childItem.id.replace(`v:`, ``))) {
                                    let zIndex = ((item.children.length - childIndex) + (orderItem.children.length - index) * 100 + ((order.length - groupIndex) + 1) * 10000);
                                    layer.setZIndex(zIndex);
                                }
                            });
                        });
                    } else {
                        throw new Error(`Invalid order object type`);   
                    }
                });
            });
        }
    },

    /**
     * Adds raster layer
     * 
     * @param {String} l                     Layer key
     * @param {String} appendedFiltersString Optional filter string
     * 
     * @returns {Promise}
     */
    addLayer: function (l, appendedFiltersString = false) {
        console.log(`### appendedFiltersString`, appendedFiltersString);

        var me = this;
        let result = new Promise((resolve, reject) => {
            var isBaseLayer, layers = [], metaData = meta.getMetaData();

            let layerWasAdded = false;

            $.each(metaData.data, function (i, v) {
                var layer = v.f_table_schema + "." + v.f_table_name,
                    useLiveWMS = (JSON.parse(v.meta) !== null && JSON.parse(v.meta).single_tile !== undefined && JSON.parse(v.meta).single_tile === true); //TODO rename single_tile

                if (layer === l) {
                    // Check if the opacity value differs from the default one
                    isBaseLayer = !!v.baselayer;
                    layers[[layer]] = cloud.get().addTileLayers({
                        additionalURLParameters: (appendedFiltersString ? appendedFiltersString : ''),
                        host: host,
                        layers: [layer],
                        db: db,
                        isBaseLayer: isBaseLayer,
                        tileCached: !useLiveWMS, // Use MapCache or "real" WMS. Defaults to MapCache
                        singleTile: true, // Always use single tiled. With or without MapCache
                        wrapDateLine: false,
                        displayInLayerSwitcher: true,
                        name: v.f_table_name,
                        type: "wms", // Always use WMS protocol
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
                    me.reorderLayers();

                    console.info(`${l} was added to the map`);
                    layerWasAdded = true;
                    resolve();
                }
            });

            if (layerWasAdded === false) {
                console.info(`${l} was not added to the map`);
                reject();
            }
        });

        return result;
    }
};
