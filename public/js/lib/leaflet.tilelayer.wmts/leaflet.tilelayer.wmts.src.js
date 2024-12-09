(function () {
    'use strict';
    
  L.TileLayer.WMTS = L.TileLayer.extend({
    defaultWmtsParams: {
      service: "WMTS",
      request: "GetTile",
      version: "1.0.0",
      layer: "",
      style: "default",
      tileMatrixSet: "",
      format: "image/jpeg",
    },
    initialize: function (url, options) {
      this._url = url;
  
      const wmtsParams = L.extend({}, this.defaultWmtsParams);
  
      // all keys that are not TileLayer options go to WMS params
      for (const i in options) {
        if (!(i in this.options)) {
          wmtsParams[i] = options[i];
        }
      }
  
      options = L.setOptions(this, options);
  
      const realRetina = options.detectRetina && retina ? 2 : 1;
      const tileSize = this.getTileSize();
      wmtsParams.width = tileSize.x * realRetina;
      wmtsParams.height = tileSize.y * realRetina;
  
      this.wmtsParams = wmtsParams;
    },
    getTileUrl: function (coords) {
      this.wmtsParams.tileMatrix = this._tileZoom.toString();
  
      const url = L.Util.template(this._url, { s: this._getSubdomain(coords) });
  
      const params = { ...this.wmtsParams, tileRow: coords.y, tileCol: coords.x };
  
      return  url + L.Util.getParamString(params);
    },
    setParams: function (params, noRedraw) {
      L.extend(this.wmtsParams, params);
      if (!noRedraw) {
        this.redraw();
      }
      return this;
    },
  });
  
  L.tileLayer.wmts = function (url, options) {
    return new L.TileLayer.WMTS(url, options);
  };
  
  }());