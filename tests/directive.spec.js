describe('easy-mask', function () {

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
});
