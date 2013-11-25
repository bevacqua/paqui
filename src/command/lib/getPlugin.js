'use strict';

var program = require('commander');
var path = require('path');
var util = require('util');
var chalk = require('chalk');
var paqui = require('./api.js');
var err = require('./err.js');

var types = {
    pm: 'package management system',
    transform: 'build transformer',
    transport: 'build persistance mechanism',
};

function attempt (modpath) {
    try {
        return require(modpath)(paqui());
    } catch (e) {
        return false;
    }
}

module.exports = function (type, name) {
    var modpath = util.format('../../plugins/%s/%s.js', type, name);
    var mod = attempt(modpath);
    if (mod) {
        return mod;
    }

    modpath = path.resolve(program.prefix, name + '.js');
    mod = attempt(modpath);
    if (mod) {
        return mod;
    }

    err('Unidentified %s: %s\n', types[type] || type, chalk.red(name));
};
