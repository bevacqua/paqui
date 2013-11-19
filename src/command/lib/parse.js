'use strict';

var rcomma = /\s*,\s*/g;

module.exports = {
    array: function (text) {
        return text.split(rcomma);
    },
    bool: function (text) {
        return text.trim() === 'true';
    }
};
