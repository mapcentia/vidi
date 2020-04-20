/*
 * @author     Martin Høgh <mh@mapcentia.com>
 * @copyright  2013-2018 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

'use strict';

import {state} from "../../../public/js/leaflet-easybutton/easy-button";

/**
 *
 */
var measurements;

var backboneEvents;

var oplevsyddjurs;

var cloud;

var setting;

var print;

var meta;
var anchor;

var legend;

var metaDataKeys;

var showdown = require('showdown');
var converter = new showdown.Converter();

/**
 *
 * @returns {*}
 */
module.exports = {
    set: function (o) {
        measurements = o.measurements;
        backboneEvents = o.backboneEvents;
        cloud = o.cloud;
        setting = o.setting;
        print = o.print;
        meta = o.meta;
        legend = o.legend;
        anchor = o.anchor;
        return this;
    },
    init: function () {
        backboneEvents.get().trigger(`on:infoClick`);

        let id = "#legend-dialog";
        $(id).animate({
            bottom: ("-233px")
        }, 500, function () {
            $(id + " .expand-less").hide();
            $(id + " .expand-more").show();
        });

        let map = cloud.get().map, showInfo = function (e) {
            let t = ($(this).data('gc2-id')), html,
                meta = metaDataKeys[t] ? $.parseJSON(metaDataKeys[t].meta) : null,
                name = metaDataKeys[t] ? metaDataKeys[t].f_table_name : null,
                title = metaDataKeys[t] ? metaDataKeys[t].f_table_title : null,
                abstract = metaDataKeys[t] ? metaDataKeys[t].f_table_abstract : null;

            html = (meta !== null
                && typeof meta.meta_desc !== "undefined"
                && meta.meta_desc !== "") ?
                converter.makeHtml(meta.meta_desc) : abstract;

            moment.locale('da');

            for (let key in  metaDataKeys[t]) {
                if (metaDataKeys[t].hasOwnProperty(key)) {
                    console.log(key + " -> " + metaDataKeys[t][key]);
                    if (key === "lastmodified") {
                        metaDataKeys[t][key] = moment(metaDataKeys[t][key]).format('LLLL');
                    }
                }
            }

            html = html ? Mustache.render(html, metaDataKeys[t]) : "";
            $("#info-modal-top.slide-left").show();
            $("#info-modal-top.slide-left").animate({left: "0"}, 200);
            $("#info-modal-top .modal-title").html(title || name);
            $("#info-modal-top .modal-body").html(html + '<div id="info-modal-legend" class="legend"></div>');
            legend.init([t], "#info-modal-legend");
            e.stopPropagation();
        };

        metaDataKeys = meta.getMetaDataKeys();

        // Unbind default
        $(document).unbindArrive(".info-label");

        // Set custom
        $(document).arrive('.info-label', function () {
            $(this).on("click", showInfo);
        });

        $('.info-label').on("click", showInfo);

        $("#btn-about").on("click", function (e) {
            $("#about-modal").modal({});

        });

        $("#burger-btn").on("click", function () {
            $("#layer-slide.slide-left").animate({
                left: "0"
            }, 500)
        });


        $("#layer-slide.slide-left .close").on("click", function () {
            $("#layer-slide.slide-left").animate({
                left: "-100%"
            }, 500)
        });

        $("#info-modal-top.slide-left .close").on("click", function () {
            $("#info-modal-top.slide-left").animate({
                left: "-100%"
            }, 500)
        });


        $("#zoom-in-btn").on("click", function () {
            map.zoomIn();
        });

        $("#zoom-out-btn").on("click", function () {
            map.zoomOut();
        });

        $("#zoom-default-btn").on("click", function () {
            let parameters = anchor.getInitMapParameters();
            if (parameters) {
                cloud.get().setView(new L.LatLng(parseFloat(parameters.y), parseFloat(parameters.x)), parameters.zoom);
            } else {
                cloud.get().zoomToExtent(setting.getExtent());
            }

        });

        $("#measurements-module-btn").on("click", function () {
            measurements.toggleMeasurements(true);
        });

        $(`#find-me-btn`).click(() => {
            let lc = cloud.getLc();
            lc.stop();
            lc.start();
            setTimeout(() => {
                lc.stop();
            }, 5000);
        });

    }
};