var express = require('express');
var request = require('request');
var router = express.Router();
var http = require('http');
var https = require('https');
var moment = require('moment');
var config = require('../../../config/gp/config.geosag');
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
var dn = require('../server/config');

// Days from 19000101 to 19700101
const DAYSSINCE = 25569
// milisecs pr. day
const MILISECSDAY = 86400000

// Build Docunote-requests
var docunote = function(endpoint, method) {
    var api = {
        url: dn.hostUrl + 'api/' + dn.version + '/' + endpoint,
        headers: {
            Accept: "application/json",
            applicationKey:dn.applicationKey,
            userName: dn.userName,
            userKey: dn.userKey,
        },
        method: method
    };
    return api;
};

function getDocunote(endpoint) {
    //var api = docunote('Cases/number/'+ sagsnr.toString(), 'GET');
    //var api = docunote('Persons/'+ personId.toString(), 'GET');
    //var api = docunote('Cases/'+ caseId.toString()+'/parts', 'GET');
    
    var api = docunote(endpoint, 'GET');
    console.log(api.url + ' - Calling');
    // Return new promise 
    return new Promise(function(resolve, reject) {
        // Do async job
        request.get(api, function(err, resp, body) {
            if (err) {
                reject(err);
            } else {
                console.log(api.url + ' - Recieved');
                resolve(JSON.parse(body));
            }
        });
    }); 
}

// Checks if user is allowed to use endpoints
function verifyUser(request) {
    return new Promise(function(resolve, reject) {
            //TODO: Make sure only the right people can use the API!
            //console.log(request)
            try {
                console.log('Incomming: '+request.body.user.toString())
                console.log('Requested: '+request.connection.remoteAddress)
                console.log('Requested: '+request.headers['x-forwarded-for'])
            } catch (error) {
                console.log(error)
            }

            if (true) {
                resolve({success: true, message:'User allowed'});
            } else {
                reject({success: false, message:'User not allowed'});
            }
    });  
}


/**
 * Endpoint for getting existing matr from case / case existance
 */
router.post('/api/extension/getExistingMatr', function (req, response) {
    response.setHeader('Content-Type', 'application/json');

    // User not in call
    if (!req.body.hasOwnProperty("user")) {
        response.status(401).json({
            error: "User mangler i kaldet"
        });
        return;
    }
    // Sagsnummer not in call
    if (!req.body.hasOwnProperty("caseId")) {
        response.status(401).json({
            error: "caseId mangler i kaldet"
        });
        return;
    }

    // Logic
    try {
        verifyUser(req)
            .then(function(user) {
                // user is allowed
                //console.log(user);
                return getDocunote('Cases/'+ req.body.caseId.toString()+'/parts');
            })
            .then(function(docunoteCaseParts) {
                // Got parts, get information on each person
                //console.log(docunoteCaseParts);
                var lookingForType = 19;
                var lookingForPicker = 'system_partiespicker';

                // Get the right picker
                var picker = docunoteCaseParts.find(function(obj) {
                    return obj.pickerName === lookingForPicker;
                });

                // Get the right parts
                var parts = picker.parts.filter(function(obj) {
                    return obj.partNodeType === lookingForType;
                });

                var partsToCheck = [];
                parts.forEach(function(part) {
                    partsToCheck.push(getDocunote('Persons/'+part.partRecordId));
                });

                return Promise.all(partsToCheck);
            })
            .then(function(parts) {
                // Detail view of all parts
                //parts.forEach(function(obj) {
                //    console.log(obj);
                //});

                // Make sure we only get items from "Matrikelliste"
                var lookingForListId = 5;
                var matrs = parts.filter(function(obj) {
                    return obj.listId === lookingForListId;
                });

                // Return Matr to user
                response.status(200).json({"matrikler": matrs});
                return;
            })
            .catch(function(error) {
                response.status(500).json(error);
                return;
            });

    } catch (error) {
        //console.log(error)
        response.status(500).json(error);
    }
});

router.post('/api/extension/getCase', function (req, response) {
    response.setHeader('Content-Type', 'application/json');

    // User not in call
    if (!req.body.hasOwnProperty("user")) {
        response.status(401).json({
            error: "User mangler i kaldet"
        });
        return;
    }
    // Sagsnummer not in call
    if (!req.body.hasOwnProperty("sagsnr")) {
        response.status(401).json({
            error: "Sagsnummer mangler i kaldet"
        });
        return;
    }

    // Logic
    try {
        verifyUser(req)
            .then(function(user) {
                // user is allowed
                //console.log(user);
                return getDocunote('Cases/number/'+ req.body.sagsnr.toString());
            })
            .then(function(Case) {
                // Got the Case
                // Return Matr to user
                response.status(200).json(Case);
                return;
            })
            .catch(function(error) {
                response.status(500).json(error);
                return;
            });

    } catch (error) {
        //console.log(error)
        response.status(500).json(error);
    }
});

module.exports = router;
