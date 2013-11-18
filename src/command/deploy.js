'use strict';

var async = require('async');
var path = require('path');
var chalk = require('chalk');
var fs = require('fs');
var err = require('./lib/err.js');

module.exports = function (program) {
    // force all versions to the version in rc.
    // minify / concat
    // (create a sourcemap)
    // version bump (by default), or spec version or overwrite if all pm allow it (--force)
    // deploy to pm(s)
    console.log(program.rc);
    var rcPath = path.resolve(process.cwd(), program.rc);
    var rc;

    try {
        rc = JSON.parse(fs.readFileSync(rcPath));
    } catch (e) {
        err('Error parsing .paquirc at %s\n', chalk.red(rcPath));
    }

    async.series([
        build, versioning, publish
    ]);

    function build (done) {
        console.log(rc);
    }

    function versioning (done) {

    }

    function publish (done) {

    }

};
