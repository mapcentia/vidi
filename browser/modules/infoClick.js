/*
 * @author     Martin Høgh <mh@mapcentia.com>
 * @copyright  2013-2018 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

'use strict';

import {LAYER} from "./layerTree/constants";

const MODULE_ID = `infoClick`;

var cloud;
var backboneEvents;
var utils;
var clicktimer;
var sqlQuery;
var layerTree;
var _layers;
var qstore = [];
var active = false;
var _self = false;

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
        return this;
    },

    init: function () {
        backboneEvents.get().on(`reset:all reset:${MODULE_ID}`, () => {
            _self.reset();
        });
        backboneEvents.get().on(`off:all`, () => {
            _self.off();
            _self.reset();
        });
        backboneEvents.get().on(`on:${MODULE_ID}`, () => {
            _self.active(true);
        });
        backboneEvents.get().on(`off:${MODULE_ID}`, () => {
            _self.active(false);
        });

        cloud.get().on("dblclick", function () {
            clicktimer = undefined;
        });

        cloud.get().on("click", function (e) {
            if (active === false || e.originalEvent.clickedOnFeature) {
                return;
            }

            // Reset all SQL Query layers
            backboneEvents.get().trigger("sqlQuery:clear");

            var event = new geocloud.clickEvent(e, cloud.get());
            if (clicktimer) {
                clearTimeout(clicktimer);
            } else {
                clicktimer = setTimeout(function () {
                    clicktimer = undefined;
                    var coords = event.getCoordinate(), wkt;
                    wkt = "POINT(" + coords.x + " " + coords.y + ")";

                    // Cross Multi select disabled
                    if (!window.vidiConfig.crossMultiSelect || window.vidiConfig.enabledExtensions.includes('editor')) {
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
                        let intersectingFeatures = [];
                        sqlQuery.init(qstore, wkt, "3857", (store) => {
                            setTimeout(() => {
                                if (store.geoJSON) {
                                    sqlQuery.prepareDataForTableView(LAYER.VECTOR + ':' + store.key, store.geoJSON.features);
                                    store.layer.eachLayer((layer) => {
                                        intersectingFeatures.push({
                                            feature: layer.feature,
                                            layer: layer,
                                            layerKey: store.key
                                        });
                                    })
                                }
                                _layers.decrementCountLoading("_vidi_sql_" + store.id);
                                backboneEvents.get().trigger("doneLoading:layers", "_vidi_sql_" + store.id);
                                if (_layers.getCountLoading() === 0) {
                                    layerTree.displayAttributesPopup(intersectingFeatures, e, '');
                                }
                            }, 200)
                        }, null, [coords.lat, coords.lng]);

                    }
                }, 250);
            }
        });
    },

    /**
     *
     */
    reset: function () {
        sqlQuery.reset(qstore);
    },

    /**
     *
     * @param a {boolean}
     */
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
    },

    on: () => {
        active = true;

    },

    off: () => {
        active = false;
        utils.cursorStyle().reset();
    }
};


