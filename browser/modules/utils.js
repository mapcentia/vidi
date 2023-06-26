/*
 * @author     Martin Høgh <mh@mapcentia.com>
 * @copyright  2013-2019 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

'use strict';

module.exports = {
    set: function () {
        return this;
    },
    init: function () {
    },
    formatArea: (a) => {
        let unit= 'm²';
        const bigArea= 100000;

        if (a > bigArea) {
          a = a / bigArea;
          unit = 'km²';
        } 

        if (a < 100) {
          return a.toFixed(1) + ' ' + unit;
        } else {
          return Math.round(a) + ' ' + unit;
        }
    },
    /**
     * @todo Remove deprecated "height" parameter
     */
    createMainTab: function (id, name, info, height, icon, rawIconWasProvided = false, moduleId = false) {
        let el = `#${id}-content`;

        let iconRaw;
        if (rawIconWasProvided) {
            iconRaw = icon;
        } else {
            icon = icon || "help";
            iconRaw = `<i data-container="body" data-toggle="tooltip" data-placement="left" title="${name}" class="material-icons">${icon}</i>`;
        }

        if (moduleId === false) {
            moduleId = ``;
        }

        $(`<li role="presentation">
            <a data-module-id="${moduleId}" href="#${id}-content" aria-controls role="tab" data-toggle="tab" data-module-title="${name}">${iconRaw}${name}</a>
        </li>`).appendTo("#main-tabs");
        $(`<div role="tabpanel" class="tab-pane fade" id="${id}-content"></div>`).appendTo(".tab-content.main-content");
        $(`<div class="help-btn"><i class="material-icons help-btn">help_outline</i></div>`).appendTo(el).on("click", function () {
            createAlert($(this), info);
        });
        $(`<div></div>`).appendTo(el);
        $(`<div id="${id}"></div>`).appendTo(el);

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
        const proj4 = require("proj4");
        return proj4(from, to, coordinates);
    },

    popupCenter: function (url, width, height, name) {
        let leftPosition, topPosition;
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
            pointer: function () {
                document.getElementById('map').style.cursor = 'pointer'
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

    },

    toggleFullScreen: function() {
        let fullScreenMode = false;
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().then(()=>{
                fullScreenMode = true;
            });
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen().then(()=>{
                    fullScreenMode = false;
                });
            }
        }
        return fullScreenMode;
    },

    /**
     *
     * @param string
     * @returns {null|{x: *, y: *, z: *}}
     */
    parseZoomCenter: function (string) {
        if (!string) return null;
        const arr = string.split('/');
        if (
            !isNaN(parseInt(arr[1])) &&
            !isNaN(parseInt(arr[2])) &&
            !isNaN(parseInt(arr[3]))
        )   {
            return {
                z: arr[1],
                x: arr[2],
                y: arr[3],
            }
        } else {
            return null;
        }
    }
};
