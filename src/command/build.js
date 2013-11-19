'use strict';

var mkdirp = require('mkdirp');
var browserify = require('browserify');
var uglify = require('uglify-js');
var path = require('path');
var fs = require('fs');
var getRc = require('./lib/getRc.js');

module.exports = function (program) {
    build(program, done);

    function done () {
        process.stdout.write('Build completed.\n');
        process.exit(0);
    }
};

function build (program, done) {
    var rc = getRc(program);
    var bin = path.join(program.prefix, 'bin', rc.name);
    var main = path.join(program.prefix, rc.main);

    if (program.universal || rc.universal) {
        wrap();
    } else {
        write(main);
    }

    function wrap () {
        var raw = '';
        var b = browserify(main);
        var rs = b.bundle({
            standalone: rc.name
        });

        rs.on('data', function (data) {
            raw += data;
        });

        rs.on('end', function () {
            write(raw);
        });
    }

    function write (raw) {
        var min = uglify.minify(raw, { fromString: true }).code;

        mkdirp(path.dirname(bin));

        fs.writeFileSync(bin + '.js', raw);
        fs.writeFileSync(bin + '.min.js', min);

        done();
    }
}


module.exports.build = build;
