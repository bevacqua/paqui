'use strict';

var _ = require('lodash');
var async = require('async');
var semver = require('semver');
var getRc = require('./lib/getRc.js');
var getPlugin = require('./lib/getPlugin.js');
var sc = require('./lib/subcommand.js');

module.exports = sc('bump', function (program, done) {
    var pkg = getRc(program); // blow up if no .paquirc
    var model = {};

    pkg.version = semver.inc(pkg.version, 'patch');
    pkg.save();

    // disallow alteration of the pkg metadata itself.
    var clone = _.cloneDeep(pkg);
    Object.freeze(clone);

// TODO remove rc option from cmd line, blow up all commands if .paquirc not present on prefix root.
    async.each(pkg.pm, function (packager, next) {
        getPlugin('pm', packager).bump.call(null, clone, model, next);
    }, done);
});
