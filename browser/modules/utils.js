/**
 * @fileoverview Description of file, its uses and information
 * about its dependencies.
 */

'use strict';

var proj4 = require('proj4');

proj4.defs("EPSG:25832", "+title=  ETRF89 / UTM zone 32N EPSG:25832 +proj=utm +zone=32 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");


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
    },
    viewport: function () {
        return {
            width: $(document).width(),
            height: $(document).height()
        }
    },

    screen: function () {
        return {
            width: screen.width,
            height: screen.height
        }
    },

    transform: function (from, to, coordinates) {
        return proj4(from, to, coordinates);
    },

    popupCenter: function (url, width, height) {
        var leftPosition, topPosition;
        //Allow for borders.
        leftPosition = (window.screen.width / 2) - ((width / 2) + 10);
        //Allow for title and status bars.
        topPosition = (window.screen.height / 2) - ((height / 2) + 50);
        //Open the window.
        window.open(url, "Window2",
            "status=no,height=" + height + ",width=" + width + ",resizable=yes,left="
            + leftPosition + ",top=" + topPosition + ",screenX=" + leftPosition + ",screenY="
            + topPosition + ",toolbar=no,menubar=no,scrollbars=no,location=no,directories=no");
    }
};