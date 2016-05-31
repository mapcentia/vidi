var cloud;
var sqlQuery;
var reproject = require('reproject');
var jsts = require('jsts');
var searchOn = false;
var drawnItems = new L.FeatureGroup();
var bufferItems = new L.FeatureGroup();
var foundedItems = new L.FeatureGroup();
var drawControl;
var qstore = [];
var noUiSlider = require('nouislider');
var bufferSlider = document.getElementById('buffer-slider');
var bufferValue = document.getElementById('buffer-value');

noUiSlider.create(bufferSlider, {
    start: 40,
    connect: "lower",
    step: 1,
    range: {
        min: 0,
        max: 200
    }
});

// When the slider value changes, update the input
bufferSlider.noUiSlider.on('update', function( values, handle ) {
    bufferValue.value = values[handle];
});

// When the input changes, set the slider value
bufferValue.addEventListener('change', function(){
    bufferSlider.noUiSlider.set([this.value]);
});

var clearDrawItems = function () {
    drawnItems.clearLayers();
    bufferItems.clearLayers();
    foundedItems.clearLayers();
    sqlQuery.reset(qstore);

};

var geoJSONFromDraw = function () {

};

module.exports = {
    set: function (o) {
        cloud = o.cloud;
        sqlQuery = o.sqlQuery;
        cloud.map.addLayer(drawnItems);
        cloud.map.addLayer(bufferItems);

        return this;
    },
    control: function () {
        if (!searchOn) {
            $("#buffer").show();
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

            // Bind events
            cloud.map.on('draw:created', function (e) {
                drawnItems.addLayer(e.layer);
            });
            cloud.map.on('draw:drawstart', function (e) {
                clearDrawItems();
            });
            cloud.map.on('draw:drawstop', function (e) {
                var primitive,
                layer, buffer = parseFloat($("#buffer-value").val());
                console.log(buffer);
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
                    var crss = {
                        "proj": "+proj=utm +zone=" + "32" + " +ellps=WGS84 +datum=WGS84 +units=m +no_defs",
                        "unproj": "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs"
                    };
                    var reader = new jsts.io.GeoJSONReader();
                    var writer = new jsts.io.GeoJSONWriter();
                    var geom = reader.read(reproject.reproject(primitive, "unproj", "proj", crss));
                    var buffer4326 = reproject.reproject(writer.write(geom.geometry.buffer(buffer)), "proj", "unproj", crss);
                    var buffered = reader.read(buffer4326);
                    L.geoJson(buffer4326,{
                        "color": "#ff7800",
                        "weight": 1,
                        "opacity": 1,
                        "fillOpacity": 0.1,
                        "dashArray": '5,3'
                    }).addTo(bufferItems);
                    sqlQuery.init(qstore, buffered.toText(), "4326");
                }

            });
            cloud.map.on('draw:editstop', function (e) {
                var geoJSON = geoJSONFromDraw();
                if (geoJSON) {
                    console.log(geoJSON);
                }
            });
            cloud.map.on('draw:editstart', function (e) {
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
        L.drawLocal = require('./drawLocales/advancedInfo.js');
    },
    getSearchOn: function () {
        return searchOn;
    }
}
;

