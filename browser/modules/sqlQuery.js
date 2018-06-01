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
var backboneEvents;

/**
 * @type {*|exports|module.exports}
 */
var meta;

/**
 * @type {*|exports|module.exports}
 */
var advancedInfo;

/**
 * @type {*|exports|module.exports}
 */
var _layers;

/**
 * @type {*|exports|module.exports}
 */
var editor;

/**
 *
 * @type {*|exports|module.exports}
 */
var urlparser = require('./urlparser');

/**
 * @type {string}
 */
var db = urlparser.db;

var JSONSchemaForm = require("react-jsonschema-form");
const Form = JSONSchemaForm.default;

/**
 *
 * @type {string}
 */
var BACKEND = require('../../config/config.js').backend;

var extensions;


/**
 *
 * @type {{set: module.exports.set, init: module.exports.init, reset: module.exports.reset}}
 */
module.exports = {

    /**
     * @param o
     * @returns {exports}
     */
    set: function (o) {
        cloud = o.cloud;
        meta = o.meta;
        advancedInfo = o.advancedInfo;
        backboneEvents = o.backboneEvents;
        _layers = o.layers;
        extensions = o.extensions;
        return this;
    },

    /**
     *
     * @param qstore {array}
     * @param wkt {string}
     * @param proj {string}
     * @param callBack {string}
     * @param num {int}
     */
    init: function (qstore, wkt, proj, callBack, num) {
        var layers, count = {index: 0}, hit = false, distance,
            metaDataKeys = meta.getMetaDataKeys();

        try {
            editor = extensions.editor.index;
        } catch (e) {
        }

        this.reset(qstore);
        layers = _layers.getLayers() ? _layers.getLayers().split(",") : [];

        // Remove not queryable layers from array
        for (var i = layers.length - 1; i >= 0; i--) {
            if (typeof metaDataKeys[layers[i]] !== "undefined" && metaDataKeys[layers[i]].not_querable) {
                layers.splice(i, 1);
            }
        }

        backboneEvents.get().trigger("start:sqlQuery");

        /**
         * A default template for GC2, with a loop
         * @type {string}
         */
        var defaultTemplate =
            `<div class="cartodb-popup-content">
                <div class="form-group gc2-edit-tools" style="visibility: hidden"><button class="btn btn-primary btn-xs popup-edit-btn"><i class="fa fa-pencil" aria-hidden="true"></i></button><button class="btn btn-primary btn-xs popup-delete-btn"><i class="fa fa-trash" aria-hidden="true"></i></button></div>
                  {{#_vidi_content.fields}}
                     {{#title}}<h4>{{title}}</h4>{{/title}}
                     {{#value}}
                       <p {{#type}}class="{{ type }}"{{/type}}>{{{ value }}}</p>
                     {{/value}}
                     {{^value}}
                       <p class="empty">null</p>
                     {{/value}}
                  {{/_vidi_content.fields}}
                </div>`;

        $.each(layers, function (index, value) {
            // No need to search in the already displayed vector layer
            if (value.indexOf('v:') === 0) {
                return true;
            }

            if (layers[0] === "") {
                return false;
            }

            if (!metaDataKeys[value]) {
                throw new Error(`metaDataKeys[${value}] is undefined`);
            }

            var isEmpty = true;
            var srid = metaDataKeys[value].srid;
            var key = "_vidi_sql_" + index;
            var _key_ = metaDataKeys[value]._key_;
            var geoType = metaDataKeys[value].type;
            var layerTitel = (metaDataKeys[value].f_table_title !== null && metaDataKeys[value].f_table_title !== "") ? metaDataKeys[value].f_table_title : metaDataKeys[value].f_table_name;
            var not_querable = metaDataKeys[value].not_querable;
            var versioning = metaDataKeys[value].versioning;
            var cartoSql = metaDataKeys[value].sql;
            var fields = typeof metaDataKeys[value].fields !== "undefined" ? metaDataKeys[value].fields : null;
            var fieldConf = (typeof metaDataKeys[value].fieldconf !== "undefined" && metaDataKeys[value].fieldconf !== "") ? $.parseJSON(metaDataKeys[value].fieldconf) : null;
            var onLoad;

            _layers.incrementCountLoading(key);
            backboneEvents.get().trigger("startLoading:layers", key);

            if (geoType !== "POLYGON" && geoType !== "MULTIPOLYGON") {
                var res = [156543.033928, 78271.516964, 39135.758482, 19567.879241, 9783.9396205,
                    4891.96981025, 2445.98490513, 1222.99245256, 611.496226281, 305.748113141, 152.87405657,
                    76.4370282852, 38.2185141426, 19.1092570713, 9.55462853565, 4.77731426782, 2.38865713391,
                    1.19432856696, 0.597164283478, 0.298582141739, 0.149291, 0.074645535];
                distance = 10 * res[cloud.get().getZoom()];
            }

            if (!callBack) {
                onLoad = function () {
                    var layerObj = this, out = [], fieldLabel, cm = [], first = true, storeId = this.id, template;

                    _layers.decrementCountLoading("_vidi_sql_" + storeId);
                    backboneEvents.get().trigger("doneLoading:layers", "_vidi_sql_" + storeId);

                    isEmpty = layerObj.isEmpty();

                    template = (typeof metaDataKeys[value].infowindow !== "undefined" && metaDataKeys[value].infowindow.template !== "") ? metaDataKeys[value].infowindow.template : defaultTemplate;

                    if (!isEmpty && !not_querable) {
                        $('#modal-info-body').show();
                        $("#info-tab").append('<li><a id="tab_' + storeId + '" data-toggle="tab" href="#_' + storeId + '">' + layerTitel + '</a></li>');
                        $("#info-pane").append('<div class="tab-pane" id="_' + storeId + '"><div class="panel panel-default"><div class="panel-body"><table class="table" data-detail-view="true" data-detail-formatter="detailFormatter" data-show-toggle="true" data-show-export="true" data-show-columns="true"></table></div></div></div>');
                        $.each(layerObj.geoJSON.features, function (i, feature) {
                            var fi = [];
                            if (fieldConf === null) {
                                $.each(feature.properties, function (name, property) {
                                    fi.push({
                                        title: name,
                                        value: feature.properties[name]
                                    });
                                    out.push([name, 0, name, false]);
                                });
                            }
                            else {
                                $.each(sortObject(fieldConf), function (name, property) {
                                    if (property.value.querable) {
                                        fi.push({
                                            title: property.value.alias || property.key,
                                            value: property.value.link ? "<a target='_blank' rel='noopener' href='" + (property.value.linkprefix ? property.value.linkprefix : "") + feature.properties[property.key] + "'>Link</a>" :
                                                property.value.image ? "<a target='_blank' href='" + (property.value.type === "bytea" ? atob(feature.properties[property.key]) : feature.properties[property.key]) + "'><img style='width:178px' src='" + (property.value.type === "bytea" ? atob(feature.properties[property.key]) : feature.properties[property.key]) + "'/></a>" :
                                                    feature.properties[property.key]
                                        });

                                        fieldLabel = (property.value.alias !== null && property.value.alias !== "") ? property.value.alias : property.key;
                                        if (feature.properties[property.key] !== undefined) {
                                            out.push([property.key, property.value.sort_id, fieldLabel, property.value.link]);
                                        }
                                    }
                                });
                                out.sort(function (a, b) {
                                    return a[1] - b[1];
                                });
                            }

                            feature.properties._vidi_content = {};
                            feature.properties._vidi_content.fields = fi; // Used in a "loop" template

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
                        });
                        var _table = gc2table.init({
                            el: "#_" + storeId + " table",
                            geocloud2: cloud.get(),
                            store: layerObj,
                            cm: cm,
                            autoUpdate: false,
                            autoPan: false,
                            openPopUp: true,
                            setViewOnSelect: true,
                            responsive: false,
                            callCustomOnload: false,
                            height: 400,
                            locale: window._vidiLocale.replace("_", "-"),
                            template: template,
                            usingCartodb: BACKEND === "cartodb"
                        });

                        _table.object.on("openpopup" + "_" + _table.uid, function (e) {
                            $(".popup-edit-btn").unbind("click.popup-edit-btn").bind("click.popup-edit-btn", function () {
                                editor.edit(e, _key_, qstore);
                            });

                            $(".popup-delete-btn").unbind("click.popup-delete-btn").bind("click.popup-delete-btn", function () {
                                if (window.confirm("Er du sikker? Dine ændringer vil ikke blive gemt!")) {
                                    editor.delete(e, _key_, qstore);
                                }
                            });
                        });

                        // Here inside onLoad we call loadDataInTable(), so the table is populated
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
                    count.index++;
                    if (count.index === layers.length) {
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
            }
            qstore[index] = new geocloud.sqlStore({
                jsonp: false,
                method: "POST",
                host: "",
                db: db,
                uri: "/api/sql",
                clickable: true,
                id: index,
                styleMap: {
                    weight: 5,
                    color: '#660000',
                    dashArray: '',
                    fillOpacity: 0.2
                },

                // Set _vidi_type on all vector layers,
                // so they can be recreated as query layers
                // after serialization
                // ========================================
                onEachFeature: function (f, l) {
                    if (typeof l._layers !== "undefined") {
                        $.each(l._layers, function (i, v) {
                            v._vidi_type = "query_result";
                        })
                    } else {
                        l._vidi_type = "query_result";
                    }

                    l.on("click", function (e) {


                        setTimeout(function () {
                            $(".popup-edit-btn").unbind("click.popup-edit-btn").bind("click.popup-edit-btn", function () {
                                editor.edit(l, _key_, qstore);

                            });

                            $(".popup-delete-btn").unbind("click.popup-delete-btn").bind("click.popup-delete-btn", function () {
                                if (window.confirm("Er du sikker? Dine ændringer vil ikke blive gemt!")) {
                                    editor.delete(l, _key_, qstore);
                                }
                            });
                        }, 500)
                    });

                }
            });
            cloud.get().addGeoJsonStore(qstore[index]);

            var sql, f_geometry_column = metaDataKeys[value].f_geometry_column, fieldNames = [], fieldStr;

            if (fields) {
                $.each(fields, function (i, v) {
                    if (v.type === "bytea") {
                        fieldNames.push("encode(\"" + i + "\",'escape') as \"" + i + "\"");
                    } else {
                        fieldNames.push("\"" + i + "\"");
                    }
                });
                fieldStr = fieldNames.join(",");
                console.log(fieldStr)
            } else {
                fieldStr = "*";
            }
            if (geoType === "RASTER") {
                sql = "SELECT foo.the_geom,ST_Value(rast, foo.the_geom) As band1, ST_Value(rast, 2, foo.the_geom) As band2, ST_Value(rast, 3, foo.the_geom) As band3 " +
                    "FROM " + value + " CROSS JOIN (SELECT ST_transform(ST_GeomFromText('" + wkt + "'," + proj + ")," + srid + ") As the_geom) As foo " +
                    "WHERE ST_Intersects(rast,the_geom) ";
            } else {
                if (geoType !== "POLYGON" && geoType !== "MULTIPOLYGON" && (!advancedInfo.getSearchOn())) {
                    sql = "SELECT " + (BACKEND === "cartodb" ? "*" : fieldStr) + " FROM " + (BACKEND === "cartodb" ? "(" + cartoSql + ") as foo" : value) + " WHERE round(ST_Distance(ST_Transform(\"" + f_geometry_column + "\"," + proj + "), ST_GeomFromText('" + wkt + "'," + proj + "))) < " + distance;
                    if (versioning) {
                        sql = sql + " AND gc2_version_end_date IS NULL ";
                    }
                    sql = sql + " ORDER BY round(ST_Distance(ST_Transform(\"" + f_geometry_column + "\"," + proj + "), ST_GeomFromText('" + wkt + "'," + proj + ")))";
                } else {
                    sql = "SELECT " + (BACKEND === "cartodb" ? "*" : fieldStr) + " FROM " + (BACKEND === "cartodb" ? "(" + cartoSql + ") as foo" : value) + " WHERE ST_Intersects(ST_Transform(ST_geomfromtext('" + wkt + "'," + proj + ")," + srid + ")," + f_geometry_column + ")";
                    if (versioning) {
                        sql = sql + " AND gc2_version_end_date IS NULL ";
                    }
                }
            }
            sql = sql + " LIMIT " + (num || 500);
            qstore[index].onLoad = onLoad || callBack.bind(this, qstore[index], isEmpty, not_querable, layerTitel, fieldConf, layers, count);
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
            if (store) {
                store.abort();
                store.reset();
                cloud.get().removeGeoJsonStore(store);
            }
        });
        $("#info-tab").empty();
        $("#info-pane").empty();
    }
};

var sortObject = function (obj) {
    var arr = [];
    var prop;
    for (prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            arr.push({
                'key': prop,
                'value': obj[prop],
                'sort_id': obj[prop].sort_id
            });
        }
    }
    arr.sort(function (a, b) {
        return a.sort_id - b.sort_id;
    });
    return arr; // returns array
};

