/*
 * @author     Martin Høgh <mh@mapcentia.com>
 * @copyright  2013-2021 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

'use strict';

import mustache from "mustache";
import {LAYER, MAP_RESOLUTIONS, SYSTEM_FIELD_PREFIX} from './layerTree/constants';
import {GEOJSON_PRECISION} from './constants';

const layerTreeUtils = require('./layerTree/utils');

/**
 * @type {*|exports|module.exports}
 */
let cloud, backboneEvents, meta, layerTree, advancedInfo, switchLayer;

/**
 * @type {*|exports|module.exports}
 */
let _layers;

/**
 *
 * @type {*|exports|module.exports}
 */
const urlparser = require('./urlparser');

const download = require('./download');

/**
 * @type {string}
 */
let db = urlparser.db;

let extensions;

let _self = false;

let editingIsEnabled = false;

let draggableEnabled = false;

let template;

let elementPrefix;

let qStoreShadow;

let defaultSelectedStyle = {
    color: '#ff0000',

};

let backArrowIsAdded = false;

const jquery = require('jquery');
require('snackbarjs');


let editToolsHtml = `
        <div class="form-group gc2-edit-tools" data-edit-layer-id="{{_vidi_edit_layer_id}}" data-edit-layer-name="{{_vidi_edit_layer_name}}" data-edit-vector="{{_vidi_edit_vector}}" style="display: {{_vidi_edit_display}};">
            <div class="btn-group btn-group-justified" style="margin: 10px 0;">
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
`;

/**
 * A default template for GC2, with a loop
 * @type {string}
 */
let defaultTemplate =
    `<div class="vidi-popup-content">
        <h3 class="popup-title">{{_vidi_content.title}}</h3>
        {{#_vidi_content.fields}}
            {{#if value}}
                <h4>{{title}}</h4>
                <p {{#if type}}class="{{type}}"{{/if}}>{{{value}}}</p>
            {{/if}}
        {{/_vidi_content.fields}}
    </div>`;

const defaultTemplateForCrossMultiSelect =
    `<div class="vidi-popup-content">
        {{#_vidi_content.fields}}
            {{#if value}}
                <h4>{{title}}</h4>
                <p {{#if type}}class="{{type}}"{{/if}}>{{{value}}}</p>
            {{/if}}
        {{/_vidi_content.fields}}
    </div>`;

/**
 * Default template for raster layers
 * @type {string}
 */
const defaultTemplateRaster =
    `<div class="vidi-popup-content">
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
     * @param zoomToResult
     * @param {Function} onPopupCloseButtonClick Fires when feature popup is closed by clicking the Close button
     * @param selectCallBack
     * @param prefix
     * @param simple
     * @param infoText
     * @param layerTag
     */
    init: function (qstore, wkt, proj, callBack, num, infoClickPoint, whereClause, includes, zoomToResult, onPopupCloseButtonClick, selectCallBack = () => {
    }, prefix = "", simple = false, infoText = null, layerTag = "query_result") {
        let layers, count = {index: 0, hits: 0}, hit = false, distance, editor = false,
            metaDataKeys = meta.getMetaDataKeys(), firstLoop = true;
        elementPrefix = prefix;

        if (window.vidiConfig.enabledExtensions.includes('editor')) {
            editor = extensions.editor.index;
            editingIsEnabled = true;
        }

        if (window.vidiConfig.popupDraggable) {
            draggableEnabled = true;
        }

        qStoreShadow = qstore;

        this.reset(qstore);
        layers = _layers.getLayers() ? _layers.getLayers().split(",") : [];

        // Filter layers without pixels from
        layers = layers.filter((key) => {
            if (window.moduleState?.tileContentCache?.[key] === true) {
                return true;
            }
        })

        // Set layers to passed array of layers if set
        layers = includes || layers;

        // Remove not queryable layers from array
        for (let i = layers.length - 1; i >= 0; i--) {
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

            if (layers[0] === "") {
                return false;
            }

            value = layerTreeUtils.stripPrefix(value);
            if (!metaDataKeys[value]) {
                throw new Error(`metaDataKeys[${value}] is undefined`);
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

            let isEmpty = true;
            let srid = metaDataKeys[value].srid;
            let key = "_vidi_sql_" + index;
            let _key_ = metaDataKeys[value]._key_;
            let keyWithoutGeom = metaDataKeys[value].f_table_schema + "." + metaDataKeys[value].f_table_name;
            let pkey = metaDataKeys[value].pkey;
            let geoType = metaDataKeys[value].type;
            let layerTitel = (metaDataKeys[value].f_table_title !== null && metaDataKeys[value].f_table_title !== "") ? metaDataKeys[value].f_table_title : metaDataKeys[value].f_table_name;
            let not_querable = metaDataKeys[value].not_querable;
            let versioning = metaDataKeys[value].versioning;
            let fields = metaDataKeys?.[value]?.fields || null;
            let onLoad;
            let fieldConf = metaDataKeys?.[value]?.fieldconf !== "" ? JSON.parse(metaDataKeys[value].fieldconf) : null;
            let parsedMeta = layerTree.parseLayerMeta(metaDataKeys[value]);
            let featureInfoTableOnMap = window.vidiConfig.featureInfoTableOnMap === true && simple;
            let forceOffCanvasInfo = window.vidiConfig.forceOffCanvasInfo === true;
            let f_geometry_column = metaDataKeys[value].f_geometry_column
            let styleForSelectedFeatures;
            let defaultTemplateWithBackBtn = false;

            // Back arrow to template if featureInfoTableOnMap is true
            if ((featureInfoTableOnMap || forceOffCanvasInfo) && !backArrowIsAdded) {
                defaultTemplateWithBackBtn = `
                                <div class='show-when-multiple-hits' style='cursor: pointer;'>
                                    <span class='material-icons' style=''>keyboard_arrow_left </span>
                                    <span style="top: -7px;position: relative;">${__("Back")}</span>
                                </div>` + defaultTemplate;
                $(document).arrive('.show-when-multiple-hits', function (e, data) {
                    $(this).on('click', function (e) {
                        $("#modal-info-body").show();
                        $("#alternative-info-container").hide();
                        $("#click-for-info-slide .modal-title").empty();
                        _self.getQstore()?.forEach(store => {
                            $.each(store.layer._layers, function (i, v) {
                                if (store.layer && store.layer.resetStyle) {
                                    store.layer.resetStyle(v);
                                }
                            });
                        })
                    })
                })
            }

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
                    let layerObj = this, cm = [], storeId = this.id, sql = this.sql;

                    _layers.decrementCountLoading("_vidi_sql_" + storeId);
                    backboneEvents.get().trigger("doneLoading:layers", "_vidi_sql_" + storeId);

                    isEmpty = layerObj.isEmpty();

                    template = metaDataKeys[value].type === "RASTER" ? defaultTemplateRaster : defaultTemplateWithBackBtn ? defaultTemplateWithBackBtn : defaultTemplate;
                    template = parsedMeta.info_template && parsedMeta.info_template !== "" ? parsedMeta.info_template : template;
                    if (editingIsEnabled && layerIsEditable) {
                        template = editToolsHtml + template;
                    }

                    if (!isEmpty && !not_querable) {

                        if (firstLoop) { // Only add html once
                            firstLoop = false;
                            let popUpInner = `<div id="modal-info-body">
                                <ul class="nav nav-tabs" id="info-tab"></ul>
                                <div class="tab-content" id="info-pane"></div>
                            </div>
                            <div id="alternative-info-container" class="alternative-info-container-right" style="display:none"></div>`;

                            if (featureInfoTableOnMap || forceOffCanvasInfo) {
                                if (forceOffCanvasInfo) {
                                    $('#offcanvas-info-container').html(popUpInner);
                                } else {
                                    const popup = L.popup({
                                        minWidth: 350
                                    })
                                        .setLatLng(infoClickPoint)
                                        .setContent(`<div id="info-box-pop-up"></div>`)
                                        .openOn(cloud.get().map)
                                        .on('remove', () => {
                                            if (editor && editor.getEditedFeature()) {
                                                _self.resetAll();
                                            }
                                        });

                                    if (draggableEnabled) {
                                        _self.makeDraggable(popup);
                                    }

                                    $("#info-box-pop-up").html(popUpInner);
                                }

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
                        $(`#${elementPrefix}info-pane`).append(`<div class="tab-pane _sql_query" id="_${storeId}">
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

                        let s = () => {
                        };
                        if (typeof parsedMeta.select_function !== "undefined" && parsedMeta.select_function !== "") {
                            try {
                                s = Function('"use strict";return (' + parsedMeta.select_function + ')')();
                            } catch (e) {
                                console.info("Error in select function for: " + _key_);
                                console.error(e.message);
                            }
                        }
                        // Set select_function if featureInfoTableOnMap = true
                        if (featureInfoTableOnMap || forceOffCanvasInfo) {
                            selectCallBack = function (id, layer, key, sqlQuery) {
                                $("#modal-info-body").hide();
                                $("#alternative-info-container").show();
                                s(id, layer, key, sqlQuery);
                            };
                        }

                        cm = _self.prepareDataForTableView(value, layerObj.geoJSON.features);
                        $('#tab_' + storeId).tab('show');

                        hit = true;
                        count.hits = count.hits + Object.keys(layerObj.layer._layers).length;
                        let _table = gc2table.init({
                            el: "#_" + storeId + " table",
                            ns: "#_" + storeId,
                            geocloud2: cloud.get(),
                            store: layerObj,
                            cm: cm,
                            autoUpdate: false,
                            autoPan: window.vidiConfig.autoPanPopup,
                            openPopUp: true,
                            setViewOnSelect: count.hits > 1,
                            responsive: false,
                            callCustomOnload: false,
                            checkBox: !simple,
                            height: featureInfoTableOnMap ? 150 : 350,
                            locale: window._vidiLocale.replace("_", "-"),
                            template: template,
                            pkey: pkey,
                            // renderInfoIn: '#offcanvas-info-container',
                            renderInfoIn: featureInfoTableOnMap || forceOffCanvasInfo ? '#alternative-info-container' : null,
                            onSelect: selectCallBack,
                            key: keyWithoutGeom,
                            caller: _self,
                            styleSelected: styleForSelectedFeatures,
                            setZoom: parsedMeta?.zoom_on_table_click ? parsedMeta.zoom_on_table_click : false,
                        });
                        _table.object.on("openpopup" + "_" + _table.uid, function (e, layersClone) {
                            let popup = e.getPopup();
                            if (popup?._closeButton) {
                                popup._closeButton.onclick = function () {
                                    if (onPopupCloseButtonClick) {
                                        onPopupCloseButtonClick(e._leaflet_id);
                                    }
                                }
                            }

                            if (draggableEnabled) {
                                _self.makeDraggable(popup);
                            }
                        });
                        // Here inside onLoad we call loadDataInTable(), so the table is populated
                        _table.loadDataInTable(false, true);

                        if (typeof parsedMeta.info_function !== "undefined" && parsedMeta.info_function !== "") {
                            try {
                                let func = Function('"use strict";return (' + parsedMeta.info_function + ')')();
                                func(this.layer.toGeoJSON(GEOJSON_PRECISION).features[0], this.layer, keyWithoutGeom, _self, this, cloud.get().map);
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
                            _self.closeInfoSlidePanel();
                            $(`#${elementPrefix}modal-info-body`).hide();
                            jquery.snackbar({
                                content: "<span id=`conflict-progress`>" + __("Didn't find anything") + "</span>",
                                htmlAllowed: true,
                                timeout: 2000
                            });
                        } else {
                            if (forceOffCanvasInfo) {
                                _self.openInfoSlidePanel();
                            }
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
                                    $(`._sql_query [data-uniqueid]`).trigger("click");
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
                uri: "/api/sql/nocache",
                clickable: true,
                id: index,
                key: value,
                base64: true,
                styleMap: styleForSelectedFeatures,
                error: () => {
                    jquery.snackbar({
                        content: "<span>" + __("Error or timeout on") + " " + layerTitel + "</span>",
                        htmlAllowed: true,
                        timeout: 2000
                    })
                },
                // Set _vidi_type on all vector layers,
                // so they can be recreated as query layers
                // after serialization
                // ========================================
                onEachFeature: function (f, l) {
                    if (typeof l._layers !== "undefined") {
                        $.each(l._layers, function (i, v) {
                            v._vidi_type = layerTag;
                        })
                    } else {
                        l._vidi_type = layerTag;
                    }
                }
            });

            cloud.get().addGeoJsonStore(qstore[index]);

            let sql, fieldNames = [], fieldStr;

            if (fields) {
                $.each(fields, function (i, v) {
                    if (v.type === "bytea") {
                        fieldNames.push("encode(\"" + i + "\",'escape') as \"" + i + "\"");
                    } else if (fieldConf?.[i]?.ignore !== true) {
                        fieldNames.push("\"" + i + "\"");
                    }
                });
                fieldStr = fieldNames.join(",");
            } else {
                fieldStr = "*";
            }

            const extent = [
                cloud.get().getExtent().left,
                cloud.get().getExtent().bottom,
                cloud.get().getExtent().right,
                cloud.get().getExtent().top
            ]
            // Get applied filters from layerTree as a WHERE clause
            let filters = layerTree.getFilterStr(keyWithoutGeom) ? layerTree.getFilterStr(keyWithoutGeom) : "1=1";
            const schemaQualifiedName = "\"" + value.split(".")[0] + "\".\"" + value.split(".")[1] + "\"";
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
                        ...extent
                    ];
                } else {
                    const envelope = `"${f_geometry_column}" && ST_Transform(ST_MakeEnvelope(${extent.join(',')}, 4326), ${srid})`;
                    if (geoType !== "POLYGON" && geoType !== "MULTIPOLYGON" && (!advancedInfo.getSearchOn())) {
                        sql = "SELECT " + fieldStr + " FROM (SELECT * FROM " + schemaQualifiedName + " WHERE " + filters + ") AS foo WHERE " + envelope + " AND round(ST_Distance(\"" + f_geometry_column + "\", ST_Transform(ST_GeomFromText('" + wkt + "'," + proj + ")," + srid + "))) < " + distance;
                        if (versioning) {
                            sql = sql + " AND gc2_version_end_date IS NULL ";
                        }
                        sql = sql + " ORDER BY round(ST_Distance(\"" + f_geometry_column + "\", ST_Transform(ST_GeomFromText('" + wkt + "'," + proj + ")," + srid + ")))";
                    } else {
                        sql = "SELECT " + fieldStr + " FROM (SELECT * FROM " + schemaQualifiedName + " WHERE " + filters + ") AS foo WHERE ST_Intersects(ST_Transform(ST_geomfromtext('" + wkt + "'," + proj + ")," + srid + ")," + f_geometry_column + ")";
                        if (versioning) {
                            sql = sql + " AND gc2_version_end_date IS NULL ";
                        }
                        qstore[index].custom_data = "";
                    }
                }
            } else {
                sql = "SELECT " + fieldStr + " FROM " + schemaQualifiedName + " WHERE " + whereClause;
                if (versioning) {
                    sql = sql + " AND gc2_version_end_date IS NULL ";
                }
                qstore[index].custom_data = "";
            }

            sql = sql + " LIMIT " + (num || 10000);

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
        if (features.length > 0) {
            features.forEach(feature => {
                let fields = [];
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
                            if (property.value.template && feature.properties[property.key] && feature.properties[property.key] !== '') {
                                const fieldTmpl = property.value.template;
                                value = mustache.render(fieldTmpl, feature.properties);
                            } else if (property.value.link && feature.properties[property.key] && feature.properties[property.key] !== '') {
                                value = "<a target='_blank' rel='noopener' href='" + (property.value.linkprefix ? property.value.linkprefix : "") + feature.properties[property.key] + (property.value.linksuffix ? property.value.linksuffix : "") + "'>Link</a>";
                            } else if (property.value.content && property.value.content === "image") {
                                if (!feature.properties[property.key]) {
                                    value = null;
                                } else {
                                    let layerKeyWithoutPrefix = layerKey.replace(LAYER.VECTOR + ':', '');
                                    if (metaDataKeys[layerKeyWithoutPrefix]["fields"][property.key].type.startsWith("json")) {
                                        // We use a Handlebars template to create a image carousel
                                        let carouselId = Base64.encode(layerKey).replace(/=/g, "");
                                        let tmpl = `<div id="${carouselId}" class="carousel slide" data-ride="carousel">
                                                    <ol class="carousel-indicators">
                                                        {{#@root}}
                                                        <li data-bs-target="#${carouselId}" data-slide-to="{{@index}}"  class="{{#if @first}}active{{/if}}"></li>
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
                                    value = null;
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
                                out.push([property.key, property.value.sort_id, fieldLabel, property.value.link, property.value.template, property.value.content]);
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
                    out.forEach(property => {
                        cm.push({
                            header: property[2],
                            dataIndex: property[0],
                            sortable: true,
                            link: property[3],
                            template: property[4],
                            content: property[5],
                        })
                    });
                    first = false;
                }

                out = [];
            });
        } else { // If no features are present e.g. when use dynamic load
            sortObject(fieldConf).forEach((property) => {
                fieldLabel = (property.value.alias !== null && property.value.alias !== "") ? property.value.alias : property.key;
                out.push([property.key, property.value.sort_id, fieldLabel, property.value.link]);
            });
            out.sort(function (a, b) {
                return a[1] - b[1];
            });
            out.forEach(property => {
                cm.push({
                    header: property[2],
                    dataIndex: property[0],
                    sortable: true,
                    link: property[3]
                })
            });
        }
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

    getVectorTemplate: function (layerKey, multi = true) {
        let metaDataKeys = meta.getMetaDataKeys();
        let parsedMeta = layerTree.parseLayerMeta(metaDataKeys[layerKey]);
        template = (parsedMeta.info_template && parsedMeta.info_template !== "") ? parsedMeta.info_template : defaultTemplate;
        if (window.vidiConfig.enabledExtensions.includes('editor')) {
            template = editToolsHtml + template;
        }
        return template;
    },

    openInfoSlidePanel: function (layerKey = null) {
        layerTree.getInfoOffCanvas().show()
        // let e = $("#click-for-info-slide.slide-left");
        // e.show();
        // e.animate({left: "0"}, 200);
        // if (layerKey) {
        //     let metaDataKeys = meta.getMetaDataKeys();
        //     let title = typeof metaDataKeys[layerKey].f_table_title !== "undefined" ? metaDataKeys[layerKey].f_table_title : metaDataKeys[layerKey].f_table_name;
        //     $("#click-for-info-slide .modal-title").html(title);
        //
        // }
    },
    closeInfoSlidePanel: function () {
        layerTree.getInfoOffCanvas().hide();
    },

    /**
     * makes popup draggable
     * @param popup {object}
     */
    makeDraggable: (popup) => {
        const map = cloud.get().map
        const draggable = new L.Draggable(popup._container, popup._wrapper);
        // change cursor class
        $(".leaflet-popup-content-wrapper").css('cursor', 'move');
        draggable.on('dragstart', function (e) {
            //on first drag, remove the pop-up tip
            $(".leaflet-popup-tip-container").hide();
        });
        draggable.on('dragend', function (e) {
            // set the new position
            popup.setLatLng(map.layerPointToLatLng(e.target._newPos));
        });
        draggable.enable();
    },

    /**
     * Get query stores
     * @returns array
     */
    getQstore: () => {
        return qStoreShadow;
    }
};
