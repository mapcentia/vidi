module.exports = function(grunt) {

    // 1. All configuration goes here 
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

    		uglify: {
    			  options: {
    		        report: 'min',
    		        sourceMap: 'lib/q-cluster.map.js',
    		        sourceMapPrefix: 1,
    		        sourceMappingURL: 'q-cluster.map.js'
    		    },
    		    build: {
    		        src: [
                        'src/clustering.js', 'src/point-clusterer.js', 'src/make-donuts.js', 'src/utils.js'
    		        ],
    		        dest: 'lib/q-cluster.min.js'
    		    }
    		},

        concat: {

            dist: {
              src: ['src/utils.js', 'src/clustering.js', 'src/point-clusterer.js', 'src/make-donuts.js'],
              dest: 'lib/q-cluster.js'
            }
        },

        watch: {
          files: ['src/*', 'css/*', 'demo/index.html'],
          tasks: ['concat', 'uglify']
        }
		
    });

    
    // 3. Where we tell Grunt we plan to use this plug-in.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');
    
    // 4. Where we tell Grunt what to do when we type "grunt" into the terminal.
    grunt.registerTask('default', ['uglify', 'concat']);
	
	
};


