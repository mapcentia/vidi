var cloud;
var baseLayer;
var meta;
var setting;
var state;
var anchor;
var infoClick;
var search;
var bindEvent;
var draw;
var print;
var advancedInfo;
var extensions;
module.exports = {
    set: function (o) {
        cloud = o.cloud;
        baseLayer = o.baseLayer;
        meta = o.meta;
        setting = o.setting;
        state = o.state;
        anchor = o.anchor;
        infoClick = o.infoClick;
        search = o.search;
        bindEvent = o.bindEvent;
        draw = o.draw;
        print = o.print;
        advancedInfo = o.advancedInfo;
        extensions = o.extensions;
        return this;
    },
    init: function () {
        meta.init();
        baseLayer.init();
        setting.init();
        state.init();
        infoClick.init();
        search.init();
        draw.init();
        bindEvent.init();
        advancedInfo.init();
        print.init();

        var moveEndCallBack = function () {
            history.pushState(null, null, anchor.init());

        };
        cloud.on("dragend", moveEndCallBack);
        cloud.on("moveend", moveEndCallBack);
        $.material.init();
        if ($(document).width() > 767 ) {
            setTimeout(
                function () {
                    $(".navbar-toggle").trigger("click");
                }, 500
            )
        }
    }
};