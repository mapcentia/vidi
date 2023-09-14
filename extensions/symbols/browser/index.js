/*
 * @author     Martin Høgh <mh@mapcentia.com>
 * @copyright  2013-2023 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

'use strict';

import {polyfill} from "mobile-drag-drop";
import {scrollBehaviourDragImageTranslateOverride} from 'mobile-drag-drop/scroll-behaviour'


let utils;
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
const exId = "symbols";
const urlparser = require('./../../../browser/modules/urlparser');
const db = urlparser.db;
const MODULE_ID = exId;
const config = require('../../../config/config.js');


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
        <div class="tab-pane" role="tabpanel">
            <div class="symbols-cover-text position-absolute" style="top: 50%; left: 50px; display: none; opacity: 0; font-weight: 600; color: #333333">Zoom tættere på</div>
            <div class="symbols-cover position-relative">
                <div class="d-flex flex-wrap gap-4"></div>
            </div>
            <div class="symbols-desc"></div>
        </div>
    `,
    "inner": `
            <div class="symbols-lib drag-marker" draggable="true"></div>
    `
}

/**
 *
 */
const store = (tag) => {
    return new Promise((resolve, reject) => {
        fetch('/api/symbols/' + db, {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                browserId: window?._browserId || null,
                userId: window?._userId || null,
                props: window?._props || null,
                tag,
                symbolState
            }),
        }).then(res => {
            if (!res.ok) {
                reject(res);
            }
            res.json().then(json => {
                resolve(json);
            })
        });
    })
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
    // const svg = e.target.querySelector("svg-container").shadowRoot.innerHTML;
    const svg = e.target.querySelector("svg-container").innerHTML;
    const targetElements = document.elementsFromPoint(e.clientX, e.clientY);
    // Don't do anything if symbols is dropped on container
    for (let i = 0; i < targetElements.length; i++) {
        if (targetElements[i].id === "symbols") {
            return;
        }
    }
    e.preventDefault();
    if (locked) {
        alert(__("Locked"));
        return;
    }
    let map = cloud.get().map;
    let id = createId();
    let coord = map.mouseEventToLatLng(e);
    let file = $(e.target).attr("data-file");
    let group = $(e.target).attr("data-group");

    const validate = config?.extensionConfig?.symbols?.options?.validate;
    if (validate) {
        try {
            let func = Function('"use strict";return (' + validate + ')')();
            if (!func(file, group, symbolState)) {
                return;
            }
        } catch (e) {
            console.error("Error in validate function:", e.message)
        }
    }

    let onlyOne = config?.extensionConfig?.symbols?.symbolOptions?.[file]?.onlyOne;
    if (onlyOne === undefined) {
        onlyOne = config?.extensionConfig?.symbols?.options?.onlyOne;
    }
    if (onlyOne === true) {
        for (const id in symbolState) {
            if (id && symbolState.hasOwnProperty(id)) {
                if (symbolState[id].file === file) {
                    alert("Symbolet kan kun indsættes en gang");
                    return;
                }
            }
        }
    }
    createSymbol(svg, id, coord, 0, 1, map.getZoom(), file, group);
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
 * @param group
 */
const createSymbol = (innerHtml, id, coord, ro = 0, sc = 1, zoomLevel, file, group) => {
    let map = cloud.get().map;
    let func;
    let classStr = "dm_" + id;
    let rotateHandleStr = "r_" + id;
    let deleteHandleStr = "d_" + id;
    let scaleHandleStr = "s_" + id;
    let html = `<div class="drag-marker symbols-map ${classStr}" draggable="false">`;
    let callback = config?.extensionConfig?.symbols?.symbolOptions?.[file]?.callback;
    if (callback === undefined) {
        callback = config?.extensionConfig?.symbols?.options?.callback;
    }
    if (callback) {
        try {
            func = Function('"use strict";return (' + callback + ')')();
        } catch (e) {
            console.error("Error in callback for " + file, e.message)
        }
    }
    let doRotate = config?.extensionConfig?.symbols?.symbolOptions?.[file]?.rotate
    let doScale = config?.extensionConfig?.symbols?.symbolOptions?.[file]?.scale
    let doDelete = config?.extensionConfig?.symbols?.symbolOptions?.[file]?.delete
    if (doRotate === undefined) {
        doRotate = config?.extensionConfig?.symbols?.options?.rotate;
    }
    if (doScale === undefined) {
        doScale = config?.extensionConfig?.symbols?.options?.scale;
    }
    if (doDelete === undefined) {
        doDelete = config?.extensionConfig?.symbols?.options?.delete;
    }

    if (doRotate || doRotate === undefined) {
        html += `<div class="symbols-handles symbols-rotate ${rotateHandleStr}"></div>`;
    }
    if (doScale || doScale === undefined) {
        html += `<div class="symbols-handles symbols-scale ${scaleHandleStr}"></div>`;
    }
    if (doDelete || doDelete === undefined) {
        html += `<div class="symbols-handles symbols-delete ${deleteHandleStr}" id="${id}"></div>`;
    }
    html += `<svg-container>${innerHtml}</svg-container>`;
    html += `</div>`;
    let icon = L.divIcon({
        className: "drag-symbole",
        iconSize: new L.Point(50, 50),
        iconAnchor: [25, 25],
        html: html
    });
    markers[id] = L.marker(coord, {icon: icon, draggable: true}).addTo(map);
    symbolState[id] = {};
    symbolState[id].zoomLevel = zoomLevel;
    symbolState[id].svg = innerHtml;
    symbolState[id].coord = markers[id].getLatLng();
    symbolState[id].file = file;
    symbolState[id].group = group;
    markers[id].on("movestart", () => {
        idBeingChanged = id;
    })
    markers[id].on("moveend", () => {
        symbolState[id].coord = markers[id].getLatLng();
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
        try {
            func(file, group, symbolState, "delete");
        } catch (e) {
            console.error("Error in callback for " + file, e.message)
        }
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

    if (callback) {
        try {
            let func = Function('"use strict";return (' + callback + ')')();
            func(file, group, symbolState, "create");
        } catch (e) {
            console.error("Error in callback for " + file, e.message)
        }
    }
}

/**
 * Custom shadow DOM element for encapsulating SVG
 */
class SVGContainer extends HTMLElement {
    constructor() {
        super();
        const shadowRoot = this.attachShadow({mode: 'open'});
        shadowRoot.append(...this.childNodes);
    }
}
//customElements.define('svg-container', SVGContainer);
customElements.define("svg-container", ()=>{}, { extends: "div" });


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

        utils.createMainTab(exId, __("Symbols"), __("Info"), require('./../../../browser/modules/height')().max, "bi bi-flower1", false, exId);

        const gui = `
                      <div class="symbol-tools d-flex gap-4 align-items-center mb-4">
                            <div class="form-check form-switch">
                                <label >
                                    <input id="vidi-symbols-lock" class="form-check-input" type="checkbox">${__("Lock")}
                                </label>
                            </div>
                            <div class="form-check form-switch">
                                <label class="form-check-label">
                                    <input id="vidi-symbols-autoscale" class="form-check-input" type="checkbox">${__("Auto scale")}
                                </label>
                            </div>
                            <button class="btn btn-primary d-none" id="vidi-symbols-store">${__("Save in db")}</button>
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
        let descs = {};
        let files = config.extensionConfig.symbols.files;
        let i = 0;

        // backboneEvents.get().on(`on:${exId}`, () => {
        if (!filesAreLoaded) {
            (function iter() {
                $.getJSON("/api/symbols/" + files[i].file, (data) => {
                    symbols[files[i].title] = data;
                    descs[files[i].title] = files[i]?.desc;
                    i++;
                    if (i === files.length) {
                        try {
                            let inner = $(htmlFragments.inner);
                            let tabs = $(`<ul class="nav nav-pills mb-3"></ul>`);
                            let tabPanes = $(`<div class="tab-content"></div>`);
                            let first = true;
                            let u = 0;
                            for (const group in symbols) {
                                let outer = $(htmlFragments.outer).clone();
                                if (descs[group]) $(outer.find('.symbols-desc')[0]).append(`${descs[group]}`);
                                let id = createId();
                                for (const id in symbols[group]) {
                                    if (id && symbols[group].hasOwnProperty(id)) {
                                        const parser = new DOMParser();
                                        const doc = parser.parseFromString(symbols[group][id].svg, "image/svg+xml");
                                        let text = doc.getElementsByTagName("desc")?.[0]?.textContent
                                        let desc = text || '';
                                        let svg = $(inner.clone()[0]).append(`<svg-container>${symbols[group][id].svg}</svg-container>`);
                                        svg.attr('data-file', id);
                                        svg.attr('data-group', group);
                                        let e = $('<div class="p-1 text-center symbol-text-wrapper">');
                                        e.append(svg[0], `<div style="font-size: 8pt">${desc}</div>`)
                                        outer.find('.d-flex').append(e);
                                    }
                                }
                                let tab = $(`<li class="nav-item" role="presentation"><a id="symbol-tab-${u}" data-bs-toggle="pill" class="nav-link ` + (first ? ` active` : ``) + `" href="#_${id}" role="tab" data-toggle="tab">${group}</a></li>`);
                                tabs.append(tab)
                                tabPanes.append(outer);
                                outer.attr('id', '_' + id);
                                if (first) {
                                    outer.addClass('active');
                                    tab.addClass('active');
                                    first = false;
                                }
                                u++;
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
        // }
        // );


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
                createSymbol(s.svg, id, s.coord, s.rotation, s.scale, s.zoomLevel, s.file, s.group);
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
            if (config?.extensionConfig?.symbols?.stateless === true) {
                resolve();
                return;
            }
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
        locked = true;
        for (const id in symbolState) {
            markers[id].dragging.disable();
        }
        $(".symbols-handles").hide()
    },

    /**
     *
     */
    unlock: () => {
        locked = false;
        for (const id in symbolState) {
            markers[id].dragging.enable();
        }
        $(".symbols-handles").show()
    },

    createSymbol: (innerHtml, id, coord, ro, sc, zoom, file, group) => {
        createSymbol(innerHtml, id, coord, 0, 1, zoom, file, group);
    },

    createId: () => {
        return createId();
    },

    store
};
