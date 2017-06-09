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
 * @type {geocloud.get().sqlStore}
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

        var me = this;

        if ($("#draw-btn").is(':checked')) {
            backboneEvents.get().trigger("on:drawing");

            // Turn info click off
            backboneEvents.get().trigger("off:infoClick");

            L.drawLocal = require('./drawLocales/draw.js');

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

            drawControl.setDrawingOptions({
                polygon: {
                    icon: cloud.iconSmall
                },
                polyline: {
                    icon: cloud.iconSmall
                },
                rectangle: {
                    icon: cloud.iconSmall
                },
                circle: {
                    icon: cloud.iconSmall
                }
            });

            cloud.get().map.addControl(drawControl);
            drawOn = true;

            // Unbind events
            cloud.get().map.off('draw:created');
            cloud.get().map.off('draw:drawstart');
            cloud.get().map.off('draw:drawstop');
            cloud.get().map.off('draw:editstart');
            cloud.get().map.off('draw:deleted');

            // Bind events
            cloud.get().map.on('draw:created', function (e) {
                var type = e.layerType, area = null, distance = null, drawLayer = e.layer;
                if (type === 'marker') {

                    drawLayer._vidi_marker = true;

                    var text = prompt(__("Enter a text for the marker or cancel to add without text"), "");

                    if (text !== null) {
                        drawLayer.bindLabel(text, {noHide: true}).on("click", function () {
                        }).showLabel();

                        drawLayer._vidi_marker_text = text;

                    } else {

                        drawLayer._vidi_marker_text = null;
                    }

                }

                drawnItems.addLayer(drawLayer);

                me.setStyle(drawLayer, type);

                drawLayer.on('click', function (event) {

                    console.log(event);

                    me.setStyle(event.target, event.target.feature.properties.type);

                    var popup = L.popup()
                    popup.setLatLng(event.latlng)
                        .setContent("You clicked the map at " + event.latlng.toString())
                        .openOn(cloud.get().map);

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
            cloud.get().map.on('draw:deleted', function (e) {
                table.loadDataInTable();
            });
            cloud.get().map.on('draw:edited', function (e) {
                $.each(e.layers._layers, function (i, v) {

                    v.updateMeasurements();

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

    /**
     * Set style on layer
     * @param l
     * @param type
     */
    setStyle: function (l, type) {

        if ($("#draw-measure").is(":checked") && type !== 'marker') {
            l.hideMeasurements();
            l.showMeasurements({
                showTotal: $("#draw-line-total-dist").is(":checked")
            });
        } else {
            if (type !== 'marker'){
                l.hideMeasurements();
            }
        }


        if (type !== 'marker') {
            l.setStyle({dashArray: $("#draw-line-type").val()});
        }

        if (type !== 'marker') {

            l.setStyle({lineCap: $("#draw-line-cap").val()});

            l.setStyle({color: $("#draw-colorpicker-input").val()});

            l.setStyle({weight: $("#draw-line-weight").val()});

            l.setStyle({opacity: "1.0"});
        }

        if (type === 'polyline') {

            window.lag = l.showExtremities($("#draw-line-extremity").val(), $("#draw-line-extremity-size").val(), $("#draw-line-extremity-where").val());

            l._extremities = {
                pattern: $("#draw-line-extremity").val(),
                size: $("#draw-line-extremity-size").val(),
                where: $("#draw-line-extremity-where").val()
            }

        }



    },

    init: function () {
        cloud.get().map.addLayer(drawnItems);
        store.layer = drawnItems;
        $("#draw-colorpicker").colorpicker();
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
                    geocloud2: cloud.get(),
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
            cloud.get().map.removeControl(drawControl);
        } catch (e) {
        }
        $("#draw-btn").prop("checked", false);
        // Unbind events
        cloud.get().map.off('draw:created');
        cloud.get().map.off('draw:deleted');
        cloud.get().map.off('draw:edited');
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
    },

    /**
     *
     * @returns {L.FeatureGroup|*}
     */
    getLayer: function () {
        return store.layer;
    },

    /**
     *
     * @returns {gc2table}
     */
    getTable: function () {
        return table;
    },

    /**
     *
     * @param f {string}
     */
    setDestruct: function (f) {
        destructFunctions.push(f);
    }
};


/**
 * PolylineExtremities.js
 */
(function () {

    var __onAdd = L.Polyline.prototype.onAdd,
        __onRemove = L.Polyline.prototype.onRemove,
        __bringToFront = L.Polyline.prototype.bringToFront;


    var PolylineExtremities = {

        SYMBOLS: {
            stopM: {
                'viewBox': '0 0 2 8',
                'refX': '1',
                'refY': '4',
                'markerUnits': 'strokeWidth',
                'orient': 'auto',
                'path': 'M 0 0 L 0 8 L 2 8 L 2 0 z'
            },
            squareM: {
                'viewBox': '0 0 8 8',
                'refX': '4',
                'refY': '4',
                'markerUnits': 'strokeWidth',
                'orient': 'auto',
                'path': 'M 0 0 L 0 8 L 8 8 L 8 0 z'
            },
            dotM: {
                'viewBox': '0 0 20 20',
                'refX': '10',
                'refY': '10',
                'markerUnits': 'strokeWidth',
                'orient': 'auto',
                'path': 'M 10, 10 m -7.5, 0 a 7.5,7.5 0 1,0 15,0 a 7.5,7.5 0 1,0 -15,0'
            },
            dotL: {
                'viewBox': '0 0 45 45',
                'refX': '22.5',
                'refY': '22.5',
                'markerUnits': 'strokeWidth',
                'orient': 'auto',
                // http://stackoverflow.com/a/10477334
                'path': 'M 22.5, 22.5 m -20, 0 a 20,20 0 1,0 40,0 a 20,20 0 1,0 -40,0'
            },
            arrowM: {
                'viewBox': '0 0 10 10',
                'refX': '1',
                'refY': '5',
                'markerUnits': 'strokeWidth',
                'orient': 'auto',
                'path': 'M 0 0 L 10 5 L 0 10 z'
            },
        },

        onAdd: function (map) {
            __onAdd.call(this, map);
            this._drawExtremities();
        },

        onRemove: function (map) {
            map = map || this._map;
            __onRemove.call(this, map);
        },

        bringToFront: function () {
            __bringToFront.call(this);
            this._drawExtremities();
        },

        _drawExtremities: function () {
            var pattern = this._pattern;
            this.showExtremities(pattern);
        },

        showExtremities: function (pattern, size, where) {
            this._pattern = pattern;

            var id = 'pathdef-' + L.Util.stamp(this);

            this._path.setAttribute('marker-end', 'none');
            this._path.setAttribute('marker-start', 'none');

            if (pattern === "none") {
                return this;
            }

            /* If not in SVG mode or Polyline not added to map yet return */
            /* showExtremities will be called by onAdd, using value stored in this._pattern */
            if (!L.Browser.svg || typeof this._map === 'undefined') {
                return this;
            }

            /* If empty pattern, hide */
            if (!pattern) {
                if (this._patternNode && this._patternNode.parentNode)
                    this._map._pathRoot.removeChild(this._patternNode);
                return this;
            }

            var svg = this._map._pathRoot;

            // Check if the defs node is already created
            var defsNode;
            if (L.DomUtil.hasClass(svg, 'defs')) {
                defsNode = svg.getElementById('defs');
            } else {
                L.DomUtil.addClass(svg, 'defs');
                defsNode = L.Path.prototype._createElement('defs');
                defsNode.setAttribute('id', 'defs');
                var svgFirstChild = svg.childNodes[0];
                svg.insertBefore(defsNode, svgFirstChild);
            }


            // Add the marker to the line

            this._path.setAttribute('id', id);

            var markersNode, markerPath, symbol = PolylineExtremities.SYMBOLS[pattern];

            // Check if marker is already created
            if (document.getElementById("defs").querySelector("#" + id)) {
                markersNode = document.getElementById("defs").querySelector("#" + id);
                markerPath = document.getElementById("defs").querySelector("#" + id).querySelector("path")
            } else {
                markersNode = L.Path.prototype._createElement('marker');
                markerPath = L.Path.prototype._createElement('path');
            }

            // Create the markers definition
            markersNode.setAttribute('id', id);
            for (var attr in symbol) {
                if (attr != 'path') {
                    markersNode.setAttribute(attr, symbol[attr]);
                } else {
                    markerPath.setAttribute('d', symbol[attr]);
                }
            }

            // Copy the path apparence to the marker
            var styleProperties = ['class', 'stroke', 'stroke-opacity'];
            for (var i = 0; i < styleProperties.length; i++) {
                var styleProperty = styleProperties[i];
                var pathProperty = this._path.getAttribute(styleProperty);
                markersNode.setAttribute(styleProperty, pathProperty);
            }
            markersNode.setAttribute('fill', markersNode.getAttribute('stroke'));
            markersNode.setAttribute('fill-opacity', markersNode.getAttribute('stroke-opacity'));
            markersNode.setAttribute('stroke-opacity', '0');
            markersNode.setAttribute('markerWidth', size);
            markersNode.setAttribute('markerHeight', size);

            markersNode.appendChild(markerPath);

            defsNode.appendChild(markersNode);

            switch (where) {
                case "1":
                    this._path.setAttribute('marker-end', 'url(#' + id + ')');
                    break;

                case "2":
                    this._path.setAttribute('marker-start', 'url(#' + id + ')');
                    break;

                case "3":
                    this._path.setAttribute('marker-end', 'url(#' + id + ')');
                    this._path.setAttribute('marker-start', 'url(#' + id + ')');
                    break;
            }

            return this;
        }

    };

    L.Polyline.include(PolylineExtremities);

    L.LayerGroup.include({
        showExtremities: function (pattern) {
            for (var layer in this._layers) {
                if (typeof this._layers[layer].showExtremities === 'function') {
                    this._layers[layer].showExtremities(pattern);
                }
            }
            return this;
        }
    });

})();

/**
 * leaflet-measure-path.js
 */
(function () {
    'use strict';
    L.Icon.Measurement = L.DivIcon.extend({
        initialize: function (measurement, options) {
            L.Icon.prototype.initialize.call(this, L.extend({
                className: 'leaflet-measure-path-measurement',
                html: measurement,
                iconSize: [50, 18]
            }, options));
        }
    });

    L.icon.measurement = function (measurement, options) {
        return new L.Icon.Measurement(measurement, options);
    };

    L.Marker.Measurement = L.Marker.extend({
        initialize: function (latLng, measurement, options) {
            var icon = L.icon.measurement(measurement, options);
            L.Marker.prototype.initialize.call(this, latLng, L.extend({
                icon: icon
            }, options));
        },

        _setPos: function () {
            L.Marker.prototype._setPos.apply(this, arguments);
            if (this.options.rotation) {
                this._icon.style.transform += ' rotate(' + this.options.rotation + 'rad)';
            }
        }
    });

    L.marker.measurement = function (latLng, measurement, options) {
        return new L.Marker.Measurement(latLng, measurement, options);
    };

    var formatDistance = function (d) {
        var unit,
            feet;

        if (this._measurementOptions.imperial) {
            feet = d / 0.3048;
            if (feet > 3000) {
                d = d / 1609.344;
                unit = 'mi';
            } else {
                d = feet;
                unit = 'ft';
            }
        } else {
            if (d > 1000) {
                d = d / 1000;
                unit = 'km';
            } else {
                unit = 'm';
            }
        }

        if (d < 100) {
            return d.toFixed(1) + ' ' + unit;
        } else {
            return Math.round(d) + ' ' + unit;
        }
    };

    var formatArea = function (a) {
        var unit,
            sqfeet;

        if (this._measurementOptions.imperial) {
            if (a > 404.685642) {
                a = a / 4046.85642;
                unit = 'ac';
            } else {
                a = a / 0.09290304;
                unit = 'ft<sup>2</sup>';
            }
        } else {
            if (a > 100000) {
                a = a / 100000;
                unit = 'km<sup>2</sup>';
            } else {
                unit = 'm<sup>2</sup>';
            }
        }

        if (a < 100) {
            return a.toFixed(1) + ' ' + unit;
        } else {
            return Math.round(a) + ' ' + unit;
        }
    };

    var RADIUS = 6378137;
    // ringArea function copied from geojson-area
    // (https://github.com/mapbox/geojson-area)
    // This function is distributed under a separate license,
    // see LICENSE.md.
    var ringArea = function ringArea(coords) {
        var rad = function rad(_) {
            return _ * Math.PI / 180;
        };
        var p1, p2, p3, lowerIndex, middleIndex, upperIndex,
            area = 0,
            coordsLength = coords.length;

        if (coordsLength > 2) {
            for (var i = 0; i < coordsLength; i++) {
                if (i === coordsLength - 2) {// i = N-2
                    lowerIndex = coordsLength - 2;
                    middleIndex = coordsLength - 1;
                    upperIndex = 0;
                } else if (i === coordsLength - 1) {// i = N-1
                    lowerIndex = coordsLength - 1;
                    middleIndex = 0;
                    upperIndex = 1;
                } else { // i = 0 to N-3
                    lowerIndex = i;
                    middleIndex = i + 1;
                    upperIndex = i + 2;
                }
                p1 = coords[lowerIndex];
                p2 = coords[middleIndex];
                p3 = coords[upperIndex];
                area += ( rad(p3.lng) - rad(p1.lng) ) * Math.sin(rad(p2.lat));
            }

            area = area * RADIUS * RADIUS / 2;
        }

        return Math.abs(area);
    };

    var circleArea = function circleArea(d) {
        var rho = d / RADIUS;
        return 2 * Math.PI * RADIUS * RADIUS * (1 - Math.cos(rho));
    };

    var override = function (method, fn, hookAfter) {
        if (!hookAfter) {
            return function () {
                method.apply(this, arguments);
                fn.apply(this, arguments);
            }
        } else {
            return function () {
                fn.apply(this, arguments);
                method.apply(this, arguments);
            }
        }
    };

    L.Polyline.include({
        showMeasurements: function (options) {
            if (!this._map || this._measurementLayer) return this;

            this._measurementOptions = L.extend({
                showOnHover: false,
                minPixelDistance: 30,
                showDistances: true,
                showArea: true,
                showTotal: false,
                lang: {
                    totalLength: 'Total length',
                    totalArea: 'Total area',
                    segmentLength: 'Segment length'
                }
            }, options || {});

            this._measurementLayer = L.layerGroup().addTo(this._map);
            this.updateMeasurements();

            this._map.on('zoomend', this.updateMeasurements, this);

            return this;
        },

        hideMeasurements: function () {
            this._map.off('zoomend', this.updateMeasurements, this);

            if (!this._measurementLayer) return this;
            this._map.removeLayer(this._measurementLayer);
            this._measurementLayer = null;

            return this;
        },

        onAdd: override(L.Polyline.prototype.onAdd, function () {
            if (this.options.showMeasurements) {
                this.showMeasurements(this.options.measurementOptions);
            }
        }),

        onRemove: override(L.Polyline.prototype.onRemove, function () {
            this.hideMeasurements();
        }, true),

        setLatLngs: override(L.Polyline.prototype.setLatLngs, function () {
            this.updateMeasurements();
        }),

        spliceLatLngs: override(L.Polyline.prototype.spliceLatLngs, function () {
            this.updateMeasurements();
        }),

        formatDistance: formatDistance,
        formatArea: formatArea,

        updateMeasurements: function () {
            if (!this._measurementLayer) return;

            var latLngs = this.getLatLngs(),
                isPolygon = this instanceof L.Polygon,
                options = this._measurementOptions,
                totalDist = 0,
                formatter,
                ll1,
                ll2,
                pixelDist,
                dist;

            this._measurementLayer.clearLayers();

            if (this._measurementOptions.showDistances && latLngs.length > 1) {
                formatter = this._measurementOptions.formatDistance || L.bind(this.formatDistance, this);

                for (var i = 1, len = latLngs.length; (isPolygon && i <= len) || i < len; i++) {
                    ll1 = latLngs[i - 1];
                    ll2 = latLngs[i % len];
                    dist = ll1.distanceTo(ll2);
                    totalDist += dist;

                    pixelDist = this._map.latLngToLayerPoint(ll1).distanceTo(this._map.latLngToLayerPoint(ll2));

                    if (pixelDist >= options.minPixelDistance) {
                        L.marker.measurement(
                            [(ll1.lat + ll2.lat) / 2, (ll1.lng + ll2.lng) / 2],
                            '<span title="' + options.lang.segmentLength + '">' + formatter(dist) + '</span>',
                            L.extend({}, options, {rotation: this._getRotation(ll1, ll2)}))
                            .addTo(this._measurementLayer);
                    }
                }

                // Show total length for polylines
                if (!isPolygon && this._measurementOptions.showTotal) {
                    L.marker.measurement(ll2, '<strong title="' + options.lang.totalLength + '">' +
                        formatter(totalDist) + '</strong>', options)
                        .addTo(this._measurementLayer);
                }
            }

            if (isPolygon && options.showArea && latLngs.length > 2) {
                formatter = options.formatArea || L.bind(this.formatArea, this);
                var area = ringArea(latLngs);
                L.marker.measurement(this.getBounds().getCenter(),
                    '<span title="' + options.lang.totalArea + '">' + formatter(area) + '</span>', options)
                    .addTo(this._measurementLayer);
            }
        },

        _getRotation: function (ll1, ll2) {
            var p1 = this._map.project(ll1),
                p2 = this._map.project(ll2);

            return Math.atan((p2.y - p1.y) / (p2.x - p1.x));
        }
    });

    L.Polyline.addInitHook(function () {
        if (this.options.showMeasurements) {
            this.showMeasurements();
        }
    });

    L.Circle.include({
        showMeasurements: function (options) {
            if (!this._map || this._measurementLayer) return this;

            this._measurementOptions = L.extend({
                showOnHover: false,
                showArea: true
            }, options || {});

            this._measurementLayer = L.layerGroup().addTo(this._map);
            this.updateMeasurements();

            this._map.on('zoomend', this.updateMeasurements, this);

            return this;
        },

        hideMeasurements: function () {
            this._map.on('zoomend', this.updateMeasurements, this);

            if (!this._measurementLayer) return this;
            this._map.removeLayer(this._measurementLayer);
            this._measurementLayer = null;

            return this;
        },

        onAdd: override(L.Circle.prototype.onAdd, function () {
            if (this.options.showMeasurements) {
                this.showMeasurements(this.options.measurementOptions);
            }
        }),

        onRemove: override(L.Circle.prototype.onRemove, function () {
            this.hideMeasurements();
        }, true),

        setLatLng: override(L.Circle.prototype.setLatLng, function () {
            this.updateMeasurements();
        }),

        setRadius: override(L.Circle.prototype.setRadius, function () {
            this.updateMeasurements();
        }),

        formatArea: formatArea,

        updateMeasurements: function () {
            if (!this._measurementLayer) return;

            var latLng = this.getLatLng(),
                options = this._measurementOptions,
                formatter = options.formatDistance || L.bind(this.formatDistance, this);

            this._measurementLayer.clearLayers();

            if (options.showArea) {
                formatter = options.formatArea || L.bind(this.formatArea, this);
                var area = circleArea(this.getRadius());
                L.marker.measurement(latLng, formatter(area), options)
                    .addTo(this._measurementLayer);
            }
        }
    });

    L.Circle.addInitHook(function () {
        if (this.options.showMeasurements) {
            this.showMeasurements();
        }
    });
})();


