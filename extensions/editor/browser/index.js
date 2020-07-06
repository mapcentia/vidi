/*
 * @author     Alexander Shumilov
 * @copyright  2013-2018 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

'use strict';

import {LAYER, SYSTEM_FIELD_PREFIX} from '../../../browser/modules/layerTree/constants';

/**
 *
 * @type {*|exports|module.exports}
 */
let APIBridgeSingletone = require('../../../browser/modules/api-bridge');

let PANEL_DOCKING_PARAMETER = 1024;

/**
 *
 * @type {*|exports|module.exports}
 */
let utils, backboneEvents, layerTree, meta, cloud, sqlQuery, layers;

let apiBridgeInstance = false;

let multiply = require('geojson-multiply');
let moment = require('moment');

let JSONSchemaForm = require("react-jsonschema-form");

let Form = JSONSchemaForm.default;

let markers = [];

let editor;

let editedFeature = false;

let featureWasEdited = false;

let nonCommitedEditedFeature = false;

let switchLayer;

let managePopups = [];

const ImageUploadWidget = require('./ImageUploadWidget');

const widgets = {'imageupload': ImageUploadWidget};

const MODULE_NAME = `editor`;
const EDITOR_FORM_CONTAINER_ID = 'editor-attr-form';
const EDITOR_CONTAINER_ID = 'editor-attr-dialog';

const serviceWorkerCheck = () => {
    if (('serviceWorker' in navigator) === false || !navigator.serviceWorker || !navigator.serviceWorker.controller) {
        const message = __(`The page was loaded without service workers enabled, features editing is not available (the page was loaded via plain HTTP or browser does not support service workers)`);
        console.warn(message);
        alert(message);
    }
};

/**
 *
 * @type {*|exports|module.exports}
 */
let urlparser = require('./../../../browser/modules/urlparser');

/**
 * @type {string}
 */
let db = urlparser.db;

let embedIsEnabled = false;

let _self = false;

let vectorLayers;

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
        layers = o.layers;
        layerTree = o.layerTree;
        switchLayer = o.switchLayer;
        backboneEvents = o.backboneEvents;

        _self = this;
        try {
            vectorLayers = o.extensions.vectorLayers.index;
        } catch (e) {
        }
        return this;
    },

    /**
     *
     */
    init: function () {
        if (`watsonc` in window.vidiConfig.enabledExtensions) {
            console.log(`Editor extension is disabled due to the enabled watsonc`);
            return;
        }

        if (vidiConfig.enabledExtensions.indexOf(`embed`) !== -1) {
            embedIsEnabled = true;
        }

        apiBridgeInstance = APIBridgeSingletone();

        // Listen to arrival of add-feature buttons
        $(document).arrive('.gc2-add-feature', {
            existing: true
        }, function () {
            $(this).on("click", function (e) {
                let isVectorLayer = false;
                if ($(this).closest('.layer-item').find('.js-show-layer-control').data('gc2-layer-type') === LAYER.VECTOR) {
                    isVectorLayer = true;
                }

                var t = ($(this).data('gc2-key'));
                _self.add(t, null, true, isVectorLayer);
                e.stopPropagation();
            });
        });

        // Listen to close of attr box
        $(".editor-attr-dialog__close-hide").on("click", function (e) {
            _self.stopEdit(editedFeature);
            backboneEvents.get().trigger("sqlQuery:clear");
        });

        $(".editor-attr-dialog__expand-less").on("click", function () {
            $("#" + EDITOR_CONTAINER_ID).animate({
                bottom: (($("#" + EDITOR_CONTAINER_ID).height() * -1) + 30) + "px"
            }, 500, function () {
                $(".editor-attr-dialog__expand-less").hide();
                $(".editor-attr-dialog__expand-more").show();
            });
        });

        $(".editor-attr-dialog__expand-more").on("click", function () {
            $("#" + EDITOR_CONTAINER_ID).animate({
                bottom: "0"
            }, 500, function () {
                $(".editor-attr-dialog__expand-less").show();
                $(".editor-attr-dialog__expand-more").hide();
            });
        });

        backboneEvents.get().on("ready:meta", function () {
            _self.setHandlersForVectorLayers();
        });

        /*
            By this time the meta is already loaded and the layerTree is already built,
            so handlers need to be set up manually.
        */
        _self.setHandlersForVectorLayers();
    },

    setHandlersForVectorLayers: () => {
        let metaDataKeys = meta.getMetaDataKeys();
        let metaData = meta.getMetaData();
        metaData.data.map(v => {
            let layerName = v.f_table_schema + "." + v.f_table_name;

            let layerMeta = false;
            if (v.meta) {
                try {
                    layerMeta = JSON.parse(v.meta);
                } catch (e) {
                    console.warn(`Unable to parse meta for ${layerName}`);
                }
            }

            if (layerMeta && layerMeta.vidi_layer_editable) {
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
                            tooltipSettings.className = `api-bridge-popup-warning`;

                            content = `<div class="js-feature-notification-tooltip">
                                <i class="fa fa-exclamation"></i> ${__(`Awaiting network`)}
                                <span class="js-tooltip-content"></span>
                            </div>`;
                        } else if (feature.meta.apiRecognitionStatus === 'rejected_by_server') {
                            tooltipSettings.className = `api-bridge-popup-error`;

                            if (feature.meta.serverErrorType) {
                                if (feature.meta.serverErrorType === `REGULAR_ERROR`) {
                                    content = `<div class="js-feature-notification-tooltip">
                                        <i class="fa fa-exclamation"></i> ${__(`Error`)}
                                        <span class="js-tooltip-content"></span>
                                    </div>`;
                                } else if (feature.meta.serverErrorType === `AUTHORIZATION_ERROR`) {
                                    tooltipSettings.className = `api-bridge-popup-warning`;
                                    content = `<div class="js-feature-notification-tooltip">
                                        <i class="fa fa-exclamation"></i> ${__(`Awaiting login`)}
                                        <span class="js-tooltip-content"></span>
                                    </div>`;
                                } else {
                                    throw new Error(`Invalid API error type value`);
                                }
                            } else {
                                content = `<div class="js-feature-notification-tooltip">
                                    <i class="fa fa-exclamation"></i> ${__(`Error`)}
                                    <span class="js-tooltip-content"></span>
                                </div>`;
                            }
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
                }, MODULE_NAME);
            }

            let styleFn = () => {
            };
            if (layerMeta && layerMeta.vectorstyle !== "undefined") {
                try {
                    styleFn = eval("(" + layerMeta.vectorstyle + ")");
                } catch (e) {
                }
            }

            layerTree.setStyle(layerName, styleFn);
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
        let required = [];
        let properties = {};
        let uiSchema = {};

        Object.keys(fields).map(function (key) {
            if (key !== pkey && key !== f_geometry_column && (key.indexOf(SYSTEM_FIELD_PREFIX) !== 0 || (typeof fieldConf[key] !== "undefined" && fieldConf[key].querable === true))) {
                let title = key;
                if (fieldConf[key] !== undefined && fieldConf[key].alias) {
                    title = fieldConf[key].alias;
                }

                properties[key] = {title, type: `string`};

                if (fields[key].is_nullable !== true) {
                    required.push(key);
                }

                if (fields[key]) {
                    switch (fields[key].type) {
                        case `int`:
                        case `integer`:
                            properties[key].type = `integer`;
                            break;
                        case `double precision`:
                            properties[key].type = `number`;
                            break;
                        case `date`:
                            uiSchema[key] = {
                                'ui:widget': 'date'
                            };
                            break;
                        case `timestamp without time zone`:
                            uiSchema[key] = {
                                'ui:widget': 'datetime'
                            };
                            properties[key].default = moment().format("YYYY-MM-DDTHH:mm"); // Default is required in IOS Safari
                            break;
                        case `timestamp with time zone`:
                            uiSchema[key] = {
                                'ui:widget': 'datetime'
                            };
                            properties[key].default = moment().format("YYYY-MM-DDTHH:mmZ"); // Default is required in IOS Safari
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
                    let parsedProperties = false;
                    try {
                        parsedProperties = JSON.parse(fieldConf[key].properties.replace(/'/g, '"'));
                    } catch (e) {
                        console.warn(`"properties" of the ${key} field is not a valid JSON`);
                    }

                    if (parsedProperties) {
                        if (Array.isArray(parsedProperties) && parsedProperties.length > 0) {
                            properties[key].enum = parsedProperties;
                        } else {
                            let enumNames = [];
                            let enumValues = [];
                            for (let enumName in parsedProperties) {
                                enumNames.push(enumName);
                                enumValues.push(parsedProperties[enumName]);
                            }

                            if (enumNames.length === enumValues.length) {
                                properties[key].enumNames = enumNames;
                                properties[key].enum = enumValues;
                            }
                        }
                    }
                }
            }
        });

        return {
            schema: {
                type: "object",
                required,
                properties
            },
            uiSchema
        };
    },


    /**
     * Add new features to layer
     * @param k
     * @param qstore
     * @param doNotRemoveEditor
     */
    add: function (k, qstore, doNotRemoveEditor, isVectorLayer = false) {
        editedFeature = false;

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
            serviceWorkerCheck();

            me.stopEdit();

            // Create schema for attribute form
            let formBuildInformation = this.createFormObj(fields, metaDataKeys[schemaQualifiedName].pkey, metaDataKeys[schemaQualifiedName].f_geometry_column, fieldconf);
            const schema = formBuildInformation.schema;
            const uiSchema = formBuildInformation.uiSchema;

            _self.enableSnapping(type, false);

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

                    switchLayer.registerLayerDataAlternation(schemaQualifiedName);

                    sqlQuery.reset(qstore);

                    me.stopEdit();

                    // Reloading only vector layers, as uncommited changes can be displayed only for vector layers
                    if (isVectorLayer) {
                        layerTree.reloadLayer("v:" + schemaQualifiedName, true);
                    }

                    $.snackbar({
                        id: "snackbar-conflict",
                        content: "Feature  stedfæstet",
                        htmlAllowed: true,
                        timeout: 5000
                    });
                };

                apiBridgeInstance.addFeature(featureCollection, db, metaDataKeys[schemaQualifiedName]).then(featureIsSaved).catch(error => {
                    console.log('Editor: error occured while performing addFeature()');
                    throw new Error(error);
                });
            };

            // Slide panel with attributes in and render form component
            ReactDOM.unmountComponentAtNode(document.getElementById(EDITOR_FORM_CONTAINER_ID));
            ReactDOM.render((
                <div style={{"padding": "15px"}}>
                    <Form
                        className="feature-attribute-editing-form"
                        schema={schema} noHtml5Validate
                        uiSchema={uiSchema}
                        widgets={widgets}
                        onSubmit={onSubmit}>
                        <div className="buttons">
                            <button type="submit" className="btn btn-info">Submit</button>
                        </div>
                    </Form>
                </div>
            ), document.getElementById(EDITOR_FORM_CONTAINER_ID));

            _self.openAttributesDialog();
        };

        let confirmMessage = __(`Application is offline, tiles will not be updated. Proceed?`);
        if (isVectorLayer) {
            addFeature();
        } else {
            this.checkIfAppIsOnline().then(() => {
                if (apiBridgeInstance.offlineModeIsEnforcedForLayer(schemaQualifiedName)) {
                    if (confirm(confirmMessage)) {
                        addFeature();
                    }
                } else {
                    addFeature();
                }
            }).catch(() => {
                if (confirm(confirmMessage)) {
                    addFeature();
                }
            });
        }
    },

    /**
     * Enables snapping for created / edited feature
     *
     * @param {String}  geometryType        Geometry type of created / edited feature
     * @param {Boolean} featureAlreadyExist Specifies if feature already exists
     * @param {String}  enabledLayerName    Specifies what layer is enabled for snapping
     * @param {String}  enabledFeatureId    Specifies what layer feature identifier is enabled for snapping
     */
    enableSnapping: function (geometryType, featureAlreadyExist = true, enabledFeature = false) {
        let guideLayers = [];
        layers.getMapLayers().map(layer => {
            if (`id` in layer && layer.id && layer.id.indexOf(`v:`) === 0 && guideLayers.indexOf(layer.id) === -1) {
                if (`_layers` in layer) {
                    guideLayers.push(layer);
                }
            }
        });

        // Enabling snapping only if there are visible vector layers
        if (guideLayers.length > 0) {
            if (geometryType.toLowerCase() === `point` && featureAlreadyExist) {
                markers[0].snapediting = new L.Handler.MarkerSnap(cloud.get().map, markers[0]);
                guideLayers.map(layer => {
                    markers[0].snapediting.addGuideLayer(layer);
                });
                markers[0].snapediting.enable();
            } else {
                if (enabledFeature) {
                    enabledFeature._snapping_active = true;
                }

                var snap = new L.Handler.MarkerSnap(cloud.get().map);
                guideLayers.map(layer => {
                    snap.addGuideLayer(layer);
                });
                var snapMarker = L.marker(cloud.get().map.getCenter(), {
                    icon: cloud.get().map.editTools.createVertexIcon({className: 'leaflet-div-icon leaflet-drawing-icon'}),
                    opacity: 1,
                    zIndexOffset: 1000
                });

                if (featureAlreadyExist === false) snap.watchMarker(snapMarker);

                cloud.get().map.on('editable:vertex:dragstart', function (e) {
                    snap.watchMarker(e.vertex);
                });
                cloud.get().map.on('editable:vertex:dragend', function (e) {
                    snap.unwatchMarker(e.vertex);
                });
                cloud.get().map.on('editable:drawing:start', function () {
                    this.on('mousemove', followMouse);
                });
                cloud.get().map.on('editable:drawing:end', function () {
                    this.off('mousemove', followMouse);
                    snapMarker.remove();
                });
                cloud.get().map.on('editable:drawing:click', function (e) {
                    // Leaflet copy event data to another object when firing,
                    // so the event object we have here is not the one fired by
                    // Leaflet.Editable; it's not a deep copy though, so we can change
                    // the other objects that have a reference here.
                    var latlng = snapMarker.getLatLng();
                    e.latlng.lat = latlng.lat;
                    e.latlng.lng = latlng.lng;
                });

                snapMarker.on('snap', function (e) {
                    snapMarker.addTo(cloud.get().map);
                });
                snapMarker.on('unsnap', function (e) {
                    snapMarker.remove();
                });
                var followMouse = function (e) {
                    snapMarker.setLatLng(e.latlng);
                }
            }
        }
    },

    // @todo the initial value is not parsed as number

    /**
     * Removes duplicates from polygon data (duplicate is two or more consecutive vertices with same coordinates)
     *
     * @param {Object} geoJSON GeoJSON data
     *
     * @returns {Object}
     */
    removeDuplicates: function (geoJSON) {
        geoJSON.geometry.coordinates.map((polygon, index) => {
            let result = [];
            let polygonCoordinates = polygon;

            let hashTable = {};
            polygonCoordinates.map(coordinates => {
                let key = (coordinates[0] + `:` + coordinates[1]);
                if (key in hashTable === false) {
                    result.push(coordinates);
                    hashTable = {};
                    hashTable[key] = true;
                }
            });

            geoJSON.geometry.coordinates[index] = result;
        });

        return geoJSON;
    },

    /**
     * Change existing feature
     * @param e
     * @param k
     * @param qstore
     */
    edit: function (e, k, qstore, isVectorLayer = false) {
        editedFeature = e;
        nonCommitedEditedFeature = {};
        const editFeature = () => {
            serviceWorkerCheck();

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

            e.on(`editable:editing`, () => {
                featureWasEdited = true;
            });

            e.id = metaDataKeys[schemaQualifiedName].f_table_schema + "." + metaDataKeys[schemaQualifiedName].f_table_name;
            if (isVectorLayer) {
                e.id = "v:" + e.id;
            }

            e.initialFeatureJSON = e.toGeoJSON();

            featureWasEdited = false;
            // Hack to edit (Multi)Point layers
            // Create markers, which can be dragged
            switch (e.feature.geometry.type) {
                case "Point":
                    markers[0] = L.marker(
                        e.getLatLng(),
                        {
                            icon: L.AwesomeMarkers.icon({
                                    icon: 'arrows-alt',
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
                                        icon: 'arrows-alt',
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

            _self.enableSnapping(e.feature.geometry.type, true, e);

            // Delete some system attributes
            let eventFeatureCopy = JSON.parse(JSON.stringify(e.feature));
            delete eventFeatureCopy.properties._vidi_content;
            delete eventFeatureCopy.properties._id;

            // Set NULL values to undefined, because NULL is a type
            Object.keys(eventFeatureCopy.properties).map(key => {
                if (eventFeatureCopy.properties[key] === null) {
                    eventFeatureCopy.properties[key] = undefined;
                }
            });
            console.log(eventFeatureCopy);

            // Transform field values according to their types
            Object.keys(fields).map(key => {
                switch (fields[key].type) {
                    case `double precision`:
                        if (eventFeatureCopy.properties[key]) {
                            eventFeatureCopy.properties[key] = parseFloat(eventFeatureCopy.properties[key]);
                        }
                    default:
                        break;
                }
            });

            /**
             * Commit to GC2
             * @param formData
             */
            const onSubmit = (formData) => {
                let GeoJSON = e.toGeoJSON(), featureCollection;
                delete GeoJSON.properties._vidi_content;
                delete GeoJSON.properties._id;

                // HACK to handle (Multi)Point layers
                // Update the GeoJSON from markers
                switch (eventFeatureCopy.geometry.type) {
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
                Object.keys(eventFeatureCopy.properties).map(function (key) {
                    if (!key.startsWith("gc2_")) {
                        GeoJSON.properties[key] = formData.formData[key];
                        // Set undefined values back to NULL
                        if (GeoJSON.properties[key] === undefined) {
                            GeoJSON.properties[key] = null;
                        }
                    } else {
                        // Remove system fields, which should not be updated by the user
                        delete GeoJSON.properties[key];
                    }
                });

                if (eventFeatureCopy.geometry.type === `Polygon`) {
                    GeoJSON = _self.removeDuplicates(GeoJSON);
                }

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

                    switchLayer.registerLayerDataAlternation(schemaQualifiedName);

                    sqlQuery.reset(qstore);
                    me.stopEdit();

                    // Reloading only vector layers, as uncommited changes can be displayed only for vector layers
                    if (isVectorLayer) {
                        layerTree.reloadLayer("v:" + schemaQualifiedName, true);
                    }
                };

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
            ReactDOM.unmountComponentAtNode(document.getElementById(EDITOR_FORM_CONTAINER_ID));
            /*for (let key in schema.properties) {
                if (key in eventFeatureCopy.properties && eventFeatureCopy.properties[key]) {
                    eventFeatureCopy.properties[key] = `` + eventFeatureCopy.properties[key];
                }
            }*/
            let eventFeatureParsed = {};
            for (let [key, value] of Object.entries(eventFeatureCopy.properties)) {
                if (fields[key].type.includes("timestamp with time zone")) {
                    value = value ? moment(value).format("YYYY-MM-DDTHH:mmZ") : moment().format("YYYY-MM-DDTHH:mmZ"); // Default is required in IOS Safari
                    console.log(value);
                } else if (fields[key].type.includes("timestamp without time zone")) {
                    value = value ? moment(value).format("YYYY-MM-DDTHH:mm") : moment().format("YYYY-MM-DDTHH:mm"); // Default is required in IOS Safari
                    console.log(value);
                }
                eventFeatureParsed[key] = value;
            }
            ReactDOM.render((
                <div style={{"padding": "15px"}}>
                    <Form
                        className="feature-attribute-editing-form"
                        schema={schema} noHtml5Validate
                        widgets={widgets}
                        uiSchema={uiSchema}
                        formData={eventFeatureParsed}
                        onSubmit={onSubmit}>
                        <div className="buttons">
                            <button type="submit" className="btn btn-info">Submit</button>
                        </div>
                    </Form>
                </div>
            ), document.getElementById(EDITOR_FORM_CONTAINER_ID));

            _self.openAttributesDialog();
        };

        let confirmMessage = __(`Application is offline, tiles will not be updated. Proceed?`);
        if (isVectorLayer) {
            editFeature();
        } else {
            this.checkIfAppIsOnline().then(() => {
                if (`id` in editedFeature && apiBridgeInstance.offlineModeIsEnforcedForLayer(editedFeature.id.replace(`v:`, ``))) {
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
     * Opens attribute dialog depending on page width and height
     *
     * @returns {void}
     */
    openAttributesDialog: () => {
        if (embedIsEnabled && ($(window).width() < PANEL_DOCKING_PARAMETER || $(window).height() < (PANEL_DOCKING_PARAMETER / 2))) {
            $("#" + EDITOR_CONTAINER_ID).animate({
                bottom: (($("#" + EDITOR_CONTAINER_ID).height() * -1) + 30) + "px"
            }, 500, () => {
                $(".editor-attr-dialog__expand-less").hide();
                $(".editor-attr-dialog__expand-more").show();
            });

            $('#layer-slide').find('.close').trigger('click');
        } else {
            $("#" + EDITOR_CONTAINER_ID).animate({
                bottom: "0"
            }, 500, () => {
                $(".editor-attr-dialog__expand-less").show();
                $(".editor-attr-dialog__expand-more").hide();
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
        editedFeature = false;

        let me = this;

        let schemaQualifiedName = k.split(".")[0] + "." + k.split(".")[1],
            metaDataKeys = meta.getMetaDataKeys(),
            GeoJSON = e.toGeoJSON();

        const deleteFeature = () => {
            serviceWorkerCheck();

            const featureIsDeleted = () => {
                console.log('Editor: featureIsDeleted, isVectorLayer:', isVectorLayer);

                sqlQuery.reset(qstore);

                cloud.get().map.closePopup();

                // Reloading only vector layers, as uncommited changes can be displayed only for vector layers
                if (isVectorLayer) {
                    layerTree.reloadLayer("v:" + schemaQualifiedName, true);
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
                if (apiBridgeInstance.offlineModeIsEnforcedForLayer(schemaQualifiedName)) {
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
        cloud.get().map.editTools.stopDrawing();

        if (editor) {
            cloud.get().map.removeLayer(editor);
        }

        // If feature was edited, then reload the layer
        if (editedFeature) {
            if (`snapediting` in editedFeature && editedFeature.snapediting) {
                editedFeature.snapediting.disable();
            }

            // No need to reload layer if point feature was edited, as markers are destroyed anyway
            if (editedFeature.feature.geometry.type !== `Point` && editedFeature.feature.geometry.type !== `MultiPoint`) {
                editedFeature.disableEdit();
                if (featureWasEdited) {
                    switchLayer.init(editedFeature.id, false);
                    switchLayer.init(editedFeature.id, true);
                }
            }
        }

        if (markers) {
            markers.map(function (v, i) {
                markers[i].disableEdit();
                cloud.get().map.removeLayer(markers[i]);
            });
        }

        featureWasEdited = false;

        // Close the attribute dialog
        $("#" + EDITOR_CONTAINER_ID).animate({
            bottom: "-100%"
        }, 500, function () {
            $(".editor-attr-dialog__expand-less").show();
            $(".editor-attr-dialog__expand-more").hide();
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


