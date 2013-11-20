'use strict';

var path = require('path');
var fs = require('fs-extra');
var sc = require('./lib/subcommand.js');
var getRc = require('./lib/getRc.js');

module.exports = sc('clean', function (program, done) {
    getRc(program); // blow up if no .paquirc

    var bin = path.join(program.prefix, 'bin');

    fs.remove(bin, done);
});
