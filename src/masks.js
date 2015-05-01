'use strict';

function mapToRegExp(item) {
    var map = {};
    map['9'] = '\\d?';

    return map[item];
}

function isSeparator(char) {
    return mapToRegExp(char) === undefined;
}

function buildRegExp(mask) {
    var result = '';

    var re = /([^9]*)?([9]*)+/g;
    var groups, separators = [];

    while ((groups = re.exec(mask)) !== null && groups[0] !== '') {
        separators.push(groups[1]);
        result += '(' + groups[2].split('').map(mapToRegExp).join('') + ')?';
    }

    return {
        regExp: new RegExp('^' + result + '.*?$'),
        separators: separators
    };
}

function easyMask(input, mask) {
    if (typeof input !== 'string' || typeof mask !== 'string' || mask === '') {
        return null;
    }
    if (isSeparator(mask[mask.length - 1])) {
        throw new Error("Mask must not end with a separator: " + mask[mask.length - 1]);
    }
    var re = buildRegExp(mask);

    var matches = re.regExp.exec(input.replace(/[^\d]/g, ''));
    if (matches) {
        var runningValue = '',
            separatorsToInsert = re.separators,
            index = 1,
            len = matches.length;
        while (index < len && matches[index] !== undefined) {
            runningValue += (separatorsToInsert[index-1] || '') + matches[index];
            index++;
        };
        return runningValue;
    }

    return "";
}