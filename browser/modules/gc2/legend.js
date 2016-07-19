var cloud;
var meta;
var urlparser = require('../urlparser');
var db = urlparser.db;
module.exports = module.exports = {
    set: function (o) {
        cloud = o.cloud;
        meta = o.meta;
        return this;
    },
    init: function () {
        var param = 'l=' + cloud.getVisibleLayers(true) + '&db=' + db;
        $.ajax({
            url: '/api/legend/' + db + '?' + param,
            success: function (response) {
                var list = $('<ul class="list-group"/>'), li, classUl, title, className;
                $.each(response, function (i, v) {
                    if (typeof v.id !== "undefined") {
                        title = meta.getMetaDataKeys()[v.id.split(".")[1]].f_table_title ? meta.getMetaDataKeys()[v.id.split(".")[1]].f_table_title: meta.getMetaDataKeys()[v.id.split(".")[1]].f_table_name;
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
    }
};