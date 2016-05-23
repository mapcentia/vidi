var cloud;
module.exports = module.exports = {
    set: function (o) {
        cloud = o.cloud;
        return this;
    },
    init: function (str) {
        if (typeof window.setBaseLayers !== 'object') {
            window.setBaseLayers = [
                {"id": "mapQuestOSM", "name": "MapQuset OSM"},
                {"id": "osm", "name": "OSM"},
                {"id": "stamenToner", "name": "Stamen toner"}
            ];
        }
        cloud.bingApiKey = window.bingApiKey;
        cloud.digitalGlobeKey = window.digitalGlobeKey;
        for (i = 0; i < window.setBaseLayers.length; i = i + 1) {
            if (typeof window.setBaseLayers[i].restrictTo === "undefined" || window.setBaseLayers[i].restrictTo.indexOf(schema) > -1) {
                cloud.addBaseLayer(window.setBaseLayers[i].id, window.setBaseLayers[i].db);
                $("#base-layer-list").append(
                    "<li class='base-layer-item list-group-item' data-gc2-base-id='" + window.setBaseLayers[i].id + "'><span class='radio radio-primary'><label style='display: block;'><input type='radio' name='baselayers'>" + window.setBaseLayers[i].name + "</label></span></li>"
                );
            }
        }
    }
};