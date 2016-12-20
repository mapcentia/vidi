/**
 * @fileoverview Description of file, its uses and information
 * about its dependencies.
 */

'use strict';

var cloud;
var meta;
var _layers;
var urlparser = require('./urlparser');
var db = urlparser.db;
var BACKEND = require('../../config/config.js').backend;

/**
 *
 * @type {{set: module.exports.set, init: module.exports.init}}
 */
module.exports = module.exports = {
    set: function (o) {
        cloud = o.cloud;
        meta = o.meta;
        _layers = o.layers;
        return this;
    },
    init: function (layerArr, el) {
        var metaDataKeys = meta.getMetaDataKeys();
        switch (BACKEND) {
            case "gc2":
                var visibleLayers = _layers.getLayers().split(",").join(";"), layers, checked, layerName;
                if (layerArr) {
                    layers = layerArr.join(";");
                } else {
                    layers = visibleLayers;
                }
                var param = 'l=' + layers + '&db=' + db;
                $.ajax({
                    url: '/api/legend/' + db + '?' + param,
                    success: function (response) {
                        var list = $('<ul class="list-group"/>'), li, classUl, title, className;
                        $.each(response, function (i, v) {
                            if (typeof v.id !== "undefined") {
                                title = metaDataKeys[v.id].f_table_title ? metaDataKeys[v.id].f_table_title : metaDataKeys[v.id].f_table_name;
                            }
                            var u, showLayer = false;
                            if (typeof v === "object") {
                                for (u = 0; u < v.classes.length; u = u + 1) {
                                    if (v.classes[u].name !== "") {
                                        showLayer = true;
                                    }
                                }
                                if (showLayer) {
                                    li = $("<li class=''/>");
                                    classUl = $('<ul />');
                                    for (u = 0; u < v.classes.length; u = u + 1) {
                                        if (v.classes[u].name !== "" || v.classes[u].name === "_gc2_wms_legend") {
                                            className = (v.classes[u].name !== "_gc2_wms_legend") ? "<span class='legend-text'>" + v.classes[u].name + "</span>" : "";
                                            classUl.append("<li><img class='legend-img' src='data:image/png;base64, " + v.classes[u].img + "' />" + className + "</li>");
                                        }
                                    }
                                    layerName = metaDataKeys[v.id].f_table_schema + "." + metaDataKeys[v.id].f_table_name;
                                    checked = ($.inArray(layerName, visibleLayers.split(";")) > -1) ? "checked" : "";
                                    list.append($("<li class='list-group-item'><div class='checkbox'><label><input type='checkbox' data-gc2-id='" + layerName + "' " + checked + ">" + title + "</label></div></li>"));
                                    list.append(li.append(classUl));
                                }
                            }
                        });
                        $(el ? el : '#legend').html(list);
                    }
                });
                break;
            case "cartodb":
                setTimeout(function () {
                    var key, legend, list = $("<ul/>"), li, classUl, title, className, rightLabel, leftLabel;
                    $.each(_layers.getLayers().split(","), function (i, v) {
                        key = v;
                        if (typeof key !== "undefined" && typeof metaDataKeys[key] !== "undefined") {
                            legend = metaDataKeys[key].legend;
                            try {
                                title = metaDataKeys[key].f_table_title;
                            }
                            catch (e) {
                            }
                            var u, showLayer = false;
                            switch (legend.type) {
                                case "category":
                                    for (u = 0; u < legend.items.length; u = u + 1) {
                                        if (legend.items[u].name !== "") {
                                            showLayer = true;
                                        }
                                    }
                                    if (showLayer) {
                                        li = $("<li/>");
                                        classUl = $("<ul/>");
                                        for (u = 0; u < legend.items.length; u = u + 1) {
                                            className = "<span class='legend-text'>" + legend.items[u].name + "</span>";
                                            classUl.append("<li><span style='display: inline-block; height: 15px; width: 15px; background-color: " + legend.items[u].value + ";'></span>" + className + "</li>");
                                        }
                                        list.append($("<li>" + title + "</li>"));
                                        list.append(li.append(classUl));
                                    }
                                    break;
                                case "choropleth":
                                    for (u = 0; u < legend.items.length; u = u + 1) {
                                        if (legend.items[u].name !== "") {
                                            showLayer = true;
                                        }
                                    }
                                    if (showLayer) {
                                        li = $("<li/>");
                                        classUl = $("<ul/>");
                                        for (u = 0; u < legend.items.length; u = u + 1) {
                                            if (legend.items[u].name === "Left label") {
                                                classUl.append("<li style='display:inline;'><span class='legend-text'>" + legend.items[u].value + "</span></li>");
                                            } else if (legend.items[u].name === "Right label") {
                                                rightLabel = "<li style='display:inline;'><span class='legend-text'>" + legend.items[u].value + "</span></li>"
                                            } else {
                                                classUl.append("<li style='display:inline;'><span style='display: inline-block; height: 15px; width: 15px; background-color: " + legend.items[u].value + ";'></span></li>");
                                            }
                                        }
                                        classUl.append(rightLabel);
                                        list.append($("<li>" + title + "</li>"));
                                        list.append(li.append(classUl));
                                    }
                                    break;
                            }
                        }
                    });
                    $('#legend').html(list);
                }, 500);
                break
        }
    }
};