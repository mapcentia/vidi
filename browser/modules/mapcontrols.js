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
    backgroundColor: `white`,
    width: `30px`,
    height: `30px`
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
        container.style = buttonsStyle;
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

            $(container).append($(ClearMapControlOptions.template).attr(`class`, buttonClass).attr(`style`, buttonStyle)[0].outerHTML);
            $(container).find(`#mapcontrols-clear-map`).click(ClearMapControlOptions.onclick);
        } else {
            clearMapControl = new ClearMapControl();
            cloud.get().map.addControl(clearMapControl);

            defaultMapExtentControl = new DefaultMapExtentControl();
            cloud.get().map.addControl(defaultMapExtentControl);
        }

        let historyControl = new L.HistoryControl({
            orientation: 'vertical',
            backTooltip: __(`Previous extent`),
            forwardTooltip: __(`Next extent`)
        }).addTo(cloud.get().map);
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

