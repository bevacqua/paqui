'use strict';

var program = require('commander');
var fs = require('fs');
var path = require('path');
var chalk = require('chalk');
var err = require('./err.js');
var getRc = require('./getRc.js');
var enoent = /^ENOENT/i;

module.exports = function () {
    var rcCache;
    var api = {
        get rc () { return rcGetter(); },
        wd: program.prefix,
        bump: bump
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

        fs.writeFile(jsonPath, JSON.stringify(json, null, 2), done);

    }

    return api;
};
