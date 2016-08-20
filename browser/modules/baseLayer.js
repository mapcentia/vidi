var cloud;
module.exports = module.exports = {
    set: function (o) {
        cloud = o.cloud;
        return this;
    },
    init: function (str) {
        var bl, customBaseLayer;
        if (typeof window.setBaseLayers !== 'object') {
            window.setBaseLayers = [
                {"id": "mapQuestOSM", "name": "MapQuset OSM"},
                {"id": "osm", "name": "OSM"},
                {"id": "stamenToner", "name": "Stamen toner"}
            ];
        }
        cloud.bingApiKey = window.bingApiKey;
        cloud.digitalGlobeKey = window.digitalGlobeKey;
        for (var i = 0; i < window.setBaseLayers.length; i = i + 1) {

            bl = window.setBaseLayers[i];
            if (typeof bl.type !== "undefined" && bl.type === "XYZ") {
                customBaseLayer = new L.TileLayer(bl.url, {
                    attribution: bl.attribution
                });
                customBaseLayer.baseLayer = true;
                customBaseLayer.id = bl.id;
                cloud.addLayer(customBaseLayer, bl.name, true);
                $("#base-layer-list").append(
                    "<div class='list-group-item'><div class='radio radio-primary base-layer-item' data-gc2-base-id='" + bl.id + "'><label><input type='radio' name='baselayers'>" + bl.name + "</label></div></div><div class='list-group-separator'></div>"
                );
            } else if (typeof window.setBaseLayers[i].restrictTo === "undefined" || window.setBaseLayers[i].restrictTo.indexOf(schema) > -1) {
                cloud.addBaseLayer(window.setBaseLayers[i].id, window.setBaseLayers[i].db);
                $("#base-layer-list").append(
                    "<div class='list-group-item'><div class='radio radio-primary base-layer-item' data-gc2-base-id='" + window.setBaseLayers[i].id + "'><label><input type='radio' name='baselayers'>" + window.setBaseLayers[i].name + "</label></div></div><div class='list-group-separator'></div>"
                );
            }
        }
    }
};