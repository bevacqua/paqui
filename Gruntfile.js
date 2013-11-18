'use strict';

module.exports = function (grunt) {
    grunt.initConfig({
        jshint: {
            all: {
                options: {
                    jshintrc: '.jshintrc',
                    reporter: require('jshint-stylish')
                },
                files: {
                    src: ['Gruntfile.js', 'src/**/*.js']
                }
            }
        }
    });

    require('load-grunt-tasks')(grunt);
};
