var express = require('express');
var router = express.Router();

router.get('/locale', function(request, response) {
    var lang = request.acceptsLanguages('en', 'en-US', 'da-DK');
    if (lang) {
        if (lang === "en") {
            lang = "en-US";
        }
    } else {
        lang = "en-US";
    }
    lang = lang.replace("-","_");
    response.set('Content-Type', 'application/javascript');
    response.send("window._vidiLocale='" + lang + "'");
});
module.exports = router;