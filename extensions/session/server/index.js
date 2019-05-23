/*
 * @author     Martin Høgh <mh@mapcentia.com>
 * @copyright  2013-2018 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

var express = require('express');
var router = express.Router();
var request = require('request');

/**
 *
 * @type {module.exports.print|{templates, scales}}
 */
var config = require('../../../config/config.js');

router.post('/api/session/start', function (req, response) {
    var postData;

    if (req.body.u) {
        postData = "u=" + req.body.u + "&p=" + req.body.p + "&s=" + req.body.s + "";
    }

    var options = {
        method: 'POST',
        uri: config.gc2.host + "/api/v1/session/start",
        form: postData
    };

    request(options, function (err, res, body) {

        var data;

        response.header('content-type', 'application/json');
        response.header('Cache-Control', 'no-cache, no-store, must-revalidate');
        response.header('Expires', '0');
        response.header('X-Powered-By', 'MapCentia Vidi');

        if (err || res.statusCode !== 200) {
            response.status(401).send({
                success: false,
                message: "Could not log in"
            });
            return;
        }

        try {
            data = JSON.parse(body);
        } catch (e) {
            response.status(500).send({
                success: false,
                message: "Could not parse response from GC2",
                data: body
            });
            return;
        }

        if (req.session.gc2SessionId) {
            response.status(200).send({
                success: true,
                message: "Already logged in"
            });
            return;
        }

        req.session.gc2SessionId = data.session_id;
        req.session.gc2ApiKey = data.api_key;
        req.session.gc2UserName = data.subuser ? data.subuser : data.screen_name;
        req.session.subUser = data.subuser;
        req.session.screenName = data.screen_name;

        console.log("Session started");
        response.send({
            success: true,
            message: "Logged in"
        });
    });

});

router.get('/api/session/stop', function (req, response) {
    console.log("Session stopped");
    req.session.destroy(function (err) {
        response.status(200).send({
            success: true,
            message: "Logged out"
        });
    });
});

router.get('/api/session/status', function (req, response) {
    response.status(200).send({
        success: true,
        status: {
            authenticated: !!req.session.gc2SessionId,
            userName: req.session.gc2UserName
        }
    });
});

module.exports = router;