/*
 * Copyright 2016 MapCentia ApS. All rights reserved.
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   https://www.gnu.org/licenses/agpl-3.0.html
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Description of file, its uses and information
 * about its dependencies.
 */

'use strict';

// Hack to compile Glob files. Don´t call this function!
function ಠ_ಠ() {
    require('./i18n/*.js', {glob: true});
}
window.gc2i18n = require('./i18n/' + window._vidiLocale + '.js');

/**
 *
 */
window.Vidi = function () {

    // Declare vars
    var config, socketId, tmpl;


    var urlparser = require('./modules/urlparser');
    var urlVars = urlparser.urlVars;

    config = require('../config/config.js');

    $(window).load(function () {
        window.status = "all_loaded";
    });

    /**
     * Set widow.status after 15 secs. if not loaded.
     */
    setTimeout(function () {
        window.status = "all_loaded";
    }, 15000);

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

    // Check if template is set in URL vars
    if (typeof urlVars.tmpl !== "undefined") {
        var par = urlVars.tmpl.split("#");
        if (par.length > 1) {
            par.pop();
        }
        tmpl = par.join();
    }

    // If px and py is provided for print templates, add the values to the dict before rendering
    if (urlVars.px && urlVars.py) {
        gc2i18n.dict.printWidth = urlVars.px + "px";
        gc2i18n.dict.printHeight = urlVars.py + "px";
        gc2i18n.dict.printDataTime = decodeURIComponent(urlVars.td);
    }

    //
    if (urlVars.l) {
        gc2i18n.dict._showLegend = urlVars.l;
    }

    gc2i18n.dict.brandName = config.brandName;

    $("body").html(Templates[tmpl].render(gc2i18n.dict));

    $("[data-toggle=tooltip]").tooltip();
    $(".center").hide();
    try {
        var max = $(document).height() - $('.tab-pane').offset().top - 100;
    } catch (e) {
        console.info(e.message);
    }
    $('.tab-pane').not("#result-content").css('max-height', max);
    $('.places').css('height', max - 130);
    $('.places').css('min-height', 400);
    $('.places .tt-dropdown-menu').css('max-height', max - 200);
    $('.places .tt-dropdown-menu').css('min-height', 400);

    // Require the standard modules
    var modules = {
        init: require('./modules/init'),
        socketId: require('./modules/socketId'),
        urlparser: require('./modules/urlparser'),
        cloud: require('./modules/cloud'),
        switchLayer: require('./modules/switchLayer'),
        setBaseLayer: require('./modules/setBaseLayer'),
        meta: require('./modules/meta'),
        layerTree: require('./modules/layerTree'),
        layers: require('./modules/layers'),
        setting: require('./modules/setting'),
        baseLayer: require('./modules/baseLayer'),
        legend: require('./modules/legend'),
        state: require('./modules/state'),
        anchor: require('./modules/anchor'),
        infoClick: require('./modules/infoClick'),
        bindEvent: require('./modules/bindEvent'),
        draw: require('./modules/draw'),
        print: require('./modules/print'),
        advancedInfo: require('./modules/advancedInfo'),
        sqlQuery: require('./modules/sqlQuery'),
        serializeLayers: require('./modules/serializeLayers'),
        pushState: require('./modules/pushState'),
        backboneEvents: require('./modules/backboneEvents'),
        utils: require('./modules/utils'),
        extensions: {}
    };

    // Require search module
    // Hack to compile Glob files. Don´t call this function!
    function ಠ_ಠ() {
        require('./modules/search/*.js', {glob: true});
    }

    modules.search = require('./modules/search/' + config.searchModule + '.js');

    // Use the setters in modules so they can interact
    modules.init.set(modules);
    modules.socketId.set(modules);
    modules.meta.set(modules);
    modules.layerTree.set(modules);
    modules.layers.set(modules);
    modules.setting.set(modules);
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
    modules.pushState.set(modules);
    modules.backboneEvents.set(modules);
    modules.utils.set(modules);

    //Init modules
    modules.backboneEvents.init();
    modules.socketId.init();
    modules.bindEvent.init();
    modules.meta.init();
    modules.baseLayer.init();
    modules.setting.init();
    modules.state.init();
    modules.infoClick.init();
    modules.search.init();
    modules.draw.init();
    modules.advancedInfo.init();
    modules.print.init();

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
