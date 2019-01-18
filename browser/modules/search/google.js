/*
 * @author     Alexander Shumilov
 * @copyright  2013-2018 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

'use strict';

/**
 *
 * @type {*|exports|module.exports}
 */
var cloud;

var backboneEvents;


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
        // Load Google Maps API and make sure its not loaded more than once
        if (typeof window.GoogleMapsDirty === "undefined" && !(typeof google !== "undefined" && typeof google.maps !== "undefined")) {
            window.GoogleMapsDirty = true;
            jQuery.getScript("https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false&libraries=places&key=" + window.googleApiKey);
            // Google Maps API is loaded
        }
        (function poll() {
            if (typeof google !== "undefined" && typeof google.maps !== "undefined" && typeof google.maps.Map !== "undefined") {
                if (document.getElementById('custom-search')) {
                    var autocomplete = new google.maps.places.Autocomplete(document.getElementById('custom-search')), myLayer;
                    google.maps.event.addListener(autocomplete, 'place_changed', function () {
                        var place = autocomplete.getPlace(),
                            json = {"type": "Point", "coordinates": [place.geometry.location.lng(), place.geometry.location.lat()]};
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
            } else {
                setTimeout(poll, 50);
            }
        }());



    }
};

