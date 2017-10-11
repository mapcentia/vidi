/**
 * @fileoverview Description of file, its uses and information
 * about its dependencies.
 */

'use strict';

var urlparser = require('./../../../browser/modules/urlparser');
var cloud;
var clicktimer;
var meta;
var draw;
var sqlQuery;
var qstore = [];
var active = false;
var conflictSearch;

/**
 *
 * @type {string}
 */
var fromObjectText = "Objekt fra ";

/**
 *
 * @type {{set: module.exports.set, init: module.exports.init, reset: module.exports.reset, active: module.exports.active}}
 */
module.exports = {
    set: function (o) {
        cloud = o.cloud.get();
        meta = o.meta;
        draw = o.draw;
        sqlQuery = o.sqlQuery;
        conflictSearch = o.extensions.conflictSearch.index;
        return this;
    },
    init: function () {
        cloud.on("dblclick", function () {
            clicktimer = undefined;
        });
        cloud.on("click", function (e) {
            if (active === false) {
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
                    $("#conflict-info-tab").empty();
                    $("#conflict-info-pane").empty();
                    sqlQuery.init(qstore, wkt, "3857",
                        function (th, isEmpty, not_querable, layerTitel, fieldConf, layers, count) {
                            var layerObj = th, out = [], fieldLabel, first = true, storeId = th.id;
                            isEmpty = layerObj.isEmpty();
                            if (!isEmpty && !not_querable) {
                                $('#conflict-modal-info-body').show();
                                $("#conflict-info-tab").append('<li><a data-toggle="tab" href="#_' + storeId + '">' + layerTitel + '</a></li>');
                                $("#conflict-info-pane").append('<div class="tab-pane" id="_' + storeId + '"><button type="button" class="btn btn-primary btn-xs" data-gc2-title="' + layerTitel + '" data-gc2-store="' + storeId + '">' + __('Search with this object') + '</button><table class="table table-condensed"><thead><tr><th>' + __("Property") + '</th><th>' + __("Value") + '</th></tr></thead></table></div>');
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
                                        $("#_" + storeId + " table").append('<tr><td>' + property[2] + '</td><td>' + property[3] + '</td></tr>');
                                    });
                                    out = [];
                                    $('#conflict-info-tab a:first').tab('show');
                                });
                                var height;
                                try {
                                    height = require('./../../../browser/modules/height')().max - 400;
                                } catch (e) {
                                    console.info(e.message);
                                    height = 0;
                                }
                            } else {
                                layerObj.reset();
                            }
                            count.index++;
                            if (count.index === layers.length) {
                                $("#conflict-info-content button").click(function (e) {
                                    conflictSearch.clearDrawing();
                                    conflictSearch.addDrawing(qstore[$(this).data('gc2-store')].layer);
                                    conflictSearch.makeSearch(fromObjectText + $(this).data('gc2-title'));
                                });
                                $('#conflict-main-tabs a[href="#conflict-info-content"]').tab('show');
                            }
                        }, 1);
                }, 250);
            }
        });
    },

    /**
     *
     */
    reset: function () {
        sqlQuery.reset(qstore);
    },

    /**
     *
     * @param a {boolean}
     */
    active: function (a) {
        active = a;
    }
};