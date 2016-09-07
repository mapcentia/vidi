/**
 * @fileoverview Description of file, its uses and information
 * about its dependencies.
 */

'use strict';

/**
 * @type {string}
 */
var uri = geocloud.pathName;

/**
 *
 * @type {{hostname: *, hash: string, db: *, schema: *, urlVars: *}}
 */
module.exports = {
    hostname: geocloud_host,
    hash: decodeURIComponent(geocloud.urlHash),
    db: uri[2],
    schema: uri[3],
    urlVars: geocloud.urlVars
}