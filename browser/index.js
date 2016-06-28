window.gc2i18n = require('./i18n/da_DK');

window.Vidi = function () {
    "use strict";

    // Declare vars
    var config, socketId;

    // Set vars
    socketId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });

    config = require('../config/config.js');

    // Require standard modules
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
        draw: require('./modules/draw'),
        print: require('./modules/print'),
        advancedInfo: require('./modules/advancedInfo'),
        sqlQuery: require('./modules/sqlQuery'),
        serializeLayers: require('./modules/serializeLayers'),
        extensions: {}
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
    modules.print.set(modules);
    modules.advancedInfo.set(modules);
    modules.sqlQuery.set(modules);
    modules.serializeLayers.set(modules);

    // Hack to compile Glob files. Don´t call this function!
    function ಠ_ಠ() {
        require('./modules/extensions/**/*.js', {glob: true});
    }

    // Require extensions
    $.each(config.extensions.browser, function (i, v) {
        modules.extensions[Object.keys(v)[0]] = {};
        $.each(v[Object.keys(v)[0]], function (n, m) {
            modules.extensions[Object.keys(v)[0]][m] = require('./modules/extensions/' + Object.keys(v)[0] + '/' + m + ".js");
            modules.extensions[Object.keys(v)[0]][m].set(modules);
        })
    });

    return {
        init: modules.init
    }
};
