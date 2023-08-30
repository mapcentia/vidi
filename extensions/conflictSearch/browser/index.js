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
 * @type {string}
 */
var db = urlparser.db;

/**
 * @type {*|exports|module.exports}
 */
var io = require('socket.io-client');

/**
 *
 * @type {Element}
 */
var sliderEl;

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

var debounce = require('lodash/debounce');

var _result = {};

import {buffer as turfBuffer, dissolve as turDissolve} from '@turf/turf'

const wicket = require('wicket');
const TOAST_ID = "conflict-toast";

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

let getPlaceStore;
let fromVarsIsDone = false;

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
        utils.createMainTab("conflict", "Konfliktsøgning", "Lav en konfliktsøgning ned igennem alle lag. Der kan søges med en adresse/matrikelnr., en tegning eller et objekt fra et lag. Det sidste gøres ved at klikke på et objekt i et tændt lag og derefter på \'Søg med dette objekt\'", require('./../../../browser/modules/height')().max, "bi-check2-square", false, "conflictSearch");
        $("#conflict").append(dom);
        $("body").append(`
            <div class="toast-container bottom-0 end-0 p-3 me-5">
            <div id="${TOAST_ID}" class="toast align-items-center text-bg-primary border-0" role="alert" aria-live="assertive"
                 aria-atomic="true">
                <div class="d-flex">
                    <div class="toast-body" id="conflict-toast-body"></div>
                </div>
            </div>
            </div>
        `)

        // DOM created
        $('#searchclear2').on('click', function () {
            backboneEvents.get().trigger('clear:search');
        });
        // Init search with custom callback
        getPlaceStore = search.init(function () {
            _clearDrawItems();
            _clearDataItems();
            this.layer._layers[Object.keys(this.layer._layers)[0]]._vidi_type = "query_draw"; // Tag it, so it serialized
            drawnItems.addLayer(this.layer._layers[Object.keys(this.layer._layers)[0]]);
            cloud.zoomToExtentOfgeoJsonStore(this, 17);
            me.makeSearch($(".custom-search-conflict")[1].value);
        }, ".custom-search-conflict", false, getProperty);


        sliderEl = $('#conflict-buffer-slider');
        bufferValue = document.getElementById('conflict-buffer-value');
        if (bufferValue) {
            bufferValue.value = currentBufferValue = startBuffer;
        }
        sliderEl.append(`<div class="range"">
                                            <input type="range"  min="-5" max="500" value="${startBuffer}" class="js-info-buffer-slider form-range">
                                            </div>`);
        let slider = sliderEl.find('.js-info-buffer-slider');
        slider.on('input change', debounce(function (values) {
            bufferValue.value = parseFloat(values.target.value);
            currentBufferValue = bufferValue.value;
            if (typeof bufferItems._layers[Object.keys(bufferItems._layers)[0]] !== "undefined" && typeof bufferItems._layers[Object.keys(bufferItems._layers)[0]]._leaflet_id !== "undefined") {
                bufferItems.clearLayers();
                me.makeSearch()
            }
        }, 300));
        // When the input changes, set the slider value
        if (bufferValue) {
            bufferValue.addEventListener('change', function () {
                slider.val(this.value);
                slider.trigger('change');
            });
        }
        backboneEvents.get().on("ready:meta", function () {
            metaData = meta.getMetaData();
        })
    },

    /**
     * Handle for GUI toggle button
     */
    control: function () {
        let me = this;
        hitsTable = $("#hits-content tbody");
        hitsData = $("#hits-data");
        noHitsTable = $("#nohits-content tbody");
        errorTable = $("#error-content tbody");
        let c = 0;
        backboneEvents.get().on("end:conflictSearch", () => {
            c = 0;
        })
        // Start listen to the web socket
        io.connect().on(socketId.get(), function (data) {
            if (typeof data.num !== "undefined") {
                $("#conflict-progress").html(data.num);
                if (data.error === null) {
                    $("#conflict-console").append("table: " + data.table + ", hits: " + data.hits + " , time: " + data.time + "\n");
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
                marker: true,
                circlemarker: false
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

        if (urlparser.urlVars?.var_landsejerlavskode && urlparser.urlVars?.var_matrikelnr) {
            setTimeout(() => {
                if (!fromVarsIsDone) {
                    let placeStore = getPlaceStore();
                    placeStore.db = search.getMDB();
                    placeStore.host = search.getMHOST();
                    placeStore.sql = `SELECT sfe_ejendomsnummer,
                                             ST_Multi(ST_Union(the_geom)),
                                             ST_asgeojson(ST_transform(ST_Multi(ST_Union(the_geom)), 4326)) as geojson
                                      FROM matrikel.jordstykke
                                      WHERE sfe_ejendomsnummer = (SELECT sfe_ejendomsnummer
                                                                  FROM matrikel.jordstykke
                                                                  WHERE landsejerlavskode = ${urlparser.urlVars.var_landsejerlavskode}
                                                                    AND matrikelnummer = '${urlparser.urlVars.var_matrikelnr.toLowerCase()}')
                                      group by sfe_ejendomsnummer`;
                    placeStore.load();
                    fromVarsIsDone = true;
                }
            }, 200);
        } else {
            fromVarsIsDone = true;
        }

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
     * @param fromDrawing
     */
    makeSearch: function (text, callBack, id = null, fromDrawing = false) {
        var primitive, coord,
            layer, buffer = parseFloat($("#conflict-buffer-value").val()), bufferValue = buffer,
            hitsTable = $("#hits-content tbody"),
            noHitsTable = $("#nohits-content tbody"),
            errorTable = $("#error-content tbody"),
            hitsData = $("#hits-data"),
            row, fileId, searchFinish, geomStr,
            visibleLayers = cloud.getAllTypesOfVisibleLayers().split(";");

        let _self = this;
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
                let collection = {
                    "type": "GeometryCollection",
                    "geometries": [],
                    "properties": layer._layers[Object.keys(layer._layers)[0]].feature.properties
                }
                layer.eachLayer((l) => {
                    // We use a buffer to recreate a circle from the GeoJSON point
                    if (typeof l._mRadius !== "undefined") {
                        let buffer = l._mRadius;
                        let primitive = l.toGeoJSON(GEOJSON_PRECISION).geometry;
                        const bufferPolygon = turfBuffer(primitive, buffer, {units: 'meters'}).geometry;
                        collection.geometries.push(bufferPolygon)
                    } else {
                        let primitive = l.toGeoJSON(GEOJSON_PRECISION).geometry;
                        collection.geometries.push(primitive);
                    }
                })
                layer = L.geoJSON(collection);
            }
        } else if (id) {
            layer = drawnItems._layers[id];
        } else {
            for (var prop in drawnItems._layers) {
                layer = drawnItems._layers[prop];
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
        primitive = layer.toGeoJSON(GEOJSON_PRECISION);
        if (typeof primitive.features !== "undefined") {
            primitive = primitive.features[0];
        }
        if (primitive) {
            let geom;
            if (primitive.geometry.type === 'GeometryCollection') {
                geom = turDissolve(turfBuffer(primitive.geometry, buffer, {units: 'meters'})).features[0];
            } else {
                geom = turfBuffer(primitive.geometry, buffer, {units: 'meters'});
            }
            var l = L.geoJson(geom, {
                "color": "#ff7800",
                "weight": 1,
                "opacity": 1,
                "fillOpacity": 0.1,
                "dashArray": '5,3'
            }).addTo(bufferItems);
            l._layers[Object.keys(l._layers)[0]]._vidi_type = "query_buffer";

            utils.showInfoToast("<span id='conflict-progress'>" + __("Waiting to start") + "....</span>", {autohide: false}, TOAST_ID);

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
            preProcessor({
                // "projWktWithBuffer": projWktWithBuffer
            }).then(function () {
                xhr = $.ajax({
                    method: "POST",
                    url: "/api/extension/conflictSearch",
                    data: "db=" + db + "&schema=" + (searchLoadedLayers ? schemataStr : "") + (searchStr !== "" ? "," + searchStr : "") + "&socketId=" + socketId.get() + "&layers=" + visibleLayers.join(",") + "&buffer=" + bufferValue + "&text=" + currentFromText + "&wkt=" + new wicket.Wkt().read(JSON.stringify(geom.geometry)).write(),
                    scriptCharset: "utf-8",
                    success: _self.handleResult,
                    error: function () {
                        utils.hideInfoToast(TOAST_ID);
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
        let hitsCount = 0, noHitsCount = 0, errorCount = 0, resultOrigin, groups = [];
        _result = response;
        setTimeout(function () {
            utils.hideInfoToast(TOAST_ID);
        }, 200);
        $("#spinner span").hide();
        $("#result-origin").html(response.text);
        $('#conflict-main-tabs a[href="#conflict-result-content"]').tab('show');
        if (window.vidiConfig.template === "conflict.tmpl") {
            $('#conflict-result-content a[href="#hits-data-content"]').tab('show');
        } else {
            $('#conflict-result-content a[href="#hits-content"]').tab('show');
        }
        $('#conflict-open-pdf').attr("href", "/html?id=" + response.file)
        $("#conflict-download-pdf").prop("download", `Søgning foretaget med ${response.text} d. ${response.dateTime}.pdf`);

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
                        row = "<tr><td>" + v.title + "</td><td>" + v.hits + "</td><td><div class='form-check form-switch text-end'><label class='form-check-label'><input class='form-check-input' type='checkbox' data-gc2-id='" + v.table + "' " + ($.inArray(v.table, visibleLayers) > -1 ? "checked" : "") + "></label></div></td></tr>";
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
                let table = v.table, table1, table2, tr, td, title, metaData = v.meta;
                if (metaData.layergroup === groups[u]) {
                    title = (typeof metaData.f_table_title !== "undefined" && metaData.f_table_title !== "" && metaData.f_table_title !== null) ? metaData.f_table_title : table;
                    if (v.error === null) {
                        if (metaData.meta_url) {
                            title = "<a target='_blank' href='" + metaData.meta_url + "'>" + title + "</a>";
                        }
                        row = "<tr><td>" + title + "</td><td>" + v.hits + "</td><td><div class='form-check form-switch text-end'><label class='form-check-label'><input class='form-check-input' type='checkbox' data-gc2-id='" + table + "' " + ($.inArray(i, visibleLayers) > -1 ? "checked" : "") + "></label></div></td></tr>";
                        if (v.hits > 0) {
                            count++;
                            hitsCount++;
                            table1 = $("<table class='table table-data'/>");
                            hitsData.append("<h5>" + title + " (" + v.hits + ")<div class='form-check form-switch text-end float-end'><label class='form-check-label'><input class='form-check-input' type='checkbox' data-gc2-id='" + table + "' " + ($.inArray(i, visibleLayers) > -1 ? "checked" : "") + "></label></div></h5>");
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
                                    let key = null, fid = null;
                                    tr = $("<tr style='border-top: 0 solid #eee'/>");
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
                                    tr.append("<td style='width: 60px'><button type='button' class='btn btn-light btn-sm zoom-to-feature' data-gc2-sf-table='" + v.table + "' data-gc2-sf-key='" + key + "' data-gc2-sf-fid='" + fid + "'>#" + (u + 1) + " <i class='bi bi-search'></i></button></td>");
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
                    $('#conflict-result-content a[href="#hits-data-content"] span').html(" (" + hitsCount + ")");
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
            // "projWktWithBuffer": projWktWithBuffer,
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
    setValueForSlider: function (v) {
        let slider = sliderEl.find('.js-info-buffer-slider');
        slider.val(v);
        bufferValue.value = v;
    },
    getFromVarsIsDone: function () {
        return fromVarsIsDone;
    },
    TOAST_ID
};

let dom = `
<div role="tabpanel">
    <div class="d-flex flex-column gap-4 mb-4">
        <div id="conflict-places" class="places" style="display: none">
            <div class="input-group mb-3">
                <input class="typeahead form-control custom-search-conflict" type="text" placeholder="Adresse eller matrikelnr.">
                <button class="btn btn-outline-secondary searchclear" type="button">
                    <i class="bi bi-x-lg"></i>
                </button>
            </div>
        </div>
        <div id="conflict-buffer" style="display: none">
            <div>
                <label for="conflict-buffer-value" class="control-label">Buffer</label>
                <input id="conflict-buffer-value" class="form-control">
                <div id="conflict-buffer-slider"></div>
            </div>
        </div>
    </div>
    <div id="conflict-main-tabs-container" style="display: none">
        <ul class="nav nav-pills nav-fill" role="tablist" id="conflict-main-tabs">
            <li role="presentation" class="nav-item"><a class="nav-link active" href="#conflict-result-content" aria-controls="" role="tab" data-bs-toggle="tab">Resultat</a></li>
            <li role="presentation" class="nav-item"><a class="nav-link" href="#conflict-info-content" aria-controls="" role="tab" data-bs-toggle="tab">Info</a></li>
            <li role="presentation" class="nav-item"><a class="nav-link" href="#conflict-log-content" aria-controls="" role="tab" data-bs-toggle="tab">Log</a></li>
        </ul>
        <!-- Tab panes -->
        <div class="tab-content" style="display: none">
            <div role="tabpanel" class="tab-pane active" id="conflict-result-content">
                <div id="conflict-result" class="d-flex flex-column gap-4">
                    <div class="d-flex flex-column gap-4">
                        <span id="conflict-result-origin" class="mt-2"></span>
                        <span class="btn-group">
                            <input class="btn-check" type="radio" name="conflict-report-type" id="conflict-report-type-1" value="1" checked>
                            <label for="conflict-report-type-1" class="btn btn-sm btn-outline-secondary">
                                Kompakt
                            </label>
                            <input class="btn-check" type="radio" name="conflict-report-type" id="conflict-report-type-2" value="2">
                            <label for="conflict-report-type-2" class="btn btn-sm btn-outline-secondary">
                                Lang, kun hits
                            </label>
                            <input class="btn-check" type="radio" name="conflict-report-type" id="conflict-report-type-3" value="3">
                            <label for="conflict-report-type-3" class="btn btn-sm btn-outline-secondary">
                                Lang, alle
                            </label>
                        </span>
                        <div class="d-flex gap-2 justify-content-start">
                            <button disabled class="btn btn-sm btn-outline-success start-print-btn" id="conflict-print-btn">
                                <span class="spinner-border spinner-border-sm"
                                          role="status" aria-hidden="true" style="display: none">
                                </span> Print rapport
                            </button>
                            <button disabled class="btn btn-sm btn-light" id="conflict-set-print-area-btn"><i class='bi bi-fullscreen'></i></button>
                            <fieldset disabled id="conflict-get-print-fieldset">
                                <div class="input-group">
                                    <a target="_blank" href="javascript:void(0)" class="btn btn-sm btn-outline-success" id="conflict-open-pdf">Åben PDF</a>
                                    <a href="javascript:void(0)"
                                       class="btn btn-outline-success btn-sm dropdown-toggle"
                                       data-bs-toggle="dropdown"
                                       id="conflict-open-pdf"
                                    ></a>
                                    <ul class="dropdown-menu get-print-btn">
                                        <li><a class="dropdown-item" href="javascript:void(0)"
                                               id="conflict-download-pdf">Download</a></li>
                                    </ul>
                                </div>
                            </fieldset>
                            <a href="" target="_blank" class="btn btn-sm btn-outline-secondary" id="conflict-excel-btn">Excel</a>
                        </div>
                    </div>

                    <div role="tabpanel">
                        <!-- Nav tabs -->
                        <ul class="nav nav-pills nav-fill" role="tablist">
                            <li role="presentation" class="active nav-item"><a class="nav-link" href="#hits-content" aria-controls="hits-content" role="tab" data-bs-toggle="tab">Med konflikter<span></span></a></li>
                            <li role="presentation" class="nav-item"><a class="nav-link" href="#hits-data-content" aria-controls="hits-data-content" role="tab" data-bs-toggle="tab">Data fra konflikter<span></span></a></li>
                            <li role="presentation" class="nav-item"><a class="nav-link" href="#nohits-content" aria-controls="nohits-content" role="tab" data-bs-toggle="tab">Uden konflikter<span></span></a></li>
                            <li role="presentation" class="nav-item"><a class="nav-link" href="#error-content" aria-controls="error-content" role="tab" data-bs-toggle="tab">Fejl<span></span></a></li>
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
            <div class="d-grid gap-2 mt-2 mb-2">
                <button style="display: none" class="btn btn-outline-secondary btn-block" id="conflict-search-with-feature">Søg med valgte</button>
            </div>
            <div id="conflict-info-box">
                <div id="conflict-modal-info-body">
                    <ul class="nav nav-tabs" id="conflict-info-tab"></ul>
                    <div class="tab-content" id="conflict-info-pane"></div>
                </div>
            </div>
            </div>
            <div role="tabpanel" class="tab-pane" id="conflict-log-content">
                <textarea class="mt-2 w-100 form-control" rows="8" id="conflict-console"></textarea>
            </div>
        </div>
    </div>
</div>
`;

