'use strict';

var mustache = require('mustache');

module.exports = function (template, view) {
    return mustache.render(template, view);
};
