var express = require('express');
var router = express.Router();
var http = require('http');
var config = require('../../config/config.js').cartodb;

router.get('/api/meta/:db/:schema', function (req, response) {
    var db = req.params.db, schema = req.params.schema, url, layers, data = [], u = 0, jsfile = "",
        schemas = schema.split(",");
    (function iter() {
        if (u === schemas.length) {
            jsfile = {
                data: data,
                success: true
            };
            response.header('content-type', 'application/json');
            response.send(jsfile);
            return;
        }
        url = "http://" + db + ".cartodb.com/api/v2/viz/" + schemas[u] + "/viz.json";
        console.log(url);
        http.get(url, function (res) {
            var statusCode = res.statusCode;
            if (statusCode != 200) {
                response.header('content-type', 'application/json');
                response.status(res.statusCode).send({
                    success: false,
                    message: "Could not get the Viz. Please check CartoDB viz id."
                });
                return;
            }
            var chunks = [];
            res.on('data', function (chunk) {
                chunks.push(chunk);
            });
            res.on("end", function () {
                jsfile = new Buffer.concat(chunks);
                try {
                    layers = JSON.parse(jsfile).layers[1].options.layer_definition.layers;
                } catch (e) {
                    console.log(e);
                }
                //console.log(layers);
                for (var i = 0; i < layers.length; i++) {
                    data.push({
                        f_table_schema: "public",
                        f_table_name: layers[i].options.layer_name + "_" + u,
                        f_table_title: layers[i].options.layer_name,
                        f_geometry_column: "the_geom_webmercator",
                        pkey: "cartodb_id",
                        srid: "3857",
                        sql: layers[i].options.sql,
                        cartocss: layers[i].options.cartocss,
                        layergroup: JSON.parse(jsfile).title,
                        fieldconf: null,
                        legend: layers[i].legend

                    })
                }
                u++;
                iter();
            });
        }).on("error", function () {
            callback(null);
        });
    }());

});
module.exports = router;

