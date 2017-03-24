/// <reference path="../modules/App.ts"/>

namespace App.Ng {

    /**
     * Managers army persistances
     * 
     */
    export class ArmyCache {

        public static readonly NAME = "armyCache";
        private static readonly LS_KEY = "armies";

        private readonly  armyCollection: App.Model.IArmyCollection;

        get armies(): Array<Model.IArmy> {
            return this.armyCollection.armies;
        }

        constructor() {
            if (ArmyCache.LS_KEY in localStorage) {
                this.armyCollection = JSON.parse(localStorage[ArmyCache.LS_KEY]);
                return;
            }

            this.armyCollection = App.Model.createArmyCollection();
        }

        public load(id: number): Model.IArmy {
            for (var i = 0; i < this.armies.length; i++) {
                if (this.armies[i].id === id) {
                    return this.armies[i];
                }
            }

            throw new Error(`Unable to find army with id, ${id}; not found.`);
        }

        public removeArmy(id: number) {
            var index = -1;
            for (var i = 0; i < this.armies.length; i++) {
                if (this.armies[i].id === id) {
                    index = i;
                    break;
                }
            }
            if (index === -1) {
                throw new Error(`Unable to delete army with id, ${id}; not found.`);
            }
            this.armyCollection.armies.splice(index, 1);
            this.persistCache();
        }

        public saveArmy(title: string, deploymentIds: Array<string>) {
            App.Model.createArmy(title, deploymentIds, this.armyCollection);
            this.persistCache();
        }

        private persistCache() {
            localStorage[ArmyCache.LS_KEY] = JSON.stringify(this.armyCollection);
        }
    }
}

App.Ng.module.factory(App.Ng.ArmyCache.NAME, [
    function () {
        return new App.Ng.ArmyCache();
    }]);