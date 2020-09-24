/*
 * @author     Martin Høgh <mh@mapcentia.com>
 * @copyright  2013-2018 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

var express = require('express');
var router = express.Router();
var config = require('../../config/config.js');
var request = require('request');
var utf8 = require('utf8');

router.get('/api/meta/:db/:schema', function (req, response) {
    var db = req.params.db, schema = req.params.schema, url, options;

    var addedSchemata = typeof config.addedSchemata !== "undefined" ? "," + config.addedSchemata : "";

    url = config.gc2.host + "/api/v1/meta/" + db + "/" + utf8.encode(schema) + addedSchemata;
    options = {
        uri: url,
        encoding: 'utf8',
        headers: {
            Cookie: "PHPSESSID=" + req.session.gc2SessionId + ";" // GC2's Meta API is session based
        }
    };

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
            response.send(JSON.parse(body));
        })
});
module.exports = router;

