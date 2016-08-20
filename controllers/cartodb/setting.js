var express = require('express');
var router = express.Router();
var http = require('http');
var config = require('../../config/config.js').cartodb;

router.get('/api/setting/:db/:schema', function (req, response) {
    var db = req.params.db, schema = req.params.schema, url, extents = {};

    console.log(schema)

    schema = schema.split(",")[0];
    url = "http://" + db + ".cartodb.com/api/v2/viz/" + schema + "/viz.json";

    http.get(url, function (res) {
        var chunks = [];
        res.on('data', function (chunk) {
            chunks.push(chunk);
        });
        res.on("end", function () {
            var jsfile = new Buffer.concat(chunks), bounds;
            response.header('content-type', 'application/json');
            try {
                bounds = JSON.parse(jsfile).bounds;
            } catch (e) {
                console.log(e)
            }
            extents[schema] = bounds;
            jsfile = {
                data: {extents: extents},
                success: true
            };
            response.send(jsfile);
        });
    }).on("error", function () {
        callback(null);
    });

});
module.exports = router;