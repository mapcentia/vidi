var express = require('express');
var request = require("request");
var router = express.Router();
var http = require('http');
var fs = require('fs');
var moment = require('moment');
var config = require('../../../config/config.js');
var session = require ('../../session/server');

/**
*
* @type {string}
*/
var GC2_HOST = config.gc2.host;
GC2_HOST = (GC2_HOST.split("https://").length > 1 ? GC2_HOST.split("https://")[1] : GC2_HOST);

// Set locale for date/time string
moment.locale("da_DK");

var BACKEND = config.backend;

router.post('/api/extension/amountSearch', function (req, response) {
    req.setTimeout(0); // no timeout
    var db = req.body.db;
    var schema = req.body.schema;
    var table = req.body.table;
    var token = req.body.token;
    var socketId = req.body.socketId;
    var buffer = req.body.buffer;
    var text = req.body.text;
    var fileName = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });



    switch (BACKEND) {
        case "gc2":
            sql = "select arbejdssted, element_navn as Element, coalesce(ROUND(maengde::numeric,2), 0) as Antal, Enhed ";
            if (req.session.gc2UserName && req.session.gc2SubUser == false) {
                sql += ", coalesce(ROUND(pris::numeric,2), 0) as Pris, coalesce(ROUND(ialt::numeric,2), 0) as Sum, coalesce(ROUND(renholdpris::numeric,2), 0) as Renholdpris, coalesce(ROUND(renholdialt::numeric,2), 0) as Renholdialt ";
            }
            sql += " FROM " + schema + "." + table + " where (element_subcode is not null) AND (element_subcode > 0) AND (arbejdssted_id IN (" + token + ")) order by antal";
            break;
        case "cartodb":
            console.log("\n\n\nCartodb backend not implememented");
        break;
    }
    console.log("\n\n\nsql: " + sql);
    // todo: replace with api key read from GC2
    var APIKey = req.session.gc2ApiKey;
	console.log("\n\napikey:" + APIKey);
    var postData = "client_encoding=UTF8&srs=4326&lifetime=0&key=" + APIKey + "&q=" + sql,
        options = {
            method: 'POST',
            host: GC2_HOST,
            //port: "3000",
            //path: '/api/sql/nocache' + db,
            path: '/api/v1/sql/' + db,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded ',
                'Content-Length': postData.length
            }
        };
console.log('this is postdata\n :'+postData);
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
console.log("\n\n\njsfile: " + jsfile);
            var result = JSON.parse(jsfile);
            var metadata;
            var data = [];
            if (res.statusCode !== 200) {
                error = true;
                message = result.message;
            }
            // save metadata, exclusive first item
            if (result.forStore) {
                var firsttimer = true;
                var arr = [];
                for (var i = 0; i < result.forStore.length; i++) {
                    if (i > 0) {
                        arr.push(result.forStore[i]);
                    }
                }
                metadata = arr
            }

            // save data, exclusive first item
            if (result.features) {
                for (var i = 0; i < result.features.length; i++) {
                    var arr = [];
                    var firsttimer = true;
                    for (var key in result.features[i].properties) {
                        if (firsttimer) {
                            firsttimer = false;
                            text = result.features[i].properties[key];
                        } else {
                            arr.push(result.features[i].properties[key]);
                        }
                    }
                    data.push({
                        properties: arr
                    });
                }
            }

            io.emit(socketId, data);
            var report = {
                metadata: metadata,
                data: data,
                file: fileName,
                text: text,
                dateTime: moment().format('MMMM Do YYYY, H:mm')
            };
            response.send(report);
            // Add meta data and date/time to report before writing to file
		console.log("\n\n\nwritefile: " + __dirname + "/../../../tmp/" + fileName );
            fs.writeFile(__dirname + "/../../../tmp/" + fileName, JSON.stringify(report, null, 4), function (err) {
            if (err) {
                console.log('error',err);
            } else {
                console.log("\n\n\nRepport saved");
            }
        });
        return;
        });
    });
    req.write(postData);
    req.end();
    //winston.log('info', resultsObj.message, resultsObj);

});


router.post('/api/extension/getAPIKey', function (req, response) {
    req.setTimeout(0); // no timeout
    response.send("6c905bc10aa9bf0bda584c399c9c1728");
    return;
});
module.exports = router;
