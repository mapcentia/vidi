var urlparser = require('./urlparser');
var db = urlparser.db;
var schema = urlparser.schema;
var urlVars = urlparser.urlVars;
var metaDataKeys = [];
var metaDataKeysTitle = [];
var cloud;
var switchLayer;
var setBaseLayer;
var ready = false;
var cartoDbLayersready = false;
var BACKEND = require('../../config/config.js').backend;
var host;
try {
    host = require('../../config/config.js').gc2.host;
} catch (e) {
    console.info(e.message);
}
module.exports = {
    set: function (o) {
        cloud = o.cloud;
        switchLayer = o.switchLayer;
        setBaseLayer = o.setBaseLayer;
        return this;
    },
    init: function () {
        $.ajax({
            url: '/api/meta/' + db + '/' + (window.gc2Options.mergeSchemata === null ? "" : window.gc2Options.mergeSchemata.join(",") + ',') + (typeof urlVars.i === "undefined" ? "" : urlVars.i.split("#")[1] + ',') + schema,
            scriptCharset: "utf-8",
            success: function (response) {
                var base64name, isBaseLayer, arr, groups, i, l, cv, metaData, layers = [];
                groups = [];
                metaData = response;
                for (i = 0; i < metaData.data.length; i++) {
                    metaDataKeys[metaData.data[i].f_table_name] = metaData.data[i];
                    (metaData.data[i].f_table_title) ? metaDataKeysTitle[metaData.data[i].f_table_title] = metaData.data[i] : null;
                }
                for (i = 0; i < response.data.length; ++i) {
                    groups[i] = response.data[i].layergroup;
                }
                arr = array_unique(groups);

                switch (BACKEND) {
                    case "gc2":
                        for (var u = 0; u < response.data.length; ++u) {
                            isBaseLayer = response.data[u].baselayer ? true : false;
                            layers[[response.data[u].f_table_schema + "." + response.data[u].f_table_name]] = cloud.addTileLayers({
                                host: host,
                                layers: [response.data[u].f_table_schema + "." + response.data[u].f_table_name],
                                db: db,
                                isBaseLayer: isBaseLayer,
                                tileCached: true,
                                visibility: false,
                                wrapDateLine: false,
                                displayInLayerSwitcher: true,
                                name: response.data[u].f_table_name,
                                type: "tms"
                            });
                        }
                        break;

                    case "cartodb":
                        var j = 0, tmpData = response.data.slice(); // Clone the array for async adding of CartoDB layers
                        (function iter() {
                            cartodb.createLayer(cloud.map, {
                                user_name: db,
                                type: 'cartodb',
                                sublayers: [{
                                    sql: tmpData[j].sql,
                                    cartocss: tmpData[j].cartocss
                                }]
                            }).on('done', function (layer) {
                                layer.baseLayer = false;
                                layer.id = tmpData[j].f_table_schema + "." + tmpData[j].f_table_name;
                                cloud.addLayer(layer, tmpData[j].f_table_name);
                                // We switch the layer on/off, so they become ready for state.
                                cloud.showLayer(layer.id);
                                cloud.hideLayer(layer.id);
                                j++;
                                if (j < tmpData.length) {
                                    iter();
                                } else {
                                    cartoDbLayersready = true; // CartoDB layer are now created
                                    return null;
                                }
                            });
                        }());
                        break;
                }

                response.data.reverse();
                for (i = 0; i < arr.length; ++i) {
                    if (arr[i] && arr[i] !== "<font color='red'>[Ungrouped]</font>") {
                        l = [];
                        cv = ( typeof (metaDataKeysTitle[arr[i]]) === "object") ? metaDataKeysTitle[arr[i]].f_table_name : null;
                        base64name = Base64.encode(arr[i]).replace(/=/g, "");
                        $("#layers").append('<div class="panel panel-default" id="layer-panel-' + base64name + '"><div class="panel-heading" role="tab"><h4 class="panel-title"><div class="layer-count badge"><span>0</span> / <span></span></div><a style="display: block" class="accordion-toggle" data-toggle="collapse" data-parent="#layers" href="#collapse' + base64name + '"> ' + arr[i] + ' </a></h4></div><ul class="list-group" id="group-' + base64name + '" role="tabpanel"></ul></div>');
                        $("#group-" + base64name).append('<div id="collapse' + base64name + '" class="accordion-body collapse"></div>');
                        for (u = 0; u < response.data.length; ++u) {
                            if (response.data[u].layergroup == arr[i]) {
                                var text = (response.data[u].f_table_title === null || response.data[u].f_table_title === "") ? response.data[u].f_table_name : response.data[u].f_table_title;
                                if (response.data[u].baselayer) {
                                    $("#base-layer-list").append(
                                        "<div class='list-group-item'><div class='row-action-primary radio radio-primary base-layer-item' data-gc2-base-id='" + response.data[u].f_table_schema + "." + response.data[u].f_table_name + "'><label><input type='radio' name='baselayers'>" + text + "<span class='fa fa-check' aria-hidden='true'></span></label></div></div>"
                                    );
                                }
                                else {
                                    $("#collapse" + base64name).append('<li class="layer-item list-group-item"><div class="checkbox"><label><input type="checkbox" id="' + response.data[u].f_table_name + '" data-gc2-id="' + response.data[u].f_table_schema + "." + response.data[u].f_table_name + '">' + text + '</label></div></li>');
                                    l.push({});
                                }
                            }
                        }
                        $("#layer-panel-" + base64name + " span:eq(1)").html(l.length)
                        // Remove the group if empty
                        if (l.length === 0) {
                            $("#layer-panel-" + base64name).remove();
                        }
                    }
                }
                // Bind switch layer event
                $(".checkbox input[type=checkbox]").change(function (e) {
                    switchLayer.init($(this).data('gc2-id'), $(this).context.checked);
                    e.stopPropagation();
                });
                $(".base-layer-item").on("click", function (e) {
                    setBaseLayer.init($(this).data('gc2-base-id'));
                    e.stopPropagation();
                    $(".base-layer-item").css("background-color", "white");
                });
                ready = true;

            },
            error: function (response) {
                alert(JSON.parse(response.responseText).message);
            }
        }); // Ajax call end
    },
    getMetaDataKeys: function () {
        return metaDataKeys;
    },
    ready: function () {
        if (BACKEND === "cartodb") { // If CartoDB, we wait for cartodb.createLayer to finish
            if (ready && cartoDbLayersready) {
                return true;
            } else {
                return false;
            }
        } else { // GC2 layers are direct tile request
            return ready;
        }
    }
};


