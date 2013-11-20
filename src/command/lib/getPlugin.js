'use strict';

var util = require('util');
var chalk = require('chalk');
var paqui = require('./api.js');
var err = require('./err.js');

var types = {
    pm: 'package management system',
    build: 'build system',
    transport: 'build persistance mechanism'
};

module.exports = function (type, name) {
    var modpath = util.format('../../plugins/%s/%s.js', type, name);

    try {
        return require(modpath)(paqui);
    } catch (e) {
        err('Unidentified %s: %s\n', types[type], chalk.red(name));
    }
};
