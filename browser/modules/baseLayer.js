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

/**
 * @type {*|exports|module.exports}
 */
var cloud;

/**
 * @type {*|exports|module.exports}
 */
var urlparser;

/**
 * @type {*|exports|module.exports}
 */
var utils;

/**
 * List with base layers added to the map. Can be got through API.
 * @type {Array}
 */
var baseLayers = [];

let _self = false;

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
        utils = o.utils;

        _self = this;
        return this;
    },
    /**
     *
     */
    init: function () {
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

        cloud.get().bingApiKey = window.bingApiKey;
        cloud.get().digitalGlobeKey = window.digitalGlobeKey;

        let sideBySideSwitcher = `<div class="panel panel-default">
            <div class="panel-body">
                <div class="togglebutton">
                    <label>
                        <input class="js-toggle-side-by-side-mode" type="checkbox"> ${utils.__(`Side-by-side mode`, dict)}
                    </label>
                </div>
            </div>
        </div>`;

        $("#base-layer-list").append(sideBySideSwitcher);

        $(`.js-toggle-side-by-side-mode`).change((event) => {
            if ($(event.target).is(':checked')) {
                _self.drawBaseLayersControl(true);
            } else {
                _self.drawBaseLayersControl(false);
            }
        });

        this.drawBaseLayersControl();
    },

    drawBaseLayersControl: (enableSideBySide = false) => {
        // Delete current layers
        let alreadySelectedLayerId = $('input[name="baselayers"]:checked').closest('.base-layer-item').data('gc2-base-id');
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
            if (enableSideBySide) {
                sideBySideLayerControl = `<div class='radio radio-primary base-layer-item' data-gc2-side-by-side-base-id='${layerId}' style='float: left;'>
                    <label class='side-by-side-baselayer-label'>
                        <input type='radio' name='side-by-side-baselayer'>
                    </label>
                </div>`;
            }

            appendedCode += `<div class='list-group-item js-base-layer-control'>
                <div class='radio radio-primary base-layer-item' data-gc2-base-id='${layerId}' style='float: left;'>
                    <label class='baselayer-label'>
                        <input type='radio' name='baselayers'> 
                    </label>
                </div>
                ${sideBySideLayerControl}
                <div>${layerName}</div>
            </div>
            <div class='list-group-separator'></div>`;
        }

        $("#base-layer-list").append(appendedCode).promise().then(() => {
            setTimeout(() => {
                $(`[data-gc2-base-id="${alreadySelectedLayerId}"]`).trigger('change');

                $('[data-gc2-side-by-side-base-id]').off();
                $('[data-gc2-side-by-side-base-id]').change(event => {
                    let layer1Id = alreadySelectedLayerId;
                    let layer2Id = $(event.target).closest('.base-layer-item').data('gc2-side-by-side-base-id');
                    if (layer1Id && layer2Id) {
                        console.log(layer1Id, layer2Id);
                        let layer1Description = _self.getBaseLayerDescriptionById(layer1Id);
                        let layer1 = _self.createBaseLayerObjectFromDescription(layer1Description);
                        let layer2Description = _self.getBaseLayerDescriptionById(layer2Id);
                        let layer2 = _self.createBaseLayerObjectFromDescription(layer2Description);

                        let control = L.control.sideBySide(layer1, layer2).addTo(cloud.get().map);
                    }
                });
            }, 0);
        });
    },

    getBaseLayerDescriptionById: (id) => {
        var result = false, bl;
        for (var i = 0; i < window.setBaseLayers.length; i = i + 1) {

            bl = window.setBaseLayers[i];

            if (bl.id === id) {
                result = bl;
            }
        }

        return result;
    },

    createBaseLayerObjectFromDescription: (description) => {
        let result = new L.TileLayer(description.url, {
            attribution: description.attribution,
            // Set zoom levels from config, if they are there, else default
            // to [0-18] (native), [0-20] (interpolated)
            minZoom: typeof description.minZoom !== "undefined" ? description.minZoom : 0,
            maxZoom: typeof description.maxZoom !== "undefined" ? description.maxZoom : 20,
            maxNativeZoom: typeof description.maxNativeZoom !== "undefined" ? description.maxNativeZoom : 18
        });

        result.baseLayer = true;
        result.id = description.id;

        return result;
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