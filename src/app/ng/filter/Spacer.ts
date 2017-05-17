namespace swia.ng.filter {
    module.filter('spacer', function () {
        return function (value) {
            console.log(value);
            return (!value) ? '' : value.split('_').join(' ');
        };
    });
}