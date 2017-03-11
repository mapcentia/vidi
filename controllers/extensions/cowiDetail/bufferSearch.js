var express = require('express');
var router = express.Router();
var http = require('http');
var config = require('../../../config/config.js').gc2;


router.post('/api/extension/cowiDetail/:db', function (req, response) {
    var db = req.params.db, wkt = JSON.parse(req.body.q), srs = req.body.srs, lifetime = req.body.lifetime, client_encoding = req.body.client_encoding, url, data = [], jsfile = "", sql;

    //console.log(wkt)

    if (wkt.length > 1) {

        sql = "SELECT " +
            "'500'                      AS radius, " +
            "sum(pers_2016) :: INTEGER  AS antal, " +

            "sum(pers_2016) * (SELECT fb_total " +
            "FROM detail.forbrugstal_kommuner " +
            "WHERE komkode = (SELECT komkode " +
            "FROM detail.kommune " +
            "WHERE ST_intersects(the_geom, ST_transform(ST_geomfromtext( " +
            "'" + wkt[0] + "', 4326), 25832)) LIMIT 1) " +
            "LIMIT 1):: INTEGER AS fb_total, " +

            "sum(pers_2016) * (SELECT fb_dagligv " +
            "FROM detail.forbrugstal_kommuner " +
            "WHERE komkode = (SELECT komkode " +
            "FROM detail.kommune " +
            "WHERE ST_intersects(the_geom, ST_transform(ST_geomfromtext( " +
            "'" + wkt[0] + "', 4326), 25832)) LIMIT 1) " +
            "LIMIT 1):: INTEGER AS fb_dagligv, " +

            "sum(pers_2016) * (SELECT fb_beklaed " +
            "FROM detail.forbrugstal_kommuner " +
            "WHERE komkode = (SELECT komkode " +
            "FROM detail.kommune " +
            "WHERE ST_intersects(the_geom, ST_transform(ST_geomfromtext( " +
            "'" + wkt[0] + "', 4326), 25832)) LIMIT 1) " +
            "LIMIT 1):: INTEGER AS fb_beklaed, " +

            "sum(pers_2016) * (SELECT fb_oevrige " +
            "FROM detail.forbrugstal_kommuner " +
            "WHERE komkode = (SELECT komkode " +
            "FROM detail.kommune " +
            "WHERE ST_intersects(the_geom, ST_transform(ST_geomfromtext( " +
            "'" + wkt[0] + "', 4326), 25832)) LIMIT 1) " +
            "LIMIT 1):: INTEGER AS fb_oevrige " +

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
            "'" + wkt[1] + "', 4326), 25832)) LIMIT 1) " +
            "LIMIT 1):: INTEGER AS fb_total, " +

            "sum(pers_2016) * (SELECT fb_dagligv " +
            "FROM detail.forbrugstal_kommuner " +
            "WHERE komkode = (SELECT komkode " +
            "FROM detail.kommune " +
            "WHERE ST_intersects(the_geom, ST_transform(ST_geomfromtext( " +
            "'" + wkt[1] + "', 4326), 25832)) LIMIT 1) " +
            "LIMIT 1):: INTEGER AS fb_dagligv, " +

            "sum(pers_2016) * (SELECT fb_beklaed " +
            "FROM detail.forbrugstal_kommuner " +
            "WHERE komkode = (SELECT komkode " +
            "FROM detail.kommune " +
            "WHERE ST_intersects(the_geom, ST_transform(ST_geomfromtext( " +
            "'" + wkt[1] + "', 4326), 25832)) LIMIT 1) " +
            "LIMIT 1):: INTEGER AS fb_beklaed, " +

            "sum(pers_2016) * (SELECT fb_oevrige " +
            "FROM detail.forbrugstal_kommuner " +
            "WHERE komkode = (SELECT komkode " +
            "FROM detail.kommune " +
            "WHERE ST_intersects(the_geom, ST_transform(ST_geomfromtext( " +
            "'" + wkt[1] + "', 4326), 25832)) LIMIT 1) " +
            "LIMIT 1):: INTEGER AS fb_oevrige " +

            "FROM detail.dkn_befolkning_og_arbejdspladser " +
            "WHERE ST_intersects(the_geom, ST_transform(ST_geomfromtext( " +
            "'" + wkt[1] + "', 4326), 25832))";

    } else {
        sql = "SELECT " +
            "sum(pers_2016) :: INTEGER  AS antal, " +

            "sum(pers_2016) * (SELECT fb_total " +
            "FROM detail.forbrugstal_kommuner " +
            "WHERE komkode=(SELECT komkode " +
            "FROM detail.kommune " +
            "WHERE ST_intersects(the_geom, ST_transform(ST_geomfromtext( " +
            "'" + wkt[0] + "', 4326), 25832)) LIMIT 1) " +
            "LIMIT 1) AS fb_total, " +

            "sum(pers_2016) * (SELECT fb_dagligv " +
            "FROM detail.forbrugstal_kommuner " +
            "WHERE komkode=(SELECT komkode " +
            "FROM detail.kommune " +
            "WHERE ST_intersects(the_geom, ST_transform(ST_geomfromtext( " +
            "'" + wkt[0] + "', 4326), 25832)) LIMIT 1) " +
            "LIMIT 1) AS fb_dagligv, " +

            "sum(pers_2016) * (SELECT fb_beklaed " +
            "FROM detail.forbrugstal_kommuner " +
            "WHERE komkode=(SELECT komkode " +
            "FROM detail.kommune " +
            "WHERE ST_intersects(the_geom, ST_transform(ST_geomfromtext( " +
            "'" + wkt[0] + "', 4326), 25832)) LIMIT 1) " +
            "LIMIT 1) AS fb_beklaed, " +

            "sum(pers_2016) * (SELECT fb_oevrige " +
            "FROM detail.forbrugstal_kommuner " +
            "WHERE komkode=(SELECT komkode " +
            "FROM detail.kommune " +
            "WHERE ST_intersects(the_geom, ST_transform(ST_geomfromtext( " +
            "'" + wkt[0] + "', 4326), 25832)) LIMIT 1) " +
            "LIMIT 1) AS fb_oevrige " +
                

            "FROM detail.dkn_befolkning_og_arbejdspladser " +
            "WHERE ST_intersects(the_geom, ST_transform(ST_geomfromtext( " +
            "'" + wkt[0] + "', 4326), 25832))";
    }


    //url = config.host + "/api/v1/sql/" + db + "?q=" + sql + "&srs=" + srs + "&lifetime=" + lifetime + "&client_encoding=" + client_encoding + "&key=ce5ab76892183d8b68c0486f724b011d";

    var postData = "q=" + sql + "&srs=" + srs + "&lifetime=" + lifetime + "&client_encoding=" + client_encoding + "&key=ce5ab76892183d8b68c0486f724b011d",
        options = {
            method: 'POST',
            host: "127.0.0.1",
            port: "3000",
            path: '/api/sql/' + db,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded ',
                'Content-Length': postData.length
            }
        };

    var req = http.request(options, function (res) {
        var chunks = [];
        response.header('content-type', 'application/json');
        res.on('error', function (e) {
            //console.log(e);
        });
        res.on('data', function (chunk) {
            chunks.push(chunk);
        });
        res.on("end", function () {
            jsfile = new Buffer.concat(chunks);
            response.send(jsfile);
        });
    });
    req.write(postData);
    req.end();


});
module.exports = router;