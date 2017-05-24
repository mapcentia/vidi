/**
 * @fileoverview Description of file, its uses and information
 * about its dependencies.
 */

'use strict';

/**
 *
 */
var streetView;

/**
 *
 */
var backboneEvents;

/**
 *
 */
var cloud;

/**
 *
 * @type {string}
 */
var exId = "streetview";

/**
 *
 * @type {boolean}
 */
var active = false;

/**
 *
 */
var clicktimer;

/**
 *
 * @returns {*}
 */
module.exports = {
    set: function (o) {
        cloud = o.cloud;
        backboneEvents = o.backboneEvents;
        streetView = o.extensions.streetView.index;
        return this;
    },
    init: function () {

        var mapObj = cloud.get();

        // Click event for conflict search on/off toggle button
        // ====================================================

        $("#" + exId +"-btn").on("click", function () {
            streetView.control();
        });

        // Listen to on event
        // ==================

        backboneEvents.get().on("on:" + exId, function () {

            active = true;

            // Turn info click off
            backboneEvents.get().trigger("off:infoClick");
            console.info("Starting Street View");
        });

        // Listen to off event
        // ==================

        backboneEvents.get().on("off:" + exId, function () {

            active = false;

            streetView.off();

            // Turn info click on again
            backboneEvents.get().trigger("on:infoClick");
            console.info("Stopping Street View");
        });

        // Handle click events on map
        // ==========================

        mapObj.on("dblclick", function () {
            clicktimer = undefined;
        });
        mapObj.on("click", function (e) {
            var event = new geocloud.clickEvent(e, cloud);
            if (clicktimer) {
                clearTimeout(clicktimer);
            }
            else {
                if (active === false) {
                    return;
                }

                clicktimer = setTimeout(function (e) {
                    clicktimer = undefined;
                    streetView.click(event);

                }, 250);
            }
        });

    }
};