/// <reference path="../api/app.d.ts"/>

namespace App.Game.Ability {

    export class SurgeFocus extends BaseAbility {
        
        public get id(): string {
            return "surge_focus";
        }
        
        public get name(): string {
            return "SurgeFocus";
        }
    }

    loaded(new SurgeFocus());
}