/*
 * @author     Martin Høgh <mh@mapcentia.com>
 * @copyright  2013-2018 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

'use strict';

const MODULE_NAME = `measurements`;

const drawTools = require(`./drawTools`);

/**
 * @type {*|exports|module.exports}
 */
let cloud, state, serializeLayers, backboneEvents, utils;

/**
 *
 * @type {L.FeatureGroup}
 */
let drawnItems = new L.FeatureGroup();

let drawControl, embedDrawControl, measurementControlButton;

let editing = false;

let drawOn = false;

let _self = false;

let embedModeIsEnabled = false;

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
        state.listenTo(MODULE_NAME, _self);
        state.listen(MODULE_NAME, `update`);

        // Detect if the embed template is used
        if ($(`#floating-container-secondary`).length === 1) {
            embedModeIsEnabled = true;
        }

        if (embedModeIsEnabled) {
            let buttonClass = `btn btn-default btn-fab btn-fab-mini map-tool-btn`;
            let buttonStyle = `padding-top: 4px;`;
            let buttonStyleHidden = `padding-top: 4px; display: none;`;

            let container = `#floating-container-secondary`;

            // Expand measurements control
            $(container).append(`<a href="javascript:void(0)" title="${__("Expand measurements control")}" id="measurements-module-btn" class="${buttonClass}" style="${buttonStyle}">
                <i class="fa fa-ruler" style="font-size: 20px;"></i>
            </a>`);
            $(`#measurements-module-btn`).click((event) => {
                $(event.currentTarget).hide(0, () => {
                    $(`#measurements-module-draw-line-btn`).show();
                    $(`#measurements-module-draw-polygon-btn`).show();
                    $(`#measurements-module-delete-btn`).show();
                    $(`#measurements-module-cancel-btn`).show();
                });
            });

            // Draw controls
            $(container).append(`
            <a href="javascript:void(0)" title="${__("Collapse measurements control")}" id="measurements-module-cancel-btn" class="${buttonClass}" style="${buttonStyleHidden}">
                <i class="fa fa-ban" style="font-size: 20px;"></i>
            </a>
            <a href="javascript:void(0)" title="${__("Measure the distance")}" id="measurements-module-draw-line-btn" class="${buttonClass}" style="${buttonStyleHidden}">
                <i class="fa fa-project-diagram" style="font-size: 20px;"></i>
            </a>
            <a href="javascript:void(0)" title="${__("Measure the area")}" id="measurements-module-draw-polygon-btn" class="${buttonClass}" style="${buttonStyleHidden}">
                <i class="fa fa-vector-square" style="font-size: 20px;"></i>
            </a>
            <a href="javascript:void(0)" title="${__("Delete all measurements")}" id="measurements-module-delete-btn" class="${buttonClass}" style="${buttonStyleHidden}">
                <i class="fa fa-trash" style="font-size: 20px;"></i>
            </a>`);

            // Distance measurement
            $(container).find(`#measurements-module-draw-line-btn`).click(() => {
                _self.toggleMeasurements(true);

                drawnItems.eachLayer(layer => {
                    if (layer && layer.feature && layer.feature.properties && layer.feature.properties.type ===`polyline`) {
                        drawnItems.removeLayer(layer);
                    }
                });

                if (embedDrawControl) {
                    embedDrawControl.disable();
                }

                embedDrawControl = new L.Draw.Polyline(cloud.get().map);
                embedDrawControl.enable();
            });

            // Area measurement
            $(container).find(`#measurements-module-draw-polygon-btn`).click(() => {
                _self.toggleMeasurements(true);

                drawnItems.eachLayer(layer => {
                    if (layer && layer.feature && layer.feature.properties && layer.feature.properties.type ===`polygon`) {
                        drawnItems.removeLayer(layer);
                    }
                });

                if (embedDrawControl) {
                    embedDrawControl.disable();
                }

                embedDrawControl = new L.Draw.Polygon(cloud.get().map);
                embedDrawControl.enable();
            });

            // Area measurement
            $(container).find(`#measurements-module-delete-btn`).click(() => {
                if (drawnItems) {
                    drawnItems.clearLayers();
                }

                if (embedDrawControl) {
                    embedDrawControl.disable();
                }
            });

            // Collapse measurements control
            $(container).find(`#measurements-module-cancel-btn`).click(() => {
                $(`#measurements-module-draw-line-btn`).hide();
                $(`#measurements-module-draw-polygon-btn`).hide();
                $(`#measurements-module-delete-btn`).hide();
                $(`#measurements-module-cancel-btn`).hide();

                $(`#measurements-module-btn`).show();

                _self.toggleMeasurements(false);
            });
        } else {
            let MeasurementControl = L.Control.extend({
                options: {
                    position: 'topright'
                },
                onAdd: function (map) {
                    let container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
                    container.style.backgroundColor = 'white';
                    container.style.width = `30px`;
                    container.style.height = `30px`;
                    container.title = __(`Measure distance`);

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
            cloud.get().map.addControl(measurementControlButton);
        }
        cloud.get().map.addLayer(drawnItems);
    },

    off: () => {
        _self.toggleMeasurements(false, false);
    },

    toggleMeasurements: (activate = false, triggerEvents = true) => {
        if (activate) {
            $('.leaflet-control-custom').find('.leaflet-bar-part-single').html('<span class="fa fa-ban"></span>');

            if (triggerEvents) backboneEvents.get().trigger(`${MODULE_NAME}:turnedOn`);

            drawOn = true;

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
            $('.leaflet-control-custom').find('.leaflet-bar-part-single').html('<span class="fa fa-ruler"></span>');

            if (triggerEvents) backboneEvents.get().trigger(`${MODULE_NAME}:turnedOff`);

            drawOn = false;

            if (embedDrawControl) {
                embedDrawControl.disable();
            }

            if (drawControl) {
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
    recreateDrawnings: (parr) => {
        let v = parr;
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
        return new Promise((resolve, reject) => {
            if (drawnItems) {
                drawnItems.clearLayers();
            }

            if (newState && `measurements` in newState && newState.measurements) {
                _self.recreateDrawnings(JSON.parse(newState.measurements));
            }
            
            resolve();
        });
    },
};

