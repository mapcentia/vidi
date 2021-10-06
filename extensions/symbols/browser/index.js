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
let mouseDown = false;
let touch = false;
let idBeingChanged = false;
let creatingFromState = false;
let filesAreLoaded = false;
let autoScale = false;
let locked = false;
const urlparser = require('./../../../browser/modules/urlparser');
const db = urlparser.db;
const MODULE_ID = exId;
const config = require('../../../config/config.js');

/**
 *
 * @type {*|exports|HTMLElement}
 */
const symbolWrapper = $(`<div class="symbols-lib drag-marker" draggable="true"></div>`);

/**
 *
 * @returns {string}
 */
const createId = () => (+new Date * (Math.random() + 1)).toString(36).substr(2, 5);

/**
 *
 * @type {{outer: string, inner: string}}
 */
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

/**
 *
 */
const store = () => {
    $.ajax({
        url: '/api/symbols/' + db,
        data: JSON.stringify(symbolState),
        contentType: "application/json; charset=utf-8",
        scriptCharset: "utf-8",
        dataType: 'json',
        type: "POST",
        success: function (response) {
        }
    });
}

const setState = () => {
    backboneEvents.get().trigger(`${MODULE_ID}:state_change`);
}

/**
 *
 * @param c
 * @returns {DOMRect}
 */
const getRect = (c) => document.getElementsByClassName(c)[0].getBoundingClientRect();

/**
 *
 * @param e
 * @param img
 * @param id
 * @param classStr
 */
const rotate = (e, img, id, classStr) => {
    if (mouseDown === true) {
        let cRect = getRect(classStr);
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

/**
 *
 * @param e
 * @param img
 * @param id
 * @param classStr
 */
const scale = (e, img, id, classStr) => {
    if (mouseDown === true) {
        let cRect = getRect(classStr);
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

/**
 *
 * @param e
 */
const handleDragEnd = (e) => {
    e.preventDefault();
    if (locked) {
        alert(__("Locked"));
        return;
    }
    let map = cloud.get().map;
    let innerHtml = $(e.target).clone().html();
    let id = createId();
    let coord = map.mouseEventToLatLng(e);
    let file =  $(e.target).attr("data-file");
    createSymbol(innerHtml, id, coord, 0, 1, map.getZoom(), file);
}

/**
 *
 * @param innerHtml
 * @param id
 * @param coord
 * @param ro
 * @param sc
 * @param zoomLevel
 * @param file
 */
const createSymbol = (innerHtml, id, coord, ro = 0, sc = 1, zoomLevel, file) => {
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
    symbolState[id].file = file;
    markers[id].on("moveend", () => {
        symbolState[id].coord = markers[id].getLatLng();
        idBeingChanged = id;
    })
    symbolState[id].rotation = ro;
    symbolState[id].scale = sc;

    if (!creatingFromState) {
        setState();
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
        setState();
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
            _self.resetState();
        });

        backboneEvents.get().on(`off:all`, () => {
            // _self.control(false);
            // _self.off();
        });

        utils.createMainTab(exId, __("Symbols"), __("Info"), require('./../../../browser/modules/height')().max, "local_florist", false, exId);

        const gui = `
                    <div class="form-inline">
                        <div class="form-group">
                            <div class="togglebutton">
                                <label>
                                    <input id="vidi-symbols-lock" type="checkbox">${__("Lock")}
                                </label>
                            </div>
                        </div>
                        <div class="form-group">
                            <div class="togglebutton">
                                <label>
                                    <input id="vidi-symbols-autoscale" type="checkbox">${__("Auto scale")}
                                </label>
                            </div>
                        </div>
                        <div class="form-group">
                            <button class="btn" id="vidi-symbols-store">${__("Save in db")}</button>
                        </div>
                    </div>
                    <div id="vidi_symbols"></div>
                    `
        $(`#${exId}`).html(gui);

        $("#vidi-symbols-autoscale").on("change", (e) => {
            autoScale = e.target.checked;
            setState();
        })

        $("#vidi-symbols-lock").on("change", (e) => {
            locked = e.target.checked;
            if (locked) {
                _self.lock();
            } else {
                _self.unlock();
            }
            setState();
        })

        let symbols = {};
        let files = config.extensionConfig.symbols.files;
        let i = 0;

        backboneEvents.get().on(`on:${exId}`, () => {
            if (!filesAreLoaded) {
                (function iter() {
                    $.getJSON("/api/symbols/" + files[i].file, (data) => {
                        symbols[files[i].title] = data;
                        i++;
                        if (i === files.length) {
                            try {
                                let inner = $(htmlFragments.inner);
                                let tabs = $(`<ul class="nav nav-tabs"></ul>`);
                                let tabPanes = $(`<div class="tab-content"></div>`);
                                let first = true;

                                for (const group in symbols) {
                                    let outer = $(htmlFragments.outer).clone();
                                    let id = createId();
                                    for (const id in symbols[group]) {
                                        if (id && symbols[group].hasOwnProperty(id)) {
                                            let svg = $(inner.clone()[0]).append(symbols[group][id].svg);
                                            svg.attr('data-file', id);
                                            outer.find('.row')[0].append(svg[0]);
                                        }
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

                                let c = $(`#vidi_symbols`);
                                c.append(tabs);
                                c.append(tabPanes);
                                $(".drag-marker").on("dragend", handleDragEnd);
                                filesAreLoaded = true;
                            } catch (e) {
                                console.error(e.message);
                            }
                        } else {
                            iter()
                        }
                    })
                }())
            }
        });

        $('#vidi-symbols-store').on('click', store);

        $(document).on("touchend mouseup", function () {
            for (const id in symbolState) {
                if (!locked) {
                    markers[id].dragging.enable();
                }
            }
            map.dragging.enable();
            map.touchZoom.enable();
            if (idBeingChanged) {
                setState();
            }
            $(document).off("mousemove touchmove");
            mouseDown = false;
            idBeingChanged = false;
        });

        map.on("zoomend", () => {
            let currZoom = map.getZoom();
            // Auto scale
            if (autoScale) {
                for (const id in symbolState) {
                    if (id && symbolState.hasOwnProperty(id)) {
                        let scale = symbolState[id].scale;
                        let diff = prevZoom - currZoom;
                        for (let i = 0; i < Math.abs(diff); i++) {
                            scale = diff < 0 ? symbolState[id].scale * 2 : symbolState[id].scale / 2;
                            symbolState[id].scale = scale;
                        }
                        $($(`.dm_${id}`)[0]).css('transform', 'rotate(' + (symbolState[id].rotation).toString() + 'deg) scale(' + scale.toString() + ')');
                        backboneEvents.get().trigger(`${MODULE_ID}:state_change`);
                    }
                }
            }
            prevZoom = currZoom;
        })
    },

    /**
     *
     * @param state
     */
    recreateSymbolsFromState: (state) => {
        creatingFromState = true;
        for (const id in state) {
            if (id && state.hasOwnProperty(id)) {
                const s = state[id];
                createSymbol(s.svg, id, s.coord, s.rotation, s.scale, s.zoomLevel, s.file);
            }
        }
        creatingFromState = false;
    },

    /**
     *
     * @returns {{}}
     */
    getState: () => {
        return {
            symbolState: symbolState,
            autoScale: autoScale,
            locked: locked
        };
    },

    /**
     *
     * @param newState
     * @returns {Promise<unknown>}
     */
    applyState: (newState) => {
        return new Promise((resolve) => {
            _self.resetState();
            if (newState) {
                _self.recreateSymbolsFromState(newState.symbolState);
                autoScale = newState.autoScale;
                $("#vidi-symbols-autoscale").prop("checked", newState.autoScale);
                locked = newState.locked;
                $("#vidi-symbols-lock").prop("checked", newState.locked);
                if (locked) {
                    _self.lock();
                }
            }
            backboneEvents.get().trigger(`${MODULE_ID}:state_change`);
            resolve();
        });
    },

    /**
     *
     */
    resetState: () => {
        mouseDown = false;
        touch = false;
        idBeingChanged = false;
        creatingFromState = false;
        autoScale = false;
        locked = false;
        $("#vidi-symbols-autoscale").prop("checked", false);
        _self.removeSymbols();
    },

    /**
     *
     */
    removeSymbols: () => {
        let map = cloud.get().map;
        for (const id in symbolState) {
            map.removeLayer(markers[id]);
        }
        markers = {};
        symbolState = {};
    },

    /**
     *
     */
    lock: () => {
        for (const id in symbolState) {
            markers[id].dragging.disable();
        }
        $(".symbols-handles").hide()
    },

    /**
     *
     */
    unlock: () => {
        for (const id in symbolState) {
            markers[id].dragging.enable();
        }
        $(".symbols-handles").show()
    }
};
