/**
 * @fileoverview Description of file, its uses and information
 * about its dependencies.
 */

'use strict';

var urlparser = require('./urlparser');
var db = urlparser.db;
var schema = urlparser.schema;
var cloud, layers, setBaseLayer;
let _self = false;

/**
 *
 * @type {{set: module.exports.set, init: module.exports.init, getAnchor: module.exports.getAnchor}}
 */
module.exports = {
    set: function (o) {
        cloud = o.cloud;
        layers = o.layers;
        setBaseLayer = o.setBaseLayer;
        return this;
    },
    init: function () {
        _self = this;

        var param = [], paramStr, parr;

        $.each(this.urlVars(), function (i, v) {
            parr = v.split("#");
            if (parr.length > 1) {
                parr.pop();
            }
            param.push(i + "=" + parr.join());
        });
        var sr = urlparser.staticRoute !== "" && urlparser.staticRoute !== undefined  ? urlparser.staticRoute : null;
        paramStr = param.join("&");
        return "/app/" + db + "/" + (schema !== "" ? schema + "/" : "") + (sr ? sr + "/" : "") + ((paramStr === "") ? "" : "?" + paramStr) + this.anchor();
    },

    urlVars: function getUrlVars() {
        var mapvars = {};
        var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
            mapvars[key] = value;
        });
        return mapvars;
    },

    /**
     * @returns {Object}
     */
    getCurrentMapParameters: () => {
        let p = geocloud.transformPoint(cloud.get().getCenter().x, cloud.get().getCenter().y, "EPSG:900913", "EPSG:4326");
        return {
            layers: (layers.getLayers() ? layers.getLayers().split(",") : []),
            baseLayer: cloud.get().getBaseLayerName(),
            zoom: Math.round(cloud.get().getZoom()).toString(),
            x: (Math.round(p.x * 10000) / 10000).toString(),
            y: (Math.round(p.y * 10000) / 10000).toString()
        };
    },

    applyMapParameters: (parameters) => {
        let result = new Promise((resolve, reject) => {
            if (parameters.x && parameters.y && parameters.zoom) {
                cloud.get().setView(new L.LatLng(parseFloat(parameters.y), parseFloat(parameters.x)), parameters.zoom);
            }
    
            setBaseLayer.init(parameters.baseLayer).then(() => {
                resolve();
            });
        });

        return result;
    },

    /**
     * @private
     * @returns {string}
     */
    anchor: (scheme) => {
        let mapParameters = _self.getCurrentMapParameters();
        var layerStr;
        if (layers.getLayers() && scheme) {
            let newArr = [];
            let arr = mapParameters.layers;
            $.each(arr, function (i, v) {
                newArr.push(scheme + "." + v.split(".")[1])
            });
            layerStr = newArr.reverse().join(",");
        } else {
            layerStr = (mapParameters.layers) ? mapParameters.layers.reverse().join(",") : ""
        }

        return `#${mapParameters.baseLayer}/${mapParameters.zoom}/${mapParameters.x}/${mapParameters.y}/${layerStr}`;
    },

    /**
     * Get the URL anchor for current state
     * @returns {string}
     */
    getUri: function (s) {
        schema = s || schema;
        return "/app/" + db + "/" + (schema !== "" ? schema + "/" : "");
    },

    getParam: function () {
        var param = [], paramStr, parr;
        $.each(this.urlVars(), function (i, v) {
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
    getAnchor: function (s) {
        return _self.anchor(s);
    }
};