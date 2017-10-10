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
var utils;

/**
 *
 * @type {*|exports|module.exports}
 */
var backboneEvents;

/**
 *
 */
var anchor;


/**
 *
 * @type {string}
 */
var exId = "languages";

/**
 *
 */
var clicktimer;

/**
 *
 */
var mapObj;


/**
 *
 * @type {{set: module.exports.set, init: module.exports.init}}
 */

module.exports = {

    /**
     *
     * @param o
     * @returns {exports}
     */
    set: function (o) {
        utils = o.utils;
        anchor = o.anchor;
        backboneEvents = o.backboneEvents;
        return this;
    },

    /**
     *
     */
    init: function () {
        utils.createNavItem(exId, true);

        $('<a href="" data-target="#" class="dropdown-toggle" data-toggle="dropdown">' + __("Languages") + '<b class="caret"></b></a>').appendTo('#' + exId);

        $('<ul class="dropdown-menu"><li><a data-gc2-language="da_DK" href="javascript:void(0)">Dansk</a></li><li><a data-gc2-language="gl_GL" href="javascript:void(0)">Grønlandsk</a></li></ul>').appendTo('#' + exId);

        $("[data-gc2-language]").on("click", function (e) {
            var url = anchor.init(), token = url.indexOf("?") === -1 ? "?" : "&";
            location.href = url  + token + "locale=" + $(this).data('gc2-language');
            location.reload();
        });
    }
};

