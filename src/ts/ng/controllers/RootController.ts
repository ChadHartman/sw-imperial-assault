/// <reference path="../modules/App.ts"/>

namespace App.Ng {

    interface ISaveUrl {
        text: string;
        url: string;
    }

    interface IScope {
        skirmishes: Array<Model.IItemInfo>;
        saveUrls: Array<ISaveUrl>;
    }

    export class RootController {

        public static readonly NAME = "rootController";
        public static readonly PATH = "/";
        public static readonly HTML_NAME = "root";

        private readonly $scope: IScope;
        private readonly stateCache: StateCache;

        constructor($scope: IScope, $http: any, stateCache: StateCache) {

            this.stateCache = stateCache;
            this.$scope = $scope;
            this.$scope.saveUrls = new Array<ISaveUrl>();

            let req = this.createRequest();

            $http(req).then(this.onSkirmishListLoad.bind(this));
        }

        private onSkirmishListLoad(res) {
            this.$scope.skirmishes = res.data.array;

            for (let state of this.stateCache.states) {
                let text = this.createText(state, this.$scope.skirmishes);
                let url = `#/skirmish/${state.skirmish_id}?state=${state.id}`;
                if (state.red) {
                    url += '&red=' + state.red;
                }
                if (state.blue) {
                    url += '&blue=' + state.blue;
                }
                this.$scope.saveUrls.push({ text: text, url: url });
            }
        }

        private createRequest() {
            return {
                url: "assets/json/skirmish/skirmishes.json",
                method: 'GET',
                cache: true
            }
        }

        private createText(save: ISkirmishState, skirmishes: Array<Model.IItemInfo>): string {

            let name = "<not found>";
            for (let info of skirmishes) {
                if (info.id === save.skirmish_id) {
                    name = info.title;
                }
            }

            let date = new Date(save.timestamp);

            return `${name} @ ${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
        }
    }
}

App.Ng.module.controller(App.Ng.RootController.NAME,
    [
        '$scope',
        '$http',
        App.Ng.StateCache.NAME,
        App.Ng.RootController
    ]
);
