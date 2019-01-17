/*
 * @author     Martin Høgh <mh@mapcentia.com>
 * @copyright  2013-2018 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

var express = require('express');
var router = express.Router();
var config = require('../../config/config.js').gc2;
var request = require('request');
var fs = require('fs');

router.all('/api/tileRequestProxy', (req, response) => {
    let requestURL = decodeURIComponent(req.url.substr(req.url.indexOf('?request=') + 9));

    if (requestURL.indexOf(config.host) === 0) {
        if (req.session.gc2SessionId) {
            request({
                method: 'GET',
                encoding: 'utf8',
                uri: requestURL,
                headers: {
                    Cookie: "PHPSESSID=" + req.session.gc2SessionId + ";"
                }
            }).pipe(response);
        } else {
            response.status(400);
            response.send(`Proxy can be used only for authenticated users`);
        }
    } else {
        response.status(403);
        response.send(`Forbidden, only requests to MapCentia backend are allowed`);
    }
});

module.exports = router;