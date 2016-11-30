/**
 * @fileoverview Description of file, its uses and information
 * about its dependencies.
 */

'use strict';


module.exports = {
    set: function () {
        return this;
    },
    init: function () {

    },
    createMainTab: function (id, name, info, height) {
        $('<li role="presentation"><a href="#' + id + '-content" aria-controls role="tab" data-toggle="tab">' + name + '</a></li>').appendTo("#main-tabs");

        $('<div role="tabpanel" class="tab-pane fade" id="' + id + '-content" style="max-height: ' + height + 'px; height: ' + height + 'px;">' +
            '<div class="alert alert-dismissible alert-info" role="alert">' +
            '<button type="button" class="close" data-dismiss="alert">×</button>' +
            info +
            '</div>' +
            '<div id="' + id + '"></div>' +
            '</div>').appendTo("#side-panel .main-content");
    }
};