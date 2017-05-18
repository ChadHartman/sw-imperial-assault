/// <reference path="../modules/swia.ts"/>

namespace swia.ng {

    export class PlayController {

        public static readonly NAME = "playController";
        public static readonly PATH = "/play/:deck_id";
        public static readonly HTML_NAME = "play";

        constructor(
            private readonly $scope: PlayController.Scope,
            $routeParams: PlayController.RouteParams,
            store: Store) {

            this.$scope.hand = [];
            this.$scope.discardDeck = [];
            this.$scope.draw = this.draw.bind(this);
            this.$scope.discard = this.discard.bind(this);
            this.$scope.restore = this.restore.bind(this);

            store.deck($routeParams.deck_id, this.onDeckLoad.bind(this));
        }

        private onDeckLoad(deck: model.Deck) {
            this.$scope.drawDeck = angular.copy(deck.cards);
            for (let i = 0; i < 3; i++) {
                this.$scope.hand.push(util.popRandom(this.$scope.drawDeck));
            }
        }

        private discard(card: model.CommandCard) {
            let index = this.$scope.hand.indexOf(card);
            let discarded = this.$scope.hand.splice(index, 1)[0];
            this.$scope.discardDeck.push(discarded);
        }

        private draw() {
            this.$scope.hand.push(util.popRandom(this.$scope.drawDeck));
        }

        private restore(card: model.CommandCard) {
            let index = this.$scope.discardDeck.indexOf(card);
            let discarded = this.$scope.discardDeck.splice(index, 1)[0];
            this.$scope.hand.push(discarded);
        }
    }

    export module PlayController {

        export interface Scope {
            drawDeck: model.CommandCard[];
            hand: model.CommandCard[];
            discardDeck: model.CommandCard[];
            draw: () => void;
            discard: (card: model.CommandCard) => void;
            restore: (card: model.CommandCard) => void;
        }

        export interface RouteParams {
            deck_id: number;
        }
    }

    module.controller(PlayController.NAME, [
        '$scope',
        '$routeParams',
        Store.NAME,
        PlayController
    ]);
}