/*
 * @author     Martin Høgh <mh@mapcentia.com>
 * @copyright  2013-2018 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

/*global $:false */
/*global jQuery:false */
/*global Backbone:false */
/*global jRespond:false */
/*global window:false */
/*global console:false */
/*global _:false */
var gc2table = (function () {
    "use strict";
    var host, js, isLoaded, object, init,
        scriptsLoaded = false,
        scriptSource = (function (scripts) {
            scripts = document.getElementsByTagName('script');
            var script = scripts[scripts.length - 1];
            if (script.getAttribute.length !== undefined) {
                return script.src;
            }
            return script.getAttribute('src', -1);
        }());

    // Try to set host from script if not set already
    if (typeof window.geocloud_host === "undefined") {
        host = (scriptSource.charAt(0) === "/") ? "" : scriptSource.split("/")[0] + "//" + scriptSource.split("/")[2];
    } else {
        host = window.geocloud_host;
    }

    if (typeof $ === "undefined") {
        js = document.createElement("script");
        js.type = "text/javascript";
        js.src = "//ajax.googleapis.com/ajax/libs/jquery/1.10.0/jquery.min.js";
        document.getElementsByTagName("head")[0].appendChild(js);
    }
    (function pollForjQuery() {
        if (typeof jQuery !== "undefined") {
            if (typeof jQuery().typeahead === "undefined") {
                $.getScript(host + "/js/typeahead.js-0.10.5/dist/typeahead.bundle.js");
            }
            if (typeof jQuery().bootstrapTable === "undefined") {
                $.getScript(host + "/js/bootstrap-table/bootstrap-table.js");
            }
            if (typeof _ === "undefined") {
                $.getScript(host + "/js/underscore/underscore-min.js");
            }
            if (typeof jRespond === "undefined") {
                $.getScript(host + "/js/div/jRespond.js");
            }
            (function pollForDependencies() {
                if (typeof jQuery().typeahead !== "undefined" &&
                    typeof jQuery().bootstrapTable !== "undefined" &&
                    typeof jQuery().bootstrapTable.locales !== "undefined" &&
                    typeof _ !== 'undefined' &&
                    typeof jRespond !== "undefined") {
                    if (typeof jQuery().bootstrapTable.locales['da-DK'] === "undefined") {
                        $.getScript(host + "/js/bootstrap-table/bootstrap-table-locale-all.js");
                    }
                    if (typeof jQuery().bootstrapTable.defaults.filterControl === "undefined") {
                        $.getScript(host + "/js/bootstrap-table/extensions/filter-control/bootstrap-table-filter-control.js");
                    }
                    if (typeof jQuery().bootstrapTable.defaults.exportDataType === "undefined") {
                        $.getScript(host + "/js/bootstrap-table/extensions/export/bootstrap-table-export.min.js");
                    }
                    if (typeof jQuery().tableExport === "undefined") {
                        $.getScript(host + "/js/tableExport.jquery.plugin/tableExport.min.js");
                    }
                    if (typeof Backbone === "undefined") {
                        $.getScript("https://cdnjs.cloudflare.com/ajax/libs/backbone.js/1.3.3/backbone-min.js");
                    }
                    (function pollForDependants() {
                        if (typeof jQuery().bootstrapTable.defaults.filterControl !== "undefined" &&
                            typeof jQuery().bootstrapTable.defaults.exportDataType !== "undefined" &&
                            typeof jQuery().tableExport !== "undefined" &&
                            typeof jQuery().bootstrapTable.locales['da-DK'] !== "undefined" &&
                            typeof Backbone !== "undefined") {
                            scriptsLoaded = true;
                        } else {
                            setTimeout(pollForDependants, 10);
                        }
                    }());
                } else {
                    setTimeout(pollForDependencies, 10);
                }
            }());

        } else {
            setTimeout(pollForjQuery, 10);
        }
    }());

    isLoaded = function () {
        return scriptsLoaded;
    };
    object = {};
    init = function (conf) {
        var defaults = {
                el: "#table",
                autoUpdate: false,
                height: 300,
                setSelectedStyle: true,
                openPopUp: false,
                setViewOnSelect: true,
                responsive: true,
                autoPan: false,
                locale: 'en-US',
                callCustomOnload: true,
                ns: "",
                template: null,
                usingCarto: false,
                pkey: "gid",
                checkBox: false,
                assignFeatureEventListenersOnDataLoad: true,
                loadDataIfHidden: false,
                onSelect: function () {
                },
                onMouseOver: function () {
                },
                styleSelected: {
                    weight: 5,
                    color: '#666',
                    dashArray: '',
                    fillOpacity: 0.2
                }
            }, prop,
            uid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        if (conf) {
            for (prop in conf) {
                defaults[prop] = conf[prop];
            }
        }
        var data,
            m = defaults.geocloud2,
            store = defaults.store,
            cm = defaults.cm,
            autoUpdate = defaults.autoUpdate,
            height = defaults.height,
            tableBodyHeight = defaults.tableBodyHeight,
            assignFeatureEventListenersOnDataLoad = defaults.assignFeatureEventListenersOnDataLoad,
            styleSelected = defaults.styleSelected,
            el = defaults.el, click, loadDataInTable, moveEndOff, moveEndOn,
            setSelectedStyle = defaults.setSelectedStyle,
            setViewOnSelect = defaults.setViewOnSelect,
            onSelect = defaults.onSelect,
            onMouseOver = defaults.onMouseOver,
            openPopUp = defaults.openPopUp,
            autoPan = defaults.autoPan,
            responsive = defaults.responsive,
            callCustomOnload = defaults.callCustomOnload,
            locale = defaults.locale,
            ns = defaults.ns,
            template = defaults.template,
            pkey = defaults.pkey,
            checkBox = defaults.checkBox,
            loadDataIfHidden = defaults.loadDataIfHidden,
            usingCartodb = defaults.usingCartodb;

        var customOnLoad = false, destroy, assignEventListeners;

        $(el).parent("div").addClass("gc2map");

        (function poll() {
            if (scriptsLoaded) {
                var originalLayers, filters, filterControls, uncheckedIds = [];
                _.extend(object, Backbone.Events);

                /**
                 * Clearing existing feature selection
                 */
                var clearSelection = function () {
                    $(el + ' tr').removeClass("selected");
                    $.each(store.layer._layers, function (i, v) {

                        if (uncheckedIds.indexOf(v._leaflet_id) === -1) {


                            try {
                                v.closePopup();
                                store.layer.resetStyle(v);
                            } catch (e) {
                                console.log(e);
                            }
                        }
                    });
                };

                object.on("clearSelection_" + uid, function () {
                    clearSelection();
                });

                object.on("selected" + "_" + uid, function (id) {
                    clearSelection();
                    if (id === undefined) return;

                    var row = $('*[data-uniqueid="' + id + '"]');
                    row.addClass("selected");
                    if (setSelectedStyle) {
                        try {
                            m.map._layers[id].setStyle(styleSelected);
                        } catch (e) {
                            console.warn(e.message);
                        }
                    }

                    if (openPopUp) {
                        var str = "<table>", renderedText;
                        $.each(cm, function (i, v) {
                            if (typeof v.showInPopup === "undefined" || (typeof v.showInPopup === "boolean" && v.showInPopup === true)) {
                                str = str + "<tr><td>" + v.header + "</td><td>" + m.map._layers[id].feature.properties[v.dataIndex] + "</td></tr>";
                            }
                        });
                        str = str + "</table>";

                        if (template) {
                            renderedText = Mustache.render(template, m.map._layers[id].feature.properties);
                            if (usingCartodb) {
                                renderedText = $.parseHTML(renderedText)[0].children[1].innerHTML
                            }
                        }

                        m.map._layers[id].bindPopup(renderedText || str, {
                            className: "custom-popup gc2table-custom-popup",
                            autoPan: autoPan,
                            closeButton: true,
                            minWidth: 160
                        }).openPopup();

                        object.trigger("openpopup" + "_" + uid, m.map._layers[id]);
                    }
                });

                click = function (e) {
                    if (uncheckedIds.indexOf(e.target._leaflet_id) === -1) {
                        var row = $('*[data-uniqueid="' + e.target._leaflet_id + '"]');
                        try {
                            $(ns + " .fixed-table-body").animate({
                                scrollTop: $(ns + " .fixed-table-body").scrollTop() + (row.offset().top - $(ns + " .fixed-table-body").offset().top)
                            }, 300);
                        } catch (e) {
                        }
                        object.trigger("selected" + "_" + uid, e.target._leaflet_id);
                    }
                };
                click.byGC2Table = true;

                $(el).append("<thead><tr></tr></thead>");

                if (checkBox) {
                    $(el + ' thead tr').append("<th data-field='" + pkey + "' data-checkbox='true'</th>");
                }

                $.each(cm, function (i, v) {
                    $(el + ' thead tr').append("<th data-filter-control=" + (v.filterControl || "false") + " data-field='" + v.dataIndex + "' data-sortable='" + (v.sortable || "false") + "' data-editable='false' data-formatter='" + (v.formatter || "") + "'>" + v.header + "</th>");
                });

                var filterMap =
                    _.debounce(function () {
                        var visibleRows = [];
                        $.each(store.layer._layers, function (i, v) {
                            m.map.removeLayer(v);
                        });
                        $.each(originalLayers, function (i, v) {
                            m.map.addLayer(v);
                        });
                        filters = {};
                        filterControls = {};
                        $.each(cm, function (i, v) {
                            if (v.filterControl) {
                                filters[v.dataIndex] = $(".bootstrap-table-filter-control-" + v.dataIndex).val();
                                filterControls[v.dataIndex] = v.filterControl;
                            }
                        });
                        $.each($(el + " tbody").children(), function (x, y) {
                            visibleRows.push($(y).attr("data-uniqueid"));
                        });
                        $.each(store.layer._layers, function (i, v) {
                            if (visibleRows.indexOf(v._leaflet_id + "") === -1) {
                                m.map.removeLayer(v);
                            }
                        });
                        bindEvent();
                    }, 500);

                var bindEvent = function (e) {
                    setTimeout(function () {

                        $(el + ' > tbody > tr').on("click", function (e) {
                            var id = $(this).data('uniqueid');
                            if (uncheckedIds.indexOf(id) === -1 || checkBox === false) {
                                object.trigger("selected" + "_" + uid, id);
                                var layer = m.map._layers[id];
                                setTimeout(function () {
                                    if (setViewOnSelect) {
                                        try {
                                            m.map.panTo(layer.getBounds().getCenter());
                                        } catch (e) {
                                            m.map.panTo(layer.getLatLng());
                                        }
                                    }
                                }, 100);
                                onSelect(id, layer);
                            }
                        });

                        $(el + ' > tbody > tr').on("mouseover", function (e) {
                            var id = $(this).data('uniqueid');
                            var layer = m.map._layers[id];
                            if (uncheckedIds.indexOf(id) === -1 && checkBox === true) {
                                store.layer._layers[id].setStyle({
                                    fillColor: "#660000",
                                    fillOpacity: "0.6"
                                });
                                onMouseOver(id, layer);
                            }
                        });

                        $(el + ' > tbody > tr').on("mouseout", function (e) {
                            var id = $(this).data('uniqueid');
                            if (uncheckedIds.indexOf(id) === -1 && checkBox === true) {
                                store.layer.resetStyle(store.layer._layers[id])
                            }
                        });
                    }, 100);
                };
                $(el).bootstrapTable({
                    uniqueId: "_id",
                    height: height,
                    locale: locale,
                    onToggle: bindEvent,
                    onSort: bindEvent,
                    onColumnSwitch: bindEvent,
                    onColumnSearch: filterMap
                });

                $(el).on('check.bs.table uncheck.bs.table', function (e, m) {

                    if (m[pkey] === false) {
                        uncheckedIds.push(parseInt(m._id));
                        store.layer._layers[m._id].setStyle({
                            fillOpacity: 0.0,
                            opacity: 0.2
                        });
                        store.layer._layers[m._id].closePopup()

                    } else {
                        uncheckedIds = uncheckedIds.filter(function (item) {
                            return item !== parseInt(m._id);
                        });
                        store.layer.resetStyle(store.layer._layers[m._id])
                    }
                });

                /**
                 * Destroys events and popups for vector layer features, as
                 * well as restoring the regular store onLoad() method.
                 *
                 * @returns {void}
                 */
                destroy = function () {
                    $.each(store.layer._layers, function (i, v) {
                        v.off('click', click);
                        // Hack for removing irrelevant popups
                        v._events.click.map(function (item, index) {
                            if ('name' in item.fn && item.fn.name === '_openPopup') {
                                v._events.click.splice(index, 1);
                            }
                        });
                    });

                    if (customOnLoad) {
                        store.onLoad = customOnLoad;
                    }
                };

                assignEventListeners = function () {
                    $.each(store.layer._layers, function (i, v) {
                        v.on('click', click);
                    });
                };

                // Define a callback for when the SQL returns
                customOnLoad = store.onLoad;
                store.onLoad = function () {
                    loadDataInTable();
                };

                loadDataInTable = function (doNotCallCustomOnload) {
                    data = [];
                    $.each(store.layer._layers, function (i, v) {
                        v.feature.properties._id = i;
                        $.each(v.feature.properties, function (n, m) {
                            $.each(cm, function (j, k) {
                                if (k.dataIndex === n && ((typeof k.link === "boolean" && k.link === true) || (typeof k.link === "string"))) {
                                    v.feature.properties[n] = "<a target='_blank' rel='noopener' href='" + v.feature.properties[n] + "'>" + (typeof k.link === "string" ? k.link : "Link") + "</a>";
                                }
                            });
                        });
                        data.push(v.feature.properties);

                        if (assignFeatureEventListenersOnDataLoad) {
                            assignEventListeners();
                        }
                    });

                    originalLayers = jQuery.extend(true, {}, store.layer._layers);

                    if ($(el).is(':visible') || loadDataIfHidden) {
                        $(el).bootstrapTable("load", data);
                    }

                    bindEvent();

                    if (callCustomOnload && !doNotCallCustomOnload) {
                        customOnLoad(store);
                    }

                    $(".fixed-table-body").css("overflow", "auto");
                    $(".fixed-table-body").css("max-height", tableBodyHeight + "px");
                    $(".fixed-table-body").css("height", tableBodyHeight + "px");
                };

                var moveEndEvent = function () {
                    store.reset();
                    store.load();
                };

                moveEndOff = function () {
                    m.map.off("moveend", moveEndEvent);
                };

                moveEndOn = function () {
                    m.on("moveend", moveEndEvent);
                };

                if (autoUpdate) {
                    m.on("moveend", moveEndEvent);
                }

                var jRes = jRespond([
                    {
                        label: 'handheld',
                        enter: 0,
                        exit: 400
                    },
                    {
                        label: 'desktop',
                        enter: 401,
                        exit: 100000
                    }
                ]);
                if (responsive) {
                    jRes.addFunc({
                        breakpoint: ['handheld'],
                        enter: function () {
                            $(el).bootstrapTable('toggleView');
                        },
                        exit: function () {
                            $(el).bootstrapTable('toggleView');
                        }
                    });
                    jRes.addFunc({
                        breakpoint: ['desktop'],
                        enter: function () {
                        },
                        exit: function () {
                        }
                    });
                }
            } else {
                setTimeout(poll, 20);
            }
        }());
        return {
            loadDataInTable: loadDataInTable,
            destroy: destroy,
            assignEventListeners: assignEventListeners,
            object: object,
            uid: uid,
            store: store,
            moveEndOff: moveEndOff,
            moveEndOn: moveEndOn
        };
    };
    return {
        init: init,
        isLoaded: isLoaded
    };
}());
