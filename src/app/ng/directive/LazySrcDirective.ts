namespace App.Ng {

    /**
     * This directive exists because if the script src attr is populated 
     * with angular-formatted arguments, the page will attempt to load those non-urls.
     */
    export class LazySrcDirective {
        public static readonly NAME = "lazySrc";
        public static readonly RESTRICT = "A";

        constructor($scope, $element, $attr) {
            $element.attr('src', $attr[LazySrcDirective.NAME]);

            $scope.$watch(function () {
                return $element.attr('data-lazy-src');
            }, function (value) {
                $element.attr('src', $attr[LazySrcDirective.NAME]);
            });
        }
    }
}

App.Ng.module.directive(App.Ng.LazySrcDirective.NAME, function () {
    return {
        restrict: App.Ng.LazySrcDirective.RESTRICT,
        link: function ($scope, $element, $attr) {
            console.log($attr[App.Ng.LazySrcDirective.NAME]);
            new App.Ng.LazySrcDirective($scope, $element, $attr);
        }
    };
});