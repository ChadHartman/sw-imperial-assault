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
            $scope.selectedCards = [];
            $scope.isFilteredOut = this.isFilteredOut.bind(this);
            $scope.selectCard = this.selectCard.bind(this);
            $scope.deselectCard = this.deselectCard.bind(this);
            $scope.selectedPoints = this.selectedPoints.bind(this);
            $scope.saveDeck = this.saveDeck.bind(this);

            ccLoader.cards(this.onCardsLoad.bind(this));
        }

        private saveDeck() {

            if (!this.$scope.deckName) {
                this.$scope.error = "Deck name must be provided";
                return;
            }

            if (this.$scope.selectedCards.length !== 15) {
                this.$scope.error = "There must be 15 cards";
                return;
            }

            if (this.$scope.selectedPoints() > 15) {
                this.$scope.error = "Points must be 15 and under";
                return;
            }

            let timestamp = Date.now();

            let save: model.SaveState = {
                name: this.$scope.deckName,
                cards: [],
                created: timestamp,
                updated: timestamp
            };
            for (let card of this.$scope.selectedCards) {
                save.cards.push(card.id);
            }
            console.log(save);

            delete this.$scope.error;
        }

        private selectedPoints(): number {
            let total = 0;
            for (let card of this.$scope.selectedCards) {
                total += card.cost;
            }
            return total;
        }

        private selectCard(card: CommandCard) {
            this.$scope.selectedCards.push(card);
        }

        private deselectCard(card: CommandCard) {
            let index = this.$scope.selectedCards.indexOf(card);
            this.$scope.selectedCards.splice(index, 1);
        }

        private isFilteredOut(card: CommandCard): boolean {
            return this.isAffiliationFiltered(card) ||
                this.isRestrictionFiltered(card) ||
                this.isLimitReached(card);
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

        private isLimitReached(card: CommandCard): boolean {
            let count = 0;
            for (let selected of this.$scope.selectedCards) {
                if (card === selected) {
                    count++;
                }
            }
            return count >= card.limit;
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
            deckName: string;
            error: string;
            affiliationFilter: string;
            restrictionFilter: string;
            cards: CommandCard[];
            selectedCards: CommandCard[];
            affiliations: string[];
            restrictions: string[];
            isFilteredOut: (card: CommandCard) => boolean;
            selectCard: (card: CommandCard) => void;
            deselectCard: (card: CommandCard) => void;
            selectedPoints: () => number;
            saveDeck: () => void;
        }
    }

    module.controller(BuildController.NAME, [
        '$scope',
        CommandCardLoader.NAME,
        BuildController
    ]);
}