'use strict';

var util = require('util');

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
            paqui.bump('package.json', done);
        },
        publish: function (pkg, model, done) {
            console.log(paqui.wd);
            done();
        }
    };
};
