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


Proj4js.defs["EPSG:32632"] = "+proj=utm +zone=32 +ellps=WGS84 +datum=WGS84 +units=m +no_defs";

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
                        $("#print-orientation").append('<div class="radio radio-primary"><label><input type="radio" class="print print-orientation" name="print-orientation" id="' + i + '" value="' + i + '">' + i + '</label></div>');
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
                orientation: orientation

            }),
            scriptCharset: "utf-8",
            success: function (response) {
                var link = document.createElement('a');
                link.href = "/static/tmp/print/pdf/" + response.key + '.pdf';
                link.download = response.key + '.pdf';
                link.dispatchEvent(new MouseEvent('click'));

            }
        });


    },
    control: function () {
        if (!printOn) {
            printOn = true;

            var ps = printC[tmpl][pageSize][orientation].mapsizeMm, curScale, newScale, curBounds, newBounds;
            var _getScale = function (scaleObject) {
                var bounds = scaleObject.getBounds(),
                //scales = [250, 500, 1000, 2000, 3000, 4000, 5000, 5000, 7500, 10000, 15000, 25000, 50000, 100000],
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
                return scale;
            };

            var rectangle = function (initCenter, scaleObject, color, initScale, isFirst) {
                scale = initScale || _getScale(scaleObject);
                $("#select-scale").val(scale);

                if (isFirst) {
                    var scaleIndex = scales.indexOf(scale);
                    if (scaleIndex > 0) {
                        scaleIndex--;
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



