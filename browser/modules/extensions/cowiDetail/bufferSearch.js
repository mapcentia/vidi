var cloud;
var infoClick;
var draw;
var circle1, circle2, marker;
var jsts = require('jsts');
var reproject = require('reproject');
var store;
var db = "test";
var drawnItems = new L.FeatureGroup();
var drawControl;
var clearDrawItems = function () {
    drawnItems.clearLayers();
    // Clean up
    try {
        cloud.map.removeLayer(circle1);
        cloud.map.removeLayer(circle2);

    } catch (e) {
        console.log(e.message)
    }
    try {
        reset(store);
    } catch (e) {
        console.log(e.message)
    }
};
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
                        handler: new L.Draw.Marker(map, { icon: new L.Icon.Default() }),
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
        cloud.map.addLayer(drawnItems);

        // Set destruct in draw module, so this modules events are bound again
        var me = this.init;
        draw.setDestruct(function(){
            me();
        });
        return this;
    },
    init: function(){
        // Bind events
        cloud.map.on('draw:created', function (e) {
            e.layer._vidi_type = "query_draw";
            drawnItems.addLayer(e.layer);
        });
        cloud.map.on('draw:drawstart', function (e) {
            infoClick.active(false); // Switch standard info click off
            clearDrawItems();
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
    for (var prop in drawnItems._layers) {
        layer = drawnItems._layers[prop];
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
    store.sql = JSON.stringify([reader.read(c1).toText(),reader.read(c2).toText()]);
    cloud.addGeoJsonStore(store);
    store.load();

    // Create a clean up click event
    cloud.on("click", function (e) {
        try {
            drawnItems.clearLayers();
            cloud.map.removeLayer(circle1);
            cloud.map.removeLayer(circle2);

        } catch (e) {
        }
    });

    // Enable standard info click again
    //infoClick.init();
};

var polygon = function () {
    var layer;
    for (var prop in drawnItems._layers) {
        layer = drawnItems._layers[prop];
        break;
    }
    if (typeof layer === "undefined") {
        return;
    }

    var reader = new jsts.io.GeoJSONReader();
    var geom = reader.read(layer.toGeoJSON());

    store = createStore();
    store.sql = JSON.stringify([geom.geometry.toText()]);
    cloud.addGeoJsonStore(store);
    store.load();

    // Create a clean up click event
    cloud.on("click", function (e) {
        try {
            drawnItems.clearLayers();

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
            var layerObj = this, out = [], cm = [], first = true, storeId = this.id;
            isEmpty = layerObj.isEmpty();
            if (!isEmpty) {
                $('#modal-info-body').show();
                $("#info-tab").append('<li><a id="tab_' + storeId + '" data-toggle="tab" href="#_' + storeId + '">Antal indbyggere</a></li>');
                $("#info-pane").append('<div class="tab-pane" id="_' + storeId + '"><div class="panel panel-default"><div class="panel-body"><table class="table" data-show-toggle="true" data-show-export="true" data-show-columns="true"></table></div></div></div>');

                $.each(layerObj.geoJSON.features, function (i, feature) {
                    $.each(feature.properties, function (name, property) {
                        out.push([name, 0, name, property]);
                    });
                    out.sort(function (a, b) {
                        return a[1] - b[1];
                    });
                    if (first) {
                        $.each(out, function (name, property) {
                            cm.push({
                                header: property[2],
                                dataIndex: property[0],
                                sortable: true
                            })
                        });
                        first = false;
                    }
                    $('#tab_' + storeId).tab('show');
                    out = [];
                });
                var height = require('./../../height')().max - 370;
                gc2table.init({
                    el: "#_" + storeId + " table",
                    geocloud2: cloud,
                    store: layerObj,
                    cm: cm,
                    autoUpdate: false,
                    openPopUp: true,
                    setViewOnSelect: true,
                    responsive: false,
                    height: (height > 300) ? height : 300
                });
                hit = true;

            } else {
                layerObj.reset();
            }

            if (!hit) {
                $('#modal-info-body').hide();
            }

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
