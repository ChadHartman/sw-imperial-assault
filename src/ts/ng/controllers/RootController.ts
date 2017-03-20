/// <reference path="../modules/App.ts"/>

namespace App.Ng {

    interface IScope {
        skirmishes: Array<App.Model.IItemInfo>
    }

    export class RootController {

        public static readonly NAME = "rootController";
        public static readonly PATH = "/";
        public static readonly HTML_NAME = "root";

        private readonly $scope;

        constructor($scope: any, $http: any) {
            this.$scope = $scope;

            let self = this;
            let req = this.createRequest();
            $http(req).then(function (res) {
                self.$scope.skirmishes = res.data.array;
            });
        }

        private createRequest() {
            return {
                url: "assets/json/skirmish/skirmishes.json",
                method: 'GET',
                cache: true
            }
        }
    }
}

App.Ng.module.controller(App.Ng.RootController.NAME,
    [
        '$scope',
        '$http',
        App.Ng.RootController
    ]
);
