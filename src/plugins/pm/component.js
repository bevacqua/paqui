'use strict';

var util = require('util');
var async = require('async');

module.exports = function (paqui) {
    return {
        meta: function (pkg, done) {
            done(null, {
                type: 'Component',
                cli: 'component',
                command: util.format('component install %s', pkg.name)
            });
        },
        bump: function (pkg, model, done) {

            var manifest = {
                name: pkg.name,
                description: pkg.description,
                version: pkg.version,
                license: pkg.license
            };

            async.series([
                async.apply(paqui.fill, 'component.json', manifest),
                async.apply(paqui.bump, 'component.json')
            ], done);

        },
        publish: function (pkg, model, done) {
            paqui.tag(done);
        }
    };
};
