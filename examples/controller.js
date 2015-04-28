function TestController() {
    this.field1 = '';
    this.field2 = '012.345.678-90';
    this.field3 = '01234567890';
    this.load = function () {
        this.field2 = (Math.random() * 1000000000000 >> 0).toString() + '4';
    };
    this.resetWithCancel = function(e, field) {
        if (e.keyCode == 27) {
            this.myForm[field].$rollbackViewValue();
        }
    };
}

angular.module('app', ['wt.easy'])
    .controller('TestController', TestController);