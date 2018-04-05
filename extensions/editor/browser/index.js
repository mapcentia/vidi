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

var vectorLayers;

var editor;

/**
 *
 * @type {*|exports|module.exports}
 */
var urlparser = require('./../../../browser/modules/urlparser');

/**
 * @type {string}
 */
var db = urlparser.db;

var isInit = false;


/**
 *
 * @type {{set: module.exports.set, init: module.exports.init}}
 */
module.exports = {

    /**
     *
     * @param o
     * @returns {exports}
     */
    set: function (o) {
        utils = o.utils;
        meta = o.meta;
        cloud = o.cloud;
        sqlQuery = o.sqlQuery;
        backboneEvents = o.backboneEvents;
        vectorLayers = o.extensions.vectorLayers.index;
        return this;
    },

    /**
     *
     */
    init: function () {

        let me = this, metaDataKeys, metaData, styleFn;

        isInit = true;

        // Listen to arrival of add-feature buttons
        $(document).arrive('.gc2-add-feature', function () {
            $(this).on("click", function (e) {
                var t = ($(this).data('gc2-key'));
                if (($(this).data('vector'))) {
                    me.add(t, null, true);
                } else {
                    me.add(t);
                }
                e.stopPropagation();
            });

        });

        // When editing is disabled, close the slide panel with attribute form
        cloud.get().map.on("editable:disable", function () {
            $("#info-modal").animate({
                right: "-" + $("#myNavmenu").width() + "px"
            }, 200)
        });

        // Listen to arrival of edit-tools
        $(document).arrive('.gc2-edit-tools', function () {
            $(this).css("visibility", "visible")

        });

        // Don't init layer tree automatic. Let this module activate it
        vectorLayers.setAutomatic(false);

        backboneEvents.get().on("ready:meta", function () {

            metaDataKeys = meta.getMetaDataKeys();
            metaData = meta.getMetaData();
            metaData.data.map(function (v) {

                let layerName = v.f_table_schema + "." + v.f_table_name;

                if (JSON.parse(v.meta) !== null && typeof JSON.parse(v.meta).vectorstyle !== "undefined") {
                    try {
                        styleFn = eval("(" + JSON.parse(v.meta).vectorstyle + ")");
                    } catch (e) {
                        styleFn = function () {
                        };
                    }
                }

                // Set popup with Edit and Delete buttons
                vectorLayers.setOnEachFeature("v:" + layerName, function (feature, layer) {

                    let popup = L.popup({
                        autoPan: false
                    });

                    layer.on("click", function (e) {

                        popup
                            .setLatLng(e.latlng)
                            .setContent('<button class="btn btn-primary btn-xs ge-start-edit"><i class="fa fa-pencil" aria-hidden="true"></i></button><button class="btn btn-primary btn-xs ge-delete"><i class="fa fa-trash" aria-hidden="true"></i></button>')
                            .openOn(cloud.get().map);

                        $(".ge-start-edit").unbind("click.ge-start-edit").bind("click.ge-start-edit", function () {
                            me.edit(layer, layerName + ".the_geom");
                        });

                        $(".ge-delete").unbind("click.ge-delete").bind("click.ge-delete", function () {
                            if (window.confirm("Are you sure? Changes will not be saved!")) {
                                me.delete(layer, layerName + ".the_geom");
                            }
                        })
                    });
                });

                vectorLayers.setStyle(layerName, styleFn);

            });

            backboneEvents.get().on("ready:vectorLayers", function () {

            });

            vectorLayers.createLayerTree();

        });

    },

    /**
     * Create the attribute form
     * @param fieldConf
     * @param pkey
     * @param f_geometry_column
     * @returns {{}}
     */
    createFormObj: function (fieldConf, pkey, f_geometry_column) {

        let properties = {};

        Object.keys(fieldConf).map(function (key) {

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

    /**
     * Change existing feature
     * @param e
     * @param k
     * @param qstore
     */
    edit: function (e, k, qstore) {

        let React = require('react');

        let ReactDOM = require('react-dom');

        let me = this, schemaQualifiedName = k.split(".")[0] + "." + k.split(".")[1],
            metaDataKeys = meta.getMetaDataKeys(),
            fieldConf = ((metaDataKeys[schemaQualifiedName].fields) ? metaDataKeys[schemaQualifiedName].fields : JSON.parse(metaDataKeys[schemaQualifiedName].fieldconf)),
            properties;
        me.stopEdit();

        e.id = "v:" + metaDataKeys[schemaQualifiedName].f_table_schema + "." + metaDataKeys[schemaQualifiedName].f_table_name;
        e.initialFeatureJSON = e.toGeoJSON();

        markers = []; // Holds marker(s) for Point and MultiPoints layers

        cloud.get().map.closePopup();

        backboneEvents.get().on("start:sqlQuery", function () {
            //me.stopEdit(e);
        });

        // Bind cancel of editing to close of slide panel with attribute form
        $(".slide-right .close").unbind("click.edit").bind("click.edit", function () {

            if (window.confirm("Are you sure? Changes will not be saved!")) {
                me.stopEdit(e);
                sqlQuery.reset(qstore);
                $(".slide-right .close").unbind("click.edit");

            } else {
                return false;
            }
        });

        // Hack to edit (Multi)Point layers
        // Create markers, which can be dragged
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
                editor = e.enableEdit();
                break;
        }

        // Delete som system attributes
        delete e.feature.properties._vidi_content;
        delete e.feature.properties._id;

        // Set NULL values to undefined, because NULL is a type
        Object.keys(e.feature.properties).map(function (key) {
            if (e.feature.properties[key] === null) {
                e.feature.properties[key] = undefined;
            }
        });

        // Create schema for attribute form
        const schema = {
            type: "object",
            properties: this.createFormObj(fieldConf, metaDataKeys[schemaQualifiedName].pkey, metaDataKeys[schemaQualifiedName].f_geometry_column)
        };

        // Slide panel with attributes in and render form component
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

        /**
         * Commit to GC2
         * @param formData
         */
        const onSubmit = function (formData) {

            let GeoJSON = e.toGeoJSON(), featureCollection;

            // HACK to handle (Multi)Point layers
            // Update the GeoJSON from markers
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

            // Set GeoJSON properties from form values
            Object.keys(e.feature.properties).map(function (key) {
                GeoJSON.properties[key] = formData.formData[key];
                // Set undefined values back to NULL
                if (GeoJSON.properties[key] === undefined) {
                    GeoJSON.properties[key] = null;
                }
            });

            // Set the GeoJSON FeatureCollection
            // This is committed to GC2
            featureCollection = {
                "type": "FeatureCollection",
                "features": [
                    GeoJSON
                ]
            };

            // Commit using XHR
            $.ajax({
                url: "/api/feature/" + db + "/" + schemaQualifiedName + "." + metaDataKeys[schemaQualifiedName].f_geometry_column + "/4326",
                type: "PUT",
                dataType: 'json',
                contentType: 'application/json',
                scriptCharset: "utf-8",
                data: JSON.stringify(featureCollection),
                success: function (response) {
                    let l = cloud.get().getLayersByName("v:" + schemaQualifiedName);
                    me.stopEdit(e);
                    sqlQuery.reset(qstore);
                },
                error: function (response) {
                    alert(response.responseText);
                }
            });
        };
    },

    /**
     * Add new features to layer
     * @param k
     * @param qstore
     * @param doNotRemoveEditor
     */
    add: function (k, qstore, doNotRemoveEditor) {

        let me = this, React = require('react'), ReactDOM = require('react-dom'),
            schemaQualifiedName = k.split(".")[0] + "." + k.split(".")[1],
            metaDataKeys = meta.getMetaDataKeys(),
            fieldConf = ((metaDataKeys[schemaQualifiedName].fields) ? metaDataKeys[schemaQualifiedName].fields : JSON.parse(metaDataKeys[schemaQualifiedName].fieldconf)),
            type = metaDataKeys[schemaQualifiedName].type;

        me.stopEdit();

        // Bind cancel of editing to close of slide panel with attribute form
        $(".slide-right .close").unbind("click.add").bind("click.add", function (e) {
            e.stopPropagation();
            if (window.confirm("Are you sure? Changes will not be saved!")) {
                me.stopEdit();
            } else {
                return false;
            }
        });

        // Create schema for attribute form
        const schema = {
            type: "object",
            properties: this.createFormObj(fieldConf, metaDataKeys[schemaQualifiedName].pkey, metaDataKeys[schemaQualifiedName].f_geometry_column)
        };

        // Slide panel with attributes in and render form component
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

        // Start editor with the right type
        if (type === "POLYGON" || type === "MULTIPOLYGON") {
            editor = cloud.get().map.editTools.startPolygon();
        } else if (type === "LINESTRING" || type === "MULTILINESTRING") {
            editor = cloud.get().map.editTools.startPolyline();
        }
        else if (type === "POINT" || type === "MULTIPOINT") {
            editor = cloud.get().map.editTools.startMarker();
        }

        /**
         * Commit to GC2
         * @param formData
         */
        const onSubmit = function (formData) {

            let featureCollection, geoJson = editor.toGeoJSON();

            // Promote MULTI geom
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
                    sqlQuery.reset(qstore);
                    let l = cloud.get().getLayersByName("v:" + schemaQualifiedName);
                    me.stopEdit(l);

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
    },

    /**
     * Delete feature from layer
     * @param e
     * @param k
     * @param qstore
     */
    delete: function (e, k, qstore) {
        let me = this;

        let schemaQualifiedName = k.split(".")[0] + "." + k.split(".")[1],
            metaDataKeys = meta.getMetaDataKeys(),
            GeoJSON = e.toGeoJSON(),
            gid = GeoJSON.properties[metaDataKeys[schemaQualifiedName].pkey];

        // Commit using XHR
        $.ajax({
            url: "/api/feature/" + db + "/" + schemaQualifiedName + "." + metaDataKeys[schemaQualifiedName].f_geometry_column + "/" + gid,
            type: "DELETE",
            dataType: 'json',
            contentType: 'application/json',
            scriptCharset: "utf-8",
            success: function (response) {
                sqlQuery.reset(qstore);
                cloud.get().map.closePopup();
                me.reloadLayer("v:" + schemaQualifiedName);
            },
            error: function (response) {
                alert(response.responseText);
            }
        });
    },

    /**
     * Reloading provided layer.
     * 
     * @param {String} layerId Layer identifier
     */
    reloadLayer: (layerId) => {
        vectorLayers.switchLayer(layerId, false);
        vectorLayers.switchLayer(layerId, true);
    },

    /**
     * Stop editing and clean up
     * @param e
     */
    stopEdit: function (e) {
        let me = this;

        if (e) {
            console.log(e);
            me.reloadLayer(e.id);
        }

        // @todo Remove try
        try {
            cloud.get().map.editTools.stopDrawing();
            cloud.get().map.removeLayer(editor);
        } catch (e) {
            console.log(e);
        }

        try {
            markers.map(function (v, i) {
                markers[i].disableEdit();
                cloud.get().map.removeLayer(markers[i]);
            });
        } catch (e) {
            console.log(e);
        }
    }
};


