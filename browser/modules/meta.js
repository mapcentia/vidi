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
 * @type {Object}
 */
var cloud;

/**
 * @type {object}
 */
var switchLayer;

/**
 * @type {object}
 */
var setBaseLayer;

/**
 *
 * @type {boolean}
 */
var ready = false;

/**
 *
 * @type {boolean}
 */
var cartoDbLayersready = false;

/**
 *
 * @type {string}
 */
var BACKEND = require('../../config/config.js').backend;

/**
 * @type {string}
 */
var host;

/**
 * @type {object}
 */
var legend;

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
        cloud = o.cloud;
        switchLayer = o.switchLayer;
        setBaseLayer = o.setBaseLayer;
        legend = o.legend;
        backboneEvents = o.backboneEvents;
        return this;
    },
    /**
     *
     */
    init: function () {
        $.ajax({
            url: '/api/meta/' + db + '/' + (window.gc2Options.mergeSchemata === null ? "" : window.gc2Options.mergeSchemata.join(",") + ',') + (typeof urlVars.i === "undefined" ? "" : urlVars.i.split("#")[1] + ',') + schema,
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
        }); // Ajax call end
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


