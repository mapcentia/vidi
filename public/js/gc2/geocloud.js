/*
 * @author     Martin Høgh <mh@mapcentia.com>
 * @copyright  2013-2018 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

/*global Ext:false */
/*global $:false */
/*global jQuery:false */
/*global OpenLayers:false */
/*global ol:false */
/*global L:false */
/*global google:false */
/*global GeoExt:false */
/*global mygeocloud_ol:false */
/*global schema:false */
/*global document:false */
/*global window:false */

var geocloud;
geocloud = (function () {
    "use strict";
    const base64url = require('base64url');
    var scriptSource = (function (scripts) {
            scripts = document.getElementsByTagName('script');
            var script = scripts[scripts.length - 1];
            if (script.getAttribute.length !== undefined) {
                return script.src;
            }
            return script.getAttribute('src', -1);
        }()),
        map,
        storeClass,
        extend,
        geoJsonStore,
        webGLStore,
        cartoDbStore,
        sqlStore,
        tweetStore,
        elasticStore,
        tileLayer,
        createUTFGridLayer,
        createTileLayer,
        createTMSLayer,
        createMVTLayer,
        clickEvent,
        transformPoint,
        MAPLIB,
        host,
        OSM = "osm",
        MAPQUESTOSM = "mapQuestOSM",
        MAPBOXNATURALEARTH = "mapBoxNaturalEarth",
        STAMENTONER = "stamenToner",
        STAMENTONERLITE = "stamenTonerLite",
        GOOGLESTREETS = "googleStreets",
        GOOGLEHYBRID = "googleHybrid",
        GOOGLESATELLITE = "googleSatellite",
        GOOGLETERRAIN = "googleTerrain",
        BINGROAD = "bingRoad",
        BINGAERIAL = "bingAerial",
        BINGAERIALWITHLABELS = "bingAerialWithLabels",
        DTKSKAERMKORT_25832 = "dtkSkaermkort@25832",
        DTKSKAERMKORT = "dtkSkaermkort",
        DTKSKAERMKORTDAEMPET = "dtkSkaermkortDaempet",
        DTKSKAERMKORTGRAA = "dtkSkaermkortGraa",
        DIGITALGLOBE = "DigitalGlobe:Imagery",
        GEODKBRIGHT = "geodkBright",
        LUFTFOTOSERIER2017 = "luftfotoserier2017",
        // Here maps
        HERENORMALDAY = "hereNormalDay",
        HERENORMALDAYGREY = "hereNormalDayGrey",
        HERENORMALNIGHTGREY = "hereNormalNightGrey",
        HERESATELLITEDAY = "hereSatelliteDay",
        HEREHYBRIDDAY = "hereHybridDay",

        attribution = (window.mapAttribution === undefined) ? "Powered by <a target='_blank' rel='noopener' href='//www.mapcentia.com'>MapCentia GC2</a> " : window.mapAttribution,
        resolutions = [156543.0339280410, 78271.51696402048, 39135.75848201023, 19567.87924100512, 9783.939620502561,
            4891.969810251280, 2445.984905125640, 1222.992452562820, 611.4962262814100, 305.7481131407048,
            152.8740565703525, 76.43702828517624, 38.21851414258813, 19.10925707129406, 9.554628535647032,
            4.777314267823516, 2.388657133911758, 1.194328566955879, 0.5971642834779395, 0.298582141739,
            0.149291070869, 0.074645535435, 0.0373227677175, 0.018661384, 0.009330692, 0.004665346, 0.002332673, 0.001166337],
        googleMapAdded = {}, yandexMapAdded = {};
    // Try to set host from script if not set already
    if (typeof window.geocloud_host === "undefined") {
        window.geocloud_host = host = (scriptSource.charAt(0) === "/") ? "" : scriptSource.split("/")[0] + "//" + scriptSource.split("/")[2];
    }
    host = window.geocloud_host;
    if (typeof ol !== "object" && typeof L !== "object" && typeof OpenLayers !== "object") {
        alert("You need to load neither OpenLayers.js, ol3,js or Leaflet.js");
    }
    if (typeof OpenLayers === "object") {
        MAPLIB = "ol2";
    }
    if (typeof ol === "object") {
        MAPLIB = "ol3";
    }
    if (typeof L === "object") {
        MAPLIB = "leaflet";
    }
    var setHost = function (str) {
        host = str;
    };
    // Helper for extending classes
    extend = function (ChildClass, ParentClass) {
        ChildClass.prototype = new ParentClass();
    };
    var STOREDEFAULTS = {
        styleMap: null,
        visibility: true,
        lifetime: 0,
        host: host,
        uri: "/api/v2/sql",
        db: null,
        sql: null,
        q: null,
        name: "Vector",
        id: null,
        maxFeaturesLimit: false,
        onMaxFeaturesLimitReached: false,
        rendererOptions: {zIndexing: true},
        projection: (MAPLIB === "leaflet") ? "4326" : "3857",
        //Only leaflet
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng);
        },
        //Only leaflet
        onEachFeature: function (feature, layer) {
        },
        onLoad: function () {
        },
        transformResponse: function (response) {
            return response;
        },
        loading: function () {
        },
        index: "",
        type: "",
        size: 100,
        clientEncoding: "UTF8",
        async: true,
        jsonp: true,
        method: "GET",
        clickable: true,
        error: function () {
        },
        key: null,
        base64: true,
        custom_data: null,
        clustering: false
    };

    // Base class for stores
    storeClass = function () {
        var parentThis = this;
        //this.defaults = STOREDEFAULTS;
        this.hide = function () {
            this.layer.setVisibility(false);
        };
        this.show = function () {
            this.layer.setVisibility(true);
        };
        this.resetStyle = function () {
            this.layer.resetStyle(this.layer);
        }
        this.map = null;

        // Initiate base class settings
        this.init = function () {
            this.geoJsonLayer = L.geoJson(null, {
                style: this.defaults.styleMap,
                pointToLayer: this.defaults.pointToLayer,
                onEachFeature: this.defaults.onEachFeature,
                interactive: this.defaults.clickable,
                bubblingMouseEvents: false
            });
            this.onLoad = this.defaults.onLoad;
            this.loading = this.defaults.loading;
            if (!this.defaults.clustering) {
                this.layer = this.geoJsonLayer;
            } else {
                this.layer = L.markerClusterGroup({
                    maxClusterRadius: 100,
                    polygonOptions: {
                        weight: 0,
                        fillColor: "#333333",
                        fillOpacity: 0.5,
                    }
                });
            }

            this.layer.id = this.defaults.name;
            this.key = this.defaults.key;
        };
        this.geoJSON = null;
        this.featureStore = null;
        this.reset = function () {
            switch (MAPLIB) {
                case "ol2":
                    this.layer.destroyFeatures();
                    break;
                case "leaflet":
                    this.layer.clearLayers();
                    break;
            }
            parentThis.geoJSON = null;
        };
        this.isEmpty = function () {
            switch (MAPLIB) {
                case "ol2":
                    return (this.layer.features.length === 0) ? true : false;
                    break;
                case "leaflet":
                    return (Object.keys(this.layer._layers).length === 0) ? true : false;
                    break;
            }
        };
        this.getWKT = function () {
            return new OpenLayers.Format.WKT().write(this.layer.features);
        };
    };

    geoJsonStore = sqlStore = function (config) {
        var prop, me = this, map, sql, xhr = {
            abort: function () {/* stub */
            }
        };

        this.defaults = $.extend({}, STOREDEFAULTS);
        if (config) {
            for (prop in config) {
                this.defaults[prop] = config[prop];
            }
        }

        this.init();
        this.name = this.defaults.name;
        this.id = this.defaults.id;
        this.sql = this.defaults.sql;
        this.db = this.defaults.db;
        this.host = this.defaults.host.replace("cdn.", "");
        this.onLoad = this.defaults.onLoad;
        this.transformResponse = this.defaults.transformResponse;
        this.loading = this.defaults.loading;
        this.dataType = this.defaults.dataType;
        this.async = this.defaults.async;
        this.jsonp = this.defaults.jsonp;
        this.method = this.defaults.method;
        this.uri = this.defaults.uri;
        this.base64 = this.defaults.base64;
        this.clustering = this.defaults.clustering;
        this.custom_data = this.defaults.custom_data;
        this.maxFeaturesLimit = this.defaults.maxFeaturesLimit;
        this.onMaxFeaturesLimitReached = this.defaults.onMaxFeaturesLimitReached;
        this.featuresLimitReached = false;

        this.buffered_bbox = false;
        this.currentGeoJsonHash = null;
        this.dataHasChanged = false;

        this.load = function (doNotShowAlertOnError) {
            try {
                me.abort();
            } catch (e) {
                console.error(e.message);
            }

            sql = this.sql;

            var dynamicQueryIsUsed = false;
            map = me.layer._map;
            if (map) {
                if (sql.indexOf("{minX}") !== -1 && sql.indexOf("{maxX}") !== -1
                    && sql.indexOf("{minY}") !== -1 && sql.indexOf("{maxY}") !== -1) {
                    dynamicQueryIsUsed = true;
                }

                // Extending the area of the bounding box, (bbox_extended_area = (9 * bbox_initial_area))
                var extendedBounds = map.getBounds().pad(0.3);
                this.buffered_bbox = extendedBounds;

                sql = sql.replace("{centerX}", map.getCenter().lat.toString());
                sql = sql.replace("{centerY}", map.getCenter().lng.toString());
                sql = sql.replace("{maxY}", extendedBounds.getNorth());
                sql = sql.replace("{maxX}", extendedBounds.getEast());
                sql = sql.replace("{minY}", extendedBounds.getSouth());
                sql = sql.replace("{minX}", extendedBounds.getWest());

                if (sql.indexOf("{bbox}") !== -1) {
                    console.warn("The bounding box ({bbox}) was not replaced in SQL query");
                }
            } else {
                console.error("Unable to get map object");
            }

            me.loading();
            xhr = $.ajax({
                dataType: (this.defaults.jsonp) ? 'jsonp' : 'json',
                async: this.defaults.async,
                data: ('q=' + (this.base64 ? base64url(sql) + "&base64=true" : encodeURIComponent(sql)) +
                    '&srs=' + this.defaults.projection + '&lifetime=' + this.defaults.lifetime + '&client_encoding=' + this.defaults.clientEncoding +
                    '&key=' + this.defaults.key + '&custom_data=' + this.custom_data),
                jsonp: (this.defaults.jsonp) ? 'jsonp_callback' : false,
                url: this.host + this.uri + '/' + this.db,
                type: this.defaults.method,
                timeout: 10000,
                success: function (response) {

                    if (response.success === false && doNotShowAlertOnError === undefined) {
                        alert(response.message);
                    }

                    if (response.success === true) {
                        if (response.features !== null) {
                            response = me.transformResponse(response, me.id);

                            let clone = JSON.parse(JSON.stringify(response));
                            delete clone.peak_memory_usage;
                            delete clone._execution_time;
                            let newHash = md5(JSON.stringify(clone));
                            if (me.currentGeoJsonHash && me.currentGeoJsonHash === newHash) {
                                console.log("Hashes match. Not reloading");
                                me.dataHasChanged = false;
                                return
                            }
                            me.geoJSON = clone;
                            me.currentGeoJsonHash = newHash
                            me.dataHasChanged = true;

                            //if (dynamicQueryIsUsed) {
                            me.layer.clearLayers();
                            //}

                            if (me.maxFeaturesLimit !== false && me.onMaxFeaturesLimitReached !== false && parseInt(me.maxFeaturesLimit) > 0) {
                                if (me.geoJSON.features.length >= parseInt(me.maxFeaturesLimit)) {
                                    console.warn('SQL store: number of received features exceeds the specified limit (' + me.maxFeaturesLimit + '). Please use filters or adjust the limit.');
                                    me.geoJSON.features = [];
                                    response.features = [];
                                    me.featuresLimitReached = true;
                                    me.onMaxFeaturesLimitReached();
                                } else {
                                    me.featuresLimitReached = false;
                                }
                            } else {
                                me.featuresLimitReached = false;
                            }

                            if (!me.clustering) {
                                // In this case me.layer is L.geoJson
                                me.layer.addData(clone);
                            } else {
                                // In this case me.layer is L.markerClusterGroup
                                me.geoJsonLayer.addData(clone);
                                me.layer.addLayer(me.geoJsonLayer);
                            }
                            me.layer.defaultOptions = me.layer.options; // So layer can be reset
                            response = null;
                        } else {
                            me.geoJSON = null;
                        }
                    }
                },
                error: this.defaults.error.bind(this, me),
                complete: function (e) {
                    if (me.dataHasChanged) {
                        me.onLoad(me);
                    }
                }
            });

            return xhr;
        };

        this.abort = function () {
            xhr.abort();
        }
        this.destroy = function () {
            this.reset();
            xhr = {
                abort: function () {/* stub */
                }
            };
        };
    };

    /**
     * WebGL representation for SQL stored layer
     */
    webGLStore = function (config) {
        var prop, me = this, map, sql, xhr = {
            abort: function () {/* stub */
            }
        };

        this.init = function () {
            this.onLoad = this.defaults.onLoad;
            this.loading = this.defaults.loading;
        };

        this.defaults = $.extend({}, STOREDEFAULTS);
        if (config) {
            for (prop in config) {
                this.defaults[prop] = config[prop];
            }
        }

        this.init();
        this.name = this.defaults.name;
        this.id = this.defaults.id;
        this.sql = this.defaults.sql;
        this.db = this.defaults.db;
        this.onLoad = this.defaults.onLoad;
        this.transformResponse = this.defaults.transformResponse;
        this.loading = this.defaults.loading;
        this.dataType = this.defaults.dataType;
        this.async = this.defaults.async;
        this.jsonp = this.defaults.jsonp;
        this.method = this.defaults.method;
        this.uri = this.defaults.uri;
        this.host = this.defaults.host;
        this.base64 = this.defaults.base64;
        this.custom_data = this.defaults.custom_data;
        this.maxFeaturesLimit = this.defaults.maxFeaturesLimit;
        this.onMaxFeaturesLimitReached = this.defaults.onMaxFeaturesLimitReached;

        this.buffered_bbox = false;

        this.load = function (showAlertOnError = true, onLoadCallback) {
            try {
                me.abort();
            } catch (e) {
                console.error(e.message);
            }

            sql = this.sql;

            map = me.defaults.map;
            if (map) {
                // Extending the area of the bounding box, (bbox_extended_area = (9 * bbox_initial_area))
                var extendedBounds = map.getBounds().pad(1);
                this.buffered_bbox = extendedBounds;

                sql = sql.replace("{centerX}", map.getCenter().lat.toString());
                sql = sql.replace("{centerY}", map.getCenter().lng.toString());
                sql = sql.replace("{maxY}", extendedBounds.getNorth());
                sql = sql.replace("{maxX}", extendedBounds.getEast());
                sql = sql.replace("{minY}", extendedBounds.getSouth());
                sql = sql.replace("{minX}", extendedBounds.getWest());

                if (sql.indexOf("{bbox}") !== -1) {
                    console.warn("The bounding box ({bbox}) was not replaced in SQL query");
                }
            } else {
                console.error("Unable to get map object");
            }

            me.loading();
            xhr = $.ajax({
                dataType: (this.defaults.jsonp) ? 'jsonp' : 'json',
                async: this.defaults.async,
                data: ('q=' + (this.base64 ? base64url(sql) + "&base64=true" : encodeURIComponent(sql)) +
                    '&srs=' + this.defaults.projection + '&lifetime=' + this.defaults.lifetime + '&client_encoding=' + this.defaults.clientEncoding +
                    '&key=' + this.defaults.key + '&custom_data=' + this.custom_data),
                jsonp: (this.defaults.jsonp) ? 'jsonp_callback' : false,
                url: this.host + this.uri + '/' + this.db,
                type: this.defaults.method,
                success: function (response) {
                    if (response.success === false && showAlertOnError) {
                        alert(response.message);
                    }

                    if (response.success === true) {
                        if (response.features !== null) {
                            response = me.transformResponse(response, me.id);
                            me.geoJSON = response;
                            if (me.maxFeaturesLimit !== false && me.onMaxFeaturesLimitReached !== false && parseInt(me.maxFeaturesLimit) > 0) {
                                if (me.geoJSON.features.length >= parseInt(me.maxFeaturesLimit)) {
                                    console.warn('WebGL store: number of received features exceeds the specified limit (' + me.maxFeaturesLimit + '). Please use filters or adjust the limit.');
                                    me.geoJSON.features = [];
                                    response.features = [];
                                    me.onMaxFeaturesLimitReached();
                                }
                            }

                            let layer = false;
                            if (me.defaults.type === 'POINT') {
                                let data = [];
                                me.geoJSON.features.map(feature => data.push(feature.geometry.coordinates));

                                layer = L.glify.points({
                                    latitudeKey: 1,
                                    longitudeKey: 0,
                                    map: me.defaults.map,
                                    size: 8,
                                    data
                                });
                            } else if (me.defaults.type === 'LINESTRING') {
                                layer = L.glify.lines({
                                    latitudeKey: 1,
                                    longitudeKey: 0,
                                    map: me.defaults.map,
                                    data: me.geoJSON,
                                });
                            } else if (me.defaults.type === 'POLYGON') {
                                layer = L.glify.shapes({
                                    map: me.defaults.map,
                                    data: me.geoJSON,
                                });
                            } else {
                                throw new Error('Layer features type (' + this.defaults.type + ') is not supported by WebGL');
                            }

                            me.layer = layer.glLayer;
                            me.layer.id = me.defaults.name;

                            if (me.onLoad) me.onLoad();
                        } else {
                            me.geoJSON = null;
                        }
                    }

                    if (onLoadCallback) onLoadCallback();
                },
                error: this.defaults.error,
                complete: function () {
                    me.onLoad(me);
                }
            });

            return xhr;
        };

        this.abort = function () {
            xhr.abort();
        }
    };

    cartoDbStore = function (config) {
        var prop, me = this, map, sql, xhr;
        this.defaults = $.extend({}, STOREDEFAULTS);
        if (config) {
            for (prop in config) {
                this.defaults[prop] = config[prop];
            }
        }
        this.init();
        this.name = this.defaults.name;
        this.id = this.defaults.id;
        this.sql = this.defaults.sql;
        this.db = this.defaults.db;
        this.onLoad = this.defaults.onLoad;
        this.dataType = this.defaults.dataType;
        this.async = this.defaults.async;
        this.jsonp = this.defaults.jsonp;
        this.method = this.defaults.method;
        this.load = function (doNotShowAlertOnError) {
            try {
                map = me.map;
                sql = this.sql;
                sql = sql.replace("{centerX}", map.getCenter().lat.toString());
                sql = sql.replace("{centerY}", map.getCenter().lon.toString());
                sql = sql.replace("{minX}", map.getExtent().left);
                sql = sql.replace("{maxX}", map.getExtent().right);
                sql = sql.replace("{minY}", map.getExtent().bottom);
                sql = sql.replace("{maxY}", map.getExtent().top);
                sql = sql.replace("{bbox}", map.getExtent().toString());
            } catch (e) {
            }
            xhr = $.ajax({
                dataType: (this.defaults.jsonp) ? 'jsonp' : 'json',
                async: this.defaults.async,
                data: 'format=geojson&q=' + encodeURIComponent(sql) + '&srs=' + this.defaults.projection + '&lifetime=' + this.defaults.lifetime + "&srs=" + this.defaults.projection + '&client_encoding=' + this.defaults.clientEncoding,
                jsonp: (this.defaults.jsonp) ? 'callback' : false,
                url: '//' + this.db + '.cartodb.com' + '/api/v2/sql',
                type: this.defaults.method,
                success: function (response) {
                    if (response.features !== null) {
                        me.geoJSON = response;
                        switch (MAPLIB) {
                            case "ol2":
                                me.layer.addFeatures(new OpenLayers.Format.GeoJSON().read(response));
                                break;
                            case "ol3":
                                me.layer.getSource().addFeatures(new ol.source.GeoJSON(
                                    {
                                        object: response.features[0]
                                    }
                                ));

                                break;
                            case "leaflet":
                                me.layer.addData(response);
                                break;
                        }
                    } else {
                        me.geoJSON = null;
                    }
                },
                error: this.defaults.error,
                complete: function () {
                    me.onLoad();
                }

            });
            return this.layer;
        };
        this.abort = function () {
            xhr.abort();
        }
    };

    tweetStore = function (config) {
        var prop, me = this;
        this.defaults = $.extend({}, STOREDEFAULTS);
        if (config) {
            for (prop in config) {
                this.defaults[prop] = config[prop];
            }
        }
        this.init();
        this.load = function (doNotShowAlertOnError) {
            var q = this.defaults.q;
            try {
                var map = me.map;
                //q = q.replace("{centerX}", map.getCenter().lat.toString());
                // = q.replace("{centerY}", map.getCenter().lon.toString());
                q = q.replace(/\{minX\}/g, map.getExtent().left);
                q = q.replace(/\{maxX\}/g, map.getExtent().right);
                q = q.replace(/\{minY\}/g, map.getExtent().bottom);
                q = q.replace(/\{maxY\}/g, map.getExtent().top);
                q = q.replace(/\{bbox\}/g, map.getExtent().toString());
            } catch (e) {
            }
            $.ajax({
                dataType: 'jsonp',
                data: 'search=' + encodeURIComponent(q),
                jsonp: 'jsonp_callback',
                url: this.defaults.host + '/api/v1/twitter/' + this.db,
                success: function (response) {
                    if (response.success === false && doNotShowAlertOnError === undefined) {
                        alert(response.message);
                    }
                    if (response.success === true) {
                        if (response.features !== null) {
                            me.geoJSON = response;
                            switch (MAPLIB) {
                                case "ol2":
                                    me.layer.addFeatures(new OpenLayers.Format.GeoJSON().read(response));
                                    break;
                                case "leaflet":
                                    me.layer.addData(response);
                                    break;
                            }
                        }
                    }
                },
                complete: function () {
                    me.onLoad();
                }
            });
            return this.layer;
        };
    };
    elasticStore = function (config) {
        var prop, me = this;
        this.defaults = $.extend({}, STOREDEFAULTS);
        if (config) {
            for (prop in config) {
                this.defaults[prop] = config[prop];
            }
        }
        this.init();
        this.q = this.defaults.q;
        this.db = this.defaults.db;
        this.host = this.defaults.host.replace("cdn.", "");
        this.onLoad = this.defaults.onLoad;
        this.total = 0;
        this.size = this.defaults.size;
        this.dataType = this.defaults.dataType;
        this.async = this.defaults.async;
        this.jsonp = this.defaults.jsonp;
        this.method = this.defaults.method;
        this.load = function (doNotShowAlertOnError) {
            var map = me.map, q = this.q;
            try {
                //q = q.replace("{centerX}", map.getCenter().lat.toString());
                //q = q.replace("{centerY}", map.getCenter().lon.toString());
                q = q.replace("{minX}", map.getExtent().left);
                q = q.replace("{maxX}", map.getExtent().right);
                q = q.replace("{minY}", map.getExtent().bottom);
                q = q.replace("{maxY}", map.getExtent().top);
                q = q.replace("{bbox}", map.getExtent().toString());
            } catch (e) {
            }

            $.ajax({
                method: this.method,
                dataType: (this.jsonp) ? 'jsonp' : 'json',
                async: this.async,
                jsonp: (this.jsonp) ? 'jsonp_callback' : false,
                data: 'q=' + encodeURIComponent(q) + "&size=" + this.size,
                url: this.defaults.host + '/api/v2/elasticsearch/search/' + this.defaults.db + "/" + this.defaults.index + "/" + this.defaults.type,
                success: function (response) {
                    if (typeof response.error !== "undefined") {
                        return false;
                    }
                    var features = [], geoJson = {type: "FeatureCollection"};
                    me.total = response.hits.total;
                    $.each(response.hits.hits, function (i, v) {
                        features.push(v._source);
                    });
                    geoJson.features = features;
                    if (response.features !== null) {
                        me.geoJSON = geoJson;
                        switch (MAPLIB) {
                            case "ol2":
                                me.layer.addFeatures(new OpenLayers.Format.GeoJSON({
                                        internalProjection: new OpenLayers.Projection("EPSG:3857"),
                                        externalProjection: new OpenLayers.Projection("EPSG:4326")
                                    }
                                ).read(geoJson));
                                break;
                            case "leaflet":
                                me.layer.addData(geoJson);
                                break;
                        }
                    }

                },
                complete: function (response) {
                    me.onLoad(response);
                }
            });
            return this.layer;
        };
    };
    // Extend store classes
    extend(sqlStore, storeClass);
    extend(webGLStore, storeClass);
    extend(tweetStore, storeClass);
    extend(elasticStore, storeClass);
    extend(cartoDbStore, storeClass);

    //ol2, ol3 and leaflet
    tileLayer = function (config) {
        var prop;
        var defaults = {
            host: host,
            layer: null,
            db: null,
            singleTile: false,
            opacity: 1,
            wrapDateLine: true,
            tileCached: true,
            name: null,
            isBaseLayer: false,
            resolutions: resolutions,
            uri: null

        };
        if (config) {
            for (prop in config) {
                defaults[prop] = config[prop];
            }
        }
        return createTileLayer(defaults.layer, defaults);
    };

    //ol2, ol3 and leaflet
    createTileLayer = function (layer, defaults) {
        var parts, l, url, urlArray, uri;
        parts = layer.split(".");

        if (!defaults.uri) {
            if (!defaults.tileCached) {
                uri = "/wms/" + defaults.db + "/" + parts[0] + "?" + (defaults.additionalURLParameters.length > 0 ? defaults.additionalURLParameters.join('&') : '');
            } else {
                uri = "/mapcache/" + defaults.db + "/wms?" + (defaults.additionalURLParameters.length > 0 ? defaults.additionalURLParameters.join('&') : '');
            }
        } else {
            uri = defaults.uri;
        }
        url = defaults.host + uri;
        urlArray = [url];

        if ('mapRequestProxy' in defaults && defaults.mapRequestProxy !== false) {
            url = defaults.mapRequestProxy + uri;
        }

        switch (MAPLIB) {
            case "ol2":
                l = new OpenLayers.Layer.WMS(defaults.name, urlArray, {
                    layers: layer,
                    transparent: true
                }, defaults);
                l.id = layer;
                break;
            case "ol3":
                l = new ol.layer.Tile({
                    source: new ol.source.TileWMS({
                        url: url,
                        params: {LAYERS: layer}
                    }),
                    visible: defaults.visibility
                });
                l.id = layer;
                break;
            case "leaflet":
                var options = {
                    layers: layer,
                    format: 'image/png',
                    transparent: true,
                    minZoom: defaults.minZoom,
                    maxZoom: defaults.maxZoom,
                    tileSize: defaults.tileSize
                };

                if (defaults.singleTile) {
                    // Insert in tile pane, so non-tiled and tiled layers can be sorted
                    options.pane = "tilePane";
                    l = new L.nonTiledLayer.wms(url, options);
                } else {
                    l = new L.TileLayer.WMS(url, options);
                }

                l.id = layer;

                if (defaults.loadEvent) {
                    l.on("load", defaults.loadEvent);
                }
                if (defaults.loadingEvent) {
                    l.on("loading", defaults.loadingEvent);
                }

                break;
        }
        return l;
    };
    /**
     *
     * @param layer
     * @param defaults
     * @returns {*}
     */
    createUTFGridLayer = function (layer, defaults) {
        var uri;
        if (defaults.cache) {
            uri = "/api/mapcache/" + defaults.db + "/gmaps/" + layer + ".json@g20/{z}/{x}/{y}.json";
        } else {
            uri = "/api/wms/" + defaults.db + "/" + layer.split(".")[0] + "?mode=tile&tilemode=gmap&tile={x}+{y}+{z}&layers=" + layer + "&format=json&map.imagetype=application/json&";
        }
        var utfGrid = new L.utfGrid(uri, {
            resolution: 4,
            pointerCursor: true,
            mouseInterval: 66,  // Delay for mousemove events,
            maxZoom: 22,
            maxNativeZoom: 20,
            loading: defaults.loading
        });
        utfGrid.id = "__hidden.utfgrid." + layer; // Hide it
        return utfGrid;
    };

    /**
     * ol2 and leaflet
     * @param layer
     * @param defaults
     * @param subDomains
     * @returns {*}
     */
    createTMSLayer = function (layer, defaults) {
        var l, url, urlArray, url1, url2, url3, config, usingSubDomains = false;
        url = defaults.host + "/mapcache/" + defaults.db + "/tms/";
        url1 = url;
        url2 = url;
        url3 = url;
        //If host has cdn. as subdomain, when create use cdn1, cdn2, cdn3
        if (typeof defaults.subdomains === "undefined" || defaults.subdomains === null) {
            // For ol2
            urlArray = [url1.replace("cdn.", "cdn1."), url2.replace("cdn.", "cdn2."), url3.replace("cdn.", "cdn3.")];
            // For leaflet
            url = url.replace("cdn.", "{s}.");
        } else {
            usingSubDomains = true;
            // Only Leaflet
            url = url.replace("//", "//{s}.");
        }
        switch (MAPLIB) {
            case "ol2":
                l = new OpenLayers.Layer.TMS(defaults.name, urlArray, {
                    layername: layer,
                    type: 'png',
                    resolutions: defaults.resolutions,
                    isBaseLayer: defaults.isBaseLayer
                });
                l.id = layer;
                break;
            case "ol3":

                break;
            case "leaflet":
                config = {
                    tms: true,
                    attribution: defaults.attribution,
                    minZoom: defaults.minZoom,
                    maxZoom: defaults.maxZoom,
                    maxNativeZoom: defaults.maxNativeZoom,
                    tileSize: 256,
                    ran: function () {
                        return Math.random();
                    }
                };
                if (usingSubDomains) {
                    config.subdomains = defaults.subdomains;
                }
                //l = new L.TileLayer(url + "1.0.0/" + layer + "" + "/{z}/{x}/{y}.png" + (defaults.isBaseLayer ? "" : "?{ran}"), config);
                l = new L.TileLayer(url + "1.0.0/" + layer + "" + "/{z}/{x}/{y}.png", config);
                l.id = layer;
                if (defaults.loadEvent) {
                    l.on("load", defaults.loadEvent);
                }
                if (defaults.loadingEvent) {
                    l.on("loading", defaults.loadingEvent);
                }
                break;
        }
        return l;
    };

    /**
     * Creates MVT layer
     *
     * @param {String} layer    Layer identifier
     * @param {Object} defaults Default settings
     *
     * @return {Object}
     */
    createMVTLayer = function (layer, defaults) {
        var l, url, uri;

        let parts = layer.split(".");
        var options = {
            attribution: defaults.attribution,
            maxZoom: defaults.maxZoom,
            maxNativeZoom: defaults.maxNativeZoom,
            tileSize: 256,
            // vectorTileLayerStyles:{
            //
            //     "feature.multipolygon": {
            //         weight: 0,
            //         fillColor: '#9bc2c4',
            //         fillOpacity: 1,
            //         fill: true
            //     },
            // },
            ran: function () {
                return Math.random();
            }
        };

        if (defaults.tileCached) {
            url = defaults.host + "/mapcache/" + defaults.db + "/gmaps/" + layer + ".mvt/{z}/{x}/{y}.mvt";
        } else {
            if (!defaults.uri) {
                uri = "/wms/" + defaults.db + "/" + parts[0] + "?mode=tile&tilemode=gmap&tile={x}+{y}+{z}&layers=" + layer
                    + "&format=mvt&map.imagetype=mvt&" + (defaults.additionalURLParameters.length > 0 ? defaults.additionalURLParameters.join('&') : '');
            } else {
                uri = defaults.uri;
            }

            url = defaults.host + uri;
            if ('mapRequestProxy' in defaults && defaults.mapRequestProxy !== false) {
                // The LayerVectorGrid needs to have {x|y|z} templates in the URL, which will disappear after encodeURIComponent(), so need to store them temporary
                url = defaults.mapRequestProxy + uri;
                url = url.replace('{x}', 'REPLACE_THE_X').replace('{y}', 'REPLACE_THE_Y').replace('{z}', 'REPLACE_THE_Z');
                url = url.replace('REPLACE_THE_X', '{x}').replace('REPLACE_THE_Y', '{y}').replace('REPLACE_THE_Z', '{z}');
            }
        }

        l = new L.vectorGrid.protobuf(url, options);

        if (defaults.layerId) {
            l.id = defaults.layerId;
        } else {
            l.id = layer;
        }

        if (defaults.loadEvent) {
            l.on("load", defaults.loadEvent);
        }

        if (defaults.loadingEvent) {
            l.on("loading", defaults.loadingEvent);
        }

        return l;
    };


    // Set map constructor
    map = function (config) {
        var prop, lControl, queryLayers = [],
            defaults = {
                numZoomLevels: 20,
                projection: "EPSG:3857",
                fadeAnimation: true,
                zoomAnimation: true,
                showLayerSwitcher: false,
                // maxExtent: '-20037508.34, -20037508.34, 20037508.34, 20037508.34',
                resolutions: resolutions,
                editable: true
            };
        if (config) {
            for (prop in config) {
                defaults[prop] = config[prop];
            }
        }

        this.bingApiKey = null;
        this.digitalGlobeKey = null;
        //ol2, ol3
        // extent array
        this.zoomToExtent = function (extent, closest) {
            var p1, p2;
            switch (MAPLIB) {
                case "ol2":
                    if (!extent) {
                        this.map.zoomToExtent(this.map.maxExtent);
                    } else {
                        this.map.zoomToExtent(new OpenLayers.Bounds(extent), closest);
                    }
                    break;
                case "ol3":
                    if (!extent) {
                        this.map.getView().setCenter([0, 0]);
                        this.map.getView().setResolution(39136);
                    } else {
                        this.map.zoomToExtent(new OpenLayers.Bounds(extent), closest);
                    }
                    break;
                case "leaflet":
                    if (!extent) {
                        this.map.fitWorld();
                    } else {
                        p1 = transformPoint(extent[0], extent[1], "EPSG:3857", "EPSG:4326");
                        p2 = transformPoint(extent[2], extent[3], "EPSG:3857", "EPSG:4326");
                        this.map.fitBounds([
                            [p1.y, p1.x],
                            [p2.y, p2.x]
                        ]);
                    }
                    break;
            }
        };

        this.setMaxBounds = function (extent) {
            var p1, p2;
            switch (MAPLIB) {
                case "leaflet":
                    p1 = transformPoint(extent[0], extent[1], "EPSG:3857", "EPSG:4326");
                    p2 = transformPoint(extent[2], extent[3], "EPSG:3857", "EPSG:4326");
                    this.map.setMaxBounds([
                        [p1.y, p1.x],
                        [p2.y, p2.x]
                    ]);
                    break;
            }
        };

        this.zoomToExtentOfgeoJsonStore = function (store, maxZoom) {
            var parentThis = this;
            switch (MAPLIB) {
                case "ol2":
                    this.map.zoomToExtent(store.layer.getDataExtent());
                    break;
                case "leaflet":
                    this.map.fitBounds(store.layer.getBounds(), {maxZoom: maxZoom});
                    // Pan map one pixel to defeat a strange bug, which causes a freeze
                    setTimeout(function () {
                        parentThis.map.panBy([1, 0]);
                    }, 100);
                    break;
            }
        };
        this.getBaseLayers = function (removeMapReference) {
            var layerArr = [];
            switch (MAPLIB) {
                case "ol2":
                    for (var i = 0; i < this.map.layers.length; i++) {
                        if (this.map.layers[i].isBaseLayer === true) {
                            //console.log(this.map.layers[i]);
                            if (removeMapReference) {
                                this.map.layers[i].map = null;
                            }
                            layerArr.push(this.map.layers[i]);
                        }
                    }
                    break;
                case "leaflet":
                    var layers = this.map._layers;
                    for (var key in layers) {
                        if (layers.hasOwnProperty(key)) {
                            if (layers[key].baseLayer === true) {
                                layerArr.push(layers);
                            }
                        }
                    }
                    break;
            }
            return layerArr;
        };
        this.getActiveBaseLayer = function () {
            var layers = lControl._layers;
            for (var layerId in layers) {
                if (layers.hasOwnProperty(layerId)) {
                    var layer = layers[layerId];
                    if (!layer.overlay && lControl._map.hasLayer(layer.layer)) {
                        return layer
                    }
                }
            }
            throw new Error('Control doesn\'t have any active base layer!')
        };

        /**
         * Returns both tile and vector visible layers
         */
        this.getAllTypesOfVisibleLayers = function (getBaseLayers) {
            getBaseLayers = (getBaseLayers === true) ? true : false;
            var layerArr = [], i;
            switch (MAPLIB) {
                case "ol2":
                    console.error("Not implemented yet for OpenLayers 2");
                    break;
                case "ol3":
                    console.error("Not implemented yet for OpenLayers 3");

                    break;
                case "leaflet":
                    var layers = this.map._layers;
                    for (var key in layers) {
                        if (layers.hasOwnProperty(key)) {
                            if ((layers[key].baseLayer === getBaseLayers || layers[key].baseLayer === false || layers[key].baseLayer === null) && ('id' in layers[key])) {
                                layerArr.push(layers[key].id.replace('v:', ''));
                            }
                        }
                    }
                    break;
            }
            return layerArr.join(";");
        }
        this.getVisibleLayers = function (getBaseLayers) {
            getBaseLayers = (getBaseLayers === true) ? true : false;
            var layerArr = [], i;
            switch (MAPLIB) {
                case "ol2":
                    for (i = 0; i < this.map.layers.length; i++) {
                        if ((this.map.layers[i].isBaseLayer === getBaseLayers || this.map.layers[i].isBaseLayer === false || this.map.layers[i].isBaseLayer === null) && this.map.layers[i].visibility === true && this.map.layers[i].CLASS_NAME === "OpenLayers.Layer.WMS") {
                            layerArr.push(this.map.layers[i].params.LAYERS);
                        }
                    }
                    break;
                case "ol3":
                    for (i = 0; i < this.map.getLayers().getLength(); i++) {

                        if (this.map.getLayers().a[i].e.visible === true && this.map.getLayers().a[i].baseLayer !== true) {
                            layerArr.push(this.map.getLayers().a[i].id);
                        }
                    }
                    break;
                case "leaflet":
                    var layers = this.map._layers;
                    for (var key in layers) {
                        if (layers.hasOwnProperty(key)) {
                            if ((layers[key].baseLayer === getBaseLayers || layers[key].baseLayer === false || layers[key].baseLayer === null) && typeof layers[key]._tiles === "object") {
                                layerArr.push(layers[key].id);
                            }
                        }
                    }
                    break;
            }
            return layerArr.join(";");
        };
        //ol2, ol3 and leaflet
        this.getNamesOfVisibleLayers = function () {
            var layerArr = [], i;
            switch (MAPLIB) {
                case "ol2":
                    for (i = 0; i < this.map.layers.length; i++) {
                        if (this.map.layers[i].isBaseLayer === false && this.map.layers[i].visibility === true && this.map.layers[i].CLASS_NAME === "OpenLayers.Layer.WMS") {
                            layerArr.push(this.map.layers[i].name);
                        }
                    }
                    break;
                case "ol3":
                    for (i = 0; i < this.map.getLayers().getLength(); i++) {
                        if (this.map.getLayers().a[i].t.visible === true && this.map.getLayers().a[i].baseLayer !== true) {
                            layerArr.push(this.map.getLayers().a[i].id);
                        }
                    }
                    break;
                case "leaflet":
                    var layers = this.map._layers;
                    for (var key in layers) {
                        if (layers.hasOwnProperty(key)) {
                            if (layers[key].baseLayer !== true && typeof layers[key]._tiles === "object") {
                                layerArr.push(layers[key].id);
                            }
                        }
                    }
                    break;
            }
            if (layerArr.length > 0) {
                return layerArr.join(",");
            } else {
                return false;
            }
        };
        //ol2
        this.getBaseLayer = function () {
            return this.map.baseLayer;
        };
        //ol2, ol3 and leaflet
        this.getBaseLayerName = function () {
            var name, layers;
            switch (MAPLIB) {
                case "ol2":
                    name = this.map.baseLayer.name;
                    break;
                case "ol3":
                    layers = this.map.getLayers();
                    for (var i = 0; i < layers.getLength(); i++) {
                        if (layers.a[i].t.visible === true && layers.a[i].baseLayer === true) {
                            name = this.map.getLayers().a[i].id;
                        }
                    }
                    break;
                case "leaflet":
                    layers = this.map._layers;
                    for (var key in layers) {
                        if (layers.hasOwnProperty(key)) {
                            if (layers[key].baseLayer === true) {
                                name = layers[key].id;
                            }
                        }
                    }
                    break;
            }
            return name;
        };
        //ol2, ol3 leaflet
        this.getZoom = function () {
            var zoom;
            switch (MAPLIB) {
                case "ol2":
                    zoom = this.map.getZoom();
                    break;
                case "ol3":
                    var resolution = this.getResolution();
                    zoom = Math.round(Math.log(2 * Math.PI * 6378137 / (256 * resolution)) / Math.LN2);
                    break;
                case "leaflet":
                    zoom = this.map.getZoom();
                    break;
            }
            return zoom;
        };
        //ol3
        this.getResolution = function () {
            return this.map.getView().getResolution();
        };
        //ol2
        this.getPixelCoord = function (x, y) {
            var p = {};
            p.x = this.map.getPixelFromLonLat(new OpenLayers.LonLat(x, y)).x;
            p.y = this.map.getPixelFromLonLat(new OpenLayers.LonLat(x, y)).y;
            return p;
        };
        //ol2, ol3 and leaflet
        // Input map coordinates (3857)
        this.zoomToPoint = function (x, y, r) {
            switch (MAPLIB) {
                case "ol2":
                    this.map.setCenter(new OpenLayers.LonLat(x, y), r);
                    break;
                case "ol3":
                    this.map.getView().setCenter([x, y]);
                    var resolution;
                    resolution = 2 * Math.PI * 6378137 / (256 * Math.pow(2, r));
                    this.map.getView().setResolution(resolution);
                    break;
                case "leaflet":
                    var p = transformPoint(x, y, "EPSG:3857", "EPSG:4326");
                    this.map.setView([p.y, p.x], r);
                    break;
            }
        };
        // Leaflet only
        this.setView = function (xy, r) {
            this.map.setView(xy, r);
        };
        // map init
        switch (MAPLIB) {
            case "ol2":
                var olControls = [
                    new OpenLayers.Control.Zoom(),
                    new OpenLayers.Control.Attribution(),
                    new OpenLayers.Control.TouchNavigation({
                        dragPanOptions: {
                            enableKinetic: true
                        }
                    })
                ];
                if (defaults.showLayerSwitcher) {
                    olControls.push(new OpenLayers.Control.LayerSwitcher());
                }
                this.map = new OpenLayers.Map(defaults.el, {
                    //theme: null,
                    controls: olControls,
                    numZoomLevels: defaults.numZoomLevels,
                    resolutions: defaults.resolutions,
                    projection: defaults.projection,
                    maxExtent: defaults.maxExtent,
                    eventListeners: defaults.eventListeners
                });
                break;
            case "ol3":
                this.map = new ol.Map({
                    target: defaults.el,
                    view: new ol.View2D({})
                    //renderers: ol.RendererHints.createFromQueryData()
                });
                break;
            case "leaflet":
                this.map = new L.map(defaults.el, defaults);
                lControl = L.control.layers([], []);
                this.layerControl = lControl;
                this.map.addControl(lControl);
                this.map.attributionControl.setPrefix(attribution);
                break;
        }
        var _map = this.map;
        this.addLayer = function (layer, name, baseLayer) {
            if (baseLayer) {
                lControl.addBaseLayer(layer, name);
            } else {
                lControl.addOverlay(layer, name);
            }
        }
        //ol2, ol3 and leaflet
        // MapQuest OSM doesn't work anymore. Switching to OSM.
        this.addMapQuestOSM = function () {
            switch (MAPLIB) {
                case "ol2":
                    this.mapQuestOSM = new OpenLayers.Layer.OSM("mapQuestOSM");
                    this.mapQuestOSM.wrapDateLine = false;
                    this.map.addLayer(this.mapQuestOSM);
                    this.mapQuestOSM.setVisibility(false);
                    break;
                case "ol3":
                    this.mapQuestOSM = new ol.layer.TileLayer({
                        source: new ol.source.OSM(),
                        visible: false
                    });
                    this.map.addLayer(this.mapQuestOSM);
                    break;
                case "leaflet":
                    this.mapQuestOSM = new L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                        attribution: "&copy; <a target='_blank' rel='noopener' href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors",
                        maxZoom: 20,
                        maxNativeZoom: 18
                    });
                    lControl.addBaseLayer(this.mapQuestOSM, "MapQuest OSM");
                    break;
            }
            this.mapQuestOSM.baseLayer = true;
            this.mapQuestOSM.id = "mapQuestOSM";
            return (this.mapQuestOSM);
        };
        //ol2, ol3 and leaflet
        this.addMapQuestAerial = function () {
            switch (MAPLIB) {
                case "ol2":
                    this.mapQuestAerial = new OpenLayers.Layer.OSM("mapQuestAerial", ["https://oatile1.mqcdn.com/tiles/1.0.0/sat/${z}/${x}/${y}.jpg", "https://oatile2.mqcdn.com/tiles/1.0.0/sat/${z}/${x}/${y}.jpg", "https://oatile3.mqcdn.com/tiles/1.0.0/sat/${z}/${x}/${y}.jpg", "https://oatile4.mqcdn.com/tiles/1.0.0/sat/${z}/${x}/${y}.jpg"]);
                    this.mapQuestAerial.wrapDateLine = false;
                    this.map.addLayer(this.mapQuestAerial);
                    this.mapQuestAerial.setVisibility(false);
                    break;
                case "ol3":
                    this.mapQuestAerial = new ol.layer.TileLayer({
                        source: new ol.source.MapQuestOpenAerial(),
                        visible: false
                    });
                    this.map.addLayer(this.mapQuestAerial);
                    break;
                case "leaflet":
                    this.mapQuestAerial = new L.tileLayer("https://oatile1.mqcdn.com/tiles/1.0.0/sat/{z}/{x}/{y}.jpg", {
                        maxZoom: 20,
                        maxNativeZoom: 18
                    });
                    lControl.addBaseLayer(this.mapQuestAerial, "Map Quest Aerial");
                    break;

            }
            this.mapQuestAerial.baseLayer = true;
            this.mapQuestAerial.id = "mapQuestAerial";
            return (this.mapQuestAerial);
        };
        //ol2, ol3 and leaflet
        this.addOSM = function () {
            switch (MAPLIB) {
                case "ol2":
                    this.osm = new OpenLayers.Layer.OSM("osm");
                    this.osm.wrapDateLine = false;
                    this.map.addLayer(this.osm);
                    this.osm.setVisibility(false);
                    break;
                case "ol3":
                    this.osm = new ol.layer.Tile({
                        source: new ol.source.OSM(),
                        visible: false
                    });
                    this.map.addLayer(this.osm);
                    break;
                case "leaflet":
                    this.osm = new L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                        attribution: "&copy; <a target='_blank' rel='noopener' href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors",
                        maxZoom: 21,
                        maxNativeZoom: 18
                    });
                    lControl.addBaseLayer(this.osm, "OSM");
                    break;
            }
            this.osm.baseLayer = true;
            this.osm.id = "osm";
            return (this.osm);
        };
        //ol2, ol3 and leaflet
        this.addStamen = function (type) {
            var name, prettyName;
            switch (type) {
                case "toner":
                    name = "stamenToner";
                    prettyName = "Stamen Toner";
                    break;
                case "toner-lite":
                    name = "stamenTonerLite";
                    prettyName = "Stamen Toner Lite";
                    break;
            }
            switch (MAPLIB) {
                case "ol2":
                    this.stamenToner = new OpenLayers.Layer.Stamen(type);
                    this.stamenToner.name = name;
                    this.map.addLayer(this.stamenToner);
                    this.stamenToner.setVisibility(false);
                    break;
                case "ol3":
                    this.stamenToner = new ol.layer.TileLayer({
                        source: new ol.source.Stamen({
                            layer: type
                        }),
                        visible: false
                    });
                    this.map.addLayer(this.stamenToner);
                    break;
                case "leaflet":
                    try {
                        this.stamenToner = new L.StamenTileLayer(type);
                        lControl.addBaseLayer(this.stamenToner, prettyName);
                    } catch (e) {
                    }
                    break;
            }
            this.stamenToner.baseLayer = true;
            this.stamenToner.id = name;
            return (this.stamenToner);
        };
        //ol2 and leaflet
        this.addMapBoxNaturalEarth = function () {
            switch (MAPLIB) {
                case "ol2":
                    this.mapBoxNaturalEarth = new OpenLayers.Layer.XYZ("mapBoxNaturalEarth", [
                        "//a.tiles.mapbox.com/v3/mapbox.natural-earth-hypso-bathy/${z}/${x}/${y}.png",
                        "//b.tiles.mapbox.com/v3/mapbox.natural-earth-hypso-bathy/${z}/${x}/${y}.png",
                        "//c.tiles.mapbox.com/v3/mapbox.natural-earth-hypso-bathy/${z}/${x}/${y}.png",
                        "//d.tiles.mapbox.com/v3/mapbox.natural-earth-hypso-bathy/${z}/${x}/${y}.png"
                    ]);
                    this.mapBoxNaturalEarth.wrapDateLine = false;
                    this.map.addLayer(this.mapBoxNaturalEarth);
                    this.mapBoxNaturalEarth.setVisibility(false);
                    break;
                case "ol3":
                    this.mapBoxNaturalEarth = new ol.layer.TileLayer({
                        source: new ol.source.OSM(),
                        visible: false
                    });
                    this.map.addLayer(this.mapBoxNaturalEarth);
                    break;
                case "leaflet":
                    this.mapBoxNaturalEarth = new L.tileLayer("https://a.tiles.mapbox.com/v3/mapbox.natural-earth-hypso-bathy/{z}/{x}/{y}.png");
                    lControl.addBaseLayer(this.mapBoxNaturalEarth, "Mapbox Natural Earth");
                    break;
            }
            this.mapBoxNaturalEarth.baseLayer = true;
            this.mapBoxNaturalEarth.id = "mapBoxNaturalEarth";
            return (this.mapBoxNaturalEarth);
        };
        //ol2 and leaflet
        this.addGoogle = function (type) {
            var l, name, prettyName, me = this;
            switch (type) {
                case "ROADMAP":
                    name = "googleStreets";
                    prettyName = "Google Streets";
                    break;
                case "HYBRID":
                    name = "googleHybrid";
                    prettyName = "Google Hybrid";
                    break;
                case "SATELLITE":
                    name = "googleSatellite";
                    prettyName = "Google Satellite";
                    break;
                case "TERRAIN":
                    name = "googleTerrain";
                    prettyName = "Google Terrain";
                    break;
            }
            // Load Google Maps API and make sure its not loaded more than once
            if (typeof window.GoogleMapsDirty === "undefined" && !(typeof google !== "undefined" && typeof google.maps !== "undefined")) {
                window.GoogleMapsDirty = true;
                jQuery.getScript("https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false&libraries=places&key=" + window.googleApiKey);
                // Google Maps API is loaded
            }

            (function poll() {
                if (typeof google !== "undefined" && typeof google.maps !== "undefined" && typeof google.maps.Map !== "undefined") {
                    switch (MAPLIB) {
                        case "ol2":
                            l = new OpenLayers.Layer.Google(name, {
                                type: google.maps.MapTypeId[type],
                                wrapDateLine: true,
                                numZoomLevels: 20,
                                title: prettyName
                            });
                            me.map.addLayer(l);
                            l.setVisibility(false);
                            l.baseLayer = true;
                            l.id = name;
                            break;
                        case "leaflet":
                            l = new L.gridLayer.googleMutant({type: type.toLowerCase()});
                            l.baseLayer = true;
                            lControl.addBaseLayer(l, prettyName);
                            l.id = name;
                            break;
                    }
                    googleMapAdded[name] = true;
                    return l;
                } else {
                    setTimeout(poll, 50);
                }
            }());
        };
        //ol2 and leaflet
        this.addBing = function (type) {
            var l, name, prettyName;
            switch (type) {
                case "Road":
                    name = "bingRoad";
                    prettyName = "Bing Road";
                    break;
                case "Aerial":
                    name = "bingAerial";
                    prettyName = "Bing Aerial";
                    break;
                case "AerialWithLabels":
                    name = "bingAerialWithLabels";
                    prettyName = "Bing Aerial w Labels";
                    break;
            }
            switch (MAPLIB) {
                case "ol2":
                    l = new OpenLayers.Layer.Bing({
                        name: name,
                        wrapDateLine: true,
                        key: window.bingApiKey || this.bingApiKey,
                        type: type
                    });
                    this.map.addLayer(l);
                    l.setVisibility(false);
                    l.baseLayer = true;
                    l.id = name;
                    return (l);
                case "leaflet":
                    l = new L.BingLayer(this.bingApiKey || window.bingApiKey, {
                        type: type,
                        maxZoom: 21,
                        maxNativeZoom: 18
                    });
                    l.baseLayer = true;
                    lControl.addBaseLayer(l, prettyName);
                    l.id = name;
                    return (l);
            }
        };
        //ol2 and leaflet
        this.addDigitalGlobe = function (type) {
            var l, name, prettyName, key = this.digitalGlobeKey;
            switch (type) {
                case "DigitalGlobe:Imagery":
                    name = "DigitalGlobe:ImageryTileService";
                    prettyName = "Digital Globe";
                    break;
            }
            switch (MAPLIB) {
                case "ol2":
                    l = new OpenLayers.Layer.XYZ(
                        type,
                        "https://services.digitalglobe.com/earthservice/wmtsaccess?CONNECTID=" + key + "&Service=WMTS&REQUEST=GetTile&Version=1.0.0&Format=image/png&Layer=" + name + "&TileMatrixSet=EPSG:3857&TileMatrix=EPSG:3857:${z}&TileRow=${y}&TileCol=${x}",
                        {
                            resolutions: resolutions
                        }
                    );
                    this.map.addLayer(l);
                    l.setVisibility(false);
                    break;
                case "leaflet":
                    l = new L.TileLayer("https://services.digitalglobe.com/earthservice/wmtsaccess?CONNECTID=" + key + "&Service=WMTS&REQUEST=GetTile&Version=1.0.0&Format=image/png&Layer=" + name + "&TileMatrixSet=EPSG:3857&TileMatrix=EPSG:3857:{z}&TileRow={y}&TileCol={x}", {
                        maxZoom: 21
                    });
                    lControl.addBaseLayer(l, prettyName);
                    break;
            }
            l.baseLayer = true;
            l.id = type;
            return (l);

        };
        //ol2 and leaflet
        this.addHere = function (type) {
            var l, name, prettyName, baseUrl,
                aerialTilesBaseUrl = "https://{s}.aerial.maps.api.here.com",
                baseMapTilesBaseUrl = "https://{s}.base.maps.api.here.com",
                panoTilesBaseUrl,
                trafficTiles,
                path = "/maptile/2.1/";
            switch (type) {
                case HERENORMALDAY:
                    name = "normal.day";
                    prettyName = "HERE Normal day";
                    baseUrl = baseMapTilesBaseUrl + "/" + path + "/maptile/newest/";
                    break;
                case HERENORMALDAYGREY:
                    name = "normal.day.grey";
                    prettyName = "HERE Normal day Grey";
                    baseUrl = baseMapTilesBaseUrl + "/" + path + "/maptile/newest/";
                    break;
                case HERENORMALNIGHTGREY:
                    name = "normal.night.grey";
                    prettyName = "HERE Normal Night Grey";
                    baseUrl = baseMapTilesBaseUrl + "/" + path + "/maptile/newest/";
                    break;
                case HERESATELLITEDAY:
                    name = "satellite.day";
                    prettyName = "HERE Satellite Day";
                    baseUrl = aerialTilesBaseUrl + "/" + path + "/maptile/newest/";
                    break;
                case HEREHYBRIDDAY:
                    name = "hybrid.day";
                    prettyName = "HERE Hybrid Day";
                    baseUrl = aerialTilesBaseUrl + "/" + path + "/maptile/newest/";
                    break;
            }

            l = new L.TileLayer(baseUrl + name + "/{z}/{x}/{y}/256/png8?app_id=" + window.gc2Options.hereApp.App_Id + "&app_code=" + window.gc2Options.hereApp.App_Code, {
                maxZoom: 21,
                subdomains: ["1", "2", "3", "4"],
                attribution: "&copy; Nokia</span>&nbsp;<a href='https://maps.nokia.com/services/terms' target='_blank' title='Terms of Use' style='color:#333;text-decoration: underline;'>Terms of Use</a></div> <img src='https://api.maps.nokia.com/2.2.4/assets/ovi/mapsapi/by_here.png' border='0'>"
            });

            lControl.addBaseLayer(l, prettyName);

            l.baseLayer = true;
            l.id = type;
            return (l);
        };
        //ol2 and leaflet
        this.addDtkSkaermkort = function (name, layer) {
            var l,
                url = "https://gc2.io/mapcache/baselayers/tms/";

            switch (MAPLIB) {
                case "ol2":
                    l = new OpenLayers.Layer.TMS(name, url, {
                        layername: layer,
                        type: 'png',
                        attribution: "&copy; Geodatastyrelsen",
                        resolutions: resolutions,
                        wrapDateLine: true
                    });
                    this.map.addLayer(l);
                    l.setVisibility(false);
                    break;
                case "leaflet":
                    url = url.replace("cdn.", "{s}.");
                    l = new L.TileLayer(url + "1.0.0/" + layer + "/{z}/{x}/{y}.png", {
                        tms: true,
                        subdomains: ["cdn1", "cdn2", "cdn3"],
                        attribution: "&copy; Geodatastyrelsen",
                        maxZoom: 21,
                        maxNativeZoom: 19
                    });
                    lControl.addBaseLayer(l, name);
                    break;
            }
            l.baseLayer = true;
            l.id = name;
            return (l);
        };
        //ol2 and leaflet
        this.addDtkSkaermkortUtm = function (name, layer) {
            var l,
                uriLayerName = (layer === "dtk_skaermkort") ? "topo_skaermkort" : "topo_skaermkort_daempet",
                topLeftCorner = new OpenLayers.LonLat(120000, 6500000),
                tileWidth = 256,
                tileHeight = 256;
            switch (MAPLIB) {
                case "ol2":
                    l = new OpenLayers.Layer.WMTS({
                        name: name,
                        url: ["https://a.services.kortforsyningen.dk/" + uriLayerName + "?login=mh1&password=sajas&", "https://b.services.kortforsyningen.dk/" + uriLayerName, "https://c.services.kortforsyningen.dk/" + uriLayerName],
                        style: "default",
                        layer: layer,
                        matrixSet: "View1",
                        format: "image/jpeg",
                        attribution: "&copy; Geodatastyrelsen",
                        params: {
                            login: "mh1",
                            password: "sajas"
                        },
                        matrixIds: [
                            {
                                identifier: "L00",
                                scaleDenominator: 1638.4 / 0.00028,
                                topLeftCorner: topLeftCorner,
                                tileWidth: tileWidth,
                                tileHeight: tileHeight,
                                matrixWidth: 3,
                                matrixHeight: 2
                            },
                            {
                                identifier: "L01",
                                scaleDenominator: 819.2 / 0.00028,
                                topLeftCorner: topLeftCorner,
                                tileWidth: tileWidth, tileHeight: tileHeight,
                                matrixWidth: 5,
                                matrixHeight: 3
                            },
                            {
                                identifier: "L02",
                                scaleDenominator: 409.6 / 0.00028,
                                topLeftCorner: topLeftCorner,
                                tileWidth: tileWidth, tileHeight: tileHeight,
                                matrixWidth: 9,
                                matrixHeight: 3
                            },
                            {
                                identifier: "L03",
                                scaleDenominator: 204.8 / 0.00028,
                                topLeftCorner: topLeftCorner,
                                tileWidth: tileWidth, tileHeight: tileHeight,
                                matrixWidth: 17,
                                matrixHeight: 12
                            },
                            {
                                identifier: "L04",
                                scaleDenominator: 102.4 / 0.00028,
                                topLeftCorner: topLeftCorner,
                                tileWidth: tileWidth, tileHeight: tileHeight,
                                matrixWidth: 34,
                                matrixHeight: 23
                            },
                            {
                                identifier: "L05",
                                scaleDenominator: 51.2 / 0.00028,
                                topLeftCorner: topLeftCorner,
                                tileWidth: tileWidth, tileHeight: tileHeight,
                                matrixWidth: 68,
                                matrixHeight: 46
                            },
                            {
                                identifier: "L06",
                                scaleDenominator: 25.6 / 0.00028,
                                topLeftCorner: topLeftCorner,
                                tileWidth: tileWidth, tileHeight: tileHeight,
                                matrixWidth: 135,
                                matrixHeight: 92
                            },
                            {
                                identifier: "L07",
                                scaleDenominator: 12.8 / 0.00028,
                                topLeftCorner: topLeftCorner,
                                tileWidth: tileWidth, tileHeight: tileHeight,
                                matrixWidth: 269,
                                matrixHeight: 184
                            },
                            {
                                identifier: "L08",
                                scaleDenominator: 6.4 / 0.00028,
                                topLeftCorner: topLeftCorner,
                                tileWidth: tileWidth, tileHeight: tileHeight,
                                matrixWidth: 538,
                                matrixHeight: 397
                            },
                            {
                                identifier: "L09",
                                scaleDenominator: 3.2 / 0.00028,
                                topLeftCorner: topLeftCorner,
                                tileWidth: tileWidth, tileHeight: tileHeight,
                                matrixWidth: 2149,
                                matrixHeight: 1465
                            },
                            {
                                identifier: "L10",
                                scaleDenominator: 1.6 / 0.00028,
                                topLeftCorner: topLeftCorner,
                                tileWidth: tileWidth, tileHeight: tileHeight,
                                matrixWidth: 4297,
                                matrixHeight: 2930
                            },
                            {
                                identifier: "L11",
                                scaleDenominator: 0.8 / 0.00028,
                                topLeftCorner: topLeftCorner,
                                tileWidth: tileWidth, tileHeight: tileHeight,
                                matrixWidth: 4297,
                                matrixHeight: 2930
                            },
                            {
                                identifier: "L12",
                                scaleDenominator: 0.4 / 0.00028,
                                topLeftCorner: topLeftCorner,
                                tileWidth: tileWidth, tileHeight: tileHeight,
                                matrixWidth: 8594,
                                matrixHeight: 5860
                            },
                            {
                                identifier: "L13",
                                scaleDenominator: 0.2 / 0.00028,
                                topLeftCorner: topLeftCorner,
                                tileWidth: tileWidth, tileHeight: tileHeight,
                                matrixWidth: 17188,
                                matrixHeight: 11719
                            }
                        ],
                        isBaseLayer: true,
                        displayInLayerSwitcher: true,
                        transitionEffect: 'resize'
                    });
                    this.map.addLayer(l);
                    l.setVisibility(false);
                    break;
                case "leaflet":
                    break;
            }
            l.baseLayer = true;
            l.id = name;
            return (l);
        };
        this.addYandex = function (type) {
            var name, prettyName;
            switch (type) {
                //map, satellite, hybrid, publicMap, publicMapHybrid
                case "map":
                    name = "yandexMap"
                    prettyName = "Yandex Map";
                    break;
                case "satellite":
                    name = "yandexSatellite"
                    prettyName = "Yandex Satellite";
                    break;
                case "hybrid":
                    name = "yandexHybrid"
                    prettyName = "Yandex Hybrid";
                    break;
                case "publicMap":
                    name = "yandexPublicMap"
                    prettyName = "Yandex Public Map";
                    break;
                case "publicMapHybrid":
                    name = "yandexPublicMapHybrid"
                    prettyName = "Yandex Public Map Hybrid";
                    break;
            }

            // Load Yandex Maps API and make sure its not loaded more than once
            if (typeof window.YandexMapsDirty === "undefined" && !(typeof ymaps !== "undefined" && typeof ymaps.Map !== "undefined")) {
                window.YandexMapsDirty = true;
                jQuery.getScript("https://api-maps.yandex.ru/2.0-stable/?load=package.standard&lang=ru-RU");
            }

            (function poll() {
                if (typeof ymaps !== "undefined" && typeof ymaps.Map !== "undefined") {
                    switch (MAPLIB) {
                        case "leaflet":
                            this.yandex = new L.Yandex(type);
                            yandexMapAdded[name] = true;
                            lControl.addBaseLayer(this.yandex, prettyName);
                            this.yandex.baseLayer = true;
                            this.yandex.id = name;
                            return (this.yandex);
                            break;
                    }
                } else {
                    setTimeout(poll, 100);
                }
            }());

        };

        //ol2 and leaflet
        this.addGeoDk = function (name, layer) {
            var l,
                url = "https://gc2.io/mapcache/baselayers/tms/";

            switch (MAPLIB) {
                case "ol2":
                    l = new OpenLayers.Layer.TMS(name, url, {
                        layername: layer,
                        type: 'png',
                        attribution: "&copy; Geodatastyrelsen",
                        resolutions: resolutions,
                        wrapDateLine: true
                    });
                    this.map.addLayer(l);
                    l.setVisibility(false);
                    break;
                case "leaflet":
                    l = new L.TileLayer(url + "1.0.0/" + layer + "/{z}/{x}/{y}.png", {
                        tms: true,
                        attribution: "",
                        maxZoom: 21,
                        maxNativeZoom: 19

                    });
                    lControl.addBaseLayer(l, name);
                    break;
            }
            l.baseLayer = true;
            l.id = name;
            return (l);
        };

        //ol2, ol3 and leaflet
        this.setBaseLayer = function (baseLayerName, loadEvent, loadingEvent, tileErrorEvent, layerNotFoundEvent) {
            var me = this;
            var layers;
            (function poll() {
                if (((baseLayerName.search("google") > -1 && googleMapAdded[baseLayerName] !== undefined)) ||
                    ((baseLayerName.search("yandex") > -1 && yandexMapAdded[baseLayerName] !== undefined)) ||
                    (baseLayerName.search("google") === -1 && baseLayerName.search("yandex") === -1)) {
                    switch (MAPLIB) {
                        case "ol2":
                            me.showLayer(baseLayerName);
                            me.map.setBaseLayer(me.getLayersByName(baseLayerName));
                            break;
                        case "ol3":
                            layers = me.map.getLayers();
                            for (var i = 0; i < layers.getLength(); i++) {
                                if (layers.a[i].baseLayer === true) {
                                    layers.a[i].set("visible", false);
                                }
                            }
                            me.getLayersByName(baseLayerName).set("visible", true);
                            break;
                        case "leaflet":
                            layers = lControl._layers;

                            // Remove every base layer from the map and layer control
                            for (var key in layers) {
                                if (layers.hasOwnProperty(key)) {
                                    if (layers[key].layer.baseLayer === true && me.map.hasLayer(layers[key].layer)) {
                                        me.map.removeLayer(layers[key].layer);
                                    }
                                }
                            }

                            // Removing duplicated layers from the layer control, so no extra events of deleted layers will be called
                            var existingLayer = [];
                            for (var key in layers) {
                                if (layers[key].layer.baseLayer === true) {
                                    if (existingLayer.indexOf(layers[key].name) === -1) {
                                        existingLayer.push(layers[key].name);
                                    } else {
                                        lControl.removeLayer(layers[key].layer);
                                    }
                                }
                            }

                            var layerWasFound = false;
                            // Adding specified layer to map
                            for (var key in layers) {
                                if (layers.hasOwnProperty(key)) {
                                    if (layers[key].layer.baseLayer === true) {
                                        if (layers[key].layer.id === baseLayerName) {
                                            layerWasFound = true;

                                            // Move all others than Google maps back
                                            if (baseLayerName.search("google") === -1 && baseLayerName.search("yandex") === -1) {
                                                layers[key].layer.setZIndex(1);
                                            }

                                            if (!loadEvent) {
                                                loadEvent = function () {
                                                }
                                            }

                                            if (!loadingEvent) {
                                                loadingEvent = function () {
                                                }
                                            }

                                            if (!tileErrorEvent) {
                                                tileErrorEvent = function () {
                                                }
                                            }

                                            layers[key].layer.off("load");
                                            layers[key].layer.on("load", loadEvent);

                                            layers[key].layer.off("loading");
                                            layers[key].layer.on("loading", loadingEvent);

                                            layers[key].layer.off("tileerror");
                                            layers[key].layer.on("tileerror", tileErrorEvent);

                                            me.map.addLayer(layers[key].layer);
                                        }
                                    }
                                }
                            }

                            if (layerWasFound === false && layerNotFoundEvent) {
                                layerNotFoundEvent();
                            }

                            break;
                    }
                } else {
                    setTimeout(poll, 200);
                }
            }());
        };

        this.addXYZBaselayer = function (url, conf) {
            var l = new L.TileLayer(url, conf);
            l.id = conf.name;
            l.baseLayer = true;
            lControl.addBaseLayer(l, conf.name);
            this.showLayer(conf.name)
            return [l];

        };

        this.addWmsBaseLayer = function (url, conf) {
            var l = new L.TileLayer.WMS(url, conf);
            l.id = conf.name;
            l.baseLayer = true;
            lControl.addBaseLayer(l, conf.name);
            this.showLayer(conf.name)
            return [l];
        }

        this.addBaseLayer = function (l, db, config, h) {
            var o;
            switch (l) {
                case "osm":
                    o = this.addOSM();
                    break;
                case "mapQuestOSM":
                    o = this.addMapQuestOSM();
                    break;
                case "addMapQuestAerial":
                    o = this.addMapQuestAerial();
                    break;
                case "mapBoxNaturalEarth":
                    o = this.addMapBoxNaturalEarth();
                    break;
                case "stamenToner":
                    o = this.addStamen("toner");
                    break;
                case "stamenTonerLite":
                    o = this.addStamen("toner-lite");
                    break;
                case "googleStreets":
                    o = this.addGoogle("ROADMAP");
                    break;
                case "googleHybrid":
                    o = this.addGoogle("HYBRID");
                    break;
                case "googleSatellite":
                    o = this.addGoogle("SATELLITE");
                    break;
                case "googleTerrain":
                    o = this.addGoogle("TERRAIN");
                    break;
                case "bingRoad":
                    o = this.addBing("Road");
                    break;
                case "bingAerial":
                    o = this.addBing("Aerial");
                    break;
                case "bingAerialWithLabels":
                    o = this.addBing("AerialWithLabels");
                    break;
                case "yandexMap":
                    o = this.addYandex("map");
                    break;
                case "yandexSatellite":
                    o = this.addYandex("satellite");
                    break;
                case "yandexHybrid":
                    o = this.addYandex("hybrid");
                    break;
                case "yandexPublicMap":
                    o = this.addYandex("publicMap");
                    break;
                case "yandexPublicMapHybrid":
                    o = this.addYandex("publicMapHybrid");
                    break;
                case "dtkSkaermkort":
                    o = this.addDtkSkaermkort("dtkSkaermkort", "kortforsyningen.dtk_skaermkort");
                    break;
                case "dtkSkaermkortDaempet":
                    o = this.addDtkSkaermkort("dtkSkaermkortDaempet", "kortforsyningen.dtk_skaermkort_daempet");
                    break;
                case "dtkSkaermkortGraa":
                    o = this.addDtkSkaermkort("dtkSkaermkortGraa", "kortforsyningen.dtk_skaermkort_graa");
                    break;
                case "dtkSkaermkort@25832":
                    o = this.addDtkSkaermkortUtm("dtkSkaermkort@25832", "dtk_skaermkort");
                    break;
                case "dtkSkaermkortDaempet@25832":
                    o = this.addDtkSkaermkortUtm("dtkSkaermkortDaempet@25832", "dtk_skaermkort_daempet");
                    break;
                case "DigitalGlobe:Imagery":
                    o = this.addDigitalGlobe("DigitalGlobe:Imagery");
                    break;
                case HERENORMALDAY:
                    o = this.addHere(HERENORMALDAY);
                    break;
                case HERENORMALDAYGREY:
                    o = this.addHere(HERENORMALDAYGREY);
                    break;
                case HERENORMALNIGHTGREY:
                    o = this.addHere(HERENORMALNIGHTGREY);
                    break;
                case HERESATELLITEDAY:
                    o = this.addHere(HERESATELLITEDAY);
                    break;
                case HEREHYBRIDDAY:
                    o = this.addHere(HEREHYBRIDDAY);
                    break;
                case "geodkBright":
                    o = this.addGeoDk("geodkBright", "geodk.bright");
                    break;
                case "luftfotoserier2017":
                    o = this.addGeoDk("luftfotoserier2017", "luftfotoserier.geodanmark_2017_12_5cm");
                    break;
                default : // Try to add as tile layer
                    o = this.addTileLayers($.extend({
                        layers: [l],
                        db: db,
                        host: h || host,
                        isBaseLayer: true,
                        visibility: false,
                        wrapDateLine: false,
                        displayInLayerSwitcher: true,
                        name: l,
                        type: "tms"
                    }, config));
                    break;
            }
            return o;
        };

        /**
         *
         * @param config
         * @returns {Array}
         */
        this.addUTFGridLayers = function (config) {
            var layers, layersArr = [],
                defaults = {
                    host: host,
                    layerId: false,
                    layers: [],
                    db: null,
                    mapRequestProxy: false,
                    visibility: true,
                    wrapDateLine: true,
                    tileCached: true,
                    name: null,
                    names: [],
                    uri: null,
                    fieldConf: {},
                    cache: false,
                    loading: null
                };

            if (config) {
                for (prop in config) {
                    defaults[prop] = config[prop];
                }
            }
            layers = defaults.layers;

            for (var i = 0; i < layers.length; i++) {
                var l = createUTFGridLayer(layers[i], defaults);
                this.map.addLayer(l, defaults.name || defaults.names[i] || layers[i]);
                layersArr.push(l);
            }
            return layersArr;
        };

        this.addTileLayers = function (config) {
            var defaults = {
                host: host,
                layerId: false,
                layers: [],
                db: null,
                mapRequestProxy: false,
                singleTile: false,
                opacity: 1,
                isBaseLayer: false,
                visibility: true,
                wrapDateLine: true,
                tileCached: true,
                displayInLayerSwitcher: true,
                name: null,
                names: [],
                resolutions: this.map.resolutions,
                type: "wms",
                minZoom: 1,
                maxZoom: 28,
                maxNativeZoom: 28,
                tileSize: MAPLIB === "ol2" ? OpenLayers.Size(256, 256) : 256,
                uri: null
            };
            if (config) {
                for (prop in config) {
                    defaults[prop] = config[prop];
                }
            }
            var layers = defaults.layers;
            var layersArr = [];
            for (var i = 0; i < layers.length; i++) {
                var l;
                switch (defaults.type) {
                    case "wms":
                        l = createTileLayer(layers[i], defaults);
                        break;
                    case "tms":
                        l = createTMSLayer(layers[i], defaults);
                        break;
                    case "mvt":
                        l = createMVTLayer(layers[i], defaults);
                        break;
                    default:
                        l = createTileLayer(layers[i], defaults);
                        break;
                }

                l.baseLayer = defaults.isBaseLayer;
                if (defaults.isBaseLayer === true) {
                    lControl.addBaseLayer(l, defaults.name || defaults.names[i]);
                } else {
                    lControl.addOverlay(l, defaults.name || defaults.names[i] || layers[i]);
                }

                if (defaults.visibility === true) {
                    this.showLayer(layers[i]);
                }

                layersArr.push(l);
            }

            return layersArr;
        };


        //ol2 and leaflet
        this.removeTileLayerByName = function (name) {
            switch (MAPLIB) {
                case "ol2":
                    var arr = this.map.getLayersByName(name);
                    this.map.removeLayer(arr[0]);
                    break;
                case "leaflet":
                    this.map.removeLayer(this.getLayersByName(name));
                    lControl.removeLayer(this.getLayersByName(name));
                    break;
            }
        };

        // Leaflet
        this.setZIndexOfLayer = function (layer, z) {
            switch (MAPLIB) {
                case "ol2":
                    break;
                case "leaflet":
                    layer.setZIndex(z);
                    break;
            }
        };

        //ol2 and leaflet
        this.addGeoJsonStore = function (store) {
            // set the parent map obj
            store.map = this;
            switch (MAPLIB) {
                case "ol2":
                    this.map.addLayers([store.layer]);
                    break;
                case "ol3":
                    this.map.addLayer(store.layer);
                    break;
                case "leaflet":
                    lControl.addOverlay(store.layer, store.name);
                    this.showLayer(store.layer.id);
                    break;
            }
        };
        this.addHeatMap = function (store, weight, factor, config) {
            var points = [], features = store.geoJSON.features;
            weight = weight || 1;
            factor = factor || 1;
            config = config || {};
            for (var key in features) {
                if (features.hasOwnProperty(key)) {
                    features[key].geometry.coordinates.reverse();
                    features[key].geometry.coordinates.push((features[key].properties[weight] * factor) + "")
                    points.push(features[key].geometry.coordinates)
                }
            }
            store.layer = L.heatLayer(points, config);
            this.addGeoJsonStore(store);
        }

        //ol2 and leaflet
        this.removeGeoJsonStore = function (store) {
            switch (MAPLIB) {
                case "ol2":
                    this.map.removeLayer(store.layer);
                    break;
                case "leaflet":
                    this.map.removeLayer(store.layer);
                    break;
            }

        };
        //ol2, ol3 and leaflet
        this.hideLayer = function (name) {
            switch (MAPLIB) {
                case "ol2":
                    this.getLayersByName(name).setVisibility(false);
                    break;
                case "ol3":
                    this.getLayersByName(name).set("visible", false);
                    break;
                case "leaflet":
                    this.map.removeLayer(this.getLayersByName(name));
                    break;
            }
        };

        this.showLayer = function (name) {
            this.getLayersByName(name).addTo(this.map);
        };

        //ol2
        this.getLayerById = function (id) {
            return this.map.getLayer(id);
        };

        //leaflet (rename to getLayerByName)
        this.getLayersByName = function (name, searchBaseLayers = true) {
            var l;
            var layers = lControl._layers;
            for (var key in layers) {
                if (layers.hasOwnProperty(key)) {
                    if (layers[key].layer.id === name || layers[key].layer.id === ('mvt:' + name)) {
                        if (searchBaseLayers) {
                            l = layers[key].layer;
                        } else if (!layers[key].layer.baseLayer) {
                            l = layers[key].layer;
                        }
                    }
                }
            }

            //if (!l) throw new Error('Unable to find layer with identifier ' + name);

            return l;
        };

        //ol2
        this.hideAllTileLayers = function () {
            for (var i = 0; i < this.map.layers.length; i++) {
                if (this.map.layers[i].isBaseLayer === false && this.map.layers[i].CLASS_NAME === "OpenLayers.Layer.WMS") {
                    this.map.layers[i].setVisibility(false);
                }
            }
        };
        //ol2, ol3 and leaflet
        // Output map coordinates (3857)
        this.getCenter = function () {
            var point;
            switch (MAPLIB) {
                case "ol2":
                    point = this.map.center;
                    return {
                        x: point.lon,
                        y: point.lat
                    };
                    break;
                case "ol3":
                    point = this.map.getView().getCenter();
                    return {
                        x: point[0],
                        y: point[1]
                    };
                    break;
                case "leaflet":
                    point = this.map.getCenter();
                    var p = transformPoint(point.lng, point.lat, "EPSG:4326", "EPSG:3857");
                    return {
                        x: p.x,
                        y: p.y,
                        lon: point.lng,
                        lat: point.lat
                    };
                    break;
            }
        };
        //ol2
        this.getExtent = function () {
            var mapBounds, bounds;
            switch (MAPLIB) {
                case "ol2":
                    mapBounds = this.map.getExtent();
                    bounds = mapBounds.toArray();
                    break;
                case "ol3":

                    break;
                case "leaflet":
                    mapBounds = this.map.getBounds().toBBoxString().split(",");

                    var lower = transformPoint(mapBounds[0], mapBounds[1], "EPSG:4326", "EPSG:3857")
                    var upper = transformPoint(mapBounds[2], mapBounds[3], "EPSG:4326", "EPSG:3857")

                    bounds = {
                        left: mapBounds[0],
                        right: mapBounds[2],
                        top: mapBounds[3],
                        bottom: mapBounds[1],
                        leftProj: lower.x,
                        bottomProj: lower.y,
                        rightProj: upper.x,
                        topProj: upper.y
                    };
                    break;
            }
            return (bounds);
        };

        //ol2
        this.getBbox = function () {
            return this.map.getExtent().toString();
        };
        // Leaflet
        this.locate = function () {
            this.map.locate({
                setView: true
            });
        };
        //ol2 and leaflet
        this.addLayerFromWkt = function (elements) { // Take 4326
            switch (MAPLIB) {
                case "ol2":
                    this.removeQueryLayers();
                    var features, geometry, transformedFeature, wkt = new OpenLayers.Format.WKT;
                    for (var i = 0; i < elements.length; i++) {
                        features = wkt.read(elements[i]);
                        queryLayers[i] = new OpenLayers.Layer.Vector(null, {
                            displayInLayerSwitcher: false,
                            styleMap: new OpenLayers.StyleMap({
                                'default': new OpenLayers.Style({
                                    strokeColor: '#000000',
                                    strokeWidth: 3,
                                    fillOpacity: 0,
                                    strokeOpacity: 0.8
                                })
                            })
                        });
                        geometry = features.geometry.transform(
                            new OpenLayers.Projection('EPSG:4326'),
                            new OpenLayers.Projection('EPSG:3857')
                        );
                        transformedFeature = new OpenLayers.Feature.Vector(geometry, {});
                        queryLayers[i].addFeatures([transformedFeature]);
                        this.map.addLayers([queryLayers[i]]);
                    }
                    break;
                case "ol3":

                    break;
                case "leaflet":
                    this.removeQueryLayers();
                    var wkt = new Wkt.Wkt();
                    for (var i = 0; i < elements.length; i++) {
                        wkt.read(elements[i]);
                        queryLayers[i] = wkt.toObject({
                            color: '#000000',
                            weight: 3,
                            opacity: 0.8,
                            fillOpacity: 0
                        }).addTo(this.map);
                    }
                    break;
            }
        };
        // ol2 and leaflet
        this.removeQueryLayers = function () {
            switch (MAPLIB) {
                case "ol2":
                    try {
                        for (var i = 0; i < queryLayers.length; i++) {
                            //queryLayers[i].destroy();
                            this.map.removeLayer(queryLayers[i])
                        }
                    } catch (e) {
                    }
                    break;
                case "ol3":
                    break;
                case "leaflet":
                    try {
                        for (var i = 0; i < queryLayers.length; i++) {
                            this.map.removeLayer(queryLayers[i]);
                        }
                    } catch (e) {
                    }
                    break;
            }

        };
        // ol2, ol3 and leaflet
        this.on = function (event, callBack) {
            switch (MAPLIB) {
                case "ol2":
                    if (event === "click") {
                        OpenLayers.Control.Click = OpenLayers.Class(OpenLayers.Control, {
                            defaultHandlerOptions: {
                                'single': true,
                                'double': false,
                                'pixelTolerance': 0,
                                'stopSingle': false,
                                'stopDouble': false
                            },
                            initialize: function (options) {
                                this.handlerOptions = OpenLayers.Util.extend({}, this.defaultHandlerOptions);
                                OpenLayers.Control.prototype.initialize.apply(this, arguments);
                                this.handler = new OpenLayers.Handler.Click(this, {
                                    'click': this.trigger
                                }, this.handlerOptions);
                            },
                            trigger: function (e) {
                                callBack(e);
                            }
                        });
                        var click = new OpenLayers.Control.Click()
                        this.map.addControl(click);
                        click.activate();
                    }
                    if (event === "moveend") {
                        this.map.events.register("moveend", null, callBack);
                    }
                    break;
                case "ol3":
                    this.map.on(event, callBack);
                    break;
                case "leaflet":
                    this.map.on(event, callBack);
                    break;
            }
        };
    };
// ol2, ol3 and leaflet
// Input map coordinates (3857)
    clickEvent = function (e, map) {
        this.getCoordinate = function () {
            var point;
            switch (MAPLIB) {
                case "ol2":
                    point = map.map.getLonLatFromPixel(e.xy);
                    return {
                        x: point.lon,
                        y: point.lat
                    };
                    break;
                case "ol3":
                    point = e.coordinate;
                    return {
                        x: point[0],
                        y: point[1]
                    };
                    break;
                case "leaflet":
                    point = e.latlng;
                    var p = transformPoint(point.lng, point.lat, "EPSG:4326", "EPSG:3857");
                    return {
                        x: p.x,
                        y: p.y,
                        lat: point.lat,
                        lng: point.lng
                    };
                    break;
            }
        };
    };
    transformPoint = function (lat, lon, s, d) {
        const proj4 = require("proj4");
        proj4.defs("EPSG:32632", "+proj=utm +zone=32 +ellps=WGS84 +datum=WGS84 +units=m +no_defs");
        let p = proj4(s, d, [parseFloat(lat), parseFloat(lon)]);
        return {x: p[0], y: p[1]}
    };

    return {
        geoJsonStore: geoJsonStore,
        sqlStore: sqlStore,
        webGLStore: webGLStore,
        tileLayer: tileLayer,
        elasticStore: elasticStore,
        tweetStore: tweetStore,
        cartoDbStore: cartoDbStore,
        map: map,
        MAPLIB: MAPLIB,
        clickEvent: clickEvent,
        transformPoint: transformPoint,
        urlVars: (function getUrlVars() {
            var mapvars = {};
            var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
                mapvars[key] = value;
            });
            return mapvars;
        })(),
        pathName: window.location.pathname.split("/"),
        urlHash: window.location.hash,
        OSM: OSM,
        MAPQUESTOSM: MAPQUESTOSM,
        MAPBOXNATURALEARTH: MAPBOXNATURALEARTH,
        STAMENTONER: STAMENTONER,
        STAMENTONERLITE: STAMENTONERLITE,
        GOOGLESTREETS: GOOGLESTREETS,
        GOOGLEHYBRID: GOOGLEHYBRID,
        GOOGLESATELLITE: GOOGLESATELLITE,
        GOOGLETERRAIN: GOOGLETERRAIN,
        BINGROAD: BINGROAD,
        BINGAERIAL: BINGAERIAL,
        BINGAERIALWITHLABELS: BINGAERIALWITHLABELS,
        DTKSKAERMKORT: DTKSKAERMKORT,
        DTKSKAERMKORT_25832: DTKSKAERMKORT_25832,
        DTKSKAERMKORTDAEMPET: DTKSKAERMKORTDAEMPET,
        DTKSKAERMKORTGRAA: DTKSKAERMKORTGRAA,
        DIGITALGLOBE: DIGITALGLOBE,
        HERENORMALDAYGREY: HERENORMALDAYGREY,
        HERENORMALNIGHTGREY: HERENORMALNIGHTGREY,
        HERESATELLITEDAY: HERESATELLITEDAY,
        HEREHYBRIDDAY: HEREHYBRIDDAY,
        GEODKBRIGHT: GEODKBRIGHT,
        LUFTFOTOSERIER2017: LUFTFOTOSERIER2017,
        setHost: setHost
    };
}());

// Adding extensions for several map providers

// Stamen (Leaflet and OpenLayers)
(function (exports) {
    /*
     * tile.stamen.js v1.2.4
     */
    "use strict";
    var SUBDOMAINS = " a. b. c. d.".split(" "),
        MAKE_PROVIDER = function (layer, type, minZoom, maxZoom) {
            return {
                "url": ["https://stamen-tiles.a.ssl.fastly.net/", layer, "/{Z}/{X}/{Y}.", type].join(""),
                "type": type,
                "subdomains": SUBDOMAINS.slice(),
                "minZoom": minZoom,
                "maxZoom": maxZoom,
                "attribution": [
                    'Map tiles by <a href="http://stamen.com">Stamen Design</a>, ',
                    'under <a rel="noopener" href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. ',
                    'Data by <a rel="noopener" href="http://openstreetmap.org">OpenStreetMap</a>, ',
                    'under <a rel="noopener" href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>.'
                ].join("")
            };
        },
        PROVIDERS = {
            "toner": MAKE_PROVIDER("toner", "png", 0, 21),
            "terrain": MAKE_PROVIDER("terrain", "jpg", 4, 18),
            "watercolor": MAKE_PROVIDER("watercolor", "jpg", 1, 18)
        };
    /*
     * Get the named provider, or throw an exception if it doesn't exist.
     */
    var getProvider = function (name) {
        if (name in PROVIDERS) {
            return PROVIDERS[name];
        } else {
            throw 'No such provider (' + name + ')';
        }
    };

    /*
     * A shortcut for specifying "flavors" of a style, which are assumed to have the
     * same type and zoom range.
     */
    var setupFlavors = function (base, flavors, type) {
        var provider = getProvider(base);
        for (var i = 0; i < flavors.length; i++) {
            var flavor = [base, flavors[i]].join("-");
            PROVIDERS[flavor] = MAKE_PROVIDER(flavor, type || provider.type, provider.minZoom, provider.maxZoom);
        }
    };
// set up toner and terrain flavors
    setupFlavors("toner", ["hybrid", "labels", "lines", "background", "lite"]);
// toner 2010
    setupFlavors("toner", ["2010"]);
// toner 2011 flavors
    setupFlavors("toner", ["2011", "2011-lines", "2011-labels", "2011-lite"]);
    setupFlavors("terrain", ["background"]);
    setupFlavors("terrain", ["labels", "lines"], "png");

    /*
     * Export stamen.tile to the provided namespace.
     */
    exports.stamen = exports.stamen || {};
    exports.stamen.tile = exports.stamen.tile || {};
    exports.stamen.tile.providers = PROVIDERS;
    exports.stamen.tile.getProvider = getProvider;


    /*
     * StamenTileLayer for Leaflet
     * <http://leaflet.cloudmade.com/>
     *
     * Tested with version 0.3 and 0.4, but should work on all 0.x releases.
     */
    if (typeof L === "object") {
        L.StamenTileLayer = L.TileLayer.extend({
            initialize: function (name) {
                var provider = getProvider(name),
                    url = provider.url.replace(/({[A-Z]})/g, function (s) {
                        return s.toLowerCase();
                    });
                L.TileLayer.prototype.initialize.call(this, url, {
                    "minZoom": provider.minZoom,
                    "maxZoom": provider.maxZoom,
                    "maxNativeZoom": 18,
                    "subdomains": provider.subdomains,
                    "scheme": "xyz",
                    "attribution": provider.attribution
                });
            }
        });
    }

})(typeof exports === "undefined" ? this : exports);
