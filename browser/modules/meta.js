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

/**
 * The full meta dat object
 * @type {{data: Array}}
 */
var metaData = {data: []};

/**
 * Object that holds the latest loaded meta data
 * @type {{data: Array}}
 */
var metaDataLatestLoaded;

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

var layersPromise;

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
    init: function (str) {
        var me = this;
        return new Promise(function (resolve, reject) {
            var schemata;
            if (str) {
                schemataStr = str;
            } else {
                schemataStr = (window.gc2Options.mergeSchemata === null ? "" : window.gc2Options.mergeSchemata.join(",") + ',') + (typeof urlVars.i === "undefined" ? "" : urlVars.i.split("#")[1] + ',') + schemataStr;
            }
            if (typeof window.vidiConfig.schemata === "object" && window.vidiConfig.schemata.length > 0) {
                if (schemataStr !== "") {
                    schemata = schemataStr.split(",").concat(window.vidiConfig.schemata);
                } else {
                    schemata = window.vidiConfig.schemata;
                }
                schemataStr = schemata.join(",")
            }
            if (!schemataStr) {
                reject(new Error('No schemata'));
                return;
            }
            $.ajax({
                url: '/api/meta/' + db + '/' + schemataStr,
                scriptCharset: "utf-8",
                success: function (response) {
                    me.addMetaData(response);
                    ready = true;
                    resolve()
                },
                error: function (response) {
                    reject();
                    alert(JSON.parse(response.responseText).message);
                }
            });
        })
    },

    /**
     *
     * @param data
     */
    addMetaData: function (data) {
        metaDataLatestLoaded = data;
        metaData.data = metaData.data.concat(data.data);
        for (var i = 0; i < data.data.length; i++) {
            metaDataKeys[data.data[i].f_table_schema + "." + data.data[i].f_table_name] = data.data[i];
            metaDataKeysTitle[data.data[i].f_table_title] = data.data[i].f_table_title ? data.data[i] : null;
        }
        backboneEvents.get().trigger("ready:meta");
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
     * Get the raw full meta data object
     * @returns {Object}
     */
    getMetaData: function () {
        return $.extend(true, {}, metaData);
    },

    /**
     * Get the raw meta data from latest loaded
     * @returns {Object}
     */
    getMetaDataLatestLoaded: function () {
        return $.extend(true, {}, metaDataLatestLoaded);
    }
};


