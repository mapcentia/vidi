var express = require('express');
var request = require('request');
var router = express.Router();
var http = require('http');
var https = require('https');
var moment = require('moment');
var config = require('../../../config/config');
var dn = require('../../../config/gp/config.geosag');


const debug = false;
function addZero(i) {
    if (i < 10) {
      i = "0" + i;
    }
    return i;
  }
var yell = function(obj, override=false) {

    var today = new Date();
    var date = today.getFullYear()+'-'+addZero((today.getMonth()+1))+'-'+addZero(today.getDate());
    var time = addZero(today.getHours()) + ":" + addZero(today.getMinutes()) + ":" + addZero(today.getSeconds());
    var dateTime = date+' '+time;

    if (debug) {
        console.log(`[${dateTime}] [ex:GeoSag] : ${JSON.stringify(obj, undefined, 2)}`)
    } else if (override) {
        console.log(`[${dateTime}] [ex:GeoSag] : ${JSON.stringify(obj, undefined, 2)}`)
    }
}


/**
 *
 * @type {string}
 */
var GC2_HOST = config.gc2.host;
GC2_HOST = (GC2_HOST.split("https://").length > 1 ? GC2_HOST.split("https://")[1] : GC2_HOST);

// Set locale for date/time string
moment.locale("da_DK");

var BACKEND = config.backend;


// Days from 19000101 to 19700101
const DAYSSINCE = 25569
// milisecs pr. day
const MILISECSDAY = 86400000

// Build Docunote-requests
var docunote = function(endpoint, method, body=undefined) {
    var api = {
        url: dn.hostUrl + 'api/' + dn.version + '/' + endpoint,
        headers: {
            Accept: "application/json",
            applicationKey:dn.applicationKey,
            userName: dn.userName,
            userKey: dn.userKey,
        },
        method: method,
        json: true
    };

    if (body !== undefined) {
        api.body = body
        return api;
    } else {
        return api;
    }
    
};

function getDocunote(endpoint) {
    var api = docunote(endpoint, 'GET');

    yell(api.method + ': ' + api.url + ' - Calling');
    // Return new promise 
    return new Promise(function(resolve, reject) {
        // Do async job
        request.get(api, function(err, resp, body) {
            if (err) {
                yell(err)
                yell(api.method + ': ' + api.url + ' - Recieved - ERROR');
                reject(err);
            } else {
                // yell(body)
                yell(api.method + ': ' + api.url + ' - Recieved - OK');
                resolve(body);
            }
        });
    }); 
}
function postDocunote(endpoint, body) { 
    var api = docunote(endpoint, 'POST', body);

    yell(api.method + ': ' + api.url + ' - Calling');
    // Return new promise 
    return new Promise(function(resolve, reject) {
        // Do async job
        request.post(api, function(err, resp, body) {
            if (err) {
                yell(api.method + ': ' + api.url + ' - Recieved - ERROR');
                reject(err);
            } else {
                yell(api.method + ': ' + api.url + ' - Recieved - OK');
                resolve(body);
            }
        });
    }); 
}

// Checks if user is allowed to use endpoints
function verifyUser(request) {
    return new Promise(function(resolve, reject) {
            //yell(request)
            
            //try {
            //    console.log('Incomming: '+request.body.user.toString())
            //    console.log('Requested: '+request.connection.remoteAddress)
            //    console.log('Requested: '+request.headers['x-forwarded-for'])
            //} catch (error) {
            //    console.log(error)
            //}

            if (dn.allow_from.includes(request.headers['x-forwarded-for']) || request.connection.remoteAddress == '::1') {
                resolve({success: true, message:'User allowed'});
            } else {
                yell(`Blocked access for ${request.connection.remoteAddress}/${request.headers['x-forwarded-for']}`, true)
                // yell(`Address not in ${dn.allow_from}`, true)
                reject({success: false, message:'User not allowed'});
            }
    });  
}


/**
 * Endpoint for getting existing matr from case / case existance
 */
router.post('/api/extension/getExistingMatr', function (req, response) {
    response.setHeader('Content-Type', 'application/json');

    // Validation block
    try {
        // User not in call
        //if (!req.body.hasOwnProperty("user")) {
        //    response.status(401).json({
        //        error: "User mangler i kaldet"
        //    });
        //    return;
        //}
    // Sagsnummer not in call
    if (!req.body.hasOwnProperty("sagsnr")) {
        response.status(401).json({
            error: "Sagsnummer mangler i kaldet"
        });
        return;
    }
    } catch (error) {
        yell(error)
        response.status(500).json(error);
    }

    // Logic
    try {
        verifyUser(req)
            .then(function(user) {
                // user is allowed
                yell(user);
                return getDocunote('Cases/'+ req.body.sagsnr.toString()+'/parts');
            })
            .then(function(docunoteCaseParts) {
                // Got parts, get information on each person
                yell(docunoteCaseParts);

                // Get the right picker
                var picker = docunoteCaseParts.find(function(obj) {
                    return obj.pickerName === dn.partsPicker;
                });

                // If defined parts dont exist?
                if (picker == undefined) {
                    yell('Defined PartsPicker not found! - returning empty', true)
                    throw({"matrikler": []})
                } 

                // Get the right parts
                var parts = picker.parts.filter(function(obj) {
                    return obj.partNodeType === dn.partsType;
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
                var matrs = parts.filter(function(obj) {
                    return obj.listId === dn.personListId;
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
        yell(error)
        response.status(500).json(error);
    }
});

router.post('/api/extension/getCase', function (req, response) {
    response.setHeader('Content-Type', 'application/json');

    // Validation block
    try {
        // User not in call
        //if (!req.body.hasOwnProperty("user")) {
        //    response.status(401).json({
        //        error: "User mangler i kaldet"
        //    });
        //    return;
        //}
    // Sagsnummer not in call
    if (!req.body.hasOwnProperty("sagsnr")) {
        response.status(401).json({
            error: "Sagsnummer mangler i kaldet"
        });
        return;
    }
    } catch (error) {
        yell(error)
        response.status(500).json(error);
    }

    // Logic
    try {
        verifyUser(req)
            .then(function(user) {
                // user is allowed
                yell(user);
                return getDocunote('Cases/number/'+ req.body.sagsnr.toString());
            })
            .then(function(Case) {
                // Got the Case
                response.status(200).json(Case);
                return;
            })
            .catch(function(error) {
                response.status(500).json(error);
                return;
            });

    } catch (error) {
        yell(error)
        response.status(500).json(error);
    }
});


function matrikelExists(matr) {
    // Checks if matrikel already exists as "part-able".
    // If person exists, return only information for parts.
    return new Promise(function(resolve, reject) {
        getDocunote(`Persons/synchronizeSource/${dn.synchronizeSource}/synchronizeId/${matr.key}`, 'GET')
        .then(r => {
            resolve({
                key: r.synchronizeIdentifier,
                partNodeType: r.nodeType,
                partRecordId: r.nodeId
            })
        })
    }); 
}
function createMatrikelPart(matr) {
    // creates matrikel part
    return new Promise(function(resolve, reject) {

        yell(matr)

        var newMatr = {
            firstName: matr.matrikelnr,
            lastName: matr.ejerlavsnavn,
            synchronizeIdentifier: matr.key,
            synchronizeSource: dn.synchronizeSource,
            listId: dn.personListId,
            customData: {
                ejerlavskode: matr.ejerlavskode,
                kommunenr: (matr.kommunekode == '-' ? null : matr.kommunekode),
                matresrnr: (matr.esr == '-' ? null : matr.esr),
                matrkomnavm: (matr.kommune == '-' ? null : matr.kommune),
                matrnrcustom: matr.matrikelnr,
                matrsfenr: (matr.bfe == '-' ? null : matr.bfe),
            }
        }

        postDocunote(`Persons`, newMatr)
        .then(r => {
            resolve({
                key: r.synchronizeIdentifier,
                partNodeType: r.nodeType,
                partRecordId: r.nodeId
                
            })
        })
        .catch(e => {
            console.log(e)
            reject(e);
        })
    }); 

}

function getConnectedCases(partNodeType, partNodeId) {
    // Get all connected cases
    return new Promise(function (resolve, reject) {
        getDocunote(`Cases/pickername/${dn.partsPicker}/partNodeType/${partNodeType}/partRecordId/${partNodeId}`)
        .then(r => {
            resolve(r)
        })
        .catch(e => {
                reject(e);
            }
        )
    }); 
}

router.post('/api/extension/getConnectedCases', function (req, response) {
    response.setHeader('Content-Type', 'application/json');

    // Validation block
    try {
        // Ejerlavskode not in call
        if (!req.body.hasOwnProperty("ejerlavkode")) {
            response.status(401).json({
                error: "ejerlavkode mangler i kaldet"
            });
            return;
        }
        // Matrikler not in call
        if (!req.body.hasOwnProperty("matrikelnr")) {
            response.status(401).json({
                error: "matrikelnr mangler i kaldet"
            });
            return;
        }
    } catch (error) {
        yell(error)
        response.status(500).json(error);
    }

    // Logic
    try {
        console.log(req.body)
        verifyUser(req)
            .then(function(user) {
                // user is allowed

                // Check if matrs exist already
                let jobs = [];
                let matr = { key: req.body.ejerlavkode + req.body.matrikelnr }
                return matrikelExists(matr)
            })
            .then(function (exists) {
                // Move existing into parts
                console.log(exists)
                
                // if values  in exists are undefined, retun empty array
                if (exists.partNodeType == undefined || exists.partRecordId == undefined) {
                    response.status(200).json([]);
                }
                else {
                    return getConnectedCases(exists.partNodeType, exists.partRecordId)
                }


            })
            .then(function(connectedCases) {
                response.status(200).json(connectedCases);
                return;
            })
            .catch(function(error) {
                response.status(500).json(error);
                return;
            });

    } catch (error) {
        yell(error)
        response.status(500).json(error);
    }

});

router.post('/api/extension/saveMatrChanges', function (req, response) {
    response.setHeader('Content-Type', 'application/json');

    // Validation block
    try {
        // User not in call
        //if (!req.body.hasOwnProperty("user")) {
        //    response.status(401).json({
        //        error: "User mangler i kaldet"
        //    });
        //    return;
        //}
        // Sagsnummer not in call
        if (!req.body.hasOwnProperty("sagsnr")) {
            response.status(401).json({
                error: "Sagsnummer mangler i kaldet"
            });
            return;
        }
        // Matrikler not in call
        if (!req.body.hasOwnProperty("matrs")) {
            response.status(401).json({
                error: "Matrikler mangler i kaldet"
            });
            return;
        }
    } catch (error) {
        yell(error)
        response.status(500).json(error);
    }

    // Logic
    try {
        var matrs = req.body.matrs;
        var parts = [];
        var caseId;
        verifyUser(req)
            .then(function(user) {
                // user is allowed

                // Check if matrs exist already
                let jobs = [];
                matrs.forEach(f => {
                    jobs.push(matrikelExists(f));
                })
                return Promise.all(jobs);
            })
            .then(function(exists) {
                // Move existing into parts
                yell(exists)
                parts = exists;

                // If matr not in exists, create.
                let creates = [];
                matrs.forEach(f => {
                    if (!exists.some(e => e.key === f.key)) {
                        // Create non-existing matr
                        creates.push(createMatrikelPart(f))
                      }
                })
                if (creates.length > 0) {
                    return Promise.all(creates);
                } else {
                    // If none is created return 
                    return Promise.resolve([])
                }
            })
            .then(function(created){
                // Push newly created into parts
                Array.prototype.push.apply(parts, created)
                // Remove null's and keys
                parts = JSON.parse(JSON.stringify(parts))

                // Remove empty objects
                var nullLess = parts.filter(value => Object.keys(value).length !== 0);
                parts = nullLess

                // Remove key
                parts.forEach(function(v){ delete v.key });

                // Get Information from case
                return getDocunote('Cases/number/'+ req.body.sagsnr.toString());
            })
            .then(function(docunoteCase) {
                //Get case number
                caseId = docunoteCase.caseId.toString()
                return getDocunote('Cases/'+ caseId+'/parts');
            })
            .then(function(docunoteCaseParts) {

                // Get the right picker
                var picker = docunoteCaseParts.find(function(obj) {
                    return obj.pickerName === dn.partsPicker;
                });

                // If we already have picker in case, keep these
                if (picker !== undefined) {
                    yell('Defined PartsPicker found! - merging', true)
                    var keepParts = picker.parts.filter(function(obj) {
                        return obj.partNodeType !== dn.partsType;
                    });
                    // Merge with new stuff
                    Array.prototype.push.apply(keepParts, parts)
                    var newPicker = [
                        {
                            pickerName: dn.partsPicker,
                            parts: keepParts
                        }
                    ]
                } else {
                    // picker didn't already exist
                    var newPicker = [
                        {
                            pickerName: dn.partsPicker,
                            parts: parts
                        }
                    ]
                }
                
                yell(newPicker)


                return postDocunote('Cases/'+ caseId+'/pickers', newPicker);
            })
            .then(function(savedParts) {
                response.status(200).json(savedParts);
                return;
            })
            .catch(function(error) {
                response.status(500).json(error);
                return;
            });

    } catch (error) {
        yell(error)
        response.status(500).json(error);
    }
});
module.exports = router;
