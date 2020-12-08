/*
 * @author     Martin Høgh <mh@mapcentia.com>
 * @copyright  2013-2020 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

'use strict';

const layerTreeUtils = require('./layerTree/utils');
import {LAYER, SYSTEM_FIELD_PREFIX, MAP_RESOLUTIONS} from './layerTree/constants';

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

var extensions;

let _self = false;

let editingIsEnabled = false;

let template;

let elementPrefix;

let qStoreShadow;

let defaultSelectedStyle = {
    weight: 5,
    color: '#ff0000',
    fillOpacity: 0.2,
    opacity: 0.2
};

let backArrowIsAdded = false;


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
            <h4>{{title}}</h4>
            {{#if value}}
                <p {{#if type}}class="{{type}}"{{/if}}>{{{value}}}</p>
            {{else}}
                <p class="empty">null</p>
            {{/if}}
        {{/_vidi_content.fields}}
    </div>`;

var defaultTemplateForCrossMultiSelect =
    `<div class="cartodb-popup-content">
        {{#_vidi_content.fields}}
            <h4>{{title}}</h4>
            {{#if value}}
                <p {{#if type}}class="{{type}}"{{/if}}>{{{value}}}</p>
            {{else}}
                <p class="empty">null</p>
            {{/if}}
        {{/_vidi_content.fields}}
    </div>`;

/**
 * Default template for raster layers
 * @type {string}
 */
var defaultTemplateRaster =
    `<div class="cartodb-popup-content">
                <h4>Class</h4>
                <p>{{{class}}}</p>
                <h4>Value</h4>
                <p>{{{value_0}}}</p>
             </div>`;

const sortObject = function (obj) {
    let arr = [];
    let prop;
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
    init: function (qstore, wkt, proj, callBack, num, infoClickPoint, whereClause, includes, zoomToResult, onPopupCloseButtonClick, selectCallBack = () => {
    }, prefix = "", simple = false, infoText = null) {
        let layers, count = {index: 0, hits: 0}, hit = false, distance, editor = false,
            metaDataKeys = meta.getMetaDataKeys(), firstLoop = true;
        elementPrefix = prefix;

        if (`editor` in extensions) {
            editor = extensions.editor.index;
            editingIsEnabled = true;
        }

        qStoreShadow = qstore;

        this.reset(qstore);
        layers = _layers.getLayers() ? _layers.getLayers().split(",") : [];

        // Filter layers without pixels from
        layers = layers.filter((key)=>{
            if (typeof moduleState.tileContentCache[key] === "boolean" && moduleState.tileContentCache[key] === true) {
                return true;
            }
        })

        // Set layers to passed array of layers if set
        layers = includes || layers;

        // Remove not queryable layers from array
        for (var i = layers.length - 1; i >= 0; i--) {
            if (typeof metaDataKeys[layers[i]] !== "undefined" && metaDataKeys[layers[i]].not_querable) {
                layers.splice(i, 1);
            }
        }

        backboneEvents.get().trigger("start:sqlQuery");

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
            var keyWithoutGeom = metaDataKeys[value].f_table_schema + "." + metaDataKeys[value].f_table_name;
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
            let parsedMeta = layerTree.parseLayerMeta(metaDataKeys[value]);

            let featureInfoTableOnMap = (typeof window.vidiConfig.featureInfoTableOnMap !== "undefined" && window.vidiConfig.featureInfoTableOnMap === true && simple);
            let f_geometry_column = metaDataKeys[value].f_geometry_column

            // Back arrow to template if featureInfoTableOnMap is true
            if (featureInfoTableOnMap && !backArrowIsAdded) {
                backArrowIsAdded = true;
                defaultTemplate = `
                                <div class='show-when-multiple-hits' style='cursor: pointer;' onclick='javascript:$("#modal-info-body").show();$("#alternative-info-container").hide();$("#click-for-info-slide .modal-title").empty();'>
                                    <span class='material-icons'  style=''>keyboard_arrow_left </span>
                                    <span style="top: -7px;position: relative;">${__("Back")}</span>
                                </div>` + defaultTemplate;
            }

            if (parsedMeta.info_element_selector) {
                $(parsedMeta.info_element_selector).empty();
            }

            let styleForSelectedFeatures;
            if (typeof parsedMeta.tiles_selected_style !== "undefined" && parsedMeta.tiles_selected_style !== "") {
                try {
                    styleForSelectedFeatures = JSON.parse(parsedMeta.tiles_selected_style);
                } catch (e) {
                    styleForSelectedFeatures = defaultSelectedStyle;
                    console.error("tiles_selected_style is not valid JSON");
                }
            } else {
                styleForSelectedFeatures = defaultSelectedStyle;
            }

            _layers.incrementCountLoading(key);
            backboneEvents.get().trigger("startLoading:layers", key);

            if (geoType !== "POLYGON" && geoType !== "MULTIPOLYGON") {
                distance = 10 * MAP_RESOLUTIONS[cloud.get().getZoom()];
            }

            if (!callBack) {
                onLoad = function () {
                    var layerObj = this, cm = [], storeId = this.id, sql = this.sql;

                    _layers.decrementCountLoading("_vidi_sql_" + storeId);
                    backboneEvents.get().trigger("doneLoading:layers", "_vidi_sql_" + storeId);

                    isEmpty = layerObj.isEmpty();

                    template = (typeof metaDataKeys[value].infowindow !== "undefined" && metaDataKeys[value].infowindow.template !== "") ? metaDataKeys[value].infowindow.template : metaDataKeys[value].type === "RASTER" ? defaultTemplateRaster : defaultTemplate;

                    template = (parsedMeta.info_template && parsedMeta.info_template !== "") ? parsedMeta.info_template : template;

                    if (!isEmpty && !not_querable) {

                        if (firstLoop) { // Only add html once
                            firstLoop = false;
                            let popUpInner = `<div id="modal-info-body">
                                <ul class="nav nav-tabs" id="info-tab"></ul>
                                <div class="tab-content" id="info-pane"></div>
                            </div>
                            <div id="alternative-info-container" class="alternative-info-container-right" style="display:none"></div>`;

                            // Add alternative-info-container to pop-up if featureInfoTableOnMap or else in left slide panel
                            if (featureInfoTableOnMap) {
                                let popup = L.popup({
                                    minWidth: 350
                                })
                                    .setLatLng(infoClickPoint)
                                    .setContent(`<div id="info-box-pop-up"></div>`)
                                    .openOn(cloud.get().map)
                                    .on('remove', ()=>{
                                       _self.resetAll();
                                    });
                                $("#info-box-pop-up").html(popUpInner);

                            } else {
                                $("#info-box").html(popUpInner);
                            }
                        }

                        let display = simple ? "none" : "inline";
                        let dataShowExport, dataShowColumns, dataShowToggle, dataDetailView;
                        let info = infoText ? `<div>${infoText}</div>` : "";
                        dataShowExport = dataShowColumns = dataShowToggle = dataDetailView = simple ? "false" : "true";

                        $(`#${elementPrefix}modal-info-body`).show();
                        $(`#${elementPrefix}info-tab`).append(`<li><a onclick="setTimeout(()=>{$('#${elementPrefix}modal-info-body table').bootstrapTable('resetView'),100})" id="tab_${storeId}" data-toggle="tab" href="#_${storeId}">${layerTitel}</a></li>`);
                        $(`#${elementPrefix}info-pane`).append(`<div class="tab-pane" id="_${storeId}">
                            <div style="display: ${display}">
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
                            ${info}
                            <table class="table" data-detail-view="${dataDetailView}" data-detail-formatter="detailFormatter" data-show-toggle="${dataShowToggle}" data-show-export="${dataShowExport}" data-show-columns="${dataShowColumns}"></table>
                        </div>`);

                        // Set select_function if featureInfoTableOnMap = true
                        if ((typeof parsedMeta.select_function === "undefined" || parsedMeta.select_function === "") && featureInfoTableOnMap) {
                            let selectFunction = `function(id, layer, key, sqlQuery){
                                                     $("#modal-info-body").hide();
                                                     $("#alternative-info-container").show();
                                                  }`;
                            selectCallBack = Function('"use strict";return (' + selectFunction + ')')();
                        } else if (typeof parsedMeta.select_function !== "undefined" && parsedMeta.select_function !== "") {
                            try {
                                selectCallBack = Function('"use strict";return (' + parsedMeta.select_function + ')')();
                            } catch (e) {
                                console.info("Error in select function for: " + _key_);
                                console.error(e.message);
                            }
                        }
                        cm = _self.prepareDataForTableView(value, layerObj.geoJSON.features);
                        $('#tab_' + storeId).tab('show');

                        hit = true;
                        count.hits = count.hits + Object.keys(layerObj.layer._layers).length;

                        var _table = gc2table.init({
                            el: "#_" + storeId + " table",
                            ns: "#_" + storeId,
                            geocloud2: cloud.get(),
                            store: layerObj,
                            cm: cm,
                            autoUpdate: false,
                            autoPan: false,
                            openPopUp: true,
                            setViewOnSelect: count.hits > 1,
                            responsive: false,
                            callCustomOnload: false,
                            checkBox: !simple,
                            height: featureInfoTableOnMap ? 150 : 350,
                            locale: window._vidiLocale.replace("_", "-"),
                            template: template,
                            pkey: pkey,
                            renderInfoIn: parsedMeta.info_element_selector || featureInfoTableOnMap ? "#alternative-info-container" : null,
                            onSelect: selectCallBack,
                            key: keyWithoutGeom,
                            caller: _self,
                            styleSelected: styleForSelectedFeatures,
                            setZoom: parsedMeta?.zoom_on_table_click ? parsedMeta.zoom_on_table_click : false,
                            dashSelected: true
                        });

                        if (!parsedMeta.info_element_selector) {
                            _table.object.on("openpopup" + "_" + _table.uid, function (e) {
                                let popup = e.getPopup();
                                if (popup?._closeButton) {
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
                        }
                        // Here inside onLoad we call loadDataInTable(), so the table is populated
                        _table.loadDataInTable(false, true);

                        let showTableInPopup = typeof window.vidiConfig.showTableInPopUp === "boolean" && window.vidiConfig.showTableInPopUp === true;

                        if (typeof parsedMeta.info_function !== "undefined" && parsedMeta.info_function !== "") {
                            try {
                                let func = Function('"use strict";return (' + parsedMeta.info_function + ')')();
                                func(this.layer.toGeoJSON(), this.layer, keyWithoutGeom, _self, this, cloud.get().map);
                            } catch (e) {
                                console.info("Error in click function for: " + _key_);
                                console.error(e.message);
                            }
                        }


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
                            $(`#${elementPrefix}modal-info-body`).hide();
                            $.snackbar({
                                content: "<span id=`conflict-progress`>" + __("Didn't find anything") + "</span>",
                                htmlAllowed: true,
                                timeout: 2000
                            });
                        } else {
                            $(`#${elementPrefix}main-tabs a[href="#${elementPrefix}info-content"]`).tab('show');
                            if (zoomToResult) {
                                cloud.get().zoomToExtentOfgeoJsonStore(qstore[storeId], 16);
                            }
                            // Set visibility. This is not because the element is hidden by default, but it makes it possible to hide the list using custom functions.
                            if (count.hits > 1) {
                                $("#modal-info-body").css("visibility", "visible")
                            }
                            setTimeout(() => {
                                $(`#${elementPrefix}modal-info-body table`).bootstrapTable('resetView');
                                // If only one hit across all layers, the click the only row
                                if (count.hits === 1) {
                                    $("#info-box [data-uniqueid]").trigger("click");
                                    $(".show-when-multiple-hits").hide();
                                }
                            }, 100);
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
                key: value,
                base64: true,
                styleMap: styleForSelectedFeatures,
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

            var sql, fieldNames = [], fieldStr;

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
            // Get applied filters from layerTree as a WHERE clause
            let filters = layerTree.getFilterStr(keyWithoutGeom) ? layerTree.getFilterStr(keyWithoutGeom) : "1=1";
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
                        sql = "SELECT * FROM (SELECT " + fieldStr + " FROM " + value + " WHERE " + filters + ") AS foo WHERE ST_Intersects (" + f_geometry_column + ", ST_Buffer(ST_Transform(ST_GeomFromText('" + wkt + "' ," + proj +")," +srid + "), " + distance + "))";
                        if (versioning) {
                            sql = sql + " AND gc2_version_end_date IS NULL ";
                        }
                        sql = sql + " ORDER BY round(ST_Distance(ST_Transform(\"" + f_geometry_column + "\"," + proj + "), ST_GeomFromText('" + wkt + "'," + proj + ")))";
                    } else {
                        sql = "SELECT * FROM (SELECT " + fieldStr + " FROM " + value + " WHERE " + filters + ") AS foo WHERE ST_Intersects(ST_Transform(ST_geomfromtext('" + wkt + "'," + proj + ")," + srid + ")," + f_geometry_column + ")";
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

            console.log("Fired SQL:", sql);

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
                            value = "<a target='_blank' rel='noopener' href='" + (property.value.linkprefix ? property.value.linkprefix : "") + feature.properties[property.key] + (property.value.linksuffix ? property.value.linksuffix : "") + "'>Link</a>";
                        } else if (property.value.content && property.value.content === "image") {
                            if (!feature.properties[property.key]) {
                                value = `<i class="fa fa-ban"></i>`;
                            } else {
                                let layerKeyWithoutPrefix = layerKey.replace(LAYER.VECTOR + ':', '');
                                if (metaDataKeys[layerKeyWithoutPrefix]["fields"][property.key].type.startsWith("json")) {
                                    // We use a Handlebars template to create a image carousel
                                    let carouselId = Base64.encode(layerKey).replace(/=/g, "");
                                    let tmpl = `<div id="${carouselId}" class="carousel slide" data-ride="carousel">
                                                    <ol class="carousel-indicators">
                                                        {{#@root}}
                                                        <li data-target="#${carouselId}" data-slide-to="{{@index}}"  class="{{#if @first}}active{{/if}}"></li>
                                                        {{/@root}}
                                                    </ol>
                                                    <div class="carousel-inner" role="listbox">
                                                        {{#@root}}
                                                        <div class="item {{#if @first}}active{{/if}}">
                                                            <img style="width: 100%" src="{{src}}" alt="">
                                                            <div class="carousel-caption">
                                                                <p>{{att}}</p>
                                                            </div>
                                                        </div>
                                                        {{/@root}}
                                                    </div>
                                                    <a class="left carousel-control" href="#${carouselId}" role="button" data-slide="prev">
                                                        <span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
                                                        <span class="sr-only">Previous</span>
                                                    </a>
                                                    <a class="right carousel-control" href="#${carouselId}" role="button" data-slide="next">
                                                        <span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>
                                                        <span class="sr-only">Next</span>
                                                    </a>
                                                </div>`;
                                    Handlebars.registerHelper('breaklines', function (text) {
                                        text = Handlebars.Utils.escapeExpression(text);
                                        text = text.replace(/(\r\n|\n|\r)/gm, '<br>');
                                        return new Handlebars.SafeString(text);
                                    });
                                    value = Handlebars.compile(tmpl)(feature.properties[property.key]);
                                } else {
                                    let subValue = feature.properties[property.key];
                                    value =
                                        `<div style="cursor: pointer" onclick="window.open().document.body.innerHTML = '<img src=\\'${subValue}\\' />';">
                                        <img style='width:250px' src='${subValue}'/>
                                     </div>`;
                                }
                            }
                        } else if (property.value.content && property.value.content === "video") {
                            if (!feature.properties[property.key]) {
                                value = `<i class="fa fa-ban"></i>`;
                            } else {
                                let subValue = feature.properties[property.key];
                                value =
                                    `<video width="250" controls>
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
        $(`#${elementPrefix}info-tab`).empty();
        $(`#${elementPrefix}info-pane`).empty();
        cloud.get().map.closePopup();
    },

    resetAll: function () {
        this.reset(qStoreShadow);
    },

    setDownloadFunction: function (fn) {
        download.download = fn
    },

    getVectorTemplate: function (layerKey) {
        let metaDataKeys = meta.getMetaDataKeys();
        let parsedMeta = layerTree.parseLayerMeta(metaDataKeys[layerKey]);
        let template = (typeof metaDataKeys[layerKey].infowindow !== "undefined" && metaDataKeys[layerKey].infowindow.template !== "") ? metaDataKeys[layerKey].infowindow.template : defaultTemplateForCrossMultiSelect;
        template = (parsedMeta.info_template && parsedMeta.info_template !== "") ? parsedMeta.info_template : template;
        return template;
    },

    openInfoSlidePanel: function (layerKey = null) {
        $("#click-for-info-slide.slide-left").show();
        $("#click-for-info-slide.slide-left").animate({left: "0"}, 200);
        if (layerKey) {
            let metaDataKeys = meta.getMetaDataKeys();
            let title = typeof metaDataKeys[layerKey].f_table_title !== "undefined" ? metaDataKeys[layerKey].f_table_title : metaDataKeys[layerKey].f_table_name;
            $("#click-for-info-slide .modal-title").html(title);

        }
    }
};
