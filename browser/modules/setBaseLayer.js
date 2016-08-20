var cloud;
var anchor;
var pushState;
module.exports = module.exports = {
    set: function (o) {
        cloud = o.cloud;
        anchor = o.anchor;
        pushState = o.pushState;
        return this;
    },
    init: function (str) {
        cloud.setBaseLayer(str);
        pushState.init();
    }
};