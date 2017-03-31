/// <reference path="../api/app.d.ts"/>

namespace App.Game.Ability {

    export class SelfDestruct extends BaseAbility {
        
        public get id(): string {
            return "self_destruct";
        }
        
        public get name(): string {
            return "SelfDestruct";
        }
    }

    loaded(new SelfDestruct());
}