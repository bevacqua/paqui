'use strict';

var async = require('async');
var chalk = require('chalk');
var path = require('path');
var getRc = require('./lib/getRc.js');
var getPlugin = require('./lib/getPlugin.js');
var err = require('./lib/err.js');
var sc = require('./lib/subcommand.js');

module.exports = sc('build', function (program, done) {
    var pkg = getRc(program);
    var model = {};

    pkg.bin = path.join(program.prefix, 'bin', pkg.name);
    pkg.main = path.join(program.prefix, pkg.main);

    // disallow alteration of the pkg metadata itself.
    Object.freeze(pkg);

    if (pkg.transform.length === 0) {
        err('You need to specify at least one transform in %s, e.g:\n%s', chalk.magenta('.paquirc'), chalk.yellow(JSON.stringify({
            transform: ['raw']
        }, null, 2)));
    }

    async.eachSeries(pkg.transform, function (transformer, next) {
        getPlugin('transform', transformer).call(null, pkg, model, function (err, result) {
            model.code = result;
            next(err);
        });
    }, transport);

    function transport () {

        async.each(pkg.transport, function (transporter, next) {
            getPlugin('transport', transporter).call(null, pkg, model, next);
        }, done);

    }
});
