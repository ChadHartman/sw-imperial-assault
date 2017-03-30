/// <reference path="../modules/App.ts"/>
/// <reference path="../services/ArmyCache.ts"/>
/// <reference path="BaseController.ts"/>

namespace App.Ng {

    interface IScope {
        availableIds: Array<string>;
        deployments: [string, string];
        selectedIds: Array<string>
        armies: Array<App.Model.IArmy>;
        armyTitle: string|null;
        selectedArmyId: string;
        addDeployment(id: string);
        removeDeployment(index: number);
        saveArmy();
        selectArmy();
        removeArmy();
    }

    export class ArmyController extends BaseController {

        public static readonly NAME = "armyController";
        public static readonly PATH = "/army";
        public static readonly HTML_NAME = "army";
        private static readonly DEPLOYMENTS_LIST_PATH = "assets/json/deployment/deployments.json";
        private static readonly ID_NEW = "__new__";

        private readonly $scope: IScope;
        private readonly armyCache: App.Ng.ArmyCache;

        constructor(
            $rootScope,
            $scope: IScope,
            $http: any,
            armyCache: App.Ng.ArmyCache) {

            super($rootScope);
            this.$scope = $scope;
            this.armyCache = armyCache;

            this.$scope.selectedArmyId = ArmyController.ID_NEW;
            this.$scope.armies = this.armyCache.armies;
            this.$scope.addDeployment = this.addDeployment.bind(this);
            this.$scope.removeDeployment = this.removeDeployment.bind(this);
            this.$scope.saveArmy = this.saveArmy.bind(this);
            this.$scope.selectArmy = this.selectArmy.bind(this);
            this.$scope.removeArmy = this.removeArmy.bind(this);

            $http.get(ArmyController.DEPLOYMENTS_LIST_PATH)
                .then(this.onListLoaded.bind(this));
        }

        private selectArmy() {
            if (ArmyController.ID_NEW === this.$scope.selectedArmyId) {
                this.$scope.selectedIds = [];
                return;
            }

            let army = this.getArmy(parseInt(this.$scope.selectedArmyId));
            if (!army) {
                throw new Error(`Could not find army of id ${this.$scope.selectedArmyId}.`);
            }
            this.$scope.selectedIds = army.deploymentIds.slice(0);
            this.$scope.armyTitle = army.title;
        }

        private removeArmy() {
            if (this.$scope.selectedArmyId === ArmyController.ID_NEW) {
                return;
            }

            this.armyCache.removeArmy(parseInt(this.$scope.selectedArmyId));
            this.selectNewArmyOption();
        }

        private getArmy(id: number): App.Model.IArmy | null {
            for (let army of this.$scope.armies) {
                if (army.id === id) {
                    return army;
                }
            }

            return null;
        }

        private onListLoaded(res) {
            this.$scope.availableIds = [];
            this.$scope.deployments = <[string, string]>{};
            this.$scope.selectedIds = [];

            for (let item of res.data.array) {
                let info = <App.Model.IItemInfo>item;
                this.$scope.availableIds.push(info.id);
                this.$scope.deployments[info.id] = info.title;
            }
        }

        private removeDeployment(index: number) {
            this.$scope.selectedIds.splice(index, 1);
        }

        private addDeployment(id: string) {
            this.$scope.selectedIds.push(id);
        }

        private saveArmy() {
            this.armyCache.saveArmy(
                this.$scope.armyTitle || this.createTitle(),
                this.$scope.selectedIds);
            this.selectNewArmyOption();
        }

        private createTitle(): string {
            var title = "";
            let MAX_LEN = 50;
            for (let id of this.$scope.selectedIds) {
                if (title.length > 0) {
                    title += ", ";
                }
                title += this.$scope.deployments[id].title;
                if (title.length >= MAX_LEN) {
                    title += "...";
                    break;
                }
            }
            return title;
        }

        private selectNewArmyOption() {
            this.$scope.selectedArmyId = ArmyController.ID_NEW;
            this.$scope.selectedIds = [];
            this.$scope.armyTitle = null;
        }
    }
}

App.Ng.module.controller(App.Ng.ArmyController.NAME,
    [
        '$rootScope',
        '$scope',
        '$http',
        App.Ng.ArmyCache.NAME,
        App.Ng.ArmyController
    ]
);