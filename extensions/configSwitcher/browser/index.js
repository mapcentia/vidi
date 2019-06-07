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

        utils.createMainTab(exId, __(`Config switcher`), ``, require('./../../../browser/modules/height')().max, "settings");

        if (document.getElementById(exId)) {
            try {
                switcherInstance = ReactDOM.render(<ConfigSwitcher urlparser={urlparser}/>, document.getElementById(exId));
            } catch (e) {
                console.log(e);
            }
        } else {
            console.warn(`Unable to find the container for config-switcher extension (element id: ${exId})`);
        }
    }
};
