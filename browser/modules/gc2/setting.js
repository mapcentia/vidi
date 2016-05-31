var urlparser = require('../urlparser');
var db = urlparser.db;
var schema = urlparser.schema;
var ready = false;
module.exports = {
    set: function () {
    },
    init: function () {
        $.ajax({
            url: '/api/setting/' + db,
            scriptCharset: "utf-8",
            success: function (response) {
                if (typeof response.data.extents === "object") {
                    var firstSchema = schema.split(",").length > 1 ? schema.split(",")[0] : schema
                    if (typeof response.data.extents[firstSchema] === "object") {
                        extent = response.data.extents[firstSchema];
                    }
                }
                ready = true;
            }
        }); // Ajax call end
    },
    ready: function(){
        return ready;
    }
};