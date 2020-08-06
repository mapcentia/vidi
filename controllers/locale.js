/*
 * @author     Martin Høgh <mh@mapcentia.com>
 * @copyright  2013-2018 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

var express = require('express');
var router = express.Router();
var ipaddr = require('ipaddr.js');

router.get('/locale', function(request, response) {
    var ip = ipaddr.process(request.ip).toString();
    var lang = request.acceptsLanguages('en', 'en-US', 'da', 'da-DK');
    if (lang) {
        if (lang === "en") {
            lang = "en-US";
        }
        if (lang === "da") {
            lang = "da-DK";
        }
    } else {
        lang = "en-US";
    }
    lang = lang.replace("-","_");
    response.set('Content-Type', 'application/javascript');
    //response.send("window._vidiLocale='" + lang + "'");
    response.send("window._vidiIp = '" + ip + "'; var urlVars = (function getUrlVars() {var mapvars = {};var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {mapvars[key] = value;});return mapvars;})(); if (urlVars.locale !== undefined){window._vidiLocale=urlVars.locale.split('#')[0]} else {window._vidiLocale='" + lang + "'}");
});
module.exports = router;