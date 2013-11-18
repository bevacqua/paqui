'use strict';

var util = require('util');

module.exports = function () {
    var args = Array.prototype.slice.call(arguments);
    var message = util.format.apply(util, args);
    process.stderr.write(message + '\n');
    process.exit(1);
};
