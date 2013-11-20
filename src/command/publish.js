'use strict';

var sc = require('./lib/subcommand.js');
var getRc = require('./lib/getRc.js');

module.exports = sc('publish', function (program, done) {
    getRc(program); // blow up if no .paquirc
});
