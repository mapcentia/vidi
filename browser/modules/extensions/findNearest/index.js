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
var proccess;

var clearRoutes;

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

        utils.createMainTab("findnearest", "Find nærmest", "sdsd", require('./../../height')().max);
        $('#main-tabs a[href="#findnearest-content"]').tab('show');

        // Append to DOM
        //==============

        $("#findnearest").append(dom);

        // Init search with custom callback
        // ================================

        search.init(function () {
            console.log(this.layer.toGeoJSON().features["0"].geometry.coordinates);
            cloud.get().map.addLayer(this.layer);
            proccess(this.layer.toGeoJSON().features["0"].geometry.coordinates);

        }, "findnearest-custom-search");

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
            sql: "SELECT * FROM fot_test.punkter",
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
        $("#findnearest-result").empty();
        cloud.get().layerControl.removeLayer("_findNearestPoints");
        $("#findnearest-custom-search").val("");
    }
};

/**
 *
 * @param p
 */
proccess = function (p) {
    var xhr = $.ajax({
        method: "POST",
        url: "/api/extension/findNearest",
        data: JSON.stringify(p),
        dataType: "json",
        scriptCharset: "utf-8",
        contentType: "application/json; charset=utf-8",

        success: function (response) {
            var lg, id;
            $("#findnearest-result").empty();

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
                $("#findnearest-result").append('<div class="checkbox"><label class="overlay-label" style="width: calc(100% - 50px);"><input type="checkbox" id="' + id + '" data-gc2-id="' + id + '"><span>' + id + ' ' + Math.round(response[i].length) + ' m</span></label><span data-toggle="tooltip" data-placement="left" title="' + "hej" + '" style="display: inline" class="info-label label label-primary">Info</span></div>')
            }
            console.log(routeLayers);

        },
        error: function () {
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
    '<label><input id="findnearest-btn" type="checkbox">Aktiver find</label>' +
    '</div>' +
    '</div>' +
    '</div>' +

    '<div id="findnearest-places" class="places" style="margin-bottom: 20px; display: none">' +
    '<input id="findnearest-custom-search" class="findnearest-custom-search typeahead" type="text" placeholder="Adresse eller matrikelnr.">' +
    '</div>' +

    '<div id="findnearest-result-panel" role="tabpanel" style="display: none">' +
    '<div class="panel panel-default"><div class="panel-body">' +
    '<div id="findnearest-result">' +
    '</div>' +
    '</div>' +
    '</div>';
