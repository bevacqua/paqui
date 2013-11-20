'use strict';

var util = require('util');
var program = require('commander');

module.exports = {
    meta: function (pkg) {
        return {
            type: 'npm',
            cli: 'npm',
            command: util.format('npm install --save %s', pkg.name)
        };
    },
    bump: function (pkg, model, done) {
        console.log('npm bump');
        console.log(program.prefix);
        done();
    },
    publish: function (pkg, model, done) {
        console.log(program.prefix);
        done();
    }
};
