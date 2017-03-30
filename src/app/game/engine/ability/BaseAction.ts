namespace App.Game.Action {

    export abstract class BaseAction {

        protected static readonly NO_UNITS = new Array<Unit>();
        protected static readonly NO_SPACES = new Array<Space>();

        public targetableSpaces(actor: Unit, state: Engine.GameState): Array<Space> {
            return BaseAction.NO_SPACES;
        }

        public targetableUnits(actor: Unit, state: Engine.GameState): Array<Unit> {
            return BaseAction.NO_UNITS;
        }

        public canTargetUnit(actor: Unit, unit: Unit): boolean {
            return false;
        }

        public canTargetSpace(actor: Unit, space: Space): boolean {
            return false;
        }

        public abstract createActionParams(actor: Unit, state: Engine.GameEngine): ActionParams;

        public abstract execute(params: ActionParams): Engine.IResult;
    }

    export class ActionParams {

        public readonly actor: Unit;
        public readonly state: Engine.GameState;
        private readonly action: BaseAction;
        private readonly targetUnits: Array<Unit>;
        private readonly targetSpaces: Array<Space>;
        private readonly minUnitCount: number;
        private readonly maxUnitCount: number;
        private readonly minSpaceCount: number;
        private readonly maxSpaceCount: number;

        constructor(
            actor: Unit,
            state: Engine.GameState,
            action: BaseAction,
            minUnitCount: number,
            maxUnitCount: number,
            minSpaceCount: number,
            maxSpaceCount: number) {

            if (maxSpaceCount > 0) {
                this.targetSpaces = new Array<Space>();
            }

            if (maxUnitCount > 0) {
                this.targetUnits = new Array<Unit>();
            }

            this.actor = actor;
            this.state = state;
            this.action = action;

            this.minUnitCount = minUnitCount;
            this.maxUnitCount = maxUnitCount;
            this.minSpaceCount = minSpaceCount;
            this.maxSpaceCount = maxSpaceCount;
        }

        public get ready(): boolean {

            if (this.maxSpaceCount > 0 && this.targetSpaces.length < this.minSpaceCount) {
                return false;
            }

            if (this.maxUnitCount > 0 && this.targetUnits.length < this.minUnitCount) {
                return false;
            }

            return false;
        }
    }
}