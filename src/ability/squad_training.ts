/// <reference path="../api/app.d.ts"/>

namespace App.Game.Ability {

    export class SquadTraining extends BaseAbility {
        
        public get id(): string {
            return "squad_training";
        }
        
        public get name(): string {
            return "SquadTraining";
        }
    }

    loaded(new SquadTraining());
}