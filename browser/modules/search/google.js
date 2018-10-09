/**
 * @fileoverview Description of file, its uses and information
 * about its dependencies.
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
        if (document.getElementById('custom-search')) {
            /*
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
            */
        } else {
            console.warn(`Unable to find the custom search field`);
        }
    }
};