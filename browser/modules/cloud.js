var cloud = new geocloud.map({
    el: "map",
    zoomControl: false,
    numZoomLevels: 21
});
var zoomControl = L.control.zoom({
    position: 'topright'
});
cloud.map.addControl(zoomControl);

module.exports = cloud;