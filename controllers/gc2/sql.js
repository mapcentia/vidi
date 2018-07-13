var express = require('express');
var router = express.Router();
var config = require('../../config/config.js').gc2;
var request = require('request');
var fs = require('fs');

router.all('/api/sql/:db', function (req, response) {
    var db = req.params.db,
        q = req.body.q || req.query.q,
        srs = req.body.srs || req.query.srs,
        lifetime = req.body.lifetime || req.query.lifetime,
        client_encoding = req.body.client_encoding || req.query.client_encoding,
        base64 = req.body.base64 || req.query.base64,
        format = req.body.format || req.query.format,
        userName,
        headers;

    console.log(format)

    var postData = "q=" + encodeURIComponent(q) + "&base64=" + (base64 === "true" ? "true" : "false") + "&srs=" + srs + "&lifetime=" + lifetime + "&client_encoding=" + client_encoding + "&format=" + (format ? format : "geojson") + "&key=" + req.session.gc2ApiKey,
        options;

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

    if (format === "excel") {
        headers = {
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition': 'attachment; filename=data.xlsx',
            'Expires': '0',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'X-Powered-By': 'MapCentia Vidi'
        }
    } else {
        headers = {
            'Content-Type': 'application/json',
            'Expires': '0',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'X-Powered-By': 'MapCentia Vidi'
        }
    }

    response.writeHead(200, headers);

    var rem = request(options);

    rem.on('data', function (chunk) {
        response.write(chunk);
    });
    rem.on('end', function () {
        response.end();
    });

});
module.exports = router;
