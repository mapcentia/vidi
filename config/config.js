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
    // Limits for puppeteer processes
    // numbers work on a per thread basis.
    // ===============================================================
    
    "puppeteerProcesses": {
        "min": 1,
        "max": 2
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

            "vandvaerk_sjoerupvand2": { // Your print templates. "print" is the default
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
            "vandvaerk_fjelsoevand2": { // Your print templates. "print" is the default
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
            "vandvaerk_lundoenordrevand2": { // Your print templates. "print" is the default
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
            "vandvaerk_skaerumvand2": { // Your print templates. "print" is the default
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
            "vandvaerk_svindingevand2": { // Your print templates. "print" is the default
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
            "vandvaerk_harerendenvand2": { // Your print templates. "print" is the default
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
            "vandvaerk_farstrupvand2": { // Your print templates. "print" is the default
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
            "andelsnet": { // Your print templates. "print" is the default
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
            "portofaalborgprint": { // Your print templates. "print" is the default
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
            "segesprint": { // Your print templates. "print" is the default
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
            "grundfosprint": { // Your print templates. "print" is the default
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
            "edcvidebaekgprint": { // Your print templates. "print" is the default
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
            "vandvaerk_haderupvand2": { // Your print templates. "print" is the default
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
            "vandvaerk_lundoenordrevand2": { // Your print templates. "print" is the default
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
            "vandvaerk_halskovvand2": { // Your print templates. "print" is the default
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
                        mapsizePx: [1525, 1060],
                        mapsizeMm: [401, 282]
                    },
                    p: {
                        mapsizePx: [1060, 1525],
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
                        mapsizePx: [1525, 1060],
                        mapsizeMm: [401, 282]
                    },
                    p: {
                        mapsizePx: [1060, 1525],
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
                        mapsizePx: [1525, 1060],
                        mapsizeMm: [401, 282]
                    },
                    p: {
                        mapsizePx: [1060, 1525],
                        mapsizeMm: [282, 401]
                    }
                }

            },
			"vestforbraending_print": { // Your print templates. "print" is the default
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
			"skagenhavn_print": { // Your print templates. "print" is the default
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
            "hoejslevkirkeby_print": { // Your print templates. "print" is the default
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
            "vejbysmidstrup_print": { // Your print templates. "print" is the default
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
            "nimvand_print": { // Your print templates. "print" is the default
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
            "harridslevvand_print": { // Your print templates. "print" is the default
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

        "scales": [100, 250, 500, 1000, 2000, 3000, 4000, 5000, 7500, 10000, 15000, 25000, 50000, 100000]
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
        },
        {
            "regExp": true,
            "requested": "docunoteapi.geopartner.dk"
        },
        {
            "regExp": true,
            "requested": "services.hxgncontent.com"
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
   
    "df" : {
        "username" : "XMERXHKAVN",
        "password" : "Geop1234!"
    },
    "baseLayers":[
        
		{
			"type": "wms",
			"url": "https://api.dataforsyningen.dk/forvaltning2?token=4aacd5977eb46ca012c260ecb608c65c",
			"layers": [
				"Basis_kort",
				"Stednavne_basiskort",
				"Vejnavne_basiskort",
				"Husnummer"
			],
			"id": "ForvaltningskortDF",
			"name": "Forvaltningskort",
			"description": "Forvaltningskort fra Dataforsyningen",
			"attribution": "&copy; Styrelsen for Dataforsyning og Effektivisering, GeoDanmark og Danske kommuner.",
			"abstract": "<p>Forvaltningskort.</p><p>&copy; Styrelsen for Dataforsyning og Effektivisering, GeoDanmark og Danske kommuner.</p><p>Forvaltningskortet viser følgende temaer:<br><ul><li>Basis_kort</li><li>Stednavne_basiskort</li><li>Vejnavne_basiskort</li><li>Husnummer</li></ul></p><br>",
			"minZoom": 4,
			"maxZoom": 22,
			"maxNativeZoom": 20
		},
	    {
         "id":"geodk.bright",
         "name":"Topografisk kort",
         "db":"baselayers", 
         "host":"https://dk.gc2.io",
         "abstract":"<p>Topografisk kort baseret på GeoDanmark data, som opdateres årligt.</p><p>Copyright: Styrelsen for Dataforsyning og Effektivisering og Danske kommuner.</p><p>Baggrundskortet må frit anvendes, men følgende skal angives 'Indeholder GeoDanmark-data fra Styrelsen for Dataforsyning og Effektivisering og Danske kommuner.'. </p><br>",
         "config":{
            "maxZoom":21,
            "maxNativeZoom":19,
            "attribution":"&copy; Styrelsen for Dataforsyning og Effektivisering og Danske kommuner."
         }
      },
		{
			"type": "wms",
			"url": "/api/df/Matrikel/MatrikelGaeldendeOgForeloebigWMS/1.0.0/WMS",
			"layers": [
				"Centroide_Gaeldende",
				"OptagetVej_Gaeldende",
				"MatrikelSkel_Gaeldende",
				"StrandbeskyttelseFlade_Gaeldende",
				"KlitfredningFlade_Gaeldende",
				"FredskovFlade_Gaeldende"
			],
			"styles": [
				"Sorte_centroider",
				"Sort_OptagetVej",
				"Sorte_skel",
				"default",
				"default",
				"default"
			],
			"id": "Matriklen-DAF",
			"name": "Matrikelkort",
			"description": "Matriklen (Datafordeleren)",
			"attribution": "&copy; Geodatastyrelsen, Datafordeleren",
			"abstract": "<p>Dagligt ajourført matrikelkort.</p><p>Ophavsretten til Matrikelkortet tilhører Geodatastyrelsen</p><p>Data og kort fra Matrklen er stillet til rådighed efter vilkårene beskrevet på https://datafordeler.dk/vejledning/brugervilkaar/ejendomsoplysninger-ebr-og-mat/</p><br>",
			"minZoom": 8,
			"maxZoom": 22,
			"maxNativeZoom": 22,
			"transparent": false
		},
      {
        "type": "wms",
        "url": "/api/df/GeoDanmarkOrto/orto_foraar/1.0.0/WMS",
        "layers": [
            "orto_foraar"
        ],
        "id": "Luftfoto_nyeste",
        "name":"Luftfoto nyeste",
        "description": "Luftfotokort fra kortforsyningen",
        "attribution": "&copy; Styrelsen for Dataforsyning og Effektivisering og Danske kommuner.",
        "abstract":"<p>Baggrundskort med seneste udgave af GeoDanmark ortofoto forår</p><p>Copyright: Styrelsen for Dataforsyning og Effektivisering og Danske kommuner.</p><p>Luftfotoet må frit anvendes, men følgende skal angives 'Indeholder GeoDanmark-data fra Styrelsen for Dataforsyning og Effektivisering og Danske kommuner.'.</p><br>",
        "minZoom": 4,
        "maxZoom": 22,
        "maxNativeZoom": 20,
            "overlays": [
                {
                    "id": "public.mvw_adgangsadresser",
                    "db": "mapconnectbase",
                    "host": "https://mapgogc2.geopartner.dk",
                    "config": {
                        "maxZoom": 21,
                        "maxNativeZoom": 19
                    }
                },
                {
                    "id": "public.mvw_vejnavne",
                    "db": "mapconnectbase",
                    "host": "https://mapgogc2.geopartner.dk",
                    "config": {
                        "maxZoom": 21,
                        "maxNativeZoom": 19
                    }
                }
            ]
        },      
        {
         "id":"luftfotoserier.geodanmark_2018_12_5cm",
         "name":"Luftfoto 2018",
         "db":"baselayers",
         "host":"https://dk.gc2.io",
         "abstract":"<p>Oprettede luftfoto (ortofoto) marts/april 2018 (12,5 cm pixels).</p><p>Copyright: Styrelsen for Dataforsyning og Effektivisering og Danske kommuner.</p><p>Luftfotoet må frit anvendes, men følgende skal angives 'Indeholder GeoDanmark-data fra Styrelsen for Dataforsyning og Effektivisering og Danske kommuner.'.</p><br>",
         "config":{
            "maxZoom":21,
            "maxNativeZoom":19,
            "attribution":"&copy; Styrelsen for Dataforsyning og Effektivisering og Danske kommuner."
         },
            "overlays": [
                {
                    "id": "public.mvw_adgangsadresser",
                    "db": "mapconnectbase",
                    "host": "https://mapgogc2.geopartner.dk",
                    "config": {
                        "maxZoom": 21,
                        "maxNativeZoom": 19
                    }
                },
                {
                    "id": "public.mvw_vejnavne",
                    "db": "mapconnectbase",
                    "host": "https://mapgogc2.geopartner.dk",
                    "config": {
                        "maxZoom": 21,
                        "maxNativeZoom": 19
                    }
                }
            ]
      },
      {
         "id":"luftfotoserier.geodanmark_2017_12_5cm",
         "name":"Luftfoto 2017",
         "db":"baselayers",
         "host":"https://dk.gc2.io",
         "abstract":"<p>Oprettede luftfoto (ortofoto) marts/april 2017 (12,5 cm pixels).</p><p>Copyright: Styrelsen for Dataforsyning og Effektivisering og Danske kommuner.</p><p>Luftfotoet må frit anvendes, men følgende skal angives 'Indeholder GeoDanmark-data fra Styrelsen for Dataforsyning og Effektivisering og Danske kommuner.'.</p><br>",
         "config":{
            "maxZoom":21,
            "maxNativeZoom":19,
            "attribution":"&copy; Styrelsen for Dataforsyning og Effektivisering og Danske kommuner."
         },
            "overlays": [
                {
                    "id": "public.mvw_adgangsadresser",
                    "db": "mapconnectbase",
                    "host": "https://mapgogc2.geopartner.dk",
                    "config": {
                        "maxZoom": 21,
                        "maxNativeZoom": 19
                    }
                },
                {
                    "id": "public.mvw_vejnavne",
                    "db": "mapconnectbase",
                    "host": "https://mapgogc2.geopartner.dk",
                    "config": {
                        "maxZoom": 21,
                        "maxNativeZoom": 19
                    }
                }
            ]
      },
      {
        "type": "wms",
         "url": "/api/df/Dkskaermkort/topo_skaermkort/1.0.0/WMS",
        "layers": [
            "dtk_skaermkort_daempet"
        ],
        "id": "kortforsyningen.dtk_skaermkort_daempet",
        "name": "Skærmkort - dæmpet",
        "attribution": "&copy; Styrelsen for Dataforsyning og Effektivisering og Danske kommuner.",
         "abstract":"<p>Skærmkort, som opdateres årligt.</p><p>Copyright: Styrelsen for Dataforsyning og Effektivisering og Danske kommuner.</p><p>Baggrundskortet må frit anvendes, men følgende skal angives 'Indeholder data fra Styrelsen for Dataforsyning og Effektivisering.'. </p><br>",
        "minZoom": 4,
        "maxZoom": 24,
        "maxNativeZoom": 20
      },
      {
          "id": "osm",
         "name":"Topografisk kort - Open Street Map",
         "abstract":"<p>Kortet hentes fra Open Street Map.</p><br>",
         "config":{
            "maxZoom":21,
            "maxNativeZoom":19,
            "attribution":"&copy; Open Street Map"
         }
      },      
      {
        "id": "stamenToner",
        "name": "Stamen Toner",
        "abstract":"<p>Kortet hentes fra Stamen Toner.</p><br>",
        "config":{
          "maxZoom":21,
          "maxNativeZoom":19,
          "attribution":"&copy; Stamen Toner"
        }
      },      
      {
        "id": "stamenTonerLite",
        "name": "Stamen Toner Light",
        "abstract":"<p>Kortet hentes fra Stamen Toner.</p><br>",
        "config":{
          "maxZoom":21,
          "maxNativeZoom":19,
          "attribution":"&copy; Stamen Toner"
        }
      },
       {
        "type": "wms",
        "url": "/api/df/DKtopokort/dtk_25/1.0.0/WMS",
        "layers": [
            "dtk25"
        ],
        "id": "DTK_Kort25",
        "name": "Klassisk 4cm kort",
        "attribution": "&copy; Styrelsen for Dataforsyning og Effektivisering og Danske kommuner.",
        "abstract": "<p>Klassisk 4 cm kort</p><p>Copyright: Styrelsen for Dataforsyning og Effektivisering og Danske kommuner.</p><br>",
        "minZoom": 4,
        "maxZoom": 24,
        "maxNativeZoom": 20
      }
   ]
}
