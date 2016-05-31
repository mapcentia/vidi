var urlparser = require('./urlparser');
var cloud;
var clicktimer;
var meta;
var draw;
var sqlQuery;
var qstore = [];

module.exports = {
    set: function (o) {
        cloud = o.cloud;
        meta = o.meta;
        draw = o.draw;
        sqlQuery = o.sqlQuery;
        return this;
    },
    init: function () {
        cloud.on("dblclick", function () {
            clicktimer = undefined;
        });
        cloud.on("click", function (e) {
            // Do not get info if drawing
            if (draw.getDrawOn()) {
                return;
            }
            var event = new geocloud.clickEvent(e, cloud);


            if (clicktimer) {
                clearTimeout(clicktimer);
            }
            else {
                clicktimer = setTimeout(function (e) {
                    clicktimer = undefined;
                    var coords = event.getCoordinate(), wkt;
                    wkt = "POINT(" + coords.x + " " + coords.y + ")";
                    sqlQuery.init(qstore, wkt, "3857");
                }, 250);
            }
        });
    }
};


