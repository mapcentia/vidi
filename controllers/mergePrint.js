/*
 * @author     Martin Høgh <mh@mapcentia.com>
 * @copyright  2013-2020 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */
require('dotenv').config();

let express = require('express');
let router = express.Router();
const PDFMerge = require('pdf-merge');


/**
 *
 * @type {module.exports.print|{templates, scales}}
 */
router.post('/api/mergePrint', function (req, response) {
        req.setTimeout(0); // no timeout
        let files = req.body.map((key)=> `${__dirname}/../public/tmp/print/pdf/${key}.pdf`);
        let key = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
        PDFMerge(files, {output: `${__dirname}/../public/tmp/print/pdf/${key}.pdf`})
            .then((buffer) => {
                response.send({success: true, key});
            });
    }
);

module.exports = router;
