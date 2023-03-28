/*
 * @author     René Borella <rgb@geopartner.dk>
 * @copyright  2020- Geoparntner A/S
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

"use strict";

/* Import big-brains*/
import { v4 as uuidv4 } from "uuid";

import Button from "@material-ui/core/Button";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";

import {
  buffer as turfBuffer,
  flatten as turfFlatten,
  union as turfUnion,
  featureCollection as turfFeatureCollection,
} from "@turf/turf";

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
 * @type {*|exports|module.exports}
 */
var layerTree = require("./../../../browser/modules/layerTree");

/**
 *
 * @type {*|exports|module.exports}
 */
var layers = require("./../../../browser/modules/layers");

/**
 *
 * @type {*|exports|module.exports}
 */
var switchLayer = require("./../../../browser/modules/switchLayer");

/**
 *
 * @type {string}
 */
var exId = "blueidea";
var exSnackId = "blueidea-snack";
var exBufferDistance = 1;

/**
 *
 */
var mapObj;

//var gc2host = 'http://localhost:3000'
var config = require("../../../config/config.js");

require("snackbarjs");
/**
 * Displays a snack!
 * @param {*} msg
 */
var snack = function (msg) {
  jquery.snackbar({
    htmlAllowed: true,
    content: "<p>" + msg + "</p>",
    timeout: 10000,
  });
};

/**
 * Draw module
 */
var draw;
var cloud;

var bufferItems = new L.FeatureGroup();
var queryMatrs = new L.FeatureGroup();

var _clearBuffer = function () {
  bufferItems.clearLayers();
};
var _clearMatrs = function () {
  queryMatrs.clearLayers();
};

var _clearAll = function () {
  _clearBuffer();
  _clearMatrs();

  RESULTSTATE.matrikler = [];
  RESULTSTATE.adresser = [];
};

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
    meta = o.meta;
    draw = o.draw;
    socketId = o.socketId;
    transformPoint = o.transformPoint;
    backboneEvents = o.backboneEvents;
    return this;
  },

  /**
   *
   */
  init: function () {
    var parentThis = this;

    // Set up draw module for blueIdea
    draw.setBlueIdea(this);

    /**
     *
     * Native Leaflet object
     */
    mapObj = cloud.get().map;
    mapObj.addLayer(bufferItems);
    mapObj.addLayer(queryMatrs);

    /**
     *
     */
    var React = require("react");

    /**
     *
     */
    var ReactDOM = require("react-dom");

    /**
     *
     * @type {*|exports|module.exports}
     */
    var dict = {
      Info: {
        da_DK: "infoDK",
        en_US: "infoUS",
      },
      "Plugin Tooltip": {
        da_DK: "BlueIdea",
        en_US: "BlueIdea",
      },
      MissingLogin: {
        da_DK:
          "NB: Du skal være logget ind for at kunne bruge funktionen, og din konfiguration skal indeholde et brugerid.",
        en_US:
          "Please log in and set a user id in the configuration file to use this function",
      },
      Login: {
        da_DK: "Log ind",
        en_US: "Log in",
      },
      "Select point on map": {
        da_DK: "Udpeg punkt på ledningsnet",
        en_US: "Select point on map",
      },
      "Found parcels": {
        da_DK: "Fundne matrikler",
        en_US: "Found parcels",
      },
      "Found addresses": {
        da_DK: "Fundne adresser",
        en_US: "Found addresses",
      },
      "Error in seach": {
        da_DK: "Fejl i søgning",
        en_US: "Error in seach",
      },
      "Draw area": {
        da_DK: "Tegn områder",
        en_US: "Draw area",
      },
      Select: {
        da_DK: "Udpeg",
        en_US: "Select",
      },
      Results: {
        da_DK: "Resultater",
        en_US: "Results",
      },
    };

    /**
     *
     * @param txt
     * @returns {*}
     * @private
     */
    var __ = function (txt) {
      // Hack for locale not found?!
      //console.log(window._vidiLocale)
      //console.log(txt)

      if (dict[txt][window._vidiLocale]) {
        return dict[txt][window._vidiLocale];
      } else {
        return txt;
      }
    };

    var pushStatus = function (obj, statusKey) {
      let postData = {
        Ledningsejerliste: obj,
        statusKey: statusKey,
      };
      let opts = {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(postData),
      };

      return new Promise(function (resolve, reject) {
        // Do async job and resolve
        fetch("/api/extension/upsertStatus", opts)
          .then((r) => {
            const data = r.json();
            resolve(data);
          })
          .catch((e) => reject(e));
      });
    };

    /**
     *
     */
    class BlueIdea extends React.Component {
      constructor(props) {
        super(props);

        this.state = {
          active: false,
          done: false,
          loading: false,
          authed: false,
          result_adresser: [],
          result_matrikler: [],
          user_id: null,
          user_profileid: null,
          user_lukkeliste: false,
        };
      }

      /**
       * Handle activation on mount
       */
      componentDidMount() {
        let me = this;

        // Stop listening to any events, deactivate controls, but
        // keep effects of the module until they are deleted manually or reset:all is emitted
        backboneEvents.get().on("deactivate:all", () => {});

        // Activates module
        backboneEvents.get().on(`on:${exId}`, () => {
          console.log("Starting blueidea");
          me.setState({
            active: true,
          });
        });

        // Deactivates module
        backboneEvents.get().on(`off:${exId} off:all reset:all`, () => {
          console.log("Stopping blueidea");
          me.setState({
            active: false,
          });
        });

        // On auth change, handle Auth state
        backboneEvents.get().on(`session:authChange`, () => {
          console.log("Auth changed!");
          fetch("/api/session/status")
            .then((r) => r.json())
            .then((obj) => {
              me.setState({
                authed: obj.status.authenticated,
              });
            })
            .then(() => {
              // if logged in, get user
              if (me.state.authed) {
                return this.getUser();
              } else {
                me.setState({
                  user_id: null,
                  user_profileid: null,
                  user_lukkeliste: false,
                });
              }
            })
            .catch((e) => {
              console.log("Error in session:authChange", e);
              me.setState({
                authed: false,
                user_id: null,
              });
            })
            .finally(() => {
              console.log(me.state);
              // If logged in, show buttons in draw module
              if (me.state.authed && me.state.user_id) {
                $("#_draw_make_blueidea_with_selected").show();
                $("#_draw_make_blueidea_with_all").show();
              } else {
                $("#_draw_make_blueidea_with_selected").hide();
                $("#_draw_make_blueidea_with_all").hide();
              }
            });
        });
      }

      getUser = () => {
        // If user is set in extensionconfig, set it in state and get information from backend
        if (config.extensionConfig.blueidea.userid) {
          return fetch(
            "/api/extension/blueidea/" + config.extensionConfig.blueidea.userid
          )
            .then((r) => r.json())
            .then((obj) => {
              this.setState({
                user_profileid: obj.profileid,
                user_lukkeliste: obj.lukkeliste,
                user_id: config.extensionConfig.blueidea.userid,
              });
            })
            .catch((e) => {
              console.log("Error in getUser", e);
            });
        } else {
          return;
        }
      };

      clickLogin() {
        document.getElementById("session").click();
      }

      clickDraw() {
        $('#main-tabs a[href="#draw-content"]').trigger("click");
      }

      /**
       * Renders component
       */
      render() {
        const _self = this;
        const s = _self.state;
        //console.log(s)

        // If not logged in, show login button
        if (s.authed && s.user_id) {
          // Logged in
          return (
            <div role="tabpanel">
              <div className="form-group">
                <div style={{ alignSelf: "center" }}>
                  <h3>{__("Select")}</h3>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      width: "100%",
                      justifyContent: "center",
                    }}
                  >
                    <Button
                      onClick={() => this.clickDraw()}
                      size="large"
                      variant="contained"
                      style={{ margin: "10px" }}
                    >
                      {__("Draw area")}
                    </Button>
                    <Button
                      onClick={() => this.selectPoint()}
                      color="primary"
                      size="large"
                      variant="contained"
                      style={{ margin: "10px" }}
                      disabled={!this.state.user_lukkeliste}
                    >
                      {__("Select point on map")}
                    </Button>
                  </div>
                </div>
                <div style={{ alignSelf: "center" }}>
                  <h3>{__("Results")}</h3>
                  <div>
                    Der blev fundet {this.state.result_adresser.length} adresser
                    i området.
                  </div>
                </div>
              </div>
            </div>
          );
        } else {
          // Not Logged in
          return (
            <div role="tabpanel">
              <div className="form-group">
                <div
                  id="blueidea-feature-login"
                  className="alert alert-info"
                  role="alert"
                >
                  {__("MissingLogin")}
                </div>
                <Button
                  onClick={() => this.clickLogin()}
                  color="primary"
                  size="large"
                  variant="contained"
                  style={{
                    marginRight: "auto",
                    marginLeft: "auto",
                    display: "block",
                  }}
                >
                  {__("Login")}
                </Button>
              </div>
            </div>
          );
        }
      }
    }

    utils.createMainTab(
      exId,
      __("Plugin Tooltip"),
      __("Info"),
      require("./../../../browser/modules/height")().max,
      "smartphone",
      false,
      exId
    );

    // Append to DOM
    //==============
    try {
      ReactDOM.render(<BlueIdea />, document.getElementById(exId));
    } catch (e) {
      throw "Failed to load DOM";
    }
  },

  callBack: function (url) {
    utils.popupCenter(
      url,
      utils.screen().width - 100,
      utils.screen().height - 100,
      exId
    );
  },

  /**
   * This function disolves the geometry, and prepares it for querying
   */
  geometryDisolver: function (geojson) {
    // we need to wrap the geometry in a featurecollection, so we can use turf
    let collection = {
      type: "FeatureCollection",
      features: [],
    };

    // loop through all features, buffer them, and add them to the collection
    for (let i = 0; i < geojson.features.length; i++) {
      let feature = geojson.features[i];

      // If the type is not set, force it to be a Feature
      if (!feature.type) {
        feature.type = "Feature";
      }

      try {
        // If the feature as a radius property, use that as the buffer distance (points and markers)
        let buffered;
        if (
          feature.properties.distance &&
          feature.geometry.type == "Point" &&
          feature.properties.type == "circle"
        ) {
          try {
            let parsedRadii = feature.properties.distance.split(" ")[0];
            buffered = turfBuffer(feature, parsedRadii, {
              units: "meters",
            });
          } catch (error) {
            console.log(error, feature);
          }
        } else {
          buffered = turfBuffer(feature, exBufferDistance, {
            units: "meters",
          });
        }

        collection.features.push(buffered);
      } catch (error) {
        console.log(error, feature);
      }
    }

    // create a union of all the buffered features
    try {
      let polygons = collection.features;
      let union = polygons.reduce((a, b) => turfUnion(a, b), polygons[0]); // turf v7 will support union on featurecollection, v6 does not.
      collection = turfFlatten(union);
    } catch (error) {
      console.log(error, polygons);
    }

    // return geometry for querying
    return collection;
  },

  /**
   * This function is what starts the process of finding relevant addresses, returns array with kvhx
   * @param {*} geojson
   * @returns array with kvhx
   */
  queryAddress: function (geojson) {
    console.debug(geojson);

    //clear last geometries
    _clearAll();

    try {
      // Disolve geometry
      let geom = this.geometryDisolver(geojson);

      // show buffers on map
      this.addBufferToMap(geom);

      // Let user know we are starting
      this.createSnack(__("Waiting to start"));

      // For each flattened element, start a query for matrikels intersected
      let promises = [];
      for (let i = 0; i < geom.features.length; i++) {
        let feature = geom.features[i];
        promises.push(this.findMatriklerInPolygon(feature));
      }

      // When all queries are done, we can find the relevant addresses
      Promise.all(promises)
        .then((results) => {
          // Merge all results into one array
          try {
            let merged = this.mergeMatrikler(results);
            this.addMatrsToMap(merged);
            this.createSnack(__("Found parcels"));

            return merged;
          } catch (error) {
            console.log(error);
          }
        })
        .then((matrikler) => {
          // For each matrikel, find the relevant addresses
          let promises2 = [];
          for (let i = 0; i < matrikler.features.length; i++) {
            let feature = matrikler.features[i];
            promises2.push(this.findAddressesInMatrikel(feature));
          }

          Promise.all(promises2).then((results) => {
            let adresser = this.mergeAdresser(results);
            console.log(adresser);
            this.createSnack(__("Found addresses"));

            // Return number to UI
            return adresser;
          });
        })
        .catch((error) => {
          console.log(error);
          this.createSnack(__("Error in seach") + ": " + error);
          _clearAll();
          return [];
        });
    } catch (error) {
      console.log(error);
      this.createSnack(error);
      return [];
    }
  },

  mergeMatrikler: function (results) {
    let merged = {};
    for (let i = 0; i < results.length; i++) {
      // Guard against empty results, and results that are not featureCollections
      if (
        results[i] &&
        results[i].type == "FeatureCollection" &&
        results[i].features.length > 0
      ) {
        for (let j = 0; j < results[i].features.length; j++) {
          let feature = results[i].features[j];
          merged[feature.properties.featureid] = feature;
        }
      }
    }
    let newCollection = turfFeatureCollection(Object.values(merged));

    // Save the result to the global state
    me.setState({
      result_matrikler: newCollection,
    });
    return newCollection;
  },

  mergeAdresser: function (results) {
    try {
      // Merge all results into one array, keeping only kvhx
      let merged = [];
      for (let i = 0; i < results.length; i++) {
        // for each adresse in list, check if it is a kvhx, and add it to the merged list
        for (let j = 0; j < results[i].length; j++) {
          let feature = results[i][j];
          if (feature.kvhx) {
            merged.push(feature.kvhx);
          }
        }
      }
      // make use the merged list is unique
      merged = [...new Set(merged)];

      // Populate the UI with the number of addresses found
      me.setState({
        result_adresser: merged,
      });

      return merged;
    } catch (error) {
      console.log(error);
      return [];
    }
  },

  addBufferToMap: function (geojson) {
    try {
      var l = L.geoJson(geojson, {
        color: "#ff7800",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.1,
        dashArray: "5,3",
      }).addTo(bufferItems);
    } catch (error) {
      console.log(error, geojson);
    }
  },

  addMatrsToMap: function (geojson) {
    try {
      var l = L.geoJson(geojson, {
        color: "#000000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.2,
        dashArray: "5,3",
      }).addTo(queryMatrs);
    } catch (error) {
      console.log(error, geojson);
    }
  },

  createSnack: function (text) {
    $.snackbar({
      id: exSnackId,
      content: "<span id='blueidea-progress'>" + text + "</span>",
      htmlAllowed: true,
      timeout: 1000000,
    });
  },

  updateSnack: function (text) {
    $(exSnackId).snackbar("show");
    $("blueidea-progress").html(text);
  },

  /**
   * async function to query matrikel inside a single buffer
   * @param {*} feature
   */
  findMatriklerInPolygon: function (feature) {
    return new Promise((resolve, reject) => {
      // Create a query
      let query = {
        srid: 4326,
        polygon: JSON.stringify(feature.geometry.coordinates),
        format: "geojson",
        struktur: "flad",
      };

      // Send the query to the server
      $.ajax({
        url: "https://api.dataforsyningen.dk/jordstykker",
        type: "GET",
        data: query,
        success: function (data) {
          resolve(data);
        },
        error: function (data) {
          reject(data);
        },
      });
    });
  },

  /**
   * async function to query addresses inside a single parcel
   * @param {*} feature
   */
  findAddressesInMatrikel: function (feature) {
    return new Promise((resolve, reject) => {
      // Create a query
      let query = {
        ejerlavkode: feature.properties.ejerlavkode,
        matrikelnr: feature.properties.matrikelnr,
        struktur: "flad",
      };

      // Send the query to the server
      $.ajax({
        url: "https://api.dataforsyningen.dk/adresser",
        type: "GET",
        data: query,
        success: function (data) {
          resolve(data);
        },
        error: function (data) {
          reject(data);
        },
      });
    });
  },

  showResults: function (results) {
    console.log(results);
  },
  setCallBack: function (fn) {
    this.callBack = fn;
  },
};
