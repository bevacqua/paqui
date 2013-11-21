'use strict';

var util = require('util');
var async = require('async');

module.exports = function (paqui) {
    return {
        meta: function (pkg, done) {
            done(null, {
                type: 'bower',
                cli: 'bower',
                command: util.format('bower install --save %s', pkg.name)
            });
        },
        bump: function (pkg, model, done) {

            var manifest = {
                name: pkg.name,
                version: pkg.version,
                main: pkg.main,
                ignore: ['.paquirc', 'src']
            };

            async.series([
                async.apply(paqui.fill, 'bower.json', manifest),
                async.apply(paqui.bump, 'bower.json')
            ], done);

        },
        publish: function (pkg, model, done) {
            // util.format('bower register %s -f %s', pkg.name, pkg.origin)
            // paqui.tag creates git tag, if not exists.
            done();
        }
    };
};
