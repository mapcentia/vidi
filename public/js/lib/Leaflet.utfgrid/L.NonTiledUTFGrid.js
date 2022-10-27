(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('leaflet')) :
        typeof define === 'function' && define.amd ? define(['leaflet'], factory) :
            (global = typeof globalThis !== 'undefined' ? globalThis : global || self, (global.L = global.L || {}, global.L.NonTiledUTFGrid = factory(global.L)));
})(this, (function (leaflet) {
    'use strict';

    /*
     * L.NonTiledLayer is an addon for leaflet which renders dynamic image overlays
     */
    const NonTiledUTFGrid = leaflet.Layer.extend({
        emptyImageUrl: 'data:image/gif;base64,R0lGODlhAQABAHAAACH5BAUAAAAALAAAAAABAAEAAAICRAEAOw==',
        options: {
            attribution: '',
            opacity: 1.0,
            zIndex: undefined,
            minZoom: 0,
            maxZoom: 18,
            pointerEvents: undefined,
            errorImageUrl: 'data:image/gif;base64,R0lGODlhAQABAHAAACH5BAUAAAAALAAAAAABAAEAAAICRAEAOw==',
            bounds: new leaflet.LatLngBounds([-85.05, -180], [85.05, 180]),
            detectRetina: false,
        },
        key: '',
        _cache: null, // {<tileKey>: <utfgrid>}
        _map: null,

        _throttleMove: null, // holds throttled mousemove handler
        // override this method in the inherited class
        // getImageUrl: function (bounds, width, height) {},
        // getImageUrlAsync: function (bounds, width, height, f) {},
        initialize: function initialize(options) {

            leaflet.setOptions(this, options);
        },
        onAdd: function onAdd(map) {
            this._cache = {};
            this._map = map;

            this._updateCursor = function (cursor) {
                //console.log(this)
            }; //no-op, overridden below
            if (!this._div) {
                this._div = leaflet.DomUtil.create('div', 'leaflet-utfgrid-layer');
                if (this.options.pointerEvents) {
                    this._div.style['pointer-events'] = this.options.pointerEvents;
                }
                if (typeof this.options.zIndex !== 'undefined') {
                    this._div.style.zIndex = this.options.zIndex;
                }
                if (typeof this.options.opacity !== 'undefined') {
                    this._div.style.opacity = this.options.opacity;
                }
            }
            this._throttleMove = L.Util.throttle(this._move, 66, this);
            this.getPane().appendChild(this._div);
            // this._bufferImage = this._initImage();
            this._currentImage = this._initImage();
            this._update();
            this._connectMapEventHandlers();
        },
        _connectMapEventHandlers: function () {
            //this._map.on('click', this._onClick, this);
            this._map.on('mousemove', this._throttleMove, this);
        },
        _disconnectMapEventHandlers: function () {
            // this._map.off('click', this._onClick, this);
            this._map.off('mousemove', this._throttleMove, this);
        },
        onRemove: function onRemove() {
            this.getPane().removeChild(this._div);
            // this._div.removeChild(this._bufferImage);
            this._div.removeChild(this._currentImage);
            this._disconnectMapEventHandlers();
            // NonTiledUTFGrid.prototype.onRemove.call(this, map);
        },
        addTo: function addTo(map) {
            map.addLayer(this);
            return this;
        },
        _setZoom: function setZoom() {
            if (this._currentImage._bounds)
                this._resetImageScale(this._currentImage, true);
            // if (this._bufferImage._bounds)
            //     this._resetImageScale(this._bufferImage);
        },
        getEvents: function getEvents() {
            const events = {
                moveend: this._update,
            };
            if (this._zoomAnimated) {
                events.zoomanim = this._animateZoom;
            }
            events.zoom = this._setZoom;
            return events;
        },
        getElement: function getElement() {
            return this._div;
        },
        setOpacity: function setOpacity(opacity) {
            this.options.opacity = opacity;
            if (this._div) {
                leaflet.DomUtil.setOpacity(this._div, this.options.opacity);
            }
            return this;
        },
        _initImage: function initImage() {
            const image = leaflet.DomUtil.create('iframe', 'leaflet-utfgrid-layer');
            if (this.options.crossOrigin) {
                image.crossOrigin = this.options.crossOrigin;
            }
            //this._div.appendChild(image);
            if (this._map.options.zoomAnimation && leaflet.Browser.any3d) {
                leaflet.DomUtil.addClass(image, 'leaflet-zoom-animated');
            } else {
                leaflet.DomUtil.addClass(image, 'leaflet-zoom-hide');
            }
            // TODO createImage util method to remove duplication
            leaflet.extend(image, {
                galleryimg: 'no',
                onselectstart: leaflet.Util.falseFn,
                onmousemove: leaflet.Util.falseFn,
                onload: leaflet.bind(this._onImageLoad, this),
                onerror: leaflet.bind(this._onImageLoad, this),
            });
            return image;
        },
        redraw: function redraw() {
            if (this._map) {
                this._update();
            }
            return this;
        },
        _resetImageScale: function resetImageScale(image) {
            const bounds = new leaflet.Bounds(this._map.latLngToLayerPoint(image._bounds.getNorthWest()), this._map.latLngToLayerPoint(image._bounds.getSouthEast()));
            const orgSize = image._orgBounds.getSize().y;
            const scaledSize = bounds.getSize().y;
            const scale = scaledSize / orgSize;
            image._sscale = scale;
            leaflet.DomUtil.setTransform(image, bounds.min, scale);
        },
        _resetImage: function resetImage(image) {
            const bounds = new leaflet.Bounds(this._map.latLngToLayerPoint(image._bounds.getNorthWest()), this._map.latLngToLayerPoint(image._bounds.getSouthEast()));
            const size = bounds.getSize();
            leaflet.DomUtil.setPosition(image, bounds.min);
            image._orgBounds = bounds;
            image._sscale = 1;
            if (this._useCanvas) {
                image.width = size.x;
                image.height = size.y;
            } else {
                image.style.width = `${size.x}px`;
                image.style.height = `${size.y}px`;
            }
        },
        _getImageScale: function getImageScale() {
            return this.options.detectRetina && leaflet.Browser.retina ? 2 : 1;
        },
        _getClippedBounds: function getClippedBounds() {
            const wgsBounds = this._map.getBounds();
            // truncate bounds to valid wgs bounds
            let mSouth = wgsBounds.getSouth();
            let mNorth = wgsBounds.getNorth();
            let mWest = wgsBounds.getWest();
            let mEast = wgsBounds.getEast();
            const lSouth = this.options.bounds.getSouth();
            const lNorth = this.options.bounds.getNorth();
            const lWest = this.options.bounds.getWest();
            const lEast = this.options.bounds.getEast();
            // mWest = (mWest + 180) % 360 - 180;
            if (mSouth < lSouth)
                mSouth = lSouth;
            if (mNorth > lNorth)
                mNorth = lNorth;
            if (mWest < lWest)
                mWest = lWest;
            if (mEast > lEast)
                mEast = lEast;
            const world1 = new leaflet.LatLng(mNorth, mWest);
            const world2 = new leaflet.LatLng(mSouth, mEast);
            return new leaflet.LatLngBounds(world1, world2);
        },
        _update: function update() {
            const bounds = this._getClippedBounds();
            // re-project to corresponding pixel bounds
            const pix1 = this._map.latLngToContainerPoint(bounds.getNorthWest());
            const pix2 = this._map.latLngToContainerPoint(bounds.getSouthEast());
            // get pixel size
            let width = pix2.x - pix1.x;
            let height = pix2.y - pix1.y;
            let i;
            // set scales for zoom animation
            // this._bufferImage._scale = this._bufferImage._lastScale;
            this._currentImage._scale = 1;
            this._currentImage._lastScale = this._currentImage._scale;
            // this._bufferImage._sscale = 1;
            this._currentImage._bounds = bounds;
            this._resetImage(this._currentImage);
            i = this._currentImage;
            leaflet.DomUtil.setOpacity(i, 0);
            if (this._map.getZoom() < this.options.minZoom
                || this._map.getZoom() > this.options.maxZoom
                || width < 32
                || height < 32) {
                this._div.style.visibility = 'hidden';
                i.src = this.emptyImageUrl;
                i.key = '<empty>';
                this.key = i.key;
                i.tag = null;
                return;
            }
            // fire loading event
            this.fire('loading');
            width *= this._getImageScale();
            height *= this._getImageScale();
            // create a key identifying the current request
            this.key = [bounds.getNorthWest(), bounds.getSouthEast(), width, height].join(', ');
            let _self = this;
            if (this.getImageUrl) {
                i.src = this.getImageUrl(bounds, width, height);
                i.key = this.key;
                $.getJSON(i.src, function (data) {
                    _self._cache["test"] = data;
                });
            } else {
                this.getImageUrlAsync(bounds, width, height, this.key, (key, url, tag) => {
                    i.key = key;
                    i.src = url;
                    i.tag = tag;
                });
            }
        },
        _onImageError: function onImageError(e) {
            // this.fire('error', e);
            // leaflet.DomUtil.addClass(e.target, 'invalid');
            // prevent error loop if error image is not valid
            if (e.target.src !== this.options.errorImageUrl) {
                // e.target.src = this.options.errorImageUrl;
            }
        },
        _onImageLoad: function onImageLoad(e) {
            if (e.target.src !== this.options.errorImageUrl) {
                leaflet.DomUtil.removeClass(e.target, 'invalid');
                if (!e.target.key || e.target.key !== this.key) { // obsolete / outdated image
                    return;
                }
            }
            this._onImageDone(e);
            this.fire('load', e);
        },
        _onImageDone: function onImageDone(e) {
            this._cache["test"] = JSON.parse(e.target.contentWindow.document.body.innerText);
            // let tmp;
            // leaflet.DomUtil.setOpacity(this._currentImage, 1);
            // leaflet.DomUtil.setOpacity(this._bufferImage, 0);
            // if (this._addInteraction && this._currentImage.tag) {
            //     this._addInteraction(this._currentImage.tag);
            // }
            // tmp = this._bufferImage;
            // this._bufferImage = this._currentImage;
            // this._currentImage = tmp;
            // if (e.target.key !== '<empty>') {
            //     this._div.style.visibility = 'visible';
            // }
        },

        _move: function (e) {
            if (e.latlng == null) {
                return
            }

            var on = this._objectForEvent(e);

            if (on._tileCharCode !== this._tileCharCode) {
                if (this._mouseOn) {
                    this.fire('mouseout', {
                        latlng: e.latlng,
                        data: this._mouseOn,
                        _tile: this._mouseOnTile,
                        _tileCharCode: this._tileCharCode
                    });
                    this._updateCursor('');
                }
                if (on.data) {
                    this.fire('mouseover', on);
                    this._updateCursor('pointer');
                }

                this._mouseOn = on.data;
                this._mouseOnTile = on._tile;
                this._tileCharCode = on._tileCharCode;
            } else if (on.data) {
                this.fire('mousemove', on);
            }
        },
        _objectForEvent: function (e) {
            if (!e.latlng) return;  // keyboard <ENTER> events also pass through as click events but don't have latlng

            var map = this._map,
                point = map.latLngToContainerPoint(e.latlng),
                resolution = 4,
                gridX = Math.floor(point.x / resolution),
                gridY = Math.floor(point.y / resolution);

            var data = this._cache["test"];
            if (!data) {
                return {
                    latlng: e.latlng,
                    data: null,
                    _tile: null,
                    _tileCharCode: null
                };
            }

            var charCode;
            try {
                charCode = data.grid[gridY].charCodeAt(gridX);
            } catch (e) {
            }
            var idx = this._utfDecode(charCode),
                key = data.keys[idx],
                result = data.data[key];

            if (!data.data.hasOwnProperty(key)) {
                result = null;
            }

            return {
                latlng: e.latlng,
                data: result,
                id: (result) ? result.id : null,
                _tile: "test",
                _tileCharCode: "test" + ':' + charCode
            };
        },
        _dataForCharCode: function (tileKey, charCode) {
            var data = this._cache["test"];
            var idx = this._utfDecode(charCode),
                key = data.keys[idx],
                result = data.data[key];

            if (!data.data.hasOwnProperty(key)) {
                result = null;
            }
            return result;
        },

        _utfDecode: function (c) {
            if (c >= 93) {
                c--;
            }
            if (c >= 35) {
                c--;
            }
            return c - 32;
        },

        _utfEncode: function (c) {
            //reverse of above, returns charCode for c
            //derived from: https://github.com/mapbox/glower/blob/mb-pages/src/glower.js#L37
            var charCode = c + 32;
            if (charCode >= 34) {
                charCode++;
            }
            if (charCode >= 92) {
                charCode++;
            }
            return charCode;
        }
    });
    /*
     * L.NonTiledLayer.WMS is used for putting WMS non tiled layers on the map.
     */
    NonTiledUTFGrid.WMS = NonTiledUTFGrid.extend({
        defaultWmsParams: {
            service: 'WMS',
            request: 'GetMap',
            version: '1.1.1',
            layers: '',
            styles: '',
            format: 'image/jpeg',
            transparent: false,
        },
        options: {
            crs: null,
            uppercase: false,
        },
        initialize: function initialize(url, options) {
            let i;
            this._wmsUrl = url;
            const wmsParams = leaflet.extend({}, this.defaultWmsParams);
            // all keys that are not NonTiledLayer options go to WMS params
            for (i in options) {
                if (!Object.prototype.hasOwnProperty.call(NonTiledUTFGrid.prototype.options, i)
                    && !(leaflet.Layer && Object.prototype.hasOwnProperty.call(leaflet.Layer.prototype.options, i))) {
                    wmsParams[i] = options[i];
                }
            }
            this.wmsParams = wmsParams;
            leaflet.setOptions(this, options);
        },
        onAdd: function onAdd(map) {
            this._crs = this.options.crs || map.options.crs;
            this._wmsVersion = parseFloat(this.wmsParams.version);
            const projectionKey = this._wmsVersion >= 1.3 ? 'crs' : 'srs';
            this.wmsParams[projectionKey] = this._crs.code;
            NonTiledUTFGrid.prototype.onAdd.call(this, map);
        },
        getImageUrl: function getImageUrl(bounds, width, height) {
            const {wmsParams} = this;
            wmsParams.width = width;
            wmsParams.height = height;
            const nw = this._crs.project(bounds.getNorthWest());
            const se = this._crs.project(bounds.getSouthEast());
            const url = this._wmsUrl;
            const bbox = (this._wmsVersion >= 1.3 && this._crs === leaflet.CRS.EPSG4326
                ? [se.y, nw.x, nw.y, se.x]
                : [nw.x, se.y, se.x, nw.y]).join(',');
            return url + leaflet.Util.getParamString(this.wmsParams, url, this.options.uppercase) + (this.options.uppercase ? '&BBOX=' : '&bbox=') + bbox;
        },
        setParams: function setParams(params, noRedraw) {

            leaflet.extend(this.wmsParams, params);
            if (!noRedraw) {
                this.redraw();
            }
            return this;
        },
    });

    return NonTiledUTFGrid;

}));
