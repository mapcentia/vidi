/*
 * @author     Martin Høgh <mh@mapcentia.com>
 * @copyright  2013-2025 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

const express = require('express');
const router = express.Router();
const configUrl = require('../config/config.js').configUrl;
const JsonRefs = require('json-refs');

router.get('/api/config/:db/:file', function (req, response) {
    let file = req.params.file, db = req.params.db, url;

    if (typeof configUrl === "object") {
        url = configUrl[db] || configUrl._default;
    } else {
        url = configUrl;
    }
    url = url + "/" + file;
    console.log(url);

    JsonRefs.clearCache()
    JsonRefs.resolveRefsAt(url, {
        loaderOptions: {
            prepareRequest: function (req2, callback) {
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
