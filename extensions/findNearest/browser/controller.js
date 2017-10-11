/**
 * @fileoverview Description of file, its uses and information
 * about its dependencies.
 */

'use strict';

/**
 *
 */
var findNearest;

/**
 *
 */
var backboneEvents;

/**
 *
 * @returns {*}
 */
module.exports = {
    set: function (o) {
        backboneEvents = o.backboneEvents;
        findNearest = o.extensions.findNearest.index;
        return this;
    },
    init: function () {

        // Click event for conflict search on/off toggle button
        // ====================================================

        $("#findnearest-btn").on("click", function () {
            findNearest.control();
        });

        // Listen to on event
        // ==================

        backboneEvents.get().on("on:findNearest", function () {
            findNearest.addPointLayer();
            $("#findnearest-places").show();
            $("#findnearest-result-panel").show();

            // Turn info click off
            backboneEvents.get().trigger("off:infoClick");
            console.info("Starting findNearest");
        });

        // Listen to off event
        // ==================

        backboneEvents.get().on("off:findNearest", function () {
            findNearest.off();
            findNearest.removePointLayer();
            $("#findnearest-places").hide();
            $("#findnearest-result-panel").hide();
            backboneEvents.get().trigger("clear:search");

            // Turn info click on again
            backboneEvents.get().trigger("on:infoClick");
            console.info("Stopping findNearest");
        });

        // Listen to process events
        // ========================

        backboneEvents.get().on("start:findNearestProcess", function () {
            $("#findnearest-places i").show();
            console.info("Starting findNearestProcess");
        });

        backboneEvents.get().on("stop:findNearestProcess", function () {
            $("#findnearest-places i").hide();
            console.info("Stopping findNearestProcess");
        });
    }
};