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
var schema = urlparser.schema;

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
 * @type {{set: module.exports.set, init: module.exports.init, ready: module.exports.ready}}
 */
module.exports = {
    set: function () {
    },
    init: function () {
        $.ajax({
            url: '/api/setting/' + db + '/' + schema,
            scriptCharset: "utf-8",
            success: function (response) {
                if (typeof response.data.extents === "object") {
                    var firstSchema = schema.split(",").length > 1 ? schema.split(",")[0] : schema;
                    if (typeof response.data.extents[firstSchema] === "object") {
                        extent = response.data.extents[firstSchema];
                    }
                }
                ready = true;
            }
        }); // Ajax call end
    },

    /**
     * Checks is settings are loaded and ready
     * @returns {boolean}
     */
    ready: function(){
        return ready;
    },

    /**
     * Get the saved extent from the first schema or viz
     * @returns {array}
     */
    getExtent: function(){
        return extent;
    }
};