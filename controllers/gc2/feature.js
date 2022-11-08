/*
 * @author     Martin Høgh <mh@mapcentia.com>
 * @copyright  2013-2018 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

var express = require('express');
var router = express.Router();
var config = require('../../config/config.js').gc2;
var request = require('request');
let app = express();

router.put('/api/feature/:db/:layer/:srs', function (req, response) {
    var db = req.params.db, layer = req.params.layer, srs = req.params.srs, body = req.body, userName;

    // Check if user is a sub user
    if (req.session.screenName && req.session.subUser) {
        userName = req.session.screenName + "@" + db;
    } else {
        userName = db;
    }

    var uri = "/api/v2/feature/" + userName + "/" + layer + "/"  + srs;

    let headers = {
        'GC2-API-KEY': req.session.gc2ApiKey
    }
    if (app.get('env') === 'test') {
        headers.Cookie = "XDEBUG_SESSION=XDEBUG_SESSION;";
    }

    var options = {
        method: 'PUT',
        uri: config.host + uri,
        json: body,
        headers
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

router.post('/api/feature/:db/:layer/:srs', function (req, response) {
    var db = req.params.db, layer = req.params.layer, srs = req.params.srs, body = req.body, userName;

    // Check if user is a sub user
    if (req.session.screenName && req.session.subUser) {
        userName = req.session.screenName + "@" + db;
    } else {
        userName = db;
    }

    var uri = "/api/v2/feature/" + userName + "/" + layer + "/"  + srs;

    var options = {
        method: 'POST',
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

router.delete('/api/feature/:db/:layer/:gid', function (req, response) {
    var db = req.params.db, layer = req.params.layer, gid = req.params.gid, body = req.body, userName;

    // Check if user is a sub user
    if (req.session.screenName && req.session.subUser) {
        userName = req.session.screenName + "@" + db;
    } else {
        userName = db;
    }

    var uri = "/api/v2/feature/" + userName + "/" + layer + "/4326/"  + gid;

    console.log(uri)

    var options = {
        method: 'DELETE',
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
