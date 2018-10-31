/*
 * @author     Martin Høgh <mh@mapcentia.com>
 * @copyright  2013-2018 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

'use strict';

var uriJs = require('urijs');

var uriObj = new uriJs(window.location.href);

var queryStr = uriObj.search();

/**
 *
 * @type {{hostname: *, hash: string, db: *, schema: *, urlVars: *}}
 */
module.exports = {
    hostname: geocloud_host,
    hash: decodeURIComponent(geocloud.urlHash),
    db: uriObj.segmentCoded(1),
    schema: uriObj.segmentCoded(2),
    staticRoute: uriObj.segmentCoded(3),
    urlVars: uriJs.parseQuery(queryStr),
    uriJs: uriJs,
    uriObj: uriObj
};