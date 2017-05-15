var express = require('express');
var router = express.Router();
var https = require('https');
var http = require('http');
var config = require('../../../config/config.js').cartodb;
var configUrl = require('../../../config/config.js').configUrl;
var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
    host: 'localhost:9200',
    log: 'trace'
});

router.get('/api/extension/layersearch/index/:db', function (req, response) {
    req.setTimeout(0); // no timeout
    var db = req.params.db, schemas, url, layers, data = [], u = 0, jsfile = "", bulkArr = [],
        indexName = "vidi_" + db;
    url = configUrl + "/index_in_es.json";


    client.indices.delete({
        index: indexName
    }, function (err, res) {
        createIndex();
    });

    var createIndex = function () {
        var payload = {
            "settings": {
                "number_of_shards": 4,
                "number_of_replicas": 0,
                "analysis": {
                    "filter": {
                        "desc_ngram": {
                            "type": "ngram",
                            "min_gram": 1,
                            "max_gram": 255
                        }
                    },
                    "analyzer": {
                        "index_ngram": {
                            "type": "custom",
                            "tokenizer": "keyword",
                            "filter": [ "desc_ngram", "lowercase" ]
                        },
                        "search_ngram": {
                            "type": "custom",
                            "tokenizer": "keyword",
                            "filter": "lowercase"
                        }
                    }
                }
            },

            "mappings": {
                "meta": {
                    "properties": {
                        "f_table_title": {
                            "type": "text",
                            "search_analyzer": "search_ngram",
                            "analyzer": "index_ngram",
                            "fielddata": true
                        }, "layergroup": {
                            "type": "text",
                            "search_analyzer": "search_ngram",
                            "analyzer": "index_ngram",
                            "fielddata": true
                        },
                        "legend": {
                            "type": "object",
                            "enabled": false
                        }
                    }
                }
            }
        };

        var params = {
            "index":indexName,
            "body": payload
        };

        client.indices.create(params, function () {
            bulkIndex();
        });
    };

    var bulkIndex = function () {
        https.get(url, function (res) {
            var statusCode = res.statusCode;
            if (statusCode != 200) {
                response.header('content-type', 'application/json');
                response.status(res.statusCode).send({
                    success: false,
                    message: "Could not get the Viz. Please check CartoDB viz id.",
                    url: url
                });
                return;
            }
            var chunks = [];
            res.on('data', function (chunk) {
                chunks.push(chunk);
            });
            res.on("end", function () {
                jsfile = new Buffer.concat(chunks);
                schemas = JSON.parse(jsfile).indexInEs;
                (function iter() {
                    if (u === schemas.length) {
                        jsfile = {
                            data: data,
                            success: true
                        };
                        client.bulk({
                            body: bulkArr
                        }, function (err, resp) {
                            // ...
                        });

                        response.header('content-type', 'application/json');
                        response.send(jsfile);
                        return;
                    }
                    url = "http://127.0.0.1:3000/api/meta/" + db + "/" + schemas[u];
                    http.get(url, function (res) {
                        var statusCode = res.statusCode;
                        if (statusCode != 200) {
                            response.header('content-type', 'application/json');
                            response.status(res.statusCode).send({
                                success: false,
                                message: "Could not get the Viz. Please check CartoDB viz id.",
                                url: url
                            });
                            return;
                        }
                        var chunks = [];
                        res.on('data', function (chunk) {
                            chunks.push(chunk);
                        });
                        res.on("end", function () {
                            var layerObj;
                            jsfile = new Buffer.concat(chunks);
                            try {
                                layers = JSON.parse(jsfile).data;
                            } catch (e) {
                                console.log(e);
                            }
                            for (var i = 0; i < layers.length; i++) {
                                layerObj = layers[i];
                                if (!layerObj.f_table_title) {
                                    layerObj.f_table_title = layerObj.f_table_name;
                                }
                                bulkArr.push({index: {_index: indexName, _type: 'meta', _id: layerObj.f_table_schema + "." + layerObj.f_table_name}});
                                bulkArr.push(layerObj);
                                data.push(layerObj)
                            }
                            u++;
                            iter();
                        });
                    }).on("error", function () {
                        callback(null);
                    });
                }());


            })
        });

    }

});
module.exports = router;

