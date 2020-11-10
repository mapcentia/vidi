/*
 * @author     Martin Høgh <mh@mapcentia.com>
 * @copyright  2013-2020 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

var express = require('express');
var router = express.Router();
var host = require('../config/config.js').gc2.host;
var request = require('request');

router.get('/api/localconfig', function (req, response) {
    var file = req.query.file;
    var url = host + file;
    var json;
    request.get(url, function (err, res, body) {
        if (err || res.statusCode !== 200) {
            response.header('content-type', 'application/json');
            response.status(400).send({
                success: false,
                message: "Could not get the requested config JSON file."
            });
            return;
        }
        try {
            json = JSON.parse(body);
        } catch (e) {
            response.status(400).send({
                success: false,
                message: e.message
            });
            return;
        }
        response.send(JSON.parse(body));
    })
});
module.exports = router;
