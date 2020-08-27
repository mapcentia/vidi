/*
 * @author     Martin Høgh <mh@mapcentia.com>
 * @copyright  2013-2019 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

'use strict';

/* Import big-brains*/
import {
    v4 as uuidv4
} from 'uuid';
import Dropzone from 'react-dropzone';
import JSZip from 'jszip';
import LedningsEjerStatusTable from "./LedningsEjerStatusTable";
import LedningsProgress from "./LedningsProgress";
import LedningsDownload from "./LedningsDownload";
import Button from '@material-ui/core/Button';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import {
    reject
} from 'underscore';

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
var exId = "graveAssistent";

/**
 *
 */
var clicktimer;

/**
 *
 */
var mapObj;

var DClayers = []
//var gc2host = 'http://localhost:3000'
var config = require('../../../config/config.js');

/**
 * Slice array into chunks
 * @param {*} n 
 */
Array.range = function (n) {
    // Array.range(5) --> [0,1,2,3,4]
    return Array.apply(null, Array(n)).map((x, i) => i)
};

Object.defineProperty(Array.prototype, 'chunk', {
    value: function (n) {

        // ACTUAL CODE FOR CHUNKING ARRAY:
        return Array.range(Math.ceil(this.length / n)).map((x, i) => this.slice(i * n, i * n + n));

    }
});

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
 * @param {*} objId - querySelector
 * @param {*} propertyObject - CSS properties
 */
var setStyle = function (objId, propertyObject) {
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
                        "da_DK": "LER 2.0 Graveassistent",
                        "en_US": "LER 2.0 Graveassistant"
                    },
                    "MissingLogin": {
                        "da_DK": "NB: Du skal være logget ind for at kunne bruge funktionen",
                        "en_US": "Please log in to use this function"
                    },
                    "Login": {
                        "da_DK": "Log ind",
                        "en_US": "Log in"
                    },
                    "backbutton": {
                        "da_DK": "Tilbage",
                        "en_US": "Go Back"
                    },
                    "uploadtime": {
                        "da_DK": "Ledningspakke uploaded",
                        "en_US": "'Ledningspakke' uploaded at"
                    },
                    "uploadmessage": {
                        "da_DK": "Træk og slip din ledningspakke her, eller klik for at vælg filen fra din computer",
                        "en_US": "Drag and drop your 'ledningspakke' here, or click to select from drive."
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
                 * Flattens object
                 * @param {*} obj 
                 */
                var flattenObject = function (obj) {
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
                var parsetoJSON = function (xmlData) {
                    var jsonObj, Err = {}
                    var parser = require('fast-xml-parser');
                    var options = {
                        attributeNamePrefix: "",
                        attrNodeName: "attr", //default is 'false'
                        textNodeName: "value",
                        ignoreAttributes: false,
                        ignoreNameSpace: true,
                        allowBooleanAttributes: false,
                        parseNodeValue: true,
                        parseAttributeValue: true,
                        trimValues: true,
                        cdataTagName: "__cdata", //default is 'false'
                        cdataPositionChar: "\\c",
                        parseTrueNumberOnly: false,
                        arrayMode: false, //"strict"
                        stopNodes: ["parse-me-as-string"]
                    };

                    return new Promise(function (resolve, reject) {
                        if (parser.validate(xmlData) === true) { //optional (it'll return an object in case it's not valid)
                            jsonObj = parser.parse(xmlData, options);
                            //console.log(jsonObj)
                            resolve(jsonObj)
                        } else {
                            err = parser.validate(xmlData)
                            reject(err)
                        }
                    });
                }

                /**
                 * Adds prefix to object
                 * @param {*} obj 
                 * @param {*} prefix 
                 */
                var rename = function (obj, prefix) {
                    if (typeof obj !== 'object' || !obj) {
                        return false; // check the obj argument somehow
                    }
                    var keys = Object.keys(obj),
                        keysLen = keys.length,
                        prefix = prefix || '';
                    for (var i = 0; i < keysLen; i++) {
                        obj[prefix + keys[i]] = obj[keys[i]];
                        if (typeof obj[keys[i]] === 'object') {
                            rename(obj[prefix + keys[i]], prefix);
                        }
                        delete obj[keys[i]];
                    }
                    return obj;
                };

                var lc = function (obj) {
                    var key, keys = Object.keys(obj);
                    var n = keys.length;
                    var newobj = {}
                    while (n--) {
                        key = keys[n];
                        newobj[key.toLowerCase()] = obj[key];
                    }
                    return newobj
                }

                var handleGeometry = function (obj) {
                    //console.table()
                    let geomObj = {}
                    let flat = flattenObject(obj)

                    if (!typeof obj === 'object') {
                        return null
                    }

                    // Handle type
                    // Points
                    if ('Point' in obj) {
                        geomObj.type = 'MultiPoint'
                        //console.log(geomObj)
                    } else if ('LineString' in obj) {
                        geomObj.type = 'MultiLineString'
                    } else if ('Surface' in obj) {
                        geomObj.type = "MultiPolygon"
                        console.log(obj)
                        console.log(flat)
                    } else if ('Polygon' in obj) {
                        geomObj.type = "MultiPolygon"
                    } else {
                        // Matched nothing, kill 
                        return null
                    }

                    //TODO: Improve handeling of multi's

                    // Handle geometry
                    flat.type = geomObj.type
                    //console.table(flat)

                    let dim = 2
                    if (flat.hasOwnProperty('srsDimension')) {
                        dim = flat.srsDimension
                    }
                    if (flat.hasOwnProperty('posList')) {
                        if (flat.type == 'MultiPolygon') {
                            geomObj.coordinates = flat.posList.split(' ').map(Number).chunk(dim)
                            let rings = [geomObj.coordinates]
                            let multis = [rings]
                            geomObj.coordinates = multis

                        } else {
                            geomObj.coordinates = [flat.posList.split(' ').map(Number).chunk(dim)]
                        }
                    } else if (flat.hasOwnProperty('pos')) {
                        geomObj.coordinates = [flat.pos.split(' ').map(Number)]
                    } else if (flat.hasOwnProperty('coordinates')) {
                        let coords = flat.coordinates.split(' ')
                        geomObj.coordinates = []
                        let c;
                        for (c in coords) {
                            geomObj.coordinates.push(coords[c].split(',').map(Number))
                        }
                        let rings = [geomObj.coordinates]
                        let multis = [rings]
                        geomObj.coordinates = multis

                    } else if (flat.hasOwnProperty('value')) {
                        if (flat.type == 'MultiPoint') {
                            geomObj.coordinates = flat.value.split(' ').map(Number).chunk(dim)
                        } else {
                            geomObj.coordinates = [flat.value.split(' ').map(Number).chunk(dim)]
                        }

                    } else {
                        // hard-pass on the rest for now
                        geomObj = {
                            type: 'unknown',
                            coordinates: null
                        }
                    }

                    return geomObj

                }

                /**
                 * Parse consolidated to an array of data and enrich
                 * first object will always be the foresp. itself - handle accordingly
                 * @param {*} consolidated 
                 */
                var parseConsolidated = function (consolidated) {
                    const cons = consolidated['FeatureCollection']['featureMember']
                    //console.log(cons)

                    const returnObj = {
                        foresp: {},
                        forespNummer: 0,
                        data: []
                    }
                    const foresp = [],
                        owner = [],
                        packageinfo = [],
                        profil = [],
                        data = []

                    /* sort the package */
                    for (const i in cons) {
                        /* Lets sort it out */
                        if (cons[i]["Graveforesp"]) {
                            foresp.push(Object.values(cons[i])[0])
                        } else if (cons[i]["UtilityPackageInfo"]) {
                            packageinfo.push(rename(Object.values(cons[i])[0], 'svar_'))
                        } else if (cons[i]["UtilityOwner"]) {
                            owner.push(rename(Object.values(cons[i])[0], 'svar_'))
                        } else if (cons[i]["Kontaktprofil"]) {
                            profil.push(rename(Object.values(cons[i])[0], 'svar_'))
                        } else {
                            data.push(Object.values(cons[i])[0])
                        }
                    }

                    // Handle Graveforsp.
                    try {
                        foresp.forEach(function (item) {
                            //console.log(item)

                            //console.log(item.polygonProperty)
                            let geom = handleGeometry(item.polygonProperty)
                            //console.log(geom)

                            delete item.polygonProperty
                            delete item.graveart_anden
                            delete item.graveart_id
                            delete item.fid

                            item.objectType = item.objectType.replace('lergml:', '')

                            returnObj.forespNummer = item.orderNo

                            item.forespNummer = returnObj.forespNummer
                            delete item.orderNo

                            returnObj.foresp = {
                                type: 'Feature',
                                properties: lc(item),
                                geometry: geom
                            };

                        })
                    } catch (error) {
                        console.log(error)
                        reject(error)
                    }

                    /* Enrich each data value with contant, package and owner information - overwrite duplicate information */
                    try {
                        data.forEach(function (item) {

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
                            delete obj.indberetningsNr

                            // clean values
                            obj["objectType"] = obj["objectType"].replace('ler:', '')
                            delete obj.attr;
                            delete obj.svar_attr;

                            obj.forespNummer = returnObj.forespNummer

                            // etableringstidspunkt
                            if (obj.hasOwnProperty('etableringstidspunkt')) {
                                if (obj.etableringstidspunkt.hasOwnProperty('attr')) {
                                    //can only be "before"
                                    obj.etableringstidspunkt = 'Før ' + obj.etableringstidspunkt.value
                                }
                            }

                            // postfix rest of attributes
                            for (const [key, value] of Object.entries(obj)) {
                                // skip geom
                                if (key == 'geometri') {
                                    continue
                                }

                                if (typeof value == 'object') {
                                    //console.log(value);
                                    obj[key] = value.value + ' ' + value.attr.uom
                                    //console.log(obj[key])
                                }
                            }

                            //Redo Geometry
                            //console.log(obj.geometri)
                            let geom = handleGeometry(obj.geometri);
                            //console.log(geom)
                            delete obj.geometri;

                            //hack to geojson obj
                            obj = {
                                type: 'Feature',
                                properties: lc(obj),
                                geometry: geom
                            }

                            returnObj.data.push(lc(obj))
                            //TODO: gather up
                        })
                    } catch (error) {
                        console.log(error)
                        reject(error)
                    }

                    console.log('Fandt elementer: '.concat(packageinfo.length, ' UtilityPackageInfo, ', owner.length, ' UtilityOwner, ', profil.length, ' Kontaktprofil, ', data.length, ' data'))
                    //console.log(returnObj)

                    // use promise to return data in stream
                    return new Promise(function (resolve, reject) {
                        resolve(returnObj)
                    });

                }

                var pushForespoergsel = function (obj, statusKey) {
                    obj['statusKey'] = statusKey
                    let opts = {
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        method: 'POST',
                        body: JSON.stringify(obj)
                    }
                    return new Promise(function (resolve, reject) {
                        // Do async job and resolve
                        fetch('/api/extension/upsertForespoergsel', opts)
                            .then(r => {
                                const data = r.json();
                                resolve(data)
                            })
                            .catch(e => reject(e))
                    })
                }

                var parseStatus = function (statusObj) {

                    let ejerList = statusObj.LedningsejerListe.Ledningsejer

                    let ejere = []
                    try {
                        ejerList.forEach(l => {
                            // Check if we have more IOs
                            if (Array.isArray(l.Interesseområde)) {
                                l.Interesseområde.forEach(i => {
                                    let obj = {
                                        IndberetningsNr: i.IndberetningsNr,
                                        Status: i.Status,
                                        CVR: l.CVR,
                                        Navn: l.Navn
                                    }
                                    ejere.push(lc(obj))
                                })
                            } else {
                                let obj = {
                                    IndberetningsNr: l.Interesseområde.IndberetningsNr,
                                    Status: l.Interesseområde.Status,
                                    CVR: l.CVR,
                                    Navn: l.Navn
                                }
                                ejere.push(lc(obj))
                            }
                        })
                    } catch (error) {
                        console.log(error)
                        reject(error)
                    }
                    // use promise to return data in stream
                    return new Promise(function (resolve, reject) {
                        resolve(ejere)
                    });
                }

                var pushStatus = function (obj, statusKey) {
                    let postData = {
                        Ledningsejerliste: obj,
                        statusKey: statusKey
                    }
                    let opts = {
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        method: 'POST',
                        body: JSON.stringify(postData)
                    }

                    return new Promise(function (resolve, reject) {
                        // Do async job and resolve
                        fetch('/api/extension/upsertStatus', opts)
                            .then(r => {
                                const data = r.json();
                                resolve(data)
                            })
                            .catch(e => reject(e))
                    })
                }

                var buildFilter = function (key = undefined) {
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
                            filter[DClayers[l]] = {
                                "match": "any",
                                "columns": [{
                                    "fieldname": 'forespnummer',
                                    "expression": '=',
                                    "value": String(key),
                                    "restriction": false
                                }]
                            }
                        }

                    }
                    //console.log(filter)
                    // Return the stuff
                    return filter
                }

                var applyFilter = function (filter) {
                    for (let layerKey in filter) {
                        console.log('graveAssistent - Apply filter to ' + layerKey)

                        //Make sure layer is on
                        //TODO tænd laget hvis det ikke allerede er tændt! - skal være tændt før man kan ApplyFilter
                        layerTree.reloadLayer(layerKey)

                        //Toggle the filter
                        if (filter[layerKey].columns.length == 0) {
                            // insert fixed dummy filter
                            // in order to filter out all features from layer
                            //var blankfeed = {expression: "=",
                            //                fieldname: "forespnummer",
                            //                restriction: false,
                            //                value: "0"};
                            //filter[layerKey].columns.push(blankfeed);

                            layerTree.onApplyArbitraryFiltersHandler({
                                layerKey,
                                filters: filter[layerKey]
                            }, 't');
                        } else {
                            layerTree.onApplyArbitraryFiltersHandler({
                                layerKey,
                                filters: filter[layerKey]
                            }, 't');
                        }
                        //Reload
                        layerTree.reloadLayerOnFiltersChange(layerKey)

                        continue;
                    }
                };

                var clearFilters = function () {
                    // clear filters from layers that might be on! - then reload
                    console.log('graveAssistent - cleaning filters for reload')

                    //Buildfilter with no value for "clear" value
                    var filter = buildFilter()

                    // apply filter
                    applyFilter(filter);
                };



                /**
                 *
                 */
                class GraveAssistent extends React.Component {
                    constructor(props) {
                        super(props);

                        this.state = {
                            active: false,
                            done: false,
                            loading: false,
                            authed: false,
                            progress: 0,
                            progressText: '',
                            ejerliste: [],
                            isError: false,
                            errorList: [],
                            forespOptions: [],
                            foresp: ''
                        };

                        this.readContents = this.readContents.bind(this)
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
                            console.log('Starting graveAssistent')
                            me.setState({
                                active: true
                            });
                            me.populateDClayers()
                            utils.cursorStyle().crosshair();
                        });

                        // Deactivates module
                        backboneEvents.get().on(`off:${exId} off:all reset:all`, () => {
                            console.log('Stopping graveAssistent')
                            me.setState({
                                active: false
                            });
                            utils.cursorStyle().reset();
                        });

                        // On auth change, handle Auth state
                        backboneEvents.get().on(`session:authChange`, () => {
                            console.log('Auth changed!')
                            fetch("/api/session/status")
                                .then(r => r.json())
                                .then(obj => me.setState({
                                    authed: obj.status.authenticated
                                }, () => {
                                    // Get foresp. if we really logged in.
                                    // TODO: check we're in the right schema!
                                    if (me.state.authed) {
                                        me.populateForespoergselOption() //
                                    }
                                }))
                                .catch(e => me.setState({
                                    authed: false
                                }))
                        })
                    }


                    /**
                     * Handle file selected
                     * @param {*} files 
                     */
                    onDrop(files) {
                        const _self = this;
                        //TODO: screen input
                        //TODO: Handle more?
                        this.readContents(files[0])

                    }

                    // serves as state reset
                    onBackClickHandler() {
                        const _self = this
                        _self.setState({
                            done: false,
                            loading: false,
                            foresp: '',
                            svarUploadTime: '',
                            ejerliste: [],
                        }, () => {
                            _self.populateForespoergselOption() // On back click, populate select with new foresp
                            clearFilters()
                        })
                    }

                    handleForespSelectChange(event) {
                        const _self = this
                        _self.setState({
                            foresp: String(event.target.value)
                        })
                        _self.getForespoergsel(String(event.target.value))
                        _self.setState({
                            done: true
                        })
                    }

                    /**
                     * Reads content of uploaded ZIP-file
                     * @param {*} zipblob 
                     */
                    readContents(zipblob) {
                        var _self = this;
                        var newZip = new JSZip();

                        // reset states
                        _self.setState({
                            loading: true,
                            done: false,
                            progress: 0,
                            progressText: 'Læser ledningspakkke',
                            ejerliste: [],
                            isError: false,
                            errorList: [],
                            svarUploadTime: ''
                        })

                        var statusKey = uuidv4()

                        newZip.loadAsync(zipblob)
                            .then(function (zip) {
                                /* Load Status - 'LedningsejerStatusListe.xml', set state */
                                _self.setState({
                                    progress: 20,
                                    progressText: 'Indlæser statusliste'
                                })

                                zip.files['LedningsejerStatusListe.xml'].async('string')
                                    .then(fileData => parsetoJSON(fileData))
                                    .then(jsObj => parseStatus(jsObj))
                                    .then(parsed => {
                                        pushStatus(parsed, statusKey)
                                            .then(r => {
                                                //console.log(r)
                                                let wait = 5000
                                                if (r.some(i => i.success === false)) {
                                                    let errs = r.filter(obj => {
                                                        return obj.success === false
                                                    })
                                                    console.log('errors!')
                                                    console.log(errs)
                                                    _self.setState({
                                                        errorList: errs,
                                                        isError: true,
                                                        progress: 100,
                                                        progressText: 'Der skete en fejl!'
                                                    })
                                                    setTimeout(_self.setState({
                                                        loading: true,
                                                        done: false
                                                    }, () => {}), wait) // Return to start
                                                } else {
                                                    console.log('all fine!')
                                                    _self.setState({
                                                        isError: false,
                                                        progress: 30,
                                                        progressText: 'Gemmer status!'
                                                    })
                                                    return zip
                                                }
                                            })
                                            .catch(e => {
                                                console.log(e)
                                            })
                                    })
                                return zip //pass on same zip to next then
                            })
                            .then(function (zip) {
                                /* Load data - 'consolidated.gml' */
                                _self.setState({
                                    progress: 70,
                                    progressText: 'Gemmer ledningsdata'
                                })
                                zip.files['consolidated.gml'].async('string')
                                    .then(fileData => parsetoJSON(fileData))
                                    .then(jsObj => parseConsolidated(jsObj))
                                    .then(parsed => {
                                        pushForespoergsel(parsed, statusKey)
                                            .then(r => {
                                                //console.log(r)
                                                let wait = 5000
                                                if (r.some(i => i.success === false)) {
                                                    let errs = r.filter(obj => {
                                                        return obj.success === false
                                                    })
                                                    console.log('errors!')
                                                    console.log(errs)
                                                    _self.setState({
                                                        errorList: errs,
                                                        isError: true,
                                                        progress: 100,
                                                        progressText: 'Der skete en fejl!'
                                                    })
                                                    setTimeout(_self.setState({
                                                        loading: true,
                                                        done: false
                                                    }, () => {}), wait) // Return to start
                                                } else {
                                                    console.log('all fine!')
                                                    _self.setState({
                                                        isError: false,
                                                        progress: 100,
                                                        progressText: 'Færdig!'
                                                    })
                                                    setTimeout(_self.setState({
                                                        loading: false,
                                                        done: true
                                                    }, () => {
                                                        _self.getForespoergsel(String(parsed.forespNummer))
                                                    }), Math.floor(wait / 4)) // Go to ready
                                                }
                                            })
                                            .catch(e => {
                                                console.log(e)
                                            })
                                    })
                            }).catch(function (error) {
                                console.log(error)
                            })
                    }

                    /**
                     * Populate the list of active layers used in filters
                     */
                    populateDClayers() {
                        try {
                            metaData.data.forEach(function (d) {
                                if (d.f_table_name) {
                                    if (d.f_table_name.includes('graveassistent_')) {
                                        DClayers.push(d.f_table_schema + '.' + d.f_table_name);
                                    }
                                }
                            });
                            //console.log(DClayers)
                        } catch (error) {
                            console.info('graveAssistent - Kunne ikke finde lag med korrekt tag')

                        }

                    }

                    /**
                     * Populate the forsp-select with foresp currently saved in schema
                     */
                    populateForespoergselOption() {
                        var _self = this;
                        let opts = {
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            },
                            method: 'POST',
                        }
                        // Do async job
                        fetch('/api/extension/getForespoergselOption', opts)
                            .then(r => r.json())
                            .then(d => {
                                //console.log(d)
                                _self.setState({
                                    forespOptions: d
                                })
                            })
                            .catch(e => console.log(e))
                    }

                    getStatus(statuskey) {
                        var _self = this
                        let opts = {
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            },
                            method: 'POST',
                            body: JSON.stringify({
                                statusKey: statuskey
                            })
                        }
                        // Do async job
                        fetch('/api/extension/getStatus', opts)
                            .then(r => r.json())
                            .then(d => {
                                let a = []
                                d.forEach(f => {
                                    a.push(f.properties)
                                })
                                _self.setState({
                                    ejerliste: a
                                })
                            })
                            .catch(e => console.log(e))
                    }

                    /**
                     * Reads extents and status of saved foresp
                     * @param {*} forespNummer 
                     */
                    getForespoergsel(forespNummer) {
                        var _self = this;
                        let opts = {
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            },
                            method: 'POST',
                            body: JSON.stringify({
                                forespNummer: forespNummer
                            })
                        }
                        // Do async job
                        fetch('/api/extension/getForespoergsel', opts)
                            .then(r => r.json())
                            .then(d => {
                                //console.log(d);

                                // Zoom to location
                                // this has to be better for sorting then status is incomming!
                                let f = d[0].properties;
                                //console.log(d)
                                let bounds = [
                                    [
                                        f.ymin, f.xmin
                                    ],
                                    [
                                        f.ymax, f.xmax
                                    ]
                                ];
                                cloud.get().map.fitBounds(bounds)
                                
                                // Apply filter
                                _self.getStatus(f.statuskey)
                                applyFilter(buildFilter(f.forespnummer))


                                //SET SVAR_UPLOADTIME IN STATE
                                _self.setState({
                                    svarUploadTime: f.svar_uploadtime
                                })
                            })
                            .catch(e => console.log(e))
                    }

                    clickLogin() {
                        document.getElementById('session').click()
                    }

                    /**
                     * Renders component
                     */
                    render() {
                            const _self = this;
                            const s = _self.state
                            //console.log(s)

                            const formControl = {
                                minWidth: 120
                            }
                            const margin = {
                                margin: 10
                            }

                            if (s.authed) {
                                // Logged in
                                if (s.loading) {
                                    // If Loading, show progress
                                    return (
                                        <div role = "tabpanel" >
                                            <div className = "form-group" >
                                                <div>
                                                    <LedningsProgress progress = {s.progress} text = {s.progressText} iserror = {s.isError} errorlist = {s.errorList} />
                                                    {s.isError === true ? <Button size = "large" color = "default" style = {margin} onClick = {_self.onBackClickHandler.bind(this)}>< ArrowBackIcon fontSize = "small" /> {__("BackButton")} </Button> : ''}
                                                </div >
                                            </div>
                                        </div>
                                    )
                                } else if (s.done) {
                                    // Either selected or uploaded.
                                    return ( 
                                        <div role = "tabpanel">
                                            <div className = "form-group">
                                                <p>{__("uploadtime") + ': ' + s.svarUploadTime}</p>
                                                <div style = {{display: 'flex'}}>
                                                    <Button size = "large" color = "default" variant = "contained" style = {margin} onClick = {_self.onBackClickHandler.bind(this)}>
                                                        <ArrowBackIcon fontSize = "small" />{__("backbutton")}
                                                    </Button>
                                                    <LedningsDownload style = {margin} size = "large" color = "default" variant = "contained" endpoint = "/api/extension/downloadForespoergsel" forespnummer = {s.foresp}/>
                                                </div >
                                                <div id = "graveAssistent-feature-ledningsejerliste" >
                                                    <LedningsEjerStatusTable statusliste = {s.ejerliste}/>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                } else {
                                    // Just Browsing
                                    return (
                                        <div role = "tabpanel" >
                                            <div className = "form-group">
                                                <div id = "graveAssistent-feature-select-container" style = {{width: '80%',margin: '10px auto 10px auto'}}>
                                                    <FormControl style = {{width: '100%',padding: '20px'}}>
                                                        <InputLabel id = "graveAssistent-feature-select-label"> Vælg eksisterende forespørgsel </InputLabel>
                                                        <Select id = "graveAssistent-feature-select" value = {s.foresp} onChange = {_self.handleForespSelectChange.bind(this)}>
                                                            {s.forespOptions.map(f => <MenuItem key = {f.forespnummer} value = {f.forespnummer}> {f.forespnummer + ': ' + f.bemaerkning + ' (Uploaded: ' + f.svar_uploadtime + ')'} </MenuItem>)}
                                                        </Select>
                                                    </FormControl>
                                                    <div><p>Eller</p></div>
                                                </div>
                                                <div id = "graveAssistent-feature-dropzone">
                                                    <Dropzone onDrop = {_self.onDrop.bind(this)} style = {{width: '80%',height: '160px',padding: '50px',border: '1px green dashed',margin: '20px auto 20px auto',textAlign: 'center'}}>
                                                        <p>{__("uploadmessage")}</p>
                                                    </Dropzone>
                                                </div>
                                            </div>
                                        </div>
                                            )
                                        }
                                    }
                                    else {
                                        // Not Logged in
                                        return (
                                            <div role = "tabpanel" >
                                                <div className = "form-group" >
                                                    <div id = "graveAssistent-feature-login" className = "alert alert-info" role = "alert" >
                                                        {__("MissingLogin")}
                                                    </div>
                                                    <Button onClick = {() => this.clickLogin()} color = "primary" size = "large" variant = "contained" style = {{marginRight: "auto", marginLeft: "auto", display: "block" }}>
                                                        {__("Login")}
                                                    </Button>
                                                </div>
                                            </div>
                                        )
                                    }
                                }
                            }

                            utils.createMainTab(exId, __("Plugin Tooltip"), __("Info"), require('./../../../browser/modules/height')().max, "create_new_folder", false, exId);

                            // Append to DOM
                            //==============
                            try {
                                ReactDOM.render( <
                                    GraveAssistent / > ,
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