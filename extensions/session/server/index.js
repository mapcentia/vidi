/*
 * @author     Martin Høgh <mh@mapcentia.com>
 * @copyright  2013-2021 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

let express = require('express');
let router = express.Router();
let request = require('request');
let config = require('../../../config/config.js');
let autoLogin = false; // Auto login is insecure and sets cookie with login creds. DO NOT USE
const autoConnectCookie = 'autoconnect.gc2';
let autoLoginMaxAge = null;

if (config?.autoLoginPossible === true) {
    if (config?.extensionConfig?.session) {
        if (config?.extensionConfig?.session?.autoLogin) {
            autoLogin = config.extensionConfig.session.autoLogin;
        }
        if (config?.extensionConfig?.session?.autoLoginMaxAge) {
            autoLoginMaxAge = config.extensionConfig.session.autoLoginMaxAge;
        }
    }
}

/**
 *
 * @type {module.exports.print|{templates, scales}}
 */

let start = function (dataToAuthorizeWith, req, response, status) {
    let options = {
        headers: { 'content-type': 'application/json' },
        method: 'POST',
        uri: config.gc2.host + "/api/v2/session/start",
        body: JSON.stringify(dataToAuthorizeWith)
    };

    request(options, function (err, res, body) {
        let data;
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
        
        if (!autoLogin) {
            try{
              res.cookie(autoConnectCookie, '', {maxAge: -1});
              console.log(autoConnectCookie + " removed");
            } catch (e){
                console.log(autoConnectCookie + " not removed");
            }
            
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

        console.log("Session started.", "User:", data.screen_name, "Database:", data.parentdb, "Has autologin:", autoLogin, autoLoginMaxAge);

        let resBody = {
            success: true,
            message: "Logged in",
            screen_name: data.screen_name,
            email: data.email,
            api_key: data.api_key,
            parentdb: data.parentdb,
            subuser: data.subUser,
            properties: data.properties
        };

        // If autoLoginMaxAge is NaN, or less than 1000, default it to 1 month
        if (isNaN(autoLoginMaxAge) || autoLoginMaxAge < 1000) {
            autoLoginMaxAge = 2629800000;
        }

        // IF autologin is enabled, and autoLoginMaxAge is not NaN
        if (autoLogin && !isNaN(autoLoginMaxAge)) {
            resBody.password = dataToAuthorizeWith.password;
            resBody.schema = dataToAuthorizeWith.schema;
            response.cookie(autoConnectCookie, JSON.stringify(resBody), {
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
    if (req.body) {
        start(req.body, req, response);
    }
});

router.get('/api/session/stop', function (req, response) {
    console.log("Session stopped");
    req.session.destroy(function () {
        response.cookie('connect.gc2', '', { maxAge: -1 })
        response.cookie(autoConnectCookie, '', { maxAge: -1 })
        response.status(200).send({
            success: true,
            message: "Logged out"
        });
    });
});

router.get('/api/session/status', function (req, response) {


    let autoLoginCookie = req.cookies[autoConnectCookie];
    
    if (req.query.autoLogin) {
        // set autoLogin to false if it is anything but "true"
        autoLogin = req.query.autoLogin === "true" ? true : false;
    }
    if (req.query.autoLoginMaxAge) {
        autoLoginMaxAge = typeof parseInt(req.query.autoLoginMaxAge) === "number" ? parseInt(req.query.autoLoginMaxAge) : 2629800000; // Eller hvad nu default skal være. (1 måned)
    }
    //hvis autoLogin er false, slet autologin-cookie
    if (!autoLogin) {
        try{
          response.cookie(autoConnectCookie, '', { maxAge: -1 })
          response.clearCookie(autoConnectCookie)
        }  catch(e) {
            console.log(e);
        }
    }       

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
