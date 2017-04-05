/// <reference path="../api/app.d.ts"/>

namespace App.Game.Ability {

    export class RangedAttack extends BaseAbility {

        public readonly id = "ranged_attack";
        public readonly name = "Ranged Attack";
        public readonly isAction = true;

        public executable(
            actor: Unit,
            ability: BaseAbility,
            state: Engine.GameState): Engine.ActionExecutable {

            return new RangedAttackExecutable(actor, ability, state);
        }
    }

    export class RangedAttackExecutable extends Engine.ActionExecutable {

        private readonly targetable: Array<Unit>;
        private target: Unit | null;

        constructor(actor: Unit, ability: BaseAbility, state: Engine.GameState) {
            super(actor, ability, state);

            this.targetable = new Array<Unit>();
            this.target = null;

            for (let army of state.armies) {

                if (actor.zoneColor === army.zoneColor) {
                    continue;
                }

                for (let unit of army.units) {
                    if (state.los(actor, unit)) {
                        this.targetableUnits.push(unit);
                    }
                }
            }
        }

        public get ready(): boolean {
            return this.target !== null;
        }

        public get targetableUnits(): Array<Unit> {
            return this.targetable;
        }

        public targetUnit(unit: Unit): boolean {
            if (this.targetable.indexOf(unit) === -1) {
                return false;
            }
            this.target = unit;
            return true;
        }

        public execute(): Engine.IResult {
            if (!this.ready) {
                return Engine.failure("Action is not ready");
            }

            let result = Dice.roll(
                this.actor.deployment.attackDice,
                (this.target!).deployment.defenseDice);

            if (result.dodged) {
                console.log("dodged!");
                return Engine.SUCCESS;
            }

            (this.target!).health -= result.damage;
            return Engine.SUCCESS;
        }
    }

    loaded(new RangedAttack());
}