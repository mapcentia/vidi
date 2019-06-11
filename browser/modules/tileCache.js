/*
 * @author     Alexander Shumilov
 * @copyright  2013-2018 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

/**
 * @fileoverview Description of file, its uses and information
 * about its dependencies.
 * 
 * @todo Remove this file as all its functionality was moved to
 * the offlineMap extension.
 */

'use strict';

/**
 * @type {*|exports|module.exports}
 */
var cloud;

/**
 * Generates all URL for fetching the underlying tile set for specified boundary
 * 
 * @param {*} map Leaflet map instance
 * @param {*} bounds bounds object
 * @param {*} tileLayer tile layer
 * @param {*} currentZoom current map zoom
 */
const getTileUrls = (map, bounds, tileLayer, currentZoom) => {
    if (!tileLayer) throw new Error('Tile layer is undefined');
    let maxZoom = 18;
    let urls = [];

    console.log(`Getting all tiles for specified boundary from ${currentZoom} to ${maxZoom} zoom`);
    for (let localZoom = currentZoom; localZoom <= maxZoom; localZoom++) {
        let min = map.project(bounds.getNorthWest(), localZoom).divideBy(256).floor();
        let max = map.project(bounds.getSouthEast(), localZoom).divideBy(256).floor();
        for (let i = min.x; i <= max.x; i++) {
            for (let j = min.y; j <= max.y; j++) {
                var coords = new L.Point(i, j);
                coords.z = localZoom;
                urls.push(L.TileLayer.prototype.getTileUrl.call(tileLayer, coords));
            }
        }
    }

    console.log(`Total tile URLs: ${urls.length}`);
    return urls;
};


/**
 * Fetches tiles in background
 * 
 * @param {*} tileURLs Tile URLs
 */
const fetchAndCacheTiles = (tileURLs, onloadCallback, onerrorCallback) => {
    for (var i = 0; i < tileURLs.length; ++i) {
        var img = new Image();
        img.onload = () => { onloadCallback(); };
        img.onerror = () => { onerrorCallback(); };
        img.src = tileURLs[i];
    }
};

/**
 *
 * @type {{set: module.exports.set, control: module.exports.control, init: module.exports.init, getDrawOn: module.exports.getDrawOn, getLayer: module.exports.getLayer, getTable: module.exports.getTable, setDestruct: module.exports.setDestruct}}
 */
module.exports = {
    set: function (o) {
        cloud = o.cloud;
        return this;
    },
    init: function () {
        let drawRectangleControl = false;
        let currentBaseLayer = false;
        let map = cloud.get().map;

        var drawControlFull = new L.Control.Draw({
            draw: { polyline: false }
        });

        map.on('baselayerchange', function (e) {
            currentBaseLayer = e.layer;
        });

        map.on('draw:created', (e) => {
            var layer = e.layer;
            var bounds = layer.getBounds();
            var currentZoom = map.getZoom();
            let urls = getTileUrls(map, bounds, currentBaseLayer, currentZoom);

            var numberOfLoadedTiles = 0;
            var numberOfTilesToLoad = urls.length;
            const onloadCallback = () => {
                numberOfLoadedTiles++;
                $('.caching-progress .status').html(`${numberOfLoadedTiles}/${numberOfTilesToLoad} loaded`);
            }

            const onerrorCallback = () => {
                numberOfTilesToLoad--;
                $('.caching-progress .status').html(`${numberOfLoadedTiles}/${numberOfTilesToLoad} loaded`);
            }

            fetchAndCacheTiles(urls, onloadCallback, onerrorCallback);

            selectAreaButton.state('select-area');
            drawRectangleControl.disable();
        });

        let selectAreaButton = L.easyButton({
            id: 'select-area-button',
            position: 'topright',
            leafletClasses: true,
            states:[{
                stateName: 'select-area',
                onClick: (button, map) => {
                    button.state('cancel-select-area');
                    drawRectangleControl = new L.Draw.Rectangle(map, drawControlFull.options.rectangle);
                    drawRectangleControl.enable();
                },
                title: 'Select area on the map for further caching',
                icon: 'fa-square'
            }, {
                stateName: 'cancel-select-area',
                onClick: (button, map) => {
                    button.state('select-area');
                    drawRectangleControl.disable();
                },
                title: 'Cancel area selection',
                icon: 'fa-ban'
            }]
        });
        
        selectAreaButton.addTo(cloud.get().map);
    },

    off: function () {}
};
