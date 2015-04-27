'use strict';

angular.module('wt.easy', [])
    .directive('wtEasyMask', wtEasyMask)
    .factory('easyMask', function () {
        return easyMask;
    });