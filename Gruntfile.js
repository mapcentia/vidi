/*
 * @author     Martin Høgh <mh@mapcentia.com>
 * @copyright  2013-2018 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

var fs = require('fs');

module.exports = function (grunt) {
    "use strict";

    const lessConfig = {"public/css/styles.css": "public/less/styles.default.less"};
    const transform = [['babelify', {
        presets: ["@babel/preset-env", "@babel/preset-react"],
        plugins: ["@babel/plugin-proposal-class-properties", "@babel/plugin-proposal-object-rest-spread"]
    }], 'require-globify', 'windowify', 'envify', ['browserify-css', {global: true}]];
    const transform_sw = [['babelify', {
        presets: ["@babel/preset-env", "@babel/preset-react"],
        plugins: ["@babel/plugin-proposal-class-properties", "@babel/plugin-proposal-object-rest-spread", "@babel/plugin-proposal-optional-chaining"]
    }], 'require-globify'];
    const browserifyOptions = {
        debug: true,
        fullPaths: true
    };
    const files = {
        'public/js/bundle.js': ['browser/index.js'],
    };
    const files_sw = {
        'public/service-worker.bundle.js': ['browser/service-worker/index.js']
    };

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        env: {
            prod: {
                NODE_ENV: 'production'
            },
            dev: {
                NODE_ENV: 'development'
            }
        },
        version: {
            options: {
                prefix: '"version":"'
            },
            defaults: {
                src: ['public/version.json']
            }
        },
        less: {
            publish: {
                options: {
                    compress: false,
                    optimization: 2
                },
                files: [
                    lessConfig,
                    {
                        expand: true,        // Enable dynamic expansion.
                        cwd: 'extensions',  // Src matches are relative to this path.
                        src: ['**/less/*.less',],     // Actual pattern(s) to match.
                        dest: 'public/css/extensions',  // Destination path prefix.
                        ext: '.css',         // Dest filepaths will have this extension.
                    }
                ]
            }
        },
        cssmin: {
            build: {
                options: {
                    target: "./build",
                    rebase: true,
                },
                files: {
                    'public/css/build/all.min.css': [
                        // Bootstrap icons
                        'node_modules/bootstrap-icons/font/bootstrap-icons.css',
                        'node_modules/@fortawesome/fontawesome-free/css/all.css',
                        // Leaflet
                        'node_modules/leaflet/dist/leaflet.css',
                        'public/js/lib/leaflet-draw/leaflet.draw.css',
                        'public/js/lib/leaflet.locatecontrol/L.Control.Locate.css',
                        'public/js/lib/leaflet.toolbar/leaflet.toolbar.css',
                        'public/js/lib/leaflet-measure-path/leaflet-measure-path.css',
                        'public/js/lib/leaflet-history/leaflet-history.css',
                        'public/js/lib/leaflet-boxzoom/leaflet-boxzoom.css',
                        'public/js/lib/Leaflet.extra-markers/css/leaflet.extra-markers.css',
                        'public/js/lib/Leaflet.awesome-markers/leaflet.awesome-markers.css',
                        'public/js/lib/Leaflet.markercluster/MarkerCluster.css',
                        'public/js/lib/Leaflet.markercluster/MarkerCluster.Default.css',
                        // Bootstrap
                        'node_modules/bootstrap-select/dist/css/bootstrap-select.css',
                        'node_modules/bootstrap-table/dist/bootstrap-table.css',
                        'scss/main.css',
                        //custom
                        'public/css/styles.min.css'
                    ]
                }
            },
            extensions: {
                options: {
                    target: "./build",
                    rebase: true
                },
                files: {
                    'public/css/styles.min.css': [
                        'public/css/styles.css',
                        'public/css/extensions/**/less/*.css'
                    ]
                }
            }

        },
        jshint: {
            options: {
                funcscope: true,
                shadow: true,
                evil: true,
                validthis: true,
                asi: true,
                newcap: false,
                notypeof: false,
                eqeqeq: false,
                loopfunc: true,
                es3: true,
                devel: false,
                eqnull: true
            },
            all: ['public/js/*.js']
        },
        hogan: {
            publish: {
                options: {
                    defaultName: function (filename) {
                        return filename.split('/').pop();
                    }
                },
                files: {
                    "public/js/templates.js": [
                        "public/templates/**/*.tmpl",
                        "extensions/**/templates/*.tmpl"
                    ]
                }
            }
        },
        handlebars: {
            publish: {
                options: {
                    namespace: function (filename) {
                        var names = filename.replace(/modules\/(.*)(\/\w+\.hbs)/, '$1');
                        return names.split('/').join('.');
                    },
                    commonjs: true
                },
                files: {
                    "public/js/handlebars_templates.js": [
                        "extensions/**/templates/*.hbs"
                    ]
                }
            }
        },
        browserify: {
            publish: {
                files,
                options: {
                    transform,
                    alias: {
                        react: 'react/cjs/react.production.min.js',
                        'react-dom': 'react-dom/cjs/react-dom.production.min.js'
                    }
                }
            },
            debug: {
                files,
                options: {
                    browserifyOptions,
                    transform
                }
            },
            publish_sw: {
                files: files_sw,
                options: {
                    alias: {
                        'urls-to-cache': './browser/service-worker/cache.production.js'
                    },
                    transform: transform_sw
                }
            },
            publish_sw_dev: {
                files: files_sw,
                options: {
                    alias: {
                        'urls-to-cache': './browser/service-worker/cache.development.js'
                    },
                    transform: transform_sw
                }
            },
            watch: {
                files,
                options: {
                    browserifyOptions,
                    transform,
                    watch: true,
                    keepAlive: true,

                }
            }
        },
        watch: {
            reload: {
                files: ['public/js/bundle.js', 'public/js/templates.js', 'public/css/build/all.min.css'],
                options: {
                    livereload: true,
                },
            },
            hogan: {
                files: [
                    'public/templates/**/*.tmpl',
                    'extensions/**/templates/*.tmpl'
                ],
                tasks: 'hogan'
            },
            css: {
                files: ['scss/styles.scss'],
                tasks: 'css'
            }
        },
        terser: {
            publish: {
                options: {
                    sourceMap: true,
                    mangle: true,
                    compress: {
                        dead_code: false,
                        drop_debugger: false,
                        global_defs: {
                            "DEBUG": false
                        },
                    }
                },
                files: {
                    'public/js/build/all.min.js': [
                        'node_modules/leaflet/dist/leaflet-src.js',
                        'node_modules/proj4/dist/proj4.js',
                        'node_modules/proj4leaflet/src/proj4leaflet.js',
                        'public/js/bundle.js',
                    ],
                    'public/js/build/libs.min.js': [
                        'public/js/lib/localforage/localforage.js',
                        'public/js/lib/leaflet-history/leaflet-history.js',
                        'public/js/lib/leaflet-boxzoom/leaflet-boxzoom.js',
                        'public/js/lib/leaflet-draw/leaflet.draw.js',
                        'public/js/lib/leaflet.locatecontrol/L.Control.Locate.js',
                        'public/js/lib/Leaflet.utfgrid/L.NonTiledUTFGrid.js',
                        'public/js/lib/leaflet-plugins/Bing.js',
                        'public/js/lib/Leaflet.GridLayer.GoogleMutant/Leaflet.GoogleMutant.js',
                        'public/js/lib/Leaflet.NonTiledLayer/NonTiledLayer.js',
                        'public/js/lib/leaflet-vector-grid/Leaflet.VectorGrid.bundled.min.js',
                        'public/js/lib/Leaflet.markercluster/leaflet.markercluster.js',
                        'public/js/lib/Leaflet.extra-markers/leaflet.extra-markers.js',
                        'public/js/lib/Leaflet.awesome-markers/leaflet.awesome-markers.js',
                        'public/js/lib/leaflet-simple-map-screenshoter/dist/leaflet-simple-map-screenshoter.js',
                        'public/js/lib/leaflet.tilelayer.wmts/leaflet.tilelayer.wmts.src.js',

                        'public/js/lib/jquery.canvasResize.js/jquery.canvasResize.js',
                        'public/js/lib/jquery.canvasResize.js/jquery.exif.js',
                        'public/js/lib/leaflet-snap/leaflet.snap.js',
                        'public/js/lib/leaflet-measure-path/leaflet-measure-path.js',
                        'public/js/lib/leaflet.editable/Leaflet.Editable.js',
                        'public/js/lib/leaflet-geometryutil/leaflet.geometryutil.js',
                        'public/js/lib/Path.Drag.js/src/Path.Drag.js',
                        'public/js/lib/leaflet-side-by-side/leaflet-side-by-side.min.js',

                        'node_modules/jquery-ui/dist/jquery-ui.js',
                        'node_modules/jquery-ui-touch-punch-c/jquery.ui.touch-punch.js',
                        'node_modules/handlebars/dist/handlebars.js',

                        'public/js/lib/leaflet-dash-flow/L.Path.DashFlow.js',

                        'public/js/lib/typeahead.js/typeahead.jquery.js',
                        'node_modules/bootstrap/dist/js/bootstrap.bundle.js',

                        'node_modules/leaflet.glify/dist/glify-browser.js',
                        'node_modules/maplibre-gl/dist/maplibre-gl.js',
                        'node_modules/@maplibre/maplibre-gl-leaflet/leaflet-maplibre-gl.js',
                        'node_modules/bootstrap-table/dist/bootstrap-table.js',
                        'node_modules/bootstrap-table/dist/bootstrap-table-locale-all.js',
                        'node_modules/bootstrap-table/dist/extensions/export/bootstrap-table-export.js',

                        'public/js/lib/tableExport.jquery.plugin/tableExport.js',

                    ]
                }
            }
        },
        processhtml: {
            publish: {
                files: {
                    'public/index.html': ['public/index.html']
                }
            }
        },
        shell: {
            buildDocs: {
                command: '. ./venv/bin/activate && sphinx-build ./docs ./docs/_build/html/da'
            },
            gettext: {
                command: '. ./venv/bin/activate && sphinx-build ./docs -b gettext ./docs/_build/gettext'
            },
            updateEn: {
                command: '. ./venv/bin/activate && cd ./docs && sphinx-intl update -p _build/gettext -l en'
            },
            buildEn: {
                command: '. ./venv/bin/activate && sphinx-build -b html -D language=en ./docs ./docs/_build/html/en'
            }
        },
        cacheBust: {
            options: {
                assets: ['js/build/all.min.js', 'js/build/libs.min.js', 'css/build/all.min.css', 'js/templates.js'],
                queryString: false,
                baseDir: './public/',
                jsonOutput: false,
                deleteOriginals: false
            },
            production: {
                files: [{
                    expand: true,
                    cwd: 'public/',
                    src: ['index.html']
                }]
            }
        },
        sass: {
            dist: {                            // Target
                options: {                       // Target options
                    style: 'expanded'
                },
                files: {
                    'scss/main.css': 'scss/main.scss'       // 'destination': 'source'
                }
            }
        }
    });

    grunt.registerTask('prepareAssets', 'Updates assets if specific modules are enabled', function () {
        fs.createReadStream('./public/index.html.default').pipe(fs.createWriteStream('./public/index.html'));
        fs.createReadStream('./public/favicon.ico.default').pipe(fs.createWriteStream('./public/favicon.ico'));
    });

    grunt.registerTask('appendBuildHashToVersion', 'Appends the build hash to the application version', function () {
        var crypto = require('crypto');
        var md5 = crypto.createHash('md5');

        var jsSource = grunt.file.expand({filter: "isFile", cwd: "public/js/build"}, ["all.min.js"]);
        var cssSource = grunt.file.expand({filter: "isFile", cwd: "public/css/build"}, ["all.min.css"]);
        if (jsSource.length !== 1 || cssSource.length !== 1) {
            throw new Error(`Unable to find all.min.*.js[css] sources`);
        }

        var buffer = grunt.file.read('public/js/build/' + jsSource[0]) + grunt.file.read('public/css/build/' + cssSource[0]);
        md5.update(buffer);
        var md5Hash = md5.digest('hex');
        var versionJSON = grunt.file.readJSON('public/version.json');
        versionJSON.extensionsBuild = md5Hash;
        grunt.file.write('public/version.json', JSON.stringify(versionJSON));
        grunt.log.write('Extensions build version was written ' + md5Hash).verbose.write('...').ok();
    });

    grunt.loadNpmTasks('grunt-templates-hogan');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-terser');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-processhtml');
    grunt.loadNpmTasks('grunt-cache-bust');
    grunt.loadNpmTasks('grunt-env');
    grunt.loadNpmTasks('grunt-contrib-handlebars');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-version');
    grunt.loadNpmTasks('grunt-contrib-sass');


    grunt.registerTask('default', ['prepareAssets', 'browserify:publish', 'browserify:publish_sw_dev', 'css', 'hogan', 'version']);
    grunt.registerTask('production', ['env:prod', 'hogan', 'prepareAssets', 'browserify:publish', 'browserify:publish_sw', 'css', 'terser', 'processhtml', 'cssmin:build', 'cacheBust', 'version', 'appendBuildHashToVersion']);
    grunt.registerTask('production-test', ['env:prod', 'browserify:publish']);
    grunt.registerTask('css', ['less', 'sass', 'cssmin']);
};
