/**
 * @fileoverview Description of file, its uses and information
 * about its dependencies.
 */

'use strict';

var urlparser = require('./urlparser');
var cloud;
var advancedInfo;
var clicktimer;
var meta;
var draw;
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
        draw = o.draw;
        sqlQuery = o.sqlQuery;
        advancedInfo = o.advancedInfo;
        return this;
    },
    init: function () {
        cloud.on("dblclick", function () {
            clicktimer = undefined;
        });
        cloud.on("click", function (e) {
            // Do not get info if drawing
           if (draw.getDrawOn() || advancedInfo.getSearchOn() || active === false) {
                return;
            }
            var event = new geocloud.clickEvent(e, cloud);

            if (clicktimer) {
                clearTimeout(clicktimer);
            }
            else {
                clicktimer = setTimeout(function (e) {
                    clicktimer = undefined;
                    var coords = event.getCoordinate(), wkt;
                    wkt = "POINT(" + coords.x + " " + coords.y + ")";
                    sqlQuery.init(qstore, wkt, "3857");
                }, 250);
            }
        });
    },
    /**
     *
     */
    reset: function(){
        sqlQuery.reset(qstore);
    },

    /**
     *
     * @param a {boolean}
     */
    active: function(a){
        active = a;
    }
};


