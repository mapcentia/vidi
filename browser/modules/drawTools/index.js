/*
 * @author     Martin Høgh <mh@mapcentia.com>
 * @copyright  2013-2021 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

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
    let tempLatLng = null;
    let totalDistance = 0.00000;
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
    return L.GeometryUtil.readableArea(L.GeometryUtil.geodesicArea(e.getLatLngs()[0]), true);
};

const getAreaOfCircle = e => {
    return L.GeometryUtil.readableArea(Math.pow(e.getRadius(), 2) * Math.PI, true);
};

module.exports = { getDistance, getArea, getAreaOfCircle };
