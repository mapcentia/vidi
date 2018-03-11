var express = require('express');
var router = express.Router();
var config = require('../config/config.js').gc2;
var request = require('request');

router.put('/api/feature/:db/:layer/:srs', function (req, response) {
    var db = req.params.db, layer = req.params.layer, srs = req.params.srs, body = req.body, userName;

    // Check if user is a sub user
    if (req.session.gc2UserName && req.session.subUser) {
        userName = req.session.subUser + "@" + db;
    } else {
        userName = db;
    }

    var uri = "/api/v2/feature/" + userName + "/" + layer + "/"  + srs;

    var options = {
        method: 'PUT',
        uri: config.host + uri,
        json: body,
        headers: {
            'GC2-API-KEY': req.session.gc2ApiKey
        }
    };

    console.log(body)

    request(options, function (err, res, body) {

        console.log(res.statusCode)

        if (err || res.statusCode !== 200) {

            response.header('content-type', 'application/json');
            response.status(500).send({
                success: false,
                message: body
            });

            return;
        }

        response.header('content-type', 'application/json');
        response.header('Cache-Control', 'no-cache, no-store, must-revalidate');
        response.header('Expires', '0');
        response.header('X-Powered-By', 'MapCentia Vidi');

        response.send(body);
    });


});
module.exports = router;
