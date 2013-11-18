'use strict';

var _ = require('lodash');
var ask = require('./lib/ask.js');
var paquirc = require('./lib/paqui.json');
var rhelp = /_help$/;

module.exports = function (program) {
    var question = ask(program);
    var keys = _.keys(paquirc);

    _.each(keys, function (key) {
        console.log('ask', key)
        question(key, function (value) {
            console.log(key, value);
        }, paquirc[key]);
    });

    console.log('done')
};
