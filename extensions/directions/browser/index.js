/*
 * @author     Martin Høgh <mh@mapcentia.com>
 * @copyright  2013-2025 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

'use strict';

let cloud;
let utils;
let backboneEvents;
let transformPoint;
let mapObj;
let clicktimer;
let active = false;
let popover;

/**
 *
 * @type {{set: module.exports.set, init: module.exports.init}}
 */
module.exports = {

    /**
     *
     * @param o
     * @returns {exports}
     */
    set: (o) => {
        cloud = o.cloud;
        utils = o.utils;
        transformPoint = o.transformPoint;
        backboneEvents = o.backboneEvents;
        return this;
    },

    /**
     *
     */
    init: () => {

        var dict = {
            "alert": {
                "da_DK": "Aktiver geolokation før du kan få rutevejledning",
                "en_US": "Activate geolocation before you can get directions"
            },

            "info": {
                "da_DK": "Klik i kortet for rutevejledning",
                "en_US": "Click in the map for directions"
            },
        }

        const me = this;
        mapObj = cloud.get().map;
        const open = (from, to) => {
            const url = `https://www.google.com/maps/dir/${from.lat},${from.lng}/${to.lat},${to.lng}`;
            utils.popupCenter(url, (utils.screen().width - 100), (utils.screen().height - 100));
        }
        const off = () => {
            utils.cursorStyle().reset();
            active = false;
            popover.hide();
            buttonEl.classList.remove('leaflet-disabled')

        }
        const GoogleDirectionsMapControlOptions = {
            template: (`<a href="#" id="mapcontrols-google-directions-map"
                            class="leaflet-bar-part leaflet-bar-part-single">
                            <span class="bi bi-arrow-90deg-right"></span>
                        </a>`),
            onclick: (e) => {
                activate();
                e.stopPropagation();
            }
        };
        let GoogleDirectionsMapControl = L.Control.extend({
            options: {position: 'topright'},
            onAdd: () => {
                let container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom directions-btn');
                let el = $(container).append(GoogleDirectionsMapControlOptions.template)[0];
                L.DomEvent.disableClickPropagation(el);
                el.onclick = GoogleDirectionsMapControlOptions.onclick;
                return container;
            }
        });
        const googleDirectionsMapControl = new GoogleDirectionsMapControl();

        cloud.get().map.addControl(googleDirectionsMapControl);
        popover = new bootstrap.Popover('#mapcontrols-google-directions-map', {
            content: utils.__("info", dict),
            trigger: 'manual',
        })
        const buttonEl = document.getElementById('mapcontrols-google-directions-map');
        // Deactivates module
        backboneEvents.get().on(`off:all reset:all`, () => {
            off();
        });
        const activate = () => {
            if (active) {
                off();
                return;
            }
            const lc = cloud.getLc();
            if (!lc._active) {
                alert(utils.__("alert", dict));
                return
            }
            backboneEvents.get().trigger(`off:all`);
            popover.show();
            buttonEl.classList.add('leaflet-disabled')
            utils.cursorStyle().crosshair();
            active = true;
        }
        mapObj.on("dblclick", function () {
            clicktimer = undefined;
        });
        mapObj.on("click", function (e) {
            let event = new geocloud.clickEvent(e, cloud);
            if (clicktimer) {
                clearTimeout(clicktimer);
            } else {
                if (active === false) {
                    return;
                }
                clicktimer = setTimeout(function () {
                    let coords = event.getCoordinate();
                    const to = utils.transform("EPSG:3857", "EPSG:4326", JSON.parse(JSON.stringify(coords)));
                    clicktimer = undefined;

                    const from = cloud.getLc()._layer.getLayers()[0].getLatLng()
                    off();
                    open(from, to);
                }, 250);
            }
        });
    }
};





