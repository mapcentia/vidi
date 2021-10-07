/*
 * @author     Martin Høgh <mh@mapcentia.com>
 * @copyright  2013-2021 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

'use strict';
const MODULE_ID = `conflict`;

let print;
let conflictSearch;
let backboneEvents;
let reportRender;
let infoClick;
let cloud;
let state;
let stateFromDb;
let reportType = "1";
let _self;
const config = require('../../../config/config.js');
const printC = config.print.templates;
const scales = config.print.scales;
const urlparser = require('../../../browser/modules/urlparser');


/**
 *
 * @returns {*}
 */
module.exports = {
    set: function (o) {
        print = o.print;
        state = o.state;
        reportRender = o.extensions.conflictSearch?.reportRender || o.extensions.conflictSearch.reportRenderAlt;
        infoClick = o.extensions.conflictSearch.infoClick;
        backboneEvents = o.backboneEvents;
        conflictSearch = o.extensions.conflictSearch.index;
        cloud = o.cloud;
        _self = this;
        return this;
    },
    init: function () {
        state.listenTo(MODULE_ID, _self);
        state.listen(MODULE_ID, `state_change`);

        let endPrintEventName = "end:conflictPrint";

        $('input[name="conflict-report-type"]').on("change", () => {
            reportType = $('input[name="conflict-report-type"]:checked').val();
            backboneEvents.get().trigger(`${MODULE_ID}:state_change`);
        })

        // Stop listening to any events, deactivate controls, but
        // keep effects of the module until they are deleted manually or reset:all is emitted
        backboneEvents.get().on("deactivate:all", () => {
        });

        // Activates module
        backboneEvents.get().on("on:conflictSearch", () => {
            conflictSearch.control();
            if (stateFromDb) {
                setTimeout(() => {
                    stateFromDb = null;
                }, 0);
                conflictSearch.setValueForNoUiSlider(stateFromDb.bufferValue);
                conflictSearch.handleResult(stateFromDb);
                reportType = stateFromDb.reportType;
                $("input[name='conflict-report-type'][value='" + reportType + "']").prop("checked", true);
                return;
            }
            state.getModuleState(MODULE_ID).then(initialState => {
                if (initialState) {
                    conflictSearch.setValueForNoUiSlider(initialState.bufferValue);
                    if (typeof urlparser.urlVars?.var_landsejerlavskode === "undefined" || conflictSearch.getFromVarsIsDone()) {
                        conflictSearch.handleResult(initialState);
                    }
                    reportType = initialState.reportType || "1";
                }
                $("input[name='conflict-report-type'][value='" + reportType + "']").prop("checked", true);
            });

        });

        // Deactivates module
        backboneEvents.get().on("off:conflictSearch off:all reset:all", () => {
            _self.resetState();
        });

        // Handle GUI when print is done. Using at custom event, so standard print is not triggered
        backboneEvents.get().on(endPrintEventName, function (response) {
            console.log("GEMessage:LaunchURL:" + urlparser.urlObj.protocol + "://" + urlparser.urlObj.host + "/tmp/print/pdf/" + response.key + ".pdf");
        });

        // When conflict search is done, enable the print button
        backboneEvents.get().on("end:conflictSearch", function (e) {
            let excelBtn = $("#conflict-excel-btn");
            $("#conflict-print-btn").prop("disabled", false);
            excelBtn.prop("disabled", false);
            $("#conflict-set-print-area-btn").prop("disabled", false);
            backboneEvents.get().trigger(`${MODULE_ID}:state_change`);
            excelBtn.prop("href", "/tmp/excel/" + e.file + ".xlsb");
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
                $("#conflict-set-print-area-btn").prop("disabled", true);
                $("#conflict-get-print-fieldset").prop("disabled", true);
                $(this).button('loading');
                print.control(printC, scales, "_conflictPrint", "A4", "p", "inline");

                if (reportType === "1") {
                    print.print(endPrintEventName, conflictSearch.getResult()).then(res => {
                        print.cleanUp(true);
                        $("#conflict-get-print-fieldset").prop("disabled", false);
                        $("#conflict-download-pdf, #conflict-open-pdf").prop("href", "/tmp/print/pdf/" + res.key + ".pdf");
                        $("#conflict-print-btn").button('reset');
                        backboneEvents.get().trigger("end:conflictSearchPrint", res);
                        $("#conflict-set-print-area-btn").prop("disabled", false);
                    });
                } else {
                    let results = conflictSearch.getResult();
                    let positiveHits = JSON.parse(JSON.stringify(results));
                    for (const property in results.hits) {
                        if (property && results.hits.hasOwnProperty(property)) {
                            if (reportType === "2" && results.hits[property].hits === 0) {
                                delete positiveHits.hits[property];
                            }
                        }
                    }
                    let hits = positiveHits.hits
                    let numOfHits = Object.keys(hits).length;
                    let track = [];
                    let count = 0;
                    $.snackbar({
                        id: "snackbar-conflict-print",
                        content: "<span>" + __("Prints completed") + " <span id='conflict-print-progress'>0/" + numOfHits + "</span></span>",
                        htmlAllowed: true,
                        timeout: 1000000
                    });
                    let iter = n => {
                        let clone = JSON.parse(JSON.stringify(positiveHits));
                        let hit = Object.keys(hits)[n]
                        clone.hits = {};
                        clone.layer = hit;
                        clone.hits[hit] = positiveHits.hits[hit];
                        print.print(endPrintEventName, clone).then(res => {
                            track.push(res.key);
                            count++;
                            $("#conflict-print-progress").html(`${count}/${numOfHits}`);
                            if (numOfHits === count) {
                                print.cleanUp(true);
                                $("#conflict-set-print-area-btn").prop("disabled", false);
                                $.ajax({
                                    dataType: `json`,
                                    method: `POST`,
                                    url: `/api/mergePrint/`,
                                    contentType: `application/json`,
                                    data: JSON.stringify(track),
                                    scriptCharset: `utf-8`,
                                    success: (response) => {
                                        $("#conflict-get-print-fieldset").prop("disabled", false);
                                        $("#conflict-download-pdf, #conflict-open-pdf").prop("href", "/tmp/print/pdf/" + response.key + ".pdf");
                                        $("#conflict-print-btn").button('reset');
                                        backboneEvents.get().trigger("end:conflictSearchPrint", response);
                                        setTimeout(function () {
                                            $("#snackbar-conflict-print").snackbar("hide");
                                        }, 200);
                                    },
                                    //error: reject
                                });
                            } else {
                                iter(count)
                            }
                        }, () => {
                            setTimeout(() => iter(count), 1000);
                        });
                    }
                    iter(count);
                }

                // for (const property in positiveHits.hits) {
                //     let clone = JSON.parse(JSON.stringify(positiveHits));
                //     clone.hits = {};
                //     clone.layer = property;
                //     clone.hits[property] = positiveHits.hits[property];
                //     print.print(endPrintEventName, clone).then((res) => {
                //         track.push(res.key);
                //         count++
                //         $("#conflict-print-progress").html(`${count}/${numOfHits}`);
                //         if (numOfHits === count) {
                //             console.log(track);
                //             print.cleanUp(true);
                //             $("#conflict-set-print-area-btn").prop("disabled", false);
                //             $.ajax({
                //                 dataType: `json`,
                //                 method: `POST`,
                //                 url: `/api/mergePrint/`,
                //                 contentType: `application/json`,
                //                 data: JSON.stringify(track),
                //                 scriptCharset: `utf-8`,
                //                 success: (response) => {
                //                     console.log(response);
                //                     $("#conflict-get-print-fieldset").prop("disabled", false);
                //                     $("#conflict-download-pdf, #conflict-open-pdf").prop("href", "/tmp/print/pdf/" + response.key + ".pdf");
                //                     $("#conflict-print-btn").button('reset');
                //                     backboneEvents.get().trigger("end:conflictSearchPrint", response);
                //                     setTimeout(function () {
                //                         $("#snackbar-conflict-print").snackbar("hide");
                //                     }, 200);
                //
                //                 },
                //                 //error: reject
                //             });
                //         } else {
                //         }
                //     });
                // }
            }
        );

        $("#conflict-set-print-area-btn").on("click", function () {
            print.cleanUp(true);
            cloud.get().map.panTo(conflictSearch.getBufferItems().getBounds().getCenter());
            // Wait for panning to end
            setTimeout(() => {
                print.control(printC, scales, "_conflictPrint", "A4", "p", "inline");
            }, 500);
        });
    },

    resetState: () => {
        return new Promise((resolve) => {
            conflictSearch.off();
            infoClick.active(false);
            infoClick.reset();
            resolve();
        });
    },

    getState: () => {
        let res = conflictSearch.getResult();
        res.reportType = reportType;
        return res;
    },

    applyState: (newState) => {
        return new Promise((resolve) => {
            stateFromDb = newState;
            resolve();
        });
    }
};
