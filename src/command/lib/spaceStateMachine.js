'use strict';

module.exports = function (text) {
    var outside = true;
    var i = 0;
    var len = text.length;
    var character;
    var pieces = [];
    var piece;
    var space = /\s/;
    var quote = /["']/;

    for (; i < len; i++) {
        character = text[i];

        var quotes = quote.test(character);
        if (quotes && outside) {
            outside = false;
            add();
        } else if (quotes && !outside) {
            outside = true;
            add();
        } else if (outside && space.test(character)) {
            if (piece !== void 0) {
                pieces.push(piece);
                piece = void 0;
            }
        } else {
            add();
        }
    }

    function add () {
        if (piece !== void 0) {
            piece += character;
        } else {
            piece = character;
        }
    }

    if (piece) {
        pieces.push(piece);
    }

    return pieces;
};
