/*
 * @author     Alexander Shumilov
 * @copyright  2013-2023 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

'use strict';

import {Loader} from "@googlemaps/js-api-loader"

let cloud;
let backboneEvents;


/**
 *
 * @type {{set: module.exports.set, init: module.exports.init}}
 */
module.exports = {
    set: function (o) {
        cloud = o.cloud;
        backboneEvents = o.backboneEvents;
        return this;
    },
    init: function () {
        let config = window.vidiConfig;
        const key = config?.searchConfig?.google?.apiKey;
        if (key) {
                const loader = new Loader({
                    apiKey: key,
                    version: "weekly"
                });
                loader.load().then(async () => {
                    const {Places} = await google.maps.importLibrary("places");

                    // map = new Au(document.getElementById("map"), {
                    //     center: {lat: -34.397, lng: 150.644},
                    //     zoom: 8,
                    // });
                    const el =document.querySelector('.custom-search');
                    if (el) {
                        var autocomplete = new google.maps.places.Autocomplete(el),
                            myLayer;
                        google.maps.event.addListener(autocomplete, 'place_changed', function () {
                            var place = autocomplete.getPlace(),
                                json = {
                                    "type": "Point",
                                    "coordinates": [place.geometry.location.lng(), place.geometry.location.lat()]
                                };
                            myLayer = L.geoJson();
                            myLayer.addData({
                                "type": "Feature",
                                "properties": {},
                                "geometry": json
                            });
                            cloud.get().map.addLayer(myLayer);
                            cloud.get().map.setView([place.geometry.location.lat(), place.geometry.location.lng()], 17)
                        });

                        // Listen for clearing event
                        // =========================

                        backboneEvents.get().on("clear:search", function () {
                            console.info("Clearing search");
                            myLayer.clearLayers();
                            $("#custom-search").val("");
                        });

                    } else {
                        console.warn(`Unable to find the custom search field`);
                    }
                });

        } else {
            console.warn(`Google Maps API key is required in search module, please specify the valid key in configuration or disable the extension to hide this message`);
        }
    }
};

