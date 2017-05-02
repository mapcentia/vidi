var express = require('express');
var router = express.Router();
var http = require('http');
var config = require('../../config/config.js').gc2;
var request = require('request');

router.get('/api/legend/:db', function (req, response) {
    var l = req.query.l, db = req.params.db, url, jsfile;
    url = config.host + "/api/v1/legend/json/" + db + "?l=" + l;

    request.get(url, function (err, res, body) {

        if (err) {

            response.header('content-type', 'application/json');
            response.status(400).send({
                success: false,
                message: "Could not get the legend data."
            });

            return;
        }

        response.send(JSON.parse(body));
    })

});
module.exports = router;