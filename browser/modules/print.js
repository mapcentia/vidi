/**
 * @fileoverview Description of file, its uses and information
 * about its dependencies.
 */

'use strict';

var cloud;
var printOn = false;
var recEdit;
var recScale;
var serializeLayers;
var anchor;
var printItems = new L.FeatureGroup();
var urlparser = require('./urlparser');
var db = urlparser.db;
var urlVars = urlparser.urlVars;
var schema = urlparser.schema;
var scale;
var center;
var config = require('../../config/config.js');
var printC = config.print.templates;
var scales = config.print.scales;
var tmpl;
var pageSize;
var orientation;
var backboneEvents;
var legend;
var header;
var moment = require('moment');
var meta;

/**
 * @private
 */
var _cleanUp = function () {
    try {
        cloud.get().map.removeLayer(recScale);
        cloud.get().map.removeLayer(recEdit);
    } catch (e) {
    }
    printOn = false;
};

/**
 *
 * @type {{set: module.exports.set, init: module.exports.init, activate: module.exports.activate, print: module.exports.print, control: module.exports.control}}
 */
module.exports = {
    set: function (o) {
        cloud = o.cloud;
        serializeLayers = o.serializeLayers;
        anchor = o.anchor;
        meta = o.meta;
        backboneEvents = o.backboneEvents;
        return this;
    },
    init: function () {
        cloud.get().map.addLayer(printItems);
        // Set locale for date/time string
        var lc = window._vidiLocale.split("_")[0];
        require('moment/locale/da');
        moment.locale(lc);
    },

    off: function () {
        _cleanUp();
        $("#print-btn").prop("checked", false);
        $("#print-form :input, #start-print-btn, #select-scale").prop("disabled", true);
    },

    /**
     *
     */
    activate: function () {
        if ($("#print-btn").is(':checked')) {
            var numOfPrintTmpl = 0;
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
            $.each(printC, function (i) {
                if (window.vidiConfig.enabledPrints.indexOf(i) > -1) {
                    if (i.charAt(0) !== "_") {
                        numOfPrintTmpl = numOfPrintTmpl + 1;
                    }
                    $("#print-tmpl").append('<div class="radio radio-primary"><label><input type="radio" class="print print-tmpl" name="print-tmpl" id="' + i + '" value="' + i + '">' + i + '</label></div>');
                }
            });

            if (numOfPrintTmpl > 1) {
                $("#print-tmpl").parent("div").show();
            }
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
                    _cleanUp();
                    tmpl = arr[0].value;
                    pageSize = arr[1].value;
                    orientation = arr[2].value;
                    me.control();
                } else {
                    _cleanUp();
                }
            };
        } else {
            this.off();
        }
    },

    /**
     *
     */
    print: function (endEventName, customData) {
        var layerDraw = [], layerQueryDraw = [], layerQueryResult = [], layerQueryBuffer = [], layerPrint = [], e, data, parr, configFile = null;

        backboneEvents.get().trigger("start:print");

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

        data = {
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
            title: encodeURIComponent($("#print-title").val()),
            comment: encodeURIComponent($("#print-comment").val()),
            legend: legend || $("#add-legend-btn").is(":checked") ? "inline" : "none",
            header: encodeURIComponent($("#print-title").val()) || encodeURIComponent($("#print-comment").val()) ? "inline" : "none",
            dataTime: moment().format('Do MMMM YYYY, H:mm'),
            customData: customData || null,
            metaData: meta.getMetaData(),
            px: config.print.templates[tmpl][pageSize][orientation].mapsizePx[0],
            py: config.print.templates[tmpl][pageSize][orientation].mapsizePx[1]
        };

        if (urlVars.config) {
            parr = urlVars.config.split("#");
            if (parr.length > 1) {
                parr.pop();
            }
            data.config = parr.join();
        }


        $.ajax({
            dataType: "json",
            method: "post",
            url: '/api/print/',
            contentType: "application/json",
            data: JSON.stringify(data),
            scriptCharset: "utf-8",
            success: function (response) {
                if (!endEventName) {
                    backboneEvents.get().trigger("end:print", response);
                } else {
                    backboneEvents.get().trigger(endEventName, response);
                }
            },
            error: function () {
                if (!endEventName) {
                    backboneEvents.get().trigger("end:print", response);
                } else {
                    backboneEvents.get().trigger(endEventName, response);
                }
            }
        });
    },

    /**
     *
     */
    control: function (p, s, t, pa, o, l) {
        if ($("#print-btn").is(':checked') || p) {
            printC = p ? p : printC;
            scales = s ? s : scales;
            tmpl = t ? t : tmpl;
            pageSize = pa ? pa : pageSize;
            orientation = o ? o : orientation;
            legend = l ? l : null;


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
                        scaleIndex = scaleIndex - 2;
                    } else if (scaleIndex > 0) {
                        scaleIndex = scaleIndex - 1;
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
            center = center || cloud.get().map.getCenter(); // Init center as map center
            recEdit = rectangle(center, cloud.get().map, "yellow", scale, first);
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
                        cloud.get().map.removeLayer(recScale);
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
            _cleanUp();
        }
    },
    cleanUp: function () {
        _cleanUp();
    }
};
