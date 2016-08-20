var express = require('express');
var router = express.Router();
var backend = require('../config/config.js').backend;

router.use(require('./' + backend + '/meta'));
router.use(require('./' + backend + '/setting'));
router.use(require('./' + backend + '/baseLayer'));
router.use(require('./gc2/legend'));
router.use(require('./' + backend + '/sql'));
router.use(require('./print'));
router.use(require('./locale'));

module.exports = router;
