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

var multiply = require('geojson-multiply');

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
        var me = this;
    },

    createFormObj: function (fieldConf, pkey, f_geometry_column) {

        var properties = {};

        Object.keys(fieldConf).map(function (key, index) {

            if (key !== pkey && key !== f_geometry_column)
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

        return properties;
    },

    edit: function (e, k, qstore) {

        let React = require('react');

        let ReactDOM = require('react-dom');

        let me = this, schemaQualifiedName = k.split(".")[0] + "." + k.split(".")[1],
            metaDataKeys = meta.getMetaDataKeys(),
            fieldConf = JSON.parse(metaDataKeys[schemaQualifiedName].fieldconf),
            properties;

        markers = [];

        cloud.get().map.closePopup();

        backboneEvents.get().on("start:sqlQuery", function () {
            me.stopEdit(e);
        });

        $(".slide-right .close").unbind("click.edit").bind("click.edit", function (e) {

            if (window.confirm("Er du sikker? Dine ændringer vil ikke blive gemt!")) {
                me.stopEdit(e);
                sqlQuery.reset(qstore);
                $(".slide-right .close").unbind("click.edit");

            } else {
                return false;
            }
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

                markers[0].enableEdit();
                sqlQuery.reset(qstore);


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

        Object.keys(e.feature.properties).map(function (key, index) {
            // Set NULL values to undefined, so because NULL is a type
            if (e.feature.properties[key] === null) {
                e.feature.properties[key] = undefined;
            }
        });

        properties = this.createFormObj(fieldConf, metaDataKeys[schemaQualifiedName].pkey, metaDataKeys[schemaQualifiedName].f_geometry_column);

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

            $.ajax({
                url: "/api/feature/" + db + "/" + schemaQualifiedName + "." + metaDataKeys[schemaQualifiedName].f_geometry_column + "/4326",
                type: "PUT",
                dataType: 'json',
                contentType: 'application/json',
                scriptCharset: "utf-8",
                data: JSON.stringify(featureCollection),
                success: function (response) {
                    var l = cloud.get().getLayersByName(schemaQualifiedName);
                    me.stopEdit(e);
                    sqlQuery.reset(qstore);
                    l.redraw();
                },
                error: function (response) {
                    alert(response.responseText);
                }
            });
        };

        const schema = {
            //title: "Todo",
            type: "object",
            //required: ["title"],
            properties: properties
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
            ), document.getElementById("info-modal-body"));

        });
    },

    delete: function (e, k, qstore) {
        let schemaQualifiedName = k.split(".")[0] + "." + k.split(".")[1],
            metaDataKeys = meta.getMetaDataKeys(),
            GeoJSON = e.toGeoJSON(),
            gid = GeoJSON.properties[metaDataKeys[schemaQualifiedName].pkey];

        $.ajax({
            url: "/api/feature/" + db + "/" + schemaQualifiedName + "." + metaDataKeys[schemaQualifiedName].f_geometry_column + "/" + gid,
            type: "DELETE",
            dataType: 'json',
            contentType: 'application/json',
            scriptCharset: "utf-8",
            success: function (response) {
                sqlQuery.reset(qstore);
                let l = cloud.get().getLayersByName(schemaQualifiedName);
                l.redraw();
            },
            error: function (response) {
                alert(response.responseText);
            }
        });
    },

    add: function (k, qstore) {

        let React = require('react');

        let ReactDOM = require('react-dom');

        let schemaQualifiedName = k.split(".")[0] + "." + k.split(".")[1],
            metaDataKeys = meta.getMetaDataKeys(),
            fieldConf = JSON.parse(metaDataKeys[schemaQualifiedName].fieldconf),
            type = metaDataKeys[schemaQualifiedName].type,
            editor, properties;

        $(".slide-right .close").unbind("click.add").bind("click.add", function (e) {

            e.stopPropagation();

            if (window.confirm("Er du sikker? Dine ændringer vil ikke blive gemt!")) {
                cloud.get().map.editTools.stopDrawing();
                editor.disableEdit();
                cloud.get().map.removeLayer(editor);
            } else {
                return false;
            }

        });

        properties = this.createFormObj(fieldConf, metaDataKeys[schemaQualifiedName].pkey, metaDataKeys[schemaQualifiedName].f_geometry_column);

        const onSubmit = function (formData) {

            let featureCollection, geoJson = editor.toGeoJSON();

            if (type.substring(0, 5) === "MULTI") {
                geoJson = multiply([geoJson]);
            }

            Object.keys(formData.formData).map(function (key, index) {
                geoJson.properties[key] = formData.formData[key];
                if (geoJson.properties[key] === undefined) {
                    geoJson.properties[key] = null;
                }
            });

            featureCollection = {
                "type": "FeatureCollection",
                "features": [
                    geoJson
                ]
            };

            $.ajax({
                url: "/api/feature/" + db + "/" + schemaQualifiedName + "." + metaDataKeys[schemaQualifiedName].f_geometry_column + "/4326",
                type: "POST",
                dataType: 'json',
                contentType: 'application/json',
                scriptCharset: "utf-8",
                data: JSON.stringify(featureCollection),
                success: function (response) {
                    let l = cloud.get().getLayersByName(schemaQualifiedName);
                    l.redraw();
                    cloud.get().map.removeLayer(editor);
                    jquery.snackbar({
                        id: "snackbar-conflict",
                        content: "Entity  stedfæstet",
                        htmlAllowed: true,
                        timeout: 5000
                    });
                },
                error: function (response) {
                    alert(response.responseText);
                }
            });
        };

        const schema = {
            type: "object",
            properties: properties
        };

        $("#info-modal.slide-right").animate({
            right: "0"
        }, 200, function () {

            ReactDOM.render((
                <div style={{"padding": "15px"}}>
                    <Form schema={schema}
                          onSubmit={onSubmit}
                    />
                </div>
            ), document.getElementById("info-modal-body"));

        });

        if (type === "POLYGON" || type === "MULTIPOLYGON") {

            editor = cloud.get().map.editTools.startPolygon();

        } else if (type === "LINESTRING" || type === "MULTILINESTRING") {

            editor = cloud.get().map.editTools.startPolyline();
        }
        else if (type === "POINT" || type === "MULTIPOINT") {

            editor = cloud.get().map.editTools.startMarker();
        }

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


