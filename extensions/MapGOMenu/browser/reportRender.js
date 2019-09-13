/**
 * @fileoverview Description of file, its uses and information
 * about its dependencies.
 */

'use strict';

/**
 *
 * @returns {*}
 */
module.exports = {
    set: function (o) {
        return this;
    },
    init: function () {
    },
    render: function (e) {
        console.log("inside reportrender" + e);
        var table = $("#report table");
        $("#mapGo-text").html(e.text);

        // construct innerhtml for div: mapgo-amount-pane
        var html = "";
        
        // make table
        html += "<TABLE class='table table-bordered'>";
        // make table header
        
        html += "<THEAD><TR>";
        for(var key in e.metadata) {
                html += "<TH><B>";
            html += e.metadata[key].name.toUpperCase();
            html += "</B></TH>";
        }
        html += "</TR></THEAD>";

        // make values
        html += "<TBODY>";
        for(var key in e.data) {
            html += "<TR>"
            for(var props in e.data[key].properties) {
                html += "<TD>"
                html += e.data[key].properties[props];
                html += "</TD>"
            }
            html += "</TR>"
        }
        html += "</TBODY>";
        
        html += "</TABLE>";  
        
        table.append(html);      
    }
};