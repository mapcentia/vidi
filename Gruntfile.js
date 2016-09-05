module.exports = function (grunt) {
    "use strict";
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
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
                    "public/js/templates.js": ["public/templates/*"]
                }
            }
        },
        browserify: {
            publish: {
                files: {
                    'public/js/bundle.js': ['browser/index.js']
                },
                options: {
                    transform: ['require-globify']
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
        }
    });
    grunt.loadNpmTasks('grunt-templates-hogan');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-git');
    grunt.loadNpmTasks('grunt-shell');

    grunt.registerTask('default', ['browserify', 'hogan', 'shell']);
    grunt.registerTask('production', ['gitreset', 'gitpull', 'shell']);
};




