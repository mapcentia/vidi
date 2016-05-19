var express = require('express');
var router = express.Router();
var http = require('http');
var config = require('../../config/config.js').gc2;

router.get('/baselayer', function (req, response) {
    var db = req.query.db, url, jsfile;
    url = config.host + "/api/v1/baselayerjs/" + db;
    http.get(url, function (res) {
        var chunks = [];
        res.on('data', function (chunk) {
            chunks.push(chunk);
        });
        res.on("end", function () {
            jsfile = new Buffer.concat(chunks);
            response.header('content-type', 'application/json');
            response.send(jsfile);
        });
    }).on("error", function () {
        callback(null);
    });
});
module.exports = router;
