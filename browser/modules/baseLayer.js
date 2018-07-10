/**
 * @fileoverview Description of file, its uses and information
 * about its dependencies.
 */

'use strict';

const dict = {
    "Side-by-side mode": {
        "da_DK": "# Side-by-side mode",
        "en_US": "# Side-by-side mode"
    }
};

const MODULE_NAME = `baseLayer`;

/**
 * @type {*|exports|module.exports}
 */
var cloud, utils, layers, setBaseLayer, urlparser, backboneEvents, state;

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
        $("#base-layer-list").append(`<div class="panel panel-default">
            <div class="panel-body">
                <div class="togglebutton">
                    <label>
                        <input class="js-toggle-side-by-side-mode" type="checkbox"> ${utils.__(`Side-by-side mode`, dict)}
                    </label>
                </div>
            </div>
        </div>`);

        $(`.js-toggle-side-by-side-mode`).change((event) => {
            sideBySideEnabled = $(event.target).is(':checked');
            if (sideBySideEnabled) {
                activeSideBySideLayer = false;
            } else {
                _self.destroySideBySideControl(true);
            }

            _self.drawBaseLayersControl();
            backboneEvents.get().trigger(`${MODULE_NAME}:side-by-side-mode-change`);
        });

        _self.getSideBySideModeStatus().then(sideBySideModeStatus => {
            if (sideBySideModeStatus && sideBySideModeStatus.length === 2) {
                _self.toggleSideBySideControl(sideBySideModeStatus);
            }
        });

        state.listen(MODULE_NAME, `side-by-side-mode-change`);
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

    destroySideBySideControl: (revert = false) => {
        if (sideBySideControl) sideBySideControl.remove();
        sideBySideControl = false;

        if (revert) {
            setBaseLayer.init(activeBaseLayer);
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

            $("#base-layer-list").append(appendedCode).promise().then(() => {
                $(`[name="baselayers"]`).change(event => {
                    activeBaseLayer = $(event.target).val();
                    event.stopPropagation();
                    setBaseLayer.init(activeBaseLayer);
                });

                // Disabling inputs
                $('[name="side-by-side-baselayers"]').prop('disabled', false);
                $(`[data-gc2-side-by-side-base-id="${activeBaseLayer}"]`).find('[name="side-by-side-baselayers"]').prop('disabled', true);

                $('[data-gc2-side-by-side-base-id]').off();
                $('[data-gc2-side-by-side-base-id]').change(event => {
                    activeSideBySideLayer = $(event.target).closest('.base-layer-item').data('gc2-side-by-side-base-id');

                    // Disabling inputs
                    $(`[data-gc2-base-id]`).find('[name="baselayers"]').prop('disabled', false);
                    $(`[data-gc2-base-id="${activeSideBySideLayer}"]`).find('[name="baselayers"]').prop('disabled', true);

                    if (activeBaseLayer && activeSideBySideLayer) {
                        if (sideBySideControl) {
                            _self.destroySideBySideControl();
                        }

                        let layer1 = cloud.get().addBaseLayer(activeBaseLayer).addTo(cloud.get().map);
                        let layer2 = cloud.get().addBaseLayer(activeSideBySideLayer).addTo(cloud.get().map);
                        cloud.get().map.invalidateSize();
                        sideBySideControl = L.control.sideBySide(layer1, layer2).addTo(cloud.get().map);

                        backboneEvents.get().trigger(`${MODULE_NAME}:side-by-side-mode-change`);
                    }
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
                throw new Error(`Unable to detect layer identifiers`);
            } else {
                state = {
                    sideBySideMode: [layer1Id, layer2Id]
                }
            }           
        } 

        return state;
    },

    /**
     * Applies externally provided state
     */
    applyState: (newState) => {
        //return new Promise((resolve, reject) => { resolve(); });
        return _self.toggleSideBySideControl(newState.sideBySideMode);
    },

    /**
     * Get the ids of the added base layer.
     * @returns {Array}
     */
    getBaseLayer: function(){
        return baseLayers;
    },

    addBaseLayer: function (id) {
        var customBaseLayer, bl;

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

                    cloud.get().addLayer(customBaseLayer, bl.name, true);

                } else {

                    cloud.get().addBaseLayer(bl.id, bl.db, bl.config, bl.host || null);

                }
            }
        }
    }
};