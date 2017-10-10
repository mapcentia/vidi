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

        $('<div role="tabpanel" class="tab-pane fade" id="' + id + '-content" style="max-height: ' + height + 'px;">' +
            '<div class="alert alert-dismissible alert-info" role="alert">' +
            '<button type="button" class="close" data-dismiss="alert">×</button>' +
            info +
            '</div>' +
            '<div id="' + id + '"></div>' +
            '</div>').appendTo("#side-panel .main-content");
    },

    createNavItem: function (id, dropdown) {
      $('<li id="' + id + '" class="' + (dropdown ? 'dropdown' : '') + '"></li>').appendTo('#main-navbar');
    },

    injectCSS: function (css) {
        $("head").append("<style>" + css + "</style>");
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

    popupCenter: function (url, width, height, name) {
        var leftPosition, topPosition;
        //Allow for borders.
        leftPosition = (window.screen.width / 2) - ((width / 2) + 10);
        //Allow for title and status bars.
        topPosition = (window.screen.height / 2) - ((height / 2) + 50);
        //Open the window.
        window.open(url, name,
            "status=no,height=" + height + ",width=" + width + ",resizable=yes,left="
            + leftPosition + ",top=" + topPosition + ",screenX=" + leftPosition + ",screenY="
            + topPosition + ",toolbar=no,menubar=no,scrollbars=no,location=no,directories=no");
    },

    cursorStyle: function () {

        return {
            crosshair: function () {
                document.getElementById('map').style.cursor = 'crosshair'
            },

            reset: function () {
                document.getElementById('map').style.cursor = ''
            }
        }

    },

    __: function (txt, dict) {

        if ((dict[txt]) && (dict[txt][window._vidiLocale])) {
            return dict[txt][window._vidiLocale];
        } else {
            return txt;
        }

    }
};