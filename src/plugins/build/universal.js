'use strict';

var browserify = require('browserify');

module.exports = function (pkg, model, done) {

    var raw = '';
    var b = browserify(pkg.main);
    var stream = b.bundle({
        standalone: pkg.name
    });

    stream.on('data', function (data) {
        raw += data;
    });

    stream.on('end', function () {
        done(null, raw);
    });

};
