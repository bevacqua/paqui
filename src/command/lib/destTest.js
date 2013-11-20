'use strict';

var fs = require('fs');
var chalk = require('chalk');
var err = require('./err.js');
var enoent = /^ENOENT/i;
var enotdir = /^ENOTDIR/i;
var unspecified = 'Unspecified target directory';
var dirty = 'Destination is non-empty';
var file = 'Destination shares name with a file';

module.exports = function (prefix) {

    if (!prefix) {
        th(unspecified);
    }

    try {
        var contents = fs.readdirSync(prefix);
        if (contents.length) { // empty directories are fine
            th(dirty);
        }
    } catch (e) {
        if (enotdir.test(e.message)) { // ENOTDIR is weird
            th(file);
        }
        if (!enoent.test(e.message)) { // ENOENT is fine
            th(unspecified);
        }
    }
};

function th (message) {
    var format = '%s. Pick a different package name or destination directory. Use:\n%s\n';
    var alternative = chalk.cyan('paqui init [dest]');

    err(format, message, alternative);
}
