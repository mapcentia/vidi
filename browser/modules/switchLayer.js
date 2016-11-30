/**
 * @fileoverview Description of file, its uses and information
 * about its dependencies.
 */

'use strict';

/**
 *
 * @type {*|exports|module.exports}
 */
var cloud;

/**
 *
 * @type {*|exports|module.exports}
 */
var legend;

/**
 *
 * @type {*|exports|module.exports}
 */
var pushState;

/**
 *
 * @type {{set: module.exports.set, init: module.exports.init}}
 */
module.exports = module.exports = {
    set: function (o) {
        cloud = o.cloud;
        legend = o.legend;
        pushState = o.pushState;
        return this;
    },
    /**
     * Toggles a layer on/off. If visible is true, layer is toggled off and vice versa.
     * @param name {string}
     * @param visible {boolean}
     * @param doNotLegend {boolean}
     */
    init: function (name, visible, doNotLegend) {
        var el = $('*[data-gc2-id="' + name + '"]');
        if (visible) {
            try {
                cloud.map.addLayer(cloud.getLayersByName(name));
                el.prop('checked', true);
            } catch (e) {
                //Pass
            }
        } else {
            cloud.map.removeLayer(cloud.getLayersByName(name));
            el.prop('checked', false);
        }
        var siblings = el.parents(".accordion-body").find("input");
        var c = 0;
        $.each(siblings, function (i, v) {
            if (v.checked) {
                c = c + 1;
            }
        });
        el.parents(".panel-layertree").find("span:eq(0)").html(c);
        pushState.init();
        if (!doNotLegend) {
            legend.init();
        }
    }
};


