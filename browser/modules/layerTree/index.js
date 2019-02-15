/*
 * @author     Alexander Shumilov
 * @copyright  2013-2018 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

/**
 * @fileoverview Layer tree module
 */

'use strict';

import { LOG, MODULE_NAME, VIRTUAL_LAYERS_SCHEMA, SYSTEM_FIELD_PREFIX, SQL_QUERY_LIMIT, LAYER, ICONS } from './constants';

var _self, meta, layers, sqlQuery, switchLayer, cloud, legend, state, backboneEvents;

var onEachFeature = [], pointToLayer = [], onSelectedStyle = [], onLoad = [], onSelect = [],
    onMouseOver = [], cm = [], styles = [], tables = {};

/**
 * Layer filters
 */
var React = require('react');
var ReactDOM = require('react-dom');

import moment from 'moment';
import noUiSlider from 'nouislider';

import LayerFilter from './LayerFilter';
import LoadStrategyToggle from './LoadStrategyToggle';
import {
    validateFilters,
    EXPRESSIONS_FOR_STRINGS,
    EXPRESSIONS_FOR_NUMBERS,
    EXPRESSIONS_FOR_DATES,
    EXPRESSIONS_FOR_BOOLEANS
} from './filterUtils';

/**
 *
 * @type {*|exports|module.exports}
 */
let urlparser = require('./../urlparser');

/**
 *
 * @type {*|exports|module.exports}
 */
import OfflineModeControlsManager from './OfflineModeControlsManager';
let offlineModeControlsManager = false;

/**
 *
 * @type {*|exports|module.exports}
 */
let MarkupGenerator = require('./MarkupGenerator');
let markupGeneratorInstance = new MarkupGenerator();

import {GROUP_CHILD_TYPE_LAYER, GROUP_CHILD_TYPE_GROUP, LayerSorting} from './LayerSorting';
let layerSortingInstance = new LayerSorting();

/**
 *
 * @type {*|exports|module.exports}
 */
let queueStatistsics = false;
let QueueStatisticsWatcher = require('./QueueStatisticsWatcher');

/**
 *
 * @type {*|exports|module.exports}
 */
let APIBridgeSingletone = require('./../api-bridge');

/**
 *
 * @type {*|exports|module.exports}
 */
let layerTreeUtils = require('./utils');

/**
 *
 * @type {APIBridge}
 */
var apiBridgeInstance = false;

/**
 * Specifies if layer tree is ready
 * @todo Minimize number of global variables
 */
let extensions = false, editor = false, qstore = [];

/**
 * Getting ready for React future of the layerTree by implementing single source-of-truth
 */ 
let moduleState = {
    isReady: false,
    wasBuilt: false,
    isBeingBuilt: false,
    predefinedFiltersWarningFired: false,
    editingIsEnabled: false,
    layerTreeOrder: false,
    userPreferredForceOfflineMode: -1,
    arbitraryFilters: {},
    predefinedFilters: {},
    dynamicLoad: {},
    setLayerOpacityRequests: [],
    setupLayerControlsRequests: {},
    vectorStores: [],
    virtualLayers: []
};

/**
 *
 * @type {showdown.Converter}
 */
const showdown = require('showdown');
const converter = new showdown.Converter();

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

        offlineModeControlsManager = new OfflineModeControlsManager(meta);

        return this;
    },

    init: function () {
        if (window.vidiConfig.enabledExtensions.indexOf(`editor`) !== -1) {
            moduleState.editingIsEnabled = true;
        }

        _self = this;
        queueStatistsics = new QueueStatisticsWatcher({switchLayer, offlineModeControlsManager, layerTree: _self});
        apiBridgeInstance = APIBridgeSingletone((statistics, forceLayerUpdate) => {
            _self._statisticsHandler(statistics, forceLayerUpdate);
        });

        state.listenTo('layerTree', _self);
    },

    /**
     * Returns layerTree readiness
     *
     * @returns {Boolean}
     */
    isReady: () => { return moduleState.isReady; },

    /**
     * Returns last available layers order
     *
     * @returns {Object}
     */
    getLatestLayersOrder: () => { return moduleState.layerTreeOrder; },

    /**
     * Returns vector stores
     *
     * @returns {Array}
     */
    getStores: () => { return moduleState.vectorStores; },

    /**
     * Resets search
     *
     * @returns {void}
     */
    resetSearch: function () { sqlQuery.reset(qstore); },

    /**
     * Sets the layer type selector presentation according to provided type
     * 
     * @param {String} name Layer name
     * @param {String} type Layer type
     * 
     * @returns {void}
     */
    setSelectorValue: (name, type) => {
        let el = $('*[data-gc2-id="' + layerTreeUtils.stripPrefix(name) + '"]');
        if (type === LAYER.VECTOR || type === LAYER.RASTER_TILE || type === LAYER.VECTOR_TILE || type === LAYER.WEBGL) {
            el.data('gc2-layer-type', type);
            el.closest('.layer-item').find('.js-dropdown-label').first().html(ICONS[type]);
        } else {
            throw new Error(`Invalid type was provided: ${type}`);
        }
    },

    /**
     * Returns tile filter string for specific tile layer
     * 
     * @param {String} layerKey Layer identifier
     * 
     * @returns {String}
     */
    getLayerFilterString: (layerKey) => {
        if (!layerKey || [LAYER.VECTOR + `:`, LAYER.VECTOR_TILE + `:`].indexOf(layerKey) === 0 || layerKey.indexOf(`.`) === -1) {
            throw new Error(`Invalid tile layer name ${layerKey}`);
        }

        let parameterString = ``;
        let activeFilters = _self.getActiveLayerFilters(layerKey);
        if (activeFilters.length > 0) {
            let data = {};
            data[layerKey] = activeFilters;
            parameterString = `filters=` + JSON.stringify(data);
        }

        $(`[data-gc2-layer-key^="${layerKey}"]`).find(`.js-toggle-filters-number-of-filters`).text(activeFilters.length);

        return parameterString;
    },

    /**
     * Returns list of currently enabled layers
     * 
     * @returns {Array}
     */
    getActiveLayers: () => {
        return layerTreeUtils.getActiveLayers();
    },

    /**
     * Regulates the visibility and initialization of layer type specific controls.
     *
     * @param {Boolean} desiredSetupType Layer type to setup
     * @param {String}  layerKey         Layer key
     * @param {Boolean} ignoreErrors     Specifies if errors should be ignored
     * @param {Boolean} layerIsEnabled   Specifies if layer is enabled
     * @param {Boolean} forced           Specifies if layer visibility should be ignored
     */
    setupLayerControls: (desiredSetupType, layerKey, ignoreErrors = true, layerIsEnabled = false, forced = false) => {
        layerKey = layerTreeUtils.stripPrefix(layerKey);
        let layerMeta = meta.getMetaByKey(layerKey);
        let container = $(`[data-gc2-layer-key="${layerKey}.${layerMeta.f_geometry_column}"]`);
        if (container.length === 1) {
            if ($(container).is(`:visible`) || forced) {
                let parsedMeta = meta.parseLayerMeta(layerKey);

                const hideFilters = () => {
                    $(container).find(`.js-toggle-filters`).hide(0);
                    $(container).find(`.js-toggle-filters-number-of-filters`).hide(0);
                    $(container).find('.js-layer-settings-filters').hide(0);
                };

                const hideOpacity = () => {
                    $(container).find(`.js-toggle-opacity`).hide(0);
                    $(container).find('.js-layer-settings-opacity').hide(0);
                };

                const hideLoadStrategy = () => {
                    $(container).find(`.js-toggle-load-strategy`).hide(0);
                    $(container).find('.js-layer-settings-load-strategy').hide(0);
                };

                const hideTableView = () => {
                    $(container).find(`.js-toggle-table-view`).hide(0);
                    $(container).find('.js-layer-settings-table').hide(0);
                };

                const hideOfflineMode = () => {
                    $(container).find(`.js-toggle-layer-offline-mode-container`).hide(0);
                };

                const hideSearch = () => {
                    $(container).find(`.js-toggle-search`).hide(0);
                    $(container).find('.js-layer-settings-search').hide(0);
                };

                const hideAddFeature = () => {
                    $(container).find('.gc2-add-feature').hide(0);
                };

                if (desiredSetupType === LAYER.VECTOR) {
                    hideOpacity();

                    // Toggles
                    $(container).find(`.js-toggle-layer-offline-mode-container`).show(0);
                    $(container).find(`.js-toggle-filters`).show(0);
                    $(container).find(`.js-toggle-load-strategy`).show(0);
                    $(container).find('.gc2-add-feature').show(0);

                    if (layerIsEnabled) {
                        $(container).find(`.js-toggle-table-view`).show(0);
                    } else {
                        $(container).find(`.js-toggle-table-view`).hide(0);
                        $(container).find('.js-layer-settings-filters').hide(0);
                        $(container).find('.js-layer-settings-load-strategy').hide(0);
                        $(container).find('.js-layer-settings-table').hide(0);
                    } 
                } else if (desiredSetupType === LAYER.RASTER_TILE || desiredSetupType === LAYER.VECTOR_TILE) {
                    hideOfflineMode();
                    hideTableView();
                    hideLoadStrategy();
                    hideAddFeature();

                    if (layerIsEnabled) {
                        $(container).find(`.js-toggle-opacity`).show(0);
                        $(container).find(`.js-toggle-filters`).show(0);
                        $(container).find(`.js-toggle-filters-number-of-filters`).show(0);
                    } else {
                        hideFilters();
                        hideOpacity();
                    }

                    if (parsedMeta && !parsedMeta.single_tile) {
                        hideFilters();
                    }

                    $(container).find('.js-layer-settings-filters').hide(0);
                    if (desiredSetupType === LAYER.VECTOR_TILE) {
                        hideOpacity();
                        hideFilters();
                    }
                } else {
                    throw new Error(`${desiredSetupType} control setup is not supported yet`);
                }

                // For all layer types
                hideSearch();
                if (layerIsEnabled) {
                    $(container).find(`.js-toggle-search`).show();
                } else {
                    $(container).find(`.js-toggle-search`).hide();
                    $(container).find('a').removeClass('active');

                    // Refresh all tables when closing one panel, because DOM changes can make the tables un-aligned
                    $(`.js-layer-settings-table table`).bootstrapTable('resetView');
                }
            } else {

                //console.log(`### postponing setupLayerControls`);

                if (layerKey in moduleState.setupLayerControlsRequests === false) {
                    moduleState.setupLayerControlsRequests[layerKey] = false;
                }

                moduleState.setupLayerControlsRequests[layerKey] = {
                    desiredSetupType,
                    ignoreErrors,
                    layerIsEnabled,
                    createdAt: new Date()
                };
            }
        } else if (ignoreErrors === false) {
            throw new Error(`Unable to find layer container`);
        }
    },

    /**
     * Creates virtual layer in scope of the layerTree module
     * 
     * @returns {Promise}
     */
    createVirtualLayer: (store, uncheckedItems) => {
        let result = new Promise((resolve, reject) => {
            // Taking into account unchecked items
            let query = store.sql;
            if (uncheckedItems.ids.length > 0) {
                let querySplit = query.split(`LIMIT`);

                let additionalWhereClauses = [];
                uncheckedItems.ids.map(item => {
                    additionalWhereClauses.push(`AND ${uncheckedItems.pkey} <> ${item}`);
                });

                query = querySplit[0] + ` ` + additionalWhereClauses.join(` `) + ` LIMIT` + querySplit[1];
            }

            let timestamp = new Date().getTime();
            let key = (VIRTUAL_LAYERS_SCHEMA + `.query` + timestamp);
            moduleState.virtualLayers.push({
                key,
                store: {
                    db: store.db,
                    sql: query,
                }
            });

            _self.create(false, [`virtualLayers`]).then(() => {
                _self.calculateOrder();
                backboneEvents.get().trigger(`${MODULE_NAME}:activeLayersChange`);
                resolve(key);
            });
        });

        return result;
    },

    /**
     * Returns current module state
     */
    getState: () => {
        let activeLayers = _self.getActiveLayers();
        let layersOfflineMode = offlineModeControlsManager.getOfflineModeSettings();

        let opacitySettings = {};
        for (let key in cloud.get().map._layers) {
            let layer = cloud.get().map._layers[key];
            if (`id` in layer && layer.id) {
                if (`options` in layer && layer.options && `opacity` in layer.options) {
                    if (isNaN(layer.options.opacity) === false) {
                        opacitySettings[layer.id] = layer.options.opacity;
                    }
                }
            }
        }

        let state = {
            order: moduleState.layerTreeOrder,
            arbitraryFilters: moduleState.arbitraryFilters,
            virtualLayers: moduleState.virtualLayers,
            predefinedFilters: moduleState.predefinedFilters,
            activeLayers,
            layersOfflineMode,
            opacitySettings,
            dynamicLoad: moduleState.dynamicLoad
        };

        return state;
    },

    /**
     * Applies externally provided state
     */
    applyState: (newState) => {
        // Setting vector filters
        if (newState !== false && `arbitraryFilters` in newState && typeof newState.arbitraryFilters === `object`) {
            for (let key in newState.arbitraryFilters) {
                validateFilters(newState.arbitraryFilters[key]);
            }

            moduleState.arbitraryFilters = newState.arbitraryFilters;
        } else {
            moduleState.arbitraryFilters = {};
        }

        // Setting tile filters
        if (newState !== false && `predefinedFilters` in newState && typeof newState.predefinedFilters === `array`) {
            moduleState.predefinedFilters = newState.predefinedFilters;
        } else {
            moduleState.predefinedFilters = {};
        }

        queueStatistsics.setLastStatistics(false);
        if (newState === false) {
            newState = {
                order: false,
                opacitySettings: {},
                layersOfflineMode: {},
                virtualLayers: [],
                predefinedFilters: {},
                arbitraryFilters: {}
            };
        } else if (newState.order && newState.order === 'false') {
            newState.order = false;
        }

        return _self.create(newState);
    },


    /**
     * Creating request for building the tree.
     * In order to avoid race condition as simultaneous calling of run() the pending create()
     * requests are performed one by one.
     * 
     * @param {Object} forcedState             Externally provided state of the layerTree
     * @param {Array}  ignoredInitialStateKeys Keys of the initial state that should be ignored
     * 
     * @returns {Promise}
     */
    create: (forcedState = false, ignoredInitialStateKeys = []) => {
        if (LOG) console.log(`${MODULE_NAME}: create`, moduleState.isBeingBuilt, forcedState);

        queueStatistsics.setLastStatistics(false);

        /**
         * Opacity settings needs to be applied when layer is loaded. As layer loading takes some
         * time, the application of opacity setting has to be posponed as well. The setLayerOpacityRequests
         * contains opacity settings for layers and is cleaned up on every run.
         */
        backboneEvents.get().on(`doneLoading:layers`, layerKey => {
            for (let i = (moduleState.setLayerOpacityRequests.length - 1); i >= 0; i--) {
                let item = moduleState.setLayerOpacityRequests[i];
                if (item.layerKey === layerKey) {
                    layerTreeUtils.applyOpacityToLayer(item.opacity, layerKey, cloud, backboneEvents);
                    if (i >= 1) {
                        for (let j = (i - 1); j >= 0; j--) {
                            let subItem = moduleState.setLayerOpacityRequests[j];
                            if (subItem.layerKey === layerKey) {
                                // Remove irrelevant opacity settings
                                moduleState.setLayerOpacityRequests.splice(j, 1);
                            }
                        }
                    }

                    break;
                }
            }
        });

        /**
         * Some vector layer needs to be reloaded when the map view is changed if the dynamic
         * loading is enabled for the layer.
         */
        cloud.get().on(`moveend`, () => {
            let activeLayers = _self.getActiveLayers();
            for (let layerKey in moduleState.vectorStores) {
                let layerIsEnabled = false;
                for (let i = 0; i < activeLayers.length; i++) {
                    if (layerTreeUtils.stripPrefix(activeLayers[i]) === layerTreeUtils.stripPrefix(layerKey)) {
                        layerIsEnabled = true;
                        break;
                    }
                }

                if (layerIsEnabled) {
                    let layerKeyNoPrefix = layerTreeUtils.stripPrefix(layerKey);
                    let layerDescription = meta.getMetaByKey(layerKeyNoPrefix);
                    let parsedMeta = _self.parseLayerMeta(layerDescription);

                    // Reload should always occur except times when current bbox is completely inside
                    // of the previously requested bbox (extended one in gc2cloud.js) kept in corresponding store
                    let needToReload;
                    if ((parsedMeta && `load_strategy` in parsedMeta && parsedMeta.load_strategy === `d`)
                        || (layerKeyNoPrefix in moduleState.dynamicLoad && moduleState.dynamicLoad[layerKeyNoPrefix] === true)) {
                        needToReload = true;
                        let currentMapBBox = cloud.get().map.getBounds();
                        if (`buffered_bbox` in moduleState.vectorStores[layerKey]) {
                            if (moduleState.vectorStores[layerKey].buffered_bbox === false || moduleState.vectorStores[layerKey].buffered_bbox && moduleState.vectorStores[layerKey].buffered_bbox.contains(currentMapBBox)) {
                                needToReload = false;
                            }
                        }
                    } else {
                        needToReload = false;
                    }

                    if (needToReload) {
                        moduleState.vectorStores[layerKey].abort();
                        moduleState.vectorStores[layerKey].load();
                    }
                }
            }
        });

        let result = false;
        if (moduleState.isBeingBuilt) {
            result = new Promise((resolve, reject) => {
                console.trace(`async`);
                console.error(`Asynchronous layerTree.create() attempt`);
                reject();
            });
        } else {
            moduleState.wasBuilt = true;
            moduleState.isBeingBuilt = true;
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

                    moduleState.isReady = false;
                    if (forcedState) {
                        if (LOG) console.log(`${MODULE_NAME}: disabling active layers`, _self.getActiveLayers());
                        _self.getActiveLayers().map(item => {
                            switchLayer.init(item, false, true, false);
                        });
                    }

                    // Emptying the tree
                    $("#layers").empty();
                    _self.getLayerTreeSettings().then(({order, offlineModeSettings, initialArbitraryFilters, initialDynamicLoad,
                        initialVirtualLayers, initialPredefinedFilters, opacitySettings}) => {

                        try {

                            if (moduleState.arbitraryFilters && ignoredInitialStateKeys.indexOf(`arbitraryFilters`) === -1) {
                                moduleState.arbitraryFilters = initialArbitraryFilters;
                            }

                            if (initialPredefinedFilters && ignoredInitialStateKeys.indexOf(`predefinedFilters`) === -1) {
                                moduleState.predefinedFilters = initialPredefinedFilters;
                            }
                            
                            if (initialDynamicLoad && ignoredInitialStateKeys.indexOf(`dynamicLoad`) === -1) {
                                moduleState.dynamicLoad = initialDynamicLoad;
                            }

                            if (initialVirtualLayers && ignoredInitialStateKeys.indexOf(`virtualLayers`) === -1) {
                                moduleState.virtualLayers = initialVirtualLayers;
                            }

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

                                if (`virtualLayers` in forcedState && forcedState.virtualLayers) {
                                    moduleState.virtualLayers = forcedState.virtualLayers;
                                    moduleState.virtualLayers.map(item => {
                                        let simulatedMetaData = _self.createSimulatedLayerDescriptionForVirtualLayer(item);
                                        meta.addMetaData({ data: [simulatedMetaData]});
                                    });
                                }

                                order = forcedState.order;
                                if (`activeLayers` in forcedState) {
                                    activeLayers = forcedState.activeLayers;
                                }

                                let existingMeta = meta.getMetaData();
                                if (`data` in existingMeta) {
                                    activeLayers.map(layerName => {
                                        let correspondingMeta = meta.getMetaByKey(layerTreeUtils.stripPrefix(layerName), false);
                                        if (correspondingMeta === false) {
                                            layersThatAreNotInMeta.push(layerTreeUtils.stripPrefix(layerName));
                                        }
                                    });
                                }

                                offlineModeSettings = {};
                                if (`layersOfflineMode` in forcedState) {
                                    offlineModeSettings = forcedState.layersOfflineMode;
                                    for (let key in offlineModeSettings) {
                                        if (offlineModeSettings[key] === `true` || offlineModeSettings[key] === true) {
                                            offlineModeSettings[key] = true;
                                        } else {
                                            offlineModeSettings[key] = false;
                                        }
                                    }
                                }

                                if (forcedState.opacitySettings) opacitySettings = forcedState.opacitySettings;
                                if (forcedState.predefinedFilters) moduleState.predefinedFilters = forcedState.predefinedFilters;
                                if (forcedState.arbitraryFilters) moduleState.arbitraryFilters = forcedState.arbitraryFilters;
                                if (forcedState.dynamicLoad) moduleState.dynamicLoad = forcedState.dynamicLoad;

                                if (LOG) console.log(`${MODULE_NAME}: layers that are not in meta`, layersThatAreNotInMeta);

                                backboneEvents.get().trigger(`${MODULE_NAME}:settleForcedState`);
                            }

                            for (let key in moduleState.dynamicLoad) {
                                if (moduleState.dynamicLoad[key] === `true` || moduleState.dynamicLoad[key] === true) {
                                    moduleState.dynamicLoad[key] = true;
                                } else {
                                    moduleState.dynamicLoad[key] = false;
                                }
                            }

                            if (LOG) console.log(`${MODULE_NAME}: activeLayers`, activeLayers);
                            const proceedWithBuilding = () => {
                                moduleState.layerTreeOrder = order;
                                if (moduleState.editingIsEnabled) {
                                    let toggleOfllineOnlineMode = _self._setupToggleOfflineModeControl();
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

                                if (moduleState.virtualLayers.length > 0 && arr.indexOf(__(`Virtual layers`)) === -1) {
                                    arr.push(__(`Virtual layers`));
                                }

                                if (order) {
                                    arr = layerSortingInstance.sortGroups(order, notSortedGroupsArray);
                                }

                                $("#layers").append(`<div id="layers_list"></div>`);
                                // Filling up groups and underlying layers (except ungrouped ones)
                                for (let i = 0; i < arr.length; ++i) {
                                    if (arr[i] && arr[i] !== "<font color='red'>[Ungrouped]</font>") {
                                        _self.createGroupRecord(arr[i], order, forcedState, opacitySettings, precheckedLayers);
                                    }
                                }

                                _self._setupToggleOfflineModeControlsForLayers().then(() => {


                                    // @todo Needs refactoring, turning on layers by triggering a click is bad


                                    $(`#layers_list`).sortable({
                                        axis: 'y',
                                        stop: (event, ui) => {
                                            _self.calculateOrder();
                                            backboneEvents.get().trigger(`${MODULE_NAME}:sorted`);
                                            layers.reorderLayers();
                                        }
                                    });

                                    if (queueStatistsics.getLastStatistics()) {
                                        _self._statisticsHandler(queueStatistsics.getLastStatistics(), false, true);
                                    }

                                    layers.reorderLayers();
                                    state.listen(MODULE_NAME, `sorted`);
                                    state.listen(MODULE_NAME, `layersOfflineModeChange`);
                                    state.listen(MODULE_NAME, `activeLayersChange`);
                                    state.listen(MODULE_NAME, `filtersChange`);
                                    state.listen(MODULE_NAME, `opacityChange`);
                                    state.listen(MODULE_NAME, `dynamicLoadLayersChange`);
                                    state.listen(MODULE_NAME, `settleForcedState`);

                                    backboneEvents.get().trigger(`${MODULE_NAME}:sorted`);
                                    setTimeout(() => {
                                        if (LOG) console.log(`${MODULE_NAME}: active layers`, activeLayers);

                                        const turnOnActiveLayersAndFinishBuilding = () => {
                                            return new Promise((localResolve, reject) => {
                                                if (activeLayers) {
                                                    activeLayers.map(layerName => {
                                                        let noPrefixName = layerTreeUtils.stripPrefix(layerName);
                                                        let layerMeta = meta.getMetaByKey(noPrefixName);
        
                                                        if ($(`[data-gc2-layer-key="${noPrefixName}.${layerMeta.f_geometry_column}"]`).find(`.js-layer-type-selector-tile`).length === 1 ||
                                                            $(`[data-gc2-layer-key="${noPrefixName}.${layerMeta.f_geometry_column}"]`).find(`.js-layer-type-selector-vector`).length === 1 ||
                                                            $(`[data-gc2-layer-key="${noPrefixName}.${layerMeta.f_geometry_column}"]`).find(`.js-layer-type-selector-vector-tile`).length === 1) {

                                                            if (layerName.indexOf(`${LAYER.VECTOR}:`) === 0) {
                                                                $(`[data-gc2-layer-key="${noPrefixName}.${layerMeta.f_geometry_column}"]`).find(`.js-layer-type-selector-vector`).trigger(`click`, [{doNotLegend: true}]);
                                                            } else if (layerName.indexOf(`${LAYER.VECTOR_TILE}:`) === 0) {
                                                                $(`[data-gc2-layer-key="${noPrefixName}.${layerMeta.f_geometry_column}"]`).find(`.js-layer-type-selector-vector-tile`).trigger(`click`, [{doNotLegend: true}]);
                                                            } else {
                                                                $(`[data-gc2-layer-key="${noPrefixName}.${layerMeta.f_geometry_column}"]`).find(`.js-layer-type-selector-tile`).trigger(`click`, [{doNotLegend: true}]);
                                                            }
                                                        } else {
                                                            $(`#layers`).find(`input[data-gc2-id="${noPrefixName}"]`).trigger('click', [{doNotLegend: true}]);
                                                        }
                                                    });
        
                                                    legend.init();
                                                }
        
                                                moduleState.isReady = true;
                                                moduleState.isBeingBuilt = false;
                                                backboneEvents.get().trigger(`${MODULE_NAME}:ready`);
                                                backboneEvents.get().trigger(`${MODULE_NAME}:activeLayersChange`);
        
                                                if (LOG) console.log(`${MODULE_NAME}: finished building the tree`);
        
                                                localResolve();
                                            });
                                        };

                                        const setOfflineModeSettingsForCache = () => {
                                            return new Promise((localResolve, reject) => {
                                                layerTreeUtils.queryServiceWorker({action: `getListOfCachedRequests`}).then(currentCachedRequests => {
                                                    let promisesContent = [];
                                                    if (Object.keys(offlineModeSettings).length > 0) {
                                                        layerTreeUtils.queryServiceWorker({
                                                            action: `batchSetOfflineModeForLayers`,
                                                            payload: offlineModeSettings
                                                        }).then(result => {
                                                            turnOnActiveLayersAndFinishBuilding().then(() => {
                                                                layerTreeUtils.queryServiceWorker({action: `getListOfCachedRequests`}).then((response) => {
                                                                    localResolve();
                                                                });
                                                            });
                                                        });
                                                    } else {
                                                        layerTreeUtils.queryServiceWorker({ action: `disableOfflineModeForAll` }).then(result => {
                                                            turnOnActiveLayersAndFinishBuilding().then(() => {
                                                                layerTreeUtils.queryServiceWorker({action: `getListOfCachedRequests`}).then((response) => {
                                                                    localResolve();
                                                                });
                                                            });
                                                        });
                                                    }
                                                });
                                            });
                                        };

                                        if (`serviceWorker` in navigator) {
                                            if (navigator.serviceWorker.controller) {
                                                setOfflineModeSettingsForCache().then(resolve);
                                            } else {
                                                backboneEvents.get().once(`ready:serviceWorker`, () => {
                                                    setTimeout(() => {
                                                        if (`serviceWorker` in navigator && navigator.serviceWorker.controller) {
                                                            setOfflineModeSettingsForCache().then(resolve);
                                                        } else {
                                                            turnOnActiveLayersAndFinishBuilding().then(resolve);
                                                        }
                                                    }, 1000);
                                                });
                                            }
                                        } else {
                                            turnOnActiveLayersAndFinishBuilding().then(resolve);
                                        }
                                    }, 1000);
                                });
                            }






                            if (layersThatAreNotInMeta.length > 0) {
                                let fetchMetaRequests = [];
                                layersThatAreNotInMeta.map(item => {
                                    fetchMetaRequests.push(meta.init(item, true, true))
                                });

                                Promise.all(fetchMetaRequests).then(() => {
                                    proceedWithBuilding();
                                });
                            } else {
                                proceedWithBuilding();
                            }

                        } catch (e) {
                            console.log(e);
                        }

                    });

                } catch (e) {
                    console.log(e);
                }

            });
        }

        return result;
    },


    /**
     * ----------------------------------------------------------------
     * Below are private methods that are never called from the outside
     * ----------------------------------------------------------------
     */


    _statisticsHandler: (statistics, forceLayerUpdate, skipLastStatisticsCheck) => {
        if (moduleState.wasBuilt === false || _self.isReady() == false) {
            return;
        } else {
            _self._setupToggleOfflineModeControlsForLayers().then(() => {
                queueStatistsics.processStatisticsUpdate(statistics, forceLayerUpdate, skipLastStatisticsCheck, moduleState.userPreferredForceOfflineMode, apiBridgeInstance);
            });
        }
    },

    /**
     * Returns layers order in corresponding groups
     *
     * @returns {Promise}
     */
    getLayerTreeSettings: () => {
        let result = new Promise((resolve, reject) => {
            state.getModuleState(MODULE_NAME).then(initialState => {
                let order = ((initialState && `order` in initialState) ? initialState.order : false);
                let offlineModeSettings = ((initialState && `layersOfflineMode` in initialState) ? initialState.layersOfflineMode : false);
                let initialArbitraryFilters = ((initialState && `arbitraryFilters` in initialState && typeof initialState.arbitraryFilters === `object`) ? initialState.arbitraryFilters : {});
                let initialPredefinedFilters = ((initialState && `predefinedFilters` in initialState && typeof initialState.predefinedFilters === `object`) ? initialState.predefinedFilters : {});
                let initialVirtualLayers = ((initialState && `virtualLayers` in initialState && typeof initialState.virtualLayers === `object`) ? initialState.virtualLayers : []);
                let opacitySettings = ((initialState && `opacitySettings` in initialState) ? initialState.opacitySettings : {});
                let initialDynamicLoad = ((initialState && `dynamicLoad` in initialState) ? initialState.dynamicLoad : {});
                resolve({order, offlineModeSettings, initialArbitraryFilters, initialPredefinedFilters, initialVirtualLayers, opacitySettings, initialDynamicLoad});
            });
        });

        return result;
    },

    _setupToggleOfflineModeControl() {
        /*
            @todo Implement callbacks for clicking the "Set all layers to be ..."
        */

        let toggleOfllineOnlineMode = $(markupGeneratorInstance.getToggleOfflineModeSelectorDisabled());
        if (`serviceWorker` in navigator) {
            toggleOfllineOnlineMode = $(markupGeneratorInstance.getToggleOfflineModeSelectorEnabled());
        }

        return toggleOfllineOnlineMode;
    },

    _setupToggleOfflineModeControlsForLayers() {
        return new Promise((resolve, reject) => {
            $(`.js-toggle-layer-offline-mode-container`).find(`button`).prop(`disabled`, true);
            if (`serviceWorker` in navigator && navigator.serviceWorker.controller) {
                navigator.serviceWorker.getRegistrations().then(registrations => {
                    if (registrations.length === 1 && registrations[0].active !== null) {
                        layerTreeUtils.queryServiceWorker({action: `getListOfCachedRequests`}).then(response => {
                            if (Array.isArray(response)) {
                                offlineModeControlsManager.setCachedLayers(response).then(() => {
                                    offlineModeControlsManager.updateControls().then(() => {
                                        resolve();
                                    });
                                });
                            } else {
                                resolve();
                            }
                        });
                    } else {
                        resolve();
                    }
                });
            } else {
                resolve();
            }
        });
    },

    /**
     * Checks if the offline mode settings for vector layers do not conflict with the service worker cache. If
     * there is a conflict, it is better to silently remove the conflicting offline mode settings, either
     * explain user that his service worker cache for specific layer does not exist.
     *
     * @returns {Promise}
     */
    _applyOfflineModeSettings: (settings) => {
        return new Promise((resolve, reject) => {
            layerTreeUtils.queryServiceWorker({action: `getListOfCachedRequests`}).then(response => {
                if (Array.isArray(response)) {
                    if (Object.keys(settings).length === 0) {
                        // Empty object means that all layers should have the offline mode to be turned off
                        let promises = [];
                        response.map(cachedRequest => {
                            promises.push(layerTreeUtils.queryServiceWorker({
                                action: `disableOfflineModeForLayer`,
                                payload: {layerKey: cachedRequest.layerKey}
                            }));
                        });

                        Promise.all(promises).then(() => {
                            offlineModeControlsManager.reset().then(() => {
                                offlineModeControlsManager.updateControls().then(() => {
                                    resolve();
                                });
                            });
                        });
                    } else {
                        let promises = [];
                        for (let key in settings) {
                            // @todo Vector tile case
                            if (key.indexOf(`${LAYER.VECTOR}:`) === 0) {
                                // Offline mode for vector layer can be enabled if service worker has corresponsing request cached
                                response.map(cachedRequest => {
                                    if (cachedRequest.layerKey === key) {
                                        let serviceWorkerAPIKey = `disableOfflineModeForLayer`;
                                        if (settings[key] === `true` || settings[key] === true) {
                                            serviceWorkerAPIKey = `enableOfflineModeForLayer`;
                                            offlineModeControlsManager.setControlState(key, true, cachedRequest.bbox);
                                        } else {
                                            offlineModeControlsManager.setControlState(key, false, cachedRequest.bbox);
                                        }
                                        
                                        promises.push(layerTreeUtils.queryServiceWorker({
                                            action: serviceWorkerAPIKey,
                                            payload: {layerKey: cachedRequest.layerKey}
                                        }));
                                    }
                                });
                            }
                        }

                        if (promises.length === 0) {
                            resolve();
                        } else {
                            Promise.all(promises).then((results) => {
                                resolve();
                            });
                        }
                    }
                } else {
                    console.error(`Invalid response from service worker`, response);
                }
            }).catch(error => {
                console.error(`Error occured while querying the service worker`, error);
            });
        });
    },

    /**
     * Returns the current building state of the tree
     *
     * @returns {Boolean}
     */
    isBeingBuilt: () => {
        return moduleState.isBeingBuilt;
    },

    /**
     * Parsed layer meta object
     *
     * @returns {Object|Boolean}
     */
    parseLayerMeta: (layerDescription) => {
        let parsedMeta = false;
        if (!layerDescription) throw new Error(`Layer description object has to be provided`);
        let layerKey = (layerDescription.f_table_schema + `.` + layerDescription.f_table_name);
        if (layerDescription.meta) {
            try {
                let preParsedMeta = JSON.parse(layerDescription.meta);
                if (typeof preParsedMeta == 'object' && preParsedMeta instanceof Object && !(preParsedMeta instanceof Array)) {
                    parsedMeta = preParsedMeta;
                }
            } catch (e) {
                console.warn(`Unable to parse meta for ${layerKey}`);
            }
        }

        return parsedMeta;
    },

    /**
     * Creates SQL store for vector layers
     *
     * @param {Object}  layer        Layer description
     * @param {Boolean} isVirtual    Specifies if layer is virtual
     * @param {Boolean} isVectorTile Specifies if layer is the vector tile one
     *
     * @returns {void}
     */
    createStore: (layer, isVirtual = false, isVectorTile = false) => {
        if (isVirtual && isVectorTile) throw new Error(`Vector tile layer can not be virtual`);

        let layerKey = layer.f_table_schema + '.' + layer.f_table_name;
        let sql = `SELECT * FROM ${layerKey} LIMIT ${SQL_QUERY_LIMIT}`;
        if (isVirtual) {
            let storeWasFound = false;
            moduleState.virtualLayers.map(item => {
                if (item.key === layerKey) {
                    sql = item.store.sql;
                    storeWasFound = true;
                }
            });

            if (storeWasFound === false) {
                throw new Error(`Unable to set SQL query for the created store for virtual layer ${layerKey}`);
            }
        } else {
            let whereClauses = [];
            let activeFilters = _self.getActiveLayerFilters(layerKey);
            activeFilters.map(item => {
                whereClauses.push(item);
            });

            $(`[data-gc2-layer-key="${layerKey + `.` + layer.f_geometry_column}"]`).find(`.js-toggle-filters-number-of-filters`).text(activeFilters.length);

            // Checking if versioning is enabled for layer
            if (`versioning` in layer && layer.versioning) {
                whereClauses.push(`gc2_version_end_date is null`);
            }

            // Checking if dynamic load is enabled for layer
            if (layerKey in moduleState.dynamicLoad && moduleState.dynamicLoad[layerKey] === true) {
                whereClauses.push(`ST_Intersects(ST_Force2D(${layer.f_geometry_column}), ST_Transform(ST_MakeEnvelope ({minX}, {minY}, {maxX}, {maxY}, 4326), ${layer.srid}))`);
            }

            // Gathering all WHERE clauses
            if (whereClauses.length > 0) {
                whereClauses = whereClauses.map(item => `(${item})`);
                sql = `SELECT * FROM ${layerKey} WHERE (${whereClauses.join(` AND `)}) LIMIT ${SQL_QUERY_LIMIT}`;
            }
        }

        let custom_data = ``;
        if (`virtual_layer` in layer && layer.virtual_layer) {
            custom_data = encodeURIComponent(JSON.stringify({ virtual_layer: layerKey }));
        }

        let trackingLayerKey = (LAYER.VECTOR + ':' + layerKey);
        moduleState.vectorStores[trackingLayerKey] = new geocloud.sqlStore({
            map: cloud.get().map,
            jsonp: false,
            method: "POST",
            host: "",
            db: urlparser.db,
            uri: "/api/sql",
            clickable: true,
            id: trackingLayerKey,
            name: trackingLayerKey,
            lifetime: 0,
            custom_data,
            styleMap: styles[trackingLayerKey],
            sql,
            onLoad: (l) => {
                if (l === undefined) return;

                let tableContainerId = `#table_view-${layerKey.replace(".", "_")}`;
                if ($(tableContainerId + ` table`).length > 0) $(tableContainerId).empty();
                $(tableContainerId).append(`<table class="table" data-show-toggle="true" data-show-export="false" data-show-columns="true"></table>`);

                let metaDataKeys = meta.getMetaDataKeys();
                let template = (typeof metaDataKeys[layerKey].infowindow !== "undefined"
                    && metaDataKeys[layerKey].infowindow.template !== "")
                    ? metaDataKeys[layerKey].infowindow.template : layerTreeUtils.getDefaultTemplate();
                let tableHeaders = sqlQuery.prepareDataForTableView(LAYER.VECTOR + ':' + layerKey, l.geoJSON.features);

                let styleSelected = (onSelectedStyle[LAYER.VECTOR + ':' + layerKey] ? onSelectedStyle[LAYER.VECTOR + ':' + layerKey] : {
                    weight: 5,
                    color: '#666',
                    dashArray: '',
                    fillOpacity: 0.2
                });

                let localTable = gc2table.init({
                    el: tableContainerId + ` table`,
                    ns: tableContainerId,
                    geocloud2: cloud.get(),
                    store: moduleState.vectorStores[LAYER.VECTOR + ':' + layerKey],
                    cm: tableHeaders,
                    autoUpdate: false,
                    autoPan: false,
                    openPopUp: false,
                    setViewOnSelect: true,
                    responsive: false,
                    callCustomOnload: true,
                    assignFeatureEventListenersOnDataLoad: true,
                    height: 250,
                    locale: window._vidiLocale.replace("_", "-"),
                    template: template,
                    styleSelected
                });

                if ($(tableContainerId + ` table`).is(`:visible`)) {
                    localTable.loadDataInTable(true);
                }

                tables[LAYER.VECTOR + ':' + layerKey] = localTable;

                $('*[data-gc2-id-vec="' + l.id + '"]').parent().siblings().children().removeClass("fa-spin");

                layers.decrementCountLoading(l.id);
                backboneEvents.get().trigger("doneLoading:layers", l.id);
                if (typeof onLoad[LAYER.VECTOR + ':' + layerKey] === "function") {
                    onLoad[LAYER.VECTOR + ':' + layerKey](l);
                }
            },
            transformResponse: (response, id) => {
                return apiBridgeInstance.transformResponseHandler(response, id);
            },
            onEachFeature: (feature, layer) => {
                if ((LAYER.VECTOR + ':' + layerKey) in onEachFeature) {
                    /*
                        Checking for correct onEachFeature structure
                    */
                    if (`fn` in onEachFeature[LAYER.VECTOR + ':' + layerKey] === false || !onEachFeature[LAYER.VECTOR + ':' + layerKey].fn ||
                        `caller` in onEachFeature[LAYER.VECTOR + ':' + layerKey] === false || !onEachFeature[LAYER.VECTOR + ':' + layerKey].caller) {
                        throw new Error(`Invalid onEachFeature structure`);
                    }

                    if (onEachFeature[LAYER.VECTOR + ':' + layerKey].caller === `editor`) {
                        /*
                            If the handler was set by the editor extension, then display the attributes popup and editing buttons
                        */
                        if (`editor` in extensions) {
                            editor = extensions.editor.index;
                        }

                        layer.on("click", function (e) {
                            let layerIsEditable = false;
                            let metaDataKeys = meta.getMetaDataKeys();
                            if (metaDataKeys[layerKey] && `meta` in metaDataKeys[layerKey]) {
                                let parsedMeta = _self.parseLayerMeta(metaDataKeys[layerKey]);
                                if (parsedMeta && `vidi_layer_editable` in parsedMeta && parsedMeta.vidi_layer_editable) {
                                    layerIsEditable = true;
                                }
                            } else {
                                throw new Error(`metaDataKeys[${layerKey}] is undefined`);
                            }

                            let editingButtonsMarkup = ``;
                            if (moduleState.editingIsEnabled && layerIsEditable) {
                                editingButtonsMarkup = markupGeneratorInstance.getEditingButtons();
                            }

                            _self.displayAttributesPopup(feature, layer, e, editingButtonsMarkup);

                            if (moduleState.editingIsEnabled && layerIsEditable) {
                                $(`.js-vector-layer-popup`).find(".ge-start-edit").unbind("click.ge-start-edit").bind("click.ge-start-edit", function () {
                                    let layerMeta = meta.getMetaByKey(layerKey);
                                    editor.edit(layer, layerKey + "." + layerMeta.f_geometry_column, null, true);
                                });

                                $(`.js-vector-layer-popup`).find(".ge-delete").unbind("click.ge-delete").bind("click.ge-delete", (e) => {
                                    if (window.confirm("Are you sure? Changes will not be saved!")) {
                                        let layerMeta = meta.getMetaByKey(layerKey);
                                        editor.delete(layer, layerKey + "." + layerMeta.f_geometry_column, null, true);
                                    }
                                });
                            } else {
                                $(`.js-vector-layer-popup`).find(".ge-start-edit").hide();
                                $(`.js-vector-layer-popup`).find(".ge-delete").hide();
                            }
                        });
                    }

                    onEachFeature[LAYER.VECTOR + ':' + layerKey].fn(feature, layer);
                } else {
                    // If there is no handler for specific layer, then display attributes only
                    layer.on("click", function (e) {
                        _self.displayAttributesPopup(feature, layer, e);
                    });
                }
            },
            pointToLayer: (pointToLayer.hasOwnProperty(LAYER.VECTOR + ':' + layerKey) ? pointToLayer[LAYER.VECTOR + ':' + layerKey] : (feature, latlng) => {
                return L.circleMarker(latlng);
            })
        });
    },

    displayAttributesPopup(feature, layer, event, additionalControls = ``) {
        event.originalEvent.clickedOnFeature = true;

        let properties = JSON.parse(JSON.stringify(feature.properties));
        for (var key in properties) {
            if (properties.hasOwnProperty(key)) {
                if (key.indexOf(SYSTEM_FIELD_PREFIX) === 0) {
                    delete properties[key];
                }
            }
        }

        var i = properties._vidi_content.fields.length;
        while (i--) {
            if (properties._vidi_content.fields[i].title.indexOf(SYSTEM_FIELD_PREFIX) === 0 || properties._vidi_content.fields[i].title === `_id`) {
                properties._vidi_content.fields.splice(i, 1);
            }
        }

        let renderedText = Mustache.render(layerTreeUtils.getDefaultTemplate(), properties);
        let managePopup = L.popup({
            autoPan: false,
            minWidth: 160,
            className: `js-vector-layer-popup custom-popup`
        }).setLatLng(event.latlng).setContent(`<div>
            ${additionalControls}
            <div>${renderedText}</div>
        </div>`).openOn(cloud.get().map);
    },

    /**
     * Returns active layer filters
     *
     * @param {String} layerKey Layer identifier
     * 
     * @returns {Array}
     */
    getActiveLayerFilters(layerKey) {
        let tableName = layerKey;

        let appliedFilters = {};
        appliedFilters[tableName] = [];

        // Processing predefined filters
        let filters = false;
        if (moduleState.predefinedFilters && layerKey in moduleState.predefinedFilters && moduleState.predefinedFilters[layerKey]) {
            filters = moduleState.predefinedFilters[layerKey];
        }

        let layerDescription = meta.getMetaByKey(layerKey, false);
        if (layerDescription) {
            let parsedMeta = _self.parseLayerMeta(layerDescription);
            if (parsedMeta && (`wms_filters` in parsedMeta && parsedMeta[`wms_filters`]
                || `predefined_filters` in parsedMeta && parsedMeta[`predefined_filters`])) {
                if (!parsedMeta[`predefined_filters`] && moduleState.predefinedFiltersWarningFired === false) {
                    moduleState.predefinedFiltersWarningFired = true;
                    console.warn(`Deprecation warning: "wms_filters" will be replaced with "predefined_filters", plese update the GC2 backend`);
                }

                let predefinedFiltersRaw = parsedMeta[`predefined_filters`] || parsedMeta[`wms_filters`];
                let parsedPredefinedFilters = false;
                try {
                    let parsedPredefinedFiltersLocal = JSON.parse(predefinedFiltersRaw);
                    parsedPredefinedFilters = parsedPredefinedFiltersLocal;
                } catch (e) {}
    
                if (parsedPredefinedFilters) {
                    for (let key in parsedPredefinedFilters) {
                        if (filters === false || filters.indexOf(key) === -1) {
                            appliedFilters[tableName].push(parsedPredefinedFilters[key]);
                        }
                    }
                }
            }

            // Processing arbitrary filters
            let arbitraryConditions = [];
            if (moduleState.arbitraryFilters && layerKey in moduleState.arbitraryFilters) {
                moduleState.arbitraryFilters[layerKey].columns.map((column, index) => {
                    if (column.fieldname && column.value) {
                        for (let key in layerDescription.fields) {
                            if (key === column.fieldname) {
                                switch (layerDescription.fields[key].type) {
                                    case `boolean`:
                                        if (EXPRESSIONS_FOR_BOOLEANS.indexOf(column.expression) === -1) {
                                            throw new Error(`Unable to apply ${column.expression} expression to ${column.fieldname} (${layerDescription.fields[key].type} type)`);
                                        }

                                        let value = `NULL`;
                                        if (column.value === `true`) value = `TRUE`;
                                        if (column.value === `false`) value = `FALSE`;

                                        arbitraryConditions.push(`${column.fieldname} ${column.expression} ${value}`);
                                        break;
                                    case `date`:
                                        if (EXPRESSIONS_FOR_DATES.indexOf(column.expression) === -1) {
                                            throw new Error(`Unable to apply ${column.expression} expression to ${column.fieldname} (${layerDescription.fields[key].type} type)`);
                                        }

                                        arbitraryConditions.push(`${column.fieldname} ${column.expression} '${column.value}'`);
                                        break;
                                    case `string`:
                                    case `character varying`:
                                        if (EXPRESSIONS_FOR_STRINGS.indexOf(column.expression) === -1) {
                                            throw new Error(`Unable to apply ${column.expression} expression to ${column.fieldname} (${layerDescription.fields[key].type} type)`);
                                        }

                                        if (column.expression === 'like') {
                                            arbitraryConditions.push(`${column.fieldname} ${column.expression} '%${column.value}%'`);
                                        } else {
                                            arbitraryConditions.push(`${column.fieldname} ${column.expression} '${column.value}'`);
                                        }

                                        break;
                                    case `integer`:
                                    case `double precision`:
                                        if (EXPRESSIONS_FOR_NUMBERS.indexOf(column.expression) === -1) {
                                            throw new Error(`Unable to apply ${column.expression} expression to ${column.fieldname} (${layerDescription.fields[key].type} type)`);
                                        }

                                        arbitraryConditions.push(`${column.fieldname} ${column.expression} ${column.value}`);
                                        break;
                                    default:
                                        console.error(`Unable to process filter with type '${layerDescription.fields[key].type}'`);
                                }
                            }
                        }
                    }
                });
            }
        
            if (arbitraryConditions.length > 0) {
                let additionalConditions = ``;
                if (moduleState.arbitraryFilters[layerKey].match === `any`) {
                    additionalConditions = arbitraryConditions.join(` OR `);
                } else if (moduleState.arbitraryFilters[layerKey].match === `all`) {
                    additionalConditions = arbitraryConditions.join(` AND `);
                } else {
                    throw new Error(`Invalid match type value`);
                }

                appliedFilters[tableName].push(`(${additionalConditions})`);
            }
        }

        return appliedFilters[tableName];
    },

    createSimulatedLayerDescriptionForVirtualLayer: (item) => {
        let creationTime = parseInt(item.key.split(`.`)[1].replace(`query`, ``));
        let date = new Date(+creationTime);
        let layerNamesFromSQL = item.store.sql.substring(item.store.sql.indexOf(`FROM`) + 4, item.store.sql.indexOf(`WHERE`)).trim();

        // Find the corresponding layer
        let correspondingLayer = meta.getMetaByKey(layerNamesFromSQL);

        // Creating simulated layer description object
        let simulatedMetaData = {
            f_table_title: (__(`Query on`) + ' ' + layerNamesFromSQL + ' (' + moment(date).format(`YYYY-MM-DD HH:mm`) + '; <a href="javascript:void(0);" class="js-delete-virtual-layer"><i class="fa fa-remove"></i> ' + (__(`Delete`)).toLowerCase() + '</a>)'),
            f_table_schema: VIRTUAL_LAYERS_SCHEMA,
            f_table_name: item.key.split(`.`)[1],
            virtual_layer: true,
            fieldconf: (correspondingLayer.fieldconf ? correspondingLayer.fieldconf : null),
            meta: '{\"vidi_layer_type\": \"v\"}',
            layergroup: __(`Virtual layers`)
        };

        return simulatedMetaData;
    },

    /**
     * Generates single layer group control
     *
     * @returns {void}
     */
    createGroupRecord: (groupName, order, forcedState, opacitySettings, precheckedLayers) => {
        let isVirtualGroup = false;
        if (groupName === __(`Virtual layers`)) {
            if (moduleState.virtualLayers.length > 0) {
                isVirtualGroup = true;
            } else {
                return;
            }
        }

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

        // Get layers that belong to current group
        let notSortedLayersAndSubgroupsForCurrentGroup = [];
        if (isVirtualGroup) {
            moduleState.virtualLayers.map(item => {
                let simulatedMetaData = _self.createSimulatedLayerDescriptionForVirtualLayer(item);
                meta.addMetaData({ data: [simulatedMetaData]});
                notSortedLayersAndSubgroupsForCurrentGroup.push({
                    type: GROUP_CHILD_TYPE_LAYER,
                    layer: simulatedMetaData
                });
            });
        } else {
            for (let u = 0; u < metaData.data.length; ++u) {
                if (metaData.data[u].layergroup == groupName) {
                    let layer = metaData.data[u];
                    let parsedMeta = _self.parseLayerMeta(layer);
                    if (parsedMeta && `vidi_sub_group` in parsedMeta) {
                        layer.subGroup = parsedMeta.vidi_sub_group;
                    } else {
                        layer.subGroup = false;
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
        }

        // Reverse subgroups
        notSortedLayersAndSubgroupsForCurrentGroup.map((item) => {
            if (item.type === "group") {
                item.children.reverse();
            }
        });

        // Reverse groups
        let layersAndSubgroupsForCurrentGroup = layerSortingInstance.sortLayers(order, notSortedLayersAndSubgroupsForCurrentGroup.reverse(), groupName);

        // Create stores and calculate active / added layers before the layer panel is shown
        let localNumberOfActiveLayers = 0;
        let localNumberOfAddedLayers = 0;
        let layersToProcess = [];
        for (var u = 0; u < layersAndSubgroupsForCurrentGroup.length; ++u) {
            let localItem = layersAndSubgroupsForCurrentGroup[u];
            if (localItem.type === GROUP_CHILD_TYPE_LAYER) {
                layersToProcess.push(localItem.layer);
            } else if (localItem.type === GROUP_CHILD_TYPE_GROUP) {
                localItem.children.map(childLocalItem => {
                    layersToProcess.push(childLocalItem);
                });
            } else {
                throw new Error(`Invalid sorting element type`);
            }
        }

        layersToProcess.map(layer => {
            let { layerIsActive } = _self.checkIfLayerIsActive(forcedState, precheckedLayers, layer);
            if (layerIsActive) {
                localNumberOfActiveLayers++;
            }

            localNumberOfAddedLayers++;

            let { isVectorLayer, isVectorTileLayer } = layerTreeUtils.getPossibleLayerTypes(layer);
            let parsedMeta = false;
            if (layer.meta) {
                parsedMeta = _self.parseLayerMeta(layer);
            }
    
            let layerKey = layer.f_table_schema + "." + layer.f_table_name;
            if (isVectorLayer) {
                // Filling up default dynamic load values if they are absent
                if (layerKey in moduleState.dynamicLoad === false || [true, false].indexOf(moduleState.dynamicLoad[layerKey]) === -1) {
                    if (`load_strategy` in parsedMeta && parsedMeta.load_strategy) {
                        if (parsedMeta.load_strategy === `d`) {
                            moduleState.dynamicLoad[layerKey] = true;
                        } else if (parsedMeta.load_strategy === `s`) {
                            moduleState.dynamicLoad[layerKey] = false;
                        } else {
                            console.warn(`Invalid default dynamic load value "${parsedMeta.load_strategy}" for layer ${layerKey}`);
                        }
                    }
                }
    
                _self.createStore(layer, isVirtualGroup);
            }
    
            if (isVectorTileLayer) {
                _self.createStore(layer, false, true);
            }
        });

        // Setup active / added layers indicators
        layerTreeUtils.setupLayerNumberIndicator(base64GroupName, localNumberOfActiveLayers, localNumberOfAddedLayers);

        $("#layer-panel-" + base64GroupName).find(`.js-toggle-layer-panel`).click(() => {
            if ($("#group-" + base64GroupName).find(`#collapse${base64GroupName}`).children().length === 0) {
                // Add layers and subgroups
                let numberOfAddedLayers = 0;
                for (var u = 0; u < layersAndSubgroupsForCurrentGroup.length; ++u) {
                    let localItem = layersAndSubgroupsForCurrentGroup[u];
                    if (localItem.type === GROUP_CHILD_TYPE_LAYER) {
                        let {layerIsActive, activeLayerName} = _self.checkIfLayerIsActive(forcedState, precheckedLayers, localItem.layer);
                        if (layerIsActive) {
                            numberOfActiveLayers++;
                        }

                        _self.createLayerRecord(localItem.layer, opacitySettings, base64GroupName, layerIsActive, activeLayerName, false, false, isVirtualGroup);
                        numberOfAddedLayers++;
                    } else if (localItem.type === GROUP_CHILD_TYPE_GROUP) {
                        let {activeLayers, addedLayers} = _self.createSubgroupRecord(localItem, forcedState, opacitySettings, precheckedLayers, base64GroupName)
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

                // Remove the group if empty
                if (numberOfAddedLayers === 0) {
                    $("#layer-panel-" + base64GroupName).remove();
                }

                const setAllControlsProcessors = (type) => {
                    $(`.js-set-all-layer-to-be-${type}`).off();
                    $(`.js-set-all-layer-to-be-${type}`).click(e => {
                        e.preventDefault();
                        $(`button[class*="js-set-${type}"]`).each((index, element) => {
                            if ($(element).prop(`disabled`) !== true) {
                                $(element).trigger(`click`);
                            }
                        });
                    });
                };

                setAllControlsProcessors(`online`);
                setAllControlsProcessors(`offline`);

                const applyQueriedSetupControlRequests = (layer) => {
                    let layerKey = layer.f_table_schema + `.` + layer.f_table_name;
                    if (moduleState.setupLayerControlsRequests[layerKey]) {
                        let settings = moduleState.setupLayerControlsRequests[layerKey];
                        _self.setupLayerControls(settings.desiredSetupType, layerKey, settings.ignoreErrors, settings.layerIsEnabled, true);
                    }
                };            

                layersAndSubgroupsForCurrentGroup.map(item => {
                    if (item.type === GROUP_CHILD_TYPE_LAYER) {
                        applyQueriedSetupControlRequests(item.layer);
                    } else {
                        item.children.map(applyQueriedSetupControlRequests);
                    }
                });
            }
        });
    },

    checkIfLayerIsActive: (forcedState, precheckedLayers, localItem) => {
        if (!localItem) {
            throw new Error(`Layer meta object is empty`);
        }

        let layerIsActive = false;
        let activeLayerName = false;

        let name = `${localItem.f_table_schema}.${localItem.f_table_name}`;

        // If activeLayers are set, then no need to sync with the map
        if (!forcedState) {
            if (precheckedLayers && Array.isArray(precheckedLayers) && precheckedLayers.length > 0) {
                precheckedLayers.map(item => {
                    if (layerUtils.stripPrefix(item.id) === name) {
                        layerIsActive = true;
                        activeLayerName = item.id;
                    }
                });
            } else {
                cloud.get().map.eachLayer(function(layer){
                    if (layer.id && layerTreeUtils.stripPrefix(layer.id) === name) {
                        layerIsActive = true;
                        activeLayerName = layer.id;
                    }
                });
            }
        }

        return {layerIsActive, activeLayerName}
    },

    /**
     * Generates single subgroup control
     *
     * @returns {Object}
     */
    createSubgroupRecord: (subgroup, forcedState, opacitySettings, precheckedLayers, base64GroupName) => {
        let addedLayers = 0, activeLayers = 0;
        let base64SubgroupName = Base64.encode(`subgroup_${subgroup.id}`).replace(/=/g, "");
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
            let {layerIsActive, activeLayerName} = _self.checkIfLayerIsActive(forcedState, precheckedLayers, child);
            if (layerIsActive) {
                activeLayers++;
            }

            _self.createLayerRecord(child, opacitySettings, base64GroupName, layerIsActive, activeLayerName, subgroup.id, base64SubgroupName);
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

        return {addedLayers, activeLayers};
    },

    /**
     * Generates single layer control
     *
     * @returns {void}
     */
    createLayerRecord: (layer, opacitySettings, base64GroupName, layerIsActive, activeLayerName,
        subgroupId = false, base64SubgroupName = false, isVirtual = false) => {

        //console.log(`### createLayerRecord ${layer.f_table_schema}.${layer.f_table_name}`, opacitySettings, base64GroupName, layerIsActive, activeLayerName, subgroupId, base64SubgroupName, isVirtual)
        
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
            let { isVectorLayer, isRasterTileLayer, isVectorTileLayer, detectedTypes, specifiers } = layerTreeUtils.getPossibleLayerTypes(layer);
            let singleTypeLayer = (detectedTypes === 1);

            let condition = layerTreeUtils.getDefaultLayerType(layer);
            if (layerIsActive && activeLayerName) {
                condition = (activeLayerName.indexOf(`:`) === -1 ? LAYER.RASTER_TILE : activeLayerName.split(`:`)[0]);
            }

            // Deciding on default vector type
            let selectorLabel, defaultLayerType;
            switch (condition) {
                case LAYER.VECTOR:
                    selectorLabel = ICONS[LAYER.VECTOR];
                    defaultLayerType = LAYER.VECTOR;
                    break;
                case LAYER.RASTER_TILE:
                    selectorLabel = ICONS[LAYER.RASTER_TILE];
                    defaultLayerType = LAYER.RASTER_TILE;
                    break;
                case LAYER.VECTOR_TILE:
                    selectorLabel = ICONS[LAYER.VECTOR_TILE];
                    defaultLayerType = LAYER.VECTOR_TILE;
                    break;
                case LAYER.WEBGL:
                    selectorLabel = ICONS[LAYER.WEBGL];
                    defaultLayerType = LAYER.WEBGL;
                    break;
            }

            let layerIsEditable = false;
            let displayInfo = `hidden`;
            let parsedMeta = false;
            if (layer.meta) {
                parsedMeta = _self.parseLayerMeta(layer);
                if (parsedMeta) {
                    if (`vidi_layer_editable` in parsedMeta && parsedMeta.vidi_layer_editable) {
                        layerIsEditable = true;
                    }

                    if (`meta_desc` in parsedMeta) {
                        displayInfo = (parsedMeta.meta_desc || layer.f_table_abstract) ? `visible` : `hidden`;
                    }
                }
            }

            let layerKey = layer.f_table_schema + "." + layer.f_table_name;
            let layerKeyWithGeom = layerKey + "." + layer.f_geometry_column;

            let lockedLayer = (layer.authentication === "Read/write" ? " <i class=\"fa fa-lock gc2-session-lock\" aria-hidden=\"true\"></i>" : "");

            let layerTypeSelector = ``;
            if (!singleTypeLayer) {
                layerTypeSelector = markupGeneratorInstance.getLayerTypeSelector(selectorLabel, specifiers);
            }

            let addButton = ``;
            if (moduleState.editingIsEnabled && layerIsEditable) {
                addButton = markupGeneratorInstance.getAddButton(layerKeyWithGeom);
            }

            let layerControlRecord = $(markupGeneratorInstance.getLayerControlRecord(layerKeyWithGeom, layerKey, layerIsActive,
                layer, defaultLayerType, layerTypeSelector, text, lockedLayer, addButton, displayInfo));

            $(layerControlRecord).find('.js-layer-type-selector-tile').first().on('click', (e, data) => {
                let switcher = $(e.target).closest('.layer-item').find('.js-show-layer-control');
                $(switcher).data('gc2-layer-type', LAYER.RASTER_TILE);
                $(switcher).prop('checked', true);

                _self.setupLayerControls(LAYER.RASTER_TILE, layerKey);
                _self.reloadLayer($(switcher).data('gc2-id'), false, (data ? data.doNotLegend : false));

                $(e.target).closest('.layer-item').find('.js-dropdown-label').html(ICONS[LAYER.RASTER_TILE]);
                backboneEvents.get().trigger(`${MODULE_NAME}:activeLayersChange`);
                offlineModeControlsManager.updateControls();
            });

            $(layerControlRecord).find('.js-layer-type-selector-vector').first().on('click', (e, data) => {
                let switcher = $(e.target).closest('.layer-item').find('.js-show-layer-control');
                $(switcher).data('gc2-layer-type', LAYER.VECTOR);
                $(switcher).prop('checked', true);

                _self.setupLayerControls(LAYER.VECTOR, layerKey);
                _self.reloadLayer(`${LAYER.VECTOR}:${$(switcher).data('gc2-id')}`, false, (data ? data.doNotLegend : false));

                $(e.target).closest('.layer-item').find('.js-dropdown-label').html(ICONS[LAYER.VECTOR]);
                backboneEvents.get().trigger(`${MODULE_NAME}:activeLayersChange`);
                offlineModeControlsManager.updateControls();
            });

            $(layerControlRecord).find('.js-layer-type-selector-vector-tile').first().on('click', (e, data) => {
                let switcher = $(e.target).closest('.layer-item').find('.js-show-layer-control');
                $(switcher).data('gc2-layer-type', LAYER.VECTOR_TILE);
                $(switcher).prop('checked', true);

                _self.setupLayerControls(LAYER.VECTOR_TILE, layerKey);
                _self.reloadLayer(`${LAYER.VECTOR_TILE}:${$(switcher).data('gc2-id')}`, false, (data ? data.doNotLegend : false));

                $(e.target).closest('.layer-item').find('.js-dropdown-label').html(ICONS[LAYER.VECTOR_TILE]);
                backboneEvents.get().trigger(`${MODULE_NAME}:activeLayersChange`);
                offlineModeControlsManager.updateControls();
            });

            try {
            if (isVirtual) {
                $(layerControlRecord).find(`.js-toggle-filters`).remove();
                $(layerControlRecord).find(`.js-toggle-load-strategy`).remove();
                $(layerControlRecord).find(`.js-delete-virtual-layer`).click(() => {
                    let deletedIndex = false;
                    moduleState.virtualLayers.map((item, index) => {
                        if (item.key === layerKey) {
                            deletedIndex = index;
                        }
                    });

                    if (deletedIndex === false) {
                        throw new Error(`Unable to find layer ${layerKey}`);
                    } else {
                        moduleState.virtualLayers.splice(deletedIndex, 1);
                        meta.deleteMetaData(layerKey);
                        switchLayer.init(layerKey, false, true, false, false).then(() => {
                            _self.create(false, [`virtualLayers`]).then(() => {
                                backboneEvents.get().trigger(`${MODULE_NAME}:activeLayersChange`);
                            });
                        });
                    }
                });
            }

            $(layerControlRecord).find('.info-label').first().on('click', (e, data) => {
                let html,
                    name = layer.f_table_name || null,
                    title = layer.f_table_title || null,
                    abstract = layer.f_table_abstract || null;

                html = (parsedMeta !== null
                    && typeof parsedMeta.meta_desc !== "undefined"
                    && parsedMeta.meta_desc !== "") ?
                    converter.makeHtml(parsedMeta.meta_desc) : abstract;

                moment.locale('da');

                html = html ? Mustache.render(html, parsedMeta) : "";

                $("#info-modal.slide-right").css("right", "0");
                $("#info-modal .modal-title").html(title || name);
                $("#info-modal .modal-body").html(html + '<div id="info-modal-legend" class="legend"></div>');
                legend.init([`${layer.f_table_schema}.${layer.f_table_name}`], "#info-modal-legend");
                e.stopPropagation();
            });

            if (base64SubgroupName) {
                $("#collapse" + base64GroupName).find(`[data-gc2-subgroup-id="${subgroupId}"]`).find(`.js-subgroup-children`).append(layerControlRecord);
            } else {
                $("#collapse" + base64GroupName).append(layerControlRecord);
            }

            let layerContainer = $(`[data-gc2-layer-key="${layerKeyWithGeom}"]`);
            $(layerContainer).find(`.js-set-online, .js-set-offline`).click(e => {
                e.preventDefault();

                var $this = $(e.currentTarget);
                let layerKey = $this.data(`layer-key`);
                let offlineModeValue = false;
                let serviceWorkerAPIKey = `disableOfflineModeForLayer`;
                if ($this.hasClass(`js-set-offline`)) {
                    offlineModeValue = true;
                    serviceWorkerAPIKey = `enableOfflineModeForLayer`;
                }

                offlineModeControlsManager.setControlState(layerKey, offlineModeValue);
                if (offlineModeControlsManager.isVectorLayer(layerKey)) {
                    layerTreeUtils.queryServiceWorker({
                        action: serviceWorkerAPIKey,
                        payload: {layerKey}
                    }).then(() => {
                        _self._setupToggleOfflineModeControlsForLayers().then(() => {
                            backboneEvents.get().trigger(`${MODULE_NAME}:layersOfflineModeChange`);
                        });
                    });
                } else {
                    offlineModeControlsManager.updateControls().then(() => {
                        backboneEvents.get().trigger(`${MODULE_NAME}:layersOfflineModeChange`);
                    });
                }
            });

            $(layerContainer).find(`.js-refresh`).click(e => {
                e.preventDefault();

                let layerKey = $(layerContainer).find(`.js-refresh`).data(`layer-key`);
                if (confirm(__(`Refresh cache for layer`) + ` ${layerKey}?`)) {
                    layerTreeUtils.queryServiceWorker({
                        action: `disableOfflineModeForLayer`,
                        payload: {layerKey}
                    }).then(() => {
                        _self.reloadLayer(LAYER.VECTOR + ':' + layerKey).then(() => {
                            layerTreeUtils.queryServiceWorker({
                                action: `enableOfflineModeForLayer`,
                                payload: {layerKey}
                            }).then(() => {
                                _self._setupToggleOfflineModeControlsForLayers()
                            });
                        });
                    });
                }
            });

            $(layerContainer).find('.js-layer-settings-filters').hide(0);
            $(layerContainer).find('.js-layer-settings-load-strategy').hide(0);
            $(layerContainer).find('.js-layer-settings-opacity').hide(0);
            $(layerContainer).find('.js-layer-settings-table').hide(0);

            _self.setupLayerControls(defaultLayerType, layerKey, true, layerIsActive);

            let initialSliderValue = 1;
            if (isRasterTileLayer || isVectorTileLayer) {
                // Opacity slider
                $(layerContainer).find('.js-layer-settings-opacity').append(`<div style="padding-left: 15px; padding-right: 10px; padding-bottom: 10px; padding-top: 10px;">
                    <div class="js-opacity-slider slider shor slider-material-orange"></div>
                </div>`);

                if (layerKey in opacitySettings && isNaN(opacitySettings[layerKey]) === false) {
                    if (opacitySettings[layerKey] >= 0 && opacitySettings[layerKey] <= 1) {
                        initialSliderValue = opacitySettings[layerKey];
                    }
                }

                let slider = $(layerContainer).find('.js-layer-settings-opacity').find(`.js-opacity-slider`).get(0);
                if (slider) {
                    noUiSlider.create(slider, {
                        start: (initialSliderValue * 100),
                        connect: `lower`,
                        step: 10,
                        range: {
                            'min': 0,
                            'max': 100
                        }
                    });

                    slider.noUiSlider.on(`update`, (values, handle, unencoded, tap, positions) => {
                        let sliderValue = (parseFloat(values[handle]) / 100);
                        layerTreeUtils.applyOpacityToLayer(sliderValue, layerKey, cloud, backboneEvents);
                        moduleState.setLayerOpacityRequests.push({layerKey, opacity: sliderValue});
                    });
                }

                // Assuming that it not possible to set layer opacity right now
                moduleState.setLayerOpacityRequests.push({layerKey, opacity: initialSliderValue});

                $(layerContainer).find(`.js-toggle-opacity`).click(() => {
                    _self._selectIcon($(layerContainer).find('.js-toggle-opacity'));
                    $(layerContainer).find('.js-layer-settings-opacity').toggle();
                });
            }

            if (isVirtual === false) {
                let componentContainerId = `layer-settings-filters-${layerKey}`;
                $(layerContainer).find('.js-layer-settings-filters').append(`<div id="${componentContainerId}" style="padding-left: 15px; padding-right: 10px; padding-bottom: 10px;"></div>`);
                let localArbitraryfilters = {};
                if (moduleState.arbitraryFilters && layerKey in moduleState.arbitraryFilters) {
                    localArbitraryfilters = moduleState.arbitraryFilters[layerKey];
                }

                let localPredefinedFilters = {};
                if (parsedMeta && (`wms_filters` in parsedMeta && parsedMeta[`wms_filters`]
                    || `predefined_filters` in parsedMeta && parsedMeta[`predefined_filters`])) {
                    if (!parsedMeta[`predefined_filters`] && moduleState.predefinedFiltersWarningFired === false) {
                        moduleState.predefinedFiltersWarningFired = true;
                        console.warn(`Deprecation warning: "wms_filters" will be replaced with "predefined_filters", plese update the GC2 backend`);
                    }

                    let predefinedFiltersRaw = parsedMeta[`predefined_filters`] || parsedMeta[`wms_filters`];
                    try {
                        let filters = JSON.parse(predefinedFiltersRaw);
                        localPredefinedFilters = filters;
                    } catch (e) {
                        console.warn(`Unable to parse WMS filters settings for ${layerKey}`, parsedMeta[`wms_filters`]);
                        $(layerContainer).find(`.js-toggle-tile-filters`).remove();
                    }
                }

                let activeFilters = _self.getActiveLayerFilters(layerKey);
                $(layerContainer).find(`.js-toggle-filters-number-of-filters`).text(activeFilters.length);
                if (document.getElementById(componentContainerId)) {
                    ReactDOM.render(
                        <LayerFilter
                            layer={layer}
                            predefinedFilters={localPredefinedFilters}
                            disabledPredefinedFilters={moduleState.predefinedFilters[layerKey] ? moduleState.predefinedFilters[layerKey] : []}
                            arbitraryFilters={localArbitraryfilters}
                            onApplyPredefined={_self.onApplyPredefinedFiltersHandler}
                            onApplyArbitrary={_self.onApplyArbitraryFiltersHandler}
                            />, document.getElementById(componentContainerId));
                    $(layerContainer).find('.js-layer-settings-filters').hide(0);

                    $(layerContainer).find(`.js-toggle-filters`).click(() => {
                        _self._selectIcon($(layerContainer).find('.js-toggle-filters').first());
                        $(layerContainer).find('.js-layer-settings-filters').toggle();
                    });
                }
            }

            if (isVectorLayer) {
                if (isVirtual === false) {
                    let value = false;
                    if (layerKey in moduleState.dynamicLoad && [true, false].indexOf(moduleState.dynamicLoad[layerKey]) !== -1) {
                        value = moduleState.dynamicLoad[layerKey];
                    }

                    let componentContainerId = `layer-settings-load-strategy-${layerKey}`;
                    $(layerContainer).find('.js-layer-settings-load-strategy').append(`<div id="${componentContainerId}" style="padding-left: 15px; padding-right: 10px; padding-bottom: 10px;"></div>`);
                    if (document.getElementById(componentContainerId)) {
                        ReactDOM.render(<LoadStrategyToggle
                            layerKey={layerKey}
                            initialValue={value}
                            onChange={_self.onChangeLoadStrategyHandler}/>,
                            document.getElementById(componentContainerId));
                        $(layerContainer).find('.js-layer-settings-load-strategy').hide(0);
                        $(layerContainer).find(`.js-toggle-load-strategy`).click(() => {
                            _self._selectIcon($(layerContainer).find('.js-toggle-load-strategy'));
                            $(layerContainer).find('.js-layer-settings-load-strategy').toggle();
                        });
                    }
                }

                // Table view
                $(layerContainer).find(`.js-toggle-table-view`).click(() => {
                    _self._selectIcon($(layerContainer).find('.js-toggle-table-view'));
                    $(layerContainer).find('.js-layer-settings-table').toggle();

                    let tableContainerId = `#table_view-${layerKey.replace(".", "_")}`;
                    if ($(tableContainerId).length !== 1) throw new Error(`Unable to find the table view container`);

                    // Refresh all tables when opening one panel, because DOM changes can make the tables un-aligned
                    $(`.js-layer-settings-table table`).bootstrapTable('resetView');

                    tables[LAYER.VECTOR + ':' + layerKey].loadDataInTable(true);
                });

                _self.setupLayerControls(defaultLayerType, layerKey, true, layerIsActive);
            }

            $(layerContainer).find(`.js-toggle-search`).click(() => {
                _self._selectIcon($(layerContainer).find('.js-toggle-search'));
                $(layerContainer).find('.js-layer-settings-search').toggle();
            });

            // PostgreSQL search is for all types of layers
            $(layerContainer).find('.js-layer-settings-search').append(
                `<div style="padding-left: 15px; padding-right: 10px; padding-bottom: 20px; padding-top: 20px;">
                    <div>
                        <form class="form" onsubmit="return false">
                            <div class="form-group">
                                <input type="test" class="js-search-input form-control" placeholder="${__("Search")}">
                            </div>
		                    <div class="form-inline">
                                <div class="form-group">
                                    <label>${__("Method")}</label>
                                    <select class="form-control js-search-method">
                                      <option value="like">${__("Like")}</option>
                                      <option value="tsvector">${__("Tsvector")}</option>                                      
                                      <option value="similarity">${__("Similarity")}</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label>${__("Similarity")}</label>
                                    <select class="form-control js-search-similarity">
                                      <option value="1">100 %</option>
                                      <option value="0.9">90 %</option>
                                      <option value="0.8" selected>80 %</option>
                                      <option value="0.7">70 %</option>
                                      <option value="0.6">60 %</option>
                                      <option value="0.5">50 %</option>
                                      <option value="0.4">40 %</option>
                                      <option value="0.3">30 %</option>
                                      <option value="0.2">20 %</option>
                                      <option value="0.1">10 %</option>
                                    </select>
                                </div>
		                    </div>
		                    <div class="alert alert-warning no-searchable-fields" style="display: none;">
                                ${__("No searchable fields on layer")}
                            </div>
                            <div class="searchable-fields" style="display: none;">${__("Searchable fields")} </div>
                        </form>
                    </div>
                 </div>`
            );

            let search = $(layerContainer).find('.js-layer-settings-search').find(`form`).get(0);
            if (search) {
                let fieldConf = JSON.parse(layer.fieldconf) || {}, countSearchFields = [];
                $.each(fieldConf, function (i, val) {
                    if (typeof val.searchable === "boolean" && val.searchable === true) {
                        countSearchFields.push(i);
                    }
                });

                if (countSearchFields.length === 0) {
                    $(search).find('input, textarea, button, select').attr('disabled', 'true');
                    $(search).find('.no-searchable-fields').show();
                } else {
                    $(search).find('.searchable-fields').show();
                    $.each(countSearchFields, function (i, val) {
                        $(search).find('.searchable-fields').append(`<span class="label label-default" style="margin-right: 3px">${fieldConf[val].alias || val}</span>`)
                    });
                }

                $(search).on('change', (e) => {
                    let fieldConf = JSON.parse(layer.fieldconf) || {}, searchFields = [], whereClauses = [];
                    $.each(fieldConf, function (i, val) {
                        if (typeof val.searchable === "boolean" && val.searchable === true) {
                            searchFields.push(i);
                        }
                    });
                    let searchStr = $(e.target).closest('form').find('.js-search-input').get(0).value,
                        method = $(e.target).closest('form').find('.js-search-method').get(0).value,
                        similarity = $(e.target).closest('form').find('.js-search-similarity').get(0).value;
                    if (method !== "similarity") {
                        $($(e.target).closest('form').find('.js-search-similarity').get(0)).prop("disabled", true)
                    } else {
                        $($(e.target).closest('form').find('.js-search-similarity').get(0)).prop("disabled", false)
                    }
                    switch (method) {
                        case "similarity":
                            $.each(searchFields, function (i, val) {
                                whereClauses.push(`similarity(${val}::TEXT, '${searchStr}'::TEXT) >= ${similarity}`);
                            });
                            break;
                        case "like":
                            $.each(searchFields, function (i, val) {
                                whereClauses.push(`${val}::TEXT ILIKE '%${searchStr}%'::TEXT`);
                            });
                            break;
                        case "tsvector":
                            $.each(searchFields, function (i, val) {
                                whereClauses.push(`to_tsvector('danish', ${val}::TEXT) @@ to_tsquery('danish', '${searchStr}'::TEXT)`);
                            });
                            break;
                    }

                    if (searchStr !== "") {
                        let whereClause = whereClauses.join(" OR ");
                        backboneEvents.get().trigger("sqlQuery:clear");
                        sqlQuery.init(qstore, null, "3857", null, null, null, whereClause, [`${layer.f_table_schema}.${layer.f_table_name}`], true);
                    }
                });
            }


        }catch(e) {console.log(e)}
        }
    },

    _selectIcon: (e) => {
        let className = 'active';
        if (e.hasClass(className)) {
            e.removeClass(className);
        } else {
            e.addClass(className);
        }
    },

    onChangeLoadStrategyHandler: ({layerKey}) => {
        moduleState.dynamicLoad[layerKey] = moduleState.dynamicLoadIsEnabled;
        let correspondingLayer = meta.getMetaByKey(layerKey);
        backboneEvents.get().trigger(`${MODULE_NAME}:dynamicLoadLayersChange`);
        _self.createStore(correspondingLayer);
        _self.reloadLayer(LAYER.VECTOR + ':' + layerKey);       
    },

    onApplyArbitraryFiltersHandler: ({layerKey, filters}) => {
        validateFilters(filters);
        moduleState.arbitraryFilters[layerKey] = filters;
        _self.reloadLayerOnFiltersChange(layerKey);
    },

    onApplyPredefinedFiltersHandler: ({layerKey, filters}) => {
        moduleState.predefinedFilters[layerKey] = filters;
        _self.reloadLayerOnFiltersChange(layerKey);
    },

    reloadLayerOnFiltersChange: (layerKey) => {
        if (layerKey.indexOf(`:`) > -1) {
            throw new Error(`Filters have to operate only the layer key, without the layer type specifier`);
        }

        backboneEvents.get().trigger(`${MODULE_NAME}:filtersChange`);
        _self.getActiveLayers().map(activeLayerKey => {
            if (activeLayerKey.indexOf(layerKey) !== -1) {
                if (activeLayerKey === layerKey) {
                    // Reloading as a tile layer
                    _self.reloadLayer(activeLayerKey, false, false, false);
                } else if (activeLayerKey === (LAYER.VECTOR_TILE + `:` + layerKey)) {
                    // Reloading as a vector tile layer
                    _self.reloadLayer(activeLayerKey, false, false, false);
                } else if (activeLayerKey === (LAYER.VECTOR + `:` + layerKey)) {
                    // Reloading as a vector layer
                    let correspondingLayer = meta.getMetaByKey(layerKey);
                    _self.createStore(correspondingLayer);
                    _self.reloadLayer(activeLayerKey);
                } else {
                    console.error(`Unable to apply filters to layer ${layerKey}`);
                }
            }
        });
    },

    /**
     * Calculates layer order using the current markup
     *
     * @returns {void}
     */
    calculateOrder: () => {
        moduleState.layerTreeOrder = layerTreeUtils.calculateOrder();
    },





    /**
     * Reloading provided layer.
     *
     * @param {String} layerId Layer identifier
     */
    reloadLayer: (layerId, forceTileRedraw = false, doNotLegend = false, setupControls = true) => {
        return new Promise((resolve, reject) => {
            switchLayer.init(layerId, false, doNotLegend, forceTileRedraw, false).then(() => {
                switchLayer.init(layerId, true, doNotLegend, forceTileRedraw, setupControls, setupControls).then(() => {
                    resolve();
                });
            });
        });
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
        onEachFeature[layer] = {caller, fn};
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

    setOnSelectedStyle: function (layer, style) {
        onSelectedStyle[layer] = style;
    },



    load: function (id) {
        moduleState.vectorStores[id].load();
    },



};