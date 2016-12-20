/**
 * @fileoverview Description of file, its uses and information
 * about its dependencies.
 */

'use strict';

var extensions;
var modules;
var tmpl;
var urlparser = require('./../modules/urlparser');
var urlVars = urlparser.urlVars;
require("bootstrap");

module.exports = {
    set: function (o) {
        modules = o;
        return this;
    },
    init: function () {
        var me = this;
        if (urlVars.config) {
            $.getJSON(window.vidiConfig.configUrl + "/" + urlVars.config, function (data) {
                console.log(data);
                window.vidiConfig.brandName = data.brandName ? data.brandName : window.vidiConfig.brandName;
                window.vidiConfig.baseLayers = data.baseLayers ? data.baseLayers : window.vidiConfig.baseLayers;
                window.vidiConfig.enabledExtensions = data.enabledExtensions ? data.enabledExtensions : window.vidiConfig.enabledExtensions;
                window.vidiConfig.searchConfig = data.searchConfig ? data.searchConfig : window.vidiConfig.searchConfig;
            }).fail(function () {
                console.log("error");
            }).always(function () {
                me.startApp();
            });
        } else {
            me.startApp();
        }
    },
    startApp: function () {

        // Load style sheet
        //===================

        $('<link/>').attr({
            rel: 'stylesheet',
            type: 'text/css',
            href: '/static/css/styles.css'
        }).appendTo('head');

        // Render template and set some styling
        // ====================================

        if (typeof window.vidiConfig.template === "undefined") {
            tmpl = "default.tmpl";
        } else {
            tmpl = window.vidiConfig.template;
        }

        // Check if template is set in URL vars
        // ====================================

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

        if (urlVars.l) {
            gc2i18n.dict._showLegend = urlVars.l;
        }

        gc2i18n.dict.brandName = window.vidiConfig.brandName;
        gc2i18n.dict.aboutBox = window.vidiConfig.aboutBox;

        // Render the page
        // ===============

        $("#main-container").html(Templates[tmpl].render(gc2i18n.dict));

        $("[data-toggle=tooltip]").tooltip();
        //$(".center").hide();
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

        // Init the modules
        // ================

        modules.cloud.init();
        modules.backboneEvents.init();
        modules.socketId.init();
        modules.bindEvent.init();
        modules.meta.init();
        modules.baseLayer.init();
        modules.setting.init();
        modules.state.init();
        modules.infoClick.init();
        modules.search.init();
        modules.advancedInfo.init();
        modules.draw.init();
        modules.print.init();

        // Require extensions modules
        // ==========================

        //Hack to compile Glob files. Don´t call this function!
        function ಠ_ಠ() {
            require('./extensions/**/*.js', {glob: true});
        }

        if (typeof vidiConfig.extensions !== "undefined" && typeof vidiConfig.extensions.browser !== "undefined") {
            $.each(vidiConfig.extensions.browser, function (i, v) {
                modules.extensions[Object.keys(v)[0]] = {};
                $.each(v[Object.keys(v)[0]], function (n, m) {
                    modules.extensions[Object.keys(v)[0]][m] = require('./extensions/' + Object.keys(v)[0] + '/' + m + ".js");
                    modules.extensions[Object.keys(v)[0]][m].set(modules);
                })
            });

            if (typeof window.vidiConfig.enabledExtensions === "object") {
                $.each(vidiConfig.extensions.browser, function (i, v) {
                    $.each(v[Object.keys(v)[0]], function (n, m) {
                        if (window.vidiConfig.enabledExtensions.indexOf(Object.keys(v)[0]) > -1) {
                            modules.extensions[Object.keys(v)[0]][m].init();
                        }
                    })
                });
            }
        }

        // Init some GUI stuff after modules are loaded
        // ============================================

        $.material.init();
        touchScroll(".tab-pane");
        touchScroll("#info-modal-body-wrapper");
        $("#loadscreentext").html(__("Loading data"));
    }
};