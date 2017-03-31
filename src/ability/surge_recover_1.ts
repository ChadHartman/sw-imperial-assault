/// <reference path="../api/app.d.ts"/>

namespace App.Game.Ability {

    export class SurgeRecover1 extends BaseAbility {
        
        public get id(): string {
            return "surge_recover_1";
        }
        
        public get name(): string {
            return "SurgeRecover1";
        }
    }

    loaded(new SurgeRecover1());
}