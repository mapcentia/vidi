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
 * @type {module.exports.searchConfig|{komkode}}
 */
var config = require('../../../config/config.js').searchConfig;

/**
 *
 * @type {{set: module.exports.set, init: module.exports.init}}
 */
module.exports = {
    set: function (o) {
        cloud = o.cloud;
        return this;
    },
    init: function () {
        var type1, type2, gids = [], source = [], searchString, dsl1, dsl2,
            komKode = config.komkode,
            placeStore = new geocloud.geoJsonStore({
                host: "http://eu1.mapcentia.com",
                db: "dk",
                sql: null,
                pointToLayer: null,
                onLoad: function () {
                    var resultLayer = new L.FeatureGroup();
                    cloud.map.addLayer(resultLayer);
                    resultLayer.addLayer(this.layer);
                    cloud.zoomToExtentOfgeoJsonStore(this);
                    if (cloud.map.getZoom() > 17) {
                        cloud.map.setZoom(17);
                    }
                }
            });
        $('#custom-search').typeahead({
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
                    console.log(type1);
                    switch (type1) {
                        case "vejnavn,bynavn":
                            dsl1 = {
                                "from": 0,
                                "size": 0,
                                "query": {
                                    "bool": {
                                        "must": {
                                            "query_string": {
                                                "default_field": "properties.string2",
                                                "query": encodeURIComponent(query.toLowerCase().replace(",", "")),
                                                "default_operator": "AND"
                                            }
                                        },
                                        "filter": {
                                            "bool": {
                                                "must": [
                                                    {
                                                        "term": {
                                                            "properties.kommunekode": "0851"
                                                        }
                                                    }
                                                ]
                                            }
                                        }
                                    }
                                },
                                "_source": {
                                    "includes": ["properties.postnrnavn", "properties.postnr", "properties.kommunekode", "properties.regionskode"],
                                    "excludes": []
                                },
                                "fields": ["properties.postnrnavn", "properties.postnr", "properties.kommunekode", "properties.regionskode"],
                                "aggregations": {
                                    "properties.postnrnavn": {
                                        "terms": {
                                            "field": "properties.postnrnavn",
                                            "size": 10,
                                            "order": {
                                                "_term": "asc"
                                            }
                                        },
                                        "aggregations": {
                                            "properties.postnr": {
                                                "terms": {
                                                    "field": "properties.postnr",
                                                    "size": 0
                                                },
                                                "aggregations": {
                                                    "properties.kommunekode": {
                                                        "terms": {
                                                            "field": "properties.kommunekode",
                                                            "size": 0
                                                        },
                                                        "aggregations": {
                                                            "properties.regionskode": {
                                                                "terms": {
                                                                    "field": "properties.regionskode",
                                                                    "size": 0
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            };
                            dsl2 = {
                                "from": 0,
                                "size": 0,
                                "query": {
                                    "bool": {
                                        "must": {
                                            "query_string": {
                                                "default_field": "properties.string3",
                                                "query": encodeURIComponent(query.toLowerCase().replace(",", "")),
                                                "default_operator": "AND"
                                            }
                                        },
                                        "filter": {
                                            "bool": {
                                                "must": [
                                                    {
                                                        "term": {
                                                            "properties.kommunekode": "0851"
                                                        }
                                                    }
                                                ]
                                            }
                                        }
                                    }
                                },
                                "_source": {
                                    "includes": ["properties.vejnavn", "properties.kommunekode", "properties.regionskode"],
                                    "excludes": []
                                },
                                "fields": ["properties.vejnavn", "properties.kommunekode", "properties.regionskode"],
                                "aggregations": {
                                    "properties.vejnavn": {
                                        "terms": {
                                            "field": "properties.vejnavn",
                                            "size": 10,
                                            "order": {
                                                "_term": "asc"
                                            }
                                        },
                                        "aggregations": {
                                            "properties.kommunekode": {
                                                "terms": {
                                                    "field": "properties.kommunekode",
                                                    "size": 0
                                                },
                                                "aggregations": {
                                                    "properties.regionskode": {
                                                        "terms": {
                                                            "field": "properties.regionskode",
                                                            "size": 0
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            };
                            break;
                        case "vejnavn_bynavn":
                            dsl1 = {
                                "from": 0,
                                "size": 0,
                                "query": {
                                    "bool": {
                                        "must": {
                                            "query_string": {
                                                "default_field": "properties.string1",
                                                "query": encodeURIComponent(query.toLowerCase().replace(",", "")),
                                                "default_operator": "AND"
                                            }
                                        },
                                        "filter": {
                                            "bool": {
                                                "must": [
                                                    {
                                                        "term": {
                                                            "properties.kommunekode": "0851"
                                                        }
                                                    }
                                                ]
                                            }
                                        }
                                    }
                                },
                                "_source": {
                                    "includes": ["properties.vejnavn", "properties.postnrnavn", "properties.kommunekode", "properties.regionskode"],
                                    "excludes": []
                                },
                                "fields": ["properties.vejnavn", "properties.postnrnavn", "properties.kommunekode", "properties.regionskode"],
                                "aggregations": {
                                    "properties.vejnavn": {
                                        "terms": {
                                            "field": "properties.vejnavn",
                                            "size": 10,
                                            "order": {
                                                "_term": "asc"
                                            }
                                        },
                                        "aggregations": {
                                            "properties.postnrnavn": {
                                                "terms": {
                                                    "field": "properties.postnrnavn",
                                                    "size": 0
                                                },
                                                "aggregations": {
                                                    "properties.kommunekode": {
                                                        "terms": {
                                                            "field": "properties.kommunekode",
                                                            "size": 0
                                                        },
                                                        "aggregations": {
                                                            "properties.regionskode": {
                                                                "terms": {
                                                                    "field": "properties.regionskode",
                                                                    "size": 0
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            };
                            break;
                        case "adresse":
                            dsl1 = {
                                "from": 0,
                                "size": 10,
                                "query": {
                                    "bool": {
                                        "must": {
                                            "query_string": {
                                                "default_field": "properties.string4",
                                                "query": encodeURIComponent(query.toLowerCase().replace(",", "")),
                                                "default_operator": "AND"
                                            }
                                        },
                                        "filter": {
                                            "bool": {
                                                "must": [
                                                    {
                                                        "term": {
                                                            "properties.kommunekode": "0851"
                                                        }
                                                    }
                                                ]
                                            }
                                        }
                                    }
                                },

                                "sort": [
                                    {
                                        "properties.vejnavn": {
                                            "order": "asc"
                                        }
                                    },
                                    {
                                        "properties.husnr": {
                                            "order": "asc"
                                        }
                                    }
                                ]
                            };
                            break;
                    }
                    $.ajax({
                        url: 'http://127.0.0.1:8080/api/v1/elasticsearch/search/mydb/aws/adgangsadresser_view',
                        data: '&q=' + JSON.stringify(dsl1),
                        contentType: "application/json; charset=utf-8",
                        scriptCharset: "utf-8",
                        dataType: 'jsonp',
                        jsonp: 'jsonp_callback',
                        success: function (response) {
                            if (type1 === "vejnavn,bynavn") {
                                $.each(response.aggregations["properties.postnrnavn"].buckets, function (i, hit) {
                                    var str = hit.key;
                                    names.push({value: str});
                                });
                                $.ajax({
                                    url: 'http://127.0.0.1:8080/api/v1/elasticsearch/search/mydb/aws/adgangsadresser_view',
                                    data: '&q=' + JSON.stringify(dsl2),
                                    contentType: "application/json; charset=utf-8",
                                    scriptCharset: "utf-8",
                                    dataType: 'jsonp',
                                    jsonp: 'jsonp_callback',
                                    success: function (response) {
                                        if (type1 === "vejnavn,bynavn") {
                                            $.each(response.aggregations["properties.vejnavn"].buckets, function (i, hit) {
                                                var str = hit.key;
                                                names.push({value: str});
                                            });
                                        }
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
                            } else if (type1 === "vejnavn_bynavn") {
                                $.each(response.aggregations["properties.vejnavn"].buckets, function (i, hit) {
                                    var str = hit.key;
                                    $.each(hit["properties.postnrnavn"].buckets, function (m, n) {
                                        var tmp = str;
                                        tmp = tmp + ", " + n.key;
                                        names.push({value: tmp});
                                    });

                                });
                                if (names.length === 1 && (type1 === "vejnavn,bynavn" || type1 === "vejnavn_bynavn")) {
                                    type1 = "adresse";
                                    names = [];
                                    gids = [];
                                    ca();
                                } else {
                                    cb(names);
                                }

                            } else if (type1 === "adresse") {
                                $.each(response.hits.hits, function (i, hit) {
                                    var str = hit._source.properties.string4;
                                    gids[str] = hit._source.properties.gid;
                                    source[str] = hit._source;
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
                type2 = (query.match(/\d+/g) != null) ? "jordstgykke" : "ejerglav";
                (function ca() {
                    $.ajax({
                        url: 'http://eu1.mapcentia.com/api/v1/elasticsearch/search/dk/matrikel/' + type2,
                        data: '&q={"query":{"filtered":{"query":{"query_string":{"default_field":"string","query":"' + encodeURIComponent(query.toLowerCase()) + '","default_operator":"AND"}},"filter":{"term":{"komkode":"' + komKode + '"}}}}}',
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
        $('#custom-search').bind('typeahead:selected', function (obj, datum, name) {
            if ((type1 === "adresse" && name === "adresse") || (type2 === "jordstykke" && name === "matrikel")) {
                placeStore.reset();
                console.log(source[datum.value]);

                var l = L.geoJson(source[datum.value]);
                l.addTo(cloud.map)

                cloud.map.fitBounds(l.getBounds());
                if (cloud.map.getZoom() > 17) {
                    cloud.map.setZoom(17);
                }

                /*if (name === "matrikel") {
                    placeStore.sql = "SELECT gid,the_geom,ST_asgeojson(ST_transform(the_geom,4326)) as geojson FROM matrikel.jordstykke WHERE gid=" + gids[datum.value];
                }
                if (name === "adresse") {
                    placeStore.sql = "SELECT gid,the_geom,ST_asgeojson(ST_transform(the_geom,4326)) as geojson FROM adresse.adgang4 WHERE gid=" + gids[datum.value];
                }
                searchString = datum.value;
                placeStore.load();*/
            } else {
                setTimeout(function () {
                    $(".typeahead").val(datum.value + " ").trigger("paste").trigger("input");
                }, 100)
            }
        });
    }

};

