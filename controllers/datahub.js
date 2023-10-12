/*
 * @author     René Borella <rgb@geopartner.dk>
 * @copyright  2023- Geopartner Landinspektører A/S
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

const express = require("express");
const request = require("request");
const router = express.Router();
const fetch = require("node-fetch");

DATAHUB = {
  host: "https://datahub.geopartner.dk",
  user: "api@grunddata",
  key: "c0d78e089a39d8477d3f5867a30e4ded",
};

const queryDatahub = async (sql, options = null) => {
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

  // We something that looks very much like DAWA, so we remove the GC2 wrapper
  let data = {
    _mem: json.peak_memory_usage,
    _time: json._execution_time,
    _success: json.success,
    _message: json.message,
    _rows: json.features.length,
    crs: {
      type: "name",
      properties: {
        name: "EPSG:4326",
      },
    },
    type: "FeatureCollection",
    features: json.features,
  };

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

router.get("/api/datahub/jordstykker", async (req, res, next) => {
  // This endpoint tries to mimics the DAWA endpoint, but uses the datahub instead

  // build the query

  var sql = "SELECT";

  // Define the fields to return
  sql += " lokalid as featureid";
  sql += ", matrikelnummer as matrikelnr";
  sql += ", ejerlavskode as ejerlavkode";
  sql += ", ejerlavsnavn";
  sql += ", sognekode";
  sql += ", sognenavn";
  sql += ", kommunekode";
  sql += ", kommunenavn";
  sql += ", registreretareal";
  sql += ", vejareal";
  sql += ", regionskode";
  sql += ", the_geom";

  sql += " FROM matrikel_datahub.vw_jordstykke";

  // if polygon and srid is given in query, use it as instersection filter
  if (req.query.polygon && req.query.srid) {
    var coords = JSON.parse(req.query.polygon);
    var srid = req.query.srid;

    sql +=
      " WHERE ST_Intersects(the_geom, " + coordsToGeom(coords, srid) + ") ";
  }

  // Return the result of the query from datahub
  try {
    const result = await queryDatahub(sql);

    // if no result, or result.success is false, return error
    if (!result || !result._success) {
      return res.status(500).json({ error: result._message });
    }
    res.json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
});

module.exports = router;
