'use strict';

var _ = require('lodash');
var async = require('async');
var chalk = require('chalk');
var cmd = require('./lib/cmd.js');
var getRc = require('./lib/getRc.js');
var getPlugin = require('./lib/getPlugin.js');
var sc = require('./lib/subcommand.js');

module.exports = sc('publish', function (program, done) {
    var pkg = getRc(program); // blow up if no .paquirc
    var model = {};

    // disallow alteration of the pkg metadata itself.
    var clone = _.cloneDeep(pkg);
    Object.freeze(clone);

    async.eachSeries(pkg.pm, function (packager, next) {
        console.log('Publishing package to %s registry', chalk.magenta(packager));
        getPlugin('pm', packager).publish(clone, model, next);
    }, function (err) {
        if (err) { return done(err); }

        console.log('Pushing changes to %s remote', chalk.magenta(pkg.remote));
        cmd('git push', done);
    });
});
