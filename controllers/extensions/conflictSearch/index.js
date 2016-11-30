var express = require('express');
var request = require("request");
var router = express.Router();
var http = require('http');
var fs = require('fs');
var moment = require('moment');
var config = require('../../../config/config.js');
var utmZone = require('../../../browser/modules/utmZone');

var BACKEND = config.backend;

router.post('/api/extension/conflictSearch', function (req, response) {
    var db = req.body.db;
    var schema = req.body.schema;
    var wkt = req.body.wkt;
    var socketId = req.body.socketId;
    var buffer = req.body.buffer;
    var fileName = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
    var url = "http://127.0.0.1:3000/api/meta/" + db + "/" + schema;

    console.log(db);
    console.log(schema);
    console.log(wkt);

    switch (BACKEND) {
        case "gc2":
            var pg = require('pg');
            var conString = "postgres://" + config.pg.user + ":" + config.pg.pw + "@" + config.pg.host + "/" + db;
            pg.connect(conString, function (err, client, done) {
                if (err) {
                    return console.error('error fetching client from pool', err);
                }
                request.get(url, function (err, res, body) {
                    if (!err) {
                        var metaData = JSON.parse(body), count = 0, table, sql, geomField, bindings, startTime, hits = {}, hit, metaDataFinal = {data: []}, metaDataKeys = [];
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
                            geomField = metaDataFinal.data[count].f_geometry_column;
                            table = metaDataFinal.data[count].f_table_schema + "." + metaDataFinal.data[count].f_table_name;

                            console.log(table);

                            if (buffer > 0) {
                                sql = "SELECT geography(ST_transform(" + geomField + ",4326)) as _gc2_geom, * FROM " + table + " WHERE ST_DWithin(ST_GeogFromText($1), geography(ST_transform(" + geomField + ",4326)), $2);";
                                bindings = [wkt, buffer];
                            } else {
                                sql = "SELECT * FROM " + table + " WHERE ST_transform(" + geomField + ",900913) && ST_transform(ST_geomfromtext($1,4326),900913) AND ST_intersects(ST_transform(" + geomField + ",900913),ST_transform(ST_geomfromtext($1,4326),900913))";
                                bindings = [wkt];
                            }

                            startTime = new Date().getTime();
                            client.query(sql, bindings, function (err, result) {
                                var time = new Date().getTime() - startTime, queryables, data = [], tmp = [];
                                count++;
                                if (!err) {
                                    // Get values if queryable
                                    queryables = JSON.parse(metaDataKeys[table.split(".")[1]].fieldconf);
                                    for (var i = 0; i < result.rows.length; i++) {
                                        for (var prop in queryables) {
                                            if (queryables.hasOwnProperty(prop)) {
                                                if (queryables[prop].conflict) {
                                                    tmp.push({
                                                        name: prop,
                                                        alias: queryables[prop].alias || prop,
                                                        value: result.rows[i][prop],
                                                        sort_id: queryables[prop].sort_id,
                                                        key: false
                                                    })
                                                }
                                            }
                                        }
                                        if (tmp.length > 0) {
                                            tmp.push({
                                                name: metaDataKeys[table.split(".")[1]].pkey,
                                                alias: null,
                                                value: result.rows[i][metaDataKeys[table.split(".")[1]].pkey],
                                                sort_id: null,
                                                key: true
                                            });
                                            data.push(tmp);
                                        }
                                        tmp = [];
                                    }
                                    hit = {
                                        table: table,
                                        title: metaDataKeys[table.split(".")[1]].f_table_title,
                                        group: metaDataKeys[table.split(".")[1]].layergroup,
                                        hits: result.rows.length,
                                        data: data,
                                        num: count + "/" + metaDataFinal.data.length,
                                        time: time,
                                        id: socketId,
                                        error: null
                                    };
                                } else {
                                    hit = {
                                        table: table,
                                        title: metaDataKeys[table.split(".")[1]].f_table_title,
                                        group: metaDataKeys[table.split(".")[1]].layergroup,
                                        hits: null,
                                        num: null,
                                        time: time,
                                        id: socketId,
                                        error: err.severity,
                                        hint: err.hint
                                    };
                                }
                                hits[table] = hit;
                                io.emit(socketId, hit);
                                if (metaDataFinal.data.length === count) {
                                    client.end();
                                    var report = {
                                        hits: hits,
                                        file: fileName,
                                        //geom: buffer4326 || primitive,
                                        //primitive: primitive,
                                        //text: text
                                    };
                                    response.send(report);
                                    // Add meta data and date/time to report before writing to file
                                    report.metaData = metaDataFinal;
                                    report.dateTime = moment().format('MMMM Do YYYY, hh:mm');
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
                        //winston.log('info', resultsObj.message, resultsObj);
                    } else {
                        console.log(err);
                        //winston.log('error', err);
                    }
                });
            });
            break;
        case "cartodb":
            request.get(url, function (err, res, body) {
                if (!err) {
                    var metaData = JSON.parse(body), count = 0, table, sql, geomField, startTime, hits = {}, hit, metaDataFinal = {data: []}, metaDataKeys = [], sqlUrl;
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
                        geomField = "the_geom_webmercator";
                        table = metaDataFinal.data[count].f_table_schema + "." + metaDataFinal.data[count].f_table_name;
                        if (buffer > 0) {
                            sql = "SELECT geography(ST_transform(" + geomField + ",4326)) as _gc2_geom, * FROM (" + metaDataKeys[table.split(".")[1]].sql + ") as foo WHERE ST_DWithin(ST_GeogFromText('" + wkt + "'), geography(ST_transform(" + geomField + ",4326)), " + buffer + ");";
                        } else {
                            sql = "SELECT * FROM (" + metaDataKeys[table.split(".")[1]].sql + ") as foo WHERE ST_transform(" + geomField + ",900913) && ST_transform(ST_geomfromtext($1,4326),900913) AND ST_intersects(ST_transform(" + geomField + ",900913),ST_transform(ST_geomfromtext('" + wkt + "',4326),900913))";
                        }
                        startTime = new Date().getTime();
                        var postData = "q=" + sql,
                            options = {
                                method: 'POST',
                                host: db + ".cartodb.com",
                                port: "80",
                                path: '/api/v2/sql',
                                headers: {
                                    'Content-Type': 'application/x-www-form-urlencoded ',
                                    'Content-Length': postData.length
                                }
                            };
                        var req = http.request(options, function (res) {
                            var chunks = [];
                            res.on('data', function (chunk) {
                                chunks.push(chunk);
                            });
                            res.on('end', function () {
                                var jsfile = new Buffer.concat(chunks);
                                var result = JSON.parse(jsfile);
                                var time = new Date().getTime() - startTime, queryables, data = [], tmp = [];
                                count++;
                                for (var i = 0; i < result.rows.length; i++) {
                                    for (var prop in result.rows[i]) {
                                        if (result.rows[i].hasOwnProperty(prop)) {
                                            tmp.push({
                                                name: prop,
                                                alias: prop,
                                                value: result.rows[i][prop],
                                                sort_id: 1,
                                                key: false
                                            })

                                        }
                                    }
                                    if (tmp.length > 0) {
                                        tmp.push({
                                            name: metaDataKeys[table.split(".")[1]].pkey,
                                            alias: null,
                                            value: result.rows[i][metaDataKeys[table.split(".")[1]].pkey],
                                            sort_id: null,
                                            key: true
                                        });
                                        data.push(tmp);
                                    }
                                    tmp = [];
                                }
                                hit = {
                                    table: table,
                                    title: metaDataKeys[table.split(".")[1]].f_table_title,
                                    group: metaDataKeys[table.split(".")[1]].layergroup,
                                    hits: result.rows.length,
                                    data: data,
                                    num: count + "/" + metaDataFinal.data.length,
                                    time: time,
                                    id: socketId,
                                    error: null,
                                    sql: metaDataKeys[table.split(".")[1]].sql
                                };

                                /* hit = {
                                 table: table,
                                 title: metaDataKeys[table.split(".")[1]].f_table_title,
                                 group: metaDataKeys[table.split(".")[1]].layergroup,
                                 hits: null,
                                 num: null,
                                 time: time,
                                 id: socketId,
                                 error: err.severity,
                                 hint: err.hint
                                 };*/

                                hits[table] = hit;
                                io.emit(socketId, hit);
                                if (metaDataFinal.data.length === count) {
                                    var report = {
                                        hits: hits,
                                        file: fileName
                                    };
                                    response.send(report);
                                    // Add meta data and date/time to report before writing to file
                                    report.metaData = metaDataFinal;
                                    report.dateTime = moment().format('MMMM Do YYYY, hh:mm');
                                    fs.writeFile(__dirname + "/tmp/" + fileName, JSON.stringify(report, null, 4), function (err) {
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
            break;
    }

});
module.exports = router;