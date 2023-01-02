/*
 * @author     Martin Høgh <mh@mapcentia.com>
 * @copyright  2013-2020 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

const MAX_RESOLUTION = 156543.03390625;
const MAX_EXTENT = [-20037508.34, -20037508.34, 20037508.34, 20037508.34];
const SRS ="EPSG:3857";
import {GEOJSON_PRECISION} from './constants';

/**
 * @type {*|exports|module.exports}
 */
var cloud;

let _self = false;

/**
 *
 * @type {{set: module.exports.set, init: module.exports.init, serialize: module.exports.serialize}}
 */
module.exports = module.exports = {
    set: function (o) {
        cloud = o.cloud;
        _self = this;
        return this;
    },
    init: function (str) {

    },
    
    /**
     * Shortcut for serializing drawn items
     * 
     * @return {Array<Object>}
     */
    serializeMeasurementItems: (strictMode = false) => {
        let layerDraw = [];

        let e = _self.serialize({
            "printHelper": true,
            "query_draw": true,
            "query_buffer": true,
            "query_result": true,
            "print": true,
            "measurements": false,
            "draw": true
        }, strictMode);

        $.each(e, (i, v) => {
            if (v.type === "Vector") {
                layerDraw.push({geojson: v.geoJson})
            }
        });

        return layerDraw;
    },

    /**
     * Shortcut for serializing drawn items
     * 
     * @return {Array<Object>}
     */
    serializeDrawnItems: (strictMode = false) => {
        let layerDraw = [];

        let e = _self.serialize({
            "printHelper": true,
            "query_draw": true,
            "query_buffer": true,
            "query_result": true,
            "print": true,
            "measurements": true,
            "draw": false
        }, strictMode);

        $.each(e, (i, v) => {
            if (v.type === "Vector") {
                layerDraw.push({geojson: v.geoJson})
            }
        });

        return layerDraw;
    },
    serializeQueryDrawnItems: (strictMode = false) => {
        let layerDraw = [];

        let e = _self.serialize({
            "printHelper": true,
            "query_draw": false,
            "query_buffer": true,
            "query_result": true,
            "print": true,
            "measurements": true,
            "draw": true
        }, strictMode);

        $.each(e, (i, v) => {
            if (v.type === "Vector") {
                layerDraw.push({geojson: v.geoJson})
            }
        });

        return layerDraw;
    },
    serializeQueryBufferItems: (strictMode = false) => {
        let layerDraw = [];

        let e = _self.serialize({
            "printHelper": true,
            "query_draw": true,
            "query_buffer": false,
            "query_result": true,
            "print": true,
            "measurements": true,
            "draw": true
        }, strictMode);

        $.each(e, (i, v) => {
            if (v.type === "Vector") {
                layerDraw.push({geojson: v.geoJson})
            }
        });

        return layerDraw;
    },

    serialize: function (filters, strictMode = false) {
        var e = _encodeLayers(cloud.get().map);

        $.each(e, function (i, v) {
            if (typeof v.geoJson !== "undefined") {
                // Loop backwards
                for (var key = v.geoJson.features.length - 1; key > -1; key--) {
                    if (strictMode) {
                        if (filters[v.geoJson.features[key]._vidi_type] || !v.geoJson.features[key]._vidi_type) {
                            v.geoJson.features.splice(key, 1);
                        }
                    } else {
                        if (filters[v.geoJson.features[key]._vidi_type]) {
                            v.geoJson.features.splice(key, 1);
                        }
                    }
                }
            }
        });
        return e;
    }
};

/**
 *
 * @param map
 * @returns {Array}
 * @private
 */
var _encodeLayers = function (map) {
    var enc = [],
        vectors = [],
        layer,
        i;

    var layers = _getLayers(map);

    for (i = 0; i < layers.length; i++) {
        layer = layers[i];
        if (layer instanceof L.TileLayer.WMS) {
            enc.push(_encoders.layers.tilelayerwms.call(this, layer));
        } else if (L.mapbox && layer instanceof L.mapbox.TileLayer) {
            enc.push(_encoders.layers.tilelayermapbox.call(this, layer));
        } else if (layer instanceof L.TileLayer) {
            enc.push(_encoders.layers.tilelayer.call(this, layer));
        } else if (layer instanceof L.ImageOverlay) {
            enc.push(_encoders.layers.image.call(this, layer));
        } else if (layer instanceof L.Marker || (layer instanceof L.Path && layer.toGeoJSON)) {
            vectors.push(layer);
        }
    }

    if (vectors.length) {
        enc.push(_encoders.layers.vector.call(this, vectors));
    }
    return enc;
};

/**
 *
 * @type {{layers: {httprequest: _encoders.layers.httprequest, tilelayer: _encoders.layers.tilelayer, tilelayerwms: _encoders.layers.tilelayerwms, tilelayermapbox: _encoders.layers.tilelayermapbox, image: _encoders.layers.image, vector: _encoders.layers.vector}}}
 * @private
 */
var _encoders = {
    layers: {
        httprequest: function (layer) {
            var baseUrl = layer._url;

            if (baseUrl.indexOf('{s}') !== -1) {
                baseUrl = baseUrl.replace('{s}', layer.options.subdomains[0]);
            }
            baseUrl = _getAbsoluteUrl(baseUrl);

            return {
                baseURL: baseUrl,
                opacity: layer.options.opacity
            };
        },
        tilelayer: function (layer) {
            var enc = _encoders.layers.httprequest.call(this, layer),
                baseUrl = layer._url.substring(0, layer._url.indexOf('{z}')),
                resolutions = [],
                zoom, split, layerName;

            // If using multiple subdomains, replace the subdomain placeholder
            if (baseUrl.indexOf('{s}') !== -1) {
                baseUrl = baseUrl.replace('{s}', layer.options.subdomains[0]);
            }

            for (zoom = 0; zoom <= layer.options.maxZoom; ++zoom) {
                resolutions.push(MAX_RESOLUTION / Math.pow(2, zoom));
            }


            if (layer.options.tms) {
                split = baseUrl.split("/");
                layerName = split[split.length - 2];
                split.splice(-3);
                baseUrl = split.join("/") + "/";
                return L.extend(enc, {
                    type: 'TMS',
                    baseURL: baseUrl,
                    layer: layerName,
                    format: 'png',
                    tileSize: [layer.options.tileSize, layer.options.tileSize],
                    maxExtent: MAX_EXTENT,
                    resolutions: resolutions,
                    tileOrigin: {x: MAX_EXTENT[0], y: MAX_EXTENT[0]},
                    singleTile: false
                });
            } else {
                return L.extend(enc, {
                    // XYZ layer type would be a better fit but is not supported in mapfish plugin for GeoServer
                    // See https://github.com/mapfish/mapfish-print/pull/38
                    type: 'OSM',
                    baseURL: baseUrl,
                    extension: 'png',
                    tileSize: [layer.options.tileSize, layer.options.tileSize],
                    maxExtent: MAX_EXTENT,
                    resolutions: resolutions,
                    tileOrigin: {x: MAX_EXTENT[0], y: MAX_EXTENT[0]},
                    singleTile: false
                });
            }
        },
        tilelayerwms: function (layer) {
            var enc = _encoders.layers.httprequest.call(this, layer),
                layerOpts = layer.options,
                p;

            L.extend(enc, {
                type: 'WMS',
                layers: [layerOpts.layers].join(',').split(',').filter(function (x) {
                    return x !== "";
                }), //filter out empty strings from the array
                format: layerOpts.format,
                styles: [layerOpts.styles].join(',').split(',').filter(function (x) {
                    return x !== "";
                }),

                singleTile: false
            });

            for (p in layer.wmsParams) {
                if (layer.wmsParams.hasOwnProperty(p)) {
                    if ('detectretina,format,height,layers,request,service,srs,styles,version,width'.indexOf(p.toLowerCase()) === -1) {
                        if (!enc.customParams) {
                            enc.customParams = {};
                        }
                        enc.customParams[p] = layer.wmsParams[p];
                    }
                }
            }
            return enc;
        },
        tilelayermapbox: function (layer) {
            var resolutions = [], zoom;

            for (zoom = 0; zoom <= layer.options.maxZoom; ++zoom) {
                resolutions.push(MAX_RESOLUTION / Math.pow(2, zoom));
            }

            var customParams = {};
            if (typeof layer.options.access_token === 'string' && layer.options.access_token.length > 0) {
                customParams.access_token = layer.options.access_token;
            }

            return {
                // XYZ layer type would be a better fit but is not supported in mapfish plugin for GeoServer
                // See https://github.com/mapfish/mapfish-print/pull/38
                type: 'OSM',
                baseURL: layer.options.tiles[0].substring(0, layer.options.tiles[0].indexOf('{z}')),
                opacity: layer.options.opacity,
                extension: 'png',
                tileSize: [layer.options.tileSize, layer.options.tileSize],
                maxExtent: MAX_EXTENT,
                resolutions: resolutions,
                singleTile: false,
                customParams: customParams
            };
        },
        image: function (layer) {
            return {
                type: 'Image',
                opacity: layer.options.opacity,
                name: 'image',
                baseURL: _getAbsoluteUrl(layer._url),
                extent: _projectBounds(SRS, layer._bounds)
            };
        },
        vector: function (features) {
            var encFeatures = [],
                encStyles = {},
                opacity,
                feature,
                style,
                dictKey,
                dictItem = {},
                styleDict = {},
                styleName,
                nextId = 1,
                featureGeoJson,
                i, l;

            for (i = 0, l = features.length; i < l; i++) {
                feature = features[i];

                if (feature instanceof L.Marker && (!feature._vidi_marker)) {
                    continue;
                }

                if (feature instanceof L.Marker) {
                    var icon = feature.options.icon,
                        iconUrl = icon.options.iconUrl || L.Icon.Default.imagePath + '/marker-icon.png',
                        iconSize = L.Util.isArray(icon.options.iconSize) ? new L.Point(icon.options.iconSize[0], icon.options.iconSize[1]) : icon.options.iconSize,
                        iconAnchor = L.Util.isArray(icon.options.iconAnchor) ? new L.Point(icon.options.iconAnchor[0], icon.options.iconAnchor[1]) : icon.options.iconAnchor,
                        scaleFactor = 1;

                    style = {
                        externalGraphic: _getAbsoluteUrl(iconUrl),
                        graphicWidth: (iconSize.x / scaleFactor),
                        graphicHeight: (iconSize.y / scaleFactor),
                        graphicXOffset: (-iconAnchor.x / scaleFactor),
                        graphicYOffset: (-iconAnchor.y / scaleFactor)
                    };
                } else {
                    style = _extractFeatureStyle(feature);
                }

                dictKey = JSON.stringify(style);
                dictItem = styleDict[dictKey];
                if (dictItem) {
                    styleName = dictItem;
                } else {
                    styleDict[dictKey] = styleName = nextId++;
                    encStyles[styleName] = style;
                }

                if (feature instanceof L.Circle) {
                    featureGeoJson = {_latlng: feature._latlng, _mRadius: feature._mRadius, _radius: feature._radius};
                    featureGeoJson.type = "Circle";
                    featureGeoJson.feature = feature.feature;
                } else if (feature instanceof L.Rectangle) {
                    featureGeoJson = {_latlngs: feature._latlngs};
                    featureGeoJson.type = "Rectangle";
                    featureGeoJson.feature = feature.feature;
                } else if (feature?.feature?.properties?.type === "circlemarker") {
                    featureGeoJson = {_latlng: feature._latlng};
                    featureGeoJson.type = "CircleMarker";
                    featureGeoJson.feature = feature.feature;
                    featureGeoJson.options = feature.options;
                    featureGeoJson._tooltipHandlersAdded = feature._tooltipHandlersAdded;
                    featureGeoJson._vidi_marker = feature._vidi_marker;
                    featureGeoJson._vidi_marker_text = feature._vidi_marker_text;
                } else if (feature instanceof L.Marker) {
                    featureGeoJson = {_latlng: feature._latlng};
                    featureGeoJson.type = "Marker";
                    featureGeoJson.feature = feature.feature;
                } else {
                    featureGeoJson = feature.toGeoJSON(GEOJSON_PRECISION);
                    featureGeoJson.geometry.coordinates = _projectCoords(SRS, featureGeoJson.geometry.coordinates);
                    featureGeoJson.type = "Feature";
                }

                featureGeoJson.style = style;
                featureGeoJson._vidi_type = feature._vidi_type;
                if (feature._vidi_type === "draw" || feature._vidi_type === "measurements") {
                    featureGeoJson._vidi_extremities = feature._extremities || feature.feature._vidi_extremities;
                }
                featureGeoJson._vidi_measurementLayer = feature._measurementLayer ? true : false;
                featureGeoJson._vidi_measurementOptions = feature._measurementOptions;

                // All markers will use the same opacity as the first marker found
                if (opacity === null) {
                    opacity = feature.options.opacity || 1.0;
                }

                encFeatures.push(featureGeoJson);
            }

            return {
                type: 'Vector',
                styles: encStyles,
                opacity: opacity,
                styleProperty: '_leaflet_style',
                geoJson: {
                    type: 'FeatureCollection',
                    features: encFeatures
                }
            };
        }
    }
};

/**
 *
 * @param map
 * @returns {Array.<T>}
 * @private
 */
var _getLayers = function (map) {
    var markers = [],
        vectors = [],
        tiles = [],
        imageOverlays = [],
        imageNodes,
        pathNodes,
        id;

    for (id in map._layers) {
        if (map._layers.hasOwnProperty(id)) {

            if (!map._layers.hasOwnProperty(id)) {
                continue;
            }

            var lyr = map._layers[id];

            if (lyr instanceof L.TileLayer.WMS || lyr instanceof L.TileLayer) {
                tiles.push(lyr);
            } else if (lyr instanceof L.ImageOverlay) {
                imageOverlays.push(lyr);
            } else if (lyr instanceof L.Marker) {
                markers.push(lyr);
            } else if (lyr instanceof L.Path && lyr.toGeoJSON) {
                vectors.push(lyr);
            }
        }
    }
    markers.sort(function (a, b) {
        return a._icon.style.zIndex - b._icon.style.zIndex;
    });

    tiles.sort(function (a, b) {
        return a._container.style.zIndex - b._container.style.zIndex;
    });

    try {
        imageNodes = [].slice.call(this, map._panes.overlayPane.childNodes);
        imageOverlays.sort(function (a, b) {
            return imageNodes.indexOf(a._image) - imageNodes.indexOf(b._image);
        });
    } catch (e) {
        //console.error(e.message);
    }
    try {
        if (map._pathRoot) {
            pathNodes = [].slice.call(this, map._pathRoot.childNodes);
            vectors.sort(function (a, b) {
                return pathNodes.indexOf(a._container) - pathNodes.indexOf(b._container);
            });
        }
    } catch (e) {
        //console.error(e.message);
    }

    return tiles.concat(vectors).concat(imageOverlays).concat(markers);
};

/**
 *
 * @param url
 * @returns {*}
 * @private
 */
var _getAbsoluteUrl = function (url) {
    var a;

    if (L.Browser.ie) {
        a = document.createElement('a');
        a.style.display = 'none';
        document.body.appendChild(a);
        a.href = url;
        document.body.removeChild(a);
    } else {
        a = document.createElement('a');
        a.href = url;
    }
    return a.href;
};

/**
 *
 * @param circle
 * @returns {*}
 * @private
 */
var _circleGeoJSON = function (circle) {
    var projection = circle._map.options.crs.projection;
    var earthRadius = 1, i;

    if (projection === L.Projection.SphericalMercator) {
        earthRadius = 6378137;
    } else if (projection === L.Projection.Mercator) {
        earthRadius = projection.R_MAJOR;
    }
    var cnt = projection.project(circle.getLatLng());
    var scale = 1.0 / Math.cos(circle.getLatLng().lat * Math.PI / 180.0);
    var points = [];
    for (i = 0; i < 64; i++) {
        var radian = i * 2.0 * Math.PI / 64.0;
        var shift = L.point(Math.cos(radian), Math.sin(radian));
        points.push(projection.unproject(cnt.add(shift.multiplyBy(circle.getRadius() * scale / earthRadius))));
    }
    return L.polygon(points).toGeoJSON(GEOJSON_PRECISION);
};

/**
 *
 * @param feature
 * @returns {{color: *, stroke: (*|stroke|{color, width}|boolean), strokeColor: *, strokeWidth: *, weight: *, strokeOpacity: *, strokeLinecap: string, fill: *, fillColor: *, fillOpacity: *, dashArray: (*|string|string|string)}}
 * @private
 */
var _extractFeatureStyle = function (feature) {
    var options = feature.options;

    return {
        color: options.color,
        stroke: options.stroke,
        strokeColor: options.color,
        strokeWidth: options.weight,
        weight: options.weight,
        strokeOpacity: options.opacity,
        strokeLinecap: 'round',
        fill: options.fill,
        fillColor: options.fillColor || options.color,
        opacity: options.opacity,
        fillOpacity: options.fillOpacity,
        dashArray: options.dashArray,
        lineCap: options.lineCap
    };
};

/**
 *
 * @param crs
 * @param coords
 * @returns {*}
 * @private
 */
var _projectCoords = function (crs, coords) {
    var crsKey = crs.toUpperCase().replace(':', ''),
        crsClass = L.CRS[crsKey];

    if (!crsClass) {
        throw 'Unsupported coordinate reference system: ' + crs;
    }

    //return _project(crsClass, coords);
    return coords;
};

/**
 *
 * @param crsClass
 * @param coords
 * @returns {*}
 * @private
 */
var _project = function (crsClass, coords) {
    var projected,
        pt,
        i, l;

    if (typeof coords[0] === 'number') {
        coords = new L.LatLng(coords[1], coords[0]);
    }

    if (coords instanceof L.LatLng) {
        pt = crsClass.project(coords);
        return [pt.x, pt.y];
    } else {
        projected = [];
        for (i = 0, l = coords.length; i < l; i++) {
            projected.push(_project(crsClass, coords[i]));
        }
        return projected;
    }
};
