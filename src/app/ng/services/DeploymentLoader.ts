namespace App.Ng {

    export interface IDeploymentLoadListener {
        onDeploymentLoaded(deployment: App.Game.Deployment);
    }

    class ComponentLoader {
        private readonly $http;
        private readonly id: string;
        private readonly  image: HTMLImageElement;
        private readonly abilities: Array<any>;
        private readonly listener: IDeploymentLoadListener;
        private deployment: Model.IDeployment;
        private isImageLoaded: boolean;

        constructor($http, id: string, listener: IDeploymentLoadListener) {
            this.$http = $http;
            this.id = id;
            this.listener = listener;
            this.image = new Image();
            this.abilities = [];
            this.isImageLoaded = false;
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
                let req = this.createAbilityRequest(id);
                this.$http(req).then(function (res) {
                    self.abilities.push({ id: id, data: res.data });
                    self.checkState();
                });
            }

            this.image.onload = function () {
                self.isImageLoaded = true;
                self.checkState();
            }
            this.image.src = this.deployment.image_url;
        }

        private checkState() {
            if (!this.isImageLoaded) {
                return;
            }

            if (this.abilities.length !== this.deployment.abilities.length) {
                return;
            }

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

        private createAbilityRequest(id: string): any {
            return {
                url: `assets/json/ability/${id}.json`,
                method: 'GET',
                cache: true
            }
        }
    }

    export class DeploymentLoader {

        public static readonly NAME = "deplymentLoader";
        private readonly $rootScope;
        private readonly $http;

        constructor($http) {
            this.$http = $http;
        }

        public load(id: string, listener: IDeploymentLoadListener) {
            let loader = new ComponentLoader(this.$http, id, listener);
            loader.load();
        }
    }
}

App.Ng.module.factory(App.Ng.DeploymentLoader.NAME, [
    '$http',
    function ($http) {
        return new App.Ng.DeploymentLoader($http);
    }]);