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

/**
 *
 * @type {{set: module.exports.set, init: module.exports.init}}
 */
module.exports = {
    set: function (o) {
        cloud = o.cloud;
        return this;
    },
    init: function () {
        var autocomplete = new google.maps.places.Autocomplete(document.getElementById('custom-search'));
        google.maps.event.addListener(autocomplete, 'place_changed', function () {
            var place = autocomplete.getPlace(),
                json = {"type": "Point", "coordinates": [place.geometry.location.lng(), place.geometry.location.lat()]},
                myLayer = L.geoJson();

            myLayer.addData({
                "type": "Feature",
                "properties": {},
                "geometry": json
            });
            cloud.get().map.addLayer(myLayer);
            cloud.get().map.setView([place.geometry.location.lat(), place.geometry.location.lng()], 17)
        });
    }
};