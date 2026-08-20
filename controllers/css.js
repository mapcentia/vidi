/*
 * @author     Martin Høgh <mh@mapcentia.com>
 * @copyright  2013-2021 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */


let express = require('express');
let router = express.Router();
let configUrl = require('../config/config.js').configUrl;
let fetchUrl = require('fetch').fetchUrl;

router.get('/api/css/:db/:folder?/:file', function (req, response) {
    let file = req.params.file, db = req.params.db, url;
    let folder = req.params?.folder;

    if (folder) {
       file = folder + "/" + file;
    }

    if (typeof configUrl === "object") {
        url = configUrl[db] || configUrl._default;
    } else {
        url = configUrl;
    }

    console.log("Getting css file", url + "/" + file);

    fetchUrl(url + "/" + file, function (err, meta, body) {
        if (err || meta.status !== 200) {
            response.header('content-type', 'application/json');
            response.status(400).send({
                success: false,
                message: "Could not get the requested css file."
            });
            return;
        }
        response.header('content-type', 'text/css');
        response.send(body.toString());
    });
});
module.exports = router;
