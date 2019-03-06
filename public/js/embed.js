/*
 * @author     Martin Høgh <mh@mapcentia.com>
 * @copyright  2013-2019 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

(function () {

    /**
     * Creates the iFrame in targetDiv DOM element
     * @param targetDiv
     */
    var create = function (targetDiv) {
        var token = targetDiv.attributes["data-vidi-token"].value;
        var width = targetDiv.getAttribute("data-vidi-width") || "500px";
        var height = targetDiv.getAttribute("data-vidi-height") || "500px";
        var tmpl = targetDiv.getAttribute("data-vidi-tmpl") || "embed.tmpl";
        try {
            var obj = JSON.parse(atob(token));
        } catch (e) {
            alert("Could not parse token");
        }
        var host = obj.host + ""; // Port ?
        var id = obj.id;
        var database = obj.database;
        var iframe = document.createElement("iframe");
        iframe.setAttribute("style", "width:" + width + ";height:" + height + ";border: 1px solid rgba(0,0,0,0.1)");
        iframe.setAttribute("allowfullscreen", "");
        iframe.setAttribute("src", host + "/app/" + database + "/?state=" + id + "&tmpl=" + tmpl);
        targetDiv.append(iframe);
    };
    // If script is loaded at bottom of page, when select above elements
    document.querySelectorAll('[data-vidi-token]').forEach(function (object) {
        if (object.attributes && object.attributes["data-vidi-token"] && object.attributes["data-vidi-token"] !== null && object.attributes["data-vidi-token"].value !== undefined) {
            create(object);
        }
    });
    // If script is loaded at top of page, when use MutationObserver to detect arriving elements
    new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            mutation.addedNodes.forEach(function (object) {
                if (object.attributes && object.attributes["data-vidi-token"] && object.attributes["data-vidi-token"] !== null && object.attributes["data-vidi-token"].value !== undefined) {
                    create(object);
                }

            });
        });
    }).observe(document, {childList: true, subtree: true});
}());