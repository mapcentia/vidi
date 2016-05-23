var cloud;
var drawOn = false;
var drawnItems;
var drawControl;
var drawLayer;
module.exports = module.exports = {
    set: function (o) {
        cloud = o.cloud;
        return this;
    },
    init: function (str) {
        cloud.map.on('draw:created', function (e) {
            var type = e.layerType;
            drawLayer = e.layer;
            if (type === 'marker') {
                var text = prompt("Enter a text for the marker or cancel to add without text", "");
                if (text !== null) {
                    drawLayer.bindLabel(text, {noHide: true}).on("click", function () {
                    }).showLabel();
                }
            }
            drawnItems.addLayer(drawLayer);
        });
            if (!drawOn) {
                drawnItems = new L.FeatureGroup();
                drawControl = new L.Control.Draw({
                    position: 'bottomright',
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
            } else {
                console.log(drawnItems);
                cloud.map.removeControl(drawControl);
                drawnItems.removeLayer(drawLayer);
                cloud.map.removeLayer(drawnItems);
                drawOn = false;
            }
    },
    getDrawOn: function(){
        return drawOn;
    }
};

