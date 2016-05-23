var cloud;
var legend;
var anchor;
module.exports = module.exports = {
    set: function (o) {
        cloud = o.cloud;
        legend = o.legend;
        anchor = o.anchor;
        return this;
    },
    init: function (name, visible, doNotLegend) {
        if (visible) {
            cloud.showLayer(name);
            $('*[data-gc2-id="' + name + '"]').prop('checked', true);
        } else {
            cloud.hideLayer(name);
            $('*[data-gc2-id="' + name + '"]').prop('checked', false);
        }
        try {
            history.pushState(null, null, anchor.init());
        } catch (e) {
        }
        if (!doNotLegend) {
            legend.init();

        }
    }
};


