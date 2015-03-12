'use strict';

module.exports = function(grunt){

  /* Configure
  ============================ */
  var configs = {

    css_combine_files : [
      'src/main.css',
      'src/normalize.css'],

    js_combine_files : [
      'src/js/vendor/jquery-1.11.2.min.js',
      'src/js/vendor/modernizr-2.8.3.min.js',
      'src/js/main.js'],

    js_hint_files : [
      'src/js/main.js',
      'src/js/controllers/*'],

    watch_files : [
      'src/*',
      'src/js/*',
      'src/js/controllers/*',
      'src/css/*']
  };

  /* Init
  ============================ */
  grunt.initConfig({
    jshint: {
      beforeconcat: configs.js_hint_files
    },
    concat: {
      options: {
        separator: ';',
      },
      dist: {
        src: configs.js_combine_files,
        dest: 'src/js/compiled.js',
      },
    },
    uglify: {
        my_target: {
          files: {
            'dist/js/compiled.min.js' : 'src/js/compiled.js'
          }
        }
    },
    cssmin: {
      combine: {
        files: {
          'dist/css/main.min.css' : configs.css_combine_files
        }
      }
    },
    watch: {
      options: {
        livereload: true
      },
      src: {
        files: configs.watch_files,
        tasks: []
      }
    },
    connect: {
      server: {
        options: {
          port: 3000,
          hostname: 'localhost',
          base: 'src',
          debug: true,
          livereload: true
        }
      }
    }
  });

  // Add plugins
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-connect');

  // Register tasks
  grunt.registerTask('build', ['cssmin','concat','uglify','jshint']);
  grunt.registerTask('default', ['cssmin','concat','uglify','jshint']);
  grunt.registerTask('serve', ['connect','watch']);

  grunt.event.on('watch', function(action, filepath) {
    grunt.log.writeln(filepath + ' has ' + action);
  });

};