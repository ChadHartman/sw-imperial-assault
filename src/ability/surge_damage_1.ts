/// <reference path="../api/app.d.ts"/>

namespace App.Game.Ability {

    export class SurgeDamage1 extends BaseAbility {
        
        public get id(): string {
            return "surge_damage_1";
        }
        
        public get name(): string {
            return "SurgeDamage1";
        }
    }

    loaded(new SurgeDamage1());
}