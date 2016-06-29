var cloud;
var printOn = false;
var recEdit;
var recScale;
var test;
var serializeLayers;
var anchor;
var lz = require('lz-string');
var base64 = require('base64-url')
module.exports = {
    set: function (o) {
        cloud = o.cloud;
        serializeLayers = o.serializeLayers;
        anchor = o.anchor;
        return this;
    },
    init: function () {
    },
    print: function () {
        var layerDraw = [], layerQueryDraw = [], layerQueryResult = [], layerQueryBuffer = [], e;
        try {
            recEdit.editing.disable();
        } catch (e) {
        }
        e = serializeLayers.serialize({
            "query_draw": true,
            "query_buffer": true,
            "query_result": true,
            "draw": false // Get draw
        });

        $.each(e, function (i, v) {
            if (v.type === "Vector") {
                layerDraw.push({geojson: v.geoJson})
            }
        });

        e = serializeLayers.serialize({
            "query_draw": false, // Get query draw
            "query_buffer": true,
            "query_result": true,
            "draw": true
        });

        $.each(e, function (i, v) {
            if (v.type === "Vector") {
                layerQueryDraw.push({geojson: v.geoJson})
            }
        });

        e = serializeLayers.serialize({
            "query_draw": true,
            "query_buffer": true,
            "query_result": false, // Get result
            "draw": true
        });

        $.each(e, function (i, v) {
            if (v.type === "Vector") {
                layerQueryResult.push({geojson: v.geoJson})
            }
        });

        var form = document.createElement("form");
        form.setAttribute("method", "get");
        //form.setAttribute("action", "test.jsp");

        // setting form target to a window named 'formresult'
        form.setAttribute("target", "formresult");

        var hiddenField1 = document.createElement("input");
        hiddenField1.setAttribute("name", "draw");
        hiddenField1.setAttribute("value", base64.encode(JSON.stringify(layerDraw)));
        form.appendChild(hiddenField1);

        var hiddenField2 = document.createElement("input");
        hiddenField2.setAttribute("name", "queryDraw");
        hiddenField2.setAttribute("value", JSON.stringify(layerQueryDraw));
        form.appendChild(hiddenField2);

        var hiddenField3 = document.createElement("input");
        hiddenField3.setAttribute("name", "queryResult");
        hiddenField3.setAttribute("value", JSON.stringify(layerQueryResult));
        form.appendChild(hiddenField3);

        document.body.appendChild(form);

        // creating the 'formresult' window with custom features prior to submitting the form
        //window.open('', 'formresult', 'scrollbars=no,menubar=no,height=600,width=800,resizable=yes,toolbar=no,status=no');

        form.submit();

    },
    control: function () {
        if (!printOn) {
            printOn = true;
            test = cloud.map.addControl(L.control.print({
                provider: L.print.provider({
                    capabilities: window.printConfig,
                    method: 'POST',
                    dpi: 72,
                    outputFormat: 'pdf',
                    proxy: 'http://eu1.mapcentia.com/cgi/proxy.cgi?url=',
                    customParams: window.gc2Options.customPrintParams
                }),
                position: 'topright'
            }));

            //cloud.map.editTools.startPolygon()

            var a4 = [297, 210];

            L.CRS.EPSG3857.unproject = function (point) { // (Point) -> LatLng
                var earthRadius = 6378137,
                    normalizedPoint = point.divideBy(earthRadius);
                return this.projection.unproject(normalizedPoint);
            };

            var _getScale = function (scaleObject, x) {
                var bounds = scaleObject.getBounds(),
                    inchesKm = L.print.Provider.INCHES_PER_METER * 1000,
                    scales = [{"name": "1:250", "value": "250.0"}, {"name": "1:500", "value": "500.0"}, {"name": "1:1,000", "value": "1000.0"}, {"name": "1:2,000", "value": "2000.0"}, {"name": "1:3,000", "value": "3000.0"}, {"name": "1:4,000", "value": "4000.0"}, {
                        "name": "1:5,000",
                        "value": "5000.0"
                    }, {"name": "1:7,500", "value": "7500.0"}, {"name": "1:10,000", "value": "10000.0"}, {"name": "1:15,000", "value": "15000.0"}, {"name": "1:25,000", "value": "25000.0"}, {"name": "1:50,000", "value": "50000.0"}, {"name": "1:100,000", "value": "100000.0"}],
                    sw = bounds.getSouthWest(),
                    ne = bounds.getNorthEast(),
                    halfLat = (sw.lat + ne.lat) / 2,
                    midLeft = L.latLng(halfLat, sw.lng),
                    midRight = L.latLng(halfLat, ne.lng),
                    mwidth = midLeft.distanceTo(midRight),
                    pxwidth = cloud.map.getSize().x,
                    kmPx = mwidth / pxwidth / 1000,
                    mscale = (kmPx || 0.000001) * inchesKm * (96 * 2),
                    closest = Number.POSITIVE_INFINITY,
                    i = scales.length,
                    diff,
                    scale, tmp;

                while (i--) {
                    diff = Math.abs(mscale - scales[i].value);
                    if (diff < closest) {
                        closest = diff;
                        scale = parseInt(scales[i].value, 10);
                    }
                }
                console.log(pxwidth);
                console.log(scale);
                console.log(mscale);
                return scale;
            };

            var rectangle = function (center, scaleObject, color, x) {
                var scale = _getScale(scaleObject, x);
                var centerM = L.CRS.EPSG3857.project(center);

                var printSizeM = [(a4[0] * scale / 1000), (a4[1] * scale / 1000)];

                var printSwM = L.point(centerM.x - (printSizeM[0] / 2), centerM.y - (printSizeM[1] / 2));
                var printNeM = L.point(centerM.x + (printSizeM[0] / 2), centerM.y + (printSizeM[1] / 2));

                var rectangle = L.rectangle([L.CRS.EPSG3857.unproject(printSwM), L.CRS.EPSG3857.unproject(printNeM)], {
                    color: color,
                    aspectRatio: (a4[0] / a4[1]) // 1:4
                });
                return rectangle;
            };

            recEdit = rectangle(cloud.map.getCenter(), cloud.map, "yellow");
            cloud.map.addLayer(recEdit);
            recEdit.editing.enable();


            recScale = rectangle(recEdit.getBounds().getCenter(), recEdit, "red", true);
            cloud.map.addLayer(recScale);


            recEdit.on('edit', function () {
                cloud.map.removeLayer(recScale);
                recScale = rectangle(recEdit.getBounds().getCenter(), recEdit, "red", true);
                cloud.map.addLayer(recScale);
            });
        } else {
            //clean up
            cloud.map.removeLayer(recScale);
            cloud.map.removeLayer(recEdit);
            printOn = false;
        }
    }
};