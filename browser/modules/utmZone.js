/**
 * @fileoverview Description of file, its uses and information
 * about its dependencies.
 */

'use strict';

/**
 *
 * @type {{set: module.exports.set, init: module.exports.init, getZone: module.exports.getZone}}
 */
module.exports = {
    set: function (o) {
        return this;
    },
    init: function () {
    },
    /**
     * Get the UTM zone from lat/lon
     * @param lat
     * @param lng
     * @returns {number}
     */
    getZone: function (lat, lng) {
        // Get the UTM zone
        var zoneNumber = Math.floor((lng + 180) / 6) + 1;

        if (lat >= 56.0 && lat < 64.0 && lng >= 3.0 && lng < 12.0) {
            zoneNumber = 32;
        }
        //Special zones for Svalbard
        if (lat >= 72.0 && lat < 84.0) {
            if (lng >= 0.0 && lng < 9.0) {
                zoneNumber = 31;
            }
            else if (lng >= 9.0 && lng < 21.0) {
                zoneNumber = 33;
            }
            else if (lng >= 21.0 && lng < 33.0) {
                zoneNumber = 35;
            }
            else if (lng >= 33.0 && lng < 42.0) {
                zoneNumber = 37;
            }
        }
        return zoneNumber;
    }
};