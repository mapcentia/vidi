/*
 * @author     Martin Høgh <mh@mapcentia.com>
 * @copyright  2013-2026 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

const express = require('express');
const router = express.Router();
const config = require('../../config/config.js').gc2;

router.get('/api/setting/:db/:schema', async function (req, response) {
    const db = req.params.db;
    const url = config.host + "/api/v1/setting/" + db;

    let res;
    try {
        res = await fetch(url);
    } catch (err) {
        response.header('content-type', 'application/json');
        response.status(400).send({
            success: false,
            message: "Could not get the settings data."
        });
        return;
    }

    // JSON parse errors propagate to the central error handler (500).
    response.send(await res.json());
});
module.exports = router;
