var express = require('express');
var request = require("request");
var router = express.Router();
var http = require('http');
var fs = require('fs');
var moment = require('moment');
var config = require('../../../config/config.js').gc2;

// Set locale for date/time string
moment.locale("da_DK");

var BACKEND = config.backend;

router.post('/api/extension/findNearest', function (req, response) {
    var db = "mydb", sql, url, jsfile;
    var point = req.body;
    sql = "SELECT * FROM fot_test.punkter";
    url = config.host + "/api/v1/sql/" + db + "?q=" + sql + "&srs=4326";
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
            var points = JSON.parse(jsfile.toString()).features;

            // Route
            // =====

            var count = 0, routes = [];
            (function iter() {
                if (count === points.length) {

                    // Send response
                    // =============
                    routes.sort(function(a,b) {return (a.length > b.length) ? 1 : ((b.length > a.length) ? -1 : 0);} );

                    response.send(routes);

                } else {
                    sql = "SELECT seq,gid,name,heading,cost,length,geom::GEOMETRY(Linestring,25832) from pgr_fromAtoB('fot_test.vejmidte_brudt'," +
                        point[0] + "," +
                        point[1] + "," +
                        points[count].geometry.coordinates[0] + "," +
                        points[count].geometry.coordinates[1] +
                        ")";
                    var url = config.host + "/api/v1/sql/" + db + "?q=" + sql + "&srs=4326";
                    console.log(url);
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
                            var json = JSON.parse(new Buffer.concat(chunks).toString()), length = 0;

                            // Calculate length of route
                            // =========================

                            for (var i = 0; i < json.features.length; i++) {
                                length = length + parseFloat(json.features[i].properties.length);
                            }
                            json.length = length;
                            json.name = points[count].properties.name;
                            routes.push(json);
                            io.emit(socketId, {"count": count, "name": json.name});
                            count++;
                            iter();
                        });
                    }).on("error", function (err) {
                        console.log(err);
                    });
                }

            }());
        });
    }).on("error", function (err) {
        console.log(err);
    });
});
module.exports = router;