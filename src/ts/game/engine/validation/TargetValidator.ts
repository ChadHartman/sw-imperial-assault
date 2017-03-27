namespace App.Game.Engine.Validation {

    export class TargetValidator {

        private readonly state: GameState;

        constructor(state: GameState) {
            this.state = state;
        }

        public validate(unit: Game.Unit, ability: Model.IAbility, targets: Array<Target>): IResult {
            for (let targetName of ability.targets) {
                switch (targetName) {
                    case Ability.Target.SELF:
                        if (!this.validateSelf(unit, targets)) {
                            return failure(`Invalid target`);
                        }
                        break;
                    case Ability.Target.HOSTILE_FIGURE:
                        if (!this.validateHostileFigure(unit, targets)) {
                            return failure(`Invalid target`);
                        }
                        break;
                    default:
                        throw new Error(`Unknown target ${targetName}`);
                }
            }
            return SUCCESS;
        }

        private validateSelf(actor: Unit, targets: Array<Target>): boolean {

            if (targets.length !== 1) {
                return false;
            }

            let target = targets[0];

            if (target.type !== TargetType.FIGURE) {
                return false;
            }

            let targetUnit = this.state.unitAt(target.x, target.y);

            if (targetUnit === null) {
                return false;
            }

            return actor.uniqueId === targetUnit.uniqueId;
        }

        private validateHostileFigure(actor: Unit, targets: Array<Target>): boolean {

            if (targets.length !== 1) {
                return false;
            }

            let target = targets[0];

            if (target.type !== TargetType.FIGURE) {
                return false;
            }

            let targetUnit = this.state.unitAt(target.x, target.y);

            if (targetUnit === null || actor.zoneColor === targetUnit.zoneColor) {
                return false;
            }

            return true;
        }
    }
}