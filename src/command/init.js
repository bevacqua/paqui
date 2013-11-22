'use strict';

var _ = require('lodash');
var fs = require('fs');
var fse = require('fs-extra');
var path = require('path');
var mkdirp = require('mkdirp');
var util = require('util');
var chalk = require('chalk');
var async = require('async');
var err = require('./lib/err.js');
var exec = require('./lib/exec.js');
var ask = require('./lib/ask.js');
var parse = require('./lib/parse.js');
var destTest = require('./lib/destTest.js');
var scaffoldRc = require('./lib/scaffoldRc.js');
var scrapeDefaults = require('./lib/scrapeDefaults.js');
var defaults = require('./lib/scaffold/rc.defaults.json');

module.exports = function (program) {
    var rcPath = path.resolve(program.prefix, program.rc);
    var rc = _.cloneDeep(defaults);
    var question = ask(program);
    var keys = _.keys(rc);

    function questions (key, next) {
        question(key, function (value) {

            if (rc[key] instanceof Array && !(value instanceof Array)) {
                value = parse.array(value);
            }
            rc[key] = value;
            next();

        }, rc[key]);
    }

    destTest(program.prefix, program.existing);
    scrapeDefaults(program, rc);

    async.eachSeries(keys, questions, generate);

    function generate () {

        console.log(chalk.magenta('Generating...'));

        if (program.remote) {
            rc.remoteUrl = program.remote;
        }
        var rcjson = JSON.stringify(rc, null, 2) + '\n';
        var files = [
            { path: '.paquirc', data: rcjson }
        ];

        if (!program.existing) {
            scaffold(function (e, result) {
                if (e) { err(e.stack || e); }
                files.push.apply(files, result);
                write(files);
            });
        } else if (program.force) {
            fse.remove(rcPath, function () { // swallow errors
                write(files);
            });
        } else {
            fs.exists(rcPath, function (exists) {
                if (exists) {
                    err('.paquirc exists at %s, use %s to overwrite', chalk.red(rcPath), chalk.cyan('--force'));
                }

                write(files);
            });
        }
    }

    function scaffold (next) {

        async.series([
            async.apply(scaffoldRc, program, rc),
            async.apply(mkdirp, program.prefix)
        ], function (e) {

            next(e, [
                { path: '.gitignore', data: '.DS_Store' },
                { path: 'LICENSE', data: rc.license.text },
                { path: 'README.markdown', data: rc.readme },
                { path: rc.main.path, data: rc.main.placeholder }
            ]);

        });
    }

    function write (files) {

        async.eachSeries(files, function (file, next) {
            var filename = path.join(program.prefix, file.path);
            var dirname = path.dirname(filename);

            mkdirp.sync(dirname);

            if (file.data) {
                fs.writeFile(filename, file.data, next);
            }
        }, git);
    }

    function git () {
        if (!program.git) {
            return done();
        }

        var gitdir = path.join(program.prefix, '.git');
        var commands = [
            util.format('git remote add %s %s', rc.remote, program.remote || 'https/path/to/git/remote'),
            util.format('git push -u %s master', rc.remote),
        ];

        fs.stat(gitdir, function (e, stats) {
            if (!e && stats && stats.isDirectory()) {
                return done();
            }

            async.series([
                async.apply(exec, 'git init'),
                async.apply(exec, 'git add .'),
                async.apply(exec, 'git commit -m "initial commit"')
            ], function (e) {
                if (e) { err(e.stack || e); }

                var tasks = commands.map(function (command) {
                    return async.apply(exec, command);
                });

                if (program.remote) {
                    async.series(tasks, done);
                } else {
                    help();
                }
            });

        });

        function help () {

            console.log('You\'ll want to create an %s git repository. Then, you can set up the remote using:\n\n%s',
                chalk.underline('empty'),
                chalk.magenta(commands.join('\n'))
            );

            done();
        }
    }

    function done (e) {
        if (e) { err(e.stack || e); }

        process.stdout.write(chalk.magenta('done.\n'));
        process.exit(0);
    }
};
