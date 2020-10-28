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

var matrikelLayer = new L.FeatureGroup();

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
                            .catch(e => {
                                console.log(e)
                                reject(e)
                            });
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
                            .catch(e => {
                                console.log(e)
                                reject(e)
                            });
                    })
                }

                var getJordstykkeByCoordinate = function(E,N,utm=true) {
                    var hostName = 'https://dawa.aws.dk/jordstykker?';
                    
                    var params = {
                        cache: 'no-cache',
                    };

                    if (utm) {
                        params.x = E
                        params.y = N
                        params.srid = '25832'
                    } else {
                        params.x = E
                        params.y = N
                        params.srid = '4326'
                    }

                    return new Promise(function(resolve, reject) {
                        fetch(hostName + new URLSearchParams(params))
                            .then(r => r.json())
                            .then(d => {
                                resolve(d[0]);
                            })
                            .catch(e => reject(e));
                    });
                }
                
                var getJordstykkeByMatr = function (matr, elavkode){
                    var hostName = 'https://dawa.aws.dk/jordstykker/'+elavkode+'/'+matr+'/?';
                    
                    var params = {
                        cache: 'no-cache'
                    };

                    return new Promise(function(resolve, reject) {
                        fetch(hostName + new URLSearchParams(params))
                            .then(r => r.json())
                            .then(d => {
                                d.key = elavkode+matr
                                resolve(d);
                            })
                            .catch(e => {
                                console.log(e)
                                reject(e)
                            });
                    });
                }

                var getJordstykkeGeom = function(matr, elavkode) {
                    // Builds feature for map
                    var hostName = 'https://dawa.aws.dk/jordstykker/'+elavkode+'/'+matr+'/?';
                    
                    var params = {
                        cache: 'no-cache',
                        format: 'geojson',
                        srid: '4326'
                    };

                    return new Promise(function(resolve, reject) {
                        fetch(hostName + new URLSearchParams(params))
                            .then(r => r.json())
                            .then(d => {
                                d.properties.key = elavkode+matr
                                resolve(d);
                            })
                            .catch(e => {
                                console.log(e)
                                reject(e)
                            });
                    });
                }

                var getJordstykkerByBFE = function(bfenummer) {
                    var hostName = 'https://dawa.aws.dk/jordstykker/autocomplete?';
                    
                    var params = {
                        cache: 'no-cache',
                        bfenummer: bfenummer
                    };

                    return new Promise(function(resolve, reject) {
                        fetch(hostName + new URLSearchParams(params))
                            .then(r => r.json())
                            .then(d => {
                                resolve(d);
                            })
                            .catch(e => {
                                console.log(e)
                                reject(e)
                            });
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
                        this.findMatrikel = this.findMatrikel.bind(this)
                        this.getCustomLayer = this.getCustomLayer.bind(this)
                        this.matrikelCoordTransf = this.matrikelCoordTransf.bind(this)
                        this.matrikelOnEachFeature = this.matrikelOnEachFeature.bind(this)
                        this.matrikelStyle = this.matrikelStyle.bind(this)
                        this.zoomToMatrikel = this.zoomToMatrikel.bind(this)
                        this.unifyMatr = this.unifyMatr.bind(this)
                    }

                    /**
                     * Handle activation on mount
                     */
                    componentDidMount() {
                        let me = this;

                        // Stop listening to any events, deactivate controls, but
                        // keep effects of the module until they are deleted manually or reset:all is emitted
                        backboneEvents.get().on("deactivate:all", () => {});

                        // Add layer
                        cloud.get().map.addLayer(matrikelLayer);
                        matrikelLayer.clearLayers();

                        // Click event - info
                        mapObj.on("click", function (e) {
                            //TODO: Enable only if extension is active?!
                            me.findMatrikel(e);
                        });
                        
                        
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
                                    //console.log(r)
                                    me.setState({
                                        allow: true,
                                        error: '',
                                        existingMatrList: r.matrikler
                                    })
                                    var jobs = []
                                    // Add existing
                                    r.matrikler.forEach(function(obj) {
                                        // Add to list also
                                        jobs.push(me.addMatrikel(obj, true));
                                    })
                                    return Promise.all(jobs);
                                })
                                .then(j => {
                                    //console.log(j)
                                })
                                .catch(e => {
                                    console.log(e)
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
                        // Remove from Map - we dont want that - keep as cache'ish
                        //let layer = _self.getCustomLayer(id.key)
                        //cloud.get().map.removeLayer(layer)

                        // Remove from state
                        _self.setState({
                            matrList: _self.state.matrList.filter(el => el.key != id.key)
                        });
                    }

                    focusMatrikel(id){
                        const _self = this;
                        // Zoom to geom, change style, show info box
                        _self.zoomToMatrikel(id.key);
                        _self.triggerMatrikel(id.key);
                    }

                    zoomToMatrikel(key, maxZoom = 16, padding = 50) {
                        const _self = this;
                        var layer = _self.getCustomLayer(key);
                        cloud.get().map.fitBounds(layer.getBounds(), {padding: [padding, padding], maxZoom: maxZoom});
                    }

                    triggerMatrikel(key, event = 'click') {
                        const _self = this;
                        var layer = _self.getCustomLayer(key);
                        // Trigger click event on matrikel
                        layer.getLayers()[0].openPopup();

                    }

                    getCustomLayer(key) {
                        var l;
                        var match = matrikelLayer.eachLayer(function(layer) {
                            if (layer.id == key) {
                                l = layer
                            }
                        })
                        return l
                    }

                    alreadyInActive(key) {
                        const _self = this;
                        return _self.state.matrList.find(m => m['key'] === key)
                    }

                    resolveMatrikel(id) {
                        return new Promise(function(resolve, reject) {
                            if (id.hasOwnProperty('key') || id.hasOwnProperty('synchronizeIdentifier') || id.hasOwnProperty('tekst')){
                                // From docunote or DAWA
                                resolve(id)
                            } else if (id.hasOwnProperty('latlng')) {
                                // Event from click
                                getJordstykkeByCoordinate(id.latlng.lng, id.latlng.lat, false)
                                .then(r => {
                                    resolve(r);
                                })
                                .catch(e => {
                                    reject(e);
                                })

                            } else {
                                console.log('unknown')
                                console.log(id)
                                getJordstykkeByMatr(id.matrikelnr, id.ejerlav.toString())
                                .then(r => {
                                    resolve(r)
                                })
                                .catch(e => {
                                    reject(e)
                                })
                            }
                        });
                    }

                    addMatrikel(id, addToList=false) {
                        const _self = this;
                        // Add matrikel to map

                        // We don't have information, get it
                        return new Promise(function(resolve, reject) {
                            _self.resolveMatrikel(id)
                            .then(r => {
                                return _self.unifyMatr(r);
                            })
                            .then(clean => {
                                if (addToList) {
                                    console.log('adding to list');
                                    _self.addMatrikelToList(clean);
                                }
                                return getJordstykkeGeom(clean.matrikelnr, clean.ejerlavskode)
                            })
                            .then(feat => {
                                return _self.addMatrikelToMap(feat)
                            })
                            .then(layer => {
                                resolve(layer);
                            })
                            .catch(e => {
                                console.log(e);
                                reject(e);
                            })
                        });
                    }

                    findMatrikel(id) {
                        const _self = this;
                        _self.addMatrikel(id, false)
                        .then(r => {
                            _self.focusMatrikel({key: r.id});
                        })
                        .catch(e => {
                            console.log(e)
                        })
                    }

                    addMatrikelToMap(feat){
                        const _self = this;
                        return new Promise(function(resolve, reject) {
                            // check if exists already
                            var evaluate = _self.getCustomLayer(feat.properties.key)
                            if (evaluate) {
                                // Already present, return the layer
                                resolve(_self.getCustomLayer(feat.properties.key));
                            } else {
                                var js = new L.GeoJSON(feat, {
                                    style: _self.matrikelStyle,
                                    onEachFeature: _self.matrikelOnEachFeature,
                                    coordsToLatLng: _self.matrikelCoordTransf
                                });
                                js.id = feat.properties.key;
                                js.addTo(matrikelLayer);
                                resolve(js);
                            }
                        })
                    }

                    addMatrikelToList(id) {
                        const _self = this;
                        if (!_self.alreadyInActive(id.key)) {
                            // If not already in state, then put it there
                            let prev = _self.state.matrList
                            prev.push(id)
                            _self.setState({
                                matrList: prev
                            })
                        }
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
                                getJordstykkeByCoordinate(matr.adresse.x, matr.adresse.y, true)
                                    .then(d => {
                                        clean.ejerlavskode = d.ejerlav.kode.toString()
                                        clean.ejerlavsnavn = (itsSomething(d.ejerlav.navn)) ? unableToGetValue : d.ejerlav.navn
                                        clean.matrikelnr = d.matrikelnr
                                        clean.kommune = (itsSomething(d.kommune.navn)) ? unableToGetValue : d.kommune.navn
                                        clean.kommunekode = (itsSomething(d.kommune.kode)) ? unableToGetValue : d.kommune.kode
                                        clean.bfe = (itsSomething(d.bfenummer)) ? unableToGetValue : d.bfenummer
                                        clean.esr = (itsSomething(d.udvidet_esrejendomsnr)) ? unableToGetValue : d.udvidet_esrejendomsnr

                                        clean.key = clean.ejerlavskode+clean.matrikelnr
                                        resolve(clean)
                                    })
                                    .catch(error => {
                                        console.log(error)
                                        reject(error)
                                    })
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
                                    console.log(error)
                                    reject(error.toString())
                                }
                            }

                            // Comes from DAWA Jordstykke - coordinate
                            if (matr.hasOwnProperty('featureid')) {
                                try {
                                    clean.ejerlavskode = matr.ejerlav.kode.toString()
                                    clean.ejerlavsnavn = (itsSomething(matr.ejerlav.navn)) ? unableToGetValue : matr.ejerlav.navn
                                    clean.matrikelnr = matr.matrikelnr
                                    
                                    if (isNull(matr.kommune)) {
                                        clean.kommune = unableToGetValue
                                        clean.kommunekode = unableToGetValue
                                    } else {
                                        clean.kommune = (itsSomething(matr.kommune.navn)) ? unableToGetValue : matr.kommune.navn
                                        clean.kommunekode = (itsSomething(matr.kommune.kode)) ? unableToGetValue : matr.kommune.kode
                                    }
                                    clean.bfe = (isNull(matr.bfenummer)) ? unableToGetValue : matr.bfenummer
                                    clean.esr = (itsSomething(matr.udvidet_esrejendomsnr)) ? unableToGetValue : matr.udvidet_esrejendomsnr
    
                                    clean.key = clean.ejerlavskode+clean.matrikelnr
                                    resolve(clean)
                                } catch (error) {
                                    console.log(error)
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
                                    console.log(error)
                                    reject(error.toString())
                                }
                            }
                        });
                    }

                    // Map style
                    matrikelStyle(feature){
                        const _self = this;

                        let basic = {
                            fillColor: 'green', 
                            fillOpacity: 0.5,  
                            weight: 2,
                            opacity: 1,
                            color: '#ffffff',
                            dashArray: '3'
                        };

                        // TODO: If matrikel is in active list, show it
                        if (_self.alreadyInActive(feature.properties.key)){
                            basic.fillColor = 'red'
                            basic.fillOpacity = 0.75
                        }
                        return basic;
                    };

                    matrikelHighlightStyle = {
                        'fillColor': 'yellow',
                        'weight': 2,
                        'opacity': 1
                    };

                    matrikelOnEachFeature(feature, layer) {
                        const _self = this;
                        var p = feature.properties

                        // Construct popup content

                        var container = $('<div />');
                        container.on('click', '.addMatrikel', function() {
                            _self.addMatrikel({matrikelnr: p.matrikelnr, ejerlav: p.ejerlavkode}, true);
                        });
                        container.on('click', '.addEjendom', function() {
                            _self.addEjendom(p.bfenummer);
                        });
                        container.on('click', '.deleteMatrikel', function() {
                            _self.deleteMatrikel({key:p.key});
                        });
                        container.on('click', '.deleteEjendom', function() {
                            _self.deleteEjendom(p.bfenummer);
                        });

                        container.html(`
                        <h5>${p.matrikelnr}</h5>
                        <h6>${p.ejerlavnavn} (${p.ejerlavkode})</h6>
                        <p>
                        <b>Kommune: </b>${p.kommunenavn} (${p.kommunekode})</br>
                        <b>ESR: </b>${p.udvidet_esrejendomsnr}</br>
                        <b>BFE: </b>${p.bfenummer}</br>
                        </p>
                        `);

                        container.append(`
                            <p>
                            <b>Tilføj: </b><a href="#" class="addMatrikel" alt="Tilføj matrikel">matrikel</a> / <a href="#" class="addEjendom" alt="Tilføj ejendom">ejendom</a></br>
                            <b>Fjern: </b><a href="#" class="deleteMatrikel" alt="Fjern matrikel">matrikel</a> / <a href="#" class="deleteEjendom" alt="Fjern ejendom">ejendom</a></br>
                            </p>
                        `)
                        layer.bindPopup(container[0]);
                    
                        // Set Highlight
                        layer.on({
                            mouseover: () =>{
                                layer.setStyle(_self.matrikelHighlightStyle);
                            },
                            mouseout: () => {
                                matrikelLayer.setStyle(_self.matrikelStyle);
                            }
                        }); 
                    }

                    addEjendom( bfe ) {
                        const _self = this;
                        getJordstykkerByBFE( bfe )
                        .then(r => {
                            let jobs = [];
                            r.forEach(matr => {
                                jobs.push(_self.addMatrikel(matr, true))
                            })
                            return jobs
                        })
                        .then(l => {
                            //console.log(l)
                        })
                        .catch(e => {
                            console.log(e);
                        })
                    }
                    deleteEjendom( bfe )  {
                        const _self = this;
                        getJordstykkerByBFE( bfe )
                        .then(r => {
                            r.forEach(matr => {
                                let k = matr.jordstykke.ejerlav.kode+matr.jordstykke.matrikelnr;
                                _self.deleteMatrikel({key: k});
                            })
                        })
                        .catch(e => {
                            console.log(e);
                        })
                    }
                    
                    matrikelCoordTransf(coords){
                        const _self = this;

                        if (coords.length == 3) {
                            return new L.LatLng(coords[1], coords[0], coords[2])
                        } else {
                            return new L.LatLng(coords[1], coords[0])
                        }
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
                                            _handleResult = {_self.findMatrikel}
                                            triggerAtChar = {3}
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