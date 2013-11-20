'use strict';

var util = require('util');
var err = require('./err.js');

module.exports = function (name, fn) {

    function wrapped (exits) {

        function done (er) {
            var nameTitle = name.shift().toUpperCase() + name;

            if (er) {
                err('%s\n\n%s failed.', er.stack || er, nameTitle);
            }

            process.stdout.write(util.format('%s completed.\n', nameTitle));

            if (exits) {
                process.exit(0);
            }
        }

        return function (program) {
            fn(program, done);
        };
    }


    var result = wrapped(true);

    result.step = wrapped();

    return result;
};
