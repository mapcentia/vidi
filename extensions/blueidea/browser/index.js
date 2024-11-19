/*
 * @author     René Borella <rgb@geopartner.dk>
 * @copyright  2020- Geoparntner A/S
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

"use strict";

import {
  buffer as turfBuffer,
  point as turfPoint,
  flatten as turfFlatten,
  union as turfUnion,
  booleanPointInPolygon,
  featureCollection as turfFeatureCollection,
  applyFilter,
} from "@turf/turf";
import c from "express-cluster";

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
var exBufferDistance = 0.1;

/**
 *
 */
var mapObj;

//var gc2host = 'http://localhost:3000'
var config = require("../../../config/config.js");

/**
 * Draw module
 */
var draw;
var cloud;

var bufferItems = new L.FeatureGroup();
var queryMatrs = new L.FeatureGroup();
var queryVentils = new L.FeatureGroup();
var selectedPoint = new L.FeatureGroup();
var seletedLedninger = new L.FeatureGroup();
var alarmPositions = new L.FeatureGroup();

var _clearBuffer = function () {
  bufferItems.clearLayers();
};
var _clearMatrs = function () {
  queryMatrs.clearLayers();
};
var _clearVentil = function () {
  queryVentils.clearLayers();
};
var _clearSelectedPoint = function () {
  selectedPoint.clearLayers();
};
var _clearSeletedLedninger = function () {
  seletedLedninger.clearLayers();
};
var _clearAlarmPositions = function () {
  alarmPositions.clearLayers();
};

var _clearAll = function () {
  _clearBuffer();
  _clearMatrs();
  _clearVentil();
  _clearSelectedPoint();
  _clearSeletedLedninger();
  _clearAlarmPositions();
};

const MAXPARCELS = 250;


const resetObj = {
  authed: false,
  user_id: null,
  user_lukkeliste: false,
  user_blueidea: false,
  user_db: false,
  user_ventil_layer: null,
  user_udpeg_layer: null,
  user_ventil_layer_key: null,
  user_ventil_export: null,
  selected_profileid: null,
  user_alarmkabel: false,
  user_alarmkabel_distance: 0,
};

// This element contains the styling for the module
require("./style.js");

/**
 * async function to query matrikel inside a single buffer
 * @param {*} feature
 */
const findMatriklerInPolygon = function (feature, is_wkb = false) {
  return new Promise((resolve, reject) => {
    // Create a query
    let query = {
      srid: 4326,
      format: "geojson",
      struktur: "flad",
    };

    try {
      if (!is_wkb) {
        query.polygon = JSON.stringify(feature.geometry.coordinates)

      // Send the query to the server
      $.ajax({
        url: "/api/datahub/jordstykker",
        type: "GET",
        data: query,
        success: function (data) {
          resolve(data);
        },
        error: function (data) {
          reject(data);
        },
      });

      } else {
        query.wkb = feature;

        // Send the query to the server, but using post - as the wkb is too large for a get request
        $.ajax({
          url: "/api/datahub/jordstykker",
          type: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          data: JSON.stringify(query),
          success: function (data) {
            resolve(data);
          },
          error: function (data) {
            reject(data);
          },
        });
      }
    } catch (error) {
      throw error;
    }
  });
};

/**
 * async function to query addresses inside a single parcel
 * @param {*} feature
 */
const findAddressesInMatrikel = async function (feature) {
  try {
    // Create a query
    let query = {
      ejerlavkode: feature.properties.ejerlavkode,
      matrikelnr: feature.properties.matrikelnr,
      struktur: "flad",
    };

    // Send the query to the server
    let response = await $.ajax({
      url: "https://api.dataforsyningen.dk/adresser",
      type: "GET",
      data: query,
    });

    return response;
  } catch (error) {
    throw error;
  }
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
    layerTree = o.layerTree;
    switchLayer = o.switchLayer;
    layers = o.layers;
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
    /**
     *
     * Native Leaflet object
     */
    mapObj = cloud.get().map;
    mapObj.addLayer(bufferItems);
    mapObj.addLayer(queryMatrs);
    mapObj.addLayer(queryVentils);
    mapObj.addLayer(selectedPoint);
    mapObj.addLayer(seletedLedninger);
    mapObj.addLayer(alarmPositions);

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
    require("./i8n.js");

    /**
     *
     * @param txt
     * @returns {*}
     * @private
     */
    var __ = function (txt) {
      // Hack for locale not found?!
      //console.debug(window._vidiLocale);
      //console.debug(txt);

      if (dict[txt][window._vidiLocale]) {
        return dict[txt][window._vidiLocale];
      } else {
        return txt;
      }
    };


    var blocked = true;

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
          results_adresser: {},
          results_matrikler: [],
          results_ventiler: [],
          user_lukkeliste: null,
          user_blueidea: null,
          user_id: null,
          user_profileid: null,
          user_db: false,
          user_ventil_layer: null,
          user_ventil_layer_key: null,
          user_udpeg_layer: null,
          user_ventil_export: null,
          edit_matr: false,
          user_alarmkabel: null,
          user_alarmkabel_distance: config.extensionConfig.blueidea.alarmkabel_distance || 100,
          selected_profileid: '',
          lukkeliste_ready: false,
          TooManyFeatures: false,
          alarm_direction_selected: 'Both',
          alarm_skab_selected: '',
          alarm_skabe: null,
          results_alarmskabe: [],
        };
      }

      /**
       * Handle activation on mount
       */
      componentDidMount() {
        let me = this;
        draw.setBlueIdea(me);

        // Stop listening to any events, deactivate controls, but
        // keep effects of the module until they are deleted manually or reset:all is emitted
        backboneEvents.get().on("deactivate:all", () => {});

        // Activates module
        backboneEvents.get().on(`on:${exId}`, () => {
          //console.debug("Starting blueidea");
          me.setState({
            active: true,
            edit_matr: false,
          });

          // if logged in, get user
          if (me.state.authed) {
            return this.getUser();
          } else {
            me.setState(resetObj);
          }
        });

        // Deactivates module
        backboneEvents.get().on(`off:${exId} off:all reset:all`, () => {
          //console.debug("Stopping blueidea");
          _clearAll();
          blocked = true;
          me.setState({
            active: false,
            user_lukkeliste: false,
            edit_matr: false,
          });
        });

        // On auth change, handle Auth state
        backboneEvents.get().on(`session:authChange`, () => {
          //console.debug("Auth changed!");
          fetch("/api/session/status")
            .then((r) => r.json())
            .then((obj) => {
              return me.setState({
                authed: obj.status.authenticated,
              });
            })
            .then(() => {
              // if logged in, get user
              if (me.state.authed) {
                return this.getUser();
              } else {
                me.setState(resetObj);
              }
            })
            .catch((e) => {
              //console.debug("Error in session:authChange", e);
              me.setState(resetObj);
            })
            .finally(() => {
              // If logged in, and user_id is not null, show buttons
              if (me.state.authed && me.state.user_id) {
                // If user has blueidea, show buttons
                if (me.state.user_blueidea == true) {
                  $("#_draw_blueidea_group").show();
                } else {
                  $("#_draw_blueidea_group").hide();
                }
                // TODO: Disabled for now, but lists templates
                //this.getTemplates();
              } else {
                // If not logged in, hide buttons
                $("#_draw_blueidea_group").hide();
              }
            });
        });
      }

      /**
       * Get templates from backend
       * @returns {Promise<void>}
       * @private
       */
      getTemplates() {
        let me = this;

        // guard against no projectid in state
        if (!me.state.user_profileid) {
          return;
        }

        fetch(
          "/api/extension/blueidea/" +
            config.extensionConfig.blueidea.userid +
            "/GetSmSTemplates"
        )
          .then((r) => r.json())
          .then((obj) => {
            //console.debug("Got templates", obj);
          })
          .catch((e) => {
            //console.debug("Error in getTemplates", e);
          });
      }

      /**
       * Get select options from alarmskabe
       */
      createAlarmskabeOptions(list) {
        // This function parses the geojson list of alarmskabe from state, into a select option lis
        let me = this;
        let options = [];
        if (list) {
          for (let i = 0; i < list.length; i++) {
            let feature = list[i];
            let option = {
              value: feature.properties.value,
              label: feature.properties.text,
            };

            options.push(option);
          }
        }
        return options;
      }

      /**
       * Get user from backend
       * @returns {Promise<void>}
       * @private
       */
      getUser() {
        let me = this;
        // If user is set in extensionconfig, set it in state and get information from backend
        if (config.extensionConfig.blueidea.userid) {
          return new Promise(function (resolve, reject) {
            $.ajax({
              url:
                "/api/extension/blueidea/" +
                config.extensionConfig.blueidea.userid,
              type: "GET",
              success: function (data) {
                console.log("[Lukkeliste] Got user", data);

                // If data.profileid has values, set the first key as the selected
                let userProfiles = [];
                if (data.profileid) {
                  userProfiles = Object.keys(data.profileid);
                }

                let alarmskabe = me.createAlarmskabeOptions(data.alarm_skabe);

                me.setState({
                  user_lukkeliste: data.lukkeliste,
                  user_blueidea: data.blueidea,
                  user_id: config.extensionConfig.blueidea.userid,
                  user_profileid: data.profileid || null,
                  user_db: data.db || false,
                  user_udpeg_layer: data.udpeg_layer || null,
                  user_ventil_layer: data.ventil_layer || null,
                  user_ventil_layer_key: data.ventil_layer_key || null,
                  user_ventil_export: data.ventil_export || null,
                  selected_profileid: userProfiles[0] || '',
                  user_alarmkabel: data.alarmkabel,
                  alarm_skabe: alarmskabe,
                  alarm_skab_selected: alarmskabe[0].value || '',
                  lukkeliste_ready: data.lukkestatus.views_exists || false,
                });
                resolve(data);
              },
              error: function (e) {
                //console.debug("Error in getUser", e);
                reject(e);
              },
            });
          });
        } else {
          return;
        }
      }

      /**
       * This function queries database for related matrikler and ventiler
       * @returns uuid string representing the query
       */
      queryPointLukkeliste = async (point) => {
        let me = this;

        try {
          let response = await $.ajax({
            url: "/api/extension/lukkeliste/" + me.state.user_id + "/query",
            type: "POST",
            data: JSON.stringify(point),
            contentType: "application/json",
          });
          return response;
        } catch (error) {
          throw error.responseJSON;
        }
      };

      /**
       * This function queries database for information related to alarmkabel
       * @returns uuid string representing the query
       */
      queryPointAlarmkabel = (point, distance, direction) => {
        let me = this;
        let body = point;
        body.distance = distance;  //append distance to body
        body.direction = direction; //append direction to body

        return new Promise(function (resolve, reject) {
          $.ajax({
            url: "/api/extension/alarmkabel/" + me.state.user_id + "/query",
            type: "POST",
            data: JSON.stringify(body),
            contentType: "application/json",
            success: function (data) {
              resolve(data);
            },
            error: function (e) {
              reject(e);
            },
          });
        });
      }

            /**
       * This function queries database for information related to alarmkabel
       * @returns uuid string representing the query
       */
      queryPointAlarmskab = (point, direction, alarmskab_gid) => {
        let me = this;
        let body = point;
        body.direction = direction;  //append distance to body
        body.alarmskab = alarmskab_gid; //append alarmskab to body

        return new Promise(function (resolve, reject) {
          $.ajax({
            url: "/api/extension/alarmskab/" + me.state.user_id + "/query",
            type: "POST",
            data: JSON.stringify(body),
            contentType: "application/json",
            success: function (data) {
              resolve(data);
            },
            error: function (e) {
              reject(e);
            },
          });
        });
      }

      /**
       * This function is what starts the process of finding relevant addresses, returns array with kvhx
       * @param {*} geojson
       * @returns array with kvhx
       */
      queryAddresses(geojson, is_wkb = false) {
        let me = this;
        //console.debug("queryAddresses: ", geojson);

        // if no features in featurecollection, return
        if (!geojson.features.length) {
          console.log("No features in geojson");
          return;
        }

        try {
          let promises = [];
          // if the geometry is not wkb, act as if it is geojson
          if (!is_wkb) {
            // Disolve geometry
            let geom = this.geometryDisolver(geojson);

            // show buffers on map
            this.addBufferToMap(geom);

            // Let user know we are starting
            me.createSnack(__("Waiting to start"), true);

            // For each flattened element, start a query for matrikels intersected
            for (let i = 0; i < geom.features.length; i++) {
              let feature = geom.features[i];
              promises.push(findMatriklerInPolygon(feature));
            }

          } else {
            // if the geometry is wkb, we pass the geometry directly to the query
            //console.debug("WKB", geojson);
            let aggr = geojson.features[0].properties.aggregated_geom;
            promises.push(findMatriklerInPolygon(aggr, true));
          }

          // When all queries are done, we can find the relevant addresses
          Promise.all(promises)
            .then((results) => {
              //console.debug("Got matrikler", results);
              // Merge all results into one array
              let merged = this.mergeMatrikler(results);
              
              // if the number of matrs is larger than maxparcels, dont add to map
              if (merged.features.length < MAXPARCELS) {
                this.addMatrsToMap(merged);
              }

              //me.createSnack(__("Found parcels"));

              return merged;
            })
            .then((matrikler) => {
              // For each matrikel, find the relevant addresses
              let promises2 = [];

              // if the number is too high, dont get addresses aswell.
              if (matrikler.features.length > MAXPARCELS) {
                me.setState({
                  edit_matr: false,
                  TooManyFeatures: true,
                });
                me.setState({
                  results_matrikler: matrikler,
                });
                return;

              } else {
                // Set results
                me.setState({
                  results_adresser: this.getAdresser(matrikler),
                  results_matrikler: matrikler,
                  edit_matr: false,
                });
                return;
              }
            })
            .catch((error) => {
              console.warn('findMatriklerInPolygon:', error);
              me.createSnack(__("Error in search"));
              throw error;
            });
        } catch (error) {
          console.warn('queryAddresses:', error);
          me.createSnack(error);
          return;
        }
      }

      /**
       * This function disolves the geometry, and prepares it for querying
       */
      geometryDisolver(geojson) {
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
                console.warn(error, feature);
              }
            } else {
              buffered = turfBuffer(feature, exBufferDistance, {
                units: "meters",
              });
            }

            collection.features.push(buffered);
          } catch (error) {
            console.warn(error, feature);
          }
        }

        // DISABLED: Disolve geometry - disabled because DAWA call doesnt support that many coordinates in each call
        // create a union of all the buffered features
        //try {
        //  let polygons = collection.features;
        //  let union = polygons.reduce((a, b) => turfUnion(a, b), polygons[0]); // turf v7 will support union on featurecollection, v6 does not.
        //  collection = turfFlatten(union);
        //} catch (error) {
        //  //console.debug(error, polygons);
        //}

        // return geometry for querying
        return collection;
      }

      /**
       * Merges all matrikler into one featurecollection
       * @param {*} results
       */
      mergeMatrikler(results) {
        let me = this;
        let merged = {};

        try {
          for (let i = 0; i < results.length; i++) {
            // Guard against empty results, and results that are not featureCollections
            if (
              results[i] &&
              results[i].type == "FeatureCollection" &&
              results[i].features.length > 0
            ) {
              for (let j = 0; j < results[i].features.length; j++) {
                // If the matrikel is a litra - starts with 7000, ignore it in the list
                if (
                  results[i].features[j].properties.matrikelnr.startsWith(
                    "7000"
                  )
                ) {
                  continue;
                }

                // If the matikel has a registreretarel that is equal to vejareal, ignore it in the list
                if (
                  results[i].features[j].properties.registreretareal ==
                  results[i].features[j].properties.vejareal
                ) {
                  continue;
                }

                let feature = results[i].features[j];
                merged[feature.properties.featureid] = feature;
              }
            }
          }
          let newCollection = turfFeatureCollection(Object.values(merged));
          return newCollection;
        } catch (error) {
          console.warn(error);
        }
      }

      /**
       * Merges all adresser into one array
       * @param {*} results
       */
      mergeAdresser(results) {
        let me = this;
        try {
          // Merge all results into one array, keeping only kvhx
          let merged = {};
          for (let i = 0; i < results.length; i++) {
            // for each adresse in list, check if it is a kvhx, and add it to the merged list
            for (let j = 0; j < results[i].length; j++) {
              let feature = results[i][j];
              if (feature.kvhx) {
                merged[feature.kvhx] = feature;
              }
            }
          }
          return merged;
        } catch (error) {
          console.warn(error);
          return [];
        }
      }
      /**
       * Styles and adds the buffer to the map (from the geometryDisolver)
       */
      addBufferToMap(geojson) {
        try {
          var l = L.geoJSON(geojson, {...styleObject.buffer,interactive: false}).addTo(bufferItems);
        } catch (error) {
          console.warn(error, geojson);
        }
      }

      /**
       * Styles and adds the matrikler to the map
       */
      addMatrsToMap(geojson) {
        try {
          // Make a layer per feature.
          geojson.features.forEach((feature) => {
            let l = L.geoJSON(feature, {...styleObject.matrikel, interactive: false}).addTo(queryMatrs);
          });
        } catch (error) {
          console.warn(error, geojson);
        }
      }

      /**
       * Styles and adds ventiler to the map
       */
      addVentilerToMap(geojson) {
        try {
          var l = L.geoJSON(geojson, {
            pointToLayer: function (feature, latlng) {
              // //console.debug(feature.properties, latlng);
              // if the feature has a forbundet property, use a different icon
              if (feature.properties.forbundet) {
                // //console.debug(feature.properties, latlng);
                return L.circleMarker(latlng, {...styleObject.ventil_forbundet, interactive: false});
              }
              // else, use the default icon
              return L.circleMarker(latlng, {...styleObject.ventil, interactive: false});
            },
          }).addTo(queryVentils);
        } catch (error) {
          console.warn(error, geojson);
        }
      }

      /**
       * Styles and adds ledninger to the map
       */
      addSelectedLedningerToMap(geojson) {
        try {
          var l = L.geoJSON(geojson, {...styleObject.selectedLedning, interactive: false}).addTo(seletedLedninger);
        } catch (error) {
          console.warn(error, geojson);
        }
      }

      /**
       * Styles and adds the selected point to the map
       */
      addSelectedPointToMap(geojson) {
        try {
          var myIcon = new L.DivIcon(styleObject.selectedPoint);
          var l = L.geoJSON(geojson, {
            pointToLayer: function (feature, latlng) {
              return new L.Marker(latlng, { icon: myIcon, interactive: false });
            },
          }).addTo(selectedPoint);
        } catch (error) {
          console.warn(error, geojson);
        }
      }

      /**
       * Styles and adds the alarm positions to the map
       */
      addAlarmPositionToMap(geojson) {
        try {
          var myIcon = new L.DivIcon(styleObject.alarmPosition);
          var l = L.geoJSON(geojson, {
            pointToLayer: function (feature, latlng) {
              return new L.Marker(latlng, { icon: myIcon, interactive: false });
            },
          }).addTo(alarmPositions);
        } catch (error) {
          console.warn(error, geojson);
        }
      }

      /**
       * Creates a new snackbar
       * @param {*} text
       */
      createSnack(text, loading = false) {
        let html = "";
        // if loading is true, show a loading spinner in the snackbar
        if (loading) {
          html = "<span class='spinner-border spinner-border-sm'></span><span id='blueidea-progress'> " + text + "</span>";
        } else {
          html = "<span id='blueidea-progress'>" + text + "</span>"
        }

        utils.showInfoToast(html, { timeout: 5000, autohide: false})
      }


      /**
       * Simulates a click on the login button
       */
      clickLogin() {
        document.querySelector('[data-bs-target="#login-modal"]').click();
      }

      /**
       * Sends user to draw tab
       */
      clickDraw() {
        _clearAll();
        const e = document.querySelector('#main-tabs a[href="#draw-content"]');
        if (e) {
            bootstrap.Tab.getInstance(e).show();
            e.click();
        } else {
            console.warn(`Unable to locate #draw-content`)
        }
      }

      /**
       * This function builds relevant data for the blueidea API
       * @returns SmsGroupId for redirecting to the correct page
       */
      sendToBlueIdea = () => {
        let body = {
          profileId: parseInt(this.state.selected_profileid) || null,
        };

        // if blueidea is false, return
        if (!this.state.user_blueidea) {
          // show error in snackbar
          this.createSnack(__("NotAllowedBlueIdea"));
          return;
        }

        // take the curent list of addresses and create an array of objects containing the kvhx
        let keys = Object.keys(this.state.results_adresser);
        let adresser = keys.map((kvhx) => {
          return { kvhx: kvhx };
        });
        body.addresses = adresser;

        $.ajax({
          url:
            "/api/extension/blueidea/" +
            config.extensionConfig.blueidea.userid +
            "/CreateMessage",
          type: "POST",
          data: JSON.stringify(body),
          contentType: "application/json",
          dataType: "json",
          success: function (data) {
            if (data.smsGroupId) {
              window.open(
                "https://dk.sms-service.dk/message-wizard/write-message?smsGroupId=" +
                  data.smsGroupId,
                "_blank"
              ); // open in new tab
            }
          },
          error: function (error) {
            //console.debug(error);
          },
        });
      };

      /**
       * This function turns on a layer, if it is not already on the map, and refreshes the map if there is a filter set.
       */
      turnOnLayer = (layer, filter = null) => {
        // guard against empty layer
        if (!layer) {
          return;
        }

        let isOn = () => {
          // if layer is in layerTree.getActiveLayers() return true
          let activeLayers = layerTree.getActiveLayers();
          for (let i = 0; i < activeLayers.length; i++) {
            if (activeLayers[i].id == layer.id) {
              return true;
            }
          }
          return false;
        };

        // if the layer is not on the map, anf the filter is empty, turn it on
        if (!isOn()) {
          switchLayer.init(layer, true);
        }

        //console.debug(layer, filter);

        // if the filter is not empty, apply it, and refresh the layer
        if (filter) {
          layerTree.onApplyArbitraryFiltersHandler(filter, false);
          layerTree.reloadLayerOnFiltersChange(layer);
        }
      };

      /**
       * This function selects a point in the map
       * @returns Point
       */
      selectPointLukkeliste = () => {
        let me = this;
        let point = null;
        blocked = false;
        _clearAll();
        
        me.setState({
          results_adresser: {},
          results_matrikler: [],
          edit_matr: false,
          TooManyFeatures: false,
        });

        // if udpeg_layer is set, make sure it is turned on
        if (me.state.user_udpeg_layer) {
          me.turnOnLayer(me.state.user_udpeg_layer);
        }

        // change the cursor to crosshair and wait for a click
        utils.cursorStyle().crosshair();

        cloud.get().on("click", async function (e) {

          // remove event listener
          cloud.get().map.off("click");

          // if the click is blocked, return
          if (blocked) {
            return;
          }

          me.createSnack(__("Starting analysis"), true)

          // get the clicked point
          point = e.latlng;
          utils.cursorStyle().reset();
          blocked = true;

          // send the point to the server
          let data = {}
          try {
            data = await me.queryPointLukkeliste(point)
          }
          catch (error) {
            me.createSnack(__("Error in search") + ": " + error.message);
            console.warn(error);
            return
          }

          //console.debug(data);

          if (data.ledninger) {
            //console.debug("Got ledninger:", data.ledninger);
            me.addSelectedLedningerToMap(data.ledninger);
            me.setState({
              results_ledninger: data.ledninger.features,
            });
          }
          // Add the clicked point to the map
          if (data.log) {
            //console.debug("Got log:", data.log);
            me.addSelectedPointToMap(data.log);
          }
          if (data.ventiler) {
            //console.debug("Got ventiler:", data.ventiler);
            me.addVentilerToMap(data.ventiler);
            me.setState({
              results_ventiler: data.ventiler.features,
            });
          }

          // Getting matrikler is another task, so we seperate it here in a try-catch to get errors to the frontend
          try {
            if (data.matrikler) {
              let parcelcount = data.matrikler.features[0].properties.matr_count;
              if (parcelcount > MAXPARCELS) {
                me.createSnack(__("Large number of parcels found") + " (" + parcelcount + "/" + MAXPARCELS + ")");
              } 
              me.queryAddresses(data.matrikler, true);
            }
          } catch (error) {
            console.warn(error);
            return
          }
        });
        return
      };

      /**
       * This function selects a point in the map for alarmkabel
       * @returns Point
       */
      selectPointAlarmkabel = () => {
        let me = this;
        let point = null;
        blocked = false;
        _clearAll();

        // if udpeg_layer is set, make sure it is turned on
        if (me.state.user_udpeg_layer) {
          me.turnOnLayer(me.state.user_udpeg_layer);
        }

        // If distance is not set, or is 0, return
        if (!me.state.user_alarmkabel_distance || me.state.user_alarmkabel_distance == 0) {
          me.createSnack(__("Distance not set"));
          return;
        }
        // change the cursor to crosshair and wait for a click
        utils.cursorStyle().crosshair();

        cloud.get().on("click", function (e) {

          // remove event listener
          cloud.get().map.off("click");

          // if the click is blocked, return
          if (blocked || !me.state.active) {
            return;
          }

          me.createSnack(__("Starting analysis"), true)

          // get the clicked point
          point = e.latlng;
          utils.cursorStyle().reset();
          blocked = true;

          // send the point to the server + the distance
          me.queryPointAlarmkabel(point, me.state.user_alarmkabel_distance, me.state.alarm_direction_selected)
            .then((data) => {

              me.createSnack(__("Alarm found"))
              // if the server returns a result, show it
              if (data) {
                // console.debug(data);                
                me.addAlarmPositionToMap(data.alarm);
              }

              // Add the clicked point to the map
              if (data.log) {
                //console.debug("Got log:", data.log);
                me.addSelectedPointToMap(data.log);
              }
              return
            })
            .catch((error) => {
              me.createSnack(__("Error in search") + ": " + error);
              console.warn(error);
              return
            });
        });
        return
      };

      /**
       * This function parses the alarmskabe results into a list of objects
       * @returns List of objects
       * 
       */
      parseAlarmskabeResults = (features) => {
        let results = [];
        features.forEach((feature) => {
          let obj = {
            direction: feature.properties.dir,
            distance: feature.properties.afstand,
          };

          // Translate the direction to human readable
          if (feature.properties.dir == "FT") {
            obj.direction = __("From-To");
          } else if (feature.properties.dir == "TF") {
            obj.direction = __("To-From");
          }

          // Round the distance to 2 decimals
          obj.distance = Math.round(obj.distance * 100) / 100;
          results.push(obj);
        });
        return results;
      };
      
      /**
       * This function selects a point in the map for alarmkabel, based on a specific alarmskab
       * @returns Point
       */
      selectPointAlarmskab = () => {
        let me = this;
        let point = null;
        blocked = false;
        _clearAll();
        
        // Reset the results
        me.setState({
          results_alarmskabe: [],
        });

        // if udpeg_layer is set, make sure it is turned on
        if (me.state.user_udpeg_layer) {
          me.turnOnLayer(me.state.user_udpeg_layer);
        }

        // change the cursor to crosshair and wait for a click
        utils.cursorStyle().crosshair();

        cloud.get().on("click", function (e) {

          // remove event listener
          cloud.get().map.off("click");

          // if the click is blocked, return
          if (blocked) {
            return;
          }

          me.createSnack(__("Starting analysis"), true)

          // get the clicked point
          point = e.latlng;
          utils.cursorStyle().reset();
          blocked = true;

          // send the point to the server + the direction and alarm_skab
          me.queryPointAlarmskab(point, me.state.alarm_direction_selected, me.state.alarm_skab_selected)
            .then((data) => {

              me.createSnack(__("Alarm found"))
              // if the server returns a result, show it
              if (data) {
                // console.debug(data);                
                me.addAlarmPositionToMap(data.alarm);

                // Add the results to the list in state
                me.setState({
                  results_alarmskabe: me.parseAlarmskabeResults(data.alarm.features),
                });
              }

              // Add the clicked point to the map
              if (data.log) {
                //console.debug("Got log:", data.log);
                me.addSelectedPointToMap(data.log);
              }
              return
            })
            .catch((error) => {
              me.createSnack(__("Error in seach") + ": " + error);
              console.warn(error);
              return
            });
        });
        return
      };

      toggleEdit = () => {
        let me = this;

        // If the edit state is false, we enable it
        if (!me.state.edit_matr) {
          utils.cursorStyle().crosshair();
          cloud.get().map.on("click", function (e) {
            // if the edit state is true, and the event is a click, add the matrikel to the list

            // 2 things can happen here, either we hit an already selected matrikel, or we hit somewhere without a matrikel.
            // if we hit a matrikel, we remove it from the list, if we hit somewhere without a matrikel, we add it and the adresse it represents to the lists

            // get the clicked point
            let point = e.latlng;
            point = turfPoint([point.lng, point.lat]);

            // Did we hit a feature on queryMatrs?
            let hit = false;
            let feature

            // Check if the point is inside a feature on queryMatrs. The point needs to be inside a feature, and the feature needs to be a matrikel
            queryMatrs.eachLayer(function (layer) {
              // We need to go further down the rabbit hole, and check if the point is inside the feature
              layer.eachLayer(function (sublayer) {
                if (booleanPointInPolygon(point, sublayer.feature)) {
                  hit = true;
                  feature = layer;
                }
              });
            });      
            
            // If we dit not hit a feature, we add it to the list, and query the addresses
            if (!hit) {
              // Add matrikel and adress to the list
              me.addSingleMatrikel(point)
            } else {
              // Remove matrikel from list and map.
              me.removeSingleMatrikel(feature)
            }
          });
        } else {
          utils.cursorStyle().reset();
          cloud.get().map.off("click");
        }

        // switch the current state
        me.setState({
          edit_matr: !me.state.edit_matr,
        })
      };
      addSingleMatrikel = async function(point) {
        let me = this;

        // Based on clicked point, query for matrikel and adresse information. add these to map and lists.
        // create a simple point feature, using a very small buffer
        let buffered = turfBuffer(point, 0.0001, {
          units: "meters",
        });

        // Query for matrikel & Adresse
        let matrikel = await findMatriklerInPolygon(buffered);
        let adresse = await findAddressesInMatrikel(matrikel.features[0]);

        // Add matrikel to map
        me.addMatrsToMap(matrikel);

        // Merge the new adresse and matrilkel into the existing lists
        let newAdresser = Object.assign({}, me.state.results_adresser);
        adresse.forEach((a) => {
          newAdresser[a.kvhx] = a;
        });

        // Set the new state
        me.setState({
          results_adresser: newAdresser
        });
      };

      removeSingleMatrikel = function(layer) {
        // Remove matrikel from list and map

        // Using the matrikelnr and ejerlavkode, we can remove the matrikel from the list of matrikler
        let matrikel, ejerlav
        layer.eachLayer(function (sublayer) {
          matrikel = sublayer.feature.properties.matrikelnr;
          ejerlav = sublayer.feature.properties.ejerlavkode;
        });

        //console.log(matrikel, ejerlav)

        // Remove adresse from list
        let newAdresser = Object.assign({}, this.state.results_adresser);

        // filter out the addresses that contain the matrikel and ejerlav
        let filtered = []
        for (let key in newAdresser) {
          let a = newAdresser[key];
          if (a.matrikelnr != matrikel || a.ejerlavkode != ejerlav) {
            filtered.push(a);
          }
        }
        // Remove matrikel from map
        queryMatrs.removeLayer(layer);

        // Set the new state
        this.setState({
          results_adresser: filtered
        });
      }

      clearVentilFilter = () => {
        me.turnOnLayer(me.state.ventil_layer, me.buildVentilFilter());
      };

      buildVentilFilter = (keys = undefined) => {
        let me = this;
        var filter = {};

        if (!keys) {
          // If no key is set, create the "clear" filter
          filter[me.state.ventil_layer] = {
            match: "any",
            columns: [],
          };
        } else {
          let columns = [];

          //for each key in keys, create a filter and add to columns
          keys.forEach((key) => {
            columns.push({
              fieldname: me.state.ventil_layer_key,
              expression: "=",
              value: String(key),
              restriction: false,
            });
          });

          // create the filter
          filter[me.state.ventil_layer] = {
            match: "any",
            columns: columns,
          };
        }

        //console.debug(filter);

        return filter;
      };

      /**
       * Determines if the plugin is ready after getting results
       * @returns boolean
       */
      readyToSend = () => {
        // if adresse array is not empty, return true
        if (Object.keys(this.state.results_adresser).length > 0) {
          return true;
        } else {
          return false;
        }
      };

      /**
       * Determines if the result is ready to be sent to blueidea
       * @returns boolean
       */
      readyToBlueIdea = () => {
        // if readyToSend is true, and blueidea is true, return true
        if (this.readyToSend() && this.allowBlueIdea()) {
          return true;
        } else {
          return false;
        }
      };

      /**
       * Determines if lukkeliste is allowed
       * @returns boolean
       */
      allowLukkeliste = () => {
        if (this.state.user_lukkeliste == true && this.state.user_db == true) {
          return true;
        } else {
          return false;
        }
      };

      /**
       * Determines if alarmkabel is allowed
       */
      allowAlarmkabel = () => {
        if (this.state.user_alarmkabel == true && this.state.user_db == true) {
          return true;
        } else {
          return false;
        }
      }

      /**
       * Determines if blueidea is allowed
       * @returns boolean
       */
      allowBlueIdea = () => {
        if (this.state.user_blueidea == true) {
          return true;
        } else {
          return false;
        }
      };

      /**
       * Determines if ventiler can be downloaded
       * @returns boolean
       */
      allowVentilDownload = () => {
        let me = this;

        if (
          this.state.results_ventiler.length > 0 &&
          this.allowLukkeliste() &&
          this.state.user_ventil_export
        ) {
          return true;
        } else {
          return false;
        }
      };

      /**
       * This function converts an array to a csv string
       * @param {*} data
       * @returns
       */
      arrayToCsv(data) {
        return data
          .map(
            (row) =>
              row
                .map(String) // convert every value to String
                .map((v) => v.replaceAll('"', '""')) // escape double colons
                .map((v) => `"${v}"`) // quote it
                .join(",") // comma-separated
          )
          .join("\r\n"); // rows starting on new lines
      };

      /**
       * Downloads blob to file, using ANSI encoding
       */
      downloadBlob = (content, filename, contentType) => {
        // Create a blob, append the BOM and charset
        var blob = new Blob(
          [
            new Uint8Array([0xef, 0xbb, 0xbf]), // UTF-8 BOM
            content,
          ],
          { type: contentType + ";charset=UTF-8" }
        );
        var url = URL.createObjectURL(blob);

        // Create a link to download it
        var pom = document.createElement("a");
        pom.href = url;
        pom.setAttribute("download", filename);
        pom.click();
      };

      /**
       * Gets adresser when there is too many features
       */
      getAdresser = async (matrikler) => {
        let me = this;

        let results = [];

        for (let i = 0; i < matrikler.features.length; i++) {
          let feature = matrikler.features[i];
          results.push(await findAddressesInMatrikel(feature));
          // Show progress per 25 features
          if (i % 25 == 0) {
            me.createSnack(__("Found addresses") + " " + i + "/" + matrikler.features.length);
          }
        }

        let adresser = this.mergeAdresser(results);
        me.createSnack(__("Found addresses"));

        // Set results
        me.setState({
          results_adresser: adresser,
          edit_matr: false,
          TooManyFeatures: false,
        });

        return;
      };

      /**
       * downloads a csv file with the results from adresser
       * @param {*} object kvhx af key/value pairs
       */
      downloadAdresser = () => {
        let me = this;
        let csvRows = [
          ["kvhx", "Vejnavn", "Husnummer", "Etage", "Dør", "Postnummer", "By"],
        ];

        // from the results, append to cvsRows
        for (let key in Object.keys(me.state.results_adresser)) {
          let feat =
            me.state.results_adresser[
              Object.keys(me.state.results_adresser)[key]
            ];
          // console.log(feat);
          let row = [
            feat.kvhx,
            feat.vejnavn,
            feat.husnr,
            feat.etage,
            feat.dør,
            feat.postnr,
            feat.postnrnavn,
          ];
          csvRows.push(row);
        }

        let rows = me.arrayToCsv(csvRows);
        this.downloadBlob(rows, "adresser.csv", "text/csv;");
      };

      /**
       * downloads a csv file with the results from ventiler
       */
      downloadVentiler = () => {
        let me = this;

        //console.log(me.state.results_ventiler, me.state.user_ventil_export);

        // Use keys as headers
        let csvRows = [];
        csvRows.push(Object.keys(me.state.user_ventil_export));

        // for each feature in results_ventiler, append to csvRows with the values from the user_ventil_export
        for (let index in me.state.results_ventiler) {
          let feature = me.state.results_ventiler[index].properties;

          // create a row, using the values from the user_ventil_export
          let columns = Object.values(me.state.user_ventil_export);
          let row = [];

          // Add values to row
          for (let c in columns) {
            row.push(feature[columns[c]]);
          }
          // Add row to file
          csvRows.push(row);
        }

        let rows = me.arrayToCsv(csvRows);
        this.downloadBlob(rows, "ventiler.csv", "text/csv;");
      };

      profileidOptions = () => {
        let options = [];

        // if user_profileid is set, create options.
        if (this.state.user_profileid) {
          for (let key in this.state.user_profileid) {
            options.push({
              value: key,
              label: this.state.user_profileid[key],
            });
          }
        }
        return options;
      }

      setSelectedProfileid = (e) => {
        this.setState({ selected_profileid: e.target.value });
      }

      /**
       * Renders component
       */
      render() {
        const _self = this;
        const s = _self.state;

        // If not logged in, show login button
        if (s.authed && s.user_id) {
          // Logged in
          return (
            <div role="tabpanel">
              <div className="form-group p-3">
                <div style={{ alignSelf: "center" }}>
                  <h6>
                    {__("Select area")} 
                    {
                    s.lukkeliste_ready && this.allowLukkeliste() &&
                      <span className="mx-2 badge bg-success">{__("Lukkeliste is ready")}</span>
                    }
                    {
                    !s.lukkeliste_ready && this.allowLukkeliste() &&
                      <span className="mx-2 badge bg-danger">{__("Lukkeliste not ready")}</span>
                    }
                  </h6>
                  <div className="d-grid mx-auto gap-3">
                    <button
                      onClick={() => this.clickDraw()}
                      className="btn btn-outline-secondary"
                      disabled={!this.allowBlueIdea()}
                    >
                      {__("Draw area")}
                    </button>
                    <button
                      onClick={() => this.selectPointLukkeliste()}
                      className="btn btn-primary"
                      disabled={!this.allowLukkeliste() | s.edit_matr}
                    >
                      {__("Select point on map")}
                    </button>
                  </div>
                </div>

                <div className="row">
                  <div className="col">
                    <h6>{__("Show results")}</h6>
                    <div className="d-flex align-items-center justify-content-between">
                      <span>Der blev fundet {Object.keys(s.results_adresser).length} adresser i området.</span>                            
                      <button 
                        disabled={Object.keys(s.results_adresser).length == 0}
                        title={__("modify parcels")}
                        className="btn btn-outline-secondary"
                        onClick={() => this.toggleEdit()}>
                          {s.edit_matr ? <i className="bi bi-x"></i> : <i className="bi bi-pencil"></i>}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="d-grid mx-auto gap-3">
                  <button
                    onClick={() => this.downloadAdresser()}
                    className="btn btn-outline-secondary"
                    disabled={!this.readyToSend()}
                    hidden={s.TooManyFeatures}
                  >
                    {__("Download addresses")}
                  </button>

                  <button
                    onClick={() => this.getAdresser(s.results_matrikler)}
                    className="btn btn-primary"
                    hidden={!s.TooManyFeatures}
                  >
                    {__("Get addresses")}
                  </button>

                  {s.user_profileid && this.profileidOptions().length > 1 &&
                    <select
                      onChange={this.setSelectedProfileid}
                      value={s.selected_profileid}
                      placeholder={__("Select profile")}
                      disabled={!this.readyToBlueIdea()}
                    >
                      {this.profileidOptions().map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  }

                  <button
                    onClick={() => this.sendToBlueIdea()}
                    className="btn btn-outline-secondary"
                    disabled={!this.readyToBlueIdea()}
                  >
                    {__("Go to blueidea")}
                  </button>
                </div>

                <div
                  style={{ alignSelf: "center" }}
                  hidden={!s.user_lukkeliste}
                >
                  <h6>{__("Valve list")}</h6>
                  <div className="d-grid mx-auto gap-3">
                    <button
                      onClick={() => this.downloadVentiler()}
                      className="btn btn-outline-secondary"
                      disabled={!this.allowVentilDownload()}
                    >
                      {__("Download valves")}
                    </button>
                  </div>
                </div>

                <div
                  style={{ alignSelf: "center" }}
                  hidden={!s.user_alarmkabel}
                >
                  <h6>{__("Alarm cable")}</h6>

                  <select
                      className="form-select"
                      value={s.alarm_direction_selected}
                      onChange={(e) => this.setState({ alarm_direction_selected: e.target.value })}
                    >
                      <option value="FT">{__('From-To')}</option>
                      <option value="TF">{__('To-From')}</option>
                      <option value="Both">{__('Both')}</option>
                    </select>
                    <div className="form-text mb-3">Angiv søgeretning</div>
                  
                  <div className="vertical-center col-auto">
                    {__("Distance from point")}
                  </div>
                  
                  <div className="input-group">
                    <input
                      type="number"
                      className="form-control"
                      value={s.user_alarmkabel_distance}
                      onChange={(e) => this.setState({ user_alarmkabel_distance: e.target.value })}
                      min={0}
                      max={2000}
                      style={{ width: "35%" }}
                    />
                    <button
                      onClick={() => this.selectPointAlarmkabel()}
                      className="btn btn-primary col-auto"
                      disabled={!this.allowAlarmkabel()}
                    >
                      {__("Select point for alarmkabel")}
                    </button>
                  </div>
                  <div className="form-text mb-3">Angiv antal meter, og udpeg punkt.</div>
                </div>

                <div
                  style={{ alignSelf: "center" }}
                  hidden={!s.user_alarmkabel}
                >
                  <div className="vertical-center col-auto">
                  {__("Distance from cabinet")}
                  </div>
                  
                  <div className="input-group">
                    <select
                      className="form-select"
                      value={s.alarm_skab_selected}
                      onChange={(e) => this.setState({ alarm_skab_selected: e.target.value })}
                    >
                    // for each option in s.alarm_skabe, create an option
                    {s.alarm_skabe.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                    </select>
                    <button
                      onClick={() => this.selectPointAlarmskab()}
                      className="btn btn-primary col-auto"
                      disabled={!this.allowAlarmkabel()}
                    >
                      {__("Select point for cabinet")}
                    </button>
                  </div>
                  <div className="form-text mb-3">Vælg alarmskab, og udpeg punkt</div>
                </div>
              
                <div
                  style={{ alignSelf: "center" }}
                  hidden={s.results_alarmskabe.length == 0}
                >
                  <div className='list-group'>
                    {s.results_alarmskabe.map((item, index) => (
                      <div className='list-group-item' key={index}>
                        <div className='d-flex w-100 justify-content-between'>
                          <small>{item.direction}</small>
                          <small>{item.distance}m</small>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              
              </div>
            </div>

          );
        }

        // Not Logged in - or not configured
        return (
          <div role = "tabpanel" >
            <div className = "form-group" >
                <div id = "blueidea-feature-login" className = "alert alert-info" role = "alert" >
                    {__("MissingLogin")}
                </div>
                <div className="d-grid mx-auto">
                    <button onClick = {() => this.clickLogin()} type="button" className="btn btn-primary">{__("Login")}</button>
                </div>
            </div>
        </div>
        );
      }
    };

    utils.createMainTab(
      exId,
      __("Plugin Tooltip"),
      __("Info"),
      require("./../../../browser/modules/height")().max,
      "bi-node-minus",
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

  setCallBack: function (fn) {
    this.callBack = fn;
  },
};
