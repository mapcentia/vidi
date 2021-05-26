/*
 * @author     Martin Høgh <mh@mapcentia.com>
 * @copyright  2013-2020 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

var express = require('express');
var router = express.Router();

router.use(require('./gc2/meta'));
router.use(require('./gc2/stateSnapshots'));
router.use(require('./gc2/setting'));
router.use(require('./gc2/baseLayer'));
router.use(require('./gc2/requestProxy'));
router.use(require('./gc2/wms'));
router.use(require('./gc2/keyValue'));
router.use(require('./gc2/legend'));
router.use(require('./gc2/sql'));
router.use(require('./gc2/elasticsearch'));
router.use(require('./gc2/feature'));
router.use(require('./print'));
router.use(require('./locale'));
router.use(require('./config'));
router.use(require('./localConfig'));
router.use(require('./static'));
router.use(require('./template'));
router.use(require('./css'));

module.exports = router;
