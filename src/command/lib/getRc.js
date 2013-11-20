'use strict';

var fs = require('fs');
var path = require('path');
var chalk = require('chalk');
var err = require('./err.js');

module.exports = function (program) {
    var rcPath = path.resolve(program.prefix, program.rc);
    var rc;

    try {
        rc = JSON.parse(fs.readFileSync(rcPath));
    } catch (e) {
        err('Error parsing .paquirc at %s\n', chalk.red(rcPath));
    }

    rc.save = function () {
        fs.writeFileSync(rcPath, JSON.stringify(rc, null, 2));
    };

    return rc;
};

module.exports
