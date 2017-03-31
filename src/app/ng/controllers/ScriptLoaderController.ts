/// <reference path="../modules/App.ts"/>
/// <reference path="../services/AbilityLoader.ts"/>

namespace App.Ng {

    export class ScriptLoaderController implements AbilityLoader.IRequestListener {

        public static readonly NAME = "scriptLoaderController";

        private readonly $scope: ScriptLoaderController.IScope;

        constructor(
            $scope: ScriptLoaderController.IScope,
            abilityLoader: AbilityLoader) {

            abilityLoader.loadRequestListener = this;

            this.$scope = $scope;
            this.$scope.scripts = new Array<ScriptLoaderController.IJavaScript>();
        }

        requestScript(src: string) {
            this.$scope.scripts.push({ src: src });
            this.$scope.$apply();
        }
    }

    export module ScriptLoaderController {

        export interface IJavaScript {
            src: string;
        }

        export interface IScope {
            $apply: Function;
            scripts: Array<IJavaScript>;
        }
    }
}

App.Ng.module.controller(App.Ng.ScriptLoaderController.NAME,
    [
        '$scope',
        App.Ng.AbilityLoader.NAME,
        App.Ng.ScriptLoaderController
    ]
);
