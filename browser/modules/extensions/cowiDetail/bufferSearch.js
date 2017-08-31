var cloud;
var infoClick;
var anchor;
var draw;
var circle1, circle2, marker;
var jsts = require('jsts');
var reproject = require('reproject');
var store;
var db = "test";
var drawnItemsMarker = new L.FeatureGroup();
var drawnItemsPolygon = new L.FeatureGroup();
var drawControl;
var setBaseLayer;
var urlVars = require('./../../urlparser').urlVars;
var hostname = "https://kort.detailhandelsportalen.dk";
var backboneEvents;
var isochrone;
var isoActive = false;
var mapObj;
var clicktimer;
var utils;
var layers;

var reset = function (s) {
    s.abort();
    s.reset();
    cloud.removeGeoJsonStore(s);

    $("#info-tab").empty();
    $("#info-pane").empty();
};

var profiles = {
    car: {
        radius: 70,
        cellSize: 0.8,
        concavity: 2,
        lengthThreshold: 0,
        endpoint: "https://gc2.io/galton/car"
    },
    bicycle: {
        radius: 15,
        cellSize: 0.2,
        concavity: 2,
        lengthThreshold: 0,
        endpoint: "https://gc2.io/galton/bicycle"
    },
    foot: {
        radius: 6,
        cellSize: 0.07,
        concavity: 2,
        lengthThreshold: 0,
        endpoint: "https://gc2.io/galton/foot"
    }
};

var createBufferBtn = function () {
    // Create buttons
    var isochroneSubAction = L._ToolbarAction.extend({
        initialize: function (map, myAction) {
            this.map = cloud.get().map;
            this.myAction = myAction;
            L._ToolbarAction.prototype.initialize.call(this);
        },
        addHooks: function () {
            // this.myAction.disable();
        }
    });
    var showIso = isochroneSubAction.extend({
        options: {
            toolbarIcon: {
                html: 'Vis isokroner'
            }
        },
        addHooks: function () {
            mapObj.addLayer(isochrone.gridSource);
            isochroneSubAction.prototype.addHooks.call(this);
        }
    });
    var Cancel = isochroneSubAction.extend({
        options: {
            toolbarIcon: {
                html: '<i class="fa fa-times"></i>',
                tooltip: 'Cancel'
            }
        },
        addHooks: function () {
            this.myAction.disable();
            mapObj.removeLayer(isochrone.gridSource);
            isochroneSubAction.prototype.addHooks.call(this);
        }
    });
    var isochroneAction = L._ToolbarAction.extend({
        options: {
            toolbarIcon: {
                className: 'fa fa-map-o showIsoBtn deactiveBtn'

            },
            color: "#000",

            /* Use L.Toolbar for sub-toolbars. A sub-toolbar is,
             * by definition, contained inside another toolbar, so it
             * doesn't need the additional styling and behavior of a
             * L.Toolbar.Control or L.Toolbar.Popup.
             */
            subToolbar: new L._Toolbar({
                actions: [
                    Cancel,
                    showIso
                ]
            })
        }
    });

    var ImmediateSubAction = L._ToolbarAction.extend({
        initialize: function (map, myAction) {
            this.map = cloud.get().map;
            this.myAction = myAction;
            L._ToolbarAction.prototype.initialize.call(this);
        },
        addHooks: function () {
            //this.myAction.disable();
        }
    });
    var circle1Btn = ImmediateSubAction.extend({
        options: {
            toolbarIcon: {
                html: 'Vis 500 m'
            }
        },
        addHooks: function () {
            circle1.addTo(cloud.get().map);
            ImmediateSubAction.prototype.addHooks.call(this);
        }
    });
    var circle2Btn = ImmediateSubAction.extend({
        options: {
            toolbarIcon: {
                html: 'Vis 1000 m'
            }
        },
        addHooks: function () {
            circle2.addTo(cloud.get().map);
            ImmediateSubAction.prototype.addHooks.call(this);
        }
    });
    var Cancel = ImmediateSubAction.extend({
        options: {
            toolbarIcon: {
                html: '<i class="fa fa-times"></i>',
                tooltip: 'Cancel'
            }
        },
        addHooks: function () {
            this.myAction.disable();
            mapObj.removeLayer(circle1);
            mapObj.removeLayer(circle2);
            mapObj.removeLayer(isochrone.gridSource);
            ImmediateSubAction.prototype.addHooks.call(this);
        }
    });
    var MyCustomAction = L._ToolbarAction.extend({
        options: {
            toolbarIcon: {
                className: 'fa fa-circle-thin deactiveBtn',
                color: "#000"
            },
            subToolbar: new L._Toolbar({
                actions: [Cancel, circle2Btn, circle1Btn, showIso]
            })
        }
    });

    // Create buttons
    var ImmediateSubAction2 = L._ToolbarAction.extend({
        initialize: function (map, myAction) {
            this.map = cloud.get().map;
            this.myAction = myAction;
            L._ToolbarAction.prototype.initialize.call(this);
        },
        addHooks: function () {
            //this.myAction.disable();
        }
    });
    var osm = ImmediateSubAction2.extend({
        options: {
            toolbarIcon: {
                html: 'Open Street Map'
            }
        },
        addHooks: function () {
            setBaseLayer.init("dk");
            ImmediateSubAction2.prototype.addHooks.call(this);
        }
    });
    var ghybrid = ImmediateSubAction2.extend({
        options: {
            toolbarIcon: {
                html: 'Satellite'
            }
        },
        addHooks: function () {
            setBaseLayer.init("googleHybrid");
            ImmediateSubAction2.prototype.addHooks.call(this);
        }
    });
    var Cancel = ImmediateSubAction2.extend({
        options: {
            toolbarIcon: {
                html: '<i class="fa fa-times"></i>',
                tooltip: 'Cancel'
            }
        },
        addHooks: function () {
            this.myAction.disable();
            ImmediateSubAction2.prototype.addHooks.call(this);
        }
    });
    var MyCustomAction2 = L._ToolbarAction.extend({
        options: {
            toolbarIcon: {
                className: 'fa fa-map-o'

            },
            color: "#000",

            /* Use L.Toolbar for sub-toolbars. A sub-toolbar is,
             * by definition, contained inside another toolbar, so it
             * doesn't need the additional styling and behavior of a
             * L.Toolbar.Control or L.Toolbar.Popup.
             */
            subToolbar: new L._Toolbar({
                actions: [Cancel, osm, ghybrid]
            })
        }
    });


    return new L._Toolbar.Control({
        position: 'topright',
        actions: [MyCustomAction, MyCustomAction2]
    });
};

module.exports = {
    set: function (o) {
        cloud = o.cloud;
        infoClick = o.infoClick;
        draw = o.draw;
        setBaseLayer = o.setBaseLayer;
        anchor = o.anchor;
        utils = o.utils;
        layers = o.layers;
        backboneEvents = o.backboneEvents;
        isochrone = o.extensions.isochrone.index;

        return this;
    },
    init: function () {

        var me = this;

        $('a[href="#isochrone-content"]').hide();

        mapObj = cloud.get().map;

   /*     L.Draw.IsochroneMarker = L.Draw.Marker.extend({
            options: {},
            initialize: function (map, options) {
                this.type = 'isochroneMarker';
                this.featureTypeCode = 'isochroneMarker';
                L.Draw.Feature.prototype.initialize.call(this, map, options);
            }
        });*/

        L.DrawToolbar.include({
            getModeHandlers: function (map) {
                return [
                    {
                        enabled: true,
                        handler: new L.Draw.Marker(map, {icon: new L.Icon.Default()}),
                        title: 'Beregn indenfor 500m og 1000m radius'
                    },
                    /*   {
                     enabled: true,
                     handler: new L.Draw.IsochroneMarker(map, {icon: new L.Icon.Default()}),
                     title: 'Beregn indenfor 15 og 30 minutters køretid'
                     },*/
                    {
                        enabled: true,
                        handler: new L.Draw.Polygon(map, {
                            shapeOptions: {
                                color: '#662d91',
                                fillOpacity: 0
                            },
                            allowIntersection: true,
                            drawError: {
                                color: '#b00b00',
                                timeout: 1000
                            }
                        }),
                        title: 'Beregn indenfor tegnet en polygon'
                    }
                ];
            }
        });
        drawControl = new L.Control.Draw({
            position: 'topright',
            edit: false
        });
        cloud.get().map.addControl(drawControl);
        cloud.get().map.addLayer(drawnItemsMarker);
        cloud.get().map.addLayer(drawnItemsPolygon);

        backboneEvents.get().on("end:state", function () {
            cloud.get().addBaseLayer("dk", "osm", {
                "maxZoom": 18,
                "maxNativeZoom": 18,
                "attribution": "Tiles by <a href='http://cowi.dk' target='_blank'>COWI</a> | Data by <a href='http://www.openstreetmap.org/' target='_blank'>OpenStreetMap</a>"
                //"subdomains": ["a", "b", "c"]
            }, "https://gc2.io");
            setBaseLayer.init("dk");

        });

        // Restate search point from URL
        // =============================
        if (typeof urlVars.lat !== "undefined") {
            var latLng = L.latLng(urlVars.lat, urlVars.lng);
            var awm = L.marker(latLng, {
                icon: L.AwesomeMarkers.icon({
                    icon: 'fa-shopping-cart',
                    markerColor: 'blue',
                    prefix: 'fa'
                })
            });//.bindPopup('<table id="detail-data-r" class="table"><tr><td>Adresse</td><td class="r-adr-val">-</td> </tr> <tr> <td>Koordinat</td> <td id="r-coord-val">-</td> </tr> <tr> <td>Indenfor 500 m</td> <td class="r500-val">-</td> </tr> <tr> <td>Indenfor 1000 m</td> <td class="r1000-val">-</td> </tr> </table>', {closeOnClick: false, closeButton: false, className: "point-popup"});
            drawnItemsMarker.addLayer(awm);
            buffer();
            setTimeout(function () {
                $(".fa-circle-thin").removeClass("deactiveBtn");
                cloud.get().map.panTo(latLng);
            }, 300);
        }

        createBufferBtn().addTo(cloud.get().map);

        // Bind events
        cloud.get().map.on('draw:created', function (e) {
            e.layer._vidi_type = "draw";
            if (e.layerType === "marker") {
                var awm = L.marker(e.layer._latlng, {
                    icon: L.AwesomeMarkers.icon({
                        icon: 'fa-shopping-cart',
                        markerColor: 'blue',
                        prefix: 'fa'
                    })
                });//.bindPopup('<table id="detail-data-r" class="table"><tr><td>Adresse</td><td class="r-adr-val">-</td> </tr> <tr> <td>Koordinat</td> <td id="r-coord-val">-</td> </tr> <tr> <td>Indenfor 500 m</td> <td class="r500-val">-</td> </tr> <tr> <td>Indenfor 1000 m</td> <td class="r1000-val">-</td> </tr> </table>', {closeOnClick: false, closeButton: false, className: "point-popup"});
                awm._vidi_marker = true;
                drawnItemsMarker.addLayer(awm);//.openPopup();
                $(".fa-circle-thin").removeClass("deactiveBtn");

            } else {
                drawnItemsPolygon.addLayer(e.layer);
            }
        });
        cloud.get().map.on('draw:drawstart', function (e) {
            infoClick.active(false); // Switch standard info click off

            if (e.layerType === "marker") {
                drawnItemsMarker.clearLayers();
                $(".fa-circle-thin").addClass("deactiveBtn");

                // Recreate buttons, so subtool bar is closed
                createBufferBtn().addTo(cloud.get().map);

                try {
                    mapObj.removeLayer(circle1);
                    mapObj.removeLayer(circle2);
                    mapObj.removeLayer(isochrone.gridSource);
                    isochrone.clear();
                } catch (e) {
                    console.log(e.message)
                }
            }  else {
                drawnItemsPolygon.clearLayers();
            }
        });
        cloud.get().map.on('draw:drawstop', function (e) {
            if (e.layerType === "marker") {
                buffer();
            } else {
                polygon();
            }
            infoClick.active(true); // Switch standard info click on again
        });
        $("#r-url-link").on("click", createLink);
        $("#r-url-email").on("click", createMailLink);
    }
};

var buffer = function () {
    var layer;
    for (var prop in drawnItemsMarker._layers) {
        layer = drawnItemsMarker._layers[prop];
        break;
    }
    if (typeof layer === "undefined") {
        return;
    }

    var crss = {
        "proj": "+proj=utm +zone=" + "32" + " +ellps=WGS84 +datum=WGS84 +units=m +no_defs",
        "unproj": "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs"
    };
    var reader = new jsts.io.GeoJSONReader();
    var writer = new jsts.io.GeoJSONWriter();
    var geom = reader.read(reproject.reproject(layer.toGeoJSON(), "unproj", "proj", crss));

    var c1 = reproject.reproject(writer.write(geom.geometry.buffer(500)), "proj", "unproj", crss);
    circle1 = L.geoJson(c1, {
        "color": "#ff7800",
        "weight": 1,
        "opacity": 1,
        "fillOpacity": 0.1,
        "dashArray": '5,3'
    });

    var c2 = reproject.reproject(writer.write(geom.geometry.buffer(1000)), "proj", "unproj", crss);
    circle2 = L.geoJson(c2, {
        "color": "#ff7800",
        "weight": 1,
        "opacity": 1,
        "fillOpacity": 0.1,
        "dashArray": '5,3'
    });

    store = createStore("buffer");
    store.sql = JSON.stringify([reader.read(c1).toText(), reader.read(c2).toText()]);
    //cloud.addGeoJsonStore(store);
    store.load();
    iso();
};

var polygon = function () {
    var layer;
    for (var prop in drawnItemsPolygon._layers) {
        layer = drawnItemsPolygon._layers[prop];
        break;
    }
    if (typeof layer === "undefined") {
        return;
    }

    var reader = new jsts.io.GeoJSONReader();
    var geom = reader.read(layer.toGeoJSON());

    store = createStore("polygon");
    store.sql = JSON.stringify([geom.geometry.toText()]);
    //cloud.addGeoJsonStore(store);
    store.load();

};

var iso = function () {
    var layer, p = {};
    for (var prop in drawnItemsMarker._layers) {
        layer = drawnItemsMarker._layers[prop];
        break;
    }
    if (typeof layer === "undefined") {
        return;
    }

    p.x = layer._latlng.lng;
    p.y = layer._latlng.lat;

    var params = {
        lng: p.x,
        lat: p.y,
        radius: profiles.car.radius,
        deintersect: false,
        cellSize: profiles.car.cellSize,
        concavity: profiles.car.concavity,
        lengthThreshold: profiles.car.lengthThreshold,
        units: "kilometers"
    };

    layers.incrementCountLoading("_vidi_isochrone");
    backboneEvents.get().trigger("startLoading:layers");

    //mapObj.addLayer(isochrone.gridSource);
    /*   mapObj.addLayer(isochrone.pointLayer);
     isochrone.pointLayer.addLayer(
     L.circleMarker([p.y, p.x], {
     color: '#ffffff',
     fillColor: '#000000',
     opacity: 1,
     fillOpacity: 1,
     weight: 3,
     radius: 12,
     clickable: false
     })
     );*/

    var url = new URL(profiles.car.endpoint);

    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

    ([15, 30]).forEach(interval => url.searchParams.append('intervals', interval));

    isochrone.request(url.toString()).then(
        function (data) {
            var reader = new jsts.io.GeoJSONReader();
            var geom1 = reader.read(data.features[0]);
            var geom2 = reader.read(data.features[1]);

            store = createStore("isochrone");
            store.sql = JSON.stringify([geom1.geometry.toText(), geom2.geometry.toText()]);

            store.load();
        }
    );

};


var upDatePrintComment = function () {
    $('#main-tabs a[href="#info-content"]').tab('show');
    $("#print-comment").html(($("#detail-data-r-container").html().replace(/> *</g, '><') + $("#detail-data-p-container").html().replace(/> *</g, '><')).replace(/\n|\t/g, ' ').replace(/> *</g, '><').trim());
};

var createLink = function () {
    var layer, link;
    for (var prop in drawnItemsMarker._layers) {
        layer = drawnItemsMarker._layers[prop];
        break;
    }
    link = "/app/test/detail?lat=" + layer._latlng.lat + "&lng=" + layer._latlng.lng + anchor.getAnchor();
    window.location.href = link;
};

var createMailLink = function () {
    var layer, link;
    for (var prop in drawnItemsMarker._layers) {
        layer = drawnItemsMarker._layers[prop];
        break;
    }
    link = "mailto:?subject=Link til " + $(".r-adr-val").html() + "&body=" + hostname + encodeURIComponent("/app/test/detail?lat=" + layer._latlng.lat + "&lng=" + layer._latlng.lng + anchor.getAnchor());
    console.log(link);
    window.location.href = link;
};

var createStore = function (type) {
    var hit = false, isEmpty = true;
    return new geocloud.sqlStore({
        jsonp: false,
        method: "POST",
        host: "",
        db: db,
        uri: "/api/extension/cowiDetail/" + type,
        clickable: true,
        id: 1,
        onLoad: function () {
            var layerObj = this;
            $('#modal-info-body').show();
            $.each(layerObj.geoJSON.features, function (i, feature) {
                if (feature.properties.radius) { // Then Marker
                    var layer;
                    for (var prop in drawnItemsMarker._layers) {
                        layer = drawnItemsMarker._layers[prop];
                        break;
                    }
                    $("#r-coord-val").html("L: " + ( Math.round(layer._latlng.lng * 10000) / 10000) + ", B: " + ( Math.round(layer._latlng.lat * 10000) / 10000));


                    if (feature.properties.radius === "500") {
                        $(".r500-val").html(parseInt(feature.properties.antal).toLocaleString("da-DK"));
                        $(".r500-val-fb_dagligv").html((Math.round(parseInt(feature.properties.fb_dagligv) / 5000) * 5000).toLocaleString("da-DK") + " kr/år");
                        $(".r500-val-fb_beklaed").html((Math.round(parseInt(feature.properties.fb_beklaed) / 5000) * 5000).toLocaleString("da-DK") + " kr/år");
                        $(".r500-val-fb_oevrige").html((Math.round(parseInt(feature.properties.fb_oevrige) / 5000) * 5000).toLocaleString("da-DK") + " kr/år");
                        $(".r500-val-fb_total").html((Math.round(parseInt(feature.properties.fb_total) / 5000) * 5000).toLocaleString("da-DK") + " kr/år");
                    } else {
                        $(".r1000-val").html(parseInt(feature.properties.antal).toLocaleString("da-DK"));
                        $(".r1000-val-fb_dagligv").html((Math.round(parseInt(feature.properties.fb_dagligv) / 5000) * 5000).toLocaleString("da-DK") + " kr/år");
                        $(".r1000-val-fb_beklaed").html((Math.round(parseInt(feature.properties.fb_beklaed) / 5000) * 5000).toLocaleString("da-DK") + " kr/år");
                        $(".r1000-val-fb_oevrige").html((Math.round(parseInt(feature.properties.fb_oevrige) / 5000) * 5000).toLocaleString("da-DK") + " kr/år");
                        $(".r1000-val-fb_total").html((Math.round(parseInt(feature.properties.fb_total) / 5000) * 5000).toLocaleString("da-DK") + " kr/år");
                    }

                    $.get("https://maps.googleapis.com/maps/api/geocode/json?latlng=" + layer._latlng.lat + "," + layer._latlng.lng, function (data) {
                        $(".r-adr-val").html(data.results[0].formatted_address);
                        $("#r-url-email").removeClass("disabled");
                        $("#r-url-link").removeClass("disabled");
                        upDatePrintComment();
                    });

                }

                else if (feature.properties.minutter) {
                    if (feature.properties.minutter === "15") {
                        $(".ik15-val").html(parseInt(feature.properties.antal).toLocaleString("da-DK"));
                        $(".ik15-val-fb_dagligv").html((Math.round(parseInt(feature.properties.fb_dagligv) / 5000) * 5000).toLocaleString("da-DK") + " kr/år");
                        $(".ik15-val-fb_beklaed").html((Math.round(parseInt(feature.properties.fb_beklaed) / 5000) * 5000).toLocaleString("da-DK") + " kr/år");
                        $(".ik15-val-fb_oevrige").html((Math.round(parseInt(feature.properties.fb_oevrige) / 5000) * 5000).toLocaleString("da-DK") + " kr/år");
                        $(".ik15-val-fb_total").html((Math.round(parseInt(feature.properties.fb_total) / 5000) * 5000).toLocaleString("da-DK") + " kr/år");
                    } else {
                        $(".ik30-val").html(parseInt(feature.properties.antal).toLocaleString("da-DK"));
                        $(".ik30-val-fb_dagligv").html((Math.round(parseInt(feature.properties.fb_dagligv) / 5000) * 5000).toLocaleString("da-DK") + " kr/år");
                        $(".ik30-val-fb_beklaed").html((Math.round(parseInt(feature.properties.fb_beklaed) / 5000) * 5000).toLocaleString("da-DK") + " kr/år");
                        $(".ik30-val-fb_oevrige").html((Math.round(parseInt(feature.properties.fb_oevrige) / 5000) * 5000).toLocaleString("da-DK") + " kr/år");
                        $(".ik30-val-fb_total").html((Math.round(parseInt(feature.properties.fb_total) / 5000) * 5000).toLocaleString("da-DK") + " kr/år");
                    }
                }

                else {
                    $(".polygon-val").html(parseInt(feature.properties.antal).toLocaleString("da-DK"));
                    $(".polygon-val-fb_dagligv").html((Math.round(parseInt(feature.properties.fb_dagligv) / 5000) * 5000).toLocaleString("da-DK") + " kr/år");
                    $(".polygon-val-fb_beklaed").html((Math.round(parseInt(feature.properties.fb_beklaed) / 5000) * 5000).toLocaleString("da-DK") + " kr/år");
                    $(".polygon-val-fb_oevrige").html((Math.round(parseInt(feature.properties.fb_oevrige) / 5000) * 5000).toLocaleString("da-DK") + " kr/år");
                    $(".polygon-val-fb_total").html((Math.round(parseInt(feature.properties.fb_total) / 5000) * 5000).toLocaleString("da-DK") + " kr/år");
                }
            });
            upDatePrintComment();
        },
        styleMap: {
            weight: 2,
            color: '#660000',
            dashArray: '',
            fillOpacity: 0.2
        },
        onEachFeature: function (f, l) {
            if (typeof l._layers !== "undefined") {
                l._layers[Object.keys(l._layers)[0]]._vidi_type = "query_result";
            } else {
                l._vidi_type = "query_result";
            }
        }
    });
};
