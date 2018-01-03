var express = require('express');
var router = express.Router();
var http = require('http');
var config = require('../../config/config.js').gc2;
var request = require('request');
var utf8 = require('utf8');

router.get('/api/meta/:db/:schema', function (req, response) {
    var db = req.params.db, schema = req.params.schema, url, data = [];
    url = config.host + "/api/v1/meta/" + db + "/" + utf8.encode(schema);

    console.log(url);

    request.get({
            uri: url,
            encoding: 'utf8'
        },

        function (err, res, body) {

            if (err) {

                response.header('content-type', 'application/json');
                response.status(400).send({
                    success: false,
                    message: "Could not get the meta data."
                });

                return;
            }

            response.send(JSON.parse(body));
        })
});
module.exports = router;

