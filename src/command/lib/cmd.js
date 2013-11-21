'use strict';

var chalk = require('chalk');
var program = require('commander');
var spawn = require('child_process').spawn;
var spaceStateMachine = require('./spaceStateMachine.js');

module.exports = function (command, done) {
    var args = spaceStateMachine(command);
    var c = args.shift();
    var opts = {
        cwd: program.prefix,
        env: process.env,
        stdio: 'inherit'
    };
    console.log(chalk.cyan(command));
    spawn(c, args, opts, done);
};
