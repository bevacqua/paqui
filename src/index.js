'use strict';

var util = require('util');

function noop () {}

function Program (program) {
    this.program = program;
}

Program.prototype.use = function (module) {
    var name = module.filename.split('-').pop();
    var file = util.format('./command/%s.js', name);

    require(file)(this.program);
};

module.exports = {
    configure: function (options, bake) {
        var program = require('commander');
        var pkg = require('../package.json');

        (options || noop)(program);

        program
            .version(pkg.version)
            .parse(process.argv);

        (bake || noop)(program);

        return new Program(program);
    }
};
