'use strict';

var path = require('path');
var fs = require('fs-extra');
var sc = require('./lib/subcommand.js');

module.exports = sc('clean', function (program, done) {

    var bin = path.join(program.prefix, 'bin');

    fs.remove(bin, done);
});
