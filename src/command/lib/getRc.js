'use strict';

var fs = require('fs');
var path = require('path');
var chalk = require('chalk');
var err = require('./err.js');

module.exports = function (program){
    var rcPath = path.resolve(program.prefix, program.rc);

    try {
        return JSON.parse(fs.readFileSync(rcPath));
    } catch (e) {
        err('Error parsing .paquirc at %s\n', chalk.red(rcPath));
    }
};
