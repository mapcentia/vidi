/*
 * @author     Martin Høgh <mh@mapcentia.com>
 * @copyright  2013-2022 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

'use strict';

/**
 *
 * @type {*|exports|module.exports}
 */
const urlparser = require('./urlparser');

/**
 * @type {string}
 */
const db = urlparser.db;

/**
 * @type {string}
 */
const urlVars = urlparser.urlVars;

/**
 * The full meta data object
 * @type {{data: Array}}
 */
let metaData = {data: []};

/**
 * Object that holds the latest loaded meta data
 * @type {{data: Array}}
 */
let metaDataLatestLoaded;

/**
 *
 * @type {Array}
 */
let metaDataKeys = [];

/**
 *
 * @type {Array}
 */
let metaDataKeysTitle = [];

/**
 *
 * @type {boolean}
 */
let ready = false;

/**
 * @type {string}
 */
let host;

/**
 *
 */
let backboneEvents, stateSnapshots;

let _self = false;

try {
    host = window.gc2host;
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
        stateSnapshots = o.stateSnapshots;

        _self = this;
        return this;
    },

    /**
     *
     * @param str
     * @param doNotLoadExisting
     * @param doNotReset
     * @returns {Promise<any>}
     */
    init: function (str, doNotLoadExisting, doNotReset) {
        let me = this,
            schemataStr = urlparser.schema;

        // Reset
        ready = false;

        /*
            Reset, otherwise it gets duplicated via addMetaData() - adding same meta
            to the array which already contains this meta
        */
        if (!doNotReset) {
            metaData = {data: []};
        }
        $("#layers").append(`<div id="layer-loading-indicator" style="display: flex; width: 100%; justify-content: center;"><div style="width: 150px; display: inline-block">
                <div style="text-align: center">${__(`Loading data`)}</div>
                <div class="progress progress-striped active">
                    <div class="progress-bar" style="width: 100%"></div>
                </div>
            </div>
            </div>`);

        return new Promise(function (resolve, reject) {

            try {

                $('#layer-filter-container').css('pointer-events', 'none').css('opacity', 0.2);
                $('#layers_list').empty();
                /**
                 * Loads meta objects from the backend Meta API
                 *
                 * @param {String} schemataStr Schemata string
                 *
                 * @returns {void}
                 */
                const loadMeta = (schemataStr) => {
                    $.ajax({
                        url: '/api/meta/' + db + '/' + schemataStr,
                        scriptCharset: "utf-8",
                        success: function (response) {
                            if (response.data && response.data.length > 0) {
                                me.addMetaData(response);
                                ready = true;
                                $('#layer-filter-container').css('pointer-events', 'auto').css('opacity', 1.0)
                                resolve(schemataStr);
                            } else {
                                reject();
                            }
                        },
                        error: function (response) {
                            reject();
                            alert(JSON.parse(response.responseText).message);
                        }
                    });
                };

                let schemata;
                if (!doNotLoadExisting) {
                    if (`snapshot` in window.vidiConfig && window.vidiConfig.snapshot && window.vidiConfig.snapshot.indexOf(`state_snapshot_`) === 0) {
                        stateSnapshots.getSnapshotByID(window.vidiConfig.snapshot).then(snapshot => {
                            if (snapshot && snapshot.schema) {
                                loadMeta(snapshot.schema);
                            } else {
                                console.warn(`Unable to get "schema" from snapshot, loading the fallback schemata "${str}"`);
                                loadMeta(str);
                            }
                        }).catch(error => {
                            console.error(`Error occured when getting state snapshot ${window.vidiConfig.snapshot} instead of schemata`);
                            console.error(error);
                            loadMeta(str);
                        });
                    } else {
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

                        loadMeta(schemataStr);
                    }
                } else {
                    loadMeta(str);
                }

            } catch (e) {
                console.error(e);
            }

        });
    },

    /**
     * Shortcut for parsing layer meta
     */
    parseLayerMeta: (layerKey) => {
        let data = _self.getMetaByKey(layerKey);
        let parsedMeta = false;
        if (`meta` in data && data.meta) {
            try {
                parsedMeta = JSON.parse(data.meta);
            } catch (e) {
            }
        }

        return parsedMeta;
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

        for (let i = 0; i < data.data.length; i++) {
            metaDataKeys[data.data[i].f_table_schema + "." + data.data[i].f_table_name] = data.data[i];
            metaDataKeysTitle[data.data[i].f_table_title] = data.data[i].f_table_title ? data.data[i] : null;
        }

        if (numberOfLayersAdded.length > 0) {
            backboneEvents.get().trigger("ready:meta");
        }
    },

    /**
     * Deletes the meta data object
     * @param {String} layerKey Layer key
     */
    deleteMetaData: function (layerKey) {
        if (layerKey in metaDataKeys) {
            delete metaDataKeys[layerKey];
        }

        let deletedIndex = false;
        metaData.data.map((existingMetaLayer, index) => {
            if ((existingMetaLayer.f_table_schema + '.' + existingMetaLayer.f_table_name) === layerKey) {
                deletedIndex = index;
                return false;
            }
        });

        if (deletedIndex === false) {
            console.warn(`Meta data for ${layerKey} was not deleted`);
        } else {
            metaData.data.splice(deletedIndex, 1);
        }
    },

    /**
     * Returns meta object for the specified layer idenfitier
     *
     * @param {String} layerKey Layer identifier
     *
     * @param throwException
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
    getMetaData: function (filter = null) {
        const clone = $.extend(true, {}, metaData)
        if (filter) {
            clone.data = clone.data.filter((e) => {
                if (e.f_table_title && e.f_table_title !== "") {
                    if (e.f_table_title.toLowerCase().includes(filter.toLowerCase())) return true;
                } else {
                    if (e.f_table_name.toLowerCase().includes(filter.toLowerCase())) return true;
                }
            })
        }
        return clone;
    },

    /**
     * Get a clone of meta data from latest loaded
     * @returns {Object}
     */
    getMetaDataLatestLoaded: function () {
        return $.extend(true, {}, metaDataLatestLoaded);
    }
};


