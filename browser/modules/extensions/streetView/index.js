/**
 * @fileoverview Description of file, its uses and information
 * about its dependencies.
 */

'use strict';

/**
 *
 * @type {*|exports|module.exports}
 */
var cloud;

/**
 *
 * @type {*|exports|module.exports}
 */
var utils;

/**
 *
 * @type {*|exports|module.exports}
 */
var backboneEvents;

/**
 *
 */
var transformPoint;


/**
 *
 * @type {string}
 */
var exId = "streetview";




/**
 *
 * @type {{set: module.exports.set, init: module.exports.init}}
 */

module.exports = module.exports = {

    /**
     *
     * @param o
     * @returns {exports}
     */
    set: function (o) {
        cloud = o.cloud;
        utils = o.utils;
        transformPoint = o.transformPoint;
        backboneEvents = o.backboneEvents;
        return this;
    },

    /**
     *
     */
    init: function () {

        /**
         *
         */
        var React = require('react');

        /**
         *
         */
        var ReactDOM = require('react-dom');

        var dict = {

            "Info" : {
                "da_DK": "Start Google Street View eller Mapillary op fra hvor du klikker i kortet. Servicen starter i et nyt browser vindue.",
                "en_US": "Start Google Street View or Mapillary from where you click on the map. The service starts in a new browser window."
            },

            "Choose service" : {
                "da_DK": "Vælg service",
                "en_US": "Choose service"
            },

            "Activate" : {
                "da_DK": "Aktiver",
                "en_US": "Activate"
            }
        };

        var __ = function(txt) {


            if (dict[txt][window._vidiLocale]) {
                return dict[txt][window._vidiLocale];
            } else {
                return txt;
            }
        };

        /**
         *
         */
        class Streetview extends React.Component {
            constructor(props) {
                super(props);
            }

            render() {
                return (

                    <div role="tabpanel">
                        <div className="panel panel-default">
                            <div className="panel-body">
                                    <div className="form-group">
                                        <div className="togglebutton">
                                            <label><input id="streetview-btn" type="checkbox"/>{__("Activate")}</label>
                                        </div>
                                        <h3>{__("Choose service")}</h3>
                                        <div className="radio">
                                            <label>
                                                <input type="radio" id="streetview-service-google" name="streetview-service" value="google" defaultChecked="1"/>
                                                Google Street View
                                            </label>
                                        </div>

                                        <div className="radio">
                                            <label>
                                                <input type="radio" id="streetview-service-mapillary" name="streetview-service" value="mapillary"/>
                                                Mapillary
                                            </label>
                                        </div>

                                    </div>

                            </div>
                        </div>
                    </div>
                );
            }
        }

        utils.createMainTab(exId, "Street View", __("Info"), require('./../../height')().max);

        // Append to DOM
        //==============
        try {

            ReactDOM.render(
                <Streetview />,
                document.getElementById(exId)
            );
        } catch (e) {

        }

    },

    /**
     *
     */
    control: function () {
        if ($("#" + exId + "-btn").is(':checked')) {

            // Emit "on" event
            //================

            backboneEvents.get().trigger("on:" + exId);

            utils.cursorStyle().crosshair();

        } else {

            // Emit "off" event
            //=================

            backboneEvents.get().trigger("off:" + exId);

            utils.cursorStyle().reset();

        }
    },

    click: function (event) {
        var coords = event.getCoordinate(), p, url;
        p = utils.transform("EPSG:3857", "EPSG:4326", coords);

        switch ($("input:radio[name='streetview-service']:checked").val()) {
            case "google":
                url =  "http://maps.google.com/maps?q=&layer=c&cbll=" + p.y + "," + p.x + "&cbp=11,0,0,0,0";
                break;

            case "mapillary":
                url = "https://www.mapillary.com/app/?lat=" + p.y + "&lng=" + p.x + "&z=17";
                break;
        }

        utils.popupCenter(url, (utils.screen().width - 100), (utils.screen().height - 100), exId);
    },

    /**
     * Turns conflict off and resets DOM
     */
    off: function () {
        // Clean up
    }

};


