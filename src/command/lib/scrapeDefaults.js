'use strict';

var util = require('util');
var path = require('path');
var exec = require('child_process').exec;

module.exports = function (program, rc) {

    var basename = path.basename(program.prefix);
    rc.name = basename.replace(/[\s.\/\\ ]/ig, '-');

    exec('git config --get user.name', function (err, stdout) {
        var name = rc.author = stdout.trim();

        exec('git config --get user.email', function (err, stdout) {
            var email = stdout.trim();
            if (email) {
                if (name) {
                    rc.author = util.format('%s <%s>', name, email);
                } else {
                    rc.author = email;
                }
            }

            if (rc.author) {
                rc.description = util.format('An awesome package written by %s', name);
            } else {
                rc.description = 'An awesome package which does something extremely well';
            }
        });
    });

};
