/**
 * @fileoverview Description of file, its uses and information
 * about its dependencies.
 */

'use strict';

var urlparser = require('./urlparser');
var urlVars = urlparser.urlVars;
var db = urlparser.db;
var schema = urlparser.schema;
var cloud;
var layers;

/**
 * @private
 * @returns {string}
 */
var anchor = function () {
    var p = geocloud.transformPoint(cloud.get().getCenter().x, cloud.get().getCenter().y, "EPSG:900913", "EPSG:4326");
    return "#" + cloud.get().getBaseLayerName() + "/" + Math.round(cloud.get().getZoom()).toString() + "/" + (Math.round(p.x * 10000) / 10000).toString() + "/" + (Math.round(p.y * 10000) / 10000).toString() + "/" + ((layers.getLayers()) ? layers.getLayers().split(",").reverse().join(",") : "");
};
/**
 *
 * @type {{set: module.exports.set, init: module.exports.init, getAnchor: module.exports.getAnchor}}
 */
module.exports = {
    set: function (o) {
        cloud = o.cloud;
        layers = o.layers;
        return this;
    },
    init: function () {
        var param = [], paramStr, parr;
        $.each(urlVars, function (i, v) {
            parr = v.split("#");
            if (parr.length > 1) {
                parr.pop();
            }
            param.push(i + "=" + parr.join());
        });
        paramStr = param.join("&");
        return "/app/" + db + "/" + (schema !== "" ? schema + "/" : "")  + ((paramStr === "") ? "" : "?" + paramStr) + anchor();
    },

    /**
     * Get the URL anchor for current state
     * @returns {string}
     */
    getUri: function(){
        return "/app/" + db + "/" + (schema !== "" ? schema + "/" : "");
    },

    getParam: function(){
        var param = [], paramStr, parr;
        $.each(urlVars, function (i, v) {
            parr = v.split("#");
            if (parr.length > 1) {
                parr.pop();
            }
            param.push(i + "=" + parr.join());
        });
        paramStr = param.join("&");
        return paramStr;
    },

    /**
     * Get the URL anchor for current state
     * @returns {string}
     */
    getAnchor: function(){
        return anchor();
    }
};