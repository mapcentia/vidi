/*
 * @author     Martin Høgh <mh@mapcentia.com>
 * @copyright  2013-2025 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

const express = require('express');
const router = express.Router();
const config = require('../../config/config.js').gc2;
const request = require('request');

router.all('/api/gc2/oauth', function (req, response) {
    const url = config.host + req.url.replace('/api/gc2/oauth', '/api/v4/oauth');
    const options = {
        method: req.method,
        uri: url
    };

    if (req.method === 'POST') {
        options.form = req.body;
    }

    request(options)
        .on('error', function (err) {
            response.header('content-type', 'application/json');
            response.status(400).send({
                success: false,
                message: "Could not proxy the request."
            });
        })
        .pipe(response);
});

module.exports = router;
