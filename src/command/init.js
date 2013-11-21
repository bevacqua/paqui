'use strict';

var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var chalk = require('chalk');
var async = require('async');
var err = require('./lib/err.js');
var cmd = require('./lib/cmd.js');
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

    async.eachSeries(keys, questions, function () {

        process.stdout.write(chalk.magenta('Generating...'));

        var rcjson = JSON.stringify(rc, null, 2) + '\n';
        var files = [
            { path: '.paquirc', data: rcjson }
        ];

        if (!program.existing) {
            scaffold(function (err, result) {
                files.push.apply(files, result);
                write(err);
            });
        } else {
            fs.exists(rcPath, function (exists) {
                if (exists) {
                    err('Couldn\'t find .paquirc at %s', chalk.red(rcPath));
                }

                write();
            });
        }

        function write (er) {
            if (er) { err(er.stack || er); }

            async.each(files, function (file, next) {
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

            fs.stat(gitdir, function (err, stats) {
                if (!err && stats && stats.isDirectory()) {
                    return done();
                }

// TODO paqui init --existing overwrite .paquirc
// TODO git stuff fall-through?
                async.series([
                    async.apply(cmd, 'git init'),
                    async.apply(cmd, 'git add .'),
                    async.apply(cmd, 'git commit -am "initial commit"')
                ], function (er) {
                    if (er) { err(er.stack || er); }

                    var commands = [
                        'git remote add origin https/path/to/git/remote',
                        'git push -u origin master',
                    ].join('\n');

                    console.log('You\'ll want to create an %s git repository. Then, you can set up the remote using:\n\n%s',
                        chalk.underline('empty'),
                        chalk.magenta(commands)
                    );
                });
            });
        }

        function done (er) {
            if (er) { err(er.stack || er); }

            process.stdout.write(chalk.magenta('done.\n'));
            process.exit(0);
        }
    });

    function scaffold (done) {

        async.series([
            async.apply(scaffoldRc, program, rc),
            async.apply(mkdirp, program.prefix)
        ], function (err) {

            done(err, [
                { path: 'LICENSE', data: rc.license.text },
                { path: 'README.markdown', data: rc.readme },
                { path: rc.main.path, data: rc.main.placeholder }
            ]);

        });
    }
};
