/*
 * @author     Martin Høgh <mh@mapcentia.com>
 * @copyright  2013-2022 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

const express = require('express');
const router = express.Router();
const config = require('../../config/config.js');
const request = require('request');
const utf8 = require('utf8');
let app = express();

router.get('/api/meta/:db/:schema', function (req, response) {
    const db = req.params.db
    const schema = req.params.schema;
    const addedSchemata = typeof config.addedSchemata !== "undefined" ? "," + config.addedSchemata : "";
    let url, options;
    let headers = {
        Cookie: "PHPSESSID=" + req.session.gc2SessionId
    }
    if (app.get('env') === 'test') {
        headers.Cookie += "; XDEBUG_SESSION=XDEBUG_SESSION;";
    }
    url = config.gc2.host + "/api/v1/meta/" + db + "/" + utf8.encode(schema) + addedSchemata;
    options = {
        uri: url,
        encoding: 'utf8',
        headers
    };

    console.log("Getting Meta")
    console.log(url)
    console.log(headers)


    request.get(options,
        function (err, res, body) {
            if (err) {
                response.header('content-type', 'application/json');
                response.status(400).send({
                    success: false,
                    message: "Could not get the meta data."
                });

                return;
            }
            console.log(JSON.parse(body).auth, JSON.parse(body).cache)
            response.send(JSON.parse(body));
        })
});
module.exports = router;

