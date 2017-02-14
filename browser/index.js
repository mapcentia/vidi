/*!
 * Copyright 2017 MapCentia ApS. All rights reserved.
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

/**
 * Global i18n dict
 */
window.gc2i18n = require('./i18n/' + window._vidiLocale + '.js');

/**
 * Global var with config object
 */
window.vidiConfig = require('../config/config.js');

/**
 *
 * @returns {{init: *}}
 * @constructor
 */
window.Vidi = function () {

    // Avoid 'console' errors in browsers that lack a console.
    // ========================================================

    (function () {
        var method;
        var noop = function () {
        };
        var methods = [
            'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
            'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
            'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
            'timeStamp', 'trace', 'warn'
        ];
        var length = methods.length;
        var console = (window.console = window.console || {});

        while (length--) {
            method = methods[length];

            // Only stub undefined methods.
            if (!console[method]) {
                console[method] = noop;
            }
        }
    }());

    // Set widow.status after 120 secs.
    // This should be set in "loading.js"
    // when all layers are loaded. Used in print.
    // ==========================================

    setTimeout(function () {
        window.status = "all_loaded";
        console.info("load_timeout");
    }, 120000);

    // Require the standard modules
    // ============================

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
        loading: require('./modules/loading'),
        extensions: {},
        search: {}
    };

    // Use the setters in modules so they can interact
    // ===============================================

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
    modules.bindEvent.set(modules);
    modules.draw.set(modules);
    modules.print.set(modules);
    modules.advancedInfo.set(modules);
    modules.sqlQuery.set(modules);
    modules.serializeLayers.set(modules);
    modules.pushState.set(modules);
    modules.backboneEvents.set(modules);
    modules.utils.set(modules);

    // Return the init module to be called in index.html
    // =================================================

    return {
        init: modules.init
    }
};
