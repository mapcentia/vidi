/*
 * @author     Martin Høgh <mh@mapcentia.com>
 * @copyright  2013-2021 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

'use strict';

let utils;
let exId = "symbols";
let cloud;
module.exports = {

    /**
     *
     * @param o
     * @returns {exports}
     */
    set: function (o) {
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
            console.log(coord)
            let classStr = "dm_" + Math.random().toString(36).substr(2, 5);
            let handleStr = "h_" + Math.random().toString(36).substr(2, 5);
            markerElement.removeClass("symbols-lib");
            markerElement.addClass("symbols-map");
            markerElement.addClass(classStr);
            markerElement.append(`<div class="marker ${handleStr}"></div>`);
            let icon = L.divIcon({
                className: "drag-symbole",
                iconSize: new L.Point(72, 72),
                html: `${markerElement[0].outerHTML}`
            });
            let marker = L.marker(coord, {icon: icon, draggable: true}).addTo(map);
            let img = $(`.${classStr}`);
            let handle = $(`.${handleStr}`);
            let mouseDown = false;
            const mouse = (e) => {
                if (mouseDown === true) {
                    let offset = img.offset();
                    let center_x = (offset.left) + (img.width() / 2);
                    let center_y = (offset.top) + (img.height() / 2);
                    let mouse_x = e.pageX;
                    let mouse_y = e.pageY;
                    // let mouse_x = e.originalEvent.changedTouches[0].clientX;
                    // let mouse_y = e.originalEvent.changedTouches[0].clientY;
                    let radians = Math.atan2(mouse_x - center_x, mouse_y - center_y);
                    let degree = (radians * (180 / Math.PI) * -1) + 90;
                    img.css('transform', 'rotate(' + degree + 'deg)');
                }
            }

            handle.mousedown(function (e) {
                e.preventDefault();
                marker.dragging.disable();
                map.dragging.disable();
                map.touchZoom.disable();
                mouseDown = true;
                $(document).mousemove(mouse);
            });
            $(document).mouseup(function (e) {
                e.preventDefault();
                marker.dragging.enable();
                map.dragging.enable();
                map.touchZoom.enable();
                mouseDown = false;
            })
            handle.on("touchstart", function (e) {
                e.preventDefault();
                marker.dragging.disable();
                map.dragging.disable();
                map.touchZoom.disable();
                mouseDown = true;
                $(document).on("touchmove", mouse);
            });
            $(document).on("touchend", function (e) {
                e.preventDefault();
                marker.dragging.enable();
                map.dragging.enable();
                map.touchZoom.enable();
                mouseDown = false;
            })

        })
        $("body").bind("ondrop", (event) => {
            event.preventDefault();
            alert("drop")
        })

        $("body").bind("ondragover", (event) => {
            event.preventDefault();
            console.log("over")
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

