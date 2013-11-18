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
var expandRc = require('./lib/expandRc.js');
var defaults = require('./lib/scaffold/rc.defaults.json');
var base = path.resolve(__dirname, '../../');
var tmp = path.join(base, 'tmp');

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

    var argn = program.args[0];
    var dest = destTest([argn], false);
    if (dest) {
        rc.name = argn.replace(/[\s.\/\\ ]/ig, '-');
    }

    async.eachSeries(keys, questions, function () {

        dest = destTest([argn, rc.name], true);

        var rcjson = JSON.stringify(rc, null, 2);

        expandRc(rc);

        process.stdout.write(chalk.magenta('Generating...'));

        var timestamp = (+new Date()).toString();
        var dir = path.join(tmp, timestamp);
        var files = [
            { path: '.paquirc', data: rcjson },
            { path: 'LICENSE', data: rc.license.text },
            { path: 'README.markdown', data: rc.readme },
            { path: rc.main.path, data: rc.main.placeholder }
        ];

        async.each(files, function (file, next) {
            var filename = path.join(dir, file.path);
            var dirname = path.dirname(filename);

            mkdirp.sync(dirname);

            if (file.data) {
                fs.writeFile(filename, file.data, next);
            }
        }, move);

        function move () {
            fs.renameSync(dir, dest);
            process.stdout.write(chalk.magenta('done.\n'));
            process.exit(0);
        }
    });

};
