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
            "skarupfjv": { // Your print templates. "print" is the default
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
                }
            },
            "kertemindeforsyningprint": { // Your print templates. "print" is the default
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
                }
            },
            "stoholmvarme": { // Your print templates. "print" is the default
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
                }
            },
            "vandvaerk2": { // Your print templates. "print" is the default
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
                }
            },
            "vandvaerk_bordingvand2": { // Your print templates. "print" is the default
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
                }
            },
            "vandvaerk_brobyvaerk2": { // Your print templates. "print" is the default
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
                }
            },
            "vandvaerk_gudme2": { // Your print templates. "print" is the default
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
            }
            },
            "vandvaerk_durupvand2": { // Your print templates. "print" is the default
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
                }
            },
            "vandvaerk_poulstrupvand2": { // Your print templates. "print" is the default
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
                }
            },
            "vandvaerk_herrestedmaare2": { // Your print templates. "print" is the default
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
                }
            },
            "vandvaerk_stoholm2": { // Your print templates. "print" is the default
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
                }
            },
            "vandvaerk_vesteraaby2": { // Your print templates. "print" is the default
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
                }
            },
            "tvedvand": { // Your print templates. "print" is the default
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
                }
            },
            "tvedvandvaerk": { // Your print templates. "print" is the default
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
                }
            },
            "jndata": { // Your print templates. "print" is the default
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
                }
            },
            "atea_beumergroup": { // Your print templates. "print" is the default
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
                }
            },
            "engesvangvand": { // Your print templates. "print" is the default
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
                }
            },
            "vandvaerk_nrlyngbyvand2": { // Your print templates. "print" is the default
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
                }
            },
            "vandvaerk_vittrupvand2": { // Your print templates. "print" is the default
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
                }
            },
            "vandvaerk_hesselagerkirkebyvand2": { // Your print templates. "print" is the default
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
                }
            },
            "vandvaerk_knudstrandvand2": { // Your print templates. "print" is the default
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
                }
            },
            "vandvaerk_jellingvand2": { // Your print templates. "print" is the default
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
                }
            },
            "vandvaerk_haurumvand2": { // Your print templates. "print" is the default
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
                }
            },
            "vandvaerk_knudbyvand2": { // Your print templates. "print" is the default
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
                }
            },
            "vandvaerk_vorgodvand2": { // Your print templates. "print" is the default
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
                }
            },
            "vandvaerk_hvidstenvand2": { // Your print templates. "print" is the default
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
                }
            },
            "varmevaerk_stoholmvarme2": { // Your print templates. "print" is the default
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
                }

            },
            "Agriteam_Viborg": { // Your print templates. "print" is the default
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
                }

            },
            "Agriteam_Varde": { // Your print templates. "print" is the default
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
                }

            },
            "Agriteam_Brorup": { // Your print templates. "print" is the default
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
                }

            },
            "Agriteam_Randers": { // Your print templates. "print" is the default
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
            }/*,
            "_mapGoPrint": {
                "A4": {
                    "p": {
                        "mapsizePx": [700, 500],
                        "mapsizeMm": [190, 120]
                    }
                }
            },*/
        },


        // =====================
        // Pre-configured scales
        // =====================

        "scales": [100, 250, 500, 1000, 2000, 3000, 4000, 5000, 7500, 10000]
    },


    // =======================================================
    // Extensions are required in build-time, but not enabled.
    // Look further down about enabling of extensions
    // Extensions can be required both browser and server side
    // =======================================================

    "extensions": {
        "browser": [{
                "conflictSearch": ["index", "reportRender", "infoClick", "controller"]
            },
            /*{"layerSearch": ["index", "controller"]},*/
            {
                "streetView": ["index"]
            },
            {
                "coordinates": ["index"]
            },
            {
                "offlineMap": ["index"]
            },
            {
                "session": ["index"]
            },
            {
                "editor": ["index"]
            },
            {
                "embed": ["index"]
            },
            {
                "documentCreate": ["index"]
            },
            {
                "graveAssistent": ["index"]
            },
            {
                "geosag": ["index"]
            }/*,
            {
                "MapGOMenu": ["index", "reportRender", "infoClick", "controller"]
            }*/
        ],
        "server": [{
                "conflictSearch": ["index"]
            },
            /*{layerSearch: ["index", "indexInEs"]},*/
            {
                "session": ["index"]
            },
            {
                "documentCreate": ["index"]
            },
            {
                "graveAssistent": ["index"]
            },
            {
                "geosag": ["index"]
            }/*,
            {
                "MapGOMenu": ["index"]
            }*/
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

    "configUrl": "https://geopartner.github.io/webgis",


    // ==========================================================
    // With auto loading of configurations, Vidi will try to load
    // a config json file with the same name as the user name
    // (Database name in GC2 and account name in Carto)
    // ==========================================================

    "autoLoadingConfig": false,


    // ====================================================================================
    // A fallback config file. If no config is given in the URL or auto loading is disabled
    // OR URL / auto loading is returning a 404 or a invalid jSON file
    // ====================================================================================

    "defaultConfig": "vidi.json",


    // =============================================================
    // Below are configurations, which can be overridden in run-time
    // These can be placed in a online config JSON file
    // hosted at the "configUrl" setting
    // =============================================================

    // ===================================
    // Brand name for the default template
    // ===================================

    "brandName": "Geopartner A/S",


    // ===================================
    // About text and modal box at startup 
    // for the default template
    // ===================================
    "aboutBox":"<h1>Velkommen</h1><p>Det er her muligt at se forskellige baggrundskort, som topografiske kort og luftfoto-serier, tilføje en række korttemaer, læse informationer om disse, samt tegne, tage mål, udskrive kort, mv.</p><p>Geopartner A/S er ikke ansvarlig for misbrug af oplysninger eller for fejl i de oplysninger, der stilles til rådighed.</p><p>For yderligere oplysninger og kontaktinformationer besøg <a href='http://www.geopartner.dk' target='_blank'>www.geopartner.dk</a>.</p>",
    "startUpModal":"<h1>Velkommen</h1><p>Det er her muligt at se forskellige baggrundskort, som topografiske kort og luftfoto-serier, tilføje en række korttemaer, læse informationer om disse, samt tegne, tage mål, udskrive kort, mv.</p><p>Geopartner A/S er ikke ansvarlig for misbrug af oplysninger eller for fejl i de oplysninger, der stilles til rådighed.</p><p>For yderligere oplysninger og kontaktinformationer besøg <a href='http://www.geopartner.dk' target='_blank'>www.geopartner.dk</a>.</p>",
    
    // ========================================
    // Set a width for video elements in popups
    // Should be a string with units - defaults to '250px'
    // ========================================
    
    //"popupVideoWidth": "350px",

    
    // ========================================
    // Set a width for image elements in popups
    // Should be a string with units - defaults to '100%'
    // ========================================

    //"popupImageWidth": "350px",


    // ===================================================
    // Enabling of extensions
    // Extensions are enabled both browser and server side
    // ===================================================

    "enabledExtensions": [
        /*"conflictSearch",*/
        "streetView",
        "layerSearch",
        "coordinates",
        "session",
        "editor"
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
    // Enables automatic login using persistant cookie.
    // USE WITH CAUTION! 
    // Set following in configs extensionConfig:
    //  session:{autoLogin: true, autoLoginMaxAge: null}
    // =========================================================

    "autoLoginPossible": true,

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

    // =========================================================
    // Ignore URLs for caching by ServiceWorker.
    // Works wonders for embedding .mp4-videos with timecodes like
    // "...2020.mp4#t=308,312"
    // ==========================================================

    "urlsIgnoredForCaching": [
        {
            "regExp": true,
            "requested": "maptv.geopartner.dk"
        }
    ],

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
   "baseLayers":[
      {
         "id":"geodk.bright",
         "name":"Topografisk kort",
         "db":"baselayers",
         "host":"https://dk.gc2.io",
         "abstract":"<p>Topografisk kort baseret på GeoDanmark data, som opdateres årligt.</p><p>Copyright: Styrelsen for Dataforsyning og Effektivisering og Danske kommuner.</p><p>Baggrundskortet må frit anvendes, men følgende skal angives 'Indeholder GeoDanmark-data fra Styrelsen for Dataforsyning og Effektivisering og Danske kommuner.'. </p><br><img src='https://nextcloud.gc2.io/index.php/apps/files_sharing/publicpreview/aqwPtJAKE9BzKes?x=2553&y=827&a=true&file=sagsbehandler_basiskort_eget.png&scalingup=0'>",
         "config":{
            "maxZoom":21,
            "maxNativeZoom":21,
            "attribution":"&copy; Styrelsen for Dataforsyning og Effektivisering og Danske kommuner."
         }
      },
      {
         "id":"luftfotoserier.geodanmark_2019_12_5cm",
         "name":"Luftfoto 2019",
         "db":"baselayers",
         "host":"https://dk.gc2.io",
         "abstract":"<p>Oprettede luftfoto (ortofoto) marts/april 2019 (15 cm pixels).</p><p>Copyright: Styrelsen for Dataforsyning og Effektivisering og Danske kommuner.</p><p>Luftfotoet må frit anvendes, men følgende skal angives 'Indeholder GeoDanmark-data fra Styrelsen for Dataforsyning og Effektivisering og Danske kommuner.'.</p><br><img src='https://nextcloud.gc2.io/index.php/apps/files_sharing/publicpreview/zqoWbwDGiyCQ5zn?x=2553&y=827&a=true&file=luftfoto_2019.png&scalingup=0'>",
         "config":{
            "maxZoom":21,
            "maxNativeZoom":21,
            "attribution":"&copy; Styrelsen for Dataforsyning og Effektivisering og Danske kommuner."
         },
         "overlays":[
            {
               "id":"dar.adgangsadresser_husnr",
               "db":"baselayers",
               "host":"https://dk.gc2.io",
               "config":{
                  "maxZoom":21,
                  "maxNativeZoom":21
               }
            },
            {
               "id":"geodk.vejmidte_brudt_m_navn",
               "db":"baselayers",
               "host":"https://dk.gc2.io",
               "config":{
                  "maxZoom":21,
                  "maxNativeZoom":21
               }
            }
         ]
      },      
      {
         "id":"luftfotoserier.geodanmark_2018_12_5cm",
         "name":"Luftfoto 2018",
         "db":"baselayers",
         "host":"https://dk.gc2.io",
         "abstract":"<p>Oprettede luftfoto (ortofoto) marts/april 2018 (15 cm pixels).</p><p>Copyright: Styrelsen for Dataforsyning og Effektivisering og Danske kommuner.</p><p>Luftfotoet må frit anvendes, men følgende skal angives 'Indeholder GeoDanmark-data fra Styrelsen for Dataforsyning og Effektivisering og Danske kommuner.'.</p><br><img src='https://nextcloud.gc2.io/index.php/apps/files_sharing/publicpreview/WzGweqNMZDKyx8E?x=2553&y=827&a=true&file=luftfoto_2018.png&scalingup=0'>",
         "config":{
            "maxZoom":21,
            "maxNativeZoom":21,
            "attribution":"&copy; Styrelsen for Dataforsyning og Effektivisering og Danske kommuner."
         }
      },
      {
         "id":"luftfotoserier.geodanmark_2017_12_5cm",
         "name":"Luftfoto 2017",
         "db":"baselayers",
         "host":"https://dk.gc2.io",
         "abstract":"<p>Oprettede luftfoto (ortofoto) marts/april 2017 (15 cm pixels).</p><p>Copyright: Styrelsen for Dataforsyning og Effektivisering og Danske kommuner.</p><p>Luftfotoet må frit anvendes, men følgende skal angives 'Indeholder GeoDanmark-data fra Styrelsen for Dataforsyning og Effektivisering og Danske kommuner.'.</p><br><img src='https://nextcloud.gc2.io/index.php/apps/files_sharing/publicpreview/bXBDW6ssarLkWdZ?x=2553&y=827&a=true&file=luftfoto_2017.png&scalingup=0'>",
         "config":{
            "maxZoom":21,
            "maxNativeZoom":21,
            "attribution":"&copy; Styrelsen for Dataforsyning og Effektivisering og Danske kommuner."
         }
      },
      {
         "id": "kortforsyningen.dtk_skaermkort_daempet",
         "name":"Skærmkort - dæmpet",
         "db":"baselayers",
         "host":"https://dk.gc2.io",
         "abstract":"<p>Skærmkort, som opdateres årligt.</p><p>Copyright: Styrelsen for Dataforsyning og Effektivisering og Danske kommuner.</p><p>Baggrundskortet må frit anvendes, men følgende skal angives 'Indeholder data fra Styrelsen for Dataforsyning og Effektivisering.'. </p><br><img src='https://nextcloud.gc2.io/index.php/apps/files_sharing/publicpreview/aqwPtJAKE9BzKes?x=2553&y=827&a=true&file=sagsbehandler_basiskort_eget.png&scalingup=0'>",
         "config":{
            "maxZoom":21,
            "maxNativeZoom":21,
            "attribution":"&copy; Styrelsen for Dataforsyning og Effektivisering."
         }
      },
      {
          "id": "osm",
         "name":"Topografisk kort - Open Street Map",
         "abstract":"<p>Kortet hentes fra Open Street Map.</p><br><img src='https://nextcloud.gc2.io/index.php/apps/files_sharing/publicpreview/d66QC8j5mNi4xDS?x=2553&y=827&a=true&file=open_street_map.png&scalingup=0'>",
         "config":{
            "maxZoom":21,
            "maxNativeZoom":21,
            "attribution":"&copy; Open Street Map"
         }
      },      
      {
        "id": "stamenToner",
        "name": "Stamen Toner",
        "abstract":"<p>Kortet hentes fra Stamen Toner.</p><br><img src='https://nextcloud.gc2.io/index.php/apps/files_sharing/publicpreview/YpYDEbo6C8BX34a?x=2553&y=827&a=true&file=stamen_toner_dark.png&scalingup=0'>",
        "config":{
          "maxZoom":21,
          "maxNativeZoom":21,
          "attribution":"&copy; Stamen Toner"
        }
      },      
      {
        "id": "stamenTonerLite",
        "name": "Stamen Toner Light",
        "abstract":"<p>Kortet hentes fra Stamen Toner.</p><br><img src='https://nextcloud.gc2.io/index.php/apps/files_sharing/publicpreview/YpYDEbo6C8BX34a?x=2553&y=827&a=true&file=stamen_toner_light.png&scalingup=0'>",
        "config":{
          "maxZoom":21,
          "maxNativeZoom":21,
          "attribution":"&copy; Stamen Toner"
        }
      },
      {
         "id": "kortforsyningen.topo25", 
         "name": "Klassisk 4cm kort", 
         "db": "baselayers", 
         "host": "https://gc2.io",
         "config": {
            "maxZoom":21,
            "maxNativeZoom":21,
            "attribution":"&copy; Styrelsen for Dataforsyning og Effektivisering." 
         }
      }
   ]
}
