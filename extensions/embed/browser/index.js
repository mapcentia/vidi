/*
 * @author     Martin Høgh <mh@mapcentia.com>
 * @copyright  2013-2021 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */


'use strict';

let measurements;
let backboneEvents;
let cloud;
let setting;
let print;
let meta;
let anchor;
let legend;
let metaDataKeys;
let lc;
let mapcontrols;

/**
 *
 * @returns {*}
 */
module.exports = {
    set: (o) => {
        measurements = o.measurements;
        backboneEvents = o.backboneEvents;
        cloud = o.cloud;
        setting = o.setting;
        print = o.print;
        meta = o.meta;
        legend = o.legend;
        anchor = o.anchor;
        mapcontrols = o.mapcontrols;
        return this;
    },
    init: () => {
        let map = cloud.get().map;
        let id = "#legend-dialog";
        backboneEvents.get().trigger(`on:infoClick`);
        lc = cloud.getLc();
        $(id).animate({
            bottom: ("-233px")
        }, 500, () => {
            $(id + " .expand-less").hide();
            $(id + " .expand-more").show();
        });

        metaDataKeys = meta.getMetaDataKeys();

        $("#burger-btn").on("click", () => {
            $("#layer-slide.slide-left").animate({
                left: "0"
            }, 500)
            let bp = 2170;
            let sw = $(window).width();
            if (sw < bp && sw > 500) {
                $("#legend-dialog").animate({
                    left: "30.2%"
                }, 500)
            } else if (sw > bp) {
                $("#legend-dialog").animate({
                    left: "656px"
                }, 500)
            }
        });

        $("#layer-slide.slide-left .close").on("click", () => {
            $("#layer-slide.slide-left").animate({
                left: "-100%"
            }, 500)
            $("#legend-dialog").animate({
                left: "6px"
            }, 500)
        });

        $("#info-modal-top.slide-left .close").on("click", () => {
            $("#info-modal-top.slide-left").animate({
                left: "-100%"
            }, 500)
        });

        $("#zoom-in-btn").on("click", () => {
            map.zoomIn();
        });

        $("#zoom-out-btn").on("click", () => {
            map.zoomOut();
        });

        $("#zoom-default-btn").on("click", () => {
            mapcontrols.setDefaultZoomCenter();
        });

        $("#measurements-module-btn").on("click", () => {
            measurements.toggleMeasurements(true);
        });

        $(`#find-me-btn`).click(() => {
            lc._justClicked = true;
            lc._userPanned = false;
            lc._setClasses = (state) => {
                if (state === 'active') {
                    $("#find-me-btn i").css("color", "#136AEC")
                } else if (state === 'following') {
                    $("#find-me-btn i").css("color", "#FFB000")
                }
            }
            if (lc._active && !lc._event) {
                // click while requesting
                lc.stop();
                $("#find-me-btn i").css("color", "rgba(0,0,0, 0.87)")
            } else if (lc._active && lc._event !== undefined) {
                let behavior = lc._map.getBounds().contains(lc._event.latlng) ?
                    lc.options.clickBehavior.inView : lc.options.clickBehavior.outOfView;
                switch (behavior) {
                    case 'setView':
                        lc.setView();
                        break;
                    case 'stop':
                        lc.stop();
                        $("#find-me-btn i").css("color", "rgba(0,0,0, 0.87)")
                        if (lc.options.returnToPrevBounds) {
                            let f = lc.options.flyTo ? lc._map.flyToBounds : lc._map.fitBounds;
                            f.bind(lc._map)(lc._prevBounds);
                        }
                        break;
                }
            } else {
                if (lc.options.returnToPrevBounds) {
                    lc._prevBounds = lc._map.getBounds();
                }
                lc.start();
            }
            lc._updateContainerStyle();
        });
    }
};
