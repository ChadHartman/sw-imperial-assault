/// <reference path="../api/app.d.ts"/>

namespace App.Game.Ability {

    export class SurgeRecover3 extends BaseAbility {
        
        public get id(): string {
            return "surge_recover_3";
        }
        
        public get name(): string {
            return "SurgeRecover3";
        }
    }

    loaded(new SurgeRecover3());
}