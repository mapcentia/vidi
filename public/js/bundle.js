(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = {
    dict: {
        /* Start of viewer and widget */
        "About": "Om",
        "Meters": "Meter",
        "Buffer": "Buffer",
        "Search": "Søg",
        "Result": "Resultat",
        "Info": "Info",
        "Layers": "Lag",
        "Legend": "Signatur",
        "Help": "Hjælp",
        "Draw": "Tegn",
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
        "Info text": "Når du klikker på et tændt lag, vises resultatet her. Slå 'Avanceret søgning' til for at søge med flader, buffer mv.",
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
        "No Conflicts": "Ingen konflikter",

        "Print": "Print",
        "Search places": "Søg på steder",
        "Activate advanced query": "Aktivér avanceret forespørgsel",
        "Help text overlays": "Slå  overlejringskort til og fra. Tændte kort bliver forspørgbare.",
        "Help text baselayers": "Vælg baggrundskort.",
        "Help text legend": "Signatur for tændte overlejringskort",
        "Help text draw": "Tegn dit eget kort. Brug markører, linjer, flader, firkanter og cirkler. Du kan redigere og skifte farve på et allerede tegnet element.",
        "Help text print": "Lav skaleret PDF kort. Juster den orange firkant i kortet for at sætte udsnittets omfang og skala.",
        "Activate drawing tools": "Aktivér tegneværktøjer",
        "Activate print tools": "Aktivér printværktøjer",
        "Make PDF": "Lav PDF",
        "Download": "Download",
        "Open PDF": "Åben PDF",
        "Open HTML page": "Åben HTML side",
        "Scale": "Skala",
        "Template": "Skabelon",
        "Page size": "Papirstørrelse",
        "Orientation": "Orientering",
        "Title": "Titel",
        "Comment": "Kommentar",
        "The comment will be placed on the PDF": "Kommentaren vil blive placeret på PDF'en",

        "Draw a line": "Tegn en linje",
        "Draw an area": "Tegn en flade",
        "Draw a rectangle": "Tegn en rektangel",
        "Draw a circle": "Tegn en cirkel",
        "Draw a marker": "Tegn en markør",

        "Close": "Luk"
    }
};
},{}],2:[function(require,module,exports){
module.exports = {
    dict: {
        /* Start of viewer and widget */
        "About": "About",
        "Meters": "Meters",
        "Buffer": "Buffer",
        "Search": "Search",
        "Result": "Result",
        "Info": "Info",
        "Layers": "Layers",
        "Legend": "Legend",
        "Help": "help",
        "Draw": "Draw",
        "Log": "Log",
        "Address": "Address",
        "With conflicts": "With conflicts",
        "Data from conflicts": "Data from conflicts",
        "Without conflicts": "Without conflicts",
        "Errors": "Errors",
        "Layer": "Layer",
        "Number of objects": "Number of objects",
        "Show": "Show",
        "Severity": "Severity",
        "Info text": "When you click on a layer, the result will show here. You can then search with the extent of the object.",
        "Baselayers": "Baselayers",
        "Print report": "Print report",
        "Search with this object": "Search with this object",
        "From drawing": "From drawing",
        "From object in layer": "From object in layer",
        "Clear map": "Clear map",
        // Drawing
        "Cancel drawing": "Cancel drawing",
        "Cancel": "Cancel",
        "Delete last point drawn": "Delete last point drawn",
        "Delete last point": "Delete last point",
        "Search with a line": "Search with a line",
        "Search with an area": "Search with an area",
        "Search with a rectangle": "Search with a rectangle",
        "Search with a circle": "Search with a circle",
        "Search with a point": "Search with a point",
        "Click and drag to draw circle.": "Click and drag to draw circle.",
        "Radius": "Radius",
        "Click map to place marker.": "Click map to place marker.",
        "Click to start drawing shape.": "Click to start drawing shape.",
        "Click to continue drawing shape.": "Click to continue drawing shape.",
        "Click first point to close this shape.": "Click first point to close this shape.",
        "<strong>Error:</strong> shape edges cannot cross!": "<strong>Error:</strong> shape edges cannot cross!",
        "Click to start drawing line.": "Click to start drawing line.",
        "Click to continue drawing line.": "Click to continue drawing line.",
        "Click last point to finish line.": "Click last point to finish line.",
        "Click and drag to draw rectangle.": "Click and drag to draw rectangle.",
        "Release mouse to finish drawing.": "Release mouse to finish drawing.",
        "Save changes.": "Save changes.",
        "Save": "Save",
        "Cancel editing, discards all changes.": "Cancel editing, discards all changes.",
        "Edit drawings.": "Edit drawings.",
        "No drawings to edit.": "No drawings to edit.",
        "Delete drawings.": "Delete drawings.",
        "No drawings to delete.": "No drawings to delete.",
        "Drag handles, or marker to edit drawing.": "Drag handles, or marker to edit drawing.",
        "Click cancel to undo changes.": "Click cancel to undo changes.",
        "Click on a drawing to remove": "Click on a drawing to remove",
        // Report
        "Get as PDF": "Get as PDF",
        "Conflicts": "Conflicts",
        "No Conflicts": "No Conflicts",

        "Print": "Print",
        "Search places": "Search places",
        "Activate advanced query": "Activate advanced query",
        "Help text overlays": "Turn overlay maps on and off. Visible overlays becomes queryable.",
        "Help text baselayers": "Choose base layer.",
        "Help text legend": "Legend for visible overlay maps.",
        "Help text draw": "Draw your own map. Use markers, lines, areas, squares and circles. You can edit and change color on already drawn features.",
        "Help text print": "Make scaled PDF map. Tweak the orange square in the map to set view extent and scale.",
        "Activate drawing tools": "Activate drawing tools",
        "Activate print tools": "Activate print tools",
        "Make PDF": "Make PDF",
        "Download": "Download",
        "Open PDF": "Open PDF",
        "Open HTML page": "Open HTML page",
        "Scale": "Scale",
        "Template": "Template",
        "Page size": "Page size",
        "Orientation": "Orientation",
        "Title": "Title",
        "Comment": "Comment",
        "The comment will be placed on the PDF": "The comment will be placed on the PDF",

        "Draw a line": "Draw a line",
        "Draw an area": "Draw an area",
        "Draw a rectangle": "Draw a rectangle",
        "Draw a circle": "Draw a circle",
        "Draw a marker": "Draw a marker",

        "Close": "Close"
    }
};
},{}],3:[function(require,module,exports){
// Hack to compile Glob files. Don´t call this function!
function ಠ_ಠ() {
    require('./i18n/da_DK.js');require('./i18n/en_US.js');
}
window.gc2i18n = require('./i18n/' + window._vidiLocale + '.js');

window.Vidi = function () {
    "use strict";

    // Declare vars
    var config, socketId, tmpl;

    // Set vars
    socketId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });

    var urlparser = require('./modules/urlparser');
    var urlVars = urlparser.urlVars;

    config = require('../config/config.js');

    $(window).load(function () {
        window.status = "all_loaded";
    });
    // Load style sheet
    $('<link/>').attr({
        rel: 'stylesheet',
        type: 'text/css',
        href: '/static/css/styles.css'
    }).appendTo('head');

    // Render template and set some styling
    if (typeof config.template === "undefined") {
        tmpl = "default.tmpl";
    } else {
        tmpl = config.template;
    }

    // Check if template is set in URL vars
    if (typeof urlVars.tmpl !== "undefined") {
        var par = urlVars.tmpl.split("#");
        if (par.length > 1) {
            par.pop();
        }
        tmpl = par.join();
    }

    // If px and py is provided for print templates, add the values to the dict before rendering
    if (urlVars.px && urlVars.py) {
        gc2i18n.dict.printWidth = urlVars.px + "px";
        gc2i18n.dict.printHeight = urlVars.py + "px";
    }

    gc2i18n.dict.brandName = config.brandName;

    $("body").html(Templates[tmpl].render(gc2i18n.dict));

    $("[data-toggle=tooltip]").tooltip();
    $(".center").hide();
    try {
        var max = $(document).height() - $('.tab-pane').offset().top - 100;
    } catch (e){
        console.info(e.message);
    }
    $('.tab-pane').not("#result-content").css('max-height', max);
    $('#places').css('height', max - 130);
    $('#places').css('min-height', 400);
    $('#places .tt-dropdown-menu').css('max-height', max - 200);
    $('#places .tt-dropdown-menu').css('min-height', 400);

    // Require the standard modules
    var modules = {
        init: require('./modules/init'),
        cloud: require('./modules/cloud'),
        switchLayer: require('./modules/switchLayer'),
        setBaseLayer: require('./modules/setBaseLayer'),
        meta: require('./modules/meta'),
        setting: require('./modules/setting'),
        baseLayer: require('./modules/baseLayer'),
        legend: require('./modules/legend'),
        state: require('./modules/state'),
        anchor: require('./modules/anchor'),
        infoClick: require('./modules/infoClick'),
        search: require('./modules/search/danish'),
        bindEvent: require('./modules/bindEvent'),
        draw: require('./modules/draw'),
        print: require('./modules/print'),
        advancedInfo: require('./modules/advancedInfo'),
        sqlQuery: require('./modules/sqlQuery'),
        serializeLayers: require('./modules/serializeLayers'),
        pushState: require('./modules/pushState'),
        extensions: {}
    };

    // Use the setters in modules so they can interact
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
    modules.bindEvent.set(modules);
    modules.draw.set(modules);
    modules.print.set(modules);
    modules.advancedInfo.set(modules);
    modules.sqlQuery.set(modules);
    modules.serializeLayers.set(modules);
    modules.pushState.set(modules);

    // Require extensions modules

    // Hack to compile Glob files. Don´t call this function!
    function ಠ_ಠ() {
        require('./modules/extensions/cowiDetail/bufferSearch.js');
    }

    if (typeof config.extensions !== "undefined" && typeof config.extensions.browser !== "undefined") {
        $.each(config.extensions.browser, function (i, v) {
            modules.extensions[Object.keys(v)[0]] = {};
            $.each(v[Object.keys(v)[0]], function (n, m) {
                modules.extensions[Object.keys(v)[0]][m] = require('./modules/extensions/' + Object.keys(v)[0] + '/' + m + ".js");
                modules.extensions[Object.keys(v)[0]][m].set(modules);
                modules.extensions[Object.keys(v)[0]][m].init();
            })
        });
    }
    // Return the init module to be called in index.html
    return {
        init: modules.init
    }
};

},{"../config/config.js":29,"./i18n/da_DK.js":1,"./i18n/en_US.js":2,"./modules/advancedInfo":4,"./modules/anchor":5,"./modules/baseLayer":6,"./modules/bindEvent":7,"./modules/cloud":8,"./modules/draw":9,"./modules/extensions/cowiDetail/bufferSearch.js":12,"./modules/infoClick":14,"./modules/init":15,"./modules/legend":16,"./modules/meta":17,"./modules/print":18,"./modules/pushState":19,"./modules/search/danish":20,"./modules/serializeLayers":21,"./modules/setBaseLayer":22,"./modules/setting":23,"./modules/sqlQuery":24,"./modules/state":25,"./modules/switchLayer":26,"./modules/urlparser":27}],4:[function(require,module,exports){
var cloud;
var sqlQuery;
var infoClick;
var reproject = require('reproject');
var _ = require('underscore');
var jsts = require('jsts');
var searchOn = false;
var drawnItems = new L.FeatureGroup();
var bufferItems = new L.FeatureGroup();
var drawControl;
var qstore = [];
var noUiSlider = require('nouislider');
var bufferSlider = document.getElementById('buffer-slider');
var bufferValue = document.getElementById('buffer-value');

var clearDrawItems = function () {
    drawnItems.clearLayers();
    bufferItems.clearLayers();
    sqlQuery.reset(qstore);
};

var makeSearch = function () {
    var primitive, coord,
        layer, buffer = parseFloat($("#buffer-value").val());

    for (var prop in drawnItems._layers) {
        layer = drawnItems._layers[prop];
        break;
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

    if (primitive) {
        if (typeof layer.getBounds !== "undefined") {
            coord = layer.getBounds().getSouthWest();
        } else {
            coord = layer.getLatLng();
        }
        // Get utm zone
        var zone = require('./utmZone.js').getZone(coord.lat, coord.lng);
        var crss = {
            "proj": "+proj=utm +zone=" + zone + " +ellps=WGS84 +datum=WGS84 +units=m +no_defs",
            "unproj": "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs"
        };
        var reader = new jsts.io.GeoJSONReader();
        var writer = new jsts.io.GeoJSONWriter();
        var geom = reader.read(reproject.reproject(primitive, "unproj", "proj", crss));
        var buffer4326 = reproject.reproject(writer.write(geom.geometry.buffer(buffer)), "proj", "unproj", crss);
        var buffered = reader.read(buffer4326);
        var l = L.geoJson(buffer4326, {
            "color": "#ff7800",
            "weight": 1,
            "opacity": 1,
            "fillOpacity": 0.1,
            "dashArray": '5,3'
        }).addTo(bufferItems);
        l._layers[Object.keys(l._layers)[0]]._vidi_type = "query_buffer";
        sqlQuery.init(qstore, buffered.toText(), "4326");
    }
};

module.exports = {
    set: function (o) {
        cloud = o.cloud;
        sqlQuery = o.sqlQuery;
        infoClick = o.infoClick;
        cloud.map.addLayer(drawnItems);
        cloud.map.addLayer(bufferItems);
        return this;
    },
    control: function () {
        if (!searchOn) {
            $("#buffer").show();

            // Reset layer made by clickInfo
            infoClick.reset();
            L.drawLocal = require('./drawLocales/advancedInfo.js');
            drawControl = new L.Control.Draw({
                position: 'topright',
                draw: {
                    polygon: {
                        title: 'Draw a polygon!',
                        allowIntersection: false,
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
            searchOn = true;

            // Unbind events
            cloud.map.off('draw:created');
            cloud.map.off('draw:drawstart');
            cloud.map.off('draw:drawstop');
            cloud.map.off('draw:editstart');

            // Bind events
            cloud.map.on('draw:created', function (e) {
                e.layer._vidi_type = "query_draw";
                drawnItems.addLayer(e.layer);
            });
            cloud.map.on('draw:drawstart', function (e) {
                clearDrawItems();
            });
            cloud.map.on('draw:drawstop', function (e) {
                makeSearch();
            });
            cloud.map.on('draw:editstop', function (e) {
                makeSearch();
            });
            cloud.map.on('draw:editstart', function (e) {
                bufferItems.clearLayers();
            });
        } else {
            // Clean up
            console.log("Stoping advanced search");
            clearDrawItems();

            // Unbind events
            cloud.map.off('draw:created');
            cloud.map.off('draw:drawstart');
            cloud.map.off('draw:drawstop');
            cloud.map.off('draw:editstart');
            cloud.map.removeControl(drawControl);
            searchOn = false;
            $("#buffer").hide();
        }
    },
    init: function (str) {
        try {
            noUiSlider.create(bufferSlider, {
                start: 40,
                connect: "lower",
                step: 1,
                range: {
                    min: 0,
                    max: 500
                }
            });

            bufferSlider.noUiSlider.on('update', _.debounce(function (values, handle) {
                bufferValue.value = values[handle];
                if (typeof bufferItems._layers[Object.keys(bufferItems._layers)[0]] !== "undefined" && typeof bufferItems._layers[Object.keys(bufferItems._layers)[0]]._leaflet_id !== "undefined") {
                    bufferItems.clearLayers();
                    makeSearch()
                }
            }, 300));

            // When the input changes, set the slider value
            bufferValue.addEventListener('change', function () {
                bufferSlider.noUiSlider.set([this.value]);
            });
        } catch (e) {
            console.info(e.message);
        }
    },
    getSearchOn: function () {
        return searchOn;
    },
    getDrawLayer: function () {
        return drawnItems;
    },
    getBufferLayer: function () {
        return bufferItems;
    }
};


},{"./drawLocales/advancedInfo.js":10,"./utmZone.js":28,"jsts":35,"nouislider":38,"reproject":107,"underscore":108}],5:[function(require,module,exports){
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
        var param = [], paramStr;
        $.each(urlVars, function (i, v) {
            parr = v.split("#");
            if (parr.length > 1) {
                parr.pop();
            }
            param.push(i + "=" + parr.join());
        });
        paramStr = param.join("&");
        return "/app/" + db + "/" + schema + "/" + ((paramStr === "") ? "" : "?" + paramStr) + anchor();
    },
    getAnchor: function(){
        return anchor();
    }
};
},{"./urlparser":27}],6:[function(require,module,exports){
var cloud;
module.exports = module.exports = {
    set: function (o) {
        cloud = o.cloud;
        return this;
    },
    init: function (str) {
        var bl, customBaseLayer;
        if (typeof window.setBaseLayers !== 'object') {
            window.setBaseLayers = [
                {"id": "mapQuestOSM", "name": "MapQuset OSM"},
                {"id": "osm", "name": "OSM"},
                {"id": "stamenToner", "name": "Stamen toner"}
            ];
        }
        cloud.bingApiKey = window.bingApiKey;
        cloud.digitalGlobeKey = window.digitalGlobeKey;
        for (var i = 0; i < window.setBaseLayers.length; i = i + 1) {

            bl = window.setBaseLayers[i];
            if (typeof bl.type !== "undefined" && bl.type === "XYZ") {
                customBaseLayer = new L.TileLayer(bl.url, {
                    attribution: bl.attribution
                });
                customBaseLayer.baseLayer = true;
                customBaseLayer.id = bl.id;
                cloud.addLayer(customBaseLayer, bl.name, true);
                $("#base-layer-list").append(
                    "<div class='list-group-item'><div class='radio radio-primary base-layer-item' data-gc2-base-id='" + bl.id + "'><label><input type='radio' name='baselayers'>" + bl.name + "</label></div></div><div class='list-group-separator'></div>"
                );
            } else if (typeof window.setBaseLayers[i].restrictTo === "undefined" || window.setBaseLayers[i].restrictTo.indexOf(schema) > -1) {
                cloud.addBaseLayer(window.setBaseLayers[i].id, window.setBaseLayers[i].db);
                $("#base-layer-list").append(
                    "<div class='list-group-item'><div class='radio radio-primary base-layer-item' data-gc2-base-id='" + window.setBaseLayers[i].id + "'><label><input type='radio' name='baselayers'>" + window.setBaseLayers[i].name + "</label></div></div><div class='list-group-separator'></div>"
                );
            }
        }
    }
};
},{}],7:[function(require,module,exports){
var draw;
var advancedInfo;
var cloud;
var print;
module.exports = module.exports = {
    set: function (o) {
        draw = o.draw;
        advancedInfo = o.advancedInfo;
        cloud = o.cloud;
        print = o.print;
        return this;
    },
    init: function (str) {
        $("#draw-btn").on("click", function () {
            // Stop advancedInfo
            if (advancedInfo.getSearchOn()) {
                advancedInfo.control(); // Will toggle the control off
                $("#advanced-info-btn").prop("checked", false);
                $("#buffer").hide();
            }
            draw.control();
        });


        $("#advanced-info-btn").on("click", function () {
            // Stop drawing
            if (draw.getDrawOn()) {
                draw.control(); // Will toggle the control off
                $("#draw-btn").prop("checked", false);
            }
            advancedInfo.control();
        });

        $("#start-print-btn").on("click", function () {
            print.print();
            $(this).button('loading');
            $("#get-print-fieldset").prop("disabled", true);
        });

        $("#print-btn").on("click", function () {
            print.activate();
            $("#get-print-fieldset").prop("disabled", true);
        });

    }
};
},{}],8:[function(require,module,exports){
try {
    geocloud.setHost(require('../../config/config.js').gc2.host);
} catch (e){
    console.info(e.message);
}

var cloud = new geocloud.map({
    el: "map",
    zoomControl: false,
    numZoomLevels: 21
});
cloud.map.on('load', function(){ if ($(document).width() > 767 ) {
    setTimeout(
        function () {
            $(".navbar-toggle").trigger("click");
        }, 500
    );
}});

var zoomControl = L.control.zoom({
    position: 'topright'
});
cloud.map.addControl(zoomControl);


var map = cloud.map;


/*var scaleControl = L.control.scale({position: "bottomright"});
 cloud.map.addControl(scaleControl);*/

var lc = L.control.locate({
    position: 'topright',
    strings: {
        title: "Find me"
    },
    position: "topright",
    icon: "fa fa-location-arrow",
    iconLoading: "fa fa-circle-o-notch fa-spin"
}).addTo(map);

var graphicScale = L.control.graphicScale({
    doubleLine: false,
    fill: 'hollow',
    showSubunits: false,
    position: "topleft"
}).addTo(map);

var scaleText = L.DomUtil.create('div', 'scaleText');
graphicScale._container.insertBefore(scaleText, graphicScale._container.firstChild);
//scaleText.innerHTML = '<h1>Leaflet Graphic Scale</h1><p>style: <span class="choice">hollow</span>-<span class="choice">line</span>-<span class="choice">fill</span>-<span class="choice">nofill</span></p>';

var styleChoices = scaleText.querySelectorAll('.choice');

for (var i = 0; i < styleChoices.length; i++) {
    styleChoices[i].addEventListener('click', function (e) {
        graphicScale._setStyle({fill: e.currentTarget.innerHTML});
    });
}

var measureControl = new L.Control.Measure({
    position: 'topright',
    primaryLengthUnit: 'kilometers',
    secondaryLengthUnit: 'meters',
    primaryAreaUnit: 'hectares',
    secondaryAreaUnit: 'sqmeters',
    localization: 'da'

});
measureControl.addTo(map);

module.exports = cloud;
},{"../../config/config.js":29}],9:[function(require,module,exports){
var cloud;
var drawOn = false;
var drawnItems = new L.FeatureGroup();
var drawControl;
var table;
var store = new geocloud.sqlStore({
    clickable: true
});
var destructFunctions = [];
//var editPopUp;


var getDistance = function (e) {
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

var getArea = function (e) {
    return L.GeometryUtil.readableArea(L.GeometryUtil.geodesicArea(e.getLatLngs()), true);
};

module.exports = {
    set: function (o) {
        cloud = o.cloud;
        return this;
    },
    control: function () {
        if (!drawOn) {
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

            cloud.map.addLayer(drawnItems);
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
                    window.editPopUp = new L.EditToolbar.Popup(event.latlng, {
                        className: 'leaflet-draw-toolbar',
                        actions: editActions
                    }).addTo(cloud.map, drawLayer);
                });

                if (type === "polygon" || type === "rectangle") {
                    area = getArea(drawLayer);
                    //distance = getDistance(drawLayer);
                }
                if (type === 'polyline') {
                    distance = getDistance(drawLayer);
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
                        v.feature.properties.distance = getDistance(v);
                    }
                    else if (v.feature.properties.area !== null) {
                        v.feature.properties.area = getArea(v);
                    }
                });
                table.loadDataInTable();
            });

        } else {
            // Clean up
            console.log("Stooping drawing");
            cloud.map.removeControl(drawControl);
            drawOn = false;

            // Unbind events
            cloud.map.off('draw:created');
            cloud.map.off('draw:deleted');
            cloud.map.off('draw:edited');

            // Call destruct functions
            $.each(destructFunctions, function (i, v) {
                v();
            })
        }
    },
    init: function (str) {
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
                    "el": "#draw-table table",
                    "geocloud2": cloud,
                    "store": store,
                    "cm": [
                        {
                            header: "Type",
                            dataIndex: "type",
                            sortable: true
                        },
                        {
                            header: "Area",
                            dataIndex: "area",
                            sortable: true
                        },
                        {
                            header: "Distance/Radius",
                            dataIndex: "distance",
                            sortable: true
                        }
                    ],
                    "autoUpdate": false,
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
    getDrawOn: function () {
        return drawOn;
    },
    getLayer: function () {
        return store.layer;
    },
    getTable: function () {
        return table;
    },
    setDestruct: function (f) {
        destructFunctions.push(f);
    }
}

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


},{"./drawLocales/draw.js":11,"./height":13}],10:[function(require,module,exports){
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
            finish: {
                title: __('Finish drawing.'),
                text: __('Finish')
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
},{}],11:[function(require,module,exports){
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
            finish: {
                title: __('Finish drawing.'),
                text: __('Finish')
            },
            buttons: {
                polyline: __('Draw a line'),
                polygon: __('Draw an area'),
                rectangle: __('Draw a rectangle'),
                circle: __('Draw a circle'),
                marker: __('Draw a marker')
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
                },
                finish: {
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
},{}],12:[function(require,module,exports){
var cloud;
var infoClick;
var draw;
var circle1, circle2, marker;
var jsts = require('jsts');
var reproject = require('reproject');
var store;
var db = "test";
var drawnItemsMarker = new L.FeatureGroup();
var drawnItemsPolygon = new L.FeatureGroup();
var drawControl;
var setBaseLayer;

var reset = function (s) {
    s.abort();
    s.reset();
    cloud.removeGeoJsonStore(s);

    $("#info-tab").empty();
    $("#info-pane").empty();
};

var createBufferBtn = function () {
    // Create buttons
    var ImmediateSubAction = L._ToolbarAction.extend({
        initialize: function (map, myAction) {
            this.map = cloud.map;
            this.myAction = myAction;
            L._ToolbarAction.prototype.initialize.call(this);
        },
        addHooks: function () {
            //this.myAction.disable();
        }
    });
    var circle1Btn = ImmediateSubAction.extend({
        options: {
            toolbarIcon: {
                html: 'Vis 500 m'
            }
        },
        addHooks: function () {
            circle1.addTo(cloud.map);
            ImmediateSubAction.prototype.addHooks.call(this);
        }
    });
    var circle2Btn = ImmediateSubAction.extend({
        options: {
            toolbarIcon: {
                html: 'Vis 1000 m'
            }
        },
        addHooks: function () {
            circle2.addTo(cloud.map);
            ImmediateSubAction.prototype.addHooks.call(this);
        }
    });
    var Cancel = ImmediateSubAction.extend({
        options: {
            toolbarIcon: {
                html: '<i class="fa fa-times"></i>',
                tooltip: 'Cancel'
            }
        },
        addHooks: function () {
            this.myAction.disable();
            cloud.map.removeLayer(circle1);
            cloud.map.removeLayer(circle2);
            ImmediateSubAction.prototype.addHooks.call(this);
        }
    });
    var MyCustomAction = L._ToolbarAction.extend({
        options: {
            toolbarIcon: {
                className: 'fa  fa-circle-thin deactiveBtn'
            },
            /* Use L.Toolbar for sub-toolbars. A sub-toolbar is,
             * by definition, contained inside another toolbar, so it
             * doesn't need the additional styling and behavior of a
             * L.Toolbar.Control or L.Toolbar.Popup.
             */
            subToolbar: new L._Toolbar({
                actions: [Cancel, circle2Btn, circle1Btn]
            })
        }
    });

    // Create buttons
    var ImmediateSubAction2 = L._ToolbarAction.extend({
        initialize: function (map, myAction) {
            this.map = cloud.map;
            this.myAction = myAction;
            L._ToolbarAction.prototype.initialize.call(this);
        },
        addHooks: function () {
            //this.myAction.disable();
        }
    });
    var osm = ImmediateSubAction2.extend({
        options: {
            toolbarIcon: {
                html: 'Open Street Map'
            }
        },
        addHooks: function () {
            setBaseLayer.init("osm");
            ImmediateSubAction2.prototype.addHooks.call(this);
        }
    });
    var ghybrid = ImmediateSubAction2.extend({
        options: {
            toolbarIcon: {
                html: 'Satellite'
            }
        },
        addHooks: function () {
            setBaseLayer.init("googleHybrid");
            ImmediateSubAction2.prototype.addHooks.call(this);
        }
    });
    var Cancel = ImmediateSubAction2.extend({
        options: {
            toolbarIcon: {
                html: '<i class="fa fa-times"></i>',
                tooltip: 'Cancel'
            }
        },
        addHooks: function () {
            this.myAction.disable();
            ImmediateSubAction2.prototype.addHooks.call(this);
        }
    });
    var MyCustomAction2 = L._ToolbarAction.extend({
        options: {
            toolbarIcon: {
                className: 'fa fa-map-o'
            },
            /* Use L.Toolbar for sub-toolbars. A sub-toolbar is,
             * by definition, contained inside another toolbar, so it
             * doesn't need the additional styling and behavior of a
             * L.Toolbar.Control or L.Toolbar.Popup.
             */
            subToolbar: new L._Toolbar({
                actions: [Cancel, osm, ghybrid]
            })
        }
    });
    return new L._Toolbar.Control({
        position: 'topright',
        actions: [MyCustomAction, MyCustomAction2]
    });
};

module.exports = {
    set: function (o) {
        cloud = o.cloud;
        infoClick = o.infoClick;
        draw = o.draw;
        setBaseLayer = o.setBaseLayer;
        L.DrawToolbar.include({
            getModeHandlers: function (map) {
                return [
                    {
                        enabled: true,
                        handler: new L.Draw.Marker(map, {icon: new L.Icon.Default()}),
                        title: 'Sæt en markør'
                    },
                    {
                        enabled: true,
                        handler: new L.Draw.Polygon(map, {
                            shapeOptions: {
                                color: '#662d91',
                                fillOpacity: 0
                            },
                            allowIntersection: false,
                            drawError: {
                                color: '#b00b00',
                                timeout: 1000
                            }
                        }),
                        title: 'Tegn en polygon'
                    }
                ];
            }
        });
        drawControl = new L.Control.Draw({
            position: 'topright',
            edit: false
        });
        cloud.map.addControl(drawControl);
        cloud.map.addLayer(drawnItemsMarker);
        cloud.map.addLayer(drawnItemsPolygon);
        return this;
    },
    init: function () {
        createBufferBtn().addTo(cloud.map);

        // Bind events
        cloud.map.on('draw:created', function (e) {
            e.layer._vidi_type = "draw";
            if (e.layerType === "marker") {
                var awm = L.marker(e.layer._latlng, {icon: L.AwesomeMarkers.icon({icon: 'fa-shopping-cart', markerColor: 'blue', prefix: 'fa'})}).bindPopup('<table id="detail-data-r" class="table"><tr><td>Adresse</td><td class="r-adr-val">-</td> </tr> <tr> <td>Koordinat</td> <td id="r-coord-val">-</td> </tr> <tr> <td>Indenfor 500 m</td> <td class="r500-val">-</td> </tr> <tr> <td>Indenfor 1000 m</td> <td class="r1000-val">-</td> </tr> </table>', {closeOnClick: false, closeButton: false, className: "point-popup"});
                drawnItemsMarker.addLayer(awm).openPopup();
                $(".fa-circle-thin").removeClass("deactiveBtn");

            } else {
                drawnItemsPolygon.addLayer(e.layer);
            }
        });
        cloud.map.on('draw:drawstart', function (e) {
            infoClick.active(false); // Switch standard info click off

            if (e.layerType === "marker") {
                drawnItemsMarker.clearLayers();
                $(".fa-circle-thin").addClass("deactiveBtn");

                // Recreate buttons, so subtool bar is closed
                createBufferBtn().addTo(cloud.map);

                try {
                    cloud.map.removeLayer(circle1);
                    cloud.map.removeLayer(circle2);
                } catch (e) {
                    console.log(e.message)
                }
            } else {
                drawnItemsPolygon.clearLayers();
            }
        });
        cloud.map.on('draw:drawstop', function (e) {
            if (e.layerType === "marker") {
                buffer();
            } else {
                polygon();
            }
            infoClick.active(true); // Switch standard info click on again
        });
    }
};

var buffer = function () {
    var layer;
    for (var prop in drawnItemsMarker._layers) {
        layer = drawnItemsMarker._layers[prop];
        break;
    }
    if (typeof layer === "undefined") {
        return;
    }

    var crss = {
        "proj": "+proj=utm +zone=" + "32" + " +ellps=WGS84 +datum=WGS84 +units=m +no_defs",
        "unproj": "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs"
    };
    var reader = new jsts.io.GeoJSONReader();
    var writer = new jsts.io.GeoJSONWriter();
    var geom = reader.read(reproject.reproject(layer.toGeoJSON(), "unproj", "proj", crss));

    var c1 = reproject.reproject(writer.write(geom.geometry.buffer(500)), "proj", "unproj", crss);
    circle1 = L.geoJson(c1, {
        "color": "#ff7800",
        "weight": 1,
        "opacity": 1,
        "fillOpacity": 0.1,
        "dashArray": '5,3'
    });

    var c2 = reproject.reproject(writer.write(geom.geometry.buffer(1000)), "proj", "unproj", crss);
    circle2 = L.geoJson(c2, {
        "color": "#ff7800",
        "weight": 1,
        "opacity": 1,
        "fillOpacity": 0.1,
        "dashArray": '5,3'
    });

    store = createStore();
    store.sql = JSON.stringify([reader.read(c1).toText(), reader.read(c2).toText()]);
    //cloud.addGeoJsonStore(store);
    store.load();
};

var polygon = function () {
    var layer;
    for (var prop in drawnItemsPolygon._layers) {
        layer = drawnItemsPolygon._layers[prop];
        break;
    }
    if (typeof layer === "undefined") {
        return;
    }

    var reader = new jsts.io.GeoJSONReader();
    var geom = reader.read(layer.toGeoJSON());

    store = createStore();
    store.sql = JSON.stringify([geom.geometry.toText()]);
    //cloud.addGeoJsonStore(store);
    store.load();

    // Create a clean up click event
    /*cloud.on("click", function (e) {
     try {
     drawnItemsPolygon.clearLayers();
     } catch (e) {
     }
     });*/

};
var upDatePrintComment = function(){
    $('#main-tabs a[href="#info-content"]').tab('show');
    $("#print-comment").html($("#detail-data-r-container").html() + $("#detail-data-p-container").html());
};

var createStore = function () {
    var hit = false, isEmpty = true;
    return new geocloud.sqlStore({
        jsonp: false,
        method: "POST",
        host: "",
        db: db,
        uri: "/api/extension/cowiDetail",
        clickable: true,
        id: 1,
        onLoad: function () {
            var layerObj = this;
            $('#modal-info-body').show();
            $.each(layerObj.geoJSON.features, function (i, feature) {
                if (feature.properties.radius) { // Then Marker
                    var layer;
                    for (var prop in drawnItemsMarker._layers) {
                        layer = drawnItemsMarker._layers[prop];
                        break;
                    }
                    $("#r-coord-val").html("L: " + ( Math.round(layer._latlng.lng * 10000) / 10000) + "<br>B: " + ( Math.round(layer._latlng.lat * 10000) / 10000));

                    if (feature.properties.radius === "500") {
                        $(".r500-val").html(feature.properties.antal)
                    } else {
                        $(".r1000-val").html(feature.properties.antal)
                    }
                    $.get("https://maps.googleapis.com/maps/api/geocode/json?latlng=" + layer._latlng.lat + "," + layer._latlng.lng, function (data) {
                        $(".r-adr-val").html(data.results[0].formatted_address);
                        upDatePrintComment();
                    });

                } else {
                    $("#polygon-val").html(feature.properties.antal)
                }
            });
            upDatePrintComment();
        },
        styleMap: {
            weight: 2,
            color: '#660000',
            dashArray: '',
            fillOpacity: 0.2
        },
        onEachFeature: function (f, l) {
            if (typeof l._layers !== "undefined") {
                l._layers[Object.keys(l._layers)[0]]._vidi_type = "query_result";
            } else {
                l._vidi_type = "query_result";
            }
        }
    });
};

},{"jsts":35,"reproject":107}],13:[function(require,module,exports){
module.exports = function () {
    try {
        var max = $(document).height() - $('.tab-pane').offset().top - 70;
        return {
            max: max
        }
    } catch (e) {
        console.info(e.message);
        return 0;
    }
};
},{}],14:[function(require,module,exports){
var urlparser = require('./urlparser');
var cloud;
var advancedInfo;
var clicktimer;
var meta;
var draw;
var sqlQuery;
var qstore = [];
var active = true;

module.exports = {
    set: function (o) {
        cloud = o.cloud;
        meta = o.meta;
        draw = o.draw;
        sqlQuery = o.sqlQuery;
        advancedInfo = o.advancedInfo;
        return this;
    },
    init: function () {
        cloud.on("dblclick", function () {
            clicktimer = undefined;
        });
        cloud.on("click", function (e) {
            // Do not get info if drawing
           if (draw.getDrawOn() || advancedInfo.getSearchOn() || active === false) {
                return;
            }
            var event = new geocloud.clickEvent(e, cloud);

            if (clicktimer) {
                clearTimeout(clicktimer);
            }
            else {
                clicktimer = setTimeout(function (e) {
                    clicktimer = undefined;
                    var coords = event.getCoordinate(), wkt;
                    wkt = "POINT(" + coords.x + " " + coords.y + ")";
                    sqlQuery.init(qstore, wkt, "3857");
                }, 250);
            }
        });
    },
    reset: function(){
        sqlQuery.reset(qstore);
    },
    active: function(a){
        active = a;
    }
};



},{"./urlparser":27}],15:[function(require,module,exports){
var cloud;
var baseLayer;
var meta;
var setting;
var state;
var anchor;
var infoClick;
var search;
var bindEvent;
var draw;
var print;
var advancedInfo;
var pushState;
var extensions;
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
        bindEvent = o.bindEvent;
        draw = o.draw;
        print = o.print;
        pushState = o.pushState;
        advancedInfo = o.advancedInfo;
        extensions = o.extensions;
        return this;
    },
    init: function () {
        meta.init();
        baseLayer.init();
        setting.init();
        state.init();
        infoClick.init();
        search.init();
        draw.init();
        bindEvent.init();
        advancedInfo.init();
        print.init();

        var moveEndCallBack = function () {
            pushState.init();
        };
        cloud.on("dragend", moveEndCallBack);
        cloud.on("moveend", moveEndCallBack);
        $.material.init();

        touchScroll(".tab-pane");
    }
};
},{}],16:[function(require,module,exports){
var cloud;
var meta;
var urlparser = require('./urlparser');
var db = urlparser.db;
var BACKEND = require('../../config/config.js').backend;

module.exports = module.exports = {
    set: function (o) {
        cloud = o.cloud;
        meta = o.meta;
        return this;
    },
    init: function () {
        switch (BACKEND) {
            case "gc2":
                var param = 'l=' + cloud.getVisibleLayers(true) + '&db=' + db;
                $.ajax({
                    url: '/api/legend/' + db + '?' + param,
                    success: function (response) {
                        var list = $('<ul class="list-group"/>'), li, classUl, title, className;
                        $.each(response, function (i, v) {
                            if (typeof v.id !== "undefined") {
                                title = meta.getMetaDataKeys()[v.id.split(".")[1]].f_table_title ? meta.getMetaDataKeys()[v.id.split(".")[1]].f_table_title : meta.getMetaDataKeys()[v.id.split(".")[1]].f_table_name;
                            }
                            var u, showLayer = false;
                            if (typeof v === "object") {
                                for (u = 0; u < v.classes.length; u = u + 1) {
                                    if (v.classes[u].name !== "") {
                                        showLayer = true;
                                    }
                                }
                                if (showLayer) {
                                    li = $("<li class=''/>");
                                    classUl = $('<ul />');
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
                break;
            case "cartodb":
                setTimeout(function () {
                    var key, legend, list = $("<ul/>"), li, classUl, title, className, rightLabel, leftLabel;
                    $.each(cloud.getVisibleLayers(true).split(";"), function (i, v) {
                        key = v.split(".")[1];
                        if (typeof key !== "undefined") {
                            legend = meta.getMetaDataKeys()[key].legend;
                            try {
                                title = meta.getMetaDataKeys()[key].f_table_title;
                            }
                            catch (e) {
                            }
                            var u, showLayer = false;
                            switch (legend.type){
                                case "category":
                                    for (u = 0; u < legend.items.length; u = u + 1) {
                                        if (legend.items[u].name !== "") {
                                            showLayer = true;
                                        }
                                    }
                                    if (showLayer) {
                                        li = $("<li/>");
                                        classUl = $("<ul/>");
                                        for (u = 0; u < legend.items.length; u = u + 1) {
                                            className = "<span class='legend-text'>" + legend.items[u].name + "</span>";
                                            classUl.append("<li><span style='display: inline-block; height: 15px; width: 15px; background-color: " + legend.items[u].value + ";'></span>" + className + "</li>");
                                        }
                                        list.append($("<li>" + title + "</li>"));
                                        list.append(li.append(classUl));
                                    }
                                    break;
                                case "choropleth":
                                    for (u = 0; u < legend.items.length; u = u + 1) {
                                        if (legend.items[u].name !== "") {
                                            showLayer = true;
                                        }
                                    }
                                    if (showLayer) {
                                        li = $("<li/>");
                                        classUl = $("<ul/>");
                                        for (u = 0; u < legend.items.length; u = u + 1) {
                                            if (legend.items[u].name === "Left label") {
                                                classUl.append("<li style='display:inline;'><span class='legend-text'>" + legend.items[u].value + "</span></li>");
                                            } else if (legend.items[u].name === "Right label") {
                                                rightLabel = "<li style='display:inline;'><span class='legend-text'>" + legend.items[u].value + "</span></li>"
                                            } else {
                                                classUl.append("<li style='display:inline;'><span style='display: inline-block; height: 15px; width: 15px; background-color: " + legend.items[u].value + ";'></span></li>");
                                            }
                                        }
                                        classUl.append(rightLabel);
                                        list.append($("<li>" + title + "</li>"));
                                        list.append(li.append(classUl));
                                    }
                                    break;
                            }
                        }
                    });
                    $('#legend').html(list);
                }, 500);
                break
        }
    }

};
},{"../../config/config.js":29,"./urlparser":27}],17:[function(require,module,exports){
var urlparser = require('./urlparser');
var db = urlparser.db;
var schema = urlparser.schema;
var urlVars = urlparser.urlVars;
var metaDataKeys = [];
var metaDataKeysTitle = [];
var cloud;
var switchLayer;
var setBaseLayer;
var ready = false;
var cartoDbLayersready = false;
var BACKEND = require('../../config/config.js').backend;
var host;
try {
    host = require('../../config/config.js').gc2.host;
} catch (e){
    console.info(e.message);
}
module.exports = {
    set: function (o) {
        cloud = o.cloud;
        switchLayer = o.switchLayer;
        setBaseLayer = o.setBaseLayer;
        return this;
    },
    init: function () {
        $.ajax({
            url: '/api/meta/' + db + '/' + (window.gc2Options.mergeSchemata === null ? "" : window.gc2Options.mergeSchemata.join(",") + ',') + (typeof urlVars.i === "undefined" ? "" : urlVars.i.split("#")[1] + ',') + schema,
            scriptCharset: "utf-8",
            success: function (response) {
                var base64name, isBaseLayer, arr, groups, i, l, cv, metaData, layers = [];
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

                switch (BACKEND) {
                    case "gc2":
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
                        break;

                    case "cartodb":
                        var j = 0, tmpData = response.data.slice(); // Clone the array for async adding of CartoDB layers
                        (function iter() {
                            cartodb.createLayer(cloud.map, {
                                user_name: db,
                                type: 'cartodb',
                                sublayers: [{
                                    sql: tmpData[j].sql,
                                    cartocss: tmpData[j].cartocss
                                }]
                            }).on('done', function (layer) {
                                layer.baseLayer = false;
                                layer.id = tmpData[j].f_table_schema + "." + tmpData[j].f_table_name;
                                cloud.addLayer(layer, tmpData[j].f_table_name);
                                // We switch the layer on/off, so they become ready for state.
                                cloud.showLayer(layer.id);
                                cloud.hideLayer(layer.id);
                                j++;
                                if (j < tmpData.length) {
                                    iter();
                                } else {
                                    cartoDbLayersready = true; // CartoDB layer are now created
                                    return null;
                                }
                            });
                        }());
                        break;
                }

                response.data.reverse();
                for (i = 0; i < arr.length; ++i) {
                    if (arr[i]) {
                        l = [];
                        cv = ( typeof (metaDataKeysTitle[arr[i]]) === "object") ? metaDataKeysTitle[arr[i]].f_table_name : null;
                        base64name = Base64.encode(arr[i]).replace(/=/g, "");
                        $("#layers").append('<div class="panel panel-default" id="layer-panel-' + base64name + '"><div class="panel-heading" role="tab"><h4 class="panel-title"><div class="layer-count badge"><span>0</span> / <span></span></div><a style="display: block" class="accordion-toggle" data-toggle="collapse" data-parent="#layers" href="#collapse' + base64name + '"> ' + arr[i] + ' </a></h4></div><ul class="list-group" id="group-' + base64name + '" role="tabpanel"></ul></div>');
                        $("#group-" + base64name).append('<div id="collapse' + base64name + '" class="accordion-body collapse"></div>');
                        for (u = 0; u < response.data.length; ++u) {
                            if (response.data[u].layergroup == arr[i]) {
                                var text = (response.data[u].f_table_title === null || response.data[u].f_table_title === "") ? response.data[u].f_table_name : response.data[u].f_table_title;
                                if (response.data[u].baselayer) {
                                    $("#base-layer-list").append(
                                        "<div class='list-group-item'><div class='row-action-primary radio radio-primary base-layer-item' data-gc2-base-id='" + response.data[u].f_table_schema + "." + response.data[u].f_table_name + "'><label><input type='radio' name='baselayers'>" + text + "<span class='fa fa-check' aria-hidden='true'></span></label></div></div>"
                                    );
                                }
                                else {
                                    $("#collapse" + base64name).append('<li class="layer-item list-group-item"><div class="checkbox"><label><input type="checkbox" id="' + response.data[u].f_table_name + '" data-gc2-id="' + response.data[u].f_table_schema + "." + response.data[u].f_table_name + '">' + text + '</label></div></li>');
                                    l.push({});
                                }
                            }
                        }
                        $("#layer-panel-" + base64name + " span:eq(1)").html(l.length)
                        // Remove the group if empty
                        if (l.length === 0) {
                            $("#layer-panel-" + base64name).remove();
                        }
                    }
                }
                // Bind switch layer event
                $(".checkbox input[type=checkbox]").change(function (e) {
                    switchLayer.init($(this).data('gc2-id'), $(this).context.checked);
                    e.stopPropagation();
                });
                $(".base-layer-item").on("click", function (e) {
                    setBaseLayer.init($(this).data('gc2-base-id'));
                    e.stopPropagation();
                    $(".base-layer-item").css("background-color", "white");
                });
                ready = true;

            },
            error: function (response) {
                alert(JSON.parse(response.responseText).message);
            }
        }); // Ajax call end
    },
    getMetaDataKeys: function () {
        return metaDataKeys;
    },
    ready: function () {
        if (BACKEND === "cartodb") { // If CartoDB, we wait for cartodb.createLayer to finish
            if (ready && cartoDbLayersready) {
                return true;
            } else {
                return false;
            }
        } else { // GC2 layers are direct tile request
            return ready;
        }
    }
};



},{"../../config/config.js":29,"./urlparser":27}],18:[function(require,module,exports){
var cloud;
var printOn = false;
var recEdit;
var recScale;
var serializeLayers;
var anchor;
var lz = require('lz-string');
var base64 = require('base64-url');
var printItems = new L.FeatureGroup();
var urlparser = require('./urlparser');
var db = urlparser.db;
var schema = urlparser.schema;
var scale;
var center;
config = require('../../config/config.js');

var printC = config.print.templates;
var scales = config.print.scales;
var tmpl;
var pageSize;
var orientation;

var cleanUp = function () {
    try {
        cloud.map.removeLayer(recScale);
        cloud.map.removeLayer(recEdit);
    } catch (e) {
    }
    printOn = false;
};

module.exports = {
    set: function (o) {
        cloud = o.cloud;
        serializeLayers = o.serializeLayers;
        anchor = o.anchor;
        cloud.map.addLayer(printItems);
        return this;
    },
    init: function () {
        // pass
    },
    activate: function () {
        if (!printOn) {
            $("#print-form :input, #start-print-btn, #select-scale").prop("disabled", false);
            $("#print-tmpl").empty();
            $("#print-size").empty();
            $("#print-orientation").empty();
            $("#select-scale").empty();
            center = null;
            scale = null;

            // Set up print dialog
            for (var i = 0; i < scales.length; i++) {
                $("#select-scale").append("<option value='" + scales[i] + "'>1:" + scales[i] + "</option>");
            }
            $("#select-scale").change(function (e) {
                console.log(e.target.value)
                scale = e.target.value;
                change();

            });

            $.each(printC, function (i, v) {
                $("#print-tmpl").append('<div class="radio radio-primary"><label><input type="radio" class="print print-tmpl" name="print-tmpl" id="' + i + '" value="' + i + '">' + i + '</label></div>');
            });

            $(".print-tmpl").change(function (e) {
                $("#print-size").empty();
                $("#print-orientation").empty();

                $.each(printC[e.target.value], function (i, v) {
                    $("#print-size").append('<div class="radio radio-primary"><label><input type="radio" class="print print-size" name="print-size" id="' + i + '" value="' + i + '">' + i + '</label></div>');
                });

                // Click the first options in size
                setTimeout(function () {
                    $("input:radio[name=print-size]:first").trigger("click");
                }, 100);

                $(".print-size").change(function (e) {
                    $("#print-orientation").empty();
                    change();

                    // Click the first options in orientation
                    setTimeout(function () {
                        $("input:radio[name=print-orientation]:first").trigger("click");
                    }, 100);
                });

                $(".print-size").change(function (e) {
                    $("#print-orientation").empty();
                    $.each(printC[$('input[name=print-tmpl]:checked', '#print-form').val()][e.target.value], function (i, v) {
                        $("#print-orientation").append('<div class="radio radio-primary"><label><input type="radio" class="print print-orientation" name="print-orientation" id="' + i + '" value="' + i + '">' + (i === "l" ? "Landscape" : "Portrait") + '</label></div>');
                    });
                    $(".print-orientation").change(function (e) {
                        change();
                    });
                });
            });

            // Click the first options in all
            $("input:radio[name=print-tmpl]:first").trigger("click");
            setTimeout(function () {
                $("input:radio[name=print-size]:first").trigger("click");
                setTimeout(function () {
                    $("input:radio[name=print-orientation]:first").trigger("click");
                }, 100)
            }, 100);


            $(".print-tmpl").change(function (e) {
                change();
            });

            var me = this;
            var change = function () {
                var arr = $("#print-form").serializeArray();
                $("#get-print-fieldset").prop("disabled", true);
                if (arr.length === 3) {
                    cleanUp();
                    tmpl = arr[0].value;
                    pageSize = arr[1].value;
                    orientation = arr[2].value;
                    me.control();
                } else {
                    cleanUp();
                }
            };
        } else {
            cleanUp();
            $("#print-form :input, #start-print-btn, #select-scale").prop("disabled", true);
        }
    },
    print: function () {
        var layerDraw = [], layerQueryDraw = [], layerQueryResult = [], layerQueryBuffer = [], layerPrint = [], e;
        try {
            recEdit.editing.disable();
        } catch (e) {
        }

        e = serializeLayers.serialize({
            "printHelper": true,
            "query_draw": true,
            "query_buffer": true,
            "query_result": true,
            "print": true,
            "draw": false // Get draw
        });

        $.each(e, function (i, v) {
            if (v.type === "Vector") {
                layerDraw.push({geojson: v.geoJson})
            }
        });

        e = serializeLayers.serialize({
            "printHelper": true,
            "query_draw": false, // Get query draw
            "query_buffer": true,
            "query_result": true,
            "draw": true,
            "print": true
        });

        $.each(e, function (i, v) {
            if (v.type === "Vector") {
                layerQueryDraw.push({geojson: v.geoJson})
            }
        });

        e = serializeLayers.serialize({
            "printHelper": true,
            "query_draw": true,
            "query_buffer": false, // Get query buffer draw
            "query_result": true,
            "draw": true,
            "print": true
        });

        $.each(e, function (i, v) {
            if (v.type === "Vector") {
                layerQueryBuffer.push({geojson: v.geoJson})
            }
        });

        e = serializeLayers.serialize({
            "printHelper": true,
            "query_draw": true,
            "query_buffer": true,
            "query_result": false, // Get result
            "draw": true,
            "print": true
        });

        $.each(e, function (i, v) {
            if (v.type === "Vector") {
                layerQueryResult.push({geojson: v.geoJson})
            }
        });
        //console.log(layerQueryResult)

        e = serializeLayers.serialize({
            "printHelper": true,
            "query_draw": true,
            "query_buffer": true,
            "query_result": true,
            "draw": true,
            "print": false // Get print
        });

        $.each(e, function (i, v) {
            if (v.type === "Vector") {
                layerPrint.push({geojson: v.geoJson})
            }
        });

        recEdit.editing.enable();

        $.ajax({
            dataType: "json",
            method: "post",
            url: '/api/print/',
            contentType: "application/json",
            data: JSON.stringify({
                db: db,
                schema: schema,
                draw: (typeof  layerDraw[0] !== "undefined" && layerDraw[0].geojson.features.length > 0) ? layerDraw : null,
                queryDraw: (typeof  layerQueryDraw[0] !== "undefined" && layerQueryDraw[0].geojson.features.length > 0) ? layerQueryDraw : null,
                queryBuffer: (typeof  layerQueryBuffer[0] !== "undefined" && layerQueryBuffer[0].geojson.features.length > 0) ? layerQueryBuffer : null,
                queryResult: (typeof  layerQueryResult[0] !== "undefined" && layerQueryResult[0].geojson.features.length > 0) ? layerQueryResult : null,
                print: (typeof  layerPrint[0] !== "undefined" && layerPrint[0].geojson.features.length > 0) ? layerPrint : null,
                anchor: anchor.getAnchor(),
                bounds: recScale.getBounds(),
                scale: scale,
                tmpl: tmpl,
                pageSize: pageSize,
                orientation: orientation,
                title: $("#print-title").val(),
                comment: $("#print-comment").val()
            }),
            scriptCharset: "utf-8",
            success: function (response) {
                $("#get-print-fieldset").prop("disabled", false);
                $("#download-pdf, #open-pdf").attr("href", "/static/tmp/print/pdf/" + response.key + ".pdf");
                $("#download-pdf").attr("download", response.key);
                $("#open-html").attr("href", response.url);
                $("#start-print-btn").button('reset')
            }
        });
    },
    control: function () {
        if (!printOn) {
            printOn = true;
            var ps = printC[tmpl][pageSize][orientation].mapsizeMm, curScale, newScale, curBounds, newBounds;
            var _getScale = function (scaleObject) {
                var bounds = scaleObject.getBounds(),
                    sw = bounds.getSouthWest(),
                    ne = bounds.getNorthEast(),
                    halfLat = (sw.lat + ne.lat) / 2,
                    midLeft = L.latLng(halfLat, sw.lng),
                    midRight = L.latLng(halfLat, ne.lng),
                    mwidth = midLeft.distanceTo(midRight),
                    closest = Number.POSITIVE_INFINITY,
                    i = scales.length,
                    diff,
                    mscale = mwidth * 1000 / ps[0];
                curScale = scale;
                while (i--) {
                    diff = Math.abs(mscale - scales[i]);
                    if (diff < closest) {
                        closest = diff;
                        scale = parseInt(scales[i], 10);
                    }
                }
                newScale = scale;
                newBounds = [sw.lat, sw.lng, ne.lat, ne.lng];
                //console.log(mscale);
                //console.log(scale);

                // Get utm zone
                var zone = require('./utmZone.js').getZone(sw.lat, sw.lng);
                Proj4js.defs["EPSG:32632"] = "+proj=utm +zone=" + zone + " +ellps=WGS84 +datum=WGS84 +units=m +no_defs";
                return scale;
            };

            var rectangle = function (initCenter, scaleObject, color, initScale, isFirst) {
                scale = initScale || _getScale(scaleObject);
                $("#select-scale").val(scale);

                if (isFirst) {
                    var scaleIndex = scales.indexOf(scale);
                    if (scaleIndex > 1) {
                        scaleIndex = scaleIndex-2;
                    } else if (scaleIndex > 0) {
                        scaleIndex = scaleIndex-1;
                    }
                    scale = scales[scaleIndex];
                }

                var centerM = geocloud.transformPoint(initCenter.lng, initCenter.lat, "EPSG:4326", "EPSG:32632");
                var printSizeM = [(ps[0] * scale / 1000), (ps[1] * scale / 1000)];
                var printSwM = [centerM.x - (printSizeM[0] / 2), centerM.y - (printSizeM[1] / 2)];
                var printNeM = [centerM.x + (printSizeM[0] / 2), centerM.y + (printSizeM[1] / 2)];
                var printSwG = geocloud.transformPoint(printSwM[0], printSwM[1], "EPSG:32632", "EPSG:4326");
                var printNeG = geocloud.transformPoint(printNeM[0], printNeM[1], "EPSG:32632", "EPSG:4326");
                var rectangle = L.rectangle([[printSwG.y, printSwG.x], [printNeG.y, printNeG.x]], {
                    color: color,
                    fillOpacity: 0,
                    aspectRatio: (ps[0] / ps[1])
                });
                center = rectangle.getBounds().getCenter();
                return rectangle;
            };

            var first = center ? false : true;
            center = center || cloud.map.getCenter(); // Init center as map center
            recEdit = rectangle(center, cloud.map, "yellow", scale, first);
            recEdit._vidi_type = "printHelper";
            printItems.addLayer(recEdit);
            recEdit.editing.enable();

            recScale = rectangle(recEdit.getBounds().getCenter(), recEdit, "red");
            recScale._vidi_type = "print";
            printItems.addLayer(recScale);

            var sw = recEdit.getBounds().getSouthWest(),
                ne = recEdit.getBounds().getNorthEast();

            curBounds = [sw.lat, sw.lng, ne.lat, ne.lng];

            recEdit.on('edit', function (e) {
                    rectangle(recEdit.getBounds().getCenter(), recEdit, "red");

                    if (curScale !== newScale || (curBounds[0] !== newBounds[0] && curBounds[1] !== newBounds[1] && curBounds[2] !== newBounds[2] && curBounds[3] !== newBounds[3])) {
                        cloud.map.removeLayer(recScale);
                        recScale = rectangle(recEdit.getBounds().getCenter(), recEdit, "red");
                        recScale._vidi_type = "print";
                        printItems.addLayer(recScale);
                        $("#get-print-fieldset").prop("disabled", true);
                    }
                    recEdit.editing.disable();
                    recEdit.setBounds(recScale.getBounds());
                    recEdit.editing.enable();

                    var sw = recEdit.getBounds().getSouthWest(),
                        ne = recEdit.getBounds().getNorthEast();
                    curBounds = [sw.lat, sw.lng, ne.lat, ne.lng];
                }
            );

        } else {
            //clean up
            cleanUp();
        }
    }
};

},{"../../config/config.js":29,"./urlparser":27,"./utmZone.js":28,"base64-url":31,"lz-string":36}],19:[function(require,module,exports){
var meta;
var anchor;
var first = true;
var t;
module.exports = module.exports = {
    set: function (o) {
        meta = o.meta;
        anchor = o.anchor;
        return this;
    },
    init: function () {
        // We don't set any state until 1 secs after the first request. This way CartoDB layers becomes ready.
        t = first ? 1000 : 0;
        setTimeout(function () {
            //console.log("State push");
            history.pushState(null, null, anchor.init());
            first = false;
        }, t);
    }
};
},{}],20:[function(require,module,exports){
var cloud;
var config = require('../../../config/config.js').search.danish;

module.exports = {
    set: function (o) {
        cloud = o.cloud;
        return this;
    },
    init: function () {
        var type1, type2, gids = [], searchString,
            komKode = config.komkode,
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
                    if (cloud.map.getZoom() > 17) {
                        cloud.map.setZoom(17);
                    }
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
                    placeStore.sql = "SELECT gid,the_geom,ST_asgeojson(ST_transform(the_geom,4326)) as geojson FROM adresse.adgang4 WHERE gid=" + gids[datum.value];
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


},{"../../../config/config.js":29}],21:[function(require,module,exports){
var cloud;
module.exports = module.exports = {
    set: function (o) {
        cloud = o.cloud;
        return this;
    },
    init: function (str) {

    },
    serialize: function(filters){
        var e = _encodeLayers(cloud.map);
        $.each(e, function (i, v) {
            if (typeof v.geoJson !== "undefined") {
                // Loop backwards
                for (var key = v.geoJson.features.length -1 ; key > -1 ; key--) {
                    if (filters[v.geoJson.features[key]._vidi_type]) {
                        v.geoJson.features.splice(key, 1);
                    }
                }
            }
        });
        return e;
    }
};

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
        //console.log(vectors);
        enc.push(_encoders.layers.vector.call(this, vectors));
    }
    return enc;
};
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
                resolutions.push(L.print.Provider.MAX_RESOLUTION / Math.pow(2, zoom));
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
                    maxExtent: L.print.Provider.MAX_EXTENT,
                    resolutions: resolutions,
                    tileOrigin: {x: L.print.Provider.MAX_EXTENT[0], y: L.print.Provider.MAX_EXTENT[0]},
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
                    maxExtent: L.print.Provider.MAX_EXTENT,
                    resolutions: resolutions,
                    tileOrigin: {x: L.print.Provider.MAX_EXTENT[0], y: L.print.Provider.MAX_EXTENT[0]},
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
                resolutions.push(L.print.Provider.MAX_RESOLUTION / Math.pow(2, zoom));
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
                maxExtent: L.print.Provider.MAX_EXTENT,
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
                extent: _projectBounds(L.print.Provider.SRS, layer._bounds)
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

                if (feature instanceof L.Marker) {
                    var icon = feature.options.icon,
                        iconUrl = icon.options.iconUrl || L.Icon.Default.imagePath + '/marker-icon.png',
                        iconSize = L.Util.isArray(icon.options.iconSize) ? new L.Point(icon.options.iconSize[0], icon.options.iconSize[1]) : icon.options.iconSize,
                        iconAnchor = L.Util.isArray(icon.options.iconAnchor) ? new L.Point(icon.options.iconAnchor[0], icon.options.iconAnchor[1]) : icon.options.iconAnchor,
                        scaleFactor = (72 / L.print.Provider.DPI); // TODO set dpi

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

                if (feature instanceof L.Circle){
                    featureGeoJson = {_latlng: feature._latlng, _mRadius: feature._mRadius, _radius: feature._radius};
                    featureGeoJson.type = "Circle";
                    featureGeoJson.feature = feature.feature;
                } else if (feature instanceof L.Rectangle) {
                    featureGeoJson = {_latlngs: feature._latlngs};
                    featureGeoJson.type = "Rectangle";
                    featureGeoJson.feature = feature.feature;
                } else if (feature instanceof L.Marker) {
                    featureGeoJson = {_latlng: feature._latlng};
                    featureGeoJson.type = "Marker";
                    featureGeoJson.feature = feature.feature;
                } else
                {
                    featureGeoJson = feature.toGeoJSON();
                    featureGeoJson.geometry.coordinates = _projectCoords(L.print.Provider.SRS, featureGeoJson.geometry.coordinates);
                    featureGeoJson.type = "Feature";
                }


                featureGeoJson.style = style;
                featureGeoJson._vidi_type = feature._vidi_type;

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

    var i;
    // Layers with equal zIndexes can cause problems with mapfish print
    for (i = 1; i < markers.length; i++) {
        if (markers[i]._icon.style.zIndex <= markers[i - 1]._icon.style.zIndex) {
            markers[i]._icon.style.zIndex = markers[i - 1].icons.style.zIndex + 1;
        }
    }

    tiles.sort(function (a, b) {
        return a._container.style.zIndex - b._container.style.zIndex;
    });

    // Layers with equal zIndexes can cause problems with mapfish print
    for (i = 1; i < tiles.length; i++) {
        if (tiles[i]._container.style.zIndex <= tiles[i - 1]._container.style.zIndex) {
            tiles[i]._container.style.zIndex = tiles[i - 1]._container.style.zIndex + 1;
        }
    }

    imageNodes = [].slice.call(this, map._panes.overlayPane.childNodes);
    imageOverlays.sort(function (a, b) {
        return imageNodes.indexOf(a._image) - imageNodes.indexOf(b._image);
    });

    if (map._pathRoot) {
        pathNodes = [].slice.call(this, map._pathRoot.childNodes);
        vectors.sort(function (a, b) {
            return pathNodes.indexOf(a._container) - pathNodes.indexOf(b._container);
        });
    }

    return tiles.concat(vectors).concat(imageOverlays).concat(markers);
};

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
    return L.polygon(points).toGeoJSON();
};

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
        fillOpacity: options.fillOpacity,
        dashArray: options.dashArray
    };
};

var _projectCoords = function (crs, coords) {
    var crsKey = crs.toUpperCase().replace(':', ''),
        crsClass = L.CRS[crsKey];

    if (!crsClass) {
        throw 'Unsupported coordinate reference system: ' + crs;
    }

    //return _project(crsClass, coords);
    return coords;
};

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

},{}],22:[function(require,module,exports){
var cloud;
var anchor;
var pushState;
module.exports = module.exports = {
    set: function (o) {
        cloud = o.cloud;
        anchor = o.anchor;
        pushState = o.pushState;
        return this;
    },
    init: function (str) {
        cloud.setBaseLayer(str);
        pushState.init();
    }
};
},{}],23:[function(require,module,exports){
var urlparser = require('./urlparser');
var db = urlparser.db;
var schema = urlparser.schema;
var ready = false;
module.exports = {
    set: function () {
    },
    init: function () {
        $.ajax({
            url: '/api/setting/' + db + '/' + schema,
            scriptCharset: "utf-8",
            success: function (response) {
                if (typeof response.data.extents === "object") {
                    var firstSchema = schema.split(",").length > 1 ? schema.split(",")[0] : schema;
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
},{"./urlparser":27}],24:[function(require,module,exports){
var urlparser = require('./urlparser');
var db = urlparser.db;
var cloud;
var meta;
var draw;
var advancedInfo;
var BACKEND = require('../../config/config.js').backend;

module.exports = {
    set: function (o) {
        cloud = o.cloud;
        meta = o.meta;
        draw = o.draw;
        advancedInfo = o.advancedInfo;
        return this;
    },
    init: function (qstore, wkt, proj) {
        var layers, count = 0, hit = false, distance;
        var metaDataKeys = meta.getMetaDataKeys();
        this.reset(qstore);
        layers = cloud.getVisibleLayers().split(";");

        //$("#info-content .alert").hide();
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
            var fieldConf = $.parseJSON(metaDataKeys[value.split(".")[1]].fieldconf);

            if (geoType !== "POLYGON" && geoType !== "MULTIPOLYGON") {
                var res = [156543.033928, 78271.516964, 39135.758482, 19567.879241, 9783.9396205,
                    4891.96981025, 2445.98490513, 1222.99245256, 611.496226281, 305.748113141, 152.87405657,
                    76.4370282852, 38.2185141426, 19.1092570713, 9.55462853565, 4.77731426782, 2.38865713391,
                    1.19432856696, 0.597164283478, 0.298582141739, 0.149291];
                distance = 5 * res[cloud.getZoom()];
            }
            var onLoad = function () {
                var layerObj = this, out = [], fieldLabel, cm = [], first = true, storeId = this.id;
                isEmpty = layerObj.isEmpty();
                if (!isEmpty && !not_querable) {
                    $('#modal-info-body').show();
                    $("#info-tab").append('<li><a id="tab_' + storeId + '" data-toggle="tab" href="#_' + storeId + '">' + layerTitel + '</a></li>');
                    $("#info-pane").append('<div class="tab-pane" id="_' + storeId + '"><div class="panel panel-default"><div class="panel-body"><table class="table" data-detail-view="true" data-detail-formatter="detailFormatter" data-show-toggle="true" data-show-export="true" data-show-columns="true"></table></div></div></div>');
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
                        if (first) {
                            $.each(out, function (name, property) {
                                cm.push({
                                    header: property[2],
                                    dataIndex: property[0],
                                    sortable: true
                                })
                            });
                            first = false;
                        }
                        $('#tab_' + storeId).tab('show');
                        out = [];
                    });
                    var height;
                    try {
                        height = require('./height')().max - 400;
                    } catch (e) {
                        console.info(e.message);
                        height = 0;
                    }
                    gc2table.init({
                        el: "#_" + storeId + " table",
                        geocloud2: cloud,
                        store: layerObj,
                        cm: cm,
                        autoUpdate: false,
                        openPopUp: true,
                        setViewOnSelect: true,
                        responsive: false,
                        height: (height > 500) ? 500 : (height < 300) ? 300 : height
                    });
                    hit = true;
                    // Add fancy material raised style to buttons
                    $(".bootstrap-table .btn-default").addClass("btn-raised");
                    // Stop the click on detail icon from bubbling up the DOM tree
                    $(".detail-icon").click(function (event) {
                        event.stopPropagation();
                    })
                } else {
                    layerObj.reset();
                }
                count++;
                if (count === layers.length) {
                    //$('#info-tab a:first').tab('show');

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

            qstore[index] = new geocloud.sqlStore({
                jsonp: false,
                method: "POST",
                host: "",
                db: db,
                uri: "/api/sql",
                clickable: true,
                id: index,
                onLoad: onLoad,
                styleMap: {
                    weight: 5,
                    color: '#660000',
                    dashArray: '',
                    fillOpacity: 0.2
                },
                onEachFeature: function (f, l) {
                    if (typeof l._layers !== "undefined") {
                        //l._layers[Object.keys(l._layers)[0]]._vidi_type = "query_result";
                        $.each(l._layers, function (i, v) {
                            v._vidi_type = "query_result";
                        })
                    } else {
                        l._vidi_type = "query_result";
                    }
                }
            });

            cloud.addGeoJsonStore(qstore[index]);
            var sql, f_geometry_column = metaDataKeys[value.split(".")[1]].f_geometry_column;
            if (geoType === "RASTER") {
                sql = "SELECT foo.the_geom,ST_Value(rast, foo.the_geom) As band1, ST_Value(rast, 2, foo.the_geom) As band2, ST_Value(rast, 3, foo.the_geom) As band3 " +
                    "FROM " + value + " CROSS JOIN (SELECT ST_transform(ST_GeomFromText('" + wkt + "'," + proj + ")," + srid + ") As the_geom) As foo " +
                    "WHERE ST_Intersects(rast,the_geom) ";
            } else {
                if (geoType !== "POLYGON" && geoType !== "MULTIPOLYGON" && (!advancedInfo.getSearchOn())) {
                    sql = "SELECT * FROM " + (BACKEND === "cartodb" ? "(" + cartoSql + ") as foo" : value) + " WHERE round(ST_Distance(ST_Transform(\"" + f_geometry_column + "\"," + proj + "), ST_GeomFromText('" + wkt + "'," + proj + "))) < " + distance;
                    if (versioning) {
                        sql = sql + " AND gc2_version_end_date IS NULL ";
                    }
                    sql = sql + " ORDER BY round(ST_Distance(ST_Transform(\"" + f_geometry_column + "\"," + proj + "), ST_GeomFromText('" + wkt + "'," + proj + ")))";
                } else {
                    sql = "SELECT * FROM " + (BACKEND === "cartodb" ? "(" + cartoSql + ") as foo" : value) + " WHERE ST_Intersects(ST_Transform(ST_geomfromtext('" + wkt + "'," + proj + ")," + srid + ")," + f_geometry_column + ")";
                    if (versioning) {
                        sql = sql + " AND gc2_version_end_date IS NULL ";
                    }
                }
            }
            sql = sql + "LIMIT 500";
            qstore[index].sql = sql;
            qstore[index].load();
        });
    },
    reset: function (qstore) {
        $.each(qstore, function (index, store) {
            store.abort();
            store.reset();
            cloud.removeGeoJsonStore(store);
        });
        $("#info-tab").empty();
        $("#info-pane").empty();
    }
};

},{"../../config/config.js":29,"./height":13,"./urlparser":27}],25:[function(require,module,exports){
var urlparser = require('./urlparser');
var hash = urlparser.hash;
var urlVars = urlparser.urlVars;
var cloud;
var meta;
var setting;
var setBaseLayer;
var switchLayer;
var legend;
var draw;
var advancedInfo;
var lz = require('lz-string');
var base64 = require('base64-url');
var BACKEND = require('../../config/config.js').backend;

module.exports = {
    set: function (o) {
        cloud = o.cloud;
        meta = o.meta;
        setting = o.setting;
        setBaseLayer = o.setBaseLayer;
        switchLayer = o.switchLayer;
        legend = o.legend;
        draw = o.draw;
        advancedInfo = o.advancedInfo;
        return this;
    },
    init: function () {
        var p, hashArr = hash.replace("#", "").split("/");
        if (hashArr[1] && hashArr[2] && hashArr[3]) {
            p = geocloud.transformPoint(hashArr[2], hashArr[3], "EPSG:4326", "EPSG:900913");
            cloud.zoomToPoint(p.x, p.y, hashArr[1]);
        } else {
            cloud.zoomToExtent();
        }
        (function pollForLayers() {
            if (meta.ready() && setting.ready()) {
                var p, arr, i;
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
                    }
                    legend.init();
                } else {
                    setBaseLayer.init(window.setBaseLayers[0].id);
                    if (extent !== null) {
                        if (BACKEND === "cartodb") {
                            cloud.map.fitBounds(extent);
                        } else {
                            cloud.zoomToExtent(extent);
                        }
                    } else {
                        cloud.zoomToExtent();
                    }
                }
                if (typeof urlVars.k !== "undefined") {
                    var parr, v, l, t, GeoJsonAdded = false;
                    parr = urlVars.k.split("#");
                    if (parr.length > 1) {
                        parr.pop();
                    }
                    $.ajax({
                        dataType: "json",
                        method: "get",
                        url: '/api/postdata/',
                        //contentType: "application/json",
                        data: {
                            k: parr.join()
                        },
                        scriptCharset: "utf-8",
                        success: function (response) {
                            if (response.data.bounds !== null) {
                                var bounds = response.data.bounds;
                                cloud.map.fitBounds([bounds._northEast, bounds._southWest], {animate: false})
                            }
                            // Recreate print
                            if (response.data.print !== null) {
                                GeoJsonAdded = false;
                                parr = response.data.print;
                                v = parr;
                                $.each(v[0].geojson.features, function (n, m) {
                                    if (m.type === "Rectangle") {
                                        var g = L.rectangle([m._latlngs[0], m._latlngs[2]], {
                                            fillOpacity: 0,
                                            opacity: 1,
                                            color: 'red',
                                            weight: 1
                                        });
                                        g.feature = m.feature;
                                        cloud.map.addLayer(g);
                                        setTimeout(function () {
                                            var bounds = g.getBounds(),
                                                sw = bounds.getSouthWest(),
                                                ne = bounds.getNorthEast(),
                                                halfLat = (sw.lat + ne.lat) / 2,
                                                midLeft = L.latLng(halfLat, sw.lng),
                                                midRight = L.latLng(halfLat, ne.lng),
                                                scaleFactor = ($("#pane1").width() / (cloud.map.project(midRight).x - cloud.map.project(midLeft).x));

                                            $("#container1").css("transform", "scale(" + scaleFactor + ")");
                                            $(".leaflet-control-graphicscale").prependTo("#scalebar").css("transform", "scale(" + scaleFactor + ")");
                                            $("#scale").html("1 : " + response.data.scale);
                                            $("#title").html(decodeURI(urlVars.t));
                                            parr = urlVars.c.split("#");
                                            if (parr.length > 1) {
                                                parr.pop();
                                            }
                                            $("#comment").html(decodeURI(parr.join()));
                                            // Check
                                            var mwidth = midLeft.distanceTo(midRight);
                                            var mscale = mwidth * 1000 / 297;
                                            cloud.map.removeLayer(g);
                                        }, 300)
                                    }
                                });
                            }

                            // Recreate Drawings
                            if (response.data.draw !== null) {
                                GeoJsonAdded = false;
                                parr = response.data.draw;
                                v = parr;
                                draw.control();
                                l = draw.getLayer();
                                t = draw.getTable();
                                $.each(v[0].geojson.features, function (n, m) {
                                    if (m.type === "Feature" && GeoJsonAdded === false) {
                                        var g = L.geoJson(v[0].geojson, {
                                            style: function (f) {
                                                return f.style;
                                            }
                                        });
                                        $.each(g._layers, function (i, v) {
                                            l.addLayer(v);
                                        });
                                        GeoJsonAdded = true;
                                    }
                                    if (m.type === "Circle") {
                                        g = L.circle(m._latlng, m._mRadius, m.style);
                                        g.feature = m.feature;
                                        l.addLayer(g);
                                    }
                                    if (m.type === "Rectangle") {
                                        g = L.rectangle([m._latlngs[0], m._latlngs[2]], m.style);
                                        g.feature = m.feature;
                                        l.addLayer(g);
                                    }
                                    if (m.type === "Marker") {
                                        g = L.marker(m._latlng, m.style);
                                        g.feature = m.feature;
                                        l.addLayer(g);
                                    }
                                });
                                t.loadDataInTable();
                                draw.control();
                            }

                            // Recreate query draw
                            if (response.data.queryDraw !== null) {
                                GeoJsonAdded = false;
                                parr = response.data.queryDraw;
                                v = parr;
                                l = advancedInfo.getDrawLayer();
                                $.each(v[0].geojson.features, function (n, m) {
                                    if (m.type === "Feature" && GeoJsonAdded === false) {
                                        var g = L.geoJson(v[0].geojson, {
                                            style: function (f) {
                                                return f.style;
                                            }
                                        });
                                        $.each(g._layers, function (i, v) {
                                            l.addLayer(v);
                                        });
                                        GeoJsonAdded = true;
                                    }
                                    if (m.type === "Circle") {
                                        g = L.circle(m._latlng, m._mRadius, m.style);
                                        g.feature = m.feature;
                                        l.addLayer(g);
                                    }
                                    if (m.type === "Rectangle") {
                                        g = L.rectangle([m._latlngs[0], m._latlngs[2]], m.style);
                                        g.feature = m.feature;
                                        l.addLayer(g);
                                    }
                                    if (m.type === "Marker") {
                                        g = L.marker(m._latlng, m.style);
                                        g.feature = m.feature;
                                        l.addLayer(g);
                                    }
                                });
                            }

                            // Recreate query buffer
                            if (response.data.queryBuffer !== null) {
                                GeoJsonAdded = false;
                                parr = response.data.queryBuffer;
                                v = parr;
                                l = advancedInfo.getDrawLayer();
                                $.each(v[0].geojson.features, function (n, m) {
                                    if (m.type === "Feature" && GeoJsonAdded === false) {
                                        var g = L.geoJson(v[0].geojson, {
                                            style: function (f) {
                                                return f.style;
                                            }
                                        });
                                        $.each(g._layers, function (i, v) {
                                            l.addLayer(v);
                                        });
                                        GeoJsonAdded = true;
                                    }
                                });
                            }

                            // Recreate result
                            if (response.data.queryResult !== null) {
                                GeoJsonAdded = false;
                                parr = response.data.queryResult;
                                v = parr;
                                $.each(v[0].geojson.features, function (n, m) {
                                    if (m.type === "Feature" && GeoJsonAdded === false) {
                                        var g = L.geoJson(v[0].geojson, {
                                            style: function (f) {
                                                return f.style;
                                            }
                                        });
                                        $.each(g._layers, function (i, v) {
                                            cloud.map.addLayer(v);
                                        });
                                        GeoJsonAdded = true;
                                    }
                                    if (m.type === "Circle") {
                                        g = L.circleMarker(m._latlng, m.style);
                                        g.setRadius(m._radius);
                                        g.feature = m.feature;
                                        cloud.map.addLayer(g);
                                    }
                                });
                            }


                        }
                    });


                }
            } else {
                setTimeout(pollForLayers, 50);
            }
        }());
    }
};
},{"../../config/config.js":29,"./urlparser":27,"base64-url":31,"lz-string":36}],26:[function(require,module,exports){
var cloud;
var legend;
var anchor;
var pushState;
module.exports = module.exports = {
    set: function (o) {
        cloud = o.cloud;
        legend = o.legend;
        anchor = o.anchor;
        pushState = o.pushState;
        return this;
    },
    init: function (name, visible, doNotLegend) {
        var el = $('*[data-gc2-id="' + name + '"]');


        if (visible) {
            try {
                cloud.showLayer(name);
                el.prop('checked', true);
            } catch (e) {
                //Pass
            }
        } else {
            cloud.hideLayer(name);
            el.prop('checked', false);
        }

        var siblings = el.parents(".accordion-body").find("input");

        var c = 0;
        $.each(siblings, function (i, v) {
            if (v.checked) {
                c = c + 1;
            }

        });
        el.parents(".panel").find("span:eq(0)").html(c);

        pushState.init();

        if (!doNotLegend) {
            legend.init();

        }
    }
};



},{}],27:[function(require,module,exports){
var uri = geocloud.pathName;
module.exports = {
    hostname: geocloud_host,
    hash: decodeURIComponent(geocloud.urlHash),
    db: uri[2],
    schema: uri[3],
    urlVars: geocloud.urlVars
}
},{}],28:[function(require,module,exports){
module.exports = {
    set: function (o) {
        return this;
    },
    init: function () {
    },
    getZone: function (lat, lng) {
        // Get the UTM zone
        var zoneNumber = Math.floor((lng + 180) / 6) + 1;

        if (lat >= 56.0 && lat < 64.0 && lng >= 3.0 && lng < 12.0) {
            zoneNumber = 32;
        }
        //Special zones for Svalbard
        if (lat >= 72.0 && lat < 84.0) {
            if (lng >= 0.0 && lng < 9.0) {
                zoneNumber = 31;
            }
            else if (lng >= 9.0 && lng < 21.0) {
                zoneNumber = 33;
            }
            else if (lng >= 21.0 && lng < 33.0) {
                zoneNumber = 35;
            }
            else if (lng >= 33.0 && lng < 42.0) {
                zoneNumber = 37;
            }
        }
        return zoneNumber;
    }
};
},{}],29:[function(require,module,exports){
module.exports = {
    backend: "gc2",
    //backend: "cartodb",
    gc2: {
        //host: "http://192.168.33.11"
        host: "http://cowi.mapcentia.com"
    },
    cartodb: {
        db: "mhoegh",
        baseLayers: [
            {
                type: "XYZ",
                url: "http://54.229.79.223/v2/Teknisk_baggrundskort/{z}/{x}/{y}.png",
                id: "Tekniskkort",
                name: "Tekniskkort",
                description: "Tekniskkort FOT",
                attribution: "Frederiksberg Kommune"
            },
            {"id": "osm", "name": "OSM"},
            {"id": "stamenToner", "name": "Stamen Toner"}
        ]
    },
    print: {
        templates: {
            "print": {
                A4: {
                    l: {
                        mapsizePx: [1000, 700],
                        mapsizeMm: [270, 190]
                    },
                    p: {
                        mapsizePx: [700, 1000],
                        mapsizeMm: [190, 270]
                    }
                },
                A3: {
                    l: {
                        mapsizePx: [1480, 1040],
                        mapsizeMm: [401, 282]
                    },
                    p: {
                        mapsizePx: [1040, 1480],
                        mapsizeMm: [282, 401]
                    }
                }
            }
        },
        scales: [250, 500, 1000, 2000, 3000, 4000, 5000, 7500, 10000, 15000, 25000, 50000, 100000]
    },
    search: {
      danish : {
          komkode: "147"
      }
    },
    extensions: {
        //browser: [{cowiDetail: ["bufferSearch"]}],
        //server: [{cowiDetail: ["bufferSearch"]}]
    },
    _template: "cowiDetail.tmpl",
    brandName: "MapCentia"
};
},{}],30:[function(require,module,exports){
'use strict'

exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

function init () {
  var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
  for (var i = 0, len = code.length; i < len; ++i) {
    lookup[i] = code[i]
    revLookup[code.charCodeAt(i)] = i
  }

  revLookup['-'.charCodeAt(0)] = 62
  revLookup['_'.charCodeAt(0)] = 63
}

init()

function toByteArray (b64) {
  var i, j, l, tmp, placeHolders, arr
  var len = b64.length

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // the number of equal signs (place holders)
  // if there are two placeholders, than the two characters before it
  // represent one byte
  // if there is only one, then the three characters before it represent 2 bytes
  // this is just a cheap hack to not do indexOf twice
  placeHolders = b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0

  // base64 is 4/3 + up to two characters of the original data
  arr = new Arr(len * 3 / 4 - placeHolders)

  // if there are placeholders, only get up to the last complete 4 chars
  l = placeHolders > 0 ? len - 4 : len

  var L = 0

  for (i = 0, j = 0; i < l; i += 4, j += 3) {
    tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)]
    arr[L++] = (tmp >> 16) & 0xFF
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  if (placeHolders === 2) {
    tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[L++] = tmp & 0xFF
  } else if (placeHolders === 1) {
    tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var output = ''
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    output += lookup[tmp >> 2]
    output += lookup[(tmp << 4) & 0x3F]
    output += '=='
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + (uint8[len - 1])
    output += lookup[tmp >> 10]
    output += lookup[(tmp >> 4) & 0x3F]
    output += lookup[(tmp << 2) & 0x3F]
    output += '='
  }

  parts.push(output)

  return parts.join('')
}

},{}],31:[function(require,module,exports){
(function (Buffer){
'use strict';

var base64url = module.exports;

base64url.unescape = function unescape (str) {
  return (str + Array(5 - str.length % 4)
    .join('='))
    .replace(/\-/g, '+')
    .replace(/_/g, '/');
};

base64url.escape = function escape (str) {
  return str.replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
};

base64url.encode = function encode (str) {
  return this.escape(new Buffer(str).toString('base64'));
};

base64url.decode = function decode (str) {
  return new Buffer(this.unescape(str), 'base64').toString();
};

}).call(this,require("buffer").Buffer)
},{"buffer":32}],32:[function(require,module,exports){
(function (global){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */

'use strict'

var base64 = require('base64-js')
var ieee754 = require('ieee754')
var isArray = require('isarray')

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
  ? global.TYPED_ARRAY_SUPPORT
  : typedArraySupport()

/*
 * Export kMaxLength after typed array support is determined.
 */
exports.kMaxLength = kMaxLength()

function typedArraySupport () {
  try {
    var arr = new Uint8Array(1)
    arr.foo = function () { return 42 }
    return arr.foo() === 42 && // typed array instances can be augmented
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
}

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

function createBuffer (that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length')
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length)
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length)
    }
    that.length = length
  }

  return that
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length)
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(this, arg)
  }
  return from(this, arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192 // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype
  return arr
}

function from (that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset)
  }

  return fromObject(that, value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length)
}

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype
  Buffer.__proto__ = Uint8Array
  if (typeof Symbol !== 'undefined' && Symbol.species &&
      Buffer[Symbol.species] === Buffer) {
    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
    Object.defineProperty(Buffer, Symbol.species, {
      value: null,
      configurable: true
    })
  }
}

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  }
}

function alloc (that, size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(that, size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(that, size).fill(fill, encoding)
      : createBuffer(that, size).fill(fill)
  }
  return createBuffer(that, size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding)
}

function allocUnsafe (that, size) {
  assertSize(size)
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; i++) {
      that[i] = 0
    }
  }
  return that
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size)
}

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0
  that = createBuffer(that, length)

  that.write(string, encoding)
  return that
}

function fromArrayLike (that, array) {
  var length = checked(array.length) | 0
  that = createBuffer(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function fromArrayBuffer (that, array, byteOffset, length) {
  array.byteLength // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  if (length === undefined) {
    array = new Uint8Array(array, byteOffset)
  } else {
    array = new Uint8Array(array, byteOffset, length)
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array)
  }
  return that
}

function fromObject (that, obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    that = createBuffer(that, len)

    if (that.length === 0) {
      return that
    }

    obj.copy(that, 0, 0, len)
    return that
  }

  if (obj) {
    if ((typeof ArrayBuffer !== 'undefined' &&
        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0)
      }
      return fromArrayLike(that, obj)
    }

    if (obj.type === 'Buffer' && isArray(obj.data)) {
      return fromArrayLike(that, obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < kMaxLength` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'binary':
    case 'base64':
    case 'raw':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; i++) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; i++) {
    var buf = list[i]
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string
  }

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'binary':
      // Deprecated
      case 'raw':
      case 'raws':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'binary':
        return binarySlice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length | 0
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

function arrayIndexOf (arr, val, byteOffset, encoding) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var foundIndex = -1
  for (var i = 0; byteOffset + i < arrLength; i++) {
    if (read(arr, byteOffset + i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
      if (foundIndex === -1) foundIndex = i
      if (i - foundIndex + 1 === valLength) return (byteOffset + foundIndex) * indexSize
    } else {
      if (foundIndex !== -1) i -= i - foundIndex
      foundIndex = -1
    }
  }
  return -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset >>= 0

  if (this.length === 0) return -1
  if (byteOffset >= this.length) return -1

  // Negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = Math.max(this.length + byteOffset, 0)

  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  if (Buffer.isBuffer(val)) {
    // special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(this, val, byteOffset, encoding)
  }
  if (typeof val === 'number') {
    if (Buffer.TYPED_ARRAY_SUPPORT && Uint8Array.prototype.indexOf === 'function') {
      return Uint8Array.prototype.indexOf.call(this, val, byteOffset)
    }
    return arrayIndexOf(this, [ val ], byteOffset, encoding)
  }

  throw new TypeError('val must be string, number or Buffer')
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new Error('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; i++) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function binaryWrite (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0
    if (isFinite(length)) {
      length = length | 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'binary':
        return binaryWrite(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function binarySlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; i++) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end)
    newBuf.__proto__ = Buffer.prototype
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; i++) {
      newBuf[i] = this[i + start]
    }
  }

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = (value & 0xff)
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; i++) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; i++) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; i--) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; i++) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if (code < 256) {
        val = code
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; i++) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : utf8ToBytes(new Buffer(val, encoding).toString())
    var len = bytes.length
    for (i = 0; i < end - start; i++) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; i++) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; i++) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

function isnan (val) {
  return val !== val // eslint-disable-line no-self-compare
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"base64-js":30,"ieee754":33,"isarray":34}],33:[function(require,module,exports){
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

},{}],34:[function(require,module,exports){
var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};

},{}],35:[function(require,module,exports){
// JSTS. See https://github.com/bjornharrtell/jsts
// Licenses:
// https://github.com/bjornharrtell/jsts/blob/master/LICENSE_EDLv1.txt
// https://github.com/bjornharrtell/jsts/blob/master/LICENSE_EPLv1.txt
// https://github.com/bjornharrtell/jsts/blob/master/LICENSE_LICENSE_ES6_COLLECTIONS.txt
!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports):"function"==typeof define&&define.amd?define(["exports"],e):e(t.jsts=t.jsts||{})}(this,function(t){"use strict";function e(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n])}function n(){}function i(){}function r(){}function s(){}function o(){}function a(){}function u(){}function l(t){this.message=t}function h(t,e){t.prototype=Object.create(e.prototype),t.prototype.constructor=t}function c(){if(0===arguments.length)l.call(this);else if(1===arguments.length){var t=arguments[0];l.call(this,t)}}function f(){}function g(){if(this.x=null,this.y=null,this.z=null,0===arguments.length)g.call(this,0,0);else if(1===arguments.length){var t=arguments[0];g.call(this,t.x,t.y,t.z)}else if(2===arguments.length){var e=arguments[0],n=arguments[1];g.call(this,e,n,g.NULL_ORDINATE)}else if(3===arguments.length){var i=arguments[0],r=arguments[1],s=arguments[2];this.x=i,this.y=r,this.z=s}}function d(){if(this.dimensionsToTest=2,0===arguments.length)d.call(this,2);else if(1===arguments.length){var t=arguments[0];if(2!==t&&3!==t)throw new i("only 2 or 3 dimensions may be specified");this.dimensionsToTest=t}}function p(){}function v(){}function m(t){this.message=t||""}function y(){}function x(t){this.message=t||""}function E(t){this.message=t||""}function I(){this.array_=[],arguments[0]instanceof v&&this.addAll(arguments[0])}function N(){if(I.apply(this),0===arguments.length);else if(1===arguments.length){var t=arguments[0];this.ensureCapacity(t.length),this.add(t,!0)}else if(2===arguments.length){var e=arguments[0],n=arguments[1];this.ensureCapacity(e.length),this.add(e,n)}}function C(){if(this.minx=null,this.maxx=null,this.miny=null,this.maxy=null,0===arguments.length)this.init();else if(1===arguments.length){if(arguments[0]instanceof g){var t=arguments[0];this.init(t.x,t.x,t.y,t.y)}else if(arguments[0]instanceof C){var e=arguments[0];this.init(e)}}else if(2===arguments.length){var n=arguments[0],i=arguments[1];this.init(n.x,i.x,n.y,i.y)}else if(4===arguments.length){var r=arguments[0],s=arguments[1],o=arguments[2],a=arguments[3];this.init(r,s,o,a)}}function S(){}function w(){S.call(this,"Projective point not representable on the Cartesian plane.")}function L(){}function R(t,e){return t.interfaces_&&t.interfaces_().indexOf(e)>-1}function T(){}function P(t){this.str=t}function b(t){this.value=t}function O(){}function _(){if(this.hi=0,this.lo=0,0===arguments.length)this.init(0);else if(1===arguments.length){if("number"==typeof arguments[0]){var t=arguments[0];this.init(t)}else if(arguments[0]instanceof _){var e=arguments[0];this.init(e)}else if("string"==typeof arguments[0]){var n=arguments[0];_.call(this,_.parse(n))}}else if(2===arguments.length){var i=arguments[0],r=arguments[1];this.init(i,r)}}function M(){}function D(){}function A(){}function F(){if(this.x=null,this.y=null,this.w=null,0===arguments.length)this.x=0,this.y=0,this.w=1;else if(1===arguments.length){var t=arguments[0];this.x=t.x,this.y=t.y,this.w=1}else if(2===arguments.length){if("number"==typeof arguments[0]&&"number"==typeof arguments[1]){var e=arguments[0],n=arguments[1];this.x=e,this.y=n,this.w=1}else if(arguments[0]instanceof F&&arguments[1]instanceof F){var i=arguments[0],r=arguments[1];this.x=i.y*r.w-r.y*i.w,this.y=r.x*i.w-i.x*r.w,this.w=i.x*r.y-r.x*i.y}else if(arguments[0]instanceof g&&arguments[1]instanceof g){var s=arguments[0],o=arguments[1];this.x=s.y-o.y,this.y=o.x-s.x,this.w=s.x*o.y-o.x*s.y}}else if(3===arguments.length){var a=arguments[0],u=arguments[1],l=arguments[2];this.x=a,this.y=u,this.w=l}else if(4===arguments.length){var h=arguments[0],c=arguments[1],f=arguments[2],d=arguments[3],p=h.y-c.y,v=c.x-h.x,m=h.x*c.y-c.x*h.y,y=f.y-d.y,x=d.x-f.x,E=f.x*d.y-d.x*f.y;this.x=v*E-x*m,this.y=y*m-p*E,this.w=p*x-y*v}}function G(){}function q(){}function B(){this.envelope=null,this.factory=null,this.SRID=null,this.userData=null;var t=arguments[0];this.factory=t,this.SRID=t.getSRID()}function z(){}function V(){}function k(){}function Y(){}function U(){}function X(){}function H(){}function W(){}function j(){}function K(){}function Z(){}function Q(){}function J(){this.array_=[],arguments[0]instanceof v&&this.addAll(arguments[0])}function $(t){return null==t?$s:t.color}function tt(t){return null==t?null:t.parent}function et(t,e){null!==t&&(t.color=e)}function nt(t){return null==t?null:t.left}function it(t){return null==t?null:t.right}function rt(){this.root_=null,this.size_=0}function st(){}function ot(){}function at(){this.array_=[],arguments[0]instanceof v&&this.addAll(arguments[0])}function ut(){}function lt(){}function ht(){}function ct(){}function ft(){this.geometries=null;var t=arguments[0],e=arguments[1];if(B.call(this,e),null===t&&(t=[]),B.hasNullElements(t))throw new i("geometries must not contain null elements");this.geometries=t}function gt(){var t=arguments[0],e=arguments[1];ft.call(this,t,e)}function dt(){if(this.geom=null,this.geomFact=null,this.bnRule=null,this.endpointMap=null,1===arguments.length){var t=arguments[0];dt.call(this,t,V.MOD2_BOUNDARY_RULE)}else if(2===arguments.length){var e=arguments[0],n=arguments[1];this.geom=e,this.geomFact=e.getFactory(),this.bnRule=n}}function pt(){this.count=null}function vt(){}function mt(){}function yt(){}function xt(){}function Et(){}function It(){}function Nt(){}function Ct(){}function St(){this.points=null;var t=arguments[0],e=arguments[1];B.call(this,e),this.init(t)}function wt(){}function Lt(){this.coordinates=null;var t=arguments[0],e=arguments[1];B.call(this,e),this.init(t)}function Rt(){}function Tt(){this.shell=null,this.holes=null;var t=arguments[0],e=arguments[1],n=arguments[2];if(B.call(this,n),null===t&&(t=this.getFactory().createLinearRing()),null===e&&(e=[]),B.hasNullElements(e))throw new i("holes must not contain null elements");if(t.isEmpty()&&B.hasNonEmptyElements(e))throw new i("shell is empty but holes are not");this.shell=t,this.holes=e}function Pt(){var t=arguments[0],e=arguments[1];ft.call(this,t,e)}function bt(){if(arguments[0]instanceof g&&arguments[1]instanceof ie){var t=arguments[0],e=arguments[1];bt.call(this,e.getCoordinateSequenceFactory().create(t),e)}else if(R(arguments[0],D)&&arguments[1]instanceof ie){var n=arguments[0],i=arguments[1];St.call(this,n,i),this.validateConstruction()}}function Ot(){var t=arguments[0],e=arguments[1];ft.call(this,t,e)}function _t(){if(this.factory=null,this.isUserDataCopied=!1,0===arguments.length);else if(1===arguments.length){var t=arguments[0];this.factory=t}}function Mt(){}function Dt(){}function At(){}function Ft(){}function Gt(){if(this.dimension=3,this.coordinates=null,1===arguments.length){if(arguments[0]instanceof Array){var t=arguments[0];Gt.call(this,t,3)}else if(Number.isInteger(arguments[0])){var e=arguments[0];this.coordinates=new Array(e).fill(null);for(var n=0;e>n;n++)this.coordinates[n]=new g}else if(R(arguments[0],D)){var i=arguments[0];if(null===i)return this.coordinates=new Array(0).fill(null),null;this.dimension=i.getDimension(),this.coordinates=new Array(i.size()).fill(null);for(var n=0;n<this.coordinates.length;n++)this.coordinates[n]=i.getCoordinateCopy(n)}}else if(2===arguments.length)if(arguments[0]instanceof Array&&Number.isInteger(arguments[1])){var r=arguments[0],s=arguments[1];this.coordinates=r,this.dimension=s,null===r&&(this.coordinates=new Array(0).fill(null))}else if(Number.isInteger(arguments[0])&&Number.isInteger(arguments[1])){var o=arguments[0],a=arguments[1];this.coordinates=new Array(o).fill(null),this.dimension=a;for(var n=0;o>n;n++)this.coordinates[n]=new g}}function qt(){}function Bt(t,e){return t===e||t!==t&&e!==e}function zt(t,e){function n(t){return this&&this.constructor===n?(this._keys=[],this._values=[],this._itp=[],this.objectOnly=e,void(t&&Vt.call(this,t))):new n(t)}return e||io(t,"size",{get:Jt}),t.constructor=n,n.prototype=t,n}function Vt(t){this.add?t.forEach(this.add,this):t.forEach(function(t){this.set(t[0],t[1])},this)}function kt(t){return this.has(t)&&(this._keys.splice(no,1),this._values.splice(no,1),this._itp.forEach(function(t){no<t[0]&&t[0]--})),no>-1}function Yt(t){return this.has(t)?this._values[no]:void 0}function Ut(t,e){if(this.objectOnly&&e!==Object(e))throw new TypeError("Invalid value used as weak collection key");if(e!==e||0===e)for(no=t.length;no--&&!Bt(t[no],e););else no=t.indexOf(e);return no>-1}function Xt(t){return Ut.call(this,this._keys,t)}function Ht(t,e){return this.has(t)?this._values[no]=e:this._values[this._keys.push(t)-1]=e,this}function Wt(){(this._keys||0).length=this._values.length=0}function jt(){return Qt(this._itp,this._keys)}function Kt(){return Qt(this._itp,this._values)}function Zt(){return Qt(this._itp,this._keys,this._values)}function Qt(t,e,n){var i=[0],r=!1;return t.push(i),{next:function(){var s,o=i[0];return!r&&o<e.length?(s=n?[e[o],n[o]]:e[o],i[0]++):(r=!0,t.splice(t.indexOf(i),1)),{done:r,value:s}}}}function Jt(){return this._values.length}function $t(t,e){for(var n=this.entries();;){var i=n.next();if(i.done)break;t.call(e,i.value[1],i.value[0],this)}}function te(){this.map_=new so}function ee(){if(this.modelType=null,this.scale=null,0===arguments.length)this.modelType=ee.FLOATING;else if(1===arguments.length)if(arguments[0]instanceof ne){var t=arguments[0];this.modelType=t,t===ee.FIXED&&this.setScale(1)}else if("number"==typeof arguments[0]){var e=arguments[0];this.modelType=ee.FIXED,this.setScale(e)}else if(arguments[0]instanceof ee){var n=arguments[0];this.modelType=n.modelType,this.scale=n.scale}}function ne(){this.name=null;var t=arguments[0];this.name=t,ne.nameToTypeMap.put(t,this)}function ie(){if(this.precisionModel=null,this.coordinateSequenceFactory=null,this.SRID=null,0===arguments.length)ie.call(this,new ee,0);else if(1===arguments.length){if(R(arguments[0],G)){var t=arguments[0];ie.call(this,new ee,0,t)}else if(arguments[0]instanceof ee){var e=arguments[0];ie.call(this,e,0,ie.getDefaultCoordinateSequenceFactory())}}else if(2===arguments.length){var n=arguments[0],i=arguments[1];ie.call(this,n,i,ie.getDefaultCoordinateSequenceFactory())}else if(3===arguments.length){var r=arguments[0],s=arguments[1],o=arguments[2];this.precisionModel=r,this.coordinateSequenceFactory=o,this.SRID=s}}function re(t){this.geometryFactory=t||new ie}function se(t){this.parser=new re(t)}function oe(){this.result=null,this.inputLines=Array(2).fill().map(function(){return Array(2)}),this.intPt=new Array(2).fill(null),this.intLineIndex=null,this._isProper=null,this.pa=null,this.pb=null,this.precisionModel=null,this.intPt[0]=new g,this.intPt[1]=new g,this.pa=this.intPt[0],this.pb=this.intPt[1],this.result=0}function ae(){oe.apply(this)}function ue(){}function le(){this.p=null,this.crossingCount=0,this.isPointOnSegment=!1;var t=arguments[0];this.p=t}function he(){}function ce(){if(this.p0=null,this.p1=null,0===arguments.length)ce.call(this,new g,new g);else if(1===arguments.length){var t=arguments[0];ce.call(this,t.p0,t.p1)}else if(2===arguments.length){var e=arguments[0],n=arguments[1];this.p0=e,this.p1=n}else if(4===arguments.length){var i=arguments[0],r=arguments[1],s=arguments[2],o=arguments[3];ce.call(this,new g(i,r),new g(s,o))}}function fe(){if(this.matrix=null,0===arguments.length)this.matrix=Array(3).fill().map(function(){return Array(3)}),this.setAll(lt.FALSE);else if(1===arguments.length)if("string"==typeof arguments[0]){var t=arguments[0];fe.call(this),this.set(t)}else if(arguments[0]instanceof fe){var e=arguments[0];fe.call(this),this.matrix[L.INTERIOR][L.INTERIOR]=e.matrix[L.INTERIOR][L.INTERIOR],this.matrix[L.INTERIOR][L.BOUNDARY]=e.matrix[L.INTERIOR][L.BOUNDARY],this.matrix[L.INTERIOR][L.EXTERIOR]=e.matrix[L.INTERIOR][L.EXTERIOR],this.matrix[L.BOUNDARY][L.INTERIOR]=e.matrix[L.BOUNDARY][L.INTERIOR],this.matrix[L.BOUNDARY][L.BOUNDARY]=e.matrix[L.BOUNDARY][L.BOUNDARY],this.matrix[L.BOUNDARY][L.EXTERIOR]=e.matrix[L.BOUNDARY][L.EXTERIOR],this.matrix[L.EXTERIOR][L.INTERIOR]=e.matrix[L.EXTERIOR][L.INTERIOR],this.matrix[L.EXTERIOR][L.BOUNDARY]=e.matrix[L.EXTERIOR][L.BOUNDARY],this.matrix[L.EXTERIOR][L.EXTERIOR]=e.matrix[L.EXTERIOR][L.EXTERIOR]}}function ge(){this.areaBasePt=null,this.triangleCent3=new g,this.areasum2=0,this.cg3=new g,this.lineCentSum=new g,this.totalLength=0,this.ptCount=0,this.ptCentSum=new g;var t=arguments[0];this.areaBasePt=null,this.add(t)}function de(t){this.message=t||""}function pe(){this.array_=[]}function ve(){this.treeSet=new at,this.list=new I}function me(){if(this.geomFactory=null,this.inputPts=null,1===arguments.length){var t=arguments[0];me.call(this,me.extractCoordinates(t),t.getFactory())}else if(2===arguments.length){var e=arguments[0],n=arguments[1];this.inputPts=ve.filterCoordinates(e),this.geomFactory=n}}function ye(){this.origin=null;var t=arguments[0];this.origin=t}function xe(){this.inputGeom=null,this.factory=null,this.pruneEmptyGeometry=!0,this.preserveGeometryCollectionType=!0,this.preserveCollections=!1,this.preserveType=!1}function Ee(){if(this.snapTolerance=0,this.srcPts=null,this.seg=new ce,this.allowSnappingToSourceVertices=!1,this._isClosed=!1,arguments[0]instanceof St&&"number"==typeof arguments[1]){var t=arguments[0],e=arguments[1];Ee.call(this,t.getCoordinates(),e)}else if(arguments[0]instanceof Array&&"number"==typeof arguments[1]){var n=arguments[0],i=arguments[1];this.srcPts=n,this._isClosed=Ee.isClosed(n),this.snapTolerance=i}}function Ie(){this.srcGeom=null;var t=arguments[0];this.srcGeom=t}function Ne(){if(xe.apply(this),this.snapTolerance=null,this.snapPts=null,this.isSelfSnap=!1,2===arguments.length){var t=arguments[0],e=arguments[1];this.snapTolerance=t,this.snapPts=e}else if(3===arguments.length){var n=arguments[0],i=arguments[1],r=arguments[2];this.snapTolerance=n,this.snapPts=i,this.isSelfSnap=r}}function Ce(){this.isFirst=!0,this.commonMantissaBitsCount=53,this.commonBits=0,this.commonSignExp=null}function Se(){this.commonCoord=null,this.ccFilter=new we}function we(){this.commonBitsX=new Ce,this.commonBitsY=new Ce}function Le(){this.trans=null;var t=arguments[0];this.trans=t}function Re(){this.parent=null,this.atStart=null,this.max=null,this.index=null,this.subcollectionIterator=null;var t=arguments[0];this.parent=t,this.atStart=!0,this.index=0,this.max=t.getNumGeometries()}function Te(){if(this.boundaryRule=V.OGC_SFS_BOUNDARY_RULE,this.isIn=null,this.numBoundaries=null,0===arguments.length);else if(1===arguments.length){var t=arguments[0];if(null===t)throw new i("Rule must be non-null");this.boundaryRule=t}}function Pe(){}function be(){}function Oe(){this.pts=null,this.data=null;var t=arguments[0],e=arguments[1];this.pts=t,this.data=e}function _e(){}function Me(){this.bounds=null,this.item=null;var t=arguments[0],e=arguments[1];this.bounds=t,this.item=e}function De(){this._size=null,this.items=null,this._size=0,this.items=new I,this.items.add(null)}function Ae(){}function Fe(){}function Ge(){if(this.childBoundables=new I,this.bounds=null,this.level=null,0===arguments.length);else if(1===arguments.length){var t=arguments[0];this.level=t}}function qe(){this.boundable1=null,this.boundable2=null,this._distance=null,this.itemDistance=null;var t=arguments[0],e=arguments[1],n=arguments[2];this.boundable1=t,this.boundable2=e,this.itemDistance=n,this._distance=this.distance()}function Be(){if(this.root=null,this.built=!1,this.itemBoundables=new I,this.nodeCapacity=null,0===arguments.length)Be.call(this,Be.DEFAULT_NODE_CAPACITY);else if(1===arguments.length){var t=arguments[0];f.isTrue(t>1,"Node capacity must be greater than 1"),this.nodeCapacity=t}}function ze(){}function Ve(){}function ke(){if(0===arguments.length)ke.call(this,ke.DEFAULT_NODE_CAPACITY);else if(1===arguments.length){var t=arguments[0];Be.call(this,t)}}function Ye(){var t=arguments[0];Ge.call(this,t)}function Ue(){}function Xe(){this.segString=null,this.coord=null,this.segmentIndex=null,this.segmentOctant=null,this._isInterior=null;var t=arguments[0],e=arguments[1],n=arguments[2],i=arguments[3];this.segString=t,this.coord=new g(e),this.segmentIndex=n,this.segmentOctant=i,this._isInterior=!e.equals2D(t.getCoordinate(n))}function He(){this.nodeMap=new rt,this.edge=null;var t=arguments[0];this.edge=t}function We(){this.nodeList=null,this.edge=null,this.nodeIt=null,this.currNode=null,this.nextNode=null,this.currSegIndex=0;var t=arguments[0];this.nodeList=t,this.edge=t.getEdge(),this.nodeIt=t.iterator(),this.readNextNode()}function je(){}function Ke(){this.nodeList=new He(this),this.pts=null,this.data=null;var t=arguments[0],e=arguments[1];this.pts=t,this.data=e}function Ze(){this.tempEnv1=new C,this.tempEnv2=new C,this.overlapSeg1=new ce,this.overlapSeg2=new ce}function Qe(){this.pts=null,this.start=null,this.end=null,this.env=null,this.context=null,this.id=null;var t=arguments[0],e=arguments[1],n=arguments[2],i=arguments[3];this.pts=t,this.start=e,this.end=n,this.context=i}function Je(){}function $e(){}function tn(){}function en(){if(this.segInt=null,0===arguments.length);else if(1===arguments.length){var t=arguments[0];this.setSegmentIntersector(t)}}function nn(){if(this.monoChains=new I,this.index=new ke,this.idCounter=0,this.nodedSegStrings=null,this.nOverlaps=0,0===arguments.length);else if(1===arguments.length){var t=arguments[0];en.call(this,t)}}function rn(){Ze.apply(this),this.si=null;var t=arguments[0];this.si=t}function sn(){if(this.pt=null,1===arguments.length){var t=arguments[0];l.call(this,t)}else if(2===arguments.length){var e=arguments[0],n=arguments[1];l.call(this,sn.msgWithCoord(e,n)),this.pt=new g(n)}}function on(){}function an(){this.findAllIntersections=!1,this.isCheckEndSegmentsOnly=!1,this.li=null,this.interiorIntersection=null,this.intSegments=null,this.intersections=new I,this.intersectionCount=0,this.keepIntersections=!0;var t=arguments[0];this.li=t,this.interiorIntersection=null}function un(){this.li=new ae,this.segStrings=null,this.findAllIntersections=!1,this.segInt=null,this._isValid=!0;var t=arguments[0];this.segStrings=t}function ln(){this.nv=null;var t=arguments[0];this.nv=new un(ln.toSegmentStrings(t))}function hn(){this.mapOp=null;var t=arguments[0];this.mapOp=t}function cn(){}function fn(){if(this.location=null,1===arguments.length){if(arguments[0]instanceof Array){var t=arguments[0];this.init(t.length)}else if(Number.isInteger(arguments[0])){var e=arguments[0];this.init(1),this.location[cn.ON]=e}else if(arguments[0]instanceof fn){var n=arguments[0];if(this.init(n.location.length),null!==n)for(var i=0;i<this.location.length;i++)this.location[i]=n.location[i]}}else if(3===arguments.length){var r=arguments[0],s=arguments[1],o=arguments[2];this.init(3),this.location[cn.ON]=r,this.location[cn.LEFT]=s,this.location[cn.RIGHT]=o}}function gn(){if(this.elt=new Array(2).fill(null),1===arguments.length){if(Number.isInteger(arguments[0])){var t=arguments[0];this.elt[0]=new fn(t),this.elt[1]=new fn(t)}else if(arguments[0]instanceof gn){var e=arguments[0];this.elt[0]=new fn(e.elt[0]),this.elt[1]=new fn(e.elt[1])}}else if(2===arguments.length){var n=arguments[0],i=arguments[1];this.elt[0]=new fn(L.NONE),this.elt[1]=new fn(L.NONE),this.elt[n].setLocation(i)}else if(3===arguments.length){var r=arguments[0],s=arguments[1],o=arguments[2];this.elt[0]=new fn(r,s,o),this.elt[1]=new fn(r,s,o)}else if(4===arguments.length){var a=arguments[0],u=arguments[1],l=arguments[2],h=arguments[3];this.elt[0]=new fn(L.NONE,L.NONE,L.NONE),this.elt[1]=new fn(L.NONE,L.NONE,L.NONE),this.elt[a].setLocations(u,l,h)}}function dn(){this.startDe=null,this.maxNodeDegree=-1,this.edges=new I,this.pts=new I,this.label=new gn(L.NONE),this.ring=null,this._isHole=null,this.shell=null,this.holes=new I,this.geometryFactory=null;var t=arguments[0],e=arguments[1];this.geometryFactory=e,this.computePoints(t),this.computeRing()}function pn(){var t=arguments[0],e=arguments[1];dn.call(this,t,e)}function vn(){var t=arguments[0],e=arguments[1];dn.call(this,t,e)}function mn(){if(this.label=null,this._isInResult=!1,this._isCovered=!1,this._isCoveredSet=!1,this._isVisited=!1,0===arguments.length);else if(1===arguments.length){var t=arguments[0];this.label=t}}function yn(){mn.apply(this),this.coord=null,this.edges=null;var t=arguments[0],e=arguments[1];this.coord=t,this.edges=e,this.label=new gn(0,L.NONE)}function xn(){this.nodeMap=new rt,this.nodeFact=null;var t=arguments[0];this.nodeFact=t}function En(){if(this.edge=null,this.label=null,this.node=null,this.p0=null,this.p1=null,this.dx=null,this.dy=null,this.quadrant=null,1===arguments.length){var t=arguments[0];this.edge=t}else if(3===arguments.length){var e=arguments[0],n=arguments[1],i=arguments[2];En.call(this,e,n,i,null)}else if(4===arguments.length){var r=arguments[0],s=arguments[1],o=arguments[2],a=arguments[3];En.call(this,r),this.init(s,o),this.label=a}}function In(){this._isForward=null,this._isInResult=!1,this._isVisited=!1,this.sym=null,this.next=null,this.nextMin=null,this.edgeRing=null,this.minEdgeRing=null,this.depth=[0,-999,-999];var t=arguments[0],e=arguments[1];if(En.call(this,t),this._isForward=e,e)this.init(t.getCoordinate(0),t.getCoordinate(1));else{var n=t.getNumPoints()-1;this.init(t.getCoordinate(n),t.getCoordinate(n-1))}this.computeDirectedLabel()}function Nn(){}function Cn(){if(this.edges=new I,this.nodes=null,this.edgeEndList=new I,0===arguments.length)this.nodes=new xn(new Nn);else if(1===arguments.length){var t=arguments[0];this.nodes=new xn(t)}}function Sn(){this.geometryFactory=null,this.shellList=new I;var t=arguments[0];this.geometryFactory=t}function wn(){this.op=null,this.geometryFactory=null,this.ptLocator=null,this.lineEdgesList=new I,this.resultLineList=new I;var t=arguments[0],e=arguments[1],n=arguments[2];this.op=t,this.geometryFactory=e,this.ptLocator=n}function Ln(){this.op=null,this.geometryFactory=null,this.resultPointList=new I;var t=arguments[0],e=arguments[1];arguments[2];this.op=t,this.geometryFactory=e}function Rn(){}function Tn(){this.geom=null;var t=arguments[0];this.geom=t}function Pn(){this.edgeMap=new rt,this.edgeList=null,this.ptInAreaLocation=[L.NONE,L.NONE]}function bn(){Pn.apply(this),this.resultAreaEdgeList=null,this.label=null,this.SCANNING_FOR_INCOMING=1,this.LINKING_TO_OUTGOING=2}function On(){Nn.apply(this)}function _n(){this.mce=null,this.chainIndex=null;var t=arguments[0],e=arguments[1];this.mce=t,this.chainIndex=e}function Mn(){if(this.label=null,this.xValue=null,this.eventType=null,this.insertEvent=null,this.deleteEventIndex=null,this.obj=null,2===arguments.length){var t=arguments[0],e=arguments[1];this.eventType=Mn.DELETE,this.xValue=t,this.insertEvent=e}else if(3===arguments.length){var n=arguments[0],i=arguments[1],r=arguments[2];this.eventType=Mn.INSERT,this.label=n,this.xValue=i,this.obj=r}}function Dn(){}function An(){this._hasIntersection=!1,this.hasProper=!1,this.hasProperInterior=!1,this.properIntersectionPoint=null,this.li=null,this.includeProper=null,this.recordIsolated=null,this.isSelfIntersection=null,this.numIntersections=0,this.numTests=0,this.bdyNodes=null,this._isDone=!1,this.isDoneWhenProperInt=!1;var t=arguments[0],e=arguments[1],n=arguments[2];this.li=t,this.includeProper=e,this.recordIsolated=n}function Fn(){Dn.apply(this),this.events=new I,this.nOverlaps=null}function Gn(){this.min=r.POSITIVE_INFINITY,this.max=r.NEGATIVE_INFINITY}function qn(){}function Bn(){Gn.apply(this),this.item=null;var t=arguments[0],e=arguments[1],n=arguments[2];this.min=t,this.max=e,this.item=n}function zn(){Gn.apply(this),this.node1=null,this.node2=null;var t=arguments[0],e=arguments[1];this.node1=t,this.node2=e,this.buildExtent(this.node1,this.node2)}function Vn(){this.leaves=new I,this.root=null,this.level=0}function kn(){if(this.lines=null,this.isForcedToLineString=!1,1===arguments.length){var t=arguments[0];this.lines=t}else if(2===arguments.length){var e=arguments[0],n=arguments[1];this.lines=e,this.isForcedToLineString=n}}function Yn(){this.items=new I}function Un(){this.index=null;var t=arguments[0];if(!R(t,Rt))throw new i("Argument must be Polygonal");this.index=new Hn(t)}function Xn(){this.counter=null;var t=arguments[0];this.counter=t}function Hn(){this.index=new Vn;var t=arguments[0];this.init(t)}function Wn(){this.coord=null,this.segmentIndex=null,this.dist=null;var t=arguments[0],e=arguments[1],n=arguments[2];this.coord=new g(t),this.segmentIndex=e,this.dist=n}function jn(){this.nodeMap=new rt,this.edge=null;var t=arguments[0];this.edge=t}function Kn(){}function Zn(){this.e=null,this.pts=null,this.startIndex=null,this.env1=new C,this.env2=new C;var t=arguments[0];this.e=t,this.pts=t.getCoordinates();var e=new Kn;this.startIndex=e.getChainStartIndices(this.pts)}function Qn(){this.depth=Array(2).fill().map(function(){return Array(3)});for(var t=0;2>t;t++)for(var e=0;3>e;e++)this.depth[t][e]=Qn.NULL_VALUE}function Jn(){if(mn.apply(this),this.pts=null,this.env=null,this.eiList=new jn(this),this.name=null,this.mce=null,this._isIsolated=!0,this.depth=new Qn,this.depthDelta=0,1===arguments.length){var t=arguments[0];Jn.call(this,t,null)}else if(2===arguments.length){var e=arguments[0],n=arguments[1];this.pts=e,this.label=n}}function $n(){if(Cn.apply(this),this.parentGeom=null,this.lineEdgeMap=new te,this.boundaryNodeRule=null,this.useBoundaryDeterminationRule=!0,this.argIndex=null,this.boundaryNodes=null,this._hasTooFewPoints=!1,this.invalidPoint=null,this.areaPtLocator=null,this.ptLocator=new Te,2===arguments.length){var t=arguments[0],e=arguments[1];$n.call(this,t,e,V.OGC_SFS_BOUNDARY_RULE)}else if(3===arguments.length){var n=arguments[0],i=arguments[1],r=arguments[2];this.argIndex=n,this.parentGeom=i,this.boundaryNodeRule=r,null!==i&&this.add(i)}}function ti(){if(this.li=new ae,this.resultPrecisionModel=null,this.arg=null,1===arguments.length){var t=arguments[0];this.setComputationPrecision(t.getPrecisionModel()),this.arg=new Array(1).fill(null),this.arg[0]=new $n(0,t)}else if(2===arguments.length){var e=arguments[0],n=arguments[1];ti.call(this,e,n,V.OGC_SFS_BOUNDARY_RULE)}else if(3===arguments.length){var i=arguments[0],r=arguments[1],s=arguments[2];i.getPrecisionModel().compareTo(r.getPrecisionModel())>=0?this.setComputationPrecision(i.getPrecisionModel()):this.setComputationPrecision(r.getPrecisionModel()),this.arg=new Array(2).fill(null),this.arg[0]=new $n(0,i,s),this.arg[1]=new $n(1,r,s)}}function ei(){this.pts=null,this._orientation=null;var t=arguments[0];this.pts=t,this._orientation=ei.orientation(t)}function ni(){this.edges=new I,this.ocaMap=new rt}function ii(){this.ptLocator=new Te,this.geomFact=null,this.resultGeom=null,this.graph=null,this.edgeList=new ni,this.resultPolyList=new I,this.resultLineList=new I,this.resultPointList=new I;var t=arguments[0],e=arguments[1];ti.call(this,t,e),this.graph=new Cn(new On),this.geomFact=t.getFactory()}function ri(){this.geom=new Array(2).fill(null),this.snapTolerance=null,this.cbr=null;var t=arguments[0],e=arguments[1];this.geom[0]=t,this.geom[1]=e,this.computeSnapTolerance()}function si(){this.geom=new Array(2).fill(null);var t=arguments[0],e=arguments[1];this.geom[0]=t,this.geom[1]=e}function oi(){this.factory=null,this.interiorPoint=null,this.maxWidth=0;var t=arguments[0];this.factory=t.getFactory(),this.add(t)}function ai(){this.poly=null,this.centreY=null,this.hiY=r.MAX_VALUE,this.loY=-r.MAX_VALUE;var t=arguments[0];this.poly=t,this.hiY=t.getEnvelopeInternal().getMaxY(),this.loY=t.getEnvelopeInternal().getMinY(),this.centreY=oi.avg(this.loY,this.hiY)}function ui(){this.centroid=null,this.minDistance=r.MAX_VALUE,this.interiorPoint=null;var t=arguments[0];this.centroid=t.getCentroid().getCoordinate(),this.addInterior(t),null===this.interiorPoint&&this.addEndpoints(t)}function li(){this.centroid=null,this.minDistance=r.MAX_VALUE,this.interiorPoint=null;var t=arguments[0];this.centroid=t.getCentroid().getCoordinate(),this.add(t)}function hi(){}function ci(){this.p0=null,this.p1=null,this.p2=null;var t=arguments[0],e=arguments[1],n=arguments[2];this.p0=t,this.p1=e,this.p2=n}function fi(){this.input=null,this.extremalPts=null,this.centre=null,this.radius=0;var t=arguments[0];this.input=t}function gi(){if(this.inputGeom=null,this.isConvex=null,this.convexHullPts=null,this.minBaseSeg=new ce,this.minWidthPt=null,this.minPtIndex=null,this.minWidth=0,1===arguments.length){var t=arguments[0];gi.call(this,t,!1)}else if(2===arguments.length){var e=arguments[0],n=arguments[1];this.inputGeom=e,this.isConvex=n}}function di(){this.inputGeom=null,this.distanceTolerance=null;var t=arguments[0];this.inputGeom=t}function pi(){xe.apply(this),this.distanceTolerance=null;var t=arguments[0];this.distanceTolerance=t}function vi(){this._orig=null,this._sym=null,this._next=null;var t=arguments[0];this._orig=t}function mi(){this._isMarked=!1;var t=arguments[0];vi.call(this,t)}function yi(){this.vertexMap=new te}function xi(){this._isStart=!1;var t=arguments[0];mi.call(this,t)}function Ei(){yi.apply(this)}function Ii(){this.result=null,this.factory=null,this.graph=null,this.lines=new I,this.nodeEdgeStack=new pe,this.ringStartEdge=null,this.graph=new Ei}function Ni(){this.items=new I,this.subnode=new Array(4).fill(null)}function Ci(){}function Si(t,e){var n,i,r,s,o={32:{d:127,c:128,b:0,a:0},64:{d:32752,c:0,b:0,a:0}},a={32:8,64:11}[t];if(s||(n=0>e||0>1/e,isFinite(e)||(s=o[t],n&&(s.d+=1<<t/4-1),i=Math.pow(2,a)-1,r=0)),!s){for(i={32:127,64:1023}[t],r=Math.abs(e);r>=2;)i++,r/=2;for(;1>r&&i>0;)i--,r*=2;0>=i&&(r/=2),32===t&&i>254&&(s={d:n?255:127,c:128,b:0,a:0},i=Math.pow(2,a)-1,r=0)}return i}function wi(){this.pt=new g,this.level=0,this.env=null;var t=arguments[0];this.computeKey(t)}function Li(){Ni.apply(this),this.env=null,this.centrex=null,this.centrey=null,this.level=null;var t=arguments[0],e=arguments[1];this.env=t,this.level=e,this.centrex=(t.getMinX()+t.getMaxX())/2,this.centrey=(t.getMinY()+t.getMaxY())/2}function Ri(){}function Ti(){Ni.apply(this)}function Pi(){this.root=null,this.minExtent=1,this.root=new Ti}function bi(t){this.geometryFactory=t||new ie}function Oi(t){this.geometryFactory=t||new ie,this.precisionModel=this.geometryFactory.getPrecisionModel(),this.parser=new bi(this.geometryFactory)}function _i(){this.parser=new bi(this.geometryFactory)}function Mi(t){this.geometryFactory=t||new ie,this.precisionModel=this.geometryFactory.getPrecisionModel(),this.parser=new re(this.geometryFactory)}function Di(t){return[t.x,t.y]}function Ai(t){this.geometryFactory=t||new ie}function Fi(){if(this.noder=null,this.scaleFactor=null,this.offsetX=null,this.offsetY=null,this.isScaled=!1,2===arguments.length){var t=arguments[0],e=arguments[1];Fi.call(this,t,e,0,0)}else if(4===arguments.length){var n=arguments[0],i=arguments[1];arguments[2],arguments[3];this.noder=n,this.scaleFactor=i,this.isScaled=!this.isIntegerPrecision()}}function Gi(){if(this.inputGeom=null,this.isClosedEndpointsInInterior=!0,this.nonSimpleLocation=null,1===arguments.length){var t=arguments[0];this.inputGeom=t}else if(2===arguments.length){var e=arguments[0],n=arguments[1];this.inputGeom=e,this.isClosedEndpointsInInterior=!n.isInBoundary(2)}}function qi(){this.pt=null,this.isClosed=null,this.degree=null;var t=arguments[0];this.pt=t,this.isClosed=!1,this.degree=0}function Bi(){if(this.quadrantSegments=Bi.DEFAULT_QUADRANT_SEGMENTS,this.endCapStyle=Bi.CAP_ROUND,this.joinStyle=Bi.JOIN_ROUND,this.mitreLimit=Bi.DEFAULT_MITRE_LIMIT,this._isSingleSided=!1,this.simplifyFactor=Bi.DEFAULT_SIMPLIFY_FACTOR,0===arguments.length);else if(1===arguments.length){var t=arguments[0];this.setQuadrantSegments(t)}else if(2===arguments.length){var e=arguments[0],n=arguments[1];this.setQuadrantSegments(e),this.setEndCapStyle(n)}else if(4===arguments.length){var i=arguments[0],r=arguments[1],s=arguments[2],o=arguments[3];this.setQuadrantSegments(i),this.setEndCapStyle(r),this.setJoinStyle(s),this.setMitreLimit(o)}}function zi(){this.minIndex=-1,this.minCoord=null,this.minDe=null,this.orientedDe=null}function Vi(){this.array_=[]}function ki(){this.finder=null,this.dirEdgeList=new I,this.nodes=new I,this.rightMostCoord=null,this.env=null,this.finder=new zi}function Yi(){this.inputLine=null,
this.distanceTol=null,this.isDeleted=null,this.angleOrientation=he.COUNTERCLOCKWISE;var t=arguments[0];this.inputLine=t}function Ui(){this.ptList=null,this.precisionModel=null,this.minimimVertexDistance=0,this.ptList=new I}function Xi(){this.maxCurveSegmentError=0,this.filletAngleQuantum=null,this.closingSegLengthFactor=1,this.segList=null,this.distance=0,this.precisionModel=null,this.bufParams=null,this.li=null,this.s0=null,this.s1=null,this.s2=null,this.seg0=new ce,this.seg1=new ce,this.offset0=new ce,this.offset1=new ce,this.side=0,this._hasNarrowConcaveAngle=!1;var t=arguments[0],e=arguments[1],n=arguments[2];this.precisionModel=t,this.bufParams=e,this.li=new ae,this.filletAngleQuantum=Math.PI/2/e.getQuadrantSegments(),e.getQuadrantSegments()>=8&&e.getJoinStyle()===Bi.JOIN_ROUND&&(this.closingSegLengthFactor=Xi.MAX_CLOSING_SEG_LEN_FACTOR),this.init(n)}function Hi(){this.distance=0,this.precisionModel=null,this.bufParams=null;var t=arguments[0],e=arguments[1];this.precisionModel=t,this.bufParams=e}function Wi(){this.subgraphs=null,this.seg=new ce,this.cga=new he;var t=arguments[0];this.subgraphs=t}function ji(){this.upwardSeg=null,this.leftDepth=null;var t=arguments[0],e=arguments[1];this.upwardSeg=new ce(t),this.leftDepth=e}function Ki(){this.inputGeom=null,this.distance=null,this.curveBuilder=null,this.curveList=new I;var t=arguments[0],e=arguments[1],n=arguments[2];this.inputGeom=t,this.distance=e,this.curveBuilder=n}function Zi(){this._hasIntersection=!1,this.hasProper=!1,this.hasProperInterior=!1,this.hasInterior=!1,this.properIntersectionPoint=null,this.li=null,this.isSelfIntersection=null,this.numIntersections=0,this.numInteriorIntersections=0,this.numProperIntersections=0,this.numTests=0;var t=arguments[0];this.li=t}function Qi(){this.bufParams=null,this.workingPrecisionModel=null,this.workingNoder=null,this.geomFact=null,this.graph=null,this.edgeList=new ni;var t=arguments[0];this.bufParams=t}function Ji(){this.li=new ae,this.segStrings=null;var t=arguments[0];this.segStrings=t}function $i(){this.li=null,this.pt=null,this.originalPt=null,this.ptScaled=null,this.p0Scaled=null,this.p1Scaled=null,this.scaleFactor=null,this.minx=null,this.maxx=null,this.miny=null,this.maxy=null,this.corner=new Array(4).fill(null),this.safeEnv=null;var t=arguments[0],e=arguments[1],n=arguments[2];if(this.originalPt=t,this.pt=t,this.scaleFactor=e,this.li=n,0>=e)throw new i("Scale factor must be non-zero");1!==e&&(this.pt=new g(this.scale(t.x),this.scale(t.y)),this.p0Scaled=new g,this.p1Scaled=new g),this.initCorners(this.pt)}function tr(){this.tempEnv1=new C,this.selectedSegment=new ce}function er(){this.index=null;var t=arguments[0];this.index=t}function nr(){tr.apply(this),this.hotPixel=null,this.parentEdge=null,this.hotPixelVertexIndex=null,this._isNodeAdded=!1;var t=arguments[0],e=arguments[1],n=arguments[2];this.hotPixel=t,this.parentEdge=e,this.hotPixelVertexIndex=n}function ir(){this.li=null,this.interiorIntersections=null;var t=arguments[0];this.li=t,this.interiorIntersections=new I}function rr(){this.pm=null,this.li=null,this.scaleFactor=null,this.noder=null,this.pointSnapper=null,this.nodedSegStrings=null;var t=arguments[0];this.pm=t,this.li=new ae,this.li.setPrecisionModel(t),this.scaleFactor=t.getScale()}function sr(){if(this.argGeom=null,this.distance=null,this.bufParams=new Bi,this.resultGeometry=null,this.saveException=null,1===arguments.length){var t=arguments[0];this.argGeom=t}else if(2===arguments.length){var e=arguments[0],n=arguments[1];this.argGeom=e,this.bufParams=n}}function or(){this.comps=null;var t=arguments[0];this.comps=t}function ar(){if(this.component=null,this.segIndex=null,this.pt=null,2===arguments.length){var t=arguments[0],e=arguments[1];ar.call(this,t,ar.INSIDE_AREA,e)}else if(3===arguments.length){var n=arguments[0],i=arguments[1],r=arguments[2];this.component=n,this.segIndex=i,this.pt=r}}function ur(){this.pts=null;var t=arguments[0];this.pts=t}function lr(){this.locations=null;var t=arguments[0];this.locations=t}function hr(){if(this.geom=null,this.terminateDistance=0,this.ptLocator=new Te,this.minDistanceLocation=null,this.minDistance=r.MAX_VALUE,2===arguments.length){var t=arguments[0],e=arguments[1];hr.call(this,t,e,0)}else if(3===arguments.length){var n=arguments[0],i=arguments[1],s=arguments[2];this.geom=new Array(2).fill(null),this.geom[0]=n,this.geom[1]=i,this.terminateDistance=s}}function cr(){this.factory=null,this.directedEdges=new I,this.coordinates=null;var t=arguments[0];this.factory=t}function fr(){this._isMarked=!1,this._isVisited=!1,this.data=null}function gr(){fr.apply(this),this.parentEdge=null,this.from=null,this.to=null,this.p0=null,this.p1=null,this.sym=null,this.edgeDirection=null,this.quadrant=null,this.angle=null;var t=arguments[0],e=arguments[1],n=arguments[2],i=arguments[3];this.from=t,this.to=e,this.edgeDirection=i,this.p0=t.getCoordinate(),this.p1=n;var r=this.p1.x-this.p0.x,s=this.p1.y-this.p0.y;this.quadrant=Je.quadrant(r,s),this.angle=Math.atan2(s,r)}function dr(){var t=arguments[0],e=arguments[1],n=arguments[2],i=arguments[3];gr.call(this,t,e,n,i)}function pr(){if(fr.apply(this),this.dirEdge=null,0===arguments.length);else if(2===arguments.length){var t=arguments[0],e=arguments[1];this.setDirectedEdges(t,e)}}function vr(){this.outEdges=new I,this.sorted=!1}function mr(){if(fr.apply(this),this.pt=null,this.deStar=null,1===arguments.length){var t=arguments[0];mr.call(this,t,new vr)}else if(2===arguments.length){var e=arguments[0],n=arguments[1];this.pt=e,this.deStar=n}}function yr(){pr.apply(this),this.line=null;var t=arguments[0];this.line=t}function xr(){this.nodeMap=new rt}function Er(){this.edges=new J,this.dirEdges=new J,this.nodeMap=new xr}function Ir(){Er.apply(this)}function Nr(){this.graph=new Ir,this.mergedLineStrings=null,this.factory=null,this.edgeStrings=null}function Cr(){this.edgeRing=null,this.next=null,this.label=-1;var t=arguments[0],e=arguments[1],n=arguments[2],i=arguments[3];gr.call(this,t,e,n,i)}function Sr(){pr.apply(this),this.line=null;var t=arguments[0];this.line=t}function wr(){this.factory=null,this.deList=new I,this.lowestEdge=null,this.ring=null,this.ringPts=null,this.holes=null,this.shell=null,this._isHole=null,this._isProcessed=!1,this._isIncludedSet=!1,this._isIncluded=!1;var t=arguments[0];this.factory=t}function Lr(){}function Rr(){Er.apply(this),this.factory=null;var t=arguments[0];this.factory=t}function Tr(){if(this.lineStringAdder=new Pr(this),this.graph=null,this.dangles=new I,this.cutEdges=new I,this.invalidRingLines=new I,this.holeList=null,this.shellList=null,this.polyList=null,this.isCheckingRingsValid=!0,this.extractOnlyPolygonal=null,this.geomFactory=null,0===arguments.length)Tr.call(this,!1);else if(1===arguments.length){var t=arguments[0];this.extractOnlyPolygonal=t}}function Pr(){this.p=null;var t=arguments[0];this.p=t}function br(){}function Or(){if(this.edgeEnds=new I,1===arguments.length){var t=arguments[0];Or.call(this,null,t)}else if(2===arguments.length){var e=(arguments[0],arguments[1]);En.call(this,e.getEdge(),e.getCoordinate(),e.getDirectedCoordinate(),new gn(e.getLabel())),this.insert(e)}}function _r(){Pn.apply(this)}function Mr(){var t=arguments[0],e=arguments[1];yn.call(this,t,e)}function Dr(){Nn.apply(this)}function Ar(){this.li=new ae,this.ptLocator=new Te,this.arg=null,this.nodes=new xn(new Dr),this.im=null,this.isolatedEdges=new I,this.invalidPoint=null;var t=arguments[0];this.arg=t}function Fr(){this.rectEnv=null;var t=arguments[0];this.rectEnv=t.getEnvelopeInternal()}function Gr(){this.li=new ae,this.rectEnv=null,this.diagUp0=null,this.diagUp1=null,this.diagDown0=null,this.diagDown1=null;var t=arguments[0];this.rectEnv=t,this.diagUp0=new g(t.getMinX(),t.getMinY()),this.diagUp1=new g(t.getMaxX(),t.getMaxY()),this.diagDown0=new g(t.getMinX(),t.getMaxY()),this.diagDown1=new g(t.getMaxX(),t.getMinY())}function qr(){this._isDone=!1}function Br(){this.rectangle=null,this.rectEnv=null;var t=arguments[0];this.rectangle=t,this.rectEnv=t.getEnvelopeInternal()}function zr(){qr.apply(this),this.rectEnv=null,this._intersects=!1;var t=arguments[0];this.rectEnv=t}function Vr(){qr.apply(this),this.rectSeq=null,this.rectEnv=null,this._containsPoint=!1;var t=arguments[0];this.rectSeq=t.getExteriorRing().getCoordinateSequence(),this.rectEnv=t.getEnvelopeInternal()}function kr(){qr.apply(this),this.rectEnv=null,this.rectIntersector=null,this.hasIntersection=!1,this.p0=new g,this.p1=new g;var t=arguments[0];this.rectEnv=t.getEnvelopeInternal(),this.rectIntersector=new Gr(this.rectEnv)}function Yr(){if(this._relate=null,2===arguments.length){var t=arguments[0],e=arguments[1];ti.call(this,t,e),this._relate=new Ar(this.arg)}else if(3===arguments.length){var n=arguments[0],i=arguments[1],r=arguments[2];ti.call(this,n,i,r),this._relate=new Ar(this.arg)}}function Ur(){this.geomFactory=null,this.skipEmpty=!1,this.inputGeoms=null;var t=arguments[0];this.geomFactory=Ur.extractFactory(t),this.inputGeoms=t}function Xr(){this.pointGeom=null,this.otherGeom=null,this.geomFact=null;var t=arguments[0],e=arguments[1];this.pointGeom=t,this.otherGeom=e,this.geomFact=e.getFactory()}function Hr(){this.sortIndex=-1,this.comps=null;var t=arguments[0],e=arguments[1];this.sortIndex=t,this.comps=e}function Wr(){this.inputPolys=null,this.geomFactory=null;var t=arguments[0];this.inputPolys=t,null===this.inputPolys&&(this.inputPolys=new I)}function jr(){if(this.polygons=new I,this.lines=new I,this.points=new I,this.geomFact=null,1===arguments.length){if(R(arguments[0],v)){var t=arguments[0];this.extract(t)}else if(arguments[0]instanceof B){var e=arguments[0];this.extract(e)}}else if(2===arguments.length){var n=arguments[0],i=arguments[1];this.geomFact=i,this.extract(n)}}function Kr(){this.geometryFactory=new ie,this.geomGraph=null,this.disconnectedRingcoord=null;var t=arguments[0];this.geomGraph=t}function Zr(){this.items=new I,this.subnode=[null,null]}function Qr(){if(this.min=null,this.max=null,0===arguments.length)this.min=0,this.max=0;else if(1===arguments.length){var t=arguments[0];this.init(t.min,t.max)}else if(2===arguments.length){var e=arguments[0],n=arguments[1];this.init(e,n)}}function Jr(){this.pt=0,this.level=0,this.interval=null;var t=arguments[0];this.computeKey(t)}function $r(){Zr.apply(this),this.interval=null,this.centre=null,this.level=null;var t=arguments[0],e=arguments[1];this.interval=t,this.level=e,this.centre=(t.getMin()+t.getMax())/2}function ts(){Zr.apply(this)}function es(){this.root=null,this.minExtent=1,this.root=new ts}function ns(){}function is(){this.ring=null,this.tree=null,this.crossings=0,this.interval=new Qr;var t=arguments[0];this.ring=t,this.buildIndex()}function rs(){tr.apply(this),this.mcp=null,this.p=null;var t=arguments[0],e=arguments[1];this.mcp=t,this.p=e}function ss(){this.nodes=new xn(new Dr)}function os(){this.li=new ae,this.geomGraph=null,this.nodeGraph=new ss,this.invalidPoint=null;var t=arguments[0];this.geomGraph=t}function as(){this.graph=null,this.rings=new I,this.totalEnv=new C,this.index=null,this.nestedPt=null;var t=arguments[0];this.graph=t}function us(){if(this.errorType=null,this.pt=null,1===arguments.length){var t=arguments[0];us.call(this,t,null)}else if(2===arguments.length){var e=arguments[0],n=arguments[1];this.errorType=e,null!==n&&(this.pt=n.copy())}}function ls(){this.parentGeometry=null,this.isSelfTouchingRingFormingHoleValid=!1,this.validErr=null;var t=arguments[0];this.parentGeometry=t}function hs(){_t.CoordinateOperation.apply(this),this.targetPM=null,this.removeCollapsed=!0;var t=arguments[0],e=arguments[1];this.targetPM=t,this.removeCollapsed=e}function cs(){this.targetPM=null,this.removeCollapsed=!0,this.changePrecisionModel=!1,this.isPointwise=!1;var t=arguments[0];this.targetPM=t}function fs(){this.pts=null,this.usePt=null,this.distanceTolerance=null,this.seg=new ce;var t=arguments[0];this.pts=t}function gs(){this.inputGeom=null,this.distanceTolerance=null,this.isEnsureValidTopology=!0;var t=arguments[0];this.inputGeom=t}function ds(){xe.apply(this),this.isEnsureValidTopology=!0,this.distanceTolerance=null;var t=arguments[0],e=arguments[1];this.isEnsureValidTopology=t,this.distanceTolerance=e}function ps(){if(this.parent=null,this.index=null,2===arguments.length){var t=arguments[0],e=arguments[1];ps.call(this,t,e,null,-1)}else if(4===arguments.length){var n=arguments[0],i=arguments[1],r=arguments[2],s=arguments[3];ce.call(this,n,i),this.parent=r,this.index=s}}function vs(){if(this.parentLine=null,this.segs=null,this.resultSegs=new I,this.minimumSize=null,1===arguments.length){var t=arguments[0];vs.call(this,t,2)}else if(2===arguments.length){var e=arguments[0],n=arguments[1];this.parentLine=e,this.minimumSize=n,this.init()}}function ms(){this.index=new Pi}function ys(){this.querySeg=null,this.items=new I;var t=arguments[0];this.querySeg=t}function xs(){this.li=new ae,this.inputIndex=new ms,this.outputIndex=new ms,this.line=null,this.linePts=null,this.distanceTolerance=0;var t=arguments[0],e=arguments[1];this.inputIndex=t,this.outputIndex=e}function Es(){this.inputIndex=new ms,this.outputIndex=new ms,this.distanceTolerance=0}function Is(){this.inputGeom=null,this.lineSimplifier=new Es,this.linestringMap=null;var t=arguments[0];this.inputGeom=t}function Ns(){xe.apply(this),this.linestringMap=null;var t=arguments[0];this.linestringMap=t}function Cs(){this.tps=null;var t=arguments[0];this.tps=t}function Ss(){this.seg=null,this.segLen=null,this.splitPt=null,this.minimumLen=0;var t=arguments[0];this.seg=t,this.segLen=t.getLength()}function ws(){}function Ls(){}function Rs(){}function Ts(){if(this.p=null,1===arguments.length){var t=arguments[0];this.p=new g(t)}else if(2===arguments.length){var e=arguments[0],n=arguments[1];this.p=new g(e,n)}else if(3===arguments.length){var i=arguments[0],r=arguments[1],s=arguments[2];this.p=new g(i,r,s)}}function Ps(){this._isOnConstraint=null,this.constraint=null;var t=arguments[0];Ts.call(this,t)}function bs(){this._rot=null,this.vertex=null,this.next=null,this.data=null}function Os(){this.subdiv=null,this.isUsingTolerance=!1;var t=arguments[0];this.subdiv=t,this.isUsingTolerance=t.getTolerance()>0}function _s(){}function Ms(){this.subdiv=null,this.lastEdge=null;var t=arguments[0];this.subdiv=t,this.init()}function Ds(){if(this.seg=null,1===arguments.length){if("string"==typeof arguments[0]){var t=arguments[0];l.call(this,t)}else if(arguments[0]instanceof ce){var e=arguments[0];l.call(this,"Locate failed to converge (at edge: "+e+").  Possible causes include invalid Subdivision topology or very close sites"),this.seg=new ce(e)}}else if(2===arguments.length){var n=arguments[0],i=arguments[1];l.call(this,Ds.msgWithSpatial(n,i)),this.seg=new ce(i)}}function As(){}function Fs(){this.visitedKey=0,this.quadEdges=new I,this.startingEdge=null,this.tolerance=null,this.edgeCoincidenceTolerance=null,this.frameVertex=new Array(3).fill(null),this.frameEnv=null,this.locator=null,this.seg=new ce,this.triEdges=new Array(3).fill(null);var t=arguments[0],e=arguments[1];this.tolerance=e,this.edgeCoincidenceTolerance=e/Fs.EDGE_COINCIDENCE_TOL_FACTOR,this.createFrame(t),this.startingEdge=this.initSubdiv(),this.locator=new Ms(this)}function Gs(){}function qs(){this.triList=new I}function Bs(){this.triList=new I}function zs(){this.coordList=new N,this.triCoords=new I}function Vs(){if(this.ls=null,this.data=null,2===arguments.length){var t=arguments[0],e=arguments[1];this.ls=new ce(t,e)}else if(3===arguments.length){var n=arguments[0],i=arguments[1],r=arguments[2];this.ls=new ce(n,i),this.data=r}else if(6===arguments.length){var s=arguments[0],o=arguments[1],a=arguments[2],u=arguments[3],l=arguments[4],h=arguments[5];Vs.call(this,new g(s,o,a),new g(u,l,h))}else if(7===arguments.length){var c=arguments[0],f=arguments[1],d=arguments[2],p=arguments[3],v=arguments[4],m=arguments[5],y=arguments[6];Vs.call(this,new g(c,f,d),new g(p,v,m),y)}}function ks(){}function Ys(){if(this.p=null,this.data=null,this.left=null,this.right=null,this.count=null,2===arguments.length){var t=arguments[0],e=arguments[1];this.p=new g(t),this.left=null,this.right=null,this.count=1,this.data=e}else if(3===arguments.length){var n=arguments[0],i=arguments[1],r=arguments[2];this.p=new g(n,i),this.left=null,this.right=null,this.count=1,this.data=r}}function Us(){if(this.root=null,this.numberOfNodes=null,this.tolerance=null,0===arguments.length)Us.call(this,0);else if(1===arguments.length){var t=arguments[0];this.tolerance=t}}function Xs(){this.tolerance=null,this.matchNode=null,this.matchDist=0,this.p=null;var t=arguments[0],e=arguments[1];this.p=t,this.tolerance=e}function Hs(){this.initialVertices=null,this.segVertices=null,this.segments=new I,this.subdiv=null,this.incDel=null,this.convexHull=null,this.splitFinder=new Ls,this.kdt=null,this.vertexFactory=null,this.computeAreaEnv=null,this.splitPt=null,this.tolerance=null;var t=arguments[0],e=arguments[1];this.initialVertices=new I(t),this.tolerance=e,this.kdt=new Us(e)}function Ws(){this.siteCoords=null,this.tolerance=0,this.subdiv=null}function js(){this.siteCoords=null,this.constraintLines=null,this.tolerance=0,this.subdiv=null,this.constraintVertexMap=new rt}function Ks(){this.siteCoords=null,this.tolerance=0,this.subdiv=null,this.clipEnv=null,this.diagramEnv=null}function Zs(){}Array.prototype.fill||(Array.prototype.fill=function(t){for(var e=Object(this),n=parseInt(e.length,10),i=arguments[1],r=parseInt(i,10)||0,s=0>r?Math.max(n+r,0):Math.min(r,n),o=arguments[2],a=void 0===o?n:parseInt(o,10)||0,u=0>a?Math.max(n+a,0):Math.min(a,n);u>s;s++)e[s]=t;return e}),Number.isFinite=Number.isFinite||function(t){return"number"==typeof t&&isFinite(t)},Number.isInteger=Number.isInteger||function(t){return"number"==typeof t&&isFinite(t)&&Math.floor(t)===t},Number.parseFloat=Number.parseFloat||parseFloat,Number.isNaN=Number.isNaN||function(t){return t!==t},Math.trunc=Math.trunc||function(t){return 0>t?Math.ceil(t):Math.floor(t)},e(n.prototype,{interfaces_:function(){return[]},getClass:function(){return n}}),n.equalsWithTolerance=function(t,e,n){return Math.abs(t-e)<=n},r.isNaN=function(t){return Number.isNaN(t)},r.doubleToLongBits=function(t){return t},r.longBitsToDouble=function(t){return t},r.isInfinite=function(t){return!Number.isFinite(t)},r.MAX_VALUE=Number.MAX_VALUE,h(c,l),e(c.prototype,{interfaces_:function(){return[]},getClass:function(){return c}}),e(f.prototype,{interfaces_:function(){return[]},getClass:function(){return f}}),f.shouldNeverReachHere=function(){if(0===arguments.length)f.shouldNeverReachHere(null);else if(1===arguments.length){var t=arguments[0];throw new c("Should never reach here"+(null!==t?": "+t:""))}},f.isTrue=function(){if(1===arguments.length){var t=arguments[0];f.isTrue(t,null)}else if(2===arguments.length){var e=arguments[0],n=arguments[1];if(!e)throw null===n?new c:new c(n)}},f.equals=function(){if(2===arguments.length){var t=arguments[0],e=arguments[1];f.equals(t,e,null)}else if(3===arguments.length){var n=arguments[0],i=arguments[1],r=arguments[2];if(!i.equals(n))throw new c("Expected "+n+" but encountered "+i+(null!==r?": "+r:""))}},e(g.prototype,{setOrdinate:function(t,e){switch(t){case g.X:this.x=e;break;case g.Y:this.y=e;break;case g.Z:this.z=e;break;default:throw new i("Invalid ordinate index: "+t)}},equals2D:function(){if(1===arguments.length){var t=arguments[0];return this.x!==t.x?!1:this.y===t.y}if(2===arguments.length){var e=arguments[0],i=arguments[1];return n.equalsWithTolerance(this.x,e.x,i)?!!n.equalsWithTolerance(this.y,e.y,i):!1}},getOrdinate:function(t){switch(t){case g.X:return this.x;case g.Y:return this.y;case g.Z:return this.z}throw new i("Invalid ordinate index: "+t)},equals3D:function(t){return this.x===t.x&&this.y===t.y&&(this.z===t.z||r.isNaN(this.z)&&r.isNaN(t.z))},equals:function(t){return t instanceof g?this.equals2D(t):!1},equalInZ:function(t,e){return n.equalsWithTolerance(this.z,t.z,e)},compareTo:function(t){var e=t;return this.x<e.x?-1:this.x>e.x?1:this.y<e.y?-1:this.y>e.y?1:0},clone:function(){try{var t=null;return t}catch(t){if(t instanceof CloneNotSupportedException)return f.shouldNeverReachHere("this shouldn't happen because this class is Cloneable"),null;throw t}finally{}},copy:function(){return new g(this)},toString:function(){return"("+this.x+", "+this.y+", "+this.z+")"},distance3D:function(t){var e=this.x-t.x,n=this.y-t.y,i=this.z-t.z;return Math.sqrt(e*e+n*n+i*i)},distance:function(t){var e=this.x-t.x,n=this.y-t.y;return Math.sqrt(e*e+n*n)},hashCode:function(){var t=17;return t=37*t+g.hashCode(this.x),t=37*t+g.hashCode(this.y)},setCoordinate:function(t){this.x=t.x,this.y=t.y,this.z=t.z},interfaces_:function(){return[s,o,u]},getClass:function(){return g}}),g.hashCode=function(){if(1===arguments.length){var t=arguments[0],e=r.doubleToLongBits(t);return Math.trunc(e^e>>>32)}},e(d.prototype,{compare:function(t,e){var n=t,i=e,r=d.compare(n.x,i.x);if(0!==r)return r;var s=d.compare(n.y,i.y);if(0!==s)return s;if(this.dimensionsToTest<=2)return 0;var o=d.compare(n.z,i.z);return o},interfaces_:function(){return[a]},getClass:function(){return d}}),d.compare=function(t,e){return e>t?-1:t>e?1:r.isNaN(t)?r.isNaN(e)?0:-1:r.isNaN(e)?1:0},g.DimensionalComparator=d,g.serialVersionUID=0x5cbf2c235c7e5800,g.NULL_ORDINATE=r.NaN,g.X=0,g.Y=1,g.Z=2,p.prototype.hasNext=function(){},p.prototype.next=function(){},p.prototype.remove=function(){},v.prototype.add=function(){},v.prototype.addAll=function(){},v.prototype.isEmpty=function(){},v.prototype.iterator=function(){},v.prototype.size=function(){},v.prototype.toArray=function(){},v.prototype.remove=function(){},m.prototype=new Error,m.prototype.name="IndexOutOfBoundsException",y.prototype=Object.create(v.prototype),y.prototype.constructor=y,y.prototype.get=function(){},y.prototype.set=function(){},y.prototype.isEmpty=function(){},x.prototype=new Error,x.prototype.name="NoSuchElementException",E.prototype=new Error,E.prototype.name="OperationNotSupported",I.prototype=Object.create(y.prototype),I.prototype.constructor=I,I.prototype.ensureCapacity=function(){},I.prototype.interfaces_=function(){return[y,v]},I.prototype.add=function(t){return this.array_.push(t),!0},I.prototype.clear=function(){this.array_=[]},I.prototype.addAll=function(t){for(var e=t.iterator();e.hasNext();)this.add(e.next());return!0},I.prototype.set=function(t,e){var n=this.array_[t];return this.array_[t]=e,n},I.prototype.iterator=function(){return new Qs(this)},I.prototype.get=function(t){if(0>t||t>=this.size())throw new m;return this.array_[t]},I.prototype.isEmpty=function(){return 0===this.array_.length},I.prototype.size=function(){return this.array_.length},I.prototype.toArray=function(){for(var t=[],e=0,n=this.array_.length;n>e;e++)t.push(this.array_[e]);return t},I.prototype.remove=function(t){for(var e=!1,n=0,i=this.array_.length;i>n;n++)if(this.array_[n]===t){this.array_.splice(n,1),e=!0;break}return e};var Qs=function(t){this.arrayList_=t,this.position_=0};Qs.prototype.next=function(){if(this.position_===this.arrayList_.size())throw new x;return this.arrayList_.get(this.position_++)},Qs.prototype.hasNext=function(){return this.position_<this.arrayList_.size()},Qs.prototype.set=function(t){return this.arrayList_.set(this.position_-1,t)},Qs.prototype.remove=function(){throw new E},h(N,I),e(N.prototype,{getCoordinate:function(t){return this.get(t)},addAll:function(){if(2===arguments.length){for(var t=arguments[0],e=arguments[1],n=!1,i=t.iterator();i.hasNext();)this.add(i.next(),e),n=!0;return n}return I.prototype.addAll.apply(this,arguments)},clone:function t(){for(var t=I.prototype.clone.call(this),e=0;e<this.size();e++)t.add(e,this.get(e).copy());return t},toCoordinateArray:function(){return this.toArray(N.coordArrayType)},add:function(){if(1===arguments.length){var t=arguments[0];I.prototype.add.call(this,t)}else if(2===arguments.length){if(arguments[0]instanceof Array&&"boolean"==typeof arguments[1]){var e=arguments[0],n=arguments[1];return this.add(e,n,!0),!0}if(arguments[0]instanceof g&&"boolean"==typeof arguments[1]){var i=arguments[0],r=arguments[1];if(!r&&this.size()>=1){var s=this.get(this.size()-1);if(s.equals2D(i))return null}I.prototype.add.call(this,i)}else if(arguments[0]instanceof Object&&"boolean"==typeof arguments[1]){var o=arguments[0],a=arguments[1];return this.add(o,a),!0}}else if(3===arguments.length){if("boolean"==typeof arguments[2]&&arguments[0]instanceof Array&&"boolean"==typeof arguments[1]){var u=arguments[0],l=arguments[1],h=arguments[2];if(h)for(var c=0;c<u.length;c++)this.add(u[c],l);else for(var c=u.length-1;c>=0;c--)this.add(u[c],l);return!0}if("boolean"==typeof arguments[2]&&Number.isInteger(arguments[0])&&arguments[1]instanceof g){var f=arguments[0],d=arguments[1],p=arguments[2];if(!p){var v=this.size();if(v>0){if(f>0){var m=this.get(f-1);if(m.equals2D(d))return null}if(v>f){var y=this.get(f);if(y.equals2D(d))return null}}}I.prototype.add.call(this,f,d)}}else if(4===arguments.length){var x=arguments[0],E=arguments[1],N=arguments[2],C=arguments[3],S=1;N>C&&(S=-1);for(var c=N;c!==C;c+=S)this.add(x[c],E);return!0}},closeRing:function(){this.size()>0&&this.add(new g(this.get(0)),!1)},interfaces_:function(){return[]},getClass:function(){return N}}),N.coordArrayType=new Array(0).fill(null),e(C.prototype,{getArea:function(){return this.getWidth()*this.getHeight()},equals:function(t){if(!(t instanceof C))return!1;var e=t;return this.isNull()?e.isNull():this.maxx===e.getMaxX()&&this.maxy===e.getMaxY()&&this.minx===e.getMinX()&&this.miny===e.getMinY()},intersection:function(t){if(this.isNull()||t.isNull()||!this.intersects(t))return new C;var e=this.minx>t.minx?this.minx:t.minx,n=this.miny>t.miny?this.miny:t.miny,i=this.maxx<t.maxx?this.maxx:t.maxx,r=this.maxy<t.maxy?this.maxy:t.maxy;return new C(e,i,n,r)},isNull:function(){return this.maxx<this.minx},getMaxX:function(){return this.maxx},covers:function(){if(1===arguments.length){if(arguments[0]instanceof g){var t=arguments[0];return this.covers(t.x,t.y)}if(arguments[0]instanceof C){var e=arguments[0];return this.isNull()||e.isNull()?!1:e.getMinX()>=this.minx&&e.getMaxX()<=this.maxx&&e.getMinY()>=this.miny&&e.getMaxY()<=this.maxy}}else if(2===arguments.length){var n=arguments[0],i=arguments[1];return this.isNull()?!1:n>=this.minx&&n<=this.maxx&&i>=this.miny&&i<=this.maxy}},intersects:function(){if(1===arguments.length){if(arguments[0]instanceof C){var t=arguments[0];return this.isNull()||t.isNull()?!1:!(t.minx>this.maxx||t.maxx<this.minx||t.miny>this.maxy||t.maxy<this.miny)}if(arguments[0]instanceof g){var e=arguments[0];return this.intersects(e.x,e.y)}}else if(2===arguments.length){var n=arguments[0],i=arguments[1];return this.isNull()?!1:!(n>this.maxx||n<this.minx||i>this.maxy||i<this.miny)}},getMinY:function(){return this.miny},getMinX:function(){return this.minx},expandToInclude:function(){if(1===arguments.length){if(arguments[0]instanceof g){var t=arguments[0];this.expandToInclude(t.x,t.y)}else if(arguments[0]instanceof C){var e=arguments[0];if(e.isNull())return null;this.isNull()?(this.minx=e.getMinX(),this.maxx=e.getMaxX(),this.miny=e.getMinY(),this.maxy=e.getMaxY()):(e.minx<this.minx&&(this.minx=e.minx),e.maxx>this.maxx&&(this.maxx=e.maxx),e.miny<this.miny&&(this.miny=e.miny),e.maxy>this.maxy&&(this.maxy=e.maxy))}}else if(2===arguments.length){var n=arguments[0],i=arguments[1];this.isNull()?(this.minx=n,this.maxx=n,this.miny=i,this.maxy=i):(n<this.minx&&(this.minx=n),n>this.maxx&&(this.maxx=n),i<this.miny&&(this.miny=i),i>this.maxy&&(this.maxy=i))}},minExtent:function(){if(this.isNull())return 0;var t=this.getWidth(),e=this.getHeight();return e>t?t:e},getWidth:function(){return this.isNull()?0:this.maxx-this.minx},compareTo:function(t){var e=t;return this.isNull()?e.isNull()?0:-1:e.isNull()?1:this.minx<e.minx?-1:this.minx>e.minx?1:this.miny<e.miny?-1:this.miny>e.miny?1:this.maxx<e.maxx?-1:this.maxx>e.maxx?1:this.maxy<e.maxy?-1:this.maxy>e.maxy?1:0},translate:function(t,e){return this.isNull()?null:void this.init(this.getMinX()+t,this.getMaxX()+t,this.getMinY()+e,this.getMaxY()+e)},toString:function(){return"Env["+this.minx+" : "+this.maxx+", "+this.miny+" : "+this.maxy+"]"},setToNull:function(){this.minx=0,this.maxx=-1,this.miny=0,this.maxy=-1},getHeight:function(){return this.isNull()?0:this.maxy-this.miny},maxExtent:function(){if(this.isNull())return 0;var t=this.getWidth(),e=this.getHeight();return t>e?t:e},expandBy:function(){if(1===arguments.length){var t=arguments[0];this.expandBy(t,t)}else if(2===arguments.length){var e=arguments[0],n=arguments[1];if(this.isNull())return null;this.minx-=e,this.maxx+=e,this.miny-=n,this.maxy+=n,(this.minx>this.maxx||this.miny>this.maxy)&&this.setToNull()}},contains:function(){if(1===arguments.length){if(arguments[0]instanceof C){var t=arguments[0];return this.covers(t)}if(arguments[0]instanceof g){var e=arguments[0];return this.covers(e)}}else if(2===arguments.length){var n=arguments[0],i=arguments[1];return this.covers(n,i)}},centre:function(){return this.isNull()?null:new g((this.getMinX()+this.getMaxX())/2,(this.getMinY()+this.getMaxY())/2)},init:function(){if(0===arguments.length)this.setToNull();else if(1===arguments.length){if(arguments[0]instanceof g){var t=arguments[0];this.init(t.x,t.x,t.y,t.y)}else if(arguments[0]instanceof C){var e=arguments[0];this.minx=e.minx,this.maxx=e.maxx,this.miny=e.miny,this.maxy=e.maxy}}else if(2===arguments.length){var n=arguments[0],i=arguments[1];this.init(n.x,i.x,n.y,i.y)}else if(4===arguments.length){var r=arguments[0],s=arguments[1],o=arguments[2],a=arguments[3];s>r?(this.minx=r,this.maxx=s):(this.minx=s,this.maxx=r),a>o?(this.miny=o,this.maxy=a):(this.miny=a,this.maxy=o)}},getMaxY:function(){return this.maxy},distance:function(t){if(this.intersects(t))return 0;var e=0;this.maxx<t.minx?e=t.minx-this.maxx:this.minx>t.maxx&&(e=this.minx-t.maxx);var n=0;return this.maxy<t.miny?n=t.miny-this.maxy:this.miny>t.maxy&&(n=this.miny-t.maxy),0===e?n:0===n?e:Math.sqrt(e*e+n*n)},hashCode:function(){var t=17;return t=37*t+g.hashCode(this.minx),t=37*t+g.hashCode(this.maxx),t=37*t+g.hashCode(this.miny),t=37*t+g.hashCode(this.maxy)},interfaces_:function(){return[s,u]},getClass:function(){return C}}),C.intersects=function(){if(3===arguments.length){var t=arguments[0],e=arguments[1],n=arguments[2];return n.x>=(t.x<e.x?t.x:e.x)&&n.x<=(t.x>e.x?t.x:e.x)&&n.y>=(t.y<e.y?t.y:e.y)&&n.y<=(t.y>e.y?t.y:e.y)}if(4===arguments.length){var i=arguments[0],r=arguments[1],s=arguments[2],o=arguments[3],a=Math.min(s.x,o.x),u=Math.max(s.x,o.x),l=Math.min(i.x,r.x),h=Math.max(i.x,r.x);return l>u?!1:a>h?!1:(a=Math.min(s.y,o.y),u=Math.max(s.y,o.y),l=Math.min(i.y,r.y),h=Math.max(i.y,r.y),l>u?!1:!(a>h))}},C.serialVersionUID=0x51845cd552189800,h(w,S),e(w.prototype,{interfaces_:function(){return[]},getClass:function(){return w}}),e(L.prototype,{interfaces_:function(){return[]},getClass:function(){return L}}),L.toLocationSymbol=function(t){switch(t){case L.EXTERIOR:return"e";case L.BOUNDARY:return"b";case L.INTERIOR:return"i";case L.NONE:return"-"}throw new i("Unknown location value: "+t)},L.INTERIOR=0,L.BOUNDARY=1,L.EXTERIOR=2,L.NONE=-1,e(T.prototype,{interfaces_:function(){return[]},getClass:function(){return T}}),T.log10=function(t){var e=Math.log(t);return r.isInfinite(e)?e:r.isNaN(e)?e:e/T.LOG_10},T.min=function(t,e,n,i){var r=t;return r>e&&(r=e),r>n&&(r=n),r>i&&(r=i),r},T.clamp=function(){if("number"==typeof arguments[2]&&"number"==typeof arguments[0]&&"number"==typeof arguments[1]){var t=arguments[0],e=arguments[1],n=arguments[2];return e>t?e:t>n?n:t}if(Number.isInteger(arguments[2])&&Number.isInteger(arguments[0])&&Number.isInteger(arguments[1])){var i=arguments[0],r=arguments[1],s=arguments[2];return r>i?r:i>s?s:i}},T.wrap=function(t,e){return 0>t?e- -t%e:t%e},T.max=function(){if(3===arguments.length){var t=arguments[0],e=arguments[1],n=arguments[2],i=t;return e>i&&(i=e),n>i&&(i=n),i}if(4===arguments.length){var r=arguments[0],s=arguments[1],o=arguments[2],a=arguments[3],i=r;return s>i&&(i=s),o>i&&(i=o),a>i&&(i=a),i}},T.average=function(t,e){
return(t+e)/2},T.LOG_10=Math.log(10),P.prototype.append=function(t){this.str+=t},P.prototype.setCharAt=function(t,e){return this.str.substr(0,t)+e+this.str.substr(t+1)},P.prototype.toString=function(t){return this.str},b.prototype.intValue=function(){return this.value},b.prototype.compareTo=function(t){return this.value<t?-1:this.value>t?1:0},b.isNaN=function(t){return Number.isNaN(t)},O.isWhitespace=function(t){return 32>=t&&t>=0||127==t},O.toUpperCase=function(t){return t.toUpperCase()},e(_.prototype,{le:function(t){return this.hi<t.hi||this.hi===t.hi&&this.lo<=t.lo},extractSignificantDigits:function(t,e){var n=this.abs(),i=_.magnitude(n.hi),r=_.TEN.pow(i);n=n.divide(r),n.gt(_.TEN)?(n=n.divide(_.TEN),i+=1):n.lt(_.ONE)&&(n=n.multiply(_.TEN),i-=1);for(var s=i+1,o=new P,a=_.MAX_PRINT_DIGITS-1,u=0;a>=u;u++){t&&u===s&&o.append(".");var l=Math.trunc(n.hi);if(0>l)break;var h=!1,c=0;l>9?(h=!0,c="9"):c="0"+l,o.append(c),n=n.subtract(_.valueOf(l)).multiply(_.TEN),h&&n.selfAdd(_.TEN);var f=!0,g=_.magnitude(n.hi);if(0>g&&Math.abs(g)>=a-u&&(f=!1),!f)break}return e[0]=i,o.toString()},sqr:function(){return this.multiply(this)},doubleValue:function(){return this.hi+this.lo},subtract:function(){if(arguments[0]instanceof _){var t=arguments[0];return this.add(t.negate())}if("number"==typeof arguments[0]){var e=arguments[0];return this.add(-e)}},equals:function(){if(1===arguments.length){var t=arguments[0];return this.hi===t.hi&&this.lo===t.lo}},isZero:function(){return 0===this.hi&&0===this.lo},selfSubtract:function(){if(arguments[0]instanceof _){var t=arguments[0];return this.isNaN()?this:this.selfAdd(-t.hi,-t.lo)}if("number"==typeof arguments[0]){var e=arguments[0];return this.isNaN()?this:this.selfAdd(-e,0)}},getSpecialNumberString:function(){return this.isZero()?"0.0":this.isNaN()?"NaN ":null},min:function(t){return this.le(t)?this:t},selfDivide:function(){if(1===arguments.length){if(arguments[0]instanceof _){var t=arguments[0];return this.selfDivide(t.hi,t.lo)}if("number"==typeof arguments[0]){var e=arguments[0];return this.selfDivide(e,0)}}else if(2===arguments.length){var n=arguments[0],i=arguments[1],r=null,s=null,o=null,a=null,u=null,l=null,h=null,c=null;return u=this.hi/n,l=_.SPLIT*u,r=l-u,c=_.SPLIT*n,r=l-r,s=u-r,o=c-n,h=u*n,o=c-o,a=n-o,c=r*o-h+r*a+s*o+s*a,l=(this.hi-h-c+this.lo-u*i)/n,c=u+l,this.hi=c,this.lo=u-c+l,this}},dump:function(){return"DD<"+this.hi+", "+this.lo+">"},divide:function(){if(arguments[0]instanceof _){var t=arguments[0],e=null,n=null,i=null,s=null,o=null,a=null,u=null,l=null;o=this.hi/t.hi,a=_.SPLIT*o,e=a-o,l=_.SPLIT*t.hi,e=a-e,n=o-e,i=l-t.hi,u=o*t.hi,i=l-i,s=t.hi-i,l=e*i-u+e*s+n*i+n*s,a=(this.hi-u-l+this.lo-o*t.lo)/t.hi,l=o+a;var h=l,c=o-l+a;return new _(h,c)}if("number"==typeof arguments[0]){var f=arguments[0];return r.isNaN(f)?_.createNaN():_.copy(this).selfDivide(f,0)}},ge:function(t){return this.hi>t.hi||this.hi===t.hi&&this.lo>=t.lo},pow:function(t){if(0===t)return _.valueOf(1);var e=new _(this),n=_.valueOf(1),i=Math.abs(t);if(i>1)for(;i>0;)i%2===1&&n.selfMultiply(e),i/=2,i>0&&(e=e.sqr());else n=e;return 0>t?n.reciprocal():n},ceil:function(){if(this.isNaN())return _.NaN;var t=Math.ceil(this.hi),e=0;return t===this.hi&&(e=Math.ceil(this.lo)),new _(t,e)},compareTo:function(t){var e=t;return this.hi<e.hi?-1:this.hi>e.hi?1:this.lo<e.lo?-1:this.lo>e.lo?1:0},rint:function(){if(this.isNaN())return this;var t=this.add(.5);return t.floor()},setValue:function(){if(arguments[0]instanceof _){var t=arguments[0];return this.init(t),this}if("number"==typeof arguments[0]){var e=arguments[0];return this.init(e),this}},max:function(t){return this.ge(t)?this:t},sqrt:function(){if(this.isZero())return _.valueOf(0);if(this.isNegative())return _.NaN;var t=1/Math.sqrt(this.hi),e=this.hi*t,n=_.valueOf(e),i=this.subtract(n.sqr()),r=i.hi*(.5*t);return n.add(r)},selfAdd:function(){if(1===arguments.length){if(arguments[0]instanceof _){var t=arguments[0];return this.selfAdd(t.hi,t.lo)}if("number"==typeof arguments[0]){var e=arguments[0],n=null,i=null,r=null,s=null,o=null,a=null;return r=this.hi+e,o=r-this.hi,s=r-o,s=e-o+(this.hi-s),a=s+this.lo,n=r+a,i=a+(r-n),this.hi=n+i,this.lo=i+(n-this.hi),this}}else if(2===arguments.length){var u=arguments[0],l=arguments[1],n=null,i=null,h=null,c=null,r=null,s=null,o=null,a=null;r=this.hi+u,h=this.lo+l,o=r-this.hi,a=h-this.lo,s=r-o,c=h-a,s=u-o+(this.hi-s),c=l-a+(this.lo-c),o=s+h,n=r+o,i=o+(r-n),o=c+i;var f=n+o,g=o+(n-f);return this.hi=f,this.lo=g,this}},selfMultiply:function(){if(1===arguments.length){if(arguments[0]instanceof _){var t=arguments[0];return this.selfMultiply(t.hi,t.lo)}if("number"==typeof arguments[0]){var e=arguments[0];return this.selfMultiply(e,0)}}else if(2===arguments.length){var n=arguments[0],i=arguments[1],r=null,s=null,o=null,a=null,u=null,l=null;u=_.SPLIT*this.hi,r=u-this.hi,l=_.SPLIT*n,r=u-r,s=this.hi-r,o=l-n,u=this.hi*n,o=l-o,a=n-o,l=r*o-u+r*a+s*o+s*a+(this.hi*i+this.lo*n);var h=u+l;r=u-h;var c=l+r;return this.hi=h,this.lo=c,this}},selfSqr:function(){return this.selfMultiply(this)},floor:function(){if(this.isNaN())return _.NaN;var t=Math.floor(this.hi),e=0;return t===this.hi&&(e=Math.floor(this.lo)),new _(t,e)},negate:function(){return this.isNaN()?this:new _(-this.hi,-this.lo)},clone:function(){try{return null}catch(t){if(t instanceof CloneNotSupportedException)return null;throw t}finally{}},multiply:function(){if(arguments[0]instanceof _){var t=arguments[0];return t.isNaN()?_.createNaN():_.copy(this).selfMultiply(t)}if("number"==typeof arguments[0]){var e=arguments[0];return r.isNaN(e)?_.createNaN():_.copy(this).selfMultiply(e,0)}},isNaN:function(){return r.isNaN(this.hi)},intValue:function(){return Math.trunc(this.hi)},toString:function(){var t=_.magnitude(this.hi);return t>=-3&&20>=t?this.toStandardNotation():this.toSciNotation()},toStandardNotation:function(){var t=this.getSpecialNumberString();if(null!==t)return t;var e=new Array(1).fill(null),n=this.extractSignificantDigits(!0,e),i=e[0]+1,r=n;if("."===n.charAt(0))r="0"+n;else if(0>i)r="0."+_.stringOfChar("0",-i)+n;else if(-1===n.indexOf(".")){var s=i-n.length,o=_.stringOfChar("0",s);r=n+o+".0"}return this.isNegative()?"-"+r:r},reciprocal:function(){var t=null,e=null,n=null,i=null,r=null,s=null,o=null,a=null;r=1/this.hi,s=_.SPLIT*r,t=s-r,a=_.SPLIT*this.hi,t=s-t,e=r-t,n=a-this.hi,o=r*this.hi,n=a-n,i=this.hi-n,a=t*n-o+t*i+e*n+e*i,s=(1-o-a-r*this.lo)/this.hi;var u=r+s,l=r-u+s;return new _(u,l)},toSciNotation:function(){if(this.isZero())return _.SCI_NOT_ZERO;var t=this.getSpecialNumberString();if(null!==t)return t;var e=new Array(1).fill(null),n=this.extractSignificantDigits(!1,e),i=_.SCI_NOT_EXPONENT_CHAR+e[0];if("0"===n.charAt(0))throw new IllegalStateException("Found leading zero: "+n);var r="";n.length>1&&(r=n.substring(1));var s=n.charAt(0)+"."+r;return this.isNegative()?"-"+s+i:s+i},abs:function(){return this.isNaN()?_.NaN:this.isNegative()?this.negate():new _(this)},isPositive:function(){return this.hi>0||0===this.hi&&this.lo>0},lt:function(t){return this.hi<t.hi||this.hi===t.hi&&this.lo<t.lo},add:function(){if(arguments[0]instanceof _){var t=arguments[0];return _.copy(this).selfAdd(t)}if("number"==typeof arguments[0]){var e=arguments[0];return _.copy(this).selfAdd(e)}},init:function(){if(1===arguments.length){if("number"==typeof arguments[0]){var t=arguments[0];this.hi=t,this.lo=0}else if(arguments[0]instanceof _){var e=arguments[0];this.hi=e.hi,this.lo=e.lo}}else if(2===arguments.length){var n=arguments[0],i=arguments[1];this.hi=n,this.lo=i}},gt:function(t){return this.hi>t.hi||this.hi===t.hi&&this.lo>t.lo},isNegative:function(){return this.hi<0||0===this.hi&&this.lo<0},trunc:function(){return this.isNaN()?_.NaN:this.isPositive()?this.floor():this.ceil()},signum:function(){return this.hi>0?1:this.hi<0?-1:this.lo>0?1:this.lo<0?-1:0},interfaces_:function(){return[u,s,o]},getClass:function(){return _}}),_.sqr=function(t){return _.valueOf(t).selfMultiply(t)},_.valueOf=function(){if("string"==typeof arguments[0]){var t=arguments[0];return _.parse(t)}if("number"==typeof arguments[0]){var e=arguments[0];return new _(e)}},_.sqrt=function(t){return _.valueOf(t).sqrt()},_.parse=function(t){for(var e=0,n=t.length;O.isWhitespace(t.charAt(e));)e++;var i=!1;if(n>e){var r=t.charAt(e);"-"!==r&&"+"!==r||(e++,"-"===r&&(i=!0))}for(var s=new _,o=0,a=0,u=0;;){if(e>=n)break;var l=t.charAt(e);if(e++,O.isDigit(l)){var h=l-"0";s.selfMultiply(_.TEN),s.selfAdd(h),o++}else{if("."!==l){if("e"===l||"E"===l){var c=t.substring(e);try{u=b.parseInt(c)}catch(e){throw e instanceof NumberFormatException?new NumberFormatException("Invalid exponent "+c+" in string "+t):e}finally{}break}throw new NumberFormatException("Unexpected character '"+l+"' at position "+e+" in string "+t)}a=o}}var f=s,g=o-a-u;if(0===g)f=s;else if(g>0){var d=_.TEN.pow(g);f=s.divide(d)}else if(0>g){var d=_.TEN.pow(-g);f=s.multiply(d)}return i?f.negate():f},_.createNaN=function(){return new _(r.NaN,r.NaN)},_.copy=function(t){return new _(t)},_.magnitude=function(t){var e=Math.abs(t),n=Math.log(e)/Math.log(10),i=Math.trunc(Math.floor(n)),r=Math.pow(10,i);return e>=10*r&&(i+=1),i},_.stringOfChar=function(t,e){for(var n=new P,i=0;e>i;i++)n.append(t);return n.toString()},_.PI=new _(3.141592653589793,1.2246467991473532e-16),_.TWO_PI=new _(6.283185307179586,2.4492935982947064e-16),_.PI_2=new _(1.5707963267948966,6.123233995736766e-17),_.E=new _(2.718281828459045,1.4456468917292502e-16),_.NaN=new _(r.NaN,r.NaN),_.EPS=1.23259516440783e-32,_.SPLIT=134217729,_.MAX_PRINT_DIGITS=32,_.TEN=_.valueOf(10),_.ONE=_.valueOf(1),_.SCI_NOT_EXPONENT_CHAR="E",_.SCI_NOT_ZERO="0.0E0",e(M.prototype,{interfaces_:function(){return[]},getClass:function(){return M}}),M.orientationIndex=function(t,e,n){var i=M.orientationIndexFilter(t,e,n);if(1>=i)return i;var r=_.valueOf(e.x).selfAdd(-t.x),s=_.valueOf(e.y).selfAdd(-t.y),o=_.valueOf(n.x).selfAdd(-e.x),a=_.valueOf(n.y).selfAdd(-e.y);return r.selfMultiply(a).selfSubtract(s.selfMultiply(o)).signum()},M.signOfDet2x2=function(t,e,n,i){var r=t.multiply(i).selfSubtract(e.multiply(n));return r.signum()},M.intersection=function(t,e,n,i){var r=_.valueOf(i.y).selfSubtract(n.y).selfMultiply(_.valueOf(e.x).selfSubtract(t.x)),s=_.valueOf(i.x).selfSubtract(n.x).selfMultiply(_.valueOf(e.y).selfSubtract(t.y)),o=r.subtract(s),a=_.valueOf(i.x).selfSubtract(n.x).selfMultiply(_.valueOf(t.y).selfSubtract(n.y)),u=_.valueOf(i.y).selfSubtract(n.y).selfMultiply(_.valueOf(t.x).selfSubtract(n.x)),l=a.subtract(u),h=l.selfDivide(o).doubleValue(),c=_.valueOf(t.x).selfAdd(_.valueOf(e.x).selfSubtract(t.x).selfMultiply(h)).doubleValue(),f=_.valueOf(e.x).selfSubtract(t.x).selfMultiply(_.valueOf(t.y).selfSubtract(n.y)),d=_.valueOf(e.y).selfSubtract(t.y).selfMultiply(_.valueOf(t.x).selfSubtract(n.x)),p=f.subtract(d),v=p.selfDivide(o).doubleValue(),m=_.valueOf(n.y).selfAdd(_.valueOf(i.y).selfSubtract(n.y).selfMultiply(v)).doubleValue();return new g(c,m)},M.orientationIndexFilter=function(t,e,n){var i=null,r=(t.x-n.x)*(e.y-n.y),s=(t.y-n.y)*(e.x-n.x),o=r-s;if(r>0){if(0>=s)return M.signum(o);i=r+s}else{if(!(0>r))return M.signum(o);if(s>=0)return M.signum(o);i=-r-s}var a=M.DP_SAFE_EPSILON*i;return o>=a||-o>=a?M.signum(o):2},M.signum=function(t){return t>0?1:0>t?-1:0},M.DP_SAFE_EPSILON=1e-15,e(D.prototype,{setOrdinate:function(t,e,n){},size:function(){},getOrdinate:function(t,e){},getCoordinate:function(){if(1===arguments.length){arguments[0]}else if(2===arguments.length){arguments[0],arguments[1]}},getCoordinateCopy:function(t){},getDimension:function(){},getX:function(t){},clone:function(){},expandEnvelope:function(t){},copy:function(){},getY:function(t){},toCoordinateArray:function(){},interfaces_:function(){return[o]},getClass:function(){return D}}),D.X=0,D.Y=1,D.Z=2,D.M=3,A.arraycopy=function(t,e,n,i,r){for(var s=0,o=e;e+r>o;o++)n[i+s]=t[o],s++},A.getProperty=function(t){return{"line.separator":"\n"}[t]},e(F.prototype,{getY:function(){var t=this.y/this.w;if(r.isNaN(t)||r.isInfinite(t))throw new w;return t},getX:function(){var t=this.x/this.w;if(r.isNaN(t)||r.isInfinite(t))throw new w;return t},getCoordinate:function(){var t=new g;return t.x=this.getX(),t.y=this.getY(),t},interfaces_:function(){return[]},getClass:function(){return F}}),F.intersection=function(t,e,n,i){var s=t.y-e.y,o=e.x-t.x,a=t.x*e.y-e.x*t.y,u=n.y-i.y,l=i.x-n.x,h=n.x*i.y-i.x*n.y,c=o*h-l*a,f=u*a-s*h,d=s*l-u*o,p=c/d,v=f/d;if(r.isNaN(p)||r.isInfinite(p)||r.isNaN(v)||r.isInfinite(v))throw new w;return new g(p,v)},e(G.prototype,{create:function(){if(1===arguments.length){if(arguments[0]instanceof Array){arguments[0]}else if(R(arguments[0],D)){arguments[0]}}else if(2===arguments.length){arguments[0],arguments[1]}},interfaces_:function(){return[]},getClass:function(){return G}}),e(q.prototype,{filter:function(t){},interfaces_:function(){return[]},getClass:function(){return q}}),e(B.prototype,{isGeometryCollection:function(){return this.getSortIndex()===B.SORTINDEX_GEOMETRYCOLLECTION},getFactory:function(){return this.factory},getGeometryN:function(t){return this},getArea:function(){return 0},isRectangle:function(){return!1},equals:function(){if(1===arguments.length){if(arguments[0]instanceof B){var t=arguments[0];return null===t?!1:this.equalsTopo(t)}if(arguments[0]instanceof Object){var e=arguments[0];if(!(e instanceof B))return!1;var n=e;return this.equalsExact(n)}}},equalsExact:function(t){return this===t||this.equalsExact(t,0)},geometryChanged:function(){this.apply(B.geometryChangedFilter)},geometryChangedAction:function(){this.envelope=null},equalsNorm:function(t){return null===t?!1:this.norm().equalsExact(t.norm())},getLength:function(){return 0},getNumGeometries:function(){return 1},compareTo:function(){if(1===arguments.length){var t=arguments[0],e=t;return this.getSortIndex()!==e.getSortIndex()?this.getSortIndex()-e.getSortIndex():this.isEmpty()&&e.isEmpty()?0:this.isEmpty()?-1:e.isEmpty()?1:this.compareToSameClass(t)}if(2===arguments.length){var n=arguments[0],i=arguments[1],e=n;return this.getSortIndex()!==e.getSortIndex()?this.getSortIndex()-e.getSortIndex():this.isEmpty()&&e.isEmpty()?0:this.isEmpty()?-1:e.isEmpty()?1:this.compareToSameClass(n,i)}},getUserData:function(){return this.userData},getSRID:function(){return this.SRID},getEnvelope:function(){return this.getFactory().toGeometry(this.getEnvelopeInternal())},checkNotGeometryCollection:function(t){if(t.getSortIndex()===B.SORTINDEX_GEOMETRYCOLLECTION)throw new i("This method does not support GeometryCollection arguments")},equal:function(t,e,n){return 0===n?t.equals(e):t.distance(e)<=n},norm:function(){var t=this.copy();return t.normalize(),t},getPrecisionModel:function(){return this.factory.getPrecisionModel()},getEnvelopeInternal:function(){return null===this.envelope&&(this.envelope=this.computeEnvelopeInternal()),new C(this.envelope)},setSRID:function(t){this.SRID=t},setUserData:function(t){this.userData=t},compare:function(t,e){for(var n=t.iterator(),i=e.iterator();n.hasNext()&&i.hasNext();){var r=n.next(),s=i.next(),o=r.compareTo(s);if(0!==o)return o}return n.hasNext()?1:i.hasNext()?-1:0},hashCode:function(){return this.getEnvelopeInternal().hashCode()},isGeometryCollectionOrDerived:function(){return this.getSortIndex()===B.SORTINDEX_GEOMETRYCOLLECTION||this.getSortIndex()===B.SORTINDEX_MULTIPOINT||this.getSortIndex()===B.SORTINDEX_MULTILINESTRING||this.getSortIndex()===B.SORTINDEX_MULTIPOLYGON},interfaces_:function(){return[o,s,u]},getClass:function(){return B}}),B.hasNonEmptyElements=function(t){for(var e=0;e<t.length;e++)if(!t[e].isEmpty())return!0;return!1},B.hasNullElements=function(t){for(var e=0;e<t.length;e++)if(null===t[e])return!0;return!1},B.serialVersionUID=0x799ea46522854c00,B.SORTINDEX_POINT=0,B.SORTINDEX_MULTIPOINT=1,B.SORTINDEX_LINESTRING=2,B.SORTINDEX_LINEARRING=3,B.SORTINDEX_MULTILINESTRING=4,B.SORTINDEX_POLYGON=5,B.SORTINDEX_MULTIPOLYGON=6,B.SORTINDEX_GEOMETRYCOLLECTION=7,B.geometryChangedFilter={interfaces_:function(){return[q]},filter:function(t){t.geometryChangedAction()}},e(z.prototype,{filter:function(t){},interfaces_:function(){return[]},getClass:function(){return z}}),e(V.prototype,{isInBoundary:function(t){},interfaces_:function(){return[]},getClass:function(){return V}}),e(k.prototype,{isInBoundary:function(t){return t%2===1},interfaces_:function(){return[V]},getClass:function(){return k}}),e(Y.prototype,{isInBoundary:function(t){return t>0},interfaces_:function(){return[V]},getClass:function(){return Y}}),e(U.prototype,{isInBoundary:function(t){return t>1},interfaces_:function(){return[V]},getClass:function(){return U}}),e(X.prototype,{isInBoundary:function(t){return 1===t},interfaces_:function(){return[V]},getClass:function(){return X}}),V.Mod2BoundaryNodeRule=k,V.EndPointBoundaryNodeRule=Y,V.MultiValentEndPointBoundaryNodeRule=U,V.MonoValentEndPointBoundaryNodeRule=X,V.MOD2_BOUNDARY_RULE=new k,V.ENDPOINT_BOUNDARY_RULE=new Y,V.MULTIVALENT_ENDPOINT_BOUNDARY_RULE=new U,V.MONOVALENT_ENDPOINT_BOUNDARY_RULE=new X,V.OGC_SFS_BOUNDARY_RULE=V.MOD2_BOUNDARY_RULE,e(H.prototype,{interfaces_:function(){return[]},getClass:function(){return H}}),H.isRing=function(t){return t.length<4?!1:!!t[0].equals2D(t[t.length-1])},H.ptNotInList=function(t,e){for(var n=0;n<t.length;n++){var i=t[n];if(H.indexOf(i,e)<0)return i}return null},H.scroll=function(t,e){var n=H.indexOf(e,t);if(0>n)return null;var i=new Array(t.length).fill(null);A.arraycopy(t,n,i,0,t.length-n),A.arraycopy(t,0,i,t.length-n,n),A.arraycopy(i,0,t,0,t.length)},H.equals=function(){if(2===arguments.length){var t=arguments[0],e=arguments[1];if(t===e)return!0;if(null===t||null===e)return!1;if(t.length!==e.length)return!1;for(var n=0;n<t.length;n++)if(!t[n].equals(e[n]))return!1;return!0}if(3===arguments.length){var i=arguments[0],r=arguments[1],s=arguments[2];if(i===r)return!0;if(null===i||null===r)return!1;if(i.length!==r.length)return!1;for(var n=0;n<i.length;n++)if(0!==s.compare(i[n],r[n]))return!1;return!0}},H.intersection=function(t,e){for(var n=new N,i=0;i<t.length;i++)e.intersects(t[i])&&n.add(t[i],!0);return n.toCoordinateArray()},H.hasRepeatedPoints=function(t){for(var e=1;e<t.length;e++)if(t[e-1].equals(t[e]))return!0;return!1},H.removeRepeatedPoints=function(t){if(!H.hasRepeatedPoints(t))return t;var e=new N(t,!1);return e.toCoordinateArray()},H.reverse=function(t){for(var e=t.length-1,n=Math.trunc(e/2),i=0;n>=i;i++){var r=t[i];t[i]=t[e-i],t[e-i]=r}},H.removeNull=function(t){for(var e=0,n=0;n<t.length;n++)null!==t[n]&&e++;var i=new Array(e).fill(null);if(0===e)return i;for(var r=0,n=0;n<t.length;n++)null!==t[n]&&(i[r++]=t[n]);return i},H.copyDeep=function(){if(1===arguments.length){for(var t=arguments[0],e=new Array(t.length).fill(null),n=0;n<t.length;n++)e[n]=new g(t[n]);return e}if(5===arguments.length)for(var i=arguments[0],r=arguments[1],s=arguments[2],o=arguments[3],a=arguments[4],n=0;a>n;n++)s[o+n]=new g(i[r+n])},H.isEqualReversed=function(t,e){for(var n=0;n<t.length;n++){var i=t[n],r=e[t.length-n-1];if(0!==i.compareTo(r))return!1}return!0},H.envelope=function(t){for(var e=new C,n=0;n<t.length;n++)e.expandToInclude(t[n]);return e},H.toCoordinateArray=function(t){return t.toArray(H.coordArrayType)},H.atLeastNCoordinatesOrNothing=function(t,e){return e.length>=t?e:[]},H.indexOf=function(t,e){for(var n=0;n<e.length;n++)if(t.equals(e[n]))return n;return-1},H.increasingDirection=function(t){for(var e=0;e<Math.trunc(t.length/2);e++){var n=t.length-1-e,i=t[e].compareTo(t[n]);if(0!==i)return i}return 1},H.compare=function(t,e){for(var n=0;n<t.length&&n<e.length;){var i=t[n].compareTo(e[n]);if(0!==i)return i;n++}return n<e.length?-1:n<t.length?1:0},H.minCoordinate=function(t){for(var e=null,n=0;n<t.length;n++)(null===e||e.compareTo(t[n])>0)&&(e=t[n]);return e},H.extract=function(t,e,n){e=T.clamp(e,0,t.length),n=T.clamp(n,-1,t.length);var i=n-e+1;0>n&&(i=0),e>=t.length&&(i=0),e>n&&(i=0);var r=new Array(i).fill(null);if(0===i)return r;for(var s=0,o=e;n>=o;o++)r[s++]=t[o];return r},e(W.prototype,{compare:function(t,e){var n=t,i=e;return H.compare(n,i)},interfaces_:function(){return[a]},getClass:function(){return W}}),e(j.prototype,{compare:function(t,e){var n=t,i=e;if(n.length<i.length)return-1;if(n.length>i.length)return 1;if(0===n.length)return 0;var r=H.compare(n,i),s=H.isEqualReversed(n,i);return s?0:r},OLDcompare:function(t,e){var n=t,i=e;if(n.length<i.length)return-1;if(n.length>i.length)return 1;if(0===n.length)return 0;for(var r=H.increasingDirection(n),s=H.increasingDirection(i),o=r>0?0:n.length-1,a=s>0?0:n.length-1,u=0;u<n.length;u++){var l=n[o].compareTo(i[a]);if(0!==l)return l;o+=r,a+=s}return 0},interfaces_:function(){return[a]},getClass:function(){return j}}),H.ForwardComparator=W,H.BidirectionalComparator=j,H.coordArrayType=new Array(0).fill(null),K.prototype.get=function(){},K.prototype.put=function(){},K.prototype.size=function(){},K.prototype.values=function(){},K.prototype.entrySet=function(){},Z.prototype=new K,Q.prototype=new v,Q.prototype.contains=function(){},J.prototype=new Q,J.prototype.contains=function(t){for(var e=0,n=this.array_.length;n>e;e++){var i=this.array_[e];if(i===t)return!0}return!1},J.prototype.add=function(t){return this.contains(t)?!1:(this.array_.push(t),!0)},J.prototype.addAll=function(t){for(var e=t.iterator();e.hasNext();)this.add(e.next());return!0},J.prototype.remove=function(t){throw new javascript.util.OperationNotSupported},J.prototype.size=function(){return this.array_.length},J.prototype.isEmpty=function(){return 0===this.array_.length},J.prototype.toArray=function(){for(var t=[],e=0,n=this.array_.length;n>e;e++)t.push(this.array_[e]);return t},J.prototype.iterator=function(){return new Js(this)};var Js=function(t){this.hashSet_=t,this.position_=0};Js.prototype.next=function(){if(this.position_===this.hashSet_.size())throw new x;return this.hashSet_.array_[this.position_++]},Js.prototype.hasNext=function(){return this.position_<this.hashSet_.size()},Js.prototype.remove=function(){throw new E};var $s=0,to=1;rt.prototype=new Z,rt.prototype.get=function(t){for(var e=this.root_;null!==e;){var n=t.compareTo(e.key);if(0>n)e=e.left;else{if(!(n>0))return e.value;e=e.right}}return null},rt.prototype.put=function(t,e){if(null===this.root_)return this.root_={key:t,value:e,left:null,right:null,parent:null,color:$s,getValue:function(){return this.value},getKey:function(){return this.key}},this.size_=1,null;var n,i,r=this.root_;do if(n=r,i=t.compareTo(r.key),0>i)r=r.left;else{if(!(i>0)){var s=r.value;return r.value=e,s}r=r.right}while(null!==r);var o={key:t,left:null,right:null,value:e,parent:n,color:$s,getValue:function(){return this.value},getKey:function(){return this.key}};return 0>i?n.left=o:n.right=o,this.fixAfterInsertion(o),this.size_++,null},rt.prototype.fixAfterInsertion=function(t){for(t.color=to;null!=t&&t!=this.root_&&t.parent.color==to;)if(tt(t)==nt(tt(tt(t)))){var e=it(tt(tt(t)));$(e)==to?(et(tt(t),$s),et(e,$s),et(tt(tt(t)),to),t=tt(tt(t))):(t==it(tt(t))&&(t=tt(t),this.rotateLeft(t)),et(tt(t),$s),et(tt(tt(t)),to),this.rotateRight(tt(tt(t))))}else{var e=nt(tt(tt(t)));$(e)==to?(et(tt(t),$s),et(e,$s),et(tt(tt(t)),to),t=tt(tt(t))):(t==nt(tt(t))&&(t=tt(t),this.rotateRight(t)),et(tt(t),$s),et(tt(tt(t)),to),this.rotateLeft(tt(tt(t))))}this.root_.color=$s},rt.prototype.values=function(){var t=new I,e=this.getFirstEntry();if(null!==e)for(t.add(e.value);null!==(e=rt.successor(e));)t.add(e.value);return t},rt.prototype.entrySet=function(){var t=new J,e=this.getFirstEntry();if(null!==e)for(t.add(e);null!==(e=rt.successor(e));)t.add(e);return t},rt.prototype.rotateLeft=function(t){if(null!=t){var e=t.right;t.right=e.left,null!=e.left&&(e.left.parent=t),e.parent=t.parent,null==t.parent?this.root_=e:t.parent.left==t?t.parent.left=e:t.parent.right=e,e.left=t,t.parent=e}},rt.prototype.rotateRight=function(t){if(null!=t){var e=t.left;t.left=e.right,null!=e.right&&(e.right.parent=t),e.parent=t.parent,null==t.parent?this.root_=e:t.parent.right==t?t.parent.right=e:t.parent.left=e,e.right=t,t.parent=e}},rt.prototype.getFirstEntry=function(){var t=this.root_;if(null!=t)for(;null!=t.left;)t=t.left;return t},rt.successor=function(t){if(null===t)return null;if(null!==t.right){for(var e=t.right;null!==e.left;)e=e.left;return e}for(var e=t.parent,n=t;null!==e&&n===e.right;)n=e,e=e.parent;return e},rt.prototype.size=function(){return this.size_},e(st.prototype,{interfaces_:function(){return[]},getClass:function(){return st}}),ot.prototype=new Q,at.prototype=new ot,at.prototype.contains=function(t){for(var e=0,n=this.array_.length;n>e;e++){var i=this.array_[e];if(0===i.compareTo(t))return!0}return!1},at.prototype.add=function(t){if(this.contains(t))return!1;for(var e=0,n=this.array_.length;n>e;e++){var i=this.array_[e];if(1===i.compareTo(t))return this.array_.splice(e,0,t),!0}return this.array_.push(t),!0},at.prototype.addAll=function(t){for(var e=t.iterator();e.hasNext();)this.add(e.next());return!0},at.prototype.remove=function(t){throw new E},at.prototype.size=function(){return this.array_.length},at.prototype.isEmpty=function(){return 0===this.array_.length},at.prototype.toArray=function(){for(var t=[],e=0,n=this.array_.length;n>e;e++)t.push(this.array_[e]);return t},at.prototype.iterator=function(){return new eo(this)};var eo=function(t){this.treeSet_=t,this.position_=0};eo.prototype.next=function(){if(this.position_===this.treeSet_.size())throw new x;return this.treeSet_.array_[this.position_++]},eo.prototype.hasNext=function(){return this.position_<this.treeSet_.size()},eo.prototype.remove=function(){throw new E},ut.sort=function(){var t,e,n,i,r=arguments[0];if(1===arguments.length)return i=function(t,e){return t.compareTo(e)},void r.sort(i);if(2===arguments.length)n=arguments[1],i=function(t,e){return n.compare(t,e)},r.sort(i);else{if(3===arguments.length){e=r.slice(arguments[1],arguments[2]),e.sort();var s=r.slice(0,arguments[1]).concat(e,r.slice(arguments[2],r.length));for(r.splice(0,r.length),t=0;t<s.length;t++)r.push(s[t]);return}if(4===arguments.length){for(e=r.slice(arguments[1],arguments[2]),n=arguments[3],i=function(t,e){return n.compare(t,e)},e.sort(i),s=r.slice(0,arguments[1]).concat(e,r.slice(arguments[2],r.length)),r.splice(0,r.length),t=0;t<s.length;t++)r.push(s[t]);return}}},ut.asList=function(t){for(var e=new I,n=0,i=t.length;i>n;n++)e.add(t[n]);return e},e(lt.prototype,{interfaces_:function(){return[]},getClass:function(){return lt}}),lt.toDimensionSymbol=function(t){switch(t){case lt.FALSE:return lt.SYM_FALSE;case lt.TRUE:return lt.SYM_TRUE;case lt.DONTCARE:return lt.SYM_DONTCARE;case lt.P:return lt.SYM_P;case lt.L:return lt.SYM_L;case lt.A:return lt.SYM_A}throw new i("Unknown dimension value: "+t)},lt.toDimensionValue=function(t){switch(O.toUpperCase(t)){case lt.SYM_FALSE:return lt.FALSE;case lt.SYM_TRUE:return lt.TRUE;case lt.SYM_DONTCARE:return lt.DONTCARE;case lt.SYM_P:return lt.P;case lt.SYM_L:return lt.L;case lt.SYM_A:return lt.A}throw new i("Unknown dimension symbol: "+t)},lt.P=0,lt.L=1,lt.A=2,lt.FALSE=-1,lt.TRUE=-2,lt.DONTCARE=-3,lt.SYM_FALSE="F",lt.SYM_TRUE="T",lt.SYM_DONTCARE="*",lt.SYM_P="0",lt.SYM_L="1",lt.SYM_A="2",e(ht.prototype,{filter:function(t){},interfaces_:function(){return[]},getClass:function(){return ht}}),e(ct.prototype,{filter:function(t,e){},isDone:function(){},isGeometryChanged:function(){},interfaces_:function(){return[]},getClass:function(){return ct}}),h(ft,B),e(ft.prototype,{computeEnvelopeInternal:function(){for(var t=new C,e=0;e<this.geometries.length;e++)t.expandToInclude(this.geometries[e].getEnvelopeInternal());return t},getGeometryN:function(t){return this.geometries[t]},getSortIndex:function(){return B.SORTINDEX_GEOMETRYCOLLECTION},getCoordinates:function(){for(var t=new Array(this.getNumPoints()).fill(null),e=-1,n=0;n<this.geometries.length;n++)for(var i=this.geometries[n].getCoordinates(),r=0;r<i.length;r++)e++,t[e]=i[r];return t},getArea:function(){for(var t=0,e=0;e<this.geometries.length;e++)t+=this.geometries[e].getArea();return t},equalsExact:function(){if(2===arguments.length){var t=arguments[0],e=arguments[1];if(!this.isEquivalentClass(t))return!1;var n=t;if(this.geometries.length!==n.geometries.length)return!1;for(var i=0;i<this.geometries.length;i++)if(!this.geometries[i].equalsExact(n.geometries[i],e))return!1;return!0}return B.prototype.equalsExact.apply(this,arguments)},normalize:function(){for(var t=0;t<this.geometries.length;t++)this.geometries[t].normalize();ut.sort(this.geometries)},getCoordinate:function(){return this.isEmpty()?null:this.geometries[0].getCoordinate()},getBoundaryDimension:function(){for(var t=lt.FALSE,e=0;e<this.geometries.length;e++)t=Math.max(t,this.geometries[e].getBoundaryDimension());return t},getDimension:function(){for(var t=lt.FALSE,e=0;e<this.geometries.length;e++)t=Math.max(t,this.geometries[e].getDimension());return t},getLength:function(){for(var t=0,e=0;e<this.geometries.length;e++)t+=this.geometries[e].getLength();return t},getNumPoints:function(){for(var t=0,e=0;e<this.geometries.length;e++)t+=this.geometries[e].getNumPoints();return t},getNumGeometries:function(){return this.geometries.length},reverse:function(){for(var t=this.geometries.length,e=new Array(t).fill(null),n=0;n<this.geometries.length;n++)e[n]=this.geometries[n].reverse();return this.getFactory().createGeometryCollection(e)},compareToSameClass:function(){if(1===arguments.length){var t=arguments[0],e=new at(ut.asList(this.geometries)),n=new at(ut.asList(t.geometries));return this.compare(e,n)}if(2===arguments.length){for(var i=arguments[0],r=arguments[1],s=i,o=this.getNumGeometries(),a=s.getNumGeometries(),u=0;o>u&&a>u;){var l=this.getGeometryN(u),h=s.getGeometryN(u),c=l.compareToSameClass(h,r);if(0!==c)return c;u++}return o>u?1:a>u?-1:0}},apply:function(){if(R(arguments[0],z))for(var t=arguments[0],e=0;e<this.geometries.length;e++)this.geometries[e].apply(t);else if(R(arguments[0],ct)){var n=arguments[0];if(0===this.geometries.length)return null;for(var e=0;e<this.geometries.length&&(this.geometries[e].apply(n),!n.isDone());e++);n.isGeometryChanged()&&this.geometryChanged()}else if(R(arguments[0],ht)){var i=arguments[0];i.filter(this);for(var e=0;e<this.geometries.length;e++)this.geometries[e].apply(i)}else if(R(arguments[0],q)){var r=arguments[0];r.filter(this);for(var e=0;e<this.geometries.length;e++)this.geometries[e].apply(r)}},getBoundary:function(){return this.checkNotGeometryCollection(this),f.shouldNeverReachHere(),null},clone:function(){var t=B.prototype.clone.call(this);t.geometries=new Array(this.geometries.length).fill(null);for(var e=0;e<this.geometries.length;e++)t.geometries[e]=this.geometries[e].clone();return t},getGeometryType:function(){return"GeometryCollection"},copy:function(){for(var t=new Array(this.geometries.length).fill(null),e=0;e<t.length;e++)t[e]=this.geometries[e].copy();return new ft(t,this.factory)},isEmpty:function(){for(var t=0;t<this.geometries.length;t++)if(!this.geometries[t].isEmpty())return!1;return!0},interfaces_:function(){return[]},getClass:function(){return ft}}),ft.serialVersionUID=-0x4f07bcb1f857d800,h(gt,ft),e(gt.prototype,{getSortIndex:function(){return B.SORTINDEX_MULTILINESTRING},equalsExact:function(){if(2===arguments.length){var t=arguments[0],e=arguments[1];return this.isEquivalentClass(t)?ft.prototype.equalsExact.call(this,t,e):!1}return ft.prototype.equalsExact.apply(this,arguments)},getBoundaryDimension:function(){return this.isClosed()?lt.FALSE:0},isClosed:function(){if(this.isEmpty())return!1;for(var t=0;t<this.geometries.length;t++)if(!this.geometries[t].isClosed())return!1;return!0},getDimension:function(){return 1},reverse:function(){for(var t=this.geometries.length,e=new Array(t).fill(null),n=0;n<this.geometries.length;n++)e[t-1-n]=this.geometries[n].reverse();return this.getFactory().createMultiLineString(e)},getBoundary:function(){return new dt(this).getBoundary()},getGeometryType:function(){return"MultiLineString"},copy:function(){for(var t=new Array(this.geometries.length).fill(null),e=0;e<t.length;e++)t[e]=this.geometries[e].copy();return new gt(t,this.factory)},interfaces_:function(){
return[st]},getClass:function(){return gt}}),gt.serialVersionUID=0x7155d2ab4afa8000,e(dt.prototype,{boundaryMultiLineString:function(t){if(this.geom.isEmpty())return this.getEmptyMultiPoint();var e=this.computeBoundaryCoordinates(t);return 1===e.length?this.geomFact.createPoint(e[0]):this.geomFact.createMultiPointFromCoords(e)},getBoundary:function(){return this.geom instanceof St?this.boundaryLineString(this.geom):this.geom instanceof gt?this.boundaryMultiLineString(this.geom):this.geom.getBoundary()},boundaryLineString:function(t){if(this.geom.isEmpty())return this.getEmptyMultiPoint();if(t.isClosed()){var e=this.bnRule.isInBoundary(2);return e?t.getStartPoint():this.geomFact.createMultiPoint()}return this.geomFact.createMultiPoint([t.getStartPoint(),t.getEndPoint()])},getEmptyMultiPoint:function(){return this.geomFact.createMultiPoint()},computeBoundaryCoordinates:function(t){var e=new I;this.endpointMap=new rt;for(var n=0;n<t.getNumGeometries();n++){var i=t.getGeometryN(n);0!==i.getNumPoints()&&(this.addEndpoint(i.getCoordinateN(0)),this.addEndpoint(i.getCoordinateN(i.getNumPoints()-1)))}for(var r=this.endpointMap.entrySet().iterator();r.hasNext();){var s=r.next(),o=s.getValue(),a=o.count;this.bnRule.isInBoundary(a)&&e.add(s.getKey())}return H.toCoordinateArray(e)},addEndpoint:function(t){var e=this.endpointMap.get(t);null===e&&(e=new pt,this.endpointMap.put(t,e)),e.count++},interfaces_:function(){return[]},getClass:function(){return dt}}),dt.getBoundary=function(){if(1===arguments.length){var t=arguments[0],e=new dt(t);return e.getBoundary()}if(2===arguments.length){var n=arguments[0],i=arguments[1],e=new dt(n,i);return e.getBoundary()}},e(pt.prototype,{interfaces_:function(){return[]},getClass:function(){return pt}}),e(Nt.prototype,{interfaces_:function(){return[]},getClass:function(){return Nt}}),Nt.chars=function(t,e){for(var n=new Array(e).fill(null),i=0;e>i;i++)n[i]=t;return new String(n)},Nt.getStackTrace=function(){if(1===arguments.length){var t=arguments[0],e=new xt,n=new vt(e);return t.printStackTrace(n),e.toString()}if(2===arguments.length){for(var i=arguments[0],r=arguments[1],s="",o=new mt(Nt.getStackTrace(i)),a=new It(o),u=0;r>u;u++)try{s+=a.readLine()+Nt.NEWLINE}catch(t){if(!(t instanceof Et))throw t;f.shouldNeverReachHere()}finally{}return s}},Nt.split=function(t,e){for(var n=e.length,i=new I,r=""+t,s=r.indexOf(e);s>=0;){var o=r.substring(0,s);i.add(o),r=r.substring(s+n),s=r.indexOf(e)}r.length>0&&i.add(r);for(var a=new Array(i.size()).fill(null),u=0;u<a.length;u++)a[u]=i.get(u);return a},Nt.toString=function(){if(1===arguments.length){var t=arguments[0];return Nt.SIMPLE_ORDINATE_FORMAT.format(t)}},Nt.spaces=function(t){return Nt.chars(" ",t)},Nt.NEWLINE=A.getProperty("line.separator"),Nt.SIMPLE_ORDINATE_FORMAT=new yt("0.#"),e(Ct.prototype,{interfaces_:function(){return[]},getClass:function(){return Ct}}),Ct.copyCoord=function(t,e,n,i){for(var r=Math.min(t.getDimension(),n.getDimension()),s=0;r>s;s++)n.setOrdinate(i,s,t.getOrdinate(e,s))},Ct.isRing=function(t){var e=t.size();return 0===e?!0:3>=e?!1:t.getOrdinate(0,D.X)===t.getOrdinate(e-1,D.X)&&t.getOrdinate(0,D.Y)===t.getOrdinate(e-1,D.Y)},Ct.isEqual=function(t,e){var n=t.size(),i=e.size();if(n!==i)return!1;for(var s=Math.min(t.getDimension(),e.getDimension()),o=0;n>o;o++)for(var a=0;s>a;a++){var u=t.getOrdinate(o,a),l=e.getOrdinate(o,a);if(!(t.getOrdinate(o,a)===e.getOrdinate(o,a)||r.isNaN(u)&&r.isNaN(l)))return!1}return!0},Ct.extend=function(t,e,n){var i=t.create(n,e.getDimension()),r=e.size();if(Ct.copy(e,0,i,0,r),r>0)for(var s=r;n>s;s++)Ct.copy(e,r-1,i,s,1);return i},Ct.reverse=function(t){for(var e=t.size()-1,n=Math.trunc(e/2),i=0;n>=i;i++)Ct.swap(t,i,e-i)},Ct.swap=function(t,e,n){if(e===n)return null;for(var i=0;i<t.getDimension();i++){var r=t.getOrdinate(e,i);t.setOrdinate(e,i,t.getOrdinate(n,i)),t.setOrdinate(n,i,r)}},Ct.copy=function(t,e,n,i,r){for(var s=0;r>s;s++)Ct.copyCoord(t,e+s,n,i+s)},Ct.toString=function(){if(1===arguments.length){var t=arguments[0],e=t.size();if(0===e)return"()";var n=t.getDimension(),i=new P;i.append("(");for(var r=0;e>r;r++){r>0&&i.append(" ");for(var s=0;n>s;s++)s>0&&i.append(","),i.append(Nt.toString(t.getOrdinate(r,s)))}return i.append(")"),i.toString()}},Ct.ensureValidRing=function(t,e){var n=e.size();if(0===n)return e;if(3>=n)return Ct.createClosedRing(t,e,4);var i=e.getOrdinate(0,D.X)===e.getOrdinate(n-1,D.X)&&e.getOrdinate(0,D.Y)===e.getOrdinate(n-1,D.Y);return i?e:Ct.createClosedRing(t,e,n+1)},Ct.createClosedRing=function(t,e,n){var i=t.create(n,e.getDimension()),r=e.size();Ct.copy(e,0,i,0,r);for(var s=r;n>s;s++)Ct.copy(e,0,i,s,1);return i},h(St,B),e(St.prototype,{computeEnvelopeInternal:function(){return this.isEmpty()?new C:this.points.expandEnvelope(new C)},isRing:function(){return this.isClosed()&&this.isSimple()},getSortIndex:function(){return B.SORTINDEX_LINESTRING},getCoordinates:function(){return this.points.toCoordinateArray()},equalsExact:function(){if(2===arguments.length){var t=arguments[0],e=arguments[1];if(!this.isEquivalentClass(t))return!1;var n=t;if(this.points.size()!==n.points.size())return!1;for(var i=0;i<this.points.size();i++)if(!this.equal(this.points.getCoordinate(i),n.points.getCoordinate(i),e))return!1;return!0}return B.prototype.equalsExact.apply(this,arguments)},normalize:function(){for(var t=0;t<Math.trunc(this.points.size()/2);t++){var e=this.points.size()-1-t;if(!this.points.getCoordinate(t).equals(this.points.getCoordinate(e)))return this.points.getCoordinate(t).compareTo(this.points.getCoordinate(e))>0&&Ct.reverse(this.points),null}},getCoordinate:function(){return this.isEmpty()?null:this.points.getCoordinate(0)},getBoundaryDimension:function(){return this.isClosed()?lt.FALSE:0},isClosed:function(){return this.isEmpty()?!1:this.getCoordinateN(0).equals2D(this.getCoordinateN(this.getNumPoints()-1))},getEndPoint:function(){return this.isEmpty()?null:this.getPointN(this.getNumPoints()-1)},getDimension:function(){return 1},getLength:function(){return he.computeLength(this.points)},getNumPoints:function(){return this.points.size()},reverse:function(){var t=this.points.copy();Ct.reverse(t);var e=this.getFactory().createLineString(t);return e},compareToSameClass:function(){if(1===arguments.length){for(var t=arguments[0],e=t,n=0,i=0;n<this.points.size()&&i<e.points.size();){var r=this.points.getCoordinate(n).compareTo(e.points.getCoordinate(i));if(0!==r)return r;n++,i++}return n<this.points.size()?1:i<e.points.size()?-1:0}if(2===arguments.length){var s=arguments[0],o=arguments[1],e=s;return o.compare(this.points,e.points)}},apply:function(){if(R(arguments[0],z))for(var t=arguments[0],e=0;e<this.points.size();e++)t.filter(this.points.getCoordinate(e));else if(R(arguments[0],ct)){var n=arguments[0];if(0===this.points.size())return null;for(var e=0;e<this.points.size()&&(n.filter(this.points,e),!n.isDone());e++);n.isGeometryChanged()&&this.geometryChanged()}else if(R(arguments[0],ht)){var i=arguments[0];i.filter(this)}else if(R(arguments[0],q)){var r=arguments[0];r.filter(this)}},getBoundary:function(){return new dt(this).getBoundary()},isEquivalentClass:function(t){return t instanceof St},clone:function(){var t=B.prototype.clone.call(this);return t.points=this.points.clone(),t},getCoordinateN:function(t){return this.points.getCoordinate(t)},getGeometryType:function(){return"LineString"},copy:function(){return new St(this.points.copy(),this.factory)},getCoordinateSequence:function(){return this.points},isEmpty:function(){return 0===this.points.size()},init:function(t){if(null===t&&(t=this.getFactory().getCoordinateSequenceFactory().create([])),1===t.size())throw new i("Invalid number of points in LineString (found "+t.size()+" - must be 0 or >= 2)");this.points=t},isCoordinate:function(t){for(var e=0;e<this.points.size();e++)if(this.points.getCoordinate(e).equals(t))return!0;return!1},getStartPoint:function(){return this.isEmpty()?null:this.getPointN(0)},getPointN:function(t){return this.getFactory().createPoint(this.points.getCoordinate(t))},interfaces_:function(){return[st]},getClass:function(){return St}}),St.serialVersionUID=0x2b2b51ba435c8e00,e(wt.prototype,{interfaces_:function(){return[]},getClass:function(){return wt}}),h(Lt,B),e(Lt.prototype,{computeEnvelopeInternal:function(){if(this.isEmpty())return new C;var t=new C;return t.expandToInclude(this.coordinates.getX(0),this.coordinates.getY(0)),t},getSortIndex:function(){return B.SORTINDEX_POINT},getCoordinates:function(){return this.isEmpty()?[]:[this.getCoordinate()]},equalsExact:function(){if(2===arguments.length){var t=arguments[0],e=arguments[1];return this.isEquivalentClass(t)?this.isEmpty()&&t.isEmpty()?!0:this.isEmpty()!==t.isEmpty()?!1:this.equal(t.getCoordinate(),this.getCoordinate(),e):!1}return B.prototype.equalsExact.apply(this,arguments)},normalize:function(){},getCoordinate:function(){return 0!==this.coordinates.size()?this.coordinates.getCoordinate(0):null},getBoundaryDimension:function(){return lt.FALSE},getDimension:function(){return 0},getNumPoints:function(){return this.isEmpty()?0:1},reverse:function(){return this.copy()},getX:function(){if(null===this.getCoordinate())throw new IllegalStateException("getX called on empty Point");return this.getCoordinate().x},compareToSameClass:function(){if(1===arguments.length){var t=arguments[0],e=t;return this.getCoordinate().compareTo(e.getCoordinate())}if(2===arguments.length){var n=arguments[0],i=arguments[1],e=n;return i.compare(this.coordinates,e.coordinates)}},apply:function(){if(R(arguments[0],z)){var t=arguments[0];if(this.isEmpty())return null;t.filter(this.getCoordinate())}else if(R(arguments[0],ct)){var e=arguments[0];if(this.isEmpty())return null;e.filter(this.coordinates,0),e.isGeometryChanged()&&this.geometryChanged()}else if(R(arguments[0],ht)){var n=arguments[0];n.filter(this)}else if(R(arguments[0],q)){var i=arguments[0];i.filter(this)}},getBoundary:function(){return this.getFactory().createGeometryCollection(null)},clone:function(){var t=B.prototype.clone.call(this);return t.coordinates=this.coordinates.clone(),t},getGeometryType:function(){return"Point"},copy:function(){return new Lt(this.coordinates.copy(),this.factory)},getCoordinateSequence:function(){return this.coordinates},getY:function(){if(null===this.getCoordinate())throw new IllegalStateException("getY called on empty Point");return this.getCoordinate().y},isEmpty:function(){return 0===this.coordinates.size()},init:function(t){null===t&&(t=this.getFactory().getCoordinateSequenceFactory().create([])),f.isTrue(t.size()<=1),this.coordinates=t},isSimple:function(){return!0},interfaces_:function(){return[wt]},getClass:function(){return Lt}}),Lt.serialVersionUID=0x44077bad161cbc00,e(Rt.prototype,{interfaces_:function(){return[]},getClass:function(){return Rt}}),h(Tt,B),e(Tt.prototype,{computeEnvelopeInternal:function(){return this.shell.getEnvelopeInternal()},getSortIndex:function(){return B.SORTINDEX_POLYGON},getCoordinates:function(){if(this.isEmpty())return[];for(var t=new Array(this.getNumPoints()).fill(null),e=-1,n=this.shell.getCoordinates(),i=0;i<n.length;i++)e++,t[e]=n[i];for(var r=0;r<this.holes.length;r++)for(var s=this.holes[r].getCoordinates(),o=0;o<s.length;o++)e++,t[e]=s[o];return t},getArea:function(){var t=0;t+=Math.abs(he.signedArea(this.shell.getCoordinateSequence()));for(var e=0;e<this.holes.length;e++)t-=Math.abs(he.signedArea(this.holes[e].getCoordinateSequence()));return t},isRectangle:function(){if(0!==this.getNumInteriorRing())return!1;if(null===this.shell)return!1;if(5!==this.shell.getNumPoints())return!1;for(var t=this.shell.getCoordinateSequence(),e=this.getEnvelopeInternal(),n=0;5>n;n++){var i=t.getX(n);if(i!==e.getMinX()&&i!==e.getMaxX())return!1;var r=t.getY(n);if(r!==e.getMinY()&&r!==e.getMaxY())return!1}for(var s=t.getX(0),o=t.getY(0),n=1;4>=n;n++){var i=t.getX(n),r=t.getY(n),a=i!==s,u=r!==o;if(a===u)return!1;s=i,o=r}return!0},equalsExact:function(){if(2===arguments.length){var t=arguments[0],e=arguments[1];if(!this.isEquivalentClass(t))return!1;var n=t,i=this.shell,r=n.shell;if(!i.equalsExact(r,e))return!1;if(this.holes.length!==n.holes.length)return!1;for(var s=0;s<this.holes.length;s++)if(!this.holes[s].equalsExact(n.holes[s],e))return!1;return!0}return B.prototype.equalsExact.apply(this,arguments)},normalize:function(){if(0===arguments.length){this.normalize(this.shell,!0);for(var t=0;t<this.holes.length;t++)this.normalize(this.holes[t],!1);ut.sort(this.holes)}else if(2===arguments.length){var e=arguments[0],n=arguments[1];if(e.isEmpty())return null;var i=new Array(e.getCoordinates().length-1).fill(null);A.arraycopy(e.getCoordinates(),0,i,0,i.length);var r=H.minCoordinate(e.getCoordinates());H.scroll(i,r),A.arraycopy(i,0,e.getCoordinates(),0,i.length),e.getCoordinates()[i.length]=i[0],he.isCCW(e.getCoordinates())===n&&H.reverse(e.getCoordinates())}},getCoordinate:function(){return this.shell.getCoordinate()},getNumInteriorRing:function(){return this.holes.length},getBoundaryDimension:function(){return 1},getDimension:function(){return 2},getLength:function(){var t=0;t+=this.shell.getLength();for(var e=0;e<this.holes.length;e++)t+=this.holes[e].getLength();return t},getNumPoints:function(){for(var t=this.shell.getNumPoints(),e=0;e<this.holes.length;e++)t+=this.holes[e].getNumPoints();return t},reverse:function(){var t=this.copy();t.shell=this.shell.copy().reverse(),t.holes=new Array(this.holes.length).fill(null);for(var e=0;e<this.holes.length;e++)t.holes[e]=this.holes[e].copy().reverse();return t},convexHull:function(){return this.getExteriorRing().convexHull()},compareToSameClass:function(){if(1===arguments.length){var t=arguments[0],e=this.shell,n=t.shell;return e.compareToSameClass(n)}if(2===arguments.length){var i=arguments[0],r=arguments[1],s=i,e=this.shell,n=s.shell,o=e.compareToSameClass(n,r);if(0!==o)return o;for(var a=this.getNumInteriorRing(),u=s.getNumInteriorRing(),l=0;a>l&&u>l;){var h=this.getInteriorRingN(l),c=s.getInteriorRingN(l),f=h.compareToSameClass(c,r);if(0!==f)return f;l++}return a>l?1:u>l?-1:0}},apply:function(){if(R(arguments[0],z)){var t=arguments[0];this.shell.apply(t);for(var e=0;e<this.holes.length;e++)this.holes[e].apply(t)}else if(R(arguments[0],ct)){var n=arguments[0];if(this.shell.apply(n),!n.isDone())for(var e=0;e<this.holes.length&&(this.holes[e].apply(n),!n.isDone());e++);n.isGeometryChanged()&&this.geometryChanged()}else if(R(arguments[0],ht)){var i=arguments[0];i.filter(this)}else if(R(arguments[0],q)){var r=arguments[0];r.filter(this),this.shell.apply(r);for(var e=0;e<this.holes.length;e++)this.holes[e].apply(r)}},getBoundary:function(){if(this.isEmpty())return this.getFactory().createMultiLineString();var t=new Array(this.holes.length+1).fill(null);t[0]=this.shell;for(var e=0;e<this.holes.length;e++)t[e+1]=this.holes[e];return t.length<=1?this.getFactory().createLinearRing(t[0].getCoordinateSequence()):this.getFactory().createMultiLineString(t)},clone:function(){var t=B.prototype.clone.call(this);t.shell=this.shell.clone(),t.holes=new Array(this.holes.length).fill(null);for(var e=0;e<this.holes.length;e++)t.holes[e]=this.holes[e].clone();return t},getGeometryType:function(){return"Polygon"},copy:function(){for(var t=this.shell.copy(),e=new Array(this.holes.length).fill(null),n=0;n<e.length;n++)e[n]=this.holes[n].copy();return new Tt(t,e,this.factory)},getExteriorRing:function(){return this.shell},isEmpty:function(){return this.shell.isEmpty()},getInteriorRingN:function(t){return this.holes[t]},interfaces_:function(){return[Rt]},getClass:function(){return Tt}}),Tt.serialVersionUID=-0x307ffefd8dc97200,h(Pt,ft),e(Pt.prototype,{getSortIndex:function(){return B.SORTINDEX_MULTIPOINT},isValid:function(){return!0},equalsExact:function(){if(2===arguments.length){var t=arguments[0],e=arguments[1];return this.isEquivalentClass(t)?ft.prototype.equalsExact.call(this,t,e):!1}return ft.prototype.equalsExact.apply(this,arguments)},getCoordinate:function(){if(1===arguments.length){var t=arguments[0];return this.geometries[t].getCoordinate()}return ft.prototype.getCoordinate.apply(this,arguments)},getBoundaryDimension:function(){return lt.FALSE},getDimension:function(){return 0},getBoundary:function(){return this.getFactory().createGeometryCollection(null)},getGeometryType:function(){return"MultiPoint"},copy:function(){for(var t=new Array(this.geometries.length).fill(null),e=0;e<t.length;e++)t[e]=this.geometries[e].copy();return new Pt(t,this.factory)},interfaces_:function(){return[wt]},getClass:function(){return Pt}}),Pt.serialVersionUID=-0x6fb1ed4162e0fc00,h(bt,St),e(bt.prototype,{getSortIndex:function(){return B.SORTINDEX_LINEARRING},getBoundaryDimension:function(){return lt.FALSE},isClosed:function(){return this.isEmpty()?!0:St.prototype.isClosed.call(this)},reverse:function(){var t=this.points.copy();Ct.reverse(t);var e=this.getFactory().createLinearRing(t);return e},validateConstruction:function(){if(!this.isEmpty()&&!St.prototype.isClosed.call(this))throw new i("Points of LinearRing do not form a closed linestring");if(this.getCoordinateSequence().size()>=1&&this.getCoordinateSequence().size()<bt.MINIMUM_VALID_SIZE)throw new i("Invalid number of points in LinearRing (found "+this.getCoordinateSequence().size()+" - must be 0 or >= 4)")},getGeometryType:function(){return"LinearRing"},copy:function(){return new bt(this.points.copy(),this.factory)},interfaces_:function(){return[]},getClass:function(){return bt}}),bt.MINIMUM_VALID_SIZE=4,bt.serialVersionUID=-0x3b229e262367a600,h(Ot,ft),e(Ot.prototype,{getSortIndex:function(){return B.SORTINDEX_MULTIPOLYGON},equalsExact:function(){if(2===arguments.length){var t=arguments[0],e=arguments[1];return this.isEquivalentClass(t)?ft.prototype.equalsExact.call(this,t,e):!1}return ft.prototype.equalsExact.apply(this,arguments)},getBoundaryDimension:function(){return 1},getDimension:function(){return 2},reverse:function(){for(var t=this.geometries.length,e=new Array(t).fill(null),n=0;n<this.geometries.length;n++)e[n]=this.geometries[n].reverse();return this.getFactory().createMultiPolygon(e)},getBoundary:function(){if(this.isEmpty())return this.getFactory().createMultiLineString();for(var t=new I,e=0;e<this.geometries.length;e++)for(var n=this.geometries[e],i=n.getBoundary(),r=0;r<i.getNumGeometries();r++)t.add(i.getGeometryN(r));var s=new Array(t.size()).fill(null);return this.getFactory().createMultiLineString(t.toArray(s))},getGeometryType:function(){return"MultiPolygon"},copy:function(){for(var t=new Array(this.geometries.length).fill(null),e=0;e<t.length;e++)t[e]=this.geometries[e].copy();return new Ot(t,this.factory)},interfaces_:function(){return[Rt]},getClass:function(){return Ot}}),Ot.serialVersionUID=-0x7a5aa1369171980,e(_t.prototype,{setCopyUserData:function(t){this.isUserDataCopied=t},edit:function(t,e){if(null===t)return null;var n=this.editInternal(t,e);return this.isUserDataCopied&&n.setUserData(t.getUserData()),n},editInternal:function(t,e){return null===this.factory&&(this.factory=t.getFactory()),t instanceof ft?this.editGeometryCollection(t,e):t instanceof Tt?this.editPolygon(t,e):t instanceof Lt?e.edit(t,this.factory):t instanceof St?e.edit(t,this.factory):(f.shouldNeverReachHere("Unsupported Geometry class: "+t.getClass().getName()),null)},editGeometryCollection:function(t,e){for(var n=e.edit(t,this.factory),i=new I,r=0;r<n.getNumGeometries();r++){var s=this.edit(n.getGeometryN(r),e);null===s||s.isEmpty()||i.add(s)}return n.getClass()===Pt?this.factory.createMultiPoint(i.toArray([])):n.getClass()===gt?this.factory.createMultiLineString(i.toArray([])):n.getClass()===Ot?this.factory.createMultiPolygon(i.toArray([])):this.factory.createGeometryCollection(i.toArray([]))},editPolygon:function(t,e){var n=e.edit(t,this.factory);if(null===n&&(n=this.factory.createPolygon(null)),n.isEmpty())return n;var i=this.edit(n.getExteriorRing(),e);if(null===i||i.isEmpty())return this.factory.createPolygon();for(var r=new I,s=0;s<n.getNumInteriorRing();s++){var o=this.edit(n.getInteriorRingN(s),e);null===o||o.isEmpty()||r.add(o)}return this.factory.createPolygon(i,r.toArray([]))},interfaces_:function(){return[]},getClass:function(){return _t}}),_t.GeometryEditorOperation=Mt,e(Dt.prototype,{edit:function(t,e){return t},interfaces_:function(){return[Mt]},getClass:function(){return Dt}}),e(At.prototype,{edit:function(t,e){if(t instanceof bt)return e.createLinearRing(this.editCoordinates(t.getCoordinates(),t));if(t instanceof St)return e.createLineString(this.editCoordinates(t.getCoordinates(),t));if(t instanceof Lt){var n=this.editCoordinates(t.getCoordinates(),t);return n.length>0?e.createPoint(n[0]):e.createPoint()}return t},interfaces_:function(){return[Mt]},getClass:function(){return At}}),e(Ft.prototype,{edit:function(t,e){return t instanceof bt?e.createLinearRing(this.edit(t.getCoordinateSequence(),t)):t instanceof St?e.createLineString(this.edit(t.getCoordinateSequence(),t)):t instanceof Lt?e.createPoint(this.edit(t.getCoordinateSequence(),t)):t},interfaces_:function(){return[Mt]},getClass:function(){return Ft}}),_t.NoOpGeometryOperation=Dt,_t.CoordinateOperation=At,_t.CoordinateSequenceOperation=Ft,e(Gt.prototype,{setOrdinate:function(t,e,n){switch(e){case D.X:this.coordinates[t].x=n;break;case D.Y:this.coordinates[t].y=n;break;case D.Z:this.coordinates[t].z=n;break;default:throw new i("invalid ordinateIndex")}},size:function(){return this.coordinates.length},getOrdinate:function(t,e){switch(e){case D.X:return this.coordinates[t].x;case D.Y:return this.coordinates[t].y;case D.Z:return this.coordinates[t].z}return r.NaN},getCoordinate:function(){if(1===arguments.length){var t=arguments[0];return this.coordinates[t]}if(2===arguments.length){var e=arguments[0],n=arguments[1];n.x=this.coordinates[e].x,n.y=this.coordinates[e].y,n.z=this.coordinates[e].z}},getCoordinateCopy:function(t){return new g(this.coordinates[t])},getDimension:function(){return this.dimension},getX:function(t){return this.coordinates[t].x},clone:function(){for(var t=new Array(this.size()).fill(null),e=0;e<this.coordinates.length;e++)t[e]=this.coordinates[e].clone();return new Gt(t,this.dimension)},expandEnvelope:function(t){for(var e=0;e<this.coordinates.length;e++)t.expandToInclude(this.coordinates[e]);return t},copy:function(){for(var t=new Array(this.size()).fill(null),e=0;e<this.coordinates.length;e++)t[e]=this.coordinates[e].copy();return new Gt(t,this.dimension)},toString:function(){if(this.coordinates.length>0){var t=new P(17*this.coordinates.length);t.append("("),t.append(this.coordinates[0]);for(var e=1;e<this.coordinates.length;e++)t.append(", "),t.append(this.coordinates[e]);return t.append(")"),t.toString()}return"()"},getY:function(t){return this.coordinates[t].y},toCoordinateArray:function(){return this.coordinates},interfaces_:function(){return[D,u]},getClass:function(){return Gt}}),Gt.serialVersionUID=-0xcb44a778db18e00,e(qt.prototype,{readResolve:function(){return qt.instance()},create:function(){if(1===arguments.length){if(arguments[0]instanceof Array){var t=arguments[0];return new Gt(t)}if(R(arguments[0],D)){var e=arguments[0];return new Gt(e)}}else if(2===arguments.length){var n=arguments[0],i=arguments[1];return i>3&&(i=3),2>i?new Gt(n):new Gt(n,i)}},interfaces_:function(){return[G,u]},getClass:function(){return qt}}),qt.instance=function(){return qt.instanceObject},qt.serialVersionUID=-0x38e49fa6cf6f2e00,qt.instanceObject=new qt;var no,io=Object.defineProperty,ro=zt({delete:kt,has:Xt,get:Yt,set:Ht,keys:jt,values:Kt,entries:Zt,forEach:$t,clear:Wt}),so="undefined"!=typeof Map&&Map.prototype.values?Map:ro;te.prototype=new K,te.prototype.get=function(t){return this.map_.get(t)||null},te.prototype.put=function(t,e){return this.map_.set(t,e),e},te.prototype.values=function(){for(var t=new I,e=this.map_.values(),n=e.next();!n.done;)t.add(n.value),n=e.next();return t},te.prototype.entrySet=function(){var t=new J;return this.map_.entries().forEach(function(e){return t.add(e)}),t},te.prototype.size=function(){return this.map_.size()},e(ee.prototype,{equals:function(t){if(!(t instanceof ee))return!1;var e=t;return this.modelType===e.modelType&&this.scale===e.scale},compareTo:function(t){var e=t,n=this.getMaximumSignificantDigits(),i=e.getMaximumSignificantDigits();return new b(n).compareTo(new b(i))},getScale:function(){return this.scale},isFloating:function(){return this.modelType===ee.FLOATING||this.modelType===ee.FLOATING_SINGLE},getType:function(){return this.modelType},toString:function(){var t="UNKNOWN";return this.modelType===ee.FLOATING?t="Floating":this.modelType===ee.FLOATING_SINGLE?t="Floating-Single":this.modelType===ee.FIXED&&(t="Fixed (Scale="+this.getScale()+")"),t},makePrecise:function(){if("number"==typeof arguments[0]){var t=arguments[0];if(r.isNaN(t))return t;if(this.modelType===ee.FLOATING_SINGLE){var e=t;return e}return this.modelType===ee.FIXED?Math.round(t*this.scale)/this.scale:t}if(arguments[0]instanceof g){var n=arguments[0];if(this.modelType===ee.FLOATING)return null;n.x=this.makePrecise(n.x),n.y=this.makePrecise(n.y)}},getMaximumSignificantDigits:function(){var t=16;return this.modelType===ee.FLOATING?t=16:this.modelType===ee.FLOATING_SINGLE?t=6:this.modelType===ee.FIXED&&(t=1+Math.trunc(Math.ceil(Math.log(this.getScale())/Math.log(10)))),t},setScale:function(t){this.scale=Math.abs(t)},interfaces_:function(){return[u,s]},getClass:function(){return ee}}),ee.mostPrecise=function(t,e){return t.compareTo(e)>=0?t:e},e(ne.prototype,{readResolve:function(){return ne.nameToTypeMap.get(this.name)},toString:function(){return this.name},interfaces_:function(){return[u]},getClass:function(){return ne}}),ne.serialVersionUID=-552860263173159e4,ne.nameToTypeMap=new te,ee.Type=ne,ee.serialVersionUID=0x6bee6404e9a25c00,ee.FIXED=new ne("FIXED"),ee.FLOATING=new ne("FLOATING"),ee.FLOATING_SINGLE=new ne("FLOATING SINGLE"),ee.maximumPreciseValue=9007199254740992,e(ie.prototype,{toGeometry:function(t){return t.isNull()?this.createPoint(null):t.getMinX()===t.getMaxX()&&t.getMinY()===t.getMaxY()?this.createPoint(new g(t.getMinX(),t.getMinY())):t.getMinX()===t.getMaxX()||t.getMinY()===t.getMaxY()?this.createLineString([new g(t.getMinX(),t.getMinY()),new g(t.getMaxX(),t.getMaxY())]):this.createPolygon(this.createLinearRing([new g(t.getMinX(),t.getMinY()),new g(t.getMinX(),t.getMaxY()),new g(t.getMaxX(),t.getMaxY()),new g(t.getMaxX(),t.getMinY()),new g(t.getMinX(),t.getMinY())]),null)},createLineString:function(){if(0===arguments.length)return this.createLineString(this.getCoordinateSequenceFactory().create([]));if(1===arguments.length){if(arguments[0]instanceof Array){var t=arguments[0];return this.createLineString(null!==t?this.getCoordinateSequenceFactory().create(t):null)}if(R(arguments[0],D)){var e=arguments[0];return new St(e,this)}}},createMultiLineString:function(){if(0===arguments.length)return new gt(null,this);if(1===arguments.length){var t=arguments[0];return new gt(t,this)}},buildGeometry:function(t){for(var e=null,n=!1,i=!1,r=t.iterator();r.hasNext();){var s=r.next(),o=s.getClass();null===e&&(e=o),o!==e&&(n=!0),s.isGeometryCollectionOrDerived()&&(i=!0)}if(null===e)return this.createGeometryCollection();if(n||i)return this.createGeometryCollection(ie.toGeometryArray(t));var a=t.iterator().next(),u=t.size()>1;if(u){if(a instanceof Tt)return this.createMultiPolygon(ie.toPolygonArray(t));if(a instanceof St)return this.createMultiLineString(ie.toLineStringArray(t));if(a instanceof Lt)return this.createMultiPoint(ie.toPointArray(t));f.shouldNeverReachHere("Unhandled class: "+a.getClass().getName())}return a},createMultiPointFromCoords:function(t){return this.createMultiPoint(null!==t?this.getCoordinateSequenceFactory().create(t):null)},createPoint:function(){if(0===arguments.length)return this.createPoint(this.getCoordinateSequenceFactory().create([]));if(1===arguments.length){if(arguments[0]instanceof g){var t=arguments[0];return this.createPoint(null!==t?this.getCoordinateSequenceFactory().create([t]):null)}if(R(arguments[0],D)){var e=arguments[0];return new Lt(e,this)}}},getCoordinateSequenceFactory:function(){return this.coordinateSequenceFactory},createPolygon:function(){if(0===arguments.length)return new Tt(null,null,this);if(1===arguments.length){if(R(arguments[0],D)){var t=arguments[0];return this.createPolygon(this.createLinearRing(t))}if(arguments[0]instanceof Array){var e=arguments[0];return this.createPolygon(this.createLinearRing(e))}if(arguments[0]instanceof bt){var n=arguments[0];return this.createPolygon(n,null)}}else if(2===arguments.length){var i=arguments[0],r=arguments[1];return new Tt(i,r,this)}},getSRID:function(){return this.SRID},createGeometryCollection:function(){if(0===arguments.length)return new ft(null,this);if(1===arguments.length){var t=arguments[0];return new ft(t,this)}},createGeometry:function(t){var e=new _t(this);return e.edit(t,{edit:function(){if(2===arguments.length){var t=arguments[0];arguments[1];return this.coordinateSequenceFactory.create(t)}}})},getPrecisionModel:function(){return this.precisionModel},createLinearRing:function(){if(0===arguments.length)return this.createLinearRing(this.getCoordinateSequenceFactory().create([]));if(1===arguments.length){if(arguments[0]instanceof Array){var t=arguments[0];return this.createLinearRing(null!==t?this.getCoordinateSequenceFactory().create(t):null)}if(R(arguments[0],D)){var e=arguments[0];return new bt(e,this)}}},createMultiPolygon:function(){if(0===arguments.length)return new Ot(null,this);if(1===arguments.length){var t=arguments[0];return new Ot(t,this)}},createMultiPoint:function(){if(0===arguments.length)return new Pt(null,this);if(1===arguments.length){if(arguments[0]instanceof Array){var t=arguments[0];return new Pt(t,this)}if(arguments[0]instanceof Array){var e=arguments[0];return this.createMultiPoint(null!==e?this.getCoordinateSequenceFactory().create(e):null)}if(R(arguments[0],D)){var n=arguments[0];if(null===n)return this.createMultiPoint(new Array(0).fill(null));for(var i=new Array(n.size()).fill(null),r=0;r<n.size();r++){var s=this.getCoordinateSequenceFactory().create(1,n.getDimension());Ct.copy(n,r,s,0,1),i[r]=this.createPoint(s)}return this.createMultiPoint(i)}}},interfaces_:function(){return[u]},getClass:function(){return ie}}),ie.toMultiPolygonArray=function(t){var e=new Array(t.size()).fill(null);return t.toArray(e)},ie.toGeometryArray=function(t){if(null===t)return null;var e=new Array(t.size()).fill(null);return t.toArray(e)},ie.getDefaultCoordinateSequenceFactory=function(){return qt.instance()},ie.toMultiLineStringArray=function(t){var e=new Array(t.size()).fill(null);return t.toArray(e)},ie.toLineStringArray=function(t){var e=new Array(t.size()).fill(null);return t.toArray(e)},ie.toMultiPointArray=function(t){var e=new Array(t.size()).fill(null);return t.toArray(e)},ie.toLinearRingArray=function(t){var e=new Array(t.size()).fill(null);return t.toArray(e)},ie.toPointArray=function(t){var e=new Array(t.size()).fill(null);return t.toArray(e)},ie.toPolygonArray=function(t){var e=new Array(t.size()).fill(null);return t.toArray(e)},ie.createPointFromInternalCoord=function(t,e){return e.getPrecisionModel().makePrecise(t),e.getFactory().createPoint(t)},ie.serialVersionUID=-0x5ea75f2051eeb400;var oo={typeStr:/^\s*(\w+)\s*\(\s*(.*)\s*\)\s*$/,emptyTypeStr:/^\s*(\w+)\s*EMPTY\s*$/,spaces:/\s+/,parenComma:/\)\s*,\s*\(/,doubleParenComma:/\)\s*\)\s*,\s*\(\s*\(/,trimParens:/^\s*\(?(.*?)\)?\s*$/};e(re.prototype,{read:function(t){var e,n,i;t=t.replace(/[\n\r]/g," ");var r=oo.typeStr.exec(t);if(-1!==t.search("EMPTY")&&(r=oo.emptyTypeStr.exec(t),r[2]=void 0),r&&(n=r[1].toLowerCase(),i=r[2],uo[n]&&(e=uo[n].apply(this,[i]))),void 0===e)throw new Error("Could not parse WKT "+t);return e},write:function(t){return this.extractGeometry(t)},extractGeometry:function(t){var e=t.getGeometryType().toLowerCase();if(!ao[e])return null;var n,i=e.toUpperCase();return n=t.isEmpty()?i+" EMPTY":i+"("+ao[e].apply(this,[t])+")"}});var ao={coordinate:function(t){return t.x+" "+t.y},point:function(t){
return ao.coordinate.call(this,t.coordinates.coordinates[0])},multipoint:function(t){for(var e=[],n=0,i=t.geometries.length;i>n;++n)e.push("("+ao.point.apply(this,[t.geometries[n]])+")");return e.join(",")},linestring:function(t){for(var e=[],n=0,i=t.points.coordinates.length;i>n;++n)e.push(ao.coordinate.apply(this,[t.points.coordinates[n]]));return e.join(",")},linearring:function(t){for(var e=[],n=0,i=t.points.coordinates.length;i>n;++n)e.push(ao.coordinate.apply(this,[t.points.coordinates[n]]));return e.join(",")},multilinestring:function(t){for(var e=[],n=0,i=t.geometries.length;i>n;++n)e.push("("+ao.linestring.apply(this,[t.geometries[n]])+")");return e.join(",")},polygon:function(t){var e=[];e.push("("+ao.linestring.apply(this,[t.shell])+")");for(var n=0,i=t.holes.length;i>n;++n)e.push("("+ao.linestring.apply(this,[t.holes[n]])+")");return e.join(",")},multipolygon:function(t){for(var e=[],n=0,i=t.geometries.length;i>n;++n)e.push("("+ao.polygon.apply(this,[t.geometries[n]])+")");return e.join(",")},geometrycollection:function(t){for(var e=[],n=0,i=t.geometries.length;i>n;++n)e.push(this.extractGeometry(t.geometries[n]));return e.join(",")}},uo={point:function(t){if(void 0===t)return this.geometryFactory.createPoint();var e=t.trim().split(oo.spaces);return this.geometryFactory.createPoint(new g(Number.parseFloat(e[0]),Number.parseFloat(e[1])))},multipoint:function(t){if(void 0===t)return this.geometryFactory.createMultiPoint();for(var e,n=t.trim().split(","),i=[],r=0,s=n.length;s>r;++r)e=n[r].replace(oo.trimParens,"$1"),i.push(uo.point.apply(this,[e]));return this.geometryFactory.createMultiPoint(i)},linestring:function(t){if(void 0===t)return this.geometryFactory.createLineString();for(var e,n=t.trim().split(","),i=[],r=0,s=n.length;s>r;++r)e=n[r].trim().split(oo.spaces),i.push(new g(Number.parseFloat(e[0]),Number.parseFloat(e[1])));return this.geometryFactory.createLineString(i)},linearring:function(t){if(void 0===t)return this.geometryFactory.createLinearRing();for(var e,n=t.trim().split(","),i=[],r=0,s=n.length;s>r;++r)e=n[r].trim().split(oo.spaces),i.push(new g(Number.parseFloat(e[0]),Number.parseFloat(e[1])));return this.geometryFactory.createLinearRing(i)},multilinestring:function(t){if(void 0===t)return this.geometryFactory.createMultiLineString();for(var e,n=t.trim().split(oo.parenComma),i=[],r=0,s=n.length;s>r;++r)e=n[r].replace(oo.trimParens,"$1"),i.push(uo.linestring.apply(this,[e]));return this.geometryFactory.createMultiLineString(i)},polygon:function(t){if(void 0===t)return this.geometryFactory.createPolygon();for(var e,n,i,r,s=t.trim().split(oo.parenComma),o=[],a=0,u=s.length;u>a;++a)e=s[a].replace(oo.trimParens,"$1"),n=uo.linestring.apply(this,[e]),i=this.geometryFactory.createLinearRing(n.points),0===a?r=i:o.push(i);return this.geometryFactory.createPolygon(r,o)},multipolygon:function(t){if(void 0===t)return this.geometryFactory.createMultiPolygon();for(var e,n=t.trim().split(oo.doubleParenComma),i=[],r=0,s=n.length;s>r;++r)e=n[r].replace(oo.trimParens,"$1"),i.push(uo.polygon.apply(this,[e]));return this.geometryFactory.createMultiPolygon(i)},geometrycollection:function(t){if(void 0===t)return this.geometryFactory.createGeometryCollection();t=t.replace(/,\s*([A-Za-z])/g,"|$1");for(var e=t.trim().split("|"),n=[],i=0,r=e.length;r>i;++i)n.push(this.read(e[i]));return this.geometryFactory.createGeometryCollection(n)}};e(se.prototype,{write:function(t){return this.parser.write(t)}}),e(se,{toLineString:function(t,e){if(2!==arguments.length)throw new Error("Not implemented");return"LINESTRING ( "+t.x+" "+t.y+", "+e.x+" "+e.y+" )"}}),e(oe.prototype,{getIndexAlongSegment:function(t,e){return this.computeIntLineIndex(),this.intLineIndex[t][e]},getTopologySummary:function(){var t=new P;return this.isEndPoint()&&t.append(" endpoint"),this._isProper&&t.append(" proper"),this.isCollinear()&&t.append(" collinear"),t.toString()},computeIntersection:function(t,e,n,i){this.inputLines[0][0]=t,this.inputLines[0][1]=e,this.inputLines[1][0]=n,this.inputLines[1][1]=i,this.result=this.computeIntersect(t,e,n,i)},getIntersectionNum:function(){return this.result},computeIntLineIndex:function(){if(0===arguments.length)null===this.intLineIndex&&(this.intLineIndex=Array(2).fill().map(function(){return Array(2)}),this.computeIntLineIndex(0),this.computeIntLineIndex(1));else if(1===arguments.length){var t=arguments[0],e=this.getEdgeDistance(t,0),n=this.getEdgeDistance(t,1);e>n?(this.intLineIndex[t][0]=0,this.intLineIndex[t][1]=1):(this.intLineIndex[t][0]=1,this.intLineIndex[t][1]=0)}},isProper:function(){return this.hasIntersection()&&this._isProper},setPrecisionModel:function(t){this.precisionModel=t},isInteriorIntersection:function(){if(0===arguments.length)return this.isInteriorIntersection(0)?!0:!!this.isInteriorIntersection(1);if(1===arguments.length){for(var t=arguments[0],e=0;e<this.result;e++)if(!this.intPt[e].equals2D(this.inputLines[t][0])&&!this.intPt[e].equals2D(this.inputLines[t][1]))return!0;return!1}},getIntersection:function(t){return this.intPt[t]},isEndPoint:function(){return this.hasIntersection()&&!this._isProper},hasIntersection:function(){return this.result!==oe.NO_INTERSECTION},getEdgeDistance:function(t,e){var n=oe.computeEdgeDistance(this.intPt[e],this.inputLines[t][0],this.inputLines[t][1]);return n},isCollinear:function(){return this.result===oe.COLLINEAR_INTERSECTION},toString:function(){return se.toLineString(this.inputLines[0][0],this.inputLines[0][1])+" - "+se.toLineString(this.inputLines[1][0],this.inputLines[1][1])+this.getTopologySummary()},getEndpoint:function(t,e){return this.inputLines[t][e]},isIntersection:function(t){for(var e=0;e<this.result;e++)if(this.intPt[e].equals2D(t))return!0;return!1},getIntersectionAlongSegment:function(t,e){return this.computeIntLineIndex(),this.intPt[this.intLineIndex[t][e]]},interfaces_:function(){return[]},getClass:function(){return oe}}),oe.computeEdgeDistance=function(t,e,n){var i=Math.abs(n.x-e.x),r=Math.abs(n.y-e.y),s=-1;if(t.equals(e))s=0;else if(t.equals(n))s=i>r?i:r;else{var o=Math.abs(t.x-e.x),a=Math.abs(t.y-e.y);s=i>r?o:a,0!==s||t.equals(e)||(s=Math.max(o,a))}return f.isTrue(!(0===s&&!t.equals(e)),"Bad distance calculation"),s},oe.nonRobustComputeEdgeDistance=function(t,e,n){var i=t.x-e.x,r=t.y-e.y,s=Math.sqrt(i*i+r*r);return f.isTrue(!(0===s&&!t.equals(e)),"Invalid distance calculation"),s},oe.DONT_INTERSECT=0,oe.DO_INTERSECT=1,oe.COLLINEAR=2,oe.NO_INTERSECTION=0,oe.POINT_INTERSECTION=1,oe.COLLINEAR_INTERSECTION=2,h(ae,oe),e(ae.prototype,{isInSegmentEnvelopes:function(t){var e=new C(this.inputLines[0][0],this.inputLines[0][1]),n=new C(this.inputLines[1][0],this.inputLines[1][1]);return e.contains(t)&&n.contains(t)},computeIntersection:function(){if(3!==arguments.length)return oe.prototype.computeIntersection.apply(this,arguments);var t=arguments[0],e=arguments[1],n=arguments[2];return this._isProper=!1,C.intersects(e,n,t)&&0===he.orientationIndex(e,n,t)&&0===he.orientationIndex(n,e,t)?(this._isProper=!0,(t.equals(e)||t.equals(n))&&(this._isProper=!1),this.result=oe.POINT_INTERSECTION,null):void(this.result=oe.NO_INTERSECTION)},normalizeToMinimum:function(t,e,n,i,r){r.x=this.smallestInAbsValue(t.x,e.x,n.x,i.x),r.y=this.smallestInAbsValue(t.y,e.y,n.y,i.y),t.x-=r.x,t.y-=r.y,e.x-=r.x,e.y-=r.y,n.x-=r.x,n.y-=r.y,i.x-=r.x,i.y-=r.y},safeHCoordinateIntersection:function(t,e,n,i){var r=null;try{r=F.intersection(t,e,n,i)}catch(s){if(!(s instanceof w))throw s;r=ae.nearestEndpoint(t,e,n,i)}finally{}return r},intersection:function(t,e,n,i){var r=this.intersectionWithNormalization(t,e,n,i);return this.isInSegmentEnvelopes(r)||(r=new g(ae.nearestEndpoint(t,e,n,i))),null!==this.precisionModel&&this.precisionModel.makePrecise(r),r},smallestInAbsValue:function(t,e,n,i){var r=t,s=Math.abs(r);return Math.abs(e)<s&&(r=e,s=Math.abs(e)),Math.abs(n)<s&&(r=n,s=Math.abs(n)),Math.abs(i)<s&&(r=i),r},checkDD:function(t,e,n,i,r){var s=M.intersection(t,e,n,i),o=this.isInSegmentEnvelopes(s);A.out.println("DD in env = "+o+"  --------------------- "+s),r.distance(s)>1e-4&&A.out.println("Distance = "+r.distance(s))},intersectionWithNormalization:function(t,e,n,i){var r=new g(t),s=new g(e),o=new g(n),a=new g(i),u=new g;this.normalizeToEnvCentre(r,s,o,a,u);var l=this.safeHCoordinateIntersection(r,s,o,a);return l.x+=u.x,l.y+=u.y,l},computeCollinearIntersection:function(t,e,n,i){var r=C.intersects(t,e,n),s=C.intersects(t,e,i),o=C.intersects(n,i,t),a=C.intersects(n,i,e);return r&&s?(this.intPt[0]=n,this.intPt[1]=i,oe.COLLINEAR_INTERSECTION):o&&a?(this.intPt[0]=t,this.intPt[1]=e,oe.COLLINEAR_INTERSECTION):r&&o?(this.intPt[0]=n,this.intPt[1]=t,!n.equals(t)||s||a?oe.COLLINEAR_INTERSECTION:oe.POINT_INTERSECTION):r&&a?(this.intPt[0]=n,this.intPt[1]=e,!n.equals(e)||s||o?oe.COLLINEAR_INTERSECTION:oe.POINT_INTERSECTION):s&&o?(this.intPt[0]=i,this.intPt[1]=t,!i.equals(t)||r||a?oe.COLLINEAR_INTERSECTION:oe.POINT_INTERSECTION):s&&a?(this.intPt[0]=i,this.intPt[1]=e,!i.equals(e)||r||o?oe.COLLINEAR_INTERSECTION:oe.POINT_INTERSECTION):oe.NO_INTERSECTION},normalizeToEnvCentre:function(t,e,n,i,r){var s=t.x<e.x?t.x:e.x,o=t.y<e.y?t.y:e.y,a=t.x>e.x?t.x:e.x,u=t.y>e.y?t.y:e.y,l=n.x<i.x?n.x:i.x,h=n.y<i.y?n.y:i.y,c=n.x>i.x?n.x:i.x,f=n.y>i.y?n.y:i.y,g=s>l?s:l,d=c>a?a:c,p=o>h?o:h,v=f>u?u:f,m=(g+d)/2,y=(p+v)/2;r.x=m,r.y=y,t.x-=r.x,t.y-=r.y,e.x-=r.x,e.y-=r.y,n.x-=r.x,n.y-=r.y,i.x-=r.x,i.y-=r.y},computeIntersect:function(t,e,n,i){if(this._isProper=!1,!C.intersects(t,e,n,i))return oe.NO_INTERSECTION;var r=he.orientationIndex(t,e,n),s=he.orientationIndex(t,e,i);if(r>0&&s>0||0>r&&0>s)return oe.NO_INTERSECTION;var o=he.orientationIndex(n,i,t),a=he.orientationIndex(n,i,e);if(o>0&&a>0||0>o&&0>a)return oe.NO_INTERSECTION;var u=0===r&&0===s&&0===o&&0===a;return u?this.computeCollinearIntersection(t,e,n,i):(0===r||0===s||0===o||0===a?(this._isProper=!1,t.equals2D(n)||t.equals2D(i)?this.intPt[0]=t:e.equals2D(n)||e.equals2D(i)?this.intPt[0]=e:0===r?this.intPt[0]=new g(n):0===s?this.intPt[0]=new g(i):0===o?this.intPt[0]=new g(t):0===a&&(this.intPt[0]=new g(e))):(this._isProper=!0,this.intPt[0]=this.intersection(t,e,n,i)),oe.POINT_INTERSECTION)},interfaces_:function(){return[]},getClass:function(){return ae}}),ae.nearestEndpoint=function(t,e,n,i){var r=t,s=he.distancePointLine(t,n,i),o=he.distancePointLine(e,n,i);return s>o&&(s=o,r=e),o=he.distancePointLine(n,t,e),s>o&&(s=o,r=n),o=he.distancePointLine(i,t,e),s>o&&(s=o,r=i),r},e(ue.prototype,{interfaces_:function(){return[]},getClass:function(){return ue}}),ue.orientationIndex=function(t,e,n){var i=e.x-t.x,r=e.y-t.y,s=n.x-e.x,o=n.y-e.y;return ue.signOfDet2x2(i,r,s,o)},ue.signOfDet2x2=function(t,e,n,i){var r=null,s=null,o=null,a=0;if(r=1,0===t||0===i)return 0===e||0===n?0:e>0?n>0?-r:r:n>0?r:-r;if(0===e||0===n)return i>0?t>0?r:-r:t>0?-r:r;if(e>0?i>0?i>=e||(r=-r,s=t,t=n,n=s,s=e,e=i,i=s):-i>=e?(r=-r,n=-n,i=-i):(s=t,t=-n,n=s,s=e,e=-i,i=s):i>0?i>=-e?(r=-r,t=-t,e=-e):(s=-t,t=n,n=s,s=-e,e=i,i=s):e>=i?(t=-t,e=-e,n=-n,i=-i):(r=-r,s=-t,t=-n,n=s,s=-e,e=-i,i=s),t>0){if(!(n>0))return r;if(!(n>=t))return r}else{if(n>0)return-r;if(!(t>=n))return-r;r=-r,t=-t,n=-n}for(;;){if(a+=1,o=Math.floor(n/t),n-=o*t,i-=o*e,0>i)return-r;if(i>e)return r;if(t>n+n){if(i+i>e)return r}else{if(e>i+i)return-r;n=t-n,i=e-i,r=-r}if(0===i)return 0===n?0:-r;if(0===n)return r;if(o=Math.floor(t/n),t-=o*n,e-=o*i,0>e)return r;if(e>i)return-r;if(n>t+t){if(e+e>i)return-r}else{if(i>e+e)return r;t=n-t,e=i-e,r=-r}if(0===e)return 0===t?0:r;if(0===t)return-r}},e(le.prototype,{countSegment:function(t,e){if(t.x<this.p.x&&e.x<this.p.x)return null;if(this.p.x===e.x&&this.p.y===e.y)return this.isPointOnSegment=!0,null;if(t.y===this.p.y&&e.y===this.p.y){var n=t.x,i=e.x;return n>i&&(n=e.x,i=t.x),this.p.x>=n&&this.p.x<=i&&(this.isPointOnSegment=!0),null}if(t.y>this.p.y&&e.y<=this.p.y||e.y>this.p.y&&t.y<=this.p.y){var r=t.x-this.p.x,s=t.y-this.p.y,o=e.x-this.p.x,a=e.y-this.p.y,u=ue.signOfDet2x2(r,s,o,a);if(0===u)return this.isPointOnSegment=!0,null;s>a&&(u=-u),u>0&&this.crossingCount++}},isPointInPolygon:function(){return this.getLocation()!==L.EXTERIOR},getLocation:function(){return this.isPointOnSegment?L.BOUNDARY:this.crossingCount%2===1?L.INTERIOR:L.EXTERIOR},isOnSegment:function(){return this.isPointOnSegment},interfaces_:function(){return[]},getClass:function(){return le}}),le.locatePointInRing=function(){if(arguments[0]instanceof g&&R(arguments[1],D)){for(var t=arguments[0],e=arguments[1],n=new le(t),i=new g,r=new g,s=1;s<e.size();s++)if(e.getCoordinate(s,i),e.getCoordinate(s-1,r),n.countSegment(i,r),n.isOnSegment())return n.getLocation();return n.getLocation()}if(arguments[0]instanceof g&&arguments[1]instanceof Array){for(var o=arguments[0],a=arguments[1],n=new le(o),s=1;s<a.length;s++){var i=a[s],r=a[s-1];if(n.countSegment(i,r),n.isOnSegment())return n.getLocation()}return n.getLocation()}},e(he.prototype,{interfaces_:function(){return[]},getClass:function(){return he}}),he.orientationIndex=function(t,e,n){return M.orientationIndex(t,e,n)},he.signedArea=function(){if(arguments[0]instanceof Array){var t=arguments[0];if(t.length<3)return 0;for(var e=0,n=t[0].x,i=1;i<t.length-1;i++){var r=t[i].x-n,s=t[i+1].y,o=t[i-1].y;e+=r*(o-s)}return e/2}if(R(arguments[0],D)){var a=arguments[0],u=a.size();if(3>u)return 0;var l=new g,h=new g,c=new g;a.getCoordinate(0,h),a.getCoordinate(1,c);var n=h.x;c.x-=n;for(var e=0,i=1;u-1>i;i++)l.y=h.y,h.x=c.x,h.y=c.y,a.getCoordinate(i+1,c),c.x-=n,e+=h.x*(l.y-c.y);return e/2}},he.distanceLineLine=function(t,e,n,i){if(t.equals(e))return he.distancePointLine(t,n,i);if(n.equals(i))return he.distancePointLine(i,t,e);var r=!1;if(C.intersects(t,e,n,i)){var s=(e.x-t.x)*(i.y-n.y)-(e.y-t.y)*(i.x-n.x);if(0===s)r=!0;else{var o=(t.y-n.y)*(i.x-n.x)-(t.x-n.x)*(i.y-n.y),a=(t.y-n.y)*(e.x-t.x)-(t.x-n.x)*(e.y-t.y),u=a/s,l=o/s;(0>l||l>1||0>u||u>1)&&(r=!0)}}else r=!0;return r?T.min(he.distancePointLine(t,n,i),he.distancePointLine(e,n,i),he.distancePointLine(n,t,e),he.distancePointLine(i,t,e)):0},he.isPointInRing=function(t,e){return he.locatePointInRing(t,e)!==L.EXTERIOR},he.computeLength=function(t){var e=t.size();if(1>=e)return 0;var n=0,i=new g;t.getCoordinate(0,i);for(var r=i.x,s=i.y,o=1;e>o;o++){t.getCoordinate(o,i);var a=i.x,u=i.y,l=a-r,h=u-s;n+=Math.sqrt(l*l+h*h),r=a,s=u}return n},he.isCCW=function(t){var e=t.length-1;if(3>e)throw new i("Ring has fewer than 4 points, so orientation cannot be determined");for(var n=t[0],r=0,s=1;e>=s;s++){var o=t[s];o.y>n.y&&(n=o,r=s)}var a=r;do a-=1,0>a&&(a=e);while(t[a].equals2D(n)&&a!==r);var u=r;do u=(u+1)%e;while(t[u].equals2D(n)&&u!==r);var l=t[a],h=t[u];if(l.equals2D(n)||h.equals2D(n)||l.equals2D(h))return!1;var c=he.computeOrientation(l,n,h),f=!1;return f=0===c?l.x>h.x:c>0},he.locatePointInRing=function(t,e){return le.locatePointInRing(t,e)},he.distancePointLinePerpendicular=function(t,e,n){var i=(n.x-e.x)*(n.x-e.x)+(n.y-e.y)*(n.y-e.y),r=((e.y-t.y)*(n.x-e.x)-(e.x-t.x)*(n.y-e.y))/i;return Math.abs(r)*Math.sqrt(i)},he.computeOrientation=function(t,e,n){return he.orientationIndex(t,e,n)},he.distancePointLine=function(){if(2===arguments.length){var t=arguments[0],e=arguments[1];if(0===e.length)throw new i("Line array must contain at least one vertex");for(var n=t.distance(e[0]),r=0;r<e.length-1;r++){var s=he.distancePointLine(t,e[r],e[r+1]);n>s&&(n=s)}return n}if(3===arguments.length){var o=arguments[0],a=arguments[1],u=arguments[2];if(a.x===u.x&&a.y===u.y)return o.distance(a);var l=(u.x-a.x)*(u.x-a.x)+(u.y-a.y)*(u.y-a.y),h=((o.x-a.x)*(u.x-a.x)+(o.y-a.y)*(u.y-a.y))/l;if(0>=h)return o.distance(a);if(h>=1)return o.distance(u);var c=((a.y-o.y)*(u.x-a.x)-(a.x-o.x)*(u.y-a.y))/l;return Math.abs(c)*Math.sqrt(l)}},he.isOnLine=function(t,e){for(var n=new ae,i=1;i<e.length;i++){var r=e[i-1],s=e[i];if(n.computeIntersection(t,r,s),n.hasIntersection())return!0}return!1},he.CLOCKWISE=-1,he.RIGHT=he.CLOCKWISE,he.COUNTERCLOCKWISE=1,he.LEFT=he.COUNTERCLOCKWISE,he.COLLINEAR=0,he.STRAIGHT=he.COLLINEAR,e(ce.prototype,{minX:function(){return Math.min(this.p0.x,this.p1.x)},orientationIndex:function(){if(arguments[0]instanceof ce){var t=arguments[0],e=he.orientationIndex(this.p0,this.p1,t.p0),n=he.orientationIndex(this.p0,this.p1,t.p1);return e>=0&&n>=0?Math.max(e,n):0>=e&&0>=n?Math.max(e,n):0}if(arguments[0]instanceof g){var i=arguments[0];return he.orientationIndex(this.p0,this.p1,i)}},toGeometry:function(t){return t.createLineString([this.p0,this.p1])},isVertical:function(){return this.p0.x===this.p1.x},equals:function(t){if(!(t instanceof ce))return!1;var e=t;return this.p0.equals(e.p0)&&this.p1.equals(e.p1)},intersection:function(t){var e=new ae;return e.computeIntersection(this.p0,this.p1,t.p0,t.p1),e.hasIntersection()?e.getIntersection(0):null},project:function(){if(arguments[0]instanceof g){var t=arguments[0];if(t.equals(this.p0)||t.equals(this.p1))return new g(t);var e=this.projectionFactor(t),n=new g;return n.x=this.p0.x+e*(this.p1.x-this.p0.x),n.y=this.p0.y+e*(this.p1.y-this.p0.y),n}if(arguments[0]instanceof ce){var i=arguments[0],r=this.projectionFactor(i.p0),s=this.projectionFactor(i.p1);if(r>=1&&s>=1)return null;if(0>=r&&0>=s)return null;var o=this.project(i.p0);0>r&&(o=this.p0),r>1&&(o=this.p1);var a=this.project(i.p1);return 0>s&&(a=this.p0),s>1&&(a=this.p1),new ce(o,a)}},normalize:function(){this.p1.compareTo(this.p0)<0&&this.reverse()},angle:function(){return Math.atan2(this.p1.y-this.p0.y,this.p1.x-this.p0.x)},getCoordinate:function(t){return 0===t?this.p0:this.p1},distancePerpendicular:function(t){return he.distancePointLinePerpendicular(t,this.p0,this.p1)},minY:function(){return Math.min(this.p0.y,this.p1.y)},midPoint:function(){return ce.midPoint(this.p0,this.p1)},projectionFactor:function(t){if(t.equals(this.p0))return 0;if(t.equals(this.p1))return 1;var e=this.p1.x-this.p0.x,n=this.p1.y-this.p0.y,i=e*e+n*n;if(0>=i)return r.NaN;var s=((t.x-this.p0.x)*e+(t.y-this.p0.y)*n)/i;return s},closestPoints:function(t){var e=this.intersection(t);if(null!==e)return[e,e];var n=new Array(2).fill(null),i=r.MAX_VALUE,s=null,o=this.closestPoint(t.p0);i=o.distance(t.p0),n[0]=o,n[1]=t.p0;var a=this.closestPoint(t.p1);s=a.distance(t.p1),i>s&&(i=s,n[0]=a,n[1]=t.p1);var u=t.closestPoint(this.p0);s=u.distance(this.p0),i>s&&(i=s,n[0]=this.p0,n[1]=u);var l=t.closestPoint(this.p1);return s=l.distance(this.p1),i>s&&(i=s,n[0]=this.p1,n[1]=l),n},closestPoint:function(t){var e=this.projectionFactor(t);if(e>0&&1>e)return this.project(t);var n=this.p0.distance(t),i=this.p1.distance(t);return i>n?this.p0:this.p1},maxX:function(){return Math.max(this.p0.x,this.p1.x)},getLength:function(){return this.p0.distance(this.p1)},compareTo:function(t){var e=t,n=this.p0.compareTo(e.p0);return 0!==n?n:this.p1.compareTo(e.p1)},reverse:function(){var t=this.p0;this.p0=this.p1,this.p1=t},equalsTopo:function(t){return this.p0.equals(t.p0)&&this.p1.equals(t.p1)||this.p0.equals(t.p1)&&this.p1.equals(t.p0)},lineIntersection:function(t){try{var e=F.intersection(this.p0,this.p1,t.p0,t.p1);return e}catch(t){if(!(t instanceof w))throw t}finally{}return null},maxY:function(){return Math.max(this.p0.y,this.p1.y)},pointAlongOffset:function(t,e){var n=this.p0.x+t*(this.p1.x-this.p0.x),i=this.p0.y+t*(this.p1.y-this.p0.y),r=this.p1.x-this.p0.x,s=this.p1.y-this.p0.y,o=Math.sqrt(r*r+s*s),a=0,u=0;if(0!==e){if(0>=o)throw new IllegalStateException("Cannot compute offset from zero-length line segment");a=e*r/o,u=e*s/o}var l=n-u,h=i+a,c=new g(l,h);return c},setCoordinates:function(){if(1===arguments.length){var t=arguments[0];this.setCoordinates(t.p0,t.p1)}else if(2===arguments.length){var e=arguments[0],n=arguments[1];this.p0.x=e.x,this.p0.y=e.y,this.p1.x=n.x,this.p1.y=n.y}},segmentFraction:function(t){var e=this.projectionFactor(t);return 0>e?e=0:(e>1||r.isNaN(e))&&(e=1),e},toString:function(){return"LINESTRING( "+this.p0.x+" "+this.p0.y+", "+this.p1.x+" "+this.p1.y+")"},isHorizontal:function(){return this.p0.y===this.p1.y},distance:function(){if(arguments[0]instanceof ce){var t=arguments[0];return he.distanceLineLine(this.p0,this.p1,t.p0,t.p1)}if(arguments[0]instanceof g){var e=arguments[0];return he.distancePointLine(e,this.p0,this.p1)}},pointAlong:function(t){var e=new g;return e.x=this.p0.x+t*(this.p1.x-this.p0.x),e.y=this.p0.y+t*(this.p1.y-this.p0.y),e},hashCode:function(){var t=java.lang.Double.doubleToLongBits(this.p0.x);t^=31*java.lang.Double.doubleToLongBits(this.p0.y);var e=Math.trunc(t)^Math.trunc(t>>32),n=java.lang.Double.doubleToLongBits(this.p1.x);n^=31*java.lang.Double.doubleToLongBits(this.p1.y);var i=Math.trunc(n)^Math.trunc(n>>32);return e^i},interfaces_:function(){return[s,u]},getClass:function(){return ce}}),ce.midPoint=function(t,e){return new g((t.x+e.x)/2,(t.y+e.y)/2)},ce.serialVersionUID=0x2d2172135f411c00,e(fe.prototype,{isIntersects:function(){return!this.isDisjoint()},isCovers:function(){var t=fe.isTrue(this.matrix[L.INTERIOR][L.INTERIOR])||fe.isTrue(this.matrix[L.INTERIOR][L.BOUNDARY])||fe.isTrue(this.matrix[L.BOUNDARY][L.INTERIOR])||fe.isTrue(this.matrix[L.BOUNDARY][L.BOUNDARY]);return t&&this.matrix[L.EXTERIOR][L.INTERIOR]===lt.FALSE&&this.matrix[L.EXTERIOR][L.BOUNDARY]===lt.FALSE},isCoveredBy:function(){var t=fe.isTrue(this.matrix[L.INTERIOR][L.INTERIOR])||fe.isTrue(this.matrix[L.INTERIOR][L.BOUNDARY])||fe.isTrue(this.matrix[L.BOUNDARY][L.INTERIOR])||fe.isTrue(this.matrix[L.BOUNDARY][L.BOUNDARY]);return t&&this.matrix[L.INTERIOR][L.EXTERIOR]===lt.FALSE&&this.matrix[L.BOUNDARY][L.EXTERIOR]===lt.FALSE},set:function(){if(1===arguments.length)for(var t=arguments[0],e=0;e<t.length;e++){var n=Math.trunc(e/3),i=e%3;this.matrix[n][i]=lt.toDimensionValue(t.charAt(e))}else if(3===arguments.length){var r=arguments[0],s=arguments[1],o=arguments[2];this.matrix[r][s]=o}},isContains:function(){return fe.isTrue(this.matrix[L.INTERIOR][L.INTERIOR])&&this.matrix[L.EXTERIOR][L.INTERIOR]===lt.FALSE&&this.matrix[L.EXTERIOR][L.BOUNDARY]===lt.FALSE},setAtLeast:function(){if(1===arguments.length)for(var t=arguments[0],e=0;e<t.length;e++){var n=Math.trunc(e/3),i=e%3;this.setAtLeast(n,i,lt.toDimensionValue(t.charAt(e)))}else if(3===arguments.length){var r=arguments[0],s=arguments[1],o=arguments[2];this.matrix[r][s]<o&&(this.matrix[r][s]=o)}},setAtLeastIfValid:function(t,e,n){t>=0&&e>=0&&this.setAtLeast(t,e,n)},isWithin:function(){return fe.isTrue(this.matrix[L.INTERIOR][L.INTERIOR])&&this.matrix[L.INTERIOR][L.EXTERIOR]===lt.FALSE&&this.matrix[L.BOUNDARY][L.EXTERIOR]===lt.FALSE},isTouches:function(t,e){return t>e?this.isTouches(e,t):t===lt.A&&e===lt.A||t===lt.L&&e===lt.L||t===lt.L&&e===lt.A||t===lt.P&&e===lt.A||t===lt.P&&e===lt.L?this.matrix[L.INTERIOR][L.INTERIOR]===lt.FALSE&&(fe.isTrue(this.matrix[L.INTERIOR][L.BOUNDARY])||fe.isTrue(this.matrix[L.BOUNDARY][L.INTERIOR])||fe.isTrue(this.matrix[L.BOUNDARY][L.BOUNDARY])):!1},isOverlaps:function(t,e){return t===lt.P&&e===lt.P||t===lt.A&&e===lt.A?fe.isTrue(this.matrix[L.INTERIOR][L.INTERIOR])&&fe.isTrue(this.matrix[L.INTERIOR][L.EXTERIOR])&&fe.isTrue(this.matrix[L.EXTERIOR][L.INTERIOR]):t===lt.L&&e===lt.L?1===this.matrix[L.INTERIOR][L.INTERIOR]&&fe.isTrue(this.matrix[L.INTERIOR][L.EXTERIOR])&&fe.isTrue(this.matrix[L.EXTERIOR][L.INTERIOR]):!1},isEquals:function(t,e){return t!==e?!1:fe.isTrue(this.matrix[L.INTERIOR][L.INTERIOR])&&this.matrix[L.INTERIOR][L.EXTERIOR]===lt.FALSE&&this.matrix[L.BOUNDARY][L.EXTERIOR]===lt.FALSE&&this.matrix[L.EXTERIOR][L.INTERIOR]===lt.FALSE&&this.matrix[L.EXTERIOR][L.BOUNDARY]===lt.FALSE},toString:function(){for(var t=new P("123456789"),e=0;3>e;e++)for(var n=0;3>n;n++)t.setCharAt(3*e+n,lt.toDimensionSymbol(this.matrix[e][n]));return t.toString()},setAll:function(t){for(var e=0;3>e;e++)for(var n=0;3>n;n++)this.matrix[e][n]=t},get:function(t,e){return this.matrix[t][e]},transpose:function(){var t=this.matrix[1][0];return this.matrix[1][0]=this.matrix[0][1],this.matrix[0][1]=t,t=this.matrix[2][0],this.matrix[2][0]=this.matrix[0][2],this.matrix[0][2]=t,t=this.matrix[2][1],this.matrix[2][1]=this.matrix[1][2],this.matrix[1][2]=t,this},matches:function(t){if(9!==t.length)throw new i("Should be length 9: "+t);for(var e=0;3>e;e++)for(var n=0;3>n;n++)if(!fe.matches(this.matrix[e][n],t.charAt(3*e+n)))return!1;return!0},add:function(t){for(var e=0;3>e;e++)for(var n=0;3>n;n++)this.setAtLeast(e,n,t.get(e,n))},isDisjoint:function(){return this.matrix[L.INTERIOR][L.INTERIOR]===lt.FALSE&&this.matrix[L.INTERIOR][L.BOUNDARY]===lt.FALSE&&this.matrix[L.BOUNDARY][L.INTERIOR]===lt.FALSE&&this.matrix[L.BOUNDARY][L.BOUNDARY]===lt.FALSE},isCrosses:function(t,e){return t===lt.P&&e===lt.L||t===lt.P&&e===lt.A||t===lt.L&&e===lt.A?fe.isTrue(this.matrix[L.INTERIOR][L.INTERIOR])&&fe.isTrue(this.matrix[L.INTERIOR][L.EXTERIOR]):t===lt.L&&e===lt.P||t===lt.A&&e===lt.P||t===lt.A&&e===lt.L?fe.isTrue(this.matrix[L.INTERIOR][L.INTERIOR])&&fe.isTrue(this.matrix[L.EXTERIOR][L.INTERIOR]):t===lt.L&&e===lt.L?0===this.matrix[L.INTERIOR][L.INTERIOR]:!1},interfaces_:function(){return[o]},getClass:function(){return fe}}),fe.matches=function(){if(Number.isInteger(arguments[0])&&"string"==typeof arguments[1]){var t=arguments[0],e=arguments[1];return e===lt.SYM_DONTCARE?!0:e===lt.SYM_TRUE&&(t>=0||t===lt.TRUE)?!0:e===lt.SYM_FALSE&&t===lt.FALSE?!0:e===lt.SYM_P&&t===lt.P?!0:e===lt.SYM_L&&t===lt.L?!0:e===lt.SYM_A&&t===lt.A}if("string"==typeof arguments[0]&&"string"==typeof arguments[1]){var n=arguments[0],i=arguments[1],r=new fe(n);return r.matches(i)}},fe.isTrue=function(t){return t>=0||t===lt.TRUE};var lo=Object.freeze({Coordinate:g,CoordinateList:N,Envelope:C,LineSegment:ce,GeometryFactory:ie,Geometry:B,Point:Lt,LineString:St,LinearRing:bt,Polygon:Tt,GeometryCollection:ft,MultiPoint:Pt,MultiLineString:gt,MultiPolygon:Ot,Dimension:lt,IntersectionMatrix:fe});e(ge.prototype,{addPoint:function(t){this.ptCount+=1,this.ptCentSum.x+=t.x,this.ptCentSum.y+=t.y},setBasePoint:function(t){null===this.areaBasePt&&(this.areaBasePt=t)},addLineSegments:function(t){for(var e=0,n=0;n<t.length-1;n++){var i=t[n].distance(t[n+1]);if(0!==i){e+=i;var r=(t[n].x+t[n+1].x)/2;this.lineCentSum.x+=i*r;var s=(t[n].y+t[n+1].y)/2;this.lineCentSum.y+=i*s}}this.totalLength+=e,0===e&&t.length>0&&this.addPoint(t[0])},addHole:function(t){for(var e=he.isCCW(t),n=0;n<t.length-1;n++)this.addTriangle(this.areaBasePt,t[n],t[n+1],e);this.addLineSegments(t)},getCentroid:function(){var t=new g;if(Math.abs(this.areasum2)>0)t.x=this.cg3.x/3/this.areasum2,t.y=this.cg3.y/3/this.areasum2;else if(this.totalLength>0)t.x=this.lineCentSum.x/this.totalLength,t.y=this.lineCentSum.y/this.totalLength;else{if(!(this.ptCount>0))return null;t.x=this.ptCentSum.x/this.ptCount,t.y=this.ptCentSum.y/this.ptCount}return t},addShell:function(t){t.length>0&&this.setBasePoint(t[0]);for(var e=!he.isCCW(t),n=0;n<t.length-1;n++)this.addTriangle(this.areaBasePt,t[n],t[n+1],e);this.addLineSegments(t)},addTriangle:function(t,e,n,i){var r=i?1:-1;ge.centroid3(t,e,n,this.triangleCent3);var s=ge.area2(t,e,n);this.cg3.x+=r*s*this.triangleCent3.x,this.cg3.y+=r*s*this.triangleCent3.y,this.areasum2+=r*s},add:function(){if(arguments[0]instanceof Tt){var t=arguments[0];this.addShell(t.getExteriorRing().getCoordinates());for(var e=0;e<t.getNumInteriorRing();e++)this.addHole(t.getInteriorRingN(e).getCoordinates())}else if(arguments[0]instanceof B){var n=arguments[0];if(n.isEmpty())return null;if(n instanceof Lt)this.addPoint(n.getCoordinate());else if(n instanceof St)this.addLineSegments(n.getCoordinates());else if(n instanceof Tt){var i=n;this.add(i)}else if(n instanceof ft)for(var r=n,e=0;e<r.getNumGeometries();e++)this.add(r.getGeometryN(e))}},interfaces_:function(){return[]},getClass:function(){return ge}}),ge.area2=function(t,e,n){return(e.x-t.x)*(n.y-t.y)-(n.x-t.x)*(e.y-t.y)},ge.centroid3=function(t,e,n,i){return i.x=t.x+e.x+n.x,i.y=t.y+e.y+n.y,null},ge.getCentroid=function(t){var e=new ge(t);return e.getCentroid()},de.prototype=new Error,de.prototype.name="EmptyStackException",pe.prototype=new y,pe.prototype.add=function(t){return this.array_.push(t),!0},pe.prototype.get=function(t){if(0>t||t>=this.size())throw new IndexOutOfBoundsException;return this.array_[t]},pe.prototype.push=function(t){return this.array_.push(t),t},pe.prototype.pop=function(t){if(0===this.array_.length)throw new de;return this.array_.pop()},pe.prototype.peek=function(){if(0===this.array_.length)throw new de;return this.array_[this.array_.length-1]},pe.prototype.empty=function(){return 0===this.array_.length},pe.prototype.isEmpty=function(){return this.empty()},pe.prototype.search=function(t){return this.array_.indexOf(t)},pe.prototype.size=function(){return this.array_.length},pe.prototype.toArray=function(){for(var t=[],e=0,n=this.array_.length;n>e;e++)t.push(this.array_[e]);return t},e(ve.prototype,{filter:function(t){this.treeSet.contains(t)||(this.list.add(t),this.treeSet.add(t))},getCoordinates:function(){var t=new Array(this.list.size()).fill(null);return this.list.toArray(t)},interfaces_:function(){return[z]},getClass:function(){return ve}}),ve.filterCoordinates=function(t){for(var e=new ve,n=0;n<t.length;n++)e.filter(t[n]);return e.getCoordinates()},e(me.prototype,{preSort:function(t){for(var e=null,n=1;n<t.length;n++)(t[n].y<t[0].y||t[n].y===t[0].y&&t[n].x<t[0].x)&&(e=t[0],t[0]=t[n],t[n]=e);return ut.sort(t,1,t.length,new ye(t[0])),t},computeOctRing:function(t){var e=this.computeOctPts(t),n=new N;return n.add(e,!1),n.size()<3?null:(n.closeRing(),n.toCoordinateArray())},lineOrPolygon:function(t){if(t=this.cleanRing(t),3===t.length)return this.geomFactory.createLineString([t[0],t[1]]);var e=this.geomFactory.createLinearRing(t);return this.geomFactory.createPolygon(e,null)},cleanRing:function(t){f.equals(t[0],t[t.length-1]);for(var e=new I,n=null,i=0;i<=t.length-2;i++){var r=t[i],s=t[i+1];r.equals(s)||null!==n&&this.isBetween(n,r,s)||(e.add(r),n=r)}e.add(t[t.length-1]);var o=new Array(e.size()).fill(null);return e.toArray(o)},isBetween:function(t,e,n){if(0!==he.computeOrientation(t,e,n))return!1;if(t.x!==n.x){if(t.x<=e.x&&e.x<=n.x)return!0;if(n.x<=e.x&&e.x<=t.x)return!0}if(t.y!==n.y){if(t.y<=e.y&&e.y<=n.y)return!0;if(n.y<=e.y&&e.y<=t.y)return!0}return!1},reduce:function(t){var e=this.computeOctRing(t);if(null===e)return t;for(var n=new at,i=0;i<e.length;i++)n.add(e[i]);for(var i=0;i<t.length;i++)he.isPointInRing(t[i],e)||n.add(t[i]);var r=H.toCoordinateArray(n);return r.length<3?this.padArray3(r):r},getConvexHull:function(){if(0===this.inputPts.length)return this.geomFactory.createGeometryCollection(null);if(1===this.inputPts.length)return this.geomFactory.createPoint(this.inputPts[0]);if(2===this.inputPts.length)return this.geomFactory.createLineString(this.inputPts);var t=this.inputPts;this.inputPts.length>50&&(t=this.reduce(this.inputPts));var e=this.preSort(t),n=this.grahamScan(e),i=this.toCoordinateArray(n);return this.lineOrPolygon(i)},padArray3:function(t){for(var e=new Array(3).fill(null),n=0;n<e.length;n++)n<t.length?e[n]=t[n]:e[n]=t[0];return e},computeOctPts:function(t){for(var e=new Array(8).fill(null),n=0;n<e.length;n++)e[n]=t[0];for(var i=1;i<t.length;i++)t[i].x<e[0].x&&(e[0]=t[i]),t[i].x-t[i].y<e[1].x-e[1].y&&(e[1]=t[i]),t[i].y>e[2].y&&(e[2]=t[i]),t[i].x+t[i].y>e[3].x+e[3].y&&(e[3]=t[i]),t[i].x>e[4].x&&(e[4]=t[i]),t[i].x-t[i].y>e[5].x-e[5].y&&(e[5]=t[i]),t[i].y<e[6].y&&(e[6]=t[i]),t[i].x+t[i].y<e[7].x+e[7].y&&(e[7]=t[i]);return e},toCoordinateArray:function(t){for(var e=new Array(t.size()).fill(null),n=0;n<t.size();n++){var i=t.get(n);e[n]=i}return e},grahamScan:function(t){var e=null,n=new pe;e=n.push(t[0]),e=n.push(t[1]),e=n.push(t[2]);for(var i=3;i<t.length;i++){for(e=n.pop();!n.empty()&&he.computeOrientation(n.peek(),e,t[i])>0;)e=n.pop();e=n.push(e),e=n.push(t[i])}return e=n.push(t[0]),n},interfaces_:function(){return[]},getClass:function(){return me}}),me.extractCoordinates=function(t){var e=new ve;return t.apply(e),e.getCoordinates()},e(ye.prototype,{compare:function(t,e){var n=t,i=e;return ye.polarCompare(this.origin,n,i)},interfaces_:function(){return[a]},getClass:function(){return ye}}),ye.polarCompare=function(t,e,n){var i=e.x-t.x,r=e.y-t.y,s=n.x-t.x,o=n.y-t.y,a=he.computeOrientation(t,e,n);
if(a===he.COUNTERCLOCKWISE)return 1;if(a===he.CLOCKWISE)return-1;var u=i*i+r*r,l=s*s+o*o;return l>u?-1:u>l?1:0},me.RadialComparator=ye,e(xe.prototype,{transformPoint:function(t,e){return this.factory.createPoint(this.transformCoordinates(t.getCoordinateSequence(),t))},transformPolygon:function(t,e){var n=!0,i=this.transformLinearRing(t.getExteriorRing(),t);null!==i&&i instanceof bt&&!i.isEmpty()||(n=!1);for(var r=new I,s=0;s<t.getNumInteriorRing();s++){var o=this.transformLinearRing(t.getInteriorRingN(s),t);null===o||o.isEmpty()||(o instanceof bt||(n=!1),r.add(o))}if(n)return this.factory.createPolygon(i,r.toArray([]));var a=new I;return null!==i&&a.add(i),a.addAll(r),this.factory.buildGeometry(a)},createCoordinateSequence:function(t){return this.factory.getCoordinateSequenceFactory().create(t)},getInputGeometry:function(){return this.inputGeom},transformMultiLineString:function(t,e){for(var n=new I,i=0;i<t.getNumGeometries();i++){var r=this.transformLineString(t.getGeometryN(i),t);null!==r&&(r.isEmpty()||n.add(r))}return this.factory.buildGeometry(n)},transformCoordinates:function(t,e){return this.copy(t)},transformLineString:function(t,e){return this.factory.createLineString(this.transformCoordinates(t.getCoordinateSequence(),t))},transformMultiPoint:function(t,e){for(var n=new I,i=0;i<t.getNumGeometries();i++){var r=this.transformPoint(t.getGeometryN(i),t);null!==r&&(r.isEmpty()||n.add(r))}return this.factory.buildGeometry(n)},transformMultiPolygon:function(t,e){for(var n=new I,i=0;i<t.getNumGeometries();i++){var r=this.transformPolygon(t.getGeometryN(i),t);null!==r&&(r.isEmpty()||n.add(r))}return this.factory.buildGeometry(n)},copy:function(t){return t.copy()},transformGeometryCollection:function(t,e){for(var n=new I,i=0;i<t.getNumGeometries();i++){var r=this.transform(t.getGeometryN(i));null!==r&&(this.pruneEmptyGeometry&&r.isEmpty()||n.add(r))}return this.preserveGeometryCollectionType?this.factory.createGeometryCollection(ie.toGeometryArray(n)):this.factory.buildGeometry(n)},transform:function(t){if(this.inputGeom=t,this.factory=t.getFactory(),t instanceof Lt)return this.transformPoint(t,null);if(t instanceof Pt)return this.transformMultiPoint(t,null);if(t instanceof bt)return this.transformLinearRing(t,null);if(t instanceof St)return this.transformLineString(t,null);if(t instanceof gt)return this.transformMultiLineString(t,null);if(t instanceof Tt)return this.transformPolygon(t,null);if(t instanceof Ot)return this.transformMultiPolygon(t,null);if(t instanceof ft)return this.transformGeometryCollection(t,null);throw new i("Unknown Geometry subtype: "+t.getClass().getName())},transformLinearRing:function(t,e){var n=this.transformCoordinates(t.getCoordinateSequence(),t);if(null===n)return this.factory.createLinearRing(null);var i=n.size();return i>0&&4>i&&!this.preserveType?this.factory.createLineString(n):this.factory.createLinearRing(n)},interfaces_:function(){return[]},getClass:function(){return xe}}),e(Ee.prototype,{snapVertices:function(t,e){for(var n=this._isClosed?t.size()-1:t.size(),i=0;n>i;i++){var r=t.get(i),s=this.findSnapForVertex(r,e);null!==s&&(t.set(i,new g(s)),0===i&&this._isClosed&&t.set(t.size()-1,new g(s)))}},findSnapForVertex:function(t,e){for(var n=0;n<e.length;n++){if(t.equals2D(e[n]))return null;if(t.distance(e[n])<this.snapTolerance)return e[n]}return null},snapTo:function(t){var e=new N(this.srcPts);this.snapVertices(e,t),this.snapSegments(e,t);var n=e.toCoordinateArray();return n},snapSegments:function(t,e){if(0===e.length)return null;var n=e.length;e[0].equals2D(e[e.length-1])&&(n=e.length-1);for(var i=0;n>i;i++){var r=e[i],s=this.findSegmentIndexToSnap(r,t);s>=0&&t.add(s+1,new g(r),!1)}},findSegmentIndexToSnap:function(t,e){for(var n=r.MAX_VALUE,i=-1,s=0;s<e.size()-1;s++){if(this.seg.p0=e.get(s),this.seg.p1=e.get(s+1),this.seg.p0.equals2D(t)||this.seg.p1.equals2D(t)){if(this.allowSnappingToSourceVertices)continue;return-1}var o=this.seg.distance(t);o<this.snapTolerance&&n>o&&(n=o,i=s)}return i},setAllowSnappingToSourceVertices:function(t){this.allowSnappingToSourceVertices=t},interfaces_:function(){return[]},getClass:function(){return Ee}}),Ee.isClosed=function(t){return t.length<=1?!1:t[0].equals2D(t[t.length-1])},e(Ie.prototype,{snapTo:function(t,e){var n=this.extractTargetCoordinates(t),i=new Ne(e,n);return i.transform(this.srcGeom)},snapToSelf:function(t,e){var n=this.extractTargetCoordinates(this.srcGeom),i=new Ne(t,n,!0),r=i.transform(this.srcGeom),s=r;return e&&R(s,Rt)&&(s=r.buffer(0)),s},computeSnapTolerance:function(t){var e=this.computeMinimumSegmentLength(t),n=e/10;return n},extractTargetCoordinates:function(t){for(var e=new at,n=t.getCoordinates(),i=0;i<n.length;i++)e.add(n[i]);return e.toArray(new Array(0).fill(null))},computeMinimumSegmentLength:function(t){for(var e=r.MAX_VALUE,n=0;n<t.length-1;n++){var i=t[n].distance(t[n+1]);e>i&&(e=i)}return e},interfaces_:function(){return[]},getClass:function(){return Ie}}),Ie.snap=function(t,e,n){var i=new Array(2).fill(null),r=new Ie(t);i[0]=r.snapTo(e,n);var s=new Ie(e);return i[1]=s.snapTo(i[0],n),i},Ie.computeOverlaySnapTolerance=function(){if(1===arguments.length){var t=arguments[0],e=Ie.computeSizeBasedSnapTolerance(t),n=t.getPrecisionModel();if(n.getType()===ee.FIXED){var i=1/n.getScale()*2/1.415;i>e&&(e=i)}return e}if(2===arguments.length){var r=arguments[0],s=arguments[1];return Math.min(Ie.computeOverlaySnapTolerance(r),Ie.computeOverlaySnapTolerance(s))}},Ie.computeSizeBasedSnapTolerance=function(t){var e=t.getEnvelopeInternal(),n=Math.min(e.getHeight(),e.getWidth()),i=n*Ie.SNAP_PRECISION_FACTOR;return i},Ie.snapToSelf=function(t,e,n){var i=new Ie(t);return i.snapToSelf(e,n)},Ie.SNAP_PRECISION_FACTOR=1e-9,h(Ne,xe),e(Ne.prototype,{snapLine:function(t,e){var n=new Ee(t,this.snapTolerance);return n.setAllowSnappingToSourceVertices(this.isSelfSnap),n.snapTo(e)},transformCoordinates:function(t,e){var n=t.toCoordinateArray(),i=this.snapLine(n,this.snapPts);return this.factory.getCoordinateSequenceFactory().create(i)},interfaces_:function(){return[]},getClass:function(){return Ne}}),e(Ce.prototype,{getCommon:function(){return r.longBitsToDouble(this.commonBits)},add:function(t){var e=r.doubleToLongBits(t);if(this.isFirst)return this.commonBits=e,this.commonSignExp=Ce.signExpBits(this.commonBits),this.isFirst=!1,null;var n=Ce.signExpBits(e);return n!==this.commonSignExp?(this.commonBits=0,null):(this.commonMantissaBitsCount=Ce.numCommonMostSigMantissaBits(this.commonBits,e),void(this.commonBits=Ce.zeroLowerBits(this.commonBits,64-(12+this.commonMantissaBitsCount))))},toString:function(){if(1===arguments.length){var t=arguments[0],e=r.longBitsToDouble(t),n=Long.toBinaryString(t),i="0000000000000000000000000000000000000000000000000000000000000000"+n,s=i.substring(i.length-64),o=s.substring(0,1)+"  "+s.substring(1,12)+"(exp) "+s.substring(12)+" [ "+e+" ]";return o}},interfaces_:function(){return[]},getClass:function(){return Ce}}),Ce.getBit=function(t,e){var n=1<<e;return 0!==(t&n)?1:0},Ce.signExpBits=function(t){return t>>52},Ce.zeroLowerBits=function(t,e){var n=(1<<e)-1,i=~n,r=t&i;return r},Ce.numCommonMostSigMantissaBits=function(t,e){for(var n=0,i=52;i>=0;i--){if(Ce.getBit(t,i)!==Ce.getBit(e,i))return n;n++}return 52},e(Se.prototype,{addCommonBits:function(t){var e=new Le(this.commonCoord);t.apply(e),t.geometryChanged()},removeCommonBits:function(t){if(0===this.commonCoord.x&&0===this.commonCoord.y)return t;var e=new g(this.commonCoord);e.x=-e.x,e.y=-e.y;var n=new Le(e);return t.apply(n),t.geometryChanged(),t},getCommonCoordinate:function(){return this.commonCoord},add:function(t){t.apply(this.ccFilter),this.commonCoord=this.ccFilter.getCommonCoordinate()},interfaces_:function(){return[]},getClass:function(){return Se}}),e(we.prototype,{filter:function(t){this.commonBitsX.add(t.x),this.commonBitsY.add(t.y)},getCommonCoordinate:function(){return new g(this.commonBitsX.getCommon(),this.commonBitsY.getCommon())},interfaces_:function(){return[z]},getClass:function(){return we}}),e(Le.prototype,{filter:function(t,e){var n=t.getOrdinate(e,0)+this.trans.x,i=t.getOrdinate(e,1)+this.trans.y;t.setOrdinate(e,0,n),t.setOrdinate(e,1,i)},isDone:function(){return!1},isGeometryChanged:function(){return!0},interfaces_:function(){return[ct]},getClass:function(){return Le}}),Se.CommonCoordinateFilter=we,Se.Translater=Le,e(Re.prototype,{next:function(){if(this.atStart)return this.atStart=!1,Re.isAtomic(this.parent)&&this.index++,this.parent;if(null!==this.subcollectionIterator){if(this.subcollectionIterator.hasNext())return this.subcollectionIterator.next();this.subcollectionIterator=null}if(this.index>=this.max)throw new x;var t=this.parent.getGeometryN(this.index++);return t instanceof ft?(this.subcollectionIterator=new Re(t),this.subcollectionIterator.next()):t},remove:function(){throw new UnsupportedOperationException(this.getClass().getName())},hasNext:function(){if(this.atStart)return!0;if(null!==this.subcollectionIterator){if(this.subcollectionIterator.hasNext())return!0;this.subcollectionIterator=null}return!(this.index>=this.max)},interfaces_:function(){return[p]},getClass:function(){return Re}}),Re.isAtomic=function(t){return!(t instanceof ft)},e(Te.prototype,{locateInternal:function(){if(arguments[0]instanceof g&&arguments[1]instanceof Tt){var t=arguments[0],e=arguments[1];if(e.isEmpty())return L.EXTERIOR;var n=e.getExteriorRing(),i=this.locateInPolygonRing(t,n);if(i===L.EXTERIOR)return L.EXTERIOR;if(i===L.BOUNDARY)return L.BOUNDARY;for(var r=0;r<e.getNumInteriorRing();r++){var s=e.getInteriorRingN(r),o=this.locateInPolygonRing(t,s);if(o===L.INTERIOR)return L.EXTERIOR;if(o===L.BOUNDARY)return L.BOUNDARY}return L.INTERIOR}if(arguments[0]instanceof g&&arguments[1]instanceof St){var a=arguments[0],u=arguments[1];if(!u.getEnvelopeInternal().intersects(a))return L.EXTERIOR;var l=u.getCoordinates();return u.isClosed()||!a.equals(l[0])&&!a.equals(l[l.length-1])?he.isOnLine(a,l)?L.INTERIOR:L.EXTERIOR:L.BOUNDARY}if(arguments[0]instanceof g&&arguments[1]instanceof Lt){var h=arguments[0],c=arguments[1],f=c.getCoordinate();return f.equals2D(h)?L.INTERIOR:L.EXTERIOR}},locateInPolygonRing:function(t,e){return e.getEnvelopeInternal().intersects(t)?he.locatePointInRing(t,e.getCoordinates()):L.EXTERIOR},intersects:function(t,e){return this.locate(t,e)!==L.EXTERIOR},updateLocationInfo:function(t){t===L.INTERIOR&&(this.isIn=!0),t===L.BOUNDARY&&this.numBoundaries++},computeLocation:function(t,e){if(e instanceof Lt&&this.updateLocationInfo(this.locateInternal(t,e)),e instanceof St)this.updateLocationInfo(this.locateInternal(t,e));else if(e instanceof Tt)this.updateLocationInfo(this.locateInternal(t,e));else if(e instanceof gt)for(var n=e,i=0;i<n.getNumGeometries();i++){var r=n.getGeometryN(i);this.updateLocationInfo(this.locateInternal(t,r))}else if(e instanceof Ot)for(var s=e,i=0;i<s.getNumGeometries();i++){var o=s.getGeometryN(i);this.updateLocationInfo(this.locateInternal(t,o))}else if(e instanceof ft)for(var a=new Re(e);a.hasNext();){var u=a.next();u!==e&&this.computeLocation(t,u)}},locate:function(t,e){return e.isEmpty()?L.EXTERIOR:e instanceof St?this.locateInternal(t,e):e instanceof Tt?this.locateInternal(t,e):(this.isIn=!1,this.numBoundaries=0,this.computeLocation(t,e),this.boundaryRule.isInBoundary(this.numBoundaries)?L.BOUNDARY:this.numBoundaries>0||this.isIn?L.INTERIOR:L.EXTERIOR)},interfaces_:function(){return[]},getClass:function(){return Te}}),e(Pe.prototype,{interfaces_:function(){return[]},getClass:function(){return Pe}}),Pe.octant=function(){if("number"==typeof arguments[0]&&"number"==typeof arguments[1]){var t=arguments[0],e=arguments[1];if(0===t&&0===e)throw new i("Cannot compute the octant for point ( "+t+", "+e+" )");var n=Math.abs(t),r=Math.abs(e);return t>=0?e>=0?n>=r?0:1:n>=r?7:6:e>=0?n>=r?3:2:n>=r?4:5}if(arguments[0]instanceof g&&arguments[1]instanceof g){var s=arguments[0],o=arguments[1],a=o.x-s.x,u=o.y-s.y;if(0===a&&0===u)throw new i("Cannot compute the octant for two identical points "+s);return Pe.octant(a,u)}},e(be.prototype,{getCoordinates:function(){},size:function(){},getCoordinate:function(t){},isClosed:function(){},setData:function(t){},getData:function(){},interfaces_:function(){return[]},getClass:function(){return be}}),e(Oe.prototype,{getCoordinates:function(){return this.pts},size:function(){return this.pts.length},getCoordinate:function(t){return this.pts[t]},isClosed:function(){return this.pts[0].equals(this.pts[this.pts.length-1])},getSegmentOctant:function(t){return t===this.pts.length-1?-1:Pe.octant(this.getCoordinate(t),this.getCoordinate(t+1))},setData:function(t){this.data=t},getData:function(){return this.data},toString:function(){return se.toLineString(new Gt(this.pts))},interfaces_:function(){return[be]},getClass:function(){return Oe}}),e(_e.prototype,{getBounds:function(){},interfaces_:function(){return[]},getClass:function(){return _e}}),e(Me.prototype,{getItem:function(){return this.item},getBounds:function(){return this.bounds},interfaces_:function(){return[_e,u]},getClass:function(){return Me}}),e(De.prototype,{poll:function(){if(this.isEmpty())return null;var t=this.items.get(1);return this.items.set(1,this.items.get(this._size)),this._size-=1,this.reorder(1),t},size:function(){return this._size},reorder:function(t){for(var e=null,n=this.items.get(t);2*t<=this._size&&(e=2*t,e!==this._size&&this.items.get(e+1).compareTo(this.items.get(e))<0&&e++,this.items.get(e).compareTo(n)<0);t=e)this.items.set(t,this.items.get(e));this.items.set(t,n)},clear:function(){this._size=0,this.items.clear()},isEmpty:function(){return 0===this._size},add:function(t){this.items.add(null),this._size+=1;var e=this._size;for(this.items.set(0,t);t.compareTo(this.items.get(Math.trunc(e/2)))<0;e/=2)this.items.set(e,this.items.get(Math.trunc(e/2)));this.items.set(e,t)},interfaces_:function(){return[]},getClass:function(){return De}}),e(Ae.prototype,{visitItem:function(t){},interfaces_:function(){return[]},getClass:function(){return Ae}}),e(Fe.prototype,{insert:function(t,e){},remove:function(t,e){},query:function(){if(1===arguments.length){arguments[0]}else if(2===arguments.length){arguments[0],arguments[1]}},interfaces_:function(){return[]},getClass:function(){return Fe}}),e(Ge.prototype,{getLevel:function(){return this.level},size:function(){return this.childBoundables.size()},getChildBoundables:function(){return this.childBoundables},addChildBoundable:function(t){f.isTrue(null===this.bounds),this.childBoundables.add(t)},isEmpty:function(){return this.childBoundables.isEmpty()},getBounds:function(){return null===this.bounds&&(this.bounds=this.computeBounds()),this.bounds},interfaces_:function(){return[_e,u]},getClass:function(){return Ge}}),Ge.serialVersionUID=0x5a1e55ec41369800;var ho={reverseOrder:function(){return{compare:function(t,e){return e.compareTo(t)}}},min:function(t){return ho.sort(t),t.get(0)},sort:function(t,e){var n=t.toArray();e?ut.sort(n,e):ut.sort(n);for(var i=t.iterator(),r=0,s=n.length;s>r;r++)i.next(),i.set(n[r])},singletonList:function(t){var e=new I;return e.add(t),e}};e(qe.prototype,{expandToQueue:function(t,e){var n=qe.isComposite(this.boundable1),r=qe.isComposite(this.boundable2);if(n&&r)return qe.area(this.boundable1)>qe.area(this.boundable2)?(this.expand(this.boundable1,this.boundable2,t,e),null):(this.expand(this.boundable2,this.boundable1,t,e),null);if(n)return this.expand(this.boundable1,this.boundable2,t,e),null;if(r)return this.expand(this.boundable2,this.boundable1,t,e),null;throw new i("neither boundable is composite")},isLeaves:function(){return!(qe.isComposite(this.boundable1)||qe.isComposite(this.boundable2))},compareTo:function(t){var e=t;return this._distance<e._distance?-1:this._distance>e._distance?1:0},expand:function(t,e,n,i){for(var r=t.getChildBoundables(),s=r.iterator();s.hasNext();){var o=s.next(),a=new qe(o,e,this.itemDistance);a.getDistance()<i&&n.add(a)}},getBoundable:function(t){return 0===t?this.boundable1:this.boundable2},getDistance:function(){return this._distance},distance:function(){return this.isLeaves()?this.itemDistance.distance(this.boundable1,this.boundable2):this.boundable1.getBounds().distance(this.boundable2.getBounds())},interfaces_:function(){return[s]},getClass:function(){return qe}}),qe.area=function(t){return t.getBounds().getArea()},qe.isComposite=function(t){return t instanceof Ge},e(Be.prototype,{getNodeCapacity:function(){return this.nodeCapacity},lastNode:function(t){return t.get(t.size()-1)},size:function t(){if(0===arguments.length)return this.isEmpty()?0:(this.build(),this.size(this.root));if(1===arguments.length){for(var e=arguments[0],t=0,n=e.getChildBoundables().iterator();n.hasNext();){var i=n.next();i instanceof Ge?t+=this.size(i):i instanceof Me&&(t+=1)}return t}},removeItem:function(t,e){for(var n=null,i=t.getChildBoundables().iterator();i.hasNext();){var r=i.next();r instanceof Me&&r.getItem()===e&&(n=r)}return null!==n?(t.getChildBoundables().remove(n),!0):!1},itemsTree:function(){if(0===arguments.length){this.build();var t=this.itemsTree(this.root);return null===t?new I:t}if(1===arguments.length){for(var e=arguments[0],n=new I,i=e.getChildBoundables().iterator();i.hasNext();){var r=i.next();if(r instanceof Ge){var s=this.itemsTree(r);null!==s&&n.add(s)}else r instanceof Me?n.add(r.getItem()):f.shouldNeverReachHere()}return n.size()<=0?null:n}},insert:function(t,e){f.isTrue(!this.built,"Cannot insert items into an STR packed R-tree after it has been built."),this.itemBoundables.add(new Me(t,e))},boundablesAtLevel:function(){if(1===arguments.length){var t=arguments[0],e=new I;return this.boundablesAtLevel(t,this.root,e),e}if(3===arguments.length){var n=arguments[0],i=arguments[1],r=arguments[2];if(f.isTrue(n>-2),i.getLevel()===n)return r.add(i),null;for(var s=i.getChildBoundables().iterator();s.hasNext();){var o=s.next();o instanceof Ge?this.boundablesAtLevel(n,o,r):(f.isTrue(o instanceof Me),-1===n&&r.add(o))}return null}},query:function(){if(1===arguments.length){var t=arguments[0];this.build();var e=new I;return this.isEmpty()?e:(this.getIntersectsOp().intersects(this.root.getBounds(),t)&&this.query(t,this.root,e),e)}if(2===arguments.length){var n=arguments[0],i=arguments[1];if(this.build(),this.isEmpty())return null;this.getIntersectsOp().intersects(this.root.getBounds(),n)&&this.query(n,this.root,i)}else if(3===arguments.length)if(R(arguments[2],Ae)&&arguments[0]instanceof Object&&arguments[1]instanceof Ge)for(var r=arguments[0],s=arguments[1],o=arguments[2],a=s.getChildBoundables(),u=0;u<a.size();u++){var l=a.get(u);this.getIntersectsOp().intersects(l.getBounds(),r)&&(l instanceof Ge?this.query(r,l,o):l instanceof Me?o.visitItem(l.getItem()):f.shouldNeverReachHere())}else if(R(arguments[2],y)&&arguments[0]instanceof Object&&arguments[1]instanceof Ge)for(var h=arguments[0],c=arguments[1],g=arguments[2],a=c.getChildBoundables(),u=0;u<a.size();u++){var l=a.get(u);this.getIntersectsOp().intersects(l.getBounds(),h)&&(l instanceof Ge?this.query(h,l,g):l instanceof Me?g.add(l.getItem()):f.shouldNeverReachHere())}},build:function(){return this.built?null:(this.root=this.itemBoundables.isEmpty()?this.createNode(0):this.createHigherLevels(this.itemBoundables,-1),this.itemBoundables=null,void(this.built=!0))},getRoot:function(){return this.build(),this.root},remove:function(){if(2===arguments.length){var t=arguments[0],e=arguments[1];return this.build(),this.getIntersectsOp().intersects(this.root.getBounds(),t)?this.remove(t,this.root,e):!1}if(3===arguments.length){var n=arguments[0],i=arguments[1],r=arguments[2],s=this.removeItem(i,r);if(s)return!0;for(var o=null,a=i.getChildBoundables().iterator();a.hasNext();){var u=a.next();if(this.getIntersectsOp().intersects(u.getBounds(),n)&&u instanceof Ge&&(s=this.remove(n,u,r))){o=u;break}}return null!==o&&o.getChildBoundables().isEmpty()&&i.getChildBoundables().remove(o),s}},createHigherLevels:function(t,e){f.isTrue(!t.isEmpty());var n=this.createParentBoundables(t,e+1);return 1===n.size()?n.get(0):this.createHigherLevels(n,e+1)},depth:function(){if(0===arguments.length)return this.isEmpty()?0:(this.build(),this.depth(this.root));if(1===arguments.length){for(var t=arguments[0],e=0,n=t.getChildBoundables().iterator();n.hasNext();){var i=n.next();if(i instanceof Ge){var r=this.depth(i);r>e&&(e=r)}}return e+1}},createParentBoundables:function(t,e){f.isTrue(!t.isEmpty());var n=new I;n.add(this.createNode(e));var i=new I(t);ho.sort(i,this.getComparator());for(var r=i.iterator();r.hasNext();){var s=r.next();this.lastNode(n).getChildBoundables().size()===this.getNodeCapacity()&&n.add(this.createNode(e)),this.lastNode(n).addChildBoundable(s)}return n},isEmpty:function(){return this.built?this.root.isEmpty():this.itemBoundables.isEmpty()},interfaces_:function(){return[u]},getClass:function(){return Be}}),Be.compareDoubles=function(t,e){return t>e?1:e>t?-1:0},Be.IntersectsOp=ze,Be.serialVersionUID=-0x35ef64c82d4c5400,Be.DEFAULT_NODE_CAPACITY=10,e(Ve.prototype,{distance:function(t,e){},interfaces_:function(){return[]},getClass:function(){return Ve}}),h(ke,Be),e(ke.prototype,{createParentBoundablesFromVerticalSlices:function(t,e){f.isTrue(t.length>0);for(var n=new I,i=0;i<t.length;i++)n.addAll(this.createParentBoundablesFromVerticalSlice(t[i],e));return n},createNode:function(t){return new Ye(t)},size:function(){return 0===arguments.length?Be.prototype.size.call(this):Be.prototype.size.apply(this,arguments)},insert:function(){if(2!==arguments.length)return Be.prototype.insert.apply(this,arguments);var t=arguments[0],e=arguments[1];return t.isNull()?null:void Be.prototype.insert.call(this,t,e)},getIntersectsOp:function(){return ke.intersectsOp},verticalSlices:function(t,e){for(var n=Math.trunc(Math.ceil(t.size()/e)),i=new Array(e).fill(null),r=t.iterator(),s=0;e>s;s++){i[s]=new I;for(var o=0;r.hasNext()&&n>o;){var a=r.next();i[s].add(a),o++}}return i},query:function(){if(1===arguments.length){var t=arguments[0];return Be.prototype.query.call(this,t)}if(2===arguments.length){var e=arguments[0],n=arguments[1];Be.prototype.query.call(this,e,n)}else if(3===arguments.length)if(R(arguments[2],Ae)&&arguments[0]instanceof Object&&arguments[1]instanceof Ge){var i=arguments[0],r=arguments[1],s=arguments[2];Be.prototype.query.call(this,i,r,s)}else if(R(arguments[2],y)&&arguments[0]instanceof Object&&arguments[1]instanceof Ge){var o=arguments[0],a=arguments[1],u=arguments[2];Be.prototype.query.call(this,o,a,u)}},getComparator:function(){return ke.yComparator},createParentBoundablesFromVerticalSlice:function(t,e){return Be.prototype.createParentBoundables.call(this,t,e)},remove:function(){if(2===arguments.length){var t=arguments[0],e=arguments[1];return Be.prototype.remove.call(this,t,e)}return Be.prototype.remove.apply(this,arguments)},depth:function(){return 0===arguments.length?Be.prototype.depth.call(this):Be.prototype.depth.apply(this,arguments)},createParentBoundables:function(t,e){f.isTrue(!t.isEmpty());var n=Math.trunc(Math.ceil(t.size()/this.getNodeCapacity())),i=new I(t);ho.sort(i,ke.xComparator);var r=this.verticalSlices(i,Math.trunc(Math.ceil(Math.sqrt(n))));return this.createParentBoundablesFromVerticalSlices(r,e)},nearestNeighbour:function(){if(1===arguments.length){if(R(arguments[0],Ve)){var t=arguments[0],e=new qe(this.getRoot(),this.getRoot(),t);return this.nearestNeighbour(e)}if(arguments[0]instanceof qe){var n=arguments[0];return this.nearestNeighbour(n,r.POSITIVE_INFINITY)}}else if(2===arguments.length){if(arguments[0]instanceof ke&&R(arguments[1],Ve)){var i=arguments[0],s=arguments[1],e=new qe(this.getRoot(),i.getRoot(),s);return this.nearestNeighbour(e)}if(arguments[0]instanceof qe&&"number"==typeof arguments[1]){var o=arguments[0],a=arguments[1],u=a,l=null,h=new De;for(h.add(o);!h.isEmpty()&&u>0;){var c=h.poll(),f=c.getDistance();if(f>=u)break;c.isLeaves()?(u=f,l=c):c.expandToQueue(h,u)}return[l.getBoundable(0).getItem(),l.getBoundable(1).getItem()]}}else if(3===arguments.length){var g=arguments[0],d=arguments[1],p=arguments[2],v=new Me(g,d),e=new qe(this.getRoot(),v,p);return this.nearestNeighbour(e)[0]}},interfaces_:function(){return[Fe,u]},getClass:function(){return ke}}),ke.centreX=function(t){return ke.avg(t.getMinX(),t.getMaxX())},ke.avg=function(t,e){return(t+e)/2},ke.centreY=function(t){return ke.avg(t.getMinY(),t.getMaxY())},h(Ye,Ge),e(Ye.prototype,{computeBounds:function(){for(var t=null,e=this.getChildBoundables().iterator();e.hasNext();){var n=e.next();null===t?t=new C(n.getBounds()):t.expandToInclude(n.getBounds())}return t},interfaces_:function(){return[]},getClass:function(){return Ye}}),ke.STRtreeNode=Ye,ke.serialVersionUID=0x39920f7d5f261e0,ke.xComparator={interfaces_:function(){return[a]},compare:function(t,e){return Be.compareDoubles(ke.centreX(t.getBounds()),ke.centreX(e.getBounds()))}},ke.yComparator={interfaces_:function(){return[a]},compare:function(t,e){return Be.compareDoubles(ke.centreY(t.getBounds()),ke.centreY(e.getBounds()))}},ke.intersectsOp={interfaces_:function(){return[IntersectsOp]},intersects:function(t,e){return t.intersects(e)}},ke.DEFAULT_NODE_CAPACITY=10,e(Ue.prototype,{interfaces_:function(){return[]},getClass:function(){return Ue}}),Ue.relativeSign=function(t,e){return e>t?-1:t>e?1:0},Ue.compare=function(t,e,n){if(e.equals2D(n))return 0;var i=Ue.relativeSign(e.x,n.x),r=Ue.relativeSign(e.y,n.y);switch(t){case 0:return Ue.compareValue(i,r);case 1:return Ue.compareValue(r,i);case 2:return Ue.compareValue(r,-i);case 3:return Ue.compareValue(-i,r);case 4:return Ue.compareValue(-i,-r);case 5:return Ue.compareValue(-r,-i);case 6:return Ue.compareValue(-r,i);case 7:return Ue.compareValue(i,-r)}return f.shouldNeverReachHere("invalid octant value"),0},Ue.compareValue=function(t,e){return 0>t?-1:t>0?1:0>e?-1:e>0?1:0},e(Xe.prototype,{getCoordinate:function(){return this.coord},print:function(t){t.print(this.coord),t.print(" seg # = "+this.segmentIndex)},compareTo:function(t){var e=t;return this.segmentIndex<e.segmentIndex?-1:this.segmentIndex>e.segmentIndex?1:this.coord.equals2D(e.coord)?0:Ue.compare(this.segmentOctant,this.coord,e.coord)},isEndPoint:function(t){return 0!==this.segmentIndex||this._isInterior?this.segmentIndex===t:!0},isInterior:function(){return this._isInterior},interfaces_:function(){return[s]},getClass:function(){return Xe}}),e(He.prototype,{getSplitCoordinates:function(){var t=new N;this.addEndpoints();for(var e=this.iterator(),n=e.next();e.hasNext();){var i=e.next();this.addEdgeCoordinates(n,i,t),n=i}return t.toCoordinateArray()},addCollapsedNodes:function(){var t=new I;this.findCollapsesFromInsertedNodes(t),this.findCollapsesFromExistingVertices(t);for(var e=t.iterator();e.hasNext();){var n=e.next().intValue();this.add(this.edge.getCoordinate(n),n)}},print:function(t){t.println("Intersections:");for(var e=this.iterator();e.hasNext();){var n=e.next();n.print(t)}},findCollapsesFromExistingVertices:function(t){for(var e=0;e<this.edge.size()-2;e++){var n=this.edge.getCoordinate(e),i=(this.edge.getCoordinate(e+1),this.edge.getCoordinate(e+2));n.equals2D(i)&&t.add(new b(e+1))}},addEdgeCoordinates:function(t,e,n){var i=e.segmentIndex-t.segmentIndex+2,r=this.edge.getCoordinate(e.segmentIndex),s=e.isInterior()||!e.coord.equals2D(r);s||i--;n.add(new g(t.coord),!1);for(var o=t.segmentIndex+1;o<=e.segmentIndex;o++)n.add(this.edge.getCoordinate(o));s&&n.add(new g(e.coord))},iterator:function(){return this.nodeMap.values().iterator()},addSplitEdges:function(t){this.addEndpoints(),this.addCollapsedNodes();for(var e=this.iterator(),n=e.next();e.hasNext();){var i=e.next(),r=this.createSplitEdge(n,i);t.add(r),n=i}},findCollapseIndex:function(t,e,n){if(!t.coord.equals2D(e.coord))return!1;var i=e.segmentIndex-t.segmentIndex;return e.isInterior()||i--,1===i?(n[0]=t.segmentIndex+1,!0):!1},findCollapsesFromInsertedNodes:function(t){for(var e=new Array(1).fill(null),n=this.iterator(),i=n.next();n.hasNext();){var r=n.next(),s=this.findCollapseIndex(i,r,e);s&&t.add(new b(e[0])),i=r}},getEdge:function(){return this.edge},addEndpoints:function(){var t=this.edge.size()-1;this.add(this.edge.getCoordinate(0),0),this.add(this.edge.getCoordinate(t),t)},createSplitEdge:function(t,e){var n=e.segmentIndex-t.segmentIndex+2,i=this.edge.getCoordinate(e.segmentIndex),r=e.isInterior()||!e.coord.equals2D(i);r||n--;var s=new Array(n).fill(null),o=0;s[o++]=new g(t.coord);for(var a=t.segmentIndex+1;a<=e.segmentIndex;a++)s[o++]=this.edge.getCoordinate(a);return r&&(s[o]=new g(e.coord)),new Ke(s,this.edge.getData())},add:function(t,e){var n=new Xe(this.edge,t,e,this.edge.getSegmentOctant(e)),i=this.nodeMap.get(n);return null!==i?(f.isTrue(i.coord.equals2D(t),"Found equal nodes with different coordinates"),i):(this.nodeMap.put(n,n),n)},checkSplitEdgesCorrectness:function(t){var e=this.edge.getCoordinates(),n=t.get(0),i=n.getCoordinate(0);if(!i.equals2D(e[0]))throw new l("bad split edge start point at "+i);var r=t.get(t.size()-1),s=r.getCoordinates(),o=s[s.length-1];if(!o.equals2D(e[e.length-1]))throw new l("bad split edge end point at "+o)},interfaces_:function(){return[]},getClass:function(){return He}}),e(We.prototype,{next:function(){return null===this.currNode?(this.currNode=this.nextNode,this.currSegIndex=this.currNode.segmentIndex,this.readNextNode(),this.currNode):null===this.nextNode?null:this.nextNode.segmentIndex===this.currNode.segmentIndex?(this.currNode=this.nextNode,this.currSegIndex=this.currNode.segmentIndex,this.readNextNode(),this.currNode):(this.nextNode.segmentIndex>this.currNode.segmentIndex,null)},remove:function(){throw new UnsupportedOperationException(this.getClass().getName())},hasNext:function(){return null!==this.nextNode},readNextNode:function(){this.nodeIt.hasNext()?this.nextNode=this.nodeIt.next():this.nextNode=null},interfaces_:function(){return[p]},getClass:function(){return We}}),e(je.prototype,{addIntersection:function(t,e){},interfaces_:function(){return[be]},getClass:function(){return je}}),e(Ke.prototype,{getCoordinates:function(){return this.pts},size:function(){return this.pts.length},getCoordinate:function(t){return this.pts[t]},isClosed:function(){return this.pts[0].equals(this.pts[this.pts.length-1])},getSegmentOctant:function(t){return t===this.pts.length-1?-1:this.safeOctant(this.getCoordinate(t),this.getCoordinate(t+1))},setData:function(t){this.data=t},safeOctant:function(t,e){return t.equals2D(e)?0:Pe.octant(t,e)},getData:function(){return this.data},addIntersection:function(){if(2===arguments.length){var t=arguments[0],e=arguments[1];this.addIntersectionNode(t,e)}else if(4===arguments.length){var n=arguments[0],i=arguments[1],r=(arguments[2],arguments[3]),s=new g(n.getIntersection(r));this.addIntersection(s,i)}},toString:function(){return se.toLineString(new Gt(this.pts))},getNodeList:function(){return this.nodeList},addIntersectionNode:function(t,e){var n=e,i=n+1;if(i<this.pts.length){var r=this.pts[i];t.equals2D(r)&&(n=i)}var s=this.nodeList.add(t,n);return s},addIntersections:function(t,e,n){for(var i=0;i<t.getIntersectionNum();i++)this.addIntersection(t,e,n,i)},interfaces_:function(){return[je]},getClass:function(){return Ke}}),Ke.getNodedSubstrings=function(){if(1===arguments.length){var t=arguments[0],e=new I;return Ke.getNodedSubstrings(t,e),e}if(2===arguments.length)for(var n=arguments[0],i=arguments[1],r=n.iterator();r.hasNext();){var s=r.next();s.getNodeList().addSplitEdges(i)}},e(Ze.prototype,{overlap:function(){if(2===arguments.length){arguments[0],arguments[1]}else if(4===arguments.length){var t=arguments[0],e=arguments[1],n=arguments[2],i=arguments[3];t.getLineSegment(e,this.overlapSeg1),n.getLineSegment(i,this.overlapSeg2),this.overlap(this.overlapSeg1,this.overlapSeg2)}},interfaces_:function(){return[]},getClass:function(){return Ze}}),e(Qe.prototype,{getLineSegment:function(t,e){e.p0=this.pts[t],e.p1=this.pts[t+1]},computeSelect:function(t,e,n,i){var r=this.pts[e],s=this.pts[n];if(i.tempEnv1.init(r,s),n-e===1)return i.select(this,e),null;if(!t.intersects(i.tempEnv1))return null;var o=Math.trunc((e+n)/2);
o>e&&this.computeSelect(t,e,o,i),n>o&&this.computeSelect(t,o,n,i)},getCoordinates:function(){for(var t=new Array(this.end-this.start+1).fill(null),e=0,n=this.start;n<=this.end;n++)t[e++]=this.pts[n];return t},computeOverlaps:function(t,e){this.computeOverlapsInternal(this.start,this.end,t,t.start,t.end,e)},setId:function(t){this.id=t},select:function(t,e){this.computeSelect(t,this.start,this.end,e)},getEnvelope:function(){if(null===this.env){var t=this.pts[this.start],e=this.pts[this.end];this.env=new C(t,e)}return this.env},getEndIndex:function(){return this.end},getStartIndex:function(){return this.start},getContext:function(){return this.context},getId:function(){return this.id},computeOverlapsInternal:function(t,e,n,i,r,s){var o=this.pts[t],a=this.pts[e],u=n.pts[i],l=n.pts[r];if(e-t===1&&r-i===1)return s.overlap(this,t,n,i),null;if(s.tempEnv1.init(o,a),s.tempEnv2.init(u,l),!s.tempEnv1.intersects(s.tempEnv2))return null;var h=Math.trunc((t+e)/2),c=Math.trunc((i+r)/2);h>t&&(c>i&&this.computeOverlapsInternal(t,h,n,i,c,s),r>c&&this.computeOverlapsInternal(t,h,n,c,r,s)),e>h&&(c>i&&this.computeOverlapsInternal(h,e,n,i,c,s),r>c&&this.computeOverlapsInternal(h,e,n,c,r,s))},interfaces_:function(){return[]},getClass:function(){return Qe}}),e(Je.prototype,{interfaces_:function(){return[]},getClass:function(){return Je}}),Je.isNorthern=function(t){return t===Je.NE||t===Je.NW},Je.isOpposite=function(t,e){if(t===e)return!1;var n=(t-e+4)%4;return 2===n},Je.commonHalfPlane=function(t,e){if(t===e)return t;var n=(t-e+4)%4;if(2===n)return-1;var i=e>t?t:e,r=t>e?t:e;return 0===i&&3===r?3:i},Je.isInHalfPlane=function(t,e){return e===Je.SE?t===Je.SE||t===Je.SW:t===e||t===e+1},Je.quadrant=function(){if("number"==typeof arguments[0]&&"number"==typeof arguments[1]){var t=arguments[0],e=arguments[1];if(0===t&&0===e)throw new i("Cannot compute the quadrant for point ( "+t+", "+e+" )");return t>=0?e>=0?Je.NE:Je.SE:e>=0?Je.NW:Je.SW}if(arguments[0]instanceof g&&arguments[1]instanceof g){var n=arguments[0],r=arguments[1];if(r.x===n.x&&r.y===n.y)throw new i("Cannot compute the quadrant for two identical points "+n);return r.x>=n.x?r.y>=n.y?Je.NE:Je.SE:r.y>=n.y?Je.NW:Je.SW}},Je.NE=0,Je.NW=1,Je.SW=2,Je.SE=3,e($e.prototype,{interfaces_:function(){return[]},getClass:function(){return $e}}),$e.getChainStartIndices=function(t){var e=0,n=new I;n.add(new b(e));do{var i=$e.findChainEnd(t,e);n.add(new b(i)),e=i}while(e<t.length-1);var r=$e.toIntArray(n);return r},$e.findChainEnd=function(t,e){for(var n=e;n<t.length-1&&t[n].equals2D(t[n+1]);)n++;if(n>=t.length-1)return t.length-1;for(var i=Je.quadrant(t[n],t[n+1]),r=e+1;r<t.length;){if(!t[r-1].equals2D(t[r])){var s=Je.quadrant(t[r-1],t[r]);if(s!==i)break}r++}return r-1},$e.getChains=function(){if(1===arguments.length){var t=arguments[0];return $e.getChains(t,null)}if(2===arguments.length){for(var e=arguments[0],n=arguments[1],i=new I,r=$e.getChainStartIndices(e),s=0;s<r.length-1;s++){var o=new Qe(e,r[s],r[s+1],n);i.add(o)}return i}},$e.toIntArray=function(t){for(var e=new Array(t.size()).fill(null),n=0;n<e.length;n++)e[n]=t.get(n).intValue();return e},e(tn.prototype,{computeNodes:function(t){},getNodedSubstrings:function(){},interfaces_:function(){return[]},getClass:function(){return tn}}),e(en.prototype,{setSegmentIntersector:function(t){this.segInt=t},interfaces_:function(){return[tn]},getClass:function(){return en}}),h(nn,en),e(nn.prototype,{getMonotoneChains:function(){return this.monoChains},getNodedSubstrings:function(){return Ke.getNodedSubstrings(this.nodedSegStrings)},getIndex:function(){return this.index},add:function(t){for(var e=$e.getChains(t.getCoordinates(),t),n=e.iterator();n.hasNext();){var i=n.next();i.setId(this.idCounter++),this.index.insert(i.getEnvelope(),i),this.monoChains.add(i)}},computeNodes:function(t){this.nodedSegStrings=t;for(var e=t.iterator();e.hasNext();)this.add(e.next());this.intersectChains()},intersectChains:function(){for(var t=new rn(this.segInt),e=this.monoChains.iterator();e.hasNext();)for(var n=e.next(),i=this.index.query(n.getEnvelope()),r=i.iterator();r.hasNext();){var s=r.next();if(s.getId()>n.getId()&&(n.computeOverlaps(s,t),this.nOverlaps++),this.segInt.isDone())return null}},interfaces_:function(){return[]},getClass:function(){return nn}}),h(rn,Ze),e(rn.prototype,{overlap:function(){if(4!==arguments.length)return Ze.prototype.overlap.apply(this,arguments);var t=arguments[0],e=arguments[1],n=arguments[2],i=arguments[3],r=t.getContext(),s=n.getContext();this.si.processIntersections(r,e,s,i)},interfaces_:function(){return[]},getClass:function(){return rn}}),nn.SegmentOverlapAction=rn,h(sn,l),e(sn.prototype,{getCoordinate:function(){return this.pt},interfaces_:function(){return[]},getClass:function(){return sn}}),sn.msgWithCoord=function(t,e){return null!==e?t+" [ "+e+" ]":t},e(on.prototype,{processIntersections:function(t,e,n,i){},isDone:function(){},interfaces_:function(){return[]},getClass:function(){return on}}),e(an.prototype,{getInteriorIntersection:function(){return this.interiorIntersection},setCheckEndSegmentsOnly:function(t){this.isCheckEndSegmentsOnly=t},getIntersectionSegments:function(){return this.intSegments},count:function(){return this.intersectionCount},getIntersections:function(){return this.intersections},setFindAllIntersections:function(t){this.findAllIntersections=t},setKeepIntersections:function(t){this.keepIntersections=t},processIntersections:function(t,e,n,i){if(!this.findAllIntersections&&this.hasIntersection())return null;if(t===n&&e===i)return null;if(this.isCheckEndSegmentsOnly){var r=this.isEndSegment(t,e)||this.isEndSegment(n,i);if(!r)return null}var s=t.getCoordinates()[e],o=t.getCoordinates()[e+1],a=n.getCoordinates()[i],u=n.getCoordinates()[i+1];this.li.computeIntersection(s,o,a,u),this.li.hasIntersection()&&this.li.isInteriorIntersection()&&(this.intSegments=new Array(4).fill(null),this.intSegments[0]=s,this.intSegments[1]=o,this.intSegments[2]=a,this.intSegments[3]=u,this.interiorIntersection=this.li.getIntersection(0),this.keepIntersections&&this.intersections.add(this.interiorIntersection),this.intersectionCount++)},isEndSegment:function(t,e){return 0===e?!0:e>=t.size()-2},hasIntersection:function(){return null!==this.interiorIntersection},isDone:function(){return this.findAllIntersections?!1:null!==this.interiorIntersection},interfaces_:function(){return[on]},getClass:function(){return an}}),an.createAllIntersectionsFinder=function(t){var e=new an(t);return e.setFindAllIntersections(!0),e},an.createAnyIntersectionFinder=function(t){return new an(t)},an.createIntersectionCounter=function(t){var e=new an(t);return e.setFindAllIntersections(!0),e.setKeepIntersections(!1),e},e(un.prototype,{execute:function(){return null!==this.segInt?null:void this.checkInteriorIntersections()},getIntersections:function(){return this.segInt.getIntersections()},isValid:function(){return this.execute(),this._isValid},setFindAllIntersections:function(t){this.findAllIntersections=t},checkInteriorIntersections:function(){this._isValid=!0,this.segInt=new an(this.li),this.segInt.setFindAllIntersections(this.findAllIntersections);var t=new nn;return t.setSegmentIntersector(this.segInt),t.computeNodes(this.segStrings),this.segInt.hasIntersection()?(this._isValid=!1,null):void 0},checkValid:function(){if(this.execute(),!this._isValid)throw new sn(this.getErrorMessage(),this.segInt.getInteriorIntersection())},getErrorMessage:function(){if(this._isValid)return"no intersections found";var t=this.segInt.getIntersectionSegments();return"found non-noded intersection between "+se.toLineString(t[0],t[1])+" and "+se.toLineString(t[2],t[3])},interfaces_:function(){return[]},getClass:function(){return un}}),un.computeIntersections=function(t){var e=new un(t);return e.setFindAllIntersections(!0),e.isValid(),e.getIntersections()},e(ln.prototype,{checkValid:function(){this.nv.checkValid()},interfaces_:function(){return[]},getClass:function(){return ln}}),ln.toSegmentStrings=function(t){for(var e=new I,n=t.iterator();n.hasNext();){var i=n.next();e.add(new Oe(i.getCoordinates(),i))}return e},ln.checkValid=function(t){var e=new ln(t);e.checkValid()},e(hn.prototype,{map:function(t){for(var e=new I,n=0;n<t.getNumGeometries();n++){var i=this.mapOp.map(t.getGeometryN(n));i.isEmpty()||e.add(i)}return t.getFactory().createGeometryCollection(ie.toGeometryArray(e))},interfaces_:function(){return[]},getClass:function(){return hn}}),hn.map=function(t,e){var n=new hn(e);return n.map(t)},e(cn.prototype,{interfaces_:function(){return[]},getClass:function(){return cn}}),cn.opposite=function(t){return t===cn.LEFT?cn.RIGHT:t===cn.RIGHT?cn.LEFT:t},cn.ON=0,cn.LEFT=1,cn.RIGHT=2,e(fn.prototype,{setAllLocations:function(t){for(var e=0;e<this.location.length;e++)this.location[e]=t},isNull:function(){for(var t=0;t<this.location.length;t++)if(this.location[t]!==L.NONE)return!1;return!0},setAllLocationsIfNull:function(t){for(var e=0;e<this.location.length;e++)this.location[e]===L.NONE&&(this.location[e]=t)},isLine:function(){return 1===this.location.length},merge:function(t){if(t.location.length>this.location.length){var e=new Array(3).fill(null);e[cn.ON]=this.location[cn.ON],e[cn.LEFT]=L.NONE,e[cn.RIGHT]=L.NONE,this.location=e}for(var n=0;n<this.location.length;n++)this.location[n]===L.NONE&&n<t.location.length&&(this.location[n]=t.location[n])},getLocations:function(){return this.location},flip:function(){if(this.location.length<=1)return null;var t=this.location[cn.LEFT];this.location[cn.LEFT]=this.location[cn.RIGHT],this.location[cn.RIGHT]=t},toString:function(){var t=new P;return this.location.length>1&&t.append(L.toLocationSymbol(this.location[cn.LEFT])),t.append(L.toLocationSymbol(this.location[cn.ON])),this.location.length>1&&t.append(L.toLocationSymbol(this.location[cn.RIGHT])),t.toString()},setLocations:function(t,e,n){this.location[cn.ON]=t,this.location[cn.LEFT]=e,this.location[cn.RIGHT]=n},get:function(t){return t<this.location.length?this.location[t]:L.NONE},isArea:function(){return this.location.length>1},isAnyNull:function(){for(var t=0;t<this.location.length;t++)if(this.location[t]===L.NONE)return!0;return!1},setLocation:function(){if(1===arguments.length){var t=arguments[0];this.setLocation(cn.ON,t)}else if(2===arguments.length){var e=arguments[0],n=arguments[1];this.location[e]=n}},init:function(t){this.location=new Array(t).fill(null),this.setAllLocations(L.NONE)},isEqualOnSide:function(t,e){return this.location[e]===t.location[e]},allPositionsEqual:function(t){for(var e=0;e<this.location.length;e++)if(this.location[e]!==t)return!1;return!0},interfaces_:function(){return[]},getClass:function(){return fn}}),e(gn.prototype,{getGeometryCount:function(){var t=0;return this.elt[0].isNull()||t++,this.elt[1].isNull()||t++,t},setAllLocations:function(t,e){this.elt[t].setAllLocations(e)},isNull:function(t){return this.elt[t].isNull()},setAllLocationsIfNull:function(){if(1===arguments.length){var t=arguments[0];this.setAllLocationsIfNull(0,t),this.setAllLocationsIfNull(1,t)}else if(2===arguments.length){var e=arguments[0],n=arguments[1];this.elt[e].setAllLocationsIfNull(n)}},isLine:function(t){return this.elt[t].isLine()},merge:function(t){for(var e=0;2>e;e++)null===this.elt[e]&&null!==t.elt[e]?this.elt[e]=new fn(t.elt[e]):this.elt[e].merge(t.elt[e])},flip:function(){this.elt[0].flip(),this.elt[1].flip()},getLocation:function(){if(1===arguments.length){var t=arguments[0];return this.elt[t].get(cn.ON)}if(2===arguments.length){var e=arguments[0],n=arguments[1];return this.elt[e].get(n)}},toString:function(){var t=new P;return null!==this.elt[0]&&(t.append("A:"),t.append(this.elt[0].toString())),null!==this.elt[1]&&(t.append(" B:"),t.append(this.elt[1].toString())),t.toString()},isArea:function(){if(0===arguments.length)return this.elt[0].isArea()||this.elt[1].isArea();if(1===arguments.length){var t=arguments[0];return this.elt[t].isArea()}},isAnyNull:function(t){return this.elt[t].isAnyNull()},setLocation:function(){if(2===arguments.length){var t=arguments[0],e=arguments[1];this.elt[t].setLocation(cn.ON,e)}else if(3===arguments.length){var n=arguments[0],i=arguments[1],r=arguments[2];this.elt[n].setLocation(i,r)}},isEqualOnSide:function(t,e){return this.elt[0].isEqualOnSide(t.elt[0],e)&&this.elt[1].isEqualOnSide(t.elt[1],e)},allPositionsEqual:function(t,e){return this.elt[t].allPositionsEqual(e)},toLine:function(t){this.elt[t].isArea()&&(this.elt[t]=new fn(this.elt[t].location[0]))},interfaces_:function(){return[]},getClass:function(){return gn}}),gn.toLineLabel=function(t){for(var e=new gn(L.NONE),n=0;2>n;n++)e.setLocation(n,t.getLocation(n));return e},e(dn.prototype,{computeRing:function(){if(null!==this.ring)return null;for(var t=new Array(this.pts.size()).fill(null),e=0;e<this.pts.size();e++)t[e]=this.pts.get(e);this.ring=this.geometryFactory.createLinearRing(t),this._isHole=he.isCCW(this.ring.getCoordinates())},isIsolated:function(){return 1===this.label.getGeometryCount()},computePoints:function(t){this.startDe=t;var e=t,n=!0;do{if(null===e)throw new sn("Found null DirectedEdge");if(e.getEdgeRing()===this)throw new sn("Directed Edge visited twice during ring-building at "+e.getCoordinate());this.edges.add(e);var i=e.getLabel();f.isTrue(i.isArea()),this.mergeLabel(i),this.addPoints(e.getEdge(),e.isForward(),n),n=!1,this.setEdgeRing(e,this),e=this.getNext(e)}while(e!==this.startDe)},getLinearRing:function(){return this.ring},getCoordinate:function(t){return this.pts.get(t)},computeMaxNodeDegree:function(){this.maxNodeDegree=0;var t=this.startDe;do{var e=t.getNode(),n=e.getEdges().getOutgoingDegree(this);n>this.maxNodeDegree&&(this.maxNodeDegree=n),t=this.getNext(t)}while(t!==this.startDe);this.maxNodeDegree*=2},addPoints:function(t,e,n){var i=t.getCoordinates();if(e){var r=1;n&&(r=0);for(var s=r;s<i.length;s++)this.pts.add(i[s])}else{var r=i.length-2;n&&(r=i.length-1);for(var s=r;s>=0;s--)this.pts.add(i[s])}},isHole:function(){return this._isHole},setInResult:function(){var t=this.startDe;do t.getEdge().setInResult(!0),t=t.getNext();while(t!==this.startDe)},containsPoint:function(t){var e=this.getLinearRing(),n=e.getEnvelopeInternal();if(!n.contains(t))return!1;if(!he.isPointInRing(t,e.getCoordinates()))return!1;for(var i=this.holes.iterator();i.hasNext();){var r=i.next();if(r.containsPoint(t))return!1}return!0},addHole:function(t){this.holes.add(t)},isShell:function(){return null===this.shell},getLabel:function(){return this.label},getEdges:function(){return this.edges},getMaxNodeDegree:function(){return this.maxNodeDegree<0&&this.computeMaxNodeDegree(),this.maxNodeDegree},getShell:function(){return this.shell},mergeLabel:function(){if(1===arguments.length){var t=arguments[0];this.mergeLabel(t,0),this.mergeLabel(t,1)}else if(2===arguments.length){var e=arguments[0],n=arguments[1],i=e.getLocation(n,cn.RIGHT);if(i===L.NONE)return null;if(this.label.getLocation(n)===L.NONE)return this.label.setLocation(n,i),null}},setShell:function(t){this.shell=t,null!==t&&t.addHole(this)},toPolygon:function(t){for(var e=new Array(this.holes.size()).fill(null),n=0;n<this.holes.size();n++)e[n]=this.holes.get(n).getLinearRing();var i=t.createPolygon(this.getLinearRing(),e);return i},interfaces_:function(){return[]},getClass:function(){return dn}}),h(pn,dn),e(pn.prototype,{setEdgeRing:function(t,e){t.setMinEdgeRing(e)},getNext:function(t){return t.getNextMin()},interfaces_:function(){return[]},getClass:function(){return pn}}),h(vn,dn),e(vn.prototype,{buildMinimalRings:function(){var t=new I,e=this.startDe;do{if(null===e.getMinEdgeRing()){var n=new pn(e,this.geometryFactory);t.add(n)}e=e.getNext()}while(e!==this.startDe);return t},setEdgeRing:function(t,e){t.setEdgeRing(e)},linkDirectedEdgesForMinimalEdgeRings:function(){var t=this.startDe;do{var e=t.getNode();e.getEdges().linkMinimalDirectedEdges(this),t=t.getNext()}while(t!==this.startDe)},getNext:function(t){return t.getNext()},interfaces_:function(){return[]},getClass:function(){return vn}}),e(mn.prototype,{setVisited:function(t){this._isVisited=t},setInResult:function(t){this._isInResult=t},isCovered:function(){return this._isCovered},isCoveredSet:function(){return this._isCoveredSet},setLabel:function(t){this.label=t},getLabel:function(){return this.label},setCovered:function(t){this._isCovered=t,this._isCoveredSet=!0},updateIM:function(t){f.isTrue(this.label.getGeometryCount()>=2,"found partial label"),this.computeIM(t)},isInResult:function(){return this._isInResult},isVisited:function(){return this._isVisited},interfaces_:function(){return[]},getClass:function(){return mn}}),h(yn,mn),e(yn.prototype,{isIncidentEdgeInResult:function(){for(var t=this.getEdges().getEdges().iterator();t.hasNext();){var e=t.next();if(e.getEdge().isInResult())return!0}return!1},isIsolated:function(){return 1===this.label.getGeometryCount()},getCoordinate:function(){return this.coord},print:function(t){t.println("node "+this.coord+" lbl: "+this.label)},computeIM:function(t){},computeMergedLocation:function(t,e){var n=L.NONE;if(n=this.label.getLocation(e),!t.isNull(e)){var i=t.getLocation(e);n!==L.BOUNDARY&&(n=i)}return n},setLabel:function(){if(2!==arguments.length)return mn.prototype.setLabel.apply(this,arguments);var t=arguments[0],e=arguments[1];null===this.label?this.label=new gn(t,e):this.label.setLocation(t,e)},getEdges:function(){return this.edges},mergeLabel:function(){if(arguments[0]instanceof yn){var t=arguments[0];this.mergeLabel(t.label)}else if(arguments[0]instanceof gn)for(var e=arguments[0],n=0;2>n;n++){var i=this.computeMergedLocation(e,n),r=this.label.getLocation(n);r===L.NONE&&this.label.setLocation(n,i)}},add:function(t){this.edges.insert(t),t.setNode(this)},setLabelBoundary:function(t){if(null===this.label)return null;var e=L.NONE;null!==this.label&&(e=this.label.getLocation(t));var n=null;switch(e){case L.BOUNDARY:n=L.INTERIOR;break;case L.INTERIOR:n=L.BOUNDARY;break;default:n=L.BOUNDARY}this.label.setLocation(t,n)},interfaces_:function(){return[]},getClass:function(){return yn}}),e(xn.prototype,{find:function(t){return this.nodeMap.get(t)},addNode:function(){if(arguments[0]instanceof g){var t=arguments[0],e=this.nodeMap.get(t);return null===e&&(e=this.nodeFact.createNode(t),this.nodeMap.put(t,e)),e}if(arguments[0]instanceof yn){var n=arguments[0],e=this.nodeMap.get(n.getCoordinate());return null===e?(this.nodeMap.put(n.getCoordinate(),n),n):(e.mergeLabel(n),e)}},print:function(t){for(var e=this.iterator();e.hasNext();){var n=e.next();n.print(t)}},iterator:function(){return this.nodeMap.values().iterator()},values:function(){return this.nodeMap.values()},getBoundaryNodes:function(t){for(var e=new I,n=this.iterator();n.hasNext();){var i=n.next();i.getLabel().getLocation(t)===L.BOUNDARY&&e.add(i)}return e},add:function(t){var e=t.getCoordinate(),n=this.addNode(e);n.add(t)},interfaces_:function(){return[]},getClass:function(){return xn}}),e(En.prototype,{compareDirection:function(t){return this.dx===t.dx&&this.dy===t.dy?0:this.quadrant>t.quadrant?1:this.quadrant<t.quadrant?-1:he.computeOrientation(t.p0,t.p1,this.p1)},getDy:function(){return this.dy},getCoordinate:function(){return this.p0},setNode:function(t){this.node=t},print:function(t){var e=Math.atan2(this.dy,this.dx),n=this.getClass().getName(),i=n.lastIndexOf("."),r=n.substring(i+1);t.print("  "+r+": "+this.p0+" - "+this.p1+" "+this.quadrant+":"+e+"   "+this.label)},compareTo:function(t){var e=t;return this.compareDirection(e)},getDirectedCoordinate:function(){return this.p1},getDx:function(){return this.dx},getLabel:function(){return this.label},getEdge:function(){return this.edge},getQuadrant:function(){return this.quadrant},getNode:function(){return this.node},toString:function(){var t=Math.atan2(this.dy,this.dx),e=this.getClass().getName(),n=e.lastIndexOf("."),i=e.substring(n+1);return"  "+i+": "+this.p0+" - "+this.p1+" "+this.quadrant+":"+t+"   "+this.label},computeLabel:function(t){},init:function(t,e){this.p0=t,this.p1=e,this.dx=e.x-t.x,this.dy=e.y-t.y,this.quadrant=Je.quadrant(this.dx,this.dy),f.isTrue(!(0===this.dx&&0===this.dy),"EdgeEnd with identical endpoints found")},interfaces_:function(){return[s]},getClass:function(){return En}}),h(In,En),e(In.prototype,{getNextMin:function(){return this.nextMin},getDepth:function(t){return this.depth[t]},setVisited:function(t){this._isVisited=t},computeDirectedLabel:function(){this.label=new gn(this.edge.getLabel()),this._isForward||this.label.flip()},getNext:function(){return this.next},setDepth:function(t,e){if(-999!==this.depth[t]&&this.depth[t]!==e)throw new sn("assigned depths do not match",this.getCoordinate());this.depth[t]=e},isInteriorAreaEdge:function t(){for(var t=!0,e=0;2>e;e++)this.label.isArea(e)&&this.label.getLocation(e,cn.LEFT)===L.INTERIOR&&this.label.getLocation(e,cn.RIGHT)===L.INTERIOR||(t=!1);return t},setNextMin:function(t){this.nextMin=t},print:function(t){En.prototype.print.call(this,t),t.print(" "+this.depth[cn.LEFT]+"/"+this.depth[cn.RIGHT]),t.print(" ("+this.getDepthDelta()+")"),this._isInResult&&t.print(" inResult")},setMinEdgeRing:function(t){this.minEdgeRing=t},isLineEdge:function(){var t=this.label.isLine(0)||this.label.isLine(1),e=!this.label.isArea(0)||this.label.allPositionsEqual(0,L.EXTERIOR),n=!this.label.isArea(1)||this.label.allPositionsEqual(1,L.EXTERIOR);return t&&e&&n},setEdgeRing:function(t){this.edgeRing=t},getMinEdgeRing:function(){return this.minEdgeRing},getDepthDelta:function(){var t=this.edge.getDepthDelta();return this._isForward||(t=-t),t},setInResult:function(t){this._isInResult=t},getSym:function(){return this.sym},isForward:function(){return this._isForward},getEdge:function(){return this.edge},printEdge:function(t){this.print(t),t.print(" "),this._isForward?this.edge.print(t):this.edge.printReverse(t)},setSym:function(t){this.sym=t},setVisitedEdge:function(t){this.setVisited(t),this.sym.setVisited(t)},setEdgeDepths:function(t,e){var n=this.getEdge().getDepthDelta();this._isForward||(n=-n);var i=1;t===cn.LEFT&&(i=-1);var r=cn.opposite(t),s=n*i,o=e+s;this.setDepth(t,e),this.setDepth(r,o)},getEdgeRing:function(){return this.edgeRing},isInResult:function(){return this._isInResult},setNext:function(t){this.next=t},isVisited:function(){return this._isVisited},interfaces_:function(){return[]},getClass:function(){return In}}),In.depthFactor=function(t,e){return t===L.EXTERIOR&&e===L.INTERIOR?1:t===L.INTERIOR&&e===L.EXTERIOR?-1:0},e(Nn.prototype,{createNode:function(t){return new yn(t,null)},interfaces_:function(){return[]},getClass:function(){return Nn}}),e(Cn.prototype,{printEdges:function(t){t.println("Edges:");for(var e=0;e<this.edges.size();e++){t.println("edge "+e+":");var n=this.edges.get(e);n.print(t),n.eiList.print(t)}},find:function(t){return this.nodes.find(t)},addNode:function(){if(arguments[0]instanceof yn){var t=arguments[0];return this.nodes.addNode(t)}if(arguments[0]instanceof g){var e=arguments[0];return this.nodes.addNode(e)}},getNodeIterator:function(){return this.nodes.iterator()},linkResultDirectedEdges:function(){for(var t=this.nodes.iterator();t.hasNext();){var e=t.next();e.getEdges().linkResultDirectedEdges()}},debugPrintln:function(t){A.out.println(t)},isBoundaryNode:function(t,e){var n=this.nodes.find(e);if(null===n)return!1;var i=n.getLabel();return null!==i&&i.getLocation(t)===L.BOUNDARY},linkAllDirectedEdges:function(){for(var t=this.nodes.iterator();t.hasNext();){var e=t.next();e.getEdges().linkAllDirectedEdges()}},matchInSameDirection:function(t,e,n,i){return t.equals(n)?he.computeOrientation(t,e,i)===he.COLLINEAR&&Je.quadrant(t,e)===Je.quadrant(n,i):!1},getEdgeEnds:function(){return this.edgeEndList},debugPrint:function(t){A.out.print(t)},getEdgeIterator:function(){return this.edges.iterator()},findEdgeInSameDirection:function(t,e){for(var n=0;n<this.edges.size();n++){var i=this.edges.get(n),r=i.getCoordinates();if(this.matchInSameDirection(t,e,r[0],r[1]))return i;if(this.matchInSameDirection(t,e,r[r.length-1],r[r.length-2]))return i}return null},insertEdge:function(t){this.edges.add(t)},findEdgeEnd:function(t){for(var e=this.getEdgeEnds().iterator();e.hasNext();){var n=e.next();if(n.getEdge()===t)return n}return null},addEdges:function(t){for(var e=t.iterator();e.hasNext();){var n=e.next();this.edges.add(n);var i=new In(n,!0),r=new In(n,!1);i.setSym(r),r.setSym(i),this.add(i),this.add(r)}},add:function(t){this.nodes.add(t),this.edgeEndList.add(t)},getNodes:function(){return this.nodes.values()},findEdge:function(t,e){for(var n=0;n<this.edges.size();n++){var i=this.edges.get(n),r=i.getCoordinates();if(t.equals(r[0])&&e.equals(r[1]))return i}return null},interfaces_:function(){return[]},getClass:function(){return Cn}}),Cn.linkResultDirectedEdges=function(t){for(var e=t.iterator();e.hasNext();){var n=e.next();n.getEdges().linkResultDirectedEdges()}},e(Sn.prototype,{sortShellsAndHoles:function(t,e,n){for(var i=t.iterator();i.hasNext();){var r=i.next();r.isHole()?n.add(r):e.add(r)}},computePolygons:function(t){for(var e=new I,n=t.iterator();n.hasNext();){var i=n.next(),r=i.toPolygon(this.geometryFactory);e.add(r)}return e},placeFreeHoles:function(t,e){for(var n=e.iterator();n.hasNext();){var i=n.next();if(null===i.getShell()){var r=this.findEdgeRingContaining(i,t);if(null===r)throw new sn("unable to assign hole to a shell",i.getCoordinate(0));i.setShell(r)}}},buildMinimalEdgeRings:function(t,e,n){for(var i=new I,r=t.iterator();r.hasNext();){var s=r.next();if(s.getMaxNodeDegree()>2){s.linkDirectedEdgesForMinimalEdgeRings();var o=s.buildMinimalRings(),a=this.findShell(o);null!==a?(this.placePolygonHoles(a,o),e.add(a)):n.addAll(o)}else i.add(s)}return i},containsPoint:function(t){for(var e=this.shellList.iterator();e.hasNext();){var n=e.next();if(n.containsPoint(t))return!0}return!1},buildMaximalEdgeRings:function(t){for(var e=new I,n=t.iterator();n.hasNext();){var i=n.next();if(i.isInResult()&&i.getLabel().isArea()&&null===i.getEdgeRing()){var r=new vn(i,this.geometryFactory);e.add(r),r.setInResult()}}return e},placePolygonHoles:function(t,e){for(var n=e.iterator();n.hasNext();){var i=n.next();i.isHole()&&i.setShell(t)}},getPolygons:function(){var t=this.computePolygons(this.shellList);return t},findEdgeRingContaining:function(t,e){for(var n=t.getLinearRing(),i=n.getEnvelopeInternal(),r=n.getCoordinateN(0),s=null,o=null,a=e.iterator();a.hasNext();){var u=a.next(),l=u.getLinearRing(),h=l.getEnvelopeInternal();null!==s&&(o=s.getLinearRing().getEnvelopeInternal());var c=!1;h.contains(i)&&he.isPointInRing(r,l.getCoordinates())&&(c=!0),c&&(null===s||o.contains(h))&&(s=u)}return s},findShell:function(t){for(var e=0,n=null,i=t.iterator();i.hasNext();){var r=i.next();r.isHole()||(n=r,e++)}return f.isTrue(1>=e,"found two shells in MinimalEdgeRing list"),n},add:function(){if(1===arguments.length){var t=arguments[0];this.add(t.getEdgeEnds(),t.getNodes())}else if(2===arguments.length){var e=arguments[0],n=arguments[1];Cn.linkResultDirectedEdges(n);var i=this.buildMaximalEdgeRings(e),r=new I,s=this.buildMinimalEdgeRings(i,this.shellList,r);this.sortShellsAndHoles(s,this.shellList,r),this.placeFreeHoles(this.shellList,r)}},interfaces_:function(){return[]},getClass:function(){return Sn}}),e(wn.prototype,{collectLines:function(t){for(var e=this.op.getGraph().getEdgeEnds().iterator();e.hasNext();){var n=e.next();this.collectLineEdge(n,t,this.lineEdgesList),this.collectBoundaryTouchEdge(n,t,this.lineEdgesList)}},labelIsolatedLine:function(t,e){var n=this.ptLocator.locate(t.getCoordinate(),this.op.getArgGeometry(e));t.getLabel().setLocation(e,n)},build:function(t){return this.findCoveredLineEdges(),this.collectLines(t),this.buildLines(t),this.resultLineList},collectLineEdge:function(t,e,n){var i=t.getLabel(),r=t.getEdge();t.isLineEdge()&&(t.isVisited()||!ii.isResultOfOp(i,e)||r.isCovered()||(n.add(r),t.setVisitedEdge(!0)))},findCoveredLineEdges:function(){for(var t=this.op.getGraph().getNodes().iterator();t.hasNext();){var e=t.next();e.getEdges().findCoveredLineEdges()}for(var n=this.op.getGraph().getEdgeEnds().iterator();n.hasNext();){var i=n.next(),r=i.getEdge();if(i.isLineEdge()&&!r.isCoveredSet()){var s=this.op.isCoveredByA(i.getCoordinate());r.setCovered(s)}}},labelIsolatedLines:function(t){for(var e=t.iterator();e.hasNext();){var n=e.next(),i=n.getLabel();n.isIsolated()&&(i.isNull(0)?this.labelIsolatedLine(n,0):this.labelIsolatedLine(n,1))}},buildLines:function(t){for(var e=this.lineEdgesList.iterator();e.hasNext();){var n=e.next(),i=(n.getLabel(),this.geometryFactory.createLineString(n.getCoordinates()));this.resultLineList.add(i),n.setInResult(!0)}},collectBoundaryTouchEdge:function(t,e,n){var i=t.getLabel();return t.isLineEdge()?null:t.isVisited()?null:t.isInteriorAreaEdge()?null:t.getEdge().isInResult()?null:(f.isTrue(!(t.isInResult()||t.getSym().isInResult())||!t.getEdge().isInResult()),void(ii.isResultOfOp(i,e)&&e===ii.INTERSECTION&&(n.add(t.getEdge()),t.setVisitedEdge(!0))))},interfaces_:function(){return[]},getClass:function(){return wn}}),e(Ln.prototype,{filterCoveredNodeToPoint:function(t){var e=t.getCoordinate();if(!this.op.isCoveredByLA(e)){var n=this.geometryFactory.createPoint(e);this.resultPointList.add(n)}},extractNonCoveredResultNodes:function(t){for(var e=this.op.getGraph().getNodes().iterator();e.hasNext();){var n=e.next();if(!(n.isInResult()||n.isIncidentEdgeInResult()||0!==n.getEdges().getDegree()&&t!==ii.INTERSECTION)){var i=n.getLabel();ii.isResultOfOp(i,t)&&this.filterCoveredNodeToPoint(n)}}},build:function(t){return this.extractNonCoveredResultNodes(t),this.resultPointList},interfaces_:function(){return[]},getClass:function(){return Ln}}),e(Rn.prototype,{locate:function(t){},interfaces_:function(){return[]},getClass:function(){return Rn}}),e(Tn.prototype,{locate:function(t){return Tn.locate(t,this.geom)},interfaces_:function(){return[Rn]},getClass:function(){return Tn}}),Tn.isPointInRing=function(t,e){return e.getEnvelopeInternal().intersects(t)?he.isPointInRing(t,e.getCoordinates()):!1},Tn.containsPointInPolygon=function(t,e){if(e.isEmpty())return!1;var n=e.getExteriorRing();if(!Tn.isPointInRing(t,n))return!1;for(var i=0;i<e.getNumInteriorRing();i++){var r=e.getInteriorRingN(i);if(Tn.isPointInRing(t,r))return!1}return!0},Tn.containsPoint=function(t,e){if(e instanceof Tt)return Tn.containsPointInPolygon(t,e);if(e instanceof ft)for(var n=new Re(e);n.hasNext();){var i=n.next();if(i!==e&&Tn.containsPoint(t,i))return!0}return!1},Tn.locate=function(t,e){return e.isEmpty()?L.EXTERIOR:Tn.containsPoint(t,e)?L.INTERIOR:L.EXTERIOR},e(Pn.prototype,{getNextCW:function(t){this.getEdges();var e=this.edgeList.indexOf(t),n=e-1;return 0===e&&(n=this.edgeList.size()-1),this.edgeList.get(n)},propagateSideLabels:function(t){for(var e=L.NONE,n=this.iterator();n.hasNext();){var i=n.next(),r=i.getLabel();r.isArea(t)&&r.getLocation(t,cn.LEFT)!==L.NONE&&(e=r.getLocation(t,cn.LEFT))}if(e===L.NONE)return null;for(var s=e,n=this.iterator();n.hasNext();){var i=n.next(),r=i.getLabel();if(r.getLocation(t,cn.ON)===L.NONE&&r.setLocation(t,cn.ON,s),r.isArea(t)){var o=r.getLocation(t,cn.LEFT),a=r.getLocation(t,cn.RIGHT);if(a!==L.NONE){if(a!==s)throw new sn("side location conflict",i.getCoordinate());o===L.NONE&&f.shouldNeverReachHere("found single null side (at "+i.getCoordinate()+")"),s=o}else f.isTrue(r.getLocation(t,cn.LEFT)===L.NONE,"found single null side"),r.setLocation(t,cn.RIGHT,s),r.setLocation(t,cn.LEFT,s)}}},getCoordinate:function(){var t=this.iterator();if(!t.hasNext())return null;var e=t.next();return e.getCoordinate()},print:function(t){A.out.println("EdgeEndStar:   "+this.getCoordinate());for(var e=this.iterator();e.hasNext();){var n=e.next();n.print(t)}},isAreaLabelsConsistent:function(t){return this.computeEdgeEndLabels(t.getBoundaryNodeRule()),this.checkAreaLabelsConsistent(0)},checkAreaLabelsConsistent:function(t){var e=this.getEdges();if(e.size()<=0)return!0;var n=e.size()-1,i=e.get(n).getLabel(),r=i.getLocation(t,cn.LEFT);f.isTrue(r!==L.NONE,"Found unlabelled area edge");for(var s=r,o=this.iterator();o.hasNext();){var a=o.next(),u=a.getLabel();
f.isTrue(u.isArea(t),"Found non-area edge");var l=u.getLocation(t,cn.LEFT),h=u.getLocation(t,cn.RIGHT);if(l===h)return!1;if(h!==s)return!1;s=l}return!0},findIndex:function(t){this.iterator();for(var e=0;e<this.edgeList.size();e++){var n=this.edgeList.get(e);if(n===t)return e}return-1},iterator:function(){return this.getEdges().iterator()},getEdges:function(){return null===this.edgeList&&(this.edgeList=new I(this.edgeMap.values())),this.edgeList},getLocation:function(t,e,n){return this.ptInAreaLocation[t]===L.NONE&&(this.ptInAreaLocation[t]=Tn.locate(e,n[t].getGeometry())),this.ptInAreaLocation[t]},toString:function(){var t=new P;t.append("EdgeEndStar:   "+this.getCoordinate()),t.append("\n");for(var e=this.iterator();e.hasNext();){var n=e.next();t.append(n),t.append("\n")}return t.toString()},computeEdgeEndLabels:function(t){for(var e=this.iterator();e.hasNext();){var n=e.next();n.computeLabel(t)}},computeLabelling:function(t){this.computeEdgeEndLabels(t[0].getBoundaryNodeRule()),this.propagateSideLabels(0),this.propagateSideLabels(1);for(var e=[!1,!1],n=this.iterator();n.hasNext();)for(var i=n.next(),r=i.getLabel(),s=0;2>s;s++)r.isLine(s)&&r.getLocation(s)===L.BOUNDARY&&(e[s]=!0);for(var n=this.iterator();n.hasNext();)for(var i=n.next(),r=i.getLabel(),s=0;2>s;s++)if(r.isAnyNull(s)){var o=L.NONE;if(e[s])o=L.EXTERIOR;else{var a=i.getCoordinate();o=this.getLocation(s,a,t)}r.setAllLocationsIfNull(s,o)}},getDegree:function(){return this.edgeMap.size()},insertEdgeEnd:function(t,e){this.edgeMap.put(t,e),this.edgeList=null},interfaces_:function(){return[]},getClass:function(){return Pn}}),h(bn,Pn),e(bn.prototype,{linkResultDirectedEdges:function(){this.getResultAreaEdges();for(var t=null,e=null,n=this.SCANNING_FOR_INCOMING,i=0;i<this.resultAreaEdgeList.size();i++){var r=this.resultAreaEdgeList.get(i),s=r.getSym();if(r.getLabel().isArea())switch(null===t&&r.isInResult()&&(t=r),n){case this.SCANNING_FOR_INCOMING:if(!s.isInResult())continue;e=s,n=this.LINKING_TO_OUTGOING;break;case this.LINKING_TO_OUTGOING:if(!r.isInResult())continue;e.setNext(r),n=this.SCANNING_FOR_INCOMING}}if(n===this.LINKING_TO_OUTGOING){if(null===t)throw new sn("no outgoing dirEdge found",this.getCoordinate());f.isTrue(t.isInResult(),"unable to link last incoming dirEdge"),e.setNext(t)}},insert:function(t){var e=t;this.insertEdgeEnd(e,e)},getRightmostEdge:function(){var t=this.getEdges(),e=t.size();if(1>e)return null;var n=t.get(0);if(1===e)return n;var i=t.get(e-1),r=n.getQuadrant(),s=i.getQuadrant();if(Je.isNorthern(r)&&Je.isNorthern(s))return n;if(!Je.isNorthern(r)&&!Je.isNorthern(s))return i;return 0!==n.getDy()?n:0!==i.getDy()?i:(f.shouldNeverReachHere("found two horizontal edges incident on node"),null)},print:function(t){A.out.println("DirectedEdgeStar: "+this.getCoordinate());for(var e=this.iterator();e.hasNext();){var n=e.next();t.print("out "),n.print(t),t.println(),t.print("in "),n.getSym().print(t),t.println()}},getResultAreaEdges:function(){if(null!==this.resultAreaEdgeList)return this.resultAreaEdgeList;this.resultAreaEdgeList=new I;for(var t=this.iterator();t.hasNext();){var e=t.next();(e.isInResult()||e.getSym().isInResult())&&this.resultAreaEdgeList.add(e)}return this.resultAreaEdgeList},updateLabelling:function(t){for(var e=this.iterator();e.hasNext();){var n=e.next(),i=n.getLabel();i.setAllLocationsIfNull(0,t.getLocation(0)),i.setAllLocationsIfNull(1,t.getLocation(1))}},linkAllDirectedEdges:function(){this.getEdges();for(var t=null,e=null,n=this.edgeList.size()-1;n>=0;n--){var i=this.edgeList.get(n),r=i.getSym();null===e&&(e=r),null!==t&&r.setNext(t),t=i}e.setNext(t)},computeDepths:function(){if(1===arguments.length){var t=arguments[0],e=this.findIndex(t),n=(t.getLabel(),t.getDepth(cn.LEFT)),i=t.getDepth(cn.RIGHT),r=this.computeDepths(e+1,this.edgeList.size(),n),s=this.computeDepths(0,e,r);if(s!==i)throw new sn("depth mismatch at "+t.getCoordinate())}else if(3===arguments.length){for(var o=arguments[0],a=arguments[1],u=arguments[2],l=u,h=o;a>h;h++){var c=this.edgeList.get(h);c.getLabel();c.setEdgeDepths(cn.RIGHT,l),l=c.getDepth(cn.LEFT)}return l}},mergeSymLabels:function(){for(var t=this.iterator();t.hasNext();){var e=t.next(),n=e.getLabel();n.merge(e.getSym().getLabel())}},linkMinimalDirectedEdges:function(t){for(var e=null,n=null,i=this.SCANNING_FOR_INCOMING,r=this.resultAreaEdgeList.size()-1;r>=0;r--){var s=this.resultAreaEdgeList.get(r),o=s.getSym();switch(null===e&&s.getEdgeRing()===t&&(e=s),i){case this.SCANNING_FOR_INCOMING:if(o.getEdgeRing()!==t)continue;n=o,i=this.LINKING_TO_OUTGOING;break;case this.LINKING_TO_OUTGOING:if(s.getEdgeRing()!==t)continue;n.setNextMin(s),i=this.SCANNING_FOR_INCOMING}}i===this.LINKING_TO_OUTGOING&&(f.isTrue(null!==e,"found null for first outgoing dirEdge"),f.isTrue(e.getEdgeRing()===t,"unable to link last incoming dirEdge"),n.setNextMin(e))},getOutgoingDegree:function(){if(0===arguments.length){for(var t=0,e=this.iterator();e.hasNext();){var n=e.next();n.isInResult()&&t++}return t}if(1===arguments.length){for(var i=arguments[0],t=0,e=this.iterator();e.hasNext();){var n=e.next();n.getEdgeRing()===i&&t++}return t}},getLabel:function(){return this.label},findCoveredLineEdges:function(){for(var t=L.NONE,e=this.iterator();e.hasNext();){var n=e.next(),i=n.getSym();if(!n.isLineEdge()){if(n.isInResult()){t=L.INTERIOR;break}if(i.isInResult()){t=L.EXTERIOR;break}}}if(t===L.NONE)return null;for(var r=t,e=this.iterator();e.hasNext();){var n=e.next(),i=n.getSym();n.isLineEdge()?n.getEdge().setCovered(r===L.INTERIOR):(n.isInResult()&&(r=L.EXTERIOR),i.isInResult()&&(r=L.INTERIOR))}},computeLabelling:function(t){Pn.prototype.computeLabelling.call(this,t),this.label=new gn(L.NONE);for(var e=this.iterator();e.hasNext();)for(var n=e.next(),i=n.getEdge(),r=i.getLabel(),s=0;2>s;s++){var o=r.getLocation(s);o!==L.INTERIOR&&o!==L.BOUNDARY||this.label.setLocation(s,L.INTERIOR)}},interfaces_:function(){return[]},getClass:function(){return bn}}),h(On,Nn),e(On.prototype,{createNode:function(t){return new yn(t,new bn)},interfaces_:function(){return[]},getClass:function(){return On}}),e(_n.prototype,{computeIntersections:function(t,e){this.mce.computeIntersectsForChain(this.chainIndex,t.mce,t.chainIndex,e)},interfaces_:function(){return[]},getClass:function(){return _n}}),e(Mn.prototype,{isDelete:function(){return this.eventType===Mn.DELETE},setDeleteEventIndex:function(t){this.deleteEventIndex=t},getObject:function(){return this.obj},compareTo:function(t){var e=t;return this.xValue<e.xValue?-1:this.xValue>e.xValue?1:this.eventType<e.eventType?-1:this.eventType>e.eventType?1:0},getInsertEvent:function(){return this.insertEvent},isInsert:function(){return this.eventType===Mn.INSERT},isSameLabel:function(t){return null===this.label?!1:this.label===t.label},getDeleteEventIndex:function(){return this.deleteEventIndex},interfaces_:function(){return[s]},getClass:function(){return Mn}}),Mn.INSERT=1,Mn.DELETE=2,e(Dn.prototype,{interfaces_:function(){return[]},getClass:function(){return Dn}}),e(An.prototype,{isTrivialIntersection:function(t,e,n,i){if(t===n&&1===this.li.getIntersectionNum()){if(An.isAdjacentSegments(e,i))return!0;if(t.isClosed()){var r=t.getNumPoints()-1;if(0===e&&i===r||0===i&&e===r)return!0}}return!1},getProperIntersectionPoint:function(){return this.properIntersectionPoint},setIsDoneIfProperInt:function(t){this.isDoneWhenProperInt=t},hasProperInteriorIntersection:function(){return this.hasProperInterior},isBoundaryPointInternal:function(t,e){for(var n=e.iterator();n.hasNext();){var i=n.next(),r=i.getCoordinate();if(t.isIntersection(r))return!0}return!1},hasProperIntersection:function(){return this.hasProper},hasIntersection:function(){return this._hasIntersection},isDone:function(){return this._isDone},isBoundaryPoint:function(t,e){return null===e?!1:this.isBoundaryPointInternal(t,e[0])?!0:!!this.isBoundaryPointInternal(t,e[1])},setBoundaryNodes:function(t,e){this.bdyNodes=new Array(2).fill(null),this.bdyNodes[0]=t,this.bdyNodes[1]=e},addIntersections:function(t,e,n,i){if(t===n&&e===i)return null;this.numTests++;var r=t.getCoordinates()[e],s=t.getCoordinates()[e+1],o=n.getCoordinates()[i],a=n.getCoordinates()[i+1];this.li.computeIntersection(r,s,o,a),this.li.hasIntersection()&&(this.recordIsolated&&(t.setIsolated(!1),n.setIsolated(!1)),this.numIntersections++,this.isTrivialIntersection(t,e,n,i)||(this._hasIntersection=!0,!this.includeProper&&this.li.isProper()||(t.addIntersections(this.li,e,0),n.addIntersections(this.li,i,1)),this.li.isProper()&&(this.properIntersectionPoint=this.li.getIntersection(0).copy(),this.hasProper=!0,this.isDoneWhenProperInt&&(this._isDone=!0),this.isBoundaryPoint(this.li,this.bdyNodes)||(this.hasProperInterior=!0))))},interfaces_:function(){return[]},getClass:function(){return An}}),An.isAdjacentSegments=function(t,e){return 1===Math.abs(t-e)},h(Fn,Dn),e(Fn.prototype,{prepareEvents:function(){ho.sort(this.events);for(var t=0;t<this.events.size();t++){var e=this.events.get(t);e.isDelete()&&e.getInsertEvent().setDeleteEventIndex(t)}},computeIntersections:function(){if(1===arguments.length){var t=arguments[0];this.nOverlaps=0,this.prepareEvents();for(var e=0;e<this.events.size();e++){var n=this.events.get(e);if(n.isInsert()&&this.processOverlaps(e,n.getDeleteEventIndex(),n,t),t.isDone())break}}else if(3===arguments.length)if(arguments[2]instanceof An&&R(arguments[0],y)&&R(arguments[1],y)){var i=arguments[0],r=arguments[1],s=arguments[2];this.addEdges(i,i),this.addEdges(r,r),this.computeIntersections(s)}else if("boolean"==typeof arguments[2]&&R(arguments[0],y)&&arguments[1]instanceof An){var o=arguments[0],a=arguments[1],u=arguments[2];u?this.addEdges(o,null):this.addEdges(o),this.computeIntersections(a)}},addEdge:function(t,e){for(var n=t.getMonotoneChainEdge(),i=n.getStartIndexes(),r=0;r<i.length-1;r++){var s=new _n(n,r),o=new Mn(e,n.getMinX(r),s);this.events.add(o),this.events.add(new Mn(n.getMaxX(r),o))}},processOverlaps:function(t,e,n,i){for(var r=n.getObject(),s=t;e>s;s++){var o=this.events.get(s);if(o.isInsert()){var a=o.getObject();n.isSameLabel(o)||(r.computeIntersections(a,i),this.nOverlaps++)}}},addEdges:function(){if(1===arguments.length)for(var t=arguments[0],e=t.iterator();e.hasNext();){var n=e.next();this.addEdge(n,n)}else if(2===arguments.length)for(var i=arguments[0],r=arguments[1],e=i.iterator();e.hasNext();){var n=e.next();this.addEdge(n,r)}},interfaces_:function(){return[]},getClass:function(){return Fn}}),e(Gn.prototype,{getMin:function(){return this.min},intersects:function(t,e){return!(this.min>e||this.max<t)},getMax:function(){return this.max},toString:function(){return se.toLineString(new g(this.min,0),new g(this.max,0))},interfaces_:function(){return[]},getClass:function(){return Gn}}),e(qn.prototype,{compare:function(t,e){var n=t,i=e,r=(n.min+n.max)/2,s=(i.min+i.max)/2;return s>r?-1:r>s?1:0},interfaces_:function(){return[a]},getClass:function(){return qn}}),Gn.NodeComparator=qn,h(Bn,Gn),e(Bn.prototype,{query:function(t,e,n){return this.intersects(t,e)?void n.visitItem(this.item):null},interfaces_:function(){return[]},getClass:function(){return Bn}}),h(zn,Gn),e(zn.prototype,{buildExtent:function(t,e){this.min=Math.min(t.min,e.min),this.max=Math.max(t.max,e.max)},query:function(t,e,n){return this.intersects(t,e)?(null!==this.node1&&this.node1.query(t,e,n),void(null!==this.node2&&this.node2.query(t,e,n))):null},interfaces_:function(){return[]},getClass:function(){return zn}}),e(Vn.prototype,{buildTree:function(){ho.sort(this.leaves,new IntervalRTreeNode.NodeComparator);for(var t=this.leaves,e=null,n=new I;;){if(this.buildLevel(t,n),1===n.size())return n.get(0);e=t,t=n,n=e}},insert:function(t,e,n){if(null!==this.root)throw new IllegalStateException("Index cannot be added to once it has been queried");this.leaves.add(new Bn(t,e,n))},query:function(t,e,n){this.init(),this.root.query(t,e,n)},buildRoot:function(){return null!==this.root?null:void(this.root=this.buildTree())},printNode:function(t){A.out.println(se.toLineString(new g(t.min,this.level),new g(t.max,this.level)))},init:function(){return null!==this.root?null:void this.buildRoot()},buildLevel:function(t,e){this.level++,e.clear();for(var n=0;n<t.size();n+=2){var i=t.get(n),r=n+1<t.size()?t.get(n):null;if(null===r)e.add(i);else{var s=new zn(t.get(n),t.get(n+1));e.add(s)}}},interfaces_:function(){return[]},getClass:function(){return Vn}}),e(kn.prototype,{filter:function(t){if(this.isForcedToLineString&&t instanceof bt){var e=t.getFactory().createLineString(t.getCoordinateSequence());return this.lines.add(e),null}t instanceof St&&this.lines.add(t)},setForceToLineString:function(t){this.isForcedToLineString=t},interfaces_:function(){return[q]},getClass:function(){return kn}}),kn.getGeometry=function(){if(1===arguments.length){var t=arguments[0];return t.getFactory().buildGeometry(kn.getLines(t))}if(2===arguments.length){var e=arguments[0],n=arguments[1];return e.getFactory().buildGeometry(kn.getLines(e,n))}},kn.getLines=function(){if(1===arguments.length){var t=arguments[0];return kn.getLines(t,!1)}if(2===arguments.length){if(R(arguments[0],v)&&R(arguments[1],v)){for(var e=arguments[0],n=arguments[1],i=e.iterator();i.hasNext();){var r=i.next();kn.getLines(r,n)}return n}if(arguments[0]instanceof B&&"boolean"==typeof arguments[1]){var s=arguments[0],o=arguments[1],a=new I;return s.apply(new kn(a,o)),a}if(arguments[0]instanceof B&&R(arguments[1],v)){var u=arguments[0],l=arguments[1];return u instanceof St?l.add(u):u.apply(new kn(l)),l}}else if(3===arguments.length){if("boolean"==typeof arguments[2]&&R(arguments[0],v)&&R(arguments[1],v)){for(var h=arguments[0],c=arguments[1],f=arguments[2],i=h.iterator();i.hasNext();){var r=i.next();kn.getLines(r,c,f)}return c}if("boolean"==typeof arguments[2]&&arguments[0]instanceof B&&R(arguments[1],v)){var g=arguments[0],d=arguments[1],p=arguments[2];return g.apply(new kn(d,p)),d}}},e(Yn.prototype,{visitItem:function(t){this.items.add(t)},getItems:function(){return this.items},interfaces_:function(){return[Ae]},getClass:function(){return Yn}}),e(Un.prototype,{locate:function(t){var e=new le(t),n=new Xn(e);return this.index.query(t.y,t.y,n),e.getLocation()},interfaces_:function(){return[Rn]},getClass:function(){return Un}}),e(Xn.prototype,{visitItem:function(t){var e=t;this.counter.countSegment(e.getCoordinate(0),e.getCoordinate(1))},interfaces_:function(){return[Ae]},getClass:function(){return Xn}}),e(Hn.prototype,{init:function(t){for(var e=kn.getLines(t),n=e.iterator();n.hasNext();){var i=n.next(),r=i.getCoordinates();this.addLine(r)}},addLine:function(t){for(var e=1;e<t.length;e++){var n=new ce(t[e-1],t[e]),i=Math.min(n.p0.y,n.p1.y),r=Math.max(n.p0.y,n.p1.y);this.index.insert(i,r,n)}},query:function(){if(2===arguments.length){var t=arguments[0],e=arguments[1],n=new Yn;return this.index.query(t,e,n),n.getItems()}if(3===arguments.length){var i=arguments[0],r=arguments[1],s=arguments[2];this.index.query(i,r,s)}},interfaces_:function(){return[]},getClass:function(){return Hn}}),Un.SegmentVisitor=Xn,Un.IntervalIndexedGeometry=Hn,e(Wn.prototype,{getSegmentIndex:function(){return this.segmentIndex},getCoordinate:function(){return this.coord},print:function(t){t.print(this.coord),t.print(" seg # = "+this.segmentIndex),t.println(" dist = "+this.dist)},compareTo:function(t){var e=t;return this.compare(e.segmentIndex,e.dist)},isEndPoint:function(t){return 0===this.segmentIndex&&0===this.dist?!0:this.segmentIndex===t},toString:function(){return this.coord+" seg # = "+this.segmentIndex+" dist = "+this.dist},getDistance:function(){return this.dist},compare:function(t,e){return this.segmentIndex<t?-1:this.segmentIndex>t?1:this.dist<e?-1:this.dist>e?1:0},interfaces_:function(){return[s]},getClass:function(){return Wn}}),e(jn.prototype,{print:function(t){t.println("Intersections:");for(var e=this.iterator();e.hasNext();){var n=e.next();n.print(t)}},iterator:function(){return this.nodeMap.values().iterator()},addSplitEdges:function(t){this.addEndpoints();for(var e=this.iterator(),n=e.next();e.hasNext();){var i=e.next(),r=this.createSplitEdge(n,i);t.add(r),n=i}},addEndpoints:function(){var t=this.edge.pts.length-1;this.add(this.edge.pts[0],0,0),this.add(this.edge.pts[t],t,0)},createSplitEdge:function(t,e){var n=e.segmentIndex-t.segmentIndex+2,i=this.edge.pts[e.segmentIndex],r=e.dist>0||!e.coord.equals2D(i);r||n--;var s=new Array(n).fill(null),o=0;s[o++]=new g(t.coord);for(var a=t.segmentIndex+1;a<=e.segmentIndex;a++)s[o++]=this.edge.pts[a];return r&&(s[o]=e.coord),new Jn(s,new gn(this.edge.label))},add:function(t,e,n){var i=new Wn(t,e,n),r=this.nodeMap.get(i);return null!==r?r:(this.nodeMap.put(i,i),i)},isIntersection:function(t){for(var e=this.iterator();e.hasNext();){var n=e.next();if(n.coord.equals(t))return!0}return!1},interfaces_:function(){return[]},getClass:function(){return jn}}),e(Kn.prototype,{getChainStartIndices:function(t){var e=0,n=new I;n.add(new b(e));do{var i=this.findChainEnd(t,e);n.add(new b(i)),e=i}while(e<t.length-1);var r=Kn.toIntArray(n);return r},findChainEnd:function(t,e){for(var n=Je.quadrant(t[e],t[e+1]),i=e+1;i<t.length;){var r=Je.quadrant(t[i-1],t[i]);if(r!==n)break;i++}return i-1},interfaces_:function(){return[]},getClass:function(){return Kn}}),Kn.toIntArray=function(t){for(var e=new Array(t.size()).fill(null),n=0;n<e.length;n++)e[n]=t.get(n).intValue();return e},e(Zn.prototype,{getCoordinates:function(){return this.pts},getMaxX:function(t){var e=this.pts[this.startIndex[t]].x,n=this.pts[this.startIndex[t+1]].x;return e>n?e:n},getMinX:function(t){var e=this.pts[this.startIndex[t]].x,n=this.pts[this.startIndex[t+1]].x;return n>e?e:n},computeIntersectsForChain:function(){if(4===arguments.length){var t=arguments[0],e=arguments[1],n=arguments[2],i=arguments[3];this.computeIntersectsForChain(this.startIndex[t],this.startIndex[t+1],e,e.startIndex[n],e.startIndex[n+1],i)}else if(6===arguments.length){var r=arguments[0],s=arguments[1],o=arguments[2],a=arguments[3],u=arguments[4],l=arguments[5],h=this.pts[r],c=this.pts[s],f=o.pts[a],g=o.pts[u];if(s-r===1&&u-a===1)return l.addIntersections(this.e,r,o.e,a),null;if(this.env1.init(h,c),this.env2.init(f,g),!this.env1.intersects(this.env2))return null;var d=Math.trunc((r+s)/2),p=Math.trunc((a+u)/2);d>r&&(p>a&&this.computeIntersectsForChain(r,d,o,a,p,l),u>p&&this.computeIntersectsForChain(r,d,o,p,u,l)),s>d&&(p>a&&this.computeIntersectsForChain(d,s,o,a,p,l),u>p&&this.computeIntersectsForChain(d,s,o,p,u,l))}},getStartIndexes:function(){return this.startIndex},computeIntersects:function(t,e){for(var n=0;n<this.startIndex.length-1;n++)for(var i=0;i<t.startIndex.length-1;i++)this.computeIntersectsForChain(n,t,i,e)},interfaces_:function(){return[]},getClass:function(){return Zn}}),e(Qn.prototype,{getDepth:function(t,e){return this.depth[t][e]},setDepth:function(t,e,n){this.depth[t][e]=n},isNull:function(){if(0===arguments.length){for(var t=0;2>t;t++)for(var e=0;3>e;e++)if(this.depth[t][e]!==Qn.NULL_VALUE)return!1;return!0}if(1===arguments.length){var n=arguments[0];return this.depth[n][1]===Qn.NULL_VALUE}if(2===arguments.length){var i=arguments[0],r=arguments[1];return this.depth[i][r]===Qn.NULL_VALUE}},normalize:function(){for(var t=0;2>t;t++)if(!this.isNull(t)){var e=this.depth[t][1];this.depth[t][2]<e&&(e=this.depth[t][2]),0>e&&(e=0);for(var n=1;3>n;n++){var i=0;this.depth[t][n]>e&&(i=1),this.depth[t][n]=i}}},getDelta:function(t){return this.depth[t][cn.RIGHT]-this.depth[t][cn.LEFT]},getLocation:function(t,e){return this.depth[t][e]<=0?L.EXTERIOR:L.INTERIOR},toString:function(){return"A: "+this.depth[0][1]+","+this.depth[0][2]+" B: "+this.depth[1][1]+","+this.depth[1][2]},add:function(){if(1===arguments.length)for(var t=arguments[0],e=0;2>e;e++)for(var n=1;3>n;n++){var i=t.getLocation(e,n);i!==L.EXTERIOR&&i!==L.INTERIOR||(this.isNull(e,n)?this.depth[e][n]=Qn.depthAtLocation(i):this.depth[e][n]+=Qn.depthAtLocation(i))}else if(3===arguments.length){var r=arguments[0],s=arguments[1],o=arguments[2];o===L.INTERIOR&&this.depth[r][s]++}},interfaces_:function(){return[]},getClass:function(){return Qn}}),Qn.depthAtLocation=function(t){return t===L.EXTERIOR?0:t===L.INTERIOR?1:Qn.NULL_VALUE},Qn.NULL_VALUE=-1,h(Jn,mn),e(Jn.prototype,{getDepth:function(){return this.depth},getCollapsedEdge:function(){var t=new Array(2).fill(null);t[0]=this.pts[0],t[1]=this.pts[1];var e=new Jn(t,gn.toLineLabel(this.label));return e},isIsolated:function(){return this._isIsolated},getCoordinates:function(){return this.pts},setIsolated:function(t){this._isIsolated=t},setName:function(t){this.name=t},equals:function(t){if(!(t instanceof Jn))return!1;var e=t;if(this.pts.length!==e.pts.length)return!1;for(var n=!0,i=!0,r=this.pts.length,s=0;s<this.pts.length;s++)if(this.pts[s].equals2D(e.pts[s])||(n=!1),this.pts[s].equals2D(e.pts[--r])||(i=!1),!n&&!i)return!1;return!0},getCoordinate:function(){if(0===arguments.length)return this.pts.length>0?this.pts[0]:null;if(1===arguments.length){var t=arguments[0];return this.pts[t]}},print:function(t){t.print("edge "+this.name+": "),t.print("LINESTRING (");for(var e=0;e<this.pts.length;e++)e>0&&t.print(","),t.print(this.pts[e].x+" "+this.pts[e].y);t.print(")  "+this.label+" "+this.depthDelta)},computeIM:function(t){Jn.updateIM(this.label,t)},isCollapsed:function(){return this.label.isArea()?3!==this.pts.length?!1:!!this.pts[0].equals(this.pts[2]):!1},isClosed:function(){return this.pts[0].equals(this.pts[this.pts.length-1])},getMaximumSegmentIndex:function(){return this.pts.length-1},getDepthDelta:function(){return this.depthDelta},getNumPoints:function(){return this.pts.length},printReverse:function(t){t.print("edge "+this.name+": ");for(var e=this.pts.length-1;e>=0;e--)t.print(this.pts[e]+" ");t.println("")},getMonotoneChainEdge:function(){return null===this.mce&&(this.mce=new Zn(this)),this.mce},getEnvelope:function(){if(null===this.env){this.env=new C;for(var t=0;t<this.pts.length;t++)this.env.expandToInclude(this.pts[t])}return this.env},addIntersection:function(t,e,n,i){var r=new g(t.getIntersection(i)),s=e,o=t.getEdgeDistance(n,i),a=s+1;if(a<this.pts.length){var u=this.pts[a];r.equals2D(u)&&(s=a,o=0)}this.eiList.add(r,s,o)},toString:function(){var t=new P;t.append("edge "+this.name+": "),t.append("LINESTRING (");for(var e=0;e<this.pts.length;e++)e>0&&t.append(","),t.append(this.pts[e].x+" "+this.pts[e].y);return t.append(")  "+this.label+" "+this.depthDelta),t.toString()},isPointwiseEqual:function(t){if(this.pts.length!==t.pts.length)return!1;for(var e=0;e<this.pts.length;e++)if(!this.pts[e].equals2D(t.pts[e]))return!1;return!0},setDepthDelta:function(t){this.depthDelta=t},getEdgeIntersectionList:function(){return this.eiList},addIntersections:function(t,e,n){for(var i=0;i<t.getIntersectionNum();i++)this.addIntersection(t,e,n,i)},interfaces_:function(){return[]},getClass:function(){return Jn}}),Jn.updateIM=function(){if(2!==arguments.length)return mn.prototype.updateIM.apply(this,arguments);var t=arguments[0],e=arguments[1];e.setAtLeastIfValid(t.getLocation(0,cn.ON),t.getLocation(1,cn.ON),1),t.isArea()&&(e.setAtLeastIfValid(t.getLocation(0,cn.LEFT),t.getLocation(1,cn.LEFT),2),e.setAtLeastIfValid(t.getLocation(0,cn.RIGHT),t.getLocation(1,cn.RIGHT),2))},h($n,Cn),e($n.prototype,{insertBoundaryPoint:function(t,e){var n=this.nodes.addNode(e),i=n.getLabel(),r=1,s=L.NONE;s=i.getLocation(t,cn.ON),s===L.BOUNDARY&&r++;var o=$n.determineBoundary(this.boundaryNodeRule,r);i.setLocation(t,o)},computeSelfNodes:function(){if(2===arguments.length){var t=arguments[0],e=arguments[1];return this.computeSelfNodes(t,e,!1)}if(3===arguments.length){var n=arguments[0],i=arguments[1],r=arguments[2],s=new An(n,!0,!1);s.setIsDoneIfProperInt(r);var o=this.createEdgeSetIntersector(),a=this.parentGeom instanceof bt||this.parentGeom instanceof Tt||this.parentGeom instanceof Ot,u=i||!a;return o.computeIntersections(this.edges,s,u),this.addSelfIntersectionNodes(this.argIndex),s}},computeSplitEdges:function(t){for(var e=this.edges.iterator();e.hasNext();){var n=e.next();n.eiList.addSplitEdges(t)}},computeEdgeIntersections:function(t,e,n){var i=new An(e,n,!0);i.setBoundaryNodes(this.getBoundaryNodes(),t.getBoundaryNodes());var r=this.createEdgeSetIntersector();return r.computeIntersections(this.edges,t.edges,i),i},getGeometry:function(){return this.parentGeom},getBoundaryNodeRule:function(){return this.boundaryNodeRule},hasTooFewPoints:function(){return this._hasTooFewPoints},addPoint:function(){if(arguments[0]instanceof Lt){var t=arguments[0],e=t.getCoordinate();this.insertPoint(this.argIndex,e,L.INTERIOR)}else if(arguments[0]instanceof g){var n=arguments[0];this.insertPoint(this.argIndex,n,L.INTERIOR)}},addPolygon:function(t){this.addPolygonRing(t.getExteriorRing(),L.EXTERIOR,L.INTERIOR);for(var e=0;e<t.getNumInteriorRing();e++){var n=t.getInteriorRingN(e);this.addPolygonRing(n,L.INTERIOR,L.EXTERIOR)}},addEdge:function(t){this.insertEdge(t);var e=t.getCoordinates();this.insertPoint(this.argIndex,e[0],L.BOUNDARY),this.insertPoint(this.argIndex,e[e.length-1],L.BOUNDARY)},addLineString:function(t){var e=H.removeRepeatedPoints(t.getCoordinates());if(e.length<2)return this._hasTooFewPoints=!0,this.invalidPoint=e[0],null;var n=new Jn(e,new gn(this.argIndex,L.INTERIOR));this.lineEdgeMap.put(t,n),this.insertEdge(n),f.isTrue(e.length>=2,"found LineString with single point"),this.insertBoundaryPoint(this.argIndex,e[0]),this.insertBoundaryPoint(this.argIndex,e[e.length-1])},getInvalidPoint:function(){return this.invalidPoint},getBoundaryPoints:function(){for(var t=this.getBoundaryNodes(),e=new Array(t.size()).fill(null),n=0,i=t.iterator();i.hasNext();){var r=i.next();e[n++]=r.getCoordinate().copy()}return e},getBoundaryNodes:function(){return null===this.boundaryNodes&&(this.boundaryNodes=this.nodes.getBoundaryNodes(this.argIndex)),this.boundaryNodes},addSelfIntersectionNode:function(t,e,n){return this.isBoundaryNode(t,e)?null:void(n===L.BOUNDARY&&this.useBoundaryDeterminationRule?this.insertBoundaryPoint(t,e):this.insertPoint(t,e,n))},addPolygonRing:function(t,e,n){if(t.isEmpty())return null;var i=H.removeRepeatedPoints(t.getCoordinates());if(i.length<4)return this._hasTooFewPoints=!0,this.invalidPoint=i[0],null;var r=e,s=n;he.isCCW(i)&&(r=n,s=e);var o=new Jn(i,new gn(this.argIndex,L.BOUNDARY,r,s));this.lineEdgeMap.put(t,o),this.insertEdge(o),this.insertPoint(this.argIndex,i[0],L.BOUNDARY)},insertPoint:function(t,e,n){var i=this.nodes.addNode(e),r=i.getLabel();null===r?i.label=new gn(t,n):r.setLocation(t,n)},createEdgeSetIntersector:function(){return new Fn},addSelfIntersectionNodes:function(t){for(var e=this.edges.iterator();e.hasNext();)for(var n=e.next(),i=n.getLabel().getLocation(t),r=n.eiList.iterator();r.hasNext();){var s=r.next();this.addSelfIntersectionNode(t,s.coord,i)}},add:function(){if(1!==arguments.length)return Cn.prototype.add.apply(this,arguments);var t=arguments[0];if(t.isEmpty())return null;if(t instanceof Ot&&(this.useBoundaryDeterminationRule=!1),t instanceof Tt)this.addPolygon(t);else if(t instanceof St)this.addLineString(t);else if(t instanceof Lt)this.addPoint(t);else if(t instanceof Pt)this.addCollection(t);else if(t instanceof gt)this.addCollection(t);else if(t instanceof Ot)this.addCollection(t);else{if(!(t instanceof ft))throw new UnsupportedOperationException(t.getClass().getName());this.addCollection(t)}},addCollection:function(t){for(var e=0;e<t.getNumGeometries();e++){var n=t.getGeometryN(e);this.add(n)}},locate:function(t){return R(this.parentGeom,Rt)&&this.parentGeom.getNumGeometries()>50?(null===this.areaPtLocator&&(this.areaPtLocator=new Un(this.parentGeom)),this.areaPtLocator.locate(t)):this.ptLocator.locate(t,this.parentGeom)},findEdge:function(){if(1===arguments.length){var t=arguments[0];return this.lineEdgeMap.get(t)}return Cn.prototype.findEdge.apply(this,arguments)},interfaces_:function(){return[]},getClass:function(){return $n}}),$n.determineBoundary=function(t,e){return t.isInBoundary(e)?L.BOUNDARY:L.INTERIOR},e(ti.prototype,{getArgGeometry:function(t){return this.arg[t].getGeometry()},setComputationPrecision:function(t){this.resultPrecisionModel=t,this.li.setPrecisionModel(this.resultPrecisionModel)},interfaces_:function(){return[]},getClass:function(){return ti}}),e(ei.prototype,{compareTo:function(t){var e=t,n=ei.compareOriented(this.pts,this._orientation,e.pts,e._orientation);return n},interfaces_:function(){return[s]},getClass:function(){return ei}}),ei.orientation=function(t){return 1===H.increasingDirection(t)},ei.compareOriented=function(t,e,n,i){for(var r=e?1:-1,s=i?1:-1,o=e?t.length:-1,a=i?n.length:-1,u=e?0:t.length-1,l=i?0:n.length-1;;){var h=t[u].compareTo(n[l]);if(0!==h)return h;u+=r,l+=s;var c=u===o,f=l===a;if(c&&!f)return-1;if(!c&&f)return 1;if(c&&f)return 0}},e(ni.prototype,{print:function(t){t.print("MULTILINESTRING ( ");for(var e=0;e<this.edges.size();e++){var n=this.edges.get(e);e>0&&t.print(","),t.print("(");for(var i=n.getCoordinates(),r=0;r<i.length;r++)r>0&&t.print(","),t.print(i[r].x+" "+i[r].y);t.println(")")}t.print(")  ")},addAll:function(t){for(var e=t.iterator();e.hasNext();)this.add(e.next())},findEdgeIndex:function(t){for(var e=0;e<this.edges.size();e++)if(this.edges.get(e).equals(t))return e;return-1},iterator:function(){return this.edges.iterator()},getEdges:function(){return this.edges},get:function(t){return this.edges.get(t)},findEqualEdge:function(t){var e=new ei(t.getCoordinates()),n=this.ocaMap.get(e);return n},add:function(t){this.edges.add(t);var e=new ei(t.getCoordinates());this.ocaMap.put(e,t)},interfaces_:function(){return[]},getClass:function(){return ni}}),h(ii,ti),e(ii.prototype,{insertUniqueEdge:function(t){var e=this.edgeList.findEqualEdge(t);if(null!==e){var n=e.getLabel(),i=t.getLabel();e.isPointwiseEqual(t)||(i=new gn(t.getLabel()),i.flip());var r=e.getDepth();r.isNull()&&r.add(n),r.add(i),n.merge(i)}else this.edgeList.add(t)},getGraph:function(){return this.graph},cancelDuplicateResultEdges:function(){for(var t=this.graph.getEdgeEnds().iterator();t.hasNext();){var e=t.next(),n=e.getSym();e.isInResult()&&n.isInResult()&&(e.setInResult(!1),n.setInResult(!1))}},isCoveredByLA:function(t){return this.isCovered(t,this.resultLineList)?!0:!!this.isCovered(t,this.resultPolyList)},computeGeometry:function(t,e,n,i){var r=new I;return r.addAll(t),r.addAll(e),r.addAll(n),r.isEmpty()?ii.createEmptyResult(i,this.arg[0].getGeometry(),this.arg[1].getGeometry(),this.geomFact):this.geomFact.buildGeometry(r)},mergeSymLabels:function(){for(var t=this.graph.getNodes().iterator();t.hasNext();){var e=t.next();e.getEdges().mergeSymLabels()}},isCovered:function(t,e){for(var n=e.iterator();n.hasNext();){var i=n.next(),r=this.ptLocator.locate(t,i);if(r!==L.EXTERIOR)return!0}return!1},replaceCollapsedEdges:function(){for(var t=new I,e=this.edgeList.iterator();e.hasNext();){var n=e.next();n.isCollapsed()&&(e.remove(),t.add(n.getCollapsedEdge()))}this.edgeList.addAll(t)},updateNodeLabelling:function(){for(var t=this.graph.getNodes().iterator();t.hasNext();){var e=t.next(),n=e.getEdges().getLabel();e.getLabel().merge(n)}},getResultGeometry:function(t){return this.computeOverlay(t),this.resultGeom},insertUniqueEdges:function(t){for(var e=t.iterator();e.hasNext();){var n=e.next();this.insertUniqueEdge(n)}},computeOverlay:function(t){this.copyPoints(0),this.copyPoints(1),this.arg[0].computeSelfNodes(this.li,!1),this.arg[1].computeSelfNodes(this.li,!1),this.arg[0].computeEdgeIntersections(this.arg[1],this.li,!0);var e=new I;this.arg[0].computeSplitEdges(e),this.arg[1].computeSplitEdges(e);this.insertUniqueEdges(e),this.computeLabelsFromDepths(),this.replaceCollapsedEdges(),ln.checkValid(this.edgeList.getEdges()),this.graph.addEdges(this.edgeList.getEdges()),this.computeLabelling(),this.labelIncompleteNodes(),this.findResultAreaEdges(t),this.cancelDuplicateResultEdges();var n=new Sn(this.geomFact);n.add(this.graph),this.resultPolyList=n.getPolygons();var i=new wn(this,this.geomFact,this.ptLocator);this.resultLineList=i.build(t);var r=new Ln(this,this.geomFact,this.ptLocator);this.resultPointList=r.build(t),
this.resultGeom=this.computeGeometry(this.resultPointList,this.resultLineList,this.resultPolyList,t)},labelIncompleteNode:function(t,e){var n=this.ptLocator.locate(t.getCoordinate(),this.arg[e].getGeometry());t.getLabel().setLocation(e,n)},copyPoints:function(t){for(var e=this.arg[t].getNodeIterator();e.hasNext();){var n=e.next(),i=this.graph.addNode(n.getCoordinate());i.setLabel(t,n.getLabel().getLocation(t))}},findResultAreaEdges:function(t){for(var e=this.graph.getEdgeEnds().iterator();e.hasNext();){var n=e.next(),i=n.getLabel();i.isArea()&&!n.isInteriorAreaEdge()&&ii.isResultOfOp(i.getLocation(0,cn.RIGHT),i.getLocation(1,cn.RIGHT),t)&&n.setInResult(!0)}},computeLabelsFromDepths:function(){for(var t=this.edgeList.iterator();t.hasNext();){var e=t.next(),n=e.getLabel(),i=e.getDepth();if(!i.isNull()){i.normalize();for(var r=0;2>r;r++)n.isNull(r)||!n.isArea()||i.isNull(r)||(0===i.getDelta(r)?n.toLine(r):(f.isTrue(!i.isNull(r,cn.LEFT),"depth of LEFT side has not been initialized"),n.setLocation(r,cn.LEFT,i.getLocation(r,cn.LEFT)),f.isTrue(!i.isNull(r,cn.RIGHT),"depth of RIGHT side has not been initialized"),n.setLocation(r,cn.RIGHT,i.getLocation(r,cn.RIGHT))))}}},computeLabelling:function(){for(var t=this.graph.getNodes().iterator();t.hasNext();){var e=t.next();e.getEdges().computeLabelling(this.arg)}this.mergeSymLabels(),this.updateNodeLabelling()},labelIncompleteNodes:function(){for(var t=0,e=this.graph.getNodes().iterator();e.hasNext();){var n=e.next(),i=n.getLabel();n.isIsolated()&&(t++,i.isNull(0)?this.labelIncompleteNode(n,0):this.labelIncompleteNode(n,1)),n.getEdges().updateLabelling(i)}},isCoveredByA:function(t){return!!this.isCovered(t,this.resultPolyList)},interfaces_:function(){return[]},getClass:function(){return ii}}),ii.overlayOp=function(t,e,n){var i=new ii(t,e),r=i.getResultGeometry(n);return r},ii.intersection=function(t,e){if(t.isEmpty()||e.isEmpty())return ii.createEmptyResult(ii.INTERSECTION,t,e,t.getFactory());if(t.isGeometryCollection()){var n=e;return hn.map(t,{interfaces_:function(){return[MapOp]},map:function(t){return t.intersection(n)}})}return t.checkNotGeometryCollection(t),t.checkNotGeometryCollection(e),si.overlayOp(t,e,ii.INTERSECTION)},ii.symDifference=function(t,e){if(t.isEmpty()||e.isEmpty()){if(t.isEmpty()&&e.isEmpty())return ii.createEmptyResult(ii.SYMDIFFERENCE,t,e,t.getFactory());if(t.isEmpty())return e.copy();if(e.isEmpty())return t.copy()}return t.checkNotGeometryCollection(t),t.checkNotGeometryCollection(e),si.overlayOp(t,e,ii.SYMDIFFERENCE)},ii.resultDimension=function(t,e,n){var i=e.getDimension(),r=n.getDimension(),s=-1;switch(t){case ii.INTERSECTION:s=Math.min(i,r);break;case ii.UNION:s=Math.max(i,r);break;case ii.DIFFERENCE:s=i;break;case ii.SYMDIFFERENCE:s=Math.max(i,r)}return s},ii.createEmptyResult=function(t,e,n,i){var r=null;switch(ii.resultDimension(t,e,n)){case-1:r=i.createGeometryCollection(new Array(0).fill(null));break;case 0:r=i.createPoint();break;case 1:r=i.createLineString();break;case 2:r=i.createPolygon()}return r},ii.difference=function(t,e){return t.isEmpty()?ii.createEmptyResult(ii.DIFFERENCE,t,e,t.getFactory()):e.isEmpty()?t.copy():(t.checkNotGeometryCollection(t),t.checkNotGeometryCollection(e),si.overlayOp(t,e,ii.DIFFERENCE))},ii.isResultOfOp=function(){if(2===arguments.length){var t=arguments[0],e=arguments[1],n=t.getLocation(0),i=t.getLocation(1);return ii.isResultOfOp(n,i,e)}if(3===arguments.length){var r=arguments[0],s=arguments[1],o=arguments[2];switch(r===L.BOUNDARY&&(r=L.INTERIOR),s===L.BOUNDARY&&(s=L.INTERIOR),o){case ii.INTERSECTION:return r===L.INTERIOR&&s===L.INTERIOR;case ii.UNION:return r===L.INTERIOR||s===L.INTERIOR;case ii.DIFFERENCE:return r===L.INTERIOR&&s!==L.INTERIOR;case ii.SYMDIFFERENCE:return r===L.INTERIOR&&s!==L.INTERIOR||r!==L.INTERIOR&&s===L.INTERIOR}return!1}},ii.INTERSECTION=1,ii.UNION=2,ii.DIFFERENCE=3,ii.SYMDIFFERENCE=4,e(ri.prototype,{selfSnap:function(t){var e=new Ie(t),n=e.snapTo(t,this.snapTolerance);return n},removeCommonBits:function(t){this.cbr=new Se,this.cbr.add(t[0]),this.cbr.add(t[1]);var e=new Array(2).fill(null);return e[0]=this.cbr.removeCommonBits(t[0].copy()),e[1]=this.cbr.removeCommonBits(t[1].copy()),e},prepareResult:function(t){return this.cbr.addCommonBits(t),t},getResultGeometry:function(t){var e=this.snap(this.geom),n=ii.overlayOp(e[0],e[1],t);return this.prepareResult(n)},checkValid:function(t){t.isValid()||A.out.println("Snapped geometry is invalid")},computeSnapTolerance:function(){this.snapTolerance=Ie.computeOverlaySnapTolerance(this.geom[0],this.geom[1])},snap:function(t){var e=this.removeCommonBits(t),n=Ie.snap(e[0],e[1],this.snapTolerance);return n},interfaces_:function(){return[]},getClass:function(){return ri}}),ri.overlayOp=function(t,e,n){var i=new ri(t,e);return i.getResultGeometry(n)},ri.union=function(t,e){return ri.overlayOp(t,e,ii.UNION)},ri.intersection=function(t,e){return ri.overlayOp(t,e,ii.INTERSECTION)},ri.symDifference=function(t,e){return ri.overlayOp(t,e,ii.SYMDIFFERENCE)},ri.difference=function(t,e){return ri.overlayOp(t,e,ii.DIFFERENCE)},e(si.prototype,{getResultGeometry:function(t){var e=null,n=!1,i=null;try{e=ii.overlayOp(this.geom[0],this.geom[1],t);var r=!0;r&&(n=!0)}catch(t){if(!(t instanceof l))throw t;i=t}finally{}if(!n)try{e=ri.overlayOp(this.geom[0],this.geom[1],t)}catch(t){throw t instanceof l?i:t}finally{}return e},interfaces_:function(){return[]},getClass:function(){return si}}),si.overlayOp=function(t,e,n){var i=new si(t,e);return i.getResultGeometry(n)},si.union=function(t,e){return si.overlayOp(t,e,ii.UNION)},si.intersection=function(t,e){return si.overlayOp(t,e,ii.INTERSECTION)},si.symDifference=function(t,e){return si.overlayOp(t,e,ii.SYMDIFFERENCE)},si.difference=function(t,e){return si.overlayOp(t,e,ii.DIFFERENCE)},e(oi.prototype,{addPolygon:function(t){if(t.isEmpty())return null;var e=null,n=0,i=this.horizontalBisector(t);if(0===i.getLength())n=0,e=i.getCoordinate();else{var r=si.overlayOp(i,t,ii.INTERSECTION),s=this.widestGeometry(r);n=s.getEnvelopeInternal().getWidth(),e=oi.centre(s.getEnvelopeInternal())}(null===this.interiorPoint||n>this.maxWidth)&&(this.interiorPoint=e,this.maxWidth=n)},getInteriorPoint:function(){return this.interiorPoint},widestGeometry:function t(){if(arguments[0]instanceof ft){var e=arguments[0];if(e.isEmpty())return e;for(var t=e.getGeometryN(0),n=1;n<e.getNumGeometries();n++)e.getGeometryN(n).getEnvelopeInternal().getWidth()>t.getEnvelopeInternal().getWidth()&&(t=e.getGeometryN(n));return t}if(arguments[0]instanceof B){var i=arguments[0];return i instanceof ft?this.widestGeometry(i):i}},horizontalBisector:function(t){var e=t.getEnvelopeInternal(),n=ai.getBisectorY(t);return this.factory.createLineString([new g(e.getMinX(),n),new g(e.getMaxX(),n)])},add:function(t){if(t instanceof Tt)this.addPolygon(t);else if(t instanceof ft)for(var e=t,n=0;n<e.getNumGeometries();n++)this.add(e.getGeometryN(n))},interfaces_:function(){return[]},getClass:function(){return oi}}),oi.centre=function(t){return new g(oi.avg(t.getMinX(),t.getMaxX()),oi.avg(t.getMinY(),t.getMaxY()))},oi.avg=function(t,e){return(t+e)/2},e(ai.prototype,{updateInterval:function(t){t<=this.centreY?t>this.loY&&(this.loY=t):t>this.centreY&&t<this.hiY&&(this.hiY=t)},getBisectorY:function(){this.process(this.poly.getExteriorRing());for(var t=0;t<this.poly.getNumInteriorRing();t++)this.process(this.poly.getInteriorRingN(t));var e=oi.avg(this.hiY,this.loY);return e},process:function(t){for(var e=t.getCoordinateSequence(),n=0;n<e.size();n++){var i=e.getY(n);this.updateInterval(i)}},interfaces_:function(){return[]},getClass:function(){return ai}}),ai.getBisectorY=function(t){var e=new ai(t);return e.getBisectorY()},oi.SafeBisectorFinder=ai,e(ui.prototype,{addEndpoints:function(){if(arguments[0]instanceof B){var t=arguments[0];if(t instanceof St)this.addEndpoints(t.getCoordinates());else if(t instanceof ft)for(var e=t,n=0;n<e.getNumGeometries();n++)this.addEndpoints(e.getGeometryN(n))}else if(arguments[0]instanceof Array){var i=arguments[0];this.add(i[0]),this.add(i[i.length-1])}},getInteriorPoint:function(){return this.interiorPoint},addInterior:function(){if(arguments[0]instanceof B){var t=arguments[0];if(t instanceof St)this.addInterior(t.getCoordinates());else if(t instanceof ft)for(var e=t,n=0;n<e.getNumGeometries();n++)this.addInterior(e.getGeometryN(n))}else if(arguments[0]instanceof Array)for(var i=arguments[0],n=1;n<i.length-1;n++)this.add(i[n])},add:function(t){var e=t.distance(this.centroid);e<this.minDistance&&(this.interiorPoint=new g(t),this.minDistance=e)},interfaces_:function(){return[]},getClass:function(){return ui}}),e(li.prototype,{getInteriorPoint:function(){return this.interiorPoint},add:function(){if(arguments[0]instanceof B){var t=arguments[0];if(t instanceof Lt)this.add(t.getCoordinate());else if(t instanceof ft)for(var e=t,n=0;n<e.getNumGeometries();n++)this.add(e.getGeometryN(n))}else if(arguments[0]instanceof g){var i=arguments[0],r=i.distance(this.centroid);r<this.minDistance&&(this.interiorPoint=new g(i),this.minDistance=r)}},interfaces_:function(){return[]},getClass:function(){return li}}),e(hi.prototype,{interfaces_:function(){return[]},getClass:function(){return hi}}),hi.toDegrees=function(t){return 180*t/Math.PI},hi.normalize=function(t){for(;t>Math.PI;)t-=hi.PI_TIMES_2;for(;t<=-Math.PI;)t+=hi.PI_TIMES_2;return t},hi.angle=function(){if(1===arguments.length){var t=arguments[0];return Math.atan2(t.y,t.x)}if(2===arguments.length){var e=arguments[0],n=arguments[1],i=n.x-e.x,r=n.y-e.y;return Math.atan2(r,i)}},hi.isAcute=function(t,e,n){var i=t.x-e.x,r=t.y-e.y,s=n.x-e.x,o=n.y-e.y,a=i*s+r*o;return a>0},hi.isObtuse=function(t,e,n){var i=t.x-e.x,r=t.y-e.y,s=n.x-e.x,o=n.y-e.y,a=i*s+r*o;return 0>a},hi.interiorAngle=function(t,e,n){var i=hi.angle(e,t),r=hi.angle(e,n);return Math.abs(r-i)},hi.normalizePositive=function(t){if(0>t){for(;0>t;)t+=hi.PI_TIMES_2;t>=hi.PI_TIMES_2&&(t=0)}else{for(;t>=hi.PI_TIMES_2;)t-=hi.PI_TIMES_2;0>t&&(t=0)}return t},hi.angleBetween=function(t,e,n){var i=hi.angle(e,t),r=hi.angle(e,n);return hi.diff(i,r)},hi.diff=function(t,e){var n=null;return n=e>t?e-t:t-e,n>Math.PI&&(n=2*Math.PI-n),n},hi.toRadians=function(t){return t*Math.PI/180},hi.getTurn=function(t,e){var n=Math.sin(e-t);return n>0?hi.COUNTERCLOCKWISE:0>n?hi.CLOCKWISE:hi.NONE},hi.angleBetweenOriented=function(t,e,n){var i=hi.angle(e,t),r=hi.angle(e,n),s=r-i;return s<=-Math.PI?s+hi.PI_TIMES_2:s>Math.PI?s-hi.PI_TIMES_2:s},hi.PI_TIMES_2=2*Math.PI,hi.PI_OVER_2=Math.PI/2,hi.PI_OVER_4=Math.PI/4,hi.COUNTERCLOCKWISE=he.COUNTERCLOCKWISE,hi.CLOCKWISE=he.CLOCKWISE,hi.NONE=he.COLLINEAR,e(ci.prototype,{area:function(){return ci.area(this.p0,this.p1,this.p2)},signedArea:function(){return ci.signedArea(this.p0,this.p1,this.p2)},interpolateZ:function(t){if(null===t)throw new i("Supplied point is null.");return ci.interpolateZ(t,this.p0,this.p1,this.p2)},longestSideLength:function(){return ci.longestSideLength(this.p0,this.p1,this.p2)},isAcute:function(){return ci.isAcute(this.p0,this.p1,this.p2)},circumcentre:function(){return ci.circumcentre(this.p0,this.p1,this.p2)},area3D:function(){return ci.area3D(this.p0,this.p1,this.p2)},centroid:function(){return ci.centroid(this.p0,this.p1,this.p2)},inCentre:function(){return ci.inCentre(this.p0,this.p1,this.p2)},interfaces_:function(){return[]},getClass:function(){return ci}}),ci.area=function(t,e,n){return Math.abs(((n.x-t.x)*(e.y-t.y)-(e.x-t.x)*(n.y-t.y))/2)},ci.signedArea=function(t,e,n){return((n.x-t.x)*(e.y-t.y)-(e.x-t.x)*(n.y-t.y))/2},ci.det=function(t,e,n,i){return t*i-e*n},ci.interpolateZ=function(t,e,n,i){var r=e.x,s=e.y,o=n.x-r,a=i.x-r,u=n.y-s,l=i.y-s,h=o*l-a*u,c=t.x-r,f=t.y-s,g=(l*c-a*f)/h,d=(-u*c+o*f)/h,p=e.z+g*(n.z-e.z)+d*(i.z-e.z);return p},ci.longestSideLength=function(t,e,n){var i=t.distance(e),r=e.distance(n),s=n.distance(t),o=i;return r>o&&(o=r),s>o&&(o=s),o},ci.isAcute=function(t,e,n){return hi.isAcute(t,e,n)&&hi.isAcute(e,n,t)?!!hi.isAcute(n,t,e):!1},ci.circumcentre=function(t,e,n){var i=n.x,r=n.y,s=t.x-i,o=t.y-r,a=e.x-i,u=e.y-r,l=2*ci.det(s,o,a,u),h=ci.det(o,s*s+o*o,u,a*a+u*u),c=ci.det(s,s*s+o*o,a,a*a+u*u),f=i-h/l,d=r+c/l;return new g(f,d)},ci.perpendicularBisector=function(t,e){var n=e.x-t.x,i=e.y-t.y,r=new F(t.x+n/2,t.y+i/2,1),s=new F(t.x-i+n/2,t.y+n+i/2,1);return new F(r,s)},ci.angleBisector=function(t,e,n){var i=e.distance(t),r=e.distance(n),s=i/(i+r),o=n.x-t.x,a=n.y-t.y,u=new g(t.x+s*o,t.y+s*a);return u},ci.area3D=function(t,e,n){var i=e.x-t.x,r=e.y-t.y,s=e.z-t.z,o=n.x-t.x,a=n.y-t.y,u=n.z-t.z,l=r*u-s*a,h=s*o-i*u,c=i*a-r*o,f=l*l+h*h+c*c,g=Math.sqrt(f)/2;return g},ci.centroid=function(t,e,n){var i=(t.x+e.x+n.x)/3,r=(t.y+e.y+n.y)/3;return new g(i,r)},ci.inCentre=function(t,e,n){var i=e.distance(n),r=t.distance(n),s=t.distance(e),o=i+r+s,a=(i*t.x+r*e.x+s*n.x)/o,u=(i*t.y+r*e.y+s*n.y)/o;return new g(a,u)},e(fi.prototype,{getRadius:function(){return this.compute(),this.radius},getDiameter:function(){switch(this.compute(),this.extremalPts.length){case 0:return this.input.getFactory().createLineString();case 1:return this.input.getFactory().createPoint(this.centre)}var t=this.extremalPts[0],e=this.extremalPts[1];return this.input.getFactory().createLineString([t,e])},getExtremalPoints:function(){return this.compute(),this.extremalPts},computeCirclePoints:function(){if(this.input.isEmpty())return this.extremalPts=new Array(0).fill(null),null;if(1===this.input.getNumPoints()){var t=this.input.getCoordinates();return this.extremalPts=[new g(t[0])],null}var e=this.input.convexHull(),n=e.getCoordinates(),t=n;if(n[0].equals2D(n[n.length-1])&&(t=new Array(n.length-1).fill(null),H.copyDeep(n,0,t,0,n.length-1)),t.length<=2)return this.extremalPts=H.copyDeep(t),null;for(var i=fi.lowestPoint(t),r=fi.pointWitMinAngleWithX(t,i),s=0;s<t.length;s++){var o=fi.pointWithMinAngleWithSegment(t,i,r);if(hi.isObtuse(i,o,r))return this.extremalPts=[new g(i),new g(r)],null;if(hi.isObtuse(o,i,r))i=o;else{if(!hi.isObtuse(o,r,i))return this.extremalPts=[new g(i),new g(r),new g(o)],null;r=o}}f.shouldNeverReachHere("Logic failure in Minimum Bounding Circle algorithm!")},compute:function(){return null!==this.extremalPts?null:(this.computeCirclePoints(),this.computeCentre(),void(null!==this.centre&&(this.radius=this.centre.distance(this.extremalPts[0]))))},getFarthestPoints:function(){switch(this.compute(),this.extremalPts.length){case 0:return this.input.getFactory().createLineString();case 1:return this.input.getFactory().createPoint(this.centre)}var t=this.extremalPts[0],e=this.extremalPts[this.extremalPts.length-1];return this.input.getFactory().createLineString([t,e])},getCircle:function(){if(this.compute(),null===this.centre)return this.input.getFactory().createPolygon();var t=this.input.getFactory().createPoint(this.centre);return 0===this.radius?t:t.buffer(this.radius)},getCentre:function(){return this.compute(),this.centre},computeCentre:function(){switch(this.extremalPts.length){case 0:this.centre=null;break;case 1:this.centre=this.extremalPts[0];break;case 2:this.centre=new g((this.extremalPts[0].x+this.extremalPts[1].x)/2,(this.extremalPts[0].y+this.extremalPts[1].y)/2);break;case 3:this.centre=ci.circumcentre(this.extremalPts[0],this.extremalPts[1],this.extremalPts[2])}},interfaces_:function(){return[]},getClass:function(){return fi}}),fi.pointWitMinAngleWithX=function(t,e){for(var n=r.MAX_VALUE,i=null,s=0;s<t.length;s++){var o=t[s];if(o!==e){var a=o.x-e.x,u=o.y-e.y;0>u&&(u=-u);var l=Math.sqrt(a*a+u*u),h=u/l;n>h&&(n=h,i=o)}}return i},fi.lowestPoint=function(t){for(var e=t[0],n=1;n<t.length;n++)t[n].y<e.y&&(e=t[n]);return e},fi.pointWithMinAngleWithSegment=function(t,e,n){for(var i=r.MAX_VALUE,s=null,o=0;o<t.length;o++){var a=t[o];if(a!==e&&a!==n){var u=hi.angleBetween(e,a,n);i>u&&(i=u,s=a)}}return s},e(gi.prototype,{getWidthCoordinate:function(){return this.computeMinimumDiameter(),this.minWidthPt},getSupportingSegment:function(){return this.computeMinimumDiameter(),this.inputGeom.getFactory().createLineString([this.minBaseSeg.p0,this.minBaseSeg.p1])},getDiameter:function(){if(this.computeMinimumDiameter(),null===this.minWidthPt)return this.inputGeom.getFactory().createLineString(null);var t=this.minBaseSeg.project(this.minWidthPt);return this.inputGeom.getFactory().createLineString([t,this.minWidthPt])},computeWidthConvex:function(t){t instanceof Tt?this.convexHullPts=t.getExteriorRing().getCoordinates():this.convexHullPts=t.getCoordinates(),0===this.convexHullPts.length?(this.minWidth=0,this.minWidthPt=null,this.minBaseSeg=null):1===this.convexHullPts.length?(this.minWidth=0,this.minWidthPt=this.convexHullPts[0],this.minBaseSeg.p0=this.convexHullPts[0],this.minBaseSeg.p1=this.convexHullPts[0]):2===this.convexHullPts.length||3===this.convexHullPts.length?(this.minWidth=0,this.minWidthPt=this.convexHullPts[0],this.minBaseSeg.p0=this.convexHullPts[0],this.minBaseSeg.p1=this.convexHullPts[1]):this.computeConvexRingMinDiameter(this.convexHullPts)},computeConvexRingMinDiameter:function(t){this.minWidth=r.MAX_VALUE;for(var e=1,n=new ce,i=0;i<t.length-1;i++)n.p0=t[i],n.p1=t[i+1],e=this.findMaxPerpDistance(t,n,e)},computeMinimumDiameter:function(){if(null!==this.minWidthPt)return null;if(this.isConvex)this.computeWidthConvex(this.inputGeom);else{var t=new me(this.inputGeom).getConvexHull();this.computeWidthConvex(t)}},getLength:function(){return this.computeMinimumDiameter(),this.minWidth},findMaxPerpDistance:function(t,e,n){for(var i=e.distancePerpendicular(t[n]),r=i,s=n,o=s;r>=i;)i=r,s=o,o=gi.nextIndex(t,s),r=e.distancePerpendicular(t[o]);return i<this.minWidth&&(this.minPtIndex=s,this.minWidth=i,this.minWidthPt=t[this.minPtIndex],this.minBaseSeg=new ce(e)),s},getMinimumRectangle:function(){if(this.computeMinimumDiameter(),0===this.minWidth)return this.minBaseSeg.p0.equals2D(this.minBaseSeg.p1)?this.inputGeom.getFactory().createPoint(this.minBaseSeg.p0):this.minBaseSeg.toGeometry(this.inputGeom.getFactory());for(var t=this.minBaseSeg.p1.x-this.minBaseSeg.p0.x,e=this.minBaseSeg.p1.y-this.minBaseSeg.p0.y,n=r.MAX_VALUE,i=-r.MAX_VALUE,s=r.MAX_VALUE,o=-r.MAX_VALUE,a=0;a<this.convexHullPts.length;a++){var u=gi.computeC(t,e,this.convexHullPts[a]);u>i&&(i=u),n>u&&(n=u);var l=gi.computeC(-e,t,this.convexHullPts[a]);l>o&&(o=l),s>l&&(s=l)}var h=gi.computeSegmentForLine(-t,-e,o),c=gi.computeSegmentForLine(-t,-e,s),f=gi.computeSegmentForLine(-e,t,i),g=gi.computeSegmentForLine(-e,t,n),d=f.lineIntersection(h),p=g.lineIntersection(h),v=g.lineIntersection(c),m=f.lineIntersection(c),y=this.inputGeom.getFactory().createLinearRing([d,p,v,m,d]);return this.inputGeom.getFactory().createPolygon(y,null)},interfaces_:function(){return[]},getClass:function(){return gi}}),gi.nextIndex=function(t,e){return e++,e>=t.length&&(e=0),e},gi.computeC=function(t,e,n){return t*n.y-e*n.x},gi.getMinimumDiameter=function(t){return new gi(t).getDiameter()},gi.getMinimumRectangle=function(t){return new gi(t).getMinimumRectangle()},gi.computeSegmentForLine=function(t,e,n){var i=null,r=null;return Math.abs(e)>Math.abs(t)?(i=new g(0,n/e),r=new g(1,n/e-t/e)):(i=new g(n/t,0),r=new g(n/t-e/t,1)),new ce(i,r)};var co=Object.freeze({Centroid:ge,CGAlgorithms:he,ConvexHull:me,InteriorPointArea:oi,InteriorPointLine:ui,InteriorPointPoint:li,RobustLineIntersector:ae,MinimumBoundingCircle:fi,MinimumDiameter:gi});e(di.prototype,{getResultGeometry:function(){return new pi(this.distanceTolerance).transform(this.inputGeom)},setDistanceTolerance:function(t){if(0>=t)throw new i("Tolerance must be positive");this.distanceTolerance=t},interfaces_:function(){return[]},getClass:function(){return di}}),di.densifyPoints=function(t,e,n){for(var i=new ce,r=new N,s=0;s<t.length-1;s++){i.p0=t[s],i.p1=t[s+1],r.add(i.p0,!1);var o=i.getLength(),a=Math.trunc(o/e)+1;if(a>1)for(var u=o/a,l=1;a>l;l++){var h=l*u/o,c=i.pointAlong(h);n.makePrecise(c),r.add(c,!1)}}return r.add(t[t.length-1],!1),r.toCoordinateArray()},di.densify=function(t,e){var n=new di(t);return n.setDistanceTolerance(e),n.getResultGeometry()},h(pi,xe),e(pi.prototype,{transformMultiPolygon:function(t,e){var n=xe.prototype.transformMultiPolygon.call(this,t,e);return this.createValidArea(n)},transformPolygon:function(t,e){var n=xe.prototype.transformPolygon.call(this,t,e);return e instanceof Ot?n:this.createValidArea(n)},transformCoordinates:function(t,e){var n=t.toCoordinateArray(),i=di.densifyPoints(n,this.distanceTolerance,e.getPrecisionModel());return e instanceof St&&1===i.length&&(i=new Array(0).fill(null)),this.factory.getCoordinateSequenceFactory().create(i)},createValidArea:function(t){return t.buffer(0)},interfaces_:function(){return[]},getClass:function(){return pi}}),di.DensifyTransformer=pi;var fo=Object.freeze({Densifier:di});e(vi.prototype,{find:function(t){var e=this;do{if(null===e)return null;if(e.dest().equals2D(t))return e;e=e.oNext()}while(e!==this);return null},dest:function(){return this._sym._orig},oNext:function(){return this._sym._next},insert:function(t){if(this.oNext()===this)return this.insertAfter(t),null;var e=this.compareTo(t),n=this;do{var i=n.oNext(),r=i.compareTo(t);if(r!==e||i===this)return n.insertAfter(t),null;n=i}while(n!==this);f.shouldNeverReachHere()},insertAfter:function(t){f.equals(this._orig,t.orig());var e=this.oNext();this._sym.setNext(t),t.sym().setNext(e)},degree:function t(){var t=0,e=this;do t++,e=e.oNext();while(e!==this);return t},equals:function(){if(2===arguments.length){var t=arguments[0],e=arguments[1];return this._orig.equals2D(t)&&this._sym._orig.equals(e)}},deltaY:function(){return this._sym._orig.y-this._orig.y},sym:function(){return this._sym},prev:function(){return this._sym.next()._sym},compareAngularDirection:function(t){var e=this.deltaX(),n=this.deltaY(),i=t.deltaX(),r=t.deltaY();if(e===i&&n===r)return 0;var s=Je.quadrant(e,n),o=Je.quadrant(i,r);return s>o?1:o>s?-1:he.computeOrientation(t._orig,t.dest(),this.dest())},prevNode:function(){for(var t=this;2===t.degree();)if(t=t.prev(),t===this)return null;return t},compareTo:function(t){var e=t,n=this.compareAngularDirection(e);return n},next:function(){return this._next},setSym:function(t){this._sym=t},orig:function(){return this._orig},toString:function(){return"HE("+this._orig.x+" "+this._orig.y+", "+this._sym._orig.x+" "+this._sym._orig.y+")"},setNext:function(t){this._next=t},init:function(t){this.setSym(t),t.setSym(this),this.setNext(t),t.setNext(this)},deltaX:function(){return this._sym._orig.x-this._orig.x},interfaces_:function(){return[]},getClass:function(){return vi}}),vi.init=function(t,e){if(null!==t._sym||null!==e._sym||null!==t._next||null!==e._next)throw new IllegalStateException("Edges are already initialized");return t.init(e),t},vi.create=function(t,e){var n=new vi(t),i=new vi(e);return n.init(i),n},h(mi,vi),e(mi.prototype,{mark:function(){this._isMarked=!0},setMark:function(t){this._isMarked=t},isMarked:function(){return this._isMarked},interfaces_:function(){return[]},getClass:function(){return mi}}),mi.setMarkBoth=function(t,e){t.setMark(e),t.sym().setMark(e)},mi.isMarked=function(t){return t.isMarked()},mi.setMark=function(t,e){t.setMark(e)},mi.markBoth=function(t){t.mark(),t.sym().mark()},mi.mark=function(t){t.mark()},e(yi.prototype,{insert:function(t,e,n){var i=this.create(t,e);null!==n?n.insert(i):this.vertexMap.put(t,i);var r=this.vertexMap.get(e);return null!==r?r.insert(i.sym()):this.vertexMap.put(e,i.sym()),i},create:function(t,e){var n=this.createEdge(t),i=this.createEdge(e);return vi.init(n,i),n},createEdge:function(t){return new vi(t)},addEdge:function(t,e){if(!yi.isValidEdge(t,e))return null;var n=this.vertexMap.get(t),i=null;if(null!==n&&(i=n.find(e)),null!==i)return i;var r=this.insert(t,e,n);return r},getVertexEdges:function(){return this.vertexMap.values()},findEdge:function(t,e){var n=this.vertexMap.get(t);return null===n?null:n.find(e)},interfaces_:function(){return[]},getClass:function(){return yi}}),yi.isValidEdge=function(t,e){var n=e.compareTo(t);return 0!==n},h(xi,mi),e(xi.prototype,{setStart:function(){this._isStart=!0},isStart:function(){return this._isStart},interfaces_:function(){return[]},getClass:function(){return xi}}),h(Ei,yi),e(Ei.prototype,{createEdge:function(t){return new xi(t)},interfaces_:function(){return[]},getClass:function(){return Ei}}),e(Ii.prototype,{addLine:function(t){this.lines.add(this.factory.createLineString(t.toCoordinateArray()))},updateRingStartEdge:function(t){return t.isStart()||(t=t.sym(),t.isStart())?null===this.ringStartEdge?(this.ringStartEdge=t,null):void(t.orig().compareTo(this.ringStartEdge.orig())<0&&(this.ringStartEdge=t)):null},getResult:function(){return null===this.result&&this.computeResult(),this.result},process:function(t){var e=t.prevNode();null===e&&(e=t),this.stackEdges(e),this.buildLines()},buildRing:function(t){var e=new N,n=t;for(e.add(n.orig().copy(),!1);2===n.sym().degree();){var i=n.next();if(i===t)break;e.add(i.orig().copy(),!1),n=i}e.add(n.dest().copy(),!1),this.addLine(e)},buildLine:function(t){var e=new N,n=t;for(this.ringStartEdge=null,mi.markBoth(n),e.add(n.orig().copy(),!1);2===n.sym().degree();){this.updateRingStartEdge(n);var i=n.next();if(i===t)return this.buildRing(this.ringStartEdge),null;e.add(i.orig().copy(),!1),n=i,mi.markBoth(n)}e.add(n.dest().copy(),!1),this.stackEdges(n.sym()),this.addLine(e)},stackEdges:function(t){var e=t;do mi.isMarked(e)||this.nodeEdgeStack.add(e),e=e.oNext();while(e!==t)},computeResult:function(){for(var t=this.graph.getVertexEdges(),e=t.iterator();e.hasNext();){var n=e.next();mi.isMarked(n)||this.process(n)}this.result=this.factory.buildGeometry(this.lines)},buildLines:function(){for(;!this.nodeEdgeStack.empty();){var t=this.nodeEdgeStack.pop();mi.isMarked(t)||this.buildLine(t)}},add:function(){if(arguments[0]instanceof B){var t=arguments[0];t.apply({interfaces_:function(){return[q]},filter:function(t){t instanceof St&&this.add(t)}})}else if(R(arguments[0],v))for(var e=arguments[0],n=e.iterator();n.hasNext();){var i=n.next();this.add(i)}else if(arguments[0]instanceof St){var r=arguments[0];null===this.factory&&(this.factory=r.getFactory());for(var s=r.getCoordinateSequence(),o=!1,n=1;n<s.size();n++){var a=this.graph.addEdge(s.getCoordinate(n-1),s.getCoordinate(n));null!==a&&(o||(a.setStart(),o=!0))}}},interfaces_:function(){return[]},getClass:function(){return Ii}}),Ii.dissolve=function(t){var e=new Ii;return e.add(t),e.getResult()};var go=Object.freeze({LineDissolver:Ii});e(Ni.prototype,{hasChildren:function(){for(var t=0;4>t;t++)if(null!==this.subnode[t])return!0;return!1},isPrunable:function(){return!(this.hasChildren()||this.hasItems())},addAllItems:function(t){t.addAll(this.items);for(var e=0;4>e;e++)null!==this.subnode[e]&&this.subnode[e].addAllItems(t);return t},getNodeCount:function(){for(var t=0,e=0;4>e;e++)null!==this.subnode[e]&&(t+=this.subnode[e].size());return t+1},size:function(){for(var t=0,e=0;4>e;e++)null!==this.subnode[e]&&(t+=this.subnode[e].size());return t+this.items.size()},addAllItemsFromOverlapping:function(t,e){if(!this.isSearchMatch(t))return null;e.addAll(this.items);for(var n=0;4>n;n++)null!==this.subnode[n]&&this.subnode[n].addAllItemsFromOverlapping(t,e)},visitItems:function(t,e){for(var n=this.items.iterator();n.hasNext();)e.visitItem(n.next())},hasItems:function(){return!this.items.isEmpty()},remove:function(t,e){if(!this.isSearchMatch(t))return!1;for(var n=!1,i=0;4>i;i++)if(null!==this.subnode[i]&&(n=this.subnode[i].remove(t,e))){this.subnode[i].isPrunable()&&(this.subnode[i]=null);break}return n?n:n=this.items.remove(e)},visit:function(t,e){if(!this.isSearchMatch(t))return null;this.visitItems(t,e);for(var n=0;4>n;n++)null!==this.subnode[n]&&this.subnode[n].visit(t,e)},getItems:function(){return this.items},depth:function(){for(var t=0,e=0;4>e;e++)if(null!==this.subnode[e]){var n=this.subnode[e].depth();n>t&&(t=n)}return t+1},isEmpty:function t(){var t=!0;this.items.isEmpty()||(t=!1);for(var e=0;4>e;e++)null!==this.subnode[e]&&(this.subnode[e].isEmpty()||(t=!1));return t},add:function(t){this.items.add(t)},interfaces_:function(){return[u]},getClass:function(){return Ni}}),Ni.getSubnodeIndex=function(t,e,n){var i=-1;return t.getMinX()>=e&&(t.getMinY()>=n&&(i=3),t.getMaxY()<=n&&(i=1)),t.getMaxX()<=e&&(t.getMinY()>=n&&(i=2),t.getMaxY()<=n&&(i=0)),i},Ci.exponent=function(t){return Si(64,t)-1023},Ci.powerOf2=function(t){return Math.pow(2,t)},e(wi.prototype,{getLevel:function(){return this.level},computeKey:function(){if(1===arguments.length){var t=arguments[0];for(this.level=wi.computeQuadLevel(t),this.env=new C,this.computeKey(this.level,t);!this.env.contains(t);)this.level+=1,this.computeKey(this.level,t)}else if(2===arguments.length){var e=arguments[0],n=arguments[1],i=Ci.powerOf2(e);this.pt.x=Math.floor(n.getMinX()/i)*i,this.pt.y=Math.floor(n.getMinY()/i)*i,this.env.init(this.pt.x,this.pt.x+i,this.pt.y,this.pt.y+i)}},getEnvelope:function(){return this.env},getCentre:function(){return new g((this.env.getMinX()+this.env.getMaxX())/2,(this.env.getMinY()+this.env.getMaxY())/2)},getPoint:function(){return this.pt},interfaces_:function(){return[]},getClass:function(){return wi}}),wi.computeQuadLevel=function(t){var e=t.getWidth(),n=t.getHeight(),i=e>n?e:n,r=Ci.exponent(i)+1;return r},h(Li,Ni),e(Li.prototype,{find:function(t){var e=Ni.getSubnodeIndex(t,this.centrex,this.centrey);if(-1===e)return this;if(null!==this.subnode[e]){var n=this.subnode[e];return n.find(t)}return this},isSearchMatch:function(t){return this.env.intersects(t)},getSubnode:function(t){return null===this.subnode[t]&&(this.subnode[t]=this.createSubnode(t)),this.subnode[t]},getEnvelope:function(){return this.env},getNode:function(t){var e=Ni.getSubnodeIndex(t,this.centrex,this.centrey);if(-1!==e){var n=this.getSubnode(e);return n.getNode(t)}return this},createSubnode:function(t){var e=0,n=0,i=0,r=0;switch(t){case 0:e=this.env.getMinX(),n=this.centrex,i=this.env.getMinY(),r=this.centrey;break;case 1:e=this.centrex,n=this.env.getMaxX(),i=this.env.getMinY(),r=this.centrey;break;case 2:e=this.env.getMinX(),n=this.centrex,i=this.centrey,r=this.env.getMaxY();break;case 3:e=this.centrex,n=this.env.getMaxX(),i=this.centrey,r=this.env.getMaxY()}var s=new C(e,n,i,r),o=new Li(s,this.level-1);return o},insertNode:function(t){f.isTrue(null===this.env||this.env.contains(t.env));var e=Ni.getSubnodeIndex(t.env,this.centrex,this.centrey);if(t.level===this.level-1)this.subnode[e]=t;else{var n=this.createSubnode(e);n.insertNode(t),this.subnode[e]=n}},interfaces_:function(){return[]},getClass:function(){return Li}}),Li.createNode=function(t){var e=new wi(t),n=new Li(e.getEnvelope(),e.getLevel());return n},Li.createExpanded=function(t,e){var n=new C(e);null!==t&&n.expandToInclude(t.env);var i=Li.createNode(n);return null!==t&&i.insertNode(t),i},e(Ri.prototype,{interfaces_:function(){return[]},getClass:function(){return Ri}}),Ri.isZeroWidth=function(t,e){var n=e-t;if(0===n)return!0;var i=Math.max(Math.abs(t),Math.abs(e)),r=n/i,s=Ci.exponent(r);return s<=Ri.MIN_BINARY_EXPONENT},Ri.MIN_BINARY_EXPONENT=-50,h(Ti,Ni),e(Ti.prototype,{insert:function(t,e){var n=Ni.getSubnodeIndex(t,Ti.origin.x,Ti.origin.y);if(-1===n)return this.add(e),null;var i=this.subnode[n];if(null===i||!i.getEnvelope().contains(t)){var r=Li.createExpanded(i,t);this.subnode[n]=r}this.insertContained(this.subnode[n],t,e)},isSearchMatch:function(t){return!0},insertContained:function(t,e,n){f.isTrue(t.getEnvelope().contains(e));var i=Ri.isZeroWidth(e.getMinX(),e.getMaxX()),r=Ri.isZeroWidth(e.getMinY(),e.getMaxY()),s=null;s=i||r?t.find(e):t.getNode(e),s.add(n)},interfaces_:function(){return[]},getClass:function(){return Ti}}),Ti.origin=new g(0,0),e(Pi.prototype,{size:function(){return null!==this.root?this.root.size():0},insert:function(t,e){this.collectStats(t);var n=Pi.ensureExtent(t,this.minExtent);this.root.insert(n,e)},query:function(){if(1===arguments.length){var t=arguments[0],e=new Yn;return this.query(t,e),e.getItems()}if(2===arguments.length){var n=arguments[0],i=arguments[1];this.root.visit(n,i)}},queryAll:function(){var t=new I;return this.root.addAllItems(t),
t},remove:function(t,e){var n=Pi.ensureExtent(t,this.minExtent);return this.root.remove(n,e)},collectStats:function(t){var e=t.getWidth();e<this.minExtent&&e>0&&(this.minExtent=e);var n=t.getHeight();n<this.minExtent&&n>0&&(this.minExtent=n)},depth:function(){return null!==this.root?this.root.depth():0},isEmpty:function(){return null===this.root},interfaces_:function(){return[Fe,u]},getClass:function(){return Pi}}),Pi.ensureExtent=function(t,e){var n=t.getMinX(),i=t.getMaxX(),r=t.getMinY(),s=t.getMaxY();return n!==i&&r!==s?t:(n===i&&(n-=e/2,i=n+e/2),r===s&&(r-=e/2,s=r+e/2),new C(n,i,r,s))},Pi.serialVersionUID=-0x678b60c967a25400;var po=Object.freeze({Quadtree:Pi}),vo=Object.freeze({STRtree:ke}),mo=Object.freeze({quadtree:po,strtree:vo}),yo=["Point","MultiPoint","LineString","MultiLineString","Polygon","MultiPolygon"];e(bi.prototype,{read:function(t){var e=void 0;e="string"==typeof t?JSON.parse(t):t;var n=e.type;if(!xo[n])throw new Error("Unknown GeoJSON type: "+e.type);return-1!==yo.indexOf(n)?xo[n].apply(this,[e.coordinates]):"GeometryCollection"===n?xo[n].apply(this,[e.geometries]):xo[n].apply(this,[e])},write:function(t){var e=t.getGeometryType();if(!Eo[e])throw new Error("Geometry is not supported");return Eo[e].apply(this,[t])}});var xo={Feature:function(t){var e={};for(var n in t)e[n]=t[n];if(t.geometry){var i=t.geometry.type;if(!xo[i])throw new Error("Unknown GeoJSON type: "+t.type);e.geometry=this.read(t.geometry)}return t.bbox&&(e.bbox=xo.bbox.apply(this,[t.bbox])),e},FeatureCollection:function(t){var e={};if(t.features){e.features=[];for(var n=0;n<t.features.length;++n)e.features.push(this.read(t.features[n]))}return t.bbox&&(e.bbox=this.parse.bbox.apply(this,[t.bbox])),e},coordinates:function t(e){for(var t=[],n=0;n<e.length;++n){var i=e[n];t.push(new g(i[0],i[1]))}return t},bbox:function(t){return this.geometryFactory.createLinearRing([new g(t[0],t[1]),new g(t[2],t[1]),new g(t[2],t[3]),new g(t[0],t[3]),new g(t[0],t[1])])},Point:function(t){var e=new g(t[0],t[1]);return this.geometryFactory.createPoint(e)},MultiPoint:function(t){for(var e=[],n=0;n<t.length;++n)e.push(xo.Point.apply(this,[t[n]]));return this.geometryFactory.createMultiPoint(e)},LineString:function(t){var e=xo.coordinates.apply(this,[t]);return this.geometryFactory.createLineString(e)},MultiLineString:function(t){for(var e=[],n=0;n<t.length;++n)e.push(xo.LineString.apply(this,[t[n]]));return this.geometryFactory.createMultiLineString(e)},Polygon:function(t){for(var e=xo.coordinates.apply(this,[t[0]]),n=this.geometryFactory.createLinearRing(e),i=[],r=1;r<t.length;++r){var s=t[r],o=xo.coordinates.apply(this,[s]),a=this.geometryFactory.createLinearRing(o);i.push(a)}return this.geometryFactory.createPolygon(n,i)},MultiPolygon:function(t){for(var e=[],n=0;n<t.length;++n){var i=t[n];e.push(xo.Polygon.apply(this,[i]))}return this.geometryFactory.createMultiPolygon(e)},GeometryCollection:function(t){for(var e=[],n=0;n<t.length;++n){var i=t[n];e.push(this.read(i))}return this.geometryFactory.createGeometryCollection(e)}},Eo={coordinate:function(t){return[t.x,t.y]},Point:function(t){var e=Eo.coordinate.apply(this,[t.getCoordinate()]);return{type:"Point",coordinates:e}},MultiPoint:function(t){for(var e=[],n=0;n<t.geometries.length;++n){var i=t.geometries[n],r=Eo.Point.apply(this,[i]);e.push(r.coordinates)}return{type:"MultiPoint",coordinates:e}},LineString:function(t){for(var e=[],n=t.getCoordinates(),i=0;i<n.length;++i){var r=n[i];e.push(Eo.coordinate.apply(this,[r]))}return{type:"LineString",coordinates:e}},MultiLineString:function(t){for(var e=[],n=0;n<t.geometries.length;++n){var i=t.geometries[n],r=Eo.LineString.apply(this,[i]);e.push(r.coordinates)}return{type:"MultiLineString",coordinates:e}},Polygon:function(t){var e=[],n=Eo.LineString.apply(this,[t.shell]);e.push(n.coordinates);for(var i=0;i<t.holes.length;++i){var r=t.holes[i],s=Eo.LineString.apply(this,[r]);e.push(s.coordinates)}return{type:"Polygon",coordinates:e}},MultiPolygon:function(t){for(var e=[],n=0;n<t.geometries.length;++n){var i=t.geometries[n],r=Eo.Polygon.apply(this,[i]);e.push(r.coordinates)}return{type:"MultiPolygon",coordinates:e}},GeometryCollection:function(t){for(var e=[],n=0;n<t.geometries.length;++n){var i=t.geometries[n],r=i.getGeometryType();e.push(Eo[r].apply(this,[i]))}return{type:"GeometryCollection",geometries:e}}};e(Oi.prototype,{read:function(t){var e=this.parser.read(t);return this.precisionModel.getType()===ee.FIXED&&this.reducePrecision(e),e},reducePrecision:function(t){var e,n;if(t.coordinate)this.precisionModel.makePrecise(t.coordinate);else if(t.points)for(e=0,n=t.points.length;n>e;e++)this.precisionModel.makePrecise(t.points[e]);else if(t.geometries)for(e=0,n=t.geometries.length;n>e;e++)this.reducePrecision(t.geometries[e])}}),e(_i.prototype,{write:function(t){return this.parser.write(t)}}),e(Mi.prototype,{read:function(t){var e=this.parser.read(t);return this.precisionModel.getType()===ee.FIXED&&this.reducePrecision(e),e},reducePrecision:function(t){if(t.coordinate)this.precisionModel.makePrecise(t.coordinate);else if(t.points)for(var e=0,n=t.points.coordinates.length;n>e;e++)this.precisionModel.makePrecise(t.points.coordinates[e]);else if(t.geometries)for(var i=0,r=t.geometries.length;r>i;i++)this.reducePrecision(t.geometries[i])}}),e(Ai.prototype,{read:function(t){return t instanceof ol.geom.Point?this.convertFromPoint(t):t instanceof ol.geom.LineString?this.convertFromLineString(t):t instanceof ol.geom.LinearRing?this.convertFromLinearRing(t):t instanceof ol.geom.Polygon?this.convertFromPolygon(t):t instanceof ol.geom.MultiPoint?this.convertFromMultiPoint(t):t instanceof ol.geom.MultiLineString?this.convertFromMultiLineString(t):t instanceof ol.geom.MultiPolygon?this.convertFromMultiPolygon(t):t instanceof ol.geom.GeometryCollection?this.convertFromCollection(t):void 0},convertFromPoint:function(t){var e=t.getCoordinates();return this.geometryFactory.createPoint(new g(e[0],e[1]))},convertFromLineString:function(t){return this.geometryFactory.createLineString(t.getCoordinates().map(function(t){return new g(t[0],t[1])}))},convertFromLinearRing:function(t){return this.geometryFactory.createLinearRing(t.getCoordinates().map(function(t){return new g(t[0],t[1])}))},convertFromPolygon:function(t){for(var e=t.getLinearRings(),n=null,i=[],r=0;r<e.length;r++){var s=this.convertFromLinearRing(e[r]);0===r?n=s:i.push(s)}return this.geometryFactory.createPolygon(n,i)},convertFromMultiPoint:function(t){var e=t.getPoints().map(function(t){return this.convertFromPoint(t)},this);return this.geometryFactory.createMultiPoint(e)},convertFromMultiLineString:function(t){var e=t.getLineStrings().map(function(t){return this.convertFromLineString(t)},this);return this.geometryFactory.createMultiLineString(e)},convertFromMultiPolygon:function(t){var e=t.getPolygons().map(function(t){return this.convertFromPolygon(t)},this);return this.geometryFactory.createMultiPolygon(e)},convertFromCollection:function(t){var e=t.getGeometries().map(function(t){return this.read(t)},this);return this.geometryFactory.createGeometryCollection(e)},write:function(t){return"Point"===t.getGeometryType()?this.convertToPoint(t.getCoordinate()):"LineString"===t.getGeometryType()?this.convertToLineString(t):"LinearRing"===t.getGeometryType()?this.convertToLinearRing(t):"Polygon"===t.getGeometryType()?this.convertToPolygon(t):"MultiPoint"===t.getGeometryType()?this.convertToMultiPoint(t):"MultiLineString"===t.getGeometryType()?this.convertToMultiLineString(t):"MultiPolygon"===t.getGeometryType()?this.convertToMultiPolygon(t):"GeometryCollection"===t.getGeometryType()?this.convertToCollection(t):void 0},convertToPoint:function(t){return new ol.geom.Point([t.x,t.y])},convertToLineString:function(t){var e=t.points.coordinates.map(Di);return new ol.geom.LineString(e)},convertToLinearRing:function(t){var e=t.points.coordinates.map(Di);return new ol.geom.LinearRing(e)},convertToPolygon:function(t){for(var e=[t.shell.points.coordinates.map(Di)],n=0;n<t.holes.length;n++)e.push(t.holes[n].points.coordinates.map(Di));return new ol.geom.Polygon(e)},convertToMultiPoint:function(t){return new ol.geom.MultiPoint(t.getCoordinates().map(Di))},convertToMultiLineString:function(t){for(var e=[],n=0;n<t.geometries.length;n++)e.push(this.convertToLineString(t.geometries[n]).getCoordinates());return new ol.geom.MultiLineString(e)},convertToMultiPolygon:function(t){for(var e=[],n=0;n<t.geometries.length;n++)e.push(this.convertToPolygon(t.geometries[n]).getCoordinates());return new ol.geom.MultiPolygon(e)},convertToCollection:function(t){for(var e=[],n=0;n<t.geometries.length;n++){var i=t.geometries[n];e.push(this.write(i))}return new ol.geom.GeometryCollection(e)}});var Io=Object.freeze({GeoJSONReader:Oi,GeoJSONWriter:_i,OL3Parser:Ai,WKTReader:Mi,WKTWriter:se});e(Fi.prototype,{rescale:function(){if(R(arguments[0],v))for(var t=arguments[0],e=t.iterator();e.hasNext();){var n=e.next();this.rescale(n.getCoordinates())}else if(arguments[0]instanceof Array){var i=arguments[0],r=null,s=null;2===i.length&&(r=new g(i[0]),s=new g(i[1]));for(var e=0;e<i.length;e++)i[e].x=i[e].x/this.scaleFactor+this.offsetX,i[e].y=i[e].y/this.scaleFactor+this.offsetY;2===i.length&&i[0].equals2D(i[1])&&A.out.println(i)}},scale:function(){if(R(arguments[0],v)){for(var t=arguments[0],e=new I,n=t.iterator();n.hasNext();){var i=n.next();e.add(new Ke(this.scale(i.getCoordinates()),i.getData()))}return e}if(arguments[0]instanceof Array){for(var r=arguments[0],s=new Array(r.length).fill(null),n=0;n<r.length;n++)s[n]=new g(Math.round((r[n].x-this.offsetX)*this.scaleFactor),Math.round((r[n].y-this.offsetY)*this.scaleFactor),r[n].z);var o=H.removeRepeatedPoints(s);return o}},isIntegerPrecision:function(){return 1===this.scaleFactor},getNodedSubstrings:function(){var t=this.noder.getNodedSubstrings();return this.isScaled&&this.rescale(t),t},computeNodes:function(t){var e=t;this.isScaled&&(e=this.scale(t)),this.noder.computeNodes(e)},interfaces_:function(){return[tn]},getClass:function(){return Fi}});var No=Object.freeze({MCIndexNoder:nn,ScaledNoder:Fi,SegmentString:be});e(Gi.prototype,{isSimpleMultiPoint:function(t){if(t.isEmpty())return!0;for(var e=new at,n=0;n<t.getNumGeometries();n++){var i=t.getGeometryN(n),r=i.getCoordinate();if(e.contains(r))return this.nonSimpleLocation=r,!1;e.add(r)}return!0},isSimplePolygonal:function(t){for(var e=kn.getLines(t),n=e.iterator();n.hasNext();){var i=n.next();if(!this.isSimpleLinearGeometry(i))return!1}return!0},hasClosedEndpointIntersection:function(t){for(var e=new rt,n=t.getEdgeIterator();n.hasNext();){var i=n.next(),r=(i.getMaximumSegmentIndex(),i.isClosed()),s=i.getCoordinate(0);this.addEndpoint(e,s,r);var o=i.getCoordinate(i.getNumPoints()-1);this.addEndpoint(e,o,r)}for(var n=e.values().iterator();n.hasNext();){var a=n.next();if(a.isClosed&&2!==a.degree)return this.nonSimpleLocation=a.getCoordinate(),!0}return!1},getNonSimpleLocation:function(){return this.nonSimpleLocation},isSimpleLinearGeometry:function(t){if(t.isEmpty())return!0;var e=new $n(0,t),n=new ae,i=e.computeSelfNodes(n,!0);return i.hasIntersection()?i.hasProperIntersection()?(this.nonSimpleLocation=i.getProperIntersectionPoint(),!1):this.hasNonEndpointIntersection(e)?!1:!this.isClosedEndpointsInInterior||!this.hasClosedEndpointIntersection(e):!0},hasNonEndpointIntersection:function(t){for(var e=t.getEdgeIterator();e.hasNext();)for(var n=e.next(),i=n.getMaximumSegmentIndex(),r=n.getEdgeIntersectionList().iterator();r.hasNext();){var s=r.next();if(!s.isEndPoint(i))return this.nonSimpleLocation=s.getCoordinate(),!0}return!1},addEndpoint:function(t,e,n){var i=t.get(e);null===i&&(i=new qi(e),t.put(e,i)),i.addEndpoint(n)},computeSimple:function(t){return this.nonSimpleLocation=null,t.isEmpty()?!0:t instanceof St?this.isSimpleLinearGeometry(t):t instanceof gt?this.isSimpleLinearGeometry(t):t instanceof Pt?this.isSimpleMultiPoint(t):R(t,Rt)?this.isSimplePolygonal(t):t instanceof ft?this.isSimpleGeometryCollection(t):!0},isSimple:function(){return this.nonSimpleLocation=null,this.computeSimple(this.inputGeom)},isSimpleGeometryCollection:function(t){for(var e=0;e<t.getNumGeometries();e++){var n=t.getGeometryN(e);if(!this.computeSimple(n))return!1}return!0},interfaces_:function(){return[]},getClass:function(){return Gi}}),e(qi.prototype,{addEndpoint:function(t){this.degree++,this.isClosed|=t},getCoordinate:function(){return this.pt},interfaces_:function(){return[]},getClass:function(){return qi}}),Gi.EndpointInfo=qi,e(Bi.prototype,{getEndCapStyle:function(){return this.endCapStyle},isSingleSided:function(){return this._isSingleSided},setQuadrantSegments:function(t){this.quadrantSegments=t,0===this.quadrantSegments&&(this.joinStyle=Bi.JOIN_BEVEL),this.quadrantSegments<0&&(this.joinStyle=Bi.JOIN_MITRE,this.mitreLimit=Math.abs(this.quadrantSegments)),0>=t&&(this.quadrantSegments=1),this.joinStyle!==Bi.JOIN_ROUND&&(this.quadrantSegments=Bi.DEFAULT_QUADRANT_SEGMENTS)},getJoinStyle:function(){return this.joinStyle},setJoinStyle:function(t){this.joinStyle=t},setSimplifyFactor:function(t){this.simplifyFactor=0>t?0:t},getSimplifyFactor:function(){return this.simplifyFactor},getQuadrantSegments:function(){return this.quadrantSegments},setEndCapStyle:function(t){this.endCapStyle=t},getMitreLimit:function(){return this.mitreLimit},setMitreLimit:function(t){this.mitreLimit=t},setSingleSided:function(t){this._isSingleSided=t},interfaces_:function(){return[]},getClass:function(){return Bi}}),Bi.bufferDistanceError=function(t){var e=Math.PI/2/t;return 1-Math.cos(e/2)},Bi.CAP_ROUND=1,Bi.CAP_FLAT=2,Bi.CAP_SQUARE=3,Bi.JOIN_ROUND=1,Bi.JOIN_MITRE=2,Bi.JOIN_BEVEL=3,Bi.DEFAULT_QUADRANT_SEGMENTS=8,Bi.DEFAULT_MITRE_LIMIT=5,Bi.DEFAULT_SIMPLIFY_FACTOR=.01,e(zi.prototype,{getCoordinate:function(){return this.minCoord},getRightmostSide:function(t,e){var n=this.getRightmostSideOfSegment(t,e);return 0>n&&(n=this.getRightmostSideOfSegment(t,e-1)),0>n&&(this.minCoord=null,this.checkForRightmostCoordinate(t)),n},findRightmostEdgeAtVertex:function(){var t=this.minDe.getEdge().getCoordinates();f.isTrue(this.minIndex>0&&this.minIndex<t.length,"rightmost point expected to be interior vertex of edge");var e=t[this.minIndex-1],n=t[this.minIndex+1],i=he.computeOrientation(this.minCoord,n,e),r=!1;e.y<this.minCoord.y&&n.y<this.minCoord.y&&i===he.COUNTERCLOCKWISE?r=!0:e.y>this.minCoord.y&&n.y>this.minCoord.y&&i===he.CLOCKWISE&&(r=!0),r&&(this.minIndex=this.minIndex-1)},getRightmostSideOfSegment:function(t,e){var n=t.getEdge(),i=n.getCoordinates();if(0>e||e+1>=i.length)return-1;if(i[e].y===i[e+1].y)return-1;var r=cn.LEFT;return i[e].y<i[e+1].y&&(r=cn.RIGHT),r},getEdge:function(){return this.orientedDe},checkForRightmostCoordinate:function(t){for(var e=t.getEdge().getCoordinates(),n=0;n<e.length-1;n++)(null===this.minCoord||e[n].x>this.minCoord.x)&&(this.minDe=t,this.minIndex=n,this.minCoord=e[n])},findRightmostEdgeAtNode:function(){var t=this.minDe.getNode(),e=t.getEdges();this.minDe=e.getRightmostEdge(),this.minDe.isForward()||(this.minDe=this.minDe.getSym(),this.minIndex=this.minDe.getEdge().getCoordinates().length-1)},findEdge:function(t){for(var e=t.iterator();e.hasNext();){var n=e.next();n.isForward()&&this.checkForRightmostCoordinate(n)}f.isTrue(0!==this.minIndex||this.minCoord.equals(this.minDe.getCoordinate()),"inconsistency in rightmost processing"),0===this.minIndex?this.findRightmostEdgeAtNode():this.findRightmostEdgeAtVertex(),this.orientedDe=this.minDe;var i=this.getRightmostSide(this.minDe,this.minIndex);i===cn.LEFT&&(this.orientedDe=this.minDe.getSym())},interfaces_:function(){return[]},getClass:function(){return zi}}),Vi.prototype.addLast=function(t){this.array_.push(t)},Vi.prototype.removeFirst=function(){return this.array_.shift()},Vi.prototype.isEmpty=function(){return 0===this.array_.length},e(ki.prototype,{clearVisitedEdges:function(){for(var t=this.dirEdgeList.iterator();t.hasNext();){var e=t.next();e.setVisited(!1)}},getRightmostCoordinate:function(){return this.rightMostCoord},computeNodeDepth:function(t){for(var e=null,n=t.getEdges().iterator();n.hasNext();){var i=n.next();if(i.isVisited()||i.getSym().isVisited()){e=i;break}}if(null===e)throw new sn("unable to find edge to compute depths at "+t.getCoordinate());t.getEdges().computeDepths(e);for(var n=t.getEdges().iterator();n.hasNext();){var i=n.next();i.setVisited(!0),this.copySymDepths(i)}},computeDepth:function(t){this.clearVisitedEdges();var e=this.finder.getEdge();e.getNode(),e.getLabel();e.setEdgeDepths(cn.RIGHT,t),this.copySymDepths(e),this.computeDepths(e)},create:function(t){this.addReachable(t),this.finder.findEdge(this.dirEdgeList),this.rightMostCoord=this.finder.getCoordinate()},findResultEdges:function(){for(var t=this.dirEdgeList.iterator();t.hasNext();){var e=t.next();e.getDepth(cn.RIGHT)>=1&&e.getDepth(cn.LEFT)<=0&&!e.isInteriorAreaEdge()&&e.setInResult(!0)}},computeDepths:function(t){var e=new J,n=new Vi,i=t.getNode();for(n.addLast(i),e.add(i),t.setVisited(!0);!n.isEmpty();){var r=n.removeFirst();e.add(r),this.computeNodeDepth(r);for(var s=r.getEdges().iterator();s.hasNext();){var o=s.next(),a=o.getSym();if(!a.isVisited()){var u=a.getNode();e.contains(u)||(n.addLast(u),e.add(u))}}}},compareTo:function(t){var e=t;return this.rightMostCoord.x<e.rightMostCoord.x?-1:this.rightMostCoord.x>e.rightMostCoord.x?1:0},getEnvelope:function(){if(null===this.env){for(var t=new C,e=this.dirEdgeList.iterator();e.hasNext();)for(var n=e.next(),i=n.getEdge().getCoordinates(),r=0;r<i.length-1;r++)t.expandToInclude(i[r]);this.env=t}return this.env},addReachable:function(t){var e=new pe;for(e.add(t);!e.empty();){var n=e.pop();this.add(n,e)}},copySymDepths:function(t){var e=t.getSym();e.setDepth(cn.LEFT,t.getDepth(cn.RIGHT)),e.setDepth(cn.RIGHT,t.getDepth(cn.LEFT))},add:function(t,e){t.setVisited(!0),this.nodes.add(t);for(var n=t.getEdges().iterator();n.hasNext();){var i=n.next();this.dirEdgeList.add(i);var r=i.getSym(),s=r.getNode();s.isVisited()||e.push(s)}},getNodes:function(){return this.nodes},getDirectedEdges:function(){return this.dirEdgeList},interfaces_:function(){return[s]},getClass:function(){return ki}}),e(Yi.prototype,{isDeletable:function(t,e,n,i){var r=this.inputLine[t],s=this.inputLine[e],o=this.inputLine[n];return this.isConcave(r,s,o)&&this.isShallow(r,s,o,i)?this.isShallowSampled(r,s,t,n,i):!1},deleteShallowConcavities:function(){for(var t=1,e=(this.inputLine.length-1,this.findNextNonDeletedIndex(t)),n=this.findNextNonDeletedIndex(e),i=!1;n<this.inputLine.length;){var r=!1;this.isDeletable(t,e,n,this.distanceTol)&&(this.isDeleted[e]=Yi.DELETE,r=!0,i=!0),t=r?n:e,e=this.findNextNonDeletedIndex(t),n=this.findNextNonDeletedIndex(e)}return i},isShallowConcavity:function(t,e,n,i){var r=he.computeOrientation(t,e,n),s=r===this.angleOrientation;if(!s)return!1;var o=he.distancePointLine(e,t,n);return i>o},isShallowSampled:function(t,e,n,i,r){var s=Math.trunc((i-n)/Yi.NUM_PTS_TO_CHECK);0>=s&&(s=1);for(var o=n;i>o;o+=s)if(!this.isShallow(t,e,this.inputLine[o],r))return!1;return!0},isConcave:function t(e,n,i){var r=he.computeOrientation(e,n,i),t=r===this.angleOrientation;return t},simplify:function(t){this.distanceTol=Math.abs(t),0>t&&(this.angleOrientation=he.CLOCKWISE),this.isDeleted=new Array(this.inputLine.length).fill(null);var e=!1;do e=this.deleteShallowConcavities();while(e);return this.collapseLine()},findNextNonDeletedIndex:function(t){for(var e=t+1;e<this.inputLine.length&&this.isDeleted[e]===Yi.DELETE;)e++;return e},isShallow:function(t,e,n,i){var r=he.distancePointLine(e,t,n);return i>r},collapseLine:function(){for(var t=new N,e=0;e<this.inputLine.length;e++)this.isDeleted[e]!==Yi.DELETE&&t.add(this.inputLine[e]);return t.toCoordinateArray()},interfaces_:function(){return[]},getClass:function(){return Yi}}),Yi.simplify=function(t,e){var n=new Yi(t);return n.simplify(e)},Yi.INIT=0,Yi.DELETE=1,Yi.KEEP=1,Yi.NUM_PTS_TO_CHECK=10,e(Ui.prototype,{getCoordinates:function(){var t=this.ptList.toArray(Ui.COORDINATE_ARRAY_TYPE);return t},setPrecisionModel:function(t){this.precisionModel=t},addPt:function(t){var e=new g(t);return this.precisionModel.makePrecise(e),this.isRedundant(e)?null:void this.ptList.add(e)},reverse:function(){},addPts:function(t,e){if(e)for(var n=0;n<t.length;n++)this.addPt(t[n]);else for(var n=t.length-1;n>=0;n--)this.addPt(t[n])},isRedundant:function(t){if(this.ptList.size()<1)return!1;var e=this.ptList.get(this.ptList.size()-1),n=t.distance(e);return n<this.minimimVertexDistance},toString:function(){var t=new ie,e=t.createLineString(this.getCoordinates());return e.toString()},closeRing:function(){if(this.ptList.size()<1)return null;var t=new g(this.ptList.get(0)),e=this.ptList.get(this.ptList.size()-1),n=null;return this.ptList.size()>=2&&(n=this.ptList.get(this.ptList.size()-2)),t.equals(e)?null:void this.ptList.add(t)},setMinimumVertexDistance:function(t){this.minimimVertexDistance=t},interfaces_:function(){return[]},getClass:function(){return Ui}}),Ui.COORDINATE_ARRAY_TYPE=new Array(0).fill(null),e(Xi.prototype,{addNextSegment:function(t,e){if(this.s0=this.s1,this.s1=this.s2,this.s2=t,this.seg0.setCoordinates(this.s0,this.s1),this.computeOffsetSegment(this.seg0,this.side,this.distance,this.offset0),this.seg1.setCoordinates(this.s1,this.s2),this.computeOffsetSegment(this.seg1,this.side,this.distance,this.offset1),this.s1.equals(this.s2))return null;var n=he.computeOrientation(this.s0,this.s1,this.s2),i=n===he.CLOCKWISE&&this.side===cn.LEFT||n===he.COUNTERCLOCKWISE&&this.side===cn.RIGHT;0===n?this.addCollinear(e):i?this.addOutsideTurn(n,e):this.addInsideTurn(n,e)},addLineEndCap:function(t,e){var n=new ce(t,e),i=new ce;this.computeOffsetSegment(n,cn.LEFT,this.distance,i);var r=new ce;this.computeOffsetSegment(n,cn.RIGHT,this.distance,r);var s=e.x-t.x,o=e.y-t.y,a=Math.atan2(o,s);switch(this.bufParams.getEndCapStyle()){case Bi.CAP_ROUND:this.segList.addPt(i.p1),this.addFilletArc(e,a+Math.PI/2,a-Math.PI/2,he.CLOCKWISE,this.distance),this.segList.addPt(r.p1);break;case Bi.CAP_FLAT:this.segList.addPt(i.p1),this.segList.addPt(r.p1);break;case Bi.CAP_SQUARE:var u=new g;u.x=Math.abs(this.distance)*Math.cos(a),u.y=Math.abs(this.distance)*Math.sin(a);var l=new g(i.p1.x+u.x,i.p1.y+u.y),h=new g(r.p1.x+u.x,r.p1.y+u.y);this.segList.addPt(l),this.segList.addPt(h)}},getCoordinates:function(){var t=this.segList.getCoordinates();return t},addMitreJoin:function(t,e,n,i){var r=!0,s=null;try{s=F.intersection(e.p0,e.p1,n.p0,n.p1);var o=0>=i?1:s.distance(t)/Math.abs(i);o>this.bufParams.getMitreLimit()&&(r=!1)}catch(t){if(!(t instanceof w))throw t;s=new g(0,0),r=!1}finally{}r?this.segList.addPt(s):this.addLimitedMitreJoin(e,n,i,this.bufParams.getMitreLimit())},addFilletCorner:function(t,e,n,i,r){var s=e.x-t.x,o=e.y-t.y,a=Math.atan2(o,s),u=n.x-t.x,l=n.y-t.y,h=Math.atan2(l,u);i===he.CLOCKWISE?h>=a&&(a+=2*Math.PI):a>=h&&(a-=2*Math.PI),this.segList.addPt(e),this.addFilletArc(t,a,h,i,r),this.segList.addPt(n)},addOutsideTurn:function(t,e){return this.offset0.p1.distance(this.offset1.p0)<this.distance*Xi.OFFSET_SEGMENT_SEPARATION_FACTOR?(this.segList.addPt(this.offset0.p1),null):void(this.bufParams.getJoinStyle()===Bi.JOIN_MITRE?this.addMitreJoin(this.s1,this.offset0,this.offset1,this.distance):this.bufParams.getJoinStyle()===Bi.JOIN_BEVEL?this.addBevelJoin(this.offset0,this.offset1):(e&&this.segList.addPt(this.offset0.p1),this.addFilletCorner(this.s1,this.offset0.p1,this.offset1.p0,t,this.distance),this.segList.addPt(this.offset1.p0)))},createSquare:function(t){this.segList.addPt(new g(t.x+this.distance,t.y+this.distance)),this.segList.addPt(new g(t.x+this.distance,t.y-this.distance)),this.segList.addPt(new g(t.x-this.distance,t.y-this.distance)),this.segList.addPt(new g(t.x-this.distance,t.y+this.distance)),this.segList.closeRing()},addSegments:function(t,e){this.segList.addPts(t,e)},addFirstSegment:function(){this.segList.addPt(this.offset1.p0)},addLastSegment:function(){this.segList.addPt(this.offset1.p1)},initSideSegments:function(t,e,n){this.s1=t,this.s2=e,this.side=n,this.seg1.setCoordinates(t,e),this.computeOffsetSegment(this.seg1,n,this.distance,this.offset1)},addLimitedMitreJoin:function(t,e,n,i){var r=this.seg0.p1,s=hi.angle(r,this.seg0.p0),o=(hi.angle(r,this.seg1.p1),hi.angleBetweenOriented(this.seg0.p0,r,this.seg1.p1)),a=o/2,u=hi.normalize(s+a),l=hi.normalize(u+Math.PI),h=i*n,c=h*Math.abs(Math.sin(a)),f=n-c,d=r.x+h*Math.cos(l),p=r.y+h*Math.sin(l),v=new g(d,p),m=new ce(r,v),y=m.pointAlongOffset(1,f),x=m.pointAlongOffset(1,-f);this.side===cn.LEFT?(this.segList.addPt(y),this.segList.addPt(x)):(this.segList.addPt(x),this.segList.addPt(y))},computeOffsetSegment:function(t,e,n,i){var r=e===cn.LEFT?1:-1,s=t.p1.x-t.p0.x,o=t.p1.y-t.p0.y,a=Math.sqrt(s*s+o*o),u=r*n*s/a,l=r*n*o/a;i.p0.x=t.p0.x-l,i.p0.y=t.p0.y+u,i.p1.x=t.p1.x-l,i.p1.y=t.p1.y+u},addFilletArc:function(t,e,n,i,r){var s=i===he.CLOCKWISE?-1:1,o=Math.abs(e-n),a=Math.trunc(o/this.filletAngleQuantum+.5);if(1>a)return null;var u=null,l=null;u=0,l=o/a;for(var h=u,c=new g;o>h;){var f=e+s*h;c.x=t.x+r*Math.cos(f),c.y=t.y+r*Math.sin(f),this.segList.addPt(c),h+=l}},addInsideTurn:function(t,e){if(this.li.computeIntersection(this.offset0.p0,this.offset0.p1,this.offset1.p0,this.offset1.p1),this.li.hasIntersection())this.segList.addPt(this.li.getIntersection(0));else if(this._hasNarrowConcaveAngle=!0,this.offset0.p1.distance(this.offset1.p0)<this.distance*Xi.INSIDE_TURN_VERTEX_SNAP_DISTANCE_FACTOR)this.segList.addPt(this.offset0.p1);else{if(this.segList.addPt(this.offset0.p1),this.closingSegLengthFactor>0){var n=new g((this.closingSegLengthFactor*this.offset0.p1.x+this.s1.x)/(this.closingSegLengthFactor+1),(this.closingSegLengthFactor*this.offset0.p1.y+this.s1.y)/(this.closingSegLengthFactor+1));this.segList.addPt(n);var i=new g((this.closingSegLengthFactor*this.offset1.p0.x+this.s1.x)/(this.closingSegLengthFactor+1),(this.closingSegLengthFactor*this.offset1.p0.y+this.s1.y)/(this.closingSegLengthFactor+1));this.segList.addPt(i)}else this.segList.addPt(this.s1);this.segList.addPt(this.offset1.p0)}},createCircle:function(t){var e=new g(t.x+this.distance,t.y);this.segList.addPt(e),this.addFilletArc(t,0,2*Math.PI,-1,this.distance),this.segList.closeRing()},addBevelJoin:function(t,e){this.segList.addPt(t.p1),this.segList.addPt(e.p0)},init:function(t){this.distance=t,this.maxCurveSegmentError=t*(1-Math.cos(this.filletAngleQuantum/2)),this.segList=new Ui,this.segList.setPrecisionModel(this.precisionModel),this.segList.setMinimumVertexDistance(t*Xi.CURVE_VERTEX_SNAP_DISTANCE_FACTOR)},addCollinear:function(t){this.li.computeIntersection(this.s0,this.s1,this.s1,this.s2);var e=this.li.getIntersectionNum();e>=2&&(this.bufParams.getJoinStyle()===Bi.JOIN_BEVEL||this.bufParams.getJoinStyle()===Bi.JOIN_MITRE?(t&&this.segList.addPt(this.offset0.p1),this.segList.addPt(this.offset1.p0)):this.addFilletCorner(this.s1,this.offset0.p1,this.offset1.p0,he.CLOCKWISE,this.distance))},closeRing:function(){this.segList.closeRing()},hasNarrowConcaveAngle:function(){return this._hasNarrowConcaveAngle},interfaces_:function(){return[]},getClass:function(){return Xi}}),Xi.OFFSET_SEGMENT_SEPARATION_FACTOR=.001,Xi.INSIDE_TURN_VERTEX_SNAP_DISTANCE_FACTOR=.001,Xi.CURVE_VERTEX_SNAP_DISTANCE_FACTOR=1e-6,Xi.MAX_CLOSING_SEG_LEN_FACTOR=80,e(Hi.prototype,{getOffsetCurve:function(t,e){if(this.distance=e,0===e)return null;var n=0>e,i=Math.abs(e),r=this.getSegGen(i);t.length<=1?this.computePointCurve(t[0],r):this.computeOffsetCurve(t,n,r);var s=r.getCoordinates();return n&&H.reverse(s),s},computeSingleSidedBufferCurve:function(t,e,n){var i=this.simplifyTolerance(this.distance);if(e){n.addSegments(t,!0);var r=Yi.simplify(t,-i),s=r.length-1;n.initSideSegments(r[s],r[s-1],cn.LEFT),n.addFirstSegment();for(var o=s-2;o>=0;o--)n.addNextSegment(r[o],!0)}else{n.addSegments(t,!1);var a=Yi.simplify(t,i),u=a.length-1;n.initSideSegments(a[0],a[1],cn.LEFT),n.addFirstSegment();for(var o=2;u>=o;o++)n.addNextSegment(a[o],!0)}n.addLastSegment(),n.closeRing()},computeRingBufferCurve:function(t,e,n){var i=this.simplifyTolerance(this.distance);e===cn.RIGHT&&(i=-i);var r=Yi.simplify(t,i),s=r.length-1;n.initSideSegments(r[s-1],r[0],e);for(var o=1;s>=o;o++){var a=1!==o;n.addNextSegment(r[o],a)}n.closeRing()},computeLineBufferCurve:function(t,e){var n=this.simplifyTolerance(this.distance),i=Yi.simplify(t,n),r=i.length-1;e.initSideSegments(i[0],i[1],cn.LEFT);for(var s=2;r>=s;s++)e.addNextSegment(i[s],!0);e.addLastSegment(),e.addLineEndCap(i[r-1],i[r]);var o=Yi.simplify(t,-n),a=o.length-1;e.initSideSegments(o[a],o[a-1],cn.LEFT);for(var s=a-2;s>=0;s--)e.addNextSegment(o[s],!0);e.addLastSegment(),e.addLineEndCap(o[1],o[0]),e.closeRing()},computePointCurve:function(t,e){switch(this.bufParams.getEndCapStyle()){case Bi.CAP_ROUND:e.createCircle(t);break;case Bi.CAP_SQUARE:e.createSquare(t)}},getLineCurve:function(t,e){if(this.distance=e,0>e&&!this.bufParams.isSingleSided())return null;if(0===e)return null;var n=Math.abs(e),i=this.getSegGen(n);if(t.length<=1)this.computePointCurve(t[0],i);else if(this.bufParams.isSingleSided()){var r=0>e;this.computeSingleSidedBufferCurve(t,r,i)}else this.computeLineBufferCurve(t,i);var s=i.getCoordinates();return s},getBufferParameters:function(){return this.bufParams},simplifyTolerance:function(t){return t*this.bufParams.getSimplifyFactor()},getRingCurve:function(t,e,n){if(this.distance=n,t.length<=2)return this.getLineCurve(t,n);if(0===n)return Hi.copyCoordinates(t);var i=this.getSegGen(n);return this.computeRingBufferCurve(t,e,i),i.getCoordinates()},computeOffsetCurve:function(t,e,n){var i=this.simplifyTolerance(this.distance);if(e){var r=Yi.simplify(t,-i),s=r.length-1;n.initSideSegments(r[s],r[s-1],cn.LEFT),n.addFirstSegment();for(var o=s-2;o>=0;o--)n.addNextSegment(r[o],!0)}else{var a=Yi.simplify(t,i),u=a.length-1;n.initSideSegments(a[0],a[1],cn.LEFT),n.addFirstSegment();for(var o=2;u>=o;o++)n.addNextSegment(a[o],!0)}n.addLastSegment()},getSegGen:function(t){return new Xi(this.precisionModel,this.bufParams,t)},interfaces_:function(){return[]},getClass:function(){return Hi}}),Hi.copyCoordinates=function(t){for(var e=new Array(t.length).fill(null),n=0;n<e.length;n++)e[n]=new g(t[n]);return e},e(Wi.prototype,{findStabbedSegments:function(){if(1===arguments.length){for(var t=arguments[0],e=new I,n=this.subgraphs.iterator();n.hasNext();){var i=n.next(),r=i.getEnvelope();t.y<r.getMinY()||t.y>r.getMaxY()||this.findStabbedSegments(t,i.getDirectedEdges(),e)}return e}if(3===arguments.length)if(R(arguments[2],y)&&arguments[0]instanceof g&&arguments[1]instanceof In)for(var s=arguments[0],o=arguments[1],a=arguments[2],u=o.getEdge().getCoordinates(),n=0;n<u.length-1;n++){this.seg.p0=u[n],this.seg.p1=u[n+1],this.seg.p0.y>this.seg.p1.y&&this.seg.reverse();var l=Math.max(this.seg.p0.x,this.seg.p1.x);if(!(l<s.x||this.seg.isHorizontal()||s.y<this.seg.p0.y||s.y>this.seg.p1.y||he.computeOrientation(this.seg.p0,this.seg.p1,s)===he.RIGHT)){var h=o.getDepth(cn.LEFT);this.seg.p0.equals(u[n])||(h=o.getDepth(cn.RIGHT));var c=new ji(this.seg,h);a.add(c)}}else if(R(arguments[2],y)&&arguments[0]instanceof g&&R(arguments[1],y))for(var f=arguments[0],d=arguments[1],p=arguments[2],n=d.iterator();n.hasNext();){var v=n.next();v.isForward()&&this.findStabbedSegments(f,v,p)}},getDepth:function(t){var e=this.findStabbedSegments(t);if(0===e.size())return 0;var n=ho.min(e);return n.leftDepth},interfaces_:function(){return[]},getClass:function(){return Wi}}),e(ji.prototype,{compareTo:function(t){var e=t;if(this.upwardSeg.minX()>=e.upwardSeg.maxX())return 1;if(this.upwardSeg.maxX()<=e.upwardSeg.minX())return-1;var n=this.upwardSeg.orientationIndex(e.upwardSeg);return 0!==n?n:(n=-1*e.upwardSeg.orientationIndex(this.upwardSeg),0!==n?n:this.upwardSeg.compareTo(e.upwardSeg))},compareX:function(t,e){var n=t.p0.compareTo(e.p0);return 0!==n?n:t.p1.compareTo(e.p1)},toString:function(){return this.upwardSeg.toString()},interfaces_:function(){return[s]},getClass:function(){return ji}}),Wi.DepthSegment=ji,e(Ki.prototype,{addPoint:function(t){if(this.distance<=0)return null;
var e=t.getCoordinates(),n=this.curveBuilder.getLineCurve(e,this.distance);this.addCurve(n,L.EXTERIOR,L.INTERIOR)},addPolygon:function(t){var e=this.distance,n=cn.LEFT;this.distance<0&&(e=-this.distance,n=cn.RIGHT);var i=t.getExteriorRing(),r=H.removeRepeatedPoints(i.getCoordinates());if(this.distance<0&&this.isErodedCompletely(i,this.distance))return null;if(this.distance<=0&&r.length<3)return null;this.addPolygonRing(r,e,n,L.EXTERIOR,L.INTERIOR);for(var s=0;s<t.getNumInteriorRing();s++){var o=t.getInteriorRingN(s),a=H.removeRepeatedPoints(o.getCoordinates());this.distance>0&&this.isErodedCompletely(o,-this.distance)||this.addPolygonRing(a,e,cn.opposite(n),L.INTERIOR,L.EXTERIOR)}},isTriangleErodedCompletely:function(t,e){var n=new ci(t[0],t[1],t[2]),i=n.inCentre(),r=he.distancePointLine(i,n.p0,n.p1);return r<Math.abs(e)},addLineString:function(t){if(this.distance<=0&&!this.curveBuilder.getBufferParameters().isSingleSided())return null;var e=H.removeRepeatedPoints(t.getCoordinates()),n=this.curveBuilder.getLineCurve(e,this.distance);this.addCurve(n,L.EXTERIOR,L.INTERIOR)},addCurve:function(t,e,n){if(null===t||t.length<2)return null;var i=new Ke(t,new gn(0,L.BOUNDARY,e,n));this.curveList.add(i)},getCurves:function(){return this.add(this.inputGeom),this.curveList},addPolygonRing:function(t,e,n,i,r){if(0===e&&t.length<bt.MINIMUM_VALID_SIZE)return null;var s=i,o=r;t.length>=bt.MINIMUM_VALID_SIZE&&he.isCCW(t)&&(s=r,o=i,n=cn.opposite(n));var a=this.curveBuilder.getRingCurve(t,n,e);this.addCurve(a,s,o)},add:function(t){if(t.isEmpty())return null;if(t instanceof Tt)this.addPolygon(t);else if(t instanceof St)this.addLineString(t);else if(t instanceof Lt)this.addPoint(t);else if(t instanceof Pt)this.addCollection(t);else if(t instanceof gt)this.addCollection(t);else if(t instanceof Ot)this.addCollection(t);else{if(!(t instanceof ft))throw new UnsupportedOperationException(t.getClass().getName());this.addCollection(t)}},isErodedCompletely:function(t,e){var n=t.getCoordinates();if(n.length<4)return 0>e;if(4===n.length)return this.isTriangleErodedCompletely(n,e);var i=t.getEnvelopeInternal(),r=Math.min(i.getHeight(),i.getWidth());return 0>e&&2*Math.abs(e)>r},addCollection:function(t){for(var e=0;e<t.getNumGeometries();e++){var n=t.getGeometryN(e);this.add(n)}},interfaces_:function(){return[]},getClass:function(){return Ki}}),e(Zi.prototype,{isTrivialIntersection:function(t,e,n,i){if(t===n&&1===this.li.getIntersectionNum()){if(Zi.isAdjacentSegments(e,i))return!0;if(t.isClosed()){var r=t.size()-1;if(0===e&&i===r||0===i&&e===r)return!0}}return!1},getProperIntersectionPoint:function(){return this.properIntersectionPoint},hasProperInteriorIntersection:function(){return this.hasProperInterior},getLineIntersector:function(){return this.li},hasProperIntersection:function(){return this.hasProper},processIntersections:function(t,e,n,i){if(t===n&&e===i)return null;this.numTests++;var r=t.getCoordinates()[e],s=t.getCoordinates()[e+1],o=n.getCoordinates()[i],a=n.getCoordinates()[i+1];this.li.computeIntersection(r,s,o,a),this.li.hasIntersection()&&(this.numIntersections++,this.li.isInteriorIntersection()&&(this.numInteriorIntersections++,this.hasInterior=!0),this.isTrivialIntersection(t,e,n,i)||(this._hasIntersection=!0,t.addIntersections(this.li,e,0),n.addIntersections(this.li,i,1),this.li.isProper()&&(this.numProperIntersections++,this.hasProper=!0,this.hasProperInterior=!0)))},hasIntersection:function(){return this._hasIntersection},isDone:function(){return!1},hasInteriorIntersection:function(){return this.hasInterior},interfaces_:function(){return[on]},getClass:function(){return Zi}}),Zi.isAdjacentSegments=function(t,e){return 1===Math.abs(t-e)},e(Qi.prototype,{setWorkingPrecisionModel:function(t){this.workingPrecisionModel=t},insertUniqueEdge:function(t){var e=this.edgeList.findEqualEdge(t);if(null!==e){var n=e.getLabel(),i=t.getLabel();e.isPointwiseEqual(t)||(i=new gn(t.getLabel()),i.flip()),n.merge(i);var r=Qi.depthDelta(i),s=e.getDepthDelta(),o=s+r;e.setDepthDelta(o)}else this.edgeList.add(t),t.setDepthDelta(Qi.depthDelta(t.getLabel()))},buildSubgraphs:function(t,e){for(var n=new I,i=t.iterator();i.hasNext();){var r=i.next(),s=r.getRightmostCoordinate(),o=new Wi(n),a=o.getDepth(s);r.computeDepth(a),r.findResultEdges(),n.add(r),e.add(r.getDirectedEdges(),r.getNodes())}},createSubgraphs:function(t){for(var e=new I,n=t.getNodes().iterator();n.hasNext();){var i=n.next();if(!i.isVisited()){var r=new ki;r.create(i),e.add(r)}}return ho.sort(e,ho.reverseOrder()),e},createEmptyResultGeometry:function(){var t=this.geomFact.createPolygon();return t},getNoder:function(t){if(null!==this.workingNoder)return this.workingNoder;var e=new nn,n=new ae;return n.setPrecisionModel(t),e.setSegmentIntersector(new Zi(n)),e},buffer:function(t,e){var n=this.workingPrecisionModel;null===n&&(n=t.getPrecisionModel()),this.geomFact=t.getFactory();var i=new Hi(n,this.bufParams),r=new Ki(t,e,i),s=r.getCurves();if(s.size()<=0)return this.createEmptyResultGeometry();this.computeNodedEdges(s,n),this.graph=new Cn(new On),this.graph.addEdges(this.edgeList.getEdges());var o=this.createSubgraphs(this.graph),a=new Sn(this.geomFact);this.buildSubgraphs(o,a);var u=a.getPolygons();if(u.size()<=0)return this.createEmptyResultGeometry();var l=this.geomFact.buildGeometry(u);return l},computeNodedEdges:function(t,e){var n=this.getNoder(e);n.computeNodes(t);for(var i=n.getNodedSubstrings(),r=i.iterator();r.hasNext();){var s=r.next(),o=s.getCoordinates();if(2!==o.length||!o[0].equals2D(o[1])){var a=s.getData(),u=new Jn(s.getCoordinates(),new gn(a));this.insertUniqueEdge(u)}}},setNoder:function(t){this.workingNoder=t},interfaces_:function(){return[]},getClass:function(){return Qi}}),Qi.depthDelta=function(t){var e=t.getLocation(0,cn.LEFT),n=t.getLocation(0,cn.RIGHT);return e===L.INTERIOR&&n===L.EXTERIOR?1:e===L.EXTERIOR&&n===L.INTERIOR?-1:0},Qi.convertSegStrings=function(t){for(var e=new ie,n=new I;t.hasNext();){var i=t.next(),r=e.createLineString(i.getCoordinates());n.add(r)}return e.buildGeometry(n)},e(Ji.prototype,{checkEndPtVertexIntersections:function(){if(0===arguments.length)for(var t=this.segStrings.iterator();t.hasNext();){var e=t.next(),n=e.getCoordinates();this.checkEndPtVertexIntersections(n[0],this.segStrings),this.checkEndPtVertexIntersections(n[n.length-1],this.segStrings)}else if(2===arguments.length)for(var i=arguments[0],r=arguments[1],t=r.iterator();t.hasNext();)for(var e=t.next(),n=e.getCoordinates(),s=1;s<n.length-1;s++)if(n[s].equals(i))throw new l("found endpt/interior pt intersection at index "+s+" :pt "+i)},checkInteriorIntersections:function(){if(0===arguments.length)for(var t=this.segStrings.iterator();t.hasNext();)for(var e=t.next(),n=this.segStrings.iterator();n.hasNext();){var i=n.next();this.checkInteriorIntersections(e,i)}else if(2===arguments.length)for(var r=arguments[0],s=arguments[1],o=r.getCoordinates(),a=s.getCoordinates(),u=0;u<o.length-1;u++)for(var h=0;h<a.length-1;h++)this.checkInteriorIntersections(r,u,s,h);else if(4===arguments.length){var c=arguments[0],f=arguments[1],g=arguments[2],d=arguments[3];if(c===g&&f===d)return null;var p=c.getCoordinates()[f],v=c.getCoordinates()[f+1],m=g.getCoordinates()[d],y=g.getCoordinates()[d+1];if(this.li.computeIntersection(p,v,m,y),this.li.hasIntersection()&&(this.li.isProper()||this.hasInteriorIntersection(this.li,p,v)||this.hasInteriorIntersection(this.li,m,y)))throw new l("found non-noded intersection at "+p+"-"+v+" and "+m+"-"+y)}},checkValid:function(){this.checkEndPtVertexIntersections(),this.checkInteriorIntersections(),this.checkCollapses()},checkCollapses:function(){if(0===arguments.length)for(var t=this.segStrings.iterator();t.hasNext();){var e=t.next();this.checkCollapses(e)}else if(1===arguments.length)for(var n=arguments[0],i=n.getCoordinates(),t=0;t<i.length-2;t++)this.checkCollapse(i[t],i[t+1],i[t+2])},hasInteriorIntersection:function(t,e,n){for(var i=0;i<t.getIntersectionNum();i++){var r=t.getIntersection(i);if(!r.equals(e)&&!r.equals(n))return!0}return!1},checkCollapse:function(t,e,n){if(t.equals(n))throw new l("found non-noded collapse at "+Ji.fact.createLineString([t,e,n]))},interfaces_:function(){return[]},getClass:function(){return Ji}}),Ji.fact=new ie,e($i.prototype,{intersectsScaled:function(t,e){var n=Math.min(t.x,e.x),i=Math.max(t.x,e.x),r=Math.min(t.y,e.y),s=Math.max(t.y,e.y),o=this.maxx<n||this.minx>i||this.maxy<r||this.miny>s;if(o)return!1;var a=this.intersectsToleranceSquare(t,e);return f.isTrue(!(o&&a),"Found bad envelope test"),a},initCorners:function(t){var e=.5;this.minx=t.x-e,this.maxx=t.x+e,this.miny=t.y-e,this.maxy=t.y+e,this.corner[0]=new g(this.maxx,this.maxy),this.corner[1]=new g(this.minx,this.maxy),this.corner[2]=new g(this.minx,this.miny),this.corner[3]=new g(this.maxx,this.miny)},intersects:function(t,e){return 1===this.scaleFactor?this.intersectsScaled(t,e):(this.copyScaled(t,this.p0Scaled),this.copyScaled(e,this.p1Scaled),this.intersectsScaled(this.p0Scaled,this.p1Scaled))},scale:function(t){return Math.round(t*this.scaleFactor)},getCoordinate:function(){return this.originalPt},copyScaled:function(t,e){e.x=this.scale(t.x),e.y=this.scale(t.y)},getSafeEnvelope:function(){if(null===this.safeEnv){var t=$i.SAFE_ENV_EXPANSION_FACTOR/this.scaleFactor;this.safeEnv=new C(this.originalPt.x-t,this.originalPt.x+t,this.originalPt.y-t,this.originalPt.y+t)}return this.safeEnv},intersectsPixelClosure:function(t,e){return this.li.computeIntersection(t,e,this.corner[0],this.corner[1]),this.li.hasIntersection()?!0:(this.li.computeIntersection(t,e,this.corner[1],this.corner[2]),this.li.hasIntersection()?!0:(this.li.computeIntersection(t,e,this.corner[2],this.corner[3]),this.li.hasIntersection()?!0:(this.li.computeIntersection(t,e,this.corner[3],this.corner[0]),!!this.li.hasIntersection())))},intersectsToleranceSquare:function(t,e){var n=!1,i=!1;return this.li.computeIntersection(t,e,this.corner[0],this.corner[1]),this.li.isProper()?!0:(this.li.computeIntersection(t,e,this.corner[1],this.corner[2]),this.li.isProper()?!0:(this.li.hasIntersection()&&(n=!0),this.li.computeIntersection(t,e,this.corner[2],this.corner[3]),this.li.isProper()?!0:(this.li.hasIntersection()&&(i=!0),this.li.computeIntersection(t,e,this.corner[3],this.corner[0]),this.li.isProper()?!0:n&&i?!0:t.equals(this.pt)?!0:!!e.equals(this.pt))))},addSnappedNode:function(t,e){var n=t.getCoordinate(e),i=t.getCoordinate(e+1);return this.intersects(n,i)?(t.addIntersection(this.getCoordinate(),e),!0):!1},interfaces_:function(){return[]},getClass:function(){return $i}}),$i.SAFE_ENV_EXPANSION_FACTOR=.75,e(tr.prototype,{select:function(){if(1===arguments.length){arguments[0]}else if(2===arguments.length){var t=arguments[0],e=arguments[1];t.getLineSegment(e,this.selectedSegment),this.select(this.selectedSegment)}},interfaces_:function(){return[]},getClass:function(){return tr}}),e(er.prototype,{snap:function(){if(1===arguments.length){var t=arguments[0];return this.snap(t,null,-1)}if(3===arguments.length){var e=arguments[0],n=arguments[1],i=arguments[2],r=e.getSafeEnvelope(),s=new nr(e,n,i);return this.index.query(r,{interfaces_:function(){return[Ae]},visitItem:function(t){var e=t;e.select(r,s)}}),s.isNodeAdded()}},interfaces_:function(){return[]},getClass:function(){return er}}),h(nr,tr),e(nr.prototype,{isNodeAdded:function(){return this._isNodeAdded},select:function(){if(2!==arguments.length)return tr.prototype.select.apply(this,arguments);var t=arguments[0],e=arguments[1],n=t.getContext();return null!==this.parentEdge&&n===this.parentEdge&&e===this.hotPixelVertexIndex?null:void(this._isNodeAdded=this.hotPixel.addSnappedNode(n,e))},interfaces_:function(){return[]},getClass:function(){return nr}}),er.HotPixelSnapAction=nr,e(ir.prototype,{processIntersections:function(t,e,n,i){if(t===n&&e===i)return null;var r=t.getCoordinates()[e],s=t.getCoordinates()[e+1],o=n.getCoordinates()[i],a=n.getCoordinates()[i+1];if(this.li.computeIntersection(r,s,o,a),this.li.hasIntersection()&&this.li.isInteriorIntersection()){for(var u=0;u<this.li.getIntersectionNum();u++)this.interiorIntersections.add(this.li.getIntersection(u));t.addIntersections(this.li,e,0),n.addIntersections(this.li,i,1)}},isDone:function(){return!1},getInteriorIntersections:function(){return this.interiorIntersections},interfaces_:function(){return[on]},getClass:function(){return ir}}),e(rr.prototype,{checkCorrectness:function(t){var e=Ke.getNodedSubstrings(t),n=new Ji(e);try{n.checkValid()}catch(t){if(!(t instanceof S))throw t;t.printStackTrace()}finally{}},getNodedSubstrings:function(){return Ke.getNodedSubstrings(this.nodedSegStrings)},snapRound:function(t,e){var n=this.findInteriorIntersections(t,e);this.computeIntersectionSnaps(n),this.computeVertexSnaps(t)},findInteriorIntersections:function(t,e){var n=new ir(e);return this.noder.setSegmentIntersector(n),this.noder.computeNodes(t),n.getInteriorIntersections()},computeVertexSnaps:function(){if(R(arguments[0],v))for(var t=arguments[0],e=t.iterator();e.hasNext();){var n=e.next();this.computeVertexSnaps(n)}else if(arguments[0]instanceof Ke)for(var i=arguments[0],r=i.getCoordinates(),s=0;s<r.length;s++){var o=new $i(r[s],this.scaleFactor,this.li),a=this.pointSnapper.snap(o,i,s);a&&i.addIntersection(r[s],s)}},computeNodes:function(t){this.nodedSegStrings=t,this.noder=new nn,this.pointSnapper=new er(this.noder.getIndex()),this.snapRound(t,this.li)},computeIntersectionSnaps:function(t){for(var e=t.iterator();e.hasNext();){var n=e.next(),i=new $i(n,this.scaleFactor,this.li);this.pointSnapper.snap(i)}},interfaces_:function(){return[tn]},getClass:function(){return rr}}),e(sr.prototype,{bufferFixedPrecision:function(t){var e=new Fi(new rr(new ee(1)),t.getScale()),n=new Qi(this.bufParams);n.setWorkingPrecisionModel(t),n.setNoder(e),this.resultGeometry=n.buffer(this.argGeom,this.distance)},bufferReducedPrecision:function(){if(0===arguments.length){for(var t=sr.MAX_PRECISION_DIGITS;t>=0;t--){try{this.bufferReducedPrecision(t)}catch(t){if(!(t instanceof sn))throw t;this.saveException=t}finally{}if(null!==this.resultGeometry)return null}throw this.saveException}if(1===arguments.length){var e=arguments[0],n=sr.precisionScaleFactor(this.argGeom,this.distance,e),i=new ee(n);this.bufferFixedPrecision(i)}},computeGeometry:function(){if(this.bufferOriginalPrecision(),null!==this.resultGeometry)return null;var t=this.argGeom.getFactory().getPrecisionModel();t.getType()===ee.FIXED?this.bufferFixedPrecision(t):this.bufferReducedPrecision()},setQuadrantSegments:function(t){this.bufParams.setQuadrantSegments(t)},bufferOriginalPrecision:function(){try{var t=new Qi(this.bufParams);this.resultGeometry=t.buffer(this.argGeom,this.distance)}catch(t){if(!(t instanceof l))throw t;this.saveException=t}finally{}},getResultGeometry:function(t){return this.distance=t,this.computeGeometry(),this.resultGeometry},setEndCapStyle:function(t){this.bufParams.setEndCapStyle(t)},interfaces_:function(){return[]},getClass:function(){return sr}}),sr.bufferOp=function(){if(2===arguments.length){var t=arguments[0],e=arguments[1],n=new sr(t),i=n.getResultGeometry(e);return i}if(3===arguments.length){if(Number.isInteger(arguments[2])&&arguments[0]instanceof B&&"number"==typeof arguments[1]){var r=arguments[0],s=arguments[1],o=arguments[2],a=new sr(r);a.setQuadrantSegments(o);var i=a.getResultGeometry(s);return i}if(arguments[2]instanceof Bi&&arguments[0]instanceof B&&"number"==typeof arguments[1]){var u=arguments[0],l=arguments[1],h=arguments[2],a=new sr(u,h),i=a.getResultGeometry(l);return i}}else if(4===arguments.length){var c=arguments[0],f=arguments[1],g=arguments[2],d=arguments[3],a=new sr(c);a.setQuadrantSegments(g),a.setEndCapStyle(d);var i=a.getResultGeometry(f);return i}},sr.precisionScaleFactor=function(t,e,n){var i=t.getEnvelopeInternal(),r=T.max(Math.abs(i.getMaxX()),Math.abs(i.getMaxY()),Math.abs(i.getMinX()),Math.abs(i.getMinY())),s=e>0?e:0,o=r+2*s,a=Math.trunc(Math.log(o)/Math.log(10)+1),u=n-a,l=Math.pow(10,u);return l},sr.CAP_ROUND=Bi.CAP_ROUND,sr.CAP_BUTT=Bi.CAP_FLAT,sr.CAP_FLAT=Bi.CAP_FLAT,sr.CAP_SQUARE=Bi.CAP_SQUARE,sr.MAX_PRECISION_DIGITS=12;var Co=Object.freeze({BufferOp:sr,BufferParameters:Bi});e(or.prototype,{filter:function(t){t instanceof Tt&&this.comps.add(t)},interfaces_:function(){return[ht]},getClass:function(){return or}}),or.getPolygons=function(){if(1===arguments.length){var t=arguments[0];return or.getPolygons(t,new I)}if(2===arguments.length){var e=arguments[0],n=arguments[1];return e instanceof Tt?n.add(e):e instanceof ft&&e.apply(new or(n)),n}},e(ar.prototype,{isInsideArea:function(){return this.segIndex===ar.INSIDE_AREA},getCoordinate:function(){return this.pt},getGeometryComponent:function(){return this.component},getSegmentIndex:function(){return this.segIndex},interfaces_:function(){return[]},getClass:function(){return ar}}),ar.INSIDE_AREA=-1,e(ur.prototype,{filter:function(t){t instanceof Lt&&this.pts.add(t)},interfaces_:function(){return[ht]},getClass:function(){return ur}}),ur.getPoints=function(){if(1===arguments.length){var t=arguments[0];return t instanceof Lt?ho.singletonList(t):ur.getPoints(t,new I)}if(2===arguments.length){var e=arguments[0],n=arguments[1];return e instanceof Lt?n.add(e):e instanceof ft&&e.apply(new ur(n)),n}},e(lr.prototype,{filter:function(t){(t instanceof Lt||t instanceof St||t instanceof Tt)&&this.locations.add(new ar(t,0,t.getCoordinate()))},interfaces_:function(){return[ht]},getClass:function(){return lr}}),lr.getLocations=function(t){var e=new I;return t.apply(new lr(e)),e},e(hr.prototype,{computeContainmentDistance:function(){if(0===arguments.length){var t=new Array(2).fill(null);if(this.computeContainmentDistance(0,t),this.minDistance<=this.terminateDistance)return null;this.computeContainmentDistance(1,t)}else if(2===arguments.length){var e=arguments[0],n=arguments[1],i=1-e,r=or.getPolygons(this.geom[e]);if(r.size()>0){var s=lr.getLocations(this.geom[i]);if(this.computeContainmentDistance(s,r,n),this.minDistance<=this.terminateDistance)return this.minDistanceLocation[i]=n[0],this.minDistanceLocation[e]=n[1],null}}else if(3===arguments.length)if(arguments[2]instanceof Array&&R(arguments[0],y)&&R(arguments[1],y)){for(var o=arguments[0],a=arguments[1],u=arguments[2],l=0;l<o.size();l++)for(var h=o.get(l),c=0;c<a.size();c++)if(this.computeContainmentDistance(h,a.get(c),u),this.minDistance<=this.terminateDistance)return null}else if(arguments[2]instanceof Array&&arguments[0]instanceof ar&&arguments[1]instanceof Tt){var f=arguments[0],g=arguments[1],d=arguments[2],p=f.getCoordinate();if(L.EXTERIOR!==this.ptLocator.locate(p,g))return this.minDistance=0,d[0]=f,d[1]=new ar(g,p),null}},computeMinDistanceLinesPoints:function(t,e,n){for(var i=0;i<t.size();i++)for(var r=t.get(i),s=0;s<e.size();s++){var o=e.get(s);if(this.computeMinDistance(r,o,n),this.minDistance<=this.terminateDistance)return null}},computeFacetDistance:function(){var t=new Array(2).fill(null),e=kn.getLines(this.geom[0]),n=kn.getLines(this.geom[1]),i=ur.getPoints(this.geom[0]),r=ur.getPoints(this.geom[1]);return this.computeMinDistanceLines(e,n,t),this.updateMinDistance(t,!1),this.minDistance<=this.terminateDistance?null:(t[0]=null,t[1]=null,this.computeMinDistanceLinesPoints(e,r,t),this.updateMinDistance(t,!1),this.minDistance<=this.terminateDistance?null:(t[0]=null,t[1]=null,this.computeMinDistanceLinesPoints(n,i,t),this.updateMinDistance(t,!0),this.minDistance<=this.terminateDistance?null:(t[0]=null,t[1]=null,this.computeMinDistancePoints(i,r,t),void this.updateMinDistance(t,!1))))},nearestLocations:function(){return this.computeMinDistance(),this.minDistanceLocation},updateMinDistance:function(t,e){return null===t[0]?null:void(e?(this.minDistanceLocation[0]=t[1],this.minDistanceLocation[1]=t[0]):(this.minDistanceLocation[0]=t[0],this.minDistanceLocation[1]=t[1]))},nearestPoints:function(){this.computeMinDistance();var t=[this.minDistanceLocation[0].getCoordinate(),this.minDistanceLocation[1].getCoordinate()];return t},computeMinDistance:function(){if(0===arguments.length){if(null!==this.minDistanceLocation)return null;if(this.minDistanceLocation=new Array(2).fill(null),this.computeContainmentDistance(),this.minDistance<=this.terminateDistance)return null;this.computeFacetDistance()}else if(3===arguments.length)if(arguments[2]instanceof Array&&arguments[0]instanceof St&&arguments[1]instanceof Lt){var t=arguments[0],e=arguments[1],n=arguments[2];if(t.getEnvelopeInternal().distance(e.getEnvelopeInternal())>this.minDistance)return null;for(var i=t.getCoordinates(),r=e.getCoordinate(),s=0;s<i.length-1;s++){var o=he.distancePointLine(r,i[s],i[s+1]);if(o<this.minDistance){this.minDistance=o;var a=new ce(i[s],i[s+1]),u=a.closestPoint(r);n[0]=new ar(t,s,u),n[1]=new ar(e,0,r)}if(this.minDistance<=this.terminateDistance)return null}}else if(arguments[2]instanceof Array&&arguments[0]instanceof St&&arguments[1]instanceof St){var l=arguments[0],h=arguments[1],c=arguments[2];if(l.getEnvelopeInternal().distance(h.getEnvelopeInternal())>this.minDistance)return null;for(var i=l.getCoordinates(),f=h.getCoordinates(),s=0;s<i.length-1;s++)for(var g=0;g<f.length-1;g++){var o=he.distanceLineLine(i[s],i[s+1],f[g],f[g+1]);if(o<this.minDistance){this.minDistance=o;var d=new ce(i[s],i[s+1]),p=new ce(f[g],f[g+1]),v=d.closestPoints(p);c[0]=new ar(l,s,v[0]),c[1]=new ar(h,g,v[1])}if(this.minDistance<=this.terminateDistance)return null}}},computeMinDistancePoints:function(t,e,n){for(var i=0;i<t.size();i++)for(var r=t.get(i),s=0;s<e.size();s++){var o=e.get(s),a=r.getCoordinate().distance(o.getCoordinate());if(a<this.minDistance&&(this.minDistance=a,n[0]=new ar(r,0,r.getCoordinate()),n[1]=new ar(o,0,o.getCoordinate())),this.minDistance<=this.terminateDistance)return null}},distance:function(){if(null===this.geom[0]||null===this.geom[1])throw new i("null geometries are not supported");return this.geom[0].isEmpty()||this.geom[1].isEmpty()?0:(this.computeMinDistance(),this.minDistance)},computeMinDistanceLines:function(t,e,n){for(var i=0;i<t.size();i++)for(var r=t.get(i),s=0;s<e.size();s++){var o=e.get(s);if(this.computeMinDistance(r,o,n),this.minDistance<=this.terminateDistance)return null}},interfaces_:function(){return[]},getClass:function(){return hr}}),hr.distance=function(t,e){var n=new hr(t,e);return n.distance()},hr.isWithinDistance=function(t,e,n){var i=new hr(t,e,n);return i.distance()<=n},hr.nearestPoints=function(t,e){var n=new hr(t,e);return n.nearestPoints()};var So=Object.freeze({DistanceOp:hr});e(cr.prototype,{getCoordinates:function(){if(null===this.coordinates){for(var t=0,e=0,n=new N,i=this.directedEdges.iterator();i.hasNext();){var r=i.next();r.getEdgeDirection()?t++:e++,n.add(r.getEdge().getLine().getCoordinates(),!1,r.getEdgeDirection())}this.coordinates=n.toCoordinateArray(),e>t&&H.reverse(this.coordinates)}return this.coordinates},toLineString:function(){return this.factory.createLineString(this.getCoordinates())},add:function(t){this.directedEdges.add(t)},interfaces_:function(){return[]},getClass:function(){return cr}}),e(fr.prototype,{setVisited:function(t){this._isVisited=t},isMarked:function(){return this._isMarked},setData:function(t){this.data=t},getData:function(){return this.data},setMarked:function(t){this._isMarked=t},getContext:function(){return this.data},isVisited:function(){return this._isVisited},setContext:function(t){this.data=t},interfaces_:function(){return[]},getClass:function(){return fr}}),fr.getComponentWithVisitedState=function(t,e){for(;t.hasNext();){var n=t.next();if(n.isVisited()===e)return n}return null},fr.setVisited=function(t,e){for(;t.hasNext();){var n=t.next();n.setVisited(e)}},fr.setMarked=function(t,e){for(;t.hasNext();){var n=t.next();n.setMarked(e)}},h(gr,fr),e(gr.prototype,{isRemoved:function(){return null===this.parentEdge},compareDirection:function(t){return this.quadrant>t.quadrant?1:this.quadrant<t.quadrant?-1:he.computeOrientation(t.p0,t.p1,this.p1)},getCoordinate:function(){return this.from.getCoordinate()},print:function(t){var e=this.getClass().getName(),n=e.lastIndexOf("."),i=e.substring(n+1);t.print("  "+i+": "+this.p0+" - "+this.p1+" "+this.quadrant+":"+this.angle)},getDirectionPt:function(){return this.p1},getAngle:function(){return this.angle},compareTo:function(t){var e=t;return this.compareDirection(e)},getFromNode:function(){return this.from},getSym:function(){return this.sym},setEdge:function(t){this.parentEdge=t},remove:function(){this.sym=null,this.parentEdge=null},getEdge:function(){return this.parentEdge},getQuadrant:function(){return this.quadrant},setSym:function(t){this.sym=t},getToNode:function(){return this.to},getEdgeDirection:function(){return this.edgeDirection},interfaces_:function(){return[s]},getClass:function(){return gr}}),gr.toEdges=function(t){for(var e=new I,n=t.iterator();n.hasNext();)e.add(n.next().parentEdge);return e},h(dr,gr),e(dr.prototype,{getNext:function(){return 2!==this.getToNode().getDegree()?null:this.getToNode().getOutEdges().getEdges().get(0)===this.getSym()?this.getToNode().getOutEdges().getEdges().get(1):(f.isTrue(this.getToNode().getOutEdges().getEdges().get(1)===this.getSym()),this.getToNode().getOutEdges().getEdges().get(0))},interfaces_:function(){return[]},getClass:function(){return dr}}),h(pr,fr),e(pr.prototype,{isRemoved:function(){return null===this.dirEdge},setDirectedEdges:function(t,e){this.dirEdge=[t,e],t.setEdge(this),e.setEdge(this),t.setSym(e),e.setSym(t),t.getFromNode().addOutEdge(t),e.getFromNode().addOutEdge(e)},getDirEdge:function(){if(Number.isInteger(arguments[0])){var t=arguments[0];return this.dirEdge[t]}if(arguments[0]instanceof mr){var e=arguments[0];return this.dirEdge[0].getFromNode()===e?this.dirEdge[0]:this.dirEdge[1].getFromNode()===e?this.dirEdge[1]:null}},remove:function(){this.dirEdge=null},getOppositeNode:function(t){return this.dirEdge[0].getFromNode()===t?this.dirEdge[0].getToNode():this.dirEdge[1].getFromNode()===t?this.dirEdge[1].getToNode():null},interfaces_:function(){return[]},getClass:function(){return pr}}),e(vr.prototype,{getNextEdge:function(t){var e=this.getIndex(t);return this.outEdges.get(this.getIndex(e+1))},getCoordinate:function(){var t=this.iterator();if(!t.hasNext())return null;var e=t.next();return e.getCoordinate()},iterator:function(){return this.sortEdges(),this.outEdges.iterator()},sortEdges:function(){this.sorted||(ho.sort(this.outEdges),this.sorted=!0)},remove:function(t){this.outEdges.remove(t)},getEdges:function(){return this.sortEdges(),this.outEdges},getNextCWEdge:function(t){var e=this.getIndex(t);return this.outEdges.get(this.getIndex(e-1))},getIndex:function(){if(arguments[0]instanceof pr){var t=arguments[0];this.sortEdges();for(var e=0;e<this.outEdges.size();e++){var n=this.outEdges.get(e);if(n.getEdge()===t)return e}return-1}if(arguments[0]instanceof gr){var i=arguments[0];this.sortEdges();for(var e=0;e<this.outEdges.size();e++){var n=this.outEdges.get(e);if(n===i)return e}return-1}if(Number.isInteger(arguments[0])){var r=arguments[0],s=r%this.outEdges.size();return 0>s&&(s+=this.outEdges.size()),s}},add:function(t){this.outEdges.add(t),this.sorted=!1},getDegree:function(){return this.outEdges.size()},interfaces_:function(){return[]},getClass:function(){return vr}}),h(mr,fr),e(mr.prototype,{isRemoved:function(){return null===this.pt},addOutEdge:function(t){this.deStar.add(t)},getCoordinate:function(){return this.pt},getOutEdges:function(){return this.deStar},remove:function(){if(0===arguments.length)this.pt=null;else if(1===arguments.length){var t=arguments[0];this.deStar.remove(t)}},getIndex:function(t){return this.deStar.getIndex(t)},getDegree:function(){return this.deStar.getDegree()},interfaces_:function(){return[]},getClass:function(){return mr}}),mr.getEdgesBetween=function(t,e){var n=gr.toEdges(t.getOutEdges().getEdges()),i=new J(n),r=gr.toEdges(e.getOutEdges().getEdges());return i.retainAll(r),i},h(yr,pr),e(yr.prototype,{getLine:function(){return this.line},interfaces_:function(){return[]},getClass:function(){return yr}}),e(xr.prototype,{find:function(t){return this.nodeMap.get(t)},iterator:function(){return this.nodeMap.values().iterator()},remove:function(t){return this.nodeMap.remove(t)},values:function(){return this.nodeMap.values()},add:function(t){return this.nodeMap.put(t.getCoordinate(),t),t},interfaces_:function(){return[]},getClass:function(){return xr}}),e(Er.prototype,{findNodesOfDegree:function(t){for(var e=new I,n=this.nodeIterator();n.hasNext();){var i=n.next();i.getDegree()===t&&e.add(i)}return e},dirEdgeIterator:function(){return this.dirEdges.iterator()},edgeIterator:function(){return this.edges.iterator()},remove:function(){if(arguments[0]instanceof pr){var t=arguments[0];this.remove(t.getDirEdge(0)),this.remove(t.getDirEdge(1)),this.edges.remove(t),t.remove()}else if(arguments[0]instanceof gr){var e=arguments[0],n=e.getSym();null!==n&&n.setSym(null),e.getFromNode().remove(e),e.remove(),this.dirEdges.remove(e)}else if(arguments[0]instanceof mr){for(var i=arguments[0],r=i.getOutEdges().getEdges(),s=r.iterator();s.hasNext();){var o=s.next(),n=o.getSym();null!==n&&this.remove(n),this.dirEdges.remove(o);var a=o.getEdge();null!==a&&this.edges.remove(a)}this.nodeMap.remove(i.getCoordinate()),i.remove()}},findNode:function(t){return this.nodeMap.find(t)},getEdges:function(){return this.edges},nodeIterator:function(){return this.nodeMap.iterator()},contains:function(){if(arguments[0]instanceof pr){var t=arguments[0];return this.edges.contains(t)}if(arguments[0]instanceof gr){var e=arguments[0];return this.dirEdges.contains(e)}},add:function(){if(arguments[0]instanceof mr){var t=arguments[0];this.nodeMap.add(t)}else if(arguments[0]instanceof pr){var e=arguments[0];this.edges.add(e),this.add(e.getDirEdge(0)),this.add(e.getDirEdge(1))}else if(arguments[0]instanceof gr){var n=arguments[0];this.dirEdges.add(n)}},getNodes:function(){return this.nodeMap.values()},interfaces_:function(){return[]},getClass:function(){return Er}}),h(Ir,Er),e(Ir.prototype,{addEdge:function(t){if(t.isEmpty())return null;var e=H.removeRepeatedPoints(t.getCoordinates());if(e.length<=1)return null;var n=e[0],i=e[e.length-1],r=this.getNode(n),s=this.getNode(i),o=new dr(r,s,e[1],!0),a=new dr(s,r,e[e.length-2],!1),u=new yr(t);u.setDirectedEdges(o,a),this.add(u)},getNode:function(t){var e=this.findNode(t);return null===e&&(e=new mr(t),this.add(e)),e},interfaces_:function(){return[]},getClass:function(){return Ir}}),e(Nr.prototype,{buildEdgeStringsForUnprocessedNodes:function(){for(var t=this.graph.getNodes().iterator();t.hasNext();){var e=t.next();e.isMarked()||(f.isTrue(2===e.getDegree()),this.buildEdgeStringsStartingAt(e),e.setMarked(!0))}},buildEdgeStringsForNonDegree2Nodes:function(){for(var t=this.graph.getNodes().iterator();t.hasNext();){var e=t.next();2!==e.getDegree()&&(this.buildEdgeStringsStartingAt(e),e.setMarked(!0))}},buildEdgeStringsForObviousStartNodes:function(){this.buildEdgeStringsForNonDegree2Nodes()},getMergedLineStrings:function(){return this.merge(),this.mergedLineStrings},buildEdgeStringsStartingAt:function(t){for(var e=t.getOutEdges().iterator();e.hasNext();){var n=e.next();n.getEdge().isMarked()||this.edgeStrings.add(this.buildEdgeStringStartingWith(n))}},merge:function(){if(null!==this.mergedLineStrings)return null;fr.setMarked(this.graph.nodeIterator(),!1),fr.setMarked(this.graph.edgeIterator(),!1),this.edgeStrings=new I,this.buildEdgeStringsForObviousStartNodes(),this.buildEdgeStringsForIsolatedLoops(),this.mergedLineStrings=new I;for(var t=this.edgeStrings.iterator();t.hasNext();){var e=t.next();this.mergedLineStrings.add(e.toLineString())}},buildEdgeStringStartingWith:function(t){var e=new cr(this.factory),n=t;do e.add(n),n.getEdge().setMarked(!0),n=n.getNext();while(null!==n&&n!==t);return e},add:function(){if(arguments[0]instanceof B){var t=arguments[0];t.apply({interfaces_:function(){return[q]},filter:function(t){t instanceof St&&this.add(t)}})}else if(R(arguments[0],v)){var e=arguments[0];this.mergedLineStrings=null;for(var n=e.iterator();n.hasNext();){
var i=n.next();this.add(i)}}else if(arguments[0]instanceof St){var r=arguments[0];null===this.factory&&(this.factory=r.getFactory()),this.graph.addEdge(r)}},buildEdgeStringsForIsolatedLoops:function(){this.buildEdgeStringsForUnprocessedNodes()},interfaces_:function(){return[]},getClass:function(){return Nr}});var wo=Object.freeze({LineMerger:Nr}),Lo=Object.freeze({OverlayOp:ii});h(Cr,gr),e(Cr.prototype,{getNext:function(){return this.next},isInRing:function(){return null!==this.edgeRing},setRing:function(t){this.edgeRing=t},setLabel:function(t){this.label=t},getLabel:function(){return this.label},setNext:function(t){this.next=t},getRing:function(){return this.edgeRing},interfaces_:function(){return[]},getClass:function(){return Cr}}),h(Sr,pr),e(Sr.prototype,{getLine:function(){return this.line},interfaces_:function(){return[]},getClass:function(){return Sr}}),e(wr.prototype,{isIncluded:function(){return this._isIncluded},getCoordinates:function(){if(null===this.ringPts){for(var t=new N,e=this.deList.iterator();e.hasNext();){var n=e.next(),i=n.getEdge();wr.addEdge(i.getLine().getCoordinates(),n.getEdgeDirection(),t)}this.ringPts=t.toCoordinateArray()}return this.ringPts},isIncludedSet:function(){return this._isIncludedSet},isValid:function(){return this.getCoordinates(),this.ringPts.length<=3?!1:(this.getRing(),this.ring.isValid())},build:function(t){var e=t;do this.add(e),e.setRing(this),e=e.getNext(),f.isTrue(null!==e,"found null DE in ring"),f.isTrue(e===t||!e.isInRing(),"found DE already in ring");while(e!==t)},isOuterHole:function(){return this._isHole?!this.hasShell():!1},getPolygon:function(){var t=null;if(null!==this.holes){t=new Array(this.holes.size()).fill(null);for(var e=0;e<this.holes.size();e++)t[e]=this.holes.get(e)}var n=this.factory.createPolygon(this.ring,t);return n},isHole:function(){return this._isHole},isProcessed:function(){return this._isProcessed},addHole:function(){if(arguments[0]instanceof bt){var t=arguments[0];null===this.holes&&(this.holes=new I),this.holes.add(t)}else if(arguments[0]instanceof wr){var e=arguments[0];e.setShell(this);var n=e.getRing();null===this.holes&&(this.holes=new I),this.holes.add(n)}},setIncluded:function(t){this._isIncluded=t,this._isIncludedSet=!0},getOuterHole:function(){if(this.isHole())return null;for(var t=0;t<this.deList.size();t++){var e=this.deList.get(t),n=e.getSym().getRing();if(n.isOuterHole())return n}return null},computeHole:function(){var t=this.getRing();this._isHole=he.isCCW(t.getCoordinates())},hasShell:function(){return null!==this.shell},isOuterShell:function(){return null!==this.getOuterHole()},getLineString:function(){return this.getCoordinates(),this.factory.createLineString(this.ringPts)},toString:function(){return se.toLineString(new Gt(this.getCoordinates()))},getShell:function(){return this.isHole()?this.shell:this},add:function(t){this.deList.add(t)},getRing:function(){if(null!==this.ring)return this.ring;this.getCoordinates(),this.ringPts.length<3&&A.out.println(this.ringPts);try{this.ring=this.factory.createLinearRing(this.ringPts)}catch(t){if(!(t instanceof S))throw t;A.out.println(this.ringPts)}finally{}return this.ring},updateIncluded:function(){if(this.isHole())return null;for(var t=0;t<this.deList.size();t++){var e=this.deList.get(t),n=e.getSym().getRing().getShell();if(null!==n&&n.isIncludedSet())return this.setIncluded(!n.isIncluded()),null}},setShell:function(t){this.shell=t},setProcessed:function(t){this._isProcessed=t},interfaces_:function(){return[]},getClass:function(){return wr}}),wr.findDirEdgesInRing=function(t){var e=t,n=new I;do n.add(e),e=e.getNext(),f.isTrue(null!==e,"found null DE in ring"),f.isTrue(e===t||!e.isInRing(),"found DE already in ring");while(e!==t);return n},wr.addEdge=function(t,e,n){if(e)for(var i=0;i<t.length;i++)n.add(t[i],!1);else for(var i=t.length-1;i>=0;i--)n.add(t[i],!1)},wr.findEdgeRingContaining=function(t,e){for(var n=t.getRing(),i=n.getEnvelopeInternal(),r=n.getCoordinateN(0),s=null,o=null,a=e.iterator();a.hasNext();){var u=a.next(),l=u.getRing(),h=l.getEnvelopeInternal();if(!h.equals(i)&&h.contains(i)){r=H.ptNotInList(n.getCoordinates(),l.getCoordinates());var c=!1;he.isPointInRing(r,l.getCoordinates())&&(c=!0),c&&(null===s||o.contains(h))&&(s=u,o=s.getRing().getEnvelopeInternal())}}return s},e(Lr.prototype,{compare:function(t,e){var n=t,i=e;return n.getRing().getEnvelope().compareTo(i.getRing().getEnvelope())},interfaces_:function(){return[a]},getClass:function(){return Lr}}),wr.EnvelopeComparator=Lr,h(Rr,Er),e(Rr.prototype,{findEdgeRing:function(t){var e=new wr(this.factory);return e.build(t),e},computeDepthParity:function(){if(0===arguments.length)for(;;){var t=null;if(null===t)return null;this.computeDepthParity(t)}else if(1===arguments.length){arguments[0]}},computeNextCWEdges:function(){for(var t=this.nodeIterator();t.hasNext();){var e=t.next();Rr.computeNextCWEdges(e)}},addEdge:function(t){if(t.isEmpty())return null;var e=H.removeRepeatedPoints(t.getCoordinates());if(e.length<2)return null;var n=e[0],i=e[e.length-1],r=this.getNode(n),s=this.getNode(i),o=new Cr(r,s,e[1],!0),a=new Cr(s,r,e[e.length-2],!1),u=new Sr(t);u.setDirectedEdges(o,a),this.add(u)},deleteCutEdges:function(){this.computeNextCWEdges(),Rr.findLabeledEdgeRings(this.dirEdges);for(var t=new I,e=this.dirEdges.iterator();e.hasNext();){var n=e.next();if(!n.isMarked()){var i=n.getSym();if(n.getLabel()===i.getLabel()){n.setMarked(!0),i.setMarked(!0);var r=n.getEdge();t.add(r.getLine())}}}return t},getEdgeRings:function(){this.computeNextCWEdges(),Rr.label(this.dirEdges,-1);var t=Rr.findLabeledEdgeRings(this.dirEdges);this.convertMaximalToMinimalEdgeRings(t);for(var e=new I,n=this.dirEdges.iterator();n.hasNext();){var i=n.next();if(!i.isMarked()&&!i.isInRing()){var r=this.findEdgeRing(i);e.add(r)}}return e},getNode:function(t){var e=this.findNode(t);return null===e&&(e=new mr(t),this.add(e)),e},convertMaximalToMinimalEdgeRings:function(t){for(var e=t.iterator();e.hasNext();){var n=e.next(),i=n.getLabel(),r=Rr.findIntersectionNodes(n,i);if(null!==r)for(var s=r.iterator();s.hasNext();){var o=s.next();Rr.computeNextCCWEdges(o,i)}}},deleteDangles:function(){for(var t=this.findNodesOfDegree(1),e=new J,n=new pe,i=t.iterator();i.hasNext();)n.push(i.next());for(;!n.isEmpty();){var r=n.pop();Rr.deleteAllEdges(r);for(var s=r.getOutEdges().getEdges(),i=s.iterator();i.hasNext();){var o=i.next();o.setMarked(!0);var a=o.getSym();null!==a&&a.setMarked(!0);var u=o.getEdge();e.add(u.getLine());var l=o.getToNode();1===Rr.getDegreeNonDeleted(l)&&n.push(l)}}return e},interfaces_:function(){return[]},getClass:function(){return Rr}}),Rr.findLabeledEdgeRings=function(t){for(var e=new I,n=1,i=t.iterator();i.hasNext();){var r=i.next();if(!(r.isMarked()||r.getLabel()>=0)){e.add(r);var s=wr.findDirEdgesInRing(r);Rr.label(s,n),n++}}return e},Rr.getDegreeNonDeleted=function(t){for(var e=t.getOutEdges().getEdges(),n=0,i=e.iterator();i.hasNext();){var r=i.next();r.isMarked()||n++}return n},Rr.deleteAllEdges=function(t){for(var e=t.getOutEdges().getEdges(),n=e.iterator();n.hasNext();){var i=n.next();i.setMarked(!0);var r=i.getSym();null!==r&&r.setMarked(!0)}},Rr.label=function(t,e){for(var n=t.iterator();n.hasNext();){var i=n.next();i.setLabel(e)}},Rr.computeNextCWEdges=function(t){for(var e=t.getOutEdges(),n=null,i=null,r=e.getEdges().iterator();r.hasNext();){var s=r.next();if(!s.isMarked()){if(null===n&&(n=s),null!==i){var o=i.getSym();o.setNext(s)}i=s}}if(null!==i){var o=i.getSym();o.setNext(n)}},Rr.computeNextCCWEdges=function(t,e){for(var n=t.getOutEdges(),i=null,r=null,s=n.getEdges(),o=s.size()-1;o>=0;o--){var a=s.get(o),u=a.getSym(),l=null;a.getLabel()===e&&(l=a);var h=null;u.getLabel()===e&&(h=u),null===l&&null===h||(null!==h&&(r=h),null!==l&&(null!==r&&(r.setNext(l),r=null),null===i&&(i=l)))}null!==r&&(f.isTrue(null!==i),r.setNext(i))},Rr.getDegree=function(t,e){for(var n=t.getOutEdges().getEdges(),i=0,r=n.iterator();r.hasNext();){var s=r.next();s.getLabel()===e&&i++}return i},Rr.findIntersectionNodes=function(t,e){var n=t,i=null;do{var r=n.getFromNode();Rr.getDegree(r,e)>1&&(null===i&&(i=new I),i.add(r)),n=n.getNext(),f.isTrue(null!==n,"found null DE in ring"),f.isTrue(n===t||!n.isInRing(),"found DE already in ring")}while(n!==t);return i},e(Tr.prototype,{getGeometry:function(){return null===this.geomFactory&&(this.geomFactory=new ie),this.polygonize(),this.extractOnlyPolygonal?this.geomFactory.buildGeometry(this.polyList):this.geomFactory.createGeometryCollection(ie.toGeometryArray(this.polyList))},getInvalidRingLines:function(){return this.polygonize(),this.invalidRingLines},findValidRings:function(t,e,n){for(var i=t.iterator();i.hasNext();){var r=i.next();r.isValid()?e.add(r):n.add(r.getLineString())}},polygonize:function(){if(null!==this.polyList)return null;if(this.polyList=new I,null===this.graph)return null;this.dangles=this.graph.deleteDangles(),this.cutEdges=this.graph.deleteCutEdges();var t=this.graph.getEdgeRings(),e=new I;this.invalidRingLines=new I,this.isCheckingRingsValid?this.findValidRings(t,e,this.invalidRingLines):e=t,this.findShellsAndHoles(e),Tr.assignHolesToShells(this.holeList,this.shellList),ho.sort(this.shellList,new wr.EnvelopeComparator);var n=!0;this.extractOnlyPolygonal&&(Tr.findDisjointShells(this.shellList),n=!1),this.polyList=Tr.extractPolygons(this.shellList,n)},getDangles:function(){return this.polygonize(),this.dangles},getCutEdges:function(){return this.polygonize(),this.cutEdges},getPolygons:function(){return this.polygonize(),this.polyList},add:function(){if(R(arguments[0],v))for(var t=arguments[0],e=t.iterator();e.hasNext();){var n=e.next();this.add(n)}else if(arguments[0]instanceof St){var i=arguments[0];this.geomFactory=i.getFactory(),null===this.graph&&(this.graph=new Rr(this.geomFactory)),this.graph.addEdge(i)}else if(arguments[0]instanceof B){var r=arguments[0];r.apply(this.lineStringAdder)}},setCheckRingsValid:function(t){this.isCheckingRingsValid=t},findShellsAndHoles:function(t){this.holeList=new I,this.shellList=new I;for(var e=t.iterator();e.hasNext();){var n=e.next();n.computeHole(),n.isHole()?this.holeList.add(n):this.shellList.add(n)}},interfaces_:function(){return[]},getClass:function(){return Tr}}),Tr.findOuterShells=function(t){for(var e=t.iterator();e.hasNext();){var n=e.next(),i=n.getOuterHole();null===i||i.isProcessed()||(n.setIncluded(!0),i.setProcessed(!0))}},Tr.extractPolygons=function(t,e){for(var n=new I,i=t.iterator();i.hasNext();){var r=i.next();(e||r.isIncluded())&&n.add(r.getPolygon())}return n},Tr.assignHolesToShells=function(t,e){for(var n=t.iterator();n.hasNext();){var i=n.next();Tr.assignHoleToShell(i,e)}},Tr.assignHoleToShell=function(t,e){var n=wr.findEdgeRingContaining(t,e);null!==n&&n.addHole(t)},Tr.findDisjointShells=function(t){Tr.findOuterShells(t);var e=null;do{e=!1;for(var n=t.iterator();n.hasNext();){var i=n.next();i.isIncludedSet()||(i.updateIncluded(),i.isIncludedSet()||(e=!0))}}while(e)},e(Pr.prototype,{filter:function(t){t instanceof St&&this.p.add(t)},interfaces_:function(){return[q]},getClass:function(){return Pr}}),Tr.LineStringAdder=Pr;var Ro=Object.freeze({Polygonizer:Tr});e(br.prototype,{createEdgeEndForNext:function(t,e,n,i){var r=n.segmentIndex+1;if(r>=t.getNumPoints()&&null===i)return null;var s=t.getCoordinate(r);null!==i&&i.segmentIndex===n.segmentIndex&&(s=i.coord);var o=new En(t,n.coord,s,new gn(t.getLabel()));e.add(o)},createEdgeEndForPrev:function(t,e,n,i){var r=n.segmentIndex;if(0===n.dist){if(0===r)return null;r--}var s=t.getCoordinate(r);null!==i&&i.segmentIndex>=r&&(s=i.coord);var o=new gn(t.getLabel());o.flip();var a=new En(t,n.coord,s,o);e.add(a)},computeEdgeEnds:function(){if(1===arguments.length){for(var t=arguments[0],e=new I,n=t;n.hasNext();){var i=n.next();this.computeEdgeEnds(i,e)}return e}if(2===arguments.length){var r=arguments[0],s=arguments[1],o=r.getEdgeIntersectionList();o.addEndpoints();var a=o.iterator(),u=null,l=null;if(!a.hasNext())return null;var h=a.next();do u=l,l=h,h=null,a.hasNext()&&(h=a.next()),null!==l&&(this.createEdgeEndForPrev(r,s,l,u),this.createEdgeEndForNext(r,s,l,h));while(null!==l)}},interfaces_:function(){return[]},getClass:function(){return br}}),h(Or,En),e(Or.prototype,{insert:function(t){this.edgeEnds.add(t)},print:function(t){t.println("EdgeEndBundle--> Label: "+this.label);for(var e=this.iterator();e.hasNext();){var n=e.next();n.print(t),t.println()}},iterator:function(){return this.edgeEnds.iterator()},getEdgeEnds:function(){return this.edgeEnds},computeLabelOn:function(t,e){for(var n=0,i=!1,r=this.iterator();r.hasNext();){var s=r.next(),o=s.getLabel().getLocation(t);o===L.BOUNDARY&&n++,o===L.INTERIOR&&(i=!0)}var o=L.NONE;i&&(o=L.INTERIOR),n>0&&(o=$n.determineBoundary(e,n)),this.label.setLocation(t,o)},computeLabelSide:function(t,e){for(var n=this.iterator();n.hasNext();){var i=n.next();if(i.getLabel().isArea()){var r=i.getLabel().getLocation(t,e);if(r===L.INTERIOR)return this.label.setLocation(t,e,L.INTERIOR),null;r===L.EXTERIOR&&this.label.setLocation(t,e,L.EXTERIOR)}}},getLabel:function(){return this.label},computeLabelSides:function(t){this.computeLabelSide(t,cn.LEFT),this.computeLabelSide(t,cn.RIGHT)},updateIM:function(t){Jn.updateIM(this.label,t)},computeLabel:function(t){for(var e=!1,n=this.iterator();n.hasNext();){var i=n.next();i.getLabel().isArea()&&(e=!0)}e?this.label=new gn(L.NONE,L.NONE,L.NONE):this.label=new gn(L.NONE);for(var r=0;2>r;r++)this.computeLabelOn(r,t),e&&this.computeLabelSides(r)},interfaces_:function(){return[]},getClass:function(){return Or}}),h(_r,Pn),e(_r.prototype,{updateIM:function(t){for(var e=this.iterator();e.hasNext();){var n=e.next();n.updateIM(t)}},insert:function(t){var e=this.edgeMap.get(t);null===e?(e=new Or(t),this.insertEdgeEnd(t,e)):e.insert(t)},interfaces_:function(){return[]},getClass:function(){return _r}}),h(Mr,yn),e(Mr.prototype,{updateIMFromEdges:function(t){this.edges.updateIM(t)},computeIM:function(t){t.setAtLeastIfValid(this.label.getLocation(0),this.label.getLocation(1),0)},interfaces_:function(){return[]},getClass:function(){return Mr}}),h(Dr,Nn),e(Dr.prototype,{createNode:function(t){return new Mr(t,new _r)},interfaces_:function(){return[]},getClass:function(){return Dr}}),e(Ar.prototype,{insertEdgeEnds:function(t){for(var e=t.iterator();e.hasNext();){var n=e.next();this.nodes.add(n)}},computeProperIntersectionIM:function(t,e){var n=this.arg[0].getGeometry().getDimension(),i=this.arg[1].getGeometry().getDimension(),r=t.hasProperIntersection(),s=t.hasProperInteriorIntersection();2===n&&2===i?r&&e.setAtLeast("212101212"):2===n&&1===i?(r&&e.setAtLeast("FFF0FFFF2"),s&&e.setAtLeast("1FFFFF1FF")):1===n&&2===i?(r&&e.setAtLeast("F0FFFFFF2"),s&&e.setAtLeast("1F1FFFFFF")):1===n&&1===i&&s&&e.setAtLeast("0FFFFFFFF")},labelIsolatedEdges:function(t,e){for(var n=this.arg[t].getEdgeIterator();n.hasNext();){var i=n.next();i.isIsolated()&&(this.labelIsolatedEdge(i,e,this.arg[e].getGeometry()),this.isolatedEdges.add(i))}},labelIsolatedEdge:function(t,e,n){if(n.getDimension()>0){var i=this.ptLocator.locate(t.getCoordinate(),n);t.getLabel().setAllLocations(e,i)}else t.getLabel().setAllLocations(e,L.EXTERIOR)},computeIM:function(){var t=new fe;if(t.set(L.EXTERIOR,L.EXTERIOR,2),!this.arg[0].getGeometry().getEnvelopeInternal().intersects(this.arg[1].getGeometry().getEnvelopeInternal()))return this.computeDisjointIM(t),t;this.arg[0].computeSelfNodes(this.li,!1),this.arg[1].computeSelfNodes(this.li,!1);var e=this.arg[0].computeEdgeIntersections(this.arg[1],this.li,!1);this.computeIntersectionNodes(0),this.computeIntersectionNodes(1),this.copyNodesAndLabels(0),this.copyNodesAndLabels(1),this.labelIsolatedNodes(),this.computeProperIntersectionIM(e,t);var n=new br,i=n.computeEdgeEnds(this.arg[0].getEdgeIterator());this.insertEdgeEnds(i);var r=n.computeEdgeEnds(this.arg[1].getEdgeIterator());return this.insertEdgeEnds(r),this.labelNodeEdges(),this.labelIsolatedEdges(0,1),this.labelIsolatedEdges(1,0),this.updateIM(t),t},labelNodeEdges:function(){for(var t=this.nodes.iterator();t.hasNext();){var e=t.next();e.getEdges().computeLabelling(this.arg)}},copyNodesAndLabels:function(t){for(var e=this.arg[t].getNodeIterator();e.hasNext();){var n=e.next(),i=this.nodes.addNode(n.getCoordinate());i.setLabel(t,n.getLabel().getLocation(t))}},labelIntersectionNodes:function(t){for(var e=this.arg[t].getEdgeIterator();e.hasNext();)for(var n=e.next(),i=n.getLabel().getLocation(t),r=n.getEdgeIntersectionList().iterator();r.hasNext();){var s=r.next(),o=this.nodes.find(s.coord);o.getLabel().isNull(t)&&(i===L.BOUNDARY?o.setLabelBoundary(t):o.setLabel(t,L.INTERIOR))}},labelIsolatedNode:function(t,e){var n=this.ptLocator.locate(t.getCoordinate(),this.arg[e].getGeometry());t.getLabel().setAllLocations(e,n)},computeIntersectionNodes:function(t){for(var e=this.arg[t].getEdgeIterator();e.hasNext();)for(var n=e.next(),i=n.getLabel().getLocation(t),r=n.getEdgeIntersectionList().iterator();r.hasNext();){var s=r.next(),o=this.nodes.addNode(s.coord);i===L.BOUNDARY?o.setLabelBoundary(t):o.getLabel().isNull(t)&&o.setLabel(t,L.INTERIOR)}},labelIsolatedNodes:function(){for(var t=this.nodes.iterator();t.hasNext();){var e=t.next(),n=e.getLabel();f.isTrue(n.getGeometryCount()>0,"node with empty label found"),e.isIsolated()&&(n.isNull(0)?this.labelIsolatedNode(e,0):this.labelIsolatedNode(e,1))}},updateIM:function(t){for(var e=this.isolatedEdges.iterator();e.hasNext();){var n=e.next();n.updateIM(t)}for(var i=this.nodes.iterator();i.hasNext();){var r=i.next();r.updateIM(t),r.updateIMFromEdges(t)}},computeDisjointIM:function(t){var e=this.arg[0].getGeometry();e.isEmpty()||(t.set(L.INTERIOR,L.EXTERIOR,e.getDimension()),t.set(L.BOUNDARY,L.EXTERIOR,e.getBoundaryDimension()));var n=this.arg[1].getGeometry();n.isEmpty()||(t.set(L.EXTERIOR,L.INTERIOR,n.getDimension()),t.set(L.EXTERIOR,L.BOUNDARY,n.getBoundaryDimension()))},interfaces_:function(){return[]},getClass:function(){return Ar}}),e(Fr.prototype,{isContainedInBoundary:function(t){if(t instanceof Tt)return!1;if(t instanceof Lt)return this.isPointContainedInBoundary(t);if(t instanceof St)return this.isLineStringContainedInBoundary(t);for(var e=0;e<t.getNumGeometries();e++){var n=t.getGeometryN(e);if(!this.isContainedInBoundary(n))return!1}return!0},isLineSegmentContainedInBoundary:function(t,e){if(t.equals(e))return this.isPointContainedInBoundary(t);if(t.x===e.x){if(t.x===this.rectEnv.getMinX()||t.x===this.rectEnv.getMaxX())return!0}else if(t.y===e.y&&(t.y===this.rectEnv.getMinY()||t.y===this.rectEnv.getMaxY()))return!0;return!1},isLineStringContainedInBoundary:function(t){for(var e=t.getCoordinateSequence(),n=new g,i=new g,r=0;r<e.size()-1;r++)if(e.getCoordinate(r,n),e.getCoordinate(r+1,i),!this.isLineSegmentContainedInBoundary(n,i))return!1;return!0},isPointContainedInBoundary:function(){if(arguments[0]instanceof Lt){var t=arguments[0];return this.isPointContainedInBoundary(t.getCoordinate())}if(arguments[0]instanceof g){var e=arguments[0];return e.x===this.rectEnv.getMinX()||e.x===this.rectEnv.getMaxX()||e.y===this.rectEnv.getMinY()||e.y===this.rectEnv.getMaxY()}},contains:function(t){return this.rectEnv.contains(t.getEnvelopeInternal())?!this.isContainedInBoundary(t):!1},interfaces_:function(){return[]},getClass:function(){return Fr}}),Fr.contains=function(t,e){var n=new Fr(t);return n.contains(e)},e(Gr.prototype,{intersects:function(t,e){var n=new C(t,e);if(!this.rectEnv.intersects(n))return!1;if(this.rectEnv.intersects(t))return!0;if(this.rectEnv.intersects(e))return!0;if(t.compareTo(e)>0){var i=t;t=e,e=i}var r=!1;return e.y>t.y&&(r=!0),r?this.li.computeIntersection(t,e,this.diagDown0,this.diagDown1):this.li.computeIntersection(t,e,this.diagUp0,this.diagUp1),!!this.li.hasIntersection()},interfaces_:function(){return[]},getClass:function(){return Gr}}),e(qr.prototype,{applyTo:function(t){for(var e=0;e<t.getNumGeometries()&&!this._isDone;e++){var n=t.getGeometryN(e);if(n instanceof ft)this.applyTo(n);else if(this.visit(n),this.isDone())return this._isDone=!0,null}},interfaces_:function(){return[]},getClass:function(){return qr}}),e(Br.prototype,{intersects:function(t){if(!this.rectEnv.intersects(t.getEnvelopeInternal()))return!1;var e=new zr(this.rectEnv);if(e.applyTo(t),e.intersects())return!0;var n=new Vr(this.rectangle);if(n.applyTo(t),n.containsPoint())return!0;var i=new kr(this.rectangle);return i.applyTo(t),!!i.intersects()},interfaces_:function(){return[]},getClass:function(){return Br}}),Br.intersects=function(t,e){var n=new Br(t);return n.intersects(e)},h(zr,qr),e(zr.prototype,{isDone:function(){return this._intersects===!0},visit:function(t){var e=t.getEnvelopeInternal();return this.rectEnv.intersects(e)?this.rectEnv.contains(e)?(this._intersects=!0,null):e.getMinX()>=this.rectEnv.getMinX()&&e.getMaxX()<=this.rectEnv.getMaxX()?(this._intersects=!0,null):e.getMinY()>=this.rectEnv.getMinY()&&e.getMaxY()<=this.rectEnv.getMaxY()?(this._intersects=!0,null):void 0:null},intersects:function(){return this._intersects},interfaces_:function(){return[]},getClass:function(){return zr}}),h(Vr,qr),e(Vr.prototype,{isDone:function(){return this._containsPoint===!0},visit:function(t){if(!(t instanceof Tt))return null;var e=t.getEnvelopeInternal();if(!this.rectEnv.intersects(e))return null;for(var n=new g,i=0;4>i;i++)if(this.rectSeq.getCoordinate(i,n),e.contains(n)&&Tn.containsPointInPolygon(n,t))return this._containsPoint=!0,null},containsPoint:function(){return this._containsPoint},interfaces_:function(){return[]},getClass:function(){return Vr}}),h(kr,qr),e(kr.prototype,{intersects:function(){return this.hasIntersection},isDone:function(){return this.hasIntersection===!0},visit:function(t){var e=t.getEnvelopeInternal();if(!this.rectEnv.intersects(e))return null;var n=kn.getLines(t);this.checkIntersectionWithLineStrings(n)},checkIntersectionWithLineStrings:function(t){for(var e=t.iterator();e.hasNext();){var n=e.next();if(this.checkIntersectionWithSegments(n),this.hasIntersection)return null}},checkIntersectionWithSegments:function(t){for(var e=t.getCoordinateSequence(),n=1;n<e.size();n++)if(e.getCoordinate(n-1,this.p0),e.getCoordinate(n,this.p1),this.rectIntersector.intersects(this.p0,this.p1))return this.hasIntersection=!0,null},interfaces_:function(){return[]},getClass:function(){return kr}}),h(Yr,ti),e(Yr.prototype,{getIntersectionMatrix:function(){return this._relate.computeIM()},interfaces_:function(){return[]},getClass:function(){return Yr}}),Yr.covers=function(t,e){return t.getEnvelopeInternal().covers(e.getEnvelopeInternal())?t.isRectangle()?!0:Yr.relate(t,e).isCovers():!1},Yr.intersects=function(t,e){return t.getEnvelopeInternal().intersects(e.getEnvelopeInternal())?t.isRectangle()?Br.intersects(t,e):e.isRectangle()?Br.intersects(e,t):Yr.relate(t,e).isIntersects():!1},Yr.touches=function(t,e){return t.getEnvelopeInternal().intersects(e.getEnvelopeInternal())?Yr.relate(t,e).isTouches(t.getDimension(),e.getDimension()):!1},Yr.within=function(t,e){return e.contains(t)},Yr.coveredBy=function(t,e){return Yr.covers(e,t)},Yr.relate=function(){if(2===arguments.length){var t=arguments[0],e=arguments[1],n=new Yr(t,e),i=n.getIntersectionMatrix();return i}if(3===arguments.length){if("string"==typeof arguments[2]&&arguments[0]instanceof B&&arguments[1]instanceof B){var r=arguments[0],s=arguments[1],o=arguments[2];return Yr.relateWithCheck(r,s).matches(o)}if(R(arguments[2],V)&&arguments[0]instanceof B&&arguments[1]instanceof B){var a=arguments[0],u=arguments[1],l=arguments[2],n=new Yr(a,u,l),i=n.getIntersectionMatrix();return i}}},Yr.overlaps=function(t,e){return t.getEnvelopeInternal().intersects(e.getEnvelopeInternal())?Yr.relate(t,e).isOverlaps(t.getDimension(),e.getDimension()):!1},Yr.disjoint=function(t,e){return!t.intersects(e)},Yr.relateWithCheck=function(t,e){return t.checkNotGeometryCollection(t),t.checkNotGeometryCollection(e),Yr.relate(t,e)},Yr.crosses=function(t,e){return t.getEnvelopeInternal().intersects(e.getEnvelopeInternal())?Yr.relate(t,e).isCrosses(t.getDimension(),e.getDimension()):!1},Yr.contains=function(t,e){return t.getEnvelopeInternal().contains(e.getEnvelopeInternal())?t.isRectangle()?Fr.contains(t,e):Yr.relate(t,e).isContains():!1};var To=Object.freeze({RelateOp:Yr});e(Ur.prototype,{extractElements:function(t,e){if(null===t)return null;for(var n=0;n<t.getNumGeometries();n++){var i=t.getGeometryN(n);this.skipEmpty&&i.isEmpty()||e.add(i)}},combine:function(){for(var t=new I,e=this.inputGeoms.iterator();e.hasNext();){var n=e.next();this.extractElements(n,t)}return 0===t.size()?null!==this.geomFactory?this.geomFactory.createGeometryCollection(null):null:this.geomFactory.buildGeometry(t)},interfaces_:function(){return[]},getClass:function(){return Ur}}),Ur.combine=function(){if(1===arguments.length){var t=arguments[0],e=new Ur(t);return e.combine()}if(2===arguments.length){var n=arguments[0],i=arguments[1],e=new Ur(Ur.createList(n,i));return e.combine()}if(3===arguments.length){var r=arguments[0],s=arguments[1],o=arguments[2],e=new Ur(Ur.createList(r,s,o));return e.combine()}},Ur.extractFactory=function(t){return t.isEmpty()?null:t.iterator().next().getFactory()},Ur.createList=function(){if(2===arguments.length){var t=arguments[0],e=arguments[1],n=new I;return n.add(t),n.add(e),n}if(3===arguments.length){var i=arguments[0],r=arguments[1],s=arguments[2],n=new I;return n.add(i),n.add(r),n.add(s),n}},e(Xr.prototype,{union:function(){for(var t=new Te,e=new at,n=0;n<this.pointGeom.getNumGeometries();n++){var i=this.pointGeom.getGeometryN(n),r=i.getCoordinate(),s=t.locate(r,this.otherGeom);s===L.EXTERIOR&&e.add(r)}if(0===e.size())return this.otherGeom;var o=null,a=H.toCoordinateArray(e);return o=1===a.length?this.geomFact.createPoint(a[0]):this.geomFact.createMultiPointFromCoords(a),Ur.combine(o,this.otherGeom)},interfaces_:function(){return[]},getClass:function(){return Xr}}),Xr.union=function(t,e){var n=new Xr(t,e);return n.union()},e(Hr.prototype,{filter:function(t){-1!==this.sortIndex&&t.getSortIndex()!==this.sortIndex||this.comps.add(t)},interfaces_:function(){return[ht]},getClass:function(){return Hr}}),Hr.extract=function(){if(2===arguments.length){var t=arguments[0],e=arguments[1];return Hr.extract(t,e,new I)}if(3===arguments.length){var n=arguments[0],i=arguments[1],r=arguments[2];return n.getSortIndex()===i?r.add(n):n instanceof ft&&n.apply(new Hr(i,r)),r}},e(Wr.prototype,{reduceToGeometries:function(t){for(var e=new I,n=t.iterator();n.hasNext();){var i=n.next(),r=null;R(i,y)?r=this.unionTree(i):i instanceof B&&(r=i),e.add(r)}return e},extractByEnvelope:function(t,e,n){for(var i=new I,r=0;r<e.getNumGeometries();r++){var s=e.getGeometryN(r);s.getEnvelopeInternal().intersects(t)?i.add(s):n.add(s)}return this.geomFactory.buildGeometry(i)},unionOptimized:function(t,e){var n=t.getEnvelopeInternal(),i=e.getEnvelopeInternal();if(!n.intersects(i)){var r=Ur.combine(t,e);return r}if(t.getNumGeometries()<=1&&e.getNumGeometries()<=1)return this.unionActual(t,e);var s=n.intersection(i);return this.unionUsingEnvelopeIntersection(t,e,s)},union:function(){if(null===this.inputPolys)throw new IllegalStateException("union() method cannot be called twice");if(this.inputPolys.isEmpty())return null;this.geomFactory=this.inputPolys.iterator().next().getFactory();for(var t=new ke(Wr.STRTREE_NODE_CAPACITY),e=this.inputPolys.iterator();e.hasNext();){var n=e.next();t.insert(n.getEnvelopeInternal(),n)}this.inputPolys=null;var i=t.itemsTree(),r=this.unionTree(i);return r},binaryUnion:function(){if(1===arguments.length){var t=arguments[0];return this.binaryUnion(t,0,t.size())}if(3===arguments.length){var e=arguments[0],n=arguments[1],i=arguments[2];if(1>=i-n){var r=Wr.getGeometry(e,n);return this.unionSafe(r,null)}if(i-n===2)return this.unionSafe(Wr.getGeometry(e,n),Wr.getGeometry(e,n+1));var s=Math.trunc((i+n)/2),r=this.binaryUnion(e,n,s),o=this.binaryUnion(e,s,i);return this.unionSafe(r,o)}},repeatedUnion:function(t){for(var e=null,n=t.iterator();n.hasNext();){var i=n.next();e=null===e?i.copy():e.union(i)}return e},unionSafe:function(t,e){return null===t&&null===e?null:null===t?e.copy():null===e?t.copy():this.unionOptimized(t,e)},unionActual:function(t,e){return Wr.restrictToPolygons(t.union(e))},unionTree:function(t){var e=this.reduceToGeometries(t),n=this.binaryUnion(e);return n},unionUsingEnvelopeIntersection:function(t,e,n){var i=new I,r=this.extractByEnvelope(n,t,i),s=this.extractByEnvelope(n,e,i),o=this.unionActual(r,s);i.add(o);var a=Ur.combine(i);return a},bufferUnion:function(){if(1===arguments.length){var t=arguments[0],e=t.get(0).getFactory(),n=e.buildGeometry(t),i=n.buffer(0);return i}if(2===arguments.length){var r=arguments[0],s=arguments[1],e=r.getFactory(),n=e.createGeometryCollection([r,s]),i=n.buffer(0);return i}},interfaces_:function(){return[]},getClass:function(){return Wr}}),Wr.restrictToPolygons=function(t){if(R(t,Rt))return t;var e=or.getPolygons(t);return 1===e.size()?e.get(0):t.getFactory().createMultiPolygon(ie.toPolygonArray(e))},Wr.getGeometry=function(t,e){return e>=t.size()?null:t.get(e)},Wr.union=function(t){var e=new Wr(t);return e.union()},Wr.STRTREE_NODE_CAPACITY=4,e(jr.prototype,{unionNoOpt:function(t){var e=this.geomFact.createPoint();return si.overlayOp(t,e,ii.UNION)},unionWithNull:function(t,e){return null===t&&null===e?null:null===e?t:null===t?e:t.union(e)},extract:function(){if(R(arguments[0],v))for(var t=arguments[0],e=t.iterator();e.hasNext();){var n=e.next();this.extract(n)}else if(arguments[0]instanceof B){var i=arguments[0];null===this.geomFact&&(this.geomFact=i.getFactory()),Hr.extract(i,B.SORTINDEX_POLYGON,this.polygons),Hr.extract(i,B.SORTINDEX_LINESTRING,this.lines),Hr.extract(i,B.SORTINDEX_POINT,this.points)}},union:function t(){if(null===this.geomFact)return null;var e=null;if(this.points.size()>0){var n=this.geomFact.buildGeometry(this.points);e=this.unionNoOpt(n)}var i=null;if(this.lines.size()>0){var r=this.geomFact.buildGeometry(this.lines);i=this.unionNoOpt(r)}var s=null;this.polygons.size()>0&&(s=Wr.union(this.polygons));var o=this.unionWithNull(i,s),t=null;return t=null===e?o:null===o?e:Xr.union(e,o),null===t?this.geomFact.createGeometryCollection():t},interfaces_:function(){return[]},getClass:function(){return jr}}),jr.union=function(){if(1===arguments.length){if(R(arguments[0],v)){var t=arguments[0],e=new jr(t);return e.union()}if(arguments[0]instanceof B){var n=arguments[0],e=new jr(n);return e.union()}}else if(2===arguments.length){var i=arguments[0],r=arguments[1],e=new jr(i,r);return e.union()}};var Po=Object.freeze({UnaryUnionOp:jr});e(Kr.prototype,{visitInteriorRing:function(t,e){var n=t.getCoordinates(),i=n[0],r=Kr.findDifferentPoint(n,i),s=e.findEdgeInSameDirection(i,r),o=e.findEdgeEnd(s),a=null;o.getLabel().getLocation(0,cn.RIGHT)===L.INTERIOR?a=o:o.getSym().getLabel().getLocation(0,cn.RIGHT)===L.INTERIOR&&(a=o.getSym()),f.isTrue(null!==a,"unable to find dirEdge with Interior on RHS"),this.visitLinkedDirectedEdges(a)},visitShellInteriors:function(t,e){if(t instanceof Tt){var n=t;this.visitInteriorRing(n.getExteriorRing(),e)}if(t instanceof Ot)for(var i=t,r=0;r<i.getNumGeometries();r++){var n=i.getGeometryN(r);this.visitInteriorRing(n.getExteriorRing(),e)}},getCoordinate:function(){return this.disconnectedRingcoord},setInteriorEdgesInResult:function(t){for(var e=t.getEdgeEnds().iterator();e.hasNext();){var n=e.next();n.getLabel().getLocation(0,cn.RIGHT)===L.INTERIOR&&n.setInResult(!0)}},visitLinkedDirectedEdges:function(t){var e=t,n=t;do f.isTrue(null!==n,"found null Directed Edge"),n.setVisited(!0),n=n.getNext();while(n!==e)},buildEdgeRings:function(t){for(var e=new I,n=t.iterator();n.hasNext();){var i=n.next();if(i.isInResult()&&null===i.getEdgeRing()){var r=new vn(i,this.geometryFactory);r.linkDirectedEdgesForMinimalEdgeRings();var s=r.buildMinimalRings();e.addAll(s)}}return e},hasUnvisitedShellEdge:function(t){for(var e=0;e<t.size();e++){var n=t.get(e);if(!n.isHole()){var i=n.getEdges(),r=i.get(0);if(r.getLabel().getLocation(0,cn.RIGHT)===L.INTERIOR)for(var s=0;s<i.size();s++)if(r=i.get(s),
!r.isVisited())return this.disconnectedRingcoord=r.getCoordinate(),!0}}return!1},isInteriorsConnected:function(){var t=new I;this.geomGraph.computeSplitEdges(t);var e=new Cn(new On);e.addEdges(t),this.setInteriorEdgesInResult(e),e.linkResultDirectedEdges();var n=this.buildEdgeRings(e.getEdgeEnds());return this.visitShellInteriors(this.geomGraph.getGeometry(),e),!this.hasUnvisitedShellEdge(n)},interfaces_:function(){return[]},getClass:function(){return Kr}}),Kr.findDifferentPoint=function(t,e){for(var n=0;n<t.length;n++)if(!t[n].equals(e))return t[n];return null},e(Zr.prototype,{hasChildren:function(){for(var t=0;2>t;t++)if(null!==this.subnode[t])return!0;return!1},isPrunable:function(){return!(this.hasChildren()||this.hasItems())},addAllItems:function(t){t.addAll(this.items);for(var e=0;2>e;e++)null!==this.subnode[e]&&this.subnode[e].addAllItems(t);return t},size:function(){for(var t=0,e=0;2>e;e++)null!==this.subnode[e]&&(t+=this.subnode[e].size());return t+this.items.size()},addAllItemsFromOverlapping:function(t,e){return null===t||this.isSearchMatch(t)?(e.addAll(this.items),null!==this.subnode[0]&&this.subnode[0].addAllItemsFromOverlapping(t,e),void(null!==this.subnode[1]&&this.subnode[1].addAllItemsFromOverlapping(t,e))):null},hasItems:function(){return!this.items.isEmpty()},remove:function(t,e){if(!this.isSearchMatch(t))return!1;for(var n=!1,i=0;2>i;i++)if(null!==this.subnode[i]&&(n=this.subnode[i].remove(t,e))){this.subnode[i].isPrunable()&&(this.subnode[i]=null);break}return n?n:n=this.items.remove(e)},getItems:function(){return this.items},depth:function(){for(var t=0,e=0;2>e;e++)if(null!==this.subnode[e]){var n=this.subnode[e].depth();n>t&&(t=n)}return t+1},nodeSize:function(){for(var t=0,e=0;2>e;e++)null!==this.subnode[e]&&(t+=this.subnode[e].nodeSize());return t+1},add:function(t){this.items.add(t)},interfaces_:function(){return[]},getClass:function(){return Zr}}),Zr.getSubnodeIndex=function(t,e){var n=-1;return t.min>=e&&(n=1),t.max<=e&&(n=0),n},e(Qr.prototype,{expandToInclude:function(t){t.max>this.max&&(this.max=t.max),t.min<this.min&&(this.min=t.min)},getWidth:function(){return this.max-this.min},overlaps:function(){if(1===arguments.length){var t=arguments[0];return this.overlaps(t.min,t.max)}if(2===arguments.length){var e=arguments[0],n=arguments[1];return!(this.min>n||this.max<e)}},getMin:function(){return this.min},toString:function(){return"["+this.min+", "+this.max+"]"},contains:function(){if(1===arguments.length){if(arguments[0]instanceof Qr){var t=arguments[0];return this.contains(t.min,t.max)}if("number"==typeof arguments[0]){var e=arguments[0];return e>=this.min&&e<=this.max}}else if(2===arguments.length){var n=arguments[0],i=arguments[1];return n>=this.min&&i<=this.max}},init:function(t,e){this.min=t,this.max=e,t>e&&(this.min=e,this.max=t)},getMax:function(){return this.max},interfaces_:function(){return[]},getClass:function(){return Qr}}),e(Jr.prototype,{getInterval:function(){return this.interval},getLevel:function(){return this.level},computeKey:function(t){for(this.level=Jr.computeLevel(t),this.interval=new Qr,this.computeInterval(this.level,t);!this.interval.contains(t);)this.level+=1,this.computeInterval(this.level,t)},computeInterval:function(t,e){var n=Ci.powerOf2(t);this.pt=Math.floor(e.getMin()/n)*n,this.interval.init(this.pt,this.pt+n)},getPoint:function(){return this.pt},interfaces_:function(){return[]},getClass:function(){return Jr}}),Jr.computeLevel=function(t){var e=t.getWidth(),n=Ci.exponent(e)+1;return n},h($r,Zr),e($r.prototype,{getInterval:function(){return this.interval},find:function(t){var e=Zr.getSubnodeIndex(t,this.centre);if(-1===e)return this;if(null!==this.subnode[e]){var n=this.subnode[e];return n.find(t)}return this},insert:function(t){f.isTrue(null===this.interval||this.interval.contains(t.interval));var e=Zr.getSubnodeIndex(t.interval,this.centre);if(t.level===this.level-1)this.subnode[e]=t;else{var n=this.createSubnode(e);n.insert(t),this.subnode[e]=n}},isSearchMatch:function(t){return t.overlaps(this.interval)},getSubnode:function(t){return null===this.subnode[t]&&(this.subnode[t]=this.createSubnode(t)),this.subnode[t]},getNode:function(t){var e=Zr.getSubnodeIndex(t,this.centre);if(-1!==e){var n=this.getSubnode(e);return n.getNode(t)}return this},createSubnode:function(t){var e=0,n=0;switch(t){case 0:e=this.interval.getMin(),n=this.centre;break;case 1:e=this.centre,n=this.interval.getMax()}var i=new Qr(e,n),r=new $r(i,this.level-1);return r},interfaces_:function(){return[]},getClass:function(){return $r}}),$r.createNode=function(t){var e=new Jr(t),n=new $r(e.getInterval(),e.getLevel());return n},$r.createExpanded=function(t,e){var n=new Qr(e);null!==t&&n.expandToInclude(t.interval);var i=$r.createNode(n);return null!==t&&i.insert(t),i},h(ts,Zr),e(ts.prototype,{insert:function(t,e){var n=Zr.getSubnodeIndex(t,ts.origin);if(-1===n)return this.add(e),null;var i=this.subnode[n];if(null===i||!i.getInterval().contains(t)){var r=$r.createExpanded(i,t);this.subnode[n]=r}this.insertContained(this.subnode[n],t,e)},isSearchMatch:function(t){return!0},insertContained:function(t,e,n){f.isTrue(t.getInterval().contains(e));var i=Ri.isZeroWidth(e.getMin(),e.getMax()),r=null;r=i?t.find(e):t.getNode(e),r.add(n)},interfaces_:function(){return[]},getClass:function(){return ts}}),ts.origin=0,e(es.prototype,{size:function(){return null!==this.root?this.root.size():0},insert:function(t,e){this.collectStats(t);var n=es.ensureExtent(t,this.minExtent);this.root.insert(n,e)},query:function(){if(1===arguments.length){if("number"==typeof arguments[0]){var t=arguments[0];return this.query(new Qr(t,t))}if(arguments[0]instanceof Qr){var e=arguments[0],n=new I;return this.query(e,n),n}}else if(2===arguments.length){var i=arguments[0],r=arguments[1];this.root.addAllItemsFromOverlapping(i,r)}},iterator:function(){var t=new I;return this.root.addAllItems(t),t.iterator()},remove:function(t,e){var n=es.ensureExtent(t,this.minExtent);return this.root.remove(n,e)},collectStats:function(t){var e=t.getWidth();e<this.minExtent&&e>0&&(this.minExtent=e)},depth:function(){return null!==this.root?this.root.depth():0},nodeSize:function(){return null!==this.root?this.root.nodeSize():0},interfaces_:function(){return[]},getClass:function(){return es}}),es.ensureExtent=function(t,e){var n=t.getMin(),i=t.getMax();return n!==i?t:(n===i&&(n-=e/2,i=n+e/2),new Qr(n,i))},e(ns.prototype,{isInside:function(t){},interfaces_:function(){return[]},getClass:function(){return ns}}),e(is.prototype,{testLineSegment:function(t,e){var n=null,i=null,r=null,s=null,o=null,a=e.p0,u=e.p1;i=a.x-t.x,r=a.y-t.y,s=u.x-t.x,o=u.y-t.y,(r>0&&0>=o||o>0&&0>=r)&&(n=ue.signOfDet2x2(i,r,s,o)/(o-r),n>0&&this.crossings++)},buildIndex:function(){this.tree=new es;for(var t=H.removeRepeatedPoints(this.ring.getCoordinates()),e=$e.getChains(t),n=0;n<e.size();n++){var i=e.get(n),r=i.getEnvelope();this.interval.min=r.getMinY(),this.interval.max=r.getMaxY(),this.tree.insert(this.interval,i)}},testMonotoneChain:function(t,e,n){n.select(t,e)},isInside:function(t){this.crossings=0;var e=new C(r.NEGATIVE_INFINITY,r.POSITIVE_INFINITY,t.y,t.y);this.interval.min=t.y,this.interval.max=t.y;for(var n=this.tree.query(this.interval),i=new rs(this,t),s=n.iterator();s.hasNext();){var o=s.next();this.testMonotoneChain(e,i,o)}return this.crossings%2===1},interfaces_:function(){return[ns]},getClass:function(){return is}}),h(rs,tr),e(rs.prototype,{select:function(){if(1!==arguments.length)return tr.prototype.select.apply(this,arguments);var t=arguments[0];this.mcp.testLineSegment(this.p,t)},interfaces_:function(){return[]},getClass:function(){return rs}}),is.MCSelecter=rs,e(ss.prototype,{insertEdgeEnds:function(t){for(var e=t.iterator();e.hasNext();){var n=e.next();this.nodes.add(n)}},getNodeIterator:function(){return this.nodes.iterator()},copyNodesAndLabels:function(t,e){for(var n=t.getNodeIterator();n.hasNext();){var i=n.next(),r=this.nodes.addNode(i.getCoordinate());r.setLabel(e,i.getLabel().getLocation(e))}},build:function(t){this.computeIntersectionNodes(t,0),this.copyNodesAndLabels(t,0);var e=new br,n=e.computeEdgeEnds(t.getEdgeIterator());this.insertEdgeEnds(n)},computeIntersectionNodes:function(t,e){for(var n=t.getEdgeIterator();n.hasNext();)for(var i=n.next(),r=i.getLabel().getLocation(e),s=i.getEdgeIntersectionList().iterator();s.hasNext();){var o=s.next(),a=this.nodes.addNode(o.coord);r===L.BOUNDARY?a.setLabelBoundary(e):a.getLabel().isNull(e)&&a.setLabel(e,L.INTERIOR)}},interfaces_:function(){return[]},getClass:function(){return ss}}),e(os.prototype,{isNodeEdgeAreaLabelsConsistent:function(){for(var t=this.nodeGraph.getNodeIterator();t.hasNext();){var e=t.next();if(!e.getEdges().isAreaLabelsConsistent(this.geomGraph))return this.invalidPoint=e.getCoordinate().copy(),!1}return!0},getInvalidPoint:function(){return this.invalidPoint},hasDuplicateRings:function(){for(var t=this.nodeGraph.getNodeIterator();t.hasNext();)for(var e=t.next(),n=e.getEdges().iterator();n.hasNext();){var i=n.next();if(i.getEdgeEnds().size()>1)return this.invalidPoint=i.getEdge().getCoordinate(0),!0}return!1},isNodeConsistentArea:function(){var t=this.geomGraph.computeSelfNodes(this.li,!0,!0);return t.hasProperIntersection()?(this.invalidPoint=t.getProperIntersectionPoint(),!1):(this.nodeGraph.build(this.geomGraph),this.isNodeEdgeAreaLabelsConsistent())},interfaces_:function(){return[]},getClass:function(){return os}}),e(as.prototype,{buildIndex:function(){this.index=new ke;for(var t=0;t<this.rings.size();t++){var e=this.rings.get(t),n=e.getEnvelopeInternal();this.index.insert(n,e)}},getNestedPoint:function(){return this.nestedPt},isNonNested:function(){this.buildIndex();for(var t=0;t<this.rings.size();t++)for(var e=this.rings.get(t),n=e.getCoordinates(),i=this.index.query(e.getEnvelopeInternal()),r=0;r<i.size();r++){var s=i.get(r),o=s.getCoordinates();if(e!==s&&e.getEnvelopeInternal().intersects(s.getEnvelopeInternal())){var a=ls.findPtNotNode(n,s,this.graph);if(null!==a){var u=he.isPointInRing(a,o);if(u)return this.nestedPt=a,!1}}}return!0},add:function(t){this.rings.add(t),this.totalEnv.expandToInclude(t.getEnvelopeInternal())},interfaces_:function(){return[]},getClass:function(){return as}}),e(us.prototype,{getErrorType:function(){return this.errorType},getMessage:function(){return us.errMsg[this.errorType]},getCoordinate:function(){return this.pt},toString:function(){var t="";return null!==this.pt&&(t=" at or near point "+this.pt),this.getMessage()+t},interfaces_:function(){return[]},getClass:function(){return us}}),us.ERROR=0,us.REPEATED_POINT=1,us.HOLE_OUTSIDE_SHELL=2,us.NESTED_HOLES=3,us.DISCONNECTED_INTERIOR=4,us.SELF_INTERSECTION=5,us.RING_SELF_INTERSECTION=6,us.NESTED_SHELLS=7,us.DUPLICATE_RINGS=8,us.TOO_FEW_POINTS=9,us.INVALID_COORDINATE=10,us.RING_NOT_CLOSED=11,us.errMsg=["Topology Validation Error","Repeated Point","Hole lies outside shell","Holes are nested","Interior is disconnected","Self-intersection","Ring Self-intersection","Nested shells","Duplicate Rings","Too few distinct points in geometry component","Invalid Coordinate","Ring is not closed"],e(ls.prototype,{checkInvalidCoordinates:function(){if(arguments[0]instanceof Array){for(var t=arguments[0],e=0;e<t.length;e++)if(!ls.isValid(t[e]))return this.validErr=new us(us.INVALID_COORDINATE,t[e]),null}else if(arguments[0]instanceof Tt){var n=arguments[0];if(this.checkInvalidCoordinates(n.getExteriorRing().getCoordinates()),null!==this.validErr)return null;for(var e=0;e<n.getNumInteriorRing();e++)if(this.checkInvalidCoordinates(n.getInteriorRingN(e).getCoordinates()),null!==this.validErr)return null}},checkHolesNotNested:function(t,e){for(var n=new as(e),i=0;i<t.getNumInteriorRing();i++){var r=t.getInteriorRingN(i);n.add(r)}var s=n.isNonNested();s||(this.validErr=new us(us.NESTED_HOLES,n.getNestedPoint()))},checkConsistentArea:function(t){var e=new os(t),n=e.isNodeConsistentArea();return n?void(e.hasDuplicateRings()&&(this.validErr=new us(us.DUPLICATE_RINGS,e.getInvalidPoint()))):(this.validErr=new us(us.SELF_INTERSECTION,e.getInvalidPoint()),null)},isValid:function(){return this.checkValid(this.parentGeometry),null===this.validErr},checkShellInsideHole:function(t,e,n){var i=t.getCoordinates(),r=e.getCoordinates(),s=ls.findPtNotNode(i,e,n);if(null!==s){var o=he.isPointInRing(s,r);if(!o)return s}var a=ls.findPtNotNode(r,t,n);if(null!==a){var u=he.isPointInRing(a,i);return u?a:null}return f.shouldNeverReachHere("points in shell and hole appear to be equal"),null},checkNoSelfIntersectingRings:function(t){for(var e=t.getEdgeIterator();e.hasNext();){var n=e.next();if(this.checkNoSelfIntersectingRing(n.getEdgeIntersectionList()),null!==this.validErr)return null}},checkConnectedInteriors:function(t){var e=new Kr(t);e.isInteriorsConnected()||(this.validErr=new us(us.DISCONNECTED_INTERIOR,e.getCoordinate()))},checkNoSelfIntersectingRing:function(t){for(var e=new at,n=!0,i=t.iterator();i.hasNext();){var r=i.next();if(n)n=!1;else{if(e.contains(r.coord))return this.validErr=new us(us.RING_SELF_INTERSECTION,r.coord),null;e.add(r.coord)}}},checkHolesInShell:function(t,e){for(var n=t.getExteriorRing(),i=new is(n),r=0;r<t.getNumInteriorRing();r++){var s=t.getInteriorRingN(r),o=ls.findPtNotNode(s.getCoordinates(),n,e);if(null===o)return null;var a=!i.isInside(o);if(a)return this.validErr=new us(us.HOLE_OUTSIDE_SHELL,o),null}},checkTooFewPoints:function(t){return t.hasTooFewPoints()?(this.validErr=new us(us.TOO_FEW_POINTS,t.getInvalidPoint()),null):void 0},getValidationError:function(){return this.checkValid(this.parentGeometry),this.validErr},checkValid:function(){if(arguments[0]instanceof Lt){var t=arguments[0];this.checkInvalidCoordinates(t.getCoordinates())}else if(arguments[0]instanceof Pt){var e=arguments[0];this.checkInvalidCoordinates(e.getCoordinates())}else if(arguments[0]instanceof bt){var n=arguments[0];if(this.checkInvalidCoordinates(n.getCoordinates()),null!==this.validErr)return null;if(this.checkClosedRing(n),null!==this.validErr)return null;var i=new $n(0,n);if(this.checkTooFewPoints(i),null!==this.validErr)return null;var r=new ae;i.computeSelfNodes(r,!0,!0),this.checkNoSelfIntersectingRings(i)}else if(arguments[0]instanceof St){var s=arguments[0];if(this.checkInvalidCoordinates(s.getCoordinates()),null!==this.validErr)return null;var i=new $n(0,s);this.checkTooFewPoints(i)}else if(arguments[0]instanceof Tt){var o=arguments[0];if(this.checkInvalidCoordinates(o),null!==this.validErr)return null;if(this.checkClosedRings(o),null!==this.validErr)return null;var i=new $n(0,o);if(this.checkTooFewPoints(i),null!==this.validErr)return null;if(this.checkConsistentArea(i),null!==this.validErr)return null;if(!this.isSelfTouchingRingFormingHoleValid&&(this.checkNoSelfIntersectingRings(i),null!==this.validErr))return null;if(this.checkHolesInShell(o,i),null!==this.validErr)return null;if(this.checkHolesNotNested(o,i),null!==this.validErr)return null;this.checkConnectedInteriors(i)}else if(arguments[0]instanceof Ot){for(var a=arguments[0],u=0;u<a.getNumGeometries();u++){var l=a.getGeometryN(u);if(this.checkInvalidCoordinates(l),null!==this.validErr)return null;if(this.checkClosedRings(l),null!==this.validErr)return null}var i=new $n(0,a);if(this.checkTooFewPoints(i),null!==this.validErr)return null;if(this.checkConsistentArea(i),null!==this.validErr)return null;if(!this.isSelfTouchingRingFormingHoleValid&&(this.checkNoSelfIntersectingRings(i),null!==this.validErr))return null;for(var u=0;u<a.getNumGeometries();u++){var l=a.getGeometryN(u);if(this.checkHolesInShell(l,i),null!==this.validErr)return null}for(var u=0;u<a.getNumGeometries();u++){var l=a.getGeometryN(u);if(this.checkHolesNotNested(l,i),null!==this.validErr)return null}if(this.checkShellsNotNested(a,i),null!==this.validErr)return null;this.checkConnectedInteriors(i)}else if(arguments[0]instanceof ft)for(var h=arguments[0],u=0;u<h.getNumGeometries();u++){var c=h.getGeometryN(u);if(this.checkValid(c),null!==this.validErr)return null}else if(arguments[0]instanceof B){var f=arguments[0];if(this.validErr=null,f.isEmpty())return null;if(f instanceof Lt)this.checkValid(f);else if(f instanceof Pt)this.checkValid(f);else if(f instanceof bt)this.checkValid(f);else if(f instanceof St)this.checkValid(f);else if(f instanceof Tt)this.checkValid(f);else if(f instanceof Ot)this.checkValid(f);else{if(!(f instanceof ft))throw new UnsupportedOperationException(f.getClass().getName());this.checkValid(f)}}},setSelfTouchingRingFormingHoleValid:function(t){this.isSelfTouchingRingFormingHoleValid=t},checkShellNotNested:function(t,e,n){var i=t.getCoordinates(),r=e.getExteriorRing(),s=r.getCoordinates(),o=ls.findPtNotNode(i,r,n);if(null===o)return null;var a=he.isPointInRing(o,s);if(!a)return null;if(e.getNumInteriorRing()<=0)return this.validErr=new us(us.NESTED_SHELLS,o),null;for(var u=null,l=0;l<e.getNumInteriorRing();l++){var h=e.getInteriorRingN(l);if(u=this.checkShellInsideHole(t,h,n),null===u)return null}this.validErr=new us(us.NESTED_SHELLS,u)},checkClosedRings:function(t){if(this.checkClosedRing(t.getExteriorRing()),null!==this.validErr)return null;for(var e=0;e<t.getNumInteriorRing();e++)if(this.checkClosedRing(t.getInteriorRingN(e)),null!==this.validErr)return null},checkClosedRing:function(t){if(!t.isClosed()){var e=null;t.getNumPoints()>=1&&(e=t.getCoordinateN(0)),this.validErr=new us(us.RING_NOT_CLOSED,e)}},checkShellsNotNested:function(t,e){for(var n=0;n<t.getNumGeometries();n++)for(var i=t.getGeometryN(n),r=i.getExteriorRing(),s=0;s<t.getNumGeometries();s++)if(n!==s){var o=t.getGeometryN(s);if(this.checkShellNotNested(r,o,e),null!==this.validErr)return null}},interfaces_:function(){return[]},getClass:function(){return ls}}),ls.findPtNotNode=function(t,e,n){for(var i=n.findEdge(e),r=i.getEdgeIntersectionList(),s=0;s<t.length;s++){var o=t[s];if(!r.isIntersection(o))return o}return null},ls.isValid=function(){if(arguments[0]instanceof B){var t=arguments[0],e=new ls(t);return e.isValid()}if(arguments[0]instanceof g){var n=arguments[0];return r.isNaN(n.x)?!1:r.isInfinite(n.x)?!1:r.isNaN(n.y)?!1:!r.isInfinite(n.y)}};var bo=Object.freeze({IsValidOp:ls}),Oo=Object.freeze({BoundaryOp:dt,IsSimpleOp:Gi,buffer:Co,distance:So,linemerge:wo,overlay:Lo,polygonize:Ro,relate:To,union:Po,valid:bo});h(hs,_t.CoordinateOperation),e(hs.prototype,{editCoordinates:function(t,e){if(0===t.length)return null;for(var n=new Array(t.length).fill(null),i=0;i<t.length;i++){var r=new g(t[i]);this.targetPM.makePrecise(r),n[i]=r}var s=new N(n,!1),o=s.toCoordinateArray(),a=0;e instanceof St&&(a=2),e instanceof bt&&(a=4);var u=n;return this.removeCollapsed&&(u=null),o.length<a?u:o},interfaces_:function(){return[]},getClass:function(){return hs}}),e(cs.prototype,{fixPolygonalTopology:function(t){var e=t;this.changePrecisionModel||(e=this.changePM(t,this.targetPM));var n=e.buffer(0),i=n;return this.changePrecisionModel||(i=t.getFactory().createGeometry(n)),i},reducePointwise:function(t){var e=null;if(this.changePrecisionModel){var n=this.createFactory(t.getFactory(),this.targetPM);e=new _t(n)}else e=new _t;var i=this.removeCollapsed;t.getDimension()>=2&&(i=!0);var r=e.edit(t,new hs(this.targetPM,i));return r},changePM:function(t,e){var n=this.createEditor(t.getFactory(),e);return n.edit(t,new _t.NoOpGeometryOperation)},setRemoveCollapsedComponents:function(t){this.removeCollapsed=t},createFactory:function(t,e){var n=new ie(e,t.getSRID(),t.getCoordinateSequenceFactory());return n},setChangePrecisionModel:function(t){this.changePrecisionModel=t},reduce:function(t){var e=this.reducePointwise(t);return this.isPointwise?e:R(e,Rt)?e.isValid()?e:this.fixPolygonalTopology(e):e},setPointwise:function(t){this.isPointwise=t},createEditor:function(t,e){if(t.getPrecisionModel()===e)return new _t;var n=this.createFactory(t,e),i=new _t(n);return i},interfaces_:function(){return[]},getClass:function(){return cs}}),cs.reduce=function(t,e){var n=new cs(e);return n.reduce(t)},cs.reducePointwise=function(t,e){var n=new cs(e);return n.setPointwise(!0),n.reduce(t)};var _o=Object.freeze({GeometryPrecisionReducer:cs});e(fs.prototype,{simplifySection:function(t,e){if(t+1===e)return null;this.seg.p0=this.pts[t],this.seg.p1=this.pts[e];for(var n=-1,i=t,r=t+1;e>r;r++){var s=this.seg.distance(this.pts[r]);s>n&&(n=s,i=r)}if(n<=this.distanceTolerance)for(var r=t+1;e>r;r++)this.usePt[r]=!1;else this.simplifySection(t,i),this.simplifySection(i,e)},setDistanceTolerance:function(t){this.distanceTolerance=t},simplify:function(){this.usePt=new Array(this.pts.length).fill(null);for(var t=0;t<this.pts.length;t++)this.usePt[t]=!0;this.simplifySection(0,this.pts.length-1);for(var e=new N,t=0;t<this.pts.length;t++)this.usePt[t]&&e.add(new g(this.pts[t]));return e.toCoordinateArray()},interfaces_:function(){return[]},getClass:function(){return fs}}),fs.simplify=function(t,e){var n=new fs(t);return n.setDistanceTolerance(e),n.simplify()},e(gs.prototype,{setEnsureValid:function(t){this.isEnsureValidTopology=t},getResultGeometry:function(){return this.inputGeom.isEmpty()?this.inputGeom.copy():new ds(this.isEnsureValidTopology,this.distanceTolerance).transform(this.inputGeom)},setDistanceTolerance:function(t){if(0>t)throw new i("Tolerance must be non-negative");this.distanceTolerance=t},interfaces_:function(){return[]},getClass:function(){return gs}}),gs.simplify=function(t,e){var n=new gs(t);return n.setDistanceTolerance(e),n.getResultGeometry()},h(ds,xe),e(ds.prototype,{transformPolygon:function(t,e){if(t.isEmpty())return null;var n=xe.prototype.transformPolygon.call(this,t,e);return e instanceof Ot?n:this.createValidArea(n)},createValidArea:function(t){return this.isEnsureValidTopology?t.buffer(0):t},transformCoordinates:function(t,e){var n=t.toCoordinateArray(),i=null;return i=0===n.length?new Array(0).fill(null):fs.simplify(n,this.distanceTolerance),this.factory.getCoordinateSequenceFactory().create(i)},transformMultiPolygon:function(t,e){var n=xe.prototype.transformMultiPolygon.call(this,t,e);return this.createValidArea(n)},transformLinearRing:function(t,e){var n=e instanceof Tt,i=xe.prototype.transformLinearRing.call(this,t,e);return!n||i instanceof bt?i:null},interfaces_:function(){return[]},getClass:function(){return ds}}),gs.DPTransformer=ds,h(ps,ce),e(ps.prototype,{getIndex:function(){return this.index},getParent:function(){return this.parent},interfaces_:function(){return[]},getClass:function(){return ps}}),e(vs.prototype,{addToResult:function(t){this.resultSegs.add(t)},asLineString:function(){return this.parentLine.getFactory().createLineString(vs.extractCoordinates(this.resultSegs))},getResultSize:function(){var t=this.resultSegs.size();return 0===t?0:t+1},getParent:function(){return this.parentLine},getSegment:function(t){return this.segs[t]},getParentCoordinates:function(){return this.parentLine.getCoordinates()},getMinimumSize:function(){return this.minimumSize},asLinearRing:function(){return this.parentLine.getFactory().createLinearRing(vs.extractCoordinates(this.resultSegs))},getSegments:function(){return this.segs},init:function(){var t=this.parentLine.getCoordinates();this.segs=new Array(t.length-1).fill(null);for(var e=0;e<t.length-1;e++){var n=new ps(t[e],t[e+1],this.parentLine,e);this.segs[e]=n}},getResultCoordinates:function(){return vs.extractCoordinates(this.resultSegs)},interfaces_:function(){return[]},getClass:function(){return vs}}),vs.extractCoordinates=function(t){for(var e=new Array(t.size()+1).fill(null),n=null,i=0;i<t.size();i++)n=t.get(i),e[i]=n.p0;return e[e.length-1]=n.p1,e},e(ms.prototype,{remove:function(t){this.index.remove(new C(t.p0,t.p1),t)},add:function(){if(arguments[0]instanceof vs)for(var t=arguments[0],e=t.getSegments(),n=0;n<e.length;n++){var i=e[n];this.add(i)}else if(arguments[0]instanceof ce){var r=arguments[0];this.index.insert(new C(r.p0,r.p1),r)}},query:function(t){var e=new C(t.p0,t.p1),n=new ys(t);this.index.query(e,n);var i=n.getItems();return i},interfaces_:function(){return[]},getClass:function(){return ms}}),e(ys.prototype,{visitItem:function(t){var e=t;C.intersects(e.p0,e.p1,this.querySeg.p0,this.querySeg.p1)&&this.items.add(t)},getItems:function(){return this.items},interfaces_:function(){return[Ae]},getClass:function(){return ys}}),e(xs.prototype,{flatten:function(t,e){var n=this.linePts[t],i=this.linePts[e],r=new ce(n,i);return this.remove(this.line,t,e),this.outputIndex.add(r),r},hasBadIntersection:function(t,e,n){return this.hasBadOutputIntersection(n)?!0:!!this.hasBadInputIntersection(t,e,n)},setDistanceTolerance:function(t){this.distanceTolerance=t},simplifySection:function(t,e,n){n+=1;var i=new Array(2).fill(null);if(t+1===e){var r=this.line.getSegment(t);return this.line.addToResult(r),null}var s=!0;if(this.line.getResultSize()<this.line.getMinimumSize()){var o=n+1;o<this.line.getMinimumSize()&&(s=!1)}var a=new Array(1).fill(null),u=this.findFurthestPoint(this.linePts,t,e,a);a[0]>this.distanceTolerance&&(s=!1);var l=new ce;if(l.p0=this.linePts[t],l.p1=this.linePts[e],i[0]=t,i[1]=e,this.hasBadIntersection(this.line,i,l)&&(s=!1),s){var r=this.flatten(t,e);return this.line.addToResult(r),null}this.simplifySection(t,u,n),this.simplifySection(u,e,n)},hasBadOutputIntersection:function(t){for(var e=this.outputIndex.query(t),n=e.iterator();n.hasNext();){var i=n.next();if(this.hasInteriorIntersection(i,t))return!0}return!1},findFurthestPoint:function(t,e,n,i){var r=new ce;r.p0=t[e],r.p1=t[n];for(var s=-1,o=e,a=e+1;n>a;a++){var u=t[a],l=r.distance(u);l>s&&(s=l,o=a)}return i[0]=s,o},simplify:function(t){this.line=t,this.linePts=t.getParentCoordinates(),this.simplifySection(0,this.linePts.length-1,0)},remove:function(t,e,n){for(var i=e;n>i;i++){var r=t.getSegment(i);this.inputIndex.remove(r)}},hasInteriorIntersection:function(t,e){return this.li.computeIntersection(t.p0,t.p1,e.p0,e.p1),this.li.isInteriorIntersection()},hasBadInputIntersection:function(t,e,n){for(var i=this.inputIndex.query(n),r=i.iterator();r.hasNext();){var s=r.next();if(this.hasInteriorIntersection(s,n)){if(xs.isInLineSection(t,e,s))continue;return!0}}return!1},interfaces_:function(){return[]},getClass:function(){return xs}}),xs.isInLineSection=function(t,e,n){if(n.getParent()!==t.getParent())return!1;var i=n.getIndex();return i>=e[0]&&i<e[1]},e(Es.prototype,{setDistanceTolerance:function(t){this.distanceTolerance=t},simplify:function(t){for(var e=t.iterator();e.hasNext();)this.inputIndex.add(e.next());for(var e=t.iterator();e.hasNext();){var n=new xs(this.inputIndex,this.outputIndex);n.setDistanceTolerance(this.distanceTolerance),n.simplify(e.next())}},interfaces_:function(){return[]},getClass:function(){return Es}}),e(Is.prototype,{getResultGeometry:function(){if(this.inputGeom.isEmpty())return this.inputGeom.copy();this.linestringMap=new te,this.inputGeom.apply(new Cs(this)),this.lineSimplifier.simplify(this.linestringMap.values());var t=new Ns(this.linestringMap).transform(this.inputGeom);return t},setDistanceTolerance:function(t){if(0>t)throw new i("Tolerance must be non-negative");this.lineSimplifier.setDistanceTolerance(t)},interfaces_:function(){return[]},getClass:function(){return Is}}),Is.simplify=function(t,e){var n=new Is(t);return n.setDistanceTolerance(e),n.getResultGeometry()},h(Ns,xe),e(Ns.prototype,{transformCoordinates:function(t,e){if(0===t.size())return null;if(e instanceof St){var n=this.linestringMap.get(e);return this.createCoordinateSequence(n.getResultCoordinates())}return xe.prototype.transformCoordinates.call(this,t,e)},interfaces_:function(){return[]},getClass:function(){return Ns}}),e(Cs.prototype,{filter:function(t){if(t instanceof St){var e=t;if(e.isEmpty())return null;var n=e.isClosed()?4:2,i=new vs(e,n);this.tps.linestringMap.put(e,i)}},interfaces_:function(){return[q]},getClass:function(){return Cs}}),Is.LineStringTransformer=Ns,Is.LineStringMapBuilderFilter=Cs;var Mo=Object.freeze({DouglasPeuckerSimplifier:gs,TopologyPreservingSimplifier:Is});e(Ss.prototype,{splitAt:function(){if(1===arguments.length){var t=arguments[0],e=this.minimumLen/this.segLen;if(t.distance(this.seg.p0)<this.minimumLen)return this.splitPt=this.seg.pointAlong(e),null;if(t.distance(this.seg.p1)<this.minimumLen)return this.splitPt=Ss.pointAlongReverse(this.seg,e),null;this.splitPt=t}else if(2===arguments.length){var n=arguments[0],i=arguments[1],r=this.getConstrainedLength(n),s=r/this.segLen;i.equals2D(this.seg.p0)?this.splitPt=this.seg.pointAlong(s):this.splitPt=Ss.pointAlongReverse(this.seg,s)}},setMinimumLength:function(t){this.minimumLen=t},getConstrainedLength:function(t){return t<this.minimumLen?this.minimumLen:t},getSplitPoint:function(){return this.splitPt},interfaces_:function(){return[]},getClass:function(){return Ss}}),Ss.pointAlongReverse=function(t,e){var n=new g;return n.x=t.p1.x-e*(t.p1.x-t.p0.x),n.y=t.p1.y-e*(t.p1.y-t.p0.y),n},e(ws.prototype,{findSplitPoint:function(t,e){},interfaces_:function(){return[]},getClass:function(){return ws}}),e(Ls.prototype,{findSplitPoint:function(t,e){var n=t.getLineSegment(),i=n.getLength(),r=i/2,s=new Ss(n),o=Ls.projectedSplitPoint(t,e),a=2*o.distance(e)*.8,u=a;return u>r&&(u=r),s.setMinimumLength(u),s.splitAt(o),s.getSplitPoint()},interfaces_:function(){return[ws]},getClass:function(){return Ls}}),Ls.projectedSplitPoint=function(t,e){var n=t.getLineSegment(),i=n.project(e);return i},e(Rs.prototype,{interfaces_:function(){return[]},getClass:function(){return Rs}}),Rs.triArea=function(t,e,n){return(e.x-t.x)*(n.y-t.y)-(e.y-t.y)*(n.x-t.x)},Rs.isInCircleDDNormalized=function(t,e,n,i){var r=_.valueOf(t.x).selfSubtract(i.x),s=_.valueOf(t.y).selfSubtract(i.y),o=_.valueOf(e.x).selfSubtract(i.x),a=_.valueOf(e.y).selfSubtract(i.y),u=_.valueOf(n.x).selfSubtract(i.x),l=_.valueOf(n.y).selfSubtract(i.y),h=r.multiply(a).selfSubtract(o.multiply(s)),c=o.multiply(l).selfSubtract(u.multiply(a)),f=u.multiply(s).selfSubtract(r.multiply(l)),g=r.multiply(r).selfAdd(s.multiply(s)),d=o.multiply(o).selfAdd(a.multiply(a)),p=u.multiply(u).selfAdd(l.multiply(l)),v=g.selfMultiply(c).selfAdd(d.selfMultiply(f)).selfAdd(p.selfMultiply(h)),m=v.doubleValue()>0;return m},Rs.checkRobustInCircle=function(t,e,n,i){var r=Rs.isInCircleNonRobust(t,e,n,i),s=Rs.isInCircleDDSlow(t,e,n,i),o=Rs.isInCircleCC(t,e,n,i),a=ci.circumcentre(t,e,n);A.out.println("p radius diff a = "+Math.abs(i.distance(a)-t.distance(a))/t.distance(a)),r===s&&r===o||(A.out.println("inCircle robustness failure (double result = "+r+", DD result = "+s+", CC result = "+o+")"),A.out.println(se.toLineString(new Gt([t,e,n,i]))),A.out.println("Circumcentre = "+se.toPoint(a)+" radius = "+t.distance(a)),A.out.println("p radius diff a = "+Math.abs(i.distance(a)/t.distance(a)-1)),A.out.println("p radius diff b = "+Math.abs(i.distance(a)/e.distance(a)-1)),A.out.println("p radius diff c = "+Math.abs(i.distance(a)/n.distance(a)-1)),A.out.println())},Rs.isInCircleDDFast=function(t,e,n,i){var r=_.sqr(t.x).selfAdd(_.sqr(t.y)).selfMultiply(Rs.triAreaDDFast(e,n,i)),s=_.sqr(e.x).selfAdd(_.sqr(e.y)).selfMultiply(Rs.triAreaDDFast(t,n,i)),o=_.sqr(n.x).selfAdd(_.sqr(n.y)).selfMultiply(Rs.triAreaDDFast(t,e,i)),a=_.sqr(i.x).selfAdd(_.sqr(i.y)).selfMultiply(Rs.triAreaDDFast(t,e,n)),u=r.selfSubtract(s).selfAdd(o).selfSubtract(a),l=u.doubleValue()>0;return l},Rs.isInCircleCC=function(t,e,n,i){var r=ci.circumcentre(t,e,n),s=t.distance(r),o=i.distance(r)-s;return 0>=o},Rs.isInCircleNormalized=function(t,e,n,i){var r=t.x-i.x,s=t.y-i.y,o=e.x-i.x,a=e.y-i.y,u=n.x-i.x,l=n.y-i.y,h=r*a-o*s,c=o*l-u*a,f=u*s-r*l,g=r*r+s*s,d=o*o+a*a,p=u*u+l*l,v=g*c+d*f+p*h;return v>0},Rs.isInCircleDDSlow=function(t,e,n,i){var r=_.valueOf(i.x),s=_.valueOf(i.y),o=_.valueOf(t.x),a=_.valueOf(t.y),u=_.valueOf(e.x),l=_.valueOf(e.y),h=_.valueOf(n.x),c=_.valueOf(n.y),f=o.multiply(o).add(a.multiply(a)).multiply(Rs.triAreaDDSlow(u,l,h,c,r,s)),g=u.multiply(u).add(l.multiply(l)).multiply(Rs.triAreaDDSlow(o,a,h,c,r,s)),d=h.multiply(h).add(c.multiply(c)).multiply(Rs.triAreaDDSlow(o,a,u,l,r,s)),p=r.multiply(r).add(s.multiply(s)).multiply(Rs.triAreaDDSlow(o,a,u,l,h,c)),v=f.subtract(g).add(d).subtract(p),m=v.doubleValue()>0;
return m},Rs.isInCircleNonRobust=function(t,e,n,i){var r=(t.x*t.x+t.y*t.y)*Rs.triArea(e,n,i)-(e.x*e.x+e.y*e.y)*Rs.triArea(t,n,i)+(n.x*n.x+n.y*n.y)*Rs.triArea(t,e,i)-(i.x*i.x+i.y*i.y)*Rs.triArea(t,e,n)>0;return r},Rs.isInCircleRobust=function(t,e,n,i){return Rs.isInCircleNormalized(t,e,n,i)},Rs.triAreaDDSlow=function(t,e,n,i,r,s){return n.subtract(t).multiply(s.subtract(e)).subtract(i.subtract(e).multiply(r.subtract(t)))},Rs.triAreaDDFast=function(t,e,n){var i=_.valueOf(e.x).selfSubtract(t.x).selfMultiply(_.valueOf(n.y).selfSubtract(t.y)),r=_.valueOf(e.y).selfSubtract(t.y).selfMultiply(_.valueOf(n.x).selfSubtract(t.x));return i.selfSubtract(r)},e(Ts.prototype,{circleCenter:function(t,e){var n=new Ts(this.getX(),this.getY()),i=this.bisector(n,t),r=this.bisector(t,e),s=new F(i,r),o=null;try{o=new Ts(s.getX(),s.getY())}catch(i){if(!(i instanceof w))throw i;A.err.println("a: "+n+"  b: "+t+"  c: "+e),A.err.println(i)}finally{}return o},dot:function(t){return this.p.x*t.getX()+this.p.y*t.getY()},magn:function(){return Math.sqrt(this.p.x*this.p.x+this.p.y*this.p.y)},getZ:function(){return this.p.z},bisector:function(t,e){var n=e.getX()-t.getX(),i=e.getY()-t.getY(),r=new F(t.getX()+n/2,t.getY()+i/2,1),s=new F(t.getX()-i+n/2,t.getY()+n+i/2,1);return new F(r,s)},equals:function(){if(1===arguments.length){var t=arguments[0];return this.p.x===t.getX()&&this.p.y===t.getY()}if(2===arguments.length){var e=arguments[0],n=arguments[1];return this.p.distance(e.getCoordinate())<n}},getCoordinate:function(){return this.p},isInCircle:function(t,e,n){return Rs.isInCircleRobust(t.p,e.p,n.p,this.p)},interpolateZValue:function(t,e,n){var i=t.getX(),r=t.getY(),s=e.getX()-i,o=n.getX()-i,a=e.getY()-r,u=n.getY()-r,l=s*u-o*a,h=this.getX()-i,c=this.getY()-r,f=(u*h-o*c)/l,g=(-a*h+s*c)/l,d=t.getZ()+f*(e.getZ()-t.getZ())+g*(n.getZ()-t.getZ());return d},midPoint:function(t){var e=(this.p.x+t.getX())/2,n=(this.p.y+t.getY())/2,i=(this.p.z+t.getZ())/2;return new Ts(e,n,i)},rightOf:function(t){return this.isCCW(t.dest(),t.orig())},isCCW:function(t,e){return(t.p.x-this.p.x)*(e.p.y-this.p.y)-(t.p.y-this.p.y)*(e.p.x-this.p.x)>0},getX:function(){return this.p.x},crossProduct:function(t){return this.p.x*t.getY()-this.p.y*t.getX()},setZ:function(t){this.p.z=t},times:function(t){return new Ts(t*this.p.x,t*this.p.y)},cross:function(){return new Ts(this.p.y,-this.p.x)},leftOf:function(t){return this.isCCW(t.orig(),t.dest())},toString:function(){return"POINT ("+this.p.x+" "+this.p.y+")"},sub:function(t){return new Ts(this.p.x-t.getX(),this.p.y-t.getY())},getY:function(){return this.p.y},classify:function(t,e){var n=this,i=e.sub(t),r=n.sub(t),s=i.crossProduct(r);return s>0?Ts.LEFT:0>s?Ts.RIGHT:i.getX()*r.getX()<0||i.getY()*r.getY()<0?Ts.BEHIND:i.magn()<r.magn()?Ts.BEYOND:t.equals(n)?Ts.ORIGIN:e.equals(n)?Ts.DESTINATION:Ts.BETWEEN},sum:function(t){return new Ts(this.p.x+t.getX(),this.p.y+t.getY())},distance:function(t,e){return Math.sqrt(Math.pow(e.getX()-t.getX(),2)+Math.pow(e.getY()-t.getY(),2))},circumRadiusRatio:function(t,e){var n=this.circleCenter(t,e),i=this.distance(n,t),r=this.distance(this,t),s=this.distance(t,e);return r>s&&(r=s),s=this.distance(e,this),r>s&&(r=s),i/r},interfaces_:function(){return[]},getClass:function(){return Ts}}),Ts.interpolateZ=function(){if(3===arguments.length){var t=arguments[0],e=arguments[1],n=arguments[2],i=e.distance(n),r=t.distance(e),s=n.z-e.z,o=e.z+s*(r/i);return o}if(4===arguments.length){var a=arguments[0],u=arguments[1],l=arguments[2],h=arguments[3],c=u.x,f=u.y,g=l.x-c,d=h.x-c,p=l.y-f,v=h.y-f,m=g*v-d*p,y=a.x-c,x=a.y-f,E=(v*y-d*x)/m,I=(-p*y+g*x)/m,N=u.z+E*(l.z-u.z)+I*(h.z-u.z);return N}},Ts.LEFT=0,Ts.RIGHT=1,Ts.BEYOND=2,Ts.BEHIND=3,Ts.BETWEEN=4,Ts.ORIGIN=5,Ts.DESTINATION=6,h(Ps,Ts),e(Ps.prototype,{getConstraint:function(){return this.constraint},setOnConstraint:function(t){this._isOnConstraint=t},merge:function(t){t._isOnConstraint&&(this._isOnConstraint=!0,this.constraint=t.constraint)},isOnConstraint:function(){return this._isOnConstraint},setConstraint:function(t){this._isOnConstraint=!0,this.constraint=t},interfaces_:function(){return[]},getClass:function(){return Ps}}),e(bs.prototype,{equalsNonOriented:function(t){return this.equalsOriented(t)?!0:!!this.equalsOriented(t.sym())},toLineSegment:function(){return new ce(this.vertex.getCoordinate(),this.dest().getCoordinate())},dest:function(){return this.sym().orig()},oNext:function(){return this.next},equalsOriented:function(t){return!(!this.orig().getCoordinate().equals2D(t.orig().getCoordinate())||!this.dest().getCoordinate().equals2D(t.dest().getCoordinate()))},dNext:function(){return this.sym().oNext().sym()},lPrev:function(){return this.next.sym()},rPrev:function(){return this.sym().oNext()},rot:function(){return this._rot},oPrev:function(){return this._rot.next._rot},sym:function(){return this._rot._rot},setOrig:function(t){this.vertex=t},lNext:function(){return this.invRot().oNext().rot()},getLength:function(){return this.orig().getCoordinate().distance(this.dest().getCoordinate())},invRot:function(){return this._rot.sym()},setDest:function(t){this.sym().setOrig(t)},setData:function(t){this.data=t},getData:function(){return this.data},delete:function(){this._rot=null},orig:function(){return this.vertex},rNext:function(){return this._rot.next.invRot()},toString:function(){var t=this.vertex.getCoordinate(),e=this.dest().getCoordinate();return se.toLineString(t,e)},isLive:function(){return null!==this._rot},getPrimary:function(){return this.orig().getCoordinate().compareTo(this.dest().getCoordinate())<=0?this:this.sym()},dPrev:function(){return this.invRot().oNext().invRot()},setNext:function(t){this.next=t},interfaces_:function(){return[]},getClass:function(){return bs}}),bs.makeEdge=function(t,e){var n=new bs,i=new bs,r=new bs,s=new bs;n._rot=i,i._rot=r,r._rot=s,s._rot=n,n.setNext(n),i.setNext(s),r.setNext(r),s.setNext(i);var o=n;return o.setOrig(t),o.setDest(e),o},bs.swap=function(t){var e=t.oPrev(),n=t.sym().oPrev();bs.splice(t,e),bs.splice(t.sym(),n),bs.splice(t,e.lNext()),bs.splice(t.sym(),n.lNext()),t.setOrig(e.dest()),t.setDest(n.dest())},bs.splice=function(t,e){var n=t.oNext().rot(),i=e.oNext().rot(),r=e.oNext(),s=t.oNext(),o=i.oNext(),a=n.oNext();t.setNext(r),e.setNext(s),n.setNext(o),i.setNext(a)},bs.connect=function(t,e){var n=bs.makeEdge(t.dest(),e.orig());return bs.splice(n,t.lNext()),bs.splice(n.sym(),e),n},e(Os.prototype,{insertSite:function(t){var e=this.subdiv.locate(t);if(this.subdiv.isVertexOfEdge(e,t))return e;this.subdiv.isOnEdge(e,t.getCoordinate())&&(e=e.oPrev(),this.subdiv.delete(e.oNext()));var n=this.subdiv.makeEdge(e.orig(),t);bs.splice(n,e);var i=n;do n=this.subdiv.connect(e,n.sym()),e=n.oPrev();while(e.lNext()!==i);for(;;){var r=e.oPrev();if(r.dest().rightOf(e)&&t.isInCircle(e.orig(),r.dest(),e.dest()))bs.swap(e),e=e.oPrev();else{if(e.oNext()===i)return n;e=e.oNext().lPrev()}}},insertSites:function(t){for(var e=t.iterator();e.hasNext();){var n=e.next();this.insertSite(n)}},interfaces_:function(){return[]},getClass:function(){return Os}}),e(_s.prototype,{locate:function(t){},interfaces_:function(){return[]},getClass:function(){return _s}}),e(Ms.prototype,{init:function(){this.lastEdge=this.findEdge()},locate:function(t){this.lastEdge.isLive()||this.init();var e=this.subdiv.locateFromEdge(t,this.lastEdge);return this.lastEdge=e,e},findEdge:function(){var t=this.subdiv.getEdges();return t.iterator().next()},interfaces_:function(){return[_s]},getClass:function(){return Ms}}),h(Ds,l),e(Ds.prototype,{getSegment:function(){return this.seg},interfaces_:function(){return[]},getClass:function(){return Ds}}),Ds.msgWithSpatial=function(t,e){return null!==e?t+" [ "+e+" ]":t},e(As.prototype,{visit:function(t){},interfaces_:function(){return[]},getClass:function(){return As}}),e(Fs.prototype,{getTriangleVertices:function(t){var e=new Bs;return this.visitTriangles(e,t),e.getTriangleVertices()},isFrameVertex:function(t){return t.equals(this.frameVertex[0])?!0:t.equals(this.frameVertex[1])?!0:!!t.equals(this.frameVertex[2])},isVertexOfEdge:function(t,e){return!(!e.equals(t.orig(),this.tolerance)&&!e.equals(t.dest(),this.tolerance))},connect:function(t,e){var n=bs.connect(t,e);return this.quadEdges.add(n),n},getVoronoiCellPolygon:function(t,e){var n=new I,i=t;do{var r=t.rot().orig().getCoordinate();n.add(r),t=t.oPrev()}while(t!==i);var s=new N;s.addAll(n,!1),s.closeRing(),s.size()<4&&(A.out.println(s),s.add(s.get(s.size()-1),!0));var o=s.toCoordinateArray(),a=e.createPolygon(e.createLinearRing(o),null),u=i.orig();return a.setUserData(u.getCoordinate()),a},setLocator:function(t){this.locator=t},initSubdiv:function(){var t=this.makeEdge(this.frameVertex[0],this.frameVertex[1]),e=this.makeEdge(this.frameVertex[1],this.frameVertex[2]);bs.splice(t.sym(),e);var n=this.makeEdge(this.frameVertex[2],this.frameVertex[0]);return bs.splice(e.sym(),n),bs.splice(n.sym(),t),t},isFrameBorderEdge:function(t){var e=new Array(3).fill(null);Fs.getTriangleEdges(t,e);var n=new Array(3).fill(null);Fs.getTriangleEdges(t.sym(),n);var i=t.lNext().dest();if(this.isFrameVertex(i))return!0;var r=t.sym().lNext().dest();return!!this.isFrameVertex(r)},makeEdge:function(t,e){var n=bs.makeEdge(t,e);return this.quadEdges.add(n),n},visitTriangles:function(t,e){this.visitedKey++;var n=new pe;n.push(this.startingEdge);for(var i=new J;!n.empty();){var r=n.pop();if(!i.contains(r)){var s=this.fetchTriangleToVisit(r,n,e,i);null!==s&&t.visit(s)}}},isFrameEdge:function(t){return!(!this.isFrameVertex(t.orig())&&!this.isFrameVertex(t.dest()))},isOnEdge:function(t,e){this.seg.setCoordinates(t.orig().getCoordinate(),t.dest().getCoordinate());var n=this.seg.distance(e);return n<this.edgeCoincidenceTolerance},getEnvelope:function(){return new C(this.frameEnv)},createFrame:function(t){var e=t.getWidth(),n=t.getHeight(),i=0;i=e>n?10*e:10*n,this.frameVertex[0]=new Ts((t.getMaxX()+t.getMinX())/2,t.getMaxY()+i),this.frameVertex[1]=new Ts(t.getMinX()-i,t.getMinY()-i),this.frameVertex[2]=new Ts(t.getMaxX()+i,t.getMinY()-i),this.frameEnv=new C(this.frameVertex[0].getCoordinate(),this.frameVertex[1].getCoordinate()),this.frameEnv.expandToInclude(this.frameVertex[2].getCoordinate())},getTriangleCoordinates:function(t){var e=new zs;return this.visitTriangles(e,t),e.getTriangles()},getVertices:function(t){for(var e=new J,n=this.quadEdges.iterator();n.hasNext();){var i=n.next(),r=i.orig();!t&&this.isFrameVertex(r)||e.add(r);var s=i.dest();!t&&this.isFrameVertex(s)||e.add(s)}return e},fetchTriangleToVisit:function(t,e,n,i){var r=t,s=0,o=!1;do{this.triEdges[s]=r,this.isFrameEdge(r)&&(o=!0);var a=r.sym();i.contains(a)||e.push(a),i.add(r),s++,r=r.lNext()}while(r!==t);return o&&!n?null:this.triEdges},getEdges:function(){if(0===arguments.length)return this.quadEdges;if(1===arguments.length){for(var t=arguments[0],e=this.getPrimaryEdges(!1),n=new Array(e.size()).fill(null),i=0,r=e.iterator();r.hasNext();){var s=r.next();n[i++]=t.createLineString([s.orig().getCoordinate(),s.dest().getCoordinate()])}return t.createMultiLineString(n)}},getVertexUniqueEdges:function(t){for(var e=new I,n=new J,i=this.quadEdges.iterator();i.hasNext();){var r=i.next(),s=r.orig();n.contains(s)||(n.add(s),!t&&this.isFrameVertex(s)||e.add(r));var o=r.sym(),a=o.orig();n.contains(a)||(n.add(a),!t&&this.isFrameVertex(a)||e.add(o))}return e},getTriangleEdges:function(t){var e=new qs;return this.visitTriangles(e,t),e.getTriangleEdges()},getPrimaryEdges:function(t){this.visitedKey++;var e=new I,n=new pe;n.push(this.startingEdge);for(var i=new J;!n.empty();){var r=n.pop();if(!i.contains(r)){var s=r.getPrimary();!t&&this.isFrameEdge(s)||e.add(s),n.push(r.oNext()),n.push(r.sym().oNext()),i.add(r),i.add(r.sym())}}return e},delete:function(t){bs.splice(t,t.oPrev()),bs.splice(t.sym(),t.sym().oPrev());var e=t.sym(),n=t.rot(),i=t.rot().sym();this.quadEdges.remove(t),this.quadEdges.remove(e),this.quadEdges.remove(n),this.quadEdges.remove(i),t.delete(),e.delete(),n.delete(),i.delete()},locateFromEdge:function(t,e){for(var n=0,i=this.quadEdges.size(),r=e;;){if(n++,n>i)throw new Ds(r.toLineSegment());if(t.equals(r.orig())||t.equals(r.dest()))break;if(t.rightOf(r))r=r.sym();else if(t.rightOf(r.oNext())){if(t.rightOf(r.dPrev()))break;r=r.dPrev()}else r=r.oNext()}return r},getTolerance:function(){return this.tolerance},getVoronoiCellPolygons:function(t){this.visitTriangles(new Gs,!0);for(var e=new I,n=this.getVertexUniqueEdges(!1),i=n.iterator();i.hasNext();){var r=i.next();e.add(this.getVoronoiCellPolygon(r,t))}return e},getVoronoiDiagram:function(t){var e=this.getVoronoiCellPolygons(t);return t.createGeometryCollection(ie.toGeometryArray(e))},getTriangles:function(t){for(var e=this.getTriangleCoordinates(!1),n=new Array(e.size()).fill(null),i=0,r=e.iterator();r.hasNext();){var s=r.next();n[i++]=t.createPolygon(t.createLinearRing(s),null)}return t.createGeometryCollection(n)},insertSite:function(t){var e=this.locate(t);if(t.equals(e.orig(),this.tolerance)||t.equals(e.dest(),this.tolerance))return e;var n=this.makeEdge(e.orig(),t);bs.splice(n,e);var i=n;do n=this.connect(e,n.sym()),e=n.oPrev();while(e.lNext()!==i);return i},locate:function(){if(1===arguments.length){if(arguments[0]instanceof Ts){var t=arguments[0];return this.locator.locate(t)}if(arguments[0]instanceof g){var e=arguments[0];return this.locator.locate(new Ts(e))}}else if(2===arguments.length){var n=arguments[0],i=arguments[1],r=this.locator.locate(new Ts(n));if(null===r)return null;var s=r;r.dest().getCoordinate().equals2D(n)&&(s=r.sym());var o=s;do{if(o.dest().getCoordinate().equals2D(i))return o;o=o.oNext()}while(o!==s);return null}},interfaces_:function(){return[]},getClass:function(){return Fs}}),Fs.getTriangleEdges=function(t,e){if(e[0]=t,e[1]=e[0].lNext(),e[2]=e[1].lNext(),e[2].lNext()!==e[0])throw new i("Edges do not form a triangle")},e(Gs.prototype,{visit:function(t){for(var e=t[0].orig().getCoordinate(),n=t[1].orig().getCoordinate(),i=t[2].orig().getCoordinate(),r=ci.circumcentre(e,n,i),s=new Ts(r),o=0;3>o;o++)t[o].rot().setOrig(s)},interfaces_:function(){return[As]},getClass:function(){return Gs}}),e(qs.prototype,{getTriangleEdges:function(){return this.triList},visit:function(t){this.triList.add(t.clone())},interfaces_:function(){return[As]},getClass:function(){return qs}}),e(Bs.prototype,{visit:function(t){this.triList.add([t[0].orig(),t[1].orig(),t[2].orig()])},getTriangleVertices:function(){return this.triList},interfaces_:function(){return[As]},getClass:function(){return Bs}}),e(zs.prototype,{checkTriangleSize:function(t){var e="";t.length>=2?e=se.toLineString(t[0],t[1]):t.length>=1&&(e=se.toPoint(t[0]))},visit:function(t){this.coordList.clear();for(var e=0;3>e;e++){var n=t[e].orig();this.coordList.add(n.getCoordinate())}if(this.coordList.size()>0){this.coordList.closeRing();var i=this.coordList.toCoordinateArray();if(4!==i.length)return null;this.triCoords.add(i)}},getTriangles:function(){return this.triCoords},interfaces_:function(){return[As]},getClass:function(){return zs}}),Fs.TriangleCircumcentreVisitor=Gs,Fs.TriangleEdgesListVisitor=qs,Fs.TriangleVertexListVisitor=Bs,Fs.TriangleCoordinatesVisitor=zs,Fs.EDGE_COINCIDENCE_TOL_FACTOR=1e3,e(Vs.prototype,{getLineSegment:function(){return this.ls},getEndZ:function(){var t=this.ls.getCoordinate(1);return t.z},getStartZ:function(){var t=this.ls.getCoordinate(0);return t.z},intersection:function(t){return this.ls.intersection(t.getLineSegment())},getStart:function(){return this.ls.getCoordinate(0)},getEnd:function(){return this.ls.getCoordinate(1)},getEndY:function(){var t=this.ls.getCoordinate(1);return t.y},getStartX:function(){var t=this.ls.getCoordinate(0);return t.x},equalsTopo:function(t){return this.ls.equalsTopo(t.getLineSegment())},getStartY:function(){var t=this.ls.getCoordinate(0);return t.y},setData:function(t){this.data=t},getData:function(){return this.data},getEndX:function(){var t=this.ls.getCoordinate(1);return t.x},toString:function(){return this.ls.toString()},interfaces_:function(){return[]},getClass:function(){return Vs}}),e(ks.prototype,{visit:function(t){},interfaces_:function(){return[]},getClass:function(){return ks}}),e(Ys.prototype,{isRepeated:function(){return this.count>1},getRight:function(){return this.right},getCoordinate:function(){return this.p},setLeft:function(t){this.left=t},getX:function(){return this.p.x},getData:function(){return this.data},getCount:function(){return this.count},getLeft:function(){return this.left},getY:function(){return this.p.y},increment:function(){this.count=this.count+1},setRight:function(t){this.right=t},interfaces_:function(){return[]},getClass:function(){return Ys}}),e(Us.prototype,{insert:function(){if(1===arguments.length){var t=arguments[0];return this.insert(t,null)}if(2===arguments.length){var e=arguments[0],n=arguments[1];if(null===this.root)return this.root=new Ys(e,n),this.root;if(this.tolerance>0){var i=this.findBestMatchNode(e);if(null!==i)return i.increment(),i}return this.insertExact(e,n)}},query:function(){var t=arguments,e=this;if(1===arguments.length){var n=arguments[0],i=new I;return this.query(n,i),i}if(2===arguments.length)if(arguments[0]instanceof C&&R(arguments[1],y))!function(){var n=t[0],i=t[1];e.queryNode(e.root,n,!0,{interfaces_:function(){return[ks]},visit:function(t){i.add(t)}})}();else if(arguments[0]instanceof C&&R(arguments[1],ks)){var r=arguments[0],s=arguments[1];this.queryNode(this.root,r,!0,s)}},queryNode:function(t,e,n,i){if(null===t)return null;var r=null,s=null,o=null;n?(r=e.getMinX(),s=e.getMaxX(),o=t.getX()):(r=e.getMinY(),s=e.getMaxY(),o=t.getY());var a=o>r,u=s>=o;a&&this.queryNode(t.getLeft(),e,!n,i),e.contains(t.getCoordinate())&&i.visit(t),u&&this.queryNode(t.getRight(),e,!n,i)},findBestMatchNode:function(t){var e=new Xs(t,this.tolerance);return this.query(e.queryEnvelope(),e),e.getNode()},isEmpty:function(){return null===this.root},insertExact:function(t,e){for(var n=this.root,i=this.root,r=!0,s=!0;null!==n;){if(null!==n){var o=t.distance(n.getCoordinate())<=this.tolerance;if(o)return n.increment(),n}s=r?t.x<n.getX():t.y<n.getY(),i=n,n=s?n.getLeft():n.getRight(),r=!r}this.numberOfNodes=this.numberOfNodes+1;var a=new Ys(t,e);return s?i.setLeft(a):i.setRight(a),a},interfaces_:function(){return[]},getClass:function(){return Us}}),Us.toCoordinates=function(){if(1===arguments.length){var t=arguments[0];return Us.toCoordinates(t,!1)}if(2===arguments.length){for(var e=arguments[0],n=arguments[1],i=new N,r=e.iterator();r.hasNext();)for(var s=r.next(),o=n?s.getCount():1,a=0;o>a;a++)i.add(s.getCoordinate(),!0);return i.toCoordinateArray()}},e(Xs.prototype,{visit:function(t){var e=this.p.distance(t.getCoordinate()),n=e<=this.tolerance;if(!n)return null;var i=!1;(null===this.matchNode||e<this.matchDist||null!==this.matchNode&&e===this.matchDist&&t.getCoordinate().compareTo(this.matchNode.getCoordinate())<1)&&(i=!0),i&&(this.matchNode=t,this.matchDist=e)},queryEnvelope:function(){var t=new C(this.p);return t.expandBy(this.tolerance),t},getNode:function(){return this.matchNode},interfaces_:function(){return[ks]},getClass:function(){return Xs}}),Us.BestMatchVisitor=Xs,e(Hs.prototype,{getInitialVertices:function(){return this.initialVertices},getKDT:function(){return this.kdt},enforceConstraints:function(){this.addConstraintVertices();var t=0,e=0;do e=this.enforceGabriel(this.segments),t++;while(e>0&&t<Hs.MAX_SPLIT_ITER)},insertSites:function(t){for(var e=t.iterator();e.hasNext();){var n=e.next();this.insertSite(n)}},getVertexFactory:function(){return this.vertexFactory},getPointArray:function(){for(var t=new Array(this.initialVertices.size()+this.segVertices.size()).fill(null),e=0,n=this.initialVertices.iterator();n.hasNext();){var i=n.next();t[e++]=i.getCoordinate()}for(var r=this.segVertices.iterator();r.hasNext();){var i=r.next();t[e++]=i.getCoordinate()}return t},setConstraints:function(t,e){this.segments=t,this.segVertices=e},computeConvexHull:function(){var t=new ie,e=this.getPointArray(),n=new me(e,t);this.convexHull=n.getConvexHull()},addConstraintVertices:function(){this.computeConvexHull(),this.insertSites(this.segVertices)},findNonGabrielPoint:function(t){var e=t.getStart(),n=t.getEnd(),i=new g((e.x+n.x)/2,(e.y+n.y)/2),s=e.distance(i),o=new C(i);o.expandBy(s);for(var a=this.kdt.query(o),u=null,l=r.MAX_VALUE,h=a.iterator();h.hasNext();){var c=h.next(),f=c.getCoordinate();if(!f.equals2D(e)&&!f.equals2D(n)){var d=i.distance(f);if(s>d){var p=d;(null===u||l>p)&&(u=f,l=p)}}}return u},getConstraintSegments:function(){return this.segments},setSplitPointFinder:function(t){this.splitFinder=t},getConvexHull:function(){return this.convexHull},getTolerance:function(){return this.tolerance},enforceGabriel:function(t){for(var e=new I,n=0,i=new I,r=t.iterator();r.hasNext();){var s=r.next(),o=this.findNonGabrielPoint(s);if(null!==o){this.splitPt=this.splitFinder.findSplitPoint(s,o);var a=this.createVertex(this.splitPt,s),u=(this.insertSite(a),new Vs(s.getStartX(),s.getStartY(),s.getStartZ(),a.getX(),a.getY(),a.getZ(),s.getData())),l=new Vs(a.getX(),a.getY(),a.getZ(),s.getEndX(),s.getEndY(),s.getEndZ(),s.getData());e.add(u),e.add(l),i.add(s),n+=1}}return t.removeAll(i),t.addAll(e),n},createVertex:function(){if(1===arguments.length){var t=arguments[0],e=null;return e=null!==this.vertexFactory?this.vertexFactory.createVertex(t,null):new Ps(t)}if(2===arguments.length){var n=arguments[0],i=arguments[1],e=null;return e=null!==this.vertexFactory?this.vertexFactory.createVertex(n,i):new Ps(n),e.setOnConstraint(!0),e}},getSubdivision:function(){return this.subdiv},computeBoundingBox:function(){var t=Hs.computeVertexEnvelope(this.initialVertices),e=Hs.computeVertexEnvelope(this.segVertices),n=new C(t);n.expandToInclude(e);var i=.2*n.getWidth(),r=.2*n.getHeight(),s=Math.max(i,r);this.computeAreaEnv=new C(n),this.computeAreaEnv.expandBy(s)},setVertexFactory:function(t){this.vertexFactory=t},formInitialDelaunay:function(){this.computeBoundingBox(),this.subdiv=new Fs(this.computeAreaEnv,this.tolerance),this.subdiv.setLocator(new Ms(this.subdiv)),this.incDel=new Os(this.subdiv),this.insertSites(this.initialVertices)},insertSite:function(){if(arguments[0]instanceof Ps){var t=arguments[0],e=this.kdt.insert(t.getCoordinate(),t);if(e.isRepeated()){var n=e.getData();return n.merge(t),n}return this.incDel.insertSite(t),t}if(arguments[0]instanceof g){var i=arguments[0];this.insertSite(this.createVertex(i))}},interfaces_:function(){return[]},getClass:function(){return Hs}}),Hs.computeVertexEnvelope=function(t){for(var e=new C,n=t.iterator();n.hasNext();){var i=n.next();e.expandToInclude(i.getCoordinate())}return e},Hs.MAX_SPLIT_ITER=99,e(Ws.prototype,{create:function(){if(null!==this.subdiv)return null;var t=Ws.envelope(this.siteCoords),e=Ws.toVertices(this.siteCoords);this.subdiv=new Fs(t,this.tolerance);var n=new Os(this.subdiv);n.insertSites(e)},setTolerance:function(t){this.tolerance=t},setSites:function(){if(arguments[0]instanceof B){var t=arguments[0];this.siteCoords=Ws.extractUniqueCoordinates(t)}else if(R(arguments[0],v)){var e=arguments[0];this.siteCoords=Ws.unique(H.toCoordinateArray(e))}},getEdges:function(t){return this.create(),this.subdiv.getEdges(t)},getSubdivision:function(){return this.create(),this.subdiv},getTriangles:function(t){return this.create(),this.subdiv.getTriangles(t)},interfaces_:function(){return[]},getClass:function(){return Ws}}),Ws.extractUniqueCoordinates=function(t){if(null===t)return new N;var e=t.getCoordinates();return Ws.unique(e)},Ws.envelope=function(t){for(var e=new C,n=t.iterator();n.hasNext();){var i=n.next();e.expandToInclude(i)}return e},Ws.unique=function(t){var e=H.copyDeep(t);ut.sort(e);var n=new N(e,!1);return n},Ws.toVertices=function(t){for(var e=new I,n=t.iterator();n.hasNext();){var i=n.next();e.add(new Ts(i))}return e},e(js.prototype,{createSiteVertices:function(t){for(var e=new I,n=t.iterator();n.hasNext();){var i=n.next();this.constraintVertexMap.containsKey(i)||e.add(new Ps(i))}return e},create:function(){if(null!==this.subdiv)return null;var t=Ws.envelope(this.siteCoords),e=new I;null!==this.constraintLines&&(t.expandToInclude(this.constraintLines.getEnvelopeInternal()),this.createVertices(this.constraintLines),e=js.createConstraintSegments(this.constraintLines));var n=this.createSiteVertices(this.siteCoords),i=new Hs(n,this.tolerance);i.setConstraints(e,new I(this.constraintVertexMap.values())),i.formInitialDelaunay(),i.enforceConstraints(),this.subdiv=i.getSubdivision()},setTolerance:function(t){this.tolerance=t},setConstraints:function(t){this.constraintLines=t},setSites:function(t){this.siteCoords=Ws.extractUniqueCoordinates(t)},getEdges:function(t){return this.create(),this.subdiv.getEdges(t)},getSubdivision:function(){return this.create(),this.subdiv},getTriangles:function(t){return this.create(),this.subdiv.getTriangles(t)},createVertices:function(t){for(var e=t.getCoordinates(),n=0;n<e.length;n++){var i=new Ps(e[n]);this.constraintVertexMap.put(e[n],i)}},interfaces_:function(){return[]},getClass:function(){return js}}),js.createConstraintSegments=function(){if(1===arguments.length){for(var t=arguments[0],e=kn.getLines(t),n=new I,i=e.iterator();i.hasNext();){var r=i.next();js.createConstraintSegments(r,n)}return n}if(2===arguments.length)for(var s=arguments[0],o=arguments[1],a=s.getCoordinates(),i=1;i<a.length;i++)o.add(new Vs(a[i-1],a[i]))},e(Ks.prototype,{create:function(){if(null!==this.subdiv)return null;var t=Ws.envelope(this.siteCoords);this.diagramEnv=t;var e=Math.max(this.diagramEnv.getWidth(),this.diagramEnv.getHeight());this.diagramEnv.expandBy(e),null!==this.clipEnv&&this.diagramEnv.expandToInclude(this.clipEnv);var n=Ws.toVertices(this.siteCoords);this.subdiv=new Fs(t,this.tolerance);var i=new Os(this.subdiv);i.insertSites(n)},getDiagram:function(t){this.create();var e=this.subdiv.getVoronoiDiagram(t);return Ks.clipGeometryCollection(e,this.diagramEnv)},setTolerance:function(t){this.tolerance=t},setSites:function(){if(arguments[0]instanceof B){var t=arguments[0];this.siteCoords=Ws.extractUniqueCoordinates(t)}else if(R(arguments[0],v)){var e=arguments[0];this.siteCoords=Ws.unique(H.toCoordinateArray(e))}},setClipEnvelope:function(t){this.clipEnv=t},getSubdivision:function(){return this.create(),this.subdiv},interfaces_:function(){return[]},getClass:function(){return Ks}}),Ks.clipGeometryCollection=function(t,e){for(var n=t.getFactory().toGeometry(e),i=new I,r=0;r<t.getNumGeometries();r++){var s=t.getGeometryN(r),o=null;e.contains(s.getEnvelopeInternal())?o=s:e.intersects(s.getEnvelopeInternal())&&(o=n.intersection(s),o.setUserData(s.getUserData())),null===o||o.isEmpty()||i.add(o)}return t.getFactory().createGeometryCollection(ie.toGeometryArray(i))};var Do=Object.freeze({ConformingDelaunayTriangulationBuilder:js,DelaunayTriangulationBuilder:Ws,VoronoiDiagramBuilder:Ks});e(Zs.prototype,{interfaces_:function(){return[]},getClass:function(){return Zs}}),Zs.union=function(t,e){if(t.isEmpty()||e.isEmpty()){if(t.isEmpty()&&e.isEmpty())return ii.createEmptyResult(ii.UNION,t,e,t.getFactory());if(t.isEmpty())return e.copy();if(e.isEmpty())return t.copy()}return t.checkNotGeometryCollection(t),t.checkNotGeometryCollection(e),si.overlayOp(t,e,ii.UNION)},e(B.prototype,{equalsTopo:function(t){return this.getEnvelopeInternal().equals(t.getEnvelopeInternal())?Yr.relate(this,t).isEquals(this.getDimension(),t.getDimension()):!1},union:function(){if(0===arguments.length)return jr.union(this);if(1===arguments.length){var t=arguments[0];return Zs.union(this,t)}},isValid:function(){return ls.isValid(this)},intersection:function(t){if(this.isEmpty()||t.isEmpty())return ii.createEmptyResult(ii.INTERSECTION,this,t,this.factory);if(this.isGeometryCollection()){var e=t;return hn.map(this,{interfaces_:function(){return[MapOp]},map:function(t){return t.intersection(e)}})}return this.checkNotGeometryCollection(this),this.checkNotGeometryCollection(t),si.overlayOp(this,t,ii.INTERSECTION)},covers:function(t){return Yr.covers(this,t)},coveredBy:function(t){return Yr.coveredBy(this,t)},touches:function(t){return Yr.touches(this,t)},intersects:function(t){return Yr.intersects(this,t)},within:function(t){return Yr.within(this,t)},overlaps:function(t){return Yr.overlaps(this,t)},disjoint:function(t){return Yr.disjoint(this,t)},crosses:function(t){return Yr.crosses(this,t)},buffer:function(){if(1===arguments.length){var t=arguments[0];return sr.bufferOp(this,t)}if(2===arguments.length){var e=arguments[0],n=arguments[1];return sr.bufferOp(this,e,n)}if(3===arguments.length){var i=arguments[0],r=arguments[1],s=arguments[2];return sr.bufferOp(this,i,r,s)}},convexHull:function(){return new me(this).getConvexHull()},relate:function(){for(var t=arguments.length,e=Array(t),n=0;t>n;n++)e[n]=arguments[n];return Yr.relate.apply(Yr,[this].concat(e))},getCentroid:function(){if(this.isEmpty())return this.factory.createPoint();var t=ge.getCentroid(this);return this.createPointFromInternalCoord(t,this)},getInteriorPoint:function(){if(this.isEmpty())return this.factory.createPoint();var t=null,e=this.getDimension();if(0===e){var n=new li(this);t=n.getInteriorPoint()}else if(1===e){var n=new ui(this);t=n.getInteriorPoint()}else{var n=new oi(this);t=n.getInteriorPoint()}return this.createPointFromInternalCoord(t,this)},symDifference:function(t){if(this.isEmpty()||t.isEmpty()){if(this.isEmpty()&&t.isEmpty())return ii.createEmptyResult(ii.SYMDIFFERENCE,this,t,this.factory);if(this.isEmpty())return t.copy();if(t.isEmpty())return this.copy()}return this.checkNotGeometryCollection(this),this.checkNotGeometryCollection(t),si.overlayOp(this,t,ii.SYMDIFFERENCE)},createPointFromInternalCoord:function(t,e){return e.getPrecisionModel().makePrecise(t),e.getFactory().createPoint(t)},toText:function(){var t=new se;return t.write(this)},toString:function(){this.toText()},contains:function(t){return Yr.contains(this,t)},difference:function(t){return this.isEmpty()?ii.createEmptyResult(ii.DIFFERENCE,this,t,this.factory):t.isEmpty()?this.copy():(this.checkNotGeometryCollection(this),this.checkNotGeometryCollection(t),si.overlayOp(this,t,ii.DIFFERENCE))},isSimple:function(){var t=new Gi(this);return t.isSimple()},isWithinDistance:function(t,e){var n=this.getEnvelopeInternal().distance(t.getEnvelopeInternal());return n>e?!1:hr.isWithinDistance(this,t,e)},distance:function(t){return hr.distance(this,t)},isEquivalentClass:function(t){return this.getClass()===t.getClass()}});var Ao="1.1.2 (248dab8)";t.version=Ao,t.algorithm=co,t.densify=fo,t.dissolve=go,t.geom=lo,t.index=mo,t.io=Io,t.noding=No,t.operation=Oo,t.precision=_o,t.simplify=Mo,t.triangulate=Do});

},{}],36:[function(require,module,exports){
// Copyright (c) 2013 Pieroxy <pieroxy@pieroxy.net>
// This work is free. You can redistribute it and/or modify it
// under the terms of the WTFPL, Version 2
// For more information see LICENSE.txt or http://www.wtfpl.net/
//
// For more information, the home page:
// http://pieroxy.net/blog/pages/lz-string/testing.html
//
// LZ-based compression algorithm, version 1.4.4
var LZString = (function() {

// private property
var f = String.fromCharCode;
var keyStrBase64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
var keyStrUriSafe = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$";
var baseReverseDic = {};

function getBaseValue(alphabet, character) {
  if (!baseReverseDic[alphabet]) {
    baseReverseDic[alphabet] = {};
    for (var i=0 ; i<alphabet.length ; i++) {
      baseReverseDic[alphabet][alphabet.charAt(i)] = i;
    }
  }
  return baseReverseDic[alphabet][character];
}

var LZString = {
  compressToBase64 : function (input) {
    if (input == null) return "";
    var res = LZString._compress(input, 6, function(a){return keyStrBase64.charAt(a);});
    switch (res.length % 4) { // To produce valid Base64
    default: // When could this happen ?
    case 0 : return res;
    case 1 : return res+"===";
    case 2 : return res+"==";
    case 3 : return res+"=";
    }
  },

  decompressFromBase64 : function (input) {
    if (input == null) return "";
    if (input == "") return null;
    return LZString._decompress(input.length, 32, function(index) { return getBaseValue(keyStrBase64, input.charAt(index)); });
  },

  compressToUTF16 : function (input) {
    if (input == null) return "";
    return LZString._compress(input, 15, function(a){return f(a+32);}) + " ";
  },

  decompressFromUTF16: function (compressed) {
    if (compressed == null) return "";
    if (compressed == "") return null;
    return LZString._decompress(compressed.length, 16384, function(index) { return compressed.charCodeAt(index) - 32; });
  },

  //compress into uint8array (UCS-2 big endian format)
  compressToUint8Array: function (uncompressed) {
    var compressed = LZString.compress(uncompressed);
    var buf=new Uint8Array(compressed.length*2); // 2 bytes per character

    for (var i=0, TotalLen=compressed.length; i<TotalLen; i++) {
      var current_value = compressed.charCodeAt(i);
      buf[i*2] = current_value >>> 8;
      buf[i*2+1] = current_value % 256;
    }
    return buf;
  },

  //decompress from uint8array (UCS-2 big endian format)
  decompressFromUint8Array:function (compressed) {
    if (compressed===null || compressed===undefined){
        return LZString.decompress(compressed);
    } else {
        var buf=new Array(compressed.length/2); // 2 bytes per character
        for (var i=0, TotalLen=buf.length; i<TotalLen; i++) {
          buf[i]=compressed[i*2]*256+compressed[i*2+1];
        }

        var result = [];
        buf.forEach(function (c) {
          result.push(f(c));
        });
        return LZString.decompress(result.join(''));

    }

  },


  //compress into a string that is already URI encoded
  compressToEncodedURIComponent: function (input) {
    if (input == null) return "";
    return LZString._compress(input, 6, function(a){return keyStrUriSafe.charAt(a);});
  },

  //decompress from an output of compressToEncodedURIComponent
  decompressFromEncodedURIComponent:function (input) {
    if (input == null) return "";
    if (input == "") return null;
    input = input.replace(/ /g, "+");
    return LZString._decompress(input.length, 32, function(index) { return getBaseValue(keyStrUriSafe, input.charAt(index)); });
  },

  compress: function (uncompressed) {
    return LZString._compress(uncompressed, 16, function(a){return f(a);});
  },
  _compress: function (uncompressed, bitsPerChar, getCharFromInt) {
    if (uncompressed == null) return "";
    var i, value,
        context_dictionary= {},
        context_dictionaryToCreate= {},
        context_c="",
        context_wc="",
        context_w="",
        context_enlargeIn= 2, // Compensate for the first entry which should not count
        context_dictSize= 3,
        context_numBits= 2,
        context_data=[],
        context_data_val=0,
        context_data_position=0,
        ii;

    for (ii = 0; ii < uncompressed.length; ii += 1) {
      context_c = uncompressed.charAt(ii);
      if (!Object.prototype.hasOwnProperty.call(context_dictionary,context_c)) {
        context_dictionary[context_c] = context_dictSize++;
        context_dictionaryToCreate[context_c] = true;
      }

      context_wc = context_w + context_c;
      if (Object.prototype.hasOwnProperty.call(context_dictionary,context_wc)) {
        context_w = context_wc;
      } else {
        if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate,context_w)) {
          if (context_w.charCodeAt(0)<256) {
            for (i=0 ; i<context_numBits ; i++) {
              context_data_val = (context_data_val << 1);
              if (context_data_position == bitsPerChar-1) {
                context_data_position = 0;
                context_data.push(getCharFromInt(context_data_val));
                context_data_val = 0;
              } else {
                context_data_position++;
              }
            }
            value = context_w.charCodeAt(0);
            for (i=0 ; i<8 ; i++) {
              context_data_val = (context_data_val << 1) | (value&1);
              if (context_data_position == bitsPerChar-1) {
                context_data_position = 0;
                context_data.push(getCharFromInt(context_data_val));
                context_data_val = 0;
              } else {
                context_data_position++;
              }
              value = value >> 1;
            }
          } else {
            value = 1;
            for (i=0 ; i<context_numBits ; i++) {
              context_data_val = (context_data_val << 1) | value;
              if (context_data_position ==bitsPerChar-1) {
                context_data_position = 0;
                context_data.push(getCharFromInt(context_data_val));
                context_data_val = 0;
              } else {
                context_data_position++;
              }
              value = 0;
            }
            value = context_w.charCodeAt(0);
            for (i=0 ; i<16 ; i++) {
              context_data_val = (context_data_val << 1) | (value&1);
              if (context_data_position == bitsPerChar-1) {
                context_data_position = 0;
                context_data.push(getCharFromInt(context_data_val));
                context_data_val = 0;
              } else {
                context_data_position++;
              }
              value = value >> 1;
            }
          }
          context_enlargeIn--;
          if (context_enlargeIn == 0) {
            context_enlargeIn = Math.pow(2, context_numBits);
            context_numBits++;
          }
          delete context_dictionaryToCreate[context_w];
        } else {
          value = context_dictionary[context_w];
          for (i=0 ; i<context_numBits ; i++) {
            context_data_val = (context_data_val << 1) | (value&1);
            if (context_data_position == bitsPerChar-1) {
              context_data_position = 0;
              context_data.push(getCharFromInt(context_data_val));
              context_data_val = 0;
            } else {
              context_data_position++;
            }
            value = value >> 1;
          }


        }
        context_enlargeIn--;
        if (context_enlargeIn == 0) {
          context_enlargeIn = Math.pow(2, context_numBits);
          context_numBits++;
        }
        // Add wc to the dictionary.
        context_dictionary[context_wc] = context_dictSize++;
        context_w = String(context_c);
      }
    }

    // Output the code for w.
    if (context_w !== "") {
      if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate,context_w)) {
        if (context_w.charCodeAt(0)<256) {
          for (i=0 ; i<context_numBits ; i++) {
            context_data_val = (context_data_val << 1);
            if (context_data_position == bitsPerChar-1) {
              context_data_position = 0;
              context_data.push(getCharFromInt(context_data_val));
              context_data_val = 0;
            } else {
              context_data_position++;
            }
          }
          value = context_w.charCodeAt(0);
          for (i=0 ; i<8 ; i++) {
            context_data_val = (context_data_val << 1) | (value&1);
            if (context_data_position == bitsPerChar-1) {
              context_data_position = 0;
              context_data.push(getCharFromInt(context_data_val));
              context_data_val = 0;
            } else {
              context_data_position++;
            }
            value = value >> 1;
          }
        } else {
          value = 1;
          for (i=0 ; i<context_numBits ; i++) {
            context_data_val = (context_data_val << 1) | value;
            if (context_data_position == bitsPerChar-1) {
              context_data_position = 0;
              context_data.push(getCharFromInt(context_data_val));
              context_data_val = 0;
            } else {
              context_data_position++;
            }
            value = 0;
          }
          value = context_w.charCodeAt(0);
          for (i=0 ; i<16 ; i++) {
            context_data_val = (context_data_val << 1) | (value&1);
            if (context_data_position == bitsPerChar-1) {
              context_data_position = 0;
              context_data.push(getCharFromInt(context_data_val));
              context_data_val = 0;
            } else {
              context_data_position++;
            }
            value = value >> 1;
          }
        }
        context_enlargeIn--;
        if (context_enlargeIn == 0) {
          context_enlargeIn = Math.pow(2, context_numBits);
          context_numBits++;
        }
        delete context_dictionaryToCreate[context_w];
      } else {
        value = context_dictionary[context_w];
        for (i=0 ; i<context_numBits ; i++) {
          context_data_val = (context_data_val << 1) | (value&1);
          if (context_data_position == bitsPerChar-1) {
            context_data_position = 0;
            context_data.push(getCharFromInt(context_data_val));
            context_data_val = 0;
          } else {
            context_data_position++;
          }
          value = value >> 1;
        }


      }
      context_enlargeIn--;
      if (context_enlargeIn == 0) {
        context_enlargeIn = Math.pow(2, context_numBits);
        context_numBits++;
      }
    }

    // Mark the end of the stream
    value = 2;
    for (i=0 ; i<context_numBits ; i++) {
      context_data_val = (context_data_val << 1) | (value&1);
      if (context_data_position == bitsPerChar-1) {
        context_data_position = 0;
        context_data.push(getCharFromInt(context_data_val));
        context_data_val = 0;
      } else {
        context_data_position++;
      }
      value = value >> 1;
    }

    // Flush the last char
    while (true) {
      context_data_val = (context_data_val << 1);
      if (context_data_position == bitsPerChar-1) {
        context_data.push(getCharFromInt(context_data_val));
        break;
      }
      else context_data_position++;
    }
    return context_data.join('');
  },

  decompress: function (compressed) {
    if (compressed == null) return "";
    if (compressed == "") return null;
    return LZString._decompress(compressed.length, 32768, function(index) { return compressed.charCodeAt(index); });
  },

  _decompress: function (length, resetValue, getNextValue) {
    var dictionary = [],
        next,
        enlargeIn = 4,
        dictSize = 4,
        numBits = 3,
        entry = "",
        result = [],
        i,
        w,
        bits, resb, maxpower, power,
        c,
        data = {val:getNextValue(0), position:resetValue, index:1};

    for (i = 0; i < 3; i += 1) {
      dictionary[i] = i;
    }

    bits = 0;
    maxpower = Math.pow(2,2);
    power=1;
    while (power!=maxpower) {
      resb = data.val & data.position;
      data.position >>= 1;
      if (data.position == 0) {
        data.position = resetValue;
        data.val = getNextValue(data.index++);
      }
      bits |= (resb>0 ? 1 : 0) * power;
      power <<= 1;
    }

    switch (next = bits) {
      case 0:
          bits = 0;
          maxpower = Math.pow(2,8);
          power=1;
          while (power!=maxpower) {
            resb = data.val & data.position;
            data.position >>= 1;
            if (data.position == 0) {
              data.position = resetValue;
              data.val = getNextValue(data.index++);
            }
            bits |= (resb>0 ? 1 : 0) * power;
            power <<= 1;
          }
        c = f(bits);
        break;
      case 1:
          bits = 0;
          maxpower = Math.pow(2,16);
          power=1;
          while (power!=maxpower) {
            resb = data.val & data.position;
            data.position >>= 1;
            if (data.position == 0) {
              data.position = resetValue;
              data.val = getNextValue(data.index++);
            }
            bits |= (resb>0 ? 1 : 0) * power;
            power <<= 1;
          }
        c = f(bits);
        break;
      case 2:
        return "";
    }
    dictionary[3] = c;
    w = c;
    result.push(c);
    while (true) {
      if (data.index > length) {
        return "";
      }

      bits = 0;
      maxpower = Math.pow(2,numBits);
      power=1;
      while (power!=maxpower) {
        resb = data.val & data.position;
        data.position >>= 1;
        if (data.position == 0) {
          data.position = resetValue;
          data.val = getNextValue(data.index++);
        }
        bits |= (resb>0 ? 1 : 0) * power;
        power <<= 1;
      }

      switch (c = bits) {
        case 0:
          bits = 0;
          maxpower = Math.pow(2,8);
          power=1;
          while (power!=maxpower) {
            resb = data.val & data.position;
            data.position >>= 1;
            if (data.position == 0) {
              data.position = resetValue;
              data.val = getNextValue(data.index++);
            }
            bits |= (resb>0 ? 1 : 0) * power;
            power <<= 1;
          }

          dictionary[dictSize++] = f(bits);
          c = dictSize-1;
          enlargeIn--;
          break;
        case 1:
          bits = 0;
          maxpower = Math.pow(2,16);
          power=1;
          while (power!=maxpower) {
            resb = data.val & data.position;
            data.position >>= 1;
            if (data.position == 0) {
              data.position = resetValue;
              data.val = getNextValue(data.index++);
            }
            bits |= (resb>0 ? 1 : 0) * power;
            power <<= 1;
          }
          dictionary[dictSize++] = f(bits);
          c = dictSize-1;
          enlargeIn--;
          break;
        case 2:
          return result.join('');
      }

      if (enlargeIn == 0) {
        enlargeIn = Math.pow(2, numBits);
        numBits++;
      }

      if (dictionary[c]) {
        entry = dictionary[c];
      } else {
        if (c === dictSize) {
          entry = w + w.charAt(0);
        } else {
          return null;
        }
      }
      result.push(entry);

      // Add w+entry[0] to the dictionary.
      dictionary[dictSize++] = w + entry.charAt(0);
      enlargeIn--;

      w = entry;

      if (enlargeIn == 0) {
        enlargeIn = Math.pow(2, numBits);
        numBits++;
      }

    }
  }
};
  return LZString;
})();

if (typeof define === 'function' && define.amd) {
  define(function () { return LZString; });
} else if( typeof module !== 'undefined' && module != null ) {
  module.exports = LZString
}

},{}],37:[function(require,module,exports){



/**
 * UTM zones are grouped, and assigned to one of a group of 6
 * sets.
 *
 * {int} @private
 */
var NUM_100K_SETS = 6;

/**
 * The column letters (for easting) of the lower left value, per
 * set.
 *
 * {string} @private
 */
var SET_ORIGIN_COLUMN_LETTERS = 'AJSAJS';

/**
 * The row letters (for northing) of the lower left value, per
 * set.
 *
 * {string} @private
 */
var SET_ORIGIN_ROW_LETTERS = 'AFAFAF';

var A = 65; // A
var I = 73; // I
var O = 79; // O
var V = 86; // V
var Z = 90; // Z

/**
 * Conversion of lat/lon to MGRS.
 *
 * @param {object} ll Object literal with lat and lon properties on a
 *     WGS84 ellipsoid.
 * @param {int} accuracy Accuracy in digits (5 for 1 m, 4 for 10 m, 3 for
 *      100 m, 2 for 1000 m or 1 for 10000 m). Optional, default is 5.
 * @return {string} the MGRS string for the given location and accuracy.
 */
exports.forward = function(ll, accuracy) {
  accuracy = accuracy || 5; // default accuracy 1m
  return encode(LLtoUTM({
    lat: ll[1],
    lon: ll[0]
  }), accuracy);
};

/**
 * Conversion of MGRS to lat/lon.
 *
 * @param {string} mgrs MGRS string.
 * @return {array} An array with left (longitude), bottom (latitude), right
 *     (longitude) and top (latitude) values in WGS84, representing the
 *     bounding box for the provided MGRS reference.
 */
exports.inverse = function(mgrs) {
  var bbox = UTMtoLL(decode(mgrs.toUpperCase()));
  if (bbox.lat && bbox.lon) {
    return [bbox.lon, bbox.lat, bbox.lon, bbox.lat];
  }
  return [bbox.left, bbox.bottom, bbox.right, bbox.top];
};

exports.toPoint = function(mgrs) {
  var bbox = UTMtoLL(decode(mgrs.toUpperCase()));
  if (bbox.lat && bbox.lon) {
    return [bbox.lon, bbox.lat];
  }
  return [(bbox.left + bbox.right) / 2, (bbox.top + bbox.bottom) / 2];
};
/**
 * Conversion from degrees to radians.
 *
 * @private
 * @param {number} deg the angle in degrees.
 * @return {number} the angle in radians.
 */
function degToRad(deg) {
  return (deg * (Math.PI / 180.0));
}

/**
 * Conversion from radians to degrees.
 *
 * @private
 * @param {number} rad the angle in radians.
 * @return {number} the angle in degrees.
 */
function radToDeg(rad) {
  return (180.0 * (rad / Math.PI));
}

/**
 * Converts a set of Longitude and Latitude co-ordinates to UTM
 * using the WGS84 ellipsoid.
 *
 * @private
 * @param {object} ll Object literal with lat and lon properties
 *     representing the WGS84 coordinate to be converted.
 * @return {object} Object literal containing the UTM value with easting,
 *     northing, zoneNumber and zoneLetter properties, and an optional
 *     accuracy property in digits. Returns null if the conversion failed.
 */
function LLtoUTM(ll) {
  var Lat = ll.lat;
  var Long = ll.lon;
  var a = 6378137.0; //ellip.radius;
  var eccSquared = 0.00669438; //ellip.eccsq;
  var k0 = 0.9996;
  var LongOrigin;
  var eccPrimeSquared;
  var N, T, C, A, M;
  var LatRad = degToRad(Lat);
  var LongRad = degToRad(Long);
  var LongOriginRad;
  var ZoneNumber;
  // (int)
  ZoneNumber = Math.floor((Long + 180) / 6) + 1;

  //Make sure the longitude 180.00 is in Zone 60
  if (Long === 180) {
    ZoneNumber = 60;
  }

  // Special zone for Norway
  if (Lat >= 56.0 && Lat < 64.0 && Long >= 3.0 && Long < 12.0) {
    ZoneNumber = 32;
  }

  // Special zones for Svalbard
  if (Lat >= 72.0 && Lat < 84.0) {
    if (Long >= 0.0 && Long < 9.0) {
      ZoneNumber = 31;
    }
    else if (Long >= 9.0 && Long < 21.0) {
      ZoneNumber = 33;
    }
    else if (Long >= 21.0 && Long < 33.0) {
      ZoneNumber = 35;
    }
    else if (Long >= 33.0 && Long < 42.0) {
      ZoneNumber = 37;
    }
  }

  LongOrigin = (ZoneNumber - 1) * 6 - 180 + 3; //+3 puts origin
  // in middle of
  // zone
  LongOriginRad = degToRad(LongOrigin);

  eccPrimeSquared = (eccSquared) / (1 - eccSquared);

  N = a / Math.sqrt(1 - eccSquared * Math.sin(LatRad) * Math.sin(LatRad));
  T = Math.tan(LatRad) * Math.tan(LatRad);
  C = eccPrimeSquared * Math.cos(LatRad) * Math.cos(LatRad);
  A = Math.cos(LatRad) * (LongRad - LongOriginRad);

  M = a * ((1 - eccSquared / 4 - 3 * eccSquared * eccSquared / 64 - 5 * eccSquared * eccSquared * eccSquared / 256) * LatRad - (3 * eccSquared / 8 + 3 * eccSquared * eccSquared / 32 + 45 * eccSquared * eccSquared * eccSquared / 1024) * Math.sin(2 * LatRad) + (15 * eccSquared * eccSquared / 256 + 45 * eccSquared * eccSquared * eccSquared / 1024) * Math.sin(4 * LatRad) - (35 * eccSquared * eccSquared * eccSquared / 3072) * Math.sin(6 * LatRad));

  var UTMEasting = (k0 * N * (A + (1 - T + C) * A * A * A / 6.0 + (5 - 18 * T + T * T + 72 * C - 58 * eccPrimeSquared) * A * A * A * A * A / 120.0) + 500000.0);

  var UTMNorthing = (k0 * (M + N * Math.tan(LatRad) * (A * A / 2 + (5 - T + 9 * C + 4 * C * C) * A * A * A * A / 24.0 + (61 - 58 * T + T * T + 600 * C - 330 * eccPrimeSquared) * A * A * A * A * A * A / 720.0)));
  if (Lat < 0.0) {
    UTMNorthing += 10000000.0; //10000000 meter offset for
    // southern hemisphere
  }

  return {
    northing: Math.round(UTMNorthing),
    easting: Math.round(UTMEasting),
    zoneNumber: ZoneNumber,
    zoneLetter: getLetterDesignator(Lat)
  };
}

/**
 * Converts UTM coords to lat/long, using the WGS84 ellipsoid. This is a convenience
 * class where the Zone can be specified as a single string eg."60N" which
 * is then broken down into the ZoneNumber and ZoneLetter.
 *
 * @private
 * @param {object} utm An object literal with northing, easting, zoneNumber
 *     and zoneLetter properties. If an optional accuracy property is
 *     provided (in meters), a bounding box will be returned instead of
 *     latitude and longitude.
 * @return {object} An object literal containing either lat and lon values
 *     (if no accuracy was provided), or top, right, bottom and left values
 *     for the bounding box calculated according to the provided accuracy.
 *     Returns null if the conversion failed.
 */
function UTMtoLL(utm) {

  var UTMNorthing = utm.northing;
  var UTMEasting = utm.easting;
  var zoneLetter = utm.zoneLetter;
  var zoneNumber = utm.zoneNumber;
  // check the ZoneNummber is valid
  if (zoneNumber < 0 || zoneNumber > 60) {
    return null;
  }

  var k0 = 0.9996;
  var a = 6378137.0; //ellip.radius;
  var eccSquared = 0.00669438; //ellip.eccsq;
  var eccPrimeSquared;
  var e1 = (1 - Math.sqrt(1 - eccSquared)) / (1 + Math.sqrt(1 - eccSquared));
  var N1, T1, C1, R1, D, M;
  var LongOrigin;
  var mu, phi1Rad;

  // remove 500,000 meter offset for longitude
  var x = UTMEasting - 500000.0;
  var y = UTMNorthing;

  // We must know somehow if we are in the Northern or Southern
  // hemisphere, this is the only time we use the letter So even
  // if the Zone letter isn't exactly correct it should indicate
  // the hemisphere correctly
  if (zoneLetter < 'N') {
    y -= 10000000.0; // remove 10,000,000 meter offset used
    // for southern hemisphere
  }

  // There are 60 zones with zone 1 being at West -180 to -174
  LongOrigin = (zoneNumber - 1) * 6 - 180 + 3; // +3 puts origin
  // in middle of
  // zone

  eccPrimeSquared = (eccSquared) / (1 - eccSquared);

  M = y / k0;
  mu = M / (a * (1 - eccSquared / 4 - 3 * eccSquared * eccSquared / 64 - 5 * eccSquared * eccSquared * eccSquared / 256));

  phi1Rad = mu + (3 * e1 / 2 - 27 * e1 * e1 * e1 / 32) * Math.sin(2 * mu) + (21 * e1 * e1 / 16 - 55 * e1 * e1 * e1 * e1 / 32) * Math.sin(4 * mu) + (151 * e1 * e1 * e1 / 96) * Math.sin(6 * mu);
  // double phi1 = ProjMath.radToDeg(phi1Rad);

  N1 = a / Math.sqrt(1 - eccSquared * Math.sin(phi1Rad) * Math.sin(phi1Rad));
  T1 = Math.tan(phi1Rad) * Math.tan(phi1Rad);
  C1 = eccPrimeSquared * Math.cos(phi1Rad) * Math.cos(phi1Rad);
  R1 = a * (1 - eccSquared) / Math.pow(1 - eccSquared * Math.sin(phi1Rad) * Math.sin(phi1Rad), 1.5);
  D = x / (N1 * k0);

  var lat = phi1Rad - (N1 * Math.tan(phi1Rad) / R1) * (D * D / 2 - (5 + 3 * T1 + 10 * C1 - 4 * C1 * C1 - 9 * eccPrimeSquared) * D * D * D * D / 24 + (61 + 90 * T1 + 298 * C1 + 45 * T1 * T1 - 252 * eccPrimeSquared - 3 * C1 * C1) * D * D * D * D * D * D / 720);
  lat = radToDeg(lat);

  var lon = (D - (1 + 2 * T1 + C1) * D * D * D / 6 + (5 - 2 * C1 + 28 * T1 - 3 * C1 * C1 + 8 * eccPrimeSquared + 24 * T1 * T1) * D * D * D * D * D / 120) / Math.cos(phi1Rad);
  lon = LongOrigin + radToDeg(lon);

  var result;
  if (utm.accuracy) {
    var topRight = UTMtoLL({
      northing: utm.northing + utm.accuracy,
      easting: utm.easting + utm.accuracy,
      zoneLetter: utm.zoneLetter,
      zoneNumber: utm.zoneNumber
    });
    result = {
      top: topRight.lat,
      right: topRight.lon,
      bottom: lat,
      left: lon
    };
  }
  else {
    result = {
      lat: lat,
      lon: lon
    };
  }
  return result;
}

/**
 * Calculates the MGRS letter designator for the given latitude.
 *
 * @private
 * @param {number} lat The latitude in WGS84 to get the letter designator
 *     for.
 * @return {char} The letter designator.
 */
function getLetterDesignator(lat) {
  //This is here as an error flag to show that the Latitude is
  //outside MGRS limits
  var LetterDesignator = 'Z';

  if ((84 >= lat) && (lat >= 72)) {
    LetterDesignator = 'X';
  }
  else if ((72 > lat) && (lat >= 64)) {
    LetterDesignator = 'W';
  }
  else if ((64 > lat) && (lat >= 56)) {
    LetterDesignator = 'V';
  }
  else if ((56 > lat) && (lat >= 48)) {
    LetterDesignator = 'U';
  }
  else if ((48 > lat) && (lat >= 40)) {
    LetterDesignator = 'T';
  }
  else if ((40 > lat) && (lat >= 32)) {
    LetterDesignator = 'S';
  }
  else if ((32 > lat) && (lat >= 24)) {
    LetterDesignator = 'R';
  }
  else if ((24 > lat) && (lat >= 16)) {
    LetterDesignator = 'Q';
  }
  else if ((16 > lat) && (lat >= 8)) {
    LetterDesignator = 'P';
  }
  else if ((8 > lat) && (lat >= 0)) {
    LetterDesignator = 'N';
  }
  else if ((0 > lat) && (lat >= -8)) {
    LetterDesignator = 'M';
  }
  else if ((-8 > lat) && (lat >= -16)) {
    LetterDesignator = 'L';
  }
  else if ((-16 > lat) && (lat >= -24)) {
    LetterDesignator = 'K';
  }
  else if ((-24 > lat) && (lat >= -32)) {
    LetterDesignator = 'J';
  }
  else if ((-32 > lat) && (lat >= -40)) {
    LetterDesignator = 'H';
  }
  else if ((-40 > lat) && (lat >= -48)) {
    LetterDesignator = 'G';
  }
  else if ((-48 > lat) && (lat >= -56)) {
    LetterDesignator = 'F';
  }
  else if ((-56 > lat) && (lat >= -64)) {
    LetterDesignator = 'E';
  }
  else if ((-64 > lat) && (lat >= -72)) {
    LetterDesignator = 'D';
  }
  else if ((-72 > lat) && (lat >= -80)) {
    LetterDesignator = 'C';
  }
  return LetterDesignator;
}

/**
 * Encodes a UTM location as MGRS string.
 *
 * @private
 * @param {object} utm An object literal with easting, northing,
 *     zoneLetter, zoneNumber
 * @param {number} accuracy Accuracy in digits (1-5).
 * @return {string} MGRS string for the given UTM location.
 */
function encode(utm, accuracy) {
  // prepend with leading zeroes
  var seasting = "00000" + utm.easting,
    snorthing = "00000" + utm.northing;

  return utm.zoneNumber + utm.zoneLetter + get100kID(utm.easting, utm.northing, utm.zoneNumber) + seasting.substr(seasting.length - 5, accuracy) + snorthing.substr(snorthing.length - 5, accuracy);
}

/**
 * Get the two letter 100k designator for a given UTM easting,
 * northing and zone number value.
 *
 * @private
 * @param {number} easting
 * @param {number} northing
 * @param {number} zoneNumber
 * @return the two letter 100k designator for the given UTM location.
 */
function get100kID(easting, northing, zoneNumber) {
  var setParm = get100kSetForZone(zoneNumber);
  var setColumn = Math.floor(easting / 100000);
  var setRow = Math.floor(northing / 100000) % 20;
  return getLetter100kID(setColumn, setRow, setParm);
}

/**
 * Given a UTM zone number, figure out the MGRS 100K set it is in.
 *
 * @private
 * @param {number} i An UTM zone number.
 * @return {number} the 100k set the UTM zone is in.
 */
function get100kSetForZone(i) {
  var setParm = i % NUM_100K_SETS;
  if (setParm === 0) {
    setParm = NUM_100K_SETS;
  }

  return setParm;
}

/**
 * Get the two-letter MGRS 100k designator given information
 * translated from the UTM northing, easting and zone number.
 *
 * @private
 * @param {number} column the column index as it relates to the MGRS
 *        100k set spreadsheet, created from the UTM easting.
 *        Values are 1-8.
 * @param {number} row the row index as it relates to the MGRS 100k set
 *        spreadsheet, created from the UTM northing value. Values
 *        are from 0-19.
 * @param {number} parm the set block, as it relates to the MGRS 100k set
 *        spreadsheet, created from the UTM zone. Values are from
 *        1-60.
 * @return two letter MGRS 100k code.
 */
function getLetter100kID(column, row, parm) {
  // colOrigin and rowOrigin are the letters at the origin of the set
  var index = parm - 1;
  var colOrigin = SET_ORIGIN_COLUMN_LETTERS.charCodeAt(index);
  var rowOrigin = SET_ORIGIN_ROW_LETTERS.charCodeAt(index);

  // colInt and rowInt are the letters to build to return
  var colInt = colOrigin + column - 1;
  var rowInt = rowOrigin + row;
  var rollover = false;

  if (colInt > Z) {
    colInt = colInt - Z + A - 1;
    rollover = true;
  }

  if (colInt === I || (colOrigin < I && colInt > I) || ((colInt > I || colOrigin < I) && rollover)) {
    colInt++;
  }

  if (colInt === O || (colOrigin < O && colInt > O) || ((colInt > O || colOrigin < O) && rollover)) {
    colInt++;

    if (colInt === I) {
      colInt++;
    }
  }

  if (colInt > Z) {
    colInt = colInt - Z + A - 1;
  }

  if (rowInt > V) {
    rowInt = rowInt - V + A - 1;
    rollover = true;
  }
  else {
    rollover = false;
  }

  if (((rowInt === I) || ((rowOrigin < I) && (rowInt > I))) || (((rowInt > I) || (rowOrigin < I)) && rollover)) {
    rowInt++;
  }

  if (((rowInt === O) || ((rowOrigin < O) && (rowInt > O))) || (((rowInt > O) || (rowOrigin < O)) && rollover)) {
    rowInt++;

    if (rowInt === I) {
      rowInt++;
    }
  }

  if (rowInt > V) {
    rowInt = rowInt - V + A - 1;
  }

  var twoLetter = String.fromCharCode(colInt) + String.fromCharCode(rowInt);
  return twoLetter;
}

/**
 * Decode the UTM parameters from a MGRS string.
 *
 * @private
 * @param {string} mgrsString an UPPERCASE coordinate string is expected.
 * @return {object} An object literal with easting, northing, zoneLetter,
 *     zoneNumber and accuracy (in meters) properties.
 */
function decode(mgrsString) {

  if (mgrsString && mgrsString.length === 0) {
    throw ("MGRSPoint coverting from nothing");
  }

  var length = mgrsString.length;

  var hunK = null;
  var sb = "";
  var testChar;
  var i = 0;

  // get Zone number
  while (!(/[A-Z]/).test(testChar = mgrsString.charAt(i))) {
    if (i >= 2) {
      throw ("MGRSPoint bad conversion from: " + mgrsString);
    }
    sb += testChar;
    i++;
  }

  var zoneNumber = parseInt(sb, 10);

  if (i === 0 || i + 3 > length) {
    // A good MGRS string has to be 4-5 digits long,
    // ##AAA/#AAA at least.
    throw ("MGRSPoint bad conversion from: " + mgrsString);
  }

  var zoneLetter = mgrsString.charAt(i++);

  // Should we check the zone letter here? Why not.
  if (zoneLetter <= 'A' || zoneLetter === 'B' || zoneLetter === 'Y' || zoneLetter >= 'Z' || zoneLetter === 'I' || zoneLetter === 'O') {
    throw ("MGRSPoint zone letter " + zoneLetter + " not handled: " + mgrsString);
  }

  hunK = mgrsString.substring(i, i += 2);

  var set = get100kSetForZone(zoneNumber);

  var east100k = getEastingFromChar(hunK.charAt(0), set);
  var north100k = getNorthingFromChar(hunK.charAt(1), set);

  // We have a bug where the northing may be 2000000 too low.
  // How
  // do we know when to roll over?

  while (north100k < getMinNorthing(zoneLetter)) {
    north100k += 2000000;
  }

  // calculate the char index for easting/northing separator
  var remainder = length - i;

  if (remainder % 2 !== 0) {
    throw ("MGRSPoint has to have an even number \nof digits after the zone letter and two 100km letters - front \nhalf for easting meters, second half for \nnorthing meters" + mgrsString);
  }

  var sep = remainder / 2;

  var sepEasting = 0.0;
  var sepNorthing = 0.0;
  var accuracyBonus, sepEastingString, sepNorthingString, easting, northing;
  if (sep > 0) {
    accuracyBonus = 100000.0 / Math.pow(10, sep);
    sepEastingString = mgrsString.substring(i, i + sep);
    sepEasting = parseFloat(sepEastingString) * accuracyBonus;
    sepNorthingString = mgrsString.substring(i + sep);
    sepNorthing = parseFloat(sepNorthingString) * accuracyBonus;
  }

  easting = sepEasting + east100k;
  northing = sepNorthing + north100k;

  return {
    easting: easting,
    northing: northing,
    zoneLetter: zoneLetter,
    zoneNumber: zoneNumber,
    accuracy: accuracyBonus
  };
}

/**
 * Given the first letter from a two-letter MGRS 100k zone, and given the
 * MGRS table set for the zone number, figure out the easting value that
 * should be added to the other, secondary easting value.
 *
 * @private
 * @param {char} e The first letter from a two-letter MGRS 100´k zone.
 * @param {number} set The MGRS table set for the zone number.
 * @return {number} The easting value for the given letter and set.
 */
function getEastingFromChar(e, set) {
  // colOrigin is the letter at the origin of the set for the
  // column
  var curCol = SET_ORIGIN_COLUMN_LETTERS.charCodeAt(set - 1);
  var eastingValue = 100000.0;
  var rewindMarker = false;

  while (curCol !== e.charCodeAt(0)) {
    curCol++;
    if (curCol === I) {
      curCol++;
    }
    if (curCol === O) {
      curCol++;
    }
    if (curCol > Z) {
      if (rewindMarker) {
        throw ("Bad character: " + e);
      }
      curCol = A;
      rewindMarker = true;
    }
    eastingValue += 100000.0;
  }

  return eastingValue;
}

/**
 * Given the second letter from a two-letter MGRS 100k zone, and given the
 * MGRS table set for the zone number, figure out the northing value that
 * should be added to the other, secondary northing value. You have to
 * remember that Northings are determined from the equator, and the vertical
 * cycle of letters mean a 2000000 additional northing meters. This happens
 * approx. every 18 degrees of latitude. This method does *NOT* count any
 * additional northings. You have to figure out how many 2000000 meters need
 * to be added for the zone letter of the MGRS coordinate.
 *
 * @private
 * @param {char} n Second letter of the MGRS 100k zone
 * @param {number} set The MGRS table set number, which is dependent on the
 *     UTM zone number.
 * @return {number} The northing value for the given letter and set.
 */
function getNorthingFromChar(n, set) {

  if (n > 'V') {
    throw ("MGRSPoint given invalid Northing " + n);
  }

  // rowOrigin is the letter at the origin of the set for the
  // column
  var curRow = SET_ORIGIN_ROW_LETTERS.charCodeAt(set - 1);
  var northingValue = 0.0;
  var rewindMarker = false;

  while (curRow !== n.charCodeAt(0)) {
    curRow++;
    if (curRow === I) {
      curRow++;
    }
    if (curRow === O) {
      curRow++;
    }
    // fixing a bug making whole application hang in this loop
    // when 'n' is a wrong character
    if (curRow > V) {
      if (rewindMarker) { // making sure that this loop ends
        throw ("Bad character: " + n);
      }
      curRow = A;
      rewindMarker = true;
    }
    northingValue += 100000.0;
  }

  return northingValue;
}

/**
 * The function getMinNorthing returns the minimum northing value of a MGRS
 * zone.
 *
 * Ported from Geotrans' c Lattitude_Band_Value structure table.
 *
 * @private
 * @param {char} zoneLetter The MGRS zone to get the min northing for.
 * @return {number}
 */
function getMinNorthing(zoneLetter) {
  var northing;
  switch (zoneLetter) {
  case 'C':
    northing = 1100000.0;
    break;
  case 'D':
    northing = 2000000.0;
    break;
  case 'E':
    northing = 2800000.0;
    break;
  case 'F':
    northing = 3700000.0;
    break;
  case 'G':
    northing = 4600000.0;
    break;
  case 'H':
    northing = 5500000.0;
    break;
  case 'J':
    northing = 6400000.0;
    break;
  case 'K':
    northing = 7300000.0;
    break;
  case 'L':
    northing = 8200000.0;
    break;
  case 'M':
    northing = 9100000.0;
    break;
  case 'N':
    northing = 0.0;
    break;
  case 'P':
    northing = 800000.0;
    break;
  case 'Q':
    northing = 1700000.0;
    break;
  case 'R':
    northing = 2600000.0;
    break;
  case 'S':
    northing = 3500000.0;
    break;
  case 'T':
    northing = 4400000.0;
    break;
  case 'U':
    northing = 5300000.0;
    break;
  case 'V':
    northing = 6200000.0;
    break;
  case 'W':
    northing = 7000000.0;
    break;
  case 'X':
    northing = 7900000.0;
    break;
  default:
    northing = -1.0;
  }
  if (northing >= 0.0) {
    return northing;
  }
  else {
    throw ("Invalid zone letter: " + zoneLetter);
  }

}

},{}],38:[function(require,module,exports){
/*! nouislider - 8.5.1 - 2016-04-24 16:00:29 */

(function (factory) {

    if ( typeof define === 'function' && define.amd ) {

        // AMD. Register as an anonymous module.
        define([], factory);

    } else if ( typeof exports === 'object' ) {

        // Node/CommonJS
        module.exports = factory();

    } else {

        // Browser globals
        window.noUiSlider = factory();
    }

}(function( ){

	'use strict';


	// Removes duplicates from an array.
	function unique(array) {
		return array.filter(function(a){
			return !this[a] ? this[a] = true : false;
		}, {});
	}

	// Round a value to the closest 'to'.
	function closest ( value, to ) {
		return Math.round(value / to) * to;
	}

	// Current position of an element relative to the document.
	function offset ( elem ) {

	var rect = elem.getBoundingClientRect(),
		doc = elem.ownerDocument,
		docElem = doc.documentElement,
		pageOffset = getPageOffset();

		// getBoundingClientRect contains left scroll in Chrome on Android.
		// I haven't found a feature detection that proves this. Worst case
		// scenario on mis-match: the 'tap' feature on horizontal sliders breaks.
		if ( /webkit.*Chrome.*Mobile/i.test(navigator.userAgent) ) {
			pageOffset.x = 0;
		}

		return {
			top: rect.top + pageOffset.y - docElem.clientTop,
			left: rect.left + pageOffset.x - docElem.clientLeft
		};
	}

	// Checks whether a value is numerical.
	function isNumeric ( a ) {
		return typeof a === 'number' && !isNaN( a ) && isFinite( a );
	}

	// Sets a class and removes it after [duration] ms.
	function addClassFor ( element, className, duration ) {
		addClass(element, className);
		setTimeout(function(){
			removeClass(element, className);
		}, duration);
	}

	// Limits a value to 0 - 100
	function limit ( a ) {
		return Math.max(Math.min(a, 100), 0);
	}

	// Wraps a variable as an array, if it isn't one yet.
	function asArray ( a ) {
		return Array.isArray(a) ? a : [a];
	}

	// Counts decimals
	function countDecimals ( numStr ) {
		var pieces = numStr.split(".");
		return pieces.length > 1 ? pieces[1].length : 0;
	}

	// http://youmightnotneedjquery.com/#add_class
	function addClass ( el, className ) {
		if ( el.classList ) {
			el.classList.add(className);
		} else {
			el.className += ' ' + className;
		}
	}

	// http://youmightnotneedjquery.com/#remove_class
	function removeClass ( el, className ) {
		if ( el.classList ) {
			el.classList.remove(className);
		} else {
			el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
		}
	}

	// https://plainjs.com/javascript/attributes/adding-removing-and-testing-for-classes-9/
	function hasClass ( el, className ) {
		return el.classList ? el.classList.contains(className) : new RegExp('\\b' + className + '\\b').test(el.className);
	}

	// https://developer.mozilla.org/en-US/docs/Web/API/Window/scrollY#Notes
	function getPageOffset ( ) {

		var supportPageOffset = window.pageXOffset !== undefined,
			isCSS1Compat = ((document.compatMode || "") === "CSS1Compat"),
			x = supportPageOffset ? window.pageXOffset : isCSS1Compat ? document.documentElement.scrollLeft : document.body.scrollLeft,
			y = supportPageOffset ? window.pageYOffset : isCSS1Compat ? document.documentElement.scrollTop : document.body.scrollTop;

		return {
			x: x,
			y: y
		};
	}

	// we provide a function to compute constants instead
	// of accessing window.* as soon as the module needs it
	// so that we do not compute anything if not needed
	function getActions ( ) {

		// Determine the events to bind. IE11 implements pointerEvents without
		// a prefix, which breaks compatibility with the IE10 implementation.
		return window.navigator.pointerEnabled ? {
			start: 'pointerdown',
			move: 'pointermove',
			end: 'pointerup'
		} : window.navigator.msPointerEnabled ? {
			start: 'MSPointerDown',
			move: 'MSPointerMove',
			end: 'MSPointerUp'
		} : {
			start: 'mousedown touchstart',
			move: 'mousemove touchmove',
			end: 'mouseup touchend'
		};
	}


// Value calculation

	// Determine the size of a sub-range in relation to a full range.
	function subRangeRatio ( pa, pb ) {
		return (100 / (pb - pa));
	}

	// (percentage) How many percent is this value of this range?
	function fromPercentage ( range, value ) {
		return (value * 100) / ( range[1] - range[0] );
	}

	// (percentage) Where is this value on this range?
	function toPercentage ( range, value ) {
		return fromPercentage( range, range[0] < 0 ?
			value + Math.abs(range[0]) :
				value - range[0] );
	}

	// (value) How much is this percentage on this range?
	function isPercentage ( range, value ) {
		return ((value * ( range[1] - range[0] )) / 100) + range[0];
	}


// Range conversion

	function getJ ( value, arr ) {

		var j = 1;

		while ( value >= arr[j] ){
			j += 1;
		}

		return j;
	}

	// (percentage) Input a value, find where, on a scale of 0-100, it applies.
	function toStepping ( xVal, xPct, value ) {

		if ( value >= xVal.slice(-1)[0] ){
			return 100;
		}

		var j = getJ( value, xVal ), va, vb, pa, pb;

		va = xVal[j-1];
		vb = xVal[j];
		pa = xPct[j-1];
		pb = xPct[j];

		return pa + (toPercentage([va, vb], value) / subRangeRatio (pa, pb));
	}

	// (value) Input a percentage, find where it is on the specified range.
	function fromStepping ( xVal, xPct, value ) {

		// There is no range group that fits 100
		if ( value >= 100 ){
			return xVal.slice(-1)[0];
		}

		var j = getJ( value, xPct ), va, vb, pa, pb;

		va = xVal[j-1];
		vb = xVal[j];
		pa = xPct[j-1];
		pb = xPct[j];

		return isPercentage([va, vb], (value - pa) * subRangeRatio (pa, pb));
	}

	// (percentage) Get the step that applies at a certain value.
	function getStep ( xPct, xSteps, snap, value ) {

		if ( value === 100 ) {
			return value;
		}

		var j = getJ( value, xPct ), a, b;

		// If 'snap' is set, steps are used as fixed points on the slider.
		if ( snap ) {

			a = xPct[j-1];
			b = xPct[j];

			// Find the closest position, a or b.
			if ((value - a) > ((b-a)/2)){
				return b;
			}

			return a;
		}

		if ( !xSteps[j-1] ){
			return value;
		}

		return xPct[j-1] + closest(
			value - xPct[j-1],
			xSteps[j-1]
		);
	}


// Entry parsing

	function handleEntryPoint ( index, value, that ) {

		var percentage;

		// Wrap numerical input in an array.
		if ( typeof value === "number" ) {
			value = [value];
		}

		// Reject any invalid input, by testing whether value is an array.
		if ( Object.prototype.toString.call( value ) !== '[object Array]' ){
			throw new Error("noUiSlider: 'range' contains invalid value.");
		}

		// Covert min/max syntax to 0 and 100.
		if ( index === 'min' ) {
			percentage = 0;
		} else if ( index === 'max' ) {
			percentage = 100;
		} else {
			percentage = parseFloat( index );
		}

		// Check for correct input.
		if ( !isNumeric( percentage ) || !isNumeric( value[0] ) ) {
			throw new Error("noUiSlider: 'range' value isn't numeric.");
		}

		// Store values.
		that.xPct.push( percentage );
		that.xVal.push( value[0] );

		// NaN will evaluate to false too, but to keep
		// logging clear, set step explicitly. Make sure
		// not to override the 'step' setting with false.
		if ( !percentage ) {
			if ( !isNaN( value[1] ) ) {
				that.xSteps[0] = value[1];
			}
		} else {
			that.xSteps.push( isNaN(value[1]) ? false : value[1] );
		}
	}

	function handleStepPoint ( i, n, that ) {

		// Ignore 'false' stepping.
		if ( !n ) {
			return true;
		}

		// Factor to range ratio
		that.xSteps[i] = fromPercentage([
			 that.xVal[i]
			,that.xVal[i+1]
		], n) / subRangeRatio (
			that.xPct[i],
			that.xPct[i+1] );
	}


// Interface

	// The interface to Spectrum handles all direction-based
	// conversions, so the above values are unaware.

	function Spectrum ( entry, snap, direction, singleStep ) {

		this.xPct = [];
		this.xVal = [];
		this.xSteps = [ singleStep || false ];
		this.xNumSteps = [ false ];

		this.snap = snap;
		this.direction = direction;

		var index, ordered = [ /* [0, 'min'], [1, '50%'], [2, 'max'] */ ];

		// Map the object keys to an array.
		for ( index in entry ) {
			if ( entry.hasOwnProperty(index) ) {
				ordered.push([entry[index], index]);
			}
		}

		// Sort all entries by value (numeric sort).
		if ( ordered.length && typeof ordered[0][0] === "object" ) {
			ordered.sort(function(a, b) { return a[0][0] - b[0][0]; });
		} else {
			ordered.sort(function(a, b) { return a[0] - b[0]; });
		}


		// Convert all entries to subranges.
		for ( index = 0; index < ordered.length; index++ ) {
			handleEntryPoint(ordered[index][1], ordered[index][0], this);
		}

		// Store the actual step values.
		// xSteps is sorted in the same order as xPct and xVal.
		this.xNumSteps = this.xSteps.slice(0);

		// Convert all numeric steps to the percentage of the subrange they represent.
		for ( index = 0; index < this.xNumSteps.length; index++ ) {
			handleStepPoint(index, this.xNumSteps[index], this);
		}
	}

	Spectrum.prototype.getMargin = function ( value ) {
		return this.xPct.length === 2 ? fromPercentage(this.xVal, value) : false;
	};

	Spectrum.prototype.toStepping = function ( value ) {

		value = toStepping( this.xVal, this.xPct, value );

		// Invert the value if this is a right-to-left slider.
		if ( this.direction ) {
			value = 100 - value;
		}

		return value;
	};

	Spectrum.prototype.fromStepping = function ( value ) {

		// Invert the value if this is a right-to-left slider.
		if ( this.direction ) {
			value = 100 - value;
		}

		return fromStepping( this.xVal, this.xPct, value );
	};

	Spectrum.prototype.getStep = function ( value ) {

		// Find the proper step for rtl sliders by search in inverse direction.
		// Fixes issue #262.
		if ( this.direction ) {
			value = 100 - value;
		}

		value = getStep(this.xPct, this.xSteps, this.snap, value );

		if ( this.direction ) {
			value = 100 - value;
		}

		return value;
	};

	Spectrum.prototype.getApplicableStep = function ( value ) {

		// If the value is 100%, return the negative step twice.
		var j = getJ(value, this.xPct), offset = value === 100 ? 2 : 1;
		return [this.xNumSteps[j-2], this.xVal[j-offset], this.xNumSteps[j-offset]];
	};

	// Outside testing
	Spectrum.prototype.convert = function ( value ) {
		return this.getStep(this.toStepping(value));
	};

/*	Every input option is tested and parsed. This'll prevent
	endless validation in internal methods. These tests are
	structured with an item for every option available. An
	option can be marked as required by setting the 'r' flag.
	The testing function is provided with three arguments:
		- The provided value for the option;
		- A reference to the options object;
		- The name for the option;

	The testing function returns false when an error is detected,
	or true when everything is OK. It can also modify the option
	object, to make sure all values can be correctly looped elsewhere. */

	var defaultFormatter = { 'to': function( value ){
		return value !== undefined && value.toFixed(2);
	}, 'from': Number };

	function testStep ( parsed, entry ) {

		if ( !isNumeric( entry ) ) {
			throw new Error("noUiSlider: 'step' is not numeric.");
		}

		// The step option can still be used to set stepping
		// for linear sliders. Overwritten if set in 'range'.
		parsed.singleStep = entry;
	}

	function testRange ( parsed, entry ) {

		// Filter incorrect input.
		if ( typeof entry !== 'object' || Array.isArray(entry) ) {
			throw new Error("noUiSlider: 'range' is not an object.");
		}

		// Catch missing start or end.
		if ( entry.min === undefined || entry.max === undefined ) {
			throw new Error("noUiSlider: Missing 'min' or 'max' in 'range'.");
		}

		// Catch equal start or end.
		if ( entry.min === entry.max ) {
			throw new Error("noUiSlider: 'range' 'min' and 'max' cannot be equal.");
		}

		parsed.spectrum = new Spectrum(entry, parsed.snap, parsed.dir, parsed.singleStep);
	}

	function testStart ( parsed, entry ) {

		entry = asArray(entry);

		// Validate input. Values aren't tested, as the public .val method
		// will always provide a valid location.
		if ( !Array.isArray( entry ) || !entry.length || entry.length > 2 ) {
			throw new Error("noUiSlider: 'start' option is incorrect.");
		}

		// Store the number of handles.
		parsed.handles = entry.length;

		// When the slider is initialized, the .val method will
		// be called with the start options.
		parsed.start = entry;
	}

	function testSnap ( parsed, entry ) {

		// Enforce 100% stepping within subranges.
		parsed.snap = entry;

		if ( typeof entry !== 'boolean' ){
			throw new Error("noUiSlider: 'snap' option must be a boolean.");
		}
	}

	function testAnimate ( parsed, entry ) {

		// Enforce 100% stepping within subranges.
		parsed.animate = entry;

		if ( typeof entry !== 'boolean' ){
			throw new Error("noUiSlider: 'animate' option must be a boolean.");
		}
	}

	function testAnimationDuration ( parsed, entry ) {

		parsed.animationDuration = entry;

		if ( typeof entry !== 'number' ){
			throw new Error("noUiSlider: 'animationDuration' option must be a number.");
		}
	}

	function testConnect ( parsed, entry ) {

		if ( entry === 'lower' && parsed.handles === 1 ) {
			parsed.connect = 1;
		} else if ( entry === 'upper' && parsed.handles === 1 ) {
			parsed.connect = 2;
		} else if ( entry === true && parsed.handles === 2 ) {
			parsed.connect = 3;
		} else if ( entry === false ) {
			parsed.connect = 0;
		} else {
			throw new Error("noUiSlider: 'connect' option doesn't match handle count.");
		}
	}

	function testOrientation ( parsed, entry ) {

		// Set orientation to an a numerical value for easy
		// array selection.
		switch ( entry ){
		  case 'horizontal':
			parsed.ort = 0;
			break;
		  case 'vertical':
			parsed.ort = 1;
			break;
		  default:
			throw new Error("noUiSlider: 'orientation' option is invalid.");
		}
	}

	function testMargin ( parsed, entry ) {

		if ( !isNumeric(entry) ){
			throw new Error("noUiSlider: 'margin' option must be numeric.");
		}

		// Issue #582
		if ( entry === 0 ) {
			return;
		}

		parsed.margin = parsed.spectrum.getMargin(entry);

		if ( !parsed.margin ) {
			throw new Error("noUiSlider: 'margin' option is only supported on linear sliders.");
		}
	}

	function testLimit ( parsed, entry ) {

		if ( !isNumeric(entry) ){
			throw new Error("noUiSlider: 'limit' option must be numeric.");
		}

		parsed.limit = parsed.spectrum.getMargin(entry);

		if ( !parsed.limit ) {
			throw new Error("noUiSlider: 'limit' option is only supported on linear sliders.");
		}
	}

	function testDirection ( parsed, entry ) {

		// Set direction as a numerical value for easy parsing.
		// Invert connection for RTL sliders, so that the proper
		// handles get the connect/background classes.
		switch ( entry ) {
		  case 'ltr':
			parsed.dir = 0;
			break;
		  case 'rtl':
			parsed.dir = 1;
			parsed.connect = [0,2,1,3][parsed.connect];
			break;
		  default:
			throw new Error("noUiSlider: 'direction' option was not recognized.");
		}
	}

	function testBehaviour ( parsed, entry ) {

		// Make sure the input is a string.
		if ( typeof entry !== 'string' ) {
			throw new Error("noUiSlider: 'behaviour' must be a string containing options.");
		}

		// Check if the string contains any keywords.
		// None are required.
		var tap = entry.indexOf('tap') >= 0,
			drag = entry.indexOf('drag') >= 0,
			fixed = entry.indexOf('fixed') >= 0,
			snap = entry.indexOf('snap') >= 0,
			hover = entry.indexOf('hover') >= 0;

		// Fix #472
		if ( drag && !parsed.connect ) {
			throw new Error("noUiSlider: 'drag' behaviour must be used with 'connect': true.");
		}

		parsed.events = {
			tap: tap || snap,
			drag: drag,
			fixed: fixed,
			snap: snap,
			hover: hover
		};
	}

	function testTooltips ( parsed, entry ) {

		var i;

		if ( entry === false ) {
			return;
		} else if ( entry === true ) {

			parsed.tooltips = [];

			for ( i = 0; i < parsed.handles; i++ ) {
				parsed.tooltips.push(true);
			}

		} else {

			parsed.tooltips = asArray(entry);

			if ( parsed.tooltips.length !== parsed.handles ) {
				throw new Error("noUiSlider: must pass a formatter for all handles.");
			}

			parsed.tooltips.forEach(function(formatter){
				if ( typeof formatter !== 'boolean' && (typeof formatter !== 'object' || typeof formatter.to !== 'function') ) {
					throw new Error("noUiSlider: 'tooltips' must be passed a formatter or 'false'.");
				}
			});
		}
	}

	function testFormat ( parsed, entry ) {

		parsed.format = entry;

		// Any object with a to and from method is supported.
		if ( typeof entry.to === 'function' && typeof entry.from === 'function' ) {
			return true;
		}

		throw new Error("noUiSlider: 'format' requires 'to' and 'from' methods.");
	}

	function testCssPrefix ( parsed, entry ) {

		if ( entry !== undefined && typeof entry !== 'string' && entry !== false ) {
			throw new Error("noUiSlider: 'cssPrefix' must be a string or `false`.");
		}

		parsed.cssPrefix = entry;
	}

	function testCssClasses ( parsed, entry ) {

		if ( entry !== undefined && typeof entry !== 'object' ) {
			throw new Error("noUiSlider: 'cssClasses' must be an object.");
		}

		if ( typeof parsed.cssPrefix === 'string' ) {
			parsed.cssClasses = {};

			for ( var key in entry ) {
				if ( !entry.hasOwnProperty(key) ) { continue; }

				parsed.cssClasses[key] = parsed.cssPrefix + entry[key];
			}
		} else {
			parsed.cssClasses = entry;
		}
	}

	// Test all developer settings and parse to assumption-safe values.
	function testOptions ( options ) {

		// To prove a fix for #537, freeze options here.
		// If the object is modified, an error will be thrown.
		// Object.freeze(options);

		var parsed = {
			margin: 0,
			limit: 0,
			animate: true,
			animationDuration: 300,
			format: defaultFormatter
		}, tests;

		// Tests are executed in the order they are presented here.
		tests = {
			'step': { r: false, t: testStep },
			'start': { r: true, t: testStart },
			'connect': { r: true, t: testConnect },
			'direction': { r: true, t: testDirection },
			'snap': { r: false, t: testSnap },
			'animate': { r: false, t: testAnimate },
			'animationDuration': { r: false, t: testAnimationDuration },
			'range': { r: true, t: testRange },
			'orientation': { r: false, t: testOrientation },
			'margin': { r: false, t: testMargin },
			'limit': { r: false, t: testLimit },
			'behaviour': { r: true, t: testBehaviour },
			'format': { r: false, t: testFormat },
			'tooltips': { r: false, t: testTooltips },
			'cssPrefix': { r: false, t: testCssPrefix },
			'cssClasses': { r: false, t: testCssClasses }
		};

		var defaults = {
			'connect': false,
			'direction': 'ltr',
			'behaviour': 'tap',
			'orientation': 'horizontal',
			'cssPrefix' : 'noUi-',
			'cssClasses': {
				target: 'target',
				base: 'base',
				origin: 'origin',
				handle: 'handle',
				handleLower: 'handle-lower',
				handleUpper: 'handle-upper',
				horizontal: 'horizontal',
				vertical: 'vertical',
				background: 'background',
				connect: 'connect',
				ltr: 'ltr',
				rtl: 'rtl',
				draggable: 'draggable',
				drag: 'state-drag',
				tap: 'state-tap',
				active: 'active',
				stacking: 'stacking',
				tooltip: 'tooltip',
				pips: 'pips',
				pipsHorizontal: 'pips-horizontal',
				pipsVertical: 'pips-vertical',
				marker: 'marker',
				markerHorizontal: 'marker-horizontal',
				markerVertical: 'marker-vertical',
				markerNormal: 'marker-normal',
				markerLarge: 'marker-large',
				markerSub: 'marker-sub',
				value: 'value',
				valueHorizontal: 'value-horizontal',
				valueVertical: 'value-vertical',
				valueNormal: 'value-normal',
				valueLarge: 'value-large',
				valueSub: 'value-sub'
			}
		};

		// Run all options through a testing mechanism to ensure correct
		// input. It should be noted that options might get modified to
		// be handled properly. E.g. wrapping integers in arrays.
		Object.keys(tests).forEach(function( name ){

			// If the option isn't set, but it is required, throw an error.
			if ( options[name] === undefined && defaults[name] === undefined ) {

				if ( tests[name].r ) {
					throw new Error("noUiSlider: '" + name + "' is required.");
				}

				return true;
			}

			tests[name].t( parsed, options[name] === undefined ? defaults[name] : options[name] );
		});

		// Forward pips options
		parsed.pips = options.pips;

		// Pre-define the styles.
		parsed.style = parsed.ort ? 'top' : 'left';

		return parsed;
	}


function closure ( target, options, originalOptions ){
	var
		actions = getActions( ),
		// All variables local to 'closure' are prefixed with 'scope_'
		scope_Target = target,
		scope_Locations = [-1, -1],
		scope_Base,
		scope_Handles,
		scope_Spectrum = options.spectrum,
		scope_Values = [],
		scope_Events = {},
		scope_Self;


	// Delimit proposed values for handle positions.
	function getPositions ( a, b, delimit ) {

		// Add movement to current position.
		var c = a + b[0], d = a + b[1];

		// Only alter the other position on drag,
		// not on standard sliding.
		if ( delimit ) {
			if ( c < 0 ) {
				d += Math.abs(c);
			}
			if ( d > 100 ) {
				c -= ( d - 100 );
			}

			// Limit values to 0 and 100.
			return [limit(c), limit(d)];
		}

		return [c,d];
	}

	// Provide a clean event with standardized offset values.
	function fixEvent ( e, pageOffset ) {

		// Prevent scrolling and panning on touch events, while
		// attempting to slide. The tap event also depends on this.
		e.preventDefault();

		// Filter the event to register the type, which can be
		// touch, mouse or pointer. Offset changes need to be
		// made on an event specific basis.
		var touch = e.type.indexOf('touch') === 0,
			mouse = e.type.indexOf('mouse') === 0,
			pointer = e.type.indexOf('pointer') === 0,
			x,y, event = e;

		// IE10 implemented pointer events with a prefix;
		if ( e.type.indexOf('MSPointer') === 0 ) {
			pointer = true;
		}

		if ( touch ) {
			// noUiSlider supports one movement at a time,
			// so we can select the first 'changedTouch'.
			x = e.changedTouches[0].pageX;
			y = e.changedTouches[0].pageY;
		}

		pageOffset = pageOffset || getPageOffset();

		if ( mouse || pointer ) {
			x = e.clientX + pageOffset.x;
			y = e.clientY + pageOffset.y;
		}

		event.pageOffset = pageOffset;
		event.points = [x, y];
		event.cursor = mouse || pointer; // Fix #435

		return event;
	}

	// Append a handle to the base.
	function addHandle ( direction, index ) {

		var origin = document.createElement('div'),
			handle = document.createElement('div'),
			classModifier = [options.cssClasses.handleLower, options.cssClasses.handleUpper];

		if ( direction ) {
			classModifier.reverse();
		}

		addClass(handle, options.cssClasses.handle);
		addClass(handle, classModifier[index]);

		addClass(origin, options.cssClasses.origin);
		origin.appendChild(handle);

		return origin;
	}

	// Add the proper connection classes.
	function addConnection ( connect, target, handles ) {

		// Apply the required connection classes to the elements
		// that need them. Some classes are made up for several
		// segments listed in the class list, to allow easy
		// renaming and provide a minor compression benefit.
		switch ( connect ) {
			case 1:	addClass(target, options.cssClasses.connect);
					addClass(handles[0], options.cssClasses.background);
					break;
			case 3: addClass(handles[1], options.cssClasses.background);
					/* falls through */
			case 2: addClass(handles[0], options.cssClasses.connect);
					/* falls through */
			case 0: addClass(target, options.cssClasses.background);
					break;
		}
	}

	// Add handles to the slider base.
	function addHandles ( nrHandles, direction, base ) {

		var index, handles = [];

		// Append handles.
		for ( index = 0; index < nrHandles; index += 1 ) {

			// Keep a list of all added handles.
			handles.push( base.appendChild(addHandle( direction, index )) );
		}

		return handles;
	}

	// Initialize a single slider.
	function addSlider ( direction, orientation, target ) {

		// Apply classes and data to the target.
		addClass(target, options.cssClasses.target);

		if ( direction === 0 ) {
			addClass(target, options.cssClasses.ltr);
		} else {
			addClass(target, options.cssClasses.rtl);
		}

		if ( orientation === 0 ) {
			addClass(target, options.cssClasses.horizontal);
		} else {
			addClass(target, options.cssClasses.vertical);
		}

		var div = document.createElement('div');
		addClass(div, options.cssClasses.base);
		target.appendChild(div);
		return div;
	}


	function addTooltip ( handle, index ) {

		if ( !options.tooltips[index] ) {
			return false;
		}

		var element = document.createElement('div');
		element.className = options.cssClasses.tooltip;
		return handle.firstChild.appendChild(element);
	}

	// The tooltips option is a shorthand for using the 'update' event.
	function tooltips ( ) {

		if ( options.dir ) {
			options.tooltips.reverse();
		}

		// Tooltips are added with options.tooltips in original order.
		var tips = scope_Handles.map(addTooltip);

		if ( options.dir ) {
			tips.reverse();
			options.tooltips.reverse();
		}

		bindEvent('update', function(f, o, r) {
			if ( tips[o] ) {
				tips[o].innerHTML = options.tooltips[o] === true ? f[o] : options.tooltips[o].to(r[o]);
			}
		});
	}


	function getGroup ( mode, values, stepped ) {

		// Use the range.
		if ( mode === 'range' || mode === 'steps' ) {
			return scope_Spectrum.xVal;
		}

		if ( mode === 'count' ) {

			// Divide 0 - 100 in 'count' parts.
			var spread = ( 100 / (values-1) ), v, i = 0;
			values = [];

			// List these parts and have them handled as 'positions'.
			while ((v=i++*spread) <= 100 ) {
				values.push(v);
			}

			mode = 'positions';
		}

		if ( mode === 'positions' ) {

			// Map all percentages to on-range values.
			return values.map(function( value ){
				return scope_Spectrum.fromStepping( stepped ? scope_Spectrum.getStep( value ) : value );
			});
		}

		if ( mode === 'values' ) {

			// If the value must be stepped, it needs to be converted to a percentage first.
			if ( stepped ) {

				return values.map(function( value ){

					// Convert to percentage, apply step, return to value.
					return scope_Spectrum.fromStepping( scope_Spectrum.getStep( scope_Spectrum.toStepping( value ) ) );
				});

			}

			// Otherwise, we can simply use the values.
			return values;
		}
	}

	function generateSpread ( density, mode, group ) {

		function safeIncrement(value, increment) {
			// Avoid floating point variance by dropping the smallest decimal places.
			return (value + increment).toFixed(7) / 1;
		}

		var originalSpectrumDirection = scope_Spectrum.direction,
			indexes = {},
			firstInRange = scope_Spectrum.xVal[0],
			lastInRange = scope_Spectrum.xVal[scope_Spectrum.xVal.length-1],
			ignoreFirst = false,
			ignoreLast = false,
			prevPct = 0;

		// This function loops the spectrum in an ltr linear fashion,
		// while the toStepping method is direction aware. Trick it into
		// believing it is ltr.
		scope_Spectrum.direction = 0;

		// Create a copy of the group, sort it and filter away all duplicates.
		group = unique(group.slice().sort(function(a, b){ return a - b; }));

		// Make sure the range starts with the first element.
		if ( group[0] !== firstInRange ) {
			group.unshift(firstInRange);
			ignoreFirst = true;
		}

		// Likewise for the last one.
		if ( group[group.length - 1] !== lastInRange ) {
			group.push(lastInRange);
			ignoreLast = true;
		}

		group.forEach(function ( current, index ) {

			// Get the current step and the lower + upper positions.
			var step, i, q,
				low = current,
				high = group[index+1],
				newPct, pctDifference, pctPos, type,
				steps, realSteps, stepsize;

			// When using 'steps' mode, use the provided steps.
			// Otherwise, we'll step on to the next subrange.
			if ( mode === 'steps' ) {
				step = scope_Spectrum.xNumSteps[ index ];
			}

			// Default to a 'full' step.
			if ( !step ) {
				step = high-low;
			}

			// Low can be 0, so test for false. If high is undefined,
			// we are at the last subrange. Index 0 is already handled.
			if ( low === false || high === undefined ) {
				return;
			}

			// Find all steps in the subrange.
			for ( i = low; i <= high; i = safeIncrement(i, step) ) {

				// Get the percentage value for the current step,
				// calculate the size for the subrange.
				newPct = scope_Spectrum.toStepping( i );
				pctDifference = newPct - prevPct;

				steps = pctDifference / density;
				realSteps = Math.round(steps);

				// This ratio represents the ammount of percentage-space a point indicates.
				// For a density 1 the points/percentage = 1. For density 2, that percentage needs to be re-devided.
				// Round the percentage offset to an even number, then divide by two
				// to spread the offset on both sides of the range.
				stepsize = pctDifference/realSteps;

				// Divide all points evenly, adding the correct number to this subrange.
				// Run up to <= so that 100% gets a point, event if ignoreLast is set.
				for ( q = 1; q <= realSteps; q += 1 ) {

					// The ratio between the rounded value and the actual size might be ~1% off.
					// Correct the percentage offset by the number of points
					// per subrange. density = 1 will result in 100 points on the
					// full range, 2 for 50, 4 for 25, etc.
					pctPos = prevPct + ( q * stepsize );
					indexes[pctPos.toFixed(5)] = ['x', 0];
				}

				// Determine the point type.
				type = (group.indexOf(i) > -1) ? 1 : ( mode === 'steps' ? 2 : 0 );

				// Enforce the 'ignoreFirst' option by overwriting the type for 0.
				if ( !index && ignoreFirst ) {
					type = 0;
				}

				if ( !(i === high && ignoreLast)) {
					// Mark the 'type' of this point. 0 = plain, 1 = real value, 2 = step value.
					indexes[newPct.toFixed(5)] = [i, type];
				}

				// Update the percentage count.
				prevPct = newPct;
			}
		});

		// Reset the spectrum.
		scope_Spectrum.direction = originalSpectrumDirection;

		return indexes;
	}

	function addMarking ( spread, filterFunc, formatter ) {

		var element = document.createElement('div'),
			out = '',
			valueSizeClasses = [
				options.cssClasses.valueNormal,
				options.cssClasses.valueLarge,
				options.cssClasses.valueSub
			],
			markerSizeClasses = [
				options.cssClasses.markerNormal,
				options.cssClasses.markerLarge,
				options.cssClasses.markerSub
			],
			valueOrientationClasses = [
				options.cssClasses.valueHorizontal,
				options.cssClasses.valueVertical
			],
			markerOrientationClasses = [
				options.cssClasses.markerHorizontal,
				options.cssClasses.markerVertical
			];

		addClass(element, options.cssClasses.pips);
		addClass(element, options.ort === 0 ? options.cssClasses.pipsHorizontal : options.cssClasses.pipsVertical);

		function getClasses( type, source ){
			var a = source === options.cssClasses.value,
				orientationClasses = a ? valueOrientationClasses : markerOrientationClasses,
				sizeClasses = a ? valueSizeClasses : markerSizeClasses;

			return source + ' ' + orientationClasses[options.ort] + ' ' + sizeClasses[type];
		}

		function getTags( offset, source, values ) {
			return 'class="' + getClasses(values[1], source) + '" style="' + options.style + ': ' + offset + '%"';
		}

		function addSpread ( offset, values ){

			if ( scope_Spectrum.direction ) {
				offset = 100 - offset;
			}

			// Apply the filter function, if it is set.
			values[1] = (values[1] && filterFunc) ? filterFunc(values[0], values[1]) : values[1];

			// Add a marker for every point
			out += '<div ' + getTags(offset, options.cssClasses.marker, values) + '></div>';

			// Values are only appended for points marked '1' or '2'.
			if ( values[1] ) {
				out += '<div ' + getTags(offset, options.cssClasses.value, values) + '>' + formatter.to(values[0]) + '</div>';
			}
		}

		// Append all points.
		Object.keys(spread).forEach(function(a){
			addSpread(a, spread[a]);
		});

		element.innerHTML = out;

		return element;
	}

	function pips ( grid ) {

	var mode = grid.mode,
		density = grid.density || 1,
		filter = grid.filter || false,
		values = grid.values || false,
		stepped = grid.stepped || false,
		group = getGroup( mode, values, stepped ),
		spread = generateSpread( density, mode, group ),
		format = grid.format || {
			to: Math.round
		};

		return scope_Target.appendChild(addMarking(
			spread,
			filter,
			format
		));
	}


	// Shorthand for base dimensions.
	function baseSize ( ) {
		var rect = scope_Base.getBoundingClientRect(), alt = 'offset' + ['Width', 'Height'][options.ort];
		return options.ort === 0 ? (rect.width||scope_Base[alt]) : (rect.height||scope_Base[alt]);
	}

	// External event handling
	function fireEvent ( event, handleNumber, tap ) {

		var i;

		// During initialization, do not fire events.
		for ( i = 0; i < options.handles; i++ ) {
			if ( scope_Locations[i] === -1 ) {
				return;
			}
		}

		if ( handleNumber !== undefined && options.handles !== 1 ) {
			handleNumber = Math.abs(handleNumber - options.dir);
		}

		Object.keys(scope_Events).forEach(function( targetEvent ) {

			var eventType = targetEvent.split('.')[0];

			if ( event === eventType ) {
				scope_Events[targetEvent].forEach(function( callback ) {

					callback.call(
						// Use the slider public API as the scope ('this')
						scope_Self,
						// Return values as array, so arg_1[arg_2] is always valid.
						asArray(valueGet()),
						// Handle index, 0 or 1
						handleNumber,
						// Unformatted slider values
						asArray(inSliderOrder(Array.prototype.slice.call(scope_Values))),
						// Event is fired by tap, true or false
						tap || false,
						// Left offset of the handle, in relation to the slider
						scope_Locations
					);
				});
			}
		});
	}

	// Returns the input array, respecting the slider direction configuration.
	function inSliderOrder ( values ) {

		// If only one handle is used, return a single value.
		if ( values.length === 1 ){
			return values[0];
		}

		if ( options.dir ) {
			return values.reverse();
		}

		return values;
	}


	// Handler for attaching events trough a proxy.
	function attach ( events, element, callback, data ) {

		// This function can be used to 'filter' events to the slider.
		// element is a node, not a nodeList

		var method = function ( e ){

			if ( scope_Target.hasAttribute('disabled') ) {
				return false;
			}

			// Stop if an active 'tap' transition is taking place.
			if ( hasClass(scope_Target, options.cssClasses.tap) ) {
				return false;
			}

			e = fixEvent(e, data.pageOffset);

			// Ignore right or middle clicks on start #454
			if ( events === actions.start && e.buttons !== undefined && e.buttons > 1 ) {
				return false;
			}

			// Ignore right or middle clicks on start #454
			if ( data.hover && e.buttons ) {
				return false;
			}

			e.calcPoint = e.points[ options.ort ];

			// Call the event handler with the event [ and additional data ].
			callback ( e, data );

		}, methods = [];

		// Bind a closure on the target for every event type.
		events.split(' ').forEach(function( eventName ){
			element.addEventListener(eventName, method, false);
			methods.push([eventName, method]);
		});

		return methods;
	}

	// Handle movement on document for handle and range drag.
	function move ( event, data ) {

		// Fix #498
		// Check value of .buttons in 'start' to work around a bug in IE10 mobile (data.buttonsProperty).
		// https://connect.microsoft.com/IE/feedback/details/927005/mobile-ie10-windows-phone-buttons-property-of-pointermove-event-always-zero
		// IE9 has .buttons and .which zero on mousemove.
		// Firefox breaks the spec MDN defines.
		if ( navigator.appVersion.indexOf("MSIE 9") === -1 && event.buttons === 0 && data.buttonsProperty !== 0 ) {
			return end(event, data);
		}

		var handles = data.handles || scope_Handles, positions, state = false,
			proposal = ((event.calcPoint - data.start) * 100) / data.baseSize,
			handleNumber = handles[0] === scope_Handles[0] ? 0 : 1, i;

		// Calculate relative positions for the handles.
		positions = getPositions( proposal, data.positions, handles.length > 1);

		state = setHandle ( handles[0], positions[handleNumber], handles.length === 1 );

		if ( handles.length > 1 ) {

			state = setHandle ( handles[1], positions[handleNumber?0:1], false ) || state;

			if ( state ) {
				// fire for both handles
				for ( i = 0; i < data.handles.length; i++ ) {
					fireEvent('slide', i);
				}
			}
		} else if ( state ) {
			// Fire for a single handle
			fireEvent('slide', handleNumber);
		}
	}

	// Unbind move events on document, call callbacks.
	function end ( event, data ) {

		// The handle is no longer active, so remove the class.
		var active = scope_Base.querySelector( '.' + options.cssClasses.active ),
			handleNumber = data.handles[0] === scope_Handles[0] ? 0 : 1;

		if ( active !== null ) {
			removeClass(active, options.cssClasses.active);
		}

		// Remove cursor styles and text-selection events bound to the body.
		if ( event.cursor ) {
			document.body.style.cursor = '';
			document.body.removeEventListener('selectstart', document.body.noUiListener);
		}

		var d = document.documentElement;

		// Unbind the move and end events, which are added on 'start'.
		d.noUiListeners.forEach(function( c ) {
			d.removeEventListener(c[0], c[1]);
		});

		// Remove dragging class.
		removeClass(scope_Target, options.cssClasses.drag);

		// Fire the change and set events.
		fireEvent('set', handleNumber);
		fireEvent('change', handleNumber);

		// If this is a standard handle movement, fire the end event.
		if ( data.handleNumber !== undefined ) {
			fireEvent('end', data.handleNumber);
		}
	}

	// Fire 'end' when a mouse or pen leaves the document.
	function documentLeave ( event, data ) {
		if ( event.type === "mouseout" && event.target.nodeName === "HTML" && event.relatedTarget === null ){
			end ( event, data );
		}
	}

	// Bind move events on document.
	function start ( event, data ) {

		var d = document.documentElement;

		// Mark the handle as 'active' so it can be styled.
		if ( data.handles.length === 1 ) {
			// Support 'disabled' handles
			if ( data.handles[0].hasAttribute('disabled') ) {
				return false;
			}

			addClass(data.handles[0].children[0], options.cssClasses.active);
		}

		// Fix #551, where a handle gets selected instead of dragged.
		event.preventDefault();

		// A drag should never propagate up to the 'tap' event.
		event.stopPropagation();

		// Attach the move and end events.
		var moveEvent = attach(actions.move, d, move, {
			start: event.calcPoint,
			baseSize: baseSize(),
			pageOffset: event.pageOffset,
			handles: data.handles,
			handleNumber: data.handleNumber,
			buttonsProperty: event.buttons,
			positions: [
				scope_Locations[0],
				scope_Locations[scope_Handles.length - 1]
			]
		}), endEvent = attach(actions.end, d, end, {
			handles: data.handles,
			handleNumber: data.handleNumber
		});

		var outEvent = attach("mouseout", d, documentLeave, {
			handles: data.handles,
			handleNumber: data.handleNumber
		});

		d.noUiListeners = moveEvent.concat(endEvent, outEvent);

		// Text selection isn't an issue on touch devices,
		// so adding cursor styles can be skipped.
		if ( event.cursor ) {

			// Prevent the 'I' cursor and extend the range-drag cursor.
			document.body.style.cursor = getComputedStyle(event.target).cursor;

			// Mark the target with a dragging state.
			if ( scope_Handles.length > 1 ) {
				addClass(scope_Target, options.cssClasses.drag);
			}

			var f = function(){
				return false;
			};

			document.body.noUiListener = f;

			// Prevent text selection when dragging the handles.
			document.body.addEventListener('selectstart', f, false);
		}

		if ( data.handleNumber !== undefined ) {
			fireEvent('start', data.handleNumber);
		}
	}

	// Move closest handle to tapped location.
	function tap ( event ) {

		var location = event.calcPoint, total = 0, handleNumber, to;

		// The tap event shouldn't propagate up and cause 'edge' to run.
		event.stopPropagation();

		// Add up the handle offsets.
		scope_Handles.forEach(function(a){
			total += offset(a)[ options.style ];
		});

		// Find the handle closest to the tapped position.
		handleNumber = ( location < total/2 || scope_Handles.length === 1 ) ? 0 : 1;

		// Check if handler is not disablet if yes set number to the next handler
		if (scope_Handles[handleNumber].hasAttribute('disabled')) {
			handleNumber = handleNumber ? 0 : 1;
		}

		location -= offset(scope_Base)[ options.style ];

		// Calculate the new position.
		to = ( location * 100 ) / baseSize();

		if ( !options.events.snap ) {
			// Flag the slider as it is now in a transitional state.
			// Transition takes a configurable amount of ms (default 300). Re-enable the slider after that.
			addClassFor( scope_Target, options.cssClasses.tap, options.animationDuration );
		}

		// Support 'disabled' handles
		if ( scope_Handles[handleNumber].hasAttribute('disabled') ) {
			return false;
		}

		// Find the closest handle and calculate the tapped point.
		// The set handle to the new position.
		setHandle( scope_Handles[handleNumber], to );

		fireEvent('slide', handleNumber, true);
		fireEvent('set', handleNumber, true);
		fireEvent('change', handleNumber, true);

		if ( options.events.snap ) {
			start(event, { handles: [scope_Handles[handleNumber]] });
		}
	}

	// Fires a 'hover' event for a hovered mouse/pen position.
	function hover ( event ) {

		var location = event.calcPoint - offset(scope_Base)[ options.style ],
			to = scope_Spectrum.getStep(( location * 100 ) / baseSize()),
			value = scope_Spectrum.fromStepping( to );

		Object.keys(scope_Events).forEach(function( targetEvent ) {
			if ( 'hover' === targetEvent.split('.')[0] ) {
				scope_Events[targetEvent].forEach(function( callback ) {
					callback.call( scope_Self, value );
				});
			}
		});
	}

	// Attach events to several slider parts.
	function events ( behaviour ) {

		// Attach the standard drag event to the handles.
		if ( !behaviour.fixed ) {

			scope_Handles.forEach(function( handle, index ){

				// These events are only bound to the visual handle
				// element, not the 'real' origin element.
				attach ( actions.start, handle.children[0], start, {
					handles: [ handle ],
					handleNumber: index
				});
			});
		}

		// Attach the tap event to the slider base.
		if ( behaviour.tap ) {

			attach ( actions.start, scope_Base, tap, {
				handles: scope_Handles
			});
		}

		// Fire hover events
		if ( behaviour.hover ) {
			attach ( actions.move, scope_Base, hover, { hover: true } );
		}

		// Make the range draggable.
		if ( behaviour.drag ){

			var drag = [scope_Base.querySelector( '.' + options.cssClasses.connect )];
			addClass(drag[0], options.cssClasses.draggable);

			// When the range is fixed, the entire range can
			// be dragged by the handles. The handle in the first
			// origin will propagate the start event upward,
			// but it needs to be bound manually on the other.
			if ( behaviour.fixed ) {
				drag.push(scope_Handles[(drag[0] === scope_Handles[0] ? 1 : 0)].children[0]);
			}

			drag.forEach(function( element ) {
				attach ( actions.start, element, start, {
					handles: scope_Handles
				});
			});
		}
	}


	// Test suggested values and apply margin, step.
	function setHandle ( handle, to, noLimitOption ) {

		var trigger = handle !== scope_Handles[0] ? 1 : 0,
			lowerMargin = scope_Locations[0] + options.margin,
			upperMargin = scope_Locations[1] - options.margin,
			lowerLimit = scope_Locations[0] + options.limit,
			upperLimit = scope_Locations[1] - options.limit;

		// For sliders with multiple handles,
		// limit movement to the other handle.
		// Apply the margin option by adding it to the handle positions.
		if ( scope_Handles.length > 1 ) {
			to = trigger ? Math.max( to, lowerMargin ) : Math.min( to, upperMargin );
		}

		// The limit option has the opposite effect, limiting handles to a
		// maximum distance from another. Limit must be > 0, as otherwise
		// handles would be unmoveable. 'noLimitOption' is set to 'false'
		// for the .val() method, except for pass 4/4.
		if ( noLimitOption !== false && options.limit && scope_Handles.length > 1 ) {
			to = trigger ? Math.min ( to, lowerLimit ) : Math.max( to, upperLimit );
		}

		// Handle the step option.
		to = scope_Spectrum.getStep( to );

		// Limit percentage to the 0 - 100 range
		to = limit(to);

		// Return false if handle can't move
		if ( to === scope_Locations[trigger] ) {
			return false;
		}

		// Set the handle to the new position.
		// Use requestAnimationFrame for efficient painting.
		// No significant effect in Chrome, Edge sees dramatic
		// performace improvements.
		if ( window.requestAnimationFrame ) {
			window.requestAnimationFrame(function(){
				handle.style[options.style] = to + '%';
			});
		} else {
			handle.style[options.style] = to + '%';
		}

		// Force proper handle stacking
		if ( !handle.previousSibling ) {
			removeClass(handle, options.cssClasses.stacking);
			if ( to > 50 ) {
				addClass(handle, options.cssClasses.stacking);
			}
		}

		// Update locations.
		scope_Locations[trigger] = to;

		// Convert the value to the slider stepping/range.
		scope_Values[trigger] = scope_Spectrum.fromStepping( to );

		fireEvent('update', trigger);

		return true;
	}

	// Loop values from value method and apply them.
	function setValues ( count, values ) {

		var i, trigger, to;

		// With the limit option, we'll need another limiting pass.
		if ( options.limit ) {
			count += 1;
		}

		// If there are multiple handles to be set run the setting
		// mechanism twice for the first handle, to make sure it
		// can be bounced of the second one properly.
		for ( i = 0; i < count; i += 1 ) {

			trigger = i%2;

			// Get the current argument from the array.
			to = values[trigger];

			// Setting with null indicates an 'ignore'.
			// Inputting 'false' is invalid.
			if ( to !== null && to !== false ) {

				// If a formatted number was passed, attemt to decode it.
				if ( typeof to === 'number' ) {
					to = String(to);
				}

				to = options.format.from( to );

				// Request an update for all links if the value was invalid.
				// Do so too if setting the handle fails.
				if ( to === false || isNaN(to) || setHandle( scope_Handles[trigger], scope_Spectrum.toStepping( to ), i === (3 - options.dir) ) === false ) {
					fireEvent('update', trigger);
				}
			}
		}
	}

	// Set the slider value.
	function valueSet ( input, fireSetEvent ) {

		var count, values = asArray( input ), i;

		// Event fires by default
		fireSetEvent = (fireSetEvent === undefined ? true : !!fireSetEvent);

		// The RTL settings is implemented by reversing the front-end,
		// internal mechanisms are the same.
		if ( options.dir && options.handles > 1 ) {
			values.reverse();
		}

		// Animation is optional.
		// Make sure the initial values where set before using animated placement.
		if ( options.animate && scope_Locations[0] !== -1 ) {
			addClassFor( scope_Target, options.cssClasses.tap, options.animationDuration );
		}

		// Determine how often to set the handles.
		count = scope_Handles.length > 1 ? 3 : 1;

		if ( values.length === 1 ) {
			count = 1;
		}

		setValues ( count, values );

		// Fire the 'set' event for both handles.
		for ( i = 0; i < scope_Handles.length; i++ ) {

			// Fire the event only for handles that received a new value, as per #579
			if ( values[i] !== null && fireSetEvent ) {
				fireEvent('set', i);
			}
		}
	}

	// Get the slider value.
	function valueGet ( ) {

		var i, retour = [];

		// Get the value from all handles.
		for ( i = 0; i < options.handles; i += 1 ){
			retour[i] = options.format.to( scope_Values[i] );
		}

		return inSliderOrder( retour );
	}

	// Removes classes from the root and empties it.
	function destroy ( ) {

		for ( var key in options.cssClasses ) {
			if ( !options.cssClasses.hasOwnProperty(key) ) { continue; }
			removeClass(scope_Target, options.cssClasses[key]);
		}

		while (scope_Target.firstChild) {
			scope_Target.removeChild(scope_Target.firstChild);
		}

		delete scope_Target.noUiSlider;
	}

	// Get the current step size for the slider.
	function getCurrentStep ( ) {

		// Check all locations, map them to their stepping point.
		// Get the step point, then find it in the input list.
		var retour = scope_Locations.map(function( location, index ){

			var step = scope_Spectrum.getApplicableStep( location ),

				// As per #391, the comparison for the decrement step can have some rounding issues.
				// Round the value to the precision used in the step.
				stepDecimals = countDecimals(String(step[2])),

				// Get the current numeric value
				value = scope_Values[index],

				// To move the slider 'one step up', the current step value needs to be added.
				// Use null if we are at the maximum slider value.
				increment = location === 100 ? null : step[2],

				// Going 'one step down' might put the slider in a different sub-range, so we
				// need to switch between the current or the previous step.
				prev = Number((value - step[2]).toFixed(stepDecimals)),

				// If the value fits the step, return the current step value. Otherwise, use the
				// previous step. Return null if the slider is at its minimum value.
				decrement = location === 0 ? null : (prev >= step[1]) ? step[2] : (step[0] || false);

			return [decrement, increment];
		});

		// Return values in the proper order.
		return inSliderOrder( retour );
	}

	// Attach an event to this slider, possibly including a namespace
	function bindEvent ( namespacedEvent, callback ) {
		scope_Events[namespacedEvent] = scope_Events[namespacedEvent] || [];
		scope_Events[namespacedEvent].push(callback);

		// If the event bound is 'update,' fire it immediately for all handles.
		if ( namespacedEvent.split('.')[0] === 'update' ) {
			scope_Handles.forEach(function(a, index){
				fireEvent('update', index);
			});
		}
	}

	// Undo attachment of event
	function removeEvent ( namespacedEvent ) {

		var event = namespacedEvent && namespacedEvent.split('.')[0],
			namespace = event && namespacedEvent.substring(event.length);

		Object.keys(scope_Events).forEach(function( bind ){

			var tEvent = bind.split('.')[0],
				tNamespace = bind.substring(tEvent.length);

			if ( (!event || event === tEvent) && (!namespace || namespace === tNamespace) ) {
				delete scope_Events[bind];
			}
		});
	}

	// Updateable: margin, limit, step, range, animate, snap
	function updateOptions ( optionsToUpdate, fireSetEvent ) {

		// Spectrum is created using the range, snap, direction and step options.
		// 'snap' and 'step' can be updated, 'direction' cannot, due to event binding.
		// If 'snap' and 'step' are not passed, they should remain unchanged.
		var v = valueGet(), newOptions = testOptions({
			start: [0, 0],
			margin: optionsToUpdate.margin,
			limit: optionsToUpdate.limit,
			step: optionsToUpdate.step === undefined ? options.singleStep : optionsToUpdate.step,
			range: optionsToUpdate.range,
			animate: optionsToUpdate.animate,
			snap: optionsToUpdate.snap === undefined ? options.snap : optionsToUpdate.snap
		});

		['margin', 'limit', 'range', 'animate'].forEach(function(name){

			// Only change options that we're actually passed to update.
			if ( optionsToUpdate[name] !== undefined ) {
				options[name] = optionsToUpdate[name];
			}
		});

		// Save current spectrum direction as testOptions in testRange call
		// doesn't rely on current direction
		newOptions.spectrum.direction = scope_Spectrum.direction;
		scope_Spectrum = newOptions.spectrum;

		// Invalidate the current positioning so valueSet forces an update.
		scope_Locations = [-1, -1];
		valueSet(optionsToUpdate.start || v, fireSetEvent);
	}


	// Throw an error if the slider was already initialized.
	if ( scope_Target.noUiSlider ) {
		throw new Error('Slider was already initialized.');
	}

	// Create the base element, initialise HTML and set classes.
	// Add handles and links.
	scope_Base = addSlider( options.dir, options.ort, scope_Target );
	scope_Handles = addHandles( options.handles, options.dir, scope_Base );

	// Set the connect classes.
	addConnection ( options.connect, scope_Target, scope_Handles );

	if ( options.pips ) {
		pips(options.pips);
	}

	if ( options.tooltips ) {
		tooltips();
	}

	scope_Self = {
		destroy: destroy,
		steps: getCurrentStep,
		on: bindEvent,
		off: removeEvent,
		get: valueGet,
		set: valueSet,
		updateOptions: updateOptions,
		options: originalOptions, // Issue #600
		target: scope_Target, // Issue #597
		pips: pips // Issue #594
	};

	// Attach user events.
	events( options.events );

	return scope_Self;

}


	// Run the standard initializer
	function initialize ( target, originalOptions ) {

		if ( !target.nodeName ) {
			throw new Error('noUiSlider.create requires a single element.');
		}

		// Test the options and create the slider environment;
		var options = testOptions( originalOptions, target ),
			slider = closure( target, options, originalOptions );

		// Use the public value method to set the start values.
		slider.set(options.start);

		target.noUiSlider = slider;
		return slider;
	}

	// Use an object instead of a function for future expansibility;
	return {
		create: initialize
	};

}));
},{}],39:[function(require,module,exports){
var mgrs = require('mgrs');

function Point(x, y, z) {
  if (!(this instanceof Point)) {
    return new Point(x, y, z);
  }
  if (Array.isArray(x)) {
    this.x = x[0];
    this.y = x[1];
    this.z = x[2] || 0.0;
  } else if(typeof x === 'object') {
    this.x = x.x;
    this.y = x.y;
    this.z = x.z || 0.0;
  } else if (typeof x === 'string' && typeof y === 'undefined') {
    var coords = x.split(',');
    this.x = parseFloat(coords[0], 10);
    this.y = parseFloat(coords[1], 10);
    this.z = parseFloat(coords[2], 10) || 0.0;
  } else {
    this.x = x;
    this.y = y;
    this.z = z || 0.0;
  }
  console.warn('proj4.Point will be removed in version 3, use proj4.toPoint');
}

Point.fromMGRS = function(mgrsStr) {
  return new Point(mgrs.toPoint(mgrsStr));
};
Point.prototype.toMGRS = function(accuracy) {
  return mgrs.forward([this.x, this.y], accuracy);
};
module.exports = Point;

},{"mgrs":37}],40:[function(require,module,exports){
var parseCode = require("./parseCode");
var extend = require('./extend');
var projections = require('./projections');
var deriveConstants = require('./deriveConstants');

function Projection(srsCode,callback) {
  if (!(this instanceof Projection)) {
    return new Projection(srsCode);
  }
  callback = callback || function(error){
    if(error){
      throw error;
    }
  };
  var json = parseCode(srsCode);
  if(typeof json !== 'object'){
    callback(srsCode);
    return;
  }
  var modifiedJSON = deriveConstants(json);
  var ourProj = Projection.projections.get(modifiedJSON.projName);
  if(ourProj){
    extend(this, modifiedJSON);
    extend(this, ourProj);
    this.init();
    callback(null, this);
  }else{
    callback(srsCode);
  }
}
Projection.projections = projections;
Projection.projections.start();
module.exports = Projection;

},{"./deriveConstants":71,"./extend":72,"./parseCode":76,"./projections":78}],41:[function(require,module,exports){
module.exports = function(crs, denorm, point) {
  var xin = point.x,
    yin = point.y,
    zin = point.z || 0.0;
  var v, t, i;
  for (i = 0; i < 3; i++) {
    if (denorm && i === 2 && point.z === undefined) {
      continue;
    }
    if (i === 0) {
      v = xin;
      t = 'x';
    }
    else if (i === 1) {
      v = yin;
      t = 'y';
    }
    else {
      v = zin;
      t = 'z';
    }
    switch (crs.axis[i]) {
    case 'e':
      point[t] = v;
      break;
    case 'w':
      point[t] = -v;
      break;
    case 'n':
      point[t] = v;
      break;
    case 's':
      point[t] = -v;
      break;
    case 'u':
      if (point[t] !== undefined) {
        point.z = v;
      }
      break;
    case 'd':
      if (point[t] !== undefined) {
        point.z = -v;
      }
      break;
    default:
      //console.log("ERROR: unknow axis ("+crs.axis[i]+") - check definition of "+crs.projName);
      return null;
    }
  }
  return point;
};

},{}],42:[function(require,module,exports){
var HALF_PI = Math.PI/2;
var sign = require('./sign');

module.exports = function(x) {
  return (Math.abs(x) < HALF_PI) ? x : (x - (sign(x) * Math.PI));
};
},{"./sign":59}],43:[function(require,module,exports){
var TWO_PI = Math.PI * 2;
// SPI is slightly greater than Math.PI, so values that exceed the -180..180
// degree range by a tiny amount don't get wrapped. This prevents points that
// have drifted from their original location along the 180th meridian (due to
// floating point error) from changing their sign.
var SPI = 3.14159265359;
var sign = require('./sign');

module.exports = function(x) {
  return (Math.abs(x) <= SPI) ? x : (x - (sign(x) * TWO_PI));
};
},{"./sign":59}],44:[function(require,module,exports){
module.exports = function(x) {
  if (Math.abs(x) > 1) {
    x = (x > 1) ? 1 : -1;
  }
  return Math.asin(x);
};
},{}],45:[function(require,module,exports){
module.exports = function(x) {
  return (1 - 0.25 * x * (1 + x / 16 * (3 + 1.25 * x)));
};
},{}],46:[function(require,module,exports){
module.exports = function(x) {
  return (0.375 * x * (1 + 0.25 * x * (1 + 0.46875 * x)));
};
},{}],47:[function(require,module,exports){
module.exports = function(x) {
  return (0.05859375 * x * x * (1 + 0.75 * x));
};
},{}],48:[function(require,module,exports){
module.exports = function(x) {
  return (x * x * x * (35 / 3072));
};
},{}],49:[function(require,module,exports){
module.exports = function(a, e, sinphi) {
  var temp = e * sinphi;
  return a / Math.sqrt(1 - temp * temp);
};
},{}],50:[function(require,module,exports){
module.exports = function(ml, e0, e1, e2, e3) {
  var phi;
  var dphi;

  phi = ml / e0;
  for (var i = 0; i < 15; i++) {
    dphi = (ml - (e0 * phi - e1 * Math.sin(2 * phi) + e2 * Math.sin(4 * phi) - e3 * Math.sin(6 * phi))) / (e0 - 2 * e1 * Math.cos(2 * phi) + 4 * e2 * Math.cos(4 * phi) - 6 * e3 * Math.cos(6 * phi));
    phi += dphi;
    if (Math.abs(dphi) <= 0.0000000001) {
      return phi;
    }
  }

  //..reportError("IMLFN-CONV:Latitude failed to converge after 15 iterations");
  return NaN;
};
},{}],51:[function(require,module,exports){
var HALF_PI = Math.PI/2;

module.exports = function(eccent, q) {
  var temp = 1 - (1 - eccent * eccent) / (2 * eccent) * Math.log((1 - eccent) / (1 + eccent));
  if (Math.abs(Math.abs(q) - temp) < 1.0E-6) {
    if (q < 0) {
      return (-1 * HALF_PI);
    }
    else {
      return HALF_PI;
    }
  }
  //var phi = 0.5* q/(1-eccent*eccent);
  var phi = Math.asin(0.5 * q);
  var dphi;
  var sin_phi;
  var cos_phi;
  var con;
  for (var i = 0; i < 30; i++) {
    sin_phi = Math.sin(phi);
    cos_phi = Math.cos(phi);
    con = eccent * sin_phi;
    dphi = Math.pow(1 - con * con, 2) / (2 * cos_phi) * (q / (1 - eccent * eccent) - sin_phi / (1 - con * con) + 0.5 / eccent * Math.log((1 - con) / (1 + con)));
    phi += dphi;
    if (Math.abs(dphi) <= 0.0000000001) {
      return phi;
    }
  }

  //console.log("IQSFN-CONV:Latitude failed to converge after 30 iterations");
  return NaN;
};
},{}],52:[function(require,module,exports){
module.exports = function(e0, e1, e2, e3, phi) {
  return (e0 * phi - e1 * Math.sin(2 * phi) + e2 * Math.sin(4 * phi) - e3 * Math.sin(6 * phi));
};
},{}],53:[function(require,module,exports){
module.exports = function(eccent, sinphi, cosphi) {
  var con = eccent * sinphi;
  return cosphi / (Math.sqrt(1 - con * con));
};
},{}],54:[function(require,module,exports){
var HALF_PI = Math.PI/2;
module.exports = function(eccent, ts) {
  var eccnth = 0.5 * eccent;
  var con, dphi;
  var phi = HALF_PI - 2 * Math.atan(ts);
  for (var i = 0; i <= 15; i++) {
    con = eccent * Math.sin(phi);
    dphi = HALF_PI - 2 * Math.atan(ts * (Math.pow(((1 - con) / (1 + con)), eccnth))) - phi;
    phi += dphi;
    if (Math.abs(dphi) <= 0.0000000001) {
      return phi;
    }
  }
  //console.log("phi2z has NoConvergence");
  return -9999;
};
},{}],55:[function(require,module,exports){
var C00 = 1;
var C02 = 0.25;
var C04 = 0.046875;
var C06 = 0.01953125;
var C08 = 0.01068115234375;
var C22 = 0.75;
var C44 = 0.46875;
var C46 = 0.01302083333333333333;
var C48 = 0.00712076822916666666;
var C66 = 0.36458333333333333333;
var C68 = 0.00569661458333333333;
var C88 = 0.3076171875;

module.exports = function(es) {
  var en = [];
  en[0] = C00 - es * (C02 + es * (C04 + es * (C06 + es * C08)));
  en[1] = es * (C22 - es * (C04 + es * (C06 + es * C08)));
  var t = es * es;
  en[2] = t * (C44 - es * (C46 + es * C48));
  t *= es;
  en[3] = t * (C66 - es * C68);
  en[4] = t * es * C88;
  return en;
};
},{}],56:[function(require,module,exports){
var pj_mlfn = require("./pj_mlfn");
var EPSLN = 1.0e-10;
var MAX_ITER = 20;
module.exports = function(arg, es, en) {
  var k = 1 / (1 - es);
  var phi = arg;
  for (var i = MAX_ITER; i; --i) { /* rarely goes over 2 iterations */
    var s = Math.sin(phi);
    var t = 1 - es * s * s;
    //t = this.pj_mlfn(phi, s, Math.cos(phi), en) - arg;
    //phi -= t * (t * Math.sqrt(t)) * k;
    t = (pj_mlfn(phi, s, Math.cos(phi), en) - arg) * (t * Math.sqrt(t)) * k;
    phi -= t;
    if (Math.abs(t) < EPSLN) {
      return phi;
    }
  }
  //..reportError("cass:pj_inv_mlfn: Convergence error");
  return phi;
};
},{"./pj_mlfn":57}],57:[function(require,module,exports){
module.exports = function(phi, sphi, cphi, en) {
  cphi *= sphi;
  sphi *= sphi;
  return (en[0] * phi - cphi * (en[1] + sphi * (en[2] + sphi * (en[3] + sphi * en[4]))));
};
},{}],58:[function(require,module,exports){
module.exports = function(eccent, sinphi) {
  var con;
  if (eccent > 1.0e-7) {
    con = eccent * sinphi;
    return ((1 - eccent * eccent) * (sinphi / (1 - con * con) - (0.5 / eccent) * Math.log((1 - con) / (1 + con))));
  }
  else {
    return (2 * sinphi);
  }
};
},{}],59:[function(require,module,exports){
module.exports = function(x) {
  return x<0 ? -1 : 1;
};
},{}],60:[function(require,module,exports){
module.exports = function(esinp, exp) {
  return (Math.pow((1 - esinp) / (1 + esinp), exp));
};
},{}],61:[function(require,module,exports){
module.exports = function (array){
  var out = {
    x: array[0],
    y: array[1]
  };
  if (array.length>2) {
    out.z = array[2];
  }
  if (array.length>3) {
    out.m = array[3];
  }
  return out;
};
},{}],62:[function(require,module,exports){
var HALF_PI = Math.PI/2;

module.exports = function(eccent, phi, sinphi) {
  var con = eccent * sinphi;
  var com = 0.5 * eccent;
  con = Math.pow(((1 - con) / (1 + con)), com);
  return (Math.tan(0.5 * (HALF_PI - phi)) / con);
};
},{}],63:[function(require,module,exports){
exports.wgs84 = {
  towgs84: "0,0,0",
  ellipse: "WGS84",
  datumName: "WGS84"
};
exports.ch1903 = {
  towgs84: "674.374,15.056,405.346",
  ellipse: "bessel",
  datumName: "swiss"
};
exports.ggrs87 = {
  towgs84: "-199.87,74.79,246.62",
  ellipse: "GRS80",
  datumName: "Greek_Geodetic_Reference_System_1987"
};
exports.nad83 = {
  towgs84: "0,0,0",
  ellipse: "GRS80",
  datumName: "North_American_Datum_1983"
};
exports.nad27 = {
  nadgrids: "@conus,@alaska,@ntv2_0.gsb,@ntv1_can.dat",
  ellipse: "clrk66",
  datumName: "North_American_Datum_1927"
};
exports.potsdam = {
  towgs84: "606.0,23.0,413.0",
  ellipse: "bessel",
  datumName: "Potsdam Rauenberg 1950 DHDN"
};
exports.carthage = {
  towgs84: "-263.0,6.0,431.0",
  ellipse: "clark80",
  datumName: "Carthage 1934 Tunisia"
};
exports.hermannskogel = {
  towgs84: "653.0,-212.0,449.0",
  ellipse: "bessel",
  datumName: "Hermannskogel"
};
exports.ire65 = {
  towgs84: "482.530,-130.596,564.557,-1.042,-0.214,-0.631,8.15",
  ellipse: "mod_airy",
  datumName: "Ireland 1965"
};
exports.rassadiran = {
  towgs84: "-133.63,-157.5,-158.62",
  ellipse: "intl",
  datumName: "Rassadiran"
};
exports.nzgd49 = {
  towgs84: "59.47,-5.04,187.44,0.47,-0.1,1.024,-4.5993",
  ellipse: "intl",
  datumName: "New Zealand Geodetic Datum 1949"
};
exports.osgb36 = {
  towgs84: "446.448,-125.157,542.060,0.1502,0.2470,0.8421,-20.4894",
  ellipse: "airy",
  datumName: "Airy 1830"
};
exports.s_jtsk = {
  towgs84: "589,76,480",
  ellipse: 'bessel',
  datumName: 'S-JTSK (Ferro)'
};
exports.beduaram = {
  towgs84: '-106,-87,188',
  ellipse: 'clrk80',
  datumName: 'Beduaram'
};
exports.gunung_segara = {
  towgs84: '-403,684,41',
  ellipse: 'bessel',
  datumName: 'Gunung Segara Jakarta'
};
exports.rnb72 = {
  towgs84: "106.869,-52.2978,103.724,-0.33657,0.456955,-1.84218,1",
  ellipse: "intl",
  datumName: "Reseau National Belge 1972"
};
},{}],64:[function(require,module,exports){
exports.MERIT = {
  a: 6378137.0,
  rf: 298.257,
  ellipseName: "MERIT 1983"
};
exports.SGS85 = {
  a: 6378136.0,
  rf: 298.257,
  ellipseName: "Soviet Geodetic System 85"
};
exports.GRS80 = {
  a: 6378137.0,
  rf: 298.257222101,
  ellipseName: "GRS 1980(IUGG, 1980)"
};
exports.IAU76 = {
  a: 6378140.0,
  rf: 298.257,
  ellipseName: "IAU 1976"
};
exports.airy = {
  a: 6377563.396,
  b: 6356256.910,
  ellipseName: "Airy 1830"
};
exports.APL4 = {
  a: 6378137,
  rf: 298.25,
  ellipseName: "Appl. Physics. 1965"
};
exports.NWL9D = {
  a: 6378145.0,
  rf: 298.25,
  ellipseName: "Naval Weapons Lab., 1965"
};
exports.mod_airy = {
  a: 6377340.189,
  b: 6356034.446,
  ellipseName: "Modified Airy"
};
exports.andrae = {
  a: 6377104.43,
  rf: 300.0,
  ellipseName: "Andrae 1876 (Den., Iclnd.)"
};
exports.aust_SA = {
  a: 6378160.0,
  rf: 298.25,
  ellipseName: "Australian Natl & S. Amer. 1969"
};
exports.GRS67 = {
  a: 6378160.0,
  rf: 298.2471674270,
  ellipseName: "GRS 67(IUGG 1967)"
};
exports.bessel = {
  a: 6377397.155,
  rf: 299.1528128,
  ellipseName: "Bessel 1841"
};
exports.bess_nam = {
  a: 6377483.865,
  rf: 299.1528128,
  ellipseName: "Bessel 1841 (Namibia)"
};
exports.clrk66 = {
  a: 6378206.4,
  b: 6356583.8,
  ellipseName: "Clarke 1866"
};
exports.clrk80 = {
  a: 6378249.145,
  rf: 293.4663,
  ellipseName: "Clarke 1880 mod."
};
exports.clrk58 = {
  a: 6378293.645208759,
  rf: 294.2606763692654,
  ellipseName: "Clarke 1858"
};
exports.CPM = {
  a: 6375738.7,
  rf: 334.29,
  ellipseName: "Comm. des Poids et Mesures 1799"
};
exports.delmbr = {
  a: 6376428.0,
  rf: 311.5,
  ellipseName: "Delambre 1810 (Belgium)"
};
exports.engelis = {
  a: 6378136.05,
  rf: 298.2566,
  ellipseName: "Engelis 1985"
};
exports.evrst30 = {
  a: 6377276.345,
  rf: 300.8017,
  ellipseName: "Everest 1830"
};
exports.evrst48 = {
  a: 6377304.063,
  rf: 300.8017,
  ellipseName: "Everest 1948"
};
exports.evrst56 = {
  a: 6377301.243,
  rf: 300.8017,
  ellipseName: "Everest 1956"
};
exports.evrst69 = {
  a: 6377295.664,
  rf: 300.8017,
  ellipseName: "Everest 1969"
};
exports.evrstSS = {
  a: 6377298.556,
  rf: 300.8017,
  ellipseName: "Everest (Sabah & Sarawak)"
};
exports.fschr60 = {
  a: 6378166.0,
  rf: 298.3,
  ellipseName: "Fischer (Mercury Datum) 1960"
};
exports.fschr60m = {
  a: 6378155.0,
  rf: 298.3,
  ellipseName: "Fischer 1960"
};
exports.fschr68 = {
  a: 6378150.0,
  rf: 298.3,
  ellipseName: "Fischer 1968"
};
exports.helmert = {
  a: 6378200.0,
  rf: 298.3,
  ellipseName: "Helmert 1906"
};
exports.hough = {
  a: 6378270.0,
  rf: 297.0,
  ellipseName: "Hough"
};
exports.intl = {
  a: 6378388.0,
  rf: 297.0,
  ellipseName: "International 1909 (Hayford)"
};
exports.kaula = {
  a: 6378163.0,
  rf: 298.24,
  ellipseName: "Kaula 1961"
};
exports.lerch = {
  a: 6378139.0,
  rf: 298.257,
  ellipseName: "Lerch 1979"
};
exports.mprts = {
  a: 6397300.0,
  rf: 191.0,
  ellipseName: "Maupertius 1738"
};
exports.new_intl = {
  a: 6378157.5,
  b: 6356772.2,
  ellipseName: "New International 1967"
};
exports.plessis = {
  a: 6376523.0,
  rf: 6355863.0,
  ellipseName: "Plessis 1817 (France)"
};
exports.krass = {
  a: 6378245.0,
  rf: 298.3,
  ellipseName: "Krassovsky, 1942"
};
exports.SEasia = {
  a: 6378155.0,
  b: 6356773.3205,
  ellipseName: "Southeast Asia"
};
exports.walbeck = {
  a: 6376896.0,
  b: 6355834.8467,
  ellipseName: "Walbeck"
};
exports.WGS60 = {
  a: 6378165.0,
  rf: 298.3,
  ellipseName: "WGS 60"
};
exports.WGS66 = {
  a: 6378145.0,
  rf: 298.25,
  ellipseName: "WGS 66"
};
exports.WGS7 = {
  a: 6378135.0,
  rf: 298.26,
  ellipseName: "WGS 72"
};
exports.WGS84 = {
  a: 6378137.0,
  rf: 298.257223563,
  ellipseName: "WGS 84"
};
exports.sphere = {
  a: 6370997.0,
  b: 6370997.0,
  ellipseName: "Normal Sphere (r=6370997)"
};
},{}],65:[function(require,module,exports){
exports.greenwich = 0.0; //"0dE",
exports.lisbon = -9.131906111111; //"9d07'54.862\"W",
exports.paris = 2.337229166667; //"2d20'14.025\"E",
exports.bogota = -74.080916666667; //"74d04'51.3\"W",
exports.madrid = -3.687938888889; //"3d41'16.58\"W",
exports.rome = 12.452333333333; //"12d27'8.4\"E",
exports.bern = 7.439583333333; //"7d26'22.5\"E",
exports.jakarta = 106.807719444444; //"106d48'27.79\"E",
exports.ferro = -17.666666666667; //"17d40'W",
exports.brussels = 4.367975; //"4d22'4.71\"E",
exports.stockholm = 18.058277777778; //"18d3'29.8\"E",
exports.athens = 23.7163375; //"23d42'58.815\"E",
exports.oslo = 10.722916666667; //"10d43'22.5\"E"
},{}],66:[function(require,module,exports){
exports.ft = {to_meter: 0.3048};
exports['us-ft'] = {to_meter: 1200 / 3937};

},{}],67:[function(require,module,exports){
var proj = require('./Proj');
var transform = require('./transform');
var wgs84 = proj('WGS84');

function transformer(from, to, coords) {
  var transformedArray;
  if (Array.isArray(coords)) {
    transformedArray = transform(from, to, coords);
    if (coords.length === 3) {
      return [transformedArray.x, transformedArray.y, transformedArray.z];
    }
    else {
      return [transformedArray.x, transformedArray.y];
    }
  }
  else {
    return transform(from, to, coords);
  }
}

function checkProj(item) {
  if (item instanceof proj) {
    return item;
  }
  if (item.oProj) {
    return item.oProj;
  }
  return proj(item);
}
function proj4(fromProj, toProj, coord) {
  fromProj = checkProj(fromProj);
  var single = false;
  var obj;
  if (typeof toProj === 'undefined') {
    toProj = fromProj;
    fromProj = wgs84;
    single = true;
  }
  else if (typeof toProj.x !== 'undefined' || Array.isArray(toProj)) {
    coord = toProj;
    toProj = fromProj;
    fromProj = wgs84;
    single = true;
  }
  toProj = checkProj(toProj);
  if (coord) {
    return transformer(fromProj, toProj, coord);
  }
  else {
    obj = {
      forward: function(coords) {
        return transformer(fromProj, toProj, coords);
      },
      inverse: function(coords) {
        return transformer(toProj, fromProj, coords);
      }
    };
    if (single) {
      obj.oProj = toProj;
    }
    return obj;
  }
}
module.exports = proj4;
},{"./Proj":40,"./transform":104}],68:[function(require,module,exports){
var HALF_PI = Math.PI/2;
var PJD_3PARAM = 1;
var PJD_7PARAM = 2;
var PJD_GRIDSHIFT = 3;
var PJD_WGS84 = 4; // WGS84 or equivalent
var PJD_NODATUM = 5; // WGS84 or equivalent
var SEC_TO_RAD = 4.84813681109535993589914102357e-6;
var AD_C = 1.0026000;
var COS_67P5 = 0.38268343236508977;
var datum = function(proj) {
  if (!(this instanceof datum)) {
    return new datum(proj);
  }
  this.datum_type = PJD_WGS84; //default setting
  if (!proj) {
    return;
  }
  if (proj.datumCode && proj.datumCode === 'none') {
    this.datum_type = PJD_NODATUM;
  }

  if (proj.datum_params) {
    this.datum_params = proj.datum_params.map(parseFloat);
    if (this.datum_params[0] !== 0 || this.datum_params[1] !== 0 || this.datum_params[2] !== 0) {
      this.datum_type = PJD_3PARAM;
    }
    if (this.datum_params.length > 3) {
      if (this.datum_params[3] !== 0 || this.datum_params[4] !== 0 || this.datum_params[5] !== 0 || this.datum_params[6] !== 0) {
        this.datum_type = PJD_7PARAM;
        this.datum_params[3] *= SEC_TO_RAD;
        this.datum_params[4] *= SEC_TO_RAD;
        this.datum_params[5] *= SEC_TO_RAD;
        this.datum_params[6] = (this.datum_params[6] / 1000000.0) + 1.0;
      }
    }
  }

  // DGR 2011-03-21 : nadgrids support
  this.datum_type = proj.grids ? PJD_GRIDSHIFT : this.datum_type;

  this.a = proj.a; //datum object also uses these values
  this.b = proj.b;
  this.es = proj.es;
  this.ep2 = proj.ep2;
  if (this.datum_type === PJD_GRIDSHIFT) {
    this.grids = proj.grids;
  }
};
datum.prototype = {


  /****************************************************************/
  // cs_compare_datums()
  //   Returns TRUE if the two datums match, otherwise FALSE.
  compare_datums: function(dest) {
    if (this.datum_type !== dest.datum_type) {
      return false; // false, datums are not equal
    }
    else if (this.a !== dest.a || Math.abs(this.es - dest.es) > 0.000000000050) {
      // the tolerence for es is to ensure that GRS80 and WGS84
      // are considered identical
      return false;
    }
    else if (this.datum_type === PJD_3PARAM) {
      return (this.datum_params[0] === dest.datum_params[0] && this.datum_params[1] === dest.datum_params[1] && this.datum_params[2] === dest.datum_params[2]);
    }
    else if (this.datum_type === PJD_7PARAM) {
      return (this.datum_params[0] === dest.datum_params[0] && this.datum_params[1] === dest.datum_params[1] && this.datum_params[2] === dest.datum_params[2] && this.datum_params[3] === dest.datum_params[3] && this.datum_params[4] === dest.datum_params[4] && this.datum_params[5] === dest.datum_params[5] && this.datum_params[6] === dest.datum_params[6]);
    }
    else if (this.datum_type === PJD_GRIDSHIFT || dest.datum_type === PJD_GRIDSHIFT) {
      //alert("ERROR: Grid shift transformations are not implemented.");
      //return false
      //DGR 2012-07-29 lazy ...
      return this.nadgrids === dest.nadgrids;
    }
    else {
      return true; // datums are equal
    }
  }, // cs_compare_datums()

  /*
   * The function Convert_Geodetic_To_Geocentric converts geodetic coordinates
   * (latitude, longitude, and height) to geocentric coordinates (X, Y, Z),
   * according to the current ellipsoid parameters.
   *
   *    Latitude  : Geodetic latitude in radians                     (input)
   *    Longitude : Geodetic longitude in radians                    (input)
   *    Height    : Geodetic height, in meters                       (input)
   *    X         : Calculated Geocentric X coordinate, in meters    (output)
   *    Y         : Calculated Geocentric Y coordinate, in meters    (output)
   *    Z         : Calculated Geocentric Z coordinate, in meters    (output)
   *
   */
  geodetic_to_geocentric: function(p) {
    var Longitude = p.x;
    var Latitude = p.y;
    var Height = p.z ? p.z : 0; //Z value not always supplied
    var X; // output
    var Y;
    var Z;

    var Error_Code = 0; //  GEOCENT_NO_ERROR;
    var Rn; /*  Earth radius at location  */
    var Sin_Lat; /*  Math.sin(Latitude)  */
    var Sin2_Lat; /*  Square of Math.sin(Latitude)  */
    var Cos_Lat; /*  Math.cos(Latitude)  */

    /*
     ** Don't blow up if Latitude is just a little out of the value
     ** range as it may just be a rounding issue.  Also removed longitude
     ** test, it should be wrapped by Math.cos() and Math.sin().  NFW for PROJ.4, Sep/2001.
     */
    if (Latitude < -HALF_PI && Latitude > -1.001 * HALF_PI) {
      Latitude = -HALF_PI;
    }
    else if (Latitude > HALF_PI && Latitude < 1.001 * HALF_PI) {
      Latitude = HALF_PI;
    }
    else if ((Latitude < -HALF_PI) || (Latitude > HALF_PI)) {
      /* Latitude out of range */
      //..reportError('geocent:lat out of range:' + Latitude);
      return null;
    }

    if (Longitude > Math.PI) {
      Longitude -= (2 * Math.PI);
    }
    Sin_Lat = Math.sin(Latitude);
    Cos_Lat = Math.cos(Latitude);
    Sin2_Lat = Sin_Lat * Sin_Lat;
    Rn = this.a / (Math.sqrt(1.0e0 - this.es * Sin2_Lat));
    X = (Rn + Height) * Cos_Lat * Math.cos(Longitude);
    Y = (Rn + Height) * Cos_Lat * Math.sin(Longitude);
    Z = ((Rn * (1 - this.es)) + Height) * Sin_Lat;

    p.x = X;
    p.y = Y;
    p.z = Z;
    return Error_Code;
  }, // cs_geodetic_to_geocentric()


  geocentric_to_geodetic: function(p) {
    /* local defintions and variables */
    /* end-criterium of loop, accuracy of sin(Latitude) */
    var genau = 1e-12;
    var genau2 = (genau * genau);
    var maxiter = 30;

    var P; /* distance between semi-minor axis and location */
    var RR; /* distance between center and location */
    var CT; /* sin of geocentric latitude */
    var ST; /* cos of geocentric latitude */
    var RX;
    var RK;
    var RN; /* Earth radius at location */
    var CPHI0; /* cos of start or old geodetic latitude in iterations */
    var SPHI0; /* sin of start or old geodetic latitude in iterations */
    var CPHI; /* cos of searched geodetic latitude */
    var SPHI; /* sin of searched geodetic latitude */
    var SDPHI; /* end-criterium: addition-theorem of sin(Latitude(iter)-Latitude(iter-1)) */
    var At_Pole; /* indicates location is in polar region */
    var iter; /* # of continous iteration, max. 30 is always enough (s.a.) */

    var X = p.x;
    var Y = p.y;
    var Z = p.z ? p.z : 0.0; //Z value not always supplied
    var Longitude;
    var Latitude;
    var Height;

    At_Pole = false;
    P = Math.sqrt(X * X + Y * Y);
    RR = Math.sqrt(X * X + Y * Y + Z * Z);

    /*      special cases for latitude and longitude */
    if (P / this.a < genau) {

      /*  special case, if P=0. (X=0., Y=0.) */
      At_Pole = true;
      Longitude = 0.0;

      /*  if (X,Y,Z)=(0.,0.,0.) then Height becomes semi-minor axis
       *  of ellipsoid (=center of mass), Latitude becomes PI/2 */
      if (RR / this.a < genau) {
        Latitude = HALF_PI;
        Height = -this.b;
        return;
      }
    }
    else {
      /*  ellipsoidal (geodetic) longitude
       *  interval: -PI < Longitude <= +PI */
      Longitude = Math.atan2(Y, X);
    }

    /* --------------------------------------------------------------
     * Following iterative algorithm was developped by
     * "Institut for Erdmessung", University of Hannover, July 1988.
     * Internet: www.ife.uni-hannover.de
     * Iterative computation of CPHI,SPHI and Height.
     * Iteration of CPHI and SPHI to 10**-12 radian resp.
     * 2*10**-7 arcsec.
     * --------------------------------------------------------------
     */
    CT = Z / RR;
    ST = P / RR;
    RX = 1.0 / Math.sqrt(1.0 - this.es * (2.0 - this.es) * ST * ST);
    CPHI0 = ST * (1.0 - this.es) * RX;
    SPHI0 = CT * RX;
    iter = 0;

    /* loop to find sin(Latitude) resp. Latitude
     * until |sin(Latitude(iter)-Latitude(iter-1))| < genau */
    do {
      iter++;
      RN = this.a / Math.sqrt(1.0 - this.es * SPHI0 * SPHI0);

      /*  ellipsoidal (geodetic) height */
      Height = P * CPHI0 + Z * SPHI0 - RN * (1.0 - this.es * SPHI0 * SPHI0);

      RK = this.es * RN / (RN + Height);
      RX = 1.0 / Math.sqrt(1.0 - RK * (2.0 - RK) * ST * ST);
      CPHI = ST * (1.0 - RK) * RX;
      SPHI = CT * RX;
      SDPHI = SPHI * CPHI0 - CPHI * SPHI0;
      CPHI0 = CPHI;
      SPHI0 = SPHI;
    }
    while (SDPHI * SDPHI > genau2 && iter < maxiter);

    /*      ellipsoidal (geodetic) latitude */
    Latitude = Math.atan(SPHI / Math.abs(CPHI));

    p.x = Longitude;
    p.y = Latitude;
    p.z = Height;
    return p;
  }, // cs_geocentric_to_geodetic()

  /** Convert_Geocentric_To_Geodetic
   * The method used here is derived from 'An Improved Algorithm for
   * Geocentric to Geodetic Coordinate Conversion', by Ralph Toms, Feb 1996
   */
  geocentric_to_geodetic_noniter: function(p) {
    var X = p.x;
    var Y = p.y;
    var Z = p.z ? p.z : 0; //Z value not always supplied
    var Longitude;
    var Latitude;
    var Height;

    var W; /* distance from Z axis */
    var W2; /* square of distance from Z axis */
    var T0; /* initial estimate of vertical component */
    var T1; /* corrected estimate of vertical component */
    var S0; /* initial estimate of horizontal component */
    var S1; /* corrected estimate of horizontal component */
    var Sin_B0; /* Math.sin(B0), B0 is estimate of Bowring aux variable */
    var Sin3_B0; /* cube of Math.sin(B0) */
    var Cos_B0; /* Math.cos(B0) */
    var Sin_p1; /* Math.sin(phi1), phi1 is estimated latitude */
    var Cos_p1; /* Math.cos(phi1) */
    var Rn; /* Earth radius at location */
    var Sum; /* numerator of Math.cos(phi1) */
    var At_Pole; /* indicates location is in polar region */

    X = parseFloat(X); // cast from string to float
    Y = parseFloat(Y);
    Z = parseFloat(Z);

    At_Pole = false;
    if (X !== 0.0) {
      Longitude = Math.atan2(Y, X);
    }
    else {
      if (Y > 0) {
        Longitude = HALF_PI;
      }
      else if (Y < 0) {
        Longitude = -HALF_PI;
      }
      else {
        At_Pole = true;
        Longitude = 0.0;
        if (Z > 0.0) { /* north pole */
          Latitude = HALF_PI;
        }
        else if (Z < 0.0) { /* south pole */
          Latitude = -HALF_PI;
        }
        else { /* center of earth */
          Latitude = HALF_PI;
          Height = -this.b;
          return;
        }
      }
    }
    W2 = X * X + Y * Y;
    W = Math.sqrt(W2);
    T0 = Z * AD_C;
    S0 = Math.sqrt(T0 * T0 + W2);
    Sin_B0 = T0 / S0;
    Cos_B0 = W / S0;
    Sin3_B0 = Sin_B0 * Sin_B0 * Sin_B0;
    T1 = Z + this.b * this.ep2 * Sin3_B0;
    Sum = W - this.a * this.es * Cos_B0 * Cos_B0 * Cos_B0;
    S1 = Math.sqrt(T1 * T1 + Sum * Sum);
    Sin_p1 = T1 / S1;
    Cos_p1 = Sum / S1;
    Rn = this.a / Math.sqrt(1.0 - this.es * Sin_p1 * Sin_p1);
    if (Cos_p1 >= COS_67P5) {
      Height = W / Cos_p1 - Rn;
    }
    else if (Cos_p1 <= -COS_67P5) {
      Height = W / -Cos_p1 - Rn;
    }
    else {
      Height = Z / Sin_p1 + Rn * (this.es - 1.0);
    }
    if (At_Pole === false) {
      Latitude = Math.atan(Sin_p1 / Cos_p1);
    }

    p.x = Longitude;
    p.y = Latitude;
    p.z = Height;
    return p;
  }, // geocentric_to_geodetic_noniter()

  /****************************************************************/
  // pj_geocentic_to_wgs84( p )
  //  p = point to transform in geocentric coordinates (x,y,z)
  geocentric_to_wgs84: function(p) {

    if (this.datum_type === PJD_3PARAM) {
      // if( x[io] === HUGE_VAL )
      //    continue;
      p.x += this.datum_params[0];
      p.y += this.datum_params[1];
      p.z += this.datum_params[2];

    }
    else if (this.datum_type === PJD_7PARAM) {
      var Dx_BF = this.datum_params[0];
      var Dy_BF = this.datum_params[1];
      var Dz_BF = this.datum_params[2];
      var Rx_BF = this.datum_params[3];
      var Ry_BF = this.datum_params[4];
      var Rz_BF = this.datum_params[5];
      var M_BF = this.datum_params[6];
      // if( x[io] === HUGE_VAL )
      //    continue;
      var x_out = M_BF * (p.x - Rz_BF * p.y + Ry_BF * p.z) + Dx_BF;
      var y_out = M_BF * (Rz_BF * p.x + p.y - Rx_BF * p.z) + Dy_BF;
      var z_out = M_BF * (-Ry_BF * p.x + Rx_BF * p.y + p.z) + Dz_BF;
      p.x = x_out;
      p.y = y_out;
      p.z = z_out;
    }
  }, // cs_geocentric_to_wgs84

  /****************************************************************/
  // pj_geocentic_from_wgs84()
  //  coordinate system definition,
  //  point to transform in geocentric coordinates (x,y,z)
  geocentric_from_wgs84: function(p) {

    if (this.datum_type === PJD_3PARAM) {
      //if( x[io] === HUGE_VAL )
      //    continue;
      p.x -= this.datum_params[0];
      p.y -= this.datum_params[1];
      p.z -= this.datum_params[2];

    }
    else if (this.datum_type === PJD_7PARAM) {
      var Dx_BF = this.datum_params[0];
      var Dy_BF = this.datum_params[1];
      var Dz_BF = this.datum_params[2];
      var Rx_BF = this.datum_params[3];
      var Ry_BF = this.datum_params[4];
      var Rz_BF = this.datum_params[5];
      var M_BF = this.datum_params[6];
      var x_tmp = (p.x - Dx_BF) / M_BF;
      var y_tmp = (p.y - Dy_BF) / M_BF;
      var z_tmp = (p.z - Dz_BF) / M_BF;
      //if( x[io] === HUGE_VAL )
      //    continue;

      p.x = x_tmp + Rz_BF * y_tmp - Ry_BF * z_tmp;
      p.y = -Rz_BF * x_tmp + y_tmp + Rx_BF * z_tmp;
      p.z = Ry_BF * x_tmp - Rx_BF * y_tmp + z_tmp;
    } //cs_geocentric_from_wgs84()
  }
};

/** point object, nothing fancy, just allows values to be
    passed back and forth by reference rather than by value.
    Other point classes may be used as long as they have
    x and y properties, which will get modified in the transform method.
*/
module.exports = datum;

},{}],69:[function(require,module,exports){
var PJD_3PARAM = 1;
var PJD_7PARAM = 2;
var PJD_GRIDSHIFT = 3;
var PJD_NODATUM = 5; // WGS84 or equivalent
var SRS_WGS84_SEMIMAJOR = 6378137; // only used in grid shift transforms
var SRS_WGS84_ESQUARED = 0.006694379990141316; //DGR: 2012-07-29
module.exports = function(source, dest, point) {
  var wp, i, l;

  function checkParams(fallback) {
    return (fallback === PJD_3PARAM || fallback === PJD_7PARAM);
  }
  // Short cut if the datums are identical.
  if (source.compare_datums(dest)) {
    return point; // in this case, zero is sucess,
    // whereas cs_compare_datums returns 1 to indicate TRUE
    // confusing, should fix this
  }

  // Explicitly skip datum transform by setting 'datum=none' as parameter for either source or dest
  if (source.datum_type === PJD_NODATUM || dest.datum_type === PJD_NODATUM) {
    return point;
  }

  //DGR: 2012-07-29 : add nadgrids support (begin)
  var src_a = source.a;
  var src_es = source.es;

  var dst_a = dest.a;
  var dst_es = dest.es;

  var fallback = source.datum_type;
  // If this datum requires grid shifts, then apply it to geodetic coordinates.
  if (fallback === PJD_GRIDSHIFT) {
    if (this.apply_gridshift(source, 0, point) === 0) {
      source.a = SRS_WGS84_SEMIMAJOR;
      source.es = SRS_WGS84_ESQUARED;
    }
    else {
      // try 3 or 7 params transformation or nothing ?
      if (!source.datum_params) {
        source.a = src_a;
        source.es = source.es;
        return point;
      }
      wp = 1;
      for (i = 0, l = source.datum_params.length; i < l; i++) {
        wp *= source.datum_params[i];
      }
      if (wp === 0) {
        source.a = src_a;
        source.es = source.es;
        return point;
      }
      if (source.datum_params.length > 3) {
        fallback = PJD_7PARAM;
      }
      else {
        fallback = PJD_3PARAM;
      }
    }
  }
  if (dest.datum_type === PJD_GRIDSHIFT) {
    dest.a = SRS_WGS84_SEMIMAJOR;
    dest.es = SRS_WGS84_ESQUARED;
  }
  // Do we need to go through geocentric coordinates?
  if (source.es !== dest.es || source.a !== dest.a || checkParams(fallback) || checkParams(dest.datum_type)) {
    //DGR: 2012-07-29 : add nadgrids support (end)
    // Convert to geocentric coordinates.
    source.geodetic_to_geocentric(point);
    // CHECK_RETURN;
    // Convert between datums
    if (checkParams(source.datum_type)) {
      source.geocentric_to_wgs84(point);
      // CHECK_RETURN;
    }
    if (checkParams(dest.datum_type)) {
      dest.geocentric_from_wgs84(point);
      // CHECK_RETURN;
    }
    // Convert back to geodetic coordinates
    dest.geocentric_to_geodetic(point);
    // CHECK_RETURN;
  }
  // Apply grid shift to destination if required
  if (dest.datum_type === PJD_GRIDSHIFT) {
    this.apply_gridshift(dest, 1, point);
    // CHECK_RETURN;
  }

  source.a = src_a;
  source.es = src_es;
  dest.a = dst_a;
  dest.es = dst_es;

  return point;
};


},{}],70:[function(require,module,exports){
var globals = require('./global');
var parseProj = require('./projString');
var wkt = require('./wkt');

function defs(name) {
  /*global console*/
  var that = this;
  if (arguments.length === 2) {
    var def = arguments[1];
    if (typeof def === 'string') {
      if (def.charAt(0) === '+') {
        defs[name] = parseProj(arguments[1]);
      }
      else {
        defs[name] = wkt(arguments[1]);
      }
    } else {
      defs[name] = def;
    }
  }
  else if (arguments.length === 1) {
    if (Array.isArray(name)) {
      return name.map(function(v) {
        if (Array.isArray(v)) {
          defs.apply(that, v);
        }
        else {
          defs(v);
        }
      });
    }
    else if (typeof name === 'string') {
      if (name in defs) {
        return defs[name];
      }
    }
    else if ('EPSG' in name) {
      defs['EPSG:' + name.EPSG] = name;
    }
    else if ('ESRI' in name) {
      defs['ESRI:' + name.ESRI] = name;
    }
    else if ('IAU2000' in name) {
      defs['IAU2000:' + name.IAU2000] = name;
    }
    else {
      console.log(name);
    }
    return;
  }


}
globals(defs);
module.exports = defs;

},{"./global":73,"./projString":77,"./wkt":105}],71:[function(require,module,exports){
var Datum = require('./constants/Datum');
var Ellipsoid = require('./constants/Ellipsoid');
var extend = require('./extend');
var datum = require('./datum');
var EPSLN = 1.0e-10;
// ellipoid pj_set_ell.c
var SIXTH = 0.1666666666666666667;
/* 1/6 */
var RA4 = 0.04722222222222222222;
/* 17/360 */
var RA6 = 0.02215608465608465608;
module.exports = function(json) {
  // DGR 2011-03-20 : nagrids -> nadgrids
  if (json.datumCode && json.datumCode !== 'none') {
    var datumDef = Datum[json.datumCode];
    if (datumDef) {
      json.datum_params = datumDef.towgs84 ? datumDef.towgs84.split(',') : null;
      json.ellps = datumDef.ellipse;
      json.datumName = datumDef.datumName ? datumDef.datumName : json.datumCode;
    }
  }
  if (!json.a) { // do we have an ellipsoid?
    var ellipse = Ellipsoid[json.ellps] ? Ellipsoid[json.ellps] : Ellipsoid.WGS84;
    extend(json, ellipse);
  }
  if (json.rf && !json.b) {
    json.b = (1.0 - 1.0 / json.rf) * json.a;
  }
  if (json.rf === 0 || Math.abs(json.a - json.b) < EPSLN) {
    json.sphere = true;
    json.b = json.a;
  }
  json.a2 = json.a * json.a; // used in geocentric
  json.b2 = json.b * json.b; // used in geocentric
  json.es = (json.a2 - json.b2) / json.a2; // e ^ 2
  json.e = Math.sqrt(json.es); // eccentricity
  if (json.R_A) {
    json.a *= 1 - json.es * (SIXTH + json.es * (RA4 + json.es * RA6));
    json.a2 = json.a * json.a;
    json.b2 = json.b * json.b;
    json.es = 0;
  }
  json.ep2 = (json.a2 - json.b2) / json.b2; // used in geocentric
  if (!json.k0) {
    json.k0 = 1.0; //default value
  }
  //DGR 2010-11-12: axis
  if (!json.axis) {
    json.axis = "enu";
  }

  if (!json.datum) {
    json.datum = datum(json);
  }
  return json;
};

},{"./constants/Datum":63,"./constants/Ellipsoid":64,"./datum":68,"./extend":72}],72:[function(require,module,exports){
module.exports = function(destination, source) {
  destination = destination || {};
  var value, property;
  if (!source) {
    return destination;
  }
  for (property in source) {
    value = source[property];
    if (value !== undefined) {
      destination[property] = value;
    }
  }
  return destination;
};

},{}],73:[function(require,module,exports){
module.exports = function(defs) {
  defs('EPSG:4326', "+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees");
  defs('EPSG:4269', "+title=NAD83 (long/lat) +proj=longlat +a=6378137.0 +b=6356752.31414036 +ellps=GRS80 +datum=NAD83 +units=degrees");
  defs('EPSG:3857', "+title=WGS 84 / Pseudo-Mercator +proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +no_defs");

  defs.WGS84 = defs['EPSG:4326'];
  defs['EPSG:3785'] = defs['EPSG:3857']; // maintain backward compat, official code is 3857
  defs.GOOGLE = defs['EPSG:3857'];
  defs['EPSG:900913'] = defs['EPSG:3857'];
  defs['EPSG:102113'] = defs['EPSG:3857'];
};

},{}],74:[function(require,module,exports){
var projs = [
  require('./projections/tmerc'),
  require('./projections/utm'),
  require('./projections/sterea'),
  require('./projections/stere'),
  require('./projections/somerc'),
  require('./projections/omerc'),
  require('./projections/lcc'),
  require('./projections/krovak'),
  require('./projections/cass'),
  require('./projections/laea'),
  require('./projections/aea'),
  require('./projections/gnom'),
  require('./projections/cea'),
  require('./projections/eqc'),
  require('./projections/poly'),
  require('./projections/nzmg'),
  require('./projections/mill'),
  require('./projections/sinu'),
  require('./projections/moll'),
  require('./projections/eqdc'),
  require('./projections/vandg'),
  require('./projections/aeqd')
];
module.exports = function(proj4){
  projs.forEach(function(proj){
    proj4.Proj.projections.add(proj);
  });
};
},{"./projections/aea":79,"./projections/aeqd":80,"./projections/cass":81,"./projections/cea":82,"./projections/eqc":83,"./projections/eqdc":84,"./projections/gnom":86,"./projections/krovak":87,"./projections/laea":88,"./projections/lcc":89,"./projections/mill":92,"./projections/moll":93,"./projections/nzmg":94,"./projections/omerc":95,"./projections/poly":96,"./projections/sinu":97,"./projections/somerc":98,"./projections/stere":99,"./projections/sterea":100,"./projections/tmerc":101,"./projections/utm":102,"./projections/vandg":103}],75:[function(require,module,exports){
var proj4 = require('./core');
proj4.defaultDatum = 'WGS84'; //default datum
proj4.Proj = require('./Proj');
proj4.WGS84 = new proj4.Proj('WGS84');
proj4.Point = require('./Point');
proj4.toPoint = require("./common/toPoint");
proj4.defs = require('./defs');
proj4.transform = require('./transform');
proj4.mgrs = require('mgrs');
proj4.version = require('../package.json').version;
require('./includedProjections')(proj4);
module.exports = proj4;
},{"../package.json":106,"./Point":39,"./Proj":40,"./common/toPoint":61,"./core":67,"./defs":70,"./includedProjections":74,"./transform":104,"mgrs":37}],76:[function(require,module,exports){
var defs = require('./defs');
var wkt = require('./wkt');
var projStr = require('./projString');
function testObj(code){
  return typeof code === 'string';
}
function testDef(code){
  return code in defs;
}
function testWKT(code){
  var codeWords = ['GEOGCS','GEOCCS','PROJCS','LOCAL_CS'];
  return codeWords.reduce(function(a,b){
    return a+1+code.indexOf(b);
  },0);
}
function testProj(code){
  return code[0] === '+';
}
function parse(code){
  if (testObj(code)) {
    //check to see if this is a WKT string
    if (testDef(code)) {
      return defs[code];
    }
    else if (testWKT(code)) {
      return wkt(code);
    }
    else if (testProj(code)) {
      return projStr(code);
    }
  }else{
    return code;
  }
}

module.exports = parse;
},{"./defs":70,"./projString":77,"./wkt":105}],77:[function(require,module,exports){
var D2R = 0.01745329251994329577;
var PrimeMeridian = require('./constants/PrimeMeridian');
var units = require('./constants/units');

module.exports = function(defData) {
  var self = {};
  var paramObj = {};
  defData.split("+").map(function(v) {
    return v.trim();
  }).filter(function(a) {
    return a;
  }).forEach(function(a) {
    var split = a.split("=");
    split.push(true);
    paramObj[split[0].toLowerCase()] = split[1];
  });
  var paramName, paramVal, paramOutname;
  var params = {
    proj: 'projName',
    datum: 'datumCode',
    rf: function(v) {
      self.rf = parseFloat(v);
    },
    lat_0: function(v) {
      self.lat0 = v * D2R;
    },
    lat_1: function(v) {
      self.lat1 = v * D2R;
    },
    lat_2: function(v) {
      self.lat2 = v * D2R;
    },
    lat_ts: function(v) {
      self.lat_ts = v * D2R;
    },
    lon_0: function(v) {
      self.long0 = v * D2R;
    },
    lon_1: function(v) {
      self.long1 = v * D2R;
    },
    lon_2: function(v) {
      self.long2 = v * D2R;
    },
    alpha: function(v) {
      self.alpha = parseFloat(v) * D2R;
    },
    lonc: function(v) {
      self.longc = v * D2R;
    },
    x_0: function(v) {
      self.x0 = parseFloat(v);
    },
    y_0: function(v) {
      self.y0 = parseFloat(v);
    },
    k_0: function(v) {
      self.k0 = parseFloat(v);
    },
    k: function(v) {
      self.k0 = parseFloat(v);
    },
    a: function(v) {
      self.a = parseFloat(v);
    },
    b: function(v) {
      self.b = parseFloat(v);
    },
    r_a: function() {
      self.R_A = true;
    },
    zone: function(v) {
      self.zone = parseInt(v, 10);
    },
    south: function() {
      self.utmSouth = true;
    },
    towgs84: function(v) {
      self.datum_params = v.split(",").map(function(a) {
        return parseFloat(a);
      });
    },
    to_meter: function(v) {
      self.to_meter = parseFloat(v);
    },
    units: function(v) {
      self.units = v;
      if (units[v]) {
        self.to_meter = units[v].to_meter;
      }
    },
    from_greenwich: function(v) {
      self.from_greenwich = v * D2R;
    },
    pm: function(v) {
      self.from_greenwich = (PrimeMeridian[v] ? PrimeMeridian[v] : parseFloat(v)) * D2R;
    },
    nadgrids: function(v) {
      if (v === '@null') {
        self.datumCode = 'none';
      }
      else {
        self.nadgrids = v;
      }
    },
    axis: function(v) {
      var legalAxis = "ewnsud";
      if (v.length === 3 && legalAxis.indexOf(v.substr(0, 1)) !== -1 && legalAxis.indexOf(v.substr(1, 1)) !== -1 && legalAxis.indexOf(v.substr(2, 1)) !== -1) {
        self.axis = v;
      }
    }
  };
  for (paramName in paramObj) {
    paramVal = paramObj[paramName];
    if (paramName in params) {
      paramOutname = params[paramName];
      if (typeof paramOutname === 'function') {
        paramOutname(paramVal);
      }
      else {
        self[paramOutname] = paramVal;
      }
    }
    else {
      self[paramName] = paramVal;
    }
  }
  if(typeof self.datumCode === 'string' && self.datumCode !== "WGS84"){
    self.datumCode = self.datumCode.toLowerCase();
  }
  return self;
};

},{"./constants/PrimeMeridian":65,"./constants/units":66}],78:[function(require,module,exports){
var projs = [
  require('./projections/merc'),
  require('./projections/longlat')
];
var names = {};
var projStore = [];

function add(proj, i) {
  var len = projStore.length;
  if (!proj.names) {
    console.log(i);
    return true;
  }
  projStore[len] = proj;
  proj.names.forEach(function(n) {
    names[n.toLowerCase()] = len;
  });
  return this;
}

exports.add = add;

exports.get = function(name) {
  if (!name) {
    return false;
  }
  var n = name.toLowerCase();
  if (typeof names[n] !== 'undefined' && projStore[names[n]]) {
    return projStore[names[n]];
  }
};
exports.start = function() {
  projs.forEach(add);
};

},{"./projections/longlat":90,"./projections/merc":91}],79:[function(require,module,exports){
var EPSLN = 1.0e-10;
var msfnz = require('../common/msfnz');
var qsfnz = require('../common/qsfnz');
var adjust_lon = require('../common/adjust_lon');
var asinz = require('../common/asinz');
exports.init = function() {

  if (Math.abs(this.lat1 + this.lat2) < EPSLN) {
    return;
  }
  this.temp = this.b / this.a;
  this.es = 1 - Math.pow(this.temp, 2);
  this.e3 = Math.sqrt(this.es);

  this.sin_po = Math.sin(this.lat1);
  this.cos_po = Math.cos(this.lat1);
  this.t1 = this.sin_po;
  this.con = this.sin_po;
  this.ms1 = msfnz(this.e3, this.sin_po, this.cos_po);
  this.qs1 = qsfnz(this.e3, this.sin_po, this.cos_po);

  this.sin_po = Math.sin(this.lat2);
  this.cos_po = Math.cos(this.lat2);
  this.t2 = this.sin_po;
  this.ms2 = msfnz(this.e3, this.sin_po, this.cos_po);
  this.qs2 = qsfnz(this.e3, this.sin_po, this.cos_po);

  this.sin_po = Math.sin(this.lat0);
  this.cos_po = Math.cos(this.lat0);
  this.t3 = this.sin_po;
  this.qs0 = qsfnz(this.e3, this.sin_po, this.cos_po);

  if (Math.abs(this.lat1 - this.lat2) > EPSLN) {
    this.ns0 = (this.ms1 * this.ms1 - this.ms2 * this.ms2) / (this.qs2 - this.qs1);
  }
  else {
    this.ns0 = this.con;
  }
  this.c = this.ms1 * this.ms1 + this.ns0 * this.qs1;
  this.rh = this.a * Math.sqrt(this.c - this.ns0 * this.qs0) / this.ns0;
};

/* Albers Conical Equal Area forward equations--mapping lat,long to x,y
  -------------------------------------------------------------------*/
exports.forward = function(p) {

  var lon = p.x;
  var lat = p.y;

  this.sin_phi = Math.sin(lat);
  this.cos_phi = Math.cos(lat);

  var qs = qsfnz(this.e3, this.sin_phi, this.cos_phi);
  var rh1 = this.a * Math.sqrt(this.c - this.ns0 * qs) / this.ns0;
  var theta = this.ns0 * adjust_lon(lon - this.long0);
  var x = rh1 * Math.sin(theta) + this.x0;
  var y = this.rh - rh1 * Math.cos(theta) + this.y0;

  p.x = x;
  p.y = y;
  return p;
};


exports.inverse = function(p) {
  var rh1, qs, con, theta, lon, lat;

  p.x -= this.x0;
  p.y = this.rh - p.y + this.y0;
  if (this.ns0 >= 0) {
    rh1 = Math.sqrt(p.x * p.x + p.y * p.y);
    con = 1;
  }
  else {
    rh1 = -Math.sqrt(p.x * p.x + p.y * p.y);
    con = -1;
  }
  theta = 0;
  if (rh1 !== 0) {
    theta = Math.atan2(con * p.x, con * p.y);
  }
  con = rh1 * this.ns0 / this.a;
  if (this.sphere) {
    lat = Math.asin((this.c - con * con) / (2 * this.ns0));
  }
  else {
    qs = (this.c - con * con) / this.ns0;
    lat = this.phi1z(this.e3, qs);
  }

  lon = adjust_lon(theta / this.ns0 + this.long0);
  p.x = lon;
  p.y = lat;
  return p;
};

/* Function to compute phi1, the latitude for the inverse of the
   Albers Conical Equal-Area projection.
-------------------------------------------*/
exports.phi1z = function(eccent, qs) {
  var sinphi, cosphi, con, com, dphi;
  var phi = asinz(0.5 * qs);
  if (eccent < EPSLN) {
    return phi;
  }

  var eccnts = eccent * eccent;
  for (var i = 1; i <= 25; i++) {
    sinphi = Math.sin(phi);
    cosphi = Math.cos(phi);
    con = eccent * sinphi;
    com = 1 - con * con;
    dphi = 0.5 * com * com / cosphi * (qs / (1 - eccnts) - sinphi / com + 0.5 / eccent * Math.log((1 - con) / (1 + con)));
    phi = phi + dphi;
    if (Math.abs(dphi) <= 1e-7) {
      return phi;
    }
  }
  return null;
};
exports.names = ["Albers_Conic_Equal_Area", "Albers", "aea"];

},{"../common/adjust_lon":43,"../common/asinz":44,"../common/msfnz":53,"../common/qsfnz":58}],80:[function(require,module,exports){
var adjust_lon = require('../common/adjust_lon');
var HALF_PI = Math.PI/2;
var EPSLN = 1.0e-10;
var mlfn = require('../common/mlfn');
var e0fn = require('../common/e0fn');
var e1fn = require('../common/e1fn');
var e2fn = require('../common/e2fn');
var e3fn = require('../common/e3fn');
var gN = require('../common/gN');
var asinz = require('../common/asinz');
var imlfn = require('../common/imlfn');
exports.init = function() {
  this.sin_p12 = Math.sin(this.lat0);
  this.cos_p12 = Math.cos(this.lat0);
};

exports.forward = function(p) {
  var lon = p.x;
  var lat = p.y;
  var sinphi = Math.sin(p.y);
  var cosphi = Math.cos(p.y);
  var dlon = adjust_lon(lon - this.long0);
  var e0, e1, e2, e3, Mlp, Ml, tanphi, Nl1, Nl, psi, Az, G, H, GH, Hs, c, kp, cos_c, s, s2, s3, s4, s5;
  if (this.sphere) {
    if (Math.abs(this.sin_p12 - 1) <= EPSLN) {
      //North Pole case
      p.x = this.x0 + this.a * (HALF_PI - lat) * Math.sin(dlon);
      p.y = this.y0 - this.a * (HALF_PI - lat) * Math.cos(dlon);
      return p;
    }
    else if (Math.abs(this.sin_p12 + 1) <= EPSLN) {
      //South Pole case
      p.x = this.x0 + this.a * (HALF_PI + lat) * Math.sin(dlon);
      p.y = this.y0 + this.a * (HALF_PI + lat) * Math.cos(dlon);
      return p;
    }
    else {
      //default case
      cos_c = this.sin_p12 * sinphi + this.cos_p12 * cosphi * Math.cos(dlon);
      c = Math.acos(cos_c);
      kp = c / Math.sin(c);
      p.x = this.x0 + this.a * kp * cosphi * Math.sin(dlon);
      p.y = this.y0 + this.a * kp * (this.cos_p12 * sinphi - this.sin_p12 * cosphi * Math.cos(dlon));
      return p;
    }
  }
  else {
    e0 = e0fn(this.es);
    e1 = e1fn(this.es);
    e2 = e2fn(this.es);
    e3 = e3fn(this.es);
    if (Math.abs(this.sin_p12 - 1) <= EPSLN) {
      //North Pole case
      Mlp = this.a * mlfn(e0, e1, e2, e3, HALF_PI);
      Ml = this.a * mlfn(e0, e1, e2, e3, lat);
      p.x = this.x0 + (Mlp - Ml) * Math.sin(dlon);
      p.y = this.y0 - (Mlp - Ml) * Math.cos(dlon);
      return p;
    }
    else if (Math.abs(this.sin_p12 + 1) <= EPSLN) {
      //South Pole case
      Mlp = this.a * mlfn(e0, e1, e2, e3, HALF_PI);
      Ml = this.a * mlfn(e0, e1, e2, e3, lat);
      p.x = this.x0 + (Mlp + Ml) * Math.sin(dlon);
      p.y = this.y0 + (Mlp + Ml) * Math.cos(dlon);
      return p;
    }
    else {
      //Default case
      tanphi = sinphi / cosphi;
      Nl1 = gN(this.a, this.e, this.sin_p12);
      Nl = gN(this.a, this.e, sinphi);
      psi = Math.atan((1 - this.es) * tanphi + this.es * Nl1 * this.sin_p12 / (Nl * cosphi));
      Az = Math.atan2(Math.sin(dlon), this.cos_p12 * Math.tan(psi) - this.sin_p12 * Math.cos(dlon));
      if (Az === 0) {
        s = Math.asin(this.cos_p12 * Math.sin(psi) - this.sin_p12 * Math.cos(psi));
      }
      else if (Math.abs(Math.abs(Az) - Math.PI) <= EPSLN) {
        s = -Math.asin(this.cos_p12 * Math.sin(psi) - this.sin_p12 * Math.cos(psi));
      }
      else {
        s = Math.asin(Math.sin(dlon) * Math.cos(psi) / Math.sin(Az));
      }
      G = this.e * this.sin_p12 / Math.sqrt(1 - this.es);
      H = this.e * this.cos_p12 * Math.cos(Az) / Math.sqrt(1 - this.es);
      GH = G * H;
      Hs = H * H;
      s2 = s * s;
      s3 = s2 * s;
      s4 = s3 * s;
      s5 = s4 * s;
      c = Nl1 * s * (1 - s2 * Hs * (1 - Hs) / 6 + s3 / 8 * GH * (1 - 2 * Hs) + s4 / 120 * (Hs * (4 - 7 * Hs) - 3 * G * G * (1 - 7 * Hs)) - s5 / 48 * GH);
      p.x = this.x0 + c * Math.sin(Az);
      p.y = this.y0 + c * Math.cos(Az);
      return p;
    }
  }


};

exports.inverse = function(p) {
  p.x -= this.x0;
  p.y -= this.y0;
  var rh, z, sinz, cosz, lon, lat, con, e0, e1, e2, e3, Mlp, M, N1, psi, Az, cosAz, tmp, A, B, D, Ee, F;
  if (this.sphere) {
    rh = Math.sqrt(p.x * p.x + p.y * p.y);
    if (rh > (2 * HALF_PI * this.a)) {
      return;
    }
    z = rh / this.a;

    sinz = Math.sin(z);
    cosz = Math.cos(z);

    lon = this.long0;
    if (Math.abs(rh) <= EPSLN) {
      lat = this.lat0;
    }
    else {
      lat = asinz(cosz * this.sin_p12 + (p.y * sinz * this.cos_p12) / rh);
      con = Math.abs(this.lat0) - HALF_PI;
      if (Math.abs(con) <= EPSLN) {
        if (this.lat0 >= 0) {
          lon = adjust_lon(this.long0 + Math.atan2(p.x, - p.y));
        }
        else {
          lon = adjust_lon(this.long0 - Math.atan2(-p.x, p.y));
        }
      }
      else {
        /*con = cosz - this.sin_p12 * Math.sin(lat);
        if ((Math.abs(con) < EPSLN) && (Math.abs(p.x) < EPSLN)) {
          //no-op, just keep the lon value as is
        } else {
          var temp = Math.atan2((p.x * sinz * this.cos_p12), (con * rh));
          lon = adjust_lon(this.long0 + Math.atan2((p.x * sinz * this.cos_p12), (con * rh)));
        }*/
        lon = adjust_lon(this.long0 + Math.atan2(p.x * sinz, rh * this.cos_p12 * cosz - p.y * this.sin_p12 * sinz));
      }
    }

    p.x = lon;
    p.y = lat;
    return p;
  }
  else {
    e0 = e0fn(this.es);
    e1 = e1fn(this.es);
    e2 = e2fn(this.es);
    e3 = e3fn(this.es);
    if (Math.abs(this.sin_p12 - 1) <= EPSLN) {
      //North pole case
      Mlp = this.a * mlfn(e0, e1, e2, e3, HALF_PI);
      rh = Math.sqrt(p.x * p.x + p.y * p.y);
      M = Mlp - rh;
      lat = imlfn(M / this.a, e0, e1, e2, e3);
      lon = adjust_lon(this.long0 + Math.atan2(p.x, - 1 * p.y));
      p.x = lon;
      p.y = lat;
      return p;
    }
    else if (Math.abs(this.sin_p12 + 1) <= EPSLN) {
      //South pole case
      Mlp = this.a * mlfn(e0, e1, e2, e3, HALF_PI);
      rh = Math.sqrt(p.x * p.x + p.y * p.y);
      M = rh - Mlp;

      lat = imlfn(M / this.a, e0, e1, e2, e3);
      lon = adjust_lon(this.long0 + Math.atan2(p.x, p.y));
      p.x = lon;
      p.y = lat;
      return p;
    }
    else {
      //default case
      rh = Math.sqrt(p.x * p.x + p.y * p.y);
      Az = Math.atan2(p.x, p.y);
      N1 = gN(this.a, this.e, this.sin_p12);
      cosAz = Math.cos(Az);
      tmp = this.e * this.cos_p12 * cosAz;
      A = -tmp * tmp / (1 - this.es);
      B = 3 * this.es * (1 - A) * this.sin_p12 * this.cos_p12 * cosAz / (1 - this.es);
      D = rh / N1;
      Ee = D - A * (1 + A) * Math.pow(D, 3) / 6 - B * (1 + 3 * A) * Math.pow(D, 4) / 24;
      F = 1 - A * Ee * Ee / 2 - D * Ee * Ee * Ee / 6;
      psi = Math.asin(this.sin_p12 * Math.cos(Ee) + this.cos_p12 * Math.sin(Ee) * cosAz);
      lon = adjust_lon(this.long0 + Math.asin(Math.sin(Az) * Math.sin(Ee) / Math.cos(psi)));
      lat = Math.atan((1 - this.es * F * this.sin_p12 / Math.sin(psi)) * Math.tan(psi) / (1 - this.es));
      p.x = lon;
      p.y = lat;
      return p;
    }
  }

};
exports.names = ["Azimuthal_Equidistant", "aeqd"];

},{"../common/adjust_lon":43,"../common/asinz":44,"../common/e0fn":45,"../common/e1fn":46,"../common/e2fn":47,"../common/e3fn":48,"../common/gN":49,"../common/imlfn":50,"../common/mlfn":52}],81:[function(require,module,exports){
var mlfn = require('../common/mlfn');
var e0fn = require('../common/e0fn');
var e1fn = require('../common/e1fn');
var e2fn = require('../common/e2fn');
var e3fn = require('../common/e3fn');
var gN = require('../common/gN');
var adjust_lon = require('../common/adjust_lon');
var adjust_lat = require('../common/adjust_lat');
var imlfn = require('../common/imlfn');
var HALF_PI = Math.PI/2;
var EPSLN = 1.0e-10;
exports.init = function() {
  if (!this.sphere) {
    this.e0 = e0fn(this.es);
    this.e1 = e1fn(this.es);
    this.e2 = e2fn(this.es);
    this.e3 = e3fn(this.es);
    this.ml0 = this.a * mlfn(this.e0, this.e1, this.e2, this.e3, this.lat0);
  }
};



/* Cassini forward equations--mapping lat,long to x,y
  -----------------------------------------------------------------------*/
exports.forward = function(p) {

  /* Forward equations
      -----------------*/
  var x, y;
  var lam = p.x;
  var phi = p.y;
  lam = adjust_lon(lam - this.long0);

  if (this.sphere) {
    x = this.a * Math.asin(Math.cos(phi) * Math.sin(lam));
    y = this.a * (Math.atan2(Math.tan(phi), Math.cos(lam)) - this.lat0);
  }
  else {
    //ellipsoid
    var sinphi = Math.sin(phi);
    var cosphi = Math.cos(phi);
    var nl = gN(this.a, this.e, sinphi);
    var tl = Math.tan(phi) * Math.tan(phi);
    var al = lam * Math.cos(phi);
    var asq = al * al;
    var cl = this.es * cosphi * cosphi / (1 - this.es);
    var ml = this.a * mlfn(this.e0, this.e1, this.e2, this.e3, phi);

    x = nl * al * (1 - asq * tl * (1 / 6 - (8 - tl + 8 * cl) * asq / 120));
    y = ml - this.ml0 + nl * sinphi / cosphi * asq * (0.5 + (5 - tl + 6 * cl) * asq / 24);


  }

  p.x = x + this.x0;
  p.y = y + this.y0;
  return p;
};

/* Inverse equations
  -----------------*/
exports.inverse = function(p) {
  p.x -= this.x0;
  p.y -= this.y0;
  var x = p.x / this.a;
  var y = p.y / this.a;
  var phi, lam;

  if (this.sphere) {
    var dd = y + this.lat0;
    phi = Math.asin(Math.sin(dd) * Math.cos(x));
    lam = Math.atan2(Math.tan(x), Math.cos(dd));
  }
  else {
    /* ellipsoid */
    var ml1 = this.ml0 / this.a + y;
    var phi1 = imlfn(ml1, this.e0, this.e1, this.e2, this.e3);
    if (Math.abs(Math.abs(phi1) - HALF_PI) <= EPSLN) {
      p.x = this.long0;
      p.y = HALF_PI;
      if (y < 0) {
        p.y *= -1;
      }
      return p;
    }
    var nl1 = gN(this.a, this.e, Math.sin(phi1));

    var rl1 = nl1 * nl1 * nl1 / this.a / this.a * (1 - this.es);
    var tl1 = Math.pow(Math.tan(phi1), 2);
    var dl = x * this.a / nl1;
    var dsq = dl * dl;
    phi = phi1 - nl1 * Math.tan(phi1) / rl1 * dl * dl * (0.5 - (1 + 3 * tl1) * dl * dl / 24);
    lam = dl * (1 - dsq * (tl1 / 3 + (1 + 3 * tl1) * tl1 * dsq / 15)) / Math.cos(phi1);

  }

  p.x = adjust_lon(lam + this.long0);
  p.y = adjust_lat(phi);
  return p;

};
exports.names = ["Cassini", "Cassini_Soldner", "cass"];
},{"../common/adjust_lat":42,"../common/adjust_lon":43,"../common/e0fn":45,"../common/e1fn":46,"../common/e2fn":47,"../common/e3fn":48,"../common/gN":49,"../common/imlfn":50,"../common/mlfn":52}],82:[function(require,module,exports){
var adjust_lon = require('../common/adjust_lon');
var qsfnz = require('../common/qsfnz');
var msfnz = require('../common/msfnz');
var iqsfnz = require('../common/iqsfnz');
/*
  reference:  
    "Cartographic Projection Procedures for the UNIX Environment-
    A User's Manual" by Gerald I. Evenden,
    USGS Open File Report 90-284and Release 4 Interim Reports (2003)
*/
exports.init = function() {
  //no-op
  if (!this.sphere) {
    this.k0 = msfnz(this.e, Math.sin(this.lat_ts), Math.cos(this.lat_ts));
  }
};


/* Cylindrical Equal Area forward equations--mapping lat,long to x,y
    ------------------------------------------------------------*/
exports.forward = function(p) {
  var lon = p.x;
  var lat = p.y;
  var x, y;
  /* Forward equations
      -----------------*/
  var dlon = adjust_lon(lon - this.long0);
  if (this.sphere) {
    x = this.x0 + this.a * dlon * Math.cos(this.lat_ts);
    y = this.y0 + this.a * Math.sin(lat) / Math.cos(this.lat_ts);
  }
  else {
    var qs = qsfnz(this.e, Math.sin(lat));
    x = this.x0 + this.a * this.k0 * dlon;
    y = this.y0 + this.a * qs * 0.5 / this.k0;
  }

  p.x = x;
  p.y = y;
  return p;
};

/* Cylindrical Equal Area inverse equations--mapping x,y to lat/long
    ------------------------------------------------------------*/
exports.inverse = function(p) {
  p.x -= this.x0;
  p.y -= this.y0;
  var lon, lat;

  if (this.sphere) {
    lon = adjust_lon(this.long0 + (p.x / this.a) / Math.cos(this.lat_ts));
    lat = Math.asin((p.y / this.a) * Math.cos(this.lat_ts));
  }
  else {
    lat = iqsfnz(this.e, 2 * p.y * this.k0 / this.a);
    lon = adjust_lon(this.long0 + p.x / (this.a * this.k0));
  }

  p.x = lon;
  p.y = lat;
  return p;
};
exports.names = ["cea"];

},{"../common/adjust_lon":43,"../common/iqsfnz":51,"../common/msfnz":53,"../common/qsfnz":58}],83:[function(require,module,exports){
var adjust_lon = require('../common/adjust_lon');
var adjust_lat = require('../common/adjust_lat');
exports.init = function() {

  this.x0 = this.x0 || 0;
  this.y0 = this.y0 || 0;
  this.lat0 = this.lat0 || 0;
  this.long0 = this.long0 || 0;
  this.lat_ts = this.lat_ts || 0;
  this.title = this.title || "Equidistant Cylindrical (Plate Carre)";

  this.rc = Math.cos(this.lat_ts);
};


// forward equations--mapping lat,long to x,y
// -----------------------------------------------------------------
exports.forward = function(p) {

  var lon = p.x;
  var lat = p.y;

  var dlon = adjust_lon(lon - this.long0);
  var dlat = adjust_lat(lat - this.lat0);
  p.x = this.x0 + (this.a * dlon * this.rc);
  p.y = this.y0 + (this.a * dlat);
  return p;
};

// inverse equations--mapping x,y to lat/long
// -----------------------------------------------------------------
exports.inverse = function(p) {

  var x = p.x;
  var y = p.y;

  p.x = adjust_lon(this.long0 + ((x - this.x0) / (this.a * this.rc)));
  p.y = adjust_lat(this.lat0 + ((y - this.y0) / (this.a)));
  return p;
};
exports.names = ["Equirectangular", "Equidistant_Cylindrical", "eqc"];

},{"../common/adjust_lat":42,"../common/adjust_lon":43}],84:[function(require,module,exports){
var e0fn = require('../common/e0fn');
var e1fn = require('../common/e1fn');
var e2fn = require('../common/e2fn');
var e3fn = require('../common/e3fn');
var msfnz = require('../common/msfnz');
var mlfn = require('../common/mlfn');
var adjust_lon = require('../common/adjust_lon');
var adjust_lat = require('../common/adjust_lat');
var imlfn = require('../common/imlfn');
var EPSLN = 1.0e-10;
exports.init = function() {

  /* Place parameters in static storage for common use
      -------------------------------------------------*/
  // Standard Parallels cannot be equal and on opposite sides of the equator
  if (Math.abs(this.lat1 + this.lat2) < EPSLN) {
    return;
  }
  this.lat2 = this.lat2 || this.lat1;
  this.temp = this.b / this.a;
  this.es = 1 - Math.pow(this.temp, 2);
  this.e = Math.sqrt(this.es);
  this.e0 = e0fn(this.es);
  this.e1 = e1fn(this.es);
  this.e2 = e2fn(this.es);
  this.e3 = e3fn(this.es);

  this.sinphi = Math.sin(this.lat1);
  this.cosphi = Math.cos(this.lat1);

  this.ms1 = msfnz(this.e, this.sinphi, this.cosphi);
  this.ml1 = mlfn(this.e0, this.e1, this.e2, this.e3, this.lat1);

  if (Math.abs(this.lat1 - this.lat2) < EPSLN) {
    this.ns = this.sinphi;
  }
  else {
    this.sinphi = Math.sin(this.lat2);
    this.cosphi = Math.cos(this.lat2);
    this.ms2 = msfnz(this.e, this.sinphi, this.cosphi);
    this.ml2 = mlfn(this.e0, this.e1, this.e2, this.e3, this.lat2);
    this.ns = (this.ms1 - this.ms2) / (this.ml2 - this.ml1);
  }
  this.g = this.ml1 + this.ms1 / this.ns;
  this.ml0 = mlfn(this.e0, this.e1, this.e2, this.e3, this.lat0);
  this.rh = this.a * (this.g - this.ml0);
};


/* Equidistant Conic forward equations--mapping lat,long to x,y
  -----------------------------------------------------------*/
exports.forward = function(p) {
  var lon = p.x;
  var lat = p.y;
  var rh1;

  /* Forward equations
      -----------------*/
  if (this.sphere) {
    rh1 = this.a * (this.g - lat);
  }
  else {
    var ml = mlfn(this.e0, this.e1, this.e2, this.e3, lat);
    rh1 = this.a * (this.g - ml);
  }
  var theta = this.ns * adjust_lon(lon - this.long0);
  var x = this.x0 + rh1 * Math.sin(theta);
  var y = this.y0 + this.rh - rh1 * Math.cos(theta);
  p.x = x;
  p.y = y;
  return p;
};

/* Inverse equations
  -----------------*/
exports.inverse = function(p) {
  p.x -= this.x0;
  p.y = this.rh - p.y + this.y0;
  var con, rh1, lat, lon;
  if (this.ns >= 0) {
    rh1 = Math.sqrt(p.x * p.x + p.y * p.y);
    con = 1;
  }
  else {
    rh1 = -Math.sqrt(p.x * p.x + p.y * p.y);
    con = -1;
  }
  var theta = 0;
  if (rh1 !== 0) {
    theta = Math.atan2(con * p.x, con * p.y);
  }

  if (this.sphere) {
    lon = adjust_lon(this.long0 + theta / this.ns);
    lat = adjust_lat(this.g - rh1 / this.a);
    p.x = lon;
    p.y = lat;
    return p;
  }
  else {
    var ml = this.g - rh1 / this.a;
    lat = imlfn(ml, this.e0, this.e1, this.e2, this.e3);
    lon = adjust_lon(this.long0 + theta / this.ns);
    p.x = lon;
    p.y = lat;
    return p;
  }

};
exports.names = ["Equidistant_Conic", "eqdc"];

},{"../common/adjust_lat":42,"../common/adjust_lon":43,"../common/e0fn":45,"../common/e1fn":46,"../common/e2fn":47,"../common/e3fn":48,"../common/imlfn":50,"../common/mlfn":52,"../common/msfnz":53}],85:[function(require,module,exports){
var FORTPI = Math.PI/4;
var srat = require('../common/srat');
var HALF_PI = Math.PI/2;
var MAX_ITER = 20;
exports.init = function() {
  var sphi = Math.sin(this.lat0);
  var cphi = Math.cos(this.lat0);
  cphi *= cphi;
  this.rc = Math.sqrt(1 - this.es) / (1 - this.es * sphi * sphi);
  this.C = Math.sqrt(1 + this.es * cphi * cphi / (1 - this.es));
  this.phic0 = Math.asin(sphi / this.C);
  this.ratexp = 0.5 * this.C * this.e;
  this.K = Math.tan(0.5 * this.phic0 + FORTPI) / (Math.pow(Math.tan(0.5 * this.lat0 + FORTPI), this.C) * srat(this.e * sphi, this.ratexp));
};

exports.forward = function(p) {
  var lon = p.x;
  var lat = p.y;

  p.y = 2 * Math.atan(this.K * Math.pow(Math.tan(0.5 * lat + FORTPI), this.C) * srat(this.e * Math.sin(lat), this.ratexp)) - HALF_PI;
  p.x = this.C * lon;
  return p;
};

exports.inverse = function(p) {
  var DEL_TOL = 1e-14;
  var lon = p.x / this.C;
  var lat = p.y;
  var num = Math.pow(Math.tan(0.5 * lat + FORTPI) / this.K, 1 / this.C);
  for (var i = MAX_ITER; i > 0; --i) {
    lat = 2 * Math.atan(num * srat(this.e * Math.sin(p.y), - 0.5 * this.e)) - HALF_PI;
    if (Math.abs(lat - p.y) < DEL_TOL) {
      break;
    }
    p.y = lat;
  }
  /* convergence failed */
  if (!i) {
    return null;
  }
  p.x = lon;
  p.y = lat;
  return p;
};
exports.names = ["gauss"];

},{"../common/srat":60}],86:[function(require,module,exports){
var adjust_lon = require('../common/adjust_lon');
var EPSLN = 1.0e-10;
var asinz = require('../common/asinz');

/*
  reference:
    Wolfram Mathworld "Gnomonic Projection"
    http://mathworld.wolfram.com/GnomonicProjection.html
    Accessed: 12th November 2009
  */
exports.init = function() {

  /* Place parameters in static storage for common use
      -------------------------------------------------*/
  this.sin_p14 = Math.sin(this.lat0);
  this.cos_p14 = Math.cos(this.lat0);
  // Approximation for projecting points to the horizon (infinity)
  this.infinity_dist = 1000 * this.a;
  this.rc = 1;
};


/* Gnomonic forward equations--mapping lat,long to x,y
    ---------------------------------------------------*/
exports.forward = function(p) {
  var sinphi, cosphi; /* sin and cos value        */
  var dlon; /* delta longitude value      */
  var coslon; /* cos of longitude        */
  var ksp; /* scale factor          */
  var g;
  var x, y;
  var lon = p.x;
  var lat = p.y;
  /* Forward equations
      -----------------*/
  dlon = adjust_lon(lon - this.long0);

  sinphi = Math.sin(lat);
  cosphi = Math.cos(lat);

  coslon = Math.cos(dlon);
  g = this.sin_p14 * sinphi + this.cos_p14 * cosphi * coslon;
  ksp = 1;
  if ((g > 0) || (Math.abs(g) <= EPSLN)) {
    x = this.x0 + this.a * ksp * cosphi * Math.sin(dlon) / g;
    y = this.y0 + this.a * ksp * (this.cos_p14 * sinphi - this.sin_p14 * cosphi * coslon) / g;
  }
  else {

    // Point is in the opposing hemisphere and is unprojectable
    // We still need to return a reasonable point, so we project 
    // to infinity, on a bearing 
    // equivalent to the northern hemisphere equivalent
    // This is a reasonable approximation for short shapes and lines that 
    // straddle the horizon.

    x = this.x0 + this.infinity_dist * cosphi * Math.sin(dlon);
    y = this.y0 + this.infinity_dist * (this.cos_p14 * sinphi - this.sin_p14 * cosphi * coslon);

  }
  p.x = x;
  p.y = y;
  return p;
};


exports.inverse = function(p) {
  var rh; /* Rho */
  var sinc, cosc;
  var c;
  var lon, lat;

  /* Inverse equations
      -----------------*/
  p.x = (p.x - this.x0) / this.a;
  p.y = (p.y - this.y0) / this.a;

  p.x /= this.k0;
  p.y /= this.k0;

  if ((rh = Math.sqrt(p.x * p.x + p.y * p.y))) {
    c = Math.atan2(rh, this.rc);
    sinc = Math.sin(c);
    cosc = Math.cos(c);

    lat = asinz(cosc * this.sin_p14 + (p.y * sinc * this.cos_p14) / rh);
    lon = Math.atan2(p.x * sinc, rh * this.cos_p14 * cosc - p.y * this.sin_p14 * sinc);
    lon = adjust_lon(this.long0 + lon);
  }
  else {
    lat = this.phic0;
    lon = 0;
  }

  p.x = lon;
  p.y = lat;
  return p;
};
exports.names = ["gnom"];

},{"../common/adjust_lon":43,"../common/asinz":44}],87:[function(require,module,exports){
var adjust_lon = require('../common/adjust_lon');
exports.init = function() {
  this.a = 6377397.155;
  this.es = 0.006674372230614;
  this.e = Math.sqrt(this.es);
  if (!this.lat0) {
    this.lat0 = 0.863937979737193;
  }
  if (!this.long0) {
    this.long0 = 0.7417649320975901 - 0.308341501185665;
  }
  /* if scale not set default to 0.9999 */
  if (!this.k0) {
    this.k0 = 0.9999;
  }
  this.s45 = 0.785398163397448; /* 45 */
  this.s90 = 2 * this.s45;
  this.fi0 = this.lat0;
  this.e2 = this.es;
  this.e = Math.sqrt(this.e2);
  this.alfa = Math.sqrt(1 + (this.e2 * Math.pow(Math.cos(this.fi0), 4)) / (1 - this.e2));
  this.uq = 1.04216856380474;
  this.u0 = Math.asin(Math.sin(this.fi0) / this.alfa);
  this.g = Math.pow((1 + this.e * Math.sin(this.fi0)) / (1 - this.e * Math.sin(this.fi0)), this.alfa * this.e / 2);
  this.k = Math.tan(this.u0 / 2 + this.s45) / Math.pow(Math.tan(this.fi0 / 2 + this.s45), this.alfa) * this.g;
  this.k1 = this.k0;
  this.n0 = this.a * Math.sqrt(1 - this.e2) / (1 - this.e2 * Math.pow(Math.sin(this.fi0), 2));
  this.s0 = 1.37008346281555;
  this.n = Math.sin(this.s0);
  this.ro0 = this.k1 * this.n0 / Math.tan(this.s0);
  this.ad = this.s90 - this.uq;
};

/* ellipsoid */
/* calculate xy from lat/lon */
/* Constants, identical to inverse transform function */
exports.forward = function(p) {
  var gfi, u, deltav, s, d, eps, ro;
  var lon = p.x;
  var lat = p.y;
  var delta_lon = adjust_lon(lon - this.long0);
  /* Transformation */
  gfi = Math.pow(((1 + this.e * Math.sin(lat)) / (1 - this.e * Math.sin(lat))), (this.alfa * this.e / 2));
  u = 2 * (Math.atan(this.k * Math.pow(Math.tan(lat / 2 + this.s45), this.alfa) / gfi) - this.s45);
  deltav = -delta_lon * this.alfa;
  s = Math.asin(Math.cos(this.ad) * Math.sin(u) + Math.sin(this.ad) * Math.cos(u) * Math.cos(deltav));
  d = Math.asin(Math.cos(u) * Math.sin(deltav) / Math.cos(s));
  eps = this.n * d;
  ro = this.ro0 * Math.pow(Math.tan(this.s0 / 2 + this.s45), this.n) / Math.pow(Math.tan(s / 2 + this.s45), this.n);
  p.y = ro * Math.cos(eps) / 1;
  p.x = ro * Math.sin(eps) / 1;

  if (!this.czech) {
    p.y *= -1;
    p.x *= -1;
  }
  return (p);
};

/* calculate lat/lon from xy */
exports.inverse = function(p) {
  var u, deltav, s, d, eps, ro, fi1;
  var ok;

  /* Transformation */
  /* revert y, x*/
  var tmp = p.x;
  p.x = p.y;
  p.y = tmp;
  if (!this.czech) {
    p.y *= -1;
    p.x *= -1;
  }
  ro = Math.sqrt(p.x * p.x + p.y * p.y);
  eps = Math.atan2(p.y, p.x);
  d = eps / Math.sin(this.s0);
  s = 2 * (Math.atan(Math.pow(this.ro0 / ro, 1 / this.n) * Math.tan(this.s0 / 2 + this.s45)) - this.s45);
  u = Math.asin(Math.cos(this.ad) * Math.sin(s) - Math.sin(this.ad) * Math.cos(s) * Math.cos(d));
  deltav = Math.asin(Math.cos(s) * Math.sin(d) / Math.cos(u));
  p.x = this.long0 - deltav / this.alfa;
  fi1 = u;
  ok = 0;
  var iter = 0;
  do {
    p.y = 2 * (Math.atan(Math.pow(this.k, - 1 / this.alfa) * Math.pow(Math.tan(u / 2 + this.s45), 1 / this.alfa) * Math.pow((1 + this.e * Math.sin(fi1)) / (1 - this.e * Math.sin(fi1)), this.e / 2)) - this.s45);
    if (Math.abs(fi1 - p.y) < 0.0000000001) {
      ok = 1;
    }
    fi1 = p.y;
    iter += 1;
  } while (ok === 0 && iter < 15);
  if (iter >= 15) {
    return null;
  }

  return (p);
};
exports.names = ["Krovak", "krovak"];

},{"../common/adjust_lon":43}],88:[function(require,module,exports){
var HALF_PI = Math.PI/2;
var FORTPI = Math.PI/4;
var EPSLN = 1.0e-10;
var qsfnz = require('../common/qsfnz');
var adjust_lon = require('../common/adjust_lon');
/*
  reference
    "New Equal-Area Map Projections for Noncircular Regions", John P. Snyder,
    The American Cartographer, Vol 15, No. 4, October 1988, pp. 341-355.
  */

exports.S_POLE = 1;
exports.N_POLE = 2;
exports.EQUIT = 3;
exports.OBLIQ = 4;


/* Initialize the Lambert Azimuthal Equal Area projection
  ------------------------------------------------------*/
exports.init = function() {
  var t = Math.abs(this.lat0);
  if (Math.abs(t - HALF_PI) < EPSLN) {
    this.mode = this.lat0 < 0 ? this.S_POLE : this.N_POLE;
  }
  else if (Math.abs(t) < EPSLN) {
    this.mode = this.EQUIT;
  }
  else {
    this.mode = this.OBLIQ;
  }
  if (this.es > 0) {
    var sinphi;

    this.qp = qsfnz(this.e, 1);
    this.mmf = 0.5 / (1 - this.es);
    this.apa = this.authset(this.es);
    switch (this.mode) {
    case this.N_POLE:
      this.dd = 1;
      break;
    case this.S_POLE:
      this.dd = 1;
      break;
    case this.EQUIT:
      this.rq = Math.sqrt(0.5 * this.qp);
      this.dd = 1 / this.rq;
      this.xmf = 1;
      this.ymf = 0.5 * this.qp;
      break;
    case this.OBLIQ:
      this.rq = Math.sqrt(0.5 * this.qp);
      sinphi = Math.sin(this.lat0);
      this.sinb1 = qsfnz(this.e, sinphi) / this.qp;
      this.cosb1 = Math.sqrt(1 - this.sinb1 * this.sinb1);
      this.dd = Math.cos(this.lat0) / (Math.sqrt(1 - this.es * sinphi * sinphi) * this.rq * this.cosb1);
      this.ymf = (this.xmf = this.rq) / this.dd;
      this.xmf *= this.dd;
      break;
    }
  }
  else {
    if (this.mode === this.OBLIQ) {
      this.sinph0 = Math.sin(this.lat0);
      this.cosph0 = Math.cos(this.lat0);
    }
  }
};

/* Lambert Azimuthal Equal Area forward equations--mapping lat,long to x,y
  -----------------------------------------------------------------------*/
exports.forward = function(p) {

  /* Forward equations
      -----------------*/
  var x, y, coslam, sinlam, sinphi, q, sinb, cosb, b, cosphi;
  var lam = p.x;
  var phi = p.y;

  lam = adjust_lon(lam - this.long0);

  if (this.sphere) {
    sinphi = Math.sin(phi);
    cosphi = Math.cos(phi);
    coslam = Math.cos(lam);
    if (this.mode === this.OBLIQ || this.mode === this.EQUIT) {
      y = (this.mode === this.EQUIT) ? 1 + cosphi * coslam : 1 + this.sinph0 * sinphi + this.cosph0 * cosphi * coslam;
      if (y <= EPSLN) {
        return null;
      }
      y = Math.sqrt(2 / y);
      x = y * cosphi * Math.sin(lam);
      y *= (this.mode === this.EQUIT) ? sinphi : this.cosph0 * sinphi - this.sinph0 * cosphi * coslam;
    }
    else if (this.mode === this.N_POLE || this.mode === this.S_POLE) {
      if (this.mode === this.N_POLE) {
        coslam = -coslam;
      }
      if (Math.abs(phi + this.phi0) < EPSLN) {
        return null;
      }
      y = FORTPI - phi * 0.5;
      y = 2 * ((this.mode === this.S_POLE) ? Math.cos(y) : Math.sin(y));
      x = y * Math.sin(lam);
      y *= coslam;
    }
  }
  else {
    sinb = 0;
    cosb = 0;
    b = 0;
    coslam = Math.cos(lam);
    sinlam = Math.sin(lam);
    sinphi = Math.sin(phi);
    q = qsfnz(this.e, sinphi);
    if (this.mode === this.OBLIQ || this.mode === this.EQUIT) {
      sinb = q / this.qp;
      cosb = Math.sqrt(1 - sinb * sinb);
    }
    switch (this.mode) {
    case this.OBLIQ:
      b = 1 + this.sinb1 * sinb + this.cosb1 * cosb * coslam;
      break;
    case this.EQUIT:
      b = 1 + cosb * coslam;
      break;
    case this.N_POLE:
      b = HALF_PI + phi;
      q = this.qp - q;
      break;
    case this.S_POLE:
      b = phi - HALF_PI;
      q = this.qp + q;
      break;
    }
    if (Math.abs(b) < EPSLN) {
      return null;
    }
    switch (this.mode) {
    case this.OBLIQ:
    case this.EQUIT:
      b = Math.sqrt(2 / b);
      if (this.mode === this.OBLIQ) {
        y = this.ymf * b * (this.cosb1 * sinb - this.sinb1 * cosb * coslam);
      }
      else {
        y = (b = Math.sqrt(2 / (1 + cosb * coslam))) * sinb * this.ymf;
      }
      x = this.xmf * b * cosb * sinlam;
      break;
    case this.N_POLE:
    case this.S_POLE:
      if (q >= 0) {
        x = (b = Math.sqrt(q)) * sinlam;
        y = coslam * ((this.mode === this.S_POLE) ? b : -b);
      }
      else {
        x = y = 0;
      }
      break;
    }
  }

  p.x = this.a * x + this.x0;
  p.y = this.a * y + this.y0;
  return p;
};

/* Inverse equations
  -----------------*/
exports.inverse = function(p) {
  p.x -= this.x0;
  p.y -= this.y0;
  var x = p.x / this.a;
  var y = p.y / this.a;
  var lam, phi, cCe, sCe, q, rho, ab;

  if (this.sphere) {
    var cosz = 0,
      rh, sinz = 0;

    rh = Math.sqrt(x * x + y * y);
    phi = rh * 0.5;
    if (phi > 1) {
      return null;
    }
    phi = 2 * Math.asin(phi);
    if (this.mode === this.OBLIQ || this.mode === this.EQUIT) {
      sinz = Math.sin(phi);
      cosz = Math.cos(phi);
    }
    switch (this.mode) {
    case this.EQUIT:
      phi = (Math.abs(rh) <= EPSLN) ? 0 : Math.asin(y * sinz / rh);
      x *= sinz;
      y = cosz * rh;
      break;
    case this.OBLIQ:
      phi = (Math.abs(rh) <= EPSLN) ? this.phi0 : Math.asin(cosz * this.sinph0 + y * sinz * this.cosph0 / rh);
      x *= sinz * this.cosph0;
      y = (cosz - Math.sin(phi) * this.sinph0) * rh;
      break;
    case this.N_POLE:
      y = -y;
      phi = HALF_PI - phi;
      break;
    case this.S_POLE:
      phi -= HALF_PI;
      break;
    }
    lam = (y === 0 && (this.mode === this.EQUIT || this.mode === this.OBLIQ)) ? 0 : Math.atan2(x, y);
  }
  else {
    ab = 0;
    if (this.mode === this.OBLIQ || this.mode === this.EQUIT) {
      x /= this.dd;
      y *= this.dd;
      rho = Math.sqrt(x * x + y * y);
      if (rho < EPSLN) {
        p.x = 0;
        p.y = this.phi0;
        return p;
      }
      sCe = 2 * Math.asin(0.5 * rho / this.rq);
      cCe = Math.cos(sCe);
      x *= (sCe = Math.sin(sCe));
      if (this.mode === this.OBLIQ) {
        ab = cCe * this.sinb1 + y * sCe * this.cosb1 / rho;
        q = this.qp * ab;
        y = rho * this.cosb1 * cCe - y * this.sinb1 * sCe;
      }
      else {
        ab = y * sCe / rho;
        q = this.qp * ab;
        y = rho * cCe;
      }
    }
    else if (this.mode === this.N_POLE || this.mode === this.S_POLE) {
      if (this.mode === this.N_POLE) {
        y = -y;
      }
      q = (x * x + y * y);
      if (!q) {
        p.x = 0;
        p.y = this.phi0;
        return p;
      }
      ab = 1 - q / this.qp;
      if (this.mode === this.S_POLE) {
        ab = -ab;
      }
    }
    lam = Math.atan2(x, y);
    phi = this.authlat(Math.asin(ab), this.apa);
  }


  p.x = adjust_lon(this.long0 + lam);
  p.y = phi;
  return p;
};

/* determine latitude from authalic latitude */
exports.P00 = 0.33333333333333333333;
exports.P01 = 0.17222222222222222222;
exports.P02 = 0.10257936507936507936;
exports.P10 = 0.06388888888888888888;
exports.P11 = 0.06640211640211640211;
exports.P20 = 0.01641501294219154443;

exports.authset = function(es) {
  var t;
  var APA = [];
  APA[0] = es * this.P00;
  t = es * es;
  APA[0] += t * this.P01;
  APA[1] = t * this.P10;
  t *= es;
  APA[0] += t * this.P02;
  APA[1] += t * this.P11;
  APA[2] = t * this.P20;
  return APA;
};

exports.authlat = function(beta, APA) {
  var t = beta + beta;
  return (beta + APA[0] * Math.sin(t) + APA[1] * Math.sin(t + t) + APA[2] * Math.sin(t + t + t));
};
exports.names = ["Lambert Azimuthal Equal Area", "Lambert_Azimuthal_Equal_Area", "laea"];

},{"../common/adjust_lon":43,"../common/qsfnz":58}],89:[function(require,module,exports){
var EPSLN = 1.0e-10;
var msfnz = require('../common/msfnz');
var tsfnz = require('../common/tsfnz');
var HALF_PI = Math.PI/2;
var sign = require('../common/sign');
var adjust_lon = require('../common/adjust_lon');
var phi2z = require('../common/phi2z');
exports.init = function() {

  // array of:  r_maj,r_min,lat1,lat2,c_lon,c_lat,false_east,false_north
  //double c_lat;                   /* center latitude                      */
  //double c_lon;                   /* center longitude                     */
  //double lat1;                    /* first standard parallel              */
  //double lat2;                    /* second standard parallel             */
  //double r_maj;                   /* major axis                           */
  //double r_min;                   /* minor axis                           */
  //double false_east;              /* x offset in meters                   */
  //double false_north;             /* y offset in meters                   */

  if (!this.lat2) {
    this.lat2 = this.lat1;
  } //if lat2 is not defined
  if (!this.k0) {
    this.k0 = 1;
  }
  this.x0 = this.x0 || 0;
  this.y0 = this.y0 || 0;
  // Standard Parallels cannot be equal and on opposite sides of the equator
  if (Math.abs(this.lat1 + this.lat2) < EPSLN) {
    return;
  }

  var temp = this.b / this.a;
  this.e = Math.sqrt(1 - temp * temp);

  var sin1 = Math.sin(this.lat1);
  var cos1 = Math.cos(this.lat1);
  var ms1 = msfnz(this.e, sin1, cos1);
  var ts1 = tsfnz(this.e, this.lat1, sin1);

  var sin2 = Math.sin(this.lat2);
  var cos2 = Math.cos(this.lat2);
  var ms2 = msfnz(this.e, sin2, cos2);
  var ts2 = tsfnz(this.e, this.lat2, sin2);

  var ts0 = tsfnz(this.e, this.lat0, Math.sin(this.lat0));

  if (Math.abs(this.lat1 - this.lat2) > EPSLN) {
    this.ns = Math.log(ms1 / ms2) / Math.log(ts1 / ts2);
  }
  else {
    this.ns = sin1;
  }
  if (isNaN(this.ns)) {
    this.ns = sin1;
  }
  this.f0 = ms1 / (this.ns * Math.pow(ts1, this.ns));
  this.rh = this.a * this.f0 * Math.pow(ts0, this.ns);
  if (!this.title) {
    this.title = "Lambert Conformal Conic";
  }
};


// Lambert Conformal conic forward equations--mapping lat,long to x,y
// -----------------------------------------------------------------
exports.forward = function(p) {

  var lon = p.x;
  var lat = p.y;

  // singular cases :
  if (Math.abs(2 * Math.abs(lat) - Math.PI) <= EPSLN) {
    lat = sign(lat) * (HALF_PI - 2 * EPSLN);
  }

  var con = Math.abs(Math.abs(lat) - HALF_PI);
  var ts, rh1;
  if (con > EPSLN) {
    ts = tsfnz(this.e, lat, Math.sin(lat));
    rh1 = this.a * this.f0 * Math.pow(ts, this.ns);
  }
  else {
    con = lat * this.ns;
    if (con <= 0) {
      return null;
    }
    rh1 = 0;
  }
  var theta = this.ns * adjust_lon(lon - this.long0);
  p.x = this.k0 * (rh1 * Math.sin(theta)) + this.x0;
  p.y = this.k0 * (this.rh - rh1 * Math.cos(theta)) + this.y0;

  return p;
};

// Lambert Conformal Conic inverse equations--mapping x,y to lat/long
// -----------------------------------------------------------------
exports.inverse = function(p) {

  var rh1, con, ts;
  var lat, lon;
  var x = (p.x - this.x0) / this.k0;
  var y = (this.rh - (p.y - this.y0) / this.k0);
  if (this.ns > 0) {
    rh1 = Math.sqrt(x * x + y * y);
    con = 1;
  }
  else {
    rh1 = -Math.sqrt(x * x + y * y);
    con = -1;
  }
  var theta = 0;
  if (rh1 !== 0) {
    theta = Math.atan2((con * x), (con * y));
  }
  if ((rh1 !== 0) || (this.ns > 0)) {
    con = 1 / this.ns;
    ts = Math.pow((rh1 / (this.a * this.f0)), con);
    lat = phi2z(this.e, ts);
    if (lat === -9999) {
      return null;
    }
  }
  else {
    lat = -HALF_PI;
  }
  lon = adjust_lon(theta / this.ns + this.long0);

  p.x = lon;
  p.y = lat;
  return p;
};

exports.names = ["Lambert Tangential Conformal Conic Projection", "Lambert_Conformal_Conic", "Lambert_Conformal_Conic_2SP", "lcc"];

},{"../common/adjust_lon":43,"../common/msfnz":53,"../common/phi2z":54,"../common/sign":59,"../common/tsfnz":62}],90:[function(require,module,exports){
exports.init = function() {
  //no-op for longlat
};

function identity(pt) {
  return pt;
}
exports.forward = identity;
exports.inverse = identity;
exports.names = ["longlat", "identity"];

},{}],91:[function(require,module,exports){
var msfnz = require('../common/msfnz');
var HALF_PI = Math.PI/2;
var EPSLN = 1.0e-10;
var R2D = 57.29577951308232088;
var adjust_lon = require('../common/adjust_lon');
var FORTPI = Math.PI/4;
var tsfnz = require('../common/tsfnz');
var phi2z = require('../common/phi2z');
exports.init = function() {
  var con = this.b / this.a;
  this.es = 1 - con * con;
  if(!('x0' in this)){
    this.x0 = 0;
  }
  if(!('y0' in this)){
    this.y0 = 0;
  }
  this.e = Math.sqrt(this.es);
  if (this.lat_ts) {
    if (this.sphere) {
      this.k0 = Math.cos(this.lat_ts);
    }
    else {
      this.k0 = msfnz(this.e, Math.sin(this.lat_ts), Math.cos(this.lat_ts));
    }
  }
  else {
    if (!this.k0) {
      if (this.k) {
        this.k0 = this.k;
      }
      else {
        this.k0 = 1;
      }
    }
  }
};

/* Mercator forward equations--mapping lat,long to x,y
  --------------------------------------------------*/

exports.forward = function(p) {
  var lon = p.x;
  var lat = p.y;
  // convert to radians
  if (lat * R2D > 90 && lat * R2D < -90 && lon * R2D > 180 && lon * R2D < -180) {
    return null;
  }

  var x, y;
  if (Math.abs(Math.abs(lat) - HALF_PI) <= EPSLN) {
    return null;
  }
  else {
    if (this.sphere) {
      x = this.x0 + this.a * this.k0 * adjust_lon(lon - this.long0);
      y = this.y0 + this.a * this.k0 * Math.log(Math.tan(FORTPI + 0.5 * lat));
    }
    else {
      var sinphi = Math.sin(lat);
      var ts = tsfnz(this.e, lat, sinphi);
      x = this.x0 + this.a * this.k0 * adjust_lon(lon - this.long0);
      y = this.y0 - this.a * this.k0 * Math.log(ts);
    }
    p.x = x;
    p.y = y;
    return p;
  }
};


/* Mercator inverse equations--mapping x,y to lat/long
  --------------------------------------------------*/
exports.inverse = function(p) {

  var x = p.x - this.x0;
  var y = p.y - this.y0;
  var lon, lat;

  if (this.sphere) {
    lat = HALF_PI - 2 * Math.atan(Math.exp(-y / (this.a * this.k0)));
  }
  else {
    var ts = Math.exp(-y / (this.a * this.k0));
    lat = phi2z(this.e, ts);
    if (lat === -9999) {
      return null;
    }
  }
  lon = adjust_lon(this.long0 + x / (this.a * this.k0));

  p.x = lon;
  p.y = lat;
  return p;
};

exports.names = ["Mercator", "Popular Visualisation Pseudo Mercator", "Mercator_1SP", "Mercator_Auxiliary_Sphere", "merc"];

},{"../common/adjust_lon":43,"../common/msfnz":53,"../common/phi2z":54,"../common/tsfnz":62}],92:[function(require,module,exports){
var adjust_lon = require('../common/adjust_lon');
/*
  reference
    "New Equal-Area Map Projections for Noncircular Regions", John P. Snyder,
    The American Cartographer, Vol 15, No. 4, October 1988, pp. 341-355.
  */


/* Initialize the Miller Cylindrical projection
  -------------------------------------------*/
exports.init = function() {
  //no-op
};


/* Miller Cylindrical forward equations--mapping lat,long to x,y
    ------------------------------------------------------------*/
exports.forward = function(p) {
  var lon = p.x;
  var lat = p.y;
  /* Forward equations
      -----------------*/
  var dlon = adjust_lon(lon - this.long0);
  var x = this.x0 + this.a * dlon;
  var y = this.y0 + this.a * Math.log(Math.tan((Math.PI / 4) + (lat / 2.5))) * 1.25;

  p.x = x;
  p.y = y;
  return p;
};

/* Miller Cylindrical inverse equations--mapping x,y to lat/long
    ------------------------------------------------------------*/
exports.inverse = function(p) {
  p.x -= this.x0;
  p.y -= this.y0;

  var lon = adjust_lon(this.long0 + p.x / this.a);
  var lat = 2.5 * (Math.atan(Math.exp(0.8 * p.y / this.a)) - Math.PI / 4);

  p.x = lon;
  p.y = lat;
  return p;
};
exports.names = ["Miller_Cylindrical", "mill"];

},{"../common/adjust_lon":43}],93:[function(require,module,exports){
var adjust_lon = require('../common/adjust_lon');
var EPSLN = 1.0e-10;
exports.init = function() {};

/* Mollweide forward equations--mapping lat,long to x,y
    ----------------------------------------------------*/
exports.forward = function(p) {

  /* Forward equations
      -----------------*/
  var lon = p.x;
  var lat = p.y;

  var delta_lon = adjust_lon(lon - this.long0);
  var theta = lat;
  var con = Math.PI * Math.sin(lat);

  /* Iterate using the Newton-Raphson method to find theta
      -----------------------------------------------------*/
  for (var i = 0; true; i++) {
    var delta_theta = -(theta + Math.sin(theta) - con) / (1 + Math.cos(theta));
    theta += delta_theta;
    if (Math.abs(delta_theta) < EPSLN) {
      break;
    }
  }
  theta /= 2;

  /* If the latitude is 90 deg, force the x coordinate to be "0 + false easting"
       this is done here because of precision problems with "cos(theta)"
       --------------------------------------------------------------------------*/
  if (Math.PI / 2 - Math.abs(lat) < EPSLN) {
    delta_lon = 0;
  }
  var x = 0.900316316158 * this.a * delta_lon * Math.cos(theta) + this.x0;
  var y = 1.4142135623731 * this.a * Math.sin(theta) + this.y0;

  p.x = x;
  p.y = y;
  return p;
};

exports.inverse = function(p) {
  var theta;
  var arg;

  /* Inverse equations
      -----------------*/
  p.x -= this.x0;
  p.y -= this.y0;
  arg = p.y / (1.4142135623731 * this.a);

  /* Because of division by zero problems, 'arg' can not be 1.  Therefore
       a number very close to one is used instead.
       -------------------------------------------------------------------*/
  if (Math.abs(arg) > 0.999999999999) {
    arg = 0.999999999999;
  }
  theta = Math.asin(arg);
  var lon = adjust_lon(this.long0 + (p.x / (0.900316316158 * this.a * Math.cos(theta))));
  if (lon < (-Math.PI)) {
    lon = -Math.PI;
  }
  if (lon > Math.PI) {
    lon = Math.PI;
  }
  arg = (2 * theta + Math.sin(2 * theta)) / Math.PI;
  if (Math.abs(arg) > 1) {
    arg = 1;
  }
  var lat = Math.asin(arg);

  p.x = lon;
  p.y = lat;
  return p;
};
exports.names = ["Mollweide", "moll"];

},{"../common/adjust_lon":43}],94:[function(require,module,exports){
var SEC_TO_RAD = 4.84813681109535993589914102357e-6;
/*
  reference
    Department of Land and Survey Technical Circular 1973/32
      http://www.linz.govt.nz/docs/miscellaneous/nz-map-definition.pdf
    OSG Technical Report 4.1
      http://www.linz.govt.nz/docs/miscellaneous/nzmg.pdf
  */

/**
 * iterations: Number of iterations to refine inverse transform.
 *     0 -> km accuracy
 *     1 -> m accuracy -- suitable for most mapping applications
 *     2 -> mm accuracy
 */
exports.iterations = 1;

exports.init = function() {
  this.A = [];
  this.A[1] = 0.6399175073;
  this.A[2] = -0.1358797613;
  this.A[3] = 0.063294409;
  this.A[4] = -0.02526853;
  this.A[5] = 0.0117879;
  this.A[6] = -0.0055161;
  this.A[7] = 0.0026906;
  this.A[8] = -0.001333;
  this.A[9] = 0.00067;
  this.A[10] = -0.00034;

  this.B_re = [];
  this.B_im = [];
  this.B_re[1] = 0.7557853228;
  this.B_im[1] = 0;
  this.B_re[2] = 0.249204646;
  this.B_im[2] = 0.003371507;
  this.B_re[3] = -0.001541739;
  this.B_im[3] = 0.041058560;
  this.B_re[4] = -0.10162907;
  this.B_im[4] = 0.01727609;
  this.B_re[5] = -0.26623489;
  this.B_im[5] = -0.36249218;
  this.B_re[6] = -0.6870983;
  this.B_im[6] = -1.1651967;

  this.C_re = [];
  this.C_im = [];
  this.C_re[1] = 1.3231270439;
  this.C_im[1] = 0;
  this.C_re[2] = -0.577245789;
  this.C_im[2] = -0.007809598;
  this.C_re[3] = 0.508307513;
  this.C_im[3] = -0.112208952;
  this.C_re[4] = -0.15094762;
  this.C_im[4] = 0.18200602;
  this.C_re[5] = 1.01418179;
  this.C_im[5] = 1.64497696;
  this.C_re[6] = 1.9660549;
  this.C_im[6] = 2.5127645;

  this.D = [];
  this.D[1] = 1.5627014243;
  this.D[2] = 0.5185406398;
  this.D[3] = -0.03333098;
  this.D[4] = -0.1052906;
  this.D[5] = -0.0368594;
  this.D[6] = 0.007317;
  this.D[7] = 0.01220;
  this.D[8] = 0.00394;
  this.D[9] = -0.0013;
};

/**
    New Zealand Map Grid Forward  - long/lat to x/y
    long/lat in radians
  */
exports.forward = function(p) {
  var n;
  var lon = p.x;
  var lat = p.y;

  var delta_lat = lat - this.lat0;
  var delta_lon = lon - this.long0;

  // 1. Calculate d_phi and d_psi    ...                          // and d_lambda
  // For this algorithm, delta_latitude is in seconds of arc x 10-5, so we need to scale to those units. Longitude is radians.
  var d_phi = delta_lat / SEC_TO_RAD * 1E-5;
  var d_lambda = delta_lon;
  var d_phi_n = 1; // d_phi^0

  var d_psi = 0;
  for (n = 1; n <= 10; n++) {
    d_phi_n = d_phi_n * d_phi;
    d_psi = d_psi + this.A[n] * d_phi_n;
  }

  // 2. Calculate theta
  var th_re = d_psi;
  var th_im = d_lambda;

  // 3. Calculate z
  var th_n_re = 1;
  var th_n_im = 0; // theta^0
  var th_n_re1;
  var th_n_im1;

  var z_re = 0;
  var z_im = 0;
  for (n = 1; n <= 6; n++) {
    th_n_re1 = th_n_re * th_re - th_n_im * th_im;
    th_n_im1 = th_n_im * th_re + th_n_re * th_im;
    th_n_re = th_n_re1;
    th_n_im = th_n_im1;
    z_re = z_re + this.B_re[n] * th_n_re - this.B_im[n] * th_n_im;
    z_im = z_im + this.B_im[n] * th_n_re + this.B_re[n] * th_n_im;
  }

  // 4. Calculate easting and northing
  p.x = (z_im * this.a) + this.x0;
  p.y = (z_re * this.a) + this.y0;

  return p;
};


/**
    New Zealand Map Grid Inverse  -  x/y to long/lat
  */
exports.inverse = function(p) {
  var n;
  var x = p.x;
  var y = p.y;

  var delta_x = x - this.x0;
  var delta_y = y - this.y0;

  // 1. Calculate z
  var z_re = delta_y / this.a;
  var z_im = delta_x / this.a;

  // 2a. Calculate theta - first approximation gives km accuracy
  var z_n_re = 1;
  var z_n_im = 0; // z^0
  var z_n_re1;
  var z_n_im1;

  var th_re = 0;
  var th_im = 0;
  for (n = 1; n <= 6; n++) {
    z_n_re1 = z_n_re * z_re - z_n_im * z_im;
    z_n_im1 = z_n_im * z_re + z_n_re * z_im;
    z_n_re = z_n_re1;
    z_n_im = z_n_im1;
    th_re = th_re + this.C_re[n] * z_n_re - this.C_im[n] * z_n_im;
    th_im = th_im + this.C_im[n] * z_n_re + this.C_re[n] * z_n_im;
  }

  // 2b. Iterate to refine the accuracy of the calculation
  //        0 iterations gives km accuracy
  //        1 iteration gives m accuracy -- good enough for most mapping applications
  //        2 iterations bives mm accuracy
  for (var i = 0; i < this.iterations; i++) {
    var th_n_re = th_re;
    var th_n_im = th_im;
    var th_n_re1;
    var th_n_im1;

    var num_re = z_re;
    var num_im = z_im;
    for (n = 2; n <= 6; n++) {
      th_n_re1 = th_n_re * th_re - th_n_im * th_im;
      th_n_im1 = th_n_im * th_re + th_n_re * th_im;
      th_n_re = th_n_re1;
      th_n_im = th_n_im1;
      num_re = num_re + (n - 1) * (this.B_re[n] * th_n_re - this.B_im[n] * th_n_im);
      num_im = num_im + (n - 1) * (this.B_im[n] * th_n_re + this.B_re[n] * th_n_im);
    }

    th_n_re = 1;
    th_n_im = 0;
    var den_re = this.B_re[1];
    var den_im = this.B_im[1];
    for (n = 2; n <= 6; n++) {
      th_n_re1 = th_n_re * th_re - th_n_im * th_im;
      th_n_im1 = th_n_im * th_re + th_n_re * th_im;
      th_n_re = th_n_re1;
      th_n_im = th_n_im1;
      den_re = den_re + n * (this.B_re[n] * th_n_re - this.B_im[n] * th_n_im);
      den_im = den_im + n * (this.B_im[n] * th_n_re + this.B_re[n] * th_n_im);
    }

    // Complex division
    var den2 = den_re * den_re + den_im * den_im;
    th_re = (num_re * den_re + num_im * den_im) / den2;
    th_im = (num_im * den_re - num_re * den_im) / den2;
  }

  // 3. Calculate d_phi              ...                                    // and d_lambda
  var d_psi = th_re;
  var d_lambda = th_im;
  var d_psi_n = 1; // d_psi^0

  var d_phi = 0;
  for (n = 1; n <= 9; n++) {
    d_psi_n = d_psi_n * d_psi;
    d_phi = d_phi + this.D[n] * d_psi_n;
  }

  // 4. Calculate latitude and longitude
  // d_phi is calcuated in second of arc * 10^-5, so we need to scale back to radians. d_lambda is in radians.
  var lat = this.lat0 + (d_phi * SEC_TO_RAD * 1E5);
  var lon = this.long0 + d_lambda;

  p.x = lon;
  p.y = lat;

  return p;
};
exports.names = ["New_Zealand_Map_Grid", "nzmg"];
},{}],95:[function(require,module,exports){
var tsfnz = require('../common/tsfnz');
var adjust_lon = require('../common/adjust_lon');
var phi2z = require('../common/phi2z');
var HALF_PI = Math.PI/2;
var FORTPI = Math.PI/4;
var EPSLN = 1.0e-10;

/* Initialize the Oblique Mercator  projection
    ------------------------------------------*/
exports.init = function() {
  this.no_off = this.no_off || false;
  this.no_rot = this.no_rot || false;

  if (isNaN(this.k0)) {
    this.k0 = 1;
  }
  var sinlat = Math.sin(this.lat0);
  var coslat = Math.cos(this.lat0);
  var con = this.e * sinlat;

  this.bl = Math.sqrt(1 + this.es / (1 - this.es) * Math.pow(coslat, 4));
  this.al = this.a * this.bl * this.k0 * Math.sqrt(1 - this.es) / (1 - con * con);
  var t0 = tsfnz(this.e, this.lat0, sinlat);
  var dl = this.bl / coslat * Math.sqrt((1 - this.es) / (1 - con * con));
  if (dl * dl < 1) {
    dl = 1;
  }
  var fl;
  var gl;
  if (!isNaN(this.longc)) {
    //Central point and azimuth method

    if (this.lat0 >= 0) {
      fl = dl + Math.sqrt(dl * dl - 1);
    }
    else {
      fl = dl - Math.sqrt(dl * dl - 1);
    }
    this.el = fl * Math.pow(t0, this.bl);
    gl = 0.5 * (fl - 1 / fl);
    this.gamma0 = Math.asin(Math.sin(this.alpha) / dl);
    this.long0 = this.longc - Math.asin(gl * Math.tan(this.gamma0)) / this.bl;

  }
  else {
    //2 points method
    var t1 = tsfnz(this.e, this.lat1, Math.sin(this.lat1));
    var t2 = tsfnz(this.e, this.lat2, Math.sin(this.lat2));
    if (this.lat0 >= 0) {
      this.el = (dl + Math.sqrt(dl * dl - 1)) * Math.pow(t0, this.bl);
    }
    else {
      this.el = (dl - Math.sqrt(dl * dl - 1)) * Math.pow(t0, this.bl);
    }
    var hl = Math.pow(t1, this.bl);
    var ll = Math.pow(t2, this.bl);
    fl = this.el / hl;
    gl = 0.5 * (fl - 1 / fl);
    var jl = (this.el * this.el - ll * hl) / (this.el * this.el + ll * hl);
    var pl = (ll - hl) / (ll + hl);
    var dlon12 = adjust_lon(this.long1 - this.long2);
    this.long0 = 0.5 * (this.long1 + this.long2) - Math.atan(jl * Math.tan(0.5 * this.bl * (dlon12)) / pl) / this.bl;
    this.long0 = adjust_lon(this.long0);
    var dlon10 = adjust_lon(this.long1 - this.long0);
    this.gamma0 = Math.atan(Math.sin(this.bl * (dlon10)) / gl);
    this.alpha = Math.asin(dl * Math.sin(this.gamma0));
  }

  if (this.no_off) {
    this.uc = 0;
  }
  else {
    if (this.lat0 >= 0) {
      this.uc = this.al / this.bl * Math.atan2(Math.sqrt(dl * dl - 1), Math.cos(this.alpha));
    }
    else {
      this.uc = -1 * this.al / this.bl * Math.atan2(Math.sqrt(dl * dl - 1), Math.cos(this.alpha));
    }
  }

};


/* Oblique Mercator forward equations--mapping lat,long to x,y
    ----------------------------------------------------------*/
exports.forward = function(p) {
  var lon = p.x;
  var lat = p.y;
  var dlon = adjust_lon(lon - this.long0);
  var us, vs;
  var con;
  if (Math.abs(Math.abs(lat) - HALF_PI) <= EPSLN) {
    if (lat > 0) {
      con = -1;
    }
    else {
      con = 1;
    }
    vs = this.al / this.bl * Math.log(Math.tan(FORTPI + con * this.gamma0 * 0.5));
    us = -1 * con * HALF_PI * this.al / this.bl;
  }
  else {
    var t = tsfnz(this.e, lat, Math.sin(lat));
    var ql = this.el / Math.pow(t, this.bl);
    var sl = 0.5 * (ql - 1 / ql);
    var tl = 0.5 * (ql + 1 / ql);
    var vl = Math.sin(this.bl * (dlon));
    var ul = (sl * Math.sin(this.gamma0) - vl * Math.cos(this.gamma0)) / tl;
    if (Math.abs(Math.abs(ul) - 1) <= EPSLN) {
      vs = Number.POSITIVE_INFINITY;
    }
    else {
      vs = 0.5 * this.al * Math.log((1 - ul) / (1 + ul)) / this.bl;
    }
    if (Math.abs(Math.cos(this.bl * (dlon))) <= EPSLN) {
      us = this.al * this.bl * (dlon);
    }
    else {
      us = this.al * Math.atan2(sl * Math.cos(this.gamma0) + vl * Math.sin(this.gamma0), Math.cos(this.bl * dlon)) / this.bl;
    }
  }

  if (this.no_rot) {
    p.x = this.x0 + us;
    p.y = this.y0 + vs;
  }
  else {

    us -= this.uc;
    p.x = this.x0 + vs * Math.cos(this.alpha) + us * Math.sin(this.alpha);
    p.y = this.y0 + us * Math.cos(this.alpha) - vs * Math.sin(this.alpha);
  }
  return p;
};

exports.inverse = function(p) {
  var us, vs;
  if (this.no_rot) {
    vs = p.y - this.y0;
    us = p.x - this.x0;
  }
  else {
    vs = (p.x - this.x0) * Math.cos(this.alpha) - (p.y - this.y0) * Math.sin(this.alpha);
    us = (p.y - this.y0) * Math.cos(this.alpha) + (p.x - this.x0) * Math.sin(this.alpha);
    us += this.uc;
  }
  var qp = Math.exp(-1 * this.bl * vs / this.al);
  var sp = 0.5 * (qp - 1 / qp);
  var tp = 0.5 * (qp + 1 / qp);
  var vp = Math.sin(this.bl * us / this.al);
  var up = (vp * Math.cos(this.gamma0) + sp * Math.sin(this.gamma0)) / tp;
  var ts = Math.pow(this.el / Math.sqrt((1 + up) / (1 - up)), 1 / this.bl);
  if (Math.abs(up - 1) < EPSLN) {
    p.x = this.long0;
    p.y = HALF_PI;
  }
  else if (Math.abs(up + 1) < EPSLN) {
    p.x = this.long0;
    p.y = -1 * HALF_PI;
  }
  else {
    p.y = phi2z(this.e, ts);
    p.x = adjust_lon(this.long0 - Math.atan2(sp * Math.cos(this.gamma0) - vp * Math.sin(this.gamma0), Math.cos(this.bl * us / this.al)) / this.bl);
  }
  return p;
};

exports.names = ["Hotine_Oblique_Mercator", "Hotine Oblique Mercator", "Hotine_Oblique_Mercator_Azimuth_Natural_Origin", "Hotine_Oblique_Mercator_Azimuth_Center", "omerc"];
},{"../common/adjust_lon":43,"../common/phi2z":54,"../common/tsfnz":62}],96:[function(require,module,exports){
var e0fn = require('../common/e0fn');
var e1fn = require('../common/e1fn');
var e2fn = require('../common/e2fn');
var e3fn = require('../common/e3fn');
var adjust_lon = require('../common/adjust_lon');
var adjust_lat = require('../common/adjust_lat');
var mlfn = require('../common/mlfn');
var EPSLN = 1.0e-10;
var gN = require('../common/gN');
var MAX_ITER = 20;
exports.init = function() {
  /* Place parameters in static storage for common use
      -------------------------------------------------*/
  this.temp = this.b / this.a;
  this.es = 1 - Math.pow(this.temp, 2); // devait etre dans tmerc.js mais n y est pas donc je commente sinon retour de valeurs nulles
  this.e = Math.sqrt(this.es);
  this.e0 = e0fn(this.es);
  this.e1 = e1fn(this.es);
  this.e2 = e2fn(this.es);
  this.e3 = e3fn(this.es);
  this.ml0 = this.a * mlfn(this.e0, this.e1, this.e2, this.e3, this.lat0); //si que des zeros le calcul ne se fait pas
};


/* Polyconic forward equations--mapping lat,long to x,y
    ---------------------------------------------------*/
exports.forward = function(p) {
  var lon = p.x;
  var lat = p.y;
  var x, y, el;
  var dlon = adjust_lon(lon - this.long0);
  el = dlon * Math.sin(lat);
  if (this.sphere) {
    if (Math.abs(lat) <= EPSLN) {
      x = this.a * dlon;
      y = -1 * this.a * this.lat0;
    }
    else {
      x = this.a * Math.sin(el) / Math.tan(lat);
      y = this.a * (adjust_lat(lat - this.lat0) + (1 - Math.cos(el)) / Math.tan(lat));
    }
  }
  else {
    if (Math.abs(lat) <= EPSLN) {
      x = this.a * dlon;
      y = -1 * this.ml0;
    }
    else {
      var nl = gN(this.a, this.e, Math.sin(lat)) / Math.tan(lat);
      x = nl * Math.sin(el);
      y = this.a * mlfn(this.e0, this.e1, this.e2, this.e3, lat) - this.ml0 + nl * (1 - Math.cos(el));
    }

  }
  p.x = x + this.x0;
  p.y = y + this.y0;
  return p;
};


/* Inverse equations
  -----------------*/
exports.inverse = function(p) {
  var lon, lat, x, y, i;
  var al, bl;
  var phi, dphi;
  x = p.x - this.x0;
  y = p.y - this.y0;

  if (this.sphere) {
    if (Math.abs(y + this.a * this.lat0) <= EPSLN) {
      lon = adjust_lon(x / this.a + this.long0);
      lat = 0;
    }
    else {
      al = this.lat0 + y / this.a;
      bl = x * x / this.a / this.a + al * al;
      phi = al;
      var tanphi;
      for (i = MAX_ITER; i; --i) {
        tanphi = Math.tan(phi);
        dphi = -1 * (al * (phi * tanphi + 1) - phi - 0.5 * (phi * phi + bl) * tanphi) / ((phi - al) / tanphi - 1);
        phi += dphi;
        if (Math.abs(dphi) <= EPSLN) {
          lat = phi;
          break;
        }
      }
      lon = adjust_lon(this.long0 + (Math.asin(x * Math.tan(phi) / this.a)) / Math.sin(lat));
    }
  }
  else {
    if (Math.abs(y + this.ml0) <= EPSLN) {
      lat = 0;
      lon = adjust_lon(this.long0 + x / this.a);
    }
    else {

      al = (this.ml0 + y) / this.a;
      bl = x * x / this.a / this.a + al * al;
      phi = al;
      var cl, mln, mlnp, ma;
      var con;
      for (i = MAX_ITER; i; --i) {
        con = this.e * Math.sin(phi);
        cl = Math.sqrt(1 - con * con) * Math.tan(phi);
        mln = this.a * mlfn(this.e0, this.e1, this.e2, this.e3, phi);
        mlnp = this.e0 - 2 * this.e1 * Math.cos(2 * phi) + 4 * this.e2 * Math.cos(4 * phi) - 6 * this.e3 * Math.cos(6 * phi);
        ma = mln / this.a;
        dphi = (al * (cl * ma + 1) - ma - 0.5 * cl * (ma * ma + bl)) / (this.es * Math.sin(2 * phi) * (ma * ma + bl - 2 * al * ma) / (4 * cl) + (al - ma) * (cl * mlnp - 2 / Math.sin(2 * phi)) - mlnp);
        phi -= dphi;
        if (Math.abs(dphi) <= EPSLN) {
          lat = phi;
          break;
        }
      }

      //lat=phi4z(this.e,this.e0,this.e1,this.e2,this.e3,al,bl,0,0);
      cl = Math.sqrt(1 - this.es * Math.pow(Math.sin(lat), 2)) * Math.tan(lat);
      lon = adjust_lon(this.long0 + Math.asin(x * cl / this.a) / Math.sin(lat));
    }
  }

  p.x = lon;
  p.y = lat;
  return p;
};
exports.names = ["Polyconic", "poly"];
},{"../common/adjust_lat":42,"../common/adjust_lon":43,"../common/e0fn":45,"../common/e1fn":46,"../common/e2fn":47,"../common/e3fn":48,"../common/gN":49,"../common/mlfn":52}],97:[function(require,module,exports){
var adjust_lon = require('../common/adjust_lon');
var adjust_lat = require('../common/adjust_lat');
var pj_enfn = require('../common/pj_enfn');
var MAX_ITER = 20;
var pj_mlfn = require('../common/pj_mlfn');
var pj_inv_mlfn = require('../common/pj_inv_mlfn');
var HALF_PI = Math.PI/2;
var EPSLN = 1.0e-10;
var asinz = require('../common/asinz');
exports.init = function() {
  /* Place parameters in static storage for common use
    -------------------------------------------------*/


  if (!this.sphere) {
    this.en = pj_enfn(this.es);
  }
  else {
    this.n = 1;
    this.m = 0;
    this.es = 0;
    this.C_y = Math.sqrt((this.m + 1) / this.n);
    this.C_x = this.C_y / (this.m + 1);
  }

};

/* Sinusoidal forward equations--mapping lat,long to x,y
  -----------------------------------------------------*/
exports.forward = function(p) {
  var x, y;
  var lon = p.x;
  var lat = p.y;
  /* Forward equations
    -----------------*/
  lon = adjust_lon(lon - this.long0);

  if (this.sphere) {
    if (!this.m) {
      lat = this.n !== 1 ? Math.asin(this.n * Math.sin(lat)) : lat;
    }
    else {
      var k = this.n * Math.sin(lat);
      for (var i = MAX_ITER; i; --i) {
        var V = (this.m * lat + Math.sin(lat) - k) / (this.m + Math.cos(lat));
        lat -= V;
        if (Math.abs(V) < EPSLN) {
          break;
        }
      }
    }
    x = this.a * this.C_x * lon * (this.m + Math.cos(lat));
    y = this.a * this.C_y * lat;

  }
  else {

    var s = Math.sin(lat);
    var c = Math.cos(lat);
    y = this.a * pj_mlfn(lat, s, c, this.en);
    x = this.a * lon * c / Math.sqrt(1 - this.es * s * s);
  }

  p.x = x;
  p.y = y;
  return p;
};

exports.inverse = function(p) {
  var lat, temp, lon, s;

  p.x -= this.x0;
  lon = p.x / this.a;
  p.y -= this.y0;
  lat = p.y / this.a;

  if (this.sphere) {
    lat /= this.C_y;
    lon = lon / (this.C_x * (this.m + Math.cos(lat)));
    if (this.m) {
      lat = asinz((this.m * lat + Math.sin(lat)) / this.n);
    }
    else if (this.n !== 1) {
      lat = asinz(Math.sin(lat) / this.n);
    }
    lon = adjust_lon(lon + this.long0);
    lat = adjust_lat(lat);
  }
  else {
    lat = pj_inv_mlfn(p.y / this.a, this.es, this.en);
    s = Math.abs(lat);
    if (s < HALF_PI) {
      s = Math.sin(lat);
      temp = this.long0 + p.x * Math.sqrt(1 - this.es * s * s) / (this.a * Math.cos(lat));
      //temp = this.long0 + p.x / (this.a * Math.cos(lat));
      lon = adjust_lon(temp);
    }
    else if ((s - EPSLN) < HALF_PI) {
      lon = this.long0;
    }
  }
  p.x = lon;
  p.y = lat;
  return p;
};
exports.names = ["Sinusoidal", "sinu"];
},{"../common/adjust_lat":42,"../common/adjust_lon":43,"../common/asinz":44,"../common/pj_enfn":55,"../common/pj_inv_mlfn":56,"../common/pj_mlfn":57}],98:[function(require,module,exports){
/*
  references:
    Formules et constantes pour le Calcul pour la
    projection cylindrique conforme à axe oblique et pour la transformation entre
    des systèmes de référence.
    http://www.swisstopo.admin.ch/internet/swisstopo/fr/home/topics/survey/sys/refsys/switzerland.parsysrelated1.31216.downloadList.77004.DownloadFile.tmp/swissprojectionfr.pdf
  */
exports.init = function() {
  var phy0 = this.lat0;
  this.lambda0 = this.long0;
  var sinPhy0 = Math.sin(phy0);
  var semiMajorAxis = this.a;
  var invF = this.rf;
  var flattening = 1 / invF;
  var e2 = 2 * flattening - Math.pow(flattening, 2);
  var e = this.e = Math.sqrt(e2);
  this.R = this.k0 * semiMajorAxis * Math.sqrt(1 - e2) / (1 - e2 * Math.pow(sinPhy0, 2));
  this.alpha = Math.sqrt(1 + e2 / (1 - e2) * Math.pow(Math.cos(phy0), 4));
  this.b0 = Math.asin(sinPhy0 / this.alpha);
  var k1 = Math.log(Math.tan(Math.PI / 4 + this.b0 / 2));
  var k2 = Math.log(Math.tan(Math.PI / 4 + phy0 / 2));
  var k3 = Math.log((1 + e * sinPhy0) / (1 - e * sinPhy0));
  this.K = k1 - this.alpha * k2 + this.alpha * e / 2 * k3;
};


exports.forward = function(p) {
  var Sa1 = Math.log(Math.tan(Math.PI / 4 - p.y / 2));
  var Sa2 = this.e / 2 * Math.log((1 + this.e * Math.sin(p.y)) / (1 - this.e * Math.sin(p.y)));
  var S = -this.alpha * (Sa1 + Sa2) + this.K;

  // spheric latitude
  var b = 2 * (Math.atan(Math.exp(S)) - Math.PI / 4);

  // spheric longitude
  var I = this.alpha * (p.x - this.lambda0);

  // psoeudo equatorial rotation
  var rotI = Math.atan(Math.sin(I) / (Math.sin(this.b0) * Math.tan(b) + Math.cos(this.b0) * Math.cos(I)));

  var rotB = Math.asin(Math.cos(this.b0) * Math.sin(b) - Math.sin(this.b0) * Math.cos(b) * Math.cos(I));

  p.y = this.R / 2 * Math.log((1 + Math.sin(rotB)) / (1 - Math.sin(rotB))) + this.y0;
  p.x = this.R * rotI + this.x0;
  return p;
};

exports.inverse = function(p) {
  var Y = p.x - this.x0;
  var X = p.y - this.y0;

  var rotI = Y / this.R;
  var rotB = 2 * (Math.atan(Math.exp(X / this.R)) - Math.PI / 4);

  var b = Math.asin(Math.cos(this.b0) * Math.sin(rotB) + Math.sin(this.b0) * Math.cos(rotB) * Math.cos(rotI));
  var I = Math.atan(Math.sin(rotI) / (Math.cos(this.b0) * Math.cos(rotI) - Math.sin(this.b0) * Math.tan(rotB)));

  var lambda = this.lambda0 + I / this.alpha;

  var S = 0;
  var phy = b;
  var prevPhy = -1000;
  var iteration = 0;
  while (Math.abs(phy - prevPhy) > 0.0000001) {
    if (++iteration > 20) {
      //...reportError("omercFwdInfinity");
      return;
    }
    //S = Math.log(Math.tan(Math.PI / 4 + phy / 2));
    S = 1 / this.alpha * (Math.log(Math.tan(Math.PI / 4 + b / 2)) - this.K) + this.e * Math.log(Math.tan(Math.PI / 4 + Math.asin(this.e * Math.sin(phy)) / 2));
    prevPhy = phy;
    phy = 2 * Math.atan(Math.exp(S)) - Math.PI / 2;
  }

  p.x = lambda;
  p.y = phy;
  return p;
};

exports.names = ["somerc"];

},{}],99:[function(require,module,exports){
var HALF_PI = Math.PI/2;
var EPSLN = 1.0e-10;
var sign = require('../common/sign');
var msfnz = require('../common/msfnz');
var tsfnz = require('../common/tsfnz');
var phi2z = require('../common/phi2z');
var adjust_lon = require('../common/adjust_lon');
exports.ssfn_ = function(phit, sinphi, eccen) {
  sinphi *= eccen;
  return (Math.tan(0.5 * (HALF_PI + phit)) * Math.pow((1 - sinphi) / (1 + sinphi), 0.5 * eccen));
};

exports.init = function() {
  this.coslat0 = Math.cos(this.lat0);
  this.sinlat0 = Math.sin(this.lat0);
  if (this.sphere) {
    if (this.k0 === 1 && !isNaN(this.lat_ts) && Math.abs(this.coslat0) <= EPSLN) {
      this.k0 = 0.5 * (1 + sign(this.lat0) * Math.sin(this.lat_ts));
    }
  }
  else {
    if (Math.abs(this.coslat0) <= EPSLN) {
      if (this.lat0 > 0) {
        //North pole
        //trace('stere:north pole');
        this.con = 1;
      }
      else {
        //South pole
        //trace('stere:south pole');
        this.con = -1;
      }
    }
    this.cons = Math.sqrt(Math.pow(1 + this.e, 1 + this.e) * Math.pow(1 - this.e, 1 - this.e));
    if (this.k0 === 1 && !isNaN(this.lat_ts) && Math.abs(this.coslat0) <= EPSLN) {
      this.k0 = 0.5 * this.cons * msfnz(this.e, Math.sin(this.lat_ts), Math.cos(this.lat_ts)) / tsfnz(this.e, this.con * this.lat_ts, this.con * Math.sin(this.lat_ts));
    }
    this.ms1 = msfnz(this.e, this.sinlat0, this.coslat0);
    this.X0 = 2 * Math.atan(this.ssfn_(this.lat0, this.sinlat0, this.e)) - HALF_PI;
    this.cosX0 = Math.cos(this.X0);
    this.sinX0 = Math.sin(this.X0);
  }
};

// Stereographic forward equations--mapping lat,long to x,y
exports.forward = function(p) {
  var lon = p.x;
  var lat = p.y;
  var sinlat = Math.sin(lat);
  var coslat = Math.cos(lat);
  var A, X, sinX, cosX, ts, rh;
  var dlon = adjust_lon(lon - this.long0);

  if (Math.abs(Math.abs(lon - this.long0) - Math.PI) <= EPSLN && Math.abs(lat + this.lat0) <= EPSLN) {
    //case of the origine point
    //trace('stere:this is the origin point');
    p.x = NaN;
    p.y = NaN;
    return p;
  }
  if (this.sphere) {
    //trace('stere:sphere case');
    A = 2 * this.k0 / (1 + this.sinlat0 * sinlat + this.coslat0 * coslat * Math.cos(dlon));
    p.x = this.a * A * coslat * Math.sin(dlon) + this.x0;
    p.y = this.a * A * (this.coslat0 * sinlat - this.sinlat0 * coslat * Math.cos(dlon)) + this.y0;
    return p;
  }
  else {
    X = 2 * Math.atan(this.ssfn_(lat, sinlat, this.e)) - HALF_PI;
    cosX = Math.cos(X);
    sinX = Math.sin(X);
    if (Math.abs(this.coslat0) <= EPSLN) {
      ts = tsfnz(this.e, lat * this.con, this.con * sinlat);
      rh = 2 * this.a * this.k0 * ts / this.cons;
      p.x = this.x0 + rh * Math.sin(lon - this.long0);
      p.y = this.y0 - this.con * rh * Math.cos(lon - this.long0);
      //trace(p.toString());
      return p;
    }
    else if (Math.abs(this.sinlat0) < EPSLN) {
      //Eq
      //trace('stere:equateur');
      A = 2 * this.a * this.k0 / (1 + cosX * Math.cos(dlon));
      p.y = A * sinX;
    }
    else {
      //other case
      //trace('stere:normal case');
      A = 2 * this.a * this.k0 * this.ms1 / (this.cosX0 * (1 + this.sinX0 * sinX + this.cosX0 * cosX * Math.cos(dlon)));
      p.y = A * (this.cosX0 * sinX - this.sinX0 * cosX * Math.cos(dlon)) + this.y0;
    }
    p.x = A * cosX * Math.sin(dlon) + this.x0;
  }
  //trace(p.toString());
  return p;
};


//* Stereographic inverse equations--mapping x,y to lat/long
exports.inverse = function(p) {
  p.x -= this.x0;
  p.y -= this.y0;
  var lon, lat, ts, ce, Chi;
  var rh = Math.sqrt(p.x * p.x + p.y * p.y);
  if (this.sphere) {
    var c = 2 * Math.atan(rh / (0.5 * this.a * this.k0));
    lon = this.long0;
    lat = this.lat0;
    if (rh <= EPSLN) {
      p.x = lon;
      p.y = lat;
      return p;
    }
    lat = Math.asin(Math.cos(c) * this.sinlat0 + p.y * Math.sin(c) * this.coslat0 / rh);
    if (Math.abs(this.coslat0) < EPSLN) {
      if (this.lat0 > 0) {
        lon = adjust_lon(this.long0 + Math.atan2(p.x, - 1 * p.y));
      }
      else {
        lon = adjust_lon(this.long0 + Math.atan2(p.x, p.y));
      }
    }
    else {
      lon = adjust_lon(this.long0 + Math.atan2(p.x * Math.sin(c), rh * this.coslat0 * Math.cos(c) - p.y * this.sinlat0 * Math.sin(c)));
    }
    p.x = lon;
    p.y = lat;
    return p;
  }
  else {
    if (Math.abs(this.coslat0) <= EPSLN) {
      if (rh <= EPSLN) {
        lat = this.lat0;
        lon = this.long0;
        p.x = lon;
        p.y = lat;
        //trace(p.toString());
        return p;
      }
      p.x *= this.con;
      p.y *= this.con;
      ts = rh * this.cons / (2 * this.a * this.k0);
      lat = this.con * phi2z(this.e, ts);
      lon = this.con * adjust_lon(this.con * this.long0 + Math.atan2(p.x, - 1 * p.y));
    }
    else {
      ce = 2 * Math.atan(rh * this.cosX0 / (2 * this.a * this.k0 * this.ms1));
      lon = this.long0;
      if (rh <= EPSLN) {
        Chi = this.X0;
      }
      else {
        Chi = Math.asin(Math.cos(ce) * this.sinX0 + p.y * Math.sin(ce) * this.cosX0 / rh);
        lon = adjust_lon(this.long0 + Math.atan2(p.x * Math.sin(ce), rh * this.cosX0 * Math.cos(ce) - p.y * this.sinX0 * Math.sin(ce)));
      }
      lat = -1 * phi2z(this.e, Math.tan(0.5 * (HALF_PI + Chi)));
    }
  }
  p.x = lon;
  p.y = lat;

  //trace(p.toString());
  return p;

};
exports.names = ["stere", "Stereographic_South_Pole", "Polar Stereographic (variant B)"];

},{"../common/adjust_lon":43,"../common/msfnz":53,"../common/phi2z":54,"../common/sign":59,"../common/tsfnz":62}],100:[function(require,module,exports){
var gauss = require('./gauss');
var adjust_lon = require('../common/adjust_lon');
exports.init = function() {
  gauss.init.apply(this);
  if (!this.rc) {
    return;
  }
  this.sinc0 = Math.sin(this.phic0);
  this.cosc0 = Math.cos(this.phic0);
  this.R2 = 2 * this.rc;
  if (!this.title) {
    this.title = "Oblique Stereographic Alternative";
  }
};

exports.forward = function(p) {
  var sinc, cosc, cosl, k;
  p.x = adjust_lon(p.x - this.long0);
  gauss.forward.apply(this, [p]);
  sinc = Math.sin(p.y);
  cosc = Math.cos(p.y);
  cosl = Math.cos(p.x);
  k = this.k0 * this.R2 / (1 + this.sinc0 * sinc + this.cosc0 * cosc * cosl);
  p.x = k * cosc * Math.sin(p.x);
  p.y = k * (this.cosc0 * sinc - this.sinc0 * cosc * cosl);
  p.x = this.a * p.x + this.x0;
  p.y = this.a * p.y + this.y0;
  return p;
};

exports.inverse = function(p) {
  var sinc, cosc, lon, lat, rho;
  p.x = (p.x - this.x0) / this.a;
  p.y = (p.y - this.y0) / this.a;

  p.x /= this.k0;
  p.y /= this.k0;
  if ((rho = Math.sqrt(p.x * p.x + p.y * p.y))) {
    var c = 2 * Math.atan2(rho, this.R2);
    sinc = Math.sin(c);
    cosc = Math.cos(c);
    lat = Math.asin(cosc * this.sinc0 + p.y * sinc * this.cosc0 / rho);
    lon = Math.atan2(p.x * sinc, rho * this.cosc0 * cosc - p.y * this.sinc0 * sinc);
  }
  else {
    lat = this.phic0;
    lon = 0;
  }

  p.x = lon;
  p.y = lat;
  gauss.inverse.apply(this, [p]);
  p.x = adjust_lon(p.x + this.long0);
  return p;
};

exports.names = ["Stereographic_North_Pole", "Oblique_Stereographic", "Polar_Stereographic", "sterea","Oblique Stereographic Alternative"];

},{"../common/adjust_lon":43,"./gauss":85}],101:[function(require,module,exports){
var e0fn = require('../common/e0fn');
var e1fn = require('../common/e1fn');
var e2fn = require('../common/e2fn');
var e3fn = require('../common/e3fn');
var mlfn = require('../common/mlfn');
var adjust_lon = require('../common/adjust_lon');
var HALF_PI = Math.PI/2;
var EPSLN = 1.0e-10;
var sign = require('../common/sign');
var asinz = require('../common/asinz');

exports.init = function() {
  this.e0 = e0fn(this.es);
  this.e1 = e1fn(this.es);
  this.e2 = e2fn(this.es);
  this.e3 = e3fn(this.es);
  this.ml0 = this.a * mlfn(this.e0, this.e1, this.e2, this.e3, this.lat0);
};

/**
    Transverse Mercator Forward  - long/lat to x/y
    long/lat in radians
  */
exports.forward = function(p) {
  var lon = p.x;
  var lat = p.y;

  var delta_lon = adjust_lon(lon - this.long0);
  var con;
  var x, y;
  var sin_phi = Math.sin(lat);
  var cos_phi = Math.cos(lat);

  if (this.sphere) {
    var b = cos_phi * Math.sin(delta_lon);
    if ((Math.abs(Math.abs(b) - 1)) < 0.0000000001) {
      return (93);
    }
    else {
      x = 0.5 * this.a * this.k0 * Math.log((1 + b) / (1 - b));
      con = Math.acos(cos_phi * Math.cos(delta_lon) / Math.sqrt(1 - b * b));
      if (lat < 0) {
        con = -con;
      }
      y = this.a * this.k0 * (con - this.lat0);
    }
  }
  else {
    var al = cos_phi * delta_lon;
    var als = Math.pow(al, 2);
    var c = this.ep2 * Math.pow(cos_phi, 2);
    var tq = Math.tan(lat);
    var t = Math.pow(tq, 2);
    con = 1 - this.es * Math.pow(sin_phi, 2);
    var n = this.a / Math.sqrt(con);
    var ml = this.a * mlfn(this.e0, this.e1, this.e2, this.e3, lat);

    x = this.k0 * n * al * (1 + als / 6 * (1 - t + c + als / 20 * (5 - 18 * t + Math.pow(t, 2) + 72 * c - 58 * this.ep2))) + this.x0;
    y = this.k0 * (ml - this.ml0 + n * tq * (als * (0.5 + als / 24 * (5 - t + 9 * c + 4 * Math.pow(c, 2) + als / 30 * (61 - 58 * t + Math.pow(t, 2) + 600 * c - 330 * this.ep2))))) + this.y0;

  }
  p.x = x;
  p.y = y;
  return p;
};

/**
    Transverse Mercator Inverse  -  x/y to long/lat
  */
exports.inverse = function(p) {
  var con, phi;
  var delta_phi;
  var i;
  var max_iter = 6;
  var lat, lon;

  if (this.sphere) {
    var f = Math.exp(p.x / (this.a * this.k0));
    var g = 0.5 * (f - 1 / f);
    var temp = this.lat0 + p.y / (this.a * this.k0);
    var h = Math.cos(temp);
    con = Math.sqrt((1 - h * h) / (1 + g * g));
    lat = asinz(con);
    if (temp < 0) {
      lat = -lat;
    }
    if ((g === 0) && (h === 0)) {
      lon = this.long0;
    }
    else {
      lon = adjust_lon(Math.atan2(g, h) + this.long0);
    }
  }
  else { // ellipsoidal form
    var x = p.x - this.x0;
    var y = p.y - this.y0;

    con = (this.ml0 + y / this.k0) / this.a;
    phi = con;
    for (i = 0; true; i++) {
      delta_phi = ((con + this.e1 * Math.sin(2 * phi) - this.e2 * Math.sin(4 * phi) + this.e3 * Math.sin(6 * phi)) / this.e0) - phi;
      phi += delta_phi;
      if (Math.abs(delta_phi) <= EPSLN) {
        break;
      }
      if (i >= max_iter) {
        return (95);
      }
    } // for()
    if (Math.abs(phi) < HALF_PI) {
      var sin_phi = Math.sin(phi);
      var cos_phi = Math.cos(phi);
      var tan_phi = Math.tan(phi);
      var c = this.ep2 * Math.pow(cos_phi, 2);
      var cs = Math.pow(c, 2);
      var t = Math.pow(tan_phi, 2);
      var ts = Math.pow(t, 2);
      con = 1 - this.es * Math.pow(sin_phi, 2);
      var n = this.a / Math.sqrt(con);
      var r = n * (1 - this.es) / con;
      var d = x / (n * this.k0);
      var ds = Math.pow(d, 2);
      lat = phi - (n * tan_phi * ds / r) * (0.5 - ds / 24 * (5 + 3 * t + 10 * c - 4 * cs - 9 * this.ep2 - ds / 30 * (61 + 90 * t + 298 * c + 45 * ts - 252 * this.ep2 - 3 * cs)));
      lon = adjust_lon(this.long0 + (d * (1 - ds / 6 * (1 + 2 * t + c - ds / 20 * (5 - 2 * c + 28 * t - 3 * cs + 8 * this.ep2 + 24 * ts))) / cos_phi));
    }
    else {
      lat = HALF_PI * sign(y);
      lon = this.long0;
    }
  }
  p.x = lon;
  p.y = lat;
  return p;
};
exports.names = ["Transverse_Mercator", "Transverse Mercator", "tmerc"];

},{"../common/adjust_lon":43,"../common/asinz":44,"../common/e0fn":45,"../common/e1fn":46,"../common/e2fn":47,"../common/e3fn":48,"../common/mlfn":52,"../common/sign":59}],102:[function(require,module,exports){
var D2R = 0.01745329251994329577;
var tmerc = require('./tmerc');
exports.dependsOn = 'tmerc';
exports.init = function() {
  if (!this.zone) {
    return;
  }
  this.lat0 = 0;
  this.long0 = ((6 * Math.abs(this.zone)) - 183) * D2R;
  this.x0 = 500000;
  this.y0 = this.utmSouth ? 10000000 : 0;
  this.k0 = 0.9996;

  tmerc.init.apply(this);
  this.forward = tmerc.forward;
  this.inverse = tmerc.inverse;
};
exports.names = ["Universal Transverse Mercator System", "utm"];

},{"./tmerc":101}],103:[function(require,module,exports){
var adjust_lon = require('../common/adjust_lon');
var HALF_PI = Math.PI/2;
var EPSLN = 1.0e-10;
var asinz = require('../common/asinz');
/* Initialize the Van Der Grinten projection
  ----------------------------------------*/
exports.init = function() {
  //this.R = 6370997; //Radius of earth
  this.R = this.a;
};

exports.forward = function(p) {

  var lon = p.x;
  var lat = p.y;

  /* Forward equations
    -----------------*/
  var dlon = adjust_lon(lon - this.long0);
  var x, y;

  if (Math.abs(lat) <= EPSLN) {
    x = this.x0 + this.R * dlon;
    y = this.y0;
  }
  var theta = asinz(2 * Math.abs(lat / Math.PI));
  if ((Math.abs(dlon) <= EPSLN) || (Math.abs(Math.abs(lat) - HALF_PI) <= EPSLN)) {
    x = this.x0;
    if (lat >= 0) {
      y = this.y0 + Math.PI * this.R * Math.tan(0.5 * theta);
    }
    else {
      y = this.y0 + Math.PI * this.R * -Math.tan(0.5 * theta);
    }
    //  return(OK);
  }
  var al = 0.5 * Math.abs((Math.PI / dlon) - (dlon / Math.PI));
  var asq = al * al;
  var sinth = Math.sin(theta);
  var costh = Math.cos(theta);

  var g = costh / (sinth + costh - 1);
  var gsq = g * g;
  var m = g * (2 / sinth - 1);
  var msq = m * m;
  var con = Math.PI * this.R * (al * (g - msq) + Math.sqrt(asq * (g - msq) * (g - msq) - (msq + asq) * (gsq - msq))) / (msq + asq);
  if (dlon < 0) {
    con = -con;
  }
  x = this.x0 + con;
  //con = Math.abs(con / (Math.PI * this.R));
  var q = asq + g;
  con = Math.PI * this.R * (m * q - al * Math.sqrt((msq + asq) * (asq + 1) - q * q)) / (msq + asq);
  if (lat >= 0) {
    //y = this.y0 + Math.PI * this.R * Math.sqrt(1 - con * con - 2 * al * con);
    y = this.y0 + con;
  }
  else {
    //y = this.y0 - Math.PI * this.R * Math.sqrt(1 - con * con - 2 * al * con);
    y = this.y0 - con;
  }
  p.x = x;
  p.y = y;
  return p;
};

/* Van Der Grinten inverse equations--mapping x,y to lat/long
  ---------------------------------------------------------*/
exports.inverse = function(p) {
  var lon, lat;
  var xx, yy, xys, c1, c2, c3;
  var a1;
  var m1;
  var con;
  var th1;
  var d;

  /* inverse equations
    -----------------*/
  p.x -= this.x0;
  p.y -= this.y0;
  con = Math.PI * this.R;
  xx = p.x / con;
  yy = p.y / con;
  xys = xx * xx + yy * yy;
  c1 = -Math.abs(yy) * (1 + xys);
  c2 = c1 - 2 * yy * yy + xx * xx;
  c3 = -2 * c1 + 1 + 2 * yy * yy + xys * xys;
  d = yy * yy / c3 + (2 * c2 * c2 * c2 / c3 / c3 / c3 - 9 * c1 * c2 / c3 / c3) / 27;
  a1 = (c1 - c2 * c2 / 3 / c3) / c3;
  m1 = 2 * Math.sqrt(-a1 / 3);
  con = ((3 * d) / a1) / m1;
  if (Math.abs(con) > 1) {
    if (con >= 0) {
      con = 1;
    }
    else {
      con = -1;
    }
  }
  th1 = Math.acos(con) / 3;
  if (p.y >= 0) {
    lat = (-m1 * Math.cos(th1 + Math.PI / 3) - c2 / 3 / c3) * Math.PI;
  }
  else {
    lat = -(-m1 * Math.cos(th1 + Math.PI / 3) - c2 / 3 / c3) * Math.PI;
  }

  if (Math.abs(xx) < EPSLN) {
    lon = this.long0;
  }
  else {
    lon = adjust_lon(this.long0 + Math.PI * (xys - 1 + Math.sqrt(1 + 2 * (xx * xx - yy * yy) + xys * xys)) / 2 / xx);
  }

  p.x = lon;
  p.y = lat;
  return p;
};
exports.names = ["Van_der_Grinten_I", "VanDerGrinten", "vandg"];
},{"../common/adjust_lon":43,"../common/asinz":44}],104:[function(require,module,exports){
var D2R = 0.01745329251994329577;
var R2D = 57.29577951308232088;
var PJD_3PARAM = 1;
var PJD_7PARAM = 2;
var datum_transform = require('./datum_transform');
var adjust_axis = require('./adjust_axis');
var proj = require('./Proj');
var toPoint = require('./common/toPoint');
module.exports = function transform(source, dest, point) {
  var wgs84;
  if (Array.isArray(point)) {
    point = toPoint(point);
  }
  function checkNotWGS(source, dest) {
    return ((source.datum.datum_type === PJD_3PARAM || source.datum.datum_type === PJD_7PARAM) && dest.datumCode !== "WGS84");
  }

  // Workaround for datum shifts towgs84, if either source or destination projection is not wgs84
  if (source.datum && dest.datum && (checkNotWGS(source, dest) || checkNotWGS(dest, source))) {
    wgs84 = new proj('WGS84');
    transform(source, wgs84, point);
    source = wgs84;
  }
  // DGR, 2010/11/12
  if (source.axis !== "enu") {
    adjust_axis(source, false, point);
  }
  // Transform source points to long/lat, if they aren't already.
  if (source.projName === "longlat") {
    point.x *= D2R; // convert degrees to radians
    point.y *= D2R;
  }
  else {
    if (source.to_meter) {
      point.x *= source.to_meter;
      point.y *= source.to_meter;
    }
    source.inverse(point); // Convert Cartesian to longlat
  }
  // Adjust for the prime meridian if necessary
  if (source.from_greenwich) {
    point.x += source.from_greenwich;
  }

  // Convert datums if needed, and if possible.
  point = datum_transform(source.datum, dest.datum, point);

  // Adjust for the prime meridian if necessary
  if (dest.from_greenwich) {
    point.x -= dest.from_greenwich;
  }

  if (dest.projName === "longlat") {
    // convert radians to decimal degrees
    point.x *= R2D;
    point.y *= R2D;
  }
  else { // else project
    dest.forward(point);
    if (dest.to_meter) {
      point.x /= dest.to_meter;
      point.y /= dest.to_meter;
    }
  }

  // DGR, 2010/11/12
  if (dest.axis !== "enu") {
    adjust_axis(dest, true, point);
  }

  return point;
};
},{"./Proj":40,"./adjust_axis":41,"./common/toPoint":61,"./datum_transform":69}],105:[function(require,module,exports){
var D2R = 0.01745329251994329577;
var extend = require('./extend');

function mapit(obj, key, v) {
  obj[key] = v.map(function(aa) {
    var o = {};
    sExpr(aa, o);
    return o;
  }).reduce(function(a, b) {
    return extend(a, b);
  }, {});
}

function sExpr(v, obj) {
  var key;
  if (!Array.isArray(v)) {
    obj[v] = true;
    return;
  }
  else {
    key = v.shift();
    if (key === 'PARAMETER') {
      key = v.shift();
    }
    if (v.length === 1) {
      if (Array.isArray(v[0])) {
        obj[key] = {};
        sExpr(v[0], obj[key]);
      }
      else {
        obj[key] = v[0];
      }
    }
    else if (!v.length) {
      obj[key] = true;
    }
    else if (key === 'TOWGS84') {
      obj[key] = v;
    }
    else {
      obj[key] = {};
      if (['UNIT', 'PRIMEM', 'VERT_DATUM'].indexOf(key) > -1) {
        obj[key] = {
          name: v[0].toLowerCase(),
          convert: v[1]
        };
        if (v.length === 3) {
          obj[key].auth = v[2];
        }
      }
      else if (key === 'SPHEROID') {
        obj[key] = {
          name: v[0],
          a: v[1],
          rf: v[2]
        };
        if (v.length === 4) {
          obj[key].auth = v[3];
        }
      }
      else if (['GEOGCS', 'GEOCCS', 'DATUM', 'VERT_CS', 'COMPD_CS', 'LOCAL_CS', 'FITTED_CS', 'LOCAL_DATUM'].indexOf(key) > -1) {
        v[0] = ['name', v[0]];
        mapit(obj, key, v);
      }
      else if (v.every(function(aa) {
        return Array.isArray(aa);
      })) {
        mapit(obj, key, v);
      }
      else {
        sExpr(v, obj[key]);
      }
    }
  }
}

function rename(obj, params) {
  var outName = params[0];
  var inName = params[1];
  if (!(outName in obj) && (inName in obj)) {
    obj[outName] = obj[inName];
    if (params.length === 3) {
      obj[outName] = params[2](obj[outName]);
    }
  }
}

function d2r(input) {
  return input * D2R;
}

function cleanWKT(wkt) {
  if (wkt.type === 'GEOGCS') {
    wkt.projName = 'longlat';
  }
  else if (wkt.type === 'LOCAL_CS') {
    wkt.projName = 'identity';
    wkt.local = true;
  }
  else {
    if (typeof wkt.PROJECTION === "object") {
      wkt.projName = Object.keys(wkt.PROJECTION)[0];
    }
    else {
      wkt.projName = wkt.PROJECTION;
    }
  }
  if (wkt.UNIT) {
    wkt.units = wkt.UNIT.name.toLowerCase();
    if (wkt.units === 'metre') {
      wkt.units = 'meter';
    }
    if (wkt.UNIT.convert) {
      if (wkt.type === 'GEOGCS') {
        if (wkt.DATUM && wkt.DATUM.SPHEROID) {
          wkt.to_meter = parseFloat(wkt.UNIT.convert, 10)*wkt.DATUM.SPHEROID.a;
        }
      } else {
        wkt.to_meter = parseFloat(wkt.UNIT.convert, 10);
      }
    }
  }

  if (wkt.GEOGCS) {
    //if(wkt.GEOGCS.PRIMEM&&wkt.GEOGCS.PRIMEM.convert){
    //  wkt.from_greenwich=wkt.GEOGCS.PRIMEM.convert*D2R;
    //}
    if (wkt.GEOGCS.DATUM) {
      wkt.datumCode = wkt.GEOGCS.DATUM.name.toLowerCase();
    }
    else {
      wkt.datumCode = wkt.GEOGCS.name.toLowerCase();
    }
    if (wkt.datumCode.slice(0, 2) === 'd_') {
      wkt.datumCode = wkt.datumCode.slice(2);
    }
    if (wkt.datumCode === 'new_zealand_geodetic_datum_1949' || wkt.datumCode === 'new_zealand_1949') {
      wkt.datumCode = 'nzgd49';
    }
    if (wkt.datumCode === "wgs_1984") {
      if (wkt.PROJECTION === 'Mercator_Auxiliary_Sphere') {
        wkt.sphere = true;
      }
      wkt.datumCode = 'wgs84';
    }
    if (wkt.datumCode.slice(-6) === '_ferro') {
      wkt.datumCode = wkt.datumCode.slice(0, - 6);
    }
    if (wkt.datumCode.slice(-8) === '_jakarta') {
      wkt.datumCode = wkt.datumCode.slice(0, - 8);
    }
    if (~wkt.datumCode.indexOf('belge')) {
      wkt.datumCode = "rnb72";
    }
    if (wkt.GEOGCS.DATUM && wkt.GEOGCS.DATUM.SPHEROID) {
      wkt.ellps = wkt.GEOGCS.DATUM.SPHEROID.name.replace('_19', '').replace(/[Cc]larke\_18/, 'clrk');
      if (wkt.ellps.toLowerCase().slice(0, 13) === "international") {
        wkt.ellps = 'intl';
      }

      wkt.a = wkt.GEOGCS.DATUM.SPHEROID.a;
      wkt.rf = parseFloat(wkt.GEOGCS.DATUM.SPHEROID.rf, 10);
    }
    if (~wkt.datumCode.indexOf('osgb_1936')) {
      wkt.datumCode = "osgb36";
    }
  }
  if (wkt.b && !isFinite(wkt.b)) {
    wkt.b = wkt.a;
  }

  function toMeter(input) {
    var ratio = wkt.to_meter || 1;
    return parseFloat(input, 10) * ratio;
  }
  var renamer = function(a) {
    return rename(wkt, a);
  };
  var list = [
    ['standard_parallel_1', 'Standard_Parallel_1'],
    ['standard_parallel_2', 'Standard_Parallel_2'],
    ['false_easting', 'False_Easting'],
    ['false_northing', 'False_Northing'],
    ['central_meridian', 'Central_Meridian'],
    ['latitude_of_origin', 'Latitude_Of_Origin'],
    ['latitude_of_origin', 'Central_Parallel'],
    ['scale_factor', 'Scale_Factor'],
    ['k0', 'scale_factor'],
    ['latitude_of_center', 'Latitude_of_center'],
    ['lat0', 'latitude_of_center', d2r],
    ['longitude_of_center', 'Longitude_Of_Center'],
    ['longc', 'longitude_of_center', d2r],
    ['x0', 'false_easting', toMeter],
    ['y0', 'false_northing', toMeter],
    ['long0', 'central_meridian', d2r],
    ['lat0', 'latitude_of_origin', d2r],
    ['lat0', 'standard_parallel_1', d2r],
    ['lat1', 'standard_parallel_1', d2r],
    ['lat2', 'standard_parallel_2', d2r],
    ['alpha', 'azimuth', d2r],
    ['srsCode', 'name']
  ];
  list.forEach(renamer);
  if (!wkt.long0 && wkt.longc && (wkt.projName === 'Albers_Conic_Equal_Area' || wkt.projName === "Lambert_Azimuthal_Equal_Area")) {
    wkt.long0 = wkt.longc;
  }
  if (!wkt.lat_ts && wkt.lat1 && (wkt.projName === 'Stereographic_South_Pole' || wkt.projName === 'Polar Stereographic (variant B)')) {
    wkt.lat0 = d2r(wkt.lat1 > 0 ? 90 : -90);
    wkt.lat_ts = wkt.lat1;
  }
}
module.exports = function(wkt, self) {
  var lisp = JSON.parse(("," + wkt).replace(/\s*\,\s*([A-Z_0-9]+?)(\[)/g, ',["$1",').slice(1).replace(/\s*\,\s*([A-Z_0-9]+?)\]/g, ',"$1"]').replace(/,\["VERTCS".+/,''));
  var type = lisp.shift();
  var name = lisp.shift();
  lisp.unshift(['name', name]);
  lisp.unshift(['type', type]);
  lisp.unshift('output');
  var obj = {};
  sExpr(lisp, obj);
  cleanWKT(obj.output);
  return extend(self, obj.output);
};

},{"./extend":72}],106:[function(require,module,exports){
module.exports={
  "_args": [
    [
      "proj4@^2.3.12",
      "/Users/mh/Documents/www/vidi/node_modules/reproject"
    ]
  ],
  "_from": "proj4@>=2.3.12 <3.0.0",
  "_id": "proj4@2.3.14",
  "_inCache": true,
  "_installable": true,
  "_location": "/proj4",
  "_nodeVersion": "4.2.6",
  "_npmOperationalInternal": {
    "host": "packages-13-west.internal.npmjs.com",
    "tmp": "tmp/proj4-2.3.14.tgz_1457689264880_0.9409773757215589"
  },
  "_npmUser": {
    "email": "andreas.hocevar@gmail.com",
    "name": "ahocevar"
  },
  "_npmVersion": "2.14.12",
  "_phantomChildren": {},
  "_requested": {
    "name": "proj4",
    "raw": "proj4@^2.3.12",
    "rawSpec": "^2.3.12",
    "scope": null,
    "spec": ">=2.3.12 <3.0.0",
    "type": "range"
  },
  "_requiredBy": [
    "/reproject"
  ],
  "_resolved": "https://registry.npmjs.org/proj4/-/proj4-2.3.14.tgz",
  "_shasum": "928906144388980c914c5a357fc493aba59a747a",
  "_shrinkwrap": null,
  "_spec": "proj4@^2.3.12",
  "_where": "/Users/mh/Documents/www/vidi/node_modules/reproject",
  "author": "",
  "bugs": {
    "url": "https://github.com/proj4js/proj4js/issues"
  },
  "contributors": [
    {
      "email": "madair@dmsolutions.ca",
      "name": "Mike Adair"
    },
    {
      "email": "rich@greenwoodmap.com",
      "name": "Richard Greenwood"
    },
    {
      "email": "calvin.metcalf@gmail.com",
      "name": "Calvin Metcalf"
    },
    {
      "name": "Richard Marsden",
      "url": "http://www.winwaed.com"
    },
    {
      "name": "T. Mittan"
    },
    {
      "name": "D. Steinwand"
    },
    {
      "name": "S. Nelson"
    }
  ],
  "dependencies": {
    "mgrs": "~0.0.2"
  },
  "description": "Proj4js is a JavaScript library to transform point coordinates from one coordinate system to another, including datum transformations.",
  "devDependencies": {
    "browserify": "~12.0.1",
    "chai": "~1.8.1",
    "curl": "git://github.com/cujojs/curl.git",
    "grunt": "~0.4.2",
    "grunt-browserify": "~4.0.1",
    "grunt-cli": "~0.1.13",
    "grunt-contrib-connect": "~0.6.0",
    "grunt-contrib-jshint": "~0.8.0",
    "grunt-contrib-uglify": "~0.11.1",
    "grunt-mocha-phantomjs": "~0.4.0",
    "istanbul": "~0.2.4",
    "mocha": "~1.17.1",
    "tin": "~0.4.0"
  },
  "directories": {
    "doc": "docs",
    "test": "test"
  },
  "dist": {
    "shasum": "928906144388980c914c5a357fc493aba59a747a",
    "tarball": "https://registry.npmjs.org/proj4/-/proj4-2.3.14.tgz"
  },
  "gitHead": "7619c8a63df1eae5bad0b9ad31ca1d87b0549243",
  "homepage": "https://github.com/proj4js/proj4js#readme",
  "jam": {
    "include": [
      "dist/proj4.js",
      "README.md",
      "AUTHORS",
      "LICENSE.md"
    ],
    "main": "dist/proj4.js"
  },
  "license": "MIT",
  "main": "lib/index.js",
  "maintainers": [
    {
      "email": "calvin.metcalf@gmail.com",
      "name": "cwmma"
    },
    {
      "email": "andreas.hocevar@gmail.com",
      "name": "ahocevar"
    }
  ],
  "name": "proj4",
  "optionalDependencies": {},
  "readme": "ERROR: No README data found!",
  "repository": {
    "type": "git",
    "url": "git://github.com/proj4js/proj4js.git"
  },
  "scripts": {
    "test": "./node_modules/istanbul/lib/cli.js test ./node_modules/mocha/bin/_mocha test/test.js"
  },
  "version": "2.3.14"
}

},{}],107:[function(require,module,exports){
'use strict';

var proj4 = require('proj4');
// Checks if `list` looks like a `[x, y]`.
function isXY(list) {
  return list.length >= 2 &&
    typeof list[0] === 'number' &&
    typeof list[1] === 'number';
}

function traverseCoords(coordinates, callback) {
  if (isXY(coordinates)) return callback(coordinates);
  return coordinates.map(function(coord){return traverseCoords(coord, callback);});
}

// Simplistic shallow clone that will work for a normal GeoJSON object.
function clone(obj) {
  if (null == obj || 'object' !== typeof obj) return obj;
  var copy = obj.constructor();
  for (var attr in obj) {
    if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
  }
  return copy;
}

function traverseGeoJson(geojson, leafCallback, nodeCallback) {
  if (geojson == null) return geojson;

  var r = clone(geojson);

  if (geojson.type === 'Feature') {
    r.geometry = traverseGeoJson(geojson.geometry, leafCallback, nodeCallback);
  } else if (geojson.type === 'FeatureCollection') {
    r.features = r.features.map(function(gj) { return traverseGeoJson(gj, leafCallback, nodeCallback); });
  } else if (geojson.type === 'GeometryCollection') {
    r.geometries = r.geometries.map(function(gj) { return traverseGeoJson(gj, leafCallback, nodeCallback); });
  } else {
    if (leafCallback) leafCallback(r);
  }

  if (nodeCallback) nodeCallback(r);

  return r;
}

function detectCrs(geojson, projs) {
  var crsInfo = geojson.crs,
      crs;

  if (crsInfo === undefined) {
    throw new Error('Unable to detect CRS, GeoJSON has no "crs" property.');
  }

  if (crsInfo.type === 'name') {
    crs = projs[crsInfo.properties.name];
  } else if (crsInfo.type === 'EPSG') {
    crs = projs['EPSG:' + crsInfo.properties.code];
  }

  if (!crs) {
    throw new Error('CRS defined in crs section could not be identified: ' + JSON.stringify(crsInfo));
  }

  return crs;
}

function determineCrs(crs, projs) {
  if (typeof crs === 'string' || crs instanceof String) {
    return projs[crs] || proj4.Proj(crs);
  }

  return crs;
}

function reproject(geojson, from, to, projs) {
  projs = projs || {};
  if (!from) {
    from = detectCrs(geojson, projs);
  } else {
    from = determineCrs(from, projs);
  }

  to = determineCrs(to, projs);
  var transform = proj4(from, to);

  return traverseGeoJson(geojson, function(gj) {
    // No easy way to put correct CRS info into the GeoJSON,
    // and definitely wrong to keep the old, so delete it.
    if (gj.crs) {
      delete gj.crs;
    }
    gj.coordinates = traverseCoords(gj.coordinates, function(xy) {
      return transform.forward(xy);
    });
  }, function(gj) {
    if (gj.bbox) {
      // A bbox can't easily be reprojected, just reprojecting
      // the min/max coords definitely will not work since
      // the transform is not linear (in the general case).
      // Workaround is to just re-compute the bbox after the
      // transform.
      gj.bbox = (function() {
        var min = [Number.MAX_VALUE, Number.MAX_VALUE],
            max = [-Number.MAX_VALUE, -Number.MAX_VALUE];
        traverseGeoJson(gj, function(_gj) {
          traverseCoords(_gj.coordinates, function(xy) {
            min[0] = Math.min(min[0], xy[0]);
            min[1] = Math.min(min[1], xy[1]);
            max[0] = Math.max(max[0], xy[0]);
            max[1] = Math.max(max[1], xy[1]);
          });
        });
        return [min[0], min[1], max[0], max[1]];
      })();
    }
  });
}

module.exports = {
    detectCrs: detectCrs,

    reproject: reproject,

    reverse: function(geojson) {
      return traverseGeoJson(geojson, function(gj) {
        gj.coordinates = traverseCoords(gj.coordinates, function(xy) {
          return [ xy[1], xy[0] ];
        });
      });
    },

    toWgs84: function(geojson, from, projs) {
      return reproject(geojson, from, proj4.WGS84, projs);
    }
  };

},{"proj4":75}],108:[function(require,module,exports){
//     Underscore.js 1.8.3
//     http://underscorejs.org
//     (c) 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `exports` on the server.
  var root = this;

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  // Create quick reference variables for speed access to core prototypes.
  var
    push             = ArrayProto.push,
    slice            = ArrayProto.slice,
    toString         = ObjProto.toString,
    hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind,
    nativeCreate       = Object.create;

  // Naked function reference for surrogate-prototype-swapping.
  var Ctor = function(){};

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for the old `require()` API. If we're in
  // the browser, add `_` as a global object.
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root._ = _;
  }

  // Current version.
  _.VERSION = '1.8.3';

  // Internal function that returns an efficient (for current engines) version
  // of the passed-in callback, to be repeatedly applied in other Underscore
  // functions.
  var optimizeCb = function(func, context, argCount) {
    if (context === void 0) return func;
    switch (argCount == null ? 3 : argCount) {
      case 1: return function(value) {
        return func.call(context, value);
      };
      case 2: return function(value, other) {
        return func.call(context, value, other);
      };
      case 3: return function(value, index, collection) {
        return func.call(context, value, index, collection);
      };
      case 4: return function(accumulator, value, index, collection) {
        return func.call(context, accumulator, value, index, collection);
      };
    }
    return function() {
      return func.apply(context, arguments);
    };
  };

  // A mostly-internal function to generate callbacks that can be applied
  // to each element in a collection, returning the desired result — either
  // identity, an arbitrary callback, a property matcher, or a property accessor.
  var cb = function(value, context, argCount) {
    if (value == null) return _.identity;
    if (_.isFunction(value)) return optimizeCb(value, context, argCount);
    if (_.isObject(value)) return _.matcher(value);
    return _.property(value);
  };
  _.iteratee = function(value, context) {
    return cb(value, context, Infinity);
  };

  // An internal function for creating assigner functions.
  var createAssigner = function(keysFunc, undefinedOnly) {
    return function(obj) {
      var length = arguments.length;
      if (length < 2 || obj == null) return obj;
      for (var index = 1; index < length; index++) {
        var source = arguments[index],
            keys = keysFunc(source),
            l = keys.length;
        for (var i = 0; i < l; i++) {
          var key = keys[i];
          if (!undefinedOnly || obj[key] === void 0) obj[key] = source[key];
        }
      }
      return obj;
    };
  };

  // An internal function for creating a new object that inherits from another.
  var baseCreate = function(prototype) {
    if (!_.isObject(prototype)) return {};
    if (nativeCreate) return nativeCreate(prototype);
    Ctor.prototype = prototype;
    var result = new Ctor;
    Ctor.prototype = null;
    return result;
  };

  var property = function(key) {
    return function(obj) {
      return obj == null ? void 0 : obj[key];
    };
  };

  // Helper for collection methods to determine whether a collection
  // should be iterated as an array or as an object
  // Related: http://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
  // Avoids a very nasty iOS 8 JIT bug on ARM-64. #2094
  var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
  var getLength = property('length');
  var isArrayLike = function(collection) {
    var length = getLength(collection);
    return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
  };

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles raw objects in addition to array-likes. Treats all
  // sparse array-likes as if they were dense.
  _.each = _.forEach = function(obj, iteratee, context) {
    iteratee = optimizeCb(iteratee, context);
    var i, length;
    if (isArrayLike(obj)) {
      for (i = 0, length = obj.length; i < length; i++) {
        iteratee(obj[i], i, obj);
      }
    } else {
      var keys = _.keys(obj);
      for (i = 0, length = keys.length; i < length; i++) {
        iteratee(obj[keys[i]], keys[i], obj);
      }
    }
    return obj;
  };

  // Return the results of applying the iteratee to each element.
  _.map = _.collect = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length,
        results = Array(length);
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      results[index] = iteratee(obj[currentKey], currentKey, obj);
    }
    return results;
  };

  // Create a reducing function iterating left or right.
  function createReduce(dir) {
    // Optimized iterator function as using arguments.length
    // in the main function will deoptimize the, see #1991.
    function iterator(obj, iteratee, memo, keys, index, length) {
      for (; index >= 0 && index < length; index += dir) {
        var currentKey = keys ? keys[index] : index;
        memo = iteratee(memo, obj[currentKey], currentKey, obj);
      }
      return memo;
    }

    return function(obj, iteratee, memo, context) {
      iteratee = optimizeCb(iteratee, context, 4);
      var keys = !isArrayLike(obj) && _.keys(obj),
          length = (keys || obj).length,
          index = dir > 0 ? 0 : length - 1;
      // Determine the initial value if none is provided.
      if (arguments.length < 3) {
        memo = obj[keys ? keys[index] : index];
        index += dir;
      }
      return iterator(obj, iteratee, memo, keys, index, length);
    };
  }

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`.
  _.reduce = _.foldl = _.inject = createReduce(1);

  // The right-associative version of reduce, also known as `foldr`.
  _.reduceRight = _.foldr = createReduce(-1);

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, predicate, context) {
    var key;
    if (isArrayLike(obj)) {
      key = _.findIndex(obj, predicate, context);
    } else {
      key = _.findKey(obj, predicate, context);
    }
    if (key !== void 0 && key !== -1) return obj[key];
  };

  // Return all the elements that pass a truth test.
  // Aliased as `select`.
  _.filter = _.select = function(obj, predicate, context) {
    var results = [];
    predicate = cb(predicate, context);
    _.each(obj, function(value, index, list) {
      if (predicate(value, index, list)) results.push(value);
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, predicate, context) {
    return _.filter(obj, _.negate(cb(predicate)), context);
  };

  // Determine whether all of the elements match a truth test.
  // Aliased as `all`.
  _.every = _.all = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (!predicate(obj[currentKey], currentKey, obj)) return false;
    }
    return true;
  };

  // Determine if at least one element in the object matches a truth test.
  // Aliased as `any`.
  _.some = _.any = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (predicate(obj[currentKey], currentKey, obj)) return true;
    }
    return false;
  };

  // Determine if the array or object contains a given item (using `===`).
  // Aliased as `includes` and `include`.
  _.contains = _.includes = _.include = function(obj, item, fromIndex, guard) {
    if (!isArrayLike(obj)) obj = _.values(obj);
    if (typeof fromIndex != 'number' || guard) fromIndex = 0;
    return _.indexOf(obj, item, fromIndex) >= 0;
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    var isFunc = _.isFunction(method);
    return _.map(obj, function(value) {
      var func = isFunc ? method : value[method];
      return func == null ? func : func.apply(value, args);
    });
  };

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, _.property(key));
  };

  // Convenience version of a common use case of `filter`: selecting only objects
  // containing specific `key:value` pairs.
  _.where = function(obj, attrs) {
    return _.filter(obj, _.matcher(attrs));
  };

  // Convenience version of a common use case of `find`: getting the first object
  // containing specific `key:value` pairs.
  _.findWhere = function(obj, attrs) {
    return _.find(obj, _.matcher(attrs));
  };

  // Return the maximum element (or element-based computation).
  _.max = function(obj, iteratee, context) {
    var result = -Infinity, lastComputed = -Infinity,
        value, computed;
    if (iteratee == null && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value > result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index, list) {
        computed = iteratee(value, index, list);
        if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
          result = value;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iteratee, context) {
    var result = Infinity, lastComputed = Infinity,
        value, computed;
    if (iteratee == null && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value < result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index, list) {
        computed = iteratee(value, index, list);
        if (computed < lastComputed || computed === Infinity && result === Infinity) {
          result = value;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Shuffle a collection, using the modern version of the
  // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
  _.shuffle = function(obj) {
    var set = isArrayLike(obj) ? obj : _.values(obj);
    var length = set.length;
    var shuffled = Array(length);
    for (var index = 0, rand; index < length; index++) {
      rand = _.random(0, index);
      if (rand !== index) shuffled[index] = shuffled[rand];
      shuffled[rand] = set[index];
    }
    return shuffled;
  };

  // Sample **n** random values from a collection.
  // If **n** is not specified, returns a single random element.
  // The internal `guard` argument allows it to work with `map`.
  _.sample = function(obj, n, guard) {
    if (n == null || guard) {
      if (!isArrayLike(obj)) obj = _.values(obj);
      return obj[_.random(obj.length - 1)];
    }
    return _.shuffle(obj).slice(0, Math.max(0, n));
  };

  // Sort the object's values by a criterion produced by an iteratee.
  _.sortBy = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value: value,
        index: index,
        criteria: iteratee(value, index, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index - right.index;
    }), 'value');
  };

  // An internal function used for aggregate "group by" operations.
  var group = function(behavior) {
    return function(obj, iteratee, context) {
      var result = {};
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index) {
        var key = iteratee(value, index, obj);
        behavior(result, value, key);
      });
      return result;
    };
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = group(function(result, value, key) {
    if (_.has(result, key)) result[key].push(value); else result[key] = [value];
  });

  // Indexes the object's values by a criterion, similar to `groupBy`, but for
  // when you know that your index values will be unique.
  _.indexBy = group(function(result, value, key) {
    result[key] = value;
  });

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  _.countBy = group(function(result, value, key) {
    if (_.has(result, key)) result[key]++; else result[key] = 1;
  });

  // Safely create a real, live array from anything iterable.
  _.toArray = function(obj) {
    if (!obj) return [];
    if (_.isArray(obj)) return slice.call(obj);
    if (isArrayLike(obj)) return _.map(obj, _.identity);
    return _.values(obj);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    if (obj == null) return 0;
    return isArrayLike(obj) ? obj.length : _.keys(obj).length;
  };

  // Split a collection into two arrays: one whose elements all satisfy the given
  // predicate, and one whose elements all do not satisfy the predicate.
  _.partition = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var pass = [], fail = [];
    _.each(obj, function(value, key, obj) {
      (predicate(value, key, obj) ? pass : fail).push(value);
    });
    return [pass, fail];
  };

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  _.first = _.head = _.take = function(array, n, guard) {
    if (array == null) return void 0;
    if (n == null || guard) return array[0];
    return _.initial(array, array.length - n);
  };

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array.
  _.last = function(array, n, guard) {
    if (array == null) return void 0;
    if (n == null || guard) return array[array.length - 1];
    return _.rest(array, Math.max(0, array.length - n));
  };

  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
  // Especially useful on the arguments object. Passing an **n** will return
  // the rest N values in the array.
  _.rest = _.tail = _.drop = function(array, n, guard) {
    return slice.call(array, n == null || guard ? 1 : n);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, _.identity);
  };

  // Internal implementation of a recursive `flatten` function.
  var flatten = function(input, shallow, strict, startIndex) {
    var output = [], idx = 0;
    for (var i = startIndex || 0, length = getLength(input); i < length; i++) {
      var value = input[i];
      if (isArrayLike(value) && (_.isArray(value) || _.isArguments(value))) {
        //flatten current level of array or arguments object
        if (!shallow) value = flatten(value, shallow, strict);
        var j = 0, len = value.length;
        output.length += len;
        while (j < len) {
          output[idx++] = value[j++];
        }
      } else if (!strict) {
        output[idx++] = value;
      }
    }
    return output;
  };

  // Flatten out an array, either recursively (by default), or just one level.
  _.flatten = function(array, shallow) {
    return flatten(array, shallow, false);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = function(array) {
    return _.difference(array, slice.call(arguments, 1));
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iteratee, context) {
    if (!_.isBoolean(isSorted)) {
      context = iteratee;
      iteratee = isSorted;
      isSorted = false;
    }
    if (iteratee != null) iteratee = cb(iteratee, context);
    var result = [];
    var seen = [];
    for (var i = 0, length = getLength(array); i < length; i++) {
      var value = array[i],
          computed = iteratee ? iteratee(value, i, array) : value;
      if (isSorted) {
        if (!i || seen !== computed) result.push(value);
        seen = computed;
      } else if (iteratee) {
        if (!_.contains(seen, computed)) {
          seen.push(computed);
          result.push(value);
        }
      } else if (!_.contains(result, value)) {
        result.push(value);
      }
    }
    return result;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = function() {
    return _.uniq(flatten(arguments, true, true));
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  _.intersection = function(array) {
    var result = [];
    var argsLength = arguments.length;
    for (var i = 0, length = getLength(array); i < length; i++) {
      var item = array[i];
      if (_.contains(result, item)) continue;
      for (var j = 1; j < argsLength; j++) {
        if (!_.contains(arguments[j], item)) break;
      }
      if (j === argsLength) result.push(item);
    }
    return result;
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
    var rest = flatten(arguments, true, true, 1);
    return _.filter(array, function(value){
      return !_.contains(rest, value);
    });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function() {
    return _.unzip(arguments);
  };

  // Complement of _.zip. Unzip accepts an array of arrays and groups
  // each array's elements on shared indices
  _.unzip = function(array) {
    var length = array && _.max(array, getLength).length || 0;
    var result = Array(length);

    for (var index = 0; index < length; index++) {
      result[index] = _.pluck(array, index);
    }
    return result;
  };

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values.
  _.object = function(list, values) {
    var result = {};
    for (var i = 0, length = getLength(list); i < length; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  };

  // Generator function to create the findIndex and findLastIndex functions
  function createPredicateIndexFinder(dir) {
    return function(array, predicate, context) {
      predicate = cb(predicate, context);
      var length = getLength(array);
      var index = dir > 0 ? 0 : length - 1;
      for (; index >= 0 && index < length; index += dir) {
        if (predicate(array[index], index, array)) return index;
      }
      return -1;
    };
  }

  // Returns the first index on an array-like that passes a predicate test
  _.findIndex = createPredicateIndexFinder(1);
  _.findLastIndex = createPredicateIndexFinder(-1);

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iteratee, context) {
    iteratee = cb(iteratee, context, 1);
    var value = iteratee(obj);
    var low = 0, high = getLength(array);
    while (low < high) {
      var mid = Math.floor((low + high) / 2);
      if (iteratee(array[mid]) < value) low = mid + 1; else high = mid;
    }
    return low;
  };

  // Generator function to create the indexOf and lastIndexOf functions
  function createIndexFinder(dir, predicateFind, sortedIndex) {
    return function(array, item, idx) {
      var i = 0, length = getLength(array);
      if (typeof idx == 'number') {
        if (dir > 0) {
            i = idx >= 0 ? idx : Math.max(idx + length, i);
        } else {
            length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
        }
      } else if (sortedIndex && idx && length) {
        idx = sortedIndex(array, item);
        return array[idx] === item ? idx : -1;
      }
      if (item !== item) {
        idx = predicateFind(slice.call(array, i, length), _.isNaN);
        return idx >= 0 ? idx + i : -1;
      }
      for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
        if (array[idx] === item) return idx;
      }
      return -1;
    };
  }

  // Return the position of the first occurrence of an item in an array,
  // or -1 if the item is not included in the array.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = createIndexFinder(1, _.findIndex, _.sortedIndex);
  _.lastIndexOf = createIndexFinder(-1, _.findLastIndex);

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (stop == null) {
      stop = start || 0;
      start = 0;
    }
    step = step || 1;

    var length = Math.max(Math.ceil((stop - start) / step), 0);
    var range = Array(length);

    for (var idx = 0; idx < length; idx++, start += step) {
      range[idx] = start;
    }

    return range;
  };

  // Function (ahem) Functions
  // ------------------

  // Determines whether to execute a function as a constructor
  // or a normal function with the provided arguments
  var executeBound = function(sourceFunc, boundFunc, context, callingContext, args) {
    if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
    var self = baseCreate(sourceFunc.prototype);
    var result = sourceFunc.apply(self, args);
    if (_.isObject(result)) return result;
    return self;
  };

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
  // available.
  _.bind = function(func, context) {
    if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    if (!_.isFunction(func)) throw new TypeError('Bind must be called on a function');
    var args = slice.call(arguments, 2);
    var bound = function() {
      return executeBound(func, bound, context, this, args.concat(slice.call(arguments)));
    };
    return bound;
  };

  // Partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context. _ acts
  // as a placeholder, allowing any combination of arguments to be pre-filled.
  _.partial = function(func) {
    var boundArgs = slice.call(arguments, 1);
    var bound = function() {
      var position = 0, length = boundArgs.length;
      var args = Array(length);
      for (var i = 0; i < length; i++) {
        args[i] = boundArgs[i] === _ ? arguments[position++] : boundArgs[i];
      }
      while (position < arguments.length) args.push(arguments[position++]);
      return executeBound(func, bound, this, this, args);
    };
    return bound;
  };

  // Bind a number of an object's methods to that object. Remaining arguments
  // are the method names to be bound. Useful for ensuring that all callbacks
  // defined on an object belong to it.
  _.bindAll = function(obj) {
    var i, length = arguments.length, key;
    if (length <= 1) throw new Error('bindAll must be passed function names');
    for (i = 1; i < length; i++) {
      key = arguments[i];
      obj[key] = _.bind(obj[key], obj);
    }
    return obj;
  };

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memoize = function(key) {
      var cache = memoize.cache;
      var address = '' + (hasher ? hasher.apply(this, arguments) : key);
      if (!_.has(cache, address)) cache[address] = func.apply(this, arguments);
      return cache[address];
    };
    memoize.cache = {};
    return memoize;
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function(){
      return func.apply(null, args);
    }, wait);
  };

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = _.partial(_.delay, _, 1);

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time. Normally, the throttled function will run
  // as much as it can, without ever going more than once per `wait` duration;
  // but if you'd like to disable the execution on the leading edge, pass
  // `{leading: false}`. To disable execution on the trailing edge, ditto.
  _.throttle = function(func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    if (!options) options = {};
    var later = function() {
      previous = options.leading === false ? 0 : _.now();
      timeout = null;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    };
    return function() {
      var now = _.now();
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        previous = now;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  _.debounce = function(func, wait, immediate) {
    var timeout, args, context, timestamp, result;

    var later = function() {
      var last = _.now() - timestamp;

      if (last < wait && last >= 0) {
        timeout = setTimeout(later, wait - last);
      } else {
        timeout = null;
        if (!immediate) {
          result = func.apply(context, args);
          if (!timeout) context = args = null;
        }
      }
    };

    return function() {
      context = this;
      args = arguments;
      timestamp = _.now();
      var callNow = immediate && !timeout;
      if (!timeout) timeout = setTimeout(later, wait);
      if (callNow) {
        result = func.apply(context, args);
        context = args = null;
      }

      return result;
    };
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return _.partial(wrapper, func);
  };

  // Returns a negated version of the passed-in predicate.
  _.negate = function(predicate) {
    return function() {
      return !predicate.apply(this, arguments);
    };
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var args = arguments;
    var start = args.length - 1;
    return function() {
      var i = start;
      var result = args[start].apply(this, arguments);
      while (i--) result = args[i].call(this, result);
      return result;
    };
  };

  // Returns a function that will only be executed on and after the Nth call.
  _.after = function(times, func) {
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

  // Returns a function that will only be executed up to (but not including) the Nth call.
  _.before = function(times, func) {
    var memo;
    return function() {
      if (--times > 0) {
        memo = func.apply(this, arguments);
      }
      if (times <= 1) func = null;
      return memo;
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = _.partial(_.before, 2);

  // Object Functions
  // ----------------

  // Keys in IE < 9 that won't be iterated by `for key in ...` and thus missed.
  var hasEnumBug = !{toString: null}.propertyIsEnumerable('toString');
  var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString',
                      'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];

  function collectNonEnumProps(obj, keys) {
    var nonEnumIdx = nonEnumerableProps.length;
    var constructor = obj.constructor;
    var proto = (_.isFunction(constructor) && constructor.prototype) || ObjProto;

    // Constructor is a special case.
    var prop = 'constructor';
    if (_.has(obj, prop) && !_.contains(keys, prop)) keys.push(prop);

    while (nonEnumIdx--) {
      prop = nonEnumerableProps[nonEnumIdx];
      if (prop in obj && obj[prop] !== proto[prop] && !_.contains(keys, prop)) {
        keys.push(prop);
      }
    }
  }

  // Retrieve the names of an object's own properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  _.keys = function(obj) {
    if (!_.isObject(obj)) return [];
    if (nativeKeys) return nativeKeys(obj);
    var keys = [];
    for (var key in obj) if (_.has(obj, key)) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  };

  // Retrieve all the property names of an object.
  _.allKeys = function(obj) {
    if (!_.isObject(obj)) return [];
    var keys = [];
    for (var key in obj) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var values = Array(length);
    for (var i = 0; i < length; i++) {
      values[i] = obj[keys[i]];
    }
    return values;
  };

  // Returns the results of applying the iteratee to each element of the object
  // In contrast to _.map it returns an object
  _.mapObject = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var keys =  _.keys(obj),
          length = keys.length,
          results = {},
          currentKey;
      for (var index = 0; index < length; index++) {
        currentKey = keys[index];
        results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
      }
      return results;
  };

  // Convert an object into a list of `[key, value]` pairs.
  _.pairs = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var pairs = Array(length);
    for (var i = 0; i < length; i++) {
      pairs[i] = [keys[i], obj[keys[i]]];
    }
    return pairs;
  };

  // Invert the keys and values of an object. The values must be serializable.
  _.invert = function(obj) {
    var result = {};
    var keys = _.keys(obj);
    for (var i = 0, length = keys.length; i < length; i++) {
      result[obj[keys[i]]] = keys[i];
    }
    return result;
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = createAssigner(_.allKeys);

  // Assigns a given object with all the own properties in the passed-in object(s)
  // (https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
  _.extendOwn = _.assign = createAssigner(_.keys);

  // Returns the first key on an object that passes a predicate test
  _.findKey = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = _.keys(obj), key;
    for (var i = 0, length = keys.length; i < length; i++) {
      key = keys[i];
      if (predicate(obj[key], key, obj)) return key;
    }
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = function(object, oiteratee, context) {
    var result = {}, obj = object, iteratee, keys;
    if (obj == null) return result;
    if (_.isFunction(oiteratee)) {
      keys = _.allKeys(obj);
      iteratee = optimizeCb(oiteratee, context);
    } else {
      keys = flatten(arguments, false, false, 1);
      iteratee = function(value, key, obj) { return key in obj; };
      obj = Object(obj);
    }
    for (var i = 0, length = keys.length; i < length; i++) {
      var key = keys[i];
      var value = obj[key];
      if (iteratee(value, key, obj)) result[key] = value;
    }
    return result;
  };

   // Return a copy of the object without the blacklisted properties.
  _.omit = function(obj, iteratee, context) {
    if (_.isFunction(iteratee)) {
      iteratee = _.negate(iteratee);
    } else {
      var keys = _.map(flatten(arguments, false, false, 1), String);
      iteratee = function(value, key) {
        return !_.contains(keys, key);
      };
    }
    return _.pick(obj, iteratee, context);
  };

  // Fill in a given object with default properties.
  _.defaults = createAssigner(_.allKeys, true);

  // Creates an object that inherits from the given prototype object.
  // If additional properties are provided then they will be added to the
  // created object.
  _.create = function(prototype, props) {
    var result = baseCreate(prototype);
    if (props) _.extendOwn(result, props);
    return result;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Returns whether an object has a given set of `key:value` pairs.
  _.isMatch = function(object, attrs) {
    var keys = _.keys(attrs), length = keys.length;
    if (object == null) return !length;
    var obj = Object(object);
    for (var i = 0; i < length; i++) {
      var key = keys[i];
      if (attrs[key] !== obj[key] || !(key in obj)) return false;
    }
    return true;
  };


  // Internal recursive comparison function for `isEqual`.
  var eq = function(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) return a !== 0 || 1 / a === 1 / b;
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) return a === b;
    // Unwrap any wrapped objects.
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className !== toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, regular expressions, dates, and booleans are compared by value.
      case '[object RegExp]':
      // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return '' + a === '' + b;
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive.
        // Object(NaN) is equivalent to NaN
        if (+a !== +a) return +b !== +b;
        // An `egal` comparison is performed for other numeric values.
        return +a === 0 ? 1 / +a === 1 / b : +a === +b;
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a === +b;
    }

    var areArrays = className === '[object Array]';
    if (!areArrays) {
      if (typeof a != 'object' || typeof b != 'object') return false;

      // Objects with different constructors are not equivalent, but `Object`s or `Array`s
      // from different frames are.
      var aCtor = a.constructor, bCtor = b.constructor;
      if (aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor &&
                               _.isFunction(bCtor) && bCtor instanceof bCtor)
                          && ('constructor' in a && 'constructor' in b)) {
        return false;
      }
    }
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.

    // Initializing stack of traversed objects.
    // It's done here since we only need them for objects and arrays comparison.
    aStack = aStack || [];
    bStack = bStack || [];
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] === a) return bStack[length] === b;
    }

    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);

    // Recursively compare objects and arrays.
    if (areArrays) {
      // Compare array lengths to determine if a deep comparison is necessary.
      length = a.length;
      if (length !== b.length) return false;
      // Deep compare the contents, ignoring non-numeric properties.
      while (length--) {
        if (!eq(a[length], b[length], aStack, bStack)) return false;
      }
    } else {
      // Deep compare objects.
      var keys = _.keys(a), key;
      length = keys.length;
      // Ensure that both objects contain the same number of properties before comparing deep equality.
      if (_.keys(b).length !== length) return false;
      while (length--) {
        // Deep compare each member
        key = keys[length];
        if (!(_.has(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return true;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (isArrayLike(obj) && (_.isArray(obj) || _.isString(obj) || _.isArguments(obj))) return obj.length === 0;
    return _.keys(obj).length === 0;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) === '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
  };

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp, isError.
  _.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error'], function(name) {
    _['is' + name] = function(obj) {
      return toString.call(obj) === '[object ' + name + ']';
    };
  });

  // Define a fallback version of the method in browsers (ahem, IE < 9), where
  // there isn't any inspectable "Arguments" type.
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return _.has(obj, 'callee');
    };
  }

  // Optimize `isFunction` if appropriate. Work around some typeof bugs in old v8,
  // IE 11 (#1621), and in Safari 8 (#1929).
  if (typeof /./ != 'function' && typeof Int8Array != 'object') {
    _.isFunction = function(obj) {
      return typeof obj == 'function' || false;
    };
  }

  // Is a given object a finite number?
  _.isFinite = function(obj) {
    return isFinite(obj) && !isNaN(parseFloat(obj));
  };

  // Is the given value `NaN`? (NaN is the only number which does not equal itself).
  _.isNaN = function(obj) {
    return _.isNumber(obj) && obj !== +obj;
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  _.has = function(obj, key) {
    return obj != null && hasOwnProperty.call(obj, key);
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iteratees.
  _.identity = function(value) {
    return value;
  };

  // Predicate-generating functions. Often useful outside of Underscore.
  _.constant = function(value) {
    return function() {
      return value;
    };
  };

  _.noop = function(){};

  _.property = property;

  // Generates a function for a given object that returns a given property.
  _.propertyOf = function(obj) {
    return obj == null ? function(){} : function(key) {
      return obj[key];
    };
  };

  // Returns a predicate for checking whether an object has a given set of
  // `key:value` pairs.
  _.matcher = _.matches = function(attrs) {
    attrs = _.extendOwn({}, attrs);
    return function(obj) {
      return _.isMatch(obj, attrs);
    };
  };

  // Run a function **n** times.
  _.times = function(n, iteratee, context) {
    var accum = Array(Math.max(0, n));
    iteratee = optimizeCb(iteratee, context, 1);
    for (var i = 0; i < n; i++) accum[i] = iteratee(i);
    return accum;
  };

  // Return a random integer between min and max (inclusive).
  _.random = function(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  };

  // A (possibly faster) way to get the current timestamp as an integer.
  _.now = Date.now || function() {
    return new Date().getTime();
  };

   // List of HTML entities for escaping.
  var escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;'
  };
  var unescapeMap = _.invert(escapeMap);

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  var createEscaper = function(map) {
    var escaper = function(match) {
      return map[match];
    };
    // Regexes for identifying a key that needs to be escaped
    var source = '(?:' + _.keys(map).join('|') + ')';
    var testRegexp = RegExp(source);
    var replaceRegexp = RegExp(source, 'g');
    return function(string) {
      string = string == null ? '' : '' + string;
      return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
    };
  };
  _.escape = createEscaper(escapeMap);
  _.unescape = createEscaper(unescapeMap);

  // If the value of the named `property` is a function then invoke it with the
  // `object` as context; otherwise, return it.
  _.result = function(object, property, fallback) {
    var value = object == null ? void 0 : object[property];
    if (value === void 0) {
      value = fallback;
    }
    return _.isFunction(value) ? value.call(object) : value;
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g,
    escape      : /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "'":      "'",
    '\\':     '\\',
    '\r':     'r',
    '\n':     'n',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escaper = /\\|'|\r|\n|\u2028|\u2029/g;

  var escapeChar = function(match) {
    return '\\' + escapes[match];
  };

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  // NB: `oldSettings` only exists for backwards compatibility.
  _.template = function(text, settings, oldSettings) {
    if (!settings && oldSettings) settings = oldSettings;
    settings = _.defaults({}, settings, _.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    var matcher = RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset).replace(escaper, escapeChar);
      index = offset + match.length;

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      } else if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      } else if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }

      // Adobe VMs need the match returned to produce the correct offest.
      return match;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + 'return __p;\n';

    try {
      var render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled source as a convenience for precompilation.
    var argument = settings.variable || 'obj';
    template.source = 'function(' + argument + '){\n' + source + '}';

    return template;
  };

  // Add a "chain" function. Start chaining a wrapped Underscore object.
  _.chain = function(obj) {
    var instance = _(obj);
    instance._chain = true;
    return instance;
  };

  // OOP
  // ---------------
  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.

  // Helper function to continue chaining intermediate results.
  var result = function(instance, obj) {
    return instance._chain ? _(obj).chain() : obj;
  };

  // Add your own custom functions to the Underscore object.
  _.mixin = function(obj) {
    _.each(_.functions(obj), function(name) {
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return result(this, func.apply(_, args));
      };
    });
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  _.each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      var obj = this._wrapped;
      method.apply(obj, arguments);
      if ((name === 'shift' || name === 'splice') && obj.length === 0) delete obj[0];
      return result(this, obj);
    };
  });

  // Add all accessor Array functions to the wrapper.
  _.each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      return result(this, method.apply(this._wrapped, arguments));
    };
  });

  // Extracts the result from a wrapped and chained object.
  _.prototype.value = function() {
    return this._wrapped;
  };

  // Provide unwrapping proxy for some methods used in engine operations
  // such as arithmetic and JSON stringification.
  _.prototype.valueOf = _.prototype.toJSON = _.prototype.value;

  _.prototype.toString = function() {
    return '' + this._wrapped;
  };

  // AMD registration happens at the end for compatibility with AMD loaders
  // that may not enforce next-turn semantics on modules. Even though general
  // practice for AMD registration is to be anonymous, underscore registers
  // as a named module because, like jQuery, it is a base library that is
  // popular enough to be bundled in a third party lib, but not be part of
  // an AMD load request. Those cases could generate an error when an
  // anonymous define() is called outside of a loader request.
  if (typeof define === 'function' && define.amd) {
    define('underscore', [], function() {
      return _;
    });
  }
}.call(this));

},{}]},{},[3]);
