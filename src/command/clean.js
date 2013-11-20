'use strict';

var fs = require('fs-extra');
var sc = require('./lib/subcommand.js');

module.exports = sc('clean', function (program, done) {
    console.log(program.prefix);
});
