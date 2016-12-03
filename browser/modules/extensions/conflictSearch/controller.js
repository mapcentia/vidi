/**
 * @fileoverview Description of file, its uses and information
 * about its dependencies.
 */

'use strict';

var print;
var conflictSearch;
var backboneEvents;
var reportRender;
var config = require('../../../../config/config.js');
var printC = config.print.templates;
var scales = config.print.scales;

/**
 *
 * @returns {*}
 */
module.exports = {
    set: function (o) {
        print = o.print;
        reportRender = o.extensions.conflictSearch.reportRender;
        backboneEvents = o.backboneEvents;
        conflictSearch = o.extensions.conflictSearch.index;
        return this;
    },
    init: function () {
        var endPrintEventName = "end:conflictPrint";

        // Turn off if advanced info or drawing is activated
        backboneEvents.get().on("off:conflict on:advancedInfo on:drawing", function () {
            conflictSearch.off();
        });

        backboneEvents.get().on(endPrintEventName, function (e) {
            $("#conflict-print-btn").button('reset');
            window.open(e.url);
        });

        backboneEvents.get().on("end:conflictSearch", function () {
            $("#conflict-print-btn").prop("disabled", false);
        });

        backboneEvents.get().on("on:customData", function (e) {
            reportRender.render(e);
        });

        $("#conflict-print-btn").on("click", function () {
            // Trigger print dialog off
            backboneEvents.get().trigger("off:print");

            $(this).button('loading');
            print.control(printC, scales, "conflictPrint", "A4", "p");
            print.print(endPrintEventName, conflictSearch.getResult());
            print.cleanUp();
        });

        $("#conflict-btn").on("click", function () {
            conflictSearch.control();
        });


    }
};