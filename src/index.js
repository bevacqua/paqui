'use strict';

var util = require('util');
var noop = function(){}

function Program (program) {
    this.program = program;
}

Program.prototype.use = function (module) {
    var name = module.__filename.split('-').pop();
    var file = util.format('./command/%s.js', name);

    require(file);
};

module.exports = {
    configure: function (options) {
        var program = require('commander');
        var pkg = require('../package.json');

        (options || noop)(program);

        program
            .version(pkg.version);
            .parse(process.argv);

        return new Program(program);
    }
};
