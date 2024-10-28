/*
 * @author     René Borella <rgb@geopartner.dk>
 * @copyright  2020- Geoparntner A/S
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

"use strict";

import { isNull, isSet } from "lodash";
import MatrikelTable from "./MatrikelTable";
import DAWASearch from "./DAWASearch";

/**
 *
 * @type {*|exports|module.exports}
 */
var cloud;

/**
 *
 * @type {*|exports|module.exports}
 */
var search = require("./../../../browser/modules/search/danish");

/**
 *
 * @type {*|exports|module.exports}
 */
var urlparser = require("./../../../browser/modules/urlparser");

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
 * @type {string}
 */
var exId = "geosag";

/**
 *
 */
var clicktimer;

/**
 *
 */
var mapObj;

var config = require("../../../config/config.js");

// Get URL vars
//if (urlparser.urlVars.user) {
//    var user = urlparser.urlVars.user;
//}
var user = "none";
if (urlparser.urlVars.sagsnr) {
  var sagsnr = urlparser.urlVars.sagsnr;
}

/**
 * Displays a snack!
 * @param {*} msg
 */
var snack = function (msg) {
  utils.showInfoToast("<p>" + msg + "</p>", { timeout: 5000, autohide: false });
};

var matrikelLayer = new L.FeatureGroup();

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
    var parentThis = this;

    /**
     *
     * Native Leaflet object
     */
    mapObj = cloud.get().map;

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
     * @type {{Info: {da_DK: string, en_US: string}, Street View: {da_DK: string, en_US: string}, Choose service: {da_DK: string, en_US: string}, Activate: {da_DK: string, en_US: string}}}
     */
    var dict = {
      Info: {
        da_DK:
          "Fremsøg den relevante matrikel, og tilknyt enten den enkelte matrikel eller ejendommen til sagen.",
        en_US:
          "Find the relevant matrikel, and attach either the individual matrikel or the property to the case.",
      },

      "Plugin Tooltip": {
        da_DK: "Geosag, Matrikeludpegning",
        en_US: "Geosag, Matrikeludpegning",
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

    var itsSomething = function (obj) {
      if (obj === undefined) {
        return false;
      }
      if (isNull(obj)) {
        return false;
      }
      if (isNaN(obj)) {
        return false;
      }

      return true;
    };

    var getExistingMatr = function (sagsnr) {
      // Get Existing parts from Matrikelliste
      return new Promise(function (resolve, reject) {
        let obj = {
          sagsnr: sagsnr,
          user: user,
        };
        let opts = {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify(obj),
        };
        // Do async job and resolve
        fetch("/api/extension/getExistingMatr", opts)
          .then((r) => {
            const data = r.json();
            resolve(data);
          })
          .catch((e) => {
            console.log(e);

            reject(e);
          });
      });
    };

    var saveMatrChanges = function (sagsnr, matrs) {
      // Saves changes to Docunote
      return new Promise(function (resolve, reject) {
        let obj = {
          sagsnr: sagsnr,
          matrs: matrs,
          user: user,
        };
        let opts = {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify(obj),
        };
        // Do async job and resolve
        fetch("/api/extension/saveMatrChanges", opts)
          .then((r) => {
            const data = r.json();
            resolve(data);
          })
          .catch((e) => {
            console.log(e);
            reject(e);
          });
      });
    };

    var getCase = function (sagsnr) {
      // Get case object for display
      return new Promise(function (resolve, reject) {
        let obj = {
          sagsnr: sagsnr,
          user: user,
        };
        let opts = {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify(obj),
        };
        // Do async job and resolve
        fetch("/api/extension/getCase", opts)
          .then((r) => {
            const data = r.json();
            resolve(data);
          })
          .catch((e) => {
            console.log(e);
            reject(e);
          });
      });
    };

    var getConnectedCases = function (ejerlavkode, matrikelnr) {
      // Get connected cases for display
      return new Promise(function (resolve, reject) {
        let obj = {
          matrikelnr: matrikelnr,
          ejerlavkode: ejerlavkode,
        };
        let opts = {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify(obj),
        };
        // Do async job and resolve
        fetch("/api/extension/getConnectedCases", opts)
          .then((r) => {
            const data = r.json();
            resolve(data);
          })
          .catch((e) => {
            console.log(e);
            reject(e);
          });
      });
    };

    var resolveFeature = function (json) {
      // Resolve feature from getting data

      let d = json;

      if (d.type == "Feature") {
        return d;
      } else if (d.type == "FeatureCollection") {
        // take first
        return d.features[0];
      } else {
        return;
      }
    };

    var getJordstykkeByCoordinate = function (E, N, utm = true) {
      var hostName = "/api/datahub/jordstykker?";

      var params = {
        cache: "no-cache",
      };

      if (utm) {
        params.x = E;
        params.y = N;
        params.srid = "25832";
      } else {
        params.x = E;
        params.y = N;
        params.srid = "4326";
      }

      return new Promise(function (resolve, reject) {
        fetch(hostName + new URLSearchParams(params))
          .then((r) => r.json())
          .then((d) => {
            resolve(resolveFeature(d));
          })
          .catch((e) => reject(e));
      });
    };

    var getJordstykkeByMatr = function (matr, elavkode) {
      var hostName = "/api/datahub/jordstykker/" + elavkode + "/" + matr + "/?";

      var params = {
        cache: "no-cache",
      };

      return new Promise(function (resolve, reject) {
        fetch(hostName + new URLSearchParams(params))
          .then((r) => r.json())
          .then((d) => {
            resolve(resolveFeature(d));
          })
          .catch((e) => {
            console.log(e);
            reject(e);
          });
      });
    };

    var getJordstykkerByBFE = function (bfenummer) {
      var hostName = "/api/datahub/jordstykker?";

      var params = {
        cache: "no-cache",
        bfenummer: bfenummer,
      };

      return new Promise(function (resolve, reject) {
        fetch(hostName + new URLSearchParams(params))
          .then((r) => r.json())
          .then((d) => {
            resolve(d.features);
          })
          .catch((e) => {
            console.log(e);
            reject(e);
          });
      });
    };

    /**
     *
     */
    class GeoSag extends React.Component {
      constructor(props) {
        super(props);

        this.state = {
          allow: false,
          case: "",
          matrList: [],
          existingMatrList: [],
          error: "",
          saveState: "",
          showForm: false,
        };

        this.deleteMatrikel = this.deleteMatrikel.bind(this);
        this.focusMatrikel = this.focusMatrikel.bind(this);
        this.addMatrikel = this.addMatrikel.bind(this);
        this.findMatrikel = this.findMatrikel.bind(this);
        this.getCustomLayer = this.getCustomLayer.bind(this);
        this.matrikelCoordTransf = this.matrikelCoordTransf.bind(this);
        this.matrikelOnEachFeature = this.matrikelOnEachFeature.bind(this);
        this.matrikelStyle = this.matrikelStyle.bind(this);
        this.zoomToMatrikel = this.zoomToMatrikel.bind(this);
        this.hasChanges = this.hasChanges.bind(this);
      }

      /**
       * Handle activation on mount
       */
      componentDidMount() {
        let me = this;

        // Stop listening to any events, deactivate controls, but
        // keep effects of the module until they are deleted manually or reset:all is emitted
        backboneEvents.get().on("deactivate:all", () => {});

        // Add layer
        // Init empty layer / Check if layer has content already
        // Make sure we can change extension and not loose expensive information.
        cloud.get().map.addLayer(matrikelLayer);
        matrikelLayer.clearLayers();

        // Activates module
        backboneEvents.get().on(`on:${exId}`, () => {
          console.log(`Starting ${exId}`);

          // If neither is set, error out
          //console.log(`user: ${user}`)
          //console.log(`sagsnr: ${sagsnr}`)
          if (sagsnr == undefined) {
            me.setState({
              allow: false,
              error: "Mangler sagsnr.",
            });
          } else {
            me.refreshFromDocunote(sagsnr, user);
          }

          // Click event - info
          mapObj.on("click", function (e) {
            // TODO: Enable only if extension is active?!
            me.findMatrikel(e);
          });

          utils.cursorStyle().crosshair();
        });

        // Deactivates module
        backboneEvents.get().on(`off:${exId} off:all reset:all`, () => {
          console.log(`Stopping ${exId}`);
          me.setState({
            active: false,
          });
          utils.cursorStyle().reset();

          // Remove click handeler
          mapObj.off("click");
        });
      }

      hasChanges() {
        const _self = this;
        let l1 = _self.state.existingMatrList;
        let l2 = _self.state.matrList;

        // set default
        let result = false;

        if (l1.length != l2.length) {
          // Do we even have the same number?
          result = true;
        } else {
          // Compare lists
          l2.forEach((f) => {
            // does this already exist?
            let k = f.key;
            l1.forEach((ex) => {
              //console.log(k)
              //console.log(ex.synchronizeIdentifier)
              if (k != ex.synchronizeIdentifier) {
                result = true;
              }
            });
          });

          l1.forEach((f) => {
            // or the other way around?
            let k = f.synchronizeIdentifier;
            l2.forEach((ex) => {
              if (k != ex.key) {
                result = true;
              }
            });
          });
        }
        //console.log(result)
        return result;
      }

      saveChangesHandler(id) {
        var _self = this;

        _self.setState(
          {
            saveState: "saving",
            error: "",
          },
          () => {
            saveMatrChanges(sagsnr, id)
              .then((r) => {
                _self.setState(
                  {
                    saveState: "done",
                    error: "",
                  },
                  () => {
                    // Clear layer, and reload from DN
                    matrikelLayer.clearLayers();
                    _self.refreshFromDocunote(sagsnr, user);
                  }
                );
              })
              .catch((e) => {
                console.log(e);
                _self.setState({
                  saveState: "error",
                  error: e.toString(),
                });
              });
          }
        );
      }

      refreshFromDocunote(sagsnr, user) {
        var _self = this;
        // Get case
        getCase(sagsnr)
          .then((r) => {
            //console.log(r)
            // Has error?
            if (r == "Unauthorized request") {
              throw "Unauthorized request";
            } else if ("ErrorCode" in r) {
              throw r["Message"];
            } else {
              _self.setState({
                case: r,
              });
              return getExistingMatr(r.caseId);
            }
          })
          .then((r) => {
            //console.log(r)
            _self.setState({
              allow: true,
              error: "",
              existingMatrList: r.matrikler,
            });
            var jobs = [];
            // Add existing
            r.matrikler.forEach(function (obj) {
              // Add to list also
              jobs.push(_self.addMatrikel(obj, true));
            });
            return Promise.all(jobs);
          })
          .then((j) => {
            this.zoomToLayer();
            //console.log(j)
          })
          .catch((e) => {
            console.log(e);
            _self.setState({
              allow: false,
              error: e.toString(),
            });
          });
      }

      deleteMatrikel(id) {
        const _self = this;
        // Remove from Map - we dont want that - keep as cache'ish
        //let layer = _self.getCustomLayer(id.key)
        //cloud.get().map.removeLayer(layer)

        // Remove from state
        _self.setState({
          matrList: _self.state.matrList.filter((el) => el.key != id.key),
          saveState: "",
        });
      }

      focusMatrikel(id) {
        const _self = this;
        // Zoom to geom, change style, show info box
        _self.zoomToMatrikel(id.key);
        _self.triggerMatrikel(id.key);
      }

      zoomToMatrikel(key, maxZoom = 17, padding = 50) {
        const _self = this;
        var layer = _self.getCustomLayer(key);
        var currentZoom = cloud.get().getZoom();

        try {
          // If we're already zoomed in, keep that zoom - but center
          if (currentZoom > maxZoom) {
            cloud.get().map.fitBounds(layer.getBounds(), {
              padding: [padding, padding],
              maxZoom: currentZoom,
            });
          } else {
            cloud.get().map.fitBounds(layer.getBounds(), {
              padding: [padding, padding],
              maxZoom: maxZoom,
            });
          }
        } catch (err) {
          console.log(err);
          // if we fail to set extents, just go home.
          this.goToHome();
        }
      }

      zoomToLayer() {
        const _self = this;

        try {
          cloud.get().map.fitBounds(matrikelLayer.getBounds());
        } catch (err) {
          console.log(err);
          // if we fail to set extents, just go home.
          this.goToHome();
        }
      }

      goToHome() {
        cloud.get().map.panTo(new L.LatLng(56.0751, 8.7561), 7);
      }

      triggerMatrikel(key, event = "click") {
        const _self = this;
        var layer = _self.getCustomLayer(key);
        // Trigger click event on matrikel
        layer.getLayers()[0].openPopup();
      }

      getCustomLayer(key) {
        var l;
        var match = matrikelLayer.eachLayer(function (layer) {
          if (layer.id == key) {
            l = layer;
          }
        });
        return l;
      }

      alreadyInActive(key) {
        const _self = this;
        return _self.state.matrList.find((m) => m["key"] === key);
      }

      resolveMatrikel(id) {
        return new Promise(function (resolve, reject) {
          //console.log(id);
          if (id.hasOwnProperty("synchronizeIdentifier")) {
            // From docunote or DAWA

            // if customdata does not have matrnrcustom and ejerlavskode, we need to get it from the synchronizeIdentifier and firstname
            let matr = "";
            let elav = "";

            if (
              !isSet(id.customData.matrnrcustom) &&
              !isSet(id.customData.ejerlavskode)
            ) {
              // remove firstname from the end of the synchronizeIdentifier, using the number of characters
              elav = id.synchronizeIdentifier.slice(0, -id.firstName.length);
              matr = id.firstName;
            } else {
              matr = id.customData.matrnrcustom;
              elav = id.customData.ejerlavskode;
            }

            getJordstykkeByMatr(matr, elav)
              .then((r) => {
                resolve(r);
              })
              .catch((e) => {
                reject(e);
              });
          } else if (id.hasOwnProperty("latlng")) {
            // Event from click
            getJordstykkeByCoordinate(id.latlng.lng, id.latlng.lat, false)
              .then((r) => {
                resolve(r);
              })
              .catch((e) => {
                reject(e);
              });
          } else if (id.hasOwnProperty("adresse")) {
            // Event from adresse-search
            getJordstykkeByCoordinate(id.adresse.x, id.adresse.y, true)
              .then((r) => {
                resolve(r);
              })
              .catch((e) => {
                reject(e);
              });
          } else if (
            id.hasOwnProperty("tekst") &&
            id.hasOwnProperty("jordstykke")
          ) {
            // Event from search search
            getJordstykkeByMatr(
              id.jordstykke.matrikelnr,
              id.jordstykke.ejerlav.kode.toString()
            )
              .then((r) => {
                resolve(r);
              })
              .catch((e) => {
                reject(e);
              });
          } else if (
            id.hasOwnProperty("matrikelnr") &&
            id.hasOwnProperty("ejerlav")
          ) {
            // Event add matrikel
            getJordstykkeByMatr(id.matrikelnr, id.ejerlav.toString())
              .then((r) => {
                resolve(r);
              })
              .catch((e) => {
                reject(e);
              });
          } else if (
            id.hasOwnProperty("type") &&
            id.hasOwnProperty("geometry") &&
            id.hasOwnProperty("properties")
          ) {
            // Event add from bfe
            resolve(id);
          } else {
            console.log("Unknown id");
          }
        });
      }

      addMatrikel(id, addToList = false) {
        const _self = this;
        // Add matrikel to map

        console.log(id);

        // We don't have information, get it
        return new Promise(function (resolve, reject) {
          _self
            .resolveMatrikel(id)
            .then((feat) => {
              console.log(feat);
              feat.properties.key =
                feat.properties.ejerlavkode + feat.properties.matrikelnr;
              feat.properties.hasGeometry = feat.hasOwnProperty("geometry");

              //console.log(feat);
              if (addToList) {
                _self.addMatrikelToList(feat.properties);
              }
              // If feat has no geometry, make sure list knows it!
              if (!("geometry" in feat)) {
                let k = feat.properties.key;
                _self.setState((prevState) => ({
                  matrList: prevState.matrList.map((el) =>
                    el.key === k ? { ...el, hasGeometry: false } : el
                  ),
                }));
              } else {
                return _self.addMatrikelToMap(feat);
              }
            })
            .then((layer) => {
              resolve(layer);
            })
            .catch((e) => {
              console.log(e);
              reject(e);
            });
        });
      }

      findMatrikel(id) {
        const _self = this;
        _self
          .addMatrikel(id, false)
          .then((r) => {
            _self.focusMatrikel({ key: r.id });
          })
          .catch((e) => {
            console.log(e);
          });
      }

      addMatrikelToMap(feat) {
        const _self = this;
        return new Promise(function (resolve, reject) {
          // check if exists already
          var evaluate = _self.getCustomLayer(feat.properties.key);
          if (evaluate) {
            // Already present, return the layer
            resolve(_self.getCustomLayer(feat.properties.key));
          } else {
            var js = new L.GeoJSON(feat, {
              style: _self.matrikelStyle,
              onEachFeature: _self.matrikelOnEachFeature,
              coordsToLatLng: _self.matrikelCoordTransf,
            });
            js.id = feat.properties.key;
            js.addTo(matrikelLayer);
            resolve(js);
          }
        });
      }

      addMatrikelToList(id) {
        const _self = this;
        if (!_self.alreadyInActive(id.key)) {
          // If not already in state, then put it there
          let prev = _self.state.matrList;
          prev.push(id);
          _self.setState({
            matrList: prev,
            saveState: "",
          });
        } else {
          // Let user know it's already in list!
          // TODO: only show this once
          //console.log(id)
          let x = id;
          let msg = `${x.matrikelnr}, ${x.ejerlavsnavn} er allerede valgt.`;
          snack(msg);
        }
      }

      // Map style
      matrikelStyle(feature) {
        const _self = this;

        let basic = {
          fillColor: "#009688",
          weight: 2,
          color: "#009688",
          dashArray: 3,
        };

        // If matrikel is in active list, show it
        if (_self.alreadyInActive(feature.properties.key)) {
          // In list
          basic.fillOpacity = 0.5;
          basic.opacity = 1;
        } else {
          // In "memory"
          basic.fillOpacity = 0;
          basic.opacity = 0.5;
          basic.color = "#009688";
        }
        return basic;
      }

      matrikelHighlightStyle = {
        fillColor: "#009688",
        weight: 2,
        opacity: 1,
        fillOpacity: 0.75,
        color: "#009688",
        dashArray: 3,
        fillOpacity: 3,
      };

      matrikelOnEachFeature(feature, layer) {
        const _self = this;
        var p = feature.properties;

        // Construct popup content
        var closeAndRedraw = () => {
          layer.closePopup();
          //layer.setStyle(_self.matrikelHighlightStyle);
          //matrikelLayer.setStyle(_self.matrikelStyle);
        };

        var container = $("<div />");
        container.on("click", ".addMatrikel", function () {
          closeAndRedraw();
          _self.addMatrikel(
            { matrikelnr: p.matrikelnr, ejerlav: p.ejerlavkode },
            true
          );
        });
        container.on("click", ".addEjendom", function () {
          closeAndRedraw();
          _self.addEjendom(p.bfenummer);
        });
        container.on("click", ".deleteMatrikel", function () {
          closeAndRedraw();
          _self.deleteMatrikel({ key: p.key });
        });
        container.on("click", ".deleteEjendom", function () {
          closeAndRedraw();
          _self.deleteEjendom(p.bfenummer);
        });

        //console.log(p);

        container.html(`
                        <h5>${p.matrikelnr}</h5>
                        <h6>${p.ejerlavsnavn} (${p.ejerlavkode})</h6>
                        <p>
                        <b>Kommune: </b>${p.kommunenavn} (${p.kommunekode})</br>
                        <b>BFE: </b>${p.bfenummer}</br>
                        </p>
                        `);

        container.append(`
                            <p>
                            <b>Tilføj: </b><a href="javascript:void(0)"class="addMatrikel" alt="Tilføj matrikel">matrikel</a> / <a href="javascript:void(0)" class="addEjendom" alt="Tilføj ejendom">ejendom</a></br>
                            <b>Fjern: </b><a href="javascript:void(0)" class="deleteMatrikel" alt="Fjern matrikel">matrikel</a> / <a href="javascript:void(0)" class="deleteEjendom" alt="Fjern ejendom">ejendom</a></br>
                            </p>
                        `);

        // Add information on other cases

        getConnectedCases(p.ejerlavkode, p.matrikelnr).then((r) => {
          if (r.length > 0) {
            try {
              container.append(`<p><b>Relaterede sager:</b></p>`);

              container.append(`<p>`);
              r.forEach((c) => {
                let icon = "";
                if (c.status == "3") {
                  //
                  icon = '<i style="color: grey;" class="fas fa-folder"></i>'; // lukket
                } else if (c.status == "2") {
                  icon = '<i style="color: purple;" class="fas fa-folder"></i>'; // ?
                } else {
                  icon = '<i style="color: green;" class="fas fa-folder"></i>'; // aktiv
                }

                let created = c.created.split("T")[0];

                container.append(
                  `<div title="${c.title} \r\n\r\n ${c.description}">${icon} <a href="docunote:/casenumber=${c.number}">${c.number} (${created})</a></div>`
                );
              });
              container.append(`</p>`);
            } catch (error) {
              console.log(error);
            }
          } else {
            container.append(`<p><b>Ingen relaterede sager</b></p>`);
          }
        });

        // Add popup
        var popup = L.popup({ Width: 350 }).setContent(container[0]);
        layer.bindPopup(popup);

        // Set Highlight
        layer.on({
          mouseover: () => {
            layer.setStyle(_self.matrikelHighlightStyle);
          },
          mouseout: () => {
            matrikelLayer.setStyle(_self.matrikelStyle);
          },
          popupopen: () => {
            layer.setStyle(_self.matrikelHighlightStyle);
          },
          popupclose: () => {
            matrikelLayer.setStyle(_self.matrikelStyle);
          },
        });
      }

      addEjendom(bfe) {
        const _self = this;
        getJordstykkerByBFE(bfe)
          .then((r) => {
            let jobs = [];
            r.forEach((matr) => {
              jobs.push(_self.addMatrikel(matr, true));
            });
            return jobs;
          })
          .then((l) => {
            //console.log(l)
          })
          .catch((e) => {
            console.log(e);
          });
      }
      deleteEjendom(bfe) {
        const _self = this;
        getJordstykkerByBFE(bfe)
          .then((r) => {
            r.forEach((matr) => {
              let k = matr.properties.ejerlavkode + matr.properties.matrikelnr;
              _self.deleteMatrikel({ key: k });
            });
          })
          .catch((e) => {
            console.log(e);
          });
      }

      matrikelCoordTransf(coords) {
        const _self = this;

        if (coords.length == 3) {
          return new L.LatLng(coords[1], coords[0], coords[2]);
        } else {
          return new L.LatLng(coords[1], coords[0]);
        }
      }

      /**
       * Renders component
       */
      render() {
        const _self = this;
        const s = _self.state;
        //console.log(s)

        const error = {
          color: "white",
          padding: "2%",
          position: "relative",
          display: "block",
          textAlign: "center",
          fontSize: "2rem",
          margin: "1rem",
          backgroundColor: "#eda72d",
        };
        const tooltipStyle = {
          fontSize: "1rem",
        };

        var saveButton = () => {
          switch (s.saveState) {
            case "saving":
              return (
                <div title="Gemmer på sagen" style={tooltipStyle}>
                  <div className="progress">
                    <div
                      className="progress-bar progress-bar-striped progress-bar-animated"
                      role="progressbar"
                      style={{ width: "100%" }}
                    ></div>
                  </div>
                </div>
              );
            case "done":
              return (
                <span title="Alt OK" style={tooltipStyle}>
                  <i
                    className="bi bi-check-circle"
                    style={{ color: "green" }}
                  ></i>
                </span>
              );
            default:
              return (
                <button
                  className="btn btn-primary"
                  title="Gem ændringer"
                  style={tooltipStyle}
                  onClick={() => _self.saveChangesHandler(s.matrList)}
                >
                  <i className="bi bi-save"></i>
                </button>
              );
          }
        };

        if (s.allow) {
          return (
            <div role="tabpanel">
              <div className="form-group">
                {s.error.length > 0 && <div style={error}>{s.error}</div>}
                <h4>
                  Journalnummer: {s.case.number}{" "}
                  {_self.hasChanges() && saveButton()}
                </h4>
                <p>{s.case.title}</p>
                <div>
                  <div>
                    <DAWASearch
                      _handleResult={_self.findMatrikel}
                      nocache={true}
                    />
                  </div>
                </div>
                <MatrikelTable
                  matrListe={s.matrList}
                  shorterLength={40}
                  _handleDelete={_self.deleteMatrikel}
                  _handleFocus={_self.focusMatrikel}
                />
              </div>
            </div>
          );
        } else {
          return (
            <div role="tabpanel">
              <div className="form-group">
                {s.error.length > 0 ? (
                  <div style={error}>{s.error}</div>
                ) : (
                  "Indlæser..."
                )}
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
      "bi-tags",
      false,
      exId
    );
    // Append to DOM
    //==============
    try {
      ReactDOM.render(<GeoSag />, document.getElementById(exId));
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
