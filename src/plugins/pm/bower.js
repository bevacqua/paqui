'use strict';

var util = require('util');
var async = require('async');

module.exports = function (paqui) {
    return {
        meta: function (pkg, done) {
            done(null, {
                type: 'Bower',
                cli: 'bower',
                command: util.format('bower install --save %s', pkg.name)
            });
        },
        bump: function (pkg, model, done) {

            var manifest = {
                name: pkg.name,
                ignore: ['.paquirc', 'src']
            };

            async.series([
                async.apply(paqui.fill, 'bower.json', manifest),
                async.apply(paqui.bump, 'bower.json')
            ], done);

        },
        publish: function (pkg, model, done) {
            async.series([
                async.apply(paqui.tag),
                function (next) {
                    if (paqui.option('bower-registry')) {
                        return next();
                    }
                    var format = 'bower register %s -f %s';
                    var command = util.format(format, pkg.name, pkg.remoteUrl);

                    async.series([
                        async.apply(paqui.cmd, command),
                        async.apply(paqui.option, 'bower-registry', true)
                    ], next);
                }
            ], done);
        }
    };
};
