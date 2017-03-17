module.exports = function (grunt) {
    "use strict";
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
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
                    "public/js/templates.js": ["public/templates/**/*.tmpl"]
                }
            }
        },
        browserify: {
            publish: {
                files: {
                    'public/js/bundle.js': ['browser/index.js']
                },
                options: {
                    transform: ["reactify", 'require-globify']
                }
            }
        },
        uglify: {
            publish: {
                files: {
                    'public/js/build/all.min.js': [
                        'public/bower_components/leaflet-measure/dist/leaflet-measure.js',
                        'public/bower_components/jquery/dist/jquery.min.js',
                        'public/bower_components/typeahead.js/dist/typeahead.jquery.min.js',
                        'public/bower_components/hogan.js/web/builds/3.0.2/hogan-3.0.2.js',
                        'public/bower_components/bootstrap-table/dist/bootstrap-table.js',
                        'public/bower_components/bootstrap-table/dist/bootstrap-table-locale-all.min.js',
                        'public/bower_components/bootstrap-table/dist/extensions/export/bootstrap-table-export.min.js',
                        'public/bower_components/tableExport.jquery.plugin/tableExport.min.js',
                        'public/bower_components/bootstrap-material-design/dist/js/ripples.js',
                        'public/bower_components/bootstrap-material-design/dist/js/material.js',
                        'public/js/jasny-bootstrap.min.js',
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
                assets: ['js/**/*','css/**/*'],
                queryString: true,
                baseDir: './public/',
                jsonOutput: false
            },
            production: {
                files: [{
                    expand: true,
                    cwd: 'public/',
                    src: ['index.html']
                }]
            }
        },
        babel: {
            options: {
                sourceMap: true,
                compact: false
            },
            dist: {
                files: {
                    "public/js/bundle.babelified.js": "public/js/bundle.js"
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


    grunt.registerTask('default', ['browserify', 'less', 'hogan', 'shell']);
    grunt.registerTask('production', ['gitreset', 'gitpull', 'browserify', 'less', 'hogan', 'shell', 'uglify', 'processhtml', 'cssmin', 'cacheBust']);
};




