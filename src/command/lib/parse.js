'use strict';

var util = require('util');
var path = require('path');
var rcomma = /\s*,\s*/g;

module.exports = {
    array: function (text) {
        return text.split(rcomma);
    },
    bool: function (text) {
        return text.trim() === 'true';
    },
    options: function (program) {
        if (!program.prefix) {
            program.prefix = program.args[0] || '';
        }
        program.prefix = path.resolve(process.cwd(), program.prefix);
        program.rc = '.paquirc';
    },
    remote: function (value) {
        var shorthand = /[a-z0-9]+\/[a-z0-9_-]+/i;
        if (shorthand.test(value)) {
            var parts = value.split('/');
            return util.format('https://github.com/%s/%s.git', parts.shift(), parts.shift());
        }

        return value;
    }
};
