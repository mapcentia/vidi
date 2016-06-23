var draw;
var advancedInfo;
var cloud;
module.exports = module.exports = {
    set: function (o) {
        draw = o.draw;
        advancedInfo = o.advancedInfo;
        cloud = o.cloud;
        return this;
    },
    init: function (str) {
        $("#draw-btn").on("click", function () {
            // Stop advancedInfo
            if (advancedInfo.getSearchOn()) {
                advancedInfo.control(); // Will toggle the control off
                $("#advanced-info-btn").prop("checked", false);
                $("#buffer").hide();
            }
            draw.control();
        });
        $("#print-btn").on("click", function () {
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

            var recEdit = rectangle(cloud.map.getCenter(), cloud.map, "yellow");
            cloud.map.addLayer(recEdit);
            recEdit.editing.enable();


            var recScale = rectangle(recEdit.getBounds().getCenter(), recEdit, "red", true);
            cloud.map.addLayer(recScale);


            recEdit.on('edit', function () {
                cloud.map.removeLayer(recScale);
                recScale = rectangle(recEdit.getBounds().getCenter(), recEdit, "red", true);
                cloud.map.addLayer(recScale);
            });
        });

        $("#advanced-info-btn").on("click", function () {
            // Stop drawing
            if (draw.getDrawOn()) {
                draw.control(); // Will toggle the control off
                $("#draw-btn").prop("checked", false);
            }
            advancedInfo.control();
        });
    }
};