namespace App.Game.Engine.Validation {

    export class ScopeValidator {
        
        public validate(unit: Unit, action: Ability): IResult {
            // for (let condition of action.scope) {
            //     switch (condition) {
            //         case Scope.ACTION:
            //             if (!unit.active) {
            //                 return failure(`Unit must be active to ${action.title}`);
            //             }
            //             break;
            //     }
            // }
            return SUCCESS;
        }
    }
}