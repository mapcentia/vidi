/**
 * @fileoverview Description of file, its uses and information
 * about its dependencies.
 */

'use strict';

var meta;

var switchLayer;

var layers;

var backboneEvents;

var onEachFeature = [];

var pointToLayer = [];

var onLoad = [];

var onSelect = [];

var onMouseOver = [];

var cm = [];

var styles = [];

var store = [];

var automatic = true;

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
 * Stores the last value of application online status
 */
var applicationIsOnline = -1;

/**
 *
 * @type {{Info: {da_DK: string, en_US: string}, Street View: {da_DK: string, en_US: string}, Choose service: {da_DK: string, en_US: string}, Activate: {da_DK: string, en_US: string}}}
 */
var dict = {
    "Force offline mode": {
        "da_DK": "# Force offline mode",
        "en_US": "# Force offline mode"
    },
    "Tile": {
        "da_DK": "# Tile",
        "en_US": "# Tile"
    },
    "Vector": {
        "da_DK": "# Vector",
        "en_US": "# Vector"
    },
    "Pending": {
        "da_DK": "# Pending",
        "en_US": "# Pending"
    }
};

/**
 *
 * @type {{set: module.exports.set, init: module.exports.init}}
 */
module.exports = {
    set: function (o) {
        meta = o.meta;
        layers = o.layers;
        switchLayer = o.switchLayer;
        backboneEvents = o.backboneEvents;
        return this;
    },
    init: function () {
        var _self = this;

        const clearLayerRequests = (layerId) => {
            apiBridgeInstance.removeByLayerId(layerId);
        };

        apiBridgeInstance = APIBridgeSingletone((statistics, forceLayerUpdate = false) => {
            let actions = ['add', 'update', 'delete'];
            $(`[data-gc2-layer-key]`).each((index, container) => {
                actions.map(action => {
                    $(container).find('.js-' + action).addClass('hidden');
                    $(container).find('.js-' + action).find('.js-value').html('');
                });
            });

            $('.js-clear').addClass('hidden');
            $('.js-clear').off();

            $('.js-app-is-online-badge').addClass('hidden');
            $('.js-app-is-offline-badge').addClass('hidden');

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
                    actions.map(action => {
                        if (statistics[key][action.toUpperCase()] > 0) {
                            totalRequests++;
                            $(layerControlContainer).find('.js-' + action).removeClass('hidden');
                            $(layerControlContainer).find('.js-' + action).find('.js-value').html(statistics[key][action.toUpperCase()]);
                        }
                    });

                    if (totalRequests > 0) {
                        $(layerControlContainer).find('.js-clear').removeClass('hidden');
                        $(layerControlContainer).find('.js-clear').on('click', (event) => {
                            clearLayerRequests($(event.target).parent().data('layer-id'));
                        });
                    }
                }
            }

            if (forceLayerUpdate) {
                _self.getActiveLayers().map(item => {
                    switchLayer.init(item, false);
                    switchLayer.init(item, true);
                });
            }
        });

        var base64GroupName, arr, groups, metaData, i, l, count, displayInfo, tooltip;

        groups = [];

        // Getting set of all loaded vectors
        metaData = meta.getMetaDataLatestLoaded();
        for (i = 0; i < metaData.data.length; ++i) {
            groups[i] = metaData.data[i].layergroup;
        }

        arr = array_unique(groups.reverse());
        metaData.data.reverse();

        $("#layers").empty();

        let toggleOfllineOnlineMode = $(`<div class="panel panel-default">
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


        // @todo Remove
        try {



        $(toggleOfllineOnlineMode).find('.js-toggle-offline-mode').change((event) => {
            if ($(event.target).is(":checked")) {
                apiBridgeInstance.setOfflineMode(true);
            } else {
                apiBridgeInstance.setOfflineMode(false);
            }
        });

        $("#layers").append(toggleOfllineOnlineMode);
        // Filling up groups and underlying layers (except ungrouped ones)
        for (i = 0; i < arr.length; ++i) {
            if (arr[i] && arr[i] !== "<font color='red'>[Ungrouped]</font>") {
                l = [];
                base64GroupName = Base64.encode(arr[i]).replace(/=/g, "");

                // Add group container
                // Only if container doesn't exist
                // ===============================
                if ($("#layer-panel-" + base64GroupName).length === 0) {
                    $("#layers").append(`<div class="panel panel-default panel-layertree" id="layer-panel-${base64GroupName}">
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

                // Add layers
                // ==========
                for (var u = 0; u < metaData.data.length; ++u) {
                    let localMeta = metaData.data[u];
                    if (localMeta.layergroup == arr[i]) {
                        var text = (localMeta.f_table_title === null || localMeta.f_table_title === "") ? localMeta.f_table_name : localMeta.f_table_title;
                        if (localMeta.baselayer) {
                            $("#base-layer-list").append(`<div class='list-group-item'>
                                <div class='row-action-primary radio radio-primary base-layer-item' data-gc2-base-id='${localMeta.f_table_schema}.${localMeta.f_table_name}'>
                                    <label class='baselayer-label'>
                                        <input type='radio' name='baselayers'>${text}<span class='fa fa-check' aria-hidden='true'></span>
                                    </label>
                                </div>
                            </div>`);
                        } else {
                            let isDisabledAttribute = '';
                            let selectorLabel = __('Tile');
                            let defaultLayerType = 'tile';
                            if (localMeta && localMeta.meta) {
                                let parsedMeta = JSON.parse(localMeta.meta);
                                if (parsedMeta.vidi_layer_type) {
                                    if (parsedMeta.vidi_layer_type === 't') {
                                        selectorLabel = __('Tile');
                                        isDisabledAttribute = 'disabled';
                                    }

                                    if (parsedMeta.vidi_layer_type === 'v') {
                                        defaultLayerType = 'vector';
                                        selectorLabel = __('Vector');
                                        isDisabledAttribute = 'disabled';
                                    }
                                }
                            }

                            // If meta.usetiles is true, when add layers as tiles instead of vectors
                            let layerKey, layerKeyWithGeom;
                            if (JSON.parse(localMeta.meta) !== null && typeof JSON.parse(localMeta.meta).usetiles !== "undefined" &&
                                JSON.parse(localMeta.meta).usetiles === true) {
                                layerKey = localMeta.f_table_schema + "." + localMeta.f_table_name;
                                layerKeyWithGeom = localMeta.f_table_schema + "." + localMeta.f_table_name + "." + localMeta.f_geometry_column;
                            } else if (!localMeta.baselayer) {
                                layerKey = "v:" + localMeta.f_table_schema + "." + localMeta.f_table_name;
                                layerKeyWithGeom = localMeta.f_table_schema + "." + localMeta.f_table_name + "." + localMeta.f_geometry_column;

                                store[layerKey] = new geocloud.sqlStore({
                                    jsonp: false,
                                    method: "POST",
                                    host: "",
                                    db: db,
                                    uri: "/api/sql",
                                    clickable: true,
                                    id: layerKey,
                                    name: layerKey,
                                    lifetime: 0,
                                    styleMap: styles[layerKey],
                                    sql: "SELECT * FROM " + metaData.data[u].f_table_schema + "." + metaData.data[u].f_table_name + " LIMIT 500",
                                    onLoad: function (l) {
                                        if (l === undefined) {
                                            return
                                        }

                                        var me = l;

                                        try {
                                            $('*[data-gc2-id-vec="' + me.id + '"]').parent().siblings().children().removeClass("fa-spin")
                                        } catch (e) {
                                        }

                                        layers.decrementCountLoading(me.id);
                                        backboneEvents.get().trigger("doneLoading:layers", me.id);
                                    },
                                    transformResponse: (response, id) => {
                                        return apiBridgeInstance.transformResponseHandler(response, id);
                                    },
                                    onEachFeature: onEachFeature[layerKey]
                                });
                            }

                            displayInfo = ((localMeta.meta !== null && $.parseJSON(localMeta.meta) !== null && typeof $.parseJSON(localMeta.meta).meta_desc !== "undefined" && $.parseJSON(localMeta.meta).meta_desc !== "") || localMeta.f_table_abstract) ? "visible" : "hidden";
                            tooltip = localMeta.f_table_abstract || "";

                            let lockedLayer = (localMeta.authentication === "Read/write" ? " <i class=\"fa fa-lock gc2-session-lock\" aria-hidden=\"true\"></i>" : "");

                            let regularButtonStyle = `padding: 2px; color: black; border-radius: 4px; height: 22px; margin: 0px;`;
                            let queueInfoButtonStyle = regularButtonStyle + ` background-color: #FF6666; padding-left: 4px; padding-right: 4px;`;
                            let layerControlRecord = $(`<li class="layer-item list-group-item" data-gc2-layer-key="${layerKeyWithGeom}">
                                <div style="display: inline-block;">
                                    <div class="checkbox" style="width: 34px;">
                                        <label>
                                            <input type="checkbox"
                                                class="js-show-layer-control"
                                                id="${localMeta.f_table_name}"
                                                data-gc2-id="${localMeta.f_table_schema}.${localMeta.f_table_name}"
                                                data-gc2-layer-type="${defaultLayerType}">
                                        </label>
                                    </div>
                                </div>
                                <div style="display: inline-block;">
                                    <div class="dropdown">
                                        <button style="padding: 8px;" class="btn btn-default dropdown-toggle" type="button"
                                            data-toggle="dropdown" aria-haspopup="true" aria-expanded="true" ${isDisabledAttribute}>
                                            <span class="js-dropdown-label">${selectorLabel}</span>
                                            <span class="caret"></span>
                                        </button>
                                        <ul class="dropdown-menu">
                                            <li>
                                                <a class="js-layer-type-selector-tile" href="javascript:void(0)">${__('Tile')}</a>
                                            </li>
                                            <li>
                                                <a class="js-layer-type-selector-vector" href="javascript:void(0)">${__('Vector')}</a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div style="display: inline-block;">
                                    <span>${text}${lockedLayer}</span>
                                    <button type="button" class="hidden btn btn-sm btn-secondary js-add" style="${queueInfoButtonStyle}" disabled>
                                        <i class="fa fa-plus"></i> <span class="js-value"></span>
                                    </button>
                                    <button type="button" class="hidden btn btn-sm btn-secondary js-update" style="${queueInfoButtonStyle}" disabled>
                                        <i class="fa fa-edit"></i> <span class="js-value"></span>
                                    </button>
                                    <button type="button" class="hidden btn btn-sm btn-secondary js-delete" style="${queueInfoButtonStyle}" disabled>
                                        <i class="fa fa-minus-circle"></i> <span class="js-value"></span>
                                    </button>
                                    <button type="button" data-layer-id="${layerKey}" class="hidden btn btn-sm btn-secondary js-clear" style="${regularButtonStyle}">
                                        <i class="fa fa-trash"></i>
                                    </button>
                                </div>
                                <div style="display: inline-block;">
                                    <button style="padding: 8px;" type="button" data-gc2-key="${localMeta.f_table_schema}.${localMeta.f_table_name}.${localMeta.f_geometry_column}"
                                        data-toggle="tooltip" data-placement="left" title="Add new feature to layer" data-layer-type="tile" class="btn gc2-add-feature gc2-edit-tools">
                                        <i class="fa fa-plus"></i>
                                    </button>
                                    <span data-toggle="tooltip" data-placement="left" title="${tooltip}"
                                        style="visibility: ${displayInfo}" class="info-label label label-primary" data-gc2-id="${localMeta.f_table_schema}.${localMeta.f_table_name}">Info</span>
                                </div>
                            </li>`);

                            $(layerControlRecord).find('.js-layer-type-selector-tile').first().on('click', (e) => {
                                let switcher = $(e.target).closest('.layer-item').find('.js-show-layer-control');
                                $(switcher).data('gc2-layer-type', 'tile');
                                $(e.target).closest('.layer-item').find('.js-dropdown-label').text('tile');
                                _self.reloadLayer($(switcher).data('gc2-id'), 'tile');
                            });

                            $(layerControlRecord).find('.js-layer-type-selector-vector').first().on('click', (e) => {
                                let switcher = $(e.target).closest('.layer-item').find('.js-show-layer-control');
                                $(switcher).data('gc2-layer-type', 'vector');
                                $(e.target).closest('.layer-item').find('.js-dropdown-label').text('vector');
                                _self.reloadLayer($(switcher).data('gc2-id'), 'vector');
                            });

                            $("#collapse" + base64GroupName).append(layerControlRecord);

                            l.push({});
                        }
                    }
                }

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

        // Open the first panel
        // ====================

        $("#layers div:first").find("a").trigger("click");


        } catch (e) {
            console.log(e);
        }


    },


    /**
     * Reloading provided layer.
     * 
     * @param {String} layerId Layer identifier
     */
    reloadLayer: (layerId, layerType = 'tile') => {
        console.log('reloadLayer', layerId);
        if (layerId.startsWith('v:')) {
            layerId = layerId.replace('v:', '');
            layerType = 'vector';
        }

        switchLayer.init(layerId, false, false, layerType);
        switchLayer.init(layerId, true, false, layerType);
    },


    /**
     * Returns list of currently enabled layers
     */
    getActiveLayers: () => {
        let activeLayerIds = [];
        $('*[data-gc2-id-vec]').each((index, item) => {
            let isEnabled = $(item).is(':checked');
            if (isEnabled) {
                activeLayerIds.push($(item).data('gc2-id-vec'));
            }
        });

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

    setAutomatic: function (b) {
        automatic = b;
    },

    getStores: function () {
        return store;
    },

    load: function (id) {
        store[id].load();
    }
};