'use strict';

var util = require('util');
var async = require('async');

module.exports = function (paqui) {
    return {
        meta: function (pkg, done) {
            done(null, {
                type: 'npm',
                cli: 'npm',
                command: util.format('npm install --save %s', pkg.name)
            });
        },
        bump: function (pkg, model, done) {

            var json = {
                name: pkg.name,
                description: pkg.description,
                version: pkg.version,
                author: pkg.author,
                homepage: pkg.homepage,
                license: pkg.license
            };

            async.series([
                async.apply(paqui.fill, 'package.json', json),
                async.apply(paqui.bump, 'package.json')
            ], done);

        },
        publish: function (pkg, model, done) {
            paqui.cmd('npm publish', done);
        }
    };
};
