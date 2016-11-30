/**
 * @fileoverview Description of file, its uses and information
 * about its dependencies.
 */

'use strict';

/**
 * @type {*|exports|module.exports}
 */
var cloud;

/**
 * @type {*|exports|module.exports}
 */
var urlparser;

/**
 * List with base layers added to the map. Can be got through API.
 * @type {Array}
 */
var baseLayers = [];

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
        return this;
    },
    /**
     *
     */
    init: function () {
        var bl, customBaseLayer, schemas;
        schemas = urlparser.schema.split(",");
        if (typeof window.setBaseLayers !== 'object') {
            window.setBaseLayers = [
                {"id": "mapQuestOSM", "name": "MapQuset OSM"},
                {"id": "osm", "name": "OSM"},
                {"id": "stamenToner", "name": "Stamen toner"}
            ];
        }
        cloud.bingApiKey = window.bingApiKey;
        cloud.digitalGlobeKey = window.digitalGlobeKey;
        for (var i = 0; i < window.setBaseLayers.length; i = i + 1) {
            bl = window.setBaseLayers[i];
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
                cloud.addLayer(customBaseLayer, bl.name, true);
                baseLayers.push(bl.id);
                $("#base-layer-list").append(
                    "<div class='list-group-item'><div class='radio radio-primary base-layer-item' data-gc2-base-id='" + bl.id + "'><label class='baselayer-label'><input type='radio' name='baselayers'>" + bl.name + "</label></div></div><div class='list-group-separator'></div>"
                );
            } else if (typeof window.setBaseLayers[i].restrictTo === "undefined" || window.setBaseLayers[i].restrictTo.filter(function(n) {return schemas.indexOf(n) != -1;}).length > 0) {
                cloud.addBaseLayer(window.setBaseLayers[i].id, window.setBaseLayers[i].db);
                baseLayers.push(window.setBaseLayers[i].id);
                $("#base-layer-list").append(
                    "<div class='list-group-item'><div class='radio radio-primary base-layer-item' data-gc2-base-id='" + window.setBaseLayers[i].id + "'><label class='baselayer-label'><input type='radio' name='baselayers'>" + window.setBaseLayers[i].name + "</label></div></div><div class='list-group-separator'></div>"
                );
            }
        }
    },

    /**
     * Get the ids of the added base layer.
     * @returns {Array}
     */
    getBaseLayer: function(){
        return baseLayers;
    }
};