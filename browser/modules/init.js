/**
 * @fileoverview Description of file, its uses and information
 * about its dependencies.
 */

'use strict';

module.exports = {
    set: function (o) {
        return this;
    },
    init: function () {
        $.material.init();
        touchScroll(".tab-pane");
        touchScroll("#info-modal-body-wrapper");
    }
};