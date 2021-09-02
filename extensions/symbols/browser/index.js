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
                    rotations[id] = (radians * (180 / Math.PI) * -1) + 135;
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
                    scales[id] = (c / 40);
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

let dom = `

<div>
    <div class="row">
        <div class="col-md-4">
            <div class="symbols-lib drag-marker" draggable="true">
                <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><title>
                    curved-arrow-down-glyph</title>
                    <path d="M492.93,170.85C492.93,76.64,416.29,0,322.09,0S151.25,76.64,151.25,170.85l-.12,184.77L80.2,284.17a9.83,9.83,0,0,0-13.9,0L21.9,328.57a9.84,9.84,0,0,0,0,13.9L188.54,509.11a9.81,9.81,0,0,0,13.9,0L369.08,342.48a9.83,9.83,0,0,0,0-13.9l-44.4-44.41a10.11,10.11,0,0,0-13.9,0L239.6,355.62l.13-184.77a82.35,82.35,0,1,1,164.7,0l0,159.84a9.94,9.94,0,0,0,9.93,9.93H483a9.94,9.94,0,0,0,9.93-9.93Z"/>
                </svg>
            </div>
        </div>
        <div class="col-md-4">
            <div class="symbols-lib drag-marker" draggable="true">
                <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><title>
                    arrow-right-down-glyph</title>
                    <path d="M487.31,275.08a11.1,11.1,0,0,0-9.61-5.55H421.54V11.1A11.1,11.1,0,0,0,410.44,0H120a11.11,11.11,0,0,0-9,4.64L25.27,124.51a11.1,11.1,0,0,0,9,17.55H279.47V269.53H223.3a11.1,11.1,0,0,0-9.61,16.65L340.9,506.45a11.1,11.1,0,0,0,19.22,0L487.3,286.18A11.09,11.09,0,0,0,487.31,275.08Z"/>
                </svg>
            </div>
        </div>
        <div class="col-md-4">
            <div class="symbols-lib drag-marker" draggable="true">
                <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><title>
                    arrow-curved-top-glyph</title>
                    <path d="M376.06,238.67v104a168.69,168.69,0,0,1-49.83,119.51v.36A169.16,169.16,0,0,1,37.37,342.66V136.12h81.24V342.66a87.53,87.53,0,0,0,88.1,88.1,88.14,88.14,0,0,0,88.1-88.1v-104H199.13l69-119.51L337.06,0l68.6,119.15,69,119.51Z"
                          fill="#434040"/>
                </svg>
            </div>
        </div>
    </div>

    <div class="row" style="margin-top: 25px">
        <div class="col-md-4">
            <div class="symbols-lib drag-marker" draggable="true">
                <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><title>
                    arrow-left-glyph</title>
                    <path d="M501.34,62.07h-63a10.66,10.66,0,0,0-10.66,10.66V297.52H193.73V240.13a10.66,10.66,0,0,0-16-9.23L5.33,330.47a10.66,10.66,0,0,0,0,18.46L177.75,448.5a10.66,10.66,0,0,0,16-9.23V381.88H501.34A10.66,10.66,0,0,0,512,371.22V72.73A10.66,10.66,0,0,0,501.34,62.07Z"/>
                </svg>
            </div>
        </div>
        <div class="col-md-4">
            <div class="symbols-lib drag-marker" draggable="true">
                <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><title>
                    arrow-top-glyph</title>
                    <polygon
                            points="256 0 362.35 115.09 468.7 230.55 338.04 230.55 338.04 512 166.74 512 166.74 230.55 43.3 230.55 149.65 115.09 256 0"
                            fill="#434040"/>
                </svg>
            </div>
        </div>
        <div class="col-md-4">
        </div>
    </div>
</div>
`

