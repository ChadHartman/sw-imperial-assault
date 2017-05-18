/// <reference path="../modules/swia.ts"/>

namespace swia.ng {

    export class ImportController {

        public static readonly NAME = "importController";
        public static readonly PATH = "/import";
        public static readonly HTML_NAME = "import";

        constructor(
            $routeParams: ImportController.RouteParams,
            $location,
            store: Store) {

            let deckState = <model.Deck.State>JSON.parse($routeParams.deck);
            store.import(deckState);
            // Clear out query string
            $location.path(IndexController.PATH + "?");
        }
    }

    export module ImportController {
        export interface RouteParams {
            deck: string;
        }
    }

    module.controller(ImportController.NAME, [
        '$routeParams',
        '$location',
        Store.NAME,
        ImportController
    ]);
}