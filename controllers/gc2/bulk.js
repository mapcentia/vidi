/*
 * @author     Martin Høgh <mh@mapcentia.com>
 * @copyright  2013-2026 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

const express = require('express');
const router = express.Router();
const config = require('../../config/config.js').gc2;

router.post('/api/bulk/:db', async function (req, response) {
    let db = req.params.db, body = req.body, userName;

    // Check if user is a sub user
    if (req.session.screenName && req.session.subUser) {
        userName = req.session.screenName + "@" + db;
    } else {
        userName = db;
    }

    const uri = "/api/v2/sql/" + userName;

    const res = await fetch(config.host + uri, {
        method: 'POST',
        headers: {
            'GC2-API-KEY': req.session.gc2ApiKey,
            'Content-Type': 'text/plain'
        },
        body: body
    });
    const text = await res.text();

    if (res.status !== 200) {
        response.header('content-type', 'application/json');
        response.status(500).send({
            success: false,
            message: text
        });
        return;
    }

    response.header('content-type', 'application/json');
    response.header('Cache-Control', 'no-cache, no-store, must-revalidate');
    response.header('Expires', '0');
    response.header('X-Powered-By', 'MapCentia Vidi');

    response.send(text);
});
module.exports = router
