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
    var postData = {};
    if (req.body.u) {
        postData = {
            user: req.body.u,
            password: req.body.p,
            schema: req.body.s
        };

        if (req.body.d) {
            postData.database = req.body.d;
        }
    }

    var options = {
        headers: {'content-type': 'application/json'},
        method: 'POST',
        uri: config.gc2.host + "/api/v2/session/start",
        form: JSON.stringify(postData)
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

        data = (`data` in data ? data.data : data);
        req.session.gc2SessionId = data.session_id;
        req.session.gc2ApiKey = data.api_key;
        req.session.gc2Email = data.email;
        req.session.gc2UserName = data.screen_name;
        req.session.subUser = data.subuser;
        req.session.screenName = data.screen_name;
        req.session.parentDb = data.parentdb;

        console.log(req.session.gc2SessionId);


        console.log("Session started");
        response.send({
            success: true,
            message: "Logged in",
            screen_name: data.screen_name,
            email: data.email,
            api_key: data.api_key,
            parentdb: data.parentdb,
            subuser: data.subUser
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
            screen_name: req.session.gc2UserName,
            email: req.session.gc2Email,
            subuser: req.session.subUser
        }
    });
});

module.exports = router;