/*global module*/
module.exports = function (grunt) {
  'use strict';

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      tests: {
        src: ['<%= pkg.main %>']
      }
    },

    uglify: {
      options: {
        sourceMap: true,
        preserveComments: 'some'
      },

      build: {
        src : '<%= pkg.main %>',
        dest: '<%= pkg.name %>.min.js'
      }
    },

    casper: {
      tests : {
        options: {
          test: true
        },
        src: ['tests/test.js']
      }
    },

    connect: {
      options: {
        hostname: 'localhost'
      },

      basic : {
        options: {
          livereload: true
        }
      },

      server: {
        options : {
          keepalive : true
        }
      }
    },

    watch: {
      options: {
        livereload: true
      },
      js: {
        files: ['<%= pkg.main %>'],
        tasks: ['test']
      }
    }
  });

  // Load build-in tasks
  grunt.loadNpmTasks('grunt-casper');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Customs tasks
  grunt.registerTask('test',  [/*'casper:tests', */'jshint:tests']);
  grunt.registerTask('build', ['connect:basic', 'test', 'uglify:build']);
  grunt.registerTask('live',  ['connect:basic', 'watch']);

  // Default task(s).
  grunt.registerTask('default', ['build']);
};
