/*
 * @author     Martin Høgh <mh@mapcentia.com>
 * @copyright  2013-2018 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

var express = require('express');
var router = express.Router();
var backend = require('../config/config.js').backend;

router.use(require('./' + backend + '/meta'));
router.use(require('./' + backend + '/stateSnapshots'));
router.use(require('./' + backend + '/setting'));
router.use(require('./' + backend + '/baseLayer'));
router.use(require('./gc2/legend'));
router.use(require('./' + backend + '/sql'));
router.use(require('./print'));
router.use(require('./locale'));
router.use(require('./config'));
router.use(require('./feature'));
router.use(require('./template'));

module.exports = router;
