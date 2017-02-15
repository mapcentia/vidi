/**
 * @fileoverview Description of file, its uses and information
 * about its dependencies.
 */

'use strict';

/**
 *
 * @type {*|exports|module.exports}
 */
var cloud;


/**
 *
 * @type {*|exports|module.exports}
 */
var utils;

/**
 *
 * @type {*|exports|module.exports}
 */
var backboneEvents;

/**
 *
 * @type {*|exports|module.exports}
 */
var urlparser = require('./../../urlparser');

/**
 *
 * @type {array}
 */
var urlVars = urlparser.urlVars;

/**
 * @type {string}
 */
var db = urlparser.db;

/**
 *
 * @type {*|exports|module.exports}
 */
var search = require('./../../search/danish');

/**
 *
 */
var process;

var clearRoutes;

var cleanUp;

/**
 *
 * @type {*|exports|module.exports}
 */
var switchLayer;

/**
 *
 */
var startMarker = L.geoJson(null, {});

/**
 *
 * @type {{set: module.exports.set, init: module.exports.init}}
 */

/**
 *
 */
var store;

var routeLayers = [];

module.exports = module.exports = {

    /**
     *
     * @param o
     * @returns {exports}
     */
    set: function (o) {
        cloud = o.cloud;
        utils = o.utils;
        switchLayer = o.switchLayer;
        backboneEvents = o.backboneEvents;
        return this;
    },

    /**
     *
     */
    init: function () {

        utils.createMainTab("findnearest", "Find nærmest", "Skriv en startadresse i feltet. Trafiksikre veje til kommunens skoler kan derefter vises på kortet, ved at klikke fluebenet til på listen. Strækninger via stier bliver vist med grønt og via vej bliver vist med rødt.", require('./../../height')().max);
        $('#main-tabs a[href="#findnearest-content"]').tab('show');

        // Append to DOM
        //==============

        $("#findnearest").append(dom);

        // Init search with custom callback
        // ================================

        search.init(function () {
            console.log(this.layer.toGeoJSON().features["0"].geometry.coordinates);
            cloud.get().map.addLayer(this.layer);
            process(this.layer.toGeoJSON().features["0"].geometry.coordinates);
        }, "findnearest-custom-search", true);

    },

    /**
     *
     */
    control: function () {
        var me = this;
        if ($("#findnearest-btn").is(':checked')) {

            // Emit "on" event
            //================

            backboneEvents.get().trigger("on:findNearest");

        } else {

            store.reset();

            // Emit "off" event
            //=================

            backboneEvents.get().trigger("off:findNearest");
        }
    },

    addPointLayer: function () {
        var id = "_findNearestPoints";
        store = new geocloud.sqlStore({
            jsonp: false,
            method: "POST",
            host: "",
            db: db,
            uri: "/api/sql",
            clickable: true,
            id: id,
            name: id,
            lifetime: 0,
            sql: "SELECT * FROM fot_test.skoler",
            pointToLayer: function (feature, latlng) {
                return L.marker(latlng, {
                    icon: L.AwesomeMarkers.icon({
                            icon: 'fa-graduation-cap',
                            markerColor: 'green',
                            prefix: 'fa'
                        }
                    )
                });
            },
            onEachFeature: function (feature, layer) {
                layer.bindPopup(feature.properties['navn']);
            },
            onLoad: function () {
                var me = this;
            }
        });
        // Add the geojson layer to the layercontrol
        cloud.get().addGeoJsonStore(store);
        store.load();
    },

    removePointLayer: function () {
        store.reset();
    },

    /**
     * Turns conflict off and resets DOM
     */
    off: function () {
        // Clean up
        clearRoutes();
        cloud.get().layerControl.removeLayer("_findNearestPoints");
        cleanUp();
    }

};

cleanUp = function () {
    clearRoutes();
    $("#findnearest-result").empty();
};

/**
 *
 * @param p
 */
process = function (p) {
    cleanUp();
    backboneEvents.get().trigger("start:findNearestProcess");

    var xhr = $.ajax({
        method: "POST",
        url: "/api/extension/findNearest",
        data: JSON.stringify({"db": db, "p": p}),
        dataType: "json",
        scriptCharset: "utf-8",
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            var lg, id;
            $("#findnearest-result").empty();
            backboneEvents.get().trigger("stop:findNearestProcess");
            for (var i = 0; i < response.length; i++) {
                lg = L.geoJson(response[i], {
                    style: function (feature) {
                        return {
                            color: (function getColor(d) {
                                return d === 'Sti' ? '#00ff00' : '#ff0000';
                            }(feature.properties.name)),
                            weight: 5,
                            dashArray: '',
                            opacity: 0.8
                        };
                    },
                    onEachFeature: function (feature, layer) {
                        layer.on({
                            mouseover: function () {
                                console.log("HEJ")
                            },
                            mouseout: function () {

                            }
                        });
                    },
                    clickable: true
                });
                id = "_route_" + i;
                lg.id = id;
                routeLayers.push(cloud.get().layerControl.addOverlay(lg, id));
                $("#findnearest-result").append('<div class="checkbox"><label class="overlay-label" style="width: calc(100% - 50px);"><input type="checkbox" id="' + id + '" data-gc2-id="' + id + '"><span>' + response[i].name + ' (' + Math.round(response[i].length) + ' m)</span></label></div>')
            }
            console.log(routeLayers);

        },
        error: function () {
            backboneEvents.get().trigger("stop:findNearestProcess");
            //jquery("#snackbar-conflict").snackbar("hide");
        }
    })
};

clearRoutes = function () {
    var i, layer;
    for (i = 0; i < routeLayers.length; i++) {
        layer = cloud.get().getLayersByName("_route_" + i);
        cloud.get().map.removeLayer(layer);
        cloud.get().layerControl.removeLayer(layer);
    }
    routeLayers = [];
};


/**
 *
 * @type {string}
 */
var dom =
    '<div role="tabpanel">' +
    '<div class="panel panel-default"><div class="panel-body">' +
    '<div class="togglebutton">' +
    '<label><input id="findnearest-btn" type="checkbox">Aktiver find skolevej</label>' +
    '</div>' +
    '</div>' +
    '</div>' +

    '<div id="findnearest-places" class="places" style="position: relative; margin-bottom: 20px; display: none">' +
    '<input id="findnearest-custom-search" class="findnearest-custom-search typeahead" type="text" placeholder="Adresse">' +
    '<i style="position:absolute;right:8px;top:10px;bottom:0;height:14px;margin:auto;font-size:24px;color:#ccc;display: none" class="fa fa-cog fa-spin fa-lg"></i>' +
    '</div>' +

    '<div id="findnearest-result-panel" role="tabpanel" style="display: none">' +
    '<div class="panel panel-default">' +
    '<div class="panel-body">' +
    '<div style="margin-bottom: 10px">' +
    '<span style="display: inline-block; background-color: #00ff00; width: 20px; height: 5px; margin: 2px 5px 2px 2px"></span><span>På sti</span>' +
    '<span style="display: inline-block; background-color: #ff0000; width: 20px; height: 5px; margin: 2px 5px 2px 20px"></span><span>På vej</span>' +
    '</div>' +
    '<div id="findnearest-result">' +
    '</div>' +
    '</div>' +
    '</div>';
