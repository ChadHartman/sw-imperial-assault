/// <reference path="../modules/swia.ts"/>

namespace swia.ng {

    export interface CommandCard {
        id: string;
        title: string;
        affiliation?: string;
        restrictions?: string[];
        cost: number;
        limit: number;
        url: string
    }

    export class CommandCardLoader {

        public static readonly NAME = "command_card_loader";
        private cache: CommandCard[];

        constructor(
            private readonly $http,
            private readonly $timeout
        ) {
        }

        public cards(callback: (cards: CommandCard[]) => void) {

            if (this.cache) {
                let cache = this.cache;
                this.$timeout(function () {
                    callback(cache);
                });
                return;
            }

            let self = this;

            this.$http({
                method: 'GET',
                url: 'assets/json/command/cards.json',
                cache: true
            }).then(function successCallback(response) {
                self.cache = response.data.cards;
                callback(self.cache);
            }, function errorCallback(response) {
                console.error(response);
            });
        }
    }

    module.factory(CommandCardLoader.NAME, [
        "$http",
        "$timeout",
        function ($http, $timeout) {
            return new CommandCardLoader($http, $timeout);
        }]);
}

