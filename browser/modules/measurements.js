/*
 * @author     Martin Høgh <mh@mapcentia.com>
 * @copyright  2013-2018 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

'use strict';

const MODULE_NAME = `measurements`;

const drawTools = require(`./drawTools`);

/**
 * Browser detection
 */
const {detect} = require('detect-browser');
const browser = detect();

/**
 * @type {*|exports|module.exports}
 */
let cloud, state, serializeLayers, backboneEvents, utils;

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
        utils = o.utils;
        _self = this;
        return this;
    },

    init: () => {
        backboneEvents.get().on(`reset:all reset:${MODULE_NAME} off:all`, () => {
            _self.toggleMeasurements(false, false);
        });
        backboneEvents.get().on(`on:${MODULE_NAME}`, () => {
            _self.toggleMeasurements();
        });
        backboneEvents.get().on(`off:${MODULE_NAME}`, () => {
            _self.toggleMeasurements(false, false);
        });

        state.listenTo(MODULE_NAME, _self);
        state.listen(MODULE_NAME, `update`);
        state.getModuleState(MODULE_NAME).then(initialState => {
            _self.applyState(initialState)
        });

        let MeasurementControl = L.Control.extend({
            options: {
                position: 'topright'
            },
            onAdd: function (map) {
                let container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom leaflet-control-measurements');
                container.title = __(`Measure distance`);

                container = $(container).append(`<a class="leaflet-bar-part leaflet-bar-part-single js-measurements-control" style="outline: none; background-color: white;">
                        <span class="bi bi-rulers"></span>
                    </a>`)[0];

                container.onclick = function () {
                    _self.toggleMeasurements((drawControl ? false : true));
                }

                return container;
            }
        });

        measurementControlButton = new MeasurementControl();
        cloud.get().map.addControl(measurementControlButton);

        setTimeout(() => {
            $(`.leaflet-control`).each((index, item) => {
                if ($(item).html() === ``) {
                    $(item).remove();
                }
            });
        }, 100);

        cloud.get().map.addLayer(drawnItems);
    },

    toggleMeasurements: (activate = false, triggerEvents = true) => {
        if (activate) {
            backboneEvents.get().trigger(`off:all`);
            backboneEvents.get().trigger(`hide:all`);

            $('.leaflet-control-custom').find('.js-measurements-control').html('<span class="bi bi-slash-circle"></span>');
            if (triggerEvents) backboneEvents.get().trigger(`${MODULE_NAME}:turnedOn`);
            drawOn = true;

            L.drawLocal = require('./drawLocales/draw.js');

            drawControl = new L.Control.Draw({
                position: 'topright',
                draw: {
                    polygon: {
                        allowIntersection: true,
                        shapeOptions: {}
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
                    icon: cloud.iconSmall,
                    metric: true,
                    precision: {
                        m: 1,
                        km: 2
                    },
                }
            });

            if ($(`.leaflet-control-measurements div`).length === 0) {
                $(`.leaflet-control-measurements`).append(`<div class="appended-leaflet-control"></div>`)
            }

            $(`.leaflet-control-measurements div`).append(drawControl.onAdd(cloud.get().map));
            $(`.leaflet-control-measurements .appended-leaflet-control`).show();

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
            $('.leaflet-control-custom').find('.js-measurements-control').html('<span class="bi bi-rulers"></span>');

            if (triggerEvents) backboneEvents.get().trigger(`${MODULE_NAME}:turnedOff`);

            drawOn = false;

            if (drawControl) {
                $(`.leaflet-control-measurements div`).empty();
                $(`.leaflet-control-measurements .appended-leaflet-control`).hide();
                cloud.get().map.removeControl(drawControl);
            }

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

        l.showMeasurements({
            formatArea: utils.formatArea
        });

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

        if (type === 'polyline' && browser && [`ie`, `edge`].indexOf(browser.name) === -1) {
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
    recreateDrawnings: (parr) => {
        let v = parr;
        try {
            $.each(v[0].geojson.features, (n, m) => {
                let json = L.geoJson(m, {
                    style: function (f) {
                        return f.style;
                    }
                });

                let g = json._layers[Object.keys(json._layers)[0]];
                g._vidi_type = m._vidi_type;
                drawnItems.addLayer(g);
                g.showMeasurements(m._vidi_measurementOptions);
                if (m._vidi_extremities) {
                    g.showExtremities(m._vidi_extremities.pattern, m._vidi_extremities.size, m._vidi_extremities.where);
                }
            });
        } catch (e) {
            console.error(e.message)
        }
    },


    /**
     * Returns current module state
     */
    getState: () => {
        // console.log("GET STATE")
        let state = false;
        if (drawOn) {
            state = serializeLayers.serializeMeasurementItems(true);
        }

        return {measurements: state};
    },

    /**
     * Applies externally provided state
     */
    applyState: (newState) => {
        return new Promise((resolve, reject) => {
            if (drawnItems) {
                drawnItems.clearLayers();
            }

            if (newState && `measurements` in newState && newState.measurements) {
                _self.recreateDrawnings(newState.measurements);
            }

            resolve();
        });
    },
};

