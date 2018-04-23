/**
 * @fileoverview Description of file, its uses and information
 * about its dependencies.
 */

'use strict';

var meta;

var layers;

var onEachFeature = [];

var pointToLayer = [];

var onLoad = [];

var onSelect = [];

var onMouseOver = [];

var cm = [];

var styles = [];

var store = [];

var automatic = true;

/**
 *
 * @type {*|exports|module.exports}
 */
let APIBridgeSingletone = require('./api-bridge');

/**
 *
 * @type {APIBridge}
 */
var apiBridgeInstance = false;

/**
 * Stores the last value of application online status
 */
var applicationIsOnline = -1;

/**
 *
 * @type {{Info: {da_DK: string, en_US: string}, Street View: {da_DK: string, en_US: string}, Choose service: {da_DK: string, en_US: string}, Activate: {da_DK: string, en_US: string}}}
 */
var dict = {
    "Force offline mode": {
        "da_DK": "# Force offline mode",
        "en_US": "# Force offline mode"
    },
    "Tile": {
        "da_DK": "# Tile",
        "en_US": "# Tile"
    },
    "Vector": {
        "da_DK": "# Vector",
        "en_US": "# Vector"
    },
    "Pending": {
        "da_DK": "# Pending",
        "en_US": "# Pending"
    }
};

/**
 *
 * @type {{set: module.exports.set, init: module.exports.init}}
 */
module.exports = {
    set: function (o) {
        meta = o.meta;
        return this;
    },
    init: function () {
        var _self = this;

        const clearLayerRequests = (layerId) => {
            apiBridgeInstance.removeByLayerId(layerId);
        };

        apiBridgeInstance = APIBridgeSingletone((statistics, forceLayerUpdate = false) => {
            let actions = ['add', 'update', 'delete'];
            $(`[data-gc2-layer-key]`).each((index, container) => {
                actions.map(action => {
                    $(container).find('.js-' + action).addClass('hidden');
                    $(container).find('.js-' + action).find('.js-value').html('');
                });
            });

            $('.js-clear').addClass('hidden');
            $('.js-clear').off();

            $('.js-app-is-online-badge').addClass('hidden');
            $('.js-app-is-offline-badge').addClass('hidden');

            if (statistics.online) {
                $('.js-toggle-offline-mode').prop('disabled', false);

                applicationIsOnline = 1;
                $('.js-app-is-online-badge').removeClass('hidden');
            } else {
                if (applicationIsOnline !== 0) {
                    $('.js-toggle-offline-mode').trigger('click');
                }

                $('.js-toggle-offline-mode').prop('disabled', true);

                applicationIsOnline = 0;
                $('.js-app-is-offline-badge').removeClass('hidden');
            }

            if (applicationIsOnline !== -1) {
                $('.js-app-is-pending-badge').remove();
            }

            for (let key in statistics) {
                let layerControlContainer = $(`[data-gc2-layer-key="${key}"]`);
                if (layerControlContainer.length === 1) {
                    let totalRequests = 0;
                    actions.map(action => {
                        if (statistics[key][action.toUpperCase()] > 0) {
                            totalRequests++;
                            $(layerControlContainer).find('.js-' + action).removeClass('hidden');
                            $(layerControlContainer).find('.js-' + action).find('.js-value').html(statistics[key][action.toUpperCase()]);
                        }
                    });

                    if (totalRequests > 0) {
                        $(layerControlContainer).find('.js-clear').removeClass('hidden');
                        $(layerControlContainer).find('.js-clear').on('click', (event) => {
                            clearLayerRequests($(event.target).parent().data('layer-id'));
                        });
                    }
                }
            }

            if (forceLayerUpdate) {
                _self.getActiveLayers().map(item => {
                    _self.switchLayer(item, false);
                    _self.switchLayer(item, true);
                });
            }
        });

        var base64name, arr, groups, metaData, i, l, count, displayInfo, tooltip;
        groups = [];
        metaData = meta.getMetaDataLatestLoaded();
        for (i = 0; i < metaData.data.length; ++i) {
            groups[i] = metaData.data[i].layergroup;
        }

        arr = array_unique(groups.reverse());
        metaData.data.reverse();

        $("#layers").empty();

        let toggleOfllineOnlineMode = $(`<div class="panel panel-default">
            <div class="panel-body">
                <div class="togglebutton">
                    <label>
                        <input class="js-toggle-offline-mode" type="checkbox"> ${__('Force offline mode')}
                        <span class="badge js-app-is-pending-badge" style="background-color: #C0C0C0;"><i class="fa fa-ellipsis-h"></i> ${__('Pending')}</span>
                        <span class="badge js-app-is-online-badge hidden" style="background-color: #28a745;"><i class="fa fa-signal"></i> Online</span>
                        <span class="badge js-app-is-offline-badge hidden" style="background-color: #dc3545;"><i class="fa fa-times"></i> Offline</span>
                    </label>
                </div>
            </div>
        </div>`);

        $(toggleOfllineOnlineMode).find('.js-toggle-offline-mode').change((event) => {
            if ($(event.target).is(":checked")) {
                apiBridgeInstance.setOfflineMode(true);
            } else {
                apiBridgeInstance.setOfflineMode(false);
            }
        });

        $("#layers").append(toggleOfllineOnlineMode);

        for (i = 0; i < arr.length; ++i) {
            if (arr[i] && arr[i] !== "<font color='red'>[Ungrouped]</font>") {
                l = [];
                base64name = Base64.encode(arr[i]).replace(/=/g, "");

                // Add group container
                // Only if container doesn't exist
                // ===============================
                if ($("#layer-panel-" + base64name).length === 0) {
                    $("#layers").append('<div class="panel panel-default panel-layertree" id="layer-panel-' + base64name + '"><div class="panel-heading" role="tab"><h4 class="panel-title"><div class="layer-count badge"><span>0</span> / <span></span></div><a style="display: block" class="accordion-toggle" data-toggle="collapse" data-parent="#layers" href="#collapse' + base64name + '"> ' + arr[i] + ' </a></h4></div><ul class="list-group" id="group-' + base64name + '" role="tabpanel"></ul></div>');

                    // Append to inner group container
                    // ===============================
                    $("#group-" + base64name).append('<div id="collapse' + base64name + '" class="accordion-body collapse"></div>');
                }

                // Add layers
                // ==========
                for (var u = 0; u < metaData.data.length; ++u) {
                    let localMeta = metaData.data[u];
                    if (localMeta.layergroup == arr[i]) {
                        var text = (localMeta.f_table_title === null || localMeta.f_table_title === "") ? localMeta.f_table_name : localMeta.f_table_title;
                        if (localMeta.baselayer) {
                            $("#base-layer-list").append(
                                "<div class='list-group-item'><div class='row-action-primary radio radio-primary base-layer-item' data-gc2-base-id='" + localMeta.f_table_schema + "." + localMeta.f_table_name + "'><label class='baselayer-label'><input type='radio' name='baselayers'>" + text + "<span class='fa fa-check' aria-hidden='true'></span></label></div></div>"
                            );
                        } else {
                            let isDisabledAttribute = '';
                            let selectorLabel = __('Tile');
                            if (localMeta && localMeta.meta) {
                                let parsedMeta = JSON.parse(localMeta.meta);
                                if (parsedMeta.vidi_layer_type) {
                                    if (parsedMeta.vidi_layer_type === 't') {
                                        selectorLabel = __('Tile');
                                        isDisabledAttribute = 'disabled';
                                    }

                                    if (parsedMeta.vidi_layer_type === 'v') {
                                        selectorLabel = __('Vector');
                                        isDisabledAttribute = 'disabled';
                                    }
                                }
                            }

                            displayInfo = ((localMeta.meta !== null && $.parseJSON(localMeta.meta) !== null && typeof $.parseJSON(localMeta.meta).meta_desc !== "undefined" && $.parseJSON(localMeta.meta).meta_desc !== "") || localMeta.f_table_abstract) ? "visible" : "hidden";
                            tooltip = localMeta.f_table_abstract || "";
                            let lockedLayer = (localMeta.authentication === "Read/write" ? " <i class=\"fa fa-lock gc2-session-lock\" aria-hidden=\"true\"></i>" : "");
                            let layerControlRecord = $(`<li class="layer-item list-group-item">
                                <div style="display: inline-block;">
                                    <div class="checkbox" style="width: 34px;">
                                        <label>
                                            <input type="checkbox"
                                                id="${localMeta.f_table_name}"
                                                data-gc2-id="${localMeta.f_table_schema}.${localMeta.f_table_name}">
                                        </label>
                                    </div>
                                </div>
                                <div style="display: inline-block;">
                                    <div class="dropdown">
                                        <button style="padding: 8px;" class="btn btn-default dropdown-toggle" type="button"
                                            data-toggle="dropdown" aria-haspopup="true" aria-expanded="true" ${isDisabledAttribute}>${selectorLabel}
                                        <span class="caret"></span>
                                        </button>
                                        <ul class="dropdown-menu">
                                            <li>
                                                <a class="js-layer-type-selector-tile" href="javascript:void(0)">${__('Tile')}</a>
                                            </li>
                                            <li>
                                                <a class="js-layer-type-selector-vector" href="javascript:void(0)">${__('Vector')}</a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div style="display: inline-block;">
                                    <span>${text}${lockedLayer}</span>
                                </div>
                                <div style="display: inline-block;">
                                    <button style="padding: 8px;" type="button" data-gc2-key="${localMeta.f_table_schema}.${localMeta.f_table_name}.${localMeta.f_geometry_column}"
                                        data-toggle="tooltip" data-placement="left" title="Add new feature to layer" data-layer-type="tile" class="btn gc2-add-feature gc2-edit-tools">
                                        <i class="fa fa-plus"></i>
                                    </button>
                                    <span data-toggle="tooltip" data-placement="left" title="${tooltip}"
                                        style="visibility: ${displayInfo}" class="info-label label label-primary" data-gc2-id="${localMeta.f_table_schema}.${localMeta.f_table_name}">Info</span>
                                </div>
                            </li>`);

                            $(layerControlRecord).find('.js-layer-type-selector-tile').first().on('click', (e) => {
                                console.log('tile type was chosen');
                                e.stopPropagation();
                            });

                            $(layerControlRecord).find('.js-layer-type-selector-vector').first().on('click', (e) => {
                                console.log('vector type was chosen');
                                e.stopPropagation();
                            });

                            $("#collapse" + base64name).append(layerControlRecord);

                            l.push({});
                        }
                    }
                }

                if (!isNaN(parseInt($($("#layer-panel-" + base64name + " .layer-count span")[1]).html()))) {
                    count = parseInt($($("#layer-panel-" + base64name + " .layer-count span")[1]).html()) + l.length;
                } else {
                    count = l.length;
                }

                $("#layer-panel-" + base64name + " span:eq(1)").html(count);
                // Remove the group if empty
                if (l.length === 0) {
                    $("#layer-panel-" + base64name).remove();
                }
            }
        }

        // Open the first panel
        // ====================

        $("#layers div:first").find("a").trigger("click");
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

                const featureIsUpdated = () => {
                    console.log('Editor: featureIsUpdated');

                    let l = cloud.get().getLayersByName("v:" + schemaQualifiedName);
                    me.stopEdit(e);
                    sqlQuery.reset(qstore);
                };

                apiBridgeInstance.updateFeature(featureCollection, db, metaDataKeys[schemaQualifiedName]).then(featureIsUpdated).catch(error => {
                    console.log('Editor: error occured while performing updateFeature()');
                    throw new Error(error);
                });
            };
        };

        if (isVectorLayer) {
            editFeature();
        } else {
            $.get('/connection-check.ico', () => {}).done(() => {
                editFeature();
            }).fail(() => {
                if (confirm('Application is offline, tiles will not be updated. Proceed?')) {
                    editFeature();
                }
            });
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
            fieldConf = ((metaDataKeys[schemaQualifiedName].fields) ? metaDataKeys[schemaQualifiedName].fields : JSON.parse(metaDataKeys[schemaQualifiedName].fieldconf)),
            type = metaDataKeys[schemaQualifiedName].type;

        const addFeature = () => {
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

                /**
                 * Feature saving callback
                 * 
                 * @param {Object} result Saving result
                 */
                const featureIsSaved = (result) => {
                    console.log('Editor: featureIsSaved, updating', schemaQualifiedName);

                    sqlQuery.reset(qstore);
                    let l = cloud.get().getLayersByName("v:" + schemaQualifiedName);
                    me.stopEdit(l);

                    jquery.snackbar({
                        id: "snackbar-conflict",
                        content: "Entity  stedfæstet",
                        htmlAllowed: true,
                        timeout: 5000
                    });
                };

                apiBridgeInstance.addFeature(featureCollection, db, metaDataKeys[schemaQualifiedName]).then(featureIsSaved).catch(error => {
                    console.log('Editor: error occured while performing addFeature()');
                    throw new Error(error);
                });
            };
        };

        if (isVectorLayer) {
            addFeature();
        } else {
            $.ajax({
                method: 'GET',
                url: '/connection-check.ico'
            }).done((data, textStatus, jqXHR) => {
                if (jqXHR.statusText === 'ONLINE') {
                    addFeature();
                } else if (jqXHR.statusText === 'OFFLINE') {
                    if (confirm('Application is offline, tiles will not be updated. Proceed?')) {
                        addFeature();
                    }
                } else {
                    console.warn(`Unable the determine the online status`);
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
                console.log('Editor: featureIsDeleted');

                sqlQuery.reset(qstore);
                cloud.get().map.closePopup();
                me.reloadLayer("v:" + schemaQualifiedName);
            };

            if (!gid) {
                gid = GeoJSON.properties.gid;
                console.log('GeoJSON', GeoJSON);
            }

            apiBridgeInstance.deleteFeature(gid, db, metaDataKeys[schemaQualifiedName]).then(featureIsDeleted).catch(error => {
                console.log('Editor: error occured while performing deleteFeature()');
                throw new Error(error);
            });
        };

        if (isVectorLayer) {
            deleteFeature();
        } else {
            $.get('/connection-check.ico', () => {}).done(function() {
                deleteFeature();
            }).fail(() => {
                if (confirm('Application is offline, tiles will not be updated. Proceed?')) {
                    deleteFeature();
                }
            });
        }
    },

    /**
     * Reloading provided layer.
     * 
     * @param {String} layerId Layer identifier
     */
    reloadLayer: (layerId) => {
        console.log('reloadLayer', layerId);
        vectorLayers.switchLayer(layerId, false);
        vectorLayers.switchLayer(layerId, true);
    },

    /**
     * Stop editing and clean up
     * @param e
     */
    stopEdit: function (e) {
        let me = this;
        cloud.get().map.editTools.stopDrawing();

        if (e) me.reloadLayer(e.id);
        if (editor) cloud.get().map.removeLayer(editor);

        if (markers) {
            markers.map(function (v, i) {
                markers[i].disableEdit();
                cloud.get().map.removeLayer(markers[i]);
            });
        }
    },

    /**
     * Turns layers on/off
     */
    switchLayer: (id, visible) => {
        let el = $('*[data-gc2-id-vec="' + id + '"]');
        if (el.length !== 1) {
            throw new Error('Unable to find specified layer');
        }

        if (visible) {
            el.parent().siblings().children().addClass("fa-spin");

            // @todo Refactor the try / catch code piece
            try {
                cloud.get().map.addLayer(cloud.get().getLayersByName(id));
            } catch (e) {
                console.info(id + " added to the map.");

                cloud.get().layerControl.addOverlay(store[id].layer, id);
                cloud.get().map.addLayer(cloud.get().getLayersByName(id));
            } finally {
                store[id].load();
                el.prop('checked', true);
                layers.incrementCountLoading(id);
                backboneEvents.get().trigger("startLoading:layers", id);
            }
        } else {
            if (store[id]) {
                store[id].abort();
                store[id].reset();
            }

            cloud.get().map.removeLayer(cloud.get().getLayersByName(id));
            el.prop('checked', false);
        }
    },

    /**
     * Returns list of currently enabled layers
     */
    getActiveLayers: () => {
        let activeLayerIds = [];
        $('*[data-gc2-id-vec]').each((index, item) => {
            let isEnabled = $(item).is(':checked');
            if (isEnabled) {
                activeLayerIds.push($(item).data('gc2-id-vec'));
            }
        });

        return activeLayerIds;
    },


    setOnEachFeature: function (layer, fn) {
        onEachFeature[layer] = fn;
    },

    setOnLoad: function (layer, fn) {
        onLoad[layer] = fn;
    },

    setOnSelect: function (layer, fn) {
        onSelect[layer] = fn;
    },

    setOnMouseOver: function (layer, fn) {
        onMouseOver[layer] = fn;
    },

    setCM: function (layer, c) {

        cm[layer] = c;
    },

    setStyle: function (layer, s) {

        styles[layer] = s;
    },

    setPointToLayer: function (layer, fn) {

        pointToLayer[layer] = fn;
    },

    setAutomatic: function (b) {
        automatic = b;
    },

    getStores: function () {
        return store;
    },

    load: function (id) {
        store[id].load();
    }
};