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

var cowiUrl;

var mapillaryUrl = "https://www.mapillary.com/app/?z=17";

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
 * Checks login
 */
var _checkLogin = function () {    
    xhr = $.ajax({
        method: "GET",
        url: "/api/session/status",
        async: false,
        scriptCharset: "utf-8",
        success: function (response) {
            if (response.status.authenticated == true) {
                // determine user role (USER OR SUB_USER)
                if (response.status.subUser == false) {
                    currentUserRole = userRole.USER;
                    _USERSTR = response.status.userName
                    console.log(_USERSTR)
                    return response.status.authenticated;
                } else {
                    currentUserRole = userRole.SUB_USER;
                    _USERSTR = response.status.screen_name + '@' + urlparser.db;
                    return response.status.authenticated;
                }

            } else {
                _USERSTR = "";
                console.log(_USERSTR)
                return response.status.unauthorized;

            } 
        },
        error: function () {
            throw new Error('Fejl i _checkLogin request');
        }
    })
    
};

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
         * Parses xml to JSON
         * @param {*} xmlData 
         */
        var parsetoJSON = function (xmlData){
            var jsonObj, Err = {}
            var parser = require('fast-xml-parser');
            var options = {
                attributeNamePrefix : "@_",
                attrNodeName: "attr", //default is 'false'
                textNodeName : "#text",
                ignoreAttributes : true,
                ignoreNameSpace : false,
                allowBooleanAttributes : false,
                parseNodeValue : true,
                parseAttributeValue : false,
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
         *
         */
        class LerConverter extends React.Component {
            constructor(props) {
                super(props);

                this.state = {
                    loading: false,
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
             * Sets the state using async
             * @param {*} state 
             */
            setStateAsync(state) {
                return new Promise((resolve) => {
                  this.setState(state, resolve)
                });
            }


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

                _self.setState({loading:true})

                newZip.loadAsync(zipblob).then(function (zip) {
                    Object.keys(zip.files).forEach(function (filename) {
                      //console.log(filename)
                      
                    
                      /* Handle graveforespoergsel */
                      if (filename.indexOf('Graveforespoergsel') != -1){
                        zip.files[filename].async('string').then(fileData => {
                            //console.log(parsetoJSON(fileData))
                        })
                      }
                      /* Handle Ledninger */
                      if (filename == 'consolidated.gml'){
                        zip.files[filename].async('string').then(fileData => {
                            //console.log(parsetoJSON(fileData))
                        })
                      }
                      /* Show Status */
                      if (filename == 'LedningsejerStatusListe.xml'){
                        zip.files[filename].async('string').then(fileData => {
                            parsetoJSON(fileData).then(jsObj => {
                                _self.setState({ejerliste:jsObj.LedningsejerListe.Ledningsejer})
                            })
                        })
                      }
                    })
                  }).finally(() =>{
                    /* Alle filer er læst og parsed.*/
                    console.log('Stopped reading contents')
                    _self.setState({loading:false})
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