/// <reference path="DeploymentLoader.ts"/>
/// <reference path="ArmyCache.ts"/>

namespace App.Ng {

    export interface IArmyLoadListener {
        onArmyLoad(army: App.Game.Army);
    }

    class ComponentLoader implements IDeploymentLoadListener {

        private readonly $http;
        private readonly id: number;
        private readonly title: string;
        private readonly zoneColor: Game.ZoneColor;
        private readonly army: Model.IArmy;
        private readonly listener: IArmyLoadListener;
        private readonly deploymentLoader: DeploymentLoader;
        private readonly deployments: Array<Game.Deployment>;

        constructor(
            $http,
            deploymentLoader: DeploymentLoader,
            id: number,
            zoneColor: Game.ZoneColor,
            army: App.Model.IArmy,
            listener: IArmyLoadListener) {

            this.$http = $http;
            this.deploymentLoader = deploymentLoader;
            this.id = id;
            this.title = army.title;
            this.zoneColor = zoneColor;
            this.army = army;
            this.listener = listener;
            this.deployments = [];
        }

        load() {
            for (let id of this.army.deploymentIds) {
                this.deploymentLoader.load(id, this);
            }
        }

        onDeploymentLoaded(deployment: Game.Deployment) {
            this.deployments.push(deployment);
            if (this.deployments.length === this.army.deploymentIds.length) {
                let army = new Game.Army(this.id, this.title, this.zoneColor, this.deployments);
                this.listener.onArmyLoad(army);
            }
        }
    }

    export class ArmyLoader {

        public static readonly NAME = "armyLoaderV2";
        private readonly $http;
        private readonly armyCache: ArmyCache;
        private readonly deploymentLoader: DeploymentLoader;

        constructor($http, armyCache: ArmyCache, deploymentLoader: DeploymentLoader) {
            this.$http = $http;
            this.armyCache = armyCache;
            this.deploymentLoader = deploymentLoader;
        }

        public load(id: number, zoneColor: Game.ZoneColor, listener: IArmyLoadListener) {
            let army = this.armyCache.load(id);
            let loader = new ComponentLoader(
                this.$http,
                this.deploymentLoader,
                id,
                zoneColor,
                army,
                listener);
            loader.load();
        }
    }
}
App.Ng.module.factory(App.Ng.ArmyLoader.NAME, [
    '$http',
    App.Ng.ArmyCache.NAME,
    App.Ng.DeploymentLoader.NAME,
    function (
        $http,
        armyCache: App.Ng.ArmyCache,
        deploymentLoader: App.Ng.DeploymentLoader) {
        return new App.Ng.ArmyLoader($http, armyCache, deploymentLoader);
    }]);