var express = require('express');
var router = express.Router();
var http = require('http');
var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
    host: 'localhost:9200',
    log: 'trace'
});

router.get('/api/extension/layersearch/:db', function (req, response) {
    var indexName = "vidi_" + req.params.db;
    client.search({
        index: indexName,
        type: 'meta',
        body: req.query.q,
        size: 1000
    }).then(function (resp) {
        var hits = resp.hits.hits;
        response.send(hits);

    }, function (err) {
        console.trace(err.message);
    });
});
module.exports = router;