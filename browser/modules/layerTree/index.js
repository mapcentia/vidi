/*
 * @author     Alexander Shumilov
 * @copyright  2013-2018 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

/**
 * @fileoverview Description of file, its uses and information
 * about its dependencies.
 */

'use strict';

const LOG = false;

const MODULE_NAME = `layerTree`;

const SYSTEM_FIELD_PREFIX = `gc2_`;

const SQL_QUERY_LIMIT = 2000;

const TABLE_VIEW_FORM_CONTAINER_ID = 'vector-layer-table-view-form';

const TABLE_VIEW_CONTAINER_ID = 'vector-layer-table-view-dialog';

var meta, layers, sqlQuery, switchLayer, cloud, legend, state, backboneEvents;

var applicationIsOnline = -1;

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
    <div class="form-group gc2-edit-tools">
        {{#_vidi_content.fields}}
            {{#title}}<h4>{{title}}</h4>{{/title}}
            {{#value}}
            <p {{#type}}class="{{ type }}"{{/type}}>{{{ value }}}</p>
            {{/value}}
            {{^value}}
            <p class="empty">null</p>
            {{/value}}
        {{/_vidi_content.fields}}
    </div>
</div>`;

/**
 * Layer filters
 */
var React = require('react');
var ReactDOM = require('react-dom');

import noUiSlider from 'nouislider';

import TileLayerFilter from './TileLayerFilter';
import VectorLayerFilter from './VectorLayerFilter';
import LoadStrategyToggle from './LoadStrategyToggle';
import {relative} from 'path';
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

/**
 *
 * @type {*|exports|module.exports}
 */

import {GROUP_CHILD_TYPE_LAYER, GROUP_CHILD_TYPE_GROUP, LayerSorting} from './LayerSorting';

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
let tileFilters = {};

let extensions = false;

let editor = false;

/**
 *
 * @type {showdown.Converter}
 */
const showdown = require('showdown');
const converter = new showdown.Converter();

let qstore = [];

/**
 * Communicating with the service workied via MessageChannel interface
 *
 * @returns {Promise}
 */
const queryServiceWorker = (data) => {
    return new Promise((resolve, reject) => {
        if (navigator.serviceWorker.controller) {
            let messageChannel = new MessageChannel();
            messageChannel.port1.onmessage = (event) => {
                if (event.data.error) {
                    reject(event.data.error);
                } else {
                    resolve(event.data);
                }
            };

            navigator.serviceWorker.controller.postMessage(data, [messageChannel.port2]);
        } else {
            console.error(`Unable to query service worker as it is not registered yet`);
            reject();
        }
    });
};

let setLayerOpacityRequests = [];
const applyOpacityToLayer = (opacity, layerKey) => {
    let opacityWasSet = false;
    for (let key in cloud.get().map._layers) {
        if (`id` in cloud.get().map._layers[key] && cloud.get().map._layers[key].id) {
            if (cloud.get().map._layers[key].id === layerKey) {
                opacityWasSet = true;
                cloud.get().map._layers[key].setOpacity(opacity);
                backboneEvents.get().trigger(`${MODULE_NAME}:opacityChange`);
            }
        }
    }
};

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
            editingIsEnabled = true;
        }

        _self = this;
        queueStatistsics = new QueueStatisticsWatcher({switchLayer, offlineModeControlsManager, layerTree: _self});
        apiBridgeInstance = APIBridgeSingletone((statistics, forceLayerUpdate) => {
            _self.statisticsHandler(statistics, forceLayerUpdate);
        });

        state.listenTo('layerTree', _self);
    },

    statisticsHandler: (statistics, forceLayerUpdate, skipLastStatisticsCheck) => {
        if (layerTreeWasBuilt === false || _self.isReady() == false) {
            return;
        } else {
            _self._setupToggleOfflineModeControlsForLayers().then(() => {
                queueStatistsics.processStatisticsUpdate(statistics, forceLayerUpdate, skipLastStatisticsCheck, userPreferredForceOfflineMode, apiBridgeInstance);
            });
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
    getLayerTreeSettings: () => {
        let result = new Promise((resolve, reject) => {
            state.getModuleState(MODULE_NAME).then(initialState => {
                let order = ((initialState && `order` in initialState) ? initialState.order : false);
                let offlineModeSettings = ((initialState && `layersOfflineMode` in initialState) ? initialState.layersOfflineMode : false);
                let initialVectorFilters = ((initialState && `vectorFilters` in initialState && typeof initialState.vectorFilters === `object`) ? initialState.vectorFilters : {});
                let initialTileFilters = ((initialState && `tileFilters` in initialState && typeof initialState.tileFilters === `object`) ? initialState.tileFilters : {});
                let opacitySettings = ((initialState && `opacitySettings` in initialState) ? initialState.opacitySettings : {});
                resolve({order, offlineModeSettings, initialVectorFilters, initialTileFilters, opacitySettings});
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
                        queryServiceWorker({action: `getListOfCachedRequests`}).then(response => {
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
     * Creating request for building the tree.
     * In order to avoid race condition as simultaneous calling of run() the pending create()
     * requests are performed one by one.
     */
    create: (forcedState = false) => {
        if (LOG) console.log(`${MODULE_NAME}: create`, treeIsBeingBuilt, forcedState);

        queueStatistsics.setLastStatistics(false);

        /**
         * Opacity settings needs to be applied when layer is loaded. As layer loading takes some
         * time, the application of opacity setting has to be posponed as well. The setLayerOpacityRequests
         * contains opacity settings for layers and is cleaned up on every run.
         */
        backboneEvents.get().on(`doneLoading:layers`, layerKey => {
            for (let i = (setLayerOpacityRequests.length - 1); i >= 0; i--) {
                let item = setLayerOpacityRequests[i];
                if (item.layerKey === layerKey) {
                    applyOpacityToLayer(item.opacity, layerKey);
                    if (i >= 1) {
                        for (let j = (i - 1); j >= 0; j--) {
                            let subItem = setLayerOpacityRequests[j];
                            if (subItem.layerKey === layerKey) {
                                // Remove irrelevant opacity settings
                                setLayerOpacityRequests.splice(j, 1);
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
            for (let layerKey in stores) {
                let layerIsEnabled = false;
                for (let i = 0; i < activeLayers.length; i++) {
                    if (activeLayers[i].replace(`v:`, ``) === layerKey.replace(`v:`, ``)) {
                        layerIsEnabled = true;
                        break;
                    }
                }

                if (layerIsEnabled) {
                    let layerDescription = meta.getMetaByKey(layerKey.replace(`v:`, ``));
                    let parsedMeta = _self.parseLayerMeta(layerDescription);

                    // Reload should always occur except times when current bbox is completely inside
                    // of the previously requested bbox (extended one in gc2cloud.js) kept in corresponding store
                    let needToReload;
                    if (parsedMeta && `load_strategy` in parsedMeta && parsedMeta.load_strategy === `d`) {
                        needToReload = true
                        let currentMapBBox = cloud.get().map.getBounds();
                        if (`buffered_bbox` in stores[layerKey]) {
                            if (stores[layerKey].buffered_bbox === false || stores[layerKey].buffered_bbox && stores[layerKey].buffered_bbox.contains(currentMapBBox)) {
                                needToReload = false;
                            }
                        }
                    } else {
                        needToReload = false;
                    }

                    if (needToReload) {
                        stores[layerKey].abort();
                        stores[layerKey].load();
                    }
                }
            }
        });

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
                    _self.getLayerTreeSettings().then(({order, offlineModeSettings, initialVectorFilters, initialTileFilters, opacitySettings}) => {

                        try {

                            if (vectorFilters) {
                                vectorFilters = initialVectorFilters;
                            }

                            if (initialTileFilters) {
                                tileFilters = initialTileFilters;
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

                                if (`opacitySettings` in forcedState) {
                                    opacitySettings = forcedState.opacitySettings;
                                }

                                if (`tileFilters` in forcedState && forcedState.tileFilters) {
                                    tileFilters = forcedState.tileFilters;
                                } 

                                if (LOG) console.log(`${MODULE_NAME}: layers that are not in meta`, layersThatAreNotInMeta);
                            }

                            if (LOG) console.log(`${MODULE_NAME}: activeLayers`, activeLayers);
                            const proceedWithBuilding = () => {
                                layerTreeOrder = order;
                                if (editingIsEnabled) {
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
                                    state.listen(MODULE_NAME, `layersOfflineModeChange`);
                                    state.listen(MODULE_NAME, `activeLayersChange`);
                                    state.listen(MODULE_NAME, `filtersChange`);
                                    state.listen(MODULE_NAME, `opacityChange`);

                                    backboneEvents.get().trigger(`${MODULE_NAME}:sorted`);
                                    setTimeout(() => {
                                        if (LOG) console.log(`${MODULE_NAME}: active layers`, activeLayers);

                                        const turnOnActiveLayersAndFinishBuilding = () => {
                                            return new Promise((localResolve, reject) => {
                                                if (activeLayers) {
                                                    activeLayers.map(layerName => {
                                                        let layerMeta = meta.getMetaByKey(layerName.replace('v:', ''));
        
                                                        if ($(`[data-gc2-layer-key="${layerName.replace('v:', '')}.${layerMeta.f_geometry_column}"]`).find(`.js-layer-type-selector-tile`).length === 1 &&
                                                            $(`[data-gc2-layer-key="${layerName.replace('v:', '')}.${layerMeta.f_geometry_column}"]`).find(`.js-layer-type-selector-vector`).length === 1) {
                                                            if (layerName.indexOf(`v:`) === 0) {
                                                                $(`[data-gc2-layer-key="${layerName.replace('v:', '')}.${layerMeta.f_geometry_column}"]`).find(`.js-layer-type-selector-vector`).trigger(`click`, [{doNotLegend: true}]);
                                                            } else {
                                                                $(`[data-gc2-layer-key="${layerName.replace('v:', '')}.${layerMeta.f_geometry_column}"]`).find(`.js-layer-type-selector-tile`).trigger(`click`, [{doNotLegend: true}]);
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
        
                                                localResolve();
                                            });
                                        };

                                        const setOfflineModeSettingsForCache = () => {
                                            return new Promise((localResolve, reject) => {
                                                queryServiceWorker({action: `getListOfCachedRequests`}).then(currentCachedRequests => {
                                                    let promisesContent = [];
                                                    if (Object.keys(offlineModeSettings).length > 0) {



                                                        currentCachedRequests.map(cachedRequest => {
                                                            let setOfflineModeForCurrentCachedRequestTo = false;
                                                            for (let key in offlineModeSettings) {
                                                                if (cachedRequest.layerKey.replace(`v:`, ``) === key.replace(`v:`, ``)) {
                                                                    setOfflineModeForCurrentCachedRequestTo = offlineModeSettings[key];
                                                                }
                                                            }

                                                            if (setOfflineModeForCurrentCachedRequestTo) {
                                                                promisesContent.push({
                                                                    action: `enableOfflineModeForLayer`,
                                                                    payload: { layerKey: cachedRequest.layerKey }
                                                                });
                                                            } else {
                                                                promisesContent.push({
                                                                    action: `disableOfflineModeForLayer`,
                                                                    payload: { layerKey: cachedRequest.layerKey }
                                                                });
                                                            }
                                                        });

                                                        for (let key in offlineModeSettings) {
                                                            let offlineModeSettingWasApplied = false;
                                                            promisesContent.map(item => {
                                                                if (item.payload.layerKey.replace(`v:`, ``) === key.replace(`v:`, ``)) {
                                                                    offlineModeSettingWasApplied = true;
                                                                }
                                                            });

                                                            if (offlineModeSettingWasApplied === false) {
                                                                if (offlineModeSettings[key]) {
                                                                    console.warn(`Unable to make ${key} offline, as it has not been cached before`);
                                                                }
                                                            }
                                                        }
                                                    } else {
                                                        // Disabling offline mode for all layers
                                                        currentCachedRequests.map(cachedRequest => {
                                                            if (cachedRequest.offlineMode) {
                                                                promisesContent.push({
                                                                    action: `disableOfflineModeForLayer`,
                                                                    payload: { layerKey: cachedRequest.layerKey }
                                                                });
                                                            }
                                                        });
                                                    }

                                                    let promises = [];
                                                    promisesContent.map(item => promises.push(queryServiceWorker(item)));
                                                    Promise.all(promises).then(() => {
                                                        turnOnActiveLayersAndFinishBuilding().then(() => {
                                                            queryServiceWorker({action: `getListOfCachedRequests`}).then(localResolve);
                                                        });
                                                    });
                                                });
                                            });
                                        };

                                        if (`serviceWorker` in navigator && navigator.serviceWorker.controller) {
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
     * Checks if the offline mode settings for vector layers do not conflict with the service worker cache. If
     * there is a conflict, it is better to silently remove the conflicting offline mode settings, either
     * explain user that his service worker cache for specific layer does not exist.
     *
     * @returns {Promise}
     */
    _applyOfflineModeSettings: (settings) => {
        return new Promise((resolve, reject) => {
            queryServiceWorker({action: `getListOfCachedRequests`}).then(response => {
                if (Array.isArray(response)) {
                    if (Object.keys(settings).length === 0) {
                        // Empty object means that all layers should have the offline mode to be turned off
                        let promises = [];
                        response.map(cachedRequest => {
                            promises.push(queryServiceWorker({
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
                            if (key.indexOf(`v:`) === 0) {
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
                                        
                                        promises.push(queryServiceWorker({
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
        return treeIsBeingBuilt;
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
     * @param {Object} layer Layer description
     *
     * @return {void}
     */
    createStore: (layer) => {
        let layerKey = layer.f_table_schema + '.' + layer.f_table_name;

        let whereClauses = [];

        if (vectorFilters && layerKey in vectorFilters) {
            let conditions = _self.getFilterConditions(layerKey);
            if (conditions.length > 0) {
                if (vectorFilters[layerKey].match === `any`) {
                    whereClauses.push(conditions.join(` OR `));
                } else if (vectorFilters[layerKey].match === `all`) {
                    whereClauses.push(conditions.join(` AND `));
                } else {
                    throw new Error(`Invalid match type value`);
                }
            }

            $(`[data-gc2-layer-key="${layerKey + `.` + layer.f_geometry_column}"]`).find(`.js-toggle-filters-number-of-filters`).text(conditions.length);
        }

        // Checking if versioning is enabled for layer
        if (`versioning` in layer && layer.versioning) {
            whereClauses.push(`gc2_version_end_date is null`);
        }

        // Checking if dynamic load is enabled for layer
        let layerMeta = _self.parseLayerMeta(layer);
        if (layerMeta && `load_strategy` in layerMeta && layerMeta.load_strategy === `d`) {
            whereClauses.push(`ST_Intersects(ST_Force2D(${layer.f_geometry_column}), ST_Transform(ST_MakeEnvelope ({minX}, {minY}, {maxX}, {maxY}, 4326), ${layer.srid}))`);
        }

        // Gathering all WHERE clauses
        let sql = `SELECT * FROM ${layerKey} LIMIT ${SQL_QUERY_LIMIT}`;
        if (whereClauses.length > 0) {
            whereClauses = whereClauses.map(item => `(${item})`);
            sql = `SELECT * FROM ${layerKey} WHERE (${whereClauses.join(` AND `)}) LIMIT ${SQL_QUERY_LIMIT}`;
        }

        stores['v:' + layerKey] = new geocloud.sqlStore({
            map: cloud.get().map,
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
                $(`#` + TABLE_VIEW_FORM_CONTAINER_ID + `-${tableId}`).append(`<div class="js-table-view-container" id="${tableId}_container">
                    <div id="${tableId}"><table class="table" data-show-toggle="true" data-show-export="false" data-show-columns="true"></table></div>
                </div>`);

                let metaDataKeys = meta.getMetaDataKeys();
                let template = (typeof metaDataKeys[layerKey].infowindow !== "undefined"
                    && metaDataKeys[layerKey].infowindow.template !== "")
                    ? metaDataKeys[layerKey].infowindow.template : defaultTemplate;
                let tableHeaders = sqlQuery.prepareDataForTableView(`v:` + layerKey, l.geoJSON.features);

                let localTable = gc2table.init({
                    el: `#` + tableId + ` table`,
                    ns: `#` + tableId,
                    geocloud2: cloud.get(),
                    store: stores[`v:` + layerKey],
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
                    template: template
                });

                localTable.loadDataInTable(true);

                tables[`v:` + layerKey] = localTable;

                $('*[data-gc2-id-vec="' + l.id + '"]').parent().siblings().children().removeClass("fa-spin");

                layers.decrementCountLoading(l.id);
                backboneEvents.get().trigger("doneLoading:layers", l.id);
                if (typeof onLoad['v:' + layerKey] === "function") {
                    onLoad['v:' + layerKey](l);
                }
            },
            transformResponse: (response, id) => {
                return apiBridgeInstance.transformResponseHandler(response, id);
            },
            onEachFeature: (feature, layer) => {
                if (('v:' + layerKey) in onEachFeature) {
                    /*
                        Checking for correct onEachFeature structure
                    */
                    if (`fn` in onEachFeature['v:' + layerKey] === false || !onEachFeature['v:' + layerKey].fn ||
                        `caller` in onEachFeature['v:' + layerKey] === false || !onEachFeature['v:' + layerKey].caller) {
                        throw new Error(`Invalid onEachFeature structure`);
                    }

                    if (onEachFeature['v:' + layerKey].caller === `editor`) {
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
                            if (editingIsEnabled && layerIsEditable) {
                                editingButtonsMarkup = markupGeneratorInstance.getEditingButtons();
                            }

                            _self.displayAttributesPopup(feature, layer, e, editingButtonsMarkup);

                            if (editingIsEnabled && layerIsEditable) {
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

                    onEachFeature['v:' + layerKey].fn(feature, layer);
                } else {
                    // If there is no handler for specific layer, then display attributes only
                    layer.on("click", function (e) {
                        _self.displayAttributesPopup(feature, layer, e);
                    });
                }
            },
            pointToLayer: (pointToLayer.hasOwnProperty('v:' + layerKey) ? pointToLayer['v:' + layerKey] : (feature, latlng) => {
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

        let renderedText = Mustache.render(defaultTemplate, properties);
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
     * Extracts valid conditions for specified layer
     *
     * @param {String} layerKey Vector layer identifier
     */
    getFilterConditions(layerKey) {
        let layer = meta.getMetaByKey(layerKey);

        let conditions = [];
        if (vectorFilters && layerKey in vectorFilters) {
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
    createGroupRecord: (groupName, order, forcedState, opacitySettings, precheckedLayers) => {
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

        // Reverse subgroups
        notSortedLayersAndSubgroupsForCurrentGroup.map((item) => {
            if (item.type === "group") {
                item.children.reverse();
            }
        });

        // Reverse groups
        let layersAndSubgroupsForCurrentGroup = layerSortingInstance.sortLayers(order, notSortedLayersAndSubgroupsForCurrentGroup.reverse(), groupName);

        // Add layers and subgroups
        let numberOfAddedLayers = 0;
        for (var u = 0; u < layersAndSubgroupsForCurrentGroup.length; ++u) {
            let localItem = layersAndSubgroupsForCurrentGroup[u];
            if (localItem.type === GROUP_CHILD_TYPE_LAYER) {
                let {layerIsActive, activeLayerName} = _self.checkIfLayerIsActive(forcedState, precheckedLayers, localItem.layer);
                if (layerIsActive) {
                    numberOfActiveLayers++;
                }

                _self.createLayerRecord(localItem.layer, forcedState, opacitySettings, precheckedLayers, base64GroupName, layerIsActive, activeLayerName);
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

        return {layerIsActive, activeLayerName}
    },

    /**
     * Generates single subgroup control
     *
     * @returns {Object}
     */
    createSubgroupRecord: (subgroup, forcedState, opacitySettings, precheckedLayers, base64GroupName) => {
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
            let {layerIsActive, activeLayerName} = _self.checkIfLayerIsActive(forcedState, precheckedLayers, child);
            if (layerIsActive) {
                activeLayers++;
            }

            _self.createLayerRecord(child, forcedState, opacitySettings, precheckedLayers, base64GroupName, layerIsActive, activeLayerName, subgroup.id, base64SubgroupName);
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
    createLayerRecord: (layer, forcedState, opacitySettings, precheckedLayers, base64GroupName, layerIsActive, activeLayerName, subgroupId = false, base64SubgroupName = false) => {
        let displayInfo = `hidden`;
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
            let parsedMeta = false;
            if (layer && layer.meta) {
                parsedMeta = _self.parseLayerMeta(layer);
                if (parsedMeta) {
                    if (`vidi_layer_editable` in parsedMeta && parsedMeta.vidi_layer_editable) {
                        layerIsEditable = true;
                    }

                    if (`meta_desc` in parsedMeta) {
                        displayInfo = (parsedMeta.meta_desc || layer.f_table_abstract) ? `visible` : `hidden`;
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
                layerTypeSelector = ``;
            } else {
                layerTypeSelector = markupGeneratorInstance.getLayerTypeSelector(selectorLabel, tileLayerIcon, vectorLayerIcon);
            }

            let addButton = ``;
            if (editingIsEnabled && layerIsEditable) {
                addButton = markupGeneratorInstance.getAddButton(layerKeyWithGeom);
            }

            let selectorLayerType = `tile`;
            if (layerIsTheVectorOne && layerIsTheTileOne === false) {
                selectorLayerType = `vector`;
            }

            let layerControlRecord = $(markupGeneratorInstance.getLayerControlRecord(layerKeyWithGeom, layerKey, layerIsActive,
                layer, selectorLayerType, layerTypeSelector, text, lockedLayer, addButton, displayInfo));

            $(layerControlRecord).find('.js-layer-type-selector-tile').first().on('click', (e, data) => {
                let switcher = $(e.target).closest('.layer-item').find('.js-show-layer-control');
                $(switcher).data('gc2-layer-type', 'tile');
                $(switcher).prop('checked', true);

                _self.setupLayerAsTileOne(layerKey);
                _self.reloadLayer($(switcher).data('gc2-id'), false, (data ? data.doNotLegend : false));

                $(e.target).closest('.layer-item').find('.js-dropdown-label').html(tileLayerIcon);
                backboneEvents.get().trigger(`${MODULE_NAME}:activeLayersChange`);
                offlineModeControlsManager.updateControls();
            });

            $(layerControlRecord).find('.js-layer-type-selector-vector').first().on('click', (e, data) => {
                let switcher = $(e.target).closest('.layer-item').find('.js-show-layer-control');
                $(switcher).data('gc2-layer-type', 'vector');
                $(switcher).prop('checked', true);

                _self.setupLayerAsVectorOne(layerKey);
                _self.reloadLayer('v:' + $(switcher).data('gc2-id'), false, (data ? data.doNotLegend : false));

                $(e.target).closest('.layer-item').find('.js-dropdown-label').html(vectorLayerIcon);
                backboneEvents.get().trigger(`${MODULE_NAME}:activeLayersChange`);
                offlineModeControlsManager.updateControls();
            });

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
                    queryServiceWorker({
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
                    queryServiceWorker({
                        action: `disableOfflineModeForLayer`,
                        payload: {layerKey}
                    }).then(() => {
                        _self.reloadLayer(`v:` + layerKey).then(() => {
                            queryServiceWorker({
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

            let initialSliderValue = 1;
            if (layerIsTheTileOne) {
                _self.setupLayerAsTileOne(layerKey);

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
                        applyOpacityToLayer(sliderValue, layerKey);
                        setLayerOpacityRequests.push({layerKey, opacity: sliderValue});
                    });
                }

                // Assuming that it not possible to set layer opacity right now
                setLayerOpacityRequests.push({layerKey, opacity: initialSliderValue});

                $(layerContainer).find(`.js-toggle-opacity`).click(() => {
                    _self._selectIcon($(layerContainer).find('.js-toggle-opacity'));
                    $(layerContainer).find('.js-layer-settings-opacity').toggle();
                });

                $(layerContainer).find(`.js-toggle-tile-filters`).click(() => {
                    $(layerContainer).find('.js-layer-settings-tile-filters').toggle();
                });
            }

            if (layerIsTheVectorOne) {
                // Vector layer filters
                let componentContainerId = `layer-settings-filters-${layerKey}`;
                $(layerContainer).find('.js-layer-settings-filters').append(`<div id="${componentContainerId}" style="padding-left: 15px; padding-right: 10px; padding-bottom: 10px;"></div>`);

                let conditions = _self.getFilterConditions(layerKey);
                $(layerContainer).find(`.js-toggle-filters-number-of-filters`).text(conditions.length);
                let filters = {};
                if (vectorFilters && layerKey in vectorFilters) {
                    filters = vectorFilters[layerKey];
                }

                if (document.getElementById(componentContainerId)) {
                    ReactDOM.render(
                        <VectorLayerFilter layer={layer} filters={filters} onApply={_self.onApplyVectorFiltersHandler}/>, document.getElementById(componentContainerId));
                    $(layerContainer).find('.js-layer-settings-filters').hide(0);

                    $(layerContainer).find(`.js-toggle-filters`).click(() => {
                        _self._selectIcon($(layerContainer).find('.js-toggle-filters').first());
                        $(layerContainer).find('.js-layer-settings-filters').toggle();
                    });
                }

                // Load strategy
                if (`load_strategy` in parsedMeta && parsedMeta.load_strategy === `d`) {
                    
                    // @todo Depends on local saved values
                    let value = true;

                    componentContainerId = `layer-settings-load-strategy-${layerKey}`;
                    $(layerContainer).find('.js-layer-settings-load-strategy').append(`<div id="${componentContainerId}" style="padding-left: 15px; padding-right: 10px; padding-bottom: 10px;"></div>`);
                    if (document.getElementById(componentContainerId)) {
                        ReactDOM.render(<LoadStrategyToggle initialValue={value} onChange={_self.onChangeLoadStrategyHandler}/>,
                            document.getElementById(componentContainerId));
                        $(layerContainer).find('.js-layer-settings-load-strategy').hide(0);
                        $(layerContainer).find(`.js-toggle-load-strategy`).click(() => {
                            $(layerContainer).find('.js-layer-settings-load-strategy').toggle();
                        });
                    }
                }

                // Table view
                $(layerContainer).find(`.js-toggle-table-view`).click(() => {
                    _self._selectIcon($(layerContainer).find('.js-toggle-table-view'));
                    $(layerContainer).find('.js-layer-settings-table').toggle();

                    activeOpenedTable = `v:` + layerKey;

                    let tableId = `table_view_${layerKey.replace(`.`, `_`)}`;
                    if ($(`#${tableId}_container`).length !== 1) throw new Error(`Unable to find the table view container`);

                    // Refresh all tables when opening one panel, because DOM changes can make the tables un-aligned
                    $(`.js-layer-settings-table table`).bootstrapTable('resetView');

                    // If data has not been loaded yet, then load it
                    if ($(`#${tableId}`).children().length === 0) {
                        tables[activeOpenedTable].loadDataInTable(true);
                    }

                });

                if (defaultLayerType === `vector`) {
                    _self.setupLayerAsVectorOne(layerKey);
                } else {
                    _self.setupLayerAsTileOne(layerKey);
                }
            } else {
                if (parsedMeta && parsedMeta && `WMS filters` in parsedMeta && parsedMeta[`WMS filters`]) {
                    let parsedWMSFilters = false;
                    try {
                        let parsedWMSFiltersLocal = JSON.parse(parsedMeta[`WMS filters`]);
                        parsedWMSFilters = parsedWMSFiltersLocal;
                    } catch (e) {}

                    if (parsedWMSFilters && Object.keys(parsedWMSFilters).length > 0) {
                        let componentContainerId = `layer-settings-tile-filters-${layerKey}`;
                        $(layerContainer).find('.js-layer-settings-tile-filters').append(`<div id="${componentContainerId}" style="padding-left: 15px; padding-right: 10px; padding-bottom: 10px;"></div>`);
                        if (document.getElementById(componentContainerId)) {
                            ReactDOM.render(<TileLayerFilter
                                layerKey={layerKey}
                                filters={parsedWMSFilters}
                                disabledFilters={tileFilters[layerKey]}
                                onApply={_self.onApplyTileFiltersHandler}/>,
                                document.getElementById(componentContainerId));
                            $(layerContainer).find('.js-layer-settings-tile-filters').hide(0);
                        }
                    }
                } else {
                    $(layerContainer).find(`.js-toggle-tile-filters`).remove();
                }
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

    /**
     * Setups layer as the vector one
     */
    setupLayerAsVectorOne: (layerKey, ignoreErrors, layerIsEnabled) => {
        _self.setupLayerControls(true, layerKey, ignoreErrors, layerIsEnabled);
    },

    /**
     * Setups layer as the tile one
     */
    setupLayerAsTileOne: (layerKey, ignoreErrors, layerIsEnabled) => {
        _self.setupLayerControls(false, layerKey, ignoreErrors, layerIsEnabled);
    },

    /**
     * Returns tile filter string for specific tile layer
     */
    getLayerFilterString: (layerKey) => {
        if (!layerKey || layerKey.length === 0 || layerKey.indexOf(`v:`) === 0) {
            throw new Error(`Invalid tile layer name ${layerKey}`);
        }

        let filters = false;
        if (tileFilters && layerKey in tileFilters && tileFilters[layerKey]) {
            filters = tileFilters[layerKey];
        }

        let layerDescription = meta.getMetaByKey(layerKey);
        let parsedMeta = _self.parseLayerMeta(layerDescription);
        let parameterString = false;
        if (parsedMeta && parsedMeta && `WMS filters` in parsedMeta && parsedMeta[`WMS filters`]) {
            let parsedWMSFilters = false;
            try {
                let parsedWMSFiltersLocal = JSON.parse(parsedMeta[`WMS filters`]);
                parsedWMSFilters = parsedWMSFiltersLocal;
            } catch (e) {}

            parameterString = `&filters=`;
            let appliedFilters = {};
            if (parsedWMSFilters) {
                for (let key in parsedWMSFilters) {
                    if (filters === false || filters.indexOf(key) === -1) {
                        appliedFilters[key] = parsedWMSFilters[key];
                    }
                }
            }

            parameterString = parameterString + JSON.stringify(appliedFilters);
        }

        return parameterString;
    },

    /**
     * By design the layer control is rendered with controls both for tile and vector case, so
     * this function regulates the visibility and initialization of layer type specific controls.
     *
     * @param {Boolean} setupAsVector  Specifies if layer should be setup as the vector one
     * @param {String}  layerKey       Layer key
     * @param {Boolean} ignoreErrors   Specifies if errors should be ignored
     * @param {Boolean} layerIsEnabled Specifies if layer is enabled
     */
    setupLayerControls: (setupAsVector, layerKey, ignoreErrors = true, layerIsEnabled = false) => {
        layerKey = layerKey.replace(`v:`, ``);
        let layerMeta = meta.getMetaByKey(layerKey);
        let container = $(`[data-gc2-layer-key="${layerKey}.${layerMeta.f_geometry_column}"]`);
        if (container.length === 1) {
            if (setupAsVector) {
                $(container).find(`.js-toggle-layer-offline-mode-container`).show();
            } else {
                $(container).find(`.js-toggle-layer-offline-mode-container`).hide();
            }

            if (setupAsVector) {
                $(container).find(`.js-toggle-tile-filters`).hide();
                $(container).find(`.js-toggle-opacity`).hide();
                if (layerIsEnabled) {
                    $(container).find(`.js-toggle-table-view`).show();
                } else {
                    $(container).find(`.js-toggle-table-view`).hide();
                    $(container).find('.js-layer-settings-filters').hide(0);
                    $(container).find('.js-layer-settings-load-strategy').hide(0);
                    $(container).find('.js-layer-settings-table').hide(0);
                }

                $(container).find(`.js-toggle-filters`).show(0);
                $(container).find(`.js-toggle-load-strategy`).show(0);
                $(container).find('.js-layer-settings-opacity').hide(0);
            } else {
                if (layerIsEnabled) {
                    $(container).find(`.js-toggle-tile-filters`).show();
                    $(container).find(`.js-toggle-opacity`).show();
                } else {
                    $(container).find(`.js-toggle-tile-filters`).hide();
                    $(container).find(`.js-toggle-opacity`).hide();
                    $(container).find('.js-layer-settings-opacity').hide(0);
                    $(container).find('.js-layer-settings-tile-filters').hide(0);
                }

                $(container).find(`.js-toggle-filters`).hide();
                $(container).find(`.js-toggle-load-strategy`).hide();
                $(container).find(`.js-toggle-table-view`).hide();
                $(container).find('.js-layer-settings-filters').hide(0);
                $(container).find('.js-layer-settings-load-strategy').hide(0);
                $(container).find('.js-layer-settings-table').hide(0);
            }
            $(container).find(`.js-toggle-search`).hide();

            // For both vector and tile
            if (layerIsEnabled) {
                $(container).find(`.js-toggle-search`).show();
            } else {
                $(container).find(`.js-toggle-search`).hide();
                $(container).find('.js-layer-settings-search').hide(0);
                $(container).find('a').removeClass('active');
                // Refresh all tables when closing one panel, because DOM changes can make the tables un-aligned
                $(`.js-layer-settings-table table`).bootstrapTable('resetView');
            }
        } else if (ignoreErrors === false) {
            throw new Error(`Unable to find layer container`);
        }
    },

    onChangeLoadStrategyHandler: ({layerKey, filters}) => {},

    onApplyVectorFiltersHandler: ({layerKey, filters}) => {
        validateFilters(filters);

        let correspondingLayer = meta.getMetaByKey(layerKey);

        vectorFilters[layerKey] = filters;
        backboneEvents.get().trigger(`${MODULE_NAME}:filtersChange`);

        _self.createStore(correspondingLayer);
        _self.reloadLayer(`v:` + layerKey);
    },

    onApplyTileFiltersHandler: ({layerKey, filters}) => {
        tileFilters[layerKey] = filters;
        backboneEvents.get().trigger(`${MODULE_NAME}:filtersChange`);
        _self.reloadLayer(layerKey);
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
                layerTreeOrder.push({id: readableId, children});
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
            order: layerTreeOrder,
            vectorFilters,
            tileFilters,
            activeLayers,
            layersOfflineMode,
            opacitySettings
        };

        return state;
    },

    /**
     * Applies externally provided state
     */
    applyState: (newState) => {
        // Setting vector filters
        if (newState !== false && `vectorFilters` in newState && typeof newState.vectorFilters === `object`) {
            for (let key in newState.vectorFilters) {
                validateFilters(newState.vectorFilters[key]);
            }

            vectorFilters = newState.vectorFilters;
        } else {
            vectorFilters = {};
        }

        // Setting tile filters
        if (newState !== false && `tileFilters` in newState && typeof newState.tileFilters === `array`) {
            tileFilters = newState.tileFilters;
        } else {
            tileFilters = {};
        }

        queueStatistsics.setLastStatistics(false);
        if (newState === false) {
            newState = {
                order: false,
                opacitySettings: {},
                layersOfflineMode: {}
            };
        } else if (newState.order && newState.order === 'false') {
            newState.order = false;
        }

        return _self.create(newState);
    },

    /**
     * Returns the module-wide constant value
     *
     * @returns {String}
     */
    getSystemFieldPrefix: () => {
        return SYSTEM_FIELD_PREFIX;
    },

    /**
     * Reloading provided layer.
     *
     * @param {String} layerId Layer identifier
     */
    reloadLayer: (layerId, forceTileRedraw = false, doNotLegend = false) => {
        return new Promise((resolve, reject) => {
            switchLayer.init(layerId, false, doNotLegend, forceTileRedraw, false).then(() => {
                switchLayer.init(layerId, true, doNotLegend, forceTileRedraw).then(() => {
                    resolve();
                });
            });
        });
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

        activeLayerIds = activeLayerIds.filter((v, i, a) => {
            return a.indexOf(v) === i
        });
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

    getStores: function () {
        return stores;
    },

    load: function (id) {
        stores[id].load();
    },

    resetSearch: function () {
        sqlQuery.reset(qstore);
    },

};
