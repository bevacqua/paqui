'use strict';

var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var util = require('util');
var chalk = require('chalk');
var mustache = require('./mustache.js');
var getPlugin = require('./getPlugin.js');

module.exports = function (pkg) {

    if (!pkg.pm) {
        pkg.pm = [];
    }

    _.each(pkg.pm, function (pmn, i) {
        pkg.pm[i] = getPlugin('pm', pmn).meta(pkg);
    });

    pkg.license = getLicense(pkg);
    pkg.readme = getReadme(pkg);
    pkg.main = getMain(pkg);

    return pkg;
};

function getLicense (pkg) {
    var view = _.cloneDeep(pkg);
    view.year = new Date().getFullYear();
    var licenseName = pkg.license.toLowerCase();
    var licenseRelative = util.format('./scaffold/license/%s.mu', licenseName);
    var licensePath = path.join(__dirname, licenseRelative);
    var licenseModel = fs.readFileSync(licensePath, { encoding: 'utf8' });
    var license = mustache(licenseModel, view);

    return {
        name: licenseName.toUpperCase(),
        text: license
    };
}

function getReadme (pkg) {
    var readmePath = path.join(__dirname, './scaffold/README.markdown');
    var readme = fs.readFileSync(readmePath, {
        encoding: 'utf8'
    });
    return mustache(readme, pkg);
}

function getMain (pkg) {
    var mainPath = path.join(__dirname, './scaffold/root.js');
    var main = fs.readFileSync(mainPath, {
        encoding: 'utf8'
    });
    return {
        path: pkg.main,
        placeholder: main
    };
}
