namespace App.Game.Engine.Validation {

    export class ScopeValidator {
        
        public validate(unit: Game.Unit, action: Model.IAbility): IResult {
            for (let condition of action.scope) {
                switch (condition) {
                    case Ability.Scope.ACTION:
                        if (!unit.active) {
                            return failure(`Unit must be active to ${action.title}`);
                        }
                        break;
                }
            }
            return SUCCESS;
        }
    }
}