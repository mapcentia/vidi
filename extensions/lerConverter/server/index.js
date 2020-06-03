var express = require('express');
//var request = require('then-request');
var request = require('request');
var router = express.Router();
var http = require('http');
var https = require('https');
var fs = require('fs');
var moment = require('moment');
var config = require('../../../config/config.js');
var session = require ('../../session/server');

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


/**
 * Endpoint for getting 
 */
router.post('/api/extension/lerConverterSendFeature', function (req, response) {
    //inject into db then
    //send the stuff to docunote
    response.setHeader('Content-Type', 'application/json');

    //console.log(req.body.features)
    //console.log(req.body.db)
    
    // check if addresscase is already created
    const qrystr = 'SELECT adrfileid, parenttype FROM ' + req.body.schema + '.adressesager WHERE adresseguid = \'' + req.body.features[0].properties.adgangsadresseid + '\'';
    var getExistinAdrCaseGc2Promise = ReqToGC2(req.session, qrystr, req.body.db);

});


// post case to gc2 
function postToGC2(req, db) {
    if (req.session.subUser)
        var userstr = req.session.gc2UserName + '@' + db;
    else {
        var userstr = req.session.gc2UserName;
    }
    var postData = JSON.stringify(req.body),
        options = {
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Content-Length': Buffer.byteLength(postData),
                'GC2-API-KEY': req.session.gc2ApiKey
            },
            uri: GC2_HOST +'/api/v2/feature/' + userstr + '/' +  req.body.schema + '.' + req.body.tablename + '.the_geom' + '/4326',
            body: postData,
            method: 'POST'


        };
    return new Promise(function(resolve, reject) {
        request(options, function(err, resp, body) {
            if (err) {
                reject(err);
            } else {
                resolve(JSON.parse(body));
            }
        })

    });
}

function ReqToGC2(session, requrl, db) {
    if (session.subUser)
        var userstr = session.screenName + '@' + db;
    else {
        var userstr = session.gc2UserName;
    }

    var options = {
        url: GC2_HOST + '/api/v1/sql/' + userstr + '?q='+requrl + '&key='+session.gc2ApiKey,
        headers: {
            'GC2-API-KEY': session.gc2ApiKey
        }
    };
    console.log(requrl)
    // Return new promise 
    return new Promise(function(resolve, reject) {
        // Do async job
        request.get(options, function(err, resp, body) {
            if (err) {
                reject(err);
            } else {
                console.log(resp)
                if (JSON.parse(body).features && JSON.parse(body).features.length) {
                    resolve(JSON.parse(body));
                } else { 
                    resolve(JSON.parse(body));
                }
                
            }
        })
    })
};

function SqlInsertToGC2(session, requrl, db) {
    if (session.subUser)
        var userstr = session.screenName + '@' + db;
    else {
        var userstr = session.gc2UserName;
    }
    var options = {
        url: GC2_HOST + '/api/v1/sql/' + userstr + '?q='+requrl + '&key='+session.gc2ApiKey,
        headers: {
            'GC2-API-KEY': session.gc2ApiKey
        }
    };
    console.log(requrl)
    // Return new promise 
    return new Promise(function(resolve, reject) {
        // Do async job
        request.get(options, function(err, resp, body) {
            if (err) {
                reject(err);
            } else {
                console.log(resp)
                resolve(JSON.parse(body));
            }
        })
    })
};

module.exports = router;
