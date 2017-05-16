/// <reference path="../modules/swia.ts"/>

namespace swia.ng {

    export class IndexController {

        public static readonly NAME = "indexController";
        public static readonly PATH = "/";
        public static readonly HTML_NAME = "index";

        constructor($scope) {
            
        }
    }

    module.controller(IndexController.NAME, [
        '$scope',
        IndexController
    ]);
}