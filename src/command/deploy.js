'use strict';

var async = require('async');
var buildCommand = require('./build.js');

module.exports = function (program) {
    // force all versions to the version in rc.
    // minify / concat
    // (create a sourcemap)
    // version bump (by default), or spec version or overwrite if all pm allow it (--force)
    // deploy to pm(s)

    async.series([
        build, versioning, publish
    ]);

    function build (done) {
        buildCommand.build(program, done);
    }

    function versioning (done) {
        // update definitions for each pms
    }

    function publish (done) {
        // publish methods to each pms
    }

};
