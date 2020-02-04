/*
 * @author     Martin Høgh <mh@mapcentia.com>
 * @copyright  2013-2020 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
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
        var table = $("#report table"), tr, td, dataTable, dataThead, dataTr, u, m, without = [], groups = [];
        //$("#conflict-data-time").html(e.dateTime);
        $("#conflict-text").html(e.text);

        $.each(e.hits, function (i, v) {
            v.meta.layergroup = v.meta.layergroup != null ? v.meta.layergroup : "Ungrouped";
            groups.push(v.meta.layergroup);
        });

        groups = array_unique(groups.reverse());

        for (let x = 0; x < groups.length; ++x) {
            $.each(e.hits, function (i, v) {
                let metaData = v.meta;
                if (metaData.layergroup === groups[x]) {
                    let flag = false;
                    let arr = [];
                    if (v.hits > 0) {
                        tr = $("<tr style='border-top: 1px solid;'><td style='padding-bottom: 40px'><h4>" + (v.title || i) + " (" + v.hits + ")</h4></td></tr>");
                        table.append(tr);
                        if (v.data.length > 0) {
                            dataTable = $("<table class='table table-conflict'></table>");

                            if (v.data[0].length > 2) {
                                dataThead = $("<thead></thead>");
                                dataTr = $("<tr></tr>");
                                dataThead.append(dataTr);
                                dataTable.append(dataThead);
                                for (u = 0; u < v.data[0].length; u++) {
                                    if (!v.data[0][u].key) {
                                        dataTr.append("<th>" + v.data[0][u].alias + "</th>");
                                    }
                                }
                            }

                            for (u = 0; u < v.data.length; u++) {
                                dataTr = $("<tr></tr>");
                                if (v.data[u].length > 2) {
                                    flag = false;
                                    for (m = 0; m < v.data[u].length; m++) {
                                        if (!v.data[u][m].key) {
                                            if (!v.data[u][m].link) {
                                                dataTr.append("<td>" + v.data[u][m].value + "</td>");
                                            } else {
                                                dataTr.append("<td>" + "<a target='_blank' rel='noopener' href='" + (v.data[u][m].linkprefix ? v.data[u][m].linkprefix : "") + v.data[u][m].value + "'>Link</a>" + "</td>");
                                            }
                                        }
                                    }
                                } else {

                                    flag = true;
                                    for (m = 0; m < v.data[u].length; m++) {
                                        if (!v.data[u][m].key) {
                                            if (!v.data[u][m].link) {
                                                arr.push(v.data[u][m].value);
                                            } else {
                                                arr.push("<a target='_blank' rel='noopener' href='" + (v.data[u][m].linkprefix ? v.data[u][m].linkprefix : "") + v.data[u][m].value + "'>Link</a>");
                                            }
                                        }
                                    }

                                }
                                dataTable.append(dataTr);
                            }
                            if (flag) {
                                console.log(arr);
                                dataTr.append("<td>" + arr.join(", ") + "</td>");
                            }

                            $('td', tr).append(dataTable);
                        } else {
                            $('td', tr).append("<td><i style='padding-bottom: 40px'>Ingen felter vises</i></td>");

                        }
                    }
                }
            });
        }



        $.each(e.hits, function (i, v) {
            if (v.hits === 0) {
                without.push((v.title || i));
            }
        });
        if (without.length > 0) {
            $("#report #without").append("<caption style='white-space: nowrap;'>Unden konflikter</caption>");
            $("#report #without").append("<div>" + without.join(" | ") + "</div>");
        }
    }
}
