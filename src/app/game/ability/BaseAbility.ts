namespace App.Game.Ability {

    export abstract class BaseAbility {

        public abstract get id();

        public abstract get name();

        public get isAction() {
            return false;
        }

        public get isSpecialAction() {
            return false;
        }

        public executable(actor: Unit, ability: BaseAbility, state: Engine.GameState): Engine.ActionExecutable {
            throw new Error('This ability has no executable');
        }
    }
}