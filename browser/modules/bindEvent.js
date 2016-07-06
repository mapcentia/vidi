var draw;
var advancedInfo;
var cloud;
var print;
module.exports = module.exports = {
    set: function (o) {
        draw = o.draw;
        advancedInfo = o.advancedInfo;
        cloud = o.cloud;
        print = o.print;
        return this;
    },
    init: function (str) {
        $("#draw-btn").on("click", function () {
            // Stop advancedInfo
            if (advancedInfo.getSearchOn()) {
                advancedInfo.control(); // Will toggle the control off
                $("#advanced-info-btn").prop("checked", false);
                $("#buffer").hide();
            }
            draw.control();
        });


        $("#advanced-info-btn").on("click", function () {
            // Stop drawing
            if (draw.getDrawOn()) {
                draw.control(); // Will toggle the control off
                $("#draw-btn").prop("checked", false);
            }
            advancedInfo.control();
        });

        $("#start-print-btn").on("click", function () {
            print.print();
        });

        $("#print-btn").on("click", function () {
            print.activate();
        });

    }
};