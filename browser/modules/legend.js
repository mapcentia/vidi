/*
 * @author     Martin Høgh <mh@mapcentia.com>
 * @copyright  2013-2020 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

'use strict';

let cloud;
let meta;
let _layers;
let urlparser = require('./urlparser');
let db = urlparser.db;
let BACKEND = require('../../config/config.js').backend;
let hasBeenVisible = [];
let hasBeenVisibleTmp = [];
let constants = require('./layerTree/constants')

let arrayUnique = (array) => {
    let a = array.concat();
    for (let i = 0; i < a.length; ++i) {
        for (let j = i + 1; j < a.length; ++j) {
            if (a[i] === a[j])
                a.splice(j--, 1);
        }
    }
    return a;
};

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

        return new Promise(function (resolve, reject) {
            let metaDataKeys = meta.getMetaDataKeys(), visibleLayers = _layers.getLayers(";"), checked, layerName,
                param = ``, layers;

            // No layers visible
            if (metaDataKeys.length === 0) {
                resolve();
            }

            if (window.vidiConfig.removeDisabledLayersFromLegend) {
                if (layerArr) {
                    layers = layerArr.join(";");
                } else {
                    layers = visibleLayers;
                }

                param = 'l=' + layers + '&db=' + db;
            } else {
                hasBeenVisible = arrayUnique([...hasBeenVisible, ...layerArr ? layerArr : visibleLayers.split(";")]);

                // No need to update the legend because no new layers added
                if (hasBeenVisible.length === hasBeenVisibleTmp.length && hasBeenVisible.every((value, index) => value === hasBeenVisibleTmp[index])) {
                    resolve();
                }

                hasBeenVisibleTmp = hasBeenVisible;
                param = 'l=' + hasBeenVisible.join(";") + '&db=' + db;
            }

            $.ajax({
                url: '/api/legend/' + db + '?' + param,
                success: function (response) {
                    var list = $('<div class="p-0"/>'), li, classUl, title, className;
                    $.each(response, function (i, v) {
                        if (typeof v.id !== "undefined") {
                            let id = v.id.replace(constants.LAYER.VECTOR + ':', '')
                            title = metaDataKeys[id].f_table_title ? metaDataKeys[id].f_table_title : metaDataKeys[id].f_table_name;
                        }
                        var u, showLayer = false;
                        if (typeof v === "object" && v.classes !== undefined) {

                            for (u = 0; u < v.classes.length; u = u + 1) {
                                if (v.classes[u].name !== "") {
                                    showLayer = true;
                                }
                            }
                            if (showLayer) {
                                li = $("<div class='d-flex flex-column ms-2 mb-2'/>");
                                classUl = $('<div />');
                                for (u = 0; u < v.classes.length; u = u + 1) {
                                    if (v.classes[u].name !== "" || v.classes[u].name === "_gc2_wms_legend") {
                                        className = (v.classes[u].name !== "_gc2_wms_legend") ? "<span class='legend-text'>" + v.classes[u].name + "</span>" : "";
                                        if (v.classes[u].name === "_gc2_wms_legend") {
                                            title = "<img class='legend-img' src='data:image/png;base64, " + v.classes[u].img + "' />" + className + "";
                                        } else {
                                            classUl.append("<div class='d-flex align-items-center gap-1'><img class='legend-img' src='data:image/png;base64, " + v.classes[u].img + "' />" + className + "</div>");
                                        }
                                    }
                                }
                                let id = v.id.replace(constants.LAYER.VECTOR + ':', '')
                                let type = v.id.startsWith(constants.LAYER.VECTOR + ':') ? 'v' : 't';
                                checked = ($.inArray(v.id, visibleLayers ? visibleLayers.split(";") : "") > -1) ? "checked" : "";
                                const div = $('<div />');
                                div.append($("<div class='form-check'><label class='form-check-label d-flex align-items-center gap-2'><input class='form-check-input' data-gc2-layer-type=" + type + " type='checkbox' data-gc2-id='" + id + "' " + checked + ">" + title + "</label></div>"));
                                div.append(li.append(classUl));
                                list.append(div);
                            }

                        }
                    });
                    $(el ? el : '#legend').html(list);
                    resolve();
                },
                error: function (err) {
                    reject(err);
                }
            });
        })
    }
};
