/**
 * @fileoverview Description of file, its uses and information
 * about its dependencies.
 */

'use strict';

var print; 
var mapGoMenu;
var backboneEvents;
var reportRender;
var infoClick;
var config = require('../../../config/config.js');
var printC = config.print.templates;
var scales = config.print.scales;
var urlparser = require('../../../browser/modules/urlparser');
/**
 *
 * @returns {*}
 */
module.exports = {
    set: function (o) {
        print = o.print;
        reportRender = o.extensions.MapGOMenu.reportRender;
        infoClick = o.extensions.MapGOMenu.infoClick;
        backboneEvents = o.backboneEvents;
        mapGoMenu = o.extensions.MapGOMenu.index;
        return this;
    },
    init: function () {
        var endPrintEventName = "end:mapGoPrint";

        // Turn off if advanced info or drawing is activated
        backboneEvents.get().on("off:MapGoMenu on:advancedInfo on:drawing", function () {
            mapGoMenu.off();
        });

        // Handle GUI when print is done. Using at custom event, so standard print is not triggered
        backboneEvents.get().on(endPrintEventName, function (response) {
            console.log("print end");
            $("#mapGo-get-print-fieldset").prop("disabled", false);
            $("#mapGo-download-pdf, #mapGo-open-pdf").prop("href", "/tmp/print/pdf/" + response.key + ".pdf");
            $("#mapGo-download-pdf").prop("download", response.key);
            $("#mapGo-open-html").prop("href", response.url);
            $("#mapGo-print-btn").button('reset');
            backboneEvents.get().trigger("end:conflictSearchPrint", response);
            console.log("GEMessage:LaunchURL:" + urlparser.uriObj.protocol() + "://" +  urlparser.uriObj.host() + "/tmp/print/pdf/" + response.key + ".pdf");

        });

        // When mapGo search is done, enable the print button
        backboneEvents.get().on("end:mapGoMenuAmountSearch", function () {
            console.log("mapGoMenuAmountSearch");
            $("#mapGo-print-btn").prop("disabled", false);
        });

        // Handle mapGo info click events
        backboneEvents.get().on("on:mapGoInfoClick", function () {
            console.info("Starting mapGoInfoClick");
            infoClick.active(true);
        });

        // Handle mapGo info click events
        backboneEvents.get().on("reset:mapGoInfoClick", function () {
            console.info("Resetting mapGoInfoClick");
            infoClick.reset();
        });

        backboneEvents.get().on("off:mapGoInfoClick", function () {
            console.info("Stopping mapGoInfoClick");
            infoClick.active(false)
        });

        // When print module emit on:customData when render the custom data
        backboneEvents.get().on("on:customData", function (e) {
            reportRender.render(e);
        });

        // Click event for print button
        $("#mapGo-print-btn").on("click", function () {
            // Trigger print dialog off
            backboneEvents.get().trigger("off:print");
            $("#mapGo-get-print-fieldset").prop("disabled", true);
            $(this).button('loading');
            print.control(printC, scales, "_mapGoPrint", "A4", "p", "inline");
            print.print(endPrintEventName, mapGoMenu.getMapGOMenuResult()).then(() => {
            print.cleanUp(true);});
        });

        // Click event for mapGo search on/off toggle button
        $("#mapGo-btn").on("click", function () {
            mapGoMenu.control();
        });


    }
};