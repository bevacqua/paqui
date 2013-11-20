'use strict';

var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var chalk = require('chalk');
var async = require('async');
var ask = require('./lib/ask.js');
var parse = require('./lib/parse.js');
var destTest = require('./lib/destTest.js');
var scaffoldRc = require('./lib/scaffoldRc.js');
var scrapeDefaults = require('./lib/scrapeDefaults.js');
var defaults = require('./lib/scaffold/rc.defaults.json');

module.exports = function (program) {
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

    destTest(program.prefix);
    scrapeDefaults(program, rc);

    async.eachSeries(keys, questions, function () {
        var rcjson = JSON.stringify(rc, null, 2) + '\n';

        scaffoldRc(rc);

        process.stdout.write(chalk.magenta('Generating...'));

        var files = [
            { path: '.paquirc', data: rcjson },
            { path: 'LICENSE', data: rc.license.text },
            { path: 'README.markdown', data: rc.readme },
            { path: rc.main.path, data: rc.main.placeholder }
        ];

        mkdirp.sync(program.prefix);

        async.each(files, function (file, next) {
            var filename = path.join(program.prefix, file.path);
            var dirname = path.dirname(filename);

            mkdirp.sync(dirname);

            if (file.data) {
                fs.writeFile(filename, file.data, next);
            }
        }, done);

        function done () {
            process.stdout.write(chalk.magenta('done.\n'));
            process.exit(0);
        }
    });

};
