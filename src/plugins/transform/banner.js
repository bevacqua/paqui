'use strict';

var util = require('util');
var moment = require('moment');

module.exports = function (paqui) {
    return {
        transform: function (pkg, model, done) {
            var banner = util.format([
                '/*!',
                ' * %s %s',
                ' * %s',
                ' *',
                ' * Released under the %s license',
                ' * Last modified %s',
                ' */\n'
            ].join('\n'), pkg.name, pkg.version, pkg.remoteUrl, pkg.license, moment().format('YYYY/MM/DD HH:mm:ss TZZ'));

            done(null, banner + model.code);
        }
    };
};
