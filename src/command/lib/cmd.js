'use strict';

var chalk = require('chalk');
var program = require('commander');
var spawn = require('child_process').spawn;
var spaceStateMachine = require('./spaceStateMachine.js');

module.exports = function (command, opts, done) {
    var args = spaceStateMachine(command);
    var c = args.shift();
    var options = {
        cwd: program.prefix,
        env: process.env,
        stdio: 'inherit'
    };
    if (program.lean) {
        delete options.stdio;
    }
    if (done === void 0) {
        done = opts;
        opts = {};
    }
    console.log(chalk.cyan(command));

    spawn(c, args, options).on('exit', function (e) {
        if (e && opts.ignoreExitCode !== true) {
            done(e);
        }
        done();
    });
};
