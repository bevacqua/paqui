'use strict';

var _ = require('lodash');
var async = require('async');
var semver = require('semver');
var chalk = require('chalk');
var util = require('util');
var exec = require('child_process').exec;
var err = require('./lib/err.js');
var getRc = require('./lib/getRc.js');
var getPlugin = require('./lib/getPlugin.js');
var sc = require('./lib/subcommand.js');

module.exports = sc('bump', function (program, done) {
    var pkg = getRc(program); // blow up if no .paquirc
    var model = {};

    exec(util.format('git config --get remote.%s.url', pkg.remote), function (er, url) {
        if(er || !url) {
            err('A git remote named %s is required to proceed.', chalk.cyan(pkg.remote));
        }

        pkg.remoteUrl = url.trim();
        pkg.version = semver.inc(pkg.version, 'patch');
        pkg.save();

        // disallow alteration of the pkg metadata itself.
        var clone = _.cloneDeep(pkg);
        Object.freeze(clone);

        async.each(pkg.pm, function (packager, next) {
            console.log('Updating %s package metadata', chalk.magenta(packager));
            getPlugin('pm', packager).bump(clone, model, next);
        }, done);

    });
});
