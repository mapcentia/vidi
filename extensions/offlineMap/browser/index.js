/**
 * @fileoverview Description of file, its uses and information
 * about its dependencies.
 */

'use strict';

/**
 *
 * @type {*|exports|module.exports}
 */
var cloud;

/**
 *
 * @type {*|exports|module.exports}
 */
var utils;

/**
 *
 * @type {*|exports|module.exports}
 */
var backboneEvents;

/**
 *
 */
var transformPoint;


/**
 *
 * @type {string}
 */
var exId = "offlineMap";

/**
 *
 */
var clicktimer;

/**
 *
 */
var mapObj;


/**
 *
 * @type {{set: module.exports.set, init: module.exports.init}}
 */

module.exports = {

    /**
     *
     * @param o
     * @returns {exports}
     */
    set: function (o) {
        cloud = o.cloud;
        utils = o.utils;
        transformPoint = o.transformPoint;
        backboneEvents = o.backboneEvents;
        return this;
    },

    /**
     *
     */
    init: function () {

        /**
         *
         * Native Leaflet object
         */
        mapObj = cloud.get().map;

        /**
         *
         */
        var React = require('react');

        /**
         *
         */
        var ReactDOM = require('react-dom');

        /**
         *
         * @type {{Info: {da_DK: string, en_US: string}}}
         */
        var dict = {
            "Info": {
                "da_DK": "# Here specific map areas can be stored to be used offline",
                "en_US": "# Here specific map areas can be stored to be used offline"
            },
            "Description": {
                "da_DK": "# Specific area of any base layer can be saved, so it can be used in offline mode. If the storage limit of your browser is exceeded, you can delete already cached layers in order to save space.",
                "en_US": "# Specific area of any base layer can be saved, so it can be used in offline mode. If the storage limit of your browser is exceeded, you can delete already cached layers in order to save space."
            },
            "Available space": {
                "da_DK": "Ledig plads",
                "en_US": "Available space"
            },
            "Offline map": {
                "da_DK": "Offline kort",
                "en_US": "Offline map"
            },
            "Comment": {
                "da_DK": "Kommentar",
                "en_US": "Comment"
            },
            "Clear": {
                "da_DK": "Klar",
                "en_US": "Clear"
            },
            "Zoom": {
                "da_DK": "Zoom",
                "en_US": "Zoom"
            },
            "Define": {
                "da_DK": "Definere",
                "en_US": "Define"
            },
            "Redefine": {
                "da_DK": "Omdefinere",
                "en_US": "Redefine"
            },
            "Show on map": {
                "da_DK": "Vis på kort",
                "en_US": "Show on map"
            },
            "Store map area": {
                "da_DK": "# Store map area",
                "en_US": "# Store map area"
            },
            "Extent": {
                "da_DK": "# Extent",
                "en_US": "# Extent"
            },
            "Saved tiles will be used in...": {
                "da_DK": "# Saved tiles will be used in...",
                "en_US": "# Saved tiles will be used in..."
            },
            "Store": {
                "da_DK": "# Store",
                "en_US": "# Store"
            },
        };

        /**
         *
         * @param txt
         * @returns {*}
         * @private
         */
        var __ = function (txt) {
            if (dict[txt][window._vidiLocale]) {
                return dict[txt][window._vidiLocale];
            } else {
                return txt;
            }
        };

        // Allowed zoom levels
        const minimalZoomLevel = 10;
        const maximumZoomLevel = 18;

        /**
         *
         */
        class OfflineMap extends React.Component {

            constructor(props) {
                super(props);

                this.state = {
                    storageUsed: 0,
                    storageAvailable: 0,
                    drawRectangleControl: false,
                    currentBaseLayer: false,
                    drawnExtentLayer: false,
                    newAreaExtent: false,
                    newAreaComment: '',
                    newAreaZoomMin: minimalZoomLevel,
                    newAreaZoomMax: maximumZoomLevel
                };

                this.setExtent = this.setExtent.bind(this);
                this.clearExtent = this.clearExtent.bind(this);
                this.setMinZoom = this.setMinZoom.bind(this);
                this.setMaxZoom = this.setMaxZoom.bind(this);
            }

            /**
             * Generates all URL for fetching the underlying tile set for specified boundary
             * 
             * @param {*} map Leaflet map instance
             * @param {*} bounds bounds object
             * @param {*} tileLayer tile layer
             * @param {*} currentZoom current map zoom
             */
            getTileUrls (map, bounds, tileLayer, currentZoom) {
                if (!tileLayer) throw new Error('Tile layer is undefined');
                let maxZoom = 18;
                let urls = [];

                console.log(`Getting all tiles for specified boundary from ${currentZoom} to ${maxZoom} zoom`);
                for (let localZoom = currentZoom; localZoom <= maxZoom; localZoom++) {
                    let min = map.project(bounds.getNorthWest(), localZoom).divideBy(256).floor();
                    let max = map.project(bounds.getSouthEast(), localZoom).divideBy(256).floor();
                    for (let i = min.x; i <= max.x; i++) {
                        for (let j = min.y; j <= max.y; j++) {
                            let coords = new L.Point(i, j);
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
            fetchAndCacheTiles (tileURLs, onloadCallback, onerrorCallback) {
                for (var i = 0; i < tileURLs.length; ++i) {
                    let img = new Image();
                    img.onload = () => { onloadCallback(); };
                    img.onerror = () => { onerrorCallback(); };
                    img.src = tileURLs[i];
                }
            };

            /**
             *
             * @param e
             */
            onSave(e) {
                /*
                let urls = getTileUrls(mapObj, bounds, currentBaseLayer, currentZoom);
    
                var numberOfLoadedTiles = 0;
                var numberOfTilesToLoad = urls.length;
                const onloadCallback = () => {
                    numberOfLoadedTiles++;
                }
    
                const onerrorCallback = () => {
                    numberOfTilesToLoad--;
                }
    
                fetchAndCacheTiles(urls, onloadCallback, onerrorCallback);

                //this.state.drawRectangleControl.disable();
                */
            }

            refreshUsageStatistics() {
                const bytesToSize = (bytes) => {
                    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
                    if (bytes == 0) return '0 Byte';

                    let i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
                    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
                 };

                navigator.webkitTemporaryStorage.queryUsageAndQuota((usedBytes, grantedBytes) => {
                    this.setState({
                        storageUsed: bytesToSize(usedBytes),
                        storageAvailable: bytesToSize(grantedBytes)
                    });
                }, (e) => {
                    console.log('Error', e);
                });
            }

            /**
             *
             */
            componentDidMount() {
                let drawControlFull = new L.Control.Draw({ draw: { polyline: false } });

                this.refreshUsageStatistics();

                this.setState({
                    drawRectangleControl: new L.Draw.Rectangle(mapObj, drawControlFull.options.rectangle),
                    newAreaZoomMin: mapObj.getZoom()
                });

                mapObj.on('baselayerchange', (e) => {
                    console.log('baselayerchange');
                    this.setState({ currentBaseLayer: e.layer });
                });


            }

            /**
             *
             */
            componentWillUnmount() {
                // @todo
                // Move the tile management logic into the separate class
                // Clear drawn extent
                // Stop listening to draw:created
            }

            setMinZoom(e) {
                this.setState({newAreaZoomMin: e.target.value});
            }

            setMaxZoom(e) {
                this.setState({newAreaZoomMax: e.target.value});
            }

            /**
             * Setting stored area on the map
             */
            setExtent(e) {
                this.state.drawRectangleControl.enable();
                mapObj.on('draw:created', (e) => {
                    console.log('draw:created');
                    if (this.state.drawnExtentLayer) {
                        mapObj.removeLayer(this.state.drawnExtentLayer);
                    }

                    let layer = e.layer;
                    let bounds = layer.getBounds();
                    this.setState({
                        drawnExtentLayer: layer,
                        newAreaExtent: layer.getBounds(),
                        newAreaZoomMin: mapObj.getZoom()
                    });

                    layer.addTo(mapObj);
                });
            }

            /**
             * Clearing existing stored area
             */
            clearExtent() {
                if (this.state.drawnExtentLayer) {
                    mapObj.removeLayer(this.state.drawnExtentLayer);
                    this.setState({
                        drawnExtentLayer: false,
                        newAreaExtent: false
                    });
                }
            }

            /**
             *
             * @returns {XML}
             */
            render() {
                const showExtentButton = this.state.newAreaExtent ? (
                    <span>
                        <button type="button" className="btn btn-primary" onClick={this.setExtent}>{__("Redefine")}</button>
                        <button type="button" className="btn btn-primary" onClick={this.clearExtent}>{__("Clear")}</button>
                    </span>
                ) : (
                    <button type="button" className="btn btn-primary" onClick={this.setExtent}>{__("Define")}</button>
                );

                let zoomMinOptions = [];
                
                for (let i = minimalZoomLevel; i < this.state.newAreaZoomMax; i++) {
                    zoomMinOptions.push(<option key={i} value={i}>{i}</option>);
                }

                let zoomMaxOptions = [];
                for (let i = this.state.newAreaZoomMin; i <= maximumZoomLevel; i++) {
                    zoomMaxOptions.push(<option key={i} value={i}>{i}</option>);
                }
                
                return (
                    <div role="tabpanel">
                        <div className="panel panel-default">
                            <div className="panel-body offline-map-extension">
                                <div className="available-space-container">{__("Available space")}: {this.state.storageUsed}/{this.state.storageAvailable}</div>
                                <p>{__("Description")}</p>
                            </div>
                        </div>

                        <div className="panel panel-default">
                            <div className="panel-heading" role="tab">
                                <h4 className="panel-title">
                                    <a
                                        style={{display: 'block'}}
                                        className="accordion-toggle"
                                        data-toggle="collapse"
                                        data-parent="#layers"
                                        href="#collapseOfflineMap1"
                                        aria-expanded="true"><i className="material-icons">&#xE149;</i> {__("Store map area")}</a>
                                </h4>
                            </div>
                            <ul className="list-group" id="group-collapseOfflineMap1" role="tabpanel">
                                <div id="collapseOfflineMap1" className="accordion-body collapse in" aria-expanded="true">
                                    <div className="container-fluid">
                                        <div className="row">
                                            <div className="col-lg-12">
                                                <div>
                                                    <h3>{__("Extent")}</h3>
                                                    {showExtentButton}
                                                </div>
                                                <div>
                                                    <h3>{__("Comment")}</h3>
                                                    <textarea className="form-control" placeholder={__('Saved tiles will be used in...')}></textarea>
                                                </div>
                                                <div>
                                                    <h3>{__("Zoom")}</h3>
                                                    <div className="container-fluid">
                                                        <div className="row">
                                                            <div className="col-md-6">
                                                                <select className="form-control" onChange={this.setMinZoom} defaultValue={this.state.newAreaZoomMin}>{zoomMinOptions}</select>
                                                            </div>
                                                            <div className="col-md-6">
                                                                <select className="form-control" onChange={this.setMaxZoom} defaultValue={this.state.newAreaZoomMax}>{zoomMaxOptions}</select>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <button type="button" className="btn btn-primary btn-block"><i className="material-icons">&#xE149;</i> {__("Store")}</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </ul>
                        </div>
                    </div>
                );
            }
        }

        utils.createMainTab(exId, __("Offline map"), __("Info"), require('./../../../browser/modules/height')().max);
        try {
            ReactDOM.render(
                <OfflineMap />,
                document.getElementById(exId)
            );
        } catch (e) {
            console.log(e);
        }
    }

};


