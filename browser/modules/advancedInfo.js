var cloud;
var sqlQuery;
var infoClick;
var reproject = require('reproject');
var _ = require('underscore');
var jsts = require('jsts');
var searchOn = false;
var drawnItems = new L.FeatureGroup();
var bufferItems = new L.FeatureGroup();
var drawControl;
var qstore = [];
var noUiSlider = require('nouislider');
var bufferSlider = document.getElementById('buffer-slider');
var bufferValue = document.getElementById('buffer-value');

var clearDrawItems = function () {
    drawnItems.clearLayers();
    bufferItems.clearLayers();
    sqlQuery.reset(qstore);
};

var makeSearch = function () {
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

module.exports = {
    set: function (o) {
        cloud = o.cloud;
        sqlQuery = o.sqlQuery;
        infoClick = o.infoClick;
        cloud.map.addLayer(drawnItems);
        cloud.map.addLayer(bufferItems);
        return this;
    },
    control: function () {
        if (!searchOn) {
            $("#buffer").show();

            // Reset layer made by clickInfo
            infoClick.reset();
            L.drawLocal = require('./drawLocales/advancedInfo.js');
            drawControl = new L.Control.Draw({
                position: 'topright',
                draw: {
                    polygon: {
                        title: 'Draw a polygon!',
                        allowIntersection: false,
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

            cloud.map.addControl(drawControl);
            searchOn = true;

            // Unbind events
            cloud.map.off('draw:created');
            cloud.map.off('draw:drawstart');
            cloud.map.off('draw:drawstop');
            cloud.map.off('draw:editstart');

            // Bind events
            cloud.map.on('draw:created', function (e) {
                e.layer._vidi_type = "query_draw";
                drawnItems.addLayer(e.layer);
            });
            cloud.map.on('draw:drawstart', function (e) {
                clearDrawItems();
            });
            cloud.map.on('draw:drawstop', function (e) {
                makeSearch();
            });
            cloud.map.on('draw:editstop', function (e) {
                makeSearch();
            });
            cloud.map.on('draw:editstart', function (e) {
                bufferItems.clearLayers();
            });
        } else {
            // Clean up
            console.log("Stoping advanced search");
            clearDrawItems();

            // Unbind events
            cloud.map.off('draw:created');
            cloud.map.off('draw:drawstart');
            cloud.map.off('draw:drawstop');
            cloud.map.off('draw:editstart');
            cloud.map.removeControl(drawControl);
            searchOn = false;
            $("#buffer").hide();
        }
    },
    init: function (str) {
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
                    makeSearch()
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
    getSearchOn: function () {
        return searchOn;
    },
    getDrawLayer: function () {
        return drawnItems;
    },
    getBufferLayer: function () {
        return bufferItems;
    }
};

