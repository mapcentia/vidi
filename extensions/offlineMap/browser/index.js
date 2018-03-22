/**
 * @fileoverview Description of file, its uses and information
 * about its dependencies.
 */

'use strict';

/**
 * CachedAreasManager
 */
const CachedAreasManager = require('./CachedAreasManager');

/**
 * Translations
 */
const translations = require('./translations');

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
 */
var setBaseLayer;

/**
 *
 */
var cachedAreasManagerInstance = new CachedAreasManager();

/**
 * React components
 */
const MapAreaList = require('./components/MapAreaList');

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
        setBaseLayer = o.setBaseLayer;
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
        var dict = translations;

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
                    existingCachedAreas: {},
                    storageUsed: 0,
                    storageAvailable: 0,
                    drawRectangleControl: false,
                    drawnExtentLayer: false,
                    newAreaExtent: false,
                    newAreaComment: '',
                    newAreaZoomMax: maximumZoomLevel,
                    loading: false,
                    tilesLoaded: 0,
                    tilesLeftToLoad: 0
                };

                this.setExtent = this.setExtent.bind(this);
                this.clearExtent = this.clearExtent.bind(this);
                this.setComment = this.setComment.bind(this);
                this.setMinZoom = this.setMinZoom.bind(this);
                this.setMaxZoom = this.setMaxZoom.bind(this);
                this.clearAddForm = this.clearAddForm.bind(this);
                this.onSave = this.onSave.bind(this);
            }

            /**
             *
             */
            componentDidMount() {
                let drawControlFull = new L.Control.Draw({ draw: { polyline: false } });

                this.refreshStatus();

                this.setState({
                    drawRectangleControl: new L.Draw.Rectangle(mapObj, drawControlFull.options.rectangle),
                    newAreaZoomMin: mapObj.getZoom(),
                    newAreaZoomMax: this.getMapMaxZoom(),
                    zoomMin: this.getMapMinZoom(),
                    zoomMax: this.getMapMaxZoom()
                });

                mapObj.on('zoomend', (e) => {
                    if (mapObj.getZoom() <= this.state.newAreaZoomMax) {
                        this.setState({ newAreaZoomMin: mapObj.getZoom() });
                    } else {
                        this.setState({ newAreaZoomMin: this.state.newAreaZoomMax });
                    }
                });
            }

            /**
             * Generates all URL for fetching the underlying tile set for specified boundary
             * 
             * @param {*} map Leaflet map instance
             * @param {*} bounds bounds object
             * @param {*} tileLayer tile layer
             * @param {*} currentZoom current map zoom
             */
            getTileUrls (map, bounds, tileLayer, minZoom, maxZoom) {
                if (!tileLayer) throw new Error('Tile layer is undefined');
                let urls = [];

                console.log(`Getting all tiles for specified boundary from ${minZoom} to ${maxZoom} zoom`);
                for (let localZoom = minZoom; localZoom <= maxZoom; localZoom++) {
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

            clearAddForm() {
                this.clearExtent();
                this.setState({
                    newAreaComment: '',
                    newAreaZoomMin: mapObj.getZoom(),
                    newAreaZoomMax: this.getMapMaxZoom(),
                    loading: false,
                    tilesLoaded: 0,
                    tilesLeftToLoad: 0
                });
            }

            /**
             *
             * @param e
             */
            onSave(e) {
                let layer = false;
                let activeBaseLayer = setBaseLayer.getActiveBaseLayer();
                for (let key in mapObj._layers) {
                    if (mapObj._layers[key].id && mapObj._layers[key].id === activeBaseLayer.id) {
                        layer = mapObj._layers[key];
                    }
                }

                let tileURLs = this.getTileUrls(mapObj, this.state.newAreaExtent, layer,
                    this.state.newAreaZoomMin, this.state.newAreaZoomMax);
                
                this.setState({
                    tilesLoaded: 0,
                    tilesLeftToLoad: tileURLs.length
                });

                const attemptToSaveCachedArea = (tileURLs) => {
                    if (this.state.tilesLeftToLoad === this.state.tilesLoaded) {
                        cachedAreasManagerInstance.add({
                            tileURLs,
                            comment: this.state.newAreaComment,
                            zoomMin: this.state.newAreaZoomMin,
                            zoomMax: this.state.newAreaZoomMax
                        }).then(() => {
                            this.refreshStatus();
                        });
                    }
                };

                // @todo What if there are 1000 tiles - 1000 updates?
                this.fetchAndCacheTiles(tileURLs, () => {
                    this.setState({ tilesLoaded: (this.state.tilesLoaded + 1) });
                    attemptToSaveCachedArea(tileURLs);
                }, () => {
                    console.log('Unable to fetch tile');
                    this.setState({ tilesLeftToLoad: this.state.tilesLeftToLoad-- });
                    attemptToSaveCachedArea(tileURLs);
                });

                this.setState({ loading: true });
            }

            refreshStatus() {
                const bytesToSize = (bytes) => {
                    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
                    if (bytes == 0) return '0 Byte';

                    let i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
                    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
                };

                cachedAreasManagerInstance.getAll().then(existingCachedAreas => {
                    this.setState({ existingCachedAreas });
                });

                navigator.webkitTemporaryStorage.queryUsageAndQuota((usedBytes, grantedBytes) => {
                    this.setState({
                        storageUsed: bytesToSize(usedBytes),
                        storageAvailable: bytesToSize(grantedBytes)
                    });
                }, (e) => {
                    console.log('Error', e);
                });
            }

            getMapMinZoom() {
                return minimalZoomLevel;
            }

            getMapMaxZoom() {
                return maximumZoomLevel;
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

            setComment(e) {
                this.setState({ newAreaComment: e.target.value });
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

            formIsValid() {
                return (this.state.newAreaExtent && this.state.newAreaZoomMax && this.state.newAreaZoomMin);
            }

            /**
             *
             * @returns {XML}
             */
            render() {
                console.log('Rendering');
                const showExtentButton = this.state.newAreaExtent ? (
                    <span>
                        <button type="button" className="btn btn-primary" onClick={this.setExtent}>{__("Redefine")}</button>
                        <button type="button" className="btn btn-primary" onClick={this.clearExtent}>{__("Clear")}</button>
                    </span>
                ) : (
                    <button type="button" className="btn btn-primary" onClick={this.setExtent}>{__("Define")}</button>
                );

                let zoomMinOptions = [];
                for (let i = this.state.zoomMin; i <= this.state.newAreaZoomMax; i++) {
                    zoomMinOptions.push(<option key={i} value={i}>{i}</option>);
                }

                let zoomMaxOptions = [];
                for (let i = this.state.newAreaZoomMin; i <= this.state.zoomMax; i++) {
                    zoomMaxOptions.push(<option key={i} value={i}>{i}</option>);
                }

                let required = (<span style={{color: 'red'}}><sup>*</sup></span>);

                let loadingOverlay = false;
                // @todo Translations
                if (this.state.loading) {
                    let content = false;
                    if (this.state.tilesLoaded === this.state.tilesLeftToLoad) {
                        content = (<div>
                            <h4><i className="material-icons" style={{color: 'green'}}>&#xE5CA;</i> Done</h4>
                            <button onClick={this.clearAddForm} className="btn btn-primary" type="button">{__("Store another")}</button>
                        </div>);
                    } else {
                        content = (<div>
                            <h4>Saving tiles ({this.state.tilesLoaded} of {this.state.tilesLeftToLoad})</h4>
                            <div className="progress">
                                <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: ((this.state.tilesLoaded / this.state.tilesLeftToLoad * 100) + '%')}}></div>
                            </div>
                        </div>);
                    }

                    loadingOverlay = (<div style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        zIndex: '1000'
                    }}>
                        <div style={{
                            top: '40px',
                            textAlign: 'center',
                            position: 'relative',
                            padding: '40px'
                        }}>{content}</div>
                    </div>);
                }

                return (
                    <div role="tabpanel">
                        <div className="panel panel-default">
                            <div className="panel-body offline-map-extension">
                                <div className="available-space-container">{__("Available space")}: {this.state.storageUsed}/{this.state.storageAvailable}</div>
                                <p>{__("Description")}</p>
                            </div>
                        </div>

                        {/* Add cached map form */}
                        <div className="panel panel-default">
                            <div className="panel-heading" role="tab">
                                <h4 className="panel-title">
                                    <a
                                        style={{display: 'block'}}
                                        className="accordion-toggle"
                                        data-toggle="collapse"
                                        data-parent="#layers"
                                        href="#collapseOfflineMap1"
                                        aria-expanded="true"><i className="material-icons">&#xE906;</i> {__("Store map area")}</a>
                                </h4>
                            </div>
                            <ul className="list-group" id="group-collapseOfflineMap1" role="tabpanel">
                                <div id="collapseOfflineMap1" className="accordion-body collapse" aria-expanded="true" style={{position: 'relative'}}>
                                    {loadingOverlay}
                                    <div className="container-fluid">
                                        <div className="row">
                                            <div className="col-lg-12">
                                                <div>
                                                    <h3>{__("Extent")} {required}</h3>
                                                    {showExtentButton}
                                                </div>
                                                <div>
                                                    <h3>{__("Comment")}</h3>
                                                    <textarea className="form-control" onChange={this.setComment} placeholder={__('Saved tiles will be used in...')}></textarea>
                                                </div>
                                                <div>
                                                    <h3>{__("Zoom")} {required}</h3>
                                                    <div className="container-fluid">
                                                        <div className="row">
                                                            <div className="col-md-6">
                                                                <select className="form-control" onChange={this.setMinZoom} value={this.state.newAreaZoomMin}>{zoomMinOptions}</select>
                                                            </div>
                                                            <div className="col-md-6">
                                                                <select className="form-control" onChange={this.setMaxZoom} defaultValue={this.state.newAreaZoomMax}>{zoomMaxOptions}</select>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <button type="button" className={"btn btn-primary btn-block " + (this.formIsValid() ? '' : 'disabled')} onClick={this.onSave}>
                                                        <i className="material-icons">&#xE906;</i> {__("Store")}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </ul>
                        </div>

                        {/* Existing cached map list */}
                        <div className="panel panel-default">
                            <div className="panel-heading" role="tab">
                                <h4 className="panel-title">
                                    <a
                                        style={{display: 'block'}}
                                        className="accordion-toggle"
                                        data-toggle="collapse"
                                        data-parent="#layers"
                                        href="#collapseOfflineMap2"
                                        aria-expanded="true"><i className="material-icons">&#xE896;</i> {__("Stored map areas")}</a>
                                </h4>
                            </div>
                            <ul className="list-group" id="group-collapseOfflineMap2" role="tabpanel">
                                <div id="collapseOfflineMap2" className="accordion-body collapse in" aria-expanded="true">
                                    <MapAreaList items={this.state.existingCachedAreas}/>
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


