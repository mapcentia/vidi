/**
 * @fileoverview Description of file, its uses and information
 * about its dependencies.
 */

'use strict';

/**
 *
 */
var backbone = require('backbone');

/**
 *
 */
var _ = require('underscore');

/**
 *
 * @type {{}}
 */
var object = {};

module.exports = {
    set: function (o) {
        return this;
    },
    init: function () {
        _.extend(object, Backbone.Events);

    },
    get: function () {
        return object;
    }
};