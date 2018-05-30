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
 */
var clicktimer;

/**
 *
 */
var mapObj;


/**
 *
 * @type {{set: module.exports.set, init: module.exports.init}}
 */

module.exports = {

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
         * Native Leaflet object
         */
        mapObj = cloud.get().map;

        /**
         *
         */
        var React = require('react');

        /**
         *
         */
        var ReactDOM = require('react-dom');

        /**
         *
         * @type {{Info: {da_DK: string, en_US: string}, Street View: {da_DK: string, en_US: string}, Choose service: {da_DK: string, en_US: string}, Activate: {da_DK: string, en_US: string}}}
         */
        var dict = {

            "Info": {
                "da_DK": "Start Google Street View eller Mapillary op fra hvor du klikker i kortet. Servicen starter i et nyt browser vindue.",
                "en_US": "Start Google Street View or Mapillary from where you click on the map. The service starts in a new browser window."
            },

            "Street View": {
                "da_DK": "Gadefoto",
                "en_US": "Street View"
            },

            "Choose service": {
                "da_DK": "Vælg service",
                "en_US": "Choose service"
            },

            "Activate": {
                "da_DK": "Aktiver",
                "en_US": "Activate"
            }
        };

        /**
         *
         * @param txt
         * @returns {*}
         * @private
         */
        var __ = function (txt) {
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

                this.state = {
                    active: false,
                    selectedOption: "google"
                };

                this.onActive = this.onActive.bind(this);
                this.onChange = this.onChange.bind(this);
            }

            /**
             *
             * @param e
             */
            onActive(e) {
                this.setState({
                    active: e.target.checked
                });

                if (e.target.checked) {

                    // Turn info click off
                    //====================
                    backboneEvents.get().trigger("off:infoClick");

                    // Emit "on" event
                    //================
                    backboneEvents.get().trigger("on:" + exId);

                    utils.cursorStyle().crosshair();

                } else {

                    // Turn info click on again
                    //=========================
                    backboneEvents.get().trigger("on:infoClick");

                    // Emit "off" event
                    //=================
                    backboneEvents.get().trigger("off:" + exId);

                    utils.cursorStyle().reset();

                }

            }

            onChange(changeEvent) {
                this.setState({
                    selectedOption: changeEvent.target.value
                });
            }

            /**
             *
             */
            componentDidMount() {
                var me = this;

                // Listen and reacting to the global Reset ALL event
                backboneEvents.get().on("reset:all", function () {
                    me.setState({
                        active: false
                    });
                    utils.cursorStyle().reset();
                });

                // Handle click events on map
                // ==========================

                mapObj.on("dblclick", function () {
                    clicktimer = undefined;
                });
                mapObj.on("click", function (e) {
                    var event = new geocloud.clickEvent(e, cloud);
                    if (clicktimer) {
                        clearTimeout(clicktimer);
                    }
                    else {
                        if (me.state.active === false) {
                            return;
                        }

                        clicktimer = setTimeout(function (e) {

                            var coords = event.getCoordinate(), p, url;
                            p = utils.transform("EPSG:3857", "EPSG:4326", coords);
                            clicktimer = undefined;

                            switch (me.state.selectedOption) {
                                case "google":
                                    url = "http://maps.google.com/maps?q=&layer=c&cbll=" + p.y + "," + p.x + "&cbp=11,0,0,0,0";
                                    break;

                                case "mapillary":
                                    url = "https://www.mapillary.com/app/?lat=" + p.y + "&lng=" + p.x + "&z=17";
                                    break;
                            }

                            utils.popupCenter(url, (utils.screen().width - 100), (utils.screen().height - 100), exId);


                        }, 250);
                    }
                });
            }

            /**
             *
             * @returns {XML}
             */
            render() {
                return (

                    <div role="tabpanel">
                        <div className="panel panel-default">
                            <div className="panel-body">
                                <div className="form-group">
                                    <div className="togglebutton">
                                        <label><input id="streetview-btn" type="checkbox"
                                                      checked={ this.state.active }
                                                      onChange={this.onActive}/>{__("Activate")}
                                        </label>

                                    </div>
                                    <h3>{__("Choose service")}</h3>
                                    <div className="radio">
                                        <label>
                                            <input type="radio" id="streetview-service-google" name="streetview-service"
                                                   value="google" checked={this.state.selectedOption === 'google'}
                                                   onChange={this.onChange}/>
                                            Google Street View
                                        </label>
                                    </div>

                                    <div className="radio">
                                        <label>
                                            <input type="radio" id="streetview-service-mapillary"
                                                   name="streetview-service" value="mapillary"
                                                   checked={this.state.selectedOption === 'mapillary'}
                                                   onChange={this.onChange}/>
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

        utils.createMainTab(exId, __("Street View"), __("Info"), require('./../../../browser/modules/height')().max);

        // Append to DOM
        //==============
        try {

            ReactDOM.render(
                <Streetview />,
                document.getElementById(exId)
            );
        } catch (e) {

        }

    }

};


