/*
 * @author     Martin Høgh <mh@mapcentia.com>
 * @copyright  2013-2022 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

'use strict';

import {LAYER, MAP_RESOLUTIONS} from "./layerTree/constants";
import {booleanIntersects as turfIntersects, buffer as turfBuffer} from "@turf/turf";
import {feature as turfFeature, point as turfPoint} from "@turf/helpers";

const MODULE_ID = `infoClick`;

let cloud;
let backboneEvents;
let utils;
let clicktimer;
let sqlQuery;
let layerTree;
let _layers;
let qstore = [];
let active = false;
let _self = false;
let blocked = false;
let advancedInfo;
let meta;

/**
 *
 * @type {{set: module.exports.set, init: module.exports.init, reset: module.exports.reset, active: module.exports.active}}
 */
module.exports = {
    set: function (o) {
        cloud = o.cloud;
        sqlQuery = o.sqlQuery;
        backboneEvents = o.backboneEvents;
        utils = o.utils;
        layerTree = o.layerTree;
        _layers = o.layers;
        _self = this;
        advancedInfo = o.advancedInfo;
        meta = o.meta;
        return this;
    },

    init: function () {
        backboneEvents.get().on(`reset:all reset:${MODULE_ID}`, () => {
            _self.reset();
        });
        backboneEvents.get().on(`off:all`, () => {
            _self.off();
            // _self.reset();
        });
        backboneEvents.get().on(`on:${MODULE_ID}`, () => {
            _self.active(true);
        });
        backboneEvents.get().on(`off:${MODULE_ID}`, () => {
            _self.active(false);
        });
        backboneEvents.get().on(`block:${MODULE_ID}`, () => {
            blocked = true;
        });
        backboneEvents.get().on(`unblock:${MODULE_ID}`, () => {
            blocked = false;
        });

        cloud.get().on("dblclick", function () {
            clicktimer = undefined;
        });

        cloud.get().on("click", function (e) {
            if (active === false || e.originalEvent.clickedOnFeature || blocked) {
                return;
            }

            // Reset all SQL Query layers
            backboneEvents.get().trigger("sqlQuery:clear");


            const event = new geocloud.clickEvent(e, cloud.get());
            if (clicktimer) {
                clearTimeout(clicktimer);
            } else {
                clicktimer = setTimeout(function () {
                    clicktimer = undefined;
                    let coords = event.getCoordinate(), wkt;
                    wkt = "POINT(" + coords.x + " " + coords.y + ")";

                    // Cross Multi select disabled
                    if (!window.vidiConfig.crossMultiSelect) {
                        sqlQuery.init(qstore, wkt, "3857", null, null, [coords.lat, coords.lng], false, false, false, (layerId) => {
                            setTimeout(() => {
                                let parentLayer = cloud.get().map._layers[layerId];
                                let clearQueryResults = true;
                                if (parentLayer && parentLayer.editor && parentLayer.editor.enabled()) clearQueryResults = false;
                                if (clearQueryResults) backboneEvents.get().trigger("sqlQuery:clear");
                            }, 100);
                        }, () => {
                        }, "", true);
                        // Cross Multi select enabled
                    } else {
                        let coord3857 = utils.transform("EPSG:4326", "EPSG:3857", [e.latlng.lng, e.latlng.lat]);
                        let intersectingFeatures = [];
                        const distance = 10 * MAP_RESOLUTIONS[cloud.get().getZoom()];
                        const clickFeature = turfBuffer(turfPoint([e.latlng.lng, e.latlng.lat]), distance, {units: 'meters'});
                        let mapObj = cloud.get().map;
                        for (let l in mapObj._layers) {
                            let overlay = mapObj._layers[l];
                            if (overlay._layers) {
                                for (let f in overlay._layers) {
                                    if (!overlay._layers[f]?.feature?.geometry || overlay?.id?.startsWith('HL:')) {
                                        continue;
                                    }
                                    let featureForChecking = overlay._layers[f];
                                    let feature = turfFeature(featureForChecking.feature.geometry);
                                    try {
                                        if (turfIntersects(clickFeature, feature) && overlay.id) {
                                            const layerId = overlay.id.split(":")[1];
                                            try {
                                                const zoom = mapObj.getZoom();
                                                const parsedMeta = JSON.parse(meta.getMetaByKey(layerId).meta);
                                                const minZoom = parseInt(parsedMeta.vector_min_zoom);
                                                const maxZoom = parseInt(parsedMeta.vector_max_zoom);
                                                if (minZoom > zoom || maxZoom < zoom) {
                                                    console.log(layerId + " is out of min/max zoom")
                                                    continue;
                                                }
                                            } catch (e) {
                                                console.error(e)
                                            }
                                            intersectingFeatures.push({
                                                feature: featureForChecking.feature,
                                                layer: featureForChecking,
                                                layerKey: layerId,
                                                vector: true
                                            })
                                        }
                                    } catch (e) {
                                        console.log(e);
                                    }
                                }
                            }
                        }
                        let activelayers = _layers.getMapLayers() ? _layers.getLayers().split(",") : [];
                        let activeTilelayers = activelayers.filter(e => {
                            if (e.split(':').length === 1) {
                                const m = meta.getMetaByKey(e)
                                if (m?.not_querable !== true) {
                                    return true;
                                }
                            }
                        })
                        if (activeTilelayers.length > 0) {
                            const t = sqlQuery.init(qstore, wkt, "3857", (store) => {
                                setTimeout(() => {
                                    if (store?.geoJSON) {
                                        sqlQuery.prepareDataForTableView(LAYER.VECTOR + ':' + store.key, store.geoJSON.features);
                                        store.layer.eachLayer((layer) => {
                                            intersectingFeatures.push({
                                                feature: layer.feature,
                                                layer: layer,
                                                layerKey: store.key
                                            });
                                        })
                                        _layers.decrementCountLoading("_vidi_sql_" + store.id);
                                        backboneEvents.get().trigger("doneLoading:layers", "_vidi_sql_" + store.id);
                                    }
                                    if (_layers.getCountLoading() === 0) {
                                        layerTree.displayAttributesPopup(intersectingFeatures, e);
                                    }
                                }, 200)
                            }, null, [coord3857[0], coord3857[1]]);
                        } else
                            layerTree.displayAttributesPopup(intersectingFeatures, e);
                    }
                }, 250);
            }
        });
    },

    reset: function () {
        sqlQuery.reset(qstore);
    },

    active: function (a) {
        if (!a) {
            this.reset();
            utils.cursorStyle().reset();
        } else {
            if (typeof window.vidiConfig.infoClickCursorStyle !== "undefined") {
                switch (window.vidiConfig.infoClickCursorStyle) {
                    case "pointer":
                        utils.cursorStyle().pointer();
                        break;
                    case "crosshair":
                        utils.cursorStyle().crosshair();
                        break;
                    default:
                        utils.cursorStyle().crosshair();
                        break;
                }
            } else {
                utils.cursorStyle().crosshair();
            }
        }
        active = a;
        if ($("#advanced-info-btn").is(':checked')) {
            advancedInfo.on();
        }
    },

    on: () => {
        active = true;
    },

    off: () => {
        active = false;
        utils.cursorStyle().reset();
    }
};

