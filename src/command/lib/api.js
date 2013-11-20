'use strict';

var program = require('commander');
var fs = require('fs');
var path = require('path');
var chalk = require('chalk');
var err = require('./err.js');
var getRc = require('./getRc.js');
var enoent = /^ENOENT/i;

var api = module.exports = {
    rc: getRc(program),
    wd: program.prefix,
    bump: bump
};

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
