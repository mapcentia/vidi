/*
 * @author     Martin Høgh <mh@mapcentia.com>
 * @copyright  2013-2018 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

'use strict';

var urlparser = require('./../../../browser/modules/urlparser');
var cloud;
var clicktimer;
var meta;
var draw;
var sqlQuery;
var qstore = [];
var active = false;
var conflictSearch;
var _layers;
var backboneEvents;

/**
 *
 * @type {string}
 */
var fromObjectText = "Objekt fra lag";

/**
 *
 * @type {{set: module.exports.set, init: module.exports.init, reset: module.exports.reset, active: module.exports.active}}
 */
module.exports = {
    set: function (o) {
        cloud = o.cloud.get();
        meta = o.meta;
        draw = o.draw;
        sqlQuery = o.sqlQuery;
        conflictSearch = o.extensions.conflictSearch.index;
        _layers = o.layers;
        backboneEvents = o.backboneEvents;

        return this;
    },
    init: function () {
        cloud.on("dblclick", function () {
            clicktimer = undefined;
        });
        cloud.on("click", function (e) {
            if (active === false) {
                return;
            }
            var event = new geocloud.clickEvent(e, cloud);
            if (clicktimer) {
                clearTimeout(clicktimer);
            } else {
                clicktimer = setTimeout(function (e) {
                    clicktimer = undefined;
                    var coords = event.getCoordinate(), wkt;
                    wkt = "POINT(" + coords.x + " " + coords.y + ")";
                    sqlQuery.init(qstore, wkt, "3857", null, null, [coords.lat, coords.lng], false, false, false, () => {
                    }, (id, layer) => {
                        conflictSearch.clearDrawing(false);
                        conflictSearch.addDrawing(layer);
                        conflictSearch.makeSearch(fromObjectText, ()=>{}, id);
                    }, "conflict-", true, "Klik på et resultat for at foretage en søgning indenfor afgrænsningen", "query_draw");
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
        active = a;
    }
};
