/**
 * @fileoverview Description of file, its uses and information
 * about its dependencies.
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
var setting;

/**
 *
 * @type {*|exports|module.exports}
 */
var utils;

/**
 *
 * @type {*|exports|module.exports}
 */
var backboneEvents;

/**
 *
 * @type {*|exports|module.exports}
 */
var urlparser = require('./../../urlparser');

/**
 *
 * @type {array}
 */
var urlVars = urlparser.urlVars;

/**
 * @type {string}
 */
var db = urlparser.db;

/**
 *
 * @type {{set: module.exports.set, init: module.exports.init}}
 */
module.exports = module.exports = {
    set: function (o) {
        cloud = o.cloud;
        setting = o.setting;
        utils = o.utils;
        meta = o.meta;
        backboneEvents = o.backboneEvents;
        return this;
    },
    init: function () {
        var base64name, arr, groups = [], metaData, i, l, displayInfo, store = [];

        utils.createMainTab("vectorlayers", "Vektor lag");
        $('#main-tabs a[href="#vectorlayer-content"]').tab('show');

        if (!urlVars.px && !urlVars.py) {
            $(document).arrive('.refresh-vector-layer', function () {
                $(this).on("click", function (e) {
                    var id = ($(this).parent().prev().children("input").data('gc2-id'));
                    store[id].reset();
                    store[id].load();
                    $('*[data-gc2-id="' + id + '"]').parent().siblings().children().addClass("fa-spin");
                    e.stopPropagation();
                });

            });
        }
        backboneEvents.get().on("ready:meta", function () {
            metaData = meta.getMetaData();
            for (i = 0; i < metaData.data.length; ++i) {
                groups[i] = metaData.data[i].layergroup;
            }
            arr = array_unique(groups.reverse());
            metaData.data.reverse();
            for (i = 0; i < arr.length; ++i) {
                if (arr[i] && arr[i] !== "<font color='red'>[Ungrouped]</font>") {
                    l = [];
                    base64name = Base64.encode(arr[i]).replace(/=/g, "");
                    $("#vectorlayers").append('<div class="panel panel-default" id="vectorlayer-panel-' + base64name + '"><div class="panel-heading" role="tab"><h4 class="panel-title"><div class="layer-count badge"><span>0</span> / <span></span></div><a style="display: block" class="accordion-toggle" data-toggle="collapse" data-parent="#vectorlayers" href="#vectorcollapse' + base64name + '"> ' + arr[i] + ' </a></h4></div><ul class="list-group" id="vectorgroup-' + base64name + '" role="tabpanel"></ul></div>');
                    $("#vectorgroup-" + base64name).append('<div id="vectorcollapse' + base64name + '" class="accordion-body collapse"></div>');
                    for (var u = 0; u < metaData.data.length; ++u) {
                        if (metaData.data[u].layergroup == arr[i]) {
                            var text = (metaData.data[u].f_table_title === null || metaData.data[u].f_table_title === "") ? metaData.data[u].f_table_name : metaData.data[u].f_table_title,
                                id = "v:" + metaData.data[u].f_table_schema + "." + metaData.data[u].f_table_name;
                            if (!metaData.data[u].baselayer) {
                                store[id] = new geocloud.sqlStore({
                                    jsonp: false,
                                    method: "POST",
                                    host: "",
                                    db: db,
                                    uri: "/api/sql",
                                    clickable: true,
                                    id: id,
                                    name: id,
                                    lifetime: 0,
                                    sql: "SELECT * FROM " + metaData.data[u].f_table_schema + "." + metaData.data[u].f_table_name + " LIMIT 500",
                                    onLoad: function () {
                                        var me = this;
                                        try {
                                            $('*[data-gc2-id="' + me.id + '"]').parent().siblings().children().removeClass("fa-spin")
                                        } catch (e) {
                                        }
                                        (function poll() {
                                            setTimeout(function () {
                                                if ($('*[data-gc2-id="' + me.id + '"]').is(':checked')) {
                                                    me.reset();
                                                    me.load();
                                                    $('*[data-gc2-id="' + me.id + '"]').parent().siblings().children().addClass("fa-spin");
                                                } else {
                                                    poll();
                                                }
                                            }, 30000);
                                        }());
                                    }
                                });
                                // Add the geojson layer to the layercontrol
                                cloud.get().layerControl.addOverlay(store[id].layer, id);
                                store[id].load();
                                displayInfo = (metaData.data[u].meta !== null && $.parseJSON(metaData.data[u].meta) !== null && typeof $.parseJSON(metaData.data[u].meta).meta_desc !== "undefined") ? "inline" : "none";
                                $("#vectorcollapse" + base64name).append('<li class="layer-item list-group-item"><div class="checkbox"><label class="overlay-label" style="width: calc(100% - 50px);"><input type="checkbox" data-gc2-id="' + id + '">' + text + '</label><span><i class="refresh-vector-layer fa fa-refresh fa-lg" style="display: inline-block; float: none; cursor: pointer;"></i></span></div></li>');
                                l.push({});
                            }
                        }
                    }
                    $("#vectorlayer-panel-" + base64name + " span:eq(1)").html(l.length);
                    // Remove the group if empty
                    if (l.length === 0) {
                        $("#vectorlayer-panel-" + base64name).remove();
                    }
                }
            }
        })
    }
};