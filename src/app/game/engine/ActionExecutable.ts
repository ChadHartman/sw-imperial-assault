namespace App.Game.Engine {

    const NO_UNITS = new Array<Unit>();
    const NO_SPACES = new Array<Space>();

    export abstract class ActionExecutable {

        public readonly ability: Ability.BaseAbility;
        protected readonly actor: Unit;
        protected readonly state: Engine.GameState;

        constructor(actor: Unit, ability: Ability.BaseAbility, state: Engine.GameState) {
            this.actor = actor;
            this.ability = ability;
            this.state = state;
        }

        public get targetableUnits(): Unit[] {
            return NO_UNITS;
        }

        public get targetableSpaces(): Space[] {
            return NO_SPACES;
        }

        public targetUnit(unit: Unit): boolean {
            return false;
        }

        public targetSpace(space: Space): boolean {
            return false;
        }

        public abstract get ready(): boolean;

        public abstract execute(): Engine.IResult;
    }
}