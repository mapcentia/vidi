var express = require('express');
var router = express.Router();
var https = require('https');
var config = require('../../../config/config.js').cartodb;
var configUrl = require('../../../config/config.js').configUrl;
var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
    host: 'localhost:9200',
    log: 'trace'
});

router.get('/api/extension/es/:db', function (req, response) {
    req.setTimeout(0) // no timeout
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
                            "analyzer": "index_ngram"
                        }, "layergroup": {
                            "type": "text",
                            "search_analyzer": "search_ngram",
                            "analyzer": "index_ngram"
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
                console.log(JSON.parse(jsfile));
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
                    url = "https://" + db + ".cartodb.com/api/v2/viz/" + schemas[u] + "/viz.json";
                    console.log(url);
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
                            var layerObj;
                            jsfile = new Buffer.concat(chunks);
                            try {
                                layers = JSON.parse(jsfile).layers[1].options.layer_definition.layers;
                            } catch (e) {
                                console.log(e);
                            }
                            //console.log(layers);
                            for (var i = 0; i < layers.length; i++) {
                                layers[i].legend.template = layers[i].legend.template.replace(/"/g,"'");
                                layerObj = {
                                    f_table_schema: schemas[u],
                                    f_table_name: layers[i].options.layer_name,
                                    f_table_title: layers[i].options.layer_name,
                                    f_geometry_column: "the_geom_webmercator",
                                    pkey: "cartodb_id",
                                    srid: "3857",
                                    sql: layers[i].options.sql,
                                    cartocss: layers[i].options.cartocss,
                                    layergroup: JSON.parse(jsfile).title,
                                    fieldconf: null,
                                    legend: layers[i].legend,
                                    meta: null
                                };
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

