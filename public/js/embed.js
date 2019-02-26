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
        var id = targetDiv.attributes["data-vidi-snapshot"].value;
        var width = targetDiv.getAttribute("data-vidi-width") || "500px";
        var height = targetDiv.getAttribute("data-vidi-height") || "500px";
        var temp = targetDiv.getAttribute("data-vidi-temp") || "embed.tmpl";
        var host = targetDiv.getAttribute("data-vidi-host");
        var db = targetDiv.getAttribute("data-vidi-db");

        if (!host || !db) {
            alert("No host or db set");
            return false;
        }

        var iframe = document.createElement("iframe");
        iframe.setAttribute("style", "width:" + width + ";height:" + height + ";border: 1px solid rgba(0,0,0,0.1)");
        iframe.setAttribute("allowfullscreen", "");
        iframe.setAttribute("src", host + "/app/" + db + "/?state=" + id + "&tmpl=" + temp);
        targetDiv.append(iframe);
    };

    // If script is loaded at bottom of page, when select above elements
    document.querySelectorAll('[data-vidi-snapshot]').forEach(function (object) {
        if (object.attributes && object.attributes["data-vidi-snapshot"] && object.attributes["data-vidi-snapshot"] !== null && object.attributes["data-vidi-snapshot"].value !== undefined) {
            create(object);
        }

    });

    // If script is loaded at top of page, when use MutationObserver to detect arriving elements
    new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            mutation.addedNodes.forEach(function (object) {

                if (object.attributes && object.attributes["data-vidi-snapshot"] && object.attributes["data-vidi-snapshot"] !== null && object.attributes["data-vidi-snapshot"].value !== undefined) {
                    create(object);
                }

            });
        });
    }).observe(document, {childList: true, subtree: true});
}());


