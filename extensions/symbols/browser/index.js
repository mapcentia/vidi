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
let idBeingChanged = false;
let creatingFromState = false;
const config = require('../../../config/config.js');

const htmlFragments = {
    "outer": `
        <div class="container tab-pane" role="tabpanel">
            <div class="row row-cols-2">
            </div>
        </div>
    `,
    "inner": `
            <div class="col symbols-lib drag-marker" draggable="true"></div>
    `
}

const store = (id) => {
    // TODO Store symbol in database
    console.log(id);
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
        idBeingChanged = id;
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
        idBeingChanged = id;
    }
}

const symbolWrapper = $(`<div class="symbols-lib drag-marker" draggable="true"></div>`);

const createId = () => (+new Date * (Math.random() + 1)).toString(36).substr(2, 5);

/**
 *
 * @param e
 */
const handleDragEnd = (e) => {
    e.preventDefault();
    let map = cloud.get().map;
    let innerHtml = $(e.target).clone().html();
    let id = createId();
    let coord = map.mouseEventToLatLng(e);
    createSymbol(innerHtml, id, coord, 0, 1, map.getZoom());
}

/**
 *
 * @param innerHtml
 * @param id
 * @param coord
 * @param ro
 * @param sc
 */
const createSymbol = (innerHtml, id, coord, ro = 0, sc = 1, zoomLevel) => {
    let map = cloud.get().map;
    let classStr = "dm_" + id;
    let rotateHandleStr = "r_" + id;
    let deleteHandleStr = "d_" + id;
    let scaleHandleStr = "s_" + id;
    let outerHtml = $(symbolWrapper).clone().html(innerHtml);
    outerHtml.removeClass("symbols-lib");
    outerHtml.removeClass("col");
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
    symbolState[id].zoomLevel = zoomLevel;
    symbolState[id].svg = innerHtml;
    symbolState[id].coord = markers[id].getLatLng();
    markers[id].on("moveend", () => {
        symbolState[id].coord = markers[id].getLatLng();
        idBeingChanged = id;
    })
    symbolState[id].rotation = ro;
    symbolState[id].scale = sc;

    if (!creatingFromState) {
        store(id);
    }
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
        let prevZoom = map.getZoom();

        state.listenTo(MODULE_ID, _self);
        state.listen(MODULE_ID, `state_change`);

        state.getModuleState(MODULE_ID).then(initialState => {
            _self.applyState(initialState)
        });

        backboneEvents.get().on(`reset:all`, () => {
            // alert()
            _self.resetState();
        });

        backboneEvents.get().on(`off:all`, () => {
            // _self.control(false);
            // _self.off();
        });

        utils.createMainTab(exId, __("Symboles"), __("Info"), require('./../../../browser/modules/height')().max, "photo_camera", false, exId);


        try {
            const symbols = config.extensionConfig.symbols.symbols;
            let inner = $(htmlFragments.inner);
            let tabs = $(`<ul class="nav nav-tabs"></ul>`);
            let tabPanes = $(`<div class="tab-content"></div>`);
            let first = true;

            for (const group in symbols) {
                let outer = $(htmlFragments.outer).clone();
                let id = createId();
                for (const id in symbols[group]) {
                    let svg = $(inner.clone()[0]).append(symbols[group][id].svg)
                    outer.find('.row')[0].append(svg[0]);
                }
                let tab = $(`<li role="presentation"><a href="#${id}" role="tab" data-toggle="tab">${group}</a></li>`);
                tabs.append(tab)
                tabPanes.append(outer);
                outer.attr('id', id);
                if (first) {
                    outer.addClass('active');
                    tab.addClass('active');
                    first = false;
                }
            }

            let c = $(`#${exId}`);
            c.append(tabs);
            c.append(tabPanes);
        } catch (e) {
            console.error(e.message);
        }


        $(".drag-marker").on("dragend", handleDragEnd);

        $(document).on("touchend mouseup", function () {
            for (const id in symbolState) {
                markers[id].dragging.enable();
            }
            map.dragging.enable();
            map.touchZoom.enable();
            if (idBeingChanged) {
                store(idBeingChanged);
            }
            $(document).off("mousemove touchmove");
            mouseDown = false;
            idBeingChanged = false;
        });

        map.on("zoomend", () => {
            let currZoom = map.getZoom();
            // Auto scale
            for (const id in symbolState) {
                if (id && symbolState.hasOwnProperty(id)) {
                    let diff = prevZoom - currZoom;
                    let scale = diff < 0 ? symbolState[id].scale * 2: symbolState[id].scale / 2;
                    symbolState[id].scale = scale;
                    $($(`.dm_${id}`)[0]).css('transform', 'rotate(' + (symbolState[id].rotation).toString() + 'deg) scale(' + scale.toString() + ')');
                    backboneEvents.get().trigger(`${MODULE_ID}:state_change`);
                }
            }
            prevZoom = currZoom;
        })
    },
    recreateSymbolsFromState: (state) => {
        creatingFromState = true;
        for (const id in state) {
            if (id && state.hasOwnProperty(id)) {
                createSymbol(state[id].svg, id, state[id].coord, state[id].rotation, state[id].scale, state[id].zoomLevel);
            }
        }
        creatingFromState = false;
    },

    getState: () => {
        return symbolState;
    },

    applyState: (newState) => {
        return new Promise((resolve) => {
            _self.resetState();
            if (newState) {
                _self.recreateSymbolsFromState(newState);
            }
            backboneEvents.get().trigger(`${MODULE_ID}:state_change`);
            resolve();

        });
    },

    resetState: () => {
        mouseDown = false;
        touch = false;
        idBeingChanged = false;
        creatingFromState = false;
        _self.removeSymbols();
    },

    removeSymbols: () => {
        let map = cloud.get().map;
        for (const id in symbolState) {
            map.removeLayer(markers[id]);
        }
        markers = {};
        symbolState = {};
    }
};



