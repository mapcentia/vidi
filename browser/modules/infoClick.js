/*
 * @author     Martin Høgh <mh@mapcentia.com>
 * @copyright  2013-2018 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

'use strict';

const MODULE_ID = `infoClick`;

var cloud;
var backboneEvents;
var clicktimer;
var sqlQuery;
var qstore = [];
var active = false;
var _self = false;

/**
 *
 * @type {{set: module.exports.set, init: module.exports.init, reset: module.exports.reset, active: module.exports.active}}
 */
module.exports = {
    set: function (o) {
        cloud = o.cloud;
        sqlQuery = o.sqlQuery;
        backboneEvents = o.backboneEvents;
        _self = this;
        return this;
    },

    init: function () {
        backboneEvents.get().on(`reset:all reset:${MODULE_ID}`, () => { _self.reset(); });
        backboneEvents.get().on(`deactivate:all`, () => {
            _self.off(); 
            _self.reset();
        });
        backboneEvents.get().on(`on:${MODULE_ID}`, () => { _self.active(true); });
        backboneEvents.get().on(`off:${MODULE_ID}`, () => { _self.active(false); });

        cloud.get().on("dblclick", function () {
            clicktimer = undefined;
        });

        cloud.get().on("click", function (e) {
            if (active === false || e.originalEvent.clickedOnFeature) {
                return;
            }

            // Reset all SQL Query layers
            backboneEvents.get().trigger("sqlQuery:clear");

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
        console.log(`### infoClick reset`);
        sqlQuery.reset(qstore);
    },

    /**
     *
     * @param a {boolean}
     */
    active: function (a) {
        console.log(`### infoClick active`, a);
        if (!a) {
            this.reset();
        }

        active = a;
    },

    on: () => {
        console.log(`### infoClick on`);
        active = true;
    },

    off: () => {
        console.log(`### infoClick off`);
        active = false;
    }
};


