'use strict';

var mkdirp = require('mkdirp');
var browserify = require('browserify');
var uglify = require("uglify-js");
var async = require('async');
var path = require('path');
var chalk = require('chalk');
var stream = require('stream');
var fs = require('fs');
var err = require('./lib/err.js');

module.exports = function (program) {
    // force all versions to the version in rc.
    // minify / concat
    // (create a sourcemap)
    // version bump (by default), or spec version or overwrite if all pm allow it (--force)
    // deploy to pm(s)

    var rcPath = path.resolve(program.prefix, program.rc);
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
        var bin = path.join(program.prefix, 'bin', rc.name);
        var main = path.join(program.prefix, rc.main);
        var raw = '';
        var b = browserify(main);
        var rs = b.bundle({
            standalone: rc.name
        });

        rs.on('data', function (data) {
            raw += data;
        });

        rs.on('end', function () {
            var min = uglify.minify(raw, { fromString: true }).code;

            mkdirp(path.dirname(bin));

            fs.writeFileSync(bin + '.js', raw);
            fs.writeFileSync(bin + '.min.js', min);

            done();
        });
    }

    function versioning (done) {
        // update definitions for each pms
    }

    function publish (done) {
        // publish methods to each pms
    }

};
