/// <reference path="../api/app.d.ts"/>

namespace App.Game.Ability {

    export class RangedAttack extends BaseAbility {
        
        public get id(): string {
            return "ranged_attack";
        }
        
        public get name(): string {
            return "Ranged Attack";
        }
    }

    loaded(new RangedAttack());
}