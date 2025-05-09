/*
 * @author     Alexander Shumilov
 * @copyright  2013-2025 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

'use strict';

import {LAYER, SYSTEM_FIELD_PREFIX} from '../../../browser/modules/layerTree/constants';
import {GEOJSON_PRECISION} from '../../../browser/modules/constants';
import dayjs from 'dayjs';
import {withTheme} from '@rjsf/core';
import {Theme} from '@rjsf/bootstrap-4';
import validator from "@rjsf/validator-ajv8";
import SelectWidget from "./SelectWidget.jsx";
import TimeWidget from "./TimeWidget.jsx";
import {coordAll} from "@turf/turf";

/**
 *
 * @type {*|exports|module.exports}
 */
let APIBridgeSingletone = require('../../../browser/modules/api-bridge');

const config = require('../../../config/config.js');
const drawTooltip = config?.extensionConfig?.editor?.tooltip;
const alwaysActivate = config?.extensionConfig?.editor?.alwaysActivate ?? true;

/**
 *
 * @type {*|exports|module.exports}
 */
let utils, backboneEvents, layerTree, meta, cloud, sqlQuery, layers;

let apiBridgeInstance = false;

let multiply = require('geojson-multiply');


const Theme5 = {
    ...Theme,
    widgets: {...Theme.widgets, SelectWidget}
}

const Form = withTheme(Theme5);

let markers = [];

let editor;

let editedFeature = false;
let isVectorLayer = false;

let featureWasEdited = false;

let nonCommitedEditedFeature = false;

let switchLayer;

let session;

const FileUploadWidget = require('./FileUploadWidget');

const widgets = {'fileupload': FileUploadWidget, 'time': TimeWidget};

const MODULE_NAME = `editor`;
const PLACEMENT = window.screen.width >= 768 ? "start" : "bottom"
const EDITOR_OFFCANVAS_CONTAINER_ID = `offcanvas-edit-${PLACEMENT}`;
const EDITOR_FORM_CONTAINER_ID = document.querySelector(`#${EDITOR_OFFCANVAS_CONTAINER_ID} .offcanvas-body`);
const MAX_NODE_IN_FEATURE = 1000; // If number of nodes exceed this number, when the geometry editor is not enabled.
const EDIT_STYLE = {
    color: 'blue',
    fillOpacity: 0,
    weight: 4,
    opacity: 0.6,
    dashArray: null
}
const EDIT_MARKER = {
    icon: L.AwesomeMarkers.icon({
            icon: 'arrows-alt',
            markerColor: 'blue',
            prefix: 'fa'
        }
    )
}

const serviceWorkerCheck = () => {
    if (!('serviceWorker' in navigator) || !navigator.serviceWorker || !navigator.serviceWorker.controller) {
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

let bindEvent;

let offcanvasEdit;

const transformErrors = (errors, uiSchema) => {
    return errors.map((error) => {
        if (error.name === 'required') {
            error.message = __(`Required`);
        }
        return error;
    });
}
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
        bindEvent = o.bindEvent;
        session = o.extensions.session.index;

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
        const _self = this;
        if (`watsonc` in window.vidiConfig.enabledExtensions) {
            console.log(`Editor extension is disabled due to the enabled watsonc`);
            return;
        }

        if (drawTooltip) {
            $("body").append(`<div id="editor-tooltip" style="position: fixed; float: left; display: none">${drawTooltip}</div>`);
            $(document).on('mousemove', function (e) {
                $('#editor-tooltip').css({
                    left: e.pageX + 20,
                    top: e.pageY
                });
            });
            cloud.get().map.on("editable:drawing:clicked", function () {
                $("#editor-tooltip").hide();
            });
        }

        $("#editStopBtn").on("click", () => {
            _self.stopEditWithConfirm();
        })

        if (vidiConfig.enabledExtensions.indexOf(`embed`) !== -1) {
            embedIsEnabled = true;
        }

        apiBridgeInstance = APIBridgeSingletone();

        try {
            offcanvasEdit = new bootstrap.Offcanvas(`#${EDITOR_OFFCANVAS_CONTAINER_ID}`);
            document.getElementById(EDITOR_OFFCANVAS_CONTAINER_ID).addEventListener('shown.bs.offcanvas', event => {
                document.querySelector(".edit-attr-btn .bi-arrow-bar-left").classList.remove("d-none");
                document.querySelector(".edit-attr-btn .bi-arrow-bar-right").classList.add("d-none");
            })
            document.getElementById(EDITOR_OFFCANVAS_CONTAINER_ID).addEventListener('hidden.bs.offcanvas', event => {
                document.querySelector(".edit-attr-btn .bi-arrow-bar-right").classList.remove("d-none");
                document.querySelector(".edit-attr-btn .bi-arrow-bar-left").classList.add("d-none");
            })

            document.getElementById("offcanvasEditBtn").addEventListener("click", () => offcanvasEdit.toggle());
        } catch (e) {
            console.log(e)
        }

        // Listen to arrival of add-feature buttons
        $(document).arrive('.gc2-add-feature', {
            existing: true
        }, function () {
            $(this).on("click", function (e) {
                if ($(this).closest('.layer-item').find('.js-show-layer-control').data('gc2-layer-type') === LAYER.VECTOR) {
                    isVectorLayer = true;
                }

                let t = ($(this).data('gc2-key'));
                _self.add(t, true, isVectorLayer);
                e.stopPropagation();
            });
        });

        const getLayerById = (id) => {
            let l;
            cloud.get().map.eachLayer(layer => {
                if (layer._leaflet_id === id) {
                    l = layer;
                }
            })
            return l;
        }

        // Listen to arrival of edit tools
        $(document).arrive('.gc2-edit-tools', {
            existing: true
        }, function () {

            if (!session.isAuthenticated() && !alwaysActivate) {
                document.querySelectorAll('.gc2-edit-tools').forEach(e => e.classList.add('d-none'))
            }

            let id = parseInt(($(this).data('edit-layer-id')));
            let name = ($(this).data('edit-layer-name'));
            let vector = ($(this).data('edit-vector'));
            $(this).find('.popup-edit-btn').on('click', function (e) {
                isVectorLayer = vector;
                _self.edit(getLayerById(id), name, isVectorLayer)
                e.stopPropagation();
            });
            $(this).find('.popup-delete-btn').on('click', function (e) {
                if (window.confirm(__(`Are you sure you want to delete the feature?`))) {
                    isVectorLayer = vector;
                    _self.delete(getLayerById(id), name, isVectorLayer)
                    e.stopPropagation();
                }
            });
        });

        backboneEvents.get().on("edit:editor", function (id, layerKey, isVector) {
            _self.edit(getLayerById(parseInt(id)), layerKey, isVector);
        });

        backboneEvents.get().on("delete:editor", function (id, layerKey, isVector) {
            _self.delete(getLayerById(parseInt(id)), layerKey, isVector);
        });

        backboneEvents.get().on("ready:meta", function () {
            _self.setHandlersForVectorLayers();
            if (config?.extensionConfig?.editor?.addOnStart) {
                function poll() {
                    if (('serviceWorker' in navigator) && navigator?.serviceWorker?.controller) {
                        _self.add(config?.extensionConfig?.editor?.addOnStart, true, true);
                    } else {
                        setTimeout(() => {
                            poll();
                        }, 200)
                    }
                }
                poll();
            }
        });

        /*
            By this time the meta is already loaded and the layerTree is already built,
            so handlers need to be set up manually.
        */
        _self.setHandlersForVectorLayers();
    },

    showOffcanvasEdit: () => {
        offcanvasEdit.show();
    },
    hideOffcanvasEdit: () => {
        offcanvasEdit.hide();
    },


    setHandlersForVectorLayers: () => {
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

            if (layerMeta?.vidi_layer_editable) {
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
                                <i class="bi bi-exclamation"></i> ${__(`Awaiting network`)}
                                <span class="js-tooltip-content"></span>
                            </div>`;
                        } else if (feature.meta.apiRecognitionStatus === 'rejected_by_server') {
                            tooltipSettings.className = `api-bridge-popup-error`;

                            if (feature.meta.serverErrorType) {
                                if (feature.meta.serverErrorType === `REGULAR_ERROR`) {
                                    content = `<div class="js-feature-notification-tooltip">
                                        <i class="bi bi-exclamation"></i> ${__(`Error`)}
                                        <span class="js-tooltip-content"></span>
                                    </div>`;
                                } else if (feature.meta.serverErrorType === `AUTHORIZATION_ERROR`) {
                                    tooltipSettings.className = `api-bridge-popup-warning`;
                                    content = `<div class="js-feature-notification-tooltip">
                                        <i class="bi bi-exclamation"></i> ${__(`Awaiting login`)}
                                        <span class="js-tooltip-content"></span>
                                    </div>`;
                                } else {
                                    throw new Error(`Invalid API error type value`);
                                }
                            } else {
                                content = `<div class="js-feature-notification-tooltip">
                                    <i class="bi bi-exclamation"></i> ${__(`Error`)}
                                    <span class="js-tooltip-content"></span>
                                </div>`;
                            }
                        } else {
                            throw new Error(`Invalid API recognition status value`);
                        }

                        layer.on("add", function () {
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
     * @param fields
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
            if (key !== pkey && key !== f_geometry_column && (key.indexOf(SYSTEM_FIELD_PREFIX) !== 0 && !fieldConf[key]?.filter)) {
                let title = key;
                if (fieldConf[key]?.alias) {
                    title = fieldConf[key].alias;
                }
                properties[key] = {title, type: `string`};
                if (fields[key]?.is_nullable === false) {
                    required.push(key);
                }

                if (fields[key]) {
                    uiSchema[key] = {};
                    switch (fields[key].type) {
                        case `smallint`:
                        case `integer`:
                        case `bigint`:
                            properties[key].type = `integer`;
                            break;
                        case `decimal`:
                        case `numeric`:
                        case `real`:
                        case `double precision`:
                            properties[key].type = `number`;
                            break;
                        case `time with time zone`:
                        case `time without time zone`:
                            uiSchema[key] = {
                                'ui:widget': 'time'
                            };
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
                            properties[key].default = dayjs().format("YYYY-MM-DDTHH:mm"); // Default is required in IOS Safari
                            break;
                        case `timestamp with time zone`:
                            uiSchema[key] = {
                                'ui:widget': 'datetime'
                            };
                            properties[key].default = dayjs().format("YYYY-MM-DDTHH:mmZ"); // Default is required in IOS Safari
                            break;
                        case `boolean`:
                            properties[key].type = `boolean`;
                            properties[key].default = false; // Checkbox is either checked or unchecked
                            break;
                        case `bytea`:
                            uiSchema[key] = {
                                'ui:widget': 'fileupload'
                            };
                            break;
                        case `text`:
                            uiSchema[key] = {
                                'ui:widget': 'textarea'
                            };
                            break;
                    }
                    uiSchema[key]["ui:placeholder"] = fieldConf[key]?.desc;
                }

                // Properties have priority over default types
                if (fields[key]?.restriction?.length > 0) {

                    // If there is a restriction, then convert the field to a select
                    uiSchema[key] = {
                        'ui:widget': 'select'
                    };

                    // if the type is text, change the field to string to get a select
                    if (fields[key].type === `text`) {
                        properties[key].type = `string`;
                    }

                    let restrictions = fields[key].restriction;
                    let enumNames = [];
                    let enumValues = [];
                    for (let i = 0; i < restrictions.length; i++) {
                        enumNames.push(restrictions[i].alias);
                        enumValues.push(restrictions[i].value);
                    }
                    if (enumNames.length === enumValues.length) {
                        properties[key].enumNames = enumNames;
                        properties[key].enum = enumValues;
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
     * @param doNotRemoveEditor
     * @param isVector
     */
    add: function (k, doNotRemoveEditor, isVector = false) {
        if (editedFeature) {
            alert("Ongoing edit. Please stop editing before starting a new one");
            return;
        }


        isVectorLayer = isVector;
        _self.stopEdit();
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

            if (drawTooltip && !utils.isTouchEnabled()) {
                $("#editor-tooltip").show();
            }

            backboneEvents.get().trigger('block:infoClick');
            // Create schema for attribute form
            let formBuildInformation = this.createFormObj(fields, metaDataKeys[schemaQualifiedName].pkey, metaDataKeys[schemaQualifiedName].f_geometry_column, fieldconf);
            const schema = formBuildInformation.schema;
            const uiSchema = formBuildInformation.uiSchema;

            _self.enableSnapping(type, false);

            // Start editor with the right type
            if (type === "POLYGON" || type === "MULTIPOLYGON") {
                editor = cloud.get().map.editTools.startPolygon(null, EDIT_STYLE);
            } else if (type === "LINESTRING" || type === "MULTILINESTRING") {
                editor = cloud.get().map.editTools.startPolyline(null, EDIT_STYLE);
            } else if (type === "POINT" || type === "MULTIPOINT") {
                editor = cloud.get().map.editTools.startMarker(null, EDIT_MARKER);
            } else {
                throw new Error(`Unable to detect type`);
            }

            /**
             * Commit to GC2
             * @param formData
             */
            const onSubmit = function (formData) {
                let featureCollection, geoJson = editor.toGeoJSON(GEOJSON_PRECISION);
                if ((type === "POINT" || type === "MULTIPOINT") && !editor?.dragging) {
                    alert(__("You need to plot a point"));
                    return;
                }
                if ((type === "LINESTRING" || type === "MULTILINESTRING") && coordAll(geoJson).length < 2) {
                    alert(__("You need to plot at least two points"));
                    return;
                }
                if ((type === "POLYGON" || type === "MULTIPOLYGON") && coordAll(geoJson).length < 4) {
                    console.log(coordAll(geoJson).length)
                    alert(__("You need to plot at least three points"));
                    return;
                }

                // Promote MULTI geom
                if (type.substring(0, 5) === "MULTI") {
                    geoJson = multiply([geoJson]);
                }

                Object.keys(formData.formData).map(function (key) {
                    geoJson.properties[key] = formData.formData[key];
                    if (geoJson.properties[key] === undefined) {
                        geoJson.properties[key] = null;
                    }
                    if ((fields[key].type === "bytea" ||
                            fields[key].type.startsWith("time") ||
                            fields[key].type.startsWith("time") ||
                            fields[key].type.startsWith("character") ||
                            fields[key].type.startsWith("json") ||
                            fields[key].type.startsWith("text")) &&
                        geoJson.properties[key] !== null) {
                        geoJson.properties[key] = encodeURIComponent(geoJson.properties[key]);
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
                 */
                const featureIsSaved = () => {
                    console.log('Editor: featureIsSaved, updating', schemaQualifiedName);
                    switchLayer.registerLayerDataAlternation(schemaQualifiedName);
                    me.stopEdit();

                    // Reloading only vector layers, as uncommited changes can be displayed only for vector layers
                    if (isVectorLayer) {
                        layerTree.reloadLayer("v:" + schemaQualifiedName, true);
                    }

                    utils.showInfoToast(__("Feature added"));
                    if (config?.extensionConfig?.editor?.repeatMode) {
                        setTimeout(() => {
                            _self.add(schemaQualifiedName, true, true)
                        }, 1000);
                    }
                };

                apiBridgeInstance.addFeature(featureCollection, db, metaDataKeys[schemaQualifiedName]).then(featureIsSaved).catch(error => {
                    console.log('Editor: error occured while performing addFeature()');
                    throw new Error(error);
                });
            };

            // Slide panel with attributes in and render form component
            ReactDOM.unmountComponentAtNode(document.querySelector(`#${EDITOR_OFFCANVAS_CONTAINER_ID} .offcanvas-body`));
            ReactDOM.render((
                <Form
                    validator={validator}
                    className="feature-attribute-editing-form"
                    schema={schema} noHtml5Validate
                    uiSchema={uiSchema}
                    widgets={widgets}
                    onSubmit={onSubmit}
                    transformErrors={transformErrors}>
                    <div className="buttons">
                        <button type="submit"
                                className="btn btn btn-success mb-2 mt-2 w-100">{__("Submit")}</button>
                        <button type="button" onClick={_self.stopEditWithConfirm}
                                className="btn btn btn-outline-secondary mb-2 mt-2 w-100">{__("Cancel")}</button>
                    </div>
                </Form>
            ), EDITOR_FORM_CONTAINER_ID);

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
     * @param enabledFeature
     */
    enableSnapping: function (geometryType, featureAlreadyExist = true, enabledFeature) {
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

                let snap = new L.Handler.MarkerSnap(cloud.get().map);
                guideLayers.map(layer => {
                    snap.addGuideLayer(layer);
                });
                let snapMarker = L.marker(cloud.get().map.getCenter(), {
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
                    let latlng = snapMarker.getLatLng();
                    e.latlng.lat = latlng.lat;
                    e.latlng.lng = latlng.lng;
                });

                snapMarker.on('snap', function () {
                    snapMarker.addTo(cloud.get().map);
                });
                snapMarker.on('unsnap', function () {
                    snapMarker.remove();
                });
                let followMouse = function (e) {
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
                if (!(key in hashTable)) {
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
     * @param isVector
     */
    edit: function (e, k, isVector = false) {
        if (editedFeature) {
            alert("Ongoing edit. Please stop editing before starting a new one");
            return;
        }
        isVectorLayer = isVector;
        _self.stopEdit();
        editedFeature = e;
        nonCommitedEditedFeature = {};
        if (!isVector) {
            e.setStyle(EDIT_STYLE)
        }
        const editFeature = () => {
            serviceWorkerCheck();
            let React = require('react');

            let ReactDOM = require('react-dom');

            let me = this, schemaQualifiedName = k.split(".")[0] + "." + k.split(".")[1],
                metaDataKeys = meta.getMetaDataKeys();

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


            e.on(`editable:editing`, () => {
                featureWasEdited = true;
            });

            e.id = metaDataKeys[schemaQualifiedName].f_table_schema + "." + metaDataKeys[schemaQualifiedName].f_table_name;
            if (isVectorLayer) {
                e.id = "v:" + e.id;
            }

            e.initialFeatureJSON = e.toGeoJSON(GEOJSON_PRECISION);

            featureWasEdited = false;
            // Hack to edit (Multi)Point layers
            // Create markers, which can be dragged
            switch (e.feature.geometry.type) {
                case "Point":
                    markers[0] = L.marker(
                        e.getLatLng(),
                        EDIT_MARKER
                    ).addTo(cloud.get().map);
                    sqlQuery.reset();
                    editor = markers[0].enableEdit();
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
                    break;

                default:
                    cloud.get().map.addLayer(e);
                    let numberOfNodes = 0;
                    const coors = editedFeature.feature.geometry.coordinates;
                    const calculateCount = (arr) => {
                        for (let i = 0; i < arr.length; i++) {
                            if (Array.isArray(arr[i])) {
                                calculateCount(arr[i]);
                            } else {
                                numberOfNodes++;
                                if (numberOfNodes === MAX_NODE_IN_FEATURE) {
                                    return;
                                }
                            }
                        }
                    };
                    calculateCount(coors);
                    numberOfNodes = numberOfNodes / 2;

                    if (numberOfNodes <= MAX_NODE_IN_FEATURE) {
                        editor = e.enableEdit();
                    } else {
                        editor = false;
                        utils.showInfoToast(__("Editing of geometry is not possible when number of nodes exceed") + " " + MAX_NODE_IN_FEATURE);
                    }
                    break;
            }

            _self.enableSnapping(e.feature.geometry.type, true, e);
            // Delete some system attributes
            let eventFeatureCopy = JSON.parse(JSON.stringify(e.feature));
            delete eventFeatureCopy.properties._vidi_content;
            delete eventFeatureCopy.properties._id;
            delete eventFeatureCopy.properties._vidi_edit_layer_id;
            delete eventFeatureCopy.properties._vidi_edit_layer_name;
            delete eventFeatureCopy.properties._vidi_edit_vector;
            delete eventFeatureCopy.properties._vidi_edit_display;

            // Set NULL values to undefined, because NULL is a type
            Object.keys(eventFeatureCopy.properties).map(key => {
                if (eventFeatureCopy.properties[key] === null) {
                    eventFeatureCopy.properties[key] = undefined;
                }
            });

            // Transform field values according to their types
            Object.keys(fields).map(key => {
                switch (fields[key].type) {
                    case `decimal`:
                    case `numeric`:
                    case `real`:
                    case `double precision`:
                        if (eventFeatureCopy.properties[key]) {
                            eventFeatureCopy.properties[key] = parseFloat(eventFeatureCopy.properties[key]);
                        }
                        break
                    case `date`:
                    case `bytea`:
                    case `timestamp with time zone`:
                    case `timestamp without time zone`:
                    case `time with time zone`:
                    case `time without time zone`:
                        if (eventFeatureCopy.properties[key]) {
                            eventFeatureCopy.properties[key] = decodeURIComponent(eventFeatureCopy.properties[key]);
                        }
                        break;
                    case `text`:
                    case `character varying`:
                    case `json`:
                    case `jsonb`:
                        if (eventFeatureCopy.properties[key]) {
                            try { // If string is not
                                eventFeatureCopy.properties[key] = decodeURIComponent(eventFeatureCopy.properties[key]);
                            } catch (e) {
                            }
                            eventFeatureCopy.properties[key] = eventFeatureCopy.properties[key].replace(/\\"/g, '"');
                        }
                        break;
                }
            });

            /**
             * Commit to GC2
             * @param formData
             */
            const onSubmit = (formData) => {
                let GeoJSON = e.toGeoJSON(GEOJSON_PRECISION), featureCollection;
                delete GeoJSON.properties._vidi_content;
                delete GeoJSON.properties._id;
                delete GeoJSON.properties._vidi_edit_layer_id;
                delete GeoJSON.properties._vidi_edit_layer_name;
                delete GeoJSON.properties._vidi_edit_vector;
                delete GeoJSON.properties._vidi_edit_display;

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
                let fieldConf = false;
                if (metaDataKeys[schemaQualifiedName].fieldconf) {
                    fieldConf = JSON.parse(metaDataKeys[schemaQualifiedName].fieldconf);
                }
                Object.keys(fields).map(function (key) {
                    if ((!key.startsWith("gc2_") && fields[key].type !== "geometry" && !fieldConf[key]?.filter) || metaDataKeys[schemaQualifiedName].pkey === key) {
                        GeoJSON.properties[key] = formData.formData[key];
                        // Set undefined values back to NULL
                        if (GeoJSON.properties[key] === undefined) {
                            GeoJSON.properties[key] = null;
                        }
                        if ((fields[key].type === "bytea" ||
                                fields[key].type.startsWith("time") ||
                                fields[key].type.startsWith("time") ||
                                fields[key].type.startsWith("character") ||
                                fields[key].type.startsWith("json") ||
                                fields[key].type.startsWith("text")) &&
                            GeoJSON.properties[key] !== null) {
                            GeoJSON.properties[key] = encodeURIComponent(GeoJSON.properties[key]);
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
                    // switchLayer.registerLayerDataAlternation(schemaQualifiedName);
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
            ReactDOM.unmountComponentAtNode(EDITOR_FORM_CONTAINER_ID);
            let eventFeatureParsed = {};
            for (let [key, value] of Object.entries(eventFeatureCopy.properties)) {
                if (fields[key].type.includes("timestamp with time zone")) {
                    value = value ? dayjs(value).format("YYYY-MM-DDTHH:mmZ") : dayjs().format("YYYY-MM-DDTHH:mmZ"); // Default is required in IOS Safari
                } else if (fields[key].type.includes("timestamp without time zone")) {
                    value = value ? dayjs(value).format("YYYY-MM-DDTHH:mm") : dayjs().format("YYYY-MM-DDTHH:mm"); // Default is required in IOS Safari
                }
                eventFeatureParsed[key] = value;
            }
            ReactDOM.render((
                <Form
                    validator={validator}
                    className="feature-attribute-editing-form"
                    schema={schema} noHtml5Validate
                    widgets={widgets}
                    uiSchema={uiSchema}
                    formData={eventFeatureParsed}
                    onSubmit={onSubmit}
                    transformErrors={transformErrors}>
                    <div className="buttons">
                        <button type="submit" className="btn btn btn-success mb-2 mt-2 w-100">{__("Submit")}</button>
                        <button type="button" onClick={_self.stopEditWithConfirm}
                                className="btn btn btn-outline-secondary mb-2 mt-2 w-100">{__("Cancel")}</button>
                    </div>
                </Form>
            ), EDITOR_FORM_CONTAINER_ID);
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
        $("#offcanvasEditBtn").trigger("click");
        $("#edit-tool-group").removeClass("d-none")
    },

    /**
     * Delete feature from layer
     * @param e
     * @param k
     * @param isVector
     */
    delete: function (e, k, isVector = false) {
        isVectorLayer = isVector;
        _self.stopEdit();
        editedFeature = false;

        let schemaQualifiedName = k.split(".")[0] + "." + k.split(".")[1],
            metaDataKeys = meta.getMetaDataKeys(),
            GeoJSON = e.toGeoJSON(GEOJSON_PRECISION);

        const deleteFeature = () => {
            serviceWorkerCheck();

            const featureIsDeleted = () => {
                console.log('Editor: featureIsDeleted, isVectorLayer:', isVectorLayer);
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
     */
    stopEdit: function () {
        if (drawTooltip) {
            $("#editor-tooltip").hide();
        }
        backboneEvents.get().trigger('unblock:infoClick');
        cloud.get().map.editTools.stopDrawing();
        $("#edit-tool-group").addClass("d-none");
        _self.hideOffcanvasEdit()

        if (editor) {
            cloud.get().map.removeLayer(editor);
        }
        if (editedFeature && !isVectorLayer) {
            cloud.get().map.removeLayer(editedFeature);
        }

        // If feature was edited, then reload the layer
        if (editedFeature) {
            if (`snapediting` in editedFeature && editedFeature.snapediting) {
                editedFeature.snapediting.disable();
            }

            // No need to reload layer if point feature was edited, as markers are destroyed anyway
            if (editedFeature.feature.geometry.type !== `Point` && editedFeature.feature.geometry.type !== `MultiPoint`) {
                editedFeature.disableEdit();
            }
        }

        if (markers) {
            markers.map(function (v, i) {
                markers[i].disableEdit();
                cloud.get().map.removeLayer(markers[i]);
            });
        }

        featureWasEdited = false;


        editedFeature = false;
        sqlQuery.resetAll();
    },

    stopEditWithConfirm: () => {
        if (window.confirm(__("Are you sure you want to cancel?"))) {
            _self.stopEdit();
        }
    },

    /**
     * Checks if application is online.
     */
    checkIfAppIsOnline: () => {
        return new Promise((resolve, reject) => {
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
    },

    getEditedFeature: () => {
        return editedFeature;
    }
};

