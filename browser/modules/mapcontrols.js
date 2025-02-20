/*
 * @author     Alexander Shumilov
 * @copyright  2013-2023 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

'use strict';

const MODULE_NAME = `mapcontrols`;

let state, cloud, setting, backboneEvents;
let clearMapControl, fullScreenMapControl, defaultMapExtentControl, baselayerToggleControl, baselayerDrawerControl, googleDirectionsMapControl;
let _self = false;
let embedModeIsEnabled = false;
let utils;
let anchor;
let setBaseLayer;
let toggledBaselayer = 0;

/**
 * Full screen map control
 */
const FullScreenMapControlOptions = {
    template: (`<a href="#" title="${__(`Full screen`)}"
        id="mapcontrols-full-screen-map"
        class="leaflet-bar-part leaflet-bar-part-single">
        <span class="bi bi-fullscreen"></span>
    </a>`),
    onclick: (e) => {
        e.stopPropagation();
    }
};

let FullScreenMapControl = L.Control.extend({
    options: {position: 'topright'},
    onAdd: () => {
        let container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom full-screen-btn');
        let el = $(container).append(FullScreenMapControlOptions.template)[0];
        L.DomEvent.disableClickPropagation(el);
        el.onclick = FullScreenMapControlOptions.onclick;
        return container;
    }
});

/**
 * Clear map control
 */
const ClearMapControlOptions = {
    template: (`<a href="#" title="${__(`Clear map`)}"
        id="mapcontrols-clear-map"
        class="leaflet-bar-part leaflet-bar-part-single" style="outline: none;">
        <span class="bi bi-slash-circle"></span>
    </a>`),
    onclick: (e) => {
        e.stopPropagation();
        backboneEvents.get().trigger(`reset:infoClick`);
        backboneEvents.get().trigger(`reset:advancedInfo`);
        state.resetState([`draw`, `measurements`]);
        setTimeout(() => {
            // Detect which module is now active and reactivate it
            $('#main-tabs > li[class="active"] > a').trigger('click');
        }, 100);
    }
};
let ClearMapControl = L.Control.extend({
    options: {position: 'topright'},
    onAdd: () => {
        let container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom leaflet-clear-map');
        let el = $(container).append(ClearMapControlOptions.template)[0];
        L.DomEvent.disableClickPropagation(el);
        el.onclick = ClearMapControlOptions.onclick;
        return container;
    }
});

const setDefaultZoomCenter = () => {
    let hashArr = [];
    const arr = window.vidiConfig?.initZoomCenter ? utils.parseZoomCenter(window.vidiConfig.initZoomCenter) : null;
    if (arr) {
        hashArr[1] = arr.z;
        hashArr[2] = arr.x;
        hashArr[3] = arr.y;
    }
    if (hashArr[1] && hashArr[2] && hashArr[3]) {
        const p = geocloud.transformPoint(hashArr[2], hashArr[3], "EPSG:4326", "EPSG:3857");
        cloud.get().zoomToPoint(p.x, p.y, hashArr[1]);
    } else {
        let parameters = anchor.getInitMapParameters();
        if (parameters) {
            cloud.get().setView(new L.LatLng(parseFloat(parameters.y), parseFloat(parameters.x)), parameters.zoom);
        } else {
            cloud.get().zoomToExtent(setting.getExtent());
        }
    }

}

/**
 * Default map extent control
 */
const DefaultMapExtentControlOptions = {
    template: (`<a href="#" title="${__(`Default map extent`)}"
        id="mapcontrols-default-map-extent"
        class="leaflet-bar-part leaflet-bar-part-single" style="outline: none;">
        <span class="bi bi-house"></span>
    </a>`),
    onclick: setDefaultZoomCenter
};

let DefaultMapExtentControl = L.Control.extend({
    options: {position: 'topright'},
    onAdd: () => {
        let container = L.DomUtil.create('div', '');
        let el = $(`.leaflet-control-zoom.leaflet-bar`).prepend(DefaultMapExtentControlOptions.template)[0];
        L.DomEvent.disableClickPropagation(el);
        el.onclick = DefaultMapExtentControlOptions.onclick;
        return container;
    }
});

let BaselayerToggleOptions, BaselayerDrawerOptions;

/**
 *
 * @type {{set: module.exports.set, init: module.exports.init}}
 */
module.exports = {
    set: function (o) {
        cloud = o.cloud;
        backboneEvents = o.backboneEvents;
        setting = o.setting;
        state = o.state;
        utils = o.utils;
        anchor = o.anchor;
        setBaseLayer = o.setBaseLayer;
        _self = this;
        return this;
    },

    init: () => {
        state.listenTo(MODULE_NAME, _self);

        backboneEvents.get().once("allDoneLoading:layers", () => {
                const currentBaseLayerId = setBaseLayer.getActiveBaseLayer()?.id;
                const baseLayers = window.vidiConfig.baseLayers;
                toggledBaselayer = baseLayers.findIndex(x => x.id === currentBaseLayerId);
                BaselayerToggleOptions = {
                    template: (`<a href="#" title="${window.vidiConfig.baseLayers?.[toggledBaselayer === 0 ? 1 : 0]?.name}"
                        id="baselayer-toggle"
                        class="leaflet-bar-part leaflet-bar-part-single overflow-hidden">
                        <img alt="" src="${window.vidiConfig.baseLayers?.[toggledBaselayer === 0 ? 1 : 0]?.thumbnail}"></a>`),
                    onclick: (e) => {
                        e.target.src = window.vidiConfig.baseLayers?.[toggledBaselayer]?.thumbnail;
                        e.target.parentElement.title = window.vidiConfig.baseLayers?.[toggledBaselayer]?.name;
                        toggledBaselayer = toggledBaselayer === 0 ? 1 : 0
                        setBaseLayer.init(window.vidiConfig.baseLayers?.[toggledBaselayer]?.id);
                    }
                };
                let BaselayerToggleControl = L.Control.extend({
                    options: {position: 'topright'},
                    onAdd: () => {
                        let container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom baselayer-toggle baselayer-tool');
                        let el = $(container).append(BaselayerToggleOptions.template)[0];
                        L.DomEvent.disableClickPropagation(el);
                        el.onclick = BaselayerToggleOptions.onclick;
                        return container;
                    }
                })

                // Start of drawer
                let BaselayerDrawerControl;
                let drawerItems = [];
                let template;
                window.vidiConfig.baseLayers.forEach((v, i) => {
                    if (v?.inDrawer) {
                        drawerItems.push(`
                            <a href="#" title="${v?.name}}" class="position-relative baselayer-drawer-item leaflet-bar-part leaflet-bar-part-single overflow-hidden d-flex">
                            <img style="height: 30px; width: 30px" data-vidi-baselayer-id="${v.id}" data-vidi-baselayer-num="${i}" alt="" src="${v?.thumbnail}">
                            <div class="${currentBaseLayerId !== v.id ? 'd-none' : ''} baselayer-drawer-item-shadow"></div>
                            </a>
                            `
                        )
                    }
                })
                template = `<div class="d-flex">
                        <div class="baselayer-drawer-container d-flex d-none">${drawerItems.join('')}</div>
                        <a href="#" title="${__('Base layer')}" class="leaflet-bar-part leaflet-bar-part-single baselayer-drawer">
                            <span class="bi bi-map baselayer-drawer"></span> 
                        </a>
                    </div>`;
                BaselayerDrawerOptions = {
                    template: template,
                    onclick: (e) => {
                        const cl = document.querySelector('.baselayer-drawer-container').classList;
                        if (e.target.classList.contains('baselayer-drawer')) {
                            if (cl.contains('d-none')) {
                                cl.remove('d-none')
                            } else {
                                cl.add('d-none');
                            }
                        } else {
                            const el = e.target;
                            const id = el.dataset.vidiBaselayerId;
                            document.querySelectorAll('.baselayer-drawer-item-shadow').forEach(node => node.classList.add('d-none'))
                            el.nextElementSibling.classList.remove('d-none')
                            setBaseLayer.init(id);
                        }
                    }
                };
                BaselayerDrawerControl = L.Control.extend({
                    options: {position: 'topright'},
                    onAdd: () => {
                        let container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom baselayer-drawer baselayer-tool');
                        let el = $(container).append(BaselayerDrawerOptions.template)[0];
                        L.DomEvent.disableClickPropagation(el);
                        el.onclick = BaselayerDrawerOptions.onclick;
                        return container;
                    }
                })

                if (window.vidiConfig.baselayerDrawer) {
                    baselayerDrawerControl = new BaselayerDrawerControl();
                    cloud.get().map.addControl(baselayerDrawerControl);
                } else {
                    baselayerToggleControl = new BaselayerToggleControl();
                    cloud.get().map.addControl(baselayerToggleControl);
                }
            }
        )

        // Detect if the embed template is used
        if ($(`#floating-container-secondary`).length === 1) {
            embedModeIsEnabled = true;
        }

        if (document.documentElement.requestFullscreen) {
            fullScreenMapControl = new FullScreenMapControl;
            cloud.get().map.addControl(fullScreenMapControl);
        }

        $('#mapcontrols-full-screen-map').on('click', function (e) {
            e.preventDefault();
            utils.toggleFullScreen();
        });
        // Listen for fullscreen changes
        document.addEventListener('fullscreenchange', function () {
            const b = $('#mapcontrols-full-screen-map span');
            if (document.fullscreenElement) {
                b.addClass('bi-fullscreen-exit');
                b.removeClass('bi-fullscreen');
            } else {
                b.addClass('bi-fullscreen');
                b.removeClass('bi-fullscreen-exit');
            }
        });

        clearMapControl = new ClearMapControl();
        cloud.get().map.addControl(clearMapControl);

        defaultMapExtentControl = new DefaultMapExtentControl();
        cloud.get().map.addControl(defaultMapExtentControl);

        L.simpleMapScreenshoter(
            {
                position: 'topright',
                screenName: 'Screenshot',
                hideElementsWithSelectors: ['.leaflet-top.leaflet-right'],
            }
        ).addTo(cloud.get().map);
        cloud.get().map.on("simpleMapScreenshoter.done", () => {
            utils.showInfoToast(__("Screenshot is ready"), {delay: 2000, autohide: true})
        });
        cloud.get().map.on('simpleMapScreenshoter.error', () => {
            alert("Something went wrong");
            resetPrintBtn();
        });

        const printBtnEl = document.querySelector(".leaflet-control-simpleMapScreenshoter a");
        // Without href, the button will get en blinking cursor in Edge!
        printBtnEl.setAttribute('href', '#')
        printBtnEl.title = __("Create a screenshot of the map. The screenshot is downloaded as a PNG file");
        const resetPrintBtn = () => printBtnEl.innerHTML = "<span class='bi bi-camera'></span>";
        resetPrintBtn();

        new L.HistoryControl({
            orientation: 'vertical',
            backTooltip: __(`Previous extent`),
            forwardTooltip: __(`Next extent`),
            forwardImage: "bi bi-caret-right",
            backImage: "bi bi-caret-left",
        }).addTo(cloud.get().map);

        L.Control.boxzoom({
            position: 'topright',
            iconClasses: 'bi bi-bounding-box',
            title: __(`Click here then draw a square on the map, to zoom in to an area`),
            enableShiftDrag: true,
            keepOn: true
        }).addTo(cloud.get().map);

        const zoomIn = document.querySelector(".leaflet-control-zoom-in span");
        zoomIn.innerHTML = "";
        zoomIn.classList.add("bi");
        zoomIn.classList.add("bi-plus");

        const zoomOut = document.querySelector(".leaflet-control-zoom-out span");
        zoomOut.innerHTML = "";
        zoomOut.classList.add("bi");
        zoomOut.classList.add("bi-dash");
    },

    /**
     * Returns current module state
     */
    getState: () => {
        return {};
    },

    /**
     * Applies externally provided state
     */
    applyState: () => {
        return new Promise((resolve) => {
            resolve();
        });
    },

    setDefaultZoomCenter
};
