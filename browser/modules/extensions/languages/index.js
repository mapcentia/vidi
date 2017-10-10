/**
 * @fileoverview Description of file, its uses and information
 * about its dependencies.
 */

'use strict';

/**
 *
 * @type {*|exports|module.exports}
 */
var languages = require("../../../../config/config.js").extensionConfig.languages;


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
        var ul;
        utils.createNavItem(exId, true);

        $('<a href="" data-target="#" class="dropdown-toggle" data-toggle="dropdown">' + __("Languages") + '<b class="caret"></b></a>').appendTo('#' + exId);

        ul = $('<ul class="dropdown-menu"></ul>').appendTo('#' + exId);

        $.each(languages, function (i, v) {
            ul.append('<li><a data-gc2-language="' + i + '" href="javascript:void(0)">' + v.txt + '</a></li>');
        });

        $("[data-gc2-language]").on("click", function (e) {
            var locale = $(this).data('gc2-language'),
                url = anchor.getUri(languages[locale].schema) + "?" + anchor.getParam() +  "&locale=" + locale + anchor.getAnchor();
            location.href = url;
        });
    }
};

