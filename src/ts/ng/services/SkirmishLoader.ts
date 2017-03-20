/// <reference path="../modules/App.ts"/>
/// <reference path="../../game/Skirmish.ts"/>


namespace App.Ng {

    export interface ISkirmishLoadListener {
        onSkirmishLoad(skirmish: App.Game.Skirmish);
    }

    class ComponentLoader {

        private readonly $http;
        private readonly listener: ISkirmishLoadListener;
        private readonly id: string;
        private readonly tiles: Array<App.Model.ITile>;
        private config: App.Model.ISkirmishConfig;

        constructor($http, id: string, listener: ISkirmishLoadListener) {
            this.id = id;
            this.$http = $http;
            this.listener = listener;
            this.tiles = [];
        }

        load() {
            let self = this;
            if (!this.config) {
                let req = this.createConfigRequest();
                this.$http(req).then(function (res) {
                    self.config = res.data;
                    self.load();
                });
                return;
            }


            for (let mapTile of this.config.tiles) {
                let req = this.createTileRequest(mapTile.tile_id);
                this.$http(req).then(function (res) {
                    let tile = <App.Model.ITile>res.data;
                    tile.id = mapTile.tile_id;
                    self.tiles.push(tile);
                    self.checkState();
                });
            }
        }

        private checkState() {
            if (this.config.tiles.length !== this.tiles.length) {
                return;
            }
            let skirmish = new App.Game.Skirmish(this.config, this.tiles);
            this.listener.onSkirmishLoad(skirmish);
        }

        private createConfigRequest(): any {
            return {
                url: `assets/json/skirmish/${this.id}.json`,
                method: 'GET',
                cache: true
            };
        }

        private createTileRequest(id: string): any {
            return {
                url: `assets/json/tile/${id}.json`,
                method: 'GET',
                cache: true
            };
        }
    }

    export class SkirmishLoader {

        public static readonly NAME = "skirmishLoader";
        private readonly $http: any;

        constructor($http) {
            this.$http = $http;
        }

        public load(id: string, listener: ISkirmishLoadListener) {
            let loader = new ComponentLoader(this.$http, id, listener);
            loader.load();
        }
    }
}

App.Ng.module.factory(App.Ng.SkirmishLoader.NAME, [
    '$http',
    function ($http) {
        return new App.Ng.SkirmishLoader($http);
    }]);