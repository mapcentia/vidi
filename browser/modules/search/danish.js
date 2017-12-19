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
 * @type {*|exports|module.exports}
 */
var backboneEvents;

/**
 *
 * @type {string}
 */
var AHOST = "//gc2.io";

/**
 *
 * @type {string}
 */
var ADB = "dk";

/**
 *
 * @type {string}
 */
var MHOST = "//gc2.io";

/**
 *
 * @type {string}
 */
var MDB = "dk";

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
        var type1, type2, gids = [], searchString, dslA, dslM, shouldA = [], shouldM = [], dsl1, dsl2,
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
                    "properties.kommunekode": "" + v
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
                                                "default_field": "properties.string5",
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
                        url: AHOST + '/api/v1/elasticsearch/search/' + ADB + '/dar/adgangsadresser_view',
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
                                    url: AHOST + '/api/v1/elasticsearch/search/' + ADB + '/dar/adgangsadresser_view',
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

                        switch (type2) {
                            case "jordstykke":
                                dslM = {
                                    "from": 0,
                                    "size": 20,
                                    "query": {
                                        "bool": {
                                            "must": {
                                                "query_string": {
                                                    "default_field": "properties.string1",
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
                                break;
                            case "ejerlav":
                                dslM = {
                                    "from": 0,
                                    "size": 20,
                                    "query": {
                                        "bool": {
                                            "must": {
                                                "query_string": {
                                                    "default_field": "properties.string1",
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
                                    },
                                    "aggregations": {
                                        "properties.ejerlavsnavn": {
                                            "terms": {
                                                "field": "properties.ejerlavsnavn",
                                                "order": {
                                                    "_term": "asc"
                                                },
                                                "size": 20
                                            },
                                            "aggregations": {
                                                "properties.kommunekode": {
                                                    "terms": {
                                                        "field": "properties.kommunekode",
                                                        "size": 20
                                                    }
                                                }
                                            }
                                        }
                                    }
                                };
                                break;
                        }

                        $.ajax({
                            url: MHOST + '/api/v1/elasticsearch/search/' + MDB + '/matrikel',
                            data: '&q=' + JSON.stringify(dslM),
                            contentType: "application/json; charset=utf-8",
                            scriptCharset: "utf-8",
                            dataType: 'jsonp',
                            jsonp: 'jsonp_callback',
                            success: function (response) {
                                if (type2 === "ejerlav") {
                                    $.each(response.aggregations["properties.ejerlavsnavn"].buckets, function (i, hit) {
                                        var str = hit.key;
                                        names.push({value: str});
                                    });
                                } else {
                                    $.each(response.hits.hits, function (i, hit) {
                                        var str = hit._source.properties.string1;
                                        gids[str] = hit._source.properties.gid;
                                        names.push({value: str});
                                    });
                                }
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
                    placeStore.db = MDB;
                    placeStore.host = MHOST;
                    placeStore.sql = "SELECT gid,the_geom,ST_asgeojson(ST_transform(the_geom,4326)) as geojson FROM matrikel.jordstykke WHERE gid='" + gids[datum.value] + "'";
                }
                if (name === "adresse") {
                    placeStore.db = ADB;
                    placeStore.host = AHOST;
                    placeStore.sql = "SELECT id,kommunekode,the_geom,ST_asgeojson(ST_transform(the_geom,4326)) as geojson FROM dar.adgangsadresser WHERE id='" + gids[datum.value] + "'";
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

