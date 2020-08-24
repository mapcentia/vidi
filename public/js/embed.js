/*
 * @author     Martin Høgh <mh@mapcentia.com>
 * @copyright  2013-2020 MapCentia ApS
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
                var search = targetDiv.getAttribute("data-vidi-search") || "";
                var history = targetDiv.getAttribute("data-vidi-history") || "";
                var useSchema = targetDiv.getAttribute("data-vidi-use-schema") === "true";
                var useConfig = targetDiv.getAttribute("data-vidi-use-config") === "true";
                try {
                    var obj = JSON.parse(atob(token));
                } catch (e) {
                    alert("Could not parse token");
                }
                var host = obj.host + ""; // Port ?
                var id = obj.id;
                var database = obj.database;
                var schema = obj.schema !== undefined && useSchema ? obj.schema + "/" : "";
                var config = obj.config !== undefined && useConfig ? obj.config : "";
                var src = host + "/app/" + database + "/" + schema + "?config=" + config + "&state=" + id + "&tmpl=" + tmpl + "&s=" + search + "&his=" + history;
                var iframe = document.createElement("iframe");
                iframe.setAttribute("style", "width:" + width + ";height:" + height + ";border: 1px solid rgba(0,0,0,0.1)");
                iframe.setAttribute("allowfullscreen", "");
                iframe.setAttribute("src", src);
                targetDiv.appendChild(iframe);
            } else {
                setTimeout(poll, 100);
            }
        }());
    };

    // If script is loaded at bottom of page, when select above elements
    var tokens = document.querySelectorAll('[data-vidi-token]');
    for(var i = 0; i < tokens.length; i++){
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