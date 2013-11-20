'use strict';

var fs = require('fs');
var path = require('path');
var uglify = require('uglify-js');
var mkdirp = require('mkdirp');
var async = require('async');

module.exports = function (paqui) {
    return {
        transport: function (pkg, model, done) {
            var min = uglify.minify(model.code, { fromString: true }).code;

            async.parallel([
                async.apply(mkdirp, path.dirname(pkg.bin)),
                async.apply(fs.writeFile, pkg.bin + '.js', model.code),
                async.apply(fs.writeFile, pkg.bin + '.min.js', min),
            ], done);

        }
    };
};
