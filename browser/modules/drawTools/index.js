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
    return L.GeometryUtil.readableDistance(e.getRadius(), true);
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

/**
 * Get readable area of layer
 * @param e
 * @returns {string}
 * @private
 */
const getAreaOfCircle = e => {
    return L.GeometryUtil.readableArea(Math.pow(e.getRadius(), 2) * Math.PI, true);
};

module.exports = { getDistance, getArea, getAreaOfCircle };