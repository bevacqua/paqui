'use strict';

var async = require('async');
var getRc = require('./lib/getRc.js');
var bumpCommand = require('./bump.js');
var buildCommand = require('./build.js');

module.exports = function (program) {
    // force all versions to the version in rc.
    // minify / concat
    // (create a sourcemap)
    // version bump (by default), or spec version or overwrite if all pm allow it (--force)
    // deploy to pm(s)
    var rc = getRc(program);

    async.series([
        bump, build, publish
    ]);

    function bump (done) {
        bumpCommand.bump(program, node);
    }

    function build (done) {
        buildCommand.build(program, done);
    }

    function publish (done) {
        // publish methods to each pms
    }

};
