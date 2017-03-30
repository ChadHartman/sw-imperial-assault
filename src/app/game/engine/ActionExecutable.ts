
namespace App.Game.Engine {
    export class ActionExecutable {

        private readonly ability: Ability
        private readonly actor: Unit;
        private spaces: Array<Space>;
        private units: Array<Unit>;

        constructor(actor: Unit, ability: Ability) {
            this.actor = actor;
            this.ability = ability;

            if (!this.ability.isAction) {
                throw new Error(`Ability is not an action`);
            }

            if (this.ability.targets.length === 1 &&
                this.ability.targets[0].validTargetUnit(actor, actor)) {
                this.targetUnit(actor);
            }
        }

        public targetUnit(unit: Unit): IResult {
            if (this.ability.canTargetUnit(this.actor, unit)) {
                if (!this.units) {
                    this.units = new Array<Unit>();
                }
                this.units.push(unit);
                return SUCCESS;
            }
            return failure("Unit is not an applicable target");
        }

        public targetSpace(space: Space): IResult {
            if (this.ability.canTargetSpace(this.actor, space)) {
                if (!this.spaces) {
                    this.spaces = new Array<Space>();
                }
                this.spaces.push(space);
                return SUCCESS;
            }
            return failure("Space is not an applicable target");
        }

        public get ready(): boolean {
             


            return false;
        }

        public execute(): IResult {
            return failure('Not yet implemented');
        }
    }
}