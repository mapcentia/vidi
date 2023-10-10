/*
 * @author     René Borella <rgb@geopartner.dk>
 * @copyright  2023- Geopartner Landinspektører A/S
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

const express = require("express");
const request = require("request");
const router = express.Router();

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
  return await response.json();
};

function coordsToGeom(coords, srid) {
  // This function takes an array of coordinates and returns a postgis geometry object
  // It is used to convert the coordinates from the query string to a postgis geometry object
  // the array looks like: [[x1,y1],[x2,y2],[x3,y3],[x4,y4],[x1,y1]]

  var geom = "ST_GeomFromText('POLYGON((";
  for (var i = 0; i < coords.length; i++) {
    geom += coords[i][0] + " " + coords[i][1] + ",";
  }
  geom = geom.slice(0, -1);
  geom += "))', " + srid + ")";
  return geom;
}

router.get("/api/datahub/jordstykker", async (req, res, next) => {
  // This endpoint tries to mimics the DAWA endpoint, but uses the datahub instead

  // build the query

  var sql = "SELECT * ";
  sql += "FROM matrikel_datahub.jordstykker ";

  // if polygon and srid is given in query, use it as instersection filter
  if (req.query.polygon && req.query.srid) {
    var coords = JSON.parse(req.query.polygon);
    var srid = req.query.srid;
    sql += "WHERE ST_Intersects(geom, " + coordsToGeom(coords, srid) + ") ";
  }

  sql += "limit 10";

  console.log(sql);

  // Return the result of the query from datahub
  try {
    const result = await queryDatahub(sql);
    res.json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
});

module.exports = router;
