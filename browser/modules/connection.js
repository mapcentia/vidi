/**
 * @fileoverview Description of file, its uses and information
 * about its dependencies.
 */

'use strict';

/**
 *
 */


module.exports = {
    getHost: function () {
        var host;

        host = require('../../config/config.js').gc2.host;

        return host;
    }
};