var express = require('express');
var request = require('request');
var router = express.Router();
var http = require('http');
var https = require('https');
var moment = require('moment');
var config = require('../../../config/config.js');
var he = require('he');
var fetch = require('node-fetch');
const wkt = require('wkt');


/**
*
* @type {string}
*/
var GC2_HOST = config.gc2.host;
GC2_HOST = (GC2_HOST.split("http://").length > 1 ? GC2_HOST.split("http://")[1] : GC2_HOST);

// Set locale for date/time string
moment.locale("da_DK");

var BACKEND = config.backend;

var TABLEPREFIX = 'lerkonvert_'

// Days from 19000101 to 19700101
const DAYSSINCE = 25569
// milisecs pr. day
const MILISECSDAY = 86400000

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
  }
);

var userString = function (req) {
    var userstr = ''
    if (req.session.subUser)
        var userstr = req.session.gc2UserName + '@' + req.session.parentDb;
    else {
        var userstr = req.session.gc2UserName;
    }
    return userstr
}

/**
 * Builds INSERT statement with multiple features
 * @param {*} features
 * @param {*} table 
 * @param {*} crs 
 */
var buildSQLArray = function(features, table, geom_col, crs, timestamp) {
    //console.log(feature)

    let values = []
    let into = []

    // Get all keys from features, create array with distinct keys
    features.forEach(f => {
        into = into.concat(Object.keys(f.properties))
    })
    into = new Set(into)
    

    // Loop features to get value sets
    features.forEach(f => {
        let nestedValues = []
        

        // Loop distinct keys
        into.forEach(k => {
            if (f.properties.hasOwnProperty(k)){
                nestedValues.push("'"+he.decode(String(f.properties[k]))+"'")
            } else {
                nestedValues.push('null')
            }
        })
        // Append geometry & uploadtime
        nestedValues.push("ST_SetSRID(ST_GeomFromGeoJSON('"+ JSON.stringify(f.geometry) +"'),"+crs+")")
        nestedValues.push("'"+he.decode(String(timestamp))+"'")

        // Add to values
        let nest = "("+nestedValues.join(',')+")"
        //console.log(nest)
        values.push(nest)
    })

    // Add geomemtry & timestamp column
    into = Array.from(into)
    into.push(geom_col)
    into.push('svar_uploadtime')


    

    // Build final string
    let str = 'INSERT INTO '+table+ ' ('+into.join(',')+') VALUES '+values.join(',')
    return str
}

/**
 * Endpoint for file download 
 */
router.post('/api/extension/downloadForespoergsel', function (req, response) {

    console.table(req.body)
    let b = req.body
    //console.table(req.session)
    let s = req.session

    // If user is not currently inside a session, hit 'em with a nice 401
    if (!req.session.hasOwnProperty("gc2SessionId")) {
        response.status(401).json({error:"Du skal være logget ind for at benytte løsningen."})
        return
    }

    // Check if query exists
    if(!b.hasOwnProperty("forespNummer") && !b.hasOwnProperty('format')) {
        response.status(500).json({error:"Forespørgsel er ikke komplet. 'forespNummer', 'format'"})
        return
    }

    let allowedFormats = ['shp','dxf','geojson']
    if(allowedFormats.indexOf(b.format) > -1){
        //console.log(b.format)
    } else {
        response.status(500).json({error:"Format ikke understøttet: '"+b.format+"' - brug en af: "+ allowedFormats.toString()})
        return     
    }

    // Get contents of each type as a starting point.
    //TODO: add crs toggle here
    let getChain = []
    let layers = ['lines','points','polygons','graveforespoergsel']
    
    // Define how to get features - might dump, idk
    layers.forEach(t => {
        //let q = 'SELECT *, ST_AsText(the_geom) as the_geom_wkt FROM '+ s.screenName+'.'+TABLEPREFIX+t+' where forespnummer = '+ b.forespNummer

        // Dump to simples from DB
        let q = 'SELECT *, ST_AsText((ST_Dump('+ s.screenName+'.'+TABLEPREFIX+t+'.the_geom)).geom) as the_geom_wkt FROM '+ s.screenName+'.'+TABLEPREFIX+t+' where forespnummer = '+ b.forespNummer
        getChain.push(SQLAPI(q, req))
    })

    // Send data in formats
    try {
        Promise.all(getChain) // Get all features
        .then(r => {
            //console.log(r)
            let returnArray = []
            r.forEach(f => {
                //console.log(f)
                if (f.features.length > 0) {
                    // Because SQLAPI is an idiot, handle it this way
                    f.features.forEach(s => {
                        //console.log(s)
                        try {
                            let feat = {}
                            //console.log(s.properties.the_geom_wkt)
                            //console.log(wkt.parse(s.properties.the_geom_wkt))
                            feat.geometry = wkt.parse(s.properties.the_geom_wkt)
                            feat.properties = s.properties
                            delete feat.properties.the_geom_wkt
                            returnArray.push(feat)
                        } catch (error) {
                            console.log(error)   
                        }
                    })
                }
            })
            let fc = {type: "FeatureCollection", features: returnArray} //this is base output. with null's
            //let fn = 'Ledningspakke_'+String(b.forespNummer)+'_'+b.format+'.'
            let fn = 'Graveassistent_Ledningspakke_'+String(b.forespNummer)+'.'

            // Handle formats, must all end in a Buffer
            var base64, payload

            // Convert FC to base64 for services
            base64 = JSON.stringify(fc)
            base64 = new Buffer.from(base64).toString("base64")

            let translate = []

            switch(b.format) {
                case 'geojson':
                    // Pass straight through
                    translate.push(DONOTHING('application/json','geojson',base64))
                    break;  
                case 'shp':
                    // Run geolambda
                    translate.push(GEOLAMBDA(String(b.forespNummer),'ESRI Shapefile',base64))
                    break;

                default:
                    response.status(500).json({error:"Format ikke understøttet: '"+b.format})
                    return                        
            }

            // resolve translation and return
            Promise.all(translate)
            .then(r => {
                //console.log(r[0])
                payload = {
                    // We're doin an .all so the r is an array
                    base64: r[0].base64,
                    filename: fn+r[0].ext,
                    mime: r[0].mime
                }
                //console.log(payload)
                response.status(200).json(payload)
            })
            .catch(r => {
                // if translate went wrong
                response.status(500).json(r)
            })
        })
        .catch(r => {
            // if SQL went wrong
            response.status(500).json(r)
        })
    } catch (error) {
        console.log(error)
        response.status(500).json(error)
    }
    
});

/**
 * Endpoint for populating foresp. in current schema 
 */
router.post('/api/extension/getForespoergselOption', function (req, response) {
    response.setHeader('Content-Type', 'application/json');

    //console.table(req.body)
    let b = req.body
    //console.table(req.session)
    let s = req.session

    // If user is not currently inside a session, hit 'em with a nice 401
    if (!req.session.hasOwnProperty("gc2SessionId")) {
        response.status(401).json({error:"Du skal være logget ind for at benytte løsningen."})
        return
    }

    // Go ahead with the logic
    let q = "SELECT forespnummer, bemaerkning, svar_uploadtime FROM "+ s.screenName+'.'+TABLEPREFIX+"graveforespoergsel where svar_uploadtime > now() - INTERVAL '30 days' ORDER by forespnummer DESC"
    try {
        SQLAPI(q, req)
        .then(r => {
            //console.log(r)
            let returnArray = []
            r.features.forEach(f => {
                //console.log(f)
                returnArray.push(f.properties)
            })
            response.status(200).json(returnArray)
        })
        .catch(r => {
            response.status(500).json(r)
        })
    } catch (error) {
        console.log(error)
        response.status(500).json(error)
    }
    
});

/**
 * Endpoint for getting specific foresp.
 */
router.post('/api/extension/getForespoergsel', function (req, response) {
    response.setHeader('Content-Type', 'application/json');

    //console.table(req.body)
    let b = req.body
    //console.table(req.session)
    let s = req.session

    // If user is not currently inside a session, hit 'em with a nice 401
    if (!req.session.hasOwnProperty("gc2SessionId")) {
        response.status(401).json({error:"Du skal være logget ind for at benytte løsningen."})
        return
    }

    // Check if query exists
    if(!req.body.hasOwnProperty("forespNummer")) {
        response.status(500).json({error:"Forespørgsel er ikke komplet. 'forespNummer'"})
        return
    }

    let chain = []
    let buffer = 50
    // Go ahead with the logic
    let q =     'Select forespnummer,bemaerkning,svar_uploadtime,graveperiode_fra,graveperiode_til,\
                ST_XMax(ST_Extent(ST_Transform(ST_Expand(the_geom,'+buffer+'),4326))) xmax,\
                ST_XMin(ST_Extent(ST_Transform(ST_Expand(the_geom,'+buffer+'),4326))) xmin,\
                ST_YMax(ST_Extent(ST_Transform(ST_Expand(the_geom,'+buffer+'),4326))) ymax,\
                ST_YMin(ST_Extent(ST_Transform(ST_Expand(the_geom,'+buffer+'),4326))) ymin,\
                the_geom\
                from '+ s.screenName+'.'+TABLEPREFIX+'graveforespoergsel\
                where forespnummer = '+ b.forespNummer +'\
                GROUP BY forespnummer, bemaerkning,svar_uploadtime,graveperiode_fra,graveperiode_til, the_geom'
    
    chain.push(SQLAPI(q, req))
    q = 'SELECT * FROM ' + s.screenName+'.'+TABLEPREFIX+'status'
    chain.push(SQLAPI(q, req))


    try {
        Promise.all(chain)
        .then(r => {
            //console.log(r)

            let returnArray = []
            r[0].features.forEach(f => {
                //console.log(f)
                returnArray.push(f)
            })
            response.status(200).json(returnArray)
        })
        .catch(r => {
            response.status(500).json(r)
        })
    } catch (error) {
        console.log(error)
        response.status(500).json(error)
    }
    
});

/**
 * Endpoint for upserting features from LER 
 */
router.post('/api/extension/upsertForespoergsel', function (req, response) {
    response.setHeader('Content-Type', 'application/json');

    //console.table(req.body)
    let b = req.body
    //console.table(req.session)
    let s = req.session

    // If user is not currently inside a session, hit 'em with a nice 401
    if (!req.session.hasOwnProperty("gc2SessionId")) {
        response.status(401).json({error:"Du skal være logget ind for at benytte løsningen."})
        return
    }

    // Check if query exists
    if(!req.body.hasOwnProperty("foresp") && !req.body.hasOwnProperty("forespNummer") && !req.body.hasOwnProperty("data")) {
        response.status(500).json({error:"Forespørgsel er ikke komplet. 'foresp','forespNummer','data'"})
        return
    }

    // Go ahead with the logic
    // sort in types then delete sync-like
    var lines = [], polys = [], pts = []
    var f, fc, chain;

    b.data.forEach(f => {
        //console.log(f)
        // Pass if unparsed
        if (f.geometry === null) {
            return
        } else if (f.geometry.type == 'MultiLineString') {
            lines.push(f)
        } else if (f.geometry.type == 'MultiPolygon') {
            polys.push(f)
        } else if (f.geometry.type == 'MultiPoint') {
            pts.push(f)
        }
    })

    console.log('Got: '+b.forespNummer+'. Lines: '+lines.length+', Polygons: '+polys.length+', Points: '+pts.length)
    let uploadTime = new Date().toLocaleString()

    try {
        lines = {type:'FeatureCollection',features: lines}
        pts = {type:'FeatureCollection',features: pts}
        polys = {type:'FeatureCollection',features: polys}
        fors = {type:'FeatureCollection',features: [b.foresp]}

        clean = [
            SQLAPI('delete from '+s.screenName+'.' + TABLEPREFIX + 'graveforespoergsel WHERE forespnummer = '+b.forespNummer+" AND svar_uploadtime < '"+uploadTime+"'", req),
            SQLAPI('delete from '+s.screenName+'.' + TABLEPREFIX + 'lines WHERE forespnummer = '+b.forespNummer+" AND svar_uploadtime < '"+uploadTime+"'", req),
            SQLAPI('delete from '+s.screenName+'.' + TABLEPREFIX + 'points WHERE forespnummer = '+b.forespNummer+" AND svar_uploadtime < '"+uploadTime+"'", req),
            SQLAPI('delete from '+s.screenName+'.' + TABLEPREFIX + 'polygons WHERE forespnummer = '+b.forespNummer+" AND svar_uploadtime < '"+uploadTime+"'", req)
        ]
        post = []

        // Add forespoergsel
        //chain.push(FeatureAPI(req, fors, TABLEPREFIX + 'graveforespoergsel', '25832'))
        post.push(SQLAPI(buildSQLArray(fors.features, s.screenName+'.' + TABLEPREFIX + 'graveforespoergsel', 'the_geom', '25832', uploadTime), req))

        // Add layers that exist, add chunks
        var CHUNKSIZE = 50
        var chunks;

        try {
            if (lines.features.length > 0) {
                chunks = lines.features.chunk(CHUNKSIZE)
                chunks.forEach(g=> {post.push(SQLAPI(buildSQLArray(g, s.screenName+'.' + TABLEPREFIX + 'lines', 'the_geom', '7416', uploadTime), req))})
                //chain.push(FeatureAPI(req, lines, TABLEPREFIX + 'lines', '7416'))
            }
            if (pts.features.length > 0) {
                chunks = pts.features.chunk(CHUNKSIZE)
                chunks.forEach(g=> {post.push(SQLAPI(buildSQLArray(g, s.screenName+'.' + TABLEPREFIX + 'points', 'the_geom', '7416', uploadTime), req))})
                //chain.push(FeatureAPI(req, pts, TABLEPREFIX + 'points', '7416'))
            }
            if (polys.features.length > 0) {
                chunks = polys.features.chunk(CHUNKSIZE)
                chunks.forEach(g=> {post.push(SQLAPI(buildSQLArray(g, s.screenName+'.' + TABLEPREFIX + 'polygons', 'the_geom', '7416', uploadTime), req))})
                //chain.push(FeatureAPI(req, polys, TABLEPREFIX + 'polygons', '7416'))
            }
        } catch (error) {
            console.log(error)
            response.status(500).json(error)
        }

        // Execute entire chain
        Promise.all(clean) // delete existing 
        .then(d => {
            //console.log(d)
            Promise.all(post) // add new data
            .then(r => {
                //console.log(r)
                response.status(200).json(r)
            })
            .catch(error => {
                console.log(error)
                response.status(500).json(error)
            })
        })
        .catch(r => {
            // clean on any error
            Promise.all(clean)
            .finally(
                response.status(500).json(r)
            )
        })
    } catch (error) {
        console.log(error)
        response.status(500).json(error)
    } 
});

/**
 * Endpoint for upserting Status from LER 
 */
router.post('/api/extension/upsertStatus', function (req, response) {
    response.setHeader('Content-Type', 'application/json');

    //console.table(req.body)
    let b = req.body
    //console.table(req.session)
    let s = req.session


    // If user is not currently inside a session, hit 'em with a nice 401
    if (!req.session.hasOwnProperty("gc2SessionId")) {
        response.status(401).json({error:"Du skal være logget ind for at benytte løsningen."})
        return
    }

    // Check if query exists
    if(!req.body.hasOwnProperty("Ledningsejerliste")) {
        response.status(500).json({error:"Forespørgsel er ikke komplet. 'Ledningsejerliste'"})
        return
    }

    // Build featurecollection
    var ejere = b.Ledningsejerliste
    var fc = {}
    var f = []

    ejere.forEach(l =>{
        console.log(l)
    })


});

// Use FeatureAPI
function FeatureAPI(req, featurecollection, table, crs) {
    var userstr = userString(req)
    var postData = JSON.stringify(featurecollection)
    //console.log(postData)
    var options = {
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Content-Length': Buffer.byteLength(postData),
                'GC2-API-KEY': req.session.gc2ApiKey
            },
            uri: GC2_HOST +'/api/v2/feature/' + userstr + '/' +  req.session.screenName + '.' + table + '.the_geom' + '/' + crs,
            body: postData,
            method: 'POST'
        };

    return new Promise(function(resolve, reject) {
        console.log(q.substring(0,60))
        fetch(url, options)
        .then(r => r.json())
        .then(data => {
            // if message is present, is error
            if (data.hasOwnProperty('message') ){
                console.log(data.message)
                reject(data)
            } else {
                console.log('Success: '+ data.success+' - Q: '+postData.substring(0,60))
                resolve(data)
            }
        })
        .catch(error => {
            reject(error)
        })
    });
};

// Use SQLAPI
function SQLAPI(q, req) {
    var userstr = userString(req)
    var postData = JSON.stringify({key: req.session.gc2ApiKey,q:q})
    var url = GC2_HOST + '/api/v2/sql/' + userstr
    var options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Content-Length': Buffer.byteLength(postData),
            'GC2-API-KEY': req.session.gc2ApiKey
        },
        body: postData
    };
    //console.log(q)

    // Return new promise 
    return new Promise(function(resolve, reject) {
        //console.log(q.substring(0,175))
        fetch(url, options)
        .then(r => r.json())
        .then(data => {
            // if message is present, is error
            if (data.hasOwnProperty('message') ){
                //console.log(data.message)
                reject(data)
            } else {
                //console.log('Success: '+ data.success+' - Q: '+q.substring(0,60))
                resolve(data)
            }
        })
        .catch(error => {
            reject(error)
        })
    });
};

// Do nothing - promise
function DONOTHING(contentType, ext, base64) {
    return new Promise(function(resolve, reject) {
        returnObject = {
            'mime': contentType,
            'ext': ext,
            'base64': base64
        }
        resolve(returnObject)
    }); 
}

// Use GEOLAMBDA
function GEOLAMBDA(layername, format, data64) {
    // hit geolambda function
    var url = 'https://lskze93j56.execute-api.eu-central-1.amazonaws.com/default/geolambda'
    var key = '9OMEn0zKMn6oznXcuO8lE5ALP6sRgtbv3dTg6ZUz'

    var postData = {
        'parameters': {
            'source_epsg': 7416, //params?
            'target_epsg': 7416, //params?
            'target_format': format,
            'target_layername': layername
        },
        'data64': data64
    }
    postData = JSON.stringify(postData)

    //console.log(postData)

    var options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData),
            'x-api-key': key
        },
        body: postData
    };

    //console.log(options)

    // Return new promise 
    return new Promise(function(resolve, reject) {
        fetch(url, options)
        .then(r => {
            //console.log(r)
            return r.json()
        })
        .then(data => {
            //console.log(data)
            // if message is present, is error
            if (data.hasOwnProperty('message') ){
                console.log(data.message)
                reject(data)
            } else {
                resolve(data)
            }
        })
        .catch(error => {
            reject(error)
        })
    });
};

module.exports = router;
