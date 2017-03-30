namespace App.Game.Action {

    export class Move extends BaseAction {

        public execute(ctx: ActionContext): Engine.IResult {

            if (!ctx.actor.active) {
                return Engine.failure("Unit is not active");
            }

            if (ctx.actor.actionCount === 0) {
                return Engine.failure("Unit does not have sufficient actions");
            }

            ctx.actor.movementPoints += ctx.actor.deployment.speed;
            ctx.actor.actionCount--;

            return Engine.SUCCESS;
        }
    }
}