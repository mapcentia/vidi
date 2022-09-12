/*
 * @author     Martin Høgh <mh@mapcentia.com>
 * @copyright  2013-2018 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

'use strict';

import {GROUP_CHILD_TYPE_LAYER} from './layerTree/LayerSorting';
import {LAYER} from './layerTree/constants';
import layerTreeUtils from './layerTree/utils';

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
 */
var meta;

/**
 *
 */
var backboneEvents;

var host = require("./connection").getHost();

var layerTree;

var currentlyLoadedLayers = [];

var urlVars = urlparser.urlVars;


var uri = null;

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
                    if ((typeof layers[key]._tiles === "object" || typeof layers[key]._wmsUrl !== "undefined")
                        || (layers[key].id && layers[key].id.startsWith(LAYER.VECTOR + ':'))
                        || (layers[key].id && layers[key].id.startsWith(LAYER.VECTOR_TILE + ':'))
                        || (layers[key].id && layers[key].id.startsWith(LAYER.WEBGL + ':'))) {

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
        if (currentlyLoadedLayers.indexOf(i) === -1) {
            currentlyLoadedLayers.push(i)
        }

        return currentlyLoadedLayers.length;
    },

    decrementCountLoading: function (i) {
        currentlyLoadedLayers.splice(currentlyLoadedLayers.indexOf(i), 1);
        return currentlyLoadedLayers.length;
    },

    getCountLoading: function () {
        return currentlyLoadedLayers.length;
    },

    getArray: function () {
        return currentlyLoadedLayers;
    },

    setUri: function (str) {
        uri = str;
    },

    reorderLayers: () => {
        let order = layerTree.getLatestLayersOrder();
        let layers = _self.getMapLayers();
        if (order) {
            let indexCounter = 100;
            const orderSubgroup = (order) => {
                order.map((item) => {
                    if (item.type && item.type === GROUP_CHILD_TYPE_LAYER) {
                        layers.map(layer => {
                            let itemId;
                            if (item.layer) {
                                itemId = item.layer.f_table_schema + '.' + item.layer.f_table_name;
                            } else {
                                itemId = item.id;
                            }

                            if (!itemId) throw Error(`Unable to detect order item identifier`);

                            if (layer.id && (layerTreeUtils.stripPrefix(layer.id) === layerTreeUtils.stripPrefix(itemId))) {
                                let zIndex = (10000 - indexCounter);
                                cloud.get().map.getPane(layerTreeUtils.stripPrefix(layer.id).replace('.', '-')).style.zIndex = zIndex;
                                indexCounter++;
                            }
                        });
                    } else if (item.children) {
                        orderSubgroup(item.children);
                    } else {
                        console.error(item);
                        throw new Error(`Invalid order object type`);
                    }
                });
            };

            orderSubgroup(order);
        }
    },

    /**
     * Adds a layers UTFGrid. Checks if any fields has mouse over set. Or else the grid is not added.
     * @param layerKey      Layer key
     * @returns {boolean}
     */
    addUTFGridLayer: function (layerKey) {
        let metaData = meta.getMetaDataKeys(), fieldConf, result = false;
        let parsedMeta = layerTree.parseLayerMeta(metaData[layerKey]), template;
        try {
            fieldConf = JSON.parse(metaData[layerKey].fieldconf);
        } catch (e) {
            fieldConf = {};
        }
        if (parsedMeta?.hover_active) {
            result = new Promise((resolve, reject) => {
                if (metaData[layerKey].type === "RASTER") {
                    reject();
                    return;
                }
                const defaultTemplate =
                    `<div>
                        {{#each data}}
                            {{this.title}}: {{this.value}} <br>
                        {{/each}}
                </div>`;
                if (parsedMeta?.info_template_hover && parsedMeta.info_template_hover !== "") {
                    template = parsedMeta.info_template_hover;
                } else {
                    template = defaultTemplate;
                }
                let utfGrid = cloud.get().addUTFGridLayers({
                    layers: [layerKey],
                    db: db,
                    cache: parsedMeta?.cache_utf_grid,
                    loading: currentlyLoadedLayers
                })[0];
                layerTree.mouseOver(utfGrid, fieldConf, template)
                console.info(`${layerKey} UTFgrid was added to the map`);
                resolve();
            });
        }
        return result;
    },

    /**
     * Add raster layer
     *
     * @param {String}  layerKey                Layer key
     * @param {Array}   additionalURLParameters Additional URL parameters
     *
     * @returns {Promise}
     */
    addLayer: function (layerKey, additionalURLParameters = []) {
        let me = _self;

        if (window.vidiConfig.wmsUriReplace) {
            const regex = /\[(.*?)\]/g;
            const found = window.vidiConfig.wmsUriReplace.match(regex);
            if (typeof urlVars[found[0].replace("[", "").replace("]", "")] === "string") {
                _self.setUri(window.vidiConfig.wmsUriReplace.replace(found, urlVars[found[0].replace("[", "").replace("]", "")]));
            }
        }

        return new Promise((resolve, reject) => {
            let layers = [], metaData = meta.getMetaData(), layerWasAdded = false;

            $.each(metaData.data, function (i, layerDescription) {
                let layer = layerDescription.f_table_schema + "." + layerDescription.f_table_name;
                let {
                    useCache,
                    mapRequestProxy,
                    tiled
                } = _self.getCachingDataForLayer(layerDescription, additionalURLParameters);
                if (layer === layerKey) {
                    let qgs;
                    if (layerDescription.wmssource && layerDescription.wmssource.includes("qgis_mapserv")) {
                        let searchParams = new URLSearchParams((new URL(layerDescription.wmssource)).search);
                        let urlVars = {};
                        for (let p of searchParams) {
                            urlVars[p[0]] = p[1];
                        }
                        qgs = btoa(urlVars.map);
                        // Composit QGIS layers has to go through MapServer
                        if (urlVars?.LAYER?.split(',').length === 1) {
                            additionalURLParameters.push(`qgs=${qgs}`);
                        }
                    }
                    const isBaseLayer = !!layerDescription.baselayer;
                    layers[[layer]] = cloud.get().addTileLayers({
                        additionalURLParameters,
                        host,
                        layers: [layer],
                        db,
                        isBaseLayer,
                        mapRequestProxy,
                        tileCached: useCache,
                        singleTile: !tiled,
                        wrapDateLine: false,
                        displayInLayerSwitcher: true,
                        name: layerDescription.f_table_name,
                        type: "wms", // Always use WMS protocol
                        format: "image/png",
                        uri,
                        pane: layerDescription.f_table_schema + "-" + layerDescription.f_table_name,
                        loadEvent: function (e) {
                            let canvasHasData = false;
                            if (!tiled) {
                                // Single tiles layers are canvas, so it can be used directly
                                if (e.target.id && e.target._bufferCanvas) {
                                    try {
                                        let canvas = e.target._bufferCanvas;
                                        canvasHasData = new Uint32Array(canvas.getContext('2d')
                                            .getImageData(0, 0, canvas.width, canvas.height).data.buffer).some(x => x !== 0);
                                    } catch (e) {
                                        canvasHasData = true; // In case of Internet Explorer
                                    }
                                }
                            } else {
                                // For tiled layer we loop through images and turn them into canvas
                                for (const obj in e.target._tiles) {
                                    const imgEl = e.target._tiles[obj].el
                                    const w = imgEl.clientWidth;
                                    const h = imgEl.clientHeight;
                                    let canvas = document.createElement("canvas");
                                    canvas.width = w;
                                    canvas.height = h;
                                    let context = canvas.getContext('2d');
                                    context.drawImage(imgEl, 0, 0, w, h, 0, 0, w, h);
                                    try {
                                        canvasHasData = new Uint32Array(canvas.getContext('2d')
                                            .getImageData(0, 0, canvas.width, canvas.height).data.buffer).some(x => x !== 0);
                                    } catch (e) {
                                        canvasHasData = true; // In case of Internet Explorer
                                    }
                                    if (canvasHasData) {
                                        canvas = null;
                                        break;
                                    }
                                    canvas = null;
                                }
                            }
                            backboneEvents.get().trigger("tileLayerVisibility:layers", {
                                id: e.target.id,
                                dataIsVisible: canvasHasData
                            });

                            me.decrementCountLoading(layer);
                            backboneEvents.get().trigger("doneLoading:layers", layer);
                        },
                        loadingEvent: function () {
                            me.incrementCountLoading(layer);
                            backboneEvents.get().trigger("startLoading:layers", layer);
                        },
                        subdomains: window.gc2Options.subDomainsForTiles
                    });

                    me.reorderLayers();

                    layerWasAdded = true;

                    return false;
                }
            });

            if (layerWasAdded) {
                resolve();
            } else {
                reject(`${layerKey} was not added to the map`);
            }
        });
    },

    /**
     * Add vector tile layer
     *
     * @param {String} layerKey                Layer key
     * @param {Array}  additionalURLParameters Additional URL parameters
     *
     * @returns {Promise}
     */
    addVectorTileLayer: function (layerKey, additionalURLParameters = []) {
        let me = this;
        return new Promise((resolve, reject) => {
            let isBaseLayer, layers = [], metaData = meta.getMetaData();
            let layerWasAdded = false;
            $.each(metaData.data, function (i, layerDescription) {
                var layer = layerDescription.f_table_schema + "." + layerDescription.f_table_name;
                let {
                    useCache,
                    mapRequestProxy
                } = _self.getCachingDataForLayer(layerDescription, additionalURLParameters);

                if (layer === layerKey) {
                    // Check if the opacity value differs from the default one
                    isBaseLayer = !!layerDescription.baselayer;
                    layers[[layer]] = cloud.get().addTileLayers({
                        additionalURLParameters,
                        host: host,
                        layerId: (LAYER.VECTOR_TILE + `:` + layer),
                        layers: [layer],
                        db: db,
                        isBaseLayer: isBaseLayer,
                        mapRequestProxy: mapRequestProxy,
                        tileCached: useCache, // Use MapCache or "real" WMS.
                        singleTile: true, // Always use single tiled. With or without MapCache
                        wrapDateLine: false,
                        displayInLayerSwitcher: true,
                        name: layerDescription.f_table_name,
                        type: "mvt",
                        format: "image/png",
                        uri: uri,
                        loadEvent: function () {
                            me.decrementCountLoading(LAYER.VECTOR_TILE + `:` + layer);
                            backboneEvents.get().trigger("doneLoading:layers", layer);
                        },
                        loadingEvent: function () {
                            me.incrementCountLoading(LAYER.VECTOR_TILE + `:` + layer);
                            backboneEvents.get().trigger("startLoading:layers", layer);
                        },
                        subdomains: window.gc2Options.subDomainsForTiles
                    });

                    me.reorderLayers();

                    layerWasAdded = true;
                    return false;
                }
            });

            if (layerWasAdded) {
                console.info(`${layerKey} was added to the map`);
                resolve();
            } else {
                console.warn(`${layerKey} was not added to the map`);
                reject();
            }
        });
    },

    /**
     * Extracts cache settings from layer description
     *
     * @param {Object} layerDescription        Layer description
     * @param {String} additionalURLParameters Additional URL parameters
     *
     * @returns {Object}
     */
    getCachingDataForLayer: (layerDescription, appendedFiltersString = []) => {
        // If filters are applied or single_tile is true, then request should not be cached
        // Of legacy reasons are this setting called 'single_tile', but has nothing to do with
        // a layer being tiled or not. This is controlled by option 'tiled'
        let useCache = (JSON.parse(layerDescription.meta)?.single_tile === true);
        if (appendedFiltersString.length > 0 && appendedFiltersString[0] !== "") {
            useCache = false;
        }
        let tiled = (JSON.parse(layerDescription.meta)?.tiled === true);
        // Detect if layer is protected and route it through backend if live WMS is used (Mapcache does not need authorization)
        let mapRequestProxy = urlparser.hostname + `/api`;
        return {useCache, mapRequestProxy, tiled};
    }
};
