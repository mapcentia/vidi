var express = require('express');
var router = express.Router();
var http = require('http');
var config = require('../../config/config.js').gc2;

router.get('/api/meta/:db/:schema', function (req, response) {
    var db = req.params.db, schema = req.params.schema, url, data = [], jsfile = "";
    url = config.host + "/api/v1/meta/" + db + "/" + schema;
    //console.log(url);
    http.get(url, function (res) {
        if (res.statusCode != 200) {
            response.header('content-type', 'application/json');
            response.status(res.statusCode).send({
                success: false,
                message: "Could not get the meta data."
            });
            return;
        }
        var chunks = [];
        response.header('content-type', 'application/json');
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

