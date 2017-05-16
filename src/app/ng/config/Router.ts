/// <reference path="../modules/swia.ts"/>
/// <reference path="../controllers/IndexController.ts"/>
/// <reference path="../controllers/BuildController.ts"/>
/// <reference path="../controllers/PlayController.ts"/>

namespace swia.ng {

    function addRoute($routeProvider, controller: any) {
        $routeProvider.when(controller.PATH, {
            templateUrl: `assets/html/routes/${controller.HTML_NAME}.html`
            , controller: controller.NAME
        })
    }

    module
        .config(['$locationProvider', function ($locationProvider) {
            $locationProvider.hashPrefix('');
        }])
        .config(['$routeProvider', function ($routeProvider) {
            addRoute($routeProvider, IndexController);
            addRoute($routeProvider, BuildController);
            addRoute($routeProvider, PlayController);
            $routeProvider.otherwise({
                redirectTo: '/'
            });
        }]);
}