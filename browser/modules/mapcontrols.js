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

let clearMapControl, defaultMapExtentControl;

let _self = false;

let embedModeIsEnabled = false;
let utils;

/**
 * Clear map control
 */
const ClearMapControlOptions = {
    template: (`<a title="${__(`Clear map`)}"
        id="mapcontrols-clear-map"
        class="leaflet-bar-part leaflet-bar-part-single" style="outline: none;">
        <span class="fa fa-minus-circle"></span>
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
        $(container).attr(`style`, `backgroundColor: white, width: 30px, height: 30px`);
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
        cloud.get().zoomToExtent(setting.getExtent());
    }

}

/**
 * Default map extent control
 */
const DefaultMapExtentControlOptions = {
    template: (`<a title="${__(`Default map extent`)}"
        id="mapcontrols-default-map-extent"
        class="leaflet-bar-part leaflet-bar-part-single" style="outline: none;">
        <span class="fa fa-home"></span>
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
        _self = this;
        return this;
    },

    init: () => {
        state.listenTo(MODULE_NAME, _self);

        // Detect if the embed template is used
        if ($(`#floating-container-secondary`).length === 1) {
            embedModeIsEnabled = true;
        }

        if (embedModeIsEnabled) {
            let buttonClass = `btn btn-default btn-fab btn-fab-mini map-tool-btn`;

            let container = `#floating-container-secondary`;

            $(container).append($(ClearMapControlOptions.template).attr(`class`, buttonClass).attr(`style`, `padding-top: 6px;`)[0].outerHTML);
            $(container).find(`#mapcontrols-clear-map`).click(ClearMapControlOptions.onclick);

            $(container).append(`<a title="${__(`Previous extent`)}"
                id="mapcontrols-history-backward"
                class="${buttonClass}" style="padding-top: 6px; color: lightgray;">
                <i class="material-icons">arrow_back_ios</i>
            </a>`);

            $(container).append(`<a title="${__(`Next extent`)}"
                id="mapcontrols-history-forward"
                class="${buttonClass}" style="padding-top: 6px; color: lightgray;">
                <i class="material-icons">arrow_forward_ios</i>
            </a>`);

            $(container).find(`#mapcontrols-clear-map`).click(ClearMapControlOptions.onclick);

            $(`#mapcontrols-history-backward`).click(() => {
                historyControl.goBack();
            });

            $(`#mapcontrols-history-forward`).click(() => {
                historyControl.goForward();
            });

            cloud.get().map.on('historybackenabled', (location) => {
                $(`#mapcontrols-history-backward`).attr(`style`, `color: black; padding-top: 6px;`);
            });
            cloud.get().map.on('historybackdisabled', (location) => {
                $(`#mapcontrols-history-backward`).attr(`style`, `color: lightgray; padding-top: 6px;`);
            });
            cloud.get().map.on('historyforwardenabled', (location) => {
                $(`#mapcontrols-history-forward`).attr(`style`, `color: black; padding-top: 6px;`);
            });
            cloud.get().map.on('historyforwarddisabled', (location) => {
                $(`#mapcontrols-history-forward`).attr(`style`, `color: lightgray; padding-top: 6px;`);
            });
        } else {
            clearMapControl = new ClearMapControl();
            cloud.get().map.addControl(clearMapControl);

            defaultMapExtentControl = new DefaultMapExtentControl();
            cloud.get().map.addControl(defaultMapExtentControl);

            let historyControl = new L.HistoryControl({
                orientation: 'vertical',
                backTooltip: __(`Previous extent`),
                forwardTooltip: __(`Next extent`)
            }).addTo(cloud.get().map);

            let rubberbandControl = L.Control.boxzoom({
                position: 'topright',
                iconClasses: 'fa fa-object-ungroup',
                title: __(`Click here then draw a square on the map, to zoom in to an area`),
                enableShiftDrag: true,
                keepOn: true
            }).addTo(cloud.get().map);
        }
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
