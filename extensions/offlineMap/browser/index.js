/**
 * @fileoverview Description of file, its uses and information
 * about its dependencies.
 */

'use strict';

const CACHE_NAME = 'vidi-static-cache';
const NUMBER_OF_SIMULTANEOUS_REQUESTS = 8;

/**
 * Browser detection
 */
const { detect } = require('detect-browser');
const browser = detect();

/**
 * Async
 */
import async from 'async';
import queue from 'async/queue';

/**
 * CachedAreasManager
 */
const CachedAreasManager = require('./CachedAreasManager');

/**
 * LoadingOverlay
 */
const LoadingOverlay = require('./components/LoadingOverlay');

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
var exId = "offline-map-form";

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

        utils.createMainTab(exId, __("Offline map"), __("OfflineMap block description"), require('./../../../browser/modules/height')().max, "get_app");

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
                    cacheIsAvailable: 0,
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
                    tilesLeftToLoad: 0,
                    mapAreasTilesLoaded: 0,
                    mapAreasTilesLeftToLoad: 0,
                };

                this.setExtent = this.setExtent.bind(this);
                this.clearExtent = this.clearExtent.bind(this);
                this.setComment = this.setComment.bind(this);
                this.setMinZoom = this.setMinZoom.bind(this);
                this.setMaxZoom = this.setMaxZoom.bind(this);
                this.clearAddForm = this.clearAddForm.bind(this);
                this.reloadPage = this.reloadPage.bind(this);
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

                const checkServiceWorkerRegistration = () => {
                    if (navigator.serviceWorker.controller) {
                        this.setState({
                            cacheIsAvailable: 1
                        });
                    } else {
                        this.setState({
                            cacheIsAvailable: -1
                        });

                        setTimeout(checkServiceWorkerRegistration, 2000);
                    }     
                };

                setTimeout(checkServiceWorkerRegistration, 1000);

                mapObj.on('zoomend', (e) => {
                    if (mapObj.getZoom() <= this.state.newAreaZoomMax) {
                        this.setState({ newAreaZoomMin: mapObj.getZoom() });
                    } else {
                        this.setState({ newAreaZoomMin: this.state.newAreaZoomMax });
                    }
                });
            }

            componentWillUnmount() {
                alert(`www`);
            }

            /**
             * Generates all URL for fetching the underlying tile set for specified boundary
             * 
             * @param {*} map Leaflet map instance
             * @param {*} bounds bounds object
             * @param {*} tileLayer tile layer
             * @param {*} minZoom minimum map zoom
             * @param {*} maxZoom maximum map zoom
             */
            getTileUrls (map, bounds, tileLayer, minZoom, maxZoom) {
                if (!tileLayer) throw new Error('Tile layer is undefined');
                let urls = [];

                console.log(`Getting all tiles for specified boundary from ${minZoom} to ${maxZoom} zoom`);
                for (let localZoom = minZoom; localZoom <= maxZoom; localZoom++) {
                    let min = map.project(bounds.getNorthWest(), localZoom).divideBy(256).floor();
                    let max = map.project(bounds.getSouthEast(), localZoom).divideBy(256).floor();
                    const max_y = (Math.pow(2, localZoom) - 1);

                    for (let i = min.x; i <= max.x; i++) {
                        for (let j = min.y; j <= max.y; j++) {
                            let coords = new L.Point(i, j);
                            coords.z = localZoom;

                            if (tileLayer.options.subdomains) {
                                coords.s = tileLayer.options.subdomains[Math.floor(Math.random() * tileLayer.options.subdomains.length)];
                            }

                            if (tileLayer.options.tms) {
                                coords.y = max_y - coords.y;
                            }

                            let url = L.Util.template(tileLayer._url, coords);
                            urls.push(url);
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
                var fetchTileQueue = async.queue((requestURL, callback) => {
                    let img = new Image();
                    img.onload = () => {
                        onloadCallback();
                        callback();
                    };

                    img.onerror = () => {
                        onerrorCallback();
                        callback();
                    };

                    img.src = requestURL;
                }, NUMBER_OF_SIMULTANEOUS_REQUESTS);

                fetchTileQueue.drain = () => {};
                fetchTileQueue.push(tileURLs, (err) => {});
            };

            checkAllURLsAreNotCached(item) {
                let result = new Promise((resolve, reject) => {
                    caches.open(CACHE_NAME).then((cache) => {
                        let promises = [];
                        for (let i = 0; i < item.data.tileURLs.length; i++) {
                            promises.push(cache.match(item.data.tileURLs[i]));
                        }
    
                        Promise.all(promises).then(values => {
                            let allURLsAreNotCached = true;
                            values.map(item => {
                                if (item) {
                                    allURLsAreNotCached = false;
                                    return false;
                                }
                            });

                            resolve(allURLsAreNotCached);
                        });
                    });
                });

                return result;
            };

            onMapAreaRefresh(item) {
                for (let key in this.state.existingCachedAreas) {
                    if (key === item.id) {
                        if (confirm(__("Refresh map area?"))) {
                            this.deleteMapArea(item).then(() => {
                                this.checkAllURLsAreNotCached(item).then(result => {
                                    if (result === false) {
                                        console.warn(`Some tiles still exist in cache`);
                                    }

                                    this.setState({
                                        mapAreasTilesLoaded: 0,
                                        mapAreasTilesLeftToLoad: item.data.tileURLs.length
                                    });

                                    const checkRefreshStatus = () => {
                                        if (this.state.mapAreasTilesLoaded === this.state.mapAreasTilesLeftToLoad) {
                                            navigator.serviceWorker.controller.postMessage({force: false});
                                            setTimeout(() => {
                                                this.setState({
                                                    mapAreasTilesLoaded: 0,
                                                    mapAreasTilesLeftToLoad: 0
                                                });
                                            }, 1000);
                                        }
                                    }

                                    navigator.serviceWorker.controller.postMessage({force: true});
                                    this.fetchAndCacheTiles(item.data.tileURLs, () => {
                                        this.setState({ mapAreasTilesLoaded: (this.state.mapAreasTilesLoaded + 1) });
                                        checkRefreshStatus();
                                    }, () => {
                                        console.log('Unable to fetch tile');
                                        this.setState({ mapAreasTilesLeftToLoad: this.state.mapAreasTilesLeftToLoad-- });
                                        checkRefreshStatus();
                                    });
                                });
                            });
                        }
                    }
                }
            }

            deleteMapArea(item) {
                return caches.open(CACHE_NAME).then((cache) => {
                    let promises = [];
                    for (let i = 0; i < item.data.tileURLs.length; i++) {
                        promises.push(cache.delete(item.data.tileURLs[i]));
                    }

                    return Promise.all(promises);
                });
            }

            onMapAreaDelete(item) {
                for (let key in this.state.existingCachedAreas) {
                    if (key === item.id) {
                        if (confirm(__("Delete map area?"))) {
                            this.deleteMapArea(item).then(() => {
                                cachedAreasManagerInstance.delete(item.id).then(() => {
                                    this.refreshStatus();
                                }); 
                            });
                        }
                    }
                }
            }

            reloadPage(e) {
                window.location.reload();
            }

            switchProtocol(e) {
                window.location.href = window.location.href.replace('http://', 'https://');
            }

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

            attemptToSaveCachedArea(tileURLs, baseLayer) {
                if (this.state.tilesLeftToLoad === this.state.tilesLoaded) {
                    navigator.serviceWorker.controller.postMessage({force: false});
                    cachedAreasManagerInstance.add({
                        tileURLs,
                        layerId: baseLayer.id,
                        extent: this.state.newAreaExtent,
                        comment: this.state.newAreaComment,
                        zoomMin: this.state.newAreaZoomMin,
                        zoomMax: this.state.newAreaZoomMax
                    }).then(() => {
                        this.clearExtent();
                        this.refreshStatus();
                    });
                }
            };

            /**
             *
             * @param e
             */
            onSave(e) {
                if (this.formIsValid()) {
                    let layer = false;
                    let activeBaseLayer = setBaseLayer.getActiveBaseLayer();
                    for (let key in mapObj._layers) {
                        if (mapObj._layers[key].id && mapObj._layers[key].id === activeBaseLayer.id) {
                            layer = mapObj._layers[key];
                        }
                    }

                    if (!layer) throw new Error("Unable to find active base layer");

                    let tileURLs = this.getTileUrls(mapObj, this.state.newAreaExtent, layer,
                        this.state.newAreaZoomMin, this.state.newAreaZoomMax);
                    
                    this.setState({
                        tilesLoaded: 0,
                        tilesLeftToLoad: tileURLs.length
                    });

                    navigator.serviceWorker.controller.postMessage({force: true});

                    // @todo What if there are 1000 tiles - 1000 updates?
                    this.fetchAndCacheTiles(tileURLs, () => {
                        this.setState({ tilesLoaded: (this.state.tilesLoaded + 1) });
                        this.attemptToSaveCachedArea(tileURLs, layer);
                    }, () => {
                        console.log('Unable to fetch tile');
                        this.setState({ tilesLeftToLoad: this.state.tilesLeftToLoad-- });
                        this.attemptToSaveCachedArea(tileURLs, layer);
                    });

                    this.setState({ loading: true });
                }
            }

            refreshStatus() {
                cachedAreasManagerInstance.getAll().then(existingCachedAreas => {
                    this.setState({ existingCachedAreas });
                });

                const bytesToSize = (bytes) => {
                    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
                    if (bytes == 0) return '0 Byte';

                    let i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
                    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
                };

                if (browser && browser.name.toLowerCase() !== 'safari' && browser.name.toLowerCase() !== 'ios') {
                    navigator.webkitTemporaryStorage.queryUsageAndQuota((usedBytes, grantedBytes) => {
                        this.setState({
                            storageUsed: bytesToSize(usedBytes),
                            storageAvailable: bytesToSize(grantedBytes)
                        });
                    }, (e) => {
                        console.log('Error', e);
                    });
                } else {
                    this.setState({
                        storageUsed: bytesToSize(0),
                        storageAvailable: bytesToSize(0)
                    });
                }
            }

            getMapMinZoom() {
                return minimalZoomLevel;
            }

            getMapMaxZoom() {
                return maximumZoomLevel;
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
                $(`#offline-map-dialog`).find(`.expand-less`).trigger(`click`);
                
                mapObj.on('draw:created', (e) => {
                    $(`#offline-map-dialog`).find(`.expand-more`).trigger(`click`);
                    
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
                if (this.state.loading) {
                    loadingOverlay = (<LoadingOverlay tilesLoaded={this.state.tilesLoaded} tilesLeftToLoad={this.state.tilesLeftToLoad}>
                        <button onClick={this.clearAddForm} className="btn btn-primary" type="button">{__("Store another")}</button>
                    </LoadingOverlay>);
                }

                let mapAreasRefreshOverlay = false;
                if (this.state.mapAreasTilesLeftToLoad > 0) {
                    mapAreasRefreshOverlay = (<LoadingOverlay
                        tilesLoaded={this.state.mapAreasTilesLoaded}
                        tilesLeftToLoad={this.state.mapAreasTilesLeftToLoad}/>);
                }

                let pageIsSecured = ((document.location.protocol.indexOf('https') === 0) ? true : false);
                let securedPageNotification = false;
                let cacheNotification = false;
                let addCachedMapFormPanel = false;
                let existingCachedMapListBlock = false;
                if (pageIsSecured) {
                    if (this.state.cacheIsAvailable === -1) {
                        cacheNotification = (<div className="alert alert-success" role="alert" onClick={this.reloadPage} style={{
                            textDecoration: 'underline',
                            cursor: 'pointer',
                            textAlign: 'center'
                        }}>
                            {__("Please reload the page")}
                        </div>);
                    } else if (this.state.cacheIsAvailable === 0) {
                        cacheNotification = (<div className="alert alert-warning" role="alert" style={{
                            textAlign: 'center'
                        }}>
                            {__("Checking the cache status")}
                        </div>);
                    }

                    if (this.state.cacheIsAvailable === 1) {
                        addCachedMapFormPanel = (<div className="panel panel-default">
                            <div className="panel-heading" role="tab">
                                <h4 className="panel-title">
                                    <a
                                        style={{display: 'block'}}
                                        className="accordion-toggle"
                                        data-toggle="collapse"
                                        data-parent="#layers"
                                        id="collapseOfflineMap1-trigger"
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
                                                    <h4>{__("Extent")} {required}</h4>
                                                    {showExtentButton}
                                                </div>
                                                <div>
                                                    <h4>{__("Comment")}</h4>
                                                    <textarea className="form-control" id="offline-map-comment" onChange={this.setComment} placeholder={__('Saved tiles will be used in...')}></textarea>
                                                </div>
                                                <div>
                                                    <h4>{__("Zoom")} {required}</h4>
                                                    <div className="container-fluid">
                                                        <div className="row">
                                                            <div className="col-md-6">
                                                                <select className="form-control" id="offline-map-zoom_min" onChange={this.setMinZoom} value={this.state.newAreaZoomMin}>{zoomMinOptions}</select>
                                                            </div>
                                                            <div className="col-md-6">
                                                                <select className="form-control" id="offline-map-zoom_max" onChange={this.setMaxZoom} defaultValue={this.state.newAreaZoomMax}>{zoomMaxOptions}</select>
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
                        </div>);
                    }

                    if (this.state.cacheIsAvailable === 1) {
                        existingCachedMapListBlock = (<div className="panel panel-default">
                            <div className="panel-heading" role="tab">
                                <h4 className="panel-title">
                                    <a
                                        style={{display: 'block'}}
                                        className="accordion-toggle"
                                        data-toggle="collapse"
                                        data-parent="#layers"
                                        id="collapseOfflineMap2-trigger"
                                        href="#collapseOfflineMap2"
                                        aria-expanded="true"><i className="material-icons">&#xE896;</i> {__("Stored map areas")}</a>
                                </h4>
                            </div>
                            <ul className="list-group" id="group-collapseOfflineMap2" role="tabpanel">
                                <div id="collapseOfflineMap2" className="accordion-body collapse in" aria-expanded="true">
                                    {mapAreasRefreshOverlay}
                                    <MapAreaList
                                        onMapAreaRefresh={(item) => {this.onMapAreaRefresh(item)}}
                                        onMapAreaDelete={(item) => {this.onMapAreaDelete(item)}}
                                        mapObj={mapObj}
                                        items={this.state.existingCachedAreas}/>
                                </div>
                            </ul>
                        </div>);
                    }
                } else {
                    securedPageNotification = (<div className="alert alert-warning" role="alert" onClick={this.switchProtocol} style={{
                        textDecoration: 'underline',
                        cursor: 'pointer',
                        textAlign: 'center'
                    }}>
                        {__("Please use the secured version of page (HTTPS enabled)")}
                    </div>);
                }

                let availableSpaceNotification = (<div className="available-space-container">
                    {__("Available space")}: {this.state.storageUsed}/{this.state.storageAvailable}
                </div>);
                if (browser && browser.name === 'safari') {
                    availableSpaceNotification = (<div className="available-space-container">
                        {__("Available space can not be detected")}
                    </div>);
                }

                return (
                    <div role="tabpanel">
                        <div className="panel panel-default">
                            <div className="panel-body offline-map-extension">
                                {/* Available storage notification */}
                                {availableSpaceNotification}

                                <p>{__("OfflineMap instructions")}</p>
                            </div>
                        </div>

                        {/* Secured page notification */}
                        {securedPageNotification}

                        {/* Cache availability notification */}
                        {cacheNotification}

                        {/* Add cached map form */}
                        {addCachedMapFormPanel}

                        {/* Existing cached map list */}
                        {existingCachedMapListBlock}
                    </div>
                );
            }
        }

        if (document.getElementById(exId)) {
            try {
                ReactDOM.render(
                    <OfflineMap />,
                    document.getElementById(exId)
                );
            } catch (e) {
                console.log(e);
            }
        } else {
            console.warn(`Unable to find the container for offlineMap extension (element id: ${exId})`);
        }
    }

};


