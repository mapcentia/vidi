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
 */
var backboneEvents;

/**
 *
 * @type {{set: module.exports.set, init: module.exports.init}}
 */
module.exports = {
    set: function (o) {
        cloud = o.cloud;
        backboneEvents = o.backboneEvents;
        return this;
    },
    init: function (onLoad, el, onlyAddress) {
        var type1, type2, gids = [], source = [], searchString, dslA, dslM, shouldA = [], shouldM = [], dsl1, dsl2,
            komKode = window.vidiConfig.searchConfig.komkode, placeStore, maxZoom;

        // Set max zoom then zooming on target
        // ===================================

        maxZoom = 18;

        // Listen for clearing event
        // =========================

        backboneEvents.get().on("clear:search", function () {
            console.info("Clearing search");
            placeStore.reset();
            $("#custom-search").val("");
        });


        // Set default onLoad function.
        // It just zooms to feature
        // ============================

        if (!onLoad) {
            onLoad = function () {
                var resultLayer = new L.FeatureGroup();
                cloud.get().map.addLayer(resultLayer);
                resultLayer.addLayer(this.layer);
                cloud.get().zoomToExtentOfgeoJsonStore(this);
                if (cloud.get().map.getZoom() > maxZoom) {
                    cloud.get().map.setZoom(maxZoom);
                }
            }
        }


        // Set default input element
        // =========================

        if (!el) {
            el = "custom-search";
        }

        // Define GC2 SQL store
        // ====================

        placeStore = new geocloud.sqlStore({
            db: "dk",
            sql: null,
            clickable: false,
            // Make Awesome Markers
            pointToLayer: function (feature, latlng) {
                return L.marker(latlng, {
                    icon: L.AwesomeMarkers.icon({
                            icon: 'home',
                            markerColor: '#C31919',
                            prefix: 'fa'
                        }
                    )
                });
            },
            styleMap: {
                weight: 3,
                color: '#C31919',
                dashArray: '',
                Opacity: 1,
                fillOpacity: 0
            },
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

                    switch (type1) {
                        case "vejnavn,bynavn":
                            dsl1 = {
                                "from": 0,
                                "size": 20,
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
                                                "should": shouldA
                                            }
                                        }
                                    }
                                },
                                "aggregations": {
                                    "properties.postnrnavn": {
                                        "terms": {
                                            "field": "properties.postnrnavn",
                                            "size": 20,
                                            "order": {
                                                "_term": "asc"
                                            }
                                        },
                                        "aggregations": {
                                            "properties.postnr": {
                                                "terms": {
                                                    "field": "properties.postnr",
                                                    "size": 20
                                                },
                                                "aggregations": {
                                                    "properties.kommunekode": {
                                                        "terms": {
                                                            "field": "properties.kommunekode",
                                                            "size": 20
                                                        },
                                                        "aggregations": {
                                                            "properties.regionskode": {
                                                                "terms": {
                                                                    "field": "properties.regionskode",
                                                                    "size": 20
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
                                "size": 20,
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
                                                "should": shouldA
                                            }
                                        }
                                    }
                                },
                                "aggregations": {
                                    "properties.vejnavn": {
                                        "terms": {
                                            "field": "properties.vejnavn",
                                            "size": 20,
                                            "order": {
                                                "_term": "asc"
                                            }
                                        },
                                        "aggregations": {
                                            "properties.kommunekode": {
                                                "terms": {
                                                    "field": "properties.kommunekode",
                                                    "size": 20
                                                },
                                                "aggregations": {
                                                    "properties.regionskode": {
                                                        "terms": {
                                                            "field": "properties.regionskode",
                                                            "size": 20
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
                                "size": 20,
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
                                                "should": shouldA
                                            }
                                        }
                                    }
                                },
                                "aggregations": {
                                    "properties.vejnavn": {
                                        "terms": {
                                            "field": "properties.vejnavn",
                                            "size": 20,
                                            "order": {
                                                "_term": "asc"
                                            }
                                        },
                                        "aggregations": {
                                            "properties.postnrnavn": {
                                                "terms": {
                                                    "field": "properties.postnrnavn",
                                                    "size": 20
                                                },
                                                "aggregations": {
                                                    "properties.kommunekode": {
                                                        "terms": {
                                                            "field": "properties.kommunekode",
                                                            "size": 20
                                                        },
                                                        "aggregations": {
                                                            "properties.regionskode": {
                                                                "terms": {
                                                                    "field": "properties.regionskode",
                                                                    "size": 10
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
                                "size": 20,
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
                                                "should": shouldA
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
                        url: '//gc2.mapcentia.com/api/v1/elasticsearch/search/dk/dawa/adgangsadresser_view',
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
                                    url: '//gc2.mapcentia.com/api/v1/elasticsearch/search/dk/dawa/adgangsadresser_view',
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
                type2 = (query.match(/\d+/g) != null) ? "jordstykke" : "ejerlav";
                if (!onlyAddress) {
                    (function ca() {

                        dslM = {
                            "sort": [{"properties.sort_string": "asc"}],
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
            }
        });
        $('#' + el).bind('typeahead:selected', function (obj, datum, name) {
            if ((type1 === "adresse" && name === "adresse") || (type2 === "jordstykke" && name === "matrikel")) {
                placeStore.reset();

                if (name === "matrikel") {
                    placeStore.host = "//eu1.mapcentia.com";
                    placeStore.sql = "SELECT gid,the_geom,ST_asgeojson(ST_transform(the_geom,4326)) as geojson FROM matrikel.jordstykke WHERE gid=" + gids[datum.value];
                }
                if (name === "adresse") {
                    placeStore.host = "//gc2.mapcentia.com";
                    placeStore.sql = "SELECT id,the_geom,ST_asgeojson(ST_transform(the_geom,4326)) as geojson FROM dawa.adgangsadresser WHERE id='" + gids[datum.value] + "'";
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

