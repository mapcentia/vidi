var cloud;
var anchor;
module.exports = module.exports = {
    set: function (o) {
        cloud = o.cloud;
        anchor = o.anchor;
        return this;
    },
    init: function (str) {
        cloud.setBaseLayer(str);
        try {
            history.pushState(null, null, anchor.init());
        } catch (e) {
        }
        //addLegend();
    }
};