var express = require('express');
var router = express.Router();
var configUrl = require('../config/config.js').configUrl;
var request = require('request');

router.get('/api/config/:db/:file', function (req, response) {
    var file = req.params.file, db = req.params.db, url;

    if (typeof configUrl === "object") {
        url = configUrl[db] || configUrl._default;
    } else {
        url = configUrl;
    }

    console.log(url + "/" + file);

    request.get(url + "/" + file, function (err, res, body) {

        if (err || res.statusCode !== 200) {

            response.header('content-type', 'application/json');
            response.status(400).send({
                success: false,
                message: "Could not get the requested config JSON file."
            });

            return;
        }

        response.send(JSON.parse(body));
    })
});
module.exports = router;
