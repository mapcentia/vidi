/*
 * @author     Martin Høgh <mh@mapcentia.com>
 * @copyright  2013-2021 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

'use strict';


let cloud;
let lc;

module.exports = {

    /**
     *
     * @returns {exports}
     */
    set: function () {
        return this;
    },

    /**
     *
     */
    init: function () {
        const me = this;
        try {
            geocloud.setHost(window.gc2host);
        } catch (e) {
            console.info(e.message);
        }

        const projections = {
            EPSG3857: L.CRS.EPSG3857,
            EPSG25832: new L.Proj.CRS('EPSG:25832',
                '+proj=utm +zone=32 +ellps=GRS80 +units=m +no_defs', {
                    resolutions: [1638.4, 819.2, 409.6, 204.8, 102.4, 51.2, 25.6, 12.8, 6.4, 3.2, 1.6, 0.8, 0.4, 0.2],
                    origin: [120000, 6500000],
                    bounds: L.bounds([120000, 5661139.2], [1378291.2, 6500000])
                }),
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
            //zoomAnimation: false, // https://github.com/Leaflet/Leaflet/issues/3249
            zoomAnimation: (window.vidiTimeout === 0),
            editable: true,
            maxBoundsViscosity: 1.0,
            preferCanvas: false,
            crs: projections[window.vidiConfig.crs]
        });

        let map = cloud.map;

        map.createPane('base');
        map.getPane('base').style.zIndex = 210;

        map.getPane('overlayPane').style.zIndex = 1000000;
        map.getPane('shadowPane').style.zIndex = 1001000;
        map.getPane('markerPane').style.zIndex = 1002000;
        map.getPane('tooltipPane').style.zIndex = 1003000;
        map.getPane('popupPane').style.zIndex = 1003000;


        let zoomControl = L.control.zoom({
            position: 'topright'
        });

        cloud.map.addControl(zoomControl);

        let scaleControl = L.control.scale({
            position: "bottomright",
            imperial: false
        });
        cloud.map.addControl(scaleControl);

        /**
         *
         */
        lc = L.control.locate({
            position: 'topright',
            strings: {
                title: __("Find me")
            },
            keepCurrentZoomLevel: true,
            drawCircle: false,
            locateOptions: {
                enableHighAccuracy: true
            },
            followMarkerStyle: {
                fillColor: '#EF9600'
            },
            markerStyle: {
                fillColor: '#004998',
            },
            /** Compass */
            compassStyle: {
                fillColor: '#004998',
            },
            icon: "bi bi-geo-alt",
        }).addTo(map);
        L.DomEvent.disableClickPropagation(lc._link);

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
    get: () => {
        return cloud;
    },

    getLc: () => {
        return lc;
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
