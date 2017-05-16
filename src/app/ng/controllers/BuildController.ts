/// <reference path="../modules/swia.ts"/>
/// <reference path="../services/CommandCardLoader.ts"/>

namespace swia.ng {

    export class BuildController {

        public static readonly NAME = "buildController";
        public static readonly PATH = "/build";
        public static readonly HTML_NAME = "build";

        constructor(
            private readonly $scope: BuildController.Scope,
            ccLoader: CommandCardLoader) {
            ccLoader.cards(this.onCardsLoad.bind(this));
        }

        private onCardsLoad(cards: CommandCard[]) {
            this.$scope.cards = cards;
        }
    }

    export module BuildController {
        export interface Scope {
            cards: CommandCard[];
        }
    }

    module.controller(BuildController.NAME, [
        '$scope',
        CommandCardLoader.NAME,
        BuildController
    ]);
}