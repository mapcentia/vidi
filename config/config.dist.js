module.exports = {
    backend: "WHAT_BACKEND", // gc2 or cartodb
    gc2: {
        host: "http://my_gc2_server.com" // IP or DNS to the GC2 server. Use external address
    },
    cartodb: {
        db: "my_carto_account", // Carto account
        baseLayers: [ // Set some baselayers
            {
                type: "XYZ",
                url: "http://my_map/{z}/{x}/{y}.png",
                id: "my_map",
                name: "My nice baselayer",
                description: "Pretty awesome map",
                attribution: "",
                minZoom: 0,
                maxZoom: 18,
                maxNativeZoom: 20
            },
            {"id": "osm", "name": "OSM"},
            {"id": "stamenToner", "name": "Stamen Toner"}
        ]
    },
    print: {
        templates: {
            "print": { // Your print templates. "print" is the default
                A4: {
                    l: {
                        mapsizePx: [1000, 700],
                        mapsizeMm: [270, 190]
                    },
                    p: {
                        mapsizePx: [700, 1000],
                        mapsizeMm: [190, 270]
                    }
                },
                A3: {
                    l: {
                        mapsizePx: [1480, 1040],
                        mapsizeMm: [401, 282]
                    },
                    p: {
                        mapsizePx: [1040, 1480],
                        mapsizeMm: [282, 401]
                    }
                }
            }/*,
            "another_print": {
                A4: {
                    l: {
                        mapsizePx: [1000, 700],
                        mapsizeMm: [270, 190]
                    },
                    p: {
                        mapsizePx: [700, 1000],
                        mapsizeMm: [190, 270]
                    }
                },
                A3: {
                    l: {
                        mapsizePx: [1000, 700],
                        mapsizeMm: [270, 190]
                    },
                    p: {
                        mapsizePx: [700, 1000],
                        mapsizeMm: [190, 270]
                    }
                }
            }*/
        },
        scales: [250, 500, 1000, 2000, 3000, 4000, 5000, 7500, 10000, 15000, 25000, 50000, 100000] // which scales are available
    },
    search: { // Search setup
      danish : {
          komkode: "147"
      }
    },
    extensions: {
        browser: [],
        server: []
    },
    template: "default.tmpl",
    brandName: "MapCentia"
};