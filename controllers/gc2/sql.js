/*
 * @author     Martin Høgh <mh@mapcentia.com>
 * @copyright  2013-2026 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

var express = require('express');
var router = express.Router();
var config = require('../../config/config.js').gc2;
var fs = require('fs');
const {Readable} = require('stream');

var query = async function (req, response) {
    req.setTimeout(0); // no timeout
    var db = req.params.db,
        q = req.body.q || req.query.q,
        srs = req.body.srs || req.query.srs,
        lifetime = req.body.lifetime || req.query.lifetime || "0",
        client_encoding = req.body.client_encoding || req.query.client_encoding,
        base64 = req.body.base64 || req.query.base64,
        format = req.body.format || req.query.format,
        custom_data = req.body.custom_data || req.query.custom_data,
        store = req.body.store || req.query.store,
        userName,
        fileName,
        headers,
        uri,
        key = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });

    var postData = {
        convert_types: true,
        q,
        base64,
        srs,
        lifetime,
        client_encoding: client_encoding || "UTF8",
        format: format ? format : "geojson",
        key: typeof req?.session?.gc2ApiKey !== "undefined" ? req.session.gc2ApiKey : "xxxxx", //Dummy key is sent to prevent start of session
        custom_data: custom_data || ""
    };

    // Check if user is a sub user
    if (req?.session?.screenName && req?.session?.subUser) {
        userName = req.session.screenName + "@" + db;
    } else {
        userName = db;
    }

    uri = custom_data !== null && custom_data !== undefined && custom_data !== "null" ? config.host + "/api/v2/sqlwrapper/" + userName : config.host + "/api/v2/sql/" + userName;

    console.log(uri);

    if (format === "excel") {
        fileName = key + ".xlsx";
        headers = {
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition': 'attachment; filename=data.xlsx',
            'Expires': '0',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'X-Powered-By': 'MapCentia Vidi'
        }
    } else {
        fileName = key + ".json";
        headers = {
            'Content-Type': 'application/json',
            'Expires': '0',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'X-Powered-By': 'MapCentia Vidi'
        }
    }

    let upstream;
    try {
        upstream = await fetch(uri, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(postData)
        });
    } catch (err) {
        console.error(err);
        if (!response.headersSent) response.status(500).send({success: false, message: err.message});
        return;
    }

    const nodeStream = upstream.body ? Readable.fromWeb(upstream.body) : Readable.from([]);

    if (store) {
        const writeStream = fs.createWriteStream(__dirname + "/../../public/tmp/stored_results/" + fileName);
        nodeStream.on('error', (e) => {
            console.error(e);
            writeStream.destroy();
            if (!response.headersSent) response.status(500).send({success: false, message: e.message});
        });
        writeStream.on('error', (e) => {
            console.error(e);
            if (!response.headersSent) response.status(500).send({success: false, message: e.message});
        });
        writeStream.on('finish', function () {
            console.log("Result saved");
            response.send({"success": true, "file": fileName});
        });
        nodeStream.pipe(writeStream);
    } else {
        response.writeHead(upstream.status, headers);
        nodeStream.on('error', (e) => {
            console.error(e);
            response.end();
        });
        nodeStream.pipe(response);
    }
};
router.all('/api/sql/:db', query);
router.all('/api/sql/nocache/:db', query);
module.exports = router;
