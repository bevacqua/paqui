'use strict';

var async = require('async');
var getRc = require('./lib/getRc.js');
var cleanCommand = require('./clean.js');
var bumpCommand = require('./bump.js');
var buildCommand = require('./build.js');
var publishCommand = require('./publish.js');

module.exports = function (program) {

    async.series([
        async.apply(cleanCommand.step, program)
        async.apply(bumpCommand.step, program)
        async.apply(buildCommand.step, program)
        async.apply(publishCommand, program)
    ]);

};
