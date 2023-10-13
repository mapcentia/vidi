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
    formatArea: (areaInSquareMeters) => {
        let result = Math.round(areaInSquareMeters);
        let ha = (Math.round(areaInSquareMeters / 10000 * 1000) / 1000);
        let km2 = (Math.round(areaInSquareMeters / 1000000 * 1000) / 1000);
        if (areaInSquareMeters < 10000) {
            // Display square meters
            result = (Math.round(areaInSquareMeters) + ' m2');
        } else if (areaInSquareMeters >= 10000 && areaInSquareMeters < 1000000) {
            // Display hectars
            result = (ha + ' ha');
        } else if (areaInSquareMeters >= 1000000) {
            // Display square kilometers and hectars
            result = (km2 + ' km2 (' + ha + ' ha)');
        }

        return result;
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
            iconRaw = `<i data-container="body" data-toggle="tooltip" data-bs-placement="left" title="${name}" class="bi ${icon}"></i>`;
        }

        if (moduleId === false) {
            moduleId = ``;
        }

        $(`<li role="presentation">
            <a class="nav-link" data-bs-toggle="tab" data-module-id="${moduleId}" href="#${id}-content" aria-controls role="tab" data-toggle="tab" data-module-title="${name}">${iconRaw}</a>
        </li>`).appendTo("#main-tabs");
        $(`<div role="tabpanel" class="tab-pane fade" id="${id}-content"></div>`).appendTo(".tab-content.main-content");
        $(`<div class="help-btn"><i class="bi bi-question-circle help-btn"></i></div>`).appendTo(el).on("click", function () {
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
    },

    showInfoToast: (text, options = {delay: 1500, autohide: true}, elementId = "info-toast") => {
        try {
            document.querySelector(`#${elementId} .toast-body`).innerHTML = text;
            const e = new bootstrap.Toast(document.getElementById(elementId), options);
            e.show();
        } catch (e) {
           console.log("Info toast could not be shown");
        }
    },

    hideInfoToast: (elementId = "info-toast") => {
       try {
           const e = new bootstrap.Toast(document.getElementById(elementId));
           e.hide();
       } catch (e) {
           console.log("Info toast could not be hidden");
       }
    },

    removeDuplicates: (inputArray) => {
        let temp = {};
        for (let i = 0; i < inputArray.length; i++) {
            temp[inputArray[i]] = true;
        }
        let result = [];
        for (let key in temp) {
            result.push(key);
        }
        return result;
    }
};
