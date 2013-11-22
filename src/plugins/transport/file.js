'use strict';

var fs = require('fs');
var path = require('path');
var uglify = require('uglify-js');
var mkdirp = require('mkdirp');
var async = require('async');

module.exports = function (paqui) {
    return {
        transport: function (pkg, model, done) {
            var directory = path.dirname(pkg.bin);
            var jsPath = pkg.bin + '.js';
            var jsMinPath = pkg.bin + '.min.js';
            var min = uglify.minify(model.code, { fromString: true }).code;

            async.series([
                async.apply(mkdirp, directory),
                async.apply(paqui.write, jsPath, { data: model.code, message: 'Updated built package' }),
                async.apply(paqui.write, jsMinPath, { data: min, message: 'Updated minified package' })
            ], done);
        }
    };
};
