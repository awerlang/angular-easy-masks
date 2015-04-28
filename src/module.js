'use strict';

angular.module('wt.easy', [])
    .directive('wtEasyMask', wtEasyMask)
    .provider('easyMask', function () {
        var registry = Object.create(null);
        this.publishMask = function (publishedName, mask) {
            registry[publishedName.toLowerCase()] = mask;
        };
        this.$get = function () {
            easyMask.getMask = function (mask) {
                return registry[mask.toLowerCase()] || mask;
            };
            return easyMask;
        };
    });