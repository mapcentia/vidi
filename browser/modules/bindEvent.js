/*
 * @author     Martin Høgh <mh@mapcentia.com>
 * @copyright  2013-2021 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

'use strict';

import {LAYER_TYPE_DEFAULT} from './layerTree/constants';

require('dom-shims');
require('arrive');
const config = require('../../config/config.js');
const layerTreeUtils = require('./layerTree/utils');
const LEFT_SLIDE_WIDTHS = config?.leftSlideWidths || [300, 400, 550];
const BUTTON_WITH = 24;
const mobile = require('is-mobile');
const jrespond = require('jrespond'); //TODO Change to Window.matchMedia()
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
let urlVars = urlparser.urlVars;


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

        cloud.get().on('dragstart', function () {
            fadeWhenDraggingClass.animate({opacity: '0.3'}, 200);
            fadeWhenDraggingClass.css('pointer-events', 'none');
        });

        cloud.get().on('dragend', function () {
            fadeWhenDraggingClass.animate({opacity: '1'}, 200);
            fadeWhenDraggingClass.css('pointer-events', 'all');

        });

        /**
         * Triggered when the layer control is changed in any module
         */
        $(document).arrive('[data-gc2-id]', function (e, data) {
            $(this).on('change', function (e) {
                let prefix = '';
                let doNotLegend = false;
                if ($(this).data(`gc2-layer-type`)) {
                    prefix = $(e.target).data('gc2-layer-type') + `:`;
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
                let layers = meta.getMetaData().data.filter((e) => {
                    if (e.layergroup === groupName) {
                        let parsedMeta = layerTree.parseLayerMeta(e);
                        prefix = parsedMeta?.default_layer_type ? parsedMeta.default_layer_type + ':' : '';
                        switchLayer.init(prefix + e.f_table_schema + "." + e.f_table_name, isChecked, false);
                        return true;
                    }
                })
                e.stopPropagation();
                backboneEvents.get().trigger(`layerTree:activeLayersChange`);
                let base64GroupName = Base64.encode(groupName).replace(/=/g, "");
                if (isChecked) {
                    layerTreeUtils.setupLayerNumberIndicator(base64GroupName, layers.length, layers.length);
                } else {
                    $("#layer-panel-" + base64GroupName + " span:eq(0)").html(0);
                }
            });
        });

        $(document).arrive('[data-gc2-subgroup-name]', function () {
            $(this).on('change', function (e) {
                let prefix = '';
                let isChecked = $(e.target).prop(`checked`);
                let subGroupName = $(this).data(`gc2-subgroup-name`);
                let subGroupLevel = $(this).data(`gc2-subgroup-level`);
                let layers = meta.getMetaData().data.filter((e) => {
                    let parsedMeta = layerTree.parseLayerMeta(e);
                    if (parsedMeta?.vidi_sub_group?.split("|")[subGroupLevel] === subGroupName) {
                        prefix = parsedMeta?.default_layer_type ? parsedMeta.default_layer_type + ':' : '';
                        switchLayer.init(prefix + e.f_table_schema + "." + e.f_table_name, isChecked, false);
                        return true;
                    }
                })
                e.stopPropagation();
                backboneEvents.get().trigger(`layerTree:activeLayersChange`);
            });
        });

        $('#searchclear').on('click', function () {
            backboneEvents.get().trigger('clear:search');
        });

        backboneEvents.get().on("allDoneLoading:layers", function () {
            if (!isStarted) {
                if (mobile()) {
                    $('ul[role="tablist"]:last-child').attr('style', 'padding-bottom: 100px');
                }
                isStarted = true;
                setTimeout(
                    function () {
                        if ($(document).width() > 1024 && typeof window.vidiConfig.activateMainTab === 'undefined') {
                            $('#search-border').trigger('click');
                        }
                        if (typeof window.vidiConfig.extensionConfig !== 'undefined' &&
                            typeof window.vidiConfig.extensionConfig.embed !== 'undefined' &&
                            window.vidiConfig.extensionConfig.embed.slideOutLayerTree === true
                        ) {
                            $('#burger-btn').trigger('click');
                        }
                        if (typeof window.vidiConfig.extensionConfig !== 'undefined' &&
                            typeof window.vidiConfig.extensionConfig.embed !== 'undefined' &&
                            window.vidiConfig.extensionConfig.embed.expandFirstInLayerTree === true
                        ) {
                            $('.js-toggle-layer-panel:first').trigger('click');
                        }
                    }, 200
                );
            } else {
                if (urlVars?.readyCallback) {
                    try {
                        if (state.activeLayersInSnapshot()) {
                            window.parent.postMessage({type: "snapshotLayersCallback", method: urlVars.readyCallback}, "*");
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

        $(document).bind('mousemove', function (e) {
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
            meta.init().then(() => {
                return setting.init();
            }, (error) => {
                console.log(error); // Stacktrace
                //alert('Vidi is loaded without schema. Can't set extent or add layers');
                backboneEvents.get().trigger('ready:meta');
                state.init();
            }).then(() => {
                layerTree.create(false, [], true);
                state.init();

            });
        });

        // Init some GUI stuff after modules are loaded
        // ============================================
        $('[data-toggle=tooltip]').tooltip();
        try {
            $.material.init();
        } catch (e) {
            console.warn('Material Design could not be initiated');
        }

        touchScroll('.tab-pane');
        touchScroll('#info-modal-body-wrapper');
        $('#loadscreentext').html(__('Loading data'));

        backboneEvents.get().on(`extensions:initialized`, () => {
            if (window.vidiConfig.activateMainTab) {
                setTimeout(function () {
                    const e = $('#main-tabs a[href="#' + window.vidiConfig.activateMainTab + '-content"]');
                    if (e.length === 1) {
                        e.trigger('click');
                    } else {
                        console.warn(`Unable to locate specified activateMainTab ${window.vidiConfig.activateMainTab}`)
                    }
                }, 200);
            }
        });

        $(document).arrive('[data-toggle="tooltip"]', function () {
            $(this).tooltip()
        });

        $(document).arrive('[data-scale-ul]', function () {
            $(this).on('click', function () {
                $('#select-scale').val($(this).data('scale-ul')).trigger('change');
            });
        });

        // Set up the open/close functions for side panel
        let searchPanelOpen, width, defaultCollapsedWidth = 260;

        backboneEvents.get().on('show:leftSlidePanel', () => {
            let localCollapsedWidth = Math.max.apply(Math, $('#side-panel #main-tabs > li > a, #side-panel #main-tabs > li [role="tab"]').map(function () {
                return $(this).width();
            }).get());
            if (localCollapsedWidth > 0) {
                if (localCollapsedWidth < 170) localCollapsedWidth = 170;
                localCollapsedWidth = localCollapsedWidth + 80;
            } else {
                localCollapsedWidth = defaultCollapsedWidth + 80;
            }
            $('#search-ribbon').css('right', '-' + (width - localCollapsedWidth) + 'px');
            $('#pane').css('right', (localCollapsedWidth - BUTTON_WITH) + 'px');
            $('#map').css('width', 'calc(100% - ' + (localCollapsedWidth / 2) + 'px)');
            searchPanelOpen = true;
            $('.slide-collapsed').hide();
            $('.slide-expanded').show();
        });
        backboneEvents.get().on(`hide:leftSlidePanel`, () => {
            $('#pane').css('right', '0');
            $('#map').css('width', '100%');
            $('#search-ribbon').css('right', '-' + (width - BUTTON_WITH) + 'px');
            searchPanelOpen = false;
            $('#side-panel ul li').removeClass('active');
            $('.slide-collapsed').show();
            $('.slide-expanded').hide();
        });

        $('#main-tabs a').on('click', function () {
            if ($(this).data(`module-ignore`) !== true && $(this).data(`module-ignore`) !== `true`) {
                $('#module-container.slide-right').css('right', '0');
                searchShowFull();
            }
        });

        $(document).arrive('#main-tabs a', function () {
            $(this).on('click', function () {
                if ($(this).data(`module-ignore`) !== true && $(this).data(`module-ignore`) !== `true`) {
                    $('#module-container.slide-right').css('right', '0');
                    searchShowFull();
                }
            });
        });

        $('#info-modal .modal-header button').on('click', function () {
            if (!$(this).data('extraClickHandlerIsEnabled')) {
                infoModalHide();
            }
        });

        $('#module-container .modal-header button').on('click', function () {
            searchShow();
            if (!$(this).data('extraClickHandlerIsEnabled')) {
                moduleContainerHide();
                $('#side-panel ul li').removeClass('active');
            }
        });

        const setWidth = function (width) {
            $('#search-ribbon').css('width', width + 'px').css('right', '-' + (width - BUTTON_WITH) + 'px');
            $('#module-container').css('width', (width - 84) + 'px');
            $('#info-modal').css('width', (width - 84) + 'px');
            $('.navmenu').css('width', (width) + 'px');
            $('.slide-right').css('right', '-' + (width - 84) + 'px');
        };

        const infoModalHide = function () {
            $('#info-modal').css('right', '-' + (width - 84) + 'px');
        }

        const moduleContainerHide = function () {
            $('#module-container.slide-right').css('right', '-' + (width - 84) + 'px');
        }

        const searchShow = function () {
            backboneEvents.get().trigger('show:leftSlidePanel');
        }

        const searchShowFull = function () {
            $('#search-ribbon').css('right', '0');
            $('#pane').css('right', (width - BUTTON_WITH) + 'px');
            $('#map').css('width', 'calc(100% - ' + (width / 2) + 'px');
            searchPanelOpen = true;
        }

        const searchHide = function () {
            backboneEvents.get().trigger('hide:leftSlidePanel');
        };

        const jRes = jrespond([
            {
                label: 'phone',
                enter: 0,
                exit: 500
            },
            {
                label: 'tablet',
                enter: 501,
                exit: 1024
            },
            {
                label: 'desktop',
                enter: 1024,
                exit: 10000
            }
        ]);

        jRes.addFunc({
            breakpoint: ['phone'],
            enter: function () {
                searchHide()
                width = LEFT_SLIDE_WIDTHS[0];
                setWidth(width)
            },
            exit: function () {
                console.log('Exit phone');

            }
        });
        jRes.addFunc({
            breakpoint: ['tablet'],
            enter: function () {
                searchHide()
                width = LEFT_SLIDE_WIDTHS[1];
                setWidth(width)
            },
            exit: function () {
                console.log('Exit tablet');
            }
        });
        jRes.addFunc({
            breakpoint: ['desktop'],
            enter: function () {
                searchHide()
                width = LEFT_SLIDE_WIDTHS[2];
                setWidth(width)
            },
            exit: function () {
                console.log('Exit desktop');
            }
        });


        $('#search-border').click(function () {
            const id = $('#search-border i');
            if (searchPanelOpen) {
                searchHide();
                infoModalHide();
                moduleContainerHide();
                id.css('padding-left', '12px')
            } else {
                searchShow();
                $('.slide-collapsed').hide();
                $('.slide-expanded').show();
                id.css('padding-left', '14px')
            }
        });

        // Bottom dialog
        $('.close-hide').on('click touchstart', function () {
            const id = ($(this)).parent().parent().attr('id');
            // If print when deactivate
            if ($(this).data('module') === 'print') {
                backboneEvents.get().trigger(`off:print`);
            }
            // If legend when deactivate
            if ($(this).data('module') === 'legend') {
                $('#legend-content').append($('#legend'));
                $('#btn-show-legend-in-map').prop('disabled', false);
            }
            $('#' + id).animate({
                bottom: '-100%'
            }, 500, function () {
                $(id + ' .expand-less').show();
                $(id + ' .expand-more').hide();
            });
        });

        $('.expand-less').on('click touchstart', function () {
            const id = '#' + ($(this)).parent().parent().attr('id');
            $(id).animate({
                bottom: (($(id).height() * -1) + 10) + 'px'
            }, 500, function () {
                $(id + ' .expand-less').hide();
                $(id + ' .expand-more').show();
            });
        });

        $('.expand-more').on('click touchstart', function () {
            const id = ($(this)).parent().parent().attr('id');
            $('#' + id).animate({
                bottom: '0'
            }, 500, function () {
                $('#' + id + ' .expand-less').show();
                $('#' + id + ' .expand-more').hide();
            });
        });

        $('.map-tool-btn').on('click', function (e) {
            e.preventDefault();
            const id = ($(this)).attr('href');
            if (id === '#full-screen') {
                utils.toggleFullScreen();
            }
            // If print when activate
            if ($(this).data('module') === 'print') {
                backboneEvents.get().trigger(`on:print`);
            }
            // If legend when deactivate
            if ($(this).data('module') === 'legend') {
                $('#legend-dialog .modal-body').append($('#legend'));
                $('#btn-show-legend-in-map').prop('disabled', true);
            }
            $(id).animate({
                bottom: '0'
            }, 500, function () {
                $(id + ' .expand-less').show();
                $(id + ' .expand-more').hide();
            })
        });

        // Hiding all panels with visible modules
        backboneEvents.get().on('hide:all', () => {
            const e = $('.modal-header > button[class="close"]');
            if (e.is(':visible')) {
                e.trigger(`click`);
            }
        });

        $('.slide-right > .modal-header > button[class="close"]').click(() => {
            backboneEvents.get().trigger('off:all');
        });

        // Module icons
        $('#side-panel ul li a').on('click', function () {
            backboneEvents.get().trigger('off:all');
            let moduleTitle = $(this).data('module-title');
            let e = $('#module-container');
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

            let id = ($(this));
            $('#side-panel ul li').removeClass('active');
            id.addClass('active');
        });

        $('#click-for-info-slide.slide-left .close').on('click', function () {
            $('#click-for-info-slide.slide-left').animate({
                left: '-100%'
            }, 500)
            sqlQuery.resetAll();
        });

        // Listen for extensions
        $(document).arrive('#side-panel ul li a', function () {
            $(this).on('click', function () {
                backboneEvents.get().trigger('off:all');
                const moduleId = $(this).data('module-id');
                const moduleTitle = $(this).data('module-title');
                const e = $('#module-container');
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
        // Listen for fullscreen changes
        document.addEventListener('fullscreenchange', function () {
            if (document.fullscreenElement) {
                $('#full-screen-btn i').html('fullscreen_exit')
            } else {
                $('#full-screen-btn i').html('fullscreen')
            }
        });
    }
};
