var cloud;
var baseLayer;
var meta;
var setting;
var state;
var anchor;
var infoClick;
var search;
var bindEvent;
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
        return this;
    },
    init: function () {
        meta.init();
        baseLayer.init();
        setting.init();
        state.init();
        infoClick.init();
        search.init();
        bindEvent.init();

        var moveEndCallBack = function () {
            try {
                history.pushState(null, null, anchor.init());
            } catch (e) {
            }
        };
        cloud.on("dragend", moveEndCallBack);
        cloud.on("moveend", moveEndCallBack);
        $.material.init()
        $.material.ripples()    }
};