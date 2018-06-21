var express = require('express');
var request = require("request");
var router = express.Router();
var http = require('http');
var fs = require('fs');
var moment = require('moment');
var config = require('../../../config/config.js');

// Set locale for date/time string
moment.locale("da_DK");

var BACKEND = config.backend;

router.post('/api/extension/conflictSearch', function (req, response) {
    req.setTimeout(0); // no timeout
    var db = req.body.db;
    var schema = req.body.schema;
    var wkt = req.body.wkt;
    var socketId = req.body.socketId;
    var buffer = req.body.buffer;
    var text = req.body.text;
    var fileName = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
    var url = "http://127.0.0.1:3000/api/meta/" + db + "/" + schema, count = 0, table, sql, geomField,
        startTime, hits = {}, hit, metaDataFinal = {data: []}, metaDataKeys = [], queryables = [];

    request.get(url, function (err, res, body) {
        if (!err) {
            var emptyReport = {
                hits: {},
                file: null,
                text: null,
                dateTime: moment().format('MMMM Do YYYY, H:mm')
            };

            try {
                var metaData = JSON.parse(body);
            } catch (e) {
                response.send(emptyReport);
                return;
            }

            if (metaData.data === undefined || metaData.data.length === 0) {

                response.send(emptyReport);
                return;
            }


            // Count layers
            for (var i = 0; i < metaData.data.length; i = i + 1) {
                if (metaData.data[i].type !== "RASTER" &&
                    metaData.data[i].baselayer !== true &&
                    metaData.data[i].skipconflict !== true) {
                    metaDataFinal.data.push(metaData.data[i]);
                    metaDataKeys[metaData.data[i].f_table_name] = metaData.data[i];
                }
            }
            (function iter() {

                startTime = new Date().getTime();
                table = metaDataFinal.data[count].f_table_schema + "." + metaDataFinal.data[count].f_table_name;

                geomField = metaDataFinal.data[count].f_geometry_column;

                if (buffer > 0) {
                    sql = "SELECT * FROM " + table + " WHERE  ST_intersects(ST_transform(" + geomField + ",25832),ST_Buffer(ST_transform(ST_geomfromtext('" + wkt + "',4326),25832)," + buffer + "))";
                } else {
                    sql = "SELECT * FROM " + table + " WHERE  ST_intersects(ST_transform(" + geomField + ",25832),          ST_Transform(ST_geomfromtext('" + wkt + "',4326),25832))";
                }

                queryables = JSON.parse(metaDataKeys[table.split(".")[1]].fieldconf);

                var postData = "client_encoding=UTF8&srs=4326&lifetime=0&q=" + sql,


                    options = {
                        uri: "http://127.0.0.1:3000/api/sql/" + db,
                        encoding: 'utf8',
                        body: postData,
                        headers: {
                            "Content-Type": 'application/x-www-form-urlencoded',
                            'Content-Length': postData.length,
                        }
                    };

                request.post(options, function (err, res, body) {

                    var jsfile, message = null, result, time;

                    if (err || res.statusCode !== 200) {
                        response.status(401).send({
                            success: false,
                            message: body
                        });
                        return;
                    }

                    try {
                        jsfile = JSON.parse(body);
                    } catch (e) {
                        response.status(500).send({
                            success: false,
                            message: "Could not parse response from GC2 SQL API",
                            data: body,
                            query: postData
                        });
                        return;
                    }

                    result = jsfile;
                    message = result.message;
                    time = new Date().getTime() - startTime, data = [], tmp = [];

                    count++;
                    if (result.features) {
                        for (var i = 0; i < result.features.length; i++) {

                            for (var prop in queryables) {
                                if (queryables.hasOwnProperty(prop)) {
                                    if (queryables[prop].conflict || (BACKEND === "cartodb" && queryables[prop].querable)) {
                                        tmp.push({
                                            name: prop,
                                            alias: queryables[prop].alias || prop,
                                            value: result.features[i].properties[prop],
                                            sort_id: queryables[prop].sort_id,
                                            link: queryables[prop].link,
                                            linkprefix: queryables[prop].linkprefix,
                                            key: false
                                        })
                                    }
                                }
                            }

                            if (tmp.length > 0) {
                                tmp.push({
                                    name: metaDataKeys[table.split(".")[1]].pkey,
                                    alias: null,
                                    value: result.features[i].properties[metaDataKeys[table.split(".")[1]].pkey],
                                    sort_id: null,
                                    key: true
                                });
                                data.push(tmp);
                            }
                            tmp = [];
                        }
                    }
                    hit = {
                        table: table,
                        title: metaDataKeys[table.split(".")[1]].f_table_title,
                        group: metaDataKeys[table.split(".")[1]].layergroup,
                        hits: (typeof result.features !== "undefined" && result.features !== null) ? result.features.length : 0,
                        data: data,
                        num: count + "/" + metaDataFinal.data.length,
                        time: time,
                        id: socketId,
                        error: err || null,
                        message: message,
                        sql: metaDataKeys[table.split(".")[1]].sql,
                        meta: metaDataKeys[table.split(".")[1]]
                    };
                    hits[table] = hit;
                    io.emit(socketId, hit);
                    if (metaDataFinal.data.length === count) {
                        var report = {
                            hits: hits,
                            file: fileName,
                            text: text,
                            dateTime: moment().format('MMMM Do YYYY, H:mm')
                        };
                        response.send(report);
                        // Add meta data and date/time to report before writing to file
                        report.metaData = metaDataFinal;
                        fs.writeFile(__dirname + "/../../../tmp/" + fileName, JSON.stringify(report, null, 4), function (err) {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log("Repport saved");
                            }
                        });
                        return;
                    }
                    iter();
                });


            })();
        } else {
            console.log(err);
        }
    });
});
module.exports = router;