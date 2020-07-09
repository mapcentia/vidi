var express = require('express');
var request = require('request');
var router = express.Router();
var http = require('http');
var https = require('https');
var moment = require('moment');
var config = require('../../../config/config.js');
var he = require('he');
var fetch = require('node-fetch');
//var allSettled = require('promise.allsettled');
//allSettled.shim();


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

allSettled = function(promiseList) {
    let results = new Array(promiseList.length);

    return new Promise((ok, rej) => {

        let fillAndCheck = function(i) {
            return function(ret) {
                results[i] = ret;
                for(let j = 0; j < results.length; j++) {
                    if (results[j] == null) return;
                }
                ok(results);
            }
        };

        for(let i=0;i<promiseList.length;i++) {
            promiseList[i].then(fillAndCheck(i), fillAndCheck(i));
        }
    });
}

var userString = function (req) {
    var userstr = ''
    if (req.session.subUser)
        var userstr = req.session.gc2UserName + '@' + req.session.parentDb;
    else {
        var userstr = req.session.gc2UserName;
    }
    return userstr
}

var lc = function (obj) {
    var key, keys = Object.keys(obj);
    var n = keys.length;
    var newobj={}
    while (n--) {
      key = keys[n];
      newobj[key.toLowerCase()] = obj[key];
    }
    return newobj
}

/**
 * Builds INSERT with a single feature
 * @param {*} feature 
 * @param {*} table 
 * @param {*} crs 
 */
var buildSQL = function(feature, table, geom_col, crs) {
    //console.log(feature)

    let values = []
    let into = []

    // Route content
    for (const [key, value] of Object.entries(feature.properties)) {
        //console.log(`${key}: ${value}`);
        if (value != ''){

            // 
            values.push("'"+he.decode(String(value))+"'")
            into.push(key)
        }
      }
    
    // Append geometry
    let geomString = "ST_SetSRID(ST_GeomFromGeoJSON('"+ JSON.stringify(feature.geometry) +"'),"+crs+")"
    values.push(geomString)
    into.push('the_geom')

    // Build final string
    let str = 'INSERT INTO '+table+ ' ('+into.join(',')+') VALUES ('+values.join(',')+')'
    return str
}

/**
 * Builds INSERT statement with multiple features
 * @param {*} features
 * @param {*} table 
 * @param {*} crs 
 */
var buildSQLArray = function(features, table, geom_col, crs) {
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
        // Append geometry
        nestedValues.push("ST_SetSRID(ST_GeomFromGeoJSON('"+ JSON.stringify(f.geometry) +"'),"+crs+")")

        // Add to values
        let nest = "("+nestedValues.join(',')+")"
        //console.log(nest)
        values.push(nest)
    })

    // Add geomemtry column
    into = Array.from(into)
    into.push(geom_col)
    

    // Build final string
    let str = 'INSERT INTO '+table+ ' ('+into.join(',')+') VALUES '+values.join(',')
    return str
}

/**
 * Endpoint for getting distinct foresp. in current schema 
 */
router.post('/api/extension/getForespoergsel', function (req, response) {
    response.setHeader('Content-Type', 'application/json');

    console.table(req.body)
    let b = req.body
    console.table(req.session)
    let s = req.session

    // If user is not currently inside a session, hit 'em with a nice 401
    if (!req.session.hasOwnProperty("gc2SessionId")) {
        response.status(401).json({error:"Du skal være logget ind for at benytte løsningen."})
        return
    }

    // Check if query exists
    if(!req.body.hasOwnProperty("nummer")) {
        response.status(500).json({error:"Forespørgsel mangler i parametren 'nummer'"})
        return
    }

    // Go ahead with the logic
    let q = 'Select forespnummer from '+ s.gc2screenName+'.graveforespoegsel'
    try {
        SQLAPI(req.body.q, req)
        .then(r => {
            console.log(r)
            response.status(200).json(r)
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

    try {
        lines = {type:'FeatureCollection',features: lines}
        pts = {type:'FeatureCollection',features: pts}
        polys = {type:'FeatureCollection',features: polys}
        fors = {type:'FeatureCollection',features: [b.foresp]}

        clean = [
            SQLAPI('delete from '+s.screenName+'.' + TABLEPREFIX + 'graveforespoergsel WHERE forespnummer = '+b.forespNummer, req),
            SQLAPI('delete from '+s.screenName+'.' + TABLEPREFIX + 'lines WHERE forespnummer = '+b.forespNummer, req),
            SQLAPI('delete from '+s.screenName+'.' + TABLEPREFIX + 'points WHERE forespnummer = '+b.forespNummer, req),
            SQLAPI('delete from '+s.screenName+'.' + TABLEPREFIX + 'polygons WHERE forespnummer = '+b.forespNummer, req)
        ]
        post = []

        // Add forespoergsel
        //TODO: change to SQLAPI
        //chain.push(FeatureAPI(req, fors, TABLEPREFIX + 'graveforespoergsel', '25832'))
        post.push(SQLAPI(buildSQLArray(fors.features, s.screenName+'.' + TABLEPREFIX + 'graveforespoergsel', 'the_geom', '25832'), req))

        // Add layers that exist, add chunks
        var CHUNKSIZE = 50
        var chunks;

        try {
            if (lines.features.length > 0) {
                chunks = lines.features.chunk(CHUNKSIZE)
                chunks.forEach(g=> {post.push(SQLAPI(buildSQLArray(g, s.screenName+'.' + TABLEPREFIX + 'lines', 'the_geom', '7416'), req))})
                //chain.push(FeatureAPI(req, lines, TABLEPREFIX + 'lines', '7416'))
            }
            if (pts.features.length > 0) {
                chunks = pts.features.chunk(CHUNKSIZE)
                chunks.forEach(g=> {post.push(SQLAPI(buildSQLArray(g, s.screenName+'.' + TABLEPREFIX + 'points', 'the_geom', '7416'), req))})
                //chain.push(FeatureAPI(req, pts, TABLEPREFIX + 'points', '7416'))
            }
            if (polys.features.length > 0) {
                chunks = polys.features.chunk(CHUNKSIZE)
                chunks.forEach(g=> {post.push(SQLAPI(buildSQLArray(g, s.screenName+'.' + TABLEPREFIX + 'polygons', 'the_geom', '7416'), req))})
                //chain.push(FeatureAPI(req, polys, TABLEPREFIX + 'polygons', '7416'))
            }
        } catch (error) {
            console.log(error)
            response.status(500).json(error)
        }

        // Execute entire chain
        allSettled(clean) // delete existing 
        .then(d => {
            //console.log(d)
            allSettled(post)
            .then(r => {
                //console.log(r)
                response.status(200).json(r)
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
 * Endpoint for upserting features from LER 
 */
router.post('/api/extension/upsertStatus', function (req, response) {
    response.setHeader('Content-Type', 'application/json');

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
    if(!req.body.hasOwnProperty("Ledningsejerliste")) {
        response.status(500).json({error:"Forespørgsel er ikke komplet. 'Ledningsejerliste'"})
        return
    }

    // Build featurecollection
    
    console.log(b.Ledningsejerliste.Ledningsejer)
    var ledningsejer = b.Ledningsejerliste.Ledningsejer
    var fc = {}
    var f = []

    ledningsejer.forEach(l =>{
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
}

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
        console.log(q.substring(0,60))
        fetch(url, options)
        .then(r => r.json())
        .then(data => {
            // if message is present, is error
            if (data.hasOwnProperty('message') ){
                console.log(data.message)
                reject(data)
            } else {
                console.log('Success: '+ data.success+' - Q: '+q.substring(0,60))
                resolve(data)
            }
        })
        .catch(error => {
            reject(error)
        })
    });
};

module.exports = router;
