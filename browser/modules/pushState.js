/*
 * @author     Martin Høgh <mh@mapcentia.com>
 * @copyright  2013-2018 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

'use strict';

let anchor;
let first = true;
let t;
const urlparser = require('./urlparser');
const urlVars = urlparser.urlVars;

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
            if (!urlVars.dps) {
                history.pushState(null, null, anchor.init());
            }
            first = false;
        }, t);
    }
};
