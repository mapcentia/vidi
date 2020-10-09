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
import { isNull, isSet } from 'lodash';
import { getClassSet } from 'react-bootstrap/lib/utils/bootstrapUtils';
import MatrikelTable from './MatrikelTable';
import DAWASearch from './DAWASearch';


/**
 *
 * @type {*|exports|module.exports}
 */
var cloud;

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

var config = require('../../../config/config.js');

// Get URL vars
if (urlparser.urlVars.user) {
    var user = urlparser.urlVars.user;
}
if (urlparser.urlVars.sagsnr) {
    var sagsnr = urlparser.urlVars.sagsnr;
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
};
var resultLayer = new L.FeatureGroup();

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

                var itsSomething = function(obj) {
                    if (obj === undefined) {
                        return false
                    }
                    if (isNull(obj)){
                        return false
                    }
                    if (isNaN(obj)){
                        return false
                    }

                    return true
                }

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

                var getJordstykkeByCoordinate = function(E,N, geom = undefined) {
                    var hostName = 'https://dawa.aws.dk/jordstykker?';
                    
                    var params = {
                        cache: 'no-cache',
                        x: E,
                        y: N,
                        srid: '25832'
                    };

                    // TODO: Add toogle to use for getting geometry aswell
            
                    return new Promise(function(resolve, reject) {
                        fetch(hostName + new URLSearchParams(params))
                            .then(r => r.json())
                            .then(d => {
                                resolve(d);
                            })
                            .catch(e => reject(e));
                    });
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
                        this.focusMatrikel = this.focusMatrikel.bind(this)
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

                        // TODO: Remove from Map
                    }

                    focusMatrikel(id){
                        const _self = this;
                        // TODO: Focus on matrikel
                        // Zoom to geom, change style, show info box
                    }

                    addMatrikel(id){
                        const _self = this;
                        // TODO: Add matrikel to map and state.
                        _self.unifyMatr(id)
                            .then(clean => {
                                try {
                                    var AlreadyInList = _self.state.matrList.find(m => m['key'] === clean.key)
                                    if (!AlreadyInList) {
                                        // If not already in state, then put it there
                                        let prev = _self.state.matrList
                                        prev.push(clean)

                                        _self.setState({
                                            matrList: prev
                                        })
                                    
                                        // TODO: Add to Map
                                    }
                                } catch (error) {
                                    _self.setState({
                                        error: e.toString()
                                    });
                                }
                                
                            })
                            .catch(e => {
                                _self.setState({
                                    error: e.toString()
                                });
                            })
                    }

                    unifyMatr(matr){
                        // Determines the matrikel-object in state
                        var unableToGetValue = '-'
                        var clean = {
                            ejerlavsnavn: unableToGetValue,
                            ejerlavskode: unableToGetValue,
                            matrikelnr: unableToGetValue,
                            kommune: unableToGetValue,
                            kommunekode: unableToGetValue,
                            bfe: unableToGetValue,
                            esr: unableToGetValue
                        }
                        

                        // TODO: make value checks more robust.

                        return new Promise(function(resolve, reject) {
                            // Comes from DAWA Adresse
                            if (matr.hasOwnProperty('adresse')) {
                                getJordstykkeByCoordinate(matr.adresse.x, matr.adresse.y)
                                    .then(d => {
                                        clean.ejerlavskode = d[0].ejerlav.kode.toString()
                                        clean.ejerlavsnavn = (itsSomething(d[0].ejerlav.navn)) ? unableToGetValue : d[0].ejerlav.navn
                                        clean.matrikelnr = d[0].matrikelnr
                                        clean.kommune = (itsSomething(d[0].kommune.navn)) ? unableToGetValue : d[0].kommune.navn
                                        clean.kommunekode = (itsSomething(d[0].kommune.kode)) ? unableToGetValue : d[0].kommune.kode
                                        clean.bfe = (itsSomething(d[0].bfenummer)) ? unableToGetValue : d[0].bfenummer
                                        clean.esr = (itsSomething(d[0].udvidet_esrejendomsnr)) ? unableToGetValue : d[0].udvidet_esrejendomsnr

                                        clean.key = clean.ejerlavskode+clean.matrikelnr
                                        resolve(clean)
                                    })
                                    .catch(e => reject(e))
                            }

                            // Comes from DAWA Jordstykke
                            if (matr.hasOwnProperty('jordstykke')) {
                                try {
                                    clean.ejerlavskode = matr.jordstykke.ejerlav.kode.toString()
                                    clean.ejerlavsnavn = (itsSomething(matr.jordstykke.ejerlav.navn)) ? unableToGetValue : matr.jordstykke.ejerlav.navn
                                    clean.matrikelnr = matr.jordstykke.matrikelnr
                                    
                                    if (isNull(matr.jordstykke.kommune)) {
                                        clean.kommune = unableToGetValue
                                        clean.kommunekode = unableToGetValue
                                    } else {
                                        clean.kommune = (itsSomething(matr.jordstykke.kommune.navn)) ? unableToGetValue : matr.jordstykke.kommune.navn
                                        clean.kommunekode = (itsSomething(matr.jordstykke.kommune.kode)) ? unableToGetValue : matr.jordstykke.kommune.kode
                                    }
                                    clean.bfe = (isNull(matr.jordstykke.bfenummer)) ? unableToGetValue : matr.jordstykke.bfenummer
                                    clean.esr = (itsSomething(matr.jordstykke.udvidet_esrejendomsnr)) ? unableToGetValue : matr.jordstykke.udvidet_esrejendomsnr
    
                                    clean.key = clean.ejerlavskode+clean.matrikelnr
                                    resolve(clean)
                                } catch (error) {
                                    reject(error.toString())
                                }
                            }

                            // Comes from Docunote
                            if (matr.hasOwnProperty('personId')) {
                                try {
                                    clean.ejerlavskode = matr.customData.ejerlavskode
                                    clean.ejerlavsnavn = (itsSomething(matr.lastName)) ? unableToGetValue : matr.lastName
                                    clean.matrikelnr =  matr.customData.matrnrcustom
                                    clean.kommune =  (itsSomething(matr.customData.matrkomnavn)) ? unableToGetValue : matr.customData.matrkomnavn
                                    clean.kommunekode = (itsSomething(matr.customData.kommunenr)) ? unableToGetValue : matr.customData.kommunenr
                                    clean.bfe =  (itsSomething(matr.customData.bfenummer)) ? unableToGetValue : matr.customData.bfenummer
                                    clean.esr =  (itsSomething(matr.customData.matresrnr)) ? unableToGetValue : matr.customData.matresrnr
    
                                    clean.key = clean.ejerlavskode+clean.matrikelnr
                                    resolve(clean)
                                } catch (error) {
                                    reject(error.toString())
                                }
                            }
                        });
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
                                        <DAWASearch 
                                            _handleResult = {_self.addMatrikel}
                                            triggerAtChar = {2}
                                            nocache = {true}
                                        />
                                        <MatrikelTable
                                            matrListe = {s.matrList}
                                            shorterLength = {40}
                                            _handleDelete = {_self.deleteMatrikel}
                                            _handleFocus = {_self.focusMatrikel}
                                        />
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