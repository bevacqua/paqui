'use strict';

var fs = require('fs');

module.exports = function (pkg, model, done) {

    fs.readFile(pkg.main, { encoding: 'utf8' }, done);

};
