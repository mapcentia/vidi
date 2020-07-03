/*
 * @author     Martin Høgh <mh@mapcentia.com>
 * @copyright  2013-2019 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

'use strict';

/* Import big-brains*/
import Dropzone from 'react-dropzone';
import JSZip from 'jszip';
import LedningsEjerStatusTable from "./LedningsEjerStatusTable";


/**
 *
 * @type {*|exports|module.exports}
 */
var cloud;

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
 */
var transformPoint;


/**
 *
 * @type {string}
 */
var exId = "lerConverter";

/**
 *
 */
var clicktimer;

/**
 *
 */
var mapObj;

var gc2host = 'http://localhost:3000'

const SQLURL = gc2host + '/api/extension/lerSQL'
const FEATUREURL = gc2host + 'api/extension/lerFeature'

var config = require('../../../config/config.js');

if (typeof config.extensionConfig !== "undefined" && typeof config.extensionConfig.streetView !== "undefined") {
    if (typeof config.extensionConfig.streetView.mapillary !== "undefined") {
        mapillaryUrl = config.extensionConfig.streetView.mapillary;
    }
    if (typeof config.extensionConfig.streetView.cowi !== "undefined") {
        cowiUrl = config.extensionConfig.streetView.cowi;
    }
}

/**
 * Slice array into chunks
 * @param {*} n 
 */
Array.range = function(n) {
    // Array.range(5) --> [0,1,2,3,4]
    return Array.apply(null,Array(n)).map((x,i) => i)
  };
  
  Object.defineProperty(Array.prototype, 'chunk', {
    value: function(n) {
  
      // ACTUAL CODE FOR CHUNKING ARRAY:
      return Array.range(Math.ceil(this.length/n)).map((x,i) => this.slice(i*n,i*n+n));
  
    }
  });

  function hasChild(obj){
    return !!Object.keys(obj).length;
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
        $('#lerConverter-feature-editcontent').hide();        

        // subtract this enumeration, and continue
        state_Enum -= GUI_CONTROL_STATE.NO_CONTROLS_VISIBLE;
    }
    if (state_Enum >= GUI_CONTROL_STATE.AUTHENTICATE_SHOW_ALERT) {
        $('#lerConverter-feature-login').show(); 

        // subtract this enumeration, and continue
        state_Enum -= GUI_CONTROL_STATE.AUTHENTICATE_SHOW_ALERT;
    }
    if (state_Enum >= GUI_CONTROL_STATE.AUTHENTICATE_HIDE_ALERT) {        
        $('#lerConverter-feature-login').hide(); 

        // subtract this enumeration, and continue
        state_Enum -= GUI_CONTROL_STATE.AUTHENTICATE_HIDE_ALERT;
    }  
}
require('snackbarjs');
/**
 * Displays a snack!
 * @param {*} msg 
 */
var snack = function (msg) {
    jquery.snackbar({
        htmlAllowed: true,
        content: '<p>'+msg+'</p>',
        timeout: 10000
    });
}
var _USERSTR = "";
/**
 * Checks login, routes to correct schema if prople are lost!
 */
var _checkLogin = function () {    
    xhr = $.ajax({
        method: "GET",
        url: "/api/session/status",
        async: false,
        scriptCharset: "utf-8",
        success: function (response) {
            console.table(response)
            if (response.status.authenticated == true) {
                // determine user role (USER OR SUB_USER)
                if (response.status.subuser == false) {
                    currentUserRole = userRole.USER;
                    _USERSTR = response.status.screen_name
                    console.log(_USERSTR)
                    return response.status.authenticated;
                } else {
                    currentUserRole = userRole.SUB_USER;
                    _USERSTR = response.status.screen_name + '@' + urlparser.db;
                    return response.status.authenticated;
                }

            } else {
                _USERSTR = "";
                console.log("User not logged in - triggering screen")

                ////Trigger loading module
                //document.getElementById("session").click()
                ////Hide some elements
                //setStyle("#login-modal-body > div > div.alert.alert-dismissible.alert-info",{'display':'none'})
                //setStyle("#login-modal > div > div > div.modal-footer",{'display':'none'})
                //setStyle("#login-modal > div > div > div.modal-header",{'display':'none'})
                ////Manipulate modal to fit screen, move form to center
                //setStyle("#login-modal", {'padding':'0px'})
                //setStyle("#login-modal > div > div",{'width': '100%','height':'100vh'})

                

            } 
        },
        error: function () {
            throw new Error('Fejl i _checkLogin request');
        }
    })
    
};

/**
 * 
 * @param {*} objId - querySelector
 * @param {*} propertyObject - CSS properties
 */
var setStyle = function( objId, propertyObject )
{
 var elem = document.querySelector(objId);
 for (var property in propertyObject)
    elem.style[property] = propertyObject[property];
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
        mapObj = cloud.get().map;

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
         * @type {{Info: {da_DK: string, en_US: string}, Street View: {da_DK: string, en_US: string}, Choose service: {da_DK: string, en_US: string}, Activate: {da_DK: string, en_US: string}}}
         */
        var dict = {

            "Info": {
                "da_DK": "infoDK",
                "en_US": "infoUS"
            },

            "Plugin Tooltip": {
                "da_DK": "Upload ledningspakke",
                "en_US": "Upload packet"
            },

            "Activate": {
                "da_DK": "Aktiver",
                "en_US": "Activate"
            },
            "MissingLogin": {
                "da_DK": "NB: Du skal være logget ind for at kunne bruge funktionen",
                "en_US": "Please log in to use this function"                 
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

        console.log('run login check!');
        _checkLogin()
        
        /**
         * Flattens object
         * @param {*} obj 
         */
        var flattenObject = function(obj) {
            const flattened = {}
          
            Object.keys(obj).forEach((key) => {
              if (typeof obj[key] === 'object' && obj[key] !== null) {
                Object.assign(flattened, flattenObject(obj[key]))
              } else {
                flattened[key] = obj[key]
              }
            })
          
            return flattened
          }

        /**
         * Parses xml to JSON
         * @param {*} xmlData 
         */
        var parsetoJSON = function (xmlData){
            var jsonObj, Err = {}
            var parser = require('fast-xml-parser');
            var options = {
                attributeNamePrefix : "",
                attrNodeName: "attr", //default is 'false'
                textNodeName : "value",
                ignoreAttributes : false,
                ignoreNameSpace : true,
                allowBooleanAttributes : false,
                parseNodeValue : true,
                parseAttributeValue : true,
                trimValues: true,
                cdataTagName: "__cdata", //default is 'false'
                cdataPositionChar: "\\c",
                parseTrueNumberOnly: false,
                arrayMode: false, //"strict"
                stopNodes: ["parse-me-as-string"]
            };
        
            return new Promise(function(resolve, reject) {
                if( parser.validate(xmlData) === true) { //optional (it'll return an object in case it's not valid)
                    jsonObj = parser.parse(xmlData,options);
                    //console.log(jsonObj)
                    resolve(jsonObj)
                } else {
                    err = parser.validate(xmlData)
                    reject(err)
                }
            });
        
            // Intermediate obj
            //var tObj = parser.getTraversalObj(xmlData,options);
            //console.log(tObj)
            //var jsonObj = parser.convertToJson(tObj,options);
            //console.log(jsonObj)
        }

        /**
         * Adds prefix to object
         * @param {*} obj 
         * @param {*} prefix 
         */
        var rename = function(obj, prefix){
            if(typeof obj !== 'object' || !obj){
                return false;    // check the obj argument somehow
            }
            var keys = Object.keys(obj),
                keysLen = keys.length,
                prefix = prefix || '';
            for(var i=0; i<keysLen ;i++){
                obj[prefix+keys[i]] = obj[keys[i]];
                if(typeof obj[keys[i]]=== 'object'){
                    rename(obj[prefix+keys[i]],prefix);
                }
                delete obj[keys[i]];
            }
            return obj;
        };

        var geo = function(obj) {
            let dim = 3
            let coords = ''
            //console.table(obj)

            if (obj.hasOwnProperty('attr')){
                if (obj.attr.hasOwnProperty('srsDimension')){
                    dim = obj.attr.srsDimension
                }
                coords = obj.value.split(' ').map(Number).chunk(dim)
            } else {
                coords = obj.split(' ').map(Number).chunk(dim)
            }

            return coords
        }

        var handleGeometry = function(obj) {
            //console.table()
            let geomObj = {}
            let flat = flattenObject(obj)

            if (!typeof obj === 'object') {
                return null
            }

            // Handle type
            // Points
            if ('Point' in obj) {
                geomObj.type = 'Point'
            } else if ('LineString' in obj) {
                geomObj.type = 'LineString'
            } else if ('Surface' in obj) {
                geomObj.type = "Polygon"
            } else {
                // Matched nothing, kill 
                return null  
            }

            //TODO: Improve handeling of multi's

            // Handle geometry
            console.table(flat)

            let dim = 2
            if (flat.hasOwnProperty('srsDimension')){
                dim = flat.srsDimension
            }
            if (flat.hasOwnProperty('posList')){
                geomObj.coords = flat.posList.split(' ').map(Number).chunk(dim)
            } else if (flat.hasOwnProperty('pos')) {
                geomObj.coords = flat.pos.split(' ').map(Number)
            } else if (flat.hasOwnProperty('coordinates')){
                let coords = flat.coordinates.split(' ')
                console.log(coords)
            } else if (flat.hasOwnProperty('value')) {
                geomObj.coords = flat.value.split(' ').map(Number).chunk(dim)
            } else {
                geomObj = null
            }
        
            return geomObj

        }

        /**
         * Parse consolidated to an array of data and enrich
         * first object will always be the foresp. itself - handle accordingly
         * @param {*} consolidated 
         */
        var parseConsolidated = function (consolidated){
            const cons = consolidated['FeatureCollection']['featureMember']
            //console.log(cons)

            const returnObj = {
                foresp: {},
                forespNummer: 0,
                data: []
            }
            const foresp = [], owner = [], packageinfo = [], profil = [], data = []
            
            /* sort the package */
            for (const i in cons){
                /* Lets sort it out */
                if (cons[i]["Graveforesp"]){
                    foresp.push(Object.values(cons[i])[0])
                } else if (cons[i]["UtilityPackageInfo"]){
                    packageinfo.push(rename(Object.values(cons[i])[0],'svar_'))
                } else if (cons[i]["UtilityOwner"]){
                    owner.push(rename(Object.values(cons[i])[0],'svar_'))
                } else if (cons[i]["Kontaktprofil"]){
                    profil.push(rename(Object.values(cons[i])[0],'svar_'))
                } else {
                    data.push(Object.values(cons[i])[0])
                }
            }

            /* TODO: Parse indberetning */

            /* Enrich each data value with contant, package and owner information - overwrite duplicate information*/
            try {
                data.forEach(function(item) {

                    let obj = {}
                    obj = Object.assign(obj, item)
                    obj = Object.assign(obj, profil.find(o => o.svar_indberetningsNr === item.indberetningsNr))
                    obj = Object.assign(obj, owner.find(o => o.svar_ledningsejer === item.ledningsejer))
                    obj = Object.assign(obj, packageinfo.find(o => o.svar_indberetningsNr === item.indberetningsNr))
                    
                    // Remove specifics
                    delete obj.svar_folderName
                    delete obj.svar_forventetAfleveringstidpunkt
                    delete obj.svar_objectType
                    delete obj.svar_cvr
                    delete obj.svar_ledningsejer
                    delete obj.svar_indberetningsområde

                    // clean values
                    obj["objectType"] = obj["objectType"].replace('ler:','')
                    delete obj.attr;
                    delete obj.svar_attr;

                    // etableringstidspunkt
                    if (obj.hasOwnProperty('etableringstidspunkt')) {
                        if (obj.etableringstidspunkt.hasOwnProperty('attr')){
                            //can only be "before"
                            obj.etableringstidspunkt = 'Før '+ obj.etableringstidspunkt.value
                        }
                    }

                    //Redo Geometry
                    //console.log(obj.geometri)
                    console.log(obj.geometri)
                    let geom = handleGeometry(obj.geometri);
                    console.log(geom)
                    //console.log(geom)
                    delete obj.geometri;

                    //hack to geojson obj
                    obj = {
                        type: 'Feature',
                        properties: obj,
                        geometry: geom
                    }

                    returnObj.data.push(obj)
                    //TODO: gather up
                })
            } catch (error) {
                console.log(error)
                reject(error)
            }

            // Handle Graveforsp.
            try {
                foresp.forEach(function(item) {
                    //console.log(item)

                    console.log(item.polygonProperty)
                    let geom = handleGeometry(item.polygonProperty)
                    console.log(geom)

                    delete item.polygonProperty
                    delete item.graveart_anden
                    delete item.graveart_id
                    delete item.fid

                    item.objectType = item.objectType.replace('lergml:','')

                    returnObj.forespNummer = item.orderNo
                    returnObj.foresp = {
                        type: 'Feature',
                        properties: item,
                        geometry: geom
                    };

                })
            } catch (error) {
                console.log(error)
                reject(error)            
            }

        
            console.log('Fandt elementer: '.concat(packageinfo.length,' UtilityPackageInfo, ',owner.length, ' UtilityOwner, ',profil.length, ' Kontaktprofil, ', data.length,' data'))
            console.log(returnObj)
            
            // use promise to return data in stream
            return new Promise(function(resolve, reject) {
            //    if( true ) { //optional (it'll return an object in case it's not valid)
            //        jsonObj = parser.parse(xmlData,options);
            //        //console.log(jsonObj)
            //        resolve(jsonObj)
            //    } else {
            //        err = parser.validate(xmlData)
            //        reject(err)
            //    }
                resolve(returnObj)
            });
        
            // Intermediate obj
            //var tObj = parser.getTraversalObj(xmlData,options);
            //console.log(tObj)
            //var jsonObj = parser.convertToJson(tObj,options);
            //console.log(jsonObj)
        }     
        
        var readForespoergsels = function (forespNummer) {
            let opts = {
                headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
                method: 'POST',
                body: JSON.stringify({nummer: forespNummer})
            }
            fetch(gc2host + '/api/extension/getForespoergsel', opts)
            .then(async response => {
                const data = await response.json();
                console.log(data)
    
                // check for error response
                if (!response.ok) {
                    // get error message from body or default to response status
                    const error = (data && data.message) || response.status;
                    console.log(error)
                    return Promise.reject(error);
                }

            })
            .catch(error => {
                this.setState({ errorMessage: error.toString() });
                console.error('There was an error!', error);
            });
        }
        
        /**
         *
         */
        class LerConverter extends React.Component {
            constructor(props) {
                super(props);

                this.state = {
                    active: false,
                    done: false,
                    loading: false,
                    progress: 0,
                    progressText: '',
                    ejerliste: []
                };

                this.readContents = this.readContents.bind(this)
            }

            /**
             *
             */
            componentDidMount() {
                let me = this;

                // Stop listening to any events, deactivate controls, but
                // keep effects of the module until they are deleted manually or reset:all is emitted
                backboneEvents.get().on("deactivate:all", () => {
                });

                // Activates module
                backboneEvents.get().on(`on:${exId}`, () => {
                    console.log('Starting lerConverter')
                    me.setState({
                        active: true
                    });
                    utils.cursorStyle().crosshair();
                });

                // Deactivates module
                backboneEvents.get().on(`off:${exId} off:all reset:all`, () => {
                    console.log('Stopping lerConverter')
                    me.setState({
                        active: false
                    });
                    utils.cursorStyle().reset();
                });

                // Handle click events on map
                // Do we need click events for this extension?
                // ==========================

                //mapObj.on("dblclick", function () {
                //    clicktimer = undefined;
                //});
                //mapObj.on("click", function (e) {
                //    let event = new geocloud.clickEvent(e, cloud);
                //    if (clicktimer) {
                //        clearTimeout(clicktimer);
                //    }
                //    else {
                //        if (me.state.active === false) {
                //            return;
                //        }
                //        clicktimer = setTimeout(function (e) {
                //            //let coords = event.getCoordinate(), p, url;
                //            //p = utils.transform("EPSG:3857", "EPSG:4326", coords);
                //            //clicktimer = undefined;
                //            //switch (me.state.selectedOption) {
                //            //    case "google":
                //            //        url = "http://maps.google.com/maps?q=&layer=c&cbll=" + p.y + "," + p.x + "&cbp=11,0,0,0,0";
                //            //        break;
                //            //    case "mapillary":
                //            //        url = mapillaryUrl + "&lat=" + p.y + "&lng=" + p.x;
                //            //        break;
                //            //    case "skraafoto":
                //            //        url = "https://skraafoto.kortforsyningen.dk/oblivisionjsoff/index.aspx?project=Denmark&lon=" + p.x + "&lat=" + p.y;
                //            //        break;
                //            //    case "cowi":
                //            //        url = cowiUrl + "&srid=4326&x=" + p.x + "&y=" + p.y;
                //            //        break;
                //            //}
                //            //parentThis.callBack(url);
                //        }, 250);
                //    }
                //});
            }
            
            /**
             * Handle file selected
             * @param {*} files 
             */
            onDrop(files) {
                const _self = this;
                //TODO: screen input
                this.readContents(files[0])

            }

            /**
             * 
             * @param {*} zipblob 
             */
            readContents(zipblob) {
                var _self = this;
                var newZip = new JSZip();

                _self.setState({loading:true, done: false})

                newZip.loadAsync(zipblob)
                .then(function (zip) {
                    /* Load Status - 'LedningsejerStatusListe.xml', set state */
                    _self.setState({
                        progress: 10,
                        progressText:'Indlæser statusliste'
                    })
                    zip.files['LedningsejerStatusListe.xml'].async('string')
                        .then(fileData => parsetoJSON(fileData))
                        .then(jsObj => _self.setState({ejerliste:jsObj.LedningsejerListe.Ledningsejer})) // Set state when done
                    return zip //pass on same zip to next then
                })
                .then(function (zip) {
                    /* Load data - 'consolidated.gml' */
                    _self.setState({
                        progress: 60,
                        progressText:'Indlæser ledningsdata'
                    })
                    zip.files['consolidated.gml'].async('string')
                        .then(fileData => parsetoJSON(fileData))
                        .then(jsObj => parseConsolidated(jsObj))
                        .then(parsed => {
                            console.table(parsed)
                        })
                }).catch(function(error) {
                    console.log(error)
                })
            }

            render() {          
                return (
                    <div role="tabpanel">
                        <div className="form-group">
                            <div id="lerConverter-feature-login" className="alert alert-info" role="alert">
                                {__("MissingLogin")}
                            </div>
                            <div id="lerConverter-feature-dropzone">
                                <Dropzone
                                onDrop={this.onDrop.bind(this)}
                                style={{
                                    width: '100%',
                                    height: '50px',
                                    padding: '5px',
                                    border: '1px green dashed'
                                }}
                                >
                                    <p>Drop it dawg</p>
                                </Dropzone>
                            </div>
                            <div id="lerConverter-feature-ledningsejerliste">
                                <LedningsEjerStatusTable statusliste={this.state.ejerliste} />
                            </div>
                        </div>
                    </div>
                );
            }
        }

        utils.createMainTab(exId, __("Plugin Tooltip"), __("Info"), require('./../../../browser/modules/height')().max, "create_new_folder", false, exId);

        // Append to DOM
        //==============
        try {
            ReactDOM.render(
                <LerConverter/>,
                document.getElementById(exId)
            );
        } catch (e) {

        }

    },

    callBack: function (url) {
        utils.popupCenter(url, (utils.screen().width - 100), (utils.screen().height - 100), exId);
    },
    setCallBack: function (fn) {
        this.callBack = fn;
    }
};