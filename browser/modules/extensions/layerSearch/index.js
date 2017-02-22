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

var jquery = require('jquery');
require('snackbarjs');

/**
 *
 * @type {{set: module.exports.set, init: module.exports.init}}
 */
module.exports = {
    set: function (o) {
        cloud = o.cloud;
        meta = o.meta;
        backboneEvents = o.backboneEvents;
        return this;
    },
    init: function () {
    },

    search: function (query) {
        var searchLayers = [], searchStyle = {
            color: '#ff0000',
            fillColor: '#ff0000',
            fillOpacity: 0.5,
            opacity: 0.5
        }, highlighter = function (value, item) {
            _($.trim(value).split(' ')).each(
                function (s) {
                    var regex = new RegExp('(\\b' + s + ')', 'gi');
                    item = item.replace(regex, "<i class=\"highlighted\">$1</i>");
                }
            );
            return item;
        };

        console.info("Søg")
        var more = [], fields = ["f_table_title", "layergroup"], q, terms = [], qFields = [], med = [],
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
        q = JSON.stringify(qJson);
        $.ajax({
            url: '/api/extension/es',
            data: q,
            dataType: "json",
            scriptCharset: "utf-8",
            contentType: "application/json; charset=utf-8",
            method: "POST",
            success: function (response) {
                var html, fieldsObj = {"f_table_title": "Title", "layergroup": "Gruppe"};
                $.each(response, function (i, hit) {
                    html = "<section class='layer-search-list-item' style='margin-bottom: 7px'>";
                    html = html + "<a href='javascript:void(0)' class='list-group-item' data-gc2-sf-title='" + hit._source.f_table_title + "' data-gc2-layer-search-key='" + i + "'>";
                    html = html + "<div>";
                    $.each(fieldsObj, function (u, v) {
                        html = html + "<div><span>" + v + " </span><span>" + highlighter(query, _.unescape(hit._source[u])) + "</span></div>";
                    });
                    html = html + "</div></a></section>";
                    $("#layer-search-list").append(html);

                });
                $('a.list-group-item').on("click", function (e) {
                    var clickedLayer = $(this).data('gc2-layer-search-key');
                    $(this).parent("section").fadeOut(200);
                    response[clickedLayer]._source.layergroup = "MARTIN";
                    meta.addMetaData({"data": [response[clickedLayer]._source]});
                    jquery.snackbar({content: "<span>Laget '" + response[clickedLayer]._source.f_table_title + "' tilføjet</span>", htmlAllowed: true, timeout: 2500});

                    e.stopPropagation();
                });
            }
        });
    }
};

