

namespace App.Game {
    export abstract class Ability {

        public abstract get name();

        public get isAction() {
            return false;
        }

        public get isSpecialAction() {
            return false;
        }

        public executable(actor: Unit, ability: Ability, state: Engine.GameState): Engine.ActionExecutable {
            throw new Error('This ability has no executable');
        }
    }
}