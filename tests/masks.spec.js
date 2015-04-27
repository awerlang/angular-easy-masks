describe('easyMask', function () {

    var easyMask;
    beforeEach(module('wt.easy'));
    beforeEach(inject(function (_easyMask_) {
        easyMask = _easyMask_;
    }));

    var buildMask = function (mask) {
        return function (input) {
            return easyMask(input, mask);
        }
    };

    describe('empty mask ("")', function () {
        var myMask;
        beforeEach(function () {
            myMask = buildMask('');
        });

        it('empty string returns empty string', function () {
            expect(myMask('')).toEqual('');
        });

        it('non-empty string returns empty string', function () {
            expect(myMask('1')).toEqual('');
        });

        it('separator returns empty string', function () {
            expect(myMask('.')).toEqual('');
        });
    });

    describe('simple numeric mask ("9")', function () {
        var myMask;
        beforeEach(function () {
            myMask = buildMask('9');
        });

        it('empty string returns empty string', function () {
            expect(myMask('')).toEqual('');
        });

        it('single digit returns single digit', function () {
            expect(myMask('1')).toEqual('1');
        });

        it('double digit returns single digit', function () {
            expect(myMask('11')).toEqual('1');
        });

        it('separator returns empty string', function () {
            expect(myMask('.')).toEqual('');
        });

        it('alpha returns empty string', function () {
            expect(myMask('A')).toEqual('');
        });
    });

    describe('simple separator mask (".")', function () {
        var myMask;
        beforeEach(function () {
            myMask = buildMask('.');
        });

        it('empty string returns empty string', function () {
            expect(myMask('')).toEqual('');
        });

        it('single digit returns separator', function () {
            expect(myMask('1')).toEqual('.');
        });

        it('separator returns separator', function () {
            expect(myMask('.')).toEqual('.');
        });

        it('alpha returns separator', function () {
            expect(myMask('A')).toEqual('.');
        });

        it('double separator returns single separator', function () {
            expect(myMask('..')).toEqual('.');
        });

    });

    describe('mixed numeric mask ("999.99")', function () {
        var myMask;
        beforeEach(function () {
            myMask = buildMask('999.99');
        });

        it('empty string returns empty string', function () {
            expect(myMask('')).toEqual('');
        });

        it('separator returns empty string', function () {
            expect(myMask('.')).toEqual('');
        });

        it('alpha returns empty string', function () {
            expect(myMask('A')).toEqual('');
        });

        it('single digit returns single digit', function () {
            expect(myMask('1')).toEqual('1');
        });

        it('only digits returns formatted string', function () {
            expect(myMask('12345')).toEqual('123.45');
        });

        it('formatted string returns same string', function () {
            expect(myMask('123.45')).toEqual('123.45');
        });

        it('formatted string with any separator returns same string', function () {
            expect(myMask('123/45')).toEqual('123.45');
        });
    });

    describe('space inside mask ("999 99")', function () {
        var myMask;
        beforeEach(function () {
            myMask = buildMask('999 99');
        });

        it('empty string returns empty string', function () {
            expect(myMask('')).toEqual('');
        });

        it('separator returns empty string', function () {
            expect(myMask('.')).toEqual('');
        });

        it('alpha returns empty string', function () {
            expect(myMask('A')).toEqual('');
        });

        it('single digit returns single digit', function () {
            expect(myMask('1')).toEqual('1');
        });

        it('only digits returns formatted string', function () {
            expect(myMask('12345')).toEqual('123 45');
        });

        it('formatted string returns same string', function () {
            expect(myMask('123 45')).toEqual('123 45');
        });

        it('formatted string with any separator returns same string', function () {
            expect(myMask('123/45')).toEqual('123 45');
        });
    });

});
