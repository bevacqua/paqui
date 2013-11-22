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

            var manifest = {
                name: pkg.name,
                description: pkg.description,
                version: model.versionBefore, // fill: use the version provided to `paqui init`
                author: pkg.author,
                homepage: pkg.remoteUrl,
                license: pkg.license
            };

            async.series([
                async.apply(paqui.fill, 'package.json', manifest),
                async.apply(paqui.bump, 'package.json')
            ], done);

        },
        publish: function (pkg, model, done) {
            paqui.cmd('npm publish', done);
        }
    };
};
