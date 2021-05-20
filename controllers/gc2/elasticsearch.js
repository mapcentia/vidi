/*
 * @author     Martin Høgh <mh@mapcentia.com>
 * @copyright  2013-2020 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

let express = require('express');
let router = express.Router();
let config = require('../../config/config.js').gc2;
let request = require('request');

router.post('/api/elasticsearch/search/:db/:schema/:relation', function (req, response) {
    let schema = req.params.schema;
    let db = req.params.db;
    let relation = req.params.relation;
    let body = req.body
    let url = config.host + `/api/v2/elasticsearch/search/${db}/${schema}/${relation}`;
    let options = {
        method: 'POST',
        uri: url,
        json: body,
        headers: {}
    };
    request.post(options, function (err, res, body) {
        if (err || res.statusCode !== 200) {
            response.header('content-type', 'application/json');
            response.status(400).send({
                success: false,
                message: "Could not get data."
            });
            return;
        }
        response.send(body);
    })
});
module.exports = router;
