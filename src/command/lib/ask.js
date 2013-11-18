'use strict';

var chalk = require('chalk');
var util = require('util');

module.exports = function (program) {
    return function (what, then, defaultValue) {
        var question = util.format('[%s] %s: (%s) ', chalk.green('?'), what, defaultValue);

        program.prompt(question, function (result) {
            if (result !== 0 && !result) {
                result = defaultValue;
            }
            then(result);
        });
    };
}
