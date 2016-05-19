(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = {
    dict: {
        /* Start of viewer and widget */
        "Meters": "Meter",
        "Buffer": "Buffer",
        "Search": "Søg",
        "Result": "Resultat",
        "Info": "Info",
        "Layers": "Lag",
        "Legend": "Signatur",
        "Help": "Hjælp",
        "Log": "Log",
        "Address": "Adresse eller matrikelnr.",
        "With conflicts": "Med konflikter",
        "Data from conflicts": "Data fra konflikter",
        "Without conflicts": "Uden konflikter",
        "Errors": "Fejl",
        "Layer": "Lag",
        "Number of objects": "Antal objekter",
        "Show": "Vis",
        "Severity": "Alvorlighed",
        "Info text": "Når du klikker på et tændt lag, vises resultatet har. Du kan derefter søge med objektet.",
        "Baselayers": "Baggrund",
        "Print report": "Print rapport",
        "Search with this object": "Søg med dette objekt",
        "From drawing": "Fra tegning",
        "From object in layer": "Fra objekt i lag",
        "Clear map": "Ryd kortet",
        // Drawing
        "Cancel drawing": " Afbryd tegning",
        "Cancel": "Afbryd",
        "Delete last point drawn": "Slet sidste punkt tegnet.",
        "Delete last point": "Slet sidste punkt",
        "Search with a line": "Søg med en linje",
        "Search with an area": "Søg med en flade",
        "Search with a rectangle": "Søg med rektangel",
        "Search with a circle": "Søg med en cirkel",
        "Search with a point": "Søg med et punkt",
        "Click and drag to draw circle.": "Klik og træk for at slå cirkel.",
        "Radius": "Radius",
        "Click map to place marker.": "Klik på kort at sætte punkt.",
        "Click to start drawing shape.": "Klik for at starte flade.",
        "Click to continue drawing shape.": "Klik for at fortsætte tegning.",
        "Click first point to close this shape.": "Klik på første punkt for at afslutte.",
        "<strong>Error:</strong> shape edges cannot cross!": "<strong>Fejl:</strong> fladens kanter må ikke krydse!",
        "Click to start drawing line.": "Klik for at starte linje.",
        "Click to continue drawing line.": "Klik for at fortsætte tegning.",
        "Click last point to finish line.": "Klik på sidste punkt for at afslutte.",
        "Click and drag to draw rectangle.": "Klik og  træk for et tegne rektangel.",
        "Release mouse to finish drawing.": "Slip mus for at afslutte.",
        "Save changes.": "Gem ændringer.",
        "Save": "Gem",
        "Cancel editing, discards all changes.": "Afbryd tegning, smid alle ændringer ud.",
        "Edit drawings.": "Ændre tegning.",
        "No drawings to edit.": "Ingen tegning at ændre.",
        "Delete drawings.": "Slet tegning.",
        "No drawings to delete.": "Ingen tegning at slette.",
        "Drag handles, or marker to edit drawing.": "Træk håndtag, eller markør for at ændre tegning.",
        "Click cancel to undo changes.": "Klik afbryd for at omgøre ændring.",
        "Click on a drawing to remove": " Klik tegning for at slette.",
        // Report
        "Get as PDF": "Hent som PDF",
        "Conflicts": "Konflikter",
        "No Conflicts": "Ingen konflikter"
    }
};
},{}],2:[function(require,module,exports){
window.gc2i18n = require('./i18n/da_DK');
window.Vidi = function () {
    "use strict";

    // Declare vars
    var init, switchLayer, setBaseLayer, meta, setting, addLegend, autocomplete, hostname, nodeHostname, cloud, db, schema, hash, osm,
        qstore = [], anchor, drawLayer, drawControl, zoomControl, metaDataKeys = [], metaDataKeysTitle = [],
        awesomeMarker, metaDataReady = false, settingsReady = false, makeConflict, socketId,
        drawing = false, searchFinish, zoomToFeature, fileId, geomStr, urlVars, config;

    // Set vars
    socketId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });

    config = require('../config/config.js');

    // Require modules
    var modules = {
        cloud: require('./modules/cloud'),
        init: require('./modules/init'),
        switchLayer: require('./modules/switchLayer'),
        setBaseLayer: require('./modules/setBaseLayer'),
        meta: require('./modules/gc2/meta'),
        setting: require('./modules/gc2/setting'),
        baseLayer: require('./modules/baseLayer'),
        legend: require('./modules/gc2/legend'),
        state: require('./modules/state'),
        anchor: require('./modules/anchor'),
        infoClick: require('./modules/infoClick'),
        search: require('./modules/search/danish')

    };

    // Use setters in modules so they can interact
    modules.init.set(modules);
    modules.meta.set(modules);
    modules.switchLayer.set(modules);
    modules.setBaseLayer.set(modules);
    modules.baseLayer.set(modules);
    modules.legend.set(modules);
    modules.state.set(modules);
    modules.anchor.set(modules);
    modules.infoClick.set(modules);
    modules.search.set(modules);

    L.drawLocal = require('./modules/drawLocal');


    return {
        init: modules.init
    }
};

},{"../config/config.js":17,"./i18n/da_DK":1,"./modules/anchor":3,"./modules/baseLayer":4,"./modules/cloud":5,"./modules/drawLocal":6,"./modules/gc2/legend":7,"./modules/gc2/meta":8,"./modules/gc2/setting":9,"./modules/infoClick":10,"./modules/init":11,"./modules/search/danish":12,"./modules/setBaseLayer":13,"./modules/state":14,"./modules/switchLayer":15}],3:[function(require,module,exports){
var urlparser = require('./urlparser');
var urlVars = urlparser.urlVars;
var db = urlparser.db;
var schema = urlparser.schema;
var cloud;
var anchor = function () {
    var p = geocloud.transformPoint(cloud.getCenter().x, cloud.getCenter().y, "EPSG:900913", "EPSG:4326");
    return "#" + cloud.getBaseLayerName() + "/" + Math.round(cloud.getZoom()).toString() + "/" + (Math.round(p.x * 10000) / 10000).toString() + "/" + (Math.round(p.y * 10000) / 10000).toString() + "/" + ((cloud.getNamesOfVisibleLayers()) ? cloud.getNamesOfVisibleLayers().split(",").reverse().join(",") : "");
};
module.exports = {
    set: function (o) {
        cloud = o.cloud;
        return this;
    },
    init: function () {
        return "/" + db + "/" + schema + "/" + (typeof urlVars.i === "undefined" ? "" : "?i=" + urlVars.i.split("#")[0]) + anchor();
    }
};
},{"./urlparser":16}],4:[function(require,module,exports){
var cloud;
module.exports = module.exports = {
    set: function (o) {
        cloud = o.cloud;
        return this;
    },
    init: function (str) {
        if (typeof window.setBaseLayers !== 'object') {
            window.setBaseLayers = [
                {"id": "mapQuestOSM", "name": "MapQuset OSM"},
                {"id": "osm", "name": "OSM"},
                {"id": "stamenToner", "name": "Stamen toner"}
            ];
        }
        cloud.bingApiKey = window.bingApiKey;
        cloud.digitalGlobeKey = window.digitalGlobeKey;
        for (i = 0; i < window.setBaseLayers.length; i = i + 1) {
            if (typeof window.setBaseLayers[i].restrictTo === "undefined" || window.setBaseLayers[i].restrictTo.indexOf(schema) > -1) {
                cloud.addBaseLayer(window.setBaseLayers[i].id, window.setBaseLayers[i].db);
                $("#base-layer-list").append(
                    "<li class='base-layer-item list-group-item' data-gc2-base-id='" + window.setBaseLayers[i].id + "'>" + window.setBaseLayers[i].name + "<span class='fa fa-check' aria-hidden='true'></span></li>"
                );
            }
        }
    }
};
},{}],5:[function(require,module,exports){
var cloud = new geocloud.map({
    el: "map",
    zoomControl: false,
    numZoomLevels: 21
});
var zoomControl = L.control.zoom({
    position: 'topright'
});
cloud.map.addControl(zoomControl);

module.exports = cloud;
},{}],6:[function(require,module,exports){
module.exports = {
    draw: {
        toolbar: {
            actions: {
                title: __('Cancel drawing'),
                text: __('Cancel')
            },
            undo: {
                title: __('Delete last point drawn'),
                text: __('Delete last point')
            },
            buttons: {
                polyline: __('Search with a line'),
                polygon: __('Search with an area'),
                rectangle: __('Search with a rectangle'),
                circle: __('Search with a circle'),
                marker: __('Search with a point')
            }
        },
        handlers: {
            circle: {
                tooltip: {
                    start: __('Click and drag to draw circle.')
                },
                radius: __('Radius')
            },
            marker: {
                tooltip: {
                    start: __('Click map to place marker.')
                }
            },
            polygon: {
                tooltip: {
                    start: __('Click to start drawing shape.'),
                    cont: __('Click to continue drawing shape.'),
                    end: __('Click first point to close this shape.')
                }
            },
            polyline: {
                error: __('<strong>Error:</strong> shape edges cannot cross!'),
                tooltip: {
                    start: __('Click to start drawing line.'),
                    cont: __('Click to continue drawing line.'),
                    end: __('Click last point to finish line.')
                }
            },
            rectangle: {
                tooltip: {
                    start: __('Click and drag to draw rectangle.')
                }
            },
            simpleshape: {
                tooltip: {
                    end: __('Release mouse to finish drawing.')
                }
            }
        }
    },
    edit: {
        toolbar: {
            actions: {
                save: {
                    title: __('Save changes.'),
                    text: __('Save')
                },
                cancel: {
                    title: __('Cancel editing, discards all changes.'),
                    text: __('Cancel')
                }
            },
            buttons: {
                edit: __("Edit drawings."),
                editDisabled: __('No drawings to edit.'),
                remove: __('Delete drawings.'),
                removeDisabled: __('No drawings to delete.')
            }
        },
        handlers: {
            edit: {
                tooltip: {
                    text: __('Drag handles, or marker to edit drawing.'),
                    subtext: __('Click cancel to undo changes.')
                }
            },
            remove: {
                tooltip: {
                    text: __('Click on a feature to remove')
                }
            }
        }
    }
};
},{}],7:[function(require,module,exports){
var cloud;
var urlparser = require('../urlparser');
var db = urlparser.db;
module.exports = module.exports = {
    set: function (o) {
        cloud = o.cloud;
        return this;
    },
    init: function () {
        var param = 'l=' + cloud.getVisibleLayers(true) + '&db=' + db;
        $.ajax({
            url: '/legend?' + param,
            success: function (response) {
                var list = $("<ul/>"), li, classUl, title, className;
                $.each(response, function (i, v) {
                    try {
                        title = metaDataKeys[v.id.split(".")[1]].f_table_title;
                    }
                    catch (e) {
                    }
                    var u, showLayer = false;
                    if (typeof v === "object") {
                        for (u = 0; u < v.classes.length; u = u + 1) {
                            if (v.classes[u].name !== "") {
                                showLayer = true;
                            }
                        }
                        if (showLayer) {
                            li = $("<li/>");
                            classUl = $("<ul/>");
                            for (u = 0; u < v.classes.length; u = u + 1) {
                                if (v.classes[u].name !== "" || v.classes[u].name === "_gc2_wms_legend") {
                                    className = (v.classes[u].name !== "_gc2_wms_legend") ? "<span class='legend-text'>" + v.classes[u].name + "</span>" : "";
                                    classUl.append("<li><img class='legend-img' src='data:image/png;base64, " + v.classes[u].img + "' />" + className + "</li>");
                                }
                            }
                            list.append($("<li>" + title + "</li>"));
                            list.append(li.append(classUl));
                        }
                    }
                });
                $('#legend').html(list);
            }
        });
    }
};
},{"../urlparser":16}],8:[function(require,module,exports){
var urlparser = require('../urlparser');
var db = urlparser.db;
var schema = urlparser.schema;
var urlVars = urlparser.urlVars;
var metaDataKeys = [];
var metaDataKeysTitle = [];
var cloud;
var switchLayer;
var setBaseLayer;
var host = require('../../../config/config.js').gc2.host;
var ready = false;
module.exports = {
    set: function (o) {
        cloud = o.cloud;
        switchLayer = o.switchLayer;
        setBaseLayer = o.setBaseLayer;
        return this;
    },
    init: function () {
        $.ajax({
            url: '/meta?db=' + db + '&schema=' + (window.gc2Options.mergeSchemata === null ? "" : window.gc2Options.mergeSchemata.join(",") + ',') + (typeof urlVars.i === "undefined" ? "" : urlVars.i.split("#")[0] + ',') + schema,
            scriptCharset: "utf-8",
            success: function (response) {
                var base64name, authIcon, isBaseLayer, arr, groups, i, l, cv;
                groups = [];
                metaData = response;
                for (i = 0; i < metaData.data.length; i++) {
                    metaDataKeys[metaData.data[i].f_table_name] = metaData.data[i];
                    (metaData.data[i].f_table_title) ? metaDataKeysTitle[metaData.data[i].f_table_title] = metaData.data[i] : null;
                }
                for (i = 0; i < response.data.length; ++i) {
                    groups[i] = response.data[i].layergroup;
                }
                arr = array_unique(groups);
                for (var u = 0; u < response.data.length; ++u) {
                    isBaseLayer = response.data[u].baselayer ? true : false;
                    layers[[response.data[u].f_table_schema + "." + response.data[u].f_table_name]] = cloud.addTileLayers({
                        host: host,
                        layers: [response.data[u].f_table_schema + "." + response.data[u].f_table_name],
                        db: db,
                        isBaseLayer: isBaseLayer,
                        tileCached: true,
                        visibility: false,
                        wrapDateLine: false,
                        displayInLayerSwitcher: true,
                        name: response.data[u].f_table_name,
                        type: "tms"
                    });
                }
                response.data.reverse();
                for (i = 0; i < arr.length; ++i) {
                    if (arr[i]) {
                        l = [];
                        cv = ( typeof (metaDataKeysTitle[arr[i]]) === "object") ? metaDataKeysTitle[arr[i]].f_table_name : null;
                        base64name = Base64.encode(arr[i]).replace(/=/g, "");
                        $("#layers").append('<div class="panel panel-default" id="layer-panel-' + base64name + '"><div class="panel-heading" role="tab"><h4 class="panel-title"><a class="accordion-toggle" data-toggle="collapse" data-parent="#layers" href="#collapse' + base64name + '"> ' + arr[i] + ' </a></h4></div><ul class="list-group" id="group-' + base64name + '" role="tabpanel"></ul></div>');
                        $("#group-" + base64name).append('<div id="collapse' + base64name + '" class="accordion-body collapse"></div>');
                        for (u = 0; u < response.data.length; ++u) {
                            if (response.data[u].layergroup == arr[i]) {
                                var text = (response.data[u].f_table_title === null || response.data[u].f_table_title === "") ? response.data[u].f_table_name : response.data[u].f_table_title;
                                if (response.data[u].baselayer) {
                                    $("#base-layer-list").append(
                                        "<li class='base-layer-item list-group-item' data-gc2-base-id='" + response.data[u].f_table_schema + "." + response.data[u].f_table_name + "'>" + text + "<span class='fa fa-check' aria-hidden='true'></span></li>"
                                    );
                                }
                                else {
                                    $("#collapse" + base64name).append('<li class="layer-item list-group-item"><span class="checkbox"><label style="display: block;"><input style="display: none" type="checkbox" id="' + response.data[u].f_table_name + '" data-gc2-id="' + response.data[u].f_table_schema + "." + response.data[u].f_table_name + '">' + text + '<span class="fa fa-check" aria-hidden="true"></span></label></span></li>');
                                    l.push({});
                                }
                            }
                        }
                        // Remove the group if empty
                        if (l.length === 0) {
                            $("#layer-panel-" + base64name).remove();
                        }
                    }
                }
                ready = true;
                // Bind switch layer event
                $(".checkbox input[type=checkbox]").change(function (e) {
                    switchLayer.init($(this).data('gc2-id'), $(this).context.checked);
                    e.stopPropagation();
                });
                $(".base-layer-item").on("click", function (e) {
                    setBaseLayer.init($(this).data('gc2-base-id'));
                    e.stopPropagation();
                    $(".base-layer-item").css("background-color", "white");
                    $(".base-layer-item span").hide();

                    $(this).css("background-color", "#f5f5f5");
                    $(this).children("span").show();
                });
            },
            error: function (response) {
                alert(JSON.parse(response.responseText).message);
            }
        }); // Ajax call end
    },
    getMetaDataKeys: function(){
      return metaDataKeys;
    },
    ready: function(){
        return ready;
    }
};



},{"../../../config/config.js":17,"../urlparser":16}],9:[function(require,module,exports){
var urlparser = require('../urlparser');
var db = urlparser.db;
var schema = urlparser.schema;
var ready = false;
module.exports = {
    set: function () {
    },
    init: function () {
        $.ajax({
            url: '/setting?db=' + db,
            scriptCharset: "utf-8",
            success: function (response) {
                if (typeof response.data.extents === "object") {
                    var firstSchema = schema.split(",").length > 1 ? schema.split(",")[0] : schema
                    if (typeof response.data.extents[firstSchema] === "object") {
                        extent = response.data.extents[firstSchema];
                    }
                }
                ready = true;
            }
        }); // Ajax call end
    },
    ready: function(){
        return ready;
    }
};
},{"../urlparser":16}],10:[function(require,module,exports){
var urlparser = require('./urlparser');
var db = urlparser.db;
var cloud;
var clicktimer;
var meta;
var qstore = [];
var host = require('../../config/config.js').gc2.host;


var BACKEND = "gc2";

module.exports = {
    set: function (o) {
        cloud = o.cloud;
        meta = o.meta;
        return this;
    },
    init: function () {
        cloud.on("dblclick", function () {
            clicktimer = undefined;
        });
        cloud.on("click", function (e) {
            var layers, count = 0, hit = false, event = new geocloud.clickEvent(e, cloud), distance;
            var metaDataKeys = meta.getMetaDataKeys();


            if (clicktimer) {
                clearTimeout(clicktimer);
            }
            else {
                clicktimer = setTimeout(function (e) {
                    clicktimer = undefined;
                    var coords = event.getCoordinate();
                    $.each(qstore, function (index, store) {
                        store.reset();
                        cloud.removeGeoJsonStore(store);
                    });
                    layers = cloud.getVisibleLayers().split(";");
                    $("#info-tab").empty();
                    $("#info-pane").empty();
                    $("#info-content .alert").hide();
                    $.each(layers, function (index, value) {
                        if (layers[0] === "") {
                            return false;
                        }
                        var isEmpty = true;
                        var srid = metaDataKeys[value.split(".")[1]].srid;
                        var geoType = metaDataKeys[value.split(".")[1]].type;
                        var layerTitel = (metaDataKeys[value.split(".")[1]].f_table_title !== null && metaDataKeys[value.split(".")[1]].f_table_title !== "") ? metaDataKeys[value.split(".")[1]].f_table_title : metaDataKeys[value.split(".")[1]].f_table_name;
                        var not_querable = metaDataKeys[value.split(".")[1]].not_querable;
                        var versioning = metaDataKeys[value.split(".")[1]].versioning;
                        var cartoSql = metaDataKeys[value.split(".")[1]].sql;
                        if (geoType !== "POLYGON" && geoType !== "MULTIPOLYGON") {
                            var res = [156543.033928, 78271.516964, 39135.758482, 19567.879241, 9783.9396205,
                                4891.96981025, 2445.98490513, 1222.99245256, 611.496226281, 305.748113141, 152.87405657,
                                76.4370282852, 38.2185141426, 19.1092570713, 9.55462853565, 4.77731426782, 2.38865713391,
                                1.19432856696, 0.597164283478, 0.298582141739, 0.149291];
                            distance = 5 * res[cloud.getZoom()];
                        }
                        var onLoad = function () {
                            var layerObj = qstore[this.id], out = [], fieldLabel;
                            isEmpty = layerObj.isEmpty();
                            if (!isEmpty && !not_querable) {
                                $('#modal-info-body').show();
                                var fieldConf = $.parseJSON(metaDataKeys[value.split(".")[1]].fieldconf);
                                $("#info-tab").append('<li><a data-toggle="tab" href="#_' + index + '">' + layerTitel + '</a></li>');
                                $("#info-pane").append('<div class="tab-pane" id="_' + index + '"><button type="button" class="btn btn-primary btn-xs" data-gc2-title="' + layerTitel + '" data-gc2-store="' + index + '">' + __('Search with this object') + '</button><table class="table table-condensed"><thead><tr><th>' + __("Property") + '</th><th>' + __("Value") + '</th></tr></thead></table></div>');

                                $.each(layerObj.geoJSON.features, function (i, feature) {
                                    if (fieldConf === null) {
                                        $.each(feature.properties, function (name, property) {
                                            out.push([name, 0, name, property]);
                                        });
                                    }
                                    else {
                                        $.each(fieldConf, function (name, property) {
                                            if (property.querable) {
                                                fieldLabel = (property.alias !== null && property.alias !== "") ? property.alias : name;
                                                if (feature.properties[name] !== undefined) {
                                                    if (property.link) {
                                                        out.push([name, property.sort_id, fieldLabel, "<a target='_blank' href='" + (property.linkprefix !== null ? property.linkprefix : "") + feature.properties[name] + "'>" + feature.properties[name] + "</a>"]);
                                                    }
                                                    else {
                                                        out.push([name, property.sort_id, fieldLabel, feature.properties[name]]);
                                                    }
                                                }
                                            }
                                        });
                                    }
                                    out.sort(function (a, b) {
                                        return a[1] - b[1];
                                    });
                                    $.each(out, function (name, property) {
                                        $("#_" + index + " table").append('<tr><td>' + property[2] + '</td><td>' + property[3] + '</td></tr>');
                                    });
                                    out = [];
                                    $('#info-tab a:first').tab('show');
                                });
                                hit = true;
                            } else {
                                layerObj.reset();
                            }
                            count++;
                            if (count === layers.length) {
                                if (!hit) {
                                    $('#modal-info-body').hide();
                                }
                                $("#info-content button").click(function (e) {
                                    //clearDrawItems();
                                    //makeConflict(qstore[$(this).data('gc2-store')].geoJSON.features [0], 0, false, __("From object in layer") + ": " + $(this).data('gc2-title'));
                                });
                                $('#main-tabs a[href="#info-content"]').tab('show');
                                //clearDrawItems();
                            }
                        };

                        switch (BACKEND) {
                            case "gc2":
                                qstore[index] = new geocloud.sqlStore({
                                    host: host,
                                    db: db,
                                    clickable: false,
                                    id: index,
                                    onLoad: onLoad
                                });
                                break;
                            case "cartodb":
                                qstore[index] = new geocloud.cartoDbStore({
                                    host: host,
                                    db: db,
                                    clickable: false,
                                    id: index,
                                    onLoad: onLoad
                                });
                                break;
                        }
                        cloud.addGeoJsonStore(qstore[index]);
                        var sql, f_geometry_column = metaDataKeys[value.split(".")[1]].f_geometry_column;
                        if (geoType === "RASTER") {
                            sql = "SELECT foo.the_geom,ST_Value(rast, foo.the_geom) As band1, ST_Value(rast, 2, foo.the_geom) As band2, ST_Value(rast, 3, foo.the_geom) As band3 " +
                                "FROM " + value + " CROSS JOIN (SELECT ST_transform(ST_GeomFromText('POINT(" + coords.x + " " + coords.y + ")',3857)," + srid + ") As the_geom) As foo " +
                                "WHERE ST_Intersects(rast,the_geom) ";
                        } else {

                            if (geoType !== "POLYGON" && geoType !== "MULTIPOLYGON") {
                                sql = "SELECT * FROM " + (BACKEND === "cartodb" ? "(" + cartoSql + ") as foo" : value) + " WHERE round(ST_Distance(ST_Transform(\"" + f_geometry_column + "\",3857), ST_GeomFromText('POINT(" + coords.x + " " + coords.y + ")',3857))) < " + distance;
                                if (versioning) {
                                    sql = sql + " AND gc2_version_end_date IS NULL ";
                                }
                                sql = sql + " ORDER BY round(ST_Distance(ST_Transform(\"" + f_geometry_column + "\",3857), ST_GeomFromText('POINT(" + coords.x + " " + coords.y + ")',3857)))";
                            } else {
                                sql = "SELECT * FROM " + (BACKEND === "cartodb" ? "(" + cartoSql + ") as foo" : value) + " WHERE ST_Intersects(ST_Transform(ST_geomfromtext('POINT(" + coords.x + " " + coords.y + ")',900913)," + srid + ")," + f_geometry_column + ")";
                                if (versioning) {
                                    sql = sql + " AND gc2_version_end_date IS NULL ";
                                }
                            }
                        }
                        sql = sql + "LIMIT 5";
                        qstore[index].sql = sql;
                        qstore[index].load();
                    });
                }, 250);
            }
        });
    }
};



},{"../../config/config.js":17,"./urlparser":16}],11:[function(require,module,exports){
var cloud;
var baseLayer;
var meta;
var setting;
var state;
var anchor;
var infoClick;
var search;
module.exports = {
    set: function (o) {
        cloud = o.cloud;
        baseLayer = o.baseLayer;
        meta = o.meta;
        setting = o.setting;
        state = o.state;
        anchor = o.anchor;
        infoClick = o.infoClick;
        search = o.search;
        return this;
    },
    init: function () {
        meta.init();
        baseLayer.init();
        setting.init();
        state.init();
        infoClick.init();
        search.init();

        var moveEndCallBack = function () {
            try {
                history.pushState(null, null, anchor.init());
            } catch (e) {
            }
        };
        cloud.on("dragend", moveEndCallBack);
        cloud.on("moveend", moveEndCallBack);
    }
};
},{}],12:[function(require,module,exports){
var cloud;
module.exports = {
    set: function (o) {
        cloud = o.cloud;
        return this;
    },
    init: function () {
        var type1, type2, gids = [], searchString,
            komKode = "101",
            placeStore = new geocloud.geoJsonStore({
                host: "http://eu1.mapcentia.com",
                db: "dk",
                sql: null,
                pointToLayer: null,
                onLoad: function () {
                    var resultLayer = new L.FeatureGroup();
                    cloud.map.addLayer(resultLayer);
                    resultLayer.addLayer(this.layer);
                    cloud.zoomToExtentOfgeoJsonStore(this);
                }
            });
        $('#custom-search').typeahead({
            highlight: false
        }, {
            name: 'adresse',
            displayKey: 'value',
            templates: {
                header: '<h2 class="typeahead-heading">Adresser</h2>'
            },
            source: function (query, cb) {
                if (query.match(/\d+/g) === null && query.match(/\s+/g) === null) {
                    type1 = "vejnavn,bynavn";
                }
                if (query.match(/\d+/g) === null && query.match(/\s+/g) !== null) {
                    type1 = "vejnavn_bynavn";
                }
                if (query.match(/\d+/g) !== null) {
                    type1 = "adresse";
                }
                var names = [];

                (function ca() {
                    $.ajax({
                        url: 'http://eu1.mapcentia.com/api/v1/elasticsearch/search/dk/aws4/' + type1,
                        data: '&q={"query":{"filtered":{"query":{"query_string":{"default_field":"string","query":"' + encodeURIComponent(query.toLowerCase().replace(",", "")) + '","default_operator":"AND"}},"filter":{"term":{"kommunekode":"0' + komKode + '"}}}}}',
                        contentType: "application/json; charset=utf-8",
                        scriptCharset: "utf-8",
                        dataType: 'jsonp',
                        jsonp: 'jsonp_callback',
                        success: function (response) {
                            $.each(response.hits.hits, function (i, hit) {
                                var str = hit._source.properties.string;
                                gids[str] = hit._source.properties.gid;
                                names.push({value: str});
                            });
                            if (names.length === 1 && (type1 === "vejnavn,bynavn" || type1 === "vejnavn_bynavn")) {
                                type1 = "adresse";
                                names = [];
                                gids = [];
                                ca();
                            } else {
                                cb(names);
                            }
                        }
                    })
                })();
            }
        }, {
            name: 'matrikel',
            displayKey: 'value',
            templates: {
                header: '<h2 class="typeahead-heading">Matrikel</h2>'
            },
            source: function (query, cb) {
                var names = [];
                type2 = (query.match(/\d+/g) != null) ? "jordstykke" : "ejerlav";
                (function ca() {
                    $.ajax({
                        url: 'http://eu1.mapcentia.com/api/v1/elasticsearch/search/dk/matrikel/' + type2,
                        data: '&q={"query":{"filtered":{"query":{"query_string":{"default_field":"string","query":"' + encodeURIComponent(query.toLowerCase()) + '","default_operator":"AND"}},"filter":{"term":{"komkode":"' + komKode + '"}}}}}',
                        contentType: "application/json; charset=utf-8",
                        scriptCharset: "utf-8",
                        dataType: 'jsonp',
                        jsonp: 'jsonp_callback',
                        success: function (response) {
                            $.each(response.hits.hits, function (i, hit) {
                                var str = hit._source.properties.string;
                                gids[str] = hit._source.properties.gid;
                                names.push({value: str});
                            });
                            if (names.length === 1 && (type2 === "ejerlav")) {
                                type2 = "jordstykke";
                                names = [];
                                gids = [];
                                ca();
                            } else {
                                cb(names);
                            }
                        }
                    })
                })();
            }
        });
        $('#custom-search').bind('typeahead:selected', function (obj, datum, name) {
            if ((type1 === "adresse" && name === "adresse") || (type2 === "jordstykke" && name === "matrikel")) {
                placeStore.reset();

                if (name === "matrikel") {
                    placeStore.sql = "SELECT gid,the_geom,ST_asgeojson(ST_transform(the_geom,4326)) as geojson FROM matrikel.jordstykke WHERE gid=" + gids[datum.value];
                }
                if (name === "adresse") {
                    placeStore.sql = "SELECT gid,the_geom,ST_asgeojson(ST_transform(the_geom,4326)) as geojson FROM adresse.adgang WHERE gid=" + gids[datum.value];
                }
                searchString = datum.value;
                placeStore.load();
            } else {
                setTimeout(function () {
                    $(".typeahead").val(datum.value + " ").trigger("paste").trigger("input");
                }, 100)
            }
        });
    }

}


},{}],13:[function(require,module,exports){
var cloud;
var anchor;
module.exports = module.exports = {
    set: function (o) {
        cloud = o.cloud;
        anchor = o.anchor;
        return this;
    },
    init: function (str) {
        cloud.setBaseLayer(str);
        try {
            history.pushState(null, null, anchor.init());
        } catch (e) {
        }
        //addLegend();
    }
};
},{}],14:[function(require,module,exports){
var urlparser = require('./urlparser');
var hash = urlparser.hash;
var cloud;
var meta;
var setting;
var setBaseLayer;
var switchLayer;
var legend;
module.exports = {
    set: function (o) {
        cloud = o.cloud;
        meta = o.meta;
        setting = o.setting;
        setBaseLayer = o.setBaseLayer;
        switchLayer = o.switchLayer;
        legend = o.legend;
        return this;
    },
    init: function () {
        (function pollForLayers() {
            if (meta.ready() && setting.ready()) {
                var p, arr, i, hashArr;
                hashArr = hash.replace("#", "").split("/");
                if (hashArr[0]) {
                    $(".base-map-button").removeClass("active");
                    $("#" + hashArr[0]).addClass("active");
                    if (hashArr[1] && hashArr[2] && hashArr[3]) {
                        setBaseLayer.init(hashArr[0]);
                        if (hashArr[4]) {
                            arr = hashArr[4].split(",");
                            for (i = 0; i < arr.length; i++) {
                                switchLayer.init(arr[i], true, true);
                            }
                        }
                        p = geocloud.transformPoint(hashArr[2], hashArr[3], "EPSG:4326", "EPSG:900913");
                        cloud.zoomToPoint(p.x, p.y, hashArr[1]);
                    }
                    legend.init();
                } else {
                    setBaseLayer.init(window.setBaseLayers[0].id);
                    if (extent !== null) {
                        /*if (BACKEND === "cartodb") {
                            cloud.map.fitBounds(extent);
                        } else {
                            cloud.zoomToExtent(extent);
                        }*/
                        cloud.zoomToExtent(extent);
                    } else {
                        cloud.zoomToExtent();
                    }
                }
            } else {
                setTimeout(pollForLayers, 10);
            }
        }());
    }
};
},{"./urlparser":16}],15:[function(require,module,exports){
var cloud;
var legend;
var anchor;
module.exports = module.exports = {
    set: function (o) {
        cloud = o.cloud;
        legend = o.legend;
        anchor = o.anchor;
        return this;
    },
    init: function (name, visible, doNotLegend) {
        if (visible) {
            cloud.showLayer(name);
            $('*[data-gc2-id="' + name + '"]').next("span").show();
            $('*[data-gc2-id="' + name + '"]').prop('checked', true);
        } else {
            cloud.hideLayer(name);
            $('*[data-gc2-id="' + name + '"]').next("span").hide();
            $('*[data-gc2-id="' + name + '"]').prop('checked', false);
        }
        try {
            history.pushState(null, null, anchor.init());
        } catch (e) {
        }
        if (!doNotLegend) {
            legend.init();

        }
    }
};



},{}],16:[function(require,module,exports){
var uri = geocloud.pathName;
module.exports = {
    hostname: geocloud_host,
    hash: decodeURIComponent(geocloud.urlHash),
    db: uri[1],
    schema: uri[2],
    urlVars: geocloud.urlVars
}
},{}],17:[function(require,module,exports){
module.exports = {
    gc2: {
        host: "http://192.168.33.11"
    }
};
},{}]},{},[2]);
