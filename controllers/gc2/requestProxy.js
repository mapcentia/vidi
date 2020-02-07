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

const proxifyRequest = (req, response) => {
    let requestURL = decodeURIComponent(req.url.substr(req.url.indexOf('?request=') + 9));

    // Rewrite URL in case of subUser
    if (req.session.subUser) {
        requestURL = requestURL.replace(`/${req.session.parentDb}/`, `/${req.session.screenName}@${req.session.parentDb}/`);
    }

    console.log(requestURL);

    if (requestURL.indexOf(config.host) === 0) {
        let options = {
            method: 'GET',
            encoding: 'utf8',
            uri: requestURL
        };

        if (req.session.gc2SessionId) {
            options.headers = {Cookie: "PHPSESSID=" + req.session.gc2SessionId + ";"}
        }

        request(options).pipe(response);
    } else {
        response.status(403);
        response.send(`Forbidden, only requests to MapCentia backend are allowed`);
    }
};

router.all('/api/tileRequestProxy', proxifyRequest);
router.all('/api/requestProxy', proxifyRequest);

module.exports = router;