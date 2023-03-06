/*
 * @author     Alexander Shumilov
 * @copyright  2013-2018 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

'use strict';

const MODULE_NAME = `mapcontrols`;

/**
 * @type {*|exports|module.exports}
 */
let state, cloud, setting, backboneEvents;

let clearMapControl, fullScreenMapControl, defaultMapExtentControl;

let _self = false;

let embedModeIsEnabled = false;
let utils;
let anchor;

/**
 * Full screen map control
 */
const FullScreenMapControlOptions = {
    template: (`<a title="${__(`Full screen`)}"
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
        let container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom embed-full-screen');
        $(container).append(FullScreenMapControlOptions.template)[0].onclick = FullScreenMapControlOptions.onclick;
        return container;
    }
});

/**
 * Clear map control
 */
const ClearMapControlOptions = {
    template: (`<a title="${__(`Clear map`)}"
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
        // $(container).attr(`style`, `backgroundColor: white, width: 30px, height: 30px`);
        $(container).append(ClearMapControlOptions.template)[0].onclick = ClearMapControlOptions.onclick;
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
    template: (`<a title="${__(`Default map extent`)}"
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
        $(`.leaflet-control-zoom.leaflet-bar`).prepend(DefaultMapExtentControlOptions.template)[0].onclick = DefaultMapExtentControlOptions.onclick;
        return container;
    }
});

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
        _self = this;
        return this;
    },

    init: () => {
        state.listenTo(MODULE_NAME, _self);

        // Detect if the embed template is used
        if ($(`#floating-container-secondary`).length === 1) {
            embedModeIsEnabled = true;
        }

        fullScreenMapControl = new FullScreenMapControl;
        cloud.get().map.addControl(fullScreenMapControl);

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

        let historyControl = new L.HistoryControl({
            orientation: 'vertical',
            backTooltip: __(`Previous extent`),
            forwardTooltip: __(`Next extent`),
            forwardImage: "bi bi-caret-right",
            backImage: "bi bi-caret-left",
        }).addTo(cloud.get().map);

        let rubberbandControl = L.Control.boxzoom({
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
