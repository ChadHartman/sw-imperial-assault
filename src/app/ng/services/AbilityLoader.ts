namespace App.Ng {
    export class AbilityLoader {
        public static readonly NAME = "abilityLoader";
    }
}

App.Ng.module.factory(App.Ng.AbilityLoader.NAME, [
    function () {
        return new App.Ng.AbilityLoader();
    }]
);