/*
 * @author     Martin Høgh <mh@mapcentia.com>
 * @copyright  2013-2019 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

'use strict';

var modules;
var tmpl;
var urlparser = require('./../modules/urlparser');
var urlVars = urlparser.urlVars;
var backboneEvents;

const semver = require('semver');
const md5 = require('md5');
require("bootstrap");

const cookie = require('js-cookie');

const DEFAULT_STARTUP_MODAL_SUPRESSION_TEMPLATES = ["print.tmpl", "blank.tmpl", {
    regularExpression: true,
    name: 'print_[\\w]+\\.tmpl'
}];

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
        let me = this, configFile, stop = false;

        if (typeof urlVars.session === "string") {
            cookie.set("connect.gc2", urlVars.session, {expires: 1});
        }

        let loadConfig = function () {
            let configParam;
            if (configFile.startsWith("/")) {
                configParam = window.gc2host + configFile
            } else {
                configParam = "/api/config/" + urlparser.db + "/" + configFile;
            }
            $.getJSON(configParam, function (data) {
                window.vidiConfig.brandName = data.brandName ? data.brandName : window.vidiConfig.brandName;
                window.vidiConfig.startUpModal = data.startUpModal ? data.startUpModal : window.vidiConfig.startUpModal;
                window.vidiConfig.baseLayers = data.baseLayers ? data.baseLayers : window.vidiConfig.baseLayers;
                window.vidiConfig.enabledExtensions = data.enabledExtensions ? data.enabledExtensions : window.vidiConfig.enabledExtensions;
                window.vidiConfig.searchConfig = data.searchConfig ? data.searchConfig : window.vidiConfig.searchConfig;
                window.vidiConfig.aboutBox = data.aboutBox ? data.aboutBox : window.vidiConfig.aboutBox;
                window.vidiConfig.enabledSearch = data.enabledSearch ? data.enabledSearch : window.vidiConfig.enabledSearch;
                window.vidiConfig.removeDisabledLayersFromLegend = data.removeDisabledLayersFromLegend ? data.removeDisabledLayersFromLegend : window.vidiConfig.removeDisabledLayersFromLegend;
                window.vidiConfig.snapshot = data.snapshot ? data.snapshot : window.vidiConfig.snapshot;
                window.vidiConfig.schemata = data.schemata ? data.schemata : window.vidiConfig.schemata;
                window.vidiConfig.template = data.template ? data.template : window.vidiConfig.template;
                window.vidiConfig.enabledPrints = data.enabledPrints ? data.enabledPrints : window.vidiConfig.enabledPrints;
                window.vidiConfig.activateMainTab = data.activateMainTab ? data.activateMainTab : window.vidiConfig.activateMainTab;
                window.vidiConfig.extensionConfig = data.extensionConfig ? data.extensionConfig : window.vidiConfig.extensionConfig;
                window.vidiConfig.singleTiled = data.singleTiled ? data.singleTiled : window.vidiConfig.singleTiled;
                window.vidiConfig.doNotCloseLoadScreen = data.doNotCloseLoadScreen ? data.doNotCloseLoadScreen : window.vidiConfig.doNotCloseLoadScreen;
                window.vidiConfig.startupModalSupressionTemplates = data.startupModalSupressionTemplates ? data.startupModalSupressionTemplates : window.vidiConfig.startupModalSupressionTemplates;
            }).fail(function () {
                console.log("Could not load: " + configFile);
                if (window.vidiConfig.defaultConfig && (window.vidiConfig.defaultConfig !== configFile)) {
                    configFile = window.vidiConfig.defaultConfig;
                    if (!stop) {
                        stop = true;
                        loadConfig();
                    } else {
                        me.getVersion();
                    }
                } else {
                    me.getVersion();
                }
            }).done(function () {
                me.getVersion();
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
            me.getVersion();
        }
    },

    getVersion: function () {
        var me = this;
        $.getJSON(`/app/${urlparser.db}/public/version.json`, function (data) {
            window.vidiConfig.appVersion = data.version;
            window.vidiConfig.appExtensionsBuild = '0';
            if (`extensionsBuild` in data) {
                window.vidiConfig.appExtensionsBuild = data.extensionsBuild;
            }
        }).fail(function () {
            console.error(`Unable to detect the current application version`);
        }).always(function () {
            me.render();
        });
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
            window.vidiTimeout = 1000;
        } else {
            window.vidiTimeout = 0;
        }

        if (urlVars.l) {
            gc2i18n.dict._showLegend = urlVars.l;
        }
        if (urlVars.s) {
            gc2i18n.dict._displaySearch = urlVars.s || "inline";
        }
        if (urlVars.his) {
            gc2i18n.dict._displayhistory = urlVars.his || "inline";
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
            $.get("/api/template/" + urlparser.db + "/" + tmpl, function (template) {
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
        let humanUsedTemplate = !(urlVars.px && urlVars.py);
        if (`tmpl` in urlVars) {
            let supressedModalTemplates = DEFAULT_STARTUP_MODAL_SUPRESSION_TEMPLATES;
            if (`startupModalSupressionTemplates` in window.vidiConfig && Array.isArray(window.vidiConfig.startupModalSupressionTemplates)) {
                supressedModalTemplates = window.vidiConfig.startupModalSupressionTemplates;
            }

            supressedModalTemplates.map(item => {
                if (typeof item === 'string' || item instanceof String) {
                    // Exact string template name
                    if (urlVars.tmpl === item) {
                        humanUsedTemplate = false;
                    }
                } else if (`regularExpression` in item && item.regularExpression) {
                    // Regular expression
                    let regexp = new RegExp(item.name);
                    if (regexp.test(urlVars.tmpl)) {
                        humanUsedTemplate = false;
                    }
                } else {
                    console.warn(`Unable to process the startup modal supression template, should be either string or RegExp`);
                }
            });
        }

        if (humanUsedTemplate && window.vidiConfig.startUpModal) {
            if (!cookie.get("vidi-startup-message") || md5(window.vidiConfig.startUpModal) !== cookie.get("vidi-startup-message")) {
                if ($(`#startup-message-modal`).length === 0) {
                    $(`body`).append(`<div class="modal fade" id="startup-message-modal" tabindex="-1" role="dialog" aria-labelledby="startup-message-modalLabel">
                        <div class="modal-dialog" role="document">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h4 class="modal-title" id="startup-message-modalLabel">${__(`Startup message`)}</h4>
                                </div>
                                <div class="modal-body"></div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-default js-close-modal" data-dismiss="modal">${__(`Close`)}</button>
                                    <button type="button" class="btn btn-default js-close-modal-do-not-show" data-dismiss="modal">${__(`Close and do not show in the future`)}</button>
                                </div>
                            </div>
                        </div>
                    </div>`);
                }

                $(`#startup-message-modal`).find(`.modal-body`).html(window.vidiConfig.startUpModal);
                $(`#startup-message-modal`).find(`.js-close-modal`).click(() => {
                    $(`#startup-message-modal`).modal('show');
                });

                $(`#startup-message-modal`).find(`.js-close-modal-do-not-show`).click(() => {
                    $(`#startup-message-modal`).modal('hide');
                    cookie.set("vidi-startup-message", md5(window.vidiConfig.startUpModal), {expires: 90});
                });

                $(`#startup-message-modal`).modal('show');
            }
        }

        // Add the tooltip div
        // ===================

        $("body").append('<div id="tail" style="position: fixed; float: left; display: none"></div>');

        // Detect the database and schema
        let splitLocation = window.location.pathname.split(`/`);
        if (splitLocation.length === 4 || splitLocation.length === 5) {
            let database = splitLocation[2];
            let schema = splitLocation[3];
            if (!schema || schema.length === 0) {
                console.log(`Schema not provided in URL`);
            } else {
                window.vidiConfig.appSchema = schema;
            }
            if (!database || database.length === 0) {
                alert(`Could not detect databse. Check URL`);
            } else {
                window.vidiConfig.appDatabase = database;
            }
        } else {
            console.warn(`Unable to detect current database and schema`);
        }

        // Init the modules
        // ================

        modules.cloud.init();
        modules.state.setExtent();

        // Calling mandatory init method
        [`backboneEvents`, `socketId`, `bindEvent`, `baseLayer`, `infoClick`,
            `advancedInfo`, `draw`, `measurements`, `mapcontrols`, `stateSnapshots`, `print`, `layerTree`, `reset`].map(name => {
            modules[name].init();
        });

        /**
         * Fetch meta > initialize settings > create layer tree >
         * initialize state > load layers > initialize extensions > finish
         */
        modules.meta.init().then((schemataStr) => {
            return modules.setting.init(schemataStr);
        }).catch((error) => {
            console.log(error); // Stacktrace
            //alert("Vidi is loaded without schema. Can't set extent or add layers");
            backboneEvents.get().trigger("ready:meta");
        }).then(() => {
            return modules.layerTree.create();
        }).finally(() => {
            modules.state.init().then(() => {
                modules.state.listenAny(`extensions:initialized`, [`layerTree`]);

                try {

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
                        require('./../../extensions/!(watsonc)/browser/*.js', {glob: true});
                        require('./../../extensions/!(watsonc)/browser/*/*.js', {glob: true});
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
                            let enabledExtensionsCopy = JSON.parse(JSON.stringify(window.vidiConfig.enabledExtensions));
                            $.each(vidiConfig.extensions.browser, function (i, v) {
                                $.each(v[Object.keys(v)[0]], function (n, m) {
                                    if (window.vidiConfig.enabledExtensions.indexOf(Object.keys(v)[0]) > -1) {
                                        try {
                                            modules.extensions[Object.keys(v)[0]][m].init();
                                        } catch (e) {
                                            console.warn(`Module ${Object.keys(v)[0]} could not be initiated`)
                                        }

                                        let enabledExtensionIndex = enabledExtensionsCopy.indexOf(Object.keys(v)[0]);
                                        if (enabledExtensionIndex > -1) {
                                            enabledExtensionsCopy.splice(enabledExtensionIndex, 1);
                                        }
                                    }
                                })
                            });

                            if (enabledExtensionsCopy.length > 0) {
                                console.warn('Following extensions need to be enabled, but they were not initially compiled: ' + JSON.stringify(enabledExtensionsCopy));
                            }

                            // Show log in button if session module is enabled
                            if (window.vidiConfig.enabledExtensions.includes("session") && !enabledExtensionsCopy.includes("session")) {
                                $("#session").show();
                            }
                        }
                    }

                    $(window).resize(function () {
                        setTimeout(function () {
                            modules.cloud.get().map.invalidateSize();
                        }, 100);
                    });

                    backboneEvents.get().trigger(`extensions:initialized`);
                } catch (e) {
                    console.error("Could not perform application initialization", e.message, e);
                }
            });
        });

        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/service-worker.bundle.js').then((registration) => {
                let checkInterval = setInterval(() => {
                    if (navigator.serviceWorker.controller) {
                        console.log('Service worker was registered and activated');
                        backboneEvents.get().trigger(`ready:serviceWorker`);
                        clearInterval(checkInterval);
                    }
                }, 1000);
            }).catch(error => {
                console.error(`Unable to register the service worker, please load the application over HTTPS in order to use its full functionality`);
            });
        } else {
            console.warn(`Service workers are not supported in this browser, some features may be unavailable`);
        }

        if (window.localforage) {
            localforage.getItem('appVersion').then(versionValue => {
                localforage.getItem('appExtensionsBuild').then(extensionsBuildValue => {
                    if (versionValue === null) {
                        localforage.setItem('appVersion', window.vidiConfig.appVersion).then(() => {
                            localforage.setItem('appExtensionsBuild', window.vidiConfig.appExtensionsBuild).then(() => {
                                console.log(`Versioning: setting new application version (${window.vidiConfig.appVersion}, ${window.vidiConfig.appExtensionsBuild})`);
                            });
                        }).catch(error => {
                            throw new Error(`Unable to store current application version`);
                        });
                    } else {
                        // If two versions are correctly detected
                        if (semver.valid(window.vidiConfig.appVersion) !== null && semver.valid(versionValue) !== null) {
                            if (semver.gt(window.vidiConfig.appVersion, versionValue) ||
                                (window.vidiConfig.appVersion === versionValue && window.vidiConfig.appExtensionsBuild !== extensionsBuildValue)) {
                                $.snackbar({
                                    id: "snackbar-conflict",
                                    content: `Updating application to the newest version (current: ${versionValue}, extensions: ${extensionsBuildValue}, latest: ${window.vidiConfig.appVersion}, extensions: ${window.vidiConfig.appExtensionsBuild})?`,
                                    htmlAllowed: true,
                                    timeout: 2500
                                });
                                setTimeout(function () {
                                    let unregisteringRequests = [];
                                    // Unregister service worker
                                    navigator.serviceWorker.getRegistrations().then((registrations) => {
                                        for (let registration of registrations) {
                                            console.log(`Versioning: unregistering service worker`, registration);
                                            unregisteringRequests.push(registration.unregister());
                                            registration.unregister();
                                        }
                                    });
                                    Promise.all(unregisteringRequests).then((values) => {
                                        // Clear caches
                                        caches.keys().then(function (names) {
                                            for (let name of names) {
                                                console.log(`Versioning: clearing cache`, name);
                                                caches.delete(name);
                                            }
                                        });

                                        // Remove current app version
                                        localforage.removeItem('appVersion').then(() => {
                                            location.reload();
                                        });
                                    });
                                }, 3000);
                            } else {
                                console.info('Versioning: new application version is not available');
                            }
                        } else if (typeof value === "undefined" || semver.valid(value) === null) {
                            console.warn(`Seems like current application version is invalid, resetting it`);
                            localforage.setItem('appVersion', '1.0.0').then(() => {
                            }).catch(error => {
                                localforage.setItem('appExtensionsBuild', '0').then(() => {
                                }).catch(error => {
                                    throw new Error(`Unable to store current application version`);
                                });
                            });
                        }
                    }
                });
            });
        } else {
            throw new Error(`localforage is not available`);
        }
    }
};
