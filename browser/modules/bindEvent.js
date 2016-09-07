/*
 * Copyright 2016 MapCentia ApS. All rights reserved.
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   https://www.gnu.org/licenses/agpl-3.0.html
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var draw;
var advancedInfo;
var cloud;
var print;
var switchLayer;
var setBaseLayer;
var legend;
var meta;
var metaDataKeys;
var urlparser = require('./urlparser');
var urlVars = urlparser.urlVars;

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
                    $("#info-modal .modal-body").html((metaDataKeys[t].meta !== null && typeof $.parseJSON(metaDataKeys[t].meta).meta_desc !== "undefined") ? markdown.toHTML($.parseJSON(metaDataKeys[t].meta).meta_desc) : "");
                    legend.init([t], "#modal-legend");
                    e.stopPropagation();
                });

            });
        }
    }
};