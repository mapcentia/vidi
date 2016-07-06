var express = require('express');
var router = express.Router();

router.use(require('./gc2/meta'));
router.use(require('./gc2/setting'));
router.use(require('./gc2/baseLayer'));
router.use(require('./gc2/legend'));
router.use(require('./gc2/sql'));
router.use(require('./print'));

module.exports = router;
