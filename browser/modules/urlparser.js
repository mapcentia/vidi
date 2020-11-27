/*
 * @author     Martin Høgh <mh@mapcentia.com>
 * @copyright  2013-2020 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

'use strict';


let url = new URL(window.location.href)
let pathArray = url.pathname.split('/');
let searchParams = new URLSearchParams(url.search);
let urlVars = {};
for (let p of searchParams) {
    urlVars[p[0]] = p[1];
}

let _obj = {
    hostname: url.protocol + "//" + url.hostname + ":" + url.port,
    hash: decodeURIComponent(geocloud.urlHash),
    db: pathArray[2],
    schema: pathArray[3],
    staticRoute: pathArray[4],
    urlVars: urlVars,
    search: url.search
};

module.exports = _obj;
