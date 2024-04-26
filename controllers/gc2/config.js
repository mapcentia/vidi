/*
 * @author     Martin Høgh <mh@mapcentia.com>
 * @copyright  2013-2024 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

const express = require('express');
const router = express.Router();
const config = require('../../config/config.js').gc2;
const request = require('request');

router.get('/api/config/:db/', function (req, response) {
    let db = req.params.db, url;
    url = config.host + "/api/v2/configuration/" + db;

    request.get(url, function (err, res, body) {
        if (err) {
            response.header('content-type', 'application/json');
            response.status(400).send({
                success: false,
                message: "Could not get the configs"
            });
            return;
        }
        response.send(JSON.parse(body));
    })
});
module.exports = router;
