/**
 * @fileoverview Description of file, its uses and information
 * about its dependencies.
 */

'use strict';



/**
 *
 */
var backboneEvents;

var layerSearch;

/**
 *
 * @returns {*}
 */
module.exports = {
    set: function (o) {
        backboneEvents = o.backboneEvents;
        layerSearch = o.extensions.layerSearch.index;
        return this;
    },
    init: function () {
        $("#layer-search-btn").on("click", function (e) {
            $("#info-modal .modal-title").html("<i class='material-icons'>&#xE8B6;</i>");
            $("#info-modal .modal-body").html('<div id="search-container" style="height: 100%">' +
                '<div id="placfes">' +
                '<input name="layer-search" id="layer-search" type="search" class="form-control" placeholder="Søg efter data">' +
                '</div>' +
                '<div id="layer-search-list" style="height: calc(100% - 38px); overflow: auto"></div>' +
                '</div>');

            $( "#info-modal").animate({
                right: "0"
            }, 200, function() {
                $("input[name=layer-search]").focus();
            });

            $("input[name=layer-search]").on('input', _.debounce(function (e) {
                layerSearch.search(e.target.value)
            }, 300));
        });
    }
};