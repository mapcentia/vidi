var express = require('express');
var router = express.Router();
var http = require('http');
var config = require('../../../config/config.js').gc2;


router.post('/api/extension/cowiDetail/:db', function (req, response) {
    var db = req.params.db, wkt = JSON.parse(req.body.q), srs = req.body.srs, lifetime = req.body.lifetime, client_encoding = req.body.client_encoding, url, data = [], jsfile = "", sql;

    //console.log(wkt)

    if (wkt.length > 1) {
        sql = "SELECT '500' as radius, sum(pers_2016)::INTEGER AS antal, ST_ConvexHull(ST_Collect(the_geom)) AS the_geom FROM detail.dkn_befolkning_og_arbejdspladser WHERE ST_intersects(the_geom, ST_transform(ST_geomfromtext('" + wkt[0] + "',4326),25832))" +
            "UNION SELECT '1000' as radius, sum(pers_2016)::INTEGER AS antal, ST_ConvexHull(ST_Collect(the_geom)) AS the_geom FROM detail.dkn_befolkning_og_arbejdspladser WHERE ST_intersects(the_geom, ST_transform(ST_geomfromtext('" + wkt[1] + "',4326),25832))";

        sql = "SELECT " +
            "'500'                      AS radius, " +
            "sum(pers_2016) :: INTEGER  AS antal, " +
            "sum(pers_2016) * (SELECT fb_total " +
            "FROM detail.forbrugstal_kommuner " +
            "WHERE komkode = (SELECT komkode " +
            "FROM detail.kommune " +
            "WHERE ST_intersects(the_geom, ST_transform(ST_geomfromtext( " +
            "'" + wkt[0] + "', 4326), 25832))) " +
            "LIMIT 1):: INTEGER AS fb " +
            "FROM detail.dkn_befolkning_og_arbejdspladser " +
            " WHERE ST_intersects(the_geom, ST_transform(ST_geomfromtext( " +
            "'" + wkt[0] + "', 4326), 25832)) " +

            "UNION " +

            "SELECT " +
            "'1000'                     AS radius, " +
            "sum(pers_2016) :: INTEGER  AS antal, " +
            "sum(pers_2016) * (SELECT fb_total " +
            "FROM detail.forbrugstal_kommuner " +
            "WHERE komkode = (SELECT komkode " +
            "FROM detail.kommune " +
            "WHERE ST_intersects(the_geom, ST_transform(ST_geomfromtext( " +
            "'" + wkt[1] + "', 4326), 25832))) " +
            "LIMIT 1):: INTEGER AS fb " +
            "FROM detail.dkn_befolkning_og_arbejdspladser " +
            "WHERE ST_intersects(the_geom, ST_transform(ST_geomfromtext( " +
            "'" + wkt[1] + "', 4326), 25832))";

    } else {
        sql = "SELECT " +
            "sum(pers_2016) :: INTEGER  AS antal, " +
            "sum(pers_2016) * (SELECT fb_total " +
            "FROM detail.forbrugstal_kommuner " +
            "WHERE komkode = (SELECT komkode " +
            "FROM detail.kommune " +
            "WHERE ST_intersects(the_geom, ST_transform(ST_geomfromtext( " +
            "'" + wkt[0] + "', 4326), 25832))) " +

            "LIMIT 1) AS fb " +
            "FROM detail.dkn_befolkning_og_arbejdspladser " +
            "WHERE ST_intersects(the_geom, ST_transform(ST_geomfromtext( " +
            "'" + wkt[0] + "', 4326), 25832))";
    }

    url = config.host + "/api/v1/sql/" + db + "?q=" + sql + "&srs=" + srs + "&lifetime=" + lifetime + "&client_encoding=" + client_encoding + "&key=ce5ab76892183d8b68c0486f724b011d";
    console.log(sql);
    http.get(url, function (res) {
        if (res.statusCode != 200) {
            response.header('content-type', 'application/json');
            response.status(res.statusCode).send({
                success: false,
                message: "Could not get the sql data."
            });
            return;
        }
        var chunks = [];
        response.header('content-type', 'application/json');
        res.on('data', function (chunk) {
            chunks.push(chunk);
        });
        res.on("end", function () {
            jsfile = new Buffer.concat(chunks);
            response.send(jsfile);
        });
    }).on("error", function (err) {
        console.log(err);
    });
});
module.exports = router;