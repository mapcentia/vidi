'use strict';

module.exports = gruntConfig;


function gruntConfig(grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);


  grunt.initConfig({

    watch: {
      sources: {
        files: ['src/*'],
        tasks: ['concat:sources', 'uglify:dist']
      }
    },


    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc'
        //reporter: require('jshint-stylish')
      },
      all: {
        src: [
          'Gruntfile.js',
          'src/*.js'
        ]
      },
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/spec/{,*/}*.js']
      }
    },


    concat: {
      options: {
        separator: '\n'
      },
      sources: {
        src: [
          'src/header.txt',
          'src/handle-ie.js',
          'src/save-as.js',
          'src/file-saver.js',
          'src/file-system-saver.js',
          'src/utils.js',
          'src/footer.txt'
        ],
        dest: 'FileSaver.js'
      }
    },


    uglify: {
      options: {
        banner: '',
        footer: '',
        beautify: false,
        mangle: false,
        compress: false,
        quoteStyle: 1
      },
      dist: {
        files: {
          'FileSaver.min.js' : [ 'FileSaver.js' ]
        }
      }
    }

  });

  grunt.registerTask('default', ['build']);

  grunt.registerTask('build', ['concat', 'uglify']);

}
