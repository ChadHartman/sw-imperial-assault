namespace App.Ng {

    /**
     * This directive exists because if the script src attr is populated 
     * with angular-formatted arguments, the page will attempt to load those non-urls.
     */
    export class ScriptObserverDirective {
        public static readonly NAME = "scriptObserver";
        public static readonly RESTRICT = "A";

        constructor($scope, $element, $attr) {
            $element[0].addEventListener("load", this.onScriptLoad.bind(this), true);
        }

        private onScriptLoad(e) {
            console.log(e);
        }
    }
}

App.Ng.module.directive(App.Ng.LazySrcDirective.NAME, function () {
    return {
        restrict: App.Ng.ScriptObserverDirective.RESTRICT,
        link: function ($scope, $element, $attr) {
            new App.Ng.ScriptObserverDirective($scope, $element, $attr);
        }
    };
});