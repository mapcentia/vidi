var draw;
module.exports = module.exports = {
    set: function (o) {
        draw = o.draw;
        return this;
    },
    init: function (str) {
        $("#draw-btn").on("click", function () {
            draw.init();
        });
    }
};