/*
 * @author     Martin Høgh <mh@mapcentia.com>
 * @copyright  2013-2022 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

const express = require('express');
const router = express.Router();
const config = require('../../config/config.js').gc2;
const request = require('request');

router.all('/api/feature/:db/:layer/:param', function (req, response) {
    const db = req.params.db, layer = req.params.layer, param = req.params.param, body = req.body;
    let userName;

    // Check if user is a sub user
    if (req.session.screenName && req.session.subUser) {
        userName = req.session.screenName + "@" + db;
    } else {
        userName = db;
    }
    const uri = "/api/v2/feature/" + userName + "/" + layer + "/4326/"  + param;
    const options = {
        method: req.method,
        uri: config.host + uri,
        json: body,
        headers: {
            'Cookie': "XDEBUG_SESSION=XDEBUG_SESSION;PHPSESSID=" + req.session.gc2SessionId,
        }
    };
    request(options, function (err, res, body) {
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
