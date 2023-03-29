var express = require("express");
var request = require("request");
var router = express.Router();
var http = require("http");
var https = require("https");
var moment = require("moment");
var config = require("../../../config/config.js");
var he = require("he");
var fetch = require("node-fetch");
var bi = require("../../../config/gp/config.blueidea");
const { post } = require("request");
const { reject } = require("underscore");

/**
 *
 * @type {string}
 */
// GC2_HOST = (GC2_HOST.split("http://").length > 1 ? GC2_HOST.split("http://")[1] : GC2_HOST);
// Hardcoded host - config has internal name in docker-compose
GC2_HOST = "https://mapgogc2.geopartner.dk";

// Set locale for date/time string
moment.locale("da_DK");

var BACKEND = config.backend;

var TABLEPREFIX = "blueidea_";

// Days from 19000101 to 19700101
const DAYSSINCE = 25569;
// milisecs pr. day
const MILISECSDAY = 86400000;

var userString = function (req) {
  var userstr = "";
  if (req.session.subUser) {
    var userstr = req.session.gc2UserName + "@" + req.session.parentDb;
    userstr = req.session.gc2UserName + "@test_" + req.session.parentDb; // test overrride
  }  else {
    var userstr = req.session.gc2UserName;
  }
  return userstr;
};

router.get("/api/extension/blueidea/:userid", function (req, response) {
  // Guard against missing user
  if (!hasUserSetup(req.params.userid)) {
    response.status(401).send("User not found");
    return;
  }

  // guard against missing session (not logged in to GC2)
  if (!req.session.hasOwnProperty("gc2SessionId")) {
    response
      .status(401)
      .send("No active session - please login in the vidi application");
    return;
  }

  response.setHeader("Content-Type", "application/json");

  // Get user from config
  var user = bi.users[req.params.userid];

  returnobj = {
    profileid: user.profileid ? user.profileid : null,
    lukkeliste: user.lukkeliste ? user.lukkeliste : false,
    ventil_layer: user.ventil_layer ? user.ventil_layer : null,
    ventil_layer_key: user.ventil_layer_key ? user.ventil_layer_key : null,
    udpeg_layer: user.udpeg_layer ? user.udpeg_layer : null,
  };

  // Check if the database is correctly setup, and the session is allowed to access it
  let validate = [
    SQLAPI("select * from lukkeliste.beregn_ventiler limit 1", req),
    SQLAPI("select * from lukkeliste.beregn_afskaaretmatrikler limit 1", req),
  ]
  Promise.all(validate).then((res) => {
    returnobj.db = true
  }).catch((err) => {
    returnobj.db = false
  })
  .finally(() => {
    response.status(200).json(returnobj);
  })
});

router.get(
  "/api/extension/blueidea/:userid/GetSmSTemplates/",
  function (req, response) {
    // Guard against missing parameters or user
    if (
      !req.params.hasOwnProperty("userid") ||
      !hasUserSetup(req.params.userid)
    ) {
      response.status(401).send("Missing parameters");
      return;
    }

    // guard against missing session (not logged in to GC2)
    if (!req.session.hasOwnProperty("gc2SessionId")) {
      response
        .status(401)
        .send("No active session - please login in the vidi application");
      return;
    }

    //Get user from config
    var user = bi.users[req.params.userid];

    //guard against missing profileid
    if (!user.hasOwnProperty("profileid")) {
      response.status(401).send("Missing profileid in configuration");
      return;
    }

    loginToBlueIdea(req.params.userid).then((token) => {
      var options = {
        uri: bi.hostname + "/Template/GetSmsTemplates/",
        headers: {
          Authorization: "Bearer " + token,
          Accept: "application/json",
        },
        data: {
          profileId: user.profileid,
        },
      };
      request.get(options, function (error, res, body) {
        console.debug(res.toJSON());
        if (error) {
          response.status(500).json(error);
        } else {
          response.status(200).json(JSON.parse(body));
        }
      });
    });
  }
);

router.post(
  "/api/extension/blueidea/:userid/CreateMessage",
  function (req, response) {
    // guard against missing user
    if (!hasUserSetup(req.params.userid)) {
      response.status(401).send("User not found");
      return;
    }

    // guard against missing session (not logged in to GC2)
    if (!req.session.hasOwnProperty("gc2SessionId")) {
      response
        .status(401)
        .send("No active session - please login in the vidi application");
      return;
    }

    // body must contain an array called addresses, with objects that only contain a kvhx attribute
    if (!req.body.hasOwnProperty("addresses")) {
      response.status(401).send("Missing addresses");
      return;
    }

    var body = req.body;

    // If debug is set, add testMode to body
    if (bi.debug) {
      body.testMode = true;
    }

    // We only use known addresses, so toggle this
    body.sendToSpecificAddresses = true;

    loginToBlueIdea(req.params.userid).then((token) => {
      var options = {
        uri: bi.hostname + "/Message/Create",
        headers: {
          Authorization: "Bearer " + token,
          Accept: "application/json",
        },
        json: body,
      };
      request.post(options, function (error, res, body) {
        console.debug(res.toJSON());
        if (error) {
          response.status(500).json(error);
        } else {
          response.status(200).json({ smsGroupId: body });
        }
      });
    });
  }
);

// Use SQLAPI
function SQLAPI(q, req) {
  console.log(GC2_HOST);
  var userstr = userString(req);
  var postData = JSON.stringify({
    key: req.session.gc2ApiKey,
    q: q,
  });
  var url = GC2_HOST + "/api/v2/sql/" + userstr;
  console.log(url)
  var options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Length": Buffer.byteLength(postData),
      "GC2-API-KEY": req.session.gc2ApiKey,
    },
    body: postData,
  };
  //console.log(q)

  // Return new promise
  return new Promise(function (resolve, reject) {
    //console.log(q.substring(0,175))
    fetch(url, options)
      .then((r) => r.json())
      .then((data) => {
        // if message is present, is error
        if (data.hasOwnProperty("message")) {
          console.log(data);
          reject(data);
        } else {
          //console.log('Success: '+ data.success+' - Q: '+q.substring(0,60))
          resolve(data);
        }
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });
}

//Guard for non-existing user
function hasUserSetup(uuid) {
  // check if uuid in in config, and if user object has username and password
  if (
    bi.users.hasOwnProperty(uuid) &&
    bi.users[uuid].hasOwnProperty("username") &&
    bi.users[uuid].hasOwnProperty("password")
  ) {
    return true;
  } else {
    return false;
  }
}

// Login to Blueidea to get token
function loginToBlueIdea(uuid) {
  // guard against missing user
  if (!hasUserSetup(uuid)) {
    reject("User not found");
  }
  var user = bi.users[uuid];
  var options = {
    uri: bi.hostname + "User/Login",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ email: user.username, password: user.password }),
  };

  return new Promise(function (resolve, reject) {
    request.post(options, function (error, res, body) {
      if (error) {
        reject(error);
      } else {
        resolve(JSON.parse(body).accessToken);
      }
    });
  });
}

module.exports = router;
