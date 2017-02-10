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
            var metaData = JSON.parse(body);
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
                switch (BACKEND) {
                    case "gc2":
                        geomField = metaDataFinal.data[count].f_geometry_column;
                        if (buffer > 0) {
                            sql = "SELECT geography(ST_transform(" + geomField + ",4326)) as _gc2_geom, * FROM " + table + " WHERE ST_DWithin(ST_GeogFromText('" + wkt + "'), geography(ST_transform(" + geomField + ",4326)), " + buffer + ")";
                        } else {
                            sql = "SELECT * FROM " + table + " WHERE  ST_intersects(ST_transform(" + geomField + ",900913),ST_transform(ST_geomfromtext('" + wkt + "',4326),900913))";
                        }
                        queryables = JSON.parse(metaDataKeys[table.split(".")[1]].fieldconf);
                        break;
                    case "cartodb":
                        geomField = "the_geom_webmercator";
                        if (buffer > 0) {
                            sql = "SELECT geography(ST_transform(" + geomField + ",4326)) as _gc2_geom, * FROM (" + metaDataKeys[table.split(".")[1]].sql + ") as foo WHERE ST_DWithin(ST_GeogFromText('" + wkt + "'), geography(ST_transform(" + geomField + ",4326)), " + buffer + ")";
                        } else {
                            sql = "SELECT * FROM (" + metaDataKeys[table.split(".")[1]].sql + ") as foo WHERE ST_intersects(ST_transform(" + geomField + ",900913),ST_transform(ST_geomfromtext('" + wkt + "',4326),900913))";
                        }
                        break;
                }
                var postData = "client_encoding=UTF8&srs=4326&lifetime=0&q=" + sql,
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
                    var chunks = [], error = false, message = null;
                    res.on('data', function (chunk) {
                        chunks.push(chunk);
                    });
                    res.on('error', function (e) {
                        console.log(e);
                    });
                    res.on('end', function () {
                        var jsfile = new Buffer.concat(chunks);
                        var result = JSON.parse(jsfile);
                        var time = new Date().getTime() - startTime, data = [], tmp = [];
                        if (res.statusCode !== 200) {
                            console.log(result.message);
                            error = true;
                            message = result.message;
                        }
                        count++;
                        if (result.features) {
                            for (var i = 0; i < result.features.length; i++) {
                                if (BACKEND === "gc2") {
                                    for (var prop in queryables) {
                                        if (queryables.hasOwnProperty(prop)) {
                                            if (queryables[prop].conflict) {
                                                tmp.push({
                                                    name: prop,
                                                    alias: queryables[prop].alias || prop,
                                                    value: result.features[i].properties[prop],
                                                    sort_id: queryables[prop].sort_id,
                                                    key: false
                                                })
                                            }
                                        }
                                    }
                                } else {
                                    for (var prop in result.features[i].properties) {
                                        if (result.features[i].properties.hasOwnProperty(prop)) {
                                            tmp.push({
                                                name: prop,
                                                alias: prop,
                                                value: result.features[i].properties[prop],
                                                sort_id: 1,
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
                            hits: (typeof result.features !=="undefined" && result.features !== null)? result.features.length : 0,
                            data: data,
                            num: count + "/" + metaDataFinal.data.length,
                            time: time,
                            id: socketId,
                            error: error || null,
                            message: message,
                            sql: metaDataKeys[table.split(".")[1]].sql
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
                });
                req.write(postData);
                req.end();
            })();
            //winston.log('info', resultsObj.message, resultsObj);
        } else {
            console.log(err);
            //winston.log('error', err);
        }
    });
});
module.exports = router;