/*
 * @author     Martin Høgh <mh@mapcentia.com>
 * @copyright  2013-2019 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

'use strict';

const layerTreeUtils = require('./layerTree/utils');
import {SYSTEM_FIELD_PREFIX} from './layerTree/constants';

/**
 * @type {*|exports|module.exports}
 */
var cloud, backboneEvents, meta, layerTree, advancedInfo, switchLayer;

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

var download = require('./download');

/**
 * @type {string}
 */
var db = urlparser.db;

var JSONSchemaForm = require("react-jsonschema-form");
const Form = JSONSchemaForm.default;

var extensions;

let _self = false;

let editingIsEnabled = false;

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
        layerTree = o.layerTree;
        advancedInfo = o.advancedInfo;
        switchLayer = o.switchLayer;
        backboneEvents = o.backboneEvents;
        _layers = o.layers;
        extensions = o.extensions;

        _self = this;
        return this;
    },

    /**
     * Performs spatial SQL query and display results on map and in gc2table
     *
     * @param qstore
     * @param wkt
     * @param proj
     * @param callBack
     * @param num
     * @param infoClickPoint
     * @param whereClause
     * @param includes
     * @param {Function} onPopupCloseButtonClick Fires when feature popup is closed by clicking the Close button
     */
    init: function (qstore, wkt, proj, callBack, num, infoClickPoint, whereClause, includes, zoomToResult, onPopupCloseButtonClick) {
        let layers, count = {index: 0}, hit = false, distance, editor = false,
            metaDataKeys = meta.getMetaDataKeys();

        if (`editor` in extensions) {
            editor = extensions.editor.index;
            editingIsEnabled = true;
        }

        this.reset(qstore);
        layers = _layers.getLayers() ? _layers.getLayers().split(",") : [];

        // Set layers to passed array of layers if set
        layers = includes || layers;

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
                <div class="form-group gc2-edit-tools" style="display: none; width: 90%;">
                    <div class="btn-group btn-group-justified">
                        <div class="btn-group">
                            <button class="btn btn-primary btn-xs popup-edit-btn">
                                <i class="fa fa-pencil-alt" aria-hidden="true"></i>
                            </button>
                        </div>
                        <div class="btn-group">
                            <button class="btn btn-danger btn-xs popup-delete-btn">
                                <i class="fa fa-trash" aria-hidden="true"></i>
                            </button>
                        </div>
                    </div>
                </div>
                <h3 class="popup-title">{{_vidi_content.title}}</h3>
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

        var defaultTemplateRaster =
            `<div class="cartodb-popup-content">
                <h4>Class</h4>
                <p>{{{ class }}}</p>
                <h4>Value</h4>
                <p>{{{ value_0 }}}</p>
             
             </div>`;

        $.each(layers, function (index, value) {
            // No need to search in the already displayed vector layers
            if (value.indexOf('v:') === 0) {
                return true;
            }

            value = layerTreeUtils.stripPrefix(value);

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
            var pkey = metaDataKeys[value].pkey;
            var geoType = metaDataKeys[value].type;
            var layerTitel = (metaDataKeys[value].f_table_title !== null && metaDataKeys[value].f_table_title !== "") ? metaDataKeys[value].f_table_title : metaDataKeys[value].f_table_name;
            var not_querable = metaDataKeys[value].not_querable;
            var versioning = metaDataKeys[value].versioning;
            var fields = typeof metaDataKeys[value].fields !== "undefined" ? metaDataKeys[value].fields : null;
            var onLoad;
            let fieldConf = (typeof metaDataKeys[value].fieldconf !== "undefined"
                && metaDataKeys[value].fieldconf !== "")
                ? $.parseJSON(metaDataKeys[value].fieldconf) : null;

            _layers.incrementCountLoading(key);
            backboneEvents.get().trigger("startLoading:layers", key);

            if (geoType !== "POLYGON" && geoType !== "MULTIPOLYGON") {
                var res = [156543.0339280410, 78271.51696402048, 39135.75848201023, 19567.87924100512, 9783.939620502561,
                    4891.969810251280, 2445.984905125640, 1222.992452562820, 611.4962262814100, 305.7481131407048,
                    152.8740565703525, 76.43702828517624, 38.21851414258813, 19.10925707129406, 9.554628535647032,
                    4.777314267823516, 2.388657133911758, 1.194328566955879, 0.5971642834779395, 0.298582141739,
                    0.149291070869, 0.074645535435, 0.0373227677175, 0.018661384, 0.009330692, 0.004665346, 0.002332673, 0.001166337];
                distance = 10 * res[cloud.get().getZoom()];
            }

            if (!callBack) {
                onLoad = function () {
                    var layerObj = this, cm = [], storeId = this.id, sql = this.sql,
                        template;

                    _layers.decrementCountLoading("_vidi_sql_" + storeId);
                    backboneEvents.get().trigger("doneLoading:layers", "_vidi_sql_" + storeId);

                    isEmpty = layerObj.isEmpty();

                    template = (typeof metaDataKeys[value].infowindow !== "undefined" && metaDataKeys[value].infowindow.template !== "") ? metaDataKeys[value].infowindow.template : metaDataKeys[value].type === "RASTER" ? defaultTemplateRaster : defaultTemplate;

                    if (!isEmpty && !not_querable) {
                        $('#modal-info-body').show();
                        $("#info-tab").append(`<li><a onclick="setTimeout(()=>{$('#modal-info-body table').bootstrapTable('resetView'),100})" id="tab_${storeId}" data-toggle="tab" href="#_${storeId}">${layerTitel}</a></li>`);
                        $("#info-pane").append(`<div class="tab-pane" id="_${storeId}">
                            <div>
                                <a class="btn btn-sm btn-raised" id="_download_geojson_${storeId}" target="_blank" href="javascript:void(0)">
                                    <i class="fa fa-download" aria-hidden="true"></i> GeoJson
                                </a> 
                                <a class="btn btn-sm btn-raised" id="_download_excel_${storeId}" target="_blank" href="javascript:void(0)">
                                    <i class="fa fa-download" aria-hidden="true"></i> Excel
                                </a>
                                <button class="btn btn-sm btn-raised" id="_create_layer_${storeId}" target="_blank" href="javascript:void(0)">
                                    <i class="fa fa-plus" aria-hidden="true"></i> ${__(`Create virtual layer`)}
                                </button>
                            </div>
                            <table class="table" data-detail-view="true" data-detail-formatter="detailFormatter" data-show-toggle="true" data-show-export="false" data-show-columns="true"></table>
                        </div>`);

                        cm = _self.prepareDataForTableView(value, layerObj.geoJSON.features);
                        $('#tab_' + storeId).tab('show');
                        var _table = gc2table.init({
                            el: "#_" + storeId + " table",
                            ns: "#_" + storeId,
                            geocloud2: cloud.get(),
                            store: layerObj,
                            cm: cm,
                            autoUpdate: false,
                            autoPan: false,
                            openPopUp: true,
                            setViewOnSelect: true,
                            responsive: false,
                            callCustomOnload: false,
                            checkBox: true,
                            height: 300,
                            locale: window._vidiLocale.replace("_", "-"),
                            template: template,
                            pkey: pkey,
                            usingCartodb: false
                        });

                        _table.object.on("openpopup" + "_" + _table.uid, function (e) {
                            let popup = e.getPopup();
                            if (popup._closeButton) {
                                popup._closeButton.onclick = function (clickEvent) {
                                    if (onPopupCloseButtonClick) onPopupCloseButtonClick(e._leaflet_id);
                                }
                            }

                            let layerIsEditable = false;
                            if (metaDataKeys[value].meta) {
                                let parsedMeta = JSON.parse(metaDataKeys[value].meta);
                                if (parsedMeta && typeof parsedMeta === `object`) {
                                    if (`vidi_layer_editable` in parsedMeta && parsedMeta.vidi_layer_editable) {
                                        layerIsEditable = true;
                                    }
                                }
                            }

                            setTimeout(() => {
                                if (editingIsEnabled && layerIsEditable) {
                                    $(".gc2-edit-tools").css(`display`, `inline`);
                                    $(".popup-edit-btn").show();
                                    $(".popup-delete-btn").show();
                                } else {
                                    $(".gc2-edit-tools").css(`display`, `none`);
                                    $(".popup-edit-btn").hide();
                                    $(".popup-delete-btn").hide();
                                }
                            }, 100);

                            $(".popup-edit-btn").unbind("click.popup-edit-btn").bind("click.popup-edit-btn", function () {
                                editor.edit(e, _key_, qstore);
                            });

                            $(".popup-delete-btn").unbind("click.popup-delete-btn").bind("click.popup-delete-btn", function () {
                                if (window.confirm(__(`Are you sure you want to delete the feature?`))) {
                                    editor.delete(e, _key_, qstore);
                                }
                            });
                        });

                        // Here inside onLoad we call loadDataInTable(), so the table is populated
                        _table.loadDataInTable(false, true);

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
                        });

                        $("#_download_excel_" + storeId).click(function () {
                            download.download(sql, "excel");
                        });
                        $("#_download_geojson_" + storeId).click(function () {
                            download.download(sql, "geojson");
                        });
                        $("#_create_layer_" + storeId).click(function () {
                            let _self = this;
                            $(_self).prop(`disabled`, true);
                            let uncheckedIds = _table.getUncheckedIds();
                            // Remove query results and open them as created virtual layer in layerTree
                            layerTree.createVirtualLayer(layerObj, {pkey, ids: uncheckedIds}).then(newLayerKey => {
                                switchLayer.init(`v:` + newLayerKey, true).then(() => {
                                    $(_self).prop(`disabled`, false);
                                });
                            }).catch(error => {
                                $(_self).prop(`disabled`, false)
                                console.error(`Error occured while creating the virtual layer`, error);
                            });
                        });
                    } else {
                        layerObj.reset();
                    }

                    count.index++;
                    if (count.index === layers.length) {
                        if (!hit) {
                            $('#modal-info-body').hide();
                            $.snackbar({
                                content: "<span id='conflict-progress'>" + __("Didn't find anything") + "</span>",
                                htmlAllowed: true,
                                timeout: 2000
                            });
                        } else {
                            $('#main-tabs a[href="#info-content"]').tab('show');
                            if (zoomToResult) {
                                cloud.get().zoomToExtentOfgeoJsonStore(qstore[storeId], 16);
                            }
                            setTimeout(() => {
                                $('#modal-info-body table').bootstrapTable('resetView');
                            }, 300);
                        }
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
                base64: true,
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
            } else {
                fieldStr = "*";
            }
            if (!whereClause) {
                if (geoType === "RASTER" && (!advancedInfo.getSearchOn())) {
                    sql = "SELECT 1 as rid,foo.the_geom,ST_Value(rast, foo.the_geom) As band1, ST_Value(rast, 2, foo.the_geom) As band2, ST_Value(rast, 3, foo.the_geom) As band3 " +
                        "FROM " + value + " CROSS JOIN (SELECT ST_transform(ST_GeomFromText('" + wkt + "'," + proj + ")," + srid + ") As the_geom) As foo " +
                        "WHERE ST_Intersects(rast,the_geom) ";

                    qstore[index].custom_data = [
                        value,
                        cloud.get().map.getSize().x,
                        cloud.get().map.getSize().y,
                        cloud.get().map.latLngToContainerPoint(infoClickPoint).x,
                        cloud.get().map.latLngToContainerPoint(infoClickPoint).y,
                        cloud.get().getExtent().left,
                        cloud.get().getExtent().bottom,
                        cloud.get().getExtent().right,
                        cloud.get().getExtent().top
                    ];
                } else {
                    if (geoType !== "POLYGON" && geoType !== "MULTIPOLYGON" && (!advancedInfo.getSearchOn())) {
                        sql = "SELECT " + fieldStr + " FROM " + value + " WHERE round(ST_Distance(ST_Transform(\"" + f_geometry_column + "\"," + proj + "), ST_GeomFromText('" + wkt + "'," + proj + "))) < " + distance;
                        if (versioning) {
                            sql = sql + " AND gc2_version_end_date IS NULL ";
                        }
                        sql = sql + " ORDER BY round(ST_Distance(ST_Transform(\"" + f_geometry_column + "\"," + proj + "), ST_GeomFromText('" + wkt + "'," + proj + ")))";
                    } else {
                        sql = "SELECT " + fieldStr + " FROM " + value + " WHERE ST_Intersects(ST_Transform(ST_geomfromtext('" + wkt + "'," + proj + ")," + srid + ")," + f_geometry_column + ")";
                        if (versioning) {
                            sql = sql + " AND gc2_version_end_date IS NULL ";
                        }
                        qstore[index].custom_data = "";
                    }
                }
            } else {
                sql = "SELECT " + fieldStr + " FROM " + value + " WHERE " + whereClause;
                if (versioning) {
                    sql = sql + " AND gc2_version_end_date IS NULL ";
                }
                qstore[index].custom_data = "";
            }

            sql = sql + " LIMIT " + (num || 500);

            qstore[index].onLoad = onLoad || callBack.bind(this, qstore[index], isEmpty, not_querable, layerTitel, fieldConf, layers, count);
            qstore[index].sql = sql;
            qstore[index].load();
        });
    },

    /**
     * Prepares stored data for being displayed in table
     *
     * @param {String} layerKey Layer key
     * @param {Array}  features Layer features
     */
    prepareDataForTableView: (layerKey, features) => {
        let first = true;
        let fieldLabel = false;
        let metaDataKeys = meta.getMetaDataKeys();
        let fieldConf;
        let keyWithOutPrefix = layerKey.replace(`v:`, ``);
        let layerTitle = (metaDataKeys[keyWithOutPrefix].f_table_title !== null && metaDataKeys[keyWithOutPrefix].f_table_title !== "") ? metaDataKeys[keyWithOutPrefix].f_table_title : metaDataKeys[keyWithOutPrefix].f_table_name;

        // Hardcoded field config for raster layers
        if (metaDataKeys[keyWithOutPrefix].type === "RASTER") {
            fieldConf = {
                class: {
                    "alias": "Class",
                    "column": "class",
                    "id": "class",
                    "querable": true
                },
                value_0: {
                    "alias": "Value",
                    "column": "value_0",
                    "id": "value_0",
                    "querable": true
                }
            };

        } else {
            fieldConf = (typeof metaDataKeys[keyWithOutPrefix].fieldconf !== "undefined"
                && metaDataKeys[keyWithOutPrefix].fieldconf !== "")
                ? $.parseJSON(metaDataKeys[keyWithOutPrefix].fieldconf) : null;
        }

        let cm = [];
        let out = [];
        $.each(features, function (i, feature) {
            var fields = [];
            if (fieldConf === null) {
                $.each(feature.properties, function (name, property) {
                    if (name.indexOf(SYSTEM_FIELD_PREFIX) !== 0 && name !== `_id` && name !== `_vidi_content`) {
                        fields.push({
                            title: name,
                            value: feature.properties[name]
                        });

                        out.push([name, 0, name, false]);
                    }
                });
            } else {
                $.each(sortObject(fieldConf), (name, property) => {
                    if (property.value.querable) {
                        let value = feature.properties[property.key];
                        if (property.value.link) {
                            value = "<a target='_blank' rel='noopener' href='" + (property.value.linkprefix ? property.value.linkprefix : "") + feature.properties[property.key] + "'>Link</a>";
                        } else if (property.value.content && property.value.content === "image") {
                            if (!feature.properties[property.key]) {
                                value = `<i class="fa fa-ban"></i>`;
                            } else {
                                let subValue = feature.properties[property.key];
                                /*
                                if (property.value.type === `bytea`) {
                                    subValue = atob(feature.properties[property.key]);
                                }*/

                                width = '100%'

                                if(window.vidiConfig.hasOwnProperty('popupImageWidth')) {
                                    width = window.vidiConfig.popupImageWidth
                                }

                                value =
                                    `<div style="cursor: pointer" onclick="window.open().document.body.innerHTML = '<img src=\\'${subValue}\\' />';">
                                        <img style='`+ width +`' src='${subValue}'/>
                                     </div>`;
                            }
                        } else if (property.value.content && property.value.content === "video") {
                            if (!feature.properties[property.key]) {
                                value = `<i class="fa fa-ban"></i>`;
                            } else {
                                let subValue = feature.properties[property.key];
                                let width = '250px'

                                if(window.vidiConfig.hasOwnProperty('popupVideoWidth')) {
                                    width = window.vidiConfig.popupVideoWidth
                                }

                                value =
                                    `<video width="`+ width +`" controls>
                                        <source src="${subValue}" type="video/mp4">
                                        <source src="${subValue}" type="video/ogg">
                                        <source src="${subValue}" type="video/webm">
                                    </video>`;
                            }
                        }
                        fields.push({title: property.value.alias || property.key, value});
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
            feature.properties._vidi_content.title = layerTitle;
            feature.properties._vidi_content.fields = fields; // Used in a "loop" template
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

            out = [];
        });

        return cm;
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
    },

    setDownloadFunction: function (fn) {
        download.download = fn
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
