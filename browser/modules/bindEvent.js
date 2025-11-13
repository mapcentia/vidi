/*
 * @author     Martin Høgh <mh@mapcentia.com>
 * @copyright  2013-2021 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

'use strict';

import {LAYER_TYPE_DEFAULT} from './layerTree/constants';
import legend from './legend';
import {NO_GUI_FADE} from "./constants";

require('dom-shims');
require('arrive');
const layerTreeUtils = require('./layerTree/utils');
const APIBridgeSingletone = require('./api-bridge');
let advancedInfo, cloud, switchLayer, meta, utils;
let apiBridgeInstance = false;
let backboneEvents;
let pushState;
let layerTree;
let layers;
let infoClick;
let setting;
let state;
let sqlQuery;
let applicationModules = false;
let isStarted = false;
let readyCallbackIsfired = false;
let groupsIsOpened = false;
let urlVars = urlparser.urlVars;

let mainLayerOffcanvas;
let offcanvasInfo;


/**
 *
 * @type {{set: module.exports.set, init: module.exports.init}}
 */
module.exports = {
    set: function (modules) {
        applicationModules = modules;
        advancedInfo = modules.advancedInfo;
        print = modules.print;
        switchLayer = modules.switchLayer;
        cloud = modules.cloud;
        meta = modules.meta;
        pushState = modules.pushState;
        layerTree = modules.layerTree;
        layers = modules.layers;
        infoClick = modules.infoClick;
        backboneEvents = modules.backboneEvents;
        setting = modules.setting;
        state = modules.state;
        utils = modules.utils;
        sqlQuery = modules.sqlQuery;
        return this;
    },
    init: function () {
        apiBridgeInstance = APIBridgeSingletone();

        try {
            mainLayerOffcanvas = new bootstrap.Offcanvas('#mainLayerOffcanvas');
            offcanvasInfo = new bootstrap.Offcanvas('#offcanvasLayerDesc');
            document.getElementById('mainLayerOffcanvas').addEventListener('shown.bs.offcanvas', event => {
                document.querySelector("#offcanvasLayerControlBtn .bi-arrow-bar-left")?.classList.remove("d-none");
                document.querySelector("#offcanvasLayerControlBtn .bi-arrow-bar-right")?.classList.add("d-none");
            })
            document.getElementById('mainLayerOffcanvas').addEventListener('hidden.bs.offcanvas', event => {
                document.querySelector("#offcanvasLayerControlBtn .bi-arrow-bar-right").classList.remove("d-none");
                document.querySelector("#offcanvasLayerControlBtn .bi-arrow-bar-left").classList.add("d-none");
            })
            $("#offcanvasLayerControlBtn").on("click", () => {
                mainLayerOffcanvas.toggle()
            });
            if (window.vidiConfig.showOffcanvas === true ||
                ((window.vidiConfig.showOffcanvas === 'mobile' || window.vidiConfig.showOffcanvas === 'mobil') && window.screen.width > 700)
            ) {
                mainLayerOffcanvas.show();
            }
        } catch (e) {

        }

        let doneL = false, doneB = false, loadingL = 0, loadingB = 0;
        const fadeWhenDraggingClass = $(".fade-then-dragging");

        cloud.get().on('dragend', function () {
            pushState.init();
        });
        cloud.get().on('moveend', function () {
            pushState.init();
        });
        cloud.get().on('move', function () {
            $('#tail').fadeOut(100);
        });

        // Define how we want the menu to fade out
        let fadeOutMenu = function (fadeWhenDraggingClass) {
            fadeWhenDraggingClass.animate({opacity: '0.3'}, 200);
            fadeWhenDraggingClass.css('pointer-events', 'none');
        }

        // Define how we want the menu to fade in
        let fadeInMenu = function (fadeWhenDraggingClass) {
            fadeWhenDraggingClass.animate({opacity: '1'}, 200);
            fadeWhenDraggingClass.css('pointer-events', 'all');
        }

        if ((window.vidiConfig.mode & NO_GUI_FADE) === 0) {
            cloud.get().on('dragstart', function () {
                fadeOutMenu(fadeWhenDraggingClass);
            });

            cloud.get().on('dragend', function () {
                fadeInMenu(fadeWhenDraggingClass);
            });
        }

        /**
         * Triggered when the layer control is changed in any module
         */
        $(document).arrive('[data-gc2-id]', function (e, data) {
            $(this).off('change');
            $(this).on('change', function (e) {
                let prefix = '';
                let doNotLegend = false;
                if ($(this).data(`gc2-layer-type`)) {
                    const type = $(e.target).data('gc2-layer-type');
                    prefix = type !== 't' ? type + ':' : '';
                    if (prefix === LAYER_TYPE_DEFAULT + `:`) {
                        prefix = ``;
                    }

                    if (data) {
                        doNotLegend = data.doNotLegend;
                    }
                }

                switchLayer.init(prefix + $(e.target).attr(`data-gc2-id`), $(e.target).prop(`checked`), doNotLegend);
                e.stopPropagation();

                backboneEvents.get().trigger(`layerTree:activeLayersChange`);
            });
        });

        $(document).arrive('[data-gc2-group-name]', function () {
            $(this).on('change', function (e) {
                let prefix;
                let isChecked = $(e.target).prop(`checked`);
                let groupName = $(this).data(`gc2-group-name`);
                meta.getMetaData().data.filter((e) => {
                    if (e.layergroup === groupName) {
                        let parsedMeta = layerTree.parseLayerMeta(e);
                        prefix = parsedMeta?.default_layer_type && parsedMeta.default_layer_type !== 't' ? parsedMeta.default_layer_type + ':' : '';
                        setTimeout(() => {
                            switchLayer.init(prefix + e.f_table_schema + "." + e.f_table_name, isChecked, true, false);
                            legend.init();
                        }, 1)
                        return true;
                    }
                })
                e.stopPropagation();
                backboneEvents.get().trigger(`layerTree:activeLayersChange`);
            });
        });

        $(document).arrive('[data-gc2-subgroup-name]', function () {
            $(this).on('change', function (e) {
                let prefix = '';
                let isChecked = $(e.target).prop(`checked`);
                let subGroupName = $(this).data(`gc2-subgroup-name`).toString();
                let subGroupLevel = $(this).data(`gc2-subgroup-level`).toString();
                let layerGroup = $(this).closest('.card-body').data('gc2-group-id').toString();
                meta.getMetaData().data.forEach(e => {
                    let parsedMeta = layerTree.parseLayerMeta(e);
                    if (parsedMeta?.vidi_sub_group?.split("|")[subGroupLevel] === subGroupName && e.layergroup === layerGroup) {
                        prefix = parsedMeta?.default_layer_type && parsedMeta.default_layer_type !== 't' ? parsedMeta.default_layer_type + ':' : '';
                        switchLayer.init(prefix + e.f_table_schema + "." + e.f_table_name, isChecked, false);
                    }
                })
                e.stopPropagation();
                backboneEvents.get().trigger(`layerTree:activeLayersChange`);
            });
        });

        $('.searchclear').on('click', function () {
            backboneEvents.get().trigger('clear:search');
        });
        $(document).arrive('.searchclear', function () {
            $(this).on('click', function () {
                backboneEvents.get().trigger('clear:search');
            });
        });

        // Toggle top group checkboxes when layer tree is ready
        backboneEvents.get().on("layerTree:ready", function () {
            let groups = [];
            meta.getMetaData().data.forEach(e => {
                if (e.layergroup && !groups.includes(e.layergroup)) {
                    groups.push(e.layergroup);
                }
            })
            groups.forEach(e => {
                layerTree.toggleGroupCheckBoxes(e, null)
            })
        });

        backboneEvents.get().on("allDoneLoading:layers", function () {
            const openFirstIfNotOpen = () => {
                setTimeout(()=> {
                    const e = document.querySelector('.js-toggle-layer-panel');
                    if (window.vidiConfig.expandFirstInLayerTree === true && e?.classList?.contains("collapsed")) {
                        e.click();
                    }
                }, 0)
            }
            const openLayerTreeGroupsIfNotOpen = () => {
                setTimeout(()=> {
                    if (window.vidiConfig.openLayerTreeGroups.length > 0) {
                        window.vidiConfig.openLayerTreeGroups.forEach(g => {
                            const e = document.querySelector(`[data-gc2-group-id="${g}"] .js-toggle-layer-panel`);
                            if (e?.classList?.contains("collapsed")) {
                                e.click();
                            }
                        })
                    }
                }, 0)
            }
            if (!isStarted) {
                isStarted = true;
                openFirstIfNotOpen();
                openLayerTreeGroupsIfNotOpen();

            } else {
                if (!groupsIsOpened) {
                    openFirstIfNotOpen();
                    openLayerTreeGroupsIfNotOpen();
                    groupsIsOpened = true;
                }
                if (!readyCallbackIsfired && urlVars?.readyCallback) {
                    try {
                        if (state.activeLayersInSnapshot()) {
                            window.parent.postMessage({
                                type: "snapshotLayersCallback",
                                method: urlVars.readyCallback
                            }, "*");
                            readyCallbackIsfired = true;
                        }
                    } catch (e) {
                    }
                }
            }
        });

        // Clear all query layers and deactivate tools
        // ===========================================
        backboneEvents.get().on('sqlQuery:clear', () => {
            console.info('Resting SQL Query');
            infoClick.reset();
            advancedInfo.reset();
            layerTree.resetSearch();
        });

        // Layer loading
        // =============
        backboneEvents.get().on('startLoading:layers', function (e) {
            console.log('Start loading: ' + e);
            doneL = false;
            loadingL = true;
            $('.loadingIndicator').fadeIn(200);
        });

        backboneEvents.get().on('startLoading:setBaselayer', function (e) {
            console.log('Start loading base layer: ' + e);
            doneB = false;
            loadingB = true;
            $('.loadingIndicator').fadeIn(200);
        });

        backboneEvents.get().on('doneLoading:layers', function (e) {
            console.log('Done loading: ' + e);
            if (layers.getCountLoading() === 0) {
                layers.resetCount();
                doneL = true;
                loadingL = false;

                if ((doneL && doneB) || loadingB === false) {
                    console.log('Setting timeout to ' + window.vidiTimeout + 'ms');
                    setTimeout(function () {
                        console.info('Layers all loaded L');
                        backboneEvents.get().trigger('allDoneLoading:layers');
                        doneB = doneL = false;
                        $('.loadingIndicator').fadeOut(200);
                    }, window.vidiTimeout)
                }
            }
        });

        backboneEvents.get().on('doneLoading:setBaselayer', function (e) {
            console.log('Done loading base layer: ' + e);
            doneB = true;
            loadingB = false;

            if ((doneL && doneB) || loadingL === false || layers.getCountLoading() === 0) {
                console.log('Setting timeout to ' + window.vidiTimeout + 'ms');
                setTimeout(function () {
                    console.info('Layers all loaded B');
                    backboneEvents.get().trigger('allDoneLoading:layers');
                    doneB = doneL = false;
                    $('.loadingIndicator').fadeOut(200);
                }, window.vidiTimeout)
            }
        });

        $(document).on('mousemove.tail', function (e) {
            $('#tail').css({
                left: e.pageX + 20,
                top: e.pageY
            });
        });

        backboneEvents.get().on('refresh:auth', function () {
            apiBridgeInstance.resubmitSkippedFeatures();
        });

        // Refresh browser state. E.g. after a session start
        // =================================================
        backboneEvents.get().on('refresh:meta', function () {
            meta.init(null, false, false).then(() => {
                    backboneEvents.get().trigger('ready:meta');
                    layerTree.create(false, [], true).then(() => {
                        // Toggle active layers, so protected layers will be reevaluated
                        layerTree.getActiveLayers().forEach(l => {
                            switchLayer.init(l, false).then(() => {
                                switchLayer.init(l, true);
                            });
                        })
                        if (!urlVars.state) {
                            if (window.vidiConfig?.activeLayers?.length > 0) {
                                meta.getLayerNamesFromSchemata(window.vidiConfig.activeLayers.map(i => i.replace('v:', ''))).then(layers => {
                                    window.vidiConfig.activeLayers.forEach(i => {
                                        if (i.startsWith('v:')) {
                                            layers.push(i);
                                            const index = layers.indexOf(i.replace('v:', ''));
                                            layers.splice(index, 1);
                                        }
                                    })
                                    console.info('Activating layers:', layers)
                                    layers.forEach((l) => {
                                        // Don't activate layer already active
                                        if (!layerTree.getActiveLayers().includes(l)) {
                                            switchLayer.init(l, false).then(() => {
                                                switchLayer.init(l, true);
                                            });
                                        }
                                    })
                                    backboneEvents.get().trigger(`layerTree:activeLayersChange`);
                                })
                            }
                        }
                    });
                }
            );
        });

        // Init some GUI stuff after modules are loaded
        // ============================================
        // $('[data-toggle=tooltip]').tooltip();

        touchScroll('.tab-pane');
        touchScroll('#info-modal-body-wrapper');
        $('#loadscreentext').html(__('Loading data'));

        backboneEvents.get().on(`extensions:initialized`, () => {
            if (window.vidiConfig.activateMainTab) {
                // Activate tabs
                const triggerTabList = document.querySelectorAll('#main-tabs a')
                triggerTabList.forEach(triggerEl => {
                    const tabTrigger = new bootstrap.Tab(triggerEl)
                    triggerEl.addEventListener('click', event => {
                        event.preventDefault()
                        tabTrigger.show()
                    })
                })
                const e = document.querySelector('#main-tabs a[href="#' + window.vidiConfig.activateMainTab + '-content"]');
                if (e) {
                    bootstrap.Tab.getInstance(e).show();
                    setTimeout(() => {
                        e.click();
                    }, 100)
                } else {
                    console.warn(`Unable to locate specified activateMainTab ${window.vidiConfig.activateMainTab}`)
                }
            }
        })

        $(document).arrive('[data-toggle="tooltip"]', function () {
            $(this).tooltip()
        });

        $(document).arrive('[data-scale-ul]', function () {
            $(this).on('click', function () {
                $('#select-scale').val($(this).data('scale-ul')).trigger('change');
            });
        });

        const legendToast = document.getElementById('legend-toast');
        const legendBtn = document.getElementById("btn-show-legend-in-map");
        legendToast?.addEventListener('hidden.bs.toast', () => {
            $('#legend-content').append($('#legend'));
            legendBtn.classList.remove("btn-secondary");
            legendBtn.classList.add("btn-outline-secondary");
        })
        legendToast?.addEventListener('shown.bs.toast', () => {
            $('#legend-toast-body').append($('#legend'));
            legendBtn.classList.add("btn-secondary");
            legendBtn.classList.remove("btn-outline-secondary");
        })
        legendBtn?.addEventListener("click", (el) => {
            const t = new bootstrap.Toast(legendToast, {autohide: false});
            if (t.isShown()) {
                t.hide();
            } else {
                t.show();
            }
        })

        // Hiding all panels with visible modules
        backboneEvents.get().on('hide:all', () => {
            const e = $('.modal-header > button[class="close"]');
            if (e.is(':visible')) {
                e.trigger(`click`);
            }
        });

        // Module icons
        $('#main-tabs a').on('click', function () {
            backboneEvents.get().trigger('off:all');
            let moduleTitle = $(this).data('module-title');
            let e = $('#mainLayerOffcanvas');
            e.find('.js-module-title').text('');
            if (moduleTitle) {
                e.find('.js-module-title').text(moduleTitle);
            }
            let moduleId = $(this).data('module-id');
            let moduleIgnoreErrors = !!$(this).data('module-ignore-errors');
            setTimeout(() => {
                if (moduleId && moduleId !== '') {
                    if (moduleId in applicationModules) {
                        backboneEvents.get().trigger(`on:${moduleId}`);
                    } else {
                        if (moduleIgnoreErrors) {
                            backboneEvents.get().trigger(`on:${moduleId}`);
                        } else {
                            console.error(`Module ${moduleId} was not found`);
                        }
                    }
                }
            }, 100);

            // let id = ($(this));
            // $('#side-panel ul li').removeClass('active');
            // id.addClass('active');
        });

        // Listen for extensions
        $(document).arrive('#main-tabs a', function () {
            $(this).on('click', function () {
                backboneEvents.get().trigger('off:all');
                const moduleId = $(this).data('module-id');
                const moduleTitle = $(this).data('module-title');
                const e = $('#mainLayerOffcanvas');
                e.find('.js-module-title').text('');
                if (moduleTitle) {
                    e.find('.js-module-title').text(moduleTitle);
                }
                setTimeout(() => {
                    if (moduleId && moduleId !== '') {
                        if (moduleId in applicationModules.extensions) {
                            backboneEvents.get().trigger(`on:${moduleId}`);
                        } else {
                            console.error(`Module ${moduleId} was not found`);
                        }
                    }
                }, 100);
                let id = ($(this));
                $('#side-panel ul li').removeClass('active');
                id.addClass('active');
            });
        })

        // Check if active vector layers have max/min zoom values
        let orginallayers = {};
        const map = cloud.get().map;
        const moveEndEvent = () => {
            const layers = map._layers;
            for (let key in layers) {
                if (layers.hasOwnProperty(key)) {
                    const layer = layers[key];
                    if (layer?.id?.startsWith("v:") || layer?.id?.startsWith("HL:")) {
                        orginallayers[layer.id] = jQuery.extend(true, {}, layer._layers);
                        if (typeof layer?.minZoom === 'number' || typeof layer?.maxZoom === 'number') {
                            if (map.getZoom() < layer.minZoom || map.getZoom() >= layer.maxZoom) {
                                $.each(layer._layers, function (i, v) {
                                    try {
                                        map.removeLayer(v);
                                    } catch (e) {
                                        // console.error(e)
                                    }
                                })
                            } else {
                                $.each(orginallayers[layer.id], function (i, v) {
                                    map.addLayer(v);
                                })
                            }
                        }
                    }
                }
            }
        }
        map.on('moveend layeradd', moveEndEvent);

        (() => {
            const themeSwitcher = document.querySelector('#bd-theme')
            if (!themeSwitcher) {
                return
            }
            const getStoredTheme = () => localStorage.getItem('theme')
            const setStoredTheme = theme => localStorage.setItem('theme', theme)

            const getPreferredTheme = () => {
                const storedTheme = getStoredTheme()
                if (storedTheme) {
                    return storedTheme
                }

                return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
            }

            const setTheme = theme => {
                if (theme === 'auto') {
                    document.documentElement.setAttribute('data-bs-theme', (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'))
                } else {
                    document.documentElement.setAttribute('data-bs-theme', theme)
                }
            }

            setTheme(getPreferredTheme())
            const showActiveTheme = (theme, focus = false) => {
                const themeSwitcherText = document.querySelector('#bd-theme-text')
                const activeThemeIcon = document.querySelector('.theme-icon-active use')
                const btnToActive = document.querySelector(`[data-bs-theme-value="${theme}"]`)
                const svgOfActiveBtn = btnToActive.querySelector('svg use').getAttribute('href')
                document.querySelectorAll('[data-bs-theme-value]').forEach(element => {
                    element.classList.remove('active')
                    element.setAttribute('aria-pressed', 'false')
                })
                btnToActive.classList.add('active')
                btnToActive.setAttribute('aria-pressed', 'true')
                activeThemeIcon.setAttribute('href', svgOfActiveBtn)
                const themeSwitcherLabel = `${themeSwitcherText.textContent} (${btnToActive.dataset.bsThemeValue})`
                themeSwitcher.setAttribute('aria-label', themeSwitcherLabel)

                if (focus) {
                    themeSwitcher.focus()
                }
            }
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
                const storedTheme = getStoredTheme()
                if (storedTheme !== 'light' && storedTheme !== 'dark') {
                    setTheme(getPreferredTheme())
                }
            })
            showActiveTheme(getPreferredTheme())
            document.querySelectorAll('[data-bs-theme-value]')
                .forEach(toggle => {
                    toggle.addEventListener('click', () => {
                        const theme = toggle.getAttribute('data-bs-theme-value')
                        setStoredTheme(theme)
                        setTheme(theme)
                        showActiveTheme(theme, true)
                    })
                })
        })()
    },
    showOffcanvasLayers: () => {
        mainLayerOffcanvas.show()
    },
    hideOffcanvasLayers: () => {
        mainLayerOffcanvas.hide()
    },
    showOffcanvasInfo: () => {
        offcanvasInfo.show();
    },
    hideOffcanvasInfo: () => {
        offcanvasInfo.hide();
    }

}
