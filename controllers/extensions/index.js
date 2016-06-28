var express = require('express');
var router = express.Router();
var config = require('../../config/config.js');

// Require extensions
config.extensions.server.forEach(function (v, i) {
        v[Object.keys(v)[0]].forEach(function (m, n) {
                router.use(require('./' + Object.keys(v)[0] + '/' + m + ".js"));
            }
        )
    }
);
module.exports = router;