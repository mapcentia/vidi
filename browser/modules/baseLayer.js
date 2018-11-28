/*
 * @author     Martin Høgh <mh@mapcentia.com>
 * @copyright  2013-2018 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

'use strict';

import noUiSlider from 'nouislider';

const MODULE_NAME = `baseLayer`;

/**
 * @type {*|exports|module.exports}
 */
var cloud, utils, layers, setBaseLayer, urlparser, backboneEvents, state, setting;

/**
 * List with base layers added to the map. Can be got through API.
 * @type {Array}
 */
var baseLayers = [];

let _self = false;

let sideBySideControl = false;

let activeBaseLayer = false;

let activeSideBySideLayer = false;

let sideBySideEnabled = false;

const SIDE_BY_SIDE_MODES = [`side-by-side`, `overlay`];

/**
 *
 * @type {{set: module.exports.set, init: module.exports.init}}
 */
module.exports = module.exports = {
    /**
     *
     * @param o
     * @returns {exports}
     */
    set: function (o) {
        cloud = o.cloud;
        urlparser = o.urlparser;
        layers = o.layers;
        setBaseLayer = o.setBaseLayer;
        state = o.state;
        backboneEvents = o.backboneEvents;
        utils = o.utils;
        setting = o.setting;

        _self = this;
        return this;
    },
    /**
     *
     */
    init: () => {
        state.listenTo('baseLayer', _self);

        var schemas;
        schemas = urlparser.schema.split(",");
        if (typeof window.setBaseLayers !== 'object') {
            window.setBaseLayers = [
                {"id": "mapQuestOSM", "name": "MapQuset OSM"},
                {"id": "osm", "name": "OSM"},
                {"id": "stamenToner", "name": "Stamen toner"}
            ];
        }

        if (typeof window.vidiConfig.baseLayers === "object") {
            window.setBaseLayers = window.vidiConfig.baseLayers;
        }

        // Setting keys
        cloud.get().bingApiKey = window.bingApiKey;
        cloud.get().digitalGlobeKey = window.digitalGlobeKey;

        // Creating side-by-side mode toggle
        $("#base-layer-list").append(`
                <div class="togglebutton">
                    <label>
                        <input class="js-toggle-side-by-side-mode" type="checkbox"> ${__(`Side-by-side mode`)}
                    </label>
                </div>`);

        $(`.js-toggle-side-by-side-mode`).off();
        $(`.js-toggle-side-by-side-mode`).change((event) => {
            sideBySideEnabled = $(event.target).is(':checked');

            if (sideBySideEnabled) {
                activeSideBySideLayer = false;
                _self.drawBaseLayersControl();
            } else {
                _self.destroySideBySideControl();
                setBaseLayer.init(activeBaseLayer);
            }

            backboneEvents.get().trigger(`${MODULE_NAME}:side-by-side-mode-change`);
        });

        backboneEvents.get().once(`allDoneLoading:layers`, () => {
            _self.getSideBySideModeStatus().then(sideBySideModeStatus => {
                if (sideBySideModeStatus && sideBySideModeStatus.length === 2) {
                    _self.toggleSideBySideControl(sideBySideModeStatus);
                }
            });
        });

        state.listen(MODULE_NAME, `side-by-side-mode-change`);
    },

    getAvailableBaseLayers: () => {
        return window.setBaseLayers;
    },

    /**
     * 
     */
    toggleSideBySideControl: (layers) => {
        let result = false;
        if (layers === false || layers === `false`) {
            result = new Promise((resolve, reject) => {
                if ($('.js-toggle-side-by-side-mode').is(':checked')) {
                    $(`.js-toggle-side-by-side-mode`).trigger(`click`);
                    resolve();
                } else {
                    resolve();
                }
            });
        } else if (layers && layers.length === 2) {
            // Disable the side-by-side mode
            _self.destroySideBySideControl();

            activeSideBySideLayer = false;
            sideBySideEnabled = false;
            $(`.js-toggle-side-by-side-mode`).prop(`checked`, false);

            result = new Promise((resolve, reject) => {
                $(`.js-toggle-side-by-side-mode`).trigger(`click`);
                setTimeout(() => {
                    _self.drawBaseLayersControl().then(() => {
                        $(`[name="baselayers"][value="${layers[0]}"]`).trigger('click');
                        setTimeout(() => {
                            $(`[name="side-by-side-baselayers"][value="${layers[1]}"]`).trigger('click');
                            resolve();
                        }, 1000);
                    });
                }, 1000);
            });

            return result;
        } else {
            throw new Error(`Invalid set of layers`);
        }
    },

    destroySideBySideControl: () => {
        if (sideBySideControl) sideBySideControl.remove();
        sideBySideControl = false;

        // Delete previously initialized side-by-side layers
        for (let key in cloud.get().map._layers) {
            if (`_vidi_side_by_side` in cloud.get().map._layers[key] && cloud.get().map._layers[key]._vidi_side_by_side) {
                cloud.get().map.removeLayer(cloud.get().map._layers[key]);
            }
        }
    },

    redraw: (newBaseLayerName) => {
        activeBaseLayer = newBaseLayerName;
        _self.drawBaseLayersControl();
    },

    drawBaseLayersControl: () => {
        let result = new Promise((resolve, reject) => {
            // Delete current layers
            $(`.js-base-layer-control`).remove();
            baseLayers = [];

            // Add base layers controls
            let appendedCode = ``;
            for (var i = 0; i < window.setBaseLayers.length; i = i + 1) {
                let bl = window.setBaseLayers[i];

                let layerId = false;
                let layerName = false;
                if (typeof bl.type !== "undefined" && bl.type === "XYZ") {
                    baseLayers.push(bl.id);
                    layerId = bl.id;
                    layerName = bl.name;
                } else if (typeof window.setBaseLayers[i].restrictTo === "undefined"
                    || window.setBaseLayers[i].restrictTo.filter((n) => { return schemas.indexOf(n) != -1; }).length > 0) {
                    baseLayers.push(window.setBaseLayers[i].id);
                    layerId = window.setBaseLayers[i].id;
                    layerName = window.setBaseLayers[i].name;
                }

                let sideBySideLayerControl = ``;
                if (sideBySideEnabled) {
                    sideBySideLayerControl = `<div class='radio radio-primary base-layer-item' data-gc2-side-by-side-base-id='${layerId}' style='float: left;'>
                        <label class='side-by-side-baselayers-label'>
                            <input type='radio' name='side-by-side-baselayers' value='${layerId}' ${layerId === activeSideBySideLayer ? `checked=""` : ``}>
                        </label>
                    </div>`;
                }

                appendedCode += `<div class='list-group-item js-base-layer-control'>
                    <div class='radio radio-primary base-layer-item' data-gc2-base-id='${layerId}' style='float: left;'>
                        <label class='baselayer-label'>
                            <input type='radio' name='baselayers' value='${layerId}' ${layerId === activeBaseLayer ? `checked=""` : ``}> 
                        </label>
                    </div>
                    ${sideBySideLayerControl}
                    <div>${layerName}</div>
                </div>
                <div class='list-group-separator'></div>`;
            }

            const disableInputs = () => {
                // Disabling inputs of side-by-side base layers
                if (activeBaseLayer) {
                    $('[name="side-by-side-baselayers"]').prop('disabled', false);
                    $(`[data-gc2-side-by-side-base-id="${activeBaseLayer}"]`).find('[name="side-by-side-baselayers"]').prop('disabled', true);
                }

                // Disabling inputs of base layers
                if (activeSideBySideLayer) {
                    $(`[data-gc2-base-id]`).find('[name="baselayers"]').prop('disabled', false);
                    $(`[data-gc2-base-id="${activeSideBySideLayer}"]`).find('[name="baselayers"]').prop('disabled', true);
                }
            }

            /**
             * Shows two layers side by side and reactivates the radio button controls
             */
            const showTwoLayersSideBySide = () => {
                disableInputs();

                if (activeSideBySideLayer === false) {
                    throw new Error(`Unable to detect the side-by-side layer`);
                }

                if (activeBaseLayer === activeSideBySideLayer) {
                    throw new Error(`Active and side-by-side layers are the same`);
                }

                if (sideBySideControl) {
                    _self.destroySideBySideControl();
                }

                let layer1 = _self.addBaseLayer(activeBaseLayer);
                if (Array.isArray(layer1)) layer1 = layer1.pop();
                layer1._vidi_side_by_side = true;
                layer1.addTo(cloud.get().map);

                let layer2  = _self.addBaseLayer(activeSideBySideLayer);
                if (Array.isArray(layer2)) layer2 = layer2.pop();
                layer2._vidi_side_by_side = true;
                layer2.addTo(cloud.get().map);

                cloud.get().map.invalidateSize();
                sideBySideControl = L.control.sideBySide(layer1, layer2).addTo(cloud.get().map);

                backboneEvents.get().trigger(`${MODULE_NAME}:side-by-side-mode-change`);
            };

            $("#base-layer-list").append(appendedCode).promise().then(() => {
                if (sideBySideEnabled) {
                    disableInputs();

/*

*/

/*
                    const sideBySideModeControl = (`<div>
                        <div style="display: flex;">
                            <div>
                                <h5>${__(`Display layers`)}</h5>
                            </div>
                            <div>
                                <div class="togglebutton">
                                    <label>
                                        <input class="js-toggle-side-by-side-mode" type="checkbox">
                                        <span class="toggle"></span> ${__(`Side by side`)}
                                    </label>
                                </div>
                            </div>
                            <div>
                                <div class="togglebutton">
                                    <label>
                                        <input class="js-toggle-side-by-side-mode" type="checkbox">
                                        <span class="toggle"></span> ${__(`Overlap`)}
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>`);
                    */

                    // @todo Translations
                    const sideBySideModeControl = (`<div>
                        <div style="display: flex; padding-top: 20px;">
                            <div>
                                <h5>${__(`Display layers`)}:</h5>
                            </div>
                            <div style="padding-top: 8px;">
                                <div class="radio radio-primary" style="float: left; width: 30px;">
                                    <label class="baselayer-label">
                                        <input type="radio" name="side-by-side-mode" value="${SIDE_BY_SIDE_MODES[0]}">
                                        <span class="circle"></span>
                                        <span class="check"></span> 
                                    </label>
                                </div>
                                <div style="float: left;">${__(`Side by side`)}</div>
                            </div>
                            <div style="padding-top: 8px;">
                                <div class="radio radio-primary" style="float: left; width: 30px;">
                                    <label class="baselayer-label">
                                        <input type="radio" name="side-by-side-mode" value="${SIDE_BY_SIDE_MODES[1]}">
                                        <span class="circle"></span>
                                        <span class="check"></span> 
                                    </label>
                                </div>
                                <div style="float: left;">${__(`Overlap`)}</div>
                            </div>
                        </div>
                        <div>
                            <div style="padding-left: 15px; padding-right: 10px; padding-bottom: 20px; padding-top: 20px;">
                                <div class="js-side-by-side-layer-opacity-slider slider shor slider-material-orange"></div>
                            </div>
                        </div>
                   </div>`);

                    $("#base-layer-list").append(sideBySideModeControl);

                    let slider = $("#base-layer-list").find(`.js-side-by-side-layer-opacity-slider`).get(0);

                    console.log(`### slider`, slider);
                    if (slider) {
                        noUiSlider.create(slider, {
                            start: 70,
                            connect: `lower`,
                            step: 10,
                            range: {
                                'min': 0,
                                'max': 100
                            }
                        });
   
                        /*
                        slider.noUiSlider.on(`update`, (values, handle, unencoded, tap, positions) => {
                            let sliderValue = (parseFloat(values[handle]) / 100);
                            applyOpacityToLayer(sliderValue, layerKey);
                            setLayerOpacityRequests.push({ layerKey, opacity: sliderValue });
                        });
                        */
                    }
                }

                $(`[name="baselayers"]`).off();
                $(`[name="baselayers"]`).change(event => {
                    activeBaseLayer = $(event.target).val();
                    event.stopPropagation();

                    if ($('.js-toggle-side-by-side-mode').is(':checked') && activeSideBySideLayer !== false) {
                        showTwoLayersSideBySide();
                    } else {
                        setBaseLayer.init(activeBaseLayer);
                    }
                });

                $('[data-gc2-side-by-side-base-id]').off();
                $('[data-gc2-side-by-side-base-id]').change(event => {
                    activeSideBySideLayer = $(event.target).closest('.base-layer-item').data('gc2-side-by-side-base-id');
                    event.stopPropagation();

                    showTwoLayersSideBySide();
                });

                resolve();
            });
        });

        return result;
    },

    /**
     * Returns layers order in corresponding groups
     * 
     * @return {Promise}
     */
    getSideBySideModeStatus: () => {
        let result = new Promise((resolve, reject) => {
            state.getModuleState(MODULE_NAME).then(initialState => {
                let sideBySideMode = ((initialState && `sideBySideMode` in initialState) ? initialState.sideBySideMode : false);
                resolve(sideBySideMode);
            });
        });

        return result;
    },

    /**
     * Returns current module state
     */
    getState: () => {
        let state = { sideBySideMode: false };
        if (sideBySideControl) {
            let layer1Id = $('input[name=baselayers]:checked').val();
            let layer2Id = $('input[name=side-by-side-baselayers]:checked').val();
            if (!layer1Id || !layer2Id) {
                throw new Error(`Unable to detect layer identifiers (${layer1Id}, ${layer2Id}`);
            } else {
                state = { sideBySideMode: [layer1Id, layer2Id] }
            }
        }

        return state;
    },

    /**
     * Applies externally provided state
     */
    applyState: (newState) => {

        console.log(`### apply state for base layer`, newState);

        if (newState === false) {
            let availableBaseLayers = _self.getAvailableBaseLayers();
            if (Array.isArray(availableBaseLayers) && availableBaseLayers.length > 0) {
                let firstBaseLayerId = availableBaseLayers[0].id;
                return setBaseLayer.init(firstBaseLayerId).then(() => {
                    let extent = setting.getExtent();
                    if (extent !== null) {
                        cloud.get().zoomToExtent(extent);
                    } else {
                        cloud.get().zoomToExtent();
                    }
                    return _self.toggleSideBySideControl(false);
                });
            } else {
                console.error(`Unable to select first available base layer`);
            }
        } else {
            return _self.toggleSideBySideControl(newState.sideBySideMode);
        }
    },

    /**
     * Get the ids of the added base layer.
     * @returns {Array}
     */
    getBaseLayer: function(){
        return baseLayers;
    },

    /**
     * 
     * @return {Object} Layer object
     */
    addBaseLayer: function (id) {
        var customBaseLayer, bl, result = false;

        for (var i = 0; i < window.setBaseLayers.length; i = i + 1) {

            bl = window.setBaseLayers[i];

            if (bl.id === id) {

                if (typeof bl.type !== "undefined" && bl.type === "XYZ") {

                    customBaseLayer = new L.TileLayer(bl.url, {

                        attribution: bl.attribution,

                        // Set zoom levels from config, if they are there, else default
                        // to [0-18] (native), [0-20] (interpolated)

                        minZoom: typeof bl.minZoom !== "undefined" ? bl.minZoom : 0,
                        maxZoom: typeof bl.maxZoom !== "undefined" ? bl.maxZoom : 20,
                        maxNativeZoom: typeof bl.maxNativeZoom !== "undefined" ? bl.maxNativeZoom : 18

                    });

                    customBaseLayer.baseLayer = true;
                    customBaseLayer.id = bl.id;

                    result = cloud.get().addLayer(customBaseLayer, bl.name, true);

                } else {

                    result = cloud.get().addBaseLayer(bl.id, bl.db, bl.config, bl.host || null);

                }
            }
        }

        return result;
    }
};