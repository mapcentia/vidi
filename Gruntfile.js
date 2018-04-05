/**
 * Watching for file changes during development.
 */
let watch = false;
if (process.argv.indexOf('--watch') !== -1) {
    watch = true;
}

module.exports = function (grunt) {
    "use strict";
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        env: {
            prod: {
                NODE_ENV: 'production'
            }
        },
        less: {
            publish: {
                options: {
                    compress: false,
                    optimization: 2
                },
                files: {
                    "public/css/styles.css": "public/less/styles.less" // destination file and source file
                }
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
                        // Leaflet
                        'public/js/lib/leaflet/leaflet.css',
                        'public/js/lib/leaflet-draw/leaflet.draw.css',
                        'public/js/lib/leaflet.locatecontrol/L.Control.Locate.css',
                        'public/js/lib/leaflet.toolbar/leaflet.toolbar.css',
                        'public/js/lib/leaflet-measure-path/leaflet-measure-path.css',
                        'public/js/lib/leaflet-measure/leaflet-measure.css',
                        'public/js/lib/Leaflet.extra-markers/leaflet.extra-markers.css',
                        'public/js/lib/Leaflet.awesome-markers/leaflet.awesome-markers.css',
                        'public/js/lib/q-cluster/css/q-cluster.css',
                        // Bootstrap
                        'public/js/lib/bootstrap/dist/css/bootstrap.css',
                        'public/js/lib/snackbarjs/snackbar.min.css',
                        'public/js/lib/bootstrap-material-design/dist/css/ripples.css',
                        'public/js/lib/bootstrap-material-datetimepicker/bootstrap-material-datetimepicker.css',
                        'public/js/lib/bootstrap-select/bootstrap-select.css',
                        'public/js/lib/bootstrap-table/bootstrap-table.css',
                        'public/js/lib/bootstrap-material-design/dist/css/bootstrap-material-design.css',
                        'public/js/lib/bootstrap-colorpicker/css/bootstrap-colorpicker.css',
                        'public/css/jasny-bootstrap.css',
                        //custon
                        'public/css/styles.css'
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
                    'public/service-worker.bundle.js': ['browser/service-worker/index.js']
                },
                options: {
                    watch: watch,
                    keepAlive: watch,
                    //transform: ['reactify', 'require-globify']
                    transform: [['babelify', {presets: [['es2015'], ['react']]}], 'require-globify']
                }
            },
            watch: {
                files: {
                    'public/js/bundle.js': ['browser/index.js']
                },
                options: {
                    transform: [['babelify', {presets: [['es2015'], ['react']]}], 'require-globify'],
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
                        sequences: true,
                        dead_code: true,
                        conditionals: true,
                        booleans: true,
                        unused: true,
                        if_return: true,
                        join_vars: true,
                        drop_console: false
                    }
                },
                files: {
                    'public/js/build/all.min.js': [
                        'public/js/lib/leaflet/leaflet-src.js',
                        'public/js/lib/leaflet-draw/leaflet.draw.js',
                        'public/js/lib/Path.Drag.js/src/Path.Drag.js',
                        'public/js/lib/leaflet.editable/Leaflet.Editable.js',
                        'public/js/lib/leaflet.locatecontrol/L.Control.Locate.js',
                        'public/js/lib/leaflet.toolbar/leaflet.toolbar.js',
                        'public/js/lib/leaflet-measure-path/leaflet-measure-path.js',
                        'public/js/lib/leaflet-measure/leaflet-measure.min.js',
                        'public/js/lib/Leaflet.utfgrid/leaflet.utfgrid.js',
                        'public/js/lib/Leaflet.extra-markers/leaflet.extra-markers.js',
                        'public/js/lib/leaflet-plugins/Yandex.js',
                        'public/js/lib/leaflet-plugins/Bing.js',
                        'public/js/lib/Leaflet.GridLayer.GoogleMutant/Leaflet.GoogleMutant.js',
                        'public/js/lib/q-cluster/src/utils.js',
                        'public/js/lib/q-cluster/src/clustering.js',
                        'public/js/point-clusterer.js',
                        'public/js/lib/Leaflet.awesome-markers/leaflet.awesome-markers.js',

                        'public/js/lib/es5-shim/es5-shim.js',
                        'public/js/lib/es6-shim/es6-shim.js',
                        'public/js/lib/jquery/jquery.js',
                        'public/js/lib/jrespond/jRespond.js',
                        'public/js/lib/mustache.js/mustache.js',
                        'public/js/lib/underscore/underscore.js',
                        //'public/js/lib/raphael/raphael.min.js',
                        'public/js/lib/backbone/backbone.js',
                        'public/js/lib/momentjs/moment-with-locales.js',
                        'public/js/lib/d3/d3.js',

                        'public/js/lib/typeahead.js/typeahead.jquery.js',
                        'public/js/lib/bootstrap-table/bootstrap-table.js',
                        'public/js/lib/bootstrap-table/bootstrap-table-locale-all.js',
                        'public/js/lib/bootstrap-table/extensions/export/bootstrap-table-export.min.js',
                        'public/js/lib/bootstrap-table/extensions/filter-control/bootstrap-table-filter-control.min.js',
                        'public/js/lib/tableExport.jquery.plugin/tableExport.js',
                        'public/js/lib/bootstrap-material-design/dist/js/ripples.js',
                        'public/js/lib/bootstrap-material-design/dist/js/material.js',
                        'public/js/lib/bootstrap-material-datetimepicker/bootstrap-material-datetimepicker.js',
                        'public/js/lib/bootstrap-select/bootstrap-select.js',
                        'public/js/lib/bootstrap-colorpicker/js/bootstrap-colorpicker.js',

                        'public/js/proj4js-combined.js',
                        'public/js/jasny-bootstrap.js',
                        'public/js/bundle.js',
                        'public/js/vidi.js',
                        'public/js/gc2/geocloud.js',
                        'public/js/gc2/gc2table.js'

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
                    'cp ./config/_variables.less ./public/js/lib/bootstrap-material-design/less',
                    'grunt --gruntfile ./public/js/lib/bootstrap-material-design/Gruntfile.js dist-less'
                    ].join('&&')
            }
        },
        cacheBust: {
            options: {
                assets: ['js/build/all.min.js', 'css/build/all.min.css'],
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
    grunt.loadNpmTasks('grunt-templates-hogan');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-git');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-processhtml');
    grunt.loadNpmTasks('grunt-cache-bust');
    grunt.loadNpmTasks('grunt-env');
    grunt.loadNpmTasks('grunt-contrib-handlebars');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-bower-task');
    grunt.loadNpmTasks('grunt-watchify');
    grunt.registerTask('default', ['browserify', 'less', 'hogan', 'shell']);
    grunt.registerTask('production', ['env', 'gitreset', 'gitpull', 'browserify', 'less', 'hogan', 'shell', 'uglify', 'processhtml', 'cssmin', 'cacheBust']);
};




