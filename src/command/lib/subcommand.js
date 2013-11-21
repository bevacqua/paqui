'use strict';

var util = require('util');
var err = require('./err.js');

module.exports = function (name, fn) {

    function wrapped (exits) {

        return function (program, done) {
            fn(program, next);

            function next (er) {
                var nameTitle = name[0].toUpperCase() + name.substr(1);

                if (er) {
                    err('%s\n\n%s failed.', er.stack || er, nameTitle);
                }

                process.stdout.write(util.format('%s completed.\n', nameTitle));

                if (exits) {
                    process.exit(0);
                } else {
                    process.nextTick(function () {
                        done();
                    });
                }
            }
        };
    }


    var result = wrapped(true);

    result.step = wrapped();

    return result;
};
