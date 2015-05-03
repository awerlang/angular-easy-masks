describe('provider', function () {

    var easyMask;
    beforeEach(module('wt.easy'));

    describe('mask registry', function () {
        var someMaskName = 'name';
        var someMaskValue = '999.99';

        describe('can retrieve a published mask', function () {
            var easyMaskProvider;
            beforeEach(function () {
                module(function (_easyMaskProvider_) {
                    easyMaskProvider = _easyMaskProvider_;
                    easyMaskProvider.publishMask(someMaskName, someMaskValue);
                });
            });

            it('by name', function () {
                inject(function (easyMask) {
                    var mask = easyMask.getMask(someMaskName);
                    expect(mask).toEqual(someMaskValue);
                });
            });

            it('the comparison is case insensitive', function () {
                inject(function (easyMask) {
                    var mask1 = easyMask.getMask(someMaskName.toLowerCase());
                    expect(mask1).toEqual(someMaskValue);

                    var mask2 = easyMask.getMask(someMaskName.toUpperCase());
                    expect(mask2).toEqual(someMaskValue);
                });
            });
        });
    });
});
