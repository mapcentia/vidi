/*
 * @author     Martin Høgh <mh@mapcentia.com>
 * @copyright  2013-2023 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

'use strict';

import {LAYER, SYSTEM_FIELD_PREFIX} from './layerTree/constants';
import {GEOJSON_PRECISION, MIME_TYPES_APPS, MIME_TYPES_IMAGES} from './constants';
import dayjs from 'dayjs';
import {getResolutions} from "./crs";
import {utils as xlsxUtils, writeFile} from 'xlsx';

const layerTreeUtils = require('./layerTree/utils');

/**
 * @type {*|exports|module.exports}
 */
let cloud, backboneEvents, meta, layerTree, advancedInfo, switchLayer, utils;

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

let editToolsHtml = `
        <div class="form-group gc2-edit-tools" data-edit-layer-id="{{_vidi_edit_layer_id}}" data-edit-layer-name="{{_vidi_edit_layer_name}}" data-edit-vector="{{_vidi_edit_vector}}" style="display: {{_vidi_edit_display}};">
            <div class="btn-group mt-1 w-100 mb-2">
                <button class="btn btn-outline-secondary btn-sm popup-edit-btn">
                    <i class="bi bi-pencil" aria-hidden="true"></i>
                </button>
                <button class="btn btn-outline-danger btn-sm popup-delete-btn">
                    <i class="bi bi-trash" aria-hidden="true"></i>
                </button>
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
            {{#if template}}
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

let result = []

// Listen to the arrival of the result and create a "get excal button"
new MutationObserver(function (mutations) {
    for (let u = 0; u < mutations.length; u++) {
        const mutation = mutations[u];
        for (let i = 0; i < mutation.addedNodes.length; i++) {
            if (mutation.addedNodes[i].id === 'modal-info-body') {
                let btn = document.createElement("button");
                btn.classList.add("btn");
                btn.classList.add("btn-outline-secondary");
                btn.classList.add("w-100");
                btn.classList.add("mb-4");
                btn.innerText = __('Get result as MS Excel');
                btn.onclick = function () {
                    let postfixNumber = 1;
                    let dataAdded = false;
                    const wb = xlsxUtils.book_new();
                    let names = [];
                    result.forEach(r => {
                        let data = [];
                        let name = r.layerTitle;
                        name = name.slice(0, 30);
                        if (names.includes(name)) {
                            name = name.slice(0, -1) + postfixNumber;
                            postfixNumber++;
                            names.push(name);
                        }
                        names.push(name);
                        if (r.data.features.length > 0) {
                            const header = [];
                            for (const prop in r.data.features[0].properties) {
                                if (r.data.features[0].properties.hasOwnProperty(prop) && prop !== '_id' && prop !== '_vidi_content') {
                                    if (r.fieldConf?.[prop]?.querable || !r.fieldConf) {
                                        header.push(r.fieldConf?.[prop]?.alias || prop);
                                    }
                                }
                            }
                            data = r.data.features.map(feature => {
                                const row = [];
                                for (const prop in feature.properties) {
                                    if (r.data.features[0].properties.hasOwnProperty(prop) && prop !== '_id' && prop !== '_vidi_content') {
                                        if (r.fieldConf?.[prop]?.querable || !r.fieldConf) {
                                            row.push(feature.properties[prop]);
                                        }
                                    }
                                }
                                return row;
                            });
                            data.unshift(header)
                        }
                        let ws = xlsxUtils.aoa_to_sheet(data);
                        dataAdded = true;
                        try {
                            xlsxUtils.book_append_sheet(wb, ws, name);
                        } catch (e) {
                            console.error(e.message);
                        }
                    })
                    if (!dataAdded) {
                        xlsxUtils.book_append_sheet(wb, [[]]);
                    }
                    try {
                        writeFile(wb, 'Result.xlsb');
                    } catch (e) {
                        console.error(e.message, 'Could not create excel file.')
                    }
                }
                document.querySelector("#modal-info-body").prepend(btn);
            }
        }
    }
}).observe(document, {childList: true, subtree: true});

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
        utils = o.utils;
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
            metaDataKeys = meta.getMetaDataKeys(), firstLoop = true, layersWithHits = [];
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
        if (layers.length === 0 && callBack) {
            callBack();
        }

        backboneEvents.get().trigger("start:sqlQuery");

        result = [];
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
            let layerTitle = (metaDataKeys[value].f_table_title !== null && metaDataKeys[value].f_table_title !== "") ? metaDataKeys[value].f_table_title : metaDataKeys[value].f_table_name;
            let notQueryable = metaDataKeys[value].not_querable;
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
                                <button class='btn btn-sm btn-outline-secondary mb-2 show-when-multiple-hits'>
                                    <i class='bi bi-arrow-left'></i> ${__("Back")}
                                </button>` + defaultTemplate;
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
                distance = 10 * getResolutions(window.vidiConfig.crs)[cloud.get().getZoom()];
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

                    if (!isEmpty && !notQueryable) {
                        result.push({data: layerObj.geoJSON, layerTitle, fieldConf});
                        layersWithHits.push(value);
                        if (firstLoop) { // Only add html once
                            firstLoop = false;
                            let popUpInner = `<div id="modal-info-body">
                                <ul class="nav nav-pills mb-2" id="info-tab"></ul>
                                <div class="tab-content" id="info-pane"></div>
                            </div>
                            <div id="alternative-info-container" class="alternative-info-container-right" style="display:none"></div>`;

                            if (featureInfoTableOnMap || forceOffCanvasInfo) {
                                if (forceOffCanvasInfo) {
                                    $('#offcanvas-info-container').html(popUpInner);
                                } else {
                                    const popup = L.popup({
                                        minWidth: 350
                                    }).setLatLng(infoClickPoint)
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
                                    popup.on('remove', function () {
                                        backboneEvents.get().trigger("sqlQuery:clear");
                                    });
                                    $("#info-box-pop-up").html(popUpInner);
                                }

                            } else {
                                $("#info-box").html(popUpInner);
                            }
                        }
                        let display = simple ? "none" : "flex";
                        let dataShowExport, dataShowColumns, dataShowToggle, dataDetailView;
                        let info = infoText ? `<div>${infoText}</div>` : "";
                        dataShowExport = dataShowColumns = dataShowToggle = dataDetailView = simple ? "false" : "true";

                        $(`#${elementPrefix}modal-info-body`).show();
                        $(`#${elementPrefix}info-tab`).append(`<li class="nav-item">
                                                                    <button type="button" class="nav-link" data-bs-toggle="tab" onclick="setTimeout(()=>{$('#${elementPrefix}modal-info-body table').bootstrapTable('resetView'),100})" id="tab_${storeId}" data-bs-target="#_${storeId}">${layerTitle}</button>
                                                               </li>`);
                        $(`#${elementPrefix}info-pane`).append(`<div class="tab-pane _sql_query" id="_${storeId}">
                            <div style="display: ${display}" class="justify-content-around mt-3 mb-3">
                                <button class="btn btn-sm btn-outline-secondary" id="_download_geojson_${storeId}">
                                    <i class="bi bi-download" aria-hidden="true"></i> GeoJson
                                </button> 
                                <button class="btn btn-sm btn-outline-secondary" id="_create_layer_${storeId}">
                                    <i class="bi bi-plus" aria-hidden="true"></i> ${__(`Create virtual layer`)}
                                </button>
                            </div>
                            ${info}
                            <table class="table table-sm" data-detail-view="${dataDetailView}" data-detail-formatter="detailFormatter" data-show-toggle="${dataShowToggle}" data-show-export="${dataShowExport}" data-show-columns="${dataShowColumns}"></table>
                        </div>`);

                        let s = () => {
                        };
                        if (typeof parsedMeta.select_function !== "undefined" && parsedMeta.select_function !== "") {
                            try {
                                s = Function('"use strict";return (' + parsedMeta.select_function + ')')();
                            } catch (e) {
                                const f = `
                                        function(id, layer, key, sqlQuery) {
                                            ${parsedMeta.select_function}
                                        }
                                        `;
                                s = Function('"use strict";return (' + f + ')')();
                            }
                        }
                        let selectCallBack2;
                        if (featureInfoTableOnMap || forceOffCanvasInfo) {
                            selectCallBack2 = function (id, layer, key, sqlQuery) {
                                $("#modal-info-body").hide();
                                $("#alternative-info-container").show();
                                try {
                                    s(id, layer, key, sqlQuery);
                                    selectCallBack(id, layer, key, sqlQuery);
                                } catch (e) {
                                    console.info("Error in select function for: " + _key_, e.message);
                                }
                            };
                        } else {
                            selectCallBack2 = function (id, layer, key, sqlQuery) {
                                try {
                                    s(id, layer, key, sqlQuery);
                                    selectCallBack(id, layer, key, sqlQuery);
                                } catch (e) {
                                    console.info("Error in select function for: " + _key_, e.message);
                                }
                            };
                        }

                        cm = _self.prepareDataForTableView(value, layerObj.geoJSON.features);
                        $('#tab_' + storeId).tab('show');

                        hit = true;
                        count.hits = count.hits + Object.keys(layerObj.layer._layers).length;
                        const ns = "#_" + storeId;
                        // HACK We need to explicit set the width of the table container, or else it's calculated wrong because of the use of flex boxed
                        try {
                            const e = featureInfoTableOnMap || forceOffCanvasInfo ? '#alternative-info-container' : '.main-content';
                            document.querySelector(ns).style.width = (document.querySelector(`${e}`).offsetWidth - 12) + "px";
                        } catch (e) {
                            console.error(e.message)
                        }
                        let _table = gc2table.init({
                            el: ns + " table",
                            ns,
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
                            renderInfoIn: featureInfoTableOnMap || forceOffCanvasInfo ? '#alternative-info-container' : null,
                            onSelect: selectCallBack2,
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
                            let func;
                            try {
                                try {
                                    func = Function('"use strict";return (' + parsedMeta.info_function + ')')();
                                } catch (e) {
                                    const f = `
                                        function(feature, layer, layerKey, sqlQuery, store, map) {
                                            ${parsedMeta.info_function}
                                        }
                                        `;
                                    func = Function('"use strict";return (' + f + ')')();
                                }
                                func(this.layer.toGeoJSON(GEOJSON_PRECISION).features[0], null, keyWithoutGeom, _self, this, cloud.get().map);
                            } catch (e) {
                                console.info("Error in click function for: " + _key_, e.message);
                            }
                        }

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
                            utils.showInfoToast(__("Didn't find anything"))
                            if (window.vidiConfig.emptyInfoCallback) {
                                let func = Function('"use strict";return (' + window.vidiConfig.emptyInfoCallback + ')')();
                                try {
                                    func(layerTree.getActiveLayers());
                                } catch (e) {
                                    console.error("Error in emptyInfoCallback:", e.message)
                                }

                            }
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
                            if (window.vidiConfig.infoCallback) {
                                let func = Function('"use strict";return (' + window.vidiConfig.infoCallback + ')')();
                                try {
                                    func(layersWithHits);
                                } catch (e) {
                                    console.error("Error in infoCallback:", e.message)
                                }
                            }
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
                    utils.showInfoToast(__("Error or timeout on") + " " + layerTitle);
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
                    if (fieldConf?.[i]?.ignore !== true) {
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
                    const type = srid === 4326 ? "geography" : "geometry";
                    if (geoType !== "POLYGON" && geoType !== "MULTIPOLYGON" && (!advancedInfo.getSearchOn())) {
                        sql = "SELECT " + fieldStr + " FROM (SELECT * FROM " + schemaQualifiedName + " WHERE " + filters + ") AS foo WHERE " + envelope + " AND round(ST_Distance(\"" + f_geometry_column + "\", ST_Transform(ST_GeomFromText('" + wkt + "'," + proj + ")," + srid + ")::" + type + ")) < " + distance;
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

            qstore[index].onLoad = onLoad || callBack.bind(this, qstore[index], isEmpty, notQueryable, layerTitle, fieldConf, layers, count);
            qstore[index].sql = sql;
            qstore[index].load();
        });
        if (layers.length === 0) {
            utils.showInfoToast(__("Didn't find anything"));
            if (window.vidiConfig.emptyInfoCallback) {
                let func = Function('"use strict";return (' + window.vidiConfig.emptyInfoCallback + ')')();
                try {
                    func(layerTree.getActiveLayers());
                } catch (e) {
                    console.error("Error in emptyInfoCallback:", e.message)
                }
            }
        }
        if (layersWithHits.length > 0) {
            if (window.vidiConfig.infoCallback) {
                let func = Function('"use strict";return (' + window.vidiConfig.infoCallback + ')')();
                try {
                    func(layersWithHits);
                } catch (e) {
                    console.error("Error in infoCallback:", e.message)
                }
            }
        }
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
                            // Only set field template if property is set or not empty string OR if 'replaceNull' helper is used, which will replace nulls
                            if ((property.value.template && feature.properties[property.key] && feature.properties[property.key] !== '') || property.value?.template?.includes('replaceNull')) {
                                const fieldTmpl = property.value.template;
                                value = Handlebars.compile(fieldTmpl)(feature.properties);
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

                                        value = Handlebars.compile(tmpl)(feature.properties[property.key]);
                                    } else {
                                        let subValue = decodeURIComponent(feature.properties[property.key]);
                                        value =
                                            `<div style="cursor: pointer" onclick="window.open().document.body.innerHTML = '<img src=\\'${subValue}\\' />';">
                                        <img class="w-100" src='${subValue}'/>
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
                            } else if (property.value.type === 'bytea' && feature.properties[property.key]) {
                                let subValue = decodeURIComponent(feature.properties[property.key]);
                                if (subValue) {
                                    let type;
                                    try {
                                        type = utils.splitBase64(subValue).contentType;
                                    } catch (e) {
                                        type = subValue.split("=")[1];
                                    }
                                    if (MIME_TYPES_IMAGES.includes(type)) {
                                        value =
                                            `<div style="cursor: pointer" onclick="window.open().document.body.innerHTML = '<img src=\\'${subValue}\\' />';">
                                        <img class="w-100" src='${subValue}'/>
                                     </div>`;
                                    } else if (MIME_TYPES_APPS.includes(type)) {
                                        value = `<embed
                                        src=${subValue}
                                        type=${type}
                                        width="100%"
                                        height="200px"
                                    />
                                    <a download target="_blank" href=${subValue}>${__("Download the file")}</a>
                                    `;
                                    } else {
                                        value = `
                                        <div>
                                            <div class="alert alert-warning" role="alert">
                                            <i class="bi bi-exclamation-triangle-fill"></i> ${__("The file type can't be shown but you can download it")}: <a download href="${subValue}"/>${type}</a>
                                            </div>
                                        </div>
                                    `
                                    }
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
        template = (parsedMeta.info_template && parsedMeta.info_template !== "") ? parsedMeta.info_template : window.vidiConfig?.crossMultiSelect ? defaultTemplateForCrossMultiSelect : defaultTemplate;
        if (window.vidiConfig.enabledExtensions.includes('editor')) {
            template = editToolsHtml + template;
        }
        return template;
    },

    openInfoSlidePanel: function () {
        layerTree.getInfoOffCanvas().show();
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
