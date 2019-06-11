/*
 * @author     Martin Høgh <mh@mapcentia.com>
 * @copyright  2013-2018 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

var express = require('express');
var router = express.Router();
var configUrl = require('../config/config.js').configUrl;
var fetchUrl = require('fetch').fetchUrl;

router.get('/api/template/:db/:file', function (req, response) {
    var file = req.params.file, db = req.params.db, url, rem;

    if (typeof configUrl === "object") {
        url = configUrl[db] || configUrl._default;
    } else {
        url = configUrl;
    }

    console.log(url + "/" + file);

    options = {
        method: 'GET',
        uri: url + "/" + file
    };

    fetchUrl(url + "/" + file, function (err, meta, body) {
        if (err || meta.status !== 200) {
            response.header('content-type', 'application/json');
            response.status(400).send({
                success: false,
                message: "Could not get the requested template file."
            });
            return;
        }
        response.header('content-type', 'text/plain');
        response.send(body.toString());
    });
});
module.exports = router;
