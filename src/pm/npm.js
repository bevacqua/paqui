'use strict';

var util = require('util');

module.exports = {
    meta: function (pkg) {
        return {
            type: 'npm',
            cli: 'npm',
            command: util.format('npm install --save %s', pkg.name)
        };
    }
};
