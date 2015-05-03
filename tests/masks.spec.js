describe('service', function () {

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

        it('any input value returns null', function () {
            expect(myMask('')).toEqual(null);
            expect(myMask('1')).toEqual(null);
            expect(myMask('.')).toEqual(null);
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
            myMask = function(item) {
                return function () {
                    buildMask('.')(item);
                }
            };
        });

        it('for any input value throws error', function () {
            expect(myMask('')).toThrow();
            expect(myMask('1')).toThrow();
            expect(myMask('.')).toThrow();
            expect(myMask('A')).toThrow();
            expect(myMask('..')).toThrow();
        });

    });

    describe('input exceeds in length the pattern', function () {
        var myMask;
        beforeEach(function () {
            myMask = buildMask('9');
        });

        xit('by default do not reformat', function () {
            expect(myMask('11')).toEqual('11');
            expect(myMask('1.1')).toEqual('1.1');
        });
    });

    describe('unknown characters in input', function () {
        var myMask;
        beforeEach(function () {
            myMask = buildMask('99.99');
        });

        xit('strips alpha characters at beginning of input', function () {
            // test disabled as of now is not supported
            // feature handled by directive only
            expect(myMask('a')).toEqual('');
            expect(myMask('a1')).toEqual('1');
        });
        xit('strips alpha characters at the middle of input', function () {
            // test disabled as of now is not supported
            // feature handled by directive only
            expect(myMask('1a1')).toEqual('11');
            expect(myMask('1aa1')).toEqual('11');
        });
        xit('strips alpha characters at the end of input', function () {
            // test disabled as of now is not supported
            // feature handled by directive only
            expect(myMask('1a')).toEqual('1');
            expect(myMask('1aa')).toEqual('1');
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

    describe('mask with optional symbols ("09")', function () {
        var myMask;
        beforeEach(function () {
            myMask = buildMask('09');
        });

        it('1 digit', function () {
            expect(myMask('1')).toEqual('1');
        });

        it('2 digits', function () {
            expect(myMask('12')).toEqual('12');
        });
    });

    describe('mask with optional symbols ("09.")', function () {
        var myMask;
        beforeEach(function () {
            myMask = function(item) {
                return function () {
                    buildMask('09.')(item);
                }
            };
        });

        it('1 digit', function () {
            expect(myMask('1.')).toThrow();
        });

        it('2 digits', function () {
            expect(myMask('12.')).toThrow();
        });
    });

    describe('mask with optional symbols ("9-0")', function () {
        var myMask;
        beforeEach(function () {
            myMask = buildMask('9-0');
        });

        it('1 digit', function () {
            expect(myMask('1')).toEqual('1');
        });

        it('2 digits', function () {
            expect(myMask('12')).toEqual('1-2');
        });

        it('2 digits', function () {
            expect(myMask('1-2')).toEqual('1-2');
        });
    });

    describe('mask with optional symbols ("09999-9999")', function () {
        var myMask;
        beforeEach(function () {
            myMask = buildMask('09999-9999');
        });

        it('8 digits', function () {
            expect(myMask('1234-5678')).toEqual('1234-5678');
        });

        it('8 digits', function () {
            expect(myMask('12345678')).toEqual('1234-5678');
        });

        it('9 digits', function () {
            expect(myMask('12345-6789')).toEqual('12345-6789');
        });

        it('9 digits', function () {
            expect(myMask('123456789')).toEqual('12345-6789');
        });
    });

    describe('mask with optional symbols ("09999-9999"), partial text', function () {
        var myMask;
        beforeEach(function () {
            myMask = buildMask('(99) 09999-9999');
        });

        it('9 digits', function () {
            expect(myMask('1')).toEqual('(1');
            expect(myMask('12')).toEqual('(12');
            expect(myMask('123')).toEqual('(12) 3');
            expect(myMask('1234')).toEqual('(12) 34');
            expect(myMask('12345')).toEqual('(12) 345');
            expect(myMask('123456')).toEqual('(12) 3456');
            expect(myMask('1234567')).toEqual('(12) 3456-7');
            expect(myMask('12345678')).toEqual('(12) 3456-78');
            expect(myMask('123456789')).toEqual('(12) 3456-789');
            expect(myMask('1234567890')).toEqual('(12) 3456-7890');
            expect(myMask('12345678901')).toEqual('(12) 34567-8901');
        });
    });
});
