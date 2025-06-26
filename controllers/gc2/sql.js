/*
 * @author     Martin Høgh <mh@mapcentia.com>
 * @copyright  2013-2018 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

var express = require('express');
var router = express.Router();
var config = require('../../config/config.js').gc2;
var request = require('request');
var fs = require('fs');

Prometheus = require('prom-client');

// Initialize Prometheus metrics
const sqlQueryCounter = new Prometheus.Counter({
    name: 'vidi_controllers_gc2_sql_queries_total',
    help: 'Total number of SQL queries processed',
    labelNames: ['db', 'format', 'status']
});

const sqlQueryDuration = new Prometheus.Histogram({
    name: 'vidi_controllers_gc2_sql_query_duration_seconds',
    help: 'Duration of SQL queries in seconds',
    labelNames: ['db', 'format'],
    buckets: [0.1, 0.5, 1, 2, 5, 10, 30, 60]
});

const sqlResponseSize = new Prometheus.Histogram({
    name: 'vidi_controllers_gc2_sql_response_size_bytes',
    help: 'Size of SQL query responses in bytes',
    labelNames: ['db', 'format'],
    buckets: [1000, 10000, 100000, 1000000, 10000000, 100000000]
});

var query = function (req, response) {
    // Start timing the query
    const endTimer = sqlQueryDuration.startTimer();
    
    // Track response size
    let responseSize = 0;
    
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
        writeStream,
        rem,
        headers,
        uri,
        key = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });

    var postData = "q=" + (base64 === "true" ? q : encodeURIComponent(q)) + "&base64=" + (base64 === "true" ? "true" : "false") + "&srs=" + srs + "&lifetime=" + lifetime + "&client_encoding=" + (client_encoding || "UTF8") + "&format=" + (format ? format : "geojson") + "&key=" + (typeof req?.session?.gc2ApiKey !=="undefined" ? req.session.gc2ApiKey : "xxxxx" /*Dummy key is sent to prevent start of session*/) + "&custom_data=" + (custom_data || ""),
        options;

    // Check if user is a sub user
    if (req?.session?.screenName && req?.session?.subUser) {
        userName = req.session.screenName + "@" + db;
    } else {
        userName = db;
    }

    if (req.body.key && !req?.session?.gc2ApiKey) {
        postData = postData + "&key=" + req.body.key;
    }

    uri = custom_data !== null && custom_data !== undefined && custom_data !== "null" ? config.host + "/api/v2/sqlwrapper/" + userName : config.host + "/api/v2/sql/" + userName;

    console.log(uri);

    options = {
        method: 'POST',
        uri: uri,
        form: postData
    };

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

    // if (!store) {
    //     //response.writeHead(200, headers);
    // }

    rem = request(options);

    if (store) {
        writeStream = fs.createWriteStream(__dirname + "/../../public/tmp/stored_results/" + fileName);
    }

    rem.on('response', function(res) {
        if (!store) {
            response.writeHead(res.statusCode, headers);
        }
        
        // Track query status in the counter
        sqlQueryCounter.inc({
            db: db,
            format: format,
            status: res.statusCode >= 400 ? 'error' : 'success'
        });
    });

    rem.on('data', function (chunk) {
        responseSize += chunk.length;
        if (store) {
            writeStream.write(chunk, 'binary');
        } else {
            response.write(chunk);
        }
    });
    
    rem.on('end', function () {
        // End timer and record duration with labels
        endTimer({ db: db, format: format });
        
        // Record response size
        sqlResponseSize.observe({ db: db, format: format }, responseSize);
        
        if (store) {
            console.log("Result saved");
            response.send({"success": true, "file": fileName});
        } else {
            response.end();
        }
    });

};
router.all('/api/sql/:db', query);
router.all('/api/sql/nocache/:db', query);
module.exports = router;
