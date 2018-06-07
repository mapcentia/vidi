/**
 * @fileoverview Description of file, its uses and information
 * about its dependencies.
 */

'use strict';

/**
 *
 * @type {*|exports|module.exports}
 */
let APIBridgeSingletone = require('../../../browser/modules/api-bridge');

/**
 *
 * @type {*|exports|module.exports}
 */
var utils;

var backboneEvents;

var layerTree;

var apiBridgeInstance = false;

var meta;
var cloud;
var sqlQuery;

var jquery = require('jquery');
require('snackbarjs');

var multiply = require('geojson-multiply');

var JSONSchemaForm = require("react-jsonschema-form");

var Form = JSONSchemaForm.default;

var markers = [];

var editor;

var switchLayer;

var managePopups = [];

const ImageUploadWidget = require('./ImageUploadWidget');

const widgets = { 'imageupload': ImageUploadWidget };

const EDITOR_FORM_CONTAINER_ID = 'editor-attr-form';

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
        layerTree = o.layerTree;
        switchLayer = o.switchLayer;
        backboneEvents = o.backboneEvents;
        return this;
    },

    /**
     *
     */
    init: function () {
        let me = this, metaDataKeys, metaData, styleFn;
        apiBridgeInstance = APIBridgeSingletone();

        isInit = true;

        // Listen to arrival of add-feature buttons
        $(document).arrive('.gc2-add-feature', function () {
            $(this).on("click", function (e) {
                let isVectorLayer = false;
                if ($(this).closest('.layer-item').find('.js-show-layer-control').data('gc2-layer-type') === 'vector') {
                    isVectorLayer = true;
                }

                var t = ($(this).data('gc2-key'));
                me.add(t, null, true, isVectorLayer);
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
        layerTree.setAutomatic(false);

        backboneEvents.get().on("ready:meta", function () {
            metaDataKeys = meta.getMetaDataKeys();
            metaData = meta.getMetaData();
            metaData.data.map(v => {
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
                layerTree.setOnEachFeature("v:" + layerName, (feature, layer) => {
                    if (feature.meta) {
                        let content = false;
                        let tooltipSettings = {
                            autoClose: false,
                            minWidth: 25,
                            permanent: true
                        };

                        if (feature.meta.apiRecognitionStatus === 'pending') {
                            content = `<div class="js-feature-notification-tooltip">
                                <i class="fa fa-exclamation"></i> ${__(`Pending`)}
                                <span class="js-tooltip-content"></span>
                            </div>`;

                            tooltipSettings.className = `api-bridge-popup-warning`;
                        } else if (feature.meta.apiRecognitionStatus === 'rejected_by_server') {
                            content = `<div class="js-feature-notification-tooltip">
                                <i class="fa fa-exclamation"></i> ${__(`Error`)}
                                <span class="js-tooltip-content"></span>
                            </div>`;

                            tooltipSettings.className = `api-bridge-popup-error`;
                        } else {
                            throw new Error(`Invalid API recognition status value`);
                        }

                        layer.on("add", function (e) {
                            let latLng = false;
                            if (feature.geometry && feature.geometry.type === 'Point') {
                                latLng = layer.getLatLng();
                            } else {
                                let bounds = layer.getBounds();
                                latLng = bounds.getCenter()
                            }

                            let tooltip = L.tooltip(tooltipSettings).setContent(content);
                            layer.bindTooltip(tooltip);
                        });
                    }

                    layer.on("click", function (e) {
                        e.originalEvent.clickedOnFeature = true;

                        let managePopup = L.popup({
                            autoPan: false
                        }).setLatLng(e.latlng).setContent(`<button class="btn btn-primary btn-xs ge-start-edit">
                            <i class="fa fa-pencil" aria-hidden="true"></i>
                        </button>
                        <button class="btn btn-primary btn-xs ge-delete">
                            <i class="fa fa-trash" aria-hidden="true"></i>
                        </button>`).openOn(cloud.get().map);

                        $(".ge-start-edit").unbind("click.ge-start-edit").bind("click.ge-start-edit", function () {
                            me.edit(layer, layerName + ".the_geom", null, true);
                        });

                        $(".ge-delete").unbind("click.ge-delete").bind("click.ge-delete", (e) => {
                            if (window.confirm("Are you sure? Changes will not be saved!")) {
                                me.delete(layer, layerName + ".the_geom", null, true);
                            }
                        });
                    });
                });

                layerTree.setStyle(layerName, styleFn);
            });

            backboneEvents.get().on("ready:layerTree", () => {});

            layerTree.create();
        });
    },

    /**
     * Create the attribute form
     * @param fieldConf
     * @param pkey
     * @param f_geometry_column
     * @returns {{}}
     */
    createFormObj: function (fields, pkey, f_geometry_column, fieldConf) {
        let properties = {};
        let uiSchema = {};

        Object.keys(fields).map(function (key) {
            if (key !== pkey && key !== f_geometry_column) {
                properties[key] = {
                    title: (fields[key] !== undefined && fields[key].alias) || key,
                    type: `string`
                };

                if (fields[key]) {
                    switch (fields[key].type) {
                        case `int`:
                            properties[key].type = `integer`;
                            break;
                        case `date`:
                            properties[key].format = `date-time`;
                            break;
                        case `boolean`:
                            properties[key].type = `boolean`;
                            break;
                        case `bytea`:
                            uiSchema[key] = {
                                'ui:widget': 'imageupload'
                            };

                            break;
                    }
                }

                // Properties have priority over default types
                if (fieldConf[key] && fieldConf[key].properties) {
                    let parsedProperties = JSON.parse(fieldConf[key].properties.replace(/'/g, '"'));
                    if (parsedProperties && parsedProperties.length > 0) {
                        properties[key].enum = parsedProperties;
                    }
                }
            }
        });

        return {
            schema: {
                type: "object",
                properties
            },
            uiSchema
        }
    },


    /**
     * Add new features to layer
     * @param k
     * @param qstore
     * @param doNotRemoveEditor
     */
    add: function (k, qstore, doNotRemoveEditor, isVectorLayer = false) {
        let me = this, React = require('react'), ReactDOM = require('react-dom'),
            schemaQualifiedName = k.split(".")[0] + "." + k.split(".")[1],
            metaDataKeys = meta.getMetaDataKeys(),
            type = metaDataKeys[schemaQualifiedName].type;

        let fields = false;
        if (metaDataKeys[schemaQualifiedName].fields) {
            fields = metaDataKeys[schemaQualifiedName].fields;
        } else {
            throw new Error(`Meta property "fields" can not be empty`);
        }

        let fieldconf = false;
        if (metaDataKeys[schemaQualifiedName].fieldconf) {
            fieldconf = JSON.parse(metaDataKeys[schemaQualifiedName].fieldconf);
        }

        const addFeature = () => {
            me.stopEdit();

            // Bind cancel of editing to close of slide panel with attribute form
            $(".slide-right .close").data("extraClickHandlerIsEnabled", true);
            $(".slide-right .close").unbind("click.add").bind("click.add", function (e) {
                e.stopPropagation();
                if (window.confirm("Are you sure? Changes will not be saved!")) {
                    me.stopEdit();

                    $(".slide-right .close").unbind("click.add");
                    $(".slide-right .close").data("extraClickHandlerIsEnabled", false);
                } else {
                    return false;
                }
            });
  
            // Create schema for attribute form
            let formBuildInformation = this.createFormObj(fields, metaDataKeys[schemaQualifiedName].pkey, metaDataKeys[schemaQualifiedName].f_geometry_column, fieldconf);
            const schema = formBuildInformation.schema;
            const uiSchema = formBuildInformation.uiSchema;

            $("#editor-attr-dialog").animate({
                bottom: "0"
            }, 500, function () {
                $("#editor-attr-dialog" + " .expand-less").show();
                $("#editor-attr-dialog" + " .expand-more").hide();
            });

            // Start editor with the right type
            if (type === "POLYGON" || type === "MULTIPOLYGON") {
                editor = cloud.get().map.editTools.startPolygon();
            } else if (type === "LINESTRING" || type === "MULTILINESTRING") {
                editor = cloud.get().map.editTools.startPolyline();
            } else if (type === "POINT" || type === "MULTIPOINT") {
                editor = cloud.get().map.editTools.startMarker();
            } else {
                throw new Error(`Unable to detect type`);
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

                /**
                 * Feature saving callback
                 * 
                 * @param {Object} result Saving result
                 */
                const featureIsSaved = (result) => {
                    console.log('Editor: featureIsSaved, updating', schemaQualifiedName);

                    sqlQuery.reset(qstore);

                    me.stopEdit();

                    if (isVectorLayer) {
                        layerTree.reloadLayer("v:" + schemaQualifiedName, true);
                    } else {
                        layerTree.reloadLayer(schemaQualifiedName, true);
                    }

                    jquery.snackbar({
                        id: "snackbar-conflict",
                        content: "Feature  stedfæstet",
                        htmlAllowed: true,
                        timeout: 5000
                    });
                };

                $(".slide-right .close").unbind("click.add");
                $(".slide-right .close").data("extraClickHandlerIsEnabled", false);
                apiBridgeInstance.addFeature(featureCollection, db, metaDataKeys[schemaQualifiedName]).then(featureIsSaved).catch(error => {
                    console.log('Editor: error occured while performing addFeature()');
                    throw new Error(error);
                });
            };

            // Slide panel with attributes in and render form component
            $(`#${EDITOR_FORM_CONTAINER_ID}`).empty();
            ReactDOM.render((
                <div style={{"padding": "15px"}}>
                    <Form schema={schema}
                        uiSchema={uiSchema}
                        widgets={widgets}
                        onSubmit={onSubmit}
                    />
                </div>
            ), document.getElementById(EDITOR_FORM_CONTAINER_ID));
        };

        if (isVectorLayer) {
            addFeature();
        } else {
            this.checkIfAppIsOnline().then(addFeature).catch(() => {
                if (confirm('Application is offline, tiles will not be updated. Proceed?')) {
                    addFeature();
                }
            });
        }
    },


    /**
     * Change existing feature
     * @param e
     * @param k
     * @param qstore
     */
    edit: function (e, k, qstore, isVectorLayer = false) {
        const editFeature = () => {
            let React = require('react');

            let ReactDOM = require('react-dom');

            let me = this, schemaQualifiedName = k.split(".")[0] + "." + k.split(".")[1],
                metaDataKeys = meta.getMetaDataKeys(),
                type = metaDataKeys[schemaQualifiedName].type,
                properties;

            let fields = false;
            if (metaDataKeys[schemaQualifiedName].fields) {
                fields = metaDataKeys[schemaQualifiedName].fields;
            } else {
                throw new Error(`Meta property "fields" can not be empty`);
            }

            let fieldconf = false;
            if (metaDataKeys[schemaQualifiedName].fieldconf) {
                fieldconf = JSON.parse(metaDataKeys[schemaQualifiedName].fieldconf);
            }

            me.stopEdit();

            e.id = metaDataKeys[schemaQualifiedName].f_table_schema + "." + metaDataKeys[schemaQualifiedName].f_table_name;
            if (isVectorLayer) {
                e.id = "v:" + e.id;
            }

            e.initialFeatureJSON = e.toGeoJSON();

            backboneEvents.get().on("start:sqlQuery", function () {
                //me.stopEdit(e);
            });

            // Bind cancel of editing to close of slide panel with attribute form
            $(".slide-right .close").data("extraClickHandlerIsEnabled", true);
            $(".slide-right .close").unbind("click.edit").bind("click.edit", function () {
                if (window.confirm("Are you sure? Changes will not be saved!")) {
                    me.stopEdit(e);

                    sqlQuery.reset(qstore);
                    $(".slide-right .close").unbind("click.edit");
                    $(".slide-right .close").data("extraClickHandlerIsEnabled", false);
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
                    editor = markers[0].enableEdit();
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
                        editor = markers[i].enableEdit();

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

            // if (type === "POLYGON" || type === "MULTIPOLYGON") {
            //     editor = cloud.get().map.editTools.startPolygon();
            // } else if (type === "LINESTRING" || type === "MULTILINESTRING") {
            //     editor = cloud.get().map.editTools.startPolyline();
            // } else if (type === "POINT" || type === "MULTIPOINT") {
            //     editor = cloud.get().map.editTools.startMarker();
            // }

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

                const featureIsUpdated = () => {
                    console.log('Editor: featureIsUpdated, isVectorLayer:', isVectorLayer);

                    let l = cloud.get().getLayersByName("v:" + schemaQualifiedName);
                    me.stopEdit(e);
                    sqlQuery.reset(qstore);

                    if (isVectorLayer) {
                        layerTree.reloadLayer("v:" + schemaQualifiedName, true);
                    } else {
                        layerTree.reloadLayer(schemaQualifiedName, true);
                    }
                };

                $(".slide-right .close").unbind("click.edit");
                $(".slide-right .close").data("extraClickHandlerIsEnabled", false);
                apiBridgeInstance.updateFeature(featureCollection, db, metaDataKeys[schemaQualifiedName]).then(featureIsUpdated).catch(error => {
                    console.log('Editor: error occured while performing updateFeature()');
                    throw new Error(error);
                });
            };

            // Create schema for attribute form
            let formBuildInformation = this.createFormObj(fields, metaDataKeys[schemaQualifiedName].pkey, metaDataKeys[schemaQualifiedName].f_geometry_column, fieldconf);
            const schema = formBuildInformation.schema;
            const uiSchema = formBuildInformation.uiSchema;

            cloud.get().map.closePopup();

            $(`#${EDITOR_FORM_CONTAINER_ID}`).empty();
            ReactDOM.render((
                <div style={{"padding": "15px"}}>
                    <Form schema={schema}
                        widgets={widgets}
                        uiSchema={uiSchema}
                        formData={e.feature.properties}
                        onSubmit={onSubmit}
                    />
                </div>
            ), document.getElementById(EDITOR_FORM_CONTAINER_ID));
    
            $("#editor-attr-dialog").animate({
                bottom: "0"
            }, 500, function () {
                $("#editor-attr-dialog" + " .expand-less").show();
                $("#editor-attr-dialog" + " .expand-more").hide();
            });
        };

        let confirmMessage = __(`Application is offline, tiles will not be updated. Proceed?`);
        if (isVectorLayer) {
            editFeature();
        } else {
            this.checkIfAppIsOnline().then(() => {
                if (apiBridgeInstance.offlineModeIsEnforced()) {
                    if (confirm(confirmMessage)) {
                        editFeature();
                    }
                } else {
                    editFeature();
                }
            }).catch(() => {
                if (confirm(confirmMessage)) {
                    editFeature();
                }
            });
        }
    },


    /**
     * Delete feature from layer
     * @param e
     * @param k
     * @param qstore
     */
    delete: function (e, k, qstore, isVectorLayer = false) {
        let me = this;

        let schemaQualifiedName = k.split(".")[0] + "." + k.split(".")[1],
            metaDataKeys = meta.getMetaDataKeys(),
            GeoJSON = e.toGeoJSON(),
            gid = GeoJSON.properties[metaDataKeys[schemaQualifiedName].pkey];

        const deleteFeature = () => {
            const featureIsDeleted = () => {
                console.log('Editor: featureIsDeleted, isVectorLayer:', isVectorLayer);

                sqlQuery.reset(qstore);

                cloud.get().map.closePopup();
                
                if (isVectorLayer) {
                    layerTree.reloadLayer("v:" + schemaQualifiedName, true);
                } else {
                    layerTree.reloadLayer(schemaQualifiedName, true);
                }
            };

            let featureCollection = {
                "type": "FeatureCollection",
                "features": [
                    GeoJSON
                ]
            };

            apiBridgeInstance.deleteFeature(featureCollection, db, metaDataKeys[schemaQualifiedName]).then(featureIsDeleted).catch(error => {
                console.log('Editor: error occured while performing deleteFeature()');
                throw new Error(error);
            });
        };

        let confirmMessage = __(`Application is offline, tiles will not be updated. Proceed?`);
        if (isVectorLayer) {
            deleteFeature();
        } else {
            this.checkIfAppIsOnline().then(() => {
                if (apiBridgeInstance.offlineModeIsEnforced()) {
                    if (confirm(confirmMessage)) {
                        deleteFeature();
                    }
                } else {
                    deleteFeature();
                }
            }).catch(() => {
                if (confirm(confirmMessage)) {
                    deleteFeature();
                }
            });
        }
    },

    /**
     * Stop editing and clean up
     * @param e
     */
    stopEdit: function (editedFeature) {
        let me = this;

        cloud.get().map.editTools.stopDrawing();

        if (editor) {
            cloud.get().map.removeLayer(editor);
        }

        // If feature was edited, then reload the layer
        if (editedFeature) {
            switchLayer.init(editedFeature.id, false);
            switchLayer.init(editedFeature.id, true);
        }

        if (markers) {
            markers.map(function (v, i) {
                markers[i].disableEdit();
                cloud.get().map.removeLayer(markers[i]);
            });
        }

        // Close the attribut dialog
        $("#editor-attr-dialog").animate({
            bottom: "-100%"
        }, 500, function () {
            $("#editor-attr-dialog .expand-less").show();
            $("#editor-attr-dialog .expand-more").hide();
        });
    },

    /**
     * Checks if application is online.
     */
    checkIfAppIsOnline: () => {
        let result = new Promise((resolve, reject) => {
            $.ajax({
                method: 'GET',
                url: '/connection-check.ico'
            }).done((data, textStatus, jqXHR) => {
                if (jqXHR.statusText === 'ONLINE') {
                    resolve();
                } else if (jqXHR.statusText === 'OFFLINE') {
                    reject();
                } else {
                    console.warn(`Unable the determine the online status`);
                    reject();
                }
            });
        });

        return result;
    },
};


