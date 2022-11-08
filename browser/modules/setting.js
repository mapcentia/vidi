/*
 * @author     Martin Høgh <mh@mapcentia.com>
 * @copyright  2013-2018 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

'use strict';

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
 * @type {string}
 */
var schemataStr = urlparser.schema;

/**
 *
 * @type {boolean}
 */
var ready = false;

/**
 * @type {array}
 */
var extent;

var maxBounds;

/**
 *
 * @type {*|exports|module.exports}
 */
var backboneEvents;

/**
 *
 * @type {{set: module.exports.set, init: module.exports.init, ready: module.exports.ready}}
 */
module.exports = {
    set: function (o) {
        backboneEvents = o.backboneEvents;
    },
    init: function (externalSchemataStr = false) {
        return new Promise(function(resolve, reject) {
            var schemata;
            if (typeof window.vidiConfig.schemata === "object" && window.vidiConfig.schemata.length > 0) {
                if (schemataStr !== "") {
                    schemata = schemataStr.split(",").concat(window.vidiConfig.schemata);
                } else {
                    schemata = window.vidiConfig.schemata;
                }

                schemataStr = schemata.join(",");
            } else if (externalSchemataStr) {
                schemataStr = externalSchemataStr;
            }

            if (!schemataStr) {
                reject(new Error('No schemata'));
                return;
            }

            $.ajax({
                url: '/api/setting/' + db + '/' + schemataStr,
                scriptCharset: "utf-8",
                success: function (response) {
                    if (typeof response.data.extents === "object") {
                        var firstSchema = schemataStr.split(",").length > 1 ? schemataStr.split(",")[0] : schemataStr;
                        if (typeof response.data.extents[firstSchema] === "object") {
                            extent = response.data.extents[firstSchema];
                        }
                        if (typeof response.data.extentrestricts === "object" && typeof response.data.extentrestricts[firstSchema] === "object") {
                            maxBounds = response.data.extentrestricts[firstSchema];
                        }
                    }
                    ready = true;
                    backboneEvents.get().trigger("ready:settings");
                    resolve();
                }
            });
        })
    },

    /**
     * Checks is settings are loaded and ready
     * @returns {boolean}
     */
    ready: function () {
        return ready;
    },

    /**
     * Get the saved extent from the first schema
     * @returns {array}
     */
    getExtent: function () {
        return extent;
    },

    /**
     * Get the saved maxBounds from the first schema
     * @returns {array}
     */
    getMaxBounds: function () {
        return maxBounds;
    }
};
