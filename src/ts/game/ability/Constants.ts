namespace App.Game.Ability {
    export namespace Scope {
        export const ACTION = "action";
        export const SPECIAL_ACTION = "special_action";
        export const DEFENDING = "defending";
        export const ATTACKING = "attacking";
        export const ADJACENT_TO_FRIENDLY = "adjacent_friendly";
    }
    
    export namespace Target {
        export const SELF = "self";
    }

    export namespace Effect {

        export namespace Key {
            export const TYPE = "type";
            export const STAT = "stat";
        }

        export const GAIN_MOVEMENT_POINTS = "gain_movement_points";
        export const SPEED = "speed";
    }

}