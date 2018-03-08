/**
 * @fileoverview Description of file, its uses and information
 * about its dependencies.
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
    urlVars: uriJs.parseQuery(queryStr),
    uriJs: uriJs
};