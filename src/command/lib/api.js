'use strict';

var _ = require('lodash');
var program = require('commander');
var chalk = require('chalk');
var fs = require('fs');
var path = require('path');
var util = require('util');
var async = require('async');
var mkdirp = require('mkdirp');
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
        write: write,
        update: update
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

        write(relative, {
            data: contents,
            message: util.format('Bumped %s to %s', relative, api.rc.version)
        }, done);
    }

    function write (relative, options, done) {
        var absolute = path.join(api.wd, relative);
        var dirname = path.dirname(absolute);

        async.series([
            async.apply(mkdirp, dirname),
            async.apply(fs.writeFile, absolute, options.data),
            async.apply(exec, util.format('git add %s', relative)),
            async.apply(exec, util.format('git commit -m "%s" || echo "No changes commited."', options.message))
        ], done);
    }

    function update (relative, updates, done) {
        var absolute = path.join(api.wd, relative);

        fs.readFile(absolute, { encoding: 'utf8' }, function (e, contents) {
            write(relative, {
                data: _.merge({}, JSON.parse(contents), updates),
                message: util.format('Updated %s configuration', relative)
            }, done);
        });
    }

    function fill (relative, contents, done) {
        var absolute = path.join(api.wd, relative);
        var data = contents;
        if (typeof contents !== 'string') {
            data = JSON.stringify(contents, null, 2);
        }
        async.series([
            function (next) {
                fs.exists(absolute, function (exists) {
                    next(exists ? 'exists' : null);
                });
            },
            async.apply(fs.writeFile, absolute, data),
            async.apply(exec, util.format('git add %s', relative)),
            async.apply(exec, util.format('git commit -m "Generated %s"', relative))
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
