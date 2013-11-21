'use strict';

var _ = require('lodash');
var async = require('async');
var semver = require('semver');
var exec = require('child_process').exec;
var getRc = require('./lib/getRc.js');
var getPlugin = require('./lib/getPlugin.js');
var sc = require('./lib/subcommand.js');

module.exports = sc('bump', function (program, done) {
    var pkg = getRc(program); // blow up if no .paquirc
    var model = {};

    pkg.version = semver.inc(pkg.version, 'patch');
    pkg.save();

    exec('git config --get remote.origin.url', function (err, url) {
        if(!pkg.homepage && !err && url) {
            pkg.homepage = url.trim();
        }

        // disallow alteration of the pkg metadata itself.
        var clone = _.cloneDeep(pkg);
        Object.freeze(clone);

        async.each(pkg.pm, function (packager, next) {
            console.log('Updating %s package metadata', chalk.magenta(packager));
            getPlugin('pm', packager).bump(clone, model, next);
        }, done);

    });
});
