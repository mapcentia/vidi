/*
 * @author     Martin Høgh <mh@mapcentia.com>
 * @copyright  2013-2024 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

(function () {

    /**
     * Creates the iFrame in targetDiv DOM element
     * @param targetDiv
     */
    var create = function (targetDiv) {
        (function poll() {
            if (targetDiv.offsetParent !== null) {
                var token = targetDiv.attributes["data-vidi-token"].value;
                var width = targetDiv.getAttribute("data-vidi-width") || "100%";
                var height = targetDiv.getAttribute("data-vidi-height") || "100%";
                var tmpl = targetDiv.getAttribute("data-vidi-tmpl") || "embed.tmpl";
                var useSchema = targetDiv.getAttribute("data-vidi-use-schema") === "true";
                var useConfig = targetDiv.getAttribute("data-vidi-use-config") === "true";
                var noTracking = targetDiv.getAttribute("data-vidi-no-tracking") || "false";
                var configHost = targetDiv.getAttribute("data-vidi-host") || null;
                var frameName = targetDiv.getAttribute("data-vidi-frame-name") || null;

                var search = targetDiv.getAttribute("data-vidi-search") || "";
                var history = targetDiv.getAttribute("data-vidi-history") || "";
                var legend = targetDiv.getAttribute("data-vidi-legend") || "";
                var layer = targetDiv.getAttribute("data-vidi-layer") || "";
                var background = targetDiv.getAttribute("data-vidi-background") || "";
                var fullscreen = targetDiv.getAttribute("data-vidi-fullscreen") || "";
                var about = targetDiv.getAttribute("data-vidi-about") || "";
                var location = targetDiv.getAttribute("data-vidi-location") || "";

                var reset = targetDiv.getAttribute("data-vidi-reset") || "none";
                var measurement = targetDiv.getAttribute("data-vidi-measurement") || "none";
                var clear = targetDiv.getAttribute("data-vidi-clear") || "none";
                var boxzoom = targetDiv.getAttribute("data-vidi-boxzoom") || "none";
                var signin = targetDiv.getAttribute("data-vidi-signin") || "";
                var screenshot = targetDiv.getAttribute("data-vidi-screenshot") || "none";
                var brand = targetDiv.getAttribute("data-vidi-brand") || "";
                var toggler = targetDiv.getAttribute("data-vidi-toggler") || "";
                var schemata = targetDiv.getAttribute("data-vidi-schemata") || "";

                var title = targetDiv.getAttribute("data-vidi-title") || "";
                var session = targetDiv.getAttribute("data-vidi-session") || "";

                try {
                    var obj = JSON.parse(atob(token));
                } catch (e) {
                    alert("Could not parse token");
                }
                var host = (configHost || obj.host) + ""; // Port ?
                // If host is http, then make it protocol relative, so tokens created on http still works when embedded on https sites.
                // host = host.replace("http:", "");
                var id = obj.id;
                var database = obj.database;
                var schema = obj.schema !== undefined && useSchema ? obj.schema + "/" : "";
                var config = obj.config !== undefined && useConfig ? obj.config : "";
                var src = host + "/app/" + database + "/" + schema + "?config=" + config + "&state=" + id + "&tmpl=" + tmpl +
                    "&sea=" + search +
                    "&his=" + history +
                    "&leg=" + legend +
                    "&lay=" + layer +
                    "&bac=" + background +
                    "&ful=" + fullscreen +
                    "&abo=" + about +
                    "&loc=" + location +
                    "&res=" + reset +
                    "&mea=" + measurement +
                    "&cle=" + clear +
                    "&box=" + boxzoom +
                    "&sig=" + signin +
                    "&scr=" + screenshot +
                    "&bra=" + brand +
                    "&tog=" + toggler +
                    "&sch=" + schemata +
                    (frameName ? "&readyCallback=" + frameName : "") +
                    "&notracking=" + noTracking +
                    (session ? "&session=" + session : "") +
                    "&dps=1";
                var iframe = document.createElement("iframe");
                iframe.setAttribute("style", "width:" + width + ";height:" + height + ";border: 1px solid rgba(0,0,0,0.1)");
                iframe.setAttribute("allow", "fullscreen;geolocation");
                iframe.setAttribute("src", src);
                iframe.setAttribute("title", title);
                if (frameName) {
                    iframe.setAttribute("name", frameName);
                }
                targetDiv.replaceWith(iframe);
            } else {
                setTimeout(poll, 100);
            }
        }());
    };

    // If script is loaded at bottom of page, when select above elements
    var tokens = document.querySelectorAll('[data-vidi-token]');
    for (var i = 0; i < tokens.length; i++) {
        if (tokens[i].attributes && tokens[i].attributes["data-vidi-token"] && tokens[i].attributes["data-vidi-token"] !== null && tokens[i].attributes["data-vidi-token"].value !== undefined) {
            create(tokens[i]);
        }
    }

    // If script is loaded at top of page, when use MutationObserver to detect arriving elements
    if (typeof (window.MutationObserver) !== "undefined") {
        new MutationObserver(function (mutations) {
            for (var u = 0; u < mutations.length; u++) {
                var mutation = mutations[u];
                for (var i = 0; i < mutation.addedNodes.length; i++) {
                    if (mutation.addedNodes[i].attributes && mutation.addedNodes[i].attributes["data-vidi-token"] && mutation.addedNodes[i].attributes["data-vidi-token"] !== null && mutation.addedNodes[i].attributes["data-vidi-token"].value !== undefined) {
                        create(mutation.addedNodes[i]);
                    }
                }
            }
        }).observe(document, {childList: true, subtree: true});
    } else {
        console.info("Browser doesn't support MutationObsderver. Please upgrade to modern browser.")
    }
}());

/**
 *
 * @type {{switchLayer: Window.embedApi.switchLayer, _noFrame: Window.embedApi._noFrame, switchAllOff: Window.embedApi.switchAllOff}}
 */
window.embedApi = {
    /**
     * Private function
     *
     * @param frame
     * @private
     */
    _noFrame: function (frame) {
        alert("Could not get frame: " + frame)
    },

    /**
     * Holds callback functions for when Vidi is ready.
     * Note, that active layers in a snapshot is loaded after Vidi is ready.
     * Use activeLayersReady() instead.
     */
    vidiReady: {},

    /**
     * Holds callback functions for when active layers are loaded.
     * Active layers are loaded after Vidi is ready.
     */
    activeLayersReady: {},

    /**
     * Holds callback functions for when symbols layers are changed.
     */
    symbolIsChanged: {},

    /**
     * Switch on raster layer
     *
     * @param layerId string Id of layer in the form schema.relation
     * @param state boolean on/off
     * @param frame string The name of the iframe targed
     */
    switchLayer: function (layerId, state, frame) {
        var win = window.frames[frame];
        try {
            win.postMessage({layerId: layerId, state: state, method: "switchLayer"}, "*");
        } catch (e) {
            this._noFrame(frame);
        }
    },

    /**
     * Switch all layers off
     *
     * @param frame string The name of the iframe targed
     */
    switchAllOff: function (frame) {
        var win = window.frames[frame];
        try {
            win.postMessage({method: "switchAllOff"}, "*");
        } catch (e) {
            this._noFrame(frame);
        }
    },

    setSymbol: function (symbol, frame) {
        var win = window.frames[frame];
        try {
            win.postMessage({symbol, method: "setSymbol"}, "*");
        } catch (e) {
            this._noFrame(frame);
        }
    },

    storeSymbol: function (tag, frame) {
        var win = window.frames[frame];
        try {
            win.postMessage({tag, method: "storeSymbol"}, "*");
        } catch (e) {
            this._noFrame(frame);
        }
    },

    setView: function (latLng, z, frame) {
        var win = window.frames[frame];
        try {
            win.postMessage({latLng, z, method: "setView"}, "*");
        } catch (e) {
            this._noFrame(frame);
        }
    },

    setVar: function (name, value, frame) {
        var win = window.frames[frame];
        try {
            win.postMessage({name, value, method: "setVar"}, "*");
        } catch (e) {
            this._noFrame(frame);
        }
    }

};

/**
 * Listeners for callbacks
 */
window.addEventListener("message", (event) => {
    try {
        if (event.data.type === "snapshotLayersCallback" && event.data.method) {
            window.embedApi.activeLayersReady[event.data.method]();
        }
    } catch (e) {
        console.log("No callback function for snapshotLayersCallback");
    }
    try {
        if (event.data.type === "vidiCallback" && event.data.method) {
            window.embedApi.vidiReady[event.data.method]();
        }
    } catch (e) {
        console.log("No callback function for vidiCallback");
    }
    try {
        if (event.data.type === "symbolIsChanged") {
            window.embedApi.symbolIsChanged[event.data.method]();
        }
    } catch (e) {
        console.log("No callback function for vidiCallback");
    }
});
