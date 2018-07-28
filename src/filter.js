export function easyMaskFilter(easyMask) {
    return function(input, mask) {
        return easyMask(input, mask);
    };
}
