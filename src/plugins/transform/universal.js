'use strict';

var program = require('commander');
var path = require('path');
var browserify = require('browserify');

module.exports = function (paqui) {
    return {
        transform: function (pkg, model, done) {
            var main = path.join(program.prefix, pkg.main);
            var raw = '';
            var b = browserify(main);
            var stream = b.bundle({
                standalone: pkg.name
            });

            stream.on('data', function (data) {
                raw += data;
            });

            stream.on('end', function () {
                done(null, raw);
            });
        }
    };
};
