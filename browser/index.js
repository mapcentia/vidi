window.gc2i18n = require('./i18n/da_DK');
window.Vidi = function () {
    "use strict";

    // Declare vars
    var init, switchLayer, setBaseLayer, meta, setting, addLegend, autocomplete, hostname, nodeHostname, cloud, db, schema, hash, osm,
        qstore = [], anchor, drawLayer, drawControl, zoomControl, metaDataKeys = [], metaDataKeysTitle = [],
        awesomeMarker, metaDataReady = false, settingsReady = false, makeConflict, socketId,
        drawing = false, searchFinish, zoomToFeature, fileId, geomStr, urlVars, config;

    // Set vars
    socketId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });

    config = require('../config/config.js');

    // Require modules
    var modules = {
        cloud: require('./modules/cloud'),
        init: require('./modules/init'),
        switchLayer: require('./modules/switchLayer'),
        setBaseLayer: require('./modules/setBaseLayer'),
        meta: require('./modules/gc2/meta'),
        setting: require('./modules/gc2/setting'),
        baseLayer: require('./modules/baseLayer'),
        legend: require('./modules/gc2/legend'),
        state: require('./modules/state'),
        anchor: require('./modules/anchor'),
        infoClick: require('./modules/infoClick'),
        search: require('./modules/search/danish'),
        bindEvent: require('./modules/bindEvent'),
        draw: require('./modules/draw')

    };

    // Use setters in modules so they can interact
    modules.init.set(modules);
    modules.meta.set(modules);
    modules.switchLayer.set(modules);
    modules.setBaseLayer.set(modules);
    modules.baseLayer.set(modules);
    modules.legend.set(modules);
    modules.state.set(modules);
    modules.anchor.set(modules);
    modules.infoClick.set(modules);
    modules.search.set(modules);
    modules.bindEvent.set(modules);
    modules.draw.set(modules);

    L.drawLocal = require('./modules/drawLocal');


    return {
        init: modules.init
    }
};
