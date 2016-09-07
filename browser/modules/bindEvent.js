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
var toHtml = new showdown.Converter();

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
        return this;
    },
    init: function (str) {
        metaDataKeys = meta.getMetaDataKeys();
        $("#draw-btn").on("click", function () {
            // Stop advancedInfo
            if (advancedInfo.getSearchOn()) {
                advancedInfo.control(); // Will toggle the control off
                $("#advanced-info-btn").prop("checked", false);
                $("#buffer").hide();
            }
            draw.control();
        });

        $("#advanced-info-btn").on("click", function () {
            // Stop drawing
            if (draw.getDrawOn()) {
                draw.control(); // Will toggle the control off
                $("#draw-btn").prop("checked", false);
            }
            advancedInfo.control();
        });

        $("#start-print-btn").on("click", function () {
            print.print();
            $(this).button('loading');
            $("#get-print-fieldset").prop("disabled", true);
        });

        $("#print-btn").on("click", function () {
            print.activate();
            $("#get-print-fieldset").prop("disabled", true);
        });
        $("#info-modal button").on("click", function () {
            $("#info-modal").hide();
        });

        // HACK. Arrive.js seems to mess up Wkhtmltopdf, so we don't bind events on print HTML page.
        if (!urlVars.px && !urlVars.py) {
            $(document).arrive('[data-gc2-id]', function () {
                console.log("Bind layer");
                $(this).change(function (e) {
                    switchLayer.init($(this).data('gc2-id'), $(this).context.checked);
                    e.stopPropagation();
                });
            });
            $(document).arrive('[data-gc2-base-id]', function () {
                console.log("Bind base");
                $(this).on("click", function (e) {
                    setBaseLayer.init($(this).data('gc2-base-id'));
                    e.stopPropagation();
                    $(this).css("background-color", "white");
                });

            });
            $(document).arrive('.info-label', function () {
                console.log("Bind info");
                $(this).on("click", function (e) {
                    var t = ($(this).prev().children("input").data('gc2-id'));
                    $("#info-modal").show();
                    $("#info-modal .modal-title").html(metaDataKeys[t].f_table_title || metaDataKeys[t].f_table_name);
                    $("#info-modal .modal-body").html((metaDataKeys[t].meta !== null && typeof $.parseJSON(metaDataKeys[t].meta).meta_desc !== "undefined") ? toHtml.makeHtml($.parseJSON(metaDataKeys[t].meta).meta_desc) : "");
                    legend.init([t], "#info-modal-legend");
                    e.stopPropagation();
                });

            });
        }
    }
};