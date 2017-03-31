/// <reference path="../api/app.d.ts"/>

namespace App.Game.Ability {

    export class SurgeRecover2 extends BaseAbility {
        
        public get id(): string {
            return "surge_recover_2";
        }
        
        public get name(): string {
            return "SurgeRecover2";
        }
    }

    loaded(new SurgeRecover2());
}