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
var backboneEvents;
/**
 *
 * @type {*|exports|module.exports}
 */
var meta;

/**
 *
 * @type {*|exports|module.exports}
 */
var layers;

/**
 *
 * @type {*|exports|module.exports}
 */
var layerTree;

/**
 *
 * @type {*|exports|module.exports}
 */
var switchLayer;

/**
 *
 * @type {*|exports|module.exports}
 */
var urlparser = require('./../../urlparser');

/**
 *
 */
var jquery = require('jquery');

require('snackbarjs');

var db = urlparser.db;

var sort = [
    {"layergroup.raw": "asc"},
    {"f_table_title.raw": "asc"}
];

var addedLayers = [];

/**
 *
 * @type {{set: module.exports.set, init: module.exports.init}}
 */
module.exports = {
    set: function (o) {
        cloud = o.cloud;
        meta = o.meta;
        layers = o.layers;
        switchLayer = o.switchLayer;
        layerTree = o.layerTree;
        backboneEvents = o.backboneEvents;
        return this;
    },
    init: function () {

        // Create a button and insert into DOM
        // ===================================

        $('<button id="layer-search-btn" class="btn btn-raised" style="width: 100%"><i class="material-icons">&#xE8B6;</i>Søg i lag</button>').insertBefore("#layers");
    },

    /**
     *
     * @param query
     * @returns {boolean}
     */
    search: function (query) {

        var fields = ["f_table_title", "layergroup"], q, terms = [], qFields = [], med = [],
            qJson = {
                "sort": sort,
                "query": {
                    "bool": {
                        "should": {}
                    }
                }
            };


        if (!query || query === "") {
            return false;
        }
        // Trim and delete multiple spaces
        query = query.toLowerCase().replace(/\s\s+/g, ' ').trim();

        // Create terms and fields
        $.each(query.split(" "), function (x, n) {
            $.each(fields, function (i, v) {
                var a = v, b = {};
                b[a] = n;
                terms.push({
                    "term": b
                });
                qFields.push(v)
            });
            med.push({"bool": {"should": terms}});
            terms = []
        });
        qJson.query.bool.should = med;
        this.run(qJson, query);
    },

    /**
     *
     */
    matchAll: function () {

        var dsl = {
            "sort": sort,
            "query": {
                "match_all": {}
            }
        };

        this.run(dsl);
    },

    /**
     *
     * @param dsl
     * @param query
     */
    run: function (dsl, query) {

        $("#layer-search-list").empty();


        var highlighter = function (value, item) {
            _($.trim(value).split(' ')).each(
                function (s) {
                    var regex = new RegExp('(' + s + ')', 'gi');
                    item = item.replace(regex, "<mark>$1</mark>");
                }
            );
            return item;
        };

        $.ajax({
            url: '/api/extension/layersearch/' + db + "?q=" + JSON.stringify(dsl),
            dataType: "json",
            scriptCharset: "utf-8",
            contentType: "application/json; charset=utf-8",
            method: "GET",
            success: function (response) {
                var html, fieldsObj = {"f_table_title": "Title", "layergroup": "Gruppe"};

                var base64name, arr, groups = [], i, l, count, displayInfo, tooltip;

                for (i = 0; i < response.length; ++i) {
                    groups[i] = response[i]._source.layergroup;
                }

                arr = array_unique(groups);


                for (i = 0; i < arr.length; ++i) {
                    if (arr[i] && arr[i] !== "<font color='red'>[Ungrouped]</font>") {
                        l = [];
                        base64name = Base64.encode(arr[i]).replace(/=/g, "");

                        // Add group container
                        // Only if container doesn't exist
                        // ===============================
                        if ($("#layersearch-layer-panel-" + base64name).length === 0) {
                            $("#layer-search-list").append('<div class="panel panel-default panel-layertree" id="layersearch-layer-panel-' + base64name + '"><div class="panel-heading" role="tab"><h4 class="panel-title"><div class="layer-count badge"><span></span></div><a style="display: block" class="accordion-toggle" data-toggle="collapse" data-parent="#layers" href="#layersearch-collapse' + base64name + '"> ' + arr[i] + ' </a></h4></div><ul class="list-group" id="layersearch-group-' + base64name + '" role="tabpanel"></ul></div>');

                            // Append to inner group container
                            // ===============================
                            $("#layersearch-group-" + base64name).append('<ul class="list-group"><div id="layersearch-collapse' + base64name + '" class="accordion-body collapse"></div></ul>');
                        }

                        // Add layers
                        // ==========
                        for (var u = 0; u < response.length; ++u) {
                            if (response[u]._source.layergroup == arr[i]) {

                                var text = (response[u]._source.f_table_title === null || response[u]._source.f_table_title === "") ? response[u]._source.f_table_name : response[u]._source.f_table_title;

                                $("#layersearch-collapse" + base64name ).append('<li id="layer-search-' + u + '" class="layer-item list-group-item" data-gc2-layer-search-key="' + u + '"><label class="overlay-label">' + text + ' <i class="fa fa-check"></i></label></li>');
                                l.push({});

                                if (addedLayers.indexOf(response[u]._source.f_table_schema + "." + response[u]._source.f_table_name) !== -1) {
                                    $("#layer-search-" + u).addClass("layer-search-is-added");
                                }
                            }
                        }

                        $("#layersearch-layer-panel-" + base64name + " span:eq(0)").html(l.length);

                        // Remove the group if empty
                        if (l.length === 0) {
                            $("#layersearch-layer-panel-" + base64name).remove();
                        }

                        if (l.length < 6) {
                            $("#layersearch-layer-panel-" + base64name).find("a").trigger("click");
                        }
                    }
                }

                $('li.list-group-item:not(.layer-search-is-added)').on("click", function (e) {
                    var clickedLayer = $(this).data('gc2-layer-search-key'), currentLayers, alreadyThere;
                    $(this).addClass("layer-search-is-added");
                    e.stopPropagation();
                    response[clickedLayer]._source.layergroup = "Tilføjede lag";
                    currentLayers = meta.getMetaData().data;

                    $.each(currentLayers, function (i, v) {
                        if (v.f_table_name === response[clickedLayer]._source.f_table_name && v.f_table_schema === response[clickedLayer]._source.f_table_schema) {
                            jquery.snackbar({
                                content: "<span>Laget '" + response[clickedLayer]._source.f_table_title + "' er allerede tilføjet</span>",
                                htmlAllowed: true,
                                timeout: 2500
                            });
                            alreadyThere = true;
                        }
                    });

                    if (alreadyThere) {
                        return;
                    }

                    addedLayers.push(response[clickedLayer]._source.f_table_schema + "." + response[clickedLayer]._source.f_table_name);

                    meta.addMetaData({"data": [response[clickedLayer]._source]});
                    layerTree.init();

                    switchLayer.init(response[clickedLayer]._source.f_table_schema + "." + response[clickedLayer]._source.f_table_name, true);

                    jquery.snackbar({
                        content: "<span>Laget '" + response[clickedLayer]._source.f_table_title + "' tilføjet</span>",
                        htmlAllowed: true,
                        timeout: 2500
                    });
                });
            }
        });

    }
};

