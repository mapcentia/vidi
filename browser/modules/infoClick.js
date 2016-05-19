var urlparser = require('./urlparser');
var db = urlparser.db;
var cloud;
var clicktimer;
var meta;
var qstore = [];
var host = require('../../config/config.js').gc2.host;


var BACKEND = "gc2";

module.exports = {
    set: function (o) {
        cloud = o.cloud;
        meta = o.meta;
        return this;
    },
    init: function () {
        cloud.on("dblclick", function () {
            clicktimer = undefined;
        });
        cloud.on("click", function (e) {
            var layers, count = 0, hit = false, event = new geocloud.clickEvent(e, cloud), distance;
            var metaDataKeys = meta.getMetaDataKeys();


            if (clicktimer) {
                clearTimeout(clicktimer);
            }
            else {
                clicktimer = setTimeout(function (e) {
                    clicktimer = undefined;
                    var coords = event.getCoordinate();
                    $.each(qstore, function (index, store) {
                        store.reset();
                        cloud.removeGeoJsonStore(store);
                    });
                    layers = cloud.getVisibleLayers().split(";");
                    $("#info-tab").empty();
                    $("#info-pane").empty();
                    $("#info-content .alert").hide();
                    $.each(layers, function (index, value) {
                        if (layers[0] === "") {
                            return false;
                        }
                        var isEmpty = true;
                        var srid = metaDataKeys[value.split(".")[1]].srid;
                        var geoType = metaDataKeys[value.split(".")[1]].type;
                        var layerTitel = (metaDataKeys[value.split(".")[1]].f_table_title !== null && metaDataKeys[value.split(".")[1]].f_table_title !== "") ? metaDataKeys[value.split(".")[1]].f_table_title : metaDataKeys[value.split(".")[1]].f_table_name;
                        var not_querable = metaDataKeys[value.split(".")[1]].not_querable;
                        var versioning = metaDataKeys[value.split(".")[1]].versioning;
                        var cartoSql = metaDataKeys[value.split(".")[1]].sql;
                        if (geoType !== "POLYGON" && geoType !== "MULTIPOLYGON") {
                            var res = [156543.033928, 78271.516964, 39135.758482, 19567.879241, 9783.9396205,
                                4891.96981025, 2445.98490513, 1222.99245256, 611.496226281, 305.748113141, 152.87405657,
                                76.4370282852, 38.2185141426, 19.1092570713, 9.55462853565, 4.77731426782, 2.38865713391,
                                1.19432856696, 0.597164283478, 0.298582141739, 0.149291];
                            distance = 5 * res[cloud.getZoom()];
                        }
                        var onLoad = function () {
                            var layerObj = qstore[this.id], out = [], fieldLabel;
                            isEmpty = layerObj.isEmpty();
                            if (!isEmpty && !not_querable) {
                                $('#modal-info-body').show();
                                var fieldConf = $.parseJSON(metaDataKeys[value.split(".")[1]].fieldconf);
                                $("#info-tab").append('<li><a data-toggle="tab" href="#_' + index + '">' + layerTitel + '</a></li>');
                                $("#info-pane").append('<div class="tab-pane" id="_' + index + '"><button type="button" class="btn btn-primary btn-xs" data-gc2-title="' + layerTitel + '" data-gc2-store="' + index + '">' + __('Search with this object') + '</button><table class="table table-condensed"><thead><tr><th>' + __("Property") + '</th><th>' + __("Value") + '</th></tr></thead></table></div>');

                                $.each(layerObj.geoJSON.features, function (i, feature) {
                                    if (fieldConf === null) {
                                        $.each(feature.properties, function (name, property) {
                                            out.push([name, 0, name, property]);
                                        });
                                    }
                                    else {
                                        $.each(fieldConf, function (name, property) {
                                            if (property.querable) {
                                                fieldLabel = (property.alias !== null && property.alias !== "") ? property.alias : name;
                                                if (feature.properties[name] !== undefined) {
                                                    if (property.link) {
                                                        out.push([name, property.sort_id, fieldLabel, "<a target='_blank' href='" + (property.linkprefix !== null ? property.linkprefix : "") + feature.properties[name] + "'>" + feature.properties[name] + "</a>"]);
                                                    }
                                                    else {
                                                        out.push([name, property.sort_id, fieldLabel, feature.properties[name]]);
                                                    }
                                                }
                                            }
                                        });
                                    }
                                    out.sort(function (a, b) {
                                        return a[1] - b[1];
                                    });
                                    $.each(out, function (name, property) {
                                        $("#_" + index + " table").append('<tr><td>' + property[2] + '</td><td>' + property[3] + '</td></tr>');
                                    });
                                    out = [];
                                    $('#info-tab a:first').tab('show');
                                });
                                hit = true;
                            } else {
                                layerObj.reset();
                            }
                            count++;
                            if (count === layers.length) {
                                if (!hit) {
                                    $('#modal-info-body').hide();
                                }
                                $("#info-content button").click(function (e) {
                                    //clearDrawItems();
                                    //makeConflict(qstore[$(this).data('gc2-store')].geoJSON.features [0], 0, false, __("From object in layer") + ": " + $(this).data('gc2-title'));
                                });
                                $('#main-tabs a[href="#info-content"]').tab('show');
                                //clearDrawItems();
                            }
                        };

                        switch (BACKEND) {
                            case "gc2":
                                qstore[index] = new geocloud.sqlStore({
                                    host: host,
                                    db: db,
                                    clickable: false,
                                    id: index,
                                    onLoad: onLoad
                                });
                                break;
                            case "cartodb":
                                qstore[index] = new geocloud.cartoDbStore({
                                    host: host,
                                    db: db,
                                    clickable: false,
                                    id: index,
                                    onLoad: onLoad
                                });
                                break;
                        }
                        cloud.addGeoJsonStore(qstore[index]);
                        var sql, f_geometry_column = metaDataKeys[value.split(".")[1]].f_geometry_column;
                        if (geoType === "RASTER") {
                            sql = "SELECT foo.the_geom,ST_Value(rast, foo.the_geom) As band1, ST_Value(rast, 2, foo.the_geom) As band2, ST_Value(rast, 3, foo.the_geom) As band3 " +
                                "FROM " + value + " CROSS JOIN (SELECT ST_transform(ST_GeomFromText('POINT(" + coords.x + " " + coords.y + ")',3857)," + srid + ") As the_geom) As foo " +
                                "WHERE ST_Intersects(rast,the_geom) ";
                        } else {

                            if (geoType !== "POLYGON" && geoType !== "MULTIPOLYGON") {
                                sql = "SELECT * FROM " + (BACKEND === "cartodb" ? "(" + cartoSql + ") as foo" : value) + " WHERE round(ST_Distance(ST_Transform(\"" + f_geometry_column + "\",3857), ST_GeomFromText('POINT(" + coords.x + " " + coords.y + ")',3857))) < " + distance;
                                if (versioning) {
                                    sql = sql + " AND gc2_version_end_date IS NULL ";
                                }
                                sql = sql + " ORDER BY round(ST_Distance(ST_Transform(\"" + f_geometry_column + "\",3857), ST_GeomFromText('POINT(" + coords.x + " " + coords.y + ")',3857)))";
                            } else {
                                sql = "SELECT * FROM " + (BACKEND === "cartodb" ? "(" + cartoSql + ") as foo" : value) + " WHERE ST_Intersects(ST_Transform(ST_geomfromtext('POINT(" + coords.x + " " + coords.y + ")',900913)," + srid + ")," + f_geometry_column + ")";
                                if (versioning) {
                                    sql = sql + " AND gc2_version_end_date IS NULL ";
                                }
                            }
                        }
                        sql = sql + "LIMIT 5";
                        qstore[index].sql = sql;
                        qstore[index].load();
                    });
                }, 250);
            }
        });
    }
};


