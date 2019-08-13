/*
 * @author     Martin Høgh <mh@mapcentia.com>
 * @copyright  2013-2019 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

'use strict';

/**
 *
 * @type {*|exports|module.exports}
 */
var cloud;

/**
 *
 * @type {*|exports|module.exports}
 */
var meta;

/**
 *
 * @type {*|exports|module.exports}
 */
var utils;

/**
 *
 * @type {*|exports|module.exports}
 */
var backboneEvents;

/**
 *
 * @type {*|exports|module.exports}
 */
var search = require('./../../../browser/modules/search/danish');

/**
 *
 * @type {*|exports|module.exports}
 */
var urlparser = require('./../../../browser/modules/urlparser');

/**
 *
 * @type {*|exports|module.exports}
 */
var layers = require('./../../../browser/modules/layers');

/**
 *
 * @type {*|exports|module.exports}
 */
var layerTree = require('./../../../browser/modules/layerTree');



/**
 *
 * @type {exports|module.exports}
 */
var jsts = require('jsts');

/**
 *
 * @type {*|exports|module.exports}
 */
var reproject = require('reproject');

/**
 * @type {string}
 */
var db = urlparser.db;

/**
 *
 * @type {string}
 */

//Set plugin globals
var exId = "documentCreate";
var id = "documentCreate-custom-search";
var select_id = "documentCreate-service";
var form_id = 'document-feature-form'

var request = require('request');

// VMR
// Check for key in url, else leave undefined
var aKey = undefined; 

if (urlparser.urlVars.adressKey) {
    aKey = urlparser.urlVars.adressKey;
}

/**
 *
 */
var Terraformer = require('terraformer-wkt-parser');
var transformPoint;

var _result;

var jquery = require('jquery');
require('snackbarjs');

/**
 *
 */
var clicktimer;

/**
 *
 * @type {L.FeatureGroup}
 */

var documentCreateItems = new L.FeatureGroup();

/**
 *
 */
var mapObj;

// Get global vars from config
var config = require('../../../config/config.js');

/**
 *
 * @private
 */
var resultLayer = new L.FeatureGroup()


/**
 * VMR get from DB on adress
 * @private
 */
var getExistingDocs = function (key) {
    // turn on layers with filter on address! - easy peasy?
    snack(__('Start med nøgle') + ' ' + key)

    //build the right stuff
    var DClayers = [];
    metaData.data.forEach(function(d) {
        if (d.tags.includes(config.extensionConfig.documentCreate.metaTag)) {
            DClayers.push(d.f_table_schema+'.'+d.f_table_name);
        }
    });

 
    // TODO byg dette filter pbga config el gc2 - håndbygget nu
    var filter = {
        "vmr.vand": {
          "match": "any",
          "columns": [
            {
              "fieldname": "adresse",
              "expression": "like",
              "value": key,
              "restriction": false
            }
          ]
        },
        "vmr.spildevand": {
            "match": "any",
            "columns": [
              {
                "fieldname": "adresse",
                "expression": "like",
                "value": key,
                "restriction": false
              }
            ]
          }
        }
    
    // apply filter
    documentCreateApplyFilter(filter)
};

var documentCreateApplyFilter = function (filter) {
    for (let layerKey in filter){
        console.log('Apply filter to '+layerKey)

        //Make sure layer is on
        layerTree.reloadLayer(layerKey)

        //Toggle the filter
        layerTree.onApplyArbitraryFiltersHandler({ layerKey,filters: filter[layerKey]}, 't');

        //Reload
        layerTree.reloadLayerOnFiltersChange(layerKey)

        //TODO fix zoom-to
        //cloud.get().map.fitBounds(layer.getBounds(), {maxZoom: 16});

        continue;
    }
};

var clearExistingDocFilters = function () {
    // clear filters from layers that might be on! - then reload
    console.log('documentCreate - cleaning filters for reload')

    //TODO byg dette fra config! - den er bare tom
    var filter = {
        "vmr.vand": {
            "match": "any",
            "columns": []
        },
        "vmr.spildevand": {
            "match": "any",
            "columns": []
        }
    }

    // apply filter
    documentCreateApplyFilter(filter)
};

/**
 *
 * @private
 */
var mapObj;
    
var onSearchLoad = function () {
    console.log('documentCreate - search trigered')
    
    // VMR
    // filter to content on key
    getExistingDocs($('#documentCreate-custom-search').val());
    
    // Reset layer
    resultLayer.clearLayers();
    resultLayer.addLayer(this.layer)

    //show content
    $('#documentCreate-feature-content').show();

    //reset all boxes
    $('#documentCreate-feature-meta').html('')
    $('#'+select_id).val('')
    
    //move to marker
    cloud.get().zoomToExtentOfgeoJsonStore(this, config.extensionConfig.documentCreate.maxZoom);
}

/**
 * Function creates Geojson object to be injected back into GC2
 */
var documentCreateFeatureAdd = function (tablename) {
    // Add the feature to GC2 and Docunote
    console.log('documentCreate - Add feature')

    // Get the information from form, create properties
    var feature,featureProperties = {}, tablename

    //only input and select
    $('#'+form_id+' input, #'+form_id+' select').each(
        function(index){  
            var input = $(this);
            featureProperties[input.attr('id')] = input.val();
        }
    );

    // Grab x/y from marker location
    for (var layer in resultLayer._layers) {
        feature = resultLayer._layers[layer].toGeoJSON();
    };

    // IF the feature is already a collection, strip it (from search)
    if (feature.type === 'FeatureCollection'){
        feature = feature.features[0]
        feature.properties = {}
    }

    // get properties from form
    feature.properties = featureProperties;

    //if geom is set in config, inject these values
    tablename = $('#documentCreate-service').val().split('.')[1] //hack
    if (config.extensionConfig.documentCreate.tables.find(x => x.table == tablename).geom_ext.x) {
        feature.properties[config.extensionConfig.documentCreate.tables.find(x => x.table == tablename).geom_ext.x] = feature.geometry.coordinates[0]
    }
    if (config.extensionConfig.documentCreate.tables.find(x => x.table == tablename).geom_ext.y) {
        feature.properties[config.extensionConfig.documentCreate.tables.find(x => x.table == tablename).geom_ext.y] = feature.geometry.coordinates[1]
    }

    // Pack it back into a FeatureCollection (GC2 REST-API)
    feature = {
        "type":"FeatureCollection",
        "features": [
            feature
        ]
    }

    //ready the JSON object to be sent to backend
    documentCreateFeatureSend(tablename,feature)
}

/**
 * 
 * @param {*} tablename 
 * @param {*} feature 
 */

var snack = function (msg) {
    jquery.snackbar({
        htmlAllowed: true,
        content: '<p>'+msg+'</p>',
        timeout: 1000000
    });
}
    

/**
 * Function adds feature to using rest-API, make this configurable to any other rest-based service
 * If it's set in config
 */
var documentCreateFeatureSend = function (tablename,feature) {
    // Send tile feature to DocuNote!
    console.log('documentCreate - Send feature')
    console.log(feature)

    xhr = $.ajax({
        method: "POST",
        url: "/api/extension/documentCreateSendFeature",
        data: feature,
        scriptCharset: "utf-8",
        success: function (response) {
            snack(__("GC2 Success")+': '+xhr.responseJSON.message);
        },
        error: function () {
            snack(__("GC2 Error")+': '+xhr.responseJSON.message);
        }
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
        cloud = o.cloud;
        utils = o.utils;
        meta = o.meta;
        transformPoint = o.transformPoint;
        backboneEvents = o.backboneEvents;
        return this;
    },

    /**
     *
     */
    init: function () {

        var parentThis = this;

        /**
         *
         * Native Leaflet object
         */
        var mapObj = cloud.get().map;

        /**
         *
         */
        var React = require('react');

        /**
         *
         */
        var ReactDOM = require('react-dom');

        /**
         *
         * @type {object}
         */
        var target = {
            dar: false,
            lat: '',
            lng: '',
            wkt: ''
        }

        /**
         *
         * @type {{Info: {da_DK: string, en_US: string}, Street View: {da_DK: string, en_US: string}, Choose service: {da_DK: string, en_US: string}, Activate: {da_DK: string, en_US: string}}}
         */
        var dict = {

            "Help": {
                "da_DK": "Opret henvendelse ud fra adressesøgning. Henvendelserne deles op i forsyningsart. For at starte en en ny henvendelse kan man vælge en ny adresse.",
                "en_US": "Create action based on the picked address. The actions are split by service. To start a new action, select a new address."
            },

            "Ext name": {
                "da_DK": "Hændelse",
                "en_US": "Action"
            },

            "Choose service": {
                "da_DK": "Vælg forsyningsart",
                "en_US": "Choose service"
            },

            "Pick location": {
                "da_DK": "Udvælg adresse",
                "en_US": "Search adress"
            },

            "Metadata": {
                "da_DK": "Henvendelse",
                "en_US": "Information"
            },

            "Submit": {
                "da_DK": "Indsend",
                "en_US": "Submit action"
            },

            "GC2 Success": {
                "da_DK": "Hændelse gemt i GC2",
                "en_US": "Action saved in GC2" 
            },

            "GC2 Error": {
                "da_DK": "Der skete en fejl da hændelsen skulle oprettes",
                "en_US": "There was an error while saving the action" 
            },
            "Start med nøgle": {
                "da_DK": "Leder efter hændelser på adresse",
                "en_US": "Looking for actions on adress" 
            },
            "Start uden nøgle": {
                "da_DK": "Nulstiller filters",
                "en_US": "Resetting filters" 
            },
        };

        /**
         *
         * @param txt
         * @returns {*}
         * @private
         */
        var __ = function (txt) {
            if (dict[txt][window._vidiLocale]) {
                return dict[txt][window._vidiLocale];
            } else {
                return txt;
            }
        };

         /**
         * This function compiles values in selectbox from layers in schema with the correct tag
         * @returns {*}
         * @private
         */
        var buildServiceSelect = function (id) {
            metaData.data.forEach(function(d) {
                // Add layer to select box if tag is correctly defined
                if (d.tags.includes(config.extensionConfig.documentCreate.metaTag)) {
                    $('#'+id).append('<option value="'+d.f_table_schema+'.'+d.f_table_name+'">'+d.f_table_title+'</option>');
                };  
            });
            
        };
          
         /**
         * This function builds metafields from config and how the layers are set up in GC2 and in config file
         * @returns {*}
         * @private
         */
        var buildFeatureMeta = function (layer) {

            //merge information from metadata
            var meta = metaDataKeys[layer]
            var fields = meta.fields
            var fieldconf = JSON.parse(meta.fieldconf)
            var order = []
            var col;

            //Get information from config.json
            var conf = config.extensionConfig.documentCreate.tables.find(x => x.table == meta.f_table_name)

            for (col in fields) {

                var obj = {
                    "colName": col,
                    "colNum": fields[col].num,
                    "nullable": fields[col].is_nullable,
                    "type": fields[col].full_type
                }
                
                // Get information from fieldconf
                ///////////////////////////////////

                //sort_id is set in GC2
                if (col in fieldconf) {
                    obj.sort_id = fieldconf[col].sort_id
                } else {
                    obj.sort_id = 0
                }

                //properties is set in GC2
                if (col in fieldconf) {
                    if (fieldconf[col].properties !== "") {
                        obj.properties = fieldconf[col].properties
                    }
                } 

                //alias is set in GC2
                if (col in fieldconf) {
                    if (fieldconf[col].alias === "") {
                        obj.alias = obj.colName   
                    } else {
                        obj.alias = fieldconf[col].alias
                    }
                } 

                // Get information from config file
                ///////////////////////////////////

                //hidden is set in config
                obj.hidden = $.inArray(col,conf["hidden"])

                //optional is set in config
                obj.optional = $.inArray(col,conf["optional"])

                //defaults
                if (conf["defaults"][col] !== undefined) {
                    obj.defaults = conf["defaults"][col]
                } 


                //Ignore pkey and geom
                if (meta["pkey"] == obj.colName || meta["f_geometry_column"] == obj.colName){
                    // Just don't add
                } else {
                    order.push(obj)
                }
            };

            // Sort by sort_id
            order = order.sort(function compare(a, b) {
                const genreA = a.sort_id;
                const genreB = b.sort_id;
              
                let comparison = 0;
                if (genreA < genreB) {
                  comparison = 1;
                } else if (genreA > genreB) {
                  comparison = -1;
                }
                return comparison;
              });

            //Lets build the stuff!
            FeatureFormFactory(order);
        };

        /**
         * This function builds metafields from config and how the layers are set up in GC2 and in config file
         * @param order Ordered array of fields to be created
         * @returns {*}
         * @private
         */
        var FeatureFormFactory = function (order) {
            
            //scaffold form
            $('#documentCreate-feature-meta').append('<h3>'+__("Metadata")+'</h3>')
            $('#documentCreate-feature-meta').append('<form action="javascript:void(0);" onsubmit="documentCreateFeatureAdd()" id="'+ form_id +'"></form>')
            
            var col;
            order.forEach(function(col) {

                // Replace _func defaults with real values
                /////////////////////////////////////////

                // _DATETIME - Set value to ISO datetime
                if (col.defaults === '_DATETIME'){
                    var date = new Date();
                    col.defaults = date.toISOString();
                }
                // _SEARCH - Set value from search-component
                if (col.defaults === '_SEARCH'){
                    col.defaults = $('#'+id).val();
                }

                // Build the UI elements
                ////////////////////////////////////////

                //Hide element if hidden is set
                if (col.hidden !== -1) {
                    var formobj = '<div class="form-group collapse">'
                } else {
                    var formobj = '<div class="form-group">'
                }

                //create label for input, colName fallback
                //console.log(col)
                var alias
                if (col.alias) {
                    alias = col.alias
                } else {
                    alias = col.colName
                }

                formobj += '<label for="'+col.colName+'" class="text-capitalize">'+alias+':</label>'

                //Check if properties is an array
                try {
                    var propArr = JSON.parse(col.properties.split('\'').join('\"'))
                } catch (error) {
                    var propArr = ''
                }

                //Create select box with array set in properties - is string and contains an array of strings
                if (col.type.includes('character varying') && Array.isArray(propArr)) {
                    formobj += '<select id="'+col.colName+'" class="form-control">'

                    // if layer has a default value set which is contained in the array, set this as first, then build rest and skip
                    var defaultValindex = propArr.indexOf(col.defaults)
                    
                    if (defaultValindex > -1){
                        formobj += '<option>'+propArr[defaultValindex]+'</option>'
                    }
                    // build the rest, skip default if exists since we already made that
                    propArr.forEach(function(val) {
                        if (val !== '' && val !== col.defaults) {
                            formobj += '<option>'+val+'</option>'
                        }
                        
                    }) 

                    formobj += '<select/></div>'
                
                } else {
                    // Default boxes - keep it string for JSON payloads
                    formobj += '<input id="'+col.colName+'"'
                    formobj += 'type="text" class="form-control" '

                    if(col.defaults) (
                        formobj += ' value="'+col.defaults+'"'
                    )

                    formobj += '></div>'
                }

                // Add to form
                $('#'+form_id).append(formobj)
            })
            
            //Then add a button
            $('#'+form_id).append('<button type="submit" class="btn btn-primary">'+__('Submit')+'</button>')
        }
                
        /**
         *
         */
        class DocumentCreate extends React.Component {
            constructor(props) {
                super(props);

                this.state = {
                    active: false,
                    selectedOption: "google"
                };

                this.onChange = this.onChange.bind(this);
            }

            onChange(changeEvent) {
                this.setState({
                    selectedOption: changeEvent.target.value
                });
            }

            /**
             *
             */
            componentDidMount() {
                let me = this;

                // Stop listening to any events, deactivate controls, but
                // keep effects of the module until they are deleted manually or reset:all is emitted
                backboneEvents.get().on("deactivate:all", () => {
                    console.log('Stop listening for documentCreate')
                });

                // Activates module
                backboneEvents.get().on(`on:${exId}`, () => {
                    console.log('Starting documentCreate')
                    me.setState({
                        active: true
                    });
                    utils.cursorStyle().crosshair();
                });

                // Deactivates module
                backboneEvents.get().on(`off:${exId} off:all reset:all`, () => {
                    console.log('Stopping documentCreate')
                    me.setState({
                        active: false
                    });
                    utils.cursorStyle().reset();
                    $("#" + id).val('');
                    resultLayer.clearLayers();
                    //TODO find tne måde at håndtere clear ordentligt
                    //clearExistingDocFilters();
                    $('#documentCreate-feature-content').hide();
                });

                console.log('documentCreate - Mounted')

                //VMR
                // If key is set, go there and get stuff!

                if (aKey) {
                    getExistingDocs(aKey)
                } else {
                    clearExistingDocFilters()
                }



                //Initiate searchBar
                search.init(onSearchLoad, id, true, false);
                cloud.get().map.addLayer(resultLayer);

                // Build select box from metadata
                buildServiceSelect(select_id);

                // Handle click events on map
                // ==========================

                mapObj.on("dblclick", function () {
                    clicktimer = undefined;
                });

                mapObj.on("click", function (e) {
                    let event = new geocloud.clickEvent(e, cloud);
                    if (clicktimer) {
                        clearTimeout(clicktimer);
                    }
                    else {
                        if (me.state.active === false) {
                            return;
                        }
                        //Clear search geom and add clicked as marker
                        console.log('Moving target')
                        resultLayer.clearLayers();

                        var coords = event.getCoordinate(), wkt;
                        wkt = "POINT(" + coords.lng + " " + coords.lat + ")";

                        //console.log(coords)

                        //make a marker that behaves like the one from search
                        var marker = L.marker([coords.lat, coords.lng], {
                            icon: L.AwesomeMarkers.icon({
                                icon: 'home',
                                markerColor: '#C31919',
                                prefix: 'fa'
                            }
                        )
                        }).addTo(resultLayer);
                        mapObj.setView([coords.lat, coords.lng], config.extensionConfig.documentCreate.maxZoom);
                    }
                });

                // Handle change in service type
                // ==========================
                this.onServiceChange = function (e) {
                    console.log('select was changed')

                    //reset all boxes
                    $('#documentCreate-feature-meta').html('')

                    //rebuild from metaData
                    if ($('#'+select_id).val() != '') {

                        //Build the boxes
                        buildFeatureMeta($('#'+select_id).val());
                        //Show the result
                        $('#documentCreate-feature-meta').show();

                    } else {
                        // "Nothing" is chosen, hide the meta
                        $('#documentCreate-feature-meta').hide();
                    };

                };
                

            }

            /**
             *
             * @returns {XML}
             */
            render() {
                return (

                    <div role="tabpanel">
                        <div className="form-group">
                            <h3>{__("Pick location")}</h3>
                            <div    id="documentCreate-places"
                                    className="places">
                                <input  id={id}
                                        className={id + ' typeahead'}
                                        type="text"
                                        placeholder="Adresse"/>
                            </div>
                            <div id="documentCreate-feature-content" className='collapse'>    
                                <h3>{__("Choose service")}</h3>
                                <div>
                                    <select id={select_id} className='form-control' onChange={this.onServiceChange} defaultValue=''>
                                            <option value=""></option>
                                    </select>
                                </div>
                                    <div id="documentCreate-feature-meta" className=''>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            }
        }

        // Create tab
        utils.createMainTab(exId, __("Ext name"), __("Help"), require('./../../../browser/modules/height')().max, "folder", false, exId);

        // Append to DOM
        //==============
        try {

            ReactDOM.render(
                <DocumentCreate/>,
                document.getElementById(exId)
            );
        } catch (e) {

        }

    },

};