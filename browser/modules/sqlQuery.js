/**
 * @fileoverview Description of file, its uses and information
 * about its dependencies.
 */

'use strict';

/**
 * @type {*|exports|module.exports}
 */
var cloud;

/**
 * @type {*|exports|module.exports}
 */
var meta;

/**
 * @type {*|exports|module.exports}
 */
var draw;

/**
 * @type {*|exports|module.exports}
 */
var advancedInfo;

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
 *
 * @type {string}
 */
var BACKEND = require('../../config/config.js').backend;

/**
 *
 * @type {{set: module.exports.set, init: module.exports.init, reset: module.exports.reset}}
 */
module.exports = {
    /**
     *
     * @param o
     * @returns {exports}
     */
    set: function (o) {
        cloud = o.cloud;
        meta = o.meta;
        draw = o.draw;
        advancedInfo = o.advancedInfo;
        return this;
    },

    /**
     *
     * @param qstore {array}
     * @param wkt {string}
     * @param proj {string}
     */
    init: function (qstore, wkt, proj) {
        var layers, count = 0, hit = false, distance;
        var metaDataKeys = meta.getMetaDataKeys();
        this.reset(qstore);
        layers = cloud.getVisibleLayers().split(";");

        //$("#info-content .alert").hide();
        $.each(layers, function (index, value) {
            if (layers[0] === "") {
                return false;
            }
            var isEmpty = true;
            var srid = metaDataKeys[value].srid;
            var geoType = metaDataKeys[value].type;
            var layerTitel = (metaDataKeys[value].f_table_title !== null && metaDataKeys[value].f_table_title !== "") ? metaDataKeys[value].f_table_title : metaDataKeys[value].f_table_name;
            var not_querable = metaDataKeys[value].not_querable;
            var versioning = metaDataKeys[value].versioning;
            var cartoSql = metaDataKeys[value].sql;
            var fieldConf = $.parseJSON(metaDataKeys[value].fieldconf);

            if (geoType !== "POLYGON" && geoType !== "MULTIPOLYGON") {
                var res = [156543.033928, 78271.516964, 39135.758482, 19567.879241, 9783.9396205,
                    4891.96981025, 2445.98490513, 1222.99245256, 611.496226281, 305.748113141, 152.87405657,
                    76.4370282852, 38.2185141426, 19.1092570713, 9.55462853565, 4.77731426782, 2.38865713391,
                    1.19432856696, 0.597164283478, 0.298582141739, 0.149291];
                distance = 5 * res[cloud.getZoom()];
            }
            var onLoad = function () {
                var layerObj = this, out = [], fieldLabel, cm = [], first = true, storeId = this.id;
                isEmpty = layerObj.isEmpty();
                if (!isEmpty && !not_querable) {
                    $('#modal-info-body').show();
                    $("#info-tab").append('<li><a id="tab_' + storeId + '" data-toggle="tab" href="#_' + storeId + '">' + layerTitel + '</a></li>');
                    $("#info-pane").append('<div class="tab-pane" id="_' + storeId + '"><div class="panel panel-default"><div class="panel-body"><table class="table" data-detail-view="true" data-detail-formatter="detailFormatter" data-show-toggle="true" data-show-export="true" data-show-columns="true"></table></div></div></div>');
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
                                        out.push([name, property.sort_id, fieldLabel, property.link]);
                                    }
                                }
                            });
                        }
                        out.sort(function (a, b) {
                            return a[1] - b[1];
                        });
                        if (first) {
                            $.each(out, function (name, property) {
                                cm.push({
                                    header: property[2],
                                    dataIndex: property[0],
                                    sortable: true,
                                    link: property[3]
                                })
                            });
                            first = false;
                        }
                        $('#tab_' + storeId).tab('show');
                        out = [];
                    });
                    var height;
                    try {
                        height = require('./height')().max - 400;
                    } catch (e) {
                        console.info(e.message);
                        height = 0;
                    }
                    var _table = gc2table.init({
                        el: "#_" + storeId + " table",
                        geocloud2: cloud,
                        store: layerObj,
                        cm: cm,
                        autoUpdate: false,
                        autoPan: true,
                        openPopUp: true,
                        setViewOnSelect: true,
                        responsive: false,
                        callCustomOnload: false,
                        height: (height > 500) ? 500 : (height < 300) ? 300 : height,
                        locale: window._vidiLocale.replace("_","-"),
                    });

                    // Here Inside onLoad we call loadDataInTable(), so the table is populated
                    _table.loadDataInTable();

                    // If only one feature is selected, when activate it.
                    if (Object.keys(layerObj.layer._layers).length === 1) {
                        _table.object.trigger("selected" + "_" + _table.uid, layerObj.layer._layers[Object.keys(layerObj.layer._layers)[0]]._leaflet_id);
                    }
                    hit = true;
                    // Add fancy material raised style to buttons
                    $(".bootstrap-table .btn-default").addClass("btn-raised");
                    // Stop the click on detail icon from bubbling up the DOM tree
                    $(".detail-icon").click(function (event) {
                        event.stopPropagation();
                    })
                } else {
                    layerObj.reset();
                }
                count++;
                if (count === layers.length) {
                    //$('#info-tab a:first').tab('show');

                    if (!hit) {
                        $('#modal-info-body').hide();
                    }
                    $("#info-content button").click(function (e) {
                        //clearDrawItems();
                        //makeConflict(qstore[$(this).data('gc2-store')].geoJSON.features [0], 0, false, __("From object in layer") + ": " + $(this).data('gc2-title'));
                    });
                    $('#main-tabs a[href="#info-content"]').tab('show');
                }
            };

            qstore[index] = new geocloud.sqlStore({
                jsonp: false,
                method: "POST",
                host: "",
                db: db,
                uri: "/api/sql",
                clickable: true,
                id: index,
                onLoad: onLoad,
                styleMap: {
                    weight: 5,
                    color: '#660000',
                    dashArray: '',
                    fillOpacity: 0.2
                },
                onEachFeature: function (f, l) {
                    if (typeof l._layers !== "undefined") {
                        $.each(l._layers, function (i, v) {
                            v._vidi_type = "query_result";
                        })
                    } else {
                        l._vidi_type = "query_result";
                    }
                }
            });

            cloud.addGeoJsonStore(qstore[index]);
            var sql, f_geometry_column = metaDataKeys[value].f_geometry_column;
            if (geoType === "RASTER") {
                sql = "SELECT foo.the_geom,ST_Value(rast, foo.the_geom) As band1, ST_Value(rast, 2, foo.the_geom) As band2, ST_Value(rast, 3, foo.the_geom) As band3 " +
                    "FROM " + value + " CROSS JOIN (SELECT ST_transform(ST_GeomFromText('" + wkt + "'," + proj + ")," + srid + ") As the_geom) As foo " +
                    "WHERE ST_Intersects(rast,the_geom) ";
            } else {
                if (geoType !== "POLYGON" && geoType !== "MULTIPOLYGON" && (!advancedInfo.getSearchOn())) {
                    sql = "SELECT * FROM " + (BACKEND === "cartodb" ? "(" + cartoSql + ") as foo" : value) + " WHERE round(ST_Distance(ST_Transform(\"" + f_geometry_column + "\"," + proj + "), ST_GeomFromText('" + wkt + "'," + proj + "))) < " + distance;
                    if (versioning) {
                        sql = sql + " AND gc2_version_end_date IS NULL ";
                    }
                    sql = sql + " ORDER BY round(ST_Distance(ST_Transform(\"" + f_geometry_column + "\"," + proj + "), ST_GeomFromText('" + wkt + "'," + proj + ")))";
                } else {
                    sql = "SELECT * FROM " + (BACKEND === "cartodb" ? "(" + cartoSql + ") as foo" : value) + " WHERE ST_Intersects(ST_Transform(ST_geomfromtext('" + wkt + "'," + proj + ")," + srid + ")," + f_geometry_column + ")";
                    if (versioning) {
                        sql = sql + " AND gc2_version_end_date IS NULL ";
                    }
                }
            }
            sql = sql + "LIMIT 500";
            qstore[index].sql = sql;
            qstore[index].load();
        });
    },

    /**
     * Resets all stores in qstore
     * @param qstore {array}
     */
    reset: function (qstore) {
        $.each(qstore, function (index, store) {
            store.abort();
            store.reset();
            cloud.removeGeoJsonStore(store);
        });
        $("#info-tab").empty();
        $("#info-pane").empty();
    }
};

