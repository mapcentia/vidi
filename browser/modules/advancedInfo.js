/*
 * @author     Alexander Shumilov
 * @copyright  2013-2022 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

'use strict';

import {GEOJSON_PRECISION} from './constants';

const MODULE_ID = `advancedInfo`;
let cloud;
let sqlQuery;
const reproject = require('reproject');
let searchOn = false;
let drawnItems = new L.FeatureGroup();
let bufferItems = new L.FeatureGroup();
let drawControl;
let qstore = [];
const noUiSlider = require('nouislider');
let bufferSlider;
let bufferValue;
const _clearDrawItems = function () {
    drawnItems.clearLayers();
    bufferItems.clearLayers();
    sqlQuery.reset(qstore);
};
let backboneEvents;
const debounce = require('lodash/debounce');
const _makeSearch = function () {
    let primitive, coord,
        layer, buffer = parseFloat($("#buffer-value").val());

    for (const prop in drawnItems._layers) {
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
    primitive = layer.toGeoJSON(GEOJSON_PRECISION);
    if (primitive) {
        if (typeof layer.getBounds !== "undefined") {
            coord = layer.getBounds().getSouthWest();
        } else {
            coord = layer.getLatLng();
        }
        // Get utm zone
        const zone = require('./utmZone.js').getZone(coord.lat, coord.lng);
        const crss = {
            "proj": "+proj=utm +zone=" + zone + " +ellps=WGS84 +datum=WGS84 +units=m +no_defs",
            "unproj": "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs"
        };
        const reader = new jsts.io.GeoJSONReader();
        const writer = new jsts.io.GeoJSONWriter();
        const geom = reader.read(reproject.reproject(primitive, "unproj", "proj", crss));
        const buffer4326 = reproject.reproject(writer.write(geom.geometry.buffer(buffer)), "proj", "unproj", crss);
        const buffered = reader.read(buffer4326);
        const l = L.geoJson(buffer4326, {
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
        backboneEvents.get().on(`off:all`, () => {
            _self.off();
        });
        backboneEvents.get().on(`reset:all reset:${MODULE_ID}`, () => {
            _self.off();
            _self.reset();
        });
        backboneEvents.get().on(`on:${MODULE_ID}`, () => {
            _self.on();
        });
        backboneEvents.get().on(`off:${MODULE_ID}`, () => {
            _self.off();
        });

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
            bufferSlider.noUiSlider.on('update', debounce(function (values, handle) {
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
        if (!drawControl) {
            backboneEvents.get().trigger("advancedInfo:turnedOn");
            $("#buffer").show();
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
            _self.unbindEvents();
            // Bind events
            cloud.get().map.on('draw:created', function (e) {
                e.layer._vidi_type = "query_draw";
                if (e.layerType === 'marker') {

                    e.layer._vidi_marker = true;
                }
                drawnItems.addLayer(e.layer);
            });
            cloud.get().map.on('draw:drawstart', function () {
                // Clear all SQL query layers
                backboneEvents.get().trigger("sqlQuery:clear");
            });
            cloud.get().map.on('draw:drawstop', function () {
                _makeSearch();
            });
            cloud.get().map.on('draw:editstop', function () {
                _makeSearch();
            });
            cloud.get().map.on('draw:editstart', function () {
                bufferItems.clearLayers();
            });
            const po = $('.leaflet-draw-toolbar-top').popover({
                content: __("Use these tools for querying the overlay maps."),
                placement: "left"
            });
            po.popover("show");
            setTimeout(function () {
                po.popover("hide");
            }, 2500);
        }
    },

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
        _self.unbindEvents();

        if (drawControl) {
            cloud.get().map.removeControl(drawControl);
        }
        drawControl = false;
        $("#buffer").hide();
    },

    getSearchOn: function () {
        return searchOn;
    },

    getDrawLayer: function () {
        return drawnItems;
    },

    getBufferLayer: function () {
        return bufferItems;
    },

    reset: () => _clearDrawItems(),

    unbindEvents: () => {
        cloud.get().map.off('draw:created');
        cloud.get().map.off('draw:drawstart');
        cloud.get().map.off('draw:drawstop');
        cloud.get().map.off('draw:editstart');
        cloud.get().map.off('draw:editstop');
        cloud.get().map.off('draw:deletestart');
        cloud.get().map.off('draw:deletestop');
        cloud.get().map.off('draw:deleted');
        cloud.get().map.off('draw:edited');
    }
};

