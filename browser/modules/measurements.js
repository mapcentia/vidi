/**
 * @fileoverview Description of file, its uses and information
 * about its dependencies.
 */

'use strict';

const MODULE_NAME = `measurements`;

const drawTools = require(`./drawTools`);

/**
 * @type {*|exports|module.exports}
 */
let cloud, state, serializeLayers, backboneEvents;

/**
 *
 * @type {L.FeatureGroup}
 */
let drawnItems = new L.FeatureGroup();

let drawControl, measurementControlButton;

let editing = false;

let drawOn = false;

let _self = false;

/**
 *
 * @type {{set: module.exports.set, init: module.exports.init}}
 */
module.exports = {
    set: function (o) {
        cloud = o.cloud;
        state = o.state;
        serializeLayers = o.serializeLayers;
        backboneEvents = o.backboneEvents;
        _self = this;
        return this;
    },

    init: () => {
        state.listenTo(MODULE_NAME, _self);
        state.listen(MODULE_NAME, `update`);

        let MeasurementControl = L.Control.extend({
            options: {
                position: 'topright'
            },
            onAdd: function (map) {
                let container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
                container.style.backgroundColor = 'white';
                container.style.width = `30px`;
                container.style.height = `30px`;
                container.title = `Measure distance`;

                container = $(container).append(`<a class="leaflet-bar-part leaflet-bar-part-single" style="outline: none;">
                    <span class="fa fa-ruler"></span>
                </a>`)[0];

                container.onclick = function(){
                    _self.toggleMeasurements((drawControl ? false : true));
                }

                return container;
            }
        });

        measurementControlButton = new MeasurementControl();
        cloud.get().map.addLayer(drawnItems);
        cloud.get().map.addControl(measurementControlButton);
    },

    toggleMeasurements: (activate = false) => {
        if (activate) {
            drawOn = true;

            backboneEvents.get().trigger("on:drawing");
            backboneEvents.get().trigger("off:infoClick");

            L.drawLocal = require('./drawLocales/draw.js');            

            drawControl = new L.Control.Draw({
                position: 'topright',
                draw: {
                    polygon: {
                        allowIntersection: true,
                        shapeOptions: {},
                        showArea: true
                    },
                    polyline: {
                        metric: true,
                        shapeOptions: {}
                    },
                    rectangle: false,
                    circle: false,
                    marker: false,
                    circlemarker: false
                },
                edit: {
                    featureGroup: drawnItems
                }
            });

            drawControl.setDrawingOptions({
                polygon: {
                    icon: cloud.iconSmall
                },
                polyline: {
                    icon: cloud.iconSmall
                }
            });

            cloud.get().map.addControl(drawControl);

            let eventsToUnbind = [`created`, `drawstart`, `drawstop`, `editstart`, `editstop`, `deletestart`, `deletestop`, `deleted`, `created`, `edited`];
            eventsToUnbind.map(item => {
                cloud.get().map.off(`draw:${item}`);
            });

            // Bind events
            cloud.get().map.on('draw:editstart', e => {
                editing = true;
            });

            cloud.get().map.on('draw:editstop', e => {
                editing = false;
                backboneEvents.get().trigger(`${MODULE_NAME}:update`);
            });

            cloud.get().map.on('draw:deletestart', e => {
                editing = true;
            });

            cloud.get().map.on('draw:deletestop', e => {
                editing = false;
                backboneEvents.get().trigger(`${MODULE_NAME}:update`);
            });

            cloud.get().map.on('draw:created', e => {
                let type = e.layerType, area = null, distance = null, drawLayer = e.layer;

                drawnItems.addLayer(drawLayer);
                _self.setStyle(drawLayer, type);

                if (type === `polygon`) {
                    area = drawTools.getArea(drawLayer);
                } else if (type === 'polyline') {
                    distance = drawTools.getDistance(drawLayer);
                }

                drawLayer._vidi_type = `measurements`;
                drawLayer.feature = {
                    properties: {
                        type: type,
                        area: area,
                        distance: distance
                    }
                };

                backboneEvents.get().trigger(`${MODULE_NAME}:update`);
            });

            cloud.get().map.on('draw:deleted', function (e) {
                backboneEvents.get().trigger(`${MODULE_NAME}:update`);
            });

            cloud.get().map.on('draw:edited', function (e) {
                $.each(e.layers._layers, function (i, v) {
                    if (v.feature.properties.distance !== null) {
                        v.feature.properties.distance = drawTools.getDistance(v);
                        v.updateMeasurements();
                    } else if (v.feature.properties.area !== null) {
                        v.feature.properties.area = drawTools.getArea(v);
                        v.updateMeasurements();
                    }
                });

                backboneEvents.get().trigger(`${MODULE_NAME}:update`);
            });
        } else {
            drawOn = false;

            backboneEvents.get().trigger("off:drawing");
            backboneEvents.get().trigger("on:infoClick");

            cloud.get().map.removeControl(drawControl);
            drawControl = false;
        }
    },

    /**
     * Set style on layer
     * @param l
     * @param type
     */
    setStyle: (l, type) => {
        l.hideMeasurements();

        l.showMeasurements({ showTotal: true });

        let defaultMeasurementsStyle = {
            dashArray: `none`,
            lineCap: `butt`,
            color: `#ff0000`,
            weight: 4,
            opacity: 1
        };

        let defaultExtermitiesStyle = {
            pattern: "stopM",
            size: "4",
            where: "3"
        };

        l.setStyle(defaultMeasurementsStyle);

        if (type === 'polyline') {
            window.lag = l.showExtremities(defaultExtermitiesStyle.pattern, defaultExtermitiesStyle.size, defaultExtermitiesStyle.where);
            l._extremities = defaultExtermitiesStyle;
        }
    },

    /**
     * Recreates drawnings on the map
     * 
     * @param {Object} parr Features to draw
     * 
     * @return {void}
     */
    recreateDrawnings: (parr, enableControl = true) => {
        let v = parr;
        $.each(v[0].geojson.features, (n, m) => {
            console.log(`### m`, m);
            var json = L.geoJson(m, {
                style: function (f) {
                    return f.style;
                }
            });

            var g = json._layers[Object.keys(json._layers)[0]];

            // Adding vidi-specific properties
            g._vidi_type = m._vidi_type;

            drawnItems.addLayer(g);

            g.showMeasurements(m._vidi_measurementOptions);

            // Add extremities
            if (m._vidi_extremities) {
                g.showExtremities(m._vidi_extremities.pattern, m._vidi_extremities.size, m._vidi_extremities.where);
            }
        });
    },


    /**
     * Returns current module state
     */
    getState: () => {
        let state = false;
        if (drawOn) {
            state = JSON.stringify(serializeLayers.serializeMeasurementItems(true));
        }

        return { measurements: state };
    },

    /**
     * Applies externally provided state
     */
    applyState: (newState) => {

        console.log(`### applying new state`, newState);

        return new Promise((resolve, reject) => {
            try {

            if (drawnItems) {
                drawnItems.clearLayers();
            }

            if (newState && `measurements` in newState && newState.measurements) {

                _self.recreateDrawnings(JSON.parse(newState.measurements), false);


                /*
                newState.measurements.features.map(item => {

                
                    

                    let GeoJSON = {
                        type: item.type,
                        geometry: item.geometry,
                        properties: item.properties
                    };

                    console.log(`### item`, GeoJSON);
                    let jsonLayer = L.geoJson(GeoJSON);

                    console.log(`### jsonLayer`, jsonLayer);

                    let g = jsonLayer._layers[Object.keys(jsonLayer._layers)[0]];
                    g._vidi_type = m._vidi_type;


                    console.log(`### g`, g);
                    drawnItems.addLayer(g);

                    g.showMeasurements(m._vidi_measurementOptions);
                    g.showExtremities(m._vidi_extremities.pattern, m._vidi_extremities.size, m._vidi_extremities.where);
                });
                */
            }
        } catch(e) {
            console.log(e);
        }
            resolve();
        });
    },
};

