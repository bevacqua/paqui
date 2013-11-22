'use strict';

var _ = require('lodash');
var async = require('async');
var chalk = require('chalk');
var path = require('path');
var getRc = require('./lib/getRc.js');
var getPlugin = require('./lib/getPlugin.js');
var err = require('./lib/err.js');
var sc = require('./lib/subcommand.js');

module.exports = sc('build', function (program, done) {
    var pkg = getRc(program); // blow up if no .paquirc
    var model = {};

    pkg.bin = path.join(program.prefix, 'bin', pkg.name);
    pkg.main = path.join(program.prefix, pkg.main);

    // disallow alteration of the pkg metadata itself.
    var clone = _.cloneDeep(pkg);
    Object.freeze(clone);

    if (pkg.transform.length === 0) {
        err('You need to specify at least one transform in %s, e.g:\n%s', chalk.magenta('.paquirc'), chalk.yellow(JSON.stringify({
            transform: ['raw']
        }, null, 2)));
    }

    async.eachSeries(pkg.transform, function (transformer, next) {
        console.log('Applying %s build transformer', chalk.magenta(transformer));
        getPlugin('transform', transformer).transform(clone, model, function (e, result) {
            model.code = result;
            next(e);
        });
    }, transport);

    function transport () {

        async.eachSeries(pkg.transport, function (transporter, next) {
            console.log('Applying %s build transport', chalk.magenta(transporter));
            getPlugin('transport', transporter).transport(clone, model, next);
        }, done);

    }
});
