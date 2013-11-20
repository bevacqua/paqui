'use strict';

var util = require('util');
var program = require('program');

module.exports = {
    meta: function (pkg) {
        return {
            type: 'npm',
            cli: 'npm',
            command: util.format('npm install --save %s', pkg.name)
        };
    },
    bump: function (pkg, model, done) {
        console.log(program.prefix);
        done();
    }
};
