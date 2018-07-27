/**
 * @fileoverview Description of file, its uses and information
 * about its dependencies.
 */

'use strict';

const MODULE_NAME = `measurements`;

/**
 * @type {*|exports|module.exports}
 */
let cloud, state;

/**
 *
 * @type {L.FeatureGroup}
 */
let drawnItems = new L.FeatureGroup();

let drawLineControl, drawPolygonControl;

let _self = false;

/**
 *
 * @type {{set: module.exports.set, init: module.exports.init}}
 */
module.exports = {
    set: function (o) {
        cloud = o.cloud;
        state = o.state;
        _self = this;
        return this;
    },

    init: () => {
        state.listenTo(MODULE_NAME, _self);
        state.listen(MODULE_NAME, `update`);

        let DistanceMeasurementControl = L.Control.extend({
            options: {
                position: 'topright' 
            },
            onAdd: function (map) {
                let container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
                container.style.backgroundColor = 'white';
                container.style.width = `30px`;
                container.style.height = `30px`;
                //container.style.textAlign = `center`;
                //container.style.paddingTop = `3px`;
                container.title = `Measure distance`;

                container = $(container).append(`<a class="leaflet-bar-part leaflet-bar-part-single" style="outline: none;">
                    <span class="fa fa-ruler"></span>
                </a>`)[0];
                container.onclick = function(){
                    console.log('buttonClicked');
                }

                return container;
            }
        });

        drawLineControl = new DistanceMeasurementControl();
        cloud.get().map.addControl(drawLineControl);
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
    applyState: (newState) => {
        return new Promise((resolve, reject) => {
            resolve();
        });
    },
};

