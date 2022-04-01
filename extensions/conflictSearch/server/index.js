/*
 * @author     Martin Høgh <mh@mapcentia.com>
 * @copyright  2013-2022 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

const express = require('express');
const request = require("request");
const router = express.Router();
const fs = require('fs');
const dayjs = require('dayjs');
const XLSX = require('xlsx');
const config = require('../../../config/config.js');
const {PromisePool} = require('@supercharge/promise-pool');
const POOL_SIZE = 20;
const utf8 = require('utf8');
// Set locale for date/time string
dayjs.locale("da_DK");

router.post('/api/extension/conflictSearch', function (req, response) {
    req.setTimeout(0); // no timeout
    let db = req.body.db;
    let schema = req.body.schema;
    let wkt = req.body.wkt;
    let socketId = req.body.socketId;
    let text = req.body.text;
    let fileName = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        let r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
    let addedSchemata = typeof config.addedSchemata !== "undefined" ? "," + config.addedSchemata : "";
    let url = config.gc2.host + "/api/v1/meta/" + db + "/" + utf8.encode(schema) + addedSchemata;
    let count = 0,
        metaDataFinal = {data: []}, metaDataKeys = [];
    let options = {
        uri: url,
        encoding: 'utf8',
        headers: {
            Cookie: "PHPSESSID=" + req.session.gc2SessionId + ";" // GC2's Meta API is session based
        }
    };
    request.get(options, function (err, res, body) {
        if (err) {
            console.log(err);
            return;
        }
        let emptyReport = {
            hits: {},
            file: null,
            text: null,
            dateTime: dayjs().format('MMMM Do YYYY, H:mm')
        };
        let metaData;

        try {
            metaData = JSON.parse(body);
        } catch (e) {
            response.send(emptyReport);
            return;
        }
        if (metaData.data === undefined || metaData.data.length === 0) {
            response.send(emptyReport);
            return;
        }
        // Count layers
        for (let i = 0; i < metaData.data.length; i = i + 1) {
            if (metaData.data[i].type !== "RASTER" &&
                metaData.data[i].baselayer !== true &&
                metaData.data[i].skipconflict !== true) {
                metaDataFinal.data.push(metaData.data[i]);
                metaDataKeys[metaData.data[i].f_table_schema + '.' + metaData.data[i].f_table_name] = metaData.data[i];
            }
        }
        const createPool = async function () {
            const {results, errors} = await PromisePool
                .withConcurrency(POOL_SIZE)
                .for(metaDataFinal.data)
                .process(async (data, index, pool) => {
                    return await makeSearch(data);
                });

            // Sort alpha by layer title. This only works in Node v12+ with stable sort
            results.sort((a, b) => (a.title > b.title) ? 1 : ((b.title > a.title) ? -1 : 0));
            results.reverse();
            results.sort((a, b) => (a.group > b.group) ? 1 : ((b.group > a.group) ? -1 : 0));
            results.reverse();
            let report = {
                hits: results,
                file: fileName,
                text: text,
                dateTime: dayjs().format('MMMM Do YYYY, H:mm')
            };
            response.send(report);
            // Add meta data and date/time to report before writing to file
            report.metaData = metaDataFinal;
            fs.writeFile(__dirname + "/../../../tmp/" + fileName, JSON.stringify(report, null, 4), function (err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Report saved");
                }
            });
            // Create Excel workbook with hits
            let wb = XLSX.utils.book_new();
            let dataAdded = false;
            let names = [];
            let postfixNumber = 1;
            const obj = report.hits;
            for (const hit in obj) {
                if (obj.hasOwnProperty(hit)) {
                    if (obj[hit].hits > 0) {
                        let data = [];
                        let name = obj[hit].title || obj[hit].table;
                        name = name.slice(0, 30); // TODO also strip invalid characters
                        if (names.includes(name)) {
                            name = name.slice(0, -1) + postfixNumber;
                            postfixNumber++;
                            names.push(name);
                        }
                        names.push(name);
                        if (obj[hit].data.length > 0) {
                            let header = obj[hit].data[0].map((cell) => {
                                return cell.alias
                            });
                            data = obj[hit].data.map((row) => {
                                return row.map((cell) => {
                                    if (!cell.key) {
                                        return cell.value
                                    }
                                })
                            });
                            data.unshift(header)
                        }
                        let ws = XLSX.utils.aoa_to_sheet(data);
                        dataAdded = true;
                        try {
                            XLSX.utils.book_append_sheet(wb, ws, name);
                        } catch (e) {
                            console.log(e.message);
                        }
                    }
                }
            }
            if (!dataAdded) {
                XLSX.utils.book_append_sheet(wb, [[]]);
            }
            try {
                XLSX.writeFile(wb, __dirname + "/../../../public/tmp/excel/" + fileName + ".xlsb");
            } catch (e) {
                console.log(e.message, "Could not create excel file. Check if folder exists.")
            }

        };
        const makeSearch = (data) => {
            const startTime = new Date().getTime();
            const table = data.f_table_schema + "." + data.f_table_name;
            const geomField = data.f_geometry_column;
            const srid = data.srid;
            const fields = data.fields;
            const fieldConf = data?.fieldconf ? JSON.parse(data.fieldconf) : null;

            let fieldStr, fieldNames = [];
            if (fields) {
                for (const [i, v] of Object.entries(fields)) {
                    if (v.type !== "geometry" && fieldConf?.[i]?.ignore !== true) {
                        fieldNames.push("\"" + i + "\"");
                    }
                }
                fieldStr = fieldNames.join(",");
            } else {
                fieldStr = "*";
            }

            const sql = "SELECT " + fieldStr + " FROM " + table + " WHERE  ST_intersects(" + geomField + ", ST_Transform(ST_geomfromtext('" + wkt + "',4326)," + srid + "))";
            const queryables = JSON.parse(metaDataKeys[table].fieldconf);
            let postData = "client_encoding=UTF8&srs=4326&lifetime=0&q=" + sql + "&key=" + "&key=" + (typeof req.session.gc2ApiKey !== "undefined" ? req.session.gc2ApiKey : "xxxxx" /*Dummy key is sent to prevent start of session*/),
                options = {
                    uri: config.gc2.host + "/api/v2/sql/" + (req.session.subUser ? req.session.screenName + "@" + req.session.parentDb : db),
                    encoding: 'utf8',
                    body: postData,
                    headers: {
                        "Content-Type": 'application/x-www-form-urlencoded',
                        'Content-Length': postData.length,
                    }
                };
            return new Promise((resolve, reject) => {
                request.post(options, function (err, res, body) {
                    let jsfile, message = null, result, time, data = [], tmp = [];
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
                    time = new Date().getTime() - startTime;
                    if (result.features) {
                        for (let i = 0; i < result.features.length; i++) {
                            for (let prop in queryables) {
                                if (queryables.hasOwnProperty(prop)) {
                                    if (queryables[prop].conflict) {
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
                                    name: metaDataKeys[table].pkey,
                                    alias: null,
                                    value: result.features[i].properties[metaDataKeys[table].pkey],
                                    sort_id: null,
                                    key: true
                                });
                                data.push(tmp);
                            }
                            tmp = [];
                        }
                    }
                    let meta = metaDataKeys[table];
                    let hit = {
                        table: table,
                        title: metaDataKeys[table].f_table_title || metaDataKeys[table].f_table_name,
                        group: metaDataKeys[table].layergroup,
                        hits: (typeof result.features !== "undefined" && result.features !== null) ? result.features.length : 0,
                        data: data,
                        num: count + "/" + metaDataFinal.data.length,
                        time: time,
                        id: socketId,
                        error: res.statusCode !== 200 ? JSON.parse(body).message : null,
                        message: message,
                        sql: meta.sql,
                        meta: {
                            meta: meta.meta,
                            layergroup: meta.layergroup,
                            f_table_name: meta.f_table_name,
                            f_table_title: meta.f_table_title || meta.f_table_name,
                            meta_url: meta.meta_url,
                        }
                    };
                    io.emit(socketId, hit);
                    resolve(hit)
                });
            });
        }
        createPool();
    });
});
module.exports = router;
