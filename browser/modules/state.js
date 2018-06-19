/**
 * @fileoverview Description of file, its uses and information
 * about its dependencies.
 */

'use strict';

const STATE_STORE_NAME = `vidi-state-store`;
const LOG = false;

/**
 * @type {*|exports|module.exports}
 */
var cloud;

/**
 * @type {*|exports|module.exports}
 */
var setting;

/**
 * @type {*|exports|module.exports}
 */
var baseLayer;

/**
 * @type {*|exports|module.exports}
 */
var setBaseLayer;

/**
 * @type {*|exports|module.exports}
 */
var switchLayer;

/**
 * @type {*|exports|module.exports}
 */
var legend;

/**
 * @type {*|exports|module.exports}
 */
var draw;

/**
 * @type {*|exports|module.exports}
 */
var advancedInfo;

/**
 * @type {*|exports|module.exports}
 */
var meta;

/**
 * @type {*|exports|module.exports}
 */
var urlparser = require('./urlparser');

/**
 * @type {string}
 */
var hash = urlparser.hash;

/**
 * @type {array}
 */
var urlVars = urlparser.urlVars;

/**
 *
 * @type {LZString|exports|module.exports}
 */
var lz = require('lz-string');

/**
 *
 * @type {exports|module.exports}
 */
var base64 = require('base64-url');

/**
 *
 * @type {string}
 */
var BACKEND = require('../../config/config.js').backend;

var layers;

var _self;

var backboneEvents;

var layerTree;

var listened = {};

var p, hashArr = hash.replace("#", "").split("/");

/**
 * Returns internaly stored global state
 * 
 * @returns {Promise}
 */
const _getInternalState = () => {
    let result = new Promise((resolve, reject) => {
        localforage.getItem(STATE_STORE_NAME, (error, value) => {

            if (LOG) console.log('State: after getting state');

            if (error) {
                throw new Error('State: error occured while accessing the store');
            }

            let localState = {};
            if (value) {
                localState = JSON.parse(value);
            }

            resolve(localState);
        });
    });

    return result;
};

/**
 * Sets internaly stored global state
 * 
 * @returns {Promise}
 */
const _setInternalState = (value) => {
    let result = new Promise((resolve, reject) => {
        localforage.setItem(STATE_STORE_NAME, JSON.stringify(value), (error) => {

            if (LOG) console.log('State: saving state');

            if (error) {
                throw new Error('State: error occured while storing the state');
            }
        });
    });

    return result;
};


/**
 *
 * @type {{set: module.exports.set, init: module.exports.init}}
 */
module.exports = {

    /**
     *
     * @param o
     * @returns {exports}
     */
    set: function (o) {
        cloud = o.cloud;
        setting = o.setting;
        setBaseLayer = o.setBaseLayer;
        baseLayer = o.baseLayer;
        switchLayer = o.switchLayer;
        legend = o.legend;
        draw = o.draw;
        layers = o.layers;
        advancedInfo = o.advancedInfo;
        meta = o.meta;
        layerTree = o.layerTree;
        backboneEvents = o.backboneEvents;

        listened['layerTree'] = layerTree;

        return this;
    },

    /**
     * @todo Most of the functionality from this method should be moved to the 
     * corresponding modules and extensions
     */
    init: function () {
        _self = this;

        if ('localforage' in window === false) {
            throw new Error('localforage is not defined');
        }

        var arr, i;

        // Reset hash. Needed if state is invoked after start up
        hash = decodeURIComponent(window.location.hash);
        hashArr = hash.replace("#", "").split("/");

        const removeDuplicates = (inputArray) => {
            var temp = {};
            for (var i = 0; i < inputArray.length; i++) {
                temp[inputArray[i]] = true;
            }

            var result = [];
            for (var key in temp) {
                result.push(key);
            }

            return result;
        };

        var setLayers = function () {
            $(".base-map-button").removeClass("active");
            $("#" + hashArr[0]).addClass("active");
            if (hashArr[1] && hashArr[2] && hashArr[3]) {
                setBaseLayer.init(hashArr[0]);
                if (hashArr[4]) {
                    arr = hashArr[4].split(",");

                    // Removing duplicates as we do not trust user input
                    arr = removeDuplicates(arr);

                    let metaData = meta.getMetaDataLatestLoaded();
                    for (i = 0; i < arr.length; i++) {
                        let correspondingMetaLayer = false;
                        for (let j = 0; j < metaData.data.length; j++) {
                            if (metaData.data[j].f_table_schema + '.' + metaData.data[j].f_table_name === arr[i].replace('v:', '')) {
                                correspondingMetaLayer = metaData.data[j];
                                break;
                            }
                        }

                        if (correspondingMetaLayer) {
                            let displayLayer = true;

                            let layer = correspondingMetaLayer;
                            let isVectorLayer = true;
                            let isTileLayer = true;
    
                            if (layer && layer.meta) {
                                let parsedMeta = JSON.parse(layer.meta);
                                if (parsedMeta.vidi_layer_type) {
                                    if (parsedMeta.vidi_layer_type === 't') isVectorLayer = false;
                                    if (parsedMeta.vidi_layer_type === 'v') isTileLayer = false;
                                }
                            }

                            if (isVectorLayer === false && arr[i].startsWith('v:')) {
                                displayLayer = false;
                                console.warn(`The ${arr[i]} layer is requested, but there is only tile view available`);
                            }
    
                            if (isTileLayer === false && !arr[i].startsWith('v:')) {
                                displayLayer = false;
                                console.warn(`The ${arr[i]} layer is requested, but there is only vector view available`);
                            }
    
                            if (displayLayer) switchLayer.init(arr[i], true, false);
                        } else {
                            console.warn(`No meta layer was found for ${arr[i]}`);
                            // Add the requested in run-time
                            switchLayer.init(arr[i], true, false)
                        }
                    }
                }
            }

            legend.init();
            
            // When all layers are loaded, when load legend and when set "all_loaded" for print
            backboneEvents.get().once("allDoneLoading:layers", function (e) {
                legend.init().then(function(){
                    console.log("Vidi is now loaded");// Vidi is now fully loaded
                    window.status = "all_loaded";
                });
            });
        };

        if (urlVars.k === undefined) {
            if (hashArr[0]) {
                setLayers()
            } else {
                // Set base layer to the first added one.
                setBaseLayer.init(baseLayer.getBaseLayer()[0]);
                var extent = setting.getExtent();
                if (extent !== null) {
                    cloud.get().zoomToExtent(extent);
                } else {
                    cloud.get().zoomToExtent();
                }
            }
        }

        else {
            var parr, v, l, t, GeoJsonAdded = false;
            parr = urlVars.k.split("#");
            if (parr.length > 1) {
                parr.pop();
            }

            $.ajax({
                dataType: "json",
                method: "get",
                url: '/api/postdata/',
                data: {
                    k: parr.join()
                },
                scriptCharset: "utf-8",
                success: function (response) {
                    if (response.data.bounds !== null) {
                        var bounds = response.data.bounds;
                        cloud.get().map.fitBounds([bounds._northEast, bounds._southWest], {animate: false})
                    }

                    if (response.data.customData !== null) {
                        backboneEvents.get().trigger("on:customData", response.data.customData);
                    }


                    // Recreate print
                    // ==============
                    if (response.data.print !== null) {
                        GeoJsonAdded = false;
                        parr = response.data.print;
                        v = parr;
                        $.each(v[0].geojson.features, function (n, m) {
                            if (m.type === "Rectangle") {
                                var g = L.rectangle([m._latlngs[0], m._latlngs[2]], {
                                    fillOpacity: 0,
                                    opacity: 1,
                                    color: 'red',
                                    weight: 1
                                });
                                g.feature = m.feature;
                                cloud.get().map.addLayer(g);
                                setTimeout(function () {
                                    var bounds = g.getBounds(),
                                        sw = bounds.getSouthWest(),
                                        ne = bounds.getNorthEast(),
                                        halfLat = (sw.lat + ne.lat) / 2,
                                        midLeft = L.latLng(halfLat, sw.lng),
                                        midRight = L.latLng(halfLat, ne.lng),
                                        scaleFactor = ($("#pane1").width() / (cloud.get().map.project(midRight).x - cloud.get().map.project(midLeft).x));

                                    $("#container1").css("transform", "scale(" + scaleFactor + ")");
                                    $(".leaflet-control-scale-line").prependTo("#scalebar").css("transform", "scale(" + scaleFactor + ")");
                                    $(".leaflet-control-scale-line").prependTo("#scalebar").css("transform-origin", "left bottom 0px");
                                    $("#scale").html("1 : " + response.data.scale);
                                    $("#title").html(decodeURIComponent(urlVars.t));
                                    parr = urlVars.c.split("#");
                                    if (parr.length > 1) {
                                        parr.pop();
                                    }
                                    $("#comment").html(decodeURIComponent(parr.join()));

                                    if (hashArr[0]) {
                                        setLayers()
                                    }
                                    cloud.get().map.removeLayer(g);
                                }, 0)
                            }
                        });
                    }

                    // Recreate Drawings
                    // =================

                    if (response.data.draw !== null) {
                        GeoJsonAdded = false;
                        parr = response.data.draw;
                        v = parr;
                        draw.control();
                        l = draw.getLayer();
                        t = draw.getTable();

                        $.each(v[0].geojson.features, function (n, m) {

                            // If polyline or polygon
                            // ======================
                            if (m.type === "Feature" && GeoJsonAdded === false) {
                                var json = L.geoJson(m, {
                                    style: function (f) {
                                        return f.style;
                                    }
                                });

                                var g = json._layers[Object.keys(json._layers)[0]];
                                l.addLayer(g);
                            }

                            // If circle
                            // =========
                            if (m.type === "Circle") {
                                g = L.circle(m._latlng, m._mRadius, m.style);
                                g.feature = m.feature;
                                l.addLayer(g);
                            }

                            // If rectangle
                            // ============
                            if (m.type === "Rectangle") {
                                g = L.rectangle([m._latlngs[0], m._latlngs[2]], m.style);
                                g.feature = m.feature;
                                l.addLayer(g);
                            }

                            // If circle marker
                            // ================
                            if (m.type === "CircleMarker") {
                                g = L.marker(m._latlng, m.style);
                                g.feature = m.feature;

                                // Add label
                                if (m._vidi_marker_text) {
                                    g.bindTooltip(m._vidi_marker_text, {permanent: true}).on("click", function () {
                                    }).openTooltip();
                                }
                                l.addLayer(g);
                            }

                            // If marker
                            // =========
                            if (m.type === "Marker") {
                                g = L.marker(m._latlng, m.style);
                                g.feature = m.feature;

                                // Add label
                                if (m._vidi_marker_text) {
                                    g.bindTooltip(m._vidi_marker_text, {permanent: true}).on("click", function () {
                                    }).openTooltip();
                                }
                                l.addLayer(g);

                            } else {

                                // Add measure
                                if (m._vidi_measurementLayer) {
                                    g.showMeasurements(m._vidi_measurementOptions);
                                }

                                // Add extremities
                                if (m._vidi_extremities) {
                                    g.showExtremities(m._vidi_extremities.pattern, m._vidi_extremities.size, m._vidi_extremities.where);
                                }

                                // Bind popup
                                g.on('click', function (event) {

                                    draw.bindPopup(event);

                                });
                            }
                        });
                        t.loadDataInTable();
                        draw.control();
                    }

                    // Recreate query draw
                    // ===================

                    if (response.data.queryDraw !== null) {
                        GeoJsonAdded = false;
                        parr = response.data.queryDraw;
                        v = parr;
                        l = advancedInfo.getDrawLayer();
                        $.each(v[0].geojson.features, function (n, m) {
                            if (m.type === "Feature" && GeoJsonAdded === false) {
                                var g = L.geoJson(v[0].geojson, {
                                    style: function (f) {
                                        return f.style;
                                    }
                                });
                                $.each(g._layers, function (i, v) {
                                    l.addLayer(v);
                                });
                                GeoJsonAdded = true;
                            }
                            if (m.type === "Circle") {
                                g = L.circle(m._latlng, m._mRadius, m.style);
                                g.feature = m.feature;
                                l.addLayer(g);
                            }
                            if (m.type === "Rectangle") {
                                g = L.rectangle([m._latlngs[0], m._latlngs[2]], m.style);
                                g.feature = m.feature;
                                l.addLayer(g);
                            }
                            if (m.type === "Marker") {
                                g = L.marker(m._latlng, m.style);
                                g.feature = m.feature;
                                l.addLayer(g);
                            }
                        });
                    }

                    // Recreate query buffer
                    // =====================

                    if (response.data.queryBuffer !== null) {
                        GeoJsonAdded = false;
                        parr = response.data.queryBuffer;
                        v = parr;
                        l = advancedInfo.getDrawLayer();
                        $.each(v[0].geojson.features, function (n, m) {
                            if (m.type === "Feature" && GeoJsonAdded === false) {
                                var g = L.geoJson(v[0].geojson, {
                                    style: function (f) {
                                        return f.style;
                                    }
                                });
                                $.each(g._layers, function (i, v) {
                                    l.addLayer(v);
                                });
                                GeoJsonAdded = true;
                            }
                        });
                    }


                    // Recreate result
                    // ===============

                    if (response.data.queryResult !== null) {
                        GeoJsonAdded = false;
                        parr = response.data.queryResult;
                        v = parr;
                        $.each(v[0].geojson.features, function (n, m) {
                            if (m.type === "Feature" && GeoJsonAdded === false) {
                                var g = L.geoJson(v[0].geojson, {
                                    style: function (f) {
                                        return f.style;
                                    }
                                });
                                $.each(g._layers, function (i, v) {
                                    cloud.get().map.addLayer(v);
                                });
                                GeoJsonAdded = true;
                            }
                            if (m.type === "Circle") {
                                g = L.circleMarker(m._latlng, m.style);
                                g.setRadius(m._radius);
                                g.feature = m.feature;
                                cloud.get().map.addLayer(g);
                            }
                        });
                    }

                    // Recreate added layers
                    // from layerSearch
                    // =====================

                    var currentLayers = meta.getMetaData();
                    var flag;
                    var addedLayers = [];

                    // Get array with the added layers
                    $.each(response.data.metaData.data, function (i, v) {
                        flag = false;
                        $.each(currentLayers.data, function (u, m) {
                            if (m.f_table_name === v.f_table_name && m.f_table_schema === v.f_table_schema) {
                                flag = true; // Flag layers from loaded schemata
                            }
                        });
                        if (!flag) {
                            addedLayers.push(v);
                        }
                    });

                    // If any added layers, then add them
                    if (addedLayers.length > 0) {
                        meta.addMetaData({data: addedLayers});
                        layerTree.init();
                        if (arr) {
                            for (i = 0; i < arr.length; i++) {
                                switchLayer.init(arr[i], true, true);
                            }
                        }
                    }

                }
            });
        }
        backboneEvents.get().trigger("end:state");
    },

    /**
     * Returns current state
     * 
     * @param {String} name Name of the module or extension
     * 
     * @returns {Promise}
     */
    getState: (name = false) => {
        let result = new Promise((resolve, reject) => {
            _getInternalState().then(localState => {
                if (name) {
                    resolve(localState[name]);
                } else {
                    resolve(localState);
                }
            });
        });

        return result;
    },

    /**
     * Listens to specific events of modules and extensions, then gets their state and updates
     * and saves the overall state locally, so next reload will keep all changes
     */
    listen: (name, eventId) => {
        backboneEvents.get().on(name + ':' + eventId, () => {
            _self._updateState(name);
        });
    },

    /**
     * Pushes the current saved state to the server (GC2), then displays the link with saved state identifier (bookmark)
     */
    bookmarkState: () => {},

    setExtent: function () {
        if (hashArr[1] && hashArr[2] && hashArr[3]) {
            p = geocloud.transformPoint(hashArr[2], hashArr[3], "EPSG:4326", "EPSG:900913");
            cloud.get().zoomToPoint(p.x, p.y, hashArr[1]);
        } else {
            cloud.get().zoomToExtent();
        }
    },

    setBaseLayer: function (b) {
        setBaseLayer = b;
    },

    /**
     * Retrieves state of all registered modules and extensions
     * 
     * @param {String} name Module or extension name
     */
    _updateState: (name) => {
        if (name in listened === false) {
            throw new Error(`Module or extension ${name} does not exist`);
        }

        if ('getState' in listened[name] === false) {
            throw new Error(`Module or extension has to implement getState() method in order to support state`);
        }

        _getInternalState().then(localState => {
            localState[name] = listened[name].getState();
            _setInternalState(localState);
        });
    }
};