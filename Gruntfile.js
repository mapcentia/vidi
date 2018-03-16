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
                        'public/bower_components/leaflet/dist/leaflet.css',
                        'public/bower_components/leaflet-draw/dist/leaflet.draw.css',
                        'public/bower_components/leaflet.locatecontrol/dist/L.Control.Locate.css',
                        'public/bower_components/leaflet.toolbar/dist/leaflet.toolbar.css',
                        'public/bower_components/leaflet-measure-path/leaflet-measure-path.css',
                        'public/bower_components/leaflet-measure/dist/leaflet-measure.css',
                        'public/bower_components/Leaflet.extra-markers/dist/css/leaflet.extra-markers.min.css',
                        'public/bower_components/Leaflet.awesome-markers/dist/leaflet.awesome-markers.css',
                        'public/bower_components/q-cluster/css/q-cluster.css',
                        // Bootstrap
                        'public/bower_components/bootstrap/dist/css/bootstrap.css',
                        'public/bower_components/snackbarjs/dist/snackbar.css',
                        'public/bower_components/bower_components/bootstrap-material-design/dist/css/ripples.css',
                        'public/bower_components/bootstrap-material-design/dist/css/ripples.css',
                        'public/bower_components/bootstrap-material-datetimepicker/css/bootstrap-material-datetimepicker.css',
                        'public/bower_components/bootstrap-table/dist/bootstrap-table.css',
                        'public/bower_components/bootstrap-material-design/dist/css/bootstrap-material-design.css',
                        'public/bower_components/bootstrap-colorpicker/dist/css/bootstrap-colorpicker.css',
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
                    namespace: function(filename) {
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
                    //transform: ['reactify', 'require-globify']
                    transform: [['babelify', {presets: [['es2015'], ['react']]}], 'require-globify']

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
                        'public/bower_components/leaflet/dist/leaflet-src.js',
                        'public/bower_components/leaflet-draw/dist/leaflet.draw-src.js',
                        'public/bower_components/Path.Drag.js/src/Path.Drag.js',
                        'public/bower_components/leaflet.editable/src/Leaflet.Editable.js',
                        'public/bower_components/leaflet.locatecontrol/dist/L.Control.Locate.min.js',
                        'public/bower_components/leaflet.toolbar/dist/leaflet.toolbar-src.js',
                        'public/bower_components/leaflet-measure-path/leaflet-measure-path.js',
                        'public/bower_components/leaflet-measure/dist/leaflet-measure.js',
                        'public/bower_components/Leaflet.utfgrid/dist/leaflet.utfgrid-src.js',
                        'public/bower_components/Leaflet.extra-markers/dist/js/leaflet.extra-markers.min.js',
                        'public/bower_components/leaflet-plugins/layer/tile/Yandex.js',
                        'public/bower_components/leaflet-plugins/layer/tile/Bing.js',
                        'public/bower_components/Leaflet.GridLayer.GoogleMutant/Leaflet.GoogleMutant.js',
                        'public/bower_components/q-cluster/src/utils.js',
                        'public/bower_components/q-cluster/src/clustering.js',
                        'public/js/point-clusterer.js',
                        'public/bower_components/Leaflet.awesome-markers/dist/leaflet.awesome-markers.js',

                        'public/bower_components/es5-shim/es5-shim.js',
                        'public/bower_components/jquery/dist/jquery.js',
                        'public/bower_components/jrespond/js/jRespond.js',
                        'public/bower_components/mustache.js/mustache.js',
                        'public/bower_components/underscore/underscore.js',
                        //'public/bower_components/raphael/raphael.js',
                        'public/bower_components/backbone/backbone.js',
                        'public/bower_components/momentjs/min/moment-with-locales.js',
                        'public/bower_components/d3/d3.js',

                        'public/bower_components/typeahead.js/dist/typeahead.jquery.js',
                        'public/bower_components/bootstrap-table/dist/bootstrap-table.js',
                        'public/bower_components/bootstrap-table/dist/bootstrap-table-locale-all.js',
                        'public/bower_components/bootstrap-table/dist/extensions/export/bootstrap-table-export.js',
                        'public/bower_components/bootstrap-table/dist/extensions/filter-control/bootstrap-table-filter-control.js',
                        'public/bower_components/tableExport.jquery.plugin/tableExport.js',
                        'public/bower_components/bootstrap-material-design/dist/js/ripples.js',
                        'public/bower_components/bootstrap-material-design/dist/js/material.js',
                        'public/bower_components/bootstrap-material-datetimepicker/js/bootstrap-material-datetimepicker.js',
                        'public/bower_components/bootstrap-select/js/bootstrap-select.js',
                        'public/bower_components/bootstrap-colorpicker/dist/js/bootstrap-colorpicker.js',

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
                command: 'cp ./config/_variables.less ./public/bower_components/bootstrap-material-design/less'
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


    grunt.registerTask('default', ['browserify', 'less', 'hogan', 'shell']);
    grunt.registerTask('production', ['env', 'gitreset', 'gitpull', 'browserify', 'less', 'hogan', 'shell', 'uglify', 'processhtml', 'cssmin', 'cacheBust']);
};




