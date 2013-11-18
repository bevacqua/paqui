'use strict';

var _ = require('lodash');
var fs = require('fs');
var mustache = require('./mustache.js');
var util = require('util');
var chalk = require('chalk');

module.exports = function (pkg) {

    if (!pkg.pm) {
        pkg.pm = [];
    }

    _.each(pkg.pm, function (pmn) {
        pkg.pm[pmn] = getDescriptor(pmn).meta(pkg);
    });

    pkg.license = getLicense(pkg);
    pkg.readme = getReadme(pkg);

    return pkg;
};

function getDescriptor (name) {
    var modpath = util.format('../../pm/%s.js', name);

    try {
        return require(modpath);
    } catch (e) {
        var message = util.format('Unidentified package management system: %s\n', chalk.red(name));
        process.stderr.write(message);
        process.exit(1);
    }
}

function getLicense (pkg) {
    var view = _.cloneDeep(pkg);
    view.year = new Date().getFullYear();
    var licenseName = pkg.license.toLowerCase();
    var licensePath = util.format('./lib/scaffold/%s.mu', licenseName);
    var licenseModel = fs.readFileSync(licensePath, { encoding: 'utf8' });
    var license = mustache(licenseModel, view);

    return {
        name: licenseName,
        text: license
    };
}

function getReadme (pkg) {
    var readme = fs.readFileSync('./lib/scaffold/README.markdown', {
        encoding: 'utf8'
    });
    return mustache.render(readme, pkg);
}
