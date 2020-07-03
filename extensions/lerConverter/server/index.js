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
    console.table(req.session)

    // If user is not currently inside a session, hit 'em with a nice 401
    if (!req.session.hasOwnProperty("gc2SessionId")) {
        response.status(401).json({error:"Du skal være logget ind for at benytte løsningen."})
    }

    // Check if query exists
    if(!req.body.hasOwnProperty("nummer")) {
        response.status(500).json({error:"Forespørgsel mangler i parametren 'nummer'"})
    }

    // Go ahead with the logic
    let q = 'Select * from '
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
 * Endpoint for SQL 
 */
router.post('/api/extension/lerSQL', function (req, response) {
    response.setHeader('Content-Type', 'application/json');

    console.table(req.body)

    // If user is not currently inside a session, hit 'em with a nice 401
    if (!req.session.hasOwnProperty("gc2SessionId")) {
        response.status(401).json({error:"Du skal være logget ind for at benytte løsningen."})
    }

    // Check if query exists
    if(!req.body.hasOwnProperty("q")) {
        response.status(500).json({error:"Forespørgsel mangler i parametren 'q'"})
    }

    // Go ahead with the logic
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
 * Endpoint for FeatureAPI
 */
router.post('api/extension/lerFeature', function(req, response) {
    
    response.setHeader('Content-Type', 'application/json');
    console.log(req)
    FeatureAPI(req)

    response.status(200).send({shitIsDone:'Yo! - feature'})
})


// Use FeatureAPI
function FeatureAPI(req) {
    var userstr = userString(req)
    var postData = JSON.stringify(req.body),
        options = {
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Content-Length': Buffer.byteLength(postData),
                'GC2-API-KEY': req.session.gc2ApiKey
            },
            uri: GC2_HOST +'/api/v2/feature/' + userstr + '/' +  req.body.schema + '.' + req.body.tablename + '.the_geom' + '/25832',
            body: postData,
            method: 'POST'


        };
    return new Promise(function(resolve, reject) {
        request(options, function(err, resp, body) {
            if (err) {
                console.log(err)
                reject(err);
            } else {
                console.log(resp)
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
                console.log(err)
                reject(err);
            } else {
                console.log(resp)
                resolve(JSON.parse(body));
            }
        })
    })
};

module.exports = router;
