var uri = geocloud.pathName;
module.exports = {
    hostname: geocloud_host,
    hash: decodeURIComponent(geocloud.urlHash),
    db: uri[1],
    schema: uri[2],
    urlVars: geocloud.urlVars
}