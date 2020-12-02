/*
 * @author     Martin Høgh <mh@mapcentia.com>
 * @copyright  2013-2018 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

'use strict';

let Backbone = require('backbone');
let extend = require('lodash/extend');

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
        extend(object, Backbone.Events);

    },
    get: function () {
        return object;
    }
};
