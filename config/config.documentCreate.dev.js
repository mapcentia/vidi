/*
 * @author     Martin Høgh <mh@mapcentia.com>
 * @copyright  2013-2018 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

module.exports = {

    // ===============================================
    // Following settings are set under build/startup.
    // They can not be altered in run-time.
    // ===============================================


    // ========================================
    // Which back-end is used. "gc2" or "carto"
    // ========================================

    "backend": "gc2",


    // ==========================================
    // GC2 host. Both HTTP and HTTPS is supported
    // Carto is hardcoded to carto.com
    // ==========================================

    "gc2": {
        "host": "https://mapgogc2.geopartner.dk"
    },


    // ===============================================================
    // Configuration of print templates.
    // Print templates must be enabled - look further down.
    // mapsizePx ~ is the pixel dimension of the map view
    // mapsizeMm ~ is actual size of the map view on the resulting PDF
    // ===============================================================

    "print": {
        "templates": {


            // ================================
            // The "print" template is build-in
            // ================================

            "print": {
                A4: {
                    l: {
                        mapsizePx: [1060, 730],
                        mapsizeMm: [280, 192]
                    },
                    p: {
                        mapsizePx: [730, 1060],
                        mapsizeMm: [192, 280]
                    }
                },
                A3: {
                    l: {
                        mapsizePx: [1525, 1065],
                        mapsizeMm: [401, 282]
                    },
                    p: {
                        mapsizePx: [1065, 1525],
                        mapsizeMm: [282, 401]
                    }
                },
                A2: {
                    l: {
                        mapsizePx: [2185, 1525],
                        mapsizeMm: [576, 400]
                    },
                    p: {
                        mapsizePx: [1525, 2185],
                        mapsizeMm: [400, 576]
                    }
                },
                A1: {
                    l: {
                        mapsizePx: [3120, 2185],
                        mapsizeMm: [820, 576]
                    },
                    p: {
                        mapsizePx: [2185, 3120],
                        mapsizeMm: [576, 820]
                    }
                },
                A0: {
                    l: {
                        mapsizePx: [4430, 3120],
                        mapsizeMm: [1173, 825]
                    },
                    p: {
                        mapsizePx: [3120, 4430],
                        mapsizeMm: [825, 1173]
                    }
                }
            },


            // ========================================================
            // Names starting with "_" will not appear in the Print tab
            // But can be used by other extensions.
            // Must not be enabled.
            // ========================================================

            "_conflictPrint": {
                "A4": {
                    "p": {
                        "mapsizePx": [700, 500],
                        "mapsizeMm": [190, 120]
                    }
                }
            }
        },


        // =====================
        // Pre-configured scales
        // =====================

        "scales": [100, 250, 500, 1000, 2000, 3000, 4000, 5000, 7500, 10000, 15000, 25000, 50000, 100000]
    },


    // =======================================================
    // Extensions are required in build-time, but not enabled.
    // Look further down about enabling of extensions
    // Extensions can be required both browser and server side
    // =======================================================

    "extensions": {
        "browser": [
            //{"conflictSearch": ["index", "reportRender", "infoClick", "controller"]},
            //{"layerSearch": ["index", "controller"]},
            //{"streetView": ["index"]},
            //{"coordinates": ["index"]},
            //{"offlineMap": ["index"]},
            {"session": ["index"]},
            //{"editor": ["index"]},
            //{"embed": ["index"]},
            {"documentCreate":["index"]}
        ],
        "server": [
            /*{conflictSearch: ["index"]},*/
            /*{layerSearch: ["index", "indexInEs"]},*/
            {"session": ["index"]},
            {"documentCreate":["index"]}
        ]
    },

    // ===========================================================
    // Search modules are required in build-time, but not enabled.
    // Look further down about enabling search modules
    // ===========================================================

    "searchModules": ["google", "danish"],


    //=============================================================================
    // An URL where configurations can be downloaded online for
    // overriding build-time configurations. Any HTTP(S) server can host config files
    // Example of a config:
    // https://github.com/mapcentia/mapcentia.github.io/blob/master/vidi.json
    // Can be used by adding ?config=vidi.json to the Vidi URL'en
    //=============================================================================

    "configUrl": "https://github.com/geopartner/webgis/blob/master",


    // ==========================================================
    // With auto loading of configurations, Vidi will try to load
    // a config json file with the same name as the user name
    // (Database name in GC2 and account name in Carto)
    // ==========================================================

    "autoLoadingConfig": true,


    // ====================================================================================
    // A fallback config file. If no config is given in the URL or auto loading is disabled
    // OR URL / auto loading is returning a 404 or a invalid jSON file
    // ====================================================================================

    "defaultConfig": "dev_vmr.json",


    // =============================================================
    // Below are configurations, which can be overridden in run-time
    // These can be placed in a online config JSON file
    // hosted at the "configUrl" setting
    // =============================================================

    // ===================================
    // Brand name for the default template
    // ===================================

    "brandName": "MapCentia ApS",


    // ===================================
    // About text for the default template
    // ===================================

    "aboutBox": "<p>My awesome web map</p>",


    // ===================================================
    // Enabling of extensions
    // Extensions are enabled both browser and server side
    // ===================================================

    "enabledExtensions": [
        /*"conflictSearch",*/
        //"streetView",
        //"layerSearch",
        //"coordinates",
        "session",
        //"editor",
        //"embed",
        //"offlineMap",
        "documentCreate"
    ],


    // ====================================
    // Set which template Vidi should use
    // default.tmpl is the build-in default
    // ====================================

    "template": "default.tmpl",


    // ===========================
    // Enabling of print templates
    // ===========================

    "enabledPrints": ["print"],


    // =====================================
    // Enabling of a search module
    // Only one search module can be enabled
    // =====================================

    "enabledSearch": "google",


    // =================================
    // Configurations for search modules
    // =================================

    "searchConfig": {
        "komkode": ["851", "151"] // Example of config for danish search
    },

    // =========================================================
    // Configurations for extension modules
    // An extension can read the whole config, but by convention,
    // its a good idea to put them inside this property
    // ==========================================================

    "extensionConfig": {
        "layerSearch": {
            "host": "localhost:9200"
        }
    },

    // ===================================================
    // Configuration of which base layers are available
    //
    // GC2 has the following pre-defined base layers
    //
    // osm
    // stamenToner
    // stamenTonerLite
    // googleStreets
    // googleHybrid
    // googleSatellite
    // dtkSkaermkort
    // dtkSkaermkortDaempet
    // hereNormalNightGrey
    // ===================================================

    "baseLayers": [

        {
            "id": "geodk.bright",
            "name": "GeoDanmark kort",
            "db": "baselayers",
            "host": "https://gc2.io",
            "config": {
                "maxZoom": 21,
                "maxNativeZoom": 19,
                "attribution": "&copy; SDFE & MapCentia ApS"
            }
        },


        // Pre-defined base layers
        {"id": "osm", "name": "Open Street Map"},

        {"id": "stamenTonerLite", "name": "Stamen Toner Light"},

        // Base layer from GC2
        {
            "id": "gc2_group._b_baggrundskort01.baggrundskort01",
            "name": "Topografisk kort",
            "db": "geofyn",
            "host": "https://kort.geofyn.dk",
            "config": {
                "maxZoom": 21,
                "maxNativeZoom": 19,
                "attribution": "Geofyn A/S"
            },

            // A base layer can comprise one or more overlays
            "overlays": [
                {
                    "id": "tekster.tekster_samlet_wms_web",
                    "db": "geofyn",
                    "host": "https://kort.geofyn.dk",
                    "config": {
                        "attribution": "Geofyn A/S"
                    }
                },
                {
                    "id": "tekster.adgangsadresseinfo",
                    "db": "geofyn",
                    "host": "https://kort.geofyn.dk",
                    "config": {
                        "attribution": "Geofyn A/S"
                    }
                }]
        }
    ]
};
