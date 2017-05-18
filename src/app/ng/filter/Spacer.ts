namespace swia.ng.filter {
    module.filter('spacer', function () {
        return function (value) {
            return (!value) ? '' : value.split('_').join(' ');
        };
    });
}