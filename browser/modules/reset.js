/*
 * @author     Martin Høgh <mh@mapcentia.com>
 * @copyright  2013-2018 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

'use strict';

let state, _self = false;

/**
 *
 * @returns {*}
 */
module.exports = {

    /**
     *
     * @param o
     * @returns {exports}
     */
    set: function (o) {
        state = o.state;
        _self = this;
        return this;
    },

    /**
     *
     */
    init: () => {
        $("#btn-reset").off();
        $("#btn-reset").on("click", function () {
            _self.reset();
        });
    },

    reset: () => {
        var curUrl = window.location.href, newUrl = curUrl.split("#")[0];
        if (window.confirm(__(`Do you really want to reset the map?`))) {
            state.resetState().then(() => {
                location.href = newUrl;
            });
        }
    }
};