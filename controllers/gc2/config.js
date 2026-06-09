/*
 * @author     Martin Høgh <mh@mapcentia.com>
 * @copyright  2013-2026 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

const express = require('express');
const router = express.Router();
const config = require('../../config/config.js').gc2;
const JsonRefs = require('json-refs');

router.get('/api/gc2/config/:db/:id?', async function (req, response) {
    const db = req.params.db;
    const id = req.params.id?.replace('.json', '');

    const url = config.host + "/api/v2/configuration/" + db + (id ? "/" + id : "");

    let headers = {
        Cookie: "PHPSESSID=" + req?.session?.gc2SessionId
    }

    const res = await fetch(url, {headers});
    if (res.status !== 200) {
        response.header('content-type', 'application/json');
        response.status(403).send({
            success: false,
            message: "Could not get the requested config JSON file."
        });
        return;
    }

    const data = JSON.parse(await res.text());
    const parsedData = id ? JSON.parse(JSON.parse(data.data.value).body) : data;
    JsonRefs.clearCache();
    try {
        const r = await JsonRefs.resolveRefs(parsedData);
        response.send(r.resolved);
    } catch (e) {
        response.header('content-type', 'application/json');
        response.status(e.status).send({
            success: false,
            message: "Could not get the requested config JSON file."
        });
    }
});
module.exports = router;
