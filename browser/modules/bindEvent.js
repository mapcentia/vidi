/**
 * @fileoverview Description of file, its uses and information
 * about its dependencies.
 */

'use strict';

/**
 *
 * @type {*|exports|module.exports}
 */
var draw;

/**
 *
 * @type {*|exports|module.exports}
 */
var advancedInfo;

/**
 *
 * @type {*|exports|module.exports}
 */
var cloud;

/**
 *
 * @type {*|exports|module.exports}
 */
var print;

/**
 *
 * @type {*|exports|module.exports}
 */
var switchLayer;

/**
 *
 * @type {*|exports|module.exports}
 */
var setBaseLayer;

/**
 *
 * @type {*|exports|module.exports}
 */
var legend;

/**
 *
 * @type {*|exports|module.exports}
 */
var meta;

/**
 *
 * @type {array}
 */
var metaDataKeys;

/**
 *
 * @type {array}
 */
var reset;

/**
 *
 * @type {*|exports|module.exports}
 */
var urlparser = require('./urlparser');

/**
 *
 * @type {array}
 */
var urlVars = urlparser.urlVars;

/**
 *
 * @type {showdown.Converter}
 */
var showdown = require('showdown');
var converter = new showdown.Converter();

require('dom-shims');
require('arrive');

var backboneEvents;

var pushState;
var layerTree;
var layers;
var infoClick;
var setting;
var state;

var isStarted = false;

/**
 *
 * @type {{set: module.exports.set, init: module.exports.init}}
 */
module.exports = module.exports = {
    set: function (o) {
        draw = o.draw;
        advancedInfo = o.advancedInfo;
        cloud = o.cloud;
        print = o.print;
        switchLayer = o.switchLayer;
        setBaseLayer = o.setBaseLayer;
        legend = o.legend;
        meta = o.meta;
        pushState = o.pushState;
        layerTree = o.layerTree;
        layers = o.layers;
        infoClick = o.infoClick;
        backboneEvents = o.backboneEvents;
        reset = o.reset;
        setting = o.setting;
        state = o.state;
        return this;
    },
    init: function (str) {
        var doneL, doneB, loadingL = false, loadingB = false;

        cloud.get().on("dragend", function () {
            pushState.init();
        });
        cloud.get().on("moveend", function () {
            pushState.init();
        });
        cloud.get().on("move", function () {
            $("#tail").fadeOut(100);
        });

        cloud.get().map.on("editable:disable", function () {
            $("#info-modal").animate({
                right: "-" + $("#myNavmenu").width() + "px"
            }, 200)
        });

        cloud.get().on("dragstart", function () {
            $(".fade-then-dragging").animate({opacity: "0.3"}, 200);
            $(".fade-then-dragging").css("pointer-events", "none");
        });

        cloud.get().on("dragend", function () {
            $(".fade-then-dragging").animate({opacity: "1"}, 200);
            $(".fade-then-dragging").css("pointer-events", "all");

        });

        // Advanced info
        // =============

        $("#advanced-info-btn").on("click", function () {
            advancedInfo.control();
        });

        // Reset
        // =====

        $("#btn-reset").on("click", function () {
            reset.init();
        });


        $("#info-modal button").on("click", function () {
            $("#info-modal").animate({
                right: "-" + $("#myNavmenu").width() + "px"
            }, 200)
        });

        $("#searchclear").on("click", function () {
            backboneEvents.get().trigger("clear:search");
        });

        backboneEvents.get().on("ready:meta", function () {

            metaDataKeys = meta.getMetaDataKeys();

            if (!isStarted) {
                isStarted = true;
                setTimeout(
                    function () {
                        // HACK! Important to actual open the menu and when close it again
                        // This will set the width of the pane the right way
                        $("#navbar-fixed-top .navbar-toggle").trigger("click");
                        if ($(document).width() < 767) {
                            setTimeout(
                                function () {
                                    $("#navbar-fixed-top .navbar-toggle").trigger("click");
                                    $("#myNavmenu").offcanvas('hide'); // Hide it also, in case of the toogle button is hidden
                                }, 200
                            );
                        }
                    }, 200
                );

                setTimeout(
                    function () {
                        if (!window.vidiConfig.doNotCloseLoadScreen) {
                            $("#loadscreen").fadeOut(200);
                        }
                    }, 600
                );
            }

        });

        backboneEvents.get().on("off:advancedInfo on:drawing", function () {
            console.info("Stopping advanced info");
            advancedInfo.off();
        });

        backboneEvents.get().on("off:drawing on:advancedInfo", function () {
            console.info("Stopping drawing");
            draw.off();
        });

        // Info click
        // ==========

        backboneEvents.get().on("on:infoClick", function () {
            console.info("Activating infoClick");
            infoClick.active(true);
        });

        backboneEvents.get().on("off:infoClick", function () {
            console.info("Deactivating infoClick");
            infoClick.active(false);
        });

        backboneEvents.get().on("reset:infoClick", function () {
            console.info("Resetting infoClick");
            infoClick.reset();
        });


        backboneEvents.get().on("startLoading:layers", function (e) {
            console.log("Start loading: " + e);
            doneB = doneL = false;
            loadingL = true;
            $(".loadingIndicator").fadeIn(200);
        });

        backboneEvents.get().on("startLoading:setBaselayer", function (e) {
            console.log("Start loading: " + e);
            doneB = doneL = false;
            loadingB = true;
            $(".loadingIndicator").fadeIn(200);
        });

        backboneEvents.get().on("doneLoading:layers", function (e) {
            console.log("Done loading: " + e);
            if (layers.getCountLoading() === 0) {
                layers.resetCount();
                doneL = true;
                loadingL = false;
                if ((doneL && doneB) || loadingB === false) {
                    console.log("Setting timeout to " + window.vidiTimeout + "ms");
                    setTimeout(function () {
                        window.status = "all_loaded";
                        console.info("Layers all loaded L");
                        doneB = doneL = false;
                        $(".loadingIndicator").fadeOut(200);
                    }, window.vidiTimeout)
                }
            }
        });

        backboneEvents.get().on("doneLoading:setBaselayer", function (e) {
            console.log("Done loading: " + e);
            doneB = true;
            loadingB = false;
            if ((doneL && doneB) || loadingL === false) {
                console.log("Setting timeout to " + window.vidiTimeout + "ms");
                setTimeout(function () {
                    window.status = "all_loaded";
                    console.info("Layers all loaded B");
                    doneB = doneL = false;
                    $(".loadingIndicator").fadeOut(200);
                }, window.vidiTimeout)
            }
        });

        $(document).bind('mousemove', function (e) {
            $('#tail').css({
                left: e.pageX + 20,
                top: e.pageY
            });
        });

        // Print
        // =====
        $("#print-btn").on("click", function () {
            print.activate();
            $("#get-print-fieldset").prop("disabled", true);
        });

        $("#start-print-btn").on("click", function () {
            if (print.print()) {
                $(this).button('loading');
                $("#get-print-fieldset").prop("disabled", true);
            }

        });

        backboneEvents.get().on("off:print", function () {
            print.off();
        });

        backboneEvents.get().on("end:print", function (response) {
            $("#get-print-fieldset").prop("disabled", false);
            $("#download-pdf, #open-pdf").attr("href", "/tmp/print/pdf/" + response.key + ".pdf");
            $("#download-pdf").attr("download", response.key);
            $("#open-html").attr("href", response.url);
            $("#start-print-btn").button('reset');
        });

        // Refresh browser state. E.g. after a session start
        // =================================================
        backboneEvents.get().on("refresh:meta", function (response) {

            meta.init()

                .then(function () {
                        return setting.init();
                    },

                    function (error) {
                        console.log(error); // Stacktrace
                        alert("Vidi is loaded without schema. Can't set extent or add layers");
                        backboneEvents.get().trigger("ready:meta");
                        state.init();
                    })

                .then(function () {
                    layerTree.init();
                    state.init();
                });

        });


        // HACK. Arrive.js seems to mess up Wkhtmltopdf,
        // so we don't bind events on print HTML page.
        // =============================================

        if (!urlVars.px && !urlVars.py) {
            $(document).arrive('[data-gc2-id]', function () {
                $(this).on("change", function (e) {
                    switchLayer.init($(this).data('gc2-id'), $(this).context.checked);
                    e.stopPropagation();
                });
            });
            $(document).arrive('[data-gc2-base-id]', function () {
                $(this).on("change", function (e) {
                    setBaseLayer.init($(this).data('gc2-base-id'));
                    e.stopPropagation();
                    $(this).css("background-color", "white");
                });
            });
            $(document).arrive('[data-toggle="tooltip"]', function () {
                $(this).tooltip()
            });
            $(document).arrive('.info-label', function () {
                $(this).on("click", function (e) {
                    var t = ($(this).prev().children("input").data('gc2-id')), html, meta = $.parseJSON(metaDataKeys[t].meta);

                    html = (metaDataKeys[t].meta !== null && meta !== null
                        && typeof meta.meta_desc !== "undefined"
                        && meta.meta_desc !== "") ?
                        converter.makeHtml(meta.meta_desc) : metaDataKeys[t].f_table_abstract;

                    moment.locale('da');

                    for (var key in  metaDataKeys[t]) {
                        if (metaDataKeys[t].hasOwnProperty(key)) {
                            console.log(key + " -> " + metaDataKeys[t][key]);
                            if (key === "lastmodified") {
                                metaDataKeys[t][key] = moment(metaDataKeys[t][key]).format('LLLL');
                            }
                        }
                    }

                    html =Mustache.render(html, metaDataKeys[t]);

                    $("#info-modal.slide-right").animate({right: "0"}, 200);
                    $("#info-modal .modal-title").html(metaDataKeys[t].f_table_title || metaDataKeys[t].f_table_name);
                    $("#info-modal .modal-body").html(html + '<div id="info-modal-legend" class="legend"></div>');
                    legend.init([t], "#info-modal-legend");
                    e.stopPropagation();
                });

            });



            $(document).arrive('[data-scale-ul]', function () {
                $(this).on("click", function (e) {
                    $("#select-scale").val($(this).data('scale-ul')).trigger("change");
                });
            });
        }
    }
};