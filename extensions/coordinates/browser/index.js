/*
 * @author     Martin Høgh <mh@mapcentia.com>
 * @copyright  2013-2021 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
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
 */
var utmZone = require('./../../../browser/modules/utmZone');

/**
 *
 */
var proj4 = require('proj4');

/**
 *
 * @type {string}
 */
var exId = "coordinates";


let config = require('../../../config/config.js');
const lockedUtmZone = config?.extensionConfig?.coordinates?.lockUtmZoneTo

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
         */
        var React = require('react');

        /**
         *
         */
        var ReactDOM = require('react-dom');


        var dict = {

            "Info": {
                "da_DK": "Her kan du se koordinater for markørpositionen og kortets udstrækning.",
                "en_US": "Her you can see coordinates for the position of the cursor and the extent of the map."
            },

            "Coordinates": {
                "da_DK": "Koordinater",
                "en_US": "Coordinates"
            },

            "Choose coordinate system": {
                "da_DK": "Vælg koordinatsystem",
                "en_US": "Choose coordinate system"
            },

            "Cursor position": {
                "da_DK": "Markør position",
                "en_US": "Cursor position"
            },

            "Extent": {
                "da_DK": "Udstrækning",
                "en_US": "Extent"
            },

            "Latitude/Longitude, decimal degrees": {
                "da_DK": "Bredde/længde, decimal grader",
                "en_US": "Latitude/Longitude, decimal degrees"
            },

            "Latitude/Longitude, degrees, minutes and seconds": {
                "da_DK": "Bredde/længde, grader, minutter og sekunder",
                "en_US": " Latitude/Longitude, degrees, minutes and seconds"
            },

            "Lat": {
                "da_DK": "B",
                "en_US": " Lat"
            },

            "Lng": {
                "da_DK": "L",
                "en_US": "Lng"
            }
        };

        utils.createMainTab(exId, utils.__("Coordinates", dict), utils.__("Info", dict), require('./../../../browser/modules/height')().max, "my_location");


        // Create React component
        //=======================

        class Coordinates extends React.Component {

            constructor(props) {
                super(props);
                this.state = {
                    lat: 0,
                    lng: 0,
                    west: 0,
                    east: 0,
                    north: 0,
                    south: 0,
                    zone: 0,
                    panTo: ""
                };

                this.center = {
                    textAlign: "center"
                };

                this.centerFloat = {
                    margin: "0 auto",
                    width: "90px",
                    textAlign: "center",
                    height: "19px"
                };

                this.left = {
                    float: "left"
                };

                this.right = {
                    float: "right"
                };

                this.coordinatesSystem = "dd";

                this.handlePanToCoordsChange = this.handlePanToCoordsChange.bind(this);
                this.handlePanToCoordsSubmit = this.handlePanToCoordsSubmit.bind(this);
            }

            componentDidMount() {
                let me = this;

                cloud.get().map.on('mousemove', function (e) {

                    let z = lockedUtmZone || utmZone.getZone(e.latlng.lat, e.latlng.lng), crss = {
                        "dest": "+proj=utm +zone=" + z.toString() + " +ellps=WGS84 +datum=WGS84 +units=m +no_defs",
                        "source": "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs"
                    }, coords = proj4(crss.source, crss.dest, [e.latlng.lng, e.latlng.lat]);

                    me.setState({
                        lat: me.coordinatesSystem === "dd" ? utils.__("Lat", dict) + ": " + e.latlng.lat.toFixed(5) : me.coordinatesSystem === "dms" ? me.convertDDToDMS(e.latlng.lat, false) : "X: " + coords[0].toFixed(2),
                        lng: me.coordinatesSystem === "dd" ? utils.__("Lng", dict) + ": " + e.latlng.lng.toFixed(5) : me.coordinatesSystem === "dms" ? me.convertDDToDMS(e.latlng.lng, true) : "Y: " + coords[1].toFixed(2),
                        zone: me.coordinatesSystem === "dd" ? "" : me.coordinatesSystem === "dms" ? "" : "Zone: " + z,
                    });

                });

                cloud.get().map.on("move", function () {
                    me.setExtent();
                });

                this.setExtent = function () {
                    var bounds = cloud.get().map.getBounds(),
                        z = utmZone.getZone(cloud.get().map.getCenter().lat, cloud.get().map.getCenter().lng), crss = {
                            "dest": "+proj=utm +zone=" + z + " +ellps=WGS84 +datum=WGS84 +units=m +no_defs",
                            "source": "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs"
                        },
                        coords1 = proj4(crss.source, crss.dest, [bounds.getWest(), bounds.getSouth()]),
                        coords2 = proj4(crss.source, crss.dest, [bounds.getEast(), bounds.getNorth()]);

                    this.setState({
                        west: me.coordinatesSystem === "dd" ? bounds.getWest().toFixed(5) : me.coordinatesSystem === "dms" ? me.convertDDToDMS(bounds.getWest(), true) : coords1[0].toFixed(2),
                        east: me.coordinatesSystem === "dd" ? bounds.getEast().toFixed(5) : me.coordinatesSystem === "dms" ? me.convertDDToDMS(bounds.getEast(), true) : coords2[0].toFixed(2),
                        north: me.coordinatesSystem === "dd" ? bounds.getNorth().toFixed(5) : me.coordinatesSystem === "dms" ? me.convertDDToDMS(bounds.getNorth(), false) : coords2[1].toFixed(2),
                        south: me.coordinatesSystem === "dd" ? bounds.getSouth().toFixed(5) : me.coordinatesSystem === "dms" ? me.convertDDToDMS(bounds.getSouth(), false) : coords1[1].toFixed(2),
                    })
                };

                this.onCoordinatesSystemClick = function (e) {
                    me.coordinatesSystem = e.currentTarget.value;
                    me.setExtent();

                };

                this.setExtent();
            }

            convertDDToDMS(D, lng) {
                return [0 | (D < 0 ? D = -D : D), '° ', 0 | (D < 0 ? D = -D : D) % 1 * 60, "' ", 0 | D * 60 % 1 * 60, '"', D < 0 ? lng ? ' W' : ' S' : lng ? ' E' : ' N'].join('');
            }

            convertDMSToDD(input) {
                if (input.indexOf('N') === -1 && input.indexOf('S') === -1 &&
                    input.indexOf('W') === -1 && input.indexOf('E') === -1) {
                    return input.split(',');
                }
                let parts = input.split(/[°'"]+/).join(' ').split(/[^\w\S]+/);
                let directions = [];
                let coords = [];
                let dd = 0;
                let pow = 0;
                for (let i in parts) {
                    // we end on a direction
                    if (isNaN(parts[i])) {
                        let _float = parseFloat(parts[i]);
                        let direction = parts[i];
                        if (!isNaN(_float)) {
                            dd += (_float / Math.pow(60, pow++));
                            direction = parts[i].replace(_float, '');
                        }
                        direction = direction[0];
                        if (direction === 'S' || direction === 'W') {
                            dd *= -1;
                        }
                        directions[directions.length] = direction;
                        coords[coords.length] = dd;
                        dd = pow = 0;
                    } else {
                        dd += (parseFloat(parts[i]) / Math.pow(60, pow++));
                    }
                }
                if (directions[0] === 'W' || directions[0] === 'E') {
                    let tmp = coords[0];
                    coords[0] = coords[1];
                    coords[1] = tmp;
                }
                return coords;
            }

            handlePanToCoordsChange(event) {
                this.setState({panTo: event.target.value});
            }

            handlePanToCoordsSubmit(event) {
                event.preventDefault();
                let coords;
                switch (this.coordinatesSystem) {
                    case "dms":
                        coords = this.convertDMSToDD(this.state.panTo);
                        break;
                    case "dd":
                        if (this.state.panTo.split(",").length === 2) {
                            coords = this.state.panTo.split(",");
                        } else if (this.state.panTo.split(" ").length === 2) {
                            coords = this.state.panTo.split(" ");
                        }
                        break;
                    case "utm":
                        let z = utmZone.getZone(cloud.get().map.getCenter().lat, cloud.get().map.getCenter().lng);
                        let crss = {
                            "source": "+proj=utm +zone=" + z + " +ellps=WGS84 +datum=WGS84 +units=m +no_defs",
                            "dest": "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs"
                        };
                        try {
                            coords = proj4(crss.source, crss.dest, this.state.panTo.split(" ").map(Number)).reverse();
                        } catch (e) {
                            alert(utils.__("Couldn't pan to coords", dict));
                        }
                        break;
                }
                try {
                    cloud.get().map.panTo(coords);
                } catch (e) {
                    alert(utils.__("Couldn't pan to coords", dict));
                }

            }

            render() {
                return (
                    <div role="tabpanel">

                        <h3>{utils.__("Choose coordinate system", dict)}</h3>
                        <div className="radio">
                            <label>
                                <input onClick={this.onCoordinatesSystemClick} type="radio"
                                       id="coordinates-system-dd"
                                       name="coordinates-system" value="dd" defaultChecked="1"/>
                                {utils.__("Latitude/Longitude, decimal degrees", dict)}
                            </label>
                        </div>

                        <div className="radio">
                            <label>
                                <input onClick={this.onCoordinatesSystemClick} type="radio"
                                       id="coordinates-system-dms"
                                       name="coordinates-system" value="dms"/>
                                {utils.__("Latitude/Longitude, degrees, minutes and seconds", dict)}
                            </label>
                        </div>

                        <div className="radio">
                            <label>
                                <input onClick={this.onCoordinatesSystemClick} type="radio"
                                       id="coordinates-system-utm"
                                       name="coordinates-system" value="utm"/>
                                UTM
                            </label>
                        </div>

                        <h3>{utils.__("Cursor position", dict)}</h3>

                        <div>
                            <div><strong>{this.state.zone}</strong></div>
                            <div><strong>{this.state.lat}</strong></div>
                            <div><strong>{this.state.lng}</strong></div>
                        </div>


                        <h3>{utils.__("Extent", dict)}</h3>
                        <div>

                            <div>
                                <div style={this.center}>
                                    <strong>{this.state.north}</strong>
                                </div>
                                <div style={this.center}>
                                    <strong>↑</strong>
                                </div>
                            </div>

                            <div>

                                <div style={this.left}>
                                    <strong>{this.state.west}</strong>
                                </div>

                                <div style={this.right}>
                                    <strong>{this.state.east}</strong>
                                </div>

                                <div style={this.centerFloat}>
                                    <strong>
                                        <div style={this.left}>←</div>
                                        <div style={this.right}>→</div>
                                    </strong>
                                </div>

                            </div>

                            <div>
                                <div style={this.center}>
                                    <strong>↓</strong>
                                </div>
                                <div style={this.center}>
                                    <strong>{this.state.south}</strong>
                                </div>
                            </div>

                        </div>
                        <div>
                            <h3>{utils.__("Pan to", dict)}</h3>
                            <form onSubmit={this.handlePanToCoordsSubmit}>
                                <div className="form-group">
                                    <input type="text" className="form-control" value={this.state.panTo}
                                           onChange={this.handlePanToCoordsChange}
                                           placeholder={utils.__("Coordinate", dict)}/>
                                </div>
                            </form>
                        </div>
                    </div>
                );
            }
        }

        try {
            ReactDOM
                .render(
                    <Coordinates/>,
                    document
                        .getElementById(exId)
                )
            ;
        } catch
            (e) {

        }

    }
};


