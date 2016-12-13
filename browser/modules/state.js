/**
 * @fileoverview Description of file, its uses and information
 * about its dependencies.
 */

'use strict';

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

var setBaseLayer = false;

var backboneEvents;

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
        backboneEvents = o.backboneEvents;
        return this;
    },
    init: function () {
        var p, hashArr = hash.replace("#", "").split("/");
        if (hashArr[1] && hashArr[2] && hashArr[3]) {
            p = geocloud.transformPoint(hashArr[2], hashArr[3], "EPSG:4326", "EPSG:900913");
            cloud.get().zoomToPoint(p.x, p.y, hashArr[1]);
        } else {
            cloud.get().zoomToExtent();
        }
        (function pollForLayers() {
            if (layers.ready() && setting.ready()) {
                var arr, i;
                if (hashArr[0]) {
                    $(".base-map-button").removeClass("active");
                    $("#" + hashArr[0]).addClass("active");
                    if (hashArr[1] && hashArr[2] && hashArr[3]) {
                        setBaseLayer.init(hashArr[0]);
                        if (hashArr[4]) {
                            arr = hashArr[4].split(",");
                            for (i = 0; i < arr.length; i++) {
                                switchLayer.init(arr[i], true, true);
                            }
                        }
                    }
                    legend.init();
                } else {
                    // Set base layer to the first added one.
                    setBaseLayer.init(baseLayer.getBaseLayer()[0]);
                    var extent = setting.getExtent();
                    if (extent !== null) {
                        if (BACKEND === "cartodb") {
                            cloud.get().map.fitBounds(extent);
                        } else {
                            cloud.get().zoomToExtent(extent);
                        }
                    } else {
                        cloud.get().zoomToExtent();
                    }
                }
                if (typeof urlVars.k !== "undefined") {
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
                            if (response.data.customData !== null){
                                backboneEvents.get().trigger("on:customData", response.data.customData);
                            }
                            /**
                             * Recreate print
                             */
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
                                            $(".leaflet-control-graphicscale").prependTo("#scalebar").css("transform", "scale(" + scaleFactor + ")");
                                            $(".leaflet-control-graphicscale").prependTo("#scalebar").css("transform-origin", "left bottom 0px");
                                            $("#scale").html("1 : " + response.data.scale);
                                            $("#title").html(decodeURI(urlVars.t));
                                            parr = urlVars.c.split("#");
                                            if (parr.length > 1) {
                                                parr.pop();
                                            }
                                            $("#comment").html(decodeURI(parr.join()));
                                            cloud.get().map.removeLayer(g);
                                        }, 300)
                                    }
                                });
                            }

                            /**
                             * Recreate Drawings
                             */
                            if (response.data.draw !== null) {
                                GeoJsonAdded = false;
                                parr = response.data.draw;
                                v = parr;
                                draw.control();
                                l = draw.getLayer();
                                t = draw.getTable();
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
                                t.loadDataInTable();
                                draw.control();
                            }

                            /**
                             * Recreate query draw
                             */
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

                            /**
                             * Recreate query buffer
                             */
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

                            /**
                             * Recreate result
                             */
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


                        }
                    });


                }
                backboneEvents.get().trigger("end:state");
            } else {
                setTimeout(pollForLayers, 50);
            }
        }());
    },
    setBaseLayer: function(b) {
        setBaseLayer = b;
    }
};