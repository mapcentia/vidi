var cloud;
var drawOn = false;
var drawnItems = new L.FeatureGroup();
var drawControl;
var table;
var store = new geocloud.sqlStore({
    clickable: true
});

var getDistance = function (e) {
    var tempLatLng = null;
    var totalDistance = 0.00000;
    $.each(e._latlngs, function (i, latlng) {
        if (tempLatLng == null) {
            tempLatLng = latlng;
            return;
        }
        totalDistance += tempLatLng.distanceTo(latlng);
        tempLatLng = latlng;
    });
    return L.GeometryUtil.readableDistance(totalDistance, true);
};

var getArea = function (e) {
    return L.GeometryUtil.readableArea(L.GeometryUtil.geodesicArea(e.getLatLngs()), true);
};

module.exports = {
    set: function (o) {
        cloud = o.cloud;
        return this;
    },
    control: function () {
        if (!drawOn) {
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
                            color: '#bada55'
                        },
                        showArea: true
                    },
                    polyline: {
                        metric: true
                    },
                    circle: {
                        shapeOptions: {
                            color: '#662d91'
                        }
                    }
                },
                edit: {
                    featureGroup: drawnItems
                }
            });

            cloud.map.addLayer(drawnItems);
            cloud.map.addControl(drawControl);
            drawOn = true;

            // Bind events
            cloud.map.on('draw:created', function (e) {
                var type = e.layerType, area = null, distance = null, drawLayer = e.layer;
                if (type === 'marker') {
                    var text = prompt("Enter a text for the marker or cancel to add without text", "");
                    if (text !== null) {
                        drawLayer.bindLabel(text, {noHide: true}).on("click", function () {
                        }).showLabel();
                    }
                }
                drawnItems.addLayer(drawLayer);
                if (type === "polygon" || type === "rectangle") {
                    area = getArea(drawLayer);
                    //distance = getDistance(drawLayer);
                }
                if (type === 'polyline') {
                    distance = getDistance(drawLayer);
                }
                if (type === 'circle') {
                    distance = L.GeometryUtil.readableDistance(drawLayer._mRadius, true);
                }
                drawLayer._vidi_type = "draw";
                drawLayer.feature = {
                    properties: {
                        type: type,
                        area: area,
                        distance: distance
                    }
                };
                table.loadDataInTable();
            });
            cloud.map.on('draw:deleted', function (e) {
                table.loadDataInTable();
            });
            cloud.map.on('draw:edited', function (e) {
                $.each(e.layers._layers, function (i, v) {
                    if (v.feature.properties.distance !== null) {
                        v.feature.properties.distance = getDistance(v);
                    }
                    if (v.feature.properties.area !== null) {
                        v.feature.properties.area = getArea(v);
                    }
                });
                table.loadDataInTable();
            });

        } else {
            // Clean up
            console.log("Stooping drawing");
            cloud.map.removeControl(drawControl);
            drawOn = false;

            // Unbind events
            cloud.map.off('draw:created');
            cloud.map.off('draw:deleted');
            cloud.map.off('draw:edited');
        }
    },
    init: function (str) {
        L.drawLocal = require('./drawLocales/draw.js');
        store.layer = drawnItems;
        $("#draw-table").append("<table class='table'></table>");
        (function poll() {
            if (gc2table.isLoaded()) {
                table = gc2table.init({
                    "el": "#draw-table table",
                    "geocloud2": cloud,
                    "store": store,
                    "cm": [
                        {
                            header: "Type",
                            dataIndex: "type",
                            sortable: true
                        },
                        {
                            header: "Area",
                            dataIndex: "area",
                            sortable: true
                        },
                        {
                            header: "Distance/Radius",
                            dataIndex: "distance",
                            sortable: true
                        }
                    ],
                    "autoUpdate": false,
                    loadData: false,
                    height: require('./height')().max - 210,
                    setSelectedStyle: false,
                    responsive: false,
                    openPopUp: true
                });

            } else {
                setTimeout(poll, 30);
            }
        }());
    },
    getDrawOn: function () {
        return drawOn;
    },
    getLayer: function(){
        return store.layer;
    },
    getTable: function(){
        return table;
    }
}
;

