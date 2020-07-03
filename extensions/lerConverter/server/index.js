var express = require('express');
var request = require('request');
var router = express.Router();
var http = require('http');
var https = require('https');
var fs = require('fs');
var moment = require('moment');
var config = require('../../../config/config.js');


/**
*
* @type {string}
*/
var GC2_HOST = config.gc2.host;
GC2_HOST = (GC2_HOST.split("http://").length > 1 ? GC2_HOST.split("http://")[1] : GC2_HOST);

// Set locale for date/time string
moment.locale("da_DK");

var BACKEND = config.backend;

// Days from 19000101 to 19700101
const DAYSSINCE = 25569
// milisecs pr. day
const MILISECSDAY = 86400000

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
    }

    // Check if query exists
    if(!req.body.hasOwnProperty("nummer")) {
        response.status(500).json({error:"Forespørgsel mangler i parametren 'nummer'"})
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
    }

    // Check if query exists
    if(!req.body.hasOwnProperty("foresp") && !req.body.hasOwnProperty("forespNummer") && !req.body.hasOwnProperty("data")) {
        response.status(500).json({error:"Forespørgsel er ikke komplet. 'foresp','forespNummer','data'"})
    }

    // Go ahead with the logic
    // sort in types then delete sync-like
    var lines = [], polys = [], pts = []
    let f;

    b.data.forEach(f => {
        //console.log(f)
        // Pass if unparsed
        if (f.geometry === null) {
            return
        } else if (f.geometry.type == 'MultiLineString') {
            lines.push(f)
        } else if (f.geometry.type == 'MultiPolygon') {
            pts.push(f)
        } else if (f.geometry.type == 'MultiPoint') {
            polys.push(f)
        }
    })

    console.log('Got: '+b.forespNummer+'. Lines: '+lines.length+', Polygons: '+polys.length+', Points: '+pts.length)

    try {
        // delete existing
        //SQLAPI('delete from '+s.screenName+'.ler_line WHERE ', req)
        fc = {type:'FeatureCollection',features: lines}
        FeatureAPI(req, fc, 'ler_line', '7416')
        .then(r => {
            //console.log(r)
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
        request(options, function(err, resp, body) {
            if (err) {
                p = JSON.parse(body)
                console.log(p.message)
                reject(JSON.parse(body));
            } else {
                p = JSON.parse(body)
                if (p.message.hasOwnProperty('ServiceException')){
                    console.log(p.message.ServiceException.substring(0,200))
                } else {
                    console.log(p.message)
                }
                resolve(JSON.parse(body));
            }
        })

    });
}

// Use SQLAPI
function SQLAPI(q, req) {
    var userstr = userString(req)
    var options = {
        url: GC2_HOST + '/api/v1/sql/' + userstr + '?q='+q + '&key='+req.session.gc2ApiKey,
        headers: {
            'GC2-API-KEY': req.session.gc2ApiKey
        }
    };
    console.log(q)
    // Return new promise 
    return new Promise(function(resolve, reject) {
        // Do async job
        request.get(options, function(err, resp, body) {
            if (err) {
                //console.log(err)
                reject(err);
            } else {
                //console.log(resp)
                resolve(JSON.parse(body));
            }
        })
    })
};

module.exports = router;
