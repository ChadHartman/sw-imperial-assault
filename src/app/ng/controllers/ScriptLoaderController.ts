/// <reference path="../modules/App.ts"/>
/// <reference path="../services/AbilityLoader.ts"/>

namespace App.Ng {

    export class ScriptLoaderController implements AbilityLoader.IRequestListener {

        public static readonly NAME = "scriptLoaderController";

        private readonly $scope: ScriptLoaderController.IScope;
        private readonly $timeout: Function;

        constructor(
            $scope: ScriptLoaderController.IScope,
            $timeout: Function,
            abilityLoader: AbilityLoader) {

            abilityLoader.loadRequestListener = this;

            this.$scope = $scope;
            this.$scope.scripts = new Array<ScriptLoaderController.IJavaScript>();

            this.$timeout = $timeout;
        }

        requestScript(src: string): boolean {

            if (this.isScriptRegistered(src)) {
                return false;
            }

            this.$scope.scripts.push({ src: src });
            this.$timeout(angular.noop);
            return true;
        }

        private isScriptRegistered(src: string): boolean {
            for (let script of this.$scope.scripts) {
                if (script.src === src) {
                    return true;
                }
            }
            return false;
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
        '$timeout',
        App.Ng.AbilityLoader.NAME,
        App.Ng.ScriptLoaderController
    ]
);
