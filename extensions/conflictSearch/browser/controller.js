/*
 * @author     Martin Høgh <mh@mapcentia.com>
 * @copyright  2013-2020 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

'use strict';

var print;
var conflictSearch;
var backboneEvents;
var reportRender;
var infoClick;
var cloud;
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
        reportRender = o.extensions.conflictSearch.reportRender;
        infoClick = o.extensions.conflictSearch.infoClick;
        backboneEvents = o.backboneEvents;
        conflictSearch = o.extensions.conflictSearch.index;
        cloud = o.cloud;
        return this;
    },
    init: function () {
        var endPrintEventName = "end:conflictPrint";

        // Stop listening to any events, deactivate controls, but
        // keep effects of the module until they are deleted manually or reset:all is emitted
        backboneEvents.get().on("deactivate:all", () => {});

        // Activates module
        backboneEvents.get().on("on:conflictSearch", () => {
            conflictSearch.control();
        });

        // Deactivates module
        backboneEvents.get().on("off:conflictSearch off:all reset:all", () => {
            conflictSearch.off();
            infoClick.active(false);
            infoClick.reset();
        });

        // Handle GUI when print is done. Using at custom event, so standard print is not triggered
        backboneEvents.get().on(endPrintEventName, function (response) {
            $("#conflict-get-print-fieldset").prop("disabled", false);
            $("#conflict-download-pdf, #conflict-open-pdf").prop("href", "/tmp/print/pdf/" + response.key + ".pdf");
            $("#conflict-open-html").prop("href", response.url);
            $("#conflict-print-btn").button('reset');
            backboneEvents.get().trigger("end:conflictSearchPrint", response);
            console.log("GEMessage:LaunchURL:" + urlparser.uriObj.protocol() + "://" +  urlparser.uriObj.host() + "/tmp/print/pdf/" + response.key + ".pdf");

        });

        // When conflict search is done, enable the print button
        backboneEvents.get().on("end:conflictSearch", function () {
            $("#conflict-print-btn").prop("disabled", false);
            $("#conflict-set-print-area-btn").prop("disabled", false);
        });

        // Handle conflict info click events
        backboneEvents.get().on("on:conflictInfoClick", function () {
            console.info("Starting conflictInfoClick");
            infoClick.active(true);

        });

        // Handle conflict info click events
        backboneEvents.get().on("reset:conflictInfoClick", function () {
            console.info("Resetting conflictInfoClick");
            infoClick.reset();
        });

        backboneEvents.get().on("off:conflictInfoClick", function () {
            console.info("Stopping conflictInfoClick");
            infoClick.active(false);
        });

        // When print module emit on:customData when render the custom data
        backboneEvents.get().on("on:customData", function (e) {
            reportRender.render(e);
        });

        // Click event for print button
        $("#conflict-print-btn").on("click", function () {
            // Trigger print dialog off
            backboneEvents.get().trigger("off:print");
            $("#conflict-set-print-area-btn").prop("disabled", true);
            $("#conflict-get-print-fieldset").prop("disabled", true);
            $(this).button('loading');
            print.control(printC, scales, "_conflictPrint", "A4", "p", "inline");
            print.print(endPrintEventName, conflictSearch.getResult()).then(() => {
                print.cleanUp(true);
                $("#conflict-set-print-area-btn").prop("disabled", false);

            });
        });

        $("#conflict-set-print-area-btn").on("click", function () {
            print.cleanUp(true);
            cloud.get().map.panTo(conflictSearch.getBufferItems().getBounds().getCenter());
            // Wait for panning to end
            setTimeout(()=>{
               print.control(printC, scales, "_conflictPrint", "A4", "p", "inline");
            }, 500);
        });
    }
};