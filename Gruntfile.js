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
                files: {
                    'public/css/build/all.min.css': [
                        'public/bower_components/bootstrap/dist/css/bootstrap.min.css',
                        'public/bower_components/snackbarjs/dist/snackbar.min.css',
                        'public/bower_components/bower_components/bootstrap-material-design/dist/css/ripples.min.css',
                        'public/bower_components/bootstrap-material-datetimepicker/css/bootstrap-material-datetimepicker.css',
                        'public/bower_components/bootstrap-table/dist/bootstrap-table.min.css',
                        //'public/bower_components/hyperform/css/hyperform.css',
                        'public/css/jasny-bootstrap.min.css',
                        'public/css/L.Control.Locate.min.css',
                        'public/css/Leaflet.GraphicScale.min.css',
                        'public/css/leaflet.toolbar.css',
                        'public/css/styles.css',
                        'public/css/cartodb.css'
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
        browserify: {
            publish: {
                files: {
                    'public/js/bundle.js': ['browser/index.js']
                },
                options: {
                    //transform: ['reactify', 'require-globify']
                    transform: [['babelify', {presets: [['es2015'], ['react']]}], 'require-globify']

                }
            }
        },
        uglify: {
            publish: {
                files: {
                    'public/js/build/all.min.js': [
                        'public/bower_components/leaflet-measure/dist/leaflet-measure.js',
                        'public/bower_components/Leaflet.utfgrid/dist/leaflet.utfgrid.js',
                        'public/bower_components/jquery/dist/jquery.min.js',
                        'public/bower_components/typeahead.js/dist/typeahead.jquery.min.js',
                        'public/bower_components/hogan.js/web/builds/3.0.2/hogan-3.0.2.js',
                        'public/bower_components/bootstrap-table/dist/bootstrap-table.js',
                        'public/bower_components/bootstrap-table/dist/bootstrap-table-locale-all.min.js',
                        'public/bower_components/bootstrap-table/dist/extensions/export/bootstrap-table-export.min.js',
                        'public/bower_components/bootstrap-table/dist/extensions/filter-control/bootstrap-table-filter-control.min.js',
                        'public/bower_components/tableExport.jquery.plugin/tableExport.min.js',
                        'public/bower_components/bootstrap-material-design/dist/js/ripples.js',
                        'public/bower_components/bootstrap-material-design/dist/js/material.js',
                        'public/bower_components/momentjs/min/moment-with-locales.js',
                        'public/bower_components/bootstrap-material-datetimepicker/js/bootstrap-material-datetimepicker.js',
                        'public/bower_components/bootstrap-colorpicker/dist/js/bootstrap-colorpicker.js',
                        //'public/bower_components/hyperform/dist/hyperform.min.js',
                        'public/js/jasny-bootstrap.js',
                        'public/js/templates.js',
                        'public/js/bundle.js',
                        'public/js/vidi.js'
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


    grunt.registerTask('default', ['browserify', 'less', 'hogan', 'shell']);
    grunt.registerTask('production', ['env', 'gitreset', 'gitpull', 'browserify', 'less', 'hogan', 'shell', 'uglify', 'processhtml', 'cssmin', 'cacheBust']);
};




