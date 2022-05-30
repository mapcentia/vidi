/*
 * @author     Martin Høgh <mh@mapcentia.com>
 * @copyright  2013-2022 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

const express = require('express');
const router = express.Router();
const config = require('../../config/config.js').gc2;
const request = require('request');

const proxifyRequest = (req, response) => {
    let requestURL = config.host + encodeURI(decodeURIComponent(req.url.substr(4)));

    // Rewrite URL in case of subUser
    if (req.session.subUser && !req.url.includes('/mapcache/')) {
        requestURL = requestURL.replace(`/${req.session.parentDb}/`, `/${req.session.screenName}@${req.session.parentDb}/`);
    }

    let options = {
        method: 'GET',
        uri: requestURL
    };

    if (req.session.gc2SessionId) {
        options.headers = {Cookie: "PHPSESSID=" + req.session.gc2SessionId + ";"}
    }

    request(options).pipe(response);
};

router.all('/api/wms/:db/:schema', proxifyRequest);
router.all('/api/mapcache/:db/wms', proxifyRequest);
router.all('/api/mapcache/:db/gmaps/*', proxifyRequest);

module.exports = router;
