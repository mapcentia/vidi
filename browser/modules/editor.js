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
var cloud;
var sqlQuery;

var jquery = require('jquery');
require('snackbarjs');

var JSONSchemaForm = require("react-jsonschema-form");

var Form = JSONSchemaForm.default;

var markers;

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
 *
 * @type {{set: module.exports.set, init: module.exports.init}}
 */
module.exports = {
    set: function (o) {
        utils = o.utils;
        meta = o.meta;
        cloud = o.cloud;
        sqlQuery = o.sqlQuery;
        backboneEvents = o.backboneEvents;
        return this;
    },
    init: function () {

    },

    startEdit: function (e, k, qstore) {

        var me = this;

        markers = [];

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

        console.log(e);
        console.log(metaDataKeys);

        cloud.get().map.closePopup();

        backboneEvents.get().on("start:sqlQuery", function () {
            me.stopEdit(e);
        });

        $(".slide-right .close").on("click", function () {
            me.stopEdit(e);
        });

        switch (e.feature.geometry.type) {
            case "Point":

                markers[0] = L.marker(
                    e.getLatLng(),
                    {
                        icon: L.AwesomeMarkers.icon({
                                icon: 'arrows',
                                markerColor: 'blue',
                                prefix: 'fa'
                            }
                        )
                    }
                ).addTo(cloud.get().map);

                sqlQuery.reset();

                markers[0].enableEdit(qstore);

                break;

            case "MultiPoint":

                e.feature.geometry.coordinates.map(function (v, i) {

                    markers[i] = L.marker(
                        [v[1], v[0]],
                        {
                            icon: L.AwesomeMarkers.icon({
                                    icon: 'arrows',
                                    markerColor: 'blue',
                                    prefix: 'fa'
                                }
                            )
                        }
                    ).addTo(cloud.get().map);


                    markers[i].enableEdit();

                });
                sqlQuery.reset(qstore);

                break;

            default:

                e.enableEdit();

                break;
        }

        delete e.feature.properties._vidi_content;
        delete e.feature.properties._id;
        //delete e.feature.properties.gid;

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

            switch (e.feature.geometry.type) {
                case "Point":

                    GeoJSON.geometry.coordinates = [markers[0].getLatLng().lng, markers[0].getLatLng().lat];

                    break;

                case "MultiPoint":

                    markers.map(function (v, i) {
                        GeoJSON.geometry.coordinates[i] = [markers[i].getLatLng().lng, markers[i].getLatLng().lat];
                    });

                    break;

                default:

                    //pass

                    break;
            }


            Object.keys(e.feature.properties).map(function (key, index) {
                GeoJSON.properties[key] = formData.formData[key];
                if (GeoJSON.properties[key] === undefined) {
                    GeoJSON.properties[key] = null;
                }
            });

            var featureCollection = {
                "type": "FeatureCollection",
                "features": [
                    GeoJSON
                ]
            };
            console.log(schemaQualifiedName);

            $.ajax({
                url: "/api/feature/" + db + "/" + schemaQualifiedName + "." + metaDataKeys[schemaQualifiedName].f_geometry_column + "/4326",
                type: "PUT",
                dataType: 'json',
                contentType: 'application/json',
                scriptCharset: "utf-8",
                data: JSON.stringify(featureCollection),
                success: function (response) {
                    var l = cloud.get().getLayersByName(schemaQualifiedName);
                    l.redraw();
                },
                error: function (response) {
                    alert(response.responseText);
                }
            });
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
    },

    stopEdit: function (e) {
        try {
            e.disableEdit();
        } catch (e) {

        }
        markers.map(function (v, i) {
            markers[i].disableEdit();
            cloud.get().map.removeLayer(markers[i]);

        });
    }
};


