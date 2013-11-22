'use strict';

var chalk = require('chalk');
var program = require('commander');
var exec = require('child_process').exec;

module.exports = function (command, cfg, done) {
    if (!done) {
        done = cfg;
        cfg = {};
    }
    cfg = cfg || {};
    if (cfg.print !== false) {
        console.log(chalk.cyan(command));
    }
    var options = {
        cwd: program.prefix,
        env: process.env
    };
    if (cfg.cwd === false) {
        delete options.cwd;
    }
    return exec(command, options, function (e, stdout) {
        if (cfg.print !== false && !program.lean) {
            console.log(stdout);
        }
        done(e, stdout);
    });
};
