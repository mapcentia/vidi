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

/**
 *
 * @type {L.FeatureGroup}
 */
var drawnItems = new L.FeatureGroup();

/**
 *
 * @type {L.FeatureGroup}
 */
var bufferItems = new L.FeatureGroup();

/**
 *
 * @type {L.FeatureGroup}
 */

var dataItems = new L.FeatureGroup();

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
        da_DK: "NB: Du skal være logget ind for at kunne bruge funktionen",
        en_US: "Please log in to use this function",
      },
      Login: {
        da_DK: "Log ind",
        en_US: "Log in",
      },
      "Select point on map": {
        da_DK: "Udpeg punkt",
        en_US: "Select point on map",
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
            .then((obj) =>
              me.setState({
                authed: obj.status.authenticated,
              })
            )
            .catch((e) => {
              console.log("Error in session:authChange", e);
              me.setState({
                authed: false,
              });
            })
            .finally(() => {
              // If logged in, show buttons in draw
              if (me.state.authed) {
                $("#_draw_make_blueidea_with_selected").show();
                $("#_draw_make_blueidea_with_all").show();
              } else {
                $("#_draw_make_blueidea_with_selected").hide();
                $("#_draw_make_blueidea_with_all").hide();
              }
            });
        });
      }

      clickLogin() {
        document.getElementById("session").click();
      }

      /**
       * Renders component
       */
      render() {
        const _self = this;
        const s = _self.state;
        //console.log(s)

        // If not logged in, show login button
        if (s.authed) {
          // Logged in
          if (s.loading) {
            // If Loading, show progress
            return (
              <div role="tabpanel">
                <div className="form-group">
                  <div>LOADING</div>
                </div>
              </div>
            );
          } else {
            // Just Browsing
            return (
              <div role="tabpanel">
                <div className="form-group">
                  <div style={{ alignSelf: "center" }}>
                    <Button
                      onClick={() => this.selectPoint()}
                      color="primary"
                      size="large"
                      variant="contained"
                      style={{
                        marginRight: "auto",
                        marginLeft: "auto",
                        display: "block",
                      }}
                    >
                      {__("Select point on map")}
                    </Button>
                  </div>
                </div>
              </div>
            );
          }
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

  queryAddress: function (text, callBack, id = null, fromDrawing = false) {
    console.log(text, callBack, id, fromDrawing);
  },
  setCallBack: function (fn) {
    this.callBack = fn;
  },
};
