// https://github.com/awerlang/angular-easy-masks
(function() {
    "use strict";
    function mapToRegExp(item) {
        var map = {};
        map["0"] = "\\d*?";
        map["9"] = "\\d?";
        map["A"] = "[\\dA-Za-z]*?";
        map["L"] = "[A-Za-z]?";
        map["Z"] = "[A-Za-z]*?";
        return map[item];
    }
    function isSeparator(char) {
        return mapToRegExp(char) === undefined;
    }
    function wildcardToMapper(item) {
        var noop = function(item) {
            return item || "";
        };
        var map = {};
        map["A"] = function(item) {
            return item.toUpperCase();
        };
        map["L"] = function(item) {
            return item.toUpperCase();
        };
        map["Z"] = function(item) {
            return item.toLowerCase();
        };
        return map[item] || noop;
    }
    function buildRegExp(mask) {
        var result = "";
        var re = /([^09ALZ]*)?([09ALZ]*)+/g;
        var groups, separators = [], mappers = [];
        function createReplacer(wildcardsInMask) {
            return function(group) {
                return Array.prototype.reduce.call(group, function(previous, current, index) {
                    return previous + wildcardToMapper(wildcardsInMask[index])(current);
                }, "");
            };
        }
        while ((groups = re.exec(mask)) !== null && groups[0] !== "") {
            separators.push(groups[1]);
            var wildcardsInMask = groups[2].split("");
            result += "(" + wildcardsInMask.map(mapToRegExp).join("") + ")?";
            mappers.push(createReplacer(wildcardsInMask));
        }
        return {
            regExp: new RegExp("^" + result + "$"),
            separators: separators,
            mappers: mappers
        };
    }
    function easyMask(input, mask) {
        if (typeof input !== "string" || typeof mask !== "string" || mask === "") {
            return null;
        }
        if (isSeparator(mask[mask.length - 1])) {
            throw new Error("Mask must not end with a separator: " + mask[mask.length - 1]);
        }
        var re = buildRegExp(mask);
        var matches = re.regExp.exec(input.replace(/[^\dA-Za-z]/g, ""));
        if (matches) {
            var runningValue = "", separatorsToInsert = re.separators, index = 1, len = matches.length;
            while (index < len && matches[index] !== undefined) {
                var mapper = re.mappers[index - 1];
                runningValue += (separatorsToInsert[index - 1] || "") + mapper(matches[index]);
                index++;
            }
            return runningValue;
        }
        return "";
    }
    "use strict";
    function wtEasyMask($parse, easyMask) {
        return {
            restrict: "A",
            require: "ngModel",
            link: function link(scope, element, attrs, ngModelCtrl) {
                var mask = easyMask.getMask(attrs.wtEasyMask) || attrs.placeholder || "";
                attrs.maxlength || attrs.$set("maxlength", mask.length);
                attrs.placeholder || attrs.$set("placeholder", mask);
                var options = attrs.wtEasyMaskOptions ? $parse(attrs.wtEasyMaskOptions)(scope) : {};
                var removeSeparators = options.removeSeparators;
                var isCompleted = function(value) {
                    var zeroes = mask.match(/0/g);
                    var optionalsCount = zeroes ? zeroes.length : 0;
                    return mask.length - optionalsCount <= value.length;
                };
                var isValid = function(modelValue, viewValue) {
                    return viewValue == null || viewValue.length === 0 || isCompleted(viewValue);
                };
                ngModelCtrl.$validators.mask = function(modelValue, viewValue) {
                    return isValid(modelValue, viewValue);
                };
                ngModelCtrl.$formatters.push(function(value) {
                    var formattedValue = easyMask(value, mask);
                    return formattedValue !== "" ? formattedValue : value;
                });
                ngModelCtrl.$parsers.push(function(value) {
                    var parsedValue = easyMask(value, mask);
                    if (removeSeparators) {
                        parsedValue = parsedValue.replace(/[.\-\/ ]/g, "");
                    }
                    return parsedValue === "" ? null : parsedValue;
                });
                element.on("keypress", function(event) {
                    var keyIsEnter = event.which === 13;
                    if (keyIsEnter) return;
                    var keyIsSpace = event.which === 32;
                    if (keyIsSpace) {
                        event.preventDefault();
                    } else if (element.prop("selectionStart") === element.prop("selectionEnd")) {
                        var currentValue = element.val();
                        var futureValue = currentValue.substring(0, element.prop("selectionStart")) + String.fromCharCode(event.which) + currentValue.substring(element.prop("selectionEnd"));
                        var parsedValue = easyMask(futureValue, mask);
                        if (parsedValue.length <= currentValue.length) {
                            event.preventDefault();
                        }
                    }
                });
                element.on("input", function(event) {
                    var parsedValue = easyMask(element.val(), mask);
                    if (ngModelCtrl.$viewValue !== parsedValue) {
                        ngModelCtrl.$setViewValue(parsedValue);
                        ngModelCtrl.$render();
                    }
                });
            }
        };
    }
    function easyMaskFilter(easyMask) {
        return function(input, mask) {
            return easyMask(input, mask);
        };
    }
    "use strict";
    angular.module("wt.easy", []).directive("wtEasyMask", [ "$parse", "easyMask", wtEasyMask ]).provider("easyMask", function() {
        var registry = Object.create(null);
        this.publishMask = function(publishedName, mask) {
            registry[publishedName.toLowerCase()] = mask;
        };
        this.$get = function() {
            easyMask.getMask = function(mask) {
                return registry[mask.toLowerCase()] || mask;
            };
            return easyMask;
        };
    }).filter("easyMask", [ "easyMask", easyMaskFilter ]);
})();