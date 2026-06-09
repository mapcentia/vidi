/*
 * @author     Martin Høgh <mh@mapcentia.com>
 * @copyright  2013-2026 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

const express = require('express');
const router = express.Router();
const config = require('../../config/config.js').gc2;

router.post('/api/elasticsearch/search/:db/:schema/:relation', async function (req, response) {
    const schema = req.params.schema;
    const db = req.params.db;
    const relation = req.params.relation;
    const url = config.host + `/api/v2/elasticsearch/search/${db}/${schema}/${relation}`;

    const res = await fetch(url, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(req.body)
    });
    const text = await res.text();

    if (res.status !== 200) {
        response.header('content-type', 'application/json');
        response.status(400).send({
            success: false,
            message: "Could not get data."
        });
        return;
    }
    response.send(text);
});
module.exports = router;
