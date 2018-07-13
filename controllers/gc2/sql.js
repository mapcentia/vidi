var express = require('express');
var router = express.Router();
var config = require('../../config/config.js').gc2;
var request = require('request');
var fs = require('fs');

router.post('/api/sql/:db', function (req, response) {
    var db = req.params.db, q = req.body.q, srs = req.body.srs, lifetime = req.body.lifetime, client_encoding = req.body.client_encoding, base64 = req.body.base64, format = req.body.format, userName;

    var postData = "q=" + encodeURIComponent(q) + "&base64=" + (base64 === "true" ? "true": "false") + "&srs=" + srs + "&lifetime=" + lifetime + "&client_encoding=" + client_encoding + "&format=" + (format ? format : "geojson") + "&key=" +req.session.gc2ApiKey, options;

    // Check if user is a sub user
    if (req.session.gc2UserName && req.session.subUser) {
        userName = req.session.subUser + "@" + db;
    } else {
        userName = db;
    }

    if (req.body.key && !req.session.gc2ApiKey) {
        postData = postData + "&key=" + req.body.key;
    }

    options = {
        method: 'POST',
        uri: config.host + "/api/v1/sql/" + userName,
        form: postData
    };

    response.writeHead(200, {
        'Content-Type': format === "excel" ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'application/json',
        'Expires': '0',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'X-Powered-By': 'MapCentia Vidi'
    });


    var rem = request(options);

    rem.on('data', function(chunk) {
        // instead of loading the file into memory
        // after the download, we can just pipe
        // the data as it's being downloaded
        response.write(chunk);
    });
    rem.on('end', function() {
        response.end();
    });


});
module.exports = router;
