/*
 * @author     Martin Høgh <mh@mapcentia.com>
 * @copyright  2013-2025 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

'use strict';

import React from "react";

/**
 *
 * @type {*|exports|module.exports}
 */
let cloud;

/**
 *
 * @type {*|exports|module.exports}
 */
let utils;

/**
 *
 * @type {*|exports|module.exports}
 */
let backboneEvents;

/**
 *
 */
let transformPoint;


/**
 *
 * @type {string}
 */
let exId = "streetView";

/**
 *
 */
let clicktimer;

/**
 *
 */
let mapObj;


let config = require('../../../config/config.js');

let cowiUrl = config?.extensionConfig?.streetView?.cowi;
let mapillaryUrl = config?.extensionConfig?.streetView?.mapillary || "https://www.mapillary.com/app/?z=17";
const defaultSelectedOption = config?.extensionConfig?.streetView?.default || "google";
let selectedOption;


import {createRoot} from "react-dom/client";

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
    set: function (o) {
        cloud = o.cloud;
        utils = o.utils;
        transformPoint = o.transformPoint;
        backboneEvents = o.backboneEvents;
        return this;
    },

    /**
     *
     */
    init: function () {

        let parentThis = this;

        /**
         *
         * Native Leaflet object
         */
        mapObj = cloud.get().map;

        /**
         *
         */
        const React = require('react');

        /**
         *
         */
        const ReactDOM = require('react-dom');

        /**
         *
         */
        const dict = {

            "Info": {
                "da_DK": "Start Google Street View, Mapillary eller skråfoto op fra hvor du klikker i kortet. Servicen starter i et nyt browser vindue.",
                "en_US": "Start Google Street View, Mapillary or Oblique Photo from where you click on the map. The service starts in a new browser window."
            },

            "Street View": {
                "da_DK": "Skrå- og gadefoto",
                "en_US": "Street View"
            },

            "Choose service": {
                "da_DK": "Vælg service",
                "en_US": "Choose service"
            },

            "Activate": {
                "da_DK": "Aktiver",
                "en_US": "Activate"
            }
        };

        /**
         *
         * @param txt
         * @returns {*}
         * @private
         */
        const __ = function (txt) {
            if (dict[txt][window._vidiLocale]) {
                return dict[txt][window._vidiLocale];
            } else {
                return txt;
            }
        };

        /**
         *
         */
        class Streetview extends React.Component {
            constructor(props) {
                super(props);

                this.state = {
                    active: false,
                    selectedOption: defaultSelectedOption
                };

                this.onChange = this.onChange.bind(this);
            }

            onChange(changeEvent) {
                this.setState({
                    selectedOption: changeEvent.target.value
                });
            }

            /**
             *
             */
            componentDidMount() {
                let me = this;

                // Stop listening to any events, deactivate controls, but
                // keep effects of the module until they are deleted manually or reset:all is emitted
                backboneEvents.get().on("deactivate:all", () => {
                });

                // Activates module
                backboneEvents.get().on(`on:${exId}`, () => {
                    me.setState({
                        active: true
                    });
                    utils.cursorStyle().crosshair();
                });

                // Deactivates module
                backboneEvents.get().on(`off:${exId} off:all reset:all`, () => {
                    me.setState({
                        active: false
                    });
                    utils.cursorStyle().reset();
                });

                // Handle click events on map
                // ==========================
                mapObj.on("dblclick", function () {
                    clicktimer = undefined;
                });
                mapObj.on("click", function (e) {
                    let event = new geocloud.clickEvent(e, cloud);
                    if (clicktimer) {
                        clearTimeout(clicktimer);
                    } else {
                        if (me.state.active === false) {
                            return;
                        }
                        parentThis.click(event, me.state.selectedOption);
                    }
                });
            }

            /**
             *
             * @returns {JSX.Element}
             */
            render() {
                return (
                    <div role="tabpanel">
                        <div className="form-group">
                            <div className="d-flex flex-column gap-4">
                                <span className="btn-group">
                                    <input className="btn-check" type="radio" id="streetview-service-google"
                                           name="streetview-service"
                                           value="google" checked={this.state.selectedOption === 'google'}
                                           onChange={this.onChange}/>
                                    <label className="btn btn-sm btn-outline-secondary"
                                           htmlFor="streetview-service-google">Street View</label>

                                    <input className="btn-check" type="radio" id="streetview-service-mapillary"
                                           name="streetview-service" value="mapillary"
                                           checked={this.state.selectedOption === 'mapillary'}
                                           onChange={this.onChange}/>
                                    <label className="btn btn-sm btn-outline-secondary"
                                           htmlFor="streetview-service-mapillary">Mapillary</label>

                                    <input className="btn-check" type="radio" id="streetview-service-skraafoto"
                                           name="streetview-service" value="skraafoto"
                                           checked={this.state.selectedOption === 'skraafoto'}
                                           onChange={this.onChange}/>
                                    <label className="btn btn-sm btn-outline-secondary"
                                           htmlFor="streetview-service-skraafoto">Skråfoto</label>
                                    <input className="btn-check" type="radio" id="streetview-service-maps"
                                           name="streetview-service" value="maps"
                                           checked={this.state.selectedOption === 'maps'}
                                           onChange={this.onChange}/>
                                    <label className="btn btn-sm btn-outline-secondary"
                                           htmlFor="streetview-service-maps">Maps</label>
                                    {cowiUrl !== undefined ?
                                        <input className="btn-check" type="radio" id="streetview-service-cowi"
                                               name="streetview-service" value="cowi"
                                               checked={this.state.selectedOption === 'cowi'}
                                               onChange={this.onChange}/> : null
                                    }
                                    {cowiUrl !== undefined ?
                                        <label className="btn btn-sm btn-outline-secondary"
                                               htmlFor="streetview-service-cowi">COWI Gadefoto</label> : null
                                    }
                                </span>
                            </div>
                        </div>
                    </div>
                );
            }
        }

        utils.createMainTab(exId, __("Street View"), __("Info"), require('./../../../browser/modules/height')().max, "bi-camera", false, exId);

        // Append to DOM
        //==============

        if (!utils.isEmbedEnabled()) {
            try {
                createRoot(document.getElementById(exId)).render(<Streetview/>);
            } catch (e) {
            }
        } else {
            // Start of drawer
            let active = false;
            let drawerControl;
            let drawerItems = [];
            let template;
            drawerItems.push(`
                            <a style="width: 70px" href="#" title="Mapillary" class="position-relative street-view-drawer-item leaflet-bar-part leaflet-bar-part-single overflow-hidden d-flex ps-1">
                            <div data-vidi-street-view-id="mapillary" data-vidi-street-view-num="1" class="text-center w-100">Mapillary</div>
                            <div class="${selectedOption !== 'mapillary' ? 'd-none' : ''} baselayer-drawer-item-shadow w-100"></div>
                            </a>
                            `
            );
            drawerItems.push(`
                            <a style="width: 75px" href="#" title="Google" class="position-relative street-view-drawer-item leaflet-bar-part leaflet-bar-part-single overflow-hidden d-flex ps-1">
                            <div data-vidi-street-view-id="google" data-vidi-street-view-num="1" class="text-center w-100">Street View</div>
                            <div class="${selectedOption !== 'google' ? 'd-none' : ''} baselayer-drawer-item-shadow w-100"></div>
                            </a>
                            `
            );
            drawerItems.push(`
                            <a style="width: 65px" href="#" title="Skråfoto" class="position-relative street-view-drawer-item leaflet-bar-part leaflet-bar-part-single overflow-hidden d-flex ps-1">
                            <div data-vidi-street-view-id="skraafoto" data-vidi-street-view-num="1" class="text-center w-100">Skråfoto</div>
                            <div class="${selectedOption !== 'skraafoto' ? 'd-none' : ''} baselayer-drawer-item-shadow w-100"></div>
                            </a>
                            `
            );
            drawerItems.push(`
                            <a style="width: 50px" href="#" title="Maps" class="position-relative street-view-drawer-item leaflet-bar-part leaflet-bar-part-single overflow-hidden d-flex ps-1">
                            <div data-vidi-street-view-id="maps" data-vidi-street-view-num="1" class="text-center w-100">Maps</div>
                            <div class="${selectedOption !== 'maps' ? 'd-none' : ''} baselayer-drawer-item-shadow w-100"></div>
                            </a>
                            `
            );
            if (cowiUrl) drawerItems.push(`
                            <a style="width: 50px" href="#" title="COWI" class="position-relative street-view-drawer-item leaflet-bar-part leaflet-bar-part-single overflow-hidden d-flex ps-1">
                            <div data-vidi-street-view-id="cowi" data-vidi-street-view-num="1" class="text-center w-100">COWI</div>
                            <div class="${selectedOption !== 'cowi' ? 'd-none' : ''} baselayer-drawer-item-shadow w-100"></div>
                            </a>
                            `
            );

            template = `<div class="d-flex">
                        <div class="street-view-drawer-container d-flex d-none">${drawerItems.join('')}</div>
                        <a href="#" title="wdds" class="leaflet-bar-part leaflet-bar-part-single street-view-drawer">
                            <span class="bi bi-camera street-view-drawer"></span> 
                        </a>
                    </div>`;
            let drawerOptions = {
                template: template,
                onclick: (e) => {
                    const cl = document.querySelector('.street-view-drawer-container').classList;
                    if (e.target.classList.contains('street-view-drawer')) {
                        if (cl.contains('d-none')) {
                            cl.remove('d-none')
                            active = true;
                            if (selectedOption === undefined && defaultSelectedOption !== undefined) {
                                parentThis.setDrawerItem(defaultSelectedOption)
                            }
                        } else {
                            cl.add('d-none');
                            active = false;
                        }
                    } else {
                        parentThis.setDrawerItem(e.target.dataset.vidiStreetViewId)
                    }
                }
            };
            drawerControl = L.Control.extend({
                options: {position: 'topright'},
                onAdd: () => {
                    let container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom street-view-drawer street-view-tool');
                    let el = $(container).append(drawerOptions.template)[0];
                    L.DomEvent.disableClickPropagation(el);
                    el.onclick = drawerOptions.onclick;
                    return container;
                }
            })

            drawerControl = new drawerControl();
            cloud.get().map.addControl(drawerControl);

            // Handle click events on map
            // ==========================
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
                    parentThis.click(event, selectedOption);
                }
            });
        }

    },

    setDrawerItem: (id) => {
        selectedOption =id;
        document.querySelectorAll('.baselayer-drawer-item-shadow').forEach(node => node.classList.add('d-none'))
        document.querySelector(`[data-vidi-street-view-id="${id}"]`).nextElementSibling.classList.remove('d-none')
    },

    callBack: function (url) {
        utils.popupCenter(url, (utils.screen().width - 100), (utils.screen().height - 100), exId);
    },

    setCallBack: function (fn) {
        this.callBack = fn;
    },

    click: function (event, selectedOption) {
        const parentThis = this
        clicktimer = setTimeout(function () {
            let coords = event.getCoordinate(), p, pUtm, url;
            p = utils.transform("EPSG:3857", "EPSG:4326", JSON.parse(JSON.stringify(coords)));
            pUtm = utils.transform("EPSG:3857", "+proj=utm +zone=32 +ellps=WGS84 +datum=WGS84 +units=m +no_defs", JSON.parse(JSON.stringify(coords)));
            clicktimer = undefined;

            switch (selectedOption) {
                case "google":
                    url = "https://maps.google.com/maps?q=&layer=c&cbll=" + p.y + "," + p.x + "&cbp=11,0,0,0,0";
                    break;

                case "mapillary":
                    url = mapillaryUrl + "&lat=" + p.y + "&lng=" + p.x;
                    break;

                case "skraafoto":
                    url = `https://skraafoto.dataforsyningen.dk/viewer.html?center=${pUtm.x},${pUtm.y}&orientation=north`;
                    break;
                case "maps":
                    url = `https://www.google.dk/maps/@${p.y},${p.x},17z`;
                    break;

                case "cowi":
                    url = cowiUrl + "&srid=4326&x=" + p.x + "&y=" + p.y;
                    break;
            }
            parentThis.callBack(url);

        }, 250);
    }
};


