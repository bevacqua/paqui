'use strict';

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
    }
};
