var express = require('express');
var router = express.Router();
var config = require('../../config/config.js').gc2;
var request = require('request');

router.post('/api/sql/:db', function (req, response) {
    var db = req.params.db, q = req.body.q, srs = req.body.srs, lifetime = req.body.lifetime, client_encoding = req.body.client_encoding, base64 = req.body.base64;

    var postData = "q=" + encodeURIComponent(q) + "&base64=" + (base64 === "true" ? "true": "false") + "&srs=" + srs + "&lifetime=" + lifetime + "&client_encoding=" + client_encoding + "&key=" +req.session.gc2ApiKey, options;

    if (req.body.key && !req.session.gc2ApiKey) {
        postData = postData + "&key=" + req.body.key;
    }

    options = {
        method: 'POST',
        uri: config.host + "/api/v1/sql/" + db,
        form: postData
    };

    request(options, function (err, res, body) {

        if (err) {

            response.header('content-type', 'application/json');
            response.status(400).send({
                success: false,
                message: "Could not get the sql data."
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
