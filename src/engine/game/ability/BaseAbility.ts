namespace SwiaEngine.Game.Ability {

    export abstract class BaseAbility {

        public abstract readonly id: string;
        public abstract readonly name: string;
        public readonly isAction: boolean = false;
        public readonly isSpecialAction: boolean = false;

        public executable(actor: Unit, ability: BaseAbility, state: Engine.GameState): Engine.ActionExecutable {
            throw new Error('This ability has no executable');
        }
    }
}