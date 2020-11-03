/**
 * @fileoverview Description of file, its uses and information
 * about its dependencies.
 */

'use strict';

var urlparser = require('./../../../browser/modules/urlparser');
/**
 * @type {string}
 */
var schema = urlparser.schema;


var cloud;
var clicktimer;
var meta;
var draw;
var sqlQuery;
var qstore = [];
var active = false;
var mapGoMenu;

/**
 *
 * @type {string}
 */
var BACKEND = require('../../../config/config.js').backend;

/**
*
* @type {string}
*/
var GC2_HOST = require('../../../config/config.js').gc2.host;
GC2_HOST = (GC2_HOST.split("http://").length > 1 ? GC2_HOST.split("http://")[1] : GC2_HOST);

/**
 * @type {string}
 */
var db = urlparser.db;


/**
 *
 */
var dataStore;

/**
 *
 * @type {string}
 */
var fromObjectText = "Objekt fra ";

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
        mapGoMenu = o.extensions.MapGOMenu.index;
        return this;
    },
    init: function () {
        cloud.on("dblclick", function () {
            clicktimer = undefined;
        });
        cloud.on("click", function (e) {
            console.log("infoclick, active: " + active);
            if (active === false) {
                return;
            }
            var event = new geocloud.clickEvent(e, cloud);
            if (clicktimer) {
                clearTimeout(clicktimer);
            }
            else {
                console.log("inside clicktimer");
                
                clicktimer = setTimeout(function (e) {
                    clicktimer = undefined;
                    var coords = event.getCoordinate(), wkt;
                    wkt = "POINT(" + coords.x + " " + coords.y + ")";
                    $("#mapgo-amount-pane").empty();

                    // find area, highlight it in the map, and adjust controls
                    _areaLookup(wkt);
            
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
    },
};
    /**
*
* @private
*/
var _areaLookup = function (wkt) {
    try {
        dataStore.abort();
    } catch (e) {
    }
    var onLoad = function () {
        
        $("#go_menu_section_item").val("");
        mapGoMenu.clearSelection();

        for (var key in this.geoJSON.features) {
            if (this.geoJSON.features[key].properties.gc2_version_gid) {
                //todo: find more generic way to specify attribute
                var index = this.geoJSON.features[key].properties.gc2_version_gid;
                console.log("data: " + index);
                $("#go_menu_section_item").val(index);
                $("#go_menu_section_item").selectpicker('refresh');
                if (this.layer._leaflet_id) {            
                    mapGoMenu.addSelection(this.layer, this.geoJSON.features[key].properties.gc2_version_gid);
                    cloud.zoomToExtentOfgeoJsonStore(this);            
                }
            }
        }        
    };
    console.log("SELECT * FROM " + schema + ".t_6803_parl_omr_t where ST_intersects(ST_transform(geometri,25832),ST_Buffer(ST_transform(ST_geomfromtext('" + wkt + "',3857),25832),1))");
    switch (BACKEND) {
        case "gc2":
            dataStore = new geocloud.sqlStore({
                jsonp: false,
                method: "POST",
                //host: GC2_HOST,
                host:"",
                db: db,
                uri: "/api/sql/nocache",
                id: "1",
                base64: true,
                sql: "SELECT * FROM " + schema + ".t_6803_parl_omr_t where ST_intersects(ST_transform(geometri,25832),ST_Buffer(ST_transform(ST_geomfromtext('" + wkt + "',3857),25832),1))",
                //key: "6c905bc10aa9bf0bda584c399c9c1728",
                onLoad: onLoad
            });
            break;        
    }
    dataStore.load();
};
