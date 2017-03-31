/// <reference path="AbilityLoader.ts"/>

namespace App.Ng {

    export interface IDeploymentLoadListener {
        onDeploymentLoaded(deployment: App.Game.Deployment);
    }

    class ComponentLoader implements Game.Ability.LoadListener {
        private readonly $http;
        private readonly id: string;
        private readonly  image: HTMLImageElement;
        private readonly abilities: Array<any>;
        private readonly listener: IDeploymentLoadListener;
        private readonly abilityLoader: AbilityLoader;
        private deployment: Model.IDeployment;
        private isImageLoaded: boolean;

        constructor($http, abilityLoader: AbilityLoader, id: string, listener: IDeploymentLoadListener) {
            this.$http = $http;
            this.id = id;
            this.listener = listener;
            this.image = new Image();
            this.abilities = [];
            this.isImageLoaded = false;
            this.abilityLoader = abilityLoader;
            Game.Ability.addListener(this);
        }

        load() {

            let self = this;

            if (!this.deployment) {
                let req = this.createDataRequest();
                this.$http(req).then(function (res) {
                    self.deployment = res.data;
                    self.load();
                });
                return;
            }

            for (let id of this.deployment.abilities) {
                this.abilityLoader.load(id);
            }

            this.image.onload = function () {
                self.isImageLoaded = true;
                self.checkState();
            }
            this.image.src = this.deployment.image_url;
        }

        onAbilityLoad(ability: Game.Ability.BaseAbility) {
            if (this.deployment.abilities.indexOf(ability.id) === -1) {
                return;
            }

            this.abilities.push(ability);
            this.checkState();
        }

        private checkState() {
            if (!this.isImageLoaded) {
                return;
            }

            if (this.abilities.length !== this.deployment.abilities.length) {
                return;
            }

            Game.Ability.removeListener(this);
            this.listener.onDeploymentLoaded(
                new App.Game.Deployment(
                    this.id, this.image, this.deployment, this.abilities));
        }

        private createDataRequest(): any {
            return {
                url: `assets/json/deployment/${this.id}.json`,
                method: 'GET',
                cache: true
            }
        }
    }

    export class DeploymentLoader {

        public static readonly NAME = "deplymentLoader";
        private readonly $http;
        private readonly abilityLoader: AbilityLoader

        constructor($http, abilityLoader: AbilityLoader) {
            this.$http = $http;
            this.abilityLoader = abilityLoader;
        }

        public load(id: string, listener: IDeploymentLoadListener) {
            let loader = new ComponentLoader(this.$http, this.abilityLoader, id, listener);
            loader.load();
        }
    }
}

App.Ng.module.factory(App.Ng.DeploymentLoader.NAME, [
    '$http',
    App.Ng.AbilityLoader.NAME,
    function ($http, abilityLoader: App.Ng.AbilityLoader) {
        return new App.Ng.DeploymentLoader($http, abilityLoader);
    }]);