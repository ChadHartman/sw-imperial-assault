namespace App.Game {

    export class Effect {

        public readonly type: Effect.Type;
        public readonly stat: Effect.Stat;

        constructor(effect: Model.IEffect) {
            this.type = Effect.Type[effect.type.toUpperCase()];
            if (this.type === undefined) {
                throw new Error(`Unknown type:${effect.type}`);
            }

            this.stat = Effect.Stat[effect.stat.toUpperCase()];
            if (this.stat === undefined) {
                throw new Error(`Unknown stat:${effect.stat}`);
            }
        }
    }

    export module Effect {
        export enum Stat {
            SPEED
        }

        export enum Type {
            GAIN_MOVEMENT_POINTS
        }
    }

}