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
        var el = $('*[data-gc2-id="' + name + '"]');

        if (visible) {
            cloud.showLayer(name);
            el.prop('checked', true);
        } else {
            cloud.hideLayer(name);
            el.prop('checked', false);
        }

        var siblings = el.parents(".accordion-body").find("input");

        var c = 0;
        $.each(siblings, function (i, v) {
            if (v.checked) {
                c = c + 1;
            }

        });
        el.parents(".panel").find("span:eq(0)").html(c);

        try {
            history.pushState(null, null, anchor.init());
        } catch (e) {
        }
        if (!doNotLegend) {
            legend.init();

        }
    }
};


