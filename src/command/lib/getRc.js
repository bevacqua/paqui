'use strict';

var async = require('async');
var fs = require('fs');
var path = require('path');
var chalk = require('chalk');
var exec = require('./exec.js');
var err = require('./err.js');
var enoent = /^ENOENT/i;

module.exports = function (program) {
    var rcPath = path.resolve(program.prefix, program.rc);
    var rc;

    try {
        rc = JSON.parse(fs.readFileSync(rcPath));
    } catch (e) {
        var reason = enoent.test(e.message) ? 'Couldn\'t find' : 'Error parsing';
        err('%s .paquirc at %s\n', reason, chalk.red(rcPath));
    }

    rc.save = function (done) {
        async.series([
            async.apply(fs.writeFile, rcPath, JSON.stringify(rc, null, 2)),
            async.apply(exec, 'git add .paquirc'),
            async.apply(exec, 'git commit -m "Updated .paquirc"')
        ], done);
    };

    return rc;
};
