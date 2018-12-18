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
var urlVars = urlparser.urlVars;

/**
 * The full meta dat object
 * @type {{data: Array}}
 */
window.metaData = {data: []};

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

let _self = false;

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

        _self = this;
        return this;
    },

    /**
     *
     * @param str
     * @param doNotLoadExisting
     * @returns {Promise<any>}
     */
    init: function (str, doNotLoadExisting, doNotReset) {
        var me = this,
            schemataStr = urlparser.schema;

        // Reset
        ready = false;

        /*
            Reset, otherwise it gets duplicated via addMetaData() - adding same meta
            to the array which already contains this meta
        */
        if (!doNotReset) {
            window.metaData = {data: []};
        }

        return new Promise(function (resolve, reject) {

            try {

            
            var schemata;

            if (!doNotLoadExisting) {
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
            } else {
                schemataStr = str;
            }

            $.ajax({
                url: '/api/meta/' + db + '/' + schemataStr,
                scriptCharset: "utf-8",
                success: function (response) {
                    if (response.data && response.data.length > 0) {
                        me.addMetaData(response);
                        ready = true;
                        resolve(response);
                    } else {
                        reject();
                    }
                },
                error: function (response) {
                    reject();
                    alert(JSON.parse(response.responseText).message);
                }
            });

            } catch(e) {
                console.error(e);
            }

        })
    },


    /**
     * Add a meta data objects layers
     * @param data {object}
     */
    addMetaData: function (data) {
        metaDataLatestLoaded = data;

        let numberOfLayersAdded = 0;
        data.data.map(layerMeta => {
            let layerAlreadyExists = false;
            metaData.data.map(existingMetaLayer => {
                if ((existingMetaLayer.f_table_schema + existingMetaLayer.f_table_name) === (layerMeta.f_table_schema + layerMeta.f_table_name)) {
                    layerAlreadyExists = true;
                    return false;
                }
            });

            if (layerAlreadyExists === false) {
                numberOfLayersAdded++;
                metaData.data.push(layerMeta);
            }
        });

        for (var i = 0; i < data.data.length; i++) {
            metaDataKeys[data.data[i].f_table_schema + "." + data.data[i].f_table_name] = data.data[i];
            metaDataKeysTitle[data.data[i].f_table_title] = data.data[i].f_table_title ? data.data[i] : null;
        }

        if (numberOfLayersAdded.length > 0) {
            backboneEvents.get().trigger("ready:meta");
        }
    },

    /**
     * Returns meta object for the specified layer idenfitier
     * 
     * @param {String} layerKey Layer identifier
     * 
     * @throws {Exception} If layer with provided key does not exist
     */
    getMetaByKey: (layerKey, throwException = true) => {
        let existingMeta = _self.getMetaData();

        let correspondingLayer = false;
        existingMeta.data.map(layer => {
            if (layer.f_table_schema + `.` + layer.f_table_name === layerKey) {
                correspondingLayer = layer;
                return false;
            }
        });

        if (correspondingLayer) {
            return correspondingLayer;
        } else if (throwException) {
            throw new Error(`Unable to find meta with identifier ${layerKey}`);
        } else {
            return false;
        }
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
     * Get a clone of the full meta data object
     * @returns {Object}
     */
    getMetaData: function () {
        return $.extend(true, {}, metaData);
    },

    /**
     * Get a clone of meta data from latest loaded
     * @returns {Object}
     */
    getMetaDataLatestLoaded: function () {
        return $.extend(true, {}, metaDataLatestLoaded);
    }
};


