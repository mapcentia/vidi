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
 * @type {string}
 */
var urlVars = urlparser.urlVars;

var metaData;

/**
 *
 * @type {Array}
 */
var metaDataKeys = [];

/**
 *
 * @type {Array}
 */
var metaDataKeysTitle = [];

/**
 *
 * @type {boolean}
 */
var ready = false;

/**
 * @type {string}
 */
var host;

/**
 *
 */
var backboneEvents;

try {
    host = require('../../config/config.js').gc2.host;
} catch (e) {
    console.info(e.message);
}

/**
 *
 * @type {{set: module.exports.set, init: module.exports.init, getMetaDataKeys: module.exports.getMetaDataKeys, ready: module.exports.ready}}
 */
module.exports = {
    /**
     *
     * @param o
     * @returns {exports}
     */
    set: function (o) {
        backboneEvents = o.backboneEvents;
        return this;
    },
    /**
     *
     */
    init: function () {
        var schemata;
        schemataStr = (window.gc2Options.mergeSchemata === null ? "" : window.gc2Options.mergeSchemata.join(",") + ',') + (typeof urlVars.i === "undefined" ? "" : urlVars.i.split("#")[1] + ',') + schemataStr;
        if (typeof window.vidiConfig.schemata === "object" && window.vidiConfig.schemata.length > 0) {
            if (schemataStr !== "") {
                schemata = schemataStr.split(",").concat(window.vidiConfig.schemata);
            } else {
                schemata = window.vidiConfig.schemata;
            }
            schemataStr = schemata.join(",")
        }
        $.ajax({
            url: '/api/meta/' + db + '/' + schemataStr,
            scriptCharset: "utf-8",
            success: function (response) {
                metaData = response;
                for (var i = 0; i < metaData.data.length; i++) {
                    metaDataKeys[metaData.data[i].f_table_schema + "." + metaData.data[i].f_table_name] = metaData.data[i];
                    metaDataKeysTitle[metaData.data[i].f_table_title] = metaData.data[i].f_table_title ? metaData.data[i] : null;
                }
                backboneEvents.get().trigger("ready:meta");
                ready = true;
            },
            error: function (response) {
                alert(JSON.parse(response.responseText).message);
            }
        });
    },

    /**
     * Get the meta data in an array with schema.relation as index keys.
     * @returns {Array}
     */
    getMetaDataKeys: function () {
        return metaDataKeys;
    },

    /**
     * Get the meta data in an array with titles as index keys.
     * @returns {Array}
     */
    getMetaDataKeysTitle: function () {
        return metaDataKeysTitle;
    },

    /**
     * Get the raw meta data
     * @returns {Array}
     */
    getMetaData: function () {
        return $.extend(true, [], metaData);
    }
};


