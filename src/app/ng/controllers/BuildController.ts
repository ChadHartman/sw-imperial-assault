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

            $scope.deck = new model.Deck([]);
            $scope.selectCard = this.selectCard.bind(this);
            $scope.deselectCard = this.deselectCard.bind(this);
            $scope.saveDeck = this.saveDeck.bind(this);

            $scope.filter = new build.Filter();

            ccLoader.cards(this.onCardsLoad.bind(this));
        }

        private saveDeck() {

            if (!this.$scope.deckName) {
                this.$scope.error = "Deck name must be provided";
                return;
            }

            if (this.$scope.deck.cards.length !== 15) {
                this.$scope.error = "There must be 15 cards";
                return;
            }

            if (this.$scope.deck.points > 15) {
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
            for (let card of this.$scope.deck.cards) {
                save.cards.push(card.id);
            }
            console.log(save);

            delete this.$scope.error;
        }

        private selectCard(card: model.CommandCard) {
            this.$scope.deck.cards.push(card);
        }

        private deselectCard(card: model.CommandCard) {
            let index = this.$scope.deck.cards.indexOf(card);
            this.$scope.deck.cards.splice(index, 1);
        }

        private onCardsLoad(cards: model.CommandCard[]) {
            this.$scope.available = cards;

            let affiliations = new Set();
            let restrictions = new Set();
            let costs = new Set();

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

                costs.add(card.cost);
            }

            this.$scope.affiliations = Array.from(affiliations).sort();
            this.$scope.restrictions = Array.from(restrictions).sort();
            this.$scope.costs = Array.from(costs).sort();
        }
    }

    export module BuildController {

        export interface Scope {
            deckName: string;
            error: string;
            filter: build.Filter;
            available: model.CommandCard[];
            deck: model.Deck;
            affiliations: string[];
            restrictions: string[];
            costs: number[];
            selectCard: (card: model.CommandCard) => void;
            deselectCard: (card: model.CommandCard) => void;
            saveDeck: () => void;
        }
    }

    module.controller(BuildController.NAME, [
        '$scope',
        CommandCardLoader.NAME,
        BuildController
    ]);
}