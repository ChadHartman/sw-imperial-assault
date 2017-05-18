/// <reference path="../modules/swia.ts"/>
/// <reference path="../services/Store.ts"/>

namespace swia.ng {

    export class IndexController {

        public static readonly NAME = "indexController";
        public static readonly PATH = "/";
        public static readonly HTML_NAME = "index";

        constructor(
            private readonly $scope: IndexController.Scope,
            store: Store) {
                
            store.decks(this.onDecksLoad.bind(this));
        }

        private onDecksLoad(decks: model.Deck[]) {
            this.$scope.decks = decks;
        }
    }

    export module IndexController {
        export interface Scope {
            decks: model.Deck[];
        }
    }

    module.controller(IndexController.NAME, [
        '$scope',
        Store.NAME,
        IndexController
    ]);
}