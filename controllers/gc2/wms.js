/*
 * @author     Martin Høgh <mh@mapcentia.com>
 * @copyright  2013-2026 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

const express = require('express');
const router = express.Router();
const config = require('../../config/config.js').gc2;
const {Readable} = require('stream');

const proxifyRequest = async (req, response) => {
    let requestURL = config.host + encodeURI(decodeURIComponent(req.url.substr(4)));

    // Rewrite URL in case of subUser
    if (req?.session?.subUser && !req.url.includes('/mapcache/')) {
        requestURL = requestURL.replace(`/${req.session.parentDb}/`, `/${req.session.screenName}@${req.session.parentDb}/`);
    }

    const headers = {};
    if (req?.session?.gc2SessionId) {
        headers.Cookie = "PHPSESSID=" + req.session.gc2SessionId + ";";
    }

    let upstream;
    try {
        upstream = await fetch(requestURL, {method: 'GET', headers});
    } catch (e) {
        console.error(e);
        if (!response.headersSent) response.status(502).end();
        return;
    }

    response.writeHead(upstream.status, {
        'content-type': upstream.headers.get('content-type') || 'application/octet-stream'
    });

    if (!upstream.body) {
        response.end();
        return;
    }

    const nodeStream = Readable.fromWeb(upstream.body);
    nodeStream.on('error', (e) => {
        console.error(e);
        response.end();
    });
    nodeStream.pipe(response);
};

router.all('/api/wms/:db/:schema', proxifyRequest);
router.all('/api/mapcache/:db/wms', proxifyRequest);
router.all('/api/mapcache/:db/gmaps/*', proxifyRequest);

module.exports = router;
