/*
 * @author     Alexander Shumilov
 * @copyright  2013-2018 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

var express = require('express');
var router = express.Router();
var config = require('../config/config.js');

// Require extensions
if (typeof config.extensions !== "undefined" && typeof config.extensions.server !== "undefined") {
    config.extensions.server.forEach(function (v, i) {
            v[Object.keys(v)[0]].forEach(function (m, n) {
                    router.use(require('./' + Object.keys(v)[0] + '/server/' + m + ".js"));
                }
            )
        }
    );
}
module.exports = router;