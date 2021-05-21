/*
 * @author     Martin Høgh <mh@mapcentia.com>
 * @copyright  2013-2021 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

'use strict';

/**
 *
 * @returns {*}
 */
module.exports = {
    set: function () {
        return this;
    },
    init: function () {
    },
    render: function (e) {
        let table = $("#report table"), tr, dataTable, without = [], groups = [];
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
                            dataTable = $("<table class='table table-data'></table>");
                            $.each(v.data, function (u, row) {
                                let key = null, fid = null;
                                let tr = $("<tr style='border-top: 0 solid #eee'/>");
                                let td = $("<td/>");
                                let table2 = $("<table style='margin-bottom: 5px; margin-top: 5px;' class='table'/>");
                                row.sort((a, b) => (a.sort_id > b.sort_id) ? 1 : ((b.sort_id > a.sort_id) ? -1 : 0));
                                $.each(row, function (n, field) {
                                    if (!field.key) {
                                        if (!field.link) {
                                            table2.append("<tr><td style='max-width: 150px' class='conflict-heading-cell' '>" + field.alias + "</td><td class='conflict-value-cell'>" + (field.value !== null ? field.value : "&nbsp;") + "</td></tr>");
                                        } else {
                                            let link = "&nbsp;";
                                            if (field.value && field !== "") {
                                                link = "<a target='_blank' rel='noopener' href='" + (field.linkprefix ? field.linkprefix : "") + field.value + "'>Link</a>"
                                            }
                                            table2.append("<tr><td style='max-width: 150px' class='conflict-heading-cell'>" + field.alias + "</td><td class='conflict-value-cell'>" + link + "</td></tr>")
                                        }
                                    } else {
                                        key = field.name;
                                        fid = field.value;
                                    }
                                });
                                td.append(table2);
                                tr.append(td);
                                dataTable.append(tr);
                                dataTable.append("<hr style='margin: 0'/>");
                            });
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
            let e = $("#report #without");
            e.append("<caption style='white-space: nowrap;'>Lag uden forekomster i denne søgning</caption>");
            e.append("<div>" + without.join(" | ") + "</div>");
        }
    }
};
