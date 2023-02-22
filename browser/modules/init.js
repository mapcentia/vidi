/*
 * @author     Martin Høgh <mh@mapcentia.com>
 * @copyright  2013-2019 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

'use strict';

import {fallback} from "async/internal/setImmediate";

let modules;
let tmpl;
const urlparser = require('./../modules/urlparser');
const urlVars = urlparser.urlVars;
let backboneEvents;
let utils;

const semver = require('semver');
const md5 = require('md5');
const cookie = require('js-cookie');

import mustache from 'mustache';

module.exports = {

    /**
     *
     * @param o
     * @returns {exports}
     */
    set: function (o) {
        modules = o;
        backboneEvents = o.backboneEvents;
        utils = o.utils;
        return this;
    },

    /**
     *
     */
    init: function () {
        let me = this, configFile, stop = false;
        const defaults = {
            schemata: [],
            baseLayers: [],
            autoPanPopup: false,
            crossMultiSelect: false,
            brandName: '',
            startUpModal: '',
            enabledExtensions: [],
            searchConfig: [],
            aboutBox: '',
            enabledSearch: 'google',
            removeDisabledLayersFromLegend: false,
            template: 'default.tmpl',
            enabledPrints: [],
            activateMainTab: null,
            extensionConfig: {},
            singleTiled: true,
            doNotCloseLoadScreen: false,
            startupModalSupressionTemplates: [],
            cssFiles: [],
            dontUseAdvancedBaseLayerSwitcher: false,
            wmsUriReplace: null,
            infoClickCursorStyle: 'crosshair',
            featureInfoTableOnMap: false,
            popupDraggable: false,
            measurementMDecimals: 1,
            measurementKmDecimals: 2,
            showLayerGroupCheckbox: false,
            popupDraggable: false,
            activeLayers: [],
            initFunction: null,
            snapshot: null,
            vectorTable: {
                position: 'right',
                width: '30%',
                height: '250px'
            },
            initZoomCenter: null,
            title: "MapCentia Vidi",
        };
        // Set default for unset props
        for (let prop in defaults) {
            window.vidiConfig[prop] = typeof window.vidiConfig[prop] !== 'undefined' ? window.vidiConfig[prop] : defaults[prop];
        }
        (function poll() {
            if (typeof L.control.locate !== "undefined") {
                let loadConfig = function () {
                    let configParam;
                    if (configFile.startsWith("/")) {
                        configParam = "/api/localconfig?file=" + configFile
                    } else {
                        configParam = "/api/config/" + urlparser.db + "/" + configFile;
                    }
                    $.getJSON(configParam, function (data) {
                        for (let prop in defaults) {
                            window.vidiConfig[prop] = typeof data[prop] !== 'undefined' ? data[prop] : window.vidiConfig[prop];
                        }
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
            } else {
                console.log("polling...");
                setTimeout(() => {
                    poll();
                }, 10)
            }
        }());
    },

    getVersion: function () {
        let me = this;
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
        const me = this;

        // Render template and set some styling
        // ====================================

        tmpl = window.vidiConfig.template;

        // Check if template is set in URL vars
        // ====================================

        if (typeof urlVars.tmpl !== "undefined") {
            let par = urlVars.tmpl.split("#");
            if (par.length > 1) {
                par.pop();
            }
            tmpl = par.join();
            window.vidiConfig.template = tmpl;
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
            gc2i18n.dict.printFrame = parseInt(decodeURIComponent(urlVars.frame)) + 1;
            gc2i18n.dict.showFrameNumber = decodeURIComponent(urlVars.frameN) !== "1";
            window.vidiTimeout = 1000;
        } else {
            window.vidiTimeout = 0;
        }

        if (urlVars.l) {
            gc2i18n.dict._showLegend = urlVars.l;
        }

        gc2i18n.dict._showHeader = urlVars.h || "inline";
        gc2i18n.dict.brandName = window.vidiConfig.brandName;
        gc2i18n.dict.aboutBox = window.vidiConfig.aboutBox;

        // Start of embed settings for display of buttons
        if (urlVars.sea) {
            gc2i18n.dict._displaySearch = urlVars.sea || "inline";
        }
        if (urlVars.his) {
            gc2i18n.dict._displayHistory = urlVars.his || "inline";
        }
        if (urlVars.leg) {
            gc2i18n.dict._displayLegend = urlVars.leg || "inline";
        }
        if (urlVars.lay) {
            gc2i18n.dict._displayLayer = urlVars.lay || "inline";
        }
        if (urlVars.bac) {
            gc2i18n.dict._displayBackground = urlVars.bac || "inline";
        }
        if (urlVars.ful) {
            gc2i18n.dict._displayFullscreen = urlVars.ful || "inline";
        }
        if (urlVars.abo) {
            gc2i18n.dict._displayAbout = urlVars.abo || "inline";
        }
        if (urlVars.loc) {
            gc2i18n.dict._displayLocation = urlVars.loc || "inline";
        }

        // Render the page
        // ===============

        if (typeof Templates[tmpl] !== "undefined") {
            $("#main-container").html(Templates[tmpl].render(gc2i18n.dict));
            console.info("Using pre-processed template: " + tmpl);
            me.startApp();
        } else {
            $.get("/api/template/" + urlparser.db + "/" + tmpl, function (template) {
                const rendered = mustache.render(template, gc2i18n.dict);
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
        document.title = window.vidiConfig.title;
        let humanUsedTemplate = !(urlVars.px && urlVars.py), schema;
        if (`tmpl` in urlVars) {
            let supressedModalTemplates = window.vidiConfig.startupModalSupressionTemplates;
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

        // Load css files
        // ==============

        window.vidiConfig.cssFiles.forEach((file) => {
            let url = `/api/css/${urlparser.db}/${file}`;
            $("<link/>", {
                rel: "stylesheet",
                type: "text/css",
                href: url
            }).appendTo("head");
        });

        // Add the tooltip div
        // ===================

        $("body").append('<div id="tail" style="position: fixed; float: left; display: none"></div>');

        // Detect the database and schema
        let splitLocation = window.location.pathname.split(`/`);
        if (splitLocation.length === 4 || splitLocation.length === 5) {
            let database = splitLocation[2];
            schema = splitLocation[3];
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
        [`anchor`, `backboneEvents`, `socketId`, `bindEvent`, `baseLayer`, `infoClick`,
            `advancedInfo`, `draw`, `measurements`, `mapcontrols`, `stateSnapshots`, `print`, `layerTree`, `reset`].map(name => {
            modules[name].init();
        });

        const initExtensions = () => {
            try {

                // Require search module
                // =====================

                // Hack to compile Glob files. Don´t call this function!
                function ಠ_ಠ() {
                    require('./search/*.js', {mode: 'expand'});
                }

                if (typeof vidiConfig.searchModules !== "undefined") {
                    $.each(vidiConfig.searchModules, function (i, v) {
                        modules.search[v] = require('./search/' + v + '.js');
                        modules.search[v].set(modules);
                    });
                    modules.search[window.vidiConfig.enabledSearch].init(null, null, null, null, 'init');
                }

                // Require extensions modules
                // ==========================

                //Hack to compile Glob files. Don´t call this function!
                function ಠ_ಠ_() {
                    require('./../../extensions/*/browser/*.js', {mode: 'expand'});
                    require('./../../extensions/*/browser/*/*.js', {mode: 'expand'});

                    // require('./../../extensions/!(watsonc)/browser/*.js', {mode: 'expand'});
                    // require('./../../extensions/!(watsonc)/browser/*/*.js', {mode: 'expand'});
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
                                        console.error(e);
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
                        if (window.vidiConfig.enabledExtensions.indexOf("session") > -1 && !enabledExtensionsCopy.indexOf("session") > -1) {
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
        }

        /**
         * TODO remove if
         */


        if (urlVars.state || urlparser.hash.length === 0) {
            console.log("Using fast init")
            $("#loadscreen").fadeOut(200);
            initExtensions();
            modules.state.init().then(() => {
                // Only fetch Meta and Settings if schemata pattern are use in either config or URL
                if (window.vidiConfig.schemata.length > 0 || (schema && schema.length > 0)) {
                    let schemataStr
                    if (typeof window.vidiConfig.schemata === "object" && window.vidiConfig.schemata.length > 0) {
                        schemataStr = window.vidiConfig.schemata.join(",");
                    } else {
                        schemataStr = schema;
                    }
                    // Settings
                    modules.setting.init(schemataStr).then(() => {
                        const maxBounds = modules.setting.getMaxBounds();
                        if (maxBounds) {
                            modules.cloud.get().setMaxBounds(maxBounds);
                        }
                        if (!utils.parseZoomCenter(window.vidiConfig?.initZoomCenter) && !urlVars.state) {
                            const extent = modules.setting.getExtent();
                            if (extent !== null) {
                                modules.cloud.get().zoomToExtent(extent);
                            } else {
                                modules.cloud.get().zoomToExtent();
                            }
                        }
                    })
                    // Meta
                    modules.meta.init(null, false, true).then(() => {
                        modules.state.getState().then(st => {
                            // Don't recreate SQL store from snapshot
                            if (!st.modules?.layerTree) {
                                st.modules.layerTree = {};
                            }
                            // Set activeLayers from config if not snapshot
                            if (!urlVars.state) {
                                st.modules.layerTree.activeLayers = window.vidiConfig.activeLayers;
                            }
                            modules.layerTree.setRecreateStores(false);
                            modules.layerTree.applyState(st.modules.layerTree, true).then(() => {
                                modules.layerTree.setRecreateStores(true);
                                // Switch on activeLayers from config if not snapshot
                                if (!urlVars.state) {
                                    st.modules.layerTree.activeLayers.forEach((l) => {
                                        modules.switchLayer.init(l, true)
                                    })
                                }
                            });
                        })
                    }).catch((error) => {
                        console.log(error); // Stacktrace
                        backboneEvents.get().trigger("ready:meta");
                    })
                }
            }).catch((error) => {
                console.error(error)
            })
        } else {
            modules.meta.init().then((schemataStr) => {
                return modules.setting.init(schemataStr);
            }).catch((error) => {
                console.log(error); // Stacktrace
                backboneEvents.get().trigger("ready:meta");
            }).then(() => {
                initExtensions();
                return modules.layerTree.create();
            }).finally(() => {
                $("#loadscreen").fadeOut(200);
                modules.state.init().then(() => {
                    modules.state.listenAny(`extensions:initialized`, [`layerTree`]);
                }).catch((error) => {
                    console.error(error)
                });
            }).catch((error) => {
                console.error(error)
            });
        }
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/service-worker.bundle.js').then((registration) => {
                let checkInterval = setInterval(() => {
                    if (navigator.serviceWorker.controller) {
                        console.log('Service worker was registered and activated');
                        backboneEvents.get().trigger(`ready:serviceWorker`);
                        clearInterval(checkInterval);
                    } else {
                        navigator.serviceWorker.ready.then(() => {
                            registration.active.postMessage("claimMe");
                        });
                    }
                }, 1000);
            }).catch(error => {
                console.error(error);
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
                            console.error(`Unable to store current application version`, error);
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
                                    Promise.all(unregisteringRequests).then(() => {
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
                            }).catch(() => {
                                localforage.setItem('appExtensionsBuild', '0').then(() => {
                                }).catch(error => {
                                    console.error(`Unable to store current application version`, error);
                                });
                            });
                        }
                    }
                });
            }).catch(error => {
                console.error(`Can't get item from localforage`, error);
            });
        } else {
            console.error(`localforage is not available`);
        }
    }
};
