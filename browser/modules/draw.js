/**
 * @fileoverview Description of file, its uses and information
 * about its dependencies.
 */

'use strict';

/**
 * @type {*|exports|module.exports}
 */
var cloud;

/**
 *
 * @type {boolean}
 */
var drawOn = false;

/**
 *
 * @type {L.FeatureGroup}
 */
var drawnItems = new L.FeatureGroup();

/**
 * @type {*|exports|module.exports}
 */
var drawControl;

/**
 * @type {gc2table}
 */
var table;

/**
 *
 * @type {geocloud.sqlStore}
 */
var store = new geocloud.sqlStore({
    clickable: true
});

/**
 *
 * @type {Array}
 */
var destructFunctions = [];

/**
 * @type {L.EditToolbar.Popup}
 */
var editPopUp;

/**
 * @type {*|exports|module.exports}
 */
var backboneEvents;

/**
 * Get readable distance of layer
 * @param e
 * @returns {string}
 * @private
 */
var _getDistance = function (e) {
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

/**
 * Get readable area of layer
 * @param e
 * @returns {string}
 * @private
 */
var _getArea = function (e) {
    return L.GeometryUtil.readableArea(L.GeometryUtil.geodesicArea(e.getLatLngs()), true);
};

/**
 *
 * @type {{set: module.exports.set, control: module.exports.control, init: module.exports.init, getDrawOn: module.exports.getDrawOn, getLayer: module.exports.getLayer, getTable: module.exports.getTable, setDestruct: module.exports.setDestruct}}
 */
module.exports = {
    set: function (o) {
        cloud = o.cloud;
        backboneEvents = o.backboneEvents;
        return this;
    },
    control: function () {
        if ($("#draw-btn").is(':checked')) {
            backboneEvents.get().trigger("on:drawing");

            // Turn info click off
            backboneEvents.get().trigger("off:infoClick");

            L.drawLocal = require('./drawLocales/draw.js');
            var editActions = [
                //L.Edit.Popup.Edit,
                //L.Edit.Popup.Delete,
                L._ToolbarAction.extendOptions({
                    toolbarIcon: {
                        className: 'leaflet-color-picker',
                        html: '<span class="fa fa-eyedropper"></span>'
                    },
                    subToolbar: new L._Toolbar({
                        actions: [
                            L.ColorPicker.extendOptions({color: '#ff0000'}),
                            L.ColorPicker.extendOptions({color: '#00ff00'}),
                            L.ColorPicker.extendOptions({color: '#0000ff'}),
                            L.ColorPicker.extendOptions({color: '#000000'})
                        ]
                    })
                })
            ];

            drawControl = new L.Control.Draw({
                position: 'topright',
                draw: {
                    polygon: {
                        title: 'Draw a polygon!',
                        allowIntersection: true,
                        shapeOptions: {
                            color: '#ff0000'
                        },
                        showArea: true
                    },
                    polyline: {
                        metric: true,
                        shapeOptions: {
                            color: '#ff0000'
                        }
                    },
                    rectangle: {
                        shapeOptions: {
                            color: '#ff0000'
                        }
                    },
                    circle: {
                        shapeOptions: {
                            color: '#ff0000'
                        }
                    }
                },
                edit: {
                    featureGroup: drawnItems
                }
            });

            cloud.map.addControl(drawControl);
            drawOn = true;

            // Unbind events
            cloud.map.off('draw:created');
            cloud.map.off('draw:drawstart');
            cloud.map.off('draw:drawstop');
            cloud.map.off('draw:editstart');
            cloud.map.off('draw:deleted');

            // Bind events
            cloud.map.on('draw:created', function (e) {
                var type = e.layerType, area = null, distance = null, drawLayer = e.layer;
                if (type === 'marker') {
                    var text = prompt(__("Enter a text for the marker or cancel to add without text"), "");
                    if (text !== null) {
                        drawLayer.bindLabel(text, {noHide: true}).on("click", function () {
                        }).showLabel();
                    }
                }
                drawnItems.addLayer(drawLayer);

                drawLayer.on('click', function (event) {
                    editPopUp = new L.EditToolbar.Popup(event.latlng, {
                        className: 'leaflet-draw-toolbar',
                        actions: editActions
                    }).addTo(cloud.map, drawLayer);
                });

                if (type === "polygon" || type === "rectangle") {
                    area = _getArea(drawLayer);
                    //distance = getDistance(drawLayer);
                }
                if (type === 'polyline') {
                    distance = _getDistance(drawLayer);
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
                    if (typeof v._mRadius !== "undefined") {
                        v.feature.properties.distance = L.GeometryUtil.readableDistance(v._mRadius, true);
                    }
                    else if (typeof v._icon !== "undefined") {
                    } else if (v.feature.properties.distance !== null) {
                        v.feature.properties.distance = _getDistance(v);
                    }
                    else if (v.feature.properties.area !== null) {
                        v.feature.properties.area = _getArea(v);
                    }
                });
                table.loadDataInTable();
            });

            var po1 = $('.leaflet-draw-section:eq(0)').popover({content: __("Use these tools for creating markers, lines, areas, squares and circles."), placement: "left"});
            po1.popover("show");
            setTimeout(function () {
                po1.popover("hide");
            }, 2500);

            var po2 = $('.leaflet-draw-section:eq(1)').popover({content: __("Use these tools for editing existing drawings."), placement: "left"});
            po2.popover("show");
            setTimeout(function () {
                po2.popover("hide");
            }, 2500);
        } else {
            backboneEvents.get().trigger("off:drawing");

            // Turn info click on again
            backboneEvents.get().trigger("on:infoClick");

            drawOn = false;
        }
    },
    init: function () {
        cloud.map.addLayer(drawnItems);
        store.layer = drawnItems;
        $("#draw-table").append("<table class='table'></table>");
        (function poll() {
            if (gc2table.isLoaded()) {
                var height;
                try {
                    height = require('./height')().max - 350;
                } catch (e) {
                    console.info(e.message);
                    height = 0;
                }
                table = gc2table.init({
                    el: "#draw-table table",
                    geocloud2: cloud,
                    locale: window._vidiLocale.replace("_", "-"),
                    store: store,
                    cm: [
                        {
                            header: __("Type"),
                            dataIndex: "type",
                            sortable: true
                        },
                        {
                            header: __("Area"),
                            dataIndex: "area",
                            sortable: true
                        },
                        {
                            header: __("Distance/Radius"),
                            dataIndex: "distance",
                            sortable: true
                        }
                    ],
                    autoUpdate: false,
                    loadData: false,
                    height: height,
                    setSelectedStyle: false,
                    responsive: false,
                    openPopUp: false
                });

            } else {
                setTimeout(poll, 30);
            }
        }());
    },
    off: function () {
        // Clean up
        try {
            cloud.map.removeControl(drawControl);
        } catch (e) {
        }
        $("#draw-btn").prop("checked", false);
        // Unbind events
        cloud.map.off('draw:created');
        cloud.map.off('draw:deleted');
        cloud.map.off('draw:edited');
        // Call destruct functions
        $.each(destructFunctions, function (i, v) {
            v();
        });
    },

    /**
     *
     * @returns {boolean}
     */
    getDrawOn: function () {
        return drawOn;
    }
    ,

    /**
     *
     * @returns {L.FeatureGroup|*}
     */
    getLayer: function () {
        return store.layer;
    }
    ,

    /**
     *
     * @returns {gc2table}
     */
    getTable: function () {
        return table;
    }
    ,

    /**
     *
     * @param f {string}
     */
    setDestruct: function (f) {
        destructFunctions.push(f);
    }
}
;

/**
 *
 * @type {*|{}}
 */
L.Edit = L.Edit || {};
L.Edit.Popup = L.Edit.Popup || {};

L.Edit.Popup.Edit = L._ToolbarAction.extend({
    options: {
        toolbarIcon: {className: 'leaflet-draw-edit-edit'}
    },

    initialize: function (map, shape, options) {
        this._map = map;

        this._shape = shape;
        this._shape.options.editing = this._shape.options.editing || {};

        L._ToolbarAction.prototype.initialize.call(this, map, options);
    },

    enable: function () {
        var map = this._map,
            shape = this._shape;

        shape.editing.enable();
        map.removeLayer(this.toolbar);

        map.on('click', function () {
            shape.editing.disable();
        });
    }
});

/**
 *
 * @type {*|{}}
 */
L.Edit = L.Edit || {};
L.Edit.Popup = L.Edit.Popup || {};

L.Edit.Popup.Delete = L._ToolbarAction.extend({
    options: {
        toolbarIcon: {className: 'leaflet-draw-edit-remove'}
    },

    initialize: function (map, shape, options) {
        this._map = map;
        this._shape = shape;

        L._ToolbarAction.prototype.initialize.call(this, map, options);
    },

    addHooks: function () {
        this._map.removeLayer(this._shape);
        this._map.removeLayer(this.toolbar);
        table.loadDataInTable();

    }
});


L.EditToolbar.Popup = L._Toolbar.Popup.extend({
    options: {
        actions: [
            L.Edit.Popup.Edit,
            L.Edit.Popup.Delete
        ]
    },

    onAdd: function (map) {
        var shape = this._arguments[1];

        if (shape instanceof L.Marker) {
            /* Adjust the toolbar position so that it doesn't cover the marker. */
            this.options.anchor = L.point(shape.options.icon.options.popupAnchor);
        }
        L._Toolbar.Popup.prototype.onAdd.call(this, map);
        $(".leaflet-color-picker span").trigger("click");
    }
});

L.ColorPicker = L._ToolbarAction.extend({
    options: {
        toolbarIcon: {className: 'leaflet-color-swatch'}
    },

    initialize: function (map, shape, options) {
        this._shape = shape;

        L.setOptions(this, options);
        L._ToolbarAction.prototype.initialize.call(this, map, options);
    },

    addHooks: function () {
        this._shape.setStyle({color: this.options.color});
        this.disable();
    },

    _createIcon: function (toolbar, container, args) {
        var colorSwatch = L.DomUtil.create('div'),
            width, height;

        L._ToolbarAction.prototype._createIcon.call(this, toolbar, container, args);

        L.extend(colorSwatch.style, {
            backgroundColor: this.options.color,
            width: L.DomUtil.getStyle(this._link, 'width'),
            height: L.DomUtil.getStyle(this._link, 'height'),
            border: '3px solid ' + L.DomUtil.getStyle(this._link, 'backgroundColor')
        });

        this._link.appendChild(colorSwatch);

        L.DomEvent.on(this._link, 'click', function () {
            cloud.map.removeLayer(this.toolbar.parentToolbar);
        }, this);
    }
});

