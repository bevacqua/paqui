'use strict';

var path = require('path');
var getRc = require('./lib/getRc.js');

module.exports = function (program) {
    build(program, done);

    function done () {
        process.stdout.write('Build completed.\n');
        process.exit(0);
    }
};

function build (program, done) {
    var pkg = getRc(program);
    var model = {};

    pkg.bin = path.join(program.prefix, 'bin', pkg.name);
    pkg.main = path.join(program.prefix, pkg.main);

    Object.freeze(pkg);
}


module.exports.build = build;
