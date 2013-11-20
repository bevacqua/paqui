'use strict';

var fs = require('fs');
var util = require('util');
var chalk = require('chalk');
var err = require('./err.js');
var enoent = /^ENOENT/i;
var enotdir = /^ENOTDIR/i;
var unspecified = 'Unspecified target directory';
var dirty = 'Destination is non-empty';
var file = 'Destination shares name with a file';
var dest = util.format('paqui init %s', chalk.cyan('[dest]'));
var option = util.format('paqui init %s', chalk.cyan('--existing'));
var either = util.format('Either: %s, or: %s', dest, option);

module.exports = function (prefix, existing) {

    if (!prefix) {
        th(unspecified, dest);
    }

    try {
        var contents = fs.readdirSync(prefix);
        if (contents.length && !existing) { // dirty directories are bad, unless --existing
            th(dirty, either);
        }
    } catch (e) {
        if (enotdir.test(e.message)) { // ENOTDIR is weird
            th(file, dest);
        }
        var ent = enoent.test(e.message);
        if((ent && existing) || !ent) { // ENOENT is fine unless --existing
            th(unspecified, either);
        }
    }
};

function th (message, alternative) {
    var format = '%s. Pick a different package name or destination directory. Use:\n%s\n';

    err(format, message, alternative);
}
