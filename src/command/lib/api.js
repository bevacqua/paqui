'use strict';

var program = require('commander');
var chalk = require('chalk');
var fs = require('fs');
var path = require('path');
var util = require('util');
var async = require('async');
var err = require('./err.js');
var cmd = require('./cmd.js');
var exec = require('./exec.js');
var getRc = require('./getRc.js');
var enoent = /^ENOENT/i;

module.exports = function () {
    var rcCache;
    var api = {
        get rc () { return rcGetter(); },
        wd: program.prefix,
        fill: fill,
        bump: bump,
        cmd: cmd,
        exec: exec,
        tag: tag,
        option: option,
        write: write
    };

    // sometimes (paqui init) we need access to the API but we can't
    // provide the .paquirc data as it doesn't even exist yet
    function rcGetter() {
        if (!rcCache) {
            rcCache = getRc(program);
        }
        return rcCache;
    }

    function bump (relative, done) {
        var jsonPath = path.join(api.wd, relative);
        var json;

        try {
            json = JSON.parse(fs.readFileSync(jsonPath));
        } catch (e) {
            var reason = enoent.test(e.message) ? 'Couldn\'t find' : 'Error parsing';
            err('%s %s at %s\n', reason, relative, chalk.red(api.wd));
        }

        json.version = api.rc.version;

        var contents = JSON.stringify(json, null, 2);

        write(jsonPath, {
            data: contents,
            message: util.format('Bumped version in %s to %s', relative, api.rc.version)
        }, done);
    }

    function write (absolute, options, done) {
        async.series([
            async.apply(fs.writeFile, absolute, options.data),
            async.apply(exec, util.format('git add %s', absolute)),
            async.apply(exec, util.format('git commit -m "%s"', options.message))
        ], done);
    }

    function fill (relative, contents, done) {
        var jsonPath = path.join(api.wd, relative);
        var data = contents;
        if (typeof contents !== 'string') {
            data = JSON.stringify(contents, null, 2);
        }
        async.series([
            function (next) {
                fs.exists(jsonPath, function (exists) {
                    next(exists ? 'exists' : null);
                });
            },
            async.apply(fs.writeFile, jsonPath, data)
        ], function (e) {
            if (e) {
                return done(e === 'exists' ? null : e);
            }
            console.log('Generated %s, please verify before deployment', chalk.magenta(relative));
            done();
        });
    }

    function tag (done) {
        exec('git tag', function (e, stdout) {
            var tags = stdout.split('\n');
            var version = api.rc.version;

            if (tags.indexOf(version) !== -1) {
                console.log('Remote is up to date');
                return done();
            }

            async.series([
                async.apply(exec, util.format('git tag -a %s -m "%s"', version, 'Release ' + version)),
                async.apply(cmd, util.format('git push %s %s', api.rc.remote, version))
            ], done);
        });
    }

    function option (key, value, done) {
        api.rc.options = api.rc.options || {};

        if (arguments.length === 1) {
            return api.rc.options[key];
        }
        api.rc.options[key] = value;
        api.rc.save(done);
    }

    return api;
};
