/* global inject */
/// <reference path="../typings/jasmine/jasmine.d.ts"/>
/// <reference path="../typings/jquery/jquery.d.ts"/>
describe('directive', function () {

    function expectTrue(what, actualValue, expectedValue) {
        if (actualValue !== expectedValue) {
            expect(what).toBe(expectedValue);
        }
    }
    
    describe('simple mask', function () {

        var element, scope;
        beforeEach(module('wt.easy'));
        beforeEach(inject(function ($compile, $rootScope) {
            scope = $rootScope.$new();
            element = $compile('<input type="text" ng-model="inputText" wt-easy-mask="99.999-9">')(scope);
        }));

        it('sets attribute maxlength', function () {
            expect(element.attr('maxlength')).toBe("8");
        });

        it('sets attribute placeholder', function () {
            expect(element.attr('placeholder')).toBe("99.999-9");
        });

        it('displays already formatted text', function () {
            scope.inputText = "12.345-6";
            scope.$digest();
            expect(element.val()).toBe("12.345-6");
        });

        it('displays non-formatted text as formatted text', function () {
            scope.inputText = "123456";
            scope.$digest();
            expect(element.val()).toBe("12.345-6");
        });

        it('undefined text is valid', function () {
            scope.inputText = undefined;
            scope.$digest();
            expect(element.controller('ngModel').$error.mask).not.toBeDefined();
        });

        it('empty text is valid', function () {
            scope.inputText = "";
            scope.$digest();
            expect(element.controller('ngModel').$error.mask).not.toBeDefined();
        });

        it('complete text is valid', function () {
            scope.inputText = "12.345-6";
            scope.$digest();
            expect(element.controller('ngModel').$error.mask).not.toBeDefined();
        });

        it('partial text is NOT valid', function () {
            scope.inputText = "12";
            scope.$digest();
            expect(element.controller('ngModel').$error.mask).toBeDefined();
        });

        it('input inserts separators as appropriate', function () {
            var input = function (type, viewValue, modelValue) {
                element.val(type);
                element.triggerHandler('input');
                expect(element.controller('ngModel').$viewValue).toBe(viewValue);
                expect(element.controller('ngModel').$modelValue).toBe(modelValue);
            };

            scope.inputText = "";
            input('', '', null);
            input('1', '1');
            input('12', '12');
            input('123', '12.3');
            input('1234', '12.34');
            input('12345', '12.345');
            input('123456', '12.345-6', '12.345-6');
            input('12.345-6', '12.345-6', '12.345-6');
            input('12.345.6', '12.345-6', '12.345-6');
        });

        it('invalid value yields a null model value', function () {
            var input = function (type, viewValue, modelValue) {
                element.val(type);
                element.triggerHandler('input');
                expect(element.controller('ngModel').$viewValue).toBe(viewValue);
                expect(element.controller('ngModel').$modelValue).toBe(modelValue);
            };

            scope.inputText = "";
            input('', '', null);
            input('a', '', null);
            input('.', '', null);
            input(' ', '', null);
        });

        it('incomplete value yields an undefined model value', function () {
            var input = function (type, viewValue, modelValue) {
                element.val(type);
                element.triggerHandler('input');
                expect(element.controller('ngModel').$viewValue).toBe(viewValue);
                expect(element.controller('ngModel').$modelValue).toBe(modelValue);
            };

            scope.inputText = "";
            input('1', '1');
        });

        it('change text after initial load should ', function () {
            scope.inputText = "123";
            scope.$digest();
            expect(element.controller('ngModel').$error.mask).toBeDefined();

            scope.inputText = "12.345-6";
            scope.$digest();
            expect(element.controller('ngModel').$viewValue).toBe("12.345-6");
            expect(element.controller('ngModel').$modelValue).toBe("12.345-6");
        });

    });

    describe('mask with spaces', function () {

        var element, scope;
        beforeEach(module('wt.easy'));
        beforeEach(inject(function ($compile, $rootScope) {
            scope = $rootScope.$new();
            element = $compile('<input type="text" ng-model="inputText" wt-easy-mask="99.999 9">')(scope);
        }));

        it('displays already formatted text', function () {
            scope.inputText = "12.345 6";
            scope.$digest();
            expect(element.val()).toBe("12.345 6");
        });

        it('displays non-formatted text as formatted text', function () {
            scope.inputText = "123456";
            scope.$digest();
            expect(element.val()).toBe("12.345 6");
        });

        it('input inserts separators as appropriate', function () {
            var input = function (type, viewValue, modelValue) {
                element.val(type);
                element.triggerHandler('input');
                expect(element.controller('ngModel').$viewValue).toBe(viewValue);
                expect(element.controller('ngModel').$modelValue).toBe(modelValue);
            };

            scope.inputText = "";
            input('', '', null);
            input('1', '1');
            input('12', '12');
            input('123', '12.3');
            input('1234', '12.34');
            input('12345', '12.345');
            input('123456', '12.345 6', '12.345 6');
            input('12.345 6', '12.345 6', '12.345 6');
            input('12.345.6', '12.345 6', '12.345 6');
        });

        it('invalid value yields a null model value', function () {
            var input = function (type, viewValue, modelValue) {
                element.val(type);
                element.triggerHandler('input');
                expect(element.controller('ngModel').$viewValue).toBe(viewValue);
                expect(element.controller('ngModel').$modelValue).toBe(modelValue);
            };

            scope.inputText = "";
            input('', '', null);
            input('a', '', null);
            input('.', '', null);
            input(' ', '', null);
        });
    });

    describe('options: remove separators', function () {
        var element, scope;
        beforeEach(module('wt.easy'));
        beforeEach(inject(function ($compile, $rootScope) {
            scope = $rootScope.$new();
            element = $compile('<input type="text" ng-model="inputText" wt-easy-mask="99.999-9" wt-easy-mask-options="{removeSeparators: true}">')(scope);
        }));

        it('maintain separators when pristine', function () {
            scope.inputText = "12.345-6";
            scope.$digest();
            expect(element.controller('ngModel').$viewValue).toBe("12.345-6");
            expect(element.controller('ngModel').$modelValue).toBe("12.345-6");
        });

        it('remove separators on input complete', function () {
            var input = function (type, viewValue, modelValue) {
                element.val(type);
                element.triggerHandler('input');
                expect(element.controller('ngModel').$viewValue).toBe(viewValue);
                expect(element.controller('ngModel').$modelValue).toBe(modelValue);
            };

            input('12.345.6', '12.345-6', '123456');
        });
    });

    describe('options: remove mask', function () {
        var element, scope;
        beforeEach(module('wt.easy'));
        beforeEach(inject(function ($compile, $rootScope) {
            scope = $rootScope.$new();
            element = $compile('<input type="text" ng-model="inputText" wt-easy-mask="(99).999-9" wt-easy-mask-options="{removeMask: true}">')(scope);
        }));

        it('maintain mask when pristine', function () {
            scope.inputText = "(12).345-6";
            scope.$digest();
            expect(element.controller('ngModel').$viewValue).toBe("(12).345-6");
            expect(element.controller('ngModel').$modelValue).toBe("(12).345-6");
        });

        it('remove mask on input complete', function () {
            var input = function (type, viewValue, modelValue) {
                element.val(type);
                element.triggerHandler('input');
                expect(element.controller('ngModel').$viewValue).toBe(viewValue);
                expect(element.controller('ngModel').$modelValue).toBe(modelValue);
            };

            input('(12).345.6', '(12).345-6', '123456');
        });
    });

    describe('options: empty placeholder', function () {
        var element, scope;
        beforeEach(module('wt.easy'));
        beforeEach(inject(function ($compile, $rootScope) {
            scope = $rootScope.$new();
            element = $compile('<input type="text" ng-model="inputText" wt-easy-mask="(99).999-9" wt-easy-mask-options="{emptyPlaceholder: true}" placeholder="(99).999-9">')(scope);
        }));

        it('sets attribute placeholder to empty', function () {
            expect(element.attr('placeholder')).toBe("");
        });
    });

    describe('mask with optional symbols', function () {
        var element, scope;
        beforeEach(module('wt.easy'));
        beforeEach(inject(function ($compile, $rootScope) {
            scope = $rootScope.$new();
            element = $compile('<input type="text" ng-model="inputText" wt-easy-mask="09.999-9">')(scope);
        }));

        it('complete text is valid', function () {
            scope.inputText = "123456";
            scope.$digest();
            expect(element.controller('ngModel').$error.mask).not.toBeDefined();
        });

        it('complete text is valid, skipping optional', function () {
            scope.inputText = "12345";
            scope.$digest();
            expect(element.controller('ngModel').$error.mask).not.toBeDefined();
        });

        it('partial text is NOT valid', function () {
            scope.inputText = "1234";
            scope.$digest();
            expect(element.controller('ngModel').$error.mask).toBeDefined();
        });

    });

    describe('input exceeds mask in length', function () {
        var element, scope;
        beforeEach(module('wt.easy'));
        beforeEach(inject(function ($compile, $rootScope) {
            scope = $rootScope.$new();
            element = $compile('<input type="text" ng-model="inputText" wt-easy-mask="99.9">')(scope);
        }));

        it('should not reformat input, by default', function () {
            var input = function (originalValue, viewValue) {
                scope.inputText = originalValue;
                scope.$digest();
                expect(element.controller('ngModel').$viewValue).toBe(viewValue);
                expect(element.controller('ngModel').$modelValue).toBe(originalValue);
            };

            scope.inputText = "";
            input('12', '12');
            input('12.3', '12.3');
            input('12.34', '12.34');
        });

    });
    
    describe('keypress', function () {
        var element, scope;
        beforeEach(module('wt.easy'));
        beforeEach(inject(function ($compile, $rootScope) {
            scope = $rootScope.$new();
            element = $compile('<input type="text" ng-model="inputText" wt-easy-mask="99.9">')(scope);

            document.body.appendChild(element[0]);
        }));
        
        afterEach(function () {
            element.remove();
        });
        
        function input(initialValue, caretPosition, keyCode, shouldPreventDefault, output, selLength) {
            scope.inputText = initialValue;
            scope.$digest();
            element.prop('selectionStart', caretPosition);
            element.prop('selectionEnd', caretPosition + (selLength || 0));
            var event = $.Event('keypress', {which: keyCode});
            $(element).trigger(event);

            //expect(event.isDefaultPrevented()).toBe(shouldPreventDefault);
            expectTrue('event.isDefaultPrevented()', event.isDefaultPrevented(), shouldPreventDefault);
            // TODO: triggering events do not reflect into changes in UI
            // expect(scope.inputText).toBe(output);
        };

        it('SPACE key should be discarded', function () {
            input('', 0, 32, true, '');
            input('1', 0, 32, true, '1');
            input('1', 1, 32, true, '1');
        });

        it('wrong symbol is discarded', function () {
            input('', 0, 65, true, '');
            input('1', 0, 65, true, '1');
            input('1', 1, 65, true, '1');
        });

        it('correct symbol is accepted', function () {
            input('', 0, 48, false, '');
            input('1', 0, 48, false, '01');
            input('1', 1, 48, false, '10');
        });

        it('selected text is replaced', function () {
            input('1', 0, 50, false, '2', 1);
            input('10', 0, 50, false, '2', 1);
            input('10', 0, 50, false, '2', 2);
        });

        it('ENTER key is not handled', function () {
            input('10', 0, 13, false, '10');
            input('10', 2, 13, false, '10');
            input('10', 0, 13, false, '10', 2);
        });
    });
});
