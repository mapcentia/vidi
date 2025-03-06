/*
 * @author     Martin Høgh <mh@mapcentia.com>
 * @copyright  2013-2025 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

const express = require('express');
const router = express.Router();
const ipaddr = require('ipaddr.js');

router.get('/locale', function(request, response) {
    const ip = ipaddr.process(request.ip).toString();
    let decimalSeparator;
    let lang = request.acceptsLanguages('en', 'en-US', 'da', 'da-DK');
    if (lang) {
        if (lang === "en") {
            lang = "en-US";
            decimalSeparator = "."
        }
        if (lang === "da") {
            lang = "da-DK";
            decimalSeparator = ","
        }
    } else {
        lang = "en-US";
    }
    lang = lang.replace("-","_");
    response.set('Content-Type', 'application/javascript');
    response.send("window.decimalSeparator='" + decimalSeparator + "';  window._vidiIp = '" + ip + "'; var urlVars = (function getUrlVars() {var mapvars = {};var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {mapvars[key] = value;});return mapvars;})(); if (urlVars.locale !== undefined){window._vidiLocale=urlVars.locale.split('#')[0]} else {window._vidiLocale='" + lang + "'}");
});
module.exports = router;
