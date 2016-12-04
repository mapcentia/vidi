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
        console.log(e);
        var table = $("#report table"), tr, td, dataTable, dataThead, dataTr, u, m, without = [];
        $("#conflict-data-time").html(e.dateTime);
        $("#conflict-text").html(e.text);
        $.each(e.hits, function (i, v) {
            if (v.hits > 0) {
                tr = $("<tr><td>" + (v.title || i) + " (" + v.hits + ")</td></tr>");
                table.append(tr);
                if (v.data.length > 0) {
                    dataTable = $("<table class='table table-bordered'></table>");
                    dataThead = $("<thead></thead>");
                    dataTr = $("<tr></tr>");
                    dataThead.append(dataTr);
                    dataTable.append(dataThead);
                    for (u = 0; u < v.data[0].length; u++) {
                        if (!v.data[0][u].key) {
                            dataTr.append("<th>" + v.data[0][u].alias + "</th>");
                        }
                    }
                    for (u = 0; u < v.data.length; u++) {
                        dataTr = $("<tr></tr>");
                        for (m = 0; m < v.data[u].length; m++) {
                            if (!v.data[u][m].key) {
                                dataTr.append("<td>" + v.data[u][m].value + "</td>");
                            }
                        }
                        dataTable.append(dataTr);
                    }
                    $('td', tr).append(dataTable);
                }
            }
        });
        $.each(e.hits, function (i, v) {
            if (v.hits === 0) {
                without.push((v.title || i));
            }
        });
        if (without.length > 0) {
            $("#report #without").append("<caption style='white-space: nowrap;'>Unden konflikter</caption>");
            $("#report #without").append("<div>" + without.join(" | ") +  "</div>");
        }
    }
};