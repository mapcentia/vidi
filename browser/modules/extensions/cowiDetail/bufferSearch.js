var cloud;
var infoClick;
var draw;
var circle1, circle2, marker;
var jsts = require('jsts');
var reproject = require('reproject');
var store;
var db = "test";
var drawnItemsMarker = new L.FeatureGroup();
var drawnItemsPolygon = new L.FeatureGroup();
var drawControl;

var reset = function (s) {
    s.abort();
    s.reset();
    cloud.removeGeoJsonStore(s);

    $("#info-tab").empty();
    $("#info-pane").empty();
};

module.exports = {
    set: function (o) {
        cloud = o.cloud;
        infoClick = o.infoClick;
        draw = o.draw;
        L.DrawToolbar.include({
            getModeHandlers: function (map) {
                return [
                    {
                        enabled: true,
                        handler: new L.Draw.Marker(map, {icon: new L.Icon.Default()}),
                        title: 'Sæt en markør'
                    },
                    {
                        enabled: true,
                        handler: new L.Draw.Polygon(map, {
                            shapeOptions: {
                                color: '#662d91',
                                fillOpacity: 0
                            },
                            allowIntersection: false,
                            drawError: {
                                color: '#b00b00',
                                timeout: 1000
                            }
                        }),
                        title: 'Tegn en polygon'

                    }
                ];
            }
        });
        drawControl = new L.Control.Draw({
            position: 'topright',
            edit: false
        });
        cloud.map.addControl(drawControl);
        cloud.map.addLayer(drawnItemsMarker);
        cloud.map.addLayer(drawnItemsPolygon);

        // Set destruct in draw module, so this modules events are bound again
        var me = this.init;
        draw.setDestruct(function () {
            me();
        });
        return this;
    },
    init: function () {
        // Bind events
        cloud.map.on('draw:created', function (e) {
            e.layer._vidi_type = "draw";
            if (e.layerType === "marker") {
                console.log(e.layer);
                var awm = L.marker(e.layer._latlng, {icon: L.AwesomeMarkers.icon({icon: 'fa-shopping-cart', markerColor: 'blue', prefix: 'fa'})});
                drawnItemsMarker.addLayer(awm);
            } else {
                drawnItemsPolygon.addLayer(e.layer);
            }
        });
        cloud.map.on('draw:drawstart', function (e) {
            infoClick.active(false); // Switch standard info click off
            if (e.layerType === "marker") {
                drawnItemsMarker.clearLayers();
                try {
                    cloud.map.removeLayer(circle1);
                    cloud.map.removeLayer(circle2);
                } catch (e) {
                    console.log(e.message)
                }
            } else {
                drawnItemsPolygon.clearLayers();
            }
        });
        cloud.map.on('draw:drawstop', function (e) {
            if (e.layerType === "marker") {
                buffer();
            } else {
                polygon();
            }
            infoClick.active(true); // Switch standard info click on again
        });
    }
};

var buffer = function () {
    var layer;
    for (var prop in drawnItemsMarker._layers) {
        layer = drawnItemsMarker._layers[prop];
        break;
    }
    if (typeof layer === "undefined") {
        return;
    }

    var crss = {
        "proj": "+proj=utm +zone=" + "32" + " +ellps=WGS84 +datum=WGS84 +units=m +no_defs",
        "unproj": "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs"
    };
    var reader = new jsts.io.GeoJSONReader();
    var writer = new jsts.io.GeoJSONWriter();
    var geom = reader.read(reproject.reproject(layer.toGeoJSON(), "unproj", "proj", crss));

    var c1 = reproject.reproject(writer.write(geom.geometry.buffer(500)), "proj", "unproj", crss);
    circle1 = L.geoJson(c1, {
        "color": "#ff7800",
        "weight": 1,
        "opacity": 1,
        "fillOpacity": 0.1,
        "dashArray": '5,3'
    }).addTo(cloud.map);

    var c2 = reproject.reproject(writer.write(geom.geometry.buffer(1000)), "proj", "unproj", crss);
    circle2 = L.geoJson(c2, {
        "color": "#ff7800",
        "weight": 1,
        "opacity": 1,
        "fillOpacity": 0.1,
        "dashArray": '5,3'
    }).addTo(cloud.map);

    store = createStore();
    store.sql = JSON.stringify([reader.read(c1).toText(), reader.read(c2).toText()]);
    //cloud.addGeoJsonStore(store);
    store.load();

    // Create a clean up click event
    /*cloud.on("click", function (e) {
     try {
     drawnItemsMarker.clearLayers();
     cloud.map.removeLayer(circle1);
     cloud.map.removeLayer(circle2);

     } catch (e) {
     }
     });*/

    // Enable standard info click again
    //infoClick.init();
};

var polygon = function () {
    var layer;
    for (var prop in drawnItemsPolygon._layers) {
        layer = drawnItemsPolygon._layers[prop];
        break;
    }
    if (typeof layer === "undefined") {
        return;
    }

    var reader = new jsts.io.GeoJSONReader();
    var geom = reader.read(layer.toGeoJSON());

    store = createStore();
    store.sql = JSON.stringify([geom.geometry.toText()]);
    //cloud.addGeoJsonStore(store);
    store.load();

    // Create a clean up click event
    cloud.on("click", function (e) {
        try {
            drawnItemsPolygon.clearLayers();

        } catch (e) {
        }
    });

};

var createStore = function () {
    var hit = false, isEmpty = true;
    return new geocloud.sqlStore({
        jsonp: false,
        method: "POST",
        host: "",
        db: db,
        uri: "/api/extension/cowiDetail",
        clickable: true,
        id: 1,
        onLoad: function () {
            var layerObj = this;
            $('#modal-info-body').show();
            $.each(layerObj.geoJSON.features, function (i, feature) {
                if (feature.properties.radius) {
                    var layer;
                    for (var prop in drawnItemsMarker._layers) {
                        layer = drawnItemsMarker._layers[prop];
                        break;
                    }
                    $("#r-coord-val").html("L: " + ( Math.round(layer._latlng.lng * 10000) / 10000) + "  B: " + ( Math.round(layer._latlng.lat * 10000) / 10000));

                    if (feature.properties.radius === "500") {
                        $("#r500-val").html(feature.properties.antal)
                    } else {
                        $("#r1000-val").html(feature.properties.antal)
                    }
                } else {
                    $("#polygon-val").html(feature.properties.antal)
                }
            });
            $('#main-tabs a[href="#info-content"]').tab('show');
        },
        styleMap: {
            weight: 2,
            color: '#660000',
            dashArray: '',
            fillOpacity: 0.2
        },
        onEachFeature: function (f, l) {
            if (typeof l._layers !== "undefined") {
                l._layers[Object.keys(l._layers)[0]]._vidi_type = "query_result";
            } else {
                l._vidi_type = "query_result";
            }
        }
    });
};
