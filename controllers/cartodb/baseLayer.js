var express = require('express');
var router = express.Router();
var http = require('http');
var config = require('../../config/config.js');

router.get('/api/baselayer', function (req, response) {
    var jsfile;

    var gc2Options = {
        mergeSchemata: null
    };
    jsfile = "window.gc2Options = " + JSON.stringify(gc2Options) + ";";
    jsfile += 'window.setBaseLayers = ' + JSON.stringify(config.baseLayers);
    response.header('content-type', 'application/json');
    response.send(jsfile);
});
module.exports = router;