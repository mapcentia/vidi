/*
 * @author     Alexander Shumilov
 * @copyright  2013-2018 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

'use strict';

const MODULE_ID = `advancedInfo`;

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
        // Reset all SQL Query layers, in case another tools has
        // created a layer while this one was switch on
        sqlQuery.init(qstore, buffered.toText(), "4326");
    }
};

let _self = false;

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

        _self = this;
        return this;
    },

    /**
     *
     */
    init: function () {
        backboneEvents.get().on(`reset:all reset:${MODULE_ID} off:all` , () => {
            _self.off();
            _self.reset();
        });
        backboneEvents.get().on(`on:${MODULE_ID}`, () => { _self.on(); });
        backboneEvents.get().on(`off:${MODULE_ID}`, () => { _self.off(); });

        $("#advanced-info-btn").on("click", function () {
            _self.control();
        });

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

    on: () => {
        backboneEvents.get().trigger("advancedInfo:turnedOn");

        // Reset all SQL Query layers
        backboneEvents.get().trigger("sqlQuery:clear");

        $("#buffer").show();

       // L.drawLocal = require('./drawLocales/advancedInfo.js');
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
                marker: true,
                circlemarker: false
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
            // Clear all SQL query layers
            backboneEvents.get().trigger("sqlQuery:clear");
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
    },

    /**
     *
     */
    control: function () {
        if ($("#advanced-info-btn").is(':checked')) {
            _self.on();
            backboneEvents.get().trigger(`off:infoClick`);
        } else {
            searchOn = false;
            
            _self.off();
            backboneEvents.get().trigger(`on:infoClick`);
            backboneEvents.get().trigger("advancedInfo:turnedOff");
        }
    },

    off: function () {
        searchOn = false;
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
    },

    reset: () => _clearDrawItems()
};

