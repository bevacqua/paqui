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

        // options common to all sub-commands
        program
            .version(pkg.version)
            .option('-p, --prefix [path]', 'Working directory to use')
            .option('-r, --rc [file]', '.paquirc file, relative to working directory', '.paquirc')
            .parse(process.argv);

        (bake || noop)(program);

        return new Program(program);
    }
};
