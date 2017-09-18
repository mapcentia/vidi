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
        try {
            host = require('../../config/config.js').gc2.exHost;
        } catch (e) {
            console.info(e.message);
            try {
                host = require('../../config/config.js').gc2.host;
            }
            catch (e) {
                console.info(e.message);
            }
        }
        return host;
    }
};