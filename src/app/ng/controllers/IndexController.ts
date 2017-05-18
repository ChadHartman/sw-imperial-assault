/// <reference path="../modules/swia.ts"/>
/// <reference path="../services/Store.ts"/>

namespace swia.ng {

    export class IndexController {

        public static readonly NAME = "indexController";
        public static readonly PATH = "/";
        public static readonly HTML_NAME = "index";

        constructor(
            private readonly $scope: IndexController.Scope,
            private readonly store: Store) {

            this.$scope.deleteDeck = this.deleteDeck.bind(this);

            store.decks(this.onDecksLoad.bind(this));
        }

        private onDecksLoad(decks: model.Deck[]) {
            this.$scope.decks = decks;
            for (let deck of decks) {
                deck.exportUrl = "#/import?deck=" + encodeURIComponent(JSON.stringify(deck.state));
            }
        }

        private deleteDeck(deck: model.Deck) {
            if (window.confirm("Are you sure?")) {
                this.store.deleteDeck(deck.id);
                this.store.decks(this.onDecksLoad.bind(this));
            }
        }
    }

    export module IndexController {
        export interface Scope {
            decks: model.Deck[];
            deleteDeck: (deck: model.Deck) => void;
        }
    }

    module.controller(IndexController.NAME, [
        '$scope',
        Store.NAME,
        IndexController
    ]);
}