/* global inject */
/// <reference path="../typings/jasmine/jasmine.d.ts"/>
describe('provider', function () {

    var easyMaskProvider;
    var easyMask;
    beforeEach(module('wt.easy'));

    describe('mask registry', function () {
        var someMaskName = 'name';
        var someMaskValue = '999.99';

        describe('can retrieve a published mask', function () {
            beforeEach(function () {
                module(function (_easyMaskProvider_) {
                    easyMaskProvider = _easyMaskProvider_;
                    easyMaskProvider.publishMask(someMaskName, someMaskValue);
                });
            });
            beforeEach(function () {
                inject(function (_easyMask_) {
                    easyMask = _easyMask_;
                });
            });

            it('by name', function () {
                var mask = easyMask.getMask(someMaskName);
                expect(mask).toEqual(someMaskValue);
            });

            it('the comparison is case insensitive', function () {
                var mask1 = easyMask.getMask(someMaskName.toLowerCase());
                expect(mask1).toEqual(someMaskValue);

                var mask2 = easyMask.getMask(someMaskName.toUpperCase());
                expect(mask2).toEqual(someMaskValue);
            });
        });
    });
});
