var urlparser = require('./urlparser');
var hash = urlparser.hash;
var urlVars = urlparser.urlVars;
var cloud;
var meta;
var setting;
var setBaseLayer;
var switchLayer;
var legend;
var draw;
module.exports = {
    set: function (o) {
        cloud = o.cloud;
        meta = o.meta;
        setting = o.setting;
        setBaseLayer = o.setBaseLayer;
        switchLayer = o.switchLayer;
        legend = o.legend;
        draw = o.draw;
        return this;
    },
    init: function () {
        (function pollForLayers() {
            if (meta.ready() && setting.ready()) {
                var p, arr, i, hashArr;
                hashArr = hash.replace("#", "").split("/");
                if (hashArr[0]) {
                    $(".base-map-button").removeClass("active");
                    $("#" + hashArr[0]).addClass("active");
                    if (hashArr[1] && hashArr[2] && hashArr[3]) {
                        setBaseLayer.init(hashArr[0]);
                        if (hashArr[4]) {
                            arr = hashArr[4].split(",");
                            for (i = 0; i < arr.length; i++) {
                                switchLayer.init(arr[i], true, true);
                            }
                        }
                        p = geocloud.transformPoint(hashArr[2], hashArr[3], "EPSG:4326", "EPSG:900913");
                        cloud.zoomToPoint(p.x, p.y, hashArr[1]);
                    }
                    legend.init();
                } else {
                    setBaseLayer.init(window.setBaseLayers[0].id);
                    if (extent !== null) {
                        /*if (BACKEND === "cartodb") {
                         cloud.map.fitBounds(extent);
                         } else {
                         cloud.zoomToExtent(extent);
                         }*/
                        cloud.zoomToExtent(extent);
                    } else {
                        cloud.zoomToExtent();
                    }
                }
                var parr, v, l, t;
                if (typeof urlVars.draw !== "undefined") {
                    parr = urlVars.draw.split("#");
                    if (parr.length > 1) {
                        parr.pop();
                    }
                    v = JSON.parse(decodeURIComponent(parr.join("&")));
                    draw.control();
                    l = draw.getLayer();
                    t = draw.getTable();
                    var g = L.geoJson(v[0].geojson, {
                        style: function (f) {
                            return f.style;
                        }
                    });
                    $.each(g._layers, function(i, v){
                        l.addLayer(v);
                    });
                    t.loadDataInTable();
                    draw.control();
                }

                if (typeof urlVars.queryDraw !== "undefined") {
                    parr = urlVars.queryDraw.split("#");
                    if (parr.length > 1) {
                        parr.pop();
                    }
                    v = JSON.parse(decodeURIComponent(parr.join("&")));
                    L.geoJson(v[0].geojson, {
                        style: function (f) {
                            return f.style;
                        }
                    }).addTo(cloud.map);
                }


            } else {
                setTimeout(pollForLayers, 10);
            }
        }());
    }
};