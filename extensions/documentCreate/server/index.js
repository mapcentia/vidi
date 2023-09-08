var express = require("express");
//var request = require('then-request');
var request = require("request");
var router = express.Router();
var http = require("http");
var https = require("https");
var fs = require("fs");
var moment = require("moment");
var config = require("../../../config/config.js");
var session = require("../../session/server");
const { VERSION } = require("underscore");

/**
 *
 * @type {string}
 */
var GC2_HOST = config.gc2.host;

// GC2_HOST = (GC2_HOST.split("http://").length > 1 ? GC2_HOST.split("http://")[1] : GC2_HOST);
// Hardcoded host - config has internal name in docker-compose
GC2_HOST = "https://mapgogc2.geopartner.dk";

// Set locale for date/time string
moment.locale("da_DK");

var BACKEND = config.backend;

const DONTPOST = false;
const REQCASETYPEID = 44;
const ADRCASETYPEID = 50;
const SYNCSOURCE = 24;
const APPKEY = "9b8efdfe-8ec9-447b-b8a0-030a6b6e80ba";
const USERKEY = "1ec2a520-e22d-4ff2-a662-0593b3f8c121";
const USERNAME = "RESTapiKortintegration";
const NODETYPECASE = 3;
// status bør være 5, men fejler ved post til DN
const STATUSCODE = 5;

// Days from 19000101 to 19700101
const DAYSSINCE = 25569;
// milisecs pr. day
const MILISECSDAY = 86400000;

const APIVERSION = "v2";

/**
 * Endpoint for editing location
 */
router.post(
  "/api/extension/documentCreateEditFeature",
  function (req, response) {
    var APIKey = req.session.gc2ApiKey;
    var db = req.body.db;
    var sql = req.body.sql;

    var getExistinAdrCaseGc2Promise = ReqToGC2(req.session, sql, db);

    //Check for existing cases if so use existing parentid
    getExistinAdrCaseGc2Promise.then(
      function (result) {
        if (result.affected_rows > 0)
          response.status(200).send("Placeringen er opdateret");
        else response.status(500).send("incorrect layer");
      },
      function (err) {
        response.status(500).send("Fejl ved gem placering, " + err);
      }
    );
  }
);

/**
 * Endpoint for getting
 */
router.post(
  "/api/extension/documentCreateSendFeature",
  function (req, response) {
    //inject into db then
    //send the stuff to docunote
    response.setHeader("Content-Type", "application/json");

    //console.log(req.body.features)
    //console.log(req.body.db)

    var session_error_message = "Fejl i session, prøv at logge ind igen.";

    // Guard against no session
    if (!req.session) {
      return response.status(500).send( session_error_message );
    }

    // If there is a session, log who
    console.log('documentCreateSendFeature:', 'Username',req.session.gc2UserName,'ParentDB:',req.session.parentDb,'Expires:', req.session.cookie._expires);

    console.log(req.session)

    // Guard against session with wrong parentdb (vmr)
    if (req.session.parentDb != 'vmr') {
      return response.status(500).send( session_error_message );
    }


    // check if addresscase is already created
    const qrystr =
      "SELECT adrfileid, parenttype, dnadrid FROM " +
      req.body.schema +
      ".adressesager WHERE adresseguid = '" +
      req.body.features[0].properties.adgangsadresseid +
      "'";

    //const qrystr = 'INSERT INTO vmr.adressesager (adrfileid, adresseguid) VALUES (108896,\'0a3f50c1-0523-32b8-e044-0003ba298018\')'
    var getExistinAdrCaseGc2Promise = ReqToGC2(
      req.session,
      qrystr,
      req.body.db
    );

    var dnTitle = oisAddressFormatter(req.body.features[0].properties.adresse);

    //Check for existing cases if so use existing parentid
    getExistinAdrCaseGc2Promise.then(
      function (resultExistingAdrCase) {
        //console.log(resultExistingAdrCase)
        //console.log(resultExistingAdrCase.features)

        // check if addresscase is already created
        if (resultExistingAdrCase.features && resultExistingAdrCase.features.length > 0) {
          console.log('Adressesag eksisterer allerede, bruger eksisterende.')
          // adressesagen er oprettet i DN så skal der bare oprettes henvendelsessager under denne
          //
          // body json for Case
          bodyreq = makeRequestCaseBody(
            req,
            resultExistingAdrCase.features[0].properties.adrfileid,
            REQCASETYPEID,
            dnTitle,
            resultExistingAdrCase.features[0].properties.parenttype
          );

          var postReqCaseToDnPromise = postCaseToDn(bodyreq);
          postReqCaseToDnPromise.then(
            function (result) {
              //console.log(result)
              if ("caseId" in result) {
                //console.log(result)
                //response.send('Sag oprettet i DN')
                req.body.features[0].properties.fileident = result.caseId;
                req.body.features[0].properties.casenumber = result.number;
                var postCaseToGc2Promise = postToGC2(req, req.body.db);
                var resultjson = {
                  message: "Sag oprettet",
                  casenumber: result.number,
                };

                // tilføj part, bruger tidligere partid, hvis det findes
                //partbody = makePartBodyHenvendelse(result.caseId,req.body.features[0].properties.adresseid)
                // brug adgangsadresse hvis parent er adgangsadressesag ellers brug enhedsadress
                //                    if (resultExistingAdrCase.features[0].properties.parentType == 3){
                if (resultExistingAdrCase.features[0].properties.dnadrid) {
                  partbody = makePartBodyHenvendelse(
                    result.caseId,
                    resultExistingAdrCase.features[0].properties.dnadrid
                  );
                  putPartToCaseDn(partbody, result.caseId);
                } else {
                  addPartRequestCase(
                    result.caseId,
                    req.body.features[0].properties.adresseid
                  );
                }
                //                   } else{
                //                       addPartRequestCase(result.caseId,req.body.features[0].properties.adresseid)
                //                   }

                postCaseToGc2Promise.then(
                  function (result) {
                    //console.log(result)
                    response.status(200).send(resultjson);
                  },
                  function (err) {
                    response.status(500).send("ikke oprettet");
                  }
                );
              } else {
                response.status(500).send(result.message);
              }
            },
            function (err) {
              response.status(500).send("ikke oprettet");
            }
          );
        } else {
          console.log('Adressesag eksisterer ikke, opretter ny.')
          // adressesagen findes ikke, den skal oprettes først.
          // getparentcase på bfenr
          // opret adressesag husk post caseid tilbage til gc2
          // getnodeid på henvendelsesmappen
          // opret henvendelsessagen herunder.
          
          // Deprecated case from ESR - has now moved to BFE-structure
          //var getParentCaseDnPromise = getParentCaseDnESR(
          //  req.body.features[0].properties.esrnr,
          //);


          // When they want to change to BFE use this instead
          var getParentCaseDnPromise = getParentCaseDnBFE(
            req.body.features[0].properties.bfenr,
          );


          getParentCaseDnPromise.then(
            function (result) {
              //console.log(result)
              parentid = result.parentId;
              parenttype = result.parentType;
              ejdCaseId = result.caseId;

              //parentIdType = GetParentFolder(ejdCaseId, parentid, parenttype, dnTitle, req.body.features[0].properties.esrnr, req.body.features[0].properties.adresseid);
              var getParentFolderPromise = GetParentFolder(
                ejdCaseId,
                parentid,
                parenttype,
                dnTitle,
                req.body.features[0].properties.bfenr,
                req.body.features[0].properties.adresseid,
                req.body.features[0].properties.adgangsadresseid
              );

              getParentFolderPromise.then(function (result) {
                bodyreq = makeRequestCaseBody(
                  req,
                  result.parentid,
                  REQCASETYPEID,
                  dnTitle,
                  result.parenttype
                );
                var insertToGc2Promise = SqlInsertToGC2(
                  req.session,
                  "INSERT INTO " +
                    req.body.schema +
                    ".adressesager (adrfileid, parenttype, adresseguid, dnadrid) VALUES (" +
                    result.parentid +
                    ", " +
                    result.parenttype +
                    ", '" +
                    req.body.features[0].properties.adgangsadresseid +
                    "'," +
                    result.adresseid +
                    ")",
                  req.body.db
                );
                // opret adgangsadresseid til brug for seneere opslag.
                insertToGc2Promise.then(
                  function (resultgc2) {
                    //console.log(resultgc2)
                  },
                  function (err) {
                    console.log(err);
                  }
                );
                var postReqCaseToDnPromise = postCaseToDn(bodyreq);
                postReqCaseToDnPromise.then(
                  function (resultpostdn) {
                    if ("caseId" in resultpostdn) {
                      //console.log(resultpostdn)
                      //response.status(200).send('Sag oprettet i DN med journalnummer: ' +result.caseId )
                      req.body.features[0].properties.fileident =
                        resultpostdn.caseId;
                      req.body.features[0].properties.casenumber =
                        resultpostdn.number;
                      var resultjson = {
                        message: "Sag oprettet",
                        casenumber: resultpostdn.number,
                      };

                      // tilføj part
                      //partbody = makePartBodyHenvendelse(result.caseId,req.body.features[0].properties.adresseid)
                      //putPartToCaseDn(partbody,result.caseId)
                      // brug adgangsadresse hvis parent er adgangsadressesag ellers brug enhedsadress
                      if (resultpostdn.parentType == 3) {
                        addPartRequestCase(
                          resultpostdn.caseId,
                          req.body.features[0].properties.adgangsadresseid
                        );
                      } else {
                        if ("adresseid" in result) {
                          partbody = makePartBodyHenvendelse(
                            resultpostdn.caseId,
                            result.adresseid
                          );
                          putPartToCaseDn(partbody, resultpostdn.caseId);
                        } else {
                          addPartRequestCase(
                            resultpostdn.caseId,
                            req.body.features[0].properties.adresseid
                          );
                        }
                      }

                      var postCaseToGc2Promise = postToGC2(req, req.body.db);
                      postCaseToGc2Promise.then(
                        function (result) {
                          //console.log(result)
                          response.status(200).send(resultjson);
                        },
                        function (err) {
                          response.status(500).send("ikke oprettet");
                        }
                      );
                    } else {
                      response.status(500).send("Fejl i Docunote, ingen caseId");
                      console.log(resultpostdn);
                    }
                  },
                  function (err) {
                    response.status(500).send("ikke oprettet " + err);
                  }
                );
              });
              // Promise to create case in Docunote
              /*

*/
            },
            function (err) {
              //console.log(err)
              response
                .status(500)
                .send("Fejl, ejendomssagen eksistere ikke i Docunote " + err);
            }
          );
        }

      },
      function (err) {
        response.status(500).send(err);
      }
    );

    //response.send(req.message)
    //return;
  }
);

function addPartRequestCase(caseId, adrguid) {
  var getAdrIdPromise = getPartId(adrguid);

  Promise.all([getAdrIdPromise]).then(function (values) {
    //console.log(values)
    partbody = makePartBodyHenvendelse(caseId, values[0].companyId);
    putPartToCaseDn(partbody, caseId);
  });
}

// find parent folder for the new address case
// resolves to parent id og parent type (either folder or case)
function GetParentFolder(
  ejdCaseId,
  parentId,
  parenttype,
  dnTitle,
  bfenr,
  enhadrguid,
  adgadrguid
) {
  console.log('GetParentFolder:',ejdCaseId, parentId, parenttype, dnTitle, bfenr, enhadrguid, adgadrguid);
  return new Promise(function (resolve, reject) {
    var getParentPromise = getFoldersDn(parentId, parenttype);

    Promise.all([getParentPromise]).then(function (values) {
      //console.log(values[0])
      parentFolders = values[0];
      var result = { parentid: 0, parenttype: 0 };
      for (i = 0; i < parentFolders.length; i++) {
        if (parentFolders[i].name == dnTitle) {
          // folder with same address
          result.parentid = parentFolders[i].nodeId;
          result.parenttype = parentFolders[i].nodeType;
          break;
        }
      }
      if (parentFolders.length == 2 && result.parentid == 0) {
        if (parentFolders[1].nodeId != ejdCaseId) {
          // now get folders
          result.parentid = parentFolders[1].nodeId;
          result.parenttype = parentFolders[1].nodeType;
        } else {
          result.parentid = parentFolders[0].nodeId;
          result.parenttype = parentFolders[0].nodeType;
        }
      }
      // parentfolder found now search for folder kundehenvendelse
      if (result.parentid > 0) {
        // get parts

        getParentParts = getCaseParts(result.parentid);
        getParentPromise = getFoldersDn(result.parentid, result.parenttype);
        Promise.all([getParentParts, getParentPromise]).then(function (values) {
          for (i = 0; i < values[0].length; i++) {
            // Get adressepart
            if (values[0][i].pickerName == "Adresse") {
              result.adresseid = values[0][i].parts[0].partRecordId;
              //console.log(result)
            }
          }
          for (i = 0; i < values[1].length; i++) {
            // if kundehenvendelser found use this folder as result else remain current result
            if (values[1][i].name == "Kundehenvendelser") {
              result.parentid = values[1][i].nodeId;
              result.parenttype = values[1][i].nodeType;
              //console.log(result)
            }
          }

          resolve(result);
        });
      } else {
        // make adgangsadressesag
        // creates new address case with aws guid as syncid
        bodyaddresscase = makeAddressCase(
          parentId,
          ADRCASETYPEID,
          dnTitle,
          adgadrguid
        );
        var postCaseToDnPromise = postCaseToDn(bodyaddresscase);
        postCaseToDnPromise.then(
          function (values) {
            // if rejected get case by syncid
            result.parentid = values.caseId;
            result.parenttype = NODETYPECASE;
            //Create part to add adressesag
            var createcontactpromise = createAddressPart(
              dnTitle,
              adgadrguid,
              bfenr
            );
            createcontactpromise.then(function (adressbody) {
              var createaddresspromise = postCompanyToDn(adressbody);
              createaddresspromise.then(function (company) {
                addPartsToCase(bfenr, adgadrguid, values.caseId);
                result.adresseid = company.companyId;
                resolve(result);
              });
            });
          },
          function (error) {
            //console.log(error)
            if (
              error.Message ==
              "Duplicate SynchronizeSource SynchronizeIdentifier pair"
            ) {
              var getcasepromise = ReqToDn(
                "https://docunoteapi.vmr.dk/api/v1/Cases/synchronizeSource/24/synchronizeId/" +
                  adgadrguid
              );
              getcasepromise.then(function (casebody) {
                result.parentid = casebody.caseId;
                result.parenttype = NODETYPECASE;
                resolve(result);
              });
            }
          }
        );
      }
    });
  });
  //    parentFolders = getFoldersDn(parentId,parenttype);
}

function createAddressPart(dnTitle, adrguid, ejdnr) {
  return new Promise(function (resolve, reject) {
    var getDawaPromise = GetDawaAddress(adrguid);

    getDawaPromise.then(function (values) {
      var newContact = {
        cvr: "",
        listId: 20,
        synchronizeSource: 10,
        synchronizeIdentifier: adrguid,
        displayName: dnTitle,
        urlAddress:
          "https://webois.lifa.dk/ois/default.aspx?Komnr=" +
          parseInt(values.kommune.kode,10) + // trim leading zeros from komkode
          "&ejdnr=" +
          values.esrejendomsnr,
        customData: {
          row: null,
          oisvejkode: values.vejstykke.kode,
          oisejendomsnr: values.esrejendomsnr,
          oiskommunenr: values.kommune.kode,
          oismatrikelnummer: values.matrikelnr,
          oisejerlav:
            values.jordstykke.ejerlav.navn +
            " (" +
            values.jordstykke.ejerlav.kode +
            ")",
          oisbfenr:ejdnr,
        },
        account: "",
        emails: [],
        phones: [],
        addresses: [
          {
            typeId: 1,
            street: values.vejstykke.navn + " " + values.husnr,
            region: "",
            zip: values.postnummer.nr,
            city: values.postnummer.navn,
            country: "",
            primary: true,
          },
        ],
      };
      resolve(newContact);
    });
  });
}

// get parts
function getCaseParts(caseid) {
  //    {{url}}Cases/17129/parts
  url = "https://docunoteapi.vmr.dk/api/v1/Cases/" + caseid + "/parts";
  partjson = ReqToDn(url);
  return partjson;
}

function addPartsToCase(bfenr, adrguid, caseId) {
  // get ids for bfenr and adrguid
  var getEsrIdPromise = getPartId(bfenr + '-BFE');
  var getAdrIdPromise = getPartId(adrguid);

  //   Promise.all([getEsrIdPromise,getAdrIdPromise]).then(function(values) {
  Promise.all([getEsrIdPromise, getAdrIdPromise]).then(function (values) {
    //console.log(values)
    partbody = makePartBody(caseId, values[0].companyId, values[1].companyId);
    putPartToCaseDn(partbody, caseId);
  });
}

function makeAddressCase(parentid, typeid, title, adgadrguid) {
  var body = {
    title: title,
    parentId: parentid,
    parentType: 2,
    typeId: typeid,
    description: "Adressesag fra Mapcentia",
    synchronizeSource: SYNCSOURCE,
    synchronizeIdentifier: adgadrguid,
    discardingCode: 0,
    status: 1,
  };
  return body;
}

function makePartBody(caseId, partid, adrid) {
  var body = [
    {
      pickerName: "Ejendom",
      parts: [
        {
          recordId: caseId,
          partNodeType: 17,
          partRecordId: partid,
        },
      ],
    },
    {
      pickerName: "Adresse",
      parts: [
        {
          recordId: caseId,
          partNodeType: 17,
          partRecordId: adrid,
        },
      ],
    },
  ];
  return body;
}

function makePartBodyHenvendelse(caseId, adrid) {
  var body = [
    {
      pickerName: "Adresse",
      parts: [
        {
          recordId: caseId,
          partNodeType: 17,
          partRecordId: adrid,
        },
      ],
    },
  ];
  return body;
}

// {{url}}TreeNodes/nodeId/8421/nodeType/2

function makeRequestCaseBody(req, parentid, typeid, title, parentType) {
  var requestdate =
    DAYSSINCE +
    Math.floor(
      Date.parse(req.body.features[0].properties.henvendelsesdato) / MILISECSDAY
    );
  if (req.body.features[0].properties.forsyningstype == "Spildevand") {
    var custdata = {
      forsyningstype: 1,
      vejret: req.body.features[0].properties.vejret,
      haendelsesdato: requestdate,
      tilbagemelding: 2,
    };
  } else {
    var custdata = {
      forsyningstype: 2,
      vejret: req.body.features[0].properties.vejret,
      haendelsesdato: requestdate,
      tilbagemelding: 2,
    };
  }
  var body = {
    title: title,
    parentId: parentid,
    parentType: parentType,
    typeId: typeid,
    description: "Oprettet fra MapCentia",
    synchronizeSource: SYNCSOURCE,
    synchronizeIdentifier: null,
    discardingCode: 0,
    status: STATUSCODE,
    customData: custdata,
  };
  return body;
}

// find ejd. sag
//{{url}}Cases/synchronizeSource/10/synchronizeId/7300008585
// get parent treenode
// {{url}}TreeNodes/nodeId/8426/nodeType/2
// hvis node count = 2 1 adresse

//
function getFoldersDn(caseid, nodetype) {
  var dnoptions = {
    url:
      "https://docunoteapi.vmr.dk/api/v1/TreeNodes/nodeId/" +
      caseid +
      "/nodeType/" +
      nodetype,
    method: "GET",
    headers: {
      applicationKey: APPKEY,
      userKey: USERKEY,
      userName: USERNAME,
    },
  };
  return new Promise(function (resolve, reject) {
    request.get(dnoptions, function (err, res, body) {
      if (!err) {
        //console.log(body)
        //postToGC2(req)
        resolve(JSON.parse(body));
      } else {
        //console.log(err)
        reject(err);
      }
    });
  });
}
//https://dawa.aws.dk/adgangsadresser/0a3f5094-ae76-32b8-e044-0003ba298018
function GetDawaAddress(adrguid) {
  var options = {
    url: "https://dawa.aws.dk/adgangsadresser/" + adrguid,
    method: "GET",
  };
  return new Promise(function (resolve, reject) {
    request.get(options, function (err, res, body) {
      if (!err) {
        //return result as JSON;
        resolve(JSON.parse(body));
      } else {
        //console.log(err)
        reject(err);
      }
    });
  });
}

// format address as in lifaois

function oisAddressFormatter(adrString) {
  //console.log("adrString: " + adrString);
  var adrSplit = adrString.split(",");
  var nr = adrSplit[0].match(/\d+/);
  var padnr = new Array(4 - nr[0].length + 1).join("0") + nr[0];
  return adrSplit[0]
    .replace(nr[0], padnr)
    .concat(" [" + adrSplit[1].trim() + "]");
}

function getParentCaseDnESR(esrnr) {
  var dnoptions = {
    url:
      "https://docunoteapi.vmr.dk/api/v1/Cases/synchronizeSource/10/synchronizeId/" +
      esrnr,
    method: "GET",
    headers: {
      applicationKey: APPKEY,
      userKey: USERKEY,
      userName: USERNAME,
    },
  };

  console.log(dnoptions.url)

  return new Promise(function (resolve, reject) {
    request.get(dnoptions, function (err, res, body) {
      if (!err) {
        //console.log(body)
        //postToGC2(req)
        //return body.parentid;
        resolve(JSON.parse(body));
      } else {
        console.log(err);
        reject(err);
      }
    });
  });
}

  
function getParentCaseDnBFE(bfenr) {
  var dnoptions = {
    url:
      "https://docunoteapi.vmr.dk/api/v1/Cases/synchronizeSource/10/synchronizeId/" +
      bfenr + '-BFE',
    method: "GET",
    headers: {
      applicationKey: APPKEY,
      userKey: USERKEY,
      userName: USERNAME,
    },
  };

  console.log(dnoptions.url)

  return new Promise(function (resolve, reject) {
    request.get(dnoptions, function (err, res, body) {
      if (!err) {
        //console.log(body)
        //postToGC2(req)
        //return body.parentid;
        resolve(JSON.parse(body));
      } else {
        console.log(err);
        reject(err);
      }
    });
  });
}

function getPartId(partsyncid) {
  var options = {
    url:
      "https://docunoteapi.vmr.dk/api/v1/companies/synchronizeSource/10/synchronizeId/" +
      partsyncid,
    method: "GET",
    headers: {
      applicationKey: APPKEY,
      userKey: USERKEY,
      userName: USERNAME,
    },
  };
  // Return new promise
  return new Promise(function (resolve, reject) {
    // Do async job
    request.get(options, function (err, resp, body) {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(body));
      }
    });
  });
}

// post case to gc2
function postToGC2(req, db) {
  if (req.session.subUser) var userstr = req.session.gc2UserName + "@" + db;
  else {
    var userstr = req.session.gc2UserName;
  }
  var postData = JSON.stringify(req.body),
    options = {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Content-Length": Buffer.byteLength(postData),
        "GC2-API-KEY": req.session.gc2ApiKey,
      },
      uri:
        GC2_HOST +
        "/api/v2/feature/" +
        userstr +
        "/" +
        req.body.schema +
        "." +
        req.body.tablename +
        ".the_geom" +
        "/4326",
      body: postData,
      method: "POST",
    };
  return new Promise(function (resolve, reject) {
    request(options, function (err, resp, body) {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(body));
      }
    });
  });
}

// Post case to Docunote API
// Returns json
function postCompanyToDn(compbody) {
  var postData = JSON.stringify(compbody),
    options = {
      method: "POST",
      host: "docunoteapi.vmr.dk",
      path: "/api/v1/Companies",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(postData),
        applicationKey: APPKEY,
        userKey: USERKEY,
        userName: USERNAME,
      },
    };
  return new Promise(function (resolve, reject) {
    var req = https.request(options, function (res) {
      var chunks = [];
      //response.header('content-type', 'text/plain');
      res.on("error", function (e) {
        console.log(e);
        reject(e);
      });
      res.on("data", function (chunk) {
        chunks.push(chunk);
        //console.log('Response: ' + chunk);
      });
      res.on("end", function () {
        var jsfile = new Buffer.concat(chunks);
        //chunks = Buffer.concat(chunks).toString;
        //response.send(jsfile);

        //console.log(JSON.parse(jsfile));
        if ("errorCode" in JSON.parse(jsfile)) {
          //reject(JSON.parse(jsfile))
          reject(JSON.parse(jsfile));
        } else {
          resolve(JSON.parse(jsfile));
        }
      });
    });
    req.write(postData, "utf8");
    req.end();
  });
}

// Post case to Docunote API
// Returns json
function postCaseToDn(casebody) {
  var postData = JSON.stringify(casebody),
    options = {
      method: "POST",
      host: "docunoteapi.vmr.dk",
      path: "/api/v1/Cases",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(postData),
        applicationKey: APPKEY,
        userKey: USERKEY,
        userName: USERNAME,
      },
    };

  if (DONTPOST) {
    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        resolve({ message: "Dont post to DN" });
      }, 2500);
    });
  } else {
    return new Promise(function (resolve, reject) {
      var req = https.request(options, function (res) {
        var chunks = [];
        //response.header('content-type', 'text/plain');
        res.on("error", function (e) {
          console.log(e);
          reject(e);
        });
        res.on("data", function (chunk) {
          chunks.push(chunk);
          //console.log('Response: ' + chunk);
        });
        res.on("end", function () {
          var jsfile = new Buffer.concat(chunks);
          //chunks = Buffer.concat(chunks).toString;
          //response.send(jsfile);

          //console.log(JSON.parse(jsfile))
          if ("ErrorCode" in JSON.parse(jsfile)) {
            reject(JSON.parse(jsfile));
            //resolve(JSON.parse(jsfile));
          } else {
            resolve(JSON.parse(jsfile));
          }
        });
      });
      req.write(postData, "utf8");
      req.end();
    });
  }
}

function putPartToCaseDn(partbody, caseId) {
  var postData = JSON.stringify(partbody),
    options = {
      method: "POST",
      host: "docunoteapi.vmr.dk",
      path: "/api/v1/Cases/" + caseId + "/pickers",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(postData),
        applicationKey: APPKEY,
        userKey: USERKEY,
        userName: USERNAME,
      },
    };
  if (DONTPOST) {
    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        resolve({ message: "Dont post to DN" });
      }, 2500);
    });
  } else {
    return new Promise(function (resolve, reject) {
      var req = https.request(options, function (res) {
        var chunks = [];
        //response.header('content-type', 'text/plain');
        res.on("error", function (e) {
          console.log(e);
          reject(e);
        });
        res.on("data", function (chunk) {
          chunks.push(chunk);
          //console.log('Response: ' + chunk);
        });
        res.on("end", function () {
          var jsfile = new Buffer.concat(chunks);
          //chunks = Buffer.concat(chunks).toString;
          //response.send(jsfile);

          //console.log(JSON.parse(jsfile))
          if ("errorCode" in JSON.parse(jsfile)) {
            reject(JSON.parse(jsfile));
            //resolve(JSON.parse(jsfile));
          } else {
            resolve(JSON.parse(jsfile));
          }
        });
      });
      req.write(postData, "utf8");
      req.end();
    });
  }
}

function ReqToDn(requrl) {
  var options = {
    url: requrl,
    method: "GET",
    headers: {
      applicationKey: APPKEY,
      userKey: USERKEY,
      userName: USERNAME,
    },
  };
  // Return new promise
  return new Promise(function (resolve, reject) {
    // Do async job
    request.get(options, function (err, resp, body) {
      if (err) {
        reject(err);
      } else {
        if (body==""){
          reject("Empty response");
        }
        resolve(JSON.parse(body)); // handle when body is empty
      }
    });
  });
}

function ReqToGC2(session, requrl, db) {
  if (session.subUser) var userstr = session.screenName + "@" + db;
  else {
    var userstr = session.gc2UserName;
  }

  var options = {
    url:
      GC2_HOST +
      "/api/" +
      APIVERSION +
      "/sql/" +
      userstr +
      "?q=" +
      requrl +
      "&key=" +
      session.gc2ApiKey,
    headers: {
      "GC2-API-KEY": session.gc2ApiKey,
    },
  };
  console.log(requrl);
  // Return new promise
  return new Promise(function (resolve, reject) {
    // Do async job
    request.get(options, function (err, resp, body) {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        var result = JSON.parse(body);
        // console.log(result);
        resolve(result);
      }
    });
  });
}

function SqlInsertToGC2(session, requrl, db) {
  if (session.subUser) var userstr = session.screenName + "@" + db;
  else {
    var userstr = session.gc2UserName;
  }
  var options = {
    url:
      GC2_HOST +
      "/api/" +
      APIVERSION +
      "/sql/" +
      userstr +
      "?q=" +
      requrl +
      "&key=" +
      session.gc2ApiKey,
    headers: {
      "GC2-API-KEY": session.gc2ApiKey,
    },
  };
  console.log(requrl);
  // Return new promise
  return new Promise(function (resolve, reject) {
    // Do async job
    request.get(options, function (err, resp, body) {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        //console.log(resp)
        resolve(JSON.parse(body));
      }
    });
  });
}

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
