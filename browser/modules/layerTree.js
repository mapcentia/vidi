/**
 * @fileoverview Description of file, its uses and information
 * about its dependencies.
 */

'use strict';

var meta;

/**
 *
 * @type {*|exports|module.exports}
 */
let APIBridgeSingletone = require('../../extensions/editor/browser/api-bridge');

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
    }
};

/**
 *
 * @type {{set: module.exports.set, init: module.exports.init}}
 */
module.exports = {
    set: function (o) {
        meta = o.meta;
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
                    _self.switchLayer(item, false);
                    _self.switchLayer(item, true);
                });
            }
        });

        var base64name, arr, groups, metaData, i, l, count, displayInfo, tooltip;
        groups = [];
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
                        <span class="badge js-app-is-online-badge hidden" style="background-color: #28a745;"><i class="fa fa-signal"></i> Online</span>
                        <span class="badge js-app-is-offline-badge hidden" style="background-color: #dc3545;"><i class="fa fa-times"></i> Offline</span>
                    </label>
                </div>
            </div>
        </div>`);

        $(toggleOfllineOnlineMode).find('.js-toggle-offline-mode').change((event) => {
            if ($(event.target).is(":checked")) {
                apiBridgeInstance.setOfflineMode(true);
            } else {
                apiBridgeInstance.setOfflineMode(false);
            }
        });

        $("#layers").append(toggleOfllineOnlineMode);

        for (i = 0; i < arr.length; ++i) {
            if (arr[i] && arr[i] !== "<font color='red'>[Ungrouped]</font>") {
                l = [];
                base64name = Base64.encode(arr[i]).replace(/=/g, "");

                // Add group container
                // Only if container doesn't exist
                // ===============================
                if ($("#layer-panel-" + base64name).length === 0) {
                    $("#layers").append('<div class="panel panel-default panel-layertree" id="layer-panel-' + base64name + '"><div class="panel-heading" role="tab"><h4 class="panel-title"><div class="layer-count badge"><span>0</span> / <span></span></div><a style="display: block" class="accordion-toggle" data-toggle="collapse" data-parent="#layers" href="#collapse' + base64name + '"> ' + arr[i] + ' </a></h4></div><ul class="list-group" id="group-' + base64name + '" role="tabpanel"></ul></div>');

                    // Append to inner group container
                    // ===============================
                    $("#group-" + base64name).append('<div id="collapse' + base64name + '" class="accordion-body collapse"></div>');
                }

                // Add layers
                // ==========
                for (var u = 0; u < metaData.data.length; ++u) {
                    let localMeta = metaData.data[u];
                    if (localMeta.layergroup == arr[i]) {
                        var text = (localMeta.f_table_title === null || localMeta.f_table_title === "") ? localMeta.f_table_name : localMeta.f_table_title;
                        if (localMeta.baselayer) {
                            $("#base-layer-list").append(
                                "<div class='list-group-item'><div class='row-action-primary radio radio-primary base-layer-item' data-gc2-base-id='" + localMeta.f_table_schema + "." + localMeta.f_table_name + "'><label class='baselayer-label'><input type='radio' name='baselayers'>" + text + "<span class='fa fa-check' aria-hidden='true'></span></label></div></div>"
                            );
                        } else {
                            console.log(localMeta);

                            let tileIsSelcted = '';
                            let vectorIsSelcted = '';
                            let isDisabledAttribute = '';
                            let selectorLabel = __('Tile');
                            if (localMeta.meta) {
                                let parsedMeta = JSON.parse(localMeta.meta);
                                if (parsedMeta.vidi_layer_type) {
                                    if (parsedMeta === 't') {
                                        selectorLabel = __('Tile');
                                        tileIsSelcted = 'selected';
                                        isDisabledAttribute = 'disabled';
                                    }

                                    if (parsedMeta === 'v') {
                                        selectorLabel = __('Vector');
                                        vectorIsSelcted = 'selected';
                                        isDisabledAttribute = 'disabled';
                                    }
                                }
                            }

                            displayInfo = ((localMeta.meta !== null && $.parseJSON(localMeta.meta) !== null && typeof $.parseJSON(localMeta.meta).meta_desc !== "undefined" && $.parseJSON(localMeta.meta).meta_desc !== "") || localMeta.f_table_abstract) ? "visible" : "hidden";
                            tooltip = localMeta.f_table_abstract || "";
                            let layerControlRecord = '<li class="layer-item list-group-item">\
                                <div style="display: inline-block;">\
                                    <div class="checkbox" style="width: 34px;">\
                                        <label>\
                                            <input type="checkbox" id="' + localMeta.f_table_name + '" data-gc2-id="' + localMeta.f_table_schema + "." + localMeta.f_table_name + '">\
                                        </label>\
                                    </div>\
                                </div>\
                                <div style="display: inline-block;">\
                                    <div class="dropdown">\
                                        <button style="padding: 8px;" class="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true" ' + isDisabledAttribute + '>' + selectorLabel + '\
                                        <span class="caret"></span>\
                                        </button>\
                                        <ul class="dropdown-menu">\
                                            <li><a href="#" ' + tileIsSelcted + '>' + __('Tile') + '</a></li>\
                                            <li><a href="#" ' + vectorIsSelcted + '>' + __('Vector') + '</a></li>\
                                        </ul>\
                                    </div>\
                                </div>\
                                <div style="display: inline-block;">\
                                    <span>' + text + (localMeta.authentication === "Read/write" ? " <i class=\"fa fa-lock gc2-session-lock\" aria-hidden=\"true\"></i>":"") + '</span>\
                                </div>\
                                <div style="display: inline-block;">\
                                    <button style="padding: 8px;" type="button" data-gc2-key="' + localMeta.f_table_schema + "." + localMeta.f_table_name + "." + localMeta.f_geometry_column + '" data-toggle="tooltip" data-placement="left" title="Add new feature to layer" data-layer-type="tile" class="btn gc2-add-feature gc2-edit-tools">\
                                        <i class="fa fa-plus"></i>\
                                    </button>\
                                    <span data-toggle="tooltip" data-placement="left" title="' + tooltip + '" style="visibility: ' + displayInfo + '" class="info-label label label-primary" data-gc2-id="' + localMeta.f_table_schema + "." + localMeta.f_table_name + '">Info</span>\
                                </div>\
                            </li>';



                            $("#collapse" + base64name).append(layerControlRecord);

                            l.push({});
                        }
                    }
                }

                if (!isNaN(parseInt($($("#layer-panel-" + base64name + " .layer-count span")[1]).html()))) {
                    count = parseInt($($("#layer-panel-" + base64name + " .layer-count span")[1]).html()) + l.length;
                } else {
                    count = l.length;
                }

                $("#layer-panel-" + base64name + " span:eq(1)").html(count);
                // Remove the group if empty
                if (l.length === 0) {
                    $("#layer-panel-" + base64name).remove();
                }
            }
        }

        // Open the first panel
        // ====================

        $("#layers div:first").find("a").trigger("click");
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
};