namespace App.Ng {

    /**
     * This directive exists because if the script src attr is populated 
     * with angular-formatted arguments, the page will attempt to load those non-urls.
     */
    export class SymbolizeDirective {

        public static readonly NAME = "symbolize";
        public static readonly RESTRICT = "A";
        public static readonly ISOLATE_SCOPE = {
            symbolize: '='
        };
        private static readonly EXCLUSIONS = ["accuracy"];

        constructor($scope: SymbolizeDirective.IScope, $element, $attr) {

            let fontSize = window.getComputedStyle($element[0]).fontSize;

            var match: RegExpExecArray | null = null;
            var pattern = /:\w+:/;

            let text = $scope.symbolize;

            while (match = pattern.exec(text)) {
                // ":surge:" to "surge"
                let name = match[0].substr(1, match[0].length - 2).toLowerCase();
                if(SymbolizeDirective.EXCLUSIONS.indexOf(name) === -1) {
                    text = text.replace(match[0], 
                        `<img 
                            class=\"symbol\" 
                            src="assets/png/symbol/${name}.png"
                            style="height: ${fontSize}"/>`);
                } else {
                    text = text.replace(match[0], name);
                }
            }

            $element[0].innerHTML = text;
        }
    }

    export module SymbolizeDirective {
        export interface IScope {
            symbolize: string;
        }
    }
}

App.Ng.module.directive(App.Ng.SymbolizeDirective.NAME, function () {
    return {
        restrict: App.Ng.SymbolizeDirective.RESTRICT,
        scope: App.Ng.SymbolizeDirective.ISOLATE_SCOPE,
        link: function ($scope, $element, $attr) {
            new App.Ng.SymbolizeDirective($scope, $element, $attr);
        }
    };
});