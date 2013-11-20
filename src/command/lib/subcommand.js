'use strict';

var util = require('util');
var err = require('./lib/err.js');

module.exports = function (name, fn) {

    var result = function (program) {
        fn(program, done);

        function done (err) {
            var nameTitle = name.shift().toUpperCase() + name;
            if (err) {
                err('%s\n\n%s failed.', err.stack || err, nameTitle);
            }
            process.stdout.write(util.format('%s completed.\n', nameTitle));
            process.exit(0);
        }
    };

    result[name] = fn;

    return result;
}
