'use strict';

var mustache = require('mustache');

module.exports = function (template, view) {
    return mustache.to_html(template, view);
};
