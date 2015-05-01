module.exports = function(grunt){
  grunt.initConfig({

    pkg: grunt.file.read('package.json'),

    concat: {},

    mochaTest: {
      test: {
        options: {},
        src: []
      }
    },

    nodemon: {
      dev: {
        script: 'server.js'
      }
    },

    uglify: {},

    jshint: {
      files: [],
      options: {
        force: 'true',
        jshintsrc: '.jshintrc',
        ignored: []
      }
    },

    cssmin: {},

    watch: {
      scripts: {
        files: [],
        tasks: []
      },
      css: {
        files: ,
        tasks:[]
      }
    },

    shell: {
      prodServer: {

      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-nodemon');

  grunt.registerTask('')

}