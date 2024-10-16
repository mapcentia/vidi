/*
 * @author     René Borella <rgb@geopartner.dk>
 * @copyright  2023- Geopartner Landinspektører A/S
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

const express = require("express");
const request = require("request");
const router = express.Router();
const fetch = require("node-fetch");
const config = require("../config/config.js");
const { trimEnd } = require("lodash");

DATAHUB = {
  host: config.gc2.host,
  user: config.datahub.user,
  key: config.datahub.key,
};

const queryDatahub = async (sql, onlyProperties = false) => {
  var userstr = DATAHUB.user;
  var postData = {
    key: DATAHUB.key,
    q: sql,
    srs: "4326",
  };

  var url = DATAHUB.host + "/api/v2/sql/" + userstr;
  postData = JSON.stringify(postData);
  var options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Length": Buffer.byteLength(postData),
      "GC2-API-KEY": DATAHUB.key,
    },
    body: postData,
  };
  const response = await fetch(url, options);
  let json = await response.json();

  //console.log(json);

  // We something that looks very much like DAWA, so we remove the GC2 wrapper
  let data = {};

  if (!onlyProperties) {
    data = {
      _mem: json.peak_memory_usage,
      _time: json._execution_time,
      _success: json.success,
      _message: json.message,
      _rows: json.features.length ? json.features.length : 0,
      crs: {
        type: "name",
        properties: {
          name: "EPSG:4326",
        },
      },
      type: "FeatureCollection",
      features: json.features,
    };
  } else {
    // only return the properties of each feature
    data = [];
    for (var i = 0; i < json.features.length; i++) {
      data.push(JSON.parse(json.features[i].properties.result));
    }
  }

  return data;
};

function coordsToGeom(coords, srid) {
  // This function takes an array of coordinates and returns a postgis geometry object
  // It is used to convert the coordinates from the query string to a postgis geometry object
  // the array looks like: [[x1,y1],[x2,y2],[x3,y3],[x4,y4],[x1,y1]]

  var geom = "ST_Transform(ST_GeomFromText('POLYGON((";
  var poly = coords[0];

  // For each pair of coordinates, add them to the geometry string
  for (var i = 0; i < poly.length; i++) {
    geom += poly[i][0] + " " + poly[i][1] + ",";
  }
  // remove the last comma
  geom = geom.slice(0, -1);

  // close the polygon
  geom += "))', " + srid + "), 25832)";
  return geom;
}

const jordstykkeQuery = `
  SELECT 
    gid as featureid, 
    matrikelnummer as matrikelnr, 
    ejerlavskode as ejerlavkode, 
    ejerlavsnavn, 
    sognekode, 
    sognenavn, 
    kommunekode, 
    kommunenavn, 
    registreretareal, 
    vejareal, 
    regionskode,
    samletfastejendomlokalid as bfenummer, 
    the_geom 
  FROM 
    matrikel_datahub.vw_jordstykke
`;

const queryJordstykker = async (req, res, next) => {
  // This endpoint tries to mimics the DAWA endpoint, but uses the datahub instead

  // build the query
  var sql = jordstykkeQuery;

  // Get the method from the request
  var method = req.method;

  //place parameters in a common variable
  var parameters;
  if (method == "GET") {
    parameters = req.query;
  } else {
    parameters = req.body;
  }

  //console.log(parameters);

  // if polygon and srid is given in query, use it as instersection filter
  if (parameters.polygon && parameters.srid) {
    var coords = JSON.parse(parameters.polygon);
    var srid = parameters.srid;
    sql +=
      " WHERE ST_Intersects(the_geom, " + coordsToGeom(coords, srid) + ") ";
  }

  // if bfenr is given in query, use it as filter
  if (parameters.bfenummer) {
    sql += " WHERE samletfastejendomlokalid = '" + parameters.bfenummer + "'";
  }

  // if x and y is given in query, use it as instersection filter
  if (parameters.x && parameters.y && parameters.srid) {
    sql +=
      " WHERE ST_Contains(the_geom, ST_Transform(ST_GeomFromText('POINT(" +
      parameters.x +
      " " +
      parameters.y +
      ")', " +
      parameters.srid +
      "), 25832)) ";
  }

  // if wkb is given in query, use it as instersection filter. in this case, the srid is contained in the wkb
  if (parameters.wkb) {
    sql +=
      " WHERE ST_Intersects(the_geom, ST_GeomFromWKB('" +
      parameters.wkb +
      "')) ";
  }

  // Return the result of the query from datahub
  try {
    const result = await queryDatahub(sql);

    // if no result, or result.success is false, return error
    if (!result || !result._success) {
      return res.status(500).json({ error: result._message, q: sql });
    }
    res.json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
};

const queryJordstykkeByMatrAndElav = async (req, res, next) => {
  // This endpoint tries to mimics the DAWA endpoint with matr and ejerlavkode, but uses the datahub instead

  // build the query
  var sql = jordstykkeQuery;

  //console.log(req.params);

  // Get the path parameters from the request
  var matr = req.params.matr;
  var ejerlavkode = req.params.ejerlavkode;

  // if matr and ejerlavkode is given in path, use it as filter
  if (matr && ejerlavkode) {
    sql +=
      " WHERE matrikelnummer = '" +
      matr +
      "' AND ejerlavskode = " +
      ejerlavkode +
      " ";
  }

  // Return the result of the query from datahub
  try {
    const result = await queryDatahub(sql);

    // if no result, or result.success is false, return error
    if (!result || !result._success) {
      return res.status(500).json({ error: result._message, q: sql });
    }
    res.json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
};

const autocompleteSpoofer = async (req, res, next) => {
  // we anticipate a service, and a search term in the q parameter. there might be a paramter per_side for number of results
  
  const handleTerm = (term) => {
    // if term is empty, return an empty string
    if (!term) {
      return "";
    }

    // remove trailing space
    let t = term.trimEnd();
    // make sure the term is valid for tsquery. when there is a space interpret it as an AND
    t = t.replace(/ /g, " & ") + ":*";
    return t;
  }

  var service = req.params.service;
  var term = handleTerm(req.query.q); 
  var limit = req.query.per_side ? req.query.per_side : 10;
  var bfenummer = req.query.bfenummer;

  // guard against bfenummer existing as not a number
  if (bfenummer && isNaN(bfenummer)) {
    return res.json([]);
  }
  
  // handle jordstykke autocomplete
  if (service == "jordstykker") {
    var sql = "SELECT result from api.mw_jordstykke_autocomplete";

    // search by term, if term is given
    if (term) {
      sql += " WHERE tsvector_matr @@ to_tsquery('" + term + "')";
    }
    // search by bfenummer, if bfenummer is given and term is not
    else if (bfenummer) {
      sql += " WHERE tsvector_bfe like '" + bfenummer + "%'";
    }
  } else if (service == "adresser") {
    // handle adresse autocomplete
    var sql = "SELECT result from api.mw_adresse_autocomplete";

    // search by term, if term is given
    if (term) {
      sql += " WHERE tsvector_adr @@ to_tsquery('" + term + "')";
    }
  } else {
    return res.status(500).json({ error: "Service not found" });
  }

  // Add limit to the query
  sql += " LIMIT " + limit;

  // Return the result of the query from datahub
  try {
    console.log(sql);
    const result = await queryDatahub(sql, true);

    res.json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
};

router.get("/api/datahub/jordstykker", queryJordstykker);
router.post("/api/datahub/jordstykker", queryJordstykker);

router.get("/api/datahub/:service/autocomplete", autocompleteSpoofer);

router.get(
  "/api/datahub/jordstykker/:ejerlavkode/:matr",
  queryJordstykkeByMatrAndElav
);

module.exports = router;
