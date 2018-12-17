/*
 * @author     Martin Høgh <mh@mapcentia.com>
 * @copyright  2013-2018 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
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
var measurements;

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
let APIBridgeSingletone = require('./api-bridge');

/**
 *
 * @type {APIBridge}
 */
var apiBridgeInstance = false;

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

var jRespond = require('jrespond');


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
        measurements = o.measurements;
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
        apiBridgeInstance = APIBridgeSingletone();

        var doneL = false, doneB = false, loadingL = 0, loadingB = 0;

        cloud.get().on("dragend", function () {
            pushState.init();
        });
        cloud.get().on("moveend", function () {
            pushState.init();
        });
        cloud.get().on("move", function () {
            $("#tail").fadeOut(100);
        });

        cloud.get().on("dragstart", function () {
            $(".fade-then-dragging").animate({opacity: "0.3"}, 200);
            $(".fade-then-dragging").css("pointer-events", "none");
        });

        cloud.get().on("dragend", function () {
            $(".fade-then-dragging").animate({opacity: "1"}, 200);
            $(".fade-then-dragging").css("pointer-events", "all");

        });

        /**
         * Triggered when the layer control is changed in any module
         */
        $(document).arrive('[data-gc2-id]', function (e, data) {
            $(this).on("change", function (e) {
                let prefix = '';
                let doNotLegend = false;
                if ($(this).data(`gc2-layer-type`)) {
                    if ($(e.target).data('gc2-layer-type') === 'vector') {
                        prefix = 'v:';
                    }

                    if (data) {
                        doNotLegend = data.doNotLegend;
                    }
                }

                switchLayer.init(prefix + $(e.target).attr(`data-gc2-id`), $(e.target).prop(`checked`), doNotLegend);
                e.stopPropagation();

                backboneEvents.get().trigger(`layerTree:activeLayersChange`);
            });
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


        $("#searchclear").on("click", function () {
            backboneEvents.get().trigger("clear:search");
        });

        backboneEvents.get().on("allDoneLoading:layers", function () {
            metaDataKeys = meta.getMetaDataKeys();

            if (!isStarted) {
                isStarted = true;
                setTimeout(
                    function () {
                        if ($(document).width() > 1024) {
                            $("#search-border").trigger("click");
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

        // When reset:all is triggered, we rwe reset all modules.
        // Extensions must implement a listener for the reset:all event
        // and clean up
        // ============================================================
        backboneEvents.get().on("reset:all", function (ignoredModules = []) {
            console.info("Resets all", ignoredModules);

            // Should be enabled by default
            backboneEvents.get().trigger("on:infoClick");

            // Should be disabled by default
            let modulesToReset = [`advancedInfo`, `drawing`, `measurements`, `print`];
            modulesToReset.map(moduleToReset => {
                if (ignoredModules.indexOf(moduleToReset) === -1) {
                    backboneEvents.get().trigger(`off:${moduleToReset}`);
                }
            });
        });

        backboneEvents.get().on("off:measurements", function () {
            console.info("Stopping measurements");
            measurements.off();
        });

        backboneEvents.get().on("off:drawing", function () {
            console.info("Stopping drawing");
            draw.off();
        });

        backboneEvents.get().on("off:advancedInfo", function () {
            console.info("Stopping advanced info");
            advancedInfo.off();
        });

        /**
         * Processing turn on/off events for modules
         */
        let modulesToReactOnEachOtherChanges = [`measurements`, `drawing`, `advancedInfo`];
        modulesToReactOnEachOtherChanges.map(module => {
            backboneEvents.get().on(`${module}:turnedOn`, function () {
                console.info(`${module} was turned on`);
                // Reset all modules except caller
                backboneEvents.get().trigger(`reset:all`, [module]);
                // Disable the infoClick
                backboneEvents.get().trigger(`off:infoClick`);
            });

            // Drawing was turned off
            backboneEvents.get().on(`${module}:turnedOff`, function () {
                console.info(`${module} was turned off`);
                // Reset all modules except caller
                backboneEvents.get().trigger(`reset:all`, [module]);
            });
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

        // Clear all query layers and deactivate tools
        // ===========================================
        backboneEvents.get().on("sqlQuery:clear", ()=>{
            console.info("Resting SQL Query");
            infoClick.reset();
            advancedInfo.reset();
            layerTree.resetSearch();
        });


        // Layer loading
        // =============
        backboneEvents.get().on("startLoading:layers", function (e) {
            console.log("Start loading: " + e);
            doneL = false;
            loadingL = true;
            $(".loadingIndicator").fadeIn(200);
        });

        backboneEvents.get().on("startLoading:setBaselayer", function (e) {
            console.log("Start loading: " + e);
            doneB = false;
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
                        console.info("Layers all loaded L");
                        backboneEvents.get().trigger("allDoneLoading:layers");
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

            if ((doneL && doneB) || loadingL === false || layers.getCountLoading() === 0) {
                console.log("Setting timeout to " + window.vidiTimeout + "ms");
                setTimeout(function () {
                    console.info("Layers all loaded B");
                    backboneEvents.get().trigger("allDoneLoading:layers");
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
            console.log("GEMessage:LaunchURL:" + urlparser.uriObj.protocol() + "://" + urlparser.uriObj.host() + "/tmp/print/pdf/" + response.key + ".pdf");
        });

        backboneEvents.get().on("refresh:auth", function (response) {
            apiBridgeInstance.resubmitSkippedFeatures();
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
                    layerTree.create();
                    state.init();
                });

        });

        // Init some GUI stuff after modules are loaded
        // ============================================
        $("[data-toggle=tooltip]").tooltip();
        try {
            $.material.init();
        } catch (e) {
            console.warn("Material Design could not be initiated");
        }

        touchScroll(".tab-pane");
        touchScroll("#info-modal-body-wrapper");
        $("#loadscreentext").html(__("Loading data"));
        if (window.vidiConfig.activateMainTab) {
            setTimeout(function () {
                $('#main-tabs a[href="#' + window.vidiConfig.activateMainTab + '-content"]').tab('show');
            }, 200);
        }

        $(document).arrive('[data-toggle="tooltip"]', function () {
            $(this).tooltip()
        });

        $(document).arrive('[data-scale-ul]', function () {
            $(this).on("click", function (e) {
                $("#select-scale").val($(this).data('scale-ul')).trigger("change");
            });
        });

        // Set up the open/close functions for side panel
        var searchPanelOpen, width, collapsedWidth = 250;

        $("#main-tabs a").on("click", function (e) {
            $("#module-container.slide-right").css("right", "0");
            searchShowFull();
        });

        $(document).arrive("#main-tabs a", function () {
            $(this).on("click", function (e) {
                $("#module-container.slide-right").css("right", "0");
                searchShowFull();
            });
        });


        $("#info-modal .modal-header button").on("click", function () {
            if (!$(this).data("extraClickHandlerIsEnabled")) {
                infoModalHide();
                // Ikke den
            }
        });


        $("#module-container .modal-header button").on("click", function () {
            searchShow();
            if (!$(this).data("extraClickHandlerIsEnabled")) {
                moduleContainerHide();
                $("#side-panel ul li").removeClass("active");
            }
        });

        let setWidth = function (width) {
            $("#search-ribbon").css("width", width + "px").css("right", "-" + (width - 40) + "px");
            $("#module-container").css("width", (width - 100) + "px");
            $("#info-modal").css("width", (width - 100) + "px");
            $(".navmenu").css("width", (width) + "px");
            $(".slide-right").css("right", "-" + (width - 100) + "px");
        };

        var infoModalHide = function () {
            $("#info-modal").css("right", "-" + (width - 100) + "px");
        }

        var moduleContainerHide = function () {
            $("#module-container.slide-right").css("right", "-" + (width - 100) + "px");
        }

        var searchShow = function () {
            $("#search-ribbon").css("right", "-" + (width - collapsedWidth) + "px");
            $("#pane").css("right", (collapsedWidth - 40) + "px");
            $('#map').css("width", "calc(100% - " + (collapsedWidth / 2) + "px)");
            searchPanelOpen = true;
        }

        var searchShowFull = function () {
            $("#search-ribbon").css("right", "0");
            $("#pane").css("right", (width - 40) + "px");
            $('#map').css("width", "calc(100% - " + (width / 2) + "px");
            searchPanelOpen = true;
        }

        var searchHide = function () {
            $("#pane").css("right", "0");
            $('#map').css("width", "100%");
            $("#search-ribbon").css("right", "-" + (width - 40) + "px");
            searchPanelOpen = false;
            $("#side-panel ul li").removeClass("active");
        };

        var jRes = jRespond([
            {
                label: 'phone',
                enter: 0,
                exit: 500
            },
            {
                label: 'tablet',
                enter: 501,
                exit: 1024
            },
            {
                label: 'desktop',
                enter: 1024,
                exit: 10000
            }
        ]);

        jRes.addFunc({
            breakpoint: ['phone'],
            enter: function () {
                searchHide()
                width = 400;
                setWidth(width)
            },
            exit: function () {
                console.log("Exit phone");

            }
        });
        jRes.addFunc({
            breakpoint: ['tablet'],
            enter: function () {
                searchHide()
                width = 500;
                setWidth(width)
            },
            exit: function () {
                console.log("Exit tablet");

            }
        });
        jRes.addFunc({
            breakpoint: ['desktop'],
            enter: function () {
                searchHide()
                width = 700;
                setWidth(width)
            },
            exit: function () {
                console.log("Exit desktop");

            }
        });

        $('#search-border').click(function () {
            let id = $("#search-border i");
            if (searchPanelOpen) {
                searchHide();
                infoModalHide();
                moduleContainerHide();
                id.removeClass("fa-times");
                id.addClass("fa-reorder");
                id.css("padding-left", "12px")

            } else {
                searchShow();
                id.removeClass("fa-reorder");
                id.addClass("fa-times");
                id.css("padding-left", "14px")
            }
        });

        // Bottom dialog
        $(".close-hide").on("click touchstart", function (e) {
            var id = ($(this)).parent().parent().attr('id');

            // If print when deactivate
            if ($(this).data('module') === "print") {
                $("#print-btn").prop("checked", false);
                print.activate();
            }

            // If legend when deactivate
            if ($(this).data('module') === "legend") {
                $("#legend-content").append($("#legend"));
                $("#btn-show-legend-in-map").prop("disabled", false);
            }

            $("#" + id).animate({
                bottom: "-100%"
            }, 500, function () {
                $(id + " .expand-less").show();
                $(id + " .expand-more").hide();
            });
        });

        $(".expand-less").on("click touchstart", function () {

            var id = ($(this)).parent().parent().attr('id');

            $("#" + id).animate({
                bottom: (($("#" + id).height() * -1) + 30) + "px"
            }, 500, function () {
                $("#" + id + " .expand-less").hide();
                $("#" + id + " .expand-more").show();
            });
        });

        $(".expand-more").on("click touchstart", function () {

            var id = ($(this)).parent().parent().attr('id');

            $("#" + id).animate({
                bottom: "0"
            }, 500, function () {
                $("#" + id + " .expand-less").show();
                $("#" + id + " .expand-more").hide();
            });
        });

        $(".map-tool-btn").on("click", function (e) {

            e.preventDefault();

            var id = ($(this)).attr('href');

            // If print when activate
            if ($(this).data('module') === "print") {
                $("#print-btn").prop("checked", true);
                print.activate();
            }


            // If legend when deactivate
            if ($(this).data('module') === "legend") {
                $("#legend-dialog .modal-body").append($("#legend"));
                $("#btn-show-legend-in-map").prop("disabled", true);
            }

            $(id).animate({
                bottom: "0"
            }, 500, function () {
                $(id + " .expand-less").show();
                $(id + " .expand-more").hide();
            })
        });

        // Module icons
        $("#side-panel ul li a").on("click", function (e) {
            let id = ($(this));
            $("#side-panel ul li").removeClass("active");
            id.addClass("active");
        });

    }
};

