'use strict';

var _ = require('lodash');
var async = require('async');
var getRc = require('./lib/getRc.js');
var getPlugin = require('./lib/getPlugin.js');
var sc = require('./lib/subcommand.js');

module.exports = sc('publish', function (program, done) {
    var pkg = getRc(program); // blow up if no .paquirc
    var model = {};

    // disallow alteration of the pkg metadata itself.
    var clone = _.cloneDeep(pkg);
    Object.freeze(clone);

    async.each(pkg.pm, function (packager, next) {
        getPlugin('pm', packager).publish(clone, model, next);
    }, done);
});
