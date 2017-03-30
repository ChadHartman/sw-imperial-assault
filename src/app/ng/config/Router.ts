/// <reference path="../modules/App.ts"/>

App.Ng.module
    .config(['$locationProvider', function ($locationProvider) {
        $locationProvider.hashPrefix('');
    }])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when(App.Ng.RootController.PATH, {
                templateUrl: `assets/html/routes/${App.Ng.RootController.HTML_NAME}.html`
                , controller: App.Ng.RootController.NAME
            })
            .when(App.Ng.ArmyController.PATH, {
                templateUrl: `assets/html/routes/${App.Ng.ArmyController.HTML_NAME}.html`
                , controller: App.Ng.ArmyController.NAME
            })
            .when(App.Ng.SkirmishController.PATH, {
                templateUrl: `assets/html/routes/${App.Ng.SkirmishController.HTML_NAME}.html`
                , controller: App.Ng.SkirmishController.NAME
            })
            .when(App.Ng.SkirmishSetupController.PATH, {
                templateUrl: `assets/html/routes/${App.Ng.SkirmishSetupController.HTML_NAME}.html`
                , controller: App.Ng.SkirmishSetupController.NAME
            })
            .when(App.Ng.TileBuilderController.PATH, {
                templateUrl: `assets/html/routes/${App.Ng.TileBuilderController.HTML_NAME}.html`
                , controller: App.Ng.TileBuilderController.NAME
            })
            .otherwise({
                redirectTo: '/'
            });
    }]);