/*
 * @author     Martin Høgh <mh@mapcentia.com>
 * @copyright  2013-2026 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

const express = require('express');
const router = express.Router();
const config = require('../../config/config.js').gc2;

router.get('/api/legend/:db', async function (req, response) {

    const l = req.query.l, db = req.params.db;
    const url = config.host + "/api/v1/legend/json/" + db + "?l=" + encodeURIComponent(l);

    // Network errors reject here and are forwarded to the central
    // error handler by express-async-errors (async handler).
    const res = await fetch(url, {
        headers: {
            Cookie: "PHPSESSID=" + req?.session?.gc2SessionId
        }
    });

    const body = await res.text();
    let data, parseError = false;
    try {
        data = JSON.parse(body);
    } catch (e) {
        parseError = true;
    }

    if (!res.ok || parseError) {
        response.header('content-type', 'application/json');
        response.status(400).send({
            success: false,
            message: "Could not get the legend data."
        });
        return;
    }

    response.send(data);
});
module.exports = router;
