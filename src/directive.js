export function wtEasyMask($parse, $log, easyMask) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function link(scope, element, attrs, ngModelCtrl) {
            var mask = easyMask.getMask(attrs.wtEasyMask) || attrs.placeholder || '';
            var options = attrs.wtEasyMaskOptions ? $parse(attrs.wtEasyMaskOptions)(scope) : {};

            var removeSeparators = options.removeSeparators;
            var removeMask = options.removeMask;
            var emptyPlaceholder = options.emptyPlaceholder;

            attrs.maxlength || attrs.$set('maxlength', mask.length);
            attrs.$set('placeholder', emptyPlaceholder ? '' : attrs.placeholder || mask);

            var isCompleted = function (value) {
                var zeroes = mask.match(/0/g);
                var optionalsCount = zeroes ? zeroes.length : 0;
                return (mask.length - optionalsCount) <= value.length;
            };

            var isValid = function (modelValue, viewValue) {
                return viewValue == null || viewValue.length === 0 || isCompleted(viewValue);
            };

            ngModelCtrl.$validators.mask = function (modelValue, viewValue) {
                return isValid(modelValue, viewValue);
            };

            ngModelCtrl.$formatters.push(function (value) {
                var formattedValue = easyMask(value, mask);
                return formattedValue !== '' ? formattedValue : value;
            });

            ngModelCtrl.$parsers.push(function (value) {
                var parsedValue = easyMask(value, mask);
                if (removeSeparators) {
                    $log.warn("This option will soon be deprecated. Use removeMask instead.");
                    parsedValue = parsedValue.replace(/[.\-/ ]/g, '');
                }
                if (removeMask) {
                    parsedValue = parsedValue.replace(/[\W_]+/g, "");
                }
                return parsedValue === '' ? null : parsedValue;
            });

            element.on('keypress', function (event) {
                var composed = event.altKey || event.ctrlKey;
                if (composed) {
                    return;
                }
                var keyIsSpace = event.which === 32;
                if (keyIsSpace) {
                    event.preventDefault();
                    return;
                }
                var keyIsNonPrintable = event.which < 48;
                if (keyIsNonPrintable) {
                    return;
                }
                if (element.prop('selectionStart') === element.prop('selectionEnd')) {
                    var currentValue = element.val();
                    var futureValue = currentValue.substring(0, element.prop('selectionStart'))
                        + String.fromCharCode(event.which)
                        + currentValue.substring(element.prop('selectionEnd'));
                    var parsedValue = easyMask(futureValue, mask);
                    if (parsedValue.length <= currentValue.length) {
                        event.preventDefault();
                    }
                }
            });

            element.on('input', function (event) {
                var parsedValue = easyMask(element.val(), mask);
                if (ngModelCtrl.$viewValue !== parsedValue) {
                    ngModelCtrl.$setViewValue(parsedValue);
                    ngModelCtrl.$render();
                }
            });
        }
    };
}
