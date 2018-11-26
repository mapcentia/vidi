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
let state, cloud, setting;

let clearMapControl, defaultMapExtentControl;

let _self = false;

let embedModeIsEnabled = false;

const buttonsStyle = {
    
};

/**
 * Clear map control
 */
const ClearMapControlOptions = {
    template: (`<a title="${__(`Clear map`)}"
        id="mapcontrols-clear-map"
        class="leaflet-bar-part leaflet-bar-part-single" style="outline: none;">
        <span class="fa fa-minus-circle"></span>
    </a>`),
    onclick: () => {
        state.resetState([`draw`, `measurements`]);
    }
};
let ClearMapControl = L.Control.extend({
    options: { position: 'topright' },
    onAdd: () => {
        let container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
        $(container).attr(`style`, `backgroundColor: white, width: 30px, height: 30px`);
        $(container).append(ClearMapControlOptions.template)[0].onclick = ClearMapControlOptions.onclick;
        return container;
    }
});

/**
 * Default map extent control
 */
const DefaultMapExtentControlOptions = {
    template: (`<a title="${__(`Default map extent`)}"
        id="mapcontrols-default-map-extent"
        class="leaflet-bar-part leaflet-bar-part-single" style="outline: none;">
        <span class="fa fa-home"></span>
    </a>`),
    onclick: () => {
        cloud.get().zoomToExtent(setting.getExtent());
    }
};
let DefaultMapExtentControl = L.Control.extend({
    options: { position: 'topright' },
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
        setting = o.setting;
        state = o.state;
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
            let buttonStyle = `padding-top: 4px;`;

            let container = `#floating-container-secondary`;

            $(container).append($(ClearMapControlOptions.template).attr(`class`, buttonClass).attr(`style`, `padding-top: 6px;`)[0].outerHTML);
            $(container).find(`#mapcontrols-clear-map`).click(ClearMapControlOptions.onclick);

            let historyControl = new L.HistoryControl().addTo(cloud.get().map);

            $(container).append(`<a title="${__(`Previous extent`)}"
                id="mapcontrols-history-backward"
                class="${buttonClass}" style="padding-top: 6px; color: lightgray;">
                <span class="fa fa-chevron-left"></span>
            </a>`);

            $(container).append(`<a title="${__(`Next extent`)}"
                id="mapcontrols-history-forward"
                class="${buttonClass}" style="padding-top: 6px; color: lightgray;">
                <span class="fa fa-chevron-right"></span>
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
                position:'topright',
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
};