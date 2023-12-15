/*
 * @author     Alexander Shumilov
 * @copyright  2013-2019 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

'use strict';

var utils, urlparser, backboneEvents;

import ConfigSwitcher from './components/ConfigSwitcher';

/**
 *
 * @type {string}
 */
var exId = "config-switcher";

var switcherInstance = false;
let setBaseLayer;

/**
 *
 * @type {{set: module.exports.set, init: module.exports.init}}
 */

module.exports = {

    /**
     *
     * @param o
     * @returns {exports}
     */
    set: function (o) {
        utils = o.utils;
        backboneEvents = o.backboneEvents;
        setBaseLayer = o.setBaseLayer;
        urlparser = o.urlparser;
        return this;
    },

    /**
     *
     */
    init: function () {
        backboneEvents.get().on(`session:authChange`, () => {
            if (switcherInstance) switcherInstance.updateConfigurationsList();
        });

        /**
         *
         */
        var ReactDOM = require(`react-dom`);

        // utils.createMainTab(exId, __(`Config switcher`), ``, require('./../../../browser/modules/height')().max, "settings");

        const modalStr = `
                    <div class="modal" id="config-switcher-modal" tabindex="-1" role="dialog">
                        <div class="modal-dialog modal-fullscreen" role="document">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h1 class="modal-title fs-5">${__('Configurations')}</h1>
                                    <button type="button" class="btn-close d-none" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div class="modal-body" id="${exId}">
                                
                                </div>
                                <div class="-none modal-footer d-none">
                                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">${__('Close')}</button>
                                </div>
                            </div>
                        </div>
                    </div>
        `

        document.querySelector('body').insertAdjacentHTML('beforeend', modalStr);


        if (document.getElementById(exId)) {
            try {
                switcherInstance = ReactDOM.render(<ConfigSwitcher urlparser={urlparser}/>, document.getElementById(exId));
            } catch (e) {
                console.log(e);
            }
        } else {
            console.warn(`Unable to find the container for config-switcher extension (element id: ${exId})`);
        }
    },

    activate: function () {
        new bootstrap.Modal('#config-switcher-modal').show();
    }
};
