/*
 * @author     Martin Høgh <mh@mapcentia.com>
 * @copyright  2013-2021 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

const express = require('express');
const router = express.Router();
const configUrl = require('../../../config/config.js').configUrl;
const host = require('../../../config/config.js').gc2.host;
const shared = require('../../../controllers/gc2/shared');
const request = require('request');

router.get('/api/symbols/:file', function (req, response) {
    let file = req.params.file, url, json;
    request.get(configUrl + "/" + file, function (err, res, body) {

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

router.post('/api/symbols/:db', function (req, response) {
    let db = req.params.db, symbolState = req.body.symbolState, tag = req.body.tag;
    let {browserId, userId} = shared.getCurrentUserIdentifiers(req);
    // Check for overrides of browser and user ids
    if (req.body.browserId) {
        browserId = req.body.browserId;
    }
    if (req.body.userId) {
        userId = req.body.userId;
    }
    let anonymous = !userId;
    let arr = [];

    try {
        for (const id in symbolState) {
            let p = symbolState[id];
            let sql = `INSERT INTO settings.symbols (id,rotation,scale,zoom,svg,browserid,userid,anonymous,file,the_geom,tag) VALUES ('${id}',${p.rotation},${p.scale},${p.zoomLevel},'${p.svg}','${browserId}','${userId}',${anonymous},'${p.file}',ST_geomfromtext('POINT(${p.coord.lng} ${p.coord.lat})', 4326),'${tag}') ON CONFLICT (id) DO UPDATE SET rotation=${p.rotation},scale=${p.scale},zoom=${p.zoomLevel},svg='${p.svg}',browserid='${browserId}',userid='${userId}',anonymous=${anonymous},file='${p.file}',the_geom=ST_geomfromtext('POINT(${p.coord.lng} ${p.coord.lat})', 4326), tag='${tag}'`;
            arr.push(sql);
        }
    } catch (e) {
        response.header('content-type', 'application/json');
        response.status(500).send({
            success: false,
            message: e.message
        });
        return;
    }
    const newlineSql = arr.join("\n");
    const uri = "/api/v2/sql/" + db;
    const options = {
        method: 'POST',
        uri: host + uri,
        body: newlineSql,
        headers: {
            'GC2-API-KEY': req.session.gc2ApiKey,
            'Content-Type': 'text/plain'
        }
    };

    request(options, function (err, res, body) {
        if (err || res.statusCode !== 200) {
            response.header('content-type', 'application/json');
            response.status(500).send({
                success: false,
                message: body
            });
            return;
        }
        response.header('content-type', 'application/json');
        response.header('Cache-Control', 'no-cache, no-store, must-revalidate');
        response.header('Expires', '0');
        response.header('X-Powered-By', 'MapCentia Vidi');
        response.send(body);
    });
});
module.exports = router;
