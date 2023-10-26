/*
 * @author     Alexander Shumilov
 * @copyright  2013-2023 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

/**
 * @fileoverview Layer tree module
 */

'use strict';

import {
    ICONS,
    LAYER,
    LOG,
    MAP_RESOLUTIONS,
    MODULE_NAME,
    SELECTED_ICON_SCALE,
    SELECTED_STYLE,
    SUB_GROUP_DIVIDER,
    SYSTEM_FIELD_PREFIX,
    VECTOR_SIDE_TABLE_EL,
    VIRTUAL_LAYERS_SCHEMA
} from './constants';
import dayjs from 'dayjs';
import mustache from 'mustache';
import LayerFilter from './LayerFilter';
import LoadStrategyToggle from './LoadStrategyToggle';
import LabelSettingToggle from './LabelSettingToggle';
import {
    EXPRESSIONS_FOR_BOOLEANS,
    EXPRESSIONS_FOR_DATES,
    EXPRESSIONS_FOR_NUMBERS,
    EXPRESSIONS_FOR_STRINGS,
    validateFilters
} from './filterUtils';
import OfflineModeControlsManager from './OfflineModeControlsManager';
import {GROUP_CHILD_TYPE_GROUP, GROUP_CHILD_TYPE_LAYER, LayerSorting} from './LayerSorting';
import {GEOJSON_PRECISION} from './../constants';
import {
    booleanIntersects as turfIntersects,
    buffer as turfBuffer,
    feature as turfFeature,
    point as turfPoint
} from '@turf/turf'
import MetaSettingForm from "./MetaSettingForm";
import Download from './Download';


let _self, meta, layers, sqlQuery, switchLayer, cloud, legend, state, backboneEvents,
    onEachFeature = [], pointToLayer = {}, onSelectedStyle = [], onLoad = [], onSelect = [],
    onMouseOver = [], cm = [], styles = {}, tables = {}, childLayersThatShouldBeEnabled = [];

const {v4: uuidv4} = require('uuid');
const React = require('react');
const ReactDOM = require('react-dom');
const base64url = require('base64url');

const urlparser = require('./../urlparser');
const download = require('./../download');
const MarkupGenerator = require('./MarkupGenerator');
const marked = require('marked');

let offlineModeControlsManager = false;
let markupGeneratorInstance = new MarkupGenerator();
let layerSortingInstance = new LayerSorting();
let latestFullTreeStructure = false;
let moveEndEvent = () => {
};
let queueStatistsics = false;
let QueueStatisticsWatcher = require('./QueueStatisticsWatcher');
let APIBridgeSingletone = require('./../api-bridge');
let layerTreeUtils = require('./utils');
let apiBridgeInstance = false;
let extensions = false, editor = false, qstore = [], reloadIntervals = [], vectorPopUp;
let filterComp = {};
let lastFilter;
let utils;
let recreateStores = true;
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
    setLayerStateRequests: {},
    vectorStores: {},
    webGLStores: {},
    virtualLayers: [],
    tileContentCache: {},
    editorFilters: {},
    editorFiltersActive: {},
    fitBoundsActiveOnLayers: {},
    labelSettings: {},
    vectorStyles: {}
};
let infoOffCanvas;
let bindEvent;
let initialFilterIsApplied = false;

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
        utils = o.utils;
        bindEvent = o.bindEvent;

        offlineModeControlsManager = new OfflineModeControlsManager(meta);

        // expose api
        api.filter = (l, f) => {
            _self.onApplyArbitraryFiltersHandler({"layerKey": l, "filters": f});
            filterComp[l].setState({"arbitraryFilters": f});
        }

        return this;
    },

    init: function () {
        _self = this;

        try {
            infoOffCanvas = new bootstrap.Offcanvas('#offcanvasInfo');
            document.getElementById('offcanvasInfo').addEventListener('hide.bs.offcanvas', event => {
                _self.resetAllVectorLayerStyles();
                sqlQuery.resetAll();
            })
        } catch (e) {

        }

        // Update the queue statistics when group panel is opened.
        // In case of the layer tree component is not rendered yet
        $(document).arrive('.js-toggle-layer-panel', function (e, data) {
            $(this).on('click', function (e) {
                setTimeout(() => {
                    _self._statisticsHandler(queueStatistsics.getLastStatistics(), false, true);
                }, 200);
            })
        });
        // If map is clicked, when clear all selections
        cloud.get().map.on('preclick', () => {
            try {
                _self.resetAllVectorLayerStyles();
                _self.getInfoOffCanvas().hide();
                sqlQuery.resetAll();
                // If no queryable tile layers are active then close the off canvas.
                const l = _self.getActiveLayers().filter(e => {
                    if (e.split(':').length === 1) {
                        try {
                            const m = meta.getMetaByKey(e)
                            if (m?.not_querable !== true) {
                                return true;
                            }
                        } catch (e) {
                            console.error(e.message)
                            return true;
                        }
                    }
                })
                if (l.length === 0) {
                    // sqlQuery.closeInfoSlidePanel();
                }
            } catch (e) {

            }
        })
        if (window.vidiConfig.enabledExtensions.indexOf(`editor`) !== -1) moduleState.editingIsEnabled = true;
        $(document).arrive('#layers-filter-reset', function (e, data) {
            $(this).on('click', function (e) {
                _self.create(false, [], true, "");
                $('#layers-filter').val('');
            })
        });
        $(document).arrive('#layers-filter', function (e, data) {
            const filterBusy = $('#layers-filter-busy');
            const filterReset = $('#layers-filter-reset i');
            let timeOut;
            $(this).on('input', function (e) {
                clearTimeout(timeOut)
                const c = () => {
                    if (moduleState.isBeingBuilt) {
                        filterBusy.show();
                        filterReset.hide();
                        timeOut = setTimeout(() => {
                            c()
                        }, 100)
                    } else {
                        filterBusy.hide();
                        filterReset.show();
                        _self.create(false, [], true, e.target.value);

                    }
                }
                c();
            })
        });
        $("#layers").before(`
                                <div class="input-group mb-3 layer-filter">
                                    <input placeholder="${__('Filter')}" class="form-control" type="text" id="layers-filter" autocomplete="off">
                                    <button id="layers-filter-reset" class="btn btn-outline-secondary" type="button" id="button-addon2">
                                        <i class="bi bi-x-lg"></i>
                                        <div id="layers-filter-busy" style="display: none" class="spinner-border spinner-border-sm text-primary" role="status"></div>
                                    </button>
                                  
                                </div>
                             
                             `);

        if (urlparser && urlparser.urlVars && urlparser.urlVars.initialFilter) {
            backboneEvents.get().on(`${MODULE_NAME}:ready`, () => {
                let decodedFilters;
                try {
                    decodedFilters = JSON.parse(base64url.decode(urlparser.urlVars.initialFilter));
                } catch (e) {
                    alert("Bad filter");
                    return
                }
                for (let layerKey in decodedFilters) {
                    _self.onApplyArbitraryFiltersHandler({
                        layerKey,
                        filters: decodedFilters[layerKey]
                    }, LAYER.VECTOR);

                    // Wait for layer load event
                    backboneEvents.get().on(`doneLoading:layers`, (loadedLayerName) => {
                        if (layerTreeUtils.stripPrefix(loadedLayerName) === layerTreeUtils.stripPrefix(layerKey) && !initialFilterIsApplied) {
                            initialFilterIsApplied = true;
                            for (let key in cloud.get().map._layers) {
                                let layer = cloud.get().map._layers[key];
                                if (`id` in layer && layer.id && layerTreeUtils.stripPrefix(layer.id) === layerTreeUtils.stripPrefix(layerKey)) {
                                    cloud.get().map.fitBounds(layer.getBounds(), {maxZoom: 16});
                                    console.log(`Query filter parameter was applied`);
                                }
                            }
                        }
                    });
                }
            });
        }

        queueStatistsics = new QueueStatisticsWatcher({switchLayer, offlineModeControlsManager, layerTree: _self});
        apiBridgeInstance = APIBridgeSingletone((statistics, forceLayerUpdate) => {
            _self._statisticsHandler(statistics, forceLayerUpdate);
        });

        state.listenTo('layerTree', _self);
        state.listen(MODULE_NAME, `sorted`);
        state.listen(MODULE_NAME, `layersOfflineModeChange`);
        state.listen(MODULE_NAME, `activeLayersChange`);
        state.listen(MODULE_NAME, `changed`);
        state.listen(MODULE_NAME, `opacityChange`);
        state.listen(MODULE_NAME, `dynamicLoadLayersChange`);
        state.listen(MODULE_NAME, `settleForcedState`);
    },

    setRecreateStores: (b) => {
        recreateStores = b;
    },

    /**
     * Returns filters concatenated into a WHERE clause
     *
     * @param layerName string
     * @returns {*|null}
     */
    getFilterStr(layerName) {
        let filterArr = this.getActiveLayerFilters(layerName);
        return filterArr.length > 0 ? filterArr[0] : null;
    },

    /**
     * Returns layerTree readiness
     *
     * @returns {Boolean}
     */
    isReady: () => {
        return moduleState.isReady;
    },

    /**
     * Returns last available layers order
     *
     * @returns {Object}
     */
    getLatestLayersOrder: () => {
        return moduleState.layerTreeOrder;
    },

    /**
     * Returns vector stores
     *
     * @returns {Object}
     */
    getStores: () => {
        return moduleState.vectorStores;
    },

    getTables: () => {
        return tables;
    },

    /**
     * Returns WebGL stores
     *
     * @returns {Object}
     */
    getWebGLStores: () => {
        return moduleState.webGLStores;
    },

    /**
     * Resets search
     *
     * @returns {void}
     */
    resetSearch: function () {
        sqlQuery.reset(qstore);
    },

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
        let parentFilters = _self.getParentLayerFilters(layerKey);
        let overallFilters = activeFilters.concat(parentFilters);
        if (overallFilters.length > 0) {
            let data = {};
            data[layerKey] = overallFilters;
            parameterString = `filters=` + base64url(JSON.stringify(data));
        }
        _self.activeFiltersChange(layerKey)

        return parameterString;
    },

    activeFiltersChange: (layerKey) => {
        const bg = $(`[data-gc2-layer-key^="${layerKey}"]`);
        let activeFilters = _self.getActiveLayerFilters(layerKey);
        let parentFilters = _self.getParentLayerFilters(layerKey);
        let overallFilters = activeFilters.concat(parentFilters);
        const show = overallFilters.length > 0;
        if (show) {
            bg.find(`.rounded-pill`).removeClass('d-none');
        } else {
            bg.find(`.rounded-pill`).addClass('d-none');
        }
        bg.find(`.set-extent-btn`).prop('disabled', !show);
    },

    /**
     * Returns list of currently enabled layers
     *
     * @returns {Array}
     */
    getActiveLayers: (ignoreEnabled = false) => {
        let result = [];
        let activeLayers = switchLayer.getLayersEnabledStatus();
        for (let key in activeLayers) {
            if (activeLayers[key].enabled || ignoreEnabled) {
                result.push(activeLayers[key].fullLayerKey);
            }
        }
        return result;
    },

    /**
     * Sets the layer state and, if layer panel if already drawn, applies state to the interface,
     * otherwise stores the state and recreates it upon first layer panel rendering.
     *
     * @param {Boolean} desiredSetupType Layer type to setup
     * @param {String}  layerKey         Layer key
     * @param {Boolean} ignoreErrors     Specifies if errors should be ignored
     * @param {Boolean} layerIsEnabled   Specifies if layer is enabled
     * @param {Boolean} forced           Specifies if layer visibility should be ignored
     * @param {Boolean} isVirtual        Specifies if layer is virtual
     * @param {DOMNode} virtualContainer Optional container node
     */
    setLayerState: (desiredSetupType, layerKey, ignoreErrors = true, layerIsEnabled = false, forced = false, isVirtual = false, virtualContainer = false) => {
        layerKey = layerTreeUtils.stripPrefix(layerKey);
        let layerMeta = meta.getMetaByKey(layerKey);

        let container = $(`[data-gc2-layer-key="${layerKey}.${layerMeta.f_geometry_column}"]`);
        if ($(container).length === 0 && virtualContainer) {
            container = virtualContainer;
        }

        if (layerIsEnabled) {
            _self._setupLayerWidgets(layerMeta, isVirtual, container);
        }

        if (container.length === 1) {
            if (!$(container).attr(`data-gc2-layer-key`)) {
                console.error(`Invalid container was provided`);
            }

            if ($(container).is(`:visible`) || forced) {
                moduleState.setLayerStateRequests[layerKey] = false;
                setTimeout(() => {
                    let parsedMeta = meta.parseLayerMeta(layerKey);

                    const hideFilters = () => {
                        $(container).find('.js-layer-settings-filters').hide(0);
                    };

                    const hideOpacity = () => {
                        $(container).find(`.js-toggle-opacity`).hide(0);
                        $(container).find('.js-layer-settings-opacity').hide(0);
                    };

                    const hideLabels = () => {
                        $(container).find(`.js-toggle-labels`).hide(0);
                        $(container).find('.js-layer-settings-labels').hide(0);
                    };

                    const hideLoadStrategy = () => {
                        $(container).find(`.js-toggle-load-strategy`).hide(0);
                        $(container).find('.js-layer-settings-load-strategy').hide(0);
                    };

                    const hideTableView = () => {
                        $(container).find(`.js-toggle-table`).hide(0);
                        $(container).find('.js-layer-settings-table').hide(0);
                    };

                    const hideStyleFn = () => {
                        $(container).find(`.js-toggle-style`).hide(0);
                        $(container).find('.js-layer-settings-style').hide(0);
                    };

                    const hideOfflineMode = () => {
                        $(container).find(`.js-toggle-layer-offline-mode-container`).css(`display`, `none`);
                    };

                    const hideSearch = () => {
                        $(container).find(`.js-toggle-search`).hide(0);
                        $(container).find('.js-layer-settings-search').hide(0);
                    };

                    const hideAddFeature = () => {
                        $(container).find('.gc2-add-feature').css(`display`, `none`);
                    };
                    const hideSettingsBtn = () => {
                        $(container).find('.js-settings-panel-btn').prop(`disabled`, true);
                        $(container).find('.collapse').collapse('hide');
                    };
                    const hideDownload = () => {
                        $(container).find(`.js-toggle-download`).hide(0);
                        $(container).find('.js-layer-settings-download').hide(0);
                    };

                    const deactivateAll = () => {
                        $(container).find('.js-toggle-btn').removeClass(`active`);
                    }
                    const getLayerSwitchControl = () => {
                        let controlElement = $('input[class="js-show-layer-control"][data-gc2-id="' + layerKey + '"]');
                        if (!controlElement || controlElement.length !== 1) {
                            return false;
                        } else {
                            return controlElement;
                        }
                    };

                    let el = getLayerSwitchControl();
                    if (el) {
                        el.prop('checked', layerIsEnabled);
                    }

                    if (desiredSetupType === LAYER.VECTOR) {
                        // Load strategy and filters should be kept opened after setLayerState()
                        if ($(container).attr(`data-last-layer-type`) !== desiredSetupType) {
                            hideOpacity();
                            hideLabels();
                        }

                        if (layerIsEnabled) {
                            $(container).find('.gc2-add-feature').css(`display`, `inline`);
                            $(container).find('.js-settings-panel-btn').prop(`disabled`, false);
                            $(container).find(`.js-toggle-search`).show(0);
                            $(container).find(`.js-toggle-load-strategy`).show(0);
                            $(container).find(`.js-toggle-layer-offline-mode-container`).css(`display`, `inline-block`);
                            $(container).find(`.js-toggle-table`).show(0);
                            $(container).find(`.js-toggle-style`).show(0);
                            $(container).find(`.js-toggle-download`).show(0);
                        } else {
                            hideAddFeature();
                            hideFilters();
                            hideOfflineMode();
                            hideLoadStrategy();
                            hideOpacity();
                            hideLabels();
                            hideTableView();
                            hideSearch();
                            hideStyleFn();
                            hideSettingsBtn();
                            deactivateAll();
                            hideDownload();
                        }
                    } else if (desiredSetupType === LAYER.RASTER_TILE || desiredSetupType === LAYER.VECTOR_TILE) {
                        // Opacity and filters should be kept opened after setLayerState()
                        if ($(container).attr(`data-last-layer-type`) !== desiredSetupType) {
                            hideLoadStrategy();
                            hideTableView();
                            hideStyleFn();
                            hideSettingsBtn();
                        }

                        hideOfflineMode();
                        if (layerIsEnabled) {
                            $(container).find('.gc2-add-feature').css(`display`, `inline`);
                            $(container).find('.js-settings-panel-btn').prop(`disabled`, false);
                            $(container).find(`.js-toggle-opacity`).show(0);
                            $(container).find(`.js-toggle-labels`).show(0);
                            $(container).find(`.js-toggle-filters`).show(0);
                            $(container).find(`.js-toggle-search`).show(0);
                            $(container).find(`.js-toggle-download`).show(0);
                        } else {
                            hideAddFeature();
                            hideFilters();
                            hideOpacity();
                            hideLabels();
                            hideSearch();
                            hideSettingsBtn();
                            deactivateAll();
                            hideDownload();
                        }

                        // Hide filters if cached, but not if layer has a valid predefined filter
                        if (parsedMeta && parsedMeta.single_tile) {
                            try {
                                if (!parsedMeta && parsedMeta.predefined_filters || typeof JSON.parse(parsedMeta.predefined_filters) !== "object") {
                                    hideFilters();
                                }
                            } catch (e) {
                                console.error(e)
                                hideFilters();
                            }
                        }

                        $(container).find('.js-layer-settings-filters').hide(0);
                        if (desiredSetupType === LAYER.VECTOR_TILE) {
                            hideOpacity();
                            hideLabels();
                            hideFilters();
                        }
                    } else if (desiredSetupType === LAYER.WEBGL) {
                        hideAddFeature();
                        hideFilters();
                        hideOfflineMode();
                        hideLoadStrategy();
                        hideTableView();
                        hideStyleFn();
                        hideOpacity();
                        hideLabels();
                        hideSearch();
                        hideSettingsBtn();
                        deactivateAll();
                    } else {
                        throw new Error(`${desiredSetupType} control setup is not supported yet`);
                    }
                    _self.activeFiltersChange(layerKey)

                    // Open filter dialog.
                    if (desiredSetupType === LAYER.RASTER_TILE || desiredSetupType === LAYER.VECTOR_TILE || desiredSetupType === LAYER.VECTOR) {
                        if (layerIsEnabled) {
                            if (parsedMeta.default_open_tools) {
                                try {
                                    let arr = JSON.parse(parsedMeta.default_open_tools);
                                    arr.forEach((i) => {
                                        setTimeout(() => {
                                            $(container).find('.collapse').collapse('show')
                                            if ($(container).find(`.js-toggle-${i}`).is(':visible')) {
                                                if (i !== "table") {
                                                    $(container).find(`.js-layer-settings-${i}`).show(0);
                                                    $(container).find(`.js-toggle-${i}`).addClass('active');
                                                } else {
                                                    console.info("'table is not supported in default open tools'")
                                                }
                                            }
                                        }, 100);
                                    })
                                } catch (e) {
                                    console.warn(`Unable to open tools for ${layerKey}`, parsedMeta[`default_open_tools`]);
                                }
                            }
                        }
                    }

                    // For all layer types
                    if (!layerIsEnabled) {
                        // Refresh all tables when closing one panel, because DOM changes can make the tables un-aligned
                        $(`.js-layer-settings-table table`).bootstrapTable('resetView');
                        // Remove active class from all buttons
                        $(container).find('a').removeClass('active');
                    }

                    $(container).attr(`data-last-layer-type`, desiredSetupType);

                }, 10);
            } else {
                if (layerKey in moduleState.setLayerStateRequests === false) {
                    moduleState.setLayerStateRequests[layerKey] = false;
                }

                moduleState.setLayerStateRequests[layerKey] = {
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
                _self.calculateOrder(moduleState.layerTreeOrder ? moduleState.layerTreeOrder : latestFullTreeStructure);
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

        let opacitySettings = moduleState.opacitySettings;
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

        let preparedVirtualLayers = [];
        moduleState.virtualLayers.map(layer => {
            let localLayer = Object.assign({}, layer);
            localLayer.store.sqlEncoded = base64url(localLayer.store.sql);
            preparedVirtualLayers.push(localLayer);
        });

        let order = moduleState.layerTreeOrder;

        return {
            order,
            arbitraryFilters: moduleState.arbitraryFilters,
            fitBoundsActiveOnLayers: moduleState.fitBoundsActiveOnLayers,
            labelSettings: moduleState.labelSettings,
            virtualLayers: preparedVirtualLayers,
            predefinedFilters: moduleState.predefinedFilters,
            activeLayers,
            layersOfflineMode,
            opacitySettings,
            dynamicLoad: moduleState.dynamicLoad,
            editorFilters: moduleState.editorFilters,
            editorFiltersActive: moduleState.editorFiltersActive,
            vectorStyles: moduleState.vectorStyles
        };
    },

    /**
     * Applies externally provided filters
     * @param filters
     */
    applyFilters: (filters) => {
        moduleState.arbitraryFilters = filters;
    },

    /**
     * Applies externally provided state
     * @param newState
     * @returns {newState}
     */
    applyState: (newState, dt = false) => {
        // Setting vector filters
        if (newState !== false && `arbitraryFilters` in newState && typeof newState.arbitraryFilters === `object`) {
            for (let key in newState.arbitraryFilters) {
                validateFilters(newState.arbitraryFilters[key]);
            }
            moduleState.arbitraryFilters = newState.arbitraryFilters;
        } else {
            moduleState.arbitraryFilters = {};
        }

        // Setting editorFilters
        if (newState !== false && `editorFilters` in newState && typeof newState.editorFilters === `object`) {
            moduleState.editorFilters = newState.editorFilters;
        } else {
            moduleState.editorFilters = {};
        }
        if (newState !== false && `editorFiltersActive` in newState && typeof newState.editorFiltersActive === `object`) {
            moduleState.editorFiltersActive = newState.editorFiltersActive;
        } else {
            moduleState.editorFiltersActive = {};
        }

        // Setting tile filters
        if (newState !== false && `predefinedFilters` in newState && typeof newState.predefinedFilters === `array`) {
            moduleState.predefinedFilters = newState.predefinedFilters;
        } else {
            moduleState.predefinedFilters = {};
        }

        // Setting virtual layers
        if (newState !== false && `virtualLayers` in newState && Array.isArray(newState.virtualLayers) && newState.virtualLayers.length > 0) {
            let layersCopy = JSON.parse(JSON.stringify(newState.virtualLayers));
            let someLayersAreOutdated = false;
            layersCopy.map((layer, index) => {
                if (`sqlEncoded` in layer.store && layer.store.sqlEncoded) {
                    layersCopy[index].store.sql = atob(layer.store.sqlEncoded);
                } else {
                    someLayersAreOutdated = true;
                    console.warn(`Please update the snapshot, virtual layers have unsupported format`);
                }
            });

            if (someLayersAreOutdated) {
                newState.virtualLayers = [];
            } else {
                newState.virtualLayers = layersCopy;
            }
        } else if (newState !== false) {
            newState.virtualLayers = [];
        }

        queueStatistsics.setLastStatistics(false);
        if (newState === false) {
            newState = {
                order: false,
                activeLayers: [],
                opacitySettings: {},
                layersOfflineMode: {},
                virtualLayers: [],
                predefinedFilters: {},
                arbitraryFilters: {},
                editorFilters: {},
                editorFiltersActive: {},
                vectorStyles: {}
            };
        } else if (newState.order && newState.order === 'false') {
            newState.order = false;
        }
        return _self.create(newState, [], false, null, dt);
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
    create: (forcedState = false, ignoredInitialStateKeys = [], dontRegisterEvents = false, filter = null, dt = false) => {
        if (LOG) console.log(`${MODULE_NAME}: create`, moduleState.isBeingBuilt, forcedState);

        queueStatistsics.setLastStatistics(false);

        /**
         * Opacity settings needs to be applied when layer is loaded. As layer loading takes some
         * time, the application of opacity setting has to be postponed as well. The setLayerOpacityRequests
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
         * Layers are initially loaded after the layerTree is created, so once all layers are loaded,
         * counters of active / added layers needs to be updated
         */
        backboneEvents.get().once(`allDoneLoading:layers`, () => {
            let metaData = meta.getMetaData(filter);
            let groupsToActiveLayers = {};
            let groupsToAddedLayers = {};
            let activeLayers = switchLayer.getLayersEnabledStatus();
            for (let u = 0; u < metaData.data.length; ++u) {
                if (metaData.data[u].layergroup) {
                    let base64GroupName = Base64.encode(metaData.data[u].layergroup).replace(/=/g, "");
                    if (!groupsToActiveLayers[base64GroupName]) groupsToActiveLayers[base64GroupName] = 0;
                    if (!groupsToAddedLayers[base64GroupName]) groupsToAddedLayers[base64GroupName] = 0;

                    let layerKey = metaData.data[u].f_table_schema + `.` + metaData.data[u].f_table_name;
                    if (activeLayers[layerKey] && activeLayers[layerKey].enabled) {
                        groupsToActiveLayers[base64GroupName]++;
                    }

                    groupsToAddedLayers[base64GroupName]++;
                }
            }

            for (let key in groupsToActiveLayers) {
                layerTreeUtils.setupLayerNumberIndicator(key, groupsToActiveLayers[key], groupsToAddedLayers[key]);
            }
        });

        /**
         * Listening to event that indicates if viewport tiles of specific layer contain any data
         * Legend for layer will be hidden if it doesn't contain data.
         */
        backboneEvents.get().on(`tileLayerVisibility:layers`, (data) => {
            moduleState.tileContentCache[data.id] = data.dataIsVisible;
            $(`[data-gc2-layer-key^="${data.id}."]`).find(`.js-tiles-contain-data`).css(`display`, (data.dataIsVisible ? `inline` : `none`));
            if (data.shouldLegendReact) {
                const poll = (d) => {
                    let clone = JSON.parse(JSON.stringify(d));
                    const s = `#legend [data-gc2-id^="${clone.id}"]`;
                    let e = document.querySelector(s);
                    if (e) {
                        const p = e.parentElement.parentElement.parentElement;
                        p.style.setProperty(`display`, (clone.dataIsVisible ? `inline` : `none`));
                    } else {
                        setTimeout(() => poll(clone), 100)
                    }
                };
                poll.bind(this, data)();
            }
        });

        /**
         * Some vector layer needs to be reloaded when the map view is changed if the dynamic
         * loading is enabled for the layer.
         */
        if (!dontRegisterEvents) {
            cloud.get().map.off(`moveend`, moveEndEvent);
            moveEndEvent = () => {
                let activeLayers = _self.getActiveLayers();

                let stores = [];
                for (let layerKey in moduleState.vectorStores) {
                    stores[layerKey] = moduleState.vectorStores[layerKey];
                }

                for (let layerKey in moduleState.webGLStores) {
                    stores[layerKey] = moduleState.webGLStores[layerKey];
                }

                for (let layerKey in stores) {
                    let layerIsEnabled = false;
                    let layerPrefix = ``;
                    for (let i = 0; i < activeLayers.length; i++) {
                        if (layerTreeUtils.stripPrefix(activeLayers[i]) === layerTreeUtils.stripPrefix(layerKey)) {
                            if (activeLayers[i].indexOf(`:`) > -1) {
                                layerPrefix = activeLayers[i].split(`:`)[0];
                            }

                            layerIsEnabled = true;
                            break;
                        }
                    }

                    if (layerIsEnabled) {
                        let localTypeStores = false;
                        if (layerPrefix === LAYER.VECTOR) {
                            localTypeStores = moduleState.vectorStores;
                        } else if (layerPrefix === LAYER.WEBGL) {
                            localTypeStores = moduleState.webGLStores;
                        }

                        let layerKeyNoPrefix = layerTreeUtils.stripPrefix(layerKey);
                        let layerDescription = meta.getMetaByKey(layerKeyNoPrefix);
                        let parsedMeta = _self.parseLayerMeta(layerDescription);

                        // Reload should always occur except times when current bbox is completely inside
                        // of the previously requested bbox (extended one in gc2cloud.js) kept in corresponding store
                        let needToReload;
                        if (layerPrefix === LAYER.VECTOR && ((parsedMeta && `load_strategy` in parsedMeta && parsedMeta.load_strategy === `d`)
                            || (layerKeyNoPrefix in moduleState.dynamicLoad && moduleState.dynamicLoad[layerKeyNoPrefix] === true)) && localTypeStores?.[layerKey]) {
                            needToReload = true;
                            let currentMapBBox = cloud.get().map.getBounds();
                            if (`buffered_bbox` in localTypeStores[layerKey]) {
                                if (localTypeStores[layerKey].buffered_bbox === false || localTypeStores[layerKey].buffered_bbox && localTypeStores[layerKey].buffered_bbox.contains(currentMapBBox)) {
                                    needToReload = false;
                                }
                                if (localTypeStores[layerKey].featuresLimitReached) {
                                    needToReload = true;
                                }
                            }
                        } else {
                            needToReload = false;
                        }

                        if (needToReload) {
                            localTypeStores[layerKey].abort();
                            localTypeStores[layerKey].load();
                        }
                    }
                }
            }
            cloud.get().map.on(`moveend`, moveEndEvent);
        }

        let result;
        if (moduleState.isBeingBuilt) {
            result = new Promise((resolve, reject) => {
                console.trace(`async`);
                console.error(`Asynchronous layerTree.create() attempt, forced state:`, forcedState);
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
                        let enabledLayers = switchLayer.getLayersEnabledStatus();
                        if (LOG) console.log(`${MODULE_NAME}: disabling active layers`, enabledLayers);
                        for (let key in enabledLayers) {
                            if (enabledLayers[key].enabled) {
                                if (!dt) switchLayer.init(key, false, true, false);
                            }
                        }
                    }

                    // Emptying the tree
                    $("#layers").empty();
                    _self.applyStoredSettings(ignoredInitialStateKeys).then(({order, offlineModeSettings}) => {

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

                                if (`virtualLayers` in forcedState && forcedState.virtualLayers) {
                                    moduleState.virtualLayers = forcedState.virtualLayers;
                                    moduleState.virtualLayers.map(item => {
                                        let simulatedMetaData = _self.createSimulatedLayerDescriptionForVirtualLayer(item);
                                        meta.addMetaData({data: [simulatedMetaData]});
                                    });
                                }

                                order = forcedState.order;
                                if (`activeLayers` in forcedState) {
                                    activeLayers = forcedState.activeLayers;
                                }

                                let existingMeta = meta.getMetaData(filter);
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

                                if (forcedState.opacitySettings) moduleState.opacitySettings = forcedState.opacitySettings;
                                if (forcedState.predefinedFilters) moduleState.predefinedFilters = forcedState.predefinedFilters;
                                if (forcedState.arbitraryFilters) moduleState.arbitraryFilters = forcedState.arbitraryFilters;
                                //if (forcedState.fitBoundsActiveOnLayers) moduleState.fitBoundsActiveOnLayers = forcedState.fitBoundsActiveOnLayers;
                                if (forcedState.labelSettings) moduleState.labelSettings = forcedState.labelSettings;
                                if (forcedState.dynamicLoad) moduleState.dynamicLoad = forcedState.dynamicLoad;
                                if (forcedState.editorFilters) moduleState.editorFilters = forcedState.editorFilters;
                                if (forcedState.editorFiltersActive) moduleState.editorFiltersActive = forcedState.editorFiltersActive;
                                if (forcedState.vectorStyles) moduleState.vectorStyles = forcedState.vectorStyles;

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

                            for (let key in moduleState.labelSettings) {
                                if (moduleState.labelSettings[key] === `true` || moduleState.labelSettings[key] === true) {
                                    moduleState.labelSettings[key] = true;
                                } else {
                                    moduleState.labelSettings[key] = false;
                                }
                            }

                            if (LOG) console.log(`${MODULE_NAME}: activeLayers`, activeLayers);
                            const proceedWithBuilding = () => {
                                moduleState.layerTreeOrder = order;
                                if (moduleState.editingIsEnabled) {
                                    let toggleOfllineOnlineMode = _self._setupToggleOfflineModeControl();
                                    // if (toggleOfllineOnlineMode) {
                                    //     $("#layers").append(toggleOfllineOnlineMode);
                                    // }
                                }

                                let groups = [];

                                // Getting set of all loaded vectors
                                let metaData = meta.getMetaData(filter);
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

                                $("#layers").append(`<div class="layer-list vstack gap-2"></div>`);

                                // Filling up groups and underlying layers (except ungrouped ones)
                                latestFullTreeStructure = [];
                                for (let i = 0; i < arr.length; ++i) {
                                    if (arr[i] && arr[i] !== "<font color='red'>[Ungrouped]</font>") {
                                        let sortedLayers = _self.createGroupRecord(arr[i], order, forcedState, precheckedLayers, filter);
                                        latestFullTreeStructure.push({
                                            id: arr[i],
                                            type: GROUP_CHILD_TYPE_GROUP,
                                            children: sortedLayers
                                        });
                                    }
                                }

                                _self._setupToggleOfflineModeControlsForLayers().then(() => {
                                    $(`.layer-list`).sortable({
                                        axis: 'y',
                                        handle: `.layer-move-vert`,
                                        stop: (event, ui) => {
                                            _self.calculateOrder(moduleState.layerTreeOrder ? moduleState.layerTreeOrder : latestFullTreeStructure);
                                            backboneEvents.get().trigger(`${MODULE_NAME}:sorted`);
                                            layers.reorderLayers();
                                        }
                                    });

                                    if (queueStatistsics.getLastStatistics()) {
                                        _self._statisticsHandler(queueStatistsics.getLastStatistics(), false, true);
                                    }

                                    layers.reorderLayers();

                                    backboneEvents.get().trigger(`${MODULE_NAME}:sorted`);
                                    setTimeout(() => {

                                        if (LOG) console.log(`${MODULE_NAME}: active layers`, activeLayers);

                                        const turnOnActiveLayersAndFinishBuilding = () => {
                                            return new Promise((localResolve, reject) => {
                                                if (activeLayers) {
                                                    let layersAreActivatedPromises = [];
                                                    activeLayers.map(layerName => {
                                                        let noPrefixName = layerTreeUtils.stripPrefix(layerName);
                                                        if (!dt) layersAreActivatedPromises.push(switchLayer.init(layerName, true, true));
                                                    });

                                                    // Init legend after a state is invoked but not if print
                                                    // because the print process will end with a legend init.
                                                    Promise.all(layersAreActivatedPromises).then(() => {
                                                        if (!urlparser.urlVars.k) {
                                                            legend.init();
                                                        }
                                                    });
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
                                                        layerTreeUtils.queryServiceWorker({action: `disableOfflineModeForAll`}).then(result => {
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
                                                // Service worker is registered
                                                setOfflineModeSettingsForCache().then(resolve);
                                            } else {
                                                // Service worker is NOT registered but don't wait
                                                turnOnActiveLayersAndFinishBuilding().then(resolve);

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
                                            // Browser doesn't support service workers
                                            turnOnActiveLayersAndFinishBuilding().then(resolve);
                                        }
                                    }, 1000);
                                });
                            }

                            if (layersThatAreNotInMeta.length > 0) {
                                let fetchMetaRequests = [];
                                fetchMetaRequests.push(meta.init(layersThatAreNotInMeta.join(','), true, true).catch(error => {
                                    return false
                                }))
                                Promise.all(fetchMetaRequests).then(() => {
                                    proceedWithBuilding();
                                });
                            } else {
                                proceedWithBuilding();
                            }

                        } catch (e) {
                            console.error(e);
                        }

                    });

                } catch (e) {
                    console.error(e);
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
        if (moduleState.wasBuilt === false || _self.isReady() === false) {
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
     * @param {Array<String>} ignoredInitialStateKeys Settings that need to be ignored
     *
     * @returns {Promise}
     */
    applyStoredSettings: (ignoredInitialStateKeys) => {
        let result = new Promise((resolve, reject) => {
            state.getModuleState(MODULE_NAME).then(initialState => {
                let order = ((initialState && `order` in initialState) ? initialState.order : false);
                let offlineModeSettings = ((initialState && `layersOfflineMode` in initialState) ? initialState.layersOfflineMode : false);

                const applySetting = (key, defaultValue) => {
                    let initialValue = ((initialState && key in initialState) ? initialState[key] : defaultValue);
                    if (initialValue && ignoredInitialStateKeys.indexOf(key) === -1) {
                        moduleState[key] = initialValue;
                    }
                };

                applySetting(`arbitraryFilters`, {});
                applySetting(`fitBoundsActiveOnLayers`, {});
                applySetting(`labelSettings`, {});
                applySetting(`predefinedFilters`, {});
                applySetting(`editorFilters`, {});
                applySetting(`editorFiltersActive`, {});
                applySetting(`virtualLayers`, []);
                applySetting(`opacitySettings`, {});
                applySetting(`dynamicLoad`, {});
                applySetting(`vectorStyles`, {});

                resolve({order, offlineModeSettings});
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
                if (typeof preParsedMeta === 'object' && preParsedMeta instanceof Object && !(preParsedMeta instanceof Array)) {
                    parsedMeta = preParsedMeta;
                }
            } catch (e) {
                console.warn(`Unable to parse meta for ${layerKey}`);
            }
        }

        return parsedMeta;
    },

    /**
     * Checks if maximum number of features was reached when loading layer
     *
     * @param {String} layerKey Layer key
     *
     * @return {void}
     */
    maxFeaturesNotification: (layerKey) => {
        utils.showInfoToast(__("max_number_of_loaded_features_was_reached_notification") + ' ' + layerKey);
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
        if (layer.virtual_layer) {
            isVirtual = true;
        }
        let parentFiltersHash = ``;
        let layerKey = layer.f_table_schema + '.' + layer.f_table_name;
        const layerSpecificQueryLimit = layerTreeUtils.getQueryLimit(meta.parseLayerMeta(layerKey));
        let sql = `SELECT *
                   FROM ${layerKey} LIMIT ${layerSpecificQueryLimit}`;
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
            let parentFilters = _self.getParentLayerFilters(layerKey);
            let overallFilters = activeFilters.concat(parentFilters);
            overallFilters.map(item => {
                whereClauses.push(item);
            });
            if (parentFilters && parentFilters.length > 0) {
                parentFiltersHash = btoa(JSON.stringify(parentFilters));
            }
            _self.activeFiltersChange(layerKey)

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
                sql = `SELECT *
                       FROM ${layerKey}
                       WHERE (${whereClauses.join(` AND `)}) LIMIT ${layerSpecificQueryLimit}`;
            }
        }

        let custom_data = ``;
        if (`virtual_layer` in layer && layer.virtual_layer) {
            custom_data = encodeURIComponent(JSON.stringify({virtual_layer: layerKey}));
        }

        let trackingLayerKey = (LAYER.VECTOR + ':' + layerKey);

        /*
            Setting up mouse over
         */
        let metaData = meta.getMetaDataKeys();
        let parsedMeta = _self.parseLayerMeta(metaData[layerKey]), template, tooltipTemplate;
        const defaultTemplate =
            `<div>
                        {{#each data}}
                            {{this.title}}: {{this.value}} <br>
                        {{/each}}
                        </div>`;
        if (parsedMeta?.info_template_hover && parsedMeta.info_template_hover !== "") {
            template = parsedMeta.info_template_hover;
        } else {
            template = defaultTemplate;
        }
        tooltipTemplate = typeof moduleState.vectorStyles?.[layerKey]?.tooltipTmpl !== 'undefined' ? moduleState.vectorStyles[layerKey].tooltipTmpl === '' ? undefined : moduleState.vectorStyles[layerKey].tooltipTmpl : parsedMeta?.tooltip_template && parsedMeta.tooltip_template !== "" ? parsedMeta.tooltip_template : null;
        let fieldConf;
        try {
            fieldConf = JSON.parse(metaData[layerKey].fieldconf);
        } catch (e) {
            fieldConf = {};
        }
        const pane = layer.f_table_schema + '-' + layer.f_table_name;
        let hl = null;
        try {
            hl = meta.parseLayerMeta(layerKey)?.line_highlight_style ? JSON.parse(meta.parseLayerMeta(layerKey).line_highlight_style) : null
        } catch (e) {
            hl = null;
            console.error(`Error in highlight style for ${layerKey}`, e.message);
        }
        if (typeof moduleState.vectorStores[trackingLayerKey] !== "object" || recreateStores) {
            moduleState.vectorStores[trackingLayerKey] = new geocloud.sqlStore({
                map: cloud.get().map,
                minZoom: parseInt(meta.parseLayerMeta(layerKey)?.vector_min_zoom),
                maxZoom: parseInt(meta.parseLayerMeta(layerKey)?.vector_max_zoom) + 1,
                pane,
                parentFiltersHash,
                jsonp: false,
                method: "POST",
                host: "",
                db: urlparser.db,
                maxFeaturesLimit: layerSpecificQueryLimit,
                onMaxFeaturesLimitReached: () => {
                    _self.maxFeaturesNotification(layerKey);
                },
                uri: "/api/sql",
                clickable: true,
                id: trackingLayerKey,
                name: trackingLayerKey,
                lifetime: 0,
                custom_data,
                styleMap: styles[trackingLayerKey],
                sql,
                clustering: layerTreeUtils.getIfClustering(meta.parseLayerMeta(layerKey)),
                hl,
                onLoad: (l) => {
                    let reloadInterval = meta.parseLayerMeta(layerKey)?.reload_interval;
                    let tableElement = meta.parseLayerMeta(layerKey)?.show_table_on_side;
                    // Create side table once
                    if (tableElement) {
                        let styles;
                        let height = null;
                        let tableBodyHeight;
                        const h = window.vidiConfig.vectorTable.height;
                        const w = window.vidiConfig.vectorTable.width;
                        const position = window.vidiConfig.vectorTable.position;
                        const e = $('#pane');
                        if (position === 'right') {
                            styles = `width: ${w}; float: right;`;
                            e.css("width", `calc(100vw - ${w})`);
                            e.css("left", "0");
                            tableBodyHeight = "calc(100vh - 34px)";
                            height = $(window).height();
                        } else if (position === 'bottom') {
                            styles = `width: 100%; height: ${h}; bottom: 0; position: fixed;`;
                            e.css("height", `calc(100vh - ${h})`);
                            height = parseInt(h);
                            tableBodyHeight = (height - 34) + "px"
                        }
                        if (position === 'right' || position === 'bottom') {
                            e.before(`<div id="${VECTOR_SIDE_TABLE_EL}" style="${styles}; background-color: white; " data-vidi-vector-table-id="${trackingLayerKey}"></div>`)
                            _self.createTable(layerKey, true, "#" + VECTOR_SIDE_TABLE_EL, {
                                showToggle: false,
                                showExport: false,
                                showColumns: false,
                                showSearch: false,
                                cardView: false,
                                height: height,
                                tableBodyHeight: tableBodyHeight
                            });
                        }
                    }
                    if (reloadInterval && reloadInterval !== "") {
                        let reloadCallback = meta.parseLayerMeta(layerKey)?.reload_callback;
                        let func = reloadCallback && reloadCallback !== "" ? Function('"use strict";return (' + reloadCallback + ')')() : () => {
                        };
                        func(l, cloud.get().map);
                        clearInterval(reloadIntervals[layerKey]);
                        reloadIntervals[layerKey] = setInterval(() => {
                            l.load();
                        }, parseInt(reloadInterval));
                    }
                    layers.decrementCountLoading(l.id);
                    backboneEvents.get().trigger("doneLoading:layers", l.id);
                    // We fire activeLayersChange event on load, so we are sure state is updated
                    backboneEvents.get().trigger(`${MODULE_NAME}:activeLayersChange`);
                    if (typeof onLoad[LAYER.VECTOR + ':' + layerKey] === "function") {
                        onLoad[LAYER.VECTOR + ':' + layerKey](l);
                    }
                    if (l.geoJSON === null) {
                        return
                    }
                    sqlQuery.prepareDataForTableView(LAYER.VECTOR + ':' + layerKey, l.geoJSON.features);
                },
                transformResponse: (response, id) => {
                    return apiBridgeInstance.transformResponseHandler(response, id);
                },
                onEachFeature: (feature, layer) => {
                    if (parsedMeta?.hover_active) {
                        _self.mouseOver(layer, fieldConf, template);
                    }
                    if (tooltipTemplate) {
                        _self.toolTip(layer, feature, tooltipTemplate, pane);
                    }
                    // TODO test with and without crossMultiSelect
                    if ((LAYER.VECTOR + ':' + layerKey) in onEachFeature && !window.vidiConfig.crossMultiSelect) {
                        /*
                            Checking for correct onEachFeature structure
                        */
                        if (!(`fn` in onEachFeature[LAYER.VECTOR + ':' + layerKey]) || !onEachFeature[LAYER.VECTOR + ':' + layerKey].fn || !(`caller` in onEachFeature[LAYER.VECTOR + ':' + layerKey]) || !onEachFeature[LAYER.VECTOR + ':' + layerKey].caller) {
                            throw new Error(`Invalid onEachFeature structure`);
                        }
                        onEachFeature[LAYER.VECTOR + ':' + layerKey].fn(feature, layer);
                        if (onEachFeature[LAYER.VECTOR + ':' + layerKey].caller === `editor`) {
                            // TODO Is this used?
                            /*
                                If the handler was set by the editor extension, then display the attributes popup and editing buttons
                            */
                            if (`editor` in extensions) {
                                editor = extensions.editor.index;
                            }
                            layer.on("click", function (e) {
                                _self.resetAllVectorLayerStyles();
                                sqlQuery.resetAll();

                                // Scale icon markers
                                if (e.target?._icon) {
                                    _self.scaleIcon(e.target._icon)
                                }

                                if (!window.vidiConfig.crossMultiSelect && e.target?.setStyle) {
                                    e.target.setStyle(SELECTED_STYLE);
                                }
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

                                _self.displayAttributesPopup([{
                                    feature: feature,
                                    layer: layer,
                                    layerKey: layerKey,
                                    vector: true
                                }], e, '', false);
                            });
                        }

                    } else {
                        // If there is no handler for specific layer, then display attributes only
                        layer.on("click", function (e) {
                            _self.resetAllVectorLayerStyles();
                            sqlQuery.resetAll();
                            // Cross Multi select disabled
                            if (!window.vidiConfig?.crossMultiSelect) {
                                if (e.target?.setStyle) {
                                    e.target.setStyle(SELECTED_STYLE);

                                }
                                // Scale icon markers
                                if (e.target?._icon) {
                                    _self.scaleIcon(e.target._icon)
                                }

                                _self.displayAttributesPopup([{
                                        feature: feature,
                                        layer: layer,
                                        layerKey: layerKey,
                                        vector: true
                                    }],
                                    e, '', false);
                                return
                            }

                            // Cross multi select enabled
                            let coord3857 = utils.transform("EPSG:4326", "EPSG:3857", [e.latlng.lng, e.latlng.lat]);
                            let wkt = "POINT(" + coord3857[0] + " " + coord3857[1] + ")";
                            let intersectingFeatures = [];
                            // Get active raster tile layers, so we can check if database should be queried
                            let activelayers = layers.getMapLayers() ? layers.getLayers().split(",") : [];
                            let activeTilelayers = activelayers.filter(e => {
                                if (e.split(':').length === 1) {
                                    const m = meta.getMetaByKey(e)
                                    if (m?.not_querable !== true) {
                                        return true;
                                    }
                                }
                            })
                            // Filter tiles layer without pixels
                            activeTilelayers = activeTilelayers.filter((key) => {
                                if (typeof moduleState.tileContentCache[key] === "boolean" && moduleState.tileContentCache[key] === true) {
                                    return true;
                                }
                            })
                            if (activeTilelayers.length > 0) {
                                sqlQuery.init(qstore, wkt, "3857", (store) => {
                                    setTimeout(() => {
                                        if (store.geoJSON) {
                                            sqlQuery.prepareDataForTableView(LAYER.VECTOR + ':' + store.key, store.geoJSON.features);
                                            store.layer.eachLayer((layer) => {
                                                intersectingFeatures.push({
                                                    feature: layer.feature,
                                                    layer: layer,
                                                    layerKey: store.key
                                                });
                                            })
                                        }
                                        layers.decrementCountLoading("_vidi_sql_" + store.id);
                                        backboneEvents.get().trigger("doneLoading:layers", "_vidi_sql_" + store.id);
                                        if (layers.getCountLoading() === 0) {
                                            _self.displayAttributesPopup(intersectingFeatures, e);
                                        }
                                    }, 200)
                                }, null, [coord3857[0], coord3857[1]]);
                            }
                            const distance = 10 * MAP_RESOLUTIONS[cloud.get().getZoom()];
                            const clickFeature = turfBuffer(turfPoint([e.latlng.lng, e.latlng.lat]), distance, {units: 'meters'});
                            let mapObj = cloud.get().map;
                            for (let l in mapObj._layers) {
                                let overlay = mapObj._layers[l];
                                if (overlay._layers) {
                                    for (let f in overlay._layers) {
                                        if (!overlay._layers[f]?.feature?.geometry || overlay?.id?.startsWith('HL:')) {
                                            continue;
                                        }
                                        let featureForChecking = overlay._layers[f];
                                        let feature = turfFeature(featureForChecking.feature.geometry);
                                        try {
                                            if (turfIntersects(clickFeature, feature) && overlay.id) {
                                                const layerId = overlay.id.split(":")[1];
                                                try {
                                                    const zoom = mapObj.getZoom();
                                                    const parsedMeta = JSON.parse(meta.getMetaByKey(layerId).meta);
                                                    const minZoom = parseInt(parsedMeta.vector_min_zoom);
                                                    const maxZoom = parseInt(parsedMeta.vector_max_zoom);
                                                    if (minZoom > zoom || maxZoom < zoom) {
                                                        console.log(layerId + " is out of min/max zoom")
                                                        continue;
                                                    }
                                                } catch (e) {
                                                    console.error(e)
                                                }
                                                intersectingFeatures.push({
                                                    feature: featureForChecking.feature,
                                                    layer: featureForChecking,
                                                    layerKey: overlay.id.split(":")[1],
                                                    vector: true
                                                })
                                            }
                                        } catch (e) {
                                            console.log(e);
                                        }
                                    }
                                }
                            }
                            // No active raster tile layers - open the pop-up
                            if (activeTilelayers.length === 0) {
                                _self.displayAttributesPopup(intersectingFeatures, e);
                            }
                        });
                    }
                },
                pointToLayer: (pointToLayer.hasOwnProperty(LAYER.VECTOR + ':' + layerKey) ? pointToLayer[LAYER.VECTOR + ':' + layerKey] : (feature, latlng) => {
                    return L.circleMarker(latlng, {pane, bubblingMouseEvents: false});
                }),
                error: layerTreeUtils.storeErrorHandler
            });
        }
    },

    /**
     * Creates SQL store for WebGL layers
     *
     * @param {Object} layer Layer description
     *
     * @returns {void}
     */
    createWebGLStore: (layer) => {
        let layerKey = layer.f_table_schema + '.' + layer.f_table_name;
        const layerSpecificQueryLimit = layerTreeUtils.getQueryLimit(meta.parseLayerMeta(layerKey));
        let sql = `SELECT *
                   FROM ${layerKey} LIMIT ${layerSpecificQueryLimit}`;

        let whereClauses = [];
        let activeFilters = _self.getActiveLayerFilters(layerKey);
        let parentFilters = _self.getParentLayerFilters(layerKey);

        let overallFilters = activeFilters.concat(parentFilters);
        overallFilters.map(item => {
            whereClauses.push(item);
        });
        _self.activeFiltersChange(layerKey)
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
            sql = `SELECT *
                   FROM ${layerKey}
                   WHERE (${whereClauses.join(` AND `)}) LIMIT ${layerSpecificQueryLimit}`;
        }

        let trackingLayerKey = (LAYER.WEBGL + ':' + layerKey);
        moduleState.webGLStores[trackingLayerKey] = new geocloud.webGLStore({
            type: layer.type,
            map: cloud.get().map,
            jsonp: false,
            method: "POST",
            host: "",
            db: urlparser.db,
            maxFeaturesLimit: layerSpecificQueryLimit,
            onMaxFeaturesLimitReached: () => {
                _self.maxFeaturesNotification(layerKey);
            },
            uri: "/api/sql",
            clickable: true,
            id: trackingLayerKey,
            name: trackingLayerKey,
            lifetime: 0,
            styleMap: styles[trackingLayerKey],
            sql,
            onLoad: (l) => {
                if (l === undefined) return;

                layers.decrementCountLoading(l.id);
                backboneEvents.get().trigger("doneLoading:layers", l.id);

                if (typeof onLoad[LAYER.WEBGL + ':' + layerKey] === "function") {
                    onLoad[LAYER.WEBGL + ':' + layerKey](l);
                }
            },
            onEachFeature: (feature, layer) => {
                if ((LAYER.WEBGL + ':' + layerKey) in onEachFeature) {
                    /*
                        Checking for correct onEachFeature structure
                    */
                    if (`fn` in onEachFeature[LAYER.WEBGL + ':' + layerKey] === false || !onEachFeature[LAYER.WEBGL + ':' + layerKey].fn ||
                        `caller` in onEachFeature[LAYER.WEBGL + ':' + layerKey] === false || !onEachFeature[LAYER.WEBGL + ':' + layerKey].caller) {
                        throw new Error(`Invalid onEachFeature structure`);
                    }

                    onEachFeature[LAYER.WEBGL + ':' + layerKey].fn(feature, layer);
                } else {
                    // If there is no handler for specific layer, then display attributes only
                    layer.on("click", function (e) {
                        _self.displayAttributesPopup(feature, layer, e);
                    });
                }
            },
            error: layerTreeUtils.storeErrorHandler
        });
    },

    /**
     * Creates gc2table control for layer
     *
     * @param {String}  layerKey      Layer key
     * @param {Boolean} forceDataLoad Specifies if the data load should be forced
     *
     */
    createTable(layerKey, forceDataLoad = false, element = null, conf) {
        let prop, defaults = {
            showToggle: true,
            showExport: false,
            showColumns: true,
            showSearch: false,
            cardView: false,
            height: 250,
            tableBodyHeight: null
        };
        if (conf) {
            for (prop in conf) {
                defaults[prop] = conf[prop];
            }
        }
        let layerWithData = layers.getMapLayers(false, LAYER.VECTOR + ':' + layerKey);
        if (layerWithData.length === 1) {
            let tableContainerId = element ? element : `#table_view-${layerKey.replace(".", "_")}`;
            if ($(tableContainerId + ` table`).length > 0) $(tableContainerId).empty();
            $(tableContainerId).append(`<table class="table table-sm" data-show-toggle="${defaults.showToggle}" data-search-highlight="true"  data-search="${defaults.showSearch}" data-show-export="${defaults.showExport}" data-show-columns="${defaults.showColumns}" data-card-view="${defaults.cardView}"></table>`);

            let metaDataKeys = meta.getMetaDataKeys();
            let template = sqlQuery.getVectorTemplate(layerKey);
            let tableHeaders = sqlQuery.prepareDataForTableView(LAYER.VECTOR + ':' + layerKey,
                JSON.parse(JSON.stringify(layerWithData[0].toGeoJSON(GEOJSON_PRECISION).features)));

            window.operateFormatter = (value, row, index) => {
                return `
                    <div class="d-flex justify-content-around">
                    <a class="btn btn-light btn-sm filter" href="javascript:void(0)" title="Filter">
                        <i class="bi bi-filter-square text-primary"></i>
                    </a>
                    <a class="btn btn-light btn-sm unfilter" href="javascript:void(0)" title="Unfilter">
                        <i class="bi bi-x-lg text-danger"></i>
                    </a>
                    </div>
                    `;
            }
            const filter = (row) => {
                console.log(row)
                _self.onApplyArbitraryFiltersHandler({
                    layerKey,
                    filters: {
                        match: "any",
                        columns: [
                            {
                                fieldname: "gid",
                                expression: "=",
                                value: row.gid.toString(),
                                restriction: false
                            }
                        ]
                    }
                }, LAYER.VECTOR);
            }
            const unfilter = () => {
                _self.onDisableArbitraryFiltersHandler(layerKey)
                _self.onApplyArbitraryFiltersHandler({
                    layerKey,
                    filters: {
                        match: "any",
                        columns: []
                    }
                }, LAYER.VECTOR)
            }
            window.operateEvents = {
                'click .filter': (e, value, row, index) => filter(row),
                'click .unfilter': (e, value, row, index) => unfilter()
            }

            /*
                        tableHeaders.push({
                            header: "Filter",
                            dataIndex: "filter",
                            formatter: "operateFormatter",
                            events: "operateEvents"
                        })
            */

            let styleSelected = (onSelectedStyle[LAYER.VECTOR + ':' + layerKey] ? onSelectedStyle[LAYER.VECTOR + ':' + layerKey] : {
                weight: 5,
                color: '#666',
                dashArray: '',
                fillOpacity: 0.2
            });

            let parsedMeta = _self.parseLayerMeta(meta.getMetaByKey(layerKey, false));

            let selectCallBack = () => {
            };
            if (typeof parsedMeta.select_function !== "undefined" && parsedMeta.select_function !== "") {
                try {
                    selectCallBack = Function('"use strict";return (' + parsedMeta.select_function + ')')();
                } catch (e) {
                    const f = `
                            function(id, layer, key, sqlQuery) {
                                ${parsedMeta.select_function}
                            }
                            `;
                    selectCallBack = Function('"use strict";return (' + f + ')')();
                }
            }

            let localTable = gc2table.init({
                el: tableContainerId + ` table`,
                ns: tableContainerId,
                geocloud2: cloud.get(),
                store: moduleState.vectorStores[LAYER.VECTOR + ':' + layerKey],
                cm: tableHeaders,
                autoUpdate: false,
                autoPan: window.vidiConfig.autoPanPopup,
                openPopUp: false,
                setViewOnSelect: true,
                responsive: false,
                callCustomOnload: true,
                assignFeatureEventListenersOnDataLoad: true,
                height: defaults.height,
                tableBodyHeight: defaults.tableBodyHeight,
                locale: window._vidiLocale.replace("_", "-"),
                template: template,
                styleSelected,
                setZoom: parsedMeta?.zoom_on_table_click ? parsedMeta.zoom_on_table_click : false,
                maxZoom: parsedMeta?.max_zoom_level_table_click && parsedMeta.max_zoom_level_table_click !== "" ? parsedMeta.max_zoom_level_table_click : 17,
                onSelect: selectCallBack,
                caller: _self
            });

            localTable.loadDataInTable(true, forceDataLoad);
            tables[LAYER.VECTOR + ':' + layerKey] = localTable;
            return localTable;
        } else {
            throw new Error(`Unable to create gc2table, as the data is not loaded yet`);
        }
    },

    displayAttributesPopup(features, event, additionalControls = ``, multi = true) {
        if (window.vidiConfig.crossMultiSelect) {
            // _self.resetAllVectorLayerStyles();
        }
        event.originalEvent.clickedOnFeature = true;
        let renderedText = null;
        let accordion = "";
        let count = 0;
        let count2 = 1;

        $(".vector-feature-info-panel").remove();
        if (typeof vectorPopUp !== "undefined") {
            vectorPopUp.closePopup();
        }
        features.forEach((f) => {
            let layerKey = f.layerKey;
            let feature = f.feature;
            let layer = f.layer;
            let vector = f?.vector || false

            let parsedMeta = _self.parseLayerMeta(meta.getMetaByKey(layerKey, false));
            let editDisplay = parsedMeta.vidi_layer_editable ? 'inline' : 'none';
            let properties = JSON.parse(JSON.stringify(feature.properties));
            for (var key in properties) {
                if (properties.hasOwnProperty(key)) {
                    if (key.indexOf(SYSTEM_FIELD_PREFIX) === 0) {
                        // delete properties[key];
                    }
                }
            }

            properties._vidi_edit_layer_id = layer._leaflet_id;
            properties._vidi_edit_layer_name = layerKey;
            properties._vidi_edit_vector = vector;
            properties._vidi_edit_display = editDisplay;


            let i = properties._vidi_content.fields.length;
            while (i--) {
                if (properties._vidi_content.fields[i].title.indexOf(SYSTEM_FIELD_PREFIX) === 0 || properties._vidi_content.fields[i].title === `_id`) {
                    // properties._vidi_content.fields.splice(i, 1);
                }
            }

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
                    func(feature, layer, layerKey, sqlQuery, moduleState.vectorStores[LAYER.VECTOR + ':' + layerKey], cloud.get().map);
                } catch (e) {
                    console.info("Error in click function for: " + layerKey, e.message);
                }
            }

            Handlebars.registerHelper('breaklines', function (text) {
                text = Handlebars.Utils.escapeExpression(text);
                text = text.replace(/(\r\n|\n|\r)/gm, '<br>');
                return new Handlebars.SafeString(text);
            });
            let randText = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
            try {
                let tmpl = sqlQuery.getVectorTemplate(layerKey, multi);
                if (tmpl) {
                    // Convert Markdown in text fields
                    let metaDataKeys = meta.getMetaDataKeys();
                    let hasSummary = typeof parsedMeta?.accordion_summery !== "undefined" && parsedMeta?.accordion_summery !== "";
                    let summaryPrefix = typeof parsedMeta?.accordion_summery_prefix !== "undefined" && parsedMeta?.accordion_summery_prefix !== "" ? parsedMeta?.accordion_summery_prefix : null;
                    let title = metaDataKeys[layerKey].f_table_title ? metaDataKeys[layerKey].f_table_title : metaDataKeys[layerKey].f_table_name;
                    title = hasSummary ? summaryPrefix ? `<span style="color: #AAAAAA">${summaryPrefix}</span>&nbsp;&nbsp;${properties[parsedMeta.accordion_summery]}` : properties[parsedMeta.accordion_summery] : title;
                    for (const property in metaDataKeys[layerKey].fields) {
                        if (metaDataKeys[layerKey].fields[property].type === "text") {
                            //properties[property] = marked(properties[property]);
                        }
                    }
                    //properties.text1 = marked(properties.text1);
                    renderedText = Handlebars.compile(tmpl)(properties);
                    if (typeof parsedMeta.disable_vector_feature_info === "undefined" || parsedMeta.disable_vector_feature_info === false) {
                        count++;
                        if (multi) {
                            accordion += `
                                        <div class="accordion-item">
                                            <h4 class="accordion-header">
                                                <button class="accordion-button collapsed" data-bs-toggle="collapse" data-bs-target="#collapse${randText}" id="a-collapse${randText}">${title}</button>
                                            </h4>
                                            <div class="accordion-collapse collapse" data-layer-id="${layer._leaflet_id}" id="collapse${randText}" data-bs-parent="#vector-feature-info-panel">
                                                <div class="feature-info-accordion-body accordion-body">${renderedText}</div>
                                            </div>
                                        </div>
                                    `;
                        } else {
                            accordion = renderedText;
                        }
                    } else {
                        console.log(`Feature info disabled for ${layerKey}`)
                    }
                }
            } catch (e) {
                console.info("Error in pop-up template for: " + layerKey, e);
            }
            // Set select call when opening a panel
            let selectCallBack = () => {
            };
            if (typeof parsedMeta.select_function !== "undefined" && parsedMeta.select_function !== "") {
                try {
                    selectCallBack = Function('"use strict";return (' + parsedMeta.select_function + ')')();
                } catch (e) {
                    const f = `
                            function(id, layer, key, sqlQuery) {
                                ${parsedMeta.select_function}
                            }
                            `;
                    selectCallBack = Function('"use strict";return (' + f + ')')();
                }
            }
            let func = selectCallBack.bind(this, null, layer, layerKey, _self);
            $(document).arrive(`#a-collapse${randText}`, function () {
                const e = $(`#collapse${randText}`);
                const bsCollapse = document.getElementById(`collapse${randText}`);
                bsCollapse.addEventListener('hidden.bs.collapse', event => {
                    // Do something
                })
                bsCollapse.addEventListener('shown.bs.collapse', event => {
                    func();
                    cloud.get().map.eachLayer(layer => {
                        if (parseInt(layer._leaflet_id) === parseInt(e[0].dataset.layerId)) {
                            if (layer?.setStyle) {
                                layer.setStyle(SELECTED_STYLE);
                            }
                            if (layer?._icon) {
                                _self.scaleIcon(layer._icon);
                            }
                        }
                    })
                })
                $(this).on('click', function () {
                    _self.resetAllVectorLayerStyles();
                    sqlQuery.getQstore()?.forEach(store => {
                        $.each(store.layer._layers, function (i, v) {
                            if (store.layer && store.layer.resetStyle) {
                                store.layer.resetStyle(v);
                            }
                        });
                    })
                });
            });
            if (count > 0) {
                if (count2 === features.length) {
                    if (multi) {
                        accordion = `<div class="accordion vector-feature-info-panel" id="vector-feature-info-panel">${accordion}</div>`;
                    }
                    if (window.vidiConfig.forceOffCanvasInfo === true) {
                        sqlQuery.openInfoSlidePanel();
                        $('#offcanvas-info-container').html(`${additionalControls}${accordion}`)
                    } else {
                        vectorPopUp = L.popup({
                            autoPan: window.vidiConfig.autoPanPopup,
                            autoPanPaddingTopLeft: L.point(multi ? 20 : 0, multi ? 300 : 0),
                            minWidth: 300,
                            className: `js-vector-layer-popup custom-popup`
                        }).setLatLng(event.latlng).setContent(`${additionalControls}${accordion}`).openOn(cloud.get().map)
                            .on('remove', () => {
                                if (`editor` in extensions) {
                                    editor = extensions.editor.index;
                                    if (!editor.getEditedFeature()) {
                                        sqlQuery.resetAll();
                                    }
                                }
                                _self.resetAllVectorLayerStyles();
                            });
                    }
                }
            }
            count2++;
        })
        if (count === 1) {
            setTimeout(() => {
                $('#vector-feature-info-panel .accordion-button').trigger('click');
            }, 200);
        }
        // if (count === 0) {
        //     utils.showInfoToast(__("Didn't find anything"));
        // }
    },

    /**
     * Returns parent layer filters (some layers can depend on others, forming child-parent relation,
     * so whenver there are active filters for the parent layer, it should be applied for child layers as well).
     *
     * @param {String} layerKey Layer identifier
     *
     * @returns {Array}
     */
    getParentLayerFilters(layerKey) {
        let parentLayers = [];
        let allLayers = _self.getActiveLayers(true);
        allLayers.map(layerName => {
            let layerMeta = meta.getMetaByKey(layerTreeUtils.stripPrefix(layerName), false);
            if (layerMeta.children && Array.isArray(layerMeta.children)) {
                layerMeta.children.map(child => {
                    if (child.rel === layerKey) {
                        let activeFiltersForParentLayer = _self.getActiveLayerFilters(layerTreeUtils.stripPrefix(layerName));
                        if (activeFiltersForParentLayer && activeFiltersForParentLayer.length > 0) {
                            activeFiltersForParentLayer.map(filter => {
                                parentLayers.push(`${child.child_column} IN (SELECT ${child.parent_column} FROM ${layerTreeUtils.stripPrefix(layerName)} WHERE ${filter})`);
                            });
                        }
                    }
                });
            }
        });

        return parentLayers;
    },

    getParentLayerKey(layerKey) {
        let parentLayers = [];
        let activeLayers = _self.getActiveLayers();
        activeLayers.map(activeLayerName => {
            let layerMeta = meta.getMetaByKey(layerTreeUtils.stripPrefix(activeLayerName), false);
            if (layerMeta.children && Array.isArray(layerMeta.children)) {
                layerMeta.children.map(child => {
                    if (child.rel === layerKey) {
                        let activeFiltersForParentLayer = _self.getActiveLayerFilters(layerTreeUtils.stripPrefix(activeLayerName));
                        if (activeFiltersForParentLayer && activeFiltersForParentLayer.length > 0) {
                            activeFiltersForParentLayer.map(filter => {
                                parentLayers.push(`${child.child_column} IN (SELECT ${child.parent_column} FROM ${layerTreeUtils.stripPrefix(activeLayerName)} WHERE ${filter})`);
                            });
                        }
                    }
                });
            }
        });

        return parentLayers;
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
                    console.warn(`Deprecation warning: "wms_filters" will be replaced with "predefined_filters", please update the GC2 backend`);
                }

                let predefinedFiltersRaw = parsedMeta[`predefined_filters`] || parsedMeta[`wms_filters`];
                let parsedPredefinedFilters = false;
                try {
                    let parsedPredefinedFiltersLocal = JSON.parse(predefinedFiltersRaw);
                    parsedPredefinedFilters = parsedPredefinedFiltersLocal;
                } catch (e) {
                    console.error(e)
                }
                let appliedPredefinedFilters = {};
                appliedPredefinedFilters[tableName] = [];
                if (parsedPredefinedFilters) {
                    for (let key in parsedPredefinedFilters) {
                        if (filters === false || filters.indexOf(key) === -1) {
                            appliedPredefinedFilters[tableName].push(parsedPredefinedFilters[key]);
                        }
                    }
                    if (appliedPredefinedFilters[tableName].length > 0) {
                        let filtersStr = appliedPredefinedFilters[tableName].join(` OR `);
                        appliedFilters[tableName].push(`(${filtersStr})`);
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
                                    case `timestamp with time zone`:
                                    case `timestamp without time zone`:
                                    case `time with time zone`:
                                    case `time without time zone`:
                                        if (EXPRESSIONS_FOR_DATES.indexOf(column.expression) === -1) {
                                            throw new Error(`Unable to apply ${column.expression} expression to ${column.fieldname} (${layerDescription.fields[key].type} type)`);
                                        }

                                        arbitraryConditions.push(`${column.fieldname} ${column.expression} '${column.value}'`);
                                        break;
                                    case `text`:
                                    case `string`:
                                    case `character`:
                                    case `uuid`:
                                    case `character varying`:
                                        if (EXPRESSIONS_FOR_STRINGS.indexOf(column.expression) === -1) {
                                            throw new Error(`Unable to apply ${column.expression} expression to ${column.fieldname} (${layerDescription.fields[key].type} type)`);
                                        }

                                        if (column.expression === 'like') {
                                            arbitraryConditions.push(`${column.fieldname} ILIKE '%${column.value}%'`);
                                        } else {
                                            arbitraryConditions.push(`${column.fieldname} ${column.expression} '${column.value}'`);
                                        }

                                        break;
                                    case `smallint`:
                                    case `integer`:
                                    case `bigint`:
                                    case `decimal`:
                                    case `numeric`:
                                    case `real`:
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

        // Used when refreshing browser and editor filter has to be applied before filter-component is rendered
        if (typeof filterComp[layerKey] !== "object" && typeof moduleState.editorFiltersActive[tableName] === "boolean" && moduleState.editorFiltersActive[tableName] === true && typeof moduleState.editorFilters[tableName] === "object" && moduleState.editorFilters[tableName].length > 0) {
            console.log("Applying editor filter from state");
            return moduleState.editorFilters[tableName];
        }
        // Used when using filter-component is rendered and editor filter is set
        if (typeof filterComp[layerKey] === "object" && typeof moduleState.editorFiltersActive[tableName] === "boolean" && moduleState.editorFiltersActive[tableName] === true && moduleState.editorFilters[tableName].length > 0) {
            return moduleState.editorFilters[tableName];
        }

        let appliedFiltersConcat = [];

        if (appliedFilters[tableName].length > 0) {
            appliedFiltersConcat = [appliedFilters[tableName].join(` AND `)];
        }

        if (typeof filterComp[layerKey] === "object" && !filterComp[layerKey].state.editorFiltersActive) {
            filterComp[layerKey].setState({editorFilters: appliedFiltersConcat})
            // We update moduleState and trigger a state change because setState doesn't trigger a change event in React
            moduleState.editorFilters[layerKey] = appliedFiltersConcat;
            backboneEvents.get().trigger(`${MODULE_NAME}:changed`);
            lastFilter = JSON.stringify(appliedFilters);
        }

        return appliedFiltersConcat;
    },

    createSimulatedLayerDescriptionForVirtualLayer: (item) => {
        let creationTime = parseInt(item.key.split(`.`)[1].replace(`query`, ``));
        let date = new Date(+creationTime);
        // TODO this is a flaky way og getting the relation name
        let layerNamesFromSQL = item.store.sql.substring(item.store.sql.indexOf(`" FROM`) + 6, item.store.sql.indexOf(`WHERE`)).trim();

        // Find the corresponding layer
        let correspondingLayer = meta.getMetaByKey(layerNamesFromSQL);

        // Creating simulated layer description object
        let simulatedMetaData = {
            f_table_title: (__(`Query on`) + ' ' + layerNamesFromSQL + ' (' + dayjs(date).format(`YYYY-MM-DD HH:mm`) + '; <a href="javascript:void(0);" class="js-delete-virtual-layer"><i class="fa fa-remove"></i> ' + (__(`Delete`)).toLowerCase() + '</a>)'),
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
    createGroupRecord: (groupName, order, forcedState, precheckedLayers, filter) => {
        let isVirtualGroup = false;
        if (groupName === __(`Virtual layers`)) {
            if (moduleState.virtualLayers.length > 0) {
                isVirtualGroup = true;
            } else {
                return;
            }
        }

        let metaData = meta.getMetaData(filter);
        let base64GroupName = Base64.encode(groupName).replace(/=/g, "");

        // Add group container
        // Only if container doesn't exist
        // ===============================
        if ($("#layer-panel-" + base64GroupName).length === 0) {
            $(".layer-list").append(markupGeneratorInstance.getGroupPanel(base64GroupName, groupName, window.vidiConfig.showLayerGroupCheckbox));

            // Append to inner group container
            // ===============================
            $("#group-" + base64GroupName).append(`<div id="collapse${base64GroupName}" class="accordion-body collapse"></div>`);
        }

        // Get layers that belong to current group
        let notSortedLayersAndSubgroupsForCurrentGroup = [];
        if (isVirtualGroup) {
            moduleState.virtualLayers.map(item => {
                let simulatedMetaData = _self.createSimulatedLayerDescriptionForVirtualLayer(item);
                meta.addMetaData({data: [simulatedMetaData]});
                notSortedLayersAndSubgroupsForCurrentGroup.push({
                    type: GROUP_CHILD_TYPE_LAYER,
                    layer: simulatedMetaData
                });
            });
        } else {
            let LOG_HIERARCHY_BUILDING = false;
            const LOG_LEVEL = '|  ';
            for (let u = 0; u < metaData.data.length; ++u) {
                if (metaData.data[u].layergroup == groupName) {
                    let layer = metaData.data[u];
                    let parsedMeta = _self.parseLayerMeta(layer);
                    if (parsedMeta && `vidi_sub_group` in parsedMeta && parsedMeta.vidi_sub_group.length > 0) {
                        if (parsedMeta.vidi_sub_group.indexOf(SUB_GROUP_DIVIDER) === -1) {
                            layer.nesting = [parsedMeta.vidi_sub_group.trim()];
                        } else {
                            layer.nesting = [];
                            let splitGroups = parsedMeta.vidi_sub_group.split(SUB_GROUP_DIVIDER);
                            splitGroups.map(item => {
                                layer.nesting.push(item.trim());
                            });
                        }
                    } else {
                        layer.nesting = [];
                    }

                    /**
                     * Returns reference to the parent children container
                     *
                     * @param {Array}  searchedLevelPath Depth specification
                     * @param {String} prefix            Recursion depth logging helper
                     *
                     * @returns {Array<Object>}
                     */
                    const getParentChildrenContainer = (searchedLevelPath, prefix = '') => {
                        let localPrefix = LOG_LEVEL + prefix;
                        if (LOG_HIERARCHY_BUILDING) console.log(localPrefix + ` getParentChildrenContainer 1`, searchedLevelPath);

                        let parent = notSortedLayersAndSubgroupsForCurrentGroup;
                        if (searchedLevelPath.length > 0) {
                            let indexes = getNestedGroupsIndexes(searchedLevelPath, localPrefix);
                            for (let i = 0; i < indexes.length; i++) {
                                if (LOG_HIERARCHY_BUILDING) console.log(localPrefix + ` parent ${i}`, parent);
                                if (i === 0) {
                                    parent = notSortedLayersAndSubgroupsForCurrentGroup[indexes[0]].children;
                                } else {
                                    parent = parent[indexes[i]].children;
                                }
                            }
                        }

                        if (LOG_HIERARCHY_BUILDING) console.log(localPrefix + ` getParentChildrenContainer 2`, parent);
                        return parent;
                    }

                    /**
                     * Ensures that specified group exists on specific hierarchy level
                     *
                     * @param {String} name              Group name
                     * @param {Array}  searchedLevelPath Depth specification
                     * @param {String} prefix            Recursion depth logging helper
                     *
                     * @returns {Number}
                     */
                    const ensureThatGroupExistsAndReturnItsIndex = (name, searchedLevelPath, prefix) => {
                        let localPrefix = LOG_LEVEL + prefix;
                        if (LOG_HIERARCHY_BUILDING) console.log(localPrefix + ` ensureThatGroupExistsAndReturnsItsIndex`, name, searchedLevelPath);

                        let parent = getParentChildrenContainer(searchedLevelPath, localPrefix);
                        let groupIndex = false;
                        parent.map((item, index) => {
                            if (item.type === GROUP_CHILD_TYPE_GROUP && item.id === name) {
                                groupIndex = index;
                                return false;
                            }
                        });

                        if (groupIndex === false) {
                            parent.push({
                                id: name,
                                type: GROUP_CHILD_TYPE_GROUP,
                                children: []
                            });

                            groupIndex = (parent.length - 1);
                        }

                        if (LOG_HIERARCHY_BUILDING) console.log(localPrefix + ` groupIndex`, groupIndex);
                        return groupIndex;
                    };

                    /**
                     * Returns indexes for every nesting level, creates the group if does not exist
                     *
                     * @param {Array}  nestingData Depth specification
                     * @param {String} prefix      Recursion depth logging helper
                     *
                     * @returns {Array<Number>}
                     */
                    const getNestedGroupsIndexes = (nestingData, prefix = '') => {
                        let localPrefix = LOG_LEVEL + prefix;
                        if (LOG_HIERARCHY_BUILDING) console.log(localPrefix + ` getNestedGroupsIndexes`, nestingData);

                        let indexes = [];
                        nestingData.map((groupName, level) => {
                            if (LOG_HIERARCHY_BUILDING) console.log(localPrefix + ` it`, groupName, level);

                            let nestingDataCopy = JSON.parse(JSON.stringify(nestingData));
                            let index = ensureThatGroupExistsAndReturnItsIndex(groupName, nestingDataCopy.slice(0, level), LOG_LEVEL + localPrefix);
                            indexes.push(index);
                        });

                        if (LOG_HIERARCHY_BUILDING) console.log(localPrefix + ` indexes`, indexes);
                        return indexes;
                    }

                    if (LOG_HIERARCHY_BUILDING) console.log(` layer.nesting`, layer.f_table_schema + '.' + layer.f_table_name);
                    let indexes = getNestedGroupsIndexes(JSON.parse(JSON.stringify(layer.nesting)));

                    if (LOG_HIERARCHY_BUILDING) console.log(` indexes ready`, indexes);
                    let parent = getParentChildrenContainer(layer.nesting);
                    parent.push({
                        type: GROUP_CHILD_TYPE_LAYER,
                        layer
                    });
                }
            }

            if (LOG_HIERARCHY_BUILDING) console.log(` result`, JSON.parse(JSON.stringify(notSortedLayersAndSubgroupsForCurrentGroup)));
        }

        const reverseOrder = (children) => {
            children.reverse();
            children.map((item) => {
                if (item.type === "group") {
                    reverseOrder(item.children);
                }
            });
        };

        // Reverse subgroups
        reverseOrder(notSortedLayersAndSubgroupsForCurrentGroup);

        // Sort groups
        let layersAndSubgroupsForCurrentGroup = layerSortingInstance.sortLayers(order, notSortedLayersAndSubgroupsForCurrentGroup, groupName);

        // Create stores and calculate active / added layers before the layer panel is shown
        let localNumberOfActiveLayers = 0;
        let localNumberOfAddedLayers = 0;
        let layersToProcess = [];

        const getLayersToProcess = (items) => {
            items.map(localItem => {
                if (localItem.type === GROUP_CHILD_TYPE_LAYER) {
                    layersToProcess.push(localItem.layer);
                } else if (localItem.type === GROUP_CHILD_TYPE_GROUP) {
                    getLayersToProcess(localItem.children);
                } else {
                    throw new Error(`Invalid sorting element type`);
                }
            });
        };

        for (var u = 0; u < layersAndSubgroupsForCurrentGroup.length; ++u) {
            let localItem = layersAndSubgroupsForCurrentGroup[u];
            getLayersToProcess([localItem]);
        }

        let layersToCheckOpacity = _self.getActiveLayers();
        layersToProcess.map(layer => {
            let {layerIsActive} = _self.checkIfLayerIsActive(forcedState, precheckedLayers, layer);
            let layerKey = layer.f_table_schema + "." + layer.f_table_name;

            if (layerIsActive) {
                localNumberOfActiveLayers++;
                layersToCheckOpacity.push(layerKey);
            }

            localNumberOfAddedLayers++;

            let {isVectorLayer, isVectorTileLayer, isWebGLLayer} = layerTreeUtils.getPossibleLayerTypes(layer);
            let parsedMeta = false;
            if (layer.meta) {
                parsedMeta = _self.parseLayerMeta(layer);
            }

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
                let pointToLayerFn = moduleState.vectorStyles?.[layerKey]?.pointToLayerFn ? moduleState.vectorStyles[layerKey].pointToLayerFn : parsedMeta.point_to_layer && parsedMeta.point_to_layer !== "" ? parsedMeta.point_to_layer : null;
                if (pointToLayerFn && pointToLayerFn !== '') {
                    try {
                        let func = Function('"use strict";return (' + pointToLayerFn + ')')();
                        _self.setPointToLayer(LAYER.VECTOR + ':' + layerKey, func);
                    } catch (e) {
                        console.error("Error in point-to-layer function for: " + layerKey);
                    }
                } else {
                    _self.setPointToLayer(LAYER.VECTOR + ':' + layerKey, null);
                }
                let vectorStyleFn = moduleState.vectorStyles?.[layerKey]?.styleFn && moduleState.vectorStyles[layerKey].styleFn !== '' ? moduleState.vectorStyles[layerKey].styleFn : parsedMeta.vector_style && parsedMeta.vector_style !== "" ? parsedMeta.vector_style : null;
                if (vectorStyleFn) {
                    try {
                        let func = Function('"use strict";return (' + vectorStyleFn + ')')();
                        _self.setStyle(LAYER.VECTOR + ':' + layerKey, func);
                    } catch (e) {
                        console.error("Error in style function for: " + layerKey);
                    }
                } else {
                    _self.setStyle(LAYER.VECTOR + ':' + layerKey, null);
                }

                _self.createStore(layer, isVirtualGroup);
            }

            if (isVectorTileLayer) {
                _self.createStore(layer, false, true);
            }

            if (isWebGLLayer) {
                _self.createWebGLStore(layer);
            }
        });

        // Apply opacity to layers
        layersToCheckOpacity.map(item => {
            let layerKey = layerTreeUtils.stripPrefix(item);
            if (layerKey in moduleState.opacitySettings && isNaN(moduleState.opacitySettings[layerKey]) === false) {
                if (moduleState.opacitySettings[layerKey] >= 0 && moduleState.opacitySettings[layerKey] <= 1) {
                    let opacity = moduleState.opacitySettings[layerKey];
                    layerTreeUtils.applyOpacityToLayer(opacity, layerKey, cloud, backboneEvents);

                    // Assuming that it is not possible to set layer opacity right now
                    moduleState.setLayerOpacityRequests.push({layerKey, opacity});
                }
            }
        });

        // Setup active / added layers indicators
        layerTreeUtils.setupLayerNumberIndicator(base64GroupName, localNumberOfActiveLayers, localNumberOfAddedLayers);

        $("#layer-panel-" + base64GroupName).find(`.js-toggle-layer-panel`).click(() => {
            if ($("#group-" + base64GroupName).find(`#collapse${base64GroupName}`).children().length === 0) {
                let virtualLayerTreeNode = $('<div></div>');

                // Add layers and subgroups
                for (var u = 0; u < layersAndSubgroupsForCurrentGroup.length; ++u) {
                    let localItem = layersAndSubgroupsForCurrentGroup[u];
                    if (localItem.type === GROUP_CHILD_TYPE_LAYER) {
                        let {
                            layerIsActive,
                            activeLayerName
                        } = _self.checkIfLayerIsActive(forcedState, precheckedLayers, localItem.layer);
                        _self.createLayerRecord(localItem.layer, $(virtualLayerTreeNode), layerIsActive, activeLayerName, false, isVirtualGroup);
                    } else if (localItem.type === GROUP_CHILD_TYPE_GROUP) {
                        _self.createSubgroupRecord(localItem, forcedState, precheckedLayers, $(virtualLayerTreeNode), 0);
                    } else {
                        console.error(localItem);
                        throw new Error(`Invalid sorting element type`);
                    }
                }

                $(virtualLayerTreeNode).sortable({
                    axis: 'y',
                    handle: `.layer-move-vert`,
                    stop: (event, ui) => {
                        _self.calculateOrder(moduleState.layerTreeOrder ? moduleState.layerTreeOrder : latestFullTreeStructure);
                        backboneEvents.get().trigger(`${MODULE_NAME}:sorted`);
                        layers.reorderLayers();
                    }
                });

                // Performing single DOM manipulation to avoid multiple reflows
                $("#collapse" + base64GroupName).append(virtualLayerTreeNode);

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
                    let {layerIsActive} = _self.checkIfLayerIsActive(forcedState, precheckedLayers, layer);
                    if (layerIsActive && moduleState.setLayerStateRequests[layerKey]) {
                        let settings = moduleState.setLayerStateRequests[layerKey];
                        _self.setLayerState(settings.desiredSetupType, layerKey, settings.ignoreErrors, settings.layerIsEnabled, true);
                    }
                };

                const applyControlRequests = (items) => {
                    items.map(item => {
                        if (item.type === GROUP_CHILD_TYPE_LAYER) {
                            applyQueriedSetupControlRequests(item.layer);
                        } else {
                            applyControlRequests(item.children);
                        }
                    });
                }

                applyControlRequests(layersAndSubgroupsForCurrentGroup);
            }
        });

        return layersAndSubgroupsForCurrentGroup;
    },

    checkIfLayerIsActive: (forcedState, precheckedLayers, localItem) => {
        if (!localItem) {
            throw new Error(`Layer meta object is empty`);
        }

        let layerIsActive = false;
        let activeLayerName = false;

        let name = `${localItem.f_table_schema}.${localItem.f_table_name}`;

        // If activeLayers are set, then no need to sync with the map
        if (forcedState && forcedState.activeLayers) {
            forcedState.activeLayers.map(key => {
                if (layerTreeUtils.stripPrefix(key) === name) {
                    layerIsActive = true;
                    activeLayerName = key;
                }
            });
        } else {
            if (precheckedLayers && Array.isArray(precheckedLayers) && precheckedLayers.length > 0) {
                precheckedLayers.map(item => {
                    if (layerTreeUtils.stripPrefix(item.id) === name) {
                        layerIsActive = true;
                        activeLayerName = item.id;
                    }
                });
            }

            cloud.get().map.eachLayer(function (layer) {
                if (layer.id && layerTreeUtils.stripPrefix(layer.id) === name && !layer.baseLayer) {
                    layerIsActive = true;
                    activeLayerName = layer.id;
                }
            });
        }

        return {layerIsActive, activeLayerName}
    },

    /**
     * Generates single subgroup control
     *
     * @returns {Object}
     */
    createSubgroupRecord: (subgroup, forcedState, precheckedLayers, parentNode, level = 0, initiallyClosed = true) => {
        let base64SubgroupName = Base64.encode(`subgroup_${subgroup.id}_level_${level}_${uuidv4()}`).replace(/=/g, "");
        let markup = markupGeneratorInstance.getSubgroupControlRecord(base64SubgroupName, subgroup.id, level, window.vidiConfig.showLayerGroupCheckbox);

        $(parentNode).append(markup);
        $(parentNode).find(`[data-gc2-subgroup-id="${subgroup.id}"]`).find(`.js-subgroup-id`).append(`
                ${subgroup.id}
                <i class="bi-grip-vertical layer-move-vert layer-move-vert-subgroup ms-auto"></i>
        `);

        $(parentNode).find(`[data-gc2-subgroup-id="${subgroup.id}"]`).find(`.js-subgroup-toggle-button`).click((event) => {
            // Checking if the subgroup was already drawn
            let subgroupRootElement = $(event.target).closest(`[data-gc2-subgroup-id]`).first();
            if (subgroupRootElement.find(`.js-subgroup-children`).children().length === 0) {
                renderSubgroupChildren();
            }

            if (subgroupRootElement.find(`.js-subgroup-children`).first().is(`:visible`)) {
                subgroupRootElement.find(`.js-subgroup-toggle-button`).first().html(`<i class="bi bi-arrow-down"></i>`);
                subgroupRootElement.find(`.js-subgroup-children`).first().hide();
            } else {
                subgroupRootElement.find(`.js-subgroup-toggle-button`).first().html(`<i class="bi bi-arrow-up"></i>`);
                subgroupRootElement.find(`.js-subgroup-children`).first().show();
            }
        });

        $(parentNode).find(`[data-gc2-subgroup-id="${subgroup.id}"]`).find(`.js-subgroup-children[id="${base64SubgroupName}"]`).hide();

        let container = $(parentNode).find(`[data-gc2-subgroup-id="${subgroup.id}"]`).find(`.js-subgroup-children[id="${base64SubgroupName}"]`);
        if ($(container).length !== 1) {
            throw new Error(`Error while locating parent node for group children`);
        }

        const renderSubgroupChildren = () => {
            subgroup.children.map(child => {
                if (child.type === GROUP_CHILD_TYPE_LAYER) {
                    let {
                        layerIsActive,
                        activeLayerName
                    } = _self.checkIfLayerIsActive(forcedState, precheckedLayers, child.layer);
                    _self.createLayerRecord(child.layer, container, layerIsActive, activeLayerName, subgroup.id);
                } else if (child.type === GROUP_CHILD_TYPE_GROUP) {
                    _self.createSubgroupRecord(child, forcedState, precheckedLayers, container, newLevel);
                } else {
                    throw new Error(`Invalid layer group`);
                }
            });
        }

        let newLevel = level + 1;
        if (initiallyClosed === false) {
            renderSubgroupChildren();
        }

        $(parentNode).find(`.js-subgroup-children`).sortable({
            axis: 'y',
            handle: `.layer-move-vert`,
            stop: (event, ui) => {
                _self.calculateOrder(moduleState.layerTreeOrder ? moduleState.layerTreeOrder : latestFullTreeStructure);
                backboneEvents.get().trigger(`${MODULE_NAME}:sorted`);
                layers.reorderLayers();
            }
        });
    },

    /**
     * Generates single layer control
     *
     * @returns {void}
     */
    createLayerRecord: (layer, parentNode, layerIsActive, activeLayerName, subgroupId = false, isVirtual = false) => {
        let text = (layer.f_table_title === null || layer.f_table_title === "") ? layer.f_table_name : layer.f_table_title;
        if (layer.baselayer) {
            console.error(`Non-supported way of adding the base layer`);
            $("#base-layer-list").append(`<div class='list-group-item'>
                <div class='row-action-primary radio radio-primary base-layer-item' data-gc2-base-id='${layer.f_table_schema}.${layer.f_table_name}'>
                    <label class='baselayer-label'>
                        <input type='radio' name='baselayers'>${text}<span class='fa fa-check' aria-hidden='true'></span>
                    </label>
                </div>
            </div>`);
        } else {
            let {detectedTypes, specifiers} = layerTreeUtils.getPossibleLayerTypes(layer);
            let singleTypeLayer = (detectedTypes === 1);

            let condition = layerTreeUtils.getDefaultLayerType(layer, meta.parseLayerMeta(`${layer.f_table_schema}.${layer.f_table_name}`));
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
            let displayInfo = layer.f_table_abstract ? `inline` : `none`;
            let disableCheckBox = false;
            let parsedMeta = false;
            let layerKey = layer.f_table_schema + "." + layer.f_table_name;
            let layerKeyWithGeom = layerKey + "." + layer.f_geometry_column;
            let lockedLayer = (layer.authentication === "Read/write" ? ` <i class="bi bi-key-fill text-danger gc2-session-lock" aria-hidden="true"></i>` : ``);
            let layerTypeSelector = ``;
            let parentLayerKeys = [];
            let childLayerKeys = [];
            if (layer.meta) {
                parsedMeta = _self.parseLayerMeta(layer);
                if (parsedMeta) {
                    if (`vidi_layer_editable` in parsedMeta && parsedMeta.vidi_layer_editable) {
                        layerIsEditable = true;
                    }

                    if (`disable_check_box` in parsedMeta && parsedMeta.disable_check_box && _self.getChildLayersThatShouldBeEnabled().includes(layerKey) === false) {
                        disableCheckBox = true;
                    }

                    if (`meta_desc` in parsedMeta) {
                        displayInfo = (parsedMeta.meta_desc || layer.f_table_abstract) ? `inline` : `none`;
                    }

                    if (`referenced_by` in parsedMeta) {
                        try {
                            let m = parsedMeta.referenced_by;
                            let referencedBy = m && m !== "" ? JSON.parse(parsedMeta.referenced_by) : null;
                            if (referencedBy) {
                                referencedBy.forEach(ref => {
                                    meta.getMetaDataLatestLoaded().data.forEach(e => {
                                        if (ref.rel === e.f_table_schema + "." + e.f_table_name) {
                                            childLayerKeys.push(e.f_table_title || e.f_table_schema + "." + e.f_table_name)
                                        }
                                    })
                                })
                            }
                        } catch (err) {
                            console.error("Invalid JSON in referenced_by for layer key: " + layer.f_table_schema + "." + layer.f_table_name);
                        }
                    }

                    meta.getMetaDataLatestLoaded().data.forEach(e => {
                        try {
                            let m = JSON.parse(e?.meta)?.referenced_by;
                            let referencedBy = m && m !== "" ? JSON.parse(m) : null;
                            if (referencedBy) {
                                referencedBy.forEach(ref => {
                                    if (ref.rel === layerKey) {
                                        parentLayerKeys.push(e.f_table_title || e.f_table_schema + "." + e.f_table_name)
                                    }
                                })
                            }
                        } catch (err) {
                            console.error("Invalid JSON in referenced_by for layer key: " + e.f_table_schema + "." + e.f_table_name);
                        }
                    })
                }
            }
            if (!singleTypeLayer) {
                layerTypeSelector = markupGeneratorInstance.getLayerTypeSelector(selectorLabel, specifiers);
            }

            // Add feature button
            let addButton = ``;
            if (moduleState.editingIsEnabled && layerIsEditable) {
                addButton = markupGeneratorInstance.getAddButton(layerKeyWithGeom);
            }

            let layerControlRecord = $(markupGeneratorInstance.getLayerControlRecord(layerKeyWithGeom, layerKey, layerIsActive,
                layer, defaultLayerType, layerTypeSelector, text, lockedLayer, addButton, displayInfo, subgroupId !== false, moduleState, disableCheckBox, parentLayerKeys, childLayerKeys));

            // Callback for selecting specific layer type to enable (layer type dropdown)
            $(layerControlRecord).find('.js-layer-type-selector').on('click', (e, data) => {
                let type = false;
                switch ($(e.target).attr('data-layer-type')) {
                    case `tile`:
                        type = LAYER.RASTER_TILE;
                        break;
                    case `vector`:
                        type = LAYER.VECTOR;
                        break;
                    case `vector-tile`:
                        type = LAYER.VECTOR_TILE;
                        break;
                    case `webgl`:
                        type = LAYER.WEBGL;
                        break;
                    default:
                        throw new Error(`Invalid selector type`);
                }

                let switcher = $(e.target).closest('.layer-item').find('.js-show-layer-control');
                $(switcher).data('gc2-layer-type', type);
                $(switcher).prop('checked', true);

                let layerToReload = ((type === LAYER.RASTER_TILE ? `` : type + `:`) + $(switcher).data('gc2-id'));
                _self.setLayerState(type, layerKey);
                _self.reloadLayer(layerToReload, false, (data ? data.doNotLegend : false));

                $(e.target).closest('.layer-item').find('.js-dropdown-label').html(ICONS[type]);
                backboneEvents.get().trigger(`${MODULE_NAME}:activeLayersChange`);
                offlineModeControlsManager.updateControls();
            });

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
                    marked(parsedMeta.meta_desc) : abstract;

                dayjs.locale('da');

                html = html ? mustache.render(html, parsedMeta) : "";

                $("#offcanvas-layer-desc-container").html(html);
                $("#offcanvasLayerDesc h5").html(title || name);
                bindEvent.showOffcanvasInfo()
                e.stopPropagation();
            });

            $(parentNode).append(layerControlRecord);

            _self.setLayerState(defaultLayerType, layerKey, true, layerIsActive, true, isVirtual, layerControlRecord);

            // Toggle settings button active on/off
            // This is necessary bacause data-bs-toggle is already set to "collapse"
            // and can not be used to "button" also.
            setTimeout(() => {
                const settingsCollapsible = document.getElementById(`settings-${layer.f_table_schema}-${layer.f_table_name}`);
                const btn = document.getElementById(`settings-${layer.f_table_schema}-${layer.f_table_name}-btn`);
                settingsCollapsible?.addEventListener('shown.bs.collapse', event => {
                    btn.classList.add('active');
                })
                settingsCollapsible?.addEventListener('hidden.bs.collapse', event => {
                    btn.classList.remove('active');
                })
            }, 100)
        }
    },

    /**
     * Renders widgets for the particular layer record in tree, shoud be called
     * only when widgets are really needed (for example, when layer is activated)
     *
     * @param {Object}  layer     Layer description
     * @param {Boolean} isVirtual Specifies if layer is virtual
     *
     * @returns {void}
     */
    _setupLayerWidgets: (layer, isVirtual, virtualContainer = false) => {
        if (!layer) throw new Error(`Invalid parameters were provided`);

        let layerKey = layer.f_table_schema + "." + layer.f_table_name;
        let layerKeyWithGeom = layerKey + "." + layer.f_geometry_column;

        let parsedMeta = false;
        if (layer.meta) {
            parsedMeta = _self.parseLayerMeta(layer);
        }

        let {isVectorLayer, isRasterTileLayer, isVectorTileLayer} = layerTreeUtils.getPossibleLayerTypes(layer);
        let layerContainer = ($(`[data-gc2-layer-key="${layerKeyWithGeom}"]`).length === 1 ? $(`[data-gc2-layer-key="${layerKeyWithGeom}"]`) : (virtualContainer ? virtualContainer : false));
        if ($(layerContainer).length === 1) {
            if ($(layerContainer).attr(`data-widgets-were-initialized`) !== `true`) {
                $(layerContainer).find(`.js-toggle-layer-offline-mode-container`).css(`display`, `inline-block`);
                $(layerContainer).find(`.js-toggles-container`).css(`display`, `inline-block`);

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

                let initialSliderValue = 1;
                if (isRasterTileLayer || isVectorTileLayer) {
                    if (layerKey in moduleState.opacitySettings && isNaN(moduleState.opacitySettings[layerKey]) === false) {
                        if (moduleState.opacitySettings[layerKey] >= 0 && moduleState.opacitySettings[layerKey] <= 1) {
                            initialSliderValue = moduleState.opacitySettings[layerKey];
                        }
                    }
                    // Opacity slider
                    $(layerContainer).find('.js-layer-settings-opacity').append(`<div class="range">
                        <input type="range"  min="1" max="100" value="${initialSliderValue * 100}" class="js-opacity-slider form-range">
                    </div>`);


                    let slider = $(layerContainer).find('.js-layer-settings-opacity').find(`.js-opacity-slider`);
                    if (slider) {
                        slider.on('input change', (e) => {
                            let sliderValue = (parseFloat(e.target.value) / 100);
                            layerTreeUtils.applyOpacityToLayer(sliderValue, layerKey, cloud, backboneEvents);
                            moduleState.setLayerOpacityRequests.push({layerKey, opacity: sliderValue});
                        });
                    }

                    $(layerContainer).find(`.js-toggle-opacity`).click(() => {
                        _self._selectIcon($(layerContainer).find('.js-toggle-opacity'));
                        $(layerContainer).find('.js-layer-settings-opacity').toggle();
                    });

                    // Labels
                    let componentContainerId = `layer-settings-labels-${layerKey}`;
                    let value = true;
                    if (layerKey in moduleState.labelSettings && [true, false].indexOf(moduleState.labelSettings[layerKey]) !== -1) {
                        value = moduleState.labelSettings[layerKey];
                    }
                    $(layerContainer).find('.js-layer-settings-labels').append(`<div id="${componentContainerId}"></div>`);
                    setTimeout(() => {
                        if (document.getElementById(componentContainerId)) {
                            ReactDOM.render(<LabelSettingToggle
                                    layerKey={layerKey}
                                    initialValue={value}
                                    onChange={_self.onChangeLabelsHandler}/>,
                                document.getElementById(componentContainerId));
                            $(layerContainer).find('.js-layer-settings-labels').hide(0);
                            $(layerContainer).find(`.js-toggle-labels`).click(() => {
                                _self._selectIcon($(layerContainer).find('.js-toggle-labels'));
                                $(layerContainer).find('.js-layer-settings-labels').toggle();
                            });
                        } else {
                            console.error(`Unable to find the labels control container`);
                        }
                    }, 10);
                }

                if (isVirtual === false) {
                    let componentContainerId = `layer-settings-filters-${layerKey.replace('.', '-')}`;
                    $(layerContainer).find('.js-layer-settings-filters').append(`<div id="${componentContainerId}"></div>`);

                    let localArbitraryfilters = {};
                    if (moduleState.arbitraryFilters && layerKey in moduleState.arbitraryFilters) {
                        localArbitraryfilters = moduleState.arbitraryFilters[layerKey];
                    }

                    let localEditorFilters = [];
                    if (moduleState.editorFilters && layerKey in moduleState.editorFilters) {
                        localEditorFilters = moduleState.editorFilters[layerKey];
                    }

                    let localEditorFiltersActive = false;
                    if (moduleState.editorFiltersActive && layerKey in moduleState.editorFiltersActive) {
                        localEditorFiltersActive = moduleState.editorFiltersActive[layerKey];
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
                            console.warn(`Unable to parse filters settings for ${layerKey}`, parsedMeta[`wms_filters`]);
                            $(layerContainer).find(`.js-toggle-tile-filters`).remove();
                        }
                    }

                    let presetFilters = [];
                    if (parsedMeta.filter_config) {
                        try {
                            let filters = JSON.parse(parsedMeta.filter_config);
                            presetFilters = filters;
                        } catch (e) {
                            console.warn(`Unable to parse preset filters settings for ${layerKey}`, parsedMeta[`filter_config`]);
                        }
                    }

                    let isFilterImmutable = false;
                    if (parsedMeta.filter_immutable) {
                        isFilterImmutable = typeof parsedMeta.filter_immutable === "boolean" ? parsedMeta.filter_immutable : false;
                    }

                    let localFitBoundsActiveOnLayer = {};
                    if (moduleState.fitBoundsActiveOnLayers && layerKey in moduleState.fitBoundsActiveOnLayers) {
                        localFitBoundsActiveOnLayer = moduleState.fitBoundsActiveOnLayers[layerKey];
                    } else {
                        if (_self.getActiveLayerFilters(layerKey)?.length > 0) {
                            localFitBoundsActiveOnLayer = true;
                        } else {
                            localFitBoundsActiveOnLayer = false;
                        }
                    }

                    _self.activeFiltersChange(layerKey)
                    setTimeout(() => {
                        if (document.getElementById(componentContainerId)) {
                            filterComp[layerKey] = ReactDOM.render(
                                <LayerFilter
                                    layer={layer}
                                    layerMeta={meta.parseLayerMeta(layerKey)}
                                    presetFilters={presetFilters}
                                    predefinedFilters={localPredefinedFilters}
                                    disabledPredefinedFilters={moduleState.predefinedFilters[layerKey] ? moduleState.predefinedFilters[layerKey] : []}
                                    arbitraryFilters={localArbitraryfilters}
                                    fitBoundsActiveOnLayer={localFitBoundsActiveOnLayer}
                                    onApplyPredefined={_self.onApplyPredefinedFiltersHandler}
                                    onApplyArbitrary={_self.onApplyArbitraryFiltersHandler}
                                    onDisableArbitrary={_self.onDisableArbitraryFiltersHandler}
                                    onApplyFitBounds={_self.onApplyFitBoundsFiltersHandler}
                                    onApplyEditor={_self.onApplyEditorFiltersHandler}
                                    onActivateEditor={_self.onActivateEditorFiltersHandler}
                                    onChangeEditor={_self.onChangeEditorFiltersHandler}
                                    editorFilters={localEditorFilters}
                                    editorFiltersActive={localEditorFiltersActive}
                                    isFilterImmutable={isFilterImmutable}
                                    db={db}
                                    getActiveLayerFilters={_self.getActiveLayerFilters}
                                />, document.getElementById(componentContainerId));
                            $(layerContainer).find('.js-layer-settings-filters').hide(0);

                            $(layerContainer).find(`.js-toggle-filters`).click(() => {
                                _self._selectIcon($(layerContainer).find('.js-toggle-filters').first());
                                $(layerContainer).find('.js-layer-settings-filters').toggle();
                            });
                        } else {
                            console.error(`Unable to find the filter control container`);
                        }
                    }, 10);
                }

                if (isVectorLayer) {
                    if (isVirtual === false) {
                        let value = false;
                        if (layerKey in moduleState.dynamicLoad && [true, false].indexOf(moduleState.dynamicLoad[layerKey]) !== -1) {
                            value = moduleState.dynamicLoad[layerKey];
                        }

                        let componentContainerId = `layer-settings-load-strategy-${layerKey}`;
                        $(layerContainer).find('.js-layer-settings-load-strategy').append(`<div id="${componentContainerId}"></div>`);
                        setTimeout(() => {
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
                            } else {
                                console.error(`Unable to find the load strategy control container`);
                            }
                        }, 10);
                    }

                    // Table view
                    $(layerContainer).find(`.js-toggle-table`).click(() => {
                        let tableContainerId = `#table_view-${layerKey.replace(".", "_")}`;
                        // If table is open, then destroy it so it doesn't leak
                        if ($(tableContainerId + ` .bootstrap-table`).length > 0) {
                            tables[LAYER.VECTOR + ':' + layerKey].destroy();
                            delete tables[LAYER.VECTOR + ':' + layerKey];
                            $(tableContainerId + ` .bootstrap-table`).remove();
                        } else {
                            _self.createTable(layerKey, true);
                        }
                        _self._selectIcon($(layerContainer).find('.js-toggle-table'));
                        $(layerContainer).find('.js-layer-settings-table').toggle();

                        if ($(tableContainerId).length !== 1) throw new Error(`Unable to find the table view container`);

                        // Refresh all tables when opening one panel, because DOM changes can make the tables un-aligned
                        $(`.js-layer-settings-table table`).bootstrapTable('resetView');
                    });
                }

                // Vector styles
                const settingsStyle = $(layerContainer).find('.js-layer-settings-style')
                const componentContainerId = `layer-settings-styles-${layerKey}`;
                settingsStyle.append(`<div id="${componentContainerId}"></div>`);

                let values = {};
                if (layerKey in moduleState.vectorStyles) {
                    values = moduleState.vectorStyles[layerKey];
                } else {
                    values['styleFn'] = parsedMeta?.vector_style;
                    values['pointToLayerFn'] = parsedMeta?.point_to_layer;
                    values['tooltipTmpl'] = parsedMeta?.tooltip_template;
                    values['minZoom'] = parseInt(parsedMeta?.vector_min_zoom) || undefined;
                    values['maxZoom'] = parseInt(parsedMeta?.vector_max_zoom) || undefined;
                }

                setTimeout(() => {
                    if (document.getElementById(componentContainerId)) {
                        ReactDOM.render(<MetaSettingForm
                                layerKey={layerKey}
                                initialValues={values}
                                onChange={_self.onChangeStylesHandler}/>,
                            document.getElementById(componentContainerId));
                    } else {
                        console.error(`Unable to find the labels control container`);
                    }
                }, 10);

                $(layerContainer).find(`.js-toggle-style`).click(() => {
                    _self._selectIcon($(layerContainer).find('.js-toggle-style'));
                    $(layerContainer).find('.js-layer-settings-style').toggle();
                });

                $(layerContainer).find(`.js-toggle-search`).click(() => {
                    _self._selectIcon($(layerContainer).find('.js-toggle-search'));
                    $(layerContainer).find('.js-layer-settings-search').toggle();
                });

                $(layerContainer).find(`.js-toggle-download`).click(() => {
                    _self._selectIcon($(layerContainer).find('.js-toggle-download'));
                    $(layerContainer).find('.js-layer-settings-download').toggle();
                });

                // PostgreSQL search is for all types of layers
                $(layerContainer).find('.js-layer-settings-search').append(
                    `
                    <div>
                        <form class="row g-2" onsubmit="return false">
                            <div class="col-auto">
                                <input type="text" class="js-search-input form-control form-control-sm" placeholder="Abc123")}">
                            </div>
                            <div class="col-auto">
                                <button type="submit" class="btn btn-primary btn-sm">${__("Search")}</button>
                            </div>
                            <div class="form-inline" style="display: none">
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
                    `
                );

                setTimeout(() => {
                    let componentContainerId = `layer-settings-download-${layerKey.replace('.', '-')}`;
                    $(layerContainer).find('.js-layer-settings-download').append(`<div id="${componentContainerId}"></div>`);
                    if (document.getElementById(componentContainerId)) {
                        ReactDOM.render(<Download
                                layer={layer}
                                onApplyDownload={_self.onApplyDownloadHandler}
                            />,
                            document.getElementById(componentContainerId));
                    } else {
                        console.error(`Unable to find the download container`);
                    }
                }, 10);
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

                    $(search).on('submit', (e) => {
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

                $(layerContainer).attr(`data-widgets-were-initialized`, `true`);
            }
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

    onChangeLoadStrategyHandler: ({layerKey, dynamicLoadIsEnabled}) => {
        moduleState.dynamicLoad[layerKey] = dynamicLoadIsEnabled;
        let correspondingLayer = meta.getMetaByKey(layerKey);
        backboneEvents.get().trigger(`${MODULE_NAME}:dynamicLoadLayersChange`);
        _self.createStore(correspondingLayer);
        _self.reloadLayer(LAYER.VECTOR + ':' + layerKey);
    },

    onChangeLabelsHandler: ({layerKey, labelsAreEnabled}) => {
        moduleState.labelSettings[layerKey] = labelsAreEnabled;
        _self.reloadLayerOnLabelChange(layerKey);

    },

    onChangeStylesHandler: ({layerKey, obj}) => {
        // If the pointToLayer func is not set we set it to the default one
        if (!obj.pointToLayerFn) {
            obj.pointToLayerFn =
                `(feature, latlng) => {
                    return L.circleMarker(latlng, {pane: '${layerKey.replace('.', '-')}'});
                }`
        }
        moduleState.vectorStyles[layerKey] = obj;
        backboneEvents.get().trigger(`${MODULE_NAME}:changed`);
        let func;
        if (obj?.styleFn === '') {
            _self.setStyle(LAYER.VECTOR + ':' + layerKey, null)
        } else {
            try {
                func = Function('"use strict";return (' + obj.styleFn + ')')();
                _self.setStyle(LAYER.VECTOR + ':' + layerKey, func)
            } catch (e) {
                console.error(e.message)
                alert("Error in style function")
            }
        }

        try {
            func = Function('"use strict";return (' + obj.pointToLayerFn + ')')();
            _self.setPointToLayer(LAYER.VECTOR + ':' + layerKey, func)
        } catch (e) {
            console.error(e.message)
            alert("Error in point-to-layer function 2")
        }
        _self.reloadLayerOnStyleChange(layerKey)
    },

    onApplyArbitraryFiltersHandler: ({layerKey, filters}, forcedReloadLayerType = false) => {
        validateFilters(filters);
        moduleState.arbitraryFilters[layerKey] = filters;
        // Wait a bit for filter state
        setTimeout(() =>
                _self.reloadLayerOnFiltersChange(layerKey, forcedReloadLayerType),
            100);
    },

    onDisableArbitraryFiltersHandler: (layerKey) => {
        moduleState.fitBoundsActiveOnLayers[layerKey] = false;
    },

    onApplyFitBoundsFiltersHandler: (layerKey) => {
        let metaData = meta.getMetaByKey(layerKey);
        let whereClause = _self.getActiveLayerFilters(layerKey)[0];
        let sql = `SELECT ST_Xmin(ST_Extent(extent)) AS txmin,
                          ST_Xmax(ST_Extent(extent)) AS txmax,
                          ST_Ymin(ST_Extent(extent)) AS tymin,
                          ST_Ymax(ST_Extent(extent)) AS tymax
                   FROM (SELECT ST_astext(ST_Transform(ST_setsrid(ST_Extent(${metaData.f_geometry_column}), ${metaData.srid}), 4326)) AS extent
                         FROM ${layerKey}
                         WHERE ${whereClause}) as foo`;
        let q = {
            q: base64url(sql),
            base64: true
        }
        $.ajax({
            url: '/api/sql/' + urlparser.db,
            contentType: 'application/x-www-form-urlencoded',
            scriptCharset: "utf-8",
            dataType: 'json',
            type: 'POST',
            data: q,
            success: function (response) {
                let e = response.features[0].properties;
                cloud.get().map.fitBounds([[e.tymin, e.txmin], [e.tymax, e.txmax]], {maxZoom: 18})
            },
            error: function (response) {
            }
        });
        moduleState.fitBoundsActiveOnLayers[layerKey] = true;
    },
    onApplyDownloadHandler: (layerKey, format) => {
        let whereClause = _self.getActiveLayerFilters(layerKey)[0];
        let sql = `SELECT *
                   FROM ${layerKey}`
        if (whereClause) {
            sql += ` WHERE ${whereClause}`;
        }
        download.download(sql, format)
    },

    onApplyPredefinedFiltersHandler: ({layerKey, filters}, forcedReloadLayerType = false) => {
        moduleState.predefinedFilters[layerKey] = filters;
        _self.reloadLayerOnFiltersChange(layerKey, forcedReloadLayerType);
    },

    onChangeEditorFiltersHandler: ({layerKey, filters}, forcedReloadLayerType = false) => {
        moduleState.editorFilters[layerKey] = filters;
        backboneEvents.get().trigger(`${MODULE_NAME}:changed`);
    },

    onApplyEditorFiltersHandler: ({layerKey}, forcedReloadLayerType = false) => {
        _self.reloadLayerOnFiltersChange(layerKey, forcedReloadLayerType);
    },

    onActivateEditorFiltersHandler: ({layerKey, active}, forcedReloadLayerType = false) => {
        moduleState.editorFiltersActive[layerKey] = active;
    },

    reloadLayerOnLabelChange: (layerKey) => {
        _self.reloadLayer(layerKey, false, false, false);
    },

    reloadLayerOnStyleChange: (layerKey) => {
        _self.reloadLayer(LAYER.VECTOR + ':' + layerKey, false, false, false);
    },

    reloadLayerOnFiltersChange: (layerKey, forcedReloadLayerType = false) => {
        if (layerKey.indexOf(`:`) > -1) {
            throw new Error(`Filters have to operate only the layer key, without the layer type specifier`);
        }

        backboneEvents.get().trigger(`${MODULE_NAME}:changed`);

        let childrenLayerNames = [];
        let layerMeta = meta.getMetaByKey(layerKey, false);
        if (layerMeta.children && Array.isArray(layerMeta.children)) {
            layerMeta.children.map(child => {
                childrenLayerNames.push(child.rel);
            });
        }

        let activeLayers = _self.getActiveLayers();
        let layerIsActive = false;
        activeLayers.map(item => {
            if (layerTreeUtils.stripPrefix(item) === layerKey) {
                layerIsActive = true;
            }
        });

        if (layerIsActive === false && forcedReloadLayerType !== false) {
            activeLayers.push(forcedReloadLayerType + ':' + layerKey);
        }

        activeLayers.map(activeLayerKey => {
            if (layerTreeUtils.stripPrefix(activeLayerKey) === layerKey
                || childrenLayerNames.indexOf(layerTreeUtils.stripPrefix(activeLayerKey)) > -1) {
                let localLayerKey = layerKey;
                let childIsReloaded = false;
                if (childrenLayerNames.indexOf(layerTreeUtils.stripPrefix(activeLayerKey)) > -1) {
                    childIsReloaded = true;
                    localLayerKey = activeLayerKey;
                }

                const reloadLayer = () => {
                    let noPrefixLayerName = layerTreeUtils.stripPrefix(localLayerKey);
                    if (activeLayerKey === noPrefixLayerName) {
                        // Reloading as a tile layer
                        _self.reloadLayer(activeLayerKey, false, false, false);
                    } else if (activeLayerKey === (LAYER.VECTOR_TILE + `:` + noPrefixLayerName)) {
                        // Reloading as a vector tile layer
                        _self.reloadLayer(activeLayerKey, false, false, false);
                    } else if (activeLayerKey === (LAYER.VECTOR + `:` + noPrefixLayerName)) {
                        // Reloading as a vector layer
                        let correspondingLayer = meta.getMetaByKey(noPrefixLayerName);
                        _self.createStore(correspondingLayer);
                        _self.reloadLayer(activeLayerKey).then(() => {
                            backboneEvents.get().once(`doneLoading:layers`, () => {
                                if ($(`[data-gc2-layer-key^="${noPrefixLayerName}."]`).find(`.js-layer-settings-table`).is(`:visible`)) {
                                    _self.createTable(noPrefixLayerName, true);
                                }
                            });
                        });
                    } else {
                        console.error(`Unable to apply filters to layer ${localLayerKey}`);
                    }
                }

                if (childIsReloaded) {
                    backboneEvents.get().once("doneLoading:layers", function (e) {
                        if (layerTreeUtils.stripPrefix(e) === layerTreeUtils.stripPrefix(layerKey)) {
                            // Check if child layer should be reloaded.
                            if (_self.getChildLayersThatShouldBeEnabled().includes(layerTreeUtils.stripPrefix(localLayerKey))) {
                                reloadLayer();
                            }
                        }
                    });
                } else {
                    reloadLayer();
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
        moduleState.layerTreeOrder = layerTreeUtils.calculateOrder(moduleState.layerTreeOrder ? moduleState.layerTreeOrder : latestFullTreeStructure);
    },

    /**
     * Reloading provided layer.
     *
     * @param {String} layerId Layer identifier
     */
    reloadLayer: (layerId, forceTileRedraw = false, doNotLegend = false, setupControls = true) => {
        return new Promise((resolve, reject) => {
            switchLayer.init(layerId, false, doNotLegend, forceTileRedraw, false).then(() => {
                switchLayer.init(layerId, true, doNotLegend, forceTileRedraw, setupControls, false).then(() => {
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

    setStyle: function (layerName, fn) {
        if (!fn) {
            delete styles[layerName];
        } else {
            let foundLayers = layers.getMapLayers(false, layerName);
            if (foundLayers.length === 1) {
                let layer = foundLayers[0];
                layer.options.style = fn;
            }
            styles[layerName] = fn;
        }
    },

    setPointToLayer: function (layerName, fn) {
        if (fn === null) {
            const str = `(feature, latlng) => {return L.circleMarker(latlng, {pane: "${layerName.replace('.', '-').split(':')[1]}"});}`;
            fn = Function(`"use strict";return (${str})`)();
        }
        let foundLayers = layers.getMapLayers(false, layerName);
        if (foundLayers.length === 1) {
            let layer = foundLayers[0];
            layer.options.pointToLayer = fn;
        }
        pointToLayer[layerName] = fn;
    },

    setOnSelectedStyle: function (layer, style) {
        onSelectedStyle[layer] = style;
    },

    load: function (id) {
        moduleState.vectorStores[id].load();
    },

    getChildLayersThatShouldBeEnabled: function () {
        return childLayersThatShouldBeEnabled;
    },

    setChildLayersThatShouldBeEnabled: function (arr) {
        childLayersThatShouldBeEnabled = arr;
    },

    toolTip: function (layer, feature, template, pane) {
        const tooltipHtml = Handlebars.compile(template)(feature.properties);
        layer.bindTooltip(tooltipHtml, {permanent: true, pane}).openTooltip();
    },

    mouseOver: function (layer, fieldConf, template) {
        let flag = false, tooltipHtml, tail = $("#tail");
        layer.on('mouseover', function (e) {
            let data = e?.sourceTarget?.feature?.properties || e?.data;
            let tmp = $.extend(true, {}, data), fi = [];
            flag = true;
            $.each(tmp, function (name, property) {
                if (typeof fieldConf[name] !== "undefined" && fieldConf[name].mouseover) {
                    let title;
                    if (
                        typeof fieldConf[name] !== "undefined" &&
                        typeof fieldConf[name].alias !== "undefined" &&
                        fieldConf[name].alias !== ""
                    ) {
                        title = fieldConf[name].alias
                    } else {
                        title = name;
                    }
                    fi.push({
                        title: title,
                        value: property
                    });
                }
            });
            tmp.data = fi; // Used in a "loop" template
            tooltipHtml = Handlebars.compile(template)(tmp);
            tail.fadeIn(100);
            tail.html(tooltipHtml);
        });
        layer.on('mouseout', function () {
            flag = false;
            setTimeout(function () {
                if (!flag) {
                    $("#tail").fadeOut(100);
                }
            }, 200)

        });
    },

    resetAllVectorLayerStyles: () => {
        $.each(moduleState.vectorStores, function (u, store) {
            $.each(store.layer._layers, function (i, v) {
                if (v?._icon) {
                    const style = getComputedStyle(v._icon);
                    let matrix = new DOMMatrix(style.transform);
                    matrix.a = matrix.d = 1;
                    v._icon.style.transform = matrix.toString();
                    // v._icon.style.transition = 'transform 0s ease-in-out'
                }
                try {
                    if (store.layer && store.layer.resetStyle) {
                        store.layer.resetStyle(v);
                    }
                } catch (e) {
                    console.log(e);
                }
            });
        })
    },

    scaleIcon: (icon) => {
        const style = getComputedStyle(icon);
        const matrix = new DOMMatrix(style.transform);
        matrix.a = matrix.d = SELECTED_ICON_SCALE;
        icon.style.transformOrigin = 'center';
        icon.style.transform = matrix.toString();
        // icon.style.transition = 'transform .1s ease-in-out'
    },
    getInfoOffCanvas: () => {
        return infoOffCanvas;
    },
    getLatestFullTreeStructure: () => {
        return latestFullTreeStructure;
    }

}

