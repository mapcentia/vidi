/**
 * @fileoverview Description of file, its uses and information
 * about its dependencies.
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
    init: function () {
        return new Promise(function(resolve, reject) {
            var schemata;
            if (typeof window.vidiConfig.schemata === "object" && window.vidiConfig.schemata.length > 0) {
                if (schemataStr !== "") {
                    schemata = schemataStr.split(",").concat(window.vidiConfig.schemata);
                } else {
                    schemata = window.vidiConfig.schemata;
                }
                schemataStr = schemata.join(",");
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
     * Get the saved extent from the first schema or viz
     * @returns {array}
     */
    getExtent: function () {
        return extent;
    }
};