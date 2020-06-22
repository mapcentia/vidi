/*
 * @author     Martin Høgh <mh@mapcentia.com>
 * @copyright  2013-2018 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

var fs = require('fs');

module.exports = function (grunt) {
    "use strict";

    // Detecting optional theme
    let theme = false;
    process.argv.forEach(val => {
        if (val.indexOf(`--theme=`) !== -1) {
            theme = val.replace(`--theme=`, ``);
        }
    });

    // Default build parameters
    let copyBootstrapVariablesCommand = 'cp ./config/_variables.less ./public/js/lib/bootstrap-material-design/less';
    let lessConfig = {"public/css/styles.css": "public/less/styles.default.less"};
    if (theme && theme === 'watsonc') {
        copyBootstrapVariablesCommand = 'cp ./extensions/' + theme + '/config/_variables.less ./public/js/lib/bootstrap-material-design/less';
        lessConfig = {"public/css/styles.css": "public/less/styles." + theme + ".less"};
    }

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        env: {
            prod: {
                NODE_ENV: 'production'
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
                    rebase: true
                },
                files: {
                    'public/css/build/all.min.css': [
                        // Material Design fonts
                        'public/fonts/fonts.css',
                        'public/icons/material-icons.css',
                        // jQuery UI
                        'public/js/lib/jquery-ui/jquery-ui.min.css',
                        // Font Awesome
                        'public/css/font-awesome.min.css',
                        'public/css/font-awesome.v520.solid.css',
                        'public/css/font-awesome.v520.regular.css',
                        'public/css/font-awesome.v520.css',
                        // Leaflet
                        'public/js/lib/leaflet/leaflet.css',
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
                        'public/js/lib/bootstrap/dist/css/bootstrap.css',
                        'public/js/lib/snackbarjs/snackbar.min.css',
                        'public/js/lib/bootstrap-material-design/dist/css/ripples.css',
                        'public/js/lib/bootstrap-material-datetimepicker/bootstrap-material-datetimepicker.css',
                        'public/js/lib/bootstrap-select/bootstrap-select.css',
                        'public/js/lib/bootstrap-table/bootstrap-table.css',
                        'public/js/lib/bootstrap-material-design/dist/css/bootstrap-material-design.css',
                        'public/js/lib/bootstrap-colorpicker/css/bootstrap-colorpicker.css',
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
                files: {
                    'public/js/bundle.js': ['browser/index.js'],
                },
                options: {
                    transform: [['babelify', {
                        presets: [['es2015'], ['react'], ['stage-0']],
                        plugins: ["transform-object-rest-spread"]
                    }], 'require-globify', 'windowify', 'envify']
                }
            },
            debug: {
                files: {
                    'public/js/bundle.js': ['browser/index.js'],
                },
                options: {
                    browserifyOptions: {
                        debug: true,
                        fullPaths: true
                    },
                    transform: [['babelify', {
                        presets: [['es2015'], ['react'], ['stage-0']],
                        plugins: ["transform-object-rest-spread"]
                    }], 'require-globify', 'windowify', 'envify']
                }
            },
            publish_sw: {
                files: {
                    'public/service-worker.bundle.js': ['browser/service-worker/index.js']
                },
                options: {
                    alias: {
                        'urls-to-cache': './browser/service-worker/cache.production.js'
                    },
                    transform: [['babelify', {
                        presets: [['es2015'], ['react'], ['stage-0']],
                        plugins: ["transform-object-rest-spread"]
                    }], 'require-globify']
                }
            },
            publish_sw_dev: {
                files: {
                    'public/service-worker.bundle.js': ['browser/service-worker/index.js']
                },
                options: {
                    alias: {
                        'urls-to-cache': './browser/service-worker/cache.development.js'
                    },
                    transform: [['babelify', {
                        presets: [['es2015'], ['react'], ['stage-0']],
                        plugins: ["transform-object-rest-spread"]
                    }], 'require-globify']
                }
            },
            watch: {
                files: {
                    'public/js/bundle.js': ['browser/index.js']
                },
                options: {
                    browserifyOptions: {
                        debug: true,
                        fullPaths: true
                    },
                    transform: [['babelify', {
                        presets: [['es2015'], ['react'], ['stage-0']],
                        plugins: ["transform-object-rest-spread"]
                    }], 'require-globify', 'windowify'],
                    watch: true,
                    keepAlive: true
                }
            }
        },
        uglify: {
            publish: {
                options: {
                    sourceMap: true,
                    sourceMapIncludeSources: true,
                    compress: {
                        dead_code: true,
                        drop_debugger: true,
                        global_defs: {
                            "DEBUG": true
                        },
                    }
                },
                files: {
                    'public/js/build/all.min.js': [
                        'public/js/lib/leaflet/leaflet-src.js',
                        'public/js/lib/leaflet-history/leaflet-history.js',
                        'public/js/lib/leaflet-boxzoom/leaflet-boxzoom.js',
                        'public/js/lib/leaflet-draw/leaflet.draw.js',
                        'public/js/lib/leaflet.locatecontrol/L.Control.Locate.js',
                        'public/js/lib/Leaflet.utfgrid/L.UTFGrid.js',
                        'public/js/lib/leaflet-plugins/Bing.js',
                        'public/js/lib/Leaflet.GridLayer.GoogleMutant/Leaflet.GoogleMutant.js',
                        'public/js/lib/Leaflet.NonTiledLayer/NonTiledLayer.js',
                        //'public/js/lib/leaflet-glify/glify.js',
                        'public/js/lib/leaflet-vector-grid/Leaflet.VectorGrid.bundled.min.js',
                        'public/js/lib/Leaflet.extra-markers/leaflet.extra-markers.js',
                        'public/js/lib/Leaflet.awesome-markers/leaflet.awesome-markers.js',
                        'public/js/lib/Leaflet.markercluster/leaflet.markercluster.js',

                        'public/js/lib/localforage/localforage.js',

                        'public/js/lib/jquery/jquery-3.4.1.min.js',
                        'public/js/lib/underscore/underscore.js',
                        'public/js/lib/backbone/backbone.js',

                        'public/js/lib/typeahead.js/typeahead.jquery.js',
                        'public/js/lib/bootstrap-material-design/dist/js/ripples.js',
                        'public/js/lib/bootstrap-material-design/dist/js/material.js',
                        'public/js/lib/bootstrap-colorpicker/js/bootstrap-colorpicker.js',
                        'public/js/lib/bootstrap-table/bootstrap-table.js',
                        'public/js/lib/bootstrap-table/bootstrap-table-locale-all.js',
                        'public/js/lib/bootstrap-table/extensions/export/bootstrap-table-export.js',
                        'public/js/lib/bootstrap-table/extensions/filter-control/bootstrap-table-filter-control.js',
                        'public/js/lib/tableExport.jquery.plugin/tableExport.js',

                        'public/js/bundle.js',
                    ],
                    'public/js/build/all.async.min.js': [
                        'public/js/lib/jquery.canvasResize.js/jquery.canvasResize.js',
                        'public/js/lib/jquery.canvasResize.js/jquery.exif.js',
                        'public/js/lib/leaflet-snap/leaflet.snap.js',
                        'public/js/lib/leaflet-measure-path/leaflet-measure-path.js',
                        'public/js/lib/leaflet.editable/Leaflet.Editable.js',
                        'public/js/lib/leaflet-geometryutil/leaflet.geometryutil.js',
                        'public/js/lib/Path.Drag.js/src/Path.Drag.js',
                        'public/js/lib/leaflet-side-by-side/leaflet-side-by-side.min.js',
                        'public/js/lib/jquery-ui/jquery-ui.min.js',
                        'public/js/lib/jquery-ui-touch/jquery.ui.touch-punch.min.js',
                        'public/js/lib/snackbarjs/snackbar.min.js',
                        'public/js/lib/jsts/jsts.min.js',
                        'public/js/lib/leaflet-dash-flow/L.Path.DashFlow.js',
                        'public/js/lib/handlebars/handlebars.js'
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
        gitpull: {
            production: {
                options: {}
            }
        },
        gitreset: {
            production: {
                options: {
                    mode: 'hard'
                }
            }
        },
        shell: {
            default: {
                command: [
                    copyBootstrapVariablesCommand,
                    'grunt --gruntfile ./public/js/lib/bootstrap-material-design/Gruntfile.js dist-less'
                ].join('&&')
            }
        },
        cacheBust: {
            options: {
                assets: ['js/build/all.min.js', 'js/build/all.async.min.js', 'css/build/all.min.css', 'js/templates.js'],
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
        bower: {
            install: {
                //just run 'grunt bower:install' and you'll see files from your Bower packages in lib directory
                options: {
                    targetDir: "./public/js/lib",
                    copy: true,
                    install: true,
                    cleanTargetDir: false,
                    verbose: true,
                }
            }
        }
    });

    grunt.registerTask('prepareAssets', 'Updates assets if specific modules are enabled', function () {
        if (theme && theme === 'watsonc') {
            fs.createReadStream('./extensions/watsonc/public/index.html').pipe(fs.createWriteStream('./public/index.html'));
            fs.createReadStream('./extensions/watsonc/public/favicon.ico').pipe(fs.createWriteStream('./public/favicon.ico'));
        } else {
            fs.createReadStream('./public/index.html.default').pipe(fs.createWriteStream('./public/index.html'));
            fs.createReadStream('./public/favicon.ico.default').pipe(fs.createWriteStream('./public/favicon.ico'));
        }
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
    grunt.loadNpmTasks('grunt-git');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-uglify-es');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-processhtml');
    grunt.loadNpmTasks('grunt-cache-bust');
    grunt.loadNpmTasks('grunt-env');
    grunt.loadNpmTasks('grunt-contrib-handlebars');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-bower-task');
    grunt.loadNpmTasks('grunt-watchify');
    grunt.loadNpmTasks('grunt-version');

    grunt.registerTask('default', ['prepareAssets', 'browserify:publish', 'browserify:publish_sw_dev', 'extension-css', 'shell', 'hogan', 'version']);
    grunt.registerTask('production', ['env:prod', 'gitreset', 'hogan', 'prepareAssets', 'browserify:publish', 'browserify:publish_sw', 'extension-css', 'shell', 'uglify', 'processhtml', 'cssmin:build', 'cacheBust', 'version', 'appendBuildHashToVersion']);
    grunt.registerTask('production-test', ['env:prod', 'hogan', 'browserify:publish', 'browserify:publish_sw', 'extension-css', 'shell', 'uglify', 'processhtml', 'cssmin:build', 'cacheBust', 'version', 'appendBuildHashToVersion']);
    grunt.registerTask('extension-css', ['less', 'cssmin:extensions']);
};
