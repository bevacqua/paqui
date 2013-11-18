'use strict';

var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var chalk = require('chalk');
var util = require('util');

module.exports = function (tests, throws) {
    var result;

    _.some(tests, function (item) {
        var dest = test(item);
        if (dest) {
            result = dest;
        }
        return dest;
    });

    if (result) {
        return result;
    }
    if (throws) {
        return th(true);
    }

    function test (item) {
        if (!item) { // if unset, don't test nor throw
            return;
        }
        var cwd = process.cwd();
        var dest = path.join(cwd, item);

        if (!fs.existsSync(dest)) {
            return dest;
        }

        th();
    }

    function th (blank) {
        var format = '%s. Pick a different package name or destination directory. Use:\n%s\n';
        var alternative = chalk.cyan('paqui init [dest]');
        var empty = 'Destination is not empty';
        var unspecified = 'Unspecified target directory';
        var message = util.format(format, blank ? unspecified : empty, alternative);
        process.stderr.write(message);
        process.exit(1);
    }
};
