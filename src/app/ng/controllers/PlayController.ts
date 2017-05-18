/// <reference path="../modules/swia.ts"/>

namespace swia.ng {

    export class PlayController {

        public static readonly NAME = "playController";
        public static readonly PATH = "/play/:deck_id";
        public static readonly HTML_NAME = "play";

        constructor(
            $scope,
            $routeParams: PlayController.RouteParams,
            store: Store) {

            store.deck($routeParams.deck_id, function (deck: model.Deck) {
                console.log(deck);
            })
        }
    }

    export module PlayController {
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