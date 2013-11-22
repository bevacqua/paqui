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
                version: pkg.version,
                ignore: ['.paquirc', 'src']
            };

            async.series([
                async.apply(paqui.fill, 'bower.json', manifest),
                async.apply(paqui.bump, 'bower.json')
            ], done);

        },
        publish: function (pkg, model, done) {
            async.series([
                async.apply(paqui.cmd, util.format('bower register %s -f %s', pkg.name, pkg.remoteUrl)),
                async.apply(paqui.tag)
            ], done);
        }
    };
};
