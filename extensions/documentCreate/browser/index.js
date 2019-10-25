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
var cloud = require('./../../../browser/modules/cloud');

var moment = require('moment');
// Set locale for date/time string
moment.locale("da_DK");

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
var backboneEvents = require('./../../../browser/modules/backboneEvents');

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
 * @type {*|exports|module.exports}
 */
var switchLayer = require('./../../../browser/modules/switchLayer');



const GUI_CONTROL_STATE = {
    FEATURE_CONTENT_VISIBLE: 2,
    ACTIVATE_SUBMIT_CONTROL: 4,
    FEATURE_INFO_VISIBLE: 8,
    EDIT_CONTROLS_VISIBLE: 16,
    AUTHENTICATE_HIDE_ALERT: 32,
    AUTHENTICATE_SHOW_ALERT: 64,
    NO_CONTROLS_VISIBLE: 128
  }

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
var schema = urlparser.schema;

var thePreviousServiceValue = undefined;

/**
 *
 * @type {string}
 */

//Set plugin globals
var exId = "documentCreate";
var id = "documentCreate-custom-search";
var select_id = "documentCreate-service";
var form_id = 'document-feature-form'
var currentSearch = undefined;
var request = require('request');
var coords;

// VMR
// Check for key in url, else leave undefined
var filterKey = undefined;
var fileIdent = undefined; 
var firstRunner = true; 
var editingAllowed = false;

if (urlparser.urlVars.filterKey) {
    filterKey = urlparser.urlVars.filterKey;
}
if (urlparser.urlVars.fileIdent) {
    fileIdent = urlparser.urlVars.fileIdent;
}
/**
 *
 */
var Terraformer = require('terraformer-wkt-parser');
var transformPoint;

var _result;

var _USERSTR = "";

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
var DClayers = [];

/**
 * Tilføjer liste af lag som har korrekt tag
 */
/*
try {
    metaData.data.forEach(function(d) {
      if (d.tags) {
        if (d.tags.includes(config.extensionConfig.documentCreate.metaTag)) {
            DClayers.push(d.f_table_schema+'.'+d.f_table_name);
        }
      }
    });
} catch (error) {
    console.info('documentCreate - Kunne ikke finde lag med korrekt tag')
    
}*/
/*
TODO fix formular så den ikke nulstilles hver gang
*/


/**
 * VMR get from DB on adress
 * key String - Search phrase
 * fileIdent  - search "fixed" column
 * @privates
 */
var getExistingDocs = function (key, fileIdent = false) {
    // turn on layers with filter on address! - easy peasy?

    //build the right stuff
    var filter = documentCreateBuildFilter(key, fileIdent)
    var caseFound = false;
    var layersToReload = [];
    //var caseNumber = "", adress = "";

    // apply filter
    documentCreateApplyFilter(filter)

    // make list of existing cases
    var existingcases = documentGetExistingCasesFilter(key, fileIdent)
    $('#documentList-feature-content').html('')
    $('#documentList-feature-content').append('<table style="width:100%" border="1">')
    $('#documentList-feature-content').append('<thead><tr>')
    $('#documentList-feature-content').append('<th style="padding-right:5px;">Dato</th>'
                                            + '<th style="padding-right:5px;">Status</th>'
                                            + '<th style="padding-right:5px;">Forsyningsart</th>'
                                            + '<th style="padding-right:5px;">Prioritet</th>'
                                            + '<th style="padding-right:5px;">Ansvarlig</th>'
                                            + '<th style="padding-right:5px;">Sagsnr</th>')
    $('#documentList-feature-content').append('</tr></thead><tbody>')

    if (existingcases) {
        for (let l in existingcases) {
            caseFound = true;
            var found = layersToReload.some(function(value) {
                return value === existingcases[l].properties.forsyningstype;
              });
            if (!found) {
                layersToReload.push(existingcases[l].properties.forsyningstype);
            }
            //caseNumber = (caseNumber.length == 0 ? existingcases[l].properties.casenumber : ", " + existingcases[l].properties.casenumber);
            //adress = existingcases[l].properties.sagsnavn;
            $('#documentList-feature-content').append('<tr>')
            $('#documentList-feature-content').append(
                '<td style="padding-right:5px;">' + new moment(existingcases[l].properties.henvendelsesdato).format("DD-MM-YYYY") + '</td>'
                + '<td style="padding-right:5px;">' + existingcases[l].properties.sagsstatus + '</td>'
                + '<td style="padding-right:5px;">' + existingcases[l].properties.forsyningstype + '</td>'
                + '<td style="padding-right:5px;">' + existingcases[l].properties.prioritet + '</td>'
                + '<td style="padding-right:5px;">' + (existingcases[l].properties.ansvarlig ? existingcases[l].properties.ansvarlig : '') + '</td>'               
                + '<td style="padding-right:5px;"><a href="docunote:/casenumber='+existingcases[l].properties.casenumber + '">'+existingcases[l].properties.sagsnavn+'</a></td>')
            $('#documentList-feature-content').append('</tr>')
        }
        
        if (fileIdent && !caseFound) {            
            throw new Error("No existing cases found")
        }
    }
    $('#documentList-feature-content').append('</tbody></table>')    
    
    // TODO fix zoom-to
    var bounds = []
    var bounds = documentCreateGetFilterBounds(key, fileIdent)
    if (bounds.length !== 0) {
        //There is stuff, go there
        var myBounds = new L.LatLngBounds(bounds)
        //console.log(myBounds)

        //wait for ready event!
        backboneEvents.get().once('allDoneLoading:layers', () => {
            cloud.get().map.fitBounds(myBounds, {maxZoom: config.extensionConfig.documentCreate.maxZoom});
            // reload cosmetic layer (if layer ident is found and specified)
            if (fileIdent) {
                layersToReload.forEach(element => {
                    // Get information from config.json
                    var conf = config.extensionConfig.documentCreate.tables.find(x => x.docunotecaseutilitytype == element)
            
                    // set the cosmetic backgroundlayer visible (if specified)
                    if (conf.cosmeticbackgroundlayer) {
                        layerTree.reloadLayer(conf.cosmeticbackgroundlayer);
                    }
                });
            }
        }) 

        // create list with links 
    }
    if (fileIdent) {
        // we are in a editing session
        SetGUI_ControlState(GUI_CONTROL_STATE.FEATURE_INFO_VISIBLE + GUI_CONTROL_STATE.EDIT_CONTROLS_VISIBLE);
        //snack(__('Viser henvendelser på sagsnr. ') + ' ' + caseNumber)
    }  else {
        // we are in a create session
        SetGUI_ControlState(GUI_CONTROL_STATE.FEATURE_INFO_VISIBLE);
    }
};


var documentCreateGetFilterBounds = function (key, isfileIdent = false) {map

    //build query
    var qrystr = 'WITH CTE (geom) AS ('
    var tables = []
    var boundsArr = []

    for (let l in DClayers) {
        var tablename = DClayers[l].split('.')[1] //hack
        // set the filter based on config
        var filterCol, filterExp;

        // If looking by fileIdent
        if (isfileIdent) {
            //Ident filter
            var filterCol = config.extensionConfig.documentCreate.fileIdentCol
            var filterExp = '='
        } else {
            //Just reg. filter
            var filterCol = config.extensionConfig.documentCreate.tables.find(x => x.table == tablename).filterCol
            var filterExp = config.extensionConfig.documentCreate.tables.find(x => x.table == tablename).filterExp
        }

            tables.push('SELECT the_geom FROM ' + DClayers[l] + ' where ' + filterCol + ' ' + filterExp + ' \'' + key + '\'');
    }

    qrystr = qrystr + tables.join(' UNION ')
    qrystr = qrystr + ') select ST_Extent(geom) from cte'
    //qrystr = qrystr + ') select ST_Extent(ST_Transform(ST_SetSRID(geom,4326),3857)) from cte' //Example for anything but 4326 - should be automatic TODO

    // query SQL for stuff
    $.ajax({
        url: gc2host + '/api/v1/sql/' + _USERSTR + '?q='+qrystr,
        type: "get",
        async: false,
        success: function(data) {
            //check for stuff
            if (data.features[0].properties == null ||
                data.features[0].properties.st_extent == null) {
                //nothing.. return null
                return null
            } else {
                //mangle
                boundsArr = []
                var str = data.features[0].properties.st_extent
                str = str.substring(4, str.length - 1)
                var arr = str.split(',').join(' ').split(' ')

                //Get the order right - NE, SW
                boundsArr.push([parseFloat(arr[3]), parseFloat(arr[2])])
                boundsArr.push([parseFloat(arr[1]), parseFloat(arr[0])])

            }
        }
    });
    return boundsArr
}

var documentGetExistingCasesFilter = function (key, isfileIdent = false) {
    // if (!_USERSTR) {
    //     $.when(_checkLoginDocMenu()).done(function(a1){
    //         // the code here will be executed when all four ajax requests resolve.
    //         // a1, a2, a3 and a4 are lists of length 3 containing the response text,
    //         // status, and jqXHR object for each of the four ajax calls respectively.
    //     });
    // }
    //build query
    var qrystr = 'WITH cases (casenumber, sagsstatus, forsyningstype, prioritet, sagsnavn, ' + config.extensionConfig.documentCreate.fileIdentCol +', henvendelsesdato ) AS ('
    var tables = []
    var result = []

    for (let l in DClayers) {
        // set the filter based on config
        var tablename = DClayers[l].split('.')[1]
        var filterCol, filterExp;

        // If looking by fileIdent
        if (isfileIdent) {
            //Ident filter
            var filterCol = config.extensionConfig.documentCreate.fileIdentCol
            var filterExp = '='
        } else {
            //Just reg. filter
            var filterCol = config.extensionConfig.documentCreate.tables.find(x => x.table == tablename).filterCol
            var filterExp = config.extensionConfig.documentCreate.tables.find(x => x.table == tablename).filterExp
        }

            tables.push('SELECT casenumber, sagsstatus, forsyningstype, prioritet, sagsnavn, ' + config.extensionConfig.documentCreate.fileIdentCol +', henvendelsesdato FROM ' + DClayers[l] + ' where ' + filterCol + ' ' + filterExp + ' \'' + key + '\'');
    }

    qrystr = qrystr + tables.join(' UNION ')
    qrystr = qrystr + ' ORDER BY henvendelsesdato DESC, sagsstatus asc, prioritet asc '
    qrystr = qrystr + ') select * from cases'
    //qrystr = qrystr + ') select ST_Extent(geom) from cte'
    //qrystr = qrystr + ') select ST_Extent(ST_Transform(ST_SetSRID(geom,4326),3857)) from cte' //Example for anything but 4326 - should be automatic TODO

    // query SQL for stuff
    $.ajax({
        url: gc2host + '/api/v1/sql/' +_USERSTR + '?q='+qrystr,
        type: "get",
        async: false,
        success: function(data) {
            //check for stuff
            console.log(data)
            if (data.features.length == 0 ||
                data.features[0].properties == null ||
                data.features[0].properties.fileident == null) {
                //nothing.. return null
                return null
            } else {
                // we got a result, process- and present it
                if (fileIdent) {
                    // create presentation for selected items
                    $('#documentList-feature-content').html('')
                    $('#documentList-feature-content').append('<table style="width:100%" border="1">')
                    $('#documentList-feature-content').append('<thead><tr>')
                    $('#documentList-feature-content').append('<th style="padding-right:5px;">Dato</th>'
                                                            + '<th style="padding-right:5px;">Status</th>'
                                                            + '<th style="padding-right:5px;">Forsyningsart</th>'
                                                            + '<th style="padding-right:5px;">Prioritet</th>'
                                                            + '<th style="padding-right:5px;">Ansvarlig</th>'
                                                            + '<th style="padding-right:5px;">Sag</th>' )
                    $('#documentList-feature-content').append('</tr></thead><tbody>')
                    data.features.forEach(function(d) {
                        if (d) {
                            $('#documentList-feature-content').append('<tr>')
                            $('#documentList-feature-content').append(
                                '<td style="padding-right:5px;">' + new moment(d.properties.henvendelsesdato).format("DD-MM-YYYY") + '</td>'
                                + '<td style="padding-right:5px;">' + d.properties.sagsstatus + '</td>'
                                + '<td style="padding-right:5px;">' + d.properties.forsyningstype + '</td>'
                                + '<td style="padding-right:5px;">' + d.properties.prioritet + '</td>'
                                + '<td style="padding-right:5px;">' + (d.properties.ansvarlig ? d.properties.ansvarlig : '') + '</td>'               
                                + '<td style="padding-right:5px;"><a href="docunote:/casenumber='+d.properties.casenumber + '">'+d.properties.sagsnavn+'</a></td>')
                            $('#documentList-feature-content').append('</tr>')
                        }
                        $('#documentList-feature-content').append('</tbody></table>');
                        SetGUI_ControlState(GUI_CONTROL_STATE.FEATURE_INFO_VISIBLE);
                    });
                }
                //create list with links
                result = data.features;
            }
        }
    });
    return result;
}


var documentCreateBuildFilter = function (key = undefined, isfileIdent = false) {

    //console.log(key)
    //console.log(isfileIdent)

    //Empty stuff
    var filter = {}

    for (let l in DClayers) {

        var tablename = DClayers[l].split('.')[1] //hack

        if (!key) {
            // If no key is set, create the "clear" filter
            filter[DClayers[l]] = {
                "match": "any",
                "columns": []
            }
        } else {
            // set the filter based on config
            var filterCol, filterExp;

            // If looking by fileIdent
            if (isfileIdent) {
                //Ident filter
                var filterCol = config.extensionConfig.documentCreate.fileIdentCol
                var filterExp = '='
            } else {
                //Just reg. filter
                var filterCol = config.extensionConfig.documentCreate.tables.find(x => x.table == tablename).filterCol
                var filterExp = config.extensionConfig.documentCreate.tables.find(x => x.table == tablename).filterExp
            }
            

            filter[DClayers[l]] = {
                "match": "any",
                "columns": [{
                    "fieldname": filterCol,
                    "expression": filterExp,
                    "value": key,
                    "restriction": false
                }]
            }
        }

    }
    //console.log(filter)
    // Return the stuff
    return filter
}

var documentCreateApplyFilter = function (filter) {
    for (let layerKey in filter){
        console.log('documentCreate - Apply filter to '+layerKey)

        //Make sure layer is on
        //TODO tænd laget hvis det ikke allerede er tændt! - skal være tændt før man kan ApplyFilter
        layerTree.reloadLayer(layerKey)            
            
        //Toggle the filter
        if (filter[layerKey].columns.length == 0) {
            // insert fixed dummy filter
            // in order to filter out all features from layer
            var blankfeed = {expression: "=",
                            fieldname: "adresse",
                            restriction: false,
                            value: "---"};
            filter[layerKey].columns.push(blankfeed);

            layerTree.onApplyArbitraryFiltersHandler({ layerKey,filters: filter[layerKey]}, 't');
        } else {
            layerTree.onApplyArbitraryFiltersHandler({ layerKey,filters: filter[layerKey]}, 't');
        }
        //Reload
        layerTree.reloadLayerOnFiltersChange(layerKey)

        continue;
    }
};
var clearExistingDocFilters = function () {
    // clear filters from layers that might be on! - then reload
    console.log('documentCreate - cleaning filters for reload')

    //Buildfilter with no value for "clear" value
    var filter = documentCreateBuildFilter()

    // apply filter, AND DO NOT RELOAD LAYERS
    documentCreateApplyFilter(filter, false);
};

/**
 *
 * @private
 */
var mapObj;
    
var onSearchLoad = function () {
    console.log('documentCreate - search trigered')
    //_checkLoginDocMenu();
    // VMR
    // filter to content on key
    getExistingDocs($('#documentCreate-custom-search').val());

    // Reset layer
    resultLayer.clearLayers();
    resultLayer.addLayer(this.layer)

    //this er retur-obj fra DAR evt løft værdi ud i skjult felt adgang is
    //console.log(this)
    console.log(this.geoJSON.features[0].properties.id)
    filterKey = $('#documentCreate-custom-search').val()
    //find esrnr + adresseid
    getEjdNr(this.geoJSON.features[0].properties.id);
 
    config.extensionConfig.documentCreate.tables[0].defaults.adgangsadresseid = this.geoJSON.features[0].properties.id
    config.extensionConfig.documentCreate.tables[1].defaults.adgangsadresseid = this.geoJSON.features[0].properties.id



    //move to marker
    cloud.get().zoomToExtentOfgeoJsonStore(this, config.extensionConfig.documentCreate.maxZoom);
    
    
    
    //Set the value to a default and build
    if (config.extensionConfig.documentCreate.defaulttable){
        //$('#' + select_id).val(config.extensionConfig.documentCreate.defaulttable)
        //$('#' + select_id + ' option[value=' + config.extensionConfig.documentCreate.defaulttable + ']').attr('selected','selected');
        //build
        buildFeatureMeta(config.extensionConfig.documentCreate.defaulttable)
    }
    //set submit button active and allow to edit map location
    SetGUI_ControlState(GUI_CONTROL_STATE.ACTIVATE_SUBMIT_CONTROL);
    utils.cursorStyle().crosshair();
    editingAllowed = true;
}

// find ejendomsnummer vha adgangsadresseid samt adresseid
// bruges senere til at placere sag i docunote
// abelsvej 8, https://dawa.aws.dk/adgangsadresser/0a3f5094-9776-32b8-e044-0003ba298018
// kristrupvej 1, https://dawa.aws.dk/adgangsadresser/0a3f5094-b7b0-32b8-e044-0003ba298018
var getEjdNr = function(adgangsadresseid) {
    var esr;
    var adresseid;
    $.ajax({
        url: 'https://dawa.aws.dk/adresser?adgangsadresseid='+adgangsadresseid,
        type: "get",
        async: false,
        success: function(data,status) {
            console.log(data)
            if (data[0].adgangsadresse == null) {
                //nothing.. return null
                return null
            } else {
                //danner esr ejendomsnummer
                var str = data[0].adgangsadresse.esrejendomsnr;
                var komkode = data[0].adgangsadresse.kommune.kode.replace(/^0+/, '');
                esr = new Array(7 - data[0].adgangsadresse.esrejendomsnr.length + 1).join("0") + data[0].adgangsadresse.esrejendomsnr;
                esr = komkode.concat(esr);
                adresseid = data[0].id;

                config.extensionConfig.documentCreate.tables[0].defaults.esrnr = esr
                config.extensionConfig.documentCreate.tables[1].defaults.esrnr = esr
                config.extensionConfig.documentCreate.tables[0].defaults.adresseid = adresseid
                config.extensionConfig.documentCreate.tables[1].defaults.adresseid = adresseid
                //buildFeatureMeta($('#'+select_id).val())
                // return {
                //     "adresseid":adresseid,
                //     "esr":esr
                // }  
                return 1             
            }
        }
    })
        //return [adressid,esr]
      //  return
    };
    

/**
 * Checks login
 */
var _checkLoginDocMenu = function () {    
    xhr = $.ajax({
        method: "GET",
        url: "/api/session/status",
        async: false,
        scriptCharset: "utf-8",
        success: function (response) {
            if (response.status.authenticated == true) {
                // determine user role (USER OR SUB_USER)
                //$("documentCreate-custom-search").prop('disabled', false);
                if (response.status.subUser == false) {
                    currentUserRole = userRole.USER;
                    _USERSTR = response.status.userName
                    return response.status.authenticated;
                } else {
                    currentUserRole = userRole.SUB_USER;
                    _USERSTR = response.status.screen_name + '@' + urlparser.db;
                    return response.status.authenticated;
                }

            } else {
                //disable submit button
                clearExistingDocFilters();
                $('#documentList-feature-content').html('')
                //$("documentCreate-custom-search").prop('disabled', true);
                DClayers = [];
                // reset add. search
                $("#" + id).val('');
                resultLayer.clearLayers();
                _USERSTR = "";
                return response.status.unauthorized;

            } 
        },
        error: function () {
            throw new Error('Fejl i request');
        }
    })
    
};

/**
 * 
 * @param {*} tablename 
 * @param {*} feature 
 */

var snack = function (msg) {
    jquery.snackbar({
        htmlAllowed: true,
        content: '<p>'+msg+'</p>',
        timeout: 10000
    });
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
 * Function adds feature to using rest-API, make this configurable to any other rest-based service
 * If it's set in config
 */
var documentCreateFeatureSend = function (tablename,feature) {
    // Send tile feature to DocuNote!
    feature.db = db
    feature.schema = schema
    feature.tablename = tablename
    var xhr = $.ajax({
        method: "POST",
        url: "/api/extension/documentCreateSendFeature",
        //ata: "feature=" + feature + "&db=" + db,
        data: feature,
        //db: db,
        scriptCharset: "utf-8",
        success: function (xhr) {
//            snack(__("GC2 Success")+': '+xhr.responseJSON.message);
//            var jsonmessage = JSON.parse(xhr.responseText);
            //snack(__("GC2 Success")+': '+ xhr.message);
            window.location = "docunote:/CaseNumber="+xhr.casenumber;
            // prepend existing cases list
            getExistingDocs($('#documentCreate-custom-search').val());
        },
        error: function () {
//            snack(__("GC2 Error")+': '+xhr.responseJSON.message);
            snack(__("GC2 Error")+': '+xhr.responseText);
        }
    });

}

 /**
 * This function compiles values in selectbox from layers in schema with the correct tag
 * @returns {*}
 * @private
 */
var buildServiceSelect = function (id) {
    DClayers = [];
    // clear select services
    $('#'+select_id).find('option').remove().end().append('<option value=""></option>').val('')
    
    metaData.data.forEach(function(d) {
        if (d.tags) {
            // Add layer to select box if tag is correctly defined
            if (d.tags.includes(config.extensionConfig.documentCreate.metaTag)) {
                if (d.f_table_schema+'.'+d.f_table_name == config.extensionConfig.documentCreate.defaulttable) {
                    $('#'+select_id).append('<option selected value="'+d.f_table_schema+'.'+d.f_table_name+'">'+d.f_table_title+'</option>');
                } else {
                    $('#'+select_id).append('<option value="'+d.f_table_schema+'.'+d.f_table_name+'">'+d.f_table_title+'</option>');
                }
                DClayers.push(d.f_table_schema+'.'+d.f_table_name);
            };
        }

    });
    
};

 /**
 * This function builds metafields from config and how the layers are set up in GC2 and in config file
 * @returns {*}
 * @private
 */
var buildFeatureMeta = function (layer, previousLayer = undefined) {

    //merge information from metadata
    var m = {}

    metaData.data.forEach(function (d) {       
        if(d.fields) {
            //Get information from config.json
            var confLayer = config.extensionConfig.documentCreate.tables.find(x => x.table == d.f_table_name)
            // set the backgroundlayer invisible
            if (confLayer && confLayer.cosmeticbackgroundlayer) {
                switchLayer.init(confLayer.cosmeticbackgroundlayer, false, false, false);
            }
        }

        if (d.f_table_name == layer.split('.')[1] && d.f_table_schema == layer.split('.')[0]) {
            m = d
        }
    })

    var fields = m.fields
    if (m.fields) {
        var fieldconf = JSON.parse(m.fieldconf)
        var order = []
        var col;
        //Get information from config.json
        var conf = config.extensionConfig.documentCreate.tables.find(x => x.table == m.f_table_name)

        // set the backgroundlayer visible
        if (conf.cosmeticbackgroundlayer) {
            layerTree.reloadLayer(conf.cosmeticbackgroundlayer);
        }
        
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
            obj.hidden = $.inArray(col, conf["hidden"])
            //optional is set in config
            obj.optional = $.inArray(col, conf["optional"])
            //defaults
            if (conf["defaults"][col] !== undefined) {
                obj.defaults = conf["defaults"][col]
            }
            //Ignore pkey and geom
            if (m["pkey"] == obj.colName || m["f_geometry_column"] == obj.colName) {
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
    }

};

/**
 * This function builds metafields from config and how the layers are set up in GC2 and in config file
 * @param order Ordered array of fields to be created
 * @returns {*}
 * @private
 */
var FeatureFormFactory = function (order) {
    
    // remove previous items
    $('#documentCreate-feature-meta').html('');
    //scaffold form
    $('#documentCreate-feature-meta').append('<h3>'+__("Henvendelse")+'</h3>')
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
    $('#'+form_id).append('<button type="submit" class="btn btn-primary">'+__('Indsend')+'</button>')
    SetGUI_ControlState(GUI_CONTROL_STATE.ACTIVATE_SUBMIT_CONTROL);
}

/**
 * This function sets gui contorls visible/invisible according to the specific state
 * Legal values, choose from GUI_CONTROL_STATE Enumeration.
 * Important notice, one or more states can be set simultaneuosly
 * @param state_Enum The number to set controls visible/invisible
 * @private
 */
var SetGUI_ControlState = function (state_Enum) {

    if (state_Enum >= GUI_CONTROL_STATE.NO_CONTROLS_VISIBLE) {
        // implementation specific is to hide all controls
        $('#documentCreate-feature-editcontent').hide();  
        $('#documentCreate-feature-content').hide();         
        $('#documentList-feature-content').hide();        
        $('#documentCreate-feature-filter').hide();
        $('#documentCreate-feature-filter-header-create').hide();
        $('#documentCreate-feature-filter-header-edit').hide();
        $('#documentCreate-newfeature-content').hide();
        $('#documentCreate-feature-meta').html('');    
        
        

        // subtract this enumeration, and continue
        state_Enum -= GUI_CONTROL_STATE.NO_CONTROLS_VISIBLE;
    }
    if (state_Enum >= GUI_CONTROL_STATE.AUTHENTICATE_SHOW_ALERT) {
        $('#documentCreate-feature-login').show(); 

        // subtract this enumeration, and continue
        state_Enum -= GUI_CONTROL_STATE.AUTHENTICATE_SHOW_ALERT;
    }
    if (state_Enum >= GUI_CONTROL_STATE.AUTHENTICATE_HIDE_ALERT) {        
        $('#documentCreate-feature-login').hide(); 

        // subtract this enumeration, and continue
        state_Enum -= GUI_CONTROL_STATE.AUTHENTICATE_HIDE_ALERT;
    }
    if (state_Enum >= GUI_CONTROL_STATE.EDIT_CONTROLS_VISIBLE) {
        $('#documentCreate-feature-editcontent').show();
        $('#documentCreate-feature-filter-header-edit').show();
        $('#documentList-feature-content').show();        
        $('#documentCreate-newfeature-content').show();

        // subtract this enumeration, and continue
        state_Enum -= GUI_CONTROL_STATE.EDIT_CONTROLS_VISIBLE;
    }
    if (state_Enum >= GUI_CONTROL_STATE.FEATURE_INFO_VISIBLE) {
        $('#documentCreate-feature-filter').show();
        
        // subtract this enumeration, and continue
        state_Enum -= GUI_CONTROL_STATE.FEATURE_INFO_VISIBLE;
    } 
    if (state_Enum >= GUI_CONTROL_STATE.ACTIVATE_SUBMIT_CONTROL) {
        // Set Submit text and button active (performed, when legal adress is entered)
        $('#documentCreate-feature-filter-header-create').show();
        $('#documentList-feature-content').show();

        // subtract this enumeration, and continue
        state_Enum -= GUI_CONTROL_STATE.ACTIVATE_SUBMIT_CONTROL;
    }
    if (state_Enum >= GUI_CONTROL_STATE.FEATURE_CONTENT_VISIBLE) {
        $('#documentCreate-feature-content').show();
        $('#documentCreate-newfeature-content').show();

        // subtract this enumeration, and continue
        state_Enum -= GUI_CONTROL_STATE.CREATE_CONTROLS_VISIBLE;
    }
}

/**
 * This function is only ron once pr session and initializes filters
 * @private
 */
var loadAndInitFilters = function (active_state) {
    try {    
        //check login status
        //_checkLoginDocMenu();
        if (active_state === true &&
            DClayers.length == 0) {   

            buildServiceSelect(select_id);
        }        
    } catch (error) {
        console.info('documentCreate - Kunne ikke bygge ServiceSelect')
        console.log(error.stack);
        return;
    }
    if (firstRunner && _USERSTR.length > 0) {
        firstRunner = false;
        try {
            // If key is set, go there and get stuff!
            if (filterKey) {
                console.log('filterKey is set, filterKey: ' + filterKey)
                getExistingDocs(filterKey)
            } else if (fileIdent) {
                console.log('fileIdent is set, fileIdent: ' + fileIdent)
                getExistingDocs(fileIdent, true)
            } else {
                console.log('clearing doc filters')
                SetGUI_ControlState(GUI_CONTROL_STATE.FEATURE_CONTENT_VISIBLE);
                clearExistingDocFilters()
            }
        } catch (error) {
            console.log(error.stack);
            console.info('loadAndInitFilters - failed due to layers are not yet loaded, hence reset firstRunnervariable');
            firstRunner = true;
        }
    }
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
                "da_DK": "Opret henvendelse",
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

            "SaveEditButton": {
                "da_DK": "Gem ny placering",
                "en_US": "Save new location"
            },

            "Edit location": {
                "da_DK": "Rediger placering",
                "en_US": "Edit location"
            },

            "EditButton": {
                "da_DK": "Udpeg ny placering",
                "en_US": "Select new location"
            },
            "NewButton": {
                "da_DK": "Ny henvendelse",
                "en_US": "New incident"
            },

            "Henvendelse": {
                "da_DK": "Henvendelse",
                "en_US": "Information"
            },

            "Submit": {
                "da_DK": "Indsend",
                "en_US": "Submit action"
            },
/*
            "GC2 Success": {
                "da_DK": "Henvendelse gemt i GC2",
                "en_US": "Action saved in GC2" 
            },
*/
            "Location saved": {
                "da_DK": "Den ny placering er gemt",
                "en_US": "The new location is saved" 
            },
            "GC2 Error": {
                "da_DK": "Der skete en fejl da henvendelsen skulle oprettes",
                "en_US": "There was an error while saving the action" 
            },
            "Start med nøgle": {
                "da_DK": "Leder efter henvendelser på adresse",
                "en_US": "Looking for actions on adress" 
            },
            "Start uden nøgle": {
                "da_DK": "Nulstiller filters",
                "en_US": "Resetting filters" 
            },
            "Nulstil": {
                "da_DK": "Nulstil",
                "en_US": "Reset"                 
            },
            "List selection edit": {
                "da_DK": "Detaljer på sag",
                "en_US": "File properties"                 
            },
            "List selection create": {
                "da_DK": "Henvendelser på samme adresse",
                "en_US": "Requests on the same address"                 
            },
            "MissingLogin": {
                "da_DK": "NB: Du skal logge ind for at kunne bruge funktionen",
                "en_US": "Please log in to use this function"                 
            },
            "Ingen objekter fundet": {
                "da_DK": "Der blev ikke fundet oplysninger på henvendelsen, ident: ",
                "en_US": "No informationer was found on following ident: "                 
            }
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
                    me.setState({
                        active: false
                    });
                });

                // Activates module
                backboneEvents.get().on(`on:${exId}`, () => {
                    console.log('Starting documentCreate')
                    me.setState({
                        active: true
                    });
                    if (_USERSTR.length == 0)
                        SetGUI_ControlState(GUI_CONTROL_STATE.AUTHENTICATE_SHOW_ALERT);
                });
                
                // Deactivates module
                backboneEvents.get().on(`off:${exId} off:all reset:all`, () => {
                    console.log('Stopping documentCreate')
                    me.setState({
                        active: false
                    });
                    firstRunner = true;
                    utils.cursorStyle().reset();
                });
                
                backboneEvents.get().on("allDoneLoading:layers", function () {
                    console.log("inside allDoneLoading:layers, DClayers.length: " + DClayers.length + " me.state.active: " + me.state.active + " firstRunner: " + firstRunner);                    
                    loadAndInitFilters(me.state.active);
                });

                console.log('documentCreate - Mounted')

                //Initiate searchBar
                search.init(onSearchLoad, id, true, false);
                cloud.get().map.addLayer(resultLayer);

                
                // Handle click events on map
                // ==========================

                mapObj.on("dblclick", function () {
                    clicktimer = undefined;
                });

                mapObj.on("click", function (e) {
                    if (me.state.active === false) {
                        return;
                    }
                    let event = new geocloud.clickEvent(e, cloud);
                    if (clicktimer) {
                        clearTimeout(clicktimer);
                    }
                    else {
                        if (me.state.active === false) {
                            return;
                        }
                        if (editingAllowed) {
                            //Clear search geom and add clicked as marker
                            //console.log('Moving target')
                            resultLayer.clearLayers();
                    
                            coords = event.getCoordinate();
                            var wkt = "POINT(" + coords.lng + " " + coords.lat + ")";
                    
                            //console.log(coords)
                    
                            //make a marker that behaves like the one from search
                            var marker = L.marker([coords.lat, coords.lng], {
                                icon: L.AwesomeMarkers.icon({
                                    icon: 'home',
                                    markerColor: '#C31919',
                                    prefix: 'fa'
                                })
                            }).addTo(resultLayer);
                            mapObj.setView([coords.lat, coords.lng], config.extensionConfig.documentCreate.maxZoom);
                        }
                    }
                });

                backboneEvents.get().on(`session:authChange`, (authenticated) => {
                    console.log("inside session:authChang, authenticated: " + authenticated);
                    _checkLoginDocMenu();
                    if (authenticated) {
                        // determine user role (USER OR SUB_USER)
                        //$("documentCreate-custom-search").prop('disabled', false);
                        SetGUI_ControlState(GUI_CONTROL_STATE.AUTHENTICATE_HIDE_ALERT);
                        me.setState({
                            active: true
                        });  
                        
                        // TODO: overveje om dette skal fjernes efter session autologin fix
                        buildServiceSelect(select_id);
                        // run method here in order to support switch in event order, when running
                        // extension along with the session object autoLogin feature
                        loadAndInitFilters(me.state.active);                        
                    } else {
                        // disable all controls
                        // notify, no user is logged in
                        SetGUI_ControlState(GUI_CONTROL_STATE.NO_CONTROLS_VISIBLE + GUI_CONTROL_STATE.AUTHENTICATE_SHOW_ALERT);
                        editingAllowed = false;
                        /*
                        //disable submit button
                        // $('#mapGo-btn').attr('checked', false);
                        $("documentCreate-custom-search").prop('disabled', true);
                        */
                        clearExistingDocFilters();
                        $('#documentList-feature-content').html('');
                        firstRunner = true;
                        DClayers = [];
                            // reset add. search
                        $("#" + id).val('');
                        resultLayer.clearLayers();
                    } 
                });

                // Handle change in service type
                // ==========================
                this.onServiceChange = function (e) {
                    //console.log('select was changed')

                    //rebuild from metaData
                    if ($('#'+select_id).val() != '') {

                        //Build the boxes
                        buildFeatureMeta($('#'+select_id).val(), thePreviousServiceValue);

                    } else {
                        // "Nothing" is chosen, hide the meta
                        SetGUI_ControlState(GUI_CONTROL_STATE.NO_CONTROLS_VISIBLE)
                        editingAllowed = false;
                    };

                };

                this.onServiceFocus = function (e) {
                    if ($('#'+select_id).val() != '') {
                        thePreviousServiceValue = $('#'+select_id).val();
                    }
                };
                

            }

            /**
             * Invoked, when EditButton is clickerd
             */
            newButtonClicked () {                
                // reset select to default layer
                if (DClayers.length > 0) {
                    $('#'+select_id+' option[value="'+config.extensionConfig.documentCreate.defaulttable+'"]').prop('selected', true);                    
                }

                // reset previous search and selewcted values
                $('#documentCreate-custom-search').val('');
                filterKey = '';
                fileIdent = '';
                editingAllowed = false;

                // reload map in order to remove selection filters
                SetGUI_ControlState(GUI_CONTROL_STATE.NO_CONTROLS_VISIBLE);
                SetGUI_ControlState(GUI_CONTROL_STATE.FEATURE_CONTENT_VISIBLE);
                clearExistingDocFilters();

                // reset map
                utils.cursorStyle().reset();
                resultLayer.clearLayers();
            };

            /**
             * Invoked, when EditButton is clickerd
             */
            editButtonClicked () {
                utils.cursorStyle().crosshair();
                editingAllowed = true;
                
            };

            /**
             * Invoked, when SaveButton is clickerd
             */
            saveButtonClicked (fileident) {
                if (coords && fileident) {

                    // preparing save stuff here...
                    // loop through all layers and attempt save
                    // since we do note know which layer is the origin
                    for (let l in DClayers) {
                        // set the filter based on config
                        var filterCol, filterExp;
                        var qrystr = ('UPDATE ' + DClayers[l] + ' SET the_geom = ' +
                                    'ST_GeomFromText(\'POINT(' + coords.lng + ' ' + coords.lat + ')\', 4326) ' + 
                                    'where ' + config.extensionConfig.documentCreate.fileIdentCol + '=\'' + fileIdent + '\'');
                                    /* +
                                        'select * FROM ' + DClayers[l] + 
                                        ' where ' + config.extensionConfig.documentCreate.fileIdentCol + '=\'' + fileIdent + '\'');
            */
                        // execute SQL for update thing   
                        var xhr = $.ajax({
                            method: "POST",
                            url: "/api/extension/documentCreateEditFeature",
                            data: "db=" + db + "&sql=" + qrystr,
                            scriptCharset: "utf-8",
                            success: function (response) {
                                // origin layer foun, put message on the screen
                                //snack(__("Location saved"));  
                                // update filter
                                getExistingDocs(fileIdent, true)                                     
                            },
                            error: function (error) {
                                if (error.message == 'incorrect layer') {
                                // ignore message, wrong layer, continue to the next layer
                                } else {
                                    // origin layer foun, put message on the screen
                                    snack(__("GC2 Error: ")+': '+xhr.responseText);                
                                }
                            }
                        });        
                    }

                    // block editing until next time edit button is pressed
                    editingAllowed = false;
                    // reset coords
                    coords = null;    
                }
            };



            /**
             *
             * @returns {XML}
             */
            render() {
                return (

                    <div role="tabpanel">
                        <div className="form-group">

                            <div id="documentCreate-feature-login" className="alert alert-info" role="alert">
                                {__("MissingLogin")}
                            </div>
                            <div id="documentCreate-newfeature-content" className='collapse'>  
                                <button type="button" onClick={this.newButtonClicked} className="btn btn-primary">{__("NewButton")}</button>                                
                            </div>
                            <div id="documentCreate-feature-content" className='collapse'>    
                                <h3>{__("Pick location")}</h3>
                                <div    id="documentCreate-places"
                                        className="places">
                                    <input  id={id}
                                            className={id + ' typeahead'}
                                            type="text"
                                            placeholder="Adresse"/>
                                </div>
                                <h3>{__("Choose service")}</h3>
                                <div>
                                    <select id={select_id} className='form-control' onChange={this.onServiceChange} onFocus={this.onServiceFocus} defaultValue=''>
                                            <option value=""></option>
                                    </select>
                                    <div id="documentCreate-feature-meta" className=''>
                                    </div>
                                </div> 
                            </div>
                            <div id="documentCreate-feature-editcontent" className='collapse'>    
                                <h3>{__("Edit location")}</h3>
                                <button type="button" onClick={this.editButtonClicked} className="btn btn-primary">{__("EditButton")}</button>
                                <button type="button" onClick={(fileident) => this.saveButtonClicked(fileident)} className="btn btn-primary">{__("SaveEditButton")}</button>
                            </div>
                            <div id="documentCreate-feature-filter-header-edit" className="collapse list-group">
                                <h3>{__("List selection edit")}</h3>                                
                            </div>
                            <div id="documentCreate-feature-filter-header-create" className="collapse list-group">
                                <h3>{__("List selection create")}</h3>                                
                            </div>
                            <div id="documentCreate-feature-filter" className="collapse list-group">
                                <div id="documentList-feature-content" className='collapse'>    
                                </div>
                            </div>
                        </div>
                    </div>
                );
            }
        }

        // Create tab
        utils.createMainTab(exId, __("Ext name"), __("Help"), require('./../../../browser/modules/height')().max, "flash_on", false, exId);
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
