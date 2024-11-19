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

// SET GC2 HOST
GC2_HOST = config.gc2.host;

// Set locale for date/time string
moment.locale("da_DK");

var BACKEND = config.backend;

var TABLEPREFIX = "blueidea_";

// Days from 19000101 to 19700101
const DAYSSINCE = 25569;
// milisecs pr. day
const MILISECSDAY = 86400000;

const TIMEOUT = 30000;

/**
 * This function handles basic checks for each request
 * @param req
 * @param response
 */
function guard(req, response) {
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

  // else do nothing
  return;
}

var userString = function (req) {
  var userstr = "";
  if (req.session.subUser) {
    var userstr = req.session.gc2UserName + "@" + req.session.parentDb;
  } else {
    var userstr = req.session.gc2UserName;
  }
  return userstr;
};
// Get current user and setup
router.get("/api/extension/blueidea/:userid", function (req, response) {
  guard(req, response);

  // Get user from config
  var user = bi.users[req.params.userid];

  //console.log(user);

  // guard against missing mandatory properties

  // if blueidea is set, and is true, check for username and password
  if (user.hasOwnProperty("blueidea") && user.blueidea) {
    if (!user.hasOwnProperty("username") || !user.hasOwnProperty("password")) {
      response.status(500).send("Missing username or password");
      return;
    }
  }

  // if check if blueidea and lukke liste is set
  if (!user.hasOwnProperty("blueidea") || !user.hasOwnProperty("lukkeliste")) {
    response.status(500).send("Missing blueidea or lukkeliste");
    return;
  }

  returnobj = {
    profileid: user.profileid ? user.profileid : null,
    lukkeliste: user.lukkeliste ? user.lukkeliste : false,
    alarmkabel: user.alarmkabel ? user.alarmkabel : false,
    blueidea: user.blueidea ? user.blueidea : false,
    ventil_layer: user.ventil_layer ? user.ventil_layer : null,
    ventil_layer_key: user.ventil_layer_key ? user.ventil_layer_key : null,
    udpeg_layer: user.udpeg_layer ? user.udpeg_layer : null,
    ventil_export: user.ventil_export ? user.ventil_export : null,
    debug: user.debug ? user.debug : null,
    alarm_skabe: null,
  };

  // Check if the database is correctly setup, and the session is allowed to access it
  let validate = [
    SQLAPI("select * from lukkeliste.beregn_ventiler limit 1", req),
    SQLAPI("select * from lukkeliste.beregn_afskaaretmatrikler limit 1", req),
    SQLAPI("select * from lukkeliste.beregn_afskaaretnet limit 1", req),
    SQLAPI("select * from lukkeliste.beregnlog limit 1", req),
    SQLAPI("select * from lukkeliste.lukkestatus limit 1", req),
  ];

  // if alarm_skab is set, test and build a list
  if (user.hasOwnProperty("alarm_skab")) {
    let alarm_skab = user.alarm_skab;
    let query = `SELECT ${alarm_skab.key} as value, ${alarm_skab.name} as text, ${alarm_skab.geom} from ${alarm_skab.layer}`;
    validate.push(SQLAPI(query, req, { format: "geojson", srs: 4326 }));
  }

  
  Promise.all(validate)
    .then((res) => {
      returnobj.db = true;
      returnobj.lukkestatus = res[4].features[0].properties;

      // if alarm_skab is set, add to return object
      if (user.hasOwnProperty("alarm_skab")) {
        returnobj.alarm_skabe = res[5].features;
      }
    })
    .catch((err) => {
      returnobj.db = false;
      returnobj.lukkestatus = false;
    })
    .finally(() => {
      response.status(200).json(returnobj);
    });
});

// Get the list of sms templates
router.get(
  "/api/extension/blueidea/:userid/GetSmSTemplates/",
  function (req, response) {
    guard(req, response);

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
        // console.debug(res.toJSON());
        if (error) {
          response.status(500).json(error);
        } else {
          response.status(200).json(JSON.parse(body));
        }
      });
    });
  }
);

// Create message in BlueIdeas system, and return the smsGroupId
router.post(
  "/api/extension/blueidea/:userid/CreateMessage",
  function (req, response) {
    guard(req, response);

    // body must contain an array called addresses, with objects that only contain a kvhx attribute
    if (!req.body.hasOwnProperty("addresses")) {
      response.status(401).send("Missing addresses");
      return;
    }

    var body = req.body;

    // If debug is set, add testMode to body
    if (bi.users[req.params.userid].debug) {
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
        //console.debug(res.toJSON());
        if (error) {
          response.status(500).json(error);
        } else {
          response.status(200).json({ smsGroupId: body });
        }
      });
    });
  }
);

// Query alarmkabel-plugin in database
router.post(
  "/api/extension/alarmkabel/:userid/query",
  function (req, response) {
    guard(req, response);

    // guard against missing lat and lng in body
    if (!req.body.hasOwnProperty("lat") || !req.body.hasOwnProperty("lng")) {
      response.status(401).send("Missing lat or lng");
      return;
    }

    // Guard against no distance
    if (!req.body.hasOwnProperty("distance")) {
      response.status(401).send("Missing distance");
      return;
    }

    // set timeout to 30s
    req.setTimeout(TIMEOUT);

    // create the string we need to query the database
    q = `SELECT lukkeliste.fnc_dan_alarm(ST_Transform(ST_GeomFromEWKT('SRID=4326;Point(${req.body.lng} ${req.body.lat})'),25832)::geometry, ${req.body.distance}, '${req.session.screenName}', '${req.body.direction}')`;

    SQLAPI(q, req)
      .then((uuid) => {
        let beregnuuid = uuid.features[0].properties.fnc_dan_alarm;
        let promises = [];

        console.log(q, " -> ", beregnuuid);

        // get points
        promises.push(
          SQLAPI(
            `SELECT * from lukkeliste.vw_alarmpkt where beregnuuid = '${beregnuuid}'`,
            req,
            { format: "geojson", srs: 4326 }
          )
        );

        // get log
        promises.push(
          SQLAPI(
            `SELECT * from lukkeliste.beregnlog where beregnuuid = '${beregnuuid}'`,
            req,
            { format: "geojson", srs: 4326 }
          )
        );

        // when promises are complete, return the result
        Promise.all(promises)
          .then((res) => {
            response.status(200).json({
              alarm: res[0],
              log: res[1],
            });
          })
          .catch((err) => {
            console.error(err);
            response.status(500).json(err);
          });
      })
      .catch((err) => {
        console.error(err);
        response.status(500).json(err);
      });
  }
);

// Query alarmkabel-plugin in database
router.post(
  "/api/extension/alarmskab/:userid/query",
  function (req, response) {
    guard(req, response);

    // guard against missing lat and lng in body
    if (!req.body.hasOwnProperty("lat") || !req.body.hasOwnProperty("lng")) {
      response.status(401).send("Missing lat or lng");
      return;
    }

    // guard against missing alarmskab
    if (!req.body.hasOwnProperty("alarmskab")) {
      response.status(401).send("Missing alarmskab id");
      return;
    }

    // set timeout to 30s
    req.setTimeout(TIMEOUT);

    // create the string we need to query the database
    q = `SELECT lukkeliste.fnc_beregn_afstand_alarmnet('${req.body.alarmskab}'::int, ST_Transform(ST_GeomFromEWKT('SRID=4326;Point(${req.body.lng} ${req.body.lat})'),25832)::geometry, '${req.body.direction}', '${req.session.screenName}')`;
    console.log(q);
    SQLAPI(q, req)
      .then((uuid) => {
        let beregnuuid = uuid.features[0].properties.fnc_beregn_afstand_alarmnet;
        let promises = [];

        console.log(q, " -> ", beregnuuid);

        // get points
        promises.push(
          SQLAPI(
            `SELECT * from lukkeliste.vw_alarm_afstand where beregnuuid = '${beregnuuid}'`,
            req,
            { format: "geojson", srs: 4326 }
          )
        );

        // get log
        promises.push(
          SQLAPI(
            `SELECT * from lukkeliste.beregnlog where beregnuuid = '${beregnuuid}'`,
            req,
            { format: "geojson", srs: 4326 }
          )
        );

        // when promises are complete, return the result
        Promise.all(promises)
          .then((res) => {
            response.status(200).json({
              alarm: res[0],
              log: res[1],
            });
          })
          .catch((err) => {
            console.error(err);
            response.status(500).json(err);
          });
      })
      .catch((err) => {
        console.error(err);
        response.status(500).json(err);
      });
  }
);

// Query lukkeliste-plugin in database
router.post(
  "/api/extension/lukkeliste/:userid/query",
  function (req, response) {
    guard(req, response);

    // guard against missing lat and lng in body
    if (!req.body.hasOwnProperty("lat") || !req.body.hasOwnProperty("lng")) {
      response.status(401).send("Missing lat or lng");
      return;
    }

    // set timeout to 30s
    req.setTimeout(TIMEOUT);

    // create the string we need to query the database
    q = `SELECT lukkeliste.fnc_dan_lukkeliste(ST_Transform(ST_GeomFromEWKT('SRID=4326;Point(${req.body.lng} ${req.body.lat})'),25832)::geometry, false, '${req.session.screenName}')`;

    SQLAPI(q, req)
      .then((uuid) => {
        let beregnuuid = uuid.features[0].properties.fnc_dan_lukkeliste;
        let promises = [];

        console.log(q, " -> ", beregnuuid);

        // if ventil_layer is set, query the database for the ventiler
        if (bi.users[req.params.userid].ventil_layer) {
          let q = `SELECT * from lukkeliste.beregn_ventiler where beregnuuid = '${beregnuuid}'`;

          q = `SELECT v.*, bv.forbundet from lukkeliste.vw_beregn_ventiler bv 
          join ${
            bi.users[req.params.userid].ventil_layer
          } v on bv.ventilgid = v.${
            bi.users[req.params.userid].ventil_layer_key
          }
          where bv.beregnuuid = '${beregnuuid}'`;

          promises.push(SQLAPI(q, req, { format: "geojson", srs: 4326 }));
        } else {
          // we need a promise to return, to keep ordering, so we create a dummy promise
          promises.push(
            new Promise((resolve, reject) => {
              resolve(null);
            })
          );
        }

        // get matrikler as a multipoint, to run as few queries as possible - make sure the geometry is returned as WKB::text
        promises.push(
          SQLAPI(
            `SELECT 
                gid,
                funktion,
                parameter,
                beregnuuid,
                start,
                status,
                username,
                the_geom,
                "end",
                duration,
                matr_count,
                null as aggregated_geom
            FROM lukkeliste.vw_beregn_result 
            WHERE beregnuuid = '${beregnuuid}'
            UNION ALL
            SELECT 
                null,
                null,
                null,
                beregnuuid,
                null,
                null,
                null,
                ST_GeomFromEWKB(ledn_aggregated_geom::bytea) AS the_geom,
                null,
                null,
                null,
              null
            FROM lukkeliste.vw_beregn_result 
            WHERE beregnuuid = '${beregnuuid}'
            UNION ALL
            SELECT 
                null,
                null,
                null,
                beregnuuid,
                null,
                null,
                null,
                the_geom,
                null,
                null,
                matr_count as count,
                matr_aggregated_geom::text
            FROM lukkeliste.vw_beregn_result 
            WHERE beregnuuid = '${beregnuuid}'`,
            req,
            { format: "geojson", srs: 4326 }
          )
        );

        // when promises are complete, return the result
        Promise.all(promises)
          .then((res) => {
            // here we need to split the result of the second promise into multiple featurecollections
            let matrikler = { type: "FeatureCollection", features: [res[1].features[2]] }
            let ledninger = { type: "FeatureCollection", features: [res[1].features[1]] }
            // keep only the first feature in the list from the second promise
            res[1].features = [res[1].features[0]]

            response.status(200).json({
              ventiler: res[0],
              matrikler: matrikler,
              ledninger: ledninger,
              log: res[1],
            });
          })
          .catch((err) => {
            console.error(err);
            response.status(500).json(err);
          });
      })
      .catch((err) => {
        console.error(err);
        response.status(500).json(err);
      });
  }
);

// Use SQLAPI
function SQLAPI(q, req, options = null) {
  var userstr = userString(req);
  var postData = {
    key: req.session.gc2ApiKey,
    q: q,
  };

  // if options is set, merge with postData
  if (options) {
    postData = Object.assign({}, postData, options);
  }

  var url = GC2_HOST + "/api/v2/sql/" + userstr;
  postData = JSON.stringify(postData);
  var options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Length": Buffer.byteLength(postData),
      "GC2-API-KEY": req.session.gc2ApiKey,
    },
    body: postData,
  };

  // Return new promise
  return new Promise(function (resolve, reject) {
    //console.log(q.substring(0,175))
    fetch(url, options)
      .then((r) => r.json())
      .then((data) => {
        // if message is present, is error
        if (data.hasOwnProperty("message")) {
          //console.log(data);
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

// Check if user has setup username and password
function hasUserSetup(uuid) {
  // check if uuid in in config, and if user object has username and password
  if (bi.users.hasOwnProperty(uuid)) {
    // if blueidea is set, and is true, check for username and password
    if (bi.users[uuid].hasOwnProperty("blueidea") && bi.users[uuid].blueidea) {
      if (
        !bi.users[uuid].hasOwnProperty("username") ||
        !bi.users[uuid].hasOwnProperty("password")
      ) {
        return false;
      }
    }
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
