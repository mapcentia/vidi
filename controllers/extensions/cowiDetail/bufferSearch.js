var express = require('express');
var router = express.Router();
var http = require('http');
var config = require('../../../config/config.js').gc2;


router.post('/api/extension/cowiDetail/:db', function (req, response) {
    var db = req.params.db, schema = req.params.schema, url, data = [], jsfile = "";
    console.log("hej");
    response.send("sdsd");
});
module.exports = router;