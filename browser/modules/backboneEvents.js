/*
 * @author     Martin Høgh <mh@mapcentia.com>
 * @copyright  2013-2018 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
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