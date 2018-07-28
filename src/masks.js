function mapToRegExp(item) {
    var map = {};
    map['0'] = '\\d*?';
    map['9'] = '\\d?';
    map['A'] = '[\\dA-Za-z]*?';
    map['L'] = '[A-Za-z]?';
    map['Z'] = '[A-Za-z]*?';

    return map[item];
}

function isSeparator(char) {
    return mapToRegExp(char) === undefined;
}

function wildcardToMapper(item) {
    var noop = function (item) {return item||'';};
    var map = {};
    map['A'] = function(item) { return item.toUpperCase();};
    map['L'] = function(item) {
        return item.toUpperCase();
    };
    map['Z'] = function(item) { return item.toLowerCase();};

    return map[item] || noop;
}

function buildRegExp(mask) {
    var result = '';

    var re = /([^09ALZ]*)?([09ALZ]*)+/g;
    var groups,
        separators = [],
        mappers = [];

    function createReplacer(wildcardsInMask) {
        return function (group) {
            return Array.prototype.reduce.call(group, function (previous, current, index) {
                return previous + wildcardToMapper(wildcardsInMask[index])(current);
            }, '');
        };
    }

    while ((groups = re.exec(mask)) !== null && groups[0] !== '') {
        separators.push(groups[1]);
        var wildcardsInMask = groups[2].split('');
        result += '(' + wildcardsInMask.map(mapToRegExp).join('') + ')?';
        mappers.push(createReplacer(wildcardsInMask));
    }

    return {
        regExp: new RegExp('^' + result + '$'),
        separators: separators,
        mappers: mappers
    };
}

export function easyMask(input, mask) {
    if (typeof input !== 'string' || typeof mask !== 'string' || mask === '') {
        return null;
    }
    if (isSeparator(mask[mask.length - 1])) {
        throw new Error("Mask must not end with a separator: " + mask[mask.length - 1]);
    }
    var re = buildRegExp(mask);

    var matches = re.regExp.exec(input.replace(/[^\dA-Za-z]/g, ''));
    if (matches) {
        var runningValue = '',
            separatorsToInsert = re.separators,
            index = 1,
            len = matches.length;
        while (index < len && matches[index] !== undefined) {
            var mapper = re.mappers[index-1];
            runningValue += (separatorsToInsert[index-1] || '') + mapper(matches[index]);
            index++;
        };
        return runningValue;
    }

    return "";
}
