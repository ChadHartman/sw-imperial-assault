/// <reference path="../api/app.d.ts"/>

namespace App.Game.Ability {

    export class SurgePierce1 extends BaseAbility {
        
        public get id(): string {
            return "surge_pierce_1";
        }
        
        public get name(): string {
            return "SurgePierce1";
        }
    }

    loaded(new SurgePierce1());
}