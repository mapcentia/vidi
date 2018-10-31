/*
 * @author     Martin Høgh <mh@mapcentia.com>
 * @copyright  2013-2018 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

'use strict';

var urlparser = require('./urlparser');
var cloud;
var clicktimer;
var meta;
var sqlQuery;
var qstore = [];
var active = true;

/**
 *
 * @type {{set: module.exports.set, init: module.exports.init, reset: module.exports.reset, active: module.exports.active}}
 */
module.exports = {
    set: function (o) {
        cloud = o.cloud;
        meta = o.meta;
        sqlQuery = o.sqlQuery;
        return this;
    },
    init: function () {
        cloud.get().on("dblclick", function () {
            clicktimer = undefined;
        });
        cloud.get().on("click", function (e) {
            if (active === false || e.originalEvent.clickedOnFeature) {
                return;
            }

            var event = new geocloud.clickEvent(e, cloud.get());
            if (clicktimer) {
                clearTimeout(clicktimer);
            } else {
                clicktimer = setTimeout(function (e) {
                    clicktimer = undefined;
                    var coords = event.getCoordinate(), wkt;
                    wkt = "POINT(" + coords.x + " " + coords.y + ")";
                    sqlQuery.init(qstore, wkt, "3857", null, null, [coords.lat, coords.lng]);
                }, 250);
            }
        });
    },
    /**
     *
     */
    reset: function () {
        sqlQuery.reset(qstore);
    },

    /**
     *
     * @param a {boolean}
     */
    active: function (a) {
        if (!a) {
            this.reset();
        }
        active = a;
    },

    activate: () => {
        active = true;
    },

    deactivate: () => {
        active = false;
    }
};


