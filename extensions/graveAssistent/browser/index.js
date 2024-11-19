/*
 * @author     René Borella <rgb@geopartner.dk>
 * @copyright  2020- Geoparntner A/S
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

'use strict';

import {
    v4 as uuidv4
} from 'uuid';
import Dropzone from 'react-dropzone';
import JSZip from 'jszip';
import LedningsEjerStatusTable from "./LedningsEjerStatusTable";
import LedningsProgress from "./LedningsProgress";
import LedningsDownload from "./LedningsDownload";

// Get information from config.json

var schema_override = undefined;

if (window.config?.extensionConfig?.graveAssistent) {
    if (window.config?.extensionConfig?.graveAssistent?.schema) {
        schema_override = window.config.extensionConfig.graveAssistent.schema;
    }
}

console.log('Schema override:', schema_override)


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
 * @type {*|exports|module.exports}
 */
var switchLayer = require('./../../../browser/modules/switchLayer');

/**
 *
 * @type {string}
 */
var exId = "graveAssistent";

/**
 *
 * @type {*|exports|module.exports}
 */
 var meta = require('./../../../browser/modules/meta');
 // console.log(meta)

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
                        "da_DK": "Graveassistenten gør det muligt at uploade en ledningspakke og se status på ledningsejere og ledninger i området. Du kan også downloade ledningsoplysningerne i andre formater.",
                        "en_US": "Graveassistenten makes it possible to upload a ledningspakke and see the status of ledningsejere and ledninger in the area. You can also download the data contained in other formats."
                    },

                    "Plugin Tooltip": {
                        "da_DK": "LER 2.0 Graveassistent",
                        "en_US": "LER 2.0 Graveassistent"
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
                        "en_US": "Ledningspakke uploaded at"
                    },
                    "uploadmessage": {
                        "da_DK": "Træk og slip din ledningspakke her, eller klik for at vælg filen fra din computer",
                        "en_US": "Drag and drop your ledningspakke here, or click to select from drive."
                    }
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

                /**
                 * Flattens object
                 * @param {*} obj 
                 */
                var flattenObject = function (obj) {
                    // guard against null, undefined, other non-objects
                    if (typeof obj !== 'object' || !obj) {
                        return false; // check the obj argument somehow
                    }

                    let flattened = {}

                    Object.keys(obj).forEach((key) => {
                        if (typeof obj[key] === 'object' && obj[key] !== null) {
                            Object.assign(flattened, flattenObject(obj[key]))
                        } else {
                            flattened[key] = obj[key]
                        }
                    })

                    return flattened
                }

                var checkZipFile = function (zip) {

                    //console.log(zip)
                    let neededfiles = ['LedningsejerStatusListe.xml', 'consolidated.gml']

                    return new Promise(function (resolve, reject) {
                        neededfiles.forEach(key => {
                            if (zip.file(key) == null) {
                                reject('Filen ' + key + ' mangler i ledningspakken. Prøv at hente pakken fra ler.dk igen.')
                            } 
                        })
                        resolve(zip)
                        
                    }); 
                }

                /**
                 * Parses xml to JSON
                 * @param {*} xmlData 
                 */
                var parsetoJSON = function (xmlData) {
                    const {XMLParser} = require('fast-xml-parser');
                    var jsonObj, Err = {}
                    var he = require('he');

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
                        removeNSPrefix: true,
                    };

                    try {
                        var parser = new XMLParser(options);
                        jsonObj = parser.parse(xmlData);
                    } catch (error) {
                        Err = error
                        console.log(Err)
                    }
                    
                    // If you try to validate before parseing, like a good boy, you get TypeError in production!
                    //if (parser.validate(xmlData) === true) { //optional (it'll return an object in case it's not valid)
                    //        jsonObj = parser.parse(xmlData, options);
                    //        //console.log(jsonObj)
                    //    } else {
                    //        Err = parser.validate(xmlData)
                    //}

                    return new Promise(function (resolve, reject) {
                        if (Err.length > 0){
                            reject(Err)
                        } else {
                            //console.log(jsonObj)
                            resolve(jsonObj)
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
                    // Guard against null, undefined, other non-objects
                    if (typeof obj !== 'object' || !obj) {
                        return null; // check the obj argument somehow
                    }

                    //console.table(obj)
                    let geomObj = {}
                    let flat = flattenObject(obj)

                    if (!typeof obj === 'object') {
                        return null
                    }

                    // Handle type
                    if ('Point' in obj) {
                        geomObj.type = 'MultiPoint'
                    } else if ('LineString' in obj) {
                        geomObj.type = 'MultiLineString'
                    } else if ('Surface' in obj) {
                        geomObj.type = "MultiPolygon"
                    } else if ('Polygon' in obj) {
                        geomObj.type = "MultiPolygon"
                    } else if ('MultiCurve' in obj) {
                        geomObj.type = "MultiLineString"
                    } else {
                        // Matched nothing, kill 
                        console.log('killed:', obj)
                        return null
                    }

                    //TODO: Improve handeling of multi's

                    // Handle geometry
                    flat.type = geomObj.type

                    let dim = 2
                    if (flat.hasOwnProperty('srsDimension')) {
                        dim = flat.srsDimension
                    }
                    if (flat.hasOwnProperty('posList')) {
                        if (flat.type == 'MultiPolygon') {
                            //console.log(flat)
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
                        } else if (flat.type == 'MultiPolygon') {
                            //console.log(flat)
                            geomObj.coordinates = flat.value.split(' ').map(Number).chunk(dim)
                            let rings = [geomObj.coordinates]
                            let multis = [rings]
                            geomObj.coordinates = multis
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
                            // Handle as data
                            data.push(Object.values(cons[i])[0])
                        }
                    }
                    // use promise to return data in stream
                    return new Promise(function (resolve, reject) {
                        // Handle Graveforsp.
                        try {
                            foresp.forEach(function (item) {
                                //console.log(item)
                                //console.log(item.polygonProperty)
                                let geom = handleGeometry(item.polygonProperty)
                                //console.log(geom)
                                
                                delete item.polygonProperty

                                // TODO: implement gravearter
                                delete item.graveart_andet
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
                        if (data.length > 1) {
                            //console.log(data)
                            try {
                                data.forEach(function (item) {

                                    // TODO: support "Informationsressource"
                                    // Skip "ler:Informationsressource"
                                    if (item.objectType == "ler:Informationsressource"){
                                        console.log(item)
                                        return;
                                    }

                                    // TODO: support annotation and linearDimension
                                    // Skip "dim:LinearDimension", "ann:TextAnnotation"
                                    if (item.objectType == "dim:LinearDimension" || item.objectType == "ann:TextAnnotation"){
                                        console.log(item)
                                        return;
                                    }
    
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
                                            //console.log(key, value);

                                            // if value.attr exists
                                            if (value.hasOwnProperty('attr')) {

                                                // If value.attr has nil, and nil is true, set value to null
                                                if (value.attr.hasOwnProperty('nil')) {
                                                    // If nilReason is set, use that instead
                                                    if (value.attr.hasOwnProperty('nilReason')) {
                                                        obj[key] = value.attr.nilReason
                                                    } else {
                                                        // skip
                                                        obj[key] = 'tomt felt'
                                                    }
                                                } 
                                                else if (value.attr.hasOwnProperty('uom')) {
                                                    // If value.attr has uom, append to value
                                                    obj[key] = value.value + ' ' + value.attr.uom
                                                } 
                                                else {
                                                    // fall back to value
                                                    obj[key] = value.value

                                                }
                                            }
                                            // console.log(key, obj[key])
                                        }
                                    }
    
                                    //Redo Geometry
                                    //console.log(obj.geometri)
                                    let geom = handleGeometry(obj.geometri);
                                    //console.log(geom)
                                    delete obj.geometri;

                                    // Loop through all the keys, and remove ' and "
                                    for (const [key, value] of Object.entries(obj)) {
                                        if (typeof value == 'string') {
                                            obj[key] = value.replace(/['"]+/g, '')
                                        }
                                    }
                                    
    
                                    //hack to geojson obj
                                    obj = {
                                        type: 'Feature',
                                        properties: lc(obj),
                                        geometry: geom
                                    }
    
                                    returnObj.data.push(lc(obj))
                                })
                            } catch (error) {
                                console.log(error)
                                reject(error)
                            }
                        } else {
                            // We no longer reject packages with no data, because empty packages are valid
                            // reject('Ledningspakken har ikke noget indhold. Dette kan ske hvis ingen ledningsejere har svaret endnu')
                        }


                        console.log('Fandt elementer: '.concat(packageinfo.length, ' UtilityPackageInfo, ', owner.length, ' UtilityOwner, ', profil.length, ' Kontaktprofil, ', data.length, ' data'))
                        console.log(returnObj)

                        resolve(returnObj)
                    });

                }

                var pushForespoergsel = function (obj, statusKey, schema_override) {
                    obj['statusKey'] = statusKey
                    // If schema_override is set, use that instead
                    if (schema_override) {
                        obj['schema'] = schema_override
                    }
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
                    //console.log(statusObj);

                    let ejerList = statusObj.LedningsejerListe.Ledningsejer

                    // Force ejerList into an array
                    if (!(ejerList instanceof Array)) {
                        ejerList = [ejerList]
                    }

                    let ejere = []
                    // use promise to return data in stream
                    return new Promise(function (resolve, reject) {
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
    
                                        if (l.CVR == '') {
                                            obj['CVR'] = 0
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
    
                                    if (l.CVR == '') {
                                            obj['CVR'] = 0
                                        }
                                        
                                    ejere.push(lc(obj))
                                }
                            })
                            resolve(ejere)
                        } catch (error) {
                            console.log(error)
                            reject(error)
                        }
                    });
                }

                var pushStatus = function (obj, statusKey, schema_override) {
                    let postData = {
                        Ledningsejerliste: obj,
                        statusKey: statusKey,
                    }
                    // If schema_override is set, use that instead
                    if (schema_override) {
                        postData['schema'] = schema_override
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

                        try {
                            //Make sure layer is on, don't reload
                            switchLayer.init(layerKey, true)
                            //layerTree.reloadLayer(layerKey)
                            //Toggle the filter

                            let options = {
                                layerKey,
                                filters: filter[layerKey]
                            }
                            //console.log(options)

                            layerTree.onApplyArbitraryFiltersHandler(options, false);

                            //if (filter[layerKey].columns.length == 0) {
                            //    // insert fixed dummy filter
                            //    // in order to filter out all features from layer
                            //    //var blankfeed = {expression: "=",
                            //    //                fieldname: "forespnummer",
                            //    //                restriction: false,
                            //    //                value: "0"};
                            //    //filter[layerKey].columns.push(blankfeed);
                            //    layerTree.onApplyArbitraryFiltersHandler({
                            //        layerKey,
                            //        filters: filter[layerKey]
                            //    }, false);
                            //} else {
                            //    layerTree.onApplyArbitraryFiltersHandler({
                            //        layerKey,
                            //        filters: filter[layerKey]
                            //    }, false);
                            //}
                            //Reload
                            layerTree.reloadLayerOnFiltersChange(layerKey)
                            
                        } catch (error) {
                            console.log(error)
                        } finally {
                            continue
                        }
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
                            foresp: '',
                            overskredetDato: false,
                            harFarlig: false,
                            harMegetFarlig: false,
                            lastBounds: ''
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

                                    if (me.state.authed) {
                                        me.populateDClayers()

                                        // Populate select with foresp. from schema - if set
                                        if (schema_override) {
                                            me.populateForespoergselOption(schema_override)
                                        } else {
                                            me.populateForespoergselOption()
                                        }
                                    }
                                }))
                                .catch(e => me.setState({
                                    authed: false
                                }))
                        })
                    }
                    
                    hasMForF(number){
                        if (number > 0){
                            return true
                        } else {
                            return false
                        }
                    }

                    isTooOld(timestamp){
                        // If timestamp is null, return false
                        if (timestamp == null){
                            return false
                        }
                        console.log(timestamp, new Date())
                        if (new Date(timestamp) < new Date()) {
                            return true
                        } else {
                            return false
                        }

                    }

                    humanTime(timestamp){
                        let d = new Date(timestamp)

                        let humanString = `${d.getDate()}/${d.getMonth()} - ${d.getFullYear()} kl. ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`
                        return humanString
                        // return d.toLocaleString(window._vidiLocale.replace('_','-'))
                    }

                    /**
                     * Handle file selected
                     * @param {*} files 
                     */
                    onDrop(files) {
                        const _self = this;

                        var r = new FileReader();
                        r.readAsDataURL(files[0])
                        r.onloadend = function() {

                            let b64 = r.result
                            _self.readContents(b64)
                        }
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

                            // Populate select with foresp. from schema - if set
                            if (schema_override) {
                                _self.populateForespoergselOption(schema_override)
                            } else {
                                _self.populateForespoergselOption()
                            }
                            // move to last location and clear filters
                            cloud.get().map.fitBounds(_self.state.lastBounds)
                            clearFilters()
                        })
                    }

                    handleForespSelectChange(event) {
                        const _self = this

                        var options = document.getElementById('graveAssistent-features').options;
                        var found = Array.from(options).some(function(option) {
                            return option.value === event.target.value;
                        });

                        if (found) {

                            // Get forespoergsel, which is the part of options before the first':'
                            var foresp = String(event.target.value.split(':')[0])
                            _self.setState({
                                foresp: foresp,
                                lastBounds: cloud.get().map.getBounds()
                            })
    
                            // getForespoergsel - use schema is set
                            if (schema_override) {
                                _self.getForespoergsel(foresp, schema_override)
                            } else {
                                _self.getForespoergsel(foresp)
                            }
    
                            _self.setState({
                                done: true
                            })
                        }
                    }

                    /**
                     * Reads content of uploaded ZIP-file
                     * @param {*} zipblob 
                     */
                    readContents(zipblob) {
                        var _self = this;
                        var newZip = new JSZip();

                        var statusKey = uuidv4()
                        var b64 = zipblob.split(',')[1];
                       
                        newZip.loadAsync(b64, {base64: true})
                            .then(function (zip) {
                                _self.setState({
                                    loading: true,
                                    done: false,
                                    progress: 0,
                                    progressText: 'Læser ledningspakkke',
                                    ejerliste: [],
                                    isError: false,
                                    errorList: [],
                                    lastBounds: cloud.get().map.getBounds(),
                                    svarUploadTime: ''
                                })

                                // Check for imperfections
                                return Promise.all([
                                    checkZipFile(zip)
                                ])
                            }).then(function(zipclean) {
                                var [zip] = zipclean
                                //console.log(zip)
                                // Handle files
                                return Promise.all([
                                    zip.files['LedningsejerStatusListe.xml'].async('string'),
                                    zip.files['consolidated.gml'].async('string')
                                ])
                            }).then(function(files) {
                                var [status, consolidated] = files
                                //console.log(files);

                                return Promise.all([
                                    parsetoJSON(status),
                                    parsetoJSON(consolidated)
                                ])
                            }).then(function(files) {
                                var [status, consolidated] = files
                                //console.log(files);

                                return Promise.all([
                                    parseStatus(status),
                                    parseConsolidated(consolidated)
                                ])
                            }).then(function(files) {
                                var [status, consolidated] = files
                                //console.log(files);

                                if (schema_override) {
                                    return [Promise.all([
                                        pushStatus(status, statusKey, schema_override),
                                        pushForespoergsel(consolidated, statusKey, schema_override)
                                    ]),consolidated.forespNummer]
                                } else {
                                    return [Promise.all([
                                        pushStatus(status, statusKey),
                                        pushForespoergsel(consolidated, statusKey)
                                    ]),consolidated.forespNummer]
                                }
                            }).then(function(files) {
                                //console.log(files)
                                _self.setState({
                                    isError: false,
                                    progress: 100,
                                    progressText: 'Færdig!',
                                    loading: false,
                                    done: true,
                                    foresp: String(files[1])
                                })

                                if (schema_override) {
                                    _self.getForespoergsel(String(files[1]), schema_override)
                                } else {
                                    _self.getForespoergsel(String(files[1]))
                                }
                                
                            })
                            .catch(e => {
                                console.log(e)
                                _self.setState({
                                    isError: true,
                                    progress: 100,
                                    progressText: String(e)
                                })
                            })
                            
                    }

                    /**
                     * Populate the list of active layers used in filters
                     */
                    populateDClayers() {
                        try {
                            var metaData = meta.getMetaData();
                            metaData.data.forEach(function (d) {
                                if (d.f_table_name) {
                                    //console.log(d.f_table_name + ': ' + d.f_table_name.includes('graveassistent_') + '|' + !d.f_table_name.includes('_status'))
                                    if (d.f_table_name.includes('graveassistent_') && !d.f_table_name.includes('_status')) {
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
                     * @param {*} schema - if set, use override with this schema
                     */
                    populateForespoergselOption(schema = null) {
                        var _self = this;
                        let opts = {
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                schema: schema
                            }),
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

                    /**
                     * 
                     * @param {*} statuskey 
                     * @param {*} schema - if set, use override with this schema
                     */
                    getStatus(statuskey, schema = null) {
                        var _self = this
                        let opts = {
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            },
                            method: 'POST',
                            body: JSON.stringify({
                                statusKey: statuskey,
                                schema: schema
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
                     * @param {*} schema - if set, use override with this schema
                     */
                    getForespoergsel(forespNummer, schema = null) {
                        var _self = this;
                        let opts = {
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            },
                            method: 'POST',
                            body: JSON.stringify({
                                forespNummer: forespNummer,
                                schema: schema
                            })
                        }
                        // Do async job
                        fetch('/api/extension/getForespoergsel', opts)
                            .then(r => r.json())
                            .then(d => {
                                //console.log(d);

                                // Zoom to location
                                // this has to be better for sorting then status is incomming!
                                if (d.length === 0) {
                                    // Go back on nothing
                                    _self.onBackClickHandler()
                                }

                                // implement warning if MF/F exists!
                                let f = d[0].properties;
                                let bounds = [[f.ymin, f.xmin],[f.ymax, f.xmax]];
                                cloud.get().map.fitBounds(bounds)
                                
                                // Apply filter

                                if (schema_override) {
                                    _self.getStatus(f.statuskey, schema_override)
                                } else {
                                    _self.getStatus(f.statuskey)
                                }

                                applyFilter(buildFilter(f.forespnummer))


                                //SET SVAR_UPLOADTIME IN STATE
                                _self.setState({
                                    svarUploadTime: f.svar_uploadtime,
                                    overskredetDato: this.isTooOld(f.svar_gyldigtil),
                                    harFarlig: this.hasMForF(f.l_f),
                                    harMegetFarlig: this.hasMForF(f.l_mf)
                                })
                            })
                            .catch(e => console.log(e))
                    }

                    clickLogin() {
                        document.querySelector('[data-bs-target="#login-modal"]').click();
                    }

                    /**
                     * Renders component
                     */
                    render() {
                            const _self = this;
                            const s = _self.state
                            //console.log(s)
                   
                            if (s.authed) {
                                // Logged in
                                if (s.loading) {
                                    // If Loading, show progress
                                    return (
                                        <div role="tabpanel">
                                            <div>
                                                <div>
                                                    <LedningsProgress progress={s.progress} text={s.progressText} isError={s.isError} errorList={[]} />
                                                    {s.isError === true ? <button className="btn btn-sm btn-outline-secondary" id="_draw_download_geojson" onClick={_self.onBackClickHandler.bind(this)}><i className="bi bi-arrow-left-short" aria-hidden="true"></i> Tilbage</button> : ''}
                                                </div>
                                            </div>
                                        </div>

                                    )
                                } else if (s.done) {
                                    // Either selected or uploaded.
                                    return ( 
                                        <div role = "tabpanel">
                                            <div className = "form-group p-2">
                                                <p>{__("uploadtime") + ': ' + this.humanTime(s.svarUploadTime)}</p>
                                                <div className="p-2" style = {{display: 'flex'}}>
                                                    <button className="btn btn-sm btn-outline-secondary" id="_draw_download_geojson" onClick={_self.onBackClickHandler.bind(this)}>
                                                        <i className="bi bi-arrow-left-short" aria-hidden="true"></i> Tilbage
                                                    </button>
                                                    <LedningsDownload size = "large" color = "default" variant = "contained" endpoint = "/api/extension/downloadForespoergsel" forespnummer = {s.foresp} schema={schema_override} />
                                                </div >
                                                <div className="d-flex flex-column bg-danger text-center text-light fw-bold p-2" id="graveAssistent-feature-warnings">
                                                    {s.overskredetDato && <div className='p-2'>Denne ledningspakke er ikke længere gyldig!</div>}
                                                    {s.harFarlig && <div className='p-2'>Indeholder farlige ledninger</div>}
                                                    {s.harMegetFarlig && <div className='p-2'>Indeholder meget farlige ledninger!</div>}
                                                </div>
                                                <div id="graveAssistent-feature-ledningsejerliste" >
                                                    {s.ejerliste.length > 0 ? <LedningsEjerStatusTable statusliste = {s.ejerliste}/> : <LedningsProgress progress={89} text={'Henter'} iserror={false} errorList={[]} />}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                } else {
                                    // Just Browsing
                                    return (
                                        <div role="tabpanel">
                                            <div className="form-group p-4">
                                                <div id="graveAssistent-feature-select-container" className="w-80 mx-auto my-2">
                                                    <label htmlFor="graveAssistent-feature-input" className="form-label">Vælg eksisterende forespørgsel</label>
                                                    <input className="form-control" placeholder="Søg efter forespørgsel..." list="graveAssistent-features" id="graveAssistent-feature-input" onChange={_self.handleForespSelectChange.bind(this)} />
                                                    <datalist id="graveAssistent-features">
                                                        {s.forespOptions.map(f => <option key={f.forespnummer} value={`${f.forespnummer}: ${f.bemaerkning} (Uploaded: ${this.humanTime(f.svar_uploadtime)})`} />)}
                                                    </datalist>
                                                    <div className='d-grid mt-4'>
                                                        <p className="text-center">Eller</p>
                                                    </div>
                                                    <div id="graveAssistent-feature-dropzone" className="w-80 mx-auto">
                                                        <Dropzone className="d-grid align-items-center" onDrop={acceptedFiles => _self.onDrop(acceptedFiles)} style={{height: '160px',backgroundColor: 'var(--bs-primary-tint-90)', borderRadius:'10px'}}>
                                                            <p className='text-center'>{__("uploadmessage")}</p>
                                                        </Dropzone>
                                                    </div>
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
                                                    <div className="d-grid col-3 mx-auto">
                                                        <button onClick = {() => this.clickLogin()} type="button" className="btn btn-primary">{__("Login")}</button>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }
                                }
                            }

                            utils.createMainTab(exId, __("Plugin Tooltip"), __("Info"), require('./../../../browser/modules/height')().max, "bi-folder-plus", false, exId);

                            // Append to DOM
                            //==============
                            try {
                                ReactDOM.render( <GraveAssistent/> , document.getElementById(exId));
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
