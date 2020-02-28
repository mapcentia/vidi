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
        var table = $("#report table"), tr, td, dataTable, dataThead, dataTr, u, m, without = [], groups = [];
        $("#conflict-text").html(e.text);

        $.each(e.hits, function (i, v) {
            v.meta.layergroup = v.meta.layergroup != null ? v.meta.layergroup : "Ungrouped";
            groups.push(v.meta.layergroup);
        });

        groups = array_unique(groups.reverse());

        for (let x = 0; x < groups.length; ++x) {
            tr = $("<tr class='print-report-group-heading' style='border-top: 1px solid; '><td style='padding-bottom: 4px;'><h3>" + groups[x] + "</h3></td></tr>");
            table.append(tr);
            let count = 0;
            $.each(e.hits, function (i, v) {
                let metaData = v.meta;
                if (metaData.layergroup === groups[x]) {
                    let flag = false;
                    let columnTitleForSingleField;
                    let arr = [];
                    if (v.hits > 0) {
                        count++;
                        tr = $("<tr style='border-top: 1px solid #eee;'><td style='padding-bottom: 4px'><h4 style='margin-bottom: 4px'>" + (v.title || i) + " (" + v.hits + ")</h4></td></tr>");
                        table.append(tr);

                        let conflictForLayer = metaData.meta !== null ? JSON.parse(metaData.meta) : null;
                        if (conflictForLayer !== null && 'long_conflict_meta_desc' in conflictForLayer && conflictForLayer.long_conflict_meta_desc !== '') {
                            tr = $("<tr><td><div style='background-color: #eee; padding: 3px; margin-bottom: 4px'>" + conflictForLayer.long_conflict_meta_desc + "</div></td></tr>");
                            table.append(tr);
                        }

                        if (v.data.length > 0) {
                            dataTable = $("<table class='table table-conflict'></table>");

                            if (v.data[0].length > 2) {
                                dataThead = $("<thead></thead>");
                                dataTr = $("<tr></tr>");
                                dataThead.append(dataTr);
                                dataTable.append(dataThead);
                                for (u = 0; u < v.data[0].length; u++) {
                                    if (!v.data[0][u].key) {
                                        dataTr.append("<th>" + v.data[0][u].alias  + "</th>");
                                    }
                                }
                            }

                            for (u = 0; u < v.data.length; u++) {
                                dataTr = $("<tr></tr>");
                                if (v.data[u].length > 2) {
                                    flag = false;
                                    for (m = 0; m < v.data[u].length; m++) {
                                        let absorbingCellClass = "";
                                        if (m === v.data[u].length - 1) {
                                            absorbingCellClass = ""
                                            //absorbingCellClass = "style='width: 100%'"
                                        }
                                        if (!v.data[u][m].key) {
                                            if (!v.data[u][m].link) {
                                                dataTr.append("<td " + absorbingCellClass + ">" + (v.data[u][m].value !== null ? v.data[u][m].value : "&nbsp;") + "</td>");
                                            } else {
                                                let link = "&nbsp;";
                                                if (v.data[u][m].value && v.data[u][m].value !== "") {
                                                    link = "<a target='_blank' rel='noopener' href='" + (v.data[u][m].linkprefix ? v.data[u][m].linkprefix : "") + v.data[u][m].value + "'>Link</a>";
                                                }
                                                dataTr.append("<td " + absorbingCellClass + ">" + link + "</td>");
                                            }
                                        }
                                        dataTable.append(dataTr);
                                    }
                                } else {
                                    flag = true;
                                    for (m = 0; m < v.data[u].length; m++) {
                                        columnTitleForSingleField = v.data[u][m].alias;
                                        if (!v.data[u][m].key) {
                                            if (!v.data[u][m].link) {
                                                arr.push(v.data[u][m].value);
                                            } else {
                                                let link = "&nbsp;";
                                                if (v.data[u][m].value && v.data[u][m].value !== "") {
                                                    link = "<a target='_blank' rel='noopener' href='" + (v.data[u][m].linkprefix ? v.data[u][m].linkprefix : "") + v.data[u][m].value + "'>Link</a>";
                                                }
                                                arr.push(link);
                                            }
                                        }
                                    }
                                    dataTable.append(dataTr);
                                }
                            }
                            if (flag) {
                                let separator = "&nbsp;&nbsp;&nbsp;<span style='color: #eee'>|</span>&nbsp;&nbsp;&nbsp;";
                                dataTr.append("<td style='white-space: normal'><span style='font-weight: 400'>" + columnTitleForSingleField + "</span> " + separator + arr.join(separator) + "</td>");
                            }
                            $('td', tr).append(dataTable);
                        } else {
                            $('td', tr).append("<td><i style='padding-bottom: 40px'>Ingen felter vises</i></td>");

                        }
                    }
                }
            });
            // Remove empty groups
            if (count === 0) {
                table.find("tr.print-report-group-heading").last().remove();
            }
        }

        $.each(e.hits, function (i, v) {
            if (v.hits === 0) {
                without.push((v.title || i));
            }
        });
        if (without.length > 0) {
            $("#report #without").append("<caption style='white-space: nowrap;'>Lag uden forekomster i denne søgning</caption>");
            $("#report #without").append("<div>" + without.join(" | ") + "</div>");
        }
    }
};
