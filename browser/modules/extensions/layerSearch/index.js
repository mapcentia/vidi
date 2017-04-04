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

var backboneEvents;

var meta;

var layers;
var layerTree;
var switchLayer;

var jquery = require('jquery');
require('snackbarjs');

var urlparser = require('./../../urlparser');

var db = urlparser.db;

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

    search: function (query) {

        var fields = ["f_table_title", "layergroup"], q, terms = [], qFields = [], med = [],
            qJson = {
                "query": {
                    "bool": {
                        "should": {}
                    }
                }
            };

        $("#layer-search-list").empty();

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
        console.log(qJson);
        this.run(qJson, query);
    },

    matchAll: function () {
        var dsl = {
            "query": {
                "match_all": {}
            }
        };
        this.run(dsl);
    },

    run: function (dsl, query) {

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
                $.each(response, function (i, hit) {
                    html = "<section class='layer-search-list-item' style='margin-bottom: 7px'>";
                    html = html + "<a href='javascript:void(0)' class='list-group-item' data-gc2-sf-title='" + hit._source.f_table_title + "' data-gc2-layer-search-key='" + i + "'>";
                    html = html + "<div>";
                    $.each(fieldsObj, function (u, v) {
                        html = html + "<div><small class='layer-search-item'>" + v + " </small><span>" + (query ? highlighter(query, _.unescape(hit._source[u])) : _.unescape(hit._source[u])) + "</span></div>";
                    });
                    html = html + "</div></a></section>";
                    $("#layer-search-list").append(html);

                });
                $('a.list-group-item').on("click", function (e) {
                    var clickedLayer = $(this).data('gc2-layer-search-key'), currentLayers, alreadyThere;
                    e.stopPropagation();
                    response[clickedLayer]._source.layergroup = "Tilføjede lag";
                    currentLayers = meta.getMetaData().data;
                    $.each(currentLayers, function (i, v) {
                        if (v.f_table_name === response[clickedLayer]._source.f_table_name && v.f_table_schema === response[clickedLayer]._source.f_table_schema) {
                            jquery.snackbar({content: "<span>Laget '" + response[clickedLayer]._source.f_table_title + "' er allerede tilføjet</span>", htmlAllowed: true, timeout: 2500});
                            alreadyThere = true;
                        }
                    });
                    if (alreadyThere) {
                        $(this).parent("section").fadeOut(100).fadeIn(100);
                        return;
                    }
                    $(this).parent("section").fadeOut(200);
                    meta.addMetaData({"data": [response[clickedLayer]._source]});
                    layerTree.init();
                    layers.init().then(function () {
                        switchLayer.init(response[clickedLayer]._source.f_table_schema + "." + response[clickedLayer]._source.f_table_name, true);
                    });

                    jquery.snackbar({content: "<span>Laget '" + response[clickedLayer]._source.f_table_title + "' tilføjet</span>", htmlAllowed: true, timeout: 2500});
                });
            }
        });

    }
};

