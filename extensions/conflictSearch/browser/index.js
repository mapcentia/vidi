/*
 * @author     Martin Høgh <mh@mapcentia.com>
 * @copyright  2013-2019 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

'use strict';

/**
 *
 * @type {*|exports|module.exports}
 */
var cloud;

/**
 *
 * @type {*|exports|module.exports}
 */
var meta;

/**
 *
 * @type {*|exports|module.exports}
 */
var utils;

/**
 *
 * @type {*|exports|module.exports}
 */
var search;

/**
 *
 * @type {*|exports|module.exports}
 */
var backboneEvents;

var serializeLayers;

/**
 *
 * @type {*|exports|module.exports}
 */
var urlparser = require('./../../../browser/modules/urlparser');

/**
 *
 * @type {*|exports|module.exports}
 */
var reproject = require('reproject');

/**
 * @type {string}
 */
var db = urlparser.db;

/**
 * @type {*|exports|module.exports}
 */
var noUiSlider = require('nouislider');

/**
 * @type {*|exports|module.exports}
 */
var io = require('socket.io-client');

/**
 *
 * @type {Element}
 */
var bufferSlider;

/**
 *
 * @type {Element}
 */
var bufferValue;
var currentBufferValue;

/**
 * @type {*|exports|module.exports}
 */
var drawControl;

/**
 * @type {*|exports|module.exports}
 */
var print;

/**
 * @type {*|exports|module.exports}
 */
var socketId;

/**
 *
 * @type {L.FeatureGroup}
 */
var drawnItems = new L.FeatureGroup();

/**
 *
 * @type {L.FeatureGroup}
 */
var bufferItems = new L.FeatureGroup();

/**
 *
 * @type {L.FeatureGroup}
 */

var dataItems = new L.FeatureGroup();

/**
 *
 * @type {string}
 */
var config = require('../../../config/config.js');

/**
 *
 * @type {string}
 */
var BACKEND = config.backend;

/**
 *
 */
var dataStore;

/**
 *
 */
var xhr;

/**
 *
 *  * @type {string}
 */
var fromDrawingText = "tegning";

/**
 *
 *  * @type {string}
 */
var currentFromText;

/**
 *
 * @type {string}
 */
var id = "conflict-custom-search";

var searchStr = "";

var searchLoadedLayers = true;

/**
 *
 */
var Terraformer = require('terraformer-wkt-parser');

var debounce = require('lodash/debounce');

var _result;

/**
 *
 * @private
 */
var _clearDrawItems = function (clearOnlyBuffer = false) {
    if (!clearOnlyBuffer) drawnItems.clearLayers();
    bufferItems.clearLayers();
};

/**
 *
 * @private
 */
var _clearDataItems = function () {
    dataItems.clearLayers();
};

/**
 *
 * @private
 */
var _clearInfoItems = function () {
    $("#conflict-info-tab").empty();
    $("#conflict-info-pane").empty();
    $('#conflict-modal-info-body').hide();
};

/**
 *
 * @private
 */
var _clearAllItems = function () {
    _clearDrawItems();
    _clearInfoItems();
    _clearDataItems();
};

/**
 * A function, whick are called before the conflict is run. Must return a promise
 * Can be overided in setPreProcessor method
 */
var preProcessor = function () {
    return new Promise(function (resolve, reject) {
        resolve();
    })
};

/**
 *
 * @private
 */
var _zoomToFeature = function (table, key, fid) {
    try {
        dataStore.abort();
    } catch (e) {
    }
    var onLoad = function () {
        _clearDataItems();
        dataItems.addLayer(this.layer);
        cloud.zoomToExtentOfgeoJsonStore(this);
    };

    dataStore = new geocloud.sqlStore({
        jsonp: false,
        method: "POST",
        host: "",
        db: db,
        uri: "/api/sql",
        sql: "SELECT * FROM " + table + " WHERE " + key + "=" + fid,
        onLoad: onLoad
    });

    dataStore.load();
};

var hitsTable;
var hitsData;
var noHitsTable;
var errorTable;
var visibleLayers;
var projWktWithBuffer;
/**
 * Draw module
 */
var draw;

/**
 *
 * @type set: module.exports.set, init: module.exports.init
 */
module.exports = module.exports = {

    /**
     *
     * @param o
     * @returns {exports}
     */
    set: function (o) {
        cloud = o.cloud.get();
        utils = o.utils;
        draw = o.draw;
        meta = o.meta;
        backboneEvents = o.backboneEvents;
        socketId = o.socketId;
        serializeLayers = o.serializeLayers;
        print = o.print;

        // Hack to compile Glob files. Don´t call this function!
        function ಠ_ಠ() {
            require('./../../../browser/modules/search/*.js', {glob: true});
        }

        search = require('./../../../browser/modules/search/' + window.vidiConfig.enabledSearch + '.js');
        search.set(o);
        return this;
    },

    /**
     * Initiates the module
     */
    init: function () {
        var metaData, me = this, startBuffer, getProperty;

        try {
            startBuffer = config.extensionConfig.conflictSearch.startBuffer;
        } catch (e) {
            startBuffer = 40;
        }

        try {
            getProperty = config.extensionConfig.conflictSearch.getProperty;
        } catch (e) {
            getProperty = false;
        }

        try {
            searchStr = config.extensionConfig.conflictSearch.searchString;
            if (searchStr === undefined) {
                searchStr = "";
            }
        } catch (e) {
            searchStr = "";
        }

        try {
            searchLoadedLayers = config.extensionConfig.conflictSearch.searchLoadedLayers;
            if (searchLoadedLayers === undefined) {
                searchLoadedLayers = true;
            }
        } catch (e) {
            searchLoadedLayers = true;
        }

        // Set up draw module for conflict
        draw.setConflictSearch(this);
        $("#_draw_make_conflict_with_selected").show();
        $("#_draw_make_conflict_with_all").show();

        cloud.map.addLayer(drawnItems);
        cloud.map.addLayer(bufferItems);
        cloud.map.addLayer(dataItems);

        // Create a new tab in the main tab bar
        utils.createMainTab("conflict", "Konfliktsøgning", "Lav en konfliktsøgning ned igennem alle lag. Der kan søges med en adresse/matrikelnr., en tegning eller et objekt fra et lag. Det sidste gøres ved at klikke på et objekt i et tændt lag og derefter på \'Søg med dette objekt\'", require('./../../../browser/modules/height')().max, "check_circle", false, "conflictSearch");
        $("#conflict").append(dom);

        // DOM created

        // Init search with custom callback
        search.init(function () {
            _clearDrawItems();
            _clearDataItems();
            this.layer._layers[Object.keys(this.layer._layers)[0]]._vidi_type = "query_draw"; // Tag it, so it serialized
            drawnItems.addLayer(this.layer._layers[Object.keys(this.layer._layers)[0]]);
            cloud.zoomToExtentOfgeoJsonStore(this, 17);
            me.makeSearch($("#conflict-custom-search").val());
        }, id, false, getProperty);

        bufferSlider = document.getElementById('conflict-buffer-slider');
        bufferValue = document.getElementById('conflict-buffer-value');
        try {
            noUiSlider.create(bufferSlider, {
                start: startBuffer,
                connect: "lower",
                step: 0.01,
                range: {
                    min: -5,
                    max: 500
                }
            });
            bufferSlider.noUiSlider.on('update', function (values, handle) {
                bufferValue.value = values[handle];
                currentBufferValue = bufferValue.value;
            });
            bufferSlider.noUiSlider.on('change', debounce(function (values, handle) {
                //currentBufferValue = values[handle];
                bufferItems.clearLayers();
                me.makeSearch()

            }, 300));
            // When the input changes, set the slider value
            bufferValue.addEventListener('change', function () {
                bufferSlider.noUiSlider.set([this.value]);
            });
        } catch (e) {
        }

        // TODO extensios are are initiated AFTER "ready:meta", so below is newer reached
        backboneEvents.get().on("ready:meta", function () {
            metaData = meta.getMetaData();
        })
    },

    /**
     * Handle for GUI toggle button
     */
    control: function () {
        var me = this;

        hitsTable = $("#hits-content tbody");
        hitsData = $("#hits-data");
        noHitsTable = $("#nohits-content tbody");
        errorTable = $("#error-content tbody");
        // Start listen to the web socket
        io.connect().on(socketId.get(), function (data) {
            if (typeof data.num !== "undefined") {
                $("#conflict-progress").html(data.num + " " + (data.title || data.table));
                if (data.error === null) {
                    $("#conflict-console").append(data.num + " table: " + data.table + ", hits: " + data.hits + " , time: " + data.time + "\n");
                } else {
                    $("#conflict-console").append(data.table + " : " + data.error + "\n");
                }
            }
        });

        backboneEvents.get().trigger("on:conflictInfoClick");

        // Emit "on" event
        backboneEvents.get().trigger("on:conflict");

        // Show DOM elements
        $("#conflict-buffer").show();
        $("#conflict-main-tabs-container").show();
        $("#conflict-places").show();
        $("#conflict .tab-content").show();

        // Reset layer made by clickInfo
        backboneEvents.get().trigger("reset:infoClick");

        // Setup and add draw control
        //L.drawLocal = require('./../../../browser/modules/drawLocales/advancedInfo.js');
        drawControl = new L.Control.Draw({
            position: 'topright',
            draw: {
                polygon: {
                    title: 'Draw a polygon!',
                    allowIntersection: true,
                    drawError: {
                        color: '#b00b00',
                        timeout: 1000
                    },
                    shapeOptions: {
                        color: '#662d91',
                        fillOpacity: 0
                    },
                    showArea: true
                },
                polyline: {
                    metric: true,
                    shapeOptions: {
                        color: '#662d91',
                        fillOpacity: 0
                    }
                },
                circle: {
                    shapeOptions: {
                        color: '#662d91',
                        fillOpacity: 0
                    }
                },
                rectangle: {
                    shapeOptions: {
                        color: '#662d91',
                        fillOpacity: 0
                    }
                },
                marker: true
            },
            edit: {
                featureGroup: drawnItems,
                remove: false
            }
        });
        cloud.map.addControl(drawControl);

        // Unbind events
        cloud.map.off('draw:created');
        cloud.map.off('draw:drawstart');
        cloud.map.off('draw:drawstop');
        cloud.map.off('draw:editstart');

        // Bind events
        cloud.map.on('draw:created', function (e) {
            e.layer._vidi_type = "query_draw";
            if (e.layerType === 'marker') {

                e.layer._vidi_marker = true;
            }
            drawnItems.addLayer(e.layer);
        });
        cloud.map.on('draw:drawstart', function (e) {
            _clearDrawItems();
            _clearDataItems();
            // Switch info click off
            backboneEvents.get().trigger("off:conflictInfoClick");
        });
        cloud.map.on('draw:drawstop', function (e) {
            me.makeSearch(fromDrawingText);
            // Switch info click on again, but wait a bit, so drag n drop of rec and circle doesn't trigger a click
            setTimeout(() => {
                backboneEvents.get().trigger("on:conflictInfoClick");
            }, 300);
        });
        cloud.map.on('draw:editstop', function (e) {
            me.makeSearch(fromDrawingText);
            // Switch info click on again
            backboneEvents.get().trigger("on:conflictInfoClick");
        });
        cloud.map.on('draw:editstart', function (e) {
            // Switch info click off
            backboneEvents.get().trigger("off:conflictInfoClick");
            bufferItems.clearLayers();
        });

        // Show tool tips for drawing tools
        var po = $('.leaflet-draw-toolbar-top').popover({
            content: __("Use these tools for querying the overlay maps."),
            placement: "left"
        });
        po.popover("show");
        setTimeout(function () {
            po.popover("hide");
        }, 2500);

    },

    /**
     * Turns conflict off and resets DOM
     */
    off: function () {
        // Clean up
        console.info("Stopping conflict");
        _clearAllItems();
        $("#conflict-buffer").hide();
        $("#conflict-main-tabs-container").hide();
        $("#conflict-places").hide();
        $("#conflict .tab-content").hide();
        $("#conflict-btn").prop("checked", false);
        $("#conflict-print-btn").prop("disabled", true);


        $("#hits-content tbody").empty();
        $("#hits-data").empty();
        $("#nohits-content tbody").empty();
        $("#error-content tbody").empty();

        $('#conflict-result-content a[href="#hits-content"] span').empty();
        $('#conflict-result-content a[href="#nohits-content"] span').empty();
        $('#conflict-result-content a[href="#error-content"] span').empty();

        // Unbind events
        cloud.map.off('draw:created');
        cloud.map.off('draw:drawstart');
        cloud.map.off('draw:drawstop');
        cloud.map.off('draw:editstart');
        try {
            cloud.map.removeControl(drawControl);
        } catch (e) {
        }
    },

    /**
     * Makes a conflict search
     * @param text
     * @param callBack
     * @param id Set specific layer id to use. Else the first in drawnItems will be used
     */
    makeSearch: function (text, callBack, id = null, fromDrawing = false) {
        var primitive, coord,
            layer, buffer = parseFloat($("#conflict-buffer-value").val()), bufferValue = buffer,
            hitsTable = $("#hits-content tbody"),
            noHitsTable = $("#nohits-content tbody"),
            errorTable = $("#error-content tbody"),
            hitsData = $("#hits-data"),
            row, fileId, searchFinish, geomStr,
            visibleLayers = cloud.getAllTypesOfVisibleLayers().split(";"), crss;

        const setCrss = (layer) => {
            if (typeof layer.getBounds !== "undefined") {
                coord = layer.getBounds().getSouthWest();
            } else {
                coord = layer.getLatLng();
            }
            var zone = require('./../../../browser/modules/utmZone.js').getZone(coord.lat, coord.lng);
            crss = {
                "proj": "+proj=utm +zone=" + zone + " +ellps=WGS84 +datum=WGS84 +units=m +no_defs",
                "unproj": "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs"
            };
        }

            _self = this;
        visibleLayers = cloud.getAllTypesOfVisibleLayers().split(";");
        if (text) {
            currentFromText = text;
        }

        hitsTable.empty();
        noHitsTable.empty();
        errorTable.empty();
        hitsData.empty();

        try {
            xhr.abort();
        } catch (e) {
        }

        if (fromDrawing) {
            layer = draw.getStore().layer;
            if (id) {
                layer = layer._layers[id];
            } else {
                setCrss(layer);
                let collection = {
                    "type": "GeometryCollection",
                    "geometries": [],
                    "properties": layer._layers[Object.keys(layer._layers)[0]].feature.properties
                }
                layer.eachLayer((l) => {
                    // We use a buffer to recreate a circle from the GeoJSON point
                    if (typeof l._mRadius !== "undefined") {
                        let buffer = l._mRadius;
                        let primitive = l.toGeoJSON();
                        primitive.type = "Feature"; // Must be there
                        // Get utm zone
                        let reader = new jsts.io.GeoJSONReader();
                        let writer = new jsts.io.GeoJSONWriter();
                        let geom = reader.read(reproject.reproject(primitive, "unproj", "proj", crss));
                        let buffer4326 = reproject.reproject(writer.write(geom.geometry.buffer(buffer)), "proj", "unproj", crss);
                        collection.geometries.push(buffer4326)
                    } else {
                        collection.geometries.push(l.toGeoJSON().geometry)
                    }
                })
                let newLayer = L.geoJSON(collection);
                layer = newLayer;
            }
        } else if (id) {
            layer = drawnItems._layers[id];
        } else {
            for (var prop in drawnItems._layers) {
                layer = drawnItems._layers[prop];
                break;
            }
        }
        if (typeof layer === "undefined") {
            return;
        }
        if (typeof layer._mRadius !== "undefined") {
            if (typeof layer._mRadius !== "undefined") {
                buffer = buffer + layer._mRadius;
            }
        }
        primitive = layer.toGeoJSON();
        if (typeof primitive.features !== "undefined") {
            primitive = primitive.features[0];
        }
        if (primitive) {
            setCrss(layer);
            primitive.type = "Feature"; // Must be there
            var reader = new jsts.io.GeoJSONReader();
            var writer = new jsts.io.GeoJSONWriter();
            var geom = reader.read(reproject.reproject(primitive, "unproj", "proj", crss));
            // buffer4326
            var buffer4326 = reproject.reproject(writer.write(geom.geometry.buffer(buffer)), "proj", "unproj", crss);

            if (buffer === 0) {
                projWktWithBuffer = Terraformer.convert(writer.write(geom.geometry));
            } else {
                projWktWithBuffer = Terraformer.convert(writer.write(geom.geometry.buffer(buffer)));
            }

            var l = L.geoJson(buffer4326, {
                "color": "#ff7800",
                "weight": 1,
                "opacity": 1,
                "fillOpacity": 0.1,
                "dashArray": '5,3'
            }).addTo(bufferItems);
            l._layers[Object.keys(l._layers)[0]]._vidi_type = "query_buffer";

            $.snackbar({
                id: "snackbar-conflict",
                content: "<span id='conflict-progress'>" + __("Waiting to start") + "....</span>",
                htmlAllowed: true,
                timeout: 1000000
            });

            var schemata = [];
            var schemataStr = urlparser.schema;

            if (typeof window.vidiConfig.schemata === "object" && window.vidiConfig.schemata.length > 0) {
                if (schemataStr !== "") {
                    schemata = schemataStr.split(",").concat(window.vidiConfig.schemata);
                } else {
                    schemata = window.vidiConfig.schemata;
                }
                schemataStr = schemata.join(",");
            }

            var projWktWithBuffer;
            if (buffer === 0) {
                projWktWithBuffer = Terraformer.convert(writer.write(geom.geometry));
            } else {
                projWktWithBuffer = Terraformer.convert(writer.write(geom.geometry.buffer(buffer)));
            }
            preProcessor({
                "projWktWithBuffer": projWktWithBuffer
            }).then(function () {
                xhr = $.ajax({
                    method: "POST",
                    url: "/api/extension/conflictSearch",
                    data: "db=" + db + "&schema=" + (searchLoadedLayers ? schemataStr : "") + (searchStr !== "" ? "," + searchStr : "") + "&socketId=" + socketId.get() + "&layers=" + visibleLayers.join(",") + "&buffer=" + bufferValue + "&text=" + currentFromText + "&wkt=" + Terraformer.convert(buffer4326),
                    scriptCharset: "utf-8",
                    success: _self.handleResult,
                    error: function () {
                        $("#snackbar-conflict").snackbar("hide");
                    }
                })
            })
        }
    },
    recreateDrawings: (parr, l) => {
        let GeoJsonAdded = false;
        let v = parr;

        if (parr.length === 1) {
            $.each(v[0].geojson.features, function (n, m) {
                // If polyline or polygon
                // ======================
                if (m.type === "Feature" && GeoJsonAdded === false) {
                    var json = L.geoJson(m, {
                        style: function (f) {
                            return f.style;
                        }
                    });

                    var g = json._layers[Object.keys(json._layers)[0]];

                    // Adding vidi-specific properties
                    g._vidi_type = m._vidi_type;

                    l.addLayer(g);
                }

                // If circle
                // =========
                if (m.type === "Circle") {
                    g = L.circle(m._latlng, m._mRadius, m.style);
                    g.feature = m.feature;

                    // Adding vidi-specific properties
                    g._vidi_type = m._vidi_type;

                    l.addLayer(g);
                }

                // If rectangle
                // ============
                if (m.type === "Rectangle") {
                    g = L.rectangle([m._latlngs[0], m._latlngs[2]], m.style);
                    g.feature = m.feature;

                    // Adding vidi-specific properties
                    g._vidi_type = m._vidi_type;

                    l.addLayer(g);
                }

                // If circle marker
                // ================
                if (m.type === "CircleMarker") {
                    g = L.circleMarker(m._latlng, m.options);
                    g.feature = m.feature;

                    // Add label
                    if (m._vidi_marker_text) {
                        g.bindTooltip(m._vidi_marker_text, {permanent: true}).on("click", () => {
                        }).openTooltip();
                    }

                    // Adding vidi-specific properties
                    g._vidi_marker = true;
                    g._vidi_type = m._vidi_type;
                    g._vidi_marker_text = m._vidi_marker_text;

                    l.addLayer(g);
                }

                // If marker
                // =========
                if (m.type === "Marker") {
                    g = L.marker(m._latlng, m.style);
                    g.feature = m.feature;

                    // Add label
                    if (m._vidi_marker_text) {
                        g.bindTooltip(m._vidi_marker_text, {permanent: true}).on("click", function () {
                        }).openTooltip();
                    }

                    // Adding vidi-specific properties
                    g._vidi_marker = true;
                    g._vidi_type = m._vidi_type;
                    g._vidi_marker_text = null;

                    l.addLayer(g);
                }
            });
        }
    },
    handleResult: function (response) {
        visibleLayers = cloud.getAllTypesOfVisibleLayers().split(";"); // Must be set here also, if result is coming from state
        var hitsCount = 0, noHitsCount = 0, errorCount = 0, resultOrigin, groups = [];
        _result = response;
        setTimeout(function () {
            $("#snackbar-conflict").snackbar("hide");
        }, 200);
        $("#spinner span").hide();
        $("#result-origin").html(response.text);
        $('#conflict-main-tabs a[href="#conflict-result-content"]').tab('show');
        $('#conflict-result-content a[href="#hits-content"]').tab('show');
        $('#conflict-result .btn:first-child').attr("href", "/html?id=" + response.file)
        $("#conflict-download-pdf").prop("download", `Søgning foretaget med ${response.text} d. ${response.dateTime}`);

        if ('bufferItems' in response) {
            this.recreateDrawings(JSON.parse(response.bufferItems), bufferItems);
        }
        if ('drawnItems' in response) {
            this.recreateDrawings(JSON.parse(response.drawnItems), drawnItems);
        }

        resultOrigin = response.text || "Na";

        $.each(response.hits, function (i, v) {
            v.meta.layergroup = v.meta.layergroup != null ? v.meta.layergroup : "Ungrouped";
            groups.push(v.meta.layergroup);
        });
        groups = array_unique(groups.reverse());
        for (let i = 0; i < groups.length; ++i) {
            let row = "<tr><td><h4 style='font-weight: 400'>" + groups[i] + "</h4></td><td></td><td></td></tr>";
            hitsTable.append(row);
            let count = 0;
            $.each(response.hits, function (u, v) {
                if (v.hits > 0) {
                    let metaData = v.meta;
                    if (metaData.layergroup === groups[i]) {
                        count++;
                        let title = (typeof metaData.f_table_title !== "undefined" && metaData.f_table_title !== "" && metaData.f_table_title !== null) ? metaData.f_table_title : u;
                        row = "<tr><td>" + title + "</td><td>" + v.hits + "</td><td><div class='checkbox'><label><input type='checkbox' data-gc2-id='" + u + "' " + ($.inArray(u, visibleLayers) > -1 ? "checked" : "") + "></label></div></td></tr>";
                        hitsTable.append(row);
                    }
                }
            });
            // Remove empty groups
            if (count === 0) {
                hitsTable.find("tr").last().remove();
            }
        }

        for (let u = 0; u < groups.length; ++u) {
            let row = "<h4 style='font-weight: 400'>" + groups[u] + "</h4><hr style='margin-top: 2px; border-top: 1px solid #aaa'>";
            hitsData.append(row);
            let count = 0;
            $.each(response.hits, function (i, v) {
                var table = i, table1, table2, tr, td, title, metaData = v.meta;
                if (metaData.layergroup === groups[u]) {
                    title = (typeof metaData.f_table_title !== "undefined" && metaData.f_table_title !== "" && metaData.f_table_title !== null) ? metaData.f_table_title : table;
                    if (v.error === null) {
                        if (metaData.meta_url) {
                            title = "<a target='_blank' href='" + metaData.meta_url + "'>" + title + "</a>";
                        }
                        row = "<tr><td>" + title + "</td><td>" + v.hits + "</td><td><div class='checkbox'><label><input type='checkbox' data-gc2-id='" + i + "' " + ($.inArray(i, visibleLayers) > -1 ? "checked" : "") + "></label></div></td></tr>";
                        if (v.hits > 0) {
                            count++;
                            hitsCount++;
                            table1 = $("<table class='table table-data'/>");
                            hitsData.append("<h5>" + title + " (" + v.hits + ")<div class='checkbox' style='float: right; margin-top: 25px'><label><input type='checkbox' data-gc2-id='" + i + "' " + ($.inArray(i, visibleLayers) > -1 ? "checked" : "") + "></label></div></h5>");
                            let conflictForLayer = metaData.meta !== null ? JSON.parse(metaData.meta) : null;
                            if (conflictForLayer !== null && 'short_conflict_meta_desc' in conflictForLayer) {
                                hitsData.append("<p style='margin: 0'>" + conflictForLayer.short_conflict_meta_desc + "</p>");
                            }
                            if (conflictForLayer !== null && 'long_conflict_meta_desc' in conflictForLayer && conflictForLayer.long_conflict_meta_desc !== '') {
                                $(`<i style="cursor: pointer; color: #999999">Lagbeskrivelse - klik her</i>`).appendTo(hitsData).on("click", function () {
                                    let me = this;
                                    if ($(me).next().children().length === 0) {
                                        $(me).next().html(`<div class="alert alert-dismissible alert-info" role="alert" style="background-color: #d4d4d4; color: #333; padding: 7px 30px 7px 7px">
                                                                            <button type="button" class="close" data-dismiss="alert">×</button>${conflictForLayer.long_conflict_meta_desc}
                                                                        </div>`);
                                    } else {
                                        $(me).next().find(".alert").alert('close');
                                    }
                                });
                                $(`<div></div>`).appendTo(hitsData);
                            }
                            if (v.data.length > 0) {
                                $.each(v.data, function (u, row) {
                                    var key = null, fid = null;
                                    tr = $("<tr style='border-top: 0px solid #eee'/>");
                                    td = $("<td/>");
                                    table2 = $("<table style='margin-bottom: 5px; margin-top: 5px;' class='table'/>");
                                    row.sort((a, b) => (a.sort_id > b.sort_id) ? 1 : ((b.sort_id > a.sort_id) ? -1 : 0));
                                    $.each(row, function (n, field) {
                                        if (!field.key) {
                                            if (!field.link) {
                                                table2.append("<tr><td class='conflict-heading-cell' '>" + field.alias + "</td><td class='conflict-value-cell'>" + (field.value !== null ? field.value : "&nbsp;") + "</td></tr>");
                                            } else {
                                                let link = "&nbsp;";
                                                if (field.value && field !== "") {
                                                    link = "<a target='_blank' rel='noopener' href='" + (field.linkprefix ? field.linkprefix : "") + field.value + "'>Link</a>"
                                                }
                                                table2.append("<tr><td class='conflict-heading-cell'>" + field.alias + "</td><td class='conflict-value-cell'>" + link + "</td></tr>")
                                            }
                                        } else {
                                            key = field.name;
                                            fid = field.value;
                                        }
                                    });
                                    td.append(table2);
                                    tr.append("<td style='width: 60px'><button type='button' class='btn btn-default btn-xs zoom-to-feature' data-gc2-sf-table='" + i + "' data-gc2-sf-key='" + key + "' data-gc2-sf-fid='" + fid + "'>#" + (u + 1) + " <i class='fa fa-search'></i></button></td>");
                                    tr.append(td);
                                    table1.append(tr);
                                });
                            }
                            hitsData.append(table1);
                        } else {
                            noHitsTable.append(row);
                            noHitsCount++;
                        }
                    } else {
                        row = "<tr><td>" + title + "</td><td>" + v.error + "</td></tr>";
                        errorTable.append(row);
                        errorCount++;
                    }
                    $('#conflict-result-content a[href="#hits-content"] span').html(" (" + hitsCount + ")");
                    $('#conflict-result-content a[href="#nohits-content"] span').html(" (" + noHitsCount + ")");
                    $('#conflict-result-content a[href="#error-content"] span').html(" (" + errorCount + ")");
                    $('#conflict-result-origin').html(`Søgning foretaget med: <b>${resultOrigin}</b>`);
                }

            });

            // Remove empty groups
            if (count === 0) {
                hitsData.find("h4").last().remove();
                hitsData.find("hr").last().remove();
            }

        }
        $(".zoom-to-feature").click(function (e) {
            _zoomToFeature($(this).data('gc2-sf-table'), $(this).data('gc2-sf-key'), $(this).data('gc2-sf-fid'));
            e.stopPropagation();
        });

        backboneEvents.get().trigger("end:conflictSearch", {
            "projWktWithBuffer": projWktWithBuffer,
            "file": response.file
        });

        L.geoJson(response.geom, {
            "color": "#ff7800",
            "weight": 1,
            "opacity": 0.65,
            "dashArray": '5,3'
        });
        let geomStr = response.geom;
        if (callBack) {
            callBack();
        }
    },
    addDrawing: function (layer) {
        drawnItems.addLayer(layer);
    },
    clearDrawing: function (clearOnlyBuffer = false) {
        _clearDrawItems(clearOnlyBuffer);
    },
    getResult: function () {
        let drawnItems = JSON.stringify(serializeLayers.serializeQueryDrawnItems(true));
        let bufferItems = JSON.stringify(serializeLayers.serializeQueryBufferItems(true));
        _result.drawnItems = drawnItems;
        _result.bufferItems = bufferItems;
        _result.bufferValue = parseFloat(currentBufferValue);
        return _result;
    },
    setPreProcessor: function (fn) {
        preProcessor = fn;
    },
    setSearchStr: function (str) {
        searchStr = str;
    },
    getBufferItems: function () {
        return bufferItems;
    },
    setValueForNoUiSlider: function (v) {
        bufferSlider.noUiSlider.set([v]);
    }
};

var dom = `
<div role="tabpanel">
    <div id="conflict-buffer" style="display: none">
        <div>
            <label for="conflict-buffer-value" class="control-label">Buffer</label>
            <input id="conflict-buffer-value" class="form-control">
            <div id="conflict-buffer-slider" class="slider shor"></div>
        </div>
    </div>
    <div id="conflict-places" class="places" style="margin-bottom: 20px; display: none">
        <input id="${id}" class="${id} typeahead" type="text" placeholder="Adresse eller matrikelnr.">
    </div>
    <div id="conflict-main-tabs-container" style="display: none">
        <ul class="nav nav-tabs" role="tablist" id="conflict-main-tabs">
            <li role="presentation" class="active"><a href="#conflict-result-content" aria-controls="" role="tab" data-toggle="tab">Resultat</a></li>
            <li role="presentation"><a href="#conflict-info-content" aria-controls="" role="tab" data-toggle="tab">Info</a></li>
            <li role="presentation"><a href="#conflict-log-content" aria-controls="" role="tab" data-toggle="tab">Log</a></li>
        </ul>
        <!-- Tab panes -->
        <div class="tab-content" style="display: none">
            <div role="tabpanel" class="tab-pane active" id="conflict-result-content">
                <div id="conflict-result">
                    <div><span id="conflict-result-origin"></span></div>

                    <div class="btn-toolbar bs-component" style="margin: 0;">
                        <div class="btn-group">
                            <button disabled class="btn btn-raised" id="conflict-print-btn" data-loading-text="<i class='fa fa-cog fa-spin fa-lg'></i> PDF rapport"><i class='fa fa-cog fa-lg'></i> Print rapport</button>
                        </div>
                        <div class="btn-group">
                            <button disabled class="btn btn-raised" id="conflict-set-print-area-btn"><i class='fas fa-expand'></i></button>
                        </div>
                        <fieldset disabled id="conflict-get-print-fieldset">
                            <div class="btn-group">
                                <a target="_blank" href="javascript:void(0)" class="btn btn-primary btn-raised" id="conflict-open-pdf">Åben PDF</a>
                                <a href="bootstrap-elements.html" class="btn btn-primary btn-raised dropdown-toggle" data-toggle="dropdown"><span class="caret"></span></a>
                                <ul class="dropdown-menu">
                                    <li><a href="javascript:void(0)" id="conflict-download-pdf">Download PDF</a></li>
                                </ul>
                            </div>
                        </fieldset>
                    </div>

                    <div role="tabpanel">
                        <!-- Nav tabs -->
                        <ul class="nav nav-tabs" role="tablist">
                            <li role="presentation" class="active"><a href="#hits-content" aria-controls="hits-content" role="tab" data-toggle="tab">Med konflikter<span></span></a></li>
                            <li role="presentation"><a href="#hits-data-content" aria-controls="hits-data-content" role="tab" data-toggle="tab">Data fra konflikter<span></span></a></li>
                            <li role="presentation"><a href="#nohits-content" aria-controls="nohits-content" role="tab" data-toggle="tab">Uden konflikter<span></span></a></li>
                            <li role="presentation"><a href="#error-content" aria-controls="error-content" role="tab" data-toggle="tab">Fejl<span></span></a></li>
                        </ul>
                        <div class="tab-content">
                            <div role="tabpanel" class="tab-pane active conflict-result-content" id="hits-content">
                                <div id="hits">
                                    <table class="table table-hover">
                                        <tbody></tbody>
                                    </table>
                                </div>
                            </div>
                            <div role="tabpanel" class="tab-pane conflict-result-content" id="hits-data-content">
                                <div id="hits-data"></div>
                            </div>
                            <div role="tabpanel" class="tab-pane conflict-result-content" id="nohits-content">
                                <div id="nohits">
                                    <table class="table table-hover">
                                        <tbody></tbody>
                                    </table>
                                </div>
                            </div>
                            <div role="tabpanel" class="tab-pane conflict-result-content" id="error-content">
                                <div id="error">
                                    <table class="table table-hover">
                                        <tbody></tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div role="tabpanel" class="tab-pane" id="conflict-info-content">
                <div id="conflict-info-box">
                    <div id="conflict-modal-info-body">
                        <ul class="nav nav-tabs" id="conflict-info-tab"></ul>
                        <div class="tab-content" id="conflict-info-pane"></div>
                    </div>
                </div>
            </div>
            <div role="tabpanel" class="tab-pane" id="conflict-log-content">
                <textarea style="width: 100%" rows="8" id="conflict-console"></textarea>
            </div>
        </div>
    </div>
</div>
`;

