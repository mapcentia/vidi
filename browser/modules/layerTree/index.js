/**
 * @fileoverview Description of file, its uses and information
 * about its dependencies.
 */

'use strict';

const LOG = false;

const MODULE_NAME = `layerTree`;

const SQL_QUERY_LIMIT = 500;

const TABLE_VIEW_FORM_CONTAINER_ID = 'vector-layer-table-view-form';

const TABLE_VIEW_CONTAINER_ID = 'vector-layer-table-view-dialog';

var meta, layers, sqlQuery, switchLayer, cloud, legend, state, backboneEvents;

var layerTreeOrder = false;

var onEachFeature = [];

var pointToLayer = [];

var onLoad = [];

var onSelect = [];

var onMouseOver = [];

var cm = [];

var styles = [];

var stores = [];

var tableViewStores = {};

var tables = {};

var activeOpenedTable = false;

var _self;

var defaultTemplate = `<div class="cartodb-popup-content">
<div class="form-group gc2-edit-tools" style="visibility: hidden">
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

/**
 * Layer filters
 */
var React = require('react');
var ReactDOM = require('react-dom');

import LayerFilter from './LayerFilter';
import { relative } from 'path';
import { validateFilters, EXPRESSIONS_FOR_STRINGS, EXPRESSIONS_FOR_NUMBERS, EXPRESSIONS_FOR_DATES, EXPRESSIONS_FOR_BOOLEANS } from './filterUtils';

/**
 *
 * @type {*|exports|module.exports}
 */
let urlparser = require('./../urlparser');

/**
 *
 * @type {*|exports|module.exports}
 */
let MarkupGenerator = require('./MarkupGenerator');
let markupGeneratorInstance = new MarkupGenerator();

/**
 *
 * @type {*|exports|module.exports}
 */

import { GROUP_CHILD_TYPE_LAYER, GROUP_CHILD_TYPE_GROUP, LayerSorting } from './LayerSorting';
let layerSortingInstance = new LayerSorting();

/**
 *
 * @type {*|exports|module.exports}
 */
let queueStatistsics = false;
let QueueStatisticsWatcher = require('./QueueStatisticsWatcher');

/**
 * @type {string}
 */
var db = urlparser.db;

/**
 *
 * @type {*|exports|module.exports}
 */
let APIBridgeSingletone = require('./../api-bridge');

/**
 *
 * @type {APIBridge}
 */
var apiBridgeInstance = false;

/**
 * Specifies if layer tree is ready
 */
let layerTreeIsReady = false;

/**
 * Fires when the layer tree is built
 */
let _onReady = false;

/**
 * Keeps track of changed layers
 */

const tileLayerIcon = `<i class="material-icons">border_all</i>`;

const vectorLayerIcon = `<i class="material-icons">gesture</i>`;

let layerTreeWasBuilt = false;

let editingIsEnabled = false;

let treeIsBeingBuilt = false;

let userPreferredForceOfflineMode = -1;

let vectorFilters = {};

let extensions = false;

let editor = false;

/**
 *
 * @type {{set: module.exports.set, init: module.exports.init}}
 */
module.exports = {
    set: function (o) {
        cloud = o.cloud;
        meta = o.meta;
        layers = o.layers;
        legend = o.legend;
        state = o.state;
        sqlQuery = o.sqlQuery;
        switchLayer = o.switchLayer;
        backboneEvents = o.backboneEvents;
        extensions = o.extensions;
        return this;
    },

    init: function () {
        if (window.vidiConfig.enabledExtensions.indexOf(`editor`) !== -1) {
            if (`editor` in extensions) {
                editor = extensions.editor.index;
                editingIsEnabled = true;
            }
        }

        _self = this;
        queueStatistsics = new QueueStatisticsWatcher({ switchLayer, layerTree: _self });
        apiBridgeInstance = APIBridgeSingletone((statistics, forceLayerUpdate) => {
            _self.statisticsHandler(statistics, forceLayerUpdate);
        });

        state.listenTo('layerTree', _self);

        $(`#` + TABLE_VIEW_CONTAINER_ID).find(".expand-less").on("click", function () {
            $("#" + TABLE_VIEW_CONTAINER_ID).animate({
                bottom: (($("#" + TABLE_VIEW_CONTAINER_ID).height()*-1)+30) + "px"
            }, 500, function () {
                $(`#` + TABLE_VIEW_CONTAINER_ID).find(".expand-less").hide();
                $(`#` + TABLE_VIEW_CONTAINER_ID).find(".expand-more").show();
            });
        });

        $(`#` + TABLE_VIEW_CONTAINER_ID).find(".expand-more").on("click", function () {
            $("#" + TABLE_VIEW_CONTAINER_ID).animate({
                bottom: "0"
            }, 500, function () {
                $(`#` + TABLE_VIEW_CONTAINER_ID).find(".expand-less").show();
                $(`#` + TABLE_VIEW_CONTAINER_ID).find(".expand-more").hide();
            });
        });

        $(`#` + TABLE_VIEW_CONTAINER_ID).find(".close-hide").on("click", function () {
            tables[activeOpenedTable].object.trigger(`clearSelection_${tables[activeOpenedTable].uid}`);
            tables[activeOpenedTable].destroy();

            activeOpenedTable = false;

            $("#" + TABLE_VIEW_CONTAINER_ID).animate({
                bottom: "-100%"
            }, 500, function () {
                $(`#` + TABLE_VIEW_CONTAINER_ID).find(".expand-less").show();
                $(`#` + TABLE_VIEW_CONTAINER_ID).find(".expand-more").hide();
            });
        });
    },

    statisticsHandler: (statistics, forceLayerUpdate, skipLastStatisticsCheck) => {
        if (layerTreeWasBuilt === false || _self.isReady() == false) {
            return;
        } else {
            queueStatistsics.processStatisticsUpdate(statistics, forceLayerUpdate, skipLastStatisticsCheck, userPreferredForceOfflineMode, apiBridgeInstance);
        }
    },

    setSelectorValue: (name, type) => {
        let el = $('*[data-gc2-id="' + name.replace('v:', '') + '"]');
        if (type === 'tile') {
            el.data('gc2-layer-type', 'tile');
            el.closest('.layer-item').find('.js-dropdown-label').first().html(tileLayerIcon);
        } else if (type === 'vector') {
            el.data('gc2-layer-type', 'vector');
            el.closest('.layer-item').find('.js-dropdown-label').first().html(vectorLayerIcon);
        } else {
            throw new Error('Invalid type was provided');
        }
    },


    /**
     * Returns layers order in corresponding groups
     * 
     * @return {Promise}
     */
    getLayersOrder: () => {
        let result = new Promise((resolve, reject) => {
            state.getModuleState(MODULE_NAME).then(initialState => {
                let order = ((initialState && `order` in initialState) ? initialState.order : false);
                resolve(order);
            });
        });

        return result;
    },

    /**
     * Returns last available layers order
     * 
     * @return {Promise}
     */
    getLatestLayersOrder: () => {
        return layerTreeOrder;
    },

    isReady: () => {
        return layerTreeIsReady;
    },

    _createToggleOfflineModeControl() {
        let toggleOfllineOnlineMode = $(markupGeneratorInstance.getToggleOfflineModeSelectorDisabled());
        if (`serviceWorker` in navigator) {
            toggleOfllineOnlineMode = $(markupGeneratorInstance.getToggleOfflineModeSelectorEnabled());

            if (apiBridgeInstance.offlineModeIsEnforced()) {
                $(toggleOfllineOnlineMode).find('.js-toggle-offline-mode').prop('checked', true);
            }

            $(toggleOfllineOnlineMode).find('.js-toggle-offline-mode').change(event => {
                if ($(event.target).is(':checked')) {
                    apiBridgeInstance.setOfflineMode(true);
                } else {
                    apiBridgeInstance.setOfflineMode(false);
                }

                userPreferredForceOfflineMode = $(event.target).is(':checked');
            });
        }

        return toggleOfllineOnlineMode;
    },

    /**
     * Creating request for building the tree.
     * In order to avoid race condition as simultaneous calling of run() the pending create()
     * requests are performed one by one.
     */
    create: (forcedState = false) => {
        if (LOG) console.log(`${MODULE_NAME}: create`, treeIsBeingBuilt, forcedState);

        queueStatistsics.setLastStatistics(false);

        let result = false;
        if (treeIsBeingBuilt) {
            result = new Promise((resolve, reject) => {
                console.trace(`async`);
                console.error(`Asynchronous layerTree.create() attempt`);
                reject();
            });
        } else {
            layerTreeWasBuilt = true;
            treeIsBeingBuilt = true;
            result = new Promise((resolve, reject) => {

                try {

                if (LOG) console.log(`${MODULE_NAME}: started building the tree`);

                /*
                    Some layers are already shown, so they need to be checked in order
                    to stay in tune with the map. Those are different from the activeLayers,
                    which are defined externally via forcedState only.
                */
                let precheckedLayers = layers.getMapLayers();

                if (LOG) console.log(`${MODULE_NAME}: precheckedLayers`, precheckedLayers);

                layerTreeIsReady = false;
                if (forcedState) {
                    if (LOG) console.log(`${MODULE_NAME}: disabling active layers`, _self.getActiveLayers());
                    _self.getActiveLayers().map(item => {
                        switchLayer.init(item, false, true, false);
                    });
                }

                // Emptying the tree
                $("#layers").empty();

                _self.getLayersOrder().then(order => {

                    try {

                    if (order && layerSortingInstance.validateOrderObject(order) === false) {
                        console.error(`Invalid order object`, order);
                        order = false;
                    }

                    let activeLayers = [];
                    let layersThatAreNotInMeta = [];
                    if (forcedState) {
                        if (forcedState.order && layerSortingInstance.validateOrderObject(forcedState.order) === false) {
                            console.error(forcedState.order);
                            throw new Error(`The provided order object in forced layerTree state is invalid`);
                        }

                        order = forcedState.order;
                        if (`activeLayers` in forcedState) {
                            activeLayers = forcedState.activeLayers;
                        }

                        let existingMeta = meta.getMetaData();
                        if (`data` in existingMeta) {
                            activeLayers.map(layerName => {
                                let correspondingMeta = meta.getMetaByKey(layerName.replace(`v:`, ``), false);
                                if (correspondingMeta === false) {
                                    layersThatAreNotInMeta.push(layerName.replace(`v:`, ``));
                                }
                            });
                        }

                        if (LOG) console.log(`${MODULE_NAME}: layers that are not in meta`, layersThatAreNotInMeta);
                    }

                    if (LOG) console.log(`${MODULE_NAME}: activeLayers`, activeLayers);
                    const proceedWithBuilding = () => {
                        layerTreeOrder = order;
                        if (editingIsEnabled) {
                            let toggleOfllineOnlineMode = _self._createToggleOfflineModeControl();
                            if (toggleOfllineOnlineMode) {
                                $("#layers").append(toggleOfllineOnlineMode);
                            }
                        }

                        let groups = [];

                        // Getting set of all loaded vectors
                        let metaData = meta.getMetaData();
                        for (let i = 0; i < metaData.data.length; ++i) {
                            groups[i] = metaData.data[i].layergroup;
                        }

                        let notSortedGroupsArray = array_unique(groups.reverse());
                        metaData.data.reverse();

                        let arr = notSortedGroupsArray;
                        if (order) {
                            arr = layerSortingInstance.sortGroups(order, notSortedGroupsArray);
                        }

                        $("#layers").append(`<div id="layers_list"></div>`);
                        // Filling up groups and underlying layers (except ungrouped ones)
                        for (let i = 0; i < arr.length; ++i) {
                            if (arr[i] && arr[i] !== "<font color='red'>[Ungrouped]</font>") {
                                _self.createGroupRecord(arr[i], order, forcedState, precheckedLayers);
                            }
                        }

                        $(`#layers_list`).sortable({
                            axis: 'y',
                            stop: (event, ui) => {
                                _self.calculateOrder();
                                backboneEvents.get().trigger(`${MODULE_NAME}:sorted`);
                                layers.reorderLayers();
                            }
                        });

                        if (queueStatistsics.getLastStatistics()) {
                            _self.statisticsHandler(queueStatistsics.getLastStatistics(), false, true);
                        }

                        layers.reorderLayers();
                        state.listen(MODULE_NAME, `sorted`);
                        state.listen(MODULE_NAME, `activeLayersChange`);
                        state.listen(MODULE_NAME, `filtersChange`);
                        
                        backboneEvents.get().trigger(`${MODULE_NAME}:sorted`);
                        setTimeout(() => {
                            if (LOG) console.log(`${MODULE_NAME}: active layers`, activeLayers);

                            if (activeLayers) {   
                                activeLayers.map(layerName => {
                                    if ($(`[data-gc2-layer-key="${layerName.replace('v:', '')}.the_geom"]`).find(`.js-layer-type-selector-tile`).length === 1 &&
                                        $(`[data-gc2-layer-key="${layerName.replace('v:', '')}.the_geom"]`).find(`.js-layer-type-selector-vector`).length === 1) {
                                        if (layerName.indexOf(`v:`) === 0) {
                                            $(`[data-gc2-layer-key="${layerName.replace('v:', '')}.the_geom"]`).find(`.js-layer-type-selector-vector`).trigger(`click`, [{doNotLegend: true}]);
                                        } else {
                                            $(`[data-gc2-layer-key="${layerName.replace('v:', '')}.the_geom"]`).find(`.js-layer-type-selector-tile`).trigger(`click`, [{doNotLegend: true}]);
                                        }
                                    } else {
                                        $(`#layers`).find(`input[data-gc2-id="${layerName.replace('v:', '')}"]`).trigger('click', [{doNotLegend: true}]);
                                    }
                                });

                                legend.init();
                            }

                            layerTreeIsReady = true;
                            treeIsBeingBuilt = false;
                            backboneEvents.get().trigger(`${MODULE_NAME}:ready`);
                            backboneEvents.get().trigger(`${MODULE_NAME}:activeLayersChange`);

                            if (LOG) console.log(`${MODULE_NAME}: finished building the tree`);

                            resolve();
                        }, 1000);
                    }

                    if (layersThatAreNotInMeta.length > 0) {
                        let fetchMetaRequests = [];
                        layersThatAreNotInMeta.map(item => {
                            fetchMetaRequests.push(meta.init(item ,true, true))
                        });

                        Promise.all(fetchMetaRequests).then(() => {
                            proceedWithBuilding();
                        });
                    } else {
                        proceedWithBuilding();
                    }

                }catch(e) {
                    console.log(e);
                }

                });

            }catch(e) {
                console.log(e);
            }


            });

        }

        return result;
    },

    /**
     * Returns the current building state of the tree
     * 
     * @returns {Boolean}
     */
    isBeingBuilt: () => {
        return treeIsBeingBuilt;
    },

    /**
     * Creates SQL store for vector layers
     * 
     * @param {Object} layer Layer description
     * 
     * @return {void}
     */
    createStore: (layer) => {
        let layerKey = layer.f_table_schema + '.' + layer.f_table_name;
        let whereClause = false;
        if (layerKey in vectorFilters) {
            let conditions = _self.getFilterConditions(layerKey);
            if (conditions.length > 0) {
                if (vectorFilters[layerKey].match === `any`) {
                    whereClause = conditions.join(` OR `);
                } else if (vectorFilters[layerKey].match === `all`) {
                    whereClause = conditions.join(` AND `);
                } else {
                    throw new Error(`Invalid match type value`);
                }
            }

            $(`[data-gc2-layer-key="${layerKey + `.` + layer.f_geometry_column}"]`).find(`.js-toggle-filters-number-of-filters`).text(conditions.length);
        }

        let sql = `SELECT * FROM ${layerKey} LIMIT ${SQL_QUERY_LIMIT}`;
        if (whereClause) sql = `SELECT * FROM ${layerKey} WHERE (${whereClause}) LIMIT ${SQL_QUERY_LIMIT}`;

        stores['v:' + layerKey] = new geocloud.sqlStore({
            jsonp: false,
            method: "POST",
            host: "",
            db: db,
            uri: "/api/sql",
            clickable: true,
            id: 'v:' + layerKey,
            name: 'v:' + layerKey,
            lifetime: 0,
            styleMap: styles['v:' + layerKey],
            sql: sql,
            onLoad: (l) => {
                if (l === undefined) return;

                let tableId = `table_view_${layerKey.replace(`.`, `_`)}`;
                if ($(`#${tableId}_container`).length > 0) $(`#${tableId}_container`).remove();
                $(`#` + TABLE_VIEW_FORM_CONTAINER_ID).append(`<div class="js-table-view-container" id="${tableId}_container">
                    <table id="${tableId}"></table>
                </div>`);
                var defaultTemplate = `<div class="cartodb-popup-content">
                <div class="form-group gc2-edit-tools" style="visibility: hidden">
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

                let metaDataKeys = meta.getMetaDataKeys();
                let template = (typeof metaDataKeys[layerKey].infowindow !== "undefined"
                    && metaDataKeys[layerKey].infowindow.template !== "")
                    ? metaDataKeys[layerKey].infowindow.template : defaultTemplate;
                let tableHeaders = sqlQuery.prepareDataForTableView(`v:` + layerKey, l.geoJSON.features);

                let localTable = gc2table.init({
                    el: `#` + tableId,
                    geocloud2: cloud.get(),
                    store: stores[`v:` + layerKey],
                    cm: tableHeaders,
                    autoUpdate: false,
                    autoPan: false,
                    openPopUp: true,
                    setViewOnSelect: true,
                    responsive: false,
                    callCustomOnload: true,
                    assignFeatureEventListenersOnDataLoad: false,
                    height: 400,
                    locale: window._vidiLocale.replace("_", "-"),
                    template: template,
                    usingCartodb: false
                });

                localTable.loadDataInTable(true);

                tables[`v:` + layerKey] = localTable;

                $('*[data-gc2-id-vec="' + l.id + '"]').parent().siblings().children().removeClass("fa-spin");

                layers.decrementCountLoading(l.id);
                backboneEvents.get().trigger("doneLoading:layers", l.id);
            },
            transformResponse: (response, id) => {
                return apiBridgeInstance.transformResponseHandler(response, id);
            },
            onEachFeature: (feature, layer) => {
                if (('v:' + layerKey) in onEachFeature) {
                    if (onEachFeature['v:' + layerKey].caller === `editor`) {
                        layer.on("click", function (e) {
                            let value = layerKey;
                            let metaDataKeys = meta.getMetaDataKeys();
                            if (!metaDataKeys[value]) {
                                throw new Error(`metaDataKeys[${value}] is undefined`);
                            }

                            var isEmpty = true;
                            var srid = metaDataKeys[value].srid;
                            var geoType = metaDataKeys[value].type;
                            var layerTitel = (metaDataKeys[value].f_table_title !== null && metaDataKeys[value].f_table_title !== "") ? metaDataKeys[value].f_table_title : metaDataKeys[value].f_table_name;
                            var versioning = metaDataKeys[value].versioning;
                            var fields = typeof metaDataKeys[value].fields !== "undefined" ? metaDataKeys[value].fields : null;

                            /**
                             * A default template for GC2, with a loop
                             * @type {string}
                             */
                            var defaultTemplate = `<div class="cartodb-popup-content">
                                <div class="form-group gc2-edit-tools" style="visibility: hidden">
                                    <button class="btn btn-primary btn-xs popup-edit-btn">
                                        <i class="fa fa-pencil-alt" aria-hidden="true"></i>
                                    </button>
                                    <button class="btn btn-primary btn-xs popup-delete-btn">
                                        <i class="fa fa-trash" aria-hidden="true"></i>
                                    </button>
                                </div>
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

                            var _table = gc2table.init({
                                geocloud2: cloud.get(),
                                store: stores[`v:` + layerKey],
                                autoUpdate: false,
                                autoPan: false,
                                openPopUp: true,
                                setViewOnSelect: true,
                                responsive: false,
                                callCustomOnload: false,
                                height: 400,
                                locale: window._vidiLocale.replace("_", "-"),
                                template: defaultTemplate,
                            });

                            /*
                            _table.object.on("openpopup" + "_" + _table.uid, function (e) {
                                let layerIsEditable = false;
                                if (metaDataKeys[value].meta) {
                                    let parsedMeta = JSON.parse(metaDataKeys[value].meta);
                                    if (parsedMeta && typeof parsedMeta === `object`) {
                                        if (`vidi_layer_editable` in parsedMeta && parsedMeta.vidi_layer_editable) {
                                            layerIsEditable = true;
                                        }
                                    }
                                }

                                if (editingIsEnabled && layerIsEditable) {
                                    $(".popup-edit-btn").show();
                                    $(".popup-delete-btn").show();
                                } else {
                                    $(".popup-edit-btn").hide();
                                    $(".popup-delete-btn").hide();
                                }

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
                            });
                            */














                            /*
                            e.originalEvent.clickedOnFeature = true;
    
                            let managePopup = L.popup({
                                autoPan: false
                            }).setLatLng(e.latlng).setContent(`<button class="btn btn-primary btn-xs ge-start-edit">
                                <i class="fa fa-pencil-alt" aria-hidden="true"></i>
                            </button>
                            <button class="btn btn-primary btn-xs ge-delete">
                                <i class="fa fa-trash" aria-hidden="true"></i>
                            </button>`).openOn(cloud.get().map);
    
                            $(".ge-start-edit").unbind("click.ge-start-edit").bind("click.ge-start-edit", function () {
                                editor.edit(layer, layerKey + ".the_geom", null, true);
                            });
    
                            $(".ge-delete").unbind("click.ge-delete").bind("click.ge-delete", (e) => {
                                if (window.confirm("Are you sure? Changes will not be saved!")) {
                                    editor.delete(layer, layerKey + ".the_geom", null, true);
                                }
                            });
                            */
                        });
                    }

                    onEachFeature['v:' + layerKey].fn(feature, layer);
                }
            }
        });
    },

    /**
     * Extracts valid conditions for specified layer
     * 
     * @param {String} layerKey Vector layer identifier
     */
    getFilterConditions(layerKey) {
        let layer = meta.getMetaByKey(layerKey);

        let conditions = [];
        if (layerKey in vectorFilters) {
            vectorFilters[layerKey].columns.map((column, index) => {
                if (column.fieldname && column.value) {
                    for (let key in layer.fields) {
                        if (key === column.fieldname) {
                            switch (layer.fields[key].type) {
                                case `boolean`:
                                    if (EXPRESSIONS_FOR_BOOLEANS.indexOf(column.expression) === -1) {
                                        throw new Error(`Unable to apply ${column.expression} expression to ${column.fieldname} (${layer.fields[key].type} type)`);
                                    }

                                    let value = `NULL`;
                                    if (column.value === `true`) value = `TRUE`;
                                    if (column.value === `false`) value = `FALSE`;

                                    conditions.push(`${column.fieldname} ${column.expression} ${value}`);
                                    break;
                                case `date`:
                                    if (EXPRESSIONS_FOR_DATES.indexOf(column.expression) === -1) {
                                        throw new Error(`Unable to apply ${column.expression} expression to ${column.fieldname} (${layer.fields[key].type} type)`);
                                    }

                                    conditions.push(`${column.fieldname} ${column.expression} '${column.value}'`);
                                    break;
                                case `string`:
                                case `character varying`:
                                    if (EXPRESSIONS_FOR_STRINGS.indexOf(column.expression) === -1) {
                                        throw new Error(`Unable to apply ${column.expression} expression to ${column.fieldname} (${layer.fields[key].type} type)`);
                                    }

                                    if (column.expression === 'like') {
                                        conditions.push(`${column.fieldname} ${column.expression} '%${column.value}%'`);
                                    } else {
                                        conditions.push(`${column.fieldname} ${column.expression} '${column.value}'`);
                                    }
                                    
                                    break;
                                case `integer`:
                                case `double precision`:
                                    if (EXPRESSIONS_FOR_NUMBERS.indexOf(column.expression) === -1) {
                                        throw new Error(`Unable to apply ${column.expression} expression to ${column.fieldname} (${layer.fields[key].type} type)`);
                                    }

                                    conditions.push(`${column.fieldname} ${column.expression} ${column.value}`);
                                    break;
                                default:
                                    console.error(`Unable to process filter with type '${layer.fields[key].type}'`);
                            }
                        }
                    }
                }
            });
        }

        return conditions;
    },

    /**
     * Generates single layer group control
     * 
     * @returns {void}
     */
    createGroupRecord: (groupName, order, forcedState, precheckedLayers) => {
        let metaData = meta.getMetaData();
        let numberOfActiveLayers = 0;        
        let base64GroupName = Base64.encode(groupName).replace(/=/g, "");

        // Add group container
        // Only if container doesn't exist
        // ===============================
        if ($("#layer-panel-" + base64GroupName).length === 0) {
            $("#layers_list").append(markupGeneratorInstance.getGroupPanel(base64GroupName, groupName));

            // Append to inner group container
            // ===============================
            $("#group-" + base64GroupName).append(`<div id="collapse${base64GroupName}" class="accordion-body collapse"></div>`);
        }

        // Get layers and subgroups that belong to the current layer group
        let notSortedLayersAndSubgroupsForCurrentGroup = [];
        for (let u = 0; u < metaData.data.length; ++u) {
            if (metaData.data[u].layergroup == groupName) {
                let layer = metaData.data[u];

                if (layer.meta) {
                    let parsedMeta = false;
                    try {
                        parsedMeta = JSON.parse(layer.meta);
                    } catch (e) {
                        console.log(e);
                    }

                    if (parsedMeta && typeof parsedMeta === 'object' && `vidi_sub_group` in parsedMeta) {
                        layer.subGroup = parsedMeta[`vidi_sub_group`];
                    } else {
                        layer.subGroup = false;
                    }
                }

                if (layer.subGroup) {
                    let subGroupIndex = false;
                    notSortedLayersAndSubgroupsForCurrentGroup.map((item, index) => {
                        if (item.type === GROUP_CHILD_TYPE_GROUP && item.id === layer.subGroup) {
                            subGroupIndex = index;
                            return false;
                        }
                    });

                    // Group does not exist
                    if (subGroupIndex === false) {
                        notSortedLayersAndSubgroupsForCurrentGroup.push({
                            id: layer.subGroup,
                            type: GROUP_CHILD_TYPE_GROUP,
                            children: [layer]
                        });
                    } else {
                        notSortedLayersAndSubgroupsForCurrentGroup[subGroupIndex].children.push(layer);
                    }
                } else {
                    notSortedLayersAndSubgroupsForCurrentGroup.push({
                        type: GROUP_CHILD_TYPE_LAYER,
                        layer
                    });
                }
            }
        }

        let layersAndSubgroupsForCurrentGroup = layerSortingInstance.sortLayers(order, notSortedLayersAndSubgroupsForCurrentGroup, groupName);

        // Add layers and subgroups
        let numberOfAddedLayers = 0;
        for (var u = 0; u < layersAndSubgroupsForCurrentGroup.length; ++u) {
            let localItem = layersAndSubgroupsForCurrentGroup[u];
            if (localItem.type === GROUP_CHILD_TYPE_LAYER) {
                let { layerIsActive, activeLayerName } = _self.checkIfLayerIsActive(forcedState, precheckedLayers, localItem.layer);
                if (layerIsActive) {
                    numberOfActiveLayers++;
                }

                _self.createLayerRecord(localItem.layer, forcedState, precheckedLayers, base64GroupName, layerIsActive, activeLayerName);
                numberOfAddedLayers++;
            } else if (localItem.type === GROUP_CHILD_TYPE_GROUP) {
                let { activeLayers, addedLayers } = _self.createSubgroupRecord(localItem, forcedState, precheckedLayers, base64GroupName)
                numberOfActiveLayers = (numberOfActiveLayers + activeLayers);
                numberOfAddedLayers = (numberOfAddedLayers + addedLayers);
            } else {
                throw new Error(`Invalid sorting element type`);
            }
        }

        $("#collapse" + base64GroupName).sortable({
            axis: 'y',
            stop: (event, ui) => {
                _self.calculateOrder();
                backboneEvents.get().trigger(`${MODULE_NAME}:sorted`);
                layers.reorderLayers();
            }
        });
        
        let count = 0;
        if (!isNaN(parseInt($($("#layer-panel-" + base64GroupName + " .layer-count span")[1]).html()))) {
            count = parseInt($($("#layer-panel-" + base64GroupName + " .layer-count span")[1]).html()) + numberOfAddedLayers;
        } else {
            count = numberOfAddedLayers;
        }

        $("#layer-panel-" + base64GroupName + " span:eq(1)").html(count);
        // Remove the group if empty
        if (numberOfAddedLayers === 0) {
            $("#layer-panel-" + base64GroupName).remove();
        }

        if (numberOfActiveLayers > 0) {
            $("#layer-panel-" + base64GroupName + " span:eq(0)").html(numberOfActiveLayers);
        }
    },

    checkIfLayerIsActive: (forcedState, precheckedLayers, localItem) => {
        if (!localItem) {
            throw new Error(`Layer meta object is empty`);
        }

        let layerIsActive = false;
        let activeLayerName = false;
        
        // If activeLayers are set, then no need to sync with the map
        if (!forcedState) {
            if (precheckedLayers && Array.isArray(precheckedLayers)) {
                precheckedLayers.map(item => {
                    if (item.id && item.id === `${localItem.f_table_schema}.${localItem.f_table_name}`
                        || item.id && item.id === `v:${localItem.f_table_schema}.${localItem.f_table_name}`) {
                        layerIsActive = true;
                        activeLayerName = item.id;
                    }
                });
            }
        }

        return { layerIsActive, activeLayerName }
    },

    /**
     * Generates single subgroup control
     * 
     * @returns {Object}
     */
    createSubgroupRecord: (subgroup, forcedState, precheckedLayers, base64GroupName) => {
        let addedLayers = 0, activeLayers = 0;

        let base64SubgroupName = Base64.encode(`subgroup_${subgroup}`);
        let markup = markupGeneratorInstance.getSubgroupControlRecord(base64SubgroupName, subgroup.id);
        $("#collapse" + base64GroupName).append(markup);
        $("#collapse" + base64GroupName).find(`[data-gc2-subgroup-id="${subgroup.id}"]`).find(`.js-subgroup-id`).append(`<div>
            <p>
                <button type="button" class="btn btn-default btn-xs js-subgroup-toggle-button">
                    <i class="fa fa-arrow-down"></i>
                </button>
                ${subgroup.id}
            </p>
        </div>`);

        $("#collapse" + base64GroupName).find(`[data-gc2-subgroup-id="${subgroup.id}"]`).find(`.js-subgroup-toggle-button`).click((event) => {
            let subgroupRootElement = $(event.target).closest(`[data-gc2-subgroup-id]`);
            if (subgroupRootElement.find(`.js-subgroup-children`).is(`:visible`)) {
                subgroupRootElement.find(`.js-subgroup-toggle-button`).html(`<i class="fa fa-arrow-down"></i>`);
                subgroupRootElement.find(`.js-subgroup-children`).hide();
            } else {
                subgroupRootElement.find(`.js-subgroup-toggle-button`).html(`<i class="fa fa-arrow-up"></i>`);
                subgroupRootElement.find(`.js-subgroup-children`).show();
            }
        });

        $("#collapse" + base64GroupName).find(`[data-gc2-subgroup-id="${subgroup.id}"]`).find(`.js-subgroup-children`).hide();
        
        subgroup.children.map(child => {
            // For now expecting nothing but regular layers
            let { layerIsActive, activeLayerName } = _self.checkIfLayerIsActive(forcedState, precheckedLayers, child);
            if (layerIsActive) {
                activeLayers++;
            }
    
            _self.createLayerRecord(child, forcedState, precheckedLayers, base64GroupName, layerIsActive, activeLayerName, subgroup.id, base64SubgroupName);
            addedLayers++;           
        });

        $(`#` + base64SubgroupName).sortable({
            axis: 'y',
            stop: (event, ui) => {
                _self.calculateOrder();
                backboneEvents.get().trigger(`${MODULE_NAME}:sorted`);
                layers.reorderLayers();
            }
        });

        return { addedLayers, activeLayers };
    },

    /**
     * Generates single layer control
     * 
     * @returns {void}
     */
    createLayerRecord: (layer, forcedState, precheckedLayers, base64GroupName, layerIsActive, activeLayerName, subgroupId = false, base64SubgroupName = false) => {
        let displayInfo;
        let text = (layer.f_table_title === null || layer.f_table_title === "") ? layer.f_table_name : layer.f_table_title;

        if (layer.baselayer) {
            $("#base-layer-list").append(`<div class='list-group-item'>
                <div class='row-action-primary radio radio-primary base-layer-item' data-gc2-base-id='${layer.f_table_schema}.${layer.f_table_name}'>
                    <label class='baselayer-label'>
                        <input type='radio' name='baselayers'>${text}<span class='fa fa-check' aria-hidden='true'></span>
                    </label>
                </div>
            </div>`);
        } else {
            let layerIsTheTileOne = true;
            let layerIsTheVectorOne = false;
                                        
            let singleTypeLayer = true;
            let selectorLabel = tileLayerIcon;
            let defaultLayerType = 'tile';

            let layerIsEditable = false;
            if (layer && layer.meta) {
                let parsedMeta = JSON.parse(layer.meta);
                if (parsedMeta && typeof parsedMeta === `object`) {
                    if (`vidi_layer_editable` in parsedMeta && parsedMeta.vidi_layer_editable) {
                        layerIsEditable = true;
                    }

                    if (`meta_desc` in parsedMeta) {
                        displayInfo = (parsedMeta.meta_desc || layer.f_table_abstract) ? "visible" : "hidden";
                    }

                    if (`vidi_layer_type` in parsedMeta && ['v', 'tv', 'vt'].indexOf(parsedMeta.vidi_layer_type) !== -1) {
                        layerIsTheVectorOne = true;
                        singleTypeLayer = false;

                        if (parsedMeta.vidi_layer_type === 'v') {
                            defaultLayerType = 'vector';
                            selectorLabel = vectorLayerIcon;
                            singleTypeLayer = true;
                            layerIsTheTileOne = false;
                        }
                    }
                }
            }

            if (layerIsActive) {
                if (activeLayerName.indexOf(`v:`) === 0) {
                    selectorLabel = vectorLayerIcon;
                    defaultLayerType = 'vector';
                }
            }

            let layerKey = layer.f_table_schema + "." + layer.f_table_name;
            let layerKeyWithGeom = layerKey + "." + layer.f_geometry_column;

            if (layerIsTheVectorOne) {
                _self.createStore(layer);
            }

            let lockedLayer = (layer.authentication === "Read/write" ? " <i class=\"fa fa-lock gc2-session-lock\" aria-hidden=\"true\"></i>" : "");

            let layerTypeSelector = false;
            if (singleTypeLayer) {
                if (layerIsTheTileOne) {
                    layerTypeSelector = `<div style="display: inline-block; vertical-align: middle;">
                        ${tileLayerIcon}
                    </div>`;
                } else if (layerIsTheVectorOne) {
                    layerTypeSelector = `<div style="display: inline-block; vertical-align: middle;">
                        ${vectorLayerIcon}
                    </div>`;
                }
            } else {
                layerTypeSelector = markupGeneratorInstance.getLayerTypeSelector(selectorLabel, tileLayerIcon, vectorLayerIcon);
            }

            let addButton = ``;
            if (editingIsEnabled && layerIsEditable) {
                addButton = markupGeneratorInstance.getAddButton(layerKeyWithGeom);
            }

            let layerControlRecord = $(markupGeneratorInstance.getLayerControlRecord(layerKeyWithGeom, layerKey, layerIsActive,
                layer, defaultLayerType, layerTypeSelector, text, lockedLayer, addButton, displayInfo));

            $(layerControlRecord).find('.js-layer-type-selector-tile').first().on('click', (e, data) => {
                let switcher = $(e.target).closest('.layer-item').find('.js-show-layer-control');
                $(switcher).data('gc2-layer-type', 'tile');
                $(switcher).prop('checked', true);

                $(`[data-gc2-layer-key="${layerKeyWithGeom}"]`).find(`.js-toggle-filters`).hide();
                $(`[data-gc2-layer-key="${layerKeyWithGeom}"]`).find(`.js-toggle-table-view`).hide();
                $(`[data-gc2-layer-key="${layerKeyWithGeom}"]`).find(`.js-toggle-layer-offline-mode-container`).hide();

                $(`[data-gc2-layer-key="${layerKeyWithGeom}"]`).find('.js-layer-settings').hide(0);

                _self.reloadLayer($(switcher).data('gc2-id'), false, (data ? data.doNotLegend : false));
                $(e.target).closest('.layer-item').find('.js-dropdown-label').html(tileLayerIcon);
                backboneEvents.get().trigger(`${MODULE_NAME}:activeLayersChange`);
            });

            $(layerControlRecord).find('.js-layer-type-selector-vector').first().on('click', (e, data) => {
                let switcher = $(e.target).closest('.layer-item').find('.js-show-layer-control');
                $(switcher).data('gc2-layer-type', 'vector');
                $(switcher).prop('checked', true);

                $(`[data-gc2-layer-key="${layerKeyWithGeom}"]`).find(`.js-toggle-filters`).show();
                $(`[data-gc2-layer-key="${layerKeyWithGeom}"]`).find(`.js-toggle-table-view`).show();
                $(`[data-gc2-layer-key="${layerKeyWithGeom}"]`).find(`.js-toggle-layer-offline-mode-container`).show();

                _self.reloadLayer('v:' + $(switcher).data('gc2-id'), false, (data ? data.doNotLegend : false));
                $(e.target).closest('.layer-item').find('.js-dropdown-label').html(vectorLayerIcon);
                backboneEvents.get().trigger(`${MODULE_NAME}:activeLayersChange`);
            });

            if (base64SubgroupName) {
                $(`[data-gc2-subgroup-id="${subgroupId}"]`).find(`.js-subgroup-children`).append(layerControlRecord);
            } else {
                $("#collapse" + base64GroupName).append(layerControlRecord);
            }

            // Filtering is available only for vector layers
            if (layerIsTheVectorOne) {
                let componentContainerId = `layer-settings-filters-${layerKey}`;
                $(`[data-gc2-layer-key="${layerKeyWithGeom}"]`).find('.js-layer-settings').append(`<div id="${componentContainerId}" style="padding-left: 15px; padding-right: 10px; padding-bottom: 10px;"></div>`);
        
                let conditions = _self.getFilterConditions(layerKey);
                $(`[data-gc2-layer-key="${layerKeyWithGeom}"]`).find(`.js-toggle-filters-number-of-filters`).text(conditions.length);
                let filters = {};
                if (layerKey in vectorFilters) {
                    filters = vectorFilters[layerKey];
                }

                if (document.getElementById(componentContainerId)) {                   
                    ReactDOM.render(<LayerFilter layer={layer} filters={filters} onApply={_self.onApplyFiltersHandler}/>, document.getElementById(componentContainerId));
                    $(`[data-gc2-layer-key="${layerKeyWithGeom}"]`).find('.js-layer-settings').hide(0);
        
                    $(`[data-gc2-layer-key="${layerKeyWithGeom}"]`).find(`.js-toggle-filters`).click(() => {
                        $(`[data-gc2-layer-key="${layerKeyWithGeom}"]`).find('.js-layer-settings').toggle();
                    });
                }

                // Table view
                $(`[data-gc2-layer-key="${layerKeyWithGeom}"]`).find(`.js-toggle-table-view`).click(() => {
                    if (activeOpenedTable) {
                        tables[activeOpenedTable].object.trigger(`clearSelection_${tables[activeOpenedTable].uid}`);
                        tables[activeOpenedTable].destroy();
                    }

                    activeOpenedTable = `v:` + layerKey;
                    tables[activeOpenedTable].assignEventListeners();

                    $(`.js-table-view-container`).hide();
                    $(`.js-table-view-container`).hide();
                    let tableId = `table_view_${layerKey.replace(`.`, `_`)}`;
                    if($(`#${tableId}_container`).length !== 1) throw new Error(`Unable to find the table view container`);
                    $(`#${tableId}_container`).show();

                    $("#" + TABLE_VIEW_CONTAINER_ID).animate({
                        bottom: "0"
                    }, 500, function () {
                        $(".expand-less").show();
                        $(".expand-more").hide();
                    });
                });

                // If vector layer is active, show the filtering option

                // @todo How to handle the "js-toggle-layer-offline-mode-container"?

                if (layerIsActive && defaultLayerType === `vector`) {
                    $(`[data-gc2-layer-key="${layerKeyWithGeom}"]`).find(`.js-toggle-filters`).show();
                    $(`[data-gc2-layer-key="${layerKeyWithGeom}"]`).find(`.js-toggle-table-view`).show();
                } else {
                    $(`[data-gc2-layer-key="${layerKeyWithGeom}"]`).find(`.js-toggle-filters`).hide();
                    $(`[data-gc2-layer-key="${layerKeyWithGeom}"]`).find(`.js-toggle-table-view`).hide();
                }
            } else {
                $(`[data-gc2-layer-key="${layerKeyWithGeom}"]`).find(`.js-toggle-filters`).remove();
                $(`[data-gc2-layer-key="${layerKeyWithGeom}"]`).find(`.js-toggle-table-view`).remove();
                $(`[data-gc2-layer-key="${layerKeyWithGeom}"]`).find(`.js-toggle-layer-offline-mode-container`).remove();
            }
        }
    },

    onApplyFiltersHandler: ({ layerKey, filters}) => {
        validateFilters(filters);

        let correspondingLayer = meta.getMetaByKey(layerKey);

        vectorFilters[layerKey] = filters;
        backboneEvents.get().trigger(`${MODULE_NAME}:filtersChange`);

        _self.createStore(correspondingLayer);
        _self.reloadLayer(`v:` + layerKey);
    },

    /**
     * Calculates layer order using the current markup
     * 
     * @returns {void}
     */
    calculateOrder: () => {
        layerTreeOrder = [];

        $(`[id^="layer-panel-"]`).each((index, element) => {
            let id = $(element).attr(`id`).replace(`layer-panel-`, ``);
            let children = [];

            const processLayerRecord = (layerElement) => {
                let layerKey = $(layerElement).data(`gc2-layer-key`);
                let splitLayerKey = layerKey.split('.');
                if (splitLayerKey.length !== 3) {
                    throw new Error(`Invalid layer key (${layerKey})`);
                }

                return {
                    id: `${splitLayerKey[0]}.${splitLayerKey[1]}`,
                    type: GROUP_CHILD_TYPE_LAYER
                };
            };

            $(`#${$(element).attr(`id`)}`).find(`#collapse${id}`).children().each((layerIndex, layerElement) => {
                if ($(layerElement).data(`gc2-layer-key`)) {
                    // Processing layer record
                    children.push(processLayerRecord(layerElement));
                } else if ($(layerElement).data(`gc2-subgroup-id`)) {
                    // Processing subgroup record
                    let subgroupDescription = {
                        id: $(layerElement).data(`gc2-subgroup-id`),
                        type: GROUP_CHILD_TYPE_GROUP,
                        children: []
                    };

                    $(layerElement).find(`.js-subgroup-children`).children().each((subgroupLayerIndex, subgroupLayerElement) => {
                        subgroupDescription.children.push(processLayerRecord(subgroupLayerElement));
                    });

                    children.push(subgroupDescription);
                } else {
                    throw new Error(`Unable to detect the group child element`);
                }
            });

            let readableId = atob(id);
            if (readableId) {
                layerTreeOrder.push({ id: readableId, children });
            } else {
                throw new Error(`Unable to decode the layer group identifier (${id})`);
            }
        });
    },

    /**
     * Returns current module state
     */
    getState: () => {
        let activeLayers = _self.getActiveLayers();
        let state = {
            order: layerTreeOrder,
            vectorFilters,
            activeLayers
        };

        return state;
    },

    /**
     * Applies externally provided state
     */
    applyState: (newState) => {
        // Setting vector filters
        if (newState !== false && `vectorFilters` in newState) {
            for (let key in newState.vectorFilters) {
                validateFilters(newState.vectorFilters[key]);
            }

            vectorFilters = newState.vectorFilters;
        } else {
            vectorFilters = {};
        }

        queueStatistsics.setLastStatistics(false);
        if (newState === false) {
            newState = { order: false };
        } else if (newState.order && newState.order === 'false') {
            newState.order = false;
        }

        return _self.create(newState);
    },

    /**
     * Reloading provided layer.
     * 
     * @param {String} layerId Layer identifier
     */
    reloadLayer: (layerId, forceTileRedraw = false, doNotLegend = false) => {
        switchLayer.init(layerId, false, doNotLegend, forceTileRedraw);
        switchLayer.init(layerId, true, doNotLegend, forceTileRedraw);
    },

    /**
     * Returns list of currently enabled layers
     */
    getActiveLayers: () => {
        let activeLayerIds = [];
        $('*[data-gc2-layer-type]').each((index, item) => {
            let isEnabled = $(item).is(':checked');
            if (isEnabled) {
                if ($(item).data('gc2-layer-type') === 'tile') {
                    activeLayerIds.push($(item).data('gc2-id'));
                } else {
                    activeLayerIds.push('v:' + $(item).data('gc2-id'));
                }
            }
        });

        activeLayerIds = activeLayerIds.filter((v, i, a) => { return a.indexOf(v) === i}); 
        return activeLayerIds;
    },

    /**
     * Sets the onEachFeature handler
     * 
     * @param {String}   layer  Layer name
     * @param {Function} fn     Handler
     * @param {String}   caller Name of the calling module
     */
    setOnEachFeature: function (layer, fn, caller) {
        if (!caller) throw new Error(`caller is not defined in setOnEachFeature`);
        onEachFeature[layer] = { caller, fn };
    },

    setOnLoad: function (layer, fn) {
        onLoad[layer] = fn;
    },

    setOnSelect: function (layer, fn) {
        onSelect[layer] = fn;
    },

    setOnMouseOver: function (layer, fn) {
        onMouseOver[layer] = fn;
    },

    setCM: function (layer, c) {
        cm[layer] = c;
    },

    setStyle: function (layerName, style) {
        let foundLayers = layers.getMapLayers(false, layerName);
        if (foundLayers.length === 1) {
            let layer = foundLayers[0];
            layer.options.style = style;
        }

        styles[layerName] = style;
    },

    setPointToLayer: function (layer, fn) {
        pointToLayer[layer] = fn;
    },
    
    getStores: function () {
        return stores;
    },

    load: function (id) {
        stores[id].load();
    }
};