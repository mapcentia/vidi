/**
 * @fileoverview Description of file, its uses and information
 * about its dependencies.
 */

'use strict';



/**
 *
 * @returns {*}
 */
module.exports = {

    /**
     *
     * @param o
     * @returns {exports}
     */
    set: function (o) {
        return this;
    },

    /**
     *
     */
    init: function () {
        var curUrl = window.location.href,
            newUrl = curUrl.split("#")[0];

        if (window.confirm(__("Do you really want to reset the map?"))) {
            location.href = newUrl;
        }

    }
};