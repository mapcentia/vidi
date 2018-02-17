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
var mustache = require('mustache');
var backboneEvents;

require("bootstrap");

module.exports = {

    /**
     *
     * @param o
     * @returns {exports}
     */
    set: function (o) {
        modules = o;
        backboneEvents = o.backboneEvents;
        return this;
    },

    /**
     *
     */
    init: function () {
        var me = this, configFile, stop = false;

        var loadConfig = function () {
            $.getJSON( "/api/config/" + configFile, function (data) {
                console.info("Started with config: " + configFile);
                window.vidiConfig.brandName = data.brandName ? data.brandName : window.vidiConfig.brandName;
                window.vidiConfig.baseLayers = data.baseLayers ? data.baseLayers : window.vidiConfig.baseLayers;
                window.vidiConfig.enabledExtensions = data.enabledExtensions ? data.enabledExtensions : window.vidiConfig.enabledExtensions;
                window.vidiConfig.searchConfig = data.searchConfig ? data.searchConfig : window.vidiConfig.searchConfig;
                window.vidiConfig.aboutBox = data.aboutBox ? data.aboutBox : window.vidiConfig.aboutBox;
                window.vidiConfig.enabledSearch = data.enabledSearch ? data.enabledSearch : window.vidiConfig.enabledSearch;
                window.vidiConfig.schemata = data.schemata ? data.schemata : window.vidiConfig.schemata;
                window.vidiConfig.template = data.template ? data.template : window.vidiConfig.template;
                window.vidiConfig.enabledPrints = data.enabledPrints ? data.enabledPrints : window.vidiConfig.enabledPrints;
                window.vidiConfig.activateMainTab = data.activateMainTab ? data.activateMainTab : window.vidiConfig.activateMainTab;
                window.vidiConfig.extensionConfig = data.extensionConfig ? data.extensionConfig : window.vidiConfig.extensionConfig;
                window.vidiConfig.singleTiled = data.singleTiled ? data.singleTiled : window.vidiConfig.singleTiled;
            }).fail(function () {
                console.log("Could not load: " + configFile);

                if (stop) {
                    me.render();
                    return;
                }

                if (window.vidiConfig.defaultConfig) {
                    configFile = window.vidiConfig.defaultConfig;
                    stop = true;
                    loadConfig();
                } else {
                    me.render();
                }

            }).done(function () {
                me.render();
            });
        };

        if (urlVars.config) {
            configFile = urlVars.config;
        } else if (window.vidiConfig.autoLoadingConfig) {
            configFile = urlparser.db + ".json";
        } else if (window.vidiConfig.defaultConfig) {
            configFile = window.vidiConfig.defaultConfig;
        }

        if (configFile) {
            loadConfig();
        } else {
            me.render();
        }

    },

    /**
     *
     */
    render: function () {
        var me = this;

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

        // If px and py is provided for print templates,
        // add the values to the dict before rendering
        // =============================================

        if (urlVars.px && urlVars.py) {
            gc2i18n.dict.printWidth = urlVars.px + "px";
            gc2i18n.dict.printHeight = urlVars.py + "px";
            gc2i18n.dict.printDataTime = decodeURIComponent(urlVars.td); // TODO typo
            gc2i18n.dict.printDateTime = decodeURIComponent(urlVars.td);
            gc2i18n.dict.printDate = decodeURIComponent(urlVars.d);
            window.vidiTimeout = 500;
        } else {
            window.vidiTimeout = 0;
        }

        if (urlVars.l) {
            gc2i18n.dict._showLegend = urlVars.l;
        }
        gc2i18n.dict._showHeader = urlVars.h || "inline";
        gc2i18n.dict.brandName = window.vidiConfig.brandName;
        gc2i18n.dict.aboutBox = window.vidiConfig.aboutBox;

        // Render the page
        // ===============

        if (typeof Templates[tmpl] !== "undefined") {
            $("#main-container").html(Templates[tmpl].render(gc2i18n.dict));
            console.info("Using pre-processed template: " + tmpl);
            me.startApp();
        } else {
            $.get(window.vidiConfig.configUrl + "/" + tmpl, function (template) {
                var rendered = Mustache.render(template, gc2i18n.dict);
                $("#main-container").html(rendered);
                console.info("Loaded external template: " + tmpl);
                me.startApp();
            }).fail(function () {
                alert("Could not load template: " + tmpl);
            })
        }
    },

    /**
     *
     */
    startApp: function () {

        // Load style sheet
        //===================

        $('<link/>').attr({
            rel: 'stylesheet',
            type: 'text/css',
            href: '/css/styles.css'
        }).appendTo('head');

        // Add the tooltip div
        // ===================

        $("body").append('<div id="tail" style="position: fixed; float: left; display: none"></div>');


        // Init the modules
        // ================

        modules.cloud.init();
        modules.state.setExtent();
        modules.backboneEvents.init();
        modules.socketId.init();
        modules.bindEvent.init();
        modules.baseLayer.init();
        modules.infoClick.init();
        modules.advancedInfo.init();
        modules.draw.init();
        modules.print.init();
        modules.editor.init();

        modules.meta.init()

            .then(function () {
                    return modules.setting.init();
                },

                function (error) {
                    console.log(error); // Stacktrace
                    alert("Vidi is loaded without schema. Can't set extent or add layers");
                    backboneEvents.get().trigger("ready:meta");
                    modules.state.init();
                })

            .then(function () {
                modules.layerTree.init();
                modules.state.init();
            });

        // Require search module
        // =====================

        // Hack to compile Glob files. Don´t call this function!
        function ಠ_ಠ() {
            require('./search/*.js', {glob: true});
        }

        if (typeof vidiConfig.searchModules !== "undefined") {
            $.each(vidiConfig.searchModules, function (i, v) {
                modules.search[v] = require('./search/' + v + '.js');
                modules.search[v].set(modules);
            });
            modules.search[window.vidiConfig.enabledSearch].init();
        }

        // Require extensions modules
        // ==========================

        //Hack to compile Glob files. Don´t call this function!
        function ಠ_ಠ() {
           require('./../../extensions/*/browser/*.js', {glob: true});
        }

        if (typeof vidiConfig.extensions !== "undefined" && typeof vidiConfig.extensions.browser !== "undefined") {
            $.each(vidiConfig.extensions.browser, function (i, v) {
                modules.extensions[Object.keys(v)[0]] = {};
                $.each(v[Object.keys(v)[0]], function (n, m) {
                    modules.extensions[Object.keys(v)[0]][m] = require('./../../extensions/' + Object.keys(v)[0] + '/browser/' + m + ".js");
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
        $("[data-toggle=tooltip]").tooltip();

        $.material.init();
        touchScroll(".tab-pane");
        touchScroll("#info-modal-body-wrapper");
        $("#loadscreentext").html(__("Loading data"));

        if (window.vidiConfig.activateMainTab) {
            setTimeout(function () {
                $('#main-tabs a[href="#' + window.vidiConfig.activateMainTab + '-content"]').tab('show');

            }, 200);
        }

        $(window).resize(_.debounce(function () {
            $("#myNavmenu").offcanvas('hide');
            setTimeout(function () {
                modules.cloud.get().map.invalidateSize();
            }, 100);

        }, 0));
    }
};