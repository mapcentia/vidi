/*
 * @author     René Borella <rgb@geopartner.dk>
 * @copyright  2020- Geoparntner A/S
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

'use strict';

/* Import big-brains*/
import {
    v4 as uuidv4
} from 'uuid';
import Dropzone from 'react-dropzone';
import JSZip from 'jszip';
import Button from '@material-ui/core/Button';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import { isSet } from 'lodash';
import { getClassSet } from 'react-bootstrap/lib/utils/bootstrapUtils';
import MatrikelTable from './MatrikelTable';


/**
 *
 * @type {*|exports|module.exports}
 */
var cloud;

/**
 *
 * @type {*|exports|module.exports}
 */
var urlparser = require('./../../../browser/modules/urlparser');

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
var layerTree = require('./../../../browser/modules/layerTree');


/**
 *
 * @type {*|exports|module.exports}
 */
var layers = require('./../../../browser/modules/layers');

/**
 *
 * @type {string}
 */
var exId = "geosag";

/**
 *
 */
var clicktimer;

/**
 *
 */
var mapObj;

var DClayers = []
var config = require('../../../config/config.js');

// Get URL vars
if (urlparser.urlVars.user) {
    var user = urlparser.urlVars.user;
}
if (urlparser.urlVars.sagsnr) {
    var sagsnr = urlparser.urlVars.sagsnr;
}

function hasChild(obj) {
    return !!Object.keys(obj).length;
}

require('snackbarjs');
/**
 * Displays a snack!
 * @param {*} msg 
 */
var snack = function (msg) {
    jquery.snackbar({
        htmlAllowed: true,
        content: '<p>' + msg + '</p>',
        timeout: 10000
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
                        "da_DK": "Geosag, Matrikeludpegning",
                        "en_US": "Geosag, Matrikeludpegning"
                    },
                };

                /**
                 *
                 * @param txt
                 * @returns {*}
                 * @private
                 */
                var __ = function (txt) {

                    // Hack for locale not found?!
                    //console.log(window._vidiLocale)
                    //console.log(txt)

                    if (dict[txt][window._vidiLocale]) {
                        return dict[txt][window._vidiLocale];
                    } else {
                        return txt;
                    }
                };


                var getExistingMatr = function(caseId){
                    // Get Existing parts from Matrikelliste
                    return new Promise(function (resolve, reject) {
                        let obj = {
                            caseId: caseId,
                            user: user
                        }
                        let opts = {
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            },
                            method: 'POST',
                            body: JSON.stringify(obj)
                        }
                        // Do async job and resolve
                        fetch('/api/extension/getExistingMatr', opts)
                            .then(r => {
                                const data = r.json();
                                resolve(data)
                            })
                            .catch(e => reject(e))
                    })
                }

                var getCase = function(sagsnr){
                    // Get case object for display
                    return new Promise(function (resolve, reject) {
                        let obj = {
                            sagsnr: sagsnr,
                            user: user
                        }
                        let opts = {
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            },
                            method: 'POST',
                            body: JSON.stringify(obj)
                        }
                        // Do async job and resolve
                        fetch('/api/extension/getCase', opts)
                            .then(r => {
                                const data = r.json();
                                resolve(data)
                            })
                            .catch(e => reject(e))
                    })
                }
                

                /**
                 *
                 */
                class GeoSag extends React.Component {
                    constructor(props) {
                        super(props);

                        this.state = {
                            loading: false,
                            allow: false,
                            case: '',
                            matrList: [],
                            existingMatrList: [],
                            error: ''
                        };

                        this.readContents = this.readContents.bind(this)
                        this.deleteMatrikel = this.deleteMatrikel.bind(this)
                        this.addMatrikel = this.addMatrikel.bind(this)
                    }

                    /**
                     * Handle activation on mount
                     */
                    componentDidMount() {
                        let me = this;

                        // Stop listening to any events, deactivate controls, but
                        // keep effects of the module until they are deleted manually or reset:all is emitted
                        backboneEvents.get().on("deactivate:all", () => {});

                        // Activates module
                        backboneEvents.get().on(`on:${exId}`, () => {
                            console.log(`Starting ${exId}`)

                            // If neither is set, error out

                            console.log(`user: ${user}`)
                            console.log(`sagsnr: ${sagsnr}`)

                            // Init empty layer / Check if layer has content already
                            // Make sure we can change extension and not loose expensive information.

                            if (user == undefined && sagsnr == undefined) {
                                me.setState({
                                    allow: false,
                                    error: "Mangler bruger og journalnummer."
                                })
                            } else {
                                // Get case
                                getCase(sagsnr)
                                .then(r => {
                                    console.log(r)
                                    me.setState({
                                        case: r
                                    })
                                    return getExistingMatr(r.caseId)
                                })
                                .then(r => {
                                    console.log(r)
                                    me.setState({
                                        allow: true,
                                        error: '',
                                        existingMatrList: r.matrikler
                                    })

                                    r.matrikler.forEach(function(obj) {
                                        me.addMatrikel(obj)
                                    })

                                })
                                .catch(e => {
                                    me.setState({
                                        allow: false,
                                        error: e
                                    })
                                })
                            }

                            utils.cursorStyle().crosshair();
                        });

                        // Deactivates module
                        backboneEvents.get().on(`off:${exId} off:all reset:all`, () => {
                            console.log(`Stopping ${exId}`)
                            me.setState({
                                active: false
                            });
                            utils.cursorStyle().reset();

                        });
                    }
                    

                    /**
                     * Handle file selected
                     * @param {*} files 
                     */
                    onDrop(files) {
                        const _self = this;

                        //TODO: Handle more?

                        var r = new FileReader();
                        r.readAsDataURL(files[0])
                        r.onloadend = function() {
                            let b64 = r.result
                            _self.readContents(b64)
                        }
                    }

                    /**
                     * Reads content of uploaded ZIP-file
                     * @param {*} blob 
                     */
                    readContents(blob) {
                        var _self = this;                            
                    }

                    deleteMatrikel(id){
                        const _self = this;
                        // TODO: Remove matrikel from map and state.
                        
                        // Remove from state
                        _self.setState({
                            matrList: _self.state.matrList.filter(el => el != id)
                        });
                    }

                    focusMatrikel(id){
                        const _self = this;
                        // TODO: Focus on matrikel - infobox.
                    }

                    addMatrikel(id){
                        const _self = this;
                        // TODO: Add matrikel to map and state.
                        var clean = _self.cleanMatr(id)

                        // Add to state
                        let prev = _self.state.matrList
                        prev.push(clean)
                        _self.setState({
                            matrList: prev
                        })
                    }

                    cleanMatr(matr){
                        // Determines the matrikel-object in state
                        var clean = {
                            ejerlavskode: '',
                            matrikelnr: '',
                            kommune: '',
                            kommunekode: '',
                            bfe: '',
                            esr: ''
                        }

                        // Comes from Docunote
                        if (matr.hasOwnProperty('personId')) {
                            clean.ejerlavskode = matr.customData.ejerlavskode
                            clean.ejerlavsnavn = matr.lastName
                            clean.matrikelnr =  matr.customData.matrnrcustom
                            clean.kommune =  matr.customData.matrkomnavn
                            clean.kommunekode = matr.customData.kommunenr
                            clean.bfe =  ''
                            clean.esr =  matr.customData.matresrnr
                        }

                        return clean
                    }



                    /**
                     * Renders component
                     */
                    render() {
                        const _self = this;
                        const s = _self.state
                        //console.log(s)

                        const error = {
                            color: 'white',
                            padding: '2%',
                            position: 'relative',
                            display: 'block',
                            textAlign: 'center',
                            fontSize: '2rem',
                            margin: '1rem',
                            height: '50px',
                            backgroundColor: '#eda72d'
                        }

                        if (s.allow) {
                            return (
                                <div role = "tabpanel" >
                                    <div className = "form-group" >
                                        {s.error.length > 0 && <div style={error} >{s.error}</div>}
                                        <h4>Journalnummer: {s.case.number}</h4>
                                        <p>{s.case.title}</p>
                                        <MatrikelTable matrListe = {s.matrList} _handleDelete = {_self.deleteMatrikel} _handleFocus = {_self.focusMatrikel}/>
                                    </div>
                                </div>
                            )
                        } else {
                            return (
                                <div role = "tabpanel" >
                                    <div className = "form-group" >
                                        {s.error.length > 0 && <div style={error} >{s.error}</div>}
                                        Indlæser.
                                    </div>
                                </div>
                            )
                        }
                    }
                }
                                
                utils.createMainTab(exId, __("Plugin Tooltip"), __("Info"), require('./../../../browser/modules/height')().max, "label", false, exId)
                    // Append to DOM
                    //==============
                    try {
                        ReactDOM.render( <GeoSag/> , document.getElementById(exId));
                    } catch (e) {
                        throw 'Failed to load DOM'
                    }
        },
        callBack: function (url) {
            utils.popupCenter(url, (utils.screen().width - 100), (utils.screen().height - 100), exId);
        },
        setCallBack: function (fn) {
            this.callBack = fn;
        }
    };