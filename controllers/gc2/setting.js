/*
 * @author     Martin Høgh <mh@mapcentia.com>
 * @copyright  2013-2018 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

var express = require('express');
var router = express.Router();
var http = require('http');
var config = require('../../config/config.js').gc2;
var request = require('request');

router.get('/api/setting/:db/:schema', function (req, response) {
    var db = req.params.db, url;
    url = config.host + "/api/v1/setting/" + db;

    request.get(url, function (err, res, body) {

        if (err) {

            response.header('content-type', 'application/json');
            response.status(400).send({
                success: false,
                message: "Could not get the settings data."
            });

            return;
        }

        response.send(JSON.parse(body));
    })
});
module.exports = router;
