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
                                <div className="togglebutton">
                                    <label><input id="streetview-btn" type="checkbox"/>Aktiver Street View</label>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            }
        }

        utils.createMainTab(exId, "Street View", "......", require('./../../height')().max);

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

        } else {

            // Emit "off" event
            //=================

            backboneEvents.get().trigger("off:" + exId);
        }
    },

    click: function (event) {
        var coords = event.getCoordinate(), p,
            url = "http://maps.google.com/maps";
        p = utils.transform("EPSG:3857", "EPSG:4326", coords);
        console.info(url + "?q=&layer=c&cbll=" + p.y + "," + p.x + "&cbp=11,0,0,0,0");
        utils.popupCenter(url + "?q=&layer=c&cbll=" + p.y + "," + p.x + "&cbp=11,0,0,0,0", (utils.screen().width - 100), (utils.screen().height - 100), exId);
    },

    /**
     * Turns conflict off and resets DOM
     */
    off: function () {
        // Clean up
    }

};


