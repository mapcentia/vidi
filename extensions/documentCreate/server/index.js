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

const REQCASETYPEID = 44;
const ADRCASETYPEID = 50;
const APPKEY = '9b8efdfe-8ec9-447b-b8a0-030a6b6e80ba';
const USERKEY = '1ec2a520-e22d-4ff2-a662-0593b3f8c121';
const USERNAME = 'RESTapiKortintegration'


/**
 * Endpoint for getting 
 */
router.post('/api/extension/documentCreateSendFeature', function (req, response) {
    //inject into db then
    //send the stuff to docunote
    response.setHeader('Content-Type', 'application/json');

    console.log(req.body)
    // check if addresscase is already created
    const qrystr = 'SELECT adrfileid FROM vmr.adressesager WHERE adresseguid = \'' + req.body.features[0].properties.adresseid + '\'';

//    const qrystr = 'INSERT INTO vmr.adressesager (adrfileid, adresseguid) VALUES (108896,\'0a3f50c1-0523-32b8-e044-0003ba298018\')'
    var getExistinAdrCaseGc2Promise = ReqToGC2(req.session, qrystr);

    var getParentCaseDnPromise = getParentCaseDn(req.body.features[0].properties.esrnr);
    var dnTitle = oisAddressFormatter(req.body.features[0].properties.adresse)

    getExistinAdrCaseGc2Promise.then(function(result) {
        console.log(result)
//        addPartsToCase(req.body.features[0].properties.esrnr, req.body.features[0].properties.adresseid, 108903)

//        let adrcaseid = result.features[0].properties.adrfileid;
        if (result) {
            // adressesagen er oprettet i DN så skal der bare oprettes henvendelsessager under denne
            // getnodeid på henvendelsesmappen
            // getFolderIdDn(adrcaseid).then(console.log())
            bodyreq = makeRequestCase(req, result, REQCASETYPEID, dnTitle)
            //response.send('Adgangsadressesag fundet Docunote')
            var postReqCaseToDnPromise = postCaseToDn(bodyreq);
            postReqCaseToDnPromise.then(function(result) {
                console.log(result)
                if ('caseId' in result) {
                    console.log(result)
                    //response.send('Sag oprettet i DN')
                    req.body.features[0].properties.fileident = result.caseId
                    req.body.features[0].properties.casenumber = result.number
                    var postCaseToGc2Promise = postToGC2(req);
                    var resultjson = {"message":"Sag oprettet","casenumber": result.number}
                    postCaseToGc2Promise.then(function(result){
                        response.status(200).send(resultjson)
                    }, function(err) {
                        response.status(500).send('ikke oprettet')
                    })

                } else {
                    response.status(result.errorCode).send(result.message);
                }


            }, function(err) {
                response.status(500).send('ikke oprettet')
            })

        } else {
            // adressesagen findes ikke, den skal oprettes først.
            // getparentcase på esrnr for at finde mappen
            // opret adressesag husk post caseid tilbage til gc2
            // getnodeid på henvendelsesmappen
            // opret henvendelsessagen herunder.
            getParentCaseDnPromise.then(function(result) {
                console.log(result)
                parentid = result;
                bodyaddresscase = makeAddressCase(req,parentid,ADRCASETYPEID, dnTitle)
                var postCaseToDnPromise = postCaseToDn(bodyaddresscase);
                // Promise to create case in Docunote
                postCaseToDnPromise.then(function(result) {

                    console.log(result)
                    if (!('caseId' in result)) {
                        response.status(500).send('Adgangsadressesag blev ikke oprettet')
                        return
                    }
                    // add parts to case
                    addPartsToCase(req.body.features[0].properties.esrnr, req.body.features[0].properties.adresseid, result.caseId)

                    var insertToGc2Promise = SqlInsertToGC2(req.session, 'INSERT INTO vmr.adressesager (adrfileid, adresseguid) VALUES (' + result.caseId +', \'' + req.body.features[0].properties.adresseid + '\'') 
                    bodyreq = makeRequestCase(req, result.caseId, REQCASETYPEID, dnTitle)
                    // opret adgangsadresseid til brug for seneere opslag.
                    insertToGc2Promise.then(function(result) {
                        console.log(result)
                    }, function(err){
                        console.log(err)
                    }                    
                    )
                    var postReqCaseToDnPromise = postCaseToDn(bodyreq);
                    postReqCaseToDnPromise.then(function(result) {
                        if ('caseId' in result) {
                            console.log(result)
                            //response.status(200).send('Sag oprettet i DN med journalnummer: ' +result.caseId )
                            req.body.features[0].properties.fileident = result.caseId
                            req.body.features[0].properties.casenumber = result.number

                            var postCaseToGc2Promise = postToGC2(req);
                            var resultjson = {"message":"Sag oprettet","casenumber": result.number}
                            postCaseToGc2Promise.then(function(result){
                                response.status(200).send(resultjson)
                            }, function(err) {
                                response.status(500).send('ikke oprettet')
                            })
        
                        } else {
                            response.status(500).send('Fejl i Docunote ' + err)
                        }

                    }, function(err) {
                        response.status(500).send('ikke oprettet ' + err)
                    })
                    }, function(err) {
                    console.log(err)
                    response.status(500).send('ikke oprettet ' + err)
                })
            }, function(err) {
                console.log(err)
                response.status(500).send('Fejl, ejendomssagen eksistere ikke i Docunote ' + err)
            })

        }
    }, function(err) {
        console.log(err)
    })


    //response.send(req.message)
    //return;
});


function addPartsToCase(esrnr, adrguid, caseId){
    // get ids for esrnr and adrguid
    var getEsrIdPromise = getPartId(esrnr);
    var getAdrIdPromise = getPartId(adrguid);
    Promise.all([getEsrIdPromise,getAdrIdPromise]).then(function(values) {
        console.log(values)
        partbody = makePartBody(caseId,values[0].companyId,values[1].companyId)
        putPartToCaseDn(partbody,caseId)
    })

}

function makeAddressCase(req, parentid, typeid, title ) {
    var body = {
        "title": title,
        "parentId": parentid,
        "parentType": 2,
        "typeId": typeid,
        "description": "Adressesag fra Mapcentia",
        "synchronizeSource": 1,
        "synchronizeIdentifier": null,
        "discardingCode": 0,
        "status": 1
    }
    return body
}

function makePartBody(caseId, partid, adrid) {
    var body = [{
        "pickerName": "Ejendom",
        "parts":[{
            "recordId" : caseId,
            "partNodeType": 17,
            "partRecordId": partid            
        }]
    },{
        "pickerName": "Adresse",
        "parts":[{
            "recordId" : caseId,
            "partNodeType": 17,
            "partRecordId": adrid            
        }]
    }]
    return body
}


function makeRequestCase(req, parentid, typeid, title ) {
    if (req.body.features[0].properties.forsyningstype == 'Spildevand') {
        var custdata = {"forsyningstype": 1}
    } else {
        var custdata = {"forsyningstype": 2}
    }
    var body = {
        "title": title,
        "parentId": parentid,
        "parentType": 3,
        "typeId": typeid,
        "description": "Oprettet fra MapCentia",
        "synchronizeSource": 1,
        "synchronizeIdentifier": null,
        "discardingCode": 0,
        "status": 5,
        "customData": custdata
    }
    return body
}

function getFolderIdDn(caseid) {
    var dnoptions = {
        url: 'https://docunoteapi.vmr.dk/api/v1/TreeNodes/nodeId/' + caseid + '/nodeType/3',
        method: 'GET',
        headers: {
            'applicationKey': APPKEY,
            'userKey': USERKEY,
            'userName': USERNAME
        }
    };
    return new Promise(function(resolve, reject) {
   
        request.get(dnoptions, function (err, res, body) {
            if (!err) {
                console.log(body)
                //postToGC2(req)
                resolve(JSON.parse(body).parentid);                
            }
            else {
                console.log(err)
                reject(err)
            }
        });
    })

}

// format address as in lifaois 

function oisAddressFormatter(adrString){
    var adrSplit = adrString.split(",")
    var nr = adrSplit[0].match(/\d+/)
    var padnr = new Array(4 - nr[0].length + 1).join("0") + nr[0];
    return adrSplit[0].replace(nr[0], padnr).concat(" ["+adrSplit[1].trim()+"]")
};

function getParentCaseDn(esrnr) {
    var dnoptions = {
        url: 'https://docunoteapi.vmr.dk/api/v1/Cases/synchronizeSource/10/synchronizeId/'+esrnr,
        method: 'GET',
        headers: {
            'applicationKey': APPKEY,
            'userKey': USERKEY,
            'userName': USERNAME
        }
    };
    return new Promise(function(resolve, reject) {
        request.get(dnoptions, function (err, res, body) {
            if (!err) {
                console.log(body)
                //postToGC2(req)
                //return body.parentid;
                resolve(JSON.parse(body).parentId);
            }
            else {
                console.log(err)
                reject(err);
            }
        });
    })
}

function getPartId(partsyncid) {
    var options = {
        url: 'https://docunoteapi.vmr.dk/api/v1/companies/synchronizeSource/10/synchronizeId/'+partsyncid,
        method: 'GET',
        headers: {
            'applicationKey': APPKEY,
            'userKey': USERKEY,
            'userName': USERNAME
        }
    };
    // Return new promise 
    return new Promise(function(resolve, reject) {
        // Do async job
        request.get(options, function(err, resp, body) {
            if (err) {
                reject(err);
            } else {
                resolve(JSON.parse(body));
            }
        })
    })    
}

// post case to gc2 
function postToGC2(req) {
    if (req.session.subUser)
        var userstr = req.session.gc2UserName + '@' + req.session.screenName;
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
            uri: GC2_HOST +'/api/v2/feature/' + userstr + '/' + 'vmr.' + req.body.features[0].properties.forsyningstype.toLowerCase() + '.the_geom' + '/4326',
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

// Post case to Docunote API
// Returns json
function postCaseToDn(casebody) {
    var postData = JSON.stringify(casebody),
    options = {
            method: 'POST',
            host: 'docunoteapi.vmr.dk',
            path: '/api/v1/Cases',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData),
                'applicationKey': APPKEY,
                'userKey': USERKEY,
                'userName': USERNAME
            }
        };
    return new Promise(function(resolve, reject) {
        var req = https.request(options, function (res) {
            var chunks = [];
            //response.header('content-type', 'text/plain');
            res.on('error', function (e) {
                console.log(e);
                reject(e);
            });
            res.on('data', function (chunk) {
                chunks.push(chunk);
                console.log('Response: ' + chunk);
            });
            res.on("end", function () {
                var jsfile = new Buffer.concat(chunks); 
                //chunks = Buffer.concat(chunks).toString;
                //response.send(jsfile);
                console.log(JSON.parse(jsfile))
                resolve(JSON.parse(jsfile));
            });
        })
        req.write(postData, 'utf8');
        req.end();  
    });
}

function putPartToCaseDn(partbody, caseId) {
    var postData = JSON.stringify(partbody),
    options = {
            method: 'POST',
            host: 'docunoteapi.vmr.dk',
            path: '/api/v1/Cases/' + caseId +'/pickers',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData),
                'applicationKey': APPKEY,
                'userKey': USERKEY,
                'userName': USERNAME
            }
        };
//    return new Promise(function(resolve, reject) {
        var req = https.request(options, function (res) {
            var chunks = [];
            //response.header('content-type', 'text/plain');
            res.on('error', function (e) {
                console.log(e);
                //reject(e);
            });
            res.on('data', function (chunk) {
                chunks.push(chunk);
                console.log('Response: ' + chunk);
            });
            res.on("end", function () {
                var jsfile = new Buffer.concat(chunks); 
                //chunks = Buffer.concat(chunks).toString;
                //response.send(jsfile);
                console.log(jsfile)
                //res.send(JSON.parse(jsfile));
            });
        })
        req.write(postData, 'utf8');
        req.end();  
//    });
}

function ReqToDn(requrl) {
    var options = {
        url: requrl,
        method: 'GET',
        headers: {
            'applicationKey': APPKEY,
            'userKey': USERKEY,
            'userName': USERNAME
        }
    };
    // Return new promise 
    return new Promise(function(resolve, reject) {
        // Do async job
        request.get(options, function(err, resp, body) {
            if (err) {
                reject(err);
            } else {
                resolve(JSON.parse(body));
            }
        })
    })
};

function ReqToGC2(session, requrl) {
    if (session.subUser)
        var userstr = session.gc2UserName + '@' + session.screenName;
    else {
        var userstr = session.gc2UserName;
    }

    var options = {
        url: GC2_HOST + '/api/v1/sql/' + userstr + '?q='+requrl,
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
                if (JSON.parse(body).features.length) {
                    resolve(JSON.parse(body).features[0].properties.adrfileid);
                } else { 
                    resolve(JSON.parse(body).features.length);
                }
                
            }
        })
    })
};


function SqlInsertToGC2(session, requrl) {
    if (session.subUser)
        var userstr = session.gc2UserName + '@' + session.screenName;
    else {
        var userstr = session.gc2UserName;
    }
    var options = {
        url: GC2_HOST + '/api/v1/sql/' + userstr + '?q='+requrl,
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



/**
 * 
 * Body JSON til post create case
 * parentType 4 = Kundehenvendelser
 * ParentID = ejendomssag
 * typeId = 44 Henvendelsessag
 * 
 * {
    "title": "test PDK geopartner",
    "parentId": 181512,
    "parentType": 4,
    "typeId": 44,
    "description": "test PDK",
    "synchronizeSource": 1,
    "synchronizeIdentifier": null,
    "discardingCode": 0,
    "status": 1
}

response body
{
    "caseId": 108108,
    "title": "test PDK geopartner",
    "number": "S19-7484",
    "parentId": 181512,
    "parentType": 4,
    "typeId": 44,
    "created": "2019-08-28T12:05:25.063",
    "createdBy": 160,
    "createdByDisplayName": "RESTapi Kortintegration",
    "lastEdited": "2019-08-28T12:05:25.063",
    "lastEditedBy": 160,
    "lastEditedByDisplayName": "RESTapi Kortintegration",
    "description": "test PDK",
    "synchronizeSource": 1,
    "synchronizeIdentifier": "",
    "customData": {},
    "status": 1,
    "discardingCode": 0,
    "locked": false
}
 
    */



module.exports = router;