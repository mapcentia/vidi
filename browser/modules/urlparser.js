var uri = geocloud.pathName;
module.exports = {
    hostname: geocloud_host,
    hash: decodeURIComponent(geocloud.urlHash),
    db: uri[2],
    schema: uri[3],
    urlVars: geocloud.urlVars
}