'use strict';

function isSeparator(char) {
    return char === '.' || char === '-' || char === '/' || char === ' ';
}
function isDigit(char) {
    return char >= '0' && char <= '9';
}

function testPosition(mask, position, char) {
    var charAtPos = mask[position];
    switch (charAtPos) {
        case '9':
            return isDigit(char);
        case ' ':
            return true;
        case '.':
        case '-':
        case '/':
            return isSeparator(char);
        default:
            return false;
    }
}

function easyMask(input, mask) {
    if (typeof input !== 'string') {
        return null
    }
    var parsedValue = '';
    var inputLen = input.length;
    var position = 0;
    while (position < inputLen && parsedValue.length < mask.length) {
        var ch = input[position];
        var len = parsedValue.length;
        var nextCharInMask = mask[len];
        if (isSeparator(nextCharInMask) && nextCharInMask !== ch) {
            parsedValue += nextCharInMask;
        }
        if (testPosition(mask, parsedValue.length, ch)) {
            parsedValue += ch;
        }
        position++;
    }
    return parsedValue;
}

