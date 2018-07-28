import '../src/module';

describe('filter', function () {

    describe('filter', function () {

        var scope, $interpolate;
        beforeEach(module('wt.easy'));
        beforeEach(inject(function ($compile, $rootScope, _$interpolate_) {
            scope = $rootScope.$new();
            $interpolate = _$interpolate_;
        }));

        it('can use mask as a filter', function () {
            scope.data = '123456';
            var result = $interpolate("{{data | easyMask:'99.999-9'}}")(scope);

            expect(result).toEqual('12.345-6');
        });

    });
});
