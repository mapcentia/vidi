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
 * @type {{set: module.exports.set, init: module.exports.init}}
 */
module.exports = {
    set: function (o) {
        cloud = o.cloud;
        return this;
    },
    init: function (onLoad, el) {
        var type1, type2, gids = [], searchString, dslA, dslM, shouldA = [], shouldM = [],
            komKode = window.vidiConfig.searchConfig.komkode, placeStore;
        if (!onLoad) {
            onLoad = function () {
                var resultLayer = new L.FeatureGroup();
                cloud.get().map.addLayer(resultLayer);
                resultLayer.addLayer(this.layer);
                cloud.get().zoomToExtentOfgeoJsonStore(this);
                if (cloud.get().map.getZoom() > 17) {
                    cloud.get().map.setZoom(17);
                }
            }
        }
        if (!el) {
            el = "custom-search";
        }
        placeStore = new geocloud.geoJsonStore({
            host: "//eu1.mapcentia.com",
            db: "dk",
            sql: null,
            pointToLayer: null,
            onLoad: onLoad
        });
        if (typeof komKode === "string") {
            komKode = [komKode];
        }
        $.each(komKode, function (i, v) {
            shouldA.push({
                "term": {
                    "properties.kommunekode": "0" + v
                }
            });
            shouldM.push({
                "term": {
                    "properties.komkode": "" + v
                }
            });
        });

        $("#" + el).typeahead({
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
                    dslA = {
                        "query": {
                            "filtered": {
                                "query": {
                                    "query_string": {
                                        "default_field": "string",
                                        "query": encodeURIComponent(query.toLowerCase().replace(",", "")),
                                        "default_operator": "AND"
                                    }
                                },
                                "filter": {
                                    "bool": {
                                        "should": shouldA
                                    }
                                }
                            }
                        }
                    };
                    dslM = {
                        "query": {
                            "filtered": {
                                "query": {
                                    "query_string": {
                                        "default_field": "string",
                                        "query": encodeURIComponent(query.toLowerCase()),
                                        "default_operator": "AND"
                                    }
                                },
                                "filter": {
                                    "bool": {
                                        "should": shouldM
                                    }
                                }
                            }
                        }
                    };
                    $.ajax({
                        url: '//eu1.mapcentia.com/api/v1/elasticsearch/search/dk/aws4/' + type1,
                        data: '&q=' + JSON.stringify(dslA),
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
                        url: '//eu1.mapcentia.com/api/v1/elasticsearch/search/dk/matrikel/' + type2,
                        data: '&q=' + JSON.stringify(dslM),
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
        $('#' + el).bind('typeahead:selected', function (obj, datum, name) {
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
                    $("#" + el).val(datum.value + " ").trigger("paste").trigger("input");
                }, 100)
            }
        });
    }

};

