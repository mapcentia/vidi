/*
 * @author     Martin Høgh <mh@mapcentia.com>
 * @copyright  2013-2018 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

var express = require('express');
var router = express.Router();
var request = require('request');
var config = require('../../../config/config.js');
var autoLogin = false; // Auto login is insecure and sets cookie with login creds. DO NOT USE
var autoLoginMaxAge = null;

if (typeof config.autoLoginPossible !== "undefined" && config.autoLoginPossible === true) {
    if (typeof config.extensionConfig !== "undefined" && typeof config.extensionConfig.session !== "undefined") {
        if (typeof config.extensionConfig.session.autoLogin !== "undefined") {
            autoLogin = config.extensionConfig.session.autoLogin;
        }
        if (typeof config.extensionConfig.session.autoLoginMaxAge !== "undefined") {
            autoLoginMaxAge = config.extensionConfig.session.autoLoginMaxAge;
        }
    }
}

/**
 *
 * @type {module.exports.print|{templates, scales}}
 */

var start = function (dataToAuthorizeWith, req, response, status) {
    var options = {
        headers: {'content-type': 'application/json'},
        method: 'POST',
        uri: config.gc2.host + "/api/v2/session/start",
        body: JSON.stringify(dataToAuthorizeWith)
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
        req.session.properties = data.properties;

        console.log("Session started");

        var resBody = {
            success: true,
            message: "Logged in",
            screen_name: data.screen_name,
            email: data.email,
            api_key: data.api_key,
            parentdb: data.parentdb,
            subuser: data.subUser,
            properties: data.properties
        };

        if (autoLogin) {
            resBody.password = dataToAuthorizeWith.password;
            resBody.schema = dataToAuthorizeWith.schema;
            response.cookie('autoconnect.gc2', JSON.stringify(resBody), {
                maxAge: autoLoginMaxAge,
                httpOnly: true
            });
        }

        if (status) {
            resBody.status = status;
            resBody.status.authenticated = true;
        }
        response.send(resBody);
    });

};

router.post('/api/session/start', function (req, response) {
    console.log(req.body)
    if (req.body) {
        start(req.body, req, response);
    }
});

router.get('/api/session/stop', function (req, response) {
    console.log("Session stopped");
    req.session.destroy(function (err) {
        response.cookie('connect.gc2', '', {maxAge: 1})
        response.status(200).send({
            success: true,
            message: "Logged out"
        });
    });
});

router.get('/api/session/status', function (req, response) {
    let autoLoginCookie = req.cookies['autoconnect.gc2'];
    if (autoLogin && autoLoginCookie && !req.session.gc2SessionId) {
        let creds = JSON.parse(autoLoginCookie);
        let credsForGc2 = {
            "user": creds.screen_name,
            "password": creds.password,
            "schema": creds.schema,
            "database": creds.parentdb
        }
        start(credsForGc2, req, response,
            {
                screen_name: creds.screen_name,
                email: creds.email,
                subuser: creds.subUser
            }
        );
    } else {
        response.status(200).send({
            success: true,
            status: {
                authenticated: !!req.session.gc2SessionId,
                screen_name: req.session.gc2UserName,
                email: req.session.gc2Email,
                subuser: req.session.subUser,
                properties: req.session.properties
            }
        });
    }
});

module.exports = router;
