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
var sqlQuery;

/**
 *
 * @type {*|exports|module.exports}
 */
var reproject = require('reproject');

/**
 *
 * @type {_|exports|module.exports}
 */
var _ = require('underscore');

/**
 *
 * @type {exports|module.exports}
 */
var jsts = require('jsts');

/**
 *
 * @type {boolean}
 */
var searchOn = false;

/**
 *
 * @type {L.FeatureGroup}
 */
var drawnItems = new L.FeatureGroup();

/**
 *
 * @type {L.FeatureGroup}
 */
var bufferItems = new L.FeatureGroup();

/**
 * @type {*|exports|module.exports}
 */
var drawControl;

/**
 *
 * @type {Array}
 */
var qstore = [];

/**
 * @type {*|exports|module.exports}
 */
var noUiSlider = require('nouislider');

/**
 *
 * @type {Element}
 */
var bufferSlider;

/**
 *
 * @type {Element}
 */
var bufferValue;

/**
 *
 * @private
 */
var _clearDrawItems = function () {
    drawnItems.clearLayers();
    bufferItems.clearLayers();
    sqlQuery.reset(qstore);
};

var backboneEvents;


/**
 *
 * @private
 */
var _makeSearch = function () {
    var primitive, coord,
        layer, buffer = parseFloat($("#buffer-value").val());

    for (var prop in drawnItems._layers) {
        layer = drawnItems._layers[prop];
        break;
    }
    if (typeof layer === "undefined") {
        return;
    }
    if (typeof layer._mRadius !== "undefined") {
        if (typeof layer._mRadius !== "undefined") {
            buffer = buffer + layer._mRadius;
        }
    }
    primitive = layer.toGeoJSON();
    if (primitive) {
        if (typeof layer.getBounds !== "undefined") {
            coord = layer.getBounds().getSouthWest();
        } else {
            coord = layer.getLatLng();
        }
        // Get utm zone
        var zone = require('./utmZone.js').getZone(coord.lat, coord.lng);
        var crss = {
            "proj": "+proj=utm +zone=" + zone + " +ellps=WGS84 +datum=WGS84 +units=m +no_defs",
            "unproj": "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs"
        };
        var reader = new jsts.io.GeoJSONReader();
        var writer = new jsts.io.GeoJSONWriter();
        var geom = reader.read(reproject.reproject(primitive, "unproj", "proj", crss));
        var buffer4326 = reproject.reproject(writer.write(geom.geometry.buffer(buffer)), "proj", "unproj", crss);
        var buffered = reader.read(buffer4326);
        var l = L.geoJson(buffer4326, {
            "color": "#ff7800",
            "weight": 1,
            "opacity": 1,
            "fillOpacity": 0.1,
            "dashArray": '5,3'
        }).addTo(bufferItems);
        l._layers[Object.keys(l._layers)[0]]._vidi_type = "query_buffer";
        sqlQuery.init(qstore, buffered.toText(), "4326");
    }
};

/**
 *
 * @type {{set: module.exports.set, control: module.exports.control, init: module.exports.init, getSearchOn: module.exports.getSearchOn, getDrawLayer: module.exports.getDrawLayer, getBufferLayer: module.exports.getBufferLayer}}
 */
module.exports = {
    /**
     *
     * @param o {object}
     * @returns {exports}
     */
    set: function (o) {
        cloud = o.cloud;
        sqlQuery = o.sqlQuery;
        backboneEvents = o.backboneEvents;
        return this;
    },
    /**
     *
     */
    control: function () {
        if ($("#advanced-info-btn").is(':checked')) {
            backboneEvents.get().trigger("on:advancedInfo");

            // Turn info click off
            backboneEvents.get().trigger("off:infoClick");

            $("#buffer").show();

            L.drawLocal = require('./drawLocales/advancedInfo.js');
            drawControl = new L.Control.Draw({
                position: 'topright',
                draw: {
                    polygon: {
                        title: 'Draw a polygon!',
                        allowIntersection: true,
                        drawError: {
                            color: '#b00b00',
                            timeout: 1000
                        },
                        shapeOptions: {
                            color: '#662d91',
                            fillOpacity: 0
                        },
                        showArea: true
                    },
                    polyline: {
                        metric: true,
                        shapeOptions: {
                            color: '#662d91',
                            fillOpacity: 0
                        }
                    },
                    circle: {
                        shapeOptions: {
                            color: '#662d91',
                            fillOpacity: 0
                        }
                    },
                    rectangle: {
                        shapeOptions: {
                            color: '#662d91',
                            fillOpacity: 0
                        }
                    },
                    marker: true
                },
                edit: {
                    featureGroup: drawnItems,
                    remove: false
                }
            });

            cloud.get().map.addControl(drawControl);
            searchOn = true;
            // Unbind events
            cloud.get().map.off('draw:created');
            cloud.get().map.off('draw:drawstart');
            cloud.get().map.off('draw:drawstop');
            cloud.get().map.off('draw:editstart');
            // Bind events
            cloud.get().map.on('draw:created', function (e) {
                e.layer._vidi_type = "query_draw";
                if (e.layerType === 'marker') {

                    e.layer._vidi_marker = true;
                }
                drawnItems.addLayer(e.layer);
            });
            cloud.get().map.on('draw:drawstart', function (e) {
                _clearDrawItems();
            });
            cloud.get().map.on('draw:drawstop', function (e) {
                _makeSearch();
            });
            cloud.get().map.on('draw:editstop', function (e) {
                _makeSearch();
            });
            cloud.get().map.on('draw:editstart', function (e) {
                bufferItems.clearLayers();
            });
            var po = $('.leaflet-draw-toolbar-top').popover({content: __("Use these tools for querying the overlay maps."), placement: "left"});
            po.popover("show");
            setTimeout(function () {
                po.popover("hide");
            }, 2500);
        } else {
            searchOn = false;
            backboneEvents.get().trigger("off:advancedInfo");

            // Turn info click on again
            backboneEvents.get().trigger("on:infoClick");
        }
    },
    /**
     *
     */
    init: function () {
        //TEST
        cloud.get().map.addLayer(drawnItems);
        cloud.get().map.addLayer(bufferItems);

        bufferSlider = document.getElementById('buffer-slider');
        bufferValue = document.getElementById('buffer-value');
        try {
            noUiSlider.create(bufferSlider, {
                start: 40,
                connect: "lower",
                step: 1,
                range: {
                    min: 0,
                    max: 500
                }
            });
            bufferSlider.noUiSlider.on('update', _.debounce(function (values, handle) {
                bufferValue.value = values[handle];
                if (typeof bufferItems._layers[Object.keys(bufferItems._layers)[0]] !== "undefined" && typeof bufferItems._layers[Object.keys(bufferItems._layers)[0]]._leaflet_id !== "undefined") {
                    bufferItems.clearLayers();
                    _makeSearch()
                }
            }, 300));

            // When the input changes, set the slider value
            bufferValue.addEventListener('change', function () {
                bufferSlider.noUiSlider.set([this.value]);
            });

        } catch (e) {
            console.info(e.message);
        }
    },
    off: function () {
        // Clean up
        _clearDrawItems();
        $("#advanced-info-btn").prop("checked", false);
        // Unbind events
        cloud.get().map.off('draw:created');
        cloud.get().map.off('draw:drawstart');
        cloud.get().map.off('draw:drawstop');
        cloud.get().map.off('draw:editstart');
        try {
            cloud.get().map.removeControl(drawControl);
        } catch (e) {
        }
        $("#buffer").hide();
    },
    /**
     *
     * @returns {boolean}
     */
    getSearchOn: function () {
        return searchOn;
    },
    /**
     *
     * @returns {L.FeatureGroup}
     */
    getDrawLayer: function () {
        return drawnItems;
    },
    /**
     *
     * @returns {L.FeatureGroup}
     */
    getBufferLayer: function () {
        return bufferItems;
    }
};

