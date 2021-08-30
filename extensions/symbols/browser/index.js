/*
 * @author     Martin Høgh <mh@mapcentia.com>
 * @copyright  2013-2021 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

'use strict';

import {polyfill} from "mobile-drag-drop";
import {scrollBehaviourDragImageTranslateOverride} from 'mobile-drag-drop/scroll-behaviour'


let utils;
let exId = "symbols";
let cloud;
let markers = {};
let rotations = {};
let scales = {};

module.exports = {

    /**
     *
     * @param o
     * @returns {exports}
     */
    set: function (o) {
        polyfill();
        const ua = window.navigator.userAgent.toLowerCase()
        const isiPad = ua.indexOf('ipad') > -1 || (ua.indexOf('macintosh') > -1 && 'ontouchend' in document)

        const usePolyfill = polyfill({
            forceApply: isiPad, // force apply for ipad
            dragImageTranslateOverride: scrollBehaviourDragImageTranslateOverride || isiPad,
        })

        if (usePolyfill) {
            document.addEventListener('dragenter', (event) => event.preventDefault())
            window.addEventListener('touchmove', () => {
            }, {passive: false})
        }
        utils = o.utils;
        cloud = o.cloud;
        return this;
    },

    /**
     *
     */
    init: function () {
        utils.createMainTab(exId, __("Symboles"), __("Info"), require('./../../../browser/modules/height')().max, "photo_camera", false, exId);
        $(`#${exId}`).append(dom);

        window.addEventListener('DOMContentLoaded', () => {
            const element = document.getElementById("drag-test");
            element.addEventListener("dragstart",
                (e) => {
                    e.dataTransfer.setData("text/plain", e.target.id);
                }
            );
        });
        $(".drag-marker").on("dragend", (e) => {
            e.preventDefault();
            let map = cloud.get().map;
            let markerElement = $(e.target).clone();
            let coord = map.mouseEventToLatLng(e);
            let id = Math.random().toString(36).substr(2, 5);
            let classStr = "dm_" + id;
            let rotateHandleStr = "r_" + id;
            let deleteHandleStr = "d_" + id;
            let scaleHandleStr = "s_" + id;
            markerElement.removeClass("symbols-lib");
            markerElement.addClass("symbols-map");
            markerElement.attr("draggable", "false")
            markerElement.addClass(classStr);
            markerElement.append(`<div class="symbols-handles symbols-rotate ${rotateHandleStr}"></div>`);
            markerElement.append(`<div class="symbols-handles symbols-delete ${deleteHandleStr}" id="${id}"></div>`);
            markerElement.append(`<div class="symbols-handles symbols-scale ${scaleHandleStr}"></div>`);
            let icon = L.divIcon({
                className: "drag-symbole",
                iconSize: new L.Point(72, 72),
                // iconAnchor: [26, 26],
                html: `${markerElement[0].outerHTML}`
            });
            markers[id] = L.marker(coord, {icon: icon, draggable: true}).addTo(map);
            rotations[id] = "0";
            scales[id] = "1";
            let img = $(`.${classStr}`);
            let rotateHandle = $(`.${rotateHandleStr}`);
            let deleteHandle = $(`.${deleteHandleStr}`);
            let scaleHandle = $(`.${scaleHandleStr}`);
            let mouseDown = false;
            let touch = false;
            const rotate = (e) => {
                if (mouseDown === true) {
                    let cRect = document.getElementsByClassName(classStr)[0].getBoundingClientRect();
                    let center_x = (cRect.left) + (cRect.width / 2);
                    let center_y = (cRect.top) + (cRect.height / 2);
                    let mouse_x;
                    let mouse_y;
                    if (!touch) {
                        mouse_x = e.pageX;
                        mouse_y = e.pageY;
                    } else {
                        mouse_x = e.originalEvent.changedTouches[0].clientX;
                        mouse_y = e.originalEvent.changedTouches[0].clientY;
                    }
                    let radians = Math.atan2(mouse_x - center_x, mouse_y - center_y);
                    rotations[id] =  (radians * (180 / Math.PI) * -1) + 90;
                    img.css('transform', 'rotate(' + rotations[id] + 'deg) scale(' + scales[id] + ')');
                }
            }
            const scale = (e) => {
                if (mouseDown === true) {
                    let cRect = document.getElementsByClassName(classStr)[0].getBoundingClientRect();
                    let center_x = (cRect.left) + (cRect.width / 2);
                    let center_y = (cRect.top) + (cRect.height / 2);
                    let mouse_x;
                    let mouse_y;
                    if (!touch) {
                        mouse_x = e.pageX;
                        mouse_y = e.pageY;
                    } else {
                        mouse_x = e.originalEvent.changedTouches[0].clientX;
                        mouse_y = e.originalEvent.changedTouches[0].clientY;
                    }
                    let a = (mouse_x - center_x);
                    let b = (mouse_y - center_y);
                    let c = Math.sqrt(a * a + b * b);
                    scales[id] = (c / 50);
                    img.css('transform', 'rotate(' + rotations[id] + 'deg) scale(' + scales[id] + ')');
                }
            }

            deleteHandle.mousedown(function (e) {
                e.preventDefault();
                markers[id].dragging.disable();
                map.dragging.disable();
                map.touchZoom.disable();
            });
            deleteHandle.on("touchstart", function (e) {
                e.preventDefault();
                markers[id].dragging.disable();
                map.dragging.disable();
                map.touchZoom.disable();
            });
            deleteHandle.on("click touchend", function (e) {
                e.preventDefault();
                map.removeLayer(markers[e.target.id]);
                delete markers[e.target.id];
            });

            rotateHandle.mousedown(function (e) {
                e.preventDefault();
                markers[id].dragging.disable();
                map.dragging.disable();
                map.touchZoom.disable();
                mouseDown = true;
                touch = false;
                $(document).mousemove(rotate);
            });
            rotateHandle.on("touchstart", function (e) {
                e.preventDefault();
                markers[id].dragging.disable();
                map.dragging.disable();
                map.touchZoom.disable();
                mouseDown = true;
                touch = true;
                $(document).on("touchmove", rotate);
            });

            scaleHandle.mousedown(function (e) {
                e.preventDefault();
                markers[id].dragging.disable();
                map.dragging.disable();
                map.touchZoom.disable();
                mouseDown = true;
                touch = false;
                $(document).mousemove(scale);
            });
            scaleHandle.on("touchstart", function (e) {
                e.preventDefault();
                markers[id].dragging.disable();
                map.dragging.disable();
                map.touchZoom.disable();
                mouseDown = true;
                touch = true;
                $(document).on("touchmove", scale);
            });
            $(document).on("touchend mouseup", function (e) {
                for (const id in markers) {
                    markers[id].dragging.enable();
                }
                map.dragging.enable();
                map.touchZoom.enable()
                $(document).off("mousemove touchmove");
                mouseDown = false;
            })

        })
    }
};

let dom = `<div>
                                <div class="symbols-lib drag-marker" draggable="true" style="cursor: move">
                                   <svg height="30" width="30">
                                        <ellipse cx="20" cy="20" rx="10" ry="5" style="fill:yellow;stroke:purple;stroke-width:2" />
                                   </svg> 
                                </div>
                                <div class="symbols-lib drag-marker" draggable="true" style="cursor: move">
                                    22222
                                </div>
                                <div class="symbols-lib drag-marker" draggable="true" style="cursor: move">
                                    33333
                                </div>
</div>`

