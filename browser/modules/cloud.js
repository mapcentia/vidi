/**
 * @fileoverview Description of file, its uses and information
 * about its dependencies.
 */

'use strict';

try {
    geocloud.setHost(require('../../config/config.js').gc2.host);
} catch (e){
    console.info(e.message);
}

/**
 *
 * @type {geocloud.map}
 */
var cloud = new geocloud.map({
    el: "map",
    zoomControl: false,
    numZoomLevels: 21
});
cloud.map.on('load', function(){ if ($(document).width() > 767 ) {
    setTimeout(
        function () {
            $(".navbar-toggle").trigger("click");
        }, 500
    );
}});

/**
 *
 */
var zoomControl = L.control.zoom({
    position: 'topright'
});
cloud.map.addControl(zoomControl);
var map = cloud.map;


/*var scaleControl = L.control.scale({position: "bottomright"});
 cloud.map.addControl(scaleControl);*/

/**
 *
 */
var lc = L.control.locate({
    position: 'topright',
    strings: {
        title: "Find me"
    },
    icon: "fa fa-location-arrow",
    iconLoading: "fa fa-circle-o-notch fa-spin"
}).addTo(map);

/**
 *
 */
var graphicScale = L.control.graphicScale({
    doubleLine: false,
    fill: 'hollow',
    showSubunits: false,
    position: "topleft"
}).addTo(map);

/**
 *
 * @type {div}
 */
var scaleText = L.DomUtil.create('div', 'scaleText');
graphicScale._container.insertBefore(scaleText, graphicScale._container.firstChild);
//scaleText.innerHTML = '<h1>Leaflet Graphic Scale</h1><p>style: <span class="choice">hollow</span>-<span class="choice">line</span>-<span class="choice">fill</span>-<span class="choice">nofill</span></p>';

/**
 *
 */
var styleChoices = scaleText.querySelectorAll('.choice');

for (var i = 0; i < styleChoices.length; i++) {
    styleChoices[i].addEventListener('click', function (e) {
        graphicScale._setStyle({fill: e.currentTarget.innerHTML});
    });
}

var localization;
if (window._vidiLocale === "da_DK") {
    localization = "da";
}
if (window._vidiLocale === "en_US") {
    localization = "en";
}
/**
 *
 */
var measureControl = new L.Control.Measure({
    position: 'topright',
    primaryLengthUnit: 'kilometers',
    secondaryLengthUnit: 'meters',
    primaryAreaUnit: 'hectares',
    secondaryAreaUnit: 'sqmeters',
    localization: localization

});
measureControl.addTo(map);
module.exports = cloud;