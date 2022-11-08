/*
 * @author     Martin Høgh <mh@mapcentia.com>
 * @copyright  2013-2019 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

'use strict';

const urlparser = require('./urlparser');
const db = urlparser.db;
let schema = urlparser.schema;
let cloud, layers, setBaseLayer;
let _self = false;
let initMapParameters;
let utils;

/**
 *
 * @type {{set: module.exports.set, init: module.exports.init, getAnchor: module.exports.getAnchor}}
 */
module.exports = {
    set: function (o) {
        cloud = o.cloud;
        layers = o.layers;
        setBaseLayer = o.setBaseLayer;
        utils = o.utils;
        return this;
    },
    init: function () {
        _self = this;

        let param = [], paramStr, parr;

        $.each(this.urlVars(), function (i, v) {
            parr = v.split("#");
            if (parr.length > 1) {
                parr.pop();
            }
            param.push(i + "=" + parr.join());
        });
        const sr = urlparser.staticRoute !== "" && urlparser.staticRoute !== undefined  ? urlparser.staticRoute : null;
        paramStr = param.join("&");
        return "/app/" + db + "/" + (schema !== "" ? schema + "/" : "") + (sr ? sr + "/" : "") + ((paramStr === "") ? "" : "?" + paramStr) + this.anchor();
    },

    urlVars: function getUrlVars() {
        let mapvars = {};
        window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
            mapvars[key] = value;
        });
        return mapvars;
    },

    /**
     * Returns current map parameters, if the map have not been
     * initialized yet, then the "false" is returned
     * 
     * @returns {Object|Boolean}
     */
    getCurrentMapParameters: () => {
        let p = geocloud.transformPoint(cloud.get().getCenter().x, cloud.get().getCenter().y, "EPSG:3857", "EPSG:4326");
        let result = false;
        if (cloud.get().getBaseLayerName()) {
            result = {
                layers: (layers.getLayers() ? layers.getLayers().split(",") : []),
                baseLayer: cloud.get().getBaseLayerName(),
                zoom: Math.round(cloud.get().getZoom()).toString(),
                x: (Math.round(p.x * 10000) / 10000).toString(),
                y: (Math.round(p.y * 10000) / 10000).toString()
            };
        }

        return result;
    },

    applyMapParameters: (parameters, ignoreInitZoomCenter) => {
        const arr = window.vidiConfig?.initZoomCenter ? utils.parseZoomCenter(window.vidiConfig.initZoomCenter) : null;
        if (arr && !ignoreInitZoomCenter) {
            parameters.zoom = arr.z;
            parameters.x = arr.x;
            parameters.y = arr.y;
        }
        return new Promise((resolve, reject) => {
            if (parameters.x && parameters.y && parameters.zoom) {
                cloud.get().setView(new L.LatLng(parseFloat(parameters.y), parseFloat(parameters.x)), parameters.zoom);
                initMapParameters = parameters
            } else {
                initMapParameters = null;
            }

            setBaseLayer.init(parameters.baseLayer).then(() => {
                resolve();
            }).catch(error => {
                console.error(error);
                reject();
            });
        });
    },

    getInitMapParameters: () => {
        return initMapParameters;
    },

    /**
     * @private
     * @returns {string|boolean}
     */
    anchor: (scheme = null) => {
        let mapParameters = _self.getCurrentMapParameters();
        if (mapParameters) {
            let layerStr;
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
        } else {
            return ``;
        }
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
        let param = [], paramStr, parr;
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
