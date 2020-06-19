/*
 * @author     Martin Høgh <mh@mapcentia.com>
 * @copyright  2013-2020 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

'use strict';

const MODULE_ID = `print`;

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
var printingOrientation;
var backboneEvents;
var legend;
var moment = require('moment');
var meta;
var state;
var _self = false;
var uriJs = require('urijs');
var callBack = () => {
};
var alreadySetFromState = false;
var paramsFromDb;

/**
 * @private
 */
var _cleanUp = function (hard) {
    try {
        if (recScale) cloud.get().map.removeLayer(recScale);
        if (recEdit) cloud.get().map.removeLayer(recEdit);
    } catch (e) {
        console.error(e.message)
    }

    printOn = false;
    if (hard) {
        center = null;
        printC = config.print.templates;
        scales = config.print.scales;
        scale = null;
        pageSize = null;
        printingOrientation = null;
        tmpl = null;
    }
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
        state = o.state;
        backboneEvents = o.backboneEvents;
        _self = this;
        return this;
    },

    init: function () {
        backboneEvents.get().on(`reset:all reset:${MODULE_ID}`, () => {
            _self.off();
        });
        backboneEvents.get().on(`off:all`, () => {
            _self.off();
        });
        backboneEvents.get().on(`on:${MODULE_ID}`, () => {
            _self.on();
        });
        backboneEvents.get().on(`off:${MODULE_ID}`, () => {
            _self.off();
        });

        state.listenTo(MODULE_ID, _self);
        state.listen(MODULE_ID, `state_change`);

        backboneEvents.get().on("end:print", function (response) {
            $("#get-print-fieldset").prop("disabled", false);
            $("#download-pdf, #open-pdf").attr("href", "/tmp/print/pdf/" + response.key + ".pdf");
            $("#download-pdf").attr("download", response.key);
            $("#open-html").attr("href", response.url);
            $("#start-print-btn").button('reset');

            console.log("GEMessage:LaunchURL:" + urlparser.uriObj.protocol() + "://" + urlparser.uriObj.host() + "/tmp/print/pdf/" + response.key + ".pdf");
        });

        $("#start-print-btn").on("click", function () {
            if (_self.print()) {
                $(this).button('loading');
                $("#get-print-fieldset").prop("disabled", true);
            }
        });

        cloud.get().map.addLayer(printItems);
        // Set locale for date/time string
        var lc = window._vidiLocale.split("_")[0];
        require('moment/locale/da');
        moment.locale(lc);

        Proj4js.defs["EPSG:32632"] = "+proj=utm +zone=32 +ellps=WGS84 +datum=WGS84 +units=m +no_defs";

    },

    off: function () {
        _cleanUp();
        $("#print-form :input, #start-print-btn, #select-scale").prop("disabled", true);
    },

    setCallBack: function (fn) {
        callBack = fn;
    },

    on: function () {
        let numOfPrintTmpl = 0;
        alreadySetFromState = false;
        $("#print-form :input, #start-print-btn, #select-scale").prop("disabled", false);
        $("#print-tmpl").empty();
        $("#print-size").empty();
        $("#print-orientation").empty();
        $("#select-scale").empty();
        center = null;
        scale = null;

        // Set up print dialog
        $("#ul-scale").empty();
        for (var i = 0; i < scales.length; i++) {
            $("#ul-scale").append("<li><a data-scale-ul='" + scales[i] + "' href='#'>" + scales[i] + "</a></li>");
        }

        $("#print-sticky").unbind("change");
        $("#print-sticky").change(function (e) {
            center = $("#print-sticky").is(":checked") ? center : null;
        });

        $("#select-scale").unbind("change");
        $("#select-scale").change(function (e) {
            var s = e.target.value;
            scale = s;
            scales.push(parseInt(s));
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

        var me = this;
        var change = function () {
            var arr = $("#print-form").serializeArray();
            $("#get-print-fieldset").prop("disabled", true);
            if (arr.length === 3) {
                _cleanUp();
                tmpl = arr[0].value;
                pageSize = arr[1].value;
                printingOrientation = arr[2].value;
                setTimeout(() => {
                    if (!alreadySetFromState && $("#print-sticky").is(":checked")) {
                        alreadySetFromState = true;
                        state.getState().then(applicationState => {
                            if (typeof applicationState.modules.print !== "undefined") {
                                let params = applicationState.modules.print;
                                me.control(false,
                                    params.scales, params.tmpl, params.pageSize,
                                    params.orientation, params.legend,
                                    params.bounds, params.scale, params.title, params.comment, params.sticky);
                            } else {
                                me.control();
                            }
                        });
                    } else {
                        me.control();
                    }
                    setTimeout(() => {
                        backboneEvents.get().trigger(`${MODULE_ID}:state_change`);
                    }, 5)
                }, 5);
            } else {
                _cleanUp();
            }
        };

        $(".print-tmpl").unbind("change");
        $(".print-tmpl").change(function (e) {
            $("#print-size").empty();
            $("#print-orientation").empty();

            $.each(printC[e.target.value], function (i, v) {
                $("#print-size").append('<div class="radio radio-primary"><label><input type="radio" class="print print-size" name="print-size" id="' + i + '" value="' + i + '">' + i + '</label></div>');
            });

            // Click the first options in size
            setTimeout(function () {
                $("input:radio[name=print-size]:first").trigger("click");
            }, 5);

            $(".print-size").unbind("change");
            $(".print-size").change(function (e) {
                $("#print-orientation").empty();
                change();
                // Click the first options in orientation
                setTimeout(function () {
                    $("input:radio[name=print-orientation]:first").trigger("click");
                }, 5);
                $.each(printC[$('input[name=print-tmpl]:checked', '#print-form').val()][e.target.value], function (i, v) {
                    $("#print-orientation").append('<div class="radio radio-primary"><label><input type="radio" class="print print-orientation" name="print-orientation" id="' + i + '" value="' + i + '">' + (i === "l" ? "Landscape" : "Portrait") + '</label></div>');
                });
                $(".print-orientation").unbind("change");
                $(".print-orientation").change(function (e) {
                    change();
                });
            });
            change();
        });

        $("#add-legend-btn, #print-title, #print-comment").unbind("change");
        $("#add-legend-btn, #print-title, #print-comment").change(() => {
            setTimeout(() => {
                backboneEvents.get().trigger(`${MODULE_ID}:state_change`);
            }, 5)
        });

        // Click the first options in all
        $("input:radio[name=print-tmpl]:first").trigger("click");
        setTimeout(function () {
            $("input:radio[name=print-size]:first").trigger("click");
            setTimeout(function () {
                $("input:radio[name=print-orientation]:first").trigger("click");
            }, 5)
        }, 5);


    },

    print: (endEventName = "end:print", customData) => {
        return new Promise((resolve, reject) => {
            state.bookmarkState(customData).then(response => {
                backboneEvents.get().trigger(endEventName, response);
                callBack(response.responseJSON);
                resolve();
            }).catch(response => {
                backboneEvents.get().trigger(endEventName, response);
                callBack(response.responseJSON);
                reject();
            });
        });
    },

    control: function (p, s, t, pa, o, l, b, sc, ti, cm, st) {
        _cleanUp();
        printC = p ? p : printC;
        scales = s ? s : scales;
        tmpl = t ? t : tmpl;
        pageSize = pa ? pa : pageSize;
        printingOrientation = o ? o : printingOrientation;
        legend = l ? l : null;
        let bnds = b || null;
        if (sc) {
            scale = sc;
            $("#select-scale").val(sc);
        }
        let opacity = 0.5;
        if (t) {
            $('#' + t).trigger("click");
        }
        setTimeout(() => {
            if (pa) {
                $('#' + pa).trigger("click");
            }
            setTimeout(() => {
                if (o) {
                    $('#' + o).trigger("click");
                }
            }, 5);
        }, 5);

        if (ti) {
            $('#print-title').val(decodeURIComponent(ti));
        }
        if (cm) {
            $('#print-comment').val(decodeURIComponent(cm));
        }
        if (l) {
            $("#add-legend-btn").prop("checked", l === "inline");
        }
        if (st) {
            $("#print-sticky").prop("checked", st);
        }

        var ps = printC[tmpl][pageSize][printingOrientation].mapsizeMm, curScale, newScale, curBounds, newBounds;
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
                    scale = scales[i];
                }
            }
            newScale = scale;
            newBounds = [sw.lat, sw.lng, ne.lat, ne.lng];

            // Get utm zone
            var zone = require('./utmZone.js').getZone(sw.lat, sw.lng);
            Proj4js.defs["EPSG:32632"] = "+proj=utm +zone=" + zone + " +ellps=WGS84 +datum=WGS84 +units=m +no_defs";
            return scale;
        };
        var rectangle = function (initCenter, scaleObject, color, initScale, isFirst, rec = false) {
            scale = initScale ? initScale : _getScale(scaleObject);
            $("#select-scale").val(scale);
            if (isFirst && !sc) { // Only when print tool is activated first time and no state from project
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
                opacity: 1,
                aspectRatio: (ps[0] / ps[1])
            });
            center = rectangle.getBounds().getCenter();
            return rectangle;
        };
        var first = center ? false : true;
        center = center || cloud.get().map.getCenter(); // Init center as map center
        if (bnds) {
            let rec = L.rectangle([[bnds._southWest.lat, bnds._southWest.lng], [bnds._northEast.lat, bnds._northEast.lng]], {
                color: "yellow",
                fillOpacity: 0,
                aspectRatio: (ps[0] / ps[1])
            });
            recEdit = rectangle(rec.getBounds().getCenter(), cloud.get().map, "yellow", scale, first);
            bnds = null;
        } else {
            recEdit = rectangle(center, cloud.get().map, "yellow", scale, first);
        }
        recEdit._vidi_type = "printHelper";
        printItems.addLayer(recEdit);
        recEdit.editing.enable();

        recScale = rectangle(recEdit.getBounds().getCenter(), recEdit, "red");
        recScale._vidi_type = "print";
        printItems.addLayer(recScale);

        var sw = recEdit.getBounds().getSouthWest(), ne = recEdit.getBounds().getNorthEast();

        curBounds = [sw.lat, sw.lng, ne.lat, ne.lng];

        recEdit.on('edit', function (e) {
            rectangle(recEdit.getBounds().getCenter(), recEdit, "red");

            if (curScale !== newScale || (curBounds[0] !== newBounds[0] && curBounds[1] !== newBounds[1] && curBounds[2] !== newBounds[2] && curBounds[3] !== newBounds[3])) {
                scales = config.print.scales;

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

            backboneEvents.get().trigger(`${MODULE_ID}:state_change`);
        });
        return recScale;
    },

    getPrintParams: () => {
        if (paramsFromDb) {
            setTimeout(() => {
                paramsFromDb = null;
            }, 0);
            return paramsFromDb;
        }

        var layerQueryDraw = [], layerQueryResult = [], layerQueryBuffer = [], layerPrint = [], e, parr, configFile = null, uriObj = new uriJs(window.location.href);
        if (isNaN(scale) || scale < 100) {
            alert(__("Not a valid scale. Must be over 100."));
            return false;
        }
        backboneEvents.get().trigger("start:print");
        try {
            recEdit.editing.disable();
        } catch (e) {
        }
        let layerDraw = serializeLayers.serializeDrawnItems(true);
        let anchorRaw = anchor.getAnchor();
        anchorRaw = anchorRaw.substr(0, anchorRaw.lastIndexOf(`/`));

        // Serialize drawing layers
        e = serializeLayers.serialize({
            "printHelper": true,
            "query_draw": false, // Get query draw
            "query_buffer": true,
            "query_result": true,
            "draw": true,
            "print": true
        }, true);
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
        }, true);
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
        }, true);
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
        }, true);
        $.each(e, function (i, v) {
            if (v.type === "Vector") {
                layerPrint.push({geojson: v.geoJson})
            }
        });

        let data = {
            anchor: anchorRaw,
            applicationHost: window.location.origin,
            db: db,
            schema: schema,
            draw: (typeof layerDraw[0] !== "undefined" && layerDraw[0].geojson.features.length > 0) ? layerDraw : null,
            queryDraw: (typeof layerQueryDraw[0] !== "undefined" && layerQueryDraw[0].geojson.features.length > 0) ? layerQueryDraw : null,
            queryBuffer: (typeof layerQueryBuffer[0] !== "undefined" && layerQueryBuffer[0].geojson.features.length > 0) ? layerQueryBuffer : null,
            queryResult: (typeof layerQueryResult[0] !== "undefined" && layerQueryResult[0].geojson.features.length > 0) ? layerQueryResult : null,
            print: (typeof layerPrint[0] !== "undefined" && layerPrint[0].geojson.features.length > 0) ? layerPrint : null,
            bounds: recScale.getBounds(),
            scale: scale,
            tmpl: tmpl,
            pageSize: pageSize,
            orientation: printingOrientation,
            title: encodeURIComponent($("#print-title").val()),
            comment: encodeURIComponent($("#print-comment").val()),
            legend: $("#add-legend-btn").is(":checked") ? "inline" : "none",
            header: encodeURIComponent($("#print-title").val()) || encodeURIComponent($("#print-comment").val()) ? "inline" : "none",
            dateTime: moment().format('Do MMMM YYYY, H:mm'),
            date: moment().format('Do MMMM YYYY'),
            metaData: meta.getMetaData(),
            px: config.print.templates[tmpl][pageSize][printingOrientation].mapsizePx[0],
            py: config.print.templates[tmpl][pageSize][printingOrientation].mapsizePx[1],
            queryString: uriObj.search(),
            customData: null,
            scales: scales,
            sticky: $("#print-sticky").is(":checked")
        };
        if (urlVars.config) {
            parr = urlVars.config.split("#");
            if (parr.length > 1) {
                parr.pop();
            }
            data.config = parr.join();
        }
        recEdit.editing.enable();
        return data;
    },

    /**
     * Gathers current application state
     *
     * @returns {Object}
     */
    getPrintData: (customData) => {
        return new Promise((resolve, reject) => {
            let data = _self.getPrintParams();
            data.customData = customData || null;
            state.getState().then(applicationState => {
                data.state = applicationState;
                resolve(data);
            });
        });
    },

    cleanUp: function (hard) {
        _cleanUp(hard);
    },

    getState: () => {
        return _self.getPrintParams();
    },

    applyState: (print) => {
        paramsFromDb = print;
        backboneEvents.get().trigger(`${MODULE_ID}:state_change`);
    }
};
