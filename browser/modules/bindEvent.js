var draw;
var advancedInfo;
module.exports = module.exports = {
    set: function (o) {
        draw = o.draw;
        advancedInfo = o.advancedInfo;
        return this;
    },
    init: function (str) {
        $("#draw-btn").on("click", function () {
            // Stop advancedInfo
            if (advancedInfo.getSearchOn()) {
                advancedInfo.control();
            }
            draw.control();
        });

        $("#advanced-info-btn").on("click", function () {
            // Stop drawing
            if (draw.getDrawOn()) {
                draw.control();
            }
            advancedInfo.control();
        });
    }
};