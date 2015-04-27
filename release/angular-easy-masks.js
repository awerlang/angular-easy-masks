// https://github.com/awerlang/angular-easy-masks
(function() {
    "use strict";
    function isSeparator(char) {
        return char === "." || char === "-" || char === "/" || char === " ";
    }
    function isDigit(char) {
        return char >= "0" && char <= "9";
    }
    function testPosition(mask, position, char) {
        var charAtPos = mask[position];
        switch (charAtPos) {
          case "9":
            return isDigit(char);

          case " ":
            return true;

          case ".":
          case "-":
          case "/":
            return isSeparator(char);

          default:
            return false;
        }
    }
    function easyMask(input, mask) {
        if (typeof input !== "string") {
            return null;
        }
        var parsedValue = "";
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
    "use strict";
    function wtEasyMask(easyMask) {
        return {
            restrict: "A",
            require: "ngModel",
            link: function link(scope, element, attrs, ngModelCtrl) {
                var mask = attrs.wtEasyMask || attrs.placeholder || "";
                attrs.maxlength || attrs.$set("maxlength", mask.length);
                var isCompleted = function(value) {
                    return mask.length === value.length;
                };
                var isValid = function(modelValue, viewValue) {
                    return viewValue == null || viewValue.length === 0 || isCompleted(viewValue);
                };
                ngModelCtrl.$validators.mask = function(modelValue, viewValue) {
                    return isValid(modelValue, viewValue);
                };
                ngModelCtrl.$formatters.push(function(value) {
                    return easyMask(value, mask);
                });
                ngModelCtrl.$parsers.push(function(value) {
                    var parsedValue = easyMask(value, mask);
                    return parsedValue === "" ? null : parsedValue;
                });
                element.on("keypress", function(event) {
                    var keyIsSpace = event.which === 32;
                    if (keyIsSpace) {
                        event.preventDefault();
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
    "use strict";
    angular.module("wt.easy", []).directive("wtEasyMask", wtEasyMask).factory("easyMask", function() {
        return easyMask;
    });
})();