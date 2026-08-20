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
        const key = window.googleApiKey ? window.googleApiKey : config?.searchConfig?.google?.apiKey;
        if (key) {
            const loader = new Loader({
                apiKey: key,
                version: "weekly"
            });
            const markerLayer = L.geoJson();
            cloud.get().map.addLayer(markerLayer);
            backboneEvents.get().on("clear:search", function () {
                console.info("Clearing search");
                markerLayer.clearLayers();
                $(".custom-search").val("");
            });
            loader.load().then(async () => {
                const {Places} = await google.maps.importLibrary("places");
                const el = document.querySelector('.custom-search');
                if (el) {
                    let placeholder = window.vidiConfig?.searchConfig?.placeholderText;
                    if (placeholder) {
                        el.placeholder = placeholder;
                    }
                    const autocomplete = new google.maps.places.Autocomplete(el);
                    google.maps.event.addListener(autocomplete, 'place_changed', function () {
                        const place = autocomplete.getPlace(),
                            json = {
                                "type": "Point",
                                "coordinates": [place.geometry.location.lng(), place.geometry.location.lat()]
                            };
                        markerLayer.addData({
                            "type": "Feature",
                            "properties": {},
                            "geometry": json
                        });
                        cloud.get().map.setView([place.geometry.location.lat(), place.geometry.location.lng()], 17)
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
