/**
 * Common tools for drawing
 */

/**
 * Get readable distance of layer
 * @param e
 * @returns {string}
 * @private
 */
const getDistance = e => {
    var tempLatLng = null;
    var totalDistance = 0.00000;
    $.each(e._latlngs, function (i, latlng) {
        if (tempLatLng == null) {
            tempLatLng = latlng;
            return;
        }
        totalDistance += tempLatLng.distanceTo(latlng);
        tempLatLng = latlng;
    });
    return L.GeometryUtil.readableDistance(totalDistance, true);
};

/**
 * Get readable area of layer
 * @param e
 * @returns {string}
 * @private
 */
const getArea = e => {
    return L.GeometryUtil.readableArea(L.GeometryUtil.geodesicArea(e.getLatLngs()), true);
};

module.exports = { getDistance, getArea };