var express = require('express');
var router = express.Router();
var http = require('http');
//var config = require('../../config/config.js').gc2;

router.post('/api/sql/:db', function (req, response) {
    var db = req.params.db, q = req.body.q, url, jsfile = "",
        data = 'format=geojson&q=' + encodeURIComponent(q);

        url = 'http://' + db + '.cartodb.com' + '/api/v2/sql?' + data;
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
        res.on('data', function (chunk) {
            chunks.push(chunk);
        });
        res.on("end", function () {
            var geojson;
            jsfile = new Buffer.concat(chunks);
            geojson = JSON.parse(jsfile.toString());
            geojson.success = true;
            console.log(geojson);
            response.send(geojson);
        });
    }).on("error", function (err) {
        console.log(err);
    });
});
module.exports = router;