/**
 * @fileoverview Description of file, its uses and information
 * about its dependencies.
 */

'use strict';

/**
 *
 * @type {*|exports|module.exports}
 */
var urlparser = require('./urlparser');

/**
 * @type {string}
 */
var db = urlparser.db;

/**
 * @type {string}
 */
var schema = urlparser.schema;

/**
 * @type {string}
 */
var urlVars = urlparser.urlVars;

/**
 *
 * @type {Array}
 */
var metaDataKeys = [];

/**
 *
 * @type {Array}
 */
var metaDataKeysTitle = [];

/**
 * @type {Object}
 */
var cloud;

/**
 * @type {object}
 */
var switchLayer;

/**
 * @type {object}
 */
var setBaseLayer;

/**
 *
 * @type {boolean}
 */
var ready = false;

/**
 *
 * @type {boolean}
 */
var cartoDbLayersready = false;

/**
 *
 * @type {string}
 */
var BACKEND = require('../../config/config.js').backend;

/**
 * @type {string}
 */
var host;

/**
 * @type {object}
 */
var legend;

try {
    host = require('../../config/config.js').gc2.host;
} catch (e) {
    console.info(e.message);
}

/**
 *
 * @type {{set: module.exports.set, init: module.exports.init, getMetaDataKeys: module.exports.getMetaDataKeys, ready: module.exports.ready}}
 */
module.exports = {
    /**
     *
     * @param o
     * @returns {exports}
     */
    set: function (o) {
        cloud = o.cloud;
        switchLayer = o.switchLayer;
        setBaseLayer = o.setBaseLayer;
        legend = o.legend;
        return this;
    },
    /**
     *
     */
    init: function () {
        $.ajax({
            url: '/api/meta/' + db + '/' + (window.gc2Options.mergeSchemata === null ? "" : window.gc2Options.mergeSchemata.join(",") + ',') + (typeof urlVars.i === "undefined" ? "" : urlVars.i.split("#")[1] + ',') + schema,
            scriptCharset: "utf-8",
            success: function (response) {
                var base64name, isBaseLayer, arr, groups, i, l, cv, metaData, layers = [], displayInfo;
                groups = [];
                metaData = response;
                for (i = 0; i < metaData.data.length; i++) {
                    metaDataKeys[metaData.data[i].f_table_schema + "." + metaData.data[i].f_table_name] = metaData.data[i];
                    (metaData.data[i].f_table_title) ? metaDataKeysTitle[metaData.data[i].f_table_title] = metaData.data[i] : null;
                }
                for (i = 0; i < response.data.length; ++i) {
                    groups[i] = response.data[i].layergroup;
                }
                arr = array_unique(groups);
                response.data.reverse();
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
                                    cartoDbLayersready = true; // CartoDB layers are now created
                                    return null;
                                }
                            });
                        }());
                        break;
                }
                for (i = 0; i < arr.length; ++i) {
                    if (arr[i] && arr[i] !== "<font color='red'>[Ungrouped]</font>") {
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
                                        "<div class='list-group-item'><div class='row-action-primary radio radio-primary base-layer-item' data-gc2-base-id='" + response.data[u].f_table_schema + "." + response.data[u].f_table_name + "'><label class='baselayer-label'><input type='radio' name='baselayers'>" + text + "<span class='fa fa-check' aria-hidden='true'></span></label></div></div>"
                                    );
                                }
                                else {
                                    displayInfo = (response.data[u].meta !== null && $.parseJSON(response.data[u].meta) !== null && typeof $.parseJSON(response.data[u].meta).meta_desc !== "undefined") ? "inline" : "none";
                                    $("#collapse" + base64name).append('<li class="layer-item list-group-item"><div class="checkbox"><label class="overlay-label" style="width: calc(100% - 50px);"><input type="checkbox" id="' + response.data[u].f_table_name + '" data-gc2-id="' + response.data[u].f_table_schema + "." + response.data[u].f_table_name + '">' + text + '</label><span style="display: ' + displayInfo + '" class="info-label label label-primary">Info</span></div></li>');
                                    l.push({});
                                }
                            }
                        }
                        $("#layer-panel-" + base64name + " span:eq(1)").html(l.length);
                        // Remove the group if empty
                        if (l.length === 0) {
                            $("#layer-panel-" + base64name).remove();
                        }
                    }
                }
                ready = true;
            },
            error: function (response) {
                alert(JSON.parse(response.responseText).message);
            }
        }); // Ajax call end
    },

    /**
     * Get the meta data in an array with schema.relation as index keys.
     * @returns {Array}
     */
    getMetaDataKeys: function () {
        return metaDataKeys;
    },

    /**
     * Check if metadata and layers are ready.
     * @returns {boolean}
     */
    ready: function () {
        if (BACKEND === "cartodb") { // If CartoDB, we wait for cartodb.createLayer to finish
            return (ready && cartoDbLayersready);
        }
        else { // GC2 layers are direct tile request
            return ready;
        }
    }
};


