/// <reference path="../api/app.d.ts"/>

namespace App.Game.Ability {

    export class Cower extends BaseAbility {
        
        public get id(): string {
            return "cower";
        }
        
        public get name(): string {
            return "Cower";
        }
    }

    loaded(new Cower());
}