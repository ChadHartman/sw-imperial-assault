/// <reference path="../modules/App.ts"/>
/// <reference path="../services/StateCache.ts"/>

namespace App.Ng {

    export class SkirmishController {

        public static readonly NAME = "skirmishController";
        public static readonly PATH = "/skirmish/:skirmish_id";
        public static readonly HTML_NAME = "skirmish";
        public static readonly EVENT_SAVE_STATE = "save_state";

        private readonly $scope: any;

        constructor($scope) {
            this.$scope = $scope;
            this.$scope.saveState = this.saveState.bind(this);
        }

        private saveState() {
            this.$scope.$broadcast(SkirmishController.EVENT_SAVE_STATE);
        }
    }
}

App.Ng.module.controller(
    App.Ng.SkirmishController.NAME,
    [
        '$scope',
        App.Ng.StateCache.NAME,
        App.Ng.SkirmishController]
);
