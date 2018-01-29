/**
 * @fileoverview Description of file, its uses and information
 * about its dependencies.
 */

'use strict';

/**
 *
 * @type {*|exports|module.exports}
 */
var utils;

var backboneEvents;

var meta;

var jquery = require('jquery');
require('snackbarjs');

var JSONSchemaForm = require("react-jsonschema-form");

const Form = JSONSchemaForm.default;

/**
 *
 * @type {{set: module.exports.set, init: module.exports.init}}
 */
module.exports = {
    set: function (o) {
        utils = o.utils;
        meta = o.meta;
        backboneEvents = o.backboneEvents;
        return this;
    },
    init: function () {

    },

    startEdit: function (e, k) {


        /**
         *
         */
        let React = require('react');

        /**
         *
         */
        let ReactDOM = require('react-dom');

        let schemaQualifiedName = k.split(".")[0] + "." + k.split(".")[1],
            metaDataKeys = meta.getMetaDataKeys(),
            fieldConf = JSON.parse(metaDataKeys[schemaQualifiedName].fieldconf),
            properties = {};

        e.enableEdit();

        delete e.feature.properties._vidi_content;
        Object.keys(e.feature.properties).map(function (key, index) {

            // Set NULL values to undefined, so because NULL is a type
            if (e.feature.properties[key] === null) {
                e.feature.properties[key] = undefined;
            }

            properties[key] = {
                type:
                    (fieldConf[key] !== undefined && fieldConf[key].type === "string") ? "string" :
                        (fieldConf[key] !== undefined && fieldConf[key].type === "int") ? "integer" :
                            "string",
                title: (fieldConf[key] !== undefined && fieldConf[key].alias) || key
            };

            if (fieldConf[key] !== undefined && fieldConf[key].type === "date") {
                properties[key].format = "date-time";
            }
        });

        const schema = {
            //title: "Todo",
            type: "object",
            //required: ["title"],
            properties: properties
        };

        const onSubmit = function (formData) {


            let GeoJSON = e.toGeoJSON();

            Object.keys(e.feature.properties).map(function (key, index) {


                GeoJSON.properties[key] = formData.formData[key];
                if (GeoJSON.properties[key] === undefined) {
                    GeoJSON.properties[key] = null;
                }
            });


            console.log(GeoJSON);

        };


        $("#info-modal.slide-right").animate({
            right: "0"
        }, 200, function () {

            ReactDOM.render((
                <div style={{"padding": "15px"}}>
                    <Form schema={schema}
                          formData={e.feature.properties}
                          onSubmit={onSubmit}
                    />
                </div>
            ), document.getElementById("info-modal-body-wrapper"));

        });
    }
};


