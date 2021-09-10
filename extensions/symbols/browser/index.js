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
let symbolState = {}
let state;
let backboneEvents;
let _self;
const MODULE_ID = exId;
let mouseDown = false;
let touch = false;

const store = (id) => {
    backboneEvents.get().trigger(`${MODULE_ID}:state_change`);
}

const rotate = (e, img, id, classStr) => {
    if (mouseDown === true) {
        let cRect = document.getElementsByClassName(classStr)[0].getBoundingClientRect();
        let centerX = (cRect.left) + (cRect.width / 2);
        let centerY = (cRect.top) + (cRect.height / 2);
        let mouseX;
        let mouseY;
        if (!touch) {
            mouseX = e.pageX;
            mouseY = e.pageY;
        } else {
            mouseX = e.originalEvent.changedTouches[0].clientX;
            mouseY = e.originalEvent.changedTouches[0].clientY;
        }
        let radians = Math.atan2(mouseX - centerX, mouseY - centerY);
        symbolState[id].rotation = (radians * (180 / Math.PI) * -1) + 135;
        img.css('transform', 'rotate(' + symbolState[id].rotation.toString() + 'deg) scale(' + symbolState[id].scale.toString() + ')');
    }
}
const scale = (e, img, id, classStr) => {
    if (mouseDown === true) {
        let cRect = document.getElementsByClassName(classStr)[0].getBoundingClientRect();
        let centerX = (cRect.left) + (cRect.width / 2);
        let centerY = (cRect.top) + (cRect.height / 2);
        let mouseX;
        let mouseY;
        if (!touch) {
            mouseX = e.pageX;
            mouseY = e.pageY;
        } else {
            mouseX = e.originalEvent.changedTouches[0].clientX;
            mouseY = e.originalEvent.changedTouches[0].clientY;
        }
        let a = (mouseX - centerX);
        let b = (mouseY - centerY);
        let c = Math.sqrt(a * a + b * b);
        symbolState[id].scale = (c / 40);
        img.css('transform', 'rotate(' + symbolState[id].rotation.toString() + 'deg) scale(' + symbolState[id].scale.toString() + ')');
    }
}

const symbolWrapper = $(`<div class="symbols-lib drag-marker" draggable="true"></div>`);

/**
 *
 * @param e
 */
const handleDragEnd = (e) => {
    e.preventDefault();
    let map = cloud.get().map;
    let innerHtml = $(e.target).clone().html();
    let id = (+new Date * (Math.random() + 1)).toString(36).substr(2, 5);
    let coord = map.mouseEventToLatLng(e);
    createSymbol(innerHtml, id, coord);
}

/**
 *
 * @param innerHtml
 * @param id
 * @param coord
 * @param ro
 * @param sc
 */
const createSymbol = (innerHtml, id, coord, ro = 0, sc = 1) => {
    let map = cloud.get().map;
    let classStr = "dm_" + id;
    let rotateHandleStr = "r_" + id;
    let deleteHandleStr = "d_" + id;
    let scaleHandleStr = "s_" + id;
    let outerHtml = $(symbolWrapper).html(innerHtml);
    outerHtml.removeClass("symbols-lib");
    outerHtml.addClass("symbols-map");
    outerHtml.attr("draggable", "false")
    outerHtml.addClass(classStr);
    outerHtml.append(`<div class="symbols-handles symbols-rotate ${rotateHandleStr}"></div>`);
    outerHtml.append(`<div class="symbols-handles symbols-delete ${deleteHandleStr}" id="${id}"></div>`);
    outerHtml.append(`<div class="symbols-handles symbols-scale ${scaleHandleStr}"></div>`);
    let icon = L.divIcon({
        className: "drag-symbole",
        iconSize: new L.Point(72, 72),
        // iconAnchor: [26, 26],
        html: `${outerHtml[0].outerHTML}`
    });
    markers[id] = L.marker(coord, {icon: icon, draggable: true}).addTo(map);
    symbolState[id] = {};
    symbolState[id].svg = innerHtml;
    symbolState[id].coord = markers[id].getLatLng();
    markers[id].on("moveend", () => {
        symbolState[id].coord = markers[id].getLatLng();
        store(id);
    })
    symbolState[id].rotation = ro;
    symbolState[id].scale = sc;

    store(id);
    let img = $(`.${classStr}`);
    let rotateHandle = $(`.${rotateHandleStr}`);
    let deleteHandle = $(`.${deleteHandleStr}`);
    let scaleHandle = $(`.${scaleHandleStr}`);

    // Init scale and rotation
    img.css('transform', 'rotate(' + symbolState[id].rotation.toString() + 'deg) scale(' + symbolState[id].scale.toString() + ')');

    // Attach events
    deleteHandle.on("click touchend", function (e) {
        e.preventDefault();
        map.removeLayer(markers[id]);
        delete markers[e.target.id];
        delete symbolState[e.target.id];
        store(id);
    });
    rotateHandle.on("touchstart mousedown", function (e) {
        e.preventDefault();
        touch = e.type === "touchstart";
        mouseDown = true;
        markers[id].dragging.disable();
        map.dragging.disable();
        map.touchZoom.disable();
        $(document).on("touchmove mousemove", (e) => {
            rotate(e, img, id, classStr);
        });
    });
    scaleHandle.on("touchstart mousedown", function (e) {
        e.preventDefault();
        touch = e.type === "touchstart";
        mouseDown = true;
        markers[id].dragging.disable();
        map.dragging.disable();
        map.touchZoom.disable();
        $(document).on("touchmove mousemove", (e) => {
            scale(e, img, id, classStr);
        });
    });
}

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
        state = o.state;
        backboneEvents = o.backboneEvents;
        _self = this;
        return this;
    },

    /**
     *
     */
    init: function () {
        let map = cloud.get().map;
        state.listenTo(MODULE_ID, _self);
        state.listen(MODULE_ID, `state_change`);

        state.getModuleState(MODULE_ID).then(initialState => {
            _self.applyState(initialState)
        });

        utils.createMainTab(exId, __("Symboles"), __("Info"), require('./../../../browser/modules/height')().max, "photo_camera", false, exId);
        $(`#${exId}`).append(dom);

        $(".drag-marker").on("dragend", handleDragEnd)

        let markerElement = $($(".symbols-lib")[1]).clone().html();


        $(document).on("touchend mouseup", function (e) {
            for (const id in symbolState) {
                markers[id].dragging.enable();
            }
            map.dragging.enable();
            map.touchZoom.enable()
            $(document).off("mousemove touchmove");
            mouseDown = false;
        });
    },
    recreateSymbolsFromState: (state)=>{
        for (const id in state) {
            createSymbol(state[id].svg, id, state[id].coord, state[id].rotation, state[id].scale);
        }
    },

    getState: () => {
        console.log(symbolState)
        return symbolState;
    },

    applyState: (newState) => {
        console.log("newState", newState)
        return new Promise((resolve) => {
            _self.recreateSymbolsFromState(newState);
            resolve();
        });
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

