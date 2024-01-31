/*
 * @author     Martin Høgh <mh@mapcentia.com>
 * @copyright  2013-2024 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 *
 */

const express = require('express');
const router = express.Router();
const host = require('../config/config.js').gc2.host;
const JsonRefs = require('json-refs');


router.get('/api/localconfig', function (req, response) {
    const file = req.query.file;
    const url = host + file;
    JsonRefs.clearCache()
    JsonRefs.resolveRefsAt(url, {
        loaderOptions: {
            prepareRequest: function (req2, callback) {
                req2.header = {
                    'Cookie': "XDEBUG_SESSION=XDEBUG_SESSION;PHPSESSID=" + req?.session?.gc2SessionId
                }
                callback(undefined, req2);
            }
        },
    }).then(r => {
        response.send(r.resolved);
    }).catch(e => {
        response.header('content-type', 'application/json');
        response.status(e.status).send({
            success: false,
            message: "Could not get the requested config JSON file."
        });
    })
});
module.exports = router;
