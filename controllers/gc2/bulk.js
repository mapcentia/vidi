/*
 * @author     Martin Høgh <mh@mapcentia.com>
 * @copyright  2013-2021 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

const express = require('express');
const router = express.Router();
const config = require('../../config/config.js').gc2;
const request = require('request');

router.post('/api/bulk/:db', function (req, response) {
    let db = req.params.db, body = req.body, userName;

    // Check if user is a sub user
    if (req.session.screenName && req.session.subUser) {
        userName = req.session.screenName + "@" + db;
    } else {
        userName = db;
    }

    const uri = "/api/v2/sql/" + userName;

    const options = {
        method: 'POST',
        uri: config.host + uri,
        body: body,
        headers: {
            'GC2-API-KEY': req.session.gc2ApiKey,
            'Content-Type': 'text/plain'
        }
    };

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
module.exports = router
