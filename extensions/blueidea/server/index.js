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
  if (req.session.subUser)
    var userstr = req.session.gc2UserName + "@" + req.session.parentDb;
  else {
    var userstr = req.session.gc2UserName;
  }
  return userstr;
};

/**
 * Endpoint for populating foresp. in current schema
 */
router.post(
  "/api/extension/blueidea/LookupAddressesPhoneCount",
  function (req, response) {
    // Header must contain userid
    if (!req.headers.hasOwnProperty("userid")) {
      response.status(401).send("Missing userid");
      return;
    }

    // Guard against missing user
    if (!hasUserSetup(req.params.userid)) {
      response.status(401).send("User not found");
      return;
    }

    response.setHeader("Content-Type", "application/json");
    headers = {
      Authorization: loginToBlueIdea,
    };

    return new Promise(function (resolve, reject) {
      //console.log(q.substring(0, 60))
      fetch(url, options)
        .then((r) => r.json())
        .then((data) => {
          // if message is present, is error
          if (data.hasOwnProperty("message")) {
            console.log(data);
            reject(data);
          } else {
            resolve(data);
          }
        })
        .catch((error) => {
          console.log(error);
          reject(error);
        });
    });
  }
);

router.get("/api/extension/blueidea/:userid", function (req, response) {
  // Guard against missing user
  if (!hasUserSetup(req.params.userid)) {
    response.status(401).send("User not found");
    return;
  }

  response.setHeader("Content-Type", "application/json");

  // Get user from config
  var user = bi.users[req.params.userid];

  returnobj = {
    lukkeliste: user.lukkeliste,
    profileid: user.profileid,
  };

  console.log(returnobj);
  // return user object without username and password
  response.status(200).json(returnobj);
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
        if (error) {
          console.log(error);
        } else {
          response.status(200).json(JSON.parse(body));
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
