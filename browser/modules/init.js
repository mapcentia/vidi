/*
 * @author     Martin Høgh <mh@mapcentia.com>
 * @copyright  2013-2023 MapCentia ApS
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
let intervalId;

const semver = require('semver');
const md5 = require('md5');
const cookie = require('js-cookie');
const config = require('../../config/config.js');

import mustache from 'mustache';
import dayjs from "dayjs";
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

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
        // Set default config
        const defaults = {
            schemata: [],
            baseLayers: [],
            baseLayerGroups: [],
            autoPanPopup: false,
            crossMultiSelect: false,
            brandName: '',
            startUpModal: '',
            enabledExtensions: [],
            searchConfig: {},
            aboutBox: '',
            enabledSearch: 'google',
            removeDisabledLayersFromLegend: false,
            template: 'default.tmpl',
            enabledPrints: [],
            activateMainTab: 'layer',
            extensionConfig: {},
            singleTiled: true,
            doNotCloseLoadScreen: false,
            startupModalSupressionTemplates: [],
            cssFiles: [],
            dontUseAdvancedBaseLayerSwitcher: false,
            wmsUriReplace: null,
            infoClickCursorStyle: 'crosshair',
            featureInfoTableOnMap: false,
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
            forceOffCanvasInfo: false,
            showOffcanvas: false,
            expandFirstInLayerTree: false,
            advancedBaseLayerSwitcher: {
                mode: 3,
                default: 1,
                active: false
            },
            title: "MapCentia Vidi",
            autoUpdate: false,
            configSwitcher: false, // Use this only in build time configs,
            baselayerDrawer: false,
            theme: 'light',
            emptyInfoCallback: null,
            infoCallback: null,
            dateFormats: {},
            editorAlwaysActivated: true,
            statelessDraw: false,
            openLayerTreeGroups: [],
            crs: 'EPSG:3857',
            loadingTimeout: 30000,
            loadCheckingInterval: 15000,
        };
        // Set default for unset props
        for (let prop in defaults) {
            window.vidiConfig[prop] = typeof window.vidiConfig[prop] !== 'undefined' ? window.vidiConfig[prop] : defaults[prop];
        }
        // If Vidi does not load within 20 seconds, send the loaded message. This is to prevent print from locking up.
        // If Vidi loads, the timeout will be cleared in State
        window.loadingTimeout = setTimeout(() => {
            console.log("Timeout reached. Sending 'Vidi is now loaded' message");
        },  window.vidiConfig.loadingTimeout);

        // In a interval of x seconds, check if the app is still loading. If it is, send the 'still loading' message.
        const html = `<div class="toast-container position-fixed bottom-0 end-0 p-3 me-sm-5" style="z-index: 999999999">
                                    <div id="load-checking-toast" class="toast align-items-center text-bg-primary border-0" role="alert" aria-live="assertive"
                                         aria-atomic="true">
                                        <div class="d-flex">
                                            <div class="toast-body">
                                                <p>Vidi takes a long time to load. Update to clear caches and refresh. Cancel to wait.</p>
                                                <button class='btn btn-secondary' onclick="updateApp()" >${__('Update')}</button><button class='btn btn-primary close-info-toast'" >${__('Cancel')}</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>`;
        document.querySelector('body').insertAdjacentHTML('beforeend', html);
        const toast = new bootstrap.Toast(document.getElementById('load-checking-toast'),  {delay: 99999999, autohide: false});
        document.querySelector('.close-info-toast').onclick = function () {toast.hide()}
        window.loadCheckingInterval = setInterval(() => {
            if (!toast.isShown()) {
                toast.show();
            }
        }, window.vidiConfig.loadCheckingInterval)
        // Set session from URL
        if (typeof urlVars.session === "string") {
            const MAXAGE = (config?.sessionMaxAge || 86400) / 86400; // In days
            // Try to remove existing cookie
            document.cookie = 'connect.gc2=; Max-Age=0; path=/; domain=' + location.host;
            let options = {expires: MAXAGE};
            // if we are using https, set the secure and sameSite flags
            if (location.protocol === 'https:') {
                options.secure = true;
                options.sameSite = 'None';
            }
            cookie.set("connect.gc2", urlVars.session, options);
            // Remove session from the URL if not print
            if (!urlVars.px && !urlVars.py) {
                const params = new URLSearchParams(window.location.search);
                params.delete('session')
                const loc = window.location
                const newUrl = loc.origin + loc.pathname + (params.size >= 1 ? '?' + params.toString() : '')
                history.pushState(null, '', newUrl);
            }
        }
        // Set manifest
        const hostname = urlparser.hostname;
        const db = urlparser.db;
        let manifest = {
            "name": `${db} Vidi`,
            "short_name": `${db} Vidi`,
            "start_url": `${hostname}/app/${db}/`,
            "display": "standalone",
            "description": "A platform for building spatial data infrastructure and deploying browser based GIS",
            "icons": [
                {
                    "src": `${hostname}/images/512x512.png`,
                    "sizes": "512x512",
                    "type": "image/png"

                },
                {
                    "src": `${hostname}/images/192x192.png`,
                    "sizes": "192x192",
                    "type": "image/png"
                },
                {
                    "src": `${hostname}/images/48x48.png`,
                    "sizes": "48x48",
                    "type": "image/png"
                },

            ],
            "theme_color": "#ffffff",
            "background_color": "#ffffff"
        }
        const link = document.createElement("link");
        link.rel = "manifest";
        const stringManifest = JSON.stringify(manifest);
        link.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(stringManifest))
        document.head.appendChild(link);

        let loadConfig = function () {
            let configParam;
            if (configFile.startsWith("/")) {
                configParam = "/api/gc2/config/" + urlparser.db + "/" + configFile.split('/')[5]
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
                        me.render();
                    }
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
        // Register Handlebars helpers
        Handlebars.registerHelper("formatDate", function (datetime, format = null, inFormat = null) {
            if (datetime == null) {
                return null;
            }
            const dateFormats = window.vidiConfig.dateFormats;
            if (format !== null && dateFormats.hasOwnProperty(format)) {
                return dayjs(datetime.toString(), inFormat).format(dateFormats[format]);
            } else {
                return dayjs(datetime.toString(), inFormat).format(format);
            }
        });
        Handlebars.registerHelper('breakLines', function (text) {
            if (text == null) {
                return null;
            }
            text = Handlebars.Utils.escapeExpression(text);
            text = text.replace(/(\r\n|\n|\r)/gm, '<br>');
            return new Handlebars.SafeString(text);
        });
        Handlebars.registerHelper('replaceNull', function (value, text) {
            if (value === null) {
                return text;
            }
            return null;
        });
        Handlebars.registerHelper('formatDecimalNumber', function (value) {
            if (value === null) {
                return null;
            }
            return value.toString().replace('.', window.decimalSeparator);
        });

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
        const me = this;

        // Render template and set some styling
        // ====================================

        tmpl = window.vidiConfig.template;
        document.documentElement.setAttribute('data-bs-theme', window.vidiConfig.theme)

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
        gc2i18n.dict._displaySearch = urlVars?.sea || "inline";
        gc2i18n.dict._displayHistory = urlVars?.his || "inline";
        gc2i18n.dict._displayLegend = urlVars?.leg || "inline";
        gc2i18n.dict._displayLayer = urlVars?.lay || "inline";
        gc2i18n.dict._displayBackground = urlVars?.bac || "inline";
        gc2i18n.dict._displayFullscreen = urlVars?.ful || "inline";
        gc2i18n.dict._displayAbout = urlVars?.abo || "inline";
        gc2i18n.dict._displayLocation = urlVars?.loc || "inline";
        gc2i18n.dict._displayReset = urlVars?.res || "inline";
        gc2i18n.dict._displayMeasurement = urlVars?.mea || "inline";
        gc2i18n.dict._displayClear = urlVars?.cle || "inline";
        gc2i18n.dict._displayBox = urlVars?.box || "inline";
        gc2i18n.dict._displaySignin = urlVars?.sig ? urlVars.sig : !window.vidiConfig?.enabledExtensions.includes("session") ? "none" : "inline";
        gc2i18n.dict._displayScreenshot = urlVars?.scr || "inline";
        gc2i18n.dict._displayBrand = urlVars?.bra || "inline";
        gc2i18n.dict._displayToggler = urlVars?.tog || "inline";
        gc2i18n.dict._displayConfigSwitcher = window.vidiConfig.configSwitcher ? "inline" : "none";

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
                                    <button type="button" class="btn btn-secondary js-close-modal" data-bs-dismiss="modal">${__(`Close`)}</button>
                                    <button type="button" class="btn btn-outline-secondary js-close-modal-do-not-show" data-bs-dismiss="modal">${__(`Close and do not show in the future`)}</button>
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
            `advancedInfo`, `draw`, `measurements`, `mapcontrols`, `stateSnapshots`, `print`, `layerTree`, `reset`,
            `configSwitcher`].map(name => {
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


        if (urlVars.state || urlparser.hash.length === 0 && (!urlVars.initialFilter && !urlVars.dfi)) {
            console.log("Enable fast init")
            $("#loadscreen").fadeOut(200);
            initExtensions();
            // Check if there are set anything, which can result in loading schemata
            if (window.vidiConfig.configSwitcher && (!window.vidiConfig.schemata || window.vidiConfig.schemata.length === 0) && (!schema || schema.length === 0) &&
                urlparser.hash.length === 0 && Object.keys(urlVars).length === 0) {
                modules.configSwitcher.activate();
                return;
            }
            modules.state.init().then(() => {
                // Only fetch Meta and Settings if schemata pattern are use in either config or URL
                if (window.vidiConfig.schemata.length > 0 || (schema && schema.length > 0) || urlVars.sch) {
                    let schemataStr
                    if (typeof window.vidiConfig.schemata === "object" && window.vidiConfig.schemata.length > 0) {
                        schemataStr = window.vidiConfig.schemata.join(",");
                    } else {
                        schemataStr = schema;
                    }
                    // Settings
                    if (schemataStr) {
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
                    }
                    // Meta
                    modules.meta.init(null, false, true).then(() => {
                        backboneEvents.get().trigger("ready:meta");
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
                                    if (window.vidiConfig?.activeLayers?.length > 0) {
                                        modules.meta.getLayerNamesFromSchemata(window.vidiConfig.activeLayers.map(i => i.replace('v:', ''))).then(layers => {
                                            window.vidiConfig.activeLayers.forEach(i => {
                                                if (i.startsWith('v:')) {
                                                    layers.push(i);
                                                    const index = layers.indexOf(i.replace('v:', ''));
                                                    layers.splice(index, 1);
                                                }
                                            })
                                            console.info('Activating layers:', layers)
                                            layers.forEach((l) => {
                                                modules.switchLayer.init(l, true)
                                            })
                                            backboneEvents.get().trigger(`layerTree:activeLayersChange`);
                                        })
                                    }
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
            console.log("Disable fast init")
            modules.meta.init().then((schemataStr) => {
                return modules.setting.init(schemataStr);
            }).catch((error) => {
                console.log(error); // Stacktrace
                backboneEvents.get().trigger("ready:meta");
            }).then(() => {
                initExtensions();
                return modules.layerTree.create();
            }).finally(() => {
                backboneEvents.get().trigger("ready:meta");
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
        // Set crossMultiSelect to true if embed is enabled
        if (utils.isEmbedEnabled() && !window.vidiConfig?.featureInfoTableOnMap && !window.vidiConfig?.forceOffCanvasInfo) {
            window.vidiConfig.crossMultiSelect = true;
        }

        if (!window.vidiConfig.autoUpdate && !utils.isPWA()) {
            getVersion().then(() => checkVersion(true));
        } else {
            intervalId = setInterval(() => {
                getVersion().then(() => checkVersion());
            }, 30000);
        }

    },
};

const getVersion = function () {
    return new Promise((resolve, reject) => {
        fetch(`/app/${urlparser.db}/public/version.json?${new Date().getTime()}`)
            .then(response => response.json())
            .then(data => {
                window.vidiConfig.appVersion = data.version;
                window.vidiConfig.appExtensionsBuild = '0';
                if (`extensionsBuild` in data) {
                    window.vidiConfig.appExtensionsBuild = data.extensionsBuild;
                    resolve();
                }
            })
            .catch(() => {
                console.error(`1 Unable to detect the current application version`);
                reject();
            });
    })
}

const checkVersion = function (autoUpdate = false) {
    if (window.localforage) {
        localforage.getItem('appVersion').then(versionValue => {
            localforage.getItem('appExtensionsBuild').then(extensionsBuildValue => {
                if (versionValue === null) {
                    localforage.setItem('appVersion', window.vidiConfig.appVersion).then(() => {
                        localforage.setItem('appExtensionsBuild', window.vidiConfig.appExtensionsBuild).then(() => {
                            console.log(`Versioning: setting new application version (${window.vidiConfig.appVersion}, ${window.vidiConfig.appExtensionsBuild})`);
                        });
                    }).catch(error => {
                        console.error(`2 Unable to store current application version`, error);
                    });
                } else {
                    // If two versions are correctly detected
                    if (semver.valid(window.vidiConfig.appVersion) !== null && semver.valid(versionValue) !== null) {
                        if (semver.gt(window.vidiConfig.appVersion, versionValue) ||
                            (window.vidiConfig.appVersion === versionValue && window.vidiConfig.appExtensionsBuild !== extensionsBuildValue)) {
                            if (autoUpdate) {
                                setTimeout(() => updateApp(), 1000);
                            } else {
                                try {
                                    const e = new bootstrap.Toast(document.getElementById('update-toast'), {
                                        delay: 9000000,
                                        autohide: false
                                    });
                                    e.show();
                                    document.getElementById('update-app-btn').addEventListener('click', () => updateApp());
                                } catch (err) {
                                    console.log("Info toast could not be shown");
                                }
                            }
                            clearInterval(intervalId);
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

const updateApp = function () {
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
}
