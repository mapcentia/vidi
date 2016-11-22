var express = require('express');
var router = express.Router();
var http = require('http');
var config = require('../../config/config.js').gc2;


router.post('/api/sql/:db', function (req, response) {
    var db = req.params.db, q = req.body.q, srs = req.body.srs, lifetime = req.body.lifetime, client_encoding = req.body.client_encoding, url, data = [], jsfile = "";
    url = config.host + "/api/v1/sql/" + db + "?q=" + q + "&srs=" + srs +  "&lifetime=" + lifetime + "&client_encoding=" + client_encoding;
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
        response.header('Cache-Control', 'no-cache, no-store, must-revalidate');
        response.header('Expires', '0');
        response.header('X-Powered-By', 'MapCentia Vidi');
        res.on('data', function (chunk) {
            chunks.push(chunk);
        });
        res.on("end", function () {
            jsfile = new Buffer.concat(chunks);
            response.send(jsfile);
        });
    }).on("error", function (err) {
        console.log(err);
    });
});
module.exports = router;