/**
 * @fileoverview Description of file, its uses and information
 * about its dependencies.
 */

'use strict';

const MODULE_NAME = `layerTree`;

var meta, layers, switchLayer, cloud, layers, legend, state, backboneEvents;

var automaticStartup = true;

var layerTreeOrder = false;

var onEachFeature = [];

var pointToLayer = [];

var onLoad = [];

var onSelect = [];

var onMouseOver = [];

var cm = [];

var styles = [];

var store = [];

var _self;

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
 * @type {*|exports|module.exports}
 */
let APIBridgeSingletone = require('./api-bridge');

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
 * Stores the last value of application online status
 */
let applicationIsOnline = -1;

let lastStatistics = false;

let theStatisticsPanelWasDrawn = false;

/**
 * Keeps track of changed layers
 */
let accumulatedDiff = [];

const tileLayerIcon = `<i class="material-icons">border_all</i>`;

const vectorLayerIcon = `<i class="material-icons">gesture</i>`;

let layerTreeWasBuilt = false;

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
        switchLayer = o.switchLayer;
        backboneEvents = o.backboneEvents;
        return this;
    },

    init: function () {
        _self = this;

        apiBridgeInstance = APIBridgeSingletone((statistics, forceLayerUpdate) => {
            _self.statisticsHandler(statistics, forceLayerUpdate);
        });

        state.listenTo('layerTree', _self);
    },

    postInit: () => {
        if (layerTreeWasBuilt === false && automaticStartup) {
            _self.create();
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
     * Detects what layers changed theirs statistics
     */
    getStatisticsDiff: (newStatistics, oldStatistics) => {
        let changedLayers = [];

        const compareStatisticsObjects = (newStatistics, oldStatistics) => {
            if (newStatistics) {
                for (let key in newStatistics) {
                    if (key !== `online`) {
                        if (oldStatistics) {
                            if (key in oldStatistics === false) {
                                changedLayers.push(key);
                            } else {
                                if (newStatistics[key] && oldStatistics[key]) {
                                    let actions = ['failed', 'rejectedByServer'];
                                    let actionTypes = ['ADD', 'UPDATE', 'DELETE'];
                                    actions.map(action => {
                                        actionTypes.map(actionType => {
                                            if (newStatistics[key][action][actionType] !== oldStatistics[key][action][actionType]) {
                                                changedLayers.push(key);
                                            }
                                        });
                                    });
                                } else {
                                    changedLayers.push(key);
                                }
                            }
                        } else {
                            changedLayers.push(key);
                        }
                    }
                }
            }
        };

        compareStatisticsObjects(newStatistics, oldStatistics);
        compareStatisticsObjects(oldStatistics, newStatistics);

        let uniqueLayers = changedLayers.filter((v, i, a) => a.indexOf(v) === i);
        let result = [];
        uniqueLayers.map(item => {
            let splitItem = item.split('.');
            if (splitItem.length === 3) {
                result.push(`${splitItem[0]}.${splitItem[1]}`);
            } else {
                throw new Error(`Invalid layer name is provided ${item}`);
            }
        });

        return result;
    },

    /**
     * Displays current state of APIBridge feature management
     * 
     * @param {*} statistics 
     * @param {*} forceLayerUpdate 
     */
    statisticsHandler: (statistics, forceLayerUpdate = false, skipLastStatisticsCheck = false) => {
        if (layerTreeWasBuilt === false) {
            return;
        }

        let currentStatisticsHash = btoa(JSON.stringify(statistics));
        let lastStatisticsHash = btoa(JSON.stringify(lastStatistics));

        if (skipLastStatisticsCheck || (currentStatisticsHash !== lastStatisticsHash || theStatisticsPanelWasDrawn === false)) {
            let diff = _self.getStatisticsDiff(statistics, lastStatistics);
            diff.map(item => {
                if (accumulatedDiff.indexOf(item) === -1) {
                    accumulatedDiff.push(item);
                }
            });

            lastStatistics = statistics;

            let actions = ['add', 'update', 'delete'];
            $(`[data-gc2-layer-key]`).each((index, container) => {
                actions.map(action => {
                    $(container).find('.js-failed-' + action).addClass('hidden');
                    $(container).find('.js-failed-' + action).find('.js-value').html('');
                    $(container).find('.js-rejectedByServer-' + action).addClass('hidden');
                    $(container).find('.js-rejectedByServer-' + action).find('.js-value').html('');

                    $(container).find('.js-rejectedByServerItems').empty();
                    $(container).find('.js-rejectedByServerItems').addClass('hidden');
                });
            });

            $('.js-clear').addClass('hidden');
            $('.js-clear').off();

            $('.js-app-is-online-badge').addClass('hidden');
            $('.js-app-is-offline-badge').addClass('hidden');

            if ($('.js-app-is-online-badge').length === 1) {
                theStatisticsPanelWasDrawn = true;
            }
            
            if (statistics.online) {
                $('.js-toggle-offline-mode').prop('disabled', false);

                applicationIsOnline = 1;
                $('.js-app-is-online-badge').removeClass('hidden');
            } else {
                if (applicationIsOnline !== 0) {
                    $('.js-toggle-offline-mode').trigger('click');
                }

                $('.js-toggle-offline-mode').prop('disabled', true);

                applicationIsOnline = 0;
                $('.js-app-is-offline-badge').removeClass('hidden');
            }

            if (applicationIsOnline !== -1) {
                $('.js-app-is-pending-badge').remove();
            }

            for (let key in statistics) {
                let layerControlContainer = $(`[data-gc2-layer-key="${key}"]`);
                if (layerControlContainer.length === 1) {
                    let totalRequests = 0;
                    let rejectedByServerRequests = 0;
                    actions.map(action => {
                        if (statistics[key]['failed'][action.toUpperCase()] > 0) {
                            totalRequests++;
                            $(layerControlContainer).find('.js-failed-' + action).removeClass('hidden');
                            $(layerControlContainer).find('.js-failed-' + action).find('.js-value').html(statistics[key]['failed'][action.toUpperCase()]);
                        }

                        if (statistics[key]['rejectedByServer'][action.toUpperCase()] > 0) {
                            rejectedByServerRequests++;
                            totalRequests++;
                            $(layerControlContainer).find('.js-rejectedByServer-' + action).removeClass('hidden');
                            $(layerControlContainer).find('.js-rejectedByServer-' + action).find('.js-value').html(statistics[key]['rejectedByServer'][action.toUpperCase()]);
                        }
                    });

                    if (rejectedByServerRequests > 0) {
                        $(layerControlContainer).find('.js-rejectedByServerItems').removeClass('hidden');
                        statistics[key]['rejectedByServer'].items.map(item => {
                            let copiedItem = Object.assign({}, item.feature.features[0]);
                            let copiedItemProperties = Object.assign({}, item.feature.features[0].properties);
                            delete copiedItemProperties.gid;

                            let errorMessage = item.serverErrorMessage;
                            if (item.serverErrorType && item.serverErrorType === `AUHTORIZATION_ERROR`) {
                                errorMessage = `Not authorized to perform this action`;
                            }

                            let errorRecord = $(`<div>
                                <span class="label label-danger"><i style="color: black;" class="fa fa-exclamation"></i></span>
                                <button data-feature-geometry='${JSON.stringify(copiedItem.geometry)}' class="btn btn-secondary js-center-map-on-item" type="button" style="padding: 4px; margin-top: 0px; margin-bottom: 0px;">
                                    <i style="color: black;" class="fa fa-map-marker"></i>
                                </button>
                                <div style="overflow-x: scroll; font-size: 12px; color: gray; font-family: 'Courier New'">${JSON.stringify(copiedItemProperties)}</div>
                                <div style="overflow-x: scroll; font-size: 12px; color: darkgray;">${errorMessage}</div>
                            </div>`);

                            $(errorRecord).find('.js-center-map-on-item').click((event) => {
                                let geometry = $(event.currentTarget).data(`feature-geometry`);
                                if (geometry) {
                                    // Centering on non-point feature
                                    if (geometry.coordinates.length > 1) {
                                        let geojsonLayer = L.geoJson(geometry);
                                        let bounds = geojsonLayer.getBounds();
                                        cloud.get().map.panTo(bounds.getCenter());
                                    } else {
                                        cloud.get().map.panTo(new L.LatLng(geometry.coordinates[1], geometry.coordinates[0]));
                                    }
                                }
                            });

                            $(layerControlContainer).find('.js-rejectedByServerItems').append(errorRecord);
                        });
                    }

                    if (totalRequests > 0) {
                        $(layerControlContainer).find('.js-clear').removeClass('hidden');

                        $(layerControlContainer).find('.js-clear').on('click', (event) => {
                            let gc2Id = $(event.target).data('gc2-id');
                            if (!gc2Id) {
                                gc2Id = $(event.target).parent().data('gc2-id');
                            }

                            if (confirm(`${__('Cancel feature changes')}?`)) {
                                apiBridgeInstance.removeByLayerId(gc2Id);
                            }
                        });

                        $(layerControlContainer).find('.js-clear').hover(event => {
                            $(event.currentTarget).parent().find('.js-statistics-field').css('opacity', '0.2');
                        }, event => {
                            $(event.currentTarget).parent().find('.js-statistics-field').css('opacity', '1');
                        });
                    }
                }
            }
        }

        if (forceLayerUpdate) {
            accumulatedDiff.map(item => {
                let layerName = item;
                _self.getActiveLayers().map(activeLayerName => {
                    if (activeLayerName === ('v:' + layerName) || ('v:' + activeLayerName) === layerName) {
                        layerName = activeLayerName;
                    }
                });

                switchLayer.init(layerName, false, true, true);
                switchLayer.init(layerName, true, true, true);
            });

            accumulatedDiff = [];
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

    /**
     * Builds actual layer tree.
     */
    create: (forcedState = false) => {
        layerTreeWasBuilt = true;

        /*
            Some layers are already shown, so they need to be checked in order
            to stay in tune with the map. Those are different from the activeLayers,
            which are defined externally via forcedState only.
        */
        let precheckedLayers = layers.getMapLayers();

        let result = new Promise((resolve, reject) => {
            layerTreeIsReady = false;
            if (forcedState) {
                _self.getActiveLayers().map(item => {
                    // Disabling active layers
                    switchLayer.init(item, false, true, false);
                });
            }

            $("#layers").empty();
            _self.getLayersOrder().then(order => {

                // @todo Remove try/catch
                try {

                let activeLayers = [];
                if (forcedState) {
                    order = forcedState.order;
                    activeLayers = forcedState.activeLayers;
                }

                layerTreeOrder = order;

                var base64GroupName, groups, metaData, i, l, count, displayInfo, tooltip;

                let toggleOfllineOnlineMode = false;
                if (`serviceWorker` in navigator) {
                    toggleOfllineOnlineMode = $(`<div class="panel panel-default">
                        <div class="panel-body">
                            <div class="togglebutton">
                                <label>
                                    <input class="js-toggle-offline-mode" type="checkbox"> ${__('Force offline mode')}
                                    <span class="badge js-app-is-pending-badge" style="background-color: #C0C0C0;"><i class="fa fa-ellipsis-h"></i> ${__('Pending')}</span>
                                    <span class="badge js-app-is-online-badge hidden" style="background-color: #28a745;"><i class="fa fa-signal"></i> Online</span>
                                    <span class="badge js-app-is-offline-badge hidden" style="background-color: #dc3545;"><i class="fa fa-times"></i> Offline</span>
                                </label>
                            </div>
                        </div>
                    </div>`);

                    if (apiBridgeInstance.offlineModeIsEnforced()) {
                        $(toggleOfllineOnlineMode).find('.js-toggle-offline-mode').prop('checked', true);
                    }

                    $(toggleOfllineOnlineMode).find('.js-toggle-offline-mode').change((event) => {
                        if ($(event.target).is(':checked')) {
                            apiBridgeInstance.setOfflineMode(true);
                        } else {
                            apiBridgeInstance.setOfflineMode(false);
                        }
                    });
                } else {
                    toggleOfllineOnlineMode = $(`<div class="alert alert-dismissible alert-warning" role="alert">
                        <button type="button" class="close" data-dismiss="alert">×</button>
                        ${__('This browser does not support Service Workers, some features may be unavailable')}
                    </div>`);
                }

                $("#layers").append(toggleOfllineOnlineMode);

                groups = [];

                // Getting set of all loaded vectors
                metaData = meta.getMetaData();
                for (i = 0; i < metaData.data.length; ++i) {
                    groups[i] = metaData.data[i].layergroup;
                }

                let notSortedGroupsArray = array_unique(groups.reverse());
                let arr = [];
                metaData.data.reverse();

                if (order) {
                    for (let key in order) {
                        let item = order[key];
                        let sortedElement = false;
                        for (let i = (notSortedGroupsArray.length - 1); i >= 0; i--) {
                            if (item.id === notSortedGroupsArray[i]) {
                                sortedElement = notSortedGroupsArray.splice(i, 1);
                                break;
                            }
                        }

                        if (sortedElement) {
                            arr.push(item.id);
                        }
                    }

                    if (notSortedGroupsArray.length > 0) {
                        for (let j = 0; j < notSortedGroupsArray.length; j++) {
                            arr.push(notSortedGroupsArray[j]);
                        }
                    }
                } else {
                    arr = notSortedGroupsArray;
                }

                $("#layers").append(`<div id="layers_list"></div>`);

                // Filling up groups and underlying layers (except ungrouped ones)
                for (i = 0; i < arr.length; ++i) {
                    if (arr[i] && arr[i] !== "<font color='red'>[Ungrouped]</font>") {
                        l = [];
                        base64GroupName = Base64.encode(arr[i]).replace(/=/g, "");

                        // Add group container
                        // Only if container doesn't exist
                        // ===============================
                        if ($("#layer-panel-" + base64GroupName).length === 0) {
                            $("#layers_list").append(`<div class="panel panel-default panel-layertree" id="layer-panel-${base64GroupName}">
                                <div class="panel-heading" role="tab">
                                    <h4 class="panel-title">
                                        <div class="layer-count badge">
                                            <span>0</span> / <span></span>
                                        </div>
                                        <a style="display: block" class="accordion-toggle" data-toggle="collapse" data-parent="#layers" href="#collapse${base64GroupName}">${arr[i]}</a>
                                    </h4>
                                </div>
                                <ul class="list-group" id="group-${base64GroupName}" role="tabpanel"></ul>
                            </div>`);

                            // Append to inner group container
                            // ===============================
                            $("#group-" + base64GroupName).append(`<div id="collapse${base64GroupName}" class="accordion-body collapse"></div>`);
                        }

                        // Get layers that belong to the current layer group
                        let notSortedLayersForCurrentGroup = [];
                        for (let u = 0; u < metaData.data.length; ++u) {
                            if (metaData.data[u].layergroup == arr[i]) {
                                notSortedLayersForCurrentGroup.push(metaData.data[u]);
                            }
                        }

                        // Sort layers if there is available order
                        let layersForCurrentGroup = false;
                        let sortedLayers = [];
                        if (order) {
                            let currentGroupLayersOrder = false;
                            for (let key in order) {
                                if (order[key].id === arr[i] && 'layers' in order[key]) {
                                    currentGroupLayersOrder = order[key].layers;
                                }
                            }

                            if (currentGroupLayersOrder) {
                                for (let key in currentGroupLayersOrder) {
                                    let item = currentGroupLayersOrder[key];
                                    let sortedElement = false;
                                    for (let i = (notSortedLayersForCurrentGroup.length - 1); i >= 0; i--) {
                                        let layerId = notSortedLayersForCurrentGroup[i].f_table_schema + '.' + notSortedLayersForCurrentGroup[i].f_table_name;
                                        if (item.id === layerId) {
                                            sortedElement = notSortedLayersForCurrentGroup.splice(i, 1);
                                            break;
                                        }
                                    }

                                    if (sortedElement) {
                                        sortedLayers.push(sortedElement.pop());
                                    }
                                }

                                if (notSortedLayersForCurrentGroup.length > 0) {
                                    for (let j = 0; j < notSortedLayersForCurrentGroup.length; j++) {
                                        sortedLayers.push(notSortedLayersForCurrentGroup[j]);
                                    }
                                }
                            }
                        }

                        if (sortedLayers.length > 0) {
                            layersForCurrentGroup = sortedLayers;
                        } else {
                            layersForCurrentGroup = notSortedLayersForCurrentGroup;
                        }

                        // Add layers
                        // ==========
                        for (var u = 0; u < layersForCurrentGroup.length; ++u) {
                            let layer = layersForCurrentGroup[u];
                            var text = (layer.f_table_title === null || layer.f_table_title === "") ? layer.f_table_name : layer.f_table_title;
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
                                    if (parsedMeta && parsedMeta.vidi_layer_editable) {
                                        layerIsEditable = true;
                                    }

                                    if (parsedMeta) {
                                        displayInfo = (parsedMeta.meta_desc || layer.f_table_abstract) ? "visible" : "hidden";
                                    }

                                    if (parsedMeta.vidi_layer_type && ['v', 'tv', 'vt'].indexOf(parsedMeta.vidi_layer_type) !== -1) {
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

                                let layerKey = layer.f_table_schema + "." + layer.f_table_name;
                                let layerKeyWithGeom = layerKey + "." + layer.f_geometry_column;

                                if (layerIsTheVectorOne) {
                                    store['v:' + layerKey] = new geocloud.sqlStore({
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
                                        sql: "SELECT * FROM " + layer.f_table_schema + "." + layer.f_table_name + " LIMIT 500",
                                        onLoad: (l) => {
                                            if (l === undefined) return;
                                            $('*[data-gc2-id-vec="' + l.id + '"]').parent().siblings().children().removeClass("fa-spin");

                                            layers.decrementCountLoading(l.id);
                                            backboneEvents.get().trigger("doneLoading:layers", l.id);
                                        },
                                        transformResponse: (response, id) => {
                                            return apiBridgeInstance.transformResponseHandler(response, id);
                                        },
                                        onEachFeature: onEachFeature['v:' + layerKey]
                                    });
                                }

                                tooltip = layer.f_table_abstract || "";

                                let lockedLayer = (layer.authentication === "Read/write" ? " <i class=\"fa fa-lock gc2-session-lock\" aria-hidden=\"true\"></i>" : "");

                                let regularButtonStyle = `padding: 2px 10px 2px 10px; color: black; border-radius: 4px; height: 22px; margin: 0px;`;
                                let queueFailedButtonStyle = regularButtonStyle + ` background-color: orange; padding-left: 4px; padding-right: 4px;`;
                                let queueRejectedByServerButtonStyle = regularButtonStyle + ` background-color: red; padding-left: 4px; padding-right: 4px;`;

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
                                    layerTypeSelector = `<div class="dropdown">
                                        <button style="padding: 2px; margin: 0px;" class="btn btn-default dropdown-toggle" type="button"
                                            data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                            <span class="js-dropdown-label">${selectorLabel}</span>
                                            <span class="caret"></span>
                                        </button>
                                        <ul class="dropdown-menu">
                                            <li>
                                                <a class="js-layer-type-selector-tile" href="javascript:void(0)">${tileLayerIcon} ${__('Tile')}</a>
                                            </li>
                                            <li>
                                                <a class="js-layer-type-selector-vector" href="javascript:void(0)">${vectorLayerIcon} ${__('Vector')}</a>
                                            </li>
                                        </ul>
                                    </div>`;
                                }

                                let addButton = ``;
                                if (layerIsEditable) {
                                    addButton = `<button type="button" data-gc2-key="${layerKeyWithGeom}" style="${regularButtonStyle}" 
                                        data-toggle="tooltip" data-placement="left" title="Add new feature to layer" data-layer-type="tile" class="btn gc2-add-feature gc2-edit-tools">
                                        <i class="fa fa-plus"></i>
                                    </button>`;
                                }

                                let checked = ``;
                                // If activeLayers are set, then no need to sync with the map
                                if (!forcedState) {
                                    if (precheckedLayers && Array.isArray(precheckedLayers)) {
                                        precheckedLayers.map(item => {
                                            if (item.id && item.id === `${layer.f_table_schema}.${layer.f_table_name}`) {
                                                checked = `checked="checked"`;
                                            }
                                        });
                                    }
                                }

                                let layerControlRecord = $(`<li class="layer-item list-group-item" data-gc2-layer-key="${layerKeyWithGeom}" style="min-height: 40px; margin-top: 10px;">
                                    <div style="display: inline-block;">
                                        <div class="checkbox" style="width: 34px;">
                                            <label>
                                                <input type="checkbox"
                                                    ${checked}
                                                    class="js-show-layer-control"
                                                    id="${layer.f_table_name}"
                                                    data-gc2-id="${layer.f_table_schema}.${layer.f_table_name}"
                                                    data-gc2-layer-type="${defaultLayerType}">
                                            </label>
                                        </div>
                                    </div>
                                    <div style="display: inline-block;">${layerTypeSelector}</div>
                                    <div style="display: inline-block;">
                                        <span>${text}${lockedLayer}</span>
                                        <button type="button" class="hidden btn btn-sm btn-secondary js-statistics-field js-failed-add" style="${queueFailedButtonStyle}" disabled>
                                            <i class="fa fa-plus"></i> <span class="js-value"></span>
                                        </button>
                                        <button type="button" class="hidden btn btn-sm btn-secondary js-statistics-field js-failed-update" style="${queueFailedButtonStyle}" disabled>
                                            <i class="fa fa-edit"></i> <span class="js-value"></span>
                                        </button>
                                        <button type="button" class="hidden btn btn-sm btn-secondary js-statistics-field js-failed-delete" style="${queueFailedButtonStyle}" disabled>
                                            <i class="fa fa-minus-circle"></i> <span class="js-value"></span>
                                        </button>
                                        <button type="button" class="hidden btn btn-sm btn-secondary js-statistics-field js-rejectedByServer-add" style="${queueRejectedByServerButtonStyle}" disabled>
                                            <i class="fa fa-plus"></i> <span class="js-value"></span>
                                        </button>
                                        <button type="button" class="hidden btn btn-sm btn-secondary js-statistics-field js-rejectedByServer-update" style="${queueRejectedByServerButtonStyle}" disabled>
                                            <i class="fa fa-edit"></i> <span class="js-value"></span>
                                        </button>
                                        <button type="button" class="hidden btn btn-sm btn-secondary js-statistics-field js-rejectedByServer-delete" style="${queueRejectedByServerButtonStyle}" disabled>
                                            <i class="fa fa-minus-circle"></i> <span class="js-value"></span>
                                        </button>
                                        <button type="button" data-gc2-id="${layerKey}" class="hidden btn btn-sm btn-secondary js-clear" style="${regularButtonStyle}">
                                            <i class="fa fa-undo"></i>
                                        </button>
                                    </div>
                                    <div style="display: inline-block;">
                                        ${addButton}
                                        <span data-toggle="tooltip" data-placement="left" title="${tooltip}"
                                            style="visibility: ${displayInfo}" class="info-label label label-primary" data-gc2-id="${layerKey}">Info</span>
                                    </div>
                                    <div class="js-rejectedByServerItems" hidden" style="width: 100%; padding-left: 15px; padding-right: 10px; padding-bottom: 10px;"></div>
                                </li>`);

                                $(layerControlRecord).find('.js-layer-type-selector-tile').first().on('click', (e, data) => {
                                    let switcher = $(e.target).closest('.layer-item').find('.js-show-layer-control');
                                    $(switcher).data('gc2-layer-type', 'tile');
                                    $(switcher).prop('checked', true);
                                    _self.reloadLayer($(switcher).data('gc2-id'), false, (data ? data.doNotLegend : false));
                                    $(e.target).closest('.layer-item').find('.js-dropdown-label').html(tileLayerIcon);
                                    backboneEvents.get().trigger(`layerTree:activeLayersChange`);
                                });

                                $(layerControlRecord).find('.js-layer-type-selector-vector').first().on('click', (e, data) => {
                                    let switcher = $(e.target).closest('.layer-item').find('.js-show-layer-control');
                                    $(switcher).data('gc2-layer-type', 'vector');
                                    $(switcher).prop('checked', true);
                                    _self.reloadLayer('v:' + $(switcher).data('gc2-id'), false, (data ? data.doNotLegend : false));
                                    $(e.target).closest('.layer-item').find('.js-dropdown-label').html(vectorLayerIcon);
                                    backboneEvents.get().trigger(`layerTree:activeLayersChange`);
                                });

                                $(layerControlRecord).find('input[data-gc2-id]').first().on(`change`, (e, data) => {
                                    if (data) {
                                        if ($(e.target).prop(`checked`)) {
                                            $(e.target).prop(`checked`, false);
                                        } else {
                                            $(e.target).prop(`checked`, true);
                                        }
                                    }

                                    let prefix = '';
                                    if ($(e.target).data('gc2-layer-type') === 'vector') {
                                        prefix = 'v:';
                                    }
                
                                    switchLayer.init(prefix + $(e.target).data('gc2-id'), $(e.target).prop(`checked`), (data ? data.doNotLegend : false));
                                    backboneEvents.get().trigger(`layerTree:activeLayersChange`);

                                    e.stopPropagation();
                                });

                                $("#collapse" + base64GroupName).append(layerControlRecord);
                                l.push({});
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
                        
                        if (!isNaN(parseInt($($("#layer-panel-" + base64GroupName + " .layer-count span")[1]).html()))) {
                            count = parseInt($($("#layer-panel-" + base64GroupName + " .layer-count span")[1]).html()) + l.length;
                        } else {
                            count = l.length;
                        }

                        $("#layer-panel-" + base64GroupName + " span:eq(1)").html(count);
                        // Remove the group if empty
                        if (l.length === 0) {
                            $("#layer-panel-" + base64GroupName).remove();
                        }
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

                if (lastStatistics) {
                    _self.statisticsHandler(lastStatistics, false, true);
                }

                layers.reorderLayers();
                state.listen(MODULE_NAME, `sorted`);
                state.listen(MODULE_NAME, `activeLayersChange`);
                
                backboneEvents.get().trigger(`${MODULE_NAME}:sorted`);
                setTimeout(() => {
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
                                $(`input[data-gc2-id="${layerName.replace('v:', '')}"]`).trigger('change', [{doNotLegend: true}]);
                            }
                        });

                        legend.init();
                    }

                    layerTreeIsReady = true;
                    backboneEvents.get().trigger(`${MODULE_NAME}:ready`);

                    resolve();
                }, 1000);

            } catch(e) { console.log(e); };

            });
        });

        return result;
    },

    calculateOrder: () => {
        layerTreeOrder = [];

        $(`[id^="layer-panel-"]`).each((index, element) => {
            let id = $(element).attr(`id`).replace(`layer-panel-`, ``);
            let layers = [];
            $(`#${$(element).attr(`id`)}`).find(`#collapse${id}`).children().each((layerIndex, layerElement) => {
                let layerKey = $(layerElement).data(`gc2-layer-key`);
                let splitLayerKey = layerKey.split('.');
                if (splitLayerKey.length !== 3) {
                    throw new Error(`Invalid layer key (${layerKey})`);
                }

                layers.push({ id: `${splitLayerKey[0]}.${splitLayerKey[1]}` });
            });

            let readableId = atob(id);
            if (readableId) {
                layerTreeOrder.push({ id: readableId, layers });
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
            activeLayers
        };

        return state;
    },

    /**
     * Applies externally provided state
     */
    applyState: (newState) => {
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

    setOnEachFeature: function (layer, fn) {
        onEachFeature[layer] = fn;
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

    setStyle: function (layer, s) {
        styles[layer] = s;
    },

    setPointToLayer: function (layer, fn) {
        pointToLayer[layer] = fn;
    },

    setAutomatic: (value) => {
        automaticStartup = value;
    },
    
    getStores: function () {
        return store;
    },

    load: function (id) {
        store[id].load();
    }
};