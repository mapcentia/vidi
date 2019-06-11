/*
 * @author     Martin Høgh <mh@mapcentia.com>
 * @copyright  2013-2018 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

'use strict';

/**
 *
 * @returns {*}
 */
module.exports = function () {
    try {
        var max = $(document).height() - $('.tab-pane').offset().top - 70;
        return {
            max: max
        }
    } catch (e) {
        console.info(e.message);
        return 0;
    }
};