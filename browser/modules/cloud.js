
window.cloud = new geocloud.map({
    el: "map",
    zoomControl: false,
    numZoomLevels: 21
});
var zoomControl = L.control.zoom({
    position: 'topright'
});
cloud.map.addControl(zoomControl);

var map = cloud.map;


/*var scaleControl = L.control.scale({position: "bottomright"});
cloud.map.addControl(scaleControl);*/

var lc = L.control.locate({
    position: 'topright',
    strings: {
        title: "Find me"
    },
    position: "topright",
    icon: "fa fa-location-arrow",
    iconLoading: "fa fa-circle-o-notch fa-spin"
}).addTo(map);

var graphicScale = L.control.graphicScale({
    doubleLine: false,
    fill: 'hollow',
    showSubunits: false,
    position: "bottomleft"
}).addTo(map);

var scaleText = L.DomUtil.create('div', 'scaleText' );
graphicScale._container.insertBefore(scaleText, graphicScale._container.firstChild);
//scaleText.innerHTML = '<h1>Leaflet Graphic Scale</h1><p>style: <span class="choice">hollow</span>-<span class="choice">line</span>-<span class="choice">fill</span>-<span class="choice">nofill</span></p>';

var styleChoices = scaleText.querySelectorAll('.choice');

for (var i = 0; i < styleChoices.length; i++) {
    styleChoices[i].addEventListener('click', function(e) {
        graphicScale._setStyle( { fill: e.currentTarget.innerHTML } );
    });
}

module.exports = cloud;