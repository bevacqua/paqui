'use strict';

var util = require('util');
var uglify = require('uglify-js');
var async = require('async');

module.exports = function (paqui) {
    return {
        transport: function (pkg, model, done) {
            var jsPath = util.format('bin/%s.js', pkg.name);
            var jsMinPath = util.format('bin/%s.min.js', pkg.name);
            var min = uglify.minify(model.code, {
                fromString: true,
                output: {
                    comments: /^!/
                }
            }).code;

            async.series([
                async.apply(paqui.write, jsPath, { data: model.code, message: 'Updated built package' }),
                async.apply(paqui.write, jsMinPath, { data: min, message: 'Updated minified package' })
            ], function (e) {
                done(e, jsPath);
            });
        }
    };
};
