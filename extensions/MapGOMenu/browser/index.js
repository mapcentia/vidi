/**
 * @fileoverview Description of file, its uses and information
 * about its dependencies.
 */

'use strict';
/**
*clonedeep	 
*/
var cloneDeep = require('lodash.clonedeep');
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
var search = require('./../../../browser/modules/search/danish');

/**
 *
 * @type {*|exports|module.exports}
 */
var backboneEvents;

/**
 *
 * IMPORTANT: API key
 */
var APIKEY = "";

/**
 *
 * @type {*|exports|module.exports}
 */
var urlparser = require('./../../../browser/modules/urlparser');


/**
 * @type {string}
 */
var db = urlparser.db;

/**
 * @type {string}
 */
var schema = urlparser.schema;


/**
 * @type {*|exports|module.exports}
 */
var io = require('socket.io-client');

/**
 * @type {*|exports|module.exports}
 */
var socketId;

/**
 *
 * @type {L.FeatureGroup}
 */
var bufferItems = new L.FeatureGroup();

/**
 *
 * @type {L.FeatureGroup}
 */
var drawnItems = new L.FeatureGroup();


/**
 *
 * @type {L.FeatureGroup}
 */
var dataItems = new L.FeatureGroup();

/**
 *
 * @type {string}
 */
var BACKEND = require('../../../config/config.js').backend;

/**
 *
 */
let dataStore;

/**
 *
 */
var xhr;


/**
 *
 * @type {string}
 */
var id = "mapGo-custom-search";

var _result;

require('bootstrap-select');

/**
*
* @type {string}
*/
var GC2_HOST = require('../../../config/config.js').gc2.host;
GC2_HOST = (GC2_HOST.split("http://").length > 1 ? GC2_HOST.split("http://")[1] : GC2_HOST);

/**
 *
 * @private
 */
var _clearDrawItems = function () {
    drawnItems.clearLayers();
    bufferItems.clearLayers();
};

/**
 *
 * @private
 */
var _clearDataItems = function () {
    dataItems.clearLayers();
};

/**
 *
 * @private
 */
var _clearInfoItems = function () {
    $("#mapGo-amount-pane").empty();    
};

/**
 *
 * @private
 */
var _clearAllItems = function () {
    _clearDrawItems();
    _clearInfoItems();
    _clearDataItems();
};

var userRole  = {
    ANONYMOUS : 0,
    USER : 1,
    SUB_USER : 2
}
var currentUserRole = userRole.ANONYMOUS;

var command  = {
    CREATE_SAMPLE : 0,
    CREATE_INCIDENT : 1,
    INCIDENT_SUCCES : 2,
    INCIDENT_FAIL : 3,
    INCIDENT_CANCEL : 4
}

/**
 *
 * @private
 */
var _zoomToFeature = function (selectedDistrict, selectedElements, loadElementList, selectedSample) {
    try {
        dataStore.abort();
    } catch (e) {
    }
    var expression = "";

    // construct expression from selected sample (stikprøve)
    if (selectedSample != null) {
        expression = "WITH elementer AS ( " +
        "SELECT geometri FROM " + schema + ".go_incident_fl WHERE gc2_version_gid = " + selectedSample +  " AND element_type IN (" + selectedElements + ") " +
        "UNION " +
        "SELECT geometri FROM " + schema + ".go_incident_li WHERE gc2_version_gid = " + selectedSample +  " AND element_type IN (" + selectedElements + ") " +
        "UNION " +
        "SELECT geometri FROM " + schema + ".go_incident_pkt WHERE gc2_version_gid = " + selectedSample +  " AND element_type IN (" + selectedElements + ") " +
        ") " +
        "SELECT geometri FROM elementer"
    } else if (selectedElements != null) {
        if (selectedElements.length == 0) {
            // return - quit
            _clearDataItems();                        
            return;
        }
        // construct expression from selected district 
        // and optionally one or more selected elements
        expression = "WITH elementer AS ( " +
            "SELECT t_6800_parl_fl_t.geometri FROM " + schema + ".t_6800_parl_fl_t INNER JOIN " + schema + ".t_6803_parl_omr_t ON " + schema + ".t_6800_parl_fl_t.arbejdssted_id = t_6803_parl_omr_t.gc2_version_gid WHERE t_6803_parl_omr_t.gc2_version_gid=" + selectedDistrict + " AND vedlhold_f_type_kode IN (" + selectedElements + ") " +
            "UNION " +
            "SELECT t_6801_parl_li_t.geometri FROM " + schema + ".t_6801_parl_li_t INNER JOIN " + schema + ".t_6803_parl_omr_t ON " + schema + ".t_6801_parl_li_t.arbejdssted_id = t_6803_parl_omr_t.gc2_version_gid WHERE t_6803_parl_omr_t.gc2_version_gid=" + selectedDistrict + " AND vedlhold_l_type_kode IN (" + selectedElements + ") " +
            "UNION " +
            "SELECT t_6802_parl_pkt_t.geometri FROM " + schema + ".t_6802_parl_pkt_t INNER JOIN " + schema + ".t_6803_parl_omr_t ON " + schema + ".t_6802_parl_pkt_t.arbejdssted_id = t_6803_parl_omr_t.gc2_version_gid WHERE t_6803_parl_omr_t.gc2_version_gid=" + selectedDistrict + " AND vedlhold_p_type_kode IN (" + selectedElements + ") " +
            ") " +
            "SELECT geometri FROM elementer";
    } else if (selectedDistrict != null) {
        if (selectedDistrict.length == 0) {
            // return - quit
            _clearDataItems();
            // clear element list
            $("#go_menu_element_item").val("");
            $("#go_menu_element_item").empty();
            return;
        }
        expression = "SELECT * FROM " + schema + ".t_6803_parl_omr_t WHERE gc2_version_gid=" + selectedDistrict;
    } else {
        // return - quit
        _clearDataItems();
        // clear element list
        $("#go_menu_element_item").val("");
        $("#go_menu_element_item").empty();
        return;
    }

    var onLoad = function () {
        _clearDataItems();        
        dataItems.addLayer(this.layer);
		const deepcloned = cloneDeep(this.layer);
		console.log('\n clone clone clone clone\n', deepcloned);
        cloud.zoomToExtentOfgeoJsonStore(this,19);

        if (loadElementList) {
            _loadElementList(selectedDistrict);
        }        
    };
    switch (BACKEND) {
        case "gc2":
            dataStore = new geocloud.sqlStore({
                jsonp: false,
                method: "POST",
                host: "",
                db: db,
                uri: "/api/sql/nocache",
                id: 1,
                base64:true, 
                sql: expression,
               // key: APIKEY,
                onLoad: onLoad
            });
            break;
        case "cartodb":
            throw "Unsupported feature cartodb";
            break;
    }
	console.log(dataStore)
    dataStore.load();
};

/* let dataStore = new geocloud.sqlStore({
    jsonp: false,
    method: "POST",
    host: "",
    db: "mapgodemo",
    uri: "/api/sql/nocache",
    id: "1",
    base64: true, 
    sql: "SELECT gc2_version_gid, pg_distrikt_nr FROM " + schema + ".t_6803_parl_omr_t ORDER by pg_distrikt_nr",
    //sql: "SELECT 'test' as test",
    onLoad: onLoad */

/**
*
* @private
*/
var _clearAndReloadSampleElements = function () {
    // please note: this method is only run once pr. session.
    if ($('#go_menu_sample option').size() > 0)
        // checkbox content has been loaded, so return
        return;

    try {
        dataStore.abort();
    } catch (e) {
    }
    var onLoad = function () {
        $("#go_menu_sample").val("");
        $("#go_menu_sample").empty();
        iterateData(this.geoJSON.features);
        // enable element picker
        $('#go_menu_sample').removeClass('disabled');
        $("#go_menu_sample").selectpicker('refresh');
        $("#go_menu_sample").val("");
        $("#go_menu_sample").prop('selectedIndex', -1)
        // refresh selectpicker list
    };
    var iterateData = function(data){
        var optgroupname = ""
        for (var key in data) {
            if (data[key].properties.vedlhold_type_kode) {
                if (optgroupname != data[key].properties.element_gruppe) {
                    // store optgroup name, finish prevoius optgroup and create optgroup
                    optgroupname = data[key].properties.element_gruppe;
                    $("#go_menu_sample").append('<optgroup id="' + data[key].properties.element_gruppe_id + '" label="' + optgroupname + '"></optgroup>');
                }
                //$("<option>").text(data[key].properties.vedl_type).appendTo( $("#" + data[key].properties.id) );
                //$("#go_menu_sample ").append('<option data-subtext=' + data[key].properties.vedlhold_type_kode + ' value="' + data[key].properties.vedlhold_type_kode + '">' + data[key].properties.vedl_type + '</option>');
                $("#" + data[key].properties.element_gruppe_id).append('<option data-subtext=' + data[key].properties.vedlhold_type_kode + ' value="' + data[key].properties.vedlhold_type_kode + '">' + data[key].properties.vedl_type + '</option>');
            }
    }};
    switch (BACKEND) {
        case "gc2":
            dataStore = new geocloud.sqlStore({
                jsonp: false,
                method: "POST",
                //host: GC2_HOST,
                host:"",
                db: db,
                uri: "/api/sql/nocache",
                id: "1",
                base64: true,
                //  db: db,
                // uri: "/api/v1/sql",
                 sql: "WITH elementer AS ( " + 
                    "SELECT vedlhold_f_type_kode as vedlhold_type_kode, vedlhold_f_type as vedl_type, element_gruppe, id as element_gruppe_id FROM " + schema + ".d_6800_vedlhold_f_type INNER JOIN " + schema + ".go_elementgrupper ON d_6800_vedlhold_f_type.elementgruppe_id = go_elementgrupper.id WHERE aktiv = 1 " + 
                    "UNION " + 
                    "SELECT vedlhold_l_type_kode as vedlhold_type_kode, vedlhold_l_type as vedl_type, element_gruppe, id as element_gruppe_id FROM " + schema + ".d_6801_vedlhold_l_type INNER JOIN " + schema + ".go_elementgrupper ON d_6801_vedlhold_l_type.elementgruppe_id = go_elementgrupper.id WHERE aktiv = 1 " + 
                    "UNION " + 
                    "SELECT vedlhold_p_type_kode as vedlhold_type_kode, vedlhold_p_type as vedl_type, element_gruppe, id as element_gruppe_id FROM " + schema + ".d_6802_groenvedligh_punkt INNER JOIN " + schema + ".go_elementgrupper ON d_6802_groenvedligh_punkt.elementgruppe_id = go_elementgrupper.id WHERE aktiv = 1) " + 
                    "SELECT * FROM elementer " + 
                    "order by element_gruppe_id,  (substring(vedl_type, '^[0-9]+'))::int, substring(vedl_type, '[^0-9_].*$')",
                //key: APIKEY,
                onLoad: onLoad
            });
            break;
        case "cartodb":
            throw "Unsupported feature cartodb";
            break;
    }
    dataStore.load();
};


/**
*
* @private
*/
var _clearAndReloadCreatedSampleElements = function () {    
    // try {
        // dataStore.abort();
    // } catch (e) {
    // }
    var onLoad = function () {
        // todo: clear samples list
        iterateData(this.geoJSON.features);
    };

    var iterateData = function(data){
        // todo: iterate throug data and load elements
        var kode = -1;
        $("#acc_samples").empty();
        for (var key in data) {
            if (data[key].properties.vedlhold_type_kode) {
                if (kode != data[key].properties.vedlhold_type_kode) {
                    kode = data[key].properties.vedlhold_type_kode;   
                    // create new collapsible accordion
                    var appendGroupStr = "";
                    appendGroupStr += '<div class="panel-heading">';
                    appendGroupStr += '<h4 class="panel-title">';
                    appendGroupStr += '<a data-toggle="collapse" data-parent="#samples_accordion" href="#'  + kode + '">' + data[key].properties.vedlhold_type + '</a>';
                    appendGroupStr += '</h4>';
                    appendGroupStr += '</div>';                               
                    appendGroupStr += '<div id="' + kode + '" class="panel-collapse collapse">';
                    appendGroupStr += '</div>';
                    $("#acc_samples").append(appendGroupStr);                    
                }
                var appendChildStr = "";
                appendChildStr += '<div id="' + kode + "_" + data[key].properties.element_id + '" class="panel-body">';
                appendChildStr += '<b>' + data[key].properties.arbejdssted +'</b><br>';
                appendChildStr += '<table width="100%"><tr>';
                appendChildStr += '<td><a><button id="' + kode + "_" + data[key].properties.element_id + '_goto" type="button" class="btn btn-md btn-primary">Gå til...</button></a></td>';
                appendChildStr += '<td><a><button id="' + kode + "_" + data[key].properties.element_id + '_ack" type="button" class="btn btn-md btn-success">OK</button></a></td>';
                appendChildStr += '</tr><tr>';
                appendChildStr += '<td><a><button id="' + kode + "_" + data[key].properties.element_id + '_nack" type="button" class="btn btn-md btn-danger">Fejl</button></a></td>';
                appendChildStr += '<td><a><button id="' + kode + "_" + data[key].properties.element_id + '_cancel" type="button" class="btn btn-md btn-secondary">Slet</button></a></td>';
                appendChildStr += '</tr></table>';
                appendChildStr += '</div>';
                $("#" + kode).append(appendChildStr);
                $("#" + kode + "_" + data[key].properties.element_id + "_goto").click(function (e) {
                    var spl = this.id.split('_');
                    _zoomToFeature(null, spl[0], null, spl[1]);
                });
                $("#" + kode + "_" + data[key].properties.element_id + "_ack").click(function (e) {
                    var spl = this.id.split('_');
                    _sampleFeedback(spl[0], spl[1], command.INCIDENT_SUCCES);
                });
                $("#" + kode + "_" + data[key].properties.element_id + "_nack").click(function (e) {
                    var spl = this.id.split('_');
                    _sampleFeedback(spl[0], spl[1], command.INCIDENT_FAIL);
                });
                $("#" + kode + "_" + data[key].properties.element_id + "_cancel").click(function (e) {
                    var spl = this.id.split('_');
                    _sampleFeedback(spl[0], spl[1], command.INCIDENT_CANCEL);
                });
                
            }
        
     }};

    switch (BACKEND) {
        case "gc2":
            dataStore = new geocloud.sqlStore({
                jsonp: false,
                method: "POST",
                //host: GC2_HOST,
                host:"",
                db: db,
                uri: "/api/sql/nocache",
                id: "1",
                base64: true,
                sql: "WITH elementer AS ( " +
                        "SELECT gc2_version_gid as element_id, element_type as vedlhold_type_kode, vedlhold_f_type as vedlhold_type, arbejdssted as arbejdssted, geometri as geometri FROM " + schema + ".go_incident_fl INNER JOIN " + schema + ".d_6800_vedlhold_f_type ON go_incident_fl.element_type = d_6800_vedlhold_f_type.vedlhold_f_type_kode WHERE go_incident_type = " + command.CREATE_SAMPLE + " " +
                        "UNION " +
                        "SELECT gc2_version_gid as element_id, element_type as vedlhold_type_kode, vedlhold_l_type as vedlhold_type, arbejdssted as arbejdssted, geometri as geometri FROM " + schema + ".go_incident_li INNER JOIN " + schema + ".d_6801_vedlhold_l_type ON go_incident_li.element_type = d_6801_vedlhold_l_type.vedlhold_l_type_kode WHERE go_incident_type = " + command.CREATE_SAMPLE + " " +
                        "UNION " +
                        "SELECT gc2_version_gid as element_id, element_type as vedlhold_type_kode, vedlhold_p_type as vedlhold_type, arbejdssted as arbejdssted, geometri as geometri FROM " + schema + ".go_incident_pkt INNER JOIN " + schema + ".d_6802_groenvedligh_punkt ON go_incident_pkt.element_type = d_6802_groenvedligh_punkt.vedlhold_p_type_kode WHERE go_incident_type = " + command.CREATE_SAMPLE + " " +
                        ") " +
                        "SELECT * FROM elementer " +
                        "order by vedlhold_type_kode",
                //key: APIKEY,
                onLoad: onLoad
            });
            break;
        case "cartodb":
            throw "Unsupported feature cartodb";
            break;
    }
    dataStore.load();
};

 
/**
*
* @private
*/
var _createFromSelectedSampleElements = function () {
    try {
        dataStore.abort();
    } catch (e) {
    }
    
    // retrieve list of selected items
    $('#go_menu_sample :selected').each(function()
    {
        _createAsyncFromSelectedSampleElements(1, $("#go_menu_sample").find(':selected').data('subtext'));                       
    });

    // remove all selected indices in samples list
    $("#go_menu_sample").val("");
    $("#go_menu_sample").prop('selectedIndex', -1)
    $("#go_menu_sample").selectpicker('refresh');
   
};

/**
*
* @private
*/
var _createAsyncFromSelectedSampleElements = function (incidentid, element_type) {

    var onLoad = function () {
        // do nothing so far
        var response = this.geoJSON.features;
    };
    
    
//     switch (BACKEND) {
//         case "gc2":
//             dataStore = new geocloud.sqlStore({
//                 jsonp: false,
//                 method: "POST",
//                 // host: GC2_HOST,
//                 host: "",
//                 db: db,
//                 uri: "/api/sql/nocache",
//                 id: "1",
//                 base64: true,
//                 // db: db,
//                 // uri: "/api/v1/sql",
//                 //todo mostaan se og test om denne er random function
//                 sql: "SELECT " + schema + ".fnregistersample(" + incidentid + ", " + element_type + ")",
//                 // key: APIKEY,
//                 onLoad: onLoad
//             });
//             break;
//         case "cartodb":
//             throw "Unsupported feature cartodb";
//             break;
//     }
//     dataStore.load();
// };

switch (BACKEND) {
    case "gc2":
        dataStore = new geocloud.sqlStore({
            jsonp: false,
            method: "POST",
            host: "",
            db: db,
            uri: "/api/sql",
            sql: "SELECT " + schema + ".fnregistersample(" + incidentid + ", " + element_type + ")",
            key: APIKEY,
            onLoad: onLoad
        });
        break;
    case "cartodb":
        throw "Unsupported feature cartodb";
        break;
}
dataStore.load();
 
};

/**
*
* @private
*/
var _sampleFeedback = function (kode, element_id, command) {

    var onLoad = function () {   
        var returncode = "";
        try {
            if (this.geoJSON.features.length > 0)
                var returncode = this.geoJSON.features[0].properties.fnupdateincident;
        } catch(err) {
            console.log (err.message);
        }
        // remove item, when successfull command operation is performed
        if (returncode && returncode.length > 0) {
            $("#" + returncode).remove();
        }
    };

//     switch (BACKEND) {
//         case "gc2":
//             dataStore = new geocloud.sqlStore({
//                 jsonp: false,
//                 method: "POST",
//                 // host: GC2_HOST,
//                 // db: db,
//                 // uri: "/api/v1/sql",
//                 host:"",
//                 db: db,
//                 uri: "/api/sql/nocache",
//                 id: "1",
//                 base64: true,
//                 sql: "SELECT " + schema + ".fnupdateincident(" + element_id + ", " + kode + ", " + command + ")",
//                 //key: APIKEY,
//                 onLoad: onLoad
//             });
//             break;
//         case "cartodb":
//             throw "Unsupported feature cartodb";
//             break;
//     }
//     dataStore.load();
// };
switch (BACKEND) {
    case "gc2":
        dataStore = new geocloud.sqlStore({
            jsonp: false,
            method: "POST",
            host: "",
            db: db,
            uri: "/api/sql",
            sql: "SELECT " + schema + ".fnupdateincident(" + element_id + ", " + kode + ", " + command + ")",
            key: APIKEY,
            onLoad: onLoad
        });
        break;
    case "cartodb":
        throw "Unsupported feature cartodb";
        break;
}
dataStore.load();
};
/**
*
* @private
*/
var _clearAndReloadAreas = function () {
    try {
        dataStore.abort();
    } catch (e) {
    }
    //Mostaan:onload ved success kald fra server backend
    var onLoad = function () {
        $("#go_menu_section_item").val("");
        $("#go_menu_section_item").empty();
        iterateData(this.geoJSON.features);
        // enable element picker
        $('#go_menu_section_item').removeClass('disabled');
        $("#go_menu_section_item").selectpicker('refresh');
        $("#go_menu_section_item").val("");
        $("#go_menu_section_item").prop('selectedIndex', -1)
        // refresh selectpicker list
    };
    //itere og sætter data i seclect query
    var iterateData = function(data){
        $("#go_menu_section_item").append('<option data-subtext="" value=" - Vælg område - "> - Vælg område - </option>');
        for (var key in data) {
            if (data[key].properties.pg_distrikt_nr) {
                $("#go_menu_section_item").append('<option data-subtext=' + data[key].properties.gc2_version_gid + ' value="' + data[key].properties.gc2_version_gid + '">' + data[key].properties.pg_distrikt_nr + '</option>');
            }
    }};
    	// MOSTAAN: Her udføres en SQL til Postgis som fylder områder i den første select box

     dataStore = new geocloud.sqlStore({
        jsonp: false,
        method: "POST",
        host: "",
        db: "mapgodemo",
        uri: "/api/sql/nocache",
        id: "1",
        base64: true, 
        sql: "SELECT gc2_version_gid, pg_distrikt_nr FROM " + schema + ".t_6803_parl_omr_t ORDER by pg_distrikt_nr",
        //sql: "SELECT 'test' as test",
        onLoad: onLoad
    });/*
    switch (BACKEND) {
        case "gc2":
            dataStore = new geocloud.sqlStore({
                jsonp: false,
                method: "POST",
                host: GC2_HOST,
                db: db,
                uri: "/api/v1/sql",
                sql: "SELECT gc2_version_gid, pg_distrikt_nr FROM " + schema + ".t_6803_parl_omr_t ORDER by pg_distrikt_nr",
                key: 'a60a19c3ff6276ef5a3a2730e0715838',
                onLoad: onLoad
            });
            break;
        case "cartodb":
            throw "Unsupported feature cartodb";
            break;
    }*/
    dataStore.load();
};

/**
*
* @private
*/
var _loadElementList = function (selectedDistrict) {
    try {
        dataStore.abort();
    } catch (e) {
    }
    var onLoad = function () {
        $("#go_menu_element_item").val("");
        $("#go_menu_element_item").empty();
        iterateData(this.geoJSON.features);

         // enable element picker
         $('#go_menu_element_item').removeClass('disabled');
         $("#go_menu_element_item").selectpicker('refresh');
         $("#go_menu_element_item").val("");
         $("#go_menu_element_item").prop('selectedIndex', -1)
        
    };

    // case insensitive, digits to number interpolation
    function natSort(as, bs){
        var a, b, a1, b1, i= 0, L, rx=  /(\d+)|(\D+)/g, rd=  /\d/;
        if(isFinite(as) && isFinite(bs)) return as - bs;
        a= String(as).toLowerCase();
        b= String(bs).toLowerCase();
        if(a=== b) return 0;
        if(!(rd.test(a) && rd.test(b))) return a> b? 1: -1;
        a= a.match(rx);
        b= b.match(rx);
        L= a.length> b.length? b.length: a.length;
        while(i < L){
            a1= a[i];
            b1= b[i++];
            if(a1!== b1){
                if(isFinite(a1) && isFinite(b1)){
                    if(a1.charAt(0)=== "0") a1= "." + a1;
                    if(b1.charAt(0)=== "0") b1= "." + b1;
                    return a1 - b1;
                }
                else return a1> b1? 1: -1;
            }
        }
        return a.length - b.length;
    }

    var iterateData = function(data){
        // Incredible hack, which is to be made, since sorting from postgis is not working!
        // todo: fix this!
        data.sort(function(a,b) {
            return natSort(a.properties.concat_element_navn, b.properties.concat_element_navn);
        });

        for (var key in data) {
            if (data[key].properties.concat_element_navn) {
                $("#go_menu_element_item").append('<option data-subtext="' + data[key].properties.element_subcode + '" value="' + data[key].properties.element_subcode + '">' + data[key].properties.concat_element_navn + '</option>');
            }
        } 
    }
    switch (BACKEND) {
        case "gc2":
             dataStore = new geocloud.sqlStore({
                jsonp: false,
                method: "POST",
                host: "",
                db: db,
                uri: "/api/sql/nocache",
                id: "1",
                base64: true, 
                sql: "select element_subcode, element_navn || ' (' || maengde || ' ' || Enhed || ')' as concat_element_navn " + 
                            "FROM " + schema + ".summaengder " + 
                            "where element_subcode is not null AND summaengder.arbejdssted_id = '" + selectedDistrict + "'  " + 
                            "ORDER  BY arbejdssted_id, (substring(lower(element_navn), '^[0-9]+'))::int, substring(lower(element_navn), '[^0-9_].*$'), element_subcode",
                //key: APIKEY,
                onLoad: onLoad
            });
            break;
        case "cartodb":
            throw "Unsupported feature cartodb";
            break;
    }
    dataStore.load();
};



/**
 * Checks login
 */
var _checkLoginMapGoMenu  = function () {    
    xhr = $.ajax({
        method: "GET",
        url: "/api/session/status",
        scriptCharset: "utf-8",
        success: function (response) {
            if (response.status.authenticated == true) {
                // get the API key
                //APIKEY = response.status.apiKey;
                // determine user role (USER OR SUB_USER)
                if (response.status.subUser == false) {
                    currentUserRole = userRole.USER;
                    // user: Hence permit acces to sample section                     
                    $("#expand-sample-btn").removeClass('disabled');  
                    $("#expand-sample-btn").attr('data-target', '#samplingdiv');
                    $("#expand-sample-btn").click(function (e) {
                        _clearAndReloadSampleElements();
						_clearAndReloadCreatedSampleElements();	
                        
                        //$(this).slideToggle('500');
                        $(this).find('i').toggleClass('fa-chevron-circle-down fa-chevron-circle-up');
                                                
                    });
                    //show control
                    $('#elementselectpicker').show();
                } else {
                    currentUserRole = userRole.SUB_USER;
                    //hide control
                    $('#elementselectpicker').hide();
                }
                // user OR subuser: Hence permit acces to amount calculation
                $("#start-calculation-btn").click(function (e) {
                    $("#start-calculation-btn").addClass('disabled');
                    _amountSearch($("#go_menu_section_item").find(':selected').data('subtext'));
                    e.stopPropagation();
                });
                //clear and fill select 
                _clearAndReloadAreas();

                // show gui controls
                $("#mapgo_menuControlPane").show();
                $("#mapgo_menuAmountPane").show();

            } else {
                currentUserRole = userRole.ANONYMOUS;
                $('#mapGo-btn').attr('checked', false);
                alert("Du skal logge ind for at anvende funktionen");
            } 
        },
        error: function () {
            throw new Error('Fejl i request');
        }
    })
    
};

/**
 * Makes a conflict search
 * @param callBack
 */
var _amountSearch = function (text, callBack) {    
    xhr = $.ajax({
        method: "POST",
        url: "/api/extension/amountSearch",
        data: "db=" + db + "&schema=" + schema + "&table=" + "summaengder" + "&socketId=" + socketId.get() + "&text=" + text + "&token=" + text,
        scriptCharset: "utf-8",
        success: function (response) {
            console.log("amountSearch complete");
            _result = response;
            console.log(_result);
        
            // firstly remove previous elements
            $("#mapGo-amount-pane").empty();
            
            // construct innerhtml for div: mapgo-amount-pane
            var html = "";
            html += "<HR><H4>" + response.text + "</H4><br>";
            
            // make table
            html += "<TABLE class='table table-responsive w-auto table-striped table-hover table-bordered table-condensed'>";
            // make table header
            
            html += "<THEAD><TR>";
            for(var key in response.metadata) {
                html += "<TH>";
                html += response.metadata[key].name.toUpperCase();
                html += "</TH>";
            }
            html += "</TR></THEAD>";

            // make values
            html += "<TBODY>";
            for(var key in response.data) {
                html += "<TR>"
                for(var props in response.data[key].properties) {
                    html += "<TD>"
                    html += response.data[key].properties[props];
                    html += "</TD>"
                }
                html += "</TR>"
            }
            html += "</TBODY>";
            
            html += "</TABLE>";
            

            $("#mapGo-amount-pane").append(html);
            backboneEvents.get().trigger("end:mapGoMenuAmountSearch");                    
            $("#mapGo-print-btn").removeClass('disabled');

            if (callBack) {
                callBack();
            }

        },
        error: function (e) {
            console.log(e);
        }
    })
    
};

/**
 *
 * @type set: module.exports.set, init: module.exports.init
 */
module.exports = module.exports = {

    /**
     *
     * @param o
     * @returns {exports}
     */
    set: function (o) {
        cloud = o.cloud.get();
        utils = o.utils;
        meta = o.meta;
        backboneEvents = o.backboneEvents;
        socketId = o.socketId;
        print = o.print;
        return this;
    },

    /**
     * Initiates the module
     */
    init: function () {
        
        //reset mapgomenu when other apps is on
       
        backboneEvents.get().on("off:all", function () {
            backboneEvents.get().trigger("off:MapGoMenu");
        });
        var metaData, me = this, socket = io.connect();
        cloud.map.addLayer(drawnItems);
        cloud.map.addLayer(dataItems);

        // let store = new geocloud.sqlStore({
        //     jsonp: false,
        //     method: "POST",
        //     host: "",
        //     db: "mapgodemo",
        //     uri: "/api/sql/nocache",
        //     id: "1",
        //     base64: true, 
        //     sql: "SELECT gc2_version_gid, pg_distrikt_nr FROM " + schema + ".t_6803_parl_omr_t ORDER by pg_distrikt_nr",
        //     //sql: "SELECT 'test' as test",
        //     onLoad: () => {
        //         console.log(store.geoJSON);
        //     }
        // });
        // let store = new geocloud.sqlStore({
        //     jsonp: false,
        //     method: "POST",
        //     //host: GC2_HOST,
        //     host:"",
        //     db: db,
        //     uri: "/api/sql/nocache",
        //     id: "1",
        //     base64: true,
        //     sql: "WITH elementer AS ( " +
        //             "SELECT gc2_version_gid as element_id, element_type as vedlhold_type_kode, vedlhold_f_type as vedlhold_type, arbejdssted as arbejdssted, geometri as geometri FROM " + schema + ".go_incident_fl INNER JOIN " + schema + ".d_6800_vedlhold_f_type ON go_incident_fl.element_type = d_6800_vedlhold_f_type.vedlhold_f_type_kode WHERE go_incident_type = " + command.CREATE_SAMPLE + " " +
        //             "UNION " +
        //             "SELECT gc2_version_gid as element_id, element_type as vedlhold_type_kode, vedlhold_l_type as vedlhold_type, arbejdssted as arbejdssted, geometri as geometri FROM " + schema + ".go_incident_li INNER JOIN " + schema + ".d_6801_vedlhold_l_type ON go_incident_li.element_type = d_6801_vedlhold_l_type.vedlhold_l_type_kode WHERE go_incident_type = " + command.CREATE_SAMPLE + " " +
        //             "UNION " +
        //             "SELECT gc2_version_gid as element_id, element_type as vedlhold_type_kode, vedlhold_p_type as vedlhold_type, arbejdssted as arbejdssted, geometri as geometri FROM " + schema + ".go_incident_pkt INNER JOIN " + schema + ".d_6802_groenvedligh_punkt ON go_incident_pkt.element_type = d_6802_groenvedligh_punkt.vedlhold_p_type_kode WHERE go_incident_type = " + command.CREATE_SAMPLE + " " +
        //             ") " +
        //             "SELECT * FROM elementer " +
        //             "order by vedlhold_type_kode",
        //     //key: APIKEY,
        //     onLoad: () => {
        //                 console.log(store);}
        // });
        // setTimeout(() => {
        //     store.load()
        // }, 1000)
        
        // Start listen to the web socket
        socket.on(socketId.get(), function (data) {
            if (typeof data.num !== "undefined") {
                $("#mapGo-progress").html(data.num + " " + (data.title || data.table));
                if (data.error === null) {
                    $("#mapGo-console").append(data.num + " table: " + data.table + ", hits: " + data.hits + " , time: " + data.time + "\n");
                } else {
                    $("#mapGo-console").append(data.table + " : " + data.error + "\n");
                }
            }
        });
        
        // Create a new tab in the main tab bar
        //mantabfunction input(id, name, info, height, icon, rawIconWasProvided = false, moduleId = false)
        utils.createMainTab("mapGo", "MapGo Menu", "MapGO Menu, Geopartner A/S. Fremsøg og vis arbejdsområder og indhold. Udtræk mængdeopgørelser og foretag stikprøver.", require('./../../../browser/modules/height')().max,"local_florist", false,);
        $("#mapGo").append(dom);
        // DOM created
        
        
        backboneEvents.get().on("ready:meta", function () {
            metaData = meta.getMetaData();
        })
        
        $(document).ready(function(){
            $(".dropdown-toggle").dropdown();
        });
        $("#start-calculation-btn").addClass('disabled');
        $("#go_menu_sample").addClass('disabled');     
        $("#expand-sample-btn").addClass('disabled');    
        $("#start-sample-btn").addClass('disabled');            
        // initialize selectpickers
        $('#go_menu_element_item').attr('disabled');
        $('#go_menu_element_item').selectpicker();
        $('#go_menu_section_item').attr('disabled');
        $('#go_menu_section_item').selectpicker();

        // show gui controls
        $("#mapgo_menuControlPane").hide();
        $("#mapgo_menuAmountPane").hide();
        
    },

    /**
     * Handle for GUI toggle button
     */
    control: function () {
            //Load sample befor 
			$("#mapGo-btn").on("load",function () {
                _clearAndReloadCreatedSampleElements();
            });
        var me = this;
        if ($("#mapGo-btn").is(':checked')) {
            
            $("#expand-sample-btn").addClass('disabled');
            $("#go_menu_sample").removeClass('disabled');        
            $("#go_menu_sample").change(function(e) {
                // activate start sample routine
                if ($('#go_menu_sample :selected').length > 0) {
                    $("#start-sample-btn").removeClass('disabled'); 
                } else {
                    $("#start-sample-btn").addClass('disabled');
                }
            });
			
         

            $("#start-sample-btn").click(function (e) {
                $("#start-sample-btn").addClass('disabled');
                _createFromSelectedSampleElements();
				_clearAndReloadCreatedSampleElements();
            });
                  
            

            $("#start-calculation-btn").addClass('disabled');

            backboneEvents.get().trigger("on:mapGoInfoClick");

            // Emit "on" event
            backboneEvents.get().trigger("on:mapGo");

            // Trigger "off" events for info, drawing and advanced info
            backboneEvents.get().trigger("off:drawing");
            backboneEvents.get().trigger("off:advancedInfo");
            backboneEvents.get().trigger("off:infoClick");

            // Show DOM elements
            $("#mapgo-info").show();
            $("#mapGo-main-tabs-container").show();
            $("#mapGo .tab-content").show();

            // Reset layer made by clickInfo
            backboneEvents.get().trigger("reset:infoClick");

            $("#go_menu_section_item").focus(function() { $(this).select(); } );

            $("#go_menu_section_item").change(function(e) {
                // disable element picker
                $('#go_menu_element_item').addClass('disabled');
                $('#go_menu_element_item').selectpicker('refresh');
                // disable report and print button
                $("#mapGo-get-print-fieldset").prop("disabled", true);      
                $("#mapGo-print-btn").addClass('disabled');
                // remove previous search results
                $("#mapGo-amount-pane").empty();

                // gets called when ever a key is entered
                var val = this.value;
                var selectedId = $("#go_menu_section_item").find(':selected').data('subtext');
                if($('#go_menu_section_item option').filter(function(){
                    return this.value === val;        
                }).length) {
                    // item recognized in data list, do event stuff
                    if (currentUserRole == userRole.USER || currentUserRole == userRole.SUB_USER)
                        $("#start-calculation-btn").removeClass('disabled');
                    // adjust map
                    if (currentUserRole == userRole.USER)
                        // reload  
                        _zoomToFeature(selectedId, null, true, null);  
                    else if (currentUserRole == userRole.SUB_USER)                                    
                        _zoomToFeature(selectedId, null, false, null);  
                }
            });
            $( "#go_menu_element_item" ).change(function() {

                var list=""
                $("#go_menu_element_item option:selected").each(function()
                    {
                        list += list.length > 0 ? ", " : "";
                        // only insert valid numbers
                        // ie. 'All' text from sleect all option is expelled
                        if (!isNaN(Number($(this).val()))) {
                            list += "'" + $(this).val() + "'";
                        }
                    });
                    // adjust map
                    _zoomToFeature($("#go_menu_section_item").find(':selected').data('subtext'), list, false, null);
              });

            $("#collector-incidence-value").empty();

            // clear select element list            
            $("#go_menu_element_item").val("");
            $("#go_menu_element_item").empty();

            // IMPORTANT - reset properties and  check if user is logged in,
            // in order to disable controls and reset API key
            APIKEY = "";
            currentUserRole = userRole.ANONYMOUS;
            _checkLoginMapGoMenu(); 
		
        
        } else {
            backboneEvents.get().trigger("off:MapGoMenu");
        }
    },

    /**
     * Turns mapGo off and resets DOM
     */
    off: function () {
        // Clean up
        console.info("Stopping mapGo");
        _clearAllItems();
        $("#mapGo-main-tabs-container").hide();
        $("#mapGo .tab-content").hide();
        $("#mapGo-btn").prop("checked", false);

        $("#mapGo-get-print-fieldset").prop("disabled", true);      
        $("#mapGo-print-btn").addClass('disabled');

        $("#mapGo-amount-pane").empty();

        $("#hits-content tbody").empty();
        $("#hits-data").empty();
        $("#nohits-content tbody").empty();
        $("#error-content tbody").empty();

        $('#mapGo-result-content a[href="#hits-content"] span').empty();
        $('#mapGo-result-content a[href="#nohits-content"] span').empty();
        $('#mapGo-result-content a[href="#error-content"] span').empty();

        // Turn info click on again
        backboneEvents.get().trigger("on:infoClick");
        backboneEvents.get().trigger("reset:mapGoInfoClick");

        // Unbind events 
        
        $("#go_menu_section_item").off('change');
        
        $("#go_menu_section_item").off('focus');
        $("#go_menu_section_item").val("");
        $("#go_menu_section_item").empty();        
        $('#go_menu_section_item').selectpicker('refresh');
        $('#go_menu_section_item').addClass('disabled');
        $("#start-calculation-btn").off('click');
        $("#start-calculation-btn").addClass('disabled');
        $("#expand-sample-btn").off('click');
        $("#expand-sample-btn").addClass('disabled');
        $("#acc_samples").empty();
        
        $("#go_menu_sample").off('change');
        $("#go_menu_sample").addClass('disabled'); 
        // disable element picker
        $('#go_menu_element_item').off('change');
        $("#go_menu_element_item").val("");
        $("#go_menu_element_item").empty();        
        $('#go_menu_element_item').selectpicker('refresh');
        $('#go_menu_element_item').addClass('disabled');
                
        // show gui controls
        $("#mapgo_menuControlPane").hide();
        $("#mapgo_menuAmountPane").hide();
    },

     /**
     * Clears seleced elements, if any
     */
    clearSelection: function () {
        _clearDataItems();
        $("#go_menu_section_item").val("");
        $("#go_menu_section_item").selectpicker('refresh');
        
        // remove selected items
        $("#go_menu_element_item").val("");
        // clear go_menu_element_item elements
        $("#go_menu_element_item").empty();
        // disable element picker
        $('#go_menu_element_item').addClass('disabled');
        // refresh selectpicker list
        $("#go_menu_element_item").selectpicker('refresh');

        $("#start-calculation-btn").addClass('disabled');
    },

     /**
     * highlights elements in specified layer
     */
    addSelection: function (layer, selectedDistrict) {
        dataItems.addLayer(layer);
        _loadElementList(selectedDistrict);
        if (currentUserRole == userRole.USER || currentUserRole == userRole.SUB_USER)
            $("#start-calculation-btn").removeClass('disabled');
    },
    getMapGOMenuResult: function () {
        return _result;
    },
	 addDrawing: function (layer) {
        drawnItems.addLayer(layer);
    }
};



var dom = '<div role="tabpanel">' + 
    '<div class="panel panel-default">' + 
        '<div class="panel-body">' +
            '<div class="togglebutton">' +
                '<label>' +
                '<input id="mapGo-btn" type="checkbox">Aktiver Map Go Menu</input>' +
                '</label>' +
            '</div>' +
            
            '<div id="mapgo_menuControlPane" class="panel-body">' +
                '<div class="panel-body">' +
                '<label for="go_menu_section_item" class="control-label">Områder</label>' +
                '<select class="form-control selectpicker" data-language="da_DK" data-show-subtext="false" data-size="4" data-live-search="true" id="go_menu_section_item"></select>' + 
                '<div id="elementselectpicker">' +
                    '<label for="go_menu_element_item" data-show-subtext="true" data-live-search="true" class="control-label">Markær elementtyper</label>' +
                    '<select class="form-control selectpicker" data-actions-box="true" data-language="da_DK" data-none-selected-text=" - Vælg elementtyper  -" data-select-all-text="Vælg alle" data-deselect-all-text="Fravælg alle" data-selected-text-format="count > 2" data-count-selected-text="{0} elementtyper valgt" multiple data-show-subtext="true" data-size="4" data-live-search="true" id="go_menu_element_item"></select>' + 
                '</div>' +
            '</div>' +
                '<div class="btn-toolbar bs-component" style="margin: 0;">'+
                    '<div class="btn-group">'+
                        '<button id="start-calculation-btn" class="btn btn-raised" style="width: 200px">' +
                        '<i class="fa fa-book fa-lg"></i>&nbsp;Mængdeopgørelse&nbsp;' +
                        '</button>' +
                        '<br>' +     
                        '<button id="expand-sample-btn" class="btn btn-raised" style="width: 200px" data-toggle="collapse">' +
                        '<i class="fa fa-chevron-circle-down fa-lg"></i>&nbsp;Stikprøvekontrol&nbsp;' +
                        '</button>' +                
                    '</div>' +
                '</div>' +
                '<div id="samplingdiv" class="collapse">' +
                '<label for="go_menu_sample" data-show-subtext="true" data-live-search="true" class="control-label">Markær elementer til stikprøvetagning</label>' +
                '<select class="form-control selectpicker" data-actions-box="true" data-language="da_DK" multiple data-show-subtext="true" data-selected-text-format="count > 2" data-count-selected-text="{0} stikprøveelementer valgt" data-size="4" data-live-search="true" id="go_menu_sample"></select>' + 
                '<button id="start-sample-btn" type="button" class="btn btn-raised"><i class="fa fa-plus" aria-hidden="true"></i>&nbsp;Udtag stikprøver&nbsp;</button>' + 
                // Mostaan removed  Opdater/registrer stikprøver button
               // '<button id="acc_samples_reload" type="button" class="btn btn-raised" data-loading-text="<i class=\'fa fa-cog fa-spin fa-lg\'></i>&nbsp;Opdater/registrer stikprøver&nbsp;"><i class=\'fa fa-refresh fa-lg\'></i>&nbsp;Opdater/registrer stikprøver&nbsp;</button>' + 
               '<div class="panel-group" id="samples_accordion">' +
                        '<div id="acc_samples" class="panel panel-default">' +
                        '</div>' +
                    '</div>' + 
                '</div>' +              
            '</div>' +              
        '</div>' +
    '</div>' +
    '<div id="mapgo_menuAmountPane" class="panel panel-default" id="mapGo-info">' + 
        '<div class="panel-body" id="mapGo-info-pane"></div>' +
            '<div class="btn-toolbar bs-component" style="margin: 0;">' +
                '<div class="btn-group">' +
                    '<button disabled class="btn btn-raised" id="mapGo-print-btn" data-loading-text="<i class=\'fa fa-cog fa-spin fa-lg\'></i>&nbsp;Print rapport&nbsp;"><i class=\'fa fa-cog fa-lg\'></i>&nbsp;Print rapport&nbsp;</button>' +
                    '<fieldset disabled id="mapGo-get-print-fieldset">' +
                        '<div class="btn-group">' +
                            '<a target="_blank" href="javascript:void(0)" class="btn btn-primary btn-raised" id="mapGo-open-pdf">Åben PDF</a>' +
                            '<a href="bootstrap-elements.html" data-target="#" id="mapgo-print-drop-dopwn" class="btn btn-primary btn-raised dropdown-toggle" data-toggle="dropdown"><span class="caret"></span></a>' +
                            '<ul class="dropdown-menu">' +
                                '<li><a href="javascript:void(0)" id="mapGo-download-pdf">Download PDF</a></li>' +
                                '<li><a target="_blank" href="javascript:void(0)" id="mapGo-open-html">Open HTML page</a></li>' +
                            '</ul>' +
                        '</div>' +
                    '</fieldset>' +
                '</div>' +
            '</div>' +
            '<div class="table-responsive" id="mapGo-amount-pane"></div>' +
        '</div>' +
    '</div>';
