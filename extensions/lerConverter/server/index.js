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


/**
 * Endpoint for getting 
 */
router.post('/api/extension/lerFeature', function (req, response) {
    //inject into db then
    //send the stuff to docunote
    response.setHeader('Content-Type', 'application/json');
    console.table(req.body)

    // check if addresscase is already created
    const qrystr = 'SELECT adrfileid, parenttype FROM ' + req.body.schema + '.adressesager WHERE adresseguid = \'' + req.body.features[0].properties.adgangsadresseid + '\'';
    var getExistinAdrCaseGc2Promise = ReqToGC2(req.session, qrystr, req.body.db);

    return {shitIsDone:'Yo!'}

});

/**
 * Endpoint for getting 
 */
router.post('/api/extension/lerSQL', function (req, response) {
    //inject into db then
    //send the stuff to docunote
    response.setHeader('Content-Type', 'application/json');
    console.table(req.body)

    // check if addresscase is already created
    const qrystr = 'SELECT adrfileid, parenttype FROM ' + req.body.schema + '.adressesager WHERE adresseguid = \'' + req.body.features[0].properties.adgangsadresseid + '\'';
    var getExistinAdrCaseGc2Promise = ReqToGC2(req.session, qrystr, req.body.db);

    return {shitIsDone:'Yo!'}

});


// post case to gc2 
function FeatureAPI(req, db) {
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
                console.log(err)
                reject(err);
            } else {
                console.log(resp)
                resolve(JSON.parse(body));
            }
        })

    });
}

function SQLAPI(req, db) {
    if (req.session.subUser)
        var userstr = req.session.screenName + '@' + db;
    else {
        var userstr = req.session.gc2UserName;
    }
    var options = {
        url: GC2_HOST + '/api/v1/sql/' + userstr + '?q='+requrl + '&key='+req.session.gc2ApiKey,
        headers: {
            'GC2-API-KEY': req.session.gc2ApiKey
        }
    };
    console.log(requrl)
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
