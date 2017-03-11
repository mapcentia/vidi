var express = require('express');
var router = express.Router();
var http = require('http');
var config = require('../../config/config.js').gc2;


router.post('/api/sql/:db', function (req, response) {
    var db = req.params.db, q = req.body.q, srs = req.body.srs, lifetime = req.body.lifetime, client_encoding = req.body.client_encoding, url, data = [], jsfile = "";

    var postData = "q=" + encodeURIComponent(q) + "&srs=" + srs + "&lifetime=" + lifetime + "&client_encoding=" + client_encoding,
        options = {
            method: 'POST',
            host: config.host.replace("https://", "").replace("http://", "").split(":")[0],
            port: config.host.split(":").length === 3 ? config.host.split(":").reverse()[0] : "80",
            path: '/api/v1/sql/' + db,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded ',
                'Content-Length': postData.length
            }
        };

    var gc2req = http.request(options, function (res) {
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
            if (res.statusCode != 200) {
                console.log(jsfile.toString());
                response.status(res.statusCode).send({
                    success: false,
                    message: JSON.parse(jsfile.toString()).message
                });
                return;
            }
            response.send(jsfile);
        });
        res.on('error', function (e) {
           // console.log(e);
        });
    });
    gc2req.write(postData);
    gc2req.end();
});
module.exports = router;