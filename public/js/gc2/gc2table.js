/*
 * @author     Martin Høgh <mh@mapcentia.com>
 * @copyright  2013-2020 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

/*global $:false */
/*global jQuery:false */
/*global Backbone:false */
/*global window:false */
/*global console:false */
/*global _:false */
var gc2table = (function () {
    "use strict";
    var isLoaded, object, init;

    isLoaded = function () {
        return true;
    };
    object = {};
    init = function (conf) {
        var defaults = {
                el: "#table",
                autoUpdate: false,
                height: 300,
                tableBodyHeight: null,
                setSelectedStyle: true,
                openPopUp: false,
                onPopupClose: false,
                onPopupCloseButtonClick: false,
                setViewOnSelect: true,
                responsive: true,
                autoPan: false,
                setZoom: false,
                locale: 'en-US',
                callCustomOnload: true,
                ns: "",
                template: null,
                usingCarto: false,
                pkey: "gid",
                checkBox: false,
                assignFeatureEventListenersOnDataLoad: true,
                onSelect: function () {
                },
                onMouseOver: function () {
                },
                styleSelected: {
                    fillOpacity: 0.5,
                    opacity: 0.5
                },
                renderInfoIn: null,
                key: null,
                caller: null,
                dashSelected: false
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
            el = defaults.el, click, loadDataInTable, getUncheckedIds, moveEndOff, moveEndOn,
            setSelectedStyle = defaults.setSelectedStyle,
            setViewOnSelect = defaults.setViewOnSelect,
            onSelect = defaults.onSelect,
            onMouseOver = defaults.onMouseOver,
            openPopUp = defaults.openPopUp,
            onPopupClose = defaults.onPopupClose,
            onPopupCloseButtonClick = defaults.onPopupCloseButtonClick,
            autoPan = defaults.autoPan,
            setZoom = defaults.setZoom,
            responsive = defaults.responsive,
            callCustomOnload = defaults.callCustomOnload,
            locale = defaults.locale,
            ns = defaults.ns,
            template = defaults.template,
            pkey = defaults.pkey,
            checkBox = defaults.checkBox,
            renderInfoIn = defaults.renderInfoIn,
            key = defaults.key,
            caller = defaults.caller,
            dashSelected = defaults.dashSelected;

        var customOnLoad = false, destroy, assignEventListeners, clickedFlag = false;

        $(el).parent("div").addClass("gc2map");

        var originalLayers, filters, filterControls, uncheckedIds = [];

        _.extend(object, Backbone.Events);

        /**
         * Clearing existing feature selection
         */
        var clearSelection = function () {
            $(el + ' tr').removeClass("selected");
            $.each(store.layer._layers, function (i, v) {
                let databaseIdentifier = getDatabaseIdForLayerId(v._leaflet_id);
                if (uncheckedIds.indexOf(databaseIdentifier) === -1) {
                    try {
                        v.closePopup();
                        if (store.layer && store.layer.resetStyle) {
                            store.layer.resetStyle(v);
                        }
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
            let style = {
                opacity: 1,
                lineCap: "butt"
            }
            if (dashSelected) {
                style.dashArray = "5 8";
                style.dashSpeed = 10;
            }
            try {
                m.map._layers[id].setStyle(style);
            } catch (e) {
                console.warn("Can't set style on marker")
            }

            onSelect(id, m.map._layers[id], key, caller);

            if (openPopUp) {
                var str = "<table>", renderedText;
                $.each(cm, function (i, v) {
                    if (typeof v.showInPopup === "undefined" || (typeof v.showInPopup === "boolean" && v.showInPopup === true)) {
                        str = str + "<tr><td>" + v.header + "</td><td>" + m.map._layers[id].feature.properties[v.dataIndex] + "</td></tr>";
                    }
                });
                str = str + "</table>";

                if (template) {
                    renderedText = Handlebars.compile(template)(m.map._layers[id].feature.properties);
                }

                if (!renderInfoIn) {
                    m.map._layers[id].bindPopup("<div id='popup-test'></div>" + renderedText || str, {
                        className: "custom-popup gc2table-custom-popup",
                        autoPan: autoPan,
                        closeButton: true,
                        minWidth: 160
                    }).openPopup();
                } else {
                    $(renderInfoIn).html(renderedText);
                }

                m.map._layers[id].on('popupclose', function (e) {
                    // Removing the selectedStyle from feature
                    var databaseIdentifier = getDatabaseIdForLayerId(id);
                    if (uncheckedIds.indexOf(databaseIdentifier) > -1) {
                        store.layer._layers[id].setStyle(uncheckedStyle);
                    } else {
                        store.layer.resetStyle(store.layer._layers[id]);
                    }

                    if (onPopupClose) onPopupClose(id);
                });

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
                object.trigger("selected" + "_" + uid, e.target._leaflet_id, m);
            }
        };
        click.byGC2Table = true;

        $(el).append("<thead><tr></tr></thead>");

        if (checkBox) {
            $(el + ' thead tr').append("<th data-field='" + pkey + "' data-checkbox='true'></th>");
        }

        $.each(cm, function (i, v) {
            $(el + ' thead tr').append("<th data-filter-control=" + (v.filterControl || "false") + " data-field='" + v.dataIndex + "' data-sortable='" + (v.sortable || "false") + "' data-editable='false' data-formatter='" + (v.formatter || "") + "'>" + v.header + "</th>");
        });

        var getDatabaseIdForLayerId = function (layerId) {
            if (!store.geoJSON) return false;

            var databaseIdentifier = false;
            store.geoJSON.features.map(item => {
                if (parseInt(item.properties._id) === parseInt(layerId)) {
                    databaseIdentifier = item.properties[pkey];
                    return false;
                }
            });

            if (databaseIdentifier === false) {
                console.error("Unable to find primary key value for layer with identifier " + layerId);
            }

            return databaseIdentifier;
        };

        var bindEvent = function (e) {
            setTimeout(function () {
                $(el + ' > tbody > tr').on("click", function (e) {
                    var id = $(this).data('uniqueid');
                    var databaseIdentifier = getDatabaseIdForLayerId(id);
                    if (uncheckedIds.indexOf(databaseIdentifier) === -1 || checkBox === false) {
                        clickedFlag = true;
                        object.trigger("selected" + "_" + uid, id, m);
                        var layer = m.map._layers[id];
                        setTimeout(function () {
                            if (setViewOnSelect) {
                                try {
                                    if (setZoom) {
                                        m.map.fitBounds(layer.getBounds(), {maxZoom: 16});
                                    } else {
                                        m.map.panTo(layer.getBounds().getCenter());
                                    }
                                } catch (e) {
                                    if (setZoom) {
                                        m.map.setView(layer.getLatLng(), 16);
                                    } else {
                                        m.map.panTo(layer.getLatLng());
                                    }
                                }
                            }
                        }, 100);
                    }
                });

                $(el + ' > tbody > tr').on("mouseover", function (e) {
                    if ($(this).hasClass('no-records-found') === false) {
                        var id = $(this).data('uniqueid');
                        var layer = m.map._layers[id];
                        var databaseIdentifier = getDatabaseIdForLayerId(id);
                        if (uncheckedIds.indexOf(databaseIdentifier) === -1 && checkBox === true) {
                            store.layer._layers[id].setStyle({
                                opacity: 0.5,
                                fillOpacity: 0.5
                            });
                            onMouseOver(id, layer);
                        }
                    }
                });

                $(el + ' > tbody > tr').on("mouseout", function (e) {
                    if ($(this).hasClass('no-records-found') === false) {
                        var id = $(this).data('uniqueid');
                        var databaseIdentifier = getDatabaseIdForLayerId(id);
                        if (uncheckedIds.indexOf(databaseIdentifier) === -1 && checkBox === true) {
                            if (store.layer && store.layer.resetStyle) {
                                if (!clickedFlag) {
                                    store.layer.resetStyle(store.layer._layers[id]);
                                } else {
                                    clickedFlag = false;
                                }
                            }
                        }
                    }
                });
            }, 100);
        };

        var uncheckedStyle = {
            fillOpacity: 0.0,
            opacity: 0.0
        };

        $(el).bootstrapTable({
            uniqueId: "_id",
            height: height,
            locale: locale,
            onToggle: bindEvent,
            onSort: bindEvent,
            onColumnSwitch: bindEvent
        });

        $(el).on('check-all.bs.table', function (e, m) {
            m.map(function (checkedRowItem) {
                if (store.layer && store.layer.resetStyle) {
                    store.layer.resetStyle(store.layer._layers[checkedRowItem._id]);
                }
            });

            uncheckedIds = [];
        });

        $(el).on('uncheck-all.bs.table', function (e, m) {
            m.map(function (uncheckedRowItem) {
                var databaseIdentifier = getDatabaseIdForLayerId(uncheckedRowItem._id);
                uncheckedIds.push(parseInt(databaseIdentifier));

                store.layer._layers[uncheckedRowItem._id].setStyle(uncheckedStyle);

                store.layer._layers[uncheckedRowItem._id].closePopup()
            });
        });

        $(el).on('check.bs.table uncheck.bs.table', function (e, m) {
            var databaseIdentifier = getDatabaseIdForLayerId(m._id);
            if (m[pkey] === false) {
                uncheckedIds.push(parseInt(databaseIdentifier));

                store.layer._layers[m._id].setStyle(uncheckedStyle);

                store.layer._layers[m._id].closePopup()
            } else {
                uncheckedIds = uncheckedIds.filter(function (item) {
                    return item !== parseInt(databaseIdentifier);
                });

                if (store.layer && store.layer.resetStyle) {
                    store.layer.resetStyle(store.layer._layers[m._id]);
                }
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
            moveEndOff();

            if (customOnLoad) {
                store.onLoad = customOnLoad;
            }

            // Unbind event so no references are left to object
            object.unbind("clearSelection_" + uid);
            object.unbind("selected_" + uid);

            $(el).bootstrapTable('removeAll')
            $(el).bootstrapTable('destroy')
            originalLayers = null;
            store = null;
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

        loadDataInTable = function (doNotCallCustomOnload = false, forceDataLoad = false) {
            data = [];
            $.each(store.layer._layers, function (i, v) {
                v.feature.properties._id = i;
                $.each(v.feature.properties, function (n, m) {
                    $.each(cm, function (j, k) {
                        if (k.dataIndex === n && ((typeof k.link === "boolean" && k.link === true) || (typeof k.link === "string"))) {
                            v.feature.properties[n] = "<a style='text-decoration: underline' target='_blank' rel='noopener' href='" + v.feature.properties[n] + "'>" + (typeof k.link === "string" ? k.link : "Link") + "</a>";
                        }
                    });
                });
                data.push(JSON.parse(JSON.stringify(v.feature.properties)));

                if (assignFeatureEventListenersOnDataLoad) {
                    assignEventListeners();
                }
            });

            originalLayers = jQuery.extend(true, {}, store.layer._layers);

            if ($(el).is(':visible') || forceDataLoad) {
                $(el).bootstrapTable("load", data);
            }

            bindEvent();

            if (callCustomOnload && !doNotCallCustomOnload) {
                customOnLoad(store);
            }

            $(".fixed-table-body").css("overflow", "auto");
            if (tableBodyHeight) {
                if (!isNaN(tableBodyHeight)) {
                    $(".fixed-table-body").css("max-height", tableBodyHeight + "px");
                    $(".fixed-table-body").css("height", tableBodyHeight + "px");
                } else {
                    $(".fixed-table-body").css("max-height", tableBodyHeight);
                    $(".fixed-table-body").css("height", tableBodyHeight);
                }
            }
        };

        getUncheckedIds = function () {
            return uncheckedIds;
        }

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

        var jrespond = require('jrespond');
        var jRes = jrespond([
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

        return {
            loadDataInTable: loadDataInTable,
            destroy: destroy,
            assignEventListeners: assignEventListeners,
            getUncheckedIds: getUncheckedIds,
            object: object,
            uid: uid,
            store: store,
            moveEndOff: moveEndOff,
            moveEndOn: moveEndOn,
            bootStrapTable : $(el).bootstrapTable
        };
    };
    return {
        init: init,
        isLoaded: isLoaded
    };
}());
