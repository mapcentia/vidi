var express = require('express');
var router = express.Router();
var http = require('http');
var fs = require('fs');
var wkhtmltopdf = require('wkhtmltopdf');

wkhtmltopdf.command = "/root/wkhtmltox/bin/wkhtmltopdf";
//wkhtmltopdf.command = "/home/mh/Downloads/wkhtmltox/bin/wkhtmltopdf";


/**
 *
 * @type {module.exports.print|{templates, scales}}
 */
var config = require('../config/config.js').print;

router.post('/api/print', function (req, response) {
    req.setTimeout(0); // no timeout
    var q = req.body;
    console.log(q);
    var key = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
    // TODO
    fs.writeFile(__dirname + "/../public/tmp/print/json/" + key, JSON.stringify(q), function (err) {
        if (err) {
            response.send({success: true, error: err});
            return;
        }
        var url = '/app/' + q.db + '/' + q.schema + '/' + (q.queryString !=="" ? q.queryString : "?") + '&tmpl=' + q.tmpl + '.tmpl&l=' + q.legend + '&h=' + q.header + '&px=' + q.px + '&py=' + q.py + '&td=' + q.dateTime+ '&d=' + q.date + '&k=' + key + '&t=' + q.title + '&c=' + q.comment + q.anchor;
        console.log("http://127.0.0.1:3000" + url);
        wkhtmltopdf("http://127.0.0.1:3000" + url, {
            pageSize: q.pageSize,
            orientation: (q.orientation === 'l') ? 'Landscape' : 'Portrait',
            B: 0,
            L: 0,
            R: 0,
            T: 0,
            encoding: "utf-8",
            dpi: 96,
            imageQuality: 100,
            disableSmartShrinking: true,
            javascriptDelay: 400,
            windowStatus: "all_loaded",
            debug: true,
            noStopSlowScripts: true,
            debugJavascript: true
        }, function (err) {
            console.log(err);
        }).pipe(fs.createWriteStream(__dirname + "/../public/tmp/print/pdf/" + key + '.pdf').on("finish", function () {
            console.log("done");
            response.send({success: true, key: key, url: url, cmd: wkhtmltopdf.command});
        }));

    });
});

router.get('/api/postdata', function (req, response) {
    var key = req.query.k;
    console.log(key);
    fs.readFile(__dirname + "/../public/tmp/print/json/" + key, 'utf8', function (err, data) {
        if (err) {
            response.send({success: true, error: err});
            return;
        }
        response.send({success: true, data: JSON.parse(data)});
    });
});

module.exports = router;