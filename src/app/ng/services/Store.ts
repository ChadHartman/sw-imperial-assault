/// <reference path="../modules/swia.ts"/>
/// <reference path="CommandCardLoader.ts"/>

namespace swia.ng {

    const LS_KEY = "command_decks";

    interface State {
        __last_id__: number;
        decks: model.Deck.State[];
    }

    export class Store {

        public static readonly NAME = "store";

        private state: State;
        private deckCache: model.Deck[];

        constructor(
            private readonly $timeout,
            private readonly ccLoader: CommandCardLoader) {

            if (LS_KEY in localStorage) {
                this.state = <State>JSON.parse(localStorage[LS_KEY]);
            } else {
                this.state = {
                    __last_id__: 0,
                    decks: []
                };
            }
        }

        public save(deck: model.Deck) {

            if (!deck.id) {
                deck.id = ++this.state.__last_id__;
            }

            this.state.decks.push(deck.state);
            localStorage[LS_KEY] = JSON.stringify(this.state);

            if (this.deckCache) {
                this.deckCache.push(deck);
            }
        }

        public decks(callback: (decks: model.Deck[]) => void) {

            if (this.deckCache) {
                let decks = this.deckCache;
                this.$timeout(function () {
                    callback(decks);
                });
                return;
            }

            let self = this;
            this.ccLoader.cards(function (cards: model.CommandCard[]) {
                self.deckCache = [];
                for (let deckState of self.state.decks) {
                    self.deckCache.push(model.Deck.from(deckState, cards))
                }
                callback(self.deckCache);
            });
        }

        public deck(id: number, callback: (deck: model.Deck) => void) {

            if (this.deckCache) {
                for (let deck of this.deckCache) {
                    if (deck.id == id) {
                        this.$timeout(function () {
                            callback(deck);
                        });
                        return;
                    }
                }
                throw new Error(`No deck with id: ${id}`);
            }

            let self = this;
            this.decks(function (decks: model.Deck[]) {
                self.deck(id, callback);
            });
        }
    }

    module.factory(Store.NAME, [
        '$timeout',
        CommandCardLoader.NAME,
        function ($timeout, commandCardLoader: CommandCardLoader) {
            return new Store($timeout, commandCardLoader);
        }]);
}

