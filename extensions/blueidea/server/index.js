var express = require('express');
var request = require('request');
var router = express.Router();
var http = require('http');
var https = require('https');
var moment = require('moment');
var config = require('../../../config/config.js');
var he = require('he');
var fetch = require('node-fetch');
var bi = require('../../../config/gp/config.blueidea');
const { post } = require('request');


/**
 *
 * @type {string}
 */
// GC2_HOST = (GC2_HOST.split("http://").length > 1 ? GC2_HOST.split("http://")[1] : GC2_HOST);
// Hardcoded host - config has internal name in docker-compose
GC2_HOST = 'https://mapgogc2.geopartner.dk'

// Set locale for date/time string
moment.locale("da_DK");

var BACKEND = config.backend;

var TABLEPREFIX = 'blueidea_'

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
 * Endpoint for populating foresp. in current schema 
 */
router.post('/api/extension/:userid/LookupAddressesPhoneCount', function (req, response) {

    // Guard against missing user
    if (!hasUserSetup(req.params.userid)) {
        response.status(401).send('User not found')
        return
    }
    
    response.setHeader('Content-Type', 'application/json');

    headers = {
        "Authorization": loginToBlueIdea,
    }

    return new Promise(function (resolve, reject) {
        //console.log(q.substring(0, 60))
        fetch(url, options)
            .then(r => r.json())
            .then(data => {
                // if message is present, is error
                if (data.hasOwnProperty('message')) {
                    console.log(data)
                    reject(data)
                } else {
                    resolve(data)
                }
            })
            .catch(error => {
                console.log(error)
                reject(error)
            })
    });

});

// Use SQLAPI
function SQLAPI(q, req) {
    console.log(GC2_HOST)
    var userstr = userString(req)
    var postData = JSON.stringify({
        key: req.session.gc2ApiKey,
        q: q
    })
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
    return new Promise(function (resolve, reject) {
        //console.log(q.substring(0,175))
        fetch(url, options)
            .then(r => r.json())
            .then(data => {
                // if message is present, is error
                if (data.hasOwnProperty('message')) {
                    console.log(data)
                    reject(data)
                } else {
                    //console.log('Success: '+ data.success+' - Q: '+q.substring(0,60))
                    resolve(data)
                }
            })
            .catch(error => {
                console.log(error)
                reject(error)
            })
    });
};

//Guard for non-existing user
function hasUserSetup(uuid) {
    // check if uuid in in config, and if user object has username and password
    if (bi.users.hasOwnProperty(uuid) && bi.users[uuid].hasOwnProperty('username') && bi.users[uuid].hasOwnProperty('password')) {
        return true
    } else {
        return false
    }
}

// Login to Blueidea to get token
function loginToBlueIdea(username, password) {
    return new Promise(function (resolve, reject) {
        var url = bi.hostname + 'User/Login'
        var body = { "email": username, "password": password }
        post(url, body, options)
            .then(r => {
                data = r.json()
                // Guard against bad status codes
                if (r.status != 200) {
                    console.log(r)
                    reject(data)
                }
                resolve(data.accessToken)
            })
            .catch(error => {
                console.log(error)
                reject(error)
            })
    });
}

module.exports = router;
