/// <reference path="../modules/App.ts"/>
/// <reference path="../services/ArmyLoader.ts"/>
/// <reference path="../services/SkirmishLoader.ts"/>

namespace App.Ng {

    export class SkirmishController {

        public static readonly NAME = "skirmishController";
        public static readonly PATH = "/skirmish/:skirmish_id";
        public static readonly HTML_NAME = "skirmish";

        private readonly $scope: any;

        constructor($scope) {

        }
    }
}

App.Ng.module.controller(
    App.Ng.SkirmishController.NAME,
    [
        '$scope',
        App.Ng.SkirmishController]
);
