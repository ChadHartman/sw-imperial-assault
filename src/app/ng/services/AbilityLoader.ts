namespace App.Ng {

    export class AbilityLoader {

        public static readonly NAME = "abilityLoader";

        private readonly abilities: Array<Game.Ability>;
        public loadRequestListener: AbilityLoader.IRequestListener | null;

        constructor() {
            this.abilities = new Array<Game.Ability>();
            this.loadRequestListener = null;
            (<any>window).abilityLoader = this;
        }

        public ability(name: string): Game.Ability | null {
            for (let ability of this.abilities) {
                if (ability.name === name) {
                    return ability;
                }
            }
            return null;
        }

        public load(name: string) {
            if (this.loadRequestListener === null) {
                throw new Error('loadRequestListener not set')
            }
            this.loadRequestListener.requestScript(`/assets/js/ability/${name}.js`);
        }
    }

    export module AbilityLoader {
        export interface IRequestListener {
            requestScript(src: string);
        }
    }
}

App.Ng.module.factory(App.Ng.AbilityLoader.NAME, [
    function () {
        return new App.Ng.AbilityLoader();
    }]
);