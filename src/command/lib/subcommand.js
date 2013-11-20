'use strict';

var util = require('util');
var err = require('./err.js');

module.exports = function (name, fn) {

    var result = function (program) {
        fn(program, done);

        function done (er) {
            var nameTitle = name.shift().toUpperCase() + name;
            if (er) {
                err('%s\n\n%s failed.', er.stack || er, nameTitle);
            }
            process.stdout.write(util.format('%s completed.\n', nameTitle));
            process.exit(0);
        }
    };

    result[name] = fn;

    return result;
};
