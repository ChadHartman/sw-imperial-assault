/// <reference path="../modules/swia.ts"/>
/// <reference path="../services/CommandCardLoader.ts"/>

namespace swia.ng {

    const NO_FILTER = "no_filter";
    const NO_RESTRICTIONS = "no_restrictions";

    export class BuildController {

        public static readonly NAME = "buildController";
        public static readonly PATH = "/build";
        public static readonly HTML_NAME = "build";

        constructor(
            private readonly $scope: BuildController.Scope,
            ccLoader: CommandCardLoader) {

            $scope.affiliationFilter = NO_FILTER;
            $scope.restrictionFilter = NO_FILTER;

            this.$scope.isFilteredOut = this.isFilteredOut.bind(this);

            ccLoader.cards(this.onCardsLoad.bind(this));
        }

        private isFilteredOut(card: CommandCard): boolean {
            return this.isAffiliationFiltered(card) || this.isRestrictionFiltered(card);
        }

        private isAffiliationFiltered(card: CommandCard): boolean {

            if (this.$scope.affiliationFilter === NO_FILTER) {
                return false;
            }

            return this.$scope.affiliationFilter !== card.affiliation;
        }

        private isRestrictionFiltered(card: CommandCard): boolean {

            if (this.$scope.restrictionFilter === NO_FILTER) {
                return false;
            }

            if (this.$scope.restrictionFilter === NO_RESTRICTIONS && !card.restrictions) {
                return false;
            }

            return !card.restrictions ||
                card.restrictions.indexOf(this.$scope.restrictionFilter) === -1;
        }


        private onCardsLoad(cards: CommandCard[]) {
            this.$scope.cards = cards;

            let affiliations = new Set();
            let restrictions = new Set();

            for (let card of cards) {

                card.url = `assets/img/command/${card.id}.jpg`;
                
                if (card.affiliation) {
                    affiliations.add(card.affiliation);
                }
                
                if (card.restrictions) {
                    for (let restriction of card.restrictions) {
                        restrictions.add(restriction);
                    }
                }
            }

            this.$scope.affiliations = Array.from(affiliations).sort();
            this.$scope.restrictions = Array.from(restrictions).sort();
        }
    }

    export module BuildController {
        export interface Scope {
            cards: CommandCard[];
            affiliations: string[];
            restrictions: string[];
            affiliationFilter: string;
            restrictionFilter: string;
            isFilteredOut: (card: CommandCard) => boolean;
        }
    }

    module.controller(BuildController.NAME, [
        '$scope',
        CommandCardLoader.NAME,
        BuildController
    ]);
}