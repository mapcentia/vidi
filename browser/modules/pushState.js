/**
 * @fileoverview Description of file, its uses and information
 * about its dependencies.
 */

'use strict';

/**
 * @type {*|exports|module.exports}
 */
var anchor;

/**
 *
 * @type {boolean}
 */
var first = true;

/**
 * @type {int}
 */
var t;

/**
 *
 * @type {{set: module.exports.set, init: module.exports.init}}
 */
module.exports = module.exports = {
    set: function (o) {
        anchor = o.anchor;
        return this;
    },
    init: function () {
        // We don't set any state until 1 secs after the first request. This way CartoDB layers become ready.
        t = first ? 1000 : 0;
        setTimeout(function () {
            //console.log("State push");
            history.pushState(null, null, anchor.init());
            first = false;
        }, t);
    }
};