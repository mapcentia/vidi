/*
 * @author     Alexander Shumilov
 * @copyright  2013-2018 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

/**
 * Watching queue changes and displaying them in layerTree
 * 
 * @todo Rewrite layerTree using React or Angular
 */

/**
 * Stores the last value of application online status
 */
let applicationIsOnline = -1;

let theStatisticsPanelWasDrawn = false;

let accumulatedDiff = [];

let lastStatistics = false;

let switchLayer = false;

let layerTree = false;

class QueueStatisticsWatcher {
    constructor(o) {
        switchLayer = o.switchLayer;
        layerTree = o.layerTree;
    }

    setLastStatistics(newLastStatistics) {
        lastStatistics = newLastStatistics;
    }

    getLastStatistics() {
        return lastStatistics;
    }

    /**
     * Displays current state of APIBridge feature management
     * 
     * @param {*} statistics 
     * @param {*} forceLayerUpdate 
     */
    processStatisticsUpdate(statistics, forceLayerUpdate = false, skipLastStatisticsCheck = false, userPreferredForceOfflineMode, apiBridgeInstance) {
        let _self = this;

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
                /*
                    User have not decided yet whenever he want to force or not the
                    offline mode or user already selected not to force offline mode
                */
                if (userPreferredForceOfflineMode === false || userPreferredForceOfflineMode === -1) {
                    apiBridgeInstance.setOfflineMode(false);
                    $('.js-toggle-offline-mode').prop('checked', false);
                } else {
                    apiBridgeInstance.setOfflineMode(true);
                    $('.js-toggle-offline-mode').prop('checked', true);
                }

                $('.js-toggle-offline-mode').prop('disabled', false);
                applicationIsOnline = true;
                $('.js-app-is-online-badge').removeClass('hidden');
            } else {
                if (applicationIsOnline !== false) {
                    apiBridgeInstance.setOfflineMode(true);
                    $('.js-toggle-offline-mode').prop('checked', true);
                }

                $('.js-toggle-offline-mode').prop('disabled', true);
                applicationIsOnline = false;
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
                            if (item.serverErrorType && item.serverErrorType === `AUTHORIZATION_ERROR`) {
                                errorMessage = __(`Not authorized to perform this action`);
                            }

                            let errorRecord = $(`<div>
                                <span class="label label-danger"><i style="color: black;" class="fa fa-exclamation"></i></span>
                                <button data-feature-geometry='${JSON.stringify(copiedItem.geometry)}' class="btn btn-secondary js-center-map-on-item" type="button" style="padding: 4px; margin-top: 0px; margin-bottom: 0px;">
                                    <i style="color: black;" class="fa fa-map-marker"></i>
                                </button>
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
                if (layerTree) {
                    let layerName = item;
                    layerTree.getActiveLayers().map(activeLayerName => {
                        if (activeLayerName === ('v:' + layerName) || ('v:' + activeLayerName) === layerName) {
                            layerName = activeLayerName;
                        }
                    });

                    switchLayer.init(layerName, false, true, true);
                    switchLayer.init(layerName, true, true, true);
                }
            });
        }

        accumulatedDiff = [];
    }

    /**
     * Detects what layers changed theirs statistics
     */
    getStatisticsDiff(newStatistics, oldStatistics) {
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
    }
};

module.exports = QueueStatisticsWatcher;