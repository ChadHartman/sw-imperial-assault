/// <reference path="../modules/swia.ts"/>

namespace swia.ng {

    export class PlayController {

        public static readonly NAME = "playController";
        public static readonly PATH = "/play";
        public static readonly HTML_NAME = "play";

        constructor($scope) {
            
        }
    }

    module.controller(PlayController.NAME, [
        '$scope',
        PlayController
    ]);
}