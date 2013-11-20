'use strict';

var _ = require('lodash');
var async = require('async');
var semver = require('semver');
var getRc = require('./lib/getRc.js');
var getPlugin = require('./lib/getPlugin.js');
var sc = require('./lib/subcommand.js');

module.exports = sc('bump', function (program, done) {
    var pkg = getRc(program);
    var model = {};

    pkg.version = semver.inc(pkg.version, 'patch');
    pkg.save();

    // disallow alteration of the pkg metadata itself.
    var clone = _.cloneDeep(pkg);
    Object.freeze(clone);

    async.each(pkg.pm, function (packager, next) {
        getPlugin('pm', packager).bump.call(null, clone, model, next);
    }, done);
});
