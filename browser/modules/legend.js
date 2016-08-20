var cloud;
var meta;
var urlparser = require('./urlparser');
var db = urlparser.db;
var BACKEND = require('../../config/config.js').backend;

module.exports = module.exports = {
    set: function (o) {
        cloud = o.cloud;
        meta = o.meta;
        return this;
    },
    init: function () {
        switch (BACKEND) {
            case "gc2":
                var param = 'l=' + cloud.getVisibleLayers(true) + '&db=' + db;
                $.ajax({
                    url: '/api/legend/' + db + '?' + param,
                    success: function (response) {
                        var list = $('<ul class="list-group"/>'), li, classUl, title, className;
                        $.each(response, function (i, v) {
                            if (typeof v.id !== "undefined") {
                                title = meta.getMetaDataKeys()[v.id.split(".")[1]].f_table_title ? meta.getMetaDataKeys()[v.id.split(".")[1]].f_table_title : meta.getMetaDataKeys()[v.id.split(".")[1]].f_table_name;
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
                                    list.append($("<li>" + title + "</li>"));
                                    list.append(li.append(classUl));
                                }
                            }
                        });
                        $('#legend').html(list);
                    }
                });
                break;
            case "cartodb":
                setTimeout(function () {
                    var key, legend, list = $("<ul/>"), li, classUl, title, className, rightLabel, leftLabel;
                    $.each(cloud.getVisibleLayers(true).split(";"), function (i, v) {
                        key = v.split(".")[1];
                        if (typeof key !== "undefined") {
                            legend = meta.getMetaDataKeys()[key].legend;
                            try {
                                title = meta.getMetaDataKeys()[key].f_table_title;
                            }
                            catch (e) {
                            }
                            var u, showLayer = false;
                            switch (legend.type){
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