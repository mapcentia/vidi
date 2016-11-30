/**
 * @fileoverview Description of file, its uses and information
 * about its dependencies.
 */

'use strict';

var meta;

/**
 *
 * @type {{set: module.exports.set, init: module.exports.init}}
 */
module.exports = module.exports = {
    set: function (o) {
        meta = o.meta;
        return this;
    },
    init: function () {
        var base64name, arr, groups, metaData, i, l, displayInfo;
        groups = [];
        metaData = meta.getMetaData();
        for (i = 0; i < metaData.data.length; ++i) {
            groups[i] = metaData.data[i].layergroup;
        }
        arr = array_unique(groups.reverse());
        metaData.data.reverse();
        for (i = 0; i < arr.length; ++i) {
            if (arr[i] && arr[i] !== "<font color='red'>[Ungrouped]</font>") {
                l = [];
                base64name = Base64.encode(arr[i]).replace(/=/g, "");
                $("#layers").append('<div class="panel panel-default panel-layertree" id="layer-panel-' + base64name + '"><div class="panel-heading" role="tab"><h4 class="panel-title"><div class="layer-count badge"><span>0</span> / <span></span></div><a style="display: block" class="accordion-toggle" data-toggle="collapse" data-parent="#layers" href="#collapse' + base64name + '"> ' + arr[i] + ' </a></h4></div><ul class="list-group" id="group-' + base64name + '" role="tabpanel"></ul></div>');
                $("#group-" + base64name).append('<div id="collapse' + base64name + '" class="accordion-body collapse"></div>');
                for (var u = 0; u < metaData.data.length; ++u) {
                    if (metaData.data[u].layergroup == arr[i]) {
                        var text = (metaData.data[u].f_table_title === null || metaData.data[u].f_table_title === "") ? metaData.data[u].f_table_name : metaData.data[u].f_table_title;
                        if (metaData.data[u].baselayer) {
                            $("#base-layer-list").append(
                                "<div class='list-group-item'><div class='row-action-primary radio radio-primary base-layer-item' data-gc2-base-id='" + metaData.data[u].f_table_schema + "." + metaData.data[u].f_table_name + "'><label class='baselayer-label'><input type='radio' name='baselayers'>" + text + "<span class='fa fa-check' aria-hidden='true'></span></label></div></div>"
                            );
                        }
                        else {
                            displayInfo = (metaData.data[u].meta !== null && $.parseJSON(metaData.data[u].meta) !== null && typeof $.parseJSON(metaData.data[u].meta).meta_desc !== "undefined") ? "inline" : "none";
                            $("#collapse" + base64name).append('<li class="layer-item list-group-item"><div class="checkbox"><label class="overlay-label" style="width: calc(100% - 50px);"><input type="checkbox" id="' + metaData.data[u].f_table_name + '" data-gc2-id="' + metaData.data[u].f_table_schema + "." + metaData.data[u].f_table_name + '">' + text + '</label><span style="display: ' + displayInfo + '" class="info-label label label-primary">Info</span></div></li>');
                            l.push({});
                        }
                    }
                }
                $("#layer-panel-" + base64name + " span:eq(1)").html(l.length);
                // Remove the group if empty
                if (l.length === 0) {
                    $("#layer-panel-" + base64name).remove();
                }
            }
        }
    }
};