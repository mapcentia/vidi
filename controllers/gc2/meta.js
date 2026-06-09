/*
 * @author     Martin Høgh <mh@mapcentia.com>
 * @copyright  2013-2026 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

const express = require('express');
const router = express.Router();
const config = require('../../config/config.js');
const utf8 = require('utf8');
let app = express();

router.get('/api/meta/:db/:schema', async function (req, response) {
    const db = req.params.db;
    const schema = req.params.schema;
    const addedSchemata = typeof config.addedSchemata !== "undefined" ? "," + config.addedSchemata : "";
    let headers = {
        Cookie: "PHPSESSID=" + req?.session?.gc2SessionId
    }
    if (app.get('env') === 'test') {
        headers.Cookie += "; XDEBUG_SESSION=XDEBUG_SESSION;";
    }
    const url = config.gc2.host + "/api/v1/meta/" + db + "/" + utf8.encode(schema) + addedSchemata;

    let res, body;
    try {
        res = await fetch(url, {headers});
        body = await res.text();
    } catch (err) {
        response.header('content-type', 'application/json');
        response.status(400).send({
            success: false,
            message: "Could not get the meta data."
        });
        return;
    }

    if (res.status !== 200) {
        let message = "Could not get the meta data.";
        try {
            if (body) message = JSON.parse(body).message;
        } catch (e) {
        }
        response.header('content-type', 'application/json');
        response.status(400).send({
            success: false,
            message
        });
        return;
    }
    response.send(JSON.parse(body));
});
module.exports = router;
