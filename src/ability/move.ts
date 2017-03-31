/// <reference path="../api/app.d.ts"/>

namespace App.Game {
    export class MoveAction extends Ability {
        public get name(): string {
            return "move";
        }

        public get isAction(): boolean {
            return true;
        }
    }

    export class MoveActionExecutable extends Engine.ActionExecutable {
        constructor(actor: Unit, ability: Ability, state: Engine.GameState) {
            super(actor, ability, state);
        }

        public get ready(): boolean {
            return this.actor.actionCount > 0;
        }

        public execute(): Engine.IResult {
            if (this.ready) {
                this.actor.movementPoints += this.actor.deployment.speed;
                return Engine.SUCCESS;
            }
            return Engine.failure("Unit does not have enough actions");
        }
    }
}