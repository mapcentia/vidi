/*
 * @author     Martin Høgh <mh@mapcentia.com>
 * @copyright  2013-2018 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

'use strict';

/**
 *
 */
var cloud;

module.exports = {

    /**
     *
     * @param o
     * @returns {exports}
     */
    set: function (o) {
        return this;
    },

    /**
     *
     */
    init: function () {
        var me = this;
        try {
            geocloud.setHost(window.vidiConfig.gc2.host);
        } catch (e) {
            console.info(e.message);
        }

        /**
         *
         * @type {geocloud.map}
         */
        cloud = new geocloud.map({
            el: "map",
            zoomControl: false,
            numZoomLevels: 21,
            // Set CSS animation true if not print
            fadeAnimation: (window.vidiTimeout === 0),
            zoomAnimation: (window.vidiTimeout === 0),
            editable: true,
            maxBoundsViscosity: 1.0
        });

        /**
         *
         */
        var map = cloud.map;

        var zoomControl = L.control.zoom({
            position: 'topright'
        });

        cloud.map.addControl(zoomControl);

        var scaleControl = L.control.scale({
            position: "bottomright",
            imperial: false
        });
        cloud.map.addControl(scaleControl);

        /**
         *
         */
        L.control.locate({
            position: 'topright',
            strings: {
                title: "Find me"
            },
            icon: "fa fa-location-arrow",
            iconLoading: "fa fa-circle-o-notch fa-spin",
            keepCurrentZoomLevel: true,
            drawCircle: false,
            locateOptions: {
                enableHighAccuracy: true
            }
        }).addTo(map);

        /**
         *
         */
            // var graphicScale = L.control.graphicScale({
            //       doubleLine: false,
            //       fill: 'hollow',
            //       showSubunits: false,
            //       position: "bottomleft"
            //   }).addTo(map);
            //
            //   /**
            //    *
            //    * @type {div}
            //    */
            //   var scaleText = L.DomUtil.create('div', 'scaleText');
            //   graphicScale._container.insertBefore(scaleText, graphicScale._container.firstChild);
            //
            //   /**
            //    *
            //    */
            //   var styleChoices = scaleText.querySelectorAll('.choice');
            //
            //   for (var i = 0; i < styleChoices.length; i++) {
            //       styleChoices[i].addEventListener('click', function (e) {
            //           graphicScale._setStyle({fill: e.currentTarget.innerHTML});
            //       });
            //   }

        var localization;
        if (window._vidiLocale === "da_DK") {
            localization = "da";
        }
        if (window._vidiLocale === "en_US") {
            localization = "en";
        }

        /*
        var measureControl = new L.Control.Measure({
            position: 'topright',
            primaryLengthUnit: 'kilometers',
            secondaryLengthUnit: 'meters',
            primaryAreaUnit: 'hectares',
            secondaryAreaUnit: 'sqmeters',
            localization: localization,
            units: {
                meters: {
                    factor: 1,
                    display: 'meters',
                    decimals: 1
                },
                sqmeters: {
                    factor: 1,
                    display: 'sqmeters',
                    decimals: 1
                }
            }


        });
        measureControl.addTo(map);
        */

        L.Edit.Poly = L.Edit.Poly.extend({
            options: {
                icon: me.iconMedium
            }
        });
        L.Edit.Rectangle = L.Edit.Rectangle.extend({
            options: {
                moveIcon: me.iconBig,
                resizeIcon: me.iconMedium
            }
        });
        L.Edit.Circle = L.Edit.Circle.extend({
            options: {
                moveIcon: me.iconBig,
                resizeIcon: me.iconMedium
            }
        });
    },

    /**
     * Return the cloud object
     * @returns {*}
     */
    get: function () {
        return cloud;
    },

    iconSmall: new L.DivIcon({
        iconSize: new L.Point(10, 10),
        className: 'leaflet-div-icon leaflet-editing-icon my-own-class'
    }),

    iconMedium: new L.DivIcon({
        iconSize: new L.Point(15, 15),
        className: 'leaflet-div-icon leaflet-editing-icon my-own-class'
    }),

    iconBig: new L.DivIcon({
        iconSize: new L.Point(20, 20),
        className: 'leaflet-div-icon leaflet-editing-icon my-own-class'
    })
};