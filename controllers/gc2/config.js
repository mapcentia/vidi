/*
 * @author     Martin Høgh <mh@mapcentia.com>
 * @copyright  2013-2025 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

const express = require('express');
const router = express.Router();
const config = require('../../config/config.js').gc2;
const request = require('request');
const JsonRefs = require('json-refs');

router.get('/api/gc2/config/:db/:id?', function (req, response) {
    let url;
    const db = req.params.db;
    const id = req.params.id?.replace('.json', '');

    url = config.host + "/api/v2/configuration/" + db + (id ? "/" + id : "");

    let headers = {
        Cookie: "PHPSESSID=" + req?.session?.gc2SessionId
    }
    let options = {
        uri: url,
        encoding: 'utf8',
        headers
    };

    request.get(options, function (err, res, body) {
        if (res.statusCode !== 200) {
            response.header('content-type', 'application/json');
            response.status(403).send({
                success: false,
                message: "Could not get the configs"
            });
            return;
        }
        const data = JSON.parse(body);
        const parsedData = id ? JSON.parse(JSON.parse(data.data.value).body) : data;
        JsonRefs.clearCache()
        JsonRefs.resolveRefs(parsedData).then(r => {
            response.send(r.resolved);
        }).catch(e => {
            console.log(e);
        })

    })
});
module.exports = router;
