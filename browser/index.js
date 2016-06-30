window.gc2i18n = require('./i18n/da_DK');

window.Vidi = function () {
    "use strict";

    // Declare vars
    var config, socketId, tmpl;

    // Set vars
    socketId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });

    config = require('../config/config.js');

    // Load style sheet
    $('<link/>').attr({
        rel: 'stylesheet',
        type: 'text/css',
        href: '/static/css/styles.css'
    }).appendTo('head');

    // Render template and set some styling
    if (typeof config.template === "undefined") {
        tmpl = "default.tmpl";
    } else {
        tmpl = config.template;
    }
    $("body").html(Templates[tmpl].render(gc2i18n.dict));

    $("[data-toggle=tooltip]").tooltip();
    $(".center").hide();
    $("#pane").hide().fadeIn(1500);
    var max = $(document).height() - $('.tab-pane').offset().top - 100;
    $('.tab-pane').not("#result-content").css('max-height', max);
    $('#places').css('height', max - 130);
    $('#places').css('min-height', 400);
    $('#places .tt-dropdown-menu').css('max-height', max - 200);
    $('#places .tt-dropdown-menu').css('min-height', 400);

    // Require the standard modules
    var modules = {
        init: require('./modules/init'),
        cloud: require('./modules/cloud'),
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

    // Use the setters in modules so they can interact
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

    // Require extensions modules

    // Hack to compile Glob files. Don´t call this function!
    function ಠ_ಠ() {
        require('./modules/extensions/**/*.js', {glob: true});
    }
    if (typeof config.extensions !== "undefined" && typeof config.extensions.browser !== "undefined") {
        $.each(config.extensions.browser, function (i, v) {
            modules.extensions[Object.keys(v)[0]] = {};
            $.each(v[Object.keys(v)[0]], function (n, m) {
                modules.extensions[Object.keys(v)[0]][m] = require('./modules/extensions/' + Object.keys(v)[0] + '/' + m + ".js");
                modules.extensions[Object.keys(v)[0]][m].set(modules);
                modules.extensions[Object.keys(v)[0]][m].init();
            })
        });
    }
    // Return the init module to be called in index.html
    return {
        init: modules.init
    }
};
