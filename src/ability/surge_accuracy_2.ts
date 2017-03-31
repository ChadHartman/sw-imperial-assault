/// <reference path="../api/app.d.ts"/>

namespace App.Game.Ability {

    export class SurgeAccuracy2 extends BaseAbility {
        
        public get id(): string {
            return "surge_accuracy_2";
        }
        
        public get name(): string {
            return "SurgeAccuracy2";
        }
    }

    loaded(new SurgeAccuracy2());
}