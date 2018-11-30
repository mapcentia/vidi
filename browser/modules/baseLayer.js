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

let activeTwoLayersModeLayer = false;

let twoLayersAtOnceEnabled = false;

let overlayOpacity = 0;

let overlayLayer = false;

const TWO_LAYERS_AT_ONCE_MODES = [`side-by-side`, `overlay`];

let currentTwoLayersAtOnceMode = TWO_LAYERS_AT_ONCE_MODES[0];

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
                        <input class="js-two-layers-at-once-control" type="checkbox"> ${__(`Display two layers at once`)}
                    </label>
                </div>`);

        $(`.js-two-layers-at-once-control`).off();
        $(`.js-two-layers-at-once-control`).change((event) => {
            $(`#base-layer-list`).find(`.js-two-layers-at-once-mode-control-container`).remove();
            twoLayersAtOnceEnabled = $(event.target).is(':checked');
            if (twoLayersAtOnceEnabled) {
                activeTwoLayersModeLayer = false;
                _self.drawBaseLayersControl();
            } else {
                _self.destroyLeafletSideBySideControl();
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

        console.log(`### toggleSideBySideControl`);

        let result = false;
        if (layers === false || layers === `false`) {
            result = new Promise((resolve, reject) => {
                if ($('.js-two-layers-at-once-control').is(':checked')) {
                    $(`.js-two-layers-at-once-control`).trigger(`click`);
                    resolve();
                } else {
                    resolve();
                }
            });
        } else if (layers && layers.length === 2) {
            // Reset the side-by-side control
            _self.destroyLeafletSideBySideControl();

            activeTwoLayersModeLayer = false;
            twoLayersAtOnceEnabled = false;
            $(`.js-two-layers-at-once-control`).prop(`checked`, false);
            // Simulate the enabling of the side-by-side control
            result = new Promise((resolve, reject) => {
                $(`.js-two-layers-at-once-control`).trigger(`click`);
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

    destroyLeafletSideBySideControl: () => {

        console.log(`### destroyLeafletSideBySideControl`);

        if (sideBySideControl) sideBySideControl.remove();
        sideBySideControl = false;

        // Delete previously initialized side-by-side layers
        for (let key in cloud.get().map._layers) {
            if (`_vidi_twolayersatonce_sidebyside` in cloud.get().map._layers[key] && cloud.get().map._layers[key]._vidi_twolayersatonce_sidebyside) {
                cloud.get().map.removeLayer(cloud.get().map._layers[key]);
            }
        }
    },

    destroyLeafletOverlayControl: () => {

        console.log(`### destroyLeafletOverlayControl`);

        // Delete previously initialized overlay layers
        for (let key in cloud.get().map._layers) {
            if (`_vidi_twolayersatonce_overlay` in cloud.get().map._layers[key] && cloud.get().map._layers[key]._vidi_twolayersatonce_overlay) {
                cloud.get().map.removeLayer(cloud.get().map._layers[key]);
            }
        }
    },

    redraw: (newBaseLayerName) => {
        activeBaseLayer = newBaseLayerName;
        _self.drawBaseLayersControl();
    },

    drawBaseLayersControl: () => {

        console.log(`### drawBaseLayersControl`);

        let result = new Promise((resolve, reject) => {
            // Resetting the side-by-side mode
            currentTwoLayersAtOnceMode = TWO_LAYERS_AT_ONCE_MODES[0];

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
                if (twoLayersAtOnceEnabled) {
                    sideBySideLayerControl = `<div class='radio radio-primary base-layer-item' data-gc2-side-by-side-base-id='${layerId}' style='float: left;'>
                        <label class='side-by-side-baselayers-label'>
                            <input type='radio' name='side-by-side-baselayers' value='${layerId}' ${layerId === activeTwoLayersModeLayer ? `checked=""` : ``}>
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
                if (activeTwoLayersModeLayer) {
                    $(`[data-gc2-base-id]`).find('[name="baselayers"]').prop('disabled', false);
                    $(`[data-gc2-base-id="${activeTwoLayersModeLayer}"]`).find('[name="baselayers"]').prop('disabled', true);
                }
            }

            /**
             * Shows two layers side by side and reactivates the radio button controls
             */
            const drawTwoLayersAtOnce = () => {
                disableInputs();

                if (activeTwoLayersModeLayer === false) {
                    throw new Error(`Unable to detect the side-by-side layer`);
                }

                if (activeBaseLayer === activeTwoLayersModeLayer) {
                    throw new Error(`Active and side-by-side layers are the same`);
                }

                if (sideBySideControl) {
                    _self.destroyLeafletSideBySideControl();
                }

                if (overlayLayer) {
                    _self.destroyLeafletOverlayControl();
                }

                console.log(`### drawTwoLayersAtOnce`, currentTwoLayersAtOnceMode);

                if (currentTwoLayersAtOnceMode === TWO_LAYERS_AT_ONCE_MODES[0]) {
                    let layer1 = _self.addBaseLayer(activeBaseLayer);
                    if (Array.isArray(layer1)) layer1 = layer1.pop();
                    layer1._vidi_twolayersatonce_sidebyside = true;
                    layer1.addTo(cloud.get().map);
    
                    let layer2  = _self.addBaseLayer(activeTwoLayersModeLayer);
                    if (Array.isArray(layer2)) layer2 = layer2.pop();
                    layer2._vidi_twolayersatonce_sidebyside = true;
                    layer2.addTo(cloud.get().map);
    
                    cloud.get().map.invalidateSize();
                    sideBySideControl = L.control.sideBySide(layer1, layer2).addTo(cloud.get().map);
    
                    backboneEvents.get().trigger(`${MODULE_NAME}:side-by-side-mode-change`);
                } else if (currentTwoLayersAtOnceMode === TWO_LAYERS_AT_ONCE_MODES[1]) {

                    // add overlay with specific opacity value
                    // keep the reference to the layer in order to manipulate its style later on slider update

                    let layer1 = _self.addBaseLayer(activeBaseLayer);
                    if (Array.isArray(layer1)) layer1 = layer1.pop();
                    layer1._vidi_twolayersatonce_overlay = true;
                    layer1.addTo(cloud.get().map);
    
                    let layer2  = _self.addBaseLayer(activeTwoLayersModeLayer);
                    if (Array.isArray(layer2)) layer2 = layer2.pop();
                    layer2._vidi_twolayersatonce_overlay = true;
                    layer2.addTo(cloud.get().map);

                    cloud.get().map.invalidateSize();

                    overlayLayer = layer2;
                    overlayLayer.setOpacity(overlayOpacity);
                    
                    backboneEvents.get().trigger(`${MODULE_NAME}:side-by-side-mode-change`);
                } else {
                    throw new Error(`Invalid two layers at once mode value (${currentTwoLayersAtOnceMode})`);
                }
            };

            $("#base-layer-list").append(appendedCode).promise().then(() => {
                if (twoLayersAtOnceEnabled) {
                    disableInputs();

                    let selectedSideBySide = ``;
                    let selectedOverlay = ``;
                    if (currentTwoLayersAtOnceMode === TWO_LAYERS_AT_ONCE_MODES[0]) {
                        selectedSideBySide = `checked="checked"`;
                    } else if (currentTwoLayersAtOnceMode === TWO_LAYERS_AT_ONCE_MODES[1]) {
                        selectedOverlay = `checked="checked"`;
                    } else {
                        throw new Error(`Invalid two layers at once mode value (${currentTwoLayersAtOnceMode})`);
                    }

                    const twoLayersAtOnceModeControl = (`<div class="js-two-layers-at-once-mode-control-container">
                        <div style="display: flex; padding-top: 20px;">
                            <div>
                                <h5>${__(`Display layers`)}:</h5>
                            </div>
                            <div style="padding-top: 8px;">
                                <div class="radio radio-primary" style="float: left; width: 30px;">
                                    <label class="baselayer-label">
                                        <input type="radio" name="side-by-side-mode" ${selectedSideBySide} value="${TWO_LAYERS_AT_ONCE_MODES[0]}" >
                                        <span class="circle"></span>
                                        <span class="check"></span> 
                                    </label>
                                </div>
                                <div style="float: left;">${__(`Side-by-side`)}</div>
                            </div>
                            <div style="padding-top: 8px;">
                                <div class="radio radio-primary" style="float: left; width: 30px;">
                                    <label class="baselayer-label">
                                        <input type="radio" name="side-by-side-mode" ${selectedOverlay} value="${TWO_LAYERS_AT_ONCE_MODES[1]}">
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

                    const initiateSlider = (initialValue) => {
                        if (!(initialValue >= 0 && initialValue <= 100)) {
                            throw new Error(`Invalid initial value for slider`);
                        }

                        let slider = $("#base-layer-list").find(`.js-side-by-side-layer-opacity-slider`).get(0);
                        if (slider) {
                            if (`noUiSlider` in slider) {
                                slider.noUiSlider.destroy();
                            }

                            noUiSlider.create(slider, {
                                start: initialValue,
                                connect: `lower`,
                                step: 10,
                                range: {
                                    'min': 0,
                                    'max': 100
                                }
                            });
       
                            slider.noUiSlider.on(`update`, (values, handle, unencoded, tap, positions) => {
                                let sliderValue = (parseFloat(values[handle]) / 100);
                                overlayOpacity = sliderValue;
                                if (overlayLayer) {
                                    overlayLayer.setOpacity(overlayOpacity);
                                }
                            });
                        } else {
                            throw new Error(`Unable to find the slider container node`);
                        }
                    };

                    $(`#base-layer-list`).find(`.js-two-layers-at-once-mode-control-container`).remove();
                    $("#base-layer-list").append(twoLayersAtOnceModeControl);
                    $("#base-layer-list").find(`input[type=radio][name=side-by-side-mode]`).change(function () {


                        console.log(`### this.value`, this.value);

                        if (this.value === TWO_LAYERS_AT_ONCE_MODES[0]) {
                            $("#base-layer-list").find(`.js-side-by-side-layer-opacity-slider`).hide(0);
                            currentTwoLayersAtOnceMode = TWO_LAYERS_AT_ONCE_MODES[0];
                            if (activeTwoLayersModeLayer !== false) {
                                drawTwoLayersAtOnce();
                            }
                        } else if (this.value === TWO_LAYERS_AT_ONCE_MODES[1]) {
                            initiateSlider(50);
                            $("#base-layer-list").find(`.js-side-by-side-layer-opacity-slider`).show(0);
                            currentTwoLayersAtOnceMode = TWO_LAYERS_AT_ONCE_MODES[1];
                            if (activeTwoLayersModeLayer !== false) {
                                drawTwoLayersAtOnce();
                            }
                        } else {
                            throw new Error(`Invalid two layers at once mode value (${this.value})`);
                        }
                    });

                    if (currentTwoLayersAtOnceMode === TWO_LAYERS_AT_ONCE_MODES[1]) {
                        initiateSlider(50);
                    }
                }

                $(`[name="baselayers"]`).off();
                $(`[name="baselayers"]`).change(event => {
                    activeBaseLayer = $(event.target).val();
                    event.stopPropagation();

                    if ($('.js-two-layers-at-once-control').is(':checked') && activeTwoLayersModeLayer !== false) {
                        drawTwoLayersAtOnce();
                    } else {
                        setBaseLayer.init(activeBaseLayer);
                    }
                });

                $('[data-gc2-side-by-side-base-id]').off();
                $('[data-gc2-side-by-side-base-id]').change(event => {
                    activeTwoLayersModeLayer = $(event.target).closest('.base-layer-item').data('gc2-side-by-side-base-id');
                    event.stopPropagation();

                    drawTwoLayersAtOnce();
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
    addBaseLayer: function (id, options = false) {

        console.log(`### addBaseLayer`);

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