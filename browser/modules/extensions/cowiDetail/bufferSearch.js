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

var reset = function (s) {
    s.abort();
    s.reset();
    cloud.removeGeoJsonStore(s);

    $("#info-tab").empty();
    $("#info-pane").empty();
};

var createBufferBtn = function () {
    // Create buttons
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
            cloud.get().map.removeLayer(circle1);
            cloud.get().map.removeLayer(circle2);
            ImmediateSubAction.prototype.addHooks.call(this);
        }
    });
    var MyCustomAction = L._ToolbarAction.extend({
        options: {
            toolbarIcon: {
                className: 'fa fa-circle-thin deactiveBtn',
                color: "#000"
            },
            /* Use L.Toolbar for sub-toolbars. A sub-toolbar is,
             * by definition, contained inside another toolbar, so it
             * doesn't need the additional styling and behavior of a
             * L.Toolbar.Control or L.Toolbar.Popup.
             */
            subToolbar: new L._Toolbar({
                actions: [Cancel, circle2Btn, circle1Btn]
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
        backboneEvents = o.backboneEvents;
        L.DrawToolbar.include({
            getModeHandlers: function (map) {
                return [
                    {
                        enabled: true,
                        handler: new L.Draw.Marker(map, {icon: new L.Icon.Default()}),
                        title: 'Sæt en markør'
                    },
                    {
                        enabled: true,
                        handler: new L.Draw.Polygon(map, {
                            shapeOptions: {
                                color: '#662d91',
                                fillOpacity: 0
                            },
                            allowIntersection: false,
                            drawError: {
                                color: '#b00b00',
                                timeout: 1000
                            }
                        }),
                        title: 'Tegn en polygon'
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
            }, "http://ec2-54-171-155-220.eu-west-1.compute.amazonaws.com");
            setBaseLayer.init("dk");

        });

        // Restate search point from URL
        // =============================
        if (typeof urlVars.lat !== "undefined") {
            var latLng = L.latLng(urlVars.lat, urlVars.lng);
            var awm = L.marker(latLng, {icon: L.AwesomeMarkers.icon({icon: 'fa-shopping-cart', markerColor: 'blue', prefix: 'fa'})});//.bindPopup('<table id="detail-data-r" class="table"><tr><td>Adresse</td><td class="r-adr-val">-</td> </tr> <tr> <td>Koordinat</td> <td id="r-coord-val">-</td> </tr> <tr> <td>Indenfor 500 m</td> <td class="r500-val">-</td> </tr> <tr> <td>Indenfor 1000 m</td> <td class="r1000-val">-</td> </tr> </table>', {closeOnClick: false, closeButton: false, className: "point-popup"});
            drawnItemsMarker.addLayer(awm);
            buffer();
            setTimeout(function () {
                $(".fa-circle-thin").removeClass("deactiveBtn");
                cloud.get().map.panTo(latLng);
            }, 300);
        }
        return this;
    },
    init: function () {
        createBufferBtn().addTo(cloud.get().map);

        // Bind events
        cloud.get().map.on('draw:created', function (e) {
            e.layer._vidi_type = "draw";
            if (e.layerType === "marker") {
                var awm = L.marker(e.layer._latlng, {icon: L.AwesomeMarkers.icon({icon: 'fa-shopping-cart', markerColor: 'blue', prefix: 'fa'})});//.bindPopup('<table id="detail-data-r" class="table"><tr><td>Adresse</td><td class="r-adr-val">-</td> </tr> <tr> <td>Koordinat</td> <td id="r-coord-val">-</td> </tr> <tr> <td>Indenfor 500 m</td> <td class="r500-val">-</td> </tr> <tr> <td>Indenfor 1000 m</td> <td class="r1000-val">-</td> </tr> </table>', {closeOnClick: false, closeButton: false, className: "point-popup"});
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
                    cloud.get().map.removeLayer(circle1);
                    cloud.get().map.removeLayer(circle2);
                } catch (e) {
                    console.log(e.message)
                }
            } else {
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

    store = createStore();
    store.sql = JSON.stringify([reader.read(c1).toText(), reader.read(c2).toText()]);
    //cloud.addGeoJsonStore(store);
    store.load();
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

    store = createStore();
    store.sql = JSON.stringify([geom.geometry.toText()]);
    //cloud.addGeoJsonStore(store);
    store.load();

    // Create a clean up click event
    /*cloud.on("click", function (e) {
     try {
     drawnItemsPolygon.clearLayers();
     } catch (e) {
     }
     });*/

};
var upDatePrintComment = function () {
    $('#main-tabs a[href="#info-content"]').tab('show');
    $("#print-comment").html(($("#detail-data-r-container").html().replace(/> *</g, '><') + $("#detail-data-p-container").html().replace(/> *</g, '><')).replace(/\n|\t/g, ' ').replace(/> *</g, '><').trim());
};

var createLink = function(){
    var layer, link;
    for (var prop in drawnItemsMarker._layers) {
        layer = drawnItemsMarker._layers[prop];
        break;
    }
    link = "/app/test/detail?lat=" + layer._latlng.lat + "&lng=" + layer._latlng.lng + anchor.getAnchor();
    window.location.href = link;
};

var createMailLink = function(){
    var layer, link;
    for (var prop in drawnItemsMarker._layers) {
        layer = drawnItemsMarker._layers[prop];
        break;
    }
    link = "mailto:?subject=Link til " + $(".r-adr-val").html() + "&body=" + hostname + encodeURIComponent("/app/test/detail?lat=" + layer._latlng.lat + "&lng=" + layer._latlng.lng + anchor.getAnchor());
    console.log(link);
    window.location.href = link;
};

var createStore = function () {
    var hit = false, isEmpty = true;
    return new geocloud.sqlStore({
        jsonp: false,
        method: "POST",
        host: "",
        db: db,
        uri: "/api/extension/cowiDetail",
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
                    $("#r-coord-val").html("L: " + ( Math.round(layer._latlng.lng * 10000) / 10000) + "<br>B: " + ( Math.round(layer._latlng.lat * 10000) / 10000));


                    if (feature.properties.radius === "500") {
                        $(".r500-val").html(feature.properties.antal);
                        $(".r500-val-fb_dagligv").html(parseInt(feature.properties.fb_dagligv).toLocaleString("da-DK") + " kr/år");
                        $(".r500-val-fb_beklaed").html(parseInt(feature.properties.fb_beklaed).toLocaleString("da-DK") + " kr/år");
                        $(".r500-val-fb_oevrige").html(parseInt(feature.properties.fb_oevrige).toLocaleString("da-DK") + " kr/år");
                        $(".r500-val-fb_total").html(parseInt(feature.properties.fb_total).toLocaleString("da-DK") + " kr/år");
                    } else {
                        $(".r1000-val").html(feature.properties.antal);
                        $(".r1000-val-fb_dagligv").html(parseInt(feature.properties.fb_dagligv).toLocaleString("da-DK") + " kr/år");
                        $(".r1000-val-fb_beklaed").html(parseInt(feature.properties.fb_beklaed).toLocaleString("da-DK") + " kr/år");
                        $(".r1000-val-fb_oevrige").html(parseInt(feature.properties.fb_oevrige).toLocaleString("da-DK") + " kr/år");
                        $(".r1000-val-fb_total").html(parseInt(feature.properties.fb_total).toLocaleString("da-DK") + " kr/år");
                    }
                    $.get("https://maps.googleapis.com/maps/api/geocode/json?latlng=" + layer._latlng.lat + "," + layer._latlng.lng, function (data) {
                        $(".r-adr-val").html(data.results[0].formatted_address);
                        $("#r-url-email").removeClass("disabled");
                        $("#r-url-link").removeClass("disabled");
                        upDatePrintComment();
                    });

                } else {
                    $(".polygon-val").html(feature.properties.antal);
                    $(".polygon-val-fb_dagligv").html(parseInt(feature.properties.fb_dagligv).toLocaleString("da-DK") + " kr/år");
                    $(".polygon-val-fb_beklaed").html(parseInt(feature.properties.fb_beklaed).toLocaleString("da-DK") + " kr/år");
                    $(".polygon-val-fb_oevrige").html(parseInt(feature.properties.fb_oevrige).toLocaleString("da-DK") + " kr/år");
                    $(".polygon-val-fb_total").html(parseInt(feature.properties.fb_total).toLocaleString("da-DK") + " kr/år");
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
