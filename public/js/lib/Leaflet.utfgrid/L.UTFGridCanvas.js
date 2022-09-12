L.UTFGridCanvas = L.UTFGrid.extend({
    options: {
        idField: 'ID',  // Expects UTFgrid to have a property 'ID' that indicates the feature ID
        buildIndex: true,  // requires above field to be set properly
        fillColor: 'black',
        shadowBlur: 0,  // Number of pixels for blur effect
        shadowColor: null,  // Color for shadow, if present.  Defaults to fillColor.
        debug: false  // if true, show tile borders and tile keys
    },

    _adjacentTiles: null,

    onAdd: function (map) {
        this._adjacentTiles = [];

        L.UTFGrid.prototype.onAdd.call(this, map);
    },

    createTile: function(coords) {
        this._loadTile(coords);

        var tile = document.createElement('canvas');
        tile.width = tile.height = this.options.tileSize;

        if (this.options.debug) {
            this._drawDefaultTile(tile.getContext('2d'), this._tileCoordsToKey(coords));
        }

        return tile;
    },

    _connectMapEventHandlers: function(){
        L.UTFGrid.prototype._connectMapEventHandlers.call(this);
        this.on('mouseover', this._handleMouseOver, this);
        this.on('mouseout', this._handleMouseOut, this);
    },

    _disconnectMapEventHandlers: function(){
        L.UTFGrid.prototype._disconnectMapEventHandlers.call(this);
        this.off('mouseover', this._handleMouseOver, this);
        this.off('mouseout', this._handleMouseOut, this);
    },

    _handleMouseOver: function (e) {
        if (e._tile == null || e._tileCharCode == null){ return }

        this._clearAdjacentTiles();

        // currently over this tile:
        var curTile = e._tile;
        this._drawTile(curTile, parseInt(e._tileCharCode.split(':')[3]));

        if (e.data && this._idIndex) {
            // draw adjacent tiles
            var id = e.data[this.options.idField];
            var zoomLevel = curTile.split(':')[2];
            if (!(id && this._idIndex[id] && this._idIndex[id][zoomLevel])) { return }

            var idx = this._idIndex[id][zoomLevel];
            for (var tileKey in idx) {
                //TODO: screen out any tiles that are not currently visible?
                if (tileKey !== curTile) {
                    this._drawTile(tileKey, idx[tileKey]);
                    this._adjacentTiles.push(tileKey);
                }
            }
        }
    },

    _handleMouseOut: function (e) {
        this._resetTile(e._tile);
        this._clearAdjacentTiles();
    },

    _clearAdjacentTiles: function() {
        // clear out any adjacent tiles that were drawn
        if (this._adjacentTiles) {
            for (var i = 0; i < this._adjacentTiles.length; i++) {
                this._resetTile(this._adjacentTiles[i]);
            }
            this._adjacentTiles = [];
        }
    },

    _handleTileLoad: function(tileKey, data) {
        // build index: {<id: {zoomLevel: {tileKey: tileCharCode} } }
        if (this.options.buildIndex) {
            var id, props, idx;
            var idField = this.options.idField;
            var zoomLevel = tileKey.split(':')[2];
            for (var i = 0; i < data.keys.length; i++) {
                props = data.data[data.keys[i]];
                if (props) {
                    id = props[idField];
                    if (id) {
                        if (this._idIndex[id] == null) {
                            this._idIndex[id] = {};
                        }
                        idx = this._idIndex[id];
                        if (idx[zoomLevel] == null) {
                            idx[zoomLevel] = {};
                        }
                        idx[zoomLevel][tileKey] = this._utfEncode(i);
                    }
                }
            }
        }
    },

    _drawTile: function(tileKey, charCode) {
        // for a given tile, find all pixels that match character and repaint
        // TODO: request animation frame?

        if (this._tiles[tileKey] == null){ return }

        var canvas = this._tiles[tileKey].el;
        var ctx = canvas.getContext('2d');

        this._resetTile(tileKey);
        var grid = this._cache[tileKey].grid;

        ctx.fillStyle = this.options.fillColor;
        var dim = this.options.tileSize / this.options.resolution;

        // TODO: order of traversal here may be backwards?  Do y then x?  (are data column major or row major?)
        //modified slightly from: https://github.com/mapbox/glower/blob/mb-pages/src/glower.js
        for (var x = 0; x < dim; x++) {
            for (var y = 0; y < dim; y++) {
                if (grid[y].charCodeAt(x) === charCode) {
                    var sweep = 1;
                    while (y < 63 && grid[y + 1].charCodeAt(x) === charCode) {
                        y++;
                        sweep++;
                    }
                    ctx.fillRect(x * 4, (y * 4) - ((sweep - 1) * 4), 4, 4 * sweep);
                }
            }
        }

        if (this.options.shadowBlur) {
            this._addShadow(canvas, ctx);
        }

    },

    _resetTile: function(tileKey) {
        // clear the canvas
        if (this._tiles[tileKey] == null){ return }

        var tile = this._tiles[tileKey].el;
        tile.width = this.options.tileSize;  // hard reset of canvas

        if (this.options.debug) {
            this._drawDefaultTile(tile.getContext('2d'), tileKey);
        }
    },

    _drawDefaultTile: function(ctx, tileKey) {
        // if this.options.debug, add tileKey text and borders
        ctx.fillStyle = 'black';
        ctx.fillText(tileKey, 20, 20);
        ctx.strokeStyle = 'red';
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(255, 0);
        ctx.lineTo(255, 255);
        ctx.lineTo(0, 255);
        ctx.closePath();
        ctx.stroke();
    },

    _addShadow: function(canvas, ctx) {
        ctx.shadowBlur = this.options.shadowBlur;
        ctx.shadowColor = this.options.shadowColor || this.options.fillColor;

        //Blur effect copied from glower - https://github.com/cutting-room-floor/glower/blob/mb-pages/src/glower.js#L108
        ctx.globalAlpha = 0.7;
        ctx.globalCompositeOperation = 'lighter';
        var a = 1;
        ctx.drawImage(canvas, -a, -a);
        ctx.drawImage(canvas, a, a);
        ctx.drawImage(canvas, 0, -a);
        ctx.drawImage(canvas, -a, 0);
        ctx.globalAlpha = 1;
    }
});


L.utfGridCanvas = function (url, options) {
    return new L.UTFGridCanvas(url, options);
};
