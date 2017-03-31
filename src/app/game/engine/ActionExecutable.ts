namespace App.Game.Engine {

    export abstract class ActionExecutable {

        protected readonly actor: Unit;
        protected readonly ability: Ability;
        protected readonly state: Engine.GameState;

        constructor(actor: Unit, ability: Ability, state: Engine.GameState) {
            this.actor = actor;
            this.ability = ability;
            this.state = state;
        }

        public abstract get ready(): boolean;

        public abstract execute(): Engine.IResult;
    }
}