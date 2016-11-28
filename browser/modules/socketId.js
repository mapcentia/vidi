/**
 * @fileoverview Description of file, its uses and information
 * about its dependencies.
 */

'use strict';

var socketId;

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
        socketId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    },

    /**
     *
     * @returns string
     */
    get: function () {
        return socketId;
    }

};