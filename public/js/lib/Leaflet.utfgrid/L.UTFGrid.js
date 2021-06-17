//heavily modified from: https://raw.githubusercontent.com/danzel/Leaflet.utfgrid/leaflet-master/src/leaflet.utfgrid.js
//depends on corslite

L.UTFGrid = L.TileLayer.extend({
    options: {
        resolution: 4,
        pointerCursor: true,
        mouseInterval: 66,  // Delay for mousemove events,
        loading: null
    },

    _mouseOn: null,
    _mouseOnTile: null,
    _tileCharCode: null, // '<tileKey>:<charCode>' or null
    _cache: null, // {<tileKey>: <utfgrid>}
    _idIndex: null, // {<featureID>: {<tileKey1>: true, ...<tileKeyN>: true} }
    _throttleMove: null, // holds throttled mousemove handler
    //_throttleConnectEventHandlers: null, // holds throttled connection setup function
    _xhr: {},

    _updateCursor: function () {
    }, //no-op, overridden below

    onAdd: function (map) {
        this._cache = {};
        this._idIndex = {};

        L.TileLayer.prototype.onAdd.call(this, map);

        this._throttleMove = L.Util.throttle(this._move, this.options.mouseInterval, this);

        if (this.options.pointerCursor) {
            this._updateCursor = function (cursor) {
                this._container.style.cursor = cursor;
            }
        }

        map.on('boxzoomstart', this._disconnectMapEventHandlers, this);
        // have to throttle or we get an immediate click event on boxzoomend
        map.on('boxzoomend', this._throttleConnectEventHandlers, this);
        this._connectMapEventHandlers();
    },

    onRemove: function () {
        var map = this._map;
        map.off('boxzoomstart', this._disconnectMapEventHandlers, this);
        map.off('boxzoomend', this._throttleConnectEventHandlers, this);
        this._disconnectMapEventHandlers();
        this._updateCursor('');
        L.TileLayer.prototype.onRemove.call(this, map);
    },

    createTile: function (coords) {
        this._loadTile(coords);
        return document.createElement('div');  // empty DOM node, required because this overrides L.TileLayer
    },

    setUrl: function (url, noRedraw) {
        this._cache = {};
        return L.TileLayer.prototype.setUrl.call(this, url, noRedraw);
    },

    _connectMapEventHandlers: function () {
        this._map.on('click', this._onClick, this);
        this._map.on('mousemove', this._throttleMove, this);
    },

    _disconnectMapEventHandlers: function () {
        this._map.off('click', this._onClick, this);
        this._map.off('mousemove', this._throttleMove, this);
    },

    _throttleConnectEventHandlers: function () {
        setTimeout(this._connectMapEventHandlers.bind(this), 100);
    },

    _update: function (center, zoom) {
        L.TileLayer.prototype._update.call(this, center, zoom);
    },
    _abortLoading: function () {
        console.log(this._tiles)
        console.log(this._xhr)
        var i, tile, xhr;
        for (i in this._tiles) {
            if (this._tiles[i].coords.z !== this._tileZoom) {
                tile = this._tiles[i].el;
                xhr = this._xhr[i];

                tile.onload = L.Util.falseFn;
                tile.onerror = L.Util.falseFn;

                if (typeof xhr !== "undefined") {
                    xhr.abort();
                    L.DomUtil.remove(tile);
                    delete this._tiles[i];
                    delete this._xhr[i];
                }
            }
        }
    },
    _loadTile: function (coords) {
        var me = this;
        var url = this.getTileUrl(coords);
        var key = this._tileCoordsToKey(coords);
        var self = this;
        if (this._cache[key]) {
            return
        }
        setTimeout(function () {
            (function poll() {
                if (me.options.loading.length === 0) {
                    let xhr = $.ajax({
                        url: url,
                        success: function (data) {
                            self._cache[key] = data;
                            L.Util.bind(self._handleTileLoad, self)(key, data);
                        },
                    });
                    me._xhr[key] = xhr;
                } else {
                    setTimeout(function () {
                        poll()
                    }, 100)
                }
            }());
        }, 500)
    },

    _handleTileLoad: function (key, data) {
        // extension point
        console.log("TEST")
    },

    _onClick: function (e) {
        this.fire('click', this._objectForEvent(e));
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
            point = map.project(e.latlng),
            tileSize = this.options.tileSize,
            resolution = this.options.resolution,
            x = Math.floor(point.x / tileSize),
            y = Math.floor(point.y / tileSize),
            gridX = Math.floor((point.x - (x * tileSize)) / resolution),
            gridY = Math.floor((point.y - (y * tileSize)) / resolution),
            max = map.options.crs.scale(map.getZoom()) / tileSize;

        x = (x + max) % max;
        y = (y + max) % max;

        var tileKey = this._tileCoordsToKey({z: map.getZoom(), x: x, y: y});

        var data = this._cache[tileKey];
        if (!data) {
            return {
                latlng: e.latlng,
                data: null,
                _tile: null,
                _tileCharCode: null
            };
        }

        var charCode = data.grid[gridY].charCodeAt(gridX);
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
            _tile: tileKey,
            _tileCharCode: tileKey + ':' + charCode
        };
    },

    _dataForCharCode: function (tileKey, charCode) {
        var data = this._cache[tileKey];
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

L.utfGrid = function (url, options) {
    return new L.UTFGrid(url, options);
};
